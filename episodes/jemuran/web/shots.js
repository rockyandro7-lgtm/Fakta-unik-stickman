// ---------- Fakta Unik: "Jemuran apek" (~74 dtk, tanpa CTA) ----------
// Pola naskah ref-02, bentuk cerita keempat: "cari tersangka" (Bawang = lomba, Nasi = tamu mendadak, Telur = trik viral gagal).
// Krisis di frame 0 (Rani mencium kemeja wawancara: bau kain pel), dua tersangka gagal (deterjen murah, air sumur) + senjata terakhir (pewangi),
// ejekan Budi, Ibu menunjuk pelaku sebenarnya (bakteri di serat kain, dunia mikro), solusi (air panas, jarak, kipas), loop ke frame 0.
// Aturan v5/v6/v7: kamera selalu bergerak, semua waktu dari kata (wt), satu fungsi per aset (env_jemur.js), tata letak JL terkunci.
const SHOTS = [];
const easeInOut = x => x * x * (3 - 2 * x);
const IBU = { cols: ['#ec5b86', '#ec5b86'], hat: 'chef', belt: false, blush: true };
const BUDI = { cols: ['#2f9b5a', '#2f9b5a'], hat: 'tuft', hatCol: INK, belt: false };
const C = (b, e) => Object.assign({}, b, e);
const RANI_K = C(RANI, { cols: [JMP.shirt, JMP.shirt] });          // Rani memakai kemeja wawancara (akhir)
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
const FT = JL.feet, RX = JL.rani, RK = JL.rack, EB = JL.bucket[0];
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, FT, 600, flip, wx, wy, bend);
const standL = { L: [.1, -.04], R: [.1, -.04] };
function tokoh(ctx, t, P, x, face, arms, flip = 1, extra = {}) { drawStick(ctx, C(P, Object.assign({ x, y: FT, s: 600, flip, armLen: 1.3, legs: standL, arms: arms || idleArms(t, x * .01), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
const scrTag = (ctx, str, k, col = '#ffd23a', y = 330, size = 104) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, str, 540, y, size, k, col, INK, -.05); ctx.restore(); };
const scr = (ctx, f) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); f(ctx); ctx.restore(); };
// tangan mencubit hidung, digambar DI ATAS kepala (kepala digambar setelah lengan di drawStick)
function pinchHand(ctx, x, y, s, flip) { ctx.save(); ctx.lineCap = 'round'; line(ctx, x + flip * .2 * s, y - .66 * s, x + flip * .05 * s, y - .715 * s, .03 * s, INK); circle(ctx, x + flip * .05 * s, y - .715 * s, .038 * s); ctx.fillStyle = INK; ctx.fill(); ctx.restore(); }
const flashK = (t, t0, d = .3) => (t > t0 && t < t0 + d) ? 1 - (t - t0) / d : 0;

// ===== ruangan bersama =====
// o: { fR, armsR, rx, flipR, raniP, rExtra, fB, armsB, bx, flipB, bExtra, fI, armsI, ix, flipI, ibuExtra, rack:{...}|false, flash, jam, fast, door, under(ctx), extra(ctx) }
function rumah(ctx, t, cam, o = {}) {
  rumahBG(ctx, t, cam, { rain: 1, flash: o.flash || 0, jam: o.jam == null ? 8 : o.jam, fast: o.fast || 0, door: o.door || 0 });
  if (o.rack !== false) drawJemuran(ctx, RK[0], RK[1], 1, Object.assign({ t, shirt: false }, o.rack || {}));
  if (o.under) o.under(ctx);
  if (o.fI) tokoh(ctx, t, IBU, o.ix, o.fI, o.armsI, o.flipI || 1, o.ibuExtra || {});
  if (o.fR) tokoh(ctx, t, o.raniP || RANI, o.rx == null ? RX : o.rx, o.fR, o.armsR, o.flipR || 1, o.rExtra || {});
  if (o.fB) tokoh(ctx, t, BUDI, o.bx, o.fB, o.armsB, o.flipB || 1, o.bExtra || {});
  if (o.extra) o.extra(ctx);
}
// kemeja di tangan: sniff 0..1 (didekatkan ke hidung), away 0..1 (dijauhkan karena bau)
const SHS = .72;
function holdShirt(x, flip, sniff = 0, away = 0) {
  const hx = x + flip * (88 + 170 * away - 14 * sniff), hy = 1072 + 8 * sniff + 10 * away;
  return { hook: [hx, hy], arms: { R: armTo(x, flip, hx + flip * 60, hy + 70, -1), L: armTo(x, flip, hx - flip * 40, hy + 200, -1) } };
}
// adegan mencium kemeja (hook, "tetap bau", "nggak bau"). o: { tr (waktu reaksi), bad (1 = bau, 0 = wangi), wet, seed, f0 }
function sniffScene(ctx, t, cam, tl, o) {
  const rec = o.bad ? easeOut(inv(o.tr, o.tr + .25, tl)) : 0;
  const sn = rec > 0 ? 0 : .5 + .5 * Math.sin(tl * 7);
  const h = holdShirt(RX, 1, sn * (o.bad ? 1 : 1 - inv(o.tr, o.tr + .3, tl)), rec);
  rumah(ctx, t, cam, {
    fR: o.face, armsR: h.arms,
    rExtra: { headTilt: -.18 * rec + Math.sin(tl * 34) * .04 * rec * (1 - inv(o.tr + .3, o.tr + .7, tl)), lean: -.08 * rec },
    rack: o.rack || {},
    extra: c => drawKemeja(c, h.hook[0], h.hook[1], SHS, { t, wet: o.wet || 0, stink: o.bad ? inv(o.tr - .25, o.tr + .15, tl) : 0, fresh: o.bad ? 0 : inv(o.tr, o.tr + .3, tl) })
  });
}

// ===== 0 HOOK: Rani mencium kemeja wawancara -> bau kain pel =====
const H0 = { ra: wt(0, 'rani'), ny: wt(0, 'nyium'), wa: wt(0, 'wawancara'), be: wt(0, 'besok'), da: wt(0, 'dan'), mu: wt(0, 'mukanya'), la: wt(0, 'langsung'), ka: wt(0, 'kain'), pe: wt(0, 'pel') };
const cam0 = t => CK(t, [[0, { x: 400, y: 1085, z: 1.95 }], [H0.mu, { x: 410, y: 1075, z: 2.08 }, ease], [H0.la, { x: 440, y: 1050, z: 1.8 }, easeOut], [H0.ka, { x: 470, y: 1020, z: 1.62 }, ease], [ls(1), { x: 500, y: 1010, z: 1.58 }, easeIn]], 2.5);
function hookScene(ctx, t, cam, tl) {
  sniffScene(ctx, t, cam, tl, { tr: H0.mu, bad: 1, face: EM(tl, [[-9, { eyes: 'half', mouth: 'o', look: [.7, .3] }], [H0.mu, 'meringis'], [H0.ka, { eyes: 'x', mouth: 'wobble', sweat: 1 }]], 1) });
}
SH(0, ls(1), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  scrTag(ctx, 'BESOK WAWANCARA', inv(H0.wa, H0.wa + .15, t) * (1 - inv(H0.da - .1, H0.da, t)), '#fff', 300, 84);
  drawLup(ctx, 780, 560, 210, inv(H0.ka - .15, H0.ka + .2, t), c => { c.fillStyle = '#e9e2c8'; c.fillRect(-300, -300, 600, 600); c.fillStyle = '#b9b29a'; c.fillRect(-300, 120, 600, 200); drawKainPel(c, -10, 150, .62, t); }, ...toScreen(cam, RX + 140, 1010));
  scrTag(ctx, 'BAU KAIN PEL!', inv(H0.ka, H0.ka + .15, t), '#b6e35a', 300, 100);
});

