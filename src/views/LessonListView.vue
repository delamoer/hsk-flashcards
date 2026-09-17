<template>
  <div class="wrap" v-if="data">
    <div class="crumb">
      <router-link to="/">首页 Home</router-link>
      <span class="sep">/</span>
      <span class="cur">{{ unitLabel }}</span>
    </div>
    <div class="head">
      <h2>{{ unitLabel }} · <span class="muted">{{ data.lessons.length }} 课 lessons</span></h2>
    </div>
    <div class="grid-lessons">
      <LessonCard
        v-for="lesson in data.lessons"
        :key="lesson.num"
        :lesson="lesson"
        :series="series"
        :unit="unit"
      />
    </div>
  </div>
  <div class="wrap" v-else-if="loading">
    <p class="muted">加载中… · Loading…</p>
  </div>
  <div class="wrap" v-else>
    <p class="muted">该课程暂未上线 · This course is not available yet.</p>
    <router-link to="/" class="btn secondary" style="margin-top: 16px">← 返回首页 Home</router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import LessonCard from "@/components/LessonCard.vue";
import { getUnit } from "@/data";
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
    data.value = await getUnit(s, u);
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
.head {
  margin-bottom: 18px;
}
.head h2 {
  font-size: 24px;
  font-weight: 800;
}
.head .muted {
  font-size: 16px;
  font-weight: 700;
}
.grid-lessons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}
</style>
