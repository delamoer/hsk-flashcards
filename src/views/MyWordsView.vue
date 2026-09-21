<template>
  <div class="wrap">
    <header class="hero">
      <div class="kicker">My Vocabulary · 生词典藏</div>
      <h1>我的词</h1>
      <div class="en-sub">Every word you've studied — and every word there is</div>
      <div class="rule"><span class="diamond">◇ ◇ ◇</span></div>
      <label class="herosearch">
        <span class="ic">🔍</span>
        <input v-model="search" :placeholder="scope === 'all' ? '搜索所有课程的词…  Search all courses…' : '搜索我的词…  Search my words…'" />
      </label>
      <div class="scope">
        <button :class="{ on: scope === 'mine' }" @click="scope = 'mine'">我的词<i>My words</i></button>
        <button :class="{ on: scope === 'all' }" @click="scope = 'all'">所有课程<i>All courses</i></button>
      </div>
    </header>

    <div v-if="scope === 'mine'" class="chips">
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
    <p v-else class="scopehint">在所有课程里搜索单词（含未学过的）· Search every word across all courses<span v-if="allTotal > filtered.length"> · 共 {{ allTotal }} 条，显示前 {{ filtered.length }}</span></p>

    <div v-if="loading" class="empty">
      <p class="muted">加载中… · Loading…</p>
    </div>

    <div v-else-if="!filtered.length" class="empty">
      <p>{{ emptyText }}</p>
      <p class="muted">
        <router-link to="/" class="golink">去学习 Start learning →</router-link>
      </p>
    </div>

    <div v-else class="grid-cards">
      <FlashCard
        v-for="e in filtered"
        :key="e.series + '-' + e.unit + '-' + e.lessonNum + '-' + e.word.id"
        :word="e.word"
        :tag="`${e.unitLabel} · 第${e.lessonNum}课`"
        full
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import FlashCard from "@/components/FlashCard.vue";
import { everyWord, matchWord } from "@/data";
import { useProgress } from "@/composables/useProgress";

const route = useRoute();
const { statusOf, isStarred } = useProgress();

// Cross-course word index — loaded on demand (pulls every unit's data).
const entries = ref([]);
const loading = ref(true);
onMounted(async () => {
  entries.value = await everyWord();
  loading.value = false;
});

const filters = [
  { key: "review", label: "需复习 Review" },
  { key: "known", label: "已掌握 Got it" },
  { key: "star", label: "⭐ 收藏 Saved" },
  { key: "studied", label: "全部已学 Studied" },
];

const validKeys = filters.map((f) => f.key);
const filter = ref(validKeys.includes(route.query.filter) ? route.query.filter : "review");
const search = ref("");
const scope = ref("mine"); // 'mine' = my studied words · 'all' = global search across all courses
const ALL_LIMIT = 120;

// Follow query changes (e.g. clicking a stat on the account page while already here).
watch(
  () => route.query.filter,
  (f) => { if (validKeys.includes(f)) filter.value = f; }
);

function passesTag(id, key) {
  if (key === "review") return statusOf(id) === "review";
  if (key === "known") return statusOf(id) === "known";
  if (key === "star") return isStarred(id);
  return statusOf(id) !== "new" || isStarred(id); // studied
}

const counts = computed(() => {
  const c = { review: 0, known: 0, star: 0, studied: 0 };
  for (const e of entries.value) {
    const id = e.word.id;
    if (statusOf(id) === "review") c.review++;
    if (statusOf(id) === "known") c.known++;
    if (isStarred(id)) c.star++;
    if (statusOf(id) !== "new" || isStarred(id)) c.studied++;
  }
  return c;
});

// total matches in 'all' scope (before the display cap)
const allTotal = computed(() => {
  const q = search.value.trim();
  if (scope.value !== "all" || !q) return 0;
  return entries.value.filter((e) => matchWord(e.word, q)).length;
});

const filtered = computed(() => {
  const q = search.value.trim();
  if (scope.value === "all") {
    if (!q) return []; // require a query — don't dump thousands of words
    return entries.value.filter((e) => matchWord(e.word, q)).slice(0, ALL_LIMIT);
  }
  return entries.value.filter((e) => passesTag(e.word.id, filter.value) && matchWord(e.word, q));
});

