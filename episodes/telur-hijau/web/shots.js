// ---------- Fakta Unik: "Kuning telur rebus hijau" (~52,8 dtk, tanpa CTA) ----------
// Bentuk cerita kesembilan: "alarm palsu + perbaikan yang memperparah" (Budi kira busuk, rebus lebih lama malah makin hijau; Ibu rebus secukupnya + air es).
// Dapur = set episode Telur (env_telur.js, TL). Aset baru env_hijau.js (telur dibelah, dunia mikro belerang + besi). Loop: shot terakhir = hook dengan waktu negatif.
const SHOTS = [];
const easeInOut = x => x * x * (3 - 2 * x);
const IBU = { cols: ['#ec5b86', '#ec5b86'], hat: 'chef', belt: false, blush: true };
const BUDI = { cols: ['#2f9b5a', '#2f9b5a'], hat: 'tuft', hatCol: INK, belt: false };
const BUDI_WET = { cols: ['#1d6a3c', '#1d6a3c'], hat: 'tuft', hatCol: INK, belt: false };
const C = (b, e) => Object.assign({}, b, e);
const LN = {}; WORDS.forEach(w => { (LN[w.line] = LN[w.line] || []).push(w); });
const ls = i => LN[i][0].s;
const nrm = s => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const fw = (i, str, n = 0) => { const w = LN[i].filter(w => nrm(w.w) === str)[n]; if (!w) throw new Error('kata tidak ada di baris ' + i + ': ' + str); return w.s; };
const wt = (i, str, d = 0, n = 0) => fw(i, str, n) + d;
const ENDT = WORDS[WORDS.length - 1].e + .6;
const SH = (s, e, o, draw) => SHOTS.push(Object.assign({ start: s, end: e, draw }, o));
const CK = (t, keys, sh = 2) => camKeys(t, t, keys, sh);
const standL = { L: [.1, -.04], R: [.1, -.04] };
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
const FY = 1160, FS = 1.0;
const BK = TL.back, BX = TL.budi, PL = TL.plate, TR = TL.tray, ST = TL.stove, PT = TL.pot, SK = TL.sink, RK = TL.rak, BWL = TL.bowl;
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, BK, 600, flip, wx, wy, bend);
function tokoh(ctx, t, P, x, face, arms, flip = 1, extra = {}) { drawStick(ctx, C(P, Object.assign({ x, y: BK, s: 600, flip, armLen: 1.3, legs: standL, arms: arms || idleArms(t, x * .01), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
const scrTag = (ctx, str, k, col = '#ffd23a', y = 330, size = 104) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, str, 540, y, size, k, col, INK, -.05); ctx.restore(); };
const drips = (ctx, t, x, k = 1) => { if (k <= 0) return; for (let i = 0; i < 6; i++) { const q = (t * 1.4 + i / 6) % 1; drawTear(ctx, x - 70 + i * 28, 1180 + q * 260 + (i % 2) * 40, 9, (1 - q) * k); } };
// tangan close-up (ruang layar): lengan tinta dari tepi bawah ke titik genggam
const bigArm = (ctx, x0, y0, x1, y1) => { ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + 60, x1, y1); ctx.lineWidth = 46; ctx.strokeStyle = INK; ctx.stroke(); circle(ctx, x1, y1, 26); ctx.fillStyle = INK; ctx.fill(); ctx.restore(); };

// ===== adegan dapur bersama =====
// o: { fB, armsB, bx, flipB, budiP, budiExtra, fI, armsI, ix, flipI, ibuExtra, fR, armsR, rx, flipR, rExtra, trayN, plateN, pock, rakN, flow, boil, potEggs, steam, fire, bowl, bowlEgg, jam, extra(ctx), under(ctx) }
function kitchen(ctx, t, cam, o) {
  dapurBack(ctx, t, cam, { jam: o.jam == null ? 4.5 : o.jam, fast: o.fast || 0 });
  drawFridge(ctx, TL.fridge, FY, FS, { t, mood: 'happy', look: .4 });
  drawRak(ctx, RK[0], RK[1], 1, { n: o.rakN == null ? 12 : o.rakN, t, tag: false });
  if (o.fI) tokoh(ctx, t, IBU, o.ix == null ? TL.ibuIn : o.ix, o.fI, o.armsI, o.flipI || 1, o.ibuExtra || {});
  if (o.fR) tokoh(ctx, t, RANI, o.rx, o.fR, o.armsR, o.flipR || -1, o.rExtra || {});
  if (o.fB) tokoh(ctx, t, o.budiP || BUDI, o.bx == null ? BX : o.bx, o.fB, o.armsB, o.flipB || 1, o.budiExtra || {});
  dapurMeja(ctx);
  drawKeran(ctx, SK[0], SK[1], 1, { flow: o.flow || 0, t });
  drawStove(ctx, ST[0], ST[1], .9, { fire: o.fire == null ? .5 : o.fire, t });
  drawPanci(ctx, PT[0], PT[1], .8, { t, boil: o.boil == null ? .25 : o.boil, eggs: o.potEggs || [], steam: o.steam == null ? .4 : o.steam });
  if (o.trayN !== false) drawTray(ctx, TR[0], TR[1], .7, { n: o.trayN == null ? 25 : o.trayN, t });
  if (o.bowl) drawMangkukEs(ctx, BWL[0], BWL[1], .7, { t, egg: o.bowlEgg });
  if (o.plateN !== false) drawPiringTelur(ctx, PL[0], PL[1], .9, { n: o.plateN == null ? 4 : o.plateN, pock: o.pock == null ? 1 : o.pock, t });
  if (o.under) o.under(ctx);
  if (o.extra) o.extra(ctx);
}
const scr = (ctx, f) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); f(ctx); ctx.restore(); };
const sfxS = (ctx, ...a) => scr(ctx, c => sfxText(c, ...a));
const win = (t, a, b, f = .15) => inv(a, a + f, t) * (1 - inv(b - .1, b, t));
const tagSeq = (ctx, t, list, y = 330) => list.forEach(([str, a, b, col, size]) => scrTag(ctx, str, inv(a, a + .15, t) * (b == null ? 1 : 1 - inv(b - .1, b, t)), col || '#fff', y, size || 104));
const inCam = (ctx, cam, f) => { ctx.save(); applyCam(ctx, cam, 1); f(ctx); ctx.restore(); };
const BIN = [-150, 1330];
const RX0 = 600;                                    // posisi Rani di dapur

