// ---------- Mitos Rumahan #3: masuk angin (shots timed to the voiceover words) ----------
const SHOTS = [];
const IBU = { cols: ['#ec5b86', '#ec5b86'], hat: 'chef', belt: false, blush: true };
const BUDI = { cols: ['#2f9b5a', '#2f9b5a'], hat: 'tuft', hatCol: INK, belt: false };
const C = (b, e) => Object.assign({}, b, e);
const LN = {}; WORDS.forEach(w => { (LN[w.line] = LN[w.line] || []).push(w); });
const ls = i => LN[i][0].s;
const nrm = w => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const fw = (i, str, n = 0) => LN[i].filter(w => nrm(w.w) === str)[n].s;
const hh = (t, a = 4) => shake(t * .35, a, 1, 2);
const blk = (t, p = 0) => ((t + p) % 3.3) < .12 ? 1 : 0;
const standL = { L: [.1, -.04], R: [.1, -.04] };
const camOf = (t, lt, o = {}) => { const h = hh(t, o.shake == null ? 3 : o.shake); return { x: (o.x || 540) + h[0] + lt * (o.dx || 0), y: (o.y || 960) + h[1] + lt * (o.dy || 0), z: (o.z || 1) + lt * (o.dz || .02), r: Math.sin(t * .5) * (o.r == null ? .004 : o.r) }; };
const walkTo = (x0, x1, lt, t0, t1, s, dir = 1) => { const k = ease(inv(t0, t1, lt)); const x = lerp(x0, x1, k); const moving = lt > t0 && lt < t1; const w = walkCycle(Math.abs(x - x0), s, dir); return { x, walk: moving ? w : null }; };
const gradBG = (ctx, cam, c1, c2) => { applyCam(ctx, cam, .2); const g = ctx.createLinearGradient(0, -300, 0, 2200); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-1500, -1500, 4200, 5200); ctx.fillStyle = 'rgba(255,255,255,.07)'; for (let i = 0; i < 28; i++) { circle(ctx, (i * 197) % 1500 - 200, (i * 311) % 2300 - 200, 18 + (i % 4) * 13); ctx.fill(); } applyCam(ctx, cam, 1); };

const BOUND = [0, ls(1), ls(2), ls(3), fw(3, 'dan') - .1, ls(4), fw(4, 'bisa') - .1, ls(5), ls(6), ls(7), fw(7, 'nyeri') - .1, ls(8), ls(9)];
const ENDT = WORDS[WORDS.length - 1].e + 1.2;
const SH = (i, tr, draw) => SHOTS.push({ start: BOUND[i], end: i + 1 < BOUND.length ? BOUND[i + 1] : ENDT, tr, draw });

// 0 — HOOK: Budi walks past the fan, gusts "enter" his body
SH(0, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 940, dy: -6, z: 1.02, dz: .025 }); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  drawFan(ctx, 860, 1520, 1.0, t, 1);
  const s = 620, stride = 4 * .31 * Math.sin(.34) * s;
  const W0 = walkTo(110, 110 + stride * 1.5, lt, 0, 1.35, s, 1);
  const tIn = fw(0, 'angin', 1) - BOUND[0];
  const cold = lt > tIn + .25; const sh = cold ? Math.sin(t * 60) * 5 : 0;
  const pose = W0.walk ? W0.walk : { legs: standL, footDir: null, bob: 0, lean: 0 };
  drawStick(ctx, C(BUDI, { x: W0.x + sh, y: 1560, s, legs: pose.legs, footDir: pose.footDir, bob: pose.bob, lean: pose.lean,
    arms: W0.walk ? W0.walk.arms : (cold ? { L: { ik: [.06, -.45], bend: -1 }, R: { ik: [-.06, -.45], bend: 1 } } : { L: [.3, -.1], R: [.3, -.1] }),
    face: { eyes: cold ? 'wide' : 'normal', look: [1, 0], mouth: cold ? 'teeth' : 'smile', blink: blk(t) } }));
  // gusts from the fan head toward Budi
  const tx = W0.x + 20, ty = 1290;
  for (let i = 0; i < 5; i++) {
    const p = ((lt * .85 + i * .25) % 1.25); const sx = 790, sy = 760 + i * 45;
    const ang = Math.atan2(ty - sy, tx - sx); const len = Math.hypot(tx - sx, ty - sy) * (lt > tIn ? 1 : .55);
    drawWind(ctx, sx, sy, ang, len, p, t, '#ffffff', 11);
  }
  if (lt > tIn) { const k = ((lt - tIn) * 2) % 1; puff(ctx, tx, ty, 30 + k * 30, t, '#e9f6ff', 3, (1 - k) * .8); }
  if (cold) { for (let i = 0; i < 3; i++) line(ctx, W0.x - 140 - i * 16, 1150 + i * 40, W0.x - 110 - i * 16, 1170 + i * 40, 7, '#8fd8ff'); sweat(ctx, W0.x + 110, 920, 26); }
});

