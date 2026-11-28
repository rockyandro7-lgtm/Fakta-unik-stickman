// ---------- Fakta Unik: "Bawang goreng gosong di piring" (~50 dtk, tanpa CTA) ----------
// Bentuk cerita ketiga belas: "resep ditertawakan + pembalikan" (Budi angkat kuning emas -> gosong di piring; api dikecilin gagal; stakes toples arisan;
// Ibu angkat saat kuning muda, ditertawakan, lalu berubah emas sendiri). Dapur = dapurBack/dapurMeja (set Telur) + kompor & wajan (env_kerupuk).
// Aset baru env_bawanggoreng.js (irisan satu fungsi mentah -> gosong, piring tiris, toples, setrika, dunia mikro). Loop: shot terakhir = hook dengan waktu negatif.
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
const BK = BGL.back, S = 600, TOP = BGL.top, WK = BGL.wok, PL = BGL.plate, JR = BGL.toples, BWK = BGL.bowl;
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, BK, S, flip, wx, wy, bend);
function tokoh(ctx, t, P, x, face, arms, flip = 1, extra = {}) { drawStick(ctx, C(P, Object.assign({ x, y: BK, s: S, flip, armLen: 1.3, legs: standL, arms: arms || idleArms(t, x * .01), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
const scr = (ctx, f) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); f(ctx); ctx.restore(); };
const scrTag = (ctx, str, k, col = '#ffd23a', y = 300, size = 104) => scr(ctx, c => popText(c, str, 540, y, size, k, col, INK, -.05));
const sfxS = (ctx, ...a) => scr(ctx, c => sfxText(c, ...a));
const win = (t, a, b, f = .15) => inv(a, a + f, t) * (1 - inv(b - .1, b, t));
const tagSeq = (ctx, t, list, y = 300) => list.forEach(([str, a, b, col, size]) => scrTag(ctx, str, inv(a, a + .15, t) * (b == null ? 1 : 1 - inv(b - .1, b, t)), col || '#fff', y, size || 104));
const inCam = (ctx, cam, f) => { ctx.save(); applyCam(ctx, cam, 1); f(ctx); ctx.restore(); };
// lengan panjang (dunia) dari luar layar ke gagang serok: tangan close-up
const longArm = (c, x0, y0, x1, y1) => { c.save(); c.lineCap = 'round'; c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + 50, x1, y1); c.lineWidth = 17; c.strokeStyle = INK; c.stroke(); circle(c, x1, y1, 18); c.fillStyle = INK; c.fill(); c.restore(); };
const handleEnd = (x, y, s, rot) => [x + Math.cos(rot) * 400 * s, y + Math.sin(rot) * 400 * s];

// ===== adegan dapur bersama =====
// o: { fB, armsB, bx, flipB, bExtra, fR, armsR, rx, flipR, rExtra, fI, armsI, ix, flipI, iExtra, fire, heat, wc, wn, stir, pile, spots, plate, jar, jarGlow, jarFace, bowlN, bowlFace, serok:[x,y,s,rot,o], arm:[x0,y0], jam, fast, extra }
function dapur(ctx, t, cam, o = {}) {
  dapurBack(ctx, t, cam, { jam: o.jam == null ? 3.5 : o.jam, fast: o.fast || 0 });
  drawFridge(ctx, BGL.fridge, 1160, 1.0, { t, mood: 'happy', look: .4 });
  if (o.fI) tokoh(ctx, t, IBU, o.ix == null ? BGL.ibu : o.ix, o.fI, o.armsI, o.flipI || -1, o.iExtra || {});
  if (o.fR) tokoh(ctx, t, RANI, o.rx == null ? BGL.rani : o.rx, o.fR, o.armsR, o.flipR || 1, o.rExtra || {});
  if (o.fB) tokoh(ctx, t, BUDI, o.bx == null ? BGL.budi : o.bx, o.fB, o.armsB, o.flipB || -1, o.bExtra || {});
  dapurMeja(ctx);
  drawMangkukIris(ctx, BWK[0], BWK[1], .8, { n: o.bowlN == null ? 30 : o.bowlN, t, face: o.bowlFace });
  drawToplesBawang(ctx, JR[0], JR[1], .8, { fill: o.jar || 0, label: 'ARISAN', glow: o.jarGlow || 0, face: o.jarFace, t });
  drawStove(ctx, BGL.stove[0], BGL.stove[1], .9, { fire: o.fire == null ? .6 : o.fire, t });
  drawWok(ctx, WK[0], WK[1], BGL.wokS, { t, heat: o.heat == null ? .8 : o.heat }, c => isiWajan(c, t, o.wc == null ? .3 : o.wc, o.wn == null ? 16 : o.wn, o.stir || 0));
  if (o.plate !== false) drawPiringTiris(ctx, PL[0], PL[1], 1, { t, spots: o.spots == null ? .6 : o.spots, pile: o.pile || null });
  if (o.serok) { const [x, y, s, rot, so] = o.serok; drawSerokBawang(ctx, x, y, s, rot, Object.assign({ t }, so || {})); if (o.arm) { const h = handleEnd(x, y, s, rot); longArm(ctx, o.arm[0], o.arm[1], h[0], h[1]); } }
  if (o.extra) o.extra(ctx);
}

// ===== 0 HOOK: Bawang goreng Budi diangkat masih kuning, tapi di piring malah gosong =====
const H0 = { di: wt(0, 'diangkat'), ma: wt(0, 'masih'), ku: wt(0, 'kuning'), ta: wt(0, 'tapi'), pi: wt(0, 'piring'), ml: wt(0, 'malah'), go: wt(0, 'gosong') };
const cam0 = tl => CK(tl, [[-3, { x: 790, y: 1080, z: 1.45 }], [-.2, { x: 790, y: 1080, z: 1.45 }], [0, { x: 785, y: 1070, z: 1.5 }, easeOut], [H0.ku, { x: 760, y: 1050, z: 1.56 }, ease],
  [H0.ta - .05, { x: 750, y: 1050, z: 1.58 }, ease], [H0.ta + .25, { x: 250, y: 1160, z: 1.8 }, easeInOut], [H0.go, { x: 235, y: 1170, z: 1.95 }, ease], [ls(1), { x: 230, y: 1175, z: 2.02 }, easeIn]], 2);
function serokPath(tl) {   // posisi serok di hook (tl<0: masih menggoreng). Budi terlihat sejak frame 0.
  const up = easeOut(inv(-.05, H0.di + .2, tl)), stir = tl < 0 ? Math.sin(tl * 5) * 40 : 0;
  return { x: lerp(WK[0] - 20 + stir, 600, up), y: 1138 - 148 * up, rot: lerp(.3, .55, up), up };
}
function hookScene(ctx, t, cam, tl) {
  const sp = serokPath(tl), he = handleEnd(sp.x, sp.y, .8, sp.rot), land = tl > H0.ta + .12, cook = .6 + .4 * easeIn(inv(H0.pi, H0.go + .15, tl)), smoke = inv(H0.ml, H0.go + .2, tl);
  dapur(ctx, tl + 100, cam, { fire: 1, wc: .55, wn: sp.up > .5 ? 4 : 14, stir: tl < 0 ? 1 : 0, spots: .2,
    fB: EM(tl, [[-9, 'bangga', { look: [-.7, .5] }], [H0.ku - .1, 'sombong', { look: [-.6, 0] }]], 30), armsB: { R: armTo(BGL.budi, -1, he[0], he[1], -1), L: [.3, -.3] },
    pile: land ? { c: cook, n: 30, seed: 3, smoke, face: EF(tl, [[-9, 'bangga', { look: [.4, -.3] }], [H0.ml, 'kaget'], [H0.go + .15, { eyes: 'x', mouth: 'wobble', sweat: 1 }]], 1) } : null,
    serok: tl < H0.ta + .1 ? [sp.x, sp.y, .8, sp.rot, { c: .6, n: 24, drip: tl > -.1 ? 1 : 0, seed: 11 }] : null });
  if (tl > H0.ku - .05 && tl < H0.ta) scr(ctx, c => { const p = toScreen(cam, sp.x, sp.y - 30); glint(c, p[0] + 40, p[1] - 60, 60, tl, H0.ku); });
  if (land && tl < H0.pi + .3) scr(ctx, c => { const p = toScreen(cam, PL[0], PL[1] - 150); sfxText(c, 'PLUK', p[0] + 150, p[1] - 40, 60, inv(H0.ta + .12, H0.ta + .25, tl), '#fff', -.1); });
}
SH(0, ls(1), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  tagSeq(ctx, t, [['MASIH KUNING', H0.ma - .05, H0.ta, '#ffd23a', 112], ['GOSONG?!', H0.go - .05, null, '#ff8a5a', 140]]);
  const p = toScreen(cam, WK[0], WK[1]); sfxS(ctx, 'CESS', p[0] + 70, p[1] - 160, 66, win(t, -.2, H0.ku), '#fff', .1);
});

// ===== 1 Rani ngakak: "Apinya kegedean, tuh!" =====
const T1 = { ra: wt(1, 'rani'), ng: wt(1, 'ngakak'), ap: wt(1, 'apinya'), ke: wt(1, 'kegedean'), tu: wt(1, 'tuh') };
SH(ls(1), ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(1), { x: 520, y: 1110, z: 1.25 }], [T1.ap, { x: 560, y: 1110, z: 1.3 }, ease], [ls(2), { x: 580, y: 1110, z: 1.35 }, easeIn]], 2);
  blurLayer(ctx, c => dapur(c, t, cam, { fire: 1, heat: 1, wc: .5, wn: 5, pile: { c: 1, n: 30, seed: 3, smoke: 1, face: EXPR.meringis } }), 5);
  const pf = inv(T1.ap - .1, T1.ap + .2, t), fl = toScreen(cam, BGL.stove[0], BGL.stove[1] - 130);
  scr(ctx, c => {
    if (pf > 0) { for (let i = 0; i < 7; i++) { const fx = fl[0] - 150 + i * 50, h = (140 + 60 * Math.sin(t * 15 + i * 1.7)) * pf; c.beginPath(); c.moveTo(fx - 26, fl[1]); c.quadraticCurveTo(fx - 12, fl[1] - h * .6, fx, fl[1] - h); c.quadraticCurveTo(fx + 12, fl[1] - h * .6, fx + 26, fl[1]); c.closePath(); fillStroke(c, '#ff9f2e', 5); } }
    const laugh = t > T1.ng ? Math.sin(t * 22) * .05 : 0;
    drawStick(c, C(RANI, { x: 260, y: 2250, s: 1800, shadow: false, flip: 1, armLen: 1.3, headTilt: laugh - .05,
      arms: { L: [.3, -.2], R: pf > 0 ? reach(260, 2250, 1800, 1, fl[0] - 60, fl[1] - 60, 1) : [.3, -.2] },
      face: EC(t, [[ls(1), 'licik', { look: [.7, .2] }], [T1.ng, { eyes: 'happy', mouth: 'teeth', browUp: .3 }], [T1.ap + .1, 'sombong', { look: [.8, .3] }]], 2) }));
  });
  tagSeq(ctx, t, [['HAHAHA!', T1.ng - .05, T1.ap, '#fff', 120], ['APINYA KEGEDEAN!', T1.ap - .05, null, '#ff9f2e', 96]]);
});

