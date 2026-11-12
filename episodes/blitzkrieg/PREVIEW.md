# Blitzkrieg versi stickman: PREVIEW ASET (12-11-2026)

Tujuan: memperlihatkan ke pemilik seperti apa aset dan latar baru sebelum episode penuh dibuat.
Topik: "Kenapa Prancis yang punya benteng terkuat bisa kalah cuma 6 minggu?" (format "Kenapa X?", masuk fakta unik/sejarah).
Menggantikan video peta di `blitzkrieg-shorts/` (pembukanya peta + teks, pola yang kalah di data channel).

## Isi preview (~18 dtk, TANPA narator, hanya musik + efek suara)
1. Hook: tentara Prancis santai ngopi di atas Garis Maginot -> kamera mundur memperlihatkan benteng raksasa -> kopi tumpah.
2. Parit PD I: dua tentara saling intip, papan tahun 1914 -> 1918, wajah bosan.
3. Lapangan: tentara Jerman memamerkan "kombo" tank + pesawat + radio, sinyal radio menyambungkan semuanya.
4. Hutan Ardennes: tank menerobos cemara, papan BUNTU roboh.
5. Salju Rusia: tank terjebak, roda selip, panji kilat padam.

Timing kata di `web/words.js` masih PERKIRAAN (belum ada suara). Versi penuh: naskah lengkap -> ElevenLabs -> Scribe -> sinkron v6.

## Aset baru
`web/env_perang.js` (palet `PRG`, tata letak `MAG`/`PRT`/`LAP`/`ARD`/`SLJ`):
`hatAdrian`, `hatStahl` (helm, dipakai lewat `hat: fungsi` di `drawStick`), `drawTank` (roll/crew/snow/bolt/face), `drawPennant`,
`drawPlane`, `drawRadio`, `drawWaveLink`, `drawCup`, `drawFlagWave`, `drawSandbags`, `drawBarbed`, `drawSign`, `drawPine`, `drawSnowfall`,
latar `maginotScene`, `trenchBack`/`trenchFront`, `fieldScene`, `ardennesScene`, `snowScene`.
Sengaja tanpa lambang Nazi: tentara dibedakan warna seragam + bentuk helm.
Mesin: `chars.js` sekarang menerima `hat` berupa fungsi (sudah disalin ke kedua template).

## Render ulang
```
python3 audio.py                       # musik + efek (preview tanpa narator)
node ../../fakta-unik/engine/tools/render.js segments 0,1,2,3,4   # lalu concat + mux (lihat make.sh)
node sheet_render.js aset_preview.jpg  # lembar aset
```
