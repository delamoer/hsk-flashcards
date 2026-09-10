<template>
  <div class="wrap">
    <header class="phead">
      <h1><span class="zh">汉语拼音</span> <span class="en">Pinyin</span></h1>
      <p>点一下就能听真人发音 · Tap anything to hear a native speaker</p>
    </header>

    <div class="tabs">
      <button :class="{ on: tab === 'initials' }" @click="tab = 'initials'">声母 <i>Initials</i></button>
      <button :class="{ on: tab === 'finals' }" @click="tab = 'finals'">韵母 <i>Finals</i></button>
      <button :class="{ on: tab === 'syllables' }" @click="tab = 'syllables'">音节 <i>Syllables</i></button>
    </div>

    <!-- ══ 声母 Initials ══ -->
    <section v-show="tab === 'initials'" class="panel">
      <div class="secbar">
        <p class="hint">声母不能单独发音，这里读的是教学「呼读音」（b→bo）。Initials are voiced with a helper vowel.</p>
      </div>
      <div class="wall">
        <button
          v-for="it in data.initials" :key="it.initial"
          class="card ini" :class="{ playing: playing === it.audio }" @click="play(it.audio)"
        >
          <div class="top"><span class="glyph">{{ it.initial }}</span><span class="spk">🔊</span></div>
          <div class="hinten" v-html="boldHint(it.hintEn)"></div>
          <div class="zh">{{ it.placeEn }} · {{ it.mannerEn }}</div>
          <div class="ex" v-if="it.example">
            <span class="w">{{ it.example.hanzi }}</span>
            <span class="p">{{ it.example.pinyin }} · {{ it.example.en }}</span>
          </div>
        </button>
      </div>
    </section>

    <!-- ══ 韵母 Finals ══ -->
    <section v-show="tab === 'finals'" class="panel">
      <div class="secbar">
        <p class="hint">点每个声调分别听。Tap each tone to hear it.</p>
        <button class="practice" @click="openQuiz">🎧 听音辨调 <i>Tone quiz</i></button>
      </div>
      <div v-for="grp in finalGroups" :key="grp.name" class="fgroup">
        <h3 class="gname">{{ grp.name }} <i>{{ grp.nameEn }}</i></h3>
        <div class="wall">
          <div v-for="f in grp.items" :key="f.final" class="card fin">
            <div class="finhead">
              <span class="glyph sm">{{ f.final }}</span>
              <span class="hinten" v-html="boldHint(f.hintEn)"></span>
            </div>
            <div class="tones">
              <button
                v-for="t in f.tones" :key="t.tone" class="tone"
                :class="[toneClass(t.display), { playing: playing === t.audio }]" @click="play(t.audio)"
              >{{ t.display }}</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ 音节 Syllables ══ -->
    <section v-show="tab === 'syllables'" class="panel">
      <div class="secbar">
        <div class="viewtoggle">
          <button :class="{ on: syllView === 'cards' }" @click="syllView = 'cards'">卡片 <i>Cards</i></button>
          <button :class="{ on: syllView === 'chart' }" @click="syllView = 'chart'">整表 <i>Chart</i></button>
        </div>
        <button class="practice" @click="openQuiz">🎧 听音辨调 <i>Tone quiz</i></button>
      </div>

      <!-- cards / drill-down -->
      <div v-if="syllView === 'cards'">
        <div class="pickrow">
          <button
            v-for="ini in initialsWithSyl" :key="ini.key"
            class="pick" :class="{ on: pickInitial === ini.key }" @click="pickInitial = ini.key"
          >{{ ini.label }}</button>
        </div>
        <p class="hint">显示 <b>{{ pickLabel }}</b> 开头的音节，点声调听 · Syllables starting with <b>{{ pickLabel }}</b> — tap a tone</p>
        <div class="wall syl">
          <div v-for="s in sylForPick" :key="s.syllable" class="card">
            <div class="ssyl">{{ s.syllable }}</div>
            <div class="tones center">
              <button
                v-for="t in s.tones" :key="t.tone" class="tone sm"
                :class="[toneClass(t.display), { playing: playing === t.audio }]" @click="play(t.audio)"
              >{{ t.display }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- chart / interactive wall -->
      <div v-else>
        <transition name="fade">
          <div v-if="selectedCell" class="detail">
            <div class="dbig">{{ selectedCell.syllable }}</div>
            <div class="dtones">
              <button
                v-for="t in selectedCell.tones" :key="t.tone" class="tone lg"
                :class="[toneClass(t.display), { playing: playing === t.audio }]" @click="play(t.audio)"
              >{{ t.display }}</button>
            </div>
            <button class="dclose" @click="selectedCell = null">✕</button>
          </div>
        </transition>
        <div class="wallwrap">
          <table class="ptable">
            <thead>
              <tr><th class="corner">韵\声</th><th v-for="ini in data.grid.initials" :key="ini">{{ ini }}</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in data.grid.rows" :key="row.final">
                <th class="rowh">{{ row.final }}</th>
                <td
                  v-for="(cell, i) in row.cells" :key="i"
                  :class="{ empty: !cell, active: cell && selectedCell && selectedCell.syllable === cell }"
                >
                  <button v-if="cell" class="cellbtn" @click="selectCell(cell)">{{ cell }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="legend">
          <span>声调 Tones:</span>
          <span><i class="dotc t1"></i>1st 一声</span><span><i class="dotc t2"></i>2nd 二声</span>
          <span><i class="dotc t3"></i>3rd 三声</span><span><i class="dotc t4"></i>4th 四声</span>
        </div>
      </div>
    </section>

    <footer class="credit">
      发音音频 Audio: <a :href="data.source.audioUrl" target="_blank" rel="noopener">{{ data.source.audio }}</a> · {{ data.source.audioLicense }}
    </footer>

    <!-- ══ Tone Quiz overlay ══ -->
    <div v-if="quiz.on" class="pmodal" @click.self="closeQuiz">
      <div class="quiz">
        <div class="qtop">
          <span class="qscore">✓ {{ quiz.right }} / {{ quiz.total }}</span>
          <span class="qtitle">听音辨调 <i>Which tone?</i></span>
          <button class="pclose" @click="closeQuiz">✕</button>
        </div>

        <div class="qbody">
          <p class="qq">这是几声？ <span>Which tone did you hear?</span></p>
          <button class="qplay" :class="{ ring: playing === curAudio }" @click="playQuiz">
            <span class="ico">🔊</span>
            <span class="qsyl">{{ quiz.item?.syllable }}</span>
            <span class="qre">再听 Replay</span>
          </button>

          <div class="qopts">
            <button
              v-for="t in quiz.item?.tones" :key="t.tone"
              class="qopt" :class="[toneClass(t.display), optClass(t.tone)]"
              @click="answer(t.tone)"
            >
              <span class="qmark">{{ t.display }}</span>
              <span class="qnum">{{ toneName[t.tone] }}</span>
            </button>
          </div>

          <div class="qfeed" :class="{ show: quiz.answered }">
            <template v-if="quiz.answered">
              <span v-if="quiz.picked === quiz.tone" class="ok">✓ 对了 Correct!</span>
              <span v-else class="no">✗ 是 {{ toneName[quiz.tone] }} · {{ correctDisplay }}</span>
            </template>
          </div>
        </div>

        <button v-if="quiz.answered" class="qnext" @click="nextQuestion">下一题 Next ›</button>
        <p v-else class="qhint">点上面听真人发音，再选声调 · Tap to hear, then pick the tone</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import pinyinData from "@/data/pinyin.json";
import { playPinyin, speak } from "@/utils/tts";
import { toneOf } from "@/utils/pinyinTones";
import { useSettings } from "@/composables/useSettings";

const { settings } = useSettings();
const data = pinyinData;

const tab = ref("initials");
const syllView = ref("cards");
const playing = ref(null);
const selectedCell = ref(null);
const pickInitial = ref("b");

// finals grouped by category (bilingual header)
const finalGroups = computed(() => {
  const order = [], map = new Map();
  for (const f of data.finals) {
    if (!map.has(f.category)) { map.set(f.category, { name: f.category, nameEn: f.categoryEn, items: [] }); order.push(f.category); }
    map.get(f.category).items.push(f);
  }
  return order.map((k) => map.get(k));
});

// syllable lookups
const syllMap = computed(() => Object.fromEntries(data.syllables.map((s) => [s.syllable, s])));
const sylByInitial = computed(() => {
  const m = {};
  for (const s of data.syllables) {
    const key = s.initial || "∅";
    (m[key] ||= []).push(s);
  }
  return m;
});
const initialsWithSyl = computed(() =>
  data.grid.initials
    .map((k) => ({ key: k, label: k === "∅" ? "∅" : k }))
    .filter((x) => sylByInitial.value[x.key]?.length)
);
const pickLabel = computed(() => (pickInitial.value === "∅" ? "∅ (zero initial)" : pickInitial.value));
const sylForPick = computed(() => sylByInitial.value[pickInitial.value] || []);

function toneClass(display) {
  return settings.toneColors ? `t${toneOf(display)}` : "";
}
function boldHint(s) {
  // bold the “x” inside curly quotes for scannability
  return (s || "").replace(/“([^”]+)”/g, '<em>$1</em>');
}
function play(stem) {
  if (!stem) return;
  playing.value = stem;
  playPinyin(stem, settings.ttsRate || 1).catch(() => {}).finally(() => { if (playing.value === stem) playing.value = null; });
}
function speakWord(hanzi) { speak(hanzi, { rate: settings.ttsRate || 1 }); }
function selectCell(syl) { selectedCell.value = syllMap.value[syl] || null; }

// ── Tone Quiz ──
const toneName = { 1: "1st 一声", 2: "2nd 二声", 3: "3rd 三声", 4: "4th 四声" };
const quiz = ref({ on: false, item: null, tone: 0, answered: false, picked: 0, right: 0, total: 0 });
// Only quiz on syllables that actually have distinct human recordings for all tones.
const quizPool = computed(() => data.syllables.filter((s) => s.tones.length === 4));

const curAudio = computed(() => quiz.value.item?.tones.find((t) => t.tone === quiz.value.tone)?.audio || null);
const correctDisplay = computed(() => quiz.value.item?.tones.find((t) => t.tone === quiz.value.tone)?.display || "");

function openQuiz() {
  quiz.value = { on: true, item: null, tone: 0, answered: false, picked: 0, right: 0, total: 0 };
  nextQuestion();
}
function closeQuiz() { quiz.value.on = false; }
function nextQuestion() {
  const pool = quizPool.value;
  const item = pool[Math.floor(Math.random() * pool.length)];
  const tone = 1 + Math.floor(Math.random() * 4);
  quiz.value.item = item;
  quiz.value.tone = tone;
  quiz.value.answered = false;
  quiz.value.picked = 0;
  playQuiz();
}
function playQuiz() { if (curAudio.value) play(curAudio.value); }
function answer(t) {
  if (quiz.value.answered) return;
  quiz.value.picked = t;
  quiz.value.answered = true;
  quiz.value.total += 1;
  if (t === quiz.value.tone) quiz.value.right += 1;
}
function optClass(t) {
  if (!quiz.value.answered) return "";
  if (t === quiz.value.tone) return "right";
  if (t === quiz.value.picked) return "wrong";
  return "dim";
}
</script>

<style scoped>
.wrap { max-width: 1000px; margin: 0 auto; }
.phead { text-align: center; padding: 6px 0 16px; }
.phead h1 { font-size: 30px; font-weight: 800; }
.phead .zh { background: linear-gradient(135deg, var(--grad-a), var(--grad-b)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.phead .en { color: var(--muted-soft); font-weight: 700; }
.phead p { margin-top: 6px; color: var(--muted); font-size: 14px; }

.tabs { display: flex; gap: 6px; background: var(--soft); border-radius: var(--r-pill); padding: 5px; max-width: 460px; margin: 0 auto 20px; }
.tabs button { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 8px 6px; border-radius: var(--r-pill); font-weight: 800; font-size: 14px; color: var(--body); transition: 0.15s; }
.tabs button i { font-style: normal; font-size: 10px; font-weight: 600; opacity: 0.7; }
.tabs button.on { background: #fff; color: var(--primary-strong); box-shadow: var(--sh-card); }

.panel { animation: pop 0.2s ease; }
@keyframes pop { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

.secbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.hint { flex: 1; font-size: 12.5px; color: var(--muted); background: var(--hairline-soft); border-radius: var(--r-sm); padding: 8px 12px; min-width: 200px; }
.hint b { color: var(--primary-strong); }
.practice { flex-shrink: 0; display: inline-flex; align-items: baseline; gap: 5px; background: linear-gradient(135deg, var(--grad-a), var(--grad-b)); color: #fff; font-weight: 800; font-size: 14px; padding: 9px 18px; border-radius: var(--r-pill); box-shadow: var(--sh-card); transition: 0.15s; }
.practice i { font-style: normal; font-size: 10px; opacity: 0.85; }
.practice:hover { transform: translateY(-1px); box-shadow: var(--sh-hover); }

.viewtoggle { display: flex; background: var(--soft); border-radius: var(--r-pill); padding: 4px; }
.viewtoggle button { display: flex; flex-direction: column; align-items: center; padding: 6px 16px; border-radius: var(--r-pill); font-weight: 800; font-size: 13px; color: var(--body); }
.viewtoggle button i { font-style: normal; font-size: 9px; opacity: 0.7; }
.viewtoggle button.on { background: #fff; color: var(--primary-strong); box-shadow: var(--sh-card); }

/* card walls */
.wall { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; }
.wall.syl { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
.card { text-align: left; background: var(--card); border: 1.5px solid var(--hairline); border-radius: var(--r-lg); padding: 16px; transition: 0.15s; }
.card.ini { cursor: pointer; }
.card.ini:hover { transform: translateY(-3px); box-shadow: var(--sh-hover); border-color: var(--primary); }
.card.ini.playing { border-color: var(--primary); background: var(--soft); }
.top { display: flex; align-items: center; justify-content: space-between; }
.glyph { font-size: 40px; font-weight: 900; color: var(--ink); line-height: 1; font-family: var(--ui); }
.glyph.sm { font-size: 26px; }
.spk { font-size: 17px; opacity: 0.55; }
.hinten { font-size: 14px; color: var(--ink); font-weight: 800; margin-top: 12px; line-height: 1.45; }
.hinten :deep(em) { font-style: normal; color: var(--primary-strong); }
.zh { font-size: 11.5px; color: var(--muted); font-weight: 700; margin-top: 6px; }
.ex { display: flex; align-items: baseline; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--hairline); }
.ex .w { font-family: var(--han); font-size: 22px; font-weight: 800; color: var(--ink); }
.ex .p { font-size: 11.5px; color: var(--muted); font-weight: 700; }

.fgroup { margin-bottom: 20px; }
.gname { font-size: 14px; font-weight: 800; color: var(--primary-strong); margin-bottom: 10px; }
.gname i { font-style: normal; color: var(--muted); font-weight: 600; margin-left: 4px; }
.finhead { display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; }
.finhead .hinten { margin-top: 0; font-size: 12.5px; }

.tones { display: flex; gap: 6px; flex-wrap: wrap; }
.tones.center { justify-content: center; }
.ssyl { text-align: center; font-weight: 900; font-size: 20px; color: var(--ink); margin-bottom: 10px; }
.tone { min-width: 46px; padding: 8px 8px; border-radius: var(--r-sm); border: 1.5px solid var(--hairline); background: #fff; font-family: var(--ui); font-size: 19px; font-weight: 800; color: var(--ink); transition: 0.12s; }
.tone.sm { min-width: 38px; font-size: 16px; padding: 6px 4px; }
.tone.lg { min-width: 58px; font-size: 26px; padding: 12px 14px; }
.tone:hover { border-color: var(--primary); background: var(--soft); }
.tone.playing { border-color: var(--primary); background: var(--primary-soft); }
.tone.t1 { color: var(--tone1); } .tone.t2 { color: var(--tone2); } .tone.t3 { color: var(--tone3); } .tone.t4 { color: var(--tone4); } .tone.t0 { color: var(--tone0); }

/* picker */
.pickrow { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.pick { padding: 9px 15px; border-radius: var(--r-pill); border: 1.5px solid var(--hairline); background: #fff; font-family: var(--ui); font-weight: 800; font-size: 16px; color: var(--body); }
.pick.on { background: linear-gradient(135deg, var(--grad-a), var(--grad-b)); color: #fff; border-color: transparent; }

/* chart */
.detail { position: sticky; top: calc(var(--appbar-h, 58px) + 8px); z-index: 5; display: flex; align-items: center; gap: 14px; background: var(--card); border: 1.5px solid var(--primary); border-radius: var(--r-lg); box-shadow: var(--sh-pop); padding: 12px 16px; margin-bottom: 14px; }
.dbig { font-weight: 900; font-size: 30px; color: var(--ink); min-width: 64px; text-align: center; }
.dtones { display: flex; gap: 8px; flex-wrap: wrap; flex: 1; }
.dclose { font-size: 16px; color: var(--muted); padding: 4px 8px; border-radius: var(--r-sm); }
.dclose:hover { background: var(--soft); }
.wallwrap { background: #fff; border-radius: var(--r-lg); box-shadow: var(--sh-card); padding: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.ptable { border-collapse: separate; border-spacing: 4px; min-width: 720px; width: 100%; }
.ptable th { font-weight: 900; font-size: 13px; color: var(--muted); padding: 6px 4px; }
.ptable thead th { position: sticky; top: 0; background: #fff; color: var(--primary-strong); z-index: 2; }
.ptable .corner { left: 0; z-index: 3; font-size: 11px; }
.ptable .rowh { position: sticky; left: 0; background: var(--soft); color: var(--primary-strong); border-radius: var(--r-sm); z-index: 1; min-width: 48px; }
.ptable td { padding: 0; }
.cellbtn { width: 100%; min-width: 46px; padding: 9px 6px; border-radius: var(--r-sm); background: var(--hairline-soft); font-weight: 800; font-size: 14px; color: var(--body); transition: 0.1s; }
.cellbtn:hover { background: var(--soft); color: var(--primary-strong); transform: scale(1.06); }
.ptable td.active .cellbtn { background: linear-gradient(135deg, var(--grad-a), var(--grad-b)); color: #fff; }
.legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: var(--muted); margin-top: 12px; font-weight: 700; }
.dotc { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
.dotc.t1 { background: var(--tone1); } .dotc.t2 { background: var(--tone2); } .dotc.t3 { background: var(--tone3); } .dotc.t4 { background: var(--tone4); }

.credit { text-align: center; font-size: 11.5px; color: var(--muted-soft); margin: 30px 0 10px; }
.credit a { color: var(--muted); text-decoration: underline; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ══ Tone Quiz overlay ══ */
.pmodal { position: fixed; inset: 0; z-index: 100; background: rgba(43, 43, 51, 0.55); backdrop-filter: blur(4px); display: grid; place-items: center; padding: 20px; }
.pclose { color: #fff; font-size: 20px; padding: 2px 8px; }
.quiz { width: 100%; max-width: 380px; }
.qtop { display: flex; align-items: center; justify-content: space-between; color: #fff; margin-bottom: 12px; }
.qscore { font-weight: 900; font-size: 15px; }
.qtitle { font-weight: 800; font-size: 14px; opacity: 0.9; }
.qtitle i { font-style: normal; font-size: 11px; opacity: 0.8; margin-left: 4px; }
.qbody { background: var(--card); border-radius: var(--r-xl); box-shadow: var(--sh-front); padding: 24px 22px; text-align: center; }
.qq { font-size: 16px; font-weight: 800; color: var(--ink); }
.qq span { display: block; font-size: 12px; color: var(--muted); font-weight: 700; margin-top: 2px; }
.qplay { width: 100%; margin: 18px 0 20px; padding: 18px; border-radius: var(--r-lg); background: linear-gradient(135deg, var(--grad-a), var(--grad-b)); color: #fff; box-shadow: var(--sh-hover); display: flex; flex-direction: column; align-items: center; gap: 4px; transition: transform 0.12s; }
.qplay:hover { transform: translateY(-2px); }
.qplay.ring { outline: 4px solid var(--primary-soft); }
.qplay .ico { font-size: 30px; }
.qplay .qsyl { font-size: 26px; font-weight: 900; letter-spacing: 1px; }
.qplay .qre { font-size: 11px; opacity: 0.9; font-weight: 700; }
.qopts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.qopt { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 14px 8px; border-radius: var(--r-md); border: 2px solid var(--hairline); background: #fff; transition: 0.12s; }
.qopt:hover { border-color: var(--primary); background: var(--soft); }
.qopt .qmark { font-size: 28px; font-weight: 900; color: var(--ink); }
.qopt.t1 .qmark { color: var(--tone1); } .qopt.t2 .qmark { color: var(--tone2); } .qopt.t3 .qmark { color: var(--tone3); } .qopt.t4 .qmark { color: var(--tone4); }
.qopt .qnum { font-size: 11px; color: var(--muted); font-weight: 800; }
.qopt.right { border-color: var(--success); background: var(--success-soft); }
.qopt.wrong { border-color: var(--error); background: #fde8e8; }
.qopt.dim { opacity: 0.45; }
.qfeed { height: 22px; margin-top: 14px; font-weight: 800; font-size: 14px; opacity: 0; transition: opacity 0.15s; }
.qfeed.show { opacity: 1; }
.qfeed .ok { color: var(--success); }
.qfeed .no { color: var(--error); }
.qnext { width: 100%; margin-top: 14px; padding: 13px; border-radius: var(--r-pill); background: #fff; color: var(--primary-strong); font-weight: 900; font-size: 15px; box-shadow: var(--sh-card); }
.qhint { text-align: center; color: rgba(255, 255, 255, 0.85); font-size: 12px; margin-top: 14px; font-weight: 600; }

/* mobile */
@media (max-width: 640px) {
  .phead h1 { font-size: 24px; }
  .wall { grid-template-columns: 1fr 1fr; }
  .wall.syl { grid-template-columns: 1fr 1fr; }
  .secbar { gap: 10px; }
  .practice { width: 100%; justify-content: center; order: 3; }
}
@media (max-width: 420px) {
  .wall { grid-template-columns: 1fr; }
}
</style>
