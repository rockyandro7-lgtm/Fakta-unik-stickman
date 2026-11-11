// ---------- Bab 4: Makanan ----------
const SHOTS = [];
const END = WORDS[WORDS.length - 1].e + .6;
const plateIcon = (ctx) => drawPlate(ctx, 0, 60, .55, {});
const PATIENT = { cols: ['#7a4bc4', '#7a4bc4'], hat: 'none', belt: false };
const camAt = (t, lt, x, y, z, o = {}) => { const h = shake(t * .35, 2.5, 1, 2); return { x: x + h[0], y: y + h[1], z: z * (1 + (o.push == null ? .02 : o.push) * lt), r: o.r || 0 }; };
function clinicBG(ctx, t, cam) {
  applyCam(ctx, cam, .3); const g = ctx.createLinearGradient(0, -300, 0, 900); g.addColorStop(0, '#e6f6f3'); g.addColorStop(1, '#bfe6df'); ctx.fillStyle = g; ctx.fillRect(-2000, -2000, 6000, 2900);
  rrect(ctx, 200, 140, 260, 260, 20); fillStroke(ctx, '#fff', 8); rrect(ctx, 300, 180, 60, 180, 6); ctx.fillStyle = '#e5262a'; ctx.fill(); rrect(ctx, 240, 240, 180, 60, 6); ctx.fill();
  applyCam(ctx, cam, 1); const fy = 860; ctx.fillStyle = '#d7dde8'; ctx.fillRect(-2000, fy, 6000, 1500); ctx.strokeStyle = 'rgba(80,90,120,.25)'; ctx.lineWidth = 4; for (let i = -10; i < 30; i++) { const x = i * 160; ctx.beginPath(); ctx.moveTo(960 + (x - 960) * .55, fy); ctx.lineTo(x, 1500); ctx.stroke(); }
  rrect(ctx, -2000, fy - 30, 6000, 30, 0); fillStroke(ctx, '#ffffff', 5);
}
function batteryLiver(ctx, t, level) {
  liver(ctx, 560, 450, 1.7, 0);
  tx(ctx, 'HATI', 560, 700, 64, '#fff', 12);
  drawBattery(ctx, 1150, 330, 1.2, clamp(level), t); tx(ctx, 'glikogen', 1150, 500, 60, '#ffe14d', 10);
}
function gfxGlycogen(ctx, t) { const t0 = ls(1); scaled(ctx, 800, 450, bk(t, t0, .4) + .01, () => { ctx.translate(-800, -450); batteryLiver(ctx, t, .95); }); tx(ctx, 'cadangan gula', 1150, 200, 52 * kAt(t, fw(1, 'cadangan') - .1, .4) + .1, '#fff', 8); }
function gfxDrain(ctx, t) {
  const t0 = ls(2); const lv = lerp(.95, .05, ease(inv(fw(2, 'habis') - .3, fw(2, '24') + .5, t)));
  batteryLiver(ctx, t, lv);
  const h = lerp(0, 24, ease(inv(fw(2, 'habis') - .3, fw(2, '24') + .5, t))); clockFace(ctx, 1150, 640, 110, 7 + h, { wedge: [7] });
  tx(ctx, '12–24 jam', 1150, 800, 64 * bk(t, fw(2, '12') - .1, .4) + .1, '#fff', 10);
}
function gfxKetone(ctx, t) {
  const t0 = ls(3); const burn = ease(inv(fw(3, 'membakar') - .2, fw(3, 'lemak') + .6, t));
  for (let i = 0; i < 5; i++) fatCell(ctx, 220 + (i % 3) * 150, 330 + Math.floor(i / 3) * 170, 80 * (1 - burn * .45), t);
  tx(ctx, 'lemak', 370, 700, 60, '#ffe7a3', 10);
  liver(ctx, 1220, 420, 1.2, 0); tx(ctx, 'hati', 1220, 620, 56, '#fff', 10);
  const kk = kAt(t, fw(3, 'keton') - .5, .5);
  for (let i = 0; i < 10; i++) { const p = ((t * .35 + i * .1) % 1); const x = lerp(1220, 1500, p) + Math.sin(t * 2 + i) * 30, y = lerp(420, 120 + (i % 3) * 200, p); if (kk > 0) ketone(ctx, x, y, 34 * kk, t, i); }
  for (let i = 0; i < 6; i++) { const p = ((t * .5 + i * .17) % 1); if (burn > .2) { circle(ctx, lerp(500, 1100, p), 420 + Math.sin(p * 9 + i) * 40, 12); fillStroke(ctx, '#ffe7a3', 4); } }
  tx(ctx, 'KETON', 1360, 760, 80 * kk + .1, '#ffd23a', 12);
}
function gfxBrainFuel(ctx, t) {
  const t0 = ls(4); brain(ctx, 470, 420, 1.0, t, {});
  const sw = ease(inv(fw(4, 'keton') - .3, fw(4, 'kebutuhan') + .4, t));
  scaled(ctx, 1150, 420, 1, () => { rrect(ctx, -260, -60, 520, 120, 60); fillStroke(ctx, '#2b3566', 8); ctx.save(); rrect(ctx, -260, -60, 520, 120, 60); ctx.clip(); ctx.fillStyle = '#ff8fa3'; ctx.fillRect(-260, -60, 520, 120); ctx.fillStyle = '#ffd23a'; ctx.fillRect(-260, -60, 520 * .6 * sw, 120); ctx.restore(); rrect(ctx, -260, -60, 520, 120, 60); fillStroke(ctx, null, 8); });
  tx(ctx, 'gula', 1150, 290, 54, '#ff8fa3', 8); if (sw > .1) tx(ctx, 'keton: sebagian besar', 1150, 560, 56, '#ffd23a', 10);
  tx(ctx, 'saat puasa panjang', 1150, 680, 46 * kAt(t, fw(4, 'puasa') - .1, .4) + .1, '#b9c3ff', 8);
}
function boardDaysWeeks(ctx, t) {
  const t0 = ls(5); tx(ctx, 'BISA BERTAHAN', 800, 130, 70, '#fff', 12);
  barH(ctx, 520, 360, 860, 100, .12 * bk(t, t0 + .3, .4), '#4ab3f0', 'Tanpa air', 'hari');
  barH(ctx, 520, 560, 860, 100, .85 * ease(inv(fw(5, 'makan') - .2, fw(5, 'makan') + 1.2, t)), '#ff8a3d', 'Tanpa makan', kAt(t, fw(5, 'makan') + .8) > 0 ? 'minggu' : '');
}
function gfxMuscle(ctx, t) {
  const t0 = ls(6); const b = 1 - .75 * ease(inv(fw(6, 'otot') - .6, fw(6, 'otot') + 1.2, t));
  arm(ctx, 600, 520, 1.9, b);
  tx(ctx, 'protein dipecah', 1200, 360, 64 * bk(t, fw(6, 'protein') - .1, .4) + .1, '#fff', 10); tx(ctx, 'termasuk dari otot', 1200, 480, 54 * bk(t, fw(6, 'otot') - .2, .4) + .1, '#ffd23a', 10);
  tx(ctx, 'bertahan ≠ aman', 800, 120, 72 * bk(t, t0 + .2, .4) + .1, '#ff6a6a', 12);
}
function gfx1981(ctx, t) {
  const t0 = ls(7); tx(ctx, 'Irlandia Utara, 1981', 800, 140, 64 * bk(t, t0, .4) + .1, '#fff', 10);
  tx(ctx, 'mogok makan', 800, 240, 50 * bk(t, fw(7, 'mogok') - .1, .4) + .1, '#b9c3ff', 8);
  const x0 = 200, x1 = 1400, y = 470, d0 = lerp(x0, x1, 46 / 80), d1 = lerp(x0, x1, 73 / 80);
  rrect(ctx, x0, y - 30, x1 - x0, 60, 30); fillStroke(ctx, '#2b3566', 7);
  const kr = ease(inv(fw(7, '46') - .2, fw(7, '73') + .3, t)); if (kr > 0) { rrect(ctx, d0, y - 30, (d1 - d0) * kr, 60, 30); fillStroke(ctx, '#8a8fa8', 7); }
  for (let d = 0; d <= 80; d += 10) { const x = lerp(x0, x1, d / 80); line(ctx, x, y + 40, x, y + 64, 5, '#fff'); tx(ctx, String(d), x, y + 100, 36, '#b9c3ff', 0); }
  tx(ctx, '46–73 hari', 800, 680, 90 * bk(t, fw(7, '73') - .1, .4) + .1, '#fff', 14); tx(ctx, 'hari tanpa makan', 800, 330, 40, '#b9c3ff', 0);
}
function boardCase(ctx, t) { drawClipboard(ctx, 800, 450, .85, { items: ['Pria, 27 tahun', 'Puasa terapi', 'Diawasi dokter', 'Rawat jalan'], show: 1, strike: 0 }); }
function gfx382(ctx, t) {
  const t0 = ls(9); const d = Math.round(lerp(0, 382, ease(inv(fw(9, '382') - 1.2, fw(9, 'hari') + .2, t))));
  rrect(ctx, 460, 180, 680, 300, 40); fillStroke(ctx, '#1b2650', 10); tx(ctx, String(d), 800, 310, 190, d >= 382 ? '#7be05a' : '#ffe14d', 18); tx(ctx, 'HARI PUASA', 800, 430, 54, '#fff', 0);
  tx(ctx, 'pria, 27 tahun', 800, 110, 56 * bk(t, fw(9, '27') - .1, .4) + .1, '#fff', 10);
  const kd = bk(t, fw(9, 'pengawasan') - .2, .4); if (kd > 0) scaled(ctx, 800, 690, kd, () => { rrect(ctx, -370, -60, 740, 120, 60); fillStroke(ctx, '#2cb35e', 8); tx(ctx, 'di bawah pengawasan dokter', 0, 4, 46, '#fff'); });
}
function sceneCheckup(ctx, lt, t) {
  const cam = camAt(t, lt, 960, 560, 1.08); clinicBG(ctx, t, cam); applyCam(ctx, cam, 1);
  // scale platform
  rrect(ctx, 520, 990, 260, 40, 12); fillStroke(ctx, '#cfd7e6', 7); rrect(ctx, 600, 960, 100, 34, 8); fillStroke(ctx, '#fff', 6); tx(ctx, '✓', 650, 978, 26, '#2cb35e');
  const m = micro(t, 3), m2 = micro(t, 4, { lookAt: [-1, .4] });
  drawStick(ctx, C(PATIENT, { x: 650, y: 990, s: 600, arms: presenterArms(t, 2, false), face: { eyes: 'happy', mouth: 'smile', blink: m.blink } }));
  const hx = 1080, hy = 990 - .4 * 600;
  drawStick(ctx, C(LAB, { x: 1250, y: 1010, s: 600, flip: -1, arms: { L: presenterArms(t, 4, false).L, R: reach(1250, 1010, 600, -1, hx, hy, 1) }, face: { eyes: 'normal', mouth: 'smile', look: [-1, .4], blink: m2.blink } }));
  ctx.save(); ctx.translate(hx - 30, hy - 40); ctx.rotate(-.08); rrect(ctx, -62, -78, 124, 156, 10); fillStroke(ctx, '#fff', 6); for (let i = 0; i < 3; i++) line(ctx, -38, -34 + i * 30, 38 - (i % 2) * 20, -34 + i * 30, 5, '#9aa6bd'); ctx.restore(); circle(ctx, hx, hy, 18); ctx.fillStyle = INK; ctx.fill();
  const kc = bk(t, fw(10, 'normal') - .3, .4); if (kc > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); drawCheck(ctx, 1640, 220, 100 * kc, 1); }
  ctx.setTransform(1, 0, 0, 1, 0, 0); const kr = bk(t, fw(10, 'rawat') - .2, .4); if (kr > 0) scaled(ctx, 330, 140, kr, () => { rrect(ctx, -240, -60, 480, 120, 60); fillStroke(ctx, '#fff', 8); tx(ctx, 'rawat jalan', 0, 4, 52, INK); });
}
function boardNoCopy(ctx, t) { noSign(ctx, 800, 380, 260 * bk(t, ls(11) + .3, .4) + .1, 1); scaled(ctx, 800, 380, .55, () => drawPlate(ctx, 0, 60, 1, {})); tx(ctx, 'JANGAN DITIRU', 800, 760, 100 * bk(t, fw(11, 'ditiru') - .2, .4) + .1, '#ffe14d', 16); }
function gfxRefeedPlate(ctx, t) {
  const t0 = fw(12, 'makan') - .2; scaled(ctx, 620, 480, 1.6 * bk(t, t0, .4) + .01, () => drawPlate(ctx, 0, 60, 1, {}));
  warnSign(ctx, 1200, 420, 1.0 * bk(t, fw(12, 'berbahaya') - .2, .4) + .01); tx(ctx, 'setelah kelaparan panjang', 800, 120, 56, '#fff', 10);
}
function gfxRefeed(ctx, t) {
  const t0 = ls(13); tx(ctx, 'REFEEDING SYNDROME', 800, 110, 76 * bk(t, t0, .4) + .1, '#ff6a6a', 12);
  for (let i = 0; i < 3; i++) { const cx = 360 + i * 440, cy = 470; circle(ctx, cx, cy, 150); fillStroke(ctx, '#ffb3c4', 8); circle(ctx, cx - 30, cy - 20, 50); fillStroke(ctx, '#d9537a', 6); }
  const ions = ['P', 'K', 'Mg']; const k = ease(inv(fw(13, 'pergeseran') - .2, fw(13, 'elektrolit') + .5, t));
  for (let i = 0; i < 15; i++) { const ion = ions[i % 3], cx = 360 + (i % 3) * 440; const ang = i * 2.4 + t * .8; const r0 = 260, r1 = 70; const r = lerp(r0, r1, clamp(k * 1.2 - (i % 5) * .05)); const x = cx + Math.cos(ang) * r, y = 470 + Math.sin(ang) * r * .8; const hiP = ion === 'P' && kAt(t, fw(13, 'fosfat') - .1, .3) > 0; circle(ctx, x, y, hiP ? 34 : 26); fillStroke(ctx, hiP ? '#ffd23a' : '#9fd0ff', 5); tx(ctx, ion, x, y + 2, hiP ? 30 : 24, INK); }
  tx(ctx, 'cairan & elektrolit bergeser', 800, 720, 54 * kAt(t, fw(13, 'pergeseran') - .1, .4) + .1, '#fff', 10);
}
function scenePortion(ctx, lt, t) {
  const cam = camAt(t, lt, 960, 560, 1.08); clinicBG(ctx, t, cam); applyCam(ctx, cam, 1);
  rrect(ctx, 520, 860, 820, 40, 12); fillStroke(ctx, '#d9a56b', 7);
  scaled(ctx, 760, 860, .55, () => drawPlate(ctx, 0, 0, 1, {}));
  const m = micro(t, 6);
  drawStick(ctx, C(PATIENT, { x: 520, y: 1060, s: 560, arms: { L: presenterArms(t, 2, false).L, R: reach(520, 1060, 560, 1, 700, 830, -1) }, face: { eyes: 'normal', mouth: 'smile', look: [1, .5], blink: m.blink } }));
  drawStick(ctx, C(LAB, { x: 1320, y: 1060, s: 600, flip: -1, arms: armsAt(t, [{ t: ls(14) + .6, g: 'palmL' }], 4, presenterArms(t, 4, false)), face: { eyes: 'happy', mouth: 'smile', look: [-1, .3] } }));
  const kc = bk(t, fw(14, 'medis') - .3, .4); if (kc > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); drawCheck(ctx, 1640, 220, 100 * kc, 1); }
}

