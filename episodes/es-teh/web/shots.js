// ---------- Fakta Unik: "Gelas es teh bocor? Itu embun" (~56 dtk, tanpa CTA) ----------
// Bentuk cerita kedua belas: "komplain salah alamat" (Budi protes ke Bu Warung, ganti gelas berkali-kali gagal, teh panas "membuktikan" teorinya yang salah,
// Rani membongkar dengan sirup merah). Warung = warungBG + mejaWarung (env_pedas.js); tokoh baru Bu Warung (kerudung, env_esteh.js).
// Dunia mikro: uap air berwajah menabrak dinding gelas dingin -> jadi titik air; di gelas panas memantul. Loop: shot terakhir = hook dengan waktu negatif.
const SHOTS = [];
const easeInOut = x => x * x * (3 - 2 * x);
const BUDI = { cols: ['#2f9b5a', '#2f9b5a'], hat: 'tuft', hatCol: INK, belt: false };
const C = (b, e) => Object.assign({}, b, e);
const LN = {}; WORDS.forEach(w => { (LN[w.line] = LN[w.line] || []).push(w); });
const ls = i => LN[i][0].s;
const nrm = s => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const fw = (i, str, n = 0) => { const w = LN[i].filter(w => nrm(w.w) === str)[n]; if (!w) throw new Error('kata tidak ada di baris ' + i + ': ' + str); return w.s; };
const wt = (i, str, d = 0, n = 0) => fw(i, str, n) + d;
const ENDT = WORDS[WORDS.length - 1].e + .6;
const SH = (s, e, o, draw) => SHOTS.push(Object.assign({ start: s, end: e, draw }, o));
const CK = (t, keys, sh = 2) => camKeys(t, t, keys, sh);
const _warned = new Set();
const gapCheck = (keys, seed) => { for (let i = 1; i < keys.length; i++) if (keys[i][0] - keys[i - 1][0] < .55 && !_warned.has(seed)) { _warned.add(seed); console.log('PERINGATAN ekspresi seed ' + seed + ': jarak ganti ' + (keys[i][0] - keys[i - 1][0]).toFixed(2) + ' dtk < 0,55'); } };
const EF = (t, keys, seed) => (gapCheck(keys, seed), exprTrack(t, keys, { seed, saccade: false, idleBlink: false }));
const EM = (t, keys, seed) => (gapCheck(keys, seed), exprTrack(t, keys, { seed, saccade: false }));
const FT = PD.back, S = 600, TOP = PD.top;
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, FT, S, flip, wx, wy, bend);
const standL = { L: [.1, -.04], R: [.1, -.04] };
function tokoh(ctx, t, P, x, face, arms, flip = 1, extra = {}) { drawStick(ctx, C(P, Object.assign({ x, y: FT, s: S, flip, armLen: 1.3, legs: standL, arms: arms || idleArms(t, x * .01), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
const scrTag = (ctx, str, k, col = '#ffd23a', y = 250, size = 104) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, str, 540, y, size, k, col, INK, -.05); ctx.restore(); };
const scr = (ctx, f) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); f(ctx); ctx.restore(); };
const sfxS = (ctx, ...a) => scr(ctx, c => sfxText(c, ...a));
const win = (t, a, b, f = .15) => inv(a, a + f, t) * (1 - inv(b - .1, b, t));
const tagSeq = (ctx, t, list, y = 250) => list.forEach(([str, a, b, col, size]) => scrTag(ctx, str, inv(a, a + .15, t) * (b == null ? 1 : 1 - inv(b - .1, b, t)), col || '#fff', y, size || 104));
const inCam = (ctx, cam, f) => { ctx.save(); applyCam(ctx, cam, 1); f(ctx); ctx.restore(); };
function panah(c, x1, y1, x2, y2, col = '#ffd23a') { const a = Math.atan2(y2 - y1, x2 - x1); line(c, x1, y1, x2, y2, 22, INK); line(c, x1, y1, x2, y2, 12, col); c.save(); c.translate(x2, y2); c.rotate(a); c.beginPath(); c.moveTo(26, 0); c.lineTo(-18, -26); c.lineTo(-18, 26); c.closePath(); fillStroke(c, col, 6); c.restore(); }
const GB = ET.glassB, GR = ET.glassR, GH = ET.hot;
// tetes yang jatuh dari dasar gelas (periodik)
function tetesJatuh(c, t, x, y0, y1, n = 3, k = 1) { if (k <= 0) return; for (let i = 0; i < n; i++) { const q = ((t * 1.6 + i / n) % 1 + 1) % 1; c.save(); c.globalAlpha = k; drawTitikAir(c, x - 24 + i * 24, lerp(y0, y1, q * q), 9); c.restore(); } }

// ===== warung: o: { fR, armsR, rx, rExtra, fW, armsW, wx, wExtra, fB, armsB, bx, bExtra, table(c), after(c) }
function warung(ctx, t, cam, o = {}) {
  warungBG(ctx, t, cam);
  if (o.behind) o.behind(ctx);
  if (o.fW) tokoh(ctx, t, BU_WAR, o.wx == null ? ET.buwar : o.wx, o.fW, o.armsW, 1, o.wExtra || {});
  if (o.fR) tokoh(ctx, t, RANI, o.rx == null ? ET.rani : o.rx, o.fR, o.armsR, 1, o.rExtra || {});
  if (o.fB) tokoh(ctx, t, BUDI, o.bx == null ? ET.budi : o.bx, o.fB, o.armsB, -1, o.bExtra || {});
  mejaWarung(ctx);
  if (o.table) o.table(ctx);
  if (o.after) o.after(ctx);
}

// ===== 0 HOOK: Es teh Budi bocor, padahal gelasnya nggak retak =====
const H0 = { es: wt(0, 'es'), bu: wt(0, 'budi'), bo: wt(0, 'bocor'), pa: wt(0, 'padahal'), ge: wt(0, 'gelasnya'), ng: wt(0, 'nggak'), re: wt(0, 'retak') };
const cam0 = tl => CK(tl, [[-3, { x: 740, y: 1180, z: 1.5 }], [-.3, { x: 740, y: 1180, z: 1.5 }], [0, { x: 745, y: 1190, z: 1.55 }, easeOut], [H0.pa, { x: 760, y: 1160, z: 1.65 }, ease], [ls(1), { x: 780, y: 1130, z: 1.6 }, easeIn]], 2);
function hookScene(ctx, t, cam, tl) {
  const slide = easeOut(inv(-1, -.45, tl)), sweat = tl < 0 ? inv(-.55, 0, tl) : 1, lift = easeInOut(inv(H0.pa - .1, H0.ge + .15, tl)), spin = tl > H0.ge ? Math.sin((tl - H0.ge) * 5) * .25 : 0;
  const gx = lerp(lerp(GB[0] - 260, GB[0], slide), 770, lift), gy = lerp(TOP, 1110, lift);
  warung(ctx, t, cam, {
    fW: EF(tl, [[-9, 'netral', { look: [.6, .4] }], [.15, 'curiga', { look: [.7, .3] }]], 1),
    armsW: tl < -.4 ? { R: armTo(ET.buwar, 1, gx - 40, TOP - 90, 1), L: [.3, -.3] } : null,
    fB: EM(tl, [[-9, 'netral', { look: [-.6, .5] }], [-.05, 'kaget', { look: [-.6, .7] }], [H0.ge, 'curiga', { look: [-.5, .1] }]], 2),
    armsB: lift > 0 ? { R: armTo(ET.budi, -1, gx + 10, gy - 110, -1), L: armTo(ET.budi, -1, gx + 40, gy - 60, -1) } : { R: armTo(ET.budi, -1, GB[0] + 90, TOP - 40, -1), L: [.3, -.3] },
    table: c => {
      drawGenangan(c, GB[0], TOP + 8, 1, tl < 0 ? Math.max(0, sweat * .35) : .5 + Math.min(.4, tl * .12));
      drawGelasEs(c, gx, gy, 1, { t, liquid: 'teh', ice: true, sweat, drip: sweat, rot: spin });
      if (lift > .5) tetesJatuh(c, t, gx, gy + 10, TOP, 3, 1);
    } });
  if (tl > H0.re - .05) scr(ctx, c => { const p = toScreen(cam, gx, gy - 100); glint(c, p[0] + 60, p[1] - 80, 60, tl, H0.re); });
}
SH(0, ls(1), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  tagSeq(ctx, t, [['BOCOR?!', -.2, H0.pa, '#ffd23a', 130], ['NGGAK RETAK!', H0.ng - .05, null, '#fff', 112]]);
  const p = toScreen(cam, GB[0], TOP); sfxS(ctx, 'TES TES', p[0] - 150, p[1] - 40, 62, win(t, -.2, H0.pa), '#bfe9ff', .1);
});

