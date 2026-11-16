// ---------- Fakta Unik: Palagan Ambarawa (seri perang dalam sejarah Indonesia #1, ~60,6 dtk) ----------
// Aturan v5 (kamera bergerak, transisi), v6 (semua waktu dari kata wt(), aset satu fungsi), v7 (mikroekspresi hemat, latar satu skala,
// loop: 0,6 dtk terakhir = komposisi frame 0). Aset: env_ambarawa.js (peta, Soedirman, TKR, token, udang, bendera), env_peta.js, env_perang.js.
const SHOTS = [];
const C = (b, e) => Object.assign({}, b, e);
const LN = {}; WORDS.forEach(w => { (LN[w.line] = LN[w.line] || []).push(w); });
const ls = i => LN[i][0].s;
const nrm = s => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const fw = (i, str, n = 0) => { const w = LN[i].filter(w => nrm(w.w) === str)[n]; if (!w) throw new Error('kata tidak ada di baris ' + i + ': ' + str); return w.s; };
const wt = (i, str, d = 0, n = 0) => fw(i, str, n) + d;
const ENDT = WORDS[WORDS.length - 1].e + .6, LOOP0 = ENDT - .6;
const SH = (s, e, o, draw) => SHOTS.push(Object.assign({ start: s, end: e, draw }, o));
const CK = (t, keys, sh = 2) => camKeys(t, t, keys, sh);
const EF = (t, keys, seed) => exprTrack(t, keys, { seed, saccade: false, idleBlink: false });
const EM = (t, keys, seed) => exprTrack(t, keys, { seed, saccade: false });
const EC = (t, keys, seed) => exprTrack(t, keys, { seed });
const pop = (t, t0, d = .2) => backOut(inv(t0, t0 + d, t));
function grayOverlay(ctx, k) { if (k <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'saturation'; ctx.globalAlpha = clamp(k); ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function speedLines(ctx, x, y, dir, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; for (let i = 0; i < 4; i++) line(ctx, x - dir * (90 + i * 10), y - 60 + i * 36, x - dir * (170 + i * 10), y - 64 + i * 36, 7, 'rgba(255,255,255,.85)'); ctx.restore(); }

// ===== Set peta terkunci (koordinat dunia dari projJ) =====
const A0 = TJ.ambarawa, SMG = TJ.semarang, MGL = TJ.magelang;
const SKT = [[-75, -15], [0, -55], [75, -15], [-38, 45], [38, 45]];   // token Sekutu di Ambarawa (offset x1,1)
const CAP_L = [[150, 1330], [160, 1060], [260, 850], [400, 865]];
const CAP_R = [[960, 1330], [940, 1060], [830, 850], [690, 875]];
const CAP_C = [[540, 1340], [540, 1210], [540, 1060]];
const EXT_L = [[400, 865], [470, 790], [520, 755]], EXT_R = [[690, 875], [620, 790], [570, 755]];   // jepitan menutup jalan ke Semarang
const ROAD_N = [JALAN[4], JALAN[3], JALAN[2], JALAN[1], JALAN[0]];   // Ambarawa -> Semarang
const ROAD_M = [JALAN[6], JALAN[5], JALAN[4]];                        // Magelang -> Ambarawa
const SOE = [210, 1770], SOE_S = 760;                                 // Soedirman di depan (ruang layar), komposisi frame 0
const CAM_F0 = { x: 540, y: 990, z: 1.3 };
const FACE_SOE0 = { eyes: 'normal', mouth: 'smirk', browAng: -.22, look: [.7, -.4] };

function sekutu(ctx, t, face, o = {}) {   // face(i) -> ekspresi; o: { cx, cy, sp, jump, n, run, alpha }
  const cx = o.cx == null ? A0[0] : o.cx, cy = o.cy == null ? A0[1] : o.cy, sp = o.sp || 1.1;
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  SKT.slice(0, o.n || 5).forEach(([dx, dy], i) => { const j = o.run ? -Math.abs(Math.sin(t * 14 + i)) * 12 : (o.jump || 0); mapSoldier(ctx, cx + dx * sp, cy + dy * sp + j, o.s || 170, 'uk', face(i), { t }); });
  if (o.run) speedLines(ctx, cx, cy, o.run, 1);
  ctx.restore();
}
function tkrAt(ctx, t, x, y, n, face, o = {}) {   // kelompok TKR (token berpeci)
  const sp = o.sp || 1, s = o.s || 130;
  for (let i = 0; i < n; i++) { const dx = (i - (n - 1) / 2) * 95 * sp, dy = (i % 2) * 40 * sp, j = o.hop ? -Math.abs(Math.sin(t * 9 + i * 1.3)) * 22 : 0; token(ctx, x + dx, y + dy + j, s, 'tkr', face, { t, rifle: o.rifle }); }
}
function arrows3(ctx, t, kL, kR, kC) {
  drawArrow(ctx, CAP_L, kL, { col: MPC.red, w: 56, t });
  drawArrow(ctx, CAP_R, kR, { col: MPC.red, w: 56, t });
  drawArrow(ctx, CAP_C, kC, { col: MPC.red, w: 48, t });
}
function soedirmanFront(ctx, t, x, face, o = {}) {   // ruang layar, tidak ikut zoom peta
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawStick(ctx, C(SOEDIRMAN, { x, y: SOE[1], s: SOE_S, armLen: 1.3, legs: { L: [.12, -.05], R: [.14, -.06] },
    arms: { L: POSE.hips.arms.L, R: reach(x, SOE[1], SOE_S, 1, x + 260, 900, 1) }, face }));
  ctx.restore();
}

// ===== 0 HOOK: supit urang setengah jalan, Sekutu sombong -> kaget saat "ngusir", Soedirman menunjuk, "29 TAHUN" =====
const H0 = { n29: wt(0, '29'), ng: wt(0, 'ngusir'), mn: wt(0, 'menang'), kd: wt(0, 'kedua') };
SH(0, ls(1), { tr: 'dissolve', xt: .22 }, (ctx, lt, t) => {
  const cam = CK(t, [[0, CAM_F0], [.7, { x: 540, y: 975, z: 1.38 }, easeOut], [H0.ng, { x: 540, y: 950, z: 1.48 }], [H0.ng + .5, { x: 545, y: 915, z: 1.62 }, easeOut], [H0.mn, { x: 545, y: 880, z: 1.5 }, ease], [ls(1), { x: 545, y: 860, z: 1.42 }, easeIn]]);
  petaAmbarawa(ctx, t, cam);
  const k = lerp(.45, 1, easeOut(inv(0, .7, t)));
  arrows3(ctx, t, k, k, lerp(.25, 1, easeOut(inv(.15, .8, t))));
  const j = t > H0.ng ? Math.max(0, 1 - (t - H0.ng) * 4) * -18 : 0;
  sekutu(ctx, t, i => EF(t, [[0, 'sombong', { look: [-.6, 0] }], [H0.ng + i * .03, 'kaget', { look: [-.8, .3], sweat: 1 }]], 20 + i), { jump: j });
  popText(ctx, 'PEMENANG PD II', A0[0], A0[1] - 290, 52, inv(H0.mn - .05, H0.mn + .2, t), '#ffd23a', INK, -.05);
  if (t > H0.mn) for (let i = 0; i < 3; i++) star5(ctx, A0[0] - 200 + i * 200, A0[1] - 370 + Math.sin(t * 6 + i) * 8, 20, t * 2 + i, '#ffe14d');
  soedirmanFront(ctx, t, SOE[0], exprTrack(t, [[0, FACE_SOE0]], { seed: 7, saccade: false }));
  tagKuning(ctx, '29 TAHUN', 330, 960, 66, -.1, backOut(clamp(t / .25)));
  flash(ctx, t, H0.ng, .1);
});

// ===== 1 "Oktober 1945, Sekutu mendarat di Semarang. Katanya cuma mau ngurus tawanan Jepang." kapal mendarat, lingkaran malaikat =====
const T1 = { ok: wt(1, 'oktober'), md: wt(1, 'mendarat'), sm: wt(1, 'semarang'), kt: wt(1, 'katanya'), cm: wt(1, 'cuma'), tw: wt(1, 'tawanan'), jp: wt(1, 'jepang') };
const LAND1 = [[-110, 50], [0, 25], [110, 50]];
const boatX = [SMG[0] - 150, SMG[0] - 20, SMG[0] + 110];
function landed(ctx, t, face, halo, o = {}) {
  LAND1.forEach(([dx, dy], i) => { const x = SMG[0] + dx, y = SMG[1] + dy + (o.jy || 0);
    mapSoldier(ctx, x, y, 170, 'uk', face(i), { t });
    if (halo > 0) { ctx.save(); ctx.globalAlpha *= halo; ellipse(ctx, x, y - 95 - Math.sin(t * 4 + i) * 4 - (o.haloFall || 0), 48, 12); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#ffd23a'; ctx.stroke(); ctx.restore(); } });
}
SH(ls(1), ls(2), {}, (ctx, lt, t) => {
  const cam = CK(t, [[ls(1), { x: 560, y: 600, z: .85 }], [ls(1) + .7, { x: 560, y: 580, z: .95 }, easeOut], [T1.md, { x: 560, y: 540, z: 1.1 }, ease], [T1.kt, { x: 560, y: 550, z: 1.45 }, ease], [ls(2), { x: 565, y: 545, z: 1.55 }]], 1.5);
  petaAmbarawa(ctx, t, cam);
  const bk = easeOut(inv(T1.ok, T1.md + .1, t));
  if (t < T1.md + .4) boatX.forEach((x, i) => { const y = lerp(80, SMG[1] - 60, bk) + i * 12; ctx.save(); ctx.globalAlpha *= 1 - inv(T1.md + .1, T1.md + .4, t); drawBoat(ctx, x, y, .7, { t }); mapSoldier(ctx, x, y - 50, 120, 'uk', EF(t, [[0, 'sombong', { look: [.2, .8] }]], 40 + i), { t }); ctx.restore(); });
  const lk = inv(T1.md + .05, T1.md + .3, t);
  if (lk > 0) { ctx.save(); ctx.globalAlpha *= lk; landed(ctx, t, i => EF(t, [[0, 'sombong', { look: [0, .6] }], [T1.cm + i * .05, 'lega']], 50 + i), inv(T1.cm, T1.cm + .25, t), { jy: (1 - easeOut(lk)) * -40 }); ctx.restore(); }
  popText(ctx, 'OKTOBER 1945', SMG[0], SMG[1] - 330, 76, inv(T1.ok - .05, T1.ok + .2, t) * (1 - inv(T1.kt - .2, T1.kt, t)), '#fff', INK, -.05);
  popText(ctx, 'URUS TAWANAN JEPANG', SMG[0], SMG[1] - 230, 46, inv(T1.tw - .05, T1.tw + .2, t), '#fff', INK, .04);
  if (t > T1.cm && t < ls(2)) glint(ctx, SMG[0], SMG[1] - 120, 120, t, T1.cm + .1);
});

// ===== 2 "Tapi ternyata, Belanda ikut nebeng. Tawanan Belanda dibebasin, terus dikasih senjata." =====
const T2 = { tp: wt(2, 'tapi'), bl: wt(2, 'belanda'), nb: wt(2, 'nebeng'), tw: wt(2, 'tawanan'), db: wt(2, 'dibebasin'), dk: wt(2, 'dikasih'), sj: wt(2, 'senjata') };
const JAIL = [SMG[0] + 270, SMG[1] + 240], WATCH = [SMG[0] - 300, SMG[1] + 330];
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(2), { x: 565, y: 545, z: 1.55 }], [T2.bl, { x: 568, y: 520, z: 1.7 }, ease], [T2.nb + .3, { x: 575, y: 520, z: 1.6 }], [T2.tw + .2, { x: 620, y: 640, z: 1.05 }, ease], [T2.sj, { x: 640, y: 660, z: 1.12 }, ease], [ls(3), { x: 650, y: 670, z: 1.2 }, easeIn]], 1.5);
  petaAmbarawa(ctx, t, cam);
  const hf = inv(T2.tp, T2.tp + .35, t);
  landed(ctx, t, i => EF(t, [[ls(2), 'lega'], [T2.tp + i * .05, 'licik']], 60 + i), 1 - hf, { haloFall: hf * 60 });
  // Belanda muncul dari balik tentara Sekutu tengah, lalu "nebeng" duduk di atas helmnya
  const up = easeOut(inv(T2.bl - .1, T2.bl + .25, t)), ride = ease(inv(T2.nb - .1, T2.nb + .2, t));
  if (up > 0) { const x = SMG[0] + lerp(60, 0, ride), y = SMG[1] + 25 - lerp(90 * up, 125, ride) + (ride > .99 ? Math.sin(t * 9) * 5 : 0);
    token(ctx, x, y, 150, 'nl', EF(t, [[T2.bl, 'licik', { look: [-.5, 0] }], [T2.nb, 'bangga']], 70), { t });
    if (ride < .5) mapSoldier(ctx, SMG[0], SMG[1] + 25, 170, 'uk', EF(t, [[0, 'licik']], 61), { t });   // tutup bagian bawah Belanda saat mengintip
    popText(ctx, 'BELANDA (NICA)', x, y - 120, 42, inv(T2.bl, T2.bl + .2, t) * (1 - inv(T2.tw, T2.tw + .2, t)), '#f39a2e', INK, -.05); }
  // penjara: tawanan Belanda keluar, lalu diberi senapan
  const jk = pop(t, T2.tw - .3, .3); if (jk > 0) { ctx.save(); ctx.translate(JAIL[0], JAIL[1]); ctx.scale(jk, jk); drawJail(ctx, 0, 0, .8, ease(inv(T2.db, T2.db + .35, t))); ctx.restore(); }
  const ex = ease(inv(T2.db + .2, T2.dk, t));
  if (ex > 0) for (let i = 0; i < 3; i++) { const x = JAIL[0] - 40 + i * 40 + ex * (i - 1) * 120, y = JAIL[1] - 30 + ex * (100 + (i % 2) * 40);
    token(ctx, x, y, 130, 'nl', EF(t, [[0, 'lega'], [T2.sj + i * .05, 'bangga']], 80 + i), { t, rifle: t > T2.sj }); }
  sfxText(ctx, 'KLEK!', JAIL[0] + 210, JAIL[1] + 10, 60, inv(T2.sj, T2.sj + .1, t), '#ffd23a', .1);
  if (t > T2.sj) glint(ctx, JAIL[0] + 140, JAIL[1] + 70, 110, t, T2.sj + .05);
  // TKR menyaksikan dari pinggir
  const wk = pop(t, T2.tw, .25); if (wk > 0) { ctx.save(); ctx.translate(WATCH[0], WATCH[1]); ctx.scale(wk, wk); token(ctx, 0, 0, 170, 'tkr', EF(t, [[0, 'curiga', { look: [.9, -.2] }], [T2.sj + .1, 'kaget', { look: [.9, -.3], sweat: 1 }]], 90), { t }); ctx.restore(); }
});

