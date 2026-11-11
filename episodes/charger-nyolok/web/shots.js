// ---------- Mitos Rumahan: "Charger nyolok tanpa HP bikin tagihan bengkak?" (45 dtk) ----------
// Aturan v5: kamera selalu bergerak, transisi portal/spin/match/dissolve, ikuti BENDA, ekspresi per kata, benda berwajah.
// Aturan v6: SEMUA waktu diambil dari kata (wt), aset = satu fungsi (env_listrik.js), tata letak RUANG/DAPUR terkunci.
const SHOTS = [];
const IBU = { cols: ['#ec5b86', '#ec5b86'], hat: 'chef', belt: false, blush: true };
const BUDI = { cols: ['#2f9b5a', '#2f9b5a'], hat: 'tuft', hatCol: INK, belt: false };
const C = (b, e) => Object.assign({}, b, e);
const LN = {}; WORDS.forEach(w => { (LN[w.line] = LN[w.line] || []).push(w); });
const ls = i => LN[i][0].s;
const nrm = s => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const fw = (i, str) => { const w = LN[i].find(w => nrm(w.w) === str); if (!w) throw new Error('kata tidak ada di baris ' + i + ': ' + str); return w.s; };
const wt = (i, str, d = 0) => fw(i, str) + d;            // waktu absolut sebuah kata (+ geser)
const B = [0, ls(1), ls(2), ls(3), ls(4), ls(5), ls(6), ls(7), ls(8), ls(9), ls(10), ls(11), ls(12)];
const ENDT = WORDS[WORDS.length - 1].e + 1.2;
const SH = (i, o, draw) => SHOTS.push(Object.assign({ start: B[i], end: i + 1 < B.length ? B[i + 1] : ENDT, draw }, o));
const CK = (t, keys, sh = 2) => camKeys(t, t, keys, sh);  // kunci kamera dengan waktu absolut
const pop = (t, t0, d = .25) => backOut(clamp(inv(t0, t0 + d, t)));
const standL = { L: [.1, -.04], R: [.1, -.04] };
const O = RUANG.outlet, G = RUANG.ground, END0 = [860, 1300];
const COOK = DAPUR.cook, STRIP = DAPUR.strip, GA = DAPUR.gauge, TY = DAPUR.top, BK = DAPUR.back;
const WARMP = [COOK[0] + 30, COOK[1] - 100], SOCK = [STRIP[0] - 30, STRIP[1] - 58], GS = DAPUR.gaugeS, HUB = [GA[0], GA[1] + 40 * GS], IBUX = 170, BUDX = 1070;
// benda tetap di meja dapur: kabel + magic com + alat ukur + colokan + terminal (urutan gambar terkunci)
function dapurProps(ctx, t, o = {}) {
  const pa = o.plugAt || SOCK;
  drawCord(ctx, [COOK[0] + 172, COOK[1] - 44], [pa[0], pa[1] - 62], 54);
  drawRiceCooker(ctx, COOK[0], COOK[1], 1, Object.assign({ t }, o.cook));
  if (o.gauge) drawGauge(ctx, GA[0], GA[1], GS, o.gauge);
  drawPlug(ctx, pa[0], pa[1], 1, o.plugRot || 0, o.plugAt ? 1 : 0);
  drawPowerStrip(ctx, STRIP[0], STRIP[1], 1, {});
}
const bez = (a, c, b, p) => { const q = 1 - p; return [q * q * a[0] + 2 * q * p * c[0] + p * p * b[0], q * q * a[1] + 2 * q * p * c[1] + p * p * b[1]]; };

// ===== 0 HOOK: charger nyolok, kabel kosong (tanpa HP), tagihan Budi menggembung =====
const cam0 = t => CK(t, [[0, { x: 540, y: 1010, z: .8 }], [.7, { x: 700, y: 1060, z: 1.7 }, easeOut], [wt(0, 'tanpa', -.12), { x: 708, y: 1075, z: 1.8 }], [wt(0, 'hp', -.05), { x: 790, y: 1210, z: 1.45 }, ease], [wt(0, 'bikin', -.12), { x: 796, y: 1216, z: 1.5 }], [wt(0, 'tagihan', .05), { x: 380, y: 980, z: 1.18 }, ease], [B[1], { x: 365, y: 930, z: 1.34 }, easeIn]]);
SH(0, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); ruangScene(ctx, t, cam);
  const tN = wt(0, 'nyolok'), tT = wt(0, 'tanpa'), tH = wt(0, 'hp'), tB = wt(0, 'bikin'), tG = wt(0, 'tagihan'), tK = wt(0, 'bengkak');
  const cf = exprTrack(t, [[0, 'netral'], [tN, 'licik'], [tT - .12, 'datar', { look: [.7, .8] }], [tB, 'sombong']], { seed: 1 });
  drawCharger(ctx, O[0], O[1], 1, { t, face: cf, cableEnd: END0 });
  if (t > tN && t < tT + .1) for (let i = 0; i < 6; i++) { const p = ((t - tN) * 1.7 + i / 6) % 1, a = i / 6 * TAU + 1, d = lerp(240, 50, easeIn(p)); drawBolt(ctx, O[0] + Math.cos(a) * d, O[1] + Math.sin(a) * d * .9, lerp(36, 12, p), a + 1.2, Math.sin(p * Math.PI)); }
  glint(ctx, O[0] + 70, O[1] - 90, 120, t, wt(0, 'charger'));
  drawPhoneGhost(ctx, END0[0] + 95, END0[1] - 40, 1, .22, inv(tT, tT + .22, t), inv(tH, tH + .2, t));
  // Budi mengangkat tagihan, lalu tagihannya "bengkak"
  const up = ease(inv(tB, tG, t)), bs = kf(t, [[tG, .82], [tK, .9], [tK + .45, 1.6, elastic]]);
  const hand = [lerp(330, 372, up), lerp(1330, 930, up)];
  const bf = exprTrack(t, [[0, 'curiga', { look: [.9, -.1] }], [tB, 'datar', { look: [.5, -.7] }], [tG + .12, 'kaget', { look: [.5, -.8] }], [tK + .12, 'cemas', { look: [.4, -.9] }]], { seed: 2 });
  drawStick(ctx, C(BUDI, { x: 250, y: G, s: 640, legs: standL, arms: { L: idleArms(t, 1).L, R: up > .02 ? reach(250, G, 640, 1, hand[0], hand[1], -1) : idleArms(t, 1).R }, headTilt: -(bf.pop || 0) * .05, face: bf }));
  if (up > .05) { ctx.save(); ctx.globalAlpha = clamp(up * 3); drawBill(ctx, hand[0] + 10, hand[1] - 190 * bs - 6, bs, { puff: inv(tK, tK + .4, t), rot: Math.sin(t * 9) * .03 * inv(tK, tK + .3, t), total: 'Rp ???' }); ctx.restore(); }
});