// ===== 1 Dia protes: "Bu, gelasnya bocor!" =====
const T1 = { di: wt(1, 'dia'), pr: wt(1, 'protes'), bu: wt(1, 'bu'), ge: wt(1, 'gelasnya'), bo: wt(1, 'bocor') };
SH(ls(1), ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(1), { x: 690, y: 1120, z: 1.35 }], [T1.bu, { x: 680, y: 1110, z: 1.45 }, ease], [ls(2), { x: 670, y: 1110, z: 1.5 }, easeIn]], 2);
  const shake = t > T1.bu ? Math.sin(t * 26) * 14 : 0, g = [770 - 40 * inv(T1.bu - .1, T1.bu + .2, t) + shake, 1080];
  warung(ctx, t, cam, {
    fW: EM(t, [[ls(1), 'netral', { look: [.7, 0] }], [T1.bo + .05, 'kaget', { look: [.7, .1] }]], 3),
    fB: EM(t, [[ls(1), 'curiga', { look: [-.8, 0] }], [T1.bu, 'ngeden', { look: [-.9, 0] }]], 4), bExtra: { lean: -.05 * inv(T1.bu - .1, T1.bu + .2, t) },
    armsB: { R: armTo(ET.budi, -1, g[0] + 10, g[1] - 110, -1), L: [.3, -.3] },
    table: c => { drawGenangan(c, GB[0], TOP + 8, 1, .6); drawGelasEs(c, g[0], g[1], 1, { t, liquid: 'teh', ice: true, sweat: 1, drip: 1 }); tetesJatuh(c, t, g[0], g[1] + 10, TOP, 3, 1); } });
  tagSeq(ctx, t, [['PROTES!', T1.pr - .05, T1.bu, '#fff', 112], ['BU, BOCOR!', T1.bu - .05, null, '#ff8a8a', 120]]);
});

