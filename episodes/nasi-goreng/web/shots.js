// ---------- Fakta Unik: "Nasi goreng calon mertua" (~68 dtk, tanpa CTA) ----------
// Pola naskah ref-02 (bentuk taruhan: tamu datang mendadak, bukan lomba): krisis di frame 0 (bubur, jam), flashback pesan Ibu,
// gagal palsu dua lapis (nasi kulkas tampak buruk, nasi baru tampak bagus), penanda waktu, mekanisme singkat lewat dialog Ibu, loop ke frame 0.
// Aturan v5/v6/v7: kamera selalu bergerak, semua waktu dari kata (wt), satu fungsi per aset (env_nasi.js), tata letak NG terkunci.
const SHOTS = [];
const easeInOut = x => x * x * (3 - 2 * x);
const IBU = { cols: ['#ec5b86', '#ec5b86'], hat: 'chef', belt: false, blush: true };
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
const BK = NG.back, TOP = NG.top, RX = NG.rani, WK = NG.wok, ST = NG.stove, FX = NG.fridge, CKR = NG.cooker;
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, BK, 600, flip, wx, wy, bend);
function tokoh(ctx, t, P, x, face, arms, flip = 1, extra = {}) { drawStick(ctx, C(P, Object.assign({ x, y: BK, s: 600, flip, armLen: 1.3, legs: standL, arms: arms || idleArms(t, x * .01), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
const jamAt = m => 12 - m / 60;                 // calon mertua datang jam 12.00
const scrTag = (ctx, str, k, col = '#ffd23a', y = 330, size = 104) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, str, 540, y, size, k, col, INK, -.05); ctx.restore(); };
// genggaman sutil: aduk (x maju-mundur) di atas wajan
const stirG = (t, sp = 7, amp = 50) => [RX + 230 + Math.sin(t * sp) * amp, 1015 + Math.abs(Math.cos(t * sp)) * 22];
const SUT = .85;

// ===== adegan dapur bersama =====
// o: { fR, armsR, rx, flipR, fB, armsB, bx, fI, armsI, ix, ibuExtra, rExtra, wok:{...state} | null, wokFace, wok1:{state}, fire, cooker:{lid,steam,face}, fridge:{door,face}, jam, fast, sutil:[g,rot], extra(ctx), front(ctx), mertua:{n,fB,fI} }
function kitchen(ctx, t, cam, o) {
  dapurBack(ctx, t, cam, { jam: o.jam == null ? jamAt(40) : o.jam, fast: o.fast || 0 });
  if (o.mertua) { tokoh(ctx, t, BAPAK_M, NG.mertua[0], o.mertua.fB, o.mertua.armsB, -1); tokoh(ctx, t, IBU_M, NG.mertua[1], o.mertua.fI, o.mertua.armsI, -1); }
  if (o.fI) tokoh(ctx, t, IBU, o.ix == null ? NG.ibuIn : o.ix, o.fI, o.armsI, o.flipI || 1, o.ibuExtra || {});
  if (o.fB) tokoh(ctx, t, BUDI, o.bx == null ? NG.budi : o.bx, o.fB, o.armsB, -1, o.budiExtra || {});
  if (o.fR) tokoh(ctx, t, RANI, o.rx == null ? RX : o.rx, o.fR, o.armsR, o.flipR || 1, o.rExtra || {});
  dapurMeja(ctx);
  drawStove(ctx, ST[0], ST[1], .9, { fire: o.fire == null ? 1 : o.fire, t });
  if (o.cooker !== false) drawRiceCooker(ctx, CKR[0], CKR[1], .55, Object.assign({ t, warm: 1 }, o.cooker || {}));
  if (o.under) o.under(ctx);
  if (o.wok1) drawWok(ctx, NG.wok1[0], NG.wok1[1] - 60, .6, { t, heat: 0 }, c => drawNasiWok(c, Object.assign({ t }, o.wok1)));
  if (o.wok !== null) drawWok(ctx, WK[0], WK[1], .8, { t, heat: o.heat == null ? .8 : o.heat }, c => drawNasiWok(c, Object.assign({ t }, o.wok || {})));
  if (o.sutil) drawSutil(ctx, o.sutil[0][0], o.sutil[0][1], SUT, o.sutil[1]);
  if (o.fridge) drawFridge(ctx, FX, 1560, .95, Object.assign({ t, mood: 'happy' }, o.fridge));
  if (o.extra) o.extra(ctx);
}
const armsStir = (t, sp, amp, rx = RX) => { const g = stirG(t, sp, amp); g[0] += rx - RX; return { g, arms: { L: armTo(rx, 1, rx + 150, 1150, -1), R: armTo(rx, 1, g[0], g[1], -1) } }; };
const panicSmoke = (ctx, t, k, x = WK[0], y = WK[1] - 40) => { if (k <= 0) return; for (let i = 0; i < 5; i++) { const q = (t * .8 + i / 5) % 1; puff(ctx, x - 120 + i * 60 + Math.sin(t * 3 + i) * 20, y - q * 300, 30 + q * 50, t, '#6a6a72', i + 2, (1 - q) * .7 * k); } };

// ===== 0 HOOK: 40 menit lagi, nasi gorengnya jadi bubur =====
const H0 = { em: wt(0, '40'), la: wt(0, 'lagi'), na: wt(0, 'nasi'), ma: wt(0, 'malah'), bu: wt(0, 'bubur') };
const cam0 = t => CK(t, [[0, { x: 440, y: 1050, z: 1.5 }], [H0.em, { x: 540, y: 980, z: 1.38 }, easeOut], [H0.na, { x: 560, y: 1020, z: 1.45 }, ease], [H0.bu, { x: 620, y: 1090, z: 1.85 }, ease], [ls(1), { x: 630, y: 1100, z: 1.95 }, easeIn]], 2.5);
function hookScene(ctx, t, cam, tl) {           // tl = waktu lokal hook (0 di frame pertama); dipakai juga untuk loop di akhir
  const a = armsStir(tl, 16, 60);
  kitchen(ctx, t, cam, {
    jam: jamAt(40), fR: EM(tl, [[-9, 'cemas', { sweat: 1, look: [.7, .6] }], [H0.bu, 'kaget', { sweat: 1 }]], 1), armsR: a.arms, rExtra: { bob: Math.abs(Math.sin(tl * 16)) * -.012 },
    wok: { mush: 1, burn: .15 }, heat: 1, sutil: [a.g, .55 + Math.sin(tl * 16) * .1],
    extra: c => { if (Math.sin(tl * 9) > .6) sfxText(c, 'BLUP', WK[0] + 120, WK[1] - 150, 52, 1, '#fff', .12); }
  });
}
SH(0, ls(1), { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  // wajah gumpalan bubur (benda korban)
  ctx.save(); applyCam(ctx, cam, 1); propFace(ctx, WK[0], WK[1] - 52, 96, EF(t, [[0, 'datar'], [H0.bu, 'meringis']], 2), { t }); ctx.restore();
  scrTag(ctx, '40 MENIT', inv(H0.em, H0.em + .2, t) * (1 - inv(H0.na, H0.na + .2, t)), '#ffd23a');
  scrTag(ctx, 'BUBUR?!', inv(H0.bu, H0.bu + .2, t), '#fff', 360, 120);
});

// ===== 1 flashback pagi: Ibu pesan "Pakai nasi yang di kulkas!" =====
const T1 = { pa: wt(1, 'padahal'), pg: wt(1, 'pagi'), ps: wt(1, 'pesan'), sa: wt(1, 'satu'), pas: wt(1, 'pasar'), pk: wt(1, 'pakai'), ku: wt(1, 'kulkas'), ya: wt(1, 'ya') };
SH(ls(1), ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(1), { x: 120, y: 1000, z: 1.12 }], [ls(1) + .7, { x: 100, y: 990, z: 1.2 }, easeOut], [T1.pk, { x: -60, y: 1010, z: 1.3 }, ease], [T1.ku, { x: -260, y: 1030, z: 1.45 }, ease], [ls(2), { x: -270, y: 1030, z: 1.5 }]], 2);
  const point = t > T1.pk - .1;
  kitchen(ctx, t, cam, {
    jam: 7, wok: { }, heat: 0, fire: 0,
    fI: EM(t, [[ls(1), 'netral', { look: [.8, 0] }], [T1.pk, 'sombong', { look: [-.6, .1] }], [T1.ya + .05, 'lega', { look: [.8, 0] }]], 3),
    armsI: point ? { L: armTo(NG.ibuIn, 1, FX + 80, 1060, 1), R: armTo(NG.ibuIn, 1, NG.ibuIn + 110, 1220, -1) } : { L: idleArms(t, 1).L, R: armTo(NG.ibuIn, 1, NG.ibuIn + 110, 1220, -1) },
    fR: EF(t, [[ls(1), 'netral', { look: [-.8, 0] }], [T1.ku + .1, 'datar', { look: [-.8, .2] }]], 4),
    fridge: { door: 0, look: -.6, mood: t > T1.ku ? 'joy' : 'happy' },
    extra: c => { // keranjang belanja Ibu
      const bx = NG.ibuIn + 120, by = 1230; c.beginPath(); c.arc(bx, by - 40, 50, Math.PI, 0); c.lineWidth = 8; c.strokeStyle = '#8a5a34'; c.stroke(); rrect(c, bx - 64, by - 40, 128, 80, 14); fillStroke(c, '#d9a35a', 6);
      const k = inv(T1.ku - .1, T1.ku + .15, t); if (k > 0) glint(c, FX, 980, 120, t, T1.ku);
    }
  });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); timeGrade(ctx, .35, 'senja'); ctx.restore();
  scrTag(ctx, 'TADI PAGI', inv(ls(1), ls(1) + .2, t) * (1 - inv(T1.pk - .2, T1.pk, t)), '#fff', 300, 92);
  scrTag(ctx, 'NASI DI KULKAS!', inv(T1.ku - .1, T1.ku + .15, t), '#ffd23a', 330, 86);
});

