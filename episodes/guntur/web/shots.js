// ---------- Fakta Unik: "Kenapa guntur telat? (bukan awan tabrakan)" (~53,6 dtk, tanpa CTA) ----------
// Bentuk cerita keempat belas: "teori konyol + uji hitung" (v2 28-11: tanpa taruhan. Budi tutup telinga terlalu cepat, teori awan tabrakan, Rani bisa tahu jarak petir tanpa ngintip,
// Rani menghitung 1-2-3 DUAR, kilat dekat = langsung DUAR, lelucon tiga: kucing ke kolong, cicak ke balik jam, Budi ke bawah meja). Ruang tengah malam = rumahBG (env_jemur) + lampu (env_laron).
// Aset baru env_guntur.js (kilat, awan berwajah, cahaya vs suara, gelombang, molekul udara, termometer, meja makan). Loop: shot terakhir = hook dengan waktu negatif.
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
const CKS = (t, keys, sh = 2) => camKeys(t, t, keys, sh);
const standL = { L: [.1, -.04], R: [.1, -.04] };
const _warned = new Set();
const gapCheck = (keys, seed) => { for (let i = 1; i < keys.length; i++) if (keys[i][0] - keys[i - 1][0] < .55 && !_warned.has(seed)) { _warned.add(seed); console.log('PERINGATAN ekspresi seed ' + seed + ': jarak ganti ' + (keys[i][0] - keys[i - 1][0]).toFixed(2) + ' dtk < 0,55'); } };
const EF = (t, keys, seed) => (gapCheck(keys, seed), exprTrack(t, keys, { seed, saccade: false, idleBlink: false }));
const EM = (t, keys, seed) => (gapCheck(keys, seed), exprTrack(t, keys, { seed, saccade: false }));
const EC = (t, keys, seed) => (gapCheck(keys, seed), exprTrack(t, keys, { seed }));
const FT = GL.feet, S = 600, HEADY = FT - .765 * S;
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, FT, S, flip, wx, wy, bend);
function tokoh(ctx, t, P, x, face, arms, flip = 1, extra = {}) { drawStick(ctx, C(P, Object.assign({ x, y: FT, s: S, flip, armLen: 1.3, legs: standL, arms: arms || idleArms(t, x * .01), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
// tangan ke telinga (k 0..1)
const earArms = (px, flip, k, jit = 0) => k <= 0 ? null : { L: armTo(px, flip, lerp(px - flip * 70, px - flip * 122, k) + jit, lerp(1340, HEADY + 6, k), -1), R: armTo(px, flip, lerp(px + flip * 70, px + flip * 122, k) - jit, lerp(1340, HEADY + 6, k), 1) };
const earHands = (c, px, k, jit = 0) => { if (k < .85) return; for (const sd of [-1, 1]) { ellipse(c, px + sd * (112 - jit), HEADY + 8, 26, 34); fillStroke(c, INK, 4); } };
const scr = (ctx, f) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); f(ctx); ctx.restore(); };
const scrTag = (ctx, str, k, col = '#ffd23a', y = 300, size = 104) => scr(ctx, c => popText(c, str, 540, y, size, k, col, INK, -.05));
const sfxS = (ctx, ...a) => scr(ctx, c => sfxText(c, ...a));
const win = (t, a, b, f = .15) => inv(a, a + f, t) * (1 - inv(b - .1, b, t));
const tagSeq = (ctx, t, list, y = 300) => list.forEach(([str, a, b, col, size]) => scrTag(ctx, str, inv(a, a + .15, t) * (b == null ? 1 : 1 - inv(b - .1, b, t)), col || '#fff', y, size || 104));
const inCam = (ctx, cam, f) => { ctx.save(); applyCam(ctx, cam, 1); f(ctx); ctx.restore(); };
// guncangan DUAR: kamera bergetar kuat lalu reda
const goyang = (cam, t, t0, amp = 30) => { const d = t - t0; if (d < 0 || d > .9) return cam; const k = amp * Math.exp(-d * 4); return Object.assign({}, cam, { x: cam.x + Math.sin(d * 70) * k, y: cam.y + Math.cos(d * 55) * k * .7, r: (cam.r || 0) + Math.sin(d * 40) * k * .0008 }); };
const WIN = JL.win;
const boltWin = (seed = 3, big = 0) => [WIN[0] + 60 - 40 * big, WIN[1] - 240, WIN[0] - 40 + 30 * big, WIN[1] + 180, { seed, w: 12 + 10 * big, branches: 2 + big }];

// ===== ruang tengah malam =====
// o: { flash, bolt, fB, armsB, bx, flipB, bExtra, fR, armsR, rx, flipR, rExtra, tableShake, sink, extra, under }
function ruang(ctx, t, cam, o = {}) {
  const fl = clamp(o.flash || 0);
  rumahBG(ctx, t, cam, { rain: 1, jam: o.jam == null ? 9 : o.jam, night: 1, flash: fl });
  if (o.bolt && fl > .05) { ctx.save(); rrect(ctx, WIN[0] - 180, WIN[1] - 230, 360, 460, 6); ctx.clip(); const b = o.bolt; drawKilat(ctx, b[0], b[1], b[2], b[3], Object.assign({ k: Math.min(1, fl * 1.4) }, b[4])); ctx.restore(); }
  if (o.under) o.under(ctx);
  if (o.fR) tokoh(ctx, t, RANI, o.rx == null ? GL.rani : o.rx, o.fR, o.armsR, o.flipR || 1, o.rExtra || {});
  if (o.fB) tokoh(ctx, t, BUDI, o.bx == null ? GL.budi : o.bx, o.fB, o.armsB, o.flipB || 1, o.bExtra || {});
  if (o.sink) { ctx.save(); rrect(ctx, 590, 1330, 540, 230, 10); fillStroke(ctx, '#d7dde9', 7); rrect(ctx, 620, 1370, 220, 160, 8); fillStroke(ctx, '#c4ccdb', 5); rrect(ctx, 880, 1370, 220, 160, 8); fillStroke(ctx, '#c4ccdb', 5); ctx.restore(); drawWastafel(ctx, 860, 1330, .8, { t }); }
  drawMejaMakan(ctx, GL.table[0], GL.table[1], 1, { shake: o.tableShake || 0 });
  if (o.extra) o.extra(ctx);
  drawLampu(ctx, GL.lamp[0], GL.lamp[1], 1, { on: 1, sway: Math.sin(t * 1.3) * .02 });
  gelapRuang(ctx, cam, .5 * (1 - fl), [[GL.lamp[0], GL.lamp[1], 760, 1]]);
  if (fl > 0) kilatLayar(ctx, fl * .42);
}
// gelembung pikiran (ruang layar): isi digambar di dalam kotak bulat (40..1040, 150..1250)
function bubble(ctx, draw, k = 1) {
  scr(ctx, c => { c.save(); c.globalAlpha = clamp(k); rrect(c, 40, 150, 1000, 1100, 70); c.clip(); draw(c); c.restore();
    c.save(); c.globalAlpha = clamp(k); rrect(c, 40, 150, 1000, 1100, 70); c.lineWidth = 16; c.strokeStyle = '#fff'; c.stroke(); rrect(c, 40, 150, 1000, 1100, 70); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
      for (const [x, y, r] of [[300, 1320, 34], [250, 1420, 24]]) { circle(c, x, y, r); fillStroke(c, '#fff', 6); } c.restore(); });
}
// langit (ruang layar, kamera tetap) untuk teori awan dan gelombang
const SKYCAM = { x: 540, y: 960, z: 1, r: 0 };

// ===== 0 HOOK: Kilat nyamber, Budi langsung tutup telinga, tapi gunturnya nggak datang-datang =====
const H0 = { ki: wt(0, 'kilat'), ny: wt(0, 'nyamber'), bu: wt(0, 'budi'), la: wt(0, 'langsung'), tu: wt(0, 'tutup'), te: wt(0, 'telinga'), ta: wt(0, 'tapi'), gu: wt(0, 'gunturnya'), ng: wt(0, 'nggak'), da: wt(0, 'datangdatang') };
const cam0 = tl => CKS(tl, [[-3, { x: 690, y: 1120, z: 1.25 }], [-.15, { x: 690, y: 1120, z: 1.25 }], [0, { x: 700, y: 1110, z: 1.3 }, easeOut], [H0.te, { x: 720, y: 1090, z: 1.55 }, ease], [H0.da, { x: 720, y: 1080, z: 1.7 }, ease], [ls(1), { x: 720, y: 1080, z: 1.75 }, easeIn]], 2);
function hookScene(ctx, t, cam, tl) {
  const fl = kedip(tl, -.03) * .9, ear = easeOut(inv(.12, .42, tl)), jit = tl > 0 ? Math.sin(tl * 40) * 4 : 0;
  ruang(ctx, tl + 100, goyang(cam, tl, 0, 8), { flash: fl, bolt: boltWin(3),
    fB: EM(tl, [[-9, 'netral', { look: [.8, -.3] }], [.05, 'kaget', { look: [.8, -.4] }], [.6, { eyes: 'flinch', mouth: 'wobble', sweat: .6, browAng: .3 }], [H0.ta, { eyes: 'half', mouth: 'wobble', sweat: .8, look: [.8, -.2] }], [H0.ng, 'cemas', { look: [.9, -.3] }]], 1),
    armsB: earArms(GL.budi, 1, ear, jit), bExtra: { bob: tl > .05 && tl < .35 ? -.03 * Math.sin(inv(.05, .35, tl) * Math.PI) : 0 }, extra: c => earHands(c, GL.budi, ear, jit) });
}
SH(0, ls(1), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  tagSeq(ctx, t, [['KILAT!', -.05, H0.tu, '#fff6a0', 140], ['GUNTURNYA MANA?', H0.gu - .05, null, '#fff', 100]]);
  const dots = Math.floor(inv(H0.ta, H0.da, t) * 3.99); if (t > H0.ta && dots > 0) { const p = toScreen(cam, GL.budi + 150, HEADY - 160); sfxS(ctx, '.'.repeat(dots), p[0], p[1], 90, 1, '#fff', 0); }
});

// ===== 1 Baru dilepas: DUAR! =====
const T1 = { ba: wt(1, 'baru'), di: wt(1, 'dilepas'), du: wt(1, 'duar') };
SH(ls(1), ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = goyang(CKS(t, [[ls(1), { x: 720, y: 1080, z: 1.75 }], [T1.du, { x: 715, y: 1085, z: 1.85 }, ease], [ls(2), { x: 700, y: 1100, z: 1.6 }, easeIn]], 2), t, T1.du, 40);
  const ear = 1 - easeInOut(inv(T1.di - .1, T1.di + .4, t)), jump = t > T1.du ? Math.sin(clamp((t - T1.du) / .45) * Math.PI) : 0, boom = inv(T1.du - .05, T1.du + .1, t);
  ruang(ctx, t, cam, { tableShake: boom ? Math.sin(t * 60) * 8 * (1 - inv(T1.du, T1.du + .8, t)) : 0,
    fB: EM(t, [[ls(1), { eyes: 'half', mouth: 'wobble', sweat: .6 }], [T1.di + .1, 'lega', { look: [.5, -.2] }], [T1.du, { eyes: 'wide', mouth: 'teeth', browUp: .7, sweat: 1 }]], 2),
    armsB: t > T1.du ? { L: [2.6, .2], R: [2.6, .2] } : earArms(GL.budi, 1, ear), bExtra: { bob: -.12 * jump, squash: 1 + .08 * jump }, extra: c => { if (t < T1.du) earHands(c, GL.budi, ear); } });
  if (boom > 0) sfxS(ctx, 'DUAR!', 540, 430, 190, boom, '#ffd23a', -.08);
  tagSeq(ctx, t, [['DILEPAS...', T1.di - .05, T1.du, '#fff', 116]]);
});

// ===== 2 Kata Budi, guntur itu suara awan tabrakan, jadi harus nunggu awannya nabrak dulu =====
const T2 = { ka: wt(2, 'kata'), bu: wt(2, 'budi'), gu: wt(2, 'guntur'), su: wt(2, 'suara'), aw: wt(2, 'awan'), tb: wt(2, 'tabrakan'), ja: wt(2, 'jadi'), ha: wt(2, 'harus'), nu: wt(2, 'nunggu'), an: wt(2, 'awannya'), na: wt(2, 'nabrak'), du: wt(2, 'dulu') };
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  scr(ctx, c => { c.fillStyle = '#10142c'; c.fillRect(0, 0, W, H); });
  const bk = inv(ls(2), ls(2) + .25, t);
  // dekat: menyentuh di "tabrakan", mundur, lalu menabrak keras di "nabrak"
  const g1 = easeInOut(inv(T2.gu, T2.tb, t)), back = easeInOut(inv(T2.ja, T2.nu, t)), g2 = easeIn(inv(T2.nu, T2.na, t));
  const gap = T2.na <= t ? 0 : lerp(lerp(420, 40, g1), 260, back * (1 - g2)) * (1 - g2 * (t > T2.nu ? 1 : 0));
  const hit = t > T2.na ? 1 - inv(T2.na, T2.na + .5, t) : 0;
  bubble(ctx, c => { langitBG(c, t, SKYCAM, { rain: .5 });
    const sq = hit + (Math.abs(gap - 40) < 6 && t < T2.ja ? .3 : 0);
    drawAwanB(c, 540 - 170 - gap / 2 + Math.sin(t * 2) * 6, 600, 1, { t, dark: .3, squash: sq, face: EF(t, [[ls(2), 'licik', { look: [.8, 0] }], [T2.na, { eyes: 'x', mouth: 'wobble' }]], 3) });
    drawAwanB(c, 540 + 170 + gap / 2 - Math.sin(t * 2) * 6, 620, 1, { t, dark: .3, squash: sq, face: EF(t, [[ls(2), 'sombong', { look: [-.8, 0] }], [T2.na, { eyes: 'x', mouth: 'wobble' }]], 4) });
    if (hit > 0) { burst(c, 540, 610, 150 * (1 - hit * .3), 11, '#fff', 5); sfxText(c, 'BRAK!', 540, 440, 130, 1, '#ffd23a', -.1); }
    if (t > T2.tb && t < T2.ja) sfxText(c, 'BUK', 540, 440, 90, inv(T2.tb, T2.tb + .1, t), '#fff', -.1);
  }, bk);
  scr(ctx, c => drawStick(c, C(BUDI, { x: 230, y: 2280, s: 1500, shadow: false, flip: 1, armLen: 1.3, arms: { L: [.3, -.2], R: [2.3 + Math.sin(t * 4) * .15, .3] },
    face: EC(t, [[ls(2), 'sombong', { look: [.5, -.6] }], [T2.ja, 'licik', { look: [.6, -.6] }]], 5) })));
  tagSeq(ctx, t, [['TEORI BUDI:', ls(2) - .05, T2.gu, '#fff', 100], ['AWAN TABRAKAN', T2.aw - .05, T2.ja, '#ffd23a', 104], ['NUNGGU NABRAK', T2.nu - .05, null, '#fff', 104]], 280);
});