// ===== 2 Ganti gelas baru, basah lagi. Ganti gelas plastik, tetap basah. =====
const T2 = { g1: wt(2, 'ganti'), ba: wt(2, 'baru'), bs: wt(2, 'basah'), la: wt(2, 'lagi'), g2: wt(2, 'ganti', 0, 1), pl: wt(2, 'plastik'), te: wt(2, 'tetap'), bs2: wt(2, 'basah', 0, 1) };
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(2), { x: 640, y: 1170, z: 1.75 }], [T2.g2, { x: 660, y: 1180, z: 1.8 }, ease], [ls(3), { x: 670, y: 1180, z: 1.85 }, easeIn]], 2);
  const sw1 = easeOut(inv(T2.g1 - .1, T2.ba + .1, t)), sw2 = easeOut(inv(T2.g2 - .1, T2.pl + .1, t));
  const wet1 = easeOut(inv(T2.bs - .2, T2.la + .1, t)), wet2 = easeOut(inv(T2.te - .2, T2.bs2 + .1, t));
  const hand = sw2 > 0 && sw2 < 1 ? lerp(GB[0] - 180, GB[0], sw2) : sw1 < 1 ? lerp(GB[0] - 180, GB[0], sw1) : null;
  warung(ctx, t, cam, {
    fW: EM(t, [[ls(2), 'datar', { look: [.6, .5] }], [T2.la, 'curiga', { look: [.5, .6] }], [T2.bs2, 'datar', { look: [.8, .1] }]], 5),
    armsW: hand != null ? { R: armTo(ET.buwar, 1, hand - 30, TOP - 100, 1), L: [.3, -.3] } : null,
    fB: EF(t, [[ls(2), 'curiga', { look: [-.6, .5] }]], 6),
    table: c => {
      // gelas lama pergi ke kanan, gelas baru masuk dari kiri, lalu plastik
      if (sw1 < 1) drawGelasEs(c, GB[0] + sw1 * 300, TOP, 1, { t, liquid: 'teh', ice: true, sweat: 1, drip: 1 });
      drawGenangan(c, GB[0], TOP + 8, 1, sw2 > 0 ? Math.max(wet1 * .4, wet2 * .5) : wet1 * .45);
      if (sw2 < 1) drawGelasEs(c, lerp(GB[0] - 180, GB[0], sw1) + sw2 * 300, TOP, 1, { t, liquid: 'teh', ice: true, sweat: wet1, drip: wet1 });
      if (sw2 > 0) drawGelasEs(c, lerp(GB[0] - 180, GB[0], sw2), TOP, 1, { t, liquid: 'teh', ice: true, plastik: true, sweat: wet2, drip: wet2 });
    } });
  tagSeq(ctx, t, [['GELAS BARU', T2.g1 - .05, T2.bs, '#fff', 110], ['BASAH LAGI', T2.bs - .05, T2.g2, '#bfe9ff', 110], ['GELAS PLASTIK', T2.g2 - .05, T2.te, '#fff', 104], ['TETAP BASAH', T2.te - .05, null, '#bfe9ff', 110]]);
});

