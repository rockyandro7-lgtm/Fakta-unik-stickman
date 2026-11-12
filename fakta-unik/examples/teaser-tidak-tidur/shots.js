// ---------- Teaser: "Apa yang terjadi kalau tidak tidur?" (Randy Gardner 1964) ----------
const SHOTS = [];
const IBU = { cols: ['#ec5b86', '#ec5b86'], hat: 'chef', belt: false, blush: true };
const LAB = { cols: ['#f6f9ff', '#f6f9ff'], hat: 'none', belt: false, blush: true };
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
const walkTo = (x0, x1, lt, t0, t1, s, dir = 1) => { const k = ease(inv(t0, t1, lt)); const x = lerp(x0, x1, k); const moving = lt > t0 && lt < t1; return { x, walk: moving ? walkCycle(Math.abs(x - x0), s, dir) : null }; };
const gradBG = (ctx, cam, c1, c2) => { applyCam(ctx, cam, .2); const g = ctx.createLinearGradient(0, -300, 0, 2200); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-1500, -1500, 4200, 5200); ctx.fillStyle = 'rgba(255,255,255,.07)'; for (let i = 0; i < 28; i++) { circle(ctx, (i * 197) % 1500 - 200, (i * 311) % 2300 - 200, 18 + (i % 4) * 13); ctx.fill(); } applyCam(ctx, cam, 1); };
function drawBall(ctx, x, y, r, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); circle(ctx, 0, 0, r); fillStroke(ctx, '#ff8a2a', r * .09); ctx.lineWidth = r * .08; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke(); ctx.beginPath(); ctx.arc(-r * 1.25, 0, r * .85, -.9, .9); ctx.stroke(); ctx.beginPath(); ctx.arc(r * 1.25, 0, r * .85, Math.PI - .9, Math.PI + .9); ctx.stroke(); ctx.restore(); }

const BOUND = [0, ls(1), fw(1, 'bertahan') - .1, ls(2), ls(3), ls(4), fw(4, 'gerakannya') - .1, fw(4, 'lalu') - .1, ls(5), ls(6), ls(7), ls(8), ls(9)];
const ENDT = WORDS[WORDS.length - 1].e + 1.2;
const SH = (i, tr, draw) => SHOTS.push({ start: BOUND[i], end: i + 1 < BOUND.length ? BOUND[i + 1] : ENDT, tr, draw });

// 0 — HOOK: bloodshot eye fighting to close; "ZZZ" crossed out
SH(0, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .03 }); gradBG(ctx, cam, '#1c2a5e', '#0d1536');
  const lid = .45 + .35 * Math.sin(lt * 2.2) * Math.sin(lt * .7) + (lt > 2.4 ? 0 : .1);
  drawEye(ctx, 540, 860, 1.5, t, { lid: clamp(lid), red: .9 });
  const tT = fw(0, 'tidur') - BOUND[0];
  for (let i = 0; i < 3; i++) { const k = inv(.3 + i * .35, .7 + i * .35, lt); if (k > 0) { ctx.save(); ctx.translate(180 + i * 70, 420 - i * 90 - ((t * 40) % 40)); ctx.globalAlpha = clamp(k * 2) * (lt > tT ? 1 - inv(tT, tT + .3, lt) : 1); text(ctx, 'Z', 0, 0, 90 - i * 10, '#9fc6ff', INK, 12); ctx.restore(); } }
  const kx = inv(tT, tT + .3, lt); if (kx > 0) { ctx.save(); ctx.translate(250, 330); const sc = backOut(kx); ctx.scale(sc, sc); drawX(ctx, 0, 0, 120); ctx.restore(); }
});

