# Naskah: Telur bopeng (17-11-2026)

Pola naskah ref-02 dengan bentuk cerita **"trik viral gagal satu per satu"** (rotasi bentuk: Bawang = lomba, Nasi goreng = tamu mendadak).
Pengejek: Rani (satu kalimat). Mekanisme lewat dialog Ibu, 3 kalimat (~14 dtk) dengan analogi soda yang dibuka.
188 kata, suara final 70,74 dtk, video 71,3 dtk, 18 shot. Tanpa CTA; kalimat terakhir menyambung ke kalimat 0 (loop).

## Naskah (`script.json`)
0. Budi baru ngupas 5 telur rebus, dan semuanya bopeng kayak permukaan bulan.
1. Padahal besok pagi dia harus setor 30 telur balado buat bazar sekolah.
2. Telurnya juga bukan sembarang telur: paling segar, baru dibeli tadi pagi.
3. Tapi setiap dikupas, kulitnya nempel, dan putih telurnya ikut kecabut.
4. Jadi dia coba trik dari internet. Telur digelindingin di meja sampai retak semua.
5. Bopeng.
6. Trik kedua: dikupas di bawah air keran.
7. Bopeng lagi, dan bajunya basah kuyup.
8. Rani lewat, ngintip piring: "Bud, ini telur balado apa telur kena cacar?"
9. Telur tinggal 15, dan uangnya udah habis.
10. Lalu Ibu pulang, lihat piring, dan langsung ambil telur dari rak. Telur yang sudah seminggu.
11. "Bu, itu telur lama!"
12. Ibu cuek. Dia tunggu airnya mendidih dulu, baru telurnya diturunin pelan-pelan.
13. Matang, direndam air dingin, diketuk sekali, dan kulitnya lepas utuh. Mulus.
14. "Telur segar itu masih nyimpan gas, Bud. Putihnya jadi lengket ke selaput kulit, kayak lem."
15. "Seminggu di rak, gasnya kabur lewat pori-pori kulit, kayak soda yang dibiarin kebuka."
16. "Terus masukinnya pas air udah mendidih, biar putihnya keburu mateng sebelum sempat nempel."
17. Besoknya, telur baladonya ludes. Tapi sampai sekarang, Budi masih ingat hari pertama dia jualan, waktu
    (loop: whip-pan kembali ke komposisi frame 0)

## Struktur yang diuji (bandingkan setelah tayang)
- Frame 0 = keluhan dapur yang dikenal semua orang (telur bopeng) + Budi bergerak mencabut kulit, jawaban TIDAK dibocorkan.
- Plant di latar sejak awal: rak telur dengan label "7 HARI" terlihat di banyak shot sebelum Ibu mengambilnya.
- Dua trik internet gagal (gagal palsu) + punchline satu kata "Bopeng." (trombon).
- Mekanisme di 25% terakhir lewat gelembung lup penampang kulit (gas bertokoh, lem kuning, pori, celah udara, air mendidih).
- Cek kurva retensi di dtk ~50-64 (penjelasan) dan di akhir (loop).

## Aset baru (`web/env_telur.js`)
`drawTelur` (satu fungsi untuk utuh/retak/setengah dikupas/bopeng/mulus/balado), `drawKulit` (serpih dengan putih menempel / cangkang utuh lepas),
`drawPiringTelur`, `drawTray` (tray 30 butir, jumlah terisi), `drawRak` (rak dinding + label 7 HARI), `drawPanci` (air mendidih + telur),
`drawSendok`, `drawMangkukEs`, `drawKeran` (wastafel + aliran air), `drawHP` (layar TRIK VIRAL), `drawDompet` (kosong + lalat), `drawSoda`,
`drawPenampang` (dunia mikro kulit-selaput-putih), `drawBulan`. Tata letak `TL`, palet `TLP`. Tokoh: Budi, Rani (`env_nasi.js`), Ibu.

## Catatan teknis
- Scribe mengeja angka ("lima", "tiga puluh", "lima belas"): `merge.json` menggabungkan ke "5", "30", "15". Naskah baris 16 memakai "mateng" sesuai ucapan.
- Render ulang di Windows: `powershell -ExecutionPolicy Bypass -File fakta-unik/engine/tools/win/build.ps1 -Dir episodes/telur -Workers 8`; thumbnail `node thumb.js`.
