// ---------- Fakta Unik: "Pisang di kulkas" (~66 dtk, tanpa CTA) ----------
// Bentuk cerita keenam: "pilihan yang ditertawakan" (Budi memilih pisang hitam, Rani mengejek, taruhan cuci piring, pembalikan saat dikupas).
// Frame 0 = dua pisang di piring, tangan Budi melayang di atasnya lalu memilih yang hitam. Akhir: komposisi yang sama (loop).
// Dunia mikro: sel kulit kedinginan -> retak -> isi bocor ketemu udara -> pigmen hitam. Analogi: apel digigit.
// Aturan v5/v6/v7: kamera selalu bergerak, semua waktu dari kata (wt), satu fungsi per aset (env_pisang.js), tata letak PS terkunci.
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
const win = (t, a, b, f = .15) => inv(a, a + f, t) * (1 - inv(b - .1, b, t));   // muncul di a, hilang sebelum b
const PI2 = Math.PI / 2;

// ===== tata letak tokoh =====
const FT = PS.back, S = 600, RX = PS.rani, BX = PS.budi, ARM = 1.6;
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, FT, S, flip, wx, wy, bend);
const standL = { L: [.1, -.04], R: [.1, -.04] };
function tokoh(ctx, t, P, x, face, arms, flip = 1, extra = {}) { drawStick(ctx, C(P, Object.assign({ x, y: FT, s: S, flip, armLen: ARM, legs: standL, arms: arms || idleArms(t, x * .01), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
// pisang dipegang: tangan di pangkal bawah, pusat pisang di atas tangan
const PEG = 72;
function pisangDiTangan(ctx, hand, s, o) { drawPisang(ctx, hand[0] + Math.sin(o.rot || 0) * PEG * s, hand[1] - Math.cos(o.rot || 0) * PEG * s, s, o); }
const POS_Y = [470, 1292], POS_B = [655, 1292];        // pisang di piring
const HOLD_B = [610, 1140], HOLD_R = [180, 1290];       // pisang dipegang Budi (tangan kanan) / Rani (tangan kiri)
const YEL = { spots: .55 }, BLK = { black: 1, inner: 'b' };

// ===== set dapur bersama =====
// o: { days, fridgeO, fR, armsR, rx, flipR, rExtra, fB, armsB, bx, flipB, bExtra, hideRani, hideBudi, ibu:{x,face,arms,flip}, plate, yel, blk, under, extra, tint }
function dapur(ctx, t, cam, o = {}) {
  dapurPisangBG(ctx, t, cam, { days: o.days == null ? 7 : o.days, fridgeO: o.fridgeO || {} });
  if (o.under) o.under(ctx);
  if (o.ibu) tokoh(ctx, t, IBU, o.ibu.x, o.ibu.face || EXPR.netral, o.ibu.arms, o.ibu.flip || 1, o.ibu.extra || {});
  if (!o.hideRani) tokoh(ctx, t, RANI, o.rx == null ? RX : o.rx, o.fR || EXPR.netral, o.armsR, o.flipR || 1, o.rExtra || {});
  if (!o.hideBudi) tokoh(ctx, t, BUDI, o.bx == null ? BX : o.bx, o.fB || EXPR.netral, o.armsB, o.flipB || -1, o.bExtra || {});
  if (o.held) o.held(ctx);
  mejaPisang(ctx);
  if (o.plate !== false) drawPiringPisang(ctx, PS.plate[0], PS.plate[1], 1);
  if (o.yel !== false) drawPisang(ctx, POS_Y[0], POS_Y[1], .85, Object.assign({ rot: -PI2, t }, YEL, o.yel || {}));
  if (o.blk !== false) drawPisang(ctx, POS_B[0], POS_B[1], .85, Object.assign({ rot: -PI2, t }, BLK, o.blk || {}));
  if (o.extra) o.extra(ctx);
  if (o.tint) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(255,190,110,${.2 * o.tint})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}

// ===== 0 HOOK: dari dua pisang, Budi malah ngambil yang kulitnya hitam legam =====
const H0 = { da: wt(0, 'dari'), du: wt(0, 'dua'), pi: wt(0, 'pisang'), bu: wt(0, 'budi'), ma: wt(0, 'malah'), ng: wt(0, 'ngambil'), ku: wt(0, 'kulitnya'), hi: wt(0, 'hitam'), le: wt(0, 'legam') };
const GRAB = H0.ng + .2;
const cam0 = tl => CK(tl, [[-3, { x: 530, y: 1150, z: 1.42 }], [0, { x: 530, y: 1160, z: 1.5 }, easeOut], [H0.bu, { x: 590, y: 1165, z: 1.62 }, ease], [GRAB, { x: 640, y: 1150, z: 1.7 }, ease], [H0.le, { x: 690, y: 1100, z: 1.85 }, ease], [ls(1), { x: 680, y: 1100, z: 1.9 }, easeIn]], 2.2);
// posisi tangan kanan Budi (dunia) sepanjang hook; tl < 0 = persiapan (dipakai di akhir video untuk loop)
const handB0 = tl => kf(tl, [[-2.2, [BX - 70, 1300]], [-.9, [BX - 90, 1290]], [0, [POS_Y[0] + 10, 1196]], [H0.pi + .25, [POS_Y[0] + 30, 1200]], [H0.bu + .25, [POS_B[0], 1196]], [GRAB, [POS_B[0] - 10, 1262]], [H0.hi + .1, [HOLD_B[0], HOLD_B[1] - 40]], [H0.le + .4, HOLD_B]], easeInOut);
function hookScene(ctx, t, cam, tl) {
  const hand = handB0(tl), wig = tl > -.3 && tl < GRAB - .1 ? Math.sin(tl * 16) * 6 : 0, held = tl >= GRAB;
  const lift = easeOut(inv(GRAB, H0.hi + .1, tl));
  dapur(ctx, t, cam, {
    fR: EF(tl, [[-9, 'sombong', { look: [.7, .3] }], [H0.ng + .05, 'kaget', { look: [.8, 0] }]], 1),
    fB: EM(tl, [[-9, 'curiga', { look: [-.6, .6] }], [H0.hi, 'bangga']], 2),
    armsB: { R: armTo(BX, -1, hand[0], hand[1] + wig, -1), L: [.25, -.3] },
    yel: { face: EF(tl, [[-9, 'sombong'], [H0.ng, 'kaget']], 3) },
    blk: held ? false : { face: EF(tl, [[-9, 'cemas']], 4) },
    held: held ? c => pisangDiTangan(c, hand, .85, Object.assign({ rot: lerp(-PI2 + .3, -.15, lift), t, face: EF(tl, [[GRAB, 'kaget'], [H0.le, 'lega']], 5) }, BLK)) : null
  });
}
SH(0, ls(1), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  ctx.save(); applyCam(ctx, cam, 1); glint(ctx, HOLD_B[0] + 30, HOLD_B[1] - 150, 120, t, H0.le); ctx.restore();
  scrTag(ctx, 'PILIH SATU', inv(-.15, 0, t) * (1 - inv(H0.ng - .1, H0.ng, t)), '#fff', 330, 100);
  scrTag(ctx, 'HITAM LEGAM?!', inv(H0.hi, H0.hi + .15, t), '#ffd23a', 330, 100);
});

// ===== 1 Rani ngakak: "Bud, itu mah udah busuk!" =====
const T1 = { ra: wt(1, 'rani'), la: wt(1, 'langsung'), ng: wt(1, 'ngakak'), bu: wt(1, 'bud'), it: wt(1, 'itu'), ud: wt(1, 'udah'), bs: wt(1, 'busuk') };
SH(ls(1), ls(2), { tr: 'dissolve', xt: .2 }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(1), { x: 560, y: 1120, z: 1.25 }], [ls(2), { x: 560, y: 1120, z: 1.33 }]], 3);
  blurLayer(ctx, c => dapur(c, t, cam, { hideRani: true, fB: EF(t, [[ls(1), 'bangga']], 6), armsB: { R: armTo(BX, -1, HOLD_B[0], HOLD_B[1], -1), L: [.25, -.3] }, blk: false,
    held: c2 => pisangDiTangan(c2, HOLD_B, .85, Object.assign({ rot: -.15, t }, BLK)) }), 9);
  scr(ctx, c => {
    const laugh = inv(T1.ng - .1, T1.ng + .1, t), sh = laugh * Math.sin(t * 34) * 9;
    // pisang hitam close-up (kanan atas), dipegang tangan Budi dari kanan
    const bx = 850, by = 700 + 10 * Math.sin(t * 3);
    line(c, 1200, 1060, bx + 20, by + 250, 52, INK); circle(c, bx + 20, by + 250, 40); c.fillStyle = INK; c.fill();
    drawPisang(c, bx, by, 2.1, Object.assign({ rot: -.15, t, face: EF(t, [[ls(1), 'lega'], [T1.bs, 'cemas']], 7) }, BLK));
    if (t > T1.bs) stink(c, bx - 40, by - 220, 1.4, t, inv(T1.bs, T1.bs + .3, t));
    drawStick(c, C(RANI, { x: 250 + sh, y: 2250, s: 1800, shadow: false, flip: 1, armLen: 1.3, arms: { L: [.2, -.1], R: [lerp(.3, 1.9, easeOut(inv(T1.bu - .2, T1.bu + .1, t))), .1] },
      face: EC(t, [[ls(1), 'licik', { look: [.8, -.3] }], [T1.ng, { eyes: 'happy', mouth: 'teeth', browUp: .5 }], [T1.bs, { eyes: 'happy', mouth: 'grin', browUp: .8 }]], 8), headTilt: -.06 + laugh * Math.sin(t * 17) * .05 }));
  });
  sfxText(ctx, 'WKWKWK', 300, 560, 74, win(t, T1.ng, T1.bu + .4), '#fff', -.12);
  scrTag(ctx, 'BUSUK!', inv(T1.bs, T1.bs + .12, t), '#ff6a5a', 330, 150);
});

