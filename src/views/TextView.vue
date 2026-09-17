<template>
  <div class="tv" v-if="text">
    <!-- ============ shared chrome ============ -->
    <div class="chrome">
      <div class="crumb">
        <router-link to="/texts">课文 <span class="dim">Texts</span></router-link>
        <span class="sep">/</span>
        <router-link :to="`/texts/${series}/${unit}`" class="lvl">{{ unitLabel }}</router-link>
        <span class="sep">/</span>
        <span class="here">第 {{ lesson }} 课 · {{ lessonData.name }}</span>
      </div>

      <div class="title-row">
        <div class="tt">
          <h1><span class="lesson-no">第 {{ lesson }} 课　</span>{{ lessonData.name }}</h1>
          <div class="en">{{ text.title }} · 对话精读 Dialogue close-reading</div>
        </div>
        <router-link class="fc-link" :to="flashcardLink">
          <span class="ic">📇</span>
          <span><b>背本课生词</b><small>FLASHCARDS →</small></span>
        </router-link>
      </div>

      <div class="tabs" v-if="lessonData.texts.length > 1">
        <router-link
          v-for="t in lessonData.texts"
          :key="t.n"
          :to="`/texts/${series}/${unit}/${lesson}/${t.n}`"
          class="tab"
          :class="{ on: t.n === Number(n) }"
        >课文 {{ t.n }}<small>Text {{ t.n }}</small></router-link>
      </div>

      <div class="modes">
        <button class="mode" :class="{ on: mode === 'read' }" @click="mode = 'read'">
          <span class="mn">1</span>读原文<small>Read</small>
        </button>
        <button v-if="text.vocab" class="mode" :class="{ on: mode === 'vocab' }" @click="mode = 'vocab'">
          <span class="mn">2</span>生词挖空<small>Vocab</small>
        </button>
        <button v-if="hasGrammar" class="mode" :class="{ on: mode === 'grammar' }" @click="mode = 'grammar'">
          <span class="mn">3</span>连词成句<small>Grammar</small>
        </button>
      </div>
    </div>

    <!-- ============ ① READ ============ -->
    <div v-if="mode === 'read'" class="panel read" :class="{ solo: !noteItems.length }">
      <div class="col-text paper-bg">
        <div class="kicker">对话 · Dialogue</div>
        <h2>{{ text.title }}</h2>
        <div class="divider"></div>

        <div class="line" v-for="(d, i) in dialogue" :key="i">
          <div class="speaker"><div class="name">{{ d.name }}</div></div>
          <div class="speech">
            <div class="zh">
              {{ d.speech }}
              <button class="spk" @click="say(d.speech)" title="朗读">🔊</button>
            </div>
          </div>
        </div>
      </div>

      <aside class="col-notes" v-if="noteItems.length">
        <div class="notes-head">本课语法点<span class="en">Grammar · whole lesson</span></div>
        <div class="notes-rule"></div>
        <p class="notes-sub">整课共用，分布在本课各篇课文中 · shared across all texts in this lesson</p>
        <div class="mnote" v-for="(nt, i) in noteItems" :key="i">
          <div class="lab">{{ String(i + 1).padStart(2, "0") }}</div>
          <div class="gp">{{ nt }}</div>
        </div>
      </aside>
    </div>

    <!-- ============ ② VOCAB ============ -->
    <div v-else-if="mode === 'vocab'" class="panel">
      <div class="vocab paper-bg">
        <div class="lede">点词库里的词填进空里。 · Tap a word to fill the next blank; tap a filled blank to clear.</div>

        <div class="cloze han">
          <template v-for="(part, i) in text.vocab.seg" :key="i">
            <span v-if="part.t" class="frag">{{ part.t }}</span>
            <button v-else class="blank" :class="slotClass(part.b)" @click="clearBlank(part.b)">
              <span class="qn">{{ part.b }}</span>{{ vFill[part.b] ? vFill[part.b].text : "＿＿" }}
            </button>
          </template>
        </div>

        <div class="bank">
          <div class="bank-head"><b>词库</b><small>Word bank</small></div>
          <div class="tiles">
            <button
              v-for="chip in vBank"
              :key="chip.id"
              class="tile"
              :title="tileMeaning(chip.text)"
              @click="placeVocab(chip)"
            >
              <span class="tw">{{ chip.text }}</span>
              <span v-if="flashMap[chip.text]" class="tpy" v-html="tilePy(chip.text)"></span>
            </button>
            <span v-if="!vBank.length && !vChecked" class="bank-empty">全部填好，点「对答案」· all filled</span>
          </div>
        </div>

        <div class="actionrow">
          <button class="btn btn-primary" :disabled="vBank.length" @click="vChecked = true">对答案<small>CHECK</small></button>
          <button class="btn btn-ghost" @click="resetVocab">重来<small>RESET</small></button>
          <span v-if="vChecked" class="score" :class="{ mixed: vScore < vTotal }">
            <span class="dot"></span>{{ vScore }} / {{ vTotal }} 正确 · correct
          </span>
        </div>
      </div>
    </div>

    <!-- ============ ③ GRAMMAR · 整段复原 ============ -->
    <div v-else-if="mode === 'grammar' && curSentence" class="panel">
      <div class="grammar">
        <div class="ghead">
          <div class="lede">把打乱的词排成这句话。 · Tap the words in order to rebuild the line.</div>
          <div class="gprogress">
            <span class="gcount">句 {{ gi + 1 }} / {{ sentences.length }}</span>
            <div class="gbar"><i :style="{ width: ((gi + (gChecked && gCorrect ? 1 : 0)) / sentences.length) * 100 + '%' }"></i></div>
          </div>
        </div>

        <div class="gspeaker" v-if="curSentence.speaker">
          <span class="gs-name">{{ curSentence.speaker }}</span>
          <span class="gs-say">说：</span>
        </div>

        <div class="slot" :class="{ empty: !gPlaced.length, solved: gChecked && gCorrect, bad: gChecked && !gCorrect }">
          <button
            v-for="(chip, i) in gPlaced"
            :key="chip.id"
            class="gtile placed"
            :class="{ drag: !gChecked }"
            :draggable="!gChecked"
            @dragstart="onDragStart(i)"
            @dragover.prevent
            @drop="onDrop(i)"
            @dragend="dragFrom = -1"
            @click="onPlacedClick(i)"
          >{{ chip.text }}</button>
        </div>
        <p class="ghint" v-if="gPlaced.length > 1 && !gChecked">拖动可调整顺序，点一下移回词库 · drag to reorder, tap to remove</p>

        <div class="bank-tiles">
          <button v-for="chip in gBank" :key="chip.id" class="gtile" @click="placeG(chip)">{{ chip.text }}</button>
        </div>

        <div class="actionrow">
          <button class="btn btn-primary" :disabled="gBank.length" @click="gChecked = true">对答案<small>CHECK</small></button>
          <button class="btn btn-ghost" @click="buildSentence">重来<small>RESET</small></button>
          <span v-if="gChecked && gCorrect" class="solved-badge"><span class="check">✓</span>正确 · Correct</span>
          <span v-else-if="gChecked" class="score mixed"><span class="dot"></span>答案：{{ curSentence.text }}</span>
          <button
            v-if="gChecked && gi < sentences.length - 1"
            class="btn btn-primary"
            style="margin-left:auto"
            @click="nextSentence"
          >下一句<small>NEXT</small></button>
          <span v-else-if="gChecked && gCorrect" class="alldone">🎉 整段复原完成 · Whole text done!</span>
        </div>
        <div class="answer-hint" v-if="gChecked">全句：<b>{{ curSentence.text }}</b></div>
      </div>
    </div>

    <!-- ============ pager ============ -->
    <div class="pager">
      <router-link
        v-if="Number(n) > 1"
        class="pg prev"
        :to="`/texts/${series}/${unit}/${lesson}/${Number(n) - 1}`"
      >
        <div class="dir">← 上一篇 Previous</div>
        <div class="t">{{ lessonData.texts[Number(n) - 2].title }}</div>
      </router-link>
      <span v-else class="pg-spacer"></span>
      <router-link
        v-if="Number(n) < lessonData.texts.length"
        class="pg next"
        :to="`/texts/${series}/${unit}/${lesson}/${Number(n) + 1}`"
      >
        <div class="dir">下一篇 Next →</div>
        <div class="t">{{ lessonData.texts[Number(n)].title }}</div>
      </router-link>
      <span v-else class="pg-spacer"></span>
    </div>
  </div>

  <div class="tv" v-else-if="loading"><p class="muted">加载中… · Loading…</p></div>
  <div class="tv" v-else><p class="muted">课文不存在 · Text not found.</p></div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { getTextUnit } from "@/data/texts";
