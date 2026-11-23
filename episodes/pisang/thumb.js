// Thumbnail episode pisang dari aset video yang sama (env_pisang.js + shots.js).
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
    const scene = (ctx, cam, bx, by, bs) => {
      dapur(ctx, 1, cam, { plate: true, yel: false, blk: false, fR: { eyes: 'happy', mouth: 'teeth', browUp: .5 }, armsR: { L: [.25, -.3], R: [1.75, .1] }, fB: EXPR.bangga });
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(20,10,30,.25)'; ctx.fillRect(0, 0, 1080, 1920);
      drawPisang(ctx, bx, by, bs, Object.assign({ rot: -.12, t: 1, peel: .55, glow: 1, face: { eyes: 'half', mouth: 'wobble', browAng: .35, look: [.3, .5] }, faceFlesh: EXPR.bangga }, BLK));
    };
    const a = document.createElement('canvas'); a.width = 1080; a.height = 1920; const ca = a.getContext('2d');
    scene(ca, { x: 540, y: 1100, z: 1.25, r: 0 }, 640, 1000, 2.9);
    ca.setTransform(1, 0, 0, 1, 0, 0);
    const g = ca.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, 'rgba(20,10,30,.65)'); g.addColorStop(1, 'rgba(20,10,30,0)'); ca.fillStyle = g; ca.fillRect(0, 0, 1080, 640);
    ca.save(); ca.translate(540, 250); ca.rotate(-.05); text(ca, 'PISANG KULKAS', 0, 0, 108, '#9ed8ff', INK, 26); ca.restore();
    ca.save(); ca.translate(540, 400); ca.rotate(-.05); text(ca, 'HITAM = BUSUK?', 0, 0, 116, '#ffd23a', INK, 26); ca.restore();
    ca.save(); ca.translate(540, 1600); ca.rotate(-.04); text(ca, 'tapi isinya', 0, 0, 92, '#fff', INK, 22); text(ca, 'MUDA!', 0, 120, 130, '#9dff7a', INK, 24); ca.restore();
    const s = document.createElement('canvas'); s.width = 1080; s.height = 1920; const cs = s.getContext('2d');
    scene(cs, { x: 540, y: 1130, z: 1.1, r: 0 }, 1000, 960, 1.7);
    const b = document.createElement('canvas'); b.width = 1280; b.height = 720; const cb = b.getContext('2d');
    cb.drawImage(s, 0, 640, 1080, 608, 0, 0, 1280, 720);
    const g2 = cb.createLinearGradient(0, 0, 0, 300); g2.addColorStop(0, 'rgba(20,10,30,.65)'); g2.addColorStop(1, 'rgba(20,10,30,0)'); cb.fillStyle = g2; cb.fillRect(0, 0, 1280, 300);
    cb.save(); cb.translate(640, 80); cb.rotate(-.03); text(cb, 'Pisang di kulkas: hitam = busuk?', 0, 0, 60, '#fff', INK, 14); cb.restore();
    return [a.toDataURL('image/jpeg', .92), b.toDataURL('image/jpeg', .92)];
  });
  fs.writeFileSync('thumbnail_shorts_1080x1920.jpg', Buffer.from(out[0].split(',')[1], 'base64'));
  fs.writeFileSync('thumbnail_1280x720.jpg', Buffer.from(out[1].split(',')[1], 'base64'));
  console.log('thumbnail ok');
  await browser.close();
})();