// ===== 2 Api dikecilin, bawangnya diaduk terus. Di piring, gosong lagi =====
const T2 = { ap: wt(2, 'api'), dk: wt(2, 'dikecilin'), bw: wt(2, 'bawangnya'), da: wt(2, 'diaduk'), te: wt(2, 'terus'), di: wt(2, 'di'), pi: wt(2, 'piring'), go: wt(2, 'gosong'), la: wt(2, 'lagi') };
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(2), { x: 800, y: 1170, z: 1.5 }], [T2.bw, { x: 760, y: 1120, z: 1.45 }, ease], [T2.di - .1, { x: 730, y: 1110, z: 1.5 }, ease], [T2.pi + .1, { x: 240, y: 1170, z: 1.85 }, easeInOut], [ls(3), { x: 235, y: 1170, z: 1.95 }, easeIn]], 2);
  const knob = easeInOut(inv(T2.ap, T2.dk + .3, t)), fire = lerp(1, .3, inv(T2.dk, T2.dk + .4, t)), stirK = inv(T2.bw - .2, T2.bw, t) * (1 - inv(T2.di - .3, T2.di, t));
  const kx = BGL.stove[0] + 150 * .9, ky = BGL.stove[1] - 56 * .9, sx = WK[0] - 20 + Math.sin(t * 9) * 50 * stirK, sy = 1136 + Math.cos(t * 9) * 8 * stirK;
  const he = handleEnd(sx, sy, .8, .3), cook = .6 + .4 * easeIn(inv(T2.pi, T2.go + .1, t)), land = inv(T2.di - .05, T2.di + .2, t);
  dapur(ctx, t, cam, { fire, heat: .6, wc: lerp(.3, .55, inv(T2.bw, T2.di, t)), wn: t < T2.di ? 18 : 3, stir: stirK,
    fB: EM(t, [[ls(2), 'ngeden', { look: [-.7, .5] }], [T2.bw, { eyes: 'squint', mouth: 'flat', sweat: 1 }]], 3),
    armsB: knob < 1 && t < T2.bw - .1 ? { R: armTo(BGL.budi, -1, lerp(he[0], kx + 20, knob), lerp(he[1], ky, knob), -1), L: [.3, -.3] } : { R: armTo(BGL.budi, -1, he[0], he[1], -1), L: [.3, -.3] },
    serok: t < T2.di ? [sx, sy, .8, .3, { c: .5, n: 6 }] : null,
    pile: land > 0 ? { c: cook, n: Math.round(26 * land), seed: 5, smoke: inv(T2.go - .2, T2.la, t), face: EF(t, [[T2.di, 'cemas'], [T2.go + .1, { eyes: 'x', mouth: 'wobble' }]], 4) } : null });
  if (t < T2.bw) { const kp = toScreen(cam, kx, ky); sfxS(ctx, 'KLIK', kp[0], kp[1] - 90, 64, win(t, T2.dk - .1, T2.bw), '#fff', -.1); }
  tagSeq(ctx, t, [['API KECIL', T2.dk - .05, T2.da, '#9fd3ff', 116], ['DIADUK TERUS', T2.da - .05, T2.di, '#fff', 104], ['GOSONG LAGI!', T2.go - .05, null, '#ff8a5a', 120]]);
});