import { getLesson } from "@/data";
import { getSeries } from "@/data/courses.js";
import { colorPinyin } from "@/utils/pinyinTones";
import { speak } from "@/utils/tts";
import { useSettings } from "@/composables/useSettings";

const props = defineProps({
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
  lesson: { type: [Number, String], required: true },
  n: { type: [Number, String], required: true },
});

const { settings } = useSettings();

const ds = ref(null);
const loading = ref(true);
watch(
  () => [props.series, props.unit],
  async ([s, u]) => {
    loading.value = true;
    ds.value = await getTextUnit(s, u);
    loading.value = false;
  },
  { immediate: true }
);

const lessonData = computed(() => {
  if (!ds.value) return null;
  return ds.value.lessons.find((l) => l.num === Number(props.lesson)) || null;
});
const text = computed(() => {
  const ld = lessonData.value;
  if (!ld) return null;
  return ld.texts.find((t) => t.n === Number(props.n)) || null;
});

const seriesMeta = computed(() => getSeries(props.series));
const unitLabel = computed(() => {
  const u = seriesMeta.value?.units.find((u) => u.id === Number(props.unit));
  return u?.label || `Unit ${props.unit}`;
});
const flashcardLink = computed(() => `/course/${props.series}/${props.unit}/lesson/${props.lesson}`);

