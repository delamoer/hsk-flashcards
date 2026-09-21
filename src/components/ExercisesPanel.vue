<template>
  <div class="exp">
    <template v-if="texts.length">
      <!-- text picker (a lesson may have several 课文) + sub-mode -->
      <div class="exp-head">
        <div class="picker" v-if="texts.length > 1">
          <button v-for="(t, i) in texts" :key="i" :class="{ on: ti === i }" @click="ti = i">
            课文 {{ t.n }}<i>Text {{ t.n }}</i>
          </button>
        </div>
        <div class="submodes">
          <button :class="{ on: mode === 'vocab' }" @click="mode = 'vocab'">生词挖空<i>Cloze</i></button>
          <button v-if="hasGrammar" :class="{ on: mode === 'grammar' }" @click="mode = 'grammar'">连词成句<i>Reorder</i></button>
        </div>
      </div>

      <!-- ① 生词挖空 -->
      <div v-if="mode === 'vocab' && text?.vocab" class="vocab">
        <div class="vhead">
          <div class="lede">点词库里的词填进空里。 · Tap a word to fill the next blank; tap a filled blank to clear.</div>
          <div class="rtoggles" v-if="hasPy || hasEn">
            <button v-if="hasPy" class="rt" :class="{ on: showPy }" @click="showPy = !showPy">拼音<small>Pinyin</small></button>
            <button v-if="hasEn" class="rt" :class="{ on: showEn }" @click="showEn = !showEn">En<small>English</small></button>
          </div>
        </div>

        <div class="cloze han">
          <div class="cloze-line" v-for="(ln, li) in vClozeLines" :key="li">
            <div class="speaker">
              <div class="name">
                <template v-if="ln.nameParts.length">
                  <template v-for="(part, i) in ln.nameParts" :key="i">
                    <span v-if="part.t">{{ part.t }}</span>
                    <button v-else class="blank blank-sm" :class="slotClass(part.b)" @click="clearBlank(part.b)">
                      <span class="qn">{{ part.b }}</span>{{ vFill[part.b] ? vFill[part.b].text : "＿" }}
                    </button>
                  </template>
                </template>
                <template v-else>{{ ln.name }}</template>
              </div>
            </div>
            <div class="cl-body">
              <div class="cl-zh">
                <template v-for="(part, i) in ln.bodyParts" :key="i">
                  <span v-if="part.t" class="frag">{{ part.t }}</span>
                  <button v-else class="blank" :class="slotClass(part.b)" @click="clearBlank(part.b)">
                    <span class="qn">{{ part.b }}</span>{{ vFill[part.b] ? vFill[part.b].text : "＿＿" }}
                  </button>
                </template>
              </div>
              <div v-if="showPy && ln.py" class="py-line" v-html="clozePyHtml(ln)"></div>
              <div v-if="showEn && ln.en" class="tr-line">{{ ln.en }}</div>
            </div>
          </div>
        </div>

        <div class="bank">
          <div class="bank-head"><b>词库</b><small>Word bank</small></div>
          <div class="tiles">
            <button v-for="chip in vBank" :key="chip.id" class="tile" :title="vTileTip(chip.text)" @click="placeVocab(chip)">
              <span class="tw">{{ chip.text }}</span>
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

      <!-- ② 连词成句 -->
      <div v-else-if="mode === 'grammar' && sentences.length" class="grammar">
        <div class="ghead">
          <div class="lede">把每句打乱的词排成句子。 · Rebuild each line by tapping the words in order.</div>
          <div class="gprogress">
            <span class="gcount">完成 {{ gDoneCount }} / {{ sentences.length }}</span>
            <div class="gbar"><i :style="{ width: (gDoneCount / sentences.length) * 100 + '%' }"></i></div>
          </div>
        </div>

        <div
          class="gitem"
          :class="{ done: gState[si]?.checked && gCorrect(si), wrong: gState[si]?.checked && !gCorrect(si) }"
          v-for="(s, si) in sentences"
          :key="si"
        >
          <div class="gspeaker">
            <span class="gs-no">{{ si + 1 }}</span>
            <template v-if="s.speaker">
              <span class="gs-name">{{ s.speaker }}</span><span class="gs-say">说：</span>
            </template>
            <button class="glisten" @click="say(s.text)" title="听正确读法 · listen for a hint">🔊 <span>听一听<small>LISTEN · hint</small></span></button>
          </div>

          <div class="slot" :class="{ empty: !gState[si]?.placed.length, solved: gState[si]?.checked && gCorrect(si), bad: gState[si]?.checked && !gCorrect(si) }">
            <button
              v-for="(chip, i) in gState[si]?.placed || []"
              :key="chip.id"
              class="gtile placed"
              :class="{ drag: !gState[si]?.checked }"
              :draggable="!gState[si]?.checked"
              @dragstart="onDragStart(si, i)"
              @dragover.prevent
              @drop="onDrop(si, i)"
              @dragend="dragFrom = -1"
              @click="onPlacedClick(si, i)"
            >{{ chip.text }}</button>
          </div>
          <p class="ghint" v-if="(gState[si]?.placed.length || 0) > 1 && !gState[si]?.checked">拖动可调整顺序，点一下移回词库 · drag to reorder, tap to remove</p>

          <div class="bank-tiles">
            <button v-for="chip in gState[si]?.bank || []" :key="chip.id" class="gtile" @click="placeG(si, chip)">{{ chip.text }}</button>
          </div>

          <div class="actionrow">
            <button class="btn btn-primary" :disabled="(gState[si]?.bank.length || 0) || gState[si]?.checked" @click="checkOne(si)">对答案<small>CHECK</small></button>
            <button class="btn btn-ghost" @click="resetOne(si)">重来<small>RESET</small></button>
            <span v-if="gState[si]?.checked && gCorrect(si)" class="solved-badge"><span class="check">✓</span>正确 · Correct</span>
            <span v-else-if="gState[si]?.checked" class="score mixed"><span class="dot"></span>答案：{{ s.text }}</span>
          </div>
        </div>
        <div class="galldone" v-if="gDoneCount === sentences.length">🎉 全部完成 · Whole text done!</div>
      </div>

      <div v-else class="placeholder"><div class="diamond">◇ ◇ ◇</div><p>本篇暂无该练习 · Not available for this text.</p></div>
    </template>

    <div v-else-if="loading" class="placeholder"><div class="diamond">◇ ◇ ◇</div><p>加载中… · Loading…</p></div>
    <div v-else class="placeholder">
      <div class="diamond">◇ ◇ ◇</div>
      <h3>本课暂无练习</h3>
      <div class="en">No exercises for this lesson yet</div>
      <p>这一课暂未收录课文练习，可先学「生词表·闪卡」。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
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
const loading = ref(true);
const ti = ref(0);
const mode = ref("vocab");