// ===== 3 Budi pesan teh panas, gelasnya kering =====
const T3 = { bu: wt(3, 'budi'), pe: wt(3, 'pesan'), te: wt(3, 'teh'), pa: wt(3, 'panas'), ge: wt(3, 'gelasnya'), ke: wt(3, 'kering') };
SH(ls(3), ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(3), { x: 660, y: 1150, z: 1.6 }], [T3.ge, { x: 640, y: 1180, z: 1.85 }, ease], [ls(4), { x: 640, y: 1185, z: 1.9 }, easeIn]], 2);
  const app = backOut(inv(T3.te - .15, T3.pa + .1, t)), touch = easeInOut(inv(T3.ge - .1, T3.ke, t));
  warung(ctx, t, cam, {
    fW: EF(t, [[ls(3), 'datar', { look: [.6, .4] }]], 7),
    fB: EM(t, [[ls(3), 'netral', { look: [-.7, .4] }], [T3.ke, 'sombong', { look: [-.6, .4] }]], 8),
    armsB: touch > 0 ? { R: armTo(ET.budi, -1, lerp(820, GH[0] + 75, touch), lerp(1200, TOP - 110, touch), -1), L: [.3, -.3] } : null,
    table: c => { drawGenangan(c, GB[0] + 60, TOP + 8, 1, .5); drawGelasEs(c, GB[0] + 60, TOP, .9, { t, liquid: 'teh', ice: true, plastik: true, sweat: 1, drip: 1 });
      if (app > 0) drawGelasEs(c, GH[0], TOP, Math.max(.01, app), { t, liquid: 'panas', fill: .8, steam: 1 }); } });
  inCam(ctx, cam, c => { const k = backOut(inv(T3.ke, T3.ke + .25, t)); if (k > 0) { c.save(); c.translate(GH[0] - 10, TOP - 270); c.scale(k, k); drawCheck(c, 0, 0, 50); c.restore(); } });
  tagSeq(ctx, t, [['TEH PANAS', T3.te - .05, T3.ge, '#ffb070', 112], ['KERING!', T3.ke - .05, null, '#9dff7a', 130]]);
});

// ===== 4 "Tuh kan, gelas esnya yang bermasalah!" =====
const T4 = { tu: wt(4, 'tuh'), ka: wt(4, 'kan'), ge: wt(4, 'gelas'), es: wt(4, 'esnya'), be: wt(4, 'bermasalah') };
SH(ls(4), ls(5), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(4), { x: 760, y: 1130, z: 1.55 }], [T4.ge, { x: 740, y: 1150, z: 1.7 }, ease], [ls(5), { x: 735, y: 1155, z: 1.75 }, easeIn]], 2);
  warung(ctx, t, cam, {
    fW: EF(t, [[ls(4), 'datar', { look: [.7, 0] }]], 9),
    fB: EM(t, [[ls(4), 'sombong', { look: [-.5, -.2] }], [T4.ge, 'licik', { look: [-.7, .5] }]], 10), armsB: { R: [1.6, .1], L: [.3, -.3] },
    table: c => { drawGenangan(c, GB[0] + 60, TOP + 8, 1, .55); drawGelasEs(c, GB[0] + 60, TOP, .9, { t, liquid: 'teh', ice: true, plastik: true, sweat: 1, drip: 1, face: EF(t, [[ls(4), 'netral', { look: [.6, -.3] }], [T4.be, 'cemas', { look: [.6, -.4] }]], 11) });
      drawGelasEs(c, GH[0], TOP, 1, { t, liquid: 'panas', fill: .8, steam: 1 }); } });
  tagSeq(ctx, t, [['TUH KAN!', T4.tu - .05, T4.ge, '#fff', 124], ['GELAS ES BERMASALAH', T4.ge - .05, null, '#ff8a8a', 84]]);
});

// ===== 5 Rani nyengir, terus ngisi gelas es pakai sirup merah =====
const T5 = { ra: wt(5, 'rani'), ny: wt(5, 'nyengir'), te: wt(5, 'terus'), ng: wt(5, 'ngisi'), ge: wt(5, 'gelas'), es: wt(5, 'es'), pa: wt(5, 'pakai'), si: wt(5, 'sirup'), me: wt(5, 'merah') };
function botolSirup(c, x, y, rot, k) {   // botol sirup merah (dipegang, dimiringkan)
  c.save(); c.translate(x, y); c.rotate(rot); rrect(c, -40, -60, 80, 170, 18); fillStroke(c, ETP.syrup, 7); rrect(c, -16, -110, 32, 56, 8); fillStroke(c, ETP.syrup, 6); rrect(c, -20, -126, 40, 22, 6); fillStroke(c, '#fff', 5);
  rrect(c, -34, -10, 68, 60, 8); fillStroke(c, '#fffaf0', 4); text(c, 'SIRUP', 0, 30, 22, '#e0263a', null, 0); c.restore();
  if (k > 0) { const sx = x + Math.sin(rot) * 126, sy = y - Math.cos(rot) * 126; line(c, sx, sy, GR[0], TOP - 150, 14 * k, ETP.syrup); }
}
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 360, y: 1100, z: 1.6 }], [T5.ng, { x: 380, y: 1140, z: 1.75 }, ease], [ls(6), { x: 385, y: 1150, z: 1.85 }, easeIn]], 2);
  const pour = inv(T5.ng - .2, T5.ng + .1, t) * (1 - inv(T5.me + .3, ls(6), t)), fill = inv(T5.ng, T5.me + .3, t);
  const bx = 470, by = 990 - pour * 20, rot = lerp(-.3, -2.3, pour);
  warung(ctx, t, cam, {
    fR: EM(t, [[ls(5), 'netral', { look: [.7, 0] }], [T5.ny, 'licik', { look: [.6, .4] }]], 12), armsR: { R: armTo(ET.rani, 1, bx - 30, by + 40, 1), L: [.3, -.3] },
    fW: EF(t, [[ls(5), 'curiga', { look: [-.8, .3] }]], 13), wx: 700,
    table: c => { drawGelasEs(c, GR[0], TOP, 1, { t, liquid: 'sirup', fill: fill * .85, ice: true }); },
    after: c => botolSirup(c, bx, by, rot, pour > .5 ? 1 : 0) });
  tagSeq(ctx, t, [['NYENGIR', T5.ny - .05, T5.ng, '#fff', 110], ['SIRUP MERAH', T5.si - .05, null, '#ff6a7a', 112]]);
});