// 1 — "Benar nggak sih?"
SH(1, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 900, dy: -8, z: 1, dz: .03 });
  ctx.save(); ctx.filter = 'blur(7px)'; kitchenBG(ctx, t, cam); ctx.restore(); applyCam(ctx, cam, 1);
  drawStick(ctx, C(BUDI, { x: 540, y: 2080, s: 1450, bob: Math.sin(t * 3) * .004, headTilt: .1 + Math.sin(t * 2) * .03, arms: { L: [.2, -.1], R: { ik: [.12 + Math.sin(t * 9) * .02, -.7], bend: -1 } }, face: { eyes: 'normal', look: [0, -1], mouth: 'flat', browOne: 1, blink: blk(t, 2) }, shadow: false }));
  [[190, 480, .1, .15], [880, 430, .12, .3], [820, 760, .1, .5]].forEach(([x, y, r, d], i) => { const k = inv(d, d + .3, lt); if (k > 0) qmark(ctx, x, y + Math.sin(t * 4 + i) * 8, 190 * backOut(k), (i - 1) * .3); });
});

// 2 — "Ternyata ini mitos." stamp
SH(2, 'whip', (ctx, lt, t) => {
  const tm = fw(2, 'mitos') - BOUND[2];
  const cam = camOf(t, lt, { y: 940, z: 1.04, dz: .01 }); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  drawFan(ctx, 840, 1520, 1.0, t, 1);
  for (let i = 0; i < 4; i++) drawWind(ctx, 760, 780 + i * 50, Math.PI + .25, 380, ((lt * .85 + i * .3) % 1.25), t);
  const hit = lt >= tm + .1;
  drawStick(ctx, C(BUDI, { x: 360 + (hit ? 0 : Math.sin(t * 60) * 5), y: 1560, s: 620, arms: hit ? { L: [2.5, .3], R: [2.5, .3] } : { L: { ik: [.06, -.45], bend: -1 }, R: { ik: [-.06, -.45], bend: 1 } }, face: { eyes: hit ? 'happy' : 'wide', mouth: hit ? 'grin' : 'teeth', look: [1, 0] } }));
  const k = inv(tm, tm + .14, lt);
  if (k > 0) {
    const sc = k < 1 ? lerp(3.2, 1, easeOut(k)) : 1 + .03 * Math.sin((lt - tm) * 14) * Math.exp(-(lt - tm) * 4);
    ctx.save(); const sk = lt - tm < .5 ? shake(lt * 3, 14 * Math.exp(-(lt - tm - .1) * 8), 3) : [0, 0]; ctx.translate(sk[0], sk[1]);
    if (lt - tm < .3 && k >= 1) burst(ctx, 540, 860, 520 * (1 - (lt - tm) / .3), 14, 'rgba(255,255,255,.8)', 8);
    drawStamp(ctx, 540, 860, sc, 'MITOS', { size: 150 }); ctx.restore();
  }
});

