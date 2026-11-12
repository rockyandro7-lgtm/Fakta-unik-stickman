// ---------- Fakta Unik: "Kenapa Prancis yang punya benteng terkuat bisa kalah cuma 6 minggu?" (~90 dtk) ----------
// Format "Kenapa X?" + peta pengepungan. Aturan v5 (kamera bergerak, transisi), v6 (semua waktu dari kata wt(), aset satu fungsi),
// v7 (mikroekspresi hemat, latar satu skala, loop ke frame 0). Aset: env_perang.js, env_peta.js, map_data.js.
const SHOTS = [];
const PIERRE = { cols: [PRG.fr, PRG.fr], hat: hatAdrian, belt: true };
const HANS = { cols: [PRG.de, PRG.de], hat: hatStahl, belt: true };
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
const bezP = (a, c, b, p) => { const q = 1 - p; return [q * q * a[0] + 2 * q * p * c[0] + p * p * b[0], q * q * a[1] + 2 * q * p * c[1] + p * p * b[1]]; };
const SEDIH = { eyes: 'half', mouth: 'frown', browAng: .3 };

// ===== Pierre di atas benteng (dipakai shot 0, 1, 17, 19) =====
const P0 = { x: MAG.sit, s: 430 }; P0.y = MAG.top - 40 + .3 * P0.s;
const HEAD0 = [P0.x, P0.y - .765 * P0.s];
const CUP_MOUTH = [HEAD0[0] + 46, HEAD0[1] + 70], CUP_REST = [P0.x + 118, P0.y - 150];
const CAM_F0 = { x: 575, y: 900, z: 1.75 };   // komposisi frame 0 (loop)
function pierreWall(ctx, t, face, cup, tilt, o = {}) {
  const legs = { L: [.1 + Math.sin(t * 3) * .07, -.05], R: [.1 - Math.sin(t * 3) * .07, -.05] };
  drawStick(ctx, C(PIERRE, { x: P0.x, y: P0.y, s: P0.s, legs, shadow: false, face, headTilt: (o.tilt || 0) - (face.pop || 0) * .05, arms: { L: o.armL || [.35 + Math.sin(t * 1.7) * .03, -.3], R: armTo(P0.x, P0.y, P0.s, 1, cup[0] - 10, cup[1] - 20, -1) } }));
  if (o.binoc) { const b = o.binoc; rrect(ctx, b[0] - 56, b[1] - 30, 112, 60, 16); fillStroke(ctx, '#3b3b42', 6); circle(ctx, b[0] - 28, b[1], 20); fillStroke(ctx, '#9fd6ef', 5); circle(ctx, b[0] + 28, b[1], 20); fillStroke(ctx, '#9fd6ef', 5); }
  else drawCup(ctx, cup[0], cup[1], .75, { t, steam: o.steam == null ? 1 : o.steam, tilt });
}

// ===== 0 HOOK: Pierre ngopi di atas benteng -> tarik mundur (skala benteng) -> kopi tumpah di "kalah" =====
const H0 = { bt: wt(0, 'benteng'), tk: wt(0, 'terkuat'), kl: wt(0, 'kalah'), n6: wt(0, '6'), mg: wt(0, 'minggu') };
const cam0 = t => CK(t, [[0, CAM_F0], [.6, { x: 570, y: 905, z: 1.62 }, easeOut], [H0.bt, { x: 560, y: 930, z: 1.45 }], [H0.tk + .45, { x: 520, y: 1160, z: .64 }, ease], [H0.kl, { x: 525, y: 1140, z: .7 }], [H0.kl + .35, { x: 560, y: 930, z: 1.4 }, easeOut], [ls(1), { x: 565, y: 915, z: 1.5 }, easeIn]], 2);
SH(0, ls(1), {}, (ctx, lt, t) => {
  const cam = cam0(t); maginotScene(ctx, t, cam);
  const cup = kf(t, [[0, CUP_MOUTH], [.55, CUP_MOUTH], [.95, CUP_REST, easeOut], [H0.kl, CUP_REST], [H0.kl + .15, [P0.x + 150, P0.y - 210], easeOut]]);
  const tilt = kf(t, [[0, -.75], [.55, -.75], [.95, 0], [H0.kl, 0], [H0.kl + .15, .9]]);
  const f = EM(t, [[0, { eyes: 'happy', mouth: 'smile' }], [.95, 'sombong'], [H0.kl, 'kaget', { look: [.2, -.1] }], [H0.mg, 'sadar']], 1);
  pierreWall(ctx, t, f, cup, tilt, { tilt: t < .55 ? -.12 : 0, steam: t < H0.kl ? 1 : 0 });
  const sp = inv(H0.kl + .12, H0.kl + .6, t); if (sp > 0 && sp < 1) for (let i = 0; i < 7; i++) { circle(ctx, cup[0] + 30 + i * 9, cup[1] - 40 + sp * sp * 260 + i * 12, 11 - i); ctx.fillStyle = '#6b3d1e'; ctx.fill(); }
  const q = inv(H0.n6, H0.n6 + .25, t); if (q > 0) qmark(ctx, P0.x + 190, HEAD0[1] - 150 + Math.sin(t * 5) * 6, 150 * backOut(q), .18);
  glint(ctx, MAG.cloche, MAG.top - 110, 160, t, H0.tk);
  flash(ctx, t, H0.kl, .08);
});

// ===== 1 "Rahasianya bukan di benteng itu, tapi di sebuah jebakan." X di tembok, perangkap muncul di bawah kaki =====
const T1 = { bk: wt(1, 'bukan'), bt: wt(1, 'benteng'), tp: wt(1, 'tapi'), jb: wt(1, 'jebakan') };
const TRAP1 = [P0.x + 40, MAG.ground + 150];
const cam1 = t => CK(t, [[ls(1), { x: 565, y: 915, z: 1.5 }], [T1.bk, { x: 520, y: 1080, z: .95 }, ease], [T1.tp, { x: 540, y: 1200, z: .95 }, ease], [T1.jb + .3, { x: 560, y: 1700, z: 1.05 }, ease], [ls(2), { x: 565, y: 1740, z: 1.15 }, easeIn]], 2);
SH(ls(1), ls(2), { tr: 'dissolve', xt: .2 }, (ctx, lt, t) => {
  const cam = cam1(t); maginotScene(ctx, t, cam);
  const f = EM(t, [[ls(1), 'curiga', { look: [-.6, .4] }], [T1.tp, 'cemas', { look: [.1, 1] }], [T1.jb + .45, 'kaget', { look: [.1, 1] }]], 2);
  pierreWall(ctx, t, f, CUP_REST, 0, { steam: 0 });
  const xk = inv(T1.bk, T1.bk + .2, t) * (1 - inv(T1.tp, T1.tp + .2, t)); if (xk > 0) { ctx.save(); ctx.translate(300, MAG.top + 200); const s2 = backOut(xk); ctx.scale(s2, s2); drawX(ctx, 0, 0, 160); ctx.restore(); }
  const tk = inv(T1.jb - .25, T1.jb + .05, t); if (tk > 0) { const snap = inv(T1.jb + .35, T1.jb + .45, t); ctx.save(); ctx.translate(TRAP1[0], TRAP1[1]); ctx.scale(backOut(tk), backOut(tk)); drawTrap(ctx, 0, 0, 1.1, 1 - snap); ctx.restore();
    sfxText(ctx, 'KLAK!', TRAP1[0] + 200, TRAP1[1] - 230, 90, inv(T1.jb + .35, T1.jb + .45, t), '#ffd23a', .12); if (snap > 0 && snap < 1) flash(ctx, t, T1.jb + .35, .08); }
});

