<template>
  <div class="wrap" v-if="lesson">
    <div class="crumb">
      <router-link to="/">首页</router-link><span class="sep">/</span>
      <router-link :to="`/course/${series}/${unit}`">{{ unitLabel }}</router-link><span class="sep">/</span>
      <span class="cur">第 {{ lesson.num }} 课 · {{ lesson.title }}</span>
    </div>

    <div class="lessonhead">
      <div>
        <h2 class="han">{{ lesson.title }}</h2>
        <p class="te">{{ lesson.titleEn }}</p>
      </div>
      <ProgressRing :percent="percent" :size="56" />
    </div>

    <!-- toolbar -->
    <div class="toolbar">
      <label class="search">
        <span>🔍</span>
        <input v-model="search" placeholder="搜索汉字 / 拼音 / 英文…  Search…" />
      </label>
      <div class="toggle">
        <button :class="{ on: mode === 'grid' }" @click="mode = 'grid'">▦ 网格 Grid</button>
        <button :class="{ on: mode === 'focus' }" @click="mode = 'focus'">◉ 专注 Focus</button>
      </div>
      <router-link :to="`/course/${series}/${unit}/lesson/${lesson.num}/quiz`" class="btn primary">
        自测 Quiz
      </router-link>
      <router-link :to="`/course/${series}/${unit}/lesson/${lesson.num}/print`" class="btn secondary">
        🖨 打印 Print
      </router-link>
    </div>

    <div class="chips">
      <button
        v-for="f in filters"
        :key="f.key"
        class="chip"
        :class="{ on: filter === f.key }"
        @click="filter = f.key"
      >
        {{ f.label }}
        <span class="n">{{ counts[f.key] }}</span>
      </button>
    </div>

    <!-- empty -->
    <div v-if="!filtered.length" class="empty">
      <p>没有匹配的词语</p>
      <p class="muted">No matching words</p>
    </div>

    <!-- grid -->
    <div v-else-if="mode === 'grid'" class="grid-cards">
      <FlashCard
        v-for="w in filtered"
        :key="w.id"
        :word="w"
        :level="unit"
        full
      />
    </div>

    <!-- focus -->
    <div v-else class="focus">
      <div class="counter">{{ focusIndex + 1 }} / {{ filtered.length }}</div>
      <div class="stage">
        <button class="navbtn" @click="move(-1)" aria-label="Previous">‹</button>
        <FlashCard :word="filtered[focusIndex]" :level="unit" full focus />
        <button class="navbtn" @click="move(1)" aria-label="Next">›</button>
      </div>
      <div class="dots">
        <span
          v-for="(w, i) in filtered"
          :key="w.id"
          class="dot"
          :class="{ on: i === focusIndex }"
          @click="focusIndex = i"
        ></span>
      </div>
      <p class="muted hintline">← → 键切换 · 点卡片翻转 · Use arrow keys</p>
    </div>
  </div>

  <div class="wrap" v-else>
    <p class="muted">课程不存在 · Lesson not found.</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import FlashCard from "@/components/FlashCard.vue";
import ProgressRing from "@/components/ProgressRing.vue";
import { getLesson } from "@/data";
import { getSeries } from "@/data/courses.js";
import { useProgress } from "@/composables/useProgress";

const props = defineProps({
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
  lesson: { type: [Number, String], required: true },
});

const { statusOf, isStarred, summarize } = useProgress();

const lesson = computed(() => getLesson(props.series, props.unit, props.lesson));
const words = computed(() => (lesson.value ? lesson.value.words : []));

const seriesMeta = computed(() => getSeries(props.series));
const unitLabel = computed(() => {
  const u = seriesMeta.value?.units.find((u) => u.id === Number(props.unit));
  return u?.label || `Unit ${props.unit}`;
});

const mode = ref("grid");
const search = ref("");
const filter = ref("all");
const focusIndex = ref(0);

const filters = [
  { key: "all", label: "全部 All" },
  { key: "review", label: "需复习 Review" },
  { key: "known", label: "已掌握 Got it" },
  { key: "star", label: "⭐ 收藏 Saved" },
];

const counts = computed(() => {
  const s = summarize(words.value);
  return { all: s.total, review: s.review, known: s.known, star: s.star };
});

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim();
  return words.value.filter((w) => {
    if (filter.value === "review" && statusOf(w.id) !== "review") return false;
    if (filter.value === "known" && statusOf(w.id) !== "known") return false;
    if (filter.value === "star" && !isStarred(w.id)) return false;
    if (!q) return true;
    return (
      w.hanzi.includes(q) ||
      w.pinyin.toLowerCase().includes(q) ||
      (w.meaning || "").toLowerCase().includes(q)
    );
  });
});

watch(filtered, (list) => {
  if (focusIndex.value >= list.length) focusIndex.value = 0;
});

const percent = computed(() =>
  words.value.length ? Math.round((counts.value.known / words.value.length) * 100) : 0
);

function move(d) {
  const n = filtered.value.length;
  if (!n) return;
  focusIndex.value = (focusIndex.value + d + n) % n;
}

function onKey(e) {
  if (mode.value !== "focus") return;
  if (e.key === "ArrowRight") move(1);
  if (e.key === "ArrowLeft") move(-1);
}
onMounted(() => window.addEventListener("keydown", onKey));
onUnmounted(() => window.removeEventListener("keydown", onKey));
</script>

<style scoped>
.lessonhead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
.lessonhead h2 {
  font-size: 26px;
  font-weight: 800;
}
.lessonhead .te {
  color: var(--muted);
  font-weight: 600;
  margin-top: 2px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.search {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--card);
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-pill);
  padding: 10px 16px;
}
.search input {
  border: none;
  outline: none;
  flex: 1;
  font-family: var(--ui);
  font-size: 15px;
  background: transparent;
  color: var(--ink);
}
.search input::placeholder {
  color: var(--muted-soft);
}
.toggle {
  display: flex;
  background: var(--soft);
  border-radius: var(--r-pill);
  padding: 4px;
}
.toggle button {
  font-weight: 700;
  font-size: 13px;
  padding: 7px 14px;
  border-radius: var(--r-pill);
  color: var(--body);
}
.toggle button.on {
  background: #fff;
  color: var(--primary);
  box-shadow: var(--sh-card);
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--soft);
  color: var(--body);
  font-weight: 700;
  font-size: 13px;
  padding: 7px 14px;
  border-radius: var(--r-pill);
}
.chip.on {
  background: var(--primary);
  color: #fff;
}
.chip .n {
  font-size: 11px;
  font-weight: 800;
  opacity: 0.7;
}

.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 18px;
}

.focus {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 12px 0;
}
.focus .stage {
  display: flex;
  align-items: center;
  gap: 18px;
}
.navbtn {
  width: 52px;
  height: 52px;
  border-radius: var(--r-pill);
  background: var(--card);
  box-shadow: var(--sh-card);
  font-size: 24px;
  color: var(--primary);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.navbtn:hover {
  box-shadow: var(--sh-hover);
}
.dots {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 340px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--hairline);
  cursor: pointer;
}
.dot.on {
  background: var(--primary);
  width: 22px;
  border-radius: var(--r-pill);
}
.counter {
  font-weight: 800;
  color: var(--muted);
  font-size: 14px;
}
.hintline {
  font-size: 13px;
}
.empty {
  text-align: center;
  padding: 50px 0;
  color: var(--body);
  font-weight: 700;
}

@media (max-width: 640px) {
  .grid-cards {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  .navbtn {
    width: 44px;
    height: 44px;
  }
}
</style>
