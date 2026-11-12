// Thumbnail episode kerupuk dari aset video yang sama (env_kerupuk.js + chars.js).
// Jalankan dari folder episode:  node thumb.js   -> thumbnail_shorts_1080x1920.jpg + thumbnail_1280x720.jpg
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.log('[err]', e.message));
  await page.goto('file://' + process.cwd() + '/web/index.html');
  await page.evaluate(async () => { await document.fonts.load('700 40px Poppins'); });
  const out = await page.evaluate(() => {
    const t = 1.3;
    function scene(ctx, cam, withIbu = true) {
      dapurBack(ctx, t, cam);
      if (withIbu) drawStick(ctx, C(IBU, { x: 140, y: KR.back, s: 600, legs: standL, arms: { L: [.3, -.1], R: [2.5, .3] }, face: Object.assign({}, EXPR.takjub, { look: [.8, .2] }) }));
      drawStick(ctx, C(BUDI, { x: 920, y: KR.back, s: 600, flip: -1, armLen: 1.3, legs: standL, arms: { L: [2.6, .4], R: reach(920, KR.back, 600, -1, 790, 1010, 1) }, face: Object.assign({}, EXPR.kaget, { look: [-.9, .4] }) }));
      dapurMeja(ctx);
      burst(ctx, KIN[0], KIN[1] - 70, 300, 16, '#ffe14d', 7);
      stoveWok(ctx, t, { heat: 1 }, c => drawKerupuk(c, KIN[0] - KR.wok[0], KIN[1] - KR.wok[1] - 25, 1.0, { p: 1, tilt: .6, t, seed: 2, face: Object.assign({}, EXPR.bangga) }));
      drawKerupuk(ctx, 765, 960, .8, { p: 0, tilt: 1, rot: .25, t, seed: 2 });
      glint(ctx, KIN[0] - 190, KIN[1] - 120, 130, .17, 0);
    }
    // --- Shorts 1080x1920 ---
    const a = document.createElement('canvas'); a.width = 1080; a.height = 1920; const ca = a.getContext('2d');
    scene(ca, { x: 610, y: 1000, z: 1.4, r: 0 });
    ca.setTransform(1, 0, 0, 1, 0, 0);
    const g = ca.createLinearGradient(0, 0, 0, 700); g.addColorStop(0, 'rgba(20,10,30,.55)'); g.addColorStop(1, 'rgba(20,10,30,0)'); ca.fillStyle = g; ca.fillRect(0, 0, 1080, 700);
    ca.save(); ca.translate(540, 250); ca.rotate(-.05); text(ca, 'KERAS', 0, 0, 210, '#fff', INK, 34); ca.restore();
    ca.save(); ca.translate(540, 450); ca.rotate(-.05); text(ca, 'jadi KRIUK?', 0, 0, 140, '#ffd23a', INK, 26); ca.restore();
    sfxText(ca, 'TOK!', 870, 820, 90, 1, '#fff', .15);
    // --- landscape 1280x720: potong pita adegan, teks di kiri ---
    const s = document.createElement('canvas'); s.width = 1080; s.height = 1920; const cs = s.getContext('2d');
    scene(cs, { x: 470, y: 1060, z: 1.05, r: 0 }, false);
    const b = document.createElement('canvas'); b.width = 1280; b.height = 720; const cb = b.getContext('2d');
    cb.drawImage(s, 0, 640, 1080, 608, 0, 0, 1280, 720);
    const g2 = cb.createLinearGradient(0, 0, 640, 0); g2.addColorStop(0, 'rgba(20,10,30,.55)'); g2.addColorStop(1, 'rgba(20,10,30,0)'); cb.fillStyle = g2; cb.fillRect(0, 0, 700, 720);
    cb.save(); cb.translate(320, 190); cb.rotate(-.05); text(cb, 'KERAS', 0, 0, 130, '#fff', INK, 24); cb.restore();
    cb.save(); cb.translate(320, 320); cb.rotate(-.05); text(cb, 'jadi KRIUK?', 0, 0, 84, '#ffd23a', INK, 18); cb.restore();
    return [a.toDataURL('image/jpeg', .92), b.toDataURL('image/jpeg', .92)];
  });
  fs.writeFileSync('thumbnail_shorts_1080x1920.jpg', Buffer.from(out[0].split(',')[1], 'base64'));
  fs.writeFileSync('thumbnail_1280x720.jpg', Buffer.from(out[1].split(',')[1], 'base64'));
  console.log('thumbnail ok');
  await browser.close();
})();
