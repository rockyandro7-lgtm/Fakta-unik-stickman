# Naskah: Nasi goreng calon mertua (14-11-2026)

Pola naskah ref-02 dengan bentuk taruhan **tamu datang mendadak** (dipilih pemilik; sengaja bukan lomba supaya format tidak berulang).
Tokoh baru: **Rani**, kakak Budi (rambut kuncir kuda, baju oranye), dipilih pemilik supaya bervariasi. Pengejek: Budi (satu kalimat).
Penjelasan dipendekkan atas arahan pemilik: mekanisme diucapkan Ibu dalam 2 kalimat (sekitar 25 kata), bukan 5 kalimat narator.
186 kata, suara final 67,59 dtk, video 68,2 dtk, 17 shot. Tanpa CTA; kalimat terakhir menyambung ke kalimat 0 (loop).

## Naskah (`script.json`)
0. Calon mertua Rani datang 40 menit lagi, dan nasi gorengnya malah jadi bubur.
1. Padahal tadi pagi Ibu cuma pesan satu hal sebelum ke pasar: "Pakai nasi yang di kulkas, ya!"
2. Rani buka kulkas. Nasinya dingin, keras, kering, kayak kerikil.
3. "Masa calon mertua dikasih nasi sisa?"
4. Jadi dia masak nasi baru. Pulen, wangi, masih ngepul.
5. Nasi masuk wajan. Diaduk, mulai nempel.
6. Diaduk lagi, butirnya pecah, makin lengket.
7. Budi lewat, ngintip wajan: "Kak, ini nasi goreng apa bubur ayam?"
8. Tinggal 30 menit.
9. Rani nambah minyak, apinya digedein. Malah gosong di bawah, lembek di atas.
10. Tinggal 10 menit.
11. Dengan muka pasrah, dia ambil nasi kerikil dari kulkas. Masuk wajan.
12. Dan anehnya, butirnya langsung buyar. Satu-satu. Nggak ada yang nempel.
13. Ibu pulang, lihat wajan pertama, terus geleng-geleng.
14. "Nasi baru itu permukaannya masih basah dan lembek, Ran. Diaduk, ya hancur jadi lem."
15. "Semalaman di kulkas, butirnya mengeras dan permukaannya kering. Jadi kegoreng, bukan kekukus."
16. Calon mertuanya nambah dua kali. Dan Rani belajar soal nasi kemarin dengan cara paling deg-degan:
    (loop: whip-pan kembali ke komposisi frame 0)

## Struktur yang diuji (bandingkan setelah tayang)
- Frame 0 = krisis (bubur + jam), jawaban TIDAK dibocorkan (kebalikan Kerupuk, yang kehilangan ~30% penonton di dtk 3-8).
- Gagal palsu dua lapis: nasi kulkas tampak paling buruk ("kerikil"), nasi baru tampak sempurna (pulen, ngepul) tapi gagal.
- Penanda waktu 40 -> 30 -> 10 menit sebagai mesin tempo.
- Mekanisme hanya di kalimat 14-15 (~8 dtk, ~12% durasi), lewat dialog Ibu + gelembung lup butir nasi.
- Cek di kurva retensi: apakah ada penurunan di dtk ~51-62 (penjelasan) dan di akhir.

## Aset baru (`web/env_nasi.js`)
`RANI` (`hairRani`), calon mertua `BAPAK_M` (`peci`) + `IBU_M` (`sanggul`), `drawNasiWok` (mush/burn/block/grains/toss dalam satu fungsi),
`drawGrain`, `drawSutil`, `drawWadahNasi`, `drawPiringNG`, `drawBotolMinyak`, `drawButir` (butir raksasa: wet/hard/squash/steam/sizzle), `drawLup`. Tata letak `NG`, palet `NGP`.

## Catatan teknis
- Scribe menulis angka sebagai digit ("40"), jadi naskah memakai digit (aturan SKILL). `merge.json`: "gak" -> "Nggak".
- Render ulang di Windows: `powershell -ExecutionPolicy Bypass -File fakta-unik/engine/tools/win/build.ps1 -Dir episodes/nasi-goreng -Workers 8`.