// ===== 1 "Benar nggak sih?" =====
SH(1, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[B[1], { x: 540, y: 905, z: 1 }], [B[2], { x: 540, y: 885, z: 1.12 }, easeOut]], 3);
  ctx.save(); ctx.filter = 'blur(7px)'; ruangScene(ctx, t, cam); ctx.restore(); applyCam(ctx, cam, 1);
  const f = exprTrack(t, [[B[1], 'curiga', { look: [0, -.8] }], [wt(1, 'sih'), 'datar', { look: [.2, -1] }]], { seed: 3 });
  drawStick(ctx, C(BUDI, { x: 540, y: 2080, s: 1450, bob: Math.sin(t * 3) * .004, headTilt: .1 + Math.sin(t * 2) * .03, arms: { L: [.2, -.1], R: { ik: [.12 + Math.sin(t * 9) * .02, -.7], bend: -1 } }, face: f, shadow: false }));
  [[190, 480, 0], [880, 430, .18], [820, 760, .36]].forEach(([x, y, d], i) => { const k = inv(B[1] + d, B[1] + d + .25, t); if (k > 0) qmark(ctx, x, y + Math.sin(t * 4 + i) * 8, 190 * backOut(k), (i - 1) * .3); });
});

// ===== 2 "Ternyata, hampir mitos." stempel =====
const cam2 = t => CK(t, [[B[2], { x: 640, y: 1000, z: 1.02 }], [B[2] + .7, { x: 690, y: 1000, z: 1.36 }, easeOut], [wt(2, 'mitos', .3), { x: 696, y: 1004, z: 1.44 }], [B[3], { x: 700, y: 1012, z: 1.6 }, easeIn]]);
const PV2 = toScreen(cam2(B[3]), O[0], O[1] + 10);
SH(2, { tr: 'spin', spin: .7, pivot: PV2 }, (ctx, lt, t) => {
  const cam = cam2(t); ruangScene(ctx, t, cam);
  const tH = wt(2, 'hampir'), tM = wt(2, 'mitos'), d = t - tH;
  const cf = exprTrack(t, [[B[2], 'cemas'], [tH + .08, 'kaget'], [tM, 'lega']], { seed: 4 });
  innerGlow(ctx, O[0], O[1], 150, clamp(inv(tM, tM + .3, t)) * .4, t, '255,230,120');
  drawCharger(ctx, O[0], O[1], 1, { t, face: cf, cableEnd: END0 });
  const bf = exprTrack(t, [[B[2], 'cemas', { look: [.8, -.2] }], [tH + .1, 'kaget', { look: [.8, -.4] }], [tM + .05, 'lega']], { seed: 5 });
  drawStick(ctx, C(BUDI, { x: 430, y: G, s: 640, legs: standL, arms: t > tM ? { L: [2.5, .3], R: [2.5, .3] } : idleArms(t, 1), face: bf, headTilt: -(bf.pop || 0) * .05 }));
  const k = inv(tH, tH + .14, t);
  if (k > 0) {
    const sc = (k < 1 ? lerp(2.6, 1, easeOut(k)) : 1 + .03 * Math.sin(d * 14) * Math.exp(-d * 4)) * .66, sh = d < .5 ? shake(t * 3, 12 * Math.exp(-Math.max(0, d - .1) * 8), 3) : [0, 0];
    ctx.save(); ctx.translate(sh[0], sh[1]); if (d < .3 && k >= 1) burst(ctx, 700, 800, 380 * (1 - d / .3), 14, 'rgba(255,255,255,.8)', 8);
    drawStamp(ctx, 700, 800, sc, 'HAMPIR MITOS', { size: 70, rot: -.1 }); ctx.restore();
  }
  glint(ctx, 880, 740, 110, t, tM); glowRing(ctx, 700, 800, 250, Math.sin(clamp(inv(tM, tM + .7, t)) * Math.PI) * .55, '255,200,60');
});

