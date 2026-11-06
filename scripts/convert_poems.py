"""古诗词 (classical poems) xlsx → src/data/poems/meta.json + src/data/poems/p/{slug}.json.

Run:  uv run --with openpyxl python3 scripts/convert_poems.py

Source: sources/古诗词_作品总表.xlsx — 作品 (one row per poem) · 逐句 (one row per displayed line) ·
字词 (tap-a-word glosses) · 作品意象 (an image's meaning in that poem) · 意象 (the imagery dictionary) ·
朝代 (the seven eras of the scroll, in order) · 主题 (theme list) · 说明 (how to fill it in).
候选清单 is a working list and is not read.

Everything is written for the site (original texts checked against zh.wikisource; pinyin per character,
no tone sandhi, lowercase — the poetry convention, unlike 课文; both English layers are our own).
meta.json (list fields only) drives the scroll, theme/imagery views and search; each poem's full data is
its own lazy chunk. A poem's 网址名 is its URL (/poems/:slug) and its prerendered page — never rename one.
Adding a poem or an era = new rows in the workbook + rerun; nothing else to wire up.
"""

import json
import re
import sys
import unicodedata
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "sources" / "古诗词_作品总表.xlsx"
OUT = ROOT / "src" / "data" / "poems"

LEVELS = ("入门", "进阶", "挑战")
HAN = re.compile(r"[㐀-鿿]")
SYL = re.compile(r"^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+$")
SYL_SPLIT = re.compile(r"[\s,.;:!?·'’\"“”—-]+")
# 【请老师确认】 marks a reading for the teacher's review — internal, never shown to students
INTERNAL = re.compile(r"【请老师确认】\s*")


def rows(wb, name):
    it = wb[name].iter_rows(values_only=True)
    hdr = next(it)
    return [{k: ("" if v is None else v) for k, v in zip(hdr, r)} for r in it if r and r[0] not in (None, "")]


def split(s):
    return [x.strip() for x in str(s).split("、") if x.strip()]


def text(s):
    return str(s).strip()


