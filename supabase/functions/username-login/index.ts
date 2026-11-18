import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405, headers: corsHeaders });
  }

  try {
    const { identifier, password } = await req.json();
    if (
      typeof identifier !== "string" ||
      typeof password !== "string" ||
      identifier.trim().length < 3 ||
      password.length < 1 ||
      password.length > 128
    ) {
      return Response.json({ error: "Invalid username/email or password." }, { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return Response.json({ error: "Authentication service is not configured." }, { status: 500, headers: corsHeaders });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const auth = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const value = identifier.trim();
    let email = value;
    if (!value.includes("@")) {
      const { data: identity } = await admin
        .from("auth_usernames")
        .select("email")
        .eq("username", value.toLowerCase())
        .maybeSingle();
      if (!identity?.email) {
        return Response.json({ error: "Invalid username/email or password." }, { status: 401, headers: corsHeaders });
      }
      email = identity.email;
    }

    const { data, error } = await auth.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return Response.json({ error: "Invalid username/email or password." }, { status: 401, headers: corsHeaders });
    }

    return Response.json(
      {
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch {
    return Response.json({ error: "Invalid username/email or password." }, { status: 400, headers: corsHeaders });
  }
});
