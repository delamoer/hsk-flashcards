<template>
  <div class="hubwrap" v-if="lesson">
    <div class="crumb">
      <router-link to="/">课程总览 Library</router-link><span class="sep">◇</span>
      <router-link v-if="!series?.single" :to="`/course/${seriesId}`">{{ series?.heroTitle }}</router-link>
      <span v-if="!series?.single" class="sep">◇</span>
      <router-link :to="`/course/${seriesId}/${unitId}`">{{ unitLabel }}</router-link><span class="sep">◇</span>
      <span class="cur">第 {{ numCn(lesson.num) }} 课 Lesson {{ pad(lesson.num) }}</span>
    </div>

    <div class="hub-top">
      <div class="htitle">
        <h2>{{ lesson.title }}</h2>
        <div class="en">{{ lesson.titleEn }}</div>
      </div>
      <router-link class="switcher" :to="`/course/${seriesId}/${unitId}`">
        <div class="lbl">Switch Lesson</div>
        <div class="val">{{ unitLabel }} · L{{ pad(lesson.num) }}</div>
      </router-link>
    </div>

    <div class="tabs">
      <button v-for="t in tabs" :key="t.key" :class="{ active: tab === t.key }" @click="tab = t.key">
        {{ t.cn }}<span class="en">{{ t.en }}</span>
      </button>
    </div>

    <div class="tabpane">
      <ReadPanel v-if="tab === 'read'" :series="seriesId" :unit="unitId" :lesson="lesson.num" />
      <FlashcardsPanel v-else-if="tab === 'cards'" :series="seriesId" :unit="unitId" :lesson="lesson.num" />
      <ExercisesPanel v-else-if="tab === 'exercises'" :series="seriesId" :unit="unitId" :lesson="lesson.num" />
      <GrammarNotesPanel v-else-if="tab === 'grammar'" :series="seriesId" :unit="unitId" :lesson="lesson.num" />
      <div v-else class="placeholder">
        <div class="diamond">◇ ◇ ◇</div>
        <h3>{{ activeTab.cn }}</h3>
        <div class="en">{{ activeTab.en }}</div>
        <p>{{ activeTab.note }}（敬请期待 · Coming soon）</p>
      </div>
    </div>
  </div>
  <div class="hubwrap" v-else-if="loading"><p class="muted">加载中… · Loading…</p></div>
  <div class="hubwrap" v-else><p class="muted">课程不存在 · Not found.</p></div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import ReadPanel from "@/components/ReadPanel.vue";
import FlashcardsPanel from "@/components/FlashcardsPanel.vue";
import ExercisesPanel from "@/components/ExercisesPanel.vue";
import GrammarNotesPanel from "@/components/GrammarNotesPanel.vue";
import { getLesson } from "@/data";
import { getSeries } from "@/data/courses.js";

const props = defineProps({
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
  lesson: { type: [Number, String], required: true },
});

const seriesId = computed(() => props.series);
const unitId = computed(() => props.unit);
const series = computed(() => getSeries(props.series));
const unitLabel = computed(() => {
  const u = series.value?.units.find((x) => x.id === Number(props.unit));
  return u?.label || `Unit ${props.unit}`;
});

const lesson = ref(null);
const loading = ref(true);
const tab = ref("read");

const tabs = [
  { key: "read", cn: "课文", en: "Read" },
  { key: "cards", cn: "生词表·闪卡", en: "Flashcards" },
  { key: "vocab", cn: "词汇详解", en: "Vocabulary", note: "逐词讲解字义、词性、例句与常见搭配。" },
  { key: "grammar", cn: "语法", en: "Grammar", note: "本课语法点与句型练习。" },
  { key: "exercises", cn: "练习", en: "Exercises", note: "生词挖空、连词成句等互动练习。" },
  { key: "discussion", cn: "话题讨论", en: "Discussion", note: "围绕本课主题的开放讨论与口语拓展。" },
];
const activeTab = computed(() => tabs.find((t) => t.key === tab.value) || tabs[0]);