// 1 — vintage card: Randy Gardner, 1964
SH(1, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .02 }); gradBG(ctx, cam, '#d8c39a', '#a88a5a');
  const k = backOut(inv(.1, .6, lt)), tY = fw(1, '1964') - BOUND[1];
  ctx.save(); ctx.translate(540, 900); ctx.scale(k, k); ctx.translate(-540, -900);
  drawVintageCard(ctx, 540, 900, 1.0, { l1: 'RANDY GARDNER', l2: 'San Diego, 1964', draw: () => {
    drawStick(ctx, C(BUDI, { x: 0, y: 150, s: 470, shadow: false, arms: { L: [.3, -.1], R: [.3, -.1] }, face: { eyes: 'normal', mouth: 'smile', look: [0, 0], blink: blk(t) } })); } });
  ctx.restore();
  const k17 = inv(fw(1, '17') - BOUND[1], fw(1, '17') - BOUND[1] + .3, lt);
  if (k17 > 0) { ctx.save(); ctx.translate(840, 560); ctx.rotate(.1); const sc = backOut(k17); ctx.scale(sc, sc); circle(ctx, 0, 0, 110); fillStroke(ctx, '#ffd23a', 10); text(ctx, '17', 0, -6, 90, INK, INK, 0); text(ctx, 'tahun', 0, 56, 36, INK, INK, 0); ctx.restore(); }
});

// 2 — hour counter 000 -> 264
SH(2, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .03 }); gradBG(ctx, cam, '#2a3d8f', '#171f52');
  const t0 = fw(1, '264') - BOUND[2], t1 = fw(1, 'jam') - BOUND[2];
  const h = lerp(0, 264, ease(inv(t0 - .6, t1 + .1, lt)));
  const done = lt > t1 + .1;
  drawHourCounter(ctx, 540, 820, 1.2 + (done ? .02 * Math.sin(t * 10) : 0), h, { col: done ? '#ff6a6a' : '#ffe14d' });
  popText(ctx, '= 11 HARI', 540, 1130, 120, inv(t1 + .2, t1 + .5, lt), '#fff', INK, -.04);
  drawStick(ctx, C(BUDI, { x: 160, y: 1740, s: 520, headTilt: .08, face: { eyes: 'normal', look: [1, 0], mouth: 'flat', blink: blk(t) } }));
});

// 3 — "Itu sebelas hari penuh": calendar crossing with day/night
SH(3, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .02 });
  const dur = BOUND[4] - BOUND[3];
  const crossed = ease(inv(.3, dur - .1, lt)) * 11;
  const cyc = (crossed * 1) % 1;
  gradBG(ctx, cam, mix('#ffd37a', '#1c2a5e', Math.abs(Math.sin(crossed * Math.PI))), mix('#ff9d4a', '#33448a', Math.abs(Math.sin(crossed * Math.PI))));
  drawCalendar(ctx, 540, 900, 1.0, 11, crossed, t);
});

// 4 — researcher from Stanford monitors; Budi dribbles
SH(4, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1.0, dz: .02 }); bedroomBG(ctx, t, cam, { dawn: 1, clockSpin: t * 3 }); applyCam(ctx, cam, 1);
  const s = 620;
  const bounce = Math.abs(Math.sin(t * 6)); const by = 1480 - bounce * 260;
  drawStick(ctx, C(BUDI, { x: 330, y: 1580, s, arms: { L: [.3, -.1], R: { ik: [.2, -.2 - Math.max(0, bounce - .6) * .6], bend: -1 } }, face: { eyes: 'normal', look: [1, 0], mouth: 'smile', blink: blk(t) } }));
  drawBall(ctx, 330 + .2 * s + 20, by, 46, t * 7);
  const wr = Math.sin(t * 9) * .02;
  drawStick(ctx, C(LAB, { x: 860, y: 1580, s, flip: -1, arms: { L: [.3, -.1], R: { ik: [-.2, -.5 + wr], bend: 1 } }, face: { eyes: 'normal', look: [-1, 0], mouth: 'flat', blink: blk(t, 1) } }));
  ctx.save(); ctx.translate(860 - .2 * s, 1580 - .5 * s); ctx.rotate(-.1); rrect(ctx, -60, -75, 120, 150, 10); fillStroke(ctx, '#fff', 6); line(ctx, -36, -30, 36, -30, 5, '#9aa6bd'); line(ctx, -36, 0, 36, 0, 5, '#9aa6bd'); line(ctx, -36, 30, 10, 30, 5, '#9aa6bd'); ctx.restore();
  const kc = inv(fw(3, 'stanford') - BOUND[4], fw(3, 'stanford') - BOUND[4] + .35, lt);
  if (kc > 0) { ctx.save(); ctx.translate(700, 700); const sc = backOut(kc); ctx.scale(sc, sc); rrect(ctx, -240, -52, 480, 104, 52); fillStroke(ctx, '#ffffff', 8); text(ctx, 'Peneliti Stanford', 0, 4, 44, INK, INK, 0); ctx.restore(); }
});

