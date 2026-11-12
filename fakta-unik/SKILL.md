---
name: fakta-unik
description: Membuat video YouTube Shorts harian bergaya stickman untuk channel "Mitos Rumahan & Fakta Unik" (@MitosRumahan) (mitos rumahan, salah kaprah, fakta unik) dalam Bahasa Indonesia. Dari satu topik, skill ini mengecek fakta, menulis naskah, membuat suara ElevenLabs, mengukur timing kata (Scribe), lalu merender video 9:16 berdurasi 30-45 detik dengan kamera bergerak, transisi whip, caption 1-2 kata, efek suara dan musik, semuanya dibuat dengan kode. Pakai saat pengguna menjalankan /fakta-unik, meminta "video Fakta Unik", "Mitos Rumahan", konten Shorts harian stickman, atau meminta episode baru channel tersebut.
---

# /fakta-unik

Video explainer stickman vertikal (1080x1920, 30 fps) untuk channel YouTube **Mitos Rumahan & Fakta Unik** (handle **@MitosRumahan**). Format tetap: hook klaim yang populer, "Benar nggak sih?", jawaban (mitos/fakta), penjelasan dengan visual, tindakan praktis, lalu ajakan **Subscribe**.

> Kredit: mesin animasi berasal dari skill `/stick-figure` karya **Artem Novitckii** (lisensi MIT, lihat `LICENSE`; repo asli https://github.com/artemnovitckii/claude-animation-skills). Versi ini menambahkan dunia dapur dan properti rumahan, pewaktuan kata berbasis ElevenLabs Scribe (semua bahasa, termasuk Indonesia), suara ElevenLabs, dan build yang jalan di lingkungan cloud Linux.

## Aturan konten (wajib)
- **Topik umum untuk orang Indonesia.** Pilih mitos/salah kaprah yang banyak dipercaya, bukan yang niche. Sumber ide: `topik_bank.md` di folder kerja pengguna, atau cari lagi (Halodoc, Klikdokter, Detik, Kompas, media lokal).
- **Fakta harus dicek ke sumber kuat** (WHO, Kemenkes, USDA/FSIS, produsen resmi, jurnal). Beri nuansa ("sebagian mitos"), jangan menyederhanakan berlebihan. Angka ditulis persis sesuai sumber. Topik kesehatan: tambahkan di deskripsi "Bukan pengganti saran dokter."
- **Branding:** nama channel "Mitos Rumahan & Fakta Unik", handle @MitosRumahan, avatar kuning dengan papan MITOS dan dua tokoh (`drawChannelAvatar`). Banner penutup memakai `drawSubBanner` (sudah berisi nama dan handle ini).
- **CTA penutup selalu "Subscribe Mitos Rumahan, besok ada lagi!"**. Jangan pakai kata "follow".
- **Hook di 0,1 detik:** suara dan gerakan mulai di frame pertama; klaim mitos ada di kalimat pertama.
- Durasi target **30-40 detik**, sekitar 90-100 kata. Tulis angka sebagai digit ("4 sampai 60 derajat", "2 jam").
- Tidak ada tanda pisah panjang (em dash) di layar.
- **Jangan menyebut proses cek fakta di narasi atau layar** (tidak ada kalimat "kami cek ke jurnal/sumber ilmiah", tidak ada ikon jurnal). Pengecekan tetap wajib dilakukan di balik layar; sumber dicatat di file catatan, bukan diucapkan.

## Persiapan lingkungan (sekali per sesi)
```bash
SKILL_DIR="<base directory skill ini>"; ENGINE="$SKILL_DIR/engine"
python3 -c "import numpy,scipy,soundfile" 2>/dev/null || pip install -q numpy scipy soundfile
node -e "require('playwright')"   # Playwright + Chromium bawaan cloud; kalau perlu: export CHROME=/opt/pw-browsers/chromium
ffmpeg -version | head -1
```
Jika unduhan audio ElevenLabs ditolak proxy (403), host `elevenlabsusercontent.com` harus diizinkan di jaringan environment (minta izin lewat `update_environment`).

## Alur kerja
1. **Topik + cek fakta.** Cari 2-3 sumber, catat angka dan nuansa. Tentukan satu kalimat "jawaban".
2. **Naskah** di `script.json` (satu kalimat per entri, maksimal sekitar 11 entri):
   1. Hook: "Katanya, <klaim>."  2. "Benar nggak sih?"  3. "Ternyata ini mitos." / "Ternyata benar."  4-8. Fakta dan penjelasan (satu ide per kalimat, ada satu bagian "mekanisme" yang bisa digambar)  9. Langkah praktis  10. "Mitos apa lagi yang mau dibongkar?"  11. "Subscribe Mitos Rumahan, besok ada lagi!"
   Jika pengguna sedang online, tampilkan naskah dulu. Pada eksekusi terjadwal/otomatis, lanjut tanpa menunggu.
3. **Folder episode:** `cp -r "$ENGINE/template" ~/reels/<nama-episode>` lalu ganti `script.json`; kosongkan `audio/`.
4. **Suara (ElevenLabs lewat konektor).** Satu take utuh untuk seluruh naskah:
   - `creative_create_flow`, lalu `creative_generate_speech` dengan `model_id: eleven_v4`, `voice_id: QC3gSHMyKh8m20lGyUNZ` (Jonathan Wiratama), `generations_count: 1`, `prompt` = seluruh naskah digabung. Jangan memanggil ulang untuk "mencoba lagi" (menagih kredit lagi). Poll `creative_get_flow_run_status` sampai selesai.
   - Unduh `content_url` ke `audio/vo_raw.mp3` (curl).
5. **Timing kata (Scribe).** `creative_attach_reference_file` (url mp3, `flow_id` yang sama) lalu `creative_transcribe_audio` (`eleven_scribe_v1`, `connect_from` = node audio) lalu poll. Unduh `words_download_url` ke `scribe_words.json`. Scribe menulis angka sebagai kata ("empat"); `align_scribe.py` mencocokkan dengan naskah dan menginterpolasi sisanya.
   Lalu: `python3 "$ENGINE/tools/prep_voice.py" audio/vo_raw.mp3` (memangkas hening dan menyimpan selisih waktunya).
6. **Shot.** Tulis ulang `web/shots.js` dan `audio.py` untuk topik baru. Panduan:
   - **Wajib baca `reference/teknik-visual-v5.md` dulu** (aturan kamera, ekspresi, transisi hasil reverse engineering; contoh siap render di `examples/demo-v5-teknik/shots.js`). Ringkasnya: kamera tidak pernah diam (>0,4 dtk), transisi pakai `tr: 'portal' | 'spin' | 'match' | 'dissolve'` (maks 1 hard cut / 10 dtk), ikuti BENDA yang jadi fakta, ekspresi ditukar per kata dengan `exprTrack` (busur usaha > kaget > lega), benda korban mitos diberi wajah (`propFace`), angka dibuktikan lewat fisika/skala (`pulleyGag`, scale reveal, `timeGrade`).
   - 10-15 shot, kebanyakan 2-4 detik; ide baru = shot baru. Batas shot ditempel ke kata dengan `BOUND` dan `fw(baris,'kata')` (lihat contoh), bukan angka detik tetap.
   - Jaga wajah dan properti penting di luar pita caption (y sekitar 1250-1420) dan di dalam area aman (x 100-980, y 220-1500).
   - Gunakan variasi: wide, close-up (latar di-blur), grafik penuh layar (termometer, jam, petri), stempel MITOS, dan satu shot yang menunjukkan **mekanisme**.
   - **Berjalan wajib pakai `walkCycle(jarakPx, s, dir)`** (di `chars.js`): fase langkah mengikuti jarak sehingga kaki tidak meluncur, lutut menekuk ke depan saat mengayun, pinggul turun naik, badan condong. Sebarkan hasilnya ke `drawStick` (`legs`, `arms`, `bob`, `footDir`, `lean`). Untuk tokoh `flip: -1`, tetap pakai `dir = 1`. Helper `walkTo(x0, x1, lt, t0, t1, s)` di contoh #3 menghitung posisi dan pose sekaligus. Jangan pakai pose kaki bergantian manual (terlihat seperti menggunting).
   - Tokoh tetap: **Ibu** (`IBU`, topi chef, baju pink) dan **Budi** (`BUDI`, jambul, baju hijau). Ekspresi: `eyes` normal/wide/happy/squint/half/smug/x/spiral/flinch(> <), `mouth` smile/grin/teeth/o/frown/flat/smirk/wobble, `sweat` 0..1. Lebih baik pakai preset `EXPR` lewat `exprTrack(lt, [[t,'kaget'],...])`: netral, sombong, licik, datar, kaget, takjub, lega, bangga, ngeden, meringis, cemas, curiga, sadar.
7. **Cek gambar:** `node "$ENGINE/tools/render.js" stills 0.4,5.6,10,...` di folder episode, lihat `stills/` dan perbaiki yang tabrakan.
8. **Suara efek dan musik:** edit cue di `audio.py` (waktu diambil dari kata lewat `W(baris,'kata')`).
9. **Build:** `bash "$ENGINE/make.sh" <folder-episode>` (`WORKERS=4`). Hasil: `<folder>/<nama>.mp4`. `AUDIO_ONLY=1` hanya mix ulang suara.
10. **QA dan serah:** pastikan durasi 30-45 detik, caption sinkron, tidak ada kata "follow", angka sesuai sumber. Kirim file ke pengguna dan sebutkan sumber fakta. Simpan naskah dan sumber di `topik_bank.md` (tandai topik sudah dipakai).

## Tambahan v6 (konsistensi + sinkron) — wajib
- **Baca `reference/konsistensi-sinkron-v6.md`.** Ringkas: satu fungsi per aset dan per latar, palet + tata letak terkunci;
  semua timing dari kata (`wt(baris,'kata')`), tidak ada angka detik tetap; timing diukur pada audio final.
- **Alur suara v6** (menggantikan `prep_voice.py` bila durasi harus pas):
  `python3 tools/sync/tighten.py audio/vo_raw.mp3 --target 44.4` lalu `python3 tools/sync/mapwords.py scribe_raw.json merge.json`
  lalu `python3 tools/sync/snaponset.py scribe_words.json` (v7: Scribe telat 40-110 ms di awal kalimat) lalu `make.sh`. Simpan transkrip Scribe mentah sebagai `scribe_raw.json`.
- **Aset listrik rumah** (`web/env_listrik.js`): `ruangScene` (ruang tamu + kalender + stopkontak), `drawCharger` (berwajah, versi `kw`,
  `hot`, `out`, label harga), `drawOutlet`, `drawBolt`, `drawPhoneGhost`, `drawGauge` (alat ukur watt), `drawRiceCooker` (magic com berwajah,
  lampu WARM, tutup = mulut), `drawPowerStrip`, `drawPlug`, `drawCord`, `drawNote`, `drawRpCoin`, `drawBill` (tagihan bisa menggembung),
  `drawWallClock`, `dapurBack`/`dapurMeja`, `spotlight`, `pcbBG`, `drawChip`, `drawCap`, `drawZzz`, `drawLed`, `drawBowl`.
- **Aset dapur kerupuk** (`web/env_kerupuk.js`, palet `KRP`, tata letak `KR`): `drawKerupuk` (SATU fungsi untuk irisan gel basah -> kerupuk mentah kaca -> mengembang: opsi `dry`, `p`, `tilt`, `wet`, `crack`), `drawStove`, `drawWok` (callback isi wajan di antara minyak dan bibir depan), `drawSack`, `drawJug`, `drawBasin`, `drawDoughLump`, `drawLog` (gelondong adonan: `cook`, `stretch` karet, `core` inti mentah, `cut`), `drawDandang`, `drawTampah`, `drawKnife`, `drawSerok`, `drawMatahari`, `halamanBG` (halaman jemur + matahari), dunia mikro `microBG`, `drawDrop`, `drawSteamBall`, `drawPores`, `pushArrow`, `sfxText` (TOK/KRIUK di dalam dunia), `mixC` (campur warna hex bertingkat; `lerpC` mengembalikan rgb() jadi tidak bisa dicampur ulang).
- **v7:** baca `reference/format-kenapa-v7.md` untuk format "Kenapa X?". Ringkas (contoh: `episodes/kerupuk/`): pertanyaan di kalimat 1, re-hook misteri di kalimat 2 yang dijawab di tengah, rantai masalah -> solusi, momen mekanisme di dunia mikro, akhir kembali ke frame 0 (loop). Durasi video = akhir suara + 0,6 dtk (`main.js`), jadi shot terakhir berakhir di `WORDS[last].e + .6`.
- Contoh episode lengkap v5+v6: `episodes/charger-nyolok/` di repo Duru (shots.js, audio.py, script.json, merge.json, SUMBER.md, metadata).
- Caption mempertahankan koma desimal ("0,1").

## Properti yang sudah ada (`web/env_home.js`, `web/env_health.js`)
`kitchenBG` (dapur), `drawFridge` (kulkas berwajah: mood happy/joy/worry/hot/broken, pintu `door` 0-1, `cold`, `temp`), `drawPot` (panci beruap), `drawBox` (wadah+tutup), `drawPlate` (piring, `sick`), `drawBug` (bakteri), `drawThermo` (termometer zona 4°/60°), `drawClock`, `drawStamp` (MITOS), `drawX`, `drawCheck`, `qmark`, `stink`, `popText`, `drawSubBanner` (banner channel YouTube dengan tombol SUBSCRIBE yang bisa "diklik"), `drawChannelAvatar`, `table`.
`env_health.js`: `drawFan` (kipas angin), `drawWind` (hembusan angin), `drawClipboard` (papan diagnosis + coret), `drawSkin` (irisan kulit + kapiler melebar/pecah), `drawBack` + `drawCoin` (punggung dikerok), `drawStomach`, `drawBattery`, `drawHeart`, `drawECG`, `drawIGD`. `env_sleep.js`: `bedroomBG`, `drawBed`, `drawEye` (mata merah, kelopak turun), `drawHourCounter`, `drawCalendar`, `drawVintageCard`, `drawHallucinations`, `drawGlass`, `drawBook`. `drawBug` menerima warna `c1`/`c2`/`spike` (misal virus flu biru).
Contoh lengkap: template (#2 kulkas), `examples/03-masuk-angin/` (shots.js, audio.py, script.json), dan `examples/demo-v5-teknik/` (semua teknik v5). Tambahkan properti baru di `env_home.js` (satu fungsi per benda, garis tepi tinta `INK`, warna jenuh, bayangan sel). Properti bajak laut asli ada di `env.js`.

## Toolkit v5 (`web/fx_v5.js`, dimuat di kedua template)
- Ekspresi: `EXPR`, `exprTrack`, `propFace`. Kamera: `camKeys`, `camLock` (benda terkunci di layar, dunia berayun), `camGeo`, `parallax`, `toScreen`.
- Efek: `glint`, `glowRing`, `innerGlow`, `flash`, `timeGrade`, `groundShadow`. Gag angka: `pulleyGag`.
- Transisi di `main.js`: properti shot `tr` + `zoomOut`/`zoomIn`/`pivot`/`spin`/`xt` (tabel di `reference/teknik-visual-v5.md`).

## Analisis video referensi (meningkatkan skill dari video lain)
Jika pengguna mengirim video referensi (rekaman layar Shorts/Reels/TikTok) untuk dipelajari:
1. `python3 -I tools/video_ref/analyze.py VIDEO OUT/` (+ `--dense T0 T1 --box x,y,w,h` untuk crop wajah). Baca `tools/video_ref/README.md`.
2. Storyboard tiap 0,2 dtk, cek tiap kandidat transisi frame per frame, crop wajah 10-15 fps, ukur angka kalibrasi.
3. Tulis `reference/analisis/ref-NN-<nama>.md` (beat sheet, mikro ekspresi, kamera, aset, keterbatasan).
4. Pindahkan prinsip baru ke `reference/teknik-visual-v5.md` + helper di `fx_v5.js` (salin ke kedua template), uji dengan demo, lalu analisis hasil render KITA dengan alat yang sama dan bandingkan angkanya.
5. Ambil teknik, jangan menyalin karakter/aset/naskah referensi. Simpan semua perubahan skill di repo `Duru` (commit + push); upload zip ke Drive hanya bila pengguna setuju.

## Catatan teknis
- Biaya kredit ElevenLabs per video 40 detik: suara sekitar 650, Scribe sekitar 250.
- Render 15 shot sekitar 8-10 menit di 4 core (lebih cepat kalau core lebih banyak). Jangan menjalankan dua build bersamaan.
- Jika naskah berubah setelah `audio/words_ref.json` dibuat, hapus file itu (take berikutnya menjadi referensi) dan sesuaikan `shots.js`.
- `make.sh` mengambil jumlah shot langsung dari halaman (`render.js count`), jadi helper seperti `SH(...)` aman dipakai.

## Video panjang (16:9, `engine/template_landscape`)
- Format 1920x1080, 24 fps (`web/config.js`). Satu folder per bab: `cp -r engine/template_landscape/. <bab>` lalu `script.json`, suara per bab (ElevenLabs, maks ~1600 karakter per panggilan), `prep_voice.py`, Scribe, `align_scribe.py`, `python3 engine/tools/mouth.py 24` (lip-sync -> web/mouth.js).
- `web/long_lib.js`: pembawa acara Budi di studio (`HOST({frame, content})`, frame: wide/med/close/low/side/two/react/board), mulut mengikuti suara, mikro ekspresi (`micro`: kedip acak, lirikan, alis naik pada kata penting, angguk), gestur otomatis pada kata penting (`gesturePlan`, `GEST`: open/palm/count/raise/point/shrug/chest/wave) di atas pose diam `presenterArms`. Konten papan dan layar penuh (`GFX`) memakai ruang desain 1600x900; jaga teks penting di y < 780 supaya tidak menabrak caption.
- `web/contents.js`: otak, pengukur, grafik batang, garis waktu, siluet air tubuh, organ, kalender N hari, jam, sel, keton, dsb. `TITLE(n, judul, ikon)` untuk kartu bab.
- Tangan: SELALU pakai `reach()` untuk target tangan di dunia (aman untuk tokoh flip), `presenterArms`/`idleArms` untuk diam. Dribble: contoh `dribbler()` di `examples/long_tanpa_tidur/c2_tidur_randy.shots.js` (fase dorong-jatuh-tangkap dengan gravitasi).
- Render: `render_queue.sh <bab...>` (3 worker) lalu gabung dengan ffmpeg concat, `make_meta.py` untuk judul/deskripsi/penanda bab/sumber. Video 8 menit: ~1,5 jam render di 4 core.
- Wajib daftar verifikasi fakta dan sumber primer sebelum naskah dikunci; sumber ditulis di deskripsi YouTube, bukan diucapkan.