// ===== 2 buka kulkas: nasinya dingin, keras, kering, kayak kerikil =====
const T2 = { bk: wt(2, 'buka'), di: wt(2, 'dingin'), ke: wt(2, 'keras'), kr: wt(2, 'kering'), ki: wt(2, 'kerikil') };
const RXF = FX + 300;                             // Rani berdiri di samping kulkas
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(2), { x: -260, y: 1060, z: 1.45 }], [T2.bk + .3, { x: -250, y: 1100, z: 1.6 }, easeOut], [T2.di, { x: -170, y: 1110, z: 1.85 }, ease], [T2.ki, { x: -150, y: 1100, z: 2.0 }, ease], [ls(3), { x: -150, y: 1100, z: 2.05 }]], 2);
  const door = easeOut(inv(T2.bk - .1, T2.bk + .4, t)), hold = inv(T2.di - .5, T2.di - .1, t);
  const wad = [lerp(FX, RXF - 190, easeOut(hold)), lerp(1300, 1300, easeOut(hold))];
  const knock = [T2.ke, T2.ke + .25].some(h => t > h && t < h + .12);
  kitchen(ctx, t, cam, {
    fR: EM(t, [[ls(2), 'netral', { look: [-.8, .3] }], [T2.di, 'curiga', { look: [-.7, .5] }], [T2.ke + .1, 'meringis'], [T2.ki, 'sombong', { look: [-.7, .5] }]], 5), rx: RXF,
    armsR: { L: armTo(RXF, 1, wad[0] - 40, wad[1] - 30, 1), R: knock ? armTo(RXF, 1, wad[0] + 20, wad[1] - 120, -1) : armTo(RXF, 1, wad[0] + 90, wad[1] - 170, -1) },
    fridge: { door, cold: door, mood: 'happy', look: .8 }, wok: null, cooker: false,
    extra: c => { if (hold > 0) drawWadahNasi(c, wad[0], wad[1], .9, { t, lid: 1 - .35 * inv(T2.di - .2, T2.di + .2, t), frost: inv(T2.di, T2.di + .3, t), face: EF(t, [[ls(2), 'datar'], [T2.ki, 'sombong']], 6) }); }
  });
  for (const h of [T2.ke, T2.ke + .25]) sfxText(ctx, 'TOK', -150 + (h - T2.ke) * 300, 990, 56, inv(h, h + .06, t) * (1 - inv(h + .35, h + .45, t)), '#fff', -.12);
  scrTag(ctx, 'DINGIN', inv(T2.di, T2.di + .15, t) * (1 - inv(T2.ke - .1, T2.ke, t)), '#9ed8ff');
  scrTag(ctx, 'KERAS', inv(T2.ke, T2.ke + .15, t) * (1 - inv(T2.kr - .1, T2.kr, t)), '#fff');
  scrTag(ctx, 'KERING', inv(T2.kr, T2.kr + .15, t) * (1 - inv(T2.ki - .1, T2.ki, t)), '#ffd23a');
  scrTag(ctx, 'KERIKIL', inv(T2.ki, T2.ki + .15, t), '#c9c2b4');
});