// ===== 3 "Ya jelas, perang pecah di Magelang. Sekutu mundur ke Ambarawa." =====
const T3 = { pc: wt(3, 'pecah'), mg: wt(3, 'magelang'), sk: wt(3, 'sekutu'), mu: wt(3, 'mundur'), am: wt(3, 'ambarawa') };
const SPM = smoothPts(ROAD_M);
const kRet3 = t => ease(inv(T3.mu - .1, T3.am + .5, t));
SH(ls(3), ls(4), { tr: 'dissolve', xt: .22 }, (ctx, lt, t) => {
  const p = polyAt(SPM, Math.max(.02, kRet3(t)));
  const cam = CK(t, [[ls(3), { x: 420, y: 1060, z: .82 }], [ls(3) + .7, { x: 380, y: 1100, z: .95 }, easeOut], [T3.mg, { x: 330, y: 1140, z: 1.08 }, ease], [T3.mu, { x: 360, y: 1100, z: 1.0 }, ease], [T3.am + .3, { x: 500, y: 960, z: .98 }, ease], [ls(4), { x: 520, y: 940, z: 1.02 }, easeIn]]);
  petaAmbarawa(ctx, t, cam, { labels: { magelang: inv(ls(3), ls(3) + .3, t) }, ambY: -150 });
  drawArrow(ctx, ROAD_M, kRet3(t), { col: '#9a8a5c', w: 40, t, head: 'tri' });
  tkrAt(ctx, t, MGL[0] - 140, MGL[1] + 120, 3, EF(t, [[0, 'curiga', { look: [.8, -.2] }], [T3.pc, 'ngeden', { look: [.8, -.3] }], [T3.mu + .2, 'bangga']], 100), { s: 140, hop: t > T3.mu + .2 });
  const pos = kRet3(t) > 0 ? [p.x, p.y] : [MGL[0] + 70, MGL[1] - 30];
  sekutu(ctx, t, i => EF(t, [[0, 'sombong', { look: [-.6, .2] }], [T3.pc + i * .03, 'kaget', { look: [-.8, .3], sweat: 1 }], [T3.mu + i * .03, 'cemas', { look: [.6, -.6] }]], 110 + i), { cx: pos[0] + 40, cy: pos[1] - 20, sp: .75, s: 130, run: t > T3.mu - .1 && t < T3.am + .5 ? 1 : 0 });
  const db = t - T3.pc; if (db > 0 && db < .5) { burst(ctx, MGL[0], MGL[1] - 20, 170 * backOut(clamp(db / .15)) * (1 - db), 12, '#ffd23a', 4); puff(ctx, MGL[0], MGL[1] - 60 - db * 120, 90 + db * 80, t, '#b9ab8c', 6, 1 - db * 2); }
  sfxText(ctx, 'DUAR!', MGL[0] + 30, MGL[1] - 230, 92, inv(T3.pc, T3.pc + .1, t) * (1 - inv(T3.mu - .2, T3.mu, t)), '#fff', -.1);
  flash(ctx, t, T3.pc, .08);
  if (t > T3.am) glint(ctx, A0[0], A0[1] - 40, 140, t, T3.am + .1);
});

