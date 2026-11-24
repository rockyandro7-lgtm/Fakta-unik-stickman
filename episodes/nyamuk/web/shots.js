// ---------- Fakta Unik: "Nyamuk: darah manis?" (~56 dtk, tanpa CTA) ----------
// Bentuk cerita ketujuh: "diet konyol seminggu" (Budi berhenti makan manis + makan bawang putih mentah, Rani yang paling manis justru aman).
// Frame 0 = teras malam, bertiga, kawanan nyamuk hanya mengitari Budi yang menepuk-nepuk. Akhir: komposisi yang sama (loop).
// Mekanisme: darah buat telur (bukan gula) -> napas dari jauh -> bau kulit dari dekat -> dunia mikro bakteri kulit -> racikan beda tiap orang.
// Aturan v5/v6/v7: kamera selalu bergerak, semua waktu dari kata (wt), satu fungsi per aset (env_nyamuk.js), tata letak NY terkunci.
const SHOTS = [];
const easeInOut = x => x * x * (3 - 2 * x);
const BUDI = { cols: ['#2f9b5a', '#2f9b5a'], hat: 'tuft', hatCol: INK, belt: false };
const IBU = { cols: ['#ec5b86', '#ec5b86'], hat: 'chef', belt: false, blush: true };
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
const EC = (t, keys, seed) => (gapCheck(keys, seed), exprTrack(t, keys, { seed }));
const _blurBuf = document.createElement('canvas'); _blurBuf.width = W; _blurBuf.height = H; const _bctx = _blurBuf.getContext('2d');
function blurLayer(ctx, draw, px) {
  _bctx.setTransform(1, 0, 0, 1, 0, 0); _bctx.filter = 'none'; _bctx.globalAlpha = 1; _bctx.clearRect(0, 0, W, H); draw(_bctx);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = `blur(${px}px)`; ctx.drawImage(_blurBuf, -W * .02, -H * .02, W * 1.04, H * 1.04); ctx.restore();
}
const scrTag = (ctx, str, k, col = '#ffd23a', y = 330, size = 104) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, str, 540, y, size, k, col, INK, -.05); ctx.restore(); };
const scr = (ctx, f) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); f(ctx); ctx.restore(); };
const sfxS = (ctx, ...a) => scr(ctx, c => sfxText(c, ...a));   // teks bunyi selalu di koordinat layar
const win = (t, a, b, f = .15) => inv(a, a + f, t) * (1 - inv(b - .1, b, t));   // muncul di a, hilang sebelum b
const tagSeq = (ctx, t, list, y = 330) => list.forEach(([str, a, b, col, size]) => scrTag(ctx, str, inv(a, a + .15, t) * (b == null ? 1 : 1 - inv(b - .1, b, t)), col || '#fff', y, size || 104));

