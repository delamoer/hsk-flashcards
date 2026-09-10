#!/usr/bin/env python3
"""Convert the pinyin teaching xlsx into src/data/pinyin.json and (optionally)
download the matching human-recorded audio from hugolpz/audio-cmn (CC-BY-SA).

    uv run --with openpyxl python3 scripts/convert_pinyin.py            # JSON only
    uv run --with openpyxl --with httpx python3 scripts/convert_pinyin.py --download

Audio source: https://github.com/hugolpz/audio-cmn  (64k/syllabs, cmn-<syllable><tone>.mp3)
Downloaded → audio-src/pinyin/<syllable><tone>.mp3   (ü written as v, matching pinyin filename convention)
Upload with scripts/upload_audio.py (audio-src/pinyin/** → bucket audio, prefix pinyin/).

Everything is data-driven from the xlsx; audio filenames are derived, never hand-typed.
"""
import argparse
import json
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
XLSX = ROOT / "sources" / "汉语拼音_声母韵母可拼音节_网站数据 (2).xlsx"
OUT = ROOT / "src" / "data" / "pinyin.json"
AUDIO_DIR = ROOT / "audio-src" / "pinyin"
HUGO_BASE = "https://raw.githubusercontent.com/hugolpz/audio-cmn/master/64k/syllabs"

# 声母呼读音 (the conventional "name" said when teaching an initial), all 阴平/tone-1.
# We play the recording of this full syllable because a bare consonant can't be voiced.
INITIAL_CALL = {
    "b": "bo", "p": "po", "m": "mo", "f": "fo", "d": "de", "t": "te", "n": "ne",
    "l": "le", "g": "ge", "k": "ke", "h": "he", "j": "ji", "q": "qi", "x": "xi",
    "zh": "zhi", "ch": "chi", "sh": "shi", "r": "ri", "z": "zi", "c": "ci", "s": "si",
}

# ── Bilingual pedagogy (audience = zero/low-Chinese English speakers) ──────────
# English near-equivalents are far more useful to a beginner than a translation
# of the Chinese articulatory description, so we ship both.
INITIAL_HINT_EN = {
    "b": 'like “b” in "spy" (no puff of air)',
    "p": 'like “p” in "pie" (strong puff of air)',
    "m": 'like “m” in "mom"',
    "f": 'like “f” in "fun"',
    "d": 'like “d” in "sty" (no puff of air)',
    "t": 'like “t” in "top" (puff of air)',
    "n": 'like “n” in "no"',
    "l": 'like “l” in "love"',
    "g": 'like “g” in "sky" (no puff of air)',
    "k": 'like “k” in "kite" (puff of air)',
    "h": 'like “h” in "hat" (a bit raspier)',
    "j": 'like “j” in "jeep" (tongue flat, lips wide)',
    "q": 'like “ch” in "cheese" (puff of air)',
    "x": 'like “sh” in "she" (lighter, tongue low)',
    "zh": 'like “j” in "jump" (tongue curled back)',
    "ch": 'like “ch” in "church" (tongue curled back)',
    "sh": 'like “sh” in "shirt" (tongue curled back)',
    "r": 'like “r” in "raw" mixed with "s" in "pleasure"',
    "z": 'like “ds” in "kids" (no puff of air)',
    "c": 'like “ts” in "cats" (puff of air)',
    "s": 'like “s” in "sun"',
}
PLACE_EN = {
    "双唇音": "Both lips (bilabial)",
    "唇齿音": "Lip + teeth (labiodental)",
    "舌尖中音": "Tongue tip (alveolar)",
    "舌根音": "Back of tongue (velar)",
    "舌面音": "Tongue body (palatal)",
    "舌尖后音": "Curled tongue (retroflex)",
    "舌尖前音": "Tongue tip (dental)",
}
MANNER_EN = {
    "不送气": "no puff of air",
    "送气": "with a puff of air",
    "鼻音": "nasal",
    "清擦音": "voiceless fricative",
    "擦音": "fricative",
    "边音": "lateral (air around the tongue)",
    "浊擦/近音": "voiced / approximant",
}
# One common HSK-1 example word per initial (front-of-flashcard payload).
INITIAL_EXAMPLE = {
    "b": ("爸", "bà", "dad"), "p": ("朋", "péng", "friend"), "m": ("妈", "mā", "mom"),
    "f": ("饭", "fàn", "meal"), "d": ("大", "dà", "big"), "t": ("天", "tiān", "sky"),
    "n": ("你", "nǐ", "you"), "l": ("来", "lái", "come"), "g": ("狗", "gǒu", "dog"),
    "k": ("看", "kàn", "look"), "h": ("好", "hǎo", "good"), "j": ("家", "jiā", "home"),
    "q": ("去", "qù", "go"), "x": ("谢", "xiè", "thanks"), "zh": ("中", "zhōng", "middle"),
    "ch": ("吃", "chī", "eat"), "sh": ("是", "shì", "to be"), "r": ("人", "rén", "person"),
    "z": ("在", "zài", "at"), "c": ("菜", "cài", "dish"), "s": ("三", "sān", "three"),
}
CATEGORY_EN = {
    "单韵母": "Single vowels",
    "复韵母": "Compound vowels",
    "特殊韵母": "Special",
    "前鼻韵母": "-n endings",
    "后鼻韵母": "-ng endings",
}
FINAL_HINT_EN = {
    "a": 'like “a” in "father"', "o": 'like “o” in "for" (rounded)',
    "e": 'like “u” in "duh" (unrounded)', "i": 'like “ee” in "see"',
    "u": 'like “oo” in "food"', "ü": 'say “ee” with rounded lips',
    "ai": 'like "eye"', "ei": 'like “ay” in "day"', "ui": 'like "way"',
    "ao": 'like “ow” in "cow"', "ou": 'like “o” in "go"', "iu": 'like “yo” in "yo-yo"',
    "ie": 'like “ye” in "yes"', "üe": 'ü + "eh"', "er": 'like “er” in "her" (curled tongue)',
    "an": 'like “an” in "ban"', "en": 'like “en” in "broken"', "in": 'like “in” in "bin"',
    "un": 'like "won"', "ün": 'ü + "n"', "ang": 'like “ong” in "song"',
    "eng": 'like “ung” in "sung"', "ing": 'like “ing” in "sing"', "ong": 'like "oong" (oo + ng)',
}


