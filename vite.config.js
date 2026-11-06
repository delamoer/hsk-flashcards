import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// base: "./" keeps asset paths relative so the built site works when hosted
// on a sub-path (e.g. GitHub Pages). Routing uses hash history for the same reason.
export default defineConfig({
  base: "./",
  plugins: [vue()],
  // Don't watch generated / source-material folders: audio-src holds ~40k MP3s, and gen_audio.py rewriting
  // them (plus manifest.json) had the dev server spinning at full CPU until every request timed out.
  server: { watch: { ignored: ["**/audio-src/**", "**/dist/**", "**/sources/**", "**/design-demos/**"] } },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