// ===== 3a Rani nggak setuju: =====
const T3 = { ra: wt(3, 'rani'), ng: wt(3, 'nggak'), se: wt(3, 'setuju'), gu: wt(3, 'gunturnya'), la: wt(3, 'lahir'), ba: wt(3, 'barengan'), ki: wt(3, 'kilat'), cu: wt(3, 'cuma'), ja: wt(3, 'jalannya'), le: wt(3, 'lelet') };
SH(ls(3), T3.gu, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CKS(t, [[ls(3), { x: 430, y: 1110, z: 1.35 }], [T3.gu, { x: 400, y: 1100, z: 1.5 }, ease]], 2);
  ruang(ctx, t, cam, { fR: EM(t, [[ls(3), 'datar', { look: [.8, .1] }], [T3.se, 'sombong', { look: [.8, -.1] }]], 6), armsR: { R: [2.2 + Math.sin(t * 12) * .25, .4], L: [.3, -.3] }, rExtra: { headTilt: Math.sin(t * 9) * .08 },
    fB: EF(t, [[ls(3), 'curiga', { look: [-.8, .1] }]], 7), flipB: -1 });
  tagSeq(ctx, t, [['NGGAK SETUJU!', T3.ng - .05, null, '#ff9ad0', 112]]);
});
// ===== 3b "Gunturnya lahir barengan kilat, cuma jalannya lelet." =====
SH(T3.gu, ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const z = lerp(1, 1.06, inv(T3.gu, ls(4), t)), cam = Object.assign({}, SKYCAM, { y: 1150, z });
  const strike = kedip(t, T3.la - .1), born = backOut(inv(T3.ba - .1, T3.ba + .25, t)), fast = easeIn(inv(T3.cu, T3.cu + .4, t)), slow = inv(T3.cu, ls(4), t);
  langitBG(ctx, t, cam, { rain: .6, flash: strike * .6 });
  inCam(ctx, cam, c => {
    drawAwanB(c, 420, 300, 1.1, { t, dark: .6 });
    drawKilat(c, 400, 380, 330, 1440, { seed: 8, k: t > T3.la - .1 ? Math.max(.25, strike) : 0, w: 18 });
    if (born > 0) {
      drawCahaya(c, lerp(330, 2000, fast), 1190 - 20 * born, 1.25 * born, { t, trail: 600 * fast, face: EF(t, [[T3.ba, 'bangga', { look: [.8, 0] }]], 8) });
      drawSuara(c, 330 + 300 * born + 90 * slow, 1440, 1.0 * born, { t, walk: t * .8, face: EF(t, [[T3.ba, 'netral', { look: [.8, -.2] }], [T3.le, { eyes: 'half', mouth: 'wobble', sweat: 1 }]], 9) });
      if (t > T3.le) sfxText(c, 'LELET...', 720, 980, 64, inv(T3.le, T3.le + .1, t), '#9fd3ff', -.08);
    }
  });
  tagSeq(ctx, t, [['LAHIR BARENGAN', T3.la - .05, T3.cu, '#ffd23a', 104], ['SUARA LELET', T3.ja - .05, null, '#9fd3ff', 112]]);
});

