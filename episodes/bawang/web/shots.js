// ---------- Fakta Unik: "Lomba iris bawang" (bawang v2, versi cerita, ~66 dtk, tanpa CTA) ----------
// Pola naskah ref-02: aksi aneh di frame 0, tokoh pengejek + taruhan, gagal palsu, mekanisme di akhir, kalimat terakhir menyambung ke frame 0 (loop).
// Aturan v5/v6/v7: kamera selalu bergerak, semua waktu dari kata (wt), satu fungsi per aset (env_bawang.js), tata letak BW terkunci.
const SHOTS = [];
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
const BK = BW.back, TOP = BW.top, IBUX = BW.ibu, BUDX = BW.budi, BI = BW.boardI, BB = BW.boardB, BTOP = TOP - 30;
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, BK, 600, flip, wx, wy, bend);
function ibu(ctx, t, face, arms, x = IBUX, extra = {}) { drawStick(ctx, C(IBU, Object.assign({ x, y: BK, s: 600, armLen: 1.3, legs: standL, arms: arms || idleArms(t, 1), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
function budi(ctx, t, face, arms, x = BUDX, flip = -1, extra = {}) { drawStick(ctx, C(BUDI, Object.assign({ x, y: BK, s: 600, flip, armLen: 1.3, legs: standL, arms: arms || idleArms(t, 2), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
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

// ===== jadwal lomba (global, dipakai semua shot supaya tumpukan & penghitung konsisten) =====
const TB0 = wt(3, 'ngebut', .25);                         // Budi mulai ngebut
const TI0 = wt(7, 'satu', -.1);                           // Ibu mulai mengiris
const cntB = t => kf(t, [[TB0, 0], [ls(5), 10], [ls(6) + .2, 20], [ls(8), 30], [wt(9, 'berhenti'), 38], [ls(11), 42]], x => x);
const cntI = t => kf(t, [[TI0, 0], [ls(8), 4], [ls(9), 12], [ls(10), 24], [wt(10, 'tinggi', .4), 46], [ls(11), 48]], x => x);
const chopPh = (t, tA, P) => t < tA ? -1 : ((t - tA) / P) % 1;
const chopY = (t, tA, P, yUp, yDn) => { const ph = chopPh(t, tA, P); if (ph < 0) return yUp; return ph < .3 ? lerp(yUp, yDn, easeIn(ph / .3)) : lerp(yDn, yUp, easeOut((ph - .3) / .7)); };
// posisi kerja (terkunci)
const CUT_I = BI + 60, CUT_B = BB - 60, PILE_I = BI - 90, PILE_B = BB + 100, STONE = [BI + 20, BTOP], ONI0 = [BI + 150, BTOP];
const GRIP_UP = 1140, GRIP_DN = BTOP - 70 - 16;           // knife edge menyentuh puncak bawang (s .5)
const SHF = 2 * Math.PI * Math.round(7.5 * ENDT / (2 * Math.PI)) / ENDT;   // frekuensi asah: bilangan bulat siklus sampai ENDT -> frame akhir = frame 0 (loop)
const SHARP = t => [STONE[0] - 120 + 62 * Math.cos(t * SHF), STONE[1] - 82 - 16];   // gerak mengasah (titik genggam)

// ----- adegan dapur bersama: urutan dapurBack -> tokoh -> meja -> talenan/benda -> pisau -> efek -----
// o: { fI, fB, armsI, armsB, stone, oniI, oniB, pileI, pileB, knifeI:{g,rot,o}, knifeB:{g,rot,o}, tearsB, tearsI, plates, extra(ctx) , bg }
function kitchen(ctx, t, cam, o) {
  dapurBack(ctx, t, cam, o.bg || {});
  if (o.fI) ibu(ctx, t, o.fI, o.armsI);
  if (o.fB) budi(ctx, t, o.fB, o.armsB, BUDX, -1, o.budiExtra || {});
  dapurMeja(ctx);
  drawTalenan(ctx, BI, TOP); drawTalenan(ctx, BB, TOP);
  if (o.stone) drawBatuAsah(ctx, STONE[0], STONE[1]);
  if (o.pileI != null) drawSlicePile(ctx, PILE_I, BTOP, o.pileI, .8, 3);
  if (o.pileB != null) drawSlicePile(ctx, PILE_B, BTOP, o.pileB, .8, 5);
  if (o.oniI) drawBawang(ctx, o.oniI[0], o.oniI[1], o.oniI[2] || .5, o.oniI[3] || {});
  if (o.oniB) drawBawang(ctx, o.oniB[0], o.oniB[1], o.oniB[2] || .5, o.oniB[3] || {});
  if (o.under) o.under(ctx);
  if (o.knifeI) drawPisau(ctx, o.knifeI.g[0], o.knifeI.g[1], .6, o.knifeI.rot || 0, Object.assign({ t }, o.knifeI.o || {}));
  if (o.knifeB) drawPisau(ctx, o.knifeB.g[0], o.knifeB.g[1], .6, o.knifeB.rot || 0, Object.assign({ t, flip: -1, dull: true }, o.knifeB.o || {}));
  if (o.tearsB) drawTokohTears(ctx, BUDX, BK, 600, o.tearsB, t, 2);
  if (o.tearsI) drawTokohTears(ctx, IBUX, BK, 600, o.tearsI, t, 1);
  if (o.extra) o.extra(ctx);
}
const armsSharp = t => { const g = SHARP(t); return { g, arms: { L: armTo(IBUX, 1, g[0] + 40, g[1] + 6, -1), R: armTo(IBUX, 1, g[0], g[1], -1) } }; };
const sharpKnife = (t, o = {}) => { const g = SHARP(t); return { g, rot: .03, o }; };

// ===== 0 HOOK: Ibu sudah mengasah pisau (SREK) di frame 0, jam dinding berputar, kamera ke bawang yang bosan =====
const H0 = { li: wt(0, 'lima'), pe: wt(0, 'penuh'), cu: wt(0, 'cuma'), ba: wt(0, 'bawang') };
const cam0 = t => CK(t, [[0, { x: 300, y: 1130, z: 1.75 }], [H0.pe, { x: 320, y: 1080, z: 1.6 }, easeOut], [H0.cu + .2, { x: 360, y: 1110, z: 1.65 }], [H0.ba, { x: 440, y: 1170, z: 1.95 }, ease], [ls(1), { x: 470, y: 1180, z: 2.1 }, easeIn]], 2);
function hookScene(ctx, t, cam, fI, bored) {
  const a = armsSharp(t);
  kitchen(ctx, t, cam, {
    bg: { fast: inv(H0.li - .2, H0.li + .2, t) * (1 - inv(H0.cu, H0.cu + .3, t)), jam: 7 + 5 * ease(inv(H0.li - .2, H0.cu, t)) },
    fI, armsI: a.arms, stone: true, oniI: [ONI0[0], ONI0[1], .55, { face: bored, t }],
    knifeI: sharpKnife(t, { shine: .6 }),
    extra: c => { const ph = Math.cos(t * SHF); for (const [sx, k] of [[STONE[0] - 60, ph > .7], [STONE[0] + 70, ph < -.7]]) if (k) sfxText(c, 'SREK', sx, STONE[1] - 160, 46, 1, '#fff', sx < STONE[0] ? -.15 : .15); }
  });
}
SH(0, ls(1), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t);
  hookScene(ctx, t, cam, EM(t, [[0, 'ngeden', { look: [.6, .7] }], [H0.ba + .1, 'lega']], 1), EF(t, [[0, 'datar'], [H0.ba, 'datar', { look: [-.8, -.3] }]], 2));
  popText(ctx, '5 MENIT', 330, 820, 92, inv(H0.li, H0.li + .25, t) * (1 - inv(H0.ba, H0.ba + .2, t)), '#ffd23a', INK, -.08);
});

// ===== 1 Budi ketawa: "Bu, keburu bawangnya tumbuh!" -> bawang menumbuhkan tunas =====
const T1 = { ke: wt(1, 'ketawa'), bu: wt(1, 'bu'), kb: wt(1, 'keburu'), tu: wt(1, 'tumbuh') };
const cam1 = t => CK(t, [[ls(1), { x: 820, y: 1060, z: 1.55 }], [ls(1) + .6, { x: 830, y: 1050, z: 1.7 }, easeOut], [T1.kb - .1, { x: 820, y: 1060, z: 1.7 }], [T1.kb + .35, { x: 480, y: 1120, z: 1.75 }, ease], [ls(2), { x: 480, y: 1060, z: 1.9 }]], 2);
SH(ls(1), ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam1(t), lau = t > T1.ke - .1 && t < T1.kb + .3;
  const a = armsSharp(t), sp = easeOut(inv(T1.tu - .25, T1.tu + .45, t));
  const fB = EM(t, [[ls(1), 'curiga', { look: [-.8, .3] }], [T1.ke, 'bangga'], [T1.tu + .1, 'sombong', { look: [-.8, .2] }]], 3);
  kitchen(ctx, t, cam, {
    fI: EF(t, [[ls(1), 'ngeden', { look: [.6, .7] }], [T1.tu + .2, 'datar', { look: [.8, 0] }]], 4), armsI: a.arms, stone: true,
    fB, armsB: { L: lau ? [2.5 + Math.sin(t * 22) * .15, .5] : idleArms(t, 2).L, R: armTo(BUDX, -1, 640, 1040 + (lau ? Math.sin(t * 20) * 10 : 0), 1) },
    budiExtra: { bob: lau ? Math.abs(Math.sin(t * 14)) * -.02 : 0 },
    oniI: [ONI0[0], ONI0[1], .55, { sprout: sp, t, face: EF(t, [[ls(1), 'datar'], [T1.tu, 'datar', { look: [0, -1] }]], 5) }],
    knifeI: sharpKnife(t),
  });
  if (lau) { sfxText(ctx, 'HAHA', 900, 860, 70, inv(T1.ke, T1.ke + .1, t), '#ffd23a', .12); sfxText(ctx, 'HA!', 1010, 960, 54, inv(T1.ke + .25, T1.ke + .35, t), '#fff', -.1); }
  if (sp > 0) glint(ctx, ONI0[0] + 30, ONI0[1] - 230, 90, t, T1.tu + .1);
});

// ===== 2 Taruhan: papan muncul baris demi baris, piring kotor berwajah =====
const T2 = { ta: wt(2, 'taruhan'), si: wt(2, 'siapa'), sk: wt(2, 'sekilo'), be: wt(2, 'bebas'), cu: wt(2, 'cuci'), se: wt(2, 'seminggu') };
const cam2 = t => CK(t, [[ls(2), { x: 540, y: 1000, z: 1.05 }], [ls(2) + .7, { x: 540, y: 980, z: 1.12 }, easeOut], [T2.be, { x: 545, y: 960, z: 1.18 }], [T2.cu + .3, { x: 545, y: 1040, z: 1.28 }, ease], [ls(3), { x: 560, y: 1060, z: 1.34 }]], 2.5);
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam2(t), a = armsSharp(t);
  kitchen(ctx, t, cam, {
    fI: EM(t, [[ls(2), 'ngeden', { look: [.6, .7] }], [T2.ta + .1, 'licik', { look: [.8, -.2] }], [T2.cu, 'sombong']], 6), armsI: a.arms, stone: true,
    fB: EM(t, [[ls(2), 'sombong', { look: [-.8, -.2] }], [T2.si, 'licik', { look: [-.8, -.2] }], [T2.cu + .1, 'cemas', { look: [-.2, .6] }]], 7),
    armsB: { L: [.4, -.9], R: [.4, -.9] },
    oniI: [ONI0[0], ONI0[1], .55, { sprout: 1, t, face: EF(t, [[ls(2), 'datar', { look: [0, -1] }]], 8) }],
    oniB: [CUT_B, BTOP, .5, {}],
    knifeI: sharpKnife(t),
    extra: c => { const k = inv(T2.cu - .1, T2.cu + .2, t); if (k > 0) { c.save(); c.translate(545, BTOP); const s2 = backOut(k); c.scale(s2, s2); drawPiringTumpuk(c, 0, 0, .75, 7, { face: EF(t, [[T2.cu, 'licik']], 9), t }); c.restore(); } }
  });
  ctx.save(); applyCam(ctx, cam, 1);
  const L = [['TARUHAN!', 76, '#e5262a']];
  if (t > T2.sk - .1) L.push(['1 KG BAWANG MERAH', 52]);
  if (t > T2.be - .1) L.push(['BEBAS CUCI PIRING', 52, '#2f63c9']);
  if (t > T2.se - .1) L[3] ? 0 : L.push(['1 MINGGU', 58, '#2f63c9']);
  drawPapanTaruhan(ctx, 545, 600, .9, inv(T2.ta - .1, T2.ta + .25, t), L.slice(0, 4));
  ctx.restore();
});

// ===== 3 Budi: pisau lama tumpul, langsung ngebut: TAK-TAK-TAK-TAK =====
const T3 = { pi: wt(3, 'pisau'), tu: wt(3, 'tumpul'), ng: wt(3, 'ngebut'), tk: wt(3, 'taktaktaktak') };
const PB = .2;
const cam3 = t => CK(t, [[ls(3), { x: 820, y: 1120, z: 1.6 }], [T3.pi, { x: 800, y: 1170, z: 1.85 }, easeOut], [T3.tu + .2, { x: 780, y: 1190, z: 2.05 }, ease], [T3.ng, { x: 770, y: 1150, z: 1.75 }, ease], [ls(4), { x: 760, y: 1150, z: 1.85 }]], 2);
SH(ls(3), ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam3(t), gy = chopY(t, TB0, PB, GRIP_UP, GRIP_DN), g = [CUT_B + 120, gy];
  const lift = t < T3.pi ? 0 : t < TB0 ? (1 - inv(T3.pi, T3.pi + .3, t)) * 0 : 0;
  kitchen(ctx, t, cam, {
    fB: EM(t, [[ls(3), 'licik', { look: [-.6, .6] }], [T3.tu + .1, 'sombong', { look: [-.5, .7] }], [T3.ng + .1, 'ngeden', { look: [-.6, .8] }]], 10),
    armsB: { L: idleArms(t, 2).L, R: armTo(BUDX, -1, g[0], g[1] - lift, 1) },
    fI: EF(t, [[ls(3), 'netral', { look: [.6, .7] }]], 11), armsI: armsSharp(t).arms, stone: true, knifeI: sharpKnife(t),
    oniB: [CUT_B, BTOP, .5, {}], pileB: cntB(t),
    knifeB: { g, rot: 0, o: { face: EF(t, [[ls(3), 'datar'], [T3.tu, 'meringis']], 12) } },
  });
  const ph = chopPh(t, TB0, PB);
  if (ph >= .3 && ph < .55) { const r = rng(Math.floor((t - TB0) / PB)); sfxText(ctx, 'TAK', CUT_B - 60 + r() * 120, 1010 + r() * 60, 58, 1, '#fff', (r() - .5) * .5); }
  if (t > T3.tu && t < T3.tu + .5) glint(ctx, CUT_B + 10, GRIP_UP + 30, 70, t, T3.tu);
});

// ===== 4 "Ibu? Masih ngasah." whip ke Ibu yang tenang =====
const cam4 = t => CK(t, [[ls(4), { x: 330, y: 1100, z: 1.55 }], [ls(4) + .5, { x: 320, y: 1090, z: 1.7 }, easeOut], [ls(5), { x: 315, y: 1085, z: 1.78 }]], 2);
SH(ls(4), ls(5), { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = cam4(t), a = armsSharp(t);
  kitchen(ctx, t, cam, { fI: EM(t, [[ls(4), 'lega']], 13), armsI: a.arms, stone: true, knifeI: sharpKnife(t, { shine: .8 }), oniI: [CUT_I + 90, BTOP, .5, {}] });
  const k = inv(ls(4) + .05, ls(4) + .3, t); if (k > 0) qmark(ctx, 330, 800 + Math.sin(t * 4) * 8, 150 * backOut(k), .12);
});

// ===== 5 close-up Budi: "Sepuluh iris, mata Budi mulai panas." penghitung 10, mata berkaca =====
const T5 = { sp: wt(5, 'sepuluh'), ma: wt(5, 'mata'), pa: wt(5, 'panas') };
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 760, y: 1000, z: 1.25 }], [ls(6), { x: 760, y: 990, z: 1.35 }]], 3);
  blurLayer(ctx, c => kitchen(c, t, cam, { pileB: cntB(t), oniB: [CUT_B, BTOP, .5, {}] }), 8);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const fb = EC(t, [[ls(5), 'ngeden', { look: [-.4, .8] }], [T5.ma, 'cemas', { look: [-.3, .8] }], [T5.pa + .1, { eyes: 'squint', mouth: 'wobble', browAng: .3, sweat: 1 }]], 14);
  const shk = t > T5.pa ? Math.sin(t * 40) * 4 : 0, zy = 2200 - 60 * ease(inv(ls(5), ls(6), t)), ZS = 1800;
  // uap pedas samar naik ke mata (di belakang kepala)
  for (let i = 0; i < 4; i++) { const q = (t * .7 + i / 4) % 1; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .55 * inv(T5.ma - .3, T5.ma + .2, t); puff(ctx, 160 + i * 250, 1300 - q * 600, 40 + q * 34, t, BWP.gas, i + 2, 1); ctx.restore(); }
  drawStick(ctx, C(BUDI, { x: 560 + shk, y: zy, s: ZS, flip: -1, shadow: false, arms: { L: [.2, -.1], R: [.2, -.1] }, face: fb, headTilt: .05 }));
  drawTokohTears(ctx, 560 + shk, zy, ZS, .3 * inv(T5.ma, T5.pa, t) + .15 * inv(T5.pa, T5.pa + .4, t), t, 3);
  drawCounter(ctx, 900, 330, Math.max(1, Math.round(cntB(t))), inv(T5.sp, T5.sp + .2, t));
  ctx.restore();
});

