// ---------- Fakta Unik: "Kenapa kerupuk sekeras kayu bisa mengembang di wajan?" (~58 dtk) ----------
// Format "Kenapa X?": jawaban dibangun lewat rantai masalah -> solusi dalam SATU dapur bersambung + dunia mikro di dalam irisan.
// Aturan v5: kamera selalu bergerak, transisi portal/match/whip/dissolve, ikuti BENDA (kerupuk/air/uap), ekspresi per kata.
// Aturan v6: SEMUA waktu dari kata (wt), aset = satu fungsi (env_kerupuk.js), tata letak KR + MICRO terkunci.
const SHOTS = [];
const IBU = { cols: ['#ec5b86', '#ec5b86'], hat: 'chef', belt: false, blush: true };
const BUDI = { cols: ['#2f9b5a', '#2f9b5a'], hat: 'tuft', hatCol: INK, belt: false };
const C = (b, e) => Object.assign({}, b, e);
const LN = {}; WORDS.forEach(w => { (LN[w.line] = LN[w.line] || []).push(w); });
const ls = i => LN[i][0].s;
const nrm = s => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const fw = (i, str, n = 0) => { const w = LN[i].filter(w => nrm(w.w) === str)[n]; if (!w) throw new Error('kata tidak ada di baris ' + i + ': ' + str); return w.s; };
const wt = (i, str, d = 0, n = 0) => fw(i, str, n) + d;
const ENDT = WORDS[WORDS.length - 1].e + .6;   // = DUR di main.js (akhir suara + 0,6)
const SH = (s, e, o, draw) => SHOTS.push(Object.assign({ start: s, end: e, draw }, o));
const CK = (t, keys, sh = 2) => camKeys(t, t, keys, sh);
const standL = { L: [.1, -.04], R: [.1, -.04] };
const BK = KR.back, TOP = KR.top, WOK = KR.wok, STV = KR.stove, IBUX = KR.ibu, BUDX = KR.budi;
const KIN = [WOK[0], WOK[1] + 16];                 // titik kerupuk di dalam minyak
const MICRO = [[300, 640], [730, 560], [560, 960], [270, 1190], [810, 1130]]; // posisi tetes air di dunia mikro (terkunci)
const bez = (a, c, b, p) => { const q = 1 - p; return [q * q * a[0] + 2 * q * p * c[0] + p * p * b[0], q * q * a[1] + 2 * q * p * c[1] + p * p * b[1]]; };
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, BK, 600, flip, wx, wy, bend);
function ibu(ctx, t, face, arms, x = IBUX, extra = {}) { drawStick(ctx, C(IBU, Object.assign({ x, y: BK, s: 600, armLen: 1.3, legs: standL, arms: arms || idleArms(t, 1), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
function budi(ctx, t, face, arms, x = BUDX, flip = -1, extra = {}) { drawStick(ctx, C(BUDI, Object.assign({ x, y: BK, s: 600, flip, armLen: 1.3, legs: standL, arms: arms || idleArms(t, 2), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
function stoveWok(ctx, t, o = {}, inside) { drawStove(ctx, STV[0], STV[1], 1, { t, fire: o.fire == null ? 1 : o.fire }); drawWok(ctx, WOK[0], WOK[1], 1, { t, heat: o.heat == null ? 1 : o.heat }, inside); }
function splash(ctx, x, y, t, t0, n = 9, col = '#ffd27a') {
  const d = t - t0; if (d < 0 || d > .5) return;
  for (let i = 0; i < n; i++) { const a = -Math.PI * (.15 + .7 * i / (n - 1)), v = 300 + (i % 3) * 120, px = x + Math.cos(a) * v * d, py = y + Math.sin(a) * v * d + 900 * d * d; circle(ctx, px, py, 9 * (1 - d * 1.6)); fillStroke(ctx, col, 3); }
}
// ===== v7: aturan mikroekspresi (lihat reference/format-kenapa-v7.md bagian E) =====
// EF = wajah benda + tokoh latar: tanpa lirik/kedip acak, ganti HANYA di ketukan cerita.
// EM = tokoh fokus jarak sedang: kedip acak boleh, tanpa lirik acak.  EC = close-up fokus yang diam lama: kedip + lirik.
const _warned = new Set();
const gapCheck = (keys, seed) => { for (let i = 1; i < keys.length; i++) if (keys[i][0] - keys[i - 1][0] < .55 && !_warned.has(seed)) { _warned.add(seed); console.log('PERINGATAN ekspresi seed ' + seed + ': jarak ganti ' + (keys[i][0] - keys[i - 1][0]).toFixed(2) + ' dtk < 0,55'); } };
const EF = (t, keys, seed) => (gapCheck(keys, seed), exprTrack(t, keys, { seed, saccade: false, idleBlink: false }));
const EM = (t, keys, seed) => (gapCheck(keys, seed), exprTrack(t, keys, { seed, saccade: false }));
const EC = (t, keys, seed) => (gapCheck(keys, seed), exprTrack(t, keys, { seed }));
// v7: latar blur = gambar SEKALI ke kanvas terpisah lalu blur sebagai gambar (ctx.filter per-goresan sangat lambat di latar datar yang lebar)
const _blurBuf = document.createElement('canvas'); _blurBuf.width = W; _blurBuf.height = H; const _bctx = _blurBuf.getContext('2d');
function blurLayer(ctx, draw, px) {
  _bctx.setTransform(1, 0, 0, 1, 0, 0); _bctx.filter = 'none'; _bctx.globalAlpha = 1; _bctx.clearRect(0, 0, W, H); draw(_bctx);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = `blur(${px}px)`; ctx.drawImage(_blurBuf, -W * .02, -H * .02, W * 1.04, H * 1.04); ctx.restore();
}
const capArms = t => ({ L: [.2, -.1], R: { ik: [.12 + Math.sin(t * 9) * .02, -.7], bend: -1 } });

// ===== 0 HOOK: Budi mengetuk kerupuk mentah (TOK TOK), ketuk kepala, lempar ke wajan -> MENGEMBANG =====
const H0 = { kr: wt(0, 'kerupuk'), ks: wt(0, 'sekeras'), ky: wt(0, 'kayu'), b: wt(0, 'bisa'), m: wt(0, 'mengembang'), wj: wt(0, 'wajan') };
const hand0 = t => {
  if (t < H0.ks) { const y = kf(t, [[0, 1215], [.1, 1300, easeIn], [.24, 1205, easeOut], [H0.kr + .02, 1300, easeIn], [H0.kr + .16, 1220, easeOut], [H0.ks, 1215]]); return [780, y]; }
  if (t < H0.b) return kf(t, [[H0.ks, [780, 1215]], [H0.ky - .08, [880, 905], easeOut], [H0.ky, [880, 935], easeIn], [H0.ky + .14, [860, 960], easeOut], [H0.b, [830, 1060]]]);
  return kf(t, [[H0.b, [830, 1060]], [H0.b + .14, [720, 1010], easeOut], [H0.wj, [760, 1080]]]);
};
const kr0 = t => {   // posisi kerupuk: di tangan -> terbang -> di wajan
  if (t < H0.b + .06) { const h = hand0(t); return { x: h[0] - 20, y: h[1] - 40, tilt: 1, rot: .2, inWok: false }; }
  const p = inv(H0.b + .06, H0.m, t); if (p < 1) { const q = bez([700, 980], [620, 800], KIN, easeIn(p)); return { x: q[0], y: q[1], tilt: lerp(1, .45, p), rot: .2 + p * 6, inWok: p > .8 }; }
  return { x: KIN[0], y: KIN[1], tilt: .45, rot: 0, inWok: true };
};
const cam0 = t => CK(t, [[0, { x: 790, y: 1140, z: 1.55 }], [H0.ks, { x: 800, y: 1120, z: 1.6 }, easeOut], [H0.ky, { x: 840, y: 1040, z: 1.7 }, ease], [H0.b + .05, { x: 820, y: 1060, z: 1.55 }], [H0.m, { x: 600, y: 1080, z: 1.2 }, ease], [H0.wj, { x: 580, y: 1090, z: 1.3 }, easeOut], [ls(1), { x: 562, y: 1110, z: 1.75 }, easeIn]], 2);
SH(0, ls(1), { tr: 'match', zoomOut: (() => { const c = cam0(ls(1)), p = toScreen(c, KIN[0], KIN[1]); return { x: p[0], y: p[1], r: 150 * c.z }; })() }, (ctx, lt, t) => {
  const cam = cam0(t), dm = t - H0.m; let cm = cam;
  if (dm > 0 && dm < .4) { const s = shake(t * 3, 16 * (1 - dm / .4), 3); cm = Object.assign({}, cam, { x: cam.x + s[0], y: cam.y + s[1] }); }
  dapurBack(ctx, t, cm);
  const fi = EF(t, [[0, 'netral', { look: [.8, .1] }], [H0.m + .08, 'kaget', { look: [.8, .3] }]], 1);
  ibu(ctx, t, fi, { L: idleArms(t, 1).L, R: armTo(IBUX, 1, 330, 1120, -1) });
  const fb = EM(t, [[0, 'ngeden', { look: [-.7, .7] }], [H0.ky, 'meringis'], [H0.m + .03, 'kaget', { look: [-.9, .3] }], [H0.wj + .15, 'takjub', { look: [-.9, .3] }]], 2);
  const h = hand0(t);
  budi(ctx, t, fb, { L: idleArms(t, 2).L, R: armTo(BUDX, -1, h[0], h[1], 1) }, BUDX, -1, { headTilt: (t > H0.ky && t < H0.ky + .3 ? .12 : 0) - (fb.pop || 0) * .05 });
  dapurMeja(ctx);
  const k = kr0(t), pf = easeOut(inv(H0.m, H0.m + .3, t)), bounce = dm > 0 ? 1 + .12 * Math.sin(dm * 22) * Math.exp(-dm * 6) : 1;
  const kf0 = EF(t, [[H0.m, 'bangga']], 3);
  stoveWok(ctx, t, { heat: 1 }, k.inWok ? (c => drawKerupuk(c, k.x - WOK[0], k.y - WOK[1], 1.05 * bounce, { p: pf, tilt: k.tilt, rot: k.rot, t, face: pf > .5 ? kf0 : null, seed: 2 })) : null);
  if (!k.inWok) drawKerupuk(ctx, k.x, k.y, .75, { p: 0, tilt: k.tilt, rot: k.rot, t, seed: 2 });
  // TOK TOK di meja, TOK di kepala
  sfxText(ctx, 'TOK', 690, 1240, 70, inv(.1, .2, t) * (1 - inv(.36, .42, t)), '#fff', -.15);
  sfxText(ctx, 'TOK', 700, 1190, 76, inv(H0.kr + .02, H0.kr + .12, t) * (1 - inv(H0.ks + .1, H0.ks + .18, t)), '#fff', .12);
  sfxText(ctx, 'TOK!', 990, 860, 84, inv(H0.ky, H0.ky + .1, t) * (1 - inv(H0.b, H0.b + .08, t)), '#ffd23a', .15);
  if (t > H0.ky && t < H0.ky + .4) for (let i = 0; i < 3; i++) star5(ctx, 880 + Math.cos(t * 9 + i * 2.1) * 90, 880 + Math.sin(t * 9 + i * 2.1) * 26, 18, t * 4, '#ffe14d');
  if (dm > 0 && dm < .28) burst(ctx, KIN[0], KIN[1] - 30, 230 * backOut(clamp(dm / .12)) * (1 - dm / .28 * .4), 14, 'rgba(255,240,180,.6)', 7);
  splash(ctx, KIN[0], KIN[1], t, H0.m);
  flash(ctx, t, H0.m, .1);
  glint(ctx, KIN[0] + 150, KIN[1] - 110, 140, t, H0.wj);
});

// ===== 1 "Rahasianya ada di sesuatu yang tidak kelihatan." kerupuk mentah diterawang ke cahaya, siluet tetes + ? =====
const cam1 = t => CK(t, [[ls(1), { x: 540, y: 900, z: 1.0 }], [ls(1) + .7, { x: 540, y: 880, z: 1.12 }, easeOut], [wt(1, 'sesuatu'), { x: 600, y: 840, z: 1.2 }], [wt(1, 'kelihatan', .3), { x: 640, y: 820, z: 1.42 }, ease], [ls(2), { x: 650, y: 815, z: 1.5 }]], 3);
SH(ls(1), ls(2), { tr: 'dissolve', zoomIn: { x: 540, y: 820, r: 380 } }, (ctx, lt, t) => {
  const cam = cam1(t);
  blurLayer(ctx, c => dapurBack(c, t, cam), 8); applyCam(ctx, cam, 1);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(560, 760, 0, 560, 760, 700); g.addColorStop(0, 'rgba(255,240,190,.55)'); g.addColorStop(1, 'rgba(255,240,190,0)'); ctx.fillStyle = g; ctx.fillRect(-200, 0, 1500, 1700); ctx.restore();
  const tS = wt(1, 'sesuatu'), tT = wt(1, 'tidak'), tK = wt(1, 'kelihatan');
  drawKerupuk(ctx, 540, 820, 3.8, { p: 0, tilt: 1, rot: Math.sin(t * 1.3) * .05, t, seed: 2 });
  // siluet tetes air di dalam kerupuk (belum terungkap)
  const a = inv(tS, tS + .3, t) * (.35 + .25 * Math.sin(t * 7)) * (1 - .7 * inv(tT, tK, t));
  if (a > 0) { ctx.save(); ctx.globalAlpha = a; drawDrop(ctx, 650, 760, 60, {}); ctx.restore(); }
  const kq = inv(tK, tK + .25, t); if (kq > 0) qmark(ctx, 660, 600 + Math.sin(t * 4) * 8, 170 * backOut(kq), .15);
  const fb = EC(t, [[ls(1), 'curiga', { look: [-.4, -.8] }], [tS, 'curiga', { look: [.2, -1] }], [tK, 'takjub', { look: [.3, -1] }]], 4);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawStick(ctx, C(BUDI, { x: 880, y: 2700 + Math.sin(t * 2) * 6, s: 1350, flip: -1, shadow: false, headTilt: -.12 + Math.sin(t * 2) * .03, arms: { L: [.2, -.1], R: [.2, -.1] }, face: fb }));
  ctx.restore();
  glint(ctx, 300, 640, 120, t, wt(1, 'rahasianya', .2));
});

// ===== 2 "Awalnya cuma tepung tapioka dan air." karung menuang tepung, teko menuang air ke baskom =====
const T2 = { tp: wt(2, 'tepung'), ta: wt(2, 'tapioka'), da: wt(2, 'dan'), ai: wt(2, 'air') };
const cam2 = t => CK(t, [[ls(2), { x: -560, y: 1110, z: 1.2 }], [ls(2) + .7, { x: -540, y: 1110, z: 1.4 }, easeOut], [T2.ta, { x: -520, y: 1100, z: 1.45 }], [T2.ai, { x: -300, y: 1110, z: 1.45 }, ease], [ls(3), { x: -280, y: 1115, z: 1.55 }, easeIn]], 2);
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam2(t); dapurBack(ctx, t, cam);
  const fi = EM(t, [[ls(2), 'netral', { look: [-.6, .5] }], [T2.tp, 'bangga', { look: [-.6, .6] }]], 5);
  ibu(ctx, t, fi, null, KR.prep);
  dapurMeja(ctx);
  const ps = ease(inv(T2.tp - .3, T2.tp, t)) * (1 - ease(inv(T2.da, T2.da + .3, t))), pj = ease(inv(T2.ai - .35, T2.ai, t));
  drawBasin(ctx, KR.basin, TOP, 1, { fill: inv(T2.tp, T2.ta + .4, t), mix: inv(T2.ai + .1, T2.ai + .7, t) });
  drawSack(ctx, KR.sack, TOP - 70 * ps, 1, { rot: 1.05 * ps, t, face: EF(t, [[ls(2), 'bangga']], 6) });
  if (ps > .8) { const r = rng(Math.floor(t * 30)); for (let i = 0; i < 14; i++) { const q = (t * 2.2 + i / 14) % 1; circle(ctx, -425 + (r() - .5) * 26 + q * 20, 1150 + q * 70, 7 + r() * 5); ctx.fillStyle = '#fffefa'; ctx.fill(); } puff(ctx, -380, 1200, 46, t, '#fffefa', 5, .6); }
  drawJug(ctx, KR.jug, TOP - 100 * pj, 1, { rot: -1.0 * pj });
  if (pj > .9) { ctx.beginPath(); ctx.moveTo(-372, 1196 - 0); ctx.quadraticCurveTo(-385, 1200, -385, 1215); ctx.lineWidth = 24; ctx.strokeStyle = KRP.water; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.stroke(); }
  glint(ctx, -650 + 60, 1100, 120, t, T2.ta);
  glint(ctx, -320, 1180, 100, t, T2.ai + .15);
});

// ===== 3 "Kalau langsung digoreng, adonan mentah ini tidak bisa mengembang." gumpalan mentah di wajan: gagal =====
const T3 = { dg: wt(3, 'digoreng'), ad: wt(3, 'adonan'), mt: wt(3, 'mentah'), td: wt(3, 'tidak'), mb: wt(3, 'mengembang') };
const lump3 = t => { const p = inv(T3.dg - .15, T3.dg + .2, t); return p < 1 ? bez([780, 1040], [690, 930], KIN, easeIn(p)).concat([p]) : [KIN[0], KIN[1] + 10, 1]; };
const cam3 = t => CK(t, [[ls(3), { x: 720, y: 1080, z: 1.25 }], [ls(3) + .7, { x: 680, y: 1090, z: 1.4 }, easeOut], [T3.ad, { x: 600, y: 1080, z: 1.5 }, ease], [T3.td, { x: 580, y: 1070, z: 1.62 }, ease], [ls(4), { x: 575, y: 1060, z: 1.7 }, easeIn]], 2);
SH(ls(3), ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam3(t); dapurBack(ctx, t, cam);
  const fi = EF(t, [[ls(3), 'netral', { look: [.8, .1] }], [T3.mb + .53, 'datar', { look: [.9, -.2] }]], 7);
  ibu(ctx, t, fi);
  const l = lump3(t), inHand = t < T3.dg - .15;
  const fb = EF(t, [[ls(3), 'licik', { look: [-.8, .4] }], [T3.mb + .45, 'meringis']], 8);
  budi(ctx, t, fb, { L: idleArms(t, 2).L, R: inHand ? armTo(BUDX, -1, 790, 1060 + Math.sin(t * 6) * 10, 1) : armTo(BUDX, -1, 760, kf(t, [[T3.dg - .15, 1050], [T3.dg + .2, 1120]]), 1) });
  dapurMeja(ctx);
  const tryP = Math.sin(clamp(inv(T3.mb - .05, T3.mb + .45, t)) * Math.PI) * .6;
  const fl = EF(t, [[ls(3), 'netral'], [T3.td, 'ngeden'], [T3.mb + .45, { eyes: 'x', mouth: 'wobble' }]], 9);
  const drawL = (c, x, y) => drawDoughLump(c, x, y, .75, { face: l[2] >= 1 ? fl : null, t, puff: tryP, squash: t > T3.dg + .2 ? .1 * Math.exp(-(t - T3.dg - .2) * 6) * Math.sin((t - T3.dg) * 30) : 0 });
  stoveWok(ctx, t, { heat: 1 }, l[2] > .8 ? (c => drawL(c, l[0] - WOK[0], l[1] - WOK[1] + 20)) : null);
  if (l[2] <= .8) drawL(ctx, l[0], l[1] + 40);
  splash(ctx, KIN[0], KIN[1], t, T3.dg + .2);
  sfxText(ctx, 'CESS', 400, 960, 64, inv(T3.dg + .2, T3.dg + .3, t) * (1 - inv(T3.mt, T3.mt + .1, t)), '#fff', -.1);
  const kx = inv(T3.td, T3.td + .22, t); if (kx > 0) { ctx.save(); ctx.translate(720, 930); const s2 = backOut(kx); ctx.scale(s2, s2); drawX(ctx, 0, 0, 70); ctx.restore(); }
});

// ===== 4 "Jadi, adonannya dikukus dulu." dandang di kompor, adonan gelondong masuk, tutup, uap -> PORTAL ke dalam dandang =====
const T4 = { ad: wt(4, 'adonannya'), dk: wt(4, 'dikukus'), du: wt(4, 'dulu') };
const DDX = [STV[0], STV[1] - 120];   // dandang berdiri di atas kompor
const cam4 = t => CK(t, [[ls(4), { x: 560, y: 1000, z: 1.1 }], [ls(4) + .6, { x: 560, y: 960, z: 1.25 }, easeOut], [T4.dk, { x: 560, y: 980, z: 1.3 }], [T4.du + .2, { x: 560, y: 1000, z: 1.6 }, ease], [ls(5), { x: 560, y: 1010, z: 2.1 }, easeIn]], 2);
SH(ls(4), ls(5), { tr: 'portal', zoomOut: (() => { const c = cam4(ls(5)), p = toScreen(c, DDX[0], DDX[1] - 175); return { x: p[0], y: p[1], w: 169 * c.z, h: 300 * c.z }; })() }, (ctx, lt, t) => {
  const cam = cam4(t); dapurBack(ctx, t, cam);
  const lift = 130 * ease(inv(ls(4), ls(4) + .3, t)) * (1 - ease(inv(T4.dk - .1, T4.dk + .12, t)));
  const fi = EF(t, [[ls(4), 'netral', { look: [.8, -.4] }], [T4.dk + .08, 'bangga', { look: [.8, -.2] }]], 10);
  ibu(ctx, t, fi, { L: idleArms(t, 1).L, R: armTo(IBUX, 1, 420, DDX[1] - 470 - lift + 60, -1) });
  const lp = inv(T4.ad - .1, T4.dk - .15, t), ly = lerp(820, 1000, easeIn(lp));
  const fb = EF(t, [[ls(4), 'ngeden', { look: [-.8, .3] }], [T4.dk + .12, 'lega']], 11);
  budi(ctx, t, fb, { L: idleArms(t, 2).L, R: lp < .5 ? armTo(BUDX, -1, 700, ly + 40, 1) : idleArms(t, 2).R });
  dapurMeja(ctx);
  drawStove(ctx, STV[0], STV[1], 1, { t, fire: 1 });
  if (lp < 1) drawLog(ctx, 560, ly, .6, { cook: 0, rot: .05 });
  drawDandang(ctx, DDX[0], STV[1] - 116, 1, { t, lift, steam: inv(T4.dk, T4.du, t), face: EF(t, [[ls(4), 'netral'], [T4.dk, 'bangga']], 12) });
  sfxText(ctx, 'TAK', 780, 760, 60, inv(T4.dk, T4.dk + .1, t) * (1 - inv(T4.du, T4.du + .1, t)), '#fff', .1);
});

// ===== 5a "Panasnya mengubah tepung jadi gel..." di dalam dandang: adonan putih -> gel bening =====
const T5 = { mu: wt(5, 'mengubah'), tp: wt(5, 'tepung'), ge: wt(5, 'gel'), ke: wt(5, 'kenyal'), ka: wt(5, 'karet') };
const T5b = wt(5, 'kenyal', -.3);
SH(ls(5), T5b, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 540, y: 960, z: 1.0 }], [ls(5) + .8, { x: 540, y: 950, z: 1.12 }, easeOut], [T5.ge, { x: 545, y: 940, z: 1.22 }], [T5b, { x: 550, y: 935, z: 1.3 }, easeIn]], 2);
  applyCam(ctx, cam, 1);
  const g = ctx.createRadialGradient(540, 900, 100, 540, 960, 1300); g.addColorStop(0, '#6d7590'); g.addColorStop(1, '#2a2f40'); ctx.fillStyle = g; ctx.fillRect(-600, -600, 2300, 3200);
  ctx.save(); ctx.globalAlpha = .5; for (let i = 0; i < 5; i++) { const q = (t * .25 + i / 5) % 1; puff(ctx, 140 + i * 200, 1500 - q * 1100, 80 + q * 70, t, '#ffffff', i + 2, Math.sin(q * Math.PI) * .7); } ctx.restore();
  // nampan berlubang
  ellipse(ctx, 540, 1130, 430, 70); fillStroke(ctx, KRP.metal, 8); for (let i = 0; i < 9; i++) { circle(ctx, 220 + i * 80, 1130 + (i % 2) * 12, 9); ctx.fillStyle = '#3b3f52'; ctx.fill(); }
  const ck = ease(inv(T5.mu, T5.ge + .2, t));
  const fl = EF(t, [[ls(5), 'datar'], [T5.mu, 'kaget'], [T5.ge + .35, 'bangga']], 13);
  drawLog(ctx, 540, 1000, 1.9, { cook: ck, face: fl, t, rot: Math.sin(t * 2) * .02 });
  innerGlow(ctx, 540, 990, 160, ck * Math.sin(clamp(inv(T5.ge - .3, T5.ge + .8, t)) * Math.PI), t, '255,230,170');
  glint(ctx, 700, 900, 150, t, T5.ge);
  ctx.save(); ctx.globalAlpha = .55; for (let i = 0; i < 4; i++) { const q = (t * .35 + i / 4) % 1; puff(ctx, 300 + i * 160, 1050 - q * 700, 50 + q * 60, t, '#ffffff', i + 7, Math.sin(q * Math.PI) * .6); } ctx.restore();
  timeGrade(ctx, .2, 'senja');
});

// ===== 5b "...yang kenyal, kayak karet." Budi menarik gel seperti karet: BOING =====
const st5 = t => { const a = inv(T5.ke - .1, T5.ka - .05, t), d = t - T5.ka; return d < 0 ? .85 * easeOut(a) : .85 * Math.exp(-d * 5) * Math.cos(d * 18); };
SH(T5b, ls(6), { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = CK(t, [[T5b, { x: -380, y: 1110, z: 1.35 }], [T5b + .6, { x: -380, y: 1110, z: 1.5 }, easeOut], [ls(6), { x: -385, y: 1120, z: 1.58 }]], 2);
  dapurBack(ctx, t, cam);
  const s = st5(t), L = 210 * .7 * (1 + Math.max(-.2, s));
  const fb = EM(t, [[T5b, 'ngeden', { look: [0, .6] }], [T5.ka + .1, 'bangga']], 14);
  drawStick(ctx, C(BUDI, { x: -380, y: BK, s: 600, armLen: 1.35, legs: standL, arms: { L: reach(-380, BK, 600, 1, -380 - L, 1140, -1), R: reach(-380, BK, 600, 1, -380 + L, 1140, -1) }, face: fb, headTilt: -(fb.pop || 0) * .05 }));
  dapurMeja(ctx);
  drawLog(ctx, -380, 1140, .7, { cook: 1, stretch: Math.max(-.15, s), face: EF(t, [[T5b, 'ngeden'], [T5.ka + .1, 'lega']], 15), t });
  sfxText(ctx, 'BOING', -380, 900, 74, inv(T5.ka, T5.ka + .1, t), '#ff8a5b', -.1);
  for (const sx of [-1, 1]) if (t > T5.ka && t < T5.ka + .35) { const d = t - T5.ka; for (let i = 0; i < 3; i++) line(ctx, -380 + sx * (L + 40 + i * 4), 1100 + i * 40 - 40, -380 + sx * (L + 80 + d * 200), 1100 + i * 40 - 40, 7, INK); }
});

// ===== 6 "Kukus kurang matang? Kerupuknya nanti bantat." inti putih mentah -> kerupuk kecil gagal di wajan, stempel BANTAT =====
const T6 = { ku: wt(6, 'kukus'), ma: wt(6, 'matang'), kr: wt(6, 'kerupuknya'), ba: wt(6, 'bantat') };
const cam6 = t => CK(t, [[ls(6), { x: -330, y: 1170, z: 1.7 }], [ls(6) + .6, { x: -310, y: 1180, z: 1.85 }, easeOut], [T6.ma + .25, { x: -300, y: 1180, z: 1.9 }], [T6.kr + .2, { x: 560, y: 1080, z: 1.45 }, ease], [T6.ba, { x: 565, y: 1060, z: 1.5 }], [ls(7), { x: 560, y: 1050, z: 1.65 }, easeIn]], 2);
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const db = t - T6.ba; let cam = cam6(t);
  if (db > 0 && db < .4) { const s = shake(t * 3, 14 * (1 - db / .4), 3); cam = Object.assign({}, cam, { x: cam.x + s[0], y: cam.y + s[1] }); }
  dapurBack(ctx, t, cam);
  ibu(ctx, t, EF(t, [[ls(6), 'netral', { look: [.8, .3] }], [T6.ba, 'meringis']], 16));
  budi(ctx, t, EF(t, [[ls(6), 'curiga', { look: [-.8, .3] }], [T6.ba + .07, 'sadar', { look: [-.8, .3] }]], 17));
  dapurMeja(ctx);
  drawLog(ctx, -380, 1240, .8, { cook: .55, core: inv(T6.ku, T6.ma, t), t, face: EF(t, [[ls(6), 'netral'], [T6.ma + .08, 'cemas']], 18) });
  const kx = inv(T6.ma, T6.ma + .22, t); if (kx > 0) { ctx.save(); ctx.translate(-150, 1120); const s2 = backOut(kx); ctx.scale(s2, s2); drawX(ctx, 0, 0, 46); ctx.restore(); }
  const tp = Math.sin(clamp(inv(T6.kr + .1, T6.ba, t)) * Math.PI * .5) * .22;
  stoveWok(ctx, t, { heat: 1 }, c => drawKerupuk(c, KIN[0] - WOK[0], KIN[1] - WOK[1], .8, { p: tp, tilt: .45, t, seed: 4, crack: inv(T6.ba, T6.ba + .2, t), face: EF(t, [[ls(6), 'ngeden'], [T6.ba, 'meringis']], 19) }));
  const ks = inv(T6.ba, T6.ba + .14, t);
  if (ks > 0) { const sc = (ks < 1 ? lerp(2.4, 1, easeOut(ks)) : 1) * .62; drawStamp(ctx, 560, 850, sc, 'BANTAT', { size: 90, rot: -.12 }); }
});

