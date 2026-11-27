// ---------- Fakta Unik: "Ekor cicak putus masih joget" (~55 dtk, tanpa CTA) ----------
// Bentuk cerita kesebelas: "pahlawan palsu" (Budi bangga memotong ekor cicak, Rani: kamu yang ketipu). Rani tidak tampil menjelaskan; mekanisme lewat rontgen.
// Ruang tengah = rumahBG (env_jemur.js) malam tanpa hujan. Aset baru env_cicak.js. Loop: shot terakhir = hook dengan waktu negatif (sapu memukul, ekor jatuh).
const SHOTS = [];
const easeInOut = x => x * x * (3 - 2 * x);
const BUDI = { cols: ['#2f9b5a', '#2f9b5a'], hat: 'tuft', hatCol: INK, belt: false };
const C = (b, e) => Object.assign({}, b, e);
const LN = {}; WORDS.forEach(w => { (LN[w.line] = LN[w.line] || []).push(w); });
const ls = i => LN[i][0].s;
const nrm = s => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const fw = (i, str, n = 0) => { const w = LN[i].filter(w => nrm(w.w) === str)[n]; if (!w) throw new Error('kata tidak ada di baris ' + i + ': ' + str); return w.s; };
const wt = (i, str, d = 0, n = 0) => fw(i, str, n) + d;
const ENDT = WORDS[WORDS.length - 1].e + .6;
const SH = (s, e, o, draw) => SHOTS.push(Object.assign({ start: s, end: e, draw }, o));
const CK2 = (t, keys, sh = 2) => camKeys(t, t, keys, sh);
const _warned = new Set();
const gapCheck = (keys, seed) => { for (let i = 1; i < keys.length; i++) if (keys[i][0] - keys[i - 1][0] < .55 && !_warned.has(seed)) { _warned.add(seed); console.log('PERINGATAN ekspresi seed ' + seed + ': jarak ganti ' + (keys[i][0] - keys[i - 1][0]).toFixed(2) + ' dtk < 0,55'); } };
const EF = (t, keys, seed) => (gapCheck(keys, seed), exprTrack(t, keys, { seed, saccade: false, idleBlink: false }));
const EM = (t, keys, seed) => (gapCheck(keys, seed), exprTrack(t, keys, { seed, saccade: false }));
const EC = (t, keys, seed) => (gapCheck(keys, seed), exprTrack(t, keys, { seed }));
const FT = JL.feet, S = 600;
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, FT, S, flip, wx, wy, bend);
const standL = { L: [.1, -.04], R: [.1, -.04] };
function tokoh(ctx, t, P, x, face, arms, flip = 1, extra = {}) { drawStick(ctx, C(P, Object.assign({ x, y: FT, s: S, flip, armLen: 1.3, legs: standL, arms: arms || idleArms(t, x * .01), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
const scrTag = (ctx, str, k, col = '#ffd23a', y = 250, size = 104) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, str, 540, y, size, k, col, INK, -.05); ctx.restore(); };
const scr = (ctx, f) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); f(ctx); ctx.restore(); };
const sfxS = (ctx, ...a) => scr(ctx, c => sfxText(c, ...a));
const win = (t, a, b, f = .15) => inv(a, a + f, t) * (1 - inv(b - .1, b, t));
const tagSeq = (ctx, t, list, y = 250) => list.forEach(([str, a, b, col, size]) => scrTag(ctx, str, inv(a, a + .15, t) * (b == null ? 1 : 1 - inv(b - .1, b, t)), col || '#fff', y, size || 104));
const inCam = (ctx, cam, f) => { ctx.save(); applyCam(ctx, cam, 1); f(ctx); ctx.restore(); };
const BX = CK.budi, RXX = CK.rani, CLK = JL.clock;
// sapu dari genggaman (hx,hy) mengarah ke (tx,ty)
function panah(c, x1, y1, x2, y2, col = '#ffd23a') { const a = Math.atan2(y2 - y1, x2 - x1); line(c, x1, y1, x2, y2, 22, INK); line(c, x1, y1, x2, y2, 12, col); c.save(); c.translate(x2, y2); c.rotate(a); c.beginPath(); c.moveTo(26, 0); c.lineTo(-18, -26); c.lineTo(-18, 26); c.closePath(); fillStroke(c, col, 6); c.restore(); }
const sapuTo = (c, hx, hy, tx, ty, s = 1, spread = 0) => drawSapu(c, hx, hy, s, Math.atan2(-(tx - hx), ty - hy), { spread });

// ===== ruang tengah malam + jam + kalender. o: { week, back(c) (di balik jam), wall(c) (di dinding, depan), fB, armsB, bx, bExtra, fR, armsR, rx, rExtra, floor(c), after(c) }
function ruang(ctx, t, cam, o = {}) {
  rumahBG(ctx, t, cam, { rain: 0, night: .6, jam: 8 });
  drawKalenderDinding(ctx, CK.cal[0], CK.cal[1], .8, o.week || 1);
  if (o.back) { o.back(ctx); drawWallClock(ctx, CLK[0], CLK[1], 105, 8, 0); }
  if (o.wall) o.wall(ctx);
  if (o.fR) tokoh(ctx, t, RANI, o.rx == null ? RXX : o.rx, o.fR, o.armsR, 1, o.rExtra || {});
  if (o.fB) tokoh(ctx, t, BUDI, o.bx == null ? BX : o.bx, o.fB, o.armsB, -1, o.bExtra || {});
  if (o.floor) o.floor(ctx);
  if (o.after) o.after(ctx);
}
// ===== ekor di lantai, joget (aman untuk waktu negatif). k = kekuatan joget
function ekorLantai(c, t, k = 1, x = CK.tail[0], y = CK.tail[1], s = 1) {
  const hop = Math.abs(Math.sin(t * 7.3)) * 26 * k, jit = Math.sin(t * 5.1) * .16 * k;
  ellipse(c, x, y + 12, 130 * s, 16 * s); c.fillStyle = 'rgba(40,20,30,.22)'; c.fill();
  drawEkor(c, x - 140 * s, y - hop, s, { t, len: 280, wig: k, rot: jit, curl: Math.sin(t * 2.3) * .3 * k, cut: true });
}
// ===== jalur cicak kabur: dari titik pukul ke balik jam =====
const TH = -.35, RUN = 3.0, P_CLK = [245, 640];
const RUNROT = Math.atan2(P_CLK[0] - CK.hit[0], -(P_CLK[1] - CK.hit[1]));
function cicakKabur(c, tl, o = {}) {
  if (tl < TH + .05) { drawCicakB(c, CK.hit[0], CK.hit[1], .9, { t: tl, tail: 1, face: o.face0 }); return; }
  const q = easeInOut(inv(TH + .05, TH + RUN, tl)), x = lerp(CK.hit[0], P_CLK[0], q) + Math.sin(q * 9) * 14, y = lerp(CK.hit[1], P_CLK[1], q);
  drawCicakB(c, x, y, .9, { t: tl, tail: 0, walk: q < 1 ? 1 : 0, rot: RUNROT + Math.cos(q * 9) * .12 });
}
// cicak mengintip dari balik jam. k 0 = sembunyi, 1 = kepala keluar di kanan jam
function cicakIntip(c, t, k, face) { drawCicakB(c, lerp(P_CLK[0], 300, k), lerp(P_CLK[1], 520, k), .9, { t, tail: 0, rot: lerp(RUNROT, 1.25, k), face }); }

// ===== 0 HOOK: ekor cicak ini udah putus, tapi masih joget sendiri =====
const H0 = { ek: wt(0, 'ekor'), ci: wt(0, 'cicak'), pu: wt(0, 'putus'), ta: wt(0, 'tapi'), ma: wt(0, 'masih'), jo: wt(0, 'joget'), se: wt(0, 'sendiri') };
const cam0 = tl => CK2(tl, [[-3, { x: 590, y: 1300, z: 1.3 }], [TH, { x: 590, y: 1300, z: 1.3 }], [0, { x: 585, y: 1330, z: 1.32 }, easeOut], [H0.ta, { x: 540, y: 1360, z: 1.42 }, ease], [ls(1), { x: 600, y: 1300, z: 1.38 }, easeIn]], 2);
function sapuHook(tl) {          // genggaman + ujung sapu Budi di sekitar pukulan
  const sw = easeIn(inv(TH - .3, TH, tl)), up = easeOut(inv(TH + .02, TH + .3, tl));
  if (tl < TH) return { h: [lerp(690, 640, sw), lerp(800, 1000, sw)], tip: [lerp(560, CK.hit[0], sw), lerp(560, CK.hit[1], sw)] };
  return { h: [lerp(640, 660, up), lerp(1000, 1080, up)], tip: [lerp(CK.hit[0], 640, up), lerp(CK.hit[1], 1420, up)] };
}
function hookScene(ctx, t, cam, tl) {
  const sp = sapuHook(tl), fall = inv(TH, TH + .35, tl);
  ruang(ctx, t, cam, {
    wall: c => cicakKabur(c, tl),
    fB: EM(tl, [[-9, 'ngeden', { look: [-.6, -.4] }], [TH + .02, 'kaget', { look: [-.6, .5] }], [H0.ma, 'takjub', { look: [-.5, .7] }]], 1),
    armsB: { R: armTo(BX, -1, sp.h[0], sp.h[1], -1), L: armTo(BX, -1, sp.h[0] + 40, sp.h[1] + 60, -1) },
    floor: c => {
      if (tl < TH) return;
      if (fall < 1) { const bx = lerp(CK.hit[0], CK.tail[0] - 140, fall), by = lerp(CK.hit[1] + 70, CK.tail[1], fall * fall); drawEkor(c, bx, by, 1, { t: tl, len: 280, wig: .6, rot: lerp(Math.PI / 2, 0, fall), cut: true }); }
      else ekorLantai(c, tl, Math.min(1, (tl - TH - .35) * 3 + .4));
    },
    after: c => sapuTo(c, sp.h[0], sp.h[1], sp.tip[0], sp.tip[1], 1.15, tl > TH && tl < TH + .2 ? 1 : 0) });
  if (tl > TH && tl < TH + .25) scr(ctx, c => { const p = toScreen(cam, CK.hit[0], CK.hit[1]); c.globalAlpha = 1 - (tl - TH) / .25; burst(c, p[0], p[1], 90, 10, '#fff6c8', 3); });
}
SH(0, ls(1), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  tagSeq(ctx, t, [['EKOR PUTUS', -.2, H0.ta, '#ffd23a', 110], ['MASIH JOGET?!', H0.ta, null, '#fff', 110]]);
  const p = toScreen(cam, CK.tail[0], CK.tail[1] - 120); sfxS(ctx, 'TIK TUK', p[0] + 80, p[1] - 40, 62, win(t, H0.jo - .1, ls(1)), '#ffd23a', .12);
});