// ===== 0 HOOK: kuning telurnya hijau, dan Budi langsung mau buang tiga puluh butir =====
const H0 = { hi: wt(0, 'hijau'), bu: wt(0, 'budi'), la: wt(0, 'langsung'), bg: wt(0, 'buang'), ti: wt(0, 'tiga'), bt: wt(0, 'butir') };
const EGG0 = [432, 1058];
const cam0 = tl => CK(tl, [[-3, { x: 340, y: 1090, z: 2.05 }], [0, { x: 345, y: 1090, z: 2.1 }, easeOut], [H0.hi, { x: 350, y: 1085, z: 2.2 }, ease], [H0.bu, { x: 300, y: 1120, z: 1.7 }, ease], [H0.ti, { x: 180, y: 1160, z: 1.35 }, ease], [ls(1), { x: 170, y: 1160, z: 1.32 }, easeIn]], 2.2);
function hookScene(ctx, t, cam, tl) {
  const tr = Math.sin(tl * 26) * 3, tip = easeInOut(inv(H0.bg - .1, H0.bt, tl)), lid = easeOut(inv(H0.bg - .3, H0.bg + .1, tl));
  const trX = lerp(TR[0], 10, tip), trY = TR[1] - 60 * Math.sin(tip * Math.PI * .5), trR = -.45 * tip;
  kitchen(ctx, tl + 100, cam, { trayN: false, plateN: false,
    fB: EM(tl, [[-9, 'kaget', { look: [.8, -.2] }], [H0.bu, 'cemas', { look: [-.8, .4] }], [H0.bg + .1, 'ngeden', { look: [-.8, .5] }]], 1),
    armsB: { L: armTo(BX, 1, EGG0[0] - 20, EGG0[1] + 60 + tr, -1), R: tip > 0 ? armTo(BX, 1, trX + 110, trY - 40, -1) : armTo(BX, 1, TR[0] + 120, 1270, -1) },
    extra: c => {
      drawTongSampah(c, BIN[0], BIN[1], .75, { lid, t: tl, face: EF(tl, [[-9, 'netral'], [H0.bg, 'kaget']], 2) });
      c.save(); c.translate(trX, trY); c.rotate(trR); drawTray(c, 0, 0, .7, { n: 30, t: tl }); c.restore();
      drawTelurBelah(c, EGG0[0] + tr, EGG0[1], 62, { green: .7, t: tl, face: EF(tl, [[-9, 'cemas', { look: [-.6, .3] }]], 3) });
    } });
}
SH(0, ls(1), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  tagSeq(ctx, t, [['HIJAU?!', -.2, H0.bg, '#9dff7a', 130], ['BUANG 30 BUTIR!', H0.ti - .1, null, '#ff8a8a', 96]]);
});