// ===== 1 baru dicuci kemarin, kering di dalam rumah, hujan terus =====
const T1 = { ke: wt(1, 'kemejanya'), di: wt(1, 'dicuci'), cu: wt(1, 'cuma'), kr: wt(1, 'keringnya'), da: wt(1, 'dalam'), so: wt(1, 'soalnya'), hu: wt(1, 'hujan'), te: wt(1, 'terus') };
SH(ls(1), ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(1), { x: 600, y: 1090, z: 1.75 }], [T1.di, { x: 590, y: 1060, z: 1.55 }, easeOut], [T1.kr, { x: 640, y: 1010, z: 1.32 }, ease], [T1.hu, { x: 900, y: 860, z: 1.4 }, ease], [ls(2), { x: 960, y: 800, z: 1.55 }, easeIn]], 2);
  rumah(ctx, t, cam, { flash: flashK(t, T1.hu, .35), rack: { shirt: true, wet: 1, face: EF(t, [[ls(1), 'netral', { look: [0, .3] }], [T1.da, 'cemas', { look: [.6, -.4] }]], 2) } });
  flash(ctx, t, T1.hu, .14);
  sfxText(ctx, 'JDERR!', 760, 520, 84, inv(T1.hu, T1.hu + .08, t), '#fff7b0', .1);
  scrTag(ctx, 'BARU DICUCI', inv(T1.di, T1.di + .15, t) * (1 - inv(T1.cu - .1, T1.cu, t)), '#fff');
  scrTag(ctx, 'KERING DI DALAM', inv(T1.da, T1.da + .15, t) * (1 - inv(T1.so - .1, T1.so, t)), '#ffd23a', 330, 92);
  scrTag(ctx, 'HUJAN TERUS', inv(T1.hu, T1.hu + .15, t), '#9ed8ff');
});

// ===== 2 Rani cari tersangka (kaca pembesar) =====
const T2 = { ja: wt(2, 'jadi'), ra: wt(2, 'rani'), ca: wt(2, 'cari'), te: wt(2, 'tersangka') };
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(2), { x: 360, y: 1110, z: 1.6 }], [T2.ra, { x: 350, y: 1100, z: 1.95 }, easeOut], [T2.te, { x: 340, y: 1095, z: 2.25 }, ease], [ls(3), { x: 335, y: 1095, z: 2.35 }, easeIn]], 2);
  const up = easeOut(inv(T2.ja, T2.ra, t)), L = [lerp(RX + 150, RX + 62, up), lerp(1250, 1078, up)];
  rumah(ctx, t, cam, {
    fR: EM(t, [[ls(2), 'curiga', { look: [.7, 0] }], [T2.te, 'licik', { look: [.8, 0] }]], 3),
    armsR: { R: armTo(RX, 1, L[0] + 70, L[1] + 50, -1), L: [.25, -.3] },
    rack: { shirt: true, wet: .4 },
    extra: c => drawKacaPembesar(c, L[0], L[1], .62, .6)
  });
  spotlight(ctx, ...toScreen(cam, RX + 20, 1090), 360, inv(T2.te, T2.te + .2, t));
  scrTag(ctx, 'CARI TERSANGKA', inv(T2.ca, T2.ca + .15, t), '#fff');
});

// ===== papan tersangka (layar penuh) =====
// o: { item(ctx,x,y), label, slide (Budi masuk 0..1), bF (wajah Budi), z }
function lineupScene(ctx, t, o) {
  scr(ctx, c => {
    const z = o.z || 1; c.translate(540, 960); c.scale(z, z); c.translate(-540, -960);
    c.fillStyle = '#3a3f5c'; c.fillRect(-200, -200, W + 400, 1430);
    for (let i = 1; i <= 8; i++) { const yy = 1230 - i * 125; line(c, -200, yy, W + 200, yy, 4, 'rgba(255,255,255,.4)'); text(c, String(i * 25), 60, yy + 4, 28, 'rgba(255,255,255,.7)', null, 0); }
    c.fillStyle = '#262a40'; c.fillRect(-200, 1230, W + 400, 900); line(c, -200, 1230, W + 200, 1230, 8);
    const g = c.createRadialGradient(o.cx || 540, 700, 80, o.cx || 540, 800, 700); g.addColorStop(0, 'rgba(255,240,180,.35)'); g.addColorStop(1, 'rgba(255,240,180,0)'); c.fillStyle = g; c.fillRect(-200, -200, W + 400, 2400);
    o.item(c);
    if (o.slide > 0) drawStick(c, C(BUDI, { x: lerp(1500, 850, easeInOut(o.slide)), y: 1230, s: 760, flip: -1, face: o.bF, arms: { L: [2.75, .25], R: [2.75, .25] }, legs: standL, headTilt: Math.sin(t * 26) * .02 }));
    drawPapanNama(c, o.cx || 540, 470, o.label, 1.4, -.03);
  });
}

// ===== 3a tersangka pertama: deterjen murah yang dibeli Budi =====
const T3 = { te: wt(3, 'tersangka'), pe: wt(3, 'pertama'), de: wt(3, 'deterjen'), mu: wt(3, 'murah'), di: wt(3, 'dibeli'), bu: wt(3, 'budi'), b2: wt(3, 'budi', 0, 1), ds: wt(3, 'disuruh'), be: wt(3, 'beli'), pa: wt(3, 'paling'), ma: wt(3, 'mahal'), ke: wt(3, 'kemejanya'), dc: wt(3, 'dicuci'), ul: wt(3, 'ulang') };
SH(ls(3), T3.b2, { tr: 'whip' }, (ctx, lt, t) => {
  const sl = inv(T3.di - .15, T3.bu + .2, t), cx = lerp(540, 330, easeInOut(sl));
  lineupScene(ctx, t, { z: 1 + .07 * inv(ls(3), T3.b2, t), label: 'TERSANGKA 1', cx, slide: sl,
    bF: EF(t, [[T3.di - .15, 'cemas', { look: [-.8, 0] }]], 4),
    item: c => drawDeterjen(c, cx, 1230, 2.3, { t, face: EF(t, [[ls(3), 'cemas', { look: [.5, 0] }], [T3.mu, 'meringis']], 5) }) });
  sfxText(ctx, 'MURAH', 820, 900, 70, inv(T3.mu, T3.mu + .08, t) * (1 - inv(T3.di - .1, T3.di, t)), '#ff8a8a', .1);
  sfxText(ctx, 'PEMBELI!', 840, 360, 64, inv(T3.bu, T3.bu + .08, t), '#ffd23a', .1);
});
// ===== 3b Budi beli yang paling mahal, kemeja dicuci ulang =====
const BWX = -330;                                     // Budi di samping ember
const scrub = t => { const w = Math.sin(t * 13) * 26; return { L: armTo(BWX, 1, EB + -60 + w, 1350, -1), R: armTo(BWX, 1, EB + 10 - w, 1345, -1) }; };
SH(T3.b2, ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const wash = t > T3.ke - .05, show = inv(T3.pa - .2, T3.ma, t);
  const cam = CK(t, [[T3.b2, { x: -60, y: 1140, z: 1.3 }], [T3.ds, { x: -80, y: 1130, z: 1.38 }, easeOut], [T3.ma, { x: -240, y: 1040, z: 1.62 }, ease], [T3.ke, { x: -200, y: 1180, z: 1.55 }, ease], [ls(4), { x: -170, y: 1230, z: 1.7 }, easeIn]], 2);
  const B = [lerp(BWX + 110, BWX + 150, show), lerp(1250, 1050, easeOut(show))];
  rumah(ctx, t, cam, {
    fB: EM(t, [[T3.b2, 'cemas', { look: [.8, 0] }], [T3.pa, 'bangga', { look: [.4, -.6] }], [T3.ke, 'ngeden', { look: [.7, .8] }]], 6), bx: BWX,
    armsB: wash ? scrub(t) : { L: [.25, -.3], R: armTo(BWX, 1, B[0], B[1] + 10, -1) },
    fR: EF(t, [[T3.b2, 'curiga', { look: [-.8, 0] }], [T3.ds, 'sombong', { look: [-.8, 0] }]], 7), rx: 140, flipR: -1,
    armsR: { L: [.25, -.3], R: [lerp(.3, 1.55, inv(T3.ds - .1, T3.ds + .15, t)), 0] },
    extra: c => {
      drawEmber(c, EB, FT, 1, { t, water: 1, foam: wash ? inv(T3.ke, T3.dc + .3, t) : 0, shirt: wash ? 1 : 0, slosh: wash ? 1 : 0 });
      if (!wash) drawDeterjen(c, B[0], B[1] + 120, .7, { premium: 1, t, glow: T3.ma }); else drawDeterjen(c, EB + 230, FT, .7, { premium: 1, t });
    }
  });
  scrTag(ctx, 'PALING MAHAL', inv(T3.ma, T3.ma + .15, t) * (1 - inv(T3.ke - .1, T3.ke, t)), '#ffd23a');
  scrTag(ctx, 'CUCI ULANG', inv(T3.dc, T3.dc + .15, t), '#fff');
  for (const [h, x] of [[T3.dc, 420], [T3.dc + .3, 620]]) sfxText(ctx, 'KUCEK', x, 800, 52, inv(h, h + .06, t) * (1 - inv(h + .5, h + .6, t)), '#fff', -.1);
});

