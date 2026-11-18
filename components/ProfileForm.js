"use client";
import { useActionState } from "react";
import { updateProfile } from "@/lib/actions";

export default function ProfileForm({ username, displayName }) {
  const [state, action, pending] = useActionState(updateProfile, null);
  return (
    <form action={action} className="boxcard">
      <div className="row2">
        <label className="f">Username<input className="box" name="username" defaultValue={username} required maxLength={24} /></label>
        <label className="f">Nume afișat<input className="box" name="display_name" defaultValue={displayName} maxLength={40} /></label>
      </div>
      {state?.error && <span className="err">{state.error}</span>}
      {state?.ok && <span className="okmsg">Salvat.</span>}
      <button className="ghost" type="submit" disabled={pending}>Salvează profilul</button>
    </form>
  );
}
