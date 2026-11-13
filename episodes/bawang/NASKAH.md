# Naskah: Bawang, versi cerita (v2, 13-11-2026)

Disetujui pemilik 13-11-2026 menggantikan v1 ("Kenapa iris bawang bikin mata perih?", ada di riwayat git).
Pola naskah dari `fakta-unik/reference/analisis/ref-02-ricksclips-naskah.md`: aksi aneh di kalimat 1, tokoh pengejek + taruhan,
gagal palsu di tengah, mekanisme di akhir, kalimat terakhir menyambung ke kalimat pertama.
162 kata. **Durasi final 66,4 dtk** (suara 65,75 dtk + 0,6 dtk loop), 17 shot. Dirender 13-11-2026 di PC Windows pemilik.

**Tanpa CTA (keputusan pemilik 13-11-2026):** tidak ada ajakan subscribe, pertanyaan ke penonton, atau banner di video.
Ajakan berkomentar hanya lewat komentar pin. Setelah tayang, bandingkan % ditonton, stayed-to-watch, like, subs, dan komentar dengan Kerupuk/Masuk Angin.

## Produksi
- Suara: ElevenLabs eleven_v4, "Jonathan Wiratama" (QC3gSHMyKh8m20lGyUNZ), satu take 78,96 dtk mentah (`audio/vo_raw.mp3`).
- Timing: Scribe 162/162 kata cocok (`scribe_raw.json`). `tighten.py --target 62 --keep 0.26 --max-tempo 1.12` -> 65,75 dtk, lalu `mapwords.py`, `snaponset.py` (9 awal kalimat ditempel), `align_scribe.py`.
- Gerak asah Ibu memakai frekuensi `SHF` dengan jumlah siklus bulat sampai akhir video, jadi frame terakhir identik dengan frame 0 (loop mulus). Fade audio akhir dipendekkan ke 0,08 dtk (`audio_lib.py` episode ini).
- Penghitung irisan dan tumpukan memakai jadwal global `cntB`/`cntI` di `shots.js` supaya konsisten antar shot.

## Naskah (`script.json`)
0. Ibu mengasah pisaunya lima menit penuh, cuma buat ngiris bawang.
1. Budi langsung ketawa: "Bu, keburu bawangnya tumbuh!"
2. Soalnya mereka lagi taruhan: siapa lebih cepat ngiris sekilo bawang merah, bebas cuci piring seminggu.
3. Budi pakai pisau lama yang tumpul, dan langsung ngebut. Tak-tak-tak-tak.
4. Ibu? Masih ngasah.
5. Sepuluh iris, mata Budi mulai panas.
6. Dua puluh iris, air matanya netes ke talenan.
7. Ibu baru mulai. Pelan. Satu iris, satu iris.
8. Budi sudah setengah jalan, tapi sekarang dia ngiris sambil merem.
9. Hidungnya meler, pisaunya meleset, dan dia harus berhenti tiap lima iris buat ngelap mata.
10. Ibu? Matanya kering. Dan tumpukannya makin tinggi.
11. Jadi begini. Bawang menyimpan dua bahan yang dipisah, kayak stik glow sebelum dipatahkan.
12. Begitu selnya pecah, keduanya bercampur jadi gas yang bikin mata perih.
13. Pisau tumpul nggak mengiris, tapi meremas, dan menyemprotkan cairan bawang ke udara.
14. Makin ngebut, makin banyak semprotannya.
15. Pisau tajam yang pelan cuma membelah seperlunya, jadi semprotannya nggak sampai setinggi mata.
16. Minggu ini Budi cuci piring. Dan sekarang, setiap mau masak,
    (loop: video berakhir di sini dan menyambung ke baris 0)

## Peta visual (usulan)

| Baris | Teks layar (selain caption) | Visual / kamera | Transisi keluar |
|---|---|---|---|
| 0 | SREK SREK | **HOOK, frame 0:** Ibu sudah mengasah pisau di batu asah (bunyi srek), satu siung bawang merah menunggu di talenan. Jam dinding berputar cepat. Kamera push-in ke wajah Ibu yang serius | whip |
| 1 | HAHAHA | Budi terpingkal, menunjuk; gag: bawang berwajah menumbuhkan tunas sambil menguap bosan | whip |
| 2 | papan "BEBAS CUCI PIRING 1 MINGGU" | Wide meja: dua talenan, dua karung kecil bawang, tumpukan piring kotor berwajah di bak | match (piring ke talenan) |
| 3 | TAK TAK TAK TAK | Budi dengan pisau tumpul berwajah lesu, ngebut; irisan beterbangan. Kamera ikut pisau | lanjut |
| 4 | | Kamera whip ke Ibu: masih mengasah. Budi melirik, wajah sombong (`smug`) | whip |
| 5 | 10 | Close-up mata Budi (`drawEye`) mulai merah, penghitung iris "10" | lanjut |
| 6 | 20 | Air mata menetes ke talenan; penghitung "20" | dissolve |
| 7 | | Ibu mulai, pelan; kilau (`glint`) di mata pisau tiap iris | whip |
| 8 | | **Gagal palsu:** tumpukan Budi jauh lebih tinggi; Budi mengiris sambil merem | lanjut |
| 9 | X | Budi berhenti mengelap mata dengan lengan; pisau meleset ke tomat (splat) | whip |
| 10 | | **Pembalikan:** Ibu tenang, mata kering; bar progres Ibu menyalip Budi | portal ke dalam bawang |
| 11 | 2 BAHAN | Dunia mikro: dua kantong berwajah di ruang terpisah; stik glow utuh di samping (analogi) | lanjut |
| 12 | KRAK! | Dinding sel pecah, stik glow dipatahkan dan menyala bersamaan; gas berwajah licik naik | match ke dapur |
| 13 | | Slow-motion: pisau tumpul menekan bawang sampai gepeng, butiran menyembur ke atas | lanjut |
| 14 | | Versi ngebut: semprotan makin tinggi, menembus garis "TINGGI MATA" | whip |
| 15 | TAJAM + PELAN | Pisau tajam membelah bersih; butiran rendah, garis "TINGGI MATA" tidak tersentuh | dissolve |
| 16 | SIKAT | Budi di bak cuci piring, tumpukan piring berwajah; lalu kamera menyapu kembali ke Ibu mengasah pisau (komposisi frame 0) untuk **loop** | (akhir) |

## Pemeriksaan aturan
- Fakta sama dengan `SUMBER.md` (tidak ada klaim baru). Lomba dan taruhan adalah cerita fiksi sebagai wadah.
- Tidak menyebut riset/sumber di suara maupun layar. Angka studi (40x, 4x) tidak dipakai.
- Tidak ada klaim "asam sulfat di mata" dan tidak ada tips yang buktinya campur (mendinginkan/merendam bawang).
- Hook: stickman + gerak + suara di frame 0, aksi aneh selesai diucapkan sekitar detik 3.
- Bukan topik kesehatan; tidak perlu disclaimer dokter.
- Tanpa CTA (suara maupun visual).