// 5 — mood swings
SH(5, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .025 }); bedroomBG(ctx, t, cam, { dawn: .0, clockSpin: t * 4 }); applyCam(ctx, cam, 1);
  const ph = Math.floor((lt * 1.6) % 3);
  const faces = [{ eyes: 'happy', mouth: 'grin' }, { eyes: 'squint', mouth: 'frown', browAng: .35 }, { eyes: 'normal', mouth: 'o', browOne: 1 }];
  const s = 760, x = 540, y = 1700;
  drawStick(ctx, C(BUDI, { x, y, s, headTilt: Math.sin(t * 3) * .08, arms: ph === 1 ? { L: [2.2, .5], R: [2.2, .5] } : { L: [.3, -.1], R: [.3, -.1] }, face: C(faces[ph], { look: [0, 0] }) }));
  const cols = ['#ffd23a', '#ff5a3c', '#4ac8ff']; const lab = ['SENANG', 'MARAH', 'SEDIH'];
  const k = ((lt * 1.6) % 1); const sc = backOut(clamp(k * 4));
  ctx.save(); ctx.translate(540, 520); ctx.scale(sc, sc); rrect(ctx, -250, -70, 500, 140, 70); fillStroke(ctx, cols[ph], 10); text(ctx, lab[ph], 0, 4, 76, '#fff', INK, 12); ctx.restore();
});

// 6 — clumsy: sways, drops things
SH(6, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1.02, dz: .02, r: .01 }); bedroomBG(ctx, t, cam, { dawn: 0, clockSpin: t * 4 }); applyCam(ctx, cam, 1);
  const s = 640, sway = Math.sin(lt * 4) * .09;
  drawStick(ctx, C(BUDI, { x: 540 + Math.sin(lt * 2.2) * 120, y: 1590, s, lean: sway, headTilt: sway * 1.3, legs: { L: [.25 * Math.sin(lt * 4), -.1], R: [-.25 * Math.sin(lt * 4), -.1] }, arms: { L: [1 + Math.sin(lt * 5) * .5, -.4], R: [1 - Math.sin(lt * 5) * .5, -.4] }, face: { eyes: 'half', mouth: 'o', look: [Math.sin(t * 3), 0], blink: .5 } }));
  const kd = inv(.5, 1.5, lt); if (kd > 0) { const y = 1100 + 480 * easeIn(kd); const rot = kd * 5; ctx.save(); ctx.translate(250, y); ctx.rotate(rot); rrect(ctx, -40, -30, 80, 60, 10); fillStroke(ctx, '#8a5a34', 6); ctx.restore(); if (kd >= 1 && lt < 1.9) burst(ctx, 250, 1590, 50, 8, '#ffd23a', 3); }
  sweat(ctx, 760, 900, 30);
});

// 7 — hallucinations
SH(7, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 900, dy: -6, z: 1, dz: .035 });
  gradBG(ctx, cam, '#6a3fd0', '#2a1a6a');
  for (let i = 0; i < 5; i++) { ctx.save(); ctx.globalAlpha = .12; ctx.translate(540, 820); ctx.rotate(t * .3 + i); circle(ctx, 0, 0, 200 + i * 130); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.stroke(); ctx.restore(); }
  drawStick(ctx, C(BUDI, { x: 540, y: 2050, s: 1400, bob: Math.sin(t * 3) * .005, headTilt: Math.sin(t * 2) * .1, shadow: false, arms: { L: [.2, -.1], R: [.2, -.1] }, face: { eyes: 'spiral', mouth: 'o', t, look: [0, 0] } }));
  drawHallucinations(ctx, 540, 880, t, inv(0, .5, lt));
});

