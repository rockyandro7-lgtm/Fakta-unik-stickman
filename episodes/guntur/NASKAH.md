# Naskah: Kenapa guntur telat? (v2, dirender ulang 28-11-2026)

Bentuk cerita keempat belas: **"teori konyol + uji hitung"**. Kilat menyambar, Budi langsung tutup telinga, tapi gunturnya nggak datang; begitu dilepas, DUAR. Budi punya teori: guntur = suara awan tabrakan. Rani tidak setuju (guntur lahir barengan kilat, cuma jalannya lelet) dan mengaku bisa tahu jauhnya petir tanpa ngintip ke luar. Rani menghitung 1-2-3 DUAR = petirnya sekitar 1 km. Kilat yang dekat langsung DUAR tanpa menunggu (bukti). Lelucon tiga: kucing ngumpet di kolong, cicak kabur ke balik jam, Budi loncat ke bawah meja. Jawaban: guntur bukan awan tabrakan, tapi suara kilat itu sendiri; kilat memanaskan udara sampai 5 kali lebih panas dari permukaan matahari, udaranya mengembang mendadak, meledak jadi DUAR.
121 kata, suara final 54,65 dtk (tanpa atempo; jeda hitungan "satu... dua... tiga..." dipertahankan dengan `tighten.py --protect 24.9-28.2`), video 55,3 dtk, 16 shot. Tanpa CTA; loop: "Malamnya, Budi nyoba ngitung sendiri, dan" = frame 0 (dia tetap tutup telinga).
Keamanan: semua adegan badai di dalam rumah; tidak ada tokoh yang keluar saat ada petir.

## Revisi v2 (28-11-2026, permintaan pemilik)
- v1 memakai taruhan "yang kalah cuci piring seminggu" (kalimat 4) dan penutup "Budi kalah, cuci piring". Pemilik: taruhan terlalu sering (cuci piring seminggu sudah di Bawang dan Pisang), minta variasi.
- Kalimat 4 diganti klaim yang harus dibuktikan; kalimat 8 diganti lelucon tiga ala Cicak ("kucing, burung, atau Budi"); kalimat 12 diganti Budi mencoba sendiri.
- Scribe menulis "keluar" (satu kata) untuk "ke luar"; scribe_raw.json dipecah jadi dua kata sebelum mapwords.py.

## Naskah (`script.json`)
0. Kilat nyamber, Budi langsung tutup telinga, tapi gunturnya nggak datang-datang.
1. Baru dilepas: DUAR!
2. Kata Budi, guntur itu suara awan tabrakan, jadi harus nunggu awannya nabrak dulu.
3. Rani nggak setuju: "Gunturnya lahir barengan kilat, cuma jalannya lelet."
4. Rani bahkan bisa tahu jauhnya petir, tanpa ngintip ke luar.
5. Kilat lagi. Rani ngitung: satu... dua... tiga... DUAR!
6. "Tiga detik. Berarti petirnya sekitar satu kilo dari sini."
7. Lalu kilat nyamber dekat banget: langsung DUAR, nggak pakai nunggu.
8. Kucing ngumpet di kolong, cicak kabur ke balik jam, Budi loncat ke bawah meja.
9. Guntur itu bukan awan tabrakan, tapi suara dari kilat itu sendiri.
10. Kilat manasin udara sampai lima kali lebih panas dari permukaan matahari.
11. Udaranya mengembang mendadak, meledak jadi DUAR.
12. Malamnya, Budi nyoba ngitung sendiri, dan
    (loop ke kalimat 0)

## Aset baru (`web/env_guntur.js`, palet `GTP`, tata letak `GL`)
`drawKilat` (zigzag bercabang deterministik, `kilatPts`), `kilatLayar` + `kedip` (kedip kilat 2x), `drawAwanB` (awan badai berwajah, `squash` saat tabrakan), `langitBG` (langit malam + hujan + bukit + rumah), `drawRumahMini`, `drawGelombang` (busur gelombang suara), tokoh `drawCahaya` (komet kuning cepat) dan `drawSuara` (gelembung biru "DUAR" berkaki, lelet), dunia mikro `mikroUdaraBG` + `drawMolekul` (molekul udara berwajah, memerah saat panas), `drawTermoKilat`, `drawMejaMakan`, `drawPenggaris` (penanda "± 1 KM").
Ruang tengah malam = `rumahBG` (env_jemur) + `drawLampu`/`gelapRuang` (env_laron), set yang sama dengan Laron/Cicak. Kucing dan cicak dari `env_cicak.js` (`drawKucing`, `drawCicakB`). `env_pisang.js` masih dimuat (sisa v1, tidak dipakai lagi).
Catatan teknis: `CK` sudah dipakai `env_cicak.js` (konstanta tata letak), jadi helper kamera di shots.js bernama `CKS`.
