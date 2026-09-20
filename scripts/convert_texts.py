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
GLOSS_FILE = ROOT / "scripts" / "text_gloss.tsv"
WORD_GLOSS_FILE = ROOT / "scripts" / "word_gloss.tsv"
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


def load_gloss() -> dict:
    """Hand-authored pinyin + English per dialogue line (scripts/text_gloss.tsv).
    Keyed by the exact speech text (speaker stripped) — same key the reader shows
    and gen_audio speaks. Lines absent here simply carry no py/en (front-end hides
    the row). Edit the TSV, not the generated JSON."""
    gloss = {}
    if GLOSS_FILE.exists():
        for line in GLOSS_FILE.read_text(encoding="utf-8").splitlines():
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            parts = line.split("\t")
            if len(parts) < 3:
                continue
            zh, py, en = parts[0], parts[1].strip(), parts[2].strip()
            gloss[zh] = {"py": py, "en": en}
    return gloss


def load_word_map() -> dict:
    """hanzi -> {py, en} for the 生词挖空 word-bank tiles. Built from EVERY
    flashcard word (all units), so a cloze answer taught in any lesson shows its
    pinyin + English. scripts/word_gloss.tsv hand-fills the few answers that
    aren't standalone flashcard entries (compounds, single chars, phrases)."""
    m = {}
    for f in DATA.glob("*-*.json"):  # flashcard unit files (texts/ is a subdir)
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(d, dict) or "lessons" not in d:
            continue
        for lesson in d["lessons"]:
            for w in lesson["words"]:
                h = (w.get("hanzi") or "").strip()
                if h and h not in m:
                    m[h] = {"py": w.get("pinyin") or "", "en": w.get("meaning") or ""}
    if WORD_GLOSS_FILE.exists():  # hand overrides/supplements win
        for line in WORD_GLOSS_FILE.read_text(encoding="utf-8").splitlines():
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            parts = line.split("\t")
            if len(parts) < 3:
                continue
            m[parts[0]] = {"py": parts[1].strip(), "en": parts[2].strip()}
    return m


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


def heal_name_blanks(vocab):
    """Never blank the speaker name. The source cloze blanks the FIRST occurrence
    of each answer word, which sometimes lands inside a speaker name (王一[雪]：,
    周[太太]：, [老]同学：). For every blank that falls in a speaker-name prefix
    (before a short ≤8-char colon), un-blank it there; if the same word also occurs
    in the speech body, move the blank to that occurrence, otherwise drop the blank
    entirely (the word is only ever a name — nothing to practise). Blanks are then
    renumbered in reading order. Returns a new vocab dict, or None if no blanks
    survive."""
    seg, answers = vocab["seg"], vocab["answers"]
    atoms = []
    for p in seg:
        if "t" in p:
            atoms += [{"c": ch} for ch in p["t"]]
        else:
            a = answers[p["b"] - 1] if p["b"] - 1 < len(answers) else ""
            atoms.append({"blank": True, "answer": a})

    # Per-line: mark the speaker-name region (before a short colon) and the body.
    lines = [[]]
    for at in atoms:
        (lines.append([]) if at.get("c") == "\n" else lines[-1].append(at))
    for line in lines:
        colon = next((i for i, at in enumerate(line) if at.get("c") in ("：", ":")), None)
        if colon is None:
            for at in line:
                at["inbody"] = True
            continue
        pref = sum(1 if "c" in at else (len(at["answer"] or " ") or 1) for at in line[:colon])
        if pref > 8:  # colon is mid-sentence (narrative), not a speaker delimiter
            for at in line:
                at["inbody"] = True
            continue
        for i, at in enumerate(line):
            at["inbody"] = i > colon
            if i < colon and at.get("blank"):
                at["name"] = True

    body_text = "".join(
        (at["answer"] if at.get("blank") else at["c"])
        for at in atoms
        if at.get("c") != "\n" and at.get("inbody")
    )

    # Un-blank name blanks (restore the word as plain chars); queue relocations.
    out, reloc = [], []
    for at in atoms:
        if at.get("blank") and at.get("name"):
            out += [{"c": ch, "inbody": False} for ch in at["answer"]]
            if at["answer"] and at["answer"] in body_text:
                reloc.append(at["answer"])
        else:
            out.append(at)
    atoms = out

    # Relocate: blank the first body occurrence (a contiguous run of body chars).
    for a in reloc:
        n = len(a)
        pos = [i for i, at in enumerate(atoms) if at.get("inbody") and "c" in at]
        for k in range(len(pos) - n + 1):
            idxs = pos[k:k + n]
            if idxs == list(range(idxs[0], idxs[0] + n)) and "".join(atoms[j]["c"] for j in idxs) == a:
                atoms = atoms[:idxs[0]] + [{"blank": True, "answer": a}] + atoms[idxs[-1] + 1:]
                break

    # Rebuild seg with blanks renumbered in reading order.
    seg_out, ans_out, buf, num = [], [], [], 0
    for at in atoms:
        if at.get("blank"):
            if buf:
                seg_out.append({"t": "".join(buf)})
                buf = []
            num += 1
            seg_out.append({"b": num})
            ans_out.append(at["answer"])
        else:
            buf.append(at["c"])
    if buf:
        seg_out.append({"t": "".join(buf)})
    if num == 0:
        return None
    return {"seg": seg_out, "answers": ans_out}


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


def build_lines(original: str, gloss: dict):
    """Per-line reading view: speaker + speech + hand-authored pinyin/English.
    Derived from `original` so the source stays the single dialogue string."""
    out = []
    for raw in (original or "").split("\n"):
        line = raw.strip()
        if not line:
            continue
        m = SPEAKER_RE.match(line)
        name = m.group(1) if m else ""
        speech = (m.group(2).strip() if m else line)
        g = gloss.get(speech, {})
        out.append({"name": name, "zh": speech, "py": g.get("py", ""), "en": g.get("en", "")})
    return out


def convert(fname, series, unit, segmap, lex, gloss, wordmap):
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
        if vocab:  # never blank a speaker name (relocate to body or drop the blank)
            vocab = heal_name_blanks(vocab)
        if vocab:  # bake per-answer pinyin + English for the word-bank tiles
            tiles = {}
            for a in vocab["answers"]:
                a = (a or "").strip()
                if a and a in wordmap and a not in tiles:
                    tiles[a] = wordmap[a]
            if tiles:
                vocab["tiles"] = tiles
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
            "lines": build_lines(original, gloss),
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
    gloss = load_gloss()
    wordmap = load_word_map()
    meta = {}
    print(f"Segmentation table: {len(segmap)} clauses · lexicon: {len(lex)} words · gloss: {len(gloss)} lines · wordmap: {len(wordmap)} words")
    print("Converted 课文:")
    for fname, series, unit, in SOURCES:
        data, n_lessons, n_texts = convert(fname, series, unit, segmap, lex, gloss, wordmap)
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