// ===== 3 close-up Rani: "Masa calon mertua dikasih nasi sisa?" =====
const T3 = { ma: wt(3, 'masa'), ca: wt(3, 'calon'), di: wt(3, 'dikasih'), si: wt(3, 'sisa') };
SH(ls(3), ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(3), { x: -170, y: 1080, z: 1.3 }], [ls(4), { x: -160, y: 1070, z: 1.4 }]], 3);
  blurLayer(ctx, c => kitchen(c, t, cam, { rx: RXF, fridge: { door: 1, mood: 'worry' }, wok: null, cooker: false }), 8);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const f = EC(t, [[ls(3), 'sombong', { look: [-.5, .3] }], [T3.si, { eyes: 'half', mouth: 'frown', browOne: 1, look: [-.7, .4] }]], 7);
  const zy = 2200 - 60 * ease(inv(ls(3), ls(4), t));
  drawStick(ctx, C(RANI, { x: 560, y: zy, s: 1800, shadow: false, arms: { L: [.2, -.1], R: [.2, -.1] }, face: f, headTilt: -.06 + Math.sin(t * 3) * .02 }));
  // wadah nasi didorong menjauh
  const k = inv(T3.di, T3.si + .2, t); drawWadahNasi(ctx, lerp(260, 110, easeOut(k)), lerp(1650, 1560, k), 1.3, { t, lid: 1, face: EF(t, [[ls(3), 'sombong'], [T3.si, 'kaget']], 8) });
  ctx.restore();
  scrTag(ctx, 'NASI SISA?', inv(T3.si - .05, T3.si + .15, t), '#fff', 360, 100);
});

// ===== 4 masak nasi baru: pulen, wangi, ngepul (gagal palsu: tampak sempurna) =====
const T4 = { ja: wt(4, 'jadi'), ms: wt(4, 'masak'), ba: wt(4, 'baru'), pu: wt(4, 'pulen'), wa: wt(4, 'wangi'), ng: wt(4, 'ngepul') };
const RXC = CKR[0] - 260;
SH(ls(4), ls(5), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(4), { x: 1000, y: 1060, z: 1.35 }], [T4.ms + .3, { x: 1040, y: 1080, z: 1.6 }, easeOut], [T4.pu, { x: 1110, y: 1070, z: 1.9 }, ease], [T4.ng, { x: 1120, y: 960, z: 1.75 }, ease], [ls(5), { x: 1110, y: 940, z: 1.7 }]], 2);
  const lid = easeOut(inv(T4.ba - .2, T4.ba + .3, t)), st = inv(T4.ba, T4.ba + .4, t) + inv(T4.ng - .2, T4.ng + .3, t);
  kitchen(ctx, t, cam, {
    fR: EM(t, [[ls(4), 'licik', { look: [.8, .3] }], [T4.pu, 'bangga', { look: [.8, .4] }], [T4.ng + .05, 'takjub', { look: [.6, -.4] }]], 9), rx: RXC,
    armsR: { L: idleArms(t, 1).L, R: armTo(RXC, 1, CKR[0] + 60, 1110 - 70 * lid, -1) },
    cooker: { lid, steam: Math.min(1.6, st), rice: true, face: EF(t, [[ls(4), 'netral'], [T4.pu, 'bangga']], 10) }, wok: {}, heat: .2,
  });
  glint(ctx, 1110, 980, 130, t, T4.pu); glint(ctx, 1040, 930, 90, t, T4.wa);
  scrTag(ctx, 'PULEN', inv(T4.pu, T4.pu + .15, t) * (1 - inv(T4.wa - .1, T4.wa, t)), '#fff');
  scrTag(ctx, 'WANGI', inv(T4.wa, T4.wa + .15, t) * (1 - inv(T4.ng - .1, T4.ng, t)), '#ffd23a');
  scrTag(ctx, 'NGEPUL', inv(T4.ng, T4.ng + .15, t), '#fff');
});

