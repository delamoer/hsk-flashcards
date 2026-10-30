<template>
  <div class="rv">
    <div v-if="loading" class="state">加载中… <i>Loading…</i></div>
    <div v-else-if="!L" class="state">没有这篇文章 <i>Story not found</i> · <router-link to="/reading">回书架 Back to shelf</router-link></div>

    <template v-else>
      <div class="spread">
        <!-- 正文：线装书页（双线版框） -->
        <article class="page">
          <header class="pg-head">
            <div class="crumb">
              <router-link to="/reading">课外阅读 Reading</router-link><span class="dot">·</span><span>{{ data.series }} {{ data.level }}</span><span class="dot">·</span><span>第{{ cn(L.n) }}篇</span>
            </div>
            <h1>{{ L.title }}</h1>
            <div class="sub"><span class="py">{{ L.py }}</span><span class="en">{{ L.en }}</span></div>
            <div class="orn"><span>◆</span></div>
          </header>

          <aside v-if="L.daodu" class="lead">
            <b class="seal">导读</b>
            <div class="lead-t">
              <p>{{ L.daodu }}</p>
              <p v-if="show.en && L.daoduEn" class="en">{{ L.daoduEn }}</p>
            </div>
          </aside>

          <div class="tools">
            <span class="t-meta">{{ L.chars }} 字 · {{ L.paras.length }} 段</span>
            <div class="tgs">
              <button v-for="t in TOGGLES" :key="t.k" class="tg" :class="{ on: show[t.k] }" @click="show[t.k] = !show[t.k]">
                <span class="box"></span>{{ t.cn }}<i>{{ t.en }}</i>
              </button>
            </div>
          </div>

          <div class="paras" :class="{ dlg: hasTalk }" @click="onWord">
            <div v-for="(p, i) in L.paras" :key="i" class="para" :class="{ playing: nowPlaying === p.zh }">
              <span class="pn">{{ cn(i + 1) }}</span>
              <span v-if="hasTalk" class="who">{{ p.name || "" }}</span>
              <div class="body">
                <div class="zh" v-html="zhHtml(p.zh)"></div>
                <div v-if="show.py" class="py" v-html="pyHtml(p.py)"></div>
                <div v-if="show.en && p.en" class="en">{{ p.en }}</div>
              </div>
              <button class="play" :title="nowPlaying === p.zh ? '停止 Stop' : '朗读 Play'" @click.stop="say(p.zh)">
                <svg v-if="nowPlaying === p.zh" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1.5" /></svg>
                <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" /><path d="M15.5 9a4 4 0 0 1 0 6" /><path d="M18 6.5a7.5 7.5 0 0 1 0 11" /></svg>
              </button>
            </div>
          </div>
          <!-- 窄屏右栏落到正文下面，点生词改用浮层 -->
          <div v-if="pop" class="pop" :style="{ left: pop.x + 'px', top: pop.y + 'px' }">
            <b>{{ pop.w.w }}</b><span class="ppy">{{ pop.w.py }}</span><span class="pen">{{ pop.w.en }}</span>
          </div>
        </article>

        <!-- 右侧夹签：生词 + 语言点 -->
        <aside class="notes">
          <section class="nt">
            <h4><b>生词</b><i>New words</i><span class="ct">{{ L.vocab.length }}</span></h4>
            <ul class="wl">
              <li v-for="w in L.vocab" :key="w.w" :class="{ hot: hot === w.w }" @mouseenter="hot = w.w" @mouseleave="hot = ''" @click="say(w.w)">
                <div class="w1"><b>{{ w.w }}</b><span class="py" v-html="pyHtml(w.py)"></span></div>
                <div class="w2"><span v-if="w.pos" class="pos">{{ w.pos }}</span>{{ w.en }}</div>
              </li>
            </ul>
          </section>
          <section v-if="L.points.length" class="nt">
            <h4><b>语言点</b><i>Language points</i></h4>
            <details v-for="(p, i) in L.points" :key="i" class="lp">
              <summary><b>{{ p.name }}</b><i>{{ p.en }}</i></summary>
              <div v-if="p.eg" class="eg">{{ p.eg }}<i v-if="p.egEn">{{ p.egEn }}</i></div>
              <p>{{ p.zh }}</p>
              <p class="en">{{ p.enx }}</p>
              <div v-for="(x, k) in p.egs" :key="k" class="egx">{{ x }}</div>
            </details>
          </section>
        </aside>
      </div>

      <section ref="afterEl" class="after">
        <div v-if="L.tf.length || L.mc.length" class="blk">
          <h3><span class="dm">◆</span>练习<i>Exercises</i></h3>
          <template v-if="L.tf.length">
            <div class="ex-h"><b>判断正误</b><i>True or false</i><span class="hint">点 √ 或 × · Tap √ or ×</span></div>
            <div v-for="(q, i) in L.tf" :key="'tf' + i" class="tf" :class="tfState(i)">
              <span class="qn">{{ i + 1 }}</span>
              <span class="qt">{{ q.q }}</span>
              <div class="tfb">
                <button :class="{ pick: ans['tf' + i] === true }" @click="ans['tf' + i] = true">√</button>
                <button :class="{ pick: ans['tf' + i] === false }" @click="ans['tf' + i] = false">×</button>
              </div>
              <span v-if="ans['tf' + i] !== undefined" class="fb">{{ ans["tf" + i] === q.a ? "对了 Correct" : `答案是 ${q.a ? "√" : "×"} · Answer: ${q.a ? "true" : "false"}` }}</span>
            </div>
          </template>
          <template v-if="L.mc.length">
            <div class="ex-h"><b>选择正确答案</b><i>Multiple choice</i><span class="hint">点一个选项 · Tap an option</span></div>
            <div v-for="(q, i) in L.mc" :key="'mc' + i" class="mc">
              <div class="mc-q"><span class="qn">{{ i + 1 }}</span>{{ q.q }}</div>
              <div class="mc-o">
                <button v-for="(o, j) in q.options" :key="j" :class="mcState(i, j)" :disabled="ans['mc' + i] !== undefined" @click="ans['mc' + i] = j">
                  <span class="lt">{{ "ABCD"[j] }}</span>{{ o }}
                </button>
              </div>
            </div>
          </template>
          <button v-if="Object.keys(ans).length" class="redo" @click="resetAns">重做 <i>Try again</i></button>
        </div>

        <div v-if="L.think.length" class="blk">
          <h3><span class="dm">◆</span>想一想<i>Think about it</i></h3>
          <ol class="think"><li v-for="(q, i) in L.think" :key="i">{{ q }}</li></ol>
        </div>

        <div v-if="L.tip" class="blk">
          <h3><span class="dm">◆</span>小知识<i>Culture note</i></h3>
          <div class="tip">
            <div class="tip-h"><span class="tip-seal">知</span><b>{{ L.tip.title }}</b><i>{{ L.tip.titleEn }}</i></div>
            <p v-for="(x, k) in L.tip.zh.split('\n')" :key="'z' + k">{{ x }}</p>
            <template v-if="show.en"><p v-for="(x, k) in L.tip.en.split('\n')" :key="'e' + k" class="en">{{ x }}</p></template>
          </div>
        </div>

        <div class="pager">
          <router-link v-if="prev" :to="`/reading/${book}/${prev.n}`"><i>上一篇 Previous</i>← {{ prev.title }}</router-link><span v-else></span>
          <router-link v-if="next" class="nx" :to="`/reading/${book}/${next.n}`"><i>下一篇 Next</i>{{ next.title }} →</router-link>
          <router-link v-else class="nx" to="/reading"><i>读完了 All done</i>回书架 →</router-link>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onBeforeUnmount, nextTick } from "vue";