buildShots([
  [0, 'whip', TITLE(3, 'MAKAN', plateIcon, { c1: '#ff8a3d', c2: '#c4541e' })],
  [ls(1) - .1, 'whip', GFX(gfxGlycogen, { c1: '#5a1d2e', c2: '#2a0d16' })],
  [ls(2) - .1, 'cut', GFX(gfxDrain, { c1: '#5a1d2e', c2: '#2a0d16' })],
  [ls(3) - .1, 'whip', GFX(gfxKetone)],
  [ls(4) - .1, 'whip', GFX(gfxBrainFuel, { c1: '#3b2a6e', c2: '#1a1240' })],
  [ls(5) - .1, 'whip', HOST({ frame: 'wide', content: boardDaysWeeks })],
  [fw(5, 'tanpa', 1) - .1, 'cut', HOST({ frame: 'side', content: boardDaysWeeks })],
  [ls(6) - .1, 'whip', GFX(gfxMuscle, { c1: '#12806b', c2: '#0a4a46' })],
  [ls(7) - .1, 'whip', GFX(gfx1981, { c1: '#2b2f45', c2: '#141622' })],
  [ls(8) - .1, 'whip', HOST({ frame: 'med', content: boardCase })],
  [ls(9) - .1, 'whip', GFX(gfx382)],
  [ls(10) - .1, 'whip', sceneCheckup],
  [ls(11) - .1, 'whip', HOST({ frame: 'two', content: boardNoCopy, ibuFace: { browAng: .25, mouth: 'flat' }, ibuGest: 'raise' })],
  [ls(12) - .1, 'cut', HOST({ frame: 'close', content: false, browAng: .2 })],
  [fw(12, 'makan') - .2, 'whip', GFX(gfxRefeedPlate, { c1: '#5a1d2e', c2: '#2a0d16' })],
  [ls(13) - .1, 'whip', GFX(gfxRefeed, { c1: '#1d2c63', c2: '#101839' })],
  [ls(14) - .1, 'whip', scenePortion],
], END);
