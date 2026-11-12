// ---------- PREVIEW PETA (naskah baris 6-14): analogi tinju -> umpan Belgia -> sabit Ardennes -> kantong Dunkirk ----------
// Timing kata = PERKIRAAN (belum ada suara). Versi penuh: words.js dari Scribe, semua tetap sinkron lewat wt().
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
const bezP = (a, c, b, p) => { const q = 1 - p; return [q * q * a[0] + 2 * q * p * c[0] + p * p * b[0], q * q * a[1] + 2 * q * p * c[1] + p * p * b[1]]; };

// ===== 6 ANALOGI TINJU: kanan memancing (atas) -> lawan menangkis -> kiri menghantam dari samping (bawah) =====
// Arah dibuat sama dengan peta: penyerang di KANAN layar (Jerman di timur), pukulan ATAS = utara (Belgia), pukulan BAWAH = selatan (Ardennes).
const T6 = { kn: wt(6, 'kanan'), mc: wt(6, 'memancing'), lw: wt(6, 'lawan'), kr: wt(6, 'kiri'), mh: wt(6, 'menghantam'), sm: wt(6, 'samping') };
T6.hit = T6.mh + .25;
const PX6 = 380, HX6 = 720, GY6 = 1500, S6 = 600;
const cam6 = t => CK(t, [[0, { x: 560, y: 1080, z: 1.15 }], [.7, { x: 555, y: 1070, z: 1.28 }, easeOut], [T6.lw, { x: 520, y: 1040, z: 1.32 }], [T6.hit, { x: 500, y: 1110, z: 1.42 }, ease], [ls(7), { x: 480, y: 1120, z: 1.5 }, easeIn]], 2);
SH(0, ls(7), { tr: 'dissolve', xt: .2 }, (ctx, lt, t) => {
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
const camD = t => CK(t, [[ls(14), { x: POCK1.c[0], y: POCK1.c[1] + 60, z: 1.25 }], [T14.kb + .3, { x: 330, y: 690, z: 1.3 }, ease], [T14.dt, { x: 370, y: 710, z: 1.38 }, ease], [ENDT, { x: 380, y: 705, z: 1.45 }]], 1.5);
SH(ls(14), ENDT, {}, (ctx, lt, t) => {
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