// ===== 1 Rani: "Busuk itu, Bud! Ayamnya sakit kali!" =====
const T1 = { ra: wt(1, 'rani'), na: wt(1, 'nambahin'), bs: wt(1, 'busuk'), bu: wt(1, 'bud'), ay: wt(1, 'ayamnya'), sa: wt(1, 'sakit'), ka: wt(1, 'kali') };
SH(ls(1), ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(1), { x: 300, y: 1100, z: 1.5 }], [ls(2), { x: 320, y: 1100, z: 1.6 }]], 3);
  blurLayer(ctx, c => hookScene(c, t, cam, ls(1) - .01), 9);
  scr(ctx, c => {
    const sk = inv(T1.bs - .1, T1.bs + .2, t);
    drawStick(c, C(RANI, { x: 820, y: 2250, s: 1800, shadow: false, flip: -1, armLen: 1.3, arms: { L: [.2, -.1], R: sk > 0 ? reach(820, 2250, 1800, -1, 720, 900 + Math.sin(t * 9) * 6, -1) : [.3, -.2] },
      face: EC(t, [[ls(1), 'curiga', { look: [-.8, .2] }], [T1.bs, 'meringis'], [T1.ay, { eyes: 'half', mouth: 'frown', browAng: .3, look: [-.6, .4] }]], 4), headTilt: .05 }));
    if (sk > 0) stink(c, 300, 760, 1.6, t, sk);
    const tk = backOut(inv(T1.ay - .1, T1.ay + .2, t)); if (tk > 0) drawTelurBelah(c, 280, 1000, 120 * tk + .01, { green: .55, t, face: EF(t, [[T1.ay, 'cemas']], 5) });
  });
  tagSeq(ctx, t, [['BUSUK!', T1.bs, T1.ay, '#ff8a8a', 130], ['AYAM SAKIT?', T1.ay, null, '#ffd23a', 110]]);
});

// ===== 2 Budi ciumin satu-satu. Nggak ada yang bau =====
const T2 = { bu: wt(2, 'budi'), ci: wt(2, 'ciumin'), sa: wt(2, 'satusatu'), ng: wt(2, 'nggak'), ba: wt(2, 'bau') };
const SNIFF = [T2.ci, T2.ci + .45, T2.sa, T2.sa + .4];
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(2), { x: 260, y: 1120, z: 1.7 }], [T2.ci, { x: 250, y: 1110, z: 1.9 }, easeOut], [T2.ng, { x: 260, y: 1090, z: 2.05 }, ease], [ls(3), { x: 265, y: 1085, z: 2.1 }, easeIn]], 2);
  let k = SNIFF.findIndex(s => t < s + .45); if (k < 0) k = SNIFF.length; const nose = [BX + 52, 1012];
  const ph = k < SNIFF.length ? inv(SNIFF[k] - .25, SNIFF[k], t) : 0, from = [TR[0] + 40 - k * 18, 1270];
  const ex = k < SNIFF.length ? [lerp(from[0], nose[0] + 20, easeOut(ph)), lerp(from[1], nose[1] + 30, easeOut(ph))] : null;
  kitchen(ctx, t, cam, { plateN: false, trayN: 30 - Math.min(k, 4),
    fB: EM(t, [[ls(2), 'curiga', { look: [-.6, .4] }], [T2.ci, { eyes: 'half', mouth: 'o', browUp: .3 }], [T2.ng, 'curiga', { look: [.8, -.2] }], [T2.ba + .1, 'sadar']], 6),
    armsB: { L: ex ? armTo(BX, 1, ex[0] - 10, ex[1] + 20, -1) : [.3, -.3], R: [.3, -.3] },
    extra: c => { drawTongSampah(c, BIN[0], BIN[1], .75, { lid: 1, t });
      if (ex) drawTelur(c, ex[0], ex[1], 26, { t });
      for (let j = 0; j < Math.min(k, 4); j++) drawTelur(c, 420 + j * 50, 1306, 22, { t });
      if (ex && ph > .8) for (let i = 0; i < 3; i++) { const q = ((t * 3 + i / 3) % 1); line(c, nose[0] + 30 + q * 40, nose[1] + 10 - i * 14, nose[0] + 50 + q * 40, nose[1] + 10 - i * 14, 5, 'rgba(60,60,80,.5)'); } } });
  if (k > 0 && t < T2.ng) scrTag(ctx, String(Math.min(k, 4)), 1, '#fff', 330, 140);
  tagSeq(ctx, t, [['0 BAU', T2.ng, null, '#9dff7a', 140]]);
  sfxS(ctx, 'SNIF', 760, 700, 80, win(t, T2.ci, T2.ng), '#fff', -.1);
});