const emptyText = computed(() => {
  if (scope.value === "all") {
    return search.value.trim() ? "没有匹配的词语 · No matching words" : "输入关键词，搜索所有课程 · Type to search all courses";
  }
  if (search.value.trim()) return "没有匹配的词语 · No matching words";
  const map = {
    review: "还没有需复习的词",
    known: "还没有已掌握的词",
    star: "还没有收藏的词",
    studied: "还没有学过的词",
  };
  return map[filter.value];
});
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 34px 0 20px;
}
.hero .kicker {
  font-family: var(--caps);
  font-size: 12px;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: var(--gold-deep);
}
.hero h1 {
  font-family: var(--serif-cn);
  font-weight: 900;
  font-size: 48px;
  letter-spacing: 5px;
  color: var(--ink);
  margin: 8px 0 6px;
  text-shadow: 1px 1px 0 var(--gold-lt);
}
.hero .en-sub {
  font-family: var(--serif-en);
  font-style: italic;
  font-size: 16px;
  letter-spacing: 1px;
  color: var(--muted);
}
.rule {
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 280px;
  margin: 18px auto 22px;
}
.rule::before,
.rule::after {
  content: "";
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.diamond {
  font-size: 12px;
  letter-spacing: 6px;
  color: var(--gold);
}
.herosearch {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 540px;
  margin: 0 auto;
  background: linear-gradient(160deg, #fbf7ee, #f3ead9);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px 20px;
  box-shadow: 0 3px 12px -8px var(--shadow, rgba(45, 30, 10, 0.14));
  transition: border-color 0.2s;
}
.herosearch:focus-within {
  border-color: var(--gold);
}
.herosearch .ic {
  color: var(--gold-deep);
}
.herosearch input {
  border: none;
  outline: none;
  flex: 1;
  font-family: var(--han);
  font-size: 15px;
  background: transparent;
  color: var(--ink);
}
.herosearch input::placeholder {
  color: var(--muted-soft);
  font-family: var(--serif-cn);
}
.scope {
  display: inline-flex;
  gap: 4px;
  margin: 14px auto 0;
  padding: 4px;
  background: var(--paper-3);
  border: 1px solid var(--line);
  border-radius: 8px;
}
.scope button {
  display: inline-flex;
  flex-direction: column;
  line-height: 1.1;
  font-family: var(--serif-cn);
  font-weight: 600;
  font-size: 14px;
  padding: 6px 18px;
  border-radius: 6px;
  color: var(--ink-soft, #4a3d2a);
  transition: 0.2s;
}
.scope button i {
  font-style: normal;
  font-family: var(--caps);
  font-size: 8.5px;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  color: var(--muted);
}
.scope button.on {
  background: linear-gradient(145deg, #c0392b, #8b2a1f);
  color: #fbeecf;
  box-shadow: 0 2px 5px -1px rgba(139, 42, 31, 0.4);
}
.scope button.on i {
  color: rgba(251, 238, 207, 0.85);
}
.scopehint {
  text-align: center;
  font-size: 12.5px;
  color: var(--muted);
  margin-bottom: 18px;
}
.chips {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin: 20px 0 22px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--ink-soft, #4a3d2a);
  font-family: var(--serif-cn);
  font-weight: 600;
  font-size: 13px;
  padding: 7px 15px;
  border-radius: var(--r-pill);
  transition: 0.2s;
}
.chip.on {
  background: var(--gold);
  border-color: var(--gold-deep);
  color: #fff8ea;
}
.chip .n {
  font-family: var(--caps);
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
}
.chip.on .n {
  color: rgba(255, 248, 234, 0.85);
}
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 18px;
}
.empty {
  text-align: center;
  padding: 50px 0;
  color: var(--body);
  font-weight: 700;
}
.golink {
  color: var(--primary);
  font-weight: 800;
}
.golink:hover {
  text-decoration: underline;
}
@media (max-width: 640px) {
  .grid-cards {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
}
</style>