// ===== 3 "Charger modern tanpa HP cuma makan sekitar 0,1 watt." alat ukur + satu remah listrik -> PORTAL ke dalam charger =====
const L3 = camLock(O[0], O[1] + 10, PV2[0], PV2[1], 1.6);
const cam3 = t => CK(t, [[B[3], L3], [B[3] + .7, { x: 690, y: 930, z: 1.1 }, easeOut], [wt(3, 'tanpa', -.05), { x: 700, y: 935, z: 1.13 }], [wt(3, 'hp'), { x: 800, y: 1130, z: 1.2 }, ease], [wt(3, 'cuma', -.05), { x: 806, y: 1134, z: 1.22 }], [wt(3, 'makan', .05), { x: 690, y: 1010, z: 1.42 }, ease], [wt(3, 'sekitar'), { x: 694, y: 1004, z: 1.46 }], [wt(3, '01', -.12), { x: 700, y: 858, z: 1.1 }, ease], [wt(3, '01', .5), { x: 700, y: 852, z: 1.16 }], [B[4] - .42, { x: 700, y: 1020, z: 1.5 }, ease], [B[4], { x: 700, y: 1040, z: 1.66 }, easeIn]]);
SH(3, { tr: 'portal', zoomOut: (() => { const c = cam3(B[4]), p = toScreen(c, O[0], O[1] + 2); return { x: p[0], y: p[1], w: 200 * c.z * .9, h: 246 * c.z * .9 }; })() }, (ctx, lt, t) => {
  const cam = cam3(t); ruangScene(ctx, t, cam);
  const tT = wt(3, 'tanpa'), tH = wt(3, 'hp'), tM = wt(3, 'makan'), tN = wt(3, '01');
  line(ctx, 700, 845, 700, 925, 10, INK); line(ctx, 700, 845, 700, 925, 4, '#e8453c');
  const wob = t > tN ? Math.sin((t - tN) * 20) * .02 * Math.exp(-(t - tN) * 5) : 0;
  drawGauge(ctx, 700, 700, 1, { v: (t > tN ? .035 : t > tM ? .02 * Math.sin((t - tM) * 9) ** 2 : 0) + wob, label: t > tN ? '0,1 W' : '-- W' });
  glowRing(ctx, 700, 740, 150, Math.sin(clamp(inv(tN, tN + .6, t)) * Math.PI), '120,255,160'); glint(ctx, 790, 800, 90, t, tN);
  const cf = exprTrack(t, [[B[3], 'bangga'], [tT - .12, 'datar', { look: [.7, .8] }], [wt(3, 'cuma'), 'netral'], [tM, 'takjub', { look: [-.6, -.3] }], [tM + .4, 'lega'], [tN, 'sombong']], { seed: 6 });
  drawCharger(ctx, O[0], O[1], 1, { t, face: cf, cableEnd: END0 });
  glint(ctx, O[0] + 70, O[1] - 90, 100, t, wt(3, 'modern'));
  drawPhoneGhost(ctx, END0[0] + 95, END0[1] - 40, 1, .22, inv(tT, tT + .22, t), inv(tH, tH + .2, t));
  const kb = inv(tM - .1, tM + .32, t); if (kb > 0 && kb < 1) drawBolt(ctx, lerp(470, 690, ease(kb)), lerp(900, 1090, ease(kb)) - Math.sin(kb * Math.PI) * 60, lerp(28, 12, kb), kb * 3);
  const bf = exprTrack(t, [[B[3], 'curiga', { look: [.9, -.2] }], [tH, 'datar', { look: [.9, .3] }], [tN + .1, 'takjub', { look: [.8, -.8] }]], { seed: 7 });
  drawStick(ctx, C(BUDI, { x: 330, y: G, s: 640, legs: standL, arms: idleArms(t, 2), lean: .05, face: bf, headTilt: -(bf.pop || 0) * .05 }));
});

// ===== 4 "Rangkaian di dalamnya cuma siaga, nyaris tidak menarik arus." isi charger =====
const CHP = [560, 880];
const boltX4 = t => lerp(-60, 410, inv(wt(4, 'nyaris') - .35, B[5] + .2, t));
const cam4 = t => CK(t, [[B[4], { x: 560, y: 890, z: 1.0, r: -.05 }], [B[4] + .9, { x: 560, y: 880, z: 1.28, r: 0 }, easeOut], [wt(4, 'siaga', .5), { x: 578, y: 860, z: 1.36, r: .03 }], [wt(4, 'nyaris', .3), { x: 250, y: 1215, z: 1.5, r: -.02 }, ease], [B[5], { x: 470, y: 1205, z: 1.62, r: 0 }]]);
SH(4, { tr: 'dissolve' }, (ctx, lt, t) => {
  const cam = cam4(t); applyCam(ctx, cam, 1); pcbBG(ctx, t);
  const tS = wt(4, 'siaga'), tN = wt(4, 'nyaris'), tA = wt(4, 'arus');
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; path(ctx, [[-900, 1240], [430, 1240], [430, 1010]], false); ctx.lineWidth = 106; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 90; ctx.strokeStyle = '#d8b24a'; ctx.stroke();
  ctx.setLineDash([26, 30]); path(ctx, [[-900, 1240], [400, 1240]], false); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.stroke(); ctx.setLineDash([]);
  text(ctx, 'AC IN', 40, 1345, 44, 'rgba(255,255,255,.8)', INK, 0);
  drawCap(ctx, 215, 690, 1, t, 0); drawCap(ctx, 335, 715, .85, t, 1.3);
  const tf = () => rrect(ctx, 800, 1090, 220, 200, 18); tf(); ctx.fillStyle = '#f2c230'; ctx.fill(); ctx.fillStyle = '#d99a1c'; ctx.fillRect(808, 1150, 204, 34); tf(); fillStroke(ctx, null, 8);
  const cf = exprTrack(t, [[B[4], 'datar'], [wt(4, 'cuma'), { eyes: 'half', mouth: 'o', browUp: .5 }], [tS, 'lega']], { seed: 8, idleBlink: false });
  drawChip(ctx, CHP[0], CHP[1], 1, { t, face: cf, label: 'IC' });
  if (t > tS) drawZzz(ctx, 700, 760, 1.1, t - tS);
  drawLed(ctx, 850, 640, 22, t > tS && Math.sin((t - tS) * 5) > -.3, 'SIAGA'); glint(ctx, 850, 640, 90, t, tS);
  const ks = inv(tN, tN + .25, t); if (ks > 0) { ctx.save(); ctx.translate(250, 1150); ctx.scale(backOut(ks), backOut(ks)); line(ctx, 0, 0, 0, 50, 10, '#8a5a34'); rrect(ctx, -96, -72, 192, 78, 12); fillStroke(ctx, '#fffdf6', 6); text(ctx, '0,1 W', 0, -31, 46, INK, INK, 0); ctx.restore(); }
  if (t > tN - .35) { const hop = Math.abs(Math.sin((t - tN) * 7)) * 22; drawBolt(ctx, boltX4(t), 1215 - hop, 36, .15 + Math.sin(t * 7) * .08); }
  glint(ctx, boltX4(tA) + 20, 1190, 80, t, tA);
});

