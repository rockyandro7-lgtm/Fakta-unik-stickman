# Naskah: Pisang di kulkas (dirender 23-11-2026)

Bentuk cerita keenam: **"pilihan yang ditertawakan"** (Bawang = lomba, Nasi goreng = tamu mendadak, Telur = trik viral gagal, Jemuran = cari tersangka, Pedas = pengejek pemegang rahasia).
Budi memilih pisang hitam dari kulkas, Rani mengejek dan menantang (yang dapat pisang busuk cuci piring seminggu), pembalikan saat dikupas. Ibu muncul sebentar di kilas balik.
154 kata, suara final 66,0 dtk (atempo 1,064), video 66,6 dtk, 20 shot. Tanpa CTA; kalimat terakhir menyambung ke kalimat 0 (loop).

## Naskah (`script.json`)
0. Dari dua pisang, Budi malah ngambil yang kulitnya hitam legam.
1. Rani langsung ngakak: "Bud, itu mah udah busuk!"
2. Padahal dua-duanya dari sesisir yang sama, dibeli Ibu seminggu lalu.
3. Separuh ditaruh di meja. Separuh lagi dimasukin Budi ke kulkas.
4. Yang di meja masih kuning, cuma bertotol.
5. Yang di kulkas? Hitam semua, kayak habis kebakar.
6. Rani nantang: "Yang dapet pisang busuk, cuci piring seminggu."
7. Budi ngupas duluan. Kulitnya dingin, lemas, hitam sampai ke dalam.
8. Rani udah nyiapin spons cuci piring buat dia.
9. Tapi begitu kulitnya lepas, dagingnya putih mulus. Masih padat.
10. Rani buru-buru ngupas punyanya. Lembek, cokelat, nempel di kulit.
11. Jadi begini. Pisang itu buah tropis. Di bawah 13 derajat, sel kulitnya rusak kedinginan.
12. Selnya bocor, isinya ketemu udara, dan berubah hitam, sama kayak apel yang digigit jadi cokelat.
13. Tapi dinginnya juga ngerem pematangan dagingnya, asal masuknya pas udah matang.
14. Jadi kulitnya kelihatan tua, padahal isinya masih muda.
15. Rani cuci piring seminggu. Dan minggu ini, lagi-lagi,
    (loop ke kalimat 0: "Dari dua pisang, Budi malah ngambil yang kulitnya hitam legam.")

## Rencana visual
- Frame 0: dua pisang berwajah di piring (kuning bertotol vs hitam), tangan Budi melayang memilih, Rani sombong. Tag "PILIH SATU".
- Kilas balik hangat (tint oranye): Ibu mengangkat sesisir pisang; separuh ke keranjang, separuh ke kulkas (kulkas berwajah).
- Waktu berlalu: "HARI 1..7" + siang-malam berkedip; kulkas dibuka, pisang hitam berembun, kulkas cemas.
- Tantangan: tumpukan piring kotor tumbuh di meja. Gagal palsu: kulit dingin, lemas, sisi dalam kulit hitam; Rani menyodorkan spons.
- Pembalikan: kulit lepas, daging bercahaya + wajah bangga, "TOK TOK" padat. Punya Rani lembek, cokelat, nempel di kulit.
- Mekanisme: pisang di pantai tropis -> termometer turun lewat garis 13° -> portal ke dunia mikro sel kulit (retak, bocor, ketemu O2, jadi hitam) -> apel digigit jadi cokelat -> speedometer PEMATANGAN direm -> pisang hijau (X) vs matang (centang) -> pisang "kulit tua, isi muda".
- Akhir: Rani cuci piring di wastafel, Budi makan pisang; kembali ke komposisi frame 0 (tangan Budi bergerak masuk, sambung ke frame 0).

## Aset baru (`web/env_pisang.js`)
`dapurPisangBG` (dapur datar: keramik, jendela, kalender NOV, rak toples, kulkas), `drawKulkasPisang` (drawFridge + sisir di rak), `mejaPisang` (taplak biru),
`drawPisang` (SATU fungsi: hijau/kuning/bertotol/hitam, embun beku, lemas, dikupas 3 lidah kulit, daging padat/lembek, wajah kulit + wajah daging), `drawSisir`, `drawPiringPisang`, `drawKeranjang`,
`drawSpons`, `drawTumpukPiring`, `drawWastafel`, dunia mikro `jaringanBG` + `drawSel` (dingin, retak, bocor, gelap) + `drawO2` + `drawPigmen`, `drawTermoPisang` (garis 13°), `drawApel` (gigitan berubah cokelat), `drawSpeedo` (PEMATANGAN + pedal REM).
Tata letak `PS`, palet `PSP`. Tokoh: Budi, Rani (`env_nasi.js`), Ibu (preset di shots.js).

## Catatan teknis
- Scribe: "tiga belas", "dapat", "lemes", "coklat" -> `merge.json` jadi "13", "dapet", "lemas", "cokelat".
- Loop: shot terakhir memutar `hookScene` dengan waktu negatif (tangan Budi bergerak dari posisi istirahat), sehingga frame terakhir = frame 0.
- Verifikasi render final (23-11): durasi 66,6 dtk, awal kalimat vs onset suara maks 14 ms, offset suara di MP4 2 ms, frame terakhir vs frame 0 beda rata-rata 1,2/255 (praktis identik).
- Render ulang di Windows: `powershell -ExecutionPolicy Bypass -File fakta-unik/engine/tools/win/build.ps1 -Dir episodes/pisang -Workers 8`; thumbnail `node thumb.js`.