// ===== 3 Padahal Ibu titip satu toples buat arisan sore ini =====
const T3 = { pa: wt(3, 'padahal'), ib: wt(3, 'ibu'), ti: wt(3, 'titip'), sa: wt(3, 'satu'), to: wt(3, 'toples'), bu: wt(3, 'buat'), ar: wt(3, 'arisan'), so: wt(3, 'sore'), in: wt(3, 'ini') };
const IX3 = -640;
SH(ls(3), ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(3), { x: -380, y: 1080, z: 1.2 }], [T3.to, { x: -440, y: 1090, z: 1.4 }, ease], [ls(4), { x: -460, y: 1100, z: 1.48 }, easeIn]], 2);
  const pt = inv(T3.ti - .1, T3.ti + .2, t), jg = inv(T3.to - .1, T3.to + .3, t);
  dapur(ctx, t, cam, { plate: false, jarGlow: jg * (1 - inv(T3.ar, T3.so, t) * .5), jarFace: EF(t, [[ls(3), 'netral', { look: [-.4, -.2] }], [T3.ar, 'cemas']], 5),
    fI: EM(t, [[ls(3), 'netral', { look: [.7, .1] }], [T3.ti, 'curiga', { look: [.7, .4] }], [T3.so, 'sombong', { look: [.5, -.1] }]], 6), ix: IX3, flipI: 1,
    armsI: { R: pt > 0 ? armTo(IX3, 1, lerp(IX3 + 120, JR[0] - 60, pt), lerp(1250, 1120, pt), 1) : [.3, -.3], L: [.3, -.3] },
    fR: EF(t, [[ls(3), 'netral', { look: [-.7, .2] }], [T3.ar, 'kaget', { look: [-.7, .2] }]], 7), rx: BGL.rani, flipR: -1 });
  tagSeq(ctx, t, [['1 TOPLES', T3.sa - .05, T3.bu, '#ffd23a', 120], ['ARISAN SORE INI!', T3.ar - .05, null, '#ff9ad0', 104]]);
});

