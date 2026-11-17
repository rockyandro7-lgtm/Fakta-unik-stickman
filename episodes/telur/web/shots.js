// ---------- Fakta Unik: "Telur bopeng" (~71 dtk, tanpa CTA) ----------
// Pola naskah ref-02 (bentuk cerita: "trik viral gagal satu per satu", bukan lomba / tamu mendadak): krisis di frame 0 (telur bopeng),
// taruhan (30 telur balado untuk bazar), dua trik internet gagal, pengejek (Rani), Ibu memakai telur lama + air mendidih,
// mekanisme singkat lewat dialog Ibu (gelembung lup penampang kulit), loop ke frame 0.
// Aturan v5/v6/v7: kamera selalu bergerak, semua waktu dari kata (wt), satu fungsi per aset (env_telur.js), tata letak TL terkunci.
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
  drawRak(ctx, RK[0], RK[1], 1, { n: o.rakN == null ? 12 : o.rakN, t, tag: true });
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
// telur di tangan Budi (hook + loop): kiri memegang telur, kanan mencabut serpih kulit berulang-ulang
const HE = [440, 1196], HR = 40;
function peelHands(tl, x = BX) {
  const P = 1.05, ph = ((tl % P) + P) % P / P;               // aman untuk tl negatif (loop)
  const pull = ph < .55 ? easeInOut(ph / .55) : 1 - easeInOut((ph - .55) / .45);
  const g = [HE[0] + 30 + 110 * pull, HE[1] - 20 - 80 * pull];
  return { ph, pull, g, arms: { L: armTo(x, 1, HE[0] - 26, HE[1] + 10, -1), R: armTo(x, 1, g[0], g[1], -1) } };
}

// ===== 0-1 HOOK: 5 telur bopeng kayak permukaan bulan -> taruhan: 30 telur balado untuk bazar =====
const H0 = { li: wt(0, '5'), bo: wt(0, 'bopeng'), bu: wt(0, 'bulan') };
const T1 = { pa: wt(1, 'padahal'), be: wt(1, 'besok'), se: wt(1, 'setor'), ti: wt(1, '30'), ba: wt(1, 'balado'), bz: wt(1, 'bazar'), sk: wt(1, 'sekolah') };
const cam0 = t => CK(t, [[0, { x: 470, y: 1150, z: 1.75 }], [H0.li, { x: 480, y: 1140, z: 1.85 }, easeOut], [H0.bo, { x: 470, y: 1190, z: 2.15 }, ease], [H0.bu, { x: 520, y: 1160, z: 2.05 }, ease], [ls(1), { x: 520, y: 1100, z: 1.6 }, ease],
  [T1.ti, { x: 480, y: 980, z: 1.3 }, ease], [T1.sk, { x: 470, y: 960, z: 1.25 }, ease], [ls(2), { x: 440, y: 980, z: 1.3 }, easeIn]], 2.5);
function hookScene(ctx, t, cam, tl, wet = 0) {
  const h = peelHands(tl);
  kitchen(ctx, t, cam, {
    fB: EM(tl, [[-9, 'ngeden', { look: [.8, .6] }], [H0.bo, 'meringis'], [H0.bu + .2, { eyes: 'half', mouth: 'wobble', sweat: .8, look: [.8, .6] }]], 1), armsB: h.arms,
    budiExtra: { bob: Math.sin(h.ph * TAU) * -.006 },
    extra: c => {
      drawTelur(c, HE[0], HE[1], HR, { shell: .45, pock: .7, rot: -.2, shadow: false, t: tl });
      drawKulit(c, h.g[0], h.g[1], .55, -.5 + h.pull * .6, { stuck: .8 });
      if (h.pull > .2) { c.beginPath(); c.moveTo(HE[0] + 20, HE[1] - 10); c.quadraticCurveTo((HE[0] + h.g[0]) / 2, HE[1] + 10, h.g[0] - 10, h.g[1] + 10); c.lineWidth = 5 * (1 - h.pull) + 1; c.strokeStyle = TLP.white; c.stroke(); }
    }
  });
}
SH(0, ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  ctx.save(); applyCam(ctx, cam, 1);
  const mk = inv(H0.bu - .05, H0.bu + .2, t) * (1 - inv(ls(1) + .3, ls(1) + .6, t)); if (mk > 0) { const s2 = backOut(mk); drawBulan(ctx, 590, 1110, 46 * s2); }
  ctx.restore();
  scrTag(ctx, 'BOPENG!', inv(H0.bo, H0.bo + .15, t) * (1 - inv(ls(1) - .1, ls(1), t)), '#ffd23a', 330, 110);
  // gelembung angan-angan: 30 telur balado di bazar sekolah
  const bk = inv(T1.be - .1, T1.be + .25, t);
  drawLup(ctx, 620, 620, 260, bk, c => {
    c.fillStyle = '#ffe9b8'; c.fillRect(-300, -300, 600, 600);
    c.fillStyle = '#e5392f'; c.fillRect(-300, -300, 600, 170); for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-300 + i * 100, -130); c.lineTo(-250 + i * 100, -90); c.lineTo(-200 + i * 100, -130); c.closePath(); c.fillStyle = i % 2 ? '#ffd23a' : '#fff'; c.fill(); }
    text(c, 'BAZAR SEKOLAH', 0, -175, 44, '#fff', INK, 9);
    drawTray(c, 0, 150, 1.05, { n: 30, balado: inv(T1.ba - .1, T1.ba + .2, t) > .5 ? 1 : 0, t });
    if (t > T1.ba) drawRpCoin(c, 190 + Math.sin(t * 4) * 6, -80, 44, Math.cos(t * 5), 1);
  }, ...toScreen(cam, BX + 40, 960));
  scrTag(ctx, '30 TELUR', inv(T1.ti, T1.ti + .15, t), '#fff', 250, 96);
});