// ===== 3 Biar aman, dia rebus telur baru. Setengah jam, biar matang sempurna =====
const T3 = { bi: wt(3, 'biar'), am: wt(3, 'aman'), re: wt(3, 'rebus'), ba: wt(3, 'baru'), se: wt(3, 'setengah'), ja: wt(3, 'jam'), ma: wt(3, 'matang'), sp: wt(3, 'sempurna') };
const BX3 = 820;
SH(ls(3), ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(3), { x: 900, y: 1130, z: 1.4 }], [T3.re, { x: 930, y: 1120, z: 1.55 }, ease], [T3.se, { x: 900, y: 1080, z: 1.4 }, ease], [ls(4), { x: 900, y: 1070, z: 1.45 }, easeIn]], 2);
  const spin = inv(T3.se, T3.sp + .2, t);
  kitchen(ctx, t, cam, { plateN: false, bx: BX3, boil: 1, steam: 1, fire: 1, potEggs: [[-60, 0], [0, 4], [60, 0]], jam: 4.5 + 6 * spin, fast: spin > 0 && spin < 1 ? 1 : 0,
    fB: EM(t, [[ls(3), 'licik', { look: [.8, .4] }], [T3.se, 'sombong', { look: [.8, -.3] }], [T3.sp, 'bangga']], 7), armsB: t > T3.sp ? { L: [.9, 2.0], R: [.9, 2.0] } : { L: armTo(BX3, 1, 960, 1120, -1), R: [.3, -.3] } });
  scr(ctx, c => drawKartuWaktu(c, 540, 1600, 1.1, '30 MENIT', inv(T3.se - .1, T3.se + .15, t), spin * 6));
  tagSeq(ctx, t, [['BIAR AMAN', ls(3) - .1, T3.se, '#fff', 110], ['MATANG SEMPURNA', T3.ma, null, '#ffd23a', 96]], 300);
});

// ===== 4 Dibelah, hijaunya malah makin tebal =====
const T4 = { di: wt(4, 'dibelah'), hi: wt(4, 'hijaunya'), ma: wt(4, 'malah'), mk: wt(4, 'makin'), te: wt(4, 'tebal') };
SH(ls(4), ls(5), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = { x: 820, y: 1060, z: 1.6, r: 0 };
  blurLayer(ctx, c => kitchen(c, t, cam, { plateN: false, bx: BX3, boil: .6, steam: .6, fE: 1, fB: EXPR.kaget }), 10);
  const z = lerp(1, 1.1, inv(ls(4), ls(5), t)), k = backOut(inv(ls(4) - .1, ls(4) + .2, t)), g = lerp(.55, 1, easeOut(inv(T4.hi, T4.te + .2, t)));
  scr(ctx, c => { c.translate(540, 900); c.scale(z, z); c.translate(-540, -900);
    drawTelurBelah(c, 540, 860, 260 * k + .01, { green: g, t, face: EF(t, [[ls(4), 'cemas', { look: [0, -.4] }], [T4.mk, 'meringis']], 8), spooky: inv(T4.te, T4.te + .3, t) });
    const cut = inv(ls(4) - .05, ls(4) + .25, t); if (cut < 1) { c.save(); c.globalAlpha = 1 - cut; line(c, 540 - 320, 860 - 380 + cut * 700, 540 + 320, 860 - 380 + cut * 700, 14, '#ffffff'); c.restore(); }
  });
  tagSeq(ctx, t, [['MAKIN HIJAU!', T4.ma, null, '#9dff7a', 120]], 300);
  sfxS(ctx, 'KRES', 800, 640, 80, win(t, ls(4) - .1, T4.hi), '#fff', -.1);
});

