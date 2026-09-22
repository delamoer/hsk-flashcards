<template>
  <div class="libwrap">
    <!-- 课程总览 · 书函陈列 -->
    <div class="hero-app">
      <div class="brand-seal">學</div>
      <div class="kicker">Learn Chinese · Curriculum Library</div>
      <div class="plaque">
        <span class="pc a"></span><span class="pc b"></span><span class="pc c"></span><span class="pc d"></span>
        <h1>学中文</h1>
      </div>
      <div class="cn-sub">课本典藏 · 择一而学</div>
      <div class="en-sub">A shelf of classics — pick your path</div>
      <div class="rule"><span class="diamond">◇ ◇ ◇</span></div>
    </div>

    <div class="series-grid">
      <div
        v-for="s in seriesList"
        :key="s.id"
        class="func"
        :style="{ '--sc': s.seriesColor }"
        @click="pick(s)"
      >
        <span class="stitch"><i></i><i></i><i></i><i></i></span>
        <span class="frame"></span>
        <div class="func-top">
          <div class="fseal">{{ s.seal.cn }}<small>{{ s.seal.en }}</small></div>
          <div class="func-name">
            <div class="cn">{{ s.heroTitle }}<span class="fbadge" v-html="s.badgeHtml || ''"></span></div>
            <div class="en">{{ s.nameEn }}</div>
          </div>
          <div class="vols"><div class="n">{{ s.units.length }}</div><div class="u">{{ s.volUnit }}</div></div>
        </div>
        <div class="func-desc">{{ s.desc }}<span class="en">{{ s.descEn }}</span></div>
        <div class="func-foot">
          <span class="spines"><i v-for="i in spineCount(s)" :key="i" :style="{ height: 12 + ((i * 5) % 11) + 'px' }"></i></span>
          <span class="open">开卷 · 选册 →</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { courseRegistry } from "@/data";

const router = useRouter();
const seriesList = courseRegistry;

function spineCount(s) {
  return Math.min(6, s.units.length || 1);
}
function pick(s) {
  // 单册系列直达课次，跳过选册
  if (s.single) router.push(`/course/${s.id}/${s.units[0].id}`);
  else router.push(`/course/${s.id}`);
}
</script>

<style scoped>
.libwrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 32px 72px;
}

