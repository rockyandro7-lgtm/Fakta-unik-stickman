# Teknik visual v5 (aturan + resep kode)

Diturunkan dari analisis referensi (`reference/analisis/`). Prinsipnya yang diambil, bukan asetnya.
Semua fungsi ada di `engine/template*/web/fx_v5.js`, transisi di `main.js`, ekspresi baru di `chars.js`.
Contoh lengkap yang bisa dirender: `examples/demo-v5-teknik/shots.js`.

## A. Aturan wajib per episode (checklist)
1. **Kamera tidak pernah diam lebih dari 0,4 dtk**, kecuali saat dissolve. Pola per shot:
   masuk dengan push-in melambat (ease-out, sekitar ×1,7–2 dalam 0,7 dtk) → drift atau ikuti lirikan → percepat (ease-in) ke transisi berikutnya.
2. **Maksimal 1 hard cut per 10 dtk.** Perpindahan adegan memakai `portal`, `spin`, `match`, atau `dissolve` (lihat C).
3. **Ikuti BENDA yang jadi fakta** (makanan, virus, listrik, air), bukan orangnya. Tokoh hanya bereaksi di sekitarnya.
4. **Ekspresi berganti pada ketukan CERITA** dengan `exprTrack` (bukan tiap kata). **Direvisi v7:** lihat `format-kenapa-v7.md` bagian E. Tokoh latar dan wajah benda cukup 1-2 keadaan per shot, lirik/kedip acak hanya untuk close-up.
5. **Satu aksi = busur 3 langkah**: usaha → bahaya/kaget (+keringat) → hasil (lega/bangga atau meringis).
6. **Reaksi kelompok serentak** (offset 0,05–0,1 dtk antar tokoh), boleh satu tokoh kontras (tetap santai) untuk komedi.
7. **Lirikan memimpin kamera**: ubah `look` tokoh 0,1–0,15 dtk sebelum kamera pan ke arah itu.
8. **Benda yang jadi "korban" mitos diberi wajah** (`propFace`): kulkas, panci, baterai HP, charger, perut.
9. **Angka dibuktikan lewat fisika atau skala**, bukan teks besar: beban mengangkat tokoh (`pulleyGag`), scale reveal (pull-back), penghitung waktu dengan `timeGrade`.
10. **Teks di dalam dunia** (label di benda: "200 KG", "MITOS", nama alat) lebih baik daripada grafik tempelan. Tetap jauhkan dari pita caption.
11. **Caption 1–2 kata**, ganti tiap sekitar 0,35 dtk (sudah default di template Shorts: `CAP_WORDS` 2, `CAP_CHARS` 13).
12. **Kata kunci jatuh di puncak gerak** (momen menembus portal, objek terungkap, kilat, glint).

## B. Ekspresi
```js
// preset: netral sombong licik datar kaget takjub lega bangga ngeden meringis cemas curiga sadar
face: exprTrack(lt, [[0, 'ngeden'], [fw(3,'panas') - st, 'kaget'], [1.9, 'lega']], { seed: 2 })
// override per kunci: [t, 'cemas', { look: [-.8, .2] }]
// wajah benda: propFace(ctx, x, y, lebarPx, exprTrack(...), { t, alpha })
```
- Ganti keadaan = pop diskret. `exprTrack` otomatis menambahkan kedip 2 frame sebagai jembatan, kedip acak sekitar 3 dtk,
  saccade pupil kecil saat ditahan, `pop` (0..1) sesaat setelah ganti untuk squash kepala
  (`headTilt: ... - f.pop * .05`), dan keringat yang muncul dengan pop.
- Mata baru `flinch` (> <), mulut baru `wobble` (gugup), aksesori `sweat: 0..1`.
- Tahan tiap keadaan minimal 0,1 dtk (3 frame). Di bawah itu, ekspresi tidak terbaca.

