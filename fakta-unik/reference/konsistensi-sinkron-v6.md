# Konsistensi aset + sinkron suara (aturan v6)

Asal aturan: kritik pengguna pada Shorts sebelumnya: (1) aset tidak konsisten (tembok/meja berubah antar shot),
(2) video tidak nyambung dengan suara mulai sekitar detik 13.
Catatan: file ini ditulis ulang di repo dari catatan sesi v6 (zip `fakta-unik-skill-v6-tambahan.zip` di Drive tidak bisa
diekstrak lewat konektor pada sesi itu). Kalau isi zip berbeda, zip yang menang; gabungkan saat sempat.

## A. Konsistensi aset (wajib)
1. **Satu fungsi per aset.** Benda yang muncul di lebih dari satu shot digambar oleh SATU fungsi di `web/env_*.js`
   (contoh: `drawCharger`, `drawRiceCooker`, `drawGauge`). Jangan menggambar ulang benda itu di `shots.js`. Variasi = opsi fungsi.
2. **Satu fungsi per set/latar.** Ruang tamu = `ruangScene()`, dapur = `dapurBack()` + `dapurMeja()` + (di episode) `dapurProps()`.
   Tembok, meja, jam, pigura, stopkontak tidak boleh berubah warna/posisi antar shot.
3. **Palet terkunci.** Warna aset di satu objek konstanta (`LISTRIK`), bukan hex lepas di tiap shot.
4. **Tata letak terkunci.** Koordinat benda tetap di satu konstanta (`RUANG`, `DAPUR`). Tokoh boleh pindah, benda tetap tidak.
5. Benda yang "dibawa" antar shot (spin/match) memakai fungsi dan skala yang sama di kedua shot.

## B. Sinkron dengan suara (wajib)
1. **Tidak ada angka detik tetap di dalam shot.** Semua kejadian (ekspresi, pop, kamera, efek) memakai waktu kata:
   `wt(baris, 'kata', geser)`; batas shot = awal kalimat (`ls(i)`). `fw()` melempar error kalau kata tidak ada.
2. **Timing diukur pada audio FINAL.** Alur:
   `tools/sync/tighten.py audio/vo_raw.mp3 --target <dtk>` (padatkan jeda, atempo, tulis `audio/timemap.json`) lalu
   `tools/sync/mapwords.py scribe_raw.json merge.json` (petakan timestamp Scribe mentah ke audio final + gabung angka yang dieja)
   lalu `engine/tools/align_scribe.py scribe_words.json`. Target: `matched N of N words` (tanpa interpolasi).
3. `merge.json`: `[[ ["nol","koma","satu"], "0,1" ], [ ["bener"], "Benar" ], ...]` supaya caption angka jatuh tepat di ucapannya.
4. **Efek suara ikut kata**: di `audio.py` pakai `W(baris, 'kata', geser)`, bukan `B[i] + angka`.
5. **Verifikasi hasil akhir**, bukan hanya stills: `ffmpeg silencedetect` pada MP4 final dibandingkan awal tiap kalimat di
   `audio/words_new.json` (selisih <= 60 ms), lalu ambil frame MP4 final di awal tiap kalimat dan cek visualnya cocok.

## C. Durasi
- Suara "Jonathan Wiratama" sekitar 2,1 kata per detik. Untuk 45 dtk tulis 95–100 kata; `tighten.py --target 44.4` (video = suara + 0,6 dtk).