// ===== 4 Rani bahkan bisa tahu jauhnya petir, tanpa ngintip ke luar =====
const T4 = { ra: wt(4, 'rani'), bh: wt(4, 'bahkan'), bi: wt(4, 'bisa'), ta: wt(4, 'tahu'), ja: wt(4, 'jauhnya'), pe: wt(4, 'petir'), tp: wt(4, 'tanpa'), ng: wt(4, 'ngintip'), lu: wt(4, 'luar') };
const RX4 = 380, BX4 = 760;
SH(ls(4), ls(5), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CKS(t, [[ls(4), { x: 560, y: 1110, z: 1.25 }], [T4.tp, { x: 520, y: 1080, z: 1.4 }, ease], [ls(5), { x: 510, y: 1080, z: 1.45 }, easeIn]], 2);
  const turn = t > T4.bh, ear = easeOut(inv(T4.ja - .1, T4.pe + .1, t)), ex = RX4 - 118, ey = HEADY + 6;
  ruang(ctx, t, cam, {
    fR: EM(t, [[ls(4), 'sombong', { look: [.8, -.2] }], [T4.bh + .05, { eyes: 'happy', mouth: 'smirk', look: [0, 0] }]], 10), rx: RX4, flipR: turn ? -1 : 1,
    armsR: turn && ear > 0 ? { R: armTo(RX4, -1, lerp(RX4 - 60, ex, ear), lerp(1330, ey, ear), 1), L: [.3, -.3] } : null,
    fB: EM(t, [[ls(4), 'curiga', { look: [-.8, 0] }], [T4.tp + .05, 'kaget', { look: [-.8, -.1] }]], 11), bx: BX4, flipB: -1,
    extra: c => { if (turn && ear > .85) { ellipse(c, ex, ey, 26, 34); fillStroke(c, INK, 4); } } });
  scr(ctx, c => { const k = inv(T4.tp, T4.tp + .2, t); if (k > 0) { const p = toScreen(cam, BX4 + 40, HEADY - 190); qmark(c, p[0], p[1], 150 * backOut(k), -.1, 1); } });
  tagSeq(ctx, t, [['TAHU JAUHNYA PETIR', T4.ta - .05, T4.tp, '#fff6a0', 96], ['TANPA NGINTIP?!', T4.tp - .05, null, '#fff', 110]]);
});