import { loadReadingBook } from "@/data/reading";
import { useReading } from "@/composables/useReading";
import { useSettings } from "@/composables/useSettings";
import { colorPinyin } from "@/utils/pinyinTones";
import { speak, nowPlaying, preload } from "@/utils/tts";

const props = defineProps({ book: { type: String, required: true }, n: { type: Number, required: true } });

const { settings } = useSettings();
const { markRead } = useReading();
const data = ref(null);
const loading = ref(true);
const L = computed(() => data.value?.lessons.find((l) => l.n === props.n) || null);
const prev = computed(() => data.value?.lessons.find((l) => l.n === props.n - 1));
const next = computed(() => data.value?.lessons.find((l) => l.n === props.n + 1));
const hasTalk = computed(() => !!L.value?.paras.some((p) => p.name));

// 拼音 / 英文 off by default (like 课文); 生词 highlighting on
const show = reactive({ py: false, vw: true, en: false });
const TOGGLES = [{ k: "py", cn: "拼音", en: "Pinyin" }, { k: "vw", cn: "生词", en: "Words" }, { k: "en", cn: "英文", en: "English" }];

const hot = ref("");
const pop = ref(null);
const ans = reactive({});
function resetAns() {
  Object.keys(ans).forEach((k) => delete ans[k]);
}

