<template>
  <div class="gnp">
    <template v-if="points.length">
      <div class="gn-head">
        <div class="kicker">本课语法点 · Grammar</div>
      </div>
      <div class="glist">
        <div class="gcard" v-for="(p, i) in points" :key="p.id || i">
          <div class="gc-head">
            <span class="idx">{{ String(i + 1).padStart(2, "0") }}</span>
            <span class="nm">{{ p.name }}</span>
            <span class="chip type" v-if="p.type">
              <span class="c">{{ p.type }}</span>
              <span class="e" v-if="p.typeEn">{{ p.typeEn }}</span>
            </span>
          </div>
          <div class="py" v-if="p.pinyin" v-html="pyHtml(p.pinyin)"></div>
          <p class="explain" v-if="p.explainEn">{{ p.explainEn }}</p>
          <div class="struct" v-if="p.structure">
            <span class="lab">结构 Structure</span>
            <code>{{ p.structure }}</code>
          </div>
          <div class="egs" v-if="p.examples.length">
            <div class="eg" v-for="(e, ei) in p.examples" :key="ei">
              <div class="z">{{ e.zh }}</div>
              <div class="e" v-if="e.en">{{ e.en }}</div>
            </div>
          </div>
          <div class="gnote" v-if="p.note || p.noteEn">
            <span class="zh">※ {{ p.note }}</span>
            <span class="en" v-if="p.noteEn">{{ p.noteEn }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- fallback: 课文里的语法 note（本课无语法主表时） -->
    <template v-else-if="fallbackItems.length">
      <div class="gn-head">
        <div class="kicker">本课语法点 · Grammar</div>
      </div>
      <div class="notes">
        <div class="mnote" v-for="(nt, i) in fallbackItems" :key="i">
          <div class="lab">{{ String(i + 1).padStart(2, "0") }}</div>
          <div class="gp">{{ nt }}</div>
        </div>
      </div>
    </template>

    <div v-else-if="loading" class="placeholder"><div class="diamond">◇ ◇ ◇</div><p>加载中… · Loading…</p></div>
    <div v-else class="placeholder">
      <div class="diamond">◇ ◇ ◇</div>
      <h3>本课暂无语法点</h3>
      <div class="en">No grammar notes for this lesson</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { getGrammarLesson } from "@/data/grammar";
import { getTextUnit } from "@/data/texts";
import { colorPinyin } from "@/utils/pinyinTones";
import { useSettings } from "@/composables/useSettings";

const props = defineProps({
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
  lesson: { type: [Number, String], required: true },
});

const { settings } = useSettings();
const points = ref([]);
const fallbackNote = ref("");
const loading = ref(true);

watch(
  () => [props.series, props.unit, props.lesson],
  async ([s, u, l]) => {
    loading.value = true;
    points.value = [];
    fallbackNote.value = "";
    const gl = await getGrammarLesson(s, u, l);
    if (gl && gl.points && gl.points.length) {
      points.value = gl.points;
    } else {
      const ds = await getTextUnit(s, u);
      const ld = ds?.lessons.find((x) => x.num === Number(l));
      fallbackNote.value = ld?.texts.map((t) => t.note).find(Boolean) || "";
    }
    loading.value = false;
  },
  { immediate: true }
);

const fallbackItems = computed(() =>
  (fallbackNote.value || "")
    .split(/[；;、\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
);

function pyHtml(py) {
  return settings.toneColors ? colorPinyin(py) : py;
}
</script>

<style scoped>
.gnp { padding: 30px 0 20px; }
.gn-head { margin-bottom: 24px; }
.kicker { font-family: var(--caps); font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold-deep); }

.glist { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 18px; align-items: start; }
.gcard {
  position: relative; background: linear-gradient(160deg, #fbf6ec, #f3ead9); border: 1px solid var(--line);
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
.struct { display: flex; align-items: center; gap: 12px; margin-top: 14px; background: var(--paper-3); border: 1px dashed var(--border-strong); border-radius: 8px; padding: 10px 14px; }
.struct .lab { font-family: var(--caps); font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold-deep); flex: 0 0 auto; }
.struct code { font-family: var(--serif-cn); font-size: 16px; font-weight: 600; color: var(--ink); letter-spacing: .5px; }

.egs { margin-top: 16px; display: grid; gap: 10px; }
.eg { border-left: 2px solid var(--gold-lt); padding-left: 12px; }
.eg .z { font-family: var(--serif-cn); font-size: 16px; color: var(--ink); line-height: 1.5; }
.eg .e { font-family: var(--serif-en); font-style: italic; font-size: 13.5px; color: var(--muted); margin-top: 2px; }

.gnote { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--line-soft); }
.gnote .zh { display: block; font-size: 12.5px; color: var(--muted); line-height: 1.5; }
.gnote .en { display: block; font-family: var(--serif-en); font-style: italic; font-size: 13px; color: var(--muted-soft); line-height: 1.45; margin-top: 3px; }

/* fallback note list */
.notes { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
.mnote { position: relative; display: flex; gap: 14px; align-items: flex-start; background: linear-gradient(160deg, #fbf6ec, #f3ead9); border: 1px solid var(--line); border-radius: 10px; padding: 16px 18px; box-shadow: 0 3px 10px -6px var(--shadow, rgba(45,30,10,.14)); }
.mnote::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; border-radius: 10px 0 0 10px; background: linear-gradient(180deg, var(--gold-lt), var(--gold-deep)); }
.mnote .lab { font-family: var(--caps); font-size: 12px; font-weight: 700; color: var(--gold-deep); flex: 0 0 auto; margin-top: 2px; }
.mnote .gp { font-family: var(--serif-cn); font-weight: 600; font-size: 17px; color: var(--cinnabar-dk); line-height: 1.4; }

.placeholder { text-align: center; padding: 70px 20px; color: var(--muted); }
.placeholder .diamond { color: var(--gold); letter-spacing: 6px; margin-bottom: 14px; }
.placeholder h3 { font-family: var(--serif-cn); font-size: 28px; color: var(--ink-soft, #4a3d2a); letter-spacing: 2px; }
.placeholder .en { font-family: var(--serif-en); font-style: italic; font-size: 16px; margin-top: 4px; }
</style>
