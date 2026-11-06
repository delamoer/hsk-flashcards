<template>
  <main class="poem" :class="[bodyCls, { 'poem-ready': ready && poem }]" ref="rootRef">
    <!-- 单首诗页 ·「手卷」三段式（定稿 A2，样稿 design-demos/poetry/A2-poem.html）：
         引首（题目、作者、体裁/词牌/难度/主题、英文导读、朗读全诗）| 隔水 |
         画心（开关签 节奏/拼音/直译/意译/声调色 → 每行一个分层行：左槽 行号 + 朗读，中间 原文大字 → 拼音 ruby → 直译 → 意译）
         + 卷边钤印（意象印章，点开看在本诗中的意思，并在原文里标红）→ 卷后「题跋」：解析中英并排、作者与背景、读音注意、版本说明。
         默认只开「意译」：从 Google 搜英文进来的读者几秒内要看懂这首诗在说什么；拼音、直译始终在 DOM 里（CSS 隐藏），
         预渲染的静态副本里也读得到。 -->
    <div v-if="!ready" class="loading">加载中… · Loading…</div>

    <div v-else-if="!poem" class="miss">
      <div class="d">◇ ◇ ◇</div>
      <h2>没有找到这首诗 · Poem not found</h2>
      <router-link :to="{ name: 'poems' }">← 回到古诗词长卷 · Back to Classical Poetry</router-link>
    </div>

    <template v-else>
      <nav class="crumb">
        <router-link class="back" :to="backTo">
          <svg class="i" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" /></svg>
          <b>朝代长卷 · {{ poem.dynasty }}</b><span>Back to the scroll · {{ dynEn }}</span>
        </router-link>
        <div class="pn">
          <router-link v-if="prev" :to="{ name: 'poem', params: { slug: prev.slug } }"><small>上一首</small>{{ prev.title }}</router-link>
          <router-link v-if="next" :to="{ name: 'poem', params: { slug: next.slug } }"><small>下一首</small>{{ next.title }}</router-link>
        </div>
      </nav>

      <div class="scroll">
        <div class="rod"></div>
        <!-- 引首 -->
        <aside class="paper yinshou"><div class="ys-in">
          <div class="ys-kicker"><span class="seal">{{ poem.dynasty[0] }}</span>{{ poem.dynasty }} · {{ poem.form }}</div>
          <h1 class="title">{{ titleParts.main }}<small v-if="titleParts.sub">{{ titleParts.sub }}</small></h1>
          <div class="t-py">{{ poem.titlePy }}</div>
          <div class="t-en">{{ poem.titleEn }}</div>
          <div class="author">
            <b>{{ poem.author }}</b>
            <span>{{ poem.authorPy ? poem.authorPy + " · " : "" }}{{ poem.authorEn }}</span>
            <em>{{ poem.dynasty }} {{ dynEn }}</em>
          </div>
          <dl class="meta">
            <dt>体裁<small>Form</small></dt>
            <dd><span class="chip">{{ poem.form }} <i v-if="FORM_EN[poem.form]">{{ FORM_EN[poem.form] }}</i></span><span v-if="poem.excerpt" class="chip">节选 <i>Excerpt</i></span></dd>
            <template v-if="poem.tune">
              <dt>{{ poem.form === "词" ? "词牌" : "曲牌" }}<small>Tune</small></dt>
              <dd class="dd-tune">{{ poem.tune }} <i>the tune name, not the title</i></dd>
            </template>
            <dt>难度<small>Level</small></dt>
            <dd><span class="chip" :class="lv[0]">{{ poem.level }} <i>{{ lv[1] }}</i></span></dd>
            <dt>主题<small>Themes</small></dt>
            <dd><span v-for="t in poem.themes" :key="t" class="chip">{{ t }} <i>{{ themeEn[t] }}</i></span></dd>
          </dl>
          <div class="daodu"><h2>导读<span>About this poem</span></h2><p>{{ poem.intro }}</p></div>
          <button class="play-all" :class="{ on: nowPlaying === allText }" @click="speakSequence(allText, poem.lines.map((l) => l.zh), { recited: true })">
            <span class="ic">{{ nowPlaying === allText ? "⏹" : "▶" }}</span>朗读全诗 <small>{{ nowPlaying === allText ? "Stop" : "Read aloud" }}</small>
          </button>
          <!-- 诗词新唱：整首被谱成歌的，在引首挂一张 MV 海报，点了去中国风 -->
          <div v-for="f in sungFull" :key="f.n" class="lk-sung">
            <h3>这首诗被谱成了歌<span>Sung as a song</span></h3>
            <router-link class="lk-mnt" :to="{ name: 'music', query: { song: f.n } }" :aria-label="`${f.song.zh} — ${f.song.artistEn}`">
              <span class="im"><img :src="`https://i.ytimg.com/vi/${f.song.id}/hqdefault.jpg`" alt="" loading="lazy" /><span class="pl"></span></span>
            </router-link>
            <div class="who">{{ f.song.artist }}《{{ f.song.zh }}》<small>{{ f.song.artistEn }}</small></div>
            <p>{{ f.song.note }}</p>
            <router-link class="go" :to="{ name: 'music', query: { song: f.n } }">到中国风去听 <small>Listen in Music →</small></router-link>
          </div>
        </div></aside>
        <div class="geshui"></div>

        <!-- 画心 -->
        <section class="paper huaxin">
          <img class="hx-bg" :src="hxBg" alt="" />
          <div class="hx-main">
            <div class="switches">
              <button v-for="s in SWITCHES" :key="s.k" class="sw" :aria-pressed="isOn(s.k)" @click="toggle(s.k)">
                {{ s.zh }} <small>{{ s.en }}</small>
              </button>
            </div>
            <p class="tip">点 <u>虚线字</u> 看读音和意思 · Tap a dotted word for its sound and meaning</p>

            <div class="stanzas" :class="{ 'lk-notes': sungLines.size }" @click="onLinesClick" @keydown.enter="onLinesClick">
              <div v-for="(st, si) in stanzas" :key="si" class="stanza">
                <div v-if="stanzas.length > 1" class="st-label">{{ stanzaLabel(si)[0] }}<small>{{ stanzaLabel(si)[1] }}</small></div>
                <div v-for="ln in st" :key="ln.i" class="ln" :class="{ playing: nowPlaying === ln.zh || (nowPlaying === allText && nowIndex === ln.i) }">
                  <div class="gut">
                    <span class="no">{{ String(ln.i + 1).padStart(2, "0") }}</span>
                    <button class="lp" :title="'朗读这一行 Play line'" :aria-label="`Play line ${ln.i + 1}`" @click.stop="speak(ln.zh, { recited: true })">
                      {{ nowPlaying === ln.zh ? "⏹" : "▶" }}
                    </button>
                  </div>
                  <div class="body">
                    <div class="zh" v-html="lineHTML[ln.i]"></div>
                    <p class="tr lit"><b>直译<small>Literal</small></b>{{ ln.lit }}</p>
                    <p class="tr free"><b>意译<small>Meaning</small></b>{{ ln.en }}</p>
                  </div>
                  <!-- 朱批：流行歌里引用 / 化用了这一句 -->
                  <div v-if="sungLines.get(ln.i)" class="lk-pzs">
                    <router-link v-for="q in sungLines.get(ln.i)" :key="q.n" class="lk-pz" :to="{ name: 'music', query: { song: q.n } }">
                      <span class="k">歌 · {{ REL[q.link.rel].zh }}<i>{{ REL[q.link.rel].en }}</i></span>
                      <span class="y">「{{ q.link.lyric }}」</span>
                      <span class="s">《{{ q.song.zh }}》{{ q.song.artist }} <small>{{ q.song.artistEn }}</small></span>
                      <span class="go">去听 Listen →</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 卷边钤印：意象 -->
          <div class="bian"><div class="bian-in">
            <div class="bian-t">意象 <small>Imagery</small></div>
            <button
              v-for="(im, k) in poem.imagery" :key="im.name" class="yin" :class="{ on: pop?.type === 'img' && pop.k === k }"
              @click.stop="openImg(k, $event)"
            >
              <b :class="{ w2: im.name.length > 1 }">{{ im.name }}</b>
              <span>{{ imgDict[im.name]?.en }}<em v-if="imgDict[im.name]">{{ imgDict[im.name].py }}</em></span>
            </button>
          </div></div>
        </section>
        <div class="rod"></div>
      </div>

      <!-- 题跋 -->
      <section class="tiba"><div class="tiba-in">
        <div class="tiba-hd"><span class="seal">跋</span><h2>题跋 · 解析<span>Commentary</span></h2><img class="seals" :src="motifSeals" alt="" /></div>
        <div class="two">
          <div><h3 class="colh">中文解析</h3><p class="jx-zh">{{ poem.analysis }}</p></div>
          <div><h3 class="colh"><span>In English</span></h3><p class="jx-en">{{ poem.analysisEn }}</p></div>
        </div>
        <div class="three">
          <div><h3 class="colh">作者与背景 <span>The poet &amp; the moment</span></h3><p>{{ poem.background }}</p></div>
          <div v-if="poem.pronunciation"><h3 class="colh">读音注意 <span>Pronunciation notes</span></h3><p class="zh-s">{{ poem.pronunciation }}</p></div>
          <div v-if="poem.version"><h3 class="colh">版本说明 <span>About the text</span></h3><p class="zh-s note-s">{{ poem.version }}</p></div>
        </div>
        <!-- plain text of the whole poem (copyable; also what search engines read as the text + pinyin) -->
        <details class="fulltext">
          <summary>全文 · 拼音 <span>Full text with pinyin</span></summary>
          <div v-for="(l, i) in poem.lines" :key="i" class="ft-line">
            <p class="ft-zh">{{ l.zh }}</p>
            <p class="ft-py">{{ l.py }}</p>
            <p class="ft-en">{{ l.en }}</p>
          </div>
        </details>
        <p v-if="poem.song" class="song"><b>歌曲 Song</b>{{ poem.song }}</p>
      </div></section>

      <nav class="pn-big">
        <router-link v-if="prev" :to="{ name: 'poem', params: { slug: prev.slug } }">
          <small>← 上一首 Previous</small><b>{{ prev.title }}</b><span>{{ prev.author }} · {{ prev.titleEn }}</span>
        </router-link>
        <span v-else></span>
        <router-link class="home" :to="backTo"><small>返回</small><b>朝代长卷 · {{ poem.dynasty }}</b><small>Back to the scroll</small></router-link>
        <router-link v-if="next" class="nx" :to="{ name: 'poem', params: { slug: next.slug } }">
          <small>下一首 Next →</small><b>{{ next.title }}</b><span>{{ next.author }} · {{ next.titleEn }}</span>
        </router-link>
        <span v-else></span>
      </nav>

      <!-- 约课信笺：只给未登录访客（预渲染副本也是未登录状态，会带上它） -->
      <aside v-if="isConfigured && !isLoggedIn" class="letter">
        <span class="lt-seal" aria-hidden="true">師</span>
        <div class="lt-txt">
          <h2>想有人带你读诗？<span>Read Chinese poems with a real teacher</span></h2>
          <p>拼音、意思、背后的故事，老师一句句讲给你听。</p>
          <p class="en">Pinyin, meaning and the story behind each line — explained by a full-time Chinese teacher.</p>
        </div>
        <div class="lt-btns">
          <a class="lt-main" href="https://preply.in/YIHUI7EN30094143102?ts=17938484" target="_blank" rel="noopener">在 Preply 约试听课<small>Book a trial on Preply</small></a>
          <router-link class="lt-sub" :to="{ path: '/', hash: '#book' }">认识老师<small>Meet the teacher</small></router-link>
        </div>
      </aside>

      <!-- popover：字词 / 意象 -->
      <div v-if="pop" class="pop" ref="popRef" :style="popPos" role="dialog" @click.stop>
        <button class="x" aria-label="close" @click="closePop">×</button>
        <template v-if="pop.type === 'word'">
          <div class="hd"><b>{{ popWord.w }}</b><span>{{ popWord.py }}</span></div>
          <p class="en">{{ popWord.en }}</p>
          <template v-if="popWord.note">
            <p class="en sm">古今对照 · Then &amp; now</p>
            <p>{{ popWord.note }}</p>
          </template>
          <div class="ft">
            <button @click="speak(popWord.w, { key: wordKey(popWord.w), recited: true })">{{ nowPlaying === wordKey(popWord.w) ? "⏹" : "▶" }} 听 Listen</button>
          </div>
        </template>
        <template v-else>
          <div class="hd"><b>{{ popImg.name }}</b><span v-if="imgDict[popImg.name]">{{ imgDict[popImg.name].py }} · {{ imgDict[popImg.name].en }}</span></div>
          <p class="en sm">在本诗中 · In this poem</p>
          <p>{{ popImg.zh }}</p>
          <p class="pen">{{ popImg.en }}</p>
          <div class="ft">
            <router-link :to="{ name: 'poems', query: { view: 'imagery', img: popImg.name } }">更多写「{{ popImg.name }}」的诗 · More poems with this image →</router-link>
          </div>
        </template>
      </div>
    </template>
  </main>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { loadPoemsMeta, loadPoem } from "@/data/poems";
