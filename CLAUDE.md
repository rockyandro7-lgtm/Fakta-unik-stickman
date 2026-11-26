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
- **Komentar masih 0 di semua video.** Ajakan berkomentar lewat komentar pin dua pilihan ("Tim A atau tim B?"), bukan di suara.
- **Tanpa CTA (keputusan pemilik 13-11-2026):** tidak ada ajakan subscribe/pertanyaan di suara maupun banner. Alasan pemilik: CTA menurunkan retensi dan jarang dilihat. Video berakhir dengan kalimat yang menyambung ke kalimat pertama (loop), pola dari `fakta-unik/reference/analisis/ref-02-ricksclips-naskah.md`.
- Shorts datang bergelombang. Jangan hapus atau upload ulang video yang sepi.

## Alur membuat episode baru
1. Pilih topik dari `topik_bank.md` (prioritaskan keluhan sehari-hari). Verifikasi fakta ke sumber primer, simpan di `episodes/<nama>/SUMBER.md`.
2. Ikuti `fakta-unik/SKILL.md` (wajib baca `reference/teknik-visual-v5.md` dan `konsistensi-sinkron-v6.md` untuk shot).
3. Hasilkan: naskah, audio, thumbnail 1080x1920 dan 1280x720, `YOUTUBE_METADATA.md`.
   **Wajib (permintaan pemilik 12-11-2026): setiap kali mengirim video (termasuk revisi), tulis juga paket upload langsung di pesan balasan, siap salin:** judul (1 rekomendasi + 2 alternatif), deskripsi, hashtag, tag, komentar pin, jadwal upload, dan file cover. Isinya sama dengan `YOUTUBE_METADATA.md`. Jangan hanya menyebut nama filenya.
4. Update `topik_bank.md` (tandai SUDAH) dan commit + push.
   **Kirim video versi kecil, SELALU OTOMATIS bersama MP4 asli** (pemilik 21-11-2026: "selalu otomatis lampirkan juga versi yang sudah di-compress", termasuk revisi). `make.sh` dan `build.ps1` sekarang langsung membuat `<nama>_kecil.mp4`; kirim keduanya (asli untuk upload, kecil untuk dilihat). Resep manual bila perlu: `ffmpeg -i <nama>.mp4 -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -c:a aac -b:a 160k -ar 48000 -movflags +faststart <nama>_kecil.mp4` (pedas: 109 MB jadi 20,6 MB, SSIM 0,986).
5. Jadwal upload: 18.30-19.30 WIB.