// ===== 4 "26 November, komandan kita, Letnan Kolonel Isdiman, gugur ditembak dari pesawat." lapangan, pesawat lewat, abu-abu =====
const T4 = { n26: wt(4, '26'), km: wt(4, 'komandan'), lt: wt(4, 'letnan'), is: wt(4, 'isdiman'), gg: wt(4, 'gugur'), dt: wt(4, 'ditembak'), ps: wt(4, 'pesawat') };
const ISX = 600, GY = LAP.ground, IS_S = 600;
const fall4 = t => ease(inv(T4.gg + .15, T4.gg + .7, t));
const gray4 = t => .8 * inv(T4.dt, T4.ps + .3, t);
function isdiman(ctx, t, face, fall, o = {}) {
  ctx.save(); ctx.translate(ISX + fall * 40, GY); ctx.rotate(-fall * 1.45); ctx.translate(-ISX, -GY);
  drawStick(ctx, C(TKR, { x: ISX, y: GY, s: IS_S, face, shadow: fall < .1, headTilt: fall * .2, legs: { L: [.1, -.05], R: [.12, -.06] },
    arms: o.point ? { L: [.25, -.3], R: reach(ISX, GY, IS_S, 1, ISX + 330, GY - 560, 1) } : idleArms(t, 1) }));
  ctx.restore();
}
SH(ls(4), ls(5), { tr: 'dissolve', xt: .25 }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(4), { x: 540, y: 1150, z: 1.0 }], [ls(4) + .7, { x: 570, y: 1110, z: 1.12 }, easeOut], [T4.is, { x: 600, y: 1080, z: 1.25 }, ease], [T4.gg, { x: 560, y: 1000, z: 1.08 }, ease], [T4.ps, { x: 430, y: 1180, z: 1.02 }, ease], [ls(5), { x: 420, y: 1200, z: 1.0 }]]);
  fieldScene(ctx, t, cam);
  const f = EM(t, [[ls(4), 'netral', { look: [.8, -.2] }], [T4.km, 'ngeden', { look: [.9, -.3] }], [T4.is + .2, 'kaget', { look: [.7, -1] }], [T4.gg + .15, 'meringis'], [T4.gg + .8, { eyes: 'half', mouth: 'flat', look: [0, 0] }]], 120);
  isdiman(ctx, t, f, fall4(t), { point: t > T4.km && t < T4.is + .2 });
  // pesawat Sekutu menukik dari kanan ke kiri, tembakan menyapu tanah
  const px = kf(t, [[T4.is - .1, 1750], [T4.ps + .3, -700]], x => x);
  if (t > T4.is - .1 && t < T4.ps + .3) drawPlane(ctx, px, 560 + Math.sin(t * 3) * 10, .8, { t, dir: -1, rot: .12 });
  const sw = inv(T4.gg - .25, T4.gg + .25, t); if (sw > 0 && sw < 1) for (let i = 0; i < 6; i++) { const x = lerp(1050, 350, sw) + i * 50; puff(ctx, x, GY - 20, 30, t, '#d9c9a0', 30 + i, .9); }
  flash(ctx, t, T4.gg + .12, .08);
  grayOverlay(ctx, gray4(t));
  popText(ctx, '26 NOV 1945', 560, 520, 76, inv(T4.n26 - .05, T4.n26 + .2, t) * (1 - inv(T4.is, T4.is + .2, t)), '#fff', INK, -.05);
  tagKuning(ctx, 'LETKOL ISDIMAN', 600, 520, 56, -.06, pop(t, T4.lt, .25) * (1 - inv(T4.gg - .1, T4.gg, t)));
  popText(ctx, 'GUGUR', 600, 620, 70, inv(T4.dt, T4.dt + .2, t), '#fff', INK, 0);
});

