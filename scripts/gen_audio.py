#!/usr/bin/env python3
"""Generate pre-recorded audio files using Microsoft Edge TTS (neural voices).

Run with uv:
    uv run --with edge-tts python3 scripts/gen_audio.py --series hsk --unit 1 --lesson 1
    uv run --with edge-tts python3 scripts/gen_audio.py --all   # entire corpus

Audio files → public/audio/{md5}.mp3
Manifest    → public/audio/manifest.json  (maps Chinese text → filename)

The manifest is loaded by tts.js at runtime; only missing files are generated
on subsequent runs (idempotent). Common words shared across courses are
deduplicated automatically.
"""
import asyncio
import argparse
import hashlib
import json
from pathlib import Path

import edge_tts

import edge_tts_compat  # noqa: F401  — endpoint / IPv4 / CA fixes, see that file

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "src" / "data"
# Audio lives outside the Vite build (uploaded to Supabase Storage, not shipped in dist).
AUDIO_DIR = ROOT / "audio-src"
MANIFEST_FILE = AUDIO_DIR / "manifest.json"

# zh-CN-XiaoxiaoNeural: warm, natural female voice — best overall for Mandarin learners
VOICE = "zh-CN-XiaoxiaoNeural"


def text_hash(text: str) -> str:
    return hashlib.md5(text.encode()).hexdigest()


def load_manifest() -> dict:
    if MANIFEST_FILE.exists():
        return json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
    return {}


def save_manifest(manifest: dict):
    MANIFEST_FILE.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )


async def synthesize(text: str, path: Path, retries: int = 3):
    for attempt in range(retries):
        try:
            comm = edge_tts.Communicate(text, VOICE)
            # edge-tts has no timeout of its own — a stalled websocket hung a whole run once
            await asyncio.wait_for(comm.save(str(path)), timeout=60)
            return
        except Exception as e:
            if attempt < retries - 1:
                wait = 2 ** (attempt + 1)
                print(f"    ⚠ retry {attempt+1} for '{text}' ({e.__class__.__name__}), waiting {wait}s…")
                await asyncio.sleep(wait)
            else:
                raise


def example_speech(zh: str) -> str:
    """Two-line exchange examples ("A：…B：…") are spoken without the A/B labels —
    FlashCard's speechOf() strips them the same way before looking up the manifest."""
    return zh.replace("A：", "").replace("B：", "")


def collect_texts(series: str, unit: int, lesson_num: int | None) -> list[str]:
    """Return unique Chinese texts (words + examples) for the given scope."""
    data_file = DATA_DIR / f"{series}-{unit}.json"
    if not data_file.exists():
        raise FileNotFoundError(f"Data file not found: {data_file}")

    data = json.loads(data_file.read_text(encoding="utf-8"))
    seen: set[str] = set()
    texts: list[str] = []

    for lesson in data["lessons"]:
        if lesson_num is not None and lesson["num"] != lesson_num:
            continue
        for word in lesson["words"]:
            for t in [word["hanzi"]] + [example_speech(ex["zh"]) for ex in word.get("examples", []) if ex.get("zh")]:
                if t not in seen:
                    seen.add(t)
                    texts.append(t)

    return texts


def collect_text_lines() -> list[str]:
    """Speakable 课文 strings that need pre-generated audio: the 读原文 🔊 lines
    (dialogue lines, speaker stripped) AND every 连词成句 sentence (`sentences[].text`
    — narratives are split into sub-sentences that don't match a whole line, and the
    grammar mode's 听一听 hint button speaks each)."""
    import re
    seen: set[str] = set()
    texts: list[str] = []

    def add(speech: str):
        speech = (speech or "").strip()
        # skip strings with nothing speakable (e.g. "……") to avoid TTS errors
        if not speech or not re.search(r"[一-鿿A-Za-z0-9]", speech):
            return
        if speech not in seen:
            seen.add(speech)
            texts.append(speech)

    for f in sorted((DATA_DIR / "texts").glob("*-*.json")):
        data = json.loads(f.read_text(encoding="utf-8"))
        if "lessons" not in data:
            continue
        for lesson in data["lessons"]:
            for t in lesson["texts"]:
                # Read the 🔊 lines straight from `lines` — the same array ReadPanel
                # renders and calls say(l.zh) on. Re-deriving them from `original` here
                # duplicated convert_texts.build_lines' speaker rule, and the two
                # silently drifted when that rule changed (letter salutations like
                # 「亲爱的同学们：」 stopped being parsed as a speaker).
                for ln in t.get("lines") or []:
                    add(ln.get("zh"))
                for s in t.get("sentences") or []:
                    add(s.get("text"))
    return texts


def collect_discussion() -> list[str]:
    """Every 话题讨论 question (`questions[].zh`) — DiscussionPanel puts a 🔊 on each."""
    import re
    seen: set[str] = set()
    texts: list[str] = []
    for f in sorted((DATA_DIR / "discussion").glob("*-*.json")):
        data = json.loads(f.read_text(encoding="utf-8"))
        if "lessons" not in data:
            continue
        for lesson in data["lessons"]:
            for t in lesson["texts"]:
                for q in t.get("questions") or []:
                    zh = (q.get("zh") or "").strip()
                    if not zh or not re.search(r"[一-鿿A-Za-z0-9]", zh):
                        continue
                    if zh not in seen:
                        seen.add(zh)
                        texts.append(zh)
    return texts


