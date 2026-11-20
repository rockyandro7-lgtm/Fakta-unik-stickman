# Naskah: Jemuran apek (20-11-2026)

Pola naskah ref-02 dengan bentuk cerita keempat **"cari tersangka"** (rotasi bentuk: Bawang = lomba, Nasi goreng = tamu mendadak, Telur = trik viral gagal).
Korban kali ini Rani (di episode sebelumnya dia pengejek); Budi gantian mengejek. Topik dipilih dari keberhasilan Telur: keluhan rumah tangga + jawaban berlawanan dengan dugaan + "solusi populer" yang gagal, dan pas dengan musim hujan.
189 kata, suara final 74,12 dtk, video 74,7 dtk, 21 shot. Tanpa CTA; kalimat terakhir menyambung ke kalimat 0 (loop).

## Naskah (`script.json`)
0. Rani nyium kemeja buat wawancara besok pagi, dan mukanya langsung kayak nyium kain pel.
1. Padahal kemejanya baru dicuci kemarin. Cuma keringnya di dalam rumah, soalnya hujan terus.
2. Jadi Rani cari tersangka.
3. Tersangka pertama: deterjen murah yang dibeli Budi. Budi disuruh beli yang paling mahal, kemejanya dicuci ulang.
4. Hasilnya? Tetap bau kain pel.
5. Tersangka kedua: air sumur. Kemejanya dibilas pakai air galon.
6. Masih apek. Galonnya habis dua.
7. Rani keluarin senjata terakhir: pewangi, satu botol penuh.
8. Kamarnya wangi bunga. Sejam kemudian, baunya jadi bunga campur kain pel.
9. Budi nutup hidung: "Kak, kamu bau kayak taman bunga kebanjiran."
10. Lalu Ibu pulang, nyium kemejanya sekali, dan geleng-geleng.
11. "Pelakunya bukan sabun, Ran. Tapi bakteri yang nggak mati waktu dicuci."
12. "Dia ngumpet di serat kain. Kalau bajunya cepat kering, dia diam aja."
13. "Tapi kalau basahnya kelamaan, lebih dari 5 jam, dia pesta. Kotorannya itulah yang bau kain pel."
14. "Pewangi cuma nutupin. Bakterinya masih di situ, nunggu bajunya lembap lagi."
15. Ibu rendam kemejanya di air panas, terus dijemur pakai jarak, dengan kipas angin di depannya.
16. 3 jam, kering. Rani nyium lagi: nggak bau apa-apa.
17. Besoknya, wawancaranya lancar. Tapi sampai sekarang, Budi masih ingat malam itu, waktu
    (loop: whip-pan kembali ke komposisi frame 0)

## Struktur yang diuji (bandingkan setelah tayang)
- Frame 0 = Rani sudah menempelkan kemeja ke hidung dan menarik napas; reaksi jijik di dtk ~2,9. Jawaban TIDAK dibocorkan.
- Tiga "tersangka" gagal (deterjen murah, air sumur, pewangi) = tiga gagal palsu. Dua yang pertama memakai papan tersangka layar penuh (Budi ikut angkat tangan).
- Mekanisme di ~30% terakhir lewat dunia mikro serat kemeja (portal dari kemeja): bakteri berwajah, tidur saat kering, pesta (bertopi) saat basah >5 jam, awan bau berwajah, bunga pewangi hanya menutupi.
- Cek kurva retensi di dtk ~41-60 (dunia mikro, paling panjang tanpa tokoh manusia) dan di akhir (loop).

## Aset baru (`web/env_jemur.js`)
`rumahBG` (ruang tengah datar: dinding bergaris, jendela hujan + kilat, jam dinding, pintu, lantai papan), `drawJendela`, `drawJemuran` (jemuran berdiri; `spread` = jarak antarbaju, `wind` = kibasan kipas),
`drawKemeja` (satu fungsi: kering/basah/bau/wangi berkilau + wajah), `drawKaos`, `drawHanduk`, `drawDeterjen` (murah / premium bermahkota), `drawEmber` (air, busa, kemeja terendam, air panas beruap, label SUMUR),
`drawGalon` (bisa dimiringkan/kosong), `drawPewangi` (bisa dituang), `drawBunga`, `drawWangi` (awan bunga), `drawKainPel` (+ lalat), `drawKacaPembesar`, `drawPapanNama`,
dunia mikro `seratBG` (anyaman benang, genangan air, panas, angin) + `mcam` (zoom mikro), `drawBakteri` (kokobasil berpasangan Moraxella: tidur/pesta/mati/membelah), `drawGasBau`, `drawTetes`.
Tata letak `JL`, palet `JMP`. Tokoh: Rani (`RANI`, `env_nasi.js`; `RANI_K` = memakai kemeja), Budi, Ibu.

## Catatan teknis
- Scribe mengeja angka ("lima", "tiga"): `merge.json` menggabungkan ke "5", "3".
- Nama `BW` sudah dipakai `env_bawang.js`; di episode ini posisi Budi memakai `BWX`. Cek bentrok nama global sebelum menambah konstanta.
- Kepala digambar SETELAH lengan di `drawStick`, jadi tangan yang menutup hidung harus digambar ulang di atas kepala (`pinchHand` di `shots.js`).
- Render ulang di Windows: `powershell -ExecutionPolicy Bypass -File fakta-unik/engine/tools/win/build.ps1 -Dir episodes/jemuran -Workers 8`; thumbnail `node thumb.js`.