// ===== 6 Kalau bocor, yang keluar harusnya merah. Ternyata airnya tetap bening. =====
const T6 = { ka: wt(6, 'kalau'), bo: wt(6, 'bocor'), ya: wt(6, 'yang'), ke: wt(6, 'keluar'), ha: wt(6, 'harusnya'), me: wt(6, 'merah'), te: wt(6, 'ternyata'), ai: wt(6, 'airnya'), tt: wt(6, 'tetap'), be: wt(6, 'bening') };
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(6), { x: GR[0], y: TOP - 110, z: 2.6 }], [T6.te, { x: GR[0] + 10, y: TOP - 105, z: 2.75 }, ease], [ls(7), { x: GR[0] + 20, y: TOP - 100, z: 2.8 }, easeIn]], 1);
  const ghost = inv(T6.ke - .1, T6.ha + .1, t) * (1 - inv(T6.te - .1, T6.te + .1, t)), sw = easeOut(inv(T6.te - .1, T6.ai + .2, t)), lup = backOut(inv(T6.tt - .1, T6.tt + .2, t));
  warung(ctx, t, cam, { table: c => drawGelasEs(c, GR[0], TOP, 1, { t, liquid: 'sirup', fill: .85, ice: true, sweat: sw, ghostRed: ghost }) });
  scr(ctx, c => { if (ghost > 0) { c.save(); c.globalAlpha = ghost; drawX(c, 860, 760, 70, 1); c.restore(); }
    if (lup > 0) { c.save(); c.translate(760, 820); c.scale(lup, lup); drawKacaPembesar(c, 0, 0, 200, cc => { cc.fillStyle = '#e8f4ff'; cc.fillRect(-200, -200, 400, 400); cc.fillStyle = 'rgba(224,38,58,.35)'; cc.fillRect(-200, -200, 120, 400);
      for (const [x, y, r] of [[10, -40, 46], [90, 60, 34], [-10, 110, 26], [100, -110, 24]]) drawTitikAir(cc, x, y + r, r); }); c.restore(); } });
  tagSeq(ctx, t, [['HARUSNYA MERAH', T6.ha - .05, T6.te, '#ff6a7a', 100], ['TETAP BENING!', T6.tt - .05, null, '#bfe9ff', 116]]);
});

// ===== 7 Berarti airnya bukan dari dalam gelas, tapi dari udara =====
const T7 = { be: wt(7, 'berarti'), ai: wt(7, 'airnya'), bu: wt(7, 'bukan'), da: wt(7, 'dari'), dl: wt(7, 'dalam'), ge: wt(7, 'gelas'), ta: wt(7, 'tapi'), dr: wt(7, 'dari', 0, 1), ud: wt(7, 'udara') };
SH(ls(7), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(7), { x: GR[0] + 40, y: TOP - 130, z: 2.0 }], [T7.ta, { x: GR[0] + 30, y: TOP - 140, z: 1.9 }, ease], [ls(8), { x: GR[0] + 20, y: TOP - 160, z: 1.7 }, easeIn]], 2);
  const kIn = inv(T7.bu - .1, T7.bu + .2, t) * (1 - inv(T7.ta - .1, T7.ta + .1, t)), kOut = easeOut(inv(T7.dr - .1, T7.ud + .3, t));
  warung(ctx, t, cam, { fR: EF(t, [[ls(7), 'sombong', { look: [.7, .4] }]], 14), table: c => drawGelasEs(c, GR[0], TOP, 1, { t, liquid: 'sirup', fill: .85, ice: true, sweat: 1 }) });
  inCam(ctx, cam, c => {
    if (kIn > 0) { c.save(); c.globalAlpha = kIn; panah(c, GR[0], TOP - 100, GR[0] + 150, TOP - 100, '#ff6a7a'); drawX(c, GR[0] + 110, TOP - 100, 34, 1); c.restore(); }
    if (kOut > 0) for (let i = 0; i < 5; i++) { const a = -1.5 + i * .45, r0 = 330 - 80 * kOut, r1 = 120; c.save(); c.globalAlpha = Math.min(1, kOut * 2); panah(c, GR[0] + Math.cos(a) * r0, TOP - 100 + Math.sin(a) * r0 * .9, GR[0] + Math.cos(a) * (r1 + 40 * (1 - kOut)), TOP - 100 + Math.sin(a) * r1 * .9, '#bfe9ff'); c.restore(); }
  });
  tagSeq(ctx, t, [['BUKAN DARI DALAM', T7.bu - .05, T7.ta, '#ff8a8a', 96], ['DARI UDARA!', T7.dr - .05, null, '#bfe9ff', 120]]);
});