// ===== 5 Ibu rebus telur baru secukupnya, terus langsung cemplungin ke air es =====
const T5 = { ib: wt(5, 'ibu'), re: wt(5, 'rebus'), se: wt(5, 'secukupnya'), te: wt(5, 'terus'), la: wt(5, 'langsung'), ce: wt(5, 'cemplungin'), ai: wt(5, 'air'), es: wt(5, 'es') };
const IX5 = TL.ibuStove;
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 900, y: 1120, z: 1.45 }], [T5.se, { x: 920, y: 1110, z: 1.55 }, ease], [T5.la, { x: 830, y: 1160, z: 1.6 }, ease], [ls(6), { x: 760, y: 1180, z: 1.75 }, easeIn]], 2);
  const mv = easeInOut(inv(T5.la - .1, T5.ce + .25, t)), sp = [lerp(PT[0] - 40, BWL[0] + 20, mv), lerp(1040, 1230, mv) - Math.sin(mv * Math.PI) * 160];
  kitchen(ctx, t, cam, { plateN: false, trayN: false, bowl: true, bowlEgg: mv >= 1, boil: .8, steam: .7, fire: .8, potEggs: mv > 0 ? [] : [[0, 0]], ix: IX5, fI: EM(t, [[ls(5), 'netral', { look: [.8, .3] }], [T5.se, 'sombong', { look: [.8, .4] }], [T5.ai, 'bangga']], 9),
    armsI: { R: armTo(IX5, 1, sp[0] - 170, sp[1] + 20, 1), L: [.3, -.3] },
    fB: EF(t, [[ls(5), 'curiga', { look: [.8, -.1] }]], 10), bx: 300,
    extra: c => { if (t > T5.te - .2) drawSendok(c, sp[0] - 190, sp[1] + 26, 1, 0, true, { t }); else drawSendok(c, PT[0] - 230, 1060, 1, 0, false); } });
  scr(ctx, c => drawKartuWaktu(c, 540, 1600, 1.1, 'SECUKUPNYA', win(t, T5.re - .1, T5.la + .2), inv(T5.re, T5.te, t) * 1.2, '#e8fff0'));
  tagSeq(ctx, t, [['AIR ES!', T5.ai - .05, null, '#bfe9ff', 130]], 330);
  sfxS(ctx, 'CESS', 700, 960, 90, win(t, T5.ce + .15, ls(6) + 1), '#fff', -.1);
});

// ===== 6 Dibelah, kuningnya cerah, nggak ada hijaunya sama sekali =====
const T6 = { di: wt(6, 'dibelah'), ku: wt(6, 'kuningnya'), ce: wt(6, 'cerah'), ng: wt(6, 'nggak'), hi: wt(6, 'hijaunya'), sk: wt(6, 'sekali') };
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = { x: 640, y: 1080, z: 1.5, r: 0 };
  blurLayer(ctx, c => kitchen(c, t, cam, { plateN: false, trayN: false, bowl: true, bowlEgg: true, ix: IX5, fI: EXPR.bangga, fB: EXPR.takjub, fR: EXPR.takjub, rx: RX0 }), 10);
  const z = lerp(1, 1.1, inv(ls(6), ls(7), t)), k = backOut(inv(ls(6) - .1, ls(6) + .2, t));
  scr(ctx, c => { c.translate(540, 900); c.scale(z, z); c.translate(-540, -900);
    drawTelurBelah(c, 540, 860, 260 * k + .01, { green: 0, over: 0, t, glint: T6.ce, face: EF(t, [[ls(6), 'netral'], [T6.ce, 'bangga']], 11) });
    const cut = inv(ls(6) - .05, ls(6) + .25, t); if (cut < 1) { c.save(); c.globalAlpha = 1 - cut; line(c, 220, 480 + cut * 700, 860, 480 + cut * 700, 14, '#ffffff'); c.restore(); }
    if (t > T6.hi) drawCheck(c, 800, 600, 70 * backOut(inv(T6.hi, T6.hi + .2, t)) + .01);
  });
  tagSeq(ctx, t, [['KUNING CERAH', T6.ce - .1, T6.ng, '#ffd23a', 110], ['0 HIJAU', T6.ng, null, '#9dff7a', 130]], 300);
  sfxS(ctx, 'KRES', 800, 640, 80, win(t, ls(6) - .1, T6.ku), '#fff', -.1);
});