// ===== 4 "Hasilnya? Tetap bau kain pel." =====
const T4 = { ha: wt(4, 'hasilnya'), te: wt(4, 'tetap'), ba: wt(4, 'bau'), ka: wt(4, 'kain') };
SH(ls(4), ls(5), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(4), { x: 390, y: 1090, z: 2.15 }], [T4.te, { x: 400, y: 1080, z: 2.3 }, ease], [ls(5), { x: 430, y: 1060, z: 2.0 }, easeIn]], 2);
  sniffScene(ctx, t, cam, t, { tr: T4.te, bad: 1, wet: .5, face: EM(t, [[ls(4), { eyes: 'half', mouth: 'o', look: [.7, .3] }], [T4.te, 'meringis'], [T4.ka, { eyes: 'x', mouth: 'wobble', sweat: 1 }]], 8) });
  scrTag(ctx, 'HASILNYA?', inv(ls(4), ls(4) + .15, t) * (1 - inv(T4.te - .1, T4.te, t)), '#fff');
  scrTag(ctx, 'TETAP BAU', inv(T4.te, T4.te + .15, t), '#b6e35a', 330, 110);
});

// ===== 5a tersangka kedua: air sumur =====
const T5 = { te: wt(5, 'tersangka'), ke: wt(5, 'kedua'), ai: wt(5, 'air'), su: wt(5, 'sumur'), km: wt(5, 'kemejanya'), di: wt(5, 'dibilas'), pa: wt(5, 'pakai'), ga: wt(5, 'galon') };
SH(ls(5), T5.km, { tr: 'whip' }, (ctx, lt, t) => {
  lineupScene(ctx, t, { z: 1 + .07 * inv(ls(5), T5.km, t), label: 'TERSANGKA 2', cx: 380, slide: 1,
    bF: EF(t, [[ls(5), 'datar', { look: [-.8, 0] }]], 9),
    item: c => drawEmber(c, 380, 1230, 2.1, { t, water: 1, label: 'SUMUR', face: EF(t, [[ls(5), 'netral', { look: [.4, 0] }], [T5.su, 'curiga', { look: [.6, -.3] }]], 10) }) });
  scrTag(ctx, 'AIR SUMUR?', inv(T5.su, T5.su + .15, t), '#9ed8ff', 330, 100);
});
// ===== 5b dibilas pakai air galon =====
const GX = -420;                                     // Budi memegang galon
SH(T5.km, ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const tilt = easeInOut(inv(T5.di - .2, T5.pa, t)), rot = lerp(.2, 2.25, tilt), gb = [lerp(-300, -330, tilt), lerp(1250, 1130, tilt)];
  const gc = [gb[0] + Math.sin(rot) * 150, gb[1] - Math.cos(rot) * 150];
  const cam = CK(t, [[T5.km, { x: -170, y: 1180, z: 1.35 }], [T5.di, { x: -190, y: 1170, z: 1.5 }, easeOut], [T5.ga, { x: -180, y: 1220, z: 1.7 }, ease], [ls(6), { x: -170, y: 1230, z: 1.78 }, easeIn]], 2);
  rumah(ctx, t, cam, {
    fB: EM(t, [[T5.km, 'ngeden', { look: [.6, -.2] }], [T5.ga, { eyes: 'flinch', mouth: 'teeth', sweat: 1 }]], 11), bx: GX,
    armsB: { L: armTo(GX, 1, gc[0] - 40, gc[1] + 30, -1), R: armTo(GX, 1, gc[0] + 30, gc[1] - 30, -1) }, bExtra: { lean: -.06 * tilt },
    extra: c => {
      drawEmber(c, EB, FT, 1, { t, water: 1, shirt: 1, slosh: tilt });
      drawGalon(c, gb[0], gb[1], .85, { rot, fill: lerp(1, .6, inv(T5.pa, ls(6), t)) });
      if (tilt > .9) { const m = [gb[0] + Math.sin(rot) * 290, gb[1] - Math.cos(rot) * 290]; c.beginPath(); c.moveTo(m[0], m[1]); c.quadraticCurveTo(m[0] + 20, m[1] + 30, EB - 20, 1340); c.lineWidth = 34; c.strokeStyle = INK; c.lineCap = 'round'; c.stroke(); c.lineWidth = 24; c.strokeStyle = JMP.water; c.stroke(); }
    }
  });
  sfxText(ctx, 'GLUK GLUK', 720, 760, 60, inv(T5.pa, T5.pa + .08, t), '#9ed8ff', -.08);
  scrTag(ctx, 'AIR GALON', inv(T5.ga, T5.ga + .15, t), '#fff');
});

