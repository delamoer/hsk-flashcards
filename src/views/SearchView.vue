<template>
  <div class="wrap">
    <div class="crumb">
      <router-link to="/">首页 Home</router-link>
      <span class="sep">/</span>
      <span class="cur">搜索 Search</span>
    </div>

    <label class="search">
      <span>🔍</span>
      <input
        ref="input"
        v-model="q"
        placeholder="搜索汉字 / 拼音 / 英文…  Search all courses…"
        @keyup.enter="commit"
      />
      <button v-if="q" class="clear" @click="clear" title="清除 Clear">✕</button>
    </label>

    <!-- prompt: no query yet -->
    <div v-if="!committed" class="hint">
      <p>输入关键词，搜索所有课程的单词</p>
      <p class="muted">Search words across every course — Chinese, pinyin, or English.</p>
    </div>

    <!-- results -->
    <template v-else>
      <div class="resultbar">
        <span v-if="total">共 {{ total }} 个结果 · {{ total }} results</span>
        <span v-else>没有匹配 · No matches for “{{ committed }}”</span>
        <span v-if="total > results.length" class="more">
          显示前 {{ results.length }} 个，请缩小范围 · showing first {{ results.length }}
        </span>
      </div>

      <div v-if="results.length" class="grid-cards">
        <div
          v-for="r in results"
          :key="`${r.series}-${r.unit}-${r.word.id}`"
          class="cell"
          :style="theme(r.series)"
        >
          <FlashCard :word="r.word" :level="r.unit" :tag="sourceTag(r)" full />
          <router-link class="source" :to="lessonLink(r)">
            {{ r.seriesName }} · {{ r.unitLabel }} · 第{{ r.lessonNum }}课
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import FlashCard from "@/components/FlashCard.vue";
import { searchAll } from "@/data";
import { seriesTheme } from "@/data/courses.js";

const route = useRoute();
const router = useRouter();

const q = ref(String(route.query.q || ""));
const committed = ref("");
const results = ref([]);
const total = ref(0);
const input = ref(null);

function theme(seriesId) {
  return seriesTheme(seriesId);
}

function sourceTag(r) {
  return `${r.unitLabel} · 第${r.lessonNum}课`;
}

function lessonLink(r) {
  return `/course/${r.series}/${r.unit}/lesson/${r.lessonNum}`;
}

function run(query) {
  const { total: t, results: rs } = searchAll(query);
  total.value = t;
  results.value = rs;
  committed.value = query.trim();
}

// Enter commits the query to the URL (shareable); the URL watcher runs the search.
function commit() {
  const query = q.value.trim();
  router.replace({ name: "search", query: query ? { q: query } : {} });
  if (query) run(query);
  else clear();
}

function clear() {
  q.value = "";
  committed.value = "";
  results.value = [];
  total.value = 0;
  router.replace({ name: "search", query: {} });
  nextTick(() => input.value?.focus());
}

// React to back/forward or arriving with ?q=…
watch(
  () => route.query.q,
  (val) => {
    const query = String(val || "");
    q.value = query;
    if (query.trim()) run(query);
    else {
      committed.value = "";
      results.value = [];
      total.value = 0;
    }
  }
);

onMounted(() => {
  if (q.value.trim()) run(q.value);
  else input.value?.focus();
});
</script>

<style scoped>
.search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--card);
  border: 1.5px solid var(--hairline);
  border-radius: var(--r-pill);
  padding: 12px 18px;
  margin-bottom: 20px;
}
.search input {
  border: none;
  outline: none;
  flex: 1;
  font-family: var(--ui);
  font-size: 16px;
  background: transparent;
  color: var(--ink);
}
.search input::placeholder {
  color: var(--muted-soft);
}
.clear {
  color: var(--muted);
  font-size: 14px;
  font-weight: 800;
  width: 24px;
  height: 24px;
  border-radius: var(--r-pill);
  background: var(--soft);
}

.hint {
  text-align: center;
  padding: 48px 0;
  font-weight: 700;
  color: var(--body);
}
.hint .muted {
  margin-top: 6px;
  font-weight: 600;
  font-size: 14px;
}

.resultbar {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-weight: 800;
  color: var(--muted);
  font-size: 14px;
  margin-bottom: 16px;
}
.resultbar .more {
  font-weight: 700;
  font-size: 12px;
  color: var(--muted-soft);
}

.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 18px;
}
.cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.source {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  text-align: center;
}
.source:hover {
  color: var(--primary);
}

@media (max-width: 640px) {
  .grid-cards {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
}
</style>
