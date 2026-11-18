"use client";
import { useState, useTransition } from "react";
import { reportSplit } from "@/lib/actions";

export default function ReportButton({ splitId }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();
  if (msg === "ok") return <p className="okmsg report">Mulțumim, verificăm anunțul.</p>;
  return (
    <div className="report">
      {!open ? (
        <button className="linkbtn" style={{ color: "var(--muted)", fontSize: 13 }} onClick={() => setOpen(true)}>Raportează anunțul</button>
      ) : (
        <div className="boxcard">
          <label className="f">Ce e în neregulă?<textarea className="box" rows={2} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} /></label>
          {msg && <span className="err">{msg}</span>}
          <button className="ghost danger" disabled={pending} onClick={() => start(async () => {
            const r = await reportSplit(splitId, reason);
            if (r?.error === "login") window.location.href = `/login?next=/split/${splitId}`;
            else setMsg(r?.error || "ok");
          })}>Trimite sesizarea</button>
        </div>
      )}
    </div>
  );
}