// ===== 6 "Dua puluh iris, air matanya netes ke talenan." =====
const T6 = { du: wt(6, 'dua'), ai: wt(6, 'air'), ne: wt(6, 'netes'), ta: wt(6, 'talenan') };
SH(ls(6), ls(7), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(6), { x: 820, y: 1120, z: 1.55 }], [ls(6) + .6, { x: 800, y: 1130, z: 1.7 }, easeOut], [T6.ne, { x: 760, y: 1200, z: 1.85 }, ease], [ls(7), { x: 750, y: 1220, z: 1.95 }]], 2);
  const gy = chopY(t, TB0, .22, GRIP_UP, GRIP_DN), g = [CUT_B + 120, gy];
  kitchen(ctx, t, cam, {
    fB: EM(t, [[ls(6), { eyes: 'squint', mouth: 'teeth', browAng: .3 }], [T6.ne, 'meringis']], 15),
    armsB: { L: idleArms(t, 2).L, R: armTo(BUDX, -1, g[0], g[1], 1) },
    oniB: [CUT_B, BTOP, .5, {}], pileB: cntB(t), knifeB: { g, rot: 0, o: {} }, tearsB: .6, stone: true,
    extra: c => { for (let i = 0; i < 4; i++) { const q = ((t - T6.ne) * 1.6 + i / 4) % 1; if (t < T6.ne - .2) break; const x = BUDX - 50 + (i % 2) * 100, y = lerp(1075, BTOP - 4, easeIn(q)); drawTear(c, x, y, 12, 1); if (q > .9) { ellipse(c, x, BTOP - 3, 22, 6); c.fillStyle = 'rgba(143,216,255,.7)'; c.fill(); } } }
  });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); drawCounter(ctx, 900, 330, Math.max(10, Math.round(cntB(t))), inv(T6.du, T6.du + .2, t)); ctx.restore();
  sfxText(ctx, 'TES', 700, 1130, 52, inv(T6.ta, T6.ta + .1, t), '#bfe9ff', .1);
});

