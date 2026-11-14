// Thumbnail episode nasi-goreng dari aset video yang sama (env_nasi.js + shots.js hookScene).
// Jalankan dari folder episode:  node thumb.js   -> thumbnail_shorts_1080x1920.jpg + thumbnail_1280x720.jpg
const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const fs = require('fs'), path = require('path');
const CHROME = process.env.CHROME || (process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : undefined);
(async () => {
  const browser = await chromium.launch({ ...(CHROME ? { executablePath: CHROME } : {}), args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.log('[err]', e.message));
  await page.goto(pathToFileURL(path.join(process.cwd(), 'web', 'index.html')).href);
  await page.evaluate(async () => { await document.fonts.load('700 40px Poppins'); });
  const out = await page.evaluate(() => {
    const t = 4.5;   // setelah kata "bubur": wajah kaget
    function scene(ctx, cam) {
      hookScene(ctx, t, cam, t);
      ctx.save(); applyCam(ctx, cam, 1); propFace(ctx, WK[0], WK[1] - 52, 96, Object.assign({}, EXPR.meringis), { t }); ctx.restore();
    }
    const a = document.createElement('canvas'); a.width = 1080; a.height = 1920; const ca = a.getContext('2d');
    scene(ca, { x: 470, y: 1030, z: 1.15, r: 0 });
    ca.setTransform(1, 0, 0, 1, 0, 0);
    const g = ca.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, 'rgba(20,10,30,.65)'); g.addColorStop(1, 'rgba(20,10,30,0)'); ca.fillStyle = g; ca.fillRect(0, 0, 1080, 640);
    ca.save(); ca.translate(540, 250); ca.rotate(-.05); text(ca, 'CALON MERTUA', 0, 0, 120, '#fff', INK, 28); ca.restore();
    ca.save(); ca.translate(540, 400); ca.rotate(-.05); text(ca, 'DATANG 40 MENIT!', 0, 0, 104, '#ffd23a', INK, 24); ca.restore();
    ca.save(); ca.translate(540, 1560); ca.rotate(-.04); text(ca, 'nasi gorengnya', 0, 0, 96, '#fff', INK, 22); text(ca, 'malah jadi BUBUR', 0, 120, 96, '#ffd23a', INK, 22); ca.restore();
    const s = document.createElement('canvas'); s.width = 1080; s.height = 1920; const cs = s.getContext('2d');
    scene(cs, { x: 520, y: 1080, z: 1.1, r: 0 });
    const b = document.createElement('canvas'); b.width = 1280; b.height = 720; const cb = b.getContext('2d');
    cb.drawImage(s, 0, 650, 1080, 608, 0, 0, 1280, 720);
    const g2 = cb.createLinearGradient(0, 0, 0, 300); g2.addColorStop(0, 'rgba(20,10,30,.65)'); g2.addColorStop(1, 'rgba(20,10,30,0)'); cb.fillStyle = g2; cb.fillRect(0, 0, 1280, 300);
    cb.save(); cb.translate(640, 110); cb.rotate(-.03); text(cb, 'Calon mertua datang, nasi goreng jadi bubur', 0, 0, 60, '#fff', INK, 14); cb.restore();
    return [a.toDataURL('image/jpeg', .92), b.toDataURL('image/jpeg', .92)];
  });
  fs.writeFileSync('thumbnail_shorts_1080x1920.jpg', Buffer.from(out[0].split(',')[1], 'base64'));
  fs.writeFileSync('thumbnail_1280x720.jpg', Buffer.from(out[1].split(',')[1], 'base64'));
  console.log('thumbnail ok');
  await browser.close();
})();
