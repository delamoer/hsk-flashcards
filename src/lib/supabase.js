// Supabase client singleton.
// Reads config from Vite env (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).
// If unconfigured, `supabase` is null and `isSupabaseConfigured` is false —
// the app still runs, degrading to localStorage-only progress (no login).

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