// ===== 7 "Ibu baru mulai. Pelan. Satu iris, satu iris." =====
const T7 = { mu: wt(7, 'mulai'), pe: wt(7, 'pelan'), i1: wt(7, 'iris', 0, 0), i2: wt(7, 'iris', 0, 1) };
const IHIT = [T7.i1 - .05, T7.i2 - .05];                     // irisan Ibu jatuh tepat di kata "iris"
const ibuGrip = (t, hits) => { let y = GRIP_UP + 20; for (const h of hits) { const d = t - h; if (d > -.35 && d < .45) y = d < 0 ? lerp(GRIP_UP + 20, GRIP_DN, easeIn(inv(-.35, 0, d))) : lerp(GRIP_DN, GRIP_UP + 20, easeOut(inv(0, .45, d))); } return [CUT_I - 120, y]; };
SH(ls(7), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(7), { x: 330, y: 1120, z: 1.6 }], [ls(7) + .7, { x: 320, y: 1130, z: 1.8 }, easeOut], [T7.i1, { x: 330, y: 1170, z: 1.95 }, ease], [ls(8), { x: 340, y: 1180, z: 2.05 }]], 2);
  const g = t < T7.mu ? SHARP(t) : ibuGrip(t, IHIT), sharpening = t < T7.mu - .2;
  kitchen(ctx, t, cam, {
    fI: EM(t, [[ls(7), 'lega'], [T7.pe, 'netral', { look: [.6, .8] }], [T7.i2 + .2, 'lega']], 16),
    armsI: { L: armTo(IBUX, 1, CUT_I - 30, BTOP - 70, -1), R: armTo(IBUX, 1, g[0], g[1], -1) }, stone: sharpening,
    oniI: [CUT_I, BTOP, .5, {}], pileI: cntI(t), knifeI: { g, rot: 0, o: { shine: 1 } },
  });
  for (const h of IHIT) { glint(ctx, CUT_I - 20, BTOP - 60, 90, t, h); sfxText(ctx, 'SRET', CUT_I + 40, 1080, 46, inv(h, h + .08, t) * (1 - inv(h + .4, h + .5, t)), '#fff', -.1); }
  popText(ctx, 'PELAN', 330, 860, 80, inv(T7.pe, T7.pe + .2, t) * (1 - inv(T7.i1, T7.i1 + .2, t)), '#fff', INK, -.06);
});

