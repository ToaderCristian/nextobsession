"use client";
import { useState } from "react";

export default function Accordion({ panels, initial }) {
  const [open, setOpen] = useState(initial);
  return (
    <section className="acc">
      {panels.map(([key, title, rows]) => (
        <div key={key}>
          <button className="h" aria-expanded={open === key} onClick={() => setOpen(open === key ? null : key)}>
            {title}<span aria-hidden="true" style={{ fontWeight: 400, fontSize: 22 }}>{open === key ? "−" : "+"}</span>
          </button>
          {open === key && (
            <div className="accbody">
              {rows.map(([k, v]) => <div className="kv" key={k}><span>{k}</span><span>{v}</span></div>)}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
