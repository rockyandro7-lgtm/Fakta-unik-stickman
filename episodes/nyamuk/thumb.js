// Thumbnail episode nyamuk dari aset video yang sama (env_nyamuk.js + shots.js).
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
    const scene = (ctx, cam, n) => {
      teras(ctx, 1.3, cam, { fI: EXPR.lega, fR: { eyes: 'happy', mouth: 'teeth', browUp: .5 }, armsR: { L: [.25, -.3], R: [1.85, .1] }, fB: EXPR.meringis, armsB: swatArms(1.3, 1),
        glass: { r: { sugar: 6, fill: .9 } }, swarm: { n, rx: 230, ry: 200, s: .78, cy: HEADY - 40 } });
    };
    const a = document.createElement('canvas'); a.width = 1080; a.height = 1920; const ca = a.getContext('2d');
    scene(ca, { x: 640, y: 1020, z: 1.55, r: 0 }, 14);
    ca.setTransform(1, 0, 0, 1, 0, 0);
    const g = ca.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, 'rgba(20,10,30,.7)'); g.addColorStop(1, 'rgba(20,10,30,0)'); ca.fillStyle = g; ca.fillRect(0, 0, 1080, 640);
    ca.save(); ca.translate(540, 250); ca.rotate(-.05); text(ca, 'DIGIGIT TERUS', 0, 0, 112, '#fff', INK, 26); ca.restore();
    ca.save(); ca.translate(540, 400); ca.rotate(-.05); text(ca, 'DARAH MANIS?', 0, 0, 124, '#ff8a8a', INK, 26); ca.restore();
    const g3 = ca.createLinearGradient(0, 1380, 0, 1920); g3.addColorStop(0, 'rgba(20,10,30,0)'); g3.addColorStop(1, 'rgba(20,10,30,.6)'); ca.fillStyle = g3; ca.fillRect(0, 1380, 1080, 540);
    ca.save(); ca.translate(540, 1610); ca.rotate(-.04); text(ca, 'ternyata', 0, 0, 92, '#fff', INK, 22); text(ca, 'BUKAN GULA!', 0, 120, 120, '#ffd23a', INK, 24); ca.restore();
    const s = document.createElement('canvas'); s.width = 1080; s.height = 1920; const cs = s.getContext('2d');
    scene(cs, { x: 600, y: 1060, z: 1.0, r: 0 }, 12);
    const b = document.createElement('canvas'); b.width = 1280; b.height = 720; const cb = b.getContext('2d');
    cb.drawImage(s, 0, 520, 1080, 608, 0, 0, 1280, 720);
    const g2 = cb.createLinearGradient(0, 0, 0, 300); g2.addColorStop(0, 'rgba(20,10,30,.7)'); g2.addColorStop(1, 'rgba(20,10,30,0)'); cb.fillStyle = g2; cb.fillRect(0, 0, 1280, 300);
    cb.save(); cb.translate(640, 80); cb.rotate(-.03); text(cb, 'Digigit nyamuk terus: darah manis?', 0, 0, 58, '#fff', INK, 14); cb.restore();
    return [a.toDataURL('image/jpeg', .92), b.toDataURL('image/jpeg', .92)];
  });
  fs.writeFileSync('thumbnail_shorts_1080x1920.jpg', Buffer.from(out[0].split(',')[1], 'base64'));
  fs.writeFileSync('thumbnail_1280x720.jpg', Buffer.from(out[1].split(',')[1], 'base64'));
  console.log('thumbnail ok');
  await browser.close();
})();