def fn(s: str) -> str:
    """Filename-safe pinyin base: ü/ǖ… → v, lowercase, strip spaces."""
    if s is None:
        return ""
    return s.strip().replace("ü", "v").replace("ǖ", "v").lower()


def load():
    return openpyxl.load_workbook(XLSX, read_only=True, data_only=True)


def rows(ws):
    return list(ws.iter_rows(values_only=True))


def build(wb):
    audio_needed: set[str] = set()  # base+tone stems, e.g. "ba1"

    # ── 声母 Initials ──────────────────────────────────────────────
    ws = wb["声母表"]
    r = rows(ws)
    h = r[0]
    ci = {name: i for i, name in enumerate(h)}
    initials = []
    for row in r[1:]:
        ini = row[ci["声母"]]
        if not ini:
            continue
        ini = str(ini).strip()
        call = INITIAL_CALL.get(ini)
        stem = f"{call}1" if call else None
        if stem:
            audio_needed.add(stem)
        place = row[ci["发音部位"]]
        manner = row[ci["发音特点"]]
        ex = INITIAL_EXAMPLE.get(ini)
        initials.append({
            "initial": ini,
            "place": place,
            "placeEn": PLACE_EN.get(place),
            "manner": manner,
            "mannerEn": MANNER_EN.get(manner),
            "tip": row[ci["简单发音提示"]],
            "hintEn": INITIAL_HINT_EN.get(ini),
            "example": {"hanzi": ex[0], "pinyin": ex[1], "en": ex[2]} if ex else None,
            "call": call,            # e.g. "bo" — what we voice
            "audio": stem,           # e.g. "bo1"
        })

    # ── 韵母 Finals (base + four tones) ────────────────────────────
    ws = wb["韵母_无声调"]
    r = rows(ws)
    h = r[0]
    ci = {name: i for i, name in enumerate(h)}
    finals_base = {}
    finals_order = []
    for row in r[1:]:
        fin = row[ci["韵母"]]
        if not fin:
            continue
        fin = str(fin).strip()
        zero = str(row[ci["零声母写法"]] or "").strip()
        base = fn(zero) if zero else fn(fin)
        finals_base[fin] = {
            "final": fin,
            "category": row[ci["类别"]],
            "categoryEn": CATEGORY_EN.get(str(row[ci["类别"]]).strip()),
            "full": row[ci["完整形式/说明"]],
            "zero": zero,
            "tip": row[ci["发音提示"]],
            "hintEn": FINAL_HINT_EN.get(fin),
            "audioBase": base,       # e.g. "yi", "weng"
        }
        finals_order.append(fin)

    # four-tone display strings from 韵母_四声
    ws = wb["韵母_四声"]
    r = rows(ws)
    h = r[0]
    ci = {name: i for i, name in enumerate(h)}
    tone_cols = ["第一声", "第二声", "第三声", "第四声"]
    for row in r[1:]:
        fin = row[ci["韵母"]]
        if not fin:
            continue
        fin = str(fin).strip()
        meta = finals_base.get(fin)
        if not meta:
            continue
        tones = []
        base = meta["audioBase"]
        for t, col in enumerate(tone_cols, start=1):
            disp = row[ci[col]]
            stem = f"{base}{t}" if base else None
            if stem:
                audio_needed.add(stem)
            tones.append({"tone": t, "display": disp, "audio": stem})
        meta["tones"] = tones

    finals = [finals_base[f] for f in finals_order]

    # ── 音节 Syllables (网站数据_音节) ─────────────────────────────
    ws = wb["网站数据_音节"]
    r = rows(ws)
    h = r[0]
    ci = {name: i for i, name in enumerate(h)}
    tone_cols = ["第一声", "第二声", "第三声", "第四声"]
    syllables = []
    for row in r[1:]:
        syl = row[ci["无调拼音"]]
        if not syl:
            continue
        syl = str(syl).strip()
        base = fn(syl)
        ini = row[ci["声母"]]
        ini = None if (ini in ("∅", None) or str(ini).strip() == "∅") else str(ini).strip()
        tones = []
        for t, col in enumerate(tone_cols, start=1):
            disp = row[ci[col]]
            if not disp:
                continue
            stem = f"{base}{t}"
            audio_needed.add(stem)
            tones.append({"tone": t, "display": str(disp).strip(), "audio": stem})
        syllables.append({
            "id": row[ci["id"]],
            "initial": ini,
            "final": row[ci["韵母"]],
            "syllable": syl,
            "core": (str(row[ci["是否核心"]]).strip() == "是") if "是否核心" in ci else True,
            "tones": tones,
        })

    # ── 可拼音节表 grid (finals × initials matrix) ─────────────────
    ws = wb["可拼音节表"]
    r = rows(ws)
    header = r[0]
    col_initials = [str(c).strip() if c else "" for c in header[1:]]  # first col is label
    grid_rows = []
    for row in r[1:]:
        label = row[0]
        if label is None:
            continue
        cells = []
        for c in row[1:]:
            cells.append(str(c).strip() if c else None)
        grid_rows.append({"final": str(label).strip(), "cells": cells})

    data = {
        "source": {
            "audio": "hugolpz/audio-cmn (Chen Wang)",
            "audioLicense": "CC-BY-SA",
            "audioUrl": "https://github.com/hugolpz/audio-cmn",
        },
        "initials": initials,
        "finals": finals,
        "syllables": syllables,
        "grid": {"initials": col_initials, "rows": grid_rows},
    }
    return data, sorted(audio_needed)


