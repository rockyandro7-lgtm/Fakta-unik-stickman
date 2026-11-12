// Thumbnail episode Blitzkrieg dari aset video yang sama (env_peta.js + env_perang.js + chars.js).
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
    const t = wt(13, 'laut') + .3;
    function scene(ctx, cam) {
      mapLayer(ctx, t, cam, { labels: { sedan: 1, dunkirk: 1 } });
      const p = pock(t); drawPocket(ctx, p.c[0], p.c[1], p.rx, p.ry, t, 1);
      for (let i = 0; i < 7; i++) { const a = -1.25 + i * .5, x = p.c[0] + Math.cos(a) * (p.rx + 90), y = p.c[1] + Math.sin(a) * (p.ry + 80); if (y < 380 && x < 500) continue; drawTank(ctx, x, y + 24, .22, { t, dir: Math.cos(a) > 0 ? -1 : 1, face: EXPR.licik, bolt: 1 }); }
      const pos = alliesPos(t); alliesAt(ctx, pos[0], pos[1], t, Object.assign({}, EXPR.kaget, { look: [.8, .3] }), { spread: .8 });
    }
    function pierreBig(ctx, x, y, s) {   // close-up tokoh di ruang layar, kepala mengintip dari bawah
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawStick(ctx, C(PIERRE, { x, y, s, shadow: false, face: Object.assign({}, EXPR.kaget, { look: [.6, -.6] }), headTilt: -.1, arms: { L: [.3, -.2], R: [.3, -.2] } }));
      ctx.restore();
    }
    // --- Shorts 1080x1920 ---
    const a = document.createElement('canvas'); a.width = 1080; a.height = 1920; const ca = a.getContext('2d');
    scene(ca, { x: 640, y: 760, z: .9, r: 0 });
    ca.setTransform(1, 0, 0, 1, 0, 0);
    const g = ca.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, 'rgba(20,10,30,.6)'); g.addColorStop(1, 'rgba(20,10,30,0)'); ca.fillStyle = g; ca.fillRect(0, 0, 1080, 640);
    ca.save(); ca.translate(540, 210); ca.rotate(-.04); text(ca, 'KALAH', 0, 0, 200, '#fff', INK, 34); ca.restore();
    ca.save(); ca.translate(540, 400); ca.rotate(-.04); text(ca, '6 MINGGU?!', 0, 0, 150, '#ffd23a', INK, 28); ca.restore();
    pierreBig(ca, 300, 2620, 1500);
    sfxText(ca, 'TERKEPUNG!', 760, 1180, 84, 1, MPC.red === '#e2343a' ? '#fff' : '#fff', .1);
    // --- landscape 1280x720 ---
    const b = document.createElement('canvas'); b.width = 1280; b.height = 720; const cb = b.getContext('2d');
    const s = document.createElement('canvas'); s.width = 1080; s.height = 1920; const cs = s.getContext('2d');
    scene(cs, { x: 560, y: 760, z: .9, r: 0 });
    cb.drawImage(s, 0, 420, 1080, 608, 0, 0, 1280, 720);
    const g2 = cb.createLinearGradient(0, 0, 700, 0); g2.addColorStop(0, 'rgba(20,10,30,.65)'); g2.addColorStop(1, 'rgba(20,10,30,0)'); cb.fillStyle = g2; cb.fillRect(0, 0, 760, 720);
    cb.save(); cb.translate(330, 170); cb.rotate(-.04); text(cb, 'KALAH', 0, 0, 130, '#fff', INK, 24); cb.restore();
    cb.save(); cb.translate(330, 300); cb.rotate(-.04); text(cb, '6 MINGGU?!', 0, 0, 92, '#ffd23a', INK, 18); cb.restore();
    cb.save(); drawStick(cb, C(PIERRE, { x: 230, y: 1170, s: 820, shadow: false, face: Object.assign({}, EXPR.kaget, { look: [.7, -.5] }), arms: { L: [.3, -.2], R: [.3, -.2] } })); cb.restore();
    return [a.toDataURL('image/jpeg', .92), b.toDataURL('image/jpeg', .92)];
  });
  fs.writeFileSync('thumbnail_shorts_1080x1920.jpg', Buffer.from(out[0].split(',')[1], 'base64'));
  fs.writeFileSync('thumbnail_1280x720.jpg', Buffer.from(out[1].split(',')[1], 'base64'));
  console.log('thumbnail ok');
  await browser.close();
})();
