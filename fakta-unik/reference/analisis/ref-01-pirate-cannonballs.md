# Referensi 01 — "Levels of Pirate Cannonballs" (YouTube Shorts, channel orang lain)

> Tujuan: **reverse engineering teknik** (kamera, mikro ekspresi, aset, ritme), bukan menyalin.
> Kita tidak memakai ulang karakter, aset, naskah, atau frame mereka. Yang diambil hanya prinsip yang bisa
> dipakai ulang di mesin kita (lihat `reference/teknik-visual-v5.md`).

- Sumber: 3 rekaman layar iPhone (YouTube Shorts) diunggah pengguna 11-11-2026, berurutan:
  - **A** `79144e6c` 0–14,0 dtk (narasi "Hot Shot … the whole ship")
  - **B** `722acacb` 0–14,3 dtk ("up from the inside like a giant lantern … Eventually,")
  - **C** `b92d4b7a` 0–13,6 dtk ("advanced from wood to iron … to sink it in one shot.")
  - Total ±42 dtk. Rekaman 1320x2868, 60 fps, ada UI YouTube (status bar, ikon kanan, nama channel, kolom komentar).
- Cara analisis: `tools/video_ref/analyze.py` (preset `shorts-iphone`) + lembar storyboard tiap 0,2 dtk
  + crop wajah 10–15 fps (mode `--dense`). Semua angka di bawah diukur, bukan ditebak, kecuali ditandai *(perkiraan)*.

## Ringkasan angka

| Ukuran | Nilai | Catatan |
|---|---|---|
| Ganti caption | median **0,35 dtk** (p25 0,23, p75 0,45) | ±1 kata per caption, kadang 2 ("a furnace", "them in") |
| Ketukan visual (beat) | ±34 beat / 42 dtk = **±1,2 dtk per beat** | tiap kalimat punya aksi visual sendiri |
| Hard cut | sangat sedikit (±3) | mayoritas perpindahan = kamera kontinu, dissolve, atau match |
| Push-in pembuka | **×2 dalam 0,7 dtk**, ease-out | A 0,0–0,7 (×1,15 per 1/6 dtk lalu melambat) |
| Fly-through jendela | ×1,85 dalam 0,5 dtk, puncak **7,6% zoom per frame** (30 fps) | A 2,3–2,8, akselerasi (ease-in) |
| Swing terkunci objek | puncak roll **7,4° per frame**, geser 0,23 lebar layar per frame | A 4,0–4,8 |
| Scale reveal (pull-back) | ×0,5 dalam 1,2 dtk | C 4,0–5,2 |
| Kamera diam | hanya saat dissolve (±0,4 dtk) | selebihnya selalu bergerak |
| Durasi ekspresi | tahan 3–8 frame (0,1–0,27 dtk) per keadaan, kedip 1–2 frame | lihat bagian mikro ekspresi |

## Beat sheet (frame per frame, diringkas per ketukan)

### A (0–14,0 dtk)
| t (dtk) | Kamera | Aksi / ekspresi | Kata |
|---|---|---|---|
| 0,0–0,7 | push-in ×2 ease-out dari wide ke medium host | host (topi tricorn) mata terpejam senang → mata licik + nyengir gigi (0,2) → kedip di "Shot." (0,47) | Hot Shot. |
| 1,0–1,3 | pan kanan **mengikuti lirikan** host ke jendela tungku | host menoleh dulu (mata memimpin), lalu kamera ikut; host keluar frame, pekerja masuk | They |
| 1,3–2,3 | push-in makin cepat ke papan "HOT SHOT" | pekerja: bicara gigi terlihat → setengah kelopak bosan + lirik ke tungku → kedip (2,0) → senyum kecil (2,07) | shoveled cannonballs into a furnace |
| 2,3–2,93 | **fly-through** menembus jendela (bingkai berubah trapesium = 3D) | — | until (tepat saat melewati bingkai 2,70) |
| 2,93–4,0 | dolly pelan sepanjang lorong tungku simetris | bola paling depan hitam → merah membara; penjepit masuk dari bawah | they glowed red |
| 4,0–4,8 | **swing terkunci objek**: bola dijepit tetap di layar, dunia berayun keluar jendela ke pantai | — | carried them over |
| 4,6–6,4 | POV dari belakang meriam (mulut meriam di bawah frame), push pelan | trio: helm ngeden → kaget + keringat; kupluk hijau ngeden → kaget; kupluk biru (latar) tetap senang (kontras); **lega serentak ^ ^** di 6,1 saat bola dijatuhkan | with giant tongs, and dropped them in |
| 6,45–7,1 | crane naik melewati laras (angka "12"), **menyelam ke mulut meriam**: lingkaran gelap ditahan 4 frame → menjadi tong rendaman (**match cut bentuk**) | — | behind a soaking |
| 7,0–8,2 | top-down tong; karung masuk dari bawah | **cincin api** menyala di tepi tong saat kata kunci (7,8) | wet plug so |
| 8,2–10,0 | pull-back memperlihatkan karung "POWDER" | **wajah muncul (fade-in) di karung**: datar → gugup (mulut bergelombang) + keringat → lirik → kedip → kaget → lega ^ ^ → lirik atas → kaget + cahaya oranye menyelimuti | the gunpowder wouldn't go off early. The ball |
| 10,2–11,6 | close-up lambung kapal, hampir diam | bara tertanam + percikan, ditahan 0,8 dtk | buried itself deep in |
| 11,6–12,2 | pull-back cepat ke wide kapal | asap keluar dari lambung | the pirate ship's hull |
| 12,2–14,0 | wide hampir statis | **grade waktu**: langit biru → ungu senja; cahaya dari dalam kapal | and a few minutes later, the whole ship |

