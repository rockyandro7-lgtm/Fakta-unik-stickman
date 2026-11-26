# Naskah: Laron = rayap bersayap (dirender 26-11-2026)

Bentuk cerita kesepuluh: **"taruhan tebak-tebakan"**. Malam hujan, laron menyerbu lampu ruang tengah. Budi menebak anak capung, Rani menebak ngengat, yang kalah nyapu sayap. Ibu menaruh baskom air di bawah lampu, mematikan lampu lain, lalu bilang dua-duanya salah: itu rayap.
134 kata, suara final 58,52 dtk (tanpa atempo, jeda dipadatkan), video sekitar 59,1 dtk, 19 shot. Tanpa CTA; kalimat terakhir menyambung ke kalimat 0 (loop).

## Naskah (`script.json`)
0. Ratusan laron nyerbu lampu, terus sayapnya copot sendiri.
1. Budi yakin: "Itu anak capung!" Rani nyela: "Ngaco, itu ngengat!"
2. Taruhannya: yang kalah nyapu sayap laron sekamar.
3. Ibu naruh baskom air di bawah lampu, terus matiin lampu yang lain.
4. Laron berjatuhan ke air. Ibu cuma bilang: "Dua-duanya salah. Itu rayap."
5. Budi sama Rani melongo. Rayap? Yang makan kayu?
6. Iya. Laron itu rayap bersayap, calon raja dan ratu.
7. Koloninya ngirim mereka keluar buat bikin sarang baru, biasanya habis hujan, pas tanahnya lembap dan gampang digali.
8. Lampu bikin mereka salah arah, jadi muter-muter di situ.
9. Begitu mendarat, sayapnya sengaja dilepas, lalu mereka jalan berpasangan nyari tempat.
10. Kebanyakan gagal, dimakan cicak atau kecebur air.
11. Tapi yang berhasil bakal jadi raja dan ratu koloni baru, kadang di dekat rumah kita sendiri.
12. Budi sama Rani akhirnya nyapu berdua, karena malam ini,
    (loop ke kalimat 0)

## Aset baru (`web/env_laron.js`)
`drawLampu` (lampu gantung + cahaya), `drawLampuDinding`, `gelapRuang` (ruang gelap dengan cahaya lampu), `drawLaron` (SATU fungsi: laron bersayap/lepas sayap, rayap pekerja pucat, mahkota raja-ratu, wajah), `laronSwarm`, `drawSayap` + `sayapLantai`, `drawBaskom` (laron mengapung), `drawCapung`, `drawNgengat`, `drawKayu`, `tanahBG` (penampang sarang rayap, hujan, tanah lembap, rumah di atas), `drawCicak`.
Ruang tengah = `rumahBG` (env_jemur.js, malam hujan). Sapu dari `env_semut.js`.