// ===== 1 Budi teriak bangga: "Aku menang! Ekornya kupotong!" =====
const T1 = { bu: wt(1, 'budi'), te: wt(1, 'teriak'), ba: wt(1, 'bangga'), ak: wt(1, 'aku'), me: wt(1, 'menang'), ek: wt(1, 'ekornya'), ku: wt(1, 'kupotong') };
SH(ls(1), ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK2(t, [[ls(1), { x: 700, y: 1120, z: 1.65 }], [T1.me, { x: 690, y: 1100, z: 1.8 }, easeOut], [ls(2), { x: 680, y: 1110, z: 1.85 }, easeIn]], 2);
  const raise = backOut(inv(T1.ak - .25, T1.me, t)), jump = Math.abs(Math.sin(inv(T1.me, T1.me + .5, t) * Math.PI)) * 40;
  const h = [lerp(655, 700, raise), lerp(1060, 760, raise)];
  ruang(ctx, t, cam, {
    fB: EM(t, [[ls(1), 'bangga', { look: [-.4, -.3] }], [T1.ek, 'sombong', { look: [-.6, .5] }]], 2), bExtra: { bob: -jump / S },
    armsB: { R: armTo(BX, -1, h[0], h[1] - jump, -1), L: [2.4, .5] },
    floor: c => ekorLantai(c, t, 1),
    after: c => drawSapu(c, h[0], h[1] - jump, 1.15, Math.PI + .25 * Math.sin(t * 9) * raise) });
  tagSeq(ctx, t, [['AKU MENANG!', T1.ak - .05, T1.ek, '#9dff7a', 112], ['KUPOTONG!', T1.ek, null, '#ffd23a', 120]]);
});

