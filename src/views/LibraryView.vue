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
        <TextbookCarousel :list="seriesList">
          <template #head>
            <div class="num">01</div>
            <div class="sec-title">教材<span class="en">TEXTBOOKS</span></div>
          </template>
        </TextbookCarousel>
      </section>

      <!-- ── 02 课外阅读：一整行（左标题 · 中书封 · 右篇目两列），书目来自 reading/meta.json -->
      <section v-if="rbook" class="sec s-read">
        <div class="sec-bg is-band" :style="bandPanel(seriesBand.survival)" aria-hidden="true"></div>
        <div class="rd-side">
          <div class="num">02</div>
          <div class="sec-title">课外阅读<span class="en">READING</span></div>
          <p class="rd-desc">读小故事，看中国<i>Short graded stories — read China</i></p>
          <router-link class="rd-cta" to="/reading">开始阅读 Read <span class="ar">→</span></router-link>
        </div>
        <router-link class="rd-book" :to="`/reading/${rbook.key}/1`">
          <div class="rd-cover">
            <div class="c-series">{{ rbook.series }} · {{ rbook.seriesEn }}</div>
            <div class="c-title">{{ rbook.title }}</div>
            <div class="c-en">{{ rbook.titleEn }}</div>
            <div class="c-lv">{{ rbook.level }}</div>
          </div>
          <div class="c-meta"><b>{{ rbook.lessons.length }}</b> 篇 stories · <b>{{ rbook.chars }}</b> 字 · <b>{{ rbook.vocab }}</b> 生词</div>
        </router-link>
        <div class="rd-list">
          <router-link v-for="l in rbook.lessons.slice(0, 6)" :key="l.n" class="rd-item" :to="`/reading/${rbook.key}/${l.n}`">
            <span class="no">{{ String(l.n).padStart(2, "0") }}</span>
            <b>{{ l.title }}</b><i>{{ l.en }}</i>
            <span class="ch">{{ l.chars }} 字</span>
          </router-link>
          <router-link class="rd-more" to="/reading">还有 {{ rbook.lessons.length - 6 }} 篇 · {{ rbook.lessons.length - 6 }} more →</router-link>
        </div>
      </section>

      <!-- ── 03–06 拼音 · 语法 · 中国风 · 我的词：2×2 卡片（左列表 + 右纸卡实物，与「01 教材」书架同为物件） -->
      <div class="cards">
        <section class="card c-pin">
          <div class="sec-bg is-band" :style="bandPanel(seriesBand.newhsk3)" aria-hidden="true"></div>
          <img class="card-motif" :src="motifCloud" alt="" aria-hidden="true" />
          <div class="card-head">
            <div class="num">03</div>
            <div><div class="card-title">拼音<span class="en">PINYIN</span></div>
            <p class="card-desc">掌握发音基础<i>Initials, finals and tones</i></p></div>
          </div>
          <div class="card-body">
            <div class="cw-row">
              <div class="nb-rows cw-list py-list">
                <div v-for="t in tones" :key="t.n" class="nb-row" :style="{ '--tc': `var(--tone${t.n})` }">
                  <svg viewBox="0 0 32 24" class="contour" aria-hidden="true"><polyline :points="t.pts" /></svg>
                  <span class="syl">{{ t.syl }}</span><b class="zh">{{ t.hz }}</b><span class="en">{{ t.cn }} · {{ t.en }}</span>
                </div>
              </div>
              <div class="rva-stack sm"><div class="rva-card back1"></div><div class="rva-card front"><span class="tzg-py t3">mǎ</span><div class="tzg"><span>马</span></div><span class="tzg-en">horse</span></div></div>
            </div>
          </div>
          <router-link class="card-cta" to="/pinyin">开始学习 Start <span class="ar">→</span></router-link>
        </section>
        <section class="card c-gr">
          <div class="sec-bg is-band" :style="bandPanel(seriesBand.zoubian)" aria-hidden="true"></div>
          <img class="card-motif" :src="motifBamboo" alt="" aria-hidden="true" />
          <div class="card-head">
            <div class="num">04</div>
            <div><div class="card-title">语法<span class="en">GRAMMAR</span></div>
            <p class="card-desc">全部教材的语法，一处查遍<i>Search every grammar point</i></p></div>
          </div>
          <div class="card-body">
            <div class="cw-row">
              <div class="nb-rows cw-list gr-list">
                <div v-for="g in grammarSamples" :key="g.name" class="nb-row"><span class="dot">◆</span><b class="zh">{{ g.name }}</b><span class="st">{{ g.st }}</span></div>
              </div>
              <div class="rva-stack sm"><div class="rva-card back1"></div><div class="rva-card front"><span class="rva-seal">HSK<b>3</b></span><div class="slip-zh">把</div><div class="slip-st">把 + 宾语 + 动词</div><div class="slip-en">do sth to sth</div></div></div>
            </div>
          </div>
          <router-link class="card-cta" to="/grammar">查语法 Browse <span class="ar">→</span></router-link>
        </section>
        <section class="card c-mu">
          <div class="sec-bg is-band" :style="bandPanel(seriesBand.kouyu)" aria-hidden="true"></div>
          <img class="card-motif" :src="motifSwallows" alt="" aria-hidden="true" />
          <div class="card-head">
            <div class="num">05</div>
            <div><div class="card-title">中国风<span class="en">MUSIC</span></div>
            <p class="card-desc">在旋律里学中文<i>43 Chinese-style songs</i></p></div>
          </div>
          <div class="card-body">
            <div class="cw-row">
              <div class="nb-rows cw-list mu-list">
                <router-link v-for="(s, i) in songs" :key="s.id" class="nb-row" :to="{ path: '/music', query: { song: s.n } }"><span class="no">{{ "一二三四"[i] }}</span><b class="zh">{{ s.zh }}</b><span class="py">{{ s.artist }}</span><span class="en">{{ s.en }}</span></router-link>
              </div>
              <router-link class="rva-stack sm mu-obj" :to="{ path: '/music', query: { song: 1 } }"><div class="rva-card back1"></div><div class="rva-card front"><span class="ph"><img :src="`https://i.ytimg.com/vi/${songs[0].id}/hqdefault.jpg`" alt="" /></span><span class="play">▶</span><span class="ph-cap">青花瓷</span></div></router-link>
            </div>
          </div>
          <router-link class="card-cta" to="/music">去听歌 Listen <span class="ar">→</span></router-link>
        </section>
        <section class="card c-mw">
          <div class="sec-bg is-band" :style="bandPanel(seriesBand.huihua360)" aria-hidden="true"></div>
          <img class="card-motif" :src="motifPlum2" alt="" aria-hidden="true" />
          <div class="card-head">
            <div class="num">06</div>
            <div><div class="card-title">我的词<span class="en">MY WORDS</span></div>
            <p class="card-desc">记录生词，每日复习<i>Your words, reviewed daily</i></p></div>
          </div>
          <div class="card-body">
            <div class="cw-row">
              <div class="nb-rows cw-list">
                <div v-for="w in sampleWords" :key="w.zh" class="nb-row"><span class="star">★</span><b class="zh">{{ w.zh }}</b><span class="py">{{ w.py }}</span><span class="en">{{ w.en }}</span></div>
              </div>
              <div class="rva-stack sm"><div class="rva-card back1"></div><div class="rva-card front"><span class="rva-seal">复习<b>5/10</b></span><div class="rva-zh">学习</div></div></div>
            </div>
          </div>
          <router-link class="card-cta" to="/my-words">进入我的词 Open <span class="ar">→</span></router-link>
        </section>
      </div>

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
        <div class="foot-rights">
          © 2026 学中文 Learn Chinese · 保留所有权利 All rights reserved<br />
          本站原创内容（练习题、翻译、注音、讲解、设计与代码）未经书面许可禁止复制、转载或用于其他网站及商业用途；课文、词表等教材内容版权归原出版社所有，本站仅供本班学生学习使用。<br />
          <i>Original content of this site may not be copied or redistributed without written permission. Textbook materials remain the property of their publishers and are used here for our students' study only.</i>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { courseRegistry } from "@/data";
