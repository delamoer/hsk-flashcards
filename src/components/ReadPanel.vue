<template>
  <div class="readpanel">
    <template v-if="texts.length">
      <div class="text-card" v-for="(t, ti) in texts" :key="ti">
        <div class="tc-head">
          <div class="tno">
            <span class="badge">TEXT {{ t.n }}</span>
            <span class="cn">{{ t.title }}</span>
          </div>
          <div class="toggles" v-if="t.hasPy || t.hasEn">
            <button v-if="t.hasPy" :class="{ on: state[ti].py }" @click="state[ti].py = !state[ti].py">拼音 PINYIN</button>
            <button v-if="t.hasEn" :class="{ on: state[ti].en }" @click="state[ti].en = !state[ti].en">EN</button>
          </div>
        </div>
        <div class="tc-body">
          <div class="line" v-for="(l, li) in t.lines" :key="li">
            <div class="who"><div class="cn">{{ l.name }}</div></div>
            <div class="speech">
              <div class="zh">{{ l.zh }}</div>
              <div v-if="state[ti].py && l.py" class="py" v-html="pyHtml(l.py)"></div>
              <div v-if="state[ti].en && l.en" class="en">{{ l.en }}</div>
            </div>
            <button class="play" @click="say(l.zh)" title="朗读 Play">🔊</button>
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="loading" class="placeholder"><div class="diamond">◇ ◇ ◇</div><p>加载中… · Loading…</p></div>
    <div v-else class="placeholder">
      <div class="diamond">◇ ◇ ◇</div>
      <h3>本课暂无课文</h3>
      <div class="en">No text for this lesson yet</div>
      <p>这一课暂未收录对话课文，可先学「生词表·闪卡」。· Study the flashcards tab meanwhile.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { getTextUnit } from "@/data/texts";
import { colorPinyin } from "@/utils/pinyinTones";
import { speak } from "@/utils/tts";
import { useSettings } from "@/composables/useSettings";

const props = defineProps({
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
  lesson: { type: [Number, String], required: true },
});

const { settings } = useSettings();
const texts = ref([]);
const state = reactive([]); // per-text-card { py, en } toggles
const loading = ref(true);

function splitLines(original) {
  return (original || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^([^：:]{1,8})[：:](.*)$/);
      return m ? { name: m[1], zh: m[2].trim(), py: "", en: "" } : { name: "", zh: line, py: "", en: "" };
    });
}

watch(
  () => [props.series, props.unit, props.lesson],
  async ([s, u, l]) => {
    loading.value = true;
    texts.value = [];
    state.splice(0);
    const ds = await getTextUnit(s, u);
    const ld = ds?.lessons.find((x) => x.num === Number(l));
    if (ld) {
      texts.value = ld.texts.map((t) => {
        const lines = t.lines?.length ? t.lines : splitLines(t.original);
        return {
          n: t.n,
          title: t.title,
          lines,
          hasPy: lines.some((l) => l.py),
          hasEn: lines.some((l) => l.en),
        };
      });
      texts.value.forEach(() => state.push({ py: true, en: true }));
    }
    loading.value = false;
  },
  { immediate: true }
);

function pyHtml(py) {
  return settings.toneColors ? colorPinyin(py) : py;
}
function say(t) {
  speak(t, { rate: settings.ttsRate });
}
</script>

<style scoped>
.readpanel { padding: 30px 0 20px; }
.text-card {
  background: linear-gradient(165deg, #fbf7ee, #f3ead9); border: 1px solid var(--line); border-radius: 12px;
  padding: 0; margin-bottom: 26px; box-shadow: 0 4px 14px -8px var(--shadow, rgba(45,30,10,.14)); overflow: hidden; position: relative;
}
.text-card::before { content: ""; position: absolute; inset: 8px; border: 1px solid var(--line-soft); border-radius: 8px; pointer-events: none; }
.tc-head { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 16px 24px; border-bottom: 1px solid var(--line); background: linear-gradient(90deg, rgba(200,150,42,.08), transparent); }
.tc-head .tno { display: flex; align-items: center; gap: 12px; }
.tc-head .tno .badge { background: linear-gradient(145deg, #c0392b, #8b2a1f); color: #fbeecf; font-family: var(--caps); font-size: 11px; letter-spacing: 1.5px; padding: 4px 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(139,42,31,.35); }
.tc-head .tno .cn { font-family: var(--serif-cn); font-weight: 700; font-size: 19px; letter-spacing: 1px; }
.toggles { display: flex; gap: 8px; }
.toggles button { font-family: var(--caps); font-size: 10px; letter-spacing: 1.5px; padding: 5px 12px; border: 1px solid var(--line); background: var(--paper); border-radius: 99px; color: var(--muted); transition: .2s; }
.toggles button.on { background: var(--gold); color: #fff8ea; border-color: var(--gold-deep); }
.tc-body { padding: 8px 24px 20px; }
.line { display: grid; grid-template-columns: 118px 1fr auto; gap: 16px; align-items: start; padding: 15px 4px; border-bottom: 1px dashed var(--line-soft); }
.line:last-child { border-bottom: none; }
.line .who { text-align: right; }
.line .who .cn { font-family: var(--serif-cn); font-weight: 600; font-size: 16px; color: var(--cinnabar-dk); }
.line .speech .zh { font-family: var(--serif-cn); font-size: 26px; letter-spacing: 2px; color: var(--ink); line-height: 1.4; }
.line .speech .py { font-family: var(--ui); font-weight: 700; font-size: 16px; color: var(--gold-deep); letter-spacing: .3px; margin-top: 3px; }
.line .speech .en { font-size: 14px; color: var(--muted); margin-top: 2px; }
.play { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--line); background: var(--paper); font-size: 14px; color: var(--gold-deep); transition: .2s; flex: 0 0 auto; }
.play:hover { background: var(--gold); color: #fff8ea; border-color: var(--gold-deep); transform: scale(1.08); }

.placeholder { text-align: center; padding: 70px 20px; color: var(--muted); }
.placeholder .diamond { color: var(--gold); letter-spacing: 6px; margin-bottom: 14px; }
.placeholder h3 { font-family: var(--serif-cn); font-size: 28px; color: var(--ink-soft, #4a3d2a); letter-spacing: 2px; }
.placeholder .en { font-family: var(--serif-en); font-style: italic; font-size: 16px; margin-top: 4px; }
.placeholder p { max-width: 460px; margin: 14px auto 0; font-size: 14px; }

@media (max-width: 720px) {
  .line { grid-template-columns: 1fr auto; }
  .line .who { text-align: left; }
}
</style>
