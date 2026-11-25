// ---------- Fakta Unik: "Semut balik lagi padahal sudah disapu" (~56 dtk, tanpa CTA) ----------
// Bentuk cerita kedelapan: "perang naik level" (sapu -> tepok -> kipas angin, semua gagal; Ibu cukup lap air sabun sekali).
// Frame 0 = dapur, Budi menyapu barisan semut (semut terlempar), Rani menonton. Akhir: komposisi yang sama (loop).
// Mekanisme: semut mengikuti jejak bau (feromon), bukan penglihatan -> semut pertama menandai jalan -> makin tebal (jalan tol) -> sapu tidak menghapus, air sabun menghapus.
// Aturan v5/v6/v7: kamera selalu bergerak, semua waktu dari kata (wt), satu fungsi per aset (env_semut.js), tata letak SV/TD terkunci.
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
const win = (t, a, b, f = .15) => inv(a, a + f, t) * (1 - inv(b - .1, b, t));
const tagSeq = (ctx, t, list, y = 330) => list.forEach(([str, a, b, col, size]) => scrTag(ctx, str, inv(a, a + .15, t) * (b == null ? 1 : 1 - inv(b - .1, b, t)), col || '#fff', y, size || 104));
const inCam = (ctx, cam, f) => { ctx.save(); applyCam(ctx, cam, 1); f(ctx); ctx.restore(); };
// cari jarak tempuh d pada jalur saat syarat pertama kali terpenuhi
const dWhere = (pp, cond) => { for (let d = 0; d <= pp.len; d += 2) { const p = pathAt(pp, d); if (cond(p)) return d; } return pp.len; };