// ===== tata letak tokoh =====
const FT = NY.back, S = 600, IX = NY.ibu, RX = NY.rani, BX = NY.budi, ARM = 1.6;
const HEADY = FT - .765 * S;                           // pusat kepala (dunia) = 1041
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, FT, S, flip, wx, wy, bend);
const standL = { L: [.1, -.04], R: [.1, -.04] };
function tokoh(ctx, t, P, x, face, arms, flip = 1, extra = {}) { drawStick(ctx, C(P, Object.assign({ x, y: FT, s: S, flip, armLen: ARM, legs: standL, arms: arms || idleArms(t, x * .01), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
// Budi menepuk nyamuk: dua tangan bergantian di atas kepala (k 0..1 = intensitas)
const swatArms = (t, k = 1) => { const a = Math.sin(t * 11), b = Math.sin(t * 11 + 2.4); return { R: [lerp(.3, 2.3 + .55 * a, k), lerp(-.3, .55 + .3 * a, k)], L: [lerp(.3, 2.2 + .55 * b, k), lerp(-.3, .6 + .3 * b, k)] }; };
const MOUTH_B = [BX - 18, HEADY + 42];                  // mulut Budi (menghadap kiri)
const crossArms = { L: [.9, 2.0], R: [.9, 2.0] };       // tangan bersedekap (bangga)

// ===== set teras bersama =====
// o: { pagi, cal, calTop, fI, armsI, fR, armsR, rx, flipR, fB, armsB, bx, flipB, bExtra, hideIbu, hideRani, hideBudi, glass: {i,r,b}, held, extra, swarm: {n, cx, cy, rx, ry, s, enter, face, from}, under, after }
function teras(ctx, t, cam, o = {}) {
  terasBG(ctx, t, cam, { pagi: o.pagi, cal: o.cal, calTop: o.calTop });
  if (o.under) o.under(ctx);
  if (!o.hideIbu) tokoh(ctx, t, IBU, o.ix == null ? IX : o.ix, o.fI || EXPR.netral, o.armsI, o.flipI || 1);
  if (!o.hideRani) tokoh(ctx, t, RANI, o.rx == null ? RX : o.rx, o.fR || EXPR.netral, o.armsR, o.flipR || 1, o.rExtra || {});
  if (!o.hideBudi) tokoh(ctx, t, BUDI, o.bx == null ? BX : o.bx, o.fB || EXPR.netral, o.armsB, o.flipB || -1, o.bExtra || {});
  if (o.held) o.held(ctx);
  mejaTeras(ctx);
  const g = o.glass || {};
  if (g.i !== false) drawGelasTeh(ctx, NY.glassI[0], NY.glassI[1], .8, Object.assign({ t, fill: .6 }, g.i || {}));
  if (g.r !== false) drawGelasTeh(ctx, NY.glassR[0], NY.glassR[1], .8, Object.assign({ t, sugar: 3 }, g.r || {}));
  if (g.b !== false) drawGelasTeh(ctx, NY.glassB[0], NY.glassB[1], .8, Object.assign({ t, fill: .4 }, g.b || {}));
  if (o.extra) o.extra(ctx);
  if (o.swarm) { const w = o.swarm; nyamukSwarm(ctx, w.cx == null ? BX : w.cx, w.cy == null ? HEADY - 20 : w.cy, w.n, w.t == null ? t : w.t, w); }
  if (o.after) o.after(ctx);
}

// ===== 0 HOOK: bertiga di teras, tapi yang dirubung nyamuk cuma Budi =====
const H0 = { be: wt(0, 'bertiga'), te: wt(0, 'teras'), ta: wt(0, 'tapi'), di: wt(0, 'dirubung'), ny: wt(0, 'nyamuk'), cu: wt(0, 'cuma'), bu: wt(0, 'budi') };
const cam0 = tl => CK(tl, [[-3, { x: 575, y: 1020, z: 1.26 }], [0, { x: 575, y: 1020, z: 1.28 }, easeOut], [H0.ta, { x: 610, y: 1030, z: 1.34 }, ease], [H0.ny, { x: 740, y: 1040, z: 1.5 }, ease], [H0.bu, { x: 800, y: 1020, z: 1.72 }, ease], [ls(1), { x: 805, y: 1015, z: 1.78 }, easeIn]], 2.2);
// tl < 0 = persiapan (dipakai di akhir video untuk loop); semua gerak fungsi dari tl sehingga frame akhir = frame 0
function hookScene(ctx, t, cam, tl) {
  teras(ctx, tl, cam, {
    fI: EF(tl, [[-9, 'lega']], 1), armsI: idleArms(tl, 1, .6),
    fR: EF(tl, [[-9, 'netral', { look: [.8, -.1] }], [H0.cu, 'datar', { look: [.8, -.2] }]], 2),
    fB: EM(tl, [[-9, 'meringis'], [H0.ny, 'cemas', { look: [.3, -.8] }], [H0.bu, 'meringis']], 3), armsB: swatArms(tl, 1),
    glass: { r: { steam: .6 } },
    swarm: { n: 9, rx: 195, ry: 175, s: .68, cy: HEADY - 40 }
  });
}
SH(0, ls(1), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  sfxS(ctx, 'NGIIING', 850, 640, 60, win(t, -.2, H0.ta), '#fff', .1);
  tagSeq(ctx, t, [['BERTIGA', -.2, H0.ta], ['CUMA BUDI?!', H0.cu, null, '#ffd23a', 110]]);
});

// ===== 1 Rani ngakak: "Darahmu kemanisan, Bud! Kebanyakan teh!" =====
const T1 = { ra: wt(1, 'rani'), ng: wt(1, 'ngakak'), da: wt(1, 'darahmu'), ke: wt(1, 'kemanisan'), bu: wt(1, 'bud'), kb: wt(1, 'kebanyakan'), te: wt(1, 'teh') };
SH(ls(1), ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(1), { x: 740, y: 1040, z: 1.35 }], [ls(2), { x: 760, y: 1040, z: 1.45 }]], 3);
  blurLayer(ctx, c => teras(c, t, cam, { hideRani: true, hideIbu: true, fB: EF(t, [[ls(1), 'meringis']], 4), armsB: swatArms(t, 1), swarm: { n: 9, rx: 230, ry: 190, s: .55, cy: HEADY - 40 } }), 9);
  scr(ctx, c => {
    const laugh = inv(T1.ng - .1, T1.ng + .1, t), sh = laugh * Math.sin(t * 34) * 9;
    // gelas teh Budi melompat dengan gula berjatuhan (kanan atas)
    const gk = backOut(inv(T1.kb - .1, T1.kb + .2, t)), nS = Math.floor(8 * inv(T1.kb, T1.te + .3, t));
    if (gk > 0) { drawGelasTeh(c, 800, 980, 1.9 * gk + .01, { t, sugar: nS, fill: .8, face: EF(t, [[T1.kb, 'cemas']], 5) });
      for (let i = 0; i < 3; i++) { const q = ((t - T1.kb) * 1.6 + i * .33) % 1; if (t > T1.kb) drawGula(c, 760 + i * 40, 520 + q * 300, 22, { rot: q * 3 + i }); } }
    // gula berwajah = "darah manis"
    const dk = win(t, T1.ke, T1.kb + .05);
    if (dk > 0) { const s = backOut(dk); drawTetesDarah(c, 790, 700, 120 * s + .01, { face: EF(t, [[T1.ke, 'bangga']], 6), t }); for (let i = 0; i < 4; i++) { const a = i * 1.6 + t * 2; drawGula(c, 790 + Math.cos(a) * 190, 700 + Math.sin(a) * 160, 26 * s + .01, { rot: a }); } }
    drawStick(c, C(RANI, { x: 230 + sh, y: 2250, s: 1800, shadow: false, flip: 1, armLen: 1.3, arms: { L: [.2, -.1], R: [lerp(.3, 1.85, easeOut(inv(T1.da - .2, T1.da + .1, t))), .1] },
      face: EC(t, [[ls(1), 'licik', { look: [.8, -.3] }], [T1.ng, { eyes: 'happy', mouth: 'teeth', browUp: .5 }], [T1.bu, { eyes: 'happy', mouth: 'grin', browUp: .8 }]], 7), headTilt: -.06 + laugh * Math.sin(t * 17) * .05 }));
  });
  sfxS(ctx, 'WKWKWK', 300, 520, 74, win(t, T1.ng, T1.da + .2), '#fff', -.12);
  tagSeq(ctx, t, [['DARAH MANIS?', T1.da, T1.kb, '#ff8a8a', 100], ['KEBANYAKAN TEH!', T1.kb, null, '#ffd23a', 92]]);
});