// ===== 2 "Di Perang Dunia Pertama, perang macet 4 tahun di parit." dua parit, papan 1914 -> 1918, wajah bosan =====
const T2 = { mc: wt(2, 'macet'), n4: wt(2, '4'), th: wt(2, 'tahun'), pr: wt(2, 'parit') };
const cam2 = t => CK(t, [[ls(2) - .2, { x: 545, y: 1290, z: 1.0 }], [ls(2) + .6, { x: 545, y: 1300, z: 1.12 }, easeOut], [T2.th + .3, { x: 545, y: 1320, z: 1.22 }], [ls(3), { x: 600, y: 1330, z: 1.3 }, easeIn]], 2);
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam2(t); trenchBack(ctx, t, cam);
  const peekL = kf(t, [[ls(2), 1810], [ls(2) + .35, 1660, backOut], [T2.mc + .9, 1660], [T2.mc + 1.1, 1810, easeIn], [T2.th + .55, 1810], [T2.th + .8, 1665, backOut]]);
  const peekR = kf(t, [[ls(2) + .25, 1810], [ls(2) + .6, 1665, backOut], [T2.mc + .95, 1665], [T2.mc + 1.15, 1810, easeIn], [T2.th + .62, 1810], [T2.th + .9, 1660, backOut]]);
  const fl = EF(t, [[ls(2), 'curiga', { look: [.9, 0] }], [T2.mc, 'datar', { look: [.9, .1] }]], 3);
  const fr = EF(t, [[ls(2), 'curiga', { look: [.9, 0] }], [T2.mc + .07, 'datar', { look: [.9, .1] }]], 4);
  drawStick(ctx, C(PIERRE, { x: PRT.lt, y: peekL, s: 420, shadow: false, face: fl, arms: { L: [.5, -.6], R: [.5, -.6] } }));
  drawStick(ctx, C(HANS, { x: PRT.rt, y: peekR, s: 420, flip: -1, shadow: false, face: fr, arms: { L: [.5, -.6], R: [.5, -.6] } }));
  trenchFront(ctx, t);
  const yr = 1914 + Math.min(4, Math.floor(inv(T2.n4 - .1, T2.th + .45, t) * 4.999));
  drawSign(ctx, 545, PRT.ground + 120, .78, String(yr), { rot: -.06 });
  if (t > T2.th + .45 && t < T2.th + .6) glint(ctx, 545, PRT.ground - 80, 120, t, T2.th + .45);
  const db = t - (T2.mc + .95); if (db > 0 && db < .5) { burst(ctx, 545, PRT.ground + 20, 150 * backOut(clamp(db / .15)) * (1 - db), 12, '#ffd23a', 4); puff(ctx, 545, PRT.ground - 40 - db * 120, 90 + db * 80, t, '#b9ab8c', 6, 1 - db * 2); }
  sfxText(ctx, 'DUAR', 545, PRT.ground - 210, 84, inv(T2.mc + .95, T2.mc + 1.05, t) * (1 - inv(T2.mc + 1.4, T2.mc + 1.5, t)), '#fff', -.1);
  if (t > T2.th + .9) drawZzz(ctx, PRT.rt + 70, peekR - 400, .9, t);
});

// ===== 3 "Jerman lalu meracik kombo baru: tank, pesawat, dan radio, bergerak bersama." =====
const T3 = { kb: wt(3, 'kombo'), tk: wt(3, 'tank'), ps: wt(3, 'pesawat'), rd: wt(3, 'radio'), bg: wt(3, 'bergerak') };
const HX3 = 250, RX3 = 470, TS3 = .6;
const tankX3 = t => kf(t, [[ls(3), -700], [T3.tk + .1, 780, easeOut], [T3.bg, 780], [ls(4) + .3, 1000, easeIn]]);
const plane3 = t => kf(t, [[ls(3), [-500, 260, -.25]], [T3.ps - .3, [-500, 260, -.25]], [T3.ps + .45, [640, 560, .05], easeOut], [T3.bg, [680, 550, 0]], [ls(4) + .3, [1100, 500, -.05], easeIn]]);
const cam3 = t => CK(t, [[ls(3), { x: 330, y: 1070, z: 1.3 }], [ls(3) + .6, { x: 360, y: 1090, z: 1.2 }, easeOut], [T3.tk + .2, { x: 540, y: 1190, z: .9 }, ease], [T3.ps + .3, { x: 540, y: 1150, z: .86 }, ease], [T3.rd + .2, { x: 520, y: 1210, z: .95 }, ease], [ls(4), { x: 600, y: 1150, z: .9 }, easeIn]], 2);
SH(ls(3), ls(4), { tr: 'dissolve', xt: .2 }, (ctx, lt, t) => {
  const cam = cam3(t); fieldScene(ctx, t, cam);
  const tx = tankX3(t), tf = EF(t, [[ls(3), 'netral', { look: [.6, 0] }], [T3.rd + .2, 'bangga']], 5);
  drawTank(ctx, tx, LAP.ground - 70, TS3, { t, roll: tx + 700, exhaust: 1, bob: Math.sin(t * 30) * 2, face: tf, bolt: 1 });
  const pl = plane3(t); drawPlane(ctx, pl[0], pl[1] + Math.sin(t * 3) * 10, .8, { t, rot: pl[2], face: EF(t, [[ls(3), 'netral'], [T3.rd + .25, 'bangga']], 6) });
  const tip = drawRadio(ctx, RX3, LAP.ground, 1, { t, wave: inv(T3.rd, T3.rd + .2, t) });
  const fh = EM(t, [[ls(3), 'licik', { look: [.7, 0] }], [T3.tk, 'bangga'], [T3.rd, 'licik', { look: [.8, -.2] }]], 7);
  const pointT = t < T3.ps ? [tx - 80, LAP.ground - 250] : t < T3.rd ? [pl[0], pl[1] + 80] : [RX3 - 40, LAP.ground - 120];
  drawStick(ctx, C(HANS, { x: HX3, y: LAP.ground, s: 560, face: fh, headTilt: -(fh.pop || 0) * .05, arms: { L: [.3 + Math.sin(t * 1.7) * .04, -.3], R: armTo(HX3, LAP.ground, 560, 1, Math.min(pointT[0], HX3 + 260), Math.max(pointT[1], LAP.ground - 560), -1) } }));
  drawWaveLink(ctx, tip[0], tip[1], tx - 178 * TS3, LAP.ground - 70 - 555 * TS3, t, inv(T3.rd + .1, T3.rd + .5, t));
  drawWaveLink(ctx, tip[0], tip[1], pl[0] - 30, pl[1] + 40, t, inv(T3.rd + .2, T3.rd + .6, t));
  sfxText(ctx, 'KOMBO!', 760, 380, 92, inv(T3.kb, T3.kb + .15, t) * (1 - inv(T3.tk - .1, T3.tk, t)), '#ffd23a', -.1);
  glint(ctx, RX3, LAP.ground - 160, 120, t, T3.rd);
  if (t > T3.tk && t < T3.tk + .3) puff(ctx, tx + 200 * TS3, LAP.ground - 40, 70, t, '#e7dcc4', 9, 1 - (t - T3.tk) / .3);
});