// ===== 8 Udara di sekitar kita penuh uap air yang nggak kelihatan =====
const T8 = { ud: wt(8, 'udara'), se: wt(8, 'sekitar'), pe: wt(8, 'penuh'), ua: wt(8, 'uap'), ai: wt(8, 'air'), ng: wt(8, 'nggak'), ke: wt(8, 'kelihatan') };
const VAP = (() => { const r = rng(77), a = []; for (let i = 0; i < 30; i++) a.push([r() * 1500 - 200, 300 + r() * 1100, 30 + r() * 28, r() * TAU]); return a; })();
function uapMelayang(c, t, a, faceK = 0) { VAP.forEach(([x, y, rr, ph], i) => drawUap(c, x + Math.sin(t * .8 + ph) * 40, y + Math.cos(t * .6 + ph) * 30, rr, { t: t + i, a, face: i % 4 === 0 && faceK > 0 ? EXPR.netral : null })); }
SH(ls(8), ls(9), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(8), { x: 540, y: 1160, z: 1.12 }], [T8.ua, { x: 540, y: 1150, z: 1.18 }, ease], [ls(9), { x: 520, y: 1150, z: 1.24 }, easeIn]], 2);
  const a = inv(T8.pe - .1, T8.ua + .2, t) * (1 - .6 * inv(T8.ng - .1, T8.ke + .2, t));
  warung(ctx, t, cam, { fR: EF(t, [[ls(8), 'netral', { look: [.4, -.6] }], [T8.ua, 'takjub']], 15), fW: EF(t, [[ls(8), 'netral', { look: [0, -.6] }], [T8.ua + .05, 'takjub']], 16), fB: EF(t, [[ls(8), 'curiga', { look: [-.4, -.6] }], [T8.ua + .1, 'kaget']], 17),
    table: c => { drawGelasEs(c, GR[0], TOP, 1, { t, liquid: 'sirup', fill: .85, ice: true, sweat: 1 }); drawGelasEs(c, GB[0] + 60, TOP, .9, { t, liquid: 'teh', ice: true, plastik: true, sweat: 1 }); },
    behind: c => uapMelayang(c, t, a, 1) });
  tagSeq(ctx, t, [['PENUH UAP AIR', T8.pe - .05, T8.ng, '#bfe9ff', 104], ['NGGAK KELIHATAN', T8.ng - .05, null, '#fff', 100]]);
});

// ===== 9 Begitu kena gelas dingin, uap itu berubah jadi titik air dan nempel di luar gelas =====
const T9 = { be: wt(9, 'begitu'), ke: wt(9, 'kena'), ge: wt(9, 'gelas'), di: wt(9, 'dingin'), ua: wt(9, 'uap'), it: wt(9, 'itu'), br: wt(9, 'berubah'), ja: wt(9, 'jadi'), ti: wt(9, 'titik'), ai: wt(9, 'air'), da: wt(9, 'dan'), ne: wt(9, 'nempel'), lu: wt(9, 'luar') };
const STUCK = [[440, 560], [455, 760], [438, 1010], [450, 1180], [445, 380], [460, 1560], [442, 1700], [452, 880]];
SH(ls(9), ls(10), { tr: 'portal', zoomOut: { x: 540, y: 960, w: 600, h: 1067 } }, (ctx, lt, t) => {
  scr(ctx, c => { const z = lerp(1.05, 1, inv(ls(9), ls(10), t)); c.translate(540, 960); c.scale(z, z); c.translate(-540, -960); dindingBG(c, t, { hot: 0 });
    // tokoh utama: satu uap berwajah meluncur ke dinding lalu berubah jadi titik air
    const go = easeInOut(inv(ls(9), T9.di, t)), tf = easeOut(inv(T9.br - .1, T9.ti + .1, t)), x = lerp(900, 470, go), y = 900;
    if (tf < 1) drawUap(c, x, y, 110 * (1 - tf * .6), { t, shiver: t > T9.di ? 1 - tf : 0, a: 1 - tf * .4, face: EM(t, [[ls(9), 'bangga', { look: [-.8, 0] }], [T9.di, 'meringis']], 18) });
    if (tf > 0) drawTitikAir(c, 470, 900 + 70, 60 * tf + .01, { face: tf > .6 ? EF(t, [[T9.ti, 'lega']], 19) : null, t });
    // uap lain menyusul dan menempel
    const nk = inv(T9.da - .2, T9.lu + .3, t);
    STUCK.forEach(([sx, sy], i) => { const q = clamp(nk * 1.6 - i * .1); if (q <= 0) return; if (q < .7) drawUap(c, lerp(1000, sx + 20, q / .7), sy, 50, { t: t + i, shiver: q > .5 ? 1 : 0 }); else drawTitikAir(c, sx, sy + 30, 32); });
    if (t > T9.di - .05 && t < T9.br) sfxText(c, 'BRRR', 640, 720, 70, inv(T9.di - .05, T9.di + .1, t), '#bfe9ff', -.1);
  });
  tagSeq(ctx, t, [['KENA GELAS DINGIN', T9.ke - .05, T9.br, '#bfe9ff', 92], ['JADI TITIK AIR', T9.br - .05, T9.da, '#fff', 104], ['NEMPEL!', T9.ne - .05, null, '#ffd23a', 130]]);
});

