// ---------- PREVIEW ASET: "Kenapa Prancis yang punya benteng terkuat bisa kalah cuma 6 minggu?" (~18 dtk, tanpa narator) ----------
// Tujuan: memperlihatkan gaya aset/latar baru (env_perang.js) sebelum episode penuh dibuat.
// Timing kata = PERKIRAAN (belum ada suara ElevenLabs). Di versi penuh, words.js diganti hasil Scribe dan semua tetap sinkron (wt()).
const SHOTS = [];
const PIERRE = { cols: [PRG.fr, PRG.fr], hat: hatAdrian, belt: true };   // tentara Prancis: biru, helm berjambul
const HANS = { cols: [PRG.de, PRG.de], hat: hatStahl, belt: true };      // tentara Jerman: abu-hijau, helm melebar
const C = (b, e) => Object.assign({}, b, e);
const LN = {}; WORDS.forEach(w => { (LN[w.line] = LN[w.line] || []).push(w); });
const ls = i => LN[i][0].s;
const nrm = s => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const fw = (i, str, n = 0) => { const w = LN[i].filter(w => nrm(w.w) === str)[n]; if (!w) throw new Error('kata tidak ada di baris ' + i + ': ' + str); return w.s; };
const wt = (i, str, d = 0, n = 0) => fw(i, str, n) + d;
const ENDT = WORDS[WORDS.length - 1].e + .6;
const SH = (s, e, o, draw) => SHOTS.push(Object.assign({ start: s, end: e, draw }, o));
const CK = (t, keys, sh = 2) => camKeys(t, t, keys, sh);
const EF = (t, keys, seed) => exprTrack(t, keys, { seed, saccade: false, idleBlink: false });
const EM = (t, keys, seed) => exprTrack(t, keys, { seed, saccade: false });
const EC = (t, keys, seed) => exprTrack(t, keys, { seed });
const armTo = (px, py, s, flip, wx, wy, bend = 1) => reach(px, py, s, flip, wx, wy, bend);

// ===== 0 HOOK: Pierre santai ngopi di atas benteng raksasa -> tarik mundur (skala benteng) -> kopi tumpah =====
const P0 = { x: MAG.sit, s: 430 }; P0.y = MAG.top - 40 + .3 * P0.s;
const H0 = { bt: wt(0, 'benteng'), tk: wt(0, 'terkuat'), kl: wt(0, 'kalah'), n6: wt(0, '6'), mg: wt(0, 'minggu') };
const cam0 = t => CK(t, [[0, { x: 575, y: 900, z: 1.75 }], [.6, { x: 570, y: 905, z: 1.62 }, easeOut], [H0.bt, { x: 560, y: 930, z: 1.45 }], [H0.tk + .45, { x: 520, y: 1160, z: .64 }, ease], [H0.kl, { x: 525, y: 1140, z: .7 }], [H0.kl + .35, { x: 560, y: 930, z: 1.4 }, easeOut], [ls(1), { x: 565, y: 915, z: 1.55 }, easeIn]], 2);
SH(0, ls(1), { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = cam0(t); maginotScene(ctx, t, cam);
  // cangkir: di mulut (frame 0, sedang menyeruput) -> turun ke pangkuan -> tumpah saat "kalah"
  const head = [P0.x, P0.y - .765 * P0.s];
  const cup = kf(t, [[0, [head[0] + 46, head[1] + 70]], [.55, [head[0] + 46, head[1] + 70]], [.95, [P0.x + 118, P0.y - 150], easeOut], [H0.kl, [P0.x + 118, P0.y - 150]], [H0.kl + .15, [P0.x + 150, P0.y - 210], easeOut]]);
  const tilt = kf(t, [[0, -.75], [.55, -.75], [.95, 0], [H0.kl, 0], [H0.kl + .15, .9]]);
  const f = EM(t, [[0, { eyes: 'happy', mouth: 'smile' }], [.95, 'sombong'], [H0.kl, 'kaget', { look: [.2, -.1] }], [H0.mg, 'sadar']], 1);
  const legs = { L: [.1 + Math.sin(t * 3) * .07, -.05], R: [.1 - Math.sin(t * 3) * .07, -.05] };
  drawStick(ctx, C(PIERRE, { x: P0.x, y: P0.y, s: P0.s, legs, shadow: false, face: f, headTilt: (t < .55 ? -.12 : 0) - (f.pop || 0) * .05, arms: { L: [.35 + Math.sin(t * 1.7) * .03, -.3], R: armTo(P0.x, P0.y, P0.s, 1, cup[0] - 10, cup[1] - 20, -1) } }));
  drawCup(ctx, cup[0], cup[1], .75, { t, steam: t < H0.kl ? 1 : 0, tilt });
  const sp = inv(H0.kl + .12, H0.kl + .6, t); if (sp > 0 && sp < 1) for (let i = 0; i < 7; i++) { circle(ctx, cup[0] + 30 + i * 9, cup[1] - 40 + sp * sp * 260 + i * 12, 11 - i); ctx.fillStyle = '#6b3d1e'; ctx.fill(); }
  // tanda tanya di "6 minggu"
  const q = inv(H0.n6, H0.n6 + .25, t); if (q > 0) qmark(ctx, P0.x + 190, head[1] - 150 + Math.sin(t * 5) * 6, 150 * backOut(q), .18);
  glint(ctx, MAG.cloche, MAG.top - 110, 160, t, H0.tk);
  flash(ctx, t, H0.kl, .08);
});