// ===== 2 telurnya paling segar, baru dibeli tadi pagi =====
const T2 = { tl: wt(2, 'telurnya'), pa: wt(2, 'paling'), se: wt(2, 'segar'), ba: wt(2, 'baru'), pg: wt(2, 'pagi') };
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(2), { x: 190, y: 1220, z: 1.7 }], [ls(2) + .6, { x: 170, y: 1240, z: 1.95 }, easeOut], [T2.se, { x: 150, y: 1230, z: 2.2 }, ease], [ls(3), { x: 160, y: 1210, z: 2.3 }]], 2);
  kitchen(ctx, t, cam, {
    fB: EM(t, [[ls(2), 'bangga', { look: [-.6, .7] }], [T2.ba, 'sombong', { look: [-.6, .6] }]], 3),
    armsB: { L: armTo(BX, 1, TR[0] + 70, 1250, -1), R: [.22, -.28] },
    extra: c => { const tk = inv(T2.pg - .1, T2.pg + .15, t); if (tk > 0) { c.save(); c.translate(TR[0] - 120, 1150); c.rotate(-.1); c.scale(backOut(tk), backOut(tk)); rrect(c, -95, -40, 190, 80, 12); fillStroke(c, TLP.tag, 5); text(c, 'TADI PAGI', 0, 2, 32, INK, INK, 0); c.restore(); } }
  });
  ctx.save(); applyCam(ctx, cam, 1); propFace(ctx, TR[0], TR[1] - 60, 110, EF(t, [[ls(2), 'netral'], [T2.se, 'bangga']], 4), { t }); ctx.restore();
  glint(ctx, 400, 1120, 160, t, T2.se);
  scrTag(ctx, 'PALING SEGAR', inv(T2.se, T2.se + .15, t), '#fff', 360, 96);
});

// ===== 3 close-up: kulitnya nempel, putih telurnya ikut kecabut =====
const T3 = { ta: wt(3, 'tapi'), di: wt(3, 'dikupas'), ku: wt(3, 'kulitnya'), ne: wt(3, 'nempel'), pu: wt(3, 'putih'), ik: wt(3, 'ikut'), ke: wt(3, 'kecabut') };
SH(ls(3), ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(3), { x: 430, y: 1150, z: 1.6 }], [ls(4), { x: 450, y: 1160, z: 1.7 }]], 2);
  blurLayer(ctx, c => kitchen(c, t, cam, { fB: EF(t, [[ls(3), 'ngeden']], 5), armsB: { L: [.3, -.5], R: [.3, -.5] }, plateN: 4 }), 9);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const E = [520, 840], R = 210, pull = easeInOut(inv(T3.di, T3.ne + .2, t)), rip = easeOut(inv(T3.ke - .1, T3.ke + .35, t));
  const g = [E[0] + 120 + 150 * pull + 160 * rip, E[1] - 120 - 40 * pull - 200 * rip];
  drawTelur(ctx, E[0], E[1] + 10 * Math.sin(t * 30) * (pull > 0 && rip < 1 ? .3 : 0), R, { shell: lerp(.75, .55, rip), pock: lerp(.2, .65, rip), rot: -.12, t,
    face: EF(t, [[ls(3), 'netral', { look: [.6, -.4] }], [T3.ne, 'meringis'], [T3.ke + .1, 'kaget']], 6) });
  // benang putih telur yang lengket ke serpih kulit
  if (pull > 0 && rip < .9) for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(E[0] + 90 + i * 22, E[1] - 140 + i * 12); ctx.quadraticCurveTo((E[0] + g[0]) / 2 + 20, E[1] - 80 + i * 18, g[0] - 40 + i * 10, g[1] + 30); ctx.lineWidth = (14 - i * 3) * (1 - rip); ctx.strokeStyle = TLP.white; ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke(); }
  drawKulit(ctx, g[0], g[1], 1.6, -.4 + rip * .5, { stuck: .4 + .6 * inv(T3.pu, T3.ke, t) });
  bigArm(ctx, -80, 1300, E[0] - 170, E[1] + 140); bigArm(ctx, 1160, 1150, g[0] + 40, g[1] + 20);
  ctx.restore();
  sfxText(ctx, 'NYET', 820, 620, 64, inv(T3.ne, T3.ne + .08, t) * (1 - inv(T3.pu - .1, T3.pu, t)), '#fff', .1);
  sfxText(ctx, 'KREK!', 860, 520, 74, inv(T3.ke, T3.ke + .08, t), '#ffd23a', .12);
  scrTag(ctx, 'IKUT KECABUT', inv(T3.ke, T3.ke + .15, t), '#fff', 300, 90);
});

