# Palagan Ambarawa: PREVIEW (13-11-2026)

Status: **ide + 1 frame preview**. Belum ada naskah final, suara, atau cek fakta lengkap (`SUMBER.md` belum dibuat).
Rencana tayang: sekitar **15 Desember** (Hari Juang Kartika = peringatan kemenangan Ambarawa 15-12-1945).
Seri baru: perang/pertempuran dalam sejarah Indonesia, menyambung keberhasilan Blitzkrieg (sudut pandang: **taktik**).

## Frame preview
`preview_hook.jpg` = detik 0,6 dari hook. Render: dari folder ini
`node ../../fakta-unik/engine/tools/win/render_win.js stills 0,0.6` (NODE_PATH ke `fakta-unik/engine/tools/win/node_modules`).

Isi frame: peta Jawa Tengah gaya peta Blitzkrieg, panah merah **supit urang** (dua sayap menjepit + satu menekan dari depan),
token Sekutu berhelm Brodie di Ambarawa (sombong lalu kaget), Soedirman (mantel + blangkon) di depan menunjuk, tag kuning "29 TAHUN".

## Aset
`web/env_ambarawa.js`: `projJ` (lon/lat -> dunia, Ambarawa di 540,900), `TJ` (tempat), `petaAmbarawa` (laut, pantai utara, gunung
Ungaran/Merbabu, Rawa Pening, jalan Semarang-Ambarawa-Magelang, label kota), `gunung`, `hatBlangkon` (topi untuk `drawStick`),
`coatSoedirman` (mantel via `propBehind`), preset tokoh `SOEDIRMAN`, `tagKuning`.
Memakai ulang aset Blitzkrieg (disalin ke `web/`): `env_peta.js` (MPC, drawArrow, mapSoldier, hatBrodie), `env_perang.js` (PRG, drawPine),
`env_kerupuk.js` (mixC dipakai drawPine), `env.js` (applyCam). Garis pantai = perkiraan tangan, peta ilustrasi.

## Draf naskah (semi-santai, TANPA CTA, akhir menyambung ke kalimat pertama)
Fakta di bawah masih harus diverifikasi ke sumber primer sebelum dikunci.
0. Umur 29 tahun, dia ngusir tentara yang baru menang Perang Dunia II.
1. Akhir 1945, Sekutu mendarat di Semarang. Katanya cuma mau lucutin Jepang.
2. Tapi ternyata... Belanda ikut nebeng. Tawanan Belanda dibebasin, terus dikasih senjata. Ya jelas, perang pecah.
3. Sekutu mundur ke Ambarawa. Komandan kita, Letkol Isdiman, gugur kena serangan udara.
4. Dan di situlah... Soedirman turun langsung.
5. Taktiknya namanya supit urang, capit udang.
6. Satu pasukan nekan dari depan, dua lagi njepit dari kiri dan kanan.
7. Musuh kekunci, jalan pulang ke Semarang terancam putus.
8. 12 Desember, jam setengah lima pagi, serangan dimulai.
9. Satu hari. Dua hari. Tiga. Empat.
10. 15 Desember, Sekutu mundur ke Semarang.
11. Tiga hari kemudian, Soedirman resmi jadi Panglima Besar.
12. Semua itu dimulai dari satu kolonel yang umurnya baru... (loop ke kalimat 0: "29 tahun")

Fakta yang wajib dicek: Isdiman gugur 26-11-1945; serangan 12-12-1945 pukul 04.30; Sekutu mundur 15-12-1945;
Soedirman dilantik Panglima Besar 18-12-1945; umur Soedirman (lahir 24-01-1916). Hindari angka korban/jumlah pasukan.
Komentar pin (dua pilihan): "Taktik paling cerdik: supit urang Ambarawa atau gerilya Soedirman?"
