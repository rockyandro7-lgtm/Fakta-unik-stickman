// ---------- Fakta Unik: "Laron = rayap bersayap" (~59 dtk, tanpa CTA) ----------
// Bentuk cerita kesepuluh: "taruhan tebak-tebakan" (Budi: anak capung, Rani: ngengat; yang kalah nyapu sayap). Ibu: dua-duanya salah, itu rayap.
// Ruang tengah = rumahBG (env_jemur.js), malam hujan. Aset baru env_laron.js. Loop: shot terakhir = hook dengan waktu negatif.
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
const sfxS = (ctx, ...a) => scr(ctx, c => sfxText(c, ...a));
const win = (t, a, b, f = .15) => inv(a, a + f, t) * (1 - inv(b - .1, b, t));
const tagSeq = (ctx, t, list, y = 330) => list.forEach(([str, a, b, col, size]) => scrTag(ctx, str, inv(a, a + .15, t) * (b == null ? 1 : 1 - inv(b - .1, b, t)), col || '#fff', y, size || 104));
const inCam = (ctx, cam, f) => { ctx.save(); applyCam(ctx, cam, 1); f(ctx); ctx.restore(); };
const BX = LR.budi, RX0 = LR.rani, LX = LR.lamp[0], LY = LR.lamp[1];
const lookUp = { look: [0, -.8] };
// sayap yang copot dan melayang turun (periodik, aman untuk waktu negatif)
function sayapJatuh(ctx, t, n = 8, k = 1) {
  if (k <= 0) return;
  for (let i = 0; i < n; i++) { const P = 1.7, q = (((t + i * .37) % P) + P) % P / P, x0 = LX - 260 + (i * 97) % 520;
    drawSayap(ctx, x0 + Math.sin(q * 9 + i) * 50, LY + 60 + q * (JL.floor + 120 - LY), .9, Math.sin(q * 7 + i) * 1.2 + i, k * (q < .9 ? 1 : (1 - q) * 10)); }
}
// ruangan malam + lampu + kawanan. o: { swarm 0..1, wallOn 0..1, dark 0..1, wings (jumlah sayap di lantai), fall 0..1, basin: {n, ripple}, fB, armsB, bx, fR, armsR, rx, fI, armsI, ix, ibuExtra, extra(c), after(c) }
function ruang(ctx, t, cam, o = {}) {
  rumahBG(ctx, t, cam, { rain: 1, jam: 9, night: 1 });
  drawLampuDinding(ctx, LR.wallLamp[0], LR.wallLamp[1], 1, o.wallOn == null ? 1 : o.wallOn);
  sayapLantai(ctx, o.wings == null ? 16 : o.wings);
  if (o.basin) drawBaskom(ctx, LR.basin[0], LR.basin[1], .9, Object.assign({ t }, o.basin));
  if (o.fI) tokoh(ctx, t, IBU, o.ix == null ? LR.ibu : o.ix, o.fI, o.armsI, o.flipI || 1, o.ibuExtra || {});
  if (o.fB) tokoh(ctx, t, BUDI, o.bx == null ? BX : o.bx, o.fB, o.armsB, 1, o.bExtra || {});
  if (o.fR) tokoh(ctx, t, RANI, o.rx == null ? RX0 : o.rx, o.fR, o.armsR, -1, o.rExtra || {});
  if (o.extra) o.extra(ctx);
  drawLampu(ctx, LX, LY, 1, { on: 1, sway: Math.sin(t * 1.3) * .02 });
  laronSwarm(ctx, LX, LY, t, o.swarm == null ? 1 : o.swarm);
  sayapJatuh(ctx, t, 8, o.fall == null ? 1 : o.fall);
  if (o.after) o.after(ctx);
  gelapRuang(ctx, cam, o.dark == null ? .55 : o.dark, [[LX, LY, 650, 1], [LR.wallLamp[0], LR.wallLamp[1], 420, o.wallOn == null ? 1 : o.wallOn]]);
}

