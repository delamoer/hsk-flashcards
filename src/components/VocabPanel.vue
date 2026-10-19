<template>
  <div class="vpanel">
    <template v-if="words.length">
      <div class="vp-toolbar">
        <div class="vp-title">常见搭配<i>Common collocations</i><span class="count">本课 {{ words.length }} 词</span></div>
        <div class="hint">点击搭配即可朗读<i>Tap a phrase to listen</i></div>
      </div>

      <!-- LIST: one dictionary entry per word — 词头 left, 搭配 right -->
      <div class="entries">
        <div v-for="(w, i) in words" :key="w.id" class="entry">
          <div class="no">{{ i + 1 }}</div>
          <div class="lemma" :class="{ long: w.hanzi.length >= 5 }">
            <span class="hz">{{ w.hanzi }}</span>
            <span class="meta">
              <span class="l1">
                <span class="py" v-html="py(w)"></span>
                <span v-if="posLabel(w.pos)" class="pos"><b>{{ posLabel(w.pos).zh }}</b>{{ posLabel(w.pos).en }}</span>
              </span>
              <span class="en">{{ w.meaning }}</span>
            </span>
          </div>
          <div class="body">
            <div class="cls">
              <button v-for="(c, j) in w.collocations" :key="j" class="cl" :class="{ on: nowPlaying === c }"
                @click="speak(c)" :title="nowPlaying === c ? '停止 Stop' : '点击朗读 Tap to listen'" v-html="hl(c, w.hanzi)"></button>
            </div>
          </div>
        </div>
      </div>

    </template>

    <div v-else-if="loading" class="placeholder"><div class="diamond">◇ ◇ ◇</div><p>加载中… · Loading…</p></div>
    <div v-else class="placeholder">
      <div class="diamond">◇ ◇ ◇</div>
      <h3>词汇详解</h3>
      <div class="ph-en">Vocabulary</div>
      <p>本课暂无常见搭配，正在陆续补充 · Collocations for this lesson are coming soon.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { getLesson } from "@/data";
import { posLabel } from "@/data/pos";
import { colorPinyin } from "@/utils/pinyinTones";
import { speak, nowPlaying } from "@/utils/tts";
import { useSettings } from "@/composables/useSettings";

const props = defineProps({
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
  lesson: { type: [Number, String], required: true },
});

const { settings } = useSettings();
const words = ref([]);
const loading = ref(true);

watch(
  () => [props.series, props.unit, props.lesson],
  async ([s, u, l]) => {
    loading.value = true;
    const lesson = await getLesson(s, u, l);
    words.value = (lesson?.words || []).filter((w) => w.collocations?.length);
    loading.value = false;
  },
  { immediate: true }
);

const py = (w) => (settings.toneColors ? colorPinyin(w.pinyin) : w.pinyin);

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
// Mark the head word inside a collocation (像 in 长得像). Split forms (像……一样) mark
// each piece; otherwise the word's characters are marked in order wherever they occur,
// which shows a separated 离合词 (打八折 → 打…折) or a partial form (行李箱 → 箱).
function hl(c, hanzi) {
  const text = esc(c);
  const mark = (t) => `<mark>${t}</mark>`;
  for (const head of hanzi.replace(/[（(].*?[)）]/g, "").split("/").filter(Boolean)) {
    if (text.includes(head)) return text.replace(head, mark(head));
    const parts = head.split(/…+/).filter(Boolean);
    if (parts.length > 1 && parts.every((p) => text.includes(p)))
      return parts.reduce((t, p) => t.replace(p, mark(p)), text);
  }
  const chars = [...hanzi.replace(/[（(].*?[)）]|[…/]/g, "")];
  let out = "", from = 0, hit = false;
  for (const ch of chars) {
    const at = text.indexOf(ch, from);
    if (at < 0) continue;
    out += text.slice(from, at) + mark(ch);
    from = at + ch.length;
    hit = true;
  }
  return hit ? out + text.slice(from) : text;
}
</script>

