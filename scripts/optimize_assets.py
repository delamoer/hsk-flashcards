#!/usr/bin/env python3
"""Optimize the raw design assets in assets/ into web-ready WebP under src/assets/img/.

Run:  uv run --with pillow python3 scripts/optimize_assets.py

Source of truth = the big PNG/JPG files in assets/ (WeChat exports, keyed by the
trailing number token e.g. ..._1490_16.png). This script resizes + converts them to
WebP (alpha kept for cut-out motifs), grouped by role into src/assets/img/{hero,books,
photos,motif}/. The raw assets/ dir is gitignored; the optimized output IS committed
(the Vite build imports it). Re-run after adding/replacing source images.
"""
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow required: run via `uv run --with pillow python3 scripts/optimize_assets.py`")

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets"
OUT = ROOT / "src" / "assets" / "img"

# role -> (out_subdir, out_stem, source_stem, max_width, keep_alpha)
# source_stem: the descriptive filename stem in assets/ (see scripts rename step).
JOBS = [
    # 首页 hero + 内页 band 横幅
    ("hero", "hero-main", "shanshui-hero-plum-sun", 1920, False),
    ("hero", "band-hsk", "shanshui-band-warm", 1920, False),
    ("hero", "band-newhsk3", "shanshui-band-cool", 1920, False),
    ("hero", "band-huihua360", "shanshui-bamboo-square", 1920, False),
    ("hero", "band-survival", "shanshui-hero-plum-sun", 1920, False),
    # 书封（竖构图小景，按系列意象）
    ("books", "cover-hsk", "cover-pavilion-chrysanth", 900, False),
    ("books", "cover-newhsk3", "cover-orchid", 900, False),
    ("books", "cover-huihua360", "cover-bamboo-moongate", 900, False),
    ("books", "cover-survival", "cover-plum-clouds", 900, False),
    # 实景照（首页缩略列，2x 余量）
    ("photos", "bamboo", "photo-bamboo-rain", 820, False),
    ("photos", "plum-desk", "photo-plum-desk", 820, False),
    ("photos", "desk", "photo-desk-tea", 820, False),
    # 免抠母题（保留透明；按实际显示尺寸压小，含 2x retina 余量）
    ("motif", "plum-branch", "motif-plum-branch", 620, True),
    ("motif", "plum-branch-2", "motif-plum-branch-2", 620, True),
    ("motif", "cranes-fly", "motif-cranes-fly", 620, True),
    ("motif", "swallows", "motif-swallows", 520, True),
    ("motif", "pavilion", "motif-pavilion", 480, True),
    ("motif", "seals", "motif-seals", 340, True),
    ("motif", "pine", "motif-pine", 700, True),
    ("motif", "bamboo", "motif-bamboo", 640, True),
    ("motif", "mountain-far", "motif-mountain-far", 1400, True),
    ("motif", "cloud", "motif-cloud", 760, True),
    ("motif", "boat", "motif-boat", 620, True),
    ("motif", "rock", "motif-rock", 560, True),
    # 全站宣纸底纹（真实单张，可平铺）
    ("texture", "paper", "texture-paper-rice", 900, False),
    # 板块隐约水印（仙鹤立轴，低透明度水墨衬底）
    ("watermark", "wm-books", "crane-pine-mountain", 900, False),
    ("watermark", "wm-pinyin", "crane-bamboo-calligraphy", 900, False),
    ("watermark", "wm-words", "crane-plum-calligraphy", 900, False),
]

QUALITY = 82

# Clean single tiles cropped out of the montage 纹理合集 sheets (if ever needed).
# (out_subdir, out_stem, source_stem, (left, top, right, bottom))
CROPS = []


def find_source(key: str) -> Path | None:
    # literal filename stem first (landscape-1, landscape-2)
    for ext in (".jpg", ".jpeg", ".png", ".webp"):
        p = SRC / f"{key}{ext}"
        if p.exists():
            return p
    # else match the WeChat trailing-number token: *_<key>_16.png
    hits = sorted(SRC.glob(f"*_{key}_*"))
    if hits:
        return hits[0]
    hits = sorted(SRC.glob(f"*{key}*"))
    return hits[0] if hits else None


def process(job):
    subdir, stem, key, max_w, keep_alpha = job
    src = find_source(key)
    if not src:
        print(f"  !! missing source for {stem} (key {key})")
        return False
    im = Image.open(src)
    if keep_alpha:
        im = im.convert("RGBA")
    else:
        im = im.convert("RGB")
    if im.width > max_w:
        h = round(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    dest_dir = OUT / subdir
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / f"{stem}.webp"
    save_kw = {"quality": QUALITY, "method": 6}
    im.save(dest, "WEBP", **save_kw)
    kb = dest.stat().st_size / 1024
    print(f"  {src.name:>44}  ->  img/{subdir}/{stem}.webp  ({im.width}x{im.height}, {kb:.0f} KB)")
    return True


def process_crop(job):
    subdir, stem, key, box = job
    src = find_source(key)
    if not src:
        print(f"  !! missing source for {stem} (key {key})")
        return False
    im = Image.open(src).convert("RGB").crop(box)
    dest_dir = OUT / subdir
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / f"{stem}.webp"
    im.save(dest, "WEBP", quality=QUALITY, method=6)
    kb = dest.stat().st_size / 1024
    print(f"  {src.name:>44}  ->  img/{subdir}/{stem}.webp  (crop {im.width}x{im.height}, {kb:.0f} KB)")
    return True


def main():
    if not SRC.exists():
        sys.exit(f"no source dir: {SRC}")
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"optimizing {len(JOBS)} assets + {len(CROPS)} crops  {SRC}  ->  {OUT}")
    ok = sum(process(j) for j in JOBS)
    ok += sum(process_crop(c) for c in CROPS)
    print(f"done: {ok}/{len(JOBS) + len(CROPS)} written")


if __name__ == "__main__":
    main()