// ===== 0 HOOK: ratusan laron nyerbu lampu, terus sayapnya copot sendiri =====
const H0 = { ra: wt(0, 'ratusan'), la: wt(0, 'laron'), ny: wt(0, 'nyerbu'), lp: wt(0, 'lampu'), te: wt(0, 'terus'), sa: wt(0, 'sayapnya'), co: wt(0, 'copot'), se: wt(0, 'sendiri') };
const cam0 = tl => CK(tl, [[-3, { x: 540, y: 900, z: 1.32 }], [0, { x: 540, y: 880, z: 1.35 }, easeOut], [H0.lp, { x: 540, y: 820, z: 1.6 }, ease], [H0.sa, { x: 540, y: 980, z: 1.3 }, ease], [ls(1), { x: 520, y: 1000, z: 1.25 }, easeIn]], 2);
function hookScene(ctx, t, cam, tl) {
  ruang(ctx, tl, cam, {
    fB: EM(tl, [[-9, 'takjub', lookUp], [H0.co, 'kaget', { look: [.2, .6] }]], 1), armsB: { R: armTo(BX, 1, BX + 130, 1000, -1), L: [.3, -.3] },
    fR: EM(tl, [[-9, 'cemas', { look: [0, -.8] }], [H0.co + .1, 'curiga', { look: [-.2, .6] }]], 2), armsR: { R: [.3, -.3], L: [.3, -.3] } });
}
SH(0, ls(1), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  tagSeq(ctx, t, [['RATUSAN LARON', -.2, H0.sa, '#ffd23a', 100], ['SAYAP COPOT?!', H0.sa, null, '#fff', 110]], 300);
  sfxS(ctx, 'BRRRR', 800, 560, 70, win(t, -.2, H0.sa), '#fff', .1);
});

// ===== 1a Budi: "Itu anak capung!" =====
const T1 = { bu: wt(1, 'budi'), ya: wt(1, 'yakin'), an: wt(1, 'anak'), ca: wt(1, 'capung'), ra: wt(1, 'rani'), ny: wt(1, 'nyela'), ng: wt(1, 'ngaco'), ngg: wt(1, 'ngengat') };
const bubble = (c, x, y, r, k, draw) => { if (k <= 0) return; const b = backOut(clamp(k)); c.save(); c.translate(x, y); c.scale(b, b); circle(c, 0, 0, r); fillStroke(c, '#ffffff', 8); circle(c, -r * .55, r * 1.05, r * .14); fillStroke(c, '#ffffff', 6); circle(c, -r * .8, r * 1.35, r * .08); fillStroke(c, '#ffffff', 5); draw(c); c.restore(); };
SH(ls(1), T1.ra, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(1), { x: 330, y: 1050, z: 1.8 }], [T1.ca, { x: 320, y: 1040, z: 1.95 }, ease], [T1.ra, { x: 320, y: 1040, z: 2.0 }, easeIn]], 2);
  ruang(ctx, t, cam, { fB: EM(t, [[ls(1), 'sombong', { look: [.6, -.5] }], [T1.ca, 'bangga']], 3), armsB: { R: [2.6, .3], L: crossArmsL() }, fR: EF(t, [[ls(1), 'curiga', { look: [-.8, 0] }]], 4) });
  scr(ctx, c => bubble(c, 700, 560, 170, inv(T1.an - .1, T1.an + .15, t), c2 => drawCapung(c2, 0, 0, 1, t)));
  tagSeq(ctx, t, [['ANAK CAPUNG!', T1.an, null, '#9dff7a', 110]], 300);
});
function crossArmsL() { return [.3, -.3]; }
// ===== 1b Rani: "Ngaco, itu ngengat!" =====
SH(T1.ra, ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[T1.ra, { x: 760, y: 1050, z: 1.8 }], [T1.ngg, { x: 770, y: 1040, z: 1.95 }, ease], [ls(2), { x: 775, y: 1040, z: 2.0 }, easeIn]], 2);
  ruang(ctx, t, cam, { fB: EF(t, [[T1.ra, 'bangga']], 5), fR: EM(t, [[T1.ra, 'datar', { look: [-.8, 0] }], [T1.ng, 'licik'], [T1.ngg, 'sombong', { look: [-.6, -.4] }]], 6), armsR: { R: [2.5, .4], L: [.3, -.3] } });
  scr(ctx, c => { bubble(c, 380, 560, 170, inv(T1.ngg - .15, T1.ngg + .1, t), c2 => drawNgengat(c2, 0, 10, .9, t)); if (t > T1.ng) drawX(c, 380, 1500, 0, 0); });
  tagSeq(ctx, t, [['NGACO!', T1.ng - .05, T1.ngg, '#ff8a8a', 120], ['NGENGAT!', T1.ngg, null, '#ffd23a', 120]], 300);
});