// ===== 7 Jadi hijau itu bukan busuk. Itu tanda kelamaan direbus =====
const T7 = { ja: wt(7, 'jadi'), hi: wt(7, 'hijau'), bk: wt(7, 'bukan'), bs: wt(7, 'busuk'), it: wt(7, 'itu', 0, 1), ta: wt(7, 'tanda'), ke: wt(7, 'kelamaan'), di: wt(7, 'direbus') };
SH(ls(7), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const z = lerp(1, 1.08, inv(ls(7), ls(8), t));
  scr(ctx, c => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffe9b8'); g.addColorStop(1, '#ffd08a'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.translate(540, 900); c.scale(z, z); c.translate(-540, -900);
    const a = backOut(inv(ls(7) - .1, ls(7) + .2, t)), b = backOut(inv(T7.ta - .1, T7.ta + .2, t));
    drawTelurBelah(c, 300, 900, 170 * a + .01, { green: 1, t, face: EF(t, [[ls(7), 'cemas'], [T7.bk, 'lega']], 12) });
    drawTelurBelah(c, 780, 900, 170 * b + .01, { green: 0, over: 0, t, face: EF(t, [[T7.ta, 'bangga']], 13) });
    popText(c, 'BUKAN BUSUK!', 540, 600, 104, inv(T7.bk, T7.bk + .15, t), '#9dff7a', INK, -.06);
    popText(c, 'KELAMAAN', 300, 1180, 70, inv(T7.ke - .1, T7.ke + .1, t), '#9dff7a', INK, -.04);
    popText(c, 'PAS', 780, 1180, 80, inv(T7.ke + .1, T7.ke + .3, t), '#ffd23a', INK, -.04);
  });
});

// ===== 8 (mikro) kalau kepanasan kelamaan, belerang di putih telur lepas jadi gas dan kabur ke tengah =====
const T8 = { ka: wt(8, 'kalau'), kp: wt(8, 'kepanasan'), ke: wt(8, 'kelamaan'), be: wt(8, 'belerang'), pu: wt(8, 'putih'), le: wt(8, 'lepas'), ga: wt(8, 'gas'), kb: wt(8, 'kabur'), te: wt(8, 'tengah') };
const sulfState = t => ({ app: inv(T8.be - .15, T8.be + .2, t), gas: inv(T8.le - .1, T8.ga + .1, t), move: inv(T8.kb - .1, T8.te + .6, t) });
function drawSulfs(ctx, t, st, o = {}) {
  SULF.forEach((p, i) => { const k = backOut(clamp(st.app * 1.3 - i * .03)); if (k <= 0) return; const mv = st.move * (o.frozen ? 1 : 1);
    let [x, y] = sulfPos(p, mv); const wig = (1 - (o.ice || 0)) * (st.gas * 10 + 3); x += Math.sin(t * 6 + p.ph) * wig; y += Math.cos(t * 5 + p.ph) * wig;
    drawPartikel(ctx, x, y, 34 * k, 'S', { t, gas: st.gas * (1 - (o.bond || 0)), bond: o.bond || 0, face: i % 3 === 0 ? EF(t, [[T8.be, 'netral'], [T8.le, 'kaget'], [T8.kb, 'licik']], 20 + i) : undefined }); });
}
SH(ls(8), ls(9), { tr: 'whip' }, (ctx, lt, t) => {
  const heat = inv(T8.kp - .1, T8.kp + .3, t), st = sulfState(t);
  mikroTelurBG(ctx, t, { heat });
  drawSulfs(ctx, t, st);
  labelPanah(ctx, 230, 470, 320, 640, 'BELERANG', inv(T8.be, T8.be + .25, t) * (1 - inv(T8.le - .1, T8.le, t)), '#ffe14d');
  tagSeq(ctx, t, [['KEPANASAN', T8.kp - .1, T8.be, '#ffb04a', 110], ['JADI GAS', T8.ga - .1, T8.kb, '#fff', 110], ['KABUR KE TENGAH', T8.kb, null, '#ffd23a', 92]], 300);
});