// ===== 4 "Tapi Prancis sudah siap: Garis Maginot, benteng beton raksasa di perbatasan." peta: Maginot tumbuh di perbatasan =====
const T4 = { pr: wt(4, 'prancis'), gr: wt(4, 'garis'), mg: wt(4, 'maginot'), bt: wt(4, 'beton'), pb: wt(4, 'perbatasan') };
const PTOK4 = proj(4.9, 48.45), TANK5 = { from: proj(9.3, 48.95), stop: proj(8.45, 49.0) };
const cam4 = t => CK(t, [[ls(4), { x: 1200, y: 1250, z: 1.15 }], [ls(4) + .7, { x: 1220, y: 1270, z: 1.02 }, easeOut], [T4.pb, { x: 1260, y: 1330, z: .92 }, ease], [ls(5), { x: 1300, y: 1300, z: .95 }]], 1.5);
const mapNoArrow = (ctx, t, cam, o = {}) => drawMapBase(ctx, t, cam, Object.assign({ labels: { prancis: 1, belgia: 1, jerman: 1, inggris: 1 } }, o));
SH(ls(4), ls(5), {}, (ctx, lt, t) => {
  const cam = cam4(t); mapNoArrow(ctx, t, cam, { maginotK: ease(inv(T4.gr, T4.pb + .3, t)), trees: 1 });
  const pk = inv(T4.pr - .05, T4.pr + .2, t); if (pk > 0) { ctx.save(); ctx.translate(PTOK4[0], PTOK4[1]); const s2 = backOut(pk); ctx.scale(s2, s2); mapSoldier(ctx, 0, 0, 330, 'fr', EF(t, [[ls(4), 'bangga', { look: [.9, -.1] }]], 10), { t }); ctx.restore(); }
  for (let i = 1; i < MAGINOT.length; i += 2) glint(ctx, MAGINOT[i][0], MAGINOT[i][1] - 30, 90, t, T4.bt + i * .06);
  popText(ctx, 'GARIS MAGINOT', MAGINOT[2][0] - 60, MAGINOT[2][1] - 170, 64, inv(T4.mg - .05, T4.mg + .15, t), '#fff', INK, -.06);
});

// ===== 5 "Jadi Jerman tidak mau menabraknya." tank kecil mendekat, rem mendadak, berkeringat, berbalik melirik ke utara =====
const T5 = { jm: wt(5, 'jerman'), td: wt(5, 'tidak'), mn: wt(5, 'menabraknya') };
const tank5 = t => kf(t, [[ls(5), TANK5.from[0] + 150], [T5.td + .1, TANK5.stop[0], easeOut]]);
SH(ls(5), ls(6), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(5), { x: 1300, y: 1300, z: .95 }], [T5.td + .2, { x: 1420, y: 1230, z: 1.2 }, ease], [ls(6), { x: 1430, y: 1100, z: 1.3 }, easeIn]], 1.5);
  mapNoArrow(ctx, t, cam, { labels: { prancis: 1, belgia: 1, jerman: 1, inggris: 1, maginot: 1 } });
  mapSoldier(ctx, PTOK4[0], PTOK4[1], 330, 'fr', EF(t, [[ls(5), 'bangga', { look: [.9, -.1] }], [T5.mn + .2, 'curiga', { look: [.9, -.6] }]], 11), { t });
  const x = tank5(t), dir = t < T5.mn + .25 ? -1 : 1, look = t > T5.mn + .25;
  const tf = EF(t, [[ls(5), 'licik'], [T5.td + .1, 'cemas'], [T5.mn + .25, 'curiga', { look: [.3, -1] }]], 12);
  drawTank(ctx, x, TANK5.stop[1] + 30, .32, { t, roll: x * 2, dir, face: tf, bolt: 1, bob: t < T5.td + .1 ? Math.sin(t * 30) * 2 : 0 });
  const sk = t - (T5.td + .1); if (sk > 0 && sk < .4) for (let i = 0; i < 4; i++) puff(ctx, x + 120 + i * 30, TANK5.stop[1] + 20, 26, t, '#e7dcc4', 50 + i, 1 - sk / .4);
  sfxText(ctx, 'CIIIT', x + 40, TANK5.stop[1] - 230, 70, inv(T5.td + .05, T5.td + .15, t) * (1 - inv(T5.mn, T5.mn + .1, t)), '#fff', .08);
  if (look) { const q = inv(T5.mn + .25, T5.mn + .5, t); qmark(ctx, x + 40, TANK5.stop[1] - 260 + Math.sin(t * 5) * 6, 120 * backOut(q), .1); }
});

