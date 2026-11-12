// ---------- Bab 3: Air ----------
const SHOTS = [];
const END = WORDS[WORDS.length - 1].e + .6;
const dropIcon = (ctx) => drop(ctx, 0, 20, 70, '#4ab3f0');
const camAt = (t, lt, x, y, z, o = {}) => { const h = shake(t * .35, 2.5, 1, 2); return { x: x + h[0], y: y + h[1], z: z * (1 + (o.push == null ? .02 : o.push) * lt), r: o.r || 0 }; };

function gfxBody60(ctx, t) {
  const t0 = ls(1); bodySil(ctx, 520, 470, 1.05 * bk(t, t0, .4) + .01, .6 * ease(inv(t0 + .3, fw(1, '60') + .5, t)), t);
  tx(ctx, '60%', 1120, 380, 230 * bk(t, fw(1, '60') - .1, .45) + .1, '#4ab3f0', 24);
  tx(ctx, 'tubuh orang dewasa', 1120, 560, 60, '#fff', 10); tx(ctx, 'hingga sekitar', 1120, 210, 50, '#b9c3ff', 8);
}
function gfxOrgans(ctx, t) {
  const t0 = ls(2);
  const rows = [['otak', 'Otak', 73, c => brain(c, 0, 0, .32, t, {})], ['jantung', 'Jantung', 73, c => drawHeart(c, 0, 10, .62, t, {})], ['paruparu', 'Paru-paru', 83, c => lungs(c, 0, 20, .62)]];
  rows.forEach(([w, lab, v, ic], i) => { const y = 220 + i * 230, k = bk(t, fw(2, w) - .15, .4); if (k <= 0) return; scaled(ctx, 230, y, k, () => { circle(ctx, 0, 0, 95); fillStroke(ctx, '#24356e', 7); ic(ctx); }); tx(ctx, lab, 470, y, 56, '#fff', 10, 'center');
    const vt = i < 2 ? fw(2, '73') : fw(2, '83'); barH(ctx, 650, y, 760, 80, (v / 100) * ease(inv(vt - .2, vt + .5, t)), '#4ab3f0', '', kAt(t, vt) > 0 ? v + '%' : ''); });
}
function boardJobs(ctx, t) {
  const items = [['suhu', 'atur suhu', c => { rrect(c, -26, -130, 52, 200, 26); fillStroke(c, '#fff', 7); circle(c, 0, 90, 48); fillStroke(c, '#e5262a', 7); rrect(c, -10, -60, 20, 140, 10); c.fillStyle = '#e5262a'; c.fill(); }],
    ['gizi', 'bawa zat gizi', c => { for (let i = 0; i < 3; i++) { circle(c, -70 + i * 70, 0, 34); fillStroke(c, ['#7be05a', '#ffd23a', '#ff8a5b'][i], 6); } line(c, -110, 70, 110, 70, 10, '#4ab3f0'); }],
    ['membuang', 'buang sisa', c => kidney(c, 0, 0, .9)]];
  items.forEach(([w, lab, fn], i) => { const k = bk(t, fw(3, w) - .2, .4); if (k <= 0) return; scaled(ctx, 300 + i * 500, 360, k * 1.2, () => { circle(ctx, 0, 0, 170); fillStroke(ctx, '#24356e', 8); fn(ctx); }); tx(ctx, lab, 300 + i * 500, 640, 70, '#fff', 12); });
}
function gfxLoss(ctx, t) {
  const t0 = ls(4);
  const items = [['napas', 'napas', c => { drawStick(c, C(BUDI, { x: -40, y: 170, s: 300, shadow: false, face: { eyes: 'normal', mouth: 'o' } })); for (let i = 0; i < 3; i++) { const p = (t * .8 + i * .33) % 1; puff(c, 40 + p * 120, -60 - p * 40, 26 + p * 20, t, '#e9f6ff', i, 1 - p); } }],
    ['keringat', 'keringat', c => { drawStick(c, C(BUDI, { x: 0, y: 170, s: 300, shadow: false, face: { eyes: 'squint', mouth: 'flat' } })); for (let i = 0; i < 3; i++) { const p = (t * .9 + i * .33) % 1; drop(c, -70 + i * 70, -110 + p * 120, 16, '#8fd8ff'); } }],
    ['urine', 'urine', c => toilet(c, 0, 60, 1.0)]];
  items.forEach(([w, lab, fn], i) => { const k = bk(t, fw(4, w) - .15, .4); if (k <= 0) return; scaled(ctx, 300 + i * 500, 420, k, () => { circle(ctx, 0, 0, 200); fillStroke(ctx, '#24356e', 8); ctx.save(); circle(ctx, 0, 0, 196); ctx.clip(); fn(ctx); ctx.restore(); }); tx(ctx, lab, 300 + i * 500, 720, 70, '#fff', 12); });
  tx(ctx, 'AIR KELUAR SETIAP HARI', 800, 110, 66, '#ffe14d', 12);
}
function gfxDehyd(ctx, t) {
  const t0 = ls(5);
  tx(ctx, 'haus', 260, 200, 80 * bk(t, fw(5, 'haus') - .1, .4) + .1, '#fff', 12);
  const kg = kAt(t, fw(5, 'urine') - .2, 1.2); urineChart(ctx, 160, 470, 760, kg); if (kg > 0) tx(ctx, 'urine makin gelap →', 540, 610, 50, '#fff', 8);
  const kp = bk(t, fw(5, 'pusing') - .15, .4);
  if (kp > 0) scaled(ctx, 1260, 520, kp, () => { const sw = Math.sin(t * 3) * .08; drawStick(ctx, C(BUDI, { x: 0, y: 300, s: 560, shadow: false, lean: sw, headTilt: sw * 1.5, arms: { L: [.5, -1.1], R: [.6, 1.0] }, face: { eyes: 'spiral', mouth: 'flat', t } })); for (let i = 0; i < 3; i++) star5(ctx, Math.cos(t * 3 + i * 2.1) * 140, -330 + Math.sin(t * 3 + i * 2.1) * 30, 22, t, '#ffe14d'); });
}
function gfxSevere(ctx, t) {
  const t0 = ls(6); tx(ctx, 'DEHIDRASI BERAT', 800, 110, 70 * bk(t, t0, .4) + .1, '#ff6a6a', 12);
  const items = [['kebingungan', 'kebingungan', c => { qmark(c, -40, 0, 170, -.2); qmark(c, 60, -20, 130, .3); }], ['ginjal', 'gangguan ginjal', c => { kidney(c, 0, 0, 1.1); warnSign(c, 90, -90, .3); }], ['darurat', 'kondisi darurat', c => drawIGD(c, 0, 190, .42, t)]];
  items.forEach(([w, lab, fn], i) => { const k = bk(t, fw(6, w) - .15, .4); if (k <= 0) return; scaled(ctx, 300 + i * 500, 440, k, () => { card2(ctx, 0, 0, 400, 420, '#24356e', 40); ctx.save(); rrect(ctx, -196, -206, 392, 412, 36); ctx.clip(); fn(ctx); ctx.restore(); }); tx(ctx, lab, 300 + i * 500, 720, 52, '#fff', 10); });
}
function gfx3days(ctx, t) {
  const t0 = ls(8); tx(ctx, 'PERKIRAAN', 800, 110, 60, '#b9c3ff', 10);
  calendarN(ctx, 800, 420, 1.3 * bk(t, t0, .4) + .01, 3, 3 * ease(inv(t0 + .3, fw(8, '3') + .6, t)), 'TANPA AIR');
  tx(ctx, '± 3 HARI', 800, 760, 120 * bk(t, fw(8, '3') - .1, .4) + .1, '#ffe14d', 18);
}
function gfxConditions(ctx, t) {
  const t0 = ls(9); const kL = bk(t, t0, .4), kR = bk(t, fw(9, 'sedikit') - .2, .4);
  if (kL > 0) scaled(ctx, 420, 450, kL, () => { card2(ctx, 0, 0, 640, 640, '#ff8a3d', 40); sun(ctx, -170, -190, 70, t); const d = t * 400; const w = walkCycle(d, 330, 1, { amp: .45 }); drawStick(ctx, C(BUDI, { x: 0, y: 200, s: 330, legs: w.legs, arms: w.arms, bob: w.bob, footDir: 1, lean: .12, face: { eyes: 'squint', mouth: 'o' } })); sweat(ctx, 80, -140, 26); tx(ctx, 'lebih singkat', 0, 260, 52, '#fff', 10); });
  if (kR > 0) scaled(ctx, 1180, 450, kR, () => { card2(ctx, 0, 0, 640, 640, '#4ab3f0', 40); drawCloud(ctx, -150, -200, 80, 3); drawStick(ctx, C(BUDI, { x: 0, y: 200, s: 330, arms: presenterArms(t, 2, false), face: { eyes: 'happy', mouth: 'smile' } })); tx(ctx, 'sedikit lebih lama', 0, 260, 50, '#fff', 10); });
}
function gfxLiters(ctx, t) {
  const t0 = ls(11); tx(ctx, 'kebutuhan cairan total per hari', 800, 90, 54, '#fff', 10);
  const kp = bk(t, fw(11, 'pria') - .3, .4), kw = bk(t, fw(11, 'wanita') - .3, .4);
  if (kp > 0) { scaled(ctx, 470, 470, kp, () => { bottle(ctx, 120, 0, 1.0, .92 * ease(inv(fw(11, '37') - .4, fw(11, '37') + .6, t)), '#4ab3f0', t); drawStick(ctx, C(BUDI, { x: -150, y: 260, s: 380, face: { eyes: 'happy', mouth: 'smile' } })); }); tx(ctx, '3,7 liter', 470, 760, 80, '#ffe14d', 12); tx(ctx, 'pria', 330, 220, 54, '#fff', 8); }
  if (kw > 0) { scaled(ctx, 1150, 470, kw, () => { bottle(ctx, 120, 0, 1.0, .68 * ease(inv(fw(11, '27') - .4, fw(11, '27') + .6, t)), '#4ab3f0', t); drawStick(ctx, C(IBU, { x: -150, y: 260, s: 380, face: { eyes: 'happy', mouth: 'smile' } })); }); tx(ctx, '2,7 liter', 1150, 760, 80, '#ffe14d', 12); tx(ctx, 'wanita', 1010, 220, 54, '#fff', 8); }
  tx(ctx, 'National Academies (AS)', 1380, 830, 34, '#b9c3ff', 0);
}
function gfxFood20(ctx, t) {
  const t0 = ls(12); const k = ease(inv(fw(12, 'makanan') - .2, fw(12, '20') + .4, t));
  scaled(ctx, 520, 450, 1.2 * bk(t, t0, .4) + .01, () => { circle(ctx, 0, 0, 230); ctx.fillStyle = '#4ab3f0'; ctx.fill(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 230, -Math.PI / 2, -Math.PI / 2 + TAU * .2 * k); ctx.closePath(); ctx.fillStyle = '#7be05a'; ctx.fill(); circle(ctx, 0, 0, 230); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke(); circle(ctx, 0, 0, 120); fillStroke(ctx, '#16244f', 8); });
  if (k > .3) { tx(ctx, '≈20%', 1150, 300, 130, '#7be05a', 18); tx(ctx, 'dari makanan', 1150, 430, 56, '#fff', 10); }
  tx(ctx, 'sisanya dari minuman', 1150, 620, 46 * kAt(t, fw(12, '20') + .3, .4) + .1, '#4ab3f0', 8);
  scaled(ctx, 1150, 760, .5 * kAt(t, fw(12, 'makanan') - .1, .4) + .01, () => drawPlate(ctx, 0, 0, 1, {}));
}
function gfx8glasses(ctx, t) {
  const t0 = ls(13);
  for (let i = 0; i < 8; i++) { const k = bk(t, t0 + .1 + i * .08, .3); if (k > 0) scaled(ctx, 170 + i * 180, 330, .5 * k, () => drawGlass(ctx, 0, 100, 1, .8, t + i)); }
  const ks = kAt(t, fw(13, 'bukan') - .1, .14); if (ks > 0) drawStamp(ctx, 800, 330, ks < 1 ? lerp(2.6, 1, easeOut(ks)) : 1, 'BUKAN WAJIB', { size: 90, rot: -.06 });
  const items = [['cuaca', 'cuaca', c => sun(c, 0, 0, 60, t)], ['aktivitas', 'aktivitas', c => { const w = walkCycle(t * 300, 200, 1, { amp: .45 }); drawStick(c, C(BUDI, { x: 0, y: 100, s: 200, legs: w.legs, arms: w.arms, bob: w.bob, footDir: 1, lean: .1, shadow: false })); }], ['kondisi', 'kondisi tubuh', c => drawHeart(c, 0, 0, .6, t, {})]];
  items.forEach(([w, lab, fn], i) => { const k = bk(t, fw(13, w) - .15, .4); if (k <= 0) return; scaled(ctx, 400 + i * 400, 660, k, () => { circle(ctx, 0, 0, 110); fillStroke(ctx, '#24356e', 7); fn(ctx); }); tx(ctx, lab, 400 + i * 400, 805, 44, '#fff', 8); });
}
function boardSodium(ctx, t) {
  for (let i = 0; i < 6; i++) scaled(ctx, 200 + i * 130, 330 + (i % 2) * 30, .38, () => drawGlass(ctx, 0, 100, 1, .85, t + i));
  gauge(ctx, 1200, 520, 230, .12 + .05 * Math.sin(t * 3), 'natrium darah', 'turun', t, { vcol: '#ff6a6a' });
  warnSign(ctx, 520, 700, .55 * bk(t, fw(14, 'berbahaya') - .2, .4) + .01);
}