// ===== 5 nasi masuk wajan, diaduk, mulai nempel =====
const T5 = { ma: wt(5, 'masuk'), wa: wt(5, 'wajan'), di: wt(5, 'diaduk'), mu: wt(5, 'mulai'), ne: wt(5, 'nempel') };
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 560, y: 1000, z: 1.4 }], [T5.wa, { x: 600, y: 1060, z: 1.65 }, easeOut], [T5.ne, { x: 620, y: 1090, z: 1.95 }, ease], [ls(6), { x: 625, y: 1095, z: 2.0 }]], 2);
  const drop = easeIn(inv(T5.ma - .3, T5.wa, t)), stir = t > T5.di;
  const a = stir ? armsStir(t, 7, 45) : { g: [RX + 200, 960], arms: { L: armTo(RX, 1, RX + 150, 1150, -1), R: armTo(RX, 1, RX + 200, 960, -1) } };
  const mush = drop > 0 ? .25 + .3 * inv(T5.mu, T5.ne + .2, t) : 0;
  kitchen(ctx, t, cam, {
    fR: EM(t, [[ls(5), 'netral', { look: [.8, .6] }], [T5.ne, 'curiga', { look: [.8, .7] }]], 11),
    armsR: a.arms, sutil: [a.g, stir ? .5 + Math.sin(t * 7) * .1 : .2],
    wok: { mush: drop >= 1 ? mush : 0 }, heat: 1,
    extra: c => { if (drop > 0 && drop < 1) { c.save(); c.translate(WK[0], lerp(820, WK[1] - 20, drop)); c.beginPath(); c.ellipse(0, 0, 110, 60, 0, 0, TAU); fillStroke(c, NGP.rice, 6); c.restore(); }
      if (t > T5.ne) { // benang lengket di sutil
        const g = a.g, tip = [g[0] + 175 * SUT * .9, g[1] + 96 * SUT]; c.beginPath(); c.moveTo(tip[0] - 20, tip[1]); c.quadraticCurveTo(tip[0], tip[1] + 50, tip[0] + 10, WK[1] - 10); c.lineWidth = 8; c.strokeStyle = NGP.rice; c.stroke(); } }
  });
  sfxText(ctx, 'BLUK', WK[0] + 40, 960, 60, inv(T5.wa, T5.wa + .08, t) * (1 - inv(T5.wa + .5, T5.wa + .6, t)), '#fff', -.1);
  sfxText(ctx, 'NYET', WK[0] + 150, 1000, 56, inv(T5.ne, T5.ne + .08, t), '#ffd23a', .12);
});

// ===== 6 diaduk lagi, butirnya pecah, makin lengket =====
const T6 = { di: wt(6, 'diaduk'), bu: wt(6, 'butirnya'), pe: wt(6, 'pecah'), le: wt(6, 'lengket') };
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(6), { x: 640, y: 1080, z: 2.1 }], [T6.pe, { x: 650, y: 1100, z: 2.35 }, ease], [T6.le, { x: 600, y: 1060, z: 1.8 }, ease], [ls(7), { x: 590, y: 1050, z: 1.7 }]], 2.5);
  const lift = inv(T6.le - .2, T6.le + .3, t), a = armsStir(t, 11, 55);
  if (lift > 0) { a.g = [lerp(a.g[0], RX + 230, lift), lerp(a.g[1], 930, lift)]; a.arms.R = armTo(RX, 1, a.g[0], a.g[1], -1); }
  kitchen(ctx, t, cam, {
    fR: EM(t, [[ls(6), 'ngeden', { look: [.8, .7] }], [T6.pe, 'cemas', { sweat: .6, look: [.8, .7] }], [T6.le + .1, { eyes: 'wide', mouth: 'wobble', sweat: 1, look: [.8, .3] }]], 12),
    armsR: a.arms, sutil: [a.g, .5 + (lift > 0 ? -.2 * lift : Math.sin(t * 11) * .1)],
    wok: { mush: .55 + .45 * inv(T6.bu, T6.le, t) }, heat: 1,
    extra: c => {
      propFace(c, WK[0], WK[1] - 50, 90, EF(t, [[ls(6), 'cemas'], [T6.pe, 'meringis']], 13), { t });
      if (lift > 0) { const tip = [a.g[0] + 160, a.g[1] + 85]; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(tip[0] - 30 + i * 22, tip[1]); c.quadraticCurveTo(tip[0] - 20 + i * 25 + Math.sin(t * 6 + i) * 10, (tip[1] + WK[1]) / 2 + 40, tip[0] - 40 + i * 30, WK[1] - 20); c.lineWidth = 9 - i * 2; c.strokeStyle = NGP.mush; c.stroke(); c.lineWidth = 2; c.strokeStyle = INK; c.stroke(); } }
    }
  });
  for (const [h, x] of [[T6.pe, -60], [T6.pe + .2, 60]]) sfxText(ctx, 'PLETAK', WK[0] + x, 1000, 46, inv(h, h + .06, t) * (1 - inv(h + .4, h + .5, t)), '#fff', -.1);
  scrTag(ctx, 'LENGKET', inv(T6.le, T6.le + .15, t), '#ffd23a');
});

// ===== 7 Budi lewat, ngintip: "Kak, ini nasi goreng apa bubur ayam?" =====
const T7 = { le: wt(7, 'lewat'), ng: wt(7, 'ngintip'), ka: wt(7, 'kak'), go: wt(7, 'goreng'), bu: wt(7, 'bubur'), ay: wt(7, 'ayam') };
SH(ls(7), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(7), { x: 760, y: 1030, z: 1.25 }], [T7.ng, { x: 720, y: 1030, z: 1.35 }, easeOut], [T7.bu, { x: 660, y: 1040, z: 1.5 }, ease], [ls(8), { x: 650, y: 1040, z: 1.55 }]], 2);
  const BX0 = 1500, BX1 = 880, wk = easeInOut(inv(ls(7), T7.ng, t)), bx = lerp(BX0, BX1, wk), walking = t < T7.ng;
  const wc = walkCycle(BX0 - bx, 600, 1);
  const peek = inv(T7.ng, T7.ng + .4, t), laugh = t > T7.ay;
  const a = armsStir(t, 4, 25);
  kitchen(ctx, t, cam, {
    fR: EM(t, [[ls(7), 'cemas', { look: [.8, .7], sweat: .6 }], [T7.ka + .05, 'kaget', { look: [.9, 0] }], [T7.ay + .1, { eyes: 'half', mouth: 'frown', browAng: .3, look: [.9, 0] }]], 14),
    armsR: a.arms, sutil: [a.g, .5],
    fB: EM(t, [[ls(7), 'netral', { look: [-.8, 0] }], [T7.ng, 'curiga', { look: [-.6, .7] }], [T7.go, 'licik', { look: [-.8, .2] }], [T7.ay + .05, 'bangga']], 15), bx,
    armsB: walking ? wc.arms : laugh ? { L: [2.5 + Math.sin(t * 22) * .15, .5], R: [.4, -.9] } : { L: [.4, -.9], R: [.4, -.9] },
    budiExtra: walking ? { legs: wc.legs, bob: wc.bob, footDir: -1, lean: -wc.lean } : { lean: -.12 * peek, bob: laugh ? Math.abs(Math.sin(t * 14)) * -.02 : 0 },
    wok: { mush: 1 }, heat: 1,
  });
  if (laugh) { sfxText(ctx, 'HAHA', 1040, 860, 66, inv(T7.ay, T7.ay + .1, t), '#ffd23a', .12); }
  scrTag(ctx, 'BUBUR AYAM?', inv(T7.bu, T7.bu + .15, t), '#fff', 340, 96);
});

