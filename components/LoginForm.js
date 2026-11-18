"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ next }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const site = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const redirectTo = `${site}/auth/callback?next=${encodeURIComponent(next)}`;

  async function sendEmail(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    const { error } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setBusy(false);
    if (error) setErr(error.status === 429 ? "Prea multe emailuri trimise. Mai încearcă peste câteva minute." : "Nu am putut trimite emailul. Verifică adresa și încearcă din nou.");
    else setSent(true);
  }
  async function verifyCode(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    const { error } = await createClient().auth.verifyOtp({ email, token: code.trim(), type: "email" });
    setBusy(false);
    if (error) { setErr("Codul nu e corect sau a expirat. Cere unul nou."); return; }
    router.replace(next);
    router.refresh();
  }
  async function google() {
    setErr("");
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (error) setErr("Login-ul cu Google nu e disponibil momentan.");
  }

  if (sent) {
    return (
      <form onSubmit={verifyCode} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="mine">
          <b>Verifică emailul</b>
          <span className="hint">Ți-am trimis un cod pe {email}. Scrie-l mai jos sau apasă pe linkul din email.</span>
        </div>
        <label className="f">Codul din email
          <input className="box" inputMode="numeric" autoComplete="one-time-code" maxLength={10} required value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} style={{ fontSize: 22, letterSpacing: ".3em", textAlign: "center" }} />
        </label>
        {err && <span className="err">{err}</span>}
        <button className="cta" type="submit" disabled={busy || code.length < 6}>{busy ? "SE VERIFICĂ…" : "INTRĂ ÎN CONT"}</button>
        <button type="button" className="linkbtn" style={{ alignSelf: "center" }} onClick={() => { setSent(false); setCode(""); setErr(""); }}>Folosește alt email</button>
      </form>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {process.env.NEXT_PUBLIC_GOOGLE_LOGIN === "1" && (
        <>
          <button className="ghost" onClick={google}>Continuă cu Google</button>
          <span className="hint" style={{ textAlign: "center" }}>sau</span>
        </>
      )}
      <form onSubmit={sendEmail} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label className="f">Email<input className="box" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        {err && <span className="err">{err}</span>}
        <button className="cta" type="submit" disabled={busy}>{busy ? "SE TRIMITE…" : "TRIMITE-MI CODUL"}</button>
      </form>
    </div>
  );
}