// ===== 8 Gagal palsu: tumpukan Budi jauh lebih tinggi, tapi dia mengiris sambil merem =====
const T8 = { se: wt(8, 'setengah'), ta: wt(8, 'tapi'), me: wt(8, 'merem') };
SH(ls(8), ls(9), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(8), { x: 560, y: 1020, z: 1.05 }], [ls(8) + .7, { x: 560, y: 1030, z: 1.12 }, easeOut], [T8.ta, { x: 600, y: 1060, z: 1.2 }], [T8.me, { x: 760, y: 1100, z: 1.55 }, ease], [ls(9), { x: 780, y: 1100, z: 1.65 }]], 2);
  const gB = [CUT_B + 120, chopY(t, TB0, .26, GRIP_UP, GRIP_DN)], gI = ibuGrip(t, [ls(8) + .3, ls(8) + 1.3, ls(8) + 2.3, ls(8) + 3.3]);
  kitchen(ctx, t, cam, {
    fB: EM(t, [[ls(8), 'bangga', { look: [-.8, .2] }], [T8.ta + .1, { eyes: 'flinch', mouth: 'teeth', browAng: .3 }]], 17),
    armsB: { L: idleArms(t, 2).L, R: armTo(BUDX, -1, gB[0], gB[1], 1) }, oniB: [CUT_B, BTOP, .5, {}], pileB: cntB(t), knifeB: { g: gB, rot: 0, o: {} },
    tearsB: t > T8.ta ? 1 : .6,
    fI: EF(t, [[ls(8), 'lega', { look: [.6, .8] }]], 18), armsI: { L: armTo(IBUX, 1, CUT_I - 30, BTOP - 70, -1), R: armTo(IBUX, 1, gI[0], gI[1], -1) },
    oniI: [CUT_I, BTOP, .5, {}], pileI: cntI(t), knifeI: { g: gI, rot: 0, o: { shine: .6 } },
  });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawRaceBars(ctx, 470, 300, cntI(t) / 50, cntB(t) / 50, inv(ls(8), ls(8) + .3, t));
  popText(ctx, 'MEREM!', 760, 560, 84, inv(T8.me, T8.me + .2, t), '#ffd23a', INK, .08);
  ctx.restore();
});