// ===== 5 "Di situlah, Kolonel Soedirman turun langsung." warna kembali, Soedirman berjalan masuk, pasukan menyusul =====
const T5 = { st: wt(5, 'situlah'), kl: wt(5, 'kolonel'), sd: wt(5, 'soedirman'), tr: wt(5, 'turun'), lg: wt(5, 'langsung') };
const SOX5 = 430;
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 520, y: 1180, z: 1.0 }], [T5.kl, { x: 470, y: 1120, z: 1.08 }, ease], [T5.tr, { x: 450, y: 1080, z: 1.18 }, ease], [ls(6), { x: 460, y: 1060, z: 1.28 }, easeIn]]);
  fieldScene(ctx, t, cam);
  // peci Isdiman di gundukan + bendera kecil (kenangan)
  ellipse(ctx, 860, GY - 5, 120, 30); fillStroke(ctx, PRG.dirt, 6);
  ctx.save(); ctx.translate(860, GY - 40); ctx.scale(1, 1); hatPeci(ctx, 0, 40, 46, 6); ctx.restore();
  bendera(ctx, 930, GY - 10, .45, t, 1);
  if (t > T5.tr) for (let i = 0; i < 3; i++) { const sx = lerp(-200, 130 + i * 95, easeOut(inv(T5.tr, T5.lg + .3, t))); drawStick(ctx, C(TKR, { x: sx, y: GY - 20, s: 420, face: EF(t, [[0, 'ngeden', { look: [.9, -.2] }]], 140 + i), legs: { L: [.1, -.05], R: [.12, -.06] }, arms: idleArms(t, i) })); }
  const x = kf(t, [[ls(5), -260], [T5.sd + .1, SOX5, easeOut]]), walking = t < T5.sd + .1;
  const wc = walkCycle(x + 260, 640, 1);
  const f = EM(t, [[ls(5), 'ngeden', { look: [.9, 0] }], [T5.lg, 'ngeden', { look: [.9, -.3] }]], 130);
  drawStick(ctx, C(SOEDIRMAN, walking ? Object.assign({ x, y: GY, s: 640, face: f }, wc) : { x, y: GY, s: 640, face: f, legs: { L: [.14, -.06], R: [.12, -.05] }, arms: { L: POSE.hips.arms.L, R: reach(x, GY, 640, 1, x + 330, GY - 600, 1) } }));
  for (let i = 0; i < 4; i++) { const yy = 900 + i * 90, xx = ((t * 900 + i * 260) % 1400) - 200; line(ctx, xx, yy, xx + 120, yy, 6, 'rgba(255,255,255,.6)'); }
  grayOverlay(ctx, .8 * (1 - inv(ls(5), T5.kl, t)));
  tagKuning(ctx, 'KOLONEL SOEDIRMAN', 540, 560, 54, -.06, pop(t, T5.kl, .25));
});

