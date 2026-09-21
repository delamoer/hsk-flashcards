<template>
  <div class="bookswrap" v-if="series">
    <div class="crumb">
      <router-link to="/">课程总览 Library</router-link><span class="sep">◇</span>
      <span class="cur">{{ series.heroTitle }}</span>
    </div>

    <div class="hero series-hero" :style="{ '--sc': series.seriesColor }">
      <router-link class="back-fn" to="/">‹ 课程总览 Library</router-link>
      <div class="fseal-lg">{{ series.seal.cn }}<small>{{ series.seal.en }}</small></div>
      <div class="kicker">{{ series.kicker }}</div>
      <h1>{{ series.heroTitle }}<span class="fbadge" v-html="series.badgeHtml || ''"></span></h1>
      <div class="cn-sub">{{ series.heroSub }}</div>
      <div class="en-sub">{{ series.heroEn }}</div>
      <div class="rule"><span class="diamond">◇ ◇ ◇</span></div>
    </div>

    <div class="group">
      <div class="shelf">
        <router-link
          v-for="b in books"
          :key="b.id"
          class="book"
          :class="series.colorClass"
          :to="`/course/${series.id}/${b.id}`"
        >
          <span class="stitch"><i></i><i></i><i></i><i></i></span>
          <span class="frame"></span>
          <span class="label">{{ b.label }}</span>
          <span class="top">{{ b.top }}</span>
          <span class="lvl" :class="{ wordy: b.wordy }"><small v-if="b.lvlSmall">{{ b.lvlSmall }}</small>{{ b.lvl }}<small v-if="b.lvlEx" class="ex">{{ b.lvlEx }}</small></span>
          <span class="series">{{ b.seriesCn }}</span>
          <span class="series-en">{{ b.seriesEn }}</span>
          <div class="prog" v-if="b.percent > 0">
            <div class="bar"><i :style="{ width: b.percent + '%' }"></i></div>
            <div class="txt">已学 {{ b.percent }}%</div>
          </div>
          <span class="enter">开卷 →</span>
        </router-link>
      </div>
    </div>
  </div>
  <div class="bookswrap" v-else><p class="muted">课程不存在 · Course not found.</p></div>
</template>

<script setup>
import { computed } from "vue";
import { getSeries } from "@/data/courses.js";
import { courseRegistry } from "@/data";
import { useProgress } from "@/composables/useProgress";

const props = defineProps({
  series: { type: String, required: true },
});

const { percentKnownByPrefix } = useProgress();

const series = computed(() => getSeries(props.series));
// unit metadata (idPrefix, wordCount) lives in courseRegistry (from meta.json)
const reg = computed(() => courseRegistry.find((c) => c.id === props.series) || null);

// per-series book-cover presentation (chrome strings only)
const BOOK_META = {
  hsk: { top: "HSK", abbr: "Lv", cn: "标准课程", en: "Standard Course" },
  newhsk3: { top: "NEW HSK 3.0", abbr: "新", cn: "新标准", en: "New Standards" },
  huihua360: { top: "CONVERSATION 360", abbr: "卷", cn: "会话三六〇", en: "Conversation 360" },
  survival: { top: "SURVIVAL CHINESE", abbr: "通", cn: "一本通 · 36 课", en: "All-in-one · 36 lessons" },
};

const books = computed(() => {
  const s = series.value;
  const r = reg.value;
  if (!s || !r) return [];
  const m = BOOK_META[s.id] || { top: s.nameEn, abbr: "", cn: s.name, en: s.nameEn };
  return r.units.map((u) => {
    const metaUnit = r.units.find((x) => x.id === u.id) || u;
    const percent = metaUnit.idPrefix ? percentKnownByPrefix(metaUnit.idPrefix, metaUnit.wordCount) : 0;
    if (s.single) {
      return { id: u.id, label: "通", top: m.top, lvl: "生存", lvlEx: "汉语", wordy: true, lvlSmall: null, seriesCn: m.cn, seriesEn: m.en, percent };
    }
    return {
      id: u.id,
      label: `${m.abbr}.${u.id}`,
      top: m.top,
      lvlSmall: s.levelWord,
      lvl: String(u.id),
      seriesCn: m.cn,
      seriesEn: m.en,
      percent,
    };
  });
});
</script>