// ===== 5 Kilat lagi. Rani ngitung: satu... dua... tiga... DUAR! =====
const T5 = { ki: wt(5, 'kilat'), la: wt(5, 'lagi'), ra: wt(5, 'rani'), ng: wt(5, 'ngitung'), s1: wt(5, 'satu'), s2: wt(5, 'dua'), s3: wt(5, 'tiga'), du: wt(5, 'duar') };
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = goyang(CKS(t, [[ls(5), { x: 520, y: 1110, z: 1.15 }], [T5.ng, { x: 470, y: 1100, z: 1.25 }, ease], [T5.du, { x: 440, y: 1090, z: 1.38 }, ease], [ls(6), { x: 440, y: 1090, z: 1.42 }, easeIn]], 2), t, T5.du, 34);
  const fl = kedip(t, ls(5) - .02), ear = easeOut(inv(ls(5) + .1, ls(5) + .4, t)) * (1 - inv(T5.du + .5, T5.du + .9, t)), cnt = t < T5.s1 ? 0 : t < T5.s2 ? 1 : t < T5.s3 ? 2 : t < T5.du ? 3 : 3;
  const jump = t > T5.du ? Math.sin(clamp((t - T5.du) / .45) * Math.PI) : 0;
  ruang(ctx, t, cam, { flash: fl, bolt: boltWin(5), tableShake: t > T5.du ? Math.sin(t * 60) * 8 * (1 - inv(T5.du, T5.du + .8, t)) : 0,
    fR: EM(t, [[ls(5), 'netral', { look: [.8, -.3] }], [T5.ng, 'licik', { look: [.7, -.2] }], [T5.du + .05, 'bangga', { look: [.8, .1] }]], 12),
    armsR: cnt > 0 ? { R: [lerp(1.6, 2.6, cnt / 3), .25], L: [.3, -.3] } : null,
    fB: EM(t, [[ls(5), 'kaget', { look: [.8, -.4] }], [ls(5) + .6, { eyes: 'flinch', mouth: 'wobble', sweat: .8 }], [T5.du, { eyes: 'wide', mouth: 'teeth', browUp: .7, sweat: 1 }]], 13),
    armsB: t > T5.du && jump > 0 ? { L: [2.6, .2], R: [2.6, .2] } : earArms(GL.budi, 1, ear, Math.sin(t * 40) * 3), bExtra: { bob: -.1 * jump }, extra: c => { if (!(t > T5.du && jump > 0)) earHands(c, GL.budi, ear, Math.sin(t * 40) * 3); } });
  if (cnt > 0 && t < T5.du) { const ts = [T5.s1, T5.s2, T5.s3][cnt - 1]; scr(ctx, c => popText(c, String(cnt), 540, 560, 260, inv(ts - .05, ts + .1, t), '#fff', INK, -.05)); }
  if (t > T5.du - .05) sfxS(ctx, 'DUAR!', 540, 470, 190, inv(T5.du - .05, T5.du + .1, t), '#ffd23a', -.08);
  tagSeq(ctx, t, [['KILAT LAGI!', ls(5) - .05, T5.ng, '#fff6a0', 116], ['RANI NGITUNG', T5.ng - .05, T5.s1, '#ff9ad0', 104]]);
});

