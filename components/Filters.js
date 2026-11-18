"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { CATS, CITIES } from "@/lib/constants";

export function useSetParam() {
  const router = useRouter();
  const params = useSearchParams();
  return (key, value) => {
    const p = new URLSearchParams(params.toString());
    p.set(key, value);
    router.replace("/?" + p.toString(), { scroll: false });
  };
}

export function CitySelect({ city }) {
  const set = useSetParam();
  return (
    <select aria-label="Oraș" value={city} onChange={(e) => set("oras", e.target.value)}>
      {CITIES.map((c) => <option key={c}>{c}</option>)}
    </select>
  );
}

export function SortCat({ sort, cat }) {
  const set = useSetParam();
  return (
    <div className="filters">
      <label className="f">Sortează după
        <select className="box" value={sort} onChange={(e) => set("sort", e.target.value)}>
          <option value="rating">Cei mai apreciați vânzători</option>
          <option value="new">Cele mai noi</option>
          <option value="price">Preț pe ml</option>
        </select>
      </label>
      <label className="f">Categorie
        <select className="box" value={cat} onChange={(e) => set("cat", e.target.value)}>
          {CATS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
    </div>
  );
}
