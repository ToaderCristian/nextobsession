"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SearchBox() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  useEffect(() => setQ(params.get("q") || ""), [params]);
  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("q") || "") === q) return;
      const p = new URLSearchParams(params.toString());
      if (q) p.set("q", q); else p.delete("q");
      router.replace("/?" + p.toString(), { scroll: false });
    }, 300);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <label className="search">
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Caută parfum, casă sau vânzător" aria-label="Caută" />
    </label>
  );
}

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const home = path === "/";
  return (
    <header className="band">
      <div className="bandrow">
        {home ? <span /> : (
          <button className="iconbtn" onClick={() => router.back()} aria-label="Înapoi">
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
        )}
        <Link href="/" className="word">NEXT OBSESSION</Link>
        <Link href="/profil" className="iconbtn" aria-label="Profilul meu">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
        </Link>
      </div>
      {home && <Suspense fallback={null}><SearchBox /></Suspense>}
      <nav className="topnav" aria-label="Meniu principal">
        <Link href="/" aria-current={path === "/" ? "page" : undefined}>Acasă</Link>
        <Link href="/posteaza" aria-current={path.startsWith("/posteaza") ? "page" : undefined}>Postează un split</Link>
        <Link href="/rezervari" aria-current={path.startsWith("/rezervari") ? "page" : undefined}>Rezervări</Link>
        <Link href="/profil" aria-current={path.startsWith("/profil") ? "page" : undefined}>Profil</Link>
      </nav>
    </header>
  );
}
