<template>
  <div class="wrap">
    <div class="crumb">
      <router-link to="/">首页 Home</router-link>
      <span class="sep">/</span>
      <span class="cur">我的词 My words</span>
    </div>

    <h2 class="title">我的词 <i>My words</i></h2>
    <p class="sub">把散落在各课的词汇按标签汇总，一次过完 · Every word you've studied, in one place</p>

    <div class="toolbar">
      <label class="search">
        <span>🔍</span>
        <input v-model="search" placeholder="搜索汉字 / 拼音 / 英文…  Search…" />
      </label>
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

    <div v-if="!filtered.length" class="empty">
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
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import FlashCard from "@/components/FlashCard.vue";
import { everyWord, matchWord } from "@/data";
import { useProgress } from "@/composables/useProgress";

const route = useRoute();
const { statusOf, isStarred } = useProgress();

const entries = everyWord();

const filters = [
  { key: "review", label: "需复习 Review" },
  { key: "known", label: "已掌握 Got it" },
  { key: "star", label: "⭐ 收藏 Saved" },
  { key: "studied", label: "全部已学 Studied" },
];

const validKeys = filters.map((f) => f.key);
const filter = ref(validKeys.includes(route.query.filter) ? route.query.filter : "review");
const search = ref("");

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
  for (const e of entries) {
    const id = e.word.id;
    if (statusOf(id) === "review") c.review++;
    if (statusOf(id) === "known") c.known++;
    if (isStarred(id)) c.star++;
    if (statusOf(id) !== "new" || isStarred(id)) c.studied++;
  }
  return c;
});

const filtered = computed(() => {
  const q = search.value.trim();
  return entries.filter((e) => passesTag(e.word.id, filter.value) && matchWord(e.word, q));
});

const emptyText = computed(() => {
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
.title {
  font-size: 26px;
  font-weight: 800;
}
.title i {
  font-style: normal;
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
  margin-left: 8px;
}
.sub {
  color: var(--muted);
  font-weight: 600;
  font-size: 13px;
  margin: 6px 0 18px;
}
.toolbar {
  margin-bottom: 14px;
}
.search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--card);
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-pill);
  padding: 10px 16px;
  max-width: 460px;
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
