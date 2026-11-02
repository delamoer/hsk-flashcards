"""课外阅读 (graded readers) xlsx → src/data/reading/{book}.json + reading/meta.json.

Run:  uv run --with openpyxl python3 scripts/convert_reading.py

One workbook = one book, named `{丛书}_{级别}_分级读物.xlsx` (see BOOKS). Sheets:
课文汇总 (one row per story, + 导读英文) · 段落对照 (one row per paragraph: 汉字/拼音/英文) · 生词 ·
语言点 · 想一想 · 练习 (判断正误 + 选择正确答案 with 选项A–D) · 小知识 · 说明 · 网站校对记录.
2B's pinyin is the book's own (OCR'd, then proofread); the other five books had none, so theirs was
written for the site (word-grouped, checked against pypinyin) — never regenerate either with a tool.
1A/2A/3A carry only 课文汇总 + 段落对照 (text only). 段落对照 may carry 说话人 (dialogue speaker) and
版式 (标题/诗/署名/书信/表格) columns; without 说话人 (2B) the speaker is guessed from a 「老板：」 prefix.
Every edit to the extracted text is logged in 网站校对记录; open doubts are in 待核对.
"""

import json
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "sources"
OUT = ROOT / "src" / "data" / "reading"

# filename → book record. `key` is the URL slug (/reading/:key/:n) and the JSON filename.
# color = accent color (same palette as the course series); band = difficulty label on the cover.
# The cover painting is src/assets/img/books/reading-{level}.webp (img.js readingCover; add the source
# painting to scripts/optimize_assets.py when adding a book).
def _book(level, title, title_en, color, band):
    return {"file": f"中文天天读_{level}_分级读物.xlsx", "key": f"tiantiandu-{level.lower()}", "title": title,
            "titleEn": title_en, "series": "中文天天读", "seriesEn": "Reading China", "level": level,
            "color": color, "band": band}


# shelf order = this order (the home row features the first book that has exercises)
BOOKS = [
    _book("1A", "爱上中国", "Falling in Love with China", "#3e5f8a", "入门"),
    _book("1B", "小马过河", "The Little Horse Crosses the River", "#2f8f7a", "入门"),
    _book("2A", "奇妙的中文", "Marvellous Chinese", "#6a4c93", "初级"),
    _book("2B", "自行车王国", "Bicycle Kingdom", "#6b7a32", "初级"),
    _book("3A", "8月8日，我们结婚", "We're Getting Married on August 8", "#c8433a", "中级"),
    _book("3B", "好一朵茉莉花", "What a Beautiful Jasmine Flower", "#bf7a2a", "中级"),
]

# 「老板：……」 opens a dialogue turn. A label containing 说/问/是/天 is narration or a heading
# (「盲人说：」「第一天：」), not a speaker.
SPEAKER = re.compile(r"^([^：:“”\"]{1,6})[：:](.+)$")
SPEAKER_PY = re.compile(r"^([^:：]{1,20})[:：]\s*(.+)$")
NOT_SPEAKER = re.compile(r"[说问是天]")


def rows(wb, name):
    """Rows of a sheet as dicts; a missing sheet is empty (1A/2A/3A carry only 课文汇总 + 段落对照)."""
    if name not in wb.sheetnames:
        return []
    it = wb[name].iter_rows(values_only=True)
    hdr = next(it)
    return [dict(zip(hdr, r)) for r in it if r and r[0] is not None]


def text(v):
    return str(v).strip() if v is not None else ""


# 版式 column → paragraph layout hint for the page
FMT = {"标题": "h", "诗": "poem", "署名": "sign", "书信": "salute", "表格": "table"}


def para(r):
    zh, py, en = text(r["汉字"]), text(r["拼音"]), text(r.get("英文"))
    if "说话人" not in r:  # 2B: no 说话人 column, guess from the 「老板：」 prefix
        d = split_para(zh, py, en)
    else:
        name = text(r["说话人"])
        d = {"zh": zh, "py": py, "en": en}
        if name:
            mp = SPEAKER_PY.match(py)
            d = {"name": name, "zh": re.sub(rf"^{re.escape(name)}[：:]\s*", "", zh), "py": mp.group(2).strip() if mp else py, "en": en}
    fmt = FMT.get(text(r.get("版式")))
    if fmt:
        d["fmt"] = fmt
    return d


