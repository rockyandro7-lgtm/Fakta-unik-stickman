const SHOTS = [];
// ---------- Fakta Unik #2: makanan panas & kulkas (shots timed to the voiceover words) ----------
const IBU = { cols: ['#ec5b86', '#ec5b86'], hat: 'chef', belt: false, blush: true };
const BUDI = { cols: ['#2f9b5a', '#2f9b5a'], hat: 'tuft', hatCol: INK, belt: false };
const C = (b, e) => Object.assign({}, b, e);
const LN = {}; WORDS.forEach(w => { (LN[w.line] = LN[w.line] || []).push(w); });
const ls = i => LN[i][0].s, le = i => LN[i][LN[i].length - 1].e;
const fw = (i, str) => LN[i].find(w => w.w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '') === str).s;
const hh = (t, a = 4) => shake(t * .35, a, 1, 2);
const blk = (t, p = 0) => ((t + p) % 3.3) < .12 ? 1 : 0;
const walkL = (t, sp = 9, amp = .5) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .6], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .6] });
const standL = { L: [.1, -.04], R: [.1, -.04] };
const camOf = (t, lt, o = {}) => { const h = hh(t, o.shake == null ? 3 : o.shake); return { x: (o.x || 540) + h[0] + lt * (o.dx || 0), y: (o.y || 960) + h[1] + lt * (o.dy || 0), z: (o.z || 1) + lt * (o.dz || .02), r: Math.sin(t * .5) * (o.r == null ? .004 : o.r) }; };
const ikT = (px, py, wx, wy, s, flip = 1) => [(wx - px) / (s * flip), (wy - py) / s];
function heldPot(ctx, px, py, s, flip, t, o = {}) {
  drawPot(ctx, px + flip * (o.dx == null ? .1 : o.dx) * s, py - .28 * s + (o.dy || 0), (o.ps || .6) * s / 640, Object.assign({ t, shadow: false }, o));
}
function table(ctx, y = 1330) {
  rrect(ctx, -200, y, 1480, 60, 14); fillStroke(ctx, '#d9a56b', 8);
  ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(-190, y + 8, 1460, 8);
  rrect(ctx, -180, y + 56, 1440, 700, 0); fillStroke(ctx, '#2bb5ae', 8);
  ctx.fillStyle = 'rgba(0,60,70,.16)'; ctx.fillRect(-170, y + 62, 1420, 14);
}
const BOUND = [0, ls(1), ls(2), ls(3), ls(4), fw(4, 'karena') - .1, fw(4, 'suhu') - .05, ls(5), fw(5, 'jauh') - .05, ls(6), ls(7), ls(8), fw(8, 'lalu') - .1, fw(8, 'simpan') - .35, ls(9)];
const ENDT = WORDS[WORDS.length - 1].e + 1.2;
const SH = (i, tr, draw) => SHOTS.push({ start: BOUND[i], end: i + 1 < BOUND.length ? BOUND[i + 1] : ENDT, tr, draw });
const floorLine = 1560;

