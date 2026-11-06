<template>
  <main class="poems" :class="[`v-${view}`, { flat, 'poems-ready': ready }]">
    <!-- 古诗词首页 ·「手卷 Handscroll」（定稿 A2，样稿 design-demos/poetry/A2-index.html）。
         桌面：一幅横向展开的长卷——天杆 | 引首（标题 + 从这里开始）| 七段朝代（段首题记 + 诗签群，段间隔水钤印）| 拖尾 | 卷尾轴；
         滚轮转横向、可拖动、两端翻屏按钮（悬停长卷才出现）、←/→ 键；顶部缩略图可点跳段。
         手机：自上而下的竖向长卷，每段先露 4–6 首 + 叠纸「展开此段」，顶部粘性朝代条。
         搜索 / 难度筛选时不再横卷，改平铺按朝代分组；主题 / 意象视图是同一批诗签换一种归卷方式。
         view / q / level / img / at（当前朝代段）都镜像到 query，刷新、返回能还原。 -->
    <div class="tools" ref="toolsRef">
      <div class="tools-row">
        <div class="tt"><b>古诗词</b><span>Classical Poetry</span></div>
        <div class="seg-btns">
          <button v-for="v in VIEWS" :key="v.k" :class="{ on: view === v.k }" @click="setView(v.k)">
            {{ v.zh }}<small>{{ v.en }}</small>
          </button>
        </div>
        <div class="lvls">
          <button v-for="l in LEVELS" :key="l.k" :class="{ on: level === l.k }" @click="level = l.k">
            {{ l.zh }}<small>{{ l.en }}</small>
          </button>
        </div>
        <label class="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input v-model="q" type="search" placeholder="搜索 诗名 · 作者 · 拼音 · English" autocomplete="off" />
        </label>
        <div class="count">显示 <b>{{ shownCount }}</b> / {{ poems.length }} 首</div>
      </div>
      <!-- 卷轴缩略图：七段按实际长度排开，可点跳段；当前段朱红 -->
      <div v-if="view === 'dynasty' && !flat" class="map">
        <div class="map-label" v-html="mapLabel"></div>
        <div class="map-track" ref="trackRef" @click="onTrack">
          <span
            v-for="p in mapParts" :key="p.key"
            :class="{ gap: p.i < 0, cur: p.i >= 0 && p.i === cur }"
            :style="{ width: p.pct + '%' }"
            :data-i="p.i"
            :role="p.i >= 0 ? 'button' : null"
            :title="p.title"
          >{{ p.label }}<small v-if="p.n">{{ p.n }}</small></span>
          <div class="map-win" :style="winStyle"></div>
        </div>
      </div>
    </div>

    <div v-if="!ready" class="loading">加载中… · Loading…</div>

    <template v-else>
      <!-- 手机：粘性朝代条 -->
      <nav v-if="view === 'dynasty' && !flat" class="dynstrip" ref="stripRef" aria-label="朝代 Dynasties">
        <button v-for="(d, i) in dynasties" :key="d.key" :class="{ on: i === cur }" @click="goSeg(i)">
          {{ d.key }}<small>{{ countOf(d.key) }}</small>
        </button>
      </nav>

      <div v-show="view === 'dynasty' && !flat" class="stage">
        <button class="pg prev" :class="{ off: atStart }" title="向前一屏 Previous (←)" aria-label="向前一屏 Previous" @click="page(-1)">
          ←<b>前一屏</b><small>Prev</small>
        </button>
        <div
          class="vp" ref="vpRef" :class="{ drag: dragging }"
          @wheel="onWheel" @pointerdown="onDown" @click.capture="onClickCapture" @dragstart.prevent @scroll.passive="updateMap"
        >
          <div class="roll" ref="rollRef">
            <div class="rod l"></div>

            <!-- 引首 -->
            <section class="paper yinshou" ref="ysRef">
              <h2 class="big" aria-hidden="true">古詩詞</h2>
              <div class="intro">
                <h1>古诗词<span>Classical Chinese Poetry</span></h1>
                <p class="lead">从《诗经》到清代，{{ poems.length }} 首中国古诗词——每首都有拼音、逐字释义和英文翻译。</p>
                <p class="lead-en">{{ poems.length }} poems from the Book of Songs to the Qing dynasty — each with pinyin, word-by-word glosses and an English translation.</p>
                <div class="hint"><span class="ar l">←</span> 拖动或滚动展开长卷 · <small>Drag or scroll to unroll</small> <span class="ar r">→</span></div>
              </div>
              <div class="start">
                <h3 class="start-h">从这里开始 <span>Start here</span></h3>
                <p class="start-sub">第一次读古诗？先从这四首短诗开始。<br />New to Chinese poems? Begin with these four short ones.</p>
                <div class="start-list">
                  <router-link v-for="p in startPoems" :key="p.id" class="qian" :to="{ name: 'poem', params: { slug: p.slug } }">
                    <b>{{ p.title }}</b><em>{{ p.author }}</em><span>{{ p.titleEn.replace(/\s*\(.*\)$/, "") }}</span>
                  </router-link>
                </div>
              </div>
              <span class="seal-sm">學<br />中文</span>
              <img class="motif" :src="motifPlum" alt="" />
            </section>

            <template v-for="(d, i) in dynasties" :key="d.key">
              <div class="geshui" aria-hidden="true">
                <span v-if="i === 0" class="seal o">卷</span>
                <span class="ba">{{ d.key }} · {{ d.years.replace(/（.*）/, "") }}</span>
                <span class="seal">{{ d.key[0] }}</span>
              </div>
              <section class="paper seg" :data-i="i">
                <div class="seg-bg">
                  <img v-for="(b, k) in BG[d.key] || []" :key="k" :src="b.src" alt="" :class="{ motif: b.motif }" :style="b.style" />
                </div>
                <header class="seg-head" :class="{ open: introOpen.has(d.key) }">
                  <div class="seg-name"><b :class="{ long: d.key.length > 2 }">{{ d.key }}</b><span class="num"><em>{{ countOf(d.key) }}</em> 首 poems</span></div>
                  <div class="seg-py">{{ d.py }}</div>
                  <div class="seg-en">{{ d.en }}</div>
                  <span class="seg-yr">{{ d.years }}</span>
                  <p class="seg-zh">{{ d.intro }}</p>
                  <p class="seg-enp">{{ d.introEn }}</p>
                  <button class="seg-more" type="button" @click="toggleIntro(d.key)">
                    {{ introOpen.has(d.key) ? "收起" : "读全文" }}<small>{{ introOpen.has(d.key) ? "Less" : "Read more" }}</small>
                  </button>
                </header>
                <div class="slips" :style="{ '--rows': rows }">
                  <PoemSlip
                    v-for="(p, k) in byDyn[d.key]" :key="p.id" :poem="p"
                    :class="{ fold: folded(d.key, p) }"
                    :style="k % (rows * 2) >= rows ? { top: '14px' } : null"
                  />
                  <!-- 手机：叠纸「展开此段」，列出其余诗名 -->
                  <button v-if="foldRest(d.key).length" class="more" type="button" @click="openSeg(d.key)">
                    <b>展开此段 · 还有 {{ foldRest(d.key).length }} 首<small>Show {{ foldRest(d.key).length }} more</small><i>⌄</i></b>
                    <span class="names">{{ foldRest(d.key).map((p) => p.title).join(" · ") }}</span>
                  </button>
                  <button v-else-if="openSegs.has(d.key)" class="less" type="button" @click="closeSeg(d.key, i)">
                    收起此段<small>Show fewer</small>
                  </button>
                </div>
              </section>
            </template>

            <div class="geshui" aria-hidden="true"><span class="seal o">跋</span></div>
            <section class="paper tuowei">
              <img class="cranes" :src="motifCranes" alt="" />
              <div class="end">卷終</div>
              <p>长卷至此展完：七个时代，{{ poems.length }} 首诗词。也可以换一种方式重新归卷——按主题，或按意象。</p>
              <p class="en">That’s the whole scroll: seven eras, {{ poems.length }} poems. Re-roll it by theme or by image using the switch at the top.</p>
              <img class="seals" :src="motifSeals" alt="" />
            </section>
            <div class="rolled"></div>
            <div class="rod r"></div>
          </div>
        </div>
        <button class="pg next" :class="{ off: atEnd }" title="向后一屏 Next (→)" aria-label="向后一屏 Next" @click="page(1)">
          →<b>后一屏</b><small>Next</small>
        </button>
      </div>

      <!-- 搜索 / 难度筛选：平铺按朝代分组 -->
      <div v-if="flat" class="alt">
        <div class="sheet">
          <div class="flat-bar">
            <span class="what">
              筛选
              <template v-if="q.trim()">「<b>{{ q.trim() }}</b>」</template>
              <template v-if="q.trim() && level"> · </template>
              <template v-if="level"><b>{{ level }}</b><small>{{ LV_EN[level] }}</small></template>
              — 共 <b>{{ shownCount }}</b> 首<small>{{ shownCount }} poems, grouped by era</small>
            </span>
            <button type="button" @click="clearFilters">× 清除，回到长卷<small>Clear &amp; back to the scroll</small></button>
          </div>
          <template v-for="g in flatGroups" :key="g.key">
            <section class="grp">
              <h3><span class="sl">{{ g.key[0] }}</span>{{ g.key }}<span>{{ g.en }}</span><small>{{ g.list.length }} 首</small></h3>
              <div class="wrap"><PoemSlip v-for="p in g.list" :key="p.id" :poem="p" /></div>
            </section>
          </template>
          <p v-if="!flatGroups.length" class="none">没有符合条件的诗。换个词试试？<br /><span>No poems match — try another word.</span></p>
        </div>
      </div>

      <!-- 主题 -->
      <div v-if="view === 'themes' && !flat" class="alt">
        <div class="sheet">
          <template v-for="t in themeGroups" :key="t.zh">
            <section class="grp">
              <h3>{{ t.zh }}<span>{{ t.en }}</span><small>{{ t.list.length }} 首</small></h3>
              <div class="wrap"><PoemSlip v-for="p in t.list" :key="p.id" :poem="p" /></div>
            </section>
          </template>
        </div>
      </div>

      <!-- 意象 -->
      <div v-if="view === 'imagery' && !flat" class="alt">
        <div class="sheet">
          <div class="imgs">
            <button
              v-for="x in imgChips" :key="x.zh" class="imgchip" :class="{ on: x.zh === curImg.zh }" @click="img = x.zh"
            >
              <b :class="{ w2: x.zh.length > 1 }">{{ x.zh }}</b><span>{{ x.en }}</span><em>{{ x.count }}</em>
            </button>
            <button class="imgmore" @click="allImgs = !allImgs">
              {{ allImgs ? "收起 Fewer" : `全部 ${imagery.length} 个意象 · Show all` }}
            </button>
          </div>
          <div class="imgdesc">
            <h3>{{ curImg.zh }} <small>{{ curImg.py }}</small><span>{{ curImg.en }}</span></h3>
            <p>{{ curImg.meaning }}</p>
            <p class="en">{{ curImg.meaningEn }}</p>
          </div>
          <section class="grp">
            <h3>写「{{ curImg.zh }}」的诗<span>Poems with this image</span><small>{{ imgPoems.length }} 首</small></h3>
            <div class="wrap"><PoemSlip v-for="p in imgPoems" :key="p.id" :poem="p" /></div>
          </section>
        </div>
      </div>
    </template>
  </main>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import PoemSlip from "@/components/PoemSlip.vue";