// ===== 2 Rani ketawa: "Kamu yang ketipu, Bud." =====
const T2 = { ra: wt(2, 'rani'), ke: wt(2, 'ketawa'), ka: wt(2, 'kamu'), ti: wt(2, 'ketipu'), bu: wt(2, 'bud') };
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK2(t, [[ls(2), { x: 430, y: 1200, z: 1.18 }], [T2.ti, { x: 450, y: 1190, z: 1.25 }, ease], [ls(3), { x: 460, y: 1190, z: 1.28 }, easeIn]], 2);
  const rx = lerp(-260, RXX, easeOut(inv(ls(2) - .2, T2.ke, t))), walking = t < T2.ke, wc = walkCycle(rx + 260, S, 1), laugh = t > T2.ke ? Math.sin(t * 22) * .012 : 0;
  ruang(ctx, t, cam, { rx,
    fR: EM(t, [[ls(2), 'licik', { look: [.7, .3] }], [T2.ke, 'bangga'], [T2.ti, 'sombong', { look: [.8, 0] }]], 3),
    armsR: walking ? wc.arms : (t < T2.ti ? { L: [.5, -1.2], R: [.5, -1.2] } : { R: [1.55, .05], L: [.3, -.3] }),
    rExtra: walking ? { legs: wc.legs, bob: wc.bob, lean: wc.lean, footDir: 1 } : { bob: laugh },
    fB: EM(t, [[ls(2), 'bangga', { look: [-.4, -.2] }], [T2.ti + .08, 'kaget', { look: [-.8, 0] }]], 4),
    armsB: { R: armTo(BX, -1, 700, 760, -1), L: [2.4, .5] },
    floor: c => ekorLantai(c, t, 1),
    after: c => drawSapu(c, 700, 760, 1.15, Math.PI) });
  tagSeq(ctx, t, [['HAHAHA', T2.ke, T2.ka, '#ff9ad0', 110], ['KAMU KETIPU!', T2.ka, null, '#ffd23a', 112]]);
});