// 0 — HOOK: Budi wants to put the hot pot in the fridge, Ibu says no, fridge "breaks" on "rusak"
SH(0, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 930, dy: -5, z: 1.02, dz: .025 }); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  const broken = lt > 4.35, kk = inv(4.35, 4.7, lt);
  drawFridge(ctx, 840, 1330, 1.0, { t, mood: broken ? 'broken' : 'worry', shake: broken ? 5 * (1 - inv(4.35, 5.1, lt)) : (lt > 2.0 ? 1.2 : 0), crack: broken ? kk : 0, look: -1, temp: .2 });
  if (broken) { for (let i = 0; i < 4; i++) { const p = ((lt - 4.35) * .6 + i * .2) % 1; puff(ctx, 760 + i * 50, 600 - p * 200, 36 + p * 30, t, '#9a9aa6', i + 5, (1 - p) * .9); } burst(ctx, 840, 700, 70 * backOut(clamp(kk * 3)), 9, '#ffd23a', 4); }
  const wob = Math.sin(t * 7) * .22;
  // Budi with pot
  const bx = kf(lt, [[0, 220], [1.6, 330]]), s = 640;
  drawStick(ctx, C(BUDI, { x: bx, y: 1560, s, bob: Math.abs(Math.sin(t * 7)) * .006 * (lt < 1.7 ? 1 : 0), legs: lt < 1.7 ? walkL(t) : standL, arms: { L: { ik: [-.1, -.42], bend: 1 }, R: { ik: [.2, -.42], bend: -1 } }, face: { eyes: lt > 2.2 ? 'wide' : 'normal', look: [.8, 0], mouth: lt > 2.2 ? 'o' : 'smile', blink: blk(t, 1) } }));
  heldPot(ctx, bx, 1560, s, 1, t, { steam: 1, dx: .1, ps: .6 });
  // Ibu
  drawStick(ctx, C(IBU, { x: 600, y: 1560, s, flip: -1, bob: Math.sin(t * 3) * .004, legs: standL, arms: { L: [.3, -.1], R: [lt > 1.7 ? 2.55 + wob : .3, lt > 1.7 ? .35 : -.1] }, headTilt: lt > 1.7 ? Math.sin(t * 7) * .06 : 0, face: { eyes: 'normal', look: [-.6, 0], mouth: lt > 1.7 ? 'flat' : 'smile', browAng: lt > 1.7 ? .35 : 0, blink: blk(t) } }));
  // X over fridge (jangan langsung masuk)
  const kx = inv(2.05, 2.45, lt); if (kx > 0 && !broken) { const sc = backOut(kx); ctx.save(); ctx.translate(840, 900); ctx.scale(sc, sc); drawX(ctx, 0, 0, 120); ctx.restore(); }
  if (broken) drawX(ctx, 840, 930, 120 * (1 - kk * .2), 1 - kk);
});

// 1 — "Benar nggak sih?" Budi closeup scratching head, ? popping
SH(1, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 900, dy: -8, z: 1, dz: .03 });
  ctx.save(); ctx.filter = 'blur(7px)'; kitchenBG(ctx, t, cam); ctx.restore(); applyCam(ctx, cam, 1);
  const hand = [Math.sin(t * 9) * .02 + .02, -.8];
  drawStick(ctx, C(BUDI, { x: 540, y: 2080, s: 1450, bob: Math.sin(t * 3) * .004, headTilt: .1 + Math.sin(t * 2) * .03, arms: { L: [.2, -.1], R: { ik: [hand[0] + .1, hand[1] + .1], bend: -1 } }, face: { eyes: 'normal', look: [0, -1], mouth: 'flat', browOne: 1, blink: blk(t, 2) }, shadow: false }));
  [[190, 480, .15, .15], [880, 430, .12, .35], [820, 760, .1, .6]].forEach(([x, y, r, d], i) => { const k = inv(d, d + .3, lt); if (k > 0) qmark(ctx, x, y + Math.sin(t * 4 + i) * 8, 190 * backOut(k), (i - 1) * .3); });
});