## C. Transisi (properti shot di `SHOTS.push({...})`)
| `tr` | Kapan | Properti | Catatan kalibrasi |
|---|---|---|---|
| `portal` | masuk ke dalam sesuatu: jendela, pintu kulkas, mulut, layar HP, telinga | `zoomOut: {x,y,w,h}` atau `{x,y,r}` (koordinat LAYAR di akhir shot, hitung dengan `toScreen(cam, wx, wy)`) | shot berikut terlihat di dalam bukaan lalu semua membesar bersama sekitar 0,8 dtk, puncak sekitar 6–8% per frame (referensi 7,6%) |
| `spin` | pindah lokasi sambil membawa benda yang sama | `pivot: [x,y]` (layar), `spin: rad` (0,6–0,9) | gambar benda yang sama di posisi `pivot` pada kedua shot (pakai `camLock`), dan sudut tidak akan hitam |
| `match` | bentuk mirip: lingkaran ke lingkaran (tutup panci → jam, mulut meriam → tong) | `zoomOut: {x,y,r}` di shot keluar, `zoomIn: {x,y,r}` di shot masuk | tahan sejenak di warna gelap atau bentuk polos itu |
| `dissolve` | ganti topik atau waktu ("Tapi ada satu catatan", "2 jam kemudian") | — | sekitar 0,28 dtk; satu-satunya saat kamera boleh diam |
| `whip` | energi tinggi, daftar cepat | — | transisi lama, tetap ada |
`xt` mengatur setengah durasi transisi (default: portal 0,4, match 0,34, spin 0,22, dissolve 0,14).

## D. Kamera
```js
camKeys(lt, t, [[0, {x,y,z}], [.7, {x,y,z}, easeOut], [2.6, {...}, ease], [end, {...}, easeIn]], shake)
camLock(wx, wy, sx, sy, z, r)   // titik dunia (wx,wy) dikunci di layar (sx,sy); putar r = dunia berayun di sekitar benda
camGeo(p, camA, camB)           // dolly geometris (laju zoom terasa konstan)
parallax(ctx, cam, [[.2, bgFar], [.6, bgMid], [1.3, foreground]])   // orbit/truck terasa 3D
toScreen(cam, wx, wy)           // untuk zoomOut/pivot transisi
```
Sudut yang dipakai referensi beserta artinya:
- POV di belakang benda: penonton jadi pelaku.
- Low angle: benda penting, misteri.
- Top-down: isi wadah.
- Tele/jauh: skala kejadian.
- Pull-back scale reveal: "raksasa" atau "ternyata banyak".
- Tilt naik mengikuti benda yang diangkat lalu berhenti di wajah: reveal tokoh.

## E. Efek penekanan
`glint` (kilau 4 sudut saat nama benda disebut), `glowRing` (cincin cahaya di bentuk bulat), `innerGlow` (benda menyala dari dalam),
`flash` (kilat putih 1–2 frame sebelum benturan), `timeGrade(ctx, k, 'senja'|'malam')` (waktu berlalu), `groundShadow`.

## F. Aset
- Gunakan palet komplementer per adegan: hangat (api, matahari, bahaya) vs dingin (air, kulkas, aman). Bahaya = oranye/merah menyala.
- Benda penting dibuat lebih besar dari skala nyata (penjepit raksasa, meriam raksasa) agar terbaca di layar HP.
- VFX selalu kartun dengan garis tepi (`puff`, `burst`), bukan partikel realistis.
- Peran tokoh dikenali dari aksesori kepala (topi chef Ibu, jambul Budi). Tambah tokoh baru cukup dengan topi baru.

## G. Cara menganalisis referensi baru
Lihat `tools/video_ref/README.md`. Hasil analisis disimpan sebagai `reference/analisis/ref-NN-<nama>.md`,
lalu prinsip barunya dipindahkan ke file ini dan dibuatkan helper di `fx_v5.js` bila perlu.
