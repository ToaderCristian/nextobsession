import { createClient } from "@/lib/supabase/server";

import { CITIES, CATS, KIT, TINTS, fmt, fmt1 } from "@/lib/constants";
export { CITIES, CATS, KIT, TINTS, fmt, fmt1 };

export async function getUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
  return { ...data.user, profile };
}

async function statsMaps(supabase, splitIds, sellerIds) {
  const [ss, sel] = await Promise.all([
    splitIds.length ? supabase.from("split_stats").select("*").in("split_id", splitIds) : { data: [] },
    sellerIds.length ? supabase.from("seller_stats").select("*").in("seller_id", sellerIds) : { data: [] },
  ]);
  const splitMap = Object.fromEntries((ss.data || []).map((r) => [r.split_id, r]));
  const sellerMap = Object.fromEntries((sel.data || []).map((r) => [r.seller_id, r]));
  return { splitMap, sellerMap };
}

function decorate(s, splitMap, sellerMap) {
  const st = splitMap[s.id] || { taken_ml: s.base_taken, participants: s.base_count };
  const sr = sellerMap[s.seller_id] || { avg_rating: 0, review_count: 0 };
  return {
    ...s,
    taken: Number(st.taken_ml) || 0,
    participants: Number(st.participants) || 0,
    free: Math.max(0, s.total_ml - (Number(st.taken_ml) || 0)),
    rating: Number(sr.avg_rating) || 0,
    reviews: Number(sr.review_count) || 0,
  };
}

const SPLIT_SELECT = "*, seller:profiles!splits_seller_id_fkey(id, username, display_name, verified, splits_done)";

export async function listSplits({ city, cat, q, sort, sellerId }) {
  const supabase = await createClient();
  let query = supabase.from("splits").select(SPLIT_SELECT).limit(300);
  if (city) query = query.eq("city", city);
  if (cat && cat !== "toate") query = query.eq("category", cat);
  if (sellerId) query = query.eq("seller_id", sellerId);
  const { data, error } = await query;
  if (error) throw error;
  let rows = data || [];
  if (q) {
    const t = q.toLowerCase();
    rows = rows.filter((s) => `${s.name} ${s.house} ${s.seller?.username || ""}`.toLowerCase().includes(t));
  }
  const { splitMap, sellerMap } = await statsMaps(
    supabase,
    rows.map((r) => r.id),
    [...new Set(rows.map((r) => r.seller_id))]
  );
  let out = rows.map((s) => decorate(s, splitMap, sellerMap));
  if (sort === "new") out.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  else if (sort === "price") out.sort((a, b) => a.price_per_ml - b.price_per_ml);
  else out.sort((a, b) => b.rating * Math.min(b.reviews, 50) + b.reviews - (a.rating * Math.min(a.reviews, 50) + a.reviews));
  out.sort((a, b) => (a.free === 0) - (b.free === 0));
  return out;
}

export async function getSplit(id) {
  const supabase = await createClient();
  const { data: s } = await supabase.from("splits").select(SPLIT_SELECT).eq("id", id).maybeSingle();
  if (!s) return null;
  const { splitMap, sellerMap } = await statsMaps(supabase, [s.id], [s.seller_id]);
  return decorate(s, splitMap, sellerMap);
}

export async function getSeller(id) {
  const supabase = await createClient();
  const [{ data: profile }, { data: reviews }, { data: stat }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("reviews")
      .select("*, reviewer:profiles!reviews_reviewer_id_fkey(username)")
      .eq("seller_id", id)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("seller_stats").select("*").eq("seller_id", id).maybeSingle(),
  ]);
  if (!profile) return null;
  return { profile, reviews: reviews || [], rating: Number(stat?.avg_rating) || 0, count: Number(stat?.review_count) || 0 };
}

export async function myReservations(userId) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reservations")
    .select("*, split:splits(*, seller:profiles!splits_seller_id_fkey(id, username))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  const { data: revs } = await supabase.from("reviews").select("split_id, stars").eq("reviewer_id", userId);
  const reviewed = Object.fromEntries((revs || []).map((r) => [r.split_id, r.stars]));
  return (data || []).filter((r) => r.split).map((r) => ({ ...r, reviewed: reviewed[r.split_id] }));
}

export async function myReservationFor(splitId, userId) {
  if (!userId) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("reservations").select("*").eq("split_id", splitId).eq("user_id", userId).maybeSingle();
  return data;
}

export async function participantsOf(splitId) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reservations")
    .select("ml, with_kit, user:profiles!reservations_user_id_fkey(username)")
    .eq("split_id", splitId);
  return data || [];
}
