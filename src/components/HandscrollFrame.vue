<template>
  <!-- 小手卷外框：两根带金色轴头的卷轴 + 装裱绫边的纸面（可衬一幅淡水墨）。
       与 /poems 长卷（PoemsView 的 .rod / .paper）同一套做法，用在课程总览 07 卡片和落地页的「卷中读诗」。 -->
  <div class="hsf" :class="{ vertical }">
    <span class="rod" aria-hidden="true"></span>
    <div class="paper">
      <img v-if="bg" class="wash" :src="bg" alt="" aria-hidden="true" />
      <div class="inner"><slot /></div>
    </div>
    <span class="rod" aria-hidden="true"></span>
  </div>
</template>

<script setup>
defineProps({
  bg: { type: String, default: "" }, // 淡水墨底图
  vertical: { type: Boolean, default: false }, // 窄屏改成上下两根轴（自上而下展开）
});
</script>

<style scoped>
.hsf { display: flex; align-items: stretch; min-width: 0; filter: drop-shadow(0 14px 18px rgba(45, 30, 10, 0.2)); }
.rod { position: relative; z-index: 2; flex: none; width: 18px; margin: -8px 0; border-radius: 5px;
  background: linear-gradient(90deg, #4a3420, #8a6a44 35%, #a4835a 50%, #6d5032 75%, #3d2a18); box-shadow: 0 4px 10px rgba(45, 30, 10, 0.35); }
.rod::before, .rod::after { content: ""; position: absolute; left: -4px; right: -4px; height: 11px; border-radius: 4px;
  background: linear-gradient(90deg, #5a4026, #c9a874 50%, #5a4026); }
.rod::before { top: -5px; }
.rod::after { bottom: -5px; }
.paper { position: relative; flex: 1; min-width: 0; overflow: hidden; background: var(--card) url("../assets/img/texture/paper.webp");
  border-top: 9px solid var(--strong); border-bottom: 9px solid var(--strong); box-shadow: inset 0 1px 0 var(--gold-lt), inset 0 -1px 0 var(--gold-lt); }
.wash { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.22; pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, #000, rgba(0, 0, 0, 0.5) 60%, transparent); mask-image: linear-gradient(180deg, #000, rgba(0, 0, 0, 0.5) 60%, transparent); }
.inner { position: relative; height: 100%; }

.vertical { flex-direction: column; }
.vertical .rod { width: auto; height: 16px; margin: 0 -6px;
  background: linear-gradient(180deg, #4a3420, #8a6a44 35%, #a4835a 50%, #6d5032 75%, #3d2a18); }
.vertical .rod::before, .vertical .rod::after { top: -3px; bottom: -3px; height: auto; width: 11px; left: auto; right: auto;
  background: linear-gradient(180deg, #5a4026, #c9a874 50%, #5a4026); }
.vertical .rod::before { left: -4px; }
.vertical .rod::after { right: -4px; }
.vertical .paper { border-top: 0; border-bottom: 0; border-left: 8px solid var(--strong); border-right: 8px solid var(--strong);
  box-shadow: inset 1px 0 0 var(--gold-lt), inset -1px 0 0 var(--gold-lt); }
</style>