// ===== 2 Budi langsung sumpah: seminggu nggak minum manis =====
const T2 = { bu: wt(2, 'budi'), la: wt(2, 'langsung'), su: wt(2, 'sumpah'), se: wt(2, 'seminggu'), ng: wt(2, 'nggak'), mi: wt(2, 'minum'), ma: wt(2, 'manis') };
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(2), { x: 760, y: 1010, z: 1.7 }], [T2.su, { x: 780, y: 990, z: 1.95 }, easeOut], [T2.ma, { x: 760, y: 1000, z: 2.0 }, ease], [ls(3), { x: 755, y: 1000, z: 2.05 }, easeIn]], 2);
  const raise = easeOut(inv(T2.la, T2.su + .1, t));
  teras(ctx, t, cam, {
    fR: EF(t, [[ls(2), 'sombong', { look: [.8, 0] }]], 8),
    fB: EM(t, [[ls(2), 'meringis'], [T2.la, 'ngeden', { look: [-.3, -.4] }], [T2.se, 'sombong', { look: [-.6, 0] }]], 9),
    armsB: { R: raise > 0 ? [lerp(.3, 2.75, raise), lerp(-.3, .25, raise)] : [.3, -.3], L: [lerp(.3, 1.2, raise), lerp(-.3, 1.6, raise)] },
    swarm: { n: 9 * (1 - inv(T2.la, T2.su, t)) + .01, rx: 260, ry: 210, s: .5, cy: HEADY - 40, from: [1400, 400] },
    extra: c => { const g = backOut(inv(T2.ma - .1, T2.ma + .2, t)); if (g > 0) { drawGula(c, BX - 260, 1150, 46 * g + .01, { face: EF(t, [[T2.ma, 'cemas']], 10), t }); drawX(c, BX - 260, 1150, 70, inv(T2.ma + .1, T2.ma + .3, t)); } }
  });
  ctx.save(); applyCam(ctx, cam, 1); glint(ctx, BX + 90, HEADY - 250, 90, t, T2.su); ctx.restore();
  tagSeq(ctx, t, [['SUMPAH!', T2.su, T2.se, '#fff', 130], ['7 HARI', T2.se, T2.ng, '#ffd23a', 130], ['TANPA MANIS', T2.ng, null, '#ff8a8a', 110]]);
});

// ===== 3a teh manis diganti air putih (pagi) =====
const T3 = { te: wt(3, 'teh'), ma: wt(3, 'manis'), di: wt(3, 'diganti'), ai: wt(3, 'air'), pu: wt(3, 'putih'), pe: wt(3, 'permen'), sa: wt(3, 'sama'), ku: wt(3, 'kue'), db: wt(3, 'dibuang'), se: wt(3, 'semua') };
SH(ls(3), T3.pe, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(3), { x: 960, y: 1180, z: 2.4 }], [T3.di, { x: 960, y: 1190, z: 2.7 }, easeOut], [T3.pe, { x: 955, y: 1195, z: 2.85 }, easeIn]], 2);
  const tea = 1 - easeInOut(inv(T3.di, T3.pu + .2, t));
  teras(ctx, t, cam, { pagi: 1, hideIbu: true, hideRani: true, hideBudi: true,
    glass: { i: false, r: false, b: { tea, fill: .85, sugar: Math.round(4 * tea), face: EF(t, [[ls(3), 'netral'], [T3.ai, 'lega']], 12) } } });
  ctx.save(); applyCam(ctx, cam, 1); glint(ctx, NY.glassB[0] + 20, NY.glassB[1] - 120, 80, t, T3.pu); ctx.restore();
  tagSeq(ctx, t, [['TEH MANIS', ls(3) - .1, T3.di, '#ffb05a', 110], ['AIR PUTIH', T3.ai, null, '#bfe9ff', 120]]);
});
// ===== 3b permen sama kue dibuang semua =====
const BINX = NY.bin[0], BUDI_T = BINX + 330;
const ITEMS = [[BUDI_T - 140, 'p', NYP.candy1], [BUDI_T - 70, 'k'], [BUDI_T - 210, 'p', NYP.candy2], [BUDI_T - 10, 'p', NYP.candy3]];
SH(T3.pe, ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[T3.pe, { x: BINX + 220, y: 1120, z: 1.6 }], [T3.db, { x: BINX + 170, y: 1110, z: 1.7 }, ease], [ls(4), { x: BINX + 150, y: 1100, z: 1.78 }, easeIn]], 2);
  const lid = easeOut(inv(T3.db - .2, T3.db, t)) * (1 - easeIn(inv(T3.se + .3, ls(4) - .05, t)));
  teras(ctx, t, cam, { pagi: 1, hideIbu: true, hideRani: true, bx: BUDI_T, flipB: -1, glass: { i: false, r: false, b: false },
    fB: EM(t, [[T3.pe, 'curiga', { look: [-.5, .6] }], [T3.db, 'ngeden', { look: [-.8, .3] }], [T3.se, 'bangga']], 13),
    armsB: { R: armTo(BUDI_T, -1, BUDI_T - 120 - 60 * Math.sin(Math.min(1, inv(T3.db, T3.se + .3, t)) * Math.PI * 3), 1150 - 80 * inv(T3.db, T3.db + .2, t), -1), L: [.3, -.3] },
    extra: c => {
      drawTongSampah(c, BINX, NY.top, .9, { lid, t, face: EF(t, [[T3.pe, 'netral'], [T3.se, 'bangga']], 14) });
      ITEMS.forEach(([x0, kind, col], i) => {
        const app = backOut(inv((kind === 'k' ? T3.ku : T3.pe) + i * .08 - .1, (kind === 'k' ? T3.ku : T3.pe) + i * .08 + .15, t)); if (app <= 0) return;
        const f = easeInOut(inv(T3.db + i * .14, T3.db + i * .14 + .42, t)); if (f >= 1) return;
        const x = lerp(x0, BINX, f), y = lerp(NY.top - 30, NY.top - 230, f) - Math.sin(f * Math.PI) * 330, rot = f * 8 + i;
        if (kind === 'k') drawKue(c, x, y, .8 * app, rot); else drawPermen(c, x, y, .8 * app, rot, col);
      });
    } });
  sfxS(ctx, 'BUANG!', 330, 640, 90, win(t, T3.db, ls(4) + 1), '#fff', -.1);
  tagSeq(ctx, t, [['PERMEN', T3.pe, T3.ku, '#ff8ab0', 110], ['KUE', T3.ku, T3.db, '#ffd23a', 130], ['DIBUANG SEMUA', T3.db, null, '#fff', 96]]);
});

