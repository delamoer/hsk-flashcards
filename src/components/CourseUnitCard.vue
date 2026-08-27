<template>
  <component
    :is="unit.available ? 'router-link' : 'div'"
    :to="unit.available ? `/course/${series.id}/${unit.id}` : undefined"
    class="unit-card"
    :class="{ locked: !unit.available }"
  >
    <span class="badge" :style="badgeStyle">{{ unit.label }}</span>
    <h3>{{ unit.label }}</h3>
    <template v-if="unit.available">
      <div class="meta">{{ unit.lessonCount }} 课 lessons · {{ unit.wordCount }} 词 words</div>
      <div class="ringrow">
        <ProgressRing :percent="percent" />
        <span class="start">开始 Start →</span>
      </div>
    </template>
    <div v-else class="meta coming">🔒 Coming soon</div>
  </component>
</template>

<script setup>
import { computed } from "vue";
import ProgressRing from "./ProgressRing.vue";

const props = defineProps({
  series: { type: Object, required: true },
  unit: { type: Object, required: true },
  percent: { type: Number, default: 0 },
});

const badgeStyle = computed(() => ({
  background: `linear-gradient(135deg, ${props.series.gradA}, ${props.series.gradB})`,
}));
</script>

<style scoped>
.unit-card {
  display: block;
  background: var(--card);
  border-radius: var(--r-xl);
  padding: 22px;
  box-shadow: var(--sh-card);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}
.unit-card:not(.locked):hover {
  transform: translateY(-4px);
  box-shadow: var(--sh-hover);
}
.badge {
  display: inline-block;
  color: #fff;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.5px;
  padding: 5px 13px;
  border-radius: var(--r-pill);
  text-transform: uppercase;
}
h3 {
  margin: 14px 0 4px;
  font-size: 20px;
}
.meta {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}
.ringrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}
.start {
  color: var(--primary);
  font-weight: 800;
  font-size: 14px;
}
.unit-card.locked {
  background: var(--soft);
  cursor: not-allowed;
  box-shadow: none;
}
.unit-card.locked .badge {
  background: var(--muted-soft) !important;
}
.unit-card.locked h3,
.unit-card.locked .meta {
  color: var(--muted);
}
.coming {
  margin-top: 20px;
}
</style>
