import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

export const metadata = {
  title: "Next Obsession · split-uri de parfum",
  description: "Împarți sticla, plătești doar ml-ii tăi. Split-uri de parfum între pasionați, cu vânzători verificați.",
};
export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&family=Nunito+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="shell">
          <Header />
          <main>
            {children}
            <footer className="foot">
              <span>© Next Obsession</span>
              <Link href="/termeni">Termeni și reguli</Link>
            </footer>
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
