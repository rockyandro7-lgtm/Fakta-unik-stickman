# Naskah: Kenapa iris bawang bikin mata perih? (v1, 13-11-2026)

Format "Kenapa X?" (fakta unik dapur, bukan kesehatan). Sekitar 130 kata, perkiraan 58-62 dtk. Belum ada audio/shot/render.

## Kenapa topik ini (dari snapshot analitik 13-11-2026, lihat `PERFORMANCE_NOTES.md`)
- Masuk Angin menang karena **keluhan kecil yang dialami semua orang**. Mata perih saat iris bawang dialami hampir setiap orang yang masak, jadi kekuatan itu terbawa ke format "Kenapa X?" yang diminta pemilik.
- Penonton teratas perempuan 25-34, Indonesia: dapur adalah dunia mereka.
- Hook bisa dibuktikan lewat AKSI di frame 0 (air mata menyembur), bukan teks; kebalikan dari kegagalan AC "Freon Habis".
- Punya **analogi** (stik glow) seperti petinju di Blitzkrieg, dan **rantai masalah -> solusi** dengan kegagalan yang lucu (potong cepat, pisau tumpul).
- Penutup diuji dengan **pertanyaan dua pilihan** untuk memecah komentar 0.
- Aset: dapur `KR`, `drawKnife`, `drawStove`, dunia mikro (`microBG`, `drawDrop`, `drawSteamBall`, `pushArrow`, `sfxText`) dari `env_kerupuk.js`.

## Naskah (`script.json`)
0. Kenapa iris bawang bikin mata perih sampai nangis?
1. Rahasianya, bawang sedang membela diri.
2. Di dalam bawang ada dua bahan yang disimpan terpisah, kayak stik glow sebelum dipatahkan.
3. Begitu pisau masuk, sel-selnya pecah, dan dua bahan itu bercampur.
4. Mereka bereaksi jadi gas yang gampang menguap dan melayang ke wajah.
5. Gas itu sampai ke mata dan menyentil saraf di permukaannya.
6. Mata mengira diserang, jadi langsung banjir air mata untuk membilasnya.
7. Itulah alarm bawang, supaya hewan kapok memakannya.
8. Terus, potong cepat-cepat biar cepat selesai? Malah tambah parah.
9. Tiap tekanan pisau menyemprotkan butiran halus cairan bawang ke udara.
10. Pisau tumpul lebih parah lagi, karena bawangnya ditekan, bukan diiris.
11. Rahasianya: pisau tajam, potong pelan.
12. Semprotannya jauh lebih sedikit, dan nggak sampai setinggi mata.
13. Kamu tim pisau tajam atau tim kacamata renang? Tulis di komentar!
14. Subscribe Mitos Rumahan dan Fakta Unik, besok ada lagi!

## Peta visual (usulan)

| Baris | Teks layar (selain caption) | Visual / kamera | Transisi keluar |
|---|---|---|---|
| 0 | SREK! | **HOOK, frame 0:** Ibu sudah mengiris bawang merah (bunyi srek), air mata menyembur dua arah seperti air mancur; Budi tertawa, mengambil pisau, lalu ikut menyembur. Kamera close di pisau, naik ke wajah | match (bawang ke bawang) |
| 1 | ? | Bawang raksasa berwajah, memasang kuda-kuda/tameng (**re-hook**: misteri "membela diri") | dissolve |
| 2 | 2 BAHAN | Portal ke dalam bawang: dua kantong berwajah di ruang terpisah, lalu stik glow utuh di sampingnya (analogi) | whip |
| 3 | KRAK! | Pisau raksasa menembus, dinding sel pecah; stik glow dipatahkan bersamaan, menyala | match ke dunia mikro |
| 4 | | Dua tokoh kecil bertemu, bereaksi, berubah jadi awan gas berwajah licik yang melayang naik | lanjut |
| 5 | | Gas mendarat di permukaan mata raksasa (`drawEye`), menyentil ujung saraf (kilat kecil) | whip |
| 6 | BANJIR | Mata membanjiri gas dengan air mata seperti pemadam; gas terseret keluar (**jawaban misteri**) | dissolve |
| 7 | ALARM | Kembali ke dapur: tikus/kambing kartun menggigit bawang lalu kabur menangis | whip |
| 8 | X | **Kegagalan #1:** Budi memotong super cepat, mata langsung banjir lebih deras | lanjut |
| 9 | | Slow-motion: tiap tekanan pisau menyemprotkan butiran halus ke atas (`drawDrop` kecil) | whip |
| 10 | X X | **Kegagalan #2:** pisau tumpul berwajah lesu menekan bawang sampai gepeng, semprotan lebih besar | whip |
| 11 | TAJAM + PELAN | **Solusi:** Ibu mengasah/mengambil pisau tajam berkilau (`glint`), memotong pelan | lanjut |
| 12 | | Butiran hanya naik sedikit lalu jatuh, garis batas "TINGGI MATA" tidak tersentuh; Ibu tersenyum | whip |
| 13 | ? / split | Split: pisau tajam vs Budi pakai kacamata renang | dissolve |
| 14 | banner channel | Banner subscribe; 0,6 dtk terakhir kembali ke frame 0 (Ibu mengiris, "srek") untuk **loop** | (akhir) |

## Pemeriksaan aturan
- Tidak menyebut riset, sumber, universitas, atau jurnal di suara maupun layar. Angka studi (40x, 4x) diganti kata ("jauh lebih sedikit", "lebih parah").
- Tidak ada klaim "asam sulfat di mata" (penyederhanaan populer yang tidak didukung sumber utama); cukup "gas" dan "menyentil saraf".
- Tidak ada tips yang buktinya campur (merendam/mendinginkan bawang). Hanya pisau tajam + potong pelan (terukur di studi).
- Bukan topik kesehatan; tidak perlu disclaimer dokter.
- CTA lengkap: "Subscribe Mitos Rumahan dan Fakta Unik, besok ada lagi!"