// 3 — "Masuk angin bukan nama penyakit": diagnosis clipboard, masuk angin crossed out
SH(3, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .025 }); gradBG(ctx, cam, '#5ec8e8', '#2a7fc0');
  const tB = fw(3, 'bukan') - BOUND[3], tP = fw(3, 'penyakit') - BOUND[3];
  const kin = backOut(inv(0, .4, lt));
  ctx.save(); ctx.translate(540, 880); ctx.scale(kin, kin); ctx.translate(-540, -880);
  drawClipboard(ctx, 540, 880, 1.15, { show: inv(.1, .9, lt), strike: inv(tB, tP + .3, lt) });
  ctx.restore();
  // stethoscope
  ctx.save(); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(250, 380); ctx.bezierCurveTo(120, 700, 160, 1150, 330, 1420); ctx.stroke(); ctx.lineWidth = 9; ctx.strokeStyle = '#5b6685'; ctx.stroke(); ctx.restore();
  circle(ctx, 340, 1430, 46); fillStroke(ctx, '#cfd7e6', 9);
});

// 4 — "angin tidak bisa masuk lewat kulit": skin blocks the gusts
SH(4, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .02 }); gradBG(ctx, cam, '#bfe8ff', '#7cc3ee');
  drawSkin(ctx, 540, 900, 980, 760, t, {});
  popText(ctx, 'KULIT', 230, 960, 70, inv(.1, .4, lt), '#fff', INK, -.05);
  for (let i = 0; i < 5; i++) {
    const p = ((lt * .9 + i * .23) % 1.1); const sx = 100 + i * 210, sy = 260;
    if (p < .6) drawWind(ctx, sx, sy, Math.PI / 2 + .1, 620, p / .6 * .95, t, '#ffffff', 12);
    else { const q = (p - .6) / .5; drawWind(ctx, sx + 40, 860, -Math.PI / 2 - .5, 420, q * 1.1, t, '#ffffff', 12); if (q < .35) burst(ctx, sx + 40, 880, 60 * (1 - q / .35), 8, '#ffffff', i); }
  }
  const tK = fw(3, 'kulit') - BOUND[4];
  const kx = inv(tK - .4, tK, lt); if (kx > 0) { ctx.save(); ctx.translate(880, 560); const sc = backOut(kx); ctx.scale(sc, sc); drawX(ctx, 0, 0, 100); ctx.restore(); }
});

// 5 — symptoms on Budi: kembung, mual, meriang
SH(5, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .025 }); kitchenBG(ctx, t, cam, { wallTop: '#ffe0d0', wallBot: '#ffc2a8' }); applyCam(ctx, cam, 1);
  const b = BOUND[5], tKe = fw(4, 'kembung') - b, tMu = fw(4, 'mual') - b, tMe = fw(4, 'meriang') - b;
  const s = 900, x = 540, y = 1760;
  const kemb = backOut(inv(tKe, tKe + .35, lt)), mual = inv(tMu, tMu + .3, lt), mer = lt > tMe;
  const sx = mer ? Math.sin(t * 55) * 7 : 0;
  drawStick(ctx, C(BUDI, { x: x + sx, y, s, shadow: true, arms: { L: { ik: [-.06, -.36], bend: 1 }, R: { ik: [.06, -.36], bend: -1 } },
    face: { eyes: mual > .5 ? 'spiral' : (kemb > .5 ? 'wide' : 'normal'), mouth: mer ? 'teeth' : (mual > .5 ? 'frown' : 'o'), t, look: [0, 0] } }));
  if (kemb > 0) { const cx = x + sx, cy = y - .44 * s; ellipse(ctx, cx, cy, 120 + 70 * kemb, 150 + 30 * kemb); fillStroke(ctx, '#2f9b5a', 12); ellipse(ctx, cx - 60, cy - 60, 30 * kemb, 50 * kemb, -.4); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fill();
    for (const sd of [-1, 1]) { circle(ctx, cx + sd * (118 + 68 * kemb), cy + 10, 27); ctx.fillStyle = INK; ctx.fill(); } }
  if (mual > 0) { ctx.save(); ctx.globalAlpha = .38 * mual; circle(ctx, x + sx, y - .765 * s, .19 * s); ctx.fillStyle = '#7cc23a'; ctx.fill(); ctx.restore(); }
  if (mer) {
    ctx.save(); ctx.translate(x + sx + 70, y - .68 * s); ctx.rotate(-.35); rrect(ctx, 0, -10, 150, 20, 10); fillStroke(ctx, '#fff', 5); circle(ctx, 150, 0, 16); fillStroke(ctx, '#e5262a', 5); ctx.restore();
    for (let i = 0; i < 3; i++) { line(ctx, x - 260, 900 + i * 60, x - 220, 930 + i * 60, 8, '#8fd8ff'); line(ctx, x + 230, 900 + i * 60, x + 270, 930 + i * 60, 8, '#8fd8ff'); }
    sweat(ctx, x + 150, 830, 30);
  }
});