// ===== 4 biar makin ampuh, tiap pagi dia nelen bawang putih mentah =====
const T4 = { bi: wt(4, 'biar'), ma: wt(4, 'makin'), am: wt(4, 'ampuh'), ti: wt(4, 'tiap'), pa: wt(4, 'pagi'), di: wt(4, 'dia'), ne: wt(4, 'nelen'), ba: wt(4, 'bawang'), pu: wt(4, 'putih'), me: wt(4, 'mentah') };
const BX4 = 560;
SH(ls(4), ls(5), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(4), { x: BX4 - 60, y: 1010, z: 1.9 }], [T4.ti, { x: BX4 - 60, y: 1000, z: 2.05 }, ease], [T4.ne, { x: BX4 - 40, y: 1010, z: 2.25 }, ease], [ls(5), { x: BX4 - 30, y: 1015, z: 2.35 }, easeIn]], 2);
  const lift = easeOut(inv(ls(4) - .1, T4.am, t)), bulb = [BX4 - 200, lerp(1250, 1030, lift)];
  const fl = easeInOut(inv(T4.ne - .15, T4.ba + .05, t)), mouth = [BX4 - 18, HEADY + 42];
  const day = 1 + Math.floor(5.99 * inv(T4.ti, T4.me, t));
  teras(ctx, t, cam, { pagi: 1, hideIbu: true, hideRani: true, bx: BX4, glass: { i: false, r: false, b: false },
    fB: EM(t, [[ls(4), 'licik', { look: [-.8, 0] }], [T4.ne, { eyes: 'wide', mouth: 'o', browUp: .5 }], [T4.me, 'meringis']], 15),
    armsB: { R: armTo(BX4, -1, bulb[0] + 50, bulb[1] + 70, -1), L: fl > 0 && fl < 1 ? armTo(BX4, -1, lerp(bulb[0] + 20, mouth[0] - 30, fl), lerp(bulb[1], mouth[1] + 20, fl), 1) : [.3, -.3] },
    bExtra: { headTilt: inv(T4.me, T4.me + .2, t) * Math.sin(t * 30) * .05 },
    after: c => {
      drawBawangPutih(c, bulb[0], bulb[1], .9, { t, face: EF(t, [[ls(4), 'netral'], [T4.ne, 'kaget']], 16) });
      if (fl > 0 && fl < 1) drawBawangPutih(c, lerp(bulb[0] + 20, mouth[0], fl), lerp(bulb[1] - 40, mouth[1], fl), .7, { siung: true, rot: fl * 4 });
      if (t > T4.me) for (let i = 0; i < 3; i++) { const q = ((t - T4.me) * 1.4 + i / 3) % 1; drawNapasBau(c, mouth[0] - 60 - q * 160, mouth[1] - q * 120, 40 + q * 30, { t, a: (1 - q) * inv(T4.me, T4.me + .2, t) }); }
    } });
  if (t > T4.ti) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, 'HARI ' + day, 540, 300, 110, inv(T4.ti, T4.ti + .12, t), '#fff', INK, -.05); ctx.restore(); }
  else scrTag(ctx, 'BIAR AMPUH', inv(T4.am - .2, T4.am, t), '#ffd23a', 300, 110);
  scrTag(ctx, 'BAWANG PUTIH MENTAH', inv(T4.ba, T4.ba + .15, t), '#e9ffb0', 470, 70);
  sfxS(ctx, 'GLEK', 780, 640, 80, win(t, T4.ba, T4.me + .3), '#fff', -.12);
});

// ===== 5 hari ketujuh, Budi duduk lagi di teras. Napasnya bau bawang =====
const T5 = { ha: wt(5, 'hari'), ke: wt(5, 'ketujuh'), bu: wt(5, 'budi'), du: wt(5, 'duduk'), te: wt(5, 'teras'), na: wt(5, 'napasnya'), ba: wt(5, 'bau'), bw: wt(5, 'bawang') };
const breathK = t => inv(T5.na - .1, T5.na + .3, t);
function breathClouds(c, t, k, n = 3) { for (let i = 0; i < n; i++) { const q = ((t * .55 + i / n) % 1); drawNapasBau(c, MOUTH_B[0] - 60 - q * 420, MOUTH_B[1] - 20 - q * 140 + Math.sin(t * 2 + i) * 20, 50 + q * 60, { t: t + i, a: k * (1 - q) }); } }
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 560, y: 1060, z: 1.15 }], [T5.bu, { x: 590, y: 1050, z: 1.22 }, easeOut], [T5.na, { x: 640, y: 1040, z: 1.32 }, ease], [ls(6), { x: 660, y: 1035, z: 1.38 }, easeIn]], 2);
  const bk = breathK(t), cover = easeOut(inv(T5.ba - .1, T5.ba + .2, t));
  teras(ctx, t, cam, { cal: '1', calTop: 'DES',
    fI: EF(t, [[ls(5), 'netral', { look: [.8, 0] }], [T5.ba + .05, 'meringis']], 17), armsI: cover > 0 ? { R: armTo(IX, 1, IX + 30, HEADY + 50, -1), L: [.3, -.3] } : undefined,
    fR: EF(t, [[ls(5), 'curiga', { look: [.8, 0] }], [T5.ba + .1, 'meringis']], 18), armsR: cover > 0 ? { R: armTo(RX, 1, RX + 30, HEADY + 50, -1), L: [.3, -.3] } : undefined,
    fB: EM(t, [[ls(5), 'bangga'], [T5.na, 'sombong', { look: [-.6, 0] }]], 19), armsB: crossArms,
    glass: { b: { tea: 0, fill: .7 } },
    after: c => breathClouds(c, t, bk) });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, 'HARI 7', 540, 300, 120, inv(T5.ha, T5.ha + .12, t) * (1 - inv(T5.na - .1, T5.na, t)), '#fff', INK, -.05); ctx.restore();
  scrTag(ctx, 'BAU BAWANG', inv(T5.ba, T5.ba + .15, t), '#e9ffb0', 300, 110);
});