import { loadPoemsMeta } from "@/data/poems";
import {
  heroMain, seriesBand, motifPlum, motifCranes, motifSeals, motifMountainFar, motifBoat, motifPine,
} from "@/assets/img.js";

const route = useRoute();
const router = useRouter();

const VIEWS = [
  { k: "dynasty", zh: "朝代", en: "Dynasties" },
  { k: "themes", zh: "主题", en: "Themes" },
  { k: "imagery", zh: "意象", en: "Imagery" },
];
const LEVELS = [
  { k: "", zh: "全部", en: "All" },
  { k: "入门", zh: "入门", en: "Beginner" },
  { k: "进阶", zh: "进阶", en: "Intermediate" },
  { k: "挑战", zh: "挑战", en: "Advanced" },
];
const LV_EN = { 入门: "Beginner", 进阶: "Intermediate", 挑战: "Advanced" };
const RANK = { 入门: 0, 进阶: 1, 挑战: 2 };
const START = ["P001", "P022", "P024", "P081"]; // 从这里开始：静夜思 · 春晓 · 登鹳雀楼 · 天净沙·秋思

// 每段的水墨背景（站内真图，按画面选：先秦竹林/汉云气/魏晋竹林松崖/唐山水/宋梅月与鹤/元扁舟远山/明清松鹤）
const band = (src, right, two) => ({ src, style: { [right ? "right" : "left"]: 0, width: two ? "52%" : "100%", minWidth: "1100px" } });
const BG = {
  先秦: [band(seriesBand.huihua360)],
  汉: [band(seriesBand.kouyu)],
  魏晋南北朝: [band(seriesBand.newhsk3)],
  唐: [band(seriesBand.hsk, false, true), band(heroMain, true, true)],
  宋: [band(seriesBand.survival, false, true), band(seriesBand.zoubian, true, true)],
  元: [
    { src: motifMountainFar, motif: true, style: { left: "260px", top: "10px", width: "520px" } },
    { src: motifBoat, motif: true, style: { left: "380px", top: "150px", width: "220px" } },
  ],
  明清: [
    { src: motifPine, motif: true, style: { right: 0, top: 0, width: "360px" } },
    { src: motifCranes, motif: true, style: { left: "320px", top: "20px", width: "240px" } },
  ],
};