// ===== 9 (mikro) di situ dia ketemu zat besi dari kuning telur, terus nempel jadi lapisan hijau =====
const T9 = { di: wt(9, 'di'), si: wt(9, 'situ'), ke: wt(9, 'ketemu'), za: wt(9, 'zat'), be: wt(9, 'besi'), ku: wt(9, 'kuning'), te: wt(9, 'terus'), ne: wt(9, 'nempel'), la: wt(9, 'lapisan'), hi: wt(9, 'hijau') };
SH(ls(9), ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  const fe = inv(T9.za - .15, T9.be + .2, t), meet = inv(T9.te - .1, T9.ne + .2, t), bond = inv(T9.ne, T9.la + .2, t), ring = .35 * inv(T9.la - .1, T9.hi + .3, t);
  mikroTelurBG(ctx, t, { heat: .5, ring });
  IRON.forEach((p, i) => { const k = backOut(clamp(fe * 1.3 - i * .03)); if (k <= 0) return; const d = lerp(p.d, MK.yr - 20, easeInOut(meet));
    drawPartikel(ctx, MK.ycx + Math.cos(p.a) * d + Math.sin(t * 4 + p.ph) * 3, MK.ycy + Math.sin(p.a) * d * 1.02, 30 * k * (1 - bond * .5), 'Fe', { t, bond, face: i % 3 === 1 ? EF(t, [[T9.za, 'netral'], [T9.ne, 'lega']], 40 + i) : undefined }); });
  ctx.save(); ctx.globalAlpha = 1 - bond * .6; drawSulfs(ctx, t, { app: 1, gas: 1 - bond, move: 1 }, { bond }); ctx.restore();
  labelPanah(ctx, 830, 560, 700, 850, 'ZAT BESI', inv(T9.za, T9.za + .25, t) * (1 - inv(T9.ne - .1, T9.ne, t)), '#ffb08a');
  tagSeq(ctx, t, [['KETEMU!', T9.ke - .05, T9.za, '#fff', 120], ['LAPISAN HIJAU', T9.la - .05, null, '#9dff7a', 104]], 300);
});

// ===== 10 (mikro) makin lama direbus, makin tebal hijaunya. Air es yang menghentikannya =====
const T10 = { ma: wt(10, 'makin'), la: wt(10, 'lama'), di: wt(10, 'direbus'), mk: wt(10, 'makin', 0, 1), te: wt(10, 'tebal'), hi: wt(10, 'hijaunya'), ai: wt(10, 'air'), es: wt(10, 'es'), me: wt(10, 'menghentikannya') };
SH(ls(10), ls(11), { tr: 'whip' }, (ctx, lt, t) => {
  const grow = inv(ls(10), T10.ai - .1, t), ice = inv(T10.ai - .1, T10.me + .3, t);
  mikroTelurBG(ctx, t, { heat: (1 - ice) * .8, ring: lerp(.35, 1, easeInOut(grow)), over: grow, ice });
  scr(ctx, c => drawKartuWaktu(c, 540, 1560, 1, Math.round(10 + 20 * grow) + ' MENIT', inv(ls(10) - .1, ls(10) + .2, t) * (1 - inv(T10.ai - .2, T10.ai, t)), grow * 3));
  if (ice > .3) drawStamp(ctx, 540, 1560, .9 * backOut(inv(T10.me, T10.me + .2, t)), 'STOP', { rot: -.1 });
  tagSeq(ctx, t, [['MAKIN TEBAL', T10.mk - .05, T10.ai, '#9dff7a', 110], ['AIR ES', T10.ai - .05, null, '#bfe9ff', 130]], 300);
});

