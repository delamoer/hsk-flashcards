<template>
  <div class="ring" :style="ringStyle">
    <span class="val">{{ percent }}%</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  percent: { type: Number, default: 0 },
  size: { type: Number, default: 52 },
});

const ringStyle = computed(() => ({
  width: props.size + "px",
  height: props.size + "px",
  background: `conic-gradient(var(--primary) ${props.percent}%, var(--hairline) 0)`,
}));
</script>

<style scoped>
.ring {
  position: relative;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.ring::before {
  content: "";
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: var(--card);
}
.val {
  position: relative;
  font-size: 12px;
  font-weight: 800;
  color: var(--ink);
}
</style>