/* ---------- data ---------- */
const meta = ref(null);
const ready = ref(false);
const poems = computed(() => meta.value?.poems || []);
const dynasties = computed(() => meta.value?.dynasties || []);
const imagery = computed(() => [...(meta.value?.imagery || [])].sort((a, b) => b.count - a.count));

/* ---------- state (mirrored to the query) ---------- */
const view = ref(VIEWS.some((v) => v.k === route.query.view) ? String(route.query.view) : "dynasty");
const q = ref(String(route.query.q || ""));
const level = ref(LV_EN[route.query.level] ? String(route.query.level) : "");
const img = ref(String(route.query.img || ""));
const at = ref(String(route.query.at || ""));
const allImgs = ref(false);
const openSegs = reactive(new Set());
const introOpen = reactive(new Set());

const flat = computed(() => view.value === "dynasty" && !!(q.value.trim() || level.value));

let qTimer;
watch([view, q, level, img, at], () => {
  clearTimeout(qTimer);
  qTimer = setTimeout(() => {
    const query = {};
    if (view.value !== "dynasty") query.view = view.value;
    if (q.value.trim()) query.q = q.value.trim();
    if (level.value) query.level = level.value;
    if (view.value === "imagery" && img.value) query.img = img.value;
    if (view.value === "dynasty" && !flat.value && at.value) query.at = at.value;
    router.replace({ query });
  }, 300);
});

/* ---------- search ---------- */
const fold = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const hay = new Map(); // poem id → folded search text
function match(p) {
  if (level.value && p.level !== level.value) return false;
  const term = fold(q.value).trim();
  if (!term) return true;
  if (!hay.has(p.id)) {
    hay.set(p.id, fold([p.title, p.titlePy, p.titleEn, p.author, p.authorEn, p.first, p.form, ...p.themes, ...p.images].join(" | ")));
  }
  const f = hay.get(p.id);
  return f.includes(term) || f.replace(/\s+/g, "").includes(term.replace(/\s+/g, ""));
}

const byDyn = computed(() => {
  const m = {};
  dynasties.value.forEach((d) => (m[d.key] = poems.value.filter((p) => p.dynasty === d.key)));
  return m;
});
const countOf = (k) => byDyn.value[k]?.length || 0;
const startPoems = computed(() => START.map((id) => poems.value.find((p) => p.id === id)).filter(Boolean));

const flatGroups = computed(() =>
  dynasties.value.map((d) => ({ key: d.key, en: d.en, list: byDyn.value[d.key].filter(match) })).filter((g) => g.list.length)
);
const themeGroups = computed(() =>
  (meta.value?.themes || []).map((t) => ({ ...t, list: poems.value.filter((p) => p.themes.includes(t.zh) && match(p)) })).filter((t) => t.list.length)
);
const curImg = computed(() => imagery.value.find((x) => x.zh === img.value) || imagery.value[0] || {});
const imgChips = computed(() => imagery.value.filter((x) => allImgs.value || x.count >= 3 || x.zh === curImg.value.zh));
const imgPoems = computed(() => poems.value.filter((p) => p.images.includes(curImg.value.zh) && match(p)));

const shownCount = computed(() => {
  if (view.value === "imagery" && !flat.value) return imgPoems.value.length;
  if (view.value === "themes" && !flat.value) return new Set(themeGroups.value.flatMap((t) => t.list.map((p) => p.id))).size;
  return poems.value.filter(match).length;
});

function setView(v) {
  view.value = v;
  window.scrollTo(0, 0);
}
function clearFilters() {
  q.value = "";
  level.value = "";
  window.scrollTo(0, 0);
}

/* ---------- mobile: 每段先露几首（唐/宋 6 首，其余 4 首；入门优先），其余收进叠纸 ---------- */
const isMobile = ref(false);
const pickCache = computed(() => {
  const m = {};
  for (const [k, list] of Object.entries(byDyn.value)) {
    const lim = list.length <= 5 ? list.length : k === "唐" || k === "宋" ? 6 : 4;
    m[k] = new Set([...list].sort((a, b) => RANK[a.level] - RANK[b.level]).slice(0, lim).map((p) => p.id));
  }
  return m;
});
// 收起的诗签仍渲染在 DOM 里（CSS 只在手机上隐藏），预渲染副本和桌面都看得到全部
const folded = (k, p) => !openSegs.has(k) && !pickCache.value[k]?.has(p.id);
const foldRest = (k) => (openSegs.has(k) ? [] : (byDyn.value[k] || []).filter((p) => folded(k, p)));
function openSeg(k) {
  openSegs.add(k);
  nextTick(buildMap);
}
function closeSeg(k, i) {
  openSegs.delete(k);
  nextTick(() => {
    const s = segs()[i];
    if (s) window.scrollTo({ top: s.getBoundingClientRect().top + scrollY - topOffset() - 4 });
    buildMap();
  });
}
function toggleIntro(k) {
  introOpen.has(k) ? introOpen.delete(k) : introOpen.add(k);
}

/* ---------- the scroll: wheel → horizontal, drag to unroll, page buttons, ←/→ ---------- */
const vpRef = ref(null), rollRef = ref(null), ysRef = ref(null), trackRef = ref(null), stripRef = ref(null), toolsRef = ref(null);
const rows = ref(3);
const atStart = ref(true), atEnd = ref(false);
const dragging = ref(false);
const segs = () => [...(rollRef.value?.querySelectorAll(".seg") || [])];