// ===== 6 satu nyamuk datang. Dua. Sepuluh. Semuanya ke Budi =====
const T6 = { sa: wt(6, 'satu'), ny: wt(6, 'nyamuk'), da: wt(6, 'datang'), du: wt(6, 'dua'), se: wt(6, 'sepuluh'), sm: wt(6, 'semuanya'), bu: wt(6, 'budi') };
const arrive6 = i => i === 0 ? T6.sa - .2 : i === 1 ? T6.du - .35 : T6.se - .45 + (i - 2) * .1;
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(6), { x: 760, y: 1020, z: 1.55 }], [T6.du, { x: 790, y: 1010, z: 1.7 }, ease], [T6.se, { x: 810, y: 1000, z: 1.9 }, ease], [ls(7), { x: 800, y: 1005, z: 2.0 }, easeIn]], 2.4);
  const n = t < T6.du - .35 ? 1 : t < T6.se - .45 ? 2 : 10, sw = inv(T6.sm - .2, T6.sm + .1, t);
  teras(ctx, t, cam, { cal: '1', calTop: 'DES',
    fR: EF(t, [[ls(6), 'curiga', { look: [.8, -.2] }]], 20), fI: EF(t, [[ls(6), 'meringis']], 21), armsI: { R: armTo(IX, 1, IX + 30, HEADY + 50, -1), L: [.3, -.3] },
    fB: EM(t, [[ls(6), 'sombong', { look: [.6, -.5] }], [T6.du, 'kaget', { look: [.6, -.6] }], [T6.se, 'cemas', { look: [.2, -.8] }], [T6.sm, 'meringis']], 22),
    armsB: sw > 0 ? swatArms(t, sw) : crossArms, glass: { b: { tea: 0, fill: .7 } },
    swarm: { n, rx: 230, ry: 190, s: .55, cy: HEADY - 40, enter: i => inv(arrive6(i), arrive6(i) + .55, t), from: [1450, 300] },
    after: c => breathClouds(c, t, .55, 2) });
  const cnt = t < T6.du ? '1' : t < T6.se ? '2' : '10!';
  if (t > T6.sa) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, cnt, 540, 320, 170, inv(t < T6.du ? T6.sa : t < T6.se ? T6.du : T6.se, (t < T6.du ? T6.sa : t < T6.se ? T6.du : T6.se) + .12, t) * (1 - inv(T6.sm - .1, T6.sm, t)), cnt === '10!' ? '#ff6a5a' : '#fff', INK, -.05); ctx.restore(); }
  scrTag(ctx, 'SEMUA KE BUDI', inv(T6.sm, T6.sm + .15, t), '#ffd23a', 320, 100);
  sfxS(ctx, 'PLAK!', 300, 700, 80, win(t, T6.sm + .1, ls(7) + 1), '#fff', -.12);
});

// ===== 7 Rani nyeruput teh paling manis, nggak digigit sekalipun =====
const T7 = { ra: wt(7, 'rani'), ny: wt(7, 'nyeruput'), te: wt(7, 'teh'), pa: wt(7, 'paling'), ma: wt(7, 'manis'), ng: wt(7, 'nggak'), di: wt(7, 'digigit'), se: wt(7, 'sekalipun') };
SH(ls(7), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(7), { x: 520, y: 1020, z: 1.7 }], [T7.pa, { x: 500, y: 1010, z: 1.85 }, easeOut], [T7.ng, { x: 520, y: 1000, z: 1.8 }, ease], [ls(8), { x: 530, y: 1000, z: 1.85 }, easeIn]], 2);
  const lift = easeOut(inv(T7.ra, T7.ny + .1, t)), sip = inv(T7.ny, T7.te, t) * (1 - inv(T7.pa + .3, T7.ma, t));
  const gh = [lerp(NY.glassR[0], RX + 80, lift), lerp(NY.glassR[1], HEADY + 150, lift) - 40 * sip];
  // satu nyamuk mendekati Rani, mengendus, lalu putar balik ke Budi
  const app = easeOut(inv(T7.ma - .3, T7.ng + .1, t)), back = easeInOut(inv(T7.di + .1, T7.se + .5, t));
  const mx = lerp(lerp(1000, RX + 180, app), 1150, back), my = lerp(lerp(780, HEADY - 70, app), 820, back);
  teras(ctx, t, cam, {
    fI: EF(t, [[ls(7), 'lega']], 23),
    fR: EM(t, [[ls(7), 'sombong', { look: [.3, .4] }], [T7.ny, 'lega'], [T7.ng, 'datar', { look: [.8, -.4] }], [T7.se, 'bangga']], 24),
    armsR: { R: armTo(RX, 1, gh[0] - 20, gh[1] - 40, -1), L: [.3, -.3] },
    fB: EF(t, [[ls(7), 'meringis']], 25), armsB: swatArms(t, 1), glass: { r: false, b: { tea: 0, fill: .7 } },
    held: c => drawGelasTeh(c, gh[0], gh[1], .8, { t, sugar: 9, fill: .9, rot: -.5 * sip, glow: inv(T7.pa, T7.pa + .2, t) * (1 - inv(T7.ng - .1, T7.ng, t)) }),
    swarm: { n: 9, rx: 230, ry: 190, s: .55, cy: HEADY - 40 },
    after: c => drawNyamuk(c, mx, my, .7, { t, flip: back > .02 ? 1 : -1, sniff: inv(T7.ng, T7.ng + .1, t) * (1 - back), face: EF(t, [[ls(7), 'curiga', { look: [-.8, 0] }], [T7.di, 'datar']], 26) }) });
  if (t > T7.ng && t < T7.se + .6) { ctx.save(); applyCam(ctx, cam, 1); qmark(ctx, mx - 30, my - 110, 1, -.1, inv(T7.ng, T7.ng + .15, t)); ctx.restore(); }
  tagSeq(ctx, t, [['PALING MANIS', T7.pa, T7.ng, '#ffd23a', 104], ['0 GIGITAN', T7.se - .1, null, '#9dff7a', 130]]);
  sfxS(ctx, 'SRUUPUT', 270, 620, 70, win(t, T7.ny, T7.pa + .2), '#fff', -.12);
});

