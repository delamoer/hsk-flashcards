<template>
  <!-- 诗签：古诗词长卷 / 主题 / 意象 / 搜索平铺共用。整张是进诗页的链接（预渲染靠 router-link 改写成真实地址）。
       结构固定：题目（长题拆出小字副题）· 拼音 · 英文题（最多三行，不截断）· 作者（中文 + 英文，永不截断）
       · 虚线 · 底行「首句 + 难度签」——难度签挪到底行，作者行独占整宽，手机上各签面也能对齐。 -->
  <router-link
    class="slip"
    :class="{ 'has-sub': parts.sub }"
    :to="{ name: 'poem', params: { slug: poem.slug } }"
    :title="`${poem.title} · ${poem.author}`"
  >
    <span class="t" :class="sizeClass">{{ parts.main }}</span>
    <span v-if="parts.sub" class="tsub">{{ parts.sub }}</span>
    <span class="tpy">{{ poem.titlePy }}</span>
    <span class="ten">{{ poem.titleEn }}</span>
    <span class="au">
      <span class="zh">{{ who.zh }}</span>
      <i class="en">{{ who.en }}</i>
      <span v-if="who.src" class="src">{{ who.src }}</span>
    </span>
    <span class="foot">
      <span class="first">{{ poem.first }}</span>
      <span class="lvl" :class="lv[0]" :title="`${poem.level} ${lv[1]}`">{{ poem.level }}</span>
    </span>
  </router-link>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({ poem: { type: Object, required: true } });

const LV = { 入门: ["l1", "Beginner"], 进阶: ["l2", "Intermediate"], 挑战: ["l3", "Advanced"] };
const lv = computed(() => LV[props.poem.level] || ["l1", ""]);

// 长题拆成「主题 + 小字副题」：词牌（首句）/ 诗题·其三 / 词牌·题
const parts = computed(() => {
  const t = props.poem.title;
  const m = t.match(/^(.+?)（(.+)）$/);
  if (m) return { main: m[1], sub: `（${m[2]}）` };
  const i = t.indexOf("·");
  if (i > 0) return { main: t.slice(0, i), sub: `· ${t.slice(i + 1)}` };
  return { main: t, sub: "" };
});
const sizeClass = computed(() => {
  const n = parts.value.main.length;
  return n >= 9 ? "s3" : n >= 8 ? "s2" : n >= 7 ? "s1" : "";
});

// 作者：「佚名（汉乐府）」拆成 佚名 Anonymous + 小字出处
const who = computed(() => {
  const p = props.poem;
  const m = p.author.match(/^(.+?)（(.+)）$/);
  if (!m) return { zh: p.author, en: p.authorEn, src: "" };
  const me = p.authorEn.match(/^(.+?)\s*\((.+)\)$/);
  return {
    zh: m[1],
    en: me ? me[1] : p.authorEn,
    src: m[2].replace(/[《》]/g, "") + (me ? ` · ${me[2]}` : ""),
  };
});
</script>

<style scoped>
.slip {
  position: relative; display: flex; flex-direction: column; min-width: 0;
  height: var(--slip-h, 200px); padding: 14px 16px 11px;
  background: rgba(251, 247, 238, 0.95); border: 1px solid var(--line); border-radius: 3px;
  box-shadow: inset 0 0 0 3px var(--card), inset 0 0 0 4px var(--line-soft), 0 2px 8px rgba(45, 30, 10, 0.06);
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
  color: inherit; text-decoration: none;
}
.slip:hover {
  transform: translateY(-3px); border-color: var(--border-strong);
  box-shadow: inset 0 0 0 3px var(--card), inset 0 0 0 4px var(--line), var(--sh-card);
}
.slip:focus-visible { outline: 2px solid var(--cinnabar); outline-offset: 2px; }
.t { flex: none; font: 700 20px/1.3 var(--serif-cn); color: var(--ink); letter-spacing: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.t.s2 { font-size: 18px; letter-spacing: 0.5px; }
.t.s3 { font-size: 16.5px; letter-spacing: 0; }
.tsub { flex: none; font: 500 13px/1.35 var(--serif-cn); color: var(--body); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tpy { flex: none; margin-top: 2px; font: 600 12px/1.4 var(--ui); color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* 英文题：小一号，最多三行（最长的「江城子」也放得下），不加省略号 */
.ten { flex: none; margin-top: 3px; font: 600 14px/16px var(--caps); color: var(--gold-deep); }
.au { flex: none; margin-top: 6px; font: 500 13px/1.4 var(--serif-cn); color: var(--body); }
.au .en { margin-left: 4px; font: 400 12.5px var(--ui); font-style: normal; color: var(--muted); }
.au .src { display: block; font: 400 12px/1.35 var(--ui); color: var(--muted-soft); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.foot { margin-top: auto; padding-top: 7px; border-top: 1px dashed var(--line); display: flex; align-items: center; gap: 8px; }
.first { flex: 1; min-width: 0; font: 500 16px/1.4 "Kaiti SC", "STKaiti", "KaiTi", var(--serif-cn); color: var(--sumi); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lvl { flex: none; padding: 3px 5px; border-radius: 3px; font: 700 11.5px/1 var(--serif-cn); letter-spacing: 1px; }
.lvl.l1 { color: var(--jade); box-shadow: inset 0 0 0 1px var(--jade); }
.lvl.l2 { color: #8a6210; box-shadow: inset 0 0 0 1px var(--accent); }
.lvl.l3 { color: #fbf1e6; background: var(--cinnabar); }

@media (max-width: 820px) {
  .slip { height: auto; min-height: 0; padding: 12px 12px 10px; }
  .t { font-size: 18px; letter-spacing: 0; white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .t.s1 { font-size: 16.5px; }
  .t.s2, .t.s3 { font-size: 15.5px; }
  /* 手机：作者中文、英文各占一行，所有签面同样的骨架 */
  .au .en { display: block; margin-left: 0; }
  .first { font-size: 15px; }
}
</style>
