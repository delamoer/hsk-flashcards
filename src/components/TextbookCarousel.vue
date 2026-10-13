<template>
  <!-- 首页「01 教材」：3D 书架翻页 + 水墨晕染背景（design-demos/carousel-d-hybrid.html）。
       课程完全由 courseRegistry 驱动：加一套课程只需 courses.js 一条；没有书封 / 横幅图时
       分别用系列色线装封面 / 系列色水墨兜底，课程多于 DOT_MAX 套时圆点换成「03 / 12」计数。 -->
  <div class="tc" :style="{ '--sc': cur.seriesColor }">
    <div
      v-for="l in layers"
      :key="l.key"
      class="bgl"
      :class="{ wash: !l.band, enter: l.enter }"
      :style="{ '--sc': l.color }"
      aria-hidden="true"
      @animationend="onInkEnd(l, $event)"
    >
      <div class="img" :style="l.band ? { backgroundImage: `url(${l.band})` } : null"></div>
      <div class="tint"></div>
    </div>

    <div class="side">
      <slot name="head" />
      <div class="info" :key="cur.id">
        <div class="zh">{{ cur.heroTitle }}</div>
        <div class="en">{{ cur.nameEn }}</div>
        <div class="d">{{ cur.desc }}</div>
        <div class="stats">
          <template v-if="stats.words">
            <div>{{ stats.units }}<small>册 Books</small></div>
            <div>{{ stats.lessons }}<small>课 Lessons</small></div>
            <div>{{ stats.words.toLocaleString() }}<small>词 Words</small></div>
          </template>
          <div v-else>—<small>即将上线 Coming soon</small></div>
        </div>
      </div>
      <div class="ctas">
        <router-link class="cta" :to="linkOf(cur)">进入教材 Open <span class="ar">→</span></router-link>
        <router-link class="all" to="/courses">全部教材 All Courses <span class="ar">›</span></router-link>
      </div>
    </div>

    <div
      ref="stageEl"
      class="stage"
      tabindex="0"
      aria-roledescription="carousel"
      :aria-label="`教材 Textbooks — ${cur.heroTitle}`"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @focusin="hover = true"
      @focusout="hover = false"
      @keydown.right.prevent="go(idx + 1)"
      @keydown.left.prevent="go(idx - 1)"
      @wheel="onWheel"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="sx = null"
    >
      <div class="track">
        <div
          v-for="(s, i) in list"
          :key="s.id"
          class="book"
          :class="{ active: i === idx }"
          :style="bookStyle(i)"
          @click="onBook(i)"
        >
          <template v-for="r in 2" :key="r">
            <div :class="r === 2 ? 'refl' : 'wrap'">
              <div
                class="face"
                :class="{ plain: !bookCover[s.id] }"
                :style="{ '--sc': s.seriesColor, backgroundImage: bookCover[s.id] ? `url(${bookCover[s.id]})` : null }"
              >
                <div v-if="!bookCover[s.id]" class="ptitle">{{ s.heroTitle.replace(/\s/g, "") }}</div>
                <div class="band">
                  <span class="seal">{{ s.seal.cn }}</span>
                  <span class="bt"><b>{{ s.heroTitle }}</b><i>{{ s.nameEn }}</i></span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <button class="nav prev" type="button" aria-label="上一套 Previous" @click="go(idx - 1)">‹</button>
      <button class="nav next" type="button" aria-label="下一套 Next" @click="go(idx + 1)">›</button>

      <div class="pager" :class="{ paused: !running }">
        <template v-if="list.length <= DOT_MAX">
          <button
            v-for="(s, i) in list"
            :key="`${s.id}-${i === idx ? tick : 0}`"
            type="button"
            class="dot"
            :class="{ on: i === idx }"
            :aria-label="s.heroTitle"
            @click="go(i)"
          ><i></i></button>
        </template>
        <div v-else class="counter">
          <b>{{ String(idx + 1).padStart(2, "0") }}</b>/ {{ String(list.length).padStart(2, "0") }}
          <span class="pbar"><i :key="tick"></i></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { bookCover, seriesBand } from "@/assets/img.js";