// ===== 3a Selama kamu melototin ekornya, =====
const T3 = { se: wt(3, 'selama'), me: wt(3, 'melototin'), ek: wt(3, 'ekornya'), ci: wt(3, 'cicaknya'), ka: wt(3, 'kabur'), ba: wt(3, 'balik'), ja: wt(3, 'jam'), di: wt(3, 'dinding') };
SH(ls(3), T3.ci, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK2(t, [[ls(3), { x: 620, y: 1360, z: 1.7 }], [T3.ek, { x: 600, y: 1380, z: 1.85 }, ease], [T3.ci, { x: 590, y: 1370, z: 1.9 }, easeIn]], 2);
  const lk = Math.sin(t * 7.3) * .35;
  ruang(ctx, t, cam, {
    fB: EF(t, [[ls(3) - 1, { eyes: 'wide', mouth: 'o', browUp: .8, look: [-.55, .75] }]], 5), bExtra: { headTilt: lk * .15 },
    armsB: { R: armTo(BX, -1, 700, 760, -1), L: [.3, -.3] },
    floor: c => ekorLantai(c, t, 1),
    after: c => drawSapu(c, 700, 760, 1.15, Math.PI) });
  tagSeq(ctx, t, [['MELOTOT...', T3.me - .05, null, '#fff', 112]]);
});
// ===== 3b ...cicaknya udah kabur ke balik jam dinding =====
SH(T3.ci, ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK2(t, [[T3.ci, { x: 300, y: 640, z: 1.9 }], [T3.ba, { x: 280, y: 600, z: 2.1 }, ease], [ls(4), { x: 290, y: 590, z: 2.2 }, easeIn]], 2);
  const k = backOut(inv(T3.ba - .1, T3.ja + .1, t));
  ruang(ctx, t, cam, { back: c => cicakIntip(c, t, clamp(k, 0, 1.1), EM(t, [[T3.ci, 'licik', { look: [.6, .3] }], [T3.di, 'sombong', { look: [.7, .5] }]], 6)) });
  tagSeq(ctx, t, [['KABUR!', T3.ka - .05, null, '#ffd23a', 130]]);
  sfxS(ctx, 'SRET', 760, 760, 74, win(t, T3.ka, T3.ja), '#fff', -.1);
});

// ===== 4 Cicak memang sengaja ngelepas ekornya sendiri (replay lambat) =====
const T4 = { ci: wt(4, 'cicak'), me: wt(4, 'memang'), se: wt(4, 'sengaja'), ng: wt(4, 'ngelepas'), ek: wt(4, 'ekornya'), sd: wt(4, 'sendiri') };
SH(ls(4), ls(5), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK2(t, [[ls(4), { x: 500, y: 1180, z: 2.05 }], [T4.ng, { x: 480, y: 1200, z: 2.25 }, ease], [ls(5), { x: 470, y: 1210, z: 2.35 }, easeIn]], 1);
  const sw = easeInOut(inv(ls(4), T4.sd, t)), pop = inv(T4.ng, T4.ng + .35, t);
  const h = [lerp(700, 660, sw), lerp(780, 930, sw)], tip = [lerp(600, 500, sw), lerp(600, 1000, sw)];
  ruang(ctx, t, cam, {
    wall: c => {
      drawCicakB(c, CK.hit[0], CK.hit[1], .9, { t, tail: 0, face: EM(t, [[ls(4), 'curiga', { look: [.6, -.6] }], [T4.se, 'licik'], [T4.ek, 'bangga']], 7) });
      drawEkor(c, CK.hit[0] + pop * 16, CK.hit[1] + 70 + pop * 30, .9, { t, len: 280, rot: Math.PI / 2 + pop * .35, wig: pop, sway: 1 - pop, cut: pop > 0 });
      if (pop > 0 && pop < 1) { c.save(); c.globalAlpha = 1 - pop; burst(c, CK.hit[0], CK.hit[1] + 60, 60 + pop * 40, 9, '#fff6c8', 4); c.restore(); }
    },
    fB: EF(t, [[ls(4), 'ngeden', { look: [-.6, -.3] }]], 8), armsB: { R: armTo(BX, -1, h[0], h[1], -1), L: armTo(BX, -1, h[0] + 40, h[1] + 60, -1) },
    after: c => sapuTo(c, h[0], h[1], tip[0], tip[1], 1.15) });
  scr(ctx, c => { c.fillStyle = 'rgba(255,255,255,.06)'; for (let y = (t * 120) % 12; y < H; y += 12) c.fillRect(0, y, W, 3);
    circle(c, 110, 210, 18); c.fillStyle = Math.sin(t * 8) > 0 ? '#ff3b4f' : '#7a1a24'; c.fill(); text(c, 'REPLAY', 240, 226, 50, '#fff', INK, 8); });
  tagSeq(ctx, t, [['SENGAJA!', T4.se - .05, null, '#ffd23a', 130]], 330);
  sfxS(ctx, 'POP!', 300, 1100, 90, win(t, T4.ng, ls(5) + .4), '#fff', -.12);
});

// ===== 5 Tulang ekornya punya garis retak yang memang disiapkan buat patah =====
const T5 = { tu: wt(5, 'tulang'), ek: wt(5, 'ekornya'), pu: wt(5, 'punya'), ga: wt(5, 'garis'), re: wt(5, 'retak'), di: wt(5, 'disiapkan'), pa: wt(5, 'patah') };
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  scr(ctx, c => { rontgenBG(c, t); const z = lerp(.92, 1.02, inv(ls(5), ls(6), t)), app = easeOut(inv(ls(5) - .1, ls(5) + .5, t));
    const px = lerp(380, 700, easeInOut(inv(ls(5), ls(6), t))); c.translate(540, 820); c.scale(z * 1.25, z * 1.25); c.translate(-px, -820);
    c.globalAlpha = app; drawTulangEkor(c, 500, 820, 1, { t, glow: inv(T5.ga - .1, T5.re + .1, t), vessel: 0 }); c.globalAlpha = 1;
    if (t > T5.di) for (let i = 0; i < TE.n - 1; i++) { const x = 500 + tulangX(i), k = backOut(inv(T5.di + i * .05, T5.di + i * .05 + .2, t)); if (k > 0) { c.save(); c.translate(x, 640); c.scale(k, k); c.beginPath(); c.moveTo(0, 30); c.lineTo(-20, -6); c.lineTo(20, -6); c.closePath(); fillStroke(c, '#ff4d6d', 5); c.restore(); } }
  });
  tagSeq(ctx, t, [['TULANG EKOR', ls(5) - .1, T5.ga, '#bfe9ff', 104], ['GARIS RETAK', T5.ga - .05, T5.di, '#ff8a9a', 110], ['SIAP PATAH', T5.di - .05, null, '#ffd23a', 120]]);
});