// 8 — the researcher changed his mind
SH(8, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 900, dy: -6, z: 1, dz: .03 });
  ctx.save(); ctx.filter = 'blur(7px)'; bedroomBG(ctx, t, cam, { dawn: 1 }); ctx.restore(); applyCam(ctx, cam, 1);
  burst(ctx, 540, 760, 640 + Math.sin(t * 6) * 18, 16, '#ffe14d', 6);
  drawStick(ctx, C(LAB, { x: 540, y: 2100, s: 1450, bob: Math.sin(t * 3) * .004, headTilt: -.05, arms: { L: [.2, -.1], R: [2.7 + Math.sin(t * 8) * .1, .35] }, face: { eyes: 'wide', look: [0, 0], mouth: 'o', browAng: .25, blink: blk(t, 1) }, shadow: false }));
  const k = inv(.3, .65, lt); if (k > 0) { ctx.save(); ctx.translate(880, 540); const sc = backOut(k); ctx.scale(sc, sc); ctx.rotate(.14); text(ctx, '?!', 0, 0, 260, '#e5262a', INK, 40); ctx.restore(); }
});

// 9 — "jam demi jam": timeline
SH(9, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .02 }); gradBG(ctx, cam, '#12806b', '#0a4a46');
  const x0 = 130, x1 = 950, y = 900;
  const prog = ease(inv(.2, BOUND[10] - BOUND[9] - .3, lt));
  rrect(ctx, x0 - 30, y - 34, x1 - x0 + 60, 68, 34); fillStroke(ctx, '#ffffff', 9);
  ctx.save(); rrect(ctx, x0 - 30, y - 34, x1 - x0 + 60, 68, 34); ctx.clip(); const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, '#59d27a'); g.addColorStop(.5, '#ffd23a'); g.addColorStop(1, '#ff4d4d'); ctx.fillStyle = g; ctx.fillRect(x0 - 30, y - 34, (x1 - x0 + 60) * prog, 68); ctx.restore();
  rrect(ctx, x0 - 30, y - 34, x1 - x0 + 60, 68, 34); fillStroke(ctx, null, 9);
  for (let i = 0; i <= 11; i++) { const tx = x0 + (x1 - x0) * i / 11; line(ctx, tx, y + 50, tx, y + 80, 6, '#fff'); }
  text(ctx, '0 jam', x0, y + 130, 46, '#fff', INK, 9); text(ctx, '264 jam', x1, y + 130, 46, '#fff', INK, 9);
  const mx = x0 + (x1 - x0) * prog; drawStick(ctx, C(BUDI, { x: mx, y: y - 40, s: 230, shadow: false, face: { eyes: prog > .7 ? 'spiral' : (prog > .3 ? 'half' : 'normal'), mouth: prog > .7 ? 'o' : 'flat', t } }));
  drawEye(ctx, 300, 1450, .5, t, { lid: .3 + .4 * prog, red: prog });
  drawHeart(ctx, 780, 1450, .8, t, {});
  popText(ctx, 'JAM DEMI JAM', 540, 420, 110, inv(.1, .4, lt), '#fff', INK, -.03);
});