// ===== 8a jadi begini: nyamuk ngisap darah =====
const T8 = { ja: wt(8, 'jadi'), be: wt(8, 'begini'), ny: wt(8, 'nyamuk'), ng: wt(8, 'ngisap'), da: wt(8, 'darah'), bu: wt(8, 'buat'), bi: wt(8, 'bikin'), te: wt(8, 'telur'), bk: wt(8, 'bukan'), nr: wt(8, 'nyari'), ma: wt(8, 'manisnya') };
function polosBG(c, t, col1 = '#2a2f5e', col2 = '#4a3f7a') { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, col1); g.addColorStop(1, col2); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.save(); c.globalAlpha = .18; for (let i = 0; i < 14; i++) { circle(c, (i * 233 + t * 20) % W, (i * 389) % H, 50 + (i % 3) * 30); c.fillStyle = '#ffffff'; c.fill(); } c.restore(); }
SH(ls(8), T8.bu, { tr: 'whip' }, (ctx, lt, t) => {
  const z = lerp(1, 1.1, inv(ls(8), T8.bu, t)), pop = backOut(inv(ls(8) - .15, ls(8) + .25, t));
  const suck = easeInOut(inv(T8.ng, T8.da + .4, t));
  scr(ctx, c => { polosBG(c, t); c.translate(540, 900); c.scale(z, z); c.translate(-540, -900);
    if (suck > 0 && suck < 1) drawTetesDarah(c, 840, lerp(1200, 900, suck), 70 * (1 - suck * .7));
    drawNyamuk(c, 520, 860 + Math.sin(t * 3) * 14, 3.2 * pop + .01, { t, full: suck, face: EF(t, [[T8.ny, 'netral', { look: [.6, .3] }], [T8.da, 'bangga']], 27) });
  });
  tagSeq(ctx, t, [['JADI BEGINI', ls(8) - .1, T8.ny, '#fff', 110], ['NGISAP DARAH', T8.ng, null, '#ff8a8a', 104]], 300);
});
// ===== 8b buat bikin telur, bukan nyari manisnya =====
SH(T8.bu, ls(9), { tr: 'whip' }, (ctx, lt, t) => {
  const z = lerp(1.05, 1.12, inv(T8.bu, ls(9), t)), eggs = 18 * easeOut(inv(T8.te - .1, T8.te + .5, t)), gk = backOut(inv(T8.nr - .1, T8.nr + .2, t));
  scr(ctx, c => { polosBG(c, t); c.translate(540, 900); c.scale(z, z); c.translate(-540, -900);
    drawNyamuk(c, 600, 600 + Math.sin(t * 3) * 10, 2.9, { t, full: 1, face: EF(t, [[T8.bu, 'bangga'], [T8.ma, 'datar', { look: [-.8, .5] }]], 28) });
    drawTelurNyamuk(c, 560, 1000, 1.6, eggs, t);
    if (gk > 0) { drawGula(c, 240, 1150, 70 * gk + .01, { rot: -.15, face: EF(t, [[T8.nr, 'cemas']], 29), t }); drawX(c, 240, 1150, 110, inv(T8.ma, T8.ma + .15, t)); }
  });
  tagSeq(ctx, t, [['BUAT TELUR', T8.te - .1, T8.bk, '#fff', 110], ['BUKAN GULA', T8.bk, null, '#ffd23a', 110]], 300);
});

// ===== 9a dari jauh, dia ngikutin napas kita =====
const T9 = { d1: wt(9, 'dari'), ja: wt(9, 'jauh'), ng: wt(9, 'ngikutin'), na: wt(9, 'napas'), ki: wt(9, 'kita'), d2: wt(9, 'dari', 0, 1), de: wt(9, 'dekat'), ny: wt(9, 'nyium'), ba: wt(9, 'bau'), ku: wt(9, 'kulit') };
const TRAIL = q => [lerp(BX - 20, 2350, q), HEADY + 20 - 260 * q + Math.sin(q * 9) * 60];
SH(ls(9), T9.d2, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(9), { x: 1250, y: 950, z: .42 }], [T9.ng, { x: 1150, y: 980, z: .5 }, easeOut], [T9.d2, { x: 1000, y: 1000, z: .62 }, easeIn]], 1);
  const trailK = easeOut(inv(T9.ja - .2, T9.na + .3, t)), mq = lerp(.78, .42, easeInOut(inv(T9.ng - .2, T9.d2, t)));
  teras(ctx, t, cam, { cal: '1', calTop: 'DES', fB: EF(t, [[ls(9), 'meringis']], 30), armsB: swatArms(t, .6), swarm: { n: 6, rx: 230, ry: 190, s: .55, cy: HEADY - 40 },
    after: c => {
      for (let i = 0; i < 14; i++) { const q = ((t * .18 + i / 14) % 1); if (q > trailK) continue; const [x, y] = TRAIL(q); drawNapasBau(c, x, y, 70 + q * 40, { t: t + i, a: (1 - q * .6) * .85, col: 'rgba(235,240,255,.75)', colDk: 'rgba(150,170,220,.8)' }); }
      const [mx, my] = TRAIL(mq); drawNyamuk(c, mx, my - 90, 5, { t, flip: -1, sniff: 1, face: EF(t, [[ls(9), 'curiga', { look: [-.8, .2] }], [T9.na, 'takjub', { look: [-.8, .2] }]], 31) });
    } });
  tagSeq(ctx, t, [['DARI JAUH', ls(9) - .1, T9.na, '#fff', 110], ['NAPAS', T9.na, null, '#bfe9ff', 140]], 300);
});
// ===== 9b dari dekat, dia nyium bau kulit -> portal ke kulit =====
const ARMB = [BX - 210, 1270];
SH(T9.d2, ls(10), { tr: 'portal', zoomOut: { x: 540, y: 960, w: 160, h: 284 } }, (ctx, lt, t) => {
  const cam = CK(t, [[T9.d2, { x: ARMB[0] + 60, y: 1180, z: 2.0 }], [T9.ny, { x: ARMB[0] + 30, y: 1220, z: 2.5 }, easeOut], [ls(10), { x: ARMB[0], y: ARMB[1] - 10, z: 3.4 }, easeIn]], 1.5);
  const land = easeOut(inv(T9.de - .1, T9.ny, t)), mx = lerp(ARMB[0] + 260, ARMB[0] + 60, land), my = lerp(1000, ARMB[1] - 80, land);
  teras(ctx, t, cam, { cal: '1', calTop: 'DES', hideIbu: true, fB: EF(t, [[T9.d2, 'curiga', { look: [-.6, .8] }], [T9.ba, 'cemas', { look: [-.6, .8] }]], 32),
    armsB: { L: armTo(BX, -1, ARMB[0], ARMB[1], 1), R: [.3, -.3] },
    after: c => {
      drawPanas(c, ARMB[0] + 60, ARMB[1] - 20, 200, t, inv(T9.de, T9.de + .3, t) * .8);
      for (let i = 0; i < 3; i++) drawAroma(c, ARMB[0] - 40 + i * 70, ARMB[1] - 110 - i * 20, 40, { t: t + i, a: inv(T9.ba - .1, T9.ba + .2, t) });
      drawNyamuk(c, mx, my, 1.3, { t, flip: -1, sniff: 1, face: EF(t, [[T9.d2, 'curiga', { look: [-.6, .6] }], [T9.ba, 'takjub', { look: [-.6, .8] }]], 33) });
    } });
  tagSeq(ctx, t, [['DARI DEKAT', T9.d2 - .1, T9.ba, '#fff', 110], ['BAU KULIT', T9.ba, null, '#ffcf6a', 120]], 300);
});