// ===== 6 Begitu kena serang, ototnya narik kencang, dan krek, ekornya lepas =====
const T6 = { be: wt(6, 'begitu'), ke: wt(6, 'kena'), se: wt(6, 'serang'), ot: wt(6, 'ototnya'), na: wt(6, 'narik'), kc: wt(6, 'kencang'), da: wt(6, 'dan'), kr: wt(6, 'krek'), ek: wt(6, 'ekornya'), le: wt(6, 'lepas') };
function drawCakar(c, x, y, s, k) {       // cakar kucing mencengkeram dari kanan
  c.save(); c.translate(x, y); c.scale(s, s); rrect(c, 0, -70, 420, 140, 60); fillStroke(c, CKP.cat, 8);
  circle(c, 0, 0, 90); fillStroke(c, CKP.cat, 8); for (let i = 0; i < 3; i++) { const yy = -50 + i * 50; c.beginPath(); c.moveTo(-70, yy); c.quadraticCurveTo(-130 - 20 * k, yy + 6, -150 - 26 * k, yy + 40); c.lineWidth = 12; c.strokeStyle = '#fffdf6'; c.stroke(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); }
  c.restore();
}
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const xc = 500 + tulangX(3), open = easeOut(inv(T6.kr, T6.le + .2, t)), pull = inv(T6.ot - .05, T6.kc + .2, t), grab = easeOut(inv(T6.ke - .1, T6.se + .1, t));
  const z = lerp(1.35, 1.6, inv(ls(6), T6.kr, t)), sh = (t > T6.kr && t < T6.kr + .25) ? Math.sin(t * 90) * 14 : (pull > 0 && pull < 1 ? Math.sin(t * 60) * 4 : 0);
  scr(ctx, c => { rontgenBG(c, t); c.translate(540 + sh, 820); c.scale(z, z); c.translate(-xc, -820);
    drawTulangEkor(c, 500, 820, 1, { t, glow: .5, pull, split: 3, open, vessel: 0 });
    drawCakar(c, lerp(1500, xc + 290, grab) + open * 170, 820 + open * 40, .8, grab);
    if (pull > 0 && open < .2) for (const sd of [-1, 1]) { const a = 1 - open * 5; c.save(); c.globalAlpha = a; panah(c, xc - 170, 820 + sd * 75, xc - 50, 820 + sd * 75, '#ff8fb0'); panah(c, xc + 170, 820 + sd * 75, xc + 50, 820 + sd * 75, '#ff8fb0'); c.restore(); }
  });
  tagSeq(ctx, t, [['KENA SERANG!', T6.ke - .05, T6.ot, '#ff8a8a', 110], ['OTOT NARIK', T6.ot - .05, T6.kr, '#ff9ad0', 110], ['LEPAS!', T6.le - .05, null, '#ffd23a', 130]]);
  sfxS(ctx, 'KREK!', 540, 560, 150, win(t, T6.kr - .03, T6.le + .3), '#fff', -.1);
});

// ===== 7 Pembuluh darahnya langsung nutup, jadi hampir nggak berdarah =====
const T7 = { pe: wt(7, 'pembuluh'), da: wt(7, 'darahnya'), la: wt(7, 'langsung'), nu: wt(7, 'nutup'), ja: wt(7, 'jadi'), ha: wt(7, 'hampir'), ng: wt(7, 'nggak'), be: wt(7, 'berdarah') };
SH(ls(7), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const xc = 500 + tulangX(3), z = lerp(1.55, 1.9, inv(ls(7), ls(8), t)), valve = easeOut(inv(T7.nu - .1, T7.nu + .35, t));
  const drip = t < T7.ha ? 0 : inv(T7.ha, T7.be + .3, t);
  scr(ctx, c => { rontgenBG(c, t); c.translate(540, 820); c.scale(z, z); c.translate(-(xc - 120), -840);
    drawTulangEkor(c, 500, 820, 1, { t, split: 3, open: 1, stumpOnly: true, vessel: easeOut(inv(ls(7) - .1, T7.da + .2, t)), valve, drip: drip > 0 && drip < 1 ? drip : 0 });
    if (valve > .5) glowRing(c, xc, 846, 60, (valve - .5) * 2 * (1 - inv(T7.ja, T7.ha, t)) + .01, '255,90,110');
  });
  tagSeq(ctx, t, [['PEMBULUH DARAH', ls(7) - .1, T7.nu, '#ff8a9a', 100], ['NUTUP!', T7.nu - .05, T7.ha, '#ffd23a', 130], ['HAMPIR NGGAK BERDARAH', T7.ha - .05, null, '#fff', 76]]);
  sfxS(ctx, 'CEKREK', 760, 1120, 70, win(t, T7.nu, T7.ja + .3), '#fff', -.1);
});