// ===== 9 meler, meleset ke tomat (SPLAT), berhenti ngelap mata =====
const T9 = { hi: wt(9, 'hidungnya'), ml: wt(9, 'meler'), pi: wt(9, 'pisaunya'), mt: wt(9, 'meleset'), be: wt(9, 'berhenti'), ng: wt(9, 'ngelap') };
const TOMX = BB - 170;
SH(ls(9), ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(9), { x: 870, y: 1060, z: 1.9 }], [T9.pi, { x: 860, y: 1080, z: 1.85 }], [T9.mt, { x: 720, y: 1170, z: 1.8 }, ease], [T9.be, { x: 820, y: 1100, z: 1.65 }, ease], [ls(10), { x: 840, y: 1080, z: 1.75 }]], 2);
  const slip = inv(T9.mt - .25, T9.mt + .05, t), wipe = inv(T9.be, T9.be + .3, t) * (1 - inv(ls(10) - .25, ls(10), t));
  let g = [CUT_B + 120, chopY(t, ls(9), .3, GRIP_UP, GRIP_DN)];
  if (slip > 0) g = [lerp(g[0], TOMX + 120, easeIn(slip)), lerp(g[1], BTOP - 60, easeIn(slip))];
  if (t > T9.be) g = [TOMX + 140, BTOP - 70];
  const wiping = wipe > .5, eyeHand = [BUDX + 30 + Math.sin(t * 16) * 18, 1040];
  kitchen(ctx, t, cam, {
    fB: EM(t, [[ls(9), { eyes: 'flinch', mouth: 'wobble', browAng: .3 }], [T9.mt + .05, 'kaget'], [T9.be + .2, { eyes: 'flinch', mouth: 'frown', browAng: .35 }]], 19),
    armsB: { L: wiping ? reach(BUDX, BK, 600, -1, eyeHand[0], eyeHand[1], 1) : idleArms(t, 2).L, R: armTo(BUDX, -1, g[0], g[1], 1) },
    oniB: [CUT_B, BTOP, .5, {}], pileB: cntB(t), knifeB: { g, rot: slip > 0 ? .15 : 0, o: {} }, tearsB: wiping ? .55 : 1, oniI: [CUT_I, BTOP, .5, {}], pileI: cntI(t),
    under: c => drawTomat(c, TOMX, BTOP, .7, { splat: inv(T9.mt, T9.mt + .12, t) }),
    extra: c => { const m = inv(T9.ml - .1, T9.ml + .3, t); if (m > 0) { const yy = 1068 + 26 * m + Math.sin(t * 5) * 4; c.beginPath(); c.moveTo(BUDX - 6, 1062); c.quadraticCurveTo(BUDX - 12, yy - 8, BUDX - 6, yy); c.lineWidth = 7; c.strokeStyle = BWP.tear; c.lineCap = 'round'; c.stroke(); drawTear(c, BUDX - 6, yy + 8, 10, 1); } }
  });
  sfxText(ctx, 'SPLAT!', TOMX + 10, 1060, 74, inv(T9.mt, T9.mt + .1, t), '#e5392f', -.12);
  const kx = inv(T9.mt + .15, T9.mt + .37, t); if (kx > 0) { ctx.save(); ctx.translate(TOMX - 40, 1140); const s2 = backOut(kx); ctx.scale(s2, s2); drawX(ctx, 0, 0, 46); ctx.restore(); }
  if (wiping) sfxText(ctx, 'SROT', BUDX + 140, 960, 48, inv(T9.be + .15, T9.be + .25, t), '#fff', .15);
});

// ===== 10 "Ibu? Matanya kering. Dan tumpukannya makin tinggi." -> Ibu menyalip -> MATCH masuk ke bawang =====
const T10 = { ma: wt(10, 'matanya'), ke: wt(10, 'kering'), tu: wt(10, 'tumpukannya'), ti: wt(10, 'tinggi') };
const ONI10 = [CUT_I, BTOP - 36];                            // pusat badan bawang Ibu (s .5)
const cam10 = t => CK(t, [[ls(10), { x: 300, y: 1060, z: 1.75 }], [T10.ke + .2, { x: 290, y: 1050, z: 1.9 }, easeOut], [T10.tu, { x: 430, y: 1050, z: 1.2 }, ease], [T10.ti + .3, { x: 420, y: 1080, z: 1.25 }], [ls(11) - .05, { x: ONI10[0], y: ONI10[1], z: 3.2 }, easeIn]], 2);
SH(ls(10), ls(11), { tr: 'match', zoomOut: (() => { const c = cam10(ls(11)), p = toScreen(c, ONI10[0], ONI10[1]); return { x: p[0], y: p[1], r: 70 * c.z }; })() }, (ctx, lt, t) => {
  const cam = cam10(t), gI = ibuGrip(t, [ls(10) + .2, ls(10) + .9, T10.tu - .1, T10.tu + .45, T10.ti - .2, T10.ti + .35]);
  const gB = [CUT_B + 120, chopY(t, ls(10), .5, GRIP_UP, GRIP_DN)];
  kitchen(ctx, t, cam, {
    fI: EM(t, [[ls(10), 'lega'], [T10.ke + .1, 'bangga'], [T10.ti, 'sombong', { look: [.8, 0] }]], 20),
    armsI: { L: armTo(IBUX, 1, CUT_I - 30, BTOP - 70, -1), R: armTo(IBUX, 1, gI[0], gI[1], -1) }, oniI: [CUT_I, BTOP, .5, { face: EF(t, [[ls(10), 'netral'], [T10.ti, 'kaget']], 21), t }], pileI: cntI(t), knifeI: { g: gI, rot: 0, o: { shine: 1 } },
    fB: EF(t, [[ls(10), { eyes: 'flinch', mouth: 'wobble', browAng: .3 }], [T10.ti + .1, 'sadar', { look: [-.8, .2] }]], 22), armsB: { L: idleArms(t, 2).L, R: armTo(BUDX, -1, gB[0], gB[1], 1) },
    oniB: [CUT_B, BTOP, .5, {}], pileB: cntB(t), knifeB: { g: gB, rot: 0, o: {} }, tearsB: .7,
  });
  const ck = inv(T10.ke, T10.ke + .2, t); if (ck > 0 && t < T10.tu) { ctx.save(); ctx.translate(250, 920); const s2 = backOut(ck); ctx.scale(s2, s2); drawCheck(ctx, 0, 0, 44); ctx.restore(); }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); drawRaceBars(ctx, 470, 300, cntI(t) / 50, cntB(t) / 50, inv(T10.tu - .1, T10.tu + .2, t) * (1 - inv(ls(11) - .35, ls(11) - .1, t))); ctx.restore();
});

