<template>
  <div class="rs">
    <header class="phead" :style="pageHeroBg()">
      <img class="hero-motif" :src="motifPine" alt="" aria-hidden="true" />
      <div class="kicker">Graded Reading · 课外阅读</div>
      <h1>课外阅读<span class="en">Reading</span></h1>
      <p>读小故事，看中国 <i>Short graded stories — read China</i></p>
      <div class="rule"><span>◇ ◇ ◇</span></div>
    </header>

    <section v-for="b in readingBooks" :key="b.key" class="book">
      <div class="b-head">
        <div class="b-cover">
          <div class="c-title">{{ b.title }}</div>
          <div class="c-lv">{{ b.level }}</div>
        </div>
        <div class="b-info">
          <div class="b-series">{{ b.series }} · {{ b.seriesEn }}</div>
          <h2>{{ b.title }}<i>{{ b.titleEn }}</i></h2>
          <div class="b-meta">{{ b.lessons.length }} 篇 stories · {{ b.chars }} 字 characters · {{ b.vocab }} 生词 new words</div>
        </div>
        <div class="b-prog">
          <b>{{ readCount(b.key) }}</b><span>/ {{ b.lessons.length }}</span>
          <i>已读 Read</i>
        </div>
      </div>
      <div class="story-grid">
        <router-link v-for="l in b.lessons" :key="l.n" class="story" :class="{ read: isRead(b.key, l.n) }" :to="`/reading/${b.key}/${l.n}`">
          <span class="no">第{{ cn(l.n) }}篇</span>
          <b>{{ l.title }}</b>
          <i>{{ l.en }}</i>
          <span class="meta">{{ l.chars }} 字 · {{ l.vocab }} 生词</span>
          <span v-if="isRead(b.key, l.n)" class="stamp">已读</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { readingBooks } from "@/data/reading";
import { useReading } from "@/composables/useReading";
import { motifPine, pageHeroBg } from "@/assets/img.js";

const { isRead, readCount } = useReading();
const CN = "零一二三四五六七八九十";
function cn(n) {
  if (n <= 10) return CN[n];
  if (n < 20) return "十" + (n % 10 ? CN[n % 10] : "");
  return CN[Math.floor(n / 10)] + "十" + (n % 10 ? CN[n % 10] : "");
}
</script>

<style scoped>
.rs { max-width: 1180px; margin: 0 auto; padding: 26px 28px 80px; }
.phead { position: relative; text-align: center; padding: 36px 24px 26px; border-radius: 14px; border: 1px solid var(--line); overflow: hidden; }
.hero-motif { position: absolute; top: -6px; right: 8px; width: 170px; opacity: .6; mix-blend-mode: multiply; pointer-events: none; }
.phead > *:not(.hero-motif) { position: relative; z-index: 1; }
.kicker { font-family: var(--caps); font-size: 12px; letter-spacing: 5px; color: var(--gold-deep); text-transform: uppercase; }
.phead h1 { font-family: var(--brush); font-weight: 400; font-size: 50px; color: var(--sumi); }
.phead h1 .en { font-family: var(--serif-en); font-style: italic; font-size: 22px; color: var(--gold-deep); margin-left: 12px; }
.phead p { font-family: var(--serif-cn); color: var(--body); }
.phead p i { font-family: var(--serif-en); color: var(--muted); margin-left: 6px; }
.rule { display: flex; align-items: center; gap: 14px; max-width: 260px; margin: 12px auto 0; color: var(--gold); font-size: 11px; letter-spacing: 6px; }
.rule::before, .rule::after { content: ""; flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }

.book { margin-top: 34px; }
.b-head { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 22px; align-items: center; padding-bottom: 16px; border-bottom: 1px solid var(--line); }
.b-cover { position: relative; width: 70px; height: 96px; border-radius: 3px 7px 7px 3px; background: url("../assets/img/motif/bamboo.webp") right -14px bottom -8px / 70px auto no-repeat, linear-gradient(160deg, #2f5d50, #1e3d35); color: #f3e6c8; box-shadow: inset 4px 0 0 rgba(0,0,0,.18), 0 10px 18px -10px rgba(20,20,10,.6); transform: rotate(-2deg); }
.b-cover .c-title { position: absolute; right: 9px; top: 10px; writing-mode: vertical-rl; font-family: var(--brush); font-size: 15px; letter-spacing: 2px; }
.b-cover .c-lv { position: absolute; left: 7px; bottom: 7px; padding: 0 5px; border-radius: 2px; background: var(--cinnabar); font-family: var(--caps); font-weight: 700; font-size: 10px; }
.b-series { font-family: var(--han); font-size: 12px; color: var(--muted-soft); }
.b-info h2 { font-family: var(--serif-cn); font-size: 24px; color: var(--ink); margin-top: 2px; }
.b-info h2 i { font-family: var(--serif-en); font-weight: 400; font-size: 18px; color: var(--muted); margin-left: 10px; }
.b-meta { font-family: var(--han); font-size: 12.5px; color: var(--muted); margin-top: 4px; }
.b-prog { text-align: right; font-family: var(--ui); color: var(--muted); }
.b-prog b { font-size: 28px; color: var(--cinnabar-dk); }
.b-prog span { font-size: 14px; margin-left: 3px; }
.b-prog i { display: block; font-style: normal; font-family: var(--han); font-size: 11.5px; color: var(--muted-soft); }

.story-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; margin-top: 20px; }
.story { position: relative; display: flex; flex-direction: column; gap: 3px; padding: 16px 18px 14px; border-radius: 10px; background: linear-gradient(165deg, #fcf8f0, #f2e8d6); border: 1px solid var(--line); transition: transform .15s, box-shadow .15s; }
.story:hover { transform: translateY(-2px); box-shadow: 0 10px 22px -14px rgba(45,30,10,.4); }
.story .no { font-family: var(--serif-cn); font-size: 12px; color: var(--gold); }
.story b { font-family: var(--serif-cn); font-size: 18px; color: var(--ink); padding-right: 40px; }
.story:hover b { color: var(--cinnabar-dk); }
.story i { font-family: var(--serif-en); font-size: 14px; color: var(--muted); }
.story .meta { font-family: var(--han); font-size: 11.5px; color: var(--muted-soft); margin-top: 6px; }
.story .stamp { position: absolute; right: 12px; top: 12px; padding: 1px 5px; border: 1.5px solid var(--cinnabar); border-radius: 4px; font-family: var(--serif-cn); font-weight: 900; font-size: 12px; color: var(--cinnabar); transform: rotate(8deg); opacity: .8; }

@media (max-width: 600px) {
  .rs { padding: 14px 12px 60px; }
  .phead h1 { font-size: 40px; }
  .b-head { grid-template-columns: auto minmax(0, 1fr); }
  .b-prog { grid-column: 1 / -1; text-align: left; }
}
</style>