const props = defineProps({
  list: { type: Array, required: true }, // courseRegistry entries
});

const DUR = 4500; // ms per book
const DOT_MAX = 7; // more courses than this → numeric counter instead of dots

const router = useRouter();
const idx = ref(0);
const tick = ref(0); // re-keys the progress bar so its CSS fill restarts
const hover = ref(false);
const visible = ref(true);
const stageEl = ref(null);
const narrow = ref(false);
const reduceMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

const cur = computed(() => props.list[idx.value] || props.list[0]);
const running = computed(() => !hover.value && visible.value && !reduceMotion);

const stats = computed(() => {
  const units = (cur.value?.units || []).filter((u) => u.available);
  return {
    units: units.length,
    lessons: units.reduce((n, u) => n + (u.lessonCount || 0), 0),
    words: units.reduce((n, u) => n + (u.wordCount || 0), 0),
  };
});

function linkOf(s) {
  return s.single ? `/course/${s.id}/${s.units[0].id}` : `/course/${s.id}`;
}

// ── 3D 书架布局 ─────────────────────────────
function offset(i) {
  const n = props.list.length;
  let o = i - idx.value;
  if (o > n / 2) o -= n;
  if (o < -n / 2) o += n;
  return o;
}
function bookStyle(i) {
  const o = offset(i);
  const a = Math.abs(o);
  const gap = narrow.value ? 104 : 142;
  const x = o * gap + (o ? Math.sign(o) * (narrow.value ? 30 : 56) : 0);
  const visibleSpan = narrow.value ? 1 : 2;
  return {
    transform: `translateX(${x}px) translateZ(${-a * 150}px) rotateY(${o ? -Math.sign(o) * 48 : 0}deg) scale(${o ? 0.86 : 1.06})`,
    zIndex: 20 - a,
    filter: o ? `brightness(${1 - a * 0.12}) saturate(${1 - a * 0.15})` : "none",
    opacity: a > visibleSpan ? 0 : 1,
    pointerEvents: a > visibleSpan ? "none" : null,
  };
}

// ── 背景水墨晕染层 ──────────────────────────
// 至多两层：正在显示的 + 正在晕开的新层；快速连切时多余的旧层直接丢弃。
let layerSeq = 0;
const layers = ref([]);
function pushLayer(s, animate) {
  const layer = { key: ++layerSeq, band: seriesBand[s.id] || null, color: s.seriesColor, enter: animate && !reduceMotion };
  const shown = layers.value.filter((l) => !l.enter).slice(-1);
  layers.value = layer.enter ? [...shown, layer] : [layer];
}
function onInkEnd(l, e) {
  if (e.animationName !== "tc-ink") return;
  l.enter = false;
  layers.value = layers.value.filter((x) => x === l || x.key > l.key);
}

// ── 切换 / 自动播放 ─────────────────────────
let timer = null;
function schedule() {
  clearTimeout(timer);
  if (running.value && props.list.length > 1) timer = setTimeout(() => go(idx.value + 1), DUR);
}
function go(i) {
  const n = props.list.length;
  const next = ((i % n) + n) % n;
  if (next !== idx.value) {
    idx.value = next;
    pushLayer(cur.value, true);
  }
  tick.value++;
  schedule();
}
watch(running, (on) => {
  if (on) tick.value++; // 恢复播放时进度条从头走，和重新计时对齐
  schedule();
});

function onBook(i) {
  if (dragged) return;
  if (i === idx.value) router.push(linkOf(cur.value));
  else go(i);
}