// ===== 8 Ekornya terus joget sampai beberapa menit, buat ngalihin perhatian pemangsa =====
const T8 = { ek: wt(8, 'ekornya'), te: wt(8, 'terus'), jo: wt(8, 'joget'), sa: wt(8, 'sampai'), bb: wt(8, 'beberapa'), me: wt(8, 'menit'), bu: wt(8, 'buat'), ng: wt(8, 'ngalihin'), pe: wt(8, 'perhatian'), pm: wt(8, 'pemangsa') };
SH(ls(8), ls(9), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK2(t, [[ls(8), { x: 520, y: 1420, z: 1.75 }], [T8.bu, { x: 600, y: 1410, z: 1.55 }, ease], [ls(9), { x: 620, y: 1400, z: 1.5 }, easeIn]], 2);
  const cx = lerp(1300, 900, easeOut(inv(T8.ng - .2, T8.pe, t))), lookT = Math.sin(t * 7.3) * .3;
  ruang(ctx, t, cam, { floor: c => {
    ekorLantai(c, t, 1);
    if (t > T8.ng - .2) drawKucing(c, cx, JL.feet, .9, { t, crouch: .7, headX: lookT * 40, face: EF(t, [[T8.ng - .3, { eyes: 'wide', mouth: 'o', browUp: .6, look: [-.7 + lookT, .6] }]], 9) });
  } });
  scr(ctx, c => { const k = backOut(inv(T8.bb - .1, T8.bb + .2, t)) * (1 - inv(T8.ng - .1, T8.ng + .1, t)); if (k > 0) { c.save(); c.translate(540, 520); c.scale(k, k); drawWallClock(c, 0, 0, 130, 8 + (t - T8.bb) * 3, 1); c.restore(); } });
  tagSeq(ctx, t, [['MASIH JOGET', ls(8) - .1, T8.bb, '#fff', 110], ['BEBERAPA MENIT', T8.bb - .05, T8.ng, '#ffd23a', 104], ['UMPAN!', T8.ng - .05, null, '#ff8a8a', 130]]);
});

// ===== 9a Kucing, burung, atau Budi, semuanya sibuk ngejar ekor, =====
const T9 = { ku: wt(9, 'kucing'), bu: wt(9, 'burung'), at: wt(9, 'atau'), bd: wt(9, 'budi'), se: wt(9, 'semuanya'), si: wt(9, 'sibuk'), ng: wt(9, 'ngejar'), ek: wt(9, 'ekor'), ci: wt(9, 'cicaknya'), sl: wt(9, 'selamat') };
SH(ls(9), T9.ci, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK2(t, [[ls(9), { x: 600, y: 1360, z: 1.4 }], [T9.se, { x: 560, y: 1330, z: 1.3 }, ease], [T9.ci, { x: 540, y: 1300, z: 1.35 }, easeIn]], 2);
  const cloud = inv(T9.se - .1, T9.se + .2, t), tx = CK.tail[0] + Math.sin(t * 3.1) * 60 * (t > T9.ku ? 1 : 0);
  const catP = easeOut(inv(T9.ku - .1, T9.ku + .4, t)), birdP = easeOut(inv(T9.bu - .2, T9.bu + .4, t)), budiP = easeOut(inv(T9.bd - .2, T9.bd + .35, t));
  ruang(ctx, t, cam, {
    fB: cloud < 1 && t > T9.bd - .2 ? EF(t, [[T9.bd - .2, 'ngeden', { look: [-.7, .6] }]], 10) : null,
    bx: lerp(1000, 640, budiP), bExtra: { lean: budiP * .55 }, armsB: { R: [1.4, .2], L: [1.2, .1] },
    floor: c => {
      if (cloud < 1) {
        ekorLantai(c, t, 1, tx);
        if (t > T9.ku - .1) drawKucing(c, lerp(900, 640, catP), JL.feet, .9, { t, pounce: Math.sin(catP * Math.PI), crouch: 1 - catP * .5, face: EF(t, [[T9.ku - .1, 'ngeden', { look: [-.8, .4] }]], 11) });
        if (t > T9.bu - .2) drawBurung(c, lerp(1100, 520, birdP), lerp(700, 1320, birdP), 1.1, { t, rot: -.5 * (1 - birdP), face: EF(t, [[T9.bu - .2, 'ngeden', { look: [-.8, .5] }]], 12) });
      } else {
        // awan berantem kartun: ekor tetap joget di atasnya
        const R = rng(Math.floor(t * 8));
        for (let i = 0; i < 6; i++) puff(c, 540 + Math.cos(i + t * 6) * 120, 1380 + Math.sin(i * 2 + t * 7) * 50, 120 + R() * 40, t, '#f3efe6', i + 2);
        const pk = Math.floor(t * 6) % 3, px = 540 + Math.cos(t * 9) * 150, py = 1330 + Math.sin(t * 11) * 40;
        if (pk === 0) drawBurung(c, px, py - 60, .8, { t, rot: t * 4 }); else if (pk === 1) drawSapu(c, px, py - 80, .9, t * 5); else { c.save(); c.translate(px, py); c.rotate(t * 3); line(c, -60, 0, 60, 0, 22, INK); line(c, -60, 0, 60, 0, 12, CKP.cat); c.restore(); }
        ekorLantai(c, t, 1, 540 + Math.sin(t * 4) * 80, 1220, .7);
      }
    } });
  tagSeq(ctx, t, [['KUCING', T9.ku - .05, T9.bu, '#ffd23a', 120], ['BURUNG', T9.bu - .05, T9.bd, '#bfe9ff', 120], ['BUDI?!', T9.bd - .05, T9.se, '#9dff7a', 120], ['SIBUK NGEJAR EKOR', T9.si - .05, null, '#fff', 88]]);
});
// ===== 9b cicaknya selamat =====
SH(T9.ci, ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK2(t, [[T9.ci, { x: 300, y: 600, z: 2.1 }], [T9.sl, { x: 300, y: 580, z: 2.25 }, ease], [ls(10), { x: 310, y: 580, z: 2.3 }, easeIn]], 2);
  ruang(ctx, t, cam, { back: c => cicakIntip(c, t, 1, EM(t, [[T9.ci, 'sombong', { look: [.5, .5] }], [T9.sl, 'lega']], 13)) });
  tagSeq(ctx, t, [['SELAMAT!', T9.sl - .05, null, '#9dff7a', 130]]);
  scr(ctx, c => { const p = toScreen(cam, 410, 470); for (let i = 0; i < 3; i++) { const q = ((t * .8 + i / 3) % 1); c.save(); c.globalAlpha = (1 - q) * inv(T9.sl, T9.sl + .2, t); star5(c, p[0] + i * 40, p[1] - q * 120, 16, t * 3 + i); c.restore(); } });
});

