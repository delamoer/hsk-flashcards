<template>
  <div class="wrap" v-if="data">
    <div class="crumb">
      <router-link to="/texts">课文 Texts</router-link>
      <span class="sep">/</span>
      <span class="cur">{{ unitLabel }}</span>
    </div>
    <div class="head">
      <h2>{{ unitLabel }} · <span class="muted">{{ data.lessons.length }} 课 lessons</span></h2>
    </div>
    <div class="grid-lessons">
      <router-link
        v-for="lesson in data.lessons"
        :key="lesson.num"
        class="lesson-card"
        :to="`/texts/${series}/${unit}/${lesson.num}/1`"
      >
        <div class="lc-num">第 {{ lesson.num }} 课</div>
        <div class="lc-name han">{{ lesson.name }}</div>
        <div class="lc-meta">{{ lesson.texts.length }} 篇课文 · texts</div>
      </router-link>
    </div>
  </div>
  <div class="wrap" v-else-if="loading">
    <p class="muted">加载中… · Loading…</p>
  </div>
  <div class="wrap" v-else>
    <p class="muted">该单元暂无课文 · No texts for this unit yet.</p>
    <router-link to="/texts" class="btn secondary" style="margin-top: 16px">← 返回课文 Texts</router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { getTextUnit } from "@/data/texts";
import { getSeries } from "@/data/courses.js";

const props = defineProps({
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
});

const data = ref(null);
const loading = ref(true);
watch(
  () => [props.series, props.unit],
  async ([s, u]) => {
    loading.value = true;
    data.value = await getTextUnit(s, u);
    loading.value = false;
  },
  { immediate: true }
);

const seriesMeta = computed(() => getSeries(props.series));
const unitLabel = computed(() => {
  const u = seriesMeta.value?.units.find((u) => u.id === Number(props.unit));
  return u?.label || `Unit ${props.unit}`;
});
</script>

<style scoped>
.wrap {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.crumb {
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
  margin-bottom: 14px;
}
.crumb a {
  color: var(--primary);
}
.crumb .sep {
  margin: 0 8px;
  opacity: 0.5;
}
.head {
  margin-bottom: 18px;
}
.head h2 {
  font-family: "Noto Serif SC", serif;
  font-size: 25px;
  font-weight: 700;
}
.head .muted {
  font-size: 16px;
  font-weight: 700;
  color: var(--muted);
}
.grid-lessons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}
.lesson-card {
  display: block;
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  padding: 16px;
  box-shadow: var(--sh-card);
  transition: transform 0.15s, box-shadow 0.15s;
}
.lesson-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--sh-hover);
}
.lc-num {
  font-size: 12px;
  font-weight: 800;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.lc-name {
  font-family: "Noto Serif SC", serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
  margin-top: 4px;
}
.lc-meta {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}
</style>