import { applyPoemSeo } from "@/seo";
import { REL, songsOfPoem } from "@/utils/songPoems";
import { speak, speakSequence, nowPlaying, nowIndex, preload } from "@/utils/tts";
import { toneOf } from "@/utils/pinyinTones";
import { useSettings } from "@/composables/useSettings";
import { useAuth } from "@/composables/useAuth";
import { heroMain, seriesBand, motifSeals } from "@/assets/img.js";

const props = defineProps({ slug: { type: String, required: true } });
const { settings } = useSettings();
const { isConfigured, isLoggedIn } = useAuth();

const LV = { 入门: ["lv1", "Beginner"], 进阶: ["lv2", "Intermediate"], 挑战: ["lv3", "Advanced"] };
const FORM_EN = { 词: "Cí — lyric to a tune", 小令: "Xiǎolìng — short song lyric", 五言绝句: "5-character quatrain", 七言绝句: "7-character quatrain", 五言律诗: "5-character regulated verse", 七言律诗: "7-character regulated verse" };
const SWITCHES = [
  { k: "rh", zh: "节奏", en: "Rhythm" },
  { k: "py", zh: "拼音", en: "Pinyin" },
  { k: "lit", zh: "直译", en: "Literal" },
  { k: "free", zh: "意译", en: "Meaning" },
  { k: "tone", zh: "声调色", en: "Tone colors" },
];
const CN = "一二三四五六七八九十";