// Flashcard link-up: pull pinyin/meaning for this lesson's words so vocab tiles
// can show tone-colored pinyin + a meaning tooltip (课文 ↔ 闪卡 联动).
const flashMap = ref({});
watch(
  () => [props.series, props.unit, props.lesson],
  async ([s, u, l]) => {
    const les = await getLesson(s, u, l);
    const m = {};
    if (les) for (const w of les.words) if (!m[w.hanzi]) m[w.hanzi] = { pinyin: w.pinyin, meaning: w.meaning };
    flashMap.value = m;
  },
  { immediate: true }
);
function tilePy(word) {
  const e = flashMap.value[word];
  if (!e) return "";
  return settings.toneColors ? colorPinyin(e.pinyin) : e.pinyin;
}
function tileMeaning(word) {
  return flashMap.value[word]?.meaning || "";
}

// Split each original line "说话人：内容" into a speaker + speech pair.
const dialogue = computed(() =>
  (text.value?.original || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^([^：:]{1,8})[：:](.*)$/);
      return m ? { name: m[1], speech: m[2].trim() } : { name: "", speech: line };
    })
);

// Grammar points are a WHOLE-LESSON list (identical across all 课文 of a lesson
// in the source) — shown as a shared reference, not tied to this specific text.
const noteItems = computed(() =>
  (text.value?.note || "")
    .split(/[；;、\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
);

const sentences = computed(() => text.value?.sentences || []);
const hasGrammar = computed(() => sentences.value.length > 0);

const mode = ref("read");

function say(t) {
  speak(t, { rate: settings.ttsRate });
}

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── VOCAB ──────────────────────────────────────────────────────────────────
const vBank = ref([]);
const vFill = ref({});
const vChecked = ref(false);
const blankNums = computed(() =>
  (text.value?.vocab?.seg || []).filter((p) => p.b != null).map((p) => p.b)
);
const vAnswers = computed(() => text.value?.vocab?.answers || []);

function resetVocab() {
  vBank.value = shuffle(vAnswers.value.map((t, i) => ({ id: `v${i}`, text: t })));
  vFill.value = {};
  vChecked.value = false;
}
function placeVocab(chip) {
  if (vChecked.value) return;
  const next = blankNums.value.find((b) => !vFill.value[b]);
  if (next == null) return;
  vFill.value = { ...vFill.value, [next]: chip };
  vBank.value = vBank.value.filter((c) => c.id !== chip.id);
}
function clearBlank(b) {
  if (vChecked.value) return;
  const chip = vFill.value[b];
  if (!chip) return;
  const copy = { ...vFill.value };
  delete copy[b];
  vFill.value = copy;
  vBank.value = [...vBank.value, chip];
}
function slotClass(b) {
  if (!vChecked.value) return vFill.value[b] ? "filled" : "empty";
  return vFill.value[b] && vFill.value[b].text === vAnswers.value[b - 1] ? "correct" : "wrong";
}
const vTotal = computed(() => blankNums.value.length);
const vScore = computed(
  () => blankNums.value.filter((b) => vFill.value[b] && vFill.value[b].text === vAnswers.value[b - 1]).length
);

// ── GRAMMAR (连词成句 · 整段复原, one sentence at a time) ─────────────────────
const gi = ref(0); // current sentence index within the text
const gBank = ref([]);
const gPlaced = ref([]);
const gChecked = ref(false);
const curSentence = computed(() => sentences.value[gi.value] || null);

function buildSentence() {
  const toks = curSentence.value?.tokens || [];
  gBank.value = shuffle(toks.map((t, i) => ({ id: `g${i}`, text: t })));
  gPlaced.value = [];
  gChecked.value = false;
}
function resetGrammar() {
  gi.value = 0;
  buildSentence();
}
function placeG(chip) {
  if (gChecked.value) return;
  gPlaced.value = [...gPlaced.value, chip];
  gBank.value = gBank.value.filter((c) => c.id !== chip.id);
}
function removeG(idx) {
  if (gChecked.value) return;
  const chip = gPlaced.value[idx];
  gPlaced.value = gPlaced.value.filter((_, i) => i !== idx);
  gBank.value = [...gBank.value, chip];
}
// drag-to-reorder placed tiles (desktop); click still removes (touch fallback)
const dragFrom = ref(-1);
let dragMoved = false;
function onDragStart(i) {
  if (gChecked.value) return;
  dragFrom.value = i;
  dragMoved = false;
}
function onDrop(i) {
  if (gChecked.value || dragFrom.value < 0) return;
  dragMoved = true;
  const from = dragFrom.value;
  dragFrom.value = -1;
  if (from === i) return;
  const arr = gPlaced.value.slice();
  const [m] = arr.splice(from, 1);
  arr.splice(i, 0, m);
  gPlaced.value = arr;
}
function onPlacedClick(i) {
  if (dragMoved) {
    dragMoved = false;
    return;
  }
  removeG(i);
}
const gCorrect = computed(() => {
  const toks = curSentence.value?.tokens || [];
  return gPlaced.value.length === toks.length && gPlaced.value.every((c, i) => c.text === toks[i]);
});
function nextSentence() {
  if (gi.value < sentences.value.length - 1) {
    gi.value++;
    buildSentence();
  }
}

watch(
  text,
  () => {
    if (!text.value) return;
    resetVocab();
    resetGrammar();
  },
  { immediate: true }
);
</script>

<style scoped>
.tv {
  max-width: 1180px;
  margin: 0 auto;
  padding: 22px 24px 80px;
  --paper: #fdf6ee;
  --mint: #4ecdc4;
  --mint-active: #38b2ac;
  --mint-soft: #d7f5f2;
  --ok: #22c55e;
  --ok-soft: #dcfce7;
  --err: #ef4444;
  --err-soft: #ffe3dd;
  --serif: "Noto Serif SC", serif;
  /* theme-tinted shadows (follow the active series color, not neutral gray) */
  --sh: 0 6px 22px color-mix(in srgb, var(--primary) 10%, transparent);
  --sh-hover: 0 14px 34px color-mix(in srgb, var(--primary) 18%, transparent);
  --sh-soft: 0 3px 14px rgba(43, 43, 51, 0.05);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
.muted {
  color: var(--muted);
  font-weight: 600;
}

/* ---------- chrome ---------- */
.chrome {
  position: relative;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl, 28px);
  box-shadow: var(--sh);
  padding: 22px 30px 24px;
  margin-bottom: 24px;
}
.chrome::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  background: linear-gradient(180deg, var(--grad-a), var(--grad-b));
}
.crumb {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--muted);
}
.crumb a {
  color: var(--muted);
}
.crumb .dim {
  color: var(--muted-soft);
  font-weight: 600;
}
.crumb .sep {
  color: var(--muted-soft);
}
.crumb .lvl {
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 11px;
  border-radius: var(--r-pill);
  letter-spacing: 0.4px;
}
.crumb .here {
  color: var(--ink);
}
.title-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin: 14px 0 4px;
}
.title-row h1 {
  font-family: var(--serif);
  font-weight: 900;
  font-size: 32px;
  color: var(--ink);
  line-height: 1.12;
  letter-spacing: 0.5px;
}
.title-row h1 .lesson-no {
  color: var(--primary);
  font-weight: 700;
}
.title-row .en {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  margin-top: 7px;
}
.fc-link {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: var(--mint-soft);
  color: var(--mint-active);
  border-radius: var(--r-pill);
  padding: 10px 18px;
  box-shadow: 0 4px 14px rgba(78, 205, 196, 0.18);
  transition: transform 0.15s, box-shadow 0.15s;
}
.fc-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(78, 205, 196, 0.28);
}
.fc-link .ic {
  font-size: 17px;
}
.fc-link b {
  font-family: var(--han);
  font-weight: 700;
  font-size: 14px;
  display: block;
  line-height: 1.1;
}
.fc-link small {
  font-size: 10.5px;
  font-weight: 800;
  opacity: 0.85;
  letter-spacing: 0.3px;
}

