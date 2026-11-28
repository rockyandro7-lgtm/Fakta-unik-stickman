# Naskah: Kenapa guntur telat? (dirender 28-11-2026)

Bentuk cerita keempat belas: **"teori konyol + uji hitung"**. Kilat menyambar, Budi langsung tutup telinga, tapi gunturnya nggak datang; begitu dilepas, DUAR. Budi punya teori: guntur = suara awan tabrakan. Rani tidak setuju (guntur lahir barengan kilat, cuma jalannya lelet), taruhan cuci piring seminggu. Rani menghitung 1-2-3 DUAR = petirnya sekitar 1 km. Kilat yang dekat langsung DUAR tanpa menunggu (bukti), Budi ngumpet di bawah meja. Jawaban: guntur bukan awan tabrakan, tapi suara kilat itu sendiri; kilat memanaskan udara sampai 5 kali lebih panas dari permukaan matahari, udaranya mengembang mendadak, meledak jadi DUAR.
111 kata, suara final 53,0 dtk (tanpa atempo; jeda hitungan "satu... dua... tiga..." dipertahankan dengan `tighten.py --protect`), video 53,6 dtk, 16 shot. Tanpa CTA; loop: Budi cuci piring, kilat nyamber lagi, "dan" = frame 0.
Keamanan: semua adegan badai di dalam rumah; Budi tidak keluar saat ada petir (taruhan sengaja cuci piring, bukan angkat jemuran).

## Naskah (`script.json`)
0. Kilat nyamber, Budi langsung tutup telinga, tapi gunturnya nggak datang-datang.
1. Baru dilepas: DUAR!
2. Kata Budi, guntur itu suara awan tabrakan, jadi harus nunggu awannya nabrak dulu.
3. Rani nggak setuju: "Gunturnya lahir barengan kilat, cuma jalannya lelet."
4. Taruhannya: yang kalah cuci piring seminggu.
5. Kilat lagi. Rani ngitung: satu... dua... tiga... DUAR!
6. "Tiga detik. Berarti petirnya sekitar satu kilo dari sini."
7. Lalu kilat nyamber dekat banget: langsung DUAR, nggak pakai nunggu.
8. Budi loncat ke bawah meja.
9. Guntur itu bukan awan tabrakan, tapi suara dari kilat itu sendiri.
10. Kilat manasin udara sampai lima kali lebih panas dari permukaan matahari.
11. Udaranya mengembang mendadak, meledak jadi DUAR.
12. Budi kalah, cuci piring, terus kilat nyamber lagi, dan
    (loop ke kalimat 0)

## Aset baru (`web/env_guntur.js`, palet `GTP`, tata letak `GL`)
`drawKilat` (zigzag bercabang deterministik, `kilatPts`), `kilatLayar` + `kedip` (kedip kilat 2x), `drawAwanB` (awan badai berwajah, `squash` saat tabrakan), `langitBG` (langit malam + hujan + bukit + rumah), `drawRumahMini`, `drawGelombang` (busur gelombang suara), tokoh `drawCahaya` (komet kuning cepat) dan `drawSuara` (gelembung biru "DUAR" berkaki, lelet), dunia mikro `mikroUdaraBG` + `drawMolekul` (molekul udara berwajah, memerah saat panas), `drawTermoKilat`, `drawMejaMakan`, `drawPenggaris` (penanda "± 1 KM").
Ruang tengah malam = `rumahBG` (env_jemur) + `drawLampu`/`gelapRuang` (env_laron), set yang sama dengan Laron/Cicak. Wastafel + tumpukan piring dari `env_pisang.js`.
Catatan teknis: `CK` sudah dipakai `env_cicak.js` (konstanta tata letak), jadi helper kamera di shots.js bernama `CKS`.
