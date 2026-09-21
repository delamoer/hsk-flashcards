<template>
  <div class="fcpanel">
    <template v-if="words.length">
      <!-- toolbar -->
      <div class="fc-toolbar">
        <div class="modes">
          <button :class="{ on: mode === 'grid' }" @click="mode = 'grid'">▦ 网格<i>Grid</i></button>
          <button :class="{ on: mode === 'focus' }" @click="mode = 'focus'">◉ 专注<i>Focus</i></button>
        </div>
        <label class="search">
          <input v-model="search" placeholder="搜索 汉字 / 拼音 / 英文…" />
        </label>
        <button class="tone" :class="{ on: settings.toneColors }" @click="settings.toneColors = !settings.toneColors">
          声调色<b>{{ settings.toneColors ? 'ON' : 'OFF' }}</b>
        </button>
        <router-link class="tbtn primary" :to="`/course/${series}/${unit}/lesson/${lesson}/quiz`">自测<i>Quiz</i></router-link>
        <router-link class="tbtn" :to="`/course/${series}/${unit}/lesson/${lesson}/print`">打印<i>Print</i></router-link>
      </div>

      <!-- filter chips -->
      <div class="fc-chips">
        <button v-for="f in filters" :key="f.key" class="chip" :class="{ on: filter === f.key }" @click="filter = f.key">
          {{ f.label }}<span class="n">{{ counts[f.key] }}</span>
        </button>
      </div>

      <!-- GRID -->
      <div v-if="filtered.length === 0" class="empty">没有符合条件的词 · No matching words.</div>
      <div v-else-if="mode === 'grid'" class="grid-cards">
        <FlashCard v-for="w in filtered" :key="w.id" :word="w" :tag="unitLabel" full />
      </div>

      <!-- FOCUS -->
      <div v-else class="focus">
        <div class="counter">{{ focusIndex + 1 }} / {{ filtered.length }}</div>
        <div class="stage">
          <button class="navbtn" @click="move(-1)" aria-label="prev">‹</button>
          <FlashCard :word="filtered[focusIndex]" :tag="unitLabel" full focus />
          <button class="navbtn" @click="move(1)" aria-label="next">›</button>
        </div>
        <div class="dots">
          <span v-for="(w, i) in filtered" :key="w.id" class="dot" :class="{ on: i === focusIndex }" @click="focusIndex = i"></span>
        </div>
        <p class="hint">← → 键切换 · 点卡片翻面 · Arrow keys to switch</p>
      </div>
    </template>

    <div v-else-if="loading" class="placeholder"><div class="diamond">◇ ◇ ◇</div><p>加载中… · Loading…</p></div>
    <div v-else class="placeholder"><div class="diamond">◇ ◇ ◇</div><p>本课暂无生词 · No words.</p></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import FlashCard from "@/components/FlashCard.vue";
import { getLesson, matchWord } from "@/data";
import { getSeries } from "@/data/courses.js";
import { useProgress } from "@/composables/useProgress";
import { useSettings } from "@/composables/useSettings";

const props = defineProps({
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
  lesson: { type: [Number, String], required: true },
});

const { settings } = useSettings();
const { statusOf, isStarred } = useProgress();

const words = ref([]);
const loading = ref(true);
const mode = ref("grid");
const filter = ref("all");
const search = ref("");
const focusIndex = ref(0);

const unitLabel = computed(() => {
  const u = getSeries(props.series)?.units.find((x) => x.id === Number(props.unit));
  return u?.label || "";
});

watch(
  () => [props.series, props.unit, props.lesson],
  async ([s, u, l]) => {
    loading.value = true;
    focusIndex.value = 0;
    filter.value = "all";
    search.value = "";
    const lesson = await getLesson(s, u, l);
    words.value = lesson?.words || [];
    loading.value = false;
  },
  { immediate: true }
);

const filters = [
  { key: "all", label: "全部 All" },
  { key: "review", label: "需复习 Review" },
  { key: "known", label: "已掌握 Got it" },
  { key: "star", label: "★ 收藏 Saved" },
];
const counts = computed(() => ({
  all: words.value.length,
  review: words.value.filter((w) => statusOf(w.id) === "review").length,
  known: words.value.filter((w) => statusOf(w.id) === "known").length,
  star: words.value.filter((w) => isStarred(w.id)).length,
}));
const filtered = computed(() => {
  const q = search.value.trim();
  return words.value.filter((w) => {
    if (filter.value === "review" && statusOf(w.id) !== "review") return false;
    if (filter.value === "known" && statusOf(w.id) !== "known") return false;
    if (filter.value === "star" && !isStarred(w.id)) return false;
    return matchWord(w, q);
  });
});
watch(filtered, () => {
  if (focusIndex.value >= filtered.value.length) focusIndex.value = 0;
});

