import { reactive, watch } from "vue";

const STORAGE_KEY = "hsk-flashcards-settings-v1";

const defaults = {
  toneColors: true, // color pinyin by tone (pedagogical aid)
  ttsRate: 0.85,
};

function load() {
  try {
    return { ...defaults, ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) };
  } catch {
    return { ...defaults };
  }
}

const settings = reactive(load());

watch(
  settings,
  () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  },
  { deep: true }
);

export function useSettings() {
  return { settings };
}
