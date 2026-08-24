<template>
  <component
    :is="info.available ? 'router-link' : 'div'"
    :to="info.available ? `/hsk/${info.level}` : undefined"
    class="level"
    :class="{ locked: !info.available }"
  >
    <span v-if="!info.available" class="lockchip">敬请期待 Coming soon</span>
    <span class="badge">HSK {{ info.level }}</span>
    <h3>HSK {{ info.level }}</h3>
    <template v-if="info.available">
      <div class="meta">{{ info.lessonCount }} 课 lessons · {{ info.wordCount }} 词 words</div>
      <div class="ringrow">
        <ProgressRing :percent="percent" />
        <span class="start">开始 Start →</span>
      </div>
    </template>
    <div v-else class="meta">即将上线</div>
  </component>
</template>

<script setup>
import ProgressRing from "./ProgressRing.vue";

defineProps({
  info: { type: Object, required: true },
  percent: { type: Number, default: 0 },
});
</script>

<style scoped>
.level {
  display: block;
  background: var(--card);
  border-radius: var(--r-xl);
  padding: 22px;
  box-shadow: var(--sh-card);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}
.level:not(.locked):hover {
  transform: translateY(-4px);
  box-shadow: var(--sh-hover);
}
.badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
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
.level.locked {
  background: var(--soft);
  cursor: not-allowed;
  box-shadow: none;
}
.level.locked .badge {
  background: var(--muted-soft);
}
.level.locked h3,
.level.locked .meta {
  color: var(--muted);
}
.lockchip {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--strong);
  color: var(--muted);
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: var(--r-pill);
}
</style>