// ===== 7a "Lalu gel diiris tipis," pisau mengiris gel, irisan melayang =====
const T7 = { ge: wt(7, 'gel'), di: wt(7, 'diiris'), ti: wt(7, 'tipis'), dj: wt(7, 'dijemur'), ke: wt(7, 'keras'), ka: wt(7, 'kaca') };
const T7b = wt(7, 'dijemur', -.15), NCH = 5;
const chop = i => lerp(T7.di - .05, T7.ti + .35, i / (NCH - 1));
SH(ls(7), T7b, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(7), { x: -300, y: 1120, z: 1.35 }], [ls(7) + .6, { x: -290, y: 1130, z: 1.55 }, easeOut], [T7b, { x: -240, y: 1120, z: 1.65 }]], 2);
  dapurBack(ctx, t, cam);
  let n = 0; for (let i = 0; i < NCH; i++) if (t > chop(i)) n = i + 1;
  const cx = -380 + 140 - n * 28;      // posisi pisau mundur tiap irisan
  const ci = Math.max(0, n - 1), dc = t - chop(ci), down = n > 0 && dc < .14 ? 1 - dc / .14 : 0;
  const ky = 1150 + (n > 0 ? 70 * down : 0) - (t < T7.di - .3 ? 0 : 0);
  const fi = EM(t, [[ls(7), 'ngeden', { look: [.4, .7] }], [T7.ti + .4, 'bangga', { look: [.4, .6] }]], 20);
  ibu(ctx, t, fi, { L: idleArms(t, 1).L, R: armTo(-380, 1, cx - 60, ky + 10, -1) }, -380);
  dapurMeja(ctx);
  rrect(ctx, -640, TOP - 26, 520, 30, 10); fillStroke(ctx, '#e0b07a', 6);
  drawLog(ctx, -380, 1240, .7, { cook: 1, cut: n / NCH * .55, t, face: EF(t, [[ls(7), 'netral'], [T7.di, 'meringis']], 21) });
  drawKnife(ctx, cx, ky + 40, .9, Math.PI / 2 - .1);
  for (let i = 0; i < n; i++) { const d = t - chop(i); const x = -230 + d * 700, y = 1180 - d * 500 + d * d * 500; drawKerupuk(ctx, x, y, .4, { p: 0, dry: 0, tilt: .8, rot: d * 8, t, seed: 3 + i }); }
  for (let i = 0; i < n; i++) sfxText(ctx, 'TAK', -260 + i * 30, 1000 - i * 20, 46, inv(chop(i), chop(i) + .06, t) * (1 - inv(chop(i) + .2, chop(i) + .26, t)), '#fff', -.1 + i * .05);
});