// ===== 5 "Nyolok setahun penuh, biayanya cuma seribuan rupiah." kalender setahun, tagihan kempes =====
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
const billS5 = t => kf(t, [[wt(5, 'cuma'), 1.6], [wt(5, 'cuma', .4), 1.2, easeOut]]);
const cam5 = t => CK(t, [[B[5], { x: 820, y: 920, z: .95 }], [B[5] + .7, { x: 800, y: 900, z: 1.1 }, easeOut], [wt(5, 'biayanya', -.15), { x: 806, y: 896, z: 1.14 }], [wt(5, 'biayanya', .3), { x: 400, y: 900, z: 1.05 }, ease], [wt(5, 'cuma'), { x: 395, y: 900, z: 1.07 }], [wt(5, 'cuma', .5), { x: 400, y: 930, z: 1.5 }, easeOut], [B[6], { x: 410, y: 935, z: 1.6 }, easeIn]]);
SH(5, { tr: 'whip' }, (ctx, lt, t) => {
  const t0 = wt(5, 'nyolok', .1), t1 = wt(5, 'penuh', .25), tC = wt(5, 'cuma'), tS = wt(5, 'seribuan'), dC = t - tC;
  const p = inv(t0, t1, t), mi = Math.min(11, Math.floor(p * 12)), fr = (p * 12) % 1;
  const cam = cam5(t); ruangScene(ctx, t, cam, { month: MONTHS[mi], sq: p > 0 && p < 1 && fr < .3 ? 1 - fr / .3 : 0 });
  for (let i = 0; i < mi; i++) { const a = t - (t0 + i * (t1 - t0) / 12); if (a > 0 && a < .5) { const sg = i % 2 ? 1 : -1; ctx.save(); ctx.globalAlpha = 1 - a / .5; ctx.translate(RUANG.cal[0] + sg * a * 520, RUANG.cal[1] - 40 - a * 220 + a * a * 900); ctx.rotate(a * 8 * sg); rrect(ctx, -90, -100, 180, 200, 10); fillStroke(ctx, '#fffdf6', 6); ctx.restore(); } }
  popText(ctx, '1 TAHUN', RUANG.cal[0] - 20, 360, 84, inv(wt(5, 'penuh'), wt(5, 'penuh', .25), t), '#fff', INK, -.05);
  const cf = exprTrack(t, [[B[5], 'datar'], [wt(5, 'penuh'), { eyes: 'half', mouth: 'o', browUp: .4 }], [wt(5, 'biayanya'), 'netral']], { seed: 9 });
  drawCharger(ctx, O[0], O[1], 1, { t, face: cf, cableEnd: END0 });
  // Budi + tagihan (menggembung sejak hook) -> kempes di "cuma"
  const bs = billS5(t), defl = dC > 0 && dC < .45;
  const bx = 382 + (defl ? Math.sin(dC * 40) * 34 * (1 - dC / .45) : 0), by = 930 - 190 * bs - 6 - (defl ? Math.sin(dC / .45 * Math.PI) * 46 : 0);
  const bf = exprTrack(t, [[B[5], 'cemas', { look: [.5, -.8] }], [tC, 'kaget', { look: [.5, -.8] }], [tS + .12, 'lega']], { seed: 10 });
  drawStick(ctx, C(BUDI, { x: 250, y: G, s: 640, legs: standL, arms: { L: idleArms(t, 1).L, R: reach(250, G, 640, 1, 372, 930, -1) }, headTilt: -(bf.pop || 0) * .05, face: bf }));
  if (defl) for (let i = 0; i < 3; i++) puff(ctx, bx + 180 + i * 50 + dC * 200, by + 60 - i * 40, 30 + dC * 60, t, '#f3efe6', i + 4, (1 - dC / .45) * .9);
  drawBill(ctx, bx, by, bs, { puff: 1 - inv(tC, tC + .35, t), rot: defl ? Math.sin(dC * 30) * .12 * (1 - dC / .45) : 0, total: t >= tS ? 'Rp1.000-an' : 'Rp ???', size: t >= tS ? 38 : 44 });
  glint(ctx, bx + 100, by + 110, 120, t, tS);
  const kc = inv(wt(5, 'rupiah'), wt(5, 'rupiah', .25), t); if (kc > 0) drawRpCoin(ctx, 610, 860 - Math.sin(clamp(kc) * Math.PI) * 30, 60 * backOut(kc), Math.cos((t - wt(5, 'rupiah')) * 9));
  if (p > 0 && p < 1) timeGrade(ctx, (.5 - .5 * Math.cos(p * TAU * 3)) * .75, 'malam');
});