// ===== 4 Bawangnya tinggal segenggam =====
const T4 = { bw: wt(4, 'bawangnya'), ti: wt(4, 'tinggal'), se: wt(4, 'segenggam') };
SH(ls(4), ls(5), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(4), { x: BWK[0] + 20, y: 1200, z: 1.9 }], [T4.se, { x: BWK[0], y: 1215, z: 2.3 }, easeOut], [ls(5), { x: BWK[0], y: 1215, z: 2.4 }, easeIn]], 3);
  const n = Math.round(lerp(30, 6, easeInOut(inv(T4.bw, T4.se + .2, t))));
  dapur(ctx, t, cam, { plate: false, bowlN: n, bowlFace: EF(t, [[ls(4), 'cemas', { look: [0, -.5] }], [T4.se, { eyes: 'wide', mouth: 'wobble', sweat: 1 }]], 8) });
  tagSeq(ctx, t, [['TINGGAL...', T4.ti - .05, T4.se, '#fff', 116], ['SEGENGGAM!', T4.se - .05, null, '#ff8a8a', 124]]);
});

// ===== 5 Ibu turun tangan, dan langsung ngangkat bawangnya waktu masih kuning muda =====
const T5 = { ib: wt(5, 'ibu'), tu: wt(5, 'turun'), ta: wt(5, 'tangan'), da: wt(5, 'dan'), la: wt(5, 'langsung'), ng: wt(5, 'ngangkat'), bw: wt(5, 'bawangnya'), wa: wt(5, 'waktu'), ma: wt(5, 'masih'), ku: wt(5, 'kuning'), mu: wt(5, 'muda') };
function ibuSerok(t, t0, t1) { const up = easeOut(inv(t0, t1, t)); const x = WK[0] - 20 + (up < .01 ? Math.sin(t * 7) * 40 : 0), y = 1138 - 170 * up; return { x, y, up }; }
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 560, y: 1090, z: 1.0 }], [T5.ng, { x: 600, y: 1060, z: 1.15 }, ease], [T5.ma, { x: 750, y: 1030, z: 1.45 }, easeInOut], [ls(6), { x: 760, y: 1025, z: 1.52 }, easeIn]], 2);
  const walk = easeOut(inv(ls(5), T5.ta, t)), ix = lerp(1350, BGL.ibu, walk), sp = ibuSerok(t, T5.ng - .2, T5.bw + .1), he = handleEnd(sp.x, sp.y, .8, .3);
  dapur(ctx, t, cam, { fire: .5, wc: .3, wn: sp.up > .5 ? 3 : 18, stir: sp.up > 0 ? 0 : 1,
    fI: EM(t, [[ls(5), 'netral', { look: [-.8, .4] }], [T5.ng, 'licik', { look: [-.7, .5] }]], 9), ix, iExtra: { bob: walk < 1 ? Math.abs(Math.sin(t * 14)) * -.02 : 0 },
    armsI: walk > .8 ? { R: armTo(ix, -1, he[0], he[1], -1), L: [.3, -.3] } : null,
    fB: EF(t, [[ls(5), 'cemas', { look: [.7, .2] }], [T5.ma + .05, 'kaget', { look: [.8, -.2] }]], 10), bx: BGL.budiL, flipB: 1,
    fR: EF(t, [[ls(5), 'curiga', { look: [.8, .1] }], [T5.ma + .12, 'kaget', { look: [.8, -.2] }]], 11), rx: BGL.rani, flipR: 1,
    serok: walk > .8 ? [sp.x, sp.y, .8, .3, { c: .35, n: sp.up > .3 ? 20 : 0, drip: sp.up > .5 ? 1 : 0 }] : null, pile: { c: 1, n: 14, seed: 5, smoke: .3 } });
  tagSeq(ctx, t, [['IBU TURUN TANGAN', T5.tu - .05, T5.la, '#ff9ad0', 96], ['LANGSUNG ANGKAT', T5.la - .05, T5.ma, '#fff', 104], ['MASIH KUNING MUDA?!', T5.ma - .05, null, '#fff2a8', 92]]);
});