// ===== 6 "Tiga detik. Berarti petirnya sekitar satu kilo dari sini." =====
const T6 = { ti: wt(6, 'tiga'), de: wt(6, 'detik'), be: wt(6, 'berarti'), pe: wt(6, 'petirnya'), se: wt(6, 'sekitar'), sa: wt(6, 'satu'), ki: wt(6, 'kilo'), da: wt(6, 'dari'), si: wt(6, 'sini') };
const HOUSE = [1000, 1440], STRIKE = [-120, 1440];
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CKS(t, [[ls(6), { x: 480, y: 1140, z: .74 }], [T6.sa, { x: 450, y: 1150, z: .72 }, ease], [ls(7), { x: 460, y: 1150, z: .74 }, easeIn]], 1.5);
  const strike = kedip(t, ls(6) + .05), ph = inv(ls(6) + .1, T6.sa, t);
  langitBG(ctx, t, cam, { rain: .6, flash: strike * .5, house: [HOUSE[0], HOUSE[1], .9] });
  inCam(ctx, cam, c => {
    drawAwanB(c, -60, 300, 1.2, { t, dark: .6 });
    drawKilat(c, -100, 380, STRIKE[0], STRIKE[1], { seed: 12, k: Math.max(.3 * (1 - inv(T6.ki, T6.si, t)), strike), w: 20 });
    const lx = lerp(STRIKE[0], HOUSE[0] - 200, easeOut(inv(ls(6) + .05, ls(6) + .25, t)));
    if (t < T6.be) drawCahaya(c, lx, 1050, .7, { t, trail: 300, face: EF(t, [[ls(6), 'bangga']], 14) });
    drawGelombang(c, STRIKE[0], 1300, lerp(80, HOUSE[0] - STRIKE[0] - 180, ph), 1 - inv(T6.ki, T6.si, t) * .5, { n: 3, gap: 60, dir: 0, spread: 1.6 });
    drawPenggaris(c, STRIKE[0] + 40, HOUSE[0] - 200, 1470, inv(T6.se - .1, T6.ki + .2, t));
  });
  scr(ctx, c => { const k = inv(T6.ti - .05, T6.ti + .1, t); if (k > 0) { c.save(); c.translate(540, 560); c.scale(backOut(k), backOut(k)); rrect(c, -200, -80, 400, 160, 30); fillStroke(c, '#fff', 8); text(c, '3 DETIK', 0, 0, 84, INK, INK, 0); c.restore(); } });
  tagSeq(ctx, t, [['± 1 KILOMETER', T6.sa - .05, null, '#ffd23a', 104]]);
});