// ===== 7b "...dijemur sampai keras kayak kaca." tampah di bawah matahari, waktu berlalu, irisan jadi kaca =====
const TAMP = [540, 1300], SLC = [[-200, -30], [-70, -45], [60, -40], [190, -25], [-140, 35], [0, 32], [140, 35]];
const T8 = wt(8, 'dalamnya', -.25);
const dry7 = t => ease(inv(T7.dj + .1, T7.ke + .1, t));
const cam7b = t => CK(t, [[T7b, { x: 540, y: 1050, z: .95 }], [T7b + .6, { x: 540, y: 1100, z: 1.1 }, easeOut], [T7.ka, { x: 560, y: 1200, z: 1.4 }, ease], [wt(8, 'tapi', .2), { x: 545, y: 1290, z: 1.9 }, ease], [T8, { x: 540, y: 1320, z: 2.6 }, easeIn]], 1.5);
SH(T7b, T8, { tr: 'match', zoomOut: (() => { const c = cam7b(T8), p = toScreen(c, TAMP[0], TAMP[1] + 30); return { x: p[0], y: p[1], r: 58 * c.z }; })() }, (ctx, lt, t) => {
  const cam = cam7b(t), sp = inv(T7.dj, T7.ka, t);
  halamanBG(ctx, t, cam, { sunP: .1 + .8 * ease(sp) });
  rrect(ctx, 120, 1300, 840, 34, 8); fillStroke(ctx, '#b4693a', 6);
  const fb = EM(t, [[T7b, 'netral', { look: [-.6, .6] }], [T7.ka + .1, 'takjub', { look: [-.6, .3] }]], 22);
  const tap = T7.ka - .05, kt = Math.sin(clamp(inv(tap - .2, tap + .2, t)) * Math.PI);
  drawStick(ctx, C(BUDI, { x: 900, y: 1560, s: 600, flip: -1, armLen: 1.3, legs: standL, arms: { L: idleArms(t, 2).L, R: kt > .01 ? reach(900, 1560, 600, -1, lerp(820, 700, kt), lerp(1250, 1300, kt), 1) : idleArms(t, 2).R }, face: fb, headTilt: -(fb.pop || 0) * .05 }));
  const d = dry7(t);
  drawTampah(ctx, TAMP[0], TAMP[1], .95, { t }, c => SLC.forEach(([x, y], i) => drawKerupuk(c, x, y, .55, { p: 0, dry: d, tilt: .42, rot: i * .7, t, seed: 3 + i, glass: d })));
  sfxText(ctx, 'TING', 700, 1140, 60, inv(T7.ka, T7.ka + .08, t) * (1 - inv(T7.ka + .5, T7.ka + .6, t)), '#bfe9ff', .1);
  glint(ctx, 600, 1300, 120, t, T7.ka); glint(ctx, 420, 1270, 80, t, T7.ka + .1);
  timeGrade(ctx, Math.sin(clamp(sp) * Math.PI * 2) ** 2 * .45, 'senja');
});

