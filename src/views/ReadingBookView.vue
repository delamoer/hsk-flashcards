<template>
  <div class="rb">
    <!-- 单本目录：书头（封面 · 信息 · 继续读）+ 线装目录，点一篇进阅读页 -->
    <div v-if="!B" class="state">没有这本书 <i>Book not found</i> · <router-link to="/reading">全部读物 All readers</router-link></div>
    <template v-else>
      <div class="crumb">
        <router-link to="/reading">课外阅读 Reading</router-link><span class="sep">◇</span>
        <span>{{ B.series }}</span><span class="sep">◇</span><span class="cur">{{ B.title }}</span>
      </div>

      <header class="bh">
        <ReadingCover class="cv" :book="B" :percent="Math.round((readCount(B.key) / B.lessons.length) * 100)" />
        <div class="info">
          <h1>{{ B.title }}<i>{{ B.titleEn }}</i></h1>
          <div class="m">
            <span class="band" :style="{ background: B.color }">{{ B.band }}</span>
            {{ B.series }} {{ B.level }} · {{ B.lessons.length }} 篇 stories · {{ B.chars.toLocaleString() }} 字
            <template v-if="B.exercises"> · 生词 · 练习</template>
          </div>
        </div>
        <div class="cont">
          <div class="p"><b>{{ readCount(B.key) }}</b> / {{ B.lessons.length }}<i>已读 Read</i></div>
          <router-link class="go" :to="`/reading/${B.key}/${nextN}`">{{ readCount(B.key) ? "继续读" : "开始读" }} 第{{ cn(nextN) }}篇 <span class="ar">→</span></router-link>
        </div>
      </header>

      <section class="mulu">
        <div class="hd">目录<i>Contents</i></div>
        <router-link v-for="l in B.lessons" :key="l.n" class="ent" :class="{ read: isRead(B.key, l.n) }" :to="`/reading/${B.key}/${l.n}`">
          <span class="n">第{{ cn(l.n) }}篇</span>
          <b>{{ l.title }}<span v-if="isRead(B.key, l.n)" class="stamp">已读</span></b>
          <span class="dots"></span>
          <span class="e">{{ l.en }}</span>
          <span class="c">{{ l.chars }} 字</span>
        </router-link>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { readingBooks } from "@/data/reading";
import { useReading } from "@/composables/useReading";
import ReadingCover from "@/components/ReadingCover.vue";

const props = defineProps({ book: { type: String, required: true } });
const { isRead, readCount } = useReading();
const B = computed(() => readingBooks.find((b) => b.key === props.book) || null);
// 继续读 = the first story not yet read (all read → back to the first)
const nextN = computed(() => (B.value.lessons.find((l) => !isRead(B.value.key, l.n)) || B.value.lessons[0]).n);

const CN = "零一二三四五六七八九十";
function cn(n) {
  if (n <= 10) return CN[n];
  if (n < 20) return "十" + (n % 10 ? CN[n % 10] : "");
  return CN[Math.floor(n / 10)] + "十" + (n % 10 ? CN[n % 10] : "");
}
</script>

<style scoped>
.rb { max-width: 980px; margin: 0 auto; padding: 0 28px 80px; }
.state { text-align: center; padding: 80px 0; font-family: var(--serif-cn); color: var(--muted); }
.state a { color: var(--cinnabar-dk); }
.crumb { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; font-size: 13px; color: var(--muted); padding: 20px 0 4px; font-family: var(--serif-cn); }
.crumb a { color: var(--muted); border-bottom: 1px dotted transparent; }
.crumb a:hover { color: var(--cinnabar-dk); border-bottom-color: var(--cinnabar); }
.crumb .sep { color: var(--gold); font-size: 11px; }
.crumb .cur { color: var(--ink); font-weight: 600; }

