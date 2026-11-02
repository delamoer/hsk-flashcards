// 每日学习足迹 — silently tallies how long a logged-in student studies and where, for the teacher's /admin view.
// One `activity` row per student per local day (Supabase, kept 90 days — see supabase/sql/2026-11-03_activity.sql).
// No per-component wiring: the current "place" (context) is derived from the route here, and LessonHubView
// refines it with its active tab via setActivityContext(). Every click is counted against the current place;
// once a minute, if the tab is visible and the student interacted in the last IDLE_MS, that minute is credited
// to the current place too. Pending tallies are flushed once a minute and when the page is hidden.
// Context format: "{kind}|{ref}", e.g. "flash|hsk-1/3", "read|tiantiandu-1b/7", "music|".
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/composables/useAuth";

const TICK_MS = 60_000;
const IDLE_MS = 120_000;

let context = "browse|";
let lastInteraction = 0;
let pending = { minutes: 0, counts: {} };
let started = false;

// lesson hub tabs → activity kinds
const TAB_KIND = { read: "text", cards: "flash", vocab: "vocab", grammar: "gram", exercises: "ex", discussion: "talk" };

function bump(key, n = 1) {
  pending.counts[key] = (pending.counts[key] || 0) + n;
}

function localDay() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function flush() {
  const { user } = useAuth();
  if (!user.value || !isSupabaseConfigured) return;
  if (!pending.minutes && !Object.keys(pending.counts).length) return;
  const batch = pending;
  pending = { minutes: 0, counts: {} };
  const { error } = await supabase.rpc("log_activity", { p_day: localDay(), p_minutes: batch.minutes, p_counts: batch.counts });
  if (error) {
    // put it back for the next try (a missing table just keeps it in memory until the tab closes)
    pending.minutes += batch.minutes;
    for (const [k, v] of Object.entries(batch.counts)) bump(k, v);
  }
}

function onInteract() {
  lastInteraction = Date.now();
}

function tick() {
  if (document.visibilityState === "visible" && Date.now() - lastInteraction < IDLE_MS) {
    pending.minutes++;
    bump("m:" + context);
  }
  flush();
}

// called by LessonHubView with the active tab; other pages are mapped from the route below
export function setActivityContext(ctx) {
  context = ctx;
}

export function lessonContext(tab, series, unit, lesson) {
  return `${TAB_KIND[tab] || tab}|${series}-${unit}/${lesson}`;
}

function contextOfRoute(to) {
  const p = to.params;
  switch (to.name) {
    case "lesson":
      return null; // LessonHubView sets it (needs the tab)
    case "quiz":
      return `quiz|${p.series}-${p.unit}/${p.lesson}`;
    case "text":
      return `text|${p.series}-${p.unit}/${p.lesson}`;
    case "reading-lesson":
      return `read|${p.book}/${p.n}`;
    case "pinyin":
      return "pinyin|";
    case "music":
      return "music|";
    case "grammar":
      return "gramidx|";
    case "mywords":
      return "words|";
    default:
      return "browse|";
  }
}

// call once from main.js with the router
export function startActivity(router) {
  if (started || !isSupabaseConfigured) return;
  started = true;
  router.afterEach((to) => {
    const ctx = contextOfRoute(to);
    if (ctx) context = ctx;
  });
  for (const ev of ["pointerdown", "keydown", "wheel", "touchstart"]) {
    window.addEventListener(ev, onInteract, { passive: true, capture: true });
  }
  window.addEventListener("scroll", onInteract, { passive: true, capture: true });
  window.addEventListener("pointerdown", () => bump("c:" + context), { passive: true, capture: true });
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flush());
  window.addEventListener("pagehide", flush);
  setInterval(tick, TICK_MS);
}
