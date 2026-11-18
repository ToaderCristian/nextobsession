"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// Linkul de login din email aduce sesiunea în #hash; o salvăm în cookie-uri ca s-o vadă și serverul.
export default function AuthHash() {
  const [err, setErr] = useState("");
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    let next = query.get("next") || "/";
    if (!next.startsWith("/") || next.startsWith("//")) next = "/";
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    const access_token = hash.get("access_token");
    const refresh_token = hash.get("refresh_token");
    if (!access_token || !refresh_token) {
      setErr(hash.get("error_description") ? "Linkul a expirat sau a fost deja folosit. Cere unul nou." : "Link invalid. Cere unul nou.");
      return;
    }
    createClient().auth.setSession({ access_token, refresh_token }).then(({ error }) => {
      if (error) setErr("Nu am putut finaliza login-ul. Cere un link nou.");
      else window.location.replace(next);
    });
  }, []);
  return (
    <section className="sec">
      {err ? (
        <div className="empty">{err} <Link className="linkbtn" href="/login">Înapoi la login</Link></div>
      ) : (
        <p className="hint">Te conectăm…</p>
      )}
    </section>
  );
}
