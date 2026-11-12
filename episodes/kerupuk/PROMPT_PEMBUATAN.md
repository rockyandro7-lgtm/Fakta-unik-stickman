# Prompt pembuatan episode kerupuk (untuk Opus, effort high)

Kamu bekerja di repo Fakta-unik-stickman (channel YouTube Shorts @MitosRumahan, pemilik: Leandro & Karunia). Tugasmu: membuat SATU episode lengkap, "Kenapa Kerupuk Keras Bisa Mengembang Besar Saat Digoreng?".

## 0. Baca dulu (wajib, sebelum menulis apa pun)
1. `CLAUDE.md` (peta repo dan aturan)
2. `fakta-unik/SKILL.md`
3. `fakta-unik/reference/teknik-visual-v5.md` dan `fakta-unik/reference/konsistensi-sinkron-v6.md`
4. `PERFORMANCE_NOTES.md` (pelajaran dari data channel)
5. `episodes/kerupuk/SUMBER.md` (fakta sudah diverifikasi, JANGAN riset ulang kecuali ada celah)
6. Episode referensi yang sudah jadi: `episodes/charger-nyolok`
Kerjakan di branch kerja yang diberikan, bukan branch baru. Jangan bertanya balik kecuali buntu; ambil keputusan terbaik dan laporkan.

## 1. Aturan emas (tidak boleh dilanggar)
A. **HOOK ADALAH PRIORITAS #1.** Calon penonton sedang men-swipe Shorts. Tiga detik pertama menentukan semuanya. Data channel: pembuka padat teks/infografis = 88% swipe away; stickman terlihat + topik keluhan sehari-hari = 67% stayed-to-watch.
B. **Riset TIDAK ditampilkan.** Jangan sebut "menurut penelitian", "sumber", "studi", nama jurnal, atau BPOM di video. Ceritakan dengan percaya diri, karena faktanya sudah diverifikasi. Detail sumber hanya di `SUMBER.md`.
C. **Tidak ada klaim ragu atau "setengah mitos"/"mungkin"/"katanya".** Video ini fakta unik yang tegas.
D. **Format "Kenapa X begitu?"**: jawaban tidak diumumkan di awal; dibangun lewat rantai masalah ke solusi (terinspirasi teknik video referensi: satu adegan 3D bersambung, kamera bergerak, teks besar kata-per-kata sinkron suara). Ambil tekniknya, jangan salin aset/naskah siapa pun.
E. **Durasi fleksibel, bukan kaku 45 detik.** Target 55-75 detik untuk mengejar watch time, selama retensi terjaga. Jangan memanjangkan dengan isian; tiap beat harus menambah rasa penasaran atau jawaban.
F. Bukan topik kesehatan. Tidak perlu disclaimer dokter. Bahasa Indonesia santai, kalimat pendek.
G. Jangan commit MP4/hasil render besar.

## 2. Spesifikasi HOOK (detik 0-3)
- Frame 0: stickman SUDAH terlihat, ada gerakan dan suara dari detik 0. Bukan judul diam, bukan layar teks.
- Satu klaim/pertanyaan paling kuat di kalimat pertama, maksimal ~8 kata, teks besar di tengah.
- Kontras visual: kerupuk mentah keras (diketuk "tok tok") vs kerupuk mengembang di wajan.
- Buat 3 alternatif hook (kalimat + visual), nilai tiap alternatif terhadap: berhenti-swipe, jelas tanpa suara, memicu penasaran. Pilih terbaik, simpan 2 sisanya di `HOOK_ALTERNATIF.md`.
  Contoh arah: (a) "Kerupuk mentah sekeras kayu. Kok di wajan jadi besar?" (b) kerupuk dilempar ke wajan langsung mengembang + "Ini bukan sulap." (c) "Rahasia kerupuk renyah ada di air yang kamu tidak lihat."
- Tambahkan re-hook di sekitar detik 8-12 dan di tengah (pertanyaan baru atau twist kecil) agar retensi tidak turun.

## 3. Fakta yang boleh dipakai (dari SUMBER.md)
1. Tepung tapioka + air dikukus, pati matang jadi gel elastis. Kalau kurang matang, kerupuk kurang mengembang.
2. Dijemur sampai keras seperti kaca, tapi masih menyimpan sedikit air di dalam. Terlalu basah atau terlalu kering sama-sama kurang mengembang.
3. Masuk minyak sangat panas, air di dalam jadi uap, uap mendorong dari dalam dan membentuk rongga.
4. Pati melunak lalu mengeras lagi, jadi struktur renyah.
**DILARANG di video:** angka rasio ("3x"), suhu atau menit spesifik, "minyak kurang panas bikin bantat" (tidak ada sumber), klaim kesehatan.

## 4. Struktur beat (rantai masalah ke solusi), boleh disesuaikan
1. Hook (0-3 dtk), 2. Kontras keras vs besar (3-8), 3. Tepung+air mentah tidak bisa mengembang ("cukup?") (8-15), 4. Dikukus jadi gel; kegagalan: kukus kurang, bantat (15-25), 5. Dijemur sampai keras kayak kaca; kegagalan: terlalu basah/kering (25-38), 6. Masuk minyak; kamera masuk ke dalam adonan, air jadi uap, uap membesar (momen "wow") (38-55), 7. Gel melunak lalu mengeras, rongga renyah (55-65), 8. Penutup loop: kriuk, kamera kembali ke kerupuk mentah di awal (agar replay mulus).
Satu adegan dapur bersambung, kamera bergerak (zoom, tilt, masuk ke dalam adonan). Hindari potong-potong infografis.

## 5. Output yang harus dihasilkan di `episodes/kerupuk/`
- `NASKAH.md` (naskah per beat: suara, teks layar, visual, perkiraan detik)
- `HOOK_ALTERNATIF.md`
- audio narasi + sinkron kata (ikuti `konsistensi-sinkron-v6.md`, pakai `tools/sync/`)
- render video (JANGAN commit MP4; simpan di luar git atau abaikan)
- thumbnail 1080x1920 dan 1280x720 (stickman kaget, kerupuk mentah di tangan, kerupuk besar di wajan; teks pendek seperti "KERAS jadi KRIUK?")
- `YOUTUBE_METADATA.md` (judul, deskripsi, hashtag, jam upload 18.30-19.30 WIB)
- Aset engine baru (dapur, wajan, minyak, kerupuk, adonan, uap) bila perlu; kalau mengubah `engine/template/web/`, salin juga ke `engine/template_landscape/web/` sesuai CLAUDE.md.

## 6. Quality gate sebelum selesai
- Periksa frame 0 dan frame detik 1-3: stickman ada, tidak ada infografis padat, teks terbaca di layar HP.
- Cek tidak ada kata "penelitian/sumber/studi" dan tidak ada angka terlarang di naskah, teks layar, atau audio.
- Cek sinkron suara dan teks kata-per-kata, serta konsistensi aset antar-shot.
- Cek loop akhir ke awal.

## 7. Penutup
Update `fakta-unik/reference/topik_bank.md` (tambah/tandai kerupuk SUDAH), update bagian "Status saat ini" di `CLAUDE.md`, commit dan push ke branch kerja. Laporkan ringkas: hook yang dipilih, durasi akhir, dan hal yang perlu keputusan manusia.
