// Thumbnail Palagan Ambarawa dari aset video yang sama (env_ambarawa.js + env_peta.js + chars.js).
// Jalankan dari folder episode (Windows):  set NODE_PATH ke fakta-unik/engine/tools/win/node_modules, lalu  node thumb.js
// -> thumbnail_shorts_1080x1920.jpg + thumbnail_1280x720.jpg
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const CHROME = process.env.CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
(async () => {
  const browser = await chromium.launch({ executablePath: fs.existsSync(CHROME) ? CHROME : undefined, args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.log('[err]', e.message));
  await page.goto(pathToFileURL(path.join(process.cwd(), 'web', 'index.html')).href);
  await page.evaluate(async () => { await document.fonts.load('700 40px Poppins'); });
  const out = await page.evaluate(() => {
    const t = 2.6;
    const KAGET = Object.assign({}, EXPR.kaget, { look: [-.8, .3], sweat: 1 });
    function scene(ctx, cam, o = {}) {
      petaAmbarawa(ctx, t, cam, o);
      arrows3(ctx, t, 1, 1, 1);
      drawArrow(ctx, EXT_L, 1, { col: MPC.red, w: 44, t }); drawArrow(ctx, EXT_R, 1, { col: MPC.red, w: 44, t });
      sekutu(ctx, t, () => KAGET);
    }
    function soe(ctx, x, y, s) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawStick(ctx, C(SOEDIRMAN, { x, y, s, shadow: false, armLen: 1.3, face: FACE_SOE0, legs: { L: [.12, -.05], R: [.14, -.06] }, arms: { L: POSE.hips.arms.L, R: reach(x, y, s, 1, x + s * .45, y - s * 1.05, 1) } }));
      ctx.restore();
    }
    // --- Shorts 1080x1920 ---
    const a = document.createElement('canvas'); a.width = 1080; a.height = 1920; const ca = a.getContext('2d');
    scene(ca, { x: 560, y: 900, z: 1.25, r: 0 });
    ca.setTransform(1, 0, 0, 1, 0, 0);
    const g = ca.createLinearGradient(0, 0, 0, 700); g.addColorStop(0, 'rgba(20,10,30,.65)'); g.addColorStop(1, 'rgba(20,10,30,0)'); ca.fillStyle = g; ca.fillRect(0, 0, 1080, 700);
    ca.save(); ca.translate(540, 200); ca.rotate(-.04); text(ca, 'UMUR 29', 0, 0, 190, '#ffd23a', INK, 34); ca.restore();
    ca.save(); ca.translate(540, 370); ca.rotate(-.04); text(ca, 'USIR PEMENANG', 0, 0, 104, '#fff', INK, 22); ca.restore();
    ca.save(); ca.translate(540, 490); ca.rotate(-.04); text(ca, 'PERANG DUNIA II', 0, 0, 104, '#fff', INK, 22); ca.restore();
    soe(ca, 250, 2050, 1150);
    sfxText(ca, 'SUPIT URANG!', 770, 1500, 74, 1, '#fff', .08);
    // --- landscape 1280x720 ---
    const b = document.createElement('canvas'); b.width = 1280; b.height = 720; const cb = b.getContext('2d');
    const s = document.createElement('canvas'); s.width = 1080; s.height = 1920; const cs = s.getContext('2d');
    scene(cs, { x: 380, y: 900, z: 1.0, r: 0 }, { labels: { ambarawa: 0 } });
    cb.drawImage(s, 0, 600, 1080, 608, 0, 0, 1280, 720);
    const g2 = cb.createLinearGradient(0, 0, 760, 0); g2.addColorStop(0, 'rgba(20,10,30,.7)'); g2.addColorStop(1, 'rgba(20,10,30,0)'); cb.fillStyle = g2; cb.fillRect(0, 0, 800, 720);
    cb.save(); cb.translate(360, 150); cb.rotate(-.04); text(cb, 'UMUR 29', 0, 0, 120, '#ffd23a', INK, 22); cb.restore();
    cb.save(); cb.translate(360, 260); cb.rotate(-.04); text(cb, 'USIR PEMENANG PD II', 0, 0, 60, '#fff', INK, 14); cb.restore();
    soe(cb, 220, 1250, 820);
    return [a.toDataURL('image/jpeg', .92), b.toDataURL('image/jpeg', .92)];
  });
  fs.writeFileSync('thumbnail_shorts_1080x1920.jpg', Buffer.from(out[0].split(',')[1], 'base64'));
  fs.writeFileSync('thumbnail_1280x720.jpg', Buffer.from(out[1].split(',')[1], 'base64'));
  console.log('thumbnail ok');
  await browser.close();
})();
