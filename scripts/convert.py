#!/usr/bin/env python3
"""Convert the three HSK flashcard xlsx files into normalized JSON.

Run with uv (openpyxl provided on the fly):
    uv run --with openpyxl python3 scripts/convert.py

Source of truth = the xlsx files in the project root.
English lesson titles live in TITLES_EN below (the xlsx has Chinese titles only).
Output = src/data/hsk1.json / hsk2.json / hsk3.json, each shaped as:
    {"level": 1, "lessons": [{"num", "title", "titleEn", "words": [ ... ]}]}
Each word:
    {"id", "num", "hanzi", "pinyin", "meaning", "type", "note", "examples":[{"zh","en"}]}
"""
import json
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "data"

# (file, sheet, layout) — layout maps column indexes.
# layout keys: lesson, title, hanzi, pinyin, meaning, type, note, ex(list of (zh,en) index pairs)
SOURCES = [
    {
        "file": "HSK1_按课次词汇闪卡表.xlsx", "sheet": "HSK1词汇表", "level": 1,
        "col": {"lesson": 0, "title": 1, "hanzi": 2, "pinyin": 3, "meaning": 4,
                "type": 5, "note": 6, "ex": [(7, 8), (9, 10)]},
    },
    {
        "file": "HSK2_按课次词汇闪卡表.xlsx", "sheet": "HSK2词汇表", "level": 2,
        "col": {"lesson": 1, "title": 2, "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "file": "HSK3_按课次词汇闪卡表.xlsx", "sheet": "HSK3词汇表", "level": 3,
        "col": {"lesson": 1, "title": 2, "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
    {
        "file": "HSK4_按课次词汇闪卡表.xlsx", "sheet": "HSK4词汇表", "level": 4,
        "col": {"lesson": 1, "title": 2, "hanzi": 3, "pinyin": 4, "meaning": 5,
                "type": None, "note": 10, "ex": [(6, 7), (8, 9)]},
    },
]

TITLES_EN = {
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
        1: "September Is the Best Time to Travel to Beijing", 2: "I Get Up at Six Every Day",
        3: "The Red One on the Left Is Mine", 4: "He Helped Me Find This Job",
        5: "Let's Just Buy This One", 6: "Why Aren't You Eating?",
        7: "Is Your Home Far from the Office?", 8: "Let Me Think and Tell You Later",
        9: "Too Many Questions, I Didn't Finish", 10: "Stop Looking, the Phone Is on the Table",
        11: "He Is Three Years Older Than Me", 12: "You're Wearing Too Little",
        13: "The Door Is Open", 14: "Have You Seen That Movie?", 15: "The New Year Is Coming",
    },
    3: {
        1: "What Are Your Plans for the Weekend?", 2: "When Is He Coming Back?",
        3: "Many Drinks Are on the Table", 4: "She Always Talks to Guests with a Smile",
        5: "I've Been Getting Fatter Lately", 6: "Why Can't I Find It All of a Sudden?",
        7: "She and I Have Known Each Other for Five Years", 8: "I'll Go Wherever You Go",
        9: "She Speaks Chinese as Well as a Native", 10: "Math Is Much Harder Than History",
        11: "Don't Forget to Turn Off the Air Conditioner", 12: "Leave the Important Things with Me",
        13: "I Walked Back", 14: "Bring the Fruit Over", 15: "Everything Else Is Fine",
        16: "I'm So Tired I Want to Sleep Right After Work",
        17: 'Everyone Has a Way to Cure Your "Illness"', 18: "I Believe They Will Agree",
        19: "Couldn't You Tell?", 20: "I Was Influenced by Him",
    },
    4: {
        1: "Simple Love", 2: "A True Friend", 3: "The Manager Has a Good Impression of Me",
        4: "Don't Be Too Anxious to Make Money", 5: "Buy What's Right, Not What's Expensive",
        6: "You Get What You Pay For", 7: "The Best Doctor Is Yourself",
        8: "Life Doesn't Lack Beauty", 9: "Sunshine Always Comes After the Storm",
        10: "The Standard of Happiness", 11: "Reading Is Good, Read Good Books, Love Reading",
        12: "Discover the World with Your Heart", 13: "Watching Peking Opera Over Tea",
        14: "Protect Mother Earth", 15: "The Art of Raising Children",
        16: "Life Can Be Better", 17: "Humans and Nature", 18: "Technology and the World",
        19: "The Flavor of Life", 20: "The Scenery Along the Way",
    },
}


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


def convert(src):
    wb = openpyxl.load_workbook(ROOT / src["file"], read_only=True)
    ws = wb[src["sheet"]]
    col = src["col"]
    level = src["level"]
    rows = list(ws.iter_rows(values_only=True))[1:]  # skip header

    lessons = {}
    order = []
    for r in rows:
        ln = r[col["lesson"]]
        if ln is None:
            continue
        ln = int(ln)
        if ln not in lessons:
            lessons[ln] = {
                "num": ln,
                "title": clean(r[col["title"]]),
                "titleEn": TITLES_EN.get(level, {}).get(ln, ""),
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
            "id": f"h{level}-l{ln}-{idx}",
            "num": idx,
            "hanzi": clean(r[col["hanzi"]]),
            "pinyin": clean(r[col["pinyin"]]),
            "meaning": clean(r[col["meaning"]]),
            "type": classify_type(r[col["type"]]) if col["type"] is not None else None,
            "note": clean(r[col["note"]]) if col["note"] is not None else None,
            "examples": examples,
        }
        lessons[ln]["words"].append(word)

    data = {"level": level, "lessons": [lessons[n] for n in order]}
    total = sum(len(l["words"]) for l in data["lessons"])
    return data, total


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    summary = []
    for src in SOURCES:
        data, total = convert(src)
        path = OUT / f"hsk{src['level']}.json"
        path.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        missing_en = [l["num"] for l in data["lessons"] if not l["titleEn"]]
        summary.append((src["level"], len(data["lessons"]), total, missing_en, path))

    print("Converted:")
    for lv, nl, nw, miss, path in summary:
        warn = f"  ⚠ missing EN titles for lessons {miss}" if miss else ""
        print(f"  HSK{lv}: {nl} lessons, {nw} words -> {path.relative_to(ROOT)}{warn}")


if __name__ == "__main__":
    main()