// ===== 6 "Taktiknya namanya supit urang. Capit udang." udang raksasa, capit menutup =====
const T6 = { tk: wt(6, 'taktiknya'), sp: wt(6, 'supit'), ur: wt(6, 'urang'), cp: wt(6, 'capit'), ud: wt(6, 'udang') };
SH(ls(6), ls(7), { tr: 'dissolve', xt: .22 }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(6), { x: 540, y: 900, z: .92 }], [ls(6) + .6, { x: 540, y: 880, z: 1.02 }, easeOut], [T6.cp, { x: 540, y: 820, z: 1.15 }, ease], [ls(7), { x: 540, y: 790, z: 1.26 }, easeIn]]);
  skyFill(ctx, '#1d6c9c', '#7cc6ea'); applyCam(ctx, cam, 1);
  const r = rng(12); for (let i = 0; i < 18; i++) { const x = -200 + r() * 1500, y = 1900 - ((t * (60 + r() * 60) + r() * 1800) % 2000); circle(ctx, x, y, 10 + r() * 16); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.stroke(); }
  rrect(ctx, -800, 1420, 2700, 900, 0); fillStroke(ctx, '#e3cf98', 8);
  const k = pop(t, ls(6), .35), snap = t < T6.cp ? 0 : t < T6.cp + .12 ? inv(T6.cp, T6.cp + .12, t) : t < T6.ud + .1 ? 1 : 1 - .6 * inv(T6.ud + .1, T6.ud + .4, t);
  if (k > 0) { ctx.save(); ctx.translate(540, 820); ctx.scale(k, k); drawUdang(ctx, 0, 0, .78, { t, snap, face: EF(t, [[0, 'netral', { look: [0, -.3] }], [T6.ur, 'sombong'], [T6.cp + .05, 'bangga']], 150) }); ctx.restore(); }
  popText(ctx, 'SUPIT URANG', 540, 330, 92, inv(T6.sp - .05, T6.sp + .2, t), '#ffd23a', INK, -.05);
  popText(ctx, '= CAPIT UDANG', 540, 450, 60, inv(T6.cp - .05, T6.cp + .2, t), '#fff', INK, .03);
  sfxText(ctx, 'CEKREK!', 820, 600, 70, inv(T6.cp + .05, T6.cp + .15, t) * (1 - inv(T6.ud + .2, T6.ud + .3, t)), '#fff', .12);
  flash(ctx, t, T6.cp + .05, .07);
});

