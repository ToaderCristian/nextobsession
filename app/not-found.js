import Link from "next/link";
export default function NotFound() {
  return <section className="sec"><div className="empty">Pagina nu există sau split-ul a fost șters. <Link className="linkbtn" href="/">Înapoi acasă</Link></div></section>;
}
