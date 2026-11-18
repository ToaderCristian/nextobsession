-- Date de exemplu (opțional). Rulează după schema.sql ca site-ul să nu fie gol la lansare.
-- Le ștergi oricând cu:  delete from public.profiles where id::text like '00000000-0000-0000-0000-%';

insert into public.profiles (id, username, display_name, verified, splits_done) values
 ('00000000-0000-0000-0000-000000000001','roxana.oud','Roxana D.',true,63),
 ('00000000-0000-0000-0000-000000000002','andrei.niche','Andrei P.',true,47),
 ('00000000-0000-0000-0000-000000000003','ioana_scents','Ioana R.',true,22),
 ('00000000-0000-0000-0000-000000000004','mihai.decants','Mihai C.',false,6),
 ('00000000-0000-0000-0000-000000000011','cosmin_v','Cosmin V.',false,0),
 ('00000000-0000-0000-0000-000000000012','irina.m','Irina M.',false,0),
 ('00000000-0000-0000-0000-000000000013','bogdan.n','Bogdan N.',false,0),
 ('00000000-0000-0000-0000-000000000014','maria_t','Maria T.',false,0)
on conflict (id) do nothing;

insert into public.splits (id, seller_id, name, house, category, concentration, bottle_ml, total_ml, price_per_ml, year, notes_top, notes_heart, notes_base, season, description, city, area, meet_when, tint, lot_verified, base_taken, base_count) values
 ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Aventus','Creed','nisa','Eau de parfum',100,90,20,'2010','Ananas, bergamotă, coacăze negre','Mesteacăn, iasomie, paciuli','Mușchi de stejar, ambră gri, vanilie','Primăvară, vară','Sticlă cumpărată sigilată de la distribuitor autorizat. Decantez cu seringă nouă, în fața voastră.','București','Unirii','Dum 23 nov · 12:00','#DCE3E8',true,25,3),
 ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','Baccarat Rouge 540','Maison Francis Kurkdjian','nisa','Eau de parfum',70,60,23,'2015','Șofran, iasomie','Lemn de ambră, ambră gri','Rășină de brad, cedru','Toamnă, iarnă, seara','Sticlă cumpărată sigilată în octombrie. Decantez cu seringă nouă. Aduc bonul.','București','Piața Romană','Sâm 22 nov · 14:00','#E9C9BD',true,40,5),
 ('10000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000003','Angels'' Share','Kilian','nisa','Eau de parfum',50,45,26,'2020','Coniac','Scorțișoară, fava tonka, stejar','Praliné, vanilie, santal','Iarnă','Fac grup de WhatsApp imediat ce se umple.','București','Floreasca','Vin 21 nov · 19:00','#E2C79A',true,40,4),
 ('10000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000004','Khamrah','Lattafa','arab','Eau de parfum',100,90,2,'2022','Scorțișoară, nucșoară','Curmale, praliné','Vanilie, fava tonka','Toamnă, iarnă','Bun pentru cine vrea să încerce arăbești la preț mic.','București','Drumul Taberei','Mie 26 nov · 18:30','#D9D2E6',false,10,1),
 ('10000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000002','Naxos','Xerjoff','nisa','Eau de parfum',100,95,13,'2015','Lavandă, bergamotă','Miere, scorțișoară','Tutun, vanilie','Toamnă, iarnă','Split la Cluj, mă întorc acasă de sărbători.','Cluj-Napoca','Piața Unirii','Dum 23 nov · 16:00','#EBDDB8',true,15,2)
on conflict (id) do nothing;

insert into public.reviews (seller_id, reviewer_id, split_id, split_label, stars, body, created_at) values
 ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000011',null,'Baccarat Rouge 540, 5 ml',5,'Punctual, sticluțe curate, a decantat în fața noastră cu seringă nouă.','2026-11-16'),
 ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000012',null,'Naxos, 10 ml',5,'A arătat codul de lot și bonul înainte. Totul transparent.','2026-10-28'),
 ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000013',null,'Tobacco Vanille, 10 ml',5,'Cea mai de încredere organizatoare din București.','2026-11-10'),
 ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000014',null,'Aventus, 5 ml',5,'Ml exacți, sticluțe de sticlă groasă.','2026-10-20'),
 ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000014',null,'Angels'' Share, 10 ml',5,'Ml exacți, am verificat pe gradație.','2026-10-12'),
 ('00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000012',null,'Khamrah, 10 ml',4,'Bun, dar a venit cu atomizoare de plastic.','2026-11-15');