// ===== 10 Dalam beberapa minggu, ekornya tumbuh lagi =====
const T10 = { da: wt(10, 'dalam'), be: wt(10, 'beberapa'), mi: wt(10, 'minggu'), ek: wt(10, 'ekornya'), tu: wt(10, 'tumbuh'), la: wt(10, 'lagi') };
const CZ = [60, 780];
SH(ls(10), ls(11), { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = CK2(t, [[ls(10), { x: 20, y: 640, z: 1.55 }], [T10.tu, { x: 10, y: 700, z: 1.7 }, ease], [ls(11), { x: 10, y: 710, z: 1.75 }, easeIn]], 1);
  const week = 1 + 3 * easeInOut(inv(T10.da, T10.tu, t)), rg = easeOut(inv(T10.tu - .1, T10.la + .4, t));
  ruang(ctx, t, cam, { week, wall: c => { drawCicakB(c, CZ[0], CZ[1], .8, { t, tail: 0, regrow: rg, face: EM(t, [[ls(10), 'datar', { look: [.7, -.3] }], [T10.tu, 'bangga']], 14) });
    if (rg > 0 && rg < 1) { c.save(); c.globalAlpha = 1 - rg; for (let i = 0; i < 5; i++) sparkle(c, CZ[0] + Math.cos(i * 1.3 + t * 3) * 50, CZ[1] + 140 + rg * 120 + Math.sin(i * 2) * 30, 16, 1); c.restore(); } } });
  tagSeq(ctx, t, [['BEBERAPA MINGGU', T10.be - .05, T10.ek, '#fff', 100], ['TUMBUH LAGI!', T10.tu - .05, null, '#9dff7a', 120]]);
});

// ===== 11 Tapi bukan ekor yang sama: isinya bukan tulang lagi, cuma tabung tulang rawan =====
const T11 = { ta: wt(11, 'tapi'), bu: wt(11, 'bukan'), sa: wt(11, 'sama'), is: wt(11, 'isinya'), bk: wt(11, 'bukan', 0, 1), tl: wt(11, 'tulang'), cu: wt(11, 'cuma'), tb: wt(11, 'tabung'), tr: wt(11, 'tulang', 0, 1), ra: wt(11, 'rawan') };
SH(ls(11), ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  const rg = easeOut(inv(ls(11), T11.sa + .2, t)), z = lerp(.98, 1.04, inv(ls(11), ls(12), t)), tube = inv(T11.tb - .1, T11.tr, t);
  scr(ctx, c => { rontgenBG(c, t); c.translate(540, 860); c.scale(z, z); c.translate(-540, -860);
    drawTulangEkor(c, 540, 600, .78, { t, glow: .2 });
    drawTulangEkor(c, 540, 1030, .78, { t, glow: .2, regen: rg, regenFrom: 3 });
    for (const [y, s, col] of [[600, 'ASLI', '#ffd23a'], [1030, 'BARU', '#9fe3ff']]) { rrect(c, 40, y - 230, 190, 70, 14); fillStroke(c, col, 6); text(c, s, 135, y - 182, 46, INK, null, 0); }
    if (tube > 0) glowRing(c, 540 + (tulangX(3) + 260) * .78, 1030, 200, tube * .8, '120,220,255');
    const xk = inv(T11.bk - .1, T11.bk + .2, t) * (1 - inv(T11.cu, T11.cu + .15, t)); if (xk > 0) { for (let i = 3; i < 7; i++) { c.save(); c.globalAlpha = .55 * xk; c.translate(540 + tulangX(i) * .78, 1030); c.scale(.78, .78); c.setLineDash([8, 8]); rrect(c, -46, -40, 92, 80, 10); c.lineWidth = 5; c.strokeStyle = '#fff'; c.stroke(); c.restore(); drawX(c, 540 + tulangX(i) * .78, 1030, 30, xk); } }
  });
  tagSeq(ctx, t, [['BUKAN YANG SAMA', ls(11) - .1, T11.bk, '#fff', 96], ['BUKAN TULANG', T11.bk - .05, T11.cu, '#ff8a8a', 110], ['TULANG RAWAN', T11.tb - .05, null, '#9fe3ff', 110]], 260);
});

