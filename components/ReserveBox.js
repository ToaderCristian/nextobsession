"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { reserve, cancelReservation } from "@/lib/actions";
import { KIT, fmt } from "@/lib/constants";

export default function ReserveBox({ splitId, price, free, mine, loggedIn }) {
  const sizes = [2, 5, 10];
  const [ml, setMl] = useState(sizes.filter((m) => m <= free && m <= 5).pop() || 2);
  const [kit, setKit] = useState(true);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const total = ml * price + (kit ? KIT[ml] : 0);

  const run = (fn) => start(async () => {
    setErr("");
    const r = await fn();
    if (r?.error === "login") window.location.href = `/login?next=/split/${splitId}`;
    else if (r?.error) setErr(r.error);
  });

  if (mine) {
    const cost = mine.ml * price + (mine.with_kit ? KIT[mine.ml] : 0);
    return (
      <div className="mine">
        <b>Ai rezervat {mine.ml} ml{mine.with_kit ? " + sticluță" : ""}</b>
        <span className="hint">Plătești {fmt(cost)} lei vânzătorului la întâlnire.</span>
        {err && <span className="err">{err}</span>}
        <button className="ghost" disabled={pending} onClick={() => run(() => cancelReservation(splitId))}>Anulează rezervarea</button>
      </div>
    );
  }
  if (free < 2) return <p className="note" style={{ margin: 0 }}>Split complet. Revino pentru următorul.</p>;

  return (
    <>
      {sizes.map((m) => (
        <button key={m} className="opt" aria-pressed={ml === m} disabled={m > free} onClick={() => setMl(m)}>
          {m === 5 && <span className="ribbon">CEL MAI ALES</span>}
          <span style={{ display: "flex", flexDirection: "column" }}><b>{m} ml</b><em>{m > free ? "Indisponibil" : "Disponibil"}</em></span>
          <span className="p">{fmt(m * price)} lei</span>
        </button>
      ))}
      <label className="addon">
        <input type="checkbox" checked={kit} onChange={(e) => setKit(e.target.checked)} />
        <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <b style={{ fontSize: 14 }}>Sticluță de sticlă {ml} ml</b>
          <span className="hint" style={{ fontSize: 12 }}>Next Obsession · o primești la întâlnire</span>
        </span>
        <b>+{KIT[ml]} lei</b>
      </label>
      <div className="total"><b>{fmt(total)} lei</b><span className="hint">{fmt(price)} lei / ml{kit ? " + sticluță" : ""}</span></div>
      <span className="hint" style={{ marginTop: -6 }}>Plătești direct vânzătorului, la întâlnire</span>
      {err && <span className="err">{err}</span>}
      {loggedIn ? (
        <button className="cta" disabled={pending} onClick={() => run(() => reserve(splitId, ml, kit))}>{pending ? "SE REZERVĂ…" : `REZERVĂ ${ml} ML`}</button>
      ) : (
        <Link className="cta" href={`/login?next=/split/${splitId}`}>INTRĂ ÎN CONT CA SĂ REZERVI</Link>
      )}
    </>
  );
}