// 横向滚轮 / 触控板左右滑（纵向滚动照常滚页面）
let wheelAt = 0;
function onWheel(e) {
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
  e.preventDefault();
  if (Date.now() - wheelAt < 500) return;
  wheelAt = Date.now();
  go(idx.value + (e.deltaX > 0 ? 1 : -1));
}
// 拖拽 / 手机左右滑
const sx = ref(null);
let dragged = false;
function onDown(e) {
  sx.value = e.clientX;
  dragged = false;
}
function onMove(e) {
  if (sx.value !== null && Math.abs(e.clientX - sx.value) > 8) dragged = true;
}
function onUp(e) {
  if (sx.value !== null && Math.abs(e.clientX - sx.value) > 40) go(idx.value + (e.clientX < sx.value ? 1 : -1));
  sx.value = null;
  setTimeout(() => (dragged = false));
}

// 板块不在视口内 / 标签页切走时暂停
let io = null;
let mq = null;
const onVis = () => (visible.value = !document.hidden && inView);
let inView = true;
const onMq = () => (narrow.value = mq.matches);
onMounted(() => {
  pushLayer(cur.value, false);
  mq = matchMedia("(max-width: 920px)");
  onMq();
  mq.addEventListener("change", onMq);
  io = new IntersectionObserver(([en]) => {
    inView = en.isIntersecting;
    onVis();
  });
  io.observe(stageEl.value);
  document.addEventListener("visibilitychange", onVis);
  schedule();
});
onBeforeUnmount(() => {
  clearTimeout(timer);
  io?.disconnect();
  mq?.removeEventListener("change", onMq);
  document.removeEventListener("visibilitychange", onVis);
});
</script>

<style scoped>
.tc { grid-column: 1 / -1; display: grid; grid-template-columns: 236px minmax(0, 1fr); position: relative; min-height: calc(var(--sec-h, 400px) - 2px); isolation: isolate; }