// ===== tata letak tokoh (dapur samping) =====
const FT = PS.back, S = 600, BX = SV.budi, RX = SV.rani, ARM = 1.6;
const HEADY = FT - .765 * S;                           // pusat kepala (dunia) = 1041
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, FT, S, flip, wx, wy, bend);
const standL = { L: [.1, -.04], R: [.1, -.04] };
const crossArms = { L: [.9, 2.0], R: [.9, 2.0] };
function tokoh(ctx, t, P, x, face, arms, flip = 1, extra = {}) { drawStick(ctx, C(P, Object.assign({ x, y: FT, s: S, flip, armLen: ARM, legs: standL, arms: arms || idleArms(t, x * .01), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
// bekas lap basah di atas meja (tampak samping)
function wetSide(c, x0, x1, t) { if (x1 <= x0) return; c.save(); rrect(c, x0, SV.top - 7, x1 - x0, 12, 6); c.fillStyle = SMP.wet; c.fill(); line(c, x0 + 10, SV.top - 4, x1 - 10, SV.top - 4, 3, SMP.wetHi); c.restore(); const R = rng(4); for (let i = 0; i < Math.floor((x1 - x0) / 60); i++) drawBusa(c, x0 + 30 + i * 60 + R() * 20, SV.top - 14, 11, t, 3, 30 + i, .95); }
// set dapur bersama. o: { fR, armsR, hideRani, fB, armsB, bx, hideBudi, bExtra, ibu: {x, face, arms, flip, extra}, ants(c), wet: [x0,x1], lid, jarFace, extra(c), after(c) }
function dapur(ctx, t, cam, o = {}) {
  dapurPisangBG(ctx, t, cam, { fridge: false });
  drawLubang(ctx, SV.hole[0], SV.hole[1], 1);
  if (!o.hideRani) tokoh(ctx, t, RANI, o.rx == null ? RX : o.rx, o.fR || EXPR.netral, o.armsR, 1, o.rExtra || {});
  if (o.ibu) tokoh(ctx, t, IBU, o.ibu.x, o.ibu.face || EXPR.netral, o.ibu.arms, o.ibu.flip || 1, o.ibu.extra || {});
  if (!o.hideBudi) tokoh(ctx, t, BUDI, o.bx == null ? BX : o.bx, o.fB || EXPR.netral, o.armsB, -1, o.bExtra || {});
  mejaPisang(ctx);
  if (o.wet) wetSide(ctx, o.wet[0], o.wet[1], t);
  if (o.under) o.under(ctx);
  drawToplesGula(ctx, SV.jar[0], SV.jar[1], .8, { lid: o.lid || 0, t, face: o.jarFace });
  if (o.ants) o.ants(ctx);
  if (o.extra) o.extra(ctx);
  if (o.after) o.after(ctx);
}
// barisan semut di meja samping (tanpa gangguan)
const AV = 200, AGAP = 62, AT0 = -12, AN = 170, AS = .8;
const antD = (i, tl) => AV * (tl - AT0) - i * AGAP;
const sideAnts = (c, t, o = {}) => antLine(c, SVP, t, Object.assign({ s: AS, v: AV, gap: AGAP, start: AT0, n: AN }, o));
function polosBG(c, t, col1 = '#2a2f5e', col2 = '#4a3f7a') { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, col1); g.addColorStop(1, col2); c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.save(); c.globalAlpha = .18; for (let i = 0; i < 14; i++) { circle(c, (i * 233 + t * 20) % W, (i * 389) % H, 50 + (i % 3) * 30); c.fillStyle = '#ffffff'; c.fill(); } c.restore(); }

// ===== 0 HOOK: tiga kali Budi nyapu barisan semut, tiga kali mereka balik lewat jalan yang sama =====
const H0 = { ti: wt(0, 'tiga'), ny: wt(0, 'nyapu'), ti2: wt(0, 'tiga', 0, 1), ba: wt(0, 'balik'), ja: wt(0, 'jalan'), sa: wt(0, 'sama') };
// sapuan: ujung lidi bergerak kanan -> kiri dalam SW_D dtk, periode .7 dtk; tiga sapuan terakhir = 1X, 2X, 3X
const SW_D = .42, SW_X0 = 470, SW_X1 = 210, SW_LAST = 1.25;
const STROKES = []; for (let m = 13; m >= 0; m--) STROKES.push(SW_LAST - .7 * m);
const MAIN3 = [SW_LAST - 1.4, SW_LAST - .7, SW_LAST];
// sapuan terakhir yang sudah dimulai pada tl (periodik ke belakang untuk loop)
const lastStroke = tl => { if (tl < STROKES[0]) return STROKES[0] - .7 * Math.ceil((STROKES[0] - tl) / .7); let sk = STROKES[0]; for (const s of STROKES) if (s <= tl) sk = s; return sk; };
// pose sapu (ujung lidi tx,ty + rotasi)
function broomPose(tl) {
  const rest = { tx: 470, ty: 1250, rot: .25, spread: 0 };
  if (tl > SW_LAST + .7) { const k = easeOut(inv(SW_LAST + .7, SW_LAST + 1.1, tl)); return { tx: lerp(SW_X0, rest.tx, k), ty: lerp(SV.top - 50, rest.ty, k), rot: lerp(.75, rest.rot, k), spread: 0 }; }
  const sk = lastStroke(tl), u = tl - sk;
  if (u < SW_D) { const k = u / SW_D; return { tx: lerp(SW_X0, SW_X1, k), ty: SV.top + 2, rot: lerp(.55, .8, k), spread: .6 + .4 * Math.sin(k * Math.PI) }; }
  const k = easeInOut(inv(SW_D, .7, u)); return { tx: lerp(SW_X1, SW_X0, k), ty: SV.top - 70 * Math.sin(k * Math.PI), rot: lerp(.8, .55, k), spread: .2 };
}
const BR_S = .8, BR_L = 280 * BR_S;
const gripOf = bp => [bp.tx + BR_L * Math.sin(bp.rot), bp.ty - BR_L * Math.cos(bp.rot)];
// barisan disapu: zona di belakang ujung lidi kosong, lalu terisi lagi dari kiri (cepat di antara sapuan, pelan setelah sapuan ke-3)
function hookAnts(c, tl) {
  const sk = lastStroke(tl), u = tl - sk;
  const left = u < SW_D ? lerp(SW_X0, SW_X1, u / SW_D) - 10 : SW_X1 + (sk >= SW_LAST - .01 ? AV : 900) * (u - SW_D);
  sideAnts(c, tl, { hide: d => { const [x] = pathAt(SVP, d); return x > left && x < SW_X0 + 12; } });
  for (const s of [sk, sk - .7]) {
    const P = sideAnts(c, s, { skipDraw: () => true });
    P.forEach(p => { if (p.x < SW_X1 || p.x > SW_X0) return; const pass = s + SW_D * (SW_X0 - p.x) / (SW_X0 - SW_X1), q = (tl - pass) / .8; if (q < 0 || q > 1) return; const r = (p.i * 37 % 10) / 10;
      drawSemut(c, p.x - (220 + 140 * r) * q, SV.top - (420 + 160 * r) * q + 360 * q * q, AS, { t: tl, rot: q * (8 + 5 * r), fly: 1, alpha: 1 - inv(.7, 1, q), ph: p.i }); });
  }
}
const cam0 = tl => CK(tl, [[-3, { x: 450, y: 1195, z: 1.22 }], [0, { x: 445, y: 1200, z: 1.25 }, easeOut], [H0.ti2, { x: 420, y: 1212, z: 1.35 }, ease], [H0.ba, { x: 380, y: 1230, z: 1.5 }, ease], [ls(1), { x: 390, y: 1225, z: 1.55 }, easeIn]], 2);
// tl < 0 = persiapan (dipakai di akhir video untuk loop); semua gerak fungsi dari tl sehingga frame akhir = frame 0
function hookScene(ctx, t, cam, tl) {
  const bp = broomPose(tl), g = gripOf(bp), sweeping = tl < SW_LAST + .7;
  dapur(ctx, tl, cam, { hideRani: true,
    fB: EM(tl, [[-9, 'ngeden', { look: [-.8, .6] }], [H0.ti2 + .1, 'kaget', { look: [-.8, .5] }], [H0.sa, 'meringis']], 2),
    armsB: { R: armTo(BX, -1, g[0] + 10, g[1] + 20, -1), L: sweeping ? armTo(BX, -1, g[0] + 40, g[1] + 70, -1) : [.3, -.3] },
    ants: c => hookAnts(c, tl),
    after: c => drawSapu(c, g[0], g[1], BR_S, bp.rot, { spread: bp.spread }) });
}
SH(0, ls(1), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  MAIN3.forEach((sk, j) => scrTag(ctx, (j + 1) + 'X DISAPU', inv(sk - .15, sk, t) * (1 - inv((MAIN3[j + 1] || H0.ti2) - .15, MAIN3[j + 1] || H0.ti2, t)), j === 2 ? '#ffd23a' : '#fff', 330, 104));
  sfxS(ctx, 'SREKK', 300, 700, 70, win(t, -.2, H0.ti2), '#fff', -.1);
  tagSeq(ctx, t, [['BALIK LAGI!', H0.ba, H0.ja, '#ff8a8a', 110], ['JALAN YANG SAMA', H0.ja, null, '#ffd23a', 96]]);
});

// ===== 1 Rani ngakak: "Semutnya dendam sama kamu, Bud!" =====
const T1 = { ra: wt(1, 'rani'), ng: wt(1, 'ngakak'), se: wt(1, 'semutnya'), de: wt(1, 'dendam'), ka: wt(1, 'kamu'), bu: wt(1, 'bud') };
const restBroom = c => { const bp = { tx: 470, ty: 1250, rot: .25 }, g = gripOf(bp); drawSapu(c, g[0], g[1], BR_S, bp.rot); return g; };
SH(ls(1), ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(1), { x: 420, y: 1200, z: 1.3 }], [ls(2), { x: 440, y: 1200, z: 1.4 }]], 3);
  const g = gripOf({ tx: 470, ty: 1250, rot: .25 });
  blurLayer(ctx, c => dapur(c, t, cam, { hideRani: true, fB: EF(t, [[ls(1), 'meringis']], 4), armsB: { R: armTo(BX, -1, g[0] + 10, g[1] + 20, -1), L: [.3, -.3] }, ants: c2 => sideAnts(c2, t), after: restBroom }), 9);
  scr(ctx, c => {
    const ak = backOut(inv(T1.se - .2, T1.se + .15, t)), fume = inv(T1.de, T1.de + .2, t);
    if (ak > 0) { const shk = fume * Math.sin(t * 40) * 6;
      drawSemut(c, 880 + shk, 600, 3.4 * ak + .01, { flip: -1, t, walk: 0, sniff: .4, face: EC(t, [[ls(1), 'curiga', { look: [-.8, .1] }], [T1.de, { eyes: 'half', mouth: 'teeth', browAng: -.6 }]], 5) });
      if (fume > 0) for (let i = 0; i < 3; i++) { const q = ((t - T1.de) * 1.5 + i / 3) % 1; puff(c, 760 + i * 40 + q * 30, 450 - q * 160, 26 + q * 22, t + i, '#ffffff', 3 + i, fume * (1 - q)); } }
    const laugh = inv(T1.ng - .1, T1.ng + .1, t), sh = laugh * Math.sin(t * 34) * 9;
    drawStick(c, C(RANI, { x: 230 + sh, y: 2250, s: 1800, shadow: false, flip: 1, armLen: 1.3, arms: { L: [.2, -.1], R: [lerp(.3, 1.85, easeOut(inv(T1.se - .2, T1.se + .1, t))), .1] },
      face: EC(t, [[ls(1), 'licik', { look: [.8, -.3] }], [T1.ng, { eyes: 'happy', mouth: 'teeth', browUp: .5 }], [T1.ka, { eyes: 'happy', mouth: 'grin', browUp: .8 }]], 7), headTilt: -.06 + laugh * Math.sin(t * 17) * .05 }));
  });
  sfxS(ctx, 'WKWKWK', 300, 520, 74, win(t, T1.ng, T1.de + .2), '#fff', -.12);
  tagSeq(ctx, t, [['DENDAM?!', T1.de, null, '#ff8a8a', 130]]);
});