// ===== 7 "Satu pasukan nekan dari depan, dua lagi njepit dari kiri dan kanan." panah tumbuh satu per satu =====
const T7 = { pk: wt(7, 'pasukan'), nk: wt(7, 'nekan'), dp: wt(7, 'depan'), nj: wt(7, 'njepit'), kr: wt(7, 'kiri'), kn: wt(7, 'kanan') };
const kC7 = t => easeOut(inv(T7.nk - .2, T7.dp + .35, t)), kL7 = t => ease(inv(T7.nj - .1, T7.kr + .4, t)), kR7 = t => ease(inv(T7.nj + .1, T7.kn + .45, t));
const SPL = smoothPts(CAP_L), SPR = smoothPts(CAP_R), SPC = smoothPts(CAP_C);
function tkrOnArrow(ctx, t, sp, k, face) { if (k <= .05) return; const p = polyAt(sp, Math.max(.05, k - .25)); tkrAt(ctx, t, p.x, p.y + 40, 2, face, { s: 110, sp: .8 }); }
SH(ls(7), ls(8), {}, (ctx, lt, t) => {
  const cam = CK(t, [[ls(7), { x: 540, y: 1000, z: .92 }], [ls(7) + .6, { x: 540, y: 1010, z: 1.0 }, easeOut], [T7.dp, { x: 540, y: 1040, z: 1.02 }, ease], [T7.kr, { x: 470, y: 980, z: 1.04 }, ease], [T7.kn + .2, { x: 610, y: 980, z: 1.04 }, ease], [ls(8), { x: 560, y: 930, z: 1.0 }, easeIn]]);
  petaAmbarawa(ctx, t, cam);
  arrows3(ctx, t, kL7(t), kR7(t), kC7(t));
  const tf = EF(t, [[0, 'ngeden', { look: [0, -1] }]], 160);
  tkrOnArrow(ctx, t, SPC, kC7(t), tf); tkrOnArrow(ctx, t, SPL, kL7(t), tf); tkrOnArrow(ctx, t, SPR, kR7(t), tf);
  sekutu(ctx, t, i => EF(t, [[0, 'sombong', { look: [0, .6] }], [T7.dp + i * .03, 'curiga', { look: [0, .8] }], [T7.kr + i * .03, 'cemas', { look: [-.9, .2] }], [T7.kn + i * .03, 'kaget', { look: [.9, .2], sweat: 1 }]], 170 + i));
  popText(ctx, 'DEPAN', 540, 1160, 54, inv(T7.dp - .05, T7.dp + .2, t), '#fff', INK, 0);
  popText(ctx, 'KIRI', 230, 960, 54, inv(T7.kr - .05, T7.kr + .2, t), '#fff', INK, -.08);
  popText(ctx, 'KANAN', 850, 960, 54, inv(T7.kn - .05, T7.kn + .2, t), '#fff', INK, .08);
});

// ===== 8 "Jalan pulang musuh ke Semarang terancam putus." kamera naik ke jalan, jepitan menutup =====
const T8 = { jl: wt(8, 'jalan'), sm: wt(8, 'semarang'), tc: wt(8, 'terancam'), pt: wt(8, 'putus') };
SH(ls(8), ls(9), { tr: 'dissolve', xt: .25 }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(8), { x: 560, y: 930, z: 1.0 }], [T8.sm, { x: 560, y: 700, z: .86 }, ease], [T8.pt, { x: 550, y: 790, z: 1.02 }, ease], [ls(9), { x: 545, y: 830, z: 1.08 }, easeIn]]);
  petaAmbarawa(ctx, t, cam);
  // jalan pulang berkedip merah
  const rk = inv(T8.jl, T8.jl + .2, t); if (rk > 0) { const sp = smoothPts(ROAD_N); ctx.save(); ctx.globalAlpha *= rk * (.55 + .45 * Math.sin(t * 12)); ctx.beginPath(); sp.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.setLineDash([30, 22]); ctx.lineDashOffset = t * 80; ctx.lineWidth = 14; ctx.strokeStyle = MPC.red; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  arrows3(ctx, t, 1, 1, 1);
  const ek = ease(inv(T8.tc - .1, T8.pt + .1, t));
  drawArrow(ctx, EXT_L, ek, { col: MPC.red, w: 44, t }); drawArrow(ctx, EXT_R, ek, { col: MPC.red, w: 44, t });
  sekutu(ctx, t, i => EF(t, [[0, 'cemas', { look: [0, -.9] }], [T8.sm + i * .03, 'sadar', { look: [0, -1] }], [T8.pt + i * .03, 'kaget', { look: [0, -1], sweat: 1 }]], 180 + i));
  const pk = t - T8.pt; if (pk > 0) { const c = [545, 745]; ctx.save(); ctx.translate(c[0], c[1]); const s2 = backOut(clamp(pk / .2)); ctx.scale(s2, s2); path(ctx, [[-60, -30], [-15, -8], [-40, 10], [10, 30], [-5, 50], [60, 70]], false); ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
  sfxText(ctx, 'PUTUS?', 700, 640, 70, inv(T8.pt, T8.pt + .12, t), '#ffd23a', .1);
});