/* hero —— 牌匾·留白 · 鎏金流光 (lacquer plaque on parchment) */
.hero-app {
  text-align: center; padding: 44px 24px 36px; position: relative;
  margin: 18px 0 6px; border-radius: 14px; overflow: hidden;
  background: linear-gradient(180deg, #faf4e9, #f1e7d4);
  border: 1px solid var(--line);
  box-shadow: 0 10px 30px -18px rgba(45,30,10,.3);
}
.brand-seal {
  width: 66px; height: 66px; margin: 2px auto 18px; border-radius: 10px;
  background: linear-gradient(145deg, #c0392b, #8b2a1f); color: #fbe7d4;
  font-family: var(--serif-cn); font-weight: 900; font-size: 38px;
  display: grid; place-items: center; position: relative;
  box-shadow: inset 0 0 0 2px rgba(251,231,212,.5), 0 0 0 2px var(--gold), 0 4px 10px rgba(139,42,31,.35);
}
.brand-seal::after { content: ""; position: absolute; inset: 7px; border: 1px solid rgba(251,231,212,.35); border-radius: 5px; }
.kicker { font-family: var(--caps); font-size: 12px; letter-spacing: 5px; color: var(--gold-deep); text-transform: uppercase; }

/* 牌匾 plaque */
.plaque {
  position: relative; display: inline-block; padding: 16px 52px; margin: 14px 0 2px; border-radius: 8px;
  background: linear-gradient(180deg, #5c1b12, #40130c); border: 2px solid var(--gold);
  box-shadow: 0 12px 28px -12px rgba(50,10,6,.6), inset 0 1px 0 rgba(255,220,180,.15);
}
.plaque::before { content: ""; position: absolute; inset: 5px; border: 1px solid rgba(240,201,106,.5); border-radius: 5px; pointer-events: none; }
.plaque .pc { position: absolute; width: 15px; height: 15px; border: 2px solid #f3d786; opacity: .85; }
.plaque .pc.a { left: 10px; top: 10px; border-right: none; border-bottom: none; }
.plaque .pc.b { right: 10px; top: 10px; border-left: none; border-bottom: none; }
.plaque .pc.c { left: 10px; bottom: 10px; border-right: none; border-top: none; }
.plaque .pc.d { right: 10px; bottom: 10px; border-left: none; border-top: none; }
.hero-app h1 {
  position: relative; margin: 0; font-family: var(--serif-cn); font-weight: 900;
  font-size: 56px; line-height: 1; letter-spacing: 8px;
  background: linear-gradient(100deg, #cf9d38 0%, #f7dd96 42%, #fff4d2 50%, #f7dd96 58%, #cf9d38 100%);
  background-size: 220% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 1px 1px rgba(0,0,0,.25);
  animation: gilt 6.5s ease-in-out infinite;
}
@keyframes gilt { 0%, 100% { background-position: 120% 0; } 50% { background-position: -20% 0; } }
@media (prefers-reduced-motion: reduce) { .hero-app h1 { animation: none; background-position: 50% 0; } }

.cn-sub { font-family: var(--serif-cn); font-size: 19px; letter-spacing: 3px; color: var(--ink-soft, #4a3d2a); margin-top: 16px; margin-bottom: 4px; }
.en-sub { font-family: var(--serif-en); font-style: italic; font-size: 16px; letter-spacing: 1.5px; color: var(--muted); }
.rule { display: flex; align-items: center; gap: 14px; color: var(--gold); max-width: 300px; margin: 20px auto 0; }
.rule::before, .rule::after { content: ""; height: 1px; flex: 1; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.diamond { font-size: 12px; letter-spacing: 6px; color: var(--gold); }

/* series 书函卡 */
.series-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 26px; margin-top: 44px; }
@media (max-width: 820px) { .series-grid { grid-template-columns: 1fr; } }
.func {
  position: relative; cursor: pointer; border-radius: 6px 12px 12px 6px; overflow: hidden;
  background: linear-gradient(160deg, #fbf7ee, #f0e6d3); border: 1px solid var(--line);
  padding: 30px 30px 28px 40px; min-height: 196px; display: flex; flex-direction: column;
  box-shadow: 0 6px 18px -10px var(--shadow, rgba(45,30,10,.14));
  transition: transform .28s cubic-bezier(.2,.7,.3,1), box-shadow .28s, border-color .28s;
}
.func:hover { transform: translateY(-6px); box-shadow: 0 20px 34px -16px rgba(45,30,10,.4); border-color: var(--sc, var(--gold)); }
.func::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 16px; background: var(--sc, #c0392b); }
.func .stitch { position: absolute; left: 6px; top: 34px; bottom: 34px; width: 2px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; z-index: 3; }
.func .stitch i { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,.55); box-shadow: 0 0 0 1px rgba(0,0,0,.18); }
.func .frame { position: absolute; inset: 11px 11px 11px 24px; border: 1px solid var(--line-soft); border-radius: 6px; pointer-events: none; }
.func-top { display: flex; align-items: flex-start; gap: 16px; position: relative; z-index: 2; }
.fseal {
  width: 58px; height: 58px; flex: 0 0 auto; border-radius: 8px; background: var(--sc, #c0392b); color: #fff8ec;
  font-family: var(--serif-cn); font-weight: 900; font-size: 24px; line-height: 1.08;
  display: grid; place-items: center; text-align: center;
  box-shadow: inset 0 0 0 2px rgba(255,248,236,.55), 0 3px 7px rgba(0,0,0,.22); position: relative;
}
.fseal::after { content: ""; position: absolute; inset: 6px; border: 1px solid rgba(255,248,236,.4); border-radius: 4px; }
.fseal small { display: block; font-size: 12px; font-weight: 600; letter-spacing: 1px; }
.func-name { flex: 1; min-width: 0; }
.func-name .cn { font-family: var(--serif-cn); font-weight: 700; font-size: 26px; letter-spacing: 2px; color: var(--ink); display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.func-name .en { font-family: var(--serif-en); font-style: italic; font-size: 15px; color: var(--muted); letter-spacing: .5px; margin-top: 2px; }
.vols { flex: 0 0 auto; text-align: right; font-family: var(--caps); }
.vols .n { font-size: 30px; font-weight: 700; color: var(--sc, var(--gold-deep)); line-height: 1; }
.vols .u { font-size: 9.5px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
.func-desc { position: relative; z-index: 2; margin-top: 16px; color: var(--ink-soft, #4a3d2a); font-size: 14px; line-height: 1.55; }
.func-desc .en { color: var(--muted); font-size: 12.5px; font-family: var(--serif-en); font-style: italic; letter-spacing: .3px; display: block; margin-top: 1px; }
.func-foot { position: relative; z-index: 2; margin-top: auto; padding-top: 16px; display: flex; align-items: center; justify-content: space-between; }
.spines { display: flex; gap: 3px; align-items: flex-end; height: 22px; }
.spines i { width: 6px; border-radius: 1px; background: var(--sc, #c0392b); opacity: .28; }
.func:hover .spines i { opacity: .5; }
.open { font-family: var(--caps); font-size: 11px; letter-spacing: 2px; color: var(--sc, var(--gold-deep)); display: inline-flex; align-items: center; gap: 6px; transition: .25s; }
.func:hover .open { transform: translateX(3px); }
.fbadge { display: inline-flex; gap: 6px; }
.fbadge :deep(.tag-new) { background: var(--cinnabar); color: #fbe7d4; font-family: var(--caps); font-size: 10px; letter-spacing: 1.5px; padding: 2px 7px; border-radius: 3px; font-weight: 600; }
.fbadge :deep(.tag-30) { background: var(--gold-deep); color: #fff8ea; font-family: var(--caps); font-size: 10px; letter-spacing: 1px; padding: 2px 7px; border-radius: 3px; font-weight: 600; }
</style>
