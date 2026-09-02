#!/usr/bin/env python3
"""Convert HSK and other course xlsx files into normalized JSON.

Run with uv (openpyxl provided on the fly):
    uv run --with openpyxl python3 scripts/convert.py

Output files: src/data/{series}-{unit}.json, each shaped as:
    {"series": "hsk", "unit": 1, "lessons": [{"num", "title", "titleEn", "words": [...]}]}
Each word:
    {"id", "num", "hanzi", "pinyin", "meaning", "type", "note", "examples":[{"zh","en"}]}

Adding a new course: add an entry to SOURCES and its titles to TITLES_EN.
"""
import json
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "data"

# Each source entry:
#   series    — course series ID (matches courses.js)
#   unit      — unit number within the series
#   file      — xlsx filename in repo root
#   sheet     — sheet name
#   col       — column mapping (0-indexed)
#     lesson      column index, or None if parsed from a compound key
#     lesson_key  column index of compound key like "2-1" (major-minor); lesson = major part
#     title       column index of lesson title
#     hanzi/pinyin/meaning/type/note — column indexes (None = not present)
#     ex          list of (zh_col, en_col) pairs for example sentences
SOURCES = [
    {
        "series": "hsk", "unit": 1,
        "file": "sources/HSK1_按课次词汇闪卡表.xlsx", "sheet": "HSK1词汇表",
        "col": {"lesson": 0, "lesson_key": None, "title": 1,
                "hanzi": 2, "pinyin": 3, "meaning": 4,
                "type": 5, "note": 6, "ex": [(7, 8), (9, 10)]},
    },
    {
        "series": "hsk", "unit": 2,
        "file": "sources/HSK2_按课次词汇闪卡表.xlsx", "sheet": "HSK2词汇表",
        "col": {"lesson": 1, "lesson_key": None, "title": 2,
                "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "series": "hsk", "unit": 3,
        "file": "sources/HSK3_按课次词汇闪卡表.xlsx", "sheet": "HSK3词汇表",
        "col": {"lesson": 1, "lesson_key": None, "title": 2,
                "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "series": "hsk", "unit": 4,
        "file": "sources/HSK4_按课次词汇闪卡表.xlsx", "sheet": "HSK4词汇表",
        "col": {"lesson": 1, "lesson_key": None, "title": 2,
                "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "series": "hsk", "unit": 5,
        "file": "sources/HSK5_按课次词汇闪卡表.xlsx", "sheet": "HSK5词汇表",
        "col": {"lesson": 1, "lesson_key": None, "title": 2,
                "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "series": "hsk", "unit": 6,
        "file": "sources/HSK6_第1-40课_完整词汇闪卡总表.xlsx", "sheet": "HSK6词汇表",
        "col": {"lesson": 1, "lesson_key": None, "title": 2,
                "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "series": "newhsk3", "unit": 1,
        "file": "sources/New_HSK3.0_HSK1_按课次词汇闪卡表.xlsx", "sheet": "HSK1词汇表",
        "col": {"lesson": 1, "lesson_key": None, "title": 2,
                "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "series": "newhsk3", "unit": 2,
        "file": "sources/New_HSK3.0_HSK2_按课次词汇闪卡表.xlsx", "sheet": "HSK2词汇表",
        "col": {"lesson": 1, "lesson_key": None, "title": 2,
                "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "series": "newhsk3", "unit": 3,
        "file": "sources/New_HSK3.0_HSK3_按课次词汇闪卡表.xlsx", "sheet": "HSK3词汇表",
        "col": {"lesson": 1, "lesson_key": None, "title": 2,
                "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "series": "huihua360", "unit": 1,
        "file": "sources/标准汉语会话360句1_按课次词汇闪卡表_HSK统一格式_含英文翻译.xlsx",
        "sheet": "360句1词汇表",
        # lesson_key col 1 holds "2-1" style codes; title col 2; no type column
        "col": {"lesson": None, "lesson_key": 1, "title": 2,
                "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "series": "huihua360", "unit": 2,
        "file": "sources/标准汉语会话360句2_按课次词汇闪卡表_HSK统一格式_含英文翻译.xlsx",
        "sheet": "360句2词汇表",
        "col": {"lesson": None, "lesson_key": 1, "title": 2,
                "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "series": "huihua360", "unit": 3,
        "file": "sources/标准汉语会话360句3_按课次词汇闪卡表.xlsx", "sheet": "词汇表",
        "col": {"lesson": 1, "lesson_key": None, "title": 2,
                "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "series": "huihua360", "unit": 4,
        "file": "sources/标准汉语会话360句4_按课次词汇闪卡表.xlsx", "sheet": "词汇表",
        "col": {"lesson": 1, "lesson_key": None, "title": 2,
                "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
]

# English lesson titles: {series: {unit: {lesson_num: "title"}}}
# HSK word IDs keep the legacy "h{unit}-l{lesson}-{idx}" prefix for backward compat.
TITLES_EN = {
    "hsk": {
        1: {
            1: "Hello", 2: "Thank You", 3: "What's Your Name?",
            4: "She Is My Chinese Teacher", 5: "Her Daughter Is Twenty This Year",
            6: "I Can Speak Chinese", 7: "What's the Date Today?",
            8: "I'd Like to Drink Tea", 9: "Where Does Your Son Work?",
            10: "May I Sit Here?", 11: "What Time Is It Now?",
            12: "How's the Weather Tomorrow?", 13: "He's Learning to Cook Chinese Food",
            14: "She Bought Quite a Few Clothes", 15: "I Came by Plane",
        },
        2: {
            1: "September Is the Best Time to Travel to Beijing",
            2: "I Get Up at Six Every Day",
            3: "The Red One on the Left Is Mine",
            4: "He Helped Me Find This Job",
            5: "Let's Just Buy This One",
            6: "Why Aren't You Eating?",
            7: "Is Your Home Far from the Office?",
            8: "Let Me Think and Tell You Later",
            9: "Too Many Questions, I Didn't Finish",
            10: "Stop Looking, the Phone Is on the Table",
            11: "He Is Three Years Older Than Me",
            12: "You're Wearing Too Little",
            13: "The Door Is Open",
            14: "Have You Seen That Movie?",
            15: "The New Year Is Coming",
        },
        3: {
            1: "What Are Your Plans for the Weekend?",
            2: "When Is He Coming Back?",
            3: "Many Drinks Are on the Table",
            4: "She Always Talks to Guests with a Smile",
            5: "I've Been Getting Fatter Lately",
            6: "Why Can't I Find It All of a Sudden?",
            7: "She and I Have Known Each Other for Five Years",
            8: "I'll Go Wherever You Go",
            9: "She Speaks Chinese as Well as a Native",
            10: "Math Is Much Harder Than History",
            11: "Don't Forget to Turn Off the Air Conditioner",
            12: "Leave the Important Things with Me",
            13: "I Walked Back",
            14: "Bring the Fruit Over",
            15: "Everything Else Is Fine",
            16: "I'm So Tired I Want to Sleep Right After Work",
            17: 'Everyone Has a Way to Cure Your "Illness"',
            18: "I Believe They Will Agree",
            19: "Couldn't You Tell?",
            20: "I Was Influenced by Him",
        },
        4: {
            1: "Simple Love", 2: "A True Friend",
            3: "The Manager Has a Good Impression of Me",
            4: "Don't Be Too Anxious to Make Money",
            5: "Buy What's Right, Not What's Expensive",
            6: "You Get What You Pay For",
            7: "The Best Doctor Is Yourself",
            8: "Life Doesn't Lack Beauty",
            9: "Sunshine Always Comes After the Storm",
            10: "The Standard of Happiness",
            11: "Reading Is Good, Read Good Books, Love Reading",
            12: "Discover the World with Your Heart",
            13: "Watching Peking Opera Over Tea",
            14: "Protect Mother Earth",
            15: "The Art of Raising Children",
            16: "Life Can Be Better",
            17: "Humans and Nature",
            18: "Technology and the World",
            19: "The Flavor of Life",
            20: "The Scenery Along the Way",
        },
        5: {
            1: "The Details of Love", 2: "Leave a Set of Keys for Your Parents",
            3: "Life Has Choices, Everything Can Change", 4: "Zilu Carrying Rice",
            5: "The Springs of Jinan", 6: "The Origin of New Year's Eve",
            7: "Two Chengyu Stories", 8: "Ancient and Modern Meanings of 'Capricious'",
            9: "A Different Lu Xun", 10: "The Miracle of Debate",
            11: "The Harm of Alarm Clocks", 12: "Overseas Users and WeChat",
            13: "Sawing Off the Bottom of Life's Basket",
            14: "Beijing's Courtyard Houses", 15: "Armchair Strategy",
            16: "Weight and Dieting", 17: "Leaving at the Best Moment",
            18: "Is Abstract Art Beautiful?", 19: "Hometown Radish Cakes",
            20: "The Comic Book Stand",
            21: "Uncle Hanzi: An American's Love of Chinese Characters",
            22: "Reading and Thinking", 23: "Let Go",
            24: "Teaching Support Initiative", 25: "Fill Yourself Up",
            26: "Which Kind of 'Busy' Are You?", 27: "Playing Chess",
            28: "The Most Popular Graduate", 29: "Nurturing Rivals",
            30: "Competition Makes Markets Healthier",
            31: "The Foot-in-the-Door Effect",
            32: "Environmental Protection Around Us",
            33: "Fighting Traffic — Smart Solutions",
            34: "Birds' Skincare Methods", 35: "Plants Can Sweat",
            36: "Lao She and Growing Flowers",
        },
        6: {
            1: "What Children Teach Us", 2: "A Parent's Love",
            3: "A Box of Mooncakes", 4: "A Perfect Victory",
            5: "Do You Need a Reason to Learn a Foreign Language?",
            6: "Being a Good Newcomer at Work", 7: "I'm in Charge of My Own Life",
            8: "Meeting My Former Self", 9: "Days Without a Phone",
            10: "Chinese Cuisine in a Globalized World",
            11: "What Does the Cat Do When I'm Away?",
            12: "We All Love White Noise",
            13: "Seeing the Changing World Through Travel Guides",
            14: "Filming the Arctic with a Rice Cooker on My Back",
            15: "Carvings on the Mountains",
            16: "Xu Jian and His Wildlife Photographers",
            17: "The Slow World in Small Animals' Eyes",
            18: "The Amazing Loofah", 19: "The Sunless Deep-Sea World",
            20: "The Golden Chicken Nest", 21: "The Store of the Future",
            22: "What Will Cars Look Like in 2050?", 23: "The Age of Big Data",
            24: "The Bizarre Experiences of Sports Stars",
            25: "Borrowing Arrows with Straw Boats", 26: "Strange Lights",
            27: "Returning the Jade Intact to Zhao",
            28: "Finding a Soulmate Through Music",
            29: 'A Memo on "Laughter"', 30: "Did You Sleep Well?",
            31: "The Science of Exercise", 32: "Sometimes It's OK to Be Sad",
            33: "Missing the Slow Life", 34: "The Man Born for Cultural Relics",
            35: "Exploring Woodblock New Year Paintings",
            36: "Ancient Chinese Academies", 37: "A Policeman's Story",
            38: "A Sharp Eye for Business Opportunities",
            39: "Life in the Internet Age",
            40: "Will Human Superpowers Change World Records?",
        },
    },
    "newhsk3": {
        1: {
            1: "Hello, AI Xiaoyu!", 2: "My Name Is Li Wen",
            3: "I Am Chinese", 4: "I Have Two Children",
            5: "I'm Off Today", 6: "What's Your Phone Number?",
            7: "I Get Off Work at 6:30 in the Evening",
            8: "My Dad Also Works at a Hospital",
            9: "I'll Study at School Tomorrow Morning",
            10: "The Apples Here Are So Cheap!",
            11: "I'm in College", 12: "It Snowed Yesterday",
            13: "Please Give Me a Cup of Tea", 14: "I Watched a Movie",
            15: "See You at Daxing Airport!",
        },
        2: {
            1: "She Treated Us to Peking Duck",
            2: "Let's Just Take a Taxi to Peking University",
            3: "I Want to Travel to Xi'an",
            4: "You Look Great in Red",
            5: "First Time Visiting a Chinese Friend's Home",
            6: "Happy Birthday, Xiaoxue!",
            7: "He Plays Basketball Very Well",
            8: "Even Though You Forgot, I Remember",
            9: "I'll Go Buy a Cup of Milk Tea",
            10: "The Exam Is Coming Up",
            11: "I Love Eating Chinese Food",
            12: "It's Much Colder Here Than in Beijing",
            13: "We Love Chinese Class",
            14: "How Boring to Spend New Year's Alone",
            15: "I Want to Visit China Once More",
        },
        3: {
            1: "We'll Pick You Up at the Airport",
            2: "Order Whatever You Want to Eat",
            3: "This Neighborhood Is Quite Nice",
            4: "This Hotel Is Different from the Others",
            5: "This Is How Photos Look Good",
            6: "You Can Even Order Takeout on the High-Speed Train",
            7: "That Skirt Looks Better Than the Shorts",
            8: "I Was Discharged from the Hospital Today",
            9: "It's OK If You Don't Play Well",
            10: "Return the Book to Me Tomorrow",
            11: "It Seems I Can't Solve This Problem",
            12: "The Weather Changes Fast This Season",
            13: "My New Neighbor Is from England",
            14: "This Book Was Borrowed by Someone Else",
            15: "I'm Half a Nanjing Native",
            16: "I Heard Some Pandas Went Abroad",
            17: "I Should Learn More from Serious People",
            18: "I Learned to Make Dumplings",
        },
    },
    "huihua360": {
        1: {
            1: "Hello!", 2: "Are You Hungry?", 3: "Where Are You From?",
            4: "What's Today's Date?", 5: "What Time Do You Get Off Work?",
            6: "How Many People Are in Your Family?",
            7: "How Much Is Watermelon per Jin?",
            8: "Excuse Me, Where Is the Restroom?",
        },
        2: {
            1: "What would you like to drink, please?",
            2: "How have Mom and Dad been?",
            3: "What hobbies do you have?",
            4: "Have you ever been to Shanghai?",
            5: "Where did you go on the weekend?",
            6: "What's the matter?",
            7: "I'm jogging",
            8: "It is so hot today!",
        },
        3: {
            1: "Is There a Supermarket Near the School?",
            2: "This One Is a Bit Big, Got a Smaller One?",
            3: "Look at These Specialty Dishes — Tasty and Cheap",
            4: "Have You Finished Choosing Your Courses?",
            5: "By Bus or Subway, Either Works",
            6: "He'll Stay in China for Three Weeks",
            7: "How Many Laps Have You Run?",
            8: "The Holiday Is Almost Here",
        },
        4: {
            1: "He's Wearing a White Shirt",
            2: "Let's Put the Table by the Window",
            3: "My Mom Keeps Praising You with a Smile",
            4: "My Bike Got Hit Right After I Left",
            5: "We Heard You Were Hospitalized — Everyone Cares",
            6: "Please Introduce Yourself First",
            7: "I Can't Move It Either",
            8: "Only by Persevering Can You Win!",
        },
    },
}

# Chinese title overrides — used when the xlsx contains placeholder text.
# Structure mirrors TITLES_EN: {series: {unit: {lesson_num: "title"}}}
TITLES_ZH = {
    "huihua360": {
        2: {
            1: "请问，您想喝点儿什么？",
            2: "爸妈身体怎么样？",
            3: "你有什么爱好？",
            4: "你去过上海吗？",
            5: "周末你去哪儿了？",
            6: "哪儿不舒服？",
            7: "我正在跑步呢",
            8: "今天天气真热！",
        },
    },
}

# Legacy ID prefix per series+unit — keeps existing localStorage progress intact.
def word_id_prefix(series, unit):
    if series == "hsk":
        return f"h{unit}"
    return f"{series}-{unit}"


def clean(v):
    if v is None:
        return None
    s = str(v).strip()
    return s or None


def classify_type(raw):
    if raw is None:
        return None
    s = str(raw).lower()
    if "core" in s:
        return "core"
    if "supplement" in s or "补充" in s:
        return "supplement"
    return None


def parse_lesson_num(row, col):
    """Return (lesson_num, raw_title_from_lesson_key_col_if_applicable)."""
    if col["lesson"] is not None:
        v = row[col["lesson"]]
        return (int(v) if v is not None else None), None
    # compound key like "2-1" — use the major (first) number
    key = row[col["lesson_key"]]
    if key is None:
        return None, None
    major = int(str(key).split("-")[0])
    return major, None


def convert(src):
    wb = openpyxl.load_workbook(ROOT / src["file"], read_only=True)
    ws = wb[src["sheet"]]
    col = src["col"]
    series, unit = src["series"], src["unit"]
    id_prefix = word_id_prefix(series, unit)
    rows = list(ws.iter_rows(values_only=True))[1:]  # skip header

    lessons = {}
    order = []
    for r in rows:
        ln, _ = parse_lesson_num(r, col)
        if ln is None:
            continue
        if ln not in lessons:
            lessons[ln] = {
                "num": ln,
                "title": TITLES_ZH.get(series, {}).get(unit, {}).get(ln) or clean(r[col["title"]]),
                "titleEn": TITLES_EN.get(series, {}).get(unit, {}).get(ln, ""),
                "words": [],
            }
            order.append(ln)
        idx = len(lessons[ln]["words"]) + 1
        examples = []
        for zh_i, en_i in col["ex"]:
            zh, en = clean(r[zh_i]), clean(r[en_i])
            if zh:
                examples.append({"zh": zh, "en": en or ""})
        word = {
            "id": f"{id_prefix}-l{ln}-{idx}",
            "num": idx,
            "hanzi": clean(r[col["hanzi"]]),
            "pinyin": clean(r[col["pinyin"]]),
            "meaning": clean(r[col["meaning"]]),
            "type": classify_type(r[col["type"]]) if col["type"] is not None else None,
            "note": clean(r[col["note"]]) if col["note"] is not None else None,
            "examples": examples,
        }
        lessons[ln]["words"].append(word)

    data = {"series": series, "unit": unit, "lessons": [lessons[n] for n in order]}
    total = sum(len(l["words"]) for l in data["lessons"])
    return data, total


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    summary = []
    for src in SOURCES:
        data, total = convert(src)
        path = OUT / f"{src['series']}-{src['unit']}.json"
        path.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        missing_en = [l["num"] for l in data["lessons"] if not l["titleEn"]]
        summary.append((src["series"], src["unit"], len(data["lessons"]), total, missing_en, path))

    print("Converted:")
    for series, unit, nl, nw, miss, path in summary:
        warn = f"  ⚠ missing EN titles for lessons {miss}" if miss else ""
        print(f"  {series}-{unit}: {nl} lessons, {nw} words → {path.relative_to(ROOT)}{warn}")


if __name__ == "__main__":
    main()