// ===== 6 "Pelaku sebenarnya ada di dapur: magic com." senter detektif -> MATCH lampu WARM =====
const cam6 = t => CK(t, [[B[6], { x: 620, y: 930, z: .92 }], [B[6] + .7, { x: 610, y: 900, z: 1.05 }, easeOut], [wt(6, 'sebenarnya', .2), { x: 470, y: 840, z: 1.06 }], [wt(6, 'ada', .1), { x: 650, y: 930, z: 1.08 }], [wt(6, 'dapur', .25), { x: 500, y: 1110, z: 1.32 }, ease], [wt(6, 'magic', .12), { x: 486, y: 1115, z: 1.52 }, easeOut], [B[7] - .34, { x: 495, y: 1150, z: 1.72 }], [B[7], { x: 506, y: 1205, z: 2.3 }, easeIn]]);
const spot6 = t => kf(t, [[B[6], [830, 330]], [wt(6, 'sebenarnya', .15), [240, 420]], [wt(6, 'ada', .05), [800, 760]], [wt(6, 'dapur', .2), [COOK[0], COOK[1] - 215]]]);
SH(6, { tr: 'match', zoomOut: (() => { const c = cam6(B[7]), p = toScreen(c, WARMP[0], WARMP[1]); return { x: p[0], y: p[1], r: 46 * c.z }; })() }, (ctx, lt, t) => {
  const cam = cam6(t); dapurBack(ctx, t, cam);
  const tM = wt(6, 'magic'), tD = wt(6, 'dapur'), L = spot6(t);
  const fi = exprTrack(t, [[B[6], 'curiga', { look: [.8, -.6] }], [tD + .2, 'curiga', { look: [.9, .1] }], [tM, 'kaget', { look: [.9, .1] }]], { seed: 11 });
  const fb = exprTrack(t, [[B[6], 'curiga', { look: [-.8, -.6] }], [tD + .2, 'curiga', { look: [-.9, .1] }], [tM + .06, 'kaget', { look: [-.9, .1] }], [wt(6, 'com', .15), 'sadar', { look: [-.9, .2] }]], { seed: 12 });
  const hx = 985, hy = 1235, ang = Math.atan2(L[1] - hy, L[0] - hx);
  drawStick(ctx, C(IBU, { x: IBUX, y: BK, s: 600, legs: standL, arms: idleArms(t, 1), face: fi, headTilt: -(fi.pop || 0) * .05 }));
  drawStick(ctx, C(BUDI, { x: BUDX, y: BK, s: 600, flip: -1, legs: standL, arms: { L: idleArms(t, 2).L, R: reach(BUDX, BK, 600, -1, hx, hy, 1) }, face: fb, headTilt: -(fb.pop || 0) * .05 }));
  dapurMeja(ctx);
  const fc = exprTrack(t, [[B[6], 'datar', { look: [-.9, -.3] }], [tD + .15, 'sadar', { look: [.6, 0] }], [tM, 'kaget'], [wt(6, 'com', .1), 'cemas']], { seed: 13 });
  dapurProps(ctx, t, { cook: { face: fc, warm: 1, steam: .6 } });
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang); rrect(ctx, -34, -19, 76, 38, 10); fillStroke(ctx, '#3d4358', 6); path(ctx, [[40, -24], [78, -38], [78, 38], [40, 24]]); fillStroke(ctx, '#ffd23a', 6); ctx.restore();
  glint(ctx, COOK[0] + 130, COOK[1] - 340, 160, t, tM);
  innerGlow(ctx, WARMP[0], WARMP[1], 34, inv(tM + .2, B[7], t), t);
  const sp = toScreen(cam, L[0], L[1]); spotlight(ctx, sp[0], sp[1], 255 * cam.z, 1 - inv(tM, tM + .22, t));
  flash(ctx, t, tM, .14);
});

// ===== 7 "Mode warm-nya makan sekitar 40 watt, 400 kali lipat charger." alat ukur 40 W -> pull-back menara 400 petir =====
const L7 = camLock(HUB[0], HUB[1], 540, 800, 1.5);
const cam7 = t => CK(t, [[B[7], L7], [B[7] + .75, { x: 620, y: 1100, z: 1.2 }, easeOut], [wt(7, '40'), { x: 640, y: 1104, z: 1.26 }], [wt(7, '400', -.12), { x: 648, y: 1104, z: 1.28 }], [wt(7, 'kali', .15), { x: 200, y: 900, z: .62 }, ease], [B[8], { x: 192, y: 890, z: .6 }]]);
SH(7, { tr: 'dissolve', zoomIn: { x: 540, y: 800, r: 122 * GS * 1.5 } }, (ctx, lt, t) => {
  const cam = cam7(t); dapurBack(ctx, t, cam); dapurMeja(ctx);
  const tK = wt(7, 'makan'), t40 = wt(7, '40'), t400 = wt(7, '400'), tL = wt(7, 'lipat');
  const n = Math.floor(400 * ease(inv(t400 - .05, tL + .1, t)));
  for (let i = 0; i < n; i++) drawBolt(ctx, -306 + (i % 20) * 28, TY - 28 - Math.floor(i / 20) * 50, 24, .12, 1, true);
  const ks = inv(tL, tL + .25, t); if (ks > 0) { ctx.save(); ctx.translate(-40, TY - 1100); ctx.rotate(-.06); const sc = backOut(ks); ctx.scale(sc, sc); rrect(ctx, -180, -84, 360, 168, 26); fillStroke(ctx, '#e5262a', 10); text(ctx, '×400', 0, 8, 124, '#fff', INK, 0); ctx.restore(); }
  const fch = exprTrack(t, [[B[7], 'netral'], [t400, 'takjub', { look: [.7, -.8] }], [tL + .2, 'cemas', { look: [.7, -.8] }]], { seed: 14 });
  drawCharger(ctx, -540, TY - 164, 1.3, { t, face: fch, cable: false }); drawBolt(ctx, -362, TY - 46, 40, .12); text(ctx, '×1', -356, TY - 140, 80, '#fff', INK, 16);
  const eat = t > tK, lid = eat ? (.5 + .5 * Math.sin((t - tK) * 16)) * .7 : 0;
  const fc = exprTrack(t, [[B[7], 'licik'], [tK, 'bangga'], [t400, 'sombong', { look: [-.8, 0] }]], { seed: 15 });
  const gv = kf(t, [[tK, 0], [t40 - .05, .3], [t40 + .18, .66, backOut]]) + (t > t40 ? Math.sin(t * 9) * .008 : 0);
  dapurProps(ctx, t, { cook: { face: fc, warm: 1, steam: .8, lid }, gauge: { v: gv, label: t >= t40 ? '40 W' : '-- W' } });
  if (eat) for (let i = 0; i < 7; i++) { const p = ((t - tK) * 1.5 + i / 7) % 1, q = bez([SOCK[0], SOCK[1] - 70], [760, 640], [COOK[0] - 20, COOK[1] - 312], p); drawBolt(ctx, q[0], q[1], 26, p * 5, Math.min(1, p * 6) * Math.min(1, (1 - p) * 6)); }
  glowRing(ctx, HUB[0], HUB[1], 150, Math.sin(clamp(inv(t40, t40 + .7, t)) * Math.PI), '255,120,60'); glint(ctx, GA[0] + 70, GA[1] + 80, 100, t, t40);
});

