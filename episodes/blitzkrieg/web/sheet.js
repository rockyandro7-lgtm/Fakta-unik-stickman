// Lembar aset (preview): semua tokoh, properti, dan latar env_perang.js dalam satu gambar 1080x1920.
const canvas = document.getElementById('c'); canvas.width = W; canvas.height = H; const ctx = canvas.getContext('2d');
const PIERRE = { cols: [PRG.fr, PRG.fr], hat: hatAdrian, belt: true }, HANS = { cols: [PRG.de, PRG.de], hat: hatStahl, belt: true };
function label(s, x, y, size = 34) { text(ctx, s, x, y, size, '#fff', INK, 9); }
window.drawSheet = () => {
  const t = 1.2;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffe9ad'); g.addColorStop(1, '#ffd27a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  text(ctx, 'ASET BLITZKRIEG (PREVIEW)', 540, 70, 54, '#fff', INK, 12);
  // tokoh
  drawStick(ctx, Object.assign({}, PIERRE, { x: 230, y: 600, s: 420, face: EXPR.sombong }));
  drawStick(ctx, Object.assign({}, HANS, { x: 560, y: 600, s: 420, flip: -1, face: EXPR.licik }));
  drawStick(ctx, Object.assign({}, HANS, { x: 870, y: 600, s: 420, face: EXPR.cemas, arms: { L: [.5, -.6], R: [.5, -.6] } }));
  label('Prancis', 230, 650); label('Jerman', 560, 650); label('Jerman (cemas)', 870, 650, 30);
  // tank
  drawTank(ctx, 300, 1010, .62, { t, roll: 40, face: EXPR.netral, bolt: 1, exhaust: 1 });
  drawTank(ctx, 790, 1010, .62, { t, roll: 40, face: { eyes: 'x', mouth: 'wobble' }, bolt: 0, snow: 1 });
  label('Tank (panji kilat menyala)', 300, 1060, 28); label('Tank terjebak salju (kilat padam)', 790, 1060, 28);
  // pesawat, radio, cangkir, bendera, karung pasir, papan
  drawPlane(ctx, 260, 1180, .62, { t, face: EXPR.bangga }); label('Pesawat tukik', 260, 1270, 28);
  drawRadio(ctx, 600, 1330, .55, { t, wave: 1 }); label('Radio lapangan', 600, 1370, 28);
  drawCup(ctx, 830, 1330, 1, { t, steam: 1 }); label('Kopi', 830, 1370, 28);
  drawFlagWave(ctx, 960, 1310, .55, t, ['#2a4fa8', '#ffffff', '#e2343a']);
  // latar mini
  const sc = [['Benteng', c => maginotScene(c, t, { x: 520, y: 1160, z: .64 })], ['Parit', c => { trenchBack(c, t, { x: 545, y: 1300, z: 1.0 }); trenchFront(c, t); drawSign(c, 545, PRT.ground + 120, .78, '1916', { rot: -.06 }); }],
    ['Lapangan', c => fieldScene(c, t, { x: 540, y: 1150, z: .86 })], ['Hutan', c => ardennesScene(c, t, { x: 540, y: 1280, z: 1.0 })], ['Salju', c => { snowScene(c, t, { x: 560, y: 1230, z: 1.0 }); drawSnowfall(c, t, 1); }]];
  const off = document.createElement('canvas'); off.width = W; off.height = H; const oc = off.getContext('2d');
  sc.forEach(([n, f], i) => { oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, W, H); f(oc); const x = 25 + i * 210, y = 1420; ctx.drawImage(off, x, y, 190, 338); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.strokeRect(x, y, 190, 338); label(n, x + 95, y + 375, 30); });
};
