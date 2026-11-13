// Thumbnail episode bawang dari aset video yang sama (env_bawang.js + chars.js).
// Jalankan dari folder episode:  node thumb.js   -> thumbnail_shorts_1080x1920.jpg + thumbnail_1280x720.jpg
// (Windows: CHROME default = Chrome terpasang; Linux cloud: set CHROME atau hapus executablePath.)
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
    const t = 1.3;
    function scene(ctx, cam) {
      dapurBack(ctx, t, cam);
      const gI = [CUT_I - 120, GRIP_DN + 10], gB = [CUT_B + 120, GRIP_UP];
      drawStick(ctx, C(IBU, { x: IBUX, y: BK, s: 600, armLen: 1.3, legs: standL, arms: { L: armTo(IBUX, 1, CUT_I - 30, BTOP - 70, -1), R: armTo(IBUX, 1, gI[0], gI[1], -1) }, face: Object.assign({}, EXPR.sombong, { look: [.8, 0] }) }));
      drawStick(ctx, C(BUDI, { x: BUDX, y: BK, s: 600, flip: -1, armLen: 1.3, legs: standL, arms: { L: idleArms(t, 2).L, R: armTo(BUDX, -1, gB[0], gB[1], 1) }, face: { eyes: 'flinch', mouth: 'wobble', browAng: .3 } }));
      dapurMeja(ctx);
      drawTalenan(ctx, BI, TOP); drawTalenan(ctx, BB, TOP);
      drawSlicePile(ctx, PILE_I, BTOP, 30, .8, 3); drawSlicePile(ctx, PILE_B, BTOP, 18, .8, 5);
      drawBawang(ctx, CUT_I, BTOP, .5, {}); drawBawang(ctx, CUT_B, BTOP, .5, { face: Object.assign({}, EXPR.licik), t });
      drawPisau(ctx, gI[0], gI[1], .6, 0, { t: .3, shine: 1 }); drawPisau(ctx, gB[0], gB[1], .6, 0, { t, flip: -1, dull: true });
      drawTokohTears(ctx, BUDX, BK, 600, 1, .4, 2);
      glint(ctx, CUT_I - 10, BTOP - 100, 120, .17, 0);
    }
    // --- Shorts 1080x1920 ---
    const a = document.createElement('canvas'); a.width = 1080; a.height = 1920; const ca = a.getContext('2d');
    scene(ca, { x: 550, y: 1060, z: 1.0, r: 0 });
    ca.setTransform(1, 0, 0, 1, 0, 0);
    const g = ca.createLinearGradient(0, 0, 0, 600); g.addColorStop(0, 'rgba(20,10,30,.6)'); g.addColorStop(1, 'rgba(20,10,30,0)'); ca.fillStyle = g; ca.fillRect(0, 0, 1080, 600);
    ca.save(); ca.translate(540, 300); ca.rotate(-.05); text(ca, 'IBU vs BUDI', 0, 0, 160, '#fff', INK, 32); ca.restore();
    ca.save(); ca.translate(540, 1560); ca.rotate(-.04); text(ca, 'siapa yang nangis?', 0, 0, 100, '#ffd23a', INK, 22); ca.restore();
    // --- landscape 1280x720 ---
    const s = document.createElement('canvas'); s.width = 1080; s.height = 1920; const cs = s.getContext('2d');
    scene(cs, { x: 540, y: 1120, z: 1.05, r: 0 });
    const b = document.createElement('canvas'); b.width = 1280; b.height = 720; const cb = b.getContext('2d');
    cb.drawImage(s, 0, 700, 1080, 608, 0, 0, 1280, 720);
    const g2 = cb.createLinearGradient(0, 0, 0, 300); g2.addColorStop(0, 'rgba(20,10,30,.6)'); g2.addColorStop(1, 'rgba(20,10,30,0)'); cb.fillStyle = g2; cb.fillRect(0, 0, 1280, 300);
    cb.save(); cb.translate(640, 110); cb.rotate(-.03); text(cb, 'IBU vs BUDI: siapa yang nangis?', 0, 0, 74, '#fff', INK, 16); cb.restore();
    return [a.toDataURL('image/jpeg', .92), b.toDataURL('image/jpeg', .92)];
  });
  fs.writeFileSync('thumbnail_shorts_1080x1920.jpg', Buffer.from(out[0].split(',')[1], 'base64'));
  fs.writeFileSync('thumbnail_1280x720.jpg', Buffer.from(out[1].split(',')[1], 'base64'));
  console.log('thumbnail ok');
  await browser.close();
})();