// ===== 6 ANALOGI TINJU: kanan memancing (atas) -> lawan menangkis -> kiri menghantam dari samping (bawah) =====
// Arah dibuat sama dengan peta: penyerang di KANAN layar (Jerman di timur), pukulan ATAS = utara (Belgia), pukulan BAWAH = selatan (Ardennes).
const T6 = { kn: wt(6, 'kanan'), mc: wt(6, 'memancing'), lw: wt(6, 'lawan'), kr: wt(6, 'kiri'), mh: wt(6, 'menghantam'), sm: wt(6, 'samping') };
T6.hit = T6.mh + .25;
const PX6 = 380, HX6 = 720, GY6 = 1500, S6 = 600;
const cam6 = t => CK(t, [[ls(6), { x: 560, y: 1080, z: 1.15 }], [ls(6) + .7, { x: 555, y: 1070, z: 1.28 }, easeOut], [T6.lw, { x: 520, y: 1040, z: 1.32 }], [T6.hit, { x: 500, y: 1110, z: 1.42 }, ease], [ls(7), { x: 480, y: 1120, z: 1.5 }, easeIn]], 2);
SH(ls(6), ls(7), { tr: 'dissolve', xt: .2 }, (ctx, lt, t) => {
  let cam = cam6(t); const dh = t - T6.hit; if (dh > 0 && dh < .4) { const s = shake(t * 3, 22 * (1 - dh / .4), 3); cam = Object.assign({}, cam, { x: cam.x + s[0], y: cam.y + s[1] }); }
  ringScene(ctx, t, cam);
  // Hans: maju sedikit saat hook
  const lunge = kf(t, [[T6.kr, 0], [T6.hit - .05, -70, easeIn], [T6.hit + .5, -40, easeOut]]);
  const hx = HX6 + lunge, bob = Math.sin(t * 8) * .006;
  const gR = kf(t, [[0, [610, 1010]], [T6.kn, [610, 1010]], [T6.mc + .05, [505, 965], easeOut], [T6.lw + .2, [520, 975]], [T6.kr, [615, 1015], ease]]);
  const gL = t < T6.kr ? [hx + 60, 1080] : t < T6.mh ? kf(t, [[T6.kr, [hx + 60, 1080]], [T6.mh, [hx + 120, 1230], easeOut]]) : bezP([hx + 120, 1230], [hx - 40, 1400], [PX6 + 95, 1250], easeIn(inv(T6.mh, T6.hit, t)));
  const hitP = t > T6.hit ? 1 : 0, recoil = dh > 0 ? Math.exp(-dh * 5) : 0;
  // Pierre: tangkis ke atas (tertipu), lalu kena di samping
  const pG = t < T6.mc ? [[460, 1030], [445, 1090]] : [[kf(t, [[T6.mc, 460], [T6.mc + .2, 470, easeOut]]), kf(t, [[T6.mc, 1030], [T6.mc + .2, 945, easeOut]])], [kf(t, [[T6.mc, 445], [T6.mc + .2, 430, easeOut]]), kf(t, [[T6.mc, 1090], [T6.mc + .2, 975, easeOut]])]];
  const fp = EM(t, [[0, 'curiga', { look: [.8, 0] }], [T6.mc, 'kaget', { look: [.8, -.3] }], [T6.lw + .4, 'bangga', { look: [.8, -.2] }], [T6.hit, 'meringis']], 1);
  drawStick(ctx, C(PIERRE, { x: PX6 - 30 * recoil * hitP, y: GY6, s: S6, armLen: 1.5, face: fp, lean: -.14 * recoil * hitP, squash: 1 - .06 * recoil * hitP, headTilt: -(fp.pop || 0) * .05, legs: { L: [.16, -.1], R: [.16, -.1] },
    arms: { L: reach(PX6, GY6, S6, 1, pG[1][0], pG[1][1], -1), R: reach(PX6, GY6, S6, 1, pG[0][0], pG[0][1], -1) } }));
  drawGlove(ctx, pG[1][0], pG[1][1], .5, -.4, MPC.blue); drawGlove(ctx, pG[0][0], pG[0][1], .5, -.2, MPC.blue);
  const fh = EM(t, [[0, 'licik', { look: [-.8, 0] }], [T6.kr, 'ngeden', { look: [-.8, .3] }], [T6.hit + .1, 'bangga']], 2);
  drawStick(ctx, C(HANS, { x: hx, y: GY6 + bob, s: S6, flip: -1, armLen: 1.5, face: fh, lean: lunge * .0015, headTilt: -(fh.pop || 0) * .05, legs: { L: [.18, -.1], R: [.18, -.1] },
    arms: { R: reach(hx, GY6, S6, -1, gR[0], gR[1], -1), L: reach(hx, GY6, S6, -1, gL[0], gL[1], 1) } }));
  const lk = inv(T6.kn - .05, T6.kn + .15, t), lki = inv(T6.kr - .05, T6.kr + .15, t);
  drawGlove(ctx, gR[0], gR[1], .58, Math.PI + .25, MPC.red, lk > 0 ? 'KANAN' : null);
  drawGlove(ctx, gL[0], gL[1], .58, t < T6.mh ? Math.PI * .75 : Math.PI, MPC.red, lki > 0 ? 'KIRI' : null, dh > 0 && dh < .15 ? 1 - dh / .15 : 0);
  if (dh > 0 && dh < .3) burst(ctx, PX6 + 90, 1250, 150 * backOut(clamp(dh / .1)) * (1 - dh), 12, '#ffd23a', 3);
  sfxText(ctx, 'BUK!', PX6 + 60, 1130, 96, inv(T6.hit, T6.hit + .1, t) * (1 - inv(ls(7) - .2, ls(7), t)), '#ffd23a', -.15);
  if (dh > 0) for (let i = 0; i < 3; i++) star5(ctx, PX6 + Math.cos(t * 9 + i * 2.1) * 90, 820 + Math.sin(t * 9 + i * 2.1) * 26, 18, t * 4, '#ffe14d');
  flash(ctx, t, T6.hit, .08);
});

