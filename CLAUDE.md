# Repo Duru

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