def collect_collocations() -> list[str]:
    """词汇详解 常见搭配 — VocabPanel plays each collocation when it's tapped."""
    seen: set[str] = set()
    texts: list[str] = []
    for f in sorted(DATA_DIR.glob("*-*.json")):
        data = json.loads(f.read_text(encoding="utf-8"))
        for lesson in data.get("lessons", []):
            for word in lesson.get("words", []):
                for t in word.get("collocations") or []:
                    if t not in seen:
                        seen.add(t)
                        texts.append(t)
    return texts


def collect_music() -> list[str]:
    """中国风 Music — MusicView plays each 「歌里的词」 word when it's tapped."""
    data = json.loads((DATA_DIR / "music.json").read_text(encoding="utf-8"))
    seen: set[str] = set()
    texts: list[str] = []
    for song in (s for g in data["groups"] for s in g["songs"]):
        for w in song.get("words") or []:
            if w["zh"] not in seen:
                seen.add(w["zh"])
                texts.append(w["zh"])
    return texts


def collect_all_texts() -> list[str]:
    seen: set[str] = set()
    texts: list[str] = []
    for f in sorted(DATA_DIR.glob("*.json")):
        data = json.loads(f.read_text(encoding="utf-8"))
        if "lessons" not in data:
            continue
        for lesson in data["lessons"]:
            for word in lesson["words"]:
                for t in [word["hanzi"]] + [example_speech(ex["zh"]) for ex in word.get("examples", []) if ex.get("zh")]:
                    if t not in seen:
                        seen.add(t)
                        texts.append(t)
    return texts


async def generate(texts: list[str], manifest: dict, concurrency: int = 8) -> int:
    # Filter to work that isn't done yet; repair manifest for orphaned files.
    pending: list[tuple[str, str, Path]] = []
    for text in texts:
        filename = text_hash(text) + ".mp3"
        output = AUDIO_DIR / filename
        # A failed synthesis leaves a 0-byte file behind (edge-tts opens it before
        # connecting); never count that as done, or it ships as silent audio.
        if output.exists() and output.stat().st_size == 0:
            output.unlink()
            manifest.pop(text, None)
        if text in manifest or output.exists():
            if text not in manifest:
                manifest[text] = filename  # repair manifest for orphaned files
            continue
        pending.append((text, filename, output))

    total = len(pending)
    done = 0
    sem = asyncio.Semaphore(concurrency)
    lock = asyncio.Lock()

    async def worker(text: str, filename: str, output: Path):
        nonlocal done
        async with sem:
            try:
                await synthesize(text, output)
            except Exception as e:
                output.unlink(missing_ok=True)  # don't leave a partial file to be mistaken for done
                async with lock:
                    print(f"  ✗ skip '{text}' ({e.__class__.__name__})")
                return
        # Manifest mutation + periodic save under a lock (asyncio is single
        # threaded, but await points can interleave — keep writes atomic).
        async with lock:
            manifest[text] = filename
            done += 1
            print(f"  ✔ [{done}/{total}] {text}  →  {filename}")
            if done % 50 == 0:
                save_manifest(manifest)

    await asyncio.gather(*(worker(t, f, o) for t, f, o in pending))
    return total


async def main():
    parser = argparse.ArgumentParser(description="Generate TTS audio files")
    parser.add_argument("--series", default="hsk")
    parser.add_argument("--unit", type=int, default=1)
    parser.add_argument("--lesson", type=int, default=None, help="Specific lesson number (omit = whole unit)")
    parser.add_argument("--all", action="store_true", help="Generate for entire corpus")
    parser.add_argument("--texts", action="store_true", help="Generate for 课文 dialogue lines")
    parser.add_argument("--discussion", action="store_true", help="Generate for 话题讨论 questions")
    parser.add_argument("--collocations", action="store_true", help="Generate for 词汇详解 常见搭配")
    parser.add_argument("--music", action="store_true", help="Generate for 中国风 Music song words")
    parser.add_argument("--concurrency", type=int, default=8, help="Concurrent TTS requests")
    args = parser.parse_args()

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    manifest = load_manifest()
    already = len(manifest)

    if args.music:
        texts = collect_music()
        label = "中国风 Music words"
    elif args.collocations:
        texts = collect_collocations()
        label = "词汇详解 collocations"
    elif args.discussion:
        texts = collect_discussion()
        label = "话题讨论 questions"
    elif args.texts:
        texts = collect_text_lines()
        label = "课文 dialogue lines"
    elif args.all:
        texts = collect_all_texts()
        label = "entire corpus"
    else:
        texts = collect_texts(args.series, args.unit, args.lesson)
        label = f"{args.series}-{args.unit}" + (f" lesson {args.lesson}" if args.lesson else "")

    print(f"Scope: {label} — {len(texts)} unique texts ({len(texts) - sum(t in manifest for t in texts)} new), concurrency={args.concurrency}")
    new_count = await generate(texts, manifest, args.concurrency)
    save_manifest(manifest)
    print(f"\nDone: {new_count} generated, {already} already existed, {len(manifest)} total in manifest")


if __name__ == "__main__":
    asyncio.run(main())