// ===== 12 Bentuknya juga sering beda, lebih tumpul, warnanya nggak sama =====
const T12 = { be: wt(12, 'bentuknya'), ju: wt(12, 'juga'), se: wt(12, 'sering'), bd: wt(12, 'beda'), le: wt(12, 'lebih'), tu: wt(12, 'tumpul'), wa: wt(12, 'warnanya'), ng: wt(12, 'nggak'), sa: wt(12, 'sama') };
const FR = [1400, 560], CR = [1700, 800], CRR = -.9;
SH(ls(12), ls(13), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK2(t, [[ls(12), { x: 1560, y: 800, z: 1.38 }], [T12.tu, { x: 1580, y: 820, z: 1.45 }, ease], [ls(13), { x: 1585, y: 825, z: 1.48 }, easeIn]], 1);
  ruang(ctx, t, cam, { wall: c => {
    drawBingkai(c, FR[0], FR[1], 300, 360, 'DULU', cc => { cc.fillStyle = '#e8f1ff'; cc.fillRect(-200, -220, 400, 440); drawCicakB(cc, 0, -40, .62, { t: 0, tail: 1, sway: 0, face: EXPR.bangga }); });
    drawCicakB(c, CR[0], CR[1], .8, { t, tail: 0, regrow: 1, rot: CRR, face: EM(t, [[ls(12), 'datar', { look: [-.8, -.6] }], [T12.wa, 'sadar', { look: [-.4, .7] }]], 15) });
  } });
  inCam(ctx, cam, c => { const tip = [CR[0] - Math.sin(CRR) * 226, CR[1] + Math.cos(CRR) * 226], k1 = inv(T12.tu - .1, T12.tu + .1, t), k2 = inv(T12.wa - .1, T12.wa + .1, t);
    if (k1 > 0) { c.save(); c.globalAlpha = k1; panah(c, tip[0] - 40, tip[1] - 150, tip[0] - 5, tip[1] - 50, '#ffd23a'); c.restore(); popText(c, 'TUMPUL', tip[0] - 60, tip[1] - 190, 60, k1, '#ffd23a', INK, -.05); }
    if (k2 > 0) { glowRing(c, (tip[0] + CR[0]) / 2 + 30, (tip[1] + CR[1]) / 2 + 30, 130, k2 * .7, '200,200,190'); } });
  tagSeq(ctx, t, [['SERING BEDA', T12.se - .05, T12.wa, '#fff', 110], ['WARNA BEDA', T12.wa - .05, null, '#d9d3c0', 110]]);
});

// ===== 13a Besoknya Budi ngayunin sapu lagi, =====
const T13 = { be: wt(13, 'besoknya'), bu: wt(13, 'budi'), ng: wt(13, 'ngayunin'), sa: wt(13, 'sapu'), la: wt(13, 'lagi'), da: wt(13, 'dan') };
SH(ls(13), T13.da, { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = CK2(t, [[ls(13), { x: 600, y: 1150, z: 1.35 }], [T13.ng, { x: 590, y: 1180, z: 1.4 }, ease], [T13.da, { x: 590, y: 1290, z: 1.32 }, easeIn]], 2);
  const up = easeInOut(inv(T13.ng - .2, T13.la, t)), h = [lerp(660, 690, up), lerp(1000, 800, up)], tip = [lerp(560, 560, up), lerp(1250, 560, up)];
  ruang(ctx, t, cam, { wall: c => drawCicakB(c, CK.hit[0], CK.hit[1], .9, { t, tail: 1, face: EM(t, [[ls(13), 'netral', { look: [.4, .3] }], [T13.sa, 'cemas', { look: [.7, -.4] }]], 16) }),
    fB: EM(t, [[ls(13), 'licik', { look: [-.6, -.4] }]], 17), armsB: { R: armTo(BX, -1, h[0], h[1], -1), L: armTo(BX, -1, h[0] + 40, h[1] + 60, -1) },
    after: c => sapuTo(c, h[0], h[1], tip[0], tip[1], 1.15) });
  tagSeq(ctx, t, [['BESOKNYA...', ls(13) - .1, null, '#fff', 110]]);
});
// ===== 13b dan -> komposisi frame 0 (loop) =====
SH(T13.da, ENDT, { tr: 'whip' }, (ctx, lt, t) => {
  const tl = t - ENDT + 1 / 30;
  hookScene(ctx, t, cam0(tl), tl);
  scrTag(ctx, 'EKOR PUTUS', inv(-.2, 0, tl), '#ffd23a', 250, 110);
});