// ===== 6 "Bu, itu belum mateng!" =====
const T6 = { bu: wt(6, 'bu'), it: wt(6, 'itu'), be: wt(6, 'belum'), ma: wt(6, 'mateng') };
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(6), { x: 300, y: 1160, z: 1.6 }], [ls(7), { x: 290, y: 1170, z: 1.7 }]], 3);
  blurLayer(ctx, c => dapur(c, t, cam, { fire: 0, heat: .2, wn: 3, pile: { c: .35, n: 30, seed: 9, face: EXPR.netral } }), 7);
  scr(ctx, c => {
    const pt = inv(T6.it - .1, T6.it + .15, t), sh = Math.sin(t * 30) * 6 * inv(T6.be, T6.be + .1, t);
    drawStick(c, C(BUDI, { x: 860 + sh, y: 2250, s: 1800, shadow: false, flip: -1, armLen: 1.3, headTilt: .04,
      arms: { L: [.3, -.2], R: pt > 0 ? reach(860, 2250, 1800, -1, 380, 1180, -1) : [.3, -.2] },
      face: EC(t, [[ls(6), 'kaget', { look: [-.7, .3] }], [T6.be, { eyes: 'wide', mouth: 'o', browUp: .5, look: [-.8, .4] }]], 12) }));
  });
  tagSeq(ctx, t, [['BU!', T6.bu - .05, T6.it, '#fff', 140], ['BELUM MATENG!', T6.it - .05, null, '#fff2a8', 110]]);
});

// ===== 7 Tapi di piring, bawang Ibu pelan-pelan berubah jadi kuning emas =====
const T7 = { ta: wt(7, 'tapi'), pi: wt(7, 'piring'), bw: wt(7, 'bawang'), ib: wt(7, 'ibu'), pe: wt(7, 'pelanpelan'), be: wt(7, 'berubah'), ja: wt(7, 'jadi'), ku: wt(7, 'kuning'), em: wt(7, 'emas') };
SH(ls(7), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(7), { x: 250, y: 1150, z: 1.8 }], [T7.pe, { x: 230, y: 1170, z: 2.0 }, ease], [T7.em, { x: 220, y: 1180, z: 2.25 }, ease], [ls(8), { x: 220, y: 1180, z: 2.3 }, easeIn]], 1.5);
  const cook = .35 + .25 * easeInOut(inv(T7.pi, T7.em + .1, t));
  dapur(ctx, t, cam, { fire: 0, heat: .2, wn: 3, jam: 3.5 + 2 * inv(T7.pi, T7.em, t), fast: t > T7.pi && t < T7.em ? 1 : 0,
    fB: EF(t, [[ls(7), 'curiga', { look: [-.3, .6] }], [T7.em, 'kaget', { look: [-.3, .7] }]], 13), bx: BGL.budiL + 60, flipB: 1,
    pile: { c: cook, n: 30, seed: 9, heat: inv(T7.pi, T7.pe, t) * (1 - inv(T7.em, T7.em + .4, t) * .6), face: EF(t, [[ls(7), 'netral', { look: [.3, -.3] }], [T7.em, 'bangga']], 14) } });
  scr(ctx, c => { const p = toScreen(cam, PL[0] + 40, PL[1] - 140); glint(c, p[0], p[1], 70, t, T7.em); });
  tagSeq(ctx, t, [['PELAN-PELAN...', T7.pe - .05, T7.ku, '#fff', 104], ['KUNING EMAS!', T7.ku - .05, null, '#ffc23a', 124]]);
});