watch(
  () => [props.series, props.unit, props.lesson],
  async ([s, u, l]) => {
    loading.value = true;
    ti.value = 0;
    const ds = await getTextUnit(s, u);
    const ld = ds?.lessons.find((x) => x.num === Number(l));
    texts.value = ld?.texts || [];
    loading.value = false;
  },
  { immediate: true }
);

const text = computed(() => texts.value[ti.value] || null);

// ── shared ──
const showPy = ref(false);
const showEn = ref(false);
function pyHtml(py) {
  return settings.toneColors ? colorPinyin(py) : py;
}
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

// ── VOCAB (生词挖空) ──
const vTiles = computed(() => text.value?.vocab?.tiles || {});
function vTileTip(word) {
  const e = vTiles.value[word];
  if (!e) return "";
  return [e.py, e.en].filter(Boolean).join("  ·  ");
}
const vBank = ref([]);
const vFill = ref({});
const vChecked = ref(false);
const blankNums = computed(() => (text.value?.vocab?.seg || []).filter((p) => p.b != null).map((p) => p.b));
const vAnswers = computed(() => text.value?.vocab?.answers || []);

const vClozeLines = computed(() => {
  const seg = text.value?.vocab?.seg || [];
  const rows = [];
  let cur = [];
  for (const part of seg) {
    if (part.t != null) {
      const chunks = part.t.split("\n");
      chunks.forEach((chunk, idx) => {
        if (idx > 0) { rows.push(cur); cur = []; }
        if (chunk) cur.push({ t: chunk });
      });
    } else {
      cur.push({ b: part.b });
    }
  }
  rows.push(cur);
  const gl = text.value?.lines || [];
  return rows
    .filter((parts) => parts.some((p) => p.b != null || (p.t && p.t.trim())))
    .map((parts, i) => {
      const g = gl[i] || {};
      const { nameParts, bodyParts } = splitSpeaker(parts);
      return { name: g.name || "", nameParts, bodyParts, py: g.py || "", en: g.en || "" };
    });
});
function splitSpeaker(parts) {
  const answers = vAnswers.value;
  let prefLen = 0;
  let colon = false;
  outer: for (const p of parts) {
    if (p.t != null) {
      for (const ch of p.t) {
        if (ch === "：" || ch === ":") { colon = true; break outer; }
        prefLen++;
      }
    } else {
      prefLen += (answers[p.b - 1] || " ").length || 1;
    }
  }
  if (!colon || prefLen > 8) return { nameParts: [], bodyParts: parts };
  const nameParts = [];
  const bodyParts = [];
  let inName = true;
  for (const p of parts) {
    if (!inName) { bodyParts.push(p); continue; }
    if (p.t != null) {
      const ci = p.t.search(/[：:]/);
      if (ci >= 0) {
        if (ci > 0) nameParts.push({ t: p.t.slice(0, ci) });
        const rest = p.t.slice(ci + 1);
        if (rest) bodyParts.push({ t: rest });
        inName = false;
      } else nameParts.push(p);
    } else nameParts.push(p);
  }
  return { nameParts, bodyParts };
}
const hasPy = computed(() => vClozeLines.value.some((ln) => ln.py));
const hasEn = computed(() => vClozeLines.value.some((ln) => ln.en));
function stripTones(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, ""); }
function normPy(s) { return stripTones(s).toLowerCase().replace(/[^a-z]/g, ""); }
function clozePyHtml(ln) {
  let py = ln.py || "";
  const answersPy = (ln.bodyParts || []).filter((p) => p.b != null).map((p) => vTiles.value[vAnswers.value[p.b - 1]]?.py || "").filter(Boolean);
  if (answersPy.length && py) {
    const map = [];
    let normStr = "";
    for (let i = 0; i < py.length; i++) {
      const c = normPy(py[i]);
      if (c) { normStr += c; map.push(i); }
    }
    const spans = [];
    let cursor = 0;
    for (const ap of answersPy) {
      const na = normPy(ap);
      if (!na) continue;
      const idx = normStr.indexOf(na, cursor);
      if (idx < 0) continue;
      spans.push([map[idx], map[idx + na.length - 1] + 1]);
      cursor = idx + na.length;
    }
    if (spans.length) {
      spans.sort((a, b) => a[0] - b[0]);
      let out = "";
      let last = 0;
      for (const [s, e] of spans) { out += py.slice(last, s) + "____"; last = e; }
      py = out + py.slice(last);
    }
  }
  return pyHtml(py);
}
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
const vScore = computed(() => blankNums.value.filter((b) => vFill.value[b] && vFill.value[b].text === vAnswers.value[b - 1]).length);

