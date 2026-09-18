#!/usr/bin/env python3
"""Bootstrap a part-of-speech (词性) draft for every flashcard word.

This produces scripts/pos_draft.tsv — a FIRST PASS only. Confident closed-class
words + "to …" verbs are auto-tagged; everything ambiguous is left as "?" for
manual review. The hand-owned truth is scripts/pos.tsv (curated from this draft).

    uv run python3 scripts/gen_pos_draft.py

Columns: hanzi <TAB> pos <TAB> meaning <TAB> example
POS codes: n v mv a adv pron num mw prep conj part intj  ('?' = needs review)
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data"
OUT = ROOT / "scripts" / "pos_draft.tsv"

PRON = set("我 你 您 他 她 它 我们 咱们 你们 他们 她们 它们 自己 别人 大家 人家 "
           "这 那 这个 那个 这些 那些 这儿 那儿 这里 那里 这样 那样 这么 那么 "
           "谁 什么 哪 哪儿 哪里 哪个 哪些 怎么 怎样 怎么样 多少 几 每 各 某 咱 俺".split())
CONJ = set("和 跟 与 或 或者 而 而且 并且 但 但是 可是 不过 因为 所以 因此 如果 "
           "要是 虽然 但是 不但 不仅 而是 那么 于是 然后 并 既然 无论 不管 只要 只有 "
           "除非 即使 尽管 一边 一面 或是 还是 与其 宁可".split())
PREP = set("把 被 比 从 对 对于 关于 按 按照 根据 由 由于 为 为了 向 往 朝 跟 和 同 "
           "给 替 离 除了 除 于 自 至 沿着 顺着 通过 经过 随着 针对 依照".split())
MODAL = set("会 能 可以 能够 要 应该 应当 该 得 必须 愿意 敢 肯 想 会 可能".split())
PART = set("的 了 着 过 吗 呢 吧 啊 呀 嘛 哇 哦 咯 喽 得 地 所 似的 一样 罢了 而已 来着".split())
INTJ = set("啊 哦 嗯 唉 哎 喂 呀 哈 嘿 咦 哟 呗 哼".split())
NUM = set("零 一 二 三 四 五 六 七 八 九 十 百 千 万 亿 两 半 几 俩".split())
MW = set("个 位 本 张 条 只 双 件 杯 瓶 碗 块 元 角 毛 岁 年 天 次 遍 层 种 辆 家 口 "
         "头 匹 篇 段 句 首 支 枝 把 群 排 座 间 台 部 幅 封 顿 场 节 门 课 副 束 朵".split())

# common English adjective glosses (HSK-frequent) → adjective
ADJ = set("""big small large tall short long high low old new young good bad happy sad
angry busy free tired hungry thirsty hot cold warm cool cheap expensive fast slow
easy difficult hard simple important beautiful pretty handsome ugly clean dirty
quiet noisy bright dark heavy light full empty right wrong same different ready
famous interesting boring delicious tasty healthy sick ill safe dangerous strong weak
rich poor kind polite honest serious careful convenient comfortable warm quiet
red orange yellow green blue purple black white gray grey brown pink
many much few little several fat thin wide narrow deep thick round smart clever
lively lovely lucky happy nervous excited afraid comfortable strange common special
main whole real true false correct sunny cloudy rainy windy snowy""".split())

ADV = set("""very too also already just still again yet only always often usually
sometimes never seldom rarely almost together really quite rather quickly slowly
early late suddenly finally certainly probably maybe perhaps especially exactly
immediately generally recently soon then here there now""".split())


def first_sense(meaning: str) -> str:
    g = (meaning or "").strip().lower()
    g = re.split(r"[;,/(]", g)[0].strip()
    return g


def classify(hanzi: str, meaning: str) -> str:
    g = first_sense(meaning)
    ml = (meaning or "").lower()

    if "measure word" in ml or "mw for" in ml or ml.startswith("(a measure"):
        return "mw"
    if hanzi in PART:
        return "part"
    if hanzi in PRON:
        return "pron"
    # numerals: all chars numeric-ish, or gloss is a bare number word
    if hanzi and all(c in NUM for c in hanzi):
        return "num"
    if g in {"zero","one","two","three","four","five","six","seven","eight","nine","ten",
             "hundred","thousand","half"} or re.fullmatch(r"\d+", g or ""):
        return "num"
    # "to …" is a near-certain verb marker in a bilingual gloss
    if re.match(r"^to\s+\S", g):
        return "v"
    if hanzi in MODAL:
        return "mv"
    if hanzi in CONJ and g in {"and","or","but","because","so","if","although","though",
                               "then","and so","while","however","therefore","moreover"}:
        return "conj"
    if hanzi in PREP and hanzi not in CONJ:
        return "prep"
    if hanzi in INTJ or ml.startswith("(interj") or "exclamation" in ml:
        return "intj"
    if g in ADJ:
        return "a"
    if g in ADV:  # explicit set only — "-ly" suffix misfires on family/belly/friendly
        return "adv"
    return "?"


def main():
    seen = {}
    for f in sorted(DATA.glob("*-*.json")):
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(d, dict) or "lessons" not in d:
            continue
        for lesson in d["lessons"]:
            for w in lesson["words"]:
                h = w["hanzi"]
                if h in seen:
                    continue
                ex = ""
                for e in w.get("examples", []):
                    if e.get("zh"):
                        ex = e["zh"]
                        break
                seen[h] = (w.get("meaning") or "", ex)

    rows = []
    stats = {}
    for h in sorted(seen):
        meaning, ex = seen[h]
        pos = classify(h, meaning)
        stats[pos] = stats.get(pos, 0) + 1
        rows.append(f"{h}\t{pos}\t{meaning}\t{ex}")

    OUT.write_text("\n".join(rows) + "\n", encoding="utf-8")
    print(f"unique words: {len(seen)}  →  {OUT.relative_to(ROOT)}")
    for k in sorted(stats, key=lambda x: -stats[x]):
        print(f"  {k:5} {stats[k]}")


if __name__ == "__main__":
    main()