// ===== 2 Taruhannya: yang kalah nyapu sayap laron sekamar =====
const T2 = { ta: wt(2, 'taruhannya'), ka: wt(2, 'kalah'), ny: wt(2, 'nyapu'), sa: wt(2, 'sayap'), se: wt(2, 'sekamar') };
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(2), { x: 540, y: 1150, z: 1.45 }], [T2.ny, { x: 540, y: 1300, z: 1.35 }, ease], [T2.se, { x: 540, y: 1350, z: 1.15 }, ease], [ls(3), { x: 540, y: 1340, z: 1.12 }, easeIn]], 2);
  const shake = inv(T2.ta - .1, T2.ta + .2, t) * (1 - inv(T2.ka, T2.ka + .2, t));
  ruang(ctx, t, cam, { wings: Math.round(lerp(16, 60, inv(T2.sa, T2.se + .3, t))),
    fB: EF(t, [[ls(2), 'licik', { look: [.8, 0] }]], 7), armsB: { R: armTo(BX, 1, 540, 1230 + shake * Math.sin(t * 30) * 20, -1), L: [.3, -.3] },
    fR: EF(t, [[ls(2), 'licik', { look: [-.8, 0] }]], 8), armsR: { R: armTo(RX0, -1, 545, 1230 + shake * Math.sin(t * 30) * 20, -1), L: [.3, -.3] },
    after: c => { const k = backOut(inv(T2.ny - .1, T2.ny + .2, t)); if (k > 0) drawSapu(c, 540, 1390, 1.1 * k + .01, .3, { spread: .3 }); } });
  tagSeq(ctx, t, [['TARUHAN!', ls(2) - .1, T2.ka, '#fff', 120], ['KALAH = NYAPU', T2.ka, null, '#ffd23a', 110]], 300);
});

// ===== 3 Ibu naruh baskom air di bawah lampu, terus matiin lampu yang lain =====
const T3 = { ib: wt(3, 'ibu'), na: wt(3, 'naruh'), ba: wt(3, 'baskom'), ai: wt(3, 'air'), bw: wt(3, 'bawah'), lp: wt(3, 'lampu'), te: wt(3, 'terus'), ma: wt(3, 'matiin'), la: wt(3, 'lain') };
const IX3 = t => lerp(-320, 340, easeOut(inv(ls(3) - .3, T3.bw, t)));
SH(ls(3), ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(3), { x: 330, y: 1150, z: 1.35 }], [T3.bw, { x: 480, y: 1180, z: 1.3 }, ease], [T3.ma, { x: 300, y: 1050, z: 1.2 }, ease], [ls(4), { x: 330, y: 1000, z: 1.25 }, easeIn]], 2);
  const ix = IX3(t), wc = walkCycle(ix + 320, 600, 1), walking = t < T3.bw, place_ = easeInOut(inv(T3.bw - .2, T3.lp + .2, t)), off = 1 - inv(T3.ma, T3.ma + .15, t);
  const bas = [lerp(ix + 120, LR.basin[0], place_), lerp(1330, LR.basin[1], place_)];
  ruang(ctx, t, cam, { wallOn: off, dark: lerp(.55, .85, 1 - off), bx: 60, rx: 900,
    fB: EF(t, [[ls(3), 'curiga', { look: [.8, 0] }]], 9), fR: EF(t, [[ls(3), 'curiga', { look: [-.8, 0] }]], 10),
    fI: EM(t, [[ls(3), 'netral', { look: [.8, 0] }], [T3.ma, 'sombong', { look: [-.8, -.3] }]], 11), ix,
    armsI: walking ? { L: wc.arms.L, R: armTo(ix, 1, bas[0] - 20, bas[1] - 150, 1) } : (t < T3.ma ? { R: armTo(ix, 1, bas[0] - 120, bas[1] - 140, 1), L: [.3, -.3] } : { L: armTo(ix, 1, LR.wallLamp[0] + 60, LR.wallLamp[1] + 30, -1), R: [.3, -.3] }),
    ibuExtra: walking ? { legs: wc.legs, bob: wc.bob, lean: wc.lean, footDir: 1 } : {},
    extra: c => drawBaskom(c, bas[0], bas[1], .9, { t, ripple: place_ >= 1 }) });
  tagSeq(ctx, t, [['BASKOM AIR', T3.ba - .1, T3.ma, '#bfe9ff', 110], ['LAMPU LAIN: MATI', T3.ma, null, '#fff', 92]], 300);
  sfxS(ctx, 'KLIK', 260, 640, 80, win(t, T3.ma, ls(4) + .5), '#fff', -.1);
});