import TextbookCarousel from "@/components/TextbookCarousel.vue";
import { readingBooks } from "@/data/reading";
import { heroMain, seriesBand, motifPlum, motifPlum2, motifCloud, motifCranes, motifSeals, motifMountainFar, motifBoat, motifRock, motifBamboo, motifSwallows } from "@/assets/img.js";

const seriesList = courseRegistry;
const rbook = readingBooks[0];

// 整块面板嵌入 band 山水：左浓右淡横向 scrim（护文字）+ 顶底轻纱，图在最底。
function bandPanel(img) {
  // 与 TextbookCarousel 的 .bgl .tint 同一套遮罩：左侧护字、右侧让山水透出，各板块观感一致
  return {
    backgroundImage:
      `linear-gradient(90deg, rgba(249,243,232,.96) 0%, rgba(249,243,232,.9) 22%, rgba(249,243,232,.55) 50%, rgba(249,243,232,.38) 100%),` +
      `url(${img})`,
    backgroundSize: "cover, cover",
    backgroundPosition: "center, center",
    backgroundRepeat: "no-repeat",
  };
}

const sampleWords = [
  { zh: "你好", py: "nǐ hǎo", en: "hello" },
  { zh: "学习", py: "xuéxí", en: "to study" },
  { zh: "中国", py: "Zhōngguó", en: "China" },
  { zh: "朋友", py: "péngyou", en: "friend" },
];
// 语法卡只是展示（只有「查语法」可点）。纸卡上的字（马 · 把 · 青花瓷 · 学习）相邻连读要无歧义——别放「妈」「比」挨着。
const grammarSamples = [
  { name: "“比”字句", st: "A 比 B + 形容词" },
  { name: "越……越……", st: "越 A 越 B" },
  { name: "“把”字句", st: "把 + 宾语 + 动词 + 结果" },
  { name: "动态助词“了”", st: "动词 + 了" },
  { name: "“是……的”强调句", st: "是 + 强调部分 + 的" },
];
// 中国风：n = MusicView 的 ?song= 序号（music.json 里的平铺顺序，1 起）
const songs = [
  { n: 1, id: "Z8Mqw0b9ADs", zh: "青花瓷", artist: "周杰伦", en: "Blue and White Porcelain" },
  { n: 2, id: "qct0JLjaHDc", zh: "东风破", artist: "周杰伦", en: "East Wind Breaks" },
  { n: 13, id: "G97_rOdHcnY", zh: "江南", artist: "林俊杰", en: "South of the River" },
  { n: 30, id: "O9Fm-nuRhng", zh: "逍遥叹", artist: "胡歌", en: "Lament of the Carefree" },
];
// 四声示范（五度标记法：1 低 … 5 高，映射到 24px 高的小图）
const tones = [
  { n: 1, syl: "mā", hz: "妈", cn: "一声", en: "High", pts: "3,4 29,4" },
  { n: 2, syl: "má", hz: "麻", cn: "二声", en: "Rising", pts: "3,13 29,4" },
  { n: 3, syl: "mǎ", hz: "马", cn: "三声", en: "Dipping", pts: "3,11 14,20 29,7" },
  { n: 4, syl: "mà", hz: "骂", cn: "四声", en: "Falling", pts: "3,4 29,20" },
];

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
/* 「01 教材」面板高度以 3D 书架所需为准（--sec-h）；02 课外阅读一整行；03–06 是下面的 2×2 卡片 */
.sec { --sec-h: 400px; min-height: var(--sec-h); position: relative; margin: 26px 0; border-radius: 16px; border: 1px solid var(--line); background: linear-gradient(165deg, #fbf7ee, #f3ead9); box-shadow: 0 16px 38px -24px rgba(45,30,10,.55); overflow: hidden; display: grid; align-items: stretch; }
.sec.s-books { grid-template-columns: minmax(0, 1fr); }
.sec > *:not(.sec-bg) { position: relative; z-index: 1; }
/* 整块面板嵌入的 band 山水（scrim 已在内联渐变里，护住文字） */
.sec-bg { position: absolute; inset: 0; z-index: 0; background-size: contain; background-position: right center; background-repeat: no-repeat; opacity: .08; mix-blend-mode: multiply; pointer-events: none; -webkit-mask-image: linear-gradient(90deg, transparent, #000 72%); mask-image: linear-gradient(90deg, transparent, #000 72%); }
.sec-bg.is-band { opacity: 1; background-size: cover; background-position: center; mix-blend-mode: normal; -webkit-mask-image: none; mask-image: none; inset: -3%; animation: band-drift 24s ease-in-out infinite alternate; }
@keyframes band-drift { from { transform: scale(1.02); } to { transform: scale(1.08) translateX(-1.2%); } }
@media (prefers-reduced-motion: reduce) { .sec-bg.is-band { animation: none; } }
.num { font-family: var(--caps); font-size: 40px; font-weight: 700; color: var(--gold-lt); line-height: 1; letter-spacing: 2px; }
.sec-title { font-family: var(--brush); font-weight: 400; font-size: 40px; letter-spacing: 2px; color: var(--sumi); margin-top: 4px; }
.sec-title .en { display: block; font-family: var(--caps); font-size: 12px; letter-spacing: 4px; color: var(--gold-deep); font-weight: 500; margin-top: 3px; }

/* ── 02 课外阅读：一整行 ─────────────── */
.sec.s-read { min-height: 300px; grid-template-columns: 220px 220px minmax(0, 1fr); gap: 28px; align-items: center; padding: 26px 32px; }
.s-read .sec-bg.is-band { opacity: .85; }
.rd-desc { font-family: var(--serif-cn); font-size: 14px; margin: 12px 0 16px; color: var(--ink-soft, #4a3d2a); }
.rd-desc i { display: block; font-family: var(--serif-en); font-size: 12.5px; color: var(--muted); }
.rd-cta { display: inline-block; background: linear-gradient(145deg, var(--cinnabar), var(--cinnabar-dk)); color: #fbeecf; font-family: var(--serif-cn); font-size: 14px; padding: 9px 18px; border-radius: 7px; box-shadow: 0 6px 14px -8px rgba(122,43,33,.7); }
.rd-cta .ar { display: inline-block; transition: transform .2s; }
.rd-cta:hover .ar { transform: translateX(3px); }
.rd-book { text-align: center; }
.rd-cover { position: relative; width: 160px; height: 218px; margin: 0 auto; border-radius: 4px 10px 10px 4px; padding: 18px 15px; background: linear-gradient(rgba(240,230,205,.22), rgba(240,230,205,.22)), url("../assets/img/motif/bamboo.webp") right -20px bottom -10px / 140px auto no-repeat, linear-gradient(160deg, #2f5d50, #1e3d35); color: #f3e6c8; box-shadow: inset 6px 0 0 rgba(0,0,0,.18), 0 18px 28px -14px rgba(20,20,10,.6); transform: rotate(-2deg); text-align: left; transition: transform .3s; }
.rd-book:hover .rd-cover { transform: rotate(0deg) translateY(-3px); }
.rd-cover .c-series { font-family: var(--caps); font-size: 10px; letter-spacing: 1px; opacity: .8; }
.rd-cover .c-title { font-family: var(--brush); font-size: 28px; writing-mode: vertical-rl; position: absolute; right: 18px; top: 30px; letter-spacing: 4px; line-height: 1; }
.rd-cover .c-en { position: absolute; left: 15px; bottom: 42px; font-family: var(--serif-en); font-style: italic; font-size: 13px; }
.rd-cover .c-lv { position: absolute; left: 15px; bottom: 14px; padding: 2px 8px; border-radius: 3px; background: var(--cinnabar); font-family: var(--caps); font-weight: 700; font-size: 12px; }
.rd-book .c-meta { margin-top: 18px; font-size: 12.5px; color: var(--muted); }
.rd-book .c-meta b { font-family: var(--ui); font-size: 14px; color: var(--ink); }
.rd-list { display: grid; grid-template-columns: 1fr 1fr; gap: 0 26px; padding: 12px 18px; border-radius: 12px; background: rgba(250,245,235,.72); }
.rd-item { display: grid; grid-template-columns: 26px 1fr auto; column-gap: 8px; padding: 9px 2px; border-bottom: 1px dashed var(--line-soft); }
.rd-item .no { grid-row: span 2; font-family: var(--caps); font-size: 15px; color: var(--gold); font-weight: 700; }
.rd-item b { font-family: var(--serif-cn); font-size: 15px; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rd-item i { grid-column: 2; font-family: var(--serif-en); font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rd-item .ch { grid-row: 1; grid-column: 3; font-size: 11.5px; color: var(--muted-soft); }
.rd-item:hover b { color: var(--cinnabar-dk); }
.rd-more { grid-column: 1 / -1; padding-top: 10px; font-family: var(--serif-cn); font-size: 13px; color: var(--cinnabar-dk); }

/* ── 03–06 卡片 ─────────────────────── */
.cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; margin: 26px 0; }
.card { position: relative; min-height: 330px; border-radius: 16px; border: 1px solid var(--line); background: linear-gradient(165deg, #fbf7ee, #f3ead9); box-shadow: 0 16px 38px -24px rgba(45,30,10,.55); overflow: hidden; padding: 24px 26px 22px; display: flex; flex-direction: column; }
.card > *:not(.sec-bg):not(.card-motif) { position: relative; z-index: 1; }
.card .sec-bg.is-band { opacity: .9; }
.card-motif { position: absolute; z-index: 1; top: 10px; right: 12px; width: 120px; opacity: .55; mix-blend-mode: multiply; pointer-events: none; }
.card-head { display: flex; gap: 14px; align-items: flex-start; }
.card-head .num { font-size: 32px; }
.card-title { font-family: var(--brush); font-size: 32px; color: var(--sumi); line-height: 1.1; }
.card-title .en { font-family: var(--caps); font-size: 11px; letter-spacing: 3.5px; color: var(--gold-deep); margin-left: 10px; vertical-align: 6px; }
.card-desc { font-family: var(--serif-cn); font-size: 13.5px; color: var(--ink-soft, #4a3d2a); margin-top: 4px; }
.card-desc i { font-family: var(--serif-en); color: var(--muted); margin-left: 8px; font-size: 12.5px; }
.card-body { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 16px 0 12px; --tile: rgba(243,234,217,.8); }
.card-cta { align-self: flex-start; font-family: var(--serif-cn); font-weight: 700; font-size: 14px; color: var(--cinnabar-dk); border-bottom: 1px solid currentColor; padding-bottom: 1px; }
.card-cta .ar { transition: transform .2s; display: inline-block; }
.card-cta:hover .ar { transform: translateX(3px); }
.cw-row { display: grid; grid-template-columns: 1fr 120px; gap: 18px; align-items: center; }
.cw-list .nb-row { grid-template-columns: 14px 44px 74px 1fr; }
.rva-stack.sm { width: 112px; height: 142px; margin: 0 auto; }
.rva-stack.sm .rva-zh { font-size: 34px; }
.rva-stack.sm .rva-seal { top: 9px; right: 9px; font-size: 9px; }
.nb-row { display: grid; grid-template-columns: 16px 50px 80px 1fr; align-items: center; gap: 9px; padding: 6px 0; border-bottom: 1px dashed var(--line-soft); }
.nb-row:last-child { border-bottom: none; }
.nb-row .star { color: var(--star); font-size: 11px; }
.nb-row .zh { font-family: var(--serif-cn); font-weight: 700; font-size: 15px; color: var(--ink); }
.nb-row .py { font-size: 12px; color: var(--gold-deep); font-weight: 600; }
.nb-row .en { font-size: 12px; color: var(--muted); }
/* ── 今日复习：实物闪卡叠（像书架上的书一样是「物件」，有落地投影） */
.rva-stack { position: relative; width: 168px; height: 212px; margin-top: 4px; }
.rva-card { position: absolute; inset: 0; border-radius: 8px; background: linear-gradient(160deg, #fdf9f0, #f1e6cf); box-shadow: inset 0 0 0 1px rgba(138,124,92,.28), 0 10px 20px -10px rgba(40,25,5,.45); }
.rva-card.back1 { transform: rotate(5deg) translate(8px, 2px); background: linear-gradient(160deg, #f5ecd9, #e9dcc0); }
.rva-card.front { transform: rotate(-1.5deg); display: flex; flex-direction: column; align-items: center; justify-content: center; transition: transform .35s; }
.rva-card.front::before { content: ""; position: absolute; inset: 8px; border: 1px solid rgba(176,141,87,.45); border-radius: 4px; pointer-events: none; }
.rva-zh { font-family: var(--serif-cn); font-weight: 900; font-size: 50px; color: var(--ink); letter-spacing: 3px; }
.rva-seal { position: absolute; top: 14px; right: 14px; display: flex; flex-direction: column; align-items: center; padding: 3px 5px; border-radius: 3px; background: linear-gradient(145deg, var(--cinnabar), var(--cinnabar-dk)); color: #fbeecf; font-family: var(--serif-cn); font-size: 10px; line-height: 1.25; transform: rotate(4deg); box-shadow: 0 2px 4px rgba(139,42,31,.3); }
.rva-seal b { font-family: var(--caps); font-size: 10px; letter-spacing: .5px; }

/* card bodies share 我的词's grammar: notebook list left + a tilted paper object right */
.cw-list .nb-row { transition: color .2s; }
a.nb-row:hover .zh { color: var(--cinnabar-dk); }
.py-list .nb-row { grid-template-columns: 30px 34px 22px 1fr; }
.py-list .contour { width: 28px; height: 20px; fill: none; stroke: var(--tc); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.py-list .syl { font-family: var(--ui); font-weight: 700; font-size: 16px; color: var(--tc); }
.tzg-py { font-family: var(--ui); font-weight: 700; font-size: 17px; color: var(--tone1); }
.tzg { width: 66px; height: 66px; margin: 4px 0 6px; border: 1.5px solid rgba(163,63,46,.7); display: grid; place-items: center;
  background: linear-gradient(rgba(163,63,46,.35), rgba(163,63,46,.35)) center / 100% 1px no-repeat, linear-gradient(90deg, rgba(163,63,46,.35), rgba(163,63,46,.35)) center / 1px 100% no-repeat; }
.tzg span { font-family: var(--brush); font-size: 50px; color: var(--sumi); line-height: 1; }
.tzg-py.t3 { color: var(--tone3); }
.tzg-en { font-family: var(--serif-en); font-style: italic; font-size: 12px; color: var(--muted); }
.gr-list .nb-row { grid-template-columns: 12px auto 1fr; }
.gr-list .dot { font-size: 8px; color: var(--gold); }
.gr-list .st { font-family: var(--serif-cn); font-size: 12.5px; color: var(--muted); text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.slip-zh { font-family: var(--brush); font-size: 54px; color: var(--cinnabar-dk); line-height: 1; }
.slip-st { font-family: var(--serif-cn); font-size: 11.5px; font-weight: 600; color: var(--ink); margin-top: 8px; }
.slip-en { font-family: var(--serif-en); font-style: italic; font-size: 11px; color: var(--muted); }
.mu-list .nb-row { grid-template-columns: 16px 48px 50px 1fr; }
.mu-list .no { font-family: var(--serif-cn); font-size: 12px; color: var(--gold); }
.mu-list .en { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mu-obj { display: block; }
.mu-obj .front { justify-content: flex-start; padding-top: 10px; }
.mu-obj .ph { width: 88px; height: 96px; overflow: hidden; border-radius: 2px; box-shadow: inset 0 0 0 1px rgba(138,124,92,.3); }
.mu-obj .ph img { width: 100%; height: 100%; object-fit: cover; filter: sepia(.6) saturate(.6) contrast(.95) brightness(1.02); mix-blend-mode: multiply; transition: filter .3s; }
.mu-obj:hover .ph img { filter: sepia(.15) saturate(.9); }
.mu-obj .play { position: absolute; top: 44px; left: 50%; transform: translateX(-50%) rotate(-4deg); width: 30px; height: 30px; border-radius: 5px; display: grid; place-items: center; background: linear-gradient(145deg, var(--seal-a), var(--seal-b)); color: #fbe7d4; font-size: 11px; box-shadow: inset 0 0 0 1.5px rgba(251,231,212,.5), 0 3px 8px rgba(0,0,0,.3); }
.mu-obj .ph-cap { font-family: var(--brush); font-size: 18px; color: var(--sumi); margin-top: 6px; }

@media (max-width: 560px) {
  .cw-row { grid-template-columns: 1fr 96px; gap: 12px; }
  .rva-stack.sm { width: 92px; height: 120px; }
  .gr-list .st, .mu-list .en { display: none; }
  .mu-obj .ph { width: 70px; height: 70px; }
  .slip-zh { font-size: 42px; }
  .tzg { width: 54px; height: 54px; } .tzg span { font-size: 40px; }
}

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
.foot-rights { max-width: 760px; margin: 16px auto 0; padding: 0 18px; font-size: 11.5px; line-height: 1.7; color: var(--muted); }
.foot-rights i { font-style: normal; font-size: 11px; opacity: .85; }
.foot-links span:hover { color: var(--cinnabar-dk); }

/* ── responsive ─────────────────────── */
@media (max-width: 920px) {
  .hero h1 { font-size: 38px; }
  .brk { display: inline; }
  .cards { grid-template-columns: 1fr; }
  .sec.s-read { grid-template-columns: 1fr; padding: 22px; }
  .rd-list { grid-template-columns: 1fr; }
}
</style>