// ===== 11 Tetap aman dimakan, cuma kelihatan seram =====
const T11 = { te: wt(11, 'tetap'), am: wt(11, 'aman'), di: wt(11, 'dimakan'), cu: wt(11, 'cuma'), ke: wt(11, 'kelihatan'), se: wt(11, 'seram') };
const RX11 = 560;
SH(ls(11), ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(11), { x: 470, y: 1060, z: 1.6 }], [T11.di, { x: 500, y: 1050, z: 1.75 }, ease], [T11.se, { x: 520, y: 1040, z: 1.85 }, ease], [ls(12), { x: 525, y: 1040, z: 1.9 }, easeIn]], 2);
  const bite = inv(T11.di - .1, T11.di + .2, t), eg = [lerp(RX11 - 90, RX11 - 40, bite), lerp(1150, 1030, bite)];
  kitchen(ctx, t, cam, { plateN: false, trayN: 30,
    fR: EM(t, [[ls(11), 'sombong', { look: [-.6, .5] }], [T11.di, { eyes: 'happy', mouth: 'teeth' }], [T11.se, 'licik', { look: [-.8, 0] }]], 14), rx: RX11, flipR: -1,
    armsR: { R: armTo(RX11, -1, eg[0], eg[1] + 30, -1), L: [.3, -.3] },
    fB: EM(t, [[ls(11), 'kaget', { look: [.8, -.2] }], [T11.se, 'meringis']], 15),
    extra: c => { drawTongSampah(c, BIN[0], BIN[1], .75, { lid: 1, t }); drawTelurBelah(c, eg[0], eg[1], 30, { green: .8, t, spooky: inv(T11.se, T11.se + .3, t) }); } });
  scr(ctx, c => { if (t > T11.am) drawCheck(c, 250, 560, 80 * backOut(inv(T11.am, T11.am + .2, t)) + .01); });
  tagSeq(ctx, t, [['AMAN DIMAKAN', T11.am - .05, T11.cu, '#9dff7a', 104], ['CUMA SERAM', T11.ke, null, '#c8ff9a', 110]], 330);
  sfxS(ctx, 'NYAM', 820, 760, 80, win(t, T11.di, T11.ke), '#fff', -.1);
});

// ===== 12a Budi manggut-manggut =====
const T12 = { bu: wt(12, 'budi'), ma: wt(12, 'manggutmanggut'), be: wt(12, 'besoknya'), re: wt(12, 'rebus'), la: wt(12, 'lagi'), se: wt(12, 'setengah'), ja: wt(12, 'jam'), da: wt(12, 'dan') };
SH(ls(12), T12.be, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(12), { x: 330, y: 1060, z: 1.9 }], [T12.be, { x: 320, y: 1060, z: 2.0 }, easeIn]], 2);
  const nod = inv(T12.ma - .1, T12.ma + .1, t) * Math.sin((t - T12.ma) * 14) * .09;
  kitchen(ctx, t, cam, { plateN: false, trayN: 30, fB: EM(t, [[ls(12), 'lega']], 16), budiExtra: { headTilt: nod }, armsB: { L: [.9, 2.0], R: [.9, 2.0] } });
  scrTag(ctx, 'PAHAM...', inv(T12.ma, T12.ma + .15, t), '#fff', 330, 110);
});
// ===== 12b Besoknya dia rebus lagi =====
SH(T12.be, T12.se, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[T12.be, { x: 900, y: 1110, z: 1.5 }], [T12.se, { x: 910, y: 1100, z: 1.6 }, easeIn]], 2);
  kitchen(ctx, t, cam, { plateN: false, bx: BX3, boil: 1, steam: 1, fire: 1, potEggs: [[-60, 0], [0, 4], [60, 0]], jam: 9, fast: 1,
    fB: EM(t, [[T12.be, 'sombong', { look: [.8, .4] }]], 17), armsB: { L: armTo(BX3, 1, 960, 1120, -1), R: [.3, -.3] } });
  scrTag(ctx, 'BESOKNYA...', inv(T12.be, T12.be + .15, t), '#fff', 330, 110);
});
// ===== 12c setengah jam, dan -> komposisi frame 0 (loop) =====
SH(T12.se, ENDT, { tr: 'whip' }, (ctx, lt, t) => {
  const tl = t - ENDT + 1 / 30;
  hookScene(ctx, t, cam0(tl), tl);
  scr(ctx, c => drawKartuWaktu(c, 540, 1600, 1.1, '30 MENIT', inv(T12.se - .1, T12.se + .15, t) * (1 - inv(ENDT - .5, ENDT - .3, t)), inv(T12.se, ENDT - .4, t) * 6));
  scrTag(ctx, 'HIJAU?!', inv(-.2, 0, tl), '#9dff7a', 330, 130);
});