// ===== DUNIA SEL: 11 dua bahan dipisah (+ stik glow utuh), 12 sel pecah -> bercampur -> gas -> mata =====
const SELC = [540, 720];
const ENZ = [[300, 560], [380, 780], [250, 900]], SUL = [[780, 560], [700, 760], [830, 900]];
const T11 = { ba: wt(11, 'bawang'), du: wt(11, 'dua'), di: wt(11, 'dipisah'), st: wt(11, 'stik'), se: wt(11, 'sebelum'), dp: wt(11, 'dipatahkan') };
const T12 = { pe: wt(12, 'pecah'), be: wt(12, 'bercampur'), ga: wt(12, 'gas'), bi: wt(12, 'bikin'), ma: wt(12, 'mata'), pr: wt(12, 'perih') };
const blobPos = (t, p, i, side) => { const m = easeInOutM(inv(T12.be - .2, T12.ga, t)); return [lerp(p[0], SELC[0] + side * (40 + i * 18), m) + Math.sin(t * 3 + i) * 10, lerp(p[1], SELC[1] + (i - 1) * 60, m) + Math.cos(t * 2.5 + i) * 8]; };
const easeInOutM = x => x * x * (3 - 2 * x);
const blobsDraw = (ctx, t, mix) => {
  const fz = EF(t, [[ls(11), 'netral', { look: [.8, 0] }], [T11.di, 'curiga', { look: [.9, 0] }], [T12.be, 'licik', { look: [.9, 0] }]], 23);
  const fs = EF(t, [[ls(11), 'netral', { look: [-.8, 0] }], [T11.di + .1, 'curiga', { look: [-.9, 0] }], [T12.be + .05, 'licik', { look: [-.9, 0] }]], 24);
  const k = inv(T11.du - .1, T11.du + .25, t), a = 1 - inv(T12.ga - .1, T12.ga + .2, t);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ENZ.forEach((p, i) => { const q = blobPos(t, p, i, -1); drawBahan(ctx, q[0], q[1], 70 * backOut(clamp(k * 1.3 - i * .15)), BWP.enzim, { face: fz, t, wob: mix }); });
  SUL.forEach((p, i) => { const q = blobPos(t, p, i, 1); drawBahan(ctx, q[0], q[1], 70 * backOut(clamp(k * 1.3 - i * .15)), BWP.sulfur, { face: fs, t, wob: mix }); });
  ctx.restore();
};
SH(ls(11), ls(12), { tr: 'none', zoomIn: { x: 540, y: 760, r: 420 } }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(11), { x: 540, y: 820, z: 1.15 }], [ls(11) + .8, { x: 540, y: 800, z: 1.0 }, easeOut], [T11.st, { x: 540, y: 860, z: .98 }], [ls(12), { x: 540, y: 880, z: 1.02 }]], 2);
  cellBG(ctx, t, cam); drawSelBesar(ctx, SELC[0], SELC[1], 1, 0, t);
  ctx.globalAlpha = 1; glowRing(ctx, SELC[0], SELC[1], 300, Math.sin(clamp(inv(T11.di, T11.di + .6, t)) * Math.PI) * .9, '255,255,255');
  blobsDraw(ctx, t, 0);
  const gk = inv(T11.st - .15, T11.st + .2, t);
  if (gk > 0) { ctx.save(); ctx.translate(540, 1170); const s2 = backOut(gk); ctx.scale(s2, s2); drawGlowStick(ctx, 0, 0, .85, -.05 + Math.sin(t * 2) * .03, { t, snap: .06 * inv(T11.dp, T11.dp + .4, t) }); ctx.restore(); }
  popText(ctx, 'DIPISAH', 540, 300, 76, inv(T11.di, T11.di + .2, t) * (1 - inv(T11.st - .1, T11.st + .1, t)), '#fff', INK, -.05);
});
SH(ls(12), ls(13), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(12), { x: 540, y: 880, z: 1.02 }], [T12.be, { x: 540, y: 820, z: 1.0 }], [T12.ga + .2, { x: 540, y: 520, z: .95 }, ease], [T12.ma, { x: 540, y: 120, z: 1.0 }, ease], [ls(13), { x: 540, y: 80, z: 1.12 }]], 2);
  const dp = t - T12.pe; let cm = cam; if (dp > 0 && dp < .4) { const s = shake(t * 3, 18 * (1 - dp / .4), 3); cm = Object.assign({}, cam, { x: cam.x + s[0], y: cam.y + s[1] }); }
  cellBG(ctx, t, cm);
  // mata raksasa (kepala Budi) di atas dunia sel
  const er = .4 + .6 * inv(T12.ma, T12.pr + .2, t);
  ctx.save(); circle(ctx, 540, -330, 640); ctx.fillStyle = HEAD; ctx.fill(); ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  drawEye(ctx, 540, -230, .8, t, { red: er, drift: .3 });
  if (t > T12.pr - .1) { for (let i = 0; i < 6; i++) { const q = ((t - T12.pr) * 1.4 + i / 6) % 1; drawTear(ctx, 540 + (i % 2 ? 230 : -230), -200 + q * 340, 26, 1 - q * .5); } }
  drawSelBesar(ctx, SELC[0], SELC[1], 1 - inv(T12.pe, T12.pe + .45, t), inv(T12.pe - .3, T12.pe, t), t);
  blobsDraw(ctx, t, inv(T12.be, T12.ga, t));
  // gas naik ke mata
  for (let i = 0; i < 3; i++) { const q = inv(T12.ga - .05 + i * .12, T12.pr + .1 + i * .1, t); if (q <= 0) continue; const x = lerp(SELC[0] + (i - 1) * 90, 540 + (i - 1) * 140, easeIn(q)), y = lerp(SELC[1], -120, easeInOutM(q)); drawGasMata(ctx, x, y, 90 + 40 * (1 - q), t, { seed: i + 3, face: EF(t, [[T12.ga, 'licik']], 25 + i), alpha: 1 - inv(.92, 1, q) }); }
  const gl = inv(T12.pe, T12.pe + .15, t);
  ctx.save(); ctx.translate(540, 1170); drawGlowStick(ctx, 0, 0, .85, -.05, { t, snap: gl, glow: gl }); ctx.restore();
  sfxText(ctx, 'KRAK!', 540, 1040, 96, inv(T12.pe, T12.pe + .1, t) * (1 - inv(T12.ga, T12.ga + .1, t)), '#ffd23a', -.1);
  flash(ctx, t, T12.pe, .1, '255,255,255');
  popText(ctx, 'PERIH!', 540, 760, 96, inv(T12.pr, T12.pr + .2, t), '#e5262a', INK, .06);
});

