<template>
  <header v-if="!hideChrome" class="appbar">
    <router-link to="/" class="logo">HSK <span>单词闪卡</span></router-link>
    <button
      class="toneToggle"
      :class="{ on: settings.toneColors }"
      @click="settings.toneColors = !settings.toneColors"
      :title="settings.toneColors ? '声调配色：开' : '声调配色：关'"
    >
      <span class="dot t1">声</span><span class="dot t2">调</span
      ><span class="dot t3">配</span><span class="dot t4">色</span>
      <span class="state">{{ settings.toneColors ? "ON" : "OFF" }}</span>
    </button>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useSettings } from "@/composables/useSettings";

const { settings } = useSettings();
const route = useRoute();
const hideChrome = computed(() => route.name === "print");
</script>

<style scoped>
.appbar {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  background: rgba(255, 250, 246, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--hairline);
}
.logo {
  font-weight: 800;
  font-size: 17px;
  color: var(--primary-strong);
  letter-spacing: 0.3px;
}
.logo span {
  color: var(--ink);
}
.toneToggle {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 1px;
  background: var(--soft);
  border-radius: var(--r-pill);
  padding: 5px 10px;
  font-family: var(--han);
  font-weight: 700;
  font-size: 13px;
  opacity: 0.5;
  transition: opacity 0.15s;
}
.toneToggle.on {
  opacity: 1;
}
.toneToggle .state {
  font-family: var(--ui);
  font-size: 10px;
  font-weight: 800;
  margin-left: 6px;
  color: var(--muted);
}
.toneToggle:not(.on) .dot {
  color: var(--muted-soft) !important;
}
</style>