// ── GRAMMAR (连词成句) ──
const sentences = computed(() => text.value?.sentences || []);
const hasGrammar = computed(() => sentences.value.length > 0);
const gState = ref([]);
function newG(sentence) {
  const toks = sentence?.tokens || [];
  return { bank: shuffle(toks.map((t, i) => ({ id: `g${i}`, text: t }))), placed: [], checked: false };
}
function buildGrammar() {
  gState.value = sentences.value.map(newG);
}
function resetOne(si) { gState.value[si] = newG(sentences.value[si]); }
function checkOne(si) { gState.value[si].checked = true; }
function placeG(si, chip) {
  const st = gState.value[si];
  if (st.checked) return;
  st.placed = [...st.placed, chip];
  st.bank = st.bank.filter((c) => c.id !== chip.id);
}
function removeG(si, idx) {
  const st = gState.value[si];
  if (st.checked) return;
  const chip = st.placed[idx];
  st.placed = st.placed.filter((_, i) => i !== idx);
  st.bank = [...st.bank, chip];
}
function gCorrect(si) {
  const toks = sentences.value[si]?.tokens || [];
  const p = gState.value[si]?.placed || [];
  return p.length === toks.length && p.every((c, i) => c.text === toks[i]);
}
const gDoneCount = computed(() => sentences.value.reduce((n, _, si) => n + (gState.value[si]?.checked && gCorrect(si) ? 1 : 0), 0));
const dragFrom = ref(-1);
const dragSi = ref(-1);
let dragMoved = false;
function onDragStart(si, i) {
  if (gState.value[si].checked) return;
  dragSi.value = si; dragFrom.value = i; dragMoved = false;
}
function onDrop(si, i) {
  if (dragSi.value !== si || dragFrom.value < 0 || gState.value[si].checked) return;
  dragMoved = true;
  const from = dragFrom.value;
  dragFrom.value = -1;
  if (from === i) return;
  const arr = gState.value[si].placed.slice();
  const [m] = arr.splice(from, 1);
  arr.splice(i, 0, m);
  gState.value[si].placed = arr;
}
function onPlacedClick(si, i) {
  if (dragMoved) { dragMoved = false; return; }
  removeG(si, i);
}