// ===== 4a Laron berjatuhan ke air =====
const T4 = { la: wt(4, 'laron'), be: wt(4, 'berjatuhan'), ai: wt(4, 'air'), ib: wt(4, 'ibu'), cu: wt(4, 'cuma'), bi: wt(4, 'bilang'), du: wt(4, 'duaduanya'), sa: wt(4, 'salah'), it: wt(4, 'itu'), ra: wt(4, 'rayap') };
SH(ls(4), T4.ib, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(4), { x: 540, y: 1300, z: 1.9 }], [T4.ai, { x: 540, y: 1420, z: 2.2 }, ease], [T4.ib, { x: 540, y: 1430, z: 2.25 }, easeIn]], 2);
  const n = Math.round(lerp(0, 12, inv(T4.be, T4.ib, t)));
  ruang(ctx, t, cam, { wallOn: 0, dark: .85, basin: { n, ripple: true }, fI: EF(t, [[ls(4), 'sombong']], 12), ix: 340, bx: 60, rx: 900, fB: EXPR.takjub, fR: EXPR.takjub,
    after: c => { for (let i = 0; i < 5; i++) { const q = ((t * 1.1 + i / 5) % 1); drawLaron(c, LX - 120 + i * 60 + Math.sin(q * 6) * 20, lerp(LY + 100, LR.basin[1] - 110, q), .8, { t: t + i, rot: Math.PI / 2 + Math.sin(q * 8) * .5, flap: 1 - q }); } } });
  sfxS(ctx, 'PLUNG!', 760, 700, 90, win(t, T4.ai - .2, T4.ib + .5), '#bfe9ff', -.1);
  tagSeq(ctx, t, [['BERJATUHAN', T4.be - .05, null, '#bfe9ff', 110]], 300);
});
// ===== 4b Ibu: "Dua-duanya salah. Itu rayap." =====
SH(T4.ib, ls(5), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[T4.ib, { x: 420, y: 1050, z: 1.9 }], [T4.du, { x: 400, y: 1050, z: 2.05 }, ease], [T4.ra, { x: 380, y: 1060, z: 2.2 }, ease], [ls(5), { x: 380, y: 1060, z: 2.25 }, easeIn]], 2);
  ruang(ctx, t, cam, { wallOn: 0, dark: .7, basin: { n: 12, ripple: true }, ix: 340, bx: 60, rx: 900, fB: EXPR.takjub, fR: EXPR.takjub,
    fI: EM(t, [[T4.ib, 'datar', { look: [.8, 0] }], [T4.du, 'sombong', { look: [.8, -.2] }], [T4.ra, 'bangga']], 13), armsI: { L: [.9, 2.0], R: [.9, 2.0] } });
  tagSeq(ctx, t, [['DUA-DUANYA SALAH', T4.du - .05, T4.it, '#ff8a8a', 92], ['ITU RAYAP!', T4.it, null, '#ffd23a', 130]], 300);
});

