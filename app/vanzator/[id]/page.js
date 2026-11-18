import { notFound } from "next/navigation";
import SplitCard from "@/components/SplitCard";
import { fmt1, getSeller, listSplits } from "@/lib/data";

export const dynamic = "force-dynamic";
const stars = (n) => "★★★★★".slice(0, Math.round(n)) + "☆☆☆☆☆".slice(0, 5 - Math.round(n));

export default async function SellerPage({ params }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const data = await getSeller(id);
  if (!data) notFound();
  const { profile, reviews, rating, count } = data;
  const active = (await listSplits({ sellerId: id })).filter((s) => s.free > 0);
  const dist = [5, 4, 3, 2, 1].map((n) => [n, reviews.filter((r) => r.stars === n).length]);
  return (
    <section className="sec">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span className="av" style={{ width: 64, height: 64, fontSize: 21 }}>{profile.username.slice(0, 2).toUpperCase()}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <h1 style={{ margin: 0, fontSize: 22 }}>{profile.username}</h1>
          {profile.verified ? <span className="verified" style={{ marginLeft: 0 }}>✓ IDENTITATE VERIFICATĂ</span> : <span className="newb" style={{ marginLeft: 0 }}>MEMBRU NOU</span>}
          <span className="hint">{profile.splits_done} split-uri finalizate · {profile.city}</span>
        </div>
      </div>
      <div className="rsum" style={{ marginTop: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="n">{count ? fmt1(rating) : "–"}</span>
          <span className="star" style={{ letterSpacing: ".08em" }}>{stars(rating)}</span>
          <span className="hint">{count} {count === 1 ? "recenzie" : "recenzii"}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {dist.map(([n, c]) => (
            <div className="dist" key={n}><span>{n}★</span><span className="t"><i style={{ width: `${count ? Math.round((c / count) * 100) : 0}%` }} /></span><span className="hint" style={{ textAlign: "right" }}>{c}</span></div>
          ))}
        </div>
      </div>
      <p className="hint">Recenziile pot fi lăsate doar de cei care au rezervat la un split al vânzătorului.</p>
      <div>
        {reviews.length ? reviews.map((r) => (
          <article className="rev" key={r.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><b>{r.reviewer?.username || "membru"}</b><span className="hint">{new Date(r.created_at).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" })}</span></div>
            <span className="star" style={{ letterSpacing: ".08em" }}>{stars(r.stars)}</span>
            {r.body && <p style={{ margin: 0 }}>{r.body}</p>}
            <span className="conf">✓ Participant confirmat{r.split_label ? ` · ${r.split_label}` : ""}</span>
          </article>
        )) : <div className="empty">Încă nicio recenzie.</div>}
      </div>
      {active.length > 0 && (
        <>
          <div className="sechead" style={{ marginTop: 8 }}><h2 style={{ fontSize: 18 }}>Split-uri active</h2></div>
          <div className="grid">{active.map((s) => <SplitCard key={s.id} s={s} />)}</div>
        </>
      )}
    </section>
  );
}
