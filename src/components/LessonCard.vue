<template>
  <router-link :to="`/course/${series}/${unit}/lesson/${lesson.num}`" class="lesson">
    <div class="no">第 {{ lesson.num }} 课 · LESSON {{ lesson.num }}</div>
    <div class="t han">{{ lesson.title }}</div>
    <div class="te">{{ lesson.titleEn }}</div>
    <div class="pbar"><i :style="{ width: percent + '%' }"></i></div>
    <div class="cnt">
      <span>{{ lesson.words.length }} 词 words</span>
      <span>{{ known }}/{{ lesson.words.length }} 掌握 Got it</span>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from "vue";
import { useProgress } from "@/composables/useProgress";

const props = defineProps({
  lesson: { type: Object, required: true },
  series: { type: String, required: true },
  unit: { type: [Number, String], required: true },
});

const { summarize } = useProgress();
const stats = computed(() => summarize(props.lesson.words));
const known = computed(() => stats.value.known);
const percent = computed(() =>
  props.lesson.words.length ? Math.round((known.value / props.lesson.words.length) * 100) : 0
);
</script>

<style scoped>
.lesson {
  display: block;
  background: var(--card);
  border-radius: var(--r-lg);
  padding: 18px;
  box-shadow: var(--sh-card);
  transition: transform 0.2s, box-shadow 0.2s;
}
.lesson:hover {
  transform: translateY(-3px);
  box-shadow: var(--sh-hover);
}
.no {
  font-size: 12px;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: 0.3px;
}
.t {
  font-size: 18px;
  font-weight: 700;
  margin: 6px 0 2px;
}
.te {
  font-size: 13px;
  color: var(--muted);
  font-weight: 600;
  min-height: 18px;
}
.pbar {
  margin-top: 14px;
}
.cnt {
  font-size: 12px;
  color: var(--muted);
  font-weight: 700;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
}
</style>