watch(
  () => props.book,
  async (key) => {
    loading.value = true;
    data.value = await loadReadingBook(key);
    loading.value = false;
  },
  { immediate: true }
);
watch(
  () => [props.n, L.value],
  () => {
    hot.value = "";
    pop.value = null;
    resetAns();
    if (L.value) {
      preload(L.value.paras.map((p) => p.zh));
      nextTick(observeEnd);
    }
  },
  { immediate: true }
);

const CN = "零一二三四五六七八九十";
function cn(n) {
  if (n <= 10) return CN[n];
  if (n < 20) return "十" + (n % 10 ? CN[n % 10] : "");
  return CN[Math.floor(n / 10)] + "十" + (n % 10 ? CN[n % 10] : "");
}
function say(t) {
  speak(t, { rate: settings.ttsRate });
}
function pyHtml(py) {
  return settings.toneColors ? colorPinyin(py) : esc(py);
}

// 生词 highlight: longest word first, never overlapping (证 inside 签证 stays part of 签证)
const esc = (x) => String(x ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const byLength = computed(() => [...(L.value?.vocab || [])].sort((a, b) => b.w.length - a.w.length));
function zhHtml(zh) {
  if (!show.vw) return esc(zh);
  const marks = new Array(zh.length).fill(null);
  for (const { w } of byLength.value) {
    for (let i = zh.indexOf(w); i >= 0; i = zh.indexOf(w, i + 1)) {
      if (marks.slice(i, i + w.length).every((x) => x === null)) marks.fill(w, i, i + w.length);
    }
  }
  let out = "";
  for (let k = 0; k < zh.length; ) {
    const w = marks[k];
    if (w) {
      out += `<span class="vw${hot.value === w ? " hot" : ""}" data-w="${esc(w)}">${esc(w)}</span>`;
      k += w.length;
    } else out += esc(zh[k++]);
  }
  return out;
}
// 点正文里的生词 → 右栏词条亮起；窄屏（右栏在下面）再弹一个小浮层
function onWord(e) {
  const el = e.target.closest(".vw");
  if (!el || hot.value === el.dataset.w) {
    hot.value = "";
    pop.value = null;
    return;
  }
  hot.value = el.dataset.w;
  if (window.matchMedia("(max-width: 960px)").matches) {
    const box = el.closest(".page").getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const w = L.value.vocab.find((x) => x.w === el.dataset.w);
    pop.value = { w, x: Math.max(8, Math.min(r.left - box.left, box.width - 240)), y: r.bottom - box.top + 6 };
  }
}

function tfState(i) {
  const a = ans["tf" + i];
  return a === undefined ? "" : a === L.value.tf[i].a ? "right" : "wrong";
}
function mcState(i, j) {
  const a = ans["mc" + i];
  if (a === undefined) return "";
  if (j === L.value.mc[i].answer) return "right";
  return a === j ? "wrong" : "dim";
}

// 读到练习区就算「已读」
const afterEl = ref(null);
let io = null;
function observeEnd() {
  io?.disconnect();
  if (!afterEl.value) return;
  io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) {
      markRead(props.book, props.n);
      io.disconnect();
    }
  });
  io.observe(afterEl.value);
}
onBeforeUnmount(() => io?.disconnect());
</script>

