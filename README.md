# Next Obsession

Split-uri de parfum între pasionați: împarți sticla, plătești doar ml-ii tăi.
Next.js 15 + Supabase (bază de date, conturi, securitate). Totul merge pe planurile gratuite la început.

## Ce face

- **Acasă:** split-uri pe oraș, căutare, categorii, sortare după vânzătorii cei mai apreciați.
- **Split:** alegi 2 / 5 / 10 ml, sticluță opțională, rezervi sau anulezi. Nu se poate rezerva peste ml-ii liberi sau la propriul split (verificat în baza de date).
- **Vânzător:** rating, distribuția pe stele, recenzii doar de la participanți confirmați.
- **Postează:** formular complet cu detaliile parfumului.
- **Rezervări:** rezervările tale + recenzie după întâlnire.
- **Profil:** username, split-urile tale, ștergere, ieșire din cont.
- **Login:** link magic pe email sau Google, fără parole.
- **Raportare** anunțuri (le vezi în tabela `reports`).

Insigna „Lot verificat” și „Vânzător verificat” le pui tu manual din Supabase (`splits.lot_verified`, `profiles.verified`). Userii nu și le pot da singuri.

## Lansare pas cu pas (~20 de minute)

### 1. Supabase
1. Cont pe https://supabase.com → **New project** (regiune: Frankfurt).
2. **SQL Editor → New query**: lipește tot `supabase/schema.sql` → **Run**.
3. Opțional, date de exemplu: lipește `supabase/seed.sql` → **Run**. Le ștergi oricând cu comanda din capul fișierului.
4. **Project Settings → API**: copiază `Project URL` și cheia `anon public`.

### 2. Rulare locală (opțional)
```bash
cp .env.example .env.local   # completează cele 3 valori
npm install
npm run dev                  # http://localhost:3000
```

### 3. GitHub + Vercel
1. Urcă folderul într-un repo nou pe GitHub.
2. https://vercel.com → **Add New → Project** → alegi repo-ul.
3. La **Environment Variables** pui:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = adresa finală, ex. `https://nextobsession.ro` (sau cea `.vercel.app` până ai domeniu)
4. **Deploy**.

### 4. Login (Supabase → Authentication)
1. **URL Configuration**: `Site URL` = adresa site-ului; la **Redirect URLs** adaugi `https://ADRESA-TA/auth/callback` (și `http://localhost:3000/auth/callback` pentru test local).
2. **Email**: merge din prima, dar Supabase trimite doar câteva emailuri pe oră. Pentru lansare pune un SMTP propriu (ex. Resend, gratuit la început) în **Authentication → Emails → SMTP Settings**.
3. **Google**: **Sign In / Providers → Google → Enable**. Ai nevoie de un Client ID și Secret din Google Cloud Console (OAuth consent screen + Credentials → OAuth client ID, tip Web, cu redirect-ul afișat de Supabase).

### 5. Domeniu
În Vercel → **Settings → Domains** adaugi domeniul și setezi DNS-ul cum îți spune Vercel. Apoi actualizezi `NEXT_PUBLIC_SITE_URL` și URL-urile din Supabase.

## Înainte de lansarea publică
- Termenii din `/termeni` sunt ciornă: dă-i unui avocat (decanturi, DAC7, GDPR).
- Fă-o pe firmă (SRL), nu pe persoană fizică.

## Structură
- `app/` paginile (App Router), `components/` UI, `lib/data.js` citiri, `lib/actions.js` scrieri (server actions)
- `supabase/schema.sql` tabele, reguli de securitate (RLS), triggere de validare