// ===== 9 "12 Desember, jam setengah 5 pagi, serangan dimulai." malam, TKR mengendap, fajar -> SERBU =====
const T9 = { n12: wt(9, '12'), jm: wt(9, 'jam'), st: wt(9, 'setengah'), pg: wt(9, 'pagi'), sr: wt(9, 'serangan'), dm: wt(9, 'dimulai') };
const RING = Array.from({ length: 8 }, (_, i) => { const a = -Math.PI / 2 + i * TAU / 8; return [A0[0] + Math.cos(a) * 330, A0[1] + Math.sin(a) * 240]; });
SH(ls(9), ls(10), {}, (ctx, lt, t) => {
  const cam = CK(t, [[ls(9), { x: 540, y: 880, z: 1.12 }], [ls(9) + .6, { x: 540, y: 890, z: 1.05 }, easeOut], [T9.sr, { x: 540, y: 900, z: .98 }, ease], [ls(10), { x: 540, y: 900, z: 1.0 }]]);
  petaAmbarawa(ctx, t, cam);
  const atk = t > T9.sr;
  if (atk) arrows3(ctx, t, 1, 1, 1);
  const sneak = ease(inv(T9.jm - .2, T9.sr, t));
  RING.forEach(([x, y], i) => { const r = lerp(1.25, 1, sneak), xx = A0[0] + (x - A0[0]) * r, yy = A0[1] + (y - A0[1]) * r; token(ctx, xx, yy + (atk ? -Math.abs(Math.sin(t * 10 + i)) * 14 : 0), 120, 'tkr', EF(t, [[0, 'licik', { look: [(A0[0] - x) / 330, (A0[1] - y) / 240] }], [T9.sr + i * .02, 'ngeden']], 190 + i), { t, rifle: true }); });
  sekutu(ctx, t, i => EF(t, [[0, { eyes: 'half', mouth: 'flat', look: [0, .3] }], [T9.sr + .1 + i * .03, 'kaget', { look: [0, -.3], sweat: 1 }]], 200 + i), { jump: atk ? Math.max(0, 1 - (t - T9.sr) * 4) * -18 : 0 });
  if (!atk) sfxText(ctx, 'zzz', A0[0] + 150, A0[1] - 170 + Math.sin(t * 3) * 8, 50, inv(ls(9) + .2, ls(9) + .4, t), '#fff', -.1);
  for (let i = 0; i < 5; i++) { const d = t - (T9.sr + i * .12); if (d > 0 && d < .45) { const [x, y] = RING[(i * 3) % 8]; burst(ctx, (x + A0[0]) / 2, (y + A0[1]) / 2, 90 * backOut(clamp(d / .12)) * (1 - d / .45), 10, '#ffd23a', 7 + i); } }
  timeGrade(ctx, lerp(1, .15, ease(inv(T9.pg, T9.sr + .2, t))), 'malam');
  popText(ctx, '12 DES 1945', 540, 560, 76, inv(T9.n12 - .05, T9.n12 + .2, t) * (1 - inv(T9.sr - .2, T9.sr, t)), '#fff', INK, -.05);
  tagKuning(ctx, 'JAM 04.30', 540, 680, 58, .05, pop(t, T9.st, .25) * (1 - inv(T9.sr - .2, T9.sr, t)));
  sfxText(ctx, 'SERBU!', 540, 600, 104, inv(T9.sr, T9.sr + .12, t), '#ffd23a', -.08);
  flash(ctx, t, T9.sr, .1);
});

// ===== 10 "Satu hari. Dua hari. Tiga. Empat." kantong pengepungan menyempit per hari =====
const T10 = [wt(10, 'satu'), wt(10, 'dua'), wt(10, 'tiga'), wt(10, 'empat')];
const day10 = t => T10.filter(x => t >= x - .05).length;
SH(ls(10), ls(11), {}, (ctx, lt, t) => {
  const cam = CK(t, [[ls(10), { x: 540, y: 900, z: 1.0 }], [T10[3] + .3, { x: 540, y: 880, z: 1.22 }, ease], [ls(11), { x: 540, y: 875, z: 1.26 }]]);
  petaAmbarawa(ctx, t, cam);
  arrows3(ctx, t, 1, 1, 1);
  const shrink = T10.reduce((a, x) => a + ease(inv(x, x + .35, t)), 0) / 4;
  const rx = lerp(330, 190, shrink), ry = lerp(240, 150, shrink);
  drawPocket(ctx, A0[0], A0[1], rx, ry, t, 1);
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + i * TAU / 8; token(ctx, A0[0] + Math.cos(a) * (rx + 60), A0[1] + Math.sin(a) * (ry + 55), 110, 'tkr', EF(t, [[0, 'ngeden', { look: [-Math.cos(a), -Math.sin(a)] }]], 210 + i), { t, rifle: true }); }
  sekutu(ctx, t, i => EF(t, [[0, 'kaget', { sweat: 1 }], [T10[1] + i * .03, 'cemas', { look: [.7, 0] }], [T10[3] + i * .03, 'meringis']], 220 + i), { sp: lerp(1.1, .75, shrink), s: lerp(170, 150, shrink) });
  T10.forEach((x, i) => { const d = t - x; if (d > 0 && d < .4) { burst(ctx, A0[0] + (i % 2 ? 1 : -1) * rx * .8, A0[1] - ry * .6, 90 * backOut(clamp(d / .1)) * (1 - d / .4), 10, '#ffd23a', 3 + i); } });
  const n = day10(t); if (n > 0) { const k = pop(t, T10[n - 1] - .05, .2); tagKuning(ctx, 'HARI KE-' + n, 540, 560, 66, -.06, Math.max(.85, k)); }
  // siang-malam berganti tiap hari
  timeGrade(ctx, .45 * Math.max(0, Math.sin((t - ls(10)) / (T10[3] + .6 - ls(10)) * Math.PI * 4)), 'malam');
});

// ===== 11 "15 Desember, Sekutu mundur ke Semarang." Sekutu lari ke utara, merah putih naik di Ambarawa =====
const T11 = { n15: wt(11, '15'), sk: wt(11, 'sekutu'), mu: wt(11, 'mundur'), sm: wt(11, 'semarang') };
const SPN = smoothPts(ROAD_N), kRun11 = t => ease(inv(T11.mu - .1, T11.sm + .5, t));
SH(ls(11), ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  const p = polyAt(SPN, Math.max(.02, kRun11(t)));
  const cam = CK(t, [[ls(11), { x: 540, y: 875, z: 1.2 }], [T11.sk, { x: 545, y: 860, z: 1.05 }, ease], [T11.sm, { x: 555, y: 720, z: .86 }, ease], [ls(12), { x: 555, y: 700, z: .9 }]]);
  petaAmbarawa(ctx, t, cam);
  arrows3(ctx, t, 1, 1, 1);
  drawPocket(ctx, A0[0], A0[1], 190, 150, t, 1 - inv(T11.mu, T11.mu + .4, t));
  drawArrow(ctx, ROAD_N, kRun11(t), { col: '#9a8a5c', w: 40, t, head: 'tri' });
  bendera(ctx, A0[0] + 30, A0[1] + 30, .55, t, ease(inv(T11.sk, T11.sm + .3, t)));
  tkrAt(ctx, t, A0[0] - 30, A0[1] + 140, 4, EF(t, [[0, 'ngeden'], [T11.mu + .15, 'bangga']], 230), { s: 120, hop: t > T11.mu + .15 });
  const pos = kRun11(t) > .02 ? [p.x, p.y] : A0;
  sekutu(ctx, t, i => EF(t, [[0, 'meringis'], [T11.mu + i * .03, 'cemas', { look: [0, -.9], sweat: 1 }]], 240 + i), { cx: pos[0] + 30, cy: pos[1], sp: .8, s: 140, run: kRun11(t) > .02 && kRun11(t) < .99 ? -1 : 0 });
  popText(ctx, '15 DES 1945', 560, 420, 76, inv(T11.n15 - .05, T11.n15 + .2, t), '#fff', INK, -.05);
  if (t > T11.sm) glint(ctx, A0[0] + 120, A0[1] - 180, 130, t, T11.sm + .1);
});