// ===== 2 Budi naik level. Semutnya ditepok satu-satu =====
const T2 = { bu: wt(2, 'budi'), na: wt(2, 'naik'), le: wt(2, 'level'), se: wt(2, 'semutnya'), di: wt(2, 'ditepok'), sa: wt(2, 'satusatu') };
const SLAPS = (() => { const times = [T2.se + .1, T2.di + .15, T2.sa, T2.sa + .42], xs = [400, 450, 350, 420], used = new Set();
  return times.map((tt, k) => { let best = -1, bd = 1e9; for (let i = 0; i < AN; i++) { if (used.has(i)) continue; const d = antD(i, tt); if (d < 0 || d > SVP.len) continue; const [x] = pathAt(SVP, d); if (Math.abs(x - xs[k]) < bd) { bd = Math.abs(x - xs[k]); best = i; } }
    used.add(best); const [x, y] = pathAt(SVP, antD(best, tt)); return { t: tt, i: best, x, y }; }); })();
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(2), { x: 540, y: 1200, z: 1.6 }], [T2.le, { x: 500, y: 1250, z: 1.9 }, easeOut], [T2.sa, { x: 470, y: 1270, z: 2.0 }, ease], [ls(3), { x: 465, y: 1272, z: 2.05 }, easeIn]], 2.2);
  // tangan: naik di atas sasaran berikutnya, turun cepat tepat di waktu tepok
  let k = SLAPS.findIndex(s => t < s.t + .25); if (k < 0) k = SLAPS.length - 1; const sl = SLAPS[k];
  const down = t < sl.t ? easeIn(inv(sl.t - .14, sl.t, t)) : 1 - easeOut(inv(sl.t + .05, sl.t + .25, t));
  const hx = sl.x, hy = lerp(1170, SV.top - 18, t < T2.se - .2 ? 0 : down);
  dapur(ctx, t, cam, { hideRani: true,
    fB: EM(t, [[ls(2), 'curiga', { look: [-.8, .5] }], [T2.na, 'ngeden', { look: [-.8, .6] }], [T2.di, 'licik', { look: [-.8, .7] }], [T2.sa + .1, 'ngeden', { look: [-.8, .7] }]], 8),
    armsB: { L: armTo(BX, -1, hx + 20, hy - 10, -1), R: [.3, -.3] },
    ants: c => { sideAnts(c, t, { hide: (d, i) => SLAPS.some(s => s.i === i && t >= s.t) });
      SLAPS.forEach((s, j) => { if (t < s.t) return; drawSemut(c, s.x, s.y + 2, AS, { t, walk: 0, flat: 1, face: EF(t, [[s.t, { eyes: 'spiral', mouth: 'wobble' }]], 9 + j) }); }); },
    after: c => { circle(c, hx + 20, hy - 10, 22); fillStroke(c, INK, 0); } });
  SLAPS.forEach(s => { const [sx, sy] = toScreen(cam, s.x, s.y); sfxS(ctx, 'PLOK!', sx, sy - 170, 96, win(t, s.t, s.t + .5), '#fff', -.1); });
  tagSeq(ctx, t, [['LEVEL 2', T2.na - .05, T2.se, '#9dff7a', 130], ['DITEPOK!', T2.di, null, '#ffd23a', 110]]);
});

// ===== 3 Masih datang? Kipas angin dinyalain, semua terbang =====
const T3 = { ma: wt(3, 'masih'), da: wt(3, 'datang'), ki: wt(3, 'kipas'), an: wt(3, 'angin'), ny: wt(3, 'dinyalain'), se: wt(3, 'semua'), te: wt(3, 'terbang') };
const FANX = 1000, FANS = .5, FANHY = SV.top - 640 * FANS;
SH(ls(3), ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(3), { x: 470, y: 1210, z: 1.65 }], [T3.ki, { x: 560, y: 1170, z: 1.25 }, ease], [T3.se, { x: 560, y: 1150, z: 1.18 }, ease], [ls(4), { x: 520, y: 1140, z: 1.2 }, easeIn]], 2.4);
  const fk = backOut(inv(T3.ki - .1, T3.ki + .2, t)), on = inv(T3.ny - .1, T3.ny + .4, t), tau = T3.se - .05;
  dapur(ctx, t, cam, {
    fR: EF(t, [[ls(3), 'datar', { look: [.8, .2] }], [T3.se + .05, 'kaget', { look: [.8, .3] }]], 11), armsR: crossArms,
    fB: EM(t, [[ls(3), 'cemas', { look: [-.8, .6] }], [T3.ki, 'licik', { look: [.8, -.2] }], [T3.te, 'bangga']], 12),
    armsB: t > T3.te ? crossArms : { L: [.3, -.3], R: armTo(BX, -1, BX + 140, 1160, 1) },
    under: c => { if (fk > 0) drawFan(c, FANX, SV.top, FANS * fk + .01, t, on); },
    ants: c => {
      if (t < tau) { sideAnts(c, t); return; }
      const P = sideAnts(c, tau, { skipDraw: () => true });
      P.forEach(p => { const q = (t - tau) * (1.1 + (p.i % 5) * .12), r = (p.i * 37 % 10) / 10;
        drawSemut(c, p.x - q * (700 + 300 * r), p.y - q * (420 + 220 * r) + q * q * 160, AS, { t, rot: q * (10 + 5 * r), fly: 1, ph: p.i, alpha: 1 - inv(.9, 1.4, q) }); }); },
    after: c => { if (on > 0) for (let i = 0; i < 6; i++) { const p = ((t - T3.ny) * .9 + i / 6) % 1.25; drawWind(c, FANX - 120, FANHY + 215 + i * 18, Math.PI + .18 + (i % 3) * .05, 700, p, t, '#ffffff', 10); } } });
  if (t > T3.da && t < T3.ki + .2) inCam(ctx, cam, c => qmark(c, BX - 40, HEADY - 190, 130, -.1, inv(T3.da, T3.da + .15, t) * (1 - inv(T3.ki, T3.ki + .2, t))));
  tagSeq(ctx, t, [['MASIH DATANG?', ls(3) - .05, T3.ki, '#fff', 100], ['LEVEL 3', T3.ki, T3.se, '#9dff7a', 130]]);
  sfxS(ctx, 'WUSSS!', 760, 640, 90, win(t, T3.se, ls(4) + 1), '#fff', -.1);
});