// ===== 8 & 10: jam dinding, "Tinggal 30 / 10 menit" =====
function clockShot(i, m0, m1, label, seed) {
  const tg = wt(i, 'tinggal'), tm = wt(i, String(label));
  SH(ls(i), ls(i + 1), { tr: 'whip' }, (ctx, lt, t) => {
    const cam = CK(t, [[ls(i), { x: 760, y: 820, z: 2.2 }], [tm, { x: 790, y: 780, z: 2.6 }, easeOut], [ls(i + 1), { x: 795, y: 775, z: 2.7 }]], 3);
    const k = easeInOut(inv(ls(i), tm + .2, t));
    kitchen(ctx, t, cam, { jam: jamAt(lerp(m0, m1, k)), fast: inv(ls(i), ls(i) + .2, t) * (1 - inv(tm + .2, tm + .4, t)), fR: EF(t, [[ls(i), 'cemas', { sweat: 1 }]], seed), wok: { mush: 1, burn: i === 10 ? 1 : 0 } });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (Math.sin(t * 18) > 0 && t > tm) { ctx.fillStyle = 'rgba(229,38,42,.12)'; ctx.fillRect(0, 0, W, H); } ctx.restore();
    scrTag(ctx, label + ' MENIT', inv(tm, tm + .15, t), '#e5262a', 1560, 120);
  });
}
clockShot(8, 40, 30, 30, 16);

// ===== 9 nambah minyak, api digedein, gosong di bawah, lembek di atas =====
const T9 = { na: wt(9, 'nambah'), mi: wt(9, 'minyak'), ap: wt(9, 'apinya'), dg: wt(9, 'digedein'), go: wt(9, 'gosong'), ba: wt(9, 'bawah'), le: wt(9, 'lembek'), at: wt(9, 'atas') };
SH(ls(9), ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(9), { x: 560, y: 1020, z: 1.45 }], [T9.mi, { x: 590, y: 1040, z: 1.6 }, easeOut], [T9.dg, { x: 640, y: 1150, z: 1.7 }, ease], [T9.go, { x: 650, y: 1140, z: 2.0 }, ease], [T9.le, { x: 640, y: 1060, z: 2.1 }, ease], [ls(10), { x: 630, y: 1050, z: 2.15 }]], 3);
  const pour = inv(T9.na, T9.na + .2, t) * (1 - inv(T9.ap - .2, T9.ap, t)), big = inv(T9.dg - .1, T9.dg + .2, t), burn = inv(T9.go - .2, T9.ba, t);
  const a = pour > 0 ? { g: [RX + 200, 1000], arms: { L: armTo(RX, 1, RX + 150, 1150, -1), R: armTo(RX, 1, RX + 210, 940, -1) } } : armsStir(t, 13, 55);
  kitchen(ctx, t, cam, {
    fR: EM(t, [[ls(9), 'ngeden', { look: [.8, .6], sweat: .6 }], [T9.dg, 'licik', { look: [.7, .9] }], [T9.go + .05, { eyes: 'flinch', mouth: 'wobble', sweat: 1, browAng: .3 }]], 17),
    armsR: a.arms, sutil: pour > 0 ? null : [a.g, .5 + Math.sin(t * 13) * .1],
    wok: { mush: 1, burn }, heat: 1, fire: 1,
    under: c => { if (big > 0) for (let i = 0; i < 7; i++) { const fx = ST[0] - 180 + i * 60, h = (90 + 40 * Math.sin(t * 19 + i * 1.3)) * big; c.beginPath(); c.moveTo(fx - 22, ST[1] - 115); c.quadraticCurveTo(fx - 10, ST[1] - 115 - h * .6, fx, ST[1] - 115 - h); c.quadraticCurveTo(fx + 10, ST[1] - 115 - h * .6, fx + 22, ST[1] - 115); c.closePath(); fillStroke(c, i % 2 ? '#ff8a2a' : '#ffcf3a', 4); } },
    extra: c => {
      if (pour > 0) drawBotolMinyak(c, RX + 230, 960, .55, 2.1, pour);
      panicSmoke(c, t, burn);
      propFace(c, WK[0], WK[1] - 50, 90, EF(t, [[ls(9), 'cemas'], [T9.le, 'meringis']], 18), { t });
    }
  });
  sfxText(ctx, 'WUSH', ST[0] + 160, 1100, 60, inv(T9.dg, T9.dg + .08, t) * (1 - inv(T9.go - .1, T9.go, t)), '#ff8a2a', .1);
  scrTag(ctx, 'GOSONG', inv(T9.go, T9.go + .15, t) * (1 - inv(T9.le - .1, T9.le, t)), '#ff8a2a');
  scrTag(ctx, 'LEMBEK', inv(T9.le, T9.le + .15, t), '#fff');
});
clockShot(10, 30, 10, 10, 19);