<style scoped>
.rv { max-width: 1200px; margin: 0 auto; padding: 30px 28px 80px; }
.state { text-align: center; padding: 80px 0; font-family: var(--serif-cn); color: var(--muted); }
.state i { font-family: var(--serif-en); }
.state a { color: var(--cinnabar-dk); }

.spread { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 36px; align-items: start; }

/* ── 书页：双线版框 + 纸底，书页底下垫两层纸边 ── */
.page { position: relative; padding: 46px 54px 40px; background: linear-gradient(rgba(252,248,240,.92), rgba(247,240,226,.92)), url("../assets/img/motif/cloud.webp") right 20px bottom 16px / 220px auto no-repeat, #faf5ea; border: 1px solid var(--border-strong); border-radius: 4px; box-shadow: 0 1px 0 #efe4cf, 0 3px 0 #e6d8bd, 0 18px 34px -22px rgba(45,30,10,.45); }
.page::before { content: ""; position: absolute; inset: 12px; border: 2px solid rgba(122,43,33,.28); outline: 1px solid rgba(122,43,33,.18); outline-offset: 3px; pointer-events: none; }
.pg-head { text-align: center; }
.crumb { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; font-family: var(--han); font-size: 12.5px; color: var(--muted-soft); }
.crumb a { color: var(--muted); }
.crumb a:hover { color: var(--cinnabar); }
.crumb .dot { color: var(--line); }
.pg-head h1 { font-family: var(--brush); font-weight: 400; font-size: 54px; letter-spacing: 3px; line-height: 1.15; color: var(--sumi); margin-top: 14px; }
.sub { display: flex; flex-wrap: wrap; justify-content: center; align-items: baseline; gap: 4px 14px; margin-top: 4px; }
.sub .py { font-family: var(--ui); font-size: 15px; font-weight: 600; color: var(--gold-deep); }
.sub .en { font-family: var(--serif-en); font-style: italic; font-size: 19px; color: var(--muted); }
.orn { display: flex; align-items: center; gap: 14px; max-width: 220px; margin: 18px auto 0; color: var(--cinnabar); font-size: 9px; }
.orn::before, .orn::after { content: ""; flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold-lt), transparent); }

