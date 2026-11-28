# Naskah: Bawang goreng gosong di piring (dirender 28-11-2026)

Bentuk cerita ketiga belas: **"resep ditertawakan + pembalikan"**. Budi mengangkat bawang goreng saat sudah kuning emas, di piring malah gosong. Rani menertawakan ("apinya kegedean"), api dikecilin tetap gosong. Taruhan naik: Ibu titip satu toples untuk arisan sore, bawang tinggal segenggam. Ibu mengangkat saat masih kuning muda (ditertawakan "belum mateng"), lalu di piring bawangnya berubah sendiri jadi kuning emas. Dunia mikro: irisan menyimpan panas + tetes minyak panas yang menempel terus memasak. Analogi: setrika yang sudah dicabut masih bisa bikin baju gosong.
113 kata, suara final 49,7 dtk (tanpa atempo, jeda dipadatkan), video 50,3 dtk, 15 shot. Tanpa CTA; kalimat terakhir menyambung ke kalimat 0 (loop: besoknya Budi goreng sendiri lagi = frame 0).
Perbaikan dari analisis retensi 27-11: detik 6-15 menambah taruhan (toples arisan, bawang tinggal segenggam), pembalikan cerita (bawang Ibu jadi emas sendiri) sebelum penjelasan, sesudah jawaban hanya satu "kenapa" + satu analogi + solusi.

## Naskah (`script.json`)
0. Bawang goreng Budi diangkat masih kuning, tapi di piring malah gosong.
1. Rani ngakak: "Apinya kegedean, tuh!"
2. Api dikecilin, bawangnya diaduk terus. Di piring, gosong lagi.
3. Padahal Ibu titip satu toples buat arisan sore ini.
4. Bawangnya tinggal segenggam.
5. Ibu turun tangan, dan langsung ngangkat bawangnya waktu masih kuning muda.
6. "Bu, itu belum mateng!"
7. Tapi di piring, bawang Ibu pelan-pelan berubah jadi kuning emas.
8. Ternyata bawang goreng tetap mateng, walaupun sudah keluar dari wajan.
9. Irisannya masih nyimpan panas, dan minyak panas yang nempel terus masak dia.
10. Sama kayak setrika yang sudah dicabut: masih bisa bikin baju gosong.
11. Jadi angkat waktu masih kuning muda, matengnya nanti di piring.
12. Arisan selamat. Besoknya, Budi goreng sendiri lagi, dan
    (loop ke kalimat 0)

## Aset baru (`web/env_bawanggoreng.js`, palet `BGP`, tata letak `BGL`)
`drawIrisGoreng` (SATU fungsi irisan: mentah ungu -> kuning muda -> kuning emas -> cokelat -> gosong lewat `c` 0..1, warna dari `warnaBawang`), `drawTumpukan` (gundukan irisan + wajah + asap + gelombang panas), `drawPiringTiris` (piring + kertas minyak), `drawSerokBawang` (serok `drawSerok` + isi + tetes minyak), `isiWajan` (irisan mengapung di wajan `drawWok`), `drawMangkukIris`, `drawToplesBawang` (isi + label ARISAN), dunia mikro `mikroBawangBG` + `drawTetesMinyak`, setrika tampak atas `drawSetrika` + `drawPapanSetrika` + `drawKaosAtas` (bekas gosong) + `lantaiAtasBG`.
Dapur = `dapurBack`/`dapurMeja` (set Telur, env_listrik) + `drawStove`/`drawWok` (env_kerupuk) + `drawFridge`.
Hook: Budi terlihat di frame 0 (mengangkat serok), lalu pan cepat ke piring. Loop: shot terakhir = hook dengan waktu negatif (`hookScene(..., tl)`).
