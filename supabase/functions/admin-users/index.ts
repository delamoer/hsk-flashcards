// Edge Function: admin-users
// Secure server-side account management. Runs with the service_role key (never
// exposed to the browser). Every request is verified to come from an admin.
//
// Deploy: Supabase dashboard → Edge Functions → create "admin-users" → paste this → Deploy.
// The runtime auto-injects SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
//
// Frontend calls it via:
//   supabase.functions.invoke("admin-users", { body: { action, ... } })
// which automatically attaches the caller's JWT in the Authorization header.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Identify the caller: an anon-key client that forwards their JWT header
  //    (canonical Supabase pattern — robust across key systems).
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader) return json({ error: "Missing authorization" }, 401);

  const caller = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: userData, error: userErr } = await caller.auth.getUser();
  if (userErr || !userData.user) {
    return json({ error: "Invalid session: " + (userErr?.message ?? "no user") }, 401);
  }

  // 2. Verify the caller is an admin (independent of any frontend check).
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (profile?.role !== "admin") return json({ error: "Forbidden: admin only" }, 403);

  // 3. Dispatch the requested action.
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  const action = body.action as string;

  try {
    if (action === "list") {
      // auth.users is the source of truth for email + display name (user_metadata).
      const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (error) return json({ error: error.message }, 400);
      const users = data.users.map((u) => ({
        id: u.id,
        email: u.email ?? null,
        display_name: (u.user_metadata?.display_name as string) ?? null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
      }));
      return json({ ok: true, users });
    }

    if (action === "create") {
      const email = String(body.email ?? "").trim();
      const password = String(body.password ?? "");
      const display_name = String(body.display_name ?? "").trim();
      if (!email || !password) return json({ error: "email 和 password 必填" }, 400);
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // skip email verification (works with placeholder emails)
        user_metadata: display_name ? { display_name } : undefined,
      });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true, user: { id: data.user.id, email: data.user.email } });
    }

    if (action === "set_name") {
      const user_id = String(body.user_id ?? "");
      const display_name = String(body.display_name ?? "").trim();
      if (!user_id) return json({ error: "user_id 必填" }, 400);
      const { error } = await admin.auth.admin.updateUserById(user_id, {
        user_metadata: { display_name },
      });
      if (error) return json({ error: error.message }, 400);
      // mirror into profiles so anything reading that table stays consistent
      await admin.from("profiles").update({ display_name }).eq("id", user_id);
      return json({ ok: true });
    }

    if (action === "reset_password") {
      const user_id = String(body.user_id ?? "");
      const password = String(body.password ?? "");
      if (!user_id || !password) return json({ error: "user_id 和 password 必填" }, 400);
      const { error } = await admin.auth.admin.updateUserById(user_id, { password });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "delete") {
      const user_id = String(body.user_id ?? "");
      if (!user_id) return json({ error: "user_id 必填" }, 400);
      // guard: never let an admin delete themselves via this endpoint
      if (user_id === userData.user.id) return json({ error: "不能删除自己" }, 400);
      const { error } = await admin.auth.admin.deleteUser(user_id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: `Unknown action: ${action}` }, 400);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