.tabs {
  display: flex;
  gap: 2px;
  margin-top: 20px;
  border-bottom: 1px solid var(--hairline);
}
.tab {
  position: relative;
  font-family: var(--han);
  font-weight: 700;
  font-size: 15px;
  color: var(--muted);
  padding: 11px 18px 13px;
}
.tab small {
  display: block;
  font-size: 9.5px;
  font-weight: 800;
  color: var(--muted-soft);
  letter-spacing: 0.4px;
  margin-top: 2px;
  text-transform: uppercase;
}
.tab.on {
  color: var(--ink);
}
.tab.on::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: -1px;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: linear-gradient(90deg, var(--grad-a), var(--grad-b));
}
.tab.on small {
  color: var(--primary);
}

.modes {
  display: inline-flex;
  gap: 3px;
  margin-top: 22px;
  background: var(--primary-soft);
  padding: 4px;
  border-radius: var(--r-pill);
}
.mode {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: var(--han);
  font-weight: 700;
  font-size: 13.5px;
  color: var(--primary-strong);
  padding: 9px 18px;
  border-radius: var(--r-pill);
  transition: background 0.15s, box-shadow 0.15s;
}
.mode small {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.4px;
  opacity: 0.7;
  text-transform: uppercase;
}
.mode.on {
  background: #fff;
  box-shadow: 0 3px 10px color-mix(in srgb, var(--primary) 16%, transparent);
}
.mode.on small {
  opacity: 1;
  color: var(--primary);
}
.mode .mn {
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  display: grid;
  place-items: center;
  flex: none;
}
.mode:not(.on) .mn {
  background: rgba(0, 0, 0, 0.18);
}