// ===== 7 Lalu kilat nyamber dekat banget: langsung DUAR, nggak pakai nunggu =====
const T7 = { la: wt(7, 'lalu'), ki: wt(7, 'kilat'), ny: wt(7, 'nyamber'), de: wt(7, 'dekat'), ba: wt(7, 'banget'), lg: wt(7, 'langsung'), du: wt(7, 'duar'), ng: wt(7, 'nggak'), pa: wt(7, 'pakai'), nu: wt(7, 'nunggu') };
SH(ls(7), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const b0 = T7.ny, cam = goyang(goyang(CKS(t, [[ls(7), { x: 760, y: 900, z: 1.3 }], [b0, { x: 800, y: 880, z: 1.45 }, ease], [T7.du, { x: 650, y: 1020, z: 1.25 }, ease], [ls(8), { x: 560, y: 1080, z: 1.2 }, easeIn]], 2), t, b0 + .08, 50), t, T7.du, 25);
  const fl = Math.max(kedip(t, b0 - .02), .6 * kedip(t, T7.du - .05)), boom = inv(b0 + .05, b0 + .15, t);
  ruang(ctx, t, cam, { flash: fl, bolt: boltWin(9, 1), tableShake: t > b0 ? Math.sin(t * 60) * 10 * (1 - inv(b0, T7.nu, t)) : 0,
    fR: EM(t, [[ls(7), 'netral', { look: [.8, -.4] }], [b0 + .1, 'kaget', { look: [.8, -.3] }], [T7.ng, 'sombong', { look: [.8, 0] }]], 15),
    fB: EM(t, [[ls(7), 'curiga', { look: [.8, -.4] }], [b0 + .08, { eyes: 'spiral', mouth: 'teeth', sweat: 1, browUp: .7 }]], 16), armsB: t > b0 + .05 ? { L: [2.6, .3], R: [2.6, .3] } : null,
    bExtra: { bob: t > b0 ? -.1 * Math.abs(Math.sin((t - b0) * 9)) * (1 - inv(b0, T7.nu, t)) : 0 } });
  if (boom > 0) sfxS(ctx, 'DUAR!', 540, 580, 210, boom, '#ffd23a', -.08);
  tagSeq(ctx, t, [['DEKAT BANGET!', T7.de - .05, T7.lg, '#fff6a0', 112], ['0 DETIK!', T7.lg - .05, null, '#ff8a8a', 130]], 260);
});

// ===== 8 Kucing ngumpet di kolong, cicak kabur ke balik jam, Budi loncat ke bawah meja (lelucon tiga) =====
const T8 = { ku: wt(8, 'kucing'), ng: wt(8, 'ngumpet'), ko: wt(8, 'kolong'), ci: wt(8, 'cicak'), ka: wt(8, 'kabur'), ba: wt(8, 'balik'), ja: wt(8, 'jam'), bu: wt(8, 'budi'), lo: wt(8, 'loncat'), bw: wt(8, 'bawah'), me: wt(8, 'meja') };
const CLK = JL.clock, CIC0 = [560, 820], CROT = Math.atan2(CLK[0] - CIC0[0], -(CLK[1] - CIC0[1]));
SH(ls(8), ls(9), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CKS(t, [[ls(8), { x: -80, y: 1330, z: 1.25 }], [T8.ci - .15, { x: -200, y: 1340, z: 1.35 }, ease], [T8.ci + .25, { x: 320, y: 740, z: 1.5 }, easeInOut],
    [T8.bu - .1, { x: 290, y: 720, z: 1.55 }, ease], [T8.lo + .1, { x: 240, y: 1220, z: .95 }, easeInOut], [T8.me, { x: -120, y: 1300, z: 1.2 }, ease], [ls(9), { x: -150, y: 1310, z: 1.28 }, easeIn]], 2);
  const run = easeInOut(inv(ls(8) - .1, T8.ko, t)), kx = lerp(420, GL.table[0] - 40, run);
  const cq = easeInOut(inv(T8.ci, T8.ja, t)), cx = lerp(CIC0[0], CLK[0], cq), cy = lerp(CIC0[1], CLK[1], cq);
  const j = easeInOut(inv(T8.lo - .1, T8.bw + .1, t)), bx = lerp(GL.budi, GL.table[0] + 120, j), hop = Math.sin(j * Math.PI) * 280, under = t > T8.bw + .1;
  ruang(ctx, t, cam, { tableShake: under ? Math.sin(t * 50) * 4 : 0,
    under: c => {
      drawKucing(c, kx + (run >= 1 ? Math.sin(t * 40) * 3 : 0), JL.feet, .8, { t, crouch: run >= 1 ? .8 : .3, flip: 1, face: EF(t, [[ls(8), { eyes: 'wide', mouth: 'o', browUp: .6, look: [-.8, 0] }]], 24) });
      if (t < T8.ja + .1) drawCicakB(c, cx + Math.sin(cq * 9) * 12, cy, .7, { t, tail: 1, walk: cq < 1 ? 1 : 0, rot: CROT + Math.cos(cq * 9) * .12, face: cq < .2 ? EXPR.kaget : null });
      drawWallClock(c, CLK[0], CLK[1], 105, 9, 0);
      if (t > T8.ja + .1) { c.save(); c.translate(CLK[0] + 70, CLK[1] + 80); c.rotate(.5 + Math.sin(t * 9) * .15); line(c, 0, 0, 40, 60, 22, INK); line(c, 0, 0, 40, 60, 12, CKP.body); c.restore(); }
      if (under) drawStick(c, C(BUDI, { x: bx + Math.sin(t * 40) * 4, y: FT, s: S, flip: -1, squash: .5, armLen: 1.3, legs: standL, arms: { L: [2.6, .3], R: [2.6, .3] },
        face: EF(t, [[T8.bw, { eyes: 'flinch', mouth: 'wobble', sweat: 1 }]], 18) })); },
    extra: c => { if (!under && t > T8.lo - .1) drawStick(c, C(BUDI, { x: bx, y: FT - hop, s: S, flip: -1, armLen: 1.3, legs: { L: [.9, -1.2], R: [.6, -1.0] }, arms: { L: [2.8, .2], R: [2.4, .2] }, lean: -.4 * Math.sin(j * Math.PI),
      face: EF(t, [[ls(8), { eyes: 'spiral', mouth: 'teeth', sweat: 1 }]], 19) })); } });
  tagSeq(ctx, t, [['KUCING: KOLONG', T8.ku - .05, T8.ci, '#fff', 104], ['CICAK: BALIK JAM', T8.ci - .05, T8.bu, '#9dff7a', 100], ['BUDI: BAWAH MEJA', T8.bu - .05, null, '#ffd23a', 100]]);
});