watch(
  () => [props.series, props.unit, props.lesson],
  async ([s, u, l]) => {
    loading.value = true;
    tab.value = "read";
    lesson.value = await getLesson(s, u, l);
    loading.value = false;
  },
  { immediate: true }
);

function pad(n) {
  return String(n).padStart(2, "0");
}
const DIG = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
function numCn(n) {
  if (n <= 10) return n === 10 ? "十" : DIG[n];
  if (n < 20) return "十" + DIG[n - 10];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return DIG[t] + "十" + (o ? DIG[o] : "");
  }
  return String(n);
}
</script>

<style scoped>
.hubwrap { max-width: 1180px; margin: 0 auto; padding: 0 32px 72px; }
.muted { color: var(--muted); font-weight: 600; padding: 40px 0; }

.crumb { display: flex; align-items: center; gap: 9px; font-size: 13px; color: var(--muted); padding: 20px 0 4px; font-family: var(--serif-cn); flex-wrap: wrap; }
.crumb a { color: var(--muted); transition: .2s; border-bottom: 1px dotted transparent; }
.crumb a:hover { color: var(--cinnabar-dk); border-bottom-color: var(--cinnabar); }
.crumb .sep { color: var(--gold); font-size: 11px; }
.crumb .cur { color: var(--ink); font-weight: 600; }

.hub-top { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; padding: 10px 0 18px; }
.htitle h2 { font-family: var(--serif-cn); font-weight: 900; font-size: 56px; letter-spacing: 4px; line-height: 1; color: var(--ink); }
.htitle .en { font-size: 15px; color: var(--muted); margin-top: 6px; }
.switcher { flex: 0 0 auto; background: var(--paper-2); border: 1px solid var(--line); border-radius: 9px; padding: 10px 16px; text-align: center; box-shadow: 0 2px 6px -4px var(--shadow, rgba(45,30,10,.14)); }
.switcher .lbl { font-family: var(--caps); font-size: 9.5px; letter-spacing: 2px; color: var(--muted); }
.switcher .val { font-family: var(--serif-cn); font-weight: 600; font-size: 15px; color: var(--ink); margin-top: 2px; }
.switcher .val::after { content: " ▾"; color: var(--gold-deep); }

.tabs { display: flex; gap: 2px; border-bottom: 2px solid var(--gold); flex-wrap: wrap; margin-bottom: 4px; }
.tabs button { font-family: var(--serif-cn); font-size: 15px; letter-spacing: 1px; padding: 11px 18px 12px; color: var(--ink-soft, #4a3d2a); border-radius: 8px 8px 0 0; transition: .2s; position: relative; top: 2px; }
.tabs button .en { display: block; font-family: var(--caps); font-size: 9px; letter-spacing: 1.5px; color: var(--muted); margin-top: 1px; }
.tabs button:hover { background: var(--paper-3); }
.tabs button.active { background: linear-gradient(180deg, #fbf6ec, #f3ead9); color: var(--cinnabar-dk); border: 2px solid var(--gold); border-bottom-color: transparent; }
.tabs button.active .en { color: var(--cinnabar); }

.placeholder { text-align: center; padding: 70px 20px; color: var(--muted); }
.placeholder .diamond { color: var(--gold); letter-spacing: 6px; margin-bottom: 14px; }
.placeholder h3 { font-family: var(--serif-cn); font-size: 28px; color: var(--ink-soft, #4a3d2a); letter-spacing: 2px; }
.placeholder .en { font-family: var(--serif-en); font-style: italic; font-size: 16px; margin-top: 4px; }
.placeholder p { max-width: 420px; margin: 14px auto 0; font-size: 14px; }

@media (max-width: 720px) {
  .htitle h2 { font-size: 40px; }
}
</style>