// ===== 11 pasrah: ambil nasi kerikil dari kulkas, masuk wajan =====
const T11 = { de: wt(11, 'dengan'), pa: wt(11, 'pasrah'), am: wt(11, 'ambil'), ke: wt(11, 'kerikil'), ku: wt(11, 'kulkas'), ma: wt(11, 'masuk'), wa: wt(11, 'wajan') };
SH(ls(11), ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  const go = easeInOut(inv(T11.ku + .1, T11.ma - .1, t)), rx = lerp(RXF, RX, go), walking = go > 0 && go < 1;
  const cam = CK(t, [[ls(11), { x: -180, y: 1060, z: 1.55 }], [T11.pa, { x: -170, y: 1030, z: 1.75 }, easeOut], [T11.ku, { x: -150, y: 1080, z: 1.5 }, ease], [T11.ma, { x: 520, y: 1060, z: 1.4 }, ease], [ls(12), { x: 600, y: 1080, z: 1.7 }, easeIn]], 2);
  const wc = walkCycle(rx - RXF, 600, 1), hold = inv(T11.am, T11.am + .4, t), dump = inv(T11.ma, T11.wa + .2, t);
  const wad = [rx + 180, 1270 - 40 * dump];
  kitchen(ctx, t, cam, {
    fR: EM(t, [[ls(11), { eyes: 'half', mouth: 'flat', look: [-.6, .3] }], [T11.am, { eyes: 'half', mouth: 'frown', look: [.6, .4] }], [T11.ma, 'cemas', { look: [.8, .7] }]], 20), rx,
    armsR: hold > 0 ? { L: armTo(rx, 1, wad[0] - 40, wad[1] - 30, 1), R: armTo(rx, 1, wad[0] + 50, wad[1] - 60, -1) } : idleArms(t, 1),
    rExtra: walking ? { legs: wc.legs, bob: wc.bob, footDir: 1, lean: wc.lean } : {},
    fridge: { door: 1 - inv(T11.ku, T11.ku + .4, t), cold: 1, mood: 'happy', look: .8 },
    wok: { block: dump >= 1 ? 1 : 0 }, heat: 1, wok1: { mush: 1, burn: 1 },
    extra: c => {
      if (hold > 0 && dump < 1) { const p = hold < 1 ? [lerp(FX, wad[0], easeOut(hold)), lerp(1300, wad[1], easeOut(hold))] : (dump > 0 ? [lerp(wad[0], WK[0], easeIn(dump)), lerp(wad[1], WK[1] - 60, easeIn(dump))] : wad); drawWadahNasi(c, p[0], p[1], .9, { t, lid: 1 - dump, frost: 1, face: EF(t, [[ls(11), 'sombong']], 21) }); }
      panicSmoke(c, t, .6, NG.wok1[0], NG.wok1[1] - 90);
    }
  });
  sfxText(ctx, 'BRUK', WK[0], 980, 60, inv(T11.wa, T11.wa + .08, t), '#fff', -.12);
});

// ===== 12 butirnya buyar satu-satu, nggak ada yang nempel =====
const T12 = { da: wt(12, 'dan'), an: wt(12, 'anehnya'), bu: wt(12, 'butirnya'), by: wt(12, 'buyar'), ss: wt(12, 'satusatu'), ng: wt(12, 'nggak'), ne: wt(12, 'nempel') };
SH(ls(12), ls(13), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(12), { x: 620, y: 1080, z: 1.9 }], [T12.by, { x: 640, y: 1070, z: 2.2 }, ease], [T12.ss + .3, { x: 620, y: 1020, z: 1.9 }, ease], [T12.ne, { x: 560, y: 1020, z: 1.6 }, ease], [ls(13), { x: 540, y: 1020, z: 1.55 }]], 2);
  const br = inv(T12.by - .15, T12.by + .25, t), col = mixC(NGP.rice, NGP.fried, inv(T12.ss, ls(13), t));
  const a = armsStir(t, 9, 60);
  kitchen(ctx, t, cam, {
    fR: EM(t, [[ls(12), 'cemas', { look: [.8, .7] }], [T12.by + .05, 'kaget', { look: [.8, .7] }], [T12.ss + .2, 'takjub', { look: [.8, .6] }]], 22),
    armsR: a.arms, sutil: [a.g, .5 + Math.sin(t * 9) * .1],
    wok: { block: 1 - br, grains: br, toss: br * (.6 + .4 * Math.abs(Math.sin(t * 3))), col }, heat: 1, wok1: { mush: 1, burn: 1 },
  });
  glint(ctx, 640, 960, 150, t, T12.by + .1);
  sfxText(ctx, 'CESS', WK[0] - 160, 980, 58, inv(T12.by, T12.by + .08, t), '#fff', -.12);
  for (const [h, x] of [[T12.ss, -100], [T12.ss + .3, 40], [T12.ss + .55, 160]]) sfxText(ctx, 'SREK', WK[0] + x, 940, 44, inv(h, h + .06, t) * (1 - inv(h + .4, h + .5, t)), '#ffd23a', .1);
  scrTag(ctx, 'BUYAR!', inv(T12.by, T12.by + .15, t) * (1 - inv(T12.ng - .1, T12.ng, t)), '#ffd23a');
  const ck = inv(T12.ne, T12.ne + .2, t); if (ck > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(540, 360); const s2 = backOut(ck); ctx.scale(s2, s2); drawCheck(ctx, 0, 0, 70); ctx.restore(); }
});