// ===== 8 "Nyala 24 jam, sebulan bisa 40 ribu rupiah." jam berputar siang-malam, uang masuk magic com =====
const cam8 = t => CK(t, [[B[8], { x: 600, y: 1080, z: 1.0 }], [B[8] + .7, { x: 630, y: 1090, z: 1.2 }, easeOut], [wt(8, 'jam', .3), { x: 640, y: 1088, z: 1.25 }], [wt(8, 'sebulan', .3), { x: 400, y: 1075, z: 1.14 }, ease], [wt(8, '40', -.1), { x: 410, y: 1075, z: 1.16 }], [wt(8, '40', .35), { x: 540, y: 1110, z: 1.34 }, easeOut], [B[9], { x: 548, y: 1120, z: 1.42 }, easeIn]]);
SH(8, { tr: 'whip' }, (ctx, lt, t) => {
  const tN = wt(8, 'nyala'), tJ = wt(8, 'jam'), tS = wt(8, 'sebulan'), tB = wt(8, 'bisa'), t40 = wt(8, '40'), tR = wt(8, 'ribu');
  const p = inv(tN + .1, tJ + .3, t), night = Math.sin(clamp(p) * Math.PI);
  const cam = cam8(t); dapurBack(ctx, t, cam, { jam: 7 + 24 * ease(p), fast: p > 0 && p < 1 ? 1 : 0 });
  const purse = [300, 1190];
  const fi = exprTrack(t, [[B[8], 'netral', { look: [.8, 0] }], [tS, 'curiga', { look: [.8, .1] }], [tB + .1, 'kaget', { look: [.8, .1] }], [tR, 'meringis']], { seed: 16 });
  drawStick(ctx, C(IBU, { x: IBUX, y: BK, s: 600, legs: standL, arms: { L: idleArms(t, 1).L, R: t > tS ? reach(IBUX, BK, 600, 1, purse[0] - 20, purse[1] + 30, -1) : idleArms(t, 1).R }, face: fi, headTilt: -(fi.pop || 0) * .05 }));
  dapurMeja(ctx);
  if (t > tS) { const k = pop(t, tS); ctx.save(); ctx.translate(purse[0], purse[1]); ctx.scale(k, k); rrect(ctx, -62, -40, 124, 84, 18); fillStroke(ctx, '#b4693a', 7); rrect(ctx, -62, -40, 124, 34, 14); fillStroke(ctx, '#8a4a22', 6); circle(ctx, 0, -6, 9); fillStroke(ctx, '#ffd23a', 4); ctx.restore(); }
  const eat = t > tB, lid = eat ? (.5 + .5 * Math.sin((t - tB) * 15)) * .7 : 0;
  const fc = exprTrack(t, [[B[8], 'sombong'], [tN + .5, 'licik'], [tJ + .3, 'sombong', { look: [-.8, 0] }], [tB, 'bangga']], { seed: 17 });
  dapurProps(ctx, t, { cook: { face: fc, warm: 1, steam: .7, lid }, gauge: { v: .66 + Math.sin(t * 9) * .008, label: '40 W' } });
  popText(ctx, '30 HARI', COOK[0], 800, 84, inv(tS, tS + .25, t) * (1 - inv(t40 - .1, t40 + .1, t)), '#fff', INK, -.05);
  for (let i = 0; i < 4; i++) { const a = inv(tB + .05 + i * .16, tB + .5 + i * .16, t); if (a > 0 && a < 1) { const q = bez([purse[0], purse[1] - 30], [360, 800], [COOK[0] - 30, COOK[1] - 315], a); drawNote(ctx, q[0], q[1], lerp(.95, .5, a), a * 5 + i, Math.min(1, (1 - a) * 5)); } }
  const kt = inv(t40, t40 + .25, t); if (kt > 0) { line(ctx, 676, 1088, 705, 992, 5, '#8a5a34'); ctx.save(); ctx.translate(800, 950); ctx.rotate(-.05 + Math.sin(t * 4) * .02); const sc = backOut(kt); ctx.scale(sc, sc); rrect(ctx, -140, -58, 280, 116, 16); fillStroke(ctx, '#fff3c4', 7); text(ctx, 'Rp40.000', 0, -12, 50, '#e5262a', INK, 0); text(ctx, 'per bulan', 0, 32, 26, INK, INK, 0); ctx.restore(); }
  glint(ctx, 900, 910, 110, t, tR);
  timeGrade(ctx, night * .9, 'malam'); innerGlow(ctx, WARMP[0], WARMP[1], 46, night, t);
});