// ===== 4 trik internet #1: gelindingin di meja sampai retak semua =====
const T4 = { ja: wt(4, 'jadi'), tr: wt(4, 'trik'), in: wt(4, 'internet'), te: wt(4, 'telur'), dg: wt(4, 'digelindingin'), me: wt(4, 'meja'), re: wt(4, 'retak'), se: wt(4, 'semua') };
SH(ls(4), ls(5), { tr: 'whip' }, (ctx, lt, t) => {
  const roll = inv(T4.dg - .1, T4.se + .3, t), ex = lerp(360, 640, easeInOut(roll)) + Math.sin(t * 9) * 30 * (roll > 0 && roll < 1 ? 1 : 0), ey = 1290;
  const cam = CK(t, [[ls(4), { x: 400, y: 1130, z: 1.7 }], [T4.tr, { x: 420, y: 1120, z: 1.9 }, easeOut], [T4.in, { x: 430, y: 1120, z: 2.0 }, ease], [T4.dg, { x: 470, y: 1200, z: 1.85 }, ease], [T4.se, { x: 560, y: 1230, z: 2.0 }, ease], [ls(5), { x: 580, y: 1240, z: 2.1 }]], 2);
  const phone = t < T4.te;
  kitchen(ctx, t, cam, {
    fB: EM(t, [[ls(4), 'curiga', { look: [.5, .2] }], [T4.in, 'licik', { look: [.5, .2] }], [T4.dg, 'ngeden', { look: [.8, .7] }], [T4.re + .1, 'cemas', { look: [.8, .7] }]], 7),
    armsB: phone ? { L: armTo(BX, 1, 450, 1120, -1), R: armTo(BX, 1, 470, 1160, -1) } : { L: armTo(BX, 1, ex - 10, ey - 50, -1), R: armTo(BX, 1, ex + 20, ey - 52, -1) },
    plateN: 4,
    extra: c => {
      if (phone) drawHP(c, 470, 1110, .55, -.15);
      else drawTelur(c, ex, ey - 6, 36, { shell: 1, cracks: inv(T4.dg, T4.se, t), rot: (ex - 360) / 36, t, face: EF(t, [[T4.te, 'cemas'], [T4.re, 'meringis']], 8) });
    }
  });
  for (const [h, x] of [[T4.re, 500], [T4.re + .2, 620], [T4.se, 700]]) sfxText(ctx, 'KRETEK', x, 1050, 48, inv(h, h + .06, t) * (1 - inv(h + .4, h + .5, t)), '#fff', -.1);
  scrTag(ctx, 'TRIK 1', inv(T4.tr, T4.tr + .15, t) * (1 - inv(T4.te - .1, T4.te, t)), '#ffd23a');
});

// ===== 5 "Bopeng." (punchline, close-up) =====
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 600, y: 1240, z: 2.1 }], [ls(6), { x: 600, y: 1240, z: 2.2 }]], 2);
  blurLayer(ctx, c => kitchen(c, t, cam, { fB: EF(t, [[ls(5), 'datar']], 9), armsB: { L: [.3, -.5], R: [.3, -.5] }, plateN: 4 }), 9);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const k = backOut(inv(ls(5), ls(5) + .25, t)), z = 1 + .08 * inv(ls(5), ls(6), t);
  ctx.translate(540, 820); ctx.scale(z, z);
  drawTelur(ctx, 0, 0, 210 * (.85 + .15 * k), { shell: 0, pock: 1, rot: .1, t, face: EF(t, [[ls(5), { eyes: 'half', mouth: 'wobble' }]], 10) });
  ctx.restore();
  scrTag(ctx, 'BOPENG.', inv(ls(5) + .05, ls(5) + .2, t), '#e5392f', 330, 120);
});

// ===== 6 trik #2: dikupas di bawah air keran =====
const BXS = -200;                                   // Budi di samping wastafel (menghadap kiri)
const T6 = { tr: wt(6, 'trik'), ke: wt(6, 'kedua'), di: wt(6, 'dikupas'), ba: wt(6, 'bawah'), kr: wt(6, 'keran') };
const T7 = { bo: wt(7, 'bopeng'), la: wt(7, 'lagi'), da: wt(7, 'dan'), bj: wt(7, 'bajunya'), bs: wt(7, 'basah'), ku: wt(7, 'kuyup') };
const sinkHands = t => { const wob = Math.sin(t * 14) * 8; return { L: armTo(BXS, -1, SK[0] - 10, 1210, -1), R: armTo(BXS, -1, SK[0] + 40 + wob, 1196 + wob, -1) }; };
SH(ls(6), ls(7), { tr: 'none' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(6), { x: -140, y: 1100, z: 1.45 }], [T6.ke, { x: -200, y: 1130, z: 1.6 }, easeOut], [T6.di, { x: -250, y: 1160, z: 1.8 }, ease], [ls(7), { x: -280, y: 1180, z: 1.95 }]], 2);
  const flow = inv(T6.di - .2, T6.di + .1, t);
  kitchen(ctx, t, cam, {
    fB: EM(t, [[ls(6), 'licik', { look: [.8, .5] }], [T6.di, 'ngeden', { look: [.8, .6] }]], 11), bx: BXS, flipB: -1, armsB: sinkHands(t), flow,
    extra: c => drawTelur(c, SK[0] + 20, 1196, 34, { shell: .6, pock: .5, rot: .3, shadow: false, t })
  });
  scrTag(ctx, 'TRIK 2', inv(T6.ke, T6.ke + .15, t), '#ffd23a');
});
// ===== 7 bopeng lagi, bajunya basah kuyup =====
SH(ls(7), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(7), { x: -280, y: 1180, z: 1.95 }], [T7.la, { x: -270, y: 1170, z: 2.1 }, ease], [T7.bj, { x: -230, y: 1120, z: 1.7 }, ease], [T7.ku, { x: -220, y: 1110, z: 1.6 }, ease], [ls(8), { x: -215, y: 1105, z: 1.58 }]], 3);
  const spray = inv(T7.da - .1, T7.bs, t), wet = inv(T7.bj, T7.bs + .2, t);
  kitchen(ctx, t, cam, {
    fB: EM(t, [[ls(7), { eyes: 'half', mouth: 'wobble', look: [.8, .6] }], [T7.bs, 'meringis'], [T7.ku + .1, 'datar', { look: [0, 0] }]], 12), bx: BXS, flipB: -1,
    budiP: wet > .5 ? BUDI_WET : BUDI, armsB: t < T7.bs ? sinkHands(t) : { L: [.25, -.4], R: [.25, -.4] }, flow: 1,
    extra: c => {
      if (t < T7.bs) drawTelur(c, SK[0] + 20, 1196, 34, { shell: 0, pock: 1, rot: .3, shadow: false, t });
      if (spray > 0 && wet < 1) for (let i = 0; i < 14; i++) { const q = (spray * 1.5 + i / 14) % 1, a = -1.2 + i * .12; drawTear(c, SK[0] + 30 + Math.cos(a) * 320 * q + 60, 1190 + Math.sin(a) * 200 * q + 260 * q * q, 12, 1 - q); }
      drips(c, t, BXS, wet);
    }
  });
  scrTag(ctx, 'BOPENG LAGI', inv(T7.bo, T7.bo + .15, t) * (1 - inv(T7.da - .1, T7.da, t)), '#ffd23a');
  sfxText(ctx, 'BYUR!', 640, 760, 80, inv(T7.bs, T7.bs + .08, t) * (1 - inv(ls(8) - .2, ls(8), t)), '#9ed8ff', .12);
});