// ===== 6 masih apek, galonnya habis dua =====
const T6 = { ma: wt(6, 'masih'), ap: wt(6, 'apek'), ga: wt(6, 'galonnya'), ha: wt(6, 'habis'), du: wt(6, 'dua') };
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(6), { x: 560, y: 1080, z: 1.85 }], [T6.ap, { x: 570, y: 1090, z: 2.0 }, ease], [T6.ga - .1, { x: 300, y: 1200, z: 1.6 }, ease], [T6.du, { x: 40, y: 1300, z: 1.55 }, ease], [ls(7), { x: 20, y: 1300, z: 1.62 }, easeIn]], 2);
  rumah(ctx, t, cam, {
    rack: { shirt: true, wet: .7, stink: 1, face: EF(t, [[ls(6), { eyes: 'half', mouth: 'wobble' }]], 12) },
    fB: EM(t, [[ls(6), { eyes: 'half', mouth: 'flat', sweat: 1, look: [.5, .6] }], [T6.du, { eyes: 'spiral', mouth: 'wobble', sweat: 1 }]], 13), bx: -260,
    armsB: { L: [.05, -.05], R: [.05, -.05] }, bExtra: { lean: .14, bob: .02 },
    extra: c => { drawEmber(c, EB + 40, FT, 1, { t, water: 1, shirt: 0 }); drawGalon(c, -20, FT - 90, .8, { rot: Math.PI / 2, fill: 0 }); drawGalon(c, 540, FT - 90, .8, { rot: -Math.PI / 2, fill: 0 }); }
  });
  scrTag(ctx, 'MASIH APEK', inv(T6.ma, T6.ma + .15, t) * (1 - inv(T6.ga - .2, T6.ga - .1, t)), '#b6e35a');
  scrTag(ctx, '2 GALON HABIS', inv(T6.du, T6.du + .15, t), '#fff', 330, 96);
});

// ===== 7 senjata terakhir: pewangi, satu botol penuh =====
const PX = -500;                                     // Rani di samping ember
const T7 = { ra: wt(7, 'rani'), ke: wt(7, 'keluarin'), se: wt(7, 'senjata'), te: wt(7, 'terakhir'), pe: wt(7, 'pewangi'), sa: wt(7, 'satu'), bo: wt(7, 'botol'), pn: wt(7, 'penuh') };
SH(ls(7), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const up = easeOut(inv(T7.ke, T7.se + .2, t)), pour = easeInOut(inv(T7.sa - .25, T7.sa + .1, t));
  const B = pour > 0 ? [lerp(PX + 150, -335, pour), lerp(1060, 1160, pour)] : [lerp(PX - 40, PX + 150, up), lerp(1300, 1060, up)];
  const rot = pour > 0 ? lerp(0, 2.0, pour) : lerp(.5, 0, up);
  const cam = CK(t, [[ls(7), { x: -400, y: 1290, z: 1.45 }], [T7.se, { x: -390, y: 1150, z: 1.6 }, easeOut], [T7.pe, { x: -350, y: 1080, z: 1.85 }, ease], [T7.sa, { x: -280, y: 1200, z: 1.6 }, ease], [ls(8), { x: -270, y: 1220, z: 1.66 }, easeIn]], 2);
  const bc = [B[0] + Math.sin(rot) * 80, B[1] - Math.cos(rot) * 80];
  rumah(ctx, t, cam, {
    fR: EM(t, [[ls(7), 'licik', { look: [.6, 0] }], [T7.pe, 'sombong', { look: [.5, -.6] }], [T7.sa, 'ngeden', { look: [.7, .7] }]], 14), rx: PX,
    armsR: { R: armTo(PX, 1, bc[0], bc[1], -1), L: pour > 0 ? armTo(PX, 1, bc[0] - 40, bc[1] + 40, -1) : [.25, -.3] },
    extra: c => { drawEmber(c, EB, FT, 1, { t, water: 1, shirt: 1, foam: .3 + .5 * pour, slosh: pour }); drawPewangi(c, B[0], B[1], .72, { rot, pour: pour >= 1 ? 1 - inv(T7.pn + .2, ls(8), t) : 0, drop: 150, t }); }
  });
  ctx.save(); applyCam(ctx, cam, 1); glint(ctx, PX + 150, 900, 120, t, T7.pe); ctx.restore();
  scrTag(ctx, 'SENJATA TERAKHIR', inv(T7.se, T7.se + .15, t) * (1 - inv(T7.pe - .1, T7.pe, t)), '#fff', 330, 90);
  scrTag(ctx, 'PEWANGI', inv(T7.pe, T7.pe + .15, t) * (1 - inv(T7.sa - .1, T7.sa, t)), '#ff8fc2', 330, 110);
  scrTag(ctx, '1 BOTOL PENUH', inv(T7.bo, T7.bo + .15, t), '#ffd23a', 330, 96);
  sfxText(ctx, 'GLEK GLEK', 760, 760, 58, inv(T7.sa + .1, T7.sa + .2, t), '#ffc2e0', -.08);
});

// ===== 8 kamarnya wangi bunga; sejam kemudian bunga campur kain pel =====
const T8 = { ka: wt(8, 'kamarnya'), wa: wt(8, 'wangi'), bu: wt(8, 'bunga'), se: wt(8, 'sejam'), ke: wt(8, 'kemudian'), ba: wt(8, 'baunya'), b2: wt(8, 'bunga', 0, 1), ca: wt(8, 'campur'), kn: wt(8, 'kain') };
SH(ls(8), ls(9), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(8), { x: 460, y: 1020, z: 1.3 }], [T8.bu, { x: 470, y: 1000, z: 1.42 }, easeOut], [T8.se, { x: 250, y: 720, z: 1.75 }, ease], [T8.ba, { x: 470, y: 1000, z: 1.5 }, ease], [T8.kn, { x: 450, y: 1030, z: 1.7 }, ease], [ls(9), { x: 440, y: 1040, z: 1.75 }, easeIn]], 2);
  const hr = inv(T8.se, T8.ba - .1, t), bad = inv(T8.ba - .1, T8.b2 + .3, t);
  rumah(ctx, t, cam, { jam: 8 + hr, fast: hr > 0 && hr < 1 ? 1 : 0,
    rack: { shirt: true, wet: .4, stink: bad, face: EF(t, [[ls(8), 'lega'], [T8.ba, 'licik']], 15) },
    fR: EM(t, [[ls(8), 'lega', { look: [.6, -.3] }], [T8.ba, 'sadar', { look: [.8, -.2] }], [T8.kn, 'meringis']], 16), rx: RX - 40,
    armsR: bad > 0 ? { L: armTo(RX - 40, 1, RX + 20, 1100, -1), R: [.3, -.4] } : { L: [1.0, .9], R: [1.0, .9] },
    rExtra: { headTilt: bad > 0 ? 0 : -.08 + Math.sin(t * 3) * .04 },
    extra: c => drawWangi(c, 560, 1000, 380, t, inv(T8.ka, T8.bu, t) * (1 - .25 * bad))
  });
  timeGrade(ctx, .35 * hr * (1 - inv(T8.ba, T8.ba + .3, t)), 'malam');
  scrTag(ctx, 'WANGI BUNGA', inv(T8.wa, T8.wa + .15, t) * (1 - inv(T8.se - .1, T8.se, t)), '#ff8fc2');
  scrTag(ctx, '1 JAM KEMUDIAN', inv(T8.se, T8.se + .15, t) * (1 - inv(T8.ba - .1, T8.ba, t)), '#fff', 330, 92);
  scrTag(ctx, 'BUNGA + KAIN PEL', inv(T8.ca, T8.ca + .15, t), '#b6e35a', 330, 88);
});

