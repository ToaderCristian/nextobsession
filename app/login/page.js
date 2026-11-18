import LoginForm from "@/components/LoginForm";

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/";
  return (
    <section className="sec">
      <h1 className="title" style={{ fontSize: 26, textTransform: "none", letterSpacing: ".02em" }}>Intră în cont</h1>
      <p className="hint">Fără parolă: primești un cod pe email.</p>
      {sp.error && <p className="err">Linkul a expirat sau nu e valid. Cere unul nou.</p>}
      <LoginForm next={next} />
    </section>
  );
}
