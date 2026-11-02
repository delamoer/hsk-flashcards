// 课外阅读「已读」记录 — which stories a student has marked as read
// (the 「读完了」 button at the end of each story; tapping 撤销 undoes it).
// Shape: { "tiantiandu-2b": { "3": "2026-11-02T08:00:00.000Z" } } — story n → when it was marked
// (null for records migrated from the old array format, whose time is unknown).
// Backend swaps on auth like useProgress:
//   - logged in  → the `reading` jsonb column of the Supabase `progress` row (teacher sees it in /admin)
//   - anonymous  → localStorage
// The reading save upserts ONLY {user_id, reading, updated_at}, so it never touches the flashcard blob.
import { reactive, watch } from "vue";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/composables/useAuth";

const KEY = "hsk-reading-read-v1";

const state = reactive({});
let currentUserId = null;
let hydrating = false;

// old format { book: [1, 2, 5] } → { book: { "1": null, ... } }
function normalize(obj) {
  const out = {};
  for (const [book, v] of Object.entries(obj || {})) {
    if (Array.isArray(v)) out[book] = Object.fromEntries(v.map((n) => [String(n), null]));
    else if (v && typeof v === "object") out[book] = { ...v };
  }
  return out;
}

function fill(obj) {
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, normalize(obj));
}

function loadLocal() {
  try {
    return normalize(JSON.parse(localStorage.getItem(KEY)));
  } catch {
    return {};
  }
}

function saveLocal() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage may be full/disabled — ignore */
  }
}

async function loadCloud(userId) {
  const { data, error } = await supabase.from("progress").select("reading").eq("user_id", userId).maybeSingle();
  if (error) {
    console.warn("[reading] cloud load failed, using local fallback:", error.message);
    return null;
  }
  return normalize(data?.reading);
}

async function saveCloud(userId) {
  const { error } = await supabase
    .from("progress")
    .upsert({ user_id: userId, reading: { ...state }, updated_at: new Date().toISOString() });
  if (error) console.warn("[reading] cloud save failed:", error.message);
  return !error;
}

const count = (obj) => Object.values(obj).reduce((n, b) => n + Object.keys(b).length, 0);

async function reload(userId) {
  hydrating = true;
  currentUserId = userId;
  if (userId && isSupabaseConfigured) {
    const cloud = await loadCloud(userId);
    const local = loadLocal();
    if (cloud === null) {
      fill(local);
    } else {
      // union, cloud wins; local records (made before syncing existed) are pushed up once
      // and then cleared, so they can't leak into another account on a shared device
      const merged = { ...local };
      for (const [book, m] of Object.entries(cloud)) merged[book] = { ...(local[book] || {}), ...m };
      fill(merged);
      if (count(merged) > count(cloud) && (await saveCloud(userId))) localStorage.removeItem(KEY);
    }
  } else {
    fill(loadLocal());
  }
  hydrating = false;
}

watch(
  state,
  () => {
    if (hydrating) return;
    // a failed cloud save keeps a local copy; the next reload merges it up
    if (currentUserId && isSupabaseConfigured) saveCloud(currentUserId).then((ok) => ok || saveLocal());
    else saveLocal();
  },
  { deep: true }
);

const { user, onChange } = useAuth();
reload(user.value?.id ?? null);
onChange((u) => reload(u?.id ?? null));

export function useReading() {
  const isRead = (book, n) => !!state[book] && String(n) in state[book];
  function markRead(book, n) {
    if (isRead(book, n)) return;
    state[book] = { ...(state[book] || {}), [String(n)]: new Date().toISOString() };
  }
  function unmarkRead(book, n) {
    if (!isRead(book, n)) return;
    const { [String(n)]: _, ...rest } = state[book];
    state[book] = rest;
  }
  const readCount = (book) => (state[book] ? Object.keys(state[book]).length : 0);
  return { isRead, markRead, unmarkRead, readCount };
}