// ===== 13 slow-mo: pisau tumpul MEREMAS bawang, butiran menyembur =====
const T13 = { pi: wt(13, 'pisau'), ng: wt(13, 'nggak'), me: wt(13, 'meremas'), ms: wt(13, 'menyemprotkan'), ud: wt(13, 'udara') };
SH(ls(13), ls(14), { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(13), { x: CUT_B, y: 1220, z: 2.3 }], [T13.me, { x: CUT_B, y: 1235, z: 2.5 }, ease], [T13.ms + .3, { x: CUT_B, y: 1180, z: 1.9 }, ease], [ls(14), { x: CUT_B + 20, y: 1165, z: 1.75 }]], 1.5);
  const pr = .75 * easeInOutM(inv(T13.me - .4, T13.me + .3, t)), top = BTOP - 150 * .5 * (1 - .42 * pr) - 4;
  const g = [CUT_B + 120, lerp(GRIP_UP, top - 16, easeInOutM(inv(ls(13), T13.me - .4, t)))];
  if (t > T13.me - .4) g[1] = top - 16;
  kitchen(ctx, t, cam, {
    fB: EF(t, [[ls(13), 'ngeden', { look: [-.6, .8] }]], 28), armsB: { L: idleArms(t, 2).L, R: armTo(BUDX, -1, g[0], g[1], 1) },
    oniB: [CUT_B, BTOP, .5, { press: pr, face: EF(t, [[ls(13), 'cemas'], [T13.me, 'meringis']], 29), t }], pileB: cntB(t), oniI: [CUT_I, BTOP, .5, {}], pileI: cntI(t),
    knifeB: { g, rot: 0, o: { face: EF(t, [[ls(13), 'ngeden'], [T13.ms, 'licik']], 30) } },
    extra: c => { const ts = T13.ms - .1 + (t - T13.ms + .1) * .35; drawSpray(c, CUT_B - 30, BTOP - 40, { n: 26, h: 320, t: ts, t0: T13.ms - .1, dur: 3, seed: 7, size: 15, spread: 1.6 }); }
  });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t > T13.ng) { const k = backOut(inv(T13.ng, T13.ng + .2, t)); text(ctx, 'SLOW-MO', 300, 240, 72 * k, '#fff', INK, 14); circle(ctx, 90, 240, 22 * k); ctx.fillStyle = Math.sin(t * 8) > 0 ? '#e5262a' : 'rgba(229,38,42,.3)'; ctx.fill(); }
  ctx.restore();
  sfxText(ctx, 'KRES', CUT_B - 130, 1150, 52, inv(T13.me, T13.me + .1, t) * (1 - inv(T13.me + .6, T13.me + .7, t)), '#fff', -.12);
  sfxText(ctx, 'PSST', CUT_B + 120, 980, 50, inv(T13.ms + .1, T13.ms + .2, t), '#efe3f7', .1);
});

// ===== 14 "Makin ngebut, makin banyak semprotannya." semprotan menembus garis TINGGI MATA =====
const T14 = { ng: wt(14, 'ngebut'), ba: wt(14, 'banyak'), se: wt(14, 'semprotannya') }, P14 = .16;
SH(ls(14), ls(15), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(14), { x: 790, y: 1100, z: 1.5 }], [ls(14) + .5, { x: 780, y: 1080, z: 1.4 }, easeOut], [ls(15), { x: 770, y: 1070, z: 1.32 }]], 2);
  const t0 = ls(14), g = [CUT_B + 120, chopY(t, t0, P14, GRIP_UP, GRIP_DN)];
  let hit = 0;
  kitchen(ctx, t, cam, {
    fB: EM(t, [[ls(14), 'ngeden', { look: [-.6, .8] }], [T14.ba, { eyes: 'flinch', mouth: 'wobble', browAng: .3 }]], 31), armsB: { L: idleArms(t, 2).L, R: armTo(BUDX, -1, g[0], g[1], 1) },
    oniB: [CUT_B, BTOP, .5, {}], pileB: cntB(t), knifeB: { g, rot: 0, o: {} }, tearsB: t > T14.ba ? 1 : .5, oniI: [CUT_I, BTOP, .5, {}], pileI: cntI(t),
    extra: c => {
      const n = Math.floor((t - t0) / P14);
      for (let k = Math.max(0, n - 6); k <= n; k++) { const h = 260 + 240 * inv(t0, T14.ba, t0 + k * P14); drawSpray(c, CUT_B - 30, BTOP - 40, { n: 14, h, t, t0: t0 + (k + .3) * P14, dur: .9, seed: 20 + k, size: 13 }); }
      hit = inv(T14.ba - .2, T14.ba + .1, t);
      drawEyeLine(c, 420, 1130, BW.eyeLine, hit, inv(ls(14), ls(14) + .25, t));
    }
  });
  if (hit > .5) { ctx.save(); ctx.translate(560, 820); const s2 = backOut(inv(T14.ba + .1, T14.ba + .3, t)); ctx.scale(s2, s2); drawX(ctx, 0, 0, 56); ctx.restore(); }
});