// ===== peta: helper tentara Sekutu (kelompok) + tank Jerman di sepanjang panah =====
const GRP = [[-130, -70, 'fr'], [-40, -90, 'fr'], [50, -80, 'uk'], [140, -60, 'uk'], [-170, 20, 'fr'], [-80, 10, 'fr'], [10, 0, 'fr'], [100, 15, 'uk'], [190, 30, 'uk'], [-120, 100, 'fr'], [-30, 95, 'fr'], [60, 100, 'fr']];
function alliesAt(ctx, cx, cy, t, face, o = {}) {
  const sp = o.spread || 1, n = o.n == null ? GRP.length : o.n;
  GRP.slice(0, n).forEach(([dx, dy, side], i) => { const j = o.run ? Math.abs(Math.sin(t * 14 + i)) * -10 : Math.sin(t * 2 + i) * 3; mapSoldier(ctx, cx + dx * sp, cy + dy * sp + j, o.s || 110, side, face, { t }); });
  if (o.run) for (let i = 0; i < 4; i++) line(ctx, cx - 280 - i * 10, cy - 60 + i * 40, cx - 200 - i * 10, cy - 70 + i * 40, 7, 'rgba(255,255,255,.8)');
}
const SPK = smoothPts(RUTE.kanan), SPL = smoothPts(RUTE.kiri), SPA = smoothPts(RUTE.sekutu);
function tanksOn(ctx, sp, k, t, face, n = 3, gap = .1) {
  for (let i = n - 1; i >= 0; i--) { const q = k - .06 - i * gap; if (q <= 0) continue; const p = polyAt(sp, q); drawTank(ctx, p.x, p.y + 26, .22, { t, roll: q * 4000, dir: Math.cos(p.a) < 0 ? -1 : 1, face, bolt: 1 }); }
}
// pecahan panjang rute "kiri" sampai titik Sedan (indeks 3) -> panah berhenti di Sedan tepat saat kata "Sedan"
const KSEDAN = (() => { let tot = 0, at = 0; for (let i = 0; i < RUTE.kiri.length - 1; i++) { const l = Math.hypot(RUTE.kiri[i + 1][0] - RUTE.kiri[i][0], RUTE.kiri[i + 1][1] - RUTE.kiri[i][1]); if (i < 3) at += l; tot += l; } return at / tot; })();
const T7 = { m: wt(7, 'mei'), tg: wt(7, 'tangan'), bg: wt(7, 'belgia') };
const T8 = { bg: wt(8, 'bergegas'), ut: wt(8, 'utara'), mn: wt(8, 'menahannya') };
const T10 = { kr: wt(10, 'kirinya'), tk: wt(10, 'tank'), dd: wt(10, 'diamdiam'), ar: wt(10, 'ardennes'), mu: wt(10, 'mustahil') };
const T11 = { se: wt(11, 'sedan'), ba: wt(11, 'barat'), la: wt(11, 'laut') };
const T12 = { n10: wt(12, '10'), pt: wt(12, 'pintunya'), tt: wt(12, 'tertutup') };
const T13 = { tk: wt(13, 'terkepung'), pg: wt(13, 'punggungnya'), la: wt(13, 'laut') };
const T14 = { n: wt(14, '338'), kb: wt(14, 'kabur'), dk: wt(14, 'dunkirk'), tk: wt(14, 'tank'), dt: wt(14, 'ditinggal') };
const kKanan = t => easeOut(inv(T7.tg, T7.bg + .4, t));
const kAllies = t => ease(inv(T8.bg - .5, T8.ut + .6, t));
const kKiri = t => t < T11.se ? KSEDAN * ease(inv(T10.dd, T11.se, t)) : lerp(KSEDAN, 1, easeIn(inv(T11.se + .2, T11.la, t)));
const POCK0 = { c: proj(3.4, 50.75), rx: 360, ry: 230 }, POCK1 = { c: proj(2.75, 50.95), rx: 230, ry: 150 };
const pock = t => { const p = ease(inv(T13.tk, T13.la + .6, t)); return { c: [lerp(POCK0.c[0], POCK1.c[0], p), lerp(POCK0.c[1], POCK1.c[1], p)], rx: lerp(POCK0.rx, POCK1.rx, p), ry: lerp(POCK0.ry, POCK1.ry, p) }; };
const alliesPos = t => { const a = polyAt(SPA, kAllies(t)), p = ease(inv(T13.tk, T13.la + .6, t)), d = POCK1.c; return [lerp(a.x, d[0] + 90, p), lerp(a.y, d[1] + 60, p)]; };
function mapLayer(ctx, t, cam, o = {}) {
  drawMapBase(ctx, t, cam, { labels: Object.assign({ prancis: 1, belgia: 1, jerman: 1, inggris: 1 }, o.labels || {}) });
  drawArrow(ctx, RUTE.kanan, kKanan(t), { head: 'glove', label: 'KANAN', t, gs: .85 });
  drawArrow(ctx, RUTE.kiri, kKiri(t), { head: 'glove', label: 'KIRI', t, gs: .85, punch: o.punch || 0 });
}
function heartbeat(ctx, t, a) {
  if (a <= 0) return; const b = Math.pow(Math.max(0, Math.sin(t * 7.5)), 6);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createRadialGradient(540, 900, 380, 540, 960, 1150); g.addColorStop(0, 'rgba(200,0,20,0)'); g.addColorStop(1, `rgba(200,0,20,${a * (.25 + .25 * b)})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}

// ===== 7-9 UMPAN: panah KANAN masuk Belgia, Sekutu bergegas ke utara, Jerman menyeringai =====
const camA = t => CK(t, [[ls(7) - .2, { x: 930, y: 800, z: .8 }], [ls(7) + .8, { x: 910, y: 800, z: .9 }, easeOut], [T7.bg + .2, { x: 860, y: 790, z: .95 }, ease], [T8.ut, { x: 760, y: 780, z: 1.0 }, ease], [ls(9) + .3, { x: 1040, y: 880, z: .92 }, ease], [ls(10), { x: 1050, y: 900, z: .95 }, easeIn]], 1.5);
SH(ls(7), ls(10), {}, (ctx, lt, t) => {
  const cam = camA(t); mapLayer(ctx, t, cam);
  tanksOn(ctx, SPK, kKanan(t), t, EF(t, [[0, 'licik']], 3));
  const ap = alliesAt; const pos = alliesPos(t), moving = t > T8.bg - .5 && t < T8.ut + .6;
  ap(ctx, pos[0], pos[1], t, EF(t, [[ls(7), 'curiga', { look: [.8, -.3] }], [T8.bg, 'ngeden', { look: [1, -.3] }], [T8.mn + .1, 'bangga', { look: [.9, -.2] }]], 4), { run: moving });
  popText(ctx, '10 MEI 1940', ...proj(3.6, 52.15), 84, inv(T7.m - .1, T7.m + .15, t) * (1 - inv(ls(8), ls(8) + .2, t)), '#fff', INK, -.06);
  // "Persis seperti yang Jerman mau": wajah Jerman besar menyeringai di wilayah Jerman
  const hk = inv(ls(9), ls(9) + .25, t);
  if (hk > 0) { const p = proj(7.25, 50.15); ctx.save(); ctx.translate(p[0], p[1]); const s2 = backOut(hk); ctx.scale(s2, s2); mapSoldier(ctx, 0, 0, 400, 'de', EF(t, [[ls(9), 'licik', { look: [-.9, -.2] }]], 5), { t }); ctx.restore(); glint(ctx, p[0] + 80, p[1] - 140, 120, t, ls(9) + .3); }
});

// ===== 10-11 SABIT: tank menyelinap di hutan Ardennes -> tembus Sedan -> sapuan ke barat sampai laut =====
const camB = t => { const tip = polyAt(SPL, Math.max(.02, kKiri(t))); return CK(t, [[ls(10), { x: 1050, y: 900, z: .95 }], [T10.ar, { x: 1040, y: 960, z: 1.1 }, ease], [T11.se, { x: 900, y: 1000, z: 1.1 }, ease], [T11.la, { x: Math.max(440, tip.x + 150), y: 930, z: .95 }, ease], [ls(12), { x: 480, y: 880, z: .95 }, easeIn]], 1.5); };
SH(ls(10), ls(12), {}, (ctx, lt, t) => {
  const cam = camB(t); mapLayer(ctx, t, cam, { labels: { sedan: inv(T11.se - .1, T11.se + .15, t) } });
  const k = kKiri(t);
  tanksOn(ctx, SPL, k, t, EF(t, [[0, 'licik'], [T11.la, 'bangga']], 6), 3, .07);
  // tank "diam-diam": pohon Ardennes digambar lagi DI ATAS tank selama di hutan
  const r2 = rng(9); for (let i = 0; i < 26; i++) { const lo = 4.75 + r2() * 1.45, la = 49.55 + r2() * .8, sc = .2 + r2() * .05; if (i % 2 && t < T11.se) { const [x, y] = proj(lo, la); drawPine(ctx, x, y + 40, sc, { col: PRG.pine }); } }
  const pos = alliesPos(t); alliesAt(ctx, pos[0], pos[1], t, EF(t, [[0, 'bangga', { look: [.9, -.2] }], [T11.la, 'kaget', { look: [-.6, .6] }]], 7));
  sfxText(ctx, 'SSST', TEMPAT.ardennes[0] + 60, TEMPAT.ardennes[1] - 170, 70, inv(T10.dd, T10.dd + .15, t) * (1 - inv(T10.mu, T10.mu + .1, t)), '#ffd23a', -.1);
  const ds = t - T11.se; if (ds > 0 && ds < .4) burst(ctx, TEMPAT.sedan[0], TEMPAT.sedan[1], 130 * backOut(clamp(ds / .12)) * (1 - ds), 12, '#ffd23a', 4);
  const dl = t - T11.la; if (dl > 0) { const tip = polyAt(SPL, 1); for (let i = 0; i < 7; i++) { const a = -Math.PI * (.2 + .6 * i / 6), v = 260 * Math.min(dl, .5); circle(ctx, tip.x - 40 + Math.cos(a) * v, tip.y + Math.sin(a) * v + 500 * Math.min(dl, .5) ** 2, 12); fillStroke(ctx, '#d8f1ff', 4); } sfxText(ctx, 'BYUR', tip.x - 60, tip.y - 150, 76, inv(T11.la, T11.la + .1, t), '#fff', -.12); }
});

// ===== 12-13 KANTONG: "10 hari" -> pintu tertutup (BRAK) -> lingkaran merah menyempit, Sekutu terdesak ke laut =====
const camC = t => { const p = pock(t); return CK(t, [[ls(12), { x: 480, y: 880, z: .95 }], [T12.tt, { x: 640, y: 820, z: .85 }, ease], [T13.tk + .3, { x: p.c[0] + 40, y: p.c[1] + 60, z: 1.0 }, ease], [ls(14), { x: POCK1.c[0], y: POCK1.c[1] + 60, z: 1.25 }, easeIn]], 1.5); };
SH(ls(12), ls(14), {}, (ctx, lt, t) => {
  const cam = camC(t), dt = t - T12.tt;
  mapLayer(ctx, t, cam, { punch: dt > 0 && dt < .2 ? 1 - dt / .2 : 0, labels: { sedan: 1, dunkirk: inv(T13.pg, T13.pg + .2, t) } });
  const p = pock(t), pa = inv(T12.tt, T12.tt + .3, t);
  drawPocket(ctx, p.c[0], p.c[1], p.rx, p.ry, t, pa);
  // cincin tank Jerman yang ikut menyempit (sisi laut dibiarkan kosong: punggung menempel ke laut)
  const ra = inv(T13.tk - .2, T13.tk + .3, t);
  if (ra > 0) for (let i = 0; i < 7; i++) { const a = -1.25 + i * .5; const x = p.c[0] + Math.cos(a) * (p.rx + 90), y = p.c[1] + Math.sin(a) * (p.ry + 80); if (y < 380 && x < 500) continue; ctx.save(); ctx.globalAlpha *= ra; drawTank(ctx, x, y + 24, .22, { t, dir: Math.cos(a) > 0 ? -1 : 1, face: EF(t, [[0, 'licik']], 20 + i), bolt: 1 }); ctx.restore(); }
  const pos = alliesPos(t);
  alliesAt(ctx, pos[0], pos[1], t, EF(t, [[ls(12), 'kaget', { look: [-.6, .6] }], [T12.tt + .1, 'cemas', { look: [.8, .3] }], [T13.pg, 'sadar', { look: [-.9, -.6] }]], 8), { spread: lerp(1, .78, ease(inv(T13.tk, T13.la, t))) });
  popText(ctx, '10 HARI', ...proj(1.2, 49.55), 90, inv(T12.n10 - .05, T12.n10 + .15, t) * (1 - inv(T12.tt + .6, T12.tt + .8, t)), '#ffd23a', INK, -.08);
  if (dt > 0) { const tip = polyAt(SPL, 1); sfxText(ctx, 'BRAK!', tip.x + 30, tip.y + 140, 96, inv(T12.tt, T12.tt + .1, t) * (1 - inv(T13.tk, T13.tk + .15, t)), '#fff', .1); }
  flash(ctx, t, T12.tt, .08);
  heartbeat(ctx, t, inv(T13.tk - .3, T13.tk + .3, t));
});

// ===== 14 DUNKIRK: perahu menyeberang ke Inggris, tank & meriam Sekutu ditinggal di pantai =====
const camD = t => CK(t, [[ls(14), { x: POCK1.c[0], y: POCK1.c[1] + 60, z: 1.25 }], [T14.kb + .3, { x: 330, y: 690, z: 1.3 }, ease], [T14.dt, { x: 370, y: 710, z: 1.38 }, ease], [ls(15), { x: 380, y: 705, z: 1.45 }]], 1.5);
SH(ls(14), ls(15), {}, (ctx, lt, t) => {
  const cam = camD(t); mapLayer(ctx, t, cam, { labels: { sedan: 1, dunkirk: 1 } });
  const p = pock(t); drawPocket(ctx, p.c[0], p.c[1], p.rx, p.ry, t, 1 - .5 * inv(T14.kb, T14.kb + .8, t));
  // tentara yang tersisa makin sedikit saat perahu berangkat
  const left = Math.round(lerp(12, 4, inv(T14.kb, T14.dt, t)));
  const pos = alliesPos(t); alliesAt(ctx, pos[0], pos[1], t, EF(t, [[ls(14), 'cemas', { look: [-.9, -.4] }], [T14.kb + .2, 'lega']], 9), { n: left, spread: .78 });
  // perahu bolak-balik Dunkirk -> Dover
  const bk = inv(T14.kb - .3, T14.kb, t);
  if (bk > 0) for (let i = 0; i < 4; i++) { const q = ((t - T14.kb) * .45 + i / 4) % 1, a = TEMPAT.dunkirk, b = TEMPAT.dover; const x = lerp(a[0] - 30, b[0] + 30, q), y = lerp(a[1] - 40, b[1] + 50, q) - Math.sin(q * Math.PI) * 60; ctx.save(); ctx.globalAlpha *= bk * Math.min(1, Math.sin(q * Math.PI) * 4); drawBoat(ctx, x, y, .6, { t, crew: 3 }); ctx.restore(); }
  popText(ctx, '338 RIBU+', TEMPAT.dover[0] + 60, TEMPAT.dover[1] - 170, 72, inv(T14.n - .05, T14.n + .15, t), '#fff', INK, -.06);
  // ditinggal di pantai: tank Sekutu (biru keabuan) + meriam, wajah lesu
  const dk = inv(T14.tk - .1, T14.tk + .2, t);
  if (dk > 0) { ctx.save(); ctx.globalAlpha *= dk; drawTank(ctx, TEMPAT.dunkirk[0] + 230, TEMPAT.dunkirk[1] + 150, .22, { t, col: '#8293b3', face: EF(t, [[0, { eyes: 'half', mouth: 'frown' }]], 30) }); drawTank(ctx, TEMPAT.dunkirk[0] + 110, TEMPAT.dunkirk[1] + 200, .19, { t, col: '#8293b3', dir: -1, face: EF(t, [[0, { eyes: 'half', mouth: 'frown' }]], 31) }); ctx.restore(); }
  sfxText(ctx, 'DITINGGAL', TEMPAT.dunkirk[0] + 190, TEMPAT.dunkirk[1] + 300, 54, inv(T14.dt, T14.dt + .12, t), '#fff', .06);
});

// ===== 15 "Tanpa pasukan terbaiknya, Prancis runtuh. Paris jatuh tanggal 14 Juni." peta zoom out, Prancis memudar ke abu-hijau =====
const T15 = { tp: wt(15, 'tanpa'), pr: wt(15, 'prancis'), rt: wt(15, 'runtuh'), pa: wt(15, 'paris'), ja: wt(15, 'jatuh'), n14: wt(15, '14'), ju: wt(15, 'juni') };
const SOUTH = [[[1.8, 50.0], [1.7, 49.2], [1.5, 48.2]], [[3.0, 49.9], [2.65, 49.4], [2.5, 49.12]], [[4.4, 49.6], [4.3, 48.8], [4.0, 47.9]]].map(r => r.map(p => proj(...p)));
const fallY = t => lerp(880, 1360, ease(inv(T15.tp, T15.ja, t))) + lerp(0, 900, ease(inv(T15.ju, ls(16) + .3, t)));
const cam15 = t => CK(t, [[ls(15), { x: 380, y: 705, z: 1.45 }], [T15.pr, { x: 560, y: 1040, z: .78 }, ease], [T15.pa, { x: 470, y: 1220, z: .85 }, ease], [T15.ju, { x: 440, y: 1280, z: 1.0 }, ease], [ls(16), { x: 430, y: 1300, z: 1.1 }, easeIn]], 1.5);
SH(ls(15), ls(16), { tr: 'dissolve', xt: .2 }, (ctx, lt, t) => {
  const cam = cam15(t); mapLayer(ctx, t, cam, { labels: { sedan: 1, dunkirk: 1, prancis: 1 - inv(T15.tp, T15.tp + .3, t) } });
  franceFall(ctx, fallY(t), inv(T15.tp, T15.tp + .3, t));
  SOUTH.forEach((r, i) => drawArrow(ctx, r, easeOut(inv(T15.tp + i * .15, T15.ja + i * .1, t)), { head: 'tri', t, w: 44 }));
  const pa = inv(T15.pa - .1, T15.pa + .15, t); if (pa > 0) { ctx.save(); ctx.globalAlpha *= pa; circle(ctx, TEMPAT.paris[0], TEMPAT.paris[1], 22); fillStroke(ctx, '#fff', 8); text(ctx, 'PARIS', TEMPAT.paris[0] - 150, TEMPAT.paris[1] + 10, 64, '#fff', INK, 13); ctx.restore(); }
  const pg = [TEMPAT.paris[0] - 70, TEMPAT.paris[1] + 150];
  mapSoldier(ctx, pg[0], pg[1], 190, 'fr', EF(t, [[ls(15), 'cemas', { look: [-.2, -1] }], [T15.ja + .1, 'meringis']], 13), { t });
  const jk = t - T15.ja; if (jk > 0 && jk < .35) burst(ctx, TEMPAT.paris[0], TEMPAT.paris[1], 120 * backOut(clamp(jk / .1)) * (1 - jk), 12, '#ffd23a', 6);
  popText(ctx, '14 JUNI 1940', TEMPAT.paris[0] - 40, TEMPAT.paris[1] - 190, 70, inv(T15.n14 - .05, T15.n14 + .15, t), '#fff', INK, -.06);
});

// ===== 16 "Prancis menyerah di gerbong kereta yang sama, tempat Jerman dulu menyerah di Perang Dunia Pertama." 1940 -> kilas balik 1918 (peran tertukar) =====
const T16 = { mn: wt(16, 'menyerah'), gb: wt(16, 'gerbong'), sm: wt(16, 'sama'), tp: wt(16, 'tempat'), dl: wt(16, 'dulu'), pt: wt(16, 'pertama') };
const SIGNX = 360, BOSSX = 760, GY16 = 1600, S16 = 520;
SH(ls(16), ls(17), { tr: 'whip' }, (ctx, lt, t) => {
  const fb = t >= T16.tp;   // kilas balik 1918
  const cam = CK(t, [[ls(16), { x: 540, y: 1150, z: .82 }], [T16.gb, { x: 540, y: 1100, z: .9 }, ease], [T16.tp - .05, { x: 540, y: 1100, z: .94 }], [T16.tp + .3, { x: 540, y: 1150, z: .86 }, easeOut], [ls(17), { x: 540, y: 1180, z: .95 }]], 1.5);
  clearingScene(ctx, t, cam, { sepia: fb });
  drawCarriage(ctx, 540, 1180, .78, { year: fb ? '1918' : '1940' });
  const signer = fb ? HANS : PIERRE, boss = fb ? PIERRE : HANS, t0 = fb ? T16.tp : ls(16);
  const sk = clamp((t - t0 - .3) / 1.2), hand = [SIGNX + 120 + Math.sin(t * 14) * 18 * (sk > 0 && sk < 1), GY16 - 300];
  drawStick(ctx, C(signer, { x: SIGNX, y: GY16, s: S16, face: EF(t, [[t0, SEDIH, { look: [.4, .8] }]], fb ? 14 : 15), headTilt: .12, arms: { L: idleArms(t, 1).L, R: armTo(SIGNX, GY16, S16, 1, hand[0], hand[1], -1) } }));
  drawDesk(ctx, SIGNX + 120, GY16 + 10, .9, { sign: sk });
  drawStick(ctx, C(boss, { x: BOSSX, y: GY16, s: S16, flip: -1, face: EF(t, [[t0, 'sombong', { look: [.7, .3] }]], fb ? 16 : 17), arms: { L: [2.5, .9], R: [2.5, .9] } }));
  glint(ctx, 540, 830, 150, t, T16.gb);
  if (fb) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(150,110,50,.22)'; ctx.fillRect(0, 0, W, H); ctx.restore(); popText(ctx, 'DULU: 1918', 540, 360, 80, inv(T16.tp, T16.tp + .2, t), '#ffe9b0', INK, -.05); }
  else popText(ctx, 'SEKARANG: 1940', 540, 360, 74, inv(ls(16), ls(16) + .2, t) * (1 - inv(T16.tp - .1, T16.tp, t)), '#fff', INK, -.05);
  flash(ctx, t, T16.tp, .12);
});

// ===== 17 "Pelajarannya: benteng terkuat pun percuma, kalau musuh tidak datang dari depan." Pierre meneropong ke depan, tank lewat di belakang =====
const T17 = { bt: wt(17, 'benteng'), pc: wt(17, 'percuma'), ms: wt(17, 'musuh'), dt: wt(17, 'datang'), dp: wt(17, 'depan') };
SH(ls(17), ls(18), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(17), { x: 540, y: 1000, z: .9 }], [T17.ms, { x: 520, y: 960, z: .8 }, ease], [T17.dp, { x: 540, y: 930, z: 1.0 }, ease], [ls(18), { x: 545, y: 920, z: 1.1 }, easeIn]], 2);
  const tx = kf(t, [[T17.ms - .4, 1500], [ls(18), -300]], x => x);
  maginotScene(ctx, t, cam, { behind: c => drawTank(c, tx, 905, .32, { t, roll: -tx * 2, dir: -1, bolt: 1, exhaust: 1, crew: cc => drawStick(cc, C(HANS, { x: -70, y: -120, s: 300, shadow: false, face: EF(t, [[0, 'licik', { look: [-.9, 0] }]], 18), arms: { L: [.2, -.1], R: [.2, -.1] } })) }) });
  const f = EM(t, [[ls(17), 'bangga', { look: [0, .3] }], [T17.dp + .1, 'sadar', { look: [-.9, -.7] }]], 19);
  const bin = [HEAD0[0] + 6, HEAD0[1] + 4];
  pierreWall(ctx, t, f, [bin[0] + 40, bin[1] + 40], 0, { binoc: t < T17.dp + .1 ? bin : null, steam: 0, armL: t < T17.dp + .1 ? armTo(P0.x, P0.y, P0.s, 1, bin[0] - 50, bin[1] + 20, 1) : null });
  const pk = inv(T17.pc, T17.pc + .2, t) * (1 - inv(T17.ms, T17.ms + .2, t)); if (pk > 0) { ctx.save(); ctx.translate(820, MAG.top + 220); ctx.scale(backOut(pk), backOut(pk)); drawX(ctx, 0, 0, 130); ctx.restore(); }
  if (t > T17.dp + .1) qmark(ctx, P0.x - 170, HEAD0[1] - 120 + Math.sin(t * 5) * 6, 130 * backOut(inv(T17.dp + .1, T17.dp + .35, t)), -.2);
});

// ===== 18 "Fakta sejarah apa lagi yang bikin kamu penasaran?" =====
SH(ls(18), ls(19), { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(18), { x: 540, y: 1080, z: 1.05 }], [ls(19), { x: 540, y: 1060, z: 1.15 }]], 2);
  fieldScene(ctx, t, cam);
  drawStick(ctx, C(PIERRE, { x: 330, y: LAP.ground, s: 560, face: EF(t, [[ls(18), 'curiga', { look: [.4, -.5] }]], 20), arms: { L: [2.3, .6], R: [.3, -.3] }, headTilt: .08 }));
  drawStick(ctx, C(HANS, { x: 750, y: LAP.ground, s: 560, flip: -1, face: EF(t, [[ls(18), 'curiga', { look: [.4, -.5] }]], 21), arms: { L: [2.3, .6], R: [.3, -.3] }, headTilt: .08 }));
  [[540, 520, 0, 230], [230, 640, .2, 150], [860, 620, .4, 150]].forEach(([x, y, d, sz], i) => { const k = inv(ls(18) + d, ls(18) + d + .25, t); if (k > 0) qmark(ctx, x, y + Math.sin(t * 4 + i) * 8, sz * backOut(k), (i - 1) * .25); });
});

// ===== 19 CTA + loop ke frame 0 (Pierre ngopi di atas benteng) =====
const LOOP0 = ENDT - .6;
SH(ls(19), ENDT, {}, (ctx, lt, t) => {
  const cam = CK(t, [[ls(19), { x: 560, y: 1000, z: 1.0 }], [ls(19) + .5, { x: 555, y: 990, z: .96 }, easeOut], [LOOP0, { x: 560, y: 960, z: 1.05 }], [ENDT, CAM_F0, ease]], 2);
  maginotScene(ctx, t, cam);
  const lp = inv(LOOP0, ENDT, t);
  pierreWall(ctx, t, EF(t, [[ls(19), 'bangga'], [LOOP0, { eyes: 'happy', mouth: 'smile' }]], 22), lp > 0 ? [lerp(CUP_REST[0], CUP_MOUTH[0], ease(lp)), lerp(CUP_REST[1], CUP_MOUTH[1], ease(lp))] : CUP_REST, lerp(0, -.75, ease(lp)), { tilt: -.12 * lp });
  const tS = wt(19, 'subscribe'), d = t - tS, k = inv(ls(19) + .05, ls(19) + .45, t) * (1 - inv(LOOP0 - .1, LOOP0 + .2, t)), sc = backOut(k);
  if (k > 0) { const subbed = d > .35, press = d > .2 && d < .45 ? 1 : 0;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(540, 560); ctx.scale(sc, sc); ctx.translate(-540, -560);
    drawSubBanner(ctx, 540, 560, .98, { subbed, press, ring: subbed ? Math.sin((d - .35) * 22) * .35 * Math.exp(-(d - .35) * 2) : 0 }); ctx.restore();
    if (subbed) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const r = rng(4); for (let i = 0; i < 46; i++) { const x0 = r() * 1080, v = 300 + r() * 500, ph = r() * TAU, d0 = r() * .6, tt = d - .35 - d0; if (tt < 0) continue; ctx.save(); ctx.translate(x0 + Math.sin(tt * 3 + ph) * 40, -60 + tt * v); ctx.rotate(tt * 6 + ph); ctx.fillStyle = ['#ff5a3c', '#ffd23a', '#2cb35e', '#4a8cff', '#ff6fa8'][i % 5]; ctx.fillRect(-12, -7, 24, 14); ctx.restore(); } ctx.restore(); } }
});