// ===== 9 "Jadi, masak nasi secukupnya, lalu cabut magic com-nya." -> kamera mengunci colokan, SPIN =====
const BOWL = [225, TY];
const plug9 = t => { const e = backOut(clamp(inv(wt(9, 'cabut'), wt(9, 'cabut', .3), t))); return [SOCK[0] - 110 * e, SOCK[1] - 162 * e]; };
const CAM9A = { x: 954, y: 1172, z: 1.36 }, S9P = toScreen(CAM9A, SOCK[0], SOCK[1]);
const cam9 = t => {
  const tc = wt(9, 'cabut');
  if (t < tc) return CK(t, [[B[9], { x: 330, y: 1130, z: 1.0 }], [B[9] + .7, { x: 300, y: 1130, z: 1.26 }, easeOut], [wt(9, 'secukupnya', .6), { x: 310, y: 1128, z: 1.32 }], [wt(9, 'lalu', .3), { x: 950, y: 1170, z: 1.35 }, ease], [tc, CAM9A]], 0);
  const p = plug9(t), k = easeOut(inv(tc, tc + .5, t));
  return camLock(p[0], p[1], lerp(S9P[0], 540, k), lerp(S9P[1], 860, k), lerp(1.36, 1.62, k), kf(t, [[B[10] - .3, 0], [B[10], .18]], easeIn));
};
SH(9, { tr: 'spin', spin: .8, pivot: [540, 860] }, (ctx, lt, t) => {
  const tMs = wt(9, 'masak'), tNs = wt(9, 'nasi'), tSc = wt(9, 'secukupnya'), tL = wt(9, 'lalu'), tC = wt(9, 'cabut'), out = t >= tC;
  const cam = cam9(t); dapurBack(ctx, t, cam);
  const sc = inv(tMs, tNs + .25, t);
  const pad = sc <= 0 ? [430, 1010] : sc < 1 ? [lerp(430, 232, ease(sc)), lerp(1010, 1205, ease(sc)) - Math.sin(sc * Math.PI) * 110] : [250, kf(t, [[tNs + .25, 1205], [tNs + .6, 1120]])];
  const hand = [pad[0] - 100, pad[1] + 50];
  const fi = exprTrack(t, [[B[9], 'netral', { look: [.7, .2] }], [tNs + .25, 'lega'], [tSc + .2, 'bangga']], { seed: 18 });
  drawStick(ctx, C(IBU, { x: IBUX, y: BK, s: 600, legs: standL, arms: { L: idleArms(t, 1).L, R: reach(IBUX, BK, 600, 1, hand[0], hand[1], -1) }, face: fi, headTilt: -(fi.pop || 0) * .05 }));
  const pp = plug9(t);
  const fb = exprTrack(t, [[B[9], 'netral', { look: [-.8, 0] }], [tL, 'ngeden', { look: [-.5, .6] }], [tC, 'kaget', { look: [-.6, .2] }], [tC + .3, 'bangga']], { seed: 19 });
  drawStick(ctx, C(BUDI, { x: BUDX, y: BK, s: 600, flip: -1, legs: standL, arms: { L: idleArms(t, 2).L, R: t > tL - .1 ? reach(BUDX, BK, 600, -1, pp[0] + 6, pp[1] - 58, 1) : idleArms(t, 2).R }, face: fb, headTilt: -(fb.pop || 0) * .05 }));
  dapurMeja(ctx);
  drawBowl(ctx, BOWL[0], BOWL[1], 1, clamp(inv(tNs + .15, tNs + .35, t)));
  const fc = exprTrack(t, [[B[9], 'netral'], [tL, 'cemas', { look: [.9, 0] }], [tC, 'kaget'], [tC + .3, 'lega']], { seed: 20, idleBlink: false });
  dapurProps(ctx, t, { cook: { face: fc, warm: out ? 0 : 1, steam: out ? 0 : .5, lid: 1 - ease(inv(tSc + .3, tSc + .65, t)), rice: true }, gauge: { v: out ? .66 * (1 - easeOut(inv(tC, tC + .4, t))) : .66, label: out ? '0 W' : '40 W' }, plugAt: out ? pp : null, plugRot: out ? -.25 * clamp(inv(tC, tC + .3, t)) : 0 });
  if (out && t > tC + .35) drawZzz(ctx, COOK[0] + 110, COOK[1] - 330, 1, t - tC);
  // centong
  line(ctx, hand[0], hand[1], pad[0], pad[1], 15, INK); line(ctx, hand[0], hand[1], pad[0], pad[1], 8, '#c68a55'); ellipse(ctx, pad[0], pad[1], 36, 26, -.4); fillStroke(ctx, '#f6f2ea', 6);
  if (sc > .1 && sc < 1) { ellipse(ctx, pad[0], pad[1] - 12, 26, 16); fillStroke(ctx, '#fffdf2', 5); }
  const kc = inv(tSc + .12, tSc + .37, t); if (kc > 0) { ctx.save(); ctx.translate(BOWL[0] + 140, 1090); const s2 = backOut(kc); ctx.scale(s2, s2); drawCheck(ctx, 0, 0, 62); ctx.restore(); }
  if (out) { const d = t - tC; if (d < .25) burst(ctx, SOCK[0], SOCK[1] - 20, 110 * backOut(clamp(d * 5)) * (1 - d / .25 * .3), 10, '#ffd23a', 6); sparkle(ctx, pp[0] + 70, pp[1] - 90, 56, clamp(1 - d / .5)); }
});

