import { Suspense } from "react";
import { CITIES, listSplits } from "@/lib/data";
import SplitCard from "@/components/SplitCard";
import { CitySelect, SortCat } from "@/components/Filters";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }) {
  const sp = await searchParams;
  const city = CITIES.includes(sp.oras) ? sp.oras : CITIES[0];
  const sort = ["rating", "new", "price"].includes(sp.sort) ? sp.sort : "rating";
  const cat = sp.cat || "toate";
  const q = (sp.q || "").slice(0, 60);
  let splits = [], failed = false;
  try { splits = await listSplits({ city, cat, q, sort }); } catch { failed = true; }

  return (
    <>
      <div className="locbar">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E7A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
        <span>Split-uri în</span>
        <Suspense fallback={<b>{city}</b>}><CitySelect city={city} /></Suspense>
      </div>
      <section className="hero">
        <div className="hero-text">
        <small>CUM FUNCȚIONEAZĂ</small>
        <h1>Împarți sticla. Plătești doar ml-ii tăi.</h1>
        <p>Prețul de achiziție împărțit pe ml, fără adaos. Plătești vânzătorului la întâlnire.</p>
        </div>
        <ol className="hero-steps">
          <li><b>Alegi split-ul</b><span>Parfum, oraș, vânzător cu recenzii.</span></li>
          <li><b>Rezervi ml-ii</b><span>2, 5 sau 10 ml, plus sticluță dacă vrei.</span></li>
          <li><b>Te întâlnești</b><span>Decantare pe loc, plată direct vânzătorului.</span></li>
        </ol>
      </section>
      <section className="sec">
        <div className="sechead"><h2>Split-uri</h2><span className="count">{splits.length} {splits.length === 1 ? "activ" : "active"}</span></div>
        <Suspense fallback={null}><SortCat sort={sort} cat={cat} /></Suspense>
        {failed ? (
          <div className="empty">Nu am putut încărca split-urile. Reîncearcă peste câteva secunde.</div>
        ) : splits.length ? (
          <div className="grid">{splits.map((s) => <SplitCard key={s.id} s={s} />)}</div>
        ) : (
          <div className="empty">{q ? `Nimic pentru „${q}” în ${city}.` : `Niciun split în ${city} încă. Pornește tu primul din „Postează”.`}</div>
        )}
      </section>
    </>
  );
}
