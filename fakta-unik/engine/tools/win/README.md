# Render di Windows (tanpa bash/WSL)

Dipakai pertama kali 13-11-2026 untuk `episodes/bawang` di PC pemilik. Hasilnya sama dengan `engine/make.sh` di Linux cloud.

## Sekali per PC
```powershell
winget install --id Python.Python.3.12 -e --scope user
winget install --id OpenJS.NodeJS.LTS -e --scope user
winget install --id Gyan.FFmpeg -e --scope user
python -m pip install numpy scipy soundfile
# Playwright memakai Chrome yang sudah terpasang (tanpa unduh browser):
$env:PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1'
cd fakta-unik/engine/tools/win; npm install playwright
```
Chrome default: `C:\Program Files\Google\Chrome\Application\chrome.exe` (ubah lewat env `CHROME`).
`node_modules` boleh juga di tempat lain: set env `NODE_PATH` sebelum menjalankan `build.ps1`.

## Per episode
1. Suara + Scribe seperti di `SKILL.md`, lalu di folder episode:
   `python ../../fakta-unik/tools/sync/tighten.py audio/vo_raw.mp3 --target <dtk>`,
   `python ../../fakta-unik/tools/sync/mapwords.py scribe_raw.json [merge.json]`,
   `python ../../fakta-unik/tools/sync/snaponset.py scribe_words.json`.
2. Stills: `node ../../fakta-unik/engine/tools/win/render_win.js stills 0,5.5,12` (folder `stills/`).
3. Build penuh: `powershell -ExecutionPolicy Bypass -File fakta-unik/engine/tools/win/build.ps1 -Dir episodes/<nama> -Workers 8`
   (align -> audio.py -> render shot paralel -> concat -> mux + loudnorm). `-AudioOnly` = mix ulang suara saja.

Catatan: `render_win.js` sama dengan `engine/tools/render.js`, hanya membuka halaman lewat `pathToFileURL` (aman untuk spasi di path) dan memakai Chrome terpasang.
Render `bawang` (66 dtk, 17 shot) dengan 8 worker di 16 core: beberapa menit.
