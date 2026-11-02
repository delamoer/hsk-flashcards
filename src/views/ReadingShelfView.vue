<template>
  <!-- 全部读物：只放书（按丛书分组），点书进单本目录页 /reading/:book 再选文章 -->
  <div class="rs">
    <header class="phead" :style="pageHeroBg()">
      <img class="hero-motif" :src="motifPine" alt="" aria-hidden="true" />
      <div class="kicker">Graded Reading · 课外阅读</div>
      <h1>全部读物<span class="en">All Readers</span></h1>
      <p>选一本，读小故事 <i>Pick a book, read short stories</i></p>
      <div class="rule"><span>◇ ◇ ◇</span></div>
    </header>

    <section v-for="g in groups" :key="g.series" class="series">
      <div class="sh">
        <h2>{{ g.series }}<i>{{ g.seriesEn }}</i></h2>
        <span>{{ g.books.length }} 册 books · {{ g.books.reduce((n, b) => n + b.lessons.length, 0) }} 篇 stories</span>
      </div>
      <div class="shelf">
        <router-link v-for="b in g.books" :key="b.key" class="bk" :to="`/reading/${b.key}`">
          <ReadingCover :book="b" :percent="Math.round((readCount(b.key) / b.lessons.length) * 100)" />
          <span class="enter">开卷 →</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { readingBooks } from "@/data/reading";
import { useReading } from "@/composables/useReading";
import { motifPine, pageHeroBg } from "@/assets/img.js";
import ReadingCover from "@/components/ReadingCover.vue";

const { readCount } = useReading();
// series groups in BOOKS order (a new 丛书 becomes a new shelf)
const groups = computed(() => {
  const m = new Map();
  for (const b of readingBooks) {
    if (!m.has(b.series)) m.set(b.series, { series: b.series, seriesEn: b.seriesEn, books: [] });
    m.get(b.series).books.push(b);
  }
  return [...m.values()];
});
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

.series { margin-top: 36px; }
.sh { display: flex; align-items: baseline; flex-wrap: wrap; gap: 6px 14px; padding-bottom: 10px; border-bottom: 1px solid var(--line); }
.sh h2 { font-family: var(--brush); font-weight: 400; font-size: 32px; color: var(--sumi); }
.sh h2 i { font-family: var(--serif-en); font-size: 17px; color: var(--gold-deep); margin-left: 10px; }
.sh span { font-family: var(--han); font-size: 12.5px; color: var(--muted); }
/* 书架：同课程选册页（封面即卡片） */
.shelf { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 240px)); justify-content: center; gap: 30px 56px; margin-top: 30px; }
.shelf .bk :deep(.lvl) { font-size: 66px; }
.shelf::after { content: ""; position: absolute; left: -8px; right: -8px; bottom: -14px; height: 9px; background: linear-gradient(180deg, #d8c39a, #c2a877); border-radius: 2px; box-shadow: 0 6px 12px -6px rgba(45,30,10,.3), inset 0 1px 0 rgba(255,255,255,.4); }
.bk { position: relative; display: block; transition: transform .28s cubic-bezier(.2,.7,.3,1); }
.bk:hover { transform: translateY(-8px) rotate(-.6deg); }
.bk:hover :deep(.book) { box-shadow: 0 20px 34px -14px rgba(45,30,10,.55); }
.enter { position: absolute; bottom: 12px; right: 14px; z-index: 3; opacity: 0; transform: translateX(-4px); transition: .25s; font-family: var(--caps); font-size: 11px; letter-spacing: 2px; color: #fbeecf; }
.bk:hover .enter { opacity: .95; transform: none; }

@media (max-width: 600px) {
  .rs { padding: 14px 12px 60px; }
  .phead h1 { font-size: 40px; }
  .shelf { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 14px; }
  .hero-motif { display: none; }
}
</style>