// ===== 9 Budi nutup hidung: "Kak, kamu bau kayak taman bunga kebanjiran." =====
const T9 = { bu: wt(9, 'budi'), nu: wt(9, 'nutup'), hi: wt(9, 'hidung'), ka: wt(9, 'kak'), ba: wt(9, 'bau'), ta: wt(9, 'taman'), ke: wt(9, 'kebanjiran') };
SH(ls(9), ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(9), { x: 520, y: 1060, z: 1.3 }], [ls(10), { x: 540, y: 1050, z: 1.4 }]], 3);
  blurLayer(ctx, c => rumah(c, t, cam, { rack: { shirt: true, wet: .3, stink: .8 }, fR: EF(t, [[ls(9), 'meringis'], [T9.ke + .1, 'curiga', { look: [.8, 0] }]], 17), rx: RX - 40, extra: c2 => drawWangi(c2, 560, 1000, 380, t, .7) }), 8);
  scr(ctx, c => {
    const f = EC(t, [[ls(9), 'licik', { look: [-.6, 0] }], [T9.ka, 'sombong', { look: [-.6, 0] }], [T9.ke + .05, 'bangga']], 18);
    const pinch = inv(T9.nu - .1, T9.hi, t), zy = 2200 - 50 * ease(inv(ls(9), ls(10), t));
    drawStick(c, C(BUDI, { x: 620, y: zy, s: 1800, shadow: false, flip: -1, armLen: 1.3, arms: { L: [.2, -.1], R: pinch > 0 ? { ik: [lerp(.3, .16, pinch), lerp(-.45, -.66, pinch)], bend: -1 } : [.2, -.1] }, face: f, headTilt: .05 + Math.sin(t * 6) * .02 }));
    if (pinch > .6) pinchHand(c, 620, zy, 1800, -1);
  });
  drawLup(ctx, 240, 560, 170, inv(T9.ta - .15, T9.ta + .2, t), c => {
    c.fillStyle = '#9ed8ff'; c.fillRect(-300, -300, 600, 600); c.fillStyle = '#5aa6e0'; c.fillRect(-300, 30 + Math.sin(t * 3) * 8, 600, 300);
    for (let i = 0; i < 6; i++) { const x = -150 + i * 60, y = 30 + Math.sin(t * 3 + i) * 10; line(c, x, y, x, y - 70, 6, '#3f9b4a'); drawBunga(c, x, y - 80, 26, t + i); }
    for (let i = 0; i < 8; i++) { const q = (t * 1.5 + i / 8) % 1; line(c, -180 + i * 50, -260 + q * 300, -186 + i * 50, -230 + q * 300, 5, '#ffffff'); }
  });
  scrTag(ctx, 'KEBANJIRAN', inv(T9.ke, T9.ke + .15, t), '#9ed8ff', 330, 100);
});

// ===== 10 Ibu pulang, nyium kemeja sekali, geleng-geleng =====
const T10 = { la: wt(10, 'lalu'), ib: wt(10, 'ibu'), pu: wt(10, 'pulang'), ny: wt(10, 'nyium'), ke: wt(10, 'kemejanya'), se: wt(10, 'sekali'), da: wt(10, 'dan'), ge: wt(10, 'gelenggeleng') };
const IX = -40;
SH(ls(10), ls(11), { tr: 'whip' }, (ctx, lt, t) => {
  const IX0 = JL.door, wk = easeInOut(inv(T10.ib - .2, T10.ny - .1, t)), ix = lerp(IX0, IX, wk), walking = wk > 0 && wk < 1, wc = walkCycle(ix - IX0, 600, 1);
  const give = easeOut(inv(T10.ny - .3, T10.ny + .1, t)), h = holdShirt(RX, -1, 0, -.35 * give);
  const shake = t > T10.ge ? Math.sin((t - T10.ge) * 18) * .14 * (1 - inv(T10.ge + .8, T10.ge + 1.2, t)) : 0;
  const cam = CK(t, [[ls(10), { x: -560, y: 1060, z: 1.3 }], [T10.pu, { x: -440, y: 1060, z: 1.35 }, easeOut], [T10.ny, { x: 80, y: 1080, z: 1.5 }, ease], [T10.ge, { x: 110, y: 1090, z: 1.7 }, ease], [ls(11), { x: 110, y: 1090, z: 1.75 }, easeIn]], 2);
  rumah(ctx, t, cam, { door: inv(ls(10), T10.ib, t) * (1 - inv(T10.ny, T10.ke, t)),
    fI: EM(t, [[ls(10), 'netral', { look: [.8, 0] }], [T10.ny, 'curiga', { look: [.8, .2] }], [T10.se + .2, 'datar', { look: [0, 0] }]], 19), ix,
    armsI: walking ? wc.arms : { L: [.25, -.3], R: [.25, -.3] }, ibuExtra: walking ? { legs: wc.legs, bob: wc.bob, footDir: 1, lean: wc.lean } : { lean: .08 * inv(T10.ny, T10.ke, t) * (1 - inv(T10.se + .2, T10.da, t)), headTilt: shake },
    fR: EF(t, [[ls(10), { eyes: 'half', mouth: 'wobble', look: [-.8, 0] }], [T10.ge + .1, 'cemas', { look: [-.8, 0] }]], 20), flipR: -1, armsR: h.arms,
    extra: c => drawKemeja(c, h.hook[0], h.hook[1], SHS, { t, stink: .9 })
  });
  sfxText(ctx, 'NGIK', 360, 760, 56, inv(T10.ib - .1, T10.ib, t) * (1 - inv(T10.pu, T10.pu + .2, t)), '#fff', -.08);
  sfxText(ctx, 'SNIFF', 640, 700, 60, inv(T10.ny, T10.ny + .08, t) * (1 - inv(T10.se, T10.se + .2, t)), '#fff', .1);
});

// ===== 11a "Pelakunya bukan sabun, Ran." -> portal ke serat kemeja =====
const T11 = { pe: wt(11, 'pelakunya'), bu: wt(11, 'bukan'), sa: wt(11, 'sabun'), ra: wt(11, 'ran'), ta: wt(11, 'tapi'), ba: wt(11, 'bakteri'), ng: wt(11, 'nggak'), ma: wt(11, 'mati'), wa: wt(11, 'waktu'), di: wt(11, 'dicuci') };
const cam11 = t => CK(t, [[ls(11), { x: 110, y: 1090, z: 1.6 }], [T11.sa, { x: 100, y: 1100, z: 1.7 }, easeOut], [T11.ta, { x: 175, y: 1120, z: 2.6 }, easeIn]], 1.5);
const H11 = holdShirt(RX, -1, 0, -.35), SC11 = [H11.hook[0], H11.hook[1] + 150];
SH(ls(11), T11.ta, { tr: 'portal', zoomOut: (() => { const p = toScreen(cam11(T11.ta), SC11[0], SC11[1]); return { x: p[0], y: p[1], w: 300, h: 533 }; })() }, (ctx, lt, t) => {
  const cam = cam11(t);
  rumah(ctx, t, cam, {
    fI: EM(t, [[ls(11), 'datar', { look: [.8, 0] }], [T11.bu, 'sombong', { look: [.8, 0] }]], 21), ix: IX,
    armsI: { L: [.25, -.3], R: [2.3 + Math.sin(t * 9) * .2, .6] },
    fR: EF(t, [[ls(11), 'cemas', { look: [-.8, 0] }]], 22), flipR: -1, armsR: H11.arms,
    extra2: 1,
    under: c => { drawDeterjen(c, 40, FT + 40, .55, { premium: 1, t }); drawPewangi(c, 150, FT + 40, .5, { t }); const k = inv(T11.sa, T11.sa + .12, t); if (k > 0) { c.save(); c.translate(95, 1500); c.scale(backOut(k), backOut(k)); drawX(c, 0, 0, 80); c.restore(); } },
    extra: c => drawKemeja(c, H11.hook[0], H11.hook[1], SHS, { t, stink: .6 })
  });
  scrTag(ctx, 'BUKAN SABUN', inv(T11.bu, T11.bu + .15, t), '#fff');
});
// ===== 11b dunia mikro: bakteri yang nggak mati waktu dicuci =====
const BK = [[360, 690, 72], [720, 690, 64], [360, 1030, 64], [720, 1030, 72]];
const mcOf = (t, t0, t1, z0 = 1.12, z1 = 1.0) => ({ z: lerp(z0, z1, easeOut(inv(t0, t1, t))), x: 0, y: 0 });
SH(T11.ta, ls(12), { tr: 'none' }, (ctx, lt, t) => {
  const mc = mcOf(t, T11.ta, ls(12), 1.25, 1.02), wash = inv(T11.ng - .1, T11.di + .5, t);
  seratBG(ctx, t, { mc, wet: .5 + .5 * wash });
  ctx.save(); mcam(ctx, mc);
  // arus cucian: gelembung sabun + garis air menyapu dari kiri
  if (wash > 0 && wash < 1) for (let i = 0; i < 12; i++) { const x = -200 + ((wash * 1.6 + i / 12) % 1) * 1500, y = 450 + (i * 137) % 1050; circle(ctx, x, y, 22 + (i % 3) * 12); fillStroke(ctx, 'rgba(255,255,255,.75)', 4); drawWind(ctx, x - 300, y + 40, 0, 320, .6, t, '#d6f0ff', 10); }
  BK.forEach(([x, y, r], i) => { const k = inv(T11.ba - .05 + i * .1, T11.ba + .2 + i * .1, t); if (k <= 0) return; const hold = wash > 0 && wash < 1;
    drawBakteri(ctx, x + (hold ? Math.sin(t * 30 + i) * 4 : 0), y, r * backOut(k), { t, rot: hold ? -.25 : 0, face: EF(t, [[T11.ba, 'licik', { look: [-.4, 0] }], [T11.ma, { eyes: 'normal', mouth: 'teeth', browAng: -.3 }]], 23 + i) }); });
  ctx.restore();
  scr(ctx, c => { popText(c, 'BAKTERI', 540, 230, 100, inv(T11.ba, T11.ba + .15, t) * (1 - inv(T11.ng - .1, T11.ng, t)), '#c9a8ff', INK, .05); popText(c, 'NGGAK MATI', 540, 230, 96, inv(T11.ng, T11.ng + .15, t), '#fff', INK, .05); });
});

