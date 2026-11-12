# Analisis video referensi (frame per frame)

Alat untuk "reverse engineering" video orang lain atau video kita sendiri: kamera, transisi, ritme caption,
dan bahan visual untuk membaca mikro ekspresi. Hasilnya diolah menjadi aturan dan kode skill.
Jangan menyalin aset atau naskah referensi.

## Pakai
```bash
pip install -q opencv-python-headless numpy        # sekali per sesi
python3 -I analyze.py VIDEO OUT/                    # preset default: rekaman layar iPhone YouTube Shorts
python3 -I analyze.py VIDEO OUT/ --preset none      # video bersih (misal hasil render kita sendiri)
# crop resolusi penuh untuk mikro ekspresi: kotak dalam pecahan area gambar (x,y,w,h), semua frame di rentang
python3 -I analyze.py VIDEO OUT/ --dense 8.2 10.2 --box 0.05,0.1,0.9,0.5 --dense-fps 15 --cols 10
```
Keluaran: `frames.csv` (gerak kamera per frame), `shots.md` (shot + transisi + kurva), `timeline.png`,
`overview.jpg`, `sheets/`, `captions.csv` (waktu kata dari caption terbakar), `audio.csv`, `onsets.csv`.

## Alur kerja yang terbukti (sesi 11-11-2026)
1. **Alat dulu, mata kemudian.** Jalankan `analyze.py`, lalu buat storyboard seragam tiap 0,2 dtk
   (lihat cara di `reference/analisis/ref-01-*.md`) supaya setiap ketukan terlihat.
2. **Cek kandidat transisi secara visual** dengan `--dense` di sekitar waktunya. Detektor bisa memecah atau melewatkan transisi
   (misal fly-through oranye → oranye), jadi jangan percaya tabelnya mentah-mentah.
3. **Crop wajah 10–15 fps** di momen ekspresi. Catat setiap keadaan (mata/alis/mulut), lama tahan, dan kata pemicunya.
4. **Ukur angka kalibrasi** (laju zoom per frame, roll per frame, durasi push-in) dari `frames.csv` (hanya baris `valid=1`).
5. **Terjemahkan ke kode**: helper di `engine/template*/web/fx_v5.js` dan aturan di `reference/teknik-visual-v5.md`.
6. **Tutup siklus**: render demo, lalu analisis video KITA dengan alat yang sama (`--preset none`) dan bandingkan
   angkanya dengan referensi. Contoh: transisi zoom pertama kita ×1,42 per frame vs referensi ×1,076, lalu diganti `portal`
   yang menghasilkan ×1,063.

## Item kalibrasi terbuka
- Push-in pembuka demo terukur ×1,37 dalam 0,7 dtk vs referensi ×1,70. `kitchenBG` menggambar dinding dengan parallax kecil
  (depth 0,12–0,2) sehingga latar hampir tidak ikut membesar. Untuk rasa "3D" lebih kuat, pakai rentang z lebih besar atau
  tambahkan lapisan menengah/foreground lewat `parallax()`.

## Batasan yang diketahui
- Saat whip atau blur, pelacakan gagal. Frame itu ditandai `valid=0` dan tidak ikut dijumlah.
- Audio dari rekaman layar: onset sebagian besar suku kata narasi, jadi SFX tidak bisa dipisahkan.
- Klasifikasi jenis transisi bersifat heuristik. Jenis akhirnya diputuskan dengan melihat frame.
- Mikro ekspresi tidak dideteksi otomatis. Alat ini hanya menyiapkan crop bernomor, lalu manusia atau Claude yang membaca.

## Cara pengguna membantu (paling berdampak)
- Tandai **timestamp + alasan** bagian yang paling disukai ("detik 4, cara kamera keluar tungku").
- **Koreksi bacaan Claude** bila salah. Koreksi dicatat di file analisis bagian "Kalibrasi dari pengguna".
- Kirim **versi tanpa UI** atau resolusi asli bila ada. Hasilnya lebih akurat daripada rekaman layar.
- Kirim **video kita sendiri** untuk dianalisis A/B terhadap referensi dengan alat yang sama.
