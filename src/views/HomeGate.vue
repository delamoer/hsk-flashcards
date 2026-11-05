<template>
  <LandingView v-if="showLanding" />
  <LibraryView v-else />
</template>

<script setup>
// "/" is two pages: signed-out visitors get the public landing page (引流页),
// signed-in students get the library as before. Same URL, so old bookmarks keep working.
import { computed, defineAsyncComponent, watch } from "vue";
import { useAuth } from "@/composables/useAuth";
import { applySeo } from "@/seo";

const LandingView = defineAsyncComponent(() => import("@/views/LandingView.vue"));
const LibraryView = defineAsyncComponent(() => import("@/views/LibraryView.vue"));

const { isConfigured, isLoggedIn } = useAuth();
const showLanding = computed(() => isConfigured && !isLoggedIn.value);
// signing in/out on "/" swaps the page without a navigation, so the title has to follow here
watch(showLanding, (landing) => applySeo("home", landing));
</script>