// ===== DUNIA MIKRO: tetes air di dalam irisan (8, 11, 12, 13a) =====
function microDrops(ctx, t, o) {
  MICRO.forEach(([x, y], i) => {
    const bob = Math.sin(t * 2 + i) * 8;
    if (o.steam && o.steam[i] > 0) {
      const k = o.steam[i], r = o.r[i];
      if (k < 1) drawDrop(ctx, x, y + bob, 64 * (1 - k * .5), { hot: 1, face: o.face, t, alpha: 1 - k, wob: 1 });
      drawSteamBall(ctx, x, y + bob, r * backOut(clamp(k)), { face: o.sface, t, seed: i, alpha: clamp(k * 3) });
    } else drawDrop(ctx, x, y + bob, 64, { face: o.face, t, hot: o.hot || 0, wob: o.wob || 0 });
  });
}
// 8 "Tapi di dalamnya masih tersimpan sedikit air."
const T8w = { ma: wt(8, 'masih'), te: wt(8, 'tersimpan'), se: wt(8, 'sedikit'), ai: wt(8, 'air') };
SH(T8, ls(9), { tr: 'dissolve', zoomIn: { x: 560, y: 900, r: 200 } }, (ctx, lt, t) => {
  const cam = CK(t, [[T8, { x: 540, y: 900, z: 1.0 }], [T8 + .8, { x: 540, y: 900, z: 1.1 }, easeOut], [T8w.se, { x: 560, y: 880, z: 1.16 }], [ls(9), { x: 560, y: 890, z: 1.25 }, easeIn]], 2);
  microBG(ctx, t, cam, {});
  const f = EF(t, [[T8, { eyes: 'half', mouth: 'flat', look: [0, .3] }], [T8w.ai, 'bangga']], 23);
  microDrops(ctx, t, { face: f });
  for (let i = 0; i < MICRO.length; i++) glint(ctx, MICRO[i][0] + 40, MICRO[i][1] - 50, 70, t, T8w.ai + i * .06);
  const kq = inv(T8w.ma, T8w.ma + .25, t) * (1 - inv(T8w.se, T8w.se + .15, t)); if (kq > 0) qmark(ctx, 820, 380, 150 * backOut(kq), .2);
});