// ===== 10a bau itu dibikin bakteri di kulit (dunia mikro) =====
const T10 = { ba: wt(10, 'bau'), it: wt(10, 'itu'), di: wt(10, 'dibikin'), bk: wt(10, 'bakteri'), dk: wt(10, 'di'), ku: wt(10, 'kulit'), da: wt(10, 'dan'), ra: wt(10, 'racikannya'), be: wt(10, 'beda'), ti: wt(10, 'tiap'), or: wt(10, 'orang') };
const MIK = [[250, 640, 0], [700, 560, 1], [520, 980, 2], [860, 900, 0], [260, 1120, 1], [760, 1180, 2]];
SH(ls(10), T10.da, { tr: 'whip' }, (ctx, lt, t) => {
  const mc = { z: lerp(1.15, 1.0, easeOut(inv(ls(10), T10.bk, t))), x: 0, y: 0 };
  kulitBG(ctx, t, { mc, warm: .5 });
  ctx.save(); mcam(ctx, mc);
  MIK.forEach(([x, y, kind], i) => {
    const k = backOut(inv(T10.bk + i * .06 - .1, T10.bk + i * .06 + .2, t)); if (k <= 0) return;
    drawMikroba(ctx, x, y, 62 * k + .01, { kind, t: t + i, rot: Math.sin(t + i) * .3, eat: inv(T10.dk, T10.dk + .2, t) * (i % 2), face: EF(t, [[T10.bk, 'bangga'], [T10.ku + i * .03, { eyes: 'happy', mouth: 'teeth' }]], 34 + i) });
    if (t > T10.ku) drawAroma(ctx, x + 40, y - 170, 52, { t: t + i, a: inv(T10.ku + i * .05, T10.ku + i * .05 + .3, t), icon: null });
  });
  ctx.restore();
  tagSeq(ctx, t, [['BAKTERI KULIT', T10.bk - .1, null, '#fff', 100]], 300);
});
// ===== 10b racikannya beda tiap orang =====
const JARS = [[200, 'IBU', [4, 1, 1], '#ec5b86'], [540, 'RANI', [1, 4, 1], '#f28c38'], [880, 'BUDI', [3, 3, 4], '#2f9b5a']];
SH(T10.da, ls(11), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[T10.da, { x: 540, y: 1150, z: 1.15 }], [T10.or, { x: 600, y: 1150, z: 1.3 }, ease], [ls(11), { x: 680, y: 1140, z: 1.42 }, easeIn]], 1.5);
  blurLayer(ctx, c => teras(c, t, { x: 540, y: 1100, z: 1.1, r: 0 }, { cal: '1', calTop: 'DES', glass: { i: false, r: false, b: false }, swarm: { n: 6, rx: 230, ry: 190, s: .55, cy: HEADY - 40 } }), 10);
  ctx.save(); applyCam(ctx, cam, 1);
  JARS.forEach(([x, lab, mix, lid], i) => { const k = backOut(inv(T10.ra + i * .25 - .1, T10.ra + i * .25 + .2, t)); if (k <= 0) return;
    drawToples(ctx, x, 1420, .9 * k + .01, { label: lab, mix, t, seed: 3 + i * 7, lid, glow: i === 2 ? inv(T10.or, T10.or + .2, t) : 0 });
    if (i === 2 && t > T10.or) for (let j = 0; j < 3; j++) drawAroma(ctx, x - 60 + j * 60, 1020 - j * 30, 44, { t: t + j, a: inv(T10.or, T10.or + .3, t) }); });
  ctx.restore();
  tagSeq(ctx, t, [['RACIKAN', T10.ra - .1, T10.be, '#fff', 120], ['BEDA TIAP ORANG', T10.be, null, '#ffd23a', 92]], 300);
});

// ===== 11 buat nyamuk, kulit Budi wanginya kayak warteg =====
const T11 = { bu: wt(11, 'buat'), ny: wt(11, 'nyamuk'), ku: wt(11, 'kulit'), bd: wt(11, 'budi'), wa: wt(11, 'wanginya'), ka: wt(11, 'kayak'), wt: wt(11, 'warteg') };
const ICONS = ['ayam', 'telur', 'tempe'];
SH(ls(11), ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(11), { x: 900, y: 980, z: 1.35 }], [T11.wa, { x: 880, y: 960, z: 1.45 }, ease], [T11.wt, { x: 860, y: 930, z: 1.55 }, ease], [ls(12), { x: 860, y: 925, z: 1.6 }, easeIn]], 2);
  const q = easeOut(inv(ls(11) - .2, T11.ku + .3, t));
  teras(ctx, t, cam, { cal: '1', calTop: 'DES', hideIbu: true,
    fR: EF(t, [[ls(11), 'datar', { look: [.8, -.3] }]], 40),
    fB: EM(t, [[ls(11), 'cemas', { look: [.6, -.3] }], [T11.wt, 'sadar', { look: [0, -.8] }]], 41), armsB: { R: [.4, -.2], L: [.4, -.2] }, glass: { b: { tea: 0, fill: .7 } },
    after: c => {
      for (let i = 0; i < 3; i++) drawAroma(c, BX - 120 + i * 120, HEADY - 220 - i * 20, 56, { t: t + i, a: inv(T11.wa + i * .1, T11.wa + i * .1 + .3, t), icon: ICONS[i] });
      // antrean nyamuk berserbet membawa piring
      for (let i = 0; i < 6; i++) { const x = lerp(1500 + i * 120, BX + 190 + i * 70, q), y = HEADY - 230 + Math.sin(t * 3 + i) * 18 + i * 62;
        drawNyamuk(c, x, y, .62, { t: t + i, flip: -1, bib: true, plate: true, wingPh: i, face: EF(t, [[ls(11), 'takjub', { look: [-.8, .2] }], [T11.wt + i * .04, { eyes: 'happy', mouth: 'teeth' }]], 42 + i) }); }
      drawPapanWarteg(c, BX, HEADY - 520, .9, inv(T11.wt - .1, T11.wt + .25, t), t);
    } });
  tagSeq(ctx, t, [['WANGI...', T11.wa, T11.wt, '#ffcf6a', 110]], 300);
});