// ===== 4 (meja dari atas) Sepuluh menit kemudian, barisan baru datang. Garisnya sama persis =====
const T4 = { se: wt(4, 'sepuluh'), me: wt(4, 'menit'), ke: wt(4, 'kemudian'), ba: wt(4, 'barisan'), da: wt(4, 'datang'), ga: wt(4, 'garisnya'), sa: wt(4, 'sama'), pe: wt(4, 'persis') };
const TA = { s: .82, v: 300, gap: 104 };
const tdAnts = (c, t, o = {}) => antLine(c, TDP, t, Object.assign({ view: 'top', s: TA.s, v: TA.v, gap: TA.gap, n: 30 }, o));
SH(ls(4), ls(5), { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(4), { x: 520, y: 700, z: 1.05 }], [T4.ba, { x: 500, y: 680, z: 1.1 }, ease], [T4.ga, { x: 490, y: 660, z: 1.14 }, ease], [ls(5), { x: 480, y: 650, z: 1.18 }, easeIn]], 1.2);
  mejaAtasBG(ctx, t, cam, {});
  tdAnts(ctx, t, { start: T4.ba - .35 });
  drawGarisLama(ctx, TDP, inv(T4.ga, T4.sa + .3, t) * (1 - inv(ls(5) - .3, ls(5), t) * 0), t);
  if (t > T4.pe) { const k = backOut(inv(T4.pe, T4.pe + .2, t)); [[240, 380], [380, 760], [650, 935]].forEach(([x, y], i) => { const kk = backOut(inv(T4.pe + i * .1, T4.pe + i * .1 + .2, t)); if (kk > 0) drawCheck(ctx, x + 70, y - 40, 42 * kk); }); }
  // jam: sepuluh menit berlalu
  const ck = win(t, ls(4) - .2, T4.ba + .1); if (ck > 0) scr(ctx, c => { c.save(); c.translate(540, 560); const b = backOut(ck); c.scale(b, b); drawWallClock(c, 0, 0, 120, 3 + 2 * inv(T4.se, T4.ke + .4, t), 0); c.restore(); });
  tagSeq(ctx, t, [['10 MENIT KEMUDIAN', ls(4) - .1, T4.ba, '#fff', 88], ['BARISAN BARU', T4.ba, T4.ga, '#ffd23a', 104], ['SAMA PERSIS!', T4.pe - .1, null, '#ff8a8a', 110]], 330);
});

// ===== 5a Ibu lewat, ngelap meja sekali pakai air sabun =====
const T5 = { ib: wt(5, 'ibu'), le: wt(5, 'lewat'), ng: wt(5, 'ngelap'), me: wt(5, 'meja'), sk: wt(5, 'sekali'), pa: wt(5, 'pakai'), ai: wt(5, 'air'), sa: wt(5, 'sabun'), te: wt(5, 'terus'), nu: wt(5, 'nutup'), to: wt(5, 'toples'), gu: wt(5, 'gula') };
const LAP0 = 130, LAP1 = 520;
const D_SSTOP = dWhere(SVP, p => p[0] > LAP0 - 25);
const I0_STOP = Math.ceil((AV * (wt(5, 'sabun') - AT0) - D_SSTOP) / AGAP);   // semut pertama yang tiba setelah meja dilap
const inWiped = (d, x1 = LAP1) => { const [x] = pathAt(SVP, d); return x > LAP0 - 20 && x < x1; };
const afterWipeAnts = (c, t) => sideAnts(c, t, { stop: { at: D_SSTOP, pile: 34, rank: i => i < I0_STOP ? -1e6 : i - I0_STOP }, hide: (d, i) => i < I0_STOP && inWiped(d) });
const lapX = t => lerp(LAP0, LAP1, easeInOut(inv(T5.ng - .05, T5.sa + .1, t)));
const ibuX = t => t < T5.ng ? lerp(-420, LAP0 - 170, easeOut(inv(ls(5) - .4, T5.ng, t))) : lapX(t) - 170;
SH(ls(5), T5.te, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 240, y: 1180, z: 1.3 }], [T5.ng, { x: 260, y: 1190, z: 1.4 }, ease], [T5.sa, { x: 420, y: 1200, z: 1.45 }, ease], [T5.te, { x: 450, y: 1200, z: 1.5 }, easeIn]], 2);
  const ix = ibuX(t), wc = walkCycle(ix + 420, S, 1), walking = t < T5.ng, lx = lapX(t), wiped = t > T5.ng ? lx : 0;
  dapur(ctx, t, cam, { hideRani: true,
    ibu: { x: ix, face: EM(t, [[ls(5), 'netral', { look: [.8, .3] }], [T5.ng, 'sombong', { look: [.6, .8] }]], 13), flip: 1,
      arms: walking ? { L: wc.arms.L, R: armTo(ix, 1, ix + 120, 1250, 1) } : { L: [.3, -.3], R: armTo(ix, 1, lx - 20, SV.top - 40, 1) },
      extra: walking ? { legs: wc.legs, bob: wc.bob, lean: wc.lean, footDir: 1 } : {} },
    fB: EF(t, [[ls(5), 'curiga', { look: [-.8, .3] }], [T5.sa, 'datar', { look: [-.8, .4] }]], 14),
    wet: t > T5.ng ? [LAP0 - 10, wiped] : null,
    ants: c => t > T5.sa + .1 ? afterWipeAnts(c, t) : sideAnts(c, t, { hide: (d) => t > T5.ng && inWiped(d, wiped) }),
    after: c => { if (walking) drawLap(c, ix + 130, 1240, .7, { t, rot: .2, foam: .6 }); else drawLap(c, lx, SV.top - 40, .8, { t, rot: 0, foam: 1 }); } });
  tagSeq(ctx, t, [['IBU LEWAT', ls(5) - .1, T5.ng, '#fff', 110], ['SEKALI LAP', T5.sk, T5.ai, '#ffd23a', 110], ['AIR SABUN', T5.ai, null, '#bfe9ff', 120]]);
  sfxS(ctx, 'SRET!', 700, 700, 80, win(t, T5.sk, T5.te + .5), '#fff', -.1);
});
// ===== 5b terus nutup toples gula =====
SH(T5.te, ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[T5.te, { x: 820, y: 1160, z: 2.0 }], [T5.to, { x: 845, y: 1170, z: 2.3 }, easeOut], [ls(6), { x: 850, y: 1175, z: 2.4 }, easeIn]], 2);
  const lid = easeInOut(inv(T5.nu - .1, T5.to + .15, t));
  dapur(ctx, t, cam, { hideRani: true, ibu: { x: LAP1 - 170, face: EF(t, [[T5.te, 'sombong', { look: [.8, .2] }]], 15) },
    fB: EF(t, [[T5.te, 'curiga', { look: [.3, .5] }], [T5.gu, 'kaget', { look: [.3, .5] }]], 16), wet: [LAP0 - 10, LAP1], lid,
    jarFace: EF(t, [[T5.te, 'cemas', { look: [-.6, -.4] }], [T5.to + .1, 'lega']], 17),
    ants: c => afterWipeAnts(c, t) });
  inCam(ctx, cam, c => glint(c, SV.jar[0] + 70, SV.jar[1] - 230 * .8, 70, t, T5.to + .15));
  sfxS(ctx, 'KLIK!', 760, 640, 100, win(t, T5.to + .1, ls(6) + 1), '#fff', -.1);
  scrTag(ctx, 'DITUTUP', inv(T5.gu, T5.gu + .15, t), '#9dff7a', 330, 110);
});