// ===== 8 Rani lewat: "Bud, ini telur balado apa telur kena cacar?" =====
const T8 = { ra: wt(8, 'rani'), le: wt(8, 'lewat'), ng: wt(8, 'ngintip'), pi: wt(8, 'piring'), bu: wt(8, 'bud'), ba: wt(8, 'balado'), ke: wt(8, 'kena'), ca: wt(8, 'cacar') };
SH(ls(8), ls(9), { tr: 'whip' }, (ctx, lt, t) => {
  const RX0 = 1500, RX1 = 700, wk = easeInOut(inv(ls(8), T8.ng, t)), rx = lerp(RX0, RX1, wk), walking = t < T8.ng, wc = walkCycle(RX0 - rx, 600, 1);
  const peek = inv(T8.ng, T8.ng + .4, t), laugh = t > T8.ca;
  const cam = CK(t, [[ls(8), { x: 760, y: 1060, z: 1.25 }], [T8.ng, { x: 620, y: 1080, z: 1.4 }, easeOut], [T8.ba, { x: 560, y: 1090, z: 1.5 }, ease], [ls(9), { x: 540, y: 1090, z: 1.55 }]], 2);
  kitchen(ctx, t, cam, {
    fB: EM(t, [[ls(8), 'datar', { look: [.8, .5] }], [T8.bu + .05, 'kaget', { look: [.9, 0] }], [T8.ca + .1, { eyes: 'half', mouth: 'frown', browAng: .3, look: [.9, 0] }]], 13),
    budiP: BUDI_WET, armsB: { L: [.3, -.5], R: [.3, -.5] }, plateN: 5,
    fR: EM(t, [[ls(8), 'netral', { look: [-.8, 0] }], [T8.ng, 'curiga', { look: [-.6, .7] }], [T8.ba, 'licik', { look: [-.8, .2] }], [T8.ca + .05, 'bangga']], 14), rx, flipR: -1,
    armsR: walking ? wc.arms : laugh ? { L: [2.5 + Math.sin(t * 22) * .15, .5], R: [.4, -.9] } : { L: [.4, -.9], R: [.4, -.9] },
    rExtra: walking ? { legs: wc.legs, bob: wc.bob, footDir: -1, lean: -wc.lean } : { lean: -.12 * peek, bob: laugh ? Math.abs(Math.sin(t * 14)) * -.02 : 0 },
    extra: c => drips(c, t, BX, .5)
  });
  if (laugh) sfxText(ctx, 'HAHA', 900, 820, 66, inv(T8.ca, T8.ca + .1, t), '#ffd23a', .12);
  scrTag(ctx, 'KENA CACAR?', inv(T8.ca - .05, T8.ca + .12, t), '#fff', 340, 96);
});

// ===== 9 telur tinggal 15, uangnya udah habis =====
const T9 = { te: wt(9, 'telur'), ti: wt(9, 'tinggal'), li: wt(9, '15'), da: wt(9, 'dan'), ua: wt(9, 'uangnya'), ha: wt(9, 'habis') };
SH(ls(9), ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(9), { x: 150, y: 1240, z: 2.1 }], [T9.li, { x: 140, y: 1250, z: 2.3 }, easeOut], [T9.da, { x: 200, y: 1200, z: 2.1 }, ease], [T9.ha, { x: 300, y: 1150, z: 1.95 }, ease], [ls(10), { x: 310, y: 1140, z: 2.0 }]], 2);
  const wl = inv(T9.ua - .2, T9.ua + .2, t);
  kitchen(ctx, t, cam, {
    fB: EM(t, [[ls(9), 'cemas', { look: [-.6, .7] }], [T9.ha + .05, { eyes: 'wide', mouth: 'wobble', sweat: 1, look: [.6, .4] }]], 15), budiP: BUDI_WET,
    armsB: wl > 0 ? { L: armTo(BX, 1, 380, 1200, -1), R: armTo(BX, 1, 470, 1200, -1) } : { L: [.3, -.5], R: [.3, -.5] }, trayN: 15, plateN: 5,
    extra: c => { if (wl > 0) drawDompet(c, 425, 1210, .55 * backOut(wl), { open: inv(T9.ua, T9.ha, t), fly: t > T9.ha, t }); drips(c, t, BX, .4); }
  });
  ctx.save(); applyCam(ctx, cam, 1); propFace(ctx, TR[0], TR[1] - 60, 110, EF(t, [[ls(9), 'cemas']], 16), { t }); ctx.restore();
  scrTag(ctx, 'SISA 15', inv(T9.li, T9.li + .15, t) * (1 - inv(T9.ua - .1, T9.ua, t)), '#fff');
  scrTag(ctx, 'Rp0', inv(T9.ha, T9.ha + .15, t), '#e5392f', 340, 120);
});

