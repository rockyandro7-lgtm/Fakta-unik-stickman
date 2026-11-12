// node branding/render.js  -> branding/avatar_A.png, _B, _C (800x800) + avatar_preview.png (lingkaran, ukuran besar & kecil)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const dir = __dirname; const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage(); p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto('file://' + dir + '/avatar.html'); await p.evaluate(() => document.fonts.load('700 40px Poppins'));
  const urls = await p.evaluate(() => renderAll()); const names = ['A', 'B', 'C'];
  urls.forEach((u, i) => fs.writeFileSync(path.join(dir, `avatar_${names[i]}.png`), Buffer.from(u.split(',')[1], 'base64')));
  // pratinjau: tiap opsi dipotong lingkaran di 260px, 88px (kanal) dan 40px (feed Shorts)
  const html = `<body style="margin:0;background:#fff;font:600 22px sans-serif;padding:24px">` + urls.map((u, i) =>
    `<div style="display:flex;align-items:center;gap:28px;margin-bottom:24px"><b style="width:30px">${names[i]}</b>` +
    [260, 88, 40].map(s => `<img src="${u}" style="width:${s}px;height:${s}px;border-radius:50%">`).join('') +
    `<div style="background:#0f0f0f;padding:14px;border-radius:12px;display:flex;align-items:center;gap:10px"><img src="${u}" style="width:40px;height:40px;border-radius:50%"><span style="color:#fff;font-size:18px">@MitosRumahan</span></div></div>`).join('');
  const q = await b.newPage({ viewport: { width: 900, height: 940 } }); await q.setContent(html);
  await q.screenshot({ path: path.join(dir, 'avatar_preview.png'), fullPage: true });
  await b.close(); console.log('ok');
})();