.lead { display: flex; gap: 14px; align-items: flex-start; max-width: 34em; margin: 22px auto 0; }
.seal { flex: 0 0 auto; writing-mode: vertical-rl; padding: 7px 4px; letter-spacing: 4px; line-height: 1; font-family: var(--serif-cn); font-size: 13px; font-weight: 700; color: #fbe7d4; background: linear-gradient(145deg, var(--seal-a), var(--seal-b)); border-radius: 3px; box-shadow: inset 0 0 0 1.5px rgba(251,231,212,.45); }
.lead-t p { font-family: var(--serif-cn); font-size: 15.5px; line-height: 1.85; color: var(--muted); }
.lead-t p.en { font-family: var(--serif-en); font-style: italic; font-size: 16px; line-height: 1.5; margin-top: 4px; }

.tools { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin: 26px -6px 6px; padding: 10px 6px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.t-meta { font-family: var(--han); font-size: 12.5px; color: var(--muted-soft); }
.tgs { display: flex; gap: 6px; }
.tg { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 13px 0 10px; border-radius: 99px; border: 1px solid var(--line); background: rgba(251,247,238,.7); font-family: var(--han); font-size: 13px; color: var(--body); white-space: nowrap; transition: .15s; }
.tg i { font-family: var(--ui); font-style: normal; font-size: 11px; color: var(--muted-soft); }
.tg .box { position: relative; width: 13px; height: 13px; border-radius: 3px; border: 1.5px solid var(--border-strong); background: #fff8ec; }
.tg:hover { border-color: var(--gold); }
.tg.on { border-color: var(--gold-deep); background: var(--accent-soft); color: var(--ink); }
.tg.on .box { background: var(--cinnabar); border-color: var(--cinnabar); }
.tg.on .box::after { content: ""; position: absolute; left: 3.5px; top: .5px; width: 3px; height: 7px; border: solid #fff; border-width: 0 1.6px 1.6px 0; transform: rotate(45deg); }

.paras { padding-top: 14px; }
.para { display: grid; grid-template-columns: 30px minmax(0, 1fr) 30px; column-gap: 14px; padding: 6px 0; }
.paras.dlg .para { grid-template-columns: 30px 52px minmax(0, 1fr) 30px; }
.pn { font-family: var(--serif-cn); font-size: 12px; color: var(--gold-lt); text-align: right; padding-top: .7em; user-select: none; }
.who { font-family: var(--serif-cn); font-weight: 700; font-size: 15px; color: var(--cinnabar-dk); text-align: right; padding-top: .45em; white-space: nowrap; }
.zh { font-family: var(--serif-cn); font-size: 21px; line-height: 2; letter-spacing: .5px; color: var(--ink); text-align: justify; }
.paras:not(.dlg) .zh { text-indent: 2em; }
.body .py { font-family: var(--ui); font-size: 15px; font-weight: 600; line-height: 1.65; color: var(--gold-deep); margin: 2px 0 4px; }
.body .en { font-family: var(--serif-en); font-size: 17px; line-height: 1.5; color: var(--muted); margin: 2px 0 4px; }
.play { width: 30px; height: 30px; margin-top: .4em; border-radius: 50%; display: grid; place-items: center; border: 1px solid transparent; background: none; color: var(--gold-lt); transition: .15s; }
.para:hover .play { color: var(--gold-deep); border-color: var(--line); background: rgba(251,247,238,.9); }
.play:hover, .para.playing .play { color: #fff8ea !important; background: var(--cinnabar) !important; border-color: var(--cinnabar) !important; }
.para.playing .zh { color: var(--cinnabar-dk); }
.zh :deep(.vw) { cursor: pointer; border-radius: 2px; background-image: linear-gradient(transparent 88%, rgba(163,63,46,.55) 88%, rgba(163,63,46,.55) 94%, transparent 94%); transition: background-color .15s; }
.zh :deep(.vw:hover), .zh :deep(.vw.hot) { background-color: rgba(200,150,42,.22); }
.pop { position: absolute; z-index: 5; display: flex; align-items: baseline; gap: 8px; max-width: 240px; padding: 8px 12px; border-radius: 8px; background: var(--sumi); color: #f6ead2; box-shadow: 0 8px 20px rgba(0,0,0,.3); }
.pop b { font-family: var(--serif-cn); font-size: 17px; }
.pop .ppy { color: #e8c98c; font-weight: 700; }
.pop .pen { font-family: var(--serif-en); font-style: italic; }

/* ── 右侧夹签 ── */
.notes { position: sticky; top: calc(var(--appbar-h, 69px) + 18px); display: grid; gap: 18px; }
.nt { position: relative; padding: 16px 14px 12px; background: linear-gradient(170deg, #fcf8f0, #f4ebd9); border: 1px solid var(--line); border-radius: 4px; box-shadow: 0 10px 22px -18px rgba(45,30,10,.5); }
.nt::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 3px; background: var(--cinnabar); opacity: .75; }
.nt h4 { display: flex; align-items: baseline; gap: 8px; padding: 0 10px 8px; margin-bottom: 4px; border-bottom: 1px solid var(--line-soft); }
.nt h4 b { font-family: var(--serif-cn); font-size: 16px; color: var(--ink); }
.nt h4 i { font-family: var(--serif-en); font-style: italic; font-size: 14px; color: var(--muted); }
.nt h4 .ct { margin-left: auto; font-family: var(--ui); font-size: 12px; font-weight: 700; color: var(--muted-soft); }
.wl { list-style: none; padding: 0; margin: 0; }
.wl li { padding: 8px 10px; border-radius: 8px; cursor: pointer; transition: background .15s; }
.wl li.hot { background: rgba(200,150,42,.18); }
.w1 { display: flex; align-items: baseline; gap: 10px; }
.w1 b { font-family: var(--serif-cn); font-size: 18px; font-weight: 700; color: var(--ink); }
.w1 .py { font-family: var(--ui); font-size: 13.5px; font-weight: 600; color: var(--gold-deep); }
.w2 { font-family: var(--ui); font-size: 13px; color: var(--muted); margin-top: 1px; }
.w2 .pos { font-family: var(--serif-en); font-style: italic; color: var(--muted-soft); margin-right: 6px; }
.lp { padding: 10px; border-top: 1px dashed var(--line-soft); }
.lp:first-of-type { border-top: none; }
.lp summary { position: relative; display: flex; flex-direction: column; gap: 1px; padding-right: 18px; cursor: pointer; list-style: none; }
.lp summary::-webkit-details-marker { display: none; }
.lp summary::after { content: "+"; position: absolute; right: 0; top: 0; font-family: var(--ui); font-weight: 700; color: var(--gold); }
.lp[open] summary::after { content: "−"; }
.lp summary b { font-family: var(--serif-cn); font-size: 16px; color: var(--cinnabar-dk); }
.lp summary i { font-family: var(--serif-en); font-style: italic; font-size: 13.5px; color: var(--muted); }
.lp .eg { font-family: var(--serif-cn); font-size: 14px; margin-top: 8px; padding: 6px 10px; border-left: 2px solid var(--gold-lt); }
.lp .eg i { display: block; font-family: var(--serif-en); font-size: 13px; color: var(--muted); }
.lp p { font-family: var(--han); font-size: 13px; line-height: 1.65; color: var(--body); margin-top: 6px; }
.lp p.en { font-family: var(--serif-en); font-style: italic; font-size: 14px; color: var(--muted); margin-top: 2px; }
.lp .egx { font-family: var(--serif-cn); font-size: 13.5px; margin-top: 6px; padding-left: 10px; border-left: 2px solid var(--line); }

/* ── 正文下：练习 · 想一想 · 小知识 ── */
.after { max-width: calc(100% - 336px); }
.blk { margin-top: 44px; }
.blk h3 { display: flex; align-items: baseline; gap: 10px; font-family: var(--serif-cn); font-size: 21px; font-weight: 700; color: var(--ink); padding-bottom: 10px; margin-bottom: 16px; border-bottom: 1px solid var(--line); }
.blk h3 .dm { color: var(--cinnabar); font-size: 11px; }
.blk h3 i { font-family: var(--serif-en); font-weight: 400; font-style: italic; font-size: 16px; color: var(--muted); }
.ex-h { display: flex; align-items: baseline; gap: 8px; margin: 18px 0 10px; }
.blk h3 + .ex-h { margin-top: 0; }
.ex-h b { font-family: var(--serif-cn); font-size: 16px; color: var(--ink); }
.ex-h i { font-family: var(--serif-en); font-style: italic; color: var(--muted); }
.ex-h .hint { margin-left: auto; font-family: var(--han); font-size: 12px; color: var(--muted-soft); }
.qn { font-family: var(--ui); font-size: 12px; font-weight: 800; color: var(--gold); }
.tf { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; column-gap: 12px; align-items: center; padding: 12px 14px; margin-bottom: 8px; border-radius: 10px; background: rgba(251,247,238,.75); border: 1px solid var(--line-soft); transition: .15s; }
.tf .qt { font-family: var(--serif-cn); font-size: 16.5px; line-height: 1.6; color: var(--ink); }
.tfb { display: flex; gap: 6px; }
.tfb button { width: 40px; height: 36px; border-radius: 8px; border: 1px solid var(--line); background: #fffaf0; font-size: 17px; font-weight: 800; color: var(--body); }
.tfb button:hover { border-color: var(--gold-deep); }
.tfb button.pick { background: var(--sumi); border-color: var(--sumi); color: #fff; }
.tf.right { border-color: rgba(45,106,79,.45); background: var(--success-soft); }
.tf.wrong { border-color: rgba(192,57,43,.4); background: var(--primary-soft); }
.tf .fb { grid-column: 2 / -1; margin-top: 4px; font-family: var(--han); font-size: 12.5px; font-weight: 700; }
.tf.right .fb { color: var(--success); }
.tf.wrong .fb { color: var(--cinnabar-dk); }
.mc { padding: 14px; margin-bottom: 10px; border-radius: 10px; background: rgba(251,247,238,.75); border: 1px solid var(--line-soft); }
.mc-q { display: flex; gap: 12px; align-items: baseline; font-family: var(--serif-cn); font-size: 16.5px; line-height: 1.6; color: var(--ink); }
.mc-o { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0 0 38px; }
.mc-o button { display: flex; align-items: center; gap: 10px; text-align: left; padding: 9px 12px; border-radius: 8px; border: 1px solid var(--line); background: #fffaf0; font-family: var(--serif-cn); font-size: 15.5px; color: var(--ink); transition: .15s; }
.mc-o button:not(:disabled):hover { border-color: var(--gold-deep); }
.mc-o button:disabled { cursor: default; }
.mc-o .lt { flex: 0 0 auto; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: var(--soft); font-family: var(--ui); font-size: 11px; font-weight: 800; color: var(--gold-deep); }
.mc-o button.right { border-color: var(--success); background: var(--success-soft); }
.mc-o button.right .lt { background: var(--success); color: #fff; }
.mc-o button.wrong { border-color: var(--error); background: var(--primary-soft); }
.mc-o button.wrong .lt { background: var(--cinnabar); color: #fff; }
.mc-o button.dim { opacity: .55; }
.redo { margin-top: 6px; font-family: var(--serif-cn); font-size: 14px; color: var(--cinnabar-dk); border-bottom: 1px solid currentColor; }
.redo i { font-family: var(--serif-en); }
.think { list-style: none; counter-reset: q; padding: 0; margin: 0; }
.think li { counter-increment: q; position: relative; padding: 12px 14px 12px 50px; font-family: var(--serif-cn); font-size: 17px; line-height: 1.6; color: var(--ink); border-bottom: 1px dashed var(--line-soft); }
.think li::before { content: counter(q); position: absolute; left: 12px; top: 12px; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; border: 1px solid var(--gold-lt); font-family: var(--ui); font-size: 12px; font-weight: 800; color: var(--gold-deep); }
.tip { padding: 22px 26px; border-radius: 12px; background: linear-gradient(rgba(251,247,238,.9), rgba(244,236,219,.9)), url("../assets/img/motif/plum-branch-2.webp") right -14px bottom -14px / 170px auto no-repeat; border: 1px solid var(--line); }
.tip-h { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 12px; margin-bottom: 10px; }
.tip-seal { width: 30px; height: 30px; border-radius: 5px; display: grid; place-items: center; background: linear-gradient(145deg, var(--seal-a), var(--seal-b)); color: #fbe7d4; font-family: var(--serif-cn); font-weight: 900; box-shadow: inset 0 0 0 1.5px rgba(251,231,212,.45); }
.tip-h b { font-family: var(--serif-cn); font-size: 19px; color: var(--ink); }
.tip-h i { font-family: var(--serif-en); font-style: italic; font-size: 16px; color: var(--muted); }
.tip p { font-family: var(--serif-cn); font-size: 16px; line-height: 1.9; color: var(--body); margin-top: 6px; max-width: 46em; }
.tip p.en { font-family: var(--serif-en); font-style: italic; font-size: 16px; line-height: 1.55; color: var(--muted); }
.pager { display: flex; justify-content: space-between; gap: 20px; margin-top: 48px; padding-top: 18px; border-top: 1px solid var(--line); }
.pager a { display: flex; flex-direction: column; gap: 2px; font-family: var(--serif-cn); font-size: 17px; color: var(--ink); }
.pager a i { font-family: var(--han); font-style: normal; font-size: 11.5px; color: var(--muted-soft); }
.pager a.nx { align-items: flex-end; text-align: right; }
.pager a:hover { color: var(--cinnabar-dk); }

@media (max-width: 960px) {
  .spread { grid-template-columns: 1fr; }
  .notes { position: static; }
  .after { max-width: none; }
}
@media (max-width: 600px) {
  .rv { padding: 14px 12px 60px; }
  .page { padding: 34px 22px 26px; }
  .pg-head h1 { font-size: 42px; }
  .zh { font-size: 19px; }
  .para, .paras.dlg .para { grid-template-columns: minmax(0, 1fr) 30px; }
  .pn { display: none; }
  .paras.dlg .who { grid-column: 1 / -1; text-align: left; padding-top: 0; font-size: 13px; }
  .tools { gap: 8px; }
  .tg i { display: none; }
  .mc-o { grid-template-columns: 1fr; margin-left: 0; }
}
</style>