// ===== 2 flashback: sesisir yang sama, dibeli Ibu seminggu lalu =====
const T2 = { pa: wt(2, 'padahal'), dd: wt(2, 'duaduanya'), se: wt(2, 'sesisir'), sa: wt(2, 'sama'), di: wt(2, 'dibeli'), ib: wt(2, 'ibu'), sm: wt(2, 'seminggu'), la: wt(2, 'lalu') };
const IBUX = 525;
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(2), { x: 540, y: 1080, z: 1.15 }], [T2.se, { x: 545, y: 1020, z: 1.32 }, easeOut], [T2.ib, { x: 545, y: 1000, z: 1.42 }, ease], [ls(3), { x: 530, y: 1010, z: 1.48 }, easeIn]], 2);
  const up = easeOut(inv(ls(2) - .2, T2.se + .1, t)), hand = [IBUX + 80, lerp(1250, 900, up)];
  dapur(ctx, t, cam, {
    days: 0, plate: false, yel: false, blk: false, tint: 1,
    ibu: { x: IBUX, face: EM(t, [[ls(2), 'bangga']], 10), arms: { R: armTo(IBUX, 1, hand[0], hand[1], -1), L: [.25, -.3] } },
    fR: EF(t, [[ls(2), 'netral', { look: [.7, -.5] }]], 11), fB: EF(t, [[ls(2), 'netral', { look: [-.7, -.5] }]], 12),
    extra: c => { drawSisir(c, hand[0] + 70, hand[1] - 40, .7, { n: 4, t, face: EF(t, [[ls(2), 'lega']], 13) }); glint(c, hand[0] + 70, hand[1] - 50, 150, t, T2.se); }
  });
  scrTag(ctx, 'SEMINGGU LALU', inv(ls(2), ls(2) + .15, t) * (1 - inv(T2.se - .1, T2.se, t)), '#ffe9a8', 300, 96);
  scrTag(ctx, 'SESISIR YANG SAMA', inv(T2.se, T2.se + .15, t) * (1 - inv(T2.sm - .1, T2.sm, t)), '#ffd23a', 300, 84);
  scrTag(ctx, 'SEMINGGU LALU', inv(T2.sm, T2.sm + .15, t), '#ffe9a8', 300, 96);
});