/* ---------- panels ---------- */
.panel {
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: var(--r-xl, 28px);
  box-shadow: var(--sh-soft);
  overflow: hidden;
}
.paper-bg {
  background: var(--paper);
  background-image: repeating-linear-gradient(
    0deg,
    rgba(43, 43, 51, 0.014) 0,
    rgba(43, 43, 51, 0.014) 1px,
    transparent 1px,
    transparent 34px
  );
}

/* ① READ */
.read {
  display: grid;
  grid-template-columns: 1fr 300px;
}
.read.solo {
  grid-template-columns: 1fr;
}
.col-text {
  padding: 40px 48px 36px;
}
.kicker {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 6px;
}
.read h2 {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 25px;
  color: var(--ink);
  letter-spacing: 0.5px;
}
.divider {
  width: 44px;
  height: 3px;
  border-radius: 3px;
  background: var(--primary);
  margin: 18px 0 26px;
}
.line {
  display: grid;
  grid-template-columns: 92px 1fr;
  padding: 14px 0;
  border-bottom: 1px solid var(--hairline-soft);
  align-items: baseline;
}
.line:last-child {
  border-bottom: none;
}
.speaker {
  text-align: right;
  padding-right: 20px;
}
.speaker .name {
  font-family: var(--han);
  font-weight: 700;
  font-size: 14px;
  color: var(--primary-strong);
  white-space: nowrap;
}
.speech {
  padding-left: 24px;
  border-left: 2px solid var(--hairline);
}
.line:hover .speech {
  border-left-color: var(--primary-soft);
}
.speech .zh {
  font-family: var(--han);
  font-weight: 400;
  font-size: 21px;
  line-height: 1.85;
  color: var(--ink);
  letter-spacing: 0.5px;
}
.spk {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--mint-soft);
  color: var(--mint-active);
  font-size: 12px;
  vertical-align: middle;
  margin-left: 6px;
  transition: transform 0.15s, background 0.15s, color 0.15s;
}
.spk:hover {
  background: var(--mint);
  color: #fff;
  transform: scale(1.08);
}