// 6 — causes: maag, flu, kelelahan
SH(6, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .02 }); gradBG(ctx, cam, '#8a6ff0', '#4a35b0');
  const b = BOUND[6], tA = fw(4, 'maag') - b, tF = fw(4, 'flu') - b, tL = fw(4, 'kelelahan') - b;
  const tile = (cx, cy, k, lab, draw) => { if (k <= 0) return; ctx.save(); ctx.translate(cx, cy); const sc = backOut(k); ctx.scale(sc, sc); circle(ctx, 0, 0, 190); fillStroke(ctx, '#ffffff', 10); draw(); text(ctx, lab, 0, 250, 66, '#fff', INK, 13); ctx.restore(); };
  tile(290, 520, inv(tA, tA + .35, lt), 'MAAG', () => drawStomach(ctx, 0, -10, .85, t, { burn: true }));
  tile(790, 520, inv(tF, tF + .35, lt), 'FLU', () => drawBug(ctx, 0, 0, 92, t, { c1: '#9fd0ff', c2: '#3b7de0', spike: '#2a5fb0', seed: 2 }));
  tile(540, 960, inv(tL, tL + .35, lt), 'KELELAHAN', () => drawBattery(ctx, -10, 0, .95, .18, t));
});

// 7 — kerokan on the back: is the red "wind coming out"? BUKAN.
SH(7, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .02 }); gradBG(ctx, cam, '#ffcf8a', '#f08a4b');
  const b = BOUND[7], tK = fw(5, 'kerokan') - b, tAn = fw(5, 'angin') - b, tBu = fw(5, 'bukan') - b;
  const prog = inv(.1, tAn, lt);
  drawBack(ctx, 540, 1080, .82, { stripes: prog });
  if (prog < 1) { const i = Math.min(13, Math.floor(prog * 14)), k = prog * 14 - i, row = Math.floor(i / 2), sd = i % 2 ? 1 : -1; const px = lerp(sd * 30, sd * 240, k), py = -330 + row * 100 + 70 * k; drawCoin(ctx, 540 + px * .82, 1080 + py * .82, 52, t * 2); }
  const gone = lt > tBu + .1;
  if (lt > tAn - .2 && !gone) { for (let i = 0; i < 4; i++) { const p = ((lt - tAn + .2) * .7 + i * .25) % 1.1; drawWind(ctx, 330 + i * 140, 900, -Math.PI / 2 + (i - 1.5) * .2, 520, p, t, '#ffffff', 11); } qmark(ctx, 880, 420, 170, .2, inv(tAn, tAn + .3, lt)); }
  const ks = inv(tBu, tBu + .14, lt);
  if (ks > 0) { const sc = ks < 1 ? lerp(3, 1, easeOut(ks)) : 1; drawStamp(ctx, 540, 900, sc, 'BUKAN', { size: 140, rot: .1 }); }
});

// 8 — capillaries under the skin widen / burst
SH(8, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1.02, dz: .03 }); gradBG(ctx, cam, '#ffd9d9', '#ff9e9e');
  const b = BOUND[8], tPe = fw(6, 'pembuluh') - b, tMl = fw(6, 'melebar') - b, tPc = fw(6, 'pecah') - b;
  drawSkin(ctx, 540, 520, 960, 820, t, { widen: inv(tMl, tMl + .4, lt), burst: inv(tPc, tPc + .5, lt) });
  const cx = lerp(170, 910, (Math.sin(lt * 2.4) + 1) / 2); drawCoin(ctx, cx, 470, 64, lt * 3);
  const kl = inv(tPe, tPe + .35, lt);
  if (kl > 0) { ctx.save(); ctx.globalAlpha = clamp(kl * 3); line(ctx, 700, 1450, 640, 760, 8); ctx.restore(); popText(ctx, 'kapiler', 760, 1500, 76, kl, '#fff', INK, -.04); }
  if (lt > tPc) for (let i = 0; i < 3; i++) burst(ctx, 300 + i * 240, 780 + (i % 2) * 70, 40 * (1 - inv(tPc, tPc + .5, lt)), 8, '#ffd23a', i + 2);
});

