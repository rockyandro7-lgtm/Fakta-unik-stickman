# Naskah: Gelas es teh "bocor" = embun (dirender 27-11-2026)

Bentuk cerita kedua belas: **"komplain salah alamat"**. Budi protes ke Bu Warung karena es tehnya "bocor". Ganti gelas baru basah lagi, ganti gelas plastik tetap basah. Teh panas kering, jadi Budi makin yakin gelas esnya yang salah. Rani membongkar dengan sirup merah: yang menetes tetap bening, berarti airnya dari udara. Dunia mikro: uap air berwajah menggigil di dinding gelas dingin lalu jadi titik air; di gelas panas memantul. Solusi: tatakan.
129 kata, suara final 55,5 dtk (tanpa atempo, jeda dipadatkan), video 56,1 dtk, 16 shot. Tanpa CTA; kalimat terakhir menyambung ke kalimat 0 (loop: es teh baru datang dan langsung "bocor" = frame 0).

## Naskah (`script.json`)
0. Es teh Budi bocor, padahal gelasnya nggak retak.
1. Dia protes: "Bu, gelasnya bocor!"
2. Ganti gelas baru, basah lagi. Ganti gelas plastik, tetap basah.
3. Budi pesan teh panas, gelasnya kering.
4. "Tuh kan, gelas esnya yang bermasalah!"
5. Rani nyengir, terus ngisi gelas es pakai sirup merah.
6. Kalau bocor, yang keluar harusnya merah. Ternyata airnya tetap bening.
7. Berarti airnya bukan dari dalam gelas, tapi dari udara.
8. Udara di sekitar kita penuh uap air yang nggak kelihatan.
9. Begitu kena gelas dingin, uap itu berubah jadi titik air dan nempel di luar gelas.
10. Sama kayak rumput yang basah tiap pagi.
11. Gelas teh panas tetap kering, karena luarnya nggak dingin.
12. Dan makin lembap udaranya, makin banyak airnya.
13. Jadi solusinya bukan ganti gelas, cukup kasih tatakan.
14. Budi malu, minta maaf, terus pesan es teh lagi, dan
    (loop ke kalimat 0)

## Aset baru (`web/env_esteh.js`)
Tokoh baru **Bu Warung** (`BU_WAR`, kerudung `kerudung`). `drawGelasEs` (SATU fungsi gelas: es teh / sirup merah / teh panas / gelas plastik, embun bening di luar, tetes mengalir, uap panas, bayangan tetes merah), `drawGenangan`, `drawTatakan`, `drawUap` (uap air berwajah, menggigil), `drawTitikAir`, `dindingBG` (dunia mikro dinding gelas dingin/panas + udara), `rumputBG` (rumput berembun pagi), `drawHigrometer`, `drawKacaPembesar`.
Warung = `warungBG` + `mejaWarung` (env_pedas.js), sama dengan episode Kepedasan.