.col-notes {
  border-left: 1px dashed var(--border-strong);
  padding: 40px 28px 36px;
}
.notes-head {
  font-family: var(--han);
  font-weight: 900;
  font-size: 15px;
  color: var(--ink);
}
.notes-head .en {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: var(--muted-soft);
  letter-spacing: 0.6px;
  text-transform: uppercase;
  margin-top: 3px;
}
.notes-rule {
  width: 34px;
  height: 2px;
  background: var(--primary);
  margin: 13px 0 20px;
  border-radius: 2px;
}
.mnote {
  position: relative;
  padding: 0 0 20px 22px;
  margin-bottom: 20px;
  border-bottom: 1px dashed var(--hairline);
}
.mnote:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.mnote::before {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--card);
  border: 2.5px solid var(--primary);
}
.mnote .lab {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: var(--muted-soft);
  margin-bottom: 6px;
}
.mnote .gp {
  font-family: var(--serif);
  font-weight: 700;
  font-size: 18px;
  color: var(--primary-strong);
  line-height: 1.35;
}
.notes-sub {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--muted-soft);
  margin: -8px 0 20px;
}
.ghint {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-soft);
  margin-top: 12px;
}
.gtile.placed.drag {
  cursor: grab;
}
.gtile.placed.drag:active {
  cursor: grabbing;
}

/* ② VOCAB */
.vocab {
  padding: 36px 48px 40px;
}
.lede {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 24px;
  line-height: 1.5;
}
.cloze {
  font-size: 22px;
  line-height: 2.2;
  color: var(--ink);
  white-space: pre-wrap;
  word-break: break-word;
}
.frag {
  white-space: pre-wrap;
}
.blank {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 74px;
  height: 36px;
  margin: 0 4px;
  padding: 0 12px;
  border-bottom: 2.5px dashed var(--primary);
  background: linear-gradient(180deg, transparent 60%, var(--primary-soft) 60%);
  font-family: var(--han);
  font-weight: 700;
  font-size: 19px;
  color: var(--primary-strong);
  border-radius: 8px 8px 0 0;
  vertical-align: middle;
  transition: background 0.15s;
}
.blank .qn {
  position: absolute;
  top: -9px;
  left: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  display: grid;
  place-items: center;
}
.blank.empty {
  color: var(--muted-soft);
}
.blank.correct {
  border-bottom-color: var(--ok);
  color: #15803d;
  background: linear-gradient(180deg, transparent 55%, var(--ok-soft) 55%);
}
.blank.correct .qn {
  background: var(--ok);
}
.blank.wrong {
  border-bottom-color: var(--err);
  color: var(--err);
  background: linear-gradient(180deg, transparent 55%, var(--err-soft) 55%);
}
.blank.wrong .qn {
  background: var(--err);
}

.bank {
  margin-top: 30px;
}
.bank-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
}
.bank-head b {
  font-family: var(--han);
  font-weight: 900;
  font-size: 14px;
  color: var(--ink);
}
.bank-head small {
  font-size: 11px;
  font-weight: 800;
  color: var(--muted-soft);
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.tiles {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  min-height: 28px;
}
.tile {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-family: var(--han);
  font-weight: 700;
  color: var(--ink);
  background: var(--card);
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-md);
  padding: 9px 20px;
  box-shadow: var(--sh-soft);
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
}
.tile .tw {
  font-size: 18px;
  line-height: 1.2;
}
.tile .tpy {
  font-family: var(--ui, "Nunito", sans-serif);
  font-size: 10.5px;
  font-weight: 700;
  color: var(--muted);
  letter-spacing: 0.2px;
}
.tile:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--sh-hover);
}
.bank-empty {
  font-size: 13px;
  font-weight: 700;
  color: var(--muted-soft);
}

.actionrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
  flex-wrap: wrap;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--han);
  font-weight: 700;
  font-size: 14px;
  border-radius: var(--r-pill);
  padding: 11px 24px;
  line-height: 1.15;
  transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
}
.btn small {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.4px;
  opacity: 0.85;
  text-transform: uppercase;
}
.btn-primary {
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
  color: #fff;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--primary) 30%, transparent);
}
.btn-primary:hover {
  transform: translateY(-2px);
}
.btn-primary:disabled {
  opacity: 0.45;
  transform: none;
  box-shadow: none;
}
.btn-ghost {
  background: var(--card);
  color: var(--primary-strong);
  border: 1.5px solid var(--primary-soft);
}
.btn-ghost:hover {
  background: var(--primary-soft);
}
.score {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: var(--ok-soft);
  color: #15803d;
  font-weight: 800;
  font-size: 13px;
  padding: 9px 18px;
  border-radius: var(--r-pill);
}
.score .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ok);
}
.score.mixed {
  background: #fff7ed;
  color: #c2410c;
}
.score.mixed .dot {
  background: #ff6b6b;
}

/* ③ GRAMMAR */
.grammar {
  padding: 36px 48px 40px;
}
.ghead {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}
.ghead .lede {
  margin-bottom: 0;
}
.gprogress {
  flex: none;
  width: 180px;
}
.gcount {
  display: block;
  font-family: var(--han);
  font-size: 12px;
  font-weight: 800;
  color: var(--primary-strong);
  text-align: right;
  margin-bottom: 6px;
}
.gbar {
  height: 6px;
  border-radius: var(--r-pill);
  background: var(--primary-soft);
  overflow: hidden;
}
.gbar i {
  display: block;
  height: 100%;
  border-radius: var(--r-pill);
  background: linear-gradient(90deg, var(--grad-a), var(--grad-b));
  transition: width 0.3s;
}
.gspeaker {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 12px;
  font-family: var(--han);
}
.gspeaker .gs-name {
  font-weight: 700;
  font-size: 15px;
  color: var(--primary-strong);
}
.gspeaker .gs-say {
  font-size: 14px;
  color: var(--muted);
}
.alldone {
  margin-left: auto;
  font-family: var(--han);
  font-weight: 800;
  font-size: 14px;
  color: var(--primary-strong);
}
.slot {
  min-height: 66px;
  border: 2px dashed var(--border-strong);
  border-radius: var(--r-lg, 22px);
  background: var(--paper);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  position: relative;
}
.slot.empty::after {
  content: "把词点进这里排成句子 · tap words to build the sentence";
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--muted-soft);
  pointer-events: none;
}
.slot.solved {
  border-style: solid;
  border-color: var(--ok);
  background: var(--ok-soft);
}
.slot.bad {
  border-color: var(--err);
  background: var(--err-soft);
}
.gtile {
  font-family: var(--han);
  font-weight: 700;
  font-size: 19px;
  color: var(--ink);
  background: var(--card);
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-sm, 12px);
  padding: 11px 20px;
  box-shadow: var(--sh-soft);
  transition: transform 0.12s, border-color 0.15s;
}
.gtile:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
}
.slot .gtile {
  border-color: var(--primary-soft);
}
.slot.solved .gtile {
  border-color: transparent;
  background: #fff;
}
.bank-tiles {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
  min-height: 44px;
}
.solved-badge {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 14px;
  color: #15803d;
  background: var(--ok-soft);
  padding: 9px 18px;
  border-radius: var(--r-pill);
}
.solved-badge .check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--ok);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 12px;
}
.answer-hint {
  font-family: var(--han);
  font-size: 14px;
  color: var(--muted);
  margin-top: 16px;
}
.answer-hint b {
  color: var(--primary-strong);
  font-weight: 700;
}

/* pager */
.pager {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 28px;
}
.pg {
  flex: 1;
  max-width: 340px;
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: var(--r-lg, 22px);
  padding: 16px 22px;
  box-shadow: var(--sh-soft);
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
}
.pg:hover {
  transform: translateY(-2px);
  box-shadow: var(--sh-hover);
  border-color: var(--primary-soft);
}
.pg.next {
  text-align: right;
}
.pg-spacer {
  flex: 1;
  max-width: 340px;
}
.pg .dir {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--primary);
}
.pg .t {
  font-family: var(--han);
  font-weight: 700;
  font-size: 16px;
  color: var(--ink);
  margin-top: 6px;
}

/* mobile */
@media (max-width: 720px) {
  .read {
    grid-template-columns: 1fr;
  }
  .col-notes {
    border-left: none;
    border-top: 1px dashed var(--border-strong);
  }
  .col-text,
  .vocab,
  .grammar {
    padding: 26px 20px 28px;
  }
  .title-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .line {
    grid-template-columns: 74px 1fr;
  }
}
</style>
