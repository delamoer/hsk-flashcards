import { reactive, watch } from "vue";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/composables/useAuth";

// Per-word learning state, shape: { [wordId]: { s: "new"|"known"|"review", star } }
// Storage backend swaps based on auth:
//   - logged in  → Supabase `progress` table (one JSON blob per user)
//   - anonymous  → localStorage (unchanged legacy behavior)
// The public API (statusOf/setStatus/etc.) is identical regardless of backend,
// so all call sites are untouched.

const STORAGE_KEY = "hsk-flashcards-progress-v1";

// The single reactive state object. Kept as ONE reference for the app's lifetime;
// reloads mutate it in place (never reassigned) so components keep their binding.
const state = reactive({});

// Which backend is active + guard flags.
let currentUserId = null; // null = anonymous (localStorage)
let hydrating = false; // true while loading a backend — pauses the save watcher

// ── helpers ────────────────────────────────────────────────────────────────

function clearState() {
  for (const k of Object.keys(state)) delete state[k];
}

function fillState(obj) {
  clearState();
  if (obj) Object.assign(state, obj);
}

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveLocal() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage may be full/disabled — ignore */
  }
}

async function loadCloud(userId) {
  const { data, error } = await supabase
    .from("progress")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.warn("[progress] cloud load failed, using local fallback:", error.message);
    return null;
  }
  return data?.data ?? {};
}

async function saveCloud(userId) {
  const { error } = await supabase
    .from("progress")
    .upsert({ user_id: userId, data: { ...state }, updated_at: new Date().toISOString() });
  if (error) console.warn("[progress] cloud save failed:", error.message);
}

// Merge: union of keys; on conflict, `primary` wins. Used for first-login migration.
function merge(primary, secondary) {
  return { ...secondary, ...primary };
}

// ── backend switching ────────────────────────────────────────────────────────

// Load the correct backend for the given user (or anonymous when null).
async function reload(userId) {
  hydrating = true;
  currentUserId = userId;

  if (userId && isSupabaseConfigured) {
    const cloud = await loadCloud(userId);
    if (cloud && Object.keys(cloud).length === 0) {
      // First login with an empty cloud: migrate any anonymous localStorage progress up.
      const local = loadLocal();
      if (Object.keys(local).length > 0) {
        fillState(local);
        await saveCloud(userId);
      } else {
        fillState({});
      }
    } else {
      // Cloud has data (or load failed → null). Cloud is source of truth; union in
      // any local-only keys so nothing an anonymous session did gets dropped.
      fillState(merge(cloud || {}, loadLocal()));
    }
  } else {
    // Anonymous → localStorage.
    fillState(loadLocal());
  }

  hydrating = false;
}

// Debounced persistence to whichever backend is active.
let saveTimer = null;
watch(
  state,
  () => {
    if (hydrating) return; // don't write while switching backends
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (currentUserId && isSupabaseConfigured) saveCloud(currentUserId);
      else saveLocal();
    }, 300);
  },
  { deep: true }
);

// Wire auth → backend. Initialize immediately with current auth state.
const { user, onChange } = useAuth();
reload(user.value?.id ?? null);
onChange((u) => reload(u?.id ?? null));

// ── public API (unchanged) ──────────────────────────────────────────────────

export function useProgress() {
  function statusOf(id) {
    return state[id]?.s || "new";
  }
  function isStarred(id) {
    return !!state[id]?.star;
  }
  function setStatus(id, s) {
    const e = state[id] || (state[id] = { s: "new", star: false });
    e.s = e.s === s ? "new" : s; // toggle off if same status clicked again
  }
  function toggleStar(id) {
    const e = state[id] || (state[id] = { s: "new", star: false });
    e.star = !e.star;
  }

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
