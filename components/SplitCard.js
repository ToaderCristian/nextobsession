import Link from "next/link";
import Bottle from "@/components/Bottle";
import { fmt, fmt1 } from "@/lib/constants";

export function LotTag({ verified }) {
  return verified ? <span className="tag">LOT VERIFICAT</span> : <span className="tag pending">LOT ÎN VERIFICARE</span>;
}

export default function SplitCard({ s }) {
  return (
    <Link href={`/split/${s.id}`} className="card">
      <span className="tile"><Bottle tint={s.tint} /><LotTag verified={s.lot_verified} /></span>
      <span className="cbody">
        <span className="house">{s.house}</span>
        <span className="pname">{s.name}</span>
        <span className="sub">{s.concentration} · split {s.total_ml} ml</span>
        <span className="sub" style={{ marginTop: 2 }}>
          {s.reviews ? <><span className="star">★</span> {fmt1(s.rating)} ({s.reviews}) · </> : "Nou · "}
          {s.seller?.username}
        </span>
        <span className="price">{fmt(s.price_per_ml)} lei <span>/ ml</span></span>
        <span className={`free ${s.free ? "" : "full"}`}>{s.free ? `${s.free} ml liberi` : "Complet"}</span>
        <span className="cbtn">{s.free ? "Rezervă" : "Vezi detalii"}</span>
      </span>
    </Link>
  );
}