// ===== 10 Ibu pulang, lihat piring, ambil telur dari rak: telur yang sudah seminggu =====
const T10 = { la: wt(10, 'lalu'), pu: wt(10, 'pulang'), li: wt(10, 'lihat'), pi: wt(10, 'piring'), lg: wt(10, 'langsung'), am: wt(10, 'ambil'), ra: wt(10, 'rak'), te: wt(10, 'telur', 0, 1), se: wt(10, 'seminggu') };
const IX = TL.ibuIn;
SH(ls(10), ls(11), { tr: 'whip' }, (ctx, lt, t) => {
  const IX0 = -900, wk = easeInOut(inv(ls(10), T10.li, t)), ix = lerp(IX0, IX, wk), walking = wk > 0 && wk < 1, wc = walkCycle(ix - IX0, 600, 1);
  const grab = inv(T10.am - .2, T10.am + .15, t), down = inv(T10.ra, T10.te, t), hand = [lerp(RK[0] - 40, IX + 120, easeInOut(down)), lerp(RK[1] - 30, 1180, easeInOut(down))];
  const cam = CK(t, [[ls(10), { x: -380, y: 1060, z: 1.25 }], [T10.li, { x: 60, y: 1090, z: 1.25 }, ease], [T10.am, { x: 20, y: 1000, z: 1.4 }, ease], [T10.te, { x: 40, y: 980, z: 1.6 }, ease], [T10.se, { x: 70, y: 950, z: 1.95 }, ease], [ls(11), { x: 75, y: 945, z: 2.05 }]], 2);
  kitchen(ctx, t, cam, {
    fI: EM(t, [[ls(10), 'netral', { look: [.8, 0] }], [T10.li, 'curiga', { look: [.8, .6] }], [T10.am, 'datar', { look: [.6, -.7] }], [T10.se, 'sombong', { look: [.5, .2] }]], 17), ix,
    armsI: walking ? wc.arms : grab > 0 ? { L: [.3, -.5], R: armTo(ix, 1, hand[0], hand[1], -1) } : { L: [.4, -.9], R: [.4, -.9] },
    ibuExtra: walking ? { legs: wc.legs, bob: wc.bob, footDir: 1, lean: wc.lean } : {},
    fB: EF(t, [[ls(10), { eyes: 'half', mouth: 'wobble', look: [-.8, 0] }], [T10.am + .1, 'curiga', { look: [-.8, -.3] }]], 18), budiP: BUDI_WET, armsB: { L: [.3, -.5], R: [.3, -.5] }, plateN: 5, trayN: 15,
    rakN: t > T10.am + .1 ? 11 : 12,
    extra: c => { if (t > T10.am + .1) drawTelur(c, hand[0], hand[1], 30, { shell: 1, shadow: false, t, face: EF(t, [[T10.am, 'datar'], [T10.se, 'sombong']], 19) }); drips(c, t, BX, .3); }
  });
  ctx.save(); applyCam(ctx, cam, 1); glint(ctx, RK[0] + 120, RK[1] + 60, 90, t, T10.se); ctx.restore();
  scrTag(ctx, 'SEMINGGU', inv(T10.se, T10.se + .15, t), '#ffd23a', 330, 100);
});

// ===== 11 close-up Budi: "Bu, itu telur lama!" =====
const T11 = { bu: wt(11, 'bu'), it: wt(11, 'itu'), la: wt(11, 'lama') };
SH(ls(11), ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(11), { x: 200, y: 1080, z: 1.3 }], [ls(12), { x: 210, y: 1070, z: 1.4 }]], 3);
  blurLayer(ctx, c => kitchen(c, t, cam, { fI: EF(t, [[ls(11), 'datar']], 20), plateN: 5, trayN: 15, rakN: 11 }), 8);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const f = EC(t, [[ls(11), 'kaget', { look: [-.6, 0] }], [T11.la, { eyes: 'wide', mouth: 'frown', browAng: .35, look: [-.7, 0] }]], 21);
  const zy = 2200 - 50 * ease(inv(ls(11), ls(12), t)), pt = inv(T11.it - .1, T11.it + .15, t);
  drawStick(ctx, C(BUDI_WET, { x: 600, y: zy, s: 1800, shadow: false, flip: -1, arms: { L: [.2, -.1], R: pt > 0 ? [lerp(.2, 1.6, pt), lerp(-.1, -.6, pt)] : [.2, -.1] }, face: f, headTilt: .06 + Math.sin(t * 9) * .02 }));
  ctx.restore();
  scrTag(ctx, 'TELUR LAMA?!', inv(T11.la - .05, T11.la + .12, t), '#fff', 330, 100);
});

