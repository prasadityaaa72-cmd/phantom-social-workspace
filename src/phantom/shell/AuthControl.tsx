import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

type AuthMode = "signin" | "signup" | "reset";

export function AuthControl() {
  const [session, setSession] = useState<Session | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileUsername, setProfileUsername] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
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

  useEffect(() => {
    if (!supabase || !session?.user.id) {
      setProfileUsername(null);
      return;
    }
    let alive = true;
    supabase.from("profiles").select("username").eq("id", session.user.id).maybeSingle().then(({ data }) => {
      if (alive) setProfileUsername(data?.username ?? null);
    });
    return () => { alive = false; };
  }, [session?.user.id]);

  async function saveUsername(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    const normalized = newUsername.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(normalized)) {
      setNotice("Username must be 3–24 characters using lowercase letters, numbers, or underscores.");
      return;
    }
    setBusy(true);
    setNotice("");
    const { error } = await supabase.auth.updateUser({ data: { username: normalized } });
    setBusy(false);
    if (error) { setNotice(error.message); return; }
    setProfileUsername(normalized);
    setNewUsername("");
    setNotice("Username saved.");
  }
  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setNotice("");
  }

  async function submitSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setNotice("");
    const login = identifier.trim();
    let errorMessage = "";

    if (login.includes("@")) {
      const { error } = await supabase.auth.signInWithPassword({
        email: login,
        password,
      });
      errorMessage = error?.message ?? "";
    } else {
      const { data, error } = await supabase.functions.invoke("username-login", {
        body: { identifier: login.toLowerCase(), password },
      });
      if (error || !data?.session?.access_token || !data?.session?.refresh_token) {
        errorMessage = data?.error || "Invalid username/email or password.";
      } else {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        errorMessage = sessionError?.message ?? "";
      }
    }

    setBusy(false);
    setNotice(errorMessage || "Signed in successfully.");
    if (!errorMessage) {
      setPassword("");
      setOpen(false);
    }
  }

  async function submitSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    const normalizedUsername = username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(normalizedUsername)) {
      setNotice("Username must be 3–24 characters: lowercase letters, numbers, or underscores.");
      return;
    }
    if (password.length < 8) {
      setNotice("Use a password with at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setNotice("Passwords do not match.");
      return;
    }

    setBusy(true);
    setNotice("");
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { username: normalizedUsername },
        emailRedirectTo: window.location.origin,
      },
    });
    setBusy(false);

    if (error) {
      setNotice(error.message);
      return;
    }
    setPassword("");
    setConfirmPassword("");
    if (data.session) {
      setNotice("Account created. You're signed in.");
      setOpen(false);
    } else {
      setNotice("Account created. Check your email to confirm the address, then sign in.");
      setMode("signin");
      setIdentifier(email.trim());
    }
  }

  async function submitPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setNotice("");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    });
    setBusy(false);
    setNotice(error ? error.message : "If an account exists for that email, a password-reset link has been sent.");
  }

  async function signOut() {
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.signOut();
    setBusy(false);
    setNotice(error ? error.message : "Signed out.");
  }

  const inputClass =
    "w-full rounded-sm border border-border bg-background px-2 py-2 text-xs outline-none focus:border-primary";

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
          <p className="mb-2 font-mono text-xs font-semibold">PHANTOM ACCOUNT</p>
          {!isSupabaseConfigured ? (
            <p className="text-xs text-muted-foreground">
              Supabase environment is not configured for this deployment.
            </p>
          ) : session?.user.email ? (
            <>
              <p className="mb-1 break-all text-xs text-muted-foreground">{session.user.email}</p>
              {profileUsername ? (
                <p className="mb-3 font-mono text-xs text-foreground">@{profileUsername}</p>
              ) : (
                <form onSubmit={saveUsername} className="mb-3 space-y-2">
                  <p className="text-xs text-muted-foreground">Choose a username for this existing account.</p>
                  <input required minLength={3} maxLength={24} pattern="[A-Za-z0-9_]{3,24}" value={newUsername} onChange={(event) => setNewUsername(event.target.value)} placeholder="Choose username" className={inputClass} />
                  <button type="submit" disabled={busy} className="w-full rounded-sm bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50">{busy ? "Saving…" : "Save username"}</button>
                </form>
              )}
              <button type="button" disabled={busy} onClick={signOut} className="w-full rounded-sm border border-border px-3 py-2 text-xs hover:bg-hover disabled:opacity-50">{busy ? "Please wait…" : "Sign out"}</button>
            </>
          ) : (
            <>
              <div className="mb-3 grid grid-cols-3 gap-1">
                {(["signin", "signup", "reset"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => changeMode(item)}
                    className={`rounded-sm border px-1 py-1.5 text-[0.625rem] ${mode === item ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:bg-hover"}`}
                  >
                    {item === "signin" ? "LOG IN" : item === "signup" ? "SIGN UP" : "RESET"}
                  </button>
                ))}
              </div>

              {mode === "signin" && (
                <form onSubmit={submitSignIn} className="space-y-2">
                  <p className="text-xs text-muted-foreground">Log in with your username or email and password.</p>
                  <input
                    required
                    autoComplete="username"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="Username or email"
                    className={inputClass}
                  />
                  <input
                    required
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className={inputClass}
                  />
                  <button type="submit" disabled={busy} className="w-full rounded-sm bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50">
                    {busy ? "Signing in…" : "Log in"}
                  </button>
                </form>
              )}

              {mode === "signup" && (
                <form onSubmit={submitSignUp} className="space-y-2">
                  <p className="text-xs text-muted-foreground">Create a PHANTOM account with a unique username.</p>
                  <input
                    required
                    type="text"
                    autoComplete="username"
                    minLength={3}
                    maxLength={24}
                    pattern="[A-Za-z0-9_]{3,24}"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Username (3–24 characters)"
                    className={inputClass}
                  />
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email address"
                    className={inputClass}
                  />
                  <input
                    required
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password (at least 8 characters)"
                    className={inputClass}
                  />
                  <input
                    required
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm password"
                    className={inputClass}
                  />
                  <button type="submit" disabled={busy} className="w-full rounded-sm bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50">
                    {busy ? "Creating account…" : "Create account"}
                  </button>
                </form>
              )}

              {mode === "reset" && (
                <form onSubmit={submitPasswordReset} className="space-y-2">
                  <p className="text-xs text-muted-foreground">Password reset is sent to your registered email address.</p>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email address"
                    className={inputClass}
                  />
                  <button type="submit" disabled={busy} className="w-full rounded-sm bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50">
                    {busy ? "Sending…" : "Send reset link"}
                  </button>
                </form>
              )}
            </>
          )}
          {notice && <p role="status" className="mt-2 break-words text-xs text-muted-foreground">{notice}</p>}
          <p className="mt-3 border-t border-border pt-2 text-[0.625rem] text-muted-foreground">
            Your password is handled by Supabase Auth, not stored by PHANTOM. Social content is still demo data.
          </p>
        </div>
      )}
    </div>
  );
}