### B (14,0–28,3 dtk; waktu di bawah = waktu lokal rekaman B)
| t | Kamera | Aksi / ekspresi | Kata |
|---|---|---|---|
| 0,0–2,1 | wide, push sangat pelan (×1,11) | kapal menyala dari dalam seperti lentera | up from the inside like a giant lantern. |
| 2,1–2,5 | **dissolve** ke peti | peti berlabel "CARCASS / KEEP FROM FLAME" (teks di benda) | Not |
| 2,4–3,8 | low angle, push pelan | tangan besar turun masuk ke peti | to be outdone, the pirates |
| 3,7–4,4 | **tilt naik mengikuti benda yang diangkat → reveal wajah** | kapten: satu alis naik + senyum miring + kelopak setengah (sombong), ditahan 1,4 dtk sambil orbit pelan (pilar latar bergeser) | fired back with the |
| 4,8 | — | **kilau bintang** di bola saat namanya disebut | carcass, |
| 5,6–6,0 | medium dua tokoh | bola bersinar dari dalam (sinar keluar lubang); keduanya mata bulat takjub | hollow cannonball |
| 6,4–7,6 | medium dua tokoh | bandana: bosan menuang ter; kapten: nyengir licik bergigi, kedip 7,1 | packed with burning tar |
| 7,8–8,3 | pull-back + pan kanan | **keduanya meringis > <** + percikan | punched full of holes. |
| 8,4–10,0 | pan ke meriam, ikuti arah tembakan | tembakan, kepulan asap bergaris tepi | So it spat fire |
| 10,0–11,8 | wide dek | bandana ^ ^ senang; kapal jauh mulai terbakar | the whole way over and turned the entire |
| 12,0–14,0 | cut ke lensa tele | api membesar, asap hitam | Navy ship into a torch. |

### C (28,3–41,9 dtk; waktu lokal rekaman C)
| t | Kamera | Aksi / ekspresi | Kata |
|---|---|---|---|
| 0,0–1,1 | close-up lambung kayu → pelat besi berpaku (morph) | — | advanced from wood to iron |
| 1,1–3,6 | tilt naik ke kapal besi | bola api **memantul** dari pelat (percikan), dua kru kecil | and the fireballs just bounced off. |
| 3,6–3,8 | **dissolve** | perwira (topi biru, kumis) mata ^ ^ bangga | So America |
| 4,0–5,2 | **pull-back + crane turun (scale reveal)** ×0,5 | perwira mengecil, meriam Rodman raksasa + bendera terungkap; ekspresi berubah tegang | built the Rodman gun, |
| 5,4–6,6 | gerak ke tripod katrol | bola besar tergantung | a cannon that fired a single ball |
| 6,8–7,7 | tilt mengikuti bola naik | perwira menarik tali | weighing over |
| 7,8–9,0 | tahan | **gag angka**: justru perwira yang terangkat (bola lebih berat): cemberut → lirik → sadar (mata bulat) → kaget | 1000 lbs. |
| 9,2–9,8 | — | jatuh, meringis > <, **kilat putih** | Made to punch |
| 10,0–10,6 | ikuti bola di atas air | percikan; benturan + retakan terang | a hole in an iron |
| 10,8–11,8 | wide | ledakan kartun oranye, serpihan papan | warship big enough |
| 12,0–13,5 | wide | asap hitam; dua awak terapung dalam tong (komedi pasca-ledakan) | to sink it in one shot. |

## Temuan 1 — Mikro ekspresi
1. **Ekspresi ditukar, bukan di-tween.** Wajah 2D sederhana berganti keadaan secara diskret (pop) pada ketukan kata.
   Tiap keadaan ditahan 3–8 frame. Di antara dua keadaan besar sering ada **kedip 1–2 frame** sebagai "jembatan"
   (karung mesiu 9,0 dtk: lirik → kedip → kaget).
