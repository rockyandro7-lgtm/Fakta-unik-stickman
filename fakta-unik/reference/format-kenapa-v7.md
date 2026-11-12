# Format "Kenapa X?" + pelajaran teknis (aturan v7)

Asal: episode `episodes/kerupuk/` (12-11-2026), format pertama setelah arahan pemilik "kurangi topik kesehatan, utamakan Kenapa X?".
Berlaku bersama `teknik-visual-v5.md` dan `konsistensi-sinkron-v6.md`.

## A. Struktur naskah (55-75 dtk, sekitar 130 kata)
1. **Kalimat 1 = pertanyaan utuh** (maks sekitar 8 kata) yang dibuktikan lewat AKSI di frame 0, bukan teks. Contoh: ketuk kerupuk "TOK" lalu lempar ke wajan, langsung mengembang.
2. **Kalimat 2 = re-hook misteri** ("Rahasianya ada di sesuatu yang tidak kelihatan."). Tampilkan siluet samar, lalu **jawab di tengah video** (sekitar detik 25-30). Ini menahan penonton melewati bagian proses.
3. **Rantai masalah -> solusi**: tiap langkah punya kegagalan yang tersumber ("langsung digoreng? gagal", "kukus kurang? bantat", "terlalu basah/kering? gagal"). Kegagalan = momen lucu (wajah X, stempel) + alasan untuk lanjut menonton.
4. **Momen mekanisme di dunia mikro**: masuk ke dalam benda (match/portal), tokoh kecil berwajah (tetes air -> gelembung uap), panah dorong, getaran. Lalu kembali ke dunia nyata untuk momen WOW.
5. **Penutup**: hasil (KRIUK), pertanyaan ke penonton, CTA wajib, lalu **0,6 dtk terakhir kamera kembali ke komposisi frame 0** (loop replay).
6. Jangan sebut riset/sumber, jangan pakai kata ragu. Angka yang lemah diganti kata ("jauh lebih besar").

## B. Visual
- Satu set terkunci per episode (`KR` = dapur, `MICRO` = posisi tokoh mikro). Area persiapan boleh di luar layar dasar (x < 0): kamera yang pergi, benda tidak pindah.
- Satu fungsi untuk benda yang berubah wujud (`drawKerupuk`: irisan basah -> kaca -> mengembang lewat opsi `dry`/`p`). Transformasi = interpolasi opsi, bukan ganti gambar.
- Tokoh di belakang meja (y = 1500, s = 600): kepala sekitar y 930-1155. **Jangan taruh gagang/benda di pita y 1080-1160 dekat x tokoh**, karena akan menembus wajah. Cek di stills.
- Close-up tokoh raksasa (kepala mengintip dari bawah) digambar di **ruang layar** (`ctx.setTransform(1,0,0,1,0,0)`) dengan pusat kepala di y sekitar 1600+, supaya caption (y 1250-1420) tidak menutupi wajah.
- Teks bunyi di dalam dunia (`sfxText`: TOK, CESS, TING, KRIUK) membuat video terbaca tanpa suara, dan lebih baik daripada infografis.

## C. Jebakan teknis (sudah terjadi, jangan diulang)
- `lerpC()` mengembalikan `rgb(...)`. Mencampurnya lagi menghasilkan **hitam**. Untuk campuran bertingkat pakai `mixC()` (hex -> hex).
- Transisi `portal` dengan bukaan **lingkaran** memperlihatkan tepi persegi frame berikutnya di layar 9:16. Untuk benda bulat pakai `match` (lingkaran -> lingkaran). Untuk portal, beri `{w,h}` dengan rasio 9:16 (`w = h * .5625`).
- Durasi video = akhir suara + 0,6 dtk (`main.js`). Shot terakhir harus berakhir di `WORDS[last].e + .6`. Gerakan setelahnya terpotong.
- **Scribe telat 40-110 ms di awal kalimat**. Jalankan `tools/sync/snaponset.py scribe_words.json` sebelum `align_scribe.py`, lalu verifikasi dengan silencedetect (target <= 60 ms; kerupuk: maks 10 ms).
- Nama fungsi aset jangan bentrok dengan `env.js` (contoh: `drawSun` sudah ada, jadi aset baru memakai `drawMatahari`). Cek dengan grep `^function nama` di `template*/web/*.js`.
- `make.sh` membagi shot ke worker secara bergiliran. Shot mikro yang berat (`drawPores`) bisa menumpuk di satu worker. Render 58 dtk di 4 core sekitar 21 menit.

## D. Aset (`web/env_kerupuk.js`, ada di kedua template)
`drawKerupuk`, `drawStove`, `drawWok` (callback isi), `drawSack`, `drawJug`, `drawBasin`, `drawDoughLump`, `drawLog`, `drawDandang`, `drawTampah`,
`drawKnife`, `drawSerok`, `drawMatahari`, `halamanBG`, `microBG`, `drawDrop`, `drawSteamBall`, `drawPores`, `pushArrow`, `sfxText`, `mixC`.
Pakai ulang untuk topik dapur lain (nasi keras, popcorn, es batu): wajan/kompor/dandang + dunia mikro air/uap sudah siap.
