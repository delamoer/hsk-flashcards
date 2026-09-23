<template>
  <div class="bookswrap" v-if="series">
    <div class="page-wm" :style="wmBg" aria-hidden="true"></div>
    <div class="corner-motif" :style="{ backgroundImage: `url(${motifPine})` }" aria-hidden="true"></div>
    <div class="crumb">
      <router-link to="/">课程总览 Library</router-link><span class="sep">◇</span>
      <span class="cur">{{ series.heroTitle }}</span>
    </div>

    <div class="hero series-hero" :style="{ '--sc': series.seriesColor, backgroundImage: bandBg }">
      <div class="fseal-lg">{{ series.seal.cn }}<small>{{ series.seal.en }}</small></div>
      <div class="kicker">{{ series.kicker }}</div>
      <h1 class="inscribe">{{ series.heroTitle }}</h1>
      <div class="fbadge" v-if="series.badgeHtml" v-html="series.badgeHtml"></div>
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
          :style="{ backgroundImage: coverBg, backgroundPositionY: b.coverPos }"
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

    <div class="foot-hills" :style="{ backgroundImage: `url(${motifMountainFar})` }" aria-hidden="true"></div>
  </div>
  <div class="bookswrap" v-else><p class="muted">课程不存在 · Course not found.</p></div>
</template>

<script setup>
import { computed } from "vue";
import { getSeries } from "@/data/courses.js";
import { courseRegistry } from "@/data";
import { useProgress } from "@/composables/useProgress";
import { seriesBand, bookCover, watermark, motifPine, motifMountainFar } from "@/assets/img.js";

const props = defineProps({
  series: { type: String, required: true },
});

const { percentKnownByPrefix } = useProgress();

const series = computed(() => getSeries(props.series));
// 真实山水横幅 + 纸色 scrim（保证牌匾/文字可读）
const bandBg = computed(() => {
  const img = seriesBand[props.series];
  return img
    ? `linear-gradient(180deg, rgba(250,244,233,.72), rgba(241,231,212,.9)), url(${img})`
    : "none";
});

