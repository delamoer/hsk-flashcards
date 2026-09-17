#!/usr/bin/env python3
"""Convert the 逐篇课文双重挖空 xlsx files into per-unit JSON for the 课文 section.

Run with uv (openpyxl provided on the fly):
    uv run --with openpyxl python3 scripts/convert_texts.py

Sources: sources/{新版|旧版}HSK{1,2,3}_逐篇课文双重挖空练习_*.xlsx
  新版 → series "newhsk3", 旧版 → series "hsk" (same taxonomy as the flashcard courses).

Output (kept in a subfolder so the flashcard glob `./*-*.json` never picks it up):
  src/data/texts/{series}-{unit}.json
  src/data/texts/meta.json     {"{series}-{unit}": {lessonCount, textCount}}

Each text carries TWO cloze layers ("双重挖空"):
  vocab   — word-level: numbered blanks （1）____, filled from a word bank
  grammar — sentence-level: one blank spanning a whole clause, rebuilt by
            arranging shuffled word tiles (连词成句). The word segmentation is
            NOT auto-generated: it's a hand-vetted table in
            scripts/grammar_segments.tsv (edit that, not this script).
"""
import json
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "data" / "texts"
DATA = ROOT / "src" / "data"
SEG_FILE = ROOT / "scripts" / "grammar_segments.tsv"
MAX_WORD = 6  # longest word to try in max-match segmentation

# (filename, series, unit) — teacher sheet "教师答案版" is the complete one.
SOURCES = [
    ("旧版HSK1_逐篇课文双重挖空练习_原文精校版.xlsx", "hsk", 1),
    ("旧版HSK2_逐篇课文双重挖空练习_原文版.xlsx", "hsk", 2),
    ("旧版HSK3_逐篇课文双重挖空练习_原文精校版.xlsx", "hsk", 3),
    ("新版HSK1_逐篇课文双重挖空练习_原文精校版.xlsx", "newhsk3", 1),
    ("新版HSK2_逐篇课文双重挖空练习_原文精校版.xlsx", "newhsk3", 2),
    ("新版HSK3_逐篇课文双重挖空练习_原文精校版.xlsx", "newhsk3", 3),
]

SHEET = "教师答案版"
# Column indices (0-based) in the teacher sheet.
C_LESSON, C_NAME, C_TITLE, C_ORIG = 1, 2, 3, 4
C_VCLOZE, C_VANS, C_GCLOZE, C_GANS, C_NOTE = 5, 6, 7, 8, 9

PUNCT = set("，。！？、；：""''（）()《》…—,.!?;: 　\t\n")

VOCAB_BLANK = re.compile(r"[（(]\s*(\d+)\s*[）)]_*")
UNDERSCORES = re.compile(r"_+")


def load_segments() -> dict:
    seg = {}
    if SEG_FILE.exists():
        for line in SEG_FILE.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            clause, toks = line.split("\t", 1)
            seg[clause] = [t for t in toks.split(" ") if t.strip()]
    return seg


def load_lexicon(segmap: dict) -> set:
    """Word list for 连词成句 segmentation, built from the app's OWN vocabulary:
    every flashcard word (src/data/{series}-{unit}.json) + every hand-vetted
    grammar-sentence token. Using the taught vocabulary as the lexicon keeps the
    tile boundaries pedagogically aligned and needs no jieba."""
    lex = set()
    for f in DATA.glob("*-*.json"):  # flashcard unit files (texts/ excluded — subdir)
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(d, dict) or "lessons" not in d:
            continue
        for lesson in d["lessons"]:
            for w in lesson["words"]:
                h = (w.get("hanzi") or "").strip()
                if len(h) >= 2:
                    lex.add(h)
    for toks in segmap.values():
        for t in toks:
            if len(t) >= 2:
                lex.add(t)
    return lex


def segment_sentence(text: str, lex: set) -> list:
    """Greedy longest-match word segmentation over `lex`; punctuation is dropped
    (it's not tiled in 连词成句). Unknown runs fall back to single characters."""
    toks = []
    i, n = 0, len(text)
    while i < n:
        ch = text[i]
        if ch in PUNCT:
            i += 1
            continue
        matched = None
        for L in range(min(MAX_WORD, n - i), 1, -1):
            if text[i:i + L] in lex:
                matched = text[i:i + L]
                break
        if matched:
            toks.append(matched)
            i += len(matched)
        else:
            toks.append(ch)
            i += 1
    return toks


def clean(v):
    if v is None:
        return None
    s = str(v).replace("\r\n", "\n").strip()
    return s or None


