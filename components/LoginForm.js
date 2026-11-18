"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ next }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const site = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const redirectTo = `${site}/auth/callback?next=${encodeURIComponent(next)}`;

  async function emailLogin(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    const { error } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setBusy(false);
    if (error) setErr("Nu am putut trimite emailul. Verifică adresa și încearcă din nou.");
    else setSent(true);
  }
  async function google() {
    setErr("");
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (error) setErr("Login-ul cu Google nu e disponibil momentan.");
  }

  if (sent) return <div className="mine"><b>Verifică emailul</b><span className="hint">Ți-am trimis un link de intrare pe {email}. Deschide-l de pe acest dispozitiv.</span></div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {process.env.NEXT_PUBLIC_GOOGLE_LOGIN === "1" && (
        <>
          <button className="ghost" onClick={google}>Continuă cu Google</button>
          <span className="hint" style={{ textAlign: "center" }}>sau</span>
        </>
      )}
      <form onSubmit={emailLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label className="f">Email<input className="box" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        {err && <span className="err">{err}</span>}
        <button className="cta" type="submit" disabled={busy}>{busy ? "SE TRIMITE…" : "TRIMITE-MI LINKUL"}</button>
      </form>
    </div>
  );
}
