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

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "src" / "data"
AUDIO_DIR = ROOT / "public" / "audio"
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
            await comm.save(str(path))
            return
        except Exception as e:
            if attempt < retries - 1:
                wait = 2 ** (attempt + 1)
                print(f"    ⚠ retry {attempt+1} for '{text}' ({e.__class__.__name__}), waiting {wait}s…")
                await asyncio.sleep(wait)
            else:
                raise


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
            for t in [word["hanzi"]] + [ex["zh"] for ex in word.get("examples", []) if ex.get("zh")]:
                if t not in seen:
                    seen.add(t)
                    texts.append(t)

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
                for t in [word["hanzi"]] + [ex["zh"] for ex in word.get("examples", []) if ex.get("zh")]:
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
            await synthesize(text, output)
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
    parser.add_argument("--concurrency", type=int, default=8, help="Concurrent TTS requests")
    args = parser.parse_args()

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    manifest = load_manifest()
    already = len(manifest)

    if args.all:
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