// ===== 10 "Charger tetap dicabut kalau murahan atau terasa panas, demi keamanan." =====
const cp10 = t => { const td = wt(10, 'dicabut'), k = easeOut(inv(td, td + .35, t)); return [lerp(O[0], 650, k), lerp(O[1], 985, k), k]; };
const hot10 = t => inv(wt(10, 'terasa'), wt(10, 'panas', .1), t) * (1 - inv(wt(10, 'demi'), wt(10, 'demi', .4), t));
const cam10 = t => {
  const p = cp10(t), td = wt(10, 'dicabut'), k = ease(inv(td, td + .5, t));
  const z = kf(t, [[B[10], 1.6], [td, 1.52], [td + .5, 1.26], [wt(10, 'murahan', .05), 1.3], [wt(10, 'murahan', .5), 1.5, easeOut], [wt(10, 'terasa'), 1.32], [wt(10, 'demi'), 1.27], [B[11], 1.42, easeIn]]);
  const h = shake(t * .35, 2, 1, 3);
  return camLock(p[0], p[1] + 10, lerp(540, 560, k) + h[0], lerp(860, 800, k) + h[1], z, kf(t, [[B[10], -.18], [B[10] + .5, 0]], easeOut));
};
SH(10, { tr: 'whip', pivot: [540, 860] }, (ctx, lt, t) => {
  const tT = wt(10, 'tetap'), tD = wt(10, 'dicabut'), tM = wt(10, 'murahan'), tR = wt(10, 'terasa'), tA = wt(10, 'demi'), tK = wt(10, 'keamanan');
  const cam = cam10(t); ruangScene(ctx, t, cam);
  const p = cp10(t), hot = hot10(t), jug = hot > 0 ? Math.abs(Math.sin((t - tR) * 11)) * 46 * hot : 0, cx = p[0], cy = p[1] - jug;
  const rk = ease(inv(tT, tD - .04, t)), hand = t < tD ? [lerp(560, O[0] - 62, rk), lerp(1380, O[1] + 70, rk)] : [cx - 62, cy + 70];
  const fb = exprTrack(t, [[B[10], 'curiga', { look: [.8, -.1] }], [tT, 'ngeden', { look: [.8, -.2] }], [tD, 'kaget', { look: [.7, -.3] }], [tM, 'curiga', { look: [.9, -.2] }], [tR, 'meringis'], [tA + .15, 'lega'], [tK + .1, 'bangga']], { seed: 21 });
  drawStick(ctx, C(BUDI, { x: 450, y: G, s: 700, armLen: 1.3, legs: standL, arms: { L: idleArms(t, 1).L, R: t > tT ? reach(450, G, 700, 1, hand[0], hand[1], -1) : idleArms(t, 1).R }, face: fb, headTilt: -(fb.pop || 0) * .05 }));
  if (p[2] > 0 && t - tD < .25) burst(ctx, O[0], O[1], 120 * backOut(clamp((t - tD) * 5)), 10, '#ffd23a', 6);
  const fc = exprTrack(t, [[B[10], 'cemas'], [tD, 'kaget'], [tM, 'datar', { look: [.8, .6] }], [tR, 'meringis'], [tA + .2, 'lega']], { seed: 22 });
  const baseHot = t < tD ? .22 + .12 * Math.sin(t * 7) : .12 * (1 - inv(tA, tA + .4, t));
  drawCharger(ctx, cx, cy, 1, { t, kw: true, label: 'KW', face: fc, hot: Math.max(baseHot, hot * .9), out: p[2], rot: .14 * p[2] + (hot > 0 ? Math.sin(t * 22) * .05 * hot : 0), cable: false, tag: inv(tM, tM + .25, t) });
  if (hot > 0 || t < tD) for (let i = 0; i < 3; i++) { const a = t < tD ? .45 : hot, q = (t * .7 + i * .33) % 1; ctx.save(); ctx.globalAlpha = (1 - q) * .75 * a; ctx.beginPath(); for (let j = 0; j <= 10; j++) { const yy = cy - 150 - q * 120 - j * 13, xx = cx - 60 + i * 60 + Math.sin(t * 6 + j * .8 + i) * 11; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 11; ctx.strokeStyle = '#ff6a3c'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  const kc = inv(tK, tK + .25, t); if (kc > 0) { ctx.save(); ctx.translate(cx + 215, cy - 225); const s2 = backOut(kc); ctx.scale(s2, s2); drawCheck(ctx, 0, 0, 92); ctx.restore(); sparkle(ctx, cx - 170, cy - 210, 60 * kc, kc); sparkle(ctx, cx - 150, cy + 200, 46 * kc, kc); }
});

// ===== 11 "Mitos apa lagi yang mau dibongkar?" =====
SH(11, { tr: 'cut' }, (ctx, lt, t) => {
  const cam = CK(t, [[B[11], { x: 540, y: 900, z: 1 }], [B[11] + .6, { x: 540, y: 890, z: 1.1 }, easeOut], [B[12], { x: 540, y: 880, z: 1.16 }]], 3);
  ctx.save(); ctx.filter = 'blur(7px)'; dapurBack(ctx, t, cam); ctx.restore(); applyCam(ctx, cam, 1);
  burst(ctx, 540, 660, 560 + Math.sin(t * 6) * 16, 16, '#ffe14d', 6);
  const fb = exprTrack(t, [[B[11], 'netral'], [wt(11, 'apa'), 'curiga', { look: [0, -.6] }], [wt(11, 'dibongkar'), 'bangga']], { seed: 23 });
  const fi = exprTrack(t, [[B[11], 'netral'], [wt(11, 'lagi'), 'takjub'], [wt(11, 'dibongkar', .1), 'bangga']], { seed: 24 });
  drawStick(ctx, C(BUDI, { x: 300, y: 1720, s: 1000, shadow: false, arms: { L: [.2, -.1], R: { ik: [.12 + Math.sin(t * 9) * .02, -.7], bend: -1 } }, headTilt: .08 - (fb.pop || 0) * .05, face: fb }));
  drawStick(ctx, C(IBU, { x: 790, y: 1720, s: 1000, flip: -1, shadow: false, arms: { L: [.2, -.1], R: [2.6 + Math.sin(t * 8) * .12, .35] }, headTilt: -.05 - (fi.pop || 0) * .05, face: fi }));
  [[540, 400, 0, 230], [220, 520, .2, 150], [880, 500, .4, 150]].forEach(([x, y, d, sz], i) => { const k = inv(B[11] + d, B[11] + d + .25, t); if (k > 0) qmark(ctx, x, y + Math.sin(t * 4 + i) * 8, sz * backOut(k), (i - 1) * .25); });
});

// ===== 12 CTA "Subscribe Mitos Rumahan, besok ada lagi!" =====
SH(12, { tr: 'cut' }, (ctx, lt, t) => {
  const cam = CK(t, [[B[12], { x: 540, y: 965, z: 1.06 }], [B[12] + .5, { x: 540, y: 960, z: 1 }, easeOut], [ENDT, { x: 540, y: 950, z: 1.05 }]], 2);
  dapurBack(ctx, t, cam);
  const tS = wt(12, 'subscribe'), d = t - tS, k = inv(B[12] + .05, B[12] + .45, t), sc = backOut(k);
  const subbed = d > .35, press = d > .2 && d < .45 ? 1 : 0;
  ctx.save(); ctx.translate(540, 680); ctx.scale(sc, sc); ctx.translate(-540, -680);
  drawSubBanner(ctx, 540, 680, .98, { subbed, press, ring: subbed ? Math.sin((d - .35) * 22) * .35 * Math.exp(-(d - .35) * 2) : 0 }); ctx.restore();
  const w = Math.sin(t * 7);
  drawStick(ctx, C(BUDI, { x: 260, y: 1620, s: 640, face: exprTrack(t, [[B[12], 'bangga']], { seed: 25 }), arms: { L: [.3, -.1], R: [2.4 + w * .25, .35] } }));
  drawStick(ctx, C(IBU, { x: 820, y: 1620, s: 640, flip: -1, face: exprTrack(t, [[B[12], 'bangga']], { seed: 26 }), arms: { L: [2.4 - w * .25, .35], R: [.3, -.1] } }));
  if (subbed) { const r = rng(4); for (let i = 0; i < 46; i++) { const x0 = r() * 1080, v = 300 + r() * 500, ph = r() * TAU, d0 = r() * .6, tt = d - .35 - d0; if (tt < 0) continue; ctx.save(); ctx.translate(x0 + Math.sin(tt * 3 + ph) * 40, -60 + tt * v); ctx.rotate(tt * 6 + ph); ctx.fillStyle = ['#ff5a3c', '#ffd23a', '#2cb35e', '#4a8cff', '#ff6fa8'][i % 5]; ctx.fillRect(-12, -7, 24, 14); ctx.restore(); } }
});