// ===== 9 Guntur itu bukan awan tabrakan, tapi suara dari kilat itu sendiri =====
const T9 = { gu: wt(9, 'guntur'), it: wt(9, 'itu'), bu: wt(9, 'bukan'), aw: wt(9, 'awan'), tb: wt(9, 'tabrakan'), ta: wt(9, 'tapi'), su: wt(9, 'suara'), da: wt(9, 'dari'), ki: wt(9, 'kilat'), sd: wt(9, 'sendiri') };
SH(ls(9), ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = Object.assign({}, SKYCAM, { z: lerp(1, 1.08, inv(ls(9), ls(10), t)) });
  const away = easeIn(inv(T9.ta - .1, T9.ta + .35, t)), strike = kedip(t, T9.su - .15), ring = inv(T9.su, ls(10), t);
  langitBG(ctx, t, cam, { rain: .5, flash: strike * .5 });
  inCam(ctx, cam, c => {
    drawAwanB(c, 370 - 700 * away, 620, 1, { t, dark: .3, squash: .3 * (1 - away), face: EF(t, [[ls(9), { eyes: 'x', mouth: 'wobble' }]], 20) });
    drawAwanB(c, 710 + 700 * away, 640, 1, { t, dark: .3, squash: .3 * (1 - away), face: EF(t, [[ls(9), { eyes: 'x', mouth: 'wobble' }]], 21) });
    if (t > T9.su - .15) { drawAwanB(c, 540, 250, 1.2, { t, dark: .6 }); drawKilat(c, 560, 330, 500, 1440, { seed: 4, k: Math.max(.5, strike), w: 20 });
      for (let i = 0; i < 3; i++) { const q = (ring * 2.2 + i / 3) % 1; drawGelombang(c, 530, 900, 120 + q * 520, (1 - q) * Math.min(1, ring * 4), { n: 1, spread: TAU }); }
      sfxText(c, 'DUAR', 540, 1180, 110, inv(T9.su, T9.su + .15, t), '#ffd23a', -.06); }
  });
  scr(ctx, c => { const k = inv(T9.bu - .05, T9.bu + .15, t) * (1 - away); if (k > 0) { c.save(); c.globalAlpha = k; drawStamp(c, 540, 640, .9, 'MITOS', {}); c.restore(); } });
  tagSeq(ctx, t, [['BUKAN AWAN TABRAKAN', T9.bu - .05, T9.ta, '#ff8a8a', 80], ['SUARA KILAT SENDIRI', T9.su - .05, null, '#ffd23a', 82]], 1540);
});

// ===== 10 Kilat manasin udara sampai lima kali lebih panas dari permukaan matahari (dunia mikro) =====
const T10 = { ki: wt(10, 'kilat'), ma: wt(10, 'manasin'), ud: wt(10, 'udara'), sa: wt(10, 'sampai'), li: wt(10, 'lima'), ka: wt(10, 'kali'), le: wt(10, 'lebih'), pa: wt(10, 'panas'), da: wt(10, 'dari'), pe: wt(10, 'permukaan'), mt: wt(10, 'matahari') };
const MOL = (() => { const a = []; for (let r = 0; r < 7; r++) for (let k = 0; k < 4; k++) { const sd = k < 2 ? -1 : 1, d = 150 + (k % 2) * 190 + (r % 2) * 50; a.push([sd, d, 420 + r * 190 + (k % 2) * 60]); } return a; })();
function molekulScene(c, t, heat, blast, faceK) {
  MOL.forEach(([sd, d, y], i) => { const near = d < 260 ? 1 : .55, dd = d + blast * (300 + (i % 5) * 50), hot = heat * near * (1 - blast * .4);
    drawMolekul(c, 540 + sd * dd + Math.sin(t * 30 + i) * 6 * heat, y + Math.sin(t * 2 + i) * 10, 52, { t: t + i, hot,
      face: i % 3 === 0 ? (faceK === 2 ? EXPR.kaget : faceK === 1 && hot > .5 ? EXPR.meringis : EXPR.netral) : null }); });
}
SH(ls(10), ls(11), { tr: 'whip' }, (ctx, lt, t) => {
  scr(ctx, c => {
    const z = lerp(1.1, 1, easeOut(inv(ls(10), ls(10) + 1, t))); c.translate(540, 960); c.scale(z, z); c.translate(-540, -960);
    const heat = easeInOut(inv(T10.ma - .1, T10.pa + .3, t));
    mikroUdaraBG(c, t, heat);
    c.save(); const g = c.createLinearGradient(400, 0, 680, 0); g.addColorStop(0, 'rgba(255,240,180,0)'); g.addColorStop(.5, `rgba(255,240,180,${.35 + .2 * heat})`); g.addColorStop(1, 'rgba(255,240,180,0)'); c.fillStyle = g; c.fillRect(380, 0, 320, H); c.restore();
    drawKilat(c, 560, -40, 520, 1960, { seed: 6, k: 1, w: 30, branches: 1 });
    molekulScene(c, t, heat, 0, 1);
    drawTermoKilat(c, 960, 1500, .85, lerp(.15, 1, easeInOut(inv(T10.ma, T10.mt + .2, t))));
    for (let i = 0; i < 5; i++) { const ts = lerp(T10.li, T10.mt, i / 4), k = backOut(inv(ts - .1, ts + .15, t)); if (k > 0) { c.save(); c.translate(150 + i * 140, 560); c.scale(k, k); drawMatahari(c, 0, 0, 54, t); c.restore(); } }
  });
  tagSeq(ctx, t, [['MANASIN UDARA', T10.ma - .05, T10.li, '#ff9f5a', 104], ['5× PANAS MATAHARI', T10.li - .05, null, '#ffd23a', 96]], 330);
});