<style scoped>
.bookswrap { max-width: 1180px; margin: 0 auto; padding: 0 32px 72px; }
.muted { color: var(--muted); font-weight: 600; padding: 40px 0; }

.crumb { display: flex; align-items: center; gap: 9px; font-size: 13px; color: var(--muted); padding: 20px 0 4px; font-family: var(--serif-cn); }
.crumb a { color: var(--muted); transition: .2s; border-bottom: 1px dotted transparent; }
.crumb a:hover { color: var(--cinnabar-dk); border-bottom-color: var(--cinnabar); }
.crumb .sep { color: var(--gold); font-size: 11px; }
.crumb .cur { color: var(--ink); font-weight: 600; }

/* series 门面 hero */
.hero { text-align: center; padding: 56px 0 30px; position: relative; }
.hero.series-hero {
  padding: 44px 0 26px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--sc, #c0392b) 8%, var(--paper)), transparent);
  border-radius: 0 0 14px 14px;
}
.back-fn { position: absolute; left: 0; top: 6px; font-family: var(--caps); font-size: 12px; letter-spacing: 2px; color: var(--sc, var(--cinnabar-dk)); display: inline-flex; gap: 6px; align-items: center; }
.back-fn:hover { filter: brightness(.9); }
.fseal-lg {
  width: 72px; height: 72px; margin: 0 auto 14px; border-radius: 10px;
  background: var(--sc, #c0392b); color: #fff8ec; font-family: var(--serif-cn); font-weight: 900; font-size: 30px; line-height: 1.05;
  display: grid; place-items: center; text-align: center; position: relative;
  box-shadow: inset 0 0 0 2px rgba(255,248,236,.5), 0 4px 10px rgba(0,0,0,.24);
}
.fseal-lg::after { content: ""; position: absolute; inset: 7px; border: 1px solid rgba(255,248,236,.4); border-radius: 5px; }
.fseal-lg small { display: block; font-size: 13px; font-weight: 600; }
.kicker { font-family: var(--caps); font-size: 12px; letter-spacing: 5px; color: var(--sc, var(--gold-deep)); text-transform: uppercase; }
.hero.series-hero h1 {
  font-family: var(--serif-cn); font-weight: 900; font-size: 56px; line-height: 1; letter-spacing: 5px;
  margin: 10px 0 6px; color: var(--ink);
  text-shadow: 1px 1px 0 color-mix(in srgb, var(--sc, #c8962a) 45%, var(--gold-lt));
}
.cn-sub { font-family: var(--serif-cn); font-size: 19px; letter-spacing: 3px; color: var(--ink-soft, #4a3d2a); margin-bottom: 4px; }
.en-sub { font-family: var(--serif-en); font-style: italic; font-size: 16px; letter-spacing: 1.5px; color: var(--ink-soft, #4a3d2a); }
.rule { display: flex; align-items: center; gap: 14px; max-width: 280px; margin: 22px auto 0; }
.rule::before, .rule::after { content: ""; height: 1px; flex: 1; background: linear-gradient(90deg, transparent, var(--sc, var(--gold)), transparent); }
.diamond { font-size: 12px; letter-spacing: 6px; color: var(--sc, var(--gold)); }
.fbadge { display: inline-flex; gap: 6px; vertical-align: middle; margin-left: 8px; }
.fbadge :deep(.tag-new) { background: var(--cinnabar); color: #fbe7d4; font-family: var(--caps); font-size: 11px; letter-spacing: 1.5px; padding: 2px 7px; border-radius: 3px; font-weight: 600; }
.fbadge :deep(.tag-30) { background: var(--gold-deep); color: #fff8ea; font-family: var(--caps); font-size: 11px; letter-spacing: 1px; padding: 2px 7px; border-radius: 3px; font-weight: 600; }

/* 书架 + 书封 */
.group { margin-top: 52px; }
.shelf { display: grid; grid-template-columns: repeat(auto-fill, minmax(174px, 1fr)); gap: 22px 20px; position: relative; }
.shelf::after {
  content: ""; position: absolute; left: -8px; right: -8px; bottom: -14px; height: 9px;
  background: linear-gradient(180deg, #d8c39a, #c2a877); border-radius: 2px;
  box-shadow: 0 6px 12px -6px var(--shadow, rgba(45,30,10,.14)), inset 0 1px 0 rgba(255,255,255,.4);
}
.book {
  position: relative; cursor: pointer; border-radius: 4px 8px 8px 4px;
  aspect-ratio: 3 / 4.15; padding: 20px 18px 18px 26px; color: #fbeecf; overflow: hidden;
  box-shadow: 0 8px 20px -10px rgba(45,30,10,.5), inset 0 0 0 1px rgba(255,255,255,.12);
  transition: transform .28s cubic-bezier(.2,.7,.3,1), box-shadow .28s; display: flex; flex-direction: column;
}
.book:hover { transform: translateY(-8px) rotate(-.6deg); box-shadow: 0 20px 34px -14px rgba(45,30,10,.55); }
.book::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 14px; background: linear-gradient(90deg, rgba(0,0,0,.32), rgba(0,0,0,.05) 60%, rgba(255,255,255,.14)); }
.book .stitch { position: absolute; left: 6px; top: 24px; bottom: 24px; width: 2px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; z-index: 2; }
.book .stitch i { width: 4px; height: 4px; border-radius: 50%; background: rgba(251,238,207,.5); box-shadow: 0 0 0 1px rgba(0,0,0,.25); }
.book .frame { position: absolute; inset: 9px 9px 9px 18px; border: 1px solid rgba(251,238,207,.28); border-radius: 3px; pointer-events: none; }
.book .frame::after { content: ""; position: absolute; inset: 3px; border: 1px solid rgba(251,238,207,.14); border-radius: 2px; }
.book .top { font-family: var(--caps); font-size: 11px; letter-spacing: 3px; opacity: .9; position: relative; z-index: 2; }
.book .lvl { font-family: var(--serif-cn); font-weight: 900; font-size: 60px; line-height: .95; margin: auto 0 2px; position: relative; z-index: 2; text-shadow: 0 2px 4px rgba(0,0,0,.25); }
.book .lvl.wordy { font-size: 40px; }
.book .lvl small { font-size: 22px; font-weight: 600; letter-spacing: 1px; display: block; margin-bottom: -4px; }
.book .lvl small.ex { font-size: 16px; display: block; margin-bottom: 0; }
.book .series { font-family: var(--serif-cn); font-weight: 600; font-size: 16px; letter-spacing: 2px; position: relative; z-index: 2; }
.book .series-en { font-family: var(--serif-en); font-style: italic; font-size: 12.5px; opacity: .88; position: relative; z-index: 2; margin-top: 1px; }
.book .label { position: absolute; top: 14px; right: 12px; z-index: 3; background: var(--cinnabar); color: #fbeecf; font-family: var(--serif-cn); font-weight: 700; font-size: 13px; padding: 3px 9px; border-radius: 2px; box-shadow: 0 2px 4px rgba(0,0,0,.3); letter-spacing: 1px; }
.book .prog { margin-top: 9px; position: relative; z-index: 2; }
.book .prog .bar { height: 4px; background: rgba(0,0,0,.22); border-radius: 99px; overflow: hidden; }
.book .prog .bar i { display: block; height: 100%; background: rgba(251,238,207,.85); border-radius: 99px; }
.book .prog .txt { font-size: 10.5px; opacity: .85; margin-top: 3px; letter-spacing: .5px; font-family: var(--han); }
.book.c-coral { background: linear-gradient(150deg, #c15a48, #9c3f30); }
.book.c-violet { background: linear-gradient(150deg, #7a5798, #4f3670); }
.book.c-jade { background: linear-gradient(150deg, #357a5c, #204d3a); }
.book.c-amber { background: linear-gradient(150deg, #c08a34, #8a6120); }
.book .enter { position: absolute; bottom: 12px; right: 14px; z-index: 3; opacity: 0; transform: translateX(-4px); transition: .25s; font-family: var(--caps); font-size: 11px; letter-spacing: 2px; }
.book:hover .enter { opacity: .95; transform: none; }
</style>