// ===== 9 "Terlalu basah atau terlalu kering, sama-sama susah mengembang." irisan lembek menetes vs retak berdebu =====
const T9 = { ba: wt(9, 'basah'), ke: wt(9, 'kering'), sa: wt(9, 'samasama'), su: wt(9, 'susah'), me: wt(9, 'mengembang') };
SH(ls(9), ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(9), { x: 540, y: 960, z: 1.0 }], [ls(9) + .6, { x: 540, y: 950, z: 1.08 }, easeOut], [T9.ba + .2, { x: 400, y: 930, z: 1.2 }, ease], [T9.ke + .2, { x: 690, y: 930, z: 1.2 }, ease], [T9.sa, { x: 540, y: 940, z: 1.0 }, ease], [ls(10), { x: 540, y: 950, z: 1.06 }]], 2);
  blurLayer(ctx, c => halamanBG(c, t, cam, { sunP: .5 }), 9); applyCam(ctx, cam, 1);
  const tryP = Math.sin(clamp(inv(T9.su, T9.me + .2, t)) * Math.PI) * .12;
  const kw = inv(T9.ba - .1, T9.ba + .3, t), kd = inv(T9.ke - .1, T9.ke + .3, t);
  // kiri: terlalu basah (lembek, menetes)
  drawKerupuk(ctx, 330, 860, 1.5, { p: tryP, dry: .15, wet: kw * (.8 + .1 * Math.sin(t * 5)), tilt: 1, t, seed: 5, glass: 0, face: EF(t, [[ls(9), 'cemas'], [T9.me + .2, { eyes: 'x', mouth: 'wobble' }]], 24) });
  if (kw > 0) for (let i = 0; i < 3; i++) { const q = (t * 1.2 + i / 3) % 1; drawDrop(ctx, 260 + i * 70, 1010 + q * 220, 14, { alpha: 1 - q }); }
  // kanan: terlalu kering (retak, debu)
  drawKerupuk(ctx, 750, 860, 1.5, { p: tryP, dry: 1, crack: kd, tilt: 1, t, seed: 6, glass: .3, face: EF(t, [[ls(9), 'datar'], [T9.me + .28, { eyes: 'x', mouth: 'flat' }]], 25) });
  if (kd > 0) puff(ctx, 790, 1010 + Math.sin(t * 3) * 6, 50, t, '#e9d9b8', 6, .6 * kd);
  popText(ctx, 'BASAH', 330, 560, 72, kw * (1 - inv(T9.ke, T9.ke + .1, t) * .4), '#8fd8ff', INK, -.06);
  popText(ctx, 'KERING', 750, 560, 72, kd, '#ffd27a', INK, .06);
  for (const [x, d] of [[330, 0], [750, .08]]) { const k = inv(T9.me + d, T9.me + d + .22, t); if (k > 0) { ctx.save(); ctx.translate(x + 120, 760); const s2 = backOut(k); ctx.scale(s2, s2); drawX(ctx, 0, 0, 62); ctx.restore(); } }
  const fb = EC(t, [[ls(9), 'curiga', { look: [-.6, -.7] }], [T9.ke, 'curiga', { look: [.6, -.7] }], [T9.su, 'sadar', { look: [0, -.8] }]], 26);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawStick(ctx, C(BUDI, { x: 540, y: 2640 + Math.sin(t * 2) * 6, s: 1250, shadow: false, headTilt: Math.sin(t * 2) * .03, arms: { L: [.25, -.1], R: [.25, -.1] }, face: fb }));
  ctx.restore();
});