// 书封：真实水墨封皮 + 系列色罩（保证级号/文字可读）
function hexA(hex, a) {
  const h = (hex || "#8b2a1f").replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
const WM = { hsk: watermark.books, newhsk3: watermark.words, huihua360: watermark.pinyin, survival: watermark.books };
const wmBg = computed(() => ({ backgroundImage: `url(${WM[props.series] || watermark.books})` }));
const coverBg = computed(() => {
  const img = bookCover[props.series];
  const c = series.value?.seriesColor || "#8b2a1f";
  // 上部留白让水墨透出，底部渐深压住级号/文字
  const tint = `linear-gradient(180deg, ${hexA(c, 0.08)} 0%, ${hexA(c, 0.24)} 40%, ${hexA(c, 0.7)} 74%, ${hexA(c, 0.9)} 100%)`;
  return img ? `${tint}, url(${img})` : tint;
});
// unit metadata (idPrefix, wordCount) lives in courseRegistry (from meta.json)
const reg = computed(() => courseRegistry.find((c) => c.id === props.series) || null);

// per-series book-cover presentation (chrome strings only)
const BOOK_META = {
  hsk: { top: "HSK", abbr: "Lv", cn: "标准课程", en: "Standard Course" },
  newhsk3: { top: "NEW HSK 3.0", abbr: "新", cn: "新标准", en: "New Standards" },
  huihua360: { top: "CONVERSATION 360", abbr: "卷", cn: "会话三六〇", en: "Conversation 360" },
  survival: { top: "SURVIVAL CHINESE", abbr: "生", cn: "生存汉语", en: "Survival Chinese" },
};

const books = computed(() => {
  const s = series.value;
  const r = reg.value;
  if (!s || !r) return [];
  const m = BOOK_META[s.id] || { top: s.nameEn, abbr: "", cn: s.name, en: s.nameEn };
  return r.units.map((u, i) => {
    const metaUnit = r.units.find((x) => x.id === u.id) || u;
    const percent = metaUnit.idPrefix ? percentKnownByPrefix(metaUnit.idPrefix, metaUnit.wordCount) : 0;
    // 每册错开背景取景，避免同系列书封雷同
    const coverPos = `${18 + ((i * 21) % 64)}%`;
    if (s.single) {
      return { id: u.id, label: "通", top: m.top, lvl: "生存", lvlEx: "汉语", wordy: true, lvlSmall: null, seriesCn: m.cn, seriesEn: m.en, percent, coverPos };
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
      coverPos,
    };
  });
});
</script>

<style scoped>
.bookswrap { max-width: 1180px; margin: 0 auto; padding: 0 32px 72px; position: relative; overflow: hidden; }
.bookswrap > *:not(.page-wm):not(.corner-motif) { position: relative; z-index: 1; }
.page-wm { position: absolute; right: -40px; bottom: 20px; width: 42%; height: 74%; z-index: 0; background-size: contain; background-position: right bottom; background-repeat: no-repeat; opacity: .16; mix-blend-mode: multiply; pointer-events: none; -webkit-mask-image: linear-gradient(90deg, transparent, #000 55%); mask-image: linear-gradient(90deg, transparent, #000 55%); }
.corner-motif { position: absolute; left: -46px; top: 92px; width: 240px; height: 300px; z-index: 0; background-size: contain; background-position: left top; background-repeat: no-repeat; opacity: .3; mix-blend-mode: multiply; pointer-events: none; }
.foot-hills { height: 140px; margin: 34px -32px -20px; background-repeat: no-repeat; background-position: center bottom; background-size: cover; opacity: .5; mix-blend-mode: multiply; pointer-events: none; -webkit-mask-image: linear-gradient(180deg, transparent, #000 70%); mask-image: linear-gradient(180deg, transparent, #000 70%); position: relative; z-index: 0; }
.muted { color: var(--muted); font-weight: 600; padding: 40px 0; }

.crumb { display: flex; align-items: center; gap: 9px; font-size: 13px; color: var(--muted); padding: 20px 0 4px; font-family: var(--serif-cn); }
.crumb a { color: var(--muted); transition: .2s; border-bottom: 1px dotted transparent; }
.crumb a:hover { color: var(--cinnabar-dk); border-bottom-color: var(--cinnabar); }
.crumb .sep { color: var(--gold); font-size: 11px; }
.crumb .cur { color: var(--ink); font-weight: 600; }

/* series 门面 hero —— 牌匾·留白 · 鎏金流光 (per-series tinted plaque on parchment) */
.hero { text-align: center; padding: 56px 0 30px; position: relative; }
.hero.series-hero {
  padding: 42px 24px 30px; margin: 6px 0 4px; position: relative; overflow: hidden;
  border-radius: 14px;
  background-color: #f1e7d4;
  background-size: cover; background-position: center 42%; background-repeat: no-repeat;
  border: 1px solid var(--line);
  box-shadow: 0 10px 30px -18px rgba(45,30,10,.3);
}
.fseal-lg {
  width: 60px; height: 60px; margin: 2px auto 14px; border-radius: 9px;
  background: linear-gradient(145deg, color-mix(in srgb, var(--sc, #c0392b) 88%, #fff), color-mix(in srgb, var(--sc, #c0392b) 68%, #000));
  color: #fff8ec; font-family: var(--serif-cn); font-weight: 900; font-size: 26px; line-height: 1.05;
  display: grid; place-items: center; text-align: center; position: relative;
  box-shadow: inset 0 0 0 2px rgba(255,248,236,.5), 0 0 0 2px var(--gold), 0 4px 10px rgba(0,0,0,.3);
}
.fseal-lg::after { content: ""; position: absolute; inset: 6px; border: 1px solid rgba(255,248,236,.4); border-radius: 5px; }
.fseal-lg small { display: block; font-size: 12px; font-weight: 600; }
.kicker { font-family: var(--caps); font-size: 12px; letter-spacing: 5px; color: var(--gold-deep); text-transform: uppercase; }

/* 水墨题字 (series title) —— 毛笔行楷，墨色，配朱印下方 */
.hero.series-hero .inscribe {
  position: relative; display: inline-block; margin: 8px 0 2px;
  font-family: var(--brush); font-weight: 400;
  font-size: 62px; line-height: 1.05; letter-spacing: 4px;
  color: var(--sumi); text-shadow: 0 1px 0 rgba(255,255,255,.4);
}
.hero.series-hero .inscribe::after {
  content: ""; display: block; height: 2px; width: 62%; margin: 8px auto 0;
  background: linear-gradient(90deg, transparent, var(--ink-wash), transparent); opacity: .5;
}

.cn-sub { font-family: var(--serif-cn); font-size: 19px; letter-spacing: 3px; color: var(--ink-soft, #4a3d2a); margin-top: 16px; margin-bottom: 4px; }
.en-sub { font-family: var(--serif-en); font-style: italic; font-size: 16px; letter-spacing: 1.5px; color: var(--muted); }
.rule { display: flex; align-items: center; gap: 14px; max-width: 280px; margin: 20px auto 0; }
.rule::before, .rule::after { content: ""; height: 1px; flex: 1; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.diamond { font-size: 12px; letter-spacing: 6px; color: var(--gold); }
.fbadge { display: flex; gap: 6px; justify-content: center; margin-top: 12px; }
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
  background-color: #4a3d2a; background-size: cover; background-position: center 40%;
  box-shadow: 0 8px 20px -10px rgba(45,30,10,.5), inset 0 0 0 1px rgba(255,255,255,.12);
  transition: transform .28s cubic-bezier(.2,.7,.3,1), box-shadow .28s; display: flex; flex-direction: column;
}
.book:hover { transform: translateY(-8px) rotate(-.6deg); box-shadow: 0 20px 34px -14px rgba(45,30,10,.55); }
.book::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 14px; background: linear-gradient(90deg, rgba(0,0,0,.32), rgba(0,0,0,.05) 60%, rgba(255,255,255,.14)); }
.book .stitch { position: absolute; left: 6px; top: 24px; bottom: 24px; width: 2px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; z-index: 2; }
.book .stitch i { width: 4px; height: 4px; border-radius: 50%; background: rgba(251,238,207,.5); box-shadow: 0 0 0 1px rgba(0,0,0,.25); }
.book .frame { position: absolute; inset: 9px 9px 9px 18px; border: 1px solid rgba(251,238,207,.28); border-radius: 3px; pointer-events: none; }
.book .frame::after { content: ""; position: absolute; inset: 3px; border: 1px solid rgba(251,238,207,.14); border-radius: 2px; }
.book .top { font-family: var(--caps); font-size: 11px; letter-spacing: 3px; opacity: .95; position: relative; z-index: 2; text-shadow: 0 1px 3px rgba(0,0,0,.55); }
.book .lvl { font-family: var(--serif-cn); font-weight: 900; font-size: 60px; line-height: .95; margin: auto 0 2px; position: relative; z-index: 2; text-shadow: 0 2px 8px rgba(0,0,0,.5); }
.book .lvl.wordy { font-size: 40px; }
.book .lvl small { font-size: 22px; font-weight: 600; letter-spacing: 1px; display: block; margin-bottom: -4px; }
.book .lvl small.ex { font-size: 16px; display: block; margin-bottom: 0; }
.book .series { font-family: var(--serif-cn); font-weight: 600; font-size: 16px; letter-spacing: 2px; position: relative; z-index: 2; text-shadow: 0 1px 4px rgba(0,0,0,.5); }
.book .series-en { font-family: var(--serif-en); font-style: italic; font-size: 12.5px; opacity: .9; position: relative; z-index: 2; margin-top: 1px; text-shadow: 0 1px 4px rgba(0,0,0,.5); }
.book .label { position: absolute; top: 14px; right: 12px; z-index: 3; background: var(--cinnabar); color: #fbeecf; font-family: var(--serif-cn); font-weight: 700; font-size: 13px; padding: 3px 9px; border-radius: 2px; box-shadow: 0 2px 4px rgba(0,0,0,.3); letter-spacing: 1px; }
.book .prog { margin-top: 9px; position: relative; z-index: 2; }
.book .prog .bar { height: 4px; background: rgba(0,0,0,.22); border-radius: 99px; overflow: hidden; }
.book .prog .bar i { display: block; height: 100%; background: rgba(251,238,207,.85); border-radius: 99px; }
.book .prog .txt { font-size: 10.5px; opacity: .85; margin-top: 3px; letter-spacing: .5px; font-family: var(--han); }
/* fallback tint colors (used only before the inline cover image paints) */
.book.c-coral { background-color: #8f2f24; }
.book.c-violet { background-color: #463060; }
.book.c-jade { background-color: #1b5245; }
.book.c-amber { background-color: #7d5216; }
/* 顶部/底部加深，级号与书脊更立体 */
.book::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(0,0,0,.16), transparent 26%, transparent 62%, rgba(0,0,0,.28)); }
.book .enter { position: absolute; bottom: 12px; right: 14px; z-index: 3; opacity: 0; transform: translateX(-4px); transition: .25s; font-family: var(--caps); font-size: 11px; letter-spacing: 2px; }
.book:hover .enter { opacity: .95; transform: none; }
</style>
