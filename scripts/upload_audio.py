#!/usr/bin/env python3
"""Upload pre-generated audio to a Supabase Storage bucket.

Run with uv (httpx provided on the fly):
    SUPABASE_URL=https://xxxx.supabase.co \
    SUPABASE_SERVICE_KEY=sb_secret_xxx \
    uv run --with httpx python3 scripts/upload_audio.py

Uploads audio-src/*.mp3 + manifest.json to bucket `audio` (must be a PUBLIC bucket).
Idempotent: lists existing objects first and skips them, so re-runs only upload new
files. The service/secret key is read from env and NEVER committed.
"""
import asyncio
import os
import sys
from pathlib import Path

import httpx

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "audio-src"
BUCKET = "audio"
CONCURRENCY = 16

URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

if not URL or not KEY:
    sys.exit("Set SUPABASE_URL and SUPABASE_SERVICE_KEY env vars first.")

HEADERS = {"Authorization": f"Bearer {KEY}", "apikey": KEY}


def ca_bundle():
    """Use the system CA bundle (which includes any corporate MITM root) instead of
    httpx's bundled certifi store. Override with SSL_CERT_FILE / REQUESTS_CA_BUNDLE."""
    for env in ("SSL_CERT_FILE", "REQUESTS_CA_BUNDLE", "CURL_CA_BUNDLE"):
        p = os.environ.get(env)
        if p and Path(p).exists():
            return p
    system = "/etc/ssl/certs/ca-certificates.crt"
    return system if Path(system).exists() else True


VERIFY = ca_bundle()


async def list_existing(client: httpx.AsyncClient) -> set[str]:
    """List all object names already in the bucket (paginated)."""
    names: set[str] = set()
    offset = 0
    page = 1000
    while True:
        r = await client.post(
            f"{URL}/storage/v1/object/list/{BUCKET}",
            json={"prefix": "", "limit": page, "offset": offset,
                  "sortBy": {"column": "name", "order": "asc"}},
            headers=HEADERS,
        )
        r.raise_for_status()
        batch = r.json()
        if not batch:
            break
        names.update(item["name"] for item in batch)
        if len(batch) < page:
            break
        offset += page
    return names


def content_type(path: Path) -> str:
    return "application/json" if path.suffix == ".json" else "audio/mpeg"


async def upload_one(client, sem, path: Path, sem_counter):
    async with sem:
        data = path.read_bytes()
        r = await client.post(
            f"{URL}/storage/v1/object/{BUCKET}/{path.name}",
            content=data,
            headers={**HEADERS, "Content-Type": content_type(path), "x-upsert": "true"},
        )
        if r.status_code not in (200, 201):
            print(f"  ✗ {path.name}: {r.status_code} {r.text[:120]}")
            return False
        return True


async def main():
    files = sorted(AUDIO_DIR.glob("*.mp3"))
    manifest = AUDIO_DIR / "manifest.json"
    if manifest.exists():
        files.append(manifest)
    if not files:
        sys.exit(f"No files in {AUDIO_DIR}")

    async with httpx.AsyncClient(timeout=60, verify=VERIFY) as client:
        print("Listing existing objects…")
        existing = await list_existing(client)
        print(f"  {len(existing)} already in bucket")

        # Always re-upload manifest (it changes); skip mp3s already present.
        todo = [f for f in files if f.name == "manifest.json" or f.name not in existing]
        print(f"Uploading {len(todo)} files ({len(files) - len(todo)} skipped)…")

        sem = asyncio.Semaphore(CONCURRENCY)
        done = 0
        ok = 0
        tasks = [upload_one(client, sem, f, None) for f in todo]
        for coro in asyncio.as_completed(tasks):
            result = await coro
            done += 1
            ok += 1 if result else 0
            if done % 200 == 0:
                print(f"  {done}/{len(todo)}…")

        print(f"\nDone: {ok}/{len(todo)} uploaded successfully.")


if __name__ == "__main__":
    asyncio.run(main())