// ===== 12 Ibu cuek: tunggu mendidih dulu, baru telur diturunin pelan-pelan =====
const T12 = { ib: wt(12, 'ibu'), cu: wt(12, 'cuek'), tu: wt(12, 'tunggu'), md: wt(12, 'mendidih'), du: wt(12, 'dulu'), ba: wt(12, 'baru'), dt: wt(12, 'diturunin'), pp: wt(12, 'pelanpelan') };
const IS = TL.ibuStove;
SH(ls(12), ls(13), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(12), { x: 860, y: 1080, z: 1.4 }], [T12.cu, { x: 880, y: 1060, z: 1.5 }, easeOut], [T12.md, { x: 980, y: 1130, z: 1.75 }, ease], [T12.dt, { x: 1000, y: 1080, z: 1.85 }, ease], [ls(13), { x: 1010, y: 1110, z: 2.0 }]], 2);
  const boil = .25 + .75 * inv(T12.tu, T12.md + .3, t), low = easeInOut(inv(T12.dt - .1, T12.pp + .5, t)), inPot = low >= .97;
  const sp = [lerp(IS + 150, IS + 170, low), lerp(930, 1030, low)];
  kitchen(ctx, t, cam, {
    fI: EM(t, [[ls(12), 'datar', { look: [.8, .3] }], [T12.md, 'curiga', { look: [.8, .7] }], [T12.dt, 'sombong', { look: [.8, .7] }]], 22), ix: IS,
    armsI: { L: [.3, -.5], R: armTo(IS, 1, sp[0], sp[1], -1) }, boil, fire: 1, steam: boil, potEggs: inPot ? [[0, 0]] : [],
    fB: EF(t, [[ls(12), 'curiga', { look: [.8, 0] }]], 23), budiP: BUDI_WET, armsB: { L: [.3, -.5], R: [.3, -.5] }, plateN: 5, trayN: 15, rakN: 11,
    extra: c => drawSendok(c, sp[0], sp[1], .8, .3, !inPot, { shell: 1, t })
  });
  scrTag(ctx, 'CUEK', inv(T12.cu, T12.cu + .12, t) * (1 - inv(T12.tu - .1, T12.tu, t)), '#fff');
  scrTag(ctx, 'MENDIDIH DULU', inv(T12.md, T12.md + .15, t) * (1 - inv(T12.dt - .1, T12.dt, t)), '#ff8a2a', 330, 92);
  scrTag(ctx, 'PELAN-PELAN', inv(T12.pp, T12.pp + .15, t), '#9ed8ff', 330, 92);
  for (const [h, x] of [[T12.md, 760], [T12.md + .3, 880]]) sfxText(ctx, 'BLUBUK', x, 980, 46, inv(h, h + .06, t) * (1 - inv(h + .6, h + .7, t)), '#fff', -.1);
});

// ===== 13a matang -> direndam air dingin =====
const T13 = { ma: wt(13, 'matang'), dr: wt(13, 'direndam'), ai: wt(13, 'air'), di: wt(13, 'dingin'), dk: wt(13, 'diketuk'), sk: wt(13, 'sekali'), ku: wt(13, 'kulitnya'), le: wt(13, 'lepas'), ut: wt(13, 'utuh'), mu: wt(13, 'mulus') };
const K13 = T13.dk - .08;
SH(ls(13), K13, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(13), { x: 1000, y: 1110, z: 2.0 }], [T13.dr, { x: 900, y: 1150, z: 1.8 }, ease], [T13.di, { x: 760, y: 1200, z: 2.0 }, ease], [K13, { x: 740, y: 1210, z: 2.1 }]], 2);
  const mv = easeInOut(inv(T13.dr - .1, T13.di - .05, t)), sp = [lerp(IS + 170, BWL[0] - 145, mv), lerp(1030, 1170, mv) - 70 * Math.sin(mv * Math.PI) + 30 * inv(T13.di - .05, T13.di + .1, t)];
  const inBowl = t > T13.di + .05;
  kitchen(ctx, t, cam, {
    fI: EM(t, [[ls(13), 'sombong', { look: [.8, .7] }], [T13.di, 'lega', { look: [.8, .7] }]], 24), ix: IS,
    armsI: { L: [.3, -.5], R: armTo(IS, 1, sp[0], sp[1], -1) }, boil: 1, fire: 1, steam: 1, potEggs: t < T13.dr ? [[0, 0]] : [],
    fB: EF(t, [[ls(13), 'curiga', { look: [.8, 0] }]], 25), budiP: BUDI_WET, armsB: { L: [.3, -.5], R: [.3, -.5] }, plateN: 5, trayN: 15, rakN: 11, bowl: true, bowlEgg: inBowl,
    extra: c => { if (t > T13.dr - .1) drawSendok(c, sp[0], sp[1], .8, .3, !inBowl, { shell: 1, t }); }
  });
  ctx.save(); applyCam(ctx, cam, 1); glint(ctx, PT[0], PT[1] - 170, 110, t, T13.ma); ctx.restore();
  scrTag(ctx, 'MATANG', inv(T13.ma, T13.ma + .12, t) * (1 - inv(T13.dr - .1, T13.dr, t)), '#fff');
  sfxText(ctx, 'CESS', 640, 980, 64, inv(T13.di, T13.di + .08, t), '#9ed8ff', -.1);
});
// ===== 13b close-up: diketuk sekali, kulitnya lepas utuh. Mulus. =====
SH(K13, ls(14), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[K13, { x: 600, y: 1150, z: 1.6 }], [ls(14), { x: 620, y: 1150, z: 1.7 }]], 2);
  blurLayer(ctx, c => kitchen(c, t, cam, { fI: EF(t, [[K13, 'sombong']], 26), ix: IS, fB: EF(t, [[K13, 'curiga']], 27), budiP: BUDI_WET, plateN: 5, trayN: 15, rakN: 11, bowl: true, boil: 1, fire: 1 }), 9);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const E = [540, 860], R = 200, off = easeInOut(inv(T13.le - .15, T13.ut + .2, t)), knock = t > T13.dk && t < T13.dk + .12;
  drawTelur(ctx, E[0], E[1], R, { shell: 0, pock: 0, t, glint: T13.mu, face: EF(t, [[K13, 'netral', { look: [0, -.4] }], [T13.mu, 'bangga']], 28) });
  if (off < 1) { drawKulit(ctx, E[0] + 260 * off, E[1] - 110 - 330 * off, 2.05, .35 * off, { whole: true }); drawKulit(ctx, E[0] - 200 * off, E[1] + 120 + 300 * off, 2.05, Math.PI - .3 * off, { whole: true }); }
  if (off < .05) { ctx.save(); ctx.translate(E[0], E[1]); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(-R * .95, 20); for (let k = 1; k <= 10; k++) ctx.lineTo(-R * .95 + k * R * .19, 20 + (k % 2 ? 14 : -10)); if (t > T13.dk) ctx.stroke(); ctx.restore(); }
  bigArm(ctx, -80, 1320, E[0] - 170, E[1] + 150);
  const sp = [E[0] + 220, lerp(E[1] - 260, E[1] - 200, knock ? 1 : 0)]; if (t < T13.le) { bigArm(ctx, 1160, 1000, sp[0] + 80, sp[1] + 60); ctx.save(); ctx.translate(sp[0], sp[1]); ctx.rotate(-.6); rrect(ctx, -16, -10, 150, 20, 10); fillStroke(ctx, '#c9ccd6', 5); circle(ctx, -14, 0, 24); fillStroke(ctx, '#c9ccd6', 5); ctx.restore(); }
  ctx.restore();
  sfxText(ctx, 'TOK', 780, 560, 72, inv(T13.dk, T13.dk + .06, t) * (1 - inv(T13.dk + .5, T13.dk + .6, t)), '#fff', -.12);
  scrTag(ctx, 'LEPAS UTUH', inv(T13.le, T13.le + .15, t) * (1 - inv(T13.mu - .1, T13.mu, t)), '#fff');
  scrTag(ctx, 'MULUS!', inv(T13.mu, T13.mu + .15, t), '#ffd23a', 330, 120);
});

