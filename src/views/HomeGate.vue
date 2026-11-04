<template>
  <LandingView v-if="showLanding" />
  <LibraryView v-else />
</template>

<script setup>
// "/" is two pages: signed-out visitors get the public landing page (引流页),
// signed-in students get the library as before. Same URL, so old bookmarks keep working.
import { computed, defineAsyncComponent } from "vue";
import { useAuth } from "@/composables/useAuth";

const LandingView = defineAsyncComponent(() => import("@/views/LandingView.vue"));
const LibraryView = defineAsyncComponent(() => import("@/views/LibraryView.vue"));

const { isConfigured, isLoggedIn } = useAuth();
const showLanding = computed(() => isConfigured && !isLoggedIn.value);
</script>
