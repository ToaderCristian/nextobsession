import Link from "next/link";
import { notFound } from "next/navigation";
import Bottle from "@/components/Bottle";
import { LotTag } from "@/components/SplitCard";
import ReserveBox from "@/components/ReserveBox";
import Accordion from "@/components/Accordion";
import ReportButton from "@/components/ReportButton";
import { fmt, getSplit, getUser, myReservationFor, participantsOf } from "@/lib/data";

export const dynamic = "force-dynamic";

const stars = (n) => "★★★★★".slice(0, Math.round(n)) + "☆☆☆☆☆".slice(0, 5 - Math.round(n));

export async function generateMetadata({ params }) {
  const { id } = await params;
  const s = await getSplit(id).catch(() => null);
  return { title: s ? `${s.name} · ${s.house} · Next Obsession` : "Split · Next Obsession" };
}

export default async function SplitPage({ params }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [s, user] = await Promise.all([getSplit(id), getUser()]);
  if (!s) notFound();
  const own = user?.id === s.seller_id;
  const mine = await myReservationFor(s.id, user?.id);
  const people = own ? await participantsOf(s.id) : [];
  const pct = Math.min(100, Math.round((s.taken / Math.max(1, s.total_ml)) * 100));

  const panels = [
    ["desc", "Descriere", [["De la vânzător", s.description || "Fără descriere."]]],
    ["det", "Detalii parfum", [["Concentrație", s.concentration], ["Sticlă", `${s.bottle_ml} ml`], ["Cod de lot", s.lot_verified ? "Fotografiat și verificat" : "În verificare"], ["Lansat", s.year || "Nespecificat"], ["Sezon", s.season || "Nespecificat"]]],
    ["notes", "Note olfactive", [["Vârf", s.notes_top || "Nespecificat"], ["Inimă", s.notes_heart || "Nespecificat"], ["Bază", s.notes_base || "Nespecificat"]]],
    ["meet", "Întâlnire", [["Unde", `${s.area}, ${s.city}`], ["Când", s.meet_when], ["Participanți", `${s.participants} confirmați`]]],
  ];

  return (
    <>
      <div className="big"><Bottle tint={s.tint} w={140} h={190} /><LotTag verified={s.lot_verified} /></div>
      <div className="pad">
        <Link className="houselink" href={`/?q=${encodeURIComponent(s.house)}&oras=${encodeURIComponent(s.city)}`}>{s.house}</Link>
        <h1 className="title">{s.name}</h1>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{s.concentration} · sticlă {s.bottle_ml} ml</span>
        <div className="rate">
          {s.reviews ? <><span className="star" style={{ letterSpacing: ".08em" }}>{stars(s.rating)}</span><b>{fmt(s.rating.toFixed(1))}</b></> : <b>Vânzător nou</b>}
          <Link className="linkbtn" href={`/vanzator/${s.seller_id}`}>({s.reviews} {s.reviews === 1 ? "recenzie" : "recenzii"} vânzător)</Link>
        </div>
      </div>
      <div className="pad" style={{ gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <b>{s.taken} din {s.total_ml} ml rezervați</b><b style={{ color: "var(--green)" }}>{s.free} ml liberi</b>
        </div>
        <div className="bar"><i style={{ width: `${pct}%` }} /></div>
        {own ? (
          <div className="note" style={{ margin: 0 }}>
            Acesta e split-ul tău.{" "}
            {people.length ? `Rezervări: ${people.map((p) => `${p.user?.username} ${p.ml} ml${p.with_kit ? " + sticluță" : ""}`).join(", ")}.` : "Nicio rezervare din aplicație încă."}
          </div>
        ) : (
          <ReserveBox splitId={s.id} price={Number(s.price_per_ml)} free={s.free} mine={mine} loggedIn={!!user} />
        )}
      </div>
      <section className="seller">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="av">{(s.seller?.username || "?").slice(0, 2).toUpperCase()}</span>
          <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <b style={{ fontSize: 16 }}>{s.seller?.username}{s.seller?.verified ? <span className="verified">✓ VERIFICAT</span> : <span className="newb">MEMBRU NOU</span>}</b>
            <span className="hint">{s.reviews ? <><span className="star">★</span> {fmt(s.rating.toFixed(1))} · </> : null}{s.seller?.splits_done || 0} split-uri finalizate</span>
          </span>
        </div>
        <Link className="ghost" href={`/vanzator/${s.seller_id}`}>Vezi recenziile vânzătorului ({s.reviews})</Link>
      </section>
      <Accordion panels={panels} initial="det" />
      {!own && <ReportButton splitId={s.id} />}
    </>
  );
}