// ===== 10 "Nah, sekarang masuk minyak panas." irisan kering jatuh ke minyak: CESS -> MATCH ke dalam irisan =====
const T10 = { na: wt(10, 'nah'), sk: wt(10, 'sekarang'), ms: wt(10, 'masuk'), mi: wt(10, 'minyak'), pa: wt(10, 'panas') };
const sl10 = t => { const p = inv(T10.ms - .1, T10.ms + .22, t); return p < 1 ? [lerp(430, KIN[0], easeIn(p)), lerp(990, KIN[1], easeIn(p)), lerp(1, .45, p), p] : [KIN[0], KIN[1], .45, 1]; };
const cam10 = t => CK(t, [[ls(10), { x: 520, y: 1060, z: 1.05 }], [ls(10) + .6, { x: 520, y: 1070, z: 1.25 }, easeOut], [T10.ms, { x: 540, y: 1080, z: 1.35 }], [T10.pa, { x: 560, y: 1100, z: 1.6 }, ease], [ls(11), { x: 562, y: 1114, z: 2.2 }, easeIn]], 2);
SH(ls(10), ls(11), { tr: 'match', zoomOut: (() => { const c = cam10(ls(11)), p = toScreen(c, KIN[0], KIN[1]); return { x: p[0], y: p[1], r: 70 * c.z }; })() }, (ctx, lt, t) => {
  const cam = cam10(t); dapurBack(ctx, t, cam);
  const s = sl10(t);
  const fi = EF(t, [[ls(10), 'netral', { look: [.7, .6] }], [T10.mi, 'takjub', { look: [.7, .6] }]], 27);
  ibu(ctx, t, fi, { L: idleArms(t, 1).L, R: armTo(IBUX, 1, s[3] < .05 ? 400 : lerp(400, 350, inv(T10.ms, T10.ms + .3, t)), s[3] < .05 ? 1010 : 1060, -1) });
  budi(ctx, t, EF(t, [[ls(10), 'curiga', { look: [-.8, .4] }], [T10.mi + .07, 'takjub', { look: [-.8, .5] }]], 28));
  dapurMeja(ctx);
  const sf = EF(t, [[ls(10), 'kaget']], 29);
  stoveWok(ctx, t, { heat: 1 }, s[3] >= 1 ? (c => drawKerupuk(c, KIN[0] - WOK[0], KIN[1] - WOK[1], .8, { p: 0, tilt: .45, t, seed: 2, face: sf })) : null);
  if (s[3] < 1) drawKerupuk(ctx, s[0], s[1], .8, { p: 0, tilt: s[2], rot: s[3] * 2, t, seed: 2 });
  splash(ctx, KIN[0], KIN[1], t, T10.ms + .22, 11);
  sfxText(ctx, 'CESS', 380, 930, 74, inv(T10.ms + .22, T10.ms + .32, t) * (1 - inv(T10.pa + .2, T10.pa + .3, t)), '#fff', -.12);
  innerGlow(ctx, KIN[0], KIN[1], 90, inv(T10.pa - .2, ls(11), t) * .8, t, '255,140,40');
});

// ===== 11 "Air yang tersisa di dalam langsung berubah jadi uap." panas masuk, tetes air jadi gelembung uap =====
const T11 = { te: wt(11, 'tersisa'), la: wt(11, 'langsung'), be: wt(11, 'berubah'), ua: wt(11, 'uap') };
const stK = (t, i) => inv(T11.be + i * .08, T11.ua + .1 + i * .08, t);
SH(ls(11), ls(12), {}, (ctx, lt, t) => {
  const cam = CK(t, [[ls(11), { x: 540, y: 900, z: 1.15 }], [ls(11) + .6, { x: 545, y: 900, z: 1.05 }, easeOut], [T11.ua, { x: 548, y: 902, z: 1.0 }], [ls(12), { x: 550, y: 905, z: .95 }]], 3);
  microBG(ctx, t, cam, { heat: inv(ls(11), T11.la, t) });
  const f = EF(t, [[ls(11), 'cemas', { look: [.6, .6] }], [T11.la, 'kaget']], 30);
  const sface = EF(t, [[ls(11), 'takjub']], 31);
  microDrops(ctx, t, { face: f, hot: inv(ls(11), T11.la, t), wob: inv(T11.te, T11.la, t), steam: MICRO.map((_, i) => stK(t, i)), r: MICRO.map(() => 95), sface });
  for (let i = 0; i < MICRO.length; i++) { const k = stK(t, i); if (k > 0 && k < .6) burst(ctx, MICRO[i][0], MICRO[i][1], 120 * (1 - k), 10, 'rgba(255,255,255,.7)', i + 2); }
});

