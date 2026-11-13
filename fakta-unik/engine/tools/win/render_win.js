// Versi Windows dari fakta-unik/engine/tools/render.js (path file:// aman untuk spasi, Chrome terpasang sebagai default).
// Jalankan dari folder episode: node render_win.js count | stills 1.5,3.2 | segments 0,4,8
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const { pathToFileURL } = require('url');
const fs = require('fs'), path = require('path');
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
(async () => {
  const mode = process.argv[2];
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('console', m => console.log('[page]', m.text()));
  page.on('pageerror', e => console.log('[err]', e.message));
  await page.goto(pathToFileURL(path.join(process.cwd(), 'web', 'index.html')).href);
  await page.evaluate(async () => { await document.fonts.load('700 40px Poppins'); await document.fonts.load('700 40px Lora'); await document.fonts.load('600 40px Lora'); });
  if (mode === 'count') { console.log(await page.evaluate(() => SHOTS.length)); await browser.close(); return; }
  const total = await page.evaluate(() => window.TOTAL_FRAMES);
  const fps = await page.evaluate(() => (typeof FPS !== 'undefined' ? FPS : 30));
  if (mode === 'stills') {
    const times = process.argv[3].split(',').map(Number);
    fs.mkdirSync('stills', { recursive: true });
    for (const t of times) {
      const d = await page.evaluate(f => { renderFrame(f); return grab(.85); }, Math.round(t * fps));
      fs.writeFileSync(`stills/s_${t.toFixed(2)}.jpg`, Buffer.from(d.split(',')[1], 'base64'));
    }
    console.log('stills', times.length);
  } else if (mode === 'segments') {
    const ids = process.argv[3].split(',').map(Number);
    const shots = await page.evaluate(() => window.SHOT_SPANS || SHOTS.map(s => [s.start, s.end]));
    fs.mkdirSync('seg', { recursive: true });
    for (const id of ids) {
      const f0 = Math.round(shots[id][0] * fps), f1 = id === shots.length - 1 ? total : Math.round(shots[id][1] * fps);
      const tmp = `seg/shot_${String(id).padStart(2, '0')}.part.mp4`, fin = tmp.replace('.part', '');
      const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(fps), tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
      for (let f = f0; f < f1; f++) {
        const d = await page.evaluate(f => { renderFrame(f); return grab(.95); }, f);
        if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
      }
      ff.stdin.end(); const code = await new Promise(r => ff.on('close', r));
      if (code === 0) fs.renameSync(tmp, fin); else console.log('ffmpeg failed', id);
      console.log('done shot', id, f1 - f0, 'frames');
    }
  }
  await browser.close();
})();
