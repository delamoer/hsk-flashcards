<template>
  <div class="courseswrap">
    <div class="crumb">
      <router-link to="/">课程总览 Library</router-link><span class="sep">◇</span>
      <span class="cur">教材 Textbooks</span>
    </div>

    <header class="chead" :style="pageHeroBg()">
      <img class="hero-motif" :src="motifPine" alt="" aria-hidden="true" />
      <div class="kicker">Textbooks · 教程典藏</div>
      <h1>教材</h1>
      <div class="en-sub">Choose a course to begin your journey</div>
      <div class="rule"><span class="diamond">◇ ◇ ◇</span></div>
    </header>

    <div class="cgrid">
      <div
        v-for="s in seriesList"
        :key="s.id"
        class="ccard"
        :style="{ '--sc': s.seriesColor }"
        @click="pick(s)"
        role="link"
        tabindex="0"
        @keyup.enter="pick(s)"
      >
        <div class="cover">
          <img :src="bookCover[s.id]" :alt="s.heroTitle" loading="lazy" />
          <span class="cseal">{{ s.seal.cn }}</span>
        </div>
        <div class="cbody">
          <div class="cname"><b>{{ s.heroTitle }}</b><i>{{ s.nameEn }}</i></div>
          <p class="cdesc">{{ s.desc }}<span class="en">{{ s.descEn }}</span></p>
          <div class="cfoot">
            <span class="vols">{{ s.units.length }} {{ s.volUnit }}</span>
            <span class="enter">开卷 · Open →</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { courseRegistry } from "@/data";
import { bookCover, pageHeroBg, motifPine } from "@/assets/img.js";

const router = useRouter();
const seriesList = courseRegistry;

function pick(s) {
  if (s.single) router.push(`/course/${s.id}/${s.units[0].id}`);
  else router.push(`/course/${s.id}`);
}
</script>

<style scoped>
.courseswrap { max-width: 1180px; margin: 0 auto; padding: 0 32px 72px; }
.crumb { display: flex; align-items: center; gap: 9px; font-size: 13px; color: var(--muted); padding: 20px 0 4px; font-family: var(--serif-cn); }
.crumb a { color: var(--muted); transition: .2s; border-bottom: 1px dotted transparent; }
.crumb a:hover { color: var(--cinnabar-dk); border-bottom-color: var(--cinnabar); }
.crumb .sep { color: var(--gold); font-size: 11px; }
.crumb .cur { color: var(--ink); font-weight: 600; }

.chead { position: relative; text-align: center; padding: 40px 24px 30px; margin: 10px 0 30px; border-radius: 14px; border: 1px solid var(--line); box-shadow: 0 10px 30px -18px rgba(45,30,10,.3); overflow: hidden; }
.hero-motif { position: absolute; top: 2px; right: 8px; width: 190px; opacity: .5; mix-blend-mode: multiply; pointer-events: none; }
.chead > *:not(.hero-motif) { position: relative; z-index: 1; }
.chead .kicker { font-family: var(--caps); font-size: 12px; letter-spacing: 5px; text-transform: uppercase; color: var(--gold-deep); }
.chead h1 { font-family: var(--brush); font-weight: 400; font-size: 56px; letter-spacing: 4px; color: var(--sumi); margin: 6px 0 2px; }
.chead .en-sub { font-family: var(--serif-en); font-style: italic; font-size: 16px; color: var(--muted); }
.chead .rule { display: flex; align-items: center; gap: 14px; max-width: 260px; margin: 14px auto 0; }
.chead .rule::before, .chead .rule::after { content: ""; height: 1px; flex: 1; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.chead .diamond { font-size: 11px; letter-spacing: 6px; color: var(--gold); }

.cgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(258px, 1fr)); gap: 24px; }
.ccard { cursor: pointer; border-radius: 6px 12px 12px 6px; overflow: hidden; background: linear-gradient(165deg, #fbf7ee, #f3ead9); border: 1px solid var(--line); box-shadow: 0 10px 26px -16px rgba(45,30,10,.4); transition: transform .28s cubic-bezier(.2,.7,.3,1), box-shadow .28s, border-color .28s; display: flex; flex-direction: column; }
.ccard:hover { transform: translateY(-6px); box-shadow: 0 22px 38px -18px rgba(45,30,10,.5); border-color: var(--sc, var(--gold)); }
.cover { position: relative; aspect-ratio: 16 / 10; overflow: hidden; }
.cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cover::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(45,30,10,.16)); }
.cseal { position: absolute; left: 14px; bottom: 12px; z-index: 2; width: 40px; height: 40px; border-radius: 7px; display: grid; place-items: center; font-family: var(--serif-cn); font-weight: 900; font-size: 22px; color: #fff8ec; background: linear-gradient(145deg, var(--sc), color-mix(in srgb, var(--sc) 62%, #000)); box-shadow: inset 0 0 0 1.5px rgba(255,248,236,.5), 0 3px 8px rgba(0,0,0,.3); }
.cbody { padding: 16px 18px 16px; display: flex; flex-direction: column; flex: 1; }
.cname b { font-family: var(--serif-cn); font-weight: 700; font-size: 20px; letter-spacing: 1px; color: var(--ink); display: block; }
.cname i { font-family: var(--serif-en); font-style: italic; font-size: 13px; color: var(--muted); }
.cdesc { font-family: var(--serif-cn); font-size: 13.5px; line-height: 1.55; color: var(--ink-soft, #4a3d2a); margin: 10px 0 14px; }
.cdesc .en { display: block; font-family: var(--serif-en); font-style: italic; font-size: 12px; color: var(--muted); margin-top: 2px; }
.cfoot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px dashed var(--line-soft); }
.vols { font-family: var(--caps); font-size: 11px; letter-spacing: 1.5px; color: var(--gold-deep); text-transform: uppercase; }
.enter { font-family: var(--serif-cn); font-size: 13px; color: var(--sc, var(--cinnabar-dk)); transition: transform .2s; }
.ccard:hover .enter { transform: translateX(3px); }
</style>