// ===== 12 ngumpet di serat kain; kalau cepat kering, diam aja =====
const T12 = { di: wt(12, 'dia'), ng: wt(12, 'ngumpet'), se: wt(12, 'serat'), ka: wt(12, 'kalau'), cp: wt(12, 'cepat'), ke: wt(12, 'kering'), d2: wt(12, 'dia', 0, 1), dm: wt(12, 'diam') };
SH(ls(12), ls(13), { tr: 'dissolve' }, (ctx, lt, t) => {
  const mc = { z: lerp(1.02, 1.14, easeInOut(inv(ls(12), ls(13), t))), x: 0, y: 30 * inv(ls(12), ls(13), t) };
  const dry = inv(T12.cp - .1, T12.ke + .4, t), hide = easeInOut(inv(T12.ng - .1, T12.se + .2, t));
  seratBG(ctx, t, { mc, wet: 1 - dry, dry: dry > 0 && dry < 1 ? 1 : 0 });
  ctx.save(); mcam(ctx, mc);
  BK.forEach(([x, y, r], i) => drawBakteri(ctx, x + (i % 2 ? 1 : -1) * 40 * hide, y + 20 * hide, r * (1 - .25 * hide), { t, sleep: inv(T12.dm - .1, T12.dm + .3, t),
    face: EF(t, [[ls(12), 'licik', { look: [-.4, 0] }], [T12.ng, 'curiga', { look: [i % 2 ? .8 : -.8, 0] }], [T12.dm, { eyes: 'half', mouth: 'flat'}]], 27 + i) }));
  // serat menutupi sebagian bakteri (ngumpet)
  ctx.restore();
  scr(ctx, c => { popText(c, 'NGUMPET', 540, 230, 100, inv(T12.ng, T12.ng + .15, t) * (1 - inv(T12.ka - .1, T12.ka, t)), '#fff', INK, .05);
    popText(c, 'CEPAT KERING', 540, 230, 90, inv(T12.cp, T12.cp + .15, t) * (1 - inv(T12.dm - .1, T12.dm, t)), '#ffd23a', INK, .05);
    popText(c, 'DIAM...', 540, 230, 100, inv(T12.dm, T12.dm + .15, t), '#c9a8ff', INK, .05); });
});

// ===== 13 basah kelamaan > 5 jam: pesta; kotorannya = bau kain pel =====
const T13 = { ta: wt(13, 'tapi'), ka: wt(13, 'kalau'), ba: wt(13, 'basahnya'), ke: wt(13, 'kelamaan'), le: wt(13, 'lebih'), li: wt(13, '5'), ja: wt(13, 'jam'), pe: wt(13, 'pesta'), ko: wt(13, 'kotorannya'), it: wt(13, 'itulah'), bu: wt(13, 'bau'), kn: wt(13, 'kain') };
const BK2 = [[200, 420, 46], [930, 560, 44], [540, 560, 44], [180, 860, 42], [900, 880, 46], [540, 1110, 40]];
const GAS = [[300, 520], [800, 500], [540, 860], [260, 1090], [840, 1120]];
SH(ls(13), ls(14), { tr: 'dissolve' }, (ctx, lt, t) => {
  const mc = { z: lerp(1.14, 1.0, easeInOut(inv(ls(13), T13.pe, t))) + .06 * inv(T13.ko, ls(14), t), x: 0, y: lerp(30, 0, inv(ls(13), T13.pe, t)) };
  const wet = inv(T13.ba - .1, T13.ke + .3, t), party = inv(T13.pe - .05, T13.pe + .3, t), gas = inv(T13.ko - .1, T13.bu, t);
  seratBG(ctx, t, { mc, wet });
  ctx.save(); mcam(ctx, mc);
  const all = party > 0 ? BK.concat(BK2) : BK;
  all.forEach(([x, y, r], i) => { const born = i < 4 ? 1 : backOut(inv(T13.pe - .05 + (i - 4) * .07, T13.pe + .2 + (i - 4) * .07, t)); if (born <= 0) return;
    const hop = party > 0 ? Math.abs(Math.sin(t * 9 + i)) * -18 : 0;
    drawBakteri(ctx, x, y + hop, r * born, { t, party, split: i < 4 ? inv(T13.pe - .3, T13.pe, t) * (1 - party) : 0, sleep: 1 - inv(T13.ba - .1, T13.ba + .2, t),
      face: EF(t, [[ls(13), { eyes: 'half', mouth: 'flat'}], [T13.ba, 'curiga', { look: [0, .5] }], [T13.pe, 'bangga']], 31 + i) }); });
  if (party > 0) { const q = rng(77); for (let i = 0; i < 40; i++) { const x = q() * W, y = ((q() * H + t * 260 * (.5 + q())) % (H + 100)) - 50; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 4 + i); ctx.fillStyle = ['#ffd23a', '#ff5a8a', '#5ad1ff', '#8dff6a'][i % 4]; ctx.globalAlpha = party; ctx.fillRect(-9, -5, 18, 10); ctx.restore(); } }
  GAS.forEach(([x, y], i) => { const k = inv(T13.ko - .1 + i * .08, T13.ko + .3 + i * .08, t); if (k > 0) drawGasBau(ctx, x, y - 40 * k + Math.sin(t * 2 + i) * 10, 95 * backOut(k), { t, a: k, face: i === 2 ? EF(t, [[T13.ko, 'licik']], 41) : null }); });
  ctx.restore();
  drawLup(ctx, 820, 470, 140, inv(T13.le - .1, T13.le + .2, t) * (1 - inv(T13.pe + .2, T13.pe + .5, t)), c => { c.fillStyle = '#fffaf0'; c.fillRect(-200, -200, 400, 400); drawWallClock(c, 0, 0, 115, 8 + 5 * inv(T13.le, T13.ja + .2, t), inv(T13.le, T13.ja, t) < 1 ? 1 : 0); });
  scr(ctx, c => { popText(c, 'BASAH KELAMAAN', 470, 230, 76, inv(T13.ba, T13.ba + .15, t) * (1 - inv(T13.le - .1, T13.le, t)), '#9ed8ff', INK, .05);
    popText(c, '> 5 JAM', 420, 230, 100, inv(T13.li, T13.li + .15, t) * (1 - inv(T13.pe - .1, T13.pe, t)), '#fff', INK, .05);
    popText(c, 'PESTA!', 540, 230, 120, inv(T13.pe, T13.pe + .15, t) * (1 - inv(T13.ko - .1, T13.ko, t)), '#ffd23a', INK, .05);
    popText(c, 'BAU KAIN PEL', 540, 230, 96, inv(T13.bu, T13.bu + .15, t), '#b6e35a', INK, .05); });
});