<style scoped>
.vpanel { padding: 26px 0 20px; }

.vp-toolbar { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; padding-bottom: 16px; border-bottom: 1px solid var(--line); }
.vp-title { flex: 1; font-family: var(--serif-cn); font-weight: 600; font-size: 19px; color: var(--ink); display: flex; align-items: baseline; gap: 10px; }
.vp-title i { font-style: normal; font-family: var(--ui); font-weight: 500; font-size: 13px; color: var(--muted); }
.vp-title .count { font-family: var(--han); font-weight: 500; font-size: 13px; color: var(--gold-deep); padding: 1px 10px; border: 1px solid var(--line); border-radius: 99px; align-self: center; }
.hint { display: inline-flex; flex-direction: column; align-items: flex-end; line-height: 1.25; font-family: var(--serif-cn); font-size: 13px; color: var(--accent-active); }
.hint i { font-style: normal; font-family: var(--caps); font-size: 9px; letter-spacing: 1.3px; text-transform: uppercase; color: var(--muted); }

.pos { display: inline-block; font-family: var(--ui); font-weight: 700; font-size: 11px; color: var(--muted); border: 1px solid var(--line); border-radius: 99px; padding: 1px 8px; white-space: nowrap; }
.pos b { font-family: var(--han); font-weight: 700; margin-right: 3px; }
:deep(mark) { background: none; color: var(--cinnabar); font-weight: 700; }

/* LIST: one row per word — 词头 | three tappable collocations */
.entry { display: grid; grid-template-columns: 40px 320px 1fr; gap: 0 22px; align-items: center; padding: 18px 6px; border-bottom: 1px dashed var(--line); }
.no { font-family: var(--serif-en); font-weight: 600; font-size: 22px; color: var(--muted-soft); text-align: right; }
.lemma { display: flex; align-items: center; gap: 16px; min-width: 0; }
.lemma .hz { flex: none; font-family: var(--serif-cn); font-weight: 500; font-size: 38px; line-height: 1.15; color: var(--ink); }
.lemma.long { flex-direction: column; align-items: flex-start; gap: 4px; }
.lemma .meta { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-width: 0; }
.lemma .l1 { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 10px; }
.lemma .py { font-family: var(--ui); font-weight: 700; font-size: 16px; color: var(--primary-strong); }
.lemma .en { font-size: 13.5px; line-height: 1.4; color: var(--body); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.body { min-width: 0; }
.cls { display: flex; flex-wrap: wrap; gap: 10px 12px; }
.cl { font-family: var(--han); font-size: 22px; letter-spacing: 1px; color: var(--ink); padding: 8px 18px; border: 1px solid var(--line); border-radius: 10px; background: var(--paper); transition: .15s; }
.cl:hover { background: var(--accent-soft); border-color: var(--accent); }
.cl.on { background: var(--primary-soft); border-color: var(--cinnabar); box-shadow: 0 0 0 2px rgba(163,63,46,.15); }

.placeholder { text-align: center; padding: 70px 20px; color: var(--muted); }
.placeholder .diamond { color: var(--gold); letter-spacing: 6px; margin-bottom: 14px; }
.placeholder h3 { font-family: var(--serif-cn); font-size: 28px; color: var(--ink-soft, #4a3d2a); letter-spacing: 2px; }
.placeholder .ph-en { font-family: var(--serif-en); font-style: italic; font-size: 16px; margin-top: 4px; }
.placeholder p { max-width: 420px; margin: 14px auto 0; font-size: 14px; }

@media (max-width: 760px) {
  .entry { grid-template-columns: 1fr; gap: 12px; padding: 16px 2px; }
  .no { display: none; }
  .lemma .hz { font-size: 32px; }
  .cl { font-size: 19px; padding: 6px 14px; }
  .vp-title { flex-basis: 100%; flex-wrap: wrap; }
  .hint { align-items: flex-start; }
}
</style>
