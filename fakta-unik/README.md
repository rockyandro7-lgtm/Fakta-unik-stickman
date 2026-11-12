# fakta-unik (skill Claude)
Video Shorts stickman harian untuk channel Fakta Unik. Lihat SKILL.md untuk alur kerja.

Isi: `engine/` (render, timing Scribe, audio, template episode contoh "makanan panas dan kulkas"), `reference/topik_bank.md`,
`reference/teknik-visual-v5.md` (aturan kamera/ekspresi/transisi v5), `reference/analisis/` (hasil reverse engineering video referensi),
`tools/video_ref/` (alat analisis video frame per frame), `examples/demo-v5-teknik/` (reel uji semua teknik v5).
Kredit mesin animasi: Artem Novitckii (MIT) - https://github.com/artemnovitckii/claude-animation-skills

Instal di Claude Code: salin folder `fakta-unik` ke `~/.claude/skills/` (atau `.claude/skills/` di repo proyek).
Syarat: Node + Playwright/Chromium, ffmpeg, Python 3 (numpy, scipy, soundfile), dan konektor ElevenLabs di Claude.