// ===== 5 Budi sama Rani melongo. Rayap? Yang makan kayu? =====
const T5 = { bu: wt(5, 'budi'), me: wt(5, 'melongo'), ra: wt(5, 'rayap'), ya: wt(5, 'yang'), ma: wt(5, 'makan'), ka: wt(5, 'kayu') };
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 520, y: 1050, z: 1.25 }], [T5.ra, { x: 520, y: 1040, z: 1.35 }, ease], [ls(6), { x: 520, y: 1030, z: 1.4 }, easeIn]], 2);
  ruang(ctx, t, cam, { wallOn: 0, dark: .6, basin: { n: 12 }, fI: EF(t, [[ls(5), 'sombong']], 14), ix: -200, bx: 280, rx: 780,
    fB: EM(t, [[ls(5), { eyes: 'wide', mouth: 'o', browUp: 1 }], [T5.ma, 'cemas', { look: [.4, -.4] }]], 15), fR: EM(t, [[ls(5), { eyes: 'wide', mouth: 'o', browUp: 1 }], [T5.ka, 'sadar']], 16) });
  scr(ctx, c => { const k = inv(T5.ma - .1, T5.ma + .2, t); if (k > 0) { c.save(); c.translate(540, 560); const b = backOut(k); c.scale(b, b); drawKayu(c, 0, 0, 1, inv(T5.ka, T5.ka + .6, t)); drawLaron(c, 180, -10, 2.4, { t, rot: Math.PI, wings: 0, pale: 1, walk: 1 }); c.restore(); } });
  tagSeq(ctx, t, [['RAYAP?!', T5.ra - .05, T5.ya, '#ffd23a', 130]], 300);
});

// ===== 6 Iya. Laron itu rayap bersayap, calon raja dan ratu =====
const T6 = { iy: wt(6, 'iya'), la: wt(6, 'laron'), ra: wt(6, 'rayap'), be: wt(6, 'bersayap'), ca: wt(6, 'calon'), rj: wt(6, 'raja'), rt: wt(6, 'ratu') };
function polosBG(c, t, col1 = '#2a2f5e', col2 = '#4a3f7a') { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, col1); g.addColorStop(1, col2); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.save(); c.globalAlpha = .18; for (let i = 0; i < 14; i++) { circle(c, (i * 233 + t * 20) % W, (i * 389) % H, 50 + (i % 3) * 30); c.fillStyle = '#ffffff'; c.fill(); } c.restore(); }
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const z = lerp(1, 1.1, inv(ls(6), ls(7), t)), pop = backOut(inv(ls(6) - .1, ls(6) + .25, t)), two = easeOut(inv(T6.ca - .1, T6.ca + .3, t));
  scr(ctx, c => { polosBG(c, t); c.translate(540, 900); c.scale(z, z); c.translate(-540, -900);
    drawLaron(c, lerp(540, 330, two), 880, 6.5 * pop + .01, { t, rot: -Math.PI / 2, flap: .25, crown: inv(T6.rj - .1, T6.rj + .15, t), face: EF(t, [[ls(6), 'netral'], [T6.rj, 'bangga']], 17) });
    if (two > 0) drawLaron(c, lerp(540, 750, two), 880, 6.5 * two + .01, { t: t + 1, rot: -Math.PI / 2, flap: .25, crown: inv(T6.rt - .1, T6.rt + .15, t), face: EF(t, [[T6.ca, 'netral'], [T6.rt, 'lega']], 18) });
  });
  tagSeq(ctx, t, [['RAYAP BERSAYAP', T6.ra - .05, T6.ca, '#fff', 100], ['CALON RAJA & RATU', T6.ca, null, '#ffd23a', 90]], 300);
});

// ===== 7 Koloninya ngirim mereka keluar ... habis hujan, tanahnya lembap dan gampang digali =====
const T7 = { ko: wt(7, 'koloninya'), ng: wt(7, 'ngirim'), ke: wt(7, 'keluar'), sa: wt(7, 'sarang'), bi: wt(7, 'biasanya'), ha: wt(7, 'habis'), hu: wt(7, 'hujan'), ta: wt(7, 'tanahnya'), le: wt(7, 'lembap'), ga: wt(7, 'gampang'), di: wt(7, 'digali') };
const WORK = [[380, 1350], [340, 1330], [430, 1370], [780, 1500], [820, 1490], [240, 1600], [200, 1590]];
SH(ls(7), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const rain = inv(T7.ha - .1, T7.hu + .2, t), wet = inv(T7.ta - .1, T7.le + .3, t), ex = inv(T7.ke - .1, T7.sa + .3, t);
  tanahBG(ctx, t, { rain, wet });
  WORK.forEach(([x, y], i) => drawLaron(ctx, x + Math.sin(t * 2 + i) * 12, y, 2.1, { t: t + i, rot: Math.sin(t + i) * .5 + (i % 2) * Math.PI, wings: 0, pale: 1, walk: 1 }));
  for (let i = 0; i < 6; i++) { const q = clamp(ex * 1.6 - i * .12); if (q <= 0) continue; const y = lerp(1350, GROUND - 40, Math.min(1, q * 1.2)), x = lerp(380, 300, Math.min(1, q * 1.2)) + Math.sin(i) * 20;
    const fly = Math.max(0, q * 1.2 - 1) * 5; drawLaron(ctx, x + fly * (i - 2.5) * 90, y - fly * 260, 2.4, { t: t + i, rot: -Math.PI / 2, flap: fly > 0 ? 1 : .2 }); }
  if (t > T7.ga) { const k = backOut(inv(T7.ga, T7.ga + .2, t)); ctx.save(); ctx.translate(800, 900); ctx.scale(k, k); ctx.rotate(-.3); rrect(ctx, -12, -150, 24, 200, 10); fillStroke(ctx, '#c68a55', 5); ctx.beginPath(); ctx.moveTo(-50, 50); ctx.lineTo(50, 50); ctx.lineTo(30, 140); ctx.lineTo(-30, 140); ctx.closePath(); fillStroke(ctx, '#aab4c6', 6); ctx.restore(); }
  tagSeq(ctx, t, [['SARANG BARU', T7.ke, T7.bi, '#ffd23a', 110], ['HABIS HUJAN', T7.ha - .05, T7.ta, '#bfe9ff', 110], ['TANAH LEMBAP', T7.ta, null, '#9dff7a', 104]], 300);
});