// ===== 6 (dari atas) Semut berikutnya datang, berhenti di bekas lap, muter-muter, bingung =====
const T6 = { se: wt(6, 'semut'), be: wt(6, 'berikutnya'), da: wt(6, 'datang'), bh: wt(6, 'berhenti'), bk: wt(6, 'bekas'), la: wt(6, 'lap'), mu: wt(6, 'mutermuter'), bi: wt(6, 'bingung') };
const D_STOP = dWhere(TDP, p => p[1] > 585), D_BAND2 = dWhere(TDP, p => p[1] > 740);
const T6_START = T6.bh - (D_STOP / 200);           // semut terdepan tiba di batas basah tepat saat "berhenti"
const leadAnts = (c, t, o = {}) => antLine(c, TDP, t, Object.assign({ view: 'top', s: 1.0, v: 200, gap: 120, n: 7, start: T6_START, stop: { at: D_STOP, pile: 105 } }, o));
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(6), { x: 250, y: 470, z: 2.0 }], [T6.bh, { x: 240, y: 540, z: 2.35 }, ease], [T6.mu, { x: 235, y: 560, z: 2.5 }, ease], [ls(7), { x: 235, y: 565, z: 2.55 }, easeIn]], 1.5);
  mejaAtasBG(ctx, t, cam, { wet: 1 });
  const P = leadAnts(ctx, t, { skipDraw: i => i === 0 });
  const L = P.find(p => p.i === 0);
  if (L) { const spin = TAU * 2 * easeInOut(inv(T6.mu, T6.bi, t)) + (t > T6.bi ? Math.sin((t - T6.bi) * 6) * .4 : 0);
    drawSemut(ctx, L.x, L.y, 1.5, { view: 'top', rot: L.a, spin, t, walk: t < T6.bh ? 1 : .5, sniff: inv(T6.bh, T6.bh + .2, t),
      face: EC(t, [[ls(6), 'netral', { look: [0, .3] }], [T6.bh, 'curiga', { look: [0, .8] }], [T6.bi, 'cemas']], 18) });
    if (t > T6.bi - .1) inCam(ctx, cam, c => { qmark(c, L.x + 40, L.y - 80, 70, -.1, inv(T6.bi - .1, T6.bi + .1, t)); qmark(c, L.x - 50, L.y - 60, 46, .2, inv(T6.bi, T6.bi + .2, t)); }); }
  tagSeq(ctx, t, [['BERHENTI', T6.bh, T6.mu, '#fff', 120], ['MUTER-MUTER', T6.mu, T6.bi, '#ffd23a', 104], ['BINGUNG', T6.bi, null, '#ff8a8a', 120]], 300);
});