def split_para(zh, py, en):
    m, mp = SPEAKER.match(zh), SPEAKER_PY.match(py)
    if m and mp and not NOT_SPEAKER.search(m.group(1)):
        return {"name": m.group(1), "zh": m.group(2).strip(), "py": mp.group(2).strip(), "en": en}
    return {"zh": zh, "py": py, "en": en}


def convert(book):
    wb = openpyxl.load_workbook(SRC / book["file"], read_only=True)
    L = {}
    for r in rows(wb, "课文汇总"):
        n = int(r["课次"])
        L[n] = {
            "n": n, "title": text(r["课文标题"]), "py": text(r["标题拼音"]), "en": text(r["英文标题"]),
            "chars": int(r["字数"]), "daodu": text(r.get("导读")), "daoduEn": text(r.get("导读英文")),
            "paras": [], "vocab": [], "points": [], "think": [], "tf": [], "mc": [], "tip": None,
        }
    for r in rows(wb, "段落对照"):
        L[int(r["课次"])]["paras"].append(para(r))
    for r in rows(wb, "生词"):
        L[int(r["课次"])]["vocab"].append({"w": text(r["生词"]), "py": text(r["拼音"]), "pos": text(r["词性"]), "en": text(r["英文释义"])})
    for r in rows(wb, "语言点"):
        L[int(r["课次"])]["points"].append({
            "name": text(r["句式/词"]), "en": text(r["英文释义"]), "eg": text(r["课文例句"]), "egEn": text(r["例句英译"]),
            "zh": text(r["讲解(中)"]), "enx": text(r["讲解(英)"]), "egs": [text(x) for x in (r["例句1"], r["例句2"]) if x],
        })
    for r in rows(wb, "想一想"):
        L[int(r["课次"])]["think"].append(text(r["问题"]))
    for r in rows(wb, "练习"):
        d = L[int(r["课次"])]
        if r["题型"] == "判断正误":
            d["tf"].append({"q": text(r["题目"]), "a": text(r["答案"]) == "√"})
        elif r["题型"] == "选择正确答案":
            opts = [text(r.get("选项" + x)) for x in "ABCD"]
            opts = opts[: max(i + 1 for i, o in enumerate(opts) if o)] if any(opts) else []  # 1B has 2–3 options
            if len(opts) < 2 or not all(opts):
                print(f"  ! {book['key']} 第{r['课次']}课选择题{r['题号']} 缺选项，跳过")
                continue
            d["mc"].append({"q": text(r["题目"]), "options": opts, "answer": "ABCD".index(text(r["答案"]))})
    for r in rows(wb, "小知识"):
        L[int(r["课次"])]["tip"] = {"title": text(r["小知识标题"]), "titleEn": text(r["英文标题"]), "zh": text(r["正文(中)"]), "en": text(r["正文(英)"])}

    lessons = [L[k] for k in sorted(L)]
    for l in lessons:
        miss = sum(1 for p in l["paras"] if not p["en"])
        if miss:
            print(f"  ! {book['key']} 第{l['n']}课 {miss} 段缺英文")
    data = {k: book[k] for k in ("key", "title", "titleEn", "series", "seriesEn", "level")}
    data["lessons"] = lessons
    (OUT / f"{book['key']}.json").write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    # meta = everything the shelf / home row needs, without loading the book
    meta = {k: book[k] for k in ("title", "titleEn", "series", "seriesEn", "level", "color", "band")}
    meta.update({
        "chars": sum(l["chars"] for l in lessons),
        "vocab": len({w["w"] for l in lessons for w in l["vocab"]}),
        "exercises": sum(len(l["mc"]) + len(l["tf"]) for l in lessons),
        "lessons": [{"n": l["n"], "title": l["title"], "en": l["en"], "chars": l["chars"], "vocab": len(l["vocab"])} for l in lessons],
    })
    print(f"{book['key']}: {len(lessons)} 篇, {sum(len(l['paras']) for l in lessons)} 段, {sum(len(l['mc']) + len(l['tf']) for l in lessons)} 题")
    return meta


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    meta = {}
    for book in BOOKS:
        if (SRC / book["file"]).exists():
            meta[book["key"]] = convert(book)
        else:
            print(f"  ! 找不到 {book['file']}，跳过")
    (OUT / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