// ===== 12 dan sekali jadi favorit nyamuk, biasanya bertahun-tahun =====
const T12 = { da: wt(12, 'dan'), se: wt(12, 'sekali'), ja: wt(12, 'jadi'), fa: wt(12, 'favorit'), ny: wt(12, 'nyamuk'), bi: wt(12, 'biasanya'), bt: wt(12, 'bertahuntahun') };
SH(ls(12), ls(13), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(12), { x: 700, y: 1060, z: 1.2 }], [T12.bi, { x: 720, y: 1050, z: 1.3 }, ease], [ls(13), { x: 740, y: 1040, z: 1.38 }, easeIn]], 2);
  const yr = inv(T12.bi, ls(13) - .2, t) * 3, yi = Math.floor(yr), fl = yr - yi;
  teras(ctx, t, cam, { cal: String(2026 + Math.min(3, yi + (fl > .5 ? 1 : 0))), calTop: 'TAHUN',
    fI: EF(t, [[ls(12), 'lega']], 48), fR: EF(t, [[ls(12), 'sombong', { look: [.8, 0] }]], 49),
    fB: EM(t, [[ls(12), 'meringis'], [T12.fa, 'datar', { look: [-.3, -.6] }]], 50), armsB: swatArms(t, .9), glass: { b: { tea: 0, fill: .7 } },
    swarm: { n: 10, rx: 240, ry: 200, s: .55, cy: HEADY - 40 },
    after: c => { const k = backOut(inv(T12.fa - .1, T12.fa + .2, t)); if (k > 0) { c.save(); c.translate(BX - 10, HEADY + 210); c.scale(k, k); circle(c, 0, 0, 54); fillStroke(c, '#ffd23a', 6); star5(c, 0, 0, 30, 0, '#fff6c8'); line(c, -30, -50, -50, -120, 14, '#e5392f'); line(c, 30, -50, 50, -120, 14, '#2f63c9'); c.restore(); } } });
  // siang-malam berkedip saat tahun berganti
  const blink = Math.max(0, Math.sin(fl * Math.PI)) * (t > T12.bi && t < ls(13) - .2 ? 1 : 0); if (blink > 0) timeGrade(ctx, blink * .8, 'senja');
  scr(ctx, c => drawKalenderTahun(c, 540, 470, .85 * backOut(inv(T12.bi - .15, T12.bi + .1, t)) + .001, 2026 + Math.min(3, yi), yi < 3 ? 2027 + yi : null, yi < 3 ? clamp(fl * 1.6 - .3) : 0));
  tagSeq(ctx, t, [['FAVORIT NYAMUK', T12.fa - .1, T12.bi, '#ffd23a', 96]], 330);
});

// ===== 13a Budi pun berhenti diet (teh manis lagi) =====
const T13 = { bu: wt(13, 'budi'), pu: wt(13, 'pun'), be: wt(13, 'berhenti'), di: wt(13, 'diet'), da: wt(13, 'dan'), ma: wt(13, 'malam'), in: wt(13, 'ini'), la: wt(13, 'lagilagi') };
SH(ls(13), T13.da, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(13), { x: 820, y: 1030, z: 1.7 }], [T13.di, { x: 810, y: 1035, z: 1.8 }, ease], [T13.da, { x: 800, y: 1040, z: 1.82 }, easeIn]], 2);
  const lift = easeOut(inv(ls(13) - .1, T13.be, t)), sip = inv(T13.be, T13.di + .2, t);
  const gh = [lerp(NY.glassB[0], BX - 90, lift), lerp(NY.glassB[1], HEADY + 150, lift) - 40 * sip];
  const toss = easeOut(inv(T13.be, T13.di + .3, t));
  teras(ctx, t, cam, { glass: { b: false },
    fB: EM(t, [[ls(13), 'datar', { look: [-.4, .4] }], [T13.be, 'lega']], 51),
    armsB: { L: armTo(BX, -1, gh[0] + 20, gh[1] - 40, 1), R: [lerp(.3, 2.4, toss), lerp(-.3, .3, toss)] },
    held: c => drawGelasTeh(c, gh[0], gh[1], .8, { t, sugar: 6, fill: .9, rot: .5 * sip }),
    swarm: { n: 9, rx: 230, ry: 190, s: .55, cy: HEADY - 40 },
    after: c => { if (toss > 0 && toss < 1) drawBawangPutih(c, lerp(BX + 120, BX + 700, toss), lerp(HEADY, HEADY - 500, toss) + 400 * toss * toss, .6, { rot: toss * 9 }); } });
  scrTag(ctx, 'STOP DIET', inv(T13.be, T13.be + .15, t), '#9dff7a', 330, 120);
});
// ===== 13b dan malam ini, lagi-lagi, -> komposisi frame 0 (loop) =====
SH(T13.da, ENDT, { tr: 'none' }, (ctx, lt, t) => {
  const tl = t - ENDT + 1 / 30, end = ENDT - .14;
  const c0 = cam0(Math.min(0, tl)), k = easeInOut(inv(T13.da, end, t));
  const cam = { x: lerp(800, c0.x, k), y: lerp(1040, c0.y, k), z: lerp(1.82, c0.z, k), r: 0 };
  hookScene(ctx, t, t >= end ? cam0(tl) : cam, tl);
  scrTag(ctx, 'MALAM INI...', inv(T13.ma, T13.ma + .15, t) * (1 - inv(T13.la - .1, T13.la, t)), '#fff', 330, 100);
  scrTag(ctx, 'LAGI-LAGI', inv(T13.la, T13.la + .15, t) * (1 - inv(end - .35, end - .2, t)), '#ffd23a', 330, 110);
  scrTag(ctx, 'BERTIGA', inv(-.15, 0, tl), '#fff', 330, 104);
  sfxS(ctx, 'NGIIING', 850, 640, 60, inv(-.15, 0, tl), '#fff', .1);
});