def download(stems):
    import httpx
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    ok = miss = skip = 0
    missing = []
    with httpx.Client(timeout=30, follow_redirects=True) as client:
        for i, stem in enumerate(stems, 1):
            out = AUDIO_DIR / f"{stem}.mp3"
            if out.exists() and out.stat().st_size > 0:
                skip += 1
                continue
            url = f"{HUGO_BASE}/cmn-{stem}.mp3"
            try:
                resp = client.get(url)
                if resp.status_code == 200 and resp.content:
                    out.write_bytes(resp.content)
                    ok += 1
                else:
                    miss += 1
                    missing.append(stem)
            except Exception as e:
                miss += 1
                missing.append(stem)
            if i % 100 == 0:
                print(f"  {i}/{len(stems)}  ok={ok} skip={skip} miss={miss}")
    print(f"\nDownload done: {ok} new, {skip} existing, {miss} missing/failed.")
    if missing:
        print("MISSING (no hugolpz recording):", " ".join(missing))
        (AUDIO_DIR / "_missing.txt").write_text("\n".join(missing), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--download", action="store_true", help="also download hugolpz audio")
    args = ap.parse_args()

    wb = load()
    data, stems = build(wb)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)}")
    print(f"  initials={len(data['initials'])} finals={len(data['finals'])} "
          f"syllables={len(data['syllables'])} grid_rows={len(data['grid']['rows'])}")
    print(f"  audio stems needed: {len(stems)}")

    if args.download:
        download(stems)
    else:
        print("  (run with --download to fetch audio from hugolpz)")


if __name__ == "__main__":
    main()