// ===== 3a separuh ditaruh di meja (keranjang) =====
const T3 = { s1: wt(3, 'separuh'), dt: wt(3, 'ditaruh'), me: wt(3, 'meja'), s2: wt(3, 'separuh', 0, 1), lg: wt(3, 'lagi'), dm: wt(3, 'dimasukin'), bu: wt(3, 'budi'), ku: wt(3, 'kulkas') };
const IBU_B = -150, BASK = PS.basket;
SH(ls(3), T3.s2, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(3), { x: -230, y: 1130, z: 1.45 }], [T3.me, { x: -260, y: 1150, z: 1.6 }, ease], [T3.s2, { x: -250, y: 1140, z: 1.68 }, easeIn]], 2);
  const put = easeInOut(inv(T3.dt - .1, T3.me + .1, t)), hand = [lerp(IBU_B - 60, BASK[0] + 20, put), lerp(1100, 1175, put)], inB = t > T3.me + .1;
  dapur(ctx, t, cam, {
    days: 0, plate: false, yel: false, blk: false, tint: 1,
    ibu: { x: IBU_B, flip: -1, face: EM(t, [[ls(3), 'netral', { look: [-.6, .4] }]], 14), arms: { R: armTo(IBU_B, -1, hand[0], hand[1], -1), L: [.25, -.3] } },
    extra: c => { drawKeranjang(c, BASK[0], BASK[1], 1, inB ? c2 => drawSisir(c2, 0, -170, .8, { n: 3, t }) : null); if (!inB) drawSisir(c, hand[0] + 10, hand[1] - 20, .8, { n: 3, t }); }
  });
  scrTag(ctx, 'DI MEJA', inv(T3.me, T3.me + .15, t), '#fff', 330, 110);
});
// ===== 3b separuh lagi dimasukin Budi ke kulkas =====
const BUDI_K = 1150;
SH(T3.s2, ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[T3.s2, { x: 1200, y: 1130, z: 1.35 }], [T3.dm, { x: 1260, y: 1140, z: 1.5 }, easeOut], [T3.ku, { x: 1330, y: 1170, z: 1.7 }, ease], [ls(4), { x: 1340, y: 1170, z: 1.76 }, easeIn]], 2);
  const door = easeOut(inv(T3.lg - .2, T3.lg + .2, t)) * (1 - easeInOut(inv(T3.ku + .45, ls(4) - .05, t)));
  const put = easeInOut(inv(T3.dm, T3.ku + .1, t)), inF = t > T3.ku + .12;
  const hand = [lerp(BUDI_K + 70, 1330, put), lerp(1190, 1240, put)];
  dapur(ctx, t, cam, {
    days: 0, plate: false, yel: false, blk: false, tint: 1, hideRani: true, bx: BUDI_K, flipB: 1,
    fB: EM(t, [[T3.s2, 'bangga', { look: [.8, .2] }]], 15), armsB: { R: armTo(BUDI_K, 1, hand[0], hand[1], -1), L: [.25, -.3] },
    fridgeO: { door, count: inF ? 1 : 0, mood: 'happy', look: -1, bananas: { face: EF(t, [[T3.ku, 'lega']], 16) } },
    extra: c => { if (!inF) drawSisir(c, hand[0] + 40, hand[1] - 10, .55, { n: 3, t }); }
  });
  scrTag(ctx, 'DI KULKAS', inv(T3.ku, T3.ku + .15, t), '#9ed8ff', 330, 110);
});

// ===== 4 yang di meja masih kuning, cuma bertotol (satu minggu berlalu) =====
const T4 = { ya: wt(4, 'yang'), me: wt(4, 'meja'), ma: wt(4, 'masih'), ku: wt(4, 'kuning'), cu: wt(4, 'cuma'), be: wt(4, 'bertotol') };
SH(ls(4), ls(5), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(4), { x: -330, y: 1180, z: 1.75 }], [T4.ku, { x: -330, y: 1175, z: 1.95 }, easeOut], [T4.be, { x: -320, y: 1170, z: 2.15 }, ease], [ls(5), { x: -320, y: 1170, z: 2.2 }, easeIn]], 2);
  const day = Math.min(7, 1 + Math.floor(6 * inv(ls(4), T4.ku, t))), sp = .55 * easeOut(inv(T4.cu - .2, T4.be + .2, t));
  dapur(ctx, t, cam, { days: day, plate: false, yel: false, blk: false,
    extra: c => drawKeranjang(c, BASK[0], BASK[1], 1, c2 => drawSisir(c2, 0, -170, .8, { n: 3, t, spots: sp, face: EF(t, [[ls(4), 'netral', { look: [0, -.3] }], [T4.be, 'cemas']], 17) })) });
  // siang-malam berganti cepat (waktu berlalu)
  const night = t < T4.ku ? Math.max(0, Math.sin((t - ls(4)) / (T4.ku - ls(4)) * Math.PI * 6)) * .7 : 0;
  if (night > 0) timeGrade(ctx, night, 'malam');
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, 'HARI ' + day, 540, 300, 110, inv(ls(4), ls(4) + .12, t), '#fff', INK, -.05); ctx.restore();
  scrTag(ctx, 'BERTOTOL', inv(T4.be, T4.be + .15, t), '#ffd23a', 460, 96);
});

// ===== 5 yang di kulkas? hitam semua, kayak habis kebakar =====
const T5 = { ya: wt(5, 'yang'), ku: wt(5, 'kulkas'), hi: wt(5, 'hitam'), se: wt(5, 'semua'), ka: wt(5, 'kayak'), ha: wt(5, 'habis'), kb: wt(5, 'kebakar') };
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 1400, y: 1050, z: 1.45 }], [T5.ku, { x: 1400, y: 1080, z: 1.55 }, easeOut], [T5.hi, { x: 1410, y: 1225, z: 2.45 }, ease], [T5.kb, { x: 1410, y: 1220, z: 2.6 }, ease], [ls(6), { x: 1410, y: 1215, z: 2.65 }, easeIn]], 2);
  const door = easeOut(inv(T5.ku - .1, T5.ku + .3, t));
  dapur(ctx, t, cam, { plate: false, yel: false, blk: false, hideRani: true, hideBudi: true,
    fridgeO: { door, count: 1, shake: t > T5.hi && t < T5.hi + .4 ? 2 : 0, mood: t < T5.hi ? 'happy' : 'worry', bananas: { black: 1, frost: .6, face: EF(t, [[ls(5), 'meringis']], 18) } } });
  if (t > T5.kb - .1) { ctx.save(); applyCam(ctx, cam, 1); for (let i = 0; i < 3; i++) { const q = ((t - T5.kb) * .9 + i * .33) % 1; puff(ctx, 1380 + i * 30 + q * 20, 1190 - q * 160, 18 + 26 * q, t, '#6b6470', 7 + i, (1 - q) * inv(T5.kb - .1, T5.kb + .2, t)); } ctx.restore(); }
  scrTag(ctx, 'HITAM SEMUA!', inv(T5.hi, T5.hi + .15, t) * (1 - inv(T5.ka - .1, T5.ka, t)), '#fff', 330, 110);
  scrTag(ctx, 'KAYAK KEBAKAR', inv(T5.ka, T5.ka + .15, t), '#ff8a2a', 330, 96);
});