/* ---------- data ---------- */
const meta = ref(null);
const poem = ref(null);
const songs = ref([]); // 中国风 songs linked to this poem (music.json → utils/songPoems)
const ready = ref(false);

async function load() {
  ready.value = false;
  closePop();
  const [m, p, s] = await Promise.all([loadPoemsMeta(), loadPoem(props.slug), songsOfPoem(props.slug)]);
  meta.value = m;
  poem.value = p;
  songs.value = s;
  ready.value = true;
  applyPoemSeo(p);
  if (p) preload(p.lines.map((l) => l.zh));
  window.scrollTo(0, 0);
}

const lv = computed(() => LV[poem.value?.level] || ["lv1", ""]);
const dynEn = computed(() => meta.value?.dynasties.find((d) => d.key === poem.value?.dynasty)?.en || "");
const themeEn = computed(() => Object.fromEntries((meta.value?.themes || []).map((t) => [t.zh, t.en])));
const imgDict = computed(() => Object.fromEntries((meta.value?.imagery || []).map((t) => [t.zh, t])));
// 上一首 / 下一首：沿长卷顺序走，到了段尾接下一个朝代
const order = computed(() => meta.value?.poems || []);
const idx = computed(() => order.value.findIndex((p) => p.slug === props.slug));
const prev = computed(() => (idx.value > 0 ? order.value[idx.value - 1] : null));
const next = computed(() => (idx.value >= 0 ? order.value[idx.value + 1] || null : null));
const backTo = computed(() => ({ name: "poems", query: { at: poem.value?.dynasty } }));
const hxBg = computed(() => ({ 宋: seriesBand.survival, 元: seriesBand.zoubian }[poem.value?.dynasty] || heroMain));
// 诗词新唱 (the whole poem sung) vs. pop songs quoting / adapting one line: line index → [{n, song, link}]
const sungFull = computed(() => songs.value.filter((s) => s.link.rel === "full"));
const sungLines = computed(() => {
  const m = new Map();
  for (const s of songs.value) if (s.link.rel !== "full") m.set(s.link.line, [...(m.get(s.link.line) || []), s]);
  return m;
});
// the characters a song echoes, per line (first occurrence of each word, over Chinese characters)
const echoAt = computed(() => {
  const res = {};
  for (const [li, qs] of sungLines.value) {
    const han = [...(poem.value?.lines[li]?.zh || "")].filter((c) => /\p{Script=Han}/u.test(c)).join("");
    const set = (res[li] = new Set());
    for (const q of qs) for (const w of q.link.hl) { const at = han.indexOf(w); if (at >= 0) for (let j = 0; j < w.length; j++) set.add(at + j); }
  }
  return res;
});
const allText = computed(() => (poem.value ? poem.value.lines.map((l) => l.zh).join("") : ""));
// 字词 are recorded in this poem's voice under their own manifest key (gen_audio.py --poems)
const wordKey = (w) => `poem-${poem.value?.voice || "m"}|${w}`;

const titleParts = computed(() => {
  const m = poem.value.title.match(/^(.*?)（(.*)）$/);
  return m ? { main: m[1], sub: `（${m[2]}）` } : { main: poem.value.title, sub: "" };
});

/* ---------- layer switches (声调色 = 全站设置) ---------- */
const sw = reactive({ rh: false, py: false, lit: false, free: true });
const isOn = (k) => (k === "tone" ? settings.toneColors : sw[k]);
function toggle(k) {
  if (k === "tone") settings.toneColors = !settings.toneColors;
  else sw[k] = !sw[k];
}
const bodyCls = computed(() => ({ py: sw.py, lit: sw.lit, free: sw.free, rh: sw.rh, tone: settings.toneColors }));

/* ---------- stanzas ---------- */
const stanzas = computed(() => {
  const out = [];
  const seen = new Map();
  (poem.value?.lines || []).forEach((l, i) => {
    if (!seen.has(l.s)) { seen.set(l.s, out.length); out.push([]); }
    out[seen.get(l.s)].push({ ...l, i });
  });
  return out;
});
function stanzaLabel(si) {
  const p = poem.value;
  if (p.form.startsWith("词") && stanzas.value.length === 2) return [["上阕", "下阕"][si], ["First stanza", "Second stanza"][si]];
  if (/四言|楚辞/.test(p.form)) return [`第${CN[si] || si + 1}章`, `Stanza ${si + 1}`];
  return [`第${CN[si] || si + 1}段`, `Part ${si + 1}`];
}

/* ---------- one line: ruby + rhythm pauses + clickable words ---------- */
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const isHan = (c) => /\p{Script=Han}/u.test(c);

// each glossed word is marked once — at its first appearance in the poem (长 in 何事长向, not 人长久)
const wordMarks = computed(() => {
  const p = poem.value;
  if (!p) return [];
  const res = p.lines.map(() => ({}));
  const taken = p.lines.map(() => new Set());
  const ord = p.words.map((w, k) => k).sort((a, b) => p.words[b].w.length - p.words[a].w.length);
  for (const k of ord) {
    const w = p.words[k].w;
    for (let li = 0; li < p.lines.length; li++) {
      const han = [...p.lines[li].zh].filter(isHan).join("");
      let at = -1, from = 0;
      while ((from = han.indexOf(w, from)) >= 0) {
        let free = true;
        for (let j = 0; j < w.length; j++) if (taken[li].has(from + j)) free = false;
        if (free) { at = from; break; }
        from++;
      }
      if (at >= 0) {
        for (let j = 0; j < w.length; j++) taken[li].add(at + j);
        res[li][at] = Object.assign(res[li][at] || {}, { start: k });
        res[li][at + w.length - 1] = Object.assign(res[li][at + w.length - 1] || {}, { end: true });
        break;
      }
    }
  }
  return res;
});