// ===== 14-16: penjelasan Ibu (gelembung lup: penampang kulit telur) =====
const T14 = { te: wt(14, 'telur'), sg: wt(14, 'segar'), ny: wt(14, 'nyimpan'), ga: wt(14, 'gas'), pu: wt(14, 'putihnya'), le: wt(14, 'lengket'), sl: wt(14, 'selaput'), ku: wt(14, 'kulit'), lm: wt(14, 'lem') };
const T15 = { se: wt(15, 'seminggu'), ra: wt(15, 'rak'), gs: wt(15, 'gasnya'), ka: wt(15, 'kabur'), po: wt(15, 'poripori'), ku: wt(15, 'kulit'), so: wt(15, 'soda'), db: wt(15, 'dibiarin'), kb: wt(15, 'kebuka') };
const T16 = { te: wt(16, 'terus'), ms: wt(16, 'masukinnya'), md: wt(16, 'mendidih'), bi: wt(16, 'biar'), kb: wt(16, 'keburu'), ma: wt(16, 'mateng'), sb: wt(16, 'sebelum'), ne: wt(16, 'nempel') };
const IE = 300, BE = 720;                          // Ibu di posisi Budi (pegang telur mulus), Budi mendengarkan di kanan
const camExp = t => CK(t, [[ls(14), { x: 480, y: 1060, z: 1.3 }], [ls(14) + .7, { x: 500, y: 1080, z: 1.4 }, easeOut], [ls(17) - .05, { x: 540, y: 1100, z: 1.55 }]], 2);
const LUP = [660, 560, 270];
function expBG(ctx, t, cam, fI, fB) {
  kitchen(ctx, t, cam, { fI, ix: IE, armsI: { L: armTo(IE, 1, 440, 1190, -1), R: [2.3 + Math.sin(t * 5) * .15, .6] }, fB, bx: BE, flipB: -1, budiP: BUDI_WET, armsB: { L: [.3, -.5], R: [.3, -.5] },
    plateN: false, trayN: 15, rakN: 11, bowl: true, boil: .6, fire: .5,
    extra: c => drawTelur(c, 450, 1180, 36, { shell: 0, pock: 0, shadow: false, t }) });
}
const lupTail = cam => toScreen(cam, 450, 1140);
SH(ls(14), ls(15), { tr: 'none' }, (ctx, lt, t) => {
  const cam = camExp(t);
  expBG(ctx, t, cam, EM(t, [[ls(14), 'netral', { look: [.8, -.3] }], [T14.ga, 'curiga', { look: [.6, -.6] }], [T14.lm, 'sombong', { look: [.8, -.2] }]], 29), EF(t, [[ls(14), 'curiga', { look: [-.8, -.3] }], [T14.lm, 'sadar']], 30));
  drawLup(ctx, LUP[0], LUP[1], LUP[2], inv(ls(14), ls(14) + .35, t), c => drawPenampang(c, { t, gas: inv(T14.ny - .2, T14.ga + .3, t), glue: inv(T14.le - .2, T14.le + .3, t), gasFace: EF(t, [[ls(14), 'licik']], 31) }), ...lupTail(cam));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  popText(ctx, 'GAS', 540, 215, 80, inv(T14.ga, T14.ga + .15, t) * (1 - inv(T14.pu - .1, T14.pu, t)), '#9ed8ff', INK, .05);
  popText(ctx, 'SELAPUT', 540, 215, 70, inv(T14.sl, T14.sl + .15, t) * (1 - inv(T14.lm - .1, T14.lm, t)), '#e9dcff', INK, .05);
  popText(ctx, 'LEM!', 540, 215, 100, inv(T14.lm, T14.lm + .15, t), '#ffe07a', INK, .05);
  ctx.restore();
});
SH(ls(15), ls(16), { tr: 'none' }, (ctx, lt, t) => {
  const cam = camExp(t);
  expBG(ctx, t, cam, EM(t, [[ls(15), 'lega', { look: [.8, -.3] }], [T15.so, 'bangga', { look: [-.6, -.6] }]], 32), EF(t, [[ls(15), 'sadar', { look: [-.8, -.3] }], [T15.so, 'takjub', { look: [-.8, -.5] }]], 33));
  const esc = inv(T15.gs, T15.ku + .2, t);
  drawLup(ctx, LUP[0], LUP[1], LUP[2], 1, c => drawPenampang(c, { t, gas: 1, escape: esc, glue: 1 - inv(T15.po, T15.ku + .3, t), gap: inv(T15.po, T15.so, t), gasFace: EF(t, [[ls(15), 'licik'], [T15.ka, 'bangga']], 34) }), ...lupTail(cam));
  const sk = inv(T15.so - .15, T15.so + .2, t);
  drawLup(ctx, 220, 440, 150, sk, c => { c.fillStyle = '#ffe9b8'; c.fillRect(-200, -200, 400, 400); drawSoda(c, 0, 130, .62, { open: inv(T15.db, T15.kb, t), fizz: inv(T15.db, T15.kb + .2, t), t }); });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  popText(ctx, '7 HARI', 540, 215, 84, inv(T15.se, T15.se + .15, t) * (1 - inv(T15.gs - .1, T15.gs, t)), '#ffd23a', INK, .05);
  popText(ctx, 'KABUR!', 540, 215, 90, inv(T15.ka, T15.ka + .15, t) * (1 - inv(T15.so - .1, T15.so, t)), '#fff', INK, .05);
  ctx.restore();
});
SH(ls(16), ls(17), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = camExp(t);
  expBG(ctx, t, cam, EM(t, [[ls(16), 'netral', { look: [.8, -.3] }], [T16.md, 'sombong', { look: [.8, -.3] }], [T16.ne, 'bangga', { look: [-.8, 0] }]], 35), EF(t, [[ls(16), 'takjub', { look: [-.8, -.5] }], [T16.ne, 'lega']], 36));
  drawLup(ctx, LUP[0], LUP[1], LUP[2], 1, c => drawPenampang(c, { t, gas: .35, gap: .45, hot: inv(T16.md - .2, T16.md + .3, t), set: inv(T16.kb - .1, T16.ma + .3, t), gasFace: EF(t, [[ls(16), 'cemas']], 37) }), ...lupTail(cam));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  popText(ctx, 'MENDIDIH', 540, 215, 84, inv(T16.md, T16.md + .15, t) * (1 - inv(T16.kb - .1, T16.kb, t)), '#ff8a2a', INK, .05);
  popText(ctx, 'LANGSUNG MATANG', 540, 215, 70, inv(T16.ma, T16.ma + .15, t), '#fff', INK, .05);
  const ck = inv(T16.ne, T16.ne + .2, t); if (ck > 0) { ctx.save(); ctx.translate(900, 420); const s2 = backOut(ck); ctx.scale(s2, s2); drawCheck(ctx, 0, 0, 56); ctx.restore(); }
  ctx.restore();
});