function move(d) {
  const n = filtered.value.length;
  if (!n) return;
  focusIndex.value = (focusIndex.value + d + n) % n;
}
function onKey(e) {
  if (mode.value !== "focus") return;
  if (e.key === "ArrowLeft") move(-1);
  else if (e.key === "ArrowRight") move(1);
}
onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<style scoped>
.fcpanel { padding: 26px 0 20px; }

/* toolbar */
.fc-toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.modes { display: inline-flex; background: var(--paper-3); border: 1px solid var(--line); border-radius: 8px; padding: 4px; gap: 4px; }
.modes button { display: inline-flex; flex-direction: column; line-height: 1.1; font-family: var(--serif-cn); font-weight: 600; font-size: 14px; padding: 6px 16px; border-radius: 6px; color: var(--ink-soft, #4a3d2a); transition: .2s; }
.modes button i { font-style: normal; font-family: var(--caps); font-size: 8.5px; letter-spacing: 1.4px; text-transform: uppercase; color: var(--muted); }
.modes button.on { background: linear-gradient(145deg, #c0392b, #8b2a1f); color: #fbeecf; box-shadow: 0 2px 5px -1px rgba(139,42,31,.4); }
.modes button.on i { color: rgba(251,238,207,.85); }
.search { flex: 1; min-width: 160px; }
.search input { width: 100%; font-family: var(--han); font-size: 14px; padding: 9px 14px; border: 1px solid var(--line); border-radius: 8px; background: var(--paper); color: var(--ink); }
.search input:focus { outline: none; border-color: var(--gold); }
.tone { display: inline-flex; align-items: center; gap: 7px; font-family: var(--serif-cn); font-size: 13px; padding: 8px 14px; border: 1px solid var(--line); border-radius: 8px; background: var(--paper); color: var(--ink-soft, #4a3d2a); }
.tone b { font-family: var(--caps); font-size: 10px; letter-spacing: 1px; color: var(--muted); }
.tone.on { border-color: var(--gold); }
.tone.on b { color: var(--jade); }
.tbtn { display: inline-flex; flex-direction: column; line-height: 1.1; font-family: var(--serif-cn); font-weight: 600; font-size: 14px; padding: 8px 16px; border-radius: 8px; border: 1px solid var(--line); background: var(--paper); color: var(--ink-soft, #4a3d2a); transition: .2s; }
.tbtn i { font-style: normal; font-family: var(--caps); font-size: 8.5px; letter-spacing: 1.4px; text-transform: uppercase; color: var(--muted); }
.tbtn:hover { border-color: var(--gold); }
.tbtn.primary { background: linear-gradient(145deg, #c0392b, #8b2a1f); color: #fbeecf; border-color: var(--cinnabar-dk); }
.tbtn.primary i { color: rgba(251,238,207,.85); }

/* chips */
.fc-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.chip { display: inline-flex; align-items: center; gap: 7px; font-family: var(--serif-cn); font-size: 13px; padding: 6px 14px; border: 1px solid var(--line); border-radius: 99px; background: var(--paper); color: var(--ink-soft, #4a3d2a); transition: .2s; }
.chip .n { font-family: var(--caps); font-size: 11px; color: var(--muted); }
.chip.on { background: var(--gold); color: #fff8ea; border-color: var(--gold-deep); }
.chip.on .n { color: rgba(255,248,234,.85); }

.grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 18px; }

.focus { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 8px 0; }
.counter { font-family: var(--caps); font-size: 12px; letter-spacing: 2px; color: var(--gold-deep); }
.stage { display: flex; align-items: center; gap: 18px; }
.navbtn { width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--line); background: var(--paper); color: var(--gold-deep); font-size: 22px; line-height: 1; transition: .2s; }
.navbtn:hover { background: var(--gold); color: #fff8ea; border-color: var(--gold-deep); }
.dots { display: flex; gap: 6px; flex-wrap: wrap; max-width: 360px; justify-content: center; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--line); cursor: pointer; transition: .2s; }
.dot.on { background: var(--cinnabar); transform: scale(1.25); }
.hint { font-size: 12px; color: var(--muted); }

.empty { text-align: center; padding: 50px 20px; color: var(--muted); }
.placeholder { text-align: center; padding: 70px 20px; color: var(--muted); }
.placeholder .diamond { color: var(--gold); letter-spacing: 6px; margin-bottom: 14px; }
</style>
