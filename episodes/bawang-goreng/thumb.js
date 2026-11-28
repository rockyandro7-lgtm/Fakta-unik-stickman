// Thumbnail episode bawang goreng dari aset video yang sama (env_bawanggoreng.js + shots.js: dapur()).
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
    const scene = (ctx, cam) => { dapur(ctx, 7.3, cam, { fire: 1, wc: .55, wn: 4, pile: { c: 1, n: 30, seed: 3, smoke: 1, face: { eyes: 'x', mouth: 'wobble', sweat: 1 } } });
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawStick(ctx, C(BUDI, { x: 900, y: 2250, s: 1800, shadow: false, flip: -1, armLen: 1.3, arms: { L: [.3, -.2], R: [.3, -.2] },
        face: { eyes: 'wide', mouth: 'o', browUp: .6, sweat: 1, look: [-.8, .5] } })); ctx.restore(); };
    const a = document.createElement('canvas'); a.width = 1080; a.height = 1920; const ca = a.getContext('2d');
    scene(ca, { x: 330, y: 1190, z: 1.75, r: 0 });
    ca.setTransform(1, 0, 0, 1, 0, 0);
    const g = ca.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, 'rgba(20,10,30,.75)'); g.addColorStop(1, 'rgba(20,10,30,0)'); ca.fillStyle = g; ca.fillRect(0, 0, 1080, 640);
    ca.save(); ca.translate(540, 240); ca.rotate(-.05); text(ca, 'DIANGKAT KUNING', 0, 0, 104, '#fff', INK, 26); ca.restore();
    ca.save(); ca.translate(540, 390); ca.rotate(-.05); text(ca, 'DI PIRING GOSONG?!', 0, 0, 100, '#ffb03a', INK, 26); ca.restore();
    const g3 = ca.createLinearGradient(0, 1400, 0, 1920); g3.addColorStop(0, 'rgba(20,10,30,0)'); g3.addColorStop(1, 'rgba(20,10,30,.65)'); ca.fillStyle = g3; ca.fillRect(0, 1400, 1080, 520);
    ca.save(); ca.translate(540, 1620); ca.rotate(-.04); text(ca, 'ternyata', 0, 0, 92, '#fff', INK, 22); text(ca, 'MASIH MASAK!', 0, 120, 116, '#ffd23a', INK, 24); ca.restore();
    const s = document.createElement('canvas'); s.width = 1080; s.height = 1920; const cs = s.getContext('2d');
    scene(cs, { x: 330, y: 1190, z: 1.75, r: 0 });
    const b = document.createElement('canvas'); b.width = 1280; b.height = 720; const cb = b.getContext('2d');
    cb.drawImage(s, 0, 560, 1080, 608, 0, 0, 1280, 720);
    const g2 = cb.createLinearGradient(0, 0, 0, 300); g2.addColorStop(0, 'rgba(20,10,30,.75)'); g2.addColorStop(1, 'rgba(20,10,30,0)'); cb.fillStyle = g2; cb.fillRect(0, 0, 1280, 300);
    cb.save(); cb.translate(640, 80); cb.rotate(-.03); text(cb, 'Bawang goreng gosong di piring?', 0, 0, 58, '#fff', INK, 14); cb.restore();
    return [a.toDataURL('image/jpeg', .92), b.toDataURL('image/jpeg', .92)];
  });
  fs.writeFileSync('thumbnail_shorts_1080x1920.jpg', Buffer.from(out[0].split(',')[1], 'base64'));
  fs.writeFileSync('thumbnail_1280x720.jpg', Buffer.from(out[1].split(',')[1], 'base64'));
  console.log('thumbnail ok');
  await browser.close();
})();