// ===== 17 besoknya ludes -> whip-pan kembali ke frame 0 (loop) =====
const T17 = { be: wt(17, 'besoknya'), te: wt(17, 'telur'), ba: wt(17, 'baladonya'), lu: wt(17, 'ludes'), ta: wt(17, 'tapi'), bu: wt(17, 'budi'), ha: wt(17, 'hari'), pe: wt(17, 'pertama'), wa: wt(17, 'waktu') };
const EB = TL.endBudi, ET = TL.endTray;
SH(ls(17), ENDT, { tr: 'none' }, (ctx, lt, t) => {
  const PB = T17.pe, back = inv(PB, ENDT, t), e = easeInOut(back);
  const c0 = cam0(0), a = { x: 1400, y: 1120, z: 1.5 };
  const cam = back <= 0 ? CK(t, [[ls(17), { x: 1480, y: 1180, z: 1.9 }], [T17.lu, { x: 1460, y: 1170, z: 1.75 }, easeOut], [T17.ta, { x: 1430, y: 1140, z: 1.6 }, ease], [PB, a, ease]], 2)
    : { x: lerp(a.x, c0.x, e), y: lerp(a.y, c0.y, e), z: lerp(a.z, c0.z, e) - .3 * Math.sin(e * Math.PI), r: 0 };
  if (back > .5) {                           // di tengah pan cepat, adegan kembali ke frame 0
    const tl = t - ENDT; hookScene(ctx, t, cam, tl); return;
  }
  const fan = inv(T17.lu, T17.lu + .3, t);
  kitchen(ctx, t, cam, {
    jam: 7, fB: EM(t, [[ls(17), 'netral', { look: [.8, .5] }], [T17.lu, 'bangga', { look: [.6, -.2] }], [T17.bu, 'lega', { look: [-.8, 0] }]], 38), bx: EB,
    armsB: { L: [.3, -.5], R: armTo(EB, 1, EB + 110, 1120 - 20 * fan, -1) }, plateN: false, trayN: 15, rakN: 11, bowl: true, boil: 0, fire: 0, steam: 0,
    extra: c => { drawTray(c, ET[0], ET[1], .7, { n: 0, t }); for (let i = 0; i < 4; i++) if (fan > 0) drawNote(c, EB + 120 + i * 18 * fan, 1100 - i * 8 * fan, .5, -.5 + i * .3 * fan, 1); }
  });
  ctx.save(); applyCam(ctx, cam, 1); propFace(ctx, ET[0], ET[1] - 60, 110, EF(t, [[ls(17), 'netral'], [T17.lu, 'takjub']], 39), { t }); ctx.restore();
  scrTag(ctx, 'BESOKNYA', inv(ls(17), ls(17) + .15, t) * (1 - inv(T17.lu - .1, T17.lu, t)), '#fff', 330, 92);
  scrTag(ctx, 'LUDES!', inv(T17.lu, T17.lu + .15, t) * (1 - inv(T17.ta - .1, T17.ta, t)), '#ffd23a', 330, 120);
});