2. **Pupil tetap hidup saat ditahan.** Arah lirik bergeser kecil walau ekspresi sama (karung 9,13–9,4).
3. **Busur emosi 3 langkah per aksi**: usaha (ngeden) → bahaya (kaget + keringat) → hasil (lega ^ ^). Trio di A 4,6–6,1.
4. **Reaksi serentak + satu tokoh kontras.** Dua tokoh kaget bersama, satu di latar tetap senang. Komedi muncul dari kontrasnya.
5. **Lirikan memimpin kamera.** Tokoh menoleh atau melirik dulu, kamera menyusul 2–4 frame kemudian (A 1,03–1,3).
6. **Benda diberi wajah** (karung mesiu). Wajahnya muncul pelan (fade-in), lalu dipakai untuk mengekspresikan "risiko" dari sudut pandang benda.
7. **Kosakata ekspresi yang dipakai**: licik (kelopak setengah + nyengir gigi), sombong (satu alis naik + senyum miring),
   datar/bosan (kelopak setengah + mulut lurus + lirik samping), kaget (mata bulat besar pupil kecil + mulut "o"),
   lega/bangga (mata ^ ^), meringis (> < + mulut bergelombang), gugup (mulut bergelombang + keringat), sadar (mata bulat, mulut lurus).

## Temuan 2 — Kamera di dunia 3D dengan tokoh 2D
1. **Tokoh = gambar 2D datar yang selalu menghadap kamera (billboard) di dunia 3D.** Saat kamera orbit
   (B 4,1–5,5) atau pindah ke belakang meriam (A), tokoh tidak pernah terlihat dari samping. Hasilnya, kamera bebas
   bergerak 3D tanpa perlu menganimasikan tokoh 3D. **Ini cocok dengan mesin kita** (tokoh 2D + lapisan parallax).
2. **Kamera hampir tidak pernah diam.** Pola tiap shot: push-in melambat (setelah masuk) → drift/ikuti lirikan → push-in makin cepat ke transisi berikutnya.
3. **Transisi = gerak kamera, bukan cut.** Ada empat jenis:
   - *fly-through*: menembus bukaan (jendela, pintu, mulut meriam);
   - *swing terkunci objek*: objek tetap di layar, dunia berputar ke lokasi baru;
   - *match bentuk*: menyelam ke lingkaran → lingkaran lain di adegan baru;
   - *dissolve* singkat (±0,2 dtk) untuk ganti topik/waktu.
4. **Ikuti BENDA, bukan orang.** Bintang videonya adalah bola meriam. Kamera mengikuti perjalanannya (tungku → penjepit → meriam → laut → lambung), dan tokoh hanya bereaksi di sekitarnya.
5. **Sudut kamera bercerita**: POV di belakang meriam (penonton jadi "penembak"), low angle untuk benda penting (peti CARCASS), top-down untuk wadah (tong), tele untuk jarak jauh (kapal terbakar), scale reveal (pull-back) untuk "raksasa".
6. **Kata kunci jatuh di puncak gerak kamera** ("until" saat melewati bingkai jendela, "over" saat pantai terungkap).
   *(Catatan jujur: caption berganti tiap ±0,35 dtk, jadi kecocokan ±0,1 dtk sebagian bisa kebetulan; kesimpulan ini diambil dari pengamatan visual, bukan statistik.)*

## Temuan 3 — Aset
1. **Lingkungan 3D bergaya** (low-poly bertekstur lukisan, cel-shading, garis tepi gelap), warna jenuh. Palet komplementer: oranye panas (api, bara, senja) vs biru/teal dingin (laut, langit).
2. **Teks di dalam dunia (diegetik)**: papan "HOT SHOT", peti "CARCASS / KEEP FROM FLAME", karung "POWDER", angka "12" di meriam. Info disampaikan lewat label di benda, bukan grafik tempelan.
3. **VFX kartun konsisten**: asap dengan garis tepi, percikan bintang, ledakan oranye dengan serpihan, api stilisasi, cahaya dari dalam (lentera), kilau bintang 4 sudut.
4. **Desain tokoh = siluet + aksesori peran**: stickman kepala bulat, peran dikenali dari topi (tricorn, kupluk, helm, bandana, topi tengkorak, topi perwira). Gaya ini sama dengan Budi/Ibu kita.
5. **Benda punya skala dramatis**: penjepit raksasa, meriam Rodman raksasa vs perwira kecil, bola 1000 lbs.
6. **Angka dibuktikan lewat fisika lucu** ("1000 lbs" = perwira ikut terangkat), bukan ditulis besar di layar.

## Struktur cerita
Format "Levels of …": eskalasi level (1 → 2 → 3), tiap level punya pola:
nama metode (papan/label) → mekanisme (kamera ikut benda) → hasil (api/ledakan) → kalimat jembatan ("Not to be outdone", "Eventually").
Ide untuk kita: seri "Level-level …" (misal "Level menyimpan makanan dari yang paling bahaya") atau mitos berlevel.

## Keterbatasan analisis ini
- Rekaman layar: ada UI di atas gambar dan kompresi. Estimasi gerak kamera saat whip cepat tidak bisa dipercaya
  (frame itu ditandai `valid=0`), jadi angka puncak diambil dari frame valid di sekitarnya.
- Audio: onset terdeteksi sebagian besar suku kata narasi, jadi SFX tidak bisa dipisahkan dengan andal dari rekaman ini.
- Detektor transisi otomatis memecah satu transisi panjang menjadi beberapa dan melewatkan fly-through warna serupa
  (oranye → oranye). Semua transisi di tabel di atas sudah dicek visual frame per frame.