// 10 — and food? water?
SH(10, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .025 }); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  const kM = backOut(inv(0, .4, lt)), kA = backOut(inv(fw(7, 'atau') - BOUND[10] - .1, fw(7, 'atau') - BOUND[10] + .3, lt));
  ctx.save(); ctx.translate(300, 1000); ctx.scale(kM, kM); drawPlate(ctx, 0, 0, 1.2, {}); qmark(ctx, 0, -330, 200, Math.sin(t * 3) * .15); ctx.restore();
  ctx.save(); ctx.translate(790, 1000); ctx.scale(kA, kA); drawGlass(ctx, 0, 0, 1.0, .8, t); qmark(ctx, 0, -380, 200, -Math.sin(t * 3) * .15); ctx.restore();
  drawStick(ctx, C(BUDI, { x: 540, y: 1700, s: 640, face: { eyes: 'normal', look: [0, -1], mouth: 'flat', browOne: 1, blink: blk(t) }, arms: { L: { ik: [-.1, -.7], bend: 1 }, R: [.3, -.1] } }));
});

// 11 — facts checked against scientific sources
SH(11, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .02 }); gradBG(ctx, cam, '#2a6fd6', '#143a80');
  [[300, 760, -.12, .1], [780, 700, .1, .3], [540, 1130, 0, .5]].forEach(([x, y, r, d]) => { const k = inv(d, d + .4, lt); if (k > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(backOut(k), backOut(k)); drawBook(ctx, 0, 0, 1.25, { rot: r }); drawCheck(ctx, 150, -120, 62, 1); ctx.restore(); } });
  drawStick(ctx, C(LAB, { x: 180, y: 1740, s: 520, face: { eyes: 'happy', mouth: 'grin' }, arms: { L: [.3, -.1], R: [2.4 + Math.sin(t * 6) * .2, .3] } }));
});

// 12 — CTA
SH(12, 'cut', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .01, shake: 2 }); kitchenBG(ctx, t, cam, { wallTop: '#fff0b8', wallBot: '#ffd98a' }); applyCam(ctx, cam, 1);
  const tS = fw(9, 'subscribe') - BOUND[12];
  const k = inv(.1, .6, lt); const sc = backOut(k);
  const subbed = lt > tS + .35, press = lt > tS + .2 && lt < tS + .45 ? 1 : 0;
  ctx.save(); ctx.translate(540, 680); ctx.scale(sc, sc); ctx.translate(-540, -680);
  drawSubBanner(ctx, 540, 680, .98, { subbed, press, ring: subbed ? Math.sin((lt - tS - .35) * 22) * .35 * Math.exp(-(lt - tS - .35) * 2) : 0 }); ctx.restore();
  const s = 640, w = Math.sin(t * 7);
  const WB = walkTo(-160, 260, lt, 0, 1.3, s, 1), WI = walkTo(1240, 820, lt, 0, 1.3, s, 1);
  const pb = WB.walk, pi = WI.walk;
  drawStick(ctx, C(BUDI, { x: WB.x, y: 1620, s, legs: pb ? pb.legs : standL, bob: pb ? pb.bob : 0, footDir: pb ? pb.footDir : null, lean: pb ? pb.lean : 0, face: { eyes: 'happy', mouth: 'grin' }, arms: pb ? pb.arms : { L: [.3, -.1], R: [2.4 + w * .25, .35] } }));
  drawStick(ctx, C(IBU, { x: WI.x, y: 1620, s, flip: -1, legs: pi ? pi.legs : standL, bob: pi ? pi.bob : 0, footDir: pi ? pi.footDir : null, lean: pi ? pi.lean : 0, face: { eyes: 'happy', mouth: 'grin' }, arms: pi ? pi.arms : { L: [2.4 - w * .25, .35], R: [.3, -.1] } }));
  if (subbed) { const r = rng(4); for (let i = 0; i < 46; i++) { const x0 = r() * 1080, v = 300 + r() * 500, ph = r() * TAU, d0 = r() * .6; const tt = lt - tS - .35 - d0; if (tt < 0) continue; const y = -60 + tt * v, x = x0 + Math.sin(tt * 3 + ph) * 40; ctx.save(); ctx.translate(x, y); ctx.rotate(tt * 6 + ph); ctx.fillStyle = ['#ff5a3c', '#ffd23a', '#2cb35e', '#4a8cff', '#ff6fa8'][i % 5]; ctx.fillRect(-12, -7, 24, 14); ctx.restore(); } }
});