// 2 — "Ternyata ini mitos." STAMP
SH(2, 'whip', (ctx, lt, t) => {
  const tm = fw(2, 'mitos') - BOUND[2];
  const cam = camOf(t, lt, { y: 940, z: 1.06, dz: .01 }); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  const hit = lt >= tm + .1;
  drawFridge(ctx, 540, 1330, 1.25, { t, mood: hit ? 'joy' : 'broken', crack: hit ? 0 : 1, look: 0, temp: .15, shake: !hit && lt > .2 ? 2 : 0 });
  if (!hit) drawX(ctx, 540, 930, 130, 1);
  drawStick(ctx, C(BUDI, { x: 160, y: 1560, s: 560, face: { eyes: hit ? 'happy' : 'normal', mouth: hit ? 'grin' : 'smile', look: [.8, 0], blink: blk(t) }, arms: hit ? { L: [2.5, .3], R: [2.5, .3] } : { L: [.3, -.1], R: [.3, -.1] } }));
  drawStick(ctx, C(IBU, { x: 920, y: 1560, s: 560, flip: -1, face: { eyes: hit ? 'wide' : 'normal', mouth: hit ? 'o' : 'flat', look: [-.8, 0], blink: blk(t, 1) }, arms: { L: [.3, -.1], R: [hit ? 2.6 : .3, hit ? .3 : -.1] } }));
  const k = inv(tm, tm + .14, lt);
  if (k > 0) {
    const sc = k < 1 ? lerp(3.2, 1, easeOut(k)) : 1 + .03 * Math.sin((lt - tm) * 14) * Math.exp(-(lt - tm) * 4);
    ctx.save(); const sh = lt - tm < .5 ? shake(lt * 3, 14 * Math.exp(-(lt - tm - .1) * 8), 3) : [0, 0]; ctx.translate(sh[0], sh[1]);
    if (lt - tm < .3 && k >= 1) burst(ctx, 540, 900, 520 * (1 - (lt - tm) / .3), 14, 'rgba(255,255,255,.8)', 8);
    drawStamp(ctx, 540, 900, sc, 'MITOS', { size: 150 }); ctx.restore();
  }
});

// 3 — Kulkas nggak rusak: Budi puts the warm pot in, door closes, fridge smiles
SH(3, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { x: 600, y: 960, z: 1.0, dz: .02 }); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  const open = ease(inv(.2, .7, lt)) - ease(inv(2.05, 2.5, lt)), FX = 720, FY = 1340, FS = 1.2;
  drawFridge(ctx, FX, FY, FS, { t, door: open, mood: lt > 2.5 ? 'joy' : 'happy', cold: open > .5 ? .8 : 0, look: -.5, temp: .15 });
  const bx = kf(lt, [[0, 160], [1.0, 400], [3, 400]]), s = 640;
  const place = ease(inv(1.0, 1.6, lt));
  drawStick(ctx, C(BUDI, { x: bx, y: 1560, s, legs: lt < 1.05 ? walkL(t) : standL, arms: place < 1 ? { L: { ik: [-.1, -.42], bend: 1 }, R: { ik: [.2, -.42], bend: -1 } } : { L: [.3, -.1], R: [lt > 2.4 ? 2.5 : .3, lt > 2.4 ? .3 : -.1] }, face: { eyes: lt > 2.5 ? 'happy' : 'normal', look: [.8, 0], mouth: lt > 2.5 ? 'grin' : 'smile', blink: blk(t, 1) } }));
  if (place < 1) {
    const px = lerp(bx + 64, FX - 30, place), py = lerp(1381, 1118, place) - Math.sin(place * Math.PI) * 60;
    if (open > .3 || place < .2) drawPot(ctx, px, py + (place < .1 ? 0 : 0), 0.6, { t, steam: 1 - place, shadow: false });
  } else if (open > .05) drawPot(ctx, FX - 30, 1118, .6, { t, steam: .4, shadow: false });
  if (open > .05 && open < .99 || lt < .75) { /* door drawn by fridge */ }
  if (lt > 2.5) { const a = inv(2.5, 2.9, lt); sparkle(ctx, FX - 190, FY - 760, 60 * a, a); sparkle(ctx, FX + 200, FY - 620, 46 * a, a); }
  const kc = inv(2.7, 3.1, lt); if (kc > 0) { ctx.save(); ctx.translate(FX, FY - 760); const sc = backOut(kc); ctx.scale(sc, sc); drawCheck(ctx, 0, 0, 90); ctx.restore(); }
});

