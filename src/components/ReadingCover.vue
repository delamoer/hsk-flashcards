<template>
  <!-- 课外阅读书封：与课程选册页的书封同一画法（水墨立轴 + 系列色罩 + 订线 + 双框 + 大册号） -->
  <div class="book" :style="{ backgroundImage: bg }">
    <span class="stitch"><i></i><i></i><i></i><i></i></span>
    <span class="frame"></span>
    <span class="label">{{ book.band }}</span>
    <span class="top">{{ book.series }}</span>
    <span class="lvl">{{ book.level }}</span>
    <span class="ttl" :class="{ long: book.title.length > 6 }">{{ book.title }}</span>
    <span class="ttl-en">{{ book.titleEn }}</span>
    <div v-if="percent > 0" class="prog">
      <div class="bar"><i :style="{ width: percent + '%' }"></i></div>
      <div class="txt">已读 {{ percent }}%</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { readingCover } from "@/assets/img.js";

const props = defineProps({
  book: { type: Object, required: true }, // a readingBooks entry
  percent: { type: Number, default: 0 },
});
function hexA(hex, a) {
  const h = (hex || "#8b2a1f").replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
// 同 SeriesBooksView：上部留白让水墨透出，底部渐深压住册号/文字
const bg = computed(() => {
  const c = props.book.color;
  const tint = `linear-gradient(180deg, ${hexA(c, 0.06)} 0%, ${hexA(c, 0.2)} 42%, ${hexA(c, 0.7)} 74%, ${hexA(c, 0.92)} 100%)`;
  const img = readingCover[props.book.key];
  return img ? `${tint}, url(${img})` : tint;
});
</script>

<style scoped>
.book {
  position: relative; border-radius: 4px 8px 8px 4px; aspect-ratio: 3 / 4.15; padding: 20px 18px 18px 26px;
  color: #fbeecf; overflow: hidden; display: flex; flex-direction: column; text-align: left;
  background-color: #4a3d2a; background-size: cover; background-position: center 30%;
  box-shadow: 0 8px 20px -10px rgba(45,30,10,.5), inset 0 0 0 1px rgba(255,255,255,.12);
}
.book::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 14px; background: linear-gradient(90deg, rgba(0,0,0,.32), rgba(0,0,0,.05) 60%, rgba(255,255,255,.14)); }
.book::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(0,0,0,.12), transparent 26%, transparent 62%, rgba(0,0,0,.26)); }
.stitch { position: absolute; left: 6px; top: 24px; bottom: 24px; width: 2px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; z-index: 2; }
.stitch i { width: 4px; height: 4px; border-radius: 50%; background: rgba(251,238,207,.5); box-shadow: 0 0 0 1px rgba(0,0,0,.25); }
.frame { position: absolute; inset: 9px 9px 9px 18px; border: 1px solid rgba(251,238,207,.28); border-radius: 3px; pointer-events: none; }
.frame::after { content: ""; position: absolute; inset: 3px; border: 1px solid rgba(251,238,207,.14); border-radius: 2px; }
.top { position: relative; z-index: 2; font-family: var(--serif-cn); font-size: 11.5px; letter-spacing: 3px; text-shadow: 0 1px 3px rgba(0,0,0,.55); }
.lvl { position: relative; z-index: 2; margin: auto 0 4px; font-family: var(--serif-cn); font-weight: 900; font-size: 58px; line-height: .95; text-shadow: 0 2px 8px rgba(0,0,0,.5); }
.ttl { position: relative; z-index: 2; font-family: var(--serif-cn); font-weight: 600; font-size: 16px; letter-spacing: 2px; text-shadow: 0 1px 4px rgba(0,0,0,.5); }
.ttl.long { font-size: 14px; letter-spacing: 0; }
.ttl-en { position: relative; z-index: 2; margin-top: 1px; font-family: var(--serif-en); font-style: italic; font-size: 12.5px; line-height: 1.2; opacity: .9; text-shadow: 0 1px 4px rgba(0,0,0,.5); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.label { position: absolute; top: 14px; right: 12px; z-index: 3; padding: 3px 9px; border-radius: 2px; background: var(--cinnabar); color: #fbeecf; font-family: var(--serif-cn); font-weight: 700; font-size: 13px; letter-spacing: 1px; box-shadow: 0 2px 4px rgba(0,0,0,.3); }
.prog { position: relative; z-index: 2; margin-top: 9px; }
.prog .bar { height: 4px; border-radius: 99px; background: rgba(0,0,0,.22); overflow: hidden; }
.prog .bar i { display: block; height: 100%; border-radius: 99px; background: rgba(251,238,207,.85); }
.prog .txt { margin-top: 3px; font-family: var(--han); font-size: 10.5px; opacity: .85; letter-spacing: .5px; }
</style>