// ===== 13 Ibu pulang, lihat wajan pertama, geleng-geleng =====
const T13 = { ib: wt(13, 'ibu'), pu: wt(13, 'pulang'), li: wt(13, 'lihat'), pe: wt(13, 'pertama'), ge: wt(13, 'gelenggeleng') };
SH(ls(13), ls(14), { tr: 'whip' }, (ctx, lt, t) => {
  const IX0 = -900, IX1 = -150, wk = easeInOut(inv(ls(13), T13.li, t)), ix = lerp(IX0, IX1, wk), walking = wk > 0 && wk < 1, wc = walkCycle(ix - IX0, 600, 1);
  const cam = CK(t, [[ls(13), { x: -420, y: 1020, z: 1.25 }], [T13.li, { x: -160, y: 1060, z: 1.35 }, ease], [T13.ge, { x: -110, y: 1080, z: 1.6 }, ease], [ls(14), { x: -100, y: 1080, z: 1.65 }]], 2);
  const shakeH = t > T13.ge ? Math.sin((t - T13.ge) * 14) * .16 : 0;
  kitchen(ctx, t, cam, {
    fI: EM(t, [[ls(13), 'netral', { look: [.8, 0] }], [T13.li, 'curiga', { look: [.6, .8] }], [T13.ge, { eyes: 'half', mouth: 'flat', look: [0, .3] }]], 23), ix,
    armsI: walking ? wc.arms : { L: [.4, -.9], R: [.4, -.9] }, ibuExtra: walking ? { legs: wc.legs, bob: wc.bob, footDir: 1, lean: wc.lean } : { headTilt: shakeH },
    fR: EF(t, [[ls(13), 'takjub', { look: [.8, .6] }], [T13.li + .1, 'meringis', { look: [-.8, .2] }]], 24),
    wok: { grains: 1, col: NGP.fried }, heat: 1, wok1: { mush: 1, burn: 1 }, fridge: { door: 0, mood: 'happy', look: .5 },
    extra: c => { panicSmoke(c, t, .4, NG.wok1[0], NG.wok1[1] - 90); propFace(c, NG.wok1[0], NG.wok1[1] - 90, 70, EF(t, [[ls(13), 'meringis']], 25), { t }); }
  });
  if (t > T13.ge) { const k = inv(T13.ge, T13.ge + .15, t); sfxText(ctx, 'CK CK CK', 280, 820, 54, k, '#fff', -.1); }
});

// ===== 14-15: penjelasan Ibu (gelembung lup: butir nasi raksasa) =====
const T14 = { na: wt(14, 'nasi'), pe: wt(14, 'permukaannya'), ba: wt(14, 'basah'), le: wt(14, 'lembek'), di: wt(14, 'diaduk'), ha: wt(14, 'hancur'), lm: wt(14, 'lem') };
const T15 = { se: wt(15, 'semalaman'), ku: wt(15, 'kulkas'), me: wt(15, 'mengeras'), pe: wt(15, 'permukaannya'), ke: wt(15, 'kering'), ja: wt(15, 'jadi'), go: wt(15, 'kegoreng'), bu: wt(15, 'bukan'), kk: wt(15, 'kekukus') };
const camExp = t => CK(t, [[ls(14), { x: -60, y: 1120, z: 1.5 }], [ls(14) + .7, { x: -40, y: 1140, z: 1.6 }, easeOut], [ls(16) - .05, { x: 0, y: 1150, z: 1.75 }]], 2);
function expBG(ctx, t, cam, fI) {
  kitchen(ctx, t, cam, { fI, ix: -150, armsI: { L: [.4, -.9], R: [2.3 + Math.sin(t * 5) * .15, .6] }, fR: EF(t, [[ls(14), 'meringis', { look: [-.8, .2] }], [ls(15), 'sadar', { look: [-.8, .2] }]], 26), wok: { grains: 1, col: NGP.fried }, heat: 1, wok1: { mush: 1, burn: 1 }, fridge: { door: 0, mood: 'happy', look: .6 } });
}
SH(ls(14), ls(15), { tr: 'none' }, (ctx, lt, t) => {
  const cam = camExp(t);
  expBG(ctx, t, cam, EM(t, [[ls(14), 'netral', { look: [.8, -.3] }], [T14.di, 'curiga', { look: [.8, -.3] }]], 27));
  const sq = easeInOut(inv(T14.di, T14.ha, t)), brk = inv(T14.ha, T14.lm, t);
  drawLup(ctx, 660, 500, 300, inv(ls(14), ls(14) + .35, t), c => {
    c.fillStyle = '#3a3550'; c.fillRect(-400, -400, 800, 800);
    if (brk < .5) drawButir(c, 0, 20, 190, { wet: inv(T14.ba - .2, T14.ba + .2, t), squash: sq, t, face: EF(t, [[ls(14), 'netral'], [T14.ba, 'cemas'], [T14.di + .2, 'meringis']], 28) });
    else { for (let i = 0; i < 5; i++) { c.save(); c.translate(-140 + i * 70, 40 + (i % 2) * 30); c.beginPath(); for (let j = 0; j < 10; j++) { const a = j / 10 * TAU, r = 55 + 12 * Math.sin(j * 3 + i + t * 4); j ? c.lineTo(Math.cos(a) * r, Math.sin(a) * r * .6) : c.moveTo(Math.cos(a) * r, Math.sin(a) * r * .6); } c.closePath(); fillStroke(c, NGP.mush, 6); c.restore(); }
      for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-110 + i * 70, 40); c.quadraticCurveTo(-80 + i * 70, 90, -40 + i * 70, 50); c.lineWidth = 10; c.strokeStyle = NGP.mush; c.stroke(); } }
    if (sq > 0 && brk < .5) drawSutil(c, 40, -240 + 70 * sq, 1, Math.PI / 2 + .2);
  }, ...toScreen(cam, -150 + 60, 1010));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  popText(ctx, 'BASAH', 600, 820, 70, inv(T14.ba, T14.ba + .15, t) * (1 - inv(T14.di - .1, T14.di, t)), '#9ed8ff', INK, -.05);
  popText(ctx, 'LEM!', 600, 820, 96, inv(T14.lm, T14.lm + .15, t), '#fff', INK, .05);
  ctx.restore();
});
SH(ls(15), ls(16), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = camExp(t);
  expBG(ctx, t, cam, EM(t, [[ls(15), 'lega', { look: [.8, -.3] }], [T15.go, 'bangga', { look: [.8, -.3] }]], 29));
  const hard = inv(T15.me - .2, T15.me + .3, t), oil = inv(T15.ja, T15.go, t), two = inv(T15.bu - .1, T15.bu + .2, t);
  drawLup(ctx, 660, 500, 300, 1, c => {
    c.fillStyle = mixC('#2f4a6a', '#3a2a12', oil); c.fillRect(-400, -400, 800, 800);
    if (oil > 0) { c.fillStyle = `rgba(255,190,60,${.5 * oil})`; c.fillRect(-400, 60, 800, 400); }
    const gx = lerp(0, -130, two);
    drawButir(c, gx, 10, 170 - 40 * two, { hard, t, sizzle: oil, face: EF(t, [[ls(15), 'netral'], [T15.me, 'bangga'], [T15.go, 'takjub']], 30) });
    if (two > 0) drawButir(c, 150, 10, 130 * backOut(two), { wet: 1, t, steam: 1, face: EF(t, [[T15.bu, 'meringis']], 31) });
    if (hard > 0 && oil < .5) for (let i = 0; i < 6; i++) { c.save(); c.globalAlpha = hard * (1 - oil * 2); c.translate(-150 + i * 60, -150 + (i % 2) * 30); c.strokeStyle = '#fff'; c.lineWidth = 4; c.beginPath(); for (let k = 0; k < 3; k++) { c.moveTo(-12, 0); c.lineTo(12, 0); c.rotate(Math.PI / 3); } c.stroke(); c.restore(); }
  }, ...toScreen(cam, -150 + 60, 1010));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  popText(ctx, 'KERAS', 600, 820, 70, inv(T15.me, T15.me + .15, t) * (1 - inv(T15.ke - .1, T15.ke, t)), '#fff', INK, -.05);
  popText(ctx, 'KERING', 600, 820, 70, inv(T15.ke, T15.ke + .15, t) * (1 - inv(T15.go - .1, T15.go, t)), '#ffd23a', INK, -.05);
  popText(ctx, 'GORENG', 470, 820, 66, inv(T15.go, T15.go + .15, t), '#ffd23a', INK, -.05);
  popText(ctx, 'KUKUS', 760, 820, 60, inv(T15.kk, T15.kk + .15, t), '#9ed8ff', INK, .05);
  const ck = inv(T15.go + .1, T15.go + .3, t); if (ck > 0) { ctx.save(); ctx.translate(470, 230); const s2 = backOut(ck); ctx.scale(s2, s2); drawCheck(ctx, 0, 0, 48); ctx.restore(); }
  const xk = inv(T15.kk + .1, T15.kk + .3, t); if (xk > 0) { ctx.save(); ctx.translate(760, 230); const s2 = backOut(xk); ctx.scale(s2, s2); drawX(ctx, 0, 0, 48); ctx.restore(); }
  ctx.restore();
});