// ===== 6 Rani nantang: yang dapet pisang busuk, cuci piring seminggu =====
const T6 = { ra: wt(6, 'rani'), na: wt(6, 'nantang'), ya: wt(6, 'yang'), da: wt(6, 'dapet'), pi: wt(6, 'pisang'), bu: wt(6, 'busuk'), cu: wt(6, 'cuci'), pr: wt(6, 'piring'), se: wt(6, 'seminggu') };
const STACK = [1010, 1330];
const heldBoth = (t, bo = {}, ro = {}) => c => { pisangDiTangan(c, HOLD_B, .85, Object.assign({ rot: -.15, t }, BLK, bo)); pisangDiTangan(c, HOLD_R, .85, Object.assign({ rot: .15, t }, YEL, ro)); };
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(6), { x: 500, y: 1110, z: 1.1 }], [T6.da, { x: 520, y: 1110, z: 1.15 }, easeOut], [T6.cu, { x: 600, y: 1130, z: 1.15 }, ease], [ls(7), { x: 615, y: 1120, z: 1.22 }, easeIn]], 2);
  const n = Math.round(10 * easeOut(inv(T6.cu - .05, T6.se + .3, t))), point = easeOut(inv(T6.na - .1, T6.na + .15, t));
  dapur(ctx, t, cam, { plate: true, yel: false, blk: false,
    fR: EM(t, [[ls(6), 'licik', { look: [.8, 0] }]], 19), armsR: { L: armTo(RX, 1, HOLD_R[0], HOLD_R[1], 1), R: [lerp(.3, 1.75, point), .1] },
    fB: EM(t, [[ls(6), 'sombong', { look: [-.8, 0] }]], 20), armsB: { R: armTo(BX, -1, HOLD_B[0], HOLD_B[1], -1), L: [.25, -.3] },
    held: heldBoth(t),
    extra: c => { if (n > 0) drawTumpukPiring(c, STACK[0], STACK[1], .9, n, { t, dirt: 1, wob: inv(T6.se, T6.se + .5, t) }); if (n > 6) stink(c, STACK[0] - 30, STACK[1] - 300, 1, t, .8); }
  });
  scrTag(ctx, 'PISANG BUSUK', inv(T6.da, T6.da + .15, t) * (1 - inv(T6.cu - .1, T6.cu, t)), '#fff', 330, 96);
  scrTag(ctx, 'CUCI PIRING', inv(T6.cu, T6.cu + .15, t) * (1 - inv(T6.se - .1, T6.se, t)), '#9ed8ff', 330, 104);
  scrTag(ctx, '7 HARI!', inv(T6.se, T6.se + .15, t), '#ffd23a', 330, 140);
});

// ===== 7 Budi ngupas duluan: dingin, lemas, hitam sampai ke dalam =====
const T7 = { bu: wt(7, 'budi'), ng: wt(7, 'ngupas'), du: wt(7, 'duluan'), ku: wt(7, 'kulitnya'), di: wt(7, 'dingin'), le: wt(7, 'lemas'), hi: wt(7, 'hitam'), sa: wt(7, 'sampai'), da: wt(7, 'dalam') };
const peelB7 = t => .12 * easeOut(inv(T7.ng, T7.du + .3, t)) + .18 * easeInOut(inv(T7.hi - .1, T7.da, t));
SH(ls(7), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(7), { x: 595, y: 1060, z: 1.9 }], [T7.ng, { x: 605, y: 1030, z: 2.15 }, easeOut], [T7.di, { x: 605, y: 1010, z: 2.4 }, ease], [T7.hi, { x: 610, y: 990, z: 2.55 }, ease], [ls(8), { x: 610, y: 985, z: 2.62 }, easeIn]], 2);
  const frost = easeOut(inv(T7.di - .05, T7.di + .3, t)), droop = easeOut(inv(T7.le - .05, T7.le + .35, t)), shiv = frost * (t < T7.le ? 1 : .35);
  const hb = [HOLD_B[0] + Math.sin(t * 50) * 4 * shiv, HOLD_B[1]], tip = [HOLD_B[0] + 8, HOLD_B[1] - PEG * .85 - 100];
  dapur(ctx, t, cam, { plate: false, yel: false, blk: false,
    fR: EF(t, [[ls(7), 'licik', { look: [.8, 0] }]], 21), armsR: { L: armTo(RX, 1, HOLD_R[0], HOLD_R[1], 1), R: [.25, -.3] },
    fB: EM(t, [[ls(7), 'datar', { look: [-.4, -.5] }], [T7.di, { eyes: 'flinch', mouth: 'wobble', sweat: 0 }], [T7.le, { eyes: 'half', mouth: 'flat', look: [-.4, -.6] }], [T7.hi, 'cemas', { look: [-.4, -.6] }]], 22),
    armsB: { R: armTo(BX, -1, hb[0], hb[1], -1), L: armTo(BX, -1, tip[0] + 10, tip[1] + 20, 1) },
    held: c => { pisangDiTangan(c, hb, .85, Object.assign({ rot: -.05, t, peel: peelB7(t), frost, droop, fleshShade: .92, face: EF(t, [[ls(7), 'cemas'], [T7.di, 'meringis']], 23) }, BLK)); pisangDiTangan(c, HOLD_R, .85, Object.assign({ rot: .15, t }, YEL)); }
  });
  ctx.save(); applyCam(ctx, cam, 1); if (frost > 0) for (let i = 0; i < 7; i++) { const q = ((t * .6 + i * .14) % 1); snowflake(ctx, HOLD_B[0] - 90 + i * 30, 900 + q * 260, 10, t + i); } ctx.restore();
  sfxText(ctx, 'KREK', 420, 800, 70, win(t, T7.ng + .15, T7.di), '#fff', -.12);
  scrTag(ctx, 'DINGIN', inv(T7.di, T7.di + .15, t) * (1 - inv(T7.le - .1, T7.le, t)), '#bfe9ff', 330, 120);
  scrTag(ctx, 'LEMAS', inv(T7.le, T7.le + .15, t) * (1 - inv(T7.hi - .1, T7.hi, t)), '#fff', 330, 120);
  scrTag(ctx, 'HITAM SAMPAI DALAM', inv(T7.hi, T7.hi + .15, t), '#ff8a6a', 330, 80);
});

// ===== 8 Rani udah nyiapin spons cuci piring buat dia =====
const T8 = { ra: wt(8, 'rani'), ud: wt(8, 'udah'), ny: wt(8, 'nyiapin'), sp: wt(8, 'spons'), cu: wt(8, 'cuci'), pi: wt(8, 'piring'), bu: wt(8, 'buat'), di: wt(8, 'dia') };
SH(ls(8), ls(9), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(8), { x: 520, y: 1130, z: 1.25 }], [T8.sp, { x: 520, y: 1150, z: 1.35 }, easeOut], [T8.bu, { x: 580, y: 1150, z: 1.4 }, ease], [ls(9), { x: 600, y: 1140, z: 1.45 }, easeIn]], 2);
  const push = easeInOut(inv(T8.ny - .1, T8.pi, t)), slide = easeOut(inv(T8.pi - .1, T8.di + .2, t));
  const sx = lerp(330, 520, push) + 150 * slide, hand = [Math.min(sx - 20, 520), 1300];
  dapur(ctx, t, cam, { plate: true, yel: false, blk: false,
    fR: EM(t, [[ls(8), 'licik', { look: [.8, .4] }], [T8.bu, 'sombong', { look: [.8, 0] }]], 24), armsR: { L: armTo(RX, 1, HOLD_R[0], HOLD_R[1], 1), R: push > 0 && slide < .3 ? armTo(RX, 1, hand[0], hand[1], 1) : [.25, -.3] },
    fB: EM(t, [[ls(8), 'cemas', { look: [-.6, .5] }]], 25), armsB: { R: armTo(BX, -1, HOLD_B[0], HOLD_B[1], -1), L: [.25, -.3] },
    held: heldBoth(t, { peel: .3, droop: 1, frost: .4, fleshShade: .92 }),
    extra: c => { drawSpons(c, sx, 1290, .9, -.05 * slide); if (slide > 0 && slide < 1) for (let i = 0; i < 3; i++) line(c, sx - 110 - i * 40, 1270 + i * 12, sx - 80 - i * 40, 1270 + i * 12, 6, 'rgba(34,28,34,.5)'); }
  });
  ctx.save(); applyCam(ctx, cam, 1); glint(ctx, sx, 1270, 90, t, T8.sp); ctx.restore();
  scrTag(ctx, 'SPONS SIAP', inv(T8.sp, T8.sp + .15, t), '#ffd23a', 330, 104);
});

