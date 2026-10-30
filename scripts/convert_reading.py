"""课外阅读 (graded readers) xlsx → src/data/reading/{book}.json + reading/meta.json.

Run:  uv run --with openpyxl python3 scripts/convert_reading.py

One workbook = one book, named `{丛书}_{级别}_分级读物.xlsx` (see BOOKS). Sheets:
课文汇总 (one row per story, + 导读英文) · 段落对照 (one row per paragraph: 汉字/拼音/英文) · 生词 ·
语言点 · 想一想 · 练习 (判断正误 + 选择正确答案 with 选项A–D) · 小知识 · 说明 · 网站校对记录.
The pinyin is the book's own (OCR'd, then proofread — see 网站校对记录); never regenerate it.
"""

import json
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "sources"
OUT = ROOT / "src" / "data" / "reading"

# filename → book record. `key` is the URL slug (/reading/:key/:n) and the JSON filename.
BOOKS = [
    {
        "file": "中文天天读_2B_分级读物.xlsx",
        "key": "tiantiandu-2b",
        "title": "自行车王国",
        "titleEn": "Bicycle Kingdom",
        "series": "中文天天读",
        "seriesEn": "Reading China",
        "level": "2B",
    },
]

# 「老板：……」 opens a dialogue turn. A label containing 说/问/是/天 is narration or a heading
# (「盲人说：」「第一天：」), not a speaker.
SPEAKER = re.compile(r"^([^：:“”\"]{1,6})[：:](.+)$")
SPEAKER_PY = re.compile(r"^([^:：]{1,20})[:：]\s*(.+)$")
NOT_SPEAKER = re.compile(r"[说问是天]")


def rows(wb, name):
    it = wb[name].iter_rows(values_only=True)
    hdr = next(it)
    return [dict(zip(hdr, r)) for r in it if r and r[0] is not None]


def text(v):
    return str(v).strip() if v is not None else ""


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
            "chars": int(r["字数"]), "daodu": text(r["导读"]), "daoduEn": text(r.get("导读英文")),
            "paras": [], "vocab": [], "points": [], "think": [], "tf": [], "mc": [], "tip": None,
        }
    for r in rows(wb, "段落对照"):
        L[int(r["课次"])]["paras"].append(split_para(text(r["汉字"]), text(r["拼音"]), text(r.get("英文"))))
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
            if not all(opts):
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
    meta = {k: book[k] for k in ("title", "titleEn", "series", "seriesEn", "level")}
    meta.update({
        "chars": sum(l["chars"] for l in lessons),
        "vocab": len({w["w"] for l in lessons for w in l["vocab"]}),
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
