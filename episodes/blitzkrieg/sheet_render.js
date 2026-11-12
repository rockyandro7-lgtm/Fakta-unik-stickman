const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto('file://' + process.cwd() + '/web/sheet.html'); await p.evaluate(async () => { await document.fonts.load('700 40px Poppins'); });
  const d = await p.evaluate(() => { drawSheet(); return document.getElementById('c').toDataURL('image/jpeg', .92); });
  fs.writeFileSync(process.argv[2] || 'aset_preview.jpg', Buffer.from(d.split(',')[1], 'base64')); await b.close(); })();