// ===== 10 Sama kayak rumput yang basah tiap pagi =====
const T10 = { sa: wt(10, 'sama'), ka: wt(10, 'kayak'), ru: wt(10, 'rumput'), ba: wt(10, 'basah'), ti: wt(10, 'tiap'), pa: wt(10, 'pagi') };
SH(ls(10), ls(11), { tr: 'whip' }, (ctx, lt, t) => {
  scr(ctx, c => { const z = lerp(1.12, 1.0, easeOut(inv(ls(10), ls(11), t))); c.translate(540, 1300); c.scale(z, z); c.translate(-540, -1300); rumputBG(c, t, inv(ls(10), ls(11), t)); });
  tagSeq(ctx, t, [['RUMPUT', T10.ru - .05, T10.ba, '#9dff7a', 116], ['BASAH TIAP PAGI', T10.ba - .05, null, '#fff', 100]]);
});

// ===== 11 Gelas teh panas tetap kering, karena luarnya nggak dingin =====
const T11 = { ge: wt(11, 'gelas'), te: wt(11, 'teh'), pa: wt(11, 'panas'), tt: wt(11, 'tetap'), ke: wt(11, 'kering'), ka: wt(11, 'karena'), lu: wt(11, 'luarnya'), ng: wt(11, 'nggak'), di: wt(11, 'dingin') };
SH(ls(11), ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  scr(ctx, c => { dindingBG(c, t, { hot: 1 });
    for (let i = 0; i < 4; i++) { const ph = ((t - ls(11)) * .55 + i * .27) % 1, q = ph < .5 ? ph * 2 : 2 - ph * 2, x = lerp(1000, 500, easeOut(q)), y = 520 + i * 330 + Math.sin(t * 2 + i) * 20;
      drawUap(c, x, y, i === 1 ? 100 : 60, { t: t + i, face: i === 1 ? EF(t, [[ls(11), 'netral', { look: [-.8, 0] }], [T11.ke, 'bangga']], 20) : null });
      if (q > .95) sfxText(c, 'BOING', x + 40, y - 80, 46, 1, '#fff', -.1); }
  });
  tagSeq(ctx, t, [['GELAS PANAS', T11.ge - .05, T11.tt, '#ffb070', 110], ['TETAP KERING', T11.tt - .05, T11.ka, '#9dff7a', 110], ['NGGAK DINGIN', T11.ka - .05, null, '#fff', 110]]);
});

// ===== 12 Dan makin lembap udaranya, makin banyak airnya =====
const T12 = { da: wt(12, 'dan'), ma: wt(12, 'makin'), le: wt(12, 'lembap'), ud: wt(12, 'udaranya'), m2: wt(12, 'makin', 0, 1), ba: wt(12, 'banyak'), ai: wt(12, 'airnya') };
SH(ls(12), ls(13), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(12), { x: GB[0] + 60, y: TOP - 150, z: 1.9 }], [T12.m2, { x: GB[0] + 60, y: TOP - 130, z: 2.05 }, ease], [ls(13), { x: GB[0] + 50, y: TOP - 125, z: 2.1 }, easeIn]], 2);
  const k = easeInOut(inv(T12.ma - .1, T12.ai + .2, t));
  warung(ctx, t, cam, { table: c => { drawGenangan(c, GB[0] + 60, TOP + 8, 1, lerp(.3, 1.1, k)); drawGelasEs(c, GB[0] + 60, TOP, 1, { t, liquid: 'teh', ice: true, plastik: true, sweat: lerp(.4, 1, k), drip: k }); },
    behind: c => uapMelayang(c, t, lerp(.15, .6, k)) });
  scr(ctx, c => drawHigrometer(c, 850, 620, .85, lerp(.35, .95, k)));
  tagSeq(ctx, t, [['MAKIN LEMBAP', T12.ma - .05, T12.m2, '#bfe9ff', 110], ['MAKIN BANYAK AIR', T12.m2 - .05, null, '#fff', 100]]);
});