// ===== 8 Lampu bikin mereka salah arah, jadi muter-muter di situ =====
const T8 = { la: wt(8, 'lampu'), bi: wt(8, 'bikin'), sa: wt(8, 'salah'), ar: wt(8, 'arah'), ja: wt(8, 'jadi'), mu: wt(8, 'mutermuter'), si: wt(8, 'situ') };
SH(ls(8), ls(9), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(8), { x: LX, y: LY + 60, z: 2.0 }], [T8.ja, { x: LX, y: LY + 40, z: 2.3 }, ease], [ls(9), { x: LX, y: LY + 30, z: 2.4 }, easeIn]], 2);
  ruang(ctx, t, cam, { wallOn: 0, dark: .75, swarm: .7, fall: 0 });
  // satu laron berwajah yang mengitari lampu makin rapat (spiral)
  inCam(ctx, cam, c => { const q = inv(ls(8), ls(9), t), a = t * 5, r = lerp(260, 120, q); const x = LX + Math.cos(a) * r, y = LY + 40 + Math.sin(a) * r * .8;
    c.save(); c.globalAlpha = .6; c.setLineDash([16, 14]); c.beginPath(); for (let k = 0; k <= 60; k++) { const aa = a - k * .1, rr = r + k * 2.2; c.lineTo(LX + Math.cos(aa) * rr, LY + 40 + Math.sin(aa) * rr * .8); } c.lineWidth = 6; c.strokeStyle = '#fff'; c.stroke(); c.restore();
    drawLaron(c, x, y, 1.6, { t, rot: a + Math.PI / 2, face: EF(t, [[ls(8), 'netral'], [T8.sa, { eyes: 'spiral', mouth: 'wobble' }]], 19) }); });
  tagSeq(ctx, t, [['SALAH ARAH', T8.sa - .05, T8.ja, '#fff', 110], ['MUTER-MUTER', T8.mu - .05, null, '#ffd23a', 104]], 300);
});