// 4 — "Yang bahaya justru membiarkannya di meja": pot on the counter, bugs appear
SH(4, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { x: 540, y: 880, z: 1.12, dz: .04 }); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  drawPot(ctx, 540, 940, 1.3, { t, steam: 1 });
  const nb = lt < .5 ? 0 : lt < 1.4 ? 2 : lt < 2.2 ? 4 : 7;
  const r = rng(21);
  for (let i = 0; i < 7; i++) { const x = 260 + r() * 560, y = 560 + r() * 300; if (i < nb) { const k = inv(.5 + i * .16, .8 + i * .16, lt); if (k > 0) drawBug(ctx, x + Math.sin(t * 2 + i) * 14, y + Math.cos(t * 2.4 + i) * 12, (34 + (i % 3) * 8) * backOut(k), t, { seed: i, look: 0 }); } }
  const ka = inv(.15, .55, lt); if (ka > 0) { ctx.save(); ctx.translate(900, 600); const sc = backOut(ka); ctx.scale(sc, sc); ctx.rotate(.12); path(ctx, [[0, -90], [95, 80], [-95, 80]]); fillStroke(ctx, '#ffd23a', 10); text(ctx, '!', 0, 28, 100, INK, INK, 0); ctx.restore(); }
  drawStick(ctx, C(BUDI, { x: 190, y: 1690, s: 700, face: { eyes: 'wide', look: [.8, -.2], mouth: 'frown', blink: blk(t) }, arms: { L: [.3, -.1], R: [.25, -.1] } }));
});

// 5 — "bakteri paling cepat berkembang": petri dish doubling
SH(5, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .03 });
  applyCam(ctx, cam, .2); const g = ctx.createLinearGradient(0, -300, 0, 2200); g.addColorStop(0, '#1f8a6b'); g.addColorStop(1, '#0d4d4a'); ctx.fillStyle = g; ctx.fillRect(-1500, -1500, 4200, 5200);
  ctx.fillStyle = 'rgba(255,255,255,.07)'; for (let i = 0; i < 30; i++) { circle(ctx, (i * 197) % 1500 - 200, (i * 311) % 2300 - 200, 20 + (i % 4) * 14); ctx.fill(); }
  applyCam(ctx, cam, 1);
  const cx = 540, cy = 880, R = 400;
  circle(ctx, cx, cy, R); const dg = ctx.createRadialGradient(cx - 80, cy - 80, 40, cx, cy, R); dg.addColorStop(0, '#fffbe8'); dg.addColorStop(1, '#f1e3b4'); ctx.fillStyle = dg; ctx.fill(); fillStroke(ctx, null, 14);
  circle(ctx, cx, cy, R - 34); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(34,28,34,.35)'; ctx.stroke();
  const times = [0, .55, .8, 1.05, 1.4]; const counts = [1, 2, 4, 8, 16];
  const rr = rng(5); const pos = []; for (let i = 0; i < 16; i++) { const a = rr() * TAU, d = Math.sqrt(rr()) * (R - 110); pos.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d]); }
  for (let i = 0; i < 16; i++) { let born = 99; for (let k = 0; k < 5; k++) if (i < counts[k]) { born = times[k]; break; } const k = inv(born + .1, born + .4, lt); if (k > 0) drawBug(ctx, pos[i][0], pos[i][1], 52 * backOut(k), t, { seed: i, mood: lt > 1.6 ? 'party' : 'evil', look: 0 }); }
  const cnt = counts.filter((c, k) => lt >= times[k] + .1).pop() || 1;
  if (lt > .5) popText(ctx, 'x2', 880, 400 + Math.sin(t * 5) * 8, 150, inv(.55, .85, lt) + 0, '#ffd23a', INK, .15);
  const clk = inv(.5, .9, lt); if (clk > 0) { ctx.save(); ctx.globalAlpha = clk; ctx.restore(); }
});