// ===== 12 "Uap butuh ruang jauh lebih besar, jadi ia mendorong dari dalam." uap membengkak, mendorong dinding gel =====
const T12 = { ru: wt(12, 'ruang'), ja: wt(12, 'jauh'), be: wt(12, 'besar'), md: wt(12, 'mendorong'), da: wt(12, 'dalam') };
const r12 = t => 95 + 70 * ease(inv(T12.ru - .1, T12.ru + .3, t)) + 90 * backOut(clamp(inv(T12.ja, T12.be + .2, t)));
SH(ls(12), ls(13), {}, (ctx, lt, t) => {
  const dm = t - T12.md; let cam = CK(t, [[ls(12), { x: 550, y: 905, z: .95 }], [T12.ja, { x: 550, y: 905, z: .9 }], [T12.be + .2, { x: 545, y: 900, z: .72 }, ease], [ls(13), { x: 545, y: 900, z: .7 }]], 3);
  if (dm > 0 && dm < .8) { const s = shake(t * 3, 12 * (1 - dm / .8), 3); cam = Object.assign({}, cam, { x: cam.x + s[0], y: cam.y + s[1] }); }
  microBG(ctx, t, cam, { heat: 1, soft: inv(T12.md - .2, T12.md + .2, t) });
  const sface = EF(t, [[ls(12), 'takjub'], [T12.md, 'ngeden']], 32);
  const r = r12(t), pushK = dm > 0 ? 1 + .06 * Math.sin(dm * 16) : 1;
  MICRO.forEach(([x, y], i) => { const d = Math.hypot(x - 540, y - 900) || 1; const a = Math.atan2(y - 900, x - 540); for (let j = 0; j < 4; j++) { const aa = a + (j - 1.5) * .9; pushArrow(ctx, x + Math.cos(aa) * (r + 10), y + Math.sin(aa) * (r + 10), aa, 90 + 30 * Math.sin(dm * 10 + j), inv(T12.md, T12.md + .2, t) * (1 - inv(ls(13) - .3, ls(13), t))); } });
  MICRO.forEach(([x, y], i) => drawSteamBall(ctx, x, y + Math.sin(t * 2 + i) * 8, r * pushK, { face: sface, t, seed: i }));
  popText(ctx, 'UAP', 540, 260, 110, inv(T12.ru, T12.ru + .25, t) * (1 - inv(T12.md, T12.md + .2, t)), '#fff', INK, -.05);
});

// ===== 13a "Gel yang melunak ikut melar, membentuk..." rongga terbentuk, kamera mundur: ternyata banyak =====
const T13 = { me: wt(13, 'melunak'), ik: wt(13, 'ikut'), ml: wt(13, 'melar'), mb: wt(13, 'membentuk'), ro: wt(13, 'ronggarongga'), ud: wt(13, 'udara') };
const T13b = T13.mb - .1;
const cam13 = t => CK(t, [[ls(13), { x: 545, y: 900, z: .7 }], [T13.ml, { x: 545, y: 905, z: .62 }, ease], [T13b - .25, { x: 545, y: 910, z: .42 }, ease], [T13b, { x: 545, y: 912, z: .5 }, easeIn]], 2);
SH(ls(13), T13b, { tr: 'match', zoomOut: { x: 540, y: 960, r: 140 } }, (ctx, lt, t) => {
  const cam = cam13(t);
  microBG(ctx, t, cam, { heat: 1, soft: 1 });
  const p = inv(ls(13), T13b - .2, t);
  drawPores(ctx, 545, 910, 2700, 4000, p, t, 0, 5);
  const sface = EF(t, [[ls(13), 'ngeden'], [T13.ml, 'bangga']], 33);
  MICRO.forEach(([x, y], i) => drawSteamBall(ctx, x, y, 255 * (1 + .03 * Math.sin(t * 8 + i)), { face: sface, t, seed: i, alpha: 1 - .6 * p }));
  popText(ctx, 'MELAR', 545, 140, 150, inv(T13.ml, T13.ml + .25, t), '#ffd27a', INK, -.06);
});

// ===== 13b "...rongga-rongga udara." di wajan: kerupuk mengembang besar (momen WOW) =====
const p13 = t => .12 + .88 * easeOut(inv(T13b, T13.ud + .25, t));
SH(T13b, ls(14), { zoomIn: (() => { const c = { x: 560, y: 1100, z: 1.9 }, p = toScreen(c, KIN[0], KIN[1]); return { x: p[0], y: p[1], r: 120 * c.z }; })() }, (ctx, lt, t) => {
  const cam = CK(t, [[T13b, { x: 560, y: 1100, z: 1.9 }], [T13b + .7, { x: 560, y: 1080, z: 1.45 }, easeOut], [ls(14), { x: 560, y: 1070, z: 1.35 }]], 2.5);
  dapurBack(ctx, t, cam);
  ibu(ctx, t, EF(t, [[T13b, 'kaget', { look: [.8, .3] }], [T13.ud, 'takjub', { look: [.8, .2] }]], 34));
  budi(ctx, t, EF(t, [[T13b, 'kaget', { look: [-.8, .3] }], [T13.ud + .07, 'takjub', { look: [-.8, .2] }]], 35));
  dapurMeja(ctx);
  const p = p13(t), jig = 1 + .05 * Math.sin(t * 20) * (1 - p * .5);
  stoveWok(ctx, t, { heat: 1 }, c => drawKerupuk(c, KIN[0] - WOK[0], KIN[1] - WOK[1] - 10 * p, 1.05 * jig, { p, tilt: .45 + .1 * p, t, seed: 2, face: EF(t, [[T13b, 'ngeden'], [T13.ud, 'bangga']], 36) }));
  for (let i = 0; i < 4; i++) { const q = (t * .9 + i / 4) % 1; puff(ctx, KIN[0] - 120 + i * 80, KIN[1] - 80 - q * 260, 22 + q * 30, t, '#ffffff', i + 4, (1 - q) * .55); }
  glint(ctx, KIN[0] + 170, KIN[1] - 90, 140, t, T13.ud);
});

// ===== 14 "Begitu airnya keluar, gelnya mengeras lagi." uap pergi, kerupuk diangkat serok: TING =====
const T14 = { ai: wt(14, 'airnya'), ke: wt(14, 'keluar'), ge: wt(14, 'gelnya'), me: wt(14, 'mengeras'), la: wt(14, 'lagi') };
const lift14 = t => ease(inv(T14.ge, T14.me + .1, t));
SH(ls(14), ls(15), { tr: 'whip' }, (ctx, lt, t) => {
  const L = lift14(t);
  const cam = CK(t, [[ls(14), { x: 560, y: 1070, z: 1.35 }], [T14.ke, { x: 560, y: 1050, z: 1.42 }, ease], [T14.me, { x: 600, y: 980, z: 1.4 }, ease], [ls(15), { x: 610, y: 960, z: 1.5 }]], 2);
  dapurBack(ctx, t, cam);
  ibu(ctx, t, EF(t, [[ls(14), 'takjub', { look: [.8, .3] }], [T14.me + .07, 'bangga', { look: [.8, 0] }]], 37));
  const sx = KIN[0] + 10, sy = KIN[1] - 210 * L + 20;
  budi(ctx, t, EM(t, [[ls(14), 'takjub', { look: [-.8, .3] }], [T14.me, 'bangga']], 38), { L: idleArms(t, 2).L, R: t > T14.ge - .3 ? armTo(BUDX, -1, 790, sy - 20, 1) : idleArms(t, 2).R });
  dapurMeja(ctx);
  const jig = L < 1 ? 1 + .03 * Math.sin(t * 20) * (1 - L) : 1;
  const kf14 = EF(t, [[ls(14), 'bangga']], 39);
  stoveWok(ctx, t, { heat: 1 }, L < .35 ? (c => drawKerupuk(c, KIN[0] - WOK[0], KIN[1] - WOK[1] - 10 - 210 * L, 1.05 * jig, { p: 1, tilt: .55, t, seed: 2, face: kf14 })) : null);
  if (t > T14.ge - .3) drawSerok(ctx, sx, sy + 26, .9, -.05);
  if (L >= .35) drawKerupuk(ctx, sx, sy - 20, 1.05, { p: 1, tilt: lerp(.55, .8, inv(.35, 1, L)), t, seed: 2, face: kf14 });
  for (let i = 0; i < 6; i++) { const q = inv(T14.ai + i * .08, T14.ke + .6 + i * .08, t); if (q > 0 && q < 1) puff(ctx, KIN[0] - 150 + i * 60, KIN[1] - 60 - 210 * L - q * 420, 26 + q * 40, t, '#ffffff', i + 2, (1 - q) * .85); }
  if (L > .5) for (let i = 0; i < 3; i++) { const q = (t * 1.5 + i / 3) % 1; circle(ctx, sx - 40 + i * 40, sy + 40 + q * 120, 8); fillStroke(ctx, KRP.oil, 3); }
  sfxText(ctx, 'TING', 820, 760, 70, inv(T14.me, T14.me + .08, t), '#fff6c8', .1);
  glint(ctx, sx + 130, sy - 110, 150, t, T14.me); glint(ctx, sx - 120, sy - 60, 100, t, T14.la);
});