// ===== 15 pisau tajam yang pelan: membelah bersih, semprotan rendah, garis TINGGI MATA aman =====
const T15 = { pi: wt(15, 'pisau'), ta: wt(15, 'tajam'), pe: wt(15, 'pelan'), mb: wt(15, 'membelah'), se: wt(15, 'semprotannya'), ma: wt(15, 'mata') };
const IH15 = [T15.pe, T15.mb, T15.mb + 1.1, T15.se, T15.ma - .1];
SH(ls(15), ls(16), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(15), { x: 300, y: 1120, z: 1.7 }], [T15.ta + .2, { x: 290, y: 1150, z: 1.95 }, ease], [T15.mb + .3, { x: 330, y: 1090, z: 1.4 }, ease], [ls(16), { x: 320, y: 1080, z: 1.34 }]], 2);
  const g = ibuGrip(t, IH15);
  kitchen(ctx, t, cam, {
    fI: EM(t, [[ls(15), 'bangga', { look: [.6, .8] }], [T15.mb + .2, 'lega'], [T15.ma, 'bangga']], 32), armsI: { L: armTo(IBUX, 1, CUT_I - 30, BTOP - 70, -1), R: armTo(IBUX, 1, g[0], g[1], -1) },
    oniI: [CUT_I, BTOP, .5, {}], pileI: cntI(t), knifeI: { g, rot: 0, o: { shine: 1 } },
    extra: c => {
      IH15.forEach((h, k) => drawSpray(c, CUT_I + 20, BTOP - 40, { n: 6, h: 70, t, t0: h, dur: .7, seed: 40 + k, size: 11, spread: .9 }));
      drawEyeLine(c, -80, 700, BW.eyeLine, 0, inv(T15.mb - .1, T15.mb + .2, t), 380);
      const ck = inv(T15.ma, T15.ma + .2, t); if (ck > 0) { c.save(); c.translate(560, BW.eyeLine - 150); const s2 = backOut(ck); c.scale(s2, s2); drawCheck(c, 0, 0, 52); c.restore(); }
    }
  });
  glint(ctx, 540, 860, 160, t, T15.ta);
  for (const h of IH15) sfxText(ctx, 'SRET', 560, 1160, 44, inv(h, h + .08, t) * (1 - inv(h + .4, h + .5, t)), '#fff', -.1);
});

// ===== 16 Budi cuci piring, lalu kamera kembali ke Ibu mengasah (komposisi frame 0 = loop) =====
const T16 = { mi: wt(16, 'minggu'), bu: wt(16, 'budi'), cu: wt(16, 'cuci'), da: wt(16, 'dan'), se: wt(16, 'sekarang') };
const SINK = 1560;
SH(ls(16), ENDT, { tr: 'none' }, (ctx, lt, t) => {
  const c0 = cam0(0), back = inv(T16.da - .1, ENDT, t);
  const cam = back <= 0 ? CK(t, [[ls(16), { x: SINK - 20, y: 1110, z: 1.45 }], [T16.cu, { x: SINK - 30, y: 1120, z: 1.6 }, ease], [T16.da, { x: SINK - 40, y: 1120, z: 1.62 }]], 2)
    : (() => { const a = { x: SINK - 40, y: 1120, z: 1.62 }, e = easeInOutM(back); return { x: lerp(a.x, c0.x, e), y: lerp(a.y, c0.y, e), z: lerp(a.z, c0.z, e) - .35 * Math.sin(e * Math.PI), r: 0 }; })();
  // Ibu mengasah selalu ada (dunia kiri), Budi di bak cuci (dunia kanan)
  const fI = EM(t, [[ls(16), 'ngeden', { look: [.6, .7] }]], 1), bored = EF(t, [[ls(16), 'datar']], 2);
  dapurBack(ctx, t, cam);
  const a = armsSharp(t); ibu(ctx, t, fI, a.arms);
  const scrub = Math.sin(t * 14) * 30;
  budi(ctx, t, EM(t, [[ls(16), { eyes: 'half', mouth: 'frown', browAng: .3 }], [T16.cu + .2, { eyes: 'flinch', mouth: 'wobble', browAng: .3 }]], 33), { L: reach(SINK + 80, BK, 600, -1, SINK - 40 + scrub, 1220, 1), R: reach(SINK + 80, BK, 600, -1, SINK - 80 - scrub * .5, 1240, 1) }, SINK + 80);
  dapurMeja(ctx);
  drawTalenan(ctx, BI, TOP); drawBatuAsah(ctx, STONE[0], STONE[1]); drawBawang(ctx, ONI0[0], ONI0[1], .55, { face: bored, t });
  drawPisau(ctx, SHARP(t)[0], SHARP(t)[1], .6, .03, { t, shine: .6 });
  drawTalenan(ctx, BB, TOP);   // talenan Budi sudah bersih (frame akhir harus sama dengan frame 0)
  drawBakCuci(ctx, SINK, TOP, 1, { t, water: 1 });
  drawPiringTumpuk(ctx, SINK - 210, BTOP + 16, .8, 11, { face: EF(t, [[ls(16), 'sombong'], [T16.cu, 'licik']], 34), t });
  drawPiringTumpuk(ctx, SINK + 230, BTOP + 16, .8, 6, {});
  if (back <= 0) { for (let i = 0; i < 5; i++) { const q = (t * .8 + i / 5) % 1; puff(ctx, SINK - 60 + i * 30, 1180 - q * 140, 18 + q * 16, t, '#ffffff', i + 2, (1 - q) * .8); } }
  if (back < .1) sfxText(ctx, 'SIKAT', SINK + 10, 980, 50, inv(T16.cu, T16.cu + .1, t), '#fff', .12);
  const ph = Math.cos(t * SHF); if (back > .85) for (const [sx, k] of [[STONE[0] - 60, ph > .7], [STONE[0] + 70, ph < -.7]]) if (k) sfxText(ctx, 'SREK', sx, STONE[1] - 160, 46, 1, '#fff', sx < STONE[0] ? -.15 : .15);
});