// ===== 14 pewangi cuma nutupin; bakteri nunggu lembap lagi =====
const T14 = { pe: wt(14, 'pewangi'), cu: wt(14, 'cuma'), nu: wt(14, 'nutupin'), ba: wt(14, 'bakterinya'), ma: wt(14, 'masih'), si: wt(14, 'situ'), ng: wt(14, 'nunggu'), bj: wt(14, 'bajunya'), le: wt(14, 'lembap'), la: wt(14, 'lagi') };
SH(ls(14), ls(15), { tr: 'match', zoomOut: { x: 540, y: 860, r: 220 } }, (ctx, lt, t) => {
  const mc = { z: lerp(1.08, 1.0, easeOut(inv(ls(14), T14.ba, t))) + .1 * inv(T14.ng, ls(15), t), x: 0, y: 0 };
  const cover = inv(T14.pe - .1, T14.nu + .2, t), drop = inv(T14.bj - .1, T14.le + .1, t), wake = inv(T14.le, T14.le + .2, t);
  seratBG(ctx, t, { mc, wet: .25 + .5 * wake });
  ctx.save(); mcam(ctx, mc);
  BK.concat(BK2.slice(0, 3)).forEach(([x, y, r], i) => drawBakteri(ctx, x, y, r, { t, face: EF(t, [[ls(14), 'datar', { look: [0, -.5] }], [T14.ba, 'sombong', { look: [.6, 0] }], [T14.le + .05, 'licik']], 42 + i) }));
  GAS.forEach(([x, y], i) => drawGasBau(ctx, x, y - 40, 95 * (1 - .5 * cover + .4 * wake), { t, a: 1 - .75 * cover + .75 * wake }));
  drawWangi(ctx, 540, 820, 560, t, cover * (1 - .3 * wake), 40, 1.6);
  if (drop > 0 && drop < 1) drawTetes(ctx, 540, lerp(120, 840, easeIn(drop)), 46, 1);
  ctx.restore();
  if (wake > 0) sfxText(ctx, 'PLUK', 640, 760, 70, wake * (1 - inv(T14.la + .3, T14.la + .5, t)), '#9ed8ff', .1);
  scr(ctx, c => { popText(c, 'CUMA NUTUPIN', 540, 230, 90, inv(T14.cu, T14.cu + .15, t) * (1 - inv(T14.ba - .1, T14.ba, t)), '#ff8fc2', INK, .05);
    popText(c, 'MASIH DI SITU', 540, 230, 90, inv(T14.ma, T14.ma + .15, t) * (1 - inv(T14.ng - .1, T14.ng, t)), '#c9a8ff', INK, .05);
    popText(c, 'NUNGGU LEMBAP', 540, 230, 86, inv(T14.ng, T14.ng + .15, t), '#9ed8ff', INK, .05); });
});

// ===== 15a Ibu rendam kemeja di air panas =====
const T15 = { ib: wt(15, 'ibu'), re: wt(15, 'rendam'), ke: wt(15, 'kemejanya'), ai: wt(15, 'air'), pa: wt(15, 'panas'), te: wt(15, 'terus'), dj: wt(15, 'dijemur'), pk: wt(15, 'pakai'), ja: wt(15, 'jarak'), de: wt(15, 'dengan'), ki: wt(15, 'kipas'), an: wt(15, 'angin'), dp: wt(15, 'depannya') };
const IW = -330;
SH(ls(15), T15.te, { tr: 'whip', zoomIn: { x: 448, y: 1259, r: 300 } }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(15), { x: -110, y: 1230, z: 2.3 }], [ls(15) + .5, { x: -130, y: 1200, z: 1.8 }, easeOut], [T15.pa, { x: -150, y: 1170, z: 1.6 }, ease], [T15.te, { x: -140, y: 1160, z: 1.55 }, easeIn]], 2);
  const stir = Math.sin(t * 6) * 30, hot = inv(ls(15), T15.pa, t) * .7 + .3;
  rumah(ctx, t, cam, {
    fI: EM(t, [[ls(15), 'sombong', { look: [.7, .7] }], [T15.pa, 'bangga', { look: [.7, .6] }]], 50), ix: IW,
    armsI: { L: armTo(IW, 1, EB - 30 + stir, 1240, -1), R: armTo(IW, 1, EB + 10 + stir, 1200, -1) },
    extra: c => { drawEmber(c, EB, FT, 1, { t, water: 1, shirt: 1, hot }); c.save(); c.lineCap = 'round'; line(c, EB + 10 + stir, 1190, EB - 30 + stir * .5, 1350, 16, INK); line(c, EB + 10 + stir, 1190, EB - 30 + stir * .5, 1350, 8, JMP.stick); c.restore(); }
  });
  drawLup(ctx, 790, 560, 190, inv(T15.ai - .1, T15.pa + .1, t), c => {
    c.fillStyle = '#7a2a1a'; c.fillRect(-300, -300, 600, 600);
    for (let i = 0; i < 8; i++) { const q = (t * .9 + i / 8) % 1; circle(c, -150 + i * 42, 160 - q * 330, 10 + (i % 3) * 5); c.lineWidth = 4; c.strokeStyle = `rgba(255,255,255,${.7 * (1 - q)})`; c.stroke(); }
    [[-70, -30, 52], [70, 40, 48], [0, 110, 40]].forEach(([x, y, r], i) => drawBakteri(c, x, y, r, { t, dead: t > T15.pa, face: EF(t, [[T15.ai - .1, 'kaget']], 51 + i) }));
  });
  scrTag(ctx, 'AIR PANAS', inv(T15.pa, T15.pa + .15, t), '#ff8a2a', 330, 110);
  sfxText(ctx, 'CESS', 300, 820, 64, inv(T15.re, T15.re + .08, t), '#fff', -.1);
});
// ===== 15b dijemur pakai jarak + kipas angin =====
const IR = 200;
SH(T15.te, ls(16), { tr: 'whip' }, (ctx, lt, t) => {
  const sp = easeInOut(inv(T15.pk - .1, T15.ja + .3, t)), fan = inv(T15.ki - .1, T15.ki + .2, t), on = t > T15.ki ? 1 : 0;
  const cam = CK(t, [[T15.te, { x: 520, y: 1060, z: 1.45 }], [T15.ja, { x: 560, y: 1020, z: 1.32 }, easeOut], [T15.ki, { x: 720, y: 1100, z: 1.28 }, ease], [ls(16), { x: 700, y: 1060, z: 1.38 }, easeIn]], 2);
  rumah(ctx, t, cam, {
    rack: { shirt: true, spread: sp, wet: 1, wind: on, face: EF(t, [[T15.te, 'cemas', { look: [.6, 0] }], [T15.ki + .1, 'lega']], 54) },
    fI: EM(t, [[T15.te, 'netral', { look: [.8, -.4] }], [T15.ja, 'sombong', { look: [.8, -.4] }], [T15.ki, 'bangga', { look: [.8, 0] }]], 55), ix: IR,
    armsI: { L: [.25, -.3], R: [lerp(1.4, 2.2, sp) + Math.sin(t * 5) * .1, .2] },
    extra: c => { if (fan > 0) { c.save(); c.translate(1020, FT); c.scale(backOut(fan), backOut(fan)); drawFan(c, 0, 0, .78, t, on); c.restore(); }
      if (on) for (let i = 0; i < 4; i++) drawWind(c, 860, 960 + i * 90, Math.PI + .05, 520, (t * 1.1 + i * .27) % 1.25, t, '#ffffff', 12); }
  });
  scrTag(ctx, 'PAKAI JARAK', inv(T15.ja, T15.ja + .15, t) * (1 - inv(T15.de - .1, T15.de, t)), '#fff');
  scrTag(ctx, 'KIPAS ANGIN', inv(T15.ki, T15.ki + .15, t), '#9ed8ff');
  sfxText(ctx, 'WUSSS', 380, 900, 60, inv(T15.an, T15.an + .08, t), '#fff', -.1);
});