// ===== 9 tapi begitu kulitnya lepas: dagingnya putih mulus, masih padat =====
const T9 = { ta: wt(9, 'tapi'), be: wt(9, 'begitu'), ku: wt(9, 'kulitnya'), le: wt(9, 'lepas'), da: wt(9, 'dagingnya'), pu: wt(9, 'putih'), mu: wt(9, 'mulus'), ma: wt(9, 'masih'), pa: wt(9, 'padat') };
SH(ls(9), ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(9), { x: 605, y: 1000, z: 2.3 }], [T9.le - .05, { x: 610, y: 985, z: 2.55 }, ease], [T9.le + .3, { x: 610, y: 960, z: 2.35 }, backOut], [T9.mu, { x: 610, y: 960, z: 2.45 }, ease], [T9.ma, { x: 505, y: 1060, z: 1.6 }, ease], [ls(10), { x: 485, y: 1070, z: 1.55 }, easeIn]], 2);
  const open = easeOut(inv(T9.le - .1, T9.le + .35, t)), peel = lerp(.3, 1, open), glow = inv(T9.le, T9.le + .3, t) * (1 - .5 * inv(T9.ma, ls(10), t));
  const press = Math.max(0, Math.sin((t - T9.pa) * 18)) * inv(T9.pa - .05, T9.pa, t) * (1 - inv(T9.pa + .5, T9.pa + .6, t));
  const fleshTop = [HOLD_B[0] + 4, HOLD_B[1] - PEG * .85 - 80];
  dapur(ctx, t, cam, { plate: false, yel: false, blk: false,
    fR: EF(t, [[ls(9), 'licik', { look: [.8, 0] }], [T9.pu, 'kaget', { look: [.8, -.2] }]], 26), armsR: { L: armTo(RX, 1, HOLD_R[0], HOLD_R[1], 1), R: [.25, -.3] },
    fB: EM(t, [[ls(9), 'cemas', { look: [-.4, -.6] }], [T9.le, 'takjub', { look: [-.3, -.7] }], [T9.ma, 'bangga']], 27),
    armsB: { R: armTo(BX, -1, HOLD_B[0], HOLD_B[1], -1), L: t > T9.ma - .2 ? armTo(BX, -1, fleshTop[0] + 30, fleshTop[1] + 8 * press, 1) : [.25, -.3] },
    held: heldBoth(t, { peel, droop: 1 - open * .6, frost: .4 * (1 - open), fleshShade: .92 * (1 - open), glow, faceFlesh: open > .5 ? EF(t, [[T9.le + .2, 'bangga']], 28) : null })
  });
  ctx.save(); applyCam(ctx, cam, 1); const k = inv(T9.le, T9.le + .2, t) * (1 - inv(T9.mu + .4, T9.mu + .6, t)); if (k > 0) for (let i = 0; i < 4; i++) sparkle(ctx, HOLD_B[0] - 80 + (i % 2) * 170, 900 + Math.floor(i / 2) * 120, 22 * k, k);
  glint(ctx, fleshTop[0], fleshTop[1] + 40, 110, t, T9.pu); ctx.restore();
  sfxText(ctx, 'TOK TOK', 330, 860, 66, win(t, T9.pa, ls(10) + 1), '#fff', .1);
  scrTag(ctx, 'PUTIH MULUS', inv(T9.pu, T9.pu + .15, t) * (1 - inv(T9.ma - .1, T9.ma, t)), '#fff7c0', 330, 110);
  scrTag(ctx, 'MASIH PADAT!', inv(T9.pa, T9.pa + .15, t), '#9dff7a', 330, 110);
});

// ===== 10 Rani buru-buru ngupas punyanya: lembek, cokelat, nempel di kulit =====
const T10 = { ra: wt(10, 'rani'), bb: wt(10, 'buruburu'), ng: wt(10, 'ngupas'), pu: wt(10, 'punyanya'), le: wt(10, 'lembek'), co: wt(10, 'cokelat'), ne: wt(10, 'nempel'), ku: wt(10, 'kulit') };
SH(ls(10), ls(11), { tr: 'dissolve', xt: .2 }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(10), { x: 260, y: 1260, z: 1.7 }], [T10.ng, { x: 230, y: 1220, z: 2.0 }, easeOut], [T10.le, { x: 210, y: 1190, z: 2.35 }, ease], [T10.ne, { x: 200, y: 1190, z: 2.5 }, ease], [ls(11), { x: 200, y: 1195, z: 2.55 }, easeIn]], 2);
  const peel = easeOut(inv(T10.ng - .1, T10.pu + .35, t)), droop = easeOut(inv(T10.le - .1, T10.le + .4, t)), mush = inv(T10.pu, T10.le + .1, t);
  const shake = Math.sin(t * 40) * 5 * inv(T10.bb, T10.bb + .1, t) * (1 - inv(T10.pu + .2, T10.pu + .3, t));
  const hr = [HOLD_R[0] + shake, HOLD_R[1]], tipR = [HOLD_R[0] + 10, HOLD_R[1] - PEG * .85 - 110];
  dapur(ctx, t, cam, { plate: false, yel: false, blk: false,
    fR: EM(t, [[ls(10), 'cemas', { look: [-.3, -.6] }], [T10.le, 'kaget', { look: [-.3, -.6] }], [T10.ne, 'meringis']], 29),
    armsR: { L: armTo(RX, 1, hr[0], hr[1], 1), R: peel < .9 ? armTo(RX, 1, tipR[0] + 30, tipR[1] + 40 + 160 * peel, 1) : [.25, -.3] },
    fB: EF(t, [[ls(10), 'bangga', { look: [-.8, 0] }]], 30), armsB: { R: armTo(BX, -1, HOLD_B[0], HOLD_B[1], -1), L: [.25, -.3] },
    held: c => { pisangDiTangan(c, HOLD_B, .85, Object.assign({ rot: -.15, t, peel: 1, droop: .4 }, BLK)); pisangDiTangan(c, hr, .85, Object.assign({ rot: .15, t, peel, mush, droop, face: EF(t, [[ls(10), 'sombong'], [T10.le, 'meringis']], 31) }, YEL)); }
  });
  ctx.save(); applyCam(ctx, cam, 1); if (t > T10.co) stink(ctx, HOLD_R[0], 860, .9, t, inv(T10.co, T10.co + .3, t) * .7); ctx.restore();
  scrTag(ctx, 'LEMBEK', inv(T10.le, T10.le + .12, t) * (1 - inv(T10.co - .1, T10.co, t)), '#fff', 330, 120);
  scrTag(ctx, 'COKELAT', inv(T10.co, T10.co + .12, t) * (1 - inv(T10.ne - .1, T10.ne, t)), '#d9a066', 330, 120);
  scrTag(ctx, 'NEMPEL DI KULIT', inv(T10.ne, T10.ne + .12, t), '#ffd23a', 330, 92);
});

