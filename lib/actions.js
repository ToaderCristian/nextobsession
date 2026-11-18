"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CITIES, TINTS } from "@/lib/constants";

async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}

function friendly(error) {
  const m = error?.message || "";
  if (m.includes("ml liberi")) return "Nu mai sunt destui ml liberi.";
  if (m.includes("propriul split")) return "Nu poți rezerva la propriul split.";
  if (m.includes("duplicate")) return "Ai deja o rezervare la acest split.";
  if (m.includes("row-level security")) return "Nu ai voie să faci asta.";
  return "Nu s-a putut salva. Încearcă din nou.";
}

export async function reserve(splitId, ml, withKit) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "login" };
  if (![2, 5, 10].includes(Number(ml))) return { error: "Cantitate invalidă." };
  const { error } = await supabase.from("reservations").insert({ split_id: splitId, user_id: user.id, ml: Number(ml), with_kit: !!withKit });
  if (error) return { error: friendly(error) };
  revalidatePath(`/split/${splitId}`);
  revalidatePath("/");
  revalidatePath("/rezervari");
  return { ok: true };
}

export async function cancelReservation(splitId) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "login" };
  const { error } = await supabase.from("reservations").delete().eq("split_id", splitId).eq("user_id", user.id);
  if (error) return { error: friendly(error) };
  revalidatePath(`/split/${splitId}`);
  revalidatePath("/");
  revalidatePath("/rezervari");
  return { ok: true };
}

export async function createSplit(_prev, formData) {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login?next=/posteaza");
  const g = (k) => String(formData.get(k) || "").trim();
  const n = (k) => Number(formData.get(k));
  const row = {
    seller_id: user.id,
    name: g("name").slice(0, 60),
    house: g("house").slice(0, 60),
    category: ["nisa", "designer", "arab"].includes(g("category")) ? g("category") : "nisa",
    concentration: g("concentration") || "Eau de parfum",
    bottle_ml: n("bottle_ml"),
    total_ml: n("total_ml"),
    price_per_ml: n("price_per_ml"),
    year: g("year").slice(0, 4) || null,
    notes_top: g("notes_top").slice(0, 80) || null,
    notes_heart: g("notes_heart").slice(0, 80) || null,
    notes_base: g("notes_base").slice(0, 80) || null,
    season: g("season").slice(0, 60) || null,
    description: g("description").slice(0, 600) || null,
    city: CITIES.includes(g("city")) ? g("city") : CITIES[0],
    area: g("area").slice(0, 50),
    meet_when: g("meet_when").slice(0, 50),
    tint: TINTS.includes(g("tint")) ? g("tint") : TINTS[0],
  };
  if (!row.name || !row.house || !row.area || !row.meet_when) return { error: "Completează parfumul, casa, zona și data." };
  if (!(row.total_ml >= 2 && row.bottle_ml >= 5 && row.total_ml <= row.bottle_ml)) return { error: "ml la split nu pot depăși sticla." };
  if (!(row.price_per_ml > 0 && row.price_per_ml <= 200)) return { error: "Prețul pe ml trebuie să fie între 0,5 și 200 lei." };
  const { data, error } = await supabase.from("splits").insert(row).select("id").single();
  if (error) return { error: friendly(error) };
  revalidatePath("/");
  redirect(`/split/${data.id}`);
}

export async function deleteSplit(splitId) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "login" };
  const { error } = await supabase.from("splits").delete().eq("id", splitId).eq("seller_id", user.id);
  if (error) return { error: friendly(error) };
  revalidatePath("/");
  revalidatePath("/profil");
  return { ok: true };
}

export async function addReview(splitId, sellerId, splitLabel, stars, body) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "login" };
  const s = Number(stars);
  if (!(s >= 1 && s <= 5)) return { error: "Alege între 1 și 5 stele." };
  const { error } = await supabase.from("reviews").insert({
    split_id: splitId,
    seller_id: sellerId,
    reviewer_id: user.id,
    split_label: String(splitLabel || "").slice(0, 80),
    stars: s,
    body: String(body || "").trim().slice(0, 400),
  });
  if (error) return { error: friendly(error) };
  revalidatePath(`/vanzator/${sellerId}`);
  revalidatePath("/rezervari");
  revalidatePath("/");
  return { ok: true };
}

export async function updateProfile(_prev, formData) {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login?next=/profil");
  const username = String(formData.get("username") || "").trim().toLowerCase();
  if (!/^[a-z0-9._]{3,24}$/.test(username)) return { error: "Username: 3-24 caractere, doar litere mici, cifre, punct și _." };
  const { error } = await supabase.from("profiles").update({ username, display_name: String(formData.get("display_name") || "").slice(0, 40) }).eq("id", user.id);
  if (error) return { error: error.message.includes("duplicate") ? "Username-ul e deja luat." : "Nu s-a putut salva." };
  revalidatePath("/profil");
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function reportSplit(splitId, reason) {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "login" };
  const r = String(reason || "").trim().slice(0, 500);
  if (r.length < 3) return { error: "Spune-ne pe scurt ce e în neregulă." };
  const { error } = await supabase.from("reports").insert({ split_id: splitId, reporter_id: user.id, reason: r });
  if (error) return { error: friendly(error) };
  return { ok: true };
}
