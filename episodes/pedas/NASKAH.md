# Naskah: Kepedasan (disetujui 21-11-2026, dirender 21-11-2026)

Bentuk cerita kelima: **"taruhan dengan pengejek, pengejek ternyata pemegang rahasia"** (Bawang = lomba, Nasi goreng = tamu mendadak, Telur = trik viral gagal).
Yang menjelaskan mekanisme: **Rani** (bukan Ibu). Ibu tidak muncul.
138 kata, suara final 60,80 dtk, video 61,4 dtk, 19 shot. Tanpa CTA; kalimat terakhir menyambung ke kalimat 0 (loop).

Perbaikan dari kritik naskah Telur:
- Paradoks ada di kalimat 0 ("habis 3 gelas air, masih kebakar"), bukan di detik 9.
- Tidak ada kalimat yang mengulang isi frame 0.
- Penjelasan 2 kalimat (~8 dtk) dengan satu analogi (piring berminyak).
- Kalimat loop pendek dan tidak menyebut nama dua kali.

## Naskah (`script.json`)
0. Habis 3 gelas air, mulut Budi masih kebakar.
1. Ini taruhan sama Rani: seblak level 5, yang nyerah duluan kalah.
2. Hukumannya: foto nangisnya jadi foto profil grup keluarga.
3. Rani makan santai. Sesendok, senyum. Sesendok, senyum.
4. Budi baru 3 suap, dan lidahnya udah kerasa kayak dibakar beneran.
5. Jadi dia sambar air es, segelas penuh.
6. Adem. Tapi cuma sebentar.
7. Begitu dinginnya hilang, panasnya balik lagi.
8. Gelas kedua. Gelas ketiga. Perutnya kembung, pedasnya tetap.
9. Rani ngelirik: "Bud, siapin gaya buat foto profil, ya."
10. Budi udah mau angkat tangan, waktu dia lihat gelas Rani.
11. Isinya putih. Susu.
12. "Curang!"
13. "Nggak ada aturan soal minum, Bud. Kamu aja yang salah pilih."
14. "Pedas cabai itu kayak minyak di piring. Disiram air doang, ya nggak bakal lepas."
15. "Susu beda. Isinya bisa ngiket pedasnya, terus ngebawanya pergi."
16. Budi kalah. Sampai sekarang, foto profil grup keluarga itu foto dia,
    (loop ke kalimat 0: "...habis 3 gelas air, mulut Budi masih kebakar.")

## Rencana visual (garis besar)
- Frame 0: Budi menenggak gelas ketiga, uap/api kartun keluar dari mulut, air mata, mangkuk seblak "LV 5" berwajah. Gerak + suara di frame 0.
- Plant: gelas Rani berisi cairan putih selalu ada di frame sejak kalimat 1, setengah tertutup mangkuk (terlihat saat ditonton ulang).
- Kalimat 4: masuk ke lidah (portal mulut) -> dunia mikro: tetes kapsaisin oranye berminyak menekan "alarm kebakaran" di lidah (saraf panas).
- Kalimat 6-7: tetes air es biru lewat, alarm diam sebentar, lalu bunyi lagi.
- Kalimat 9: HP dengan grup "KELUARGA" dan bingkai foto profil kosong.
- Kalimat 14-15: dunia mikro lagi: air meluncur di atas tetes minyak (tidak menyatu), lalu butir susu putih memeluk tetes pedas dan membawanya pergi; alarm mati.
- Akhir: HP grup keluarga dengan foto Budi menangis, whip-pan ke komposisi frame 0.

## Aset baru (`web/env_pedas.js`)
`warungBG` (warung seblak datar: papan menu LV0-5, lampu untai, poster LEVEL 5 = NANGIS, rak kerupuk), `mejaWarung` (meja + taplak kotak merah, digambar setelah tokoh),
`drawSeblak` (mangkuk berangka level, isi kuah/kerupuk/ceker/cabai, uap, glow), `drawGelas` (air es / susu, `sleeve` 0..1 untuk sarung gelas Rani yang melorot, `rot` untuk minum),
`drawApi` (api dari mulut), `drawCabai`, `drawHPGrup` (grup KELUARGA BESAR, foto profil = fungsi), `drawAturan` (kertas aturan taruhan + baris "MINUM: ?"),
`drawPiringMinyak` (analogi piring berminyak disiram air), dunia mikro `lidahBG` + `SURF` (permukaan lidah, saraf ke bawah dengan denyut sinyal), `drawSensor` (alarm panas),
`drawKapsaisin` (tetes pedas berminyak berwajah), `drawProtein` (butir susu berlengan). Tata letak `PD`, palet `PDP`. Tokoh: Budi, Rani (`env_nasi.js`).

## Catatan teknis
- Scribe mengeja angka dan logat ("tiga", "lima", "enggak", "pedes"): `merge.json` menggabungkan ke "3", "5", "Nggak", "Pedas".
- Verifikasi render final (21-11): durasi 61,4 dtk, awal kalimat vs suara maks 13 ms, frame terakhir identik dengan frame 0.
- Loop: foto profil grup = komposisi frame 0 yang dirender sekali ke kanvas (`hookImage`). Zoom akhir harus selesai sebelum frame terakhir (`ENDT - .14`), karena frame terakhir video = DUR - 1/30 dtk.
- Lingkaran foto diisi salinan gambar yang diperbesar dulu (lapisan bawah), supaya saat zoom tidak terlihat sisi kosong.
- Render ulang di Windows: `powershell -ExecutionPolicy Bypass -File fakta-unik/engine/tools/win/build.ps1 -Dir episodes/pedas -Workers 8`; thumbnail `node thumb.js`.
