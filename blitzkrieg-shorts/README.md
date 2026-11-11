# YouTube Shorts 45 detik — Blitzkrieg Jerman (PD II)

File final: `blitzkrieg_shorts_45s.mp4` (1080×1920, 30 fps, 45,0 detik, H.264 + AAC).

## Naskah (voice-over)
1. **Hook** — Bagaimana Jerman menaklukkan Prancis hanya dalam enam minggu? Jawabannya: Blitzkrieg, perang kilat.
2. **Sebelum** — Sebelumnya, Perang Dunia Pertama macet di parit. Empat tahun, garis depan nyaris tak bergerak.
   Jerman belajar. Heinz Guderian dan rekan-rekannya memadukan tank, pesawat, dan radio, untuk menghantam cepat di satu titik.
3. **Sesaat** — September 1939. Polandia diserang. Stuka menghantam dari udara, panzer menerobos pertahanan.
   Mei tahun berikutnya, panzer melintasi hutan Ardennes yang dianggap mustahil, memutari Garis Maginot.
   Sekutu terkepung di Dunkirk, dan Paris jatuh pada 14 Juni.
4. **Sesudah** — Tapi di Uni Soviet, kilat itu padam. Wilayahnya terlalu luas, logistik kewalahan, dan musim dingin datang.
   Pelajarannya: kecepatan bisa memenangkan pertempuran, tapi belum tentu memenangkan perang.

## Cara menjaga konsistensi & sinkronisasi
- **Aset konsisten**: semua visual digambar oleh kode dari satu set aset vektor (satu peta Eropa, satu ikon tank/pesawat/radio,
  satu palet warna). Tidak ada gambar AI per-adegan, jadi bentuk & warna tidak berubah antar-adegan.
- **Sinkron dengan voice**: narasi ditranskrip per kata (timestamp), jeda dipadatkan, lalu timestamp dipetakan ke audio final
  (`audio/words.json`). Setiap animasi, caption, dan efek suara dipicu oleh kata yang diucapkan (fungsi `wt()` di `render.py`).

## Build ulang
```
python3 src/geo.py ne_50m_admin_0_countries.geojson work/geo.pkl   # data Natural Earth (domain publik)
python3 src/tighten.py takeA.mp3 audio/voice.wav 44.5
python3 src/mapwords.py audio/words_raw.json audio/voice.wav.map.json audio/words.json
python3 src/render.py <root> video 0 1350 | ffmpeg -f rawvideo -pix_fmt rgb24 -s 1080x1920 -r 30 -i - ...
python3 src/sfx.py <root>
```
Peta bersifat ilustratif; perbatasan 1939–1941 disederhanakan.