.bh { display: grid; grid-template-columns: 170px minmax(0, 1fr) auto; gap: 30px; align-items: center; margin: 18px 0 28px; }
.bh .cv { transform: rotate(-2deg); }
.info h1 { font-family: var(--brush); font-weight: 400; font-size: 48px; line-height: 1.15; color: var(--sumi); }
.info h1 i { display: block; font-family: var(--serif-en); font-size: 20px; color: var(--muted); }
.info .m { font-family: var(--han); font-size: 13px; color: var(--muted); margin-top: 10px; line-height: 1.8; }
.info .band { display: inline-block; padding: 0 8px; margin-right: 6px; border-radius: 99px; color: #fbeecf; font-size: 11.5px; }
.cont { text-align: center; }
.cont .p { font-family: var(--ui); font-size: 14px; color: var(--muted); }
.cont .p b { font-size: 32px; color: var(--cinnabar-dk); }
.cont .p i { display: block; font-style: normal; font-family: var(--han); font-size: 11.5px; color: var(--muted-soft); }
.go { display: inline-block; margin-top: 10px; padding: 9px 18px; border-radius: 7px; background: linear-gradient(145deg, var(--cinnabar), var(--cinnabar-dk)); color: #fbeecf; font-family: var(--serif-cn); font-size: 14px; white-space: nowrap; box-shadow: 0 6px 14px -8px rgba(122,43,33,.7); }
.go .ar { display: inline-block; transition: transform .2s; }
.go:hover .ar { transform: translateX(3px); }

/* 线装目录（同阅读页的双线版框） */
.mulu { position: relative; padding: 38px 52px 34px; background: linear-gradient(rgba(252,248,240,.92), rgba(247,240,226,.92)), url("../assets/img/motif/cloud.webp") right 20px bottom 16px / 200px auto no-repeat, #faf5ea; border: 1px solid var(--border-strong); border-radius: 4px; box-shadow: 0 1px 0 #efe4cf, 0 3px 0 #e6d8bd, 0 18px 34px -22px rgba(45,30,10,.45); }
.mulu::before { content: ""; position: absolute; inset: 12px; border: 2px solid rgba(122,43,33,.28); outline: 1px solid rgba(122,43,33,.18); outline-offset: 3px; pointer-events: none; }
.hd { text-align: center; margin-bottom: 18px; font-family: var(--brush); font-size: 38px; letter-spacing: 12px; color: var(--sumi); }
.hd i { display: block; font-family: var(--serif-en); font-size: 15px; letter-spacing: 3px; color: var(--muted); }
.ent { position: relative; display: grid; grid-template-columns: 80px auto minmax(20px, 1fr) auto 50px; align-items: baseline; gap: 10px; padding: 8px 0; }
.ent .n { font-family: var(--serif-cn); font-size: 13px; color: var(--gold); white-space: nowrap; }
.ent b { font-family: var(--serif-cn); font-size: 17.5px; font-weight: 600; color: var(--ink); }
.ent:hover b { color: var(--cinnabar-dk); }
.ent .dots { border-bottom: 2px dotted var(--gold-lt); transform: translateY(-4px); }
.ent .e { font-family: var(--serif-en); font-style: italic; font-size: 15px; color: var(--muted); text-align: right; }
.ent .c { font-family: var(--han); font-size: 11.5px; color: var(--muted-soft); text-align: right; }
.stamp { display: inline-block; margin-left: 8px; padding: 0 4px; border: 1.5px solid var(--cinnabar); border-radius: 4px; font-size: 11px; font-weight: 900; color: var(--cinnabar); transform: rotate(8deg); opacity: .8; vertical-align: 2px; }

@media (max-width: 760px) {
  .rb { padding: 0 12px 60px; }
  .bh { grid-template-columns: 110px minmax(0, 1fr); gap: 18px; }
  .info h1 { font-size: 34px; }
  .cont { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; text-align: left; }
  .cont .go { margin-top: 0; }
  .mulu { padding: 30px 22px 24px; }
  .ent { grid-template-columns: 62px minmax(0, 1fr); row-gap: 0; }
  .ent .dots, .ent .c { display: none; }
  .ent .e { grid-column: 2; text-align: left; font-size: 14px; }
}
</style>