// 6 — thermometer: the danger zone 4–60
SH(6, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .02 });
  applyCam(ctx, cam, .2); const g = ctx.createLinearGradient(0, -300, 0, 2200); g.addColorStop(0, '#2a3d8f'); g.addColorStop(1, '#171f52'); ctx.fillStyle = g; ctx.fillRect(-1500, -1500, 4200, 5200);
  ctx.fillStyle = 'rgba(255,255,255,.06)'; for (let i = 0; i < 26; i++) { circle(ctx, (i * 211) % 1500 - 200, (i * 337) % 2300 - 200, 16 + (i % 4) * 12); ctx.fill(); }
  applyCam(ctx, cam, 1);
  const tE = fw(4, '4') - BOUND[6], t60 = fw(4, '60') - BOUND[6], tD = fw(4, 'derajat') - BOUND[6];
  drawThermo(ctx, 540, 1690, 1.2, { t, show: ease(inv(0, 1.4, lt)), l4: inv(tE, tE + .25, lt), l60: inv(t60, t60 + .25, lt), danger: inv(tD, tD + .25, lt) });
  if (lt > tE + .3) { const r = rng(9); for (let i = 0; i < 6; i++) { const k = inv(tE + .3 + i * .1, tE + .6 + i * .1, lt); if (k > 0) drawBug(ctx, 540 + (i % 2 ? 150 : -150) + Math.sin(t * 3 + i) * 30, 700 + i * 95 + Math.cos(t * 3.5 + i) * 18, 44 * backOut(k), t, { seed: i, mood: 'party' }); } }
});

// 7 — clock: more than 2 hours
SH(7, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .025 });
  applyCam(ctx, cam, .2); const g = ctx.createLinearGradient(0, -300, 0, 2200); g.addColorStop(0, '#ffcf5a'); g.addColorStop(1, '#ff8a3d'); ctx.fillStyle = g; ctx.fillRect(-1500, -1500, 4200, 5200);
  ctx.save(); ctx.globalAlpha = .18; ctx.translate(540, 900); ctx.fillStyle = '#fff'; for (let i = 0; i < 16; i++) { ctx.rotate(TAU / 16); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-90, -1500); ctx.lineTo(90, -1500); ctx.closePath(); if (i % 2) ctx.fill(); } ctx.restore();
  applyCam(ctx, cam, 1);
  const tD = fw(5, 'dari'), tJ = fw(5, 'jam'); const p0 = tD - BOUND[7] - .8, p1 = tJ - BOUND[7] + .1;
  const prog = ease(inv(p0, p1, lt));
  drawClock(ctx, 540, 880, 1.45, { prog });
  if (prog > .12) { const nb = Math.floor(prog * 7); const r = rng(3); for (let i = 0; i < 7; i++) { const a = r() * TAU, d = 400 + r() * 120; if (i < nb) { const k = inv(0, .2, prog * 7 - i); drawBug(ctx, 540 + Math.cos(a) * d * .9, 880 + Math.sin(a) * d, 40 * backOut(clamp(k)), t, { seed: i }); } } }
  popText(ctx, '> 2 JAM', 540, 1500, 150, inv(p1 - .25, p1 + .1, lt), '#fff', INK, -.06);
});

