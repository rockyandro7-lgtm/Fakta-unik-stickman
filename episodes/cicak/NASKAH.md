# Naskah: Ekor cicak putus masih joget (dirender 27-11-2026)

Bentuk cerita kesebelas: **"pahlawan palsu"**. Budi memukul cicak dengan sapu, ekornya putus dan joget di lantai, Budi merasa menang. Rani: "Kamu yang ketipu." Selama Budi melotot ke ekor, cicaknya kabur ke balik jam dinding. Mekanisme lewat replay lambat + rontgen ekor (garis retak, otot, pembuluh menutup), lalu kucing/burung/Budi sibuk mengejar ekor (umpan), ekor tumbuh lagi berisi tulang rawan.
121 kata, suara final 54,8 dtk (tanpa atempo, jeda dipadatkan), video 55,4 dtk, 17 shot. Tanpa CTA; kalimat terakhir menyambung ke kalimat 0 (loop: sapu memukul lagi, ekor jatuh = frame 0).

## Naskah (`script.json`)
0. Ekor cicak ini udah putus, tapi masih joget sendiri.
1. Budi teriak bangga: "Aku menang! Ekornya kupotong!"
2. Rani ketawa: "Kamu yang ketipu, Bud."
3. Selama kamu melototin ekornya, cicaknya udah kabur ke balik jam dinding.
4. Cicak memang sengaja ngelepas ekornya sendiri.
5. Tulang ekornya punya garis retak yang memang disiapkan buat patah.
6. Begitu kena serang, ototnya narik kencang, dan krek, ekornya lepas.
7. Pembuluh darahnya langsung nutup, jadi hampir nggak berdarah.
8. Ekornya terus joget sampai beberapa menit, buat ngalihin perhatian pemangsa.
9. Kucing, burung, atau Budi, semuanya sibuk ngejar ekor, cicaknya selamat.
10. Dalam beberapa minggu, ekornya tumbuh lagi.
11. Tapi bukan ekor yang sama: isinya bukan tulang lagi, cuma tabung tulang rawan.
12. Bentuknya juga sering beda, lebih tumpul, warnanya nggak sama.
13. Besoknya Budi ngayunin sapu lagi, dan
    (loop ke kalimat 0)

## Aset baru (`web/env_cicak.js`)
`drawCicakB` (cicak tampak atas: ekor asli / buntung / ekor baru tumpul abu-abu, jalan, wajah), `drawEkor` + `ekorPts` (SATU fungsi ekor: menempel, putus + joget, tumbuh ulang), `drawTulangEkor` (diagram rontgen: ruas + garis retak, otot menarik, patah, pembuluh menutup, ekor baru = tabung tulang rawan), `rontgenBG`, `drawKucing`, `drawBurung`, `drawKalenderDinding` (minggu, lembar dibalik), `drawBingkai` (foto DULU), `drawTetesDarah`.
Ruang tengah = `rumahBG` (env_jemur.js) malam tanpa hujan. Sapu dari `env_semut.js`.