function onWheel(e) {
  const vp = vpRef.value;
  if (isMobile.value || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  const start = vp.scrollLeft <= 0, end = vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 1;
  if ((e.deltaY < 0 && start) || (e.deltaY > 0 && end)) return; // at an end: let the page scroll
  e.preventDefault();
  vp.scrollLeft += e.deltaY * (e.deltaMode === 1 ? 40 : 1);
}
let drag = null, moved = false;
function onDown(e) {
  if (isMobile.value || e.button !== 0 || e.pointerType === "touch") return;
  drag = { x: e.clientX, s: vpRef.value.scrollLeft };
  moved = false;
}
function onMove(e) {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  if (Math.abs(dx) > 5) { moved = true; dragging.value = true; }
  if (moved) vpRef.value.scrollLeft = drag.s - dx;
}
function onUp() {
  drag = null;
  dragging.value = false;
}
function onClickCapture(e) {
  if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
}
function page(dir) {
  const vp = vpRef.value;
  vp.scrollBy({ left: dir * Math.round(vp.clientWidth * 0.85), behavior: "smooth" });
}
function onKey(e) {
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  if (e.altKey || e.ctrlKey || e.metaKey || isMobile.value || view.value !== "dynasty" || flat.value || !vpRef.value) return;
  if (e.target.closest?.("input,textarea,select,[contenteditable]")) return;
  e.preventDefault();
  page(e.key === "ArrowLeft" ? -1 : 1);
}
// 一列能放几张签：按长卷实际高度算（矮屏 2 行），奇数列错落 14px
function fitRows() {
  const vp = vpRef.value;
  if (!vp || isMobile.value) return;
  const avail = vp.clientHeight - 22 - 20 - 36 - 4; // vp padding · paper borders · seg padding · slips padding
  // n 行 = n×200 + (n−1)×14 行距 + 14 错落（错落用 top 偏移，不撑高网格行）
  rows.value = Math.max(1, Math.min(3, Math.floor(avail / (200 + 14))));
}

/* ---------- mini-map + current era ---------- */
const mapParts = ref([]);
const winStyle = ref({});
const cur = ref(-1);
const topOffset = () => (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--appbar-h")) || 60) + (stripRef.value?.offsetHeight || 0);

function buildMap() {
  if (!rollRef.value || !ysRef.value) return;
  const mob = isMobile.value;
  const size = (el) => (mob ? el.offsetHeight : el.offsetWidth);
  const parts = [{ key: "ys", label: "", size: size(ysRef.value), i: -1, title: "引首 Frontispiece" }].concat(
    segs().map((s, i) => {
      const d = dynasties.value[i];
      return { key: d.key, label: d.key === "魏晋南北朝" ? "魏晋" : d.key, n: countOf(d.key), size: size(s), i, title: `跳到 ${d.key} · ${d.en}` };
    })
  );
  const sum = parts.reduce((a, b) => a + b.size, 0) || 1;
  // 魏晋南北朝 地方够就写全
  const tw = trackRef.value?.clientWidth || 0;
  parts.forEach((p) => {
    p.pct = (p.size / sum) * 100;
    if (p.key === "魏晋南北朝" && (p.pct / 100) * tw > 150) p.label = "魏晋南北朝";
  });
  mapParts.value = parts;
  updateMap();
}
let atTimer;
function updateMap() {
  const vp = vpRef.value, roll = rollRef.value;
  if (!vp || !roll) return;
  const mob = isMobile.value;
  let pos, viewLen, total;
  if (mob) {
    const r = roll.getBoundingClientRect();
    total = roll.offsetHeight; pos = Math.max(0, -r.top + topOffset()); viewLen = innerHeight;
  } else {
    total = roll.scrollWidth; pos = vp.scrollLeft; viewLen = vp.clientWidth;
    atStart.value = vp.scrollLeft <= 2;
    atEnd.value = vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 2;
  }
  const tw = trackRef.value?.clientWidth || 0;
  winStyle.value = { left: Math.min(pos / total, 1) * tw + "px", width: Math.max(14, Math.min(viewLen / total, 1) * tw) + "px" };
  // which era is at the reading point
  const probe = mob ? topOffset() + 60 : vp.getBoundingClientRect().left + vp.clientWidth * 0.4;
  let c = -1;
  segs().forEach((s, i) => {
    const r = s.getBoundingClientRect();
    const a = mob ? r.top : r.left, b = mob ? r.bottom : r.right;
    if (a <= probe && b > probe) c = i;
  });
  if (c !== cur.value) {
    cur.value = c;
    if (mob) centerChip();
    clearTimeout(atTimer);
    atTimer = setTimeout(() => (at.value = c >= 0 ? dynasties.value[c].key : ""), 400);
  }
}
function centerChip() {
  nextTick(() => {
    const strip = stripRef.value, on = strip?.querySelector(".on");
    if (on) strip.scrollTo({ left: on.offsetLeft - (strip.clientWidth - on.offsetWidth) / 2, behavior: "smooth" });
  });
}
const mapLabel = computed(() => {
  const d = dynasties.value[cur.value];
  if (d) return `展开至 <b>${d.key}</b> · ${d.en.replace(" & Southern and Northern Dynasties", " & N–S")}`;
  return atStart.value ? "卷首 · 引首 Frontispiece" : "卷尾 · 跋 Colophon";
});
function goSeg(i, smooth = true) {
  const s = segs()[i];
  if (!s) return;
  if (isMobile.value) window.scrollTo({ top: s.getBoundingClientRect().top + scrollY - topOffset() - 4, behavior: smooth ? "smooth" : "auto" });
  else vpRef.value.scrollTo({ left: s.offsetLeft - 40, behavior: smooth ? "smooth" : "auto" });
}
function onTrack(e) {
  const sp = e.target.closest("span[data-i]");
  const i = sp ? +sp.dataset.i : -1;
  if (i >= 0) return goSeg(i);
  // 点在引首格子或空白处：按比例跳
  const r = trackRef.value.getBoundingClientRect();
  if (isMobile.value) window.scrollTo({ top: 0, behavior: "smooth" });
  else vpRef.value.scrollTo({ left: ((e.clientX - r.left) / r.width) * vpRef.value.scrollWidth, behavior: "smooth" });
}

/* ---------- lifecycle ---------- */
let mq;
function onMq() {
  isMobile.value = mq.matches;
  nextTick(() => { fitRows(); buildMap(); });
}
let rt;
function onResize() {
  clearTimeout(rt);
  rt = setTimeout(() => { fitRows(); nextTick(buildMap); }, 120);
}
function onWinScroll() {
  if (isMobile.value) updateMap();
}

// back from a filter → the scroll is shown again; re-measure it
watch(flat, (f) => { if (!f && view.value === "dynasty") nextTick(() => { fitRows(); buildMap(); }); });
watch(view, (v) => { if (v === "dynasty") nextTick(() => { fitRows(); buildMap(); }); });

onMounted(async () => {
  mq = window.matchMedia("(max-width: 820px)");
  isMobile.value = mq.matches;
  mq.addEventListener("change", onMq);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("keydown", onKey);
  window.addEventListener("resize", onResize);
  window.addEventListener("scroll", onWinScroll, { passive: true });

  meta.value = await loadPoemsMeta();
  ready.value = true;
  await nextTick();
  fitRows();
  await nextTick();
  buildMap();
  // ?at=唐 → 滚到该段（诗页的「返回长卷」用它）
  const ai = dynasties.value.findIndex((d) => d.key === at.value);
  if (ai >= 0 && view.value === "dynasty" && !flat.value) {
    requestAnimationFrame(() => { goSeg(ai, false); updateMap(); });
  }
  document.fonts?.ready.then(() => buildMap());
});
onBeforeUnmount(() => {
  mq?.removeEventListener("change", onMq);
  window.removeEventListener("pointermove", onMove);
  window.removeEventListener("pointerup", onUp);
  window.removeEventListener("keydown", onKey);
  window.removeEventListener("resize", onResize);
  window.removeEventListener("scroll", onWinScroll);
  clearTimeout(qTimer);
  clearTimeout(atTimer);
});
</script>

<style scoped>
.poems { --tools: 58px; --map: 44px; --kai: "Kaiti SC", "STKaiti", "KaiTi", var(--serif-cn); color: var(--body); }
button { font: inherit; color: inherit; cursor: pointer; background: none; border: 0; }
.loading { padding: 80px 20px; text-align: center; font: 500 16px var(--serif-cn); color: var(--muted); }

/* ---------- tool bar ---------- */
.tools { position: sticky; top: var(--appbar-h, 69px); z-index: 30; background: rgba(245, 239, 230, 0.96); border-bottom: 1px solid var(--line-soft); }
.tools-row { display: flex; align-items: center; gap: 18px; height: var(--tools); padding: 0 24px; }
.tt { display: flex; align-items: baseline; gap: 8px; white-space: nowrap; }
.tt b { font: 700 18px var(--serif-cn); color: var(--ink); letter-spacing: 2px; }
.tt span { font: 600 15px var(--caps); color: var(--gold-deep); letter-spacing: 0.5px; }
.seg-btns { display: inline-flex; border: 1px solid var(--border-strong); border-radius: 999px; padding: 2px; background: var(--card); }
.seg-btns button { padding: 5px 13px; border-radius: 999px; font: 600 14px var(--serif-cn); color: var(--body); white-space: nowrap; }
.seg-btns button small { font: 600 12px var(--ui); color: var(--muted); margin-left: 4px; }
.seg-btns button.on { background: var(--cinnabar); color: #fbf1e6; }
.seg-btns button.on small { color: #f3dccb; }
.lvls { display: inline-flex; gap: 6px; }
.lvls button { border: 1px solid var(--line); border-radius: 999px; padding: 4px 11px; font: 600 13px var(--serif-cn); white-space: nowrap; color: var(--body); }
.lvls button small { font: 600 12px var(--ui); color: var(--muted); margin-left: 3px; }
.lvls button.on { border-color: var(--sumi); background: var(--sumi); color: var(--canvas); }
.lvls button.on small { color: var(--line); }
.search { margin-left: auto; position: relative; flex: 0 1 300px; }
.search input { width: 100%; height: 36px; border: 1px solid var(--border-strong); border-radius: 999px; background: var(--card); padding: 0 14px 0 34px; font: 15px var(--ui); color: var(--ink); outline: none; }
.search input:focus { border-color: var(--cinnabar); box-shadow: 0 0 0 3px var(--primary-soft); }
.search svg { position: absolute; left: 12px; top: 10px; width: 16px; height: 16px; stroke: var(--muted); fill: none; stroke-width: 1.8; }
.count { font-size: 13px; color: var(--muted); white-space: nowrap; }
.count b { color: var(--ink); font-weight: 700; }

/* scroll mini-map */
.map { display: flex; align-items: center; gap: 14px; height: var(--map); padding: 0 24px 6px; }
.map-label { font: 600 13px var(--serif-cn); color: var(--muted); white-space: nowrap; min-width: 170px; }
.map-label :deep(b) { color: var(--cinnabar-dk); }
.map-track { position: relative; flex: 1; height: 28px; display: flex; border-radius: 4px; overflow: hidden; background: var(--strong); cursor: pointer; box-shadow: inset 0 0 0 1px var(--line); }
.map-track span { position: relative; height: 100%; border-right: 2px solid var(--canvas); font: 700 14px/28px var(--serif-cn); color: var(--gold-deep); letter-spacing: 1px; text-align: center; overflow: hidden; white-space: nowrap; background: var(--soft); transition: background 0.15s, color 0.15s; }
.map-track span[role="button"]:hover { background: var(--accent-soft); color: var(--ink); }
.map-track span small { font: 600 11px var(--ui); color: var(--muted); letter-spacing: 0; margin-left: 4px; }
.map-track span.gap { background: var(--line); flex: none; }
.map-track span.cur { color: #fbf1e6; background: var(--cinnabar); }
.map-track span.cur small { color: #f3dccb; }
.map-win { position: absolute; top: 0; bottom: 0; border: 2px solid var(--sumi); border-radius: 4px; pointer-events: none; transition: left 0.08s linear; box-shadow: 0 0 0 1px rgba(251, 247, 238, 0.8); }

/* ---------- the handscroll ---------- */
.stage { position: relative; }
.vp { position: relative; height: calc(100vh - var(--appbar-h, 69px) - var(--tools) - var(--map)); min-height: 560px; overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; scrollbar-color: var(--border-strong) transparent; cursor: grab; padding: 12px 0 10px; }
.vp.drag { cursor: grabbing; user-select: none; }
/* 翻屏按钮：只在鼠标悬停长卷时出现，平时不压诗签；到头变灰 */
.pg { position: absolute; top: 50%; z-index: 8; transform: translateY(-50%); width: 48px; height: 84px; padding: 0; border: 1px solid var(--border-strong); border-radius: 6px; background: rgba(251, 247, 238, 0.96); box-shadow: 0 4px 14px rgba(45, 30, 10, 0.16); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: var(--cinnabar-dk); font: 700 26px/1 var(--serif-cn); opacity: 0; pointer-events: none; transition: opacity 0.2s, background 0.15s; }
.pg b { font: 700 12px/1 var(--serif-cn); color: var(--sumi); white-space: nowrap; }
.pg small { font: 600 10.5px/1 var(--ui); color: var(--muted); }
.stage:hover .pg, .pg:focus-visible { opacity: 1; pointer-events: auto; }
.stage:hover .pg.off { opacity: 0.28; pointer-events: none; filter: grayscale(1); }
.pg:hover { background: var(--primary-soft); }
.pg.prev { left: 4px; }
.pg.next { right: 4px; }
@media (hover: none) { .pg { display: none; } }
.roll { display: flex; height: 100%; width: max-content; }
.rod { position: sticky; z-index: 5; flex: none; width: 24px; margin: -10px 0; border-radius: 6px; background: linear-gradient(90deg, #4a3420, #8a6a44 35%, #a4835a 50%, #6d5032 75%, #3d2a18); box-shadow: 0 4px 12px rgba(45, 30, 10, 0.35); }
.rod::before, .rod::after { content: ""; position: absolute; left: -5px; right: -5px; height: 14px; border-radius: 5px; background: linear-gradient(90deg, #5a4026, #c9a874 50%, #5a4026); }
.rod::before { top: -6px; }
.rod::after { bottom: -6px; }
.rod.l { left: 0; }
.rod.r { right: 0; }
.rolled { flex: none; width: 40px; margin-right: -12px; background: linear-gradient(90deg, transparent, rgba(106, 92, 63, 0.25)); }
.paper { position: relative; flex: none; height: 100%; background: var(--card) url("../assets/img/texture/paper.webp"); border-top: 10px solid var(--strong); border-bottom: 10px solid var(--strong); box-shadow: inset 0 1px 0 var(--gold-lt), inset 0 -1px 0 var(--gold-lt); }

/* 引首 */
.yinshou { width: 990px; display: flex; gap: 34px; padding: 40px 46px 34px 54px; background-color: var(--accent-soft); }
.yinshou .big { writing-mode: vertical-rl; font: 400 112px/1 var(--brush); color: var(--ink); letter-spacing: 10px; align-self: flex-start; }
.yinshou .seal-sm { position: absolute; left: 54px; bottom: 36px; width: 46px; height: 46px; border-radius: 5px; background: var(--cinnabar); color: #f8e6d6; display: grid; place-items: center; font: 700 15px/1.05 var(--serif-cn); text-align: center; box-shadow: inset 0 0 0 2px rgba(248, 230, 214, 0.5); }
.yinshou .intro { display: flex; flex-direction: column; justify-content: center; gap: 16px; max-width: 360px; }
.yinshou h1 { font: 700 34px/1.25 var(--serif-cn); color: var(--ink); letter-spacing: 3px; }
.yinshou h1 span { display: block; font: 600 24px var(--caps); color: var(--gold-deep); letter-spacing: 0.5px; margin-top: 4px; }
.yinshou .lead { font: 500 18px/1.85 var(--serif-cn); color: var(--sumi); }
.yinshou .lead-en { font: 400 16px/1.6 var(--ui); color: var(--body); }
.yinshou .hint { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1px dashed var(--gold); border-radius: 999px; background: rgba(251, 247, 238, 0.75); font: 600 15px var(--serif-cn); color: var(--sumi); white-space: nowrap; }
.yinshou .hint small { font: 600 13px var(--ui); color: var(--muted); }
.yinshou .hint .ar { color: var(--cinnabar); font: 700 15px var(--ui); display: inline-block; }
.yinshou .hint .ar.r { animation: nudge 1.6s ease-in-out infinite; }
.yinshou .hint .ar.l { animation: nudgel 1.6s ease-in-out infinite; }
@keyframes nudge { 50% { transform: translateX(4px); } }
@keyframes nudgel { 50% { transform: translateX(-4px); } }
@media (prefers-reduced-motion: reduce) { .yinshou .hint .ar { animation: none !important; } }
.yinshou .motif { position: absolute; right: -14px; bottom: 4px; width: 170px; opacity: 0.4; pointer-events: none; }
/* 从这里开始 */
.start { position: relative; z-index: 1; flex: none; width: 370px; align-self: center; padding-left: 30px; border-left: 1px dashed var(--border-strong); }
.start-h { display: flex; align-items: baseline; gap: 8px; font: 700 22px var(--serif-cn); color: var(--ink); letter-spacing: 2px; }
.start-h span { font: 600 17px var(--caps); color: var(--gold-deep); letter-spacing: 0; }
.start-sub { margin: 4px 0 16px; font: 500 13px/1.5 var(--ui); color: var(--muted); }
.start-list { display: flex; gap: 12px; }
.qian { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px 6px 10px; background: rgba(251, 247, 238, 0.96); border: 1px solid var(--line); border-radius: 3px; color: inherit; text-decoration: none; box-shadow: inset 0 0 0 3px var(--card), inset 0 0 0 4px var(--line-soft), 0 2px 8px rgba(45, 30, 10, 0.08); transition: transform 0.18s, box-shadow 0.18s; }
.qian:hover { transform: translateY(-4px); box-shadow: inset 0 0 0 3px var(--card), inset 0 0 0 4px var(--line), var(--sh-card); }
.qian b { writing-mode: vertical-rl; min-height: 156px; padding: 10px 6px; font: 700 22px/1 var(--serif-cn); letter-spacing: 5px; color: var(--ink); background: #fbf3e6; box-shadow: inset 0 0 0 1px rgba(163, 63, 46, 0.55); }
.qian em { font: 500 13px var(--serif-cn); font-style: normal; color: var(--body); }
.qian span { font: 600 13px/1.2 var(--caps); color: var(--gold-deep); text-align: center; min-height: 31px; }

/* 隔水 */
.geshui { flex: none; width: 58px; height: 100%; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; background: repeating-linear-gradient(0deg, rgba(138, 124, 92, 0.08) 0 2px, transparent 2px 6px), var(--soft); border-top: 10px solid var(--strong); border-bottom: 10px solid var(--strong); border-left: 1px solid var(--border-strong); border-right: 1px solid var(--border-strong); }
.geshui .ba { writing-mode: vertical-rl; font: 500 14px/1.6 var(--kai); color: var(--gold-deep); letter-spacing: 3px; }
.geshui .seal { width: 34px; height: 34px; border-radius: 4px; background: var(--cinnabar); color: #f8e6d6; display: grid; place-items: center; font: 700 19px var(--serif-cn); box-shadow: inset 0 0 0 2px rgba(248, 230, 214, 0.45); transform: rotate(-3deg); }
.geshui .seal.o { background: none; color: var(--cinnabar); box-shadow: inset 0 0 0 2px var(--cinnabar); transform: rotate(2deg); }

/* 朝代段 */
.seg { display: flex; gap: 30px; padding: 20px 44px 16px 40px; overflow: hidden; }
.seg-bg { position: absolute; inset: 0; pointer-events: none; opacity: 0.34; -webkit-mask-image: linear-gradient(180deg, #000 0, rgba(0, 0, 0, 0.55) 45%, transparent 92%); mask-image: linear-gradient(180deg, #000 0, rgba(0, 0, 0, 0.55) 45%, transparent 92%); }
.seg-bg img { position: absolute; top: 0; height: 62%; object-fit: cover; }
.seg-bg img.motif { height: auto; top: auto; }
.seg-head { position: relative; flex: none; width: 300px; display: flex; flex-direction: column; }
.seg-name { display: flex; align-items: flex-end; gap: 14px; }
.seg-name b { font: 900 66px/1 var(--serif-cn); color: var(--ink); letter-spacing: 4px; white-space: nowrap; }
.seg-name b.long { font-size: 36px; letter-spacing: 1px; }
.seg-name .num { flex: none; font: 600 13px var(--ui); color: var(--muted); padding-bottom: 6px; white-space: nowrap; }
.seg-name .num em { font: 700 22px var(--caps); font-style: normal; color: var(--cinnabar-dk); }
.seg-py { margin-top: 10px; font: 600 15px var(--ui); color: var(--gold-deep); letter-spacing: 0.5px; }
.seg-en { font: 600 22px/1.15 var(--caps); color: var(--sumi); }
.seg-yr { margin-top: 8px; display: inline-block; align-self: flex-start; font: 500 13px var(--serif-cn); color: var(--cinnabar-dk); border: 1px solid rgba(163, 63, 46, 0.45); border-radius: 4px; padding: 1px 8px; background: rgba(251, 247, 238, 0.7); }
.seg-zh { margin: 16px 0 8px; font: 400 15px/1.85 var(--serif-cn); color: var(--sumi); background: rgba(251, 247, 238, 0.78); border-radius: 6px; }
.seg-enp { font: 400 14.5px/1.6 var(--ui); color: var(--body); background: rgba(251, 247, 238, 0.78); border-radius: 6px; }
.seg-more { display: none; }

/* 诗签群：竖排成列，奇数列错落 */
.slips { position: relative; display: grid; grid-template-rows: repeat(var(--rows, 3), auto); grid-auto-flow: column; grid-auto-columns: 204px; gap: 14px 18px; align-content: start; padding-top: 4px; --slip-h: 200px; }
.more, .less { display: none; }

/* 拖尾 */
.tuowei { width: 460px; display: flex; flex-direction: column; justify-content: center; gap: 14px; padding: 40px 60px 40px 50px; background-color: var(--card); }
.tuowei .end { font: 400 64px/1 var(--brush); color: var(--ink); letter-spacing: 12px; }
.tuowei p { font: 400 16px/1.8 var(--serif-cn); color: var(--sumi); }
.tuowei p.en { font: 400 15px/1.6 var(--ui); color: var(--body); }
.tuowei img.seals { width: 120px; opacity: 0.85; }
.tuowei img.cranes { position: absolute; right: 30px; top: 24px; width: 170px; opacity: 0.4; }

/* ---------- flat results · themes · imagery ---------- */
.alt { max-width: 1320px; margin: 0 auto; padding: 28px 24px 60px; }
.sheet { background: var(--card) url("../assets/img/texture/paper.webp"); border: 1px solid var(--line); border-top: 10px solid var(--strong); border-bottom: 10px solid var(--strong); padding: 26px 34px 34px; border-radius: 2px; box-shadow: var(--sh-card); }
.grp { padding: 18px 0 22px; border-bottom: 1px dashed var(--line); }
.grp:last-child { border-bottom: 0; }
.grp h3 { display: flex; align-items: baseline; gap: 10px; margin: 0 0 14px; font: 700 24px var(--serif-cn); color: var(--ink); letter-spacing: 2px; }
.grp h3 span { font: 600 18px var(--caps); color: var(--gold-deep); letter-spacing: 0; }
.grp h3 small { font: 500 13px var(--ui); color: var(--muted); letter-spacing: 0; }
.grp h3 .sl { width: 32px; height: 32px; flex: none; align-self: center; border-radius: 4px; background: var(--cinnabar); color: #f8e6d6; display: grid; place-items: center; font: 700 18px var(--serif-cn); box-shadow: inset 0 0 0 2px rgba(248, 230, 214, 0.45); }
.wrap { display: flex; flex-wrap: wrap; gap: 14px; }
.wrap > .slip { width: 204px; }
.flat-bar { display: flex; align-items: center; flex-wrap: wrap; gap: 10px 16px; padding-bottom: 16px; border-bottom: 1px solid var(--line); }
.flat-bar .what { font: 600 16px var(--serif-cn); color: var(--sumi); }
.flat-bar .what small { font: 600 13px var(--ui); color: var(--muted); margin-left: 4px; }
.flat-bar .what b { color: var(--cinnabar-dk); }
.flat-bar button { margin-left: auto; border: 1px solid var(--border-strong); background: var(--card); border-radius: 999px; padding: 6px 14px; font: 600 14px var(--serif-cn); color: var(--cinnabar-dk); }
.flat-bar button small { font: 600 12px var(--ui); color: var(--muted); margin-left: 4px; }
.flat-bar button:hover { background: var(--primary-soft); }
.none { padding: 24px 0; font: 500 16px/1.8 var(--serif-cn); color: var(--muted); }
.none span { font: 14px var(--ui); }
.imgs { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 22px; }
.imgchip { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--line); background: var(--card); border-radius: 4px; padding: 5px 11px 5px 6px; }
.imgchip b { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 3px; font: 700 17px var(--serif-cn); color: var(--cinnabar); box-shadow: inset 0 0 0 1.5px var(--cinnabar); }
.imgchip b.w2 { font-size: 12px; line-height: 1.05; }
.imgchip span { font: 600 14px var(--caps); color: var(--gold-deep); }
.imgchip em { font: 600 12px var(--ui); font-style: normal; color: var(--muted); }
.imgchip.on { background: var(--primary-soft); border-color: var(--cinnabar); }
.imgchip.on b { background: var(--cinnabar); color: #f8e6d6; }
.imgmore { border: 1px dashed var(--border-strong); border-radius: 4px; padding: 5px 14px; font: 600 14px var(--serif-cn); color: var(--cinnabar-dk); }
.imgdesc { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; padding: 18px 0; border-top: 1px solid var(--line); border-bottom: 1px dashed var(--line); margin-bottom: 18px; }
.imgdesc h3 { grid-column: 1 / -1; font: 700 26px var(--serif-cn); color: var(--ink); }
.imgdesc h3 small { font: 600 15px var(--ui); color: var(--muted); }
.imgdesc h3 span { font: 600 20px var(--caps); color: var(--gold-deep); margin-left: 10px; }
.imgdesc p { font: 400 16px/1.85 var(--serif-cn); color: var(--sumi); }
.imgdesc p.en { font: 400 15.5px/1.65 var(--ui); color: var(--body); }
.dynstrip { display: none; }

/* ---------- height adaptation ---------- */
@media (max-height: 820px) and (min-width: 821px) {
  .seg-zh { font-size: 15px; line-height: 1.7; }
  .qian b { min-height: 130px; font-size: 20px; }
}

/* ---------- mobile: vertical scroll ---------- */
@media (max-width: 820px) {
  .tools { position: static; }
  .tools-row { flex-wrap: wrap; height: auto; padding: 10px 14px; gap: 10px; }
  .tt { display: none; }
  .search { order: -1; flex: 1 1 100%; margin-left: 0; }
  .lvls { overflow-x: auto; max-width: 100%; }
  .lvls button { padding: 4px 9px; }
  .count { margin-left: auto; }
  .map { display: none; }
  /* 粘性朝代条（顶栏下方），横滑，当前段朱红 */
  .dynstrip { display: flex; position: sticky; top: var(--appbar-h, 60px); z-index: 25; gap: 6px; overflow-x: auto; padding: 8px 10px; background: rgba(245, 239, 230, 0.97); border-bottom: 1px solid var(--line); box-shadow: 0 4px 10px rgba(45, 30, 10, 0.07); scrollbar-width: none; }
  .dynstrip::-webkit-scrollbar { display: none; }
  .dynstrip button { flex: none; border: 1px solid var(--line); background: var(--card); border-radius: 999px; padding: 6px 13px; font: 700 15px/1.2 var(--serif-cn); color: var(--body); white-space: nowrap; }
  .dynstrip button small { font: 600 11.5px var(--ui); color: var(--muted); margin-left: 4px; }
  .dynstrip button.on { background: var(--cinnabar); border-color: var(--cinnabar); color: #fbf1e6; }
  .dynstrip button.on small { color: #f3dccb; }
  .vp { height: auto; min-height: 0; overflow: visible; padding: 0 10px 30px; cursor: auto; }
  .roll { flex-direction: column; width: auto; height: auto; }
  .rod { position: relative; left: auto; right: auto; width: auto; height: 22px; margin: 0 -3px; background: linear-gradient(180deg, #4a3420, #8a6a44 35%, #a4835a 50%, #6d5032 75%, #3d2a18); }
  .rod::before, .rod::after { top: -4px; bottom: -4px; height: auto; width: 14px; left: auto; right: auto; background: linear-gradient(180deg, #5a4026, #c9a874 50%, #5a4026); }
  .rod::before { left: -4px; }
  .rod::after { right: -4px; }
  .rolled { display: none; }
  .paper { height: auto; border-top: 0; border-bottom: 0; border-left: 8px solid var(--strong); border-right: 8px solid var(--strong); box-shadow: inset 1px 0 0 var(--gold-lt), inset -1px 0 0 var(--gold-lt); }
  .yinshou { width: auto; flex-direction: column; gap: 16px; padding: 26px 20px 26px; }
  .yinshou .big { writing-mode: horizontal-tb; font-size: 64px; letter-spacing: 6px; }
  .yinshou .seal-sm { left: auto; right: 22px; top: 30px; bottom: auto; }
  .yinshou h1 { font-size: 28px; }
  .yinshou .hint { display: none; }
  .yinshou .motif { width: 120px; right: 0; bottom: 0; opacity: 0.3; }
  .start { width: auto; align-self: stretch; padding: 16px 0 0; border-left: 0; border-top: 1px dashed var(--border-strong); }
  .start-h { font-size: 19px; }
  .start-sub { margin-bottom: 12px; }
  .start-list { gap: 8px; }
  .qian { padding: 10px 3px 8px; gap: 6px; }
  .qian b { min-height: 128px; font-size: 18px; letter-spacing: 3px; padding: 8px 4px; }
  .qian span { font-size: 12px; min-height: 29px; }
  .geshui { width: auto; height: 52px; flex-direction: row; border: 0; border-top: 1px solid var(--border-strong); border-bottom: 1px solid var(--border-strong); border-left: 8px solid var(--strong); border-right: 8px solid var(--strong); background: repeating-linear-gradient(90deg, rgba(138, 124, 92, 0.08) 0 2px, transparent 2px 6px), var(--soft); }
  .geshui .ba { writing-mode: horizontal-tb; }
  .seg { flex-direction: column; gap: 18px; padding: 24px 16px 26px; }
  .seg-bg img { height: 240px; }
  .seg-head { width: auto; }
  .seg-name b { font-size: 52px; }
  .seg-name b.long { font-size: 32px; }
  .seg-head:not(.open) .seg-zh, .seg-head:not(.open) .seg-enp { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .seg-head:not(.open) .seg-enp { -webkit-line-clamp: 2; }
  .seg-more { display: inline-block; align-self: flex-start; margin-top: 6px; padding: 2px 0; font: 600 13.5px var(--serif-cn); color: var(--cinnabar-dk); }
  .seg-more small { font: 600 12px var(--ui); color: var(--muted); margin-left: 4px; }
  .slips { grid-auto-flow: row; grid-template-rows: none; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-auto-columns: auto; gap: 12px; }
  .slips > .slip { top: 0 !important; }
  .slips > .slip.fold { display: none; }
  /* 叠纸「展开此段」 */
  .more { grid-column: 1 / -1; display: block; width: 100%; text-align: left; margin: 2px 0 10px; padding: 12px 14px; border: 1px solid var(--border-strong); border-radius: 3px; background: var(--card); box-shadow: 0 4px 0 -1px var(--soft), 0 4px 0 0 var(--line), 0 8px 0 -1px var(--strong), 0 8px 0 0 var(--line-soft), 0 10px 14px rgba(45, 30, 10, 0.08); }
  .more b { display: flex; align-items: baseline; gap: 8px; font: 700 16px var(--serif-cn); color: var(--cinnabar-dk); letter-spacing: 1px; }
  .more b small { font: 600 12.5px var(--ui); color: var(--muted); letter-spacing: 0; }
  .more b i { margin-left: auto; font: 700 15px var(--ui); font-style: normal; color: var(--cinnabar); }
  .more .names { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-top: 6px; font: 500 14px/1.6 var(--kai); color: var(--body); }
  .less { grid-column: 1 / -1; justify-self: center; display: block; padding: 6px 12px; font: 600 14px var(--serif-cn); color: var(--muted); }
  .less small { font: 600 12px var(--ui); margin-left: 4px; }
  .tuowei { width: auto; padding: 30px 20px; }
  .tuowei img.cranes { width: 120px; right: 10px; }
  .alt { padding: 16px 10px 40px; }
  .sheet { padding: 18px 14px; }
  .wrap { gap: 12px; }
  .wrap > .slip { width: calc(50% - 6px); }
  .grp h3 { flex-wrap: wrap; white-space: nowrap; row-gap: 2px; font-size: 22px; }
  .grp h3 span { font-size: 15px; white-space: normal; }
  .flat-bar button { margin-left: 0; }
  .imgdesc { grid-template-columns: 1fr; gap: 12px; }
}
</style>