// ===== 7a Barisannya bubar =====
const T7 = { ba: wt(7, 'barisannya'), bu: wt(7, 'bubar'), bd: wt(7, 'budi'), me: wt(7, 'melongo') };
const FARD = [D_BAND2 + 30, D_BAND2 + 140, D_BAND2 + 250, D_BAND2 + 380, D_BAND2 + 500];   // semut lama di seberang bekas lap
SH(ls(7), T7.bd, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(7), { x: 380, y: 640, z: 1.3 }], [T7.bu, { x: 400, y: 660, z: 1.2 }, ease], [T7.bd, { x: 410, y: 670, z: 1.16 }, easeIn]], 1.5);
  mejaAtasBG(ctx, t, cam, { wet: 1 });
  const tau = T7.bu - .15, sc = inv(tau, tau + 1.2, t);
  const P = leadAnts(ctx, Math.min(t, tau), { skipDraw: () => true });
  FARD.forEach((d, j) => P.push(Object.assign({ i: 20 + j }, (([x, y, a]) => ({ x, y, a }))(pathAt(TDP, d)))));
  P.forEach(p => { const r = rng(p.i * 13 + 5), ang = r() * TAU, sp = 260 + r() * 200, wig = Math.sin(t * 7 + p.i) * .5, q = Math.max(0, t - tau);
    const x = p.x + Math.cos(ang) * sp * q, y = p.y + Math.sin(ang) * sp * q;
    drawSemut(ctx, x, y, p.i === 0 ? 1.5 : (p.i >= 20 ? TA.s : 1.0), { view: 'top', rot: q > 0 ? ang + wig : p.a, t, alpha: 1 - inv(.7, 1.2, q),
      face: p.i === 0 ? EF(t, [[ls(7), 'cemas'], [tau, 'kaget']], 19) : undefined }); });
  scrTag(ctx, 'BUBAR!', inv(T7.bu, T7.bu + .15, t), '#ffd23a', 330, 140);
});
// ===== 7b Budi melongo =====
SH(T7.bd, ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[T7.bd, { x: 600, y: 1080, z: 2.2 }], [T7.me, { x: 615, y: 1060, z: 2.6 }, easeOut], [ls(8), { x: 620, y: 1055, z: 2.75 }, easeIn]], 1.5);
  const drop = easeIn(inv(T7.me, T7.me + .35, t)), g = gripOf({ tx: 470, ty: 1250, rot: .25 });
  dapur(ctx, t, cam, { hideRani: true, ibu: { x: LAP1 - 170, face: EF(t, [[T7.bd, 'bangga']], 20) },
    fB: EC(t, [[T7.bd, 'curiga', { look: [-.4, .6] }], [T7.me, { eyes: 'wide', mouth: 'o', browUp: 1 }]], 21), bExtra: { headTilt: -.04 },
    armsB: { R: drop < 1 ? armTo(BX, -1, g[0] + 10, g[1] + 20 + drop * 60, -1) : [.3, -.3], L: [.3, -.3] }, wet: [LAP0 - 10, LAP1], lid: 1, ants: c => afterWipeAnts(c, t),
    after: c => { const bp = { tx: 470 + drop * 30, ty: 1250 + drop * 70, rot: .25 + drop * 1.1 }; const gg = gripOf(bp); drawSapu(c, gg[0], gg[1] + drop * 40, BR_S, bp.rot); } });
  tagSeq(ctx, t, [['MELONGO', T7.me, null, '#fff', 120]], 300);
  sfxS(ctx, '?!', 800, 520, 120, inv(T7.me, T7.me + .15, t), '#ffd23a', .1);
});

// ===== 8 Ternyata semut nggak ngeliat jalan. Dia nyium jalan =====
const T8 = { te: wt(8, 'ternyata'), se: wt(8, 'semut'), ng: wt(8, 'nggak'), ne: wt(8, 'ngeliat'), ja: wt(8, 'jalan'), di: wt(8, 'dia'), ny: wt(8, 'nyium'), j2: wt(8, 'jalan', 0, 1) };
const FLAT = pathPrep([[-200, 1260], [1300, 1260]]);
SH(ls(8), ls(9), { tr: 'whip' }, (ctx, lt, t) => {
  const z = lerp(1, 1.12, inv(ls(8), ls(9), t)), pop = backOut(inv(ls(8) - .15, ls(8) + .25, t));
  scr(ctx, c => { polosBG(c, t); c.translate(540, 1000); c.scale(z, z); c.translate(-540, -1000);
    const ax = 330, ay = 1260, s = 6.6 * pop + .01, nyk = inv(T8.ny - .1, T8.ny + .2, t);
    drawJejak(c, FLAT, { k: easeOut(inv(T8.ny, T8.j2 + .3, t)), w: 30, t, pulse: 1 });
    drawSemut(c, ax, ay, s, { t, walk: .25, sniff: nyk, glow: nyk * .8, face: EF(t, [[ls(8), 'netral', { look: [.6, 0] }], [T8.ng, 'datar'], [T8.ny, 'takjub', { look: [.7, .5] }]], 22) });
    // penutup mata: "nggak ngeliat"
    const bk = backOut(inv(T8.ng - .1, T8.ng + .15, t)); if (bk > 0) { const hx = ax + 30 * s, hy = ay - 28 * s; c.save(); c.translate(hx, hy - 8); c.rotate(-.08); c.scale(bk, bk); rrect(c, -78, -24, 156, 44, 20); fillStroke(c, '#2b2f4a', 6); line(c, -78, 0, -120, 20, 10, '#2b2f4a'); c.restore(); }
    if (t > T8.ng && t < T8.di) { const ek = backOut(inv(T8.ne, T8.ne + .2, t)) * (1 - inv(T8.di - .2, T8.di, t)); c.save(); c.translate(820, 640); c.scale(ek, ek); ellipse(c, 0, 0, 90, 52); fillStroke(c, '#ffffff', 7); circle(c, 0, 0, 30); fillStroke(c, '#3a6ea8', 5); c.restore(); drawX(c, 820, 640, 110, inv(T8.ne + .1, T8.ne + .3, t) * (1 - inv(T8.di - .1, T8.di, t))); }
    if (nyk > 0) { const hx = ax + 52 * s, hy = ay - 40 * s; for (let i = 0; i < 3; i++) { const q = ((t * .8 + i / 3) % 1); circle(c, hx + 40 + q * 60, hy + 100 + q * 140, 16 * (1 - q) + 4); c.fillStyle = `rgba(${SMP.trailGlow},${.8 * nyk * (1 - q)})`; c.fill(); } }
  });
  tagSeq(ctx, t, [['BUKAN PAKAI MATA', T8.ng - .05, T8.di, '#fff', 92], ['NYIUM JALAN', T8.ny, null, '#f4c8ff', 116]], 300);
});