def main():
    wb = openpyxl.load_workbook(SRC, read_only=True)
    poems, lines, words, pimgs = rows(wb, "作品"), rows(wb, "逐句"), rows(wb, "字词"), rows(wb, "作品意象")
    dyn_rows, theme_rows, img_rows = rows(wb, "朝代"), rows(wb, "主题"), rows(wb, "意象")

    dynasties = [{"key": d["朝代"], "py": d["拼音"], "en": d["英文"], "years": d["年代"],
                  "intro": d["导语（中文）"], "introEn": d["导语（英文）"]} for d in dyn_rows]
    themes = [{"zh": t["主题"], "en": t["英文"]} for t in theme_rows]
    dyn_order = {d["key"]: i for i, d in enumerate(dynasties)}
    theme_set = {t["zh"] for t in themes}
    img_dict = {m["意象"]: m for m in img_rows}

    errors, slugs, out_list = [], set(), []
    lines_of, words_of, imgs_of = {}, {}, {}
    for l in lines:
        lines_of.setdefault(l["编号"], []).append(l)
    for w in words:
        words_of.setdefault(w["编号"], []).append(w)
    for m in pimgs:
        imgs_of.setdefault(m["编号"], []).append(m)

    OUT.joinpath("p").mkdir(parents=True, exist_ok=True)
    for old in OUT.joinpath("p").glob("*.json"):
        old.unlink()

    poems.sort(key=lambda p: (dyn_order.get(p["朝代"], 99), p["编号"]))
    for p in poems:
        pid, slug, title = p["编号"], text(p["网址名"]), text(p["题目"])
        tag = f"{pid} {title}"
        if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", slug):
            errors.append(f"{tag}: 网址名格式不对 {slug!r}")
        if slug in slugs:
            errors.append(f"{tag}: 网址名重复 {slug}")
        slugs.add(slug)
        if p["朝代"] not in dyn_order:
            errors.append(f"{tag}: 朝代 {p['朝代']!r} 不在「朝代」表")
        if text(p.get("朗读声音")) not in ("男", "女", ""):
            errors.append(f"{tag}: 朗读声音 应为 男 / 女")
        if p["难度"] not in LEVELS:
            errors.append(f"{tag}: 难度 {p['难度']!r}")
        ths, ims = split(p["主题"]), split(p["意象"])
        for t in ths:
            if t not in theme_set:
                errors.append(f"{tag}: 主题 {t!r} 不在「主题」表")
        pi = imgs_of.get(pid, [])
        if sorted(ims) != sorted(m["意象"] for m in pi):
            errors.append(f"{tag}: 作品.意象 与「作品意象」表不一致")
        for m in ims:
            if m not in img_dict:
                errors.append(f"{tag}: 意象 {m!r} 不在「意象」表")

        out_lines = []
        for i, l in enumerate(lines_of.get(pid, []), 1):
            zh = HAN.findall(l["原文"])
            syl = [s for s in SYL_SPLIT.split(unicodedata.normalize("NFC", text(l["拼音"]))) if s]
            if len(syl) != len(zh):
                errors.append(f"{tag} 第{i}行: 拼音 {len(syl)} 个音节 ≠ {len(zh)} 个字")
            if any(not SYL.match(s) for s in syl):
                errors.append(f"{tag} 第{i}行: 拼音有非法音节")
            if HAN.findall(l["节奏"]) != zh:
                errors.append(f"{tag} 第{i}行: 节奏与原文不一致")
            tts = text(l["朗读用字"])
            if tts and len(HAN.findall(tts)) != len(zh):
                errors.append(f"{tag} 第{i}行: 朗读用字字数不等")
            line = {"s": int(l["段"] or 1), "zh": text(l["原文"]), "rhythm": text(l["节奏"]), "py": text(l["拼音"]),
                    "lit": text(l["直译（英文）"]), "en": text(l["意译（英文）"])}
            if tts:
                line["tts"] = tts  # audio is generated from this text but keyed by `zh` (gen_audio.py --poems)
            out_lines.append(line)
        if not out_lines:
            errors.append(f"{tag}: 逐句表里没有这首")

        first = out_lines[0]["zh"] if out_lines else ""
        out_list.append({
            "id": pid, "slug": slug, "title": title, "titlePy": text(p["题目拼音"]), "titleEn": text(p["题目英文"]),
            "author": text(p["作者"]), "authorEn": text(p["作者英文"]), "dynasty": p["朝代"], "form": text(p["体裁"]),
            "tune": text(p["词牌/曲牌"]), "level": p["难度"], "themes": ths, "images": ims,
            "first": re.split(r"[，。？！；、]", first)[0], "excerpt": p["是否节选"] == "是",
        })
        full = dict(out_list[-1])
        full.update({
            "authorPy": text(p["作者拼音"]), "intro": text(p["导读（英文）"]),
            "analysis": text(p["解析（中文）"]), "analysisEn": text(p["解析（英文）"]),
            "background": text(p["作者与背景（英文）"]),
            "pronunciation": INTERNAL.sub("", text(p["读音注意"])),
            # reading voice for gen_audio.py --poems: f = 晓晓 (李清照, poems in a woman's voice), else 云健
            "voice": "f" if text(p.get("朗读声音")) == "女" else "m",
            "version": text(p["版本说明"]), "song": text(p["关联歌曲"]),
            "lines": out_lines,
            "words": [{"w": text(w["字词"]), "py": text(w["拼音"]), "en": text(w["英文"]),
                       "note": text(w["说明（古今对照）"])} for w in words_of.get(pid, [])],
            "imagery": [{"name": m["意象"], "zh": text(m["在本诗中（中文）"]), "en": text(m["在本诗中（英文）"])} for m in pi],
        })
        (OUT / "p" / f"{slug}.json").write_text(json.dumps(full, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    if errors:
        print("\n".join(errors))
        sys.exit(f"{len(errors)} 处错误 — 修改 {SRC.name} 后重跑")

    count = {}
    for p in out_list:
        for m in p["images"]:
            count[m] = count.get(m, 0) + 1
    imagery = sorted(
        ({"zh": k, "py": m["拼音"], "en": m["英文"], "meaning": m["常见象征（中文）"], "meaningEn": m["常见象征（英文）"],
          "count": count[k]} for k, m in img_dict.items() if k in count),
        key=lambda m: -m["count"])
    meta = {"dynasties": [d for d in dynasties], "themes": themes, "imagery": imagery, "poems": out_list}
    (OUT / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    per = {d["key"]: sum(p["dynasty"] == d["key"] for p in out_list) for d in dynasties}
    print(f"{len(out_list)} poems · {sum(len(lines_of.get(p['id'], [])) for p in out_list)} lines · "
          f"{len(imagery)} images · " + " ".join(f"{k}{v}" for k, v in per.items()))


if __name__ == "__main__":
    main()
