# Fakta-unik-stickman: BACA INI DULU

Satu repo untuk semuanya. **`main` = satu-satunya versi terbaru.** Jangan bikin repo/branch terpisah per video.

## Sinkron repo (wajib, izin tetap dari pemilik: Leandro & Karunia)
Setiap sesi cloud bekerja di branch `claude/...` sendiri. Hasil kerja yang tidak digabung ke `main` tidak terlihat oleh sesi berikutnya,
dan pemilik tidak mau terus mengingatkan. Karena itu pemilik **mengizinkan Claude menggabungkan ke `main` dan push `main`** sesuai aturan ini:
1. **Awal sesi, sebelum mengerjakan apa pun:** baca keluaran hook `[sinkron repo]` (`.claude/hooks/session-start.sh`).
   Kalau hook tidak jalan, cek manual: `git fetch --prune origin` lalu `git branch -r --no-merged origin/main`.
   Kalau ada branch yang belum masuk `main`: gabungkan ke `main` (`git checkout main && git merge --ff-only origin/main && git merge --no-edit origin/<branch>`),
   push `main`, lalu bawa ke branch sesi ini (`git checkout <branch-sesi> && git merge --ff-only main`, atau `git merge main` bila tidak bisa fast-forward).
   Sebutkan singkat ke pengguna apa saja yang digabung.
2. **Akhir sesi (setiap kali ada commit):** push branch sesi, lalu gabungkan ke `main` dan push `main`. Jangan tunggu disuruh.
3. **Kalau ada konflik merge:** berhenti, jangan pilih sepihak, jelaskan konfliknya ke pengguna dan tanya.
4. Branch `claude/...` yang isinya sudah 100% ada di `main` (cek `git branch -r --merged origin/main`) boleh dihapus dari GitHub, kecuali branch sesi ini.
5. Jangan rewrite history `main` (tidak ada force push ke `main`).

## Ini apa
Channel YouTube Shorts **Mitos Rumahan & Fakta Unik** (@MitosRumahan): video stickman vertikal (45-75 detik), mitos sehari-hari dan format "Kenapa X?" (Bahasa Indonesia). Pemilik akun: Leandro & Karunia.

## Peta repo
| Path | Isi |
|---|---|
| `fakta-unik/` | **Skill + engine pembuat video.** Mulai dari `fakta-unik/SKILL.md` |
| `fakta-unik/reference/topik_bank.md` | **Bank topik** + status (SUDAH / Perlu cek) |
| `episodes/<nama>/` | Satu folder per episode (naskah, audio, metadata, thumbnail). MP4 tidak di-commit |
| `PERFORMANCE_NOTES.md` | **Catatan analitik channel.** Tambah snapshot baru di bagian bawah (jangan timpa) |
| `blitzkrieg-shorts/` | Eksperimen terpisah: Short sejarah PD II (peta vektor, render Python). Bukan format utama channel |

## Pelajaran dari data (lihat PERFORMANCE_NOTES.md, sampel masih kecil)
- Pola yang menang: **topik keluhan sehari-hari + karakter stickman terlihat di frame pertama** (Masuk Angin per 13-11: 3.448 views, stayed 81,7%, ~91% ditonton, +9 subs, terbaik di semua metrik).
- Pola yang kalah: **pembuka padat teks/infografis** (AC "Freon Habis": 82,8% swipe away, padahal yang bertahan menonton 85% durasinya; masalahnya murni hook).
- Hook: klaim mitos di kalimat pertama, suara dan gerakan mulai di frame 0. 95% traffic dari Shorts feed, jadi 1-2 detik pertama menentukan.
- Durasi 90 dtk aman bila ada analogi kuat (Blitzkrieg: 73,6% ditonton, like dan watch time tertinggi). Topik sejarah diterima penonton.
- **Komentar masih 0 di semua video.** Penutup pakai pertanyaan dua pilihan ("Tim A atau tim B?") + komentar pin yang sama.
- Shorts datang bergelombang. Jangan hapus atau upload ulang video yang sepi.

## Alur membuat episode baru
1. Pilih topik dari `topik_bank.md` (prioritaskan keluhan sehari-hari). Verifikasi fakta ke sumber primer, simpan di `episodes/<nama>/SUMBER.md`.
2. Ikuti `fakta-unik/SKILL.md` (wajib baca `reference/teknik-visual-v5.md` dan `konsistensi-sinkron-v6.md` untuk shot).
3. Hasilkan: naskah, audio, thumbnail 1080x1920 dan 1280x720, `YOUTUBE_METADATA.md`.
   **Wajib (permintaan pemilik 12-11-2026): setiap kali mengirim video (termasuk revisi), tulis juga paket upload langsung di pesan balasan, siap salin:** judul (1 rekomendasi + 2 alternatif), deskripsi, hashtag, tag, komentar pin, jadwal upload, dan file cover. Isinya sama dengan `YOUTUBE_METADATA.md`. Jangan hanya menyebut nama filenya.
4. Update `topik_bank.md` (tandai SUDAH) dan commit + push.
5. Jadwal upload: 18.30-19.30 WIB.

## Status saat ini (update tiap session)
- Sudah rilis: Masuk Angin (#3), Freon Habis, Tidak Tidur 11 Hari (long-form), Kerupuk, Blitzkrieg. **Charger Nyolok terjadwal 13-11-2026** (belum tayang per 13-11 10.30; episode di `episodes/charger-nyolok`).
- **Snapshot analitik lengkap 13-11-2026** ada di bagian bawah `PERFORMANCE_NOTES.md` (tabel semua Short + cek dugaan).
- **Episode berikutnya: `episodes/bawang/`** ("Kenapa iris bawang bikin mata perih?", format "Kenapa X?", ~60 dtk). Naskah + sumber sudah siap (`NASKAH.md`, `SUMBER.md`, `script.json`); belum ada audio/shot/render. Pakai ulang dapur `KR` + dunia mikro dari `env_kerupuk.js`; aset baru: bawang merah berwajah, sel bawang, stik glow, butiran semprotan.
- **Kerupuk sudah tayang (12-11-2026)** (`episodes/kerupuk`, format "Kenapa X?" pertama, 58 dtk). Kesan awal pemilik: views per jam lebih tinggi dari Masuk Angin; catat angkanya di `PERFORMANCE_NOTES.md` saat tersedia.
- **Siap upload (12-11-2026, jadwal 17.30 WIB): Blitzkrieg** (uji efek upload ke video lama, lihat rencana di `PERFORMANCE_NOTES.md`) (`episodes/blitzkrieg`, format "Kenapa X?" sejarah + peta pengepungan, ~90 dtk). Naskah `NASKAH.md`, sumber `SUMBER.md`, metadata `YOUTUBE_METADATA.md`. MP4 dikirim terpisah; render ulang: `bash fakta-unik/engine/make.sh episodes/blitzkrieg`. Aset baru `web/env_perang.js`, `web/env_peta.js`, `web/map_data.js` (masih di folder episode; pindahkan ke `engine/template*` bila dipakai lagi). Setelah tayang, bandingkan retensinya dengan Kerupuk dan Masuk Angin (apakah topik sejarah cocok untuk channel). Video peta lama `blitzkrieg-shorts/` tidak dipakai.
- CTA sekarang: "Subscribe Mitos Rumahan dan Fakta Unik, besok ada lagi!" (nama channel lengkap).
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
