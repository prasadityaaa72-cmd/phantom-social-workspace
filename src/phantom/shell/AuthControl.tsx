import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export function AuthControl() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setSession(data.session);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setNotice("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    setNotice(error ? error.message : "Check your inbox for the secure sign-in link.");
  }

  async function signOut() {
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.signOut();
    setBusy(false);
    setNotice(error ? error.message : "Signed out.");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="mr-1 h-6 rounded-sm border border-border px-2 font-mono text-[0.625rem] text-muted-foreground hover:bg-hover hover:text-foreground"
        aria-expanded={open}
      >
        {session?.user.email ? "ACCOUNT" : "SIGN IN"}
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-72 rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-xl">
          <p className="mb-1 font-mono text-xs font-semibold">PHANTOM ACCOUNT</p>
          {!isSupabaseConfigured ? (
            <p className="text-xs text-muted-foreground">Supabase environment is not configured for this deployment.</p>
          ) : session?.user.email ? (
            <>
              <p className="mb-3 break-all text-xs text-muted-foreground">{session.user.email}</p>
              <button type="button" disabled={busy} onClick={signOut} className="w-full rounded-sm border border-border px-3 py-2 text-xs hover:bg-hover disabled:opacity-50">
                {busy ? "Please wait…" : "Sign out"}
              </button>
            </>
          ) : (
            <form onSubmit={sendMagicLink} className="space-y-2">
              <p className="text-xs text-muted-foreground">Sign in with an email link. No password is collected by this app.</p>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-sm border border-border bg-background px-2 py-2 text-xs outline-none focus:border-primary"
              />
              <button type="submit" disabled={busy} className="w-full rounded-sm bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50">
                {busy ? "Sending…" : "Send sign-in link"}
              </button>
            </form>
          )}
          {notice && <p role="status" className="mt-2 break-words text-xs text-muted-foreground">{notice}</p>}
          <p className="mt-3 border-t border-border pt-2 text-[0.625rem] text-muted-foreground">Demo social content remains sample data. Authentication alone does not connect Instagram.</p>
        </div>
      )}
    </div>
  );
}
