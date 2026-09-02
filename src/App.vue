<template>
  <div class="app-shell" :style="themeVars">
    <AppHeader />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import { seriesTheme } from "@/data/courses.js";

const route = useRoute();
// Repaint the whole shell in the active course's color; home (no series) stays default.
const themeVars = computed(() => seriesTheme(route.params.series));
</script>