## Status saat ini (update tiap session)
- Sudah rilis: Masuk Angin (#3), Freon Habis, Tidak Tidur 11 Hari (long-form), Kerupuk, Blitzkrieg. **Charger Nyolok terjadwal 13-11-2026** (belum tayang per 13-11 10.30; episode di `episodes/charger-nyolok`). Pemilik (13-11) mempertimbangkan untuk scrap/revamp episode ini (format lama + CTA).
- **Bawang v2 SUDAH DIRENDER (13-11-2026), menunggu review pemilik**: `episodes/bawang/` (66,4 dtk, versi cerita lomba Ibu vs Budi, tanpa CTA, loop ke frame 0). MP4 tidak di-commit; render ulang di Windows: `powershell -File fakta-unik/engine/tools/win/build.ps1 -Dir episodes/bawang` (di Linux cloud: `make.sh` biasa). Aset baru `web/env_bawang.js` (bawang berwajah, talenan, batu asah, pisau tumpul/tajam, air mata, semprotan, stik glow, dunia sel). Thumbnail dari `thumb.js`.
- **Nasi goreng calon mertua SUDAH DIRENDER (14-11-2026), jadwal upload 15-11 18.30-19.30 WIB**: `episodes/nasi-goreng/` (68,2 dtk, 17 shot, tanpa CTA, loop). Bentuk taruhan "tamu datang mendadak" (bukan lomba; rotasi bentuk cerita tiap episode supaya tidak tertebak). Tokoh baru **Rani** (kakak Budi, `RANI` di `web/env_nasi.js`) + calon mertua (`BAPAK_M`, `IBU_M`). Penjelasan sengaja pendek (2 kalimat dialog Ibu, ~8 dtk) atas arahan pemilik. MP4 tidak di-commit.
- **Telur bopeng SUDAH DIRENDER (17-11-2026), jadwal upload 17-11 18.00 WIB (permintaan pemilik), menunggu review pemilik**: `episodes/telur/` (71,3 dtk, 18 shot, tanpa CTA, loop). Bentuk cerita ketiga: "trik viral gagal satu per satu" (Budi jualan 30 telur balado untuk bazar, pengejek Rani, Ibu pakai telur 7 hari + air mendidih). Aset baru `web/env_telur.js` (`drawTelur` satu fungsi untuk utuh/retak/bopeng/mulus/balado, tray 30 butir, rak + label 7 HARI, panci mendidih, keran, soda, `drawPenampang` dunia mikro kulit-selaput-putih). MP4 tidak di-commit.
- **Jemuran apek SUDAH DIRENDER (21-11-2026), jadwal upload 21-11 18.30-19.30 WIB, menunggu review pemilik**: `episodes/jemuran/` (74,7 dtk, 23 shot, tanpa CTA, loop). Dipilih karena Telur "membludak" (laporan pemilik 20-11): rumus keluhan rumah tangga + jawaban berlawanan dugaan + solusi populer gagal, pas musim hujan. Bentuk cerita keempat: "cari tersangka" (deterjen murah, air sumur, pewangi sebotol), korban Rani, Budi mengejek, Ibu menunjuk bakteri. Aset baru `web/env_jemur.js` (`rumahBG` ruang tengah + jendela hujan, `drawJemuran`, `drawKemeja`, `drawEmber`, `drawGalon`, `drawPewangi`, `drawDeterjen`, dunia mikro `seratBG` + `drawBakteri` + `drawGasBau`). MP4 tidak di-commit.
- **Kepedasan SUDAH DIRENDER (21-11-2026), usulan jadwal upload Minggu 22-11 18.30-19.30 WIB, menunggu review pemilik**: `episodes/pedas/` (61,4 dtk, 19 shot, tanpa CTA, loop lewat foto profil grup = frame 0). Bentuk cerita kelima: taruhan seblak level 5 dengan Rani; pengejek ternyata pemegang rahasia (gelasnya susu) dan Rani yang menjelaskan (Ibu tidak muncul). Perbaikan dari kritik naskah Telur: paradoks di kalimat 0, tanpa kalimat ulangan, penjelasan 2 kalimat, kalimat loop pendek. Aset baru `web/env_pedas.js` (`warungBG`, `mejaWarung`, `drawSeblak`, `drawGelas` dengan sarung melorot, `drawApi`, `drawHPGrup`, `drawAturan`, `drawPiringMinyak`, dunia mikro `lidahBG` + `drawSensor` + `drawKapsaisin` + `drawProtein`). MP4 tidak di-commit.
- **Pisang di kulkas TAYANG 23-11-2026: 321K views, stayed 88,6%, APV 91,4%, 11 komentar dalam 24 jam; per 26-11: 897,9K views, +988 subs, APV 92,6% (rekor channel, lihat PERFORMANCE_NOTES 24-11 dan 26-11)**: `episodes/pisang/` (66,6 dtk, 20 shot, tanpa CTA, loop: shot terakhir memutar hook dengan waktu negatif sehingga frame terakhir = frame 0). Dipilih pemilik dari 4 usulan (rumus Telur: keluhan dapur + jawaban berlawanan dugaan). Bentuk cerita keenam: "pilihan yang ditertawakan" (Budi pilih pisang hitam, Rani mengejek, taruhan cuci piring, pembalikan saat dikupas). Aset baru `web/env_pisang.js` (`drawPisang` satu fungsi untuk hijau/kuning/bertotol/hitam/dikupas/lembek, `drawSisir`, `drawKulkasPisang`, `dapurPisangBG`, dunia mikro `drawSel` + `drawO2` + `drawPigmen`, `drawTermoPisang` garis 13°, `drawApel`, `drawSpeedo` + REM). MP4 tidak di-commit.
- **Nyamuk "darah manis" SUDAH DIRENDER (24-11-2026), usulan jadwal upload Rabu 25-11 18.30-19.30 WIB, menunggu review pemilik**: `episodes/nyamuk/` (56,5 dtk, 19 shot, tanpa CTA, loop ke frame 0). Dipilih pemilik dari usulan "jaga konsistensi" (rumus Telur/Pisang: keluhan sehari-hari + keyakinan umum salah + solusi populer gagal). Bentuk cerita ketujuh: "diet konyol seminggu" (tanpa gula + bawang putih mentah), Rani yang paling manis justru tidak digigit. Aset baru `web/env_nyamuk.js` (`terasBG` teras malam/pagi, `mejaTeras`, `drawNyamuk` + `nyamukSwarm`, `drawGelasTeh`, `drawBawangPutih`, `drawTongSampah`, dunia mikro `kulitBG` + `drawMikroba` + `drawAroma`, `drawToples`, `drawPapanWarteg`, `drawKalenderTahun`). Teks bunyi pakai `sfxS` (koordinat layar). MP4 tidak di-commit.
- **Rencana 25-11-2026: 2 Short per hari selama 2 minggu (26-11 s.d. 9-12), jam 05.30 dan 15.30 WIB** (permintaan pemilik, menggantikan slot 18.30-19.30 selama periode ini; target 10 juta views). Daftar 28 topik + tanggal + set yang bisa dipakai ulang ada di `topik_bank.md` bagian "Rencana 2 minggu". Pakai ulang latar yang sudah ada supaya produksi cukup cepat.
- **Semut balik lagi SUDAH DIRENDER (25-11-2026), jadwal upload 25-11 15.30 WIB (permintaan pemilik, dimajukan dari rencana 28-11), menunggu review pemilik**: `episodes/semut/` (~56,6 dtk, 17 shot, tanpa CTA, loop ke frame 0). Bentuk cerita kedelapan: "perang naik level" (sapu, tepok, kipas angin gagal; Ibu lap air sabun sekali). Aset baru `web/env_semut.js` (`drawSemut` samping/atas, `antLine` barisan di jalur, `drawJejak` jejak feromon menyala yang bisa putus/jadi jalan tol, `mejaAtasBG` meja dari atas + mode "hidung semut", `drawToplesGula`, `drawSapu`, `drawLap`). Dapur samping memakai `dapurPisangBG`. MP4 tidak di-commit.
- **Kamis 26-11-2026: Kuning telur hijau + Laron SUDAH DIRENDER, menunggu review pemilik.** `episodes/telur-hijau/` (52,8 dtk, 15 shot; bentuk cerita kesembilan "alarm palsu + perbaikan yang memperparah"; dapur set Telur + `web/env_hijau.js`: `drawTelurBelah`, `drawKartuWaktu`, dunia mikro `mikroTelurBG` + `drawPartikel` S/Fe). `episodes/laron/` (59,1 dtk, 19 shot; bentuk cerita kesepuluh "taruhan tebak-tebakan" capung vs ngengat, twist laron = rayap calon raja-ratu; ruang tengah `rumahBG` malam + `web/env_laron.js`: `drawLampu`, `gelapRuang`, `drawLaron` satu fungsi bersayap/lepas/pekerja/mahkota, `laronSwarm`, `drawBaskom`, `tanahBG` penampang sarang, `drawCicak`, `drawCapung`, `drawNgengat`). Slot 05.30 Kamis terlewat (video selesai sekitar 08.20 WIB). Jebakan: fungsi `puff` error bila radius negatif, jadi hook yang diputar dengan waktu negatif memakai `kitchen(ctx, tl + 100, ...)`. MP4 tidak di-commit.
- **Monetisasi (26-11-2026):** syarat subscriber sudah terpenuhi; tinggal views Shorts. Tab Earn per 21-11: **212K qualified Shorts views** (data tertinggal ~5 hari, Pisang belum masuk). Target bertahap: 3 juta (tahap awal: Memberships/Supers/Shopping) lalu 10 juta (bagi hasil iklan). YPP menghitung qualified/engaged views, bukan total views.
- **Snapshot analitik lengkap 13-11-2026** ada di bagian bawah `PERFORMANCE_NOTES.md` (tabel semua Short + cek dugaan).
- **Seri baru "perang dalam sejarah Indonesia" (13-11-2026):** episode pertama **Palagan Ambarawa SUDAH DIRENDER (16-11-2026), jadwal upload 16-11 18.30-19.30 WIB** (`episodes/ambarawa/`, 60,6 dtk, 14 shot, tanpa CTA, loop "rewind" ke frame 0). Target 15 Desember dibatalkan pemilik ("produksi secepatnya"). Gaya peta = Blitzkrieg. Aset baru di `web/env_ambarawa.js`: `token` (TKR berpeci / Belanda NICA / Sekutu), `TKR` (preset tokoh berpeci), `hatPeci`, `hatPet`, `drawRifle`, `drawJail`, `drawUdang` (capit `snap`), `bendera` (merah putih horizontal), `lencana`. Render ulang: `build.ps1 -Dir episodes/ambarawa`; thumbnail `node thumb.js`.
- **PC Windows pemilik:** clone repo ada di `C:\Users\leand\Documents\Fakta-unik-stickman` (folder lama `Claude youtube shorts` sudah tidak dipakai). Playwright terpasang di `fakta-unik/engine/tools/win/node_modules` (gitignored; pasang ulang: `npm install` di folder itu).
- Naskah bawang v2 memakai pola `fakta-unik/reference/analisis/ref-02-ricksclips-naskah.md` (aksi aneh di frame 0, pengejek + taruhan, gagal palsu, mekanisme di akhir, loop). Setelah tayang, bandingkan % ditonton dan stayed-to-watch dengan Kerupuk/Masuk Angin di `PERFORMANCE_NOTES.md`.
- **Render di PC Windows pemilik (13-11-2026):** Python 3.12, Node.js LTS, FFmpeg, Git terpasang; Playwright memakai Chrome terpasang. Skrip `fakta-unik/engine/tools/win/` (`build.ps1` pengganti `make.sh`, `render_win.js` pengganti `render.js`). Lihat README di folder itu.
- **Kerupuk sudah tayang (12-11-2026)** (`episodes/kerupuk`, format "Kenapa X?" pertama, 58 dtk). Kesan awal pemilik: views per jam lebih tinggi dari Masuk Angin; catat angkanya di `PERFORMANCE_NOTES.md` saat tersedia.
- **Siap upload (12-11-2026, jadwal 17.30 WIB): Blitzkrieg** (uji efek upload ke video lama, lihat rencana di `PERFORMANCE_NOTES.md`) (`episodes/blitzkrieg`, format "Kenapa X?" sejarah + peta pengepungan, ~90 dtk). Naskah `NASKAH.md`, sumber `SUMBER.md`, metadata `YOUTUBE_METADATA.md`. MP4 dikirim terpisah; render ulang: `bash fakta-unik/engine/make.sh episodes/blitzkrieg`. Aset baru `web/env_perang.js`, `web/env_peta.js`, `web/map_data.js` (masih di folder episode; pindahkan ke `engine/template*` bila dipakai lagi). Setelah tayang, bandingkan retensinya dengan Kerupuk dan Masuk Angin (apakah topik sejarah cocok untuk channel). Video peta lama `blitzkrieg-shorts/` tidak dipakai.
- CTA: **tidak dipakai lagi** sejak 13-11-2026 (lihat "Pelajaran dari data"). Episode lama yang sudah memakai CTA tidak perlu diubah.
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