// ===== 16 calon mertua nambah dua kali -> whip-pan kembali ke frame 0 (loop) =====
const T16 = { ca: wt(16, 'calon'), na: wt(16, 'nambah'), du: wt(16, 'dua'), ka: wt(16, 'kali'), da: wt(16, 'dan'), ra: wt(16, 'rani'), de: wt(16, 'dengan'), dg: wt(16, 'degdegan') };
const RXM = 1440;
SH(ls(16), ENDT, { tr: 'none' }, (ctx, lt, t) => {
  const PB = T16.de, back = inv(PB, ENDT, t), e = easeInOut(back);
  const c0 = cam0(0), a = { x: 1760, y: 1060, z: 1.3 };
  const cam = back <= 0 ? CK(t, [[ls(16), { x: 1800, y: 1040, z: 1.2 }], [T16.na, { x: 1820, y: 1080, z: 1.4 }, easeOut], [T16.ka, { x: 1780, y: 1070, z: 1.35 }, ease], [T16.ra, { x: 1660, y: 1060, z: 1.3 }, ease], [PB, a, ease]], 2)
    : { x: lerp(a.x, c0.x, e), y: lerp(a.y, c0.y, e), z: lerp(a.z, c0.z, e) - .25 * Math.sin(e * Math.PI), r: 0 };
  if (back > .5) {                           // di tengah pan cepat, adegan kembali ke krisis frame 0
    const tl = t - ENDT; hookScene(ctx, t, cam, tl);
    ctx.save(); applyCam(ctx, cam, 1); propFace(ctx, WK[0], WK[1] - 52, 96, EF(tl, [[-9, 'datar']], 2), { t: tl }); ctx.restore();
    return;
  }
  const n = 1 + (t > T16.na + .1 ? 1 : 0) + (t > T16.ka ? 1 : 0), eat = Math.sin(t * 9);
  kitchen(ctx, t, cam, {
    jam: 12, mertua: { fB: EM(t, [[ls(16), 'netral', { look: [0, .8] }], [T16.na, 'takjub', { look: [0, .8] }], [T16.ka + .1, 'bangga', { look: [-.8, 0] }]], 32), fI: EM(t, [[ls(16), 'lega', { look: [0, .8] }], [T16.du, 'takjub']], 33),
      armsB: { L: armTo(NG.mertua[0], -1, NG.mertua[0] - 60, 1230 + eat * 20, 1), R: [.3, -.3] }, armsI: { L: armTo(NG.mertua[1], -1, NG.mertua[1] - 60, 1230 - eat * 20, 1), R: [.3, -.3] } },
    fR: EM(t, [[ls(16), 'cemas', { look: [.8, 0], sweat: .5 }], [T16.na + .1, 'lega', { look: [.8, 0] }], [T16.ra, 'bangga', { look: [.8, 0] }]], 34), rx: RXM,
    armsR: { L: [.4, -.9], R: [.4, -.9] }, wok: { grains: 1, col: NGP.fried }, heat: .6, wok1: { mush: 1, burn: 1 }, cooker: false,
    extra: c => { drawPiringNG(c, NG.mertua[0] - 30, TOP + 10, .8, { n }); drawPiringNG(c, NG.mertua[1] - 30, TOP + 10, .8, { n: Math.max(1, n - (t > T16.ka ? 0 : 1)) }); }
  });
  scrTag(ctx, 'NAMBAH!', inv(T16.na + .1, T16.na + .25, t) * (1 - inv(T16.da - .1, T16.da, t)), '#ffd23a');
  scrTag(ctx, '2X', inv(T16.ka, T16.ka + .15, t) * (1 - inv(T16.da - .1, T16.da, t)), '#fff', 470, 90);
});