// ===== 1 "Perang sebelumnya macet 4 tahun di parit." dua parit berhadapan, papan tahun 1914 -> 1918, wajah bosan =====
const T1 = { mc: wt(1, 'macet'), n4: wt(1, '4'), th: wt(1, 'tahun'), pr: wt(1, 'parit') };
const cam1 = t => CK(t, [[ls(1) - .2, { x: 545, y: 1290, z: 1.0 }], [ls(1) + .6, { x: 545, y: 1300, z: 1.12 }, easeOut], [T1.th + .3, { x: 545, y: 1320, z: 1.22 }], [ls(2), { x: 600, y: 1330, z: 1.3 }, easeIn]], 2);
SH(ls(1), ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam1(t); trenchBack(ctx, t, cam);
  const peekL = kf(t, [[ls(1), 1810], [ls(1) + .35, 1660, backOut], [T1.mc + .9, 1660], [T1.mc + 1.1, 1810, easeIn], [T1.th + .55, 1810], [T1.th + .8, 1665, backOut]]);
  const peekR = kf(t, [[ls(1) + .25, 1810], [ls(1) + .6, 1665, backOut], [T1.mc + .95, 1665], [T1.mc + 1.15, 1810, easeIn], [T1.th + .62, 1810], [T1.th + .9, 1660, backOut]]);
  const fl = EF(t, [[ls(1), 'curiga', { look: [.9, 0] }], [T1.mc, 'datar', { look: [.9, .1] }]], 3);
  const fr = EF(t, [[ls(1), 'curiga', { look: [.9, 0] }], [T1.mc + .07, 'datar', { look: [.9, .1] }]], 4);
  drawStick(ctx, C(PIERRE, { x: PRT.lt, y: peekL, s: 420, shadow: false, face: fl, arms: { L: [.5, -.6], R: [.5, -.6] } }));
  drawStick(ctx, C(HANS, { x: PRT.rt, y: peekR, s: 420, flip: -1, shadow: false, face: fr, arms: { L: [.5, -.6], R: [.5, -.6] } }));
  trenchFront(ctx, t);
  // papan tahun di tengah: 1914 -> 1918 berputar cepat
  const yr = 1914 + Math.min(4, Math.floor(inv(T1.n4 - .1, T1.th + .45, t) * 4.999));
  drawSign(ctx, 545, PRT.ground + 120, .78, String(yr), { rot: -.06 });
  if (t > T1.th + .45 && t < T1.th + .6) glint(ctx, 545, PRT.ground - 80, 120, t, T1.th + .45);
  // ledakan kecil di tanah tak bertuan (kartun) membuat keduanya merunduk
  const db = t - (T1.mc + .95); if (db > 0 && db < .5) { burst(ctx, 545, PRT.ground + 20, 150 * backOut(clamp(db / .15)) * (1 - db), 12, '#ffd23a', 4); puff(ctx, 545, PRT.ground - 40 - db * 120, 90 + db * 80, t, '#b9ab8c', 6, 1 - db * 2); }
  sfxText(ctx, 'DUAR', 545, PRT.ground - 210, 84, inv(T1.mc + .95, T1.mc + 1.05, t) * (1 - inv(T1.mc + 1.4, T1.mc + 1.5, t)), '#fff', -.1);
  if (t > T1.th + .9) drawZzz(ctx, PRT.rt + 70, peekR - 400, .9, t);
});