const hlChars = ref(""); // 意象印章打开时，原文里对应的字标红
const lineHTML = computed(() => {
  const p = poem.value;
  if (!p) return [];
  const tone = settings.toneColors;
  // <rt> only while 拼音 is on: otherwise the static copy reads 床chuáng前qián… and search engines can't
  // find the line itself (the plain pinyin is in the 全文 block below).
  const withPy = sw.py;
  return p.lines.map((line, li) => {
    const syl = line.py.replace(/[,，.。?？!！;；:：、“”"']/g, " ").trim().split(/\s+/);
    const pauses = new Set();
    let hi = 0;
    for (const c of line.rhythm || "") { if (c === "/") pauses.add(hi - 1); else if (isHan(c)) hi++; }
    const marks = wordMarks.value[li] || {};
    const chars = [...line.zh];
    let out = '<span class="cl">', h = 0;
    chars.forEach((c, ci) => {
      if (!isHan(c)) {
        out += `<span class="punc">${esc(c)}</span>`;
        if (ci < chars.length - 1) out += '</span><span class="cl">';
        return;
      }
      const m = marks[h];
      if (m && m.start != null) out += `<span class="w" role="button" tabindex="0" data-w="${m.start}">`;
      const py = syl[h] || "";
      const hl = (hlChars.value.includes(c) ? " img-hl" : "") + (echoAt.value[li]?.has(h) ? " echo" : "");
      const rt = withPy ? `<rt${tone ? ` class="t${toneOf(py)}"` : ""}>${esc(py)}</rt>` : "";
      out += `<ruby class="ch${hl}">${esc(c)}${rt}</ruby>`;
      if (m && m.end) out += "</span>";
      if (pauses.has(h) && chars[ci + 1] && isHan(chars[ci + 1])) out += '<span class="pz" aria-hidden="true"></span>';
      h++;
    });
    return out + "</span>";
  });
});

/* ---------- popover (words + seals) ---------- */
const rootRef = ref(null), popRef = ref(null);
const pop = ref(null); // { type:'word'|'img', k, el }
const popPos = ref({});
const popWord = computed(() => (pop.value?.type === "word" ? poem.value.words[pop.value.k] : null));
const popImg = computed(() => (pop.value?.type === "img" ? poem.value.imagery[pop.value.k] : null));

function closePop() {
  pop.value?.el?.classList.remove("on");
  pop.value = null;
  hlChars.value = "";
}
function place(el) {
  nextTick(() => {
    const pe = popRef.value, root = rootRef.value;
    if (!pe || !root) return;
    const r = el.getBoundingClientRect(), rr = root.getBoundingClientRect();
    const w = pe.offsetWidth, ph = pe.offsetHeight;
    let left = r.left + r.width / 2 - w / 2;
    left = Math.max(12, Math.min(left, innerWidth - w - 12));
    let top = r.bottom + 8;
    if (r.bottom + ph + 16 > innerHeight && r.top > ph + 16) top = r.top - ph - 8;
    if (el.classList.contains("yin") && innerWidth > 900) { left = r.left - w - 14; top = r.top - 6; }
    popPos.value = { left: left - rr.left + "px", top: top - rr.top + "px" };
  });
}
function onLinesClick(e) {
  const w = e.target.closest(".w");
  if (!w) return;
  e.stopPropagation();
  const k = +w.dataset.w;
  if (pop.value?.type === "word" && pop.value.k === k) return closePop();
  closePop();
  w.classList.add("on");
  pop.value = { type: "word", k, el: w };
  place(w);
}
function openImg(k, e) {
  if (pop.value?.type === "img" && pop.value.k === k) return closePop();
  closePop();
  pop.value = { type: "img", k, el: e.currentTarget };
  hlChars.value = poem.value.imagery[k].name;
  place(e.currentTarget);
}
function onDocClick() { if (pop.value) closePop(); }
function onEsc(e) { if (e.key === "Escape") closePop(); }
// 切换 slug（上一首/下一首）时重新加载并回到顶部
watch(() => props.slug, load, { immediate: true });
onMounted(() => {
  document.addEventListener("click", onDocClick);
  document.addEventListener("keydown", onEsc);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick);
  document.removeEventListener("keydown", onEsc);
});
</script>

<style scoped>
.poem { position: relative; --kai: "Kaiti SC", "STKaiti", "KaiTi", var(--serif-cn); color: var(--body); padding-bottom: 10px; }
button { font: inherit; color: inherit; cursor: pointer; background: none; border: 0; }
a { color: inherit; text-decoration: none; }
.loading { padding: 80px 20px; text-align: center; font: 500 16px var(--serif-cn); color: var(--muted); }
.miss { margin: 80px auto; max-width: 520px; text-align: center; font: 400 16px/1.8 var(--serif-cn); color: var(--body); }
.miss .d { color: var(--gold-lt); letter-spacing: 6px; }
.miss h2 { margin: 10px 0 18px; font: 700 24px var(--serif-cn); color: var(--ink); }
.miss a { color: var(--cinnabar-dk); font-weight: 600; }

/* ---------- crumb bar ---------- */
.crumb { max-width: 1380px; margin: 0 auto; display: flex; align-items: center; gap: 14px; padding: 14px 28px 12px; font-size: 14px; }
.crumb a { display: inline-flex; align-items: center; gap: 7px; color: var(--body); }
.crumb a:hover { color: var(--cinnabar-dk); }
.crumb .back b { font: 600 14px var(--serif-cn); }
.crumb .back span { color: var(--muted); }
.crumb .pn { margin-left: auto; display: flex; gap: 6px; }
.crumb .pn a { border: 1px solid var(--line); border-radius: 999px; padding: 4px 12px; background: var(--card); font: 500 13.5px var(--serif-cn); max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; }
.crumb .pn a small { font: 600 12px var(--ui); color: var(--muted); margin-right: 4px; }
svg.i { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; flex: none; }

/* ---------- the opened scroll ---------- */
.scroll { max-width: 1380px; margin: 0 auto; padding: 0 28px; display: flex; align-items: stretch; }
.rod { flex: none; width: 24px; position: relative; border-radius: 6px; margin: -10px 0; background: linear-gradient(90deg, #4a3420, #8a6a44 35%, #a4835a 50%, #6d5032 75%, #3d2a18); box-shadow: 0 4px 12px rgba(45, 30, 10, 0.3); z-index: 2; }
.rod::before, .rod::after { content: ""; position: absolute; left: -5px; right: -5px; height: 14px; border-radius: 5px; background: linear-gradient(90deg, #5a4026, #c9a874 50%, #5a4026); }
.rod::before { top: -6px; }
.rod::after { bottom: -6px; }
.paper { position: relative; background: var(--card) url("../assets/img/texture/paper.webp"); border-top: 10px solid var(--strong); border-bottom: 10px solid var(--strong); box-shadow: inset 0 1px 0 var(--gold-lt), inset 0 -1px 0 var(--gold-lt); }

/* 引首 */
.yinshou { flex: none; width: 350px; background-color: var(--accent-soft); }
.ys-in { position: sticky; top: calc(var(--appbar-h, 69px) + 16px); padding: 34px 30px 30px 32px; display: flex; flex-direction: column; gap: 14px; }
.ys-kicker { display: flex; align-items: center; gap: 10px; font: 600 13px var(--serif-cn); color: var(--gold-deep); letter-spacing: 2px; }
.ys-kicker .seal { width: 30px; height: 30px; border-radius: 4px; background: var(--cinnabar); color: #f8e6d6; display: grid; place-items: center; font: 700 16px var(--serif-cn); letter-spacing: 0; box-shadow: inset 0 0 0 2px rgba(248, 230, 214, 0.45); }
h1.title { font: 900 46px/1.12 var(--serif-cn); color: var(--ink); letter-spacing: 4px; }
h1.title small { display: block; font: 600 22px/1.4 var(--serif-cn); color: var(--sumi); letter-spacing: 2px; margin-top: 4px; }
.t-py { font: 600 15px var(--ui); color: var(--gold-deep); letter-spacing: 0.4px; }
.t-en { font: 600 21px/1.25 var(--caps); color: var(--sumi); margin-top: -6px; }
.author { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; padding: 10px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.author b { font: 700 21px var(--serif-cn); color: var(--ink); letter-spacing: 2px; }
.author span { font: 500 14px var(--ui); color: var(--muted); }
.author em { font-style: normal; margin-left: auto; font: 600 14px var(--serif-cn); color: var(--cinnabar-dk); }
dl.meta { display: grid; grid-template-columns: auto 1fr; gap: 7px 12px; font-size: 14px; }
dl.meta dt { font: 600 13px var(--serif-cn); color: var(--muted); white-space: nowrap; padding-top: 2px; }
dl.meta dt small { font: 600 12px var(--ui); display: block; color: var(--muted-soft); }
dl.meta dd { color: var(--sumi); font: 500 15px var(--serif-cn); }
dl.meta dd i { font: 500 13px var(--ui); font-style: normal; color: var(--muted); }
.chip { display: inline-block; border: 1px solid var(--line); border-radius: 999px; padding: 1px 9px; margin: 0 4px 4px 0; font: 500 14px var(--serif-cn); background: var(--card); }
.chip i { font: 500 12.5px var(--ui); font-style: normal; color: var(--muted); }
.lv3 { background: var(--cinnabar); color: #fbf1e6; border-color: var(--cinnabar); }
dl.meta .lv3 i { color: #f3dccb; }
.lv2 { border-color: var(--accent); color: #7a560c; }
.lv1 { border-color: var(--jade); color: var(--jade); }
.daodu h2 { margin: 0 0 6px; font: 700 14px var(--serif-cn); color: var(--gold-deep); letter-spacing: 2px; }
.daodu h2 span { font: 600 15px var(--caps); letter-spacing: 0; margin-left: 4px; }
.daodu p { font: 400 16px/1.65 var(--ui); color: var(--sumi); }
.play-all { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; background: var(--cinnabar); color: #fbf1e6; border-radius: 999px; padding: 9px 18px 9px 14px; font: 600 15px var(--serif-cn); box-shadow: 0 3px 10px rgba(122, 43, 33, 0.25); }
.play-all .ic { font-size: 12px; }
.play-all small { font: 600 12.5px var(--ui); color: #f3dccb; }
.play-all.on { background: var(--cinnabar-dk); }

/* 隔水 */
.geshui { flex: none; width: 22px; background: repeating-linear-gradient(0deg, rgba(138, 124, 92, 0.08) 0 2px, transparent 2px 6px), var(--soft); border-top: 10px solid var(--strong); border-bottom: 10px solid var(--strong); border-left: 1px solid var(--border-strong); border-right: 1px solid var(--border-strong); }

/* 画心 */
.huaxin { flex: 1; min-width: 0; display: flex; overflow: hidden; }
.hx-bg { position: absolute; right: 0; top: 0; width: 78%; height: 340px; object-fit: cover; object-position: right top; opacity: 0.3; pointer-events: none; -webkit-mask-image: linear-gradient(180deg, #000 10%, transparent 95%); mask-image: linear-gradient(180deg, #000 10%, transparent 95%); }
.hx-main { position: relative; flex: 1; min-width: 0; padding: 28px 34px 40px; }
.switches { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; justify-content: center; margin-bottom: 6px; }
.sw { position: relative; display: inline-flex; align-items: baseline; gap: 5px; padding: 7px 14px 7px 24px; border: 1px solid var(--border-strong); border-radius: 3px 3px 10px 10px; background: var(--card); font: 600 15px var(--serif-cn); color: var(--body); }
.sw small { font: 600 12px var(--ui); color: var(--muted); }
.sw::before { content: ""; position: absolute; left: 10px; top: 50%; width: 7px; height: 7px; margin-top: -4px; border-radius: 50%; border: 1.5px solid var(--gold-lt); }
.sw[aria-pressed="true"] { background: var(--primary-soft); border-color: var(--cinnabar); color: var(--cinnabar-dk); }
.sw[aria-pressed="true"] small { color: var(--cinnabar); }
.sw[aria-pressed="true"]::before { background: var(--cinnabar); border-color: var(--cinnabar); }
.tip { text-align: center; font-size: 13px; color: var(--muted); margin: 8px 0 18px; }
.tip u { text-decoration: none; border-bottom: 1.5px dotted var(--accent); color: var(--sumi); font-family: var(--serif-cn); }

.stanza { position: relative; padding: 8px 0 4px 44px; }
.stanza + .stanza { margin-top: 18px; padding-top: 26px; }
.stanza + .stanza::before { content: ""; position: absolute; top: 0; left: 18%; right: 18%; height: 1px; background: linear-gradient(90deg, transparent, var(--border-strong), transparent); }
.st-label { position: absolute; left: 0; top: 14px; writing-mode: vertical-rl; font: 600 15px var(--kai); color: var(--gold-deep); letter-spacing: 4px; display: flex; align-items: center; gap: 6px; }
.stanza + .stanza .st-label { top: 32px; }
.st-label small { font: 600 12px var(--ui); letter-spacing: 1px; color: var(--muted); }
/* 一行 = 左槽（行号 + 朗读）| 分层正文（原文 → 拼音 ruby → 直译 → 意译）| 对称留白 */
.ln { position: relative; display: grid; grid-template-columns: 56px minmax(0, 1fr) 56px; align-items: start; padding: 14px 0 16px; border-radius: 10px; transition: background 0.2s; }
.ln + .ln { border-top: 1px dotted var(--line); }
.ln.playing { background: rgba(243, 225, 208, 0.7); }
.gut { display: flex; flex-direction: column; align-items: center; gap: 6px; padding-top: 12px; }
.poem.py .gut { padding-top: 30px; }
.no { font: 700 13px/1 var(--ui); color: var(--gold-lt); letter-spacing: 0.5px; font-variant-numeric: tabular-nums; }
.lp { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--line); display: grid; place-items: center; font-size: 11px; color: var(--gold-deep); background: var(--card); opacity: 0.8; transition: opacity 0.15s; }
.ln:hover .lp, .lp:focus-visible, .ln.playing .lp { opacity: 1; border-color: var(--cinnabar); color: var(--cinnabar); }
.body { text-align: center; min-width: 0; }
.zh { font: 500 34px/1.5 var(--serif-cn); color: var(--ink); letter-spacing: 3px; }
.zh :deep(.cl) { display: inline-block; white-space: nowrap; }
.zh :deep(ruby) { ruby-position: over; ruby-align: center; }
.zh :deep(rt) { font: 600 14px/1.2 var(--ui); color: var(--gold-deep); letter-spacing: 0; padding: 0 0.2em 3px; display: none; }
.poem.py .zh :deep(rt) { display: ruby-text; }
.poem.py .zh { line-height: 1.85; }
.zh :deep(.punc) { color: var(--muted); letter-spacing: 0; }
.zh :deep(.pz) { display: none; width: 2px; height: 0.62em; margin: 0 0.22em 0 0.08em; background: var(--cinnabar); transform: skewX(-20deg); vertical-align: baseline; opacity: 0.85; }
.poem.rh .zh :deep(.pz) { display: inline-block; }
.zh :deep(.w) { cursor: pointer; border-radius: 4px; text-decoration: underline dotted var(--accent); text-decoration-thickness: 2px; text-underline-offset: 7px; }
.zh :deep(.w rt) { text-decoration: none; }
.zh :deep(.w:hover), .zh :deep(.w.on) { background: var(--accent-soft); }
.zh :deep(.ch.img-hl) { color: var(--cinnabar); }
/* 层：直译 = 小一号 斜体衬线 灰褐；意译 = 正常色 Nunito。层距固定，层名小签只在两层同开时出现 */
.tr { display: none; margin: 8px auto 0; max-width: 660px; }
.tr.lit { font: italic 500 17px/1.45 var(--caps); color: var(--muted); }
.tr.free { font: 400 17px/1.5 var(--ui); color: var(--sumi); }
.tr b { display: none; vertical-align: 2px; margin-right: 8px; padding: 1px 6px; border-radius: 3px; font: 700 11px/1.5 var(--serif-cn); font-style: normal; letter-spacing: 1px; }
.tr b small { font: 700 10px var(--ui); letter-spacing: 0.5px; margin-left: 3px; text-transform: uppercase; }
.tr.lit b { color: var(--muted); box-shadow: inset 0 0 0 1px var(--line); }
.tr.free b { color: var(--cinnabar-dk); box-shadow: inset 0 0 0 1px rgba(163, 63, 46, 0.4); }
.poem.free .tr.free, .poem.lit .tr.lit { display: block; }
.poem.lit.free .tr b { display: inline-block; }
.poem.py .tr { margin-top: 6px; }

/* 朱批：歌里引用 / 化用了这一句（定稿 A，样稿 design-demos/poetry/link/A-poem.html） */
.lk-notes .ln { grid-template-columns: 56px minmax(0, 1fr) 206px; }
.lk-pzs { grid-column: 3; grid-row: 1; align-self: center; display: flex; flex-direction: column; gap: 8px; margin-left: 6px; }
.lk-pz { display: block; padding: 8px 10px 9px 12px; border-left: 1.5px solid var(--cinnabar); border-radius: 0 8px 8px 0; text-align: left; transition: background 0.15s; }
.lk-pz:hover { background: rgba(243, 225, 208, 0.7); }
.lk-pz .k { display: flex; align-items: center; gap: 6px; font: 700 12px var(--serif-cn); color: var(--cinnabar-dk); letter-spacing: 1px; }
.lk-pz .k i { font: 700 10.5px var(--ui); font-style: normal; letter-spacing: 0.6px; text-transform: uppercase; color: var(--muted); }
.lk-pz .y { display: block; margin: 4px 0 3px; font: 600 16px/1.35 var(--serif-cn); color: var(--cinnabar); }
.lk-pz .s { display: block; font: 500 13px/1.4 var(--han); color: var(--body); }
.lk-pz .s small { font: 600 12px var(--ui); color: var(--muted); }
.lk-pz .go { display: block; margin-top: 3px; font: 700 12px var(--ui); color: var(--cinnabar-dk); }
.zh :deep(.ch.echo) { color: var(--cinnabar); background: linear-gradient(transparent 82%, rgba(163, 63, 46, 0.28) 82%); }
/* 引首：这首诗被谱成了歌 */
.lk-sung { margin-top: 6px; padding-top: 16px; border-top: 1px dashed var(--border-strong); }
.lk-sung h3 { display: flex; align-items: baseline; gap: 8px; font: 700 16px var(--serif-cn); color: var(--ink); letter-spacing: 1px; }
.lk-sung h3 span { font: 600 15px var(--caps); color: var(--gold-deep); letter-spacing: 0; }
.lk-mnt { position: relative; display: block; margin: 10px 0 8px; padding: 6px; background: var(--paper-2); border: 1px solid var(--border-strong); border-radius: 3px; box-shadow: inset 0 0 0 3px var(--paper-2), inset 0 0 0 4px var(--gold-lt); }
.lk-mnt .im { position: relative; display: block; aspect-ratio: 16 / 9; overflow: hidden; background: var(--sumi); }
.lk-mnt img { width: 100%; height: 100%; object-fit: cover; filter: sepia(0.28) saturate(0.85) brightness(0.96); transition: filter 0.25s; }
.lk-mnt:hover img { filter: none; }
.lk-mnt .pl { position: absolute; left: 50%; top: 50%; width: 50px; height: 50px; border-radius: 7px; transform: translate(-50%, -50%) rotate(-4deg); background: var(--cinnabar); display: grid; place-items: center;
  box-shadow: inset 0 0 0 2px rgba(251, 233, 214, 0.55), inset 0 0 0 3px var(--cinnabar), 0 6px 16px rgba(42, 36, 26, 0.35); }
.lk-mnt .pl::before { content: ""; margin-left: 4px; border-left: 15px solid #fbe9d6; border-top: 9px solid transparent; border-bottom: 9px solid transparent; }
.lk-sung .who { font: 600 17px var(--serif-cn); color: var(--ink); }
.lk-sung .who small { margin-left: 6px; font: 600 13px var(--ui); color: var(--muted); }
.lk-sung p { margin-top: 4px; font: 400 13.5px/1.55 var(--ui); color: var(--body); }
.lk-sung .go { display: inline-block; margin-top: 8px; font: 700 13px var(--han); color: var(--cinnabar-dk); border-bottom: 1px solid rgba(163, 63, 46, 0.4); }
.lk-sung .go small { font: 600 12px var(--ui); color: var(--muted); }

/* 卷边钤印 */
.bian { flex: none; width: 112px; position: relative; border-left: 1px dashed var(--line); padding: 28px 0 20px; }
.bian-in { position: sticky; top: calc(var(--appbar-h, 69px) + 24px); display: flex; flex-direction: column; align-items: center; gap: 18px; }
.bian-t { writing-mode: vertical-rl; font: 600 14px var(--kai); color: var(--gold-deep); letter-spacing: 4px; }
.bian-t small { font: 600 12px var(--ui); letter-spacing: 1px; color: var(--muted); }
.yin { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.yin b { width: 58px; height: 58px; display: grid; place-items: center; border-radius: 5px; background: var(--cinnabar); color: #f8e6d6; font: 400 32px/1 var(--brush); box-shadow: inset 0 0 0 3px rgba(248, 230, 214, 0.5), 0 2px 6px rgba(122, 43, 33, 0.25); transition: transform 0.15s; }
.yin:nth-child(odd) b { transform: rotate(-3deg); }
.yin:nth-child(even) b { transform: rotate(2.5deg); }
.yin b.w2 { font: 700 17px/1.05 var(--serif-cn); text-align: center; }
.yin:hover b, .yin.on b { transform: rotate(0) scale(1.06); }
.yin span { font: 600 13px var(--caps); color: var(--gold-deep); text-align: center; }
.yin span em { font: 600 12px var(--ui); font-style: normal; color: var(--muted); display: block; text-align: center; }

/* popover */
.pop { position: absolute; z-index: 60; width: 300px; background: var(--card); border: 1px solid var(--border-strong); border-radius: 10px; box-shadow: var(--sh-pop); padding: 14px 16px; }
.pop .hd { display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px; padding-right: 20px; }
.pop .hd b { font: 700 26px var(--serif-cn); color: var(--ink); letter-spacing: 2px; }
.pop .hd span { font: 600 15px var(--ui); color: var(--gold-deep); }
.pop .en { font: 600 17px/1.35 var(--caps); color: var(--sumi); margin: 0 0 6px; }
.pop .en.sm { font-size: 15px; color: var(--muted); }
.pop p { margin: 0 0 6px; font: 400 14.5px/1.7 var(--serif-cn); color: var(--body); }
.pop p.pen { font: 400 14.5px/1.55 var(--ui); }
.pop .ft { display: flex; gap: 10px; align-items: center; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--line); font-size: 13px; }
.pop .ft button, .pop .ft a { display: inline-flex; align-items: center; gap: 5px; color: var(--cinnabar-dk); font-weight: 700; }
.pop .ft span { color: var(--muted); }
.pop .x { position: absolute; right: 8px; top: 6px; font-size: 18px; color: var(--muted); padding: 2px 6px; }

/* ---------- 题跋 colophon ---------- */
.fulltext { margin-top: 22px; border-top: 1px dashed var(--line); padding-top: 14px; }
.fulltext summary { cursor: pointer; font: 700 16px var(--serif-cn); color: var(--ink); letter-spacing: 2px; }
.fulltext summary span { font: 600 15px var(--caps); color: var(--gold-deep); letter-spacing: 0; margin-left: 6px; }
.ft-line { margin-top: 12px; }
.ft-zh { font: 600 18px/1.5 var(--serif-cn); color: var(--ink); letter-spacing: .06em; }
.ft-py { font: 600 13.5px/1.5 var(--ui); color: var(--gold-deep); }
.ft-en { font: 400 14px/1.5 var(--ui); color: var(--body); }
.tiba { max-width: 1380px; margin: 34px auto 0; padding: 0 28px; }
.tiba-in { background: var(--card) url("../assets/img/texture/paper.webp"); border: 1px solid var(--line); border-top: 10px solid var(--strong); padding: 34px 48px 30px; position: relative; }
.tiba-hd { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
.tiba-hd .seal { width: 40px; height: 40px; border-radius: 4px; display: grid; place-items: center; font: 700 20px var(--serif-cn); color: var(--cinnabar); box-shadow: inset 0 0 0 2px var(--cinnabar); transform: rotate(-2deg); }
.tiba-hd h2 { font: 700 26px var(--serif-cn); color: var(--ink); letter-spacing: 3px; }
.tiba-hd h2 span { font: 600 21px var(--caps); color: var(--gold-deep); letter-spacing: 0; margin-left: 8px; }
.tiba .seals { margin-left: auto; width: 64px; opacity: 0.6; }
.two { display: grid; grid-template-columns: 1fr 1fr; }
.two > div { padding: 0 34px; }
.two > div:first-child { padding-left: 0; border-right: 1px solid var(--line); }
.two > div:last-child { padding-right: 0; }
.colh { font: 700 13px var(--serif-cn); color: var(--gold-deep); letter-spacing: 2px; margin: 0 0 10px; }
.colh span { font: 600 14px var(--caps); letter-spacing: 0.3px; }
.jx-zh { font: 400 17px/2 var(--serif-cn); color: var(--sumi); text-align: justify; }
.jx-en { font: 400 16px/1.75 var(--ui); color: var(--sumi); }
.three { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 34px; margin-top: 30px; padding-top: 24px; border-top: 1px dashed var(--border-strong); }
.three p { font: 400 15px/1.7 var(--ui); color: var(--body); }
.three p.zh-s { font: 400 14.5px/1.85 var(--serif-cn); }
.three p.note-s { font-size: 13.5px; color: var(--muted); }
.song { margin-top: 20px; font: 400 15px/1.7 var(--serif-cn); color: var(--body); }
.song b { font: 700 13px var(--serif-cn); color: var(--gold-deep); margin-right: 10px; }

.pn-big { max-width: 1380px; margin: 22px auto 60px; padding: 0 28px; display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: stretch; }
.pn-big a { display: flex; flex-direction: column; gap: 2px; padding: 14px 20px; border: 1px solid var(--line); background: var(--card); border-radius: 10px; }
.pn-big a:hover { border-color: var(--border-strong); box-shadow: var(--sh-card); }
.pn-big a small { font: 600 12.5px var(--ui); color: var(--muted); }
.pn-big a b { font: 700 19px var(--serif-cn); color: var(--ink); }
.pn-big a span { font: 600 15px var(--caps); color: var(--gold-deep); }
.pn-big .nx { text-align: right; }
.pn-big .home { justify-content: center; align-items: center; text-align: center; background: var(--sumi); border-color: var(--sumi); }
.pn-big .home b { color: var(--canvas); font-size: 16px; }
.pn-big .home small { color: var(--line); }

/* 约课信笺：卷尾一张信笺，朱红主按钮 + 次按钮 */
.letter { position: relative; max-width: 980px; margin: -24px auto 64px; padding: 26px 34px 24px 92px; display: flex; align-items: center; gap: 28px; background: #fbf3e6 url("../assets/img/texture/paper.webp"); border: 1px solid var(--line); border-radius: 3px; box-shadow: inset 0 0 0 4px #fbf3e6, inset 0 0 0 5px rgba(163, 63, 46, 0.22); background-image: repeating-linear-gradient(180deg, transparent 0 31px, rgba(163, 63, 46, 0.07) 31px 32px), url("../assets/img/texture/paper.webp"); }
.lt-seal { position: absolute; left: 30px; top: 28px; width: 40px; height: 40px; border-radius: 4px; display: grid; place-items: center; font: 400 24px/1 var(--brush); color: var(--cinnabar); box-shadow: inset 0 0 0 2px var(--cinnabar); transform: rotate(-4deg); }
.lt-txt { flex: 1; min-width: 0; }
.letter h2 { font: 700 21px/1.4 var(--serif-cn); color: var(--ink); letter-spacing: 2px; }
.letter h2 span { display: block; font: 600 17px var(--caps); color: var(--gold-deep); letter-spacing: 0; }
.letter p { margin-top: 8px; font: 400 15.5px/1.75 var(--serif-cn); color: var(--sumi); }
.letter p.en { margin-top: 2px; font: 400 14.5px/1.6 var(--ui); color: var(--body); }
.lt-btns { flex: none; display: flex; flex-direction: column; gap: 10px; }
.lt-btns a { display: flex; flex-direction: column; align-items: center; padding: 8px 20px; border-radius: 999px; font: 600 15px/1.3 var(--serif-cn); text-align: center; }
.lt-btns small { font: 600 12px var(--ui); }
.lt-main { background: var(--cinnabar); color: #fbf1e6; box-shadow: 0 3px 10px rgba(122, 43, 33, 0.22); }
.lt-main small { color: #f3dccb; }
.lt-main:hover { background: var(--cinnabar-dk); }
.lt-sub { border: 1px solid var(--border-strong); background: var(--card); color: var(--cinnabar-dk); }
.lt-sub small { color: var(--muted); }
.lt-sub:hover { background: var(--primary-soft); }

/* ---------- mobile ---------- */
@media (max-width: 900px) {
  .crumb { padding: 12px 14px; flex-wrap: wrap; }
  .crumb .pn { margin-left: 0; width: 100%; }
  .crumb .pn a { flex: 1; max-width: none; }
  .scroll { flex-direction: column; padding: 0 10px; }
  .rod { width: auto; height: 22px; margin: 0 -3px; background: linear-gradient(180deg, #4a3420, #8a6a44 35%, #a4835a 50%, #6d5032 75%, #3d2a18); }
  .rod::before, .rod::after { top: -4px; bottom: -4px; height: auto; width: 14px; left: auto; right: auto; background: linear-gradient(180deg, #5a4026, #c9a874 50%, #5a4026); }
  .rod::before { left: -4px; }
  .rod::after { right: -4px; }
  .paper { border-top: 0; border-bottom: 0; border-left: 8px solid var(--strong); border-right: 8px solid var(--strong); box-shadow: inset 1px 0 0 var(--gold-lt), inset -1px 0 0 var(--gold-lt); }
  .yinshou { width: auto; }
  .ys-in { position: static; padding: 24px 18px; gap: 12px; }
  h1.title { font-size: 38px; }
  dl.meta { display: flex; flex-wrap: wrap; gap: 6px; }
  dl.meta dt { display: none; }
  dl.meta dd { display: contents; }
  dl.meta dd > i { display: none; }
  dl.meta dd.dd-tune { display: none; }
  .stanza { padding-left: 0; }
  .tiba .seals { display: none; }
  .geshui { width: auto; height: 18px; border: 0; border-left: 8px solid var(--strong); border-right: 8px solid var(--strong); border-top: 1px solid var(--border-strong); border-bottom: 1px solid var(--border-strong); }
  .huaxin { flex-direction: column-reverse; }
  .hx-main { padding: 16px 8px 30px; }
  .hx-bg { width: 100%; height: 220px; }
  .bian { width: auto; border-left: 0; border-bottom: 1px dashed var(--line); padding: 14px 10px; }
  .bian-in { position: static; flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 16px; }
  .bian-t { writing-mode: horizontal-tb; }
  .bian-t small { display: block; }
  .yin b { width: 48px; height: 48px; font-size: 26px; }
  .sw { padding: 6px 10px 6px 21px; font-size: 14px; }
  .sw::before { left: 8px; }
  .st-label { position: static; writing-mode: horizontal-tb; justify-content: center; margin-bottom: 4px; font-size: 14px; }
  .stanza + .stanza .st-label { top: auto; }
  .ln, .lk-notes .ln { grid-template-columns: 34px minmax(0, 1fr); padding: 10px 0 12px; }
  .lk-pzs { grid-column: 2; grid-row: auto; align-items: center; margin: 10px 0 0; }
  .lk-pz { max-width: 300px; }
  .gut { gap: 5px; padding-top: 6px; }
  .poem.py .gut { padding-top: 22px; }
  .lp { width: 28px; height: 28px; opacity: 0.9; }
  .zh { font-size: 25px; letter-spacing: 1px; }
  .zh :deep(rt) { font-size: 12px; }
  .tr { padding-right: 6px; }
  .tr.lit, .tr.free { font-size: 16px; }
  .tiba { padding: 0 10px; }
  .tiba-in { padding: 22px 18px; }
  .two, .three { grid-template-columns: 1fr; gap: 22px; }
  .two > div { padding: 0 !important; border: 0 !important; }
  .pn-big { grid-template-columns: 1fr 1fr; padding: 0 10px; }
  .pn-big .home { grid-column: 1 / -1; order: 3; }
  .pop { width: auto; left: 12px !important; right: 12px; }
  .letter { margin: -30px 10px 48px; padding: 22px 18px 20px; flex-direction: column; align-items: stretch; gap: 16px; }
  .lt-seal { position: static; margin-bottom: -6px; }
}
</style>
