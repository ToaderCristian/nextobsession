import { redirect } from "next/navigation";
import { getUser } from "@/lib/data";
import PostForm from "@/components/PostForm";

export const dynamic = "force-dynamic";

export default async function PostPage() {
  const user = await getUser();
  if (!user) redirect("/login?next=/posteaza");
  return (
    <section className="sec">
      <h1 className="title" style={{ fontSize: 26, textTransform: "none", letterSpacing: ".02em" }}>Postează un split</h1>
      <p className="hint">Împarte sticla la prețul de achiziție, fără adaos. Cu cât dai mai multe detalii, cu atât se umple mai repede.</p>
      <PostForm city={user.profile?.city || "București"} />
    </section>
  );
}