// ===== 11 Udaranya mengembang mendadak, meledak jadi DUAR =====
const T11 = { ud: wt(11, 'udaranya'), me: wt(11, 'mengembang'), md: wt(11, 'mendadak'), ml: wt(11, 'meledak'), ja: wt(11, 'jadi'), du: wt(11, 'duar') };
SH(ls(11), ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  const sk = t > T11.ml ? Math.exp(-(t - T11.ml) * 3) * 26 : 0, sk2 = t > T11.du ? Math.exp(-(t - T11.du) * 3) * 34 : 0;
  scr(ctx, c => {
    c.translate(Math.sin(t * 70) * (sk + sk2), Math.cos(t * 55) * (sk + sk2) * .7);
    const blast = .75 * easeOut(inv(T11.me - .05, T11.du + .4, t));
    mikroUdaraBG(c, t, 1 - blast * .5);
    drawKilat(c, 560, -40, 520, 1960, { seed: 6, k: 1 - blast * .5, w: 30, branches: 1 });
    molekulScene(c, t, 1, blast, 2);
    const ring = inv(T11.ml - .1, T11.du + .4, t); if (ring > 0) { for (let i = 0; i < 2; i++) { const r = 100 + (ring * 1.2 - i * .25) * 1100; if (r > 100) { c.save(); c.globalAlpha = Math.max(0, 1 - ring); circle(c, 540, 960, r); c.lineWidth = 40; c.strokeStyle = '#fff'; c.stroke(); c.restore(); } } }
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; pushArrow(c, 540 + Math.cos(a) * (160 + blast * 260), 960 + Math.sin(a) * (160 + blast * 260), a, 110, blast * (1 - inv(T11.du, T11.du + .4, t))); }
  });
  if (t > T11.du - .05) sfxS(ctx, 'DUAR!', 540, 900, 230, inv(T11.du - .05, T11.du + .1, t), '#ffd23a', -.08);
  tagSeq(ctx, t, [['MENGEMBANG MENDADAK', T11.me - .05, T11.ml, '#fff', 74], ['MELEDAK!', T11.ml - .05, null, '#ff9f5a', 130]], 330);
});

// ===== 12a Malamnya, Budi nyoba ngitung sendiri, =====
const T12 = { ma: wt(12, 'malamnya'), bu: wt(12, 'budi'), ny: wt(12, 'nyoba'), ng: wt(12, 'ngitung'), se: wt(12, 'sendiri'), da: wt(12, 'dan') };
SH(ls(12), T12.da, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CKS(t, [[ls(12), { x: 600, y: 1120, z: 1.15 }], [T12.ng, { x: 660, y: 1120, z: 1.22 }, ease], [T12.da, { x: 690, y: 1120, z: 1.25 }, easeIn]], 2);
  const fin = easeOut(inv(T12.ny - .1, T12.ng + .1, t));
  ruang(ctx, t, cam, { jam: 11,
    fB: EM(t, [[ls(12), 'netral', { look: [.8, -.3] }], [T12.ny, 'sombong', { look: [.8, -.4] }]], 22), armsB: fin > 0 ? { R: [lerp(.3, 2.4, fin), lerp(-.3, .3, fin)], L: [.3, -.3] } : null,
    fR: EF(t, [[ls(12), 'licik', { look: [.8, -.1] }]], 23), rx: 260 });
  tagSeq(ctx, t, [['MALAMNYA...', ls(12) - .05, T12.ny, '#fff', 112], ['NGITUNG SENDIRI', T12.ng - .05, null, '#fff6a0', 108]]);
});
// ===== 12b dan -> komposisi frame 0 (loop) =====
SH(T12.da, ENDT, { tr: 'whip' }, (ctx, lt, t) => {
  const tl = t - ENDT + 1 / 30;
  hookScene(ctx, t, cam0(tl), tl);
});
