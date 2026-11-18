"use client";
import { useState, useTransition } from "react";
import { addReview } from "@/lib/actions";

export default function ReviewForm({ splitId, sellerId, sellerName, label }) {
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  return (
    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
      <b style={{ fontSize: 14 }}>Recenzie pentru {sellerName}</b>
      <div className="stars-in" role="group" aria-label="Stele">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" aria-pressed={n <= stars} aria-label={`${n} stele`} onClick={() => setStars(n)}>★</button>
        ))}
      </div>
      <label className="f">Ce a mers bine sau nu<textarea className="box" rows={2} maxLength={400} value={text} onChange={(e) => setText(e.target.value)} /></label>
      {err && <span className="err">{err}</span>}
      <button className="cta dark" style={{ height: 46 }} disabled={pending || !stars}
        onClick={() => start(async () => { setErr(""); const r = await addReview(splitId, sellerId, label, stars, text); if (r?.error) setErr(r.error); })}>
        Trimite recenzia
      </button>
    </div>
  );
}