// ===== 2 "Jerman datang dengan kombo baru: tank, pesawat, dan radio." Hans memamerkan: tank masuk, pesawat menukik, radio menyambungkan =====
const T2 = { kb: wt(2, 'kombo'), tk: wt(2, 'tank'), ps: wt(2, 'pesawat'), rd: wt(2, 'radio') };
const HX2 = 250, RX2 = 470, TS2 = .6;
const tankX2 = t => kf(t, [[ls(2), -700], [T2.tk + .1, 780, easeOut]]);
const plane2 = t => kf(t, [[ls(2), [-500, 260, -.25]], [T2.ps - .3, [-500, 260, -.25]], [T2.ps + .45, [640, 560, .05], easeOut], [ls(3) + 1, [700, 540 + 0, -.02]]]);
const cam2 = t => CK(t, [[ls(2), { x: 330, y: 1070, z: 1.3 }], [ls(2) + .6, { x: 360, y: 1090, z: 1.2 }, easeOut], [T2.tk + .2, { x: 540, y: 1190, z: .9 }, ease], [T2.ps + .3, { x: 540, y: 1150, z: .86 }, ease], [T2.rd + .2, { x: 520, y: 1210, z: .95 }, ease], [ls(3), { x: 540, y: 1200, z: 1.0 }, easeIn]], 2);
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam2(t); fieldScene(ctx, t, cam);
  const tx = tankX2(t), tf = EF(t, [[ls(2), 'netral', { look: [.6, 0] }], [T2.rd + .2, 'bangga']], 5);
  drawTank(ctx, tx, LAP.ground - 70, TS2, { t, roll: tx + 700, exhaust: 1, bob: t < T2.tk + .1 ? Math.sin(t * 30) * 2 : 0, face: tf, bolt: 1 });
  const pl = plane2(t); drawPlane(ctx, pl[0], pl[1] + Math.sin(t * 3) * 10, .8, { t, rot: pl[2], face: EF(t, [[ls(2), 'netral'], [T2.rd + .25, 'bangga']], 6) });
  const tip = drawRadio(ctx, RX2, LAP.ground, 1, { t, wave: inv(T2.rd, T2.rd + .2, t) });
  const fh = EM(t, [[ls(2), 'licik', { look: [.7, 0] }], [T2.tk, 'bangga'], [T2.rd, 'licik', { look: [.8, -.2] }]], 7);
  const pointT = t < T2.ps ? [tx - 80, LAP.ground - 250] : t < T2.rd ? [pl[0], pl[1] + 80] : [RX2 - 40, LAP.ground - 120];
  drawStick(ctx, C(HANS, { x: HX2, y: LAP.ground, s: 560, face: fh, headTilt: -(fh.pop || 0) * .05, arms: { L: [.3 + Math.sin(t * 1.7) * .04, -.3], R: armTo(HX2, LAP.ground, 560, 1, Math.min(pointT[0], HX2 + 260), Math.max(pointT[1], LAP.ground - 560), -1) } }));
  // sinyal radio menyambungkan tank + pesawat (gerak bersama)
  const k = inv(T2.rd + .1, T2.rd + .5, t);
  drawWaveLink(ctx, tip[0], tip[1], tx - 178 * TS2, LAP.ground - 70 - 555 * TS2, t, k);
  drawWaveLink(ctx, tip[0], tip[1], pl[0] - 30, pl[1] + 40, t, inv(T2.rd + .2, T2.rd + .6, t));
  sfxText(ctx, 'KOMBO!', 760, 380, 92, inv(T2.kb, T2.kb + .15, t) * (1 - inv(T2.tk - .1, T2.tk, t)), '#ffd23a', -.1);
  glint(ctx, RX2, LAP.ground - 160, 120, t, T2.rd);
  if (t > T2.tk && t < T2.tk + .3) puff(ctx, tx + 200 * TS2, LAP.ground - 40, 70, t, '#e7dcc4', 9, 1 - (t - T2.tk) / .3);
});

