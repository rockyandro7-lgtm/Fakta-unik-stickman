# Naskah: Nyamuk "darah manis" (dirender 24-11-2026)

Bentuk cerita ketujuh: **"diet konyol seminggu"** (Bawang = lomba, Nasi goreng = tamu mendadak, Telur = trik viral gagal, Jemuran = cari tersangka, Pedas = pengejek pemegang rahasia, Pisang = pilihan yang ditertawakan).
Budi dikeroyok nyamuk, Rani mengejek "darah manis", Budi diet gula + bawang putih mentah seminggu, gagal; Rani yang minum teh paling manis justru tidak digigit. Ibu hanya latar.
126 kata, suara final 55,85 dtk (tanpa atempo, jeda dipadatkan), video 56,5 dtk, 19 shot. Tanpa CTA; kalimat terakhir menyambung ke kalimat 0 (loop).

## Naskah (`script.json`)
0. Bertiga di teras, tapi yang dirubung nyamuk cuma Budi.
1. Rani ngakak: "Darahmu kemanisan, Bud! Kebanyakan teh!"
2. Budi langsung sumpah: seminggu nggak minum manis.
3. Teh manis diganti air putih. Permen sama kue, dibuang semua.
4. Biar makin ampuh, tiap pagi dia nelen bawang putih mentah.
5. Hari ketujuh, Budi duduk lagi di teras. Napasnya bau bawang.
6. Satu nyamuk datang. Dua. Sepuluh. Semuanya ke Budi.
7. Rani nyeruput teh paling manis, nggak digigit sekalipun.
8. Jadi begini. Nyamuk ngisap darah buat bikin telur, bukan nyari manisnya.
9. Dari jauh, dia ngikutin napas kita. Dari dekat, dia nyium bau kulit.
10. Bau itu dibikin bakteri di kulit, dan racikannya beda tiap orang.
11. Buat nyamuk, kulit Budi wanginya kayak warteg.
12. Dan sekali jadi favorit nyamuk, biasanya bertahun-tahun.
13. Budi pun berhenti diet. Dan malam ini, lagi-lagi,
    (loop ke kalimat 0)

## Rencana visual
- Frame 0: teras malam, Ibu-Rani-Budi di balik meja kayu, kawanan nyamuk mengitari kepala Budi yang menepuk-nepuk; tag "BERTIGA", teks bunyi "NGIIING".
- Rani raksasa tertawa (close-up layar) + tetes darah berwajah dikelilingi gula, gelas teh Budi kemasukan gula.
- Sumpah (tangan terangkat, kawanan bubar), kubus gula dicoret. Pagi: teh berubah jadi air putih; permen + kue melayang ke tong sampah berwajah.
- Bawang putih berwajah, siung masuk mulut, "HARI 1..6", napas hijau. Hari 7 (kalender DES 1): napas bau bawang, Ibu dan Rani tutup hidung.
- Hitungan 1, 2, 10! nyamuk datang menembus awan bau bawang. Rani menyeruput teh bergula 9 kubus; satu nyamuk mengendus Rani lalu putar balik.
- Mekanisme: nyamuk raksasa mengisap tetes darah (perut merah) -> telur bermunculan, kubus gula dicoret -> dari jauh: jejak napas dari teras ke nyamuk (tele) -> dari dekat: panas + aroma di lengan Budi -> portal ke dunia mikro kulit: bakteri berwajah makan dan mengeluarkan aroma -> toples racikan IBU/RANI/BUDI, punya Budi bercahaya.
- Gag: antrean nyamuk berserbet membawa piring, papan "WARTEG BUDI, BUKA 24 JAM". Kalender tahun 2026 -> 2029 tersobek, medali "favorit".
- Akhir: Budi minum teh manis lagi, bawang dilempar; kembali ke komposisi frame 0 (loop).

## Aset baru (`web/env_nyamuk.js`)
`terasBG` (teras malam/pagi: dinding, pintu, jendela bergorden, kalender, lampu gantung, pilar, pot), `mejaTeras`, `drawNyamuk` (Aedes belang, sayap berkepak, belalai mengendus, perut penuh darah, serbet + piring),
`nyamukSwarm` + `nyamukPos` (kawanan deterministik, bisa datang satu per satu), `drawGelasTeh` (teh <-> air putih, kubus gula, uap), `drawPermen`, `drawKue`, `drawTongSampah`, `drawBawangPutih` (umbi/siung), `drawNapasBau`, `drawPanas`,
dunia mikro `kulitBG` (sisik sel, pori, rambut, keringat) + `drawMikroba` (3 jenis) + `drawAroma` (ikon ayam/telur/tempe), `drawToples` (racikan per orang), `drawTetesDarah`, `drawTelurNyamuk`, `drawGula`, `drawPapanWarteg`, `drawKalenderTahun`.
Tata letak `NY`, palet `NYP`. Tokoh: Budi, Rani (`env_nasi.js`), Ibu.

## Catatan teknis
- Scribe: "enggak" -> "nggak", "nelan" -> "nelen" (`merge.json`); "sekali pun" ditulis "sekalipun" di naskah karena Scribe menggabungnya.
- Teks bunyi (`sfxS`) selalu di koordinat layar (di episode sebelumnya `sfxText` dipanggil setelah kamera dunia aktif).
- Loop: shot terakhir memutar `hookScene` dengan waktu negatif; semua gerak hook (kawanan, tepukan) fungsi dari waktu itu, sehingga frame terakhir = frame 0.
- Render ulang di Windows: `powershell -ExecutionPolicy Bypass -File fakta-unik/engine/tools/win/build.ps1 -Dir episodes/nyamuk -Workers 8`; thumbnail `node thumb.js`.