// ===== 8 Ternyata bawang goreng tetap mateng, walaupun sudah keluar dari wajan =====
const T8 = { te: wt(8, 'ternyata'), tt: wt(8, 'tetap'), ma: wt(8, 'mateng'), wa: wt(8, 'walaupun'), su: wt(8, 'sudah'), ke: wt(8, 'keluar'), da: wt(8, 'dari'), wj: wt(8, 'wajan') };
const cam8 = t => CK(t, [[ls(8), { x: 230, y: 1180, z: 2.1 }], [T8.wa, { x: 420, y: 1130, z: 1.25 }, easeInOut], [T8.wj, { x: 430, y: 1130, z: 1.2 }, ease], [ls(9), { x: 300, y: 1220, z: 1.6 }, easeIn]], 2);
SH(ls(8), ls(9), { tr: 'portal', zoomOut: { x: 540, y: 1000, w: 450, h: 800 } }, (ctx, lt, t) => {
  const cam = cam8(t), arw = easeOut(inv(T8.ke - .1, T8.wj + .2, t));
  dapur(ctx, t, cam, { fire: 0, heat: .15, wn: 3,
    fI: EF(t, [[ls(8), 'licik', { look: [-.8, .4] }]], 15), fB: EF(t, [[ls(8), 'kaget', { look: [-.3, .6] }], [T8.ma, 'sadar', { look: [.4, .3] }]], 16), bx: BGL.budiL, flipB: 1,
    fR: EF(t, [[ls(8), 'kaget', { look: [.8, .2] }]], 17), rx: BGL.rani, flipR: 1,
    pile: { c: .6, n: 30, seed: 9, heat: 1, face: EF(t, [[ls(8), 'bangga']], 18) },
    extra: c => { if (arw > 0) { c.save(); c.globalAlpha = arw; c.setLineDash([22, 18]); c.lineWidth = 12; c.strokeStyle = '#fff'; c.beginPath(); c.moveTo(WK[0] - 120, 1040); c.quadraticCurveTo(420, 860 - 40 * arw, PL[0] + 40, 1120); c.stroke(); c.setLineDash([]); c.restore(); } } });
  scr(ctx, c => { const p = toScreen(cam, PL[0], PL[1] - 80); innerGlow(c, p[0], p[1], 80 * cam.z, .35 + .15 * Math.sin(t * 6), t); });
  tagSeq(ctx, t, [['TETAP MATENG!', T8.tt - .05, T8.wa, '#ffc23a', 116], ['DI LUAR WAJAN', T8.ke - .05, null, '#fff', 110]]);
});

// ===== 9 Irisannya masih nyimpan panas, dan minyak panas yang nempel terus masak dia (dunia mikro) =====
const T9 = { ir: wt(9, 'irisannya'), ny: wt(9, 'nyimpan'), pa: wt(9, 'panas'), mi: wt(9, 'minyak'), p2: wt(9, 'panas', 0, 1), ne: wt(9, 'nempel'), te: wt(9, 'terus'), ma: wt(9, 'masak'), di: wt(9, 'dia') };
const OILP = [[-.9, -.5], [.95, -.3], [-.55, .62], [.6, .7], [0, -.95], [-.98, .2]];
SH(ls(9), ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  scr(ctx, c => {
    const z = lerp(1.12, 1.0, easeOut(inv(ls(9), ls(9) + 1, t))) + .04 * inv(T9.te, ls(10), t); c.translate(540, 900); c.scale(z, z); c.translate(-540, -900);
    const hot = inv(T9.ny - .1, T9.pa + .3, t), cook = .6 + .1 * inv(T9.te, T9.di + .3, t);
    mikroBawangBG(c, t, hot * .8);
    drawIrisGoreng(c, 540, 900, 420, -.15, cook, { lw: 14 });
    if (hot > 0) { innerGlow(c, 540, 900, 380, hot * (.8 + .2 * Math.sin(t * 8)), t); glowRing(c, 540, 900, 440, hot * .8); }
    propFace(c, 540, 1130, 260, EF(t, [[ls(9), 'netral', { look: [0, -.4] }], [T9.pa, { eyes: 'squint', mouth: 'wobble', sweat: 1 }], [T9.ma, 'meringis']], 19), { t });
    const oin = inv(T9.mi - .2, T9.ne + .2, t);
    OILP.forEach(([ox, oy], i) => { const q = clamp(oin * 1.5 - i * .1); if (q <= 0) return; const tx = 540 + ox * 390, ty = 900 + oy * 290, fx = 540 + ox * 900, fy = 900 + oy * 900;
      const x = lerp(fx, tx, easeOut(q)), y = lerp(fy, ty, easeOut(q)), push = inv(T9.te - .1, T9.te + .3, t);
      drawTetesMinyak(c, x, y, 62, { t: t + i, hot: push, face: i < 3 ? EF(t, [[T9.mi, 'licik', { look: [-ox, -oy] }], [T9.te + i * .06, 'ngeden']], 20 + i) : null });
      if (push > 0) pushArrow(c, x - ox * 40, y - oy * 40, Math.atan2(-oy, -ox), 90, push);
      if (q >= 1 && (t * 4 + i) % 1 < .5) sfxText(c, 'CESS', x + 50, y - 80, 40, 1, '#fff', -.1); });
  });
  tagSeq(ctx, t, [['NYIMPAN PANAS', T9.ny - .05, T9.mi, '#ff9f5a', 104], ['MINYAK NEMPEL', T9.mi - .05, T9.te, '#ffd23a', 104], ['TERUS MASAK!', T9.te - .05, null, '#fff', 116]], 260);
});

