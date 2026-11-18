"use client";
import { useActionState } from "react";
import { createSplit } from "@/lib/actions";
import { CATS, CITIES, TINTS } from "@/lib/constants";

export default function PostForm({ city }) {
  const [state, action, pending] = useActionState(createSplit, null);
  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>
      <div className="row2">
        <label className="f">Parfum<input className="box" name="name" required maxLength={60} placeholder="ex. Layton" /></label>
        <label className="f">Casă<input className="box" name="house" required maxLength={60} placeholder="ex. Parfums de Marly" /></label>
      </div>
      <div className="row2">
        <label className="f">Categorie<select className="box" name="category">{CATS.slice(1).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <label className="f">Concentrație<select className="box" name="concentration" defaultValue="Eau de parfum"><option>Eau de toilette</option><option>Eau de parfum</option><option>Extrait de parfum</option><option>Parfum</option></select></label>
      </div>
      <div className="row2">
        <label className="f">Sticlă (ml)<input className="box" name="bottle_ml" type="number" min={5} max={500} required defaultValue={100} /></label>
        <label className="f">ml la split<input className="box" name="total_ml" type="number" min={2} max={500} required defaultValue={90} /></label>
      </div>
      <div className="row2">
        <label className="f">Preț pe ml (lei)<input className="box" name="price_per_ml" type="number" min={0.5} max={200} step={0.5} required defaultValue={12} /></label>
        <label className="f">An lansare<input className="box" name="year" maxLength={4} placeholder="ex. 2016" /></label>
      </div>
      <label className="f">Note de vârf<input className="box" name="notes_top" maxLength={80} placeholder="ex. Măr, lavandă" /></label>
      <label className="f">Note de inimă<input className="box" name="notes_heart" maxLength={80} placeholder="ex. Geraniu, iasomie" /></label>
      <label className="f">Note de bază<input className="box" name="notes_base" maxLength={80} placeholder="ex. Vanilie, cardamom" /></label>
      <label className="f">Sezon<input className="box" name="season" maxLength={60} placeholder="ex. Toamnă, iarnă" /></label>
      <label className="f">Descriere<textarea className="box" name="description" rows={3} maxLength={600} placeholder="De unde e sticla, cum decantezi, ce aduci la întâlnire" /></label>
      <div className="row2">
        <label className="f">Oraș<select className="box" name="city" defaultValue={city}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="f">Zona<input className="box" name="area" required maxLength={50} placeholder="ex. Obor" /></label>
      </div>
      <label className="f">Când<input className="box" name="meet_when" required maxLength={50} placeholder="ex. Sâm 6 dec, 15:00" /></label>
      <fieldset className="f" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ marginBottom: 6 }}>Culoarea sticlei în listă</legend>
        <div className="swatches">
          {TINTS.map((t, i) => (
            <label key={t} style={{ background: t }} aria-label={`Culoarea ${i + 1}`}>
              <input type="radio" name="tint" value={t} defaultChecked={i === 0} />
            </label>
          ))}
        </div>
      </fieldset>
      <p className="hint">Lotul apare „în verificare” până confirmăm pozele cu codul de lot.</p>
      {state?.error && <span className="err">{state.error}</span>}
      <button className="cta" type="submit" disabled={pending}>{pending ? "SE PUBLICĂ…" : "PUBLICĂ SPLIT-UL"}</button>
    </form>
  );
}