// rebuild exercises when the selected text changes
watch(
  text,
  () => {
    if (!text.value) return;
    resetVocab();
    buildGrammar();
    if (mode.value === "grammar" && !hasGrammar.value) mode.value = "vocab";
  },
  { immediate: true }
);
</script>

<style scoped>
.exp { padding: 26px 0 20px; }

.exp-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 22px; }
.picker, .submodes { display: inline-flex; background: var(--paper-3); border: 1px solid var(--line); border-radius: 8px; padding: 4px; gap: 4px; }
.picker button, .submodes button { display: inline-flex; flex-direction: column; line-height: 1.1; font-family: var(--serif-cn); font-weight: 600; font-size: 14px; padding: 6px 16px; border-radius: 6px; color: var(--ink-soft, #4a3d2a); transition: .2s; }
.picker button i, .submodes button i { font-style: normal; font-family: var(--caps); font-size: 8.5px; letter-spacing: 1.3px; text-transform: uppercase; color: var(--muted); }
.picker button.on, .submodes button.on { background: linear-gradient(145deg, #c0392b, #8b2a1f); color: #fbeecf; box-shadow: 0 2px 5px -1px rgba(139,42,31,.4); }
.picker button.on i, .submodes button.on i { color: rgba(251,238,207,.85); }

/* shared lede + toggles */
.vhead, .ghead { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 22px; }
.lede { font-size: 13px; font-weight: 600; color: var(--muted); line-height: 1.5; }
.rtoggles { flex: none; display: inline-flex; gap: 6px; }
.rt { display: inline-flex; flex-direction: column; align-items: center; line-height: 1.05; font-family: var(--serif-cn); font-weight: 700; font-size: 13px; color: var(--muted); background: var(--paper); border: 1.5px solid var(--line); border-radius: var(--r-pill); padding: 6px 14px; }
.rt small { font-size: 8.5px; font-weight: 800; letter-spacing: .3px; text-transform: uppercase; opacity: .75; }
.rt.on { background: var(--gold); border-color: var(--gold-deep); color: #fff8ea; }

/* cloze */
.cloze { color: var(--ink); }
.cloze-line { display: grid; grid-template-columns: 92px 1fr; gap: 0 8px; padding: 6px 0; }
.cloze-line .speaker { text-align: right; padding-right: 14px; }
.cloze-line .name { font-family: var(--serif-cn); font-weight: 600; font-size: 16px; color: var(--cinnabar-dk); white-space: normal; display: inline-flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 1px; line-height: 1.9; }
.cl-body { border-left: 2px solid var(--line); padding-left: 18px; }
.cl-zh { font-family: var(--serif-cn); font-size: 22px; line-height: 2.1; white-space: pre-wrap; word-break: break-word; }
.frag { white-space: pre-wrap; }
.blank { position: relative; display: inline-flex; align-items: center; justify-content: center; min-width: 74px; height: 36px; margin: 0 4px; padding: 0 12px; border-bottom: 2.5px dashed var(--cinnabar); background: linear-gradient(180deg, transparent 60%, var(--primary-soft) 60%); font-family: var(--serif-cn); font-weight: 700; font-size: 19px; color: var(--cinnabar-dk); border-radius: 8px 8px 0 0; vertical-align: middle; }
.blank .qn { position: absolute; top: -9px; left: -4px; width: 18px; height: 18px; border-radius: 50%; background: var(--cinnabar); color: #fbeecf; font-size: 10px; font-weight: 900; display: grid; place-items: center; }
.blank.empty { color: var(--muted-soft); }
.blank.correct { border-bottom-color: var(--jade); color: #15803d; background: linear-gradient(180deg, transparent 55%, var(--success-soft) 55%); }
.blank.correct .qn { background: var(--jade); }
.blank.wrong { border-bottom-color: var(--error); color: var(--error); background: linear-gradient(180deg, transparent 55%, #f6dcd6 55%); }
.blank.wrong .qn { background: var(--error); }
.blank-sm { min-width: 28px; height: 24px; margin: 0 1px; padding: 0 6px; font-size: 14px; border-radius: 6px 6px 0 0; }
.blank-sm .qn { top: -7px; width: 15px; height: 15px; font-size: 9px; }
.py-line { font-family: var(--ui); font-weight: 700; font-size: 15px; color: var(--gold-deep); margin-top: 4px; margin-left: 2px; }
.tr-line { font-size: 14.5px; font-weight: 500; color: var(--muted); margin-top: 3px; margin-left: 2px; line-height: 1.5; }

.bank { margin-top: 30px; }
.bank-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px; }
.bank-head b { font-family: var(--serif-cn); font-weight: 900; font-size: 15px; color: var(--ink); }
.bank-head small { font-family: var(--caps); font-size: 10px; font-weight: 600; color: var(--muted); letter-spacing: 1.4px; text-transform: uppercase; }
.tiles { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; min-height: 28px; }
.tile { font-family: var(--serif-cn); font-weight: 700; color: var(--ink); background: var(--paper); border: 1.5px solid var(--line); border-radius: var(--r-md); padding: 9px 20px; box-shadow: 0 3px 10px -6px var(--shadow, rgba(45,30,10,.14)); transition: .15s; }
.tile .tw { font-size: 18px; }
.tile:hover { border-color: var(--gold); transform: translateY(-2px); }
.bank-empty { font-size: 13px; font-weight: 700; color: var(--muted-soft); }

.actionrow { display: flex; align-items: center; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; gap: 8px; font-family: var(--serif-cn); font-weight: 700; font-size: 14px; border-radius: var(--r-pill); padding: 11px 24px; line-height: 1.15; transition: .15s; }
.btn small { font-family: var(--caps); font-size: 9px; letter-spacing: 1.2px; text-transform: uppercase; opacity: .85; }
.btn-primary { background: linear-gradient(145deg, #c0392b, #8b2a1f); color: #fbeecf; box-shadow: 0 4px 12px -4px rgba(139,42,31,.4); }
.btn-primary:disabled { opacity: .45; box-shadow: none; }
.btn-ghost { background: var(--paper); color: var(--cinnabar-dk); border: 1.5px solid var(--line); }
.btn-ghost:hover { border-color: var(--gold); }
.score { margin-left: auto; display: inline-flex; align-items: center; gap: 9px; background: var(--success-soft); color: #15803d; font-weight: 800; font-size: 13px; padding: 9px 18px; border-radius: var(--r-pill); }
.score .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--jade); }
.score.mixed { background: #f6ecd2; color: #8a641f; }
.score.mixed .dot { background: var(--gold); }

/* grammar */
.gprogress { flex: none; width: 180px; }
.gcount { display: block; font-family: var(--serif-cn); font-size: 12px; font-weight: 800; color: var(--cinnabar-dk); text-align: right; margin-bottom: 6px; }
.gbar { height: 6px; border-radius: var(--r-pill); background: var(--paper-3); overflow: hidden; }
.gbar i { display: block; height: 100%; border-radius: var(--r-pill); background: linear-gradient(90deg, var(--gold), var(--cinnabar)); transition: width .3s; }
.gitem { position: relative; background: var(--card); border: 1px solid var(--line); border-radius: var(--r-lg, 22px); box-shadow: 0 3px 12px -8px var(--shadow, rgba(45,30,10,.14)); padding: 18px 22px 20px; margin-bottom: 16px; transition: .2s; }
.gitem:last-of-type { margin-bottom: 0; }
.gitem.done { border-color: color-mix(in srgb, var(--jade) 45%, transparent); background: linear-gradient(180deg, var(--success-soft) 0%, var(--card) 42%); }
.gitem.wrong { border-color: color-mix(in srgb, var(--error) 40%, transparent); }
.gspeaker { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-family: var(--serif-cn); }
.gs-no { display: inline-grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), var(--cinnabar)); color: #fff; font-size: 12px; font-weight: 900; flex: none; }
.gitem.done .gs-no { background: var(--jade); }
.gs-name { font-weight: 700; font-size: 15px; color: var(--cinnabar-dk); }
.gs-say { font-size: 14px; color: var(--muted); }
.glisten { margin-left: auto; display: inline-flex; align-items: center; gap: 7px; font-family: var(--serif-cn); font-weight: 700; font-size: 13px; color: var(--gold-deep); background: var(--paper-2); border-radius: var(--r-pill); padding: 6px 14px; }
.glisten small { display: block; font-family: var(--caps); font-size: 8px; letter-spacing: .3px; text-transform: uppercase; opacity: .8; line-height: 1.1; }
.slot { min-height: 52px; border: 2px dashed var(--border-strong); border-radius: var(--r-md, 16px); background: var(--paper); padding: 10px 14px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; position: relative; }
.slot.empty::after { content: "把词点进这里排成句子 · tap words to build the sentence"; position: absolute; left: 0; right: 0; text-align: center; font-size: 12px; font-weight: 600; color: var(--muted-soft); pointer-events: none; }
.slot.solved { border-style: solid; border-color: var(--jade); background: var(--success-soft); }
.slot.bad { border-color: var(--error); background: #f6dcd6; }
.gtile { font-family: var(--serif-cn); font-weight: 700; font-size: 19px; color: var(--ink); background: var(--card); border: 1.5px solid var(--line); border-radius: var(--r-sm, 10px); padding: 11px 20px; box-shadow: 0 3px 10px -6px var(--shadow, rgba(45,30,10,.14)); transition: .12s; }
.gtile:hover { transform: translateY(-2px); border-color: var(--gold); }
.slot .gtile { border-color: var(--gold-lt); }
.slot.solved .gtile { border-color: transparent; background: #fff; }
.gtile.placed.drag { cursor: grab; }
.gtile.placed.drag:active { cursor: grabbing; }
.bank-tiles { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px; }
.ghint { font-size: 12px; font-weight: 600; color: var(--muted-soft); margin-top: 12px; }
.solved-badge { margin-left: auto; display: inline-flex; align-items: center; gap: 8px; font-weight: 800; font-size: 14px; color: #15803d; background: var(--success-soft); padding: 9px 18px; border-radius: var(--r-pill); }
.solved-badge .check { width: 20px; height: 20px; border-radius: 50%; background: var(--jade); color: #fff; display: grid; place-items: center; font-size: 12px; }
.galldone { margin-top: 20px; text-align: center; font-family: var(--serif-cn); font-weight: 800; font-size: 15px; color: var(--cinnabar-dk); }

.placeholder { text-align: center; padding: 70px 20px; color: var(--muted); }
.placeholder .diamond { color: var(--gold); letter-spacing: 6px; margin-bottom: 14px; }
.placeholder h3 { font-family: var(--serif-cn); font-size: 28px; color: var(--ink-soft, #4a3d2a); letter-spacing: 2px; }
.placeholder .en { font-family: var(--serif-en); font-style: italic; font-size: 16px; margin-top: 4px; }
.placeholder p { max-width: 460px; margin: 14px auto 0; font-size: 14px; }

@media (max-width: 720px) {
  .cloze-line { grid-template-columns: 1fr; }
  .cloze-line .speaker { text-align: left; padding-right: 0; }
  .cl-body { border-left: none; padding-left: 0; }
}
</style>
