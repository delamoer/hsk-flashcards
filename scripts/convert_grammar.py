#!/usr/bin/env python3
"""语法预习复习主表 → src/data/grammar/{series}-{unit}.json (+ grammar/meta.json).

Source of truth: the eight `sources/*_语法预习复习主表.xlsx` files. Each file's first
sheet ("语法总表" / "语法语言点总表") holds one row per grammar point, keyed by 课次
(matching our lesson `num`). We group points by lesson and emit one lazy-loaded chunk
per unit, mirroring convert_texts.py.

Run:  uv run --with openpyxl python3 scripts/convert_grammar.py
"""
import glob
import json
import os
import re
import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "src", "data", "grammar")
NOTE_EN_TSV = os.path.join(ROOT, "scripts", "grammar_note_en.tsv")

CN_VOL = {"一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6}


def load_note_en():
    """Hand-authored English for each 中文 备注 (中文<TAB>English), keyed by exact note text.
    Dedup is automatic — identical notes across files share one entry. Edit the TSV, not JSON."""
    m = {}
    if not os.path.exists(NOTE_EN_TSV):
        return m
    with open(NOTE_EN_TSV, encoding="utf-8") as fh:
        for line in fh:
            line = line.rstrip("\n")
            if not line or line.startswith("#") or "\t" not in line:
                continue
            zh, en = line.split("\t", 1)
            zh, en = zh.strip(), en.strip()
            if zh and en:
                m[zh] = en
    return m


NOTE_EN = {}

# 语法类型 中→英 (hand-authored, concise for a chip). Compound types keep the "/".
TYPE_EN = {
    "副词": "Adverb", "助词": "Particle", "疑问句": "Question", "介词": "Preposition",
    "连词": "Conjunction", "比较句": "Comparison", "时间表达": "Time", "能愿动词": "Modal verb",
    "条件复句": "Conditional", "趋向补语": "Directional compl.", "动词": "Verb", "数量表达": "Quantity",
    "介词结构": "Prep. phrase", "把字句": "把 sentence", "句型": "Sentence pattern",
    "趋向补语引申": "Directional (fig.)", "量词": "Measure word", "程度表达": "Degree",
    "补语": "Complement", "可能补语": "Potential compl.", "并列复句": "Coordinate clause",
    "反问句": "Rhetorical question", "程度结构": "Degree structure", "递进复句": "Progressive clause",
    "副词/形容词": "Adverb / Adjective", "概数表达": "Approx. number", "形容词/副词": "Adjective / Adverb",
    "程度补语": "Degree complement", "固定短语": "Set phrase", "连动句": "Serial-verb sentence",
    "强调句": "Emphatic sentence", "代词": "Pronoun", "重叠结构": "Reduplication",
    "复句": "Complex sentence", "定语": "Attributive", "动量补语": "Verbal-measure compl.",
    "代词结构": "Pronoun structure", "范围结构": "Scope structure", "动词重叠": "Verb reduplication",
    "副词/动词": "Adverb / Verb", "离合词": "Separable verb", "选择复句": "Alternative clause",
    "存现句": "Existential sentence", "固定格式": "Fixed pattern", "承接复句": "Sequential clause",
    "代词用法": "Pronoun usage", "判断句": "Copular sentence", "形容词句": "Adjectival sentence",
    "存在句": "Existential sentence", "祈使句": "Imperative", "的字结构": "的-phrase",
    "动量表达": "Verbal measure", "将来表达": "Future", "否定结构": "Negation",
    "并列结构": "Coordinate structure", "顺序结构": "Sequence structure", "形容词重叠": "Adjective redup.",
    "兼语句": "Pivotal sentence", "被动句": "Passive", "转折复句": "Adversative clause",
    "代词/副词": "Pronoun / Adverb", "名词/副词": "Noun / Adverb", "因果复句": "Cause–effect clause",
    "列举结构": "Enumeration", "补语/固定结构": "Complement / Fixed", "介词性动词": "Coverb",
    "时间副词": "Time adverb", "书面介词": "Formal preposition", "形容词/动词": "Adjective / Verb",
    "代词/定语": "Pronoun / Attributive", "动词/名词": "Verb / Noun", "有字句": "有 sentence",
    "语序": "Word order", "时量补语": "Duration complement", "程度副词": "Degree adverb",
    "位置句": "Location sentence", "方位/时间词": "Locative / Time word", "功能表达": "Functional expr.",
    "进行体": "Progressive aspect", "数字表达": "Number expression", "时间词": "Time word",
    "序数": "Ordinal", "副词结构": "Adverbial structure", "结果补语": "Result complement",
    "伴随结构": "Accompanying structure", "状态补语": "State complement", "让步复句": "Concessive clause",
    "连词/动词": "Conjunction / Verb", "动词/副词": "Verb / Adverb", "可能补语/固定结构": "Potential / Fixed",
    "固定表达": "Fixed expression", "频率副词": "Frequency adverb", "名词/连词": "Noun / Conjunction",
    "连词/介词": "Conjunction / Prep.", "动词/介词": "Verb / Preposition", "强调结构": "Emphatic structure",
    "副词/连词": "Adverb / Conjunction", "让步结构": "Concessive structure", "动词/形容词": "Verb / Adjective",
    "介词/方位词": "Prep. / Locative", "动词/助词化用法": "Verb / Particle-like", "举例结构": "Example structure",
    "动量词": "Verbal measure word", "目的结构": "Purpose structure", "疑问形式": "Question form",
    "顺序连接": "Sequence linker", "条件结构": "Conditional structure", "补语/动词": "Complement / Verb",
    "总结表达": "Summary expression", "进行结构": "Progressive structure", "承接结构": "Sequential structure",
    "疑问/书面表达": "Question / Formal", "书面否定": "Formal negation", "递进/反转复句": "Progressive / Reversal",
    "连接词": "Connective", "书面动词": "Formal verb", "比喻结构": "Simile structure",
    "副词（口语）": "Adverb (colloquial)", "副词（书面）": "Adverb (formal)", "动词结构": "Verb structure",
    "所字结构": "所-phrase", "数词用法": "Numeral usage", "反问副词": "Rhetorical adverb",
    "定语/书面表达": "Attributive / Formal", "副词/连词（书面）": "Adverb / Conj. (formal)",
    "书面被动句": "Formal passive", "书面副词/连词": "Formal adverb / conj.", "紧缩条件句": "Contracted conditional",
    "名词/形容词": "Noun / Adjective", "连接表达": "Connective expression", "比喻/书面定语": "Simile / Formal attr.",
    "量词/动词": "Measure word / Verb", "条件连词": "Conditional conj.", "名词/定语": "Noun / Attributive",
    "数量/列举结构": "Quantity / Enumeration", "可能补语式固定词": "Potential-compl. idiom",
    "动词/名词/量词性名词": "Verb / Noun / M.w.", "比较/选择复句": "Comparison / Alternative",
    "条件副词/名词": "Conditional adv. / Noun", "形容词": "Adjective", "语气词": "Modal particle",
    "结果/趋向补语": "Result / Directional", "基本句型": "Basic sentence pattern", "方位表达": "Locative expr.",
    "序数表达": "Ordinal expression", "进行表达": "Progressive expression", "距离表达": "Distance expression",
    "双宾语句": "Double-object sentence", "量词重叠": "Measure-word redup.", "时间结构": "Time structure",
    "目的复句": "Purpose clause", "范围副词": "Scope adverb", "口语固定格式": "Colloquial fixed pattern",
    "数量重叠": "Quantity reduplication", "时间短语": "Time phrase", "时间/起点结构": "Time / Starting point",
    "介词/动词": "Preposition / Verb",
}

# 练习指令前缀 中→英 (so beginners can understand the task). Keyed by the text before "：".
Q_INSTR_EN = {
    "填空": "Fill in the blank", "翻译": "Translate", "选择": "Choose", "排序": "Reorder the words",
    "连接": "Join the sentences", "补全": "Complete the sentence", "改成否定句": "Make it negative",
    "写中文": "Write in Chinese", "改写": "Rewrite", "改错": "Correct the mistake", "改成否定": "Make it negative",
    "把句子变成问句": "Turn into a question", "写汉字": "Write the characters", "把“的”省略": "Drop 的",
    "把两句连起来": "Join the two sentences", "把句子变成经验问句": "Turn into a 过-question",
    "用“得很”改写": "Rewrite with 得很", "写数字": "Write the number", "写中文日期": "Write the date in Chinese",
    "写中文时间": "Write the time in Chinese", "改成问句": "Turn into a question",
    "把句子变成征求意见": "Turn into a 好吗?-request", "把句子改成禁止": "Turn into a prohibition",
    "改成“可能”": "Rewrite with 可能", "改成可能": "Rewrite with 可能", "用“结果”连接": "Join with 结果",
    "用“否则”连接": "Join with 否则", "用“同时”连接": "Join with 同时", "用“随着”连接": "Join with 随着",
    "用“接着”连接": "Join with 接着", "用“从而”连接": "Join with 从而", "把句子变得更柔和": "Make it softer",
    "把句子变成正反问": "Turn into a V-not-V question", "把句子说得更柔和": "Make it softer",
    "把“吃饭”加入“了”": "Add 了 to 吃饭", "把句子变成猜测问句": "Turn into a 吧-guess question",
    "用“还是……吧”改写": "Rewrite with 还是…吧", "用“没有”改写": "Rewrite with 没有",
    "把两个选择组成问句": "Make a choice question", "用“看起来”改写": "Rewrite with 看起来",
    "用“坏了”改写": "Rewrite with 坏了", "改成不同": "Rewrite with 不同", "用“该……了”改写": "Rewrite with 该…了",
    "用“极了”改写": "Rewrite with 极了", "用“前”改写": "Rewrite with 前", "用“看来”表达": "Express with 看来",
    "用“X什么啊”回答": "Answer with X什么啊",
}


def parse_target(path):
    """filename → (series, unit).  None if unrecognized."""
    base = os.path.basename(path)
    m = re.match(r"HSK(\d)_语法", base)
    if m:
        return ("hsk", int(m.group(1)))
    m = re.match(r"新HSK3\.0_第([一二三四五六])册_语法", base)
    if m:
        return ("newhsk3", CN_VOL[m.group(1)])
    return None


def col_index(header):
    """Map a normalized concept → column index, tolerant of header variants."""
    idx = {h: i for i, h in enumerate(header) if h}

    def find(*names):
        for n in names:
            if n in idx:
                return idx[n]
        return None

    return {
        "id": find("语法编号"),
        "num": find("课次"),
        "lesson": find("课文"),
        "name": find("语法名", "语法名/语言点"),
        "pinyin": find("拼音"),
        "type": find("语法类型"),
        "tier": find("层级标记"),
        "explainEn": find("Very Simple English Explanation"),
        "structure": find("基本结构"),
        "ex_zh": [find(f"例句{k}（中文）") for k in (1, 2, 3)],
        "ex_en": [find(f"例句{k}（英文）") for k in (1, 2, 3)],
        "q": [find(f"练习{k}") for k in (1, 2, 3)],
        "a": [find(f"答案{k}") for k in (1, 2, 3)],
        "note": find("备注", "教学备注"),
        "source": find("来源"),
    }


def s(v):
    return str(v).strip() if v is not None else ""


def convert_file(path):
    target = parse_target(path)
    if not target:
        print("  !! skip (unrecognized name):", os.path.basename(path))
        return None
    series, unit = target
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb.worksheets[0]  # 语法总表 is always sheet 1
    rows = list(ws.iter_rows(values_only=True))
    wb.close()
    c = col_index(rows[0])

    lessons = {}  # num -> {num, title, points:[]}
    for r in rows[1:]:
        if not r or c["num"] is None or r[c["num"]] is None:
            continue
        try:
            num = int(r[c["num"]])
        except (TypeError, ValueError):
            continue

        examples = []
        for zi, ei in zip(c["ex_zh"], c["ex_en"]):
            zh = s(r[zi]) if zi is not None else ""
            en = s(r[ei]) if ei is not None else ""
            if zh:
                examples.append({"zh": zh, "en": en})

        exercises = []
        for qi, ai in zip(c["q"], c["a"]):
            q = s(r[qi]) if qi is not None else ""
            a = s(r[ai]) if ai is not None else ""
            if q:
                ex = {"q": q, "a": a}
                m = re.match(r"^([^：:]{1,10})[：:]\s*(.*)$", q, re.S)
                if m and Q_INSTR_EN.get(m.group(1)):
                    ex["instr"] = m.group(1)
                    ex["instrEn"] = Q_INSTR_EN[m.group(1)]
                    ex["body"] = m.group(2).strip()
                exercises.append(ex)

        point = {
            "id": s(r[c["id"]]) if c["id"] is not None else "",
            "name": s(r[c["name"]]) if c["name"] is not None else "",
            "pinyin": s(r[c["pinyin"]]) if c["pinyin"] is not None else "",
            "type": s(r[c["type"]]) if c["type"] is not None else "",
            "explainEn": s(r[c["explainEn"]]) if c["explainEn"] is not None else "",
            "structure": s(r[c["structure"]]) if c["structure"] is not None else "",
            "examples": examples,
            "exercises": exercises,
            "note": s(r[c["note"]]) if c["note"] is not None else "",
            "source": s(r[c["source"]]) if c["source"] is not None else "",
        }
        if point["note"] and NOTE_EN.get(point["note"]):
            point["noteEn"] = NOTE_EN[point["note"]]
        if point["type"] and TYPE_EN.get(point["type"]):
            point["typeEn"] = TYPE_EN[point["type"]]
        tier = s(r[c["tier"]]) if c["tier"] is not None else ""
        if tier:
            point["tier"] = tier
        if not point["name"]:
            continue

        L = lessons.setdefault(num, {"num": num, "title": s(r[c["lesson"]]) if c["lesson"] is not None else "", "points": []})
        if not L["title"] and c["lesson"] is not None:
            L["title"] = s(r[c["lesson"]])
        L["points"].append(point)

    ordered = [lessons[n] for n in sorted(lessons)]
    point_count = sum(len(l["points"]) for l in ordered)
    data = {"series": series, "unit": unit, "lessons": ordered}
    return (f"{series}-{unit}", data, {"lessonCount": len(ordered), "pointCount": point_count})


def main():
    global NOTE_EN
    NOTE_EN = load_note_en()
    print(f"  note_en: {len(NOTE_EN)} 条英文备注")
    os.makedirs(OUT_DIR, exist_ok=True)
    files = sorted(glob.glob(os.path.join(ROOT, "sources", "*语法预习复习主表*.xlsx")))
    meta = {}
    total_pts = 0
    for f in files:
        res = convert_file(f)
        if not res:
            continue
        key, data, m = res
        with open(os.path.join(OUT_DIR, f"{key}.json"), "w", encoding="utf-8") as fh:
            json.dump(data, fh, ensure_ascii=False, separators=(",", ":"))
        meta[key] = m
        total_pts += m["pointCount"]
        print(f"  ✓ {key}: {m['lessonCount']} 课, {m['pointCount']} 语法点")
    with open(os.path.join(OUT_DIR, "meta.json"), "w", encoding="utf-8") as fh:
        json.dump(meta, fh, ensure_ascii=False, indent=0)
    print(f"共 {len(meta)} 册, {total_pts} 语法点 → {OUT_DIR}")


if __name__ == "__main__":
    main()
