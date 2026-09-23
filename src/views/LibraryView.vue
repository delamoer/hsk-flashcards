<template>
  <div class="home">
    <!-- 两侧竖排闲章 (wide screens only) -->
    <div class="side left" aria-hidden="true">
      <img class="seal-mark" :src="motifSeals" alt="" />
      <div class="vtext">语言通世界</div>
      <div class="vtext soft">文化连心</div>
    </div>
    <div class="side right" aria-hidden="true">
      <div class="vtext">山水有相逢</div>
      <div class="vtext soft">文字见天地</div>
      <img class="seal-mark" :src="motifSeals" alt="" />
    </div>

    <div class="home-main">
      <!-- ── Hero 通栏山水 ───────────────────────────── -->
      <section class="hero">
        <div class="hero-bg" :style="{ backgroundImage: `url(${heroMain})` }"></div>
        <div class="hero-scrim"></div>
        <img class="m-plum" :src="motifPlum" alt="" />
        <img class="m-birds" :src="motifCranes" alt="" />
        <img class="m-boat" :src="motifBoat" alt="" />
        <div class="hero-inner">
          <div class="brand-seal">学</div>
          <div class="kicker">Learn Chinese · Explore a Richer World</div>
          <h1>学中文，<br class="brk" />遇见更广阔的世界</h1>
          <div class="en-title">LEARN CHINESE · EXPLORE A RICHER WORLD</div>
          <div class="rule"><span class="diamond">◇</span></div>
          <p class="cn-sub">从语言出发，走进文化，连接更大的世界</p>
          <p class="en-sub">Start with language, explore a deeper culture, and connect to a bigger world.</p>
        </div>
      </section>

      <!-- ── 01 教材 ─────────────────────────────────── -->
      <section class="sec s-books">
        <div class="sec-bg is-band" :style="bandPanel(seriesBand.hsk)" aria-hidden="true"></div>
        <img class="sec-motif cranes" :src="motifCranes" alt="" aria-hidden="true" />
        <div class="sec-side">
          <div class="num">01</div>
          <div class="sec-title">教材<span class="en">TEXTBOOKS</span></div>
          <p class="sec-desc">选择适合你的中文学习教材<span class="en">Choose the right Chinese textbook — find the best learning path.</span></p>
          <router-link class="sec-cta" to="/courses">浏览教材 Browse <span class="ar">→</span></router-link>
        </div>
        <div class="books-scroll">
          <div class="books-track">
            <div
              v-for="s in seriesList"
              :key="s.id"
              class="book"
              :style="{ '--sc': s.seriesColor }"
              role="link"
              tabindex="0"
              @click="pick(s)"
              @keyup.enter="pick(s)"
            >
              <div class="cover"><img :src="bookCover[s.id]" :alt="s.heroTitle" loading="lazy" /></div>
              <div class="band">
                <span class="bseal">{{ s.seal.cn }}</span>
                <span class="btxt"><b>{{ s.heroTitle }}</b><i>{{ s.nameEn }}</i></span>
              </div>
            </div>
          </div>
        </div>
        <aside class="sec-list">
          <div class="list-scroll">
            <router-link v-for="s in seriesList" :key="s.id" class="li" :to="s.single ? `/course/${s.id}/${s.units[0].id}` : `/course/${s.id}`">
              <span class="dot" :style="{ background: s.seriesColor }"></span>
              <span class="lz">{{ s.heroTitle }}</span>
              <span class="le">{{ s.nameEn }}</span>
            </router-link>
          </div>
        </aside>
      </section>

      <!-- ── 02 拼音 ─────────────────────────────────── -->
      <section class="sec s-media">
        <div class="sec-bg is-band" :style="bandPanel(seriesBand.newhsk3)" aria-hidden="true"></div>
        <img class="sec-motif cloud" :src="motifCloud" alt="" aria-hidden="true" />
        <div class="sec-side">
          <div class="num">02</div>
          <div class="sec-title">拼音<span class="en">PINYIN</span></div>
          <p class="sec-desc">掌握发音基础，开启中文之旅<span class="en">Master pronunciation — initials, finals and tones.</span></p>
          <router-link class="sec-cta" to="/pinyin">开始学习 Start <span class="ar">→</span></router-link>
        </div>
        <div class="preview">
          <div class="py-tabs"><b class="on">声母 Initials</b><b>韵母 Finals</b><b>声调 Tones</b></div>
          <div class="py-body">
            <div class="py-big">
              <div class="syl">ā</div>
              <span class="sound">🔊</span>
              <div class="lbl">一声 · High &amp; level</div>
            </div>
            <div class="py-grid">
              <span v-for="k in initials" :key="k">{{ k }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 03 我的词 ───────────────────────────────── -->
      <section class="sec s-media">
        <div class="sec-bg is-band" :style="bandPanel(seriesBand.huihua360)" aria-hidden="true"></div>
        <img class="sec-motif plum" :src="motifPlum2" alt="" aria-hidden="true" />
        <div class="sec-side">
          <div class="num">03</div>
          <div class="sec-title">我的词<span class="en">MY WORDS</span></div>
          <p class="sec-desc">记录生词，积累属于你的中文世界<span class="en">Build your personal vocabulary, one word at a time.</span></p>
          <router-link class="sec-cta" to="/my-words">进入我的词 Open <span class="ar">→</span></router-link>
        </div>
        <div class="preview mw-preview">
          <div class="mw-notebook">
            <div class="nb-head">我的词本 <span>My Words</span><router-link class="more" to="/my-words">查看全部 →</router-link></div>
            <div class="nb-rows">
              <div v-for="w in sampleWords" :key="w.zh" class="nb-row">
                <span class="star">★</span>
                <b class="zh">{{ w.zh }}</b>
                <span class="py">{{ w.py }}</span>
                <span class="en">{{ w.en }}</span>
              </div>
            </div>
          </div>
          <div class="mw-review">
            <div class="rv-head">今日复习 <span>Review</span><em>5 / 10</em></div>
            <div class="rv-card">
              <div class="rv-zh">学习</div>
              <div class="rv-py">xué xí</div>
              <div class="rv-en">to study</div>
              <span class="rv-btn">认识了 ✓</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 远山地平线 + 前景山石 ─────────────────────── -->
      <div class="foot-scene" aria-hidden="true">
        <div class="foot-hills" :style="bg(motifMountainFar)"></div>
        <img class="m-rock" :src="motifRock" alt="" />
      </div>

      <!-- ── 页脚 ────────────────────────────────────── -->
      <footer class="home-foot">
        <div class="foot-brand"><span class="fmark">学</span> 学中文 <i>Learn Chinese</i></div>
        <div class="foot-tag">中文连接你我与更广阔的世界 · Chinese bridges hearts and opens new horizons</div>
        <div class="foot-links"><span>关于我们</span><span>使用帮助</span><span>联系我们</span></div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { courseRegistry } from "@/data";
import { heroMain, bookCover, seriesBand, motifPlum, motifPlum2, motifCloud, motifCranes, motifSeals, motifMountainFar, motifBoat, motifRock } from "@/assets/img.js";

const router = useRouter();
const seriesList = courseRegistry;

// 整块面板嵌入 band 山水：左浓右淡横向 scrim（护文字）+ 顶底轻纱，图在最底。
function bandPanel(img) {
  return {
    backgroundImage:
      `linear-gradient(90deg, rgba(249,243,232,.93) 0%, rgba(249,243,232,.78) 34%, rgba(249,243,232,.5) 72%, rgba(249,243,232,.4) 100%),` +
      `linear-gradient(180deg, rgba(249,243,232,.28), rgba(243,234,216,.5)),` +
      `url(${img})`,
    backgroundSize: "cover, cover, cover",
    backgroundPosition: "center, center, center",
    backgroundRepeat: "no-repeat",
  };
}

const initials = ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s", "y", "w"];
const sampleWords = [
  { zh: "你好", py: "nǐ hǎo", en: "hello" },
  { zh: "学习", py: "xué xí", en: "to study" },
  { zh: "中国", py: "zhōng guó", en: "China" },
  { zh: "朋友", py: "péng you", en: "friend" },
  { zh: "文化", py: "wén huà", en: "culture" },
];

function pick(s) {
  if (s.single) router.push(`/course/${s.id}/${s.units[0].id}`);
  else router.push(`/course/${s.id}`);
}
function bg(img) {
  return { backgroundImage: `url(${img})` };
}
</script>

<style scoped>
.home { position: relative; }
.home-main { max-width: 1180px; margin: 0 auto; padding: 0 32px 0; }

/* 两侧竖排闲章 */
.side { position: absolute; top: 40px; width: 96px; display: flex; flex-direction: column; align-items: center; gap: 18px; pointer-events: none; z-index: 2; }
.side.left { left: max(12px, calc((100% - 1180px) / 2 - 104px)); }
.side.right { right: max(12px, calc((100% - 1180px) / 2 - 104px)); }
.side .vtext { writing-mode: vertical-rl; font-family: "Ma Shan Zheng", var(--serif-cn); font-size: 24px; letter-spacing: 6px; color: var(--gold-deep); opacity: .85; }
.side .vtext.soft { color: var(--muted); opacity: .6; font-size: 20px; }
.side .seal-mark { width: 42px; opacity: .6; mix-blend-mode: multiply; }
@media (max-width: 1360px) { .side { display: none; } }

/* ── Hero ─────────────────────────────── */
.hero { position: relative; margin: 18px 0 8px; border-radius: 16px; overflow: hidden; min-height: 340px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--line); box-shadow: 0 14px 40px -22px rgba(45,30,10,.5); }
.hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center 38%; }
.hero-scrim { position: absolute; inset: 0; background: radial-gradient(120% 90% at 50% 40%, rgba(250,244,233,.5), rgba(250,244,233,.78) 70%, rgba(245,235,214,.9)); }
.m-plum { position: absolute; top: -10px; left: -14px; width: 210px; z-index: 2; opacity: .95; transform: rotate(4deg); pointer-events: none; filter: drop-shadow(0 6px 10px rgba(45,30,10,.18)); }
.m-birds { position: absolute; top: 26px; right: 40px; width: 120px; z-index: 2; opacity: .7; mix-blend-mode: multiply; pointer-events: none; }
.m-boat { position: absolute; bottom: 20px; left: 8%; width: 128px; z-index: 2; opacity: .82; mix-blend-mode: multiply; pointer-events: none; }
@media (max-width: 720px) { .m-boat { display: none; } }
.hero-inner { position: relative; z-index: 3; text-align: center; padding: 44px 24px; }
.brand-seal { width: 60px; height: 60px; margin: 0 auto 16px; border-radius: 10px; background: linear-gradient(145deg, var(--seal-a), var(--seal-b)); color: #fbe7d4; font-family: var(--serif-cn); font-weight: 900; font-size: 34px; display: grid; place-items: center; position: relative; box-shadow: inset 0 0 0 2px rgba(251,231,212,.5), 0 0 0 2px var(--gold), 0 4px 10px rgba(139,42,31,.35); }
.brand-seal::after { content: ""; position: absolute; inset: 6px; border: 1px solid rgba(251,231,212,.35); border-radius: 5px; }
.kicker { font-family: var(--caps); font-size: 12px; letter-spacing: 5px; color: var(--gold-deep); text-transform: uppercase; }
.hero h1 { font-family: var(--brush); font-weight: 400; font-size: 60px; line-height: 1.12; letter-spacing: 3px; color: var(--sumi); margin: 10px 0 6px; text-shadow: 0 1px 0 rgba(255,255,255,.5); }
.en-title { font-family: var(--caps); font-size: 12px; letter-spacing: 4px; color: var(--gold-deep); }
.rule { display: flex; align-items: center; gap: 14px; color: var(--gold); max-width: 260px; margin: 16px auto; }
.rule::before, .rule::after { content: ""; height: 1px; flex: 1; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.diamond { font-size: 11px; }
.cn-sub { font-family: var(--serif-cn); font-size: 18px; letter-spacing: 2px; color: var(--ink-soft, #4a3d2a); }
.en-sub { font-family: var(--serif-en); font-style: italic; font-size: 15px; color: var(--muted); margin-top: 3px; }
.brk { display: none; }

/* ── Section 卡片面板 ─────────────────── */
.sec { position: relative; margin: 26px 0; border-radius: 16px; border: 1px solid var(--line); background: linear-gradient(165deg, #fbf7ee, #f3ead9); box-shadow: 0 16px 38px -24px rgba(45,30,10,.55); overflow: hidden; display: grid; align-items: stretch; }
.sec.s-books { grid-template-columns: 236px 1fr 214px; }
.sec.s-media { grid-template-columns: 236px minmax(0, 1fr); }
.sec > *:not(.sec-bg):not(.sec-motif) { position: relative; z-index: 1; }
/* 整块面板嵌入的 band 山水（scrim 已在内联渐变里，护住文字） */
.sec-bg { position: absolute; inset: 0; z-index: 0; background-size: contain; background-position: right center; background-repeat: no-repeat; opacity: .08; mix-blend-mode: multiply; pointer-events: none; -webkit-mask-image: linear-gradient(90deg, transparent, #000 72%); mask-image: linear-gradient(90deg, transparent, #000 72%); }
.sec-bg.is-band { opacity: 1; background-size: cover; background-position: center; mix-blend-mode: normal; -webkit-mask-image: none; mask-image: none; }
/* 浮于面板的母题（云 / 梅枝 / 仙鹤），填补右侧留白 */
.sec-motif { position: absolute; z-index: 1; mix-blend-mode: multiply; pointer-events: none; filter: drop-shadow(0 5px 10px rgba(45,30,10,.16)); }
.sec-motif.cranes { top: 16px; right: 22px; width: 150px; opacity: .6; }
.sec-motif.cloud { top: 18px; right: 24px; width: 200px; opacity: .72; }
.sec-motif.plum { bottom: -8px; right: 8px; width: 176px; opacity: .8; }
@media (max-width: 720px) { .sec-motif { display: none; } }

.sec-side { align-self: center; padding: 30px 22px 30px 30px; }
.num { font-family: var(--caps); font-size: 40px; font-weight: 700; color: var(--gold-lt); line-height: 1; letter-spacing: 2px; }
.sec-title { font-family: var(--brush); font-weight: 400; font-size: 40px; letter-spacing: 2px; color: var(--sumi); margin-top: 4px; }
.sec-title .en { display: block; font-family: var(--caps); font-size: 12px; letter-spacing: 4px; color: var(--gold-deep); font-weight: 500; margin-top: 3px; }
.sec-desc { font-family: var(--serif-cn); font-size: 14.5px; line-height: 1.6; color: var(--ink-soft, #4a3d2a); margin: 14px 0 18px; }
.sec-desc .en { display: block; font-family: var(--serif-en); font-style: italic; font-size: 12.5px; color: var(--muted); margin-top: 4px; letter-spacing: .2px; }
.sec-cta { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(145deg, var(--cinnabar), var(--cinnabar-dk)); color: #fbeecf; font-family: var(--serif-cn); font-weight: 600; font-size: 14px; letter-spacing: 1px; padding: 9px 18px; border-radius: 7px; box-shadow: 0 4px 10px -4px rgba(139,42,31,.5); transition: .2s; }
.sec-cta .ar { transition: transform .2s; }
.sec-cta:hover { transform: translateY(-1px); box-shadow: 0 7px 16px -6px rgba(139,42,31,.55); }
.sec-cta:hover .ar { transform: translateX(3px); }

/* 01 教材 —— 书封横向滚动 + 右列纵向滚动 */
.books-scroll { align-self: center; overflow-x: auto; overflow-y: hidden; padding: 26px 8px 26px 0; -webkit-overflow-scrolling: touch; scrollbar-width: thin; }
.books-track { display: flex; gap: 16px; width: max-content; }
.book { flex: 0 0 148px; cursor: pointer; border-radius: 4px 8px 8px 4px; overflow: hidden; background: var(--paper); border: 1px solid var(--line); box-shadow: 0 8px 20px -12px rgba(45,30,10,.4); transition: transform .28s cubic-bezier(.2,.7,.3,1), box-shadow .28s; }
.book:hover { transform: translateY(-6px); box-shadow: 0 18px 32px -16px rgba(45,30,10,.5); }
.book .cover { aspect-ratio: 3 / 4; overflow: hidden; position: relative; }
.book .cover::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 8px; z-index: 2; background: linear-gradient(90deg, rgba(0,0,0,.28), rgba(255,255,255,.14)); }
.book .cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.book .band { display: flex; align-items: center; gap: 8px; padding: 9px 10px; background: linear-gradient(145deg, var(--sc), color-mix(in srgb, var(--sc) 65%, #000)); color: #fff8ec; }
.book .bseal { flex: 0 0 auto; width: 24px; height: 24px; border-radius: 5px; display: grid; place-items: center; font-family: var(--serif-cn); font-weight: 900; font-size: 14px; background: rgba(255,248,236,.16); box-shadow: inset 0 0 0 1px rgba(255,248,236,.5); }
.book .btxt { min-width: 0; line-height: 1.15; }
.book .btxt b { font-family: var(--serif-cn); font-weight: 700; font-size: 13px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.book .btxt i { font-family: var(--serif-en); font-style: italic; font-size: 10px; opacity: .9; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.sec-list { align-self: stretch; border-left: 1px solid var(--line-soft); padding: 22px 22px 22px 20px; background: linear-gradient(90deg, rgba(250,245,236,.3), rgba(250,245,236,.72)); }
.list-scroll { max-height: 244px; overflow-y: auto; scrollbar-width: thin; }
.sec-list .li { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 6px 9px; padding: 9px 4px 9px 0; border-bottom: 1px dashed var(--line-soft); transition: .2s; }
.sec-list .li:last-child { border-bottom: none; }
.sec-list .li:hover { padding-left: 4px; }
.sec-list .li:hover .lz { color: var(--cinnabar-dk); }
.sec-list .dot { width: 7px; height: 7px; border-radius: 50%; grid-row: span 2; }
.sec-list .lz { font-family: var(--serif-cn); font-weight: 600; font-size: 14px; color: var(--ink); transition: .2s; }
.sec-list .le { grid-column: 2; font-family: var(--serif-en); font-style: italic; font-size: 11px; color: var(--muted); }

/* 02/03 预览（无边框，坐落卡面上） */
.preview { align-self: center; padding: 26px 24px; }
.py-tabs { display: flex; gap: 20px; border-bottom: 1px solid var(--line-soft); padding-bottom: 10px; margin-bottom: 14px; }
.py-tabs b { font-family: var(--serif-cn); font-size: 14px; font-weight: 600; color: var(--muted); }
.py-tabs b.on { color: var(--cinnabar-dk); position: relative; }
.py-tabs b.on::after { content: ""; position: absolute; left: 0; right: 0; bottom: -11px; height: 2px; background: var(--cinnabar); }
.py-body { display: grid; grid-template-columns: 122px 1fr; gap: 16px; align-items: center; }
.py-big { text-align: center; background: var(--paper); border: 1px solid var(--line-soft); border-radius: 10px; padding: 14px 8px; }
.py-big .syl { font-family: var(--serif-cn); font-size: 52px; font-weight: 700; color: var(--cinnabar-dk); line-height: 1; }
.py-big .sound { display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(145deg, var(--cinnabar), var(--cinnabar-dk)); color: #fbeecf; font-size: 13px; margin: 8px 0 6px; }
.py-big .lbl { font-size: 11px; color: var(--muted); font-family: var(--han); }
.py-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
.py-grid span { display: grid; place-items: center; height: 32px; border-radius: 6px; background: var(--paper); border: 1px solid var(--line-soft); font-family: var(--ui); font-weight: 700; font-size: 13px; color: var(--ink-soft, #4a3d2a); }

.mw-preview { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; }
.mw-notebook { background: var(--paper); border: 1px solid var(--line-soft); border-left: 3px solid var(--cinnabar); border-radius: 8px; padding: 13px 15px; }
.nb-head, .rv-head { display: flex; align-items: baseline; gap: 8px; font-family: var(--serif-cn); font-weight: 700; font-size: 15px; color: var(--ink); margin-bottom: 8px; }
.nb-head span, .rv-head span { font-family: var(--serif-en); font-style: italic; font-size: 11px; color: var(--muted); font-weight: 400; }
.nb-head .more { margin-left: auto; font-style: normal; font-size: 11px; color: var(--gold-deep); font-family: var(--caps); letter-spacing: 1px; transition: .2s; }
.nb-head .more:hover { color: var(--cinnabar-dk); }
.rv-head em { margin-left: auto; font-style: normal; font-size: 11px; color: var(--gold-deep); font-family: var(--caps); letter-spacing: 1px; }
.nb-row { display: grid; grid-template-columns: 16px 50px 70px 1fr; align-items: center; gap: 9px; padding: 6px 0; border-bottom: 1px dashed var(--line-soft); }
.nb-row:last-child { border-bottom: none; }
.nb-row .star { color: var(--star); font-size: 11px; }
.nb-row .zh { font-family: var(--serif-cn); font-weight: 700; font-size: 15px; color: var(--ink); }
.nb-row .py { font-size: 12px; color: var(--gold-deep); font-weight: 600; }
.nb-row .en { font-size: 12px; color: var(--muted); }
.mw-review { background: var(--paper); border: 1px solid var(--line-soft); border-radius: 10px; padding: 13px 15px; display: flex; flex-direction: column; }
.rv-card { text-align: center; padding: 6px 0 4px; margin-top: auto; }
.rv-zh { font-family: var(--serif-cn); font-weight: 900; font-size: 30px; color: var(--ink); letter-spacing: 2px; }
.rv-py { font-size: 13px; color: var(--gold-deep); font-weight: 700; margin-top: 4px; }
.rv-en { font-size: 12px; color: var(--muted); }
.rv-btn { display: inline-block; margin-top: 10px; background: linear-gradient(145deg, var(--cinnabar), var(--cinnabar-dk)); color: #fbeecf; font-family: var(--serif-cn); font-size: 12px; padding: 5px 16px; border-radius: 99px; }

/* 02/03 面板已整块嵌入 band；预览留右侧余白让山水透出 */
.s-media .preview { max-width: 588px; }

/* 远山地平线 + 前景山石 */
.foot-scene { position: relative; margin: 40px -32px -10px; }
.foot-hills { height: 150px; background-repeat: no-repeat; background-position: center bottom; background-size: cover; opacity: .5; mix-blend-mode: multiply; pointer-events: none; -webkit-mask-image: linear-gradient(180deg, transparent, #000 70%); mask-image: linear-gradient(180deg, transparent, #000 70%); }
.foot-scene .m-rock { position: absolute; bottom: -6px; left: 6%; width: 120px; opacity: .5; mix-blend-mode: multiply; pointer-events: none; }
@media (max-width: 720px) { .foot-scene .m-rock { width: 84px; left: 2%; } }

/* 页脚 */
.home-foot { border-top: 1px solid var(--line); margin-top: 0; padding: 26px 0 40px; text-align: center; position: relative; }
.foot-brand { font-family: var(--serif-cn); font-weight: 700; font-size: 18px; color: var(--ink); display: inline-flex; align-items: center; gap: 8px; }
.foot-brand i { font-family: var(--caps); font-style: normal; font-size: 11px; letter-spacing: 2px; color: var(--gold-deep); }
.foot-brand .fmark { width: 26px; height: 26px; border-radius: 5px; background: linear-gradient(145deg, var(--seal-a), var(--seal-b)); color: #fbe7d4; display: grid; place-items: center; font-weight: 900; font-size: 15px; }
.foot-tag { font-family: var(--serif-en); font-style: italic; font-size: 13px; color: var(--muted); margin: 8px 0 12px; }
.foot-links { display: flex; gap: 22px; justify-content: center; font-size: 13px; color: var(--muted); }
.foot-links span { transition: .2s; }
.foot-links span:hover { color: var(--cinnabar-dk); }

/* ── responsive ─────────────────────── */
@media (max-width: 920px) {
  .hero h1 { font-size: 38px; }
  .brk { display: inline; }
  .sec.s-books, .sec.s-media { grid-template-columns: 1fr; }
  .sec-side { align-self: start; padding: 24px 24px 4px; }
  .books-scroll { padding: 8px 24px 24px; }
  .sec-list { border-left: none; border-top: 1px solid var(--line-soft); padding: 16px 24px 22px; }
  .list-scroll { max-height: none; }
  .preview { padding: 6px 24px 24px; max-width: none; }
  .mw-preview { grid-template-columns: 1fr; }
}
@media (max-width: 560px) { .py-body { grid-template-columns: 1fr; } }
</style>
