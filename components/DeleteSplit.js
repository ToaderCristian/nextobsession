"use client";
import { useState, useTransition } from "react";
import { deleteSplit } from "@/lib/actions";

export default function DeleteSplit({ id }) {
  const [confirm, setConfirm] = useState(false);
  const [pending, start] = useTransition();
  if (!confirm) return <button className="ghost danger" onClick={() => setConfirm(true)}>Șterge</button>;
  return (
    <button className="ghost danger" disabled={pending} onClick={() => start(async () => { await deleteSplit(id); })}>
      {pending ? "Se șterge…" : "Confirmă ștergerea"}
    </button>
  );
}