// ===== 9 Begitu mendarat, sayapnya sengaja dilepas, lalu mereka jalan berpasangan nyari tempat =====
const T9 = { be: wt(9, 'begitu'), me: wt(9, 'mendarat'), sa: wt(9, 'sayapnya'), se: wt(9, 'sengaja'), di: wt(9, 'dilepas'), la: wt(9, 'lalu'), ja: wt(9, 'jalan'), bp: wt(9, 'berpasangan'), ny: wt(9, 'nyari'), te: wt(9, 'tempat') };
SH(ls(9), ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(9), { x: 540, y: 1520, z: 2.2 }], [T9.di, { x: 540, y: 1540, z: 2.4 }, ease], [T9.bp, { x: 600, y: 1540, z: 2.2 }, ease], [ls(10), { x: 640, y: 1540, z: 2.15 }, easeIn]], 2);
  ruang(ctx, t, cam, { wallOn: 0, dark: .5, swarm: 0, fall: 0, wings: 30 });
  inCam(ctx, cam, c => {
    const land = easeOut(inv(ls(9) - .2, T9.me + .2, t)), drop = inv(T9.di - .1, T9.di + .4, t), walk = Math.max(0, t - T9.ja) * 90;
    const A = [lerp(420, 470, land) + walk, lerp(1380, 1560, land)], Bp = [lerp(700, 380, land) + walk, lerp(1380, 1560, land)];
    // sayap yang dilepas: menempel lalu jatuh di tempat
    if (drop > 0) [[470, 1560], [380, 1560]].forEach(([x, y], j) => { for (let k = 0; k < 4; k++) drawSayap(c, x - 20 + k * 12, y + 14 + (k % 2) * 10, .9, (k - 1.5) * .6 + j, 1); });
    drawLaron(c, A[0], A[1], 1.4, { t, rot: 0, wings: 1 - drop, flap: 1 - land, walk: t > T9.ja ? 1 : 0, face: EF(t, [[ls(9), 'netral'], [T9.ja, 'bangga']], 20) });
    drawLaron(c, Bp[0] + (t > T9.ja ? -10 : 0), Bp[1] + 6, 1.35, { t: t + .5, rot: 0, wings: 1 - drop, flap: 1 - land, walk: t > T9.ja ? 1 : 0, face: EF(t, [[ls(9), 'netral'], [T9.bp, 'lega']], 21) });
  });
  tagSeq(ctx, t, [['SAYAP DILEPAS', T9.sa - .05, T9.la, '#fff', 110], ['BERPASANGAN', T9.bp - .05, null, '#ff9ad0', 110]], 300);
});

// ===== 10 Kebanyakan gagal, dimakan cicak atau kecebur air =====
const T10 = { ke: wt(10, 'kebanyakan'), ga: wt(10, 'gagal'), di: wt(10, 'dimakan'), ci: wt(10, 'cicak'), at: wt(10, 'atau'), kc: wt(10, 'kecebur'), ai: wt(10, 'air') };
SH(ls(10), ls(11), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(10), { x: 120, y: 960, z: 1.7 }], [T10.ci, { x: 100, y: 950, z: 1.9 }, ease], [T10.at, { x: 380, y: 1300, z: 1.6 }, ease], [ls(11), { x: 500, y: 1450, z: 1.9 }, easeIn]], 2);
  const tongue = Math.max(0, Math.sin(clamp(inv(T10.ci - .2, T10.ci + .3, t)) * Math.PI));
  ruang(ctx, t, cam, { wallOn: 0, dark: .65, swarm: .6, basin: { n: 18, ripple: true },
    extra: c => { drawCicak(c, -40, 930, 1.5, { t, rot: .25, tongue, face: EF(t, [[ls(10), 'licik'], [T10.ci + .2, 'bangga']], 22) });
      const eaten = t > T10.ci + .1; if (!eaten) drawLaron(c, 330 - 260 * tongue * (t > T10.ci ? 1 : 0), 1010, 1.3, { t, rot: Math.PI }); } });
  tagSeq(ctx, t, [['KEBANYAKAN GAGAL', T10.ke - .05, T10.di, '#ff8a8a', 96], ['DIMAKAN CICAK', T10.di, T10.at, '#fff', 104], ['KECEBUR AIR', T10.kc - .05, null, '#bfe9ff', 110]], 300);
  sfxS(ctx, 'HAP!', 700, 640, 90, win(t, T10.ci, T10.at), '#fff', -.1);
});

