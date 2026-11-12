# Branding channel

Profile picture (profpic) channel **Mitos Rumahan & Fakta Unik** (@MitosRumahan), dibuat dari tokoh yang sama dengan video
(`drawStick` + preset `EXPR` di `fakta-unik/engine/template/web/`), supaya penonton mengenali Budi di feed dan di video.

| File | Isi |
|---|---|
| `avatar_A.png` | **Rekomendasi.** Budi close-up penasaran + "?" putih, latar kuning bersinar (format "Kenapa X?") |
| `avatar_B.png` | Duo Budi + Ibu, papan "MITOS?" (evolusi avatar lama; teks tidak terbaca di ukuran kecil) |
| `avatar_C.png` | Budi kaget + "?" kuning + kilau, latar merah (paling mencolok di feed) |
| `avatar_preview.png` | Pratinjau dipotong lingkaran di 260 px, 88 px, dan 40 px (ukuran di feed Shorts) |

Semua 800x800 PNG (syarat YouTube: min 98x98, maks 4 MB; dipotong lingkaran).
Render ulang: `node branding/render.js`.

Catatan: `drawChannelAvatar` di `env_home.js` (avatar di banner subscribe dalam video) masih desain lama.
Kalau profpic baru dipakai, samakan fungsi itu agar banner penutup video cocok dengan profpic.
