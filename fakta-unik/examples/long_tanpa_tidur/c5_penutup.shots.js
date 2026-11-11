// ---------- Bab 5: Penutup ----------
const SHOTS = [];
const END = WORDS[WORDS.length - 1].e + 1.4;

function boardLimits(ctx, t) {
  const items = [['TIDUR', c => { circle(c, 0, 0, 80); c.fillStyle = '#fff7c9'; c.fill(); circle(c, 30, -24, 70); c.fillStyle = '#24356e'; c.fill(); }], ['AIR', c => drop(c, 0, 10, 70)], ['MAKAN', c => drawPlate(c, 0, 60, .55, {})]];
  items.forEach(([lab, fn], i) => { const k = bk(t, ls(0) + .3 + i * .3, .4); if (k <= 0) return; scaled(ctx, 300 + i * 500, 330, k * 1.2, () => { circle(ctx, 0, 0, 170); fillStroke(ctx, '#24356e', 8); fn(ctx); }); tx(ctx, lab, 300 + i * 500, 610, 84, '#fff', 14); });
  const kb = bk(t, fw(0, 'batas') - .2, .4); if (kb > 0) tx(ctx, 'SEMUA PUNYA BATAS', 800, 790, 84 * kb, '#ffe14d', 14);
}
function gfxLimits(ctx, t) {
  const cards = [['air', 'TANPA AIR', 'hitungan hari', '#4ab3f0', c => drop(c, 0, -10, 80)], ['makanan', 'TANPA MAKAN', 'hitungan minggu', '#ff8a3d', c => drawPlate(c, 0, 40, .7, {})], ['tidur', 'TANPA TIDUR', 'otak kewalahan', '#7a4bc4', c => brain(c, 0, 0, .55, t, { fog: kAt(t, fw(1, 'kewalahan') - .2, .6) })]];
  cards.forEach(([w, a, b, col, fn], i) => { const k = bk(t, fw(1, w) - .3, .4); if (k <= 0) return; scaled(ctx, 300 + i * 500, 440, k, () => { card2(ctx, 0, 0, 440, 620, col, 44); ctx.save(); circle(ctx, 0, -110, 140); fillStroke(ctx, '#16244f', 8); fn(ctx); ctx.restore(); tx(ctx, a, 0, 110, 52, '#fff', 10); tx(ctx, b, 0, 210, 44, '#fff', 8); }); });
}
function sceneSleep7(ctx, lt, t) {
  const h = shake(t * .35, 2, 1, 2); const cam = { x: 700 + h[0], y: 900 + h[1], z: 1.25 + lt * .02, r: 0 };
  bedroomBG(ctx, t, cam, { dawn: 0, clockSpin: .1 }); applyCam(ctx, cam, 1);
  drawBed(ctx, 760, 1330, 1.6, { blanket: false });
  const hx = 450, hy = 1000; circle(ctx, hx, hy, 70); fillStroke(ctx, '#f6f2ea', 8);
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(hx + sd * 24 + 6, hy - 4, 14, Math.PI * .1, Math.PI * .9); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.beginPath(); ctx.arc(hx + 6, hy + 22, 16, .3, Math.PI - .3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx - 10, hy - 68); ctx.quadraticCurveTo(hx - 20, hy - 110, hx + 8, hy - 112); ctx.lineWidth = 6; ctx.stroke();
  const br = Math.sin(t * 1.6) * 8; ctx.beginPath(); ctx.moveTo(480, 1030 - br); ctx.quadraticCurveTo(800, 980 - br, 1190, 1020); ctx.lineTo(1190, 1170); ctx.lineTo(480, 1170); ctx.closePath(); fillStroke(ctx, '#4a8cff', 9);
  for (let i = 0; i < 3; i++) { const p = ((t * .5 + i * .33) % 1); ctx.save(); ctx.globalAlpha = Math.sin(p * Math.PI); text(ctx, 'Z', hx + 90 + p * 140 + i * 10, hy - 90 - p * 200, 50 + i * 12, '#9fc6ff', INK, 9); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0); const k = bk(t, fw(2, '7') - .3, .45);
  if (k > 0) scaled(ctx, 1500, 300, k, () => { card2(ctx, 0, 0, 520, 360, '#ffffff', 44); clockFace(ctx, -130, 0, 100, 22 + 7 * ease(inv(fw(2, '7'), fw(2, '7') + 1.5, t)), { wedge: [22] }); tx(ctx, '≥ 7', 110, -30, 110, '#2a3f8f'); tx(ctx, 'jam/malam', 110, 70, 40, INK); });
  const kd = bk(t, fw(2, 'dewasa') - .2, .4); if (kd > 0) scaled(ctx, 1500, 560, kd, () => { rrect(ctx, -230, -46, 460, 92, 46); fillStroke(ctx, '#ffd23a', 7); tx(ctx, 'orang dewasa', 0, 3, 44, INK); });
}
function boardSub(ctx, t) {
  const tS = fw(3, 'subscribe'); const subbed = t > tS + .35, press = t > tS + .2 && t < tS + .45 ? 1 : 0;
  drawSubBanner(ctx, 800, 360, 1.25 * bk(t, ls(3) + .1, .5) + .01, { subbed, press, ring: subbed ? Math.sin((t - tS - .35) * 22) * .35 * Math.exp(-(t - tS - .35) * 2) : 0 });
  const kc = bk(t, fw(3, 'komentar') - .2, .4); if (kc > 0) scaled(ctx, 800, 740, kc, () => { rrect(ctx, -380, -70, 760, 140, 30); fillStroke(ctx, '#ffffff', 8); ctx.beginPath(); ctx.moveTo(-300, 70); ctx.lineTo(-260, 120); ctx.lineTo(-230, 70); ctx.closePath(); fillStroke(ctx, '#fff', 8); tx(ctx, 'tulis di komentar', 0, 4, 48, INK); });
  if (subbed) { const r = rng(4); for (let i = 0; i < 40; i++) { const x0 = r() * 1600, v = 250 + r() * 400, ph = r() * TAU, d0 = r() * .6; const tt = t - tS - .35 - d0; if (tt < 0) continue; const y = -40 + tt * v; ctx.save(); ctx.translate(x0 + Math.sin(tt * 3 + ph) * 30, y); ctx.rotate(tt * 6 + ph); ctx.fillStyle = ['#ff5a3c', '#ffd23a', '#2cb35e', '#4a8cff', '#ff6fa8'][i % 5]; ctx.fillRect(-12, -7, 24, 14); ctx.restore(); } }
}

buildShots([
  [0, 'whip', HOST({ frame: 'wide', content: boardLimits })],
  [ls(1) - .1, 'whip', GFX(gfxLimits)],
  [ls(2) - .1, 'whip', sceneSleep7],
  [ls(3) - .1, 'whip', HOST({ frame: 'wide', content: boardSub, ibu: false, gest: [{ t: fw(3, 'subscribe') + .1, g: 'point' }] })],
  [fw(3, 'komentar') - .3, 'cut', HOST({ frame: 'two', content: boardSub, ibuGest: 'wave', ibuFace: { eyes: 'happy', mouth: 'grin' } })],
], END);