// ===== 11a jadi begini: pisang itu buah tropis =====
const T11 = { ja: wt(11, 'jadi'), be: wt(11, 'begini'), pi: wt(11, 'pisang'), it: wt(11, 'itu'), bu: wt(11, 'buah'), tr: wt(11, 'tropis'), di: wt(11, 'di'), ba: wt(11, 'bawah'), tb: wt(11, '13'), de: wt(11, 'derajat'), se: wt(11, 'sel'), ku: wt(11, 'kulitnya'), ru: wt(11, 'rusak'), ke: wt(11, 'kedinginan') };
function palem(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(10, -200, 30, -380); ctx.lineTo(50, -380); ctx.quadraticCurveTo(34, -200, 16, 0); ctx.closePath(); fillStroke(ctx, '#a0703e', 6);
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .55; ctx.save(); ctx.translate(40, -380); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(80, -40, 170, 30); ctx.quadraticCurveTo(80, 10, 0, 0); fillStroke(ctx, '#3f9b4a', 5); ctx.restore(); } ctx.restore(); }
function tropisBG(ctx, t, cold = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mixC('#7fd3ff', '#cfe9ff', cold)); g.addColorStop(1, mixC('#fff1b8', '#e9f6ff', cold)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (cold < 1) { ctx.save(); ctx.globalAlpha = 1 - cold; drawMatahari(ctx, 860, 330, 110, t); palem(ctx, 120, 1500, 1.3); palem(ctx, 980, 1560, 1.1); ctx.restore(); }
  ctx.fillStyle = mixC('#7cc46a', '#f4fbff', cold); ellipse(ctx, 540, 1700, 900, 320); ctx.fill();
}
SH(ls(11), T11.di, { tr: 'whip' }, (ctx, lt, t) => {
  const z = lerp(1.0, 1.08, inv(ls(11), T11.di, t));
  scr(ctx, c => { c.translate(540, 900); c.scale(z, z); c.translate(-540, -900); tropisBG(c, t, 0);
    const pop = backOut(inv(T11.pi - .1, T11.pi + .25, t));
    drawPisang(c, 540, 930 + 14 * Math.sin(t * 4), 2.6 * pop + .01, { rot: -.2, t, face: EF(t, [[T11.pi, 'bangga']], 32) });
    if (t > T11.tr) for (let i = 0; i < 5; i++) { const a = i * 1.3 + t; sparkle(c, 540 + Math.cos(a) * 280, 930 + Math.sin(a) * 300, 24, inv(T11.tr, T11.tr + .2, t)); } });
  scrTag(ctx, 'JADI BEGINI', inv(ls(11), ls(11) + .15, t) * (1 - inv(T11.pi - .1, T11.pi, t)), '#fff', 300, 100);
  scrTag(ctx, 'BUAH TROPIS', inv(T11.tr - .05, T11.tr + .1, t), '#ffd23a', 300, 110);
});
// ===== 11b di bawah 13 derajat (termometer turun, pisang menggigil) =====
const BAN11 = [720, 980];
SH(T11.di, T11.se, { tr: 'portal', zoomOut: { x: 720, y: 980, w: 150, h: 267 } }, (ctx, lt, t) => {
  const v = lerp(30, 4, easeInOut(inv(T11.di, T11.de + .3, t))), cold = inv(15, 5, v), z = 1 + .35 * easeIn(inv(T11.de + .2, T11.se, t));
  scr(ctx, c => { c.translate(BAN11[0], BAN11[1]); c.scale(z, z); c.translate(-BAN11[0], -BAN11[1]); tropisBG(c, t, cold);
    drawTermoPisang(c, 290, 1180, .95, v, { mark13: inv(T11.tb - .1, T11.tb + .1, t) });
    drawPisang(c, BAN11[0] + Math.sin(t * 50) * 6 * cold, BAN11[1], 2.3, { rot: -.15, t, frost: cold, face: EF(t, [[T11.di, 'netral', { look: [-.8, .2] }], [T11.tb + .1, 'meringis']], 33) });
    for (let i = 0; i < 10 * cold; i++) { const q = ((t * .5 + i * .1) % 1); snowflake(c, (i * 197) % W, q * H, 14, t + i); } });
  scrTag(ctx, 'DI BAWAH 13°', inv(T11.tb, T11.tb + .15, t), '#e5262a', 300, 110);
});
// ===== dunia mikro: sel kulit =====
const SELK = (() => { const o = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) o.push([200 + c * 340 + (r % 2) * 60 - 30, 520 + r * 300]); return o; })();
const O2PT = (() => { const r = rng(9), o = []; for (let i = 0; i < 14; i++) o.push([r() * W, -200 - r() * 700, 30 + r() * 14, r()]); return o; })();
// o: { cold, crack, leak, dark, mz, faces(i) }
function mikroSel(ctx, t, o) {
  const z = o.mz || 1; ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540, -960);
  jaringanBG(ctx, t, { cold: o.cold, dark: o.dark });
  SELK.forEach(([x, y], i) => {
    drawSel(ctx, x, y, 130, { t, seed: i, cold: o.cold, crack: clamp((o.crack || 0) * 1.4 - (i % 4) * .1), leak: o.leak, dark: o.dark, face: o.faces ? o.faces(i) : null });
    // isi bocor: butir zat keluar dari retakan
    if (o.leak > 0) for (let k = 0; k < 4; k++) { const q = clamp(o.leak * 1.3 - k * .12); if (q <= 0) continue; const bx = x - 30 + Math.cos(k * 1.7) * 60 * q, by = y - 110 - 110 * q + k * 10;
      const blk = clamp((o.dark || 0) * 1.5 - k * .1); if (blk > .6) drawPigmen(ctx, bx, by, 20, 1); else { circle(ctx, bx, by, 12); fillStroke(ctx, mixC(PSP.zat, PSP.pig, blk), 4); } }
  });
  if (o.air > 0) O2PT.forEach(([x, y0, r, ph]) => { const y = y0 + o.air * 1300 + Math.sin(t * 2 + ph * 9) * 20; if (y > -100 && y < H + 100) drawO2(ctx, x + Math.sin(t * 1.5 + ph * 7) * 30, y, r); });
  ctx.restore();
}
// ===== 11c sel kulitnya rusak kedinginan =====
SH(T11.se, ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  const crack = easeOut(inv(T11.ru - .05, T11.ke + .2, t));
  mikroSel(ctx, t, { mz: lerp(1.15, 1.0, easeOut(inv(T11.se, T11.ru, t))), cold: 1, crack, faces: i => EF(t, [[T11.se, 'cemas', { look: [0, -.5] }], [T11.ru + i * .02, 'meringis']], 34 + i) });
  scrTag(ctx, 'SEL KULIT', inv(T11.se, T11.se + .15, t) * (1 - inv(T11.ru - .1, T11.ru, t)), '#fff', 260, 100);
  scrTag(ctx, 'RUSAK!', inv(T11.ru, T11.ru + .12, t), '#ff6a5a', 260, 140);
  sfxText(ctx, 'KRAK', 820, 1580, 80, win(t, T11.ru + .1, ls(12) + 1), '#fff', .1);
});
// ===== 12a selnya bocor, isinya ketemu udara, dan berubah hitam =====
const T12 = { se: wt(12, 'selnya'), bo: wt(12, 'bocor'), is: wt(12, 'isinya'), ke: wt(12, 'ketemu'), ud: wt(12, 'udara'), da: wt(12, 'dan'), be: wt(12, 'berubah'), hi: wt(12, 'hitam'), sa: wt(12, 'sama'), ka: wt(12, 'kayak'), ap: wt(12, 'apel'), di: wt(12, 'digigit'), ja: wt(12, 'jadi'), co: wt(12, 'cokelat') };
SH(ls(12), T12.sa, { tr: 'whip' }, (ctx, lt, t) => {
  const leak = easeOut(inv(T12.bo - .1, T12.is + .3, t)), air = easeInOut(inv(T12.ke - .3, T12.ud + .6, t)), dark = easeInOut(inv(T12.be - .1, T12.hi + .4, t));
  mikroSel(ctx, t, { mz: 1 + .06 * inv(ls(12), T12.sa, t), cold: .6 * (1 - dark), crack: 1, leak, air, dark, faces: i => EF(t, [[ls(12), 'meringis'], [T12.hi + i * .03, { eyes: 'x', mouth: 'o' }]], 46 + i) });
  scrTag(ctx, 'BOCOR', inv(T12.bo, T12.bo + .12, t) * (1 - inv(T12.ke - .1, T12.ke, t)), '#ffb02e', 260, 130);
  scrTag(ctx, 'KETEMU UDARA', inv(T12.ke, T12.ke + .12, t) * (1 - inv(T12.be - .1, T12.be, t)), '#8fd4ff', 260, 100);
  scrTag(ctx, 'JADI HITAM', inv(T12.hi, T12.hi + .12, t), '#fff', 260, 120);
});
// ===== 12b sama kayak apel yang digigit jadi cokelat =====
SH(T12.sa, ls(13), { tr: 'whip' }, (ctx, lt, t) => {
  const bite = easeOut(inv(T12.di - .05, T12.di + .15, t)), brown = easeInOut(inv(T12.ja - .2, T12.co + .3, t)), z = lerp(1, 1.12, inv(T12.sa, ls(13), t));
  scr(ctx, c => { c.fillStyle = '#ffe1b8'; c.fillRect(0, 0, W, H); c.save(); c.globalAlpha = .25; for (let i = 0; i < 12; i++) { circle(c, (i * 233) % W, (i * 389) % H, 60 + (i % 3) * 30); c.fillStyle = '#ffffff'; c.fill(); } c.restore();
    c.translate(540, 900); c.scale(z, z); c.translate(-540, -900);
    const pop = backOut(inv(T12.ap - .15, T12.ap + .15, t));
    drawApel(c, 540, 900, 300 * pop + .01, { bite, brown, t, face: EF(t, [[T12.ap, 'netral'], [T12.di + .05, 'kaget'], [T12.co, 'meringis']], 58) });
    if (bite > 0 && bite < 1) burst(c, 820, 880, 90 * bite, 9, '#fff', 3); });
  sfxText(ctx, 'KRAUK!', 820, 560, 90, win(t, T12.di, T12.co), '#fff', .12);
  scrTag(ctx, 'APEL DIGIGIT', inv(T12.ap, T12.ap + .15, t) * (1 - inv(T12.ja - .1, T12.ja, t)), '#fff', 300, 100);
  scrTag(ctx, 'JADI COKELAT', inv(T12.ja, T12.ja + .15, t), '#c98a4a', 300, 100);
});

