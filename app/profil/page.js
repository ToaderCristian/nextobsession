import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser, listSplits } from "@/lib/data";
import { signOut } from "@/lib/actions";
import ProfileForm from "@/components/ProfileForm";
import DeleteSplit from "@/components/DeleteSplit";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/profil");
  const p = user.profile || {};
  const mine = await listSplits({ sellerId: user.id, sort: "new" });
  return (
    <section className="sec">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span className="av" style={{ width: 60, height: 60 }}>{(p.username || "?").slice(0, 2).toUpperCase()}</span>
        <div><h1 style={{ margin: 0, fontSize: 22 }}>{p.username}</h1><span className="hint">{user.email}</span></div>
      </div>
      <Link className="ghost" href={`/vanzator/${user.id}`}>Vezi profilul meu public și recenziile</Link>
      <ProfileForm username={p.username || ""} displayName={p.display_name || ""} />
      <div className="sechead" style={{ marginTop: 6 }}><h2 style={{ fontSize: 18 }}>Split-urile mele</h2><span className="count">{mine.length}</span></div>
      {mine.length ? mine.map((s) => (
        <div className="boxcard" key={s.id}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span><span className="house">{s.house}</span><br /><b className="pname">{s.name}</b></span>
            <b>{s.taken}/{s.total_ml} ml</b>
          </div>
          <div className="bar"><i style={{ width: `${Math.min(100, Math.round((s.taken / Math.max(1, s.total_ml)) * 100))}%` }} /></div>
          <span className="hint">{s.participants} participanți · {s.meet_when}</span>
          <div className="row2"><Link className="ghost" href={`/split/${s.id}`}>Deschide</Link><DeleteSplit id={s.id} /></div>
        </div>
      )) : <div className="empty">N-ai postat încă niciun split.</div>}
      <Link className="cta dark" href="/posteaza">Postează un split</Link>
      <form action={signOut}><button className="ghost" type="submit">Ieși din cont</button></form>
    </section>
  );
}
