import Link from "next/link";
import { redirect } from "next/navigation";
import Bottle from "@/components/Bottle";
import ReviewForm from "@/components/ReviewForm";
import { KIT, fmt, getUser, myReservations } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/rezervari");
  const list = await myReservations(user.id);
  return (
    <section className="sec">
      <div className="sechead"><h2>Rezervările mele</h2><span className="count">{list.length}</span></div>
      {list.length ? list.map((r) => {
        const s = r.split;
        const cost = r.ml * Number(s.price_per_ml) + (r.with_kit ? KIT[r.ml] : 0);
        return (
          <div className="boxcard" key={r.id}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span className="tile" style={{ width: 64, flex: "none" }}><Bottle tint={s.tint} w={30} h={44} /></span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <span className="house">{s.house}</span><b className="pname">{s.name}</b>
                <span className="hint">{s.area}, {s.city} · {s.meet_when}</span>
              </span>
              <span style={{ textAlign: "right" }}><b>{r.ml} ml</b><br /><span className="hint">{fmt(cost)} lei</span></span>
            </div>
            <Link className="linkbtn" style={{ alignSelf: "flex-start" }} href={`/split/${s.id}`}>Vezi split-ul</Link>
            {r.reviewed ? (
              <span className="conf">✓ Ai lăsat recenzie: {"★".repeat(r.reviewed)}</span>
            ) : (
              <ReviewForm splitId={s.id} sellerId={s.seller_id} sellerName={s.seller?.username} label={`${s.name}, ${r.ml} ml`} />
            )}
          </div>
        );
      }) : <div className="empty">Nicio rezervare încă. Alege un split din Acasă.</div>}
    </section>
  );
}