// ===== 13a tapi dinginnya juga ngerem pematangan dagingnya =====
const T13 = { ta: wt(13, 'tapi'), di: wt(13, 'dinginnya'), ju: wt(13, 'juga'), ng: wt(13, 'ngerem'), pe: wt(13, 'pematangan'), da: wt(13, 'dagingnya'), as: wt(13, 'asal'), ma: wt(13, 'masuknya'), pa: wt(13, 'pas'), ud: wt(13, 'udah'), mt: wt(13, 'matang') };
function dinginBG(c, t) { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#dff6f1'); g.addColorStop(1, '#b6e6dc'); c.fillStyle = g; c.fillRect(0, 0, W, H); for (let i = 0; i < 14; i++) { const q = ((t * .25 + i * .07) % 1); snowflake(c, (i * 173 + 60) % W, q * H, 12, t + i); } }
SH(ls(13), T13.as, { tr: 'whip' }, (ctx, lt, t) => {
  const brake = easeOut(inv(T13.ng - .05, T13.ng + .15, t)), v = lerp(.85 + .04 * Math.sin(t * 30), .12, easeInOut(inv(T13.ng, T13.da + .2, t))), z = lerp(1.0, 1.08, inv(ls(13), T13.as, t));
  scr(ctx, c => { c.translate(540, 900); c.scale(z, z); c.translate(-540, -900); dinginBG(c, t);
    drawSpeedo(c, 470, 640, 1.05, v, brake);
    drawPisang(c, 880, 1060, 1.5, { rot: .25, t, peel: 1, faceFlesh: EF(t, [[ls(13), 'cemas'], [T13.da, 'lega']], 59) }); });
  sfxText(ctx, 'CIIIT!', 300, 1060, 80, win(t, T13.ng + .05, T13.as + 1), '#fff', -.1);
  scrTag(ctx, 'DAGINGNYA DIREM', inv(T13.ng, T13.ng + .15, t), '#9ed8ff', 230, 88);
});
// ===== 13b asal masuknya pas udah matang =====
SH(T13.as, ls(14), { tr: 'whip' }, (ctx, lt, t) => {
  const z = lerp(1.0, 1.06, inv(T13.as, ls(14), t)), g = backOut(inv(T13.as - .1, T13.as + .2, t)), y = backOut(inv(T13.pa - .1, T13.pa + .2, t));
  scr(ctx, c => { c.translate(540, 900); c.scale(z, z); c.translate(-540, -900); dinginBG(c, t);
    drawPisang(c, 300, 860, 2.0 * g + .01, { rot: -.15, green: 1, t, face: EF(t, [[T13.as, 'cemas']], 60) });
    drawPisang(c, 780, 860, 2.0 * y + .01, { rot: .15, spots: .2, t, face: EF(t, [[T13.pa, 'bangga']], 61) });
    drawX(c, 300, 1180, 70, inv(T13.ma, T13.ma + .15, t)); text(c, 'MENTAH', 300, 560, 56, '#3f9b4a', INK, 10);
    drawCheck(c, 780, 1180, 70, inv(T13.mt, T13.mt + .15, t)); text(c, 'MATANG', 780, 560, 56, '#e8b12a', INK, 10); });
  scrTag(ctx, 'ASAL UDAH MATANG', inv(T13.ud, T13.ud + .15, t), '#fff', 300, 84);
});

// ===== 14 jadi kulitnya kelihatan tua, padahal isinya masih muda =====
const T14 = { ja: wt(14, 'jadi'), ku: wt(14, 'kulitnya'), ke: wt(14, 'kelihatan'), tu: wt(14, 'tua'), pa: wt(14, 'padahal'), is: wt(14, 'isinya'), ma: wt(14, 'masih'), mu: wt(14, 'muda') };
SH(ls(14), ls(15), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(14), { x: 540, y: 1110, z: 1.2 }], [ls(15), { x: 540, y: 1110, z: 1.3 }]], 3);
  blurLayer(ctx, c => dapur(c, t, cam, { hideRani: true, hideBudi: true, plate: true, yel: false, blk: false }), 10);
  const pop = backOut(inv(ls(14) - .1, ls(14) + .25, t)), glowK = inv(T14.mu, T14.mu + .3, t);
  scr(ctx, c => {
    drawPisang(c, 540, 880, 2.75 * pop + .01, Object.assign({ rot: 0, t, peel: .6, glow: glowK, face: EF(t, [[ls(14), 'datar'], [T14.tu, { eyes: 'half', mouth: 'wobble', browAng: .35, look: [.3, .5] }]], 62),
      faceFlesh: EF(t, [[ls(14), 'netral'], [T14.mu, 'bangga']], 63) }, BLK));
    // kumis + tongkat untuk kulit "tua"
    const k = inv(T14.tu, T14.tu + .15, t); if (k > 0) { c.save(); c.globalAlpha = k; line(c, 470, 1020, 530, 1010, 9, '#e8e4dc'); line(c, 530, 1010, 590, 1022, 9, '#e8e4dc'); c.restore(); }
    const k2 = inv(T14.mu, T14.mu + .2, t); if (k2 > 0) for (let i = 0; i < 5; i++) { const a = i * 1.25 + t * 2; sparkle(c, 540 + Math.cos(a) * 230, 660 + Math.sin(a) * 120, 22 * k2, k2); }
  });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, 'KULIT: TUA', 300, 1180, 78, inv(T14.tu, T14.tu + .15, t), '#cfc6bc', INK, -.06); popText(ctx, 'ISI: MUDA', 780, 330, 86, inv(T14.mu, T14.mu + .15, t), '#9dff7a', INK, .06); ctx.restore();
});