// ===== 9 (mode hidung semut) Semut pertama yang nemu gula ninggalin jejak bau sampai ke sarang =====
const T9 = { se: wt(9, 'semut'), pe: wt(9, 'pertama'), ne: wt(9, 'nemu'), gu: wt(9, 'gula'), ni: wt(9, 'ninggalin'), je: wt(9, 'jejak'), ba: wt(9, 'bau'), sp: wt(9, 'sampai'), sa: wt(9, 'sarang') };
const scoutD = t => lerp(TDP.len, 0, easeInOut(inv(T9.ni - .15, T9.sa + .2, t)));
SH(ls(9), ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  const d = scoutD(t), [sx, sy, sa] = pathAt(TDP, d);
  const cam = CK(t, [[ls(9), { x: 760, y: 1010, z: 2.0 }], [T9.gu, { x: 740, y: 1010, z: 2.2 }, ease], [T9.ni + .3, { x: 640, y: 960, z: 1.7 }, ease], [T9.sp, { x: 340, y: 640, z: 1.35 }, ease], [ls(10), { x: 470, y: 680, z: 1.1 }, easeIn]], 1.2);
  mejaAtasBG(ctx, t, cam, { night: inv(ls(9) - .1, ls(9) + .3, t) });
  drawJejak(ctx, TDP, { k: (TDP.len - d) / TDP.len, from: 'end', w: 12, t });
  const app = backOut(inv(T9.pe - .2, T9.pe + .1, t)), carry = t > T9.gu;
  drawSemut(ctx, sx, sy, 1.15 * app + .01, { view: 'top', rot: d < TDP.len - 1 ? sa + Math.PI : sa, t, walk: t > T9.ni - .15 && t < T9.sa + .2 ? 1 : .2, carry, glow: .9,
    face: EF(t, [[ls(9), 'curiga', { look: [0, .5] }], [T9.ne, 'takjub'], [T9.ni, 'bangga']], 23) });
  if (t < T9.ni) inCam(ctx, cam, c => glint(c, TD.jar[0] - 130, TD.jar[1], 60, t, T9.gu));
  // mahkota kecil penanda "pertama"
  inCam(ctx, cam, c => { if (app > .1) { c.save(); c.translate(sx, sy - 70 * 1.15); const k = backOut(inv(T9.pe, T9.pe + .2, t)); c.scale(k, k); text(c, '1', 0, 0, 46, '#ffd23a', INK, 8); c.restore(); } });
  tagSeq(ctx, t, [['SEMUT PERTAMA', T9.pe - .1, T9.ni, '#fff', 100], ['JEJAK BAU', T9.je, null, '#f4c8ff', 120]], 300);
});

// ===== 10 Tiap semut yang lewat nambahin baunya, jadi jalannya makin tebal, kayak jalan tol =====
const T10 = { ti: wt(10, 'tiap'), se: wt(10, 'semut'), le: wt(10, 'lewat'), na: wt(10, 'nambahin'), ba: wt(10, 'baunya'), ja: wt(10, 'jadi'), jl: wt(10, 'jalannya'), ma: wt(10, 'makin'), te: wt(10, 'tebal'), ka: wt(10, 'kayak'), j2: wt(10, 'jalan'), to: wt(10, 'tol') };
const TDPR = pathPrep(TD_PATH.slice().reverse());
SH(ls(10), ls(11), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(10), { x: 470, y: 680, z: 1.1 }], [T10.ma, { x: 480, y: 670, z: 1.16 }, ease], [T10.ka, { x: 470, y: 660, z: 1.2 }, ease], [ls(11), { x: 460, y: 650, z: 1.24 }, easeIn]], 1.2);
  mejaAtasBG(ctx, t, cam, { night: 1 });
  const road = easeInOut(inv(T10.ka - .1, T10.j2 + .2, t)), wv = lerp(12, 34, easeOut(inv(T10.ti, T10.te + .2, t)));
  drawJejak(ctx, TDP, { w: wv, t, pulse: 1, road });
  const n = Math.round(lerp(4, 14, inv(T10.ti, T10.te, t)));
  const gl = 1 - road * .7;
  antLine(ctx, TDP, t, { view: 'top', s: TA.s, v: 240, gap: 150, n: 30, start: ls(10) - 6, glow: gl, alpha: i => i < n * 2 ? 1 : 0, wob: 6 * (1 - road) });
  antLine(ctx, TDPR, t, { view: 'top', s: TA.s, v: 240, gap: 170, n: 30, start: ls(10) - 6.4, glow: gl, carry: () => true, alpha: i => i < n * 2 ? 1 : 0, wob: 6 * (1 - road) });
  inCam(ctx, cam, c => drawPapanTol(c, 430, 380, .9, inv(T10.to - .2, T10.to + .1, t)));
  tagSeq(ctx, t, [['+BAU', T10.na, T10.ja, '#f4c8ff', 120], ['MAKIN TEBAL', T10.ma, T10.ka, '#ffd23a', 110], ['JALAN TOL!', T10.ka, null, '#9dff7a', 120]], 300);
});

// ===== 11 Disapu, semutnya hilang, tapi jalannya tetap ada =====
const T11 = { di: wt(11, 'disapu'), se: wt(11, 'semutnya'), hi: wt(11, 'hilang'), ta: wt(11, 'tapi'), ja: wt(11, 'jalannya'), te: wt(11, 'tetap'), ad: wt(11, 'ada') };
const SW11 = { a: T11.di - .05, d: .7, x0: 1150, x1: -150 };
const brX11 = t => lerp(SW11.x0, SW11.x1, easeInOut(inv(SW11.a, SW11.a + SW11.d, t)));
SH(ls(11), ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(11), { x: 470, y: 680, z: 1.12 }], [T11.hi, { x: 460, y: 680, z: 1.16 }, ease], [T11.te, { x: 440, y: 660, z: 1.28 }, ease], [ls(12), { x: 430, y: 650, z: 1.32 }, easeIn]], 1.5);
  mejaAtasBG(ctx, t, cam, { night: 1 });
  drawJejak(ctx, TDP, { w: 34, t, pulse: 1 + inv(T11.ta, T11.te, t) * 2, a: 1 });
  const bx = brX11(t), tau = SW11.a;
  const opt = { view: 'top', s: TA.s, v: 240, gap: 150, n: 30, glow: .5, skipDraw: () => true };
  const A = antLine(ctx, TDP, Math.min(t, tau), Object.assign({ start: ls(10) - 6 }, opt)).concat(antLine(ctx, TDPR, Math.min(t, tau), Object.assign({ start: ls(10) - 6.4 }, opt)));
  A.forEach((p, j) => { const pass = tau + SW11.d * clamp((SW11.x0 - p.x) / (SW11.x0 - SW11.x1)); if (t < pass) { drawSemut(ctx, p.x, p.y, TA.s, { view: 'top', rot: p.a, t, glow: .5, walk: 0 }); return; }
    const q = (t - pass) * 1.6; if (q > 1) return; drawSemut(ctx, p.x - 600 * q, p.y + (j % 2 ? -1 : 1) * 260 * q, TA.s, { view: 'top', rot: p.a + q * 9, t, fly: 1, alpha: 1 - q }); });
  if (t > tau - .3 && t < tau + SW11.d + .3) drawSapu(ctx, bx, 720, 1.8, Math.PI / 2 + .25, { spread: .6 });
  inCam(ctx, cam, c => { glint(c, 380, 760, 90, t, T11.te); glint(c, 620, 980, 70, t, T11.te + .15); });
  tagSeq(ctx, t, [['SEMUT HILANG', T11.se, T11.ta, '#fff', 104], ['JALANNYA MASIH ADA', T11.ja - .05, null, '#f4c8ff', 90]], 300);
  sfxS(ctx, 'SREKK', 760, 620, 80, win(t, tau, tau + 1.1), '#fff', -.1);
});

