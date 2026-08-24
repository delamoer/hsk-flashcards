import { reactive, watch, computed } from "vue";

// Per-word learning state, persisted in localStorage.
// Shape: { [wordId]: { s: "new" | "known" | "review", star: boolean } }
const STORAGE_KEY = "hsk-flashcards-progress-v1";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

const state = reactive(load());

let saveTimer = null;
watch(
  state,
  () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* storage may be full/disabled — ignore */
      }
    }, 200);
  },
  { deep: true }
);

function entry(id) {
  return state[id] || { s: "new", status: "new", star: false };
}

export function useProgress() {
  function statusOf(id) {
    return state[id]?.s || "new";
  }
  function isStarred(id) {
    return !!state[id]?.star;
  }
  function setStatus(id, s) {
    const e = state[id] || (state[id] = { s: "new", star: false });
    // toggle off if same status clicked again
    e.s = e.s === s ? "new" : s;
  }
  function toggleStar(id) {
    const e = state[id] || (state[id] = { s: "new", star: false });
    e.star = !e.star;
  }

  // Counts for a list of words.
  function summarize(words) {
    const c = { total: words.length, known: 0, review: 0, star: 0, new: 0 };
    for (const w of words) {
      const e = state[w.id];
      const s = e?.s || "new";
      c[s]++;
      if (e?.star) c.star++;
    }
    return c;
  }

  function percentKnown(words) {
    if (!words.length) return 0;
    return Math.round((summarize(words).known / words.length) * 100);
  }

  return { state, statusOf, isStarred, setStatus, toggleStar, summarize, percentKnown };
}