// 9 — "Tapi hati-hati." warning
SH(9, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 900, dy: -6, z: 1, dz: .03 });
  ctx.save(); ctx.filter = 'blur(7px)'; kitchenBG(ctx, t, cam); ctx.restore(); applyCam(ctx, cam, 1);
  burst(ctx, 540, 760, 640 + Math.sin(t * 6) * 18, 16, '#ff7a3a', 6);
  drawStick(ctx, C(IBU, { x: 540, y: 2100, s: 1450, bob: Math.sin(t * 3) * .004, arms: { L: [.2, -.1], R: [2.7 + Math.sin(t * 8) * .12, .35] }, face: { eyes: 'wide', look: [0, 0], mouth: 'o', browAng: .25, blink: blk(t, 1) }, shadow: false }));
  const ka = inv(.2, .55, lt); if (ka > 0) { ctx.save(); ctx.translate(860, 520); const sc = backOut(ka); ctx.scale(sc, sc); ctx.rotate(.14); path(ctx, [[0, -120], [125, 100], [-125, 100]]); fillStroke(ctx, '#ffd23a', 12); text(ctx, '!', 0, 36, 130, INK, INK, 0); ctx.restore(); }
});

// 10 — chest pain = angin duduk, could be the heart
SH(10, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .025 }); gradBG(ctx, cam, '#3a2a5e', '#170f2e');
  const b = BOUND[10], tAD = fw(7, 'angin') - b, tJ = fw(7, 'jantung') - b;
  drawECG(ctx, 540, 380, 900, 250, t, { fast: lt > tJ - .3, col: lt > tJ - .3 ? '#ff5a5a' : '#4dff9a' });
  const glow = .5 + .5 * Math.sin(t * 10);
  const s = 900, x = 360, y = 1800;
  ctx.save(); const g = ctx.createRadialGradient(x, y - .5 * s, 10, x, y - .5 * s, 300); g.addColorStop(0, `rgba(255,60,60,${.55 * glow})`); g.addColorStop(1, 'rgba(255,60,60,0)'); ctx.fillStyle = g; ctx.fillRect(x - 320, y - .5 * s - 320, 640, 640); ctx.restore();
  drawStick(ctx, C(BUDI, { x, y, s, lean: .08, headTilt: .12, arms: { L: { ik: [.02, -.5], bend: -1 }, R: { ik: [.05, -.48], bend: 1 } }, face: { eyes: 'squint', mouth: 'teeth', look: [0, 0] } }));
  sweat(ctx, x + 160, 980, 34); sweat(ctx, x - 150, 1040, 26);
  const kh = inv(.2, .55, lt); if (kh > 0) drawHeart(ctx, 800, 1000, 1.5 * backOut(kh), t, { fast: lt > tJ - .3, crack: inv(tJ, tJ + .3, lt) });
  const kp = inv(tAD, tAD + .3, lt); if (kp > 0) { ctx.save(); ctx.translate(780, 700); const sc = backOut(kp); ctx.scale(sc, sc); rrect(ctx, -230, -55, 460, 110, 55); fillStroke(ctx, '#ffffff', 8); text(ctx, 'angina pektoris', 0, 4, 46, INK, INK, 0); ctx.restore(); }
});

