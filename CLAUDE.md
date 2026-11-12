# Fakta-unik-stickman: BACA INI DULU

Satu repo untuk semuanya. Semua branch lama sudah digabung ke `main`. Kerjakan di `main` (atau branch kerja yang diminta), jangan bikin repo/branch terpisah per video.

## Ini apa
Channel YouTube Shorts **Mitos Rumahan & Fakta Unik** (@MitosRumahan): video stickman vertikal 45 detik, membongkar mitos sehari-hari (Bahasa Indonesia). Pemilik akun: Leandro & Karunia.

## Peta repo
| Path | Isi |
|---|---|
| `fakta-unik/` | **Skill + engine pembuat video.** Mulai dari `fakta-unik/SKILL.md` |
| `fakta-unik/reference/topik_bank.md` | **Bank topik** + status (SUDAH / Perlu cek) |
| `episodes/<nama>/` | Satu folder per episode (naskah, audio, metadata, thumbnail). MP4 tidak di-commit |
| `PERFORMANCE_NOTES.md` | **Catatan analitik channel.** Tambah snapshot baru di bagian bawah (jangan timpa) |
| `blitzkrieg-shorts/` | Eksperimen terpisah: Short sejarah PD II (peta vektor, render Python). Bukan format utama channel |

## Pelajaran dari data (lihat PERFORMANCE_NOTES.md, sampel masih kecil)
- Pola yang menang: **topik keluhan sehari-hari + karakter stickman terlihat di frame pertama** (Masuk Angin: stayed-to-watch 67%).
- Pola yang kalah: **pembuka padat teks/infografis** (AC "Freon Habis": 88% swipe away).
- Hook: klaim mitos di kalimat pertama, suara dan gerakan mulai di frame 0.
- Shorts datang bergelombang. Jangan hapus atau upload ulang video yang sepi.

## Alur membuat episode baru
1. Pilih topik dari `topik_bank.md` (prioritaskan keluhan sehari-hari). Verifikasi fakta ke sumber primer, simpan di `episodes/<nama>/SUMBER.md`.
2. Ikuti `fakta-unik/SKILL.md` (wajib baca `reference/teknik-visual-v5.md` dan `konsistensi-sinkron-v6.md` untuk shot).
3. Hasilkan: naskah, audio, thumbnail 1080x1920 dan 1280x720, `YOUTUBE_METADATA.md`.
4. Update `topik_bank.md` (tandai SUDAH) dan commit + push.
5. Jadwal upload: 18.30-19.30 WIB.

## Status saat ini (update tiap session)
- Sudah rilis: Masuk Angin (#3), Freon Habis, Tidak Tidur 11 Hari, Charger Nyolok (episode di `episodes/charger-nyolok`).
- **Siap upload (12-11-2026): Kerupuk** (`episodes/kerupuk`, format "Kenapa X?" pertama, 58 dtk). MP4 dikirim terpisah; render ulang: `bash fakta-unik/engine/make.sh episodes/kerupuk`. Setelah tayang, bandingkan retensinya dengan Masuk Angin di `PERFORMANCE_NOTES.md`.
- Antrean berikutnya: sesuai arahan pemilik, utamakan format "Kenapa X?" (ide di bagian bawah `topik_bank.md`). Topik kesehatan lama (#2, #3, #4) hanya bila diminta.
- Belum diisi: checklist analitik di `PERFORMANCE_NOTES.md` (retention per detik, sumber traffic, data 7 hari).
- Kalau pengguna hanya bilang "ide topik" atau "lanjut", mulai dari antrean di atas, cek `PERFORMANCE_NOTES.md`, lalu usulkan.

## Aturan arah konten (update 12-11-2026, dari pemilik)
- **HOOK wajib kuat untuk calon penonton yang swipe**: stickman terlihat + gerak + suara di frame 0, klaim/pertanyaan di 3 detik pertama, bukan infografis padat.
- Kurangi topik kesehatan dan hindari kemasan "setengah mitos". Format utama sekarang: **"Kenapa X begitu?"** (fakta unik: benda, makanan, alam, teknologi, sejarah), dijelaskan bertahap lewat rantai masalah-solusi dalam satu adegan bersambung.
- Fakta **wajib diverifikasi**, simpan di `SUMBER.md`, tetapi **jangan sebut riset/sumber di video**; bawakan dengan percaya diri.
- Durasi **tidak kaku 45 detik**; boleh lebih panjang (kisaran 55-75 detik) untuk watch time, asal tiap beat menambah rasa penasaran.

## Aturan
- Topik kesehatan: tambahkan "bukan pengganti saran dokter". Mitos budaya ditandai sebagai kepercayaan, bukan sains.
- Ambil teknik dari video referensi, jangan salin aset atau naskah.
- Jangan commit MP4 atau hasil render besar (lihat `.gitignore`).

---

# Detail skill (dari CLAUDE.md lama)
Isi utama: skill **`fakta-unik/`** untuk channel YouTube "Mitos Rumahan & Fakta Unik" (@MitosRumahan).
Repo ini adalah sumber kebenaran skill. Zip di Google Drive (`Mitos Rumahan & Fakta Unik - YouTube / 00 - Panduan & Skill`)
hanya salinan rilis yang diupload bila pengguna setuju.

- Mulai dari `fakta-unik/SKILL.md`. Untuk membuat shot, wajib baca `fakta-unik/reference/teknik-visual-v5.md`.
- Pasang sebagai skill: salin `fakta-unik/` ke `~/.claude/skills/` (atau `.claude/skills/`).
- Video referensi dari pengguna: ikuti bagian "Analisis video referensi" di `SKILL.md` dan `fakta-unik/tools/video_ref/README.md`.
  Ambil tekniknya, jangan salin aset/naskah. Hasil analisis disimpan di `fakta-unik/reference/analisis/`.
- Setiap update skill: commit + push ke repo ini. Perubahan mesin di `engine/template/web/` juga disalin ke
  `engine/template_landscape/web/` (`chars.js`, `fx_v5.js`, dan blok transisi v5 di `main.js`).
- Riwayat versi: v4 = baseline dari Drive; v5 (11-11-2026) = toolkit kamera/ekspresi/transisi dari referensi 01 + alat analisis video.
- v6 (11-11-2026) = aturan konsistensi aset + sinkron suara (`reference/konsistensi-sinkron-v6.md`), `tools/sync/` (tighten, mapwords),
  aset listrik rumah (`env_listrik.js`).
- v7 (12-11-2026) = format "Kenapa X?" (`reference/format-kenapa-v7.md`), aset dapur kerupuk + dunia mikro (`env_kerupuk.js`, juga di
  `template_landscape`), `tools/sync/snaponset.py` (awal kalimat ditempel ke onset suara). Episode contoh: `episodes/kerupuk/`. Episode dikerjakan di `episodes/<nama>/`; MP4 tidak di-commit (kirim ke pengguna/Drive).