// ===== 12 "Tiga hari kemudian, Soedirman resmi dilantik jadi Panglima Besar." potret, lencana, merah putih =====
const T12 = { tg: wt(12, 'tiga'), sd: wt(12, 'soedirman'), dl: wt(12, 'dilantik'), pg: wt(12, 'panglima'), bs: wt(12, 'besar') };
const SX12 = 540, S12 = 720;
SH(ls(12), ls(13), { tr: 'dissolve', xt: .22 }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(12), { x: 540, y: 1100, z: 1.0 }], [ls(12) + .7, { x: 540, y: 1060, z: 1.1 }, easeOut], [T12.dl, { x: 540, y: 1010, z: 1.22 }, ease], [T12.bs, { x: 540, y: 990, z: 1.3 }, ease], [ls(13), { x: 540, y: 985, z: 1.34 }, easeIn]]);
  fieldScene(ctx, t, cam);
  bendera(ctx, 150, GY - 20, .95, t, 1); bendera(ctx, 820, GY - 20, .95, t + .7, 1);
  const f = EC(t, [[ls(12), 'netral', { look: [0, 0] }], [T12.dl + .1, 'lega'], [T12.bs, 'bangga']], 250);
  drawStick(ctx, C(SOEDIRMAN, { x: SX12, y: GY, s: S12, face: f, headTilt: -(f.pop || 0) * .05, legs: { L: [.12, -.05], R: [.12, -.05] }, arms: { L: POSE.hips.arms.L, R: t > T12.bs ? reach(SX12, GY, S12, 1, SX12 + 120, GY - .78 * S12, -1) : idleArms(t, 0).R } }));
  lencana(ctx, SX12 + 55, GY - .56 * S12, 34, t, inv(T12.dl, T12.dl + .25, t));
  if (t > T12.dl) glint(ctx, SX12 + 55, GY - .56 * S12, 110, t, T12.dl + .1);
  popText(ctx, '18 DES 1945', 540, 470, 72, inv(T12.tg - .05, T12.tg + .2, t) * (1 - inv(T12.pg - .2, T12.pg, t)), '#fff', INK, -.05);
  tagKuning(ctx, 'PANGLIMA BESAR', 540, 470, 66, -.05, pop(t, T12.pg, .25));
  if (t > T12.bs) for (let i = 0; i < 5; i++) star5(ctx, 540 + Math.cos(t * 2 + i * 1.26) * 330, 620 + Math.sin(t * 2 + i * 1.26) * 60, 22, t * 2 + i, '#ffe14d');
});

// ===== 13 "Dan semua itu, dia lakuin di..." rewind ke frame 0 (loop ke "Umur 29 tahun") =====
const T13 = { dn: wt(13, 'dan'), sm: wt(13, 'semua'), it: wt(13, 'itu'), lk: wt(13, 'lakuin') };
SH(ls(13), ENDT, {}, (ctx, lt, t) => {
  const cam = CK(t, [[ls(13), { x: 545, y: 860, z: 1.0 }], [T13.it, { x: 545, y: 900, z: 1.1 }, ease], [LOOP0, { x: 540, y: 970, z: 1.24 }, ease], [ENDT, CAM_F0, easeOut]], 0);
  petaAmbarawa(ctx, t, cam);
  const rw = ease(inv(T13.it, LOOP0, t));   // rewind panah ke posisi frame 0
  const k = lerp(1, .45, rw);
  arrows3(ctx, t, k, k, lerp(1, .25, rw));
  const ba = 1 - inv(T13.it, LOOP0 - .25, t); if (ba > 0) { ctx.save(); ctx.globalAlpha *= ba; bendera(ctx, A0[0] + 30, A0[1] + 30, .55, t, 1); ctx.restore(); }
  const sk = ease(inv(T13.sm, T13.lk, t));
  sekutu(ctx, t, i => EF(t, [[0, 'sombong', { look: [-.6, 0] }]], 20 + i), { alpha: sk });
  const rv = inv(T13.it, LOOP0, t) * (1 - inv(LOOP0 - .1, LOOP0 + .05, t));
  if (rv > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = rv; ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 7;
    for (const dx of [0, 52]) { path(ctx, [[880 + dx, 260], [930 + dx, 225], [930 + dx, 295]]); ctx.fill(); ctx.stroke(); }
    ctx.globalAlpha = rv * .25; for (let i = 0; i < 6; i++) { const y = (t * 900 + i * 330) % 1920; ctx.fillRect(0, y, W, 10); } ctx.restore(); }
  const sx = lerp(-320, SOE[0], easeOut(inv(T13.sm, LOOP0 - .2, t)));
  soedirmanFront(ctx, t, sx, exprTrack(t, [[0, FACE_SOE0]], { seed: 7, saccade: false }));
});
