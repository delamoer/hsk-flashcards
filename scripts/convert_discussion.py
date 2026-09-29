#!/usr/bin/env python3
"""聊天问题 → src/data/discussion/{series}-{unit}.json (+ discussion/meta.json).

Source of truth: the thirteen `sources/*_聊天问题.xlsx` files. Each row is ONE
课文 (or, for hsk-5, one 主课文) and carries three open-ended questions that move the
class from the text's topic to the student's own life. Grouped by 课次 (= our lesson
`num`) and emitted as one lazy-loaded chunk per unit, mirroring convert_grammar.py.

Deliberately NOT exported: the 「教学提示」 column — it is written for the teacher
("不询问学生私人婚姻计划…") and must not reach the student UI.

英文 is not in the source and is not generated; 拼音 is auto-generated with pypinyin
(same approach as 会话360 句3/4 in convert_360.py).

Run:  uv run --with openpyxl --with pypinyin python3 scripts/convert_discussion.py
"""
import glob
import json
import os
import re

import openpyxl
from pypinyin import Style, pinyin

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "src", "data", "discussion")

CN_VOL = {"一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6}

SHEET = "课文聊天问题"
# 课文顺序 like 「课文4（短文）」/「主课文（每课1篇）」→ title + kind
ORDER_RE = re.compile(r"^([^（(]+)\s*[（(]([^）)]*)[）)]\s*$")


def parse_target(path):
    """filename → (series, unit).  None if unrecognized."""
    base = os.path.basename(path)
    m = re.match(r"HSK(\d)_聊天问题", base)
    if m:
        return ("hsk", int(m.group(1)))
    m = re.match(r"新HSK3\.0_第([一二三四五六])册[A-Z]?_聊天问题", base)
    if m:
        return ("newhsk3", CN_VOL[m.group(1)])
    # An unrecognized name is silently skipped, which is easy to miss — keep the
    # sources/ naming convention ({系列}_{册}_{类型}.xlsx) when adding a book.
    m = re.match(r"标准汉语会话360句(\d)_聊天问题", base)
    if m:
        return ("huihua360", int(m.group(1)))
    return None


def s(v):
    return str(v).strip() if v is not None else ""


def to_pinyin(text):
    """Tone-marked pinyin for a question — syllables space-joined, punctuation attached
    without a leading space. Same format as convert_360.to_pinyin (句3/4)."""
    out = ""
    for grp in pinyin(text, style=Style.TONE, errors=lambda s: list(s)):
        syl = grp[0]
        if re.search(r"[A-Za-zɡü]", syl):  # a syllable (or latin/digit) → space-separated
            out += ((" " if out and not out.endswith(" ") else "") + syl)
        else:  # punctuation / untranslatable → attach
            out += syl
    return out.strip()


def header_row(rows):
    """These sheets carry a title + blurb + blank line before the real header."""
    for i, r in enumerate(rows):
        if sum(1 for c in r if c not in (None, "")) >= 4 and "课次" in [s(c) for c in r]:
            return i
    return None


def col_index(header):
    idx = {s(h): i for i, h in enumerate(header) if h}

    def find(*names):
        for n in names:
            if n in idx:
                return idx[n]
        return None

    return {
        "num": find("课次"),
        "name": find("课名", "课名 / 课文"),
        "order": find("课文顺序"),
        "kind": find("课文类型"),
        "topic": find("课文话题（教师用）", "课文场景 / 话题（教师用）"),
        "q": [find(f"生活化问题{k}") for k in (1, 2, 3)],
        "hints": find("可追问方向"),
        "vol": find("册别"),
        "group": find("单元"),
        # 教学提示 is intentionally not mapped — teacher-only, never exported.
    }


def split_order(v):
    """「课文4（短文）」→ ("课文4", "短文")；「课文1」→ ("课文1", "")"""
    v = s(v)
    m = ORDER_RE.match(v)
    return (m.group(1).strip(), m.group(2).strip()) if m else (v, "")


def convert_file(path):
    target = parse_target(path)
    if not target:
        print("  !! skip (unrecognized name):", os.path.basename(path))
        return None
    series, unit = target
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb[SHEET] if SHEET in wb.sheetnames else wb.worksheets[0]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    hi = header_row(rows)
    if hi is None:
        print("  !! skip (no header):", os.path.basename(path))
        return None
    c = col_index(rows[hi])

    lessons = {}
    for r in rows[hi + 1:]:
        if not r or c["num"] is None or r[c["num"]] is None:
            continue
        try:
            num = int(r[c["num"]])  # trailing 说明 rows carry URLs here → skipped
        except (TypeError, ValueError):
            continue

        questions = []
        for qi in c["q"]:
            q = s(r[qi]) if qi is not None else ""
            if q:
                questions.append({"zh": q, "py": to_pinyin(q)})
        if not questions:
            continue

        title, kind = split_order(r[c["order"]] if c["order"] is not None else "")
        if c["kind"] is not None and s(r[c["kind"]]):
            kind = s(r[c["kind"]])
        hints = []
        if c["hints"] is not None and s(r[c["hints"]]):
            hints = [h.strip() for h in re.split(r"[｜|/、]", s(r[c["hints"]])) if h.strip()]

        text = {"title": title, "questions": questions}
        if kind:
            text["kind"] = kind
        if c["topic"] is not None and s(r[c["topic"]]):
            text["topic"] = s(r[c["topic"]])
        if hints:
            text["hints"] = hints

        L = lessons.setdefault(num, {"num": num, "name": "", "texts": []})
        if not L["name"] and c["name"] is not None:
            L["name"] = s(r[c["name"]])
        for key in ("vol", "group"):
            ci = c[key]
            if ci is not None and s(r[ci]) and key not in L:
                L[key] = s(r[ci])
        L["texts"].append(text)

    ordered = [lessons[n] for n in sorted(lessons)]
    n_texts = sum(len(l["texts"]) for l in ordered)
    n_q = sum(len(t["questions"]) for l in ordered for t in l["texts"])
    data = {"series": series, "unit": unit, "lessons": ordered}
    return (
        f"{series}-{unit}",
        data,
        {"lessonCount": len(ordered), "textCount": n_texts, "questionCount": n_q},
    )


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    files = sorted(glob.glob(os.path.join(ROOT, "sources", "*_聊天问题.xlsx")))
    meta = {}
    total_q = 0
    print("Converted 话题讨论:")
    for f in files:
        res = convert_file(f)
        if not res:
            continue
        key, data, m = res
        with open(os.path.join(OUT_DIR, f"{key}.json"), "w", encoding="utf-8") as fh:
            json.dump(data, fh, ensure_ascii=False, separators=(",", ":"))
        meta[key] = m
        total_q += m["questionCount"]
        print(f"  ✓ {key}: {m['lessonCount']} 课, {m['textCount']} 篇, {m['questionCount']} 问")
    with open(os.path.join(OUT_DIR, "meta.json"), "w", encoding="utf-8") as fh:
        json.dump(meta, fh, ensure_ascii=False, indent=0)
    print(f"共 {len(meta)} 册, {total_q} 问 → {OUT_DIR}")


if __name__ == "__main__":
    main()
