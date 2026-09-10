#!/usr/bin/env python3
"""Upload pinyin syllable audio to the public Supabase Storage bucket under `pinyin/`.

    SUPABASE_URL=https://xxxx.supabase.co \
    SUPABASE_SERVICE_KEY=sb_secret_xxx \
    uv run --with httpx python3 scripts/upload_pinyin.py

Uploads audio-src/pinyin/*.mp3 → bucket `audio`, object name `pinyin/<file>.mp3`.
Idempotent: lists existing pinyin/ objects first and skips them. The secret key is
read from env and NEVER committed. Public URL becomes:
    {SUPABASE_URL}/storage/v1/object/public/audio/pinyin/<file>.mp3
"""
import asyncio
import os
import sys
from pathlib import Path

import httpx

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "audio-src" / "pinyin"
BUCKET = "audio"
PREFIX = "pinyin"
CONCURRENCY = 16

URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
if not URL or not KEY:
    sys.exit("Set SUPABASE_URL and SUPABASE_SERVICE_KEY env vars first.")

HEADERS = {"Authorization": f"Bearer {KEY}", "apikey": KEY}


def ca_bundle():
    for env in ("SSL_CERT_FILE", "REQUESTS_CA_BUNDLE", "CURL_CA_BUNDLE"):
        p = os.environ.get(env)
        if p and Path(p).exists():
            return p
    system = "/etc/ssl/certs/ca-certificates.crt"
    return system if Path(system).exists() else True


VERIFY = ca_bundle()


async def list_existing(client: httpx.AsyncClient) -> set[str]:
    names: set[str] = set()
    offset = 0
    page = 1000
    while True:
        r = await client.post(
            f"{URL}/storage/v1/object/list/{BUCKET}",
            json={"prefix": f"{PREFIX}/", "limit": page, "offset": offset,
                  "sortBy": {"column": "name", "order": "asc"}},
            headers=HEADERS,
        )
        r.raise_for_status()
        batch = r.json()
        if not batch:
            break
        names.update(item["name"] for item in batch)  # names are relative to prefix
        if len(batch) < page:
            break
        offset += page
    return names


async def upload_one(client, sem, path: Path):
    async with sem:
        data = path.read_bytes()
        r = await client.post(
            f"{URL}/storage/v1/object/{BUCKET}/{PREFIX}/{path.name}",
            content=data,
            headers={**HEADERS, "Content-Type": "audio/mpeg", "x-upsert": "true"},
        )
        if r.status_code not in (200, 201):
            print(f"  ✗ {path.name}: {r.status_code} {r.text[:120]}")
            return False
        return True


async def main():
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="+", metavar="STEM",
                    help="only (re)upload these stems, e.g. --only ne1 chi1 (upsert, ignores skip)")
    args = ap.parse_args()

    files = sorted(AUDIO_DIR.glob("*.mp3"))
    if not files:
        sys.exit(f"No mp3 files in {AUDIO_DIR}")

    if args.only:
        wanted = {s if s.endswith(".mp3") else f"{s}.mp3" for s in args.only}
        todo = [f for f in files if f.name in wanted]
        missing = wanted - {f.name for f in todo}
        if missing:
            sys.exit(f"Not found in {AUDIO_DIR}: {', '.join(sorted(missing))}")
        async with httpx.AsyncClient(timeout=60, verify=VERIFY) as client:
            print(f"Force-uploading {len(todo)} file(s) (upsert): {', '.join(f.name for f in todo)}")
            sem = asyncio.Semaphore(CONCURRENCY)
            ok = sum([1 for r in await asyncio.gather(*(upload_one(client, sem, f) for f in todo)) if r])
            print(f"\nDone: {ok}/{len(todo)} uploaded to {BUCKET}/{PREFIX}/.")
        return

    async with httpx.AsyncClient(timeout=60, verify=VERIFY) as client:
        print("Listing existing pinyin/ objects…")
        existing = await list_existing(client)
        print(f"  {len(existing)} already in bucket")

        todo = [f for f in files if f.name not in existing]
        print(f"Uploading {len(todo)} files ({len(files) - len(todo)} skipped)…")

        sem = asyncio.Semaphore(CONCURRENCY)
        done = ok = 0
        tasks = [upload_one(client, sem, f) for f in todo]
        for coro in asyncio.as_completed(tasks):
            ok += 1 if await coro else 0
            done += 1
            if done % 200 == 0:
                print(f"  {done}/{len(todo)}…")

        print(f"\nDone: {ok}/{len(todo)} uploaded to {BUCKET}/{PREFIX}/.")


if __name__ == "__main__":
    asyncio.run(main())
