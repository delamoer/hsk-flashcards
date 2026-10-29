<template>
  <main class="wrap" :style="{ '--bar-h': barH + 'px' }">
    <header class="phead" :style="pageHeroBg()">
      <img class="hero-motif" :src="motifPine" alt="" aria-hidden="true" />
      <div class="kicker">Grammar Index · 语法总览</div>
      <h1>语法汇总<span class="en">Grammar</span></h1>
      <p>按教材、册、课浏览全部语法，或用中文 / 拼音 / 英文搜索</p>
      <p class="pen">Browse every grammar point by book, or search in Chinese, pinyin or English</p>
      <div class="rule"><span class="diamond">◇ ◇ ◇</span></div>
    </header>

    <div class="bar" ref="barRef">
      <label class="search">
        <span class="ic">🔍</span>
        <input v-model="q" placeholder="搜语法：比 / ba / 越来越 / comparison" />
        <button v-if="q" class="clear" @click="q = ''" title="清空 Clear">✕</button>
      </label>
      <div class="row">
        <div class="sel">
          <label>教材 Series</label>
          <select v-model="series" @change="book = ''; lesson = ''">
            <option value="">全部教材 All</option>
            <option v-for="s in seriesList" :key="s.id" :value="s.id">{{ s.short }}</option>
          </select>
        </div>
        <div class="sel">
          <label>册 Book</label>
          <select v-model="book" @change="onBook">
            <option value="">全部册 All</option>
            <option v-for="b in bookOptions" :key="b.key" :value="b.key">{{ series ? b.book : b.full }}</option>
          </select>
        </div>
        <div class="sel">
          <label>课 Lesson</label>
          <select v-model="lesson" :disabled="!book">
            <option value="">{{ book ? "全部课 All" : "先选册 Pick a book" }}</option>
            <option v-for="l in lessonOptions" :key="l.num" :value="String(l.num)">第{{ l.num }}课 {{ l.title }}</option>
          </select>
        </div>
        <div class="sel">
          <label>类型 Type</label>
          <select v-model="type">
            <option value="">全部类型 All</option>
            <option v-for="t in typeOptions" :key="t.type" :value="t.type">{{ t.type }}（{{ t.n }}）</option>
          </select>
        </div>
        <label class="chk"><input type="checkbox" v-model="withEg" /> 也搜例句 <span>incl. examples</span></label>
        <div class="meta">
          <span class="count">共 <b>{{ results.length }}</b> 条 · {{ results.length }} points</span>
          <button
            class="btn"
            :class="{ on: expandAll && !!book }"
            :disabled="!book"
            :title="book ? '' : '先选一册再全部展开 · Pick a book first'"
            @click="expandAll = !expandAll"
          >
            {{ expandAll && book ? "收起 Collapse" : "全部展开 Expand all" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="empty"><div class="d">◇ ◇ ◇</div><p>加载中… · Loading…</p></div>
    <div v-else-if="!results.length" class="empty">
      <div class="d">◇ ◇ ◇</div>
      <h3>没有找到相关语法</h3>
      <p>No grammar matches “{{ q }}”. 试试拼音或英文，或勾选「也搜例句」。</p>
    </div>

    <div v-else class="cols" :class="{ single: !stageMode }">
      <div class="list">
        <div v-for="g in groups" :key="g.key" class="grp">
          <div class="ghead">
            <span class="bk">{{ g.head }}</span>
            <span class="ls">{{ g.sub }}</span>
            <span class="n" v-if="g.n">{{ g.n }} 条</span>
          </div>
          <div
            v-for="p in g.items"
            :key="p.k"
            class="item"
            :class="{ open: isOpen(p), on: stageMode && p.k === selK }"
            :data-row="p.k"
          >
            <button class="rowi" @click="pick(p)">
              <span class="ar">▶</span>
              <span class="nm" v-html="highlight(p.name, q)"></span>
              <span class="tag">{{ tagOf(p) }}</span>
              <span class="st" v-if="p.st" v-html="highlight(p.st, q)"></span>
              <span class="en" v-if="p.en" v-html="highlight(p.en, q)"></span>
            </button>
            <div v-if="isOpen(p)" class="body">
              <GrammarCard v-if="full[p.k]" :point="full[p.k]" :query="q">
                <div class="gofrom">
                  <span>出自 {{ fullLabel(p) }} · 第{{ p.l }}课《{{ p.lt }}》</span>
                  <router-link :to="lessonLink(p)">去这一课学习 →</router-link>
                </div>
              </GrammarCard>
              <div v-else class="cardload">加载中… · Loading…</div>
            </div>
          </div>
        </div>
        <button v-if="results.length > limit" class="btn more" @click="limit += PAGE">
          再显示 {{ Math.min(PAGE, results.length - limit) }} 条 · Show more（剩 {{ results.length - limit }}）
        </button>
      </div>

      <aside v-if="stageMode && sel" class="stage">
        <div class="ctl">
          <span class="pos">{{ selPos + 1 }} / {{ results.length }}</span>
          <button class="btn" :disabled="selPos <= 0" @click="step(-1)">← 上一条 Prev</button>
          <button class="btn" :disabled="selPos >= results.length - 1" @click="step(1)">下一条 Next →</button>
        </div>
        <GrammarCard v-if="full[sel.k]" :point="full[sel.k]" :query="q" large class="stagecard">
          <div class="gofrom">
            <span>出自 {{ fullLabel(sel) }} · 第{{ sel.l }}课《{{ sel.lt }}》</span>
            <router-link :to="lessonLink(sel)">去这一课学习 →</router-link>
          </div>
        </GrammarCard>
        <div v-else class="cardload">加载中… · Loading…</div>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import GrammarCard from "@/components/GrammarCard.vue";
import { loadGrammarIndex, matches, rank, highlight } from "@/utils/grammarSearch";
import { loadGrammarUnit } from "@/data/grammar";
import { COURSE_REGISTRY } from "@/data/courses";
import { pageHeroBg, motifPine } from "@/assets/img.js";

const route = useRoute();
const router = useRouter();

// ── book labels ──────────────────────────────────────────────────────────
// Short series names for this page (the registry's names are the long 门面 titles).
const SHORT = { hsk: "标准HSK", newhsk3: "新HSK3.0", huihua360: "会话360句", zoubian: "走遍中国", kouyu: "新时代汉语口语", survival: "生存汉语" };
const TAG = { hsk: "", newhsk3: "新", huihua360: "360·", zoubian: "走遍", kouyu: "口语", survival: "生存" };
const CN = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
function splitKey(key) {
  const i = key.lastIndexOf("-");
  return [key.slice(0, i), key.slice(i + 1)];
}
function bookName(sid, uid) {
  if (sid === "hsk") return `HSK ${uid}`;
  if (sid === "newhsk3" || sid === "huihua360") return `第${CN[uid] || uid}册`;
  const unit = COURSE_REGISTRY.find((s) => s.id === sid)?.units.find((u) => String(u.id) === String(uid));
  return unit?.label || String(uid);
}
const shortOf = (sid) => SHORT[sid] || COURSE_REGISTRY.find((s) => s.id === sid)?.name || sid;
function fullLabel(p) {
  const [sid, uid] = splitKey(p.b);
  return `${shortOf(sid)} · ${bookName(sid, uid)}`;
}
function tagOf(p) {
  const [sid, uid] = splitKey(p.b);
  const book = sid === "hsk" ? `HSK${uid}` : sid in TAG ? `${TAG[sid]}${sid === "newhsk3" ? CN[uid] : uid}` : bookName(sid, uid);
  return `${book} · L${p.l}`;
}
function lessonLink(p) {
  const [sid, uid] = splitKey(p.b);
  return { path: `/course/${sid}/${uid}/lesson/${p.l}`, query: { tab: "grammar" } };
}

// ── index + filter state (mirrored in the URL so 返回 lands on the same view) ──
const all = ref([]);
const loading = ref(true);
const q = ref(String(route.query.q || ""));
const series = ref(String(route.query.s || ""));
const book = ref(String(route.query.b || ""));
const lesson = ref(String(route.query.l || ""));
const type = ref(String(route.query.t || ""));
const withEg = ref(route.query.eg === "1");
const expandAll = ref(false);

onMounted(async () => {
  all.value = await loadGrammarIndex();
  loading.value = false;
});

let qTimer;
watch([q, series, book, lesson, type, withEg], () => {
  clearTimeout(qTimer);
  qTimer = setTimeout(() => {
    const query = {};
    if (q.value) query.q = q.value;
    if (series.value) query.s = series.value;
    if (book.value) query.b = book.value;
    if (lesson.value) query.l = lesson.value;
    if (type.value) query.t = type.value;
    if (withEg.value) query.eg = "1";
    router.replace({ query });
  }, 300);
  limit.value = PAGE;
});

function onBook() {
  lesson.value = "";
  if (book.value) series.value = splitKey(book.value)[0];
}

const books = computed(() => {
  const m = new Map();
  all.value.forEach((p) => {
    if (!m.has(p.b)) {
      const [sid, uid] = splitKey(p.b);
      m.set(p.b, { key: p.b, sid, book: bookName(sid, uid), full: `${shortOf(sid)} · ${bookName(sid, uid)}` });
    }
  });
  return [...m.values()];
});
const seriesList = computed(() => [...new Set(books.value.map((b) => b.sid))].map((id) => ({ id, short: shortOf(id) })));
const bookOptions = computed(() => books.value.filter((b) => !series.value || b.sid === series.value));
const lessonOptions = computed(() => {
  if (!book.value) return [];
  const m = new Map();
  all.value.forEach((p) => p.b === book.value && !m.has(p.l) && m.set(p.l, { num: p.l, title: p.lt }));
  return [...m.values()];
});
const typeOptions = computed(() => {
  const c = new Map();
  all.value.forEach((p) => p.type && c.set(p.type, (c.get(p.type) || 0) + 1));
  return [...c.entries()].sort((a, b) => b[1] - a[1]).map(([t, n]) => ({ type: t, n }));
});

const results = computed(() => {
  const query = q.value.trim();
  const r = all.value.filter(
    (p) =>
      (!series.value || splitKey(p.b)[0] === series.value) &&
      (!book.value || p.b === book.value) &&
      (!lesson.value || String(p.l) === lesson.value) &&
      (!type.value || p.type === type.value) &&
      matches(p, query, withEg.value)
  );
  if (!query) return r; // book order
  return r.map((p) => [rank(p, query), p]).sort((a, b) => a[0] - b[0] || a[1].k - b[1].k).map((x) => x[1]);
});

// No query → grouped by 书·课; with a query → one ranked list.
const PAGE = 120;
const limit = ref(PAGE);
const groups = computed(() => {
  const shown = results.value.slice(0, limit.value);
  if (q.value.trim()) return [{ key: "r", head: "搜索结果", sub: "最相关的排在前面 · best matches first", items: shown }];
  const out = [];
  const count = new Map();
  results.value.forEach((p) => count.set(p.b + "|" + p.l, (count.get(p.b + "|" + p.l) || 0) + 1));
  shown.forEach((p) => {
    const key = p.b + "|" + p.l;
    let g = out[out.length - 1];
    if (!g || g.key !== key) {
      g = { key, head: fullLabel(p), sub: `第 ${p.l} 课 · ${p.lt}`, n: count.get(key), items: [] };
      out.push(g);
    }
    g.items.push(p);
  });
  return out;
});

// ── desktop: list + sticky stage; narrow screens: tap a row to expand in place ──
const mq = window.matchMedia("(min-width: 1001px)");
const wide = ref(mq.matches);
const onMq = (e) => (wide.value = e.matches);
onMounted(() => mq.addEventListener("change", onMq));
onUnmounted(() => mq.removeEventListener("change", onMq));
const stageMode = computed(() => wide.value && !(expandAll.value && book.value));

const opened = reactive(new Set());
const isOpen = (p) => (expandAll.value && !!book.value) || (!wide.value && opened.has(p.k));

// Full point data is fetched per book on demand (the index only has list fields).
const full = reactive({});
async function ensureFull(p) {
  if (full[p.k]) return;
  const [sid, uid] = splitKey(p.b);
  const ds = await loadGrammarUnit(sid, uid);
  const pt = ds?.lessons.find((l) => l.num === p.l)?.points[p.i];
  if (pt) full[p.k] = pt;
}

const selK = ref(null);
const selPos = computed(() => results.value.findIndex((p) => p.k === selK.value));
const sel = computed(() => results.value[selPos.value] || null);
watch(
  results,
  (r) => {
    if (!r.find((p) => p.k === selK.value)) selK.value = r[0]?.k ?? null;
  },
  { immediate: true }
);
watch(sel, (p) => p && stageMode.value && ensureFull(p), { immediate: true });
watch(stageMode, (on) => on && sel.value && ensureFull(sel.value));
watch([expandAll, book, results], () => {
  if (expandAll.value && book.value) results.value.slice(0, limit.value).forEach(ensureFull);
});

function pick(p) {
  if (stageMode.value) {
    selK.value = p.k;
  } else if (!(expandAll.value && book.value)) {
    opened.has(p.k) ? opened.delete(p.k) : (opened.add(p.k), ensureFull(p));
  }
}

// The stage sits just below the sticky filter bar, whose height changes as it wraps.
const barRef = ref(null);
const barH = ref(150);
let ro;
onMounted(() => {
  if (!barRef.value || !("ResizeObserver" in window)) return;
  ro = new ResizeObserver(() => (barH.value = barRef.value?.offsetHeight || 150));
  ro.observe(barRef.value);
});
onUnmounted(() => ro?.disconnect());

function step(d) {
  const n = results.value[selPos.value + d];
  if (!n) return;
  if (results.value.indexOf(n) >= limit.value) limit.value += PAGE;
  selK.value = n.k;
  nextTick(() => {
    const row = document.querySelector(`[data-row="${n.k}"]`);
    if (!row) return;
    const r = row.getBoundingClientRect();
    const top = barRef.value?.getBoundingClientRect().bottom || 0;
    if (r.top < top + 10 || r.bottom > window.innerHeight - 10) window.scrollBy({ top: r.top - top - 80, behavior: "smooth" });
  });
}
function onKey(e) {
  if (!stageMode.value || ["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
  if (e.key === "ArrowDown") (step(1), e.preventDefault());
  if (e.key === "ArrowUp") (step(-1), e.preventDefault());
}
onMounted(() => document.addEventListener("keydown", onKey));
onUnmounted(() => document.removeEventListener("keydown", onKey));
</script>

<style scoped>
.wrap { max-width: 1360px; margin: 0 auto; padding: 0 28px 80px; }
.phead { position: relative; text-align: center; padding: 38px 24px 28px; margin: 16px 0 22px; border-radius: 14px; border: 1px solid var(--line); box-shadow: 0 10px 30px -18px rgba(45,30,10,.3); overflow: hidden; }
.hero-motif { position: absolute; top: -6px; right: 8px; width: 190px; opacity: .6; mix-blend-mode: multiply; pointer-events: none; }
.phead > *:not(.hero-motif) { position: relative; z-index: 1; }
.phead .kicker { font-family: var(--caps); font-size: 12px; letter-spacing: 5px; text-transform: uppercase; color: var(--gold-deep); }
.phead h1 { font-family: var(--brush); font-size: 52px; font-weight: 400; letter-spacing: 3px; color: var(--sumi); margin: 8px 0 4px; text-shadow: 0 1px 0 rgba(255,255,255,.5); }
.phead .en { font-family: var(--serif-en); font-style: italic; font-weight: 500; font-size: 22px; letter-spacing: 1px; color: var(--gold-deep); margin-left: 12px; }
.phead p { margin-top: 4px; color: var(--ink-soft, #4a3d2a); font-family: var(--serif-cn); font-size: 15px; }
.phead p.pen { font-family: var(--serif-en); font-style: italic; font-size: 15px; color: var(--muted); margin-top: 2px; }
.phead .rule { display: flex; align-items: center; gap: 14px; max-width: 260px; margin: 14px auto 0; }
.phead .rule::before, .phead .rule::after { content: ""; height: 1px; flex: 1; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.phead .diamond { font-size: 11px; letter-spacing: 6px; color: var(--gold); }

.bar { position: sticky; top: var(--appbar-h, 69px); z-index: 20; background: linear-gradient(180deg, #f7f1e7, #f2eadc); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; box-shadow: 0 8px 20px -14px rgba(45,30,10,.3); display: grid; gap: 12px; }
.search { display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--border-strong); border-radius: 99px; padding: 0 16px; height: 46px; }
.search:focus-within { border-color: var(--gold); }
.search .ic { color: var(--gold-deep); font-size: 15px; }
.search input { flex: 1; min-width: 0; border: none; background: none; font-size: 16px; outline: none; font-family: var(--han); color: var(--ink); }
.search input::placeholder { color: var(--muted-soft); }
.search .clear { color: var(--muted); font-size: 13px; padding: 4px 6px; }
.row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.sel { display: inline-flex; flex-direction: column; line-height: 1.1; }
.sel label { font-family: var(--caps); font-size: 9.5px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold-deep); margin: 0 0 3px 4px; }
.sel select { appearance: none; border: 1px solid var(--line); background: var(--paper) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6'><path d='M0 0l5 6 5-6z' fill='%236a5c3f'/></svg>") right 10px center no-repeat; border-radius: 8px; padding: 7px 30px 7px 11px; font-size: 13.5px; font-weight: 700; font-family: var(--han); color: var(--ink); min-width: 120px; max-width: 240px; cursor: pointer; }
.sel select:disabled { opacity: .55; cursor: not-allowed; }
.chk { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--body); margin-left: 4px; align-self: flex-end; padding-bottom: 7px; cursor: pointer; }
.chk span { color: var(--muted-soft); }
.meta { margin-left: auto; align-self: flex-end; display: flex; gap: 10px; align-items: center; padding-bottom: 2px; }
.count { font-size: 13px; color: var(--muted); }
.count b { font-family: var(--serif-cn); color: var(--ink); font-size: 16px; }
.btn { border: 1px solid var(--line); background: var(--paper); border-radius: 99px; padding: 6px 14px; font-size: 12.5px; font-weight: 800; color: var(--body); }
.btn:disabled { opacity: .4; cursor: not-allowed; }
.btn.on { background: var(--gold); color: #fff8ea; border-color: var(--gold-deep); }

/* two columns on desktop: the list flows with the page (no inner scrollbar), the stage is sticky */
.cols { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 30px; align-items: start; }
.cols.single { grid-template-columns: minmax(0, 1fr); }
.grp { margin-top: 28px; }
.ghead { display: flex; align-items: baseline; gap: 10px; padding: 0 4px 8px; border-bottom: 1px solid var(--line); position: relative; }
.ghead::after { content: ""; position: absolute; left: 0; bottom: -1px; width: 64px; height: 2px; background: linear-gradient(90deg, var(--cinnabar), transparent); }
.ghead .bk::before { content: "◆"; font-size: 9px; color: var(--gold); margin-right: 7px; vertical-align: 2px; }
.ghead .bk { font-family: var(--serif-cn); font-weight: 700; font-size: 14.5px; color: var(--cinnabar-dk); white-space: nowrap; }
.ghead .ls { font-family: var(--serif-cn); font-size: 14.5px; color: var(--body); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ghead .n { margin-left: auto; font-family: var(--caps); font-size: 12px; color: var(--muted); white-space: nowrap; }
.item { border-bottom: 1px dashed var(--line-soft); }
.rowi { width: 100%; display: grid; grid-template-columns: 16px minmax(0, 1fr) auto; column-gap: 12px; row-gap: 3px; align-items: baseline; text-align: left; padding: 12px 8px; border-radius: 6px; transition: background .15s; }
.rowi:hover { background: rgba(232,220,198,.45); }
.rowi .ar { color: var(--gold); font-size: 10px; transition: transform .2s; grid-row: 1 / span 3; }
.rowi .nm { font-family: var(--serif-cn); font-weight: 700; font-size: 17px; color: var(--ink); line-height: 1.35; }
.rowi .tag { font-size: 11.5px; font-weight: 800; color: var(--gold-deep); background: var(--paper-2); border: 1px solid var(--line-soft); border-radius: 99px; padding: 2px 9px; white-space: nowrap; }
.rowi .st { grid-column: 2 / 4; font-family: var(--serif-cn); font-size: 14px; color: var(--body); line-height: 1.4; }
.rowi .en { grid-column: 2 / 4; font-family: var(--serif-en); font-style: italic; font-size: 14.5px; color: var(--muted); line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rowi :deep(mark) { background: none; color: var(--cinnabar); font-weight: 800; box-shadow: inset 0 -.35em 0 rgba(163,63,46,.13); }
.item.on .rowi { background: linear-gradient(90deg, rgba(163,63,46,.12), rgba(163,63,46,.02)); box-shadow: inset 3px 0 0 var(--cinnabar); }
.item.on .rowi .nm, .item.open .rowi .nm { color: var(--cinnabar-dk); }
.item.on .rowi .ar, .item.open .rowi .ar { color: var(--cinnabar); }
.item.open .rowi .ar { transform: rotate(90deg); }
.body { padding: 4px 0 18px 28px; }
.more { display: block; margin: 26px auto 0; padding: 10px 22px; }
.cardload { padding: 30px; text-align: center; color: var(--muted); font-size: 13px; }

.stage { position: sticky; top: calc(var(--appbar-h, 69px) + var(--bar-h, 150px) + 18px); margin-top: 28px; }
.stage .ctl { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.stage .ctl .pos { font-family: var(--caps); font-size: 13px; color: var(--muted); letter-spacing: 1px; }
.stage .ctl .btn:first-of-type { margin-left: auto; }
.stagecard { max-height: calc(100vh - var(--appbar-h, 69px) - var(--bar-h, 150px) - 90px); overflow: auto; scrollbar-width: thin; scrollbar-color: var(--border-strong) transparent; }

.gofrom { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--line-soft); font-size: 12.5px; color: var(--muted); }
.gofrom a { font-family: var(--serif-cn); font-weight: 700; color: var(--cinnabar-dk); white-space: nowrap; }
.gofrom a:hover { text-decoration: underline; }

.empty { text-align: center; padding: 70px 20px; color: var(--muted); }
.empty .d { color: var(--gold); letter-spacing: 6px; margin-bottom: 12px; }
.empty h3 { font-family: var(--serif-cn); font-size: 24px; color: var(--body); margin-bottom: 8px; }

@media (max-width: 640px) {
  .wrap { padding: 0 14px 60px; }
  .phead { padding: 28px 16px 22px; }
  .phead h1 { font-size: 40px; }
  .phead .en { display: block; margin: 0; font-size: 17px; }
  .phead p { font-size: 13.5px; }
  .hero-motif { display: none; }
  .bar { position: static; }
  .row .sel { flex: 1 1 40%; }
  .sel select { min-width: 0; width: 100%; max-width: none; }
  .body { padding-left: 0; }
  .rowi .en { white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
}
</style>