// ===== 10 Sama kayak setrika yang sudah dicabut: masih bisa bikin baju gosong =====
const T10 = { sa: wt(10, 'sama'), ka: wt(10, 'kayak'), se: wt(10, 'setrika'), su: wt(10, 'sudah'), di: wt(10, 'dicabut'), ma: wt(10, 'masih'), bi: wt(10, 'bisa'), bk: wt(10, 'bikin'), ba: wt(10, 'baju'), go: wt(10, 'gosong') };
SH(ls(10), ls(11), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(10), { x: 540, y: 980, z: 1.05, r: -.04 }], [T10.di, { x: 560, y: 960, z: 1.12, r: -.02 }, ease], [ls(11), { x: 560, y: 980, z: 1.2, r: 0 }, easeIn]], 2);
  lantaiAtasBG(ctx, cam);
  inCam(ctx, cam, c => {
    drawPapanSetrika(c, 540, 1000, 1);
    const lift = easeInOut(inv(T10.bk - .2, T10.ba + .1, t)), ix = 520 + 260 * lift, iy = 880 - 180 * lift, burn = inv(T10.bk, T10.go + .1, t);
    drawKaosAtas(c, 540, 960, 1.1, { burn, burnX: -20, burnY: -80, burnRot: -Math.PI / 2 });
    const pl = easeOut(inv(T10.di - .15, T10.di + .25, t)), plug = [lerp(700, 1250, pl), lerp(560, 330, pl)];
    drawCord(c, [ix, iy - 175], plug, 80); drawPlug(c, plug[0], plug[1], 1.2, -.4 - pl, 1);
    c.save(); c.translate(ix + 20 * lift, iy + 30 * lift); c.globalAlpha = .25 * lift; ellipse(c, 0, 0, 150, 220); c.fillStyle = '#000'; c.fill(); c.restore();
    drawSetrika(c, ix, iy, 1 + .12 * lift, -Math.PI / 2, { hot: 1, t, face: EF(t, [[ls(10), 'netral', { look: [.3, .4] }], [T10.ma, 'licik', { look: [.5, .5] }]], 23) });
    if (burn > .3) for (let i = 0; i < 3; i++) { const q = (t * .6 + i * .33) % 1; puff(c, 520 - 40 + i * 40, 880 - q * 300, 40 + q * 40, t, BGP.smoke, 3 + i, (1 - q) * .7 * burn); }
  });
  tagSeq(ctx, t, [['SETRIKA', T10.se - .05, T10.di, '#9fd3ff', 116], ['DICABUT!', T10.di - .05, T10.bi, '#fff', 120], ['TETAP GOSONG!', T10.go - .05, null, '#ff8a5a', 116]]);
});

