"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  ["/", "Acasă", <path key="a" d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" strokeLinejoin="round" />],
  ["/posteaza", "Postează", <g key="b"><rect x="3.5" y="3.5" width="17" height="17" /><path d="M12 8v8M8 12h8" /></g>],
  ["/rezervari", "Rezervări", <g key="c"><rect x="7" y="3" width="10" height="4" /><path d="M6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" /><path d="M9 13l2 2 4-4" /></g>],
  ["/profil", "Profil", <g key="d"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></g>],
];

export default function BottomNav() {
  const path = usePathname();
  const active = (href) => (href === "/" ? path === "/" || path.startsWith("/split") || path.startsWith("/vanzator") : path.startsWith(href));
  return (
    <nav className="tabs" aria-label="Navigare">
      {TABS.map(([href, label, icon]) => (
        <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">{icon}</svg>
          {label}
        </Link>
      ))}
    </nav>
  );
}