buildShots([
  [0, 'whip', TITLE(2, 'AIR', dropIcon, { c1: '#4ab3f0', c2: '#1f5ea8' })],
  [ls(1) - .1, 'whip', GFX(gfxBody60)],
  [ls(2) - .1, 'whip', GFX(gfxOrgans, { c1: '#12806b', c2: '#0a4a46' })],
  [ls(3) - .1, 'whip', HOST({ frame: 'wide', content: boardJobs })],
  [fw(3, 'gizi') - .2, 'cut', HOST({ frame: 'side', content: boardJobs })],
  [ls(4) - .1, 'whip', GFX(gfxLoss)],
  [ls(5) - .1, 'whip', GFX(gfxDehyd, { c1: '#ff9a4a', c2: '#c4541e' })],
  [ls(6) - .1, 'whip', GFX(gfxSevere, { c1: '#5a1d2e', c2: '#2a0d16' })],
  [ls(7) - .1, 'whip', HOST({ frame: 'close', content: false })],
  [fw(7, 'tidak', 1) - .1, 'cut', HOST({ frame: 'react', content: false, ibuFace: { browUp: .8, mouth: 'flat' } })],
  [ls(8) - .1, 'whip', GFX(gfx3days)],
  [ls(9) - .1, 'whip', GFX(gfxConditions, { c1: '#2a3d8f', c2: '#171f52' })],
  [ls(10) - .1, 'whip', HOST({ frame: 'med', content: false })],
  [ls(11) - .1, 'whip', GFX(gfxLiters, { c1: '#1d2c63', c2: '#101839' })],
  [ls(12) - .1, 'whip', GFX(gfxFood20, { c1: '#12806b', c2: '#0a4a46' })],
  [ls(13) - .1, 'whip', GFX(gfx8glasses, { c1: '#3b2a6e', c2: '#1a1240' })],
  [ls(14) - .1, 'whip', HOST({ frame: 'two', content: boardSodium, ibuFace: { browAng: .25, mouth: 'flat' }, ibuGest: 'raise' })],
  [fw(14, 'menurunkan') - .1, 'cut', HOST({ frame: 'wide', content: boardSodium })],
], END);