// ===== 3 "Mereka lewat hutan yang dianggap mustahil." tank menerobos cemara, papan BUNTU roboh =====
const T3 = { lw: wt(3, 'lewat'), ht: wt(3, 'hutan'), mu: wt(3, 'mustahil') };
const TS3 = .9, TY3 = ARD.ground + 70;
const tankX3 = t => kf(t, [[ls(3) - .3, -150], [ls(4) + .3, 860]], x => x);
const PINES3 = [[260, 1.05], [520, .95], [760, 1.1], [1010, 1.0]];
const cam3 = t => { const tx = tankX3(t); return CK(t, [[ls(3), { x: tx + 120, y: 1280, z: 1.05 }], [T3.mu, { x: tx + 60, y: 1250, z: 1.22 }, ease], [ls(4), { x: tx + 40, y: 1230, z: 1.32 }, easeIn]], 2.5); };
SH(ls(3), ls(4), { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = cam3(t); ardennesScene(ctx, t, cam);
  const tx = tankX3(t), front = tx + 360 * TS3, rear = tx - 320 * TS3;
  PINES3.forEach(([px, sc], i) => { const b = -.55 * ease(inv(px - 60, px + 60, front)) * (1 - ease(inv(px + 30, px + 260, rear))); drawPine(ctx, px, ARD.ground + 20, sc, { bend: b * -1 + Math.sin(t * 20 + i) * .02 * (b !== 0), col: PRG.pine }); });
  const SGX = 900, fall = ease(inv(SGX - 40, SGX + 40, front));
  drawSign(ctx, SGX, ARD.ground + 40, .8, 'BUNTU', { rot: -.05, fall });
  const fc = EM(t, [[ls(3), 'licik', { look: [.9, 0] }], [T3.mu, 'bangga']], 8);
  const crew = c => drawStick(c, C(HANS, { x: -70, y: -120, s: 300, shadow: false, face: fc, arms: { L: [.2, -.1], R: [.2, -.1] }, headTilt: -.06 }));
  drawTank(ctx, tx, TY3, TS3, { t, roll: tx * 1.0, exhaust: 1, bob: Math.sin(t * 26) * 3, crew, bolt: 1 });
  // ranting & daun berhamburan saat menabrak pohon
  PINES3.forEach(([px], i) => { const d = (front - px) / 300; if (d > 0 && d < .8) for (let j = 0; j < 5; j++) { const a = -1.2 - j * .35, v = d * 300; circle(ctx, px + Math.cos(a) * v, ARD.ground - 300 - Math.sin(-a) * v + d * d * 300, 10); fillStroke(ctx, PRG.pine, 3); } });
  sfxText(ctx, 'KRAK', 780, ARD.ground - 520, 80, inv(SGX - 40, SGX + 10, front) * (1 - inv(SGX + 160, SGX + 220, front)), '#fff', .1);
  sfxText(ctx, 'SSST', tx - 120, TY3 - 560, 70, inv(T3.lw, T3.lw + .15, t) * (1 - inv(T3.mu - .1, T3.mu, t)), '#ffd23a', -.12);
});

// ===== 4 "Tapi di Rusia, kilat itu padam." tank terjebak salju, roda berputar di tempat, panji kilat padam =====
const T4 = { rs: wt(4, 'rusia'), kl: wt(4, 'kilat'), pd: wt(4, 'padam') };
const cam4 = t => CK(t, [[ls(4) - .2, { x: 560, y: 1230, z: 1.0 }], [ls(4) + .6, { x: 560, y: 1220, z: 1.1 }, easeOut], [T4.kl, { x: 470, y: 1060, z: 1.25 }, ease], [ENDT, { x: 470, y: 1040, z: 1.42 }]], 2);
SH(ls(4), ENDT, {}, (ctx, lt, t) => {
  const cam = cam4(t); snowScene(ctx, t, cam);
  const sh = Math.sin(t * 38) * 3, sv = inv(T4.pd, T4.pd + .4, t);
  const fc = EM(t, [[ls(4), 'cemas', { look: [.6, -.4] }], [T4.kl, 'sadar', { look: [-.3, -1] }], [T4.pd + .1, 'meringis']], 9);
  const crew = c => drawStick(c, C(HANS, { x: -70 + sh * (1 - sv * .5), y: -120, s: 300, shadow: false, face: fc, arms: { L: [.2, -.1], R: [.2, -.1] } }));
  const tf = EF(t, [[ls(4), 'ngeden'], [T4.pd + .15, { eyes: 'x', mouth: 'wobble' }]], 10);
  drawTank(ctx, SLJ.tank, SLJ.ground + 60, .9, { t, roll: t * (1 - sv) * 900, exhaust: 1 - sv, bob: Math.sin(t * 30) * 3 * (1 - sv), crew, bolt: 1 - sv, snow: 1, face: tf });
  // salju muncrat dari rantai yang selip
  if (sv < 1) for (let i = 0; i < 6; i++) { const q = (t * 2.4 + i / 6) % 1; circle(ctx, SLJ.tank - 300 - q * 220, SLJ.ground - 20 - Math.sin(q * Math.PI) * 140, 16 * (1 - q)); fillStroke(ctx, PRG.snow, 3); }
  sfxText(ctx, 'BRRR', 300, 900, 76, inv(ls(4) + .2, ls(4) + .35, t) * (1 - inv(T4.kl, T4.kl + .1, t)), '#cfe8ff', -.12);
  drawSnowfall(ctx, t, 1);
  timeGrade(ctx, .25 * sv, 'malam');
});