def parse_vocab(cloze: str, ans: str):
    """Split a numbered-blank cloze into segments + an ordered answer list."""
    if not cloze:
        return None
    seg = []
    pos = 0
    max_n = 0
    for m in VOCAB_BLANK.finditer(cloze):
        if m.start() > pos:
            seg.append({"t": cloze[pos:m.start()]})
        n = int(m.group(1))
        max_n = max(max_n, n)
        seg.append({"b": n})
        pos = m.end()
    if pos < len(cloze):
        seg.append({"t": cloze[pos:]})
    if max_n == 0:
        return None  # no blanks parsed — treat as plain text elsewhere

    answers = [""] * max_n
    for part in re.split(r"[；;\n]", ans or ""):
        part = part.strip()
        mm = re.match(r"^(\d+)\s*[\.、\．]?\s*(.+)$", part)
        if mm:
            idx = int(mm.group(1)) - 1
            if 0 <= idx < max_n:
                answers[idx] = mm.group(2).strip()
    return {"seg": seg, "answers": answers}


def strip_punct(tokens):
    return [t for t in tokens if t and t not in PUNCT]


def parse_grammar(cloze: str, ans: str, segmap: dict):
    """One blank spanning a clause → before/after text + answer + word tiles."""
    if not ans:
        return None
    answer = ans.strip()
    tokens = segmap.get(answer)
    if tokens is None:
        # Fallback (should be rare): character-level split, minus punctuation.
        tokens = [c for c in answer]
    tokens = strip_punct(tokens)

    before, after = "", ""
    if cloze:
        runs = list(UNDERSCORES.finditer(cloze))
        if runs:
            before = cloze[: runs[0].start()]
            after = cloze[runs[-1].end():]
    return {"before": before, "after": after, "answer": answer, "tokens": tokens}


SPEAKER_RE = re.compile(r"^([^：:]{1,8})[：:](.*)$")


def build_sentences(original: str, segmap: dict, lex: set):
    """Split the whole dialogue into per-line 连词成句 items: each line's speech
    tokenized (hand-vetted table wins when the line matches a grammar clause,
    else dictionary max-match). Lines that yield <2 tiles are dropped (trivial)."""
    out = []
    for raw in (original or "").split("\n"):
        line = raw.strip()
        if not line:
            continue
        m = SPEAKER_RE.match(line)
        speaker = m.group(1) if m else ""
        speech = (m.group(2).strip() if m else line)
        if not speech:
            continue
        toks = segmap.get(speech) or segment_sentence(speech, lex)
        toks = strip_punct(toks)
        if len(toks) < 2:
            continue
        out.append({"speaker": speaker, "text": speech, "tokens": toks})
    return out


def convert(fname, series, unit, segmap, lex):
    wb = openpyxl.load_workbook(ROOT / "sources" / fname, read_only=True, data_only=True)
    ws = wb[SHEET]
    rows = list(ws.iter_rows(values_only=True))
    hi = next(i for i, r in enumerate(rows) if r and r[0] == "序号")

    lessons = {}
    order = []
    for r in rows[hi + 1:]:
        if not r or r[C_LESSON] is None:
            continue
        ln = int(r[C_LESSON])
        if ln not in lessons:
            lessons[ln] = {"num": ln, "name": clean(r[C_NAME]) or "", "texts": []}
            order.append(ln)
        vocab = parse_vocab(clean(r[C_VCLOZE]), clean(r[C_VANS]))
        # augment the lexicon with this text's own vocab answers so they tile whole
        seg_lex = lex
        if vocab:
            extra = {a for a in vocab["answers"] if len(a) >= 2}
            if extra:
                seg_lex = lex | extra
        original = clean(r[C_ORIG]) or ""
        lessons[ln]["texts"].append({
            "n": len(lessons[ln]["texts"]) + 1,
            "title": clean(r[C_TITLE]) or f"课文{len(lessons[ln]['texts']) + 1}",
            "original": original,
            "vocab": vocab,
            "grammar": parse_grammar(clean(r[C_GCLOZE]), clean(r[C_GANS]), segmap),
            "sentences": build_sentences(original, segmap, seg_lex),
            "note": clean(r[C_NOTE]) or "",
        })

    data = {"series": series, "unit": unit, "lessons": [lessons[n] for n in order]}
    n_texts = sum(len(l["texts"]) for l in data["lessons"])
    return data, len(order), n_texts


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    segmap = load_segments()
    lex = load_lexicon(segmap)
    meta = {}
    print(f"Segmentation table: {len(segmap)} clauses · lexicon: {len(lex)} words")
    print("Converted 课文:")
    for fname, series, unit, in SOURCES:
        data, n_lessons, n_texts = convert(fname, series, unit, segmap, lex)
        key = f"{series}-{unit}"
        (OUT / f"{key}.json").write_text(
            json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8"
        )
        meta[key] = {"lessonCount": n_lessons, "textCount": n_texts}
        print(f"  {key}: {n_lessons} lessons, {n_texts} texts  ← {fname}")

    (OUT / "meta.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print(f"  meta → {(OUT / 'meta.json').relative_to(ROOT)} ({len(meta)} units)")


if __name__ == "__main__":
    main()