// ===== 11 Jadi angkat waktu masih kuning muda, matengnya nanti di piring =====
const T11 = { ja: wt(11, 'jadi'), an: wt(11, 'angkat'), wa: wt(11, 'waktu'), ma: wt(11, 'masih'), ku: wt(11, 'kuning'), mu: wt(11, 'muda'), mt: wt(11, 'matengnya'), na: wt(11, 'nanti'), pi: wt(11, 'piring') };
SH(ls(11), ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(11), { x: 770, y: 1060, z: 1.4 }], [T11.mu, { x: 760, y: 1040, z: 1.48 }, ease], [T11.mt + .2, { x: 250, y: 1170, z: 1.8 }, easeInOut], [ls(12), { x: 240, y: 1175, z: 1.9 }, easeIn]], 2);
  const sp = ibuSerok(t, T11.an - .2, T11.ku), he = handleEnd(sp.x, sp.y, .8, .3), land = inv(T11.mt - .1, T11.mt + .2, t), cook = .35 + .25 * easeInOut(inv(T11.na, T11.pi + .2, t));
  dapur(ctx, t, cam, { fire: .5, wc: .3, wn: sp.up > .5 ? 3 : 18, stir: sp.up > 0 ? 0 : 1,
    fI: EM(t, [[ls(11), 'licik', { look: [-.7, .5] }], [T11.mu, 'bangga', { look: [-.6, .2] }]], 24), armsI: { R: armTo(BGL.ibu, -1, he[0], he[1], -1), L: [.3, -.3] },
    serok: t < T11.mt ? [sp.x, sp.y, .8, .3, { c: .35, n: sp.up > .3 ? 20 : 0, drip: sp.up > .5 ? 1 : 0 }] : null,
    pile: land > 0 ? { c: cook, n: 30, seed: 9, heat: .7, face: EF(t, [[T11.mt, 'netral'], [T11.pi, 'bangga']], 25) } : null });
  inCam(ctx, cam, c => { const k1 = backOut(inv(T11.ku, T11.ku + .25, t)) * (1 - inv(T11.mt, T11.mt + .2, t)); if (k1 > 0) { c.save(); c.translate(sp.x + 150, sp.y - 130); c.scale(k1, k1); drawCheck(c, 0, 0, 56); c.restore(); }
    const k2 = backOut(inv(T11.pi, T11.pi + .25, t)); if (k2 > 0) { c.save(); c.translate(PL[0] + 160, PL[1] - 220); c.scale(k2, k2); drawCheck(c, 0, 0, 50); c.restore(); } });
  tagSeq(ctx, t, [['ANGKAT', T11.an - .05, T11.ma, '#fff', 124], ['KUNING MUDA', T11.ma - .05, T11.mt, '#fff2a8', 116], ['MATENG DI PIRING', T11.mt - .05, null, '#ffc23a', 100]]);
});

// ===== 12a Arisan selamat =====
const T12 = { ar: wt(12, 'arisan'), se: wt(12, 'selamat'), be: wt(12, 'besoknya'), bu: wt(12, 'budi'), go: wt(12, 'goreng'), sn: wt(12, 'sendiri'), la: wt(12, 'lagi'), da: wt(12, 'dan') };
SH(ls(12), T12.be, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(12), { x: -420, y: 1070, z: 1.3 }], [T12.be, { x: -440, y: 1080, z: 1.4 }, ease]], 2);
  const fill = easeOut(inv(ls(12) - .1, T12.se, t));
  dapur(ctx, t, cam, { plate: false, jar: .2 + .7 * fill, jarGlow: inv(T12.se - .1, T12.se + .2, t), jarFace: EF(t, [[ls(12), 'bangga']], 26),
    fI: EF(t, [[ls(12), 'bangga', { look: [.6, .2] }]], 27), ix: IX3, flipI: 1, armsI: { R: [2.5, .3], L: [.3, -.3] },
    fR: EF(t, [[ls(12), 'lega', { look: [-.7, .2] }]], 28), rx: BGL.rani, flipR: -1 });
  scr(ctx, c => { const k = inv(T12.se - .1, T12.se + .3, t); if (k > 0) for (let i = 0; i < 6; i++) star5(c, 300 + i * 100 + Math.sin(t * 3 + i) * 10, 700 - Math.abs(Math.sin(i * 1.7)) * 120, 26 * k, t + i); });
  tagSeq(ctx, t, [['ARISAN SELAMAT!', T12.ar - .05, null, '#9dff7a', 108]]);
});
// ===== 12b Besoknya, Budi goreng sendiri lagi, =====
SH(T12.be, T12.da, { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = CK(t, [[T12.be, { x: 820, y: 1110, z: 1.35 }], [T12.la, { x: 720, y: 1090, z: 1.55 }, ease], [T12.da, { x: 640, y: 1085, z: 1.7 }, easeIn]], 2);
  const sx = WK[0] - 20 + Math.sin(t * 5) * 40, he = handleEnd(sx, 1138, .8, .3);
  dapur(ctx, t, cam, { fire: 1, wc: .5, wn: 20, stir: 1, spots: .2, jam: 9,
    fB: EM(t, [[T12.be, 'sombong', { look: [-.7, .4] }], [T12.la, 'licik', { look: [-.8, .5] }]], 29), armsB: { R: armTo(BGL.budi, -1, he[0], he[1], -1), L: [.3, -.3] },
    serok: [sx, 1138, .8, .3, { c: .5, n: 0 }] });
  tagSeq(ctx, t, [['BESOKNYA...', T12.be - .05, T12.la, '#fff', 116]]);
});
// ===== 12c dan -> komposisi frame 0 (loop) =====
SH(T12.da, ENDT, { tr: 'whip' }, (ctx, lt, t) => {
  const tl = t - ENDT + 1 / 30;
  hookScene(ctx, t, cam0(tl), tl);
});