// ===== 15a Rani cuci piring seminggu =====
const T15 = { ra: wt(15, 'rani'), cu: wt(15, 'cuci'), pi: wt(15, 'piring'), se: wt(15, 'seminggu'), da: wt(15, 'dan'), mi: wt(15, 'minggu'), in: wt(15, 'ini'), la: wt(15, 'lagilagi') };
const SINK = PS.sink, RANI_S = SINK[0] - 40, BUDI_S = SINK[0] + 560;
SH(ls(15), T15.da, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(15), { x: SINK[0] + 260, y: 1120, z: 1.3 }], [T15.se, { x: SINK[0] + 250, y: 1110, z: 1.38 }, ease], [T15.da, { x: SINK[0] + 240, y: 1110, z: 1.42 }, easeIn]], 2);
  const scrub = Math.sin(t * 22), bite = inv(T15.pi, T15.pi + .2, t);
  dapur(ctx, t, cam, { plate: false, yel: false, blk: false, rx: RANI_S, bx: BUDI_S,
    under: c => drawWastafel(c, SINK[0], SINK[1] - 20, 1, { t, water: true }),
    fR: EM(t, [[ls(15), { eyes: 'flinch', mouth: 'wobble', sweat: 1 }]], 64), armsR: { L: armTo(RANI_S, 1, SINK[0] + 40 + scrub * 30, 1290, 1), R: armTo(RANI_S, 1, SINK[0] + 120 - scrub * 20, 1280, 1) },
    fB: EM(t, [[ls(15), 'bangga', { look: [-.8, 0] }]], 65), armsB: { R: armTo(BUDI_S, -1, BUDI_S - 120, 1060, -1), L: [.25, -.3] },
    held: c => pisangDiTangan(c, [BUDI_S - 120, 1060], .85, Object.assign({ rot: -.2, t, peel: 1, droop: .3, faceFlesh: EF(t, [[ls(15), 'lega']], 66) }, BLK)),
    extra: c => { drawTumpukPiring(c, SINK[0] + 270, 1330, .9, 13, { t, dirt: 1, wob: .5 }); drawSpons(c, SINK[0] + 60 + scrub * 30, 1290, .7, .3); }
  });
  scrTag(ctx, 'CUCI PIRING', inv(T15.cu, T15.cu + .15, t) * (1 - inv(T15.se - .1, T15.se, t)), '#9ed8ff', 330, 104);
  scrTag(ctx, 'SEMINGGU', inv(T15.se, T15.se + .15, t), '#ffd23a', 330, 120);
  sfxText(ctx, 'NYAM', 840, 620, 66, bite * (1 - inv(T15.se, T15.se + .2, t)), '#fff', .1);
});
// ===== 15b dan minggu ini, lagi-lagi, -> komposisi frame 0 (loop) =====
SH(T15.da, ENDT, { tr: 'none' }, (ctx, lt, t) => {
  const tl = t - ENDT + 1 / 30, end = ENDT - .14;
  const c0 = cam0(Math.min(0, tl)), k = easeInOut(inv(T15.da, end, t));
  const cam = { x: lerp(560, c0.x, k), y: lerp(1120, c0.y, k), z: lerp(1.2, c0.z, k), r: 0 };
  hookScene(ctx, tl, t >= end ? cam0(tl) : cam, tl);
  scrTag(ctx, 'MINGGU INI...', inv(T15.mi, T15.mi + .15, t) * (1 - inv(T15.la - .1, T15.la, t)), '#fff', 330, 100);
  scrTag(ctx, 'LAGI-LAGI', inv(T15.la, T15.la + .15, t) * (1 - inv(end - .35, end - .2, t)), '#ffd23a', 330, 110);
  scrTag(ctx, 'PILIH SATU', inv(-.15, 0, tl), '#fff', 330, 100);
});