/* ── 背景层 ── */
.bgl { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
.bgl .img { position: absolute; inset: -4%; background-size: cover; background-position: center; animation: tc-kb 12s ease-out forwards; }
.bgl.wash .img {
  background:
    radial-gradient(ellipse 50% 60% at 72% 62%, color-mix(in srgb, var(--sc) 38%, transparent), transparent 70%),
    radial-gradient(ellipse 30% 40% at 90% 20%, color-mix(in srgb, var(--sc) 22%, transparent), transparent 70%),
    radial-gradient(ellipse 40% 30% at 40% 90%, color-mix(in srgb, var(--sc) 16%, transparent), transparent 70%),
    #f3ead9;
}
.bgl .tint {
  position: absolute; inset: 0;
  background:
    linear-gradient(90deg, rgba(249,243,232,.96) 0%, rgba(249,243,232,.9) 22%, rgba(249,243,232,.55) 50%, rgba(249,243,232,.38) 100%),
    radial-gradient(ellipse 45% 55% at 62% 55%, color-mix(in srgb, var(--sc) 22%, transparent), transparent 70%);
}
@keyframes tc-kb { from { transform: scale(1.03); } to { transform: scale(1.11) translateX(-1.5%); } }
@property --tc-r { syntax: "<percentage>"; inherits: true; initial-value: 0%; }
.bgl.enter {
  z-index: 0;
  -webkit-mask: radial-gradient(circle at 62% 50%, #000 var(--tc-r), transparent calc(var(--tc-r) + 16%));
  mask: radial-gradient(circle at 62% 50%, #000 var(--tc-r), transparent calc(var(--tc-r) + 16%));
  animation: tc-ink 1.3s cubic-bezier(.55,.05,.25,1) forwards;
}
@keyframes tc-ink { from { --tc-r: 0%; } to { --tc-r: 130%; } }

/* ── 左栏 ── */
.side { position: relative; z-index: 2; align-self: center; padding: 22px 18px 22px 30px; }
.info { margin-top: 14px; }
.info .zh { font-family: var(--brush); font-size: 30px; line-height: 1.2; color: var(--sc); clip-path: inset(0 100% 0 0); animation: tc-brush .9s .1s cubic-bezier(.6,.05,.2,1) forwards; }
.info .en { font-family: var(--serif-en); font-style: italic; font-size: 14px; color: var(--muted); }
.info .d { font-family: var(--serif-cn); font-size: 13.5px; line-height: 1.6; color: var(--ink-soft, #4a3d2a); margin-top: 6px; }
.stats { display: flex; gap: 18px; margin-top: 12px; }
.stats div { font-family: var(--caps); font-weight: 700; font-size: 22px; line-height: 1; color: var(--ink); }
.stats small { display: block; white-space: nowrap; font-family: var(--han); font-weight: 400; font-size: 11px; color: var(--muted); margin-top: 4px; letter-spacing: .3px; }
.info .en, .info .d, .info .stats { animation: tc-up .7s cubic-bezier(.2,.8,.2,1) both; }
.info .en { animation-delay: .25s; } .info .d { animation-delay: .32s; } .info .stats { animation-delay: .4s; }
@keyframes tc-brush { to { clip-path: inset(0 -6% 0 0); } }
@keyframes tc-up { from { opacity: 0; transform: translateY(10px); filter: blur(3px); } to { opacity: 1; transform: none; filter: none; } }
.ctas { display: inline-flex; flex-direction: column; align-items: stretch; gap: 10px; margin-top: 18px; }
.cta, .all { white-space: nowrap; justify-content: space-between; }
/* 次级按钮：描边 + 系列色，和主按钮同宽 */
.all { display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 7px; border: 1.5px solid color-mix(in srgb, var(--sc) 55%, transparent); background: rgba(250,245,236,.78); color: color-mix(in srgb, var(--sc) 80%, #000); font-family: var(--serif-cn); font-weight: 600; font-size: 13.5px; letter-spacing: .5px; transition: background .25s, color .6s, border-color .6s, transform .2s; }
.all:hover { background: color-mix(in srgb, var(--sc) 12%, #faf5ec); transform: translateY(-1px); }
.all .ar { font-size: 17px; line-height: 1; transition: transform .2s; } .all:hover .ar { transform: translateX(3px); }
.cta { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(145deg, var(--sc), color-mix(in srgb, var(--sc) 70%, #000)); color: #fbeecf; font-family: var(--serif-cn); font-weight: 600; font-size: 14px; letter-spacing: 1px; padding: 9px 18px; border-radius: 7px; box-shadow: 0 4px 12px -4px color-mix(in srgb, var(--sc) 60%, transparent); transition: background .6s, transform .2s; }
.cta:hover { transform: translateY(-1px); }
.cta .ar { transition: transform .2s; } .cta:hover .ar { transform: translateX(3px); }

/* ── 3D 书架 ── */
.stage { position: relative; z-index: 1; min-height: calc(var(--sec-h, 400px) - 2px); perspective: 1300px; perspective-origin: 50% 40%; overflow: hidden; touch-action: pan-y; outline: none; }
.stage:focus-visible { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--sc) 50%, transparent); }
.track { position: absolute; left: 50%; top: 40px; width: 0; height: 0; transform-style: preserve-3d; }
.book { position: absolute; width: 190px; height: 258px; left: -95px; top: 0; cursor: pointer; transform-style: preserve-3d; transition: transform .9s cubic-bezier(.2,.75,.15,1), filter .9s, opacity .6s; will-change: transform; }
.wrap { position: absolute; inset: 0; }
.face { position: absolute; inset: 0; border-radius: 5px 9px 9px 5px; overflow: hidden; background-color: #d8cbb2; background-size: cover; background-position: center; box-shadow: 0 20px 36px -6px rgba(40,25,5,.38), inset 6px 0 10px rgba(0,0,0,.18); }
.face::before { content: ""; position: absolute; left: 11px; top: 0; bottom: 0; width: 1px; z-index: 1; background: rgba(0,0,0,.18); box-shadow: 4px 0 0 rgba(255,255,255,.18); }
.face::after { content: ""; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.35) 48%, transparent 60%); transform: translateX(-120%); transition: transform 1.2s; }
.book.active .wrap .face::after { transform: translateX(120%); }
.face.plain { background: linear-gradient(160deg, color-mix(in srgb, var(--sc) 70%, #f2e6cf), var(--sc)); }
.face.plain .ptitle { position: absolute; right: 22px; top: 24px; padding: 12px 7px; background: #f6ecd8; border: 1px solid rgba(0,0,0,.15); writing-mode: vertical-rl; font-family: var(--brush); font-size: 22px; color: var(--ink); letter-spacing: 4px; }
.band { position: absolute; left: 0; right: 0; bottom: 0; padding: 11px 12px 12px; color: #fbeecf; display: flex; gap: 9px; align-items: center; background: linear-gradient(180deg, transparent, var(--sc) 30%); }
.seal { width: 27px; height: 27px; flex: none; border: 1.5px solid rgba(251,238,207,.8); border-radius: 4px; display: grid; place-items: center; font-family: var(--serif-cn); font-weight: 700; font-size: 15px; }
.bt { min-width: 0; line-height: 1.2; }
.bt b { font-family: var(--serif-cn); font-weight: 700; font-size: 15px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bt i { font-family: var(--serif-en); font-style: italic; font-size: 11.5px; opacity: .88; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.refl { position: absolute; left: 0; right: 0; top: 100%; height: 100%; margin-top: 6px; transform: scaleY(-1); opacity: .24; pointer-events: none; -webkit-mask-image: linear-gradient(0deg, rgba(0,0,0,.55), transparent 42%); mask-image: linear-gradient(0deg, rgba(0,0,0,.55), transparent 42%); }
.refl .face { box-shadow: none; }
.nav { position: absolute; top: 150px; z-index: 5; width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--line); background: rgba(250,245,236,.9); font-family: var(--caps); font-size: 22px; line-height: 1; color: var(--ink); cursor: pointer; transition: .25s; }
.nav:hover { background: var(--cinnabar); color: #fbeecf; border-color: var(--cinnabar); }
.prev { left: 14px; } .next { right: 16px; }

/* 进度：圆点（≤7 套）/ 计数器（>7 套） */
.pager { position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%); z-index: 5; display: flex; gap: 9px; align-items: center; }
.dot { width: 24px; height: 4px; padding: 0; border: 0; border-radius: 3px; background: rgba(117,103,79,.25); overflow: hidden; cursor: pointer; }
.dot i { display: block; height: 100%; width: 0; background: var(--sc); }
.dot.on i { animation: tc-fill 4.5s linear forwards; }
.counter { display: flex; align-items: center; gap: 10px; padding: 4px 14px; border-radius: 99px; background: rgba(250,245,236,.85); box-shadow: 0 2px 8px rgba(60,40,10,.08); font-family: var(--caps); font-weight: 600; font-size: 14px; color: var(--muted); letter-spacing: 2px; }
.counter b { font-size: 22px; color: var(--sc); }
.pbar { width: 100px; height: 3px; background: rgba(117,103,79,.25); border-radius: 2px; overflow: hidden; }
.pbar i { display: block; height: 100%; width: 0; background: var(--sc); animation: tc-fill 4.5s linear forwards; }
.pager.paused i { animation-play-state: paused; }
@keyframes tc-fill { to { width: 100%; } }

@media (max-width: 920px) {
  .tc { grid-template-columns: 1fr; }
  .side { align-self: start; padding: 24px 24px 0; }
  .stage { min-height: 360px; }
  .nav { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .book, .bgl .img { transition: none; animation: none; }
  .info .zh { clip-path: none; animation: none; }
}
</style>