// 11 — go to the IGD: Ibu helps Budi walk in
SH(11, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { x: 560, y: 960, z: 1, dz: .02 });
  applyCam(ctx, cam, .1); drawSky(ctx, '#6cc4f2', '#d8f2fb', -400, 1300); applyCam(ctx, cam, .15); drawCloud(ctx, 200 + t * 8, 300, 110, 1); drawCloud(ctx, 820 + t * 5, 200, 80, 2);
  applyCam(ctx, cam, 1); ctx.fillStyle = '#b8c2d4'; ctx.fillRect(-600, 1540, 2400, 900); ctx.fillStyle = '#9aa6bd'; ctx.fillRect(-600, 1540, 2400, 16);
  drawIGD(ctx, 830, 1560, 1.0, t);
  const s = 560, dur = BOUND[12] - BOUND[11];
  const WB = walkTo(120, 430, lt, .15, dur - .2, s, 1), WI = walkTo(0, 310, lt, .15, dur - .2, s, 1);
  const pb = WB.walk || { legs: standL, bob: 0, footDir: null, lean: 0 }, pi = WI.walk || { legs: standL, bob: 0, footDir: null, lean: 0 };
  drawStick(ctx, C(IBU, { x: WI.x, y: 1600, s, legs: pi.legs, bob: pi.bob, footDir: pi.footDir, lean: pi.lean, arms: { L: [.3, -.1], R: { ik: [(WB.x - WI.x) / s - .12, -.52], bend: -1 } }, face: { eyes: 'normal', look: [1, 0], mouth: 'flat', browAng: .25, blink: blk(t) } }));
  drawStick(ctx, C(BUDI, { x: WB.x, y: 1600, s, legs: pb.legs, bob: pb.bob, footDir: pb.footDir, lean: .12, headTilt: .1, arms: { L: { ik: [.02, -.5], bend: -1 }, R: [.3, -.1] }, face: { eyes: 'squint', mouth: 'frown' } }));
});

// 12 — CTA: Subscribe Mitos Rumahan
SH(12, 'cut', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .01, shake: 2 }); kitchenBG(ctx, t, cam, { wallTop: '#fff0b8', wallBot: '#ffd98a' }); applyCam(ctx, cam, 1);
  const tS = fw(10, 'subscribe') - BOUND[12];
  const k = inv(.1, .6, lt); const sc = backOut(k);
  const subbed = lt > tS + .35, press = lt > tS + .2 && lt < tS + .45 ? 1 : 0;
  ctx.save(); ctx.translate(540, 680); ctx.scale(sc, sc); ctx.translate(-540, -680);
  drawSubBanner(ctx, 540, 680, .98, { subbed, press, ring: subbed ? Math.sin((lt - tS - .35) * 22) * .35 * Math.exp(-(lt - tS - .35) * 2) : 0 }); ctx.restore();
  const s = 640, w = Math.sin(t * 7);
  const WB = walkTo(-160, 260, lt, 0, 1.3, s, 1), WI = walkTo(1240, 820, lt, 0, 1.3, s, 1);
  const pb = WB.walk, pi = WI.walk;
  drawStick(ctx, C(BUDI, { x: WB.x, y: 1620, s, legs: pb ? pb.legs : standL, bob: pb ? pb.bob : 0, footDir: pb ? pb.footDir : null, lean: pb ? pb.lean : 0, face: { eyes: 'happy', mouth: 'grin' }, arms: pb ? pb.arms : { L: [.3, -.1], R: [2.4 + w * .25, .35] } }));
  drawStick(ctx, C(IBU, { x: WI.x, y: 1620, s, flip: -1, legs: pi ? pi.legs : standL, bob: pi ? pi.bob : 0, footDir: pi ? pi.footDir : null, lean: pi ? pi.lean : 0, face: { eyes: 'happy', mouth: 'grin' }, arms: pi ? pi.arms : { L: [.3, -.1], R: [2.4 - w * .25, .35] } }));
  if (subbed) { const r = rng(4); for (let i = 0; i < 46; i++) { const x0 = r() * 1080, v = 300 + r() * 500, ph = r() * TAU, d0 = r() * .6; const tt = lt - tS - .35 - d0; if (tt < 0) continue; const y = -60 + tt * v, x = x0 + Math.sin(tt * 3 + ph) * 40; ctx.save(); ctx.translate(x, y); ctx.rotate(tt * 6 + ph); ctx.fillStyle = ['#ff5a3c', '#ffd23a', '#2cb35e', '#4a8cff', '#ff6fa8'][i % 5]; ctx.fillRect(-12, -7, 24, 14); ctx.restore(); } }
});
