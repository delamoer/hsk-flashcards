// Auth state — a reactive singleton wrapping Supabase Auth.
// Exposes the current user/session/role and sign-in/out helpers.
// When Supabase is unconfigured, everything no-ops gracefully (user stays null).

import { ref, computed } from "vue";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const user = ref(null);
const session = ref(null);
const role = ref(null); // "admin" | "student" | null(anonymous)
const profileName = ref(null); // display_name mirrored from the profiles table
const loading = ref(true); // true until the initial session+role check resolves

// Resolves once the initial session restore + role load has settled — router guard
// awaits this so a refresh doesn't bounce a user before session/role are known.
let markReady;
const ready = new Promise((resolve) => {
  markReady = resolve;
});

// Callbacks fired whenever auth state changes (login/logout). useProgress subscribes.
const listeners = new Set();
function notify() {
  for (const fn of listeners) fn(user.value);
}

// Load the current user's role from profiles. Resilient: any failure → "student"
// (never blocks `ready`, never wrongly grants admin).
async function loadRole() {
  if (!user.value) {
    role.value = null;
    profileName.value = null;
    return;
  }
  try {
    const { data } = await supabase
      .from("profiles")
      .select("role, display_name")
      .eq("id", user.value.id)
      .maybeSingle();
    role.value = data?.role ?? "student";
    profileName.value = data?.display_name ?? null;
  } catch {
    role.value = "student";
    profileName.value = null;
  }
}

let initialized = false;
function init() {
  if (initialized) return;
  initialized = true;

  if (!isSupabaseConfigured) {
    loading.value = false;
    markReady();
    return;
  }

  // Restore any persisted session on load, then resolve `ready`.
  supabase.auth.getSession().then(async ({ data }) => {
    session.value = data.session;
    user.value = data.session?.user ?? null;
    await loadRole();
    loading.value = false;
    markReady();
    notify();
  });

  // React to future login/logout events.
  supabase.auth.onAuthStateChange(async (_event, newSession) => {
    session.value = newSession;
    user.value = newSession?.user ?? null;
    await loadRole();
    notify();
  });
}

export function useAuth() {
  init();

  async function signIn(email, password) {
    if (!isSupabaseConfigured) {
      return { error: { message: "Supabase 未配置：请先在 .env 填入项目 URL 和 anon key。" } };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async function signOut() {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  }

  // Update the current user's display name. Writes to auth metadata (always
  // allowed for self) and mirrors it into profiles (best-effort — needs a
  // "users update own profile" RLS policy to persist for the admin list).
  async function updateDisplayName(name) {
    if (!isSupabaseConfigured || !user.value) {
      return { error: { message: "未登录" } };
    }
    const trimmed = (name ?? "").trim();
    const { error } = await supabase.auth.updateUser({ data: { display_name: trimmed } });
    if (error) return { error };
    // Mirror into profiles so AdminView shows the same name. Ignore RLS failures.
    await supabase.from("profiles").update({ display_name: trimmed }).eq("id", user.value.id);
    profileName.value = trimmed || null;
    return { error: null };
  }

  // Register a callback for auth changes; returns an unsubscribe fn.
  function onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return {
    user,
    session,
    role,
    loading,
    isConfigured: isSupabaseConfigured,
    isLoggedIn: computed(() => !!user.value),
    isAdmin: computed(() => role.value === "admin"),
    // metadata is authoritative + reactive after updateUser; profiles is the fallback.
    displayName: computed(() => user.value?.user_metadata?.display_name || profileName.value || null),
    ready, // promise that resolves after the initial session + role check
    signIn,
    signOut,
    updateDisplayName,
    onChange,
  };
}
