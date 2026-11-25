# Naskah: Semut balik lagi padahal sudah disapu (dirender 25-11-2026)

Bentuk cerita kedelapan: **"perang naik level"** (Bawang = lomba, Nasi goreng = tamu mendadak, Telur = trik viral gagal, Jemuran = cari tersangka, Pedas = pengejek pemegang rahasia, Pisang = pilihan ditertawakan, Nyamuk = diet konyol seminggu).
Budi melawan barisan semut dengan senjata yang makin heboh (sapu, tepok, kipas angin), semua gagal; Ibu cukup lap air sabun sekali dan menutup toples gula. Rani pengejek. Penjelasan di akhir: jejak bau (feromon), bukan penglihatan.
120 kata, suara final 55,99 dtk (tanpa atempo, jeda dipadatkan), video sekitar 56,6 dtk, 17 shot. Tanpa CTA; kalimat terakhir menyambung ke kalimat 0 (loop).

## Naskah (`script.json`)
0. Tiga kali Budi nyapu barisan semut, tiga kali mereka balik lewat jalan yang sama.
1. Rani ngakak: "Semutnya dendam sama kamu, Bud!"
2. Budi naik level. Semutnya ditepok satu-satu.
3. Masih datang? Kipas angin dinyalain, semua terbang.
4. Sepuluh menit kemudian, barisan baru datang. Garisnya sama persis.
5. Ibu lewat, ngelap meja sekali pakai air sabun, terus nutup toples gula.
6. Semut berikutnya datang, berhenti di bekas lap, muter-muter, bingung.
7. Barisannya bubar. Budi melongo.
8. Ternyata semut nggak ngeliat jalan. Dia nyium jalan.
9. Semut pertama yang nemu gula ninggalin jejak bau sampai ke sarang.
10. Tiap semut yang lewat nambahin baunya, jadi jalannya makin tebal, kayak jalan tol.
11. Disapu, semutnya hilang, tapi jalannya tetap ada.
12. Air sabun ngapus baunya. Jalannya putus.
13. Sayang, Budi telat tahu. Soalnya tadi pagi,
    (loop ke kalimat 0)

## Rencana visual
- Frame 0: dapur (set Pisang), Budi menyapu barisan semut di meja dengan sapu lidi, semut terlempar, tag "1X DISAPU", bunyi "SREKK". Sapuan 2X, 3X, lalu barisan terisi lagi dari lubang di dinding ("BALIK LAGI!", "JALAN YANG SAMA").
- Rani raksasa tertawa + semut raksasa cemberut berasap ("DENDAM?!").
- LEVEL 2: tangan Budi menepok semut satu per satu (PLOK!, semut gepeng mata spiral). LEVEL 3: kipas angin, semua semut terbang (WUSSS!).
- Pindah ke meja dari atas (larut): jam "10 MENIT KEMUDIAN", barisan baru keluar lubang, garis merah putus-putus jalur lama menempel persis ("SAMA PERSIS!").
- Ibu masuk membawa lap berbusa, satu sapuan (SRET!), toples ditutup (KLIK!, toples berwajah lega).
- Dari atas: semut terdepan berhenti di pita basah, mengendus, berputar dua kali, tanda tanya ("BINGUNG"), barisan bubar ke segala arah. Budi melongo, sapu jatuh.
- Mekanisme: semut raksasa dengan penutup mata + ikon mata dicoret ("BUKAN PAKAI MATA"), antena mengendus jejak ungu menyala ("NYIUM JALAN").
- Mode "hidung semut" (meja gelap, jejak ungu menyala): semut pertama (angka 1) mengambil butir gula dan pulang ke sarang sambil meninggalkan jejak; makin banyak semut, jejak makin tebal, berubah jadi jalan tol + papan "TOL GULA".
- Sapu lewat: semut terlempar, jejak tetap menyala ("JALANNYA MASIH ADA"). Lap sabun lewat: jejak putus, palang, semut berhenti dengan tanda tanya ("PUTUS!").
- Akhir: Budi "TELAT TAHU", lalu kembali ke komposisi frame 0 ("TADI PAGI...") = loop.

## Aset baru (`web/env_semut.js`)
`drawSemut` (SATU fungsi: tampak samping/atas, jalan tripod, antena mengendus, gepeng, terlempar, wajah, bawa gula, glow), `antLine` (barisan di jalur, bisa berhenti menumpuk), `pathPrep`/`pathAt`/`pathStroke`, `drawJejak` (jejak feromon menyala, bisa putus, bisa berubah jadi jalan tol), `drawPalang`, `drawPapanTol`, `drawToplesGula` (samping/atas, tutup bergerak), `drawButirGula`, `drawSapu` (sapu lidi meja), `drawLap` + `drawBusa`, `drawLubang`, `mejaAtasBG` (meja kayu dari atas + mode malam "hidung semut"), `drawBekasLap`, `drawGarisLama`.
Tata letak `SV` (dapur samping, memakai `dapurPisangBG` + `mejaPisang`) dan `TD` (meja dari atas), palet `SMP`.

## Catatan teknis
- Scribe: "ngelihat" -> "ngeliat", "tebel" -> "tebal", "napus" -> "ngapus" (`merge.json`).
- Hook: sapuan periodik 0,7 dtk (`STROKES`, `lastStroke`), zona di belakang ujung lidi kosong lalu terisi lagi; semut terlempar dihitung dari posisi barisan saat sapuan dimulai. Semua fungsi dari `tl`, sehingga shot terakhir (`tl` negatif) = frame 0.
- Render ulang di Windows: `powershell -ExecutionPolicy Bypass -File fakta-unik/engine/tools/win/build.ps1 -Dir episodes/semut -Workers 8`; thumbnail `node thumb.js`.