// ===== 15 "Jadilah kerupuk ringan yang kriuk!" Budi: kerupuk melayang di atas tangan, lalu digigit: KRIUK =====
const T15 = { ja: wt(15, 'jadilah'), ri: wt(15, 'ringan'), kr: wt(15, 'kriuk') };
SH(ls(15), ls(16), { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(15), { x: 760, y: 1000, z: 1.25 }], [ls(15) + .6, { x: 790, y: 980, z: 1.42 }, easeOut], [T15.kr, { x: 830, y: 990, z: 1.55 }, ease], [ls(16), { x: 840, y: 995, z: 1.65 }, easeIn]], 2);
  dapurBack(ctx, t, cam);
  ibu(ctx, t, EF(t, [[ls(15), 'lega', { look: [.8, 0] }], [T15.kr + .08, 'bangga']], 40));
  const fb = EM(t, [[ls(15), 'takjub', { look: [-.7, -.5] }], [T15.kr, 'bangga']], 41);
  const tb = T15.kr - .25, hov = Math.sin(t * 5) * 16;
  const kpos = t < tb ? [700, 830 + hov] : kf(t, [[tb, [700, 830]], [T15.kr - .02, [745, 1010], easeIn]]);
  const hand = t < tb ? [kpos[0] + 20, kpos[1] + 150] : [kpos[0] + 60, kpos[1] + 110];
  budi(ctx, t, fb, { L: idleArms(t, 2).L, R: armTo(BUDX, -1, hand[0], hand[1], 1) });
  dapurMeja(ctx);
  stoveWok(ctx, t, { heat: .4, fire: 0 });
  const bite = t > T15.kr, R = 185 * .82;
  ctx.save();
  if (bite) { ctx.beginPath(); ctx.rect(-2000, -2000, 5000, 5000); for (let i = 0; i < 3; i++) ctx.arc(kpos[0] + R - 10, kpos[1] - 40 + i * 40, 50, 0, TAU); ctx.clip('evenodd'); }
  drawKerupuk(ctx, kpos[0], kpos[1], .82, { p: 1, tilt: .95, rot: -.15 + (bite ? Math.sin((t - T15.kr) * 30) * .04 * Math.exp(-(t - T15.kr) * 5) : 0), t, seed: 2 });
  ctx.restore();
  if (t < tb) for (let i = 0; i < 3; i++) { const q = (t * 1.2 + i / 3) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .8; line(ctx, kpos[0] - 60 + i * 60, kpos[1] + 110 + q * 30, kpos[0] - 60 + i * 60, kpos[1] + 140 + q * 30, 6, '#fff'); ctx.restore(); }
  if (bite) { const d = t - T15.kr; for (let i = 0; i < 9; i++) { const a = 1.75 + i * .16, v = 200 + (i % 3) * 80; circle(ctx, kpos[0] + R - 30 + Math.cos(a) * v * d, kpos[1] + 60 + Math.sin(a) * v * d + 700 * d * d, 11); fillStroke(ctx, KRP.puff, 4); } }
  sfxText(ctx, 'KRIUK!', 760, 640, 120, inv(T15.kr, T15.kr + .1, t), '#ffd23a', -.1);
  popText(ctx, 'RINGAN', 700, 640, 64, inv(T15.ri, T15.ri + .2, t) * (1 - inv(T15.kr - .1, T15.kr, t)), '#fff', INK, -.08);
});

// ===== 16 "Benda apa lagi yang bikin kamu penasaran?" =====
SH(ls(16), ls(17), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(16), { x: 540, y: 900, z: 1 }], [ls(16) + .6, { x: 540, y: 890, z: 1.1 }, easeOut], [ls(17), { x: 540, y: 880, z: 1.16 }]], 3);
  blurLayer(ctx, c => dapurBack(c, t, cam), 7); applyCam(ctx, cam, 1);
  burst(ctx, 540, 660, 560 + Math.sin(t * 6) * 16, 16, '#ffe14d', 6);
  const fb = EC(t, [[ls(16), 'curiga', { look: [0, -.6] }], [wt(16, 'penasaran'), 'bangga']], 42);
  const fi = EC(t, [[ls(16), 'takjub'], [wt(16, 'penasaran', .08), 'bangga']], 43);
  drawStick(ctx, C(BUDI, { x: 300, y: 1720, s: 1000, shadow: false, arms: capArms(t), headTilt: .08 - (fb.pop || 0) * .05, face: fb }));
  drawStick(ctx, C(IBU, { x: 790, y: 1720, s: 1000, flip: -1, shadow: false, arms: { L: [.2, -.1], R: [2.6 + Math.sin(t * 8) * .12, .35] }, headTilt: -.05 - (fi.pop || 0) * .05, face: fi }));
  [[540, 400, 0, 230], [220, 520, .2, 150], [880, 500, .4, 150]].forEach(([x, y, d, sz], i) => { const k = inv(ls(16) + d, ls(16) + d + .25, t); if (k > 0) qmark(ctx, x, y + Math.sin(t * 4 + i) * 8, sz * backOut(k), (i - 1) * .25); });
});

// ===== 17 CTA "Subscribe Mitos Rumahan, besok ada lagi!" lalu kamera kembali ke tangan Budi + kerupuk mentah (loop ke frame 0) =====
const LOOP0 = ENDT - .6;
SH(ls(17), ENDT, { tr: 'cut' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(17), { x: 540, y: 1000, z: 1.0 }], [ls(17) + .5, { x: 540, y: 990, z: .96 }, easeOut], [LOOP0, { x: 560, y: 1000, z: 1.0 }], [ENDT, { x: 790, y: 1140, z: 1.55 }, ease]], 2);
  dapurBack(ctx, t, cam);
  const tS = wt(17, 'subscribe'), d = t - tS, k = inv(ls(17) + .05, ls(17) + .45, t), sc = backOut(k);
  const subbed = d > .35, press = d > .2 && d < .45 ? 1 : 0;
  ctx.save(); ctx.translate(540, 640); ctx.scale(sc, sc); ctx.translate(-540, -640);
  drawSubBanner(ctx, 540, 640, .98, { subbed, press, ring: subbed ? Math.sin((d - .35) * 22) * .35 * Math.exp(-(d - .35) * 2) : 0 }); ctx.restore();
  const w = Math.sin(t * 7), lp = inv(LOOP0, ENDT, t);
  ibu(ctx, t, EF(t, [[ls(17), 'bangga']], 44), { L: idleArms(t, 1).L, R: [2.4 + w * .25 * (1 - lp), .35] });
  const hy = lp > 0 ? kf(t, [[LOOP0, 1100], [ENDT - .2, 1215, easeOut], [ENDT, 1215]]) : 1060;
  budi(ctx, t, EF(t, [[ls(17), 'bangga'], [LOOP0, 'ngeden', { look: [-.7, .7] }]], 45), { L: lp > 0 ? idleArms(t, 2).L : [2.4 - w * .25, .35], R: armTo(BUDX, -1, 780, hy, 1) });
  dapurMeja(ctx);
  stoveWok(ctx, t, { heat: 1 });
  drawKerupuk(ctx, 760, hy - 40, .75, { p: 0, tilt: 1, rot: .2, t, seed: 2 });
  if (subbed) { const r = rng(4); for (let i = 0; i < 46; i++) { const x0 = r() * 1080, v = 300 + r() * 500, ph = r() * TAU, d0 = r() * .6, tt = d - .35 - d0; if (tt < 0) continue; ctx.save(); ctx.translate(x0 + Math.sin(tt * 3 + ph) * 40, -60 + tt * v); ctx.rotate(tt * 6 + ph); ctx.fillStyle = ['#ff5a3c', '#ffd23a', '#2cb35e', '#4a8cff', '#ff6fa8'][i % 5]; ctx.fillRect(-12, -7, 24, 14); ctx.restore(); } }
});