// 8 — the plate goes bad
SH(8, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { x: 560, y: 960, z: 1.0, dz: .03 }); kitchenBG(ctx, t, cam, { wallTop: '#d9e8a0', wallBot: '#b9d27a' }); applyCam(ctx, cam, 1);
  table(ctx, 1330);
  const sick = inv(0, 1.2, lt);
  drawPlate(ctx, 640, 1330, 1.7, { sick });
  const r = rng(12); for (let i = 0; i < 9; i++) { const a = r() * TAU; const k = inv(.1 + i * .08, .4 + i * .08, lt); if (k > 0) drawBug(ctx, 640 + Math.cos(a + t * .7) * (250 + r() * 70), 1080 + Math.sin(a + t * .9) * 120, 38 * backOut(k), t, { seed: i }); }
  stink(ctx, 640, 960, 1.4, t, inv(.8, 1.2, lt));
  drawStick(ctx, C(BUDI, { x: 190, y: 1520, s: 620, headTilt: -.1, arms: { L: [.3, -.1], R: { ik: [.1, -.62], bend: -1 } }, face: { eyes: 'squint', mouth: 'frown', look: [1, 0] } }));
  const k = inv(1.0, 1.5, lt); if (k > 0) { ctx.save(); ctx.translate(880, 760); ctx.rotate(.14); const sc = backOut(k); ctx.scale(sc, sc); rrect(ctx, -170, -70, 340, 140, 34); fillStroke(ctx, '#7cc23a', 10); text(ctx, 'BASI!', 0, 4, 90, '#fff', INK, 14); ctx.restore(); }
});

// 9 — "Tapi ada satu catatan." Ibu closeup
SH(9, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 900, dy: -6, z: 1, dz: .03 });
  ctx.save(); ctx.filter = 'blur(7px)'; kitchenBG(ctx, t, cam); ctx.restore(); applyCam(ctx, cam, 1);
  burst(ctx, 540, 760, 640 + Math.sin(t * 6) * 18, 16, '#ffe14d', 6);
  drawStick(ctx, C(IBU, { x: 540, y: 2100, s: 1450, bob: Math.sin(t * 3) * .004, headTilt: -.04, arms: { L: [.2, -.1], R: [2.7 + Math.sin(t * 8) * .12, .35] }, face: { eyes: 'normal', look: [0, 0], mouth: 'smirk', browOne: 1, blink: blk(t, 1) }, shadow: false }));
  popText(ctx, '!', 880, 560, 300, inv(.4, .7, lt), '#e5262a', INK, .14);
});

// 10 — big hot pot raises the fridge temperature
SH(10, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { x: 540, y: 960, z: 1, dz: .03 }); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  const tm = fw(7, 'mengepul') - BOUND[10], tK = fw(7, 'kulkas') - BOUND[10];
  const FX = 540, FY = 1340, FS = 1.35;
  const temp = lerp(.12, .98, ease(inv(tm, tK, lt)));
  drawFridge(ctx, FX, FY, FS, { t, door: 1, mood: lt > tm ? 'hot' : 'worry', temp, look: 0, shake: lt > tm + .6 ? 1.5 : 0, cold: lt > tm ? 0 : .8 });
  const drop = ease(inv(.1, .6, lt));
  drawPot(ctx, FX - 40, lerp(700, 1340 - 222 * FS, drop), 1.0, { t, steam: 1, shadow: false });
  if (lt > tm) for (let i = 0; i < 5; i++) { const p = ((t * .5 + i * .2) % 1); ctx.save(); ctx.globalAlpha = (1 - p) * .55; ctx.beginPath(); for (let j = 0; j <= 10; j++) { const yy = 520 - p * 160 - j * 14, xx = 330 + i * 100 + Math.sin(t * 6 + j * .8 + i) * 12; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 10; ctx.strokeStyle = '#ff6a3c'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  drawStick(ctx, C(BUDI, { x: 130, y: 1620, s: 560, face: { eyes: 'wide', mouth: 'o', look: [1, 0], blink: blk(t) }, arms: { L: [.3, -.1], R: [.3, -.1] } }));
  drawStick(ctx, C(IBU, { x: 950, y: 1620, s: 560, flip: -1, face: { eyes: 'normal', mouth: 'flat', look: [-1, 0], browAng: .3, blink: blk(t, 1) }, arms: { L: [.3, -.1], R: [2.6 + Math.sin(t * 7) * .15, .3] } }));
});

