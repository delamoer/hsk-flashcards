<template>
  <div class="lswrap" v-if="data">
    <div class="page-wm" :style="wmBg" aria-hidden="true"></div>
    <div class="corner-motif" :style="{ backgroundImage: `url(${motifBamboo})` }" aria-hidden="true"></div>
    <div class="crumb">
      <router-link to="/">课程总览 Library</router-link><span class="sep">◇</span>
      <router-link v-if="!series?.single" :to="`/course/${seriesId}`">{{ series?.heroTitle }}</router-link>
      <span v-if="!series?.single" class="sep">◇</span>
      <span class="cur">{{ unitLabel }}</span>
    </div>
    <div class="page-head" v-if="!series?.single">
      <router-link class="back" :to="`/course/${seriesId}`">‹ 返回书架 Back to shelf</router-link>
    </div>

    <div class="ls-hero" :style="{ backgroundImage: bandBg }">
      <div class="ls-seal">{{ sealChar }}</div>
      <h2 class="inscribe">{{ unitLabel }}</h2>
      <div class="sub">共 {{ data.lessons.length }} 课　<span class="en">{{ data.lessons.length }} lessons</span></div>
      <div class="rule"><span class="diamond">◇ ◇ ◇</span></div>
    </div>

    <div class="seg" v-if="ranges.length > 1">
      <button
        v-for="(r, i) in ranges"
        :key="i"
        :class="{ active: i === activeRange }"
        @click="activeRange = i"
      >Lesson {{ r.label }}<span class="en">Part {{ i + 1 }}</span></button>
    </div>

    <div class="lessons" :style="gridWash">
      <router-link
        v-for="lesson in shownLessons"
        :key="lesson.num"
        class="lcard"
        :to="`/course/${seriesId}/${unitId}/lesson/${lesson.num}`"
      >
        <span class="lc-art" :style="{ backgroundImage: `url(${cardArt(lesson.num)})` }" aria-hidden="true"></span>
        <span class="no">第 {{ numCn(lesson.num) }} 课</span>
        <div class="lesson-tag">Lesson {{ pad(lesson.num) }}</div>
        <div class="cn-title">{{ lesson.title }}</div>
        <div class="en">{{ lesson.titleEn }}</div>
        <span v-if="prog(lesson).done" class="ptag done">已掌握 Done</span>
        <span v-else-if="prog(lesson).pct > 0" class="ptag learning">学过 {{ prog(lesson).pct }}%</span>
        <span class="go">→</span>
      </router-link>
    </div>

    <div class="foot-hills" :style="{ backgroundImage: `url(${motifMountainFar})` }" aria-hidden="true"></div>
  </div>
  <div class="lswrap" v-else-if="loading"><p class="muted">加载中… · Loading…</p></div>
  <div class="lswrap" v-else>
    <p class="muted">该课程暂未上线 · This course is not available yet.</p>
    <router-link to="/" class="back" style="margin-top: 16px; display: inline-block">← 返回课程总览 Library</router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { getUnit } from "@/data";
import { getSeries } from "@/data/courses.js";
import { useProgress } from "@/composables/useProgress";
import { seriesBand, watermark, motifBamboo, motifMountainFar, motifPine, motifPlum2, motifPavilion, motifRock } from "@/assets/img.js";

// 每张课卡右下角的淡墨母题——按课次轮换，给卡片添古风又不重复
const CARD_ART = [motifPine, motifBamboo, motifPlum2, motifPavilion, motifMountainFar, motifRock];
function cardArt(n) {
  return CARD_ART[(Number(n) - 1) % CARD_ART.length];
}

const { statusOf } = useProgress();

const props = defineProps({
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
});

const bandBg = computed(() => {
  const img = seriesBand[props.series];
  return img
    ? `linear-gradient(180deg, rgba(250,244,233,.74), rgba(241,231,212,.92)), url(${img})`
    : "none";
});
const WM = { hsk: watermark.pinyin, newhsk3: watermark.words, huihua360: watermark.books, survival: watermark.words };
const wmBg = computed(() => ({ backgroundImage: `url(${WM[props.series] || watermark.books})` }));