// ===== 16a 3 jam, kering =====
const T16 = { ti: wt(16, '3'), ja: wt(16, 'jam'), ke: wt(16, 'kering'), ra: wt(16, 'rani'), ny: wt(16, 'nyium'), la: wt(16, 'lagi'), ng: wt(16, 'nggak'), ba: wt(16, 'bau'), ap: wt(16, 'apaapa') };
SH(ls(16), T16.ra, { tr: 'whip' }, (ctx, lt, t) => {
  const hr = inv(ls(16), T16.ke - .1, t), dry = inv(T16.ke - .2, T16.ke + .2, t);
  const cam = CK(t, [[ls(16), { x: 240, y: 620, z: 1.9 }], [T16.ja, { x: 250, y: 640, z: 1.75 }, easeOut], [T16.ke, { x: 600, y: 980, z: 1.55 }, ease], [T16.ra, { x: 610, y: 990, z: 1.7 }, easeIn]], 2);
  rumah(ctx, t, cam, { jam: 9 + 3 * hr, fast: hr < 1 ? 1 : 0,
    rack: { shirt: true, spread: 1, wet: 1 - dry, fresh: dry, face: EF(t, [[ls(16), 'cemas'], [T16.ke, 'bangga']], 56) },
    extra: c => { drawFan(c, 1020, FT, .78, t, 1); }
  });
  timeGrade(ctx, .3 * hr * (1 - dry), 'malam');
  scrTag(ctx, '3 JAM', inv(T16.ti, T16.ti + .15, t) * (1 - inv(T16.ke - .1, T16.ke, t)), '#fff', 330, 120);
  scrTag(ctx, 'KERING!', inv(T16.ke, T16.ke + .15, t), '#ffd23a', 330, 120);
});
// ===== 16b Rani nyium lagi: nggak bau apa-apa =====
SH(T16.ra, ls(17), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[T16.ra, { x: 390, y: 1090, z: 2.15 }], [T16.ng, { x: 400, y: 1080, z: 2.25 }, ease], [ls(17), { x: 420, y: 1070, z: 2.0 }, easeIn]], 2);
  sniffScene(ctx, t, cam, t, { tr: T16.ng, bad: 0, rack: { spread: 1 }, face: EM(t, [[T16.ra, { eyes: 'half', mouth: 'o', look: [.7, .3] }], [T16.ng, 'lega'], [T16.ap + .1, 'bangga']], 57) });
  scrTag(ctx, 'NGGAK BAU!', inv(T16.ng, T16.ng + .15, t), '#fff', 330, 110);
});

// ===== 17 besoknya wawancara lancar; Budi masih ingat malam itu -> whip ke frame 0 (loop) =====
const T17 = { be: wt(17, 'besoknya'), wa: wt(17, 'wawancaranya'), la: wt(17, 'lancar'), ta: wt(17, 'tapi'), sa: wt(17, 'sampai'), bu: wt(17, 'budi'), ma: wt(17, 'masih'), in: wt(17, 'ingat'), ml: wt(17, 'malam'), wk: wt(17, 'waktu') };
const BE = 860;
SH(ls(17), ENDT, { tr: 'none' }, (ctx, lt, t) => {
  const PB = T17.ml, back = inv(PB, ENDT, t), e = easeInOut(back);
  const c0 = cam0(0), a = { x: 760, y: 1060, z: 1.6 };
  const cam = back <= 0 ? CK(t, [[ls(17), { x: 380, y: 1080, z: 1.45 }], [T17.la, { x: 420, y: 1040, z: 1.55 }, easeOut], [T17.bu, { x: 760, y: 1070, z: 1.5 }, ease], [PB, a, ease]], 2)
    : { x: lerp(a.x, c0.x, e), y: lerp(a.y, c0.y, e), z: lerp(a.z, c0.z, e) - .3 * Math.sin(e * Math.PI), r: 0 };
  if (back > .5) { hookScene(ctx, t, cam, t - ENDT); return; }   // di tengah whip-pan, adegan kembali ke frame 0
  const shiver = t > T17.in ? Math.sin(t * 40) * 6 : 0;
  rumah(ctx, t, cam, { rack: { spread: 1 },
    fR: EM(t, [[ls(17), 'bangga', { look: [.4, -.2] }], [T17.la, 'lega', { look: [.4, 0] }]], 58), raniP: RANI_K, rx: RX - 20,
    armsR: { L: [.25, -.3], R: [lerp(.4, 2.6, inv(T17.la - .2, T17.la + .1, t)), .3] },
    fB: EM(t, [[ls(17), 'netral', { look: [-.8, 0] }], [T17.bu, 'cemas', { look: [-.8, .2] }], [T17.in, { eyes: 'spiral', mouth: 'wobble', sweat: 1 }]], 59), bx: BE + shiver, flipB: -1,
    armsB: t > T17.bu ? { L: [.3, -.4], R: { ik: [.16, -.66], bend: -1 } } : { L: [.25, -.3], R: [.25, -.3] },
    extra: c => { drawFan(c, 1120, FT, .7, t, 0); if (t > T17.bu) pinchHand(c, BE + shiver, FT, 600, -1); }
  });
  ctx.save(); applyCam(ctx, cam, 1); glint(ctx, RX - 20, 1000, 160, t, T17.la); ctx.restore();
  scrTag(ctx, 'BESOKNYA', inv(ls(17), ls(17) + .15, t) * (1 - inv(T17.la - .1, T17.la, t)), '#fff', 330, 92);
  scrTag(ctx, 'LANCAR!', inv(T17.la, T17.la + .15, t) * (1 - inv(T17.ta - .1, T17.ta, t)), '#ffd23a', 330, 120);
  if (t > T17.in) { ctx.save(); applyCam(ctx, cam, 1); stink(ctx, BE - 40, 1000, .8, t, inv(T17.in, T17.in + .3, t)); ctx.restore(); }
});