// ===== 11 Tapi yang berhasil bakal jadi raja dan ratu koloni baru, kadang di dekat rumah kita sendiri =====
const T11 = { ta: wt(11, 'tapi'), be: wt(11, 'berhasil'), ba: wt(11, 'bakal'), rj: wt(11, 'raja'), rt: wt(11, 'ratu'), ko: wt(11, 'koloni'), ka: wt(11, 'kadang'), de: wt(11, 'dekat'), ru: wt(11, 'rumah'), si: wt(11, 'sendiri') };
SH(ls(11), ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  const house = inv(T11.ka - .1, T11.ru + .2, t), z = lerp(1.25, 1, easeInOut(inv(T11.ka, T11.si, t)));
  scr(ctx, c => { c.translate(540, 1400); c.scale(z, z); c.translate(-540, -1400);
    tanahBG(c, t, { wet: .6, house });
    c.setTransform(1, 0, 0, 1, 0, 0); c.translate(540, 1400); c.scale(z, z); c.translate(-540, -1400);
    const k = backOut(inv(T11.be - .1, T11.be + .2, t));
    ellipse(c, 780, 1060, 260, 120); c.fillStyle = LRP.chamber; c.fill(); line(c, 380, 1350, 600, 1100, 46, LRP.chamber);
    drawLaron(c, 690, 1070, 3.2 * k + .01, { t, rot: Math.PI, wings: 0, crown: inv(T11.rj - .1, T11.rj + .15, t), face: EF(t, [[T11.be, 'bangga']], 23) });
    drawLaron(c, 880, 1070, 3.2 * k + .01, { t: t + 1, rot: Math.PI, wings: 0, crown: inv(T11.rt - .1, T11.rt + .15, t), face: EF(t, [[T11.be, 'lega']], 24) });
    const nb = Math.round(lerp(0, 8, inv(T11.ko, T11.ka + .4, t))); for (let i = 0; i < nb; i++) drawLaron(c, 620 + (i % 4) * 100, 1140 + Math.floor(i / 4) * 40 - 120 * (i % 2), 1.1, { t: t + i, rot: Math.sin(t + i), wings: 0, pale: 1, walk: 1 });
  });
  tagSeq(ctx, t, [['RAJA & RATU', T11.rj - .05, T11.ka, '#ffd23a', 110], ['DEKAT RUMAH KITA', T11.de - .05, null, '#ff8a8a', 96]], 300);
});

// ===== 12a Budi sama Rani akhirnya nyapu berdua =====
const T12 = { bu: wt(12, 'budi'), sa: wt(12, 'sama'), ra: wt(12, 'rani'), ak: wt(12, 'akhirnya'), ny: wt(12, 'nyapu'), be: wt(12, 'berdua'), ka: wt(12, 'karena'), ma: wt(12, 'malam'), in: wt(12, 'ini') };
SH(ls(12), T12.ka, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(12), { x: 540, y: 1180, z: 1.35 }], [T12.ny, { x: 540, y: 1200, z: 1.45 }, ease], [T12.ka, { x: 540, y: 1190, z: 1.5 }, easeIn]], 2);
  const sw = Math.sin(t * 7);
  ruang(ctx, t, cam, { wallOn: 1, dark: .4, wings: 60 - Math.round(30 * inv(T12.ny, T12.ka, t)), basin: { n: 18 }, swarm: .5, bx: 300, rx: 780,
    fB: EM(t, [[ls(12), 'meringis'], [T12.ny, 'datar', { look: [.6, .6] }]], 25), fR: EM(t, [[ls(12), 'meringis'], [T12.be, 'datar', { look: [-.6, .6] }]], 26),
    armsB: { R: armTo(300, 1, 400 + sw * 30, 1300, -1), L: armTo(300, 1, 360 + sw * 30, 1250, -1) }, armsR: { R: armTo(780, -1, 680 - sw * 30, 1300, -1), L: armTo(780, -1, 720 - sw * 30, 1250, -1) },
    after: c => { drawSapu(c, 395 + sw * 30, 1290, 1.1, .35 + sw * .15, { spread: .4 }); drawSapu(c, 685 - sw * 30, 1290, 1.1, -.35 - sw * .15, { spread: .4 }); } });
  tagSeq(ctx, t, [['KALAH BERDUA', T12.ak - .05, null, '#ff8a8a', 110]], 300);
  sfxS(ctx, 'SREKK', 540, 1600, 70, win(t, T12.ny, T12.ka), '#fff', -.1);
});
// ===== 12b karena malam ini, -> komposisi frame 0 (loop) =====
SH(T12.ka, ENDT, { tr: 'whip' }, (ctx, lt, t) => {
  const tl = t - ENDT + 1 / 30;
  hookScene(ctx, t, cam0(tl), tl);
  scrTag(ctx, 'MALAM INI...', inv(T12.ma - .1, T12.ma + .1, t) * (1 - inv(ENDT - .45, ENDT - .3, t)), '#fff', 300, 110);
  scrTag(ctx, 'RATUSAN LARON', inv(-.2, 0, tl), '#ffd23a', 300, 100);
});