// 卡片网格区衬一层极淡山水（纸色覆盖压到 ~10% 可见），填补空旷中段
const gridWash = computed(() => {
  const img = seriesBand[props.series];
  if (!img) return {};
  return {
    backgroundImage: `linear-gradient(rgba(247,241,231,.9), rgba(247,241,231,.93)), url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
});

const seriesId = computed(() => props.series);
const unitId = computed(() => props.unit);

const data = ref(null);
const loading = ref(true);
const activeRange = ref(0);
watch(
  () => [props.series, props.unit],
  async ([s, u]) => {
    loading.value = true;
    activeRange.value = 0;
    data.value = await getUnit(s, u);
    loading.value = false;
  },
  { immediate: true }
);

const series = computed(() => getSeries(props.series));
const unitLabel = computed(() => {
  const u = series.value?.units.find((x) => x.id === Number(props.unit));
  return u?.label || `Unit ${props.unit}`;
});

const SEAL = { 1: "壹", 2: "贰", 3: "叁", 4: "肆", 5: "伍", 6: "陆", 7: "柒", 8: "捌", 9: "玖", 10: "拾" };
const sealChar = computed(() => (series.value?.single ? "通" : SEAL[Number(props.unit)] || String(props.unit)));

// split lessons into ranges of 10 for the segmented control (only when >12)
const ranges = computed(() => {
  const lessons = data.value?.lessons || [];
  if (lessons.length <= 12) return [{ label: "", items: lessons }];
  const out = [];
  for (let i = 0; i < lessons.length; i += 10) {
    const chunk = lessons.slice(i, i + 10);
    const a = chunk[0].num;
    const b = chunk[chunk.length - 1].num;
    out.push({ label: `${pad(a)}–${pad(b)}`, items: chunk });
  }
  return out;
});
const shownLessons = computed(() => ranges.value[activeRange.value]?.items || []);

// real per-lesson progress (known / total words) — badge only shows when studied
function prog(lesson) {
  const words = lesson.words || [];
  const total = words.length;
  if (!total) return { done: false, pct: 0 };
  const known = words.filter((w) => statusOf(w.id) === "known").length;
  return { done: known === total, pct: Math.round((known / total) * 100) };
}
function pad(n) {
  return String(n).padStart(2, "0");
}
const DIG = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
function numCn(n) {
  if (n <= 10) return n === 10 ? "十" : DIG[n];
  if (n < 20) return "十" + DIG[n - 10];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return DIG[t] + "十" + (o ? DIG[o] : "");
  }
  return String(n);
}
</script>

<style scoped>
.lswrap { max-width: 1180px; margin: 0 auto; padding: 0 32px 72px; position: relative; overflow: hidden; }
.lswrap > *:not(.page-wm):not(.corner-motif) { position: relative; z-index: 1; }
.page-wm { position: absolute; left: -40px; bottom: 30px; width: 40%; height: 68%; z-index: 0; background-size: contain; background-position: left bottom; background-repeat: no-repeat; opacity: .2; mix-blend-mode: multiply; pointer-events: none; -webkit-mask-image: linear-gradient(90deg, #000 45%, transparent); mask-image: linear-gradient(90deg, #000 45%, transparent); }
.corner-motif { position: absolute; right: -30px; top: 84px; width: 200px; height: 260px; z-index: 0; background-size: contain; background-position: right top; background-repeat: no-repeat; opacity: .3; mix-blend-mode: multiply; pointer-events: none; }
.foot-hills { height: 140px; margin: 30px -32px -20px; background-repeat: no-repeat; background-position: center bottom; background-size: cover; opacity: .5; mix-blend-mode: multiply; pointer-events: none; -webkit-mask-image: linear-gradient(180deg, transparent, #000 70%); mask-image: linear-gradient(180deg, transparent, #000 70%); }
.muted { color: var(--muted); font-weight: 600; padding: 40px 0 0; }

.crumb { display: flex; align-items: center; gap: 9px; font-size: 13px; color: var(--muted); padding: 20px 0 4px; font-family: var(--serif-cn); }
.crumb a { color: var(--muted); transition: .2s; border-bottom: 1px dotted transparent; }
.crumb a:hover { color: var(--cinnabar-dk); border-bottom-color: var(--cinnabar); }
.crumb .sep { color: var(--gold); font-size: 11px; }
.crumb .cur { color: var(--ink); font-weight: 600; }
.page-head { padding: 14px 0 8px; }
.page-head .back, .back { font-family: var(--caps); font-size: 12px; letter-spacing: 2px; color: var(--cinnabar-dk); display: inline-flex; gap: 6px; align-items: center; }
.page-head .back:hover, .back:hover { color: var(--cinnabar); }

/* 选课 hero —— 牌匾·留白 · 鎏金流光 */
.ls-hero { text-align: center; padding: 30px 24px 26px; margin: 10px 0 2px; border-radius: 14px; background-color: #f1e7d4; background-size: cover; background-position: center 42%; background-repeat: no-repeat; border: 1px solid var(--line); box-shadow: 0 10px 30px -18px rgba(45,30,10,.3); }
.ls-seal { width: 58px; height: 58px; margin: 0 auto 12px; border-radius: 9px; background: linear-gradient(145deg, var(--seal-a), var(--seal-b)); color: #fbe7d4; font-family: var(--serif-cn); font-weight: 900; font-size: 28px; display: grid; place-items: center; position: relative; box-shadow: inset 0 0 0 2px rgba(251,231,212,.5), 0 0 0 2px var(--gold), 0 4px 10px rgba(139,42,31,.35); }
.ls-seal::after { content: ""; position: absolute; inset: 6px; border: 1px solid rgba(251,231,212,.35); border-radius: 5px; }
.ls-hero .inscribe { position: relative; display: inline-block; margin: 6px 0 2px; font-family: var(--brush); font-weight: 400; font-size: 54px; line-height: 1.05; letter-spacing: 3px; color: var(--sumi); text-shadow: 0 1px 0 rgba(255,255,255,.4); }
.ls-hero .inscribe::after { content: ""; display: block; height: 2px; width: 58%; margin: 8px auto 0; background: linear-gradient(90deg, transparent, var(--ink-wash), transparent); opacity: .5; }
.ls-hero .sub { font-family: var(--serif-cn); font-size: 16px; color: var(--ink-soft, #4a3d2a); letter-spacing: 1px; margin-top: 14px; }
.ls-hero .sub .en { font-family: var(--serif-en); font-style: italic; color: var(--muted); font-size: 15px; }
.ls-hero .rule { display: flex; align-items: center; gap: 14px; color: var(--gold); max-width: 280px; margin: 16px auto 0; }
.ls-hero .rule::before, .ls-hero .rule::after { content: ""; height: 1px; flex: 1; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.ls-hero .diamond { font-size: 12px; letter-spacing: 6px; color: var(--gold); }

.seg { display: flex; width: fit-content; background: var(--paper-3); border: 1px solid var(--line); border-radius: 8px; padding: 4px; margin: 26px auto; gap: 4px; box-shadow: inset 0 1px 3px rgba(45,30,10,.06); flex-wrap: wrap; }
.seg button { font-family: var(--serif-cn); font-size: 14px; letter-spacing: 1px; padding: 8px 20px; border-radius: 6px; color: var(--ink-soft, #4a3d2a); transition: .2s; }
.seg button .en { display: block; font-family: var(--caps); font-size: 9px; letter-spacing: 1.5px; color: var(--muted); }
.seg button.active { background: linear-gradient(145deg, var(--seal-a), var(--seal-b)); color: #fbeecf; box-shadow: 0 2px 5px -1px rgba(139,42,31,.4); }
.seg button.active .en { color: rgba(251,238,207,.85); }

.lessons { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 18px; margin-top: 26px; padding: 20px; border-radius: 14px; border: 1px solid var(--line-soft); box-shadow: inset 0 1px 0 rgba(255,255,255,.4); }
.lcard {
  position: relative; background: linear-gradient(160deg, #fbf6ec, #f3ead9); border: 1px solid var(--line);
  border-radius: 10px; padding: 20px 22px 20px 60px; transition: .24s; overflow: hidden;
  box-shadow: 0 3px 10px -6px var(--shadow, rgba(45,30,10,.14)); display: block;
}
.lcard::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: linear-gradient(180deg, var(--cinnabar), var(--cinnabar-dk)); z-index: 1; }
.lcard::after { content: ""; position: absolute; inset: 7px 7px 7px 50px; border: 1px solid var(--line-soft); border-radius: 6px; pointer-events: none; }
.lcard:hover { transform: translateY(-4px); border-color: var(--cinnabar); box-shadow: 0 14px 26px -12px rgba(139,42,31,.28); }
.lcard .lc-art { position: absolute; right: 6px; bottom: 6px; width: 128px; height: 108px; z-index: 0; background-repeat: no-repeat; background-position: right bottom; background-size: contain; opacity: .12; mix-blend-mode: multiply; pointer-events: none; -webkit-mask-image: radial-gradient(130% 130% at 100% 100%, #000 30%, transparent 74%); mask-image: radial-gradient(130% 130% at 100% 100%, #000 30%, transparent 74%); transition: opacity .24s; }
.lcard:hover .lc-art { opacity: .2; }
.lcard .lesson-tag, .lcard .cn-title, .lcard .en { position: relative; z-index: 1; }
.lcard .no { position: absolute; left: 14px; top: 18px; font-family: var(--caps); font-size: 11px; letter-spacing: 1px; color: var(--gold-deep); writing-mode: vertical-rl; text-orientation: mixed; }
.lcard .lesson-tag { font-family: var(--caps); font-size: 10.5px; letter-spacing: 2px; color: var(--gold-deep); text-transform: uppercase; }
.lcard .cn-title { font-family: var(--serif-cn); font-weight: 700; font-size: 21px; letter-spacing: 1px; margin: 3px 0 2px; color: var(--ink); }
.lcard .en { font-size: 13px; color: var(--muted); margin-top: 1px; }
.lcard .go { position: absolute; right: 18px; bottom: 16px; font-size: 20px; color: var(--gold-deep); transition: .24s; }
.lcard:hover .go { transform: translateX(4px); color: var(--cinnabar); }
.ptag { position: absolute; top: 16px; right: 16px; font-size: 10px; letter-spacing: 1px; padding: 2px 7px; border-radius: 3px; font-family: var(--han); }
.ptag.done { background: var(--jade); color: #f4fbf6; }
.ptag.learning { background: var(--gold-deep); color: #fff8ea; }
</style>
