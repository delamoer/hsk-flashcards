<template>
  <div class="gcard" :class="{ large }">
    <div class="gc-head">
      <span class="idx" v-if="index">{{ String(index).padStart(2, "0") }}</span>
      <span class="nm" v-html="mark(point.name)"></span>
      <span class="chip type" v-if="point.type">
        <span class="c">{{ point.type }}</span>
        <span class="e" v-if="point.typeEn">{{ point.typeEn }}</span>
      </span>
    </div>
    <div class="py" v-if="point.pinyin" v-html="pyHtml(point.pinyin)"></div>
    <p class="explain" v-if="point.explainEn" v-html="mark(point.explainEn)"></p>
    <div class="struct" v-if="point.structure">
      <span class="lab">结构 Structure</span>
      <span class="scode">
        <code v-html="mark(point.structure)"></code>
        <code class="en" v-if="point.structureEn">{{ point.structureEn }}</code>
      </span>
    </div>
    <div class="egs" v-if="point.examples?.length">
      <div class="eg" v-for="(e, ei) in point.examples" :key="ei">
        <div class="z" v-html="mark(e.zh)"></div>
        <div class="p" v-if="e.py" v-html="pyHtml(e.py)"></div>
        <div class="e" v-if="e.en">{{ e.en }}</div>
      </div>
    </div>
    <div class="gnote" v-if="point.note || point.noteEn">
      <span class="zh">※ {{ point.note }}</span>
      <span class="en" v-if="point.noteEn">{{ point.noteEn }}</span>
    </div>
    <slot />
  </div>
</template>

<script setup>
// One grammar point as a card — shared by the lesson hub's 语法 tab (GrammarNotesPanel)
// and the 语法汇总 page (GrammarIndexView), so both always look the same.
import { colorPinyin } from "@/utils/pinyinTones";
import { useSettings } from "@/composables/useSettings";
import { highlight } from "@/utils/grammarSearch";

const props = defineProps({
  point: { type: Object, required: true },
  index: { type: Number, default: 0 }, // 本课序号; 0 = hide
  query: { type: String, default: "" }, // 汇总页搜索词 → 朱红高亮
  large: { type: Boolean, default: false }, // 汇总页展台：字号略大
});

const { settings } = useSettings();
function pyHtml(py) {
  return settings.toneColors ? colorPinyin(py) : py;
}
function mark(text) {
  return highlight(text, props.query);
}
</script>

<style scoped>
.gcard {
  position: relative; overflow: hidden; border: 1px solid var(--line);
  background:
    linear-gradient(rgba(250,245,235,.85), rgba(244,236,219,.85)),
    url("../assets/img/motif/bamboo.webp") right -10px bottom -6px / auto 150px no-repeat,
    linear-gradient(160deg, #fbf6ec, #f3ead9);
  border-radius: 12px; padding: 22px 24px 20px; box-shadow: 0 3px 12px -7px var(--shadow, rgba(45,30,10,.14));
}
.gcard::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; border-radius: 12px 0 0 12px; background: linear-gradient(180deg, var(--gold-lt), var(--gold-deep)); }

.gc-head { display: flex; align-items: baseline; gap: 10px; }
.gc-head .idx { font-family: var(--caps); font-size: 12px; font-weight: 700; color: var(--gold-deep); flex: 0 0 auto; }
.gc-head .nm { flex: 1; min-width: 0; font-family: var(--serif-cn); font-weight: 700; font-size: 20px; color: var(--cinnabar-dk); line-height: 1.35; }
.chip { flex: 0 0 auto; align-self: flex-start; }
.chip.type { display: inline-flex; flex-direction: column; align-items: center; line-height: 1.15; padding: 3px 10px; border-radius: 8px; background: var(--accent-soft); color: var(--accent-active); white-space: nowrap; }
.chip.type .c { font-family: var(--han); font-size: 10.5px; font-weight: 700; }
.chip.type .e { font-family: var(--serif-en); font-style: italic; font-size: 9px; opacity: .85; margin-top: 1px; }
.py { font-family: var(--ui); font-size: 14px; font-weight: 600; color: var(--muted); margin-top: 4px; }

.explain { font-size: 14px; line-height: 1.55; color: var(--ink-soft, #4a3d2a); margin-top: 14px; }
.struct { display: flex; align-items: baseline; gap: 12px; margin-top: 14px; background: var(--paper-3); border: 1px dashed var(--border-strong); border-radius: 8px; padding: 10px 14px; }
.struct .lab { font-family: var(--caps); font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold-deep); flex: 0 0 auto; }
.struct .scode { display: grid; gap: 2px; min-width: 0; }
.struct code { font-family: var(--serif-cn); font-size: 16px; font-weight: 600; color: var(--ink); letter-spacing: .5px; }
.struct code.en { font-family: var(--serif-en); font-style: italic; font-size: 13px; font-weight: 400; letter-spacing: 0; color: var(--muted); }

.egs { margin-top: 16px; display: grid; gap: 10px; }
.eg { border-left: 2px solid var(--gold-lt); padding-left: 12px; }
.eg .z { font-family: var(--serif-cn); font-size: 16px; color: var(--ink); line-height: 1.5; }
.eg .p { font-family: var(--ui); font-size: 13px; color: var(--muted); line-height: 1.4; margin-top: 1px; }
.eg .e { font-family: var(--serif-en); font-style: italic; font-size: 13.5px; color: var(--muted); margin-top: 2px; }

.gnote { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--line-soft); }
.gnote .zh { display: block; font-size: 12.5px; color: var(--muted); line-height: 1.5; }
.gnote .en { display: block; font-family: var(--serif-en); font-style: italic; font-size: 13px; color: var(--muted-soft); line-height: 1.45; margin-top: 3px; }

.gcard.large { padding: 26px 28px 22px; }
.gcard.large .gc-head .nm { font-size: 24px; }
.gcard.large .eg .z { font-size: 17.5px; }

.gcard :deep(mark) { background: none; color: var(--cinnabar); font-weight: 800; box-shadow: inset 0 -.35em 0 rgba(163,63,46,.13); }
</style>