// 11 — ladle the pot into small boxes
SH(11, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { x: 560, y: 960, z: 1, dz: .02 }); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  const bx = [620, 810, 1000], potX = 380, s = 600, ibuX = 590;
  // characters behind the table
  const T0 = .35, step = .85; const stage = i => T0 + i * step;
  let lx = potX, ly = 1180, hold = false, tgt = -1;
  for (let i = 0; i < 3; i++) { const a = stage(i), b = a + step; if (lt >= a && lt < b) { const k = (lt - a) / step; if (k < .5) { lx = lerp(potX, bx[i], ease(k * 2)); ly = 1180 - Math.sin(k * 2 * Math.PI) * 130; hold = true; } else { lx = lerp(bx[i], potX, ease(k * 2 - 1)); ly = 1180 - Math.sin((k * 2 - 1) * Math.PI) * 130; } tgt = i; } }
  const rh = ikT(ibuX, 1500, lx, ly + 40, s, -1);
  drawStick(ctx, C(IBU, { x: ibuX, y: 1500, s, flip: -1, arms: { L: [.3, -.1], R: { ik: rh, bend: 1 } }, legs: standL, face: { eyes: 'normal', look: [-.5, .5], mouth: 'smile', blink: blk(t) } }));
  drawStick(ctx, C(BUDI, { x: 70, y: 1500, s: 520, face: { eyes: lt > 1.5 ? 'happy' : 'normal', mouth: 'grin', look: [1, 0], blink: blk(t, 1) }, arms: { L: [.3, -.1], R: [lt > 2.6 ? 2.5 : .3, lt > 2.6 ? .3 : -.1] } }));
  table(ctx, 1330);
  drawPot(ctx, potX, 1340, .95, { t, steam: clamp(1 - lt / 3.4), shadow: false, lid: false });
  for (let i = 0; i < 3; i++) { const f = clamp((lt - (stage(i) + step * .5)) / .25) * .72; drawBox(ctx, bx[i], 1340, .85, { fill: f, lid: 0, lift: 0, lidRot: 0, shadow: false }); }
  // lid parked behind box (open lids hidden)
  // ladle
  ctx.save(); ctx.translate(lx, ly); ctx.rotate(hold ? .5 : -.2); line(ctx, 0, 0, 0, -190, 12, '#7a5a3c'); ellipse(ctx, 0, 14, 34, 26); fillStroke(ctx, '#cfd7e6', 7); ctx.restore();
});

// 12 — lids snap on
SH(12, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { x: 540, y: 960, z: 1.0, dz: .03 }); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  const bx = [450, 670, 890];
  drawStick(ctx, C(IBU, { x: 190, y: 1500, s: 600, face: { eyes: 'happy', mouth: 'grin' }, arms: { L: [.3, -.1], R: [lt > 1 ? 2.5 : .3, lt > 1 ? .3 : -.1] } }));
  table(ctx, 1330);
  const tT = fw(8, 'tutup') - BOUND[12];
  for (let i = 0; i < 3; i++) {
    const k = ease(inv(tT + i * .16, tT + i * .16 + .28, lt)); drawBox(ctx, bx[i], 1340, 1.1, { fill: .72, lid: k, lift: 260, lidRot: -.25, shadow: false });
    if (k >= 1 && lt - (tT + i * .16 + .28) < .22) sparkle(ctx, bx[i] + 90, 1160, 52, 1 - (lt - (tT + i * .16 + .28)) / .22);
  }
  if (lt > tT + .8) popText(ctx, 'RAPAT!', 700, 880, 130, inv(tT + .8, tT + 1.05, lt), '#fff', INK, -.08);
});