// ===== 13 Jadi solusinya bukan ganti gelas, cukup kasih tatakan =====
const T13 = { ja: wt(13, 'jadi'), so: wt(13, 'solusinya'), bu: wt(13, 'bukan'), ga: wt(13, 'ganti'), ge: wt(13, 'gelas'), cu: wt(13, 'cukup'), ka: wt(13, 'kasih'), ta: wt(13, 'tatakan') };
SH(ls(13), ls(14), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(13), { x: 620, y: 1150, z: 1.5 }], [T13.ka, { x: 660, y: 1200, z: 1.75 }, ease], [ls(14), { x: 670, y: 1210, z: 1.85 }, easeIn]], 2);
  const slide = easeOut(inv(T13.ka - .2, T13.ta + .1, t)), wipe = inv(T13.cu - .2, T13.ta, t), lift = Math.sin(clamp(inv(T13.ka - .2, T13.ta, t)) * Math.PI) * 40;
  warung(ctx, t, cam, {
    fW: EM(t, [[ls(13), 'datar', { look: [.6, .3] }], [T13.ta, 'bangga', { look: [.6, .5] }]], 21), armsW: slide > 0 && slide < 1 ? { R: armTo(ET.buwar, 1, lerp(GB[0] - 160, GB[0] - 40, slide), TOP - 30, 1), L: [.3, -.3] } : null,
    fB: EF(t, [[ls(13), 'curiga', { look: [-.6, .4] }]], 22),
    table: c => { drawGenangan(c, GB[0], TOP + 8, 1, .6 * (1 - wipe)); if (slide > 0) drawTatakan(c, lerp(GB[0] - 160, GB[0], slide), TOP, 1); drawGelasEs(c, GB[0], TOP - (slide > 0 ? 8 : 0) - lift, 1, { t, liquid: 'teh', ice: true, sweat: 1 }); } });
  scr(ctx, c => { const p = toScreen(cam, GB[0] + 80, TOP - 30); glint(c, p[0], p[1], 60, t, T13.ta); });
  tagSeq(ctx, t, [['BUKAN GANTI GELAS', T13.bu - .05, T13.cu, '#ff8a8a', 92], ['CUKUP TATAKAN!', T13.cu - .05, null, '#ffd23a', 112]]);
});

// ===== 14a Budi malu, minta maaf, terus pesan es teh lagi, =====
const T14 = { bu: wt(14, 'budi'), ma: wt(14, 'malu'), mi: wt(14, 'minta'), mf: wt(14, 'maaf'), te: wt(14, 'terus'), pe: wt(14, 'pesan'), es: wt(14, 'es'), th: wt(14, 'teh'), la: wt(14, 'lagi'), da: wt(14, 'dan') };
SH(ls(14), T14.da, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(14), { x: 720, y: 1120, z: 1.45 }], [T14.pe, { x: 720, y: 1110, z: 1.55 }, ease], [T14.da, { x: 740, y: 1170, z: 1.52 }, easeIn]], 2);
  const bow = Math.sin(clamp(inv(T14.mi - .1, T14.te, t)) * Math.PI), order = backOut(inv(T14.pe - .1, T14.es + .1, t));
  warung(ctx, t, cam, {
    fW: EM(t, [[ls(14), 'bangga', { look: [.7, .1] }], [T14.pe + .1, 'datar', { look: [.7, 0] }]], 23),
    fB: EM(t, [[ls(14), { eyes: 'flinch', mouth: 'wobble', browAng: .25, blush: 1 }], [T14.pe, 'bangga', { look: [-.7, -.2] }]], 24), bExtra: { lean: -bow * .35 },
    armsB: t > T14.pe - .1 ? { R: [lerp(.3, 2.6, order), lerp(-.3, .3, order)], L: [.3, -.3] } : null,
    table: c => { drawTatakan(c, GB[0], TOP, 1); drawGelasEs(c, GB[0], TOP - 8, 1, { t, liquid: 'teh', ice: true, sweat: 1, fill: lerp(.85, .1, inv(ls(14), T14.te, t)) }); } });
  tagSeq(ctx, t, [['MAAF, BU...', T14.mi - .05, T14.pe, '#ff9ad0', 112], ['ES TEH LAGI!', T14.es - .05, null, '#ffd23a', 112]]);
});
// ===== 14b dan -> komposisi frame 0 (loop) =====
SH(T14.da, ENDT, { tr: 'whip' }, (ctx, lt, t) => {
  const tl = t - ENDT + 1 / 30;
  hookScene(ctx, t, cam0(tl), tl);
  scrTag(ctx, 'BOCOR?!', inv(-.2, 0, tl), '#ffd23a', 250, 130);
});