// ===== 12 Air sabun ngapus baunya. Jalannya putus =====
const T12 = { ai: wt(12, 'air'), sa: wt(12, 'sabun'), ng: wt(12, 'ngapus'), ba: wt(12, 'baunya'), ja: wt(12, 'jalannya'), pu: wt(12, 'putus') };
const D_GAP0 = dWhere(TDP, p => p[1] > 600), D_GAP1 = D_BAND2;
const lap12 = t => easeInOut(inv(T12.ai - .05, T12.ba + .1, t));
SH(ls(12), ls(13), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(12), { x: 360, y: 600, z: 1.35 }], [T12.ng, { x: 320, y: 620, z: 1.5 }, ease], [T12.pu, { x: 290, y: 610, z: 1.7 }, ease], [ls(13), { x: 285, y: 605, z: 1.75 }, easeIn]], 1.5);
  const lk = lap12(t), lx = lerp(TD.band[0][0] - 60, TD.band[1][0] + 40, lk), gapK = inv(.2, .55, lk);
  mejaAtasBG(ctx, t, cam, { night: 1, wet: lk });
  const mid = (D_GAP0 + D_GAP1) / 2, half = (D_GAP1 - D_GAP0) / 2 * easeOut(gapK);
  drawJejak(ctx, TDP, { w: 34, t, pulse: 1, gap: gapK > 0 ? [mid - half, mid + half] : null });
  // semut yang datang dari sarang berhenti di ujung yang putus
  const P = antLine(ctx, TDP, t, { view: 'top', s: TA.s * 1.2, v: 220, gap: 100, n: 4, start: T12.ja - 1.6, stop: { at: D_GAP0 - 20, pile: 70 }, glow: .5 });
  if (t > T12.pu) inCam(ctx, cam, c => P.forEach((p, j) => { if (p.d > D_GAP0 - 140 - j * 80) qmark(c, p.x + 30, p.y - 60, 44, -.1, inv(T12.pu + j * .1, T12.pu + j * .1 + .15, t)); }));
  if (lk > 0 && lk < 1) drawLap(ctx, lx, lerp(TD.band[0][1], TD.band[1][1], lk) + 10, 1.5, { t, foam: 1, rot: .15 });
  const [gx, gy] = pathAt(TDP, mid); inCam(ctx, cam, c => { const k = backOut(inv(T12.pu - .1, T12.pu + .15, t)); if (k > 0) drawPalang(c, gx + 20, gy - 40, .9 * k + .01, .5); });
  tagSeq(ctx, t, [['AIR SABUN', T12.ai - .1, T12.ja, '#bfe9ff', 116], ['PUTUS!', T12.pu - .05, null, '#ff8a8a', 150]], 300);
  sfxS(ctx, 'SRET!', 760, 640, 80, win(t, T12.ng, T12.ja), '#fff', -.1);
});

// ===== 13a Sayang, Budi telat tahu =====
const T13 = { sy: wt(13, 'sayang'), bu: wt(13, 'budi'), te: wt(13, 'telat'), ta: wt(13, 'tahu'), so: wt(13, 'soalnya'), td: wt(13, 'tadi'), pa: wt(13, 'pagi') };
SH(ls(13), T13.so, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(13), { x: 520, y: 1110, z: 1.5 }], [T13.te, { x: 560, y: 1090, z: 1.7 }, ease], [T13.so, { x: 570, y: 1085, z: 1.75 }, easeIn]], 2);
  const g = gripOf({ tx: 470, ty: 1250, rot: .25 });
  dapur(ctx, t, cam, { hideRani: true, ibu: { x: 330, face: EF(t, [[ls(13), 'sombong', { look: [.8, 0] }]], 24), arms: crossArms },
    fB: EM(t, [[ls(13), 'datar', { look: [-.8, .3] }], [T13.te, 'sadar'], [T13.ta + .1, 'meringis']], 25),
    armsB: { R: armTo(BX, -1, g[0] + 10, g[1] + 20, -1), L: [.3, -.3] }, wet: [LAP0 - 10, LAP1], lid: 1, ants: c => afterWipeAnts(c, t), after: restBroom });
  tagSeq(ctx, t, [['TELAT TAHU', T13.te, null, '#ff8a8a', 120]], 330);
});
// ===== 13b Soalnya tadi pagi, -> komposisi frame 0 (loop) =====
SH(T13.so, ENDT, { tr: 'none' }, (ctx, lt, t) => {
  const tl = t - ENDT + 1 / 30, end = ENDT - .14;
  const c0 = cam0(Math.min(0, tl)), k = easeInOut(inv(T13.so, end, t));
  const cam = { x: lerp(570, c0.x, k), y: lerp(1085, c0.y, k), z: lerp(1.75, c0.z, k), r: 0 };
  hookScene(ctx, t, t >= end ? cam0(tl) : cam, tl);
  scrTag(ctx, 'TADI PAGI...', inv(T13.td, T13.td + .15, t) * (1 - inv(end - .45, end - .3, t)), '#fff', 330, 110);
  MAIN3.forEach((sk, j) => scrTag(ctx, (j + 1) + 'X DISAPU', inv(sk - .15, sk, tl) * (1 - inv((MAIN3[j + 1] || H0.ti2) - .15, MAIN3[j + 1] || H0.ti2, tl)), j === 2 ? '#ffd23a' : '#fff', 330, 104));
  sfxS(ctx, 'SREKK', 300, 700, 70, inv(-.2, 0, tl), '#fff', -.1);
});