// 13 — into the fridge, door closes, check
SH(13, 'whip', (ctx, lt, t) => {
  const cam = camOf(t, lt, { x: 540, y: 960, z: 1.0, dz: .03 }); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  const FX = 540, FY = 1340, FS = 1.35;
  const tS = fw(8, 'simpan') - BOUND[13], tK = fw(8, 'kulkas') - BOUND[13];
  const door = ease(inv(0, .35, lt)) - ease(inv(tK - .1, tK + .25, lt));
  drawFridge(ctx, FX, FY, FS, { t, door, mood: lt > tK + .2 ? 'joy' : 'happy', cold: door > .5 ? .8 : 0, temp: .1, look: 0 });
  const shelf = [1340 - 330 * FS, 1340 - 222 * FS, 1340 - 116 * FS];
  for (let i = 0; i < 3; i++) { const a = tS - .1 + i * .22, k = ease(inv(a, a + .3, lt)); if (door > .05) { const x = lerp(250 + i * 150, 440 + i * 105 - 20, k), y = lerp(1580 - i * 40, shelf[i], k); if (k > 0) drawBox(ctx, x, y, lerp(1.0, .55, k), { fill: .72, lid: 1, shadow: false }); } }
  const kc = inv(tK + .15, tK + .5, lt); if (kc > 0) { ctx.save(); ctx.translate(FX + 300, FY - 820); const sc = backOut(kc); ctx.scale(sc, sc); drawCheck(ctx, 0, 0, 95); ctx.restore(); sparkle(ctx, FX - 260, FY - 700, 60 * kc, kc); sparkle(ctx, FX + 250, FY - 450, 50 * kc, kc); }
  drawStick(ctx, C(BUDI, { x: 160, y: 1620, s: 560, face: { eyes: 'happy', mouth: 'grin' }, arms: { L: [.3, -.1], R: [lt > tK ? 2.5 : .3, lt > tK ? .3 : -.1] } }));
  drawStick(ctx, C(IBU, { x: 930, y: 1620, s: 560, flip: -1, face: { eyes: 'happy', mouth: 'grin' }, arms: { L: [.3, -.1], R: [.3, -.1] } }));
});

// 14 — CTA: Subscribe Fakta Unik
SH(14, 'cut', (ctx, lt, t) => {
  const cam = camOf(t, lt, { y: 960, z: 1, dz: .01, shake: 2 }); kitchenBG(ctx, t, cam, { wallTop: '#fff0b8', wallBot: '#ffd98a' }); applyCam(ctx, cam, 1);
  const tS = fw(10, 'subscribe') - BOUND[14];
  const k = inv(.1, .6, lt); const sc = backOut(k);
  const subbed = lt > tS + .35, press = lt > tS + .2 && lt < tS + .45 ? 1 : 0;
  ctx.save(); ctx.translate(540, 680); ctx.scale(sc, sc); ctx.translate(-540, -680);
  drawSubBanner(ctx, 540, 680, .98, { subbed, press, ring: subbed ? Math.sin((lt - tS - .35) * 22) * .35 * Math.exp(-(lt - tS - .35) * 2) : 0 }); ctx.restore();
  const w = Math.sin(t * 7);
  drawStick(ctx, C(BUDI, { x: 260, y: 1620, s: 640, face: { eyes: 'happy', mouth: 'grin' }, arms: { L: [.3, -.1], R: [2.4 + w * .25, .35] } }));
  drawStick(ctx, C(IBU, { x: 820, y: 1620, s: 640, flip: -1, face: { eyes: 'happy', mouth: 'grin' }, arms: { L: [2.4 - w * .25, .35], R: [.3, -.1] } }));
  if (subbed) { const r = rng(4); for (let i = 0; i < 46; i++) { const x0 = r() * 1080, v = 300 + r() * 500, ph = r() * TAU, d0 = r() * .6; const tt = lt - tS - .35 - d0; if (tt < 0) continue; const y = -60 + tt * v, x = x0 + Math.sin(tt * 3 + ph) * 40; ctx.save(); ctx.translate(x, y); ctx.rotate(tt * 6 + ph); ctx.fillStyle = ['#ff5a3c', '#ffd23a', '#2cb35e', '#4a8cff', '#ff6fa8'][i % 5]; ctx.fillRect(-12, -7, 24, 14); ctx.restore(); } }
});
