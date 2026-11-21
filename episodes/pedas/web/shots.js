// ---------- Fakta Unik: "Kepedasan" (~61 dtk, tanpa CTA) ----------
// Pola naskah ref-02, bentuk cerita kelima: taruhan dengan pengejek, pengejek ternyata pemegang rahasia (Rani yang menjelaskan, Ibu tidak muncul).
// Frame 0 = Budi menenggak gelas ketiga, mulut masih menyemburkan api. Plant: gelas Rani (isi putih) setengah tertutup mangkuk sejak awal.
// Dunia mikro lidah: tetes zat pedas berminyak menekan sensor panas; air lewat tanpa membawa; protein susu mengikat dan membawa pergi.
// Akhir: foto profil grup keluarga = komposisi frame 0, kamera masuk ke foto itu (loop).
// Aturan v5/v6/v7: kamera selalu bergerak, semua waktu dari kata (wt), satu fungsi per aset (env_pedas.js), tata letak PD terkunci.
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
const flashK = (t, t0, d = .3) => (t > t0 && t < t0 + d) ? 1 - (t - t0) / d : 0;

// ===== tata letak tokoh =====
const FT = PD.back, S = 600, RX = PD.rani, BX = PD.budi;
const MOUTH_Y = FT - .68 * S;            // mulut tokoh (dunia)
const HEAD_Y = FT - .765 * S;
const armTo = (px, flip, wx, wy, bend = 1) => reach(px, FT, S, flip, wx, wy, bend);
const standL = { L: [.1, -.04], R: [.1, -.04] };
function tokoh(ctx, t, P, x, face, arms, flip = 1, extra = {}) { drawStick(ctx, C(P, Object.assign({ x, y: FT, s: S, flip, armLen: 1.3, legs: standL, arms: arms || idleArms(t, x * .01), face, headTilt: -(face.pop || 0) * .05 }, extra))); }
// efek kepedasan di kepala Budi: muka merah, keringat, air mata, asap telinga, api dari mulut. o: { red, tears, steam, fire, fireDir }
function pedasFX(ctx, t, x, o = {}) {
  if (o.red > 0) { ctx.save(); ctx.globalAlpha = .28 * clamp(o.red); circle(ctx, x, HEAD_Y, .19 * S); ctx.fillStyle = '#ff3a2a'; ctx.fill(); ctx.restore(); }
  if (o.steam > 0) for (const sd of [-1, 1]) for (let i = 0; i < 2; i++) { const q = (t * 1.4 + i * .5 + (sd > 0 ? .25 : 0)) % 1; puff(ctx, x + sd * (.21 * S + q * 60), HEAD_Y - 20 - q * 120, 26 + 30 * q, t, '#ffffff', 3 + i, o.steam * (1 - q)); }
  if (o.tears > 0) drawTokohTears(ctx, x, FT, S, o.tears, t, 2);
  if (o.fire > 0) drawApi(ctx, x + (o.fireDir || -1) * 30, MOUTH_Y + 6, 1.1, t, o.fire, o.fireDir || -1, -.1);
}
function perut(ctx, x, k, flip = -1) { if (k <= 0) return; const kk = backOut(clamp(k)); ellipse(ctx, x + flip * 18, 1265, 95 * kk + 70 * (1 - kk), 80 * kk + 60 * (1 - kk)); fillStroke(ctx, BUDI.cols[0], 10); ctx.fillStyle = 'rgba(255,255,255,.25)'; ellipse(ctx, x + flip * 40, 1230, 30 * kk, 14 * kk, .4); ctx.fill(); }
// sendok di tangan (dunia): dari tangan (hx,hy) ke arah ang, isi kuah merah
function sendok(ctx, hx, hy, ang, full = 1) {
  const tx = hx + Math.cos(ang) * 120, ty = hy + Math.sin(ang) * 120;
  line(ctx, hx, hy, tx, ty, 16, INK); line(ctx, hx, hy, tx, ty, 9, '#c9ccd6');
  ctx.save(); ctx.translate(tx, ty); ctx.rotate(ang); ellipse(ctx, 22, 0, 34, 20); fillStroke(ctx, '#c9ccd6', 5); if (full > 0) { ellipse(ctx, 22, -2, 24 * full, 12 * full); ctx.fillStyle = PDP.kuah; ctx.fill(); } ctx.restore();
}
// ===== set warung bersama =====
// o: { fR, armsR, rx, rExtra, fB, armsB, bx, bExtra, flipB, budiFX:{...}, belly, bowlR:{}, bowlB:{}, cupR:{}, glasses:[{},{},{}], hideBudi, hideRani, front(ctx), extra(ctx) }
function warung(ctx, t, cam, o = {}) {
  warungBG(ctx, t, cam);
  if (o.under) o.under(ctx);
  if (!o.hideRani) tokoh(ctx, t, RANI, o.rx == null ? RX : o.rx, o.fR || EXPR.netral, o.armsR, 1, o.rExtra || {});
  if (!o.hideBudi) { const bx = o.bx == null ? BX : o.bx; tokoh(ctx, t, BUDI, bx, o.fB || EXPR.netral, o.armsB, o.flipB || -1, o.bExtra || {}); perut(ctx, bx, o.belly || 0); if (o.budiFX) pedasFX(ctx, t, bx, o.budiFX); }
  mejaWarung(ctx);
  if (o.cupR !== false) drawGelas(ctx, PD.cupR[0], PD.cupR[1], 1, Object.assign({ liquid: 'susu', fill: .9, sleeve: 1, straw: true, t }, o.cupR || {}));
  if (o.bowlR !== false) drawSeblak(ctx, PD.bowlR[0], PD.bowlR[1], 1, Object.assign({ level: 5, fill: .7, steam: .7, t }, o.bowlR || {}));
  if (o.bowlB !== false) drawSeblak(ctx, PD.bowlB[0], PD.bowlB[1], 1, Object.assign({ level: 5, fill: .85, steam: .7, t }, o.bowlB || {}));
  const gl = o.glasses || [{}, { fill: 0 }, { fill: 0 }];
  [PD.glassB, PD.glass2, PD.glass3].forEach((p, i) => { if (gl[i] && gl[i].hide !== true) drawGelas(ctx, p[0], p[1], .82, Object.assign({ liquid: 'air', fill: 1, ice: true, t }, gl[i])); });
  if (o.extra) o.extra(ctx);
}

// ===== 0 HOOK: habis 3 gelas air, mulut Budi masih kebakar =====
const H0 = { ha: wt(0, 'habis'), ti: wt(0, '3'), ge: wt(0, 'gelas'), ai: wt(0, 'air'), mu: wt(0, 'mulut'), bu: wt(0, 'budi'), ma: wt(0, 'masih'), ke: wt(0, 'kebakar') };
const cam0 = t => CK(t, [[0, { x: 820, y: 1130, z: 1.62 }], [H0.ai, { x: 830, y: 1125, z: 1.7 }, ease], [H0.mu, { x: 800, y: 1110, z: 1.62 }, easeOut], [H0.ke, { x: 760, y: 1100, z: 1.72 }, ease], [ls(1), { x: 740, y: 1110, z: 1.66 }, easeIn]], 2.5);
// gelas di tangan: drink 1 = di mulut (miring), 0 = di meja (posisi gelas B)
function glassInHand(drink) {
  const e = easeInOut(clamp(drink));
  const bx = lerp(PD.glassB[0], 985, e), by = lerp(PD.glassB[1], 1030, e), rot = lerp(0, -2.0, e);
  const mid = [bx + Math.sin(rot) * -70 * .7, by - Math.cos(rot) * 70 * .7];
  return { bx, by, rot, hand: mid };
}
function hookScene(ctx, t, cam, tl) {
  const drink = 1 - inv(H0.ai - .05, H0.ai + .25, tl), g = glassInHand(drink), slam = inv(H0.ai + .2, H0.ai + .32, tl) * (1 - inv(H0.ai + .32, H0.ai + .6, tl));
  const fire = tl < H0.mu - .1 ? 0 : easeOut(inv(H0.mu - .1, H0.mu + .2, tl)) * (.75 + .25 * inv(H0.ke, H0.ke + .3, tl));
  warung(ctx, t, cam, {
    fB: EM(tl, [[-9, { eyes: 'flinch', mouth: 'o', sweat: 1 }], [H0.ai + .1, { eyes: 'wide', mouth: 'wobble', sweat: 1, browAng: .3 }], [H0.mu, { eyes: 'x', mouth: 'o', sweat: 1 }]], 1),
    armsB: { R: armTo(BX, -1, g.hand[0], g.hand[1], -1), L: [.25, -.3] }, bExtra: { headTilt: -.25 * drink + .04 * Math.sin(tl * 30) * (fire > 0 ? 1 : 0), lean: -.04 * drink },
    budiFX: { red: 1, tears: .7, steam: 1, fire, fireDir: -1 },
    fR: EF(tl, [[-9, 'sombong', { look: [.8, 0] }]], 2),
    glasses: [{ hide: true }, { fill: 0 }, { fill: 0 }],
    extra: c => { drawGelas(c, g.bx, g.by + slam * 4, .82, { liquid: 'air', fill: .55 * drink, ice: true, t, rot: g.rot, frost: .6 }); }
  });
  if (drink > .2) { ctx.save(); applyCam(ctx, cam, 1); sfxText(ctx, 'GLUK', 1010, 900, 58, inv(-1, -.9, tl) * (1 - inv(H0.ai - .1, H0.ai, tl)), '#9ed8ff', .1); ctx.restore(); }
}
SH(0, ls(1), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = cam0(t); hookScene(ctx, t, cam, t);
  ctx.save(); applyCam(ctx, cam, 1); sfxText(ctx, 'TAK!', 1060, 1180, 56, inv(H0.ai + .25, H0.ai + .33, t) * (1 - inv(H0.mu, H0.mu + .2, t)), '#fff', .12); ctx.restore();
  scrTag(ctx, '3 GELAS AIR', inv(H0.ti, H0.ti + .15, t) * (1 - inv(H0.mu - .1, H0.mu, t)), '#9ed8ff', 330, 100);
  scrTag(ctx, 'MASIH KEBAKAR', inv(H0.ma, H0.ma + .15, t), '#ff8a2a', 330, 96);
});

// ===== 1 taruhan sama Rani: seblak level 5, yang nyerah duluan kalah =====
const T1 = { in: wt(1, 'ini'), ta: wt(1, 'taruhan'), ra: wt(1, 'rani'), se: wt(1, 'seblak'), le: wt(1, 'level'), li: wt(1, '5'), ya: wt(1, 'yang'), ny: wt(1, 'nyerah'), du: wt(1, 'duluan'), ka: wt(1, 'kalah') };
SH(ls(1), ls(2), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(1), { x: 560, y: 1110, z: 1.02 }], [T1.ra, { x: 520, y: 1110, z: 1.08 }, easeOut], [T1.se, { x: 548, y: 1220, z: 1.5 }, ease], [T1.li + .3, { x: 548, y: 1210, z: 1.62 }, ease], [T1.ny, { x: 540, y: 1120, z: 1.1 }, ease], [ls(2), { x: 540, y: 1110, z: 1.16 }, easeIn]], 2);
  const hi = inv(T1.se - .1, T1.se + .3, t) * (1 - inv(T1.ny - .3, T1.ny, t));
  warung(ctx, t, cam, {
    fR: EM(t, [[ls(1), 'sombong', { look: [.8, 0] }], [T1.ny, 'licik', { look: [.8, 0] }]], 3), armsR: { R: [lerp(.3, 2.3, inv(T1.ra - .1, T1.ra + .15, t) * (1 - inv(T1.se, T1.se + .2, t))), .3], L: [.25, -.3] },
    fB: EM(t, [[ls(1), 'bangga', { look: [-.8, 0] }], [T1.ka, 'ngeden', { look: [-.8, .2] }]], 4), armsB: { R: [lerp(.25, 1.0, inv(T1.ta, T1.ta + .2, t)), .9], L: [.25, -.3] },
    bowlR: { fill: 1, glow: hi, face: EF(t, [[ls(1), 'licik']], 5) }, bowlB: { fill: 1, glow: hi },
    glasses: [{ fill: 1 }, { hide: true }, { hide: true }]
  });
  ctx.save(); applyCam(ctx, cam, 1); glint(ctx, PD.bowlR[0], 1180, 120, t, T1.se); glint(ctx, PD.bowlB[0], 1180, 120, t, T1.se + .1); ctx.restore();
  scrTag(ctx, 'TARUHAN', inv(T1.ta, T1.ta + .15, t) * (1 - inv(T1.se - .1, T1.se, t)), '#fff');
  scrTag(ctx, 'LEVEL 5', inv(T1.le, T1.le + .15, t) * (1 - inv(T1.ya - .1, T1.ya, t)), '#ff6a5a', 330, 120);
  scrTag(ctx, 'NYERAH = KALAH', inv(T1.ny, T1.ny + .15, t), '#ffd23a', 330, 92);
});

// ===== foto profil "Budi nangis" = komposisi frame 0 (dirender sekali ke kanvas terpisah) =====
let _hookImg = null;
function hookImage() {
  if (_hookImg) return _hookImg; const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.save(); hookScene(x, 0, cam0(0), 0); x.restore(); _hookImg = c; return c;
}
// gambar frame 0 ke dalam lingkaran (cx,cy,r) layar; R1 = jari-jari saat lingkaran menutupi layar (skala 1)
const R1 = Math.hypot(W, H) / 2;
function hookPhoto(ctx, cx, cy, r) {
  const k = r / R1; ctx.save(); circle(ctx, cx, cy, r); ctx.clip(); ctx.translate(cx, cy); ctx.save(); ctx.scale(k * 2.1, k * 2.1); ctx.drawImage(hookImage(), -W / 2, -H / 2); ctx.restore(); ctx.scale(k, k); ctx.drawImage(hookImage(), -W / 2, -H / 2); ctx.restore();
}
const photoFn = (c, r) => { c.save(); const k = r / R1; c.save(); c.scale(k * 2.1, k * 2.1); c.drawImage(hookImage(), -W / 2, -H / 2); c.restore(); c.scale(k, k); c.drawImage(hookImage(), -W / 2, -H / 2); c.restore(); };

// ===== 2 hukumannya: foto nangisnya jadi foto profil grup keluarga =====
const T2 = { hu: wt(2, 'hukumannya'), fo: wt(2, 'foto'), na: wt(2, 'nangisnya'), ja: wt(2, 'jadi'), f2: wt(2, 'foto', 0, 1), pr: wt(2, 'profil'), gr: wt(2, 'grup'), ke: wt(2, 'keluarga') };
SH(ls(2), ls(3), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(2), { x: 540, y: 1110, z: 1.2 }], [ls(3), { x: 540, y: 1110, z: 1.3 }]], 3);
  blurLayer(ctx, c => warung(c, t, cam, { fR: EF(t, [[ls(2), 'licik', { look: [.8, 0] }]], 6), fB: EF(t, [[ls(2), 'cemas', { look: [-.8, 0] }]], 7), glasses: [{ fill: 1 }, { hide: true }, { hide: true }] }), 10);
  scr(ctx, c => {
    c.fillStyle = 'rgba(20,10,30,.35)'; c.fillRect(0, 0, W, H);
    const up = easeOut(inv(ls(2), ls(2) + .35, t)), ps = 1.65 + .08 * inv(ls(2), ls(3), t);
    const big = easeInOut(inv(T2.pr - .1, T2.pr + .3, t));
    drawHPGrup(c, 540, lerp(1500, 960, up), ps, { t, photo: t > T2.na ? photoFn : null, chats: [['Rani', 'Kalah = PP nangis', false], ['Om Bambang', 'Siap screenshot', false]], k: inv(T2.hu, T2.hu + .2, t) + inv(T2.ja, T2.ja + .2, t) });
    // foto profil membesar dari lingkaran avatar
    if (big > 0) { const ax = 540 - 110 * ps, ay = lerp(1500, 960, up) - 300 * ps; const cx = lerp(ax, 540, big), cy = lerp(ay, 700, big), r = lerp(42 * ps, 300, big);
      c.save(); c.globalAlpha = big; hookPhoto(c, cx, cy, r); circle(c, cx, cy, r); c.lineWidth = 14; c.strokeStyle = '#fff'; c.stroke(); circle(c, cx, cy, r + 7); c.lineWidth = 6; c.strokeStyle = INK; c.stroke(); c.restore(); }
  });
  scrTag(ctx, 'HUKUMANNYA', inv(T2.hu, T2.hu + .15, t) * (1 - inv(T2.na - .1, T2.na, t)), '#fff', 250, 96);
  scrTag(ctx, 'FOTO PROFIL GRUP', inv(T2.pr, T2.pr + .15, t), '#ffd23a', 1130, 84);
});

// ===== 3 Rani makan santai: sesendok, senyum (x2) =====
const T3 = { ra: wt(3, 'rani'), ma: wt(3, 'makan'), sa: wt(3, 'santai'), s1: wt(3, 'sesendok'), y1: wt(3, 'senyum'), s2: wt(3, 'sesendok', 0, 1), y2: wt(3, 'senyum', 0, 1) };
// fase suap: 0 = sendok di mangkuk, 1 = di mulut
const spoonP = (t, t0) => { const a = inv(t0 - .45, t0 - .05, t), b = inv(t0 + .45, t0 + .8, t); return easeInOut(a) * (1 - easeInOut(b)); };
SH(ls(3), ls(4), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(3), { x: 330, y: 1120, z: 1.55 }], [T3.sa, { x: 320, y: 1110, z: 1.68 }, easeOut], [T3.y1, { x: 300, y: 1100, z: 1.82 }, ease], [T3.y2, { x: 290, y: 1095, z: 1.9 }, ease], [ls(4), { x: 300, y: 1100, z: 1.85 }, easeIn]], 2);
  const p = Math.max(spoonP(t, T3.s1 + .2), spoonP(t, T3.s2 + .2), spoonP(t, T3.ma + .1));
  const hx = lerp(PD.bowlR[0] - 40, RX + 95, p), hy = lerp(1225, 1150, p), ang = lerp(.5, -2.6, p);
  warung(ctx, t, cam, {
    fR: EM(t, [[ls(3), 'datar', { look: [.5, .4] }], [T3.y1, 'lega'], [T3.s2, 'datar', { look: [.5, .4] }], [T3.y2, 'bangga']], 8),
    armsR: { R: armTo(RX, 1, hx, hy, -1), L: [.25, -.3] }, rExtra: { headTilt: .06 * p },
    fB: EF(t, [[ls(3), 'cemas', { look: [-.8, 0] }]], 9), bowlR: { fill: lerp(.7, .55, inv(ls(3), ls(4), t)) }, glasses: [{ fill: 1 }, { hide: true }, { hide: true }],
    extra: c => sendok(c, hx, hy, ang, p > .1 && p < .95 ? 1 : 0)
  });
  ctx.save(); applyCam(ctx, cam, 1); for (const h of [T3.y1, T3.y2]) { const k = inv(h, h + .15, t) * (1 - inv(h + .6, h + .75, t)); if (k > 0) sparkle(ctx, RX + 150, 930, 30 * k, k); } ctx.restore();
  scrTag(ctx, 'SANTAI', inv(T3.sa, T3.sa + .15, t) * (1 - inv(T3.s1 - .1, T3.s1, t)), '#fff');
  for (const [h, x] of [[T3.y1, 360], [T3.y2, 720]]) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, 'SENYUM', x, 330, 76, inv(h, h + .15, t), '#ffd23a', INK, -.08); ctx.restore(); }
});

// ===== 4a Budi baru 3 suap =====
const T4 = { bu: wt(4, 'budi'), ba: wt(4, 'baru'), ti: wt(4, '3'), su: wt(4, 'suap'), da: wt(4, 'dan'), li: wt(4, 'lidahnya'), ud: wt(4, 'udah'), ke: wt(4, 'kerasa'), ka: wt(4, 'kayak'), di: wt(4, 'dibakar'), be: wt(4, 'beneran') };
const BITES = [T4.bu + .05, T4.ba + .05, T4.ti + .15];
const cam4 = t => CK(t, [[ls(4), { x: 800, y: 1120, z: 1.6 }], [T4.su, { x: 820, y: 1110, z: 1.75 }, easeOut], [T4.li, { x: 850, y: 1095, z: 2.6 }, easeIn]], 1.5);
const z4 = (() => { const c = cam4(T4.li), p = toScreen(c, BX, MOUTH_Y); return { x: p[0], y: p[1], w: 150, h: 267 }; })();
SH(ls(4), T4.li, { tr: 'portal', zoomOut: z4 }, (ctx, lt, t) => {
  const cam = cam4(t), p = Math.max(...BITES.map(b => spoonP(t, b + .2) * (t < b + .7 ? 1 : 0))), n = BITES.filter(b => t > b + .1).length;
  const hx = lerp(PD.bowlB[0] + 50, BX - 95, p), hy = lerp(1225, 1150, p), ang = lerp(Math.PI - .5, Math.PI + 2.6, p);
  const hot = inv(T4.da - .2, T4.li, t);
  warung(ctx, t, cam, {
    fB: EM(t, [[ls(4), 'ngeden', { look: [-.4, .5] }], [T4.da, { eyes: 'wide', mouth: 'o', sweat: 1, browUp: 1 }]], 10),
    armsB: { R: armTo(BX, -1, hx, hy, -1), L: [.25, -.3] }, budiFX: { red: hot, steam: hot },
    fR: EF(t, [[ls(4), 'sombong', { look: [.8, 0] }]], 11), bowlB: { fill: lerp(.95, .85, n / 3) }, glasses: [{ fill: 1 }, { hide: true }, { hide: true }],
    extra: c => sendok(c, hx, hy, ang, p > .1 && p < .95 ? 1 : 0)
  });
  BITES.forEach((b, i) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, String(i + 1), 330 + i * 210, 360, 120, inv(b + .1, b + .25, t), i === 2 ? '#ff6a5a' : '#fff', INK, -.08); ctx.restore(); });
  scrTag(ctx, 'SUAP', inv(T4.su, T4.su + .15, t), '#ffd23a', 520, 80);
});
// ===== dunia mikro lidah: helper =====
const CAPS = [[200, 0, 74], [540, 0, 80], [880, 0, 74], [370, 1, 56], [710, 1, 56]].map(([x, k, r]) => [x, SURF(x) - r * .55 - (k ? 6 : 0), r]);
const mcOf = (t, t0, t1, z0 = 1.12, z1 = 1.0) => ({ z: lerp(z0, z1, easeOut(inv(t0, t1, t))), x: 0, y: 0 });
// o: { mc, hot, on[], caps 0..1 (jumlah jatuh), capsT (waktu jatuh), capsFace, cold 0..1, water 0..1 (aliran air lewat), milk 0..1, grab 0..1, away 0..1 }
function lidahScene(ctx, t, o) {
  const mc = o.mc || { z: 1, x: 0, y: 0 };
  ctx.save(); mcam(ctx, mc);
  lidahBG(ctx, t, { hot: o.hot, on: o.on });
  SENS.forEach(([x, y], i) => drawSensor(ctx, x, y, 64, { on: o.on ? o.on[i] : o.hot, t }));
  // tetes pedas
  CAPS.forEach(([x, y, r], i) => {
    let cx = x, cy = y, a = 1;
    if (o.fall != null) { const k = clamp(o.fall * 1.6 - i * .12); if (k <= 0) return; cy = lerp(-200, y, easeIn(k)); }
    if (o.away > 0) { const g = PROT[i]; const e = easeInOut(clamp(o.away * 1.3 - i * .06)); cx = lerp(x, g[0] + 900, e); cy = lerp(y - 40 * o.grab, -400, e); }
    else if (o.grab > 0) cy -= 40 * easeOut(o.grab);
    drawKapsaisin(ctx, cx + (o.cold > 0 ? 0 : Math.sin(t * 20 + i) * 3 * (o.hot || 0)), cy, r, { t, face: o.capsFace ? o.capsFace(i) : null });
  });
  // air lewat (tetes biru meluncur di atas tetes pedas, tidak membawanya)
  if (o.water > 0 && o.water < 1) for (let i = 0; i < 7; i++) { const q = clamp(o.water * 1.5 - i * .07); if (q <= 0 || q >= 1) continue; const x = lerp(-150, 1250, q), base = SURF(x) - 40;
    const bump = CAPS.reduce((m, [cx, cy, r]) => Math.max(m, Math.max(0, r * 1.2 - Math.abs(x - cx)) * 1.1), 0);
    drawDrop(ctx, x, base - bump - 30 - (i % 3) * 70, 40 + (i % 2) * 10, { t, wob: 1, face: i === 3 ? EXPR.cemas : null }); }
  // susu: gelombang putih + protein
  if (o.milk > 0) { ctx.save(); ctx.globalAlpha = .35 * clamp(o.milk * 2) * (1 - clamp(o.away || 0)); ctx.fillStyle = '#ffffff'; ctx.beginPath(); const fx = lerp(-700, 1600, clamp(o.milk));
      ctx.moveTo(-700, 700); for (let x = -700; x <= fx; x += 30) ctx.lineTo(x, 720 + 20 * Math.sin(x / 60 + t * 4)); ctx.lineTo(fx, 1100); ctx.lineTo(-700, 1100); ctx.closePath(); ctx.fill(); ctx.restore();
    PROT.forEach(([px, py], i) => { const arr = clamp(o.milk * 1.4 - i * .08); if (arr <= 0) return; const tx = CAPS[i][0] + (i % 2 ? 70 : -70), ty = CAPS[i][1] - 90; let x = lerp(-300, tx, easeOut(arr)), y = lerp(py, ty, easeOut(arr));
      if (o.away > 0) { const e = easeInOut(clamp(o.away * 1.3 - i * .06)); x = lerp(tx, px + 900, e); y = lerp(ty - 40 * o.grab, -400, e); } else if (o.grab > 0) y -= 40 * easeOut(o.grab);
      drawProtein(ctx, x, y, 58, { t, reach: o.grab, ang: Math.atan2(CAPS[i][1] - ty, CAPS[i][0] - tx), face: o.protFace ? o.protFace(i) : EXPR.bangga }); }); }
  ctx.restore();
  if (o.cold > 0) scr(ctx, c => { c.fillStyle = `rgba(120,200,255,${.28 * o.cold})`; c.fillRect(0, 0, W, H); for (let i = 0; i < 22; i++) { const x = (i * 211) % W, y = ((i * 137 + t * 80) % (H * .6)); c.save(); c.globalAlpha = o.cold; c.translate(x, y); c.rotate(t + i); for (let k = 0; k < 3; k++) { c.rotate(Math.PI / 3); line(c, -16, 0, 16, 0, 5, '#ffffff'); } c.restore(); } });
  if (o.hot > .5) scr(ctx, c => { const g = c.createRadialGradient(540, 900, 400, 540, 900, 1200); g.addColorStop(0, 'rgba(255,40,20,0)'); g.addColorStop(1, `rgba(255,40,20,${.35 * (o.hot - .5) * 2 * (.6 + .4 * Math.sin(t * 18))})`); c.fillStyle = g; c.fillRect(0, 0, W, H); });
}
const PROT = [[100, 520], [440, 470], [780, 520], [270, 600], [620, 600]];

// ===== 4b lidahnya udah kerasa kayak dibakar beneran =====
SH(T4.li, ls(5), { tr: 'whip' }, (ctx, lt, t) => {
  const on = SENS.map((_, i) => inv(T4.ke - .1 + i * .12, T4.ke + .15 + i * .12, t));
  const hot = inv(T4.di - .1, T4.di + .2, t);
  lidahScene(ctx, t, { mc: { z: lerp(1.3, 1.0, easeOut(inv(T4.li, T4.ke, t))) + .06 * inv(T4.di, ls(5), t), x: 0, y: 0 }, fall: inv(T4.li, T4.ud + .1, t), on: on.map(v => Math.max(v, hot)), hot: Math.max(hot, .3 * on[1]),
    capsFace: i => EF(t, [[T4.li, 'netral', { look: [0, .6] }], [T4.ke, 'licik', { look: [0, .6] }]], 12 + i) });
  scr(ctx, c => { popText(c, 'LIDAH', 540, 260, 100, inv(T4.li, T4.li + .15, t) * (1 - inv(T4.ke - .1, T4.ke, t)), '#ffb3c0', INK, .05);
    popText(c, 'SENSOR PANAS', 540, 260, 88, inv(T4.ke, T4.ke + .15, t) * (1 - inv(T4.di - .1, T4.di, t)), '#ffd23a', INK, .05);
    popText(c, 'DIKIRA KEBAKAR!', 540, 260, 84, inv(T4.di, T4.di + .15, t), '#ff6a5a', INK, .05); });
  sfxText(ctx, 'WIU WIU', 760, 620, 66, inv(T4.di + .1, T4.di + .2, t), '#fff7b0', .1);
});

// ===== 5 jadi dia sambar air es, segelas penuh =====
const T5 = { ja: wt(5, 'jadi'), di: wt(5, 'dia'), sa: wt(5, 'sambar'), ai: wt(5, 'air'), es: wt(5, 'es'), se: wt(5, 'segelas'), pe: wt(5, 'penuh') };
SH(ls(5), ls(6), { tr: 'portal', zoomOut: (() => { const c = CK(T5.pe + .7, [[0, { x: 860, y: 1090, z: 2.6 }]], 0), p = toScreen(c, BX, MOUTH_Y); return { x: p[0], y: p[1], w: 150, h: 267 }; })() }, (ctx, lt, t) => {
  const grab = easeInOut(inv(T5.sa - .2, T5.sa + .15, t)), lift = inv(T5.es, T5.se + .1, t);
  const cam = CK(t, [[ls(5), { x: 900, y: 1150, z: 1.4 }], [T5.sa, { x: 920, y: 1150, z: 1.5 }, easeOut], [T5.se, { x: 870, y: 1100, z: 1.85 }, ease], [ls(6), { x: 860, y: 1090, z: 2.6 }, easeIn]], 2);
  const g = glassInHand(lift), hand = grab < 1 ? [lerp(BX + 40, g.hand[0], grab), lerp(1200, g.hand[1], grab)] : g.hand;
  const drinkK = inv(T5.se, ls(6), t);
  warung(ctx, t, cam, {
    fB: EM(t, [[ls(5), { eyes: 'flinch', mouth: 'o', sweat: 1 }], [T5.sa, { eyes: 'wide', mouth: 'teeth', sweat: 1 }], [T5.se, { eyes: 'flinch', mouth: 'o', sweat: 1 }]], 13),
    armsB: { R: armTo(BX, -1, hand[0], hand[1], -1), L: [.25, -.3] }, bExtra: { headTilt: -.25 * easeInOut(lift) }, budiFX: { red: 1, steam: 1, tears: .4, fire: (1 - lift) * .8 * inv(ls(5), ls(5) + .2, t) },
    fR: EF(t, [[ls(5), 'sombong', { look: [.8, 0] }]], 14), glasses: [{ hide: true }, { hide: true }, { hide: true }],
    extra: c => drawGelas(c, g.bx, g.by, .82, { liquid: 'air', fill: 1 - .9 * drinkK, ice: true, t, rot: g.rot, frost: 1 })
  });
  scrTag(ctx, 'AIR ES', inv(T5.es, T5.es + .15, t), '#9ed8ff', 330, 120);
  sfxText(ctx, 'GLUK GLUK', 300, 760, 64, inv(T5.pe, T5.pe + .1, t), '#9ed8ff', -.08);
});

// ===== 6 adem. tapi cuma sebentar (lidah dingin, sensor diam) =====
const T6 = { ad: wt(6, 'adem'), ta: wt(6, 'tapi'), cu: wt(6, 'cuma'), se: wt(6, 'sebentar') };
const T7 = { be: wt(7, 'begitu'), di: wt(7, 'dinginnya'), hi: wt(7, 'hilang'), pa: wt(7, 'panasnya'), ba: wt(7, 'balik'), la: wt(7, 'lagi') };
SH(ls(6), ls(8), { tr: 'whip' }, (ctx, lt, t) => {
  const cold = inv(ls(6), T6.ad + .3, t) * (1 - inv(T7.di, T7.hi + .3, t));
  const on = SENS.map((_, i) => Math.max(1 - inv(ls(6), T6.ad + .2, t), inv(T7.pa - .1 + i * .1, T7.pa + .15 + i * .1, t)));
  const hot = inv(T7.ba - .1, T7.ba + .2, t);
  lidahScene(ctx, t, { mc: { z: lerp(1.08, 1.0, easeOut(inv(ls(6), T6.ta, t))) + .08 * inv(T7.pa, ls(8), t), x: 0, y: 0 }, cold, on: on.map(v => Math.max(v, hot)), hot: hot, water: inv(T6.ad - .3, T7.hi + .4, t),
    capsFace: i => EF(t, [[ls(6), { eyes: 'half', mouth: 'flat' }], [T6.cu, 'sombong', { look: [0, -.4] }], [T7.pa, 'licik']], 15 + i) });
  scr(ctx, c => { popText(c, 'ADEM...', 540, 260, 110, inv(T6.ad, T6.ad + .15, t) * (1 - inv(T6.ta - .1, T6.ta, t)), '#bfe9ff', INK, .05);
    popText(c, 'CUMA SEBENTAR', 540, 260, 88, inv(T6.cu, T6.cu + .15, t) * (1 - inv(T7.di - .1, T7.di, t)), '#fff', INK, .05);
    popText(c, 'AIR CUMA LEWAT', 540, 260, 86, inv(T7.di, T7.di + .15, t) * (1 - inv(T7.pa - .1, T7.pa, t)), '#9ed8ff', INK, .05);
    popText(c, 'BALIK LAGI!', 540, 260, 104, inv(T7.ba, T7.ba + .15, t), '#ff6a5a', INK, .05); });
  sfxText(ctx, 'WIU WIU', 760, 620, 66, inv(T7.ba + .1, T7.ba + .2, t), '#fff7b0', .1);
});

// ===== 8 gelas kedua, gelas ketiga, perut kembung, pedasnya tetap =====
const T8 = { g1: wt(8, 'gelas'), ke: wt(8, 'kedua'), g2: wt(8, 'gelas', 0, 1), kt: wt(8, 'ketiga'), pe: wt(8, 'perutnya'), km: wt(8, 'kembung'), pd: wt(8, 'pedasnya'), te: wt(8, 'tetap') };
SH(ls(8), ls(9), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(8), { x: 960, y: 1150, z: 1.45 }], [T8.kt, { x: 950, y: 1150, z: 1.5 }, easeOut], [T8.km, { x: 880, y: 1180, z: 1.6 }, ease], [T8.te, { x: 840, y: 1110, z: 1.75 }, ease], [ls(9), { x: 830, y: 1100, z: 1.8 }, easeIn]], 2);
  const d2 = inv(T8.g1 - .1, T8.ke + .3, t) * (1 - inv(T8.ke + .4, T8.g2, t)), d3 = inv(T8.g2 - .1, T8.kt + .3, t) * (1 - inv(T8.kt + .4, T8.pe, t));
  const g = glassInHand(Math.max(d2, d3)), belly = inv(T8.km - .1, T8.km + .2, t);
  warung(ctx, t, cam, {
    fB: EM(t, [[ls(8), { eyes: 'flinch', mouth: 'o', sweat: 1 }], [T8.km, { eyes: 'spiral', mouth: 'wobble', sweat: 1 }], [T8.te, { eyes: 'x', mouth: 'o', sweat: 1 }]], 20),
    armsB: { R: armTo(BX, -1, g.hand[0], g.hand[1], -1), L: [.25, -.3] }, bExtra: { headTilt: -.25 * easeInOut(Math.max(d2, d3)), bob: -.01 * belly },
    belly, budiFX: { red: 1, steam: 1, tears: .7, fire: inv(T8.pd - .1, T8.te, t) },
    fR: EF(t, [[ls(8), 'sombong', { look: [.8, 0] }]], 21),
    glasses: [{ hide: true }, { fill: t > T8.g2 ? 0 : 1, hide: false }, { fill: t > T8.pe ? 0 : 1 }],
    extra: c => drawGelas(c, g.bx, g.by, .82, { liquid: 'air', fill: t < T8.g2 ? 1 - d2 : 1 - d3, ice: true, t, rot: g.rot, frost: 1 })
  });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const gg = 1 - inv(T8.pe - .1, T8.pe, t); popText(ctx, 'GELAS 2', 330, 330, 90, inv(T8.ke, T8.ke + .15, t) * gg, '#9ed8ff', INK, -.06); popText(ctx, 'GELAS 3', 750, 330, 90, inv(T8.kt, T8.kt + .15, t) * gg, '#9ed8ff', INK, .06); ctx.restore();
  scrTag(ctx, 'KEMBUNG', inv(T8.km, T8.km + .15, t) * (1 - inv(T8.pd - .1, T8.pd, t)), '#fff', 520, 96);
  scrTag(ctx, 'PEDASNYA TETAP', inv(T8.te, T8.te + .15, t), '#ff6a5a', 520, 88);
});

// ===== 9 Rani ngelirik: "Bud, siapin gaya buat foto profil, ya." =====
const T9 = { ra: wt(9, 'rani'), ng: wt(9, 'ngelirik'), bu: wt(9, 'bud'), si: wt(9, 'siapin'), ga: wt(9, 'gaya'), fo: wt(9, 'foto'), pr: wt(9, 'profil'), ya: wt(9, 'ya') };
SH(ls(9), ls(10), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(9), { x: 600, y: 1110, z: 1.25 }], [ls(10), { x: 620, y: 1105, z: 1.35 }]], 3);
  blurLayer(ctx, c => warung(c, t, cam, { hideRani: true, fB: EF(t, [[ls(9), { eyes: 'x', mouth: 'o', sweat: 1 }]], 22), belly: 1, budiFX: { red: 1, steam: 1, tears: .7, fire: .6 }, glasses: [{ fill: 0 }, { fill: 0 }, { fill: 0 }] }), 8);
  scr(ctx, c => {
    const f = EC(t, [[ls(9), 'datar', { look: [.9, 0] }], [T9.bu, 'sombong', { look: [.9, 0] }], [T9.fo, 'licik', { look: [.9, 0] }]], 23);
    const up = easeOut(inv(T9.si - .2, T9.ga, t)), zy = 2250 - 40 * ease(inv(ls(9), ls(10), t)), px = lerp(700, 640, up), py = lerp(2000, 1020, up);
    drawStick(c, C(RANI, { x: 330, y: zy, s: 1800, shadow: false, flip: 1, armLen: 1.3, arms: { L: [.2, -.1], R: up > 0 ? { ik: [(px - 330) / 1800, (py - zy) / 1800], bend: -1 } : [.2, -.1] }, face: f, headTilt: -.04 + Math.sin(t * 5) * .015 }));
    if (up > 0) { c.save(); c.translate(px, py); c.rotate(.12); rrect(c, -130, -240, 260, 480, 30); fillStroke(c, PDP.phone, 8); c.save(); rrect(c, -112, -215, 224, 420, 18); c.clip(); c.fillStyle = '#000'; c.fillRect(-120, -220, 240, 440); c.drawImage(hookImage(), 380, 400, 560, 1000, -112, -215, 224, 420); c.restore();
      circle(c, 0, 170, 30); fillStroke(c, '#fff', 6); c.restore(); }
  });
  scrTag(ctx, 'NGELIRIK', inv(T9.ng, T9.ng + .15, t) * (1 - inv(T9.si - .1, T9.si, t)), '#fff');
  scrTag(ctx, 'SIAPIN GAYA', inv(T9.si, T9.si + .15, t), '#ffd23a');
});

// ===== 10 Budi udah mau angkat tangan, waktu dia lihat gelas Rani =====
const T10 = { bu: wt(10, 'budi'), ud: wt(10, 'udah'), ma: wt(10, 'mau'), an: wt(10, 'angkat'), ta: wt(10, 'tangan'), wa: wt(10, 'waktu'), di: wt(10, 'dia'), li: wt(10, 'lihat'), ge: wt(10, 'gelas'), ra: wt(10, 'rani') };
SH(ls(10), ls(11), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(10), { x: 760, y: 1110, z: 1.4 }], [T10.ta, { x: 780, y: 1060, z: 1.5 }, easeOut], [T10.li - .05, { x: 760, y: 1080, z: 1.5 }, ease], [T10.ge, { x: 380, y: 1200, z: 1.85 }, ease], [ls(11), { x: 330, y: 1210, z: 2.3 }, easeIn]], 2);
  const raise = easeOut(inv(T10.an - .2, T10.ta + .3, t)) * (1 - .6 * easeInOut(inv(T10.wa, T10.li, t)));
  warung(ctx, t, cam, {
    fB: EM(t, [[ls(10), { eyes: 'half', mouth: 'wobble', sweat: 1, look: [0, .6] }], [T10.wa - .1, { eyes: 'half', mouth: 'flat', look: [-.9, .5] }], [T10.li, { eyes: 'wide', mouth: 'o', look: [-.9, .6], browUp: .6 }]], 24),
    armsB: { R: [lerp(.25, 2.9, raise), .1], L: [.25, -.3] }, belly: 1, budiFX: { red: .8, tears: .5, steam: .6 },
    fR: EF(t, [[ls(10), 'bangga', { look: [.8, 0] }], [T10.li + .1, 'cemas', { look: [.8, 0] }]], 25),
    glasses: [{ fill: 0 }, { fill: 0 }, { fill: 0 }],
    extra: null
  });
  ctx.save(); applyCam(ctx, cam, 1); glint(ctx, PD.cupR[0], 1170, 110, t, T10.ge); ctx.restore();
  scrTag(ctx, 'NYERAH?', inv(T10.ta, T10.ta + .15, t) * (1 - inv(T10.wa - .1, T10.wa, t)), '#fff');
});

// ===== 11 isinya putih. susu. (gelas Rani, sarungnya melorot) =====
const T11 = { is: wt(11, 'isinya'), pu: wt(11, 'putih'), su: wt(11, 'susu') };
SH(ls(11), ls(12), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(11), { x: 330, y: 1190, z: 2.3 }], [T11.pu, { x: 325, y: 1180, z: 2.5 }, easeOut], [T11.su, { x: 320, y: 1190, z: 2.25 }, backOut], [ls(12), { x: 320, y: 1190, z: 2.35 }, ease]], 1.5);
  const lift = easeOut(inv(ls(11), T11.pu, t)), drop = easeOut(inv(T11.su - .1, T11.su + .2, t));
  warung(ctx, t, cam, { fR: EF(t, [[ls(11), 'sombong', { look: [.6, .6] }]], 26), fB: EF(t, [[ls(11), 'kaget', { look: [-.9, .5] }]], 27), belly: 1, cupR: false, glasses: [{ fill: 0 }, { fill: 0 }, { fill: 0 }],
    extra: c => { drawGelas(c, PD.cupR[0] + 60 * lift, PD.cupR[1] - 60 * lift, 1, { liquid: 'susu', fill: .9, sleeve: 1 - drop, straw: true, t }); } });
  ctx.save(); applyCam(ctx, cam, 1); glint(ctx, PD.cupR[0] + 60, 1080, 110, t, T11.pu); ctx.restore();
  scrTag(ctx, 'PUTIH?', inv(T11.pu, T11.pu + .15, t) * (1 - inv(T11.su - .1, T11.su, t)), '#fff', 330, 110);
  scrTag(ctx, 'SUSU!', inv(T11.su, T11.su + .15, t), '#ffffff', 330, 150);
});

// ===== 12 "Curang!" =====
SH(ls(12), ls(13), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(12), { x: 700, y: 1110, z: 1.3 }], [ls(13), { x: 700, y: 1110, z: 1.36 }]], 3);
  blurLayer(ctx, c => warung(c, t, cam, { hideBudi: true, fR: EF(t, [[ls(12), 'datar', { look: [.8, 0] }]], 28), glasses: [{ fill: 0 }, { fill: 0 }, { fill: 0 }] }), 8);
  scr(ctx, c => { const sh = Math.sin(t * 60) * 10 * (1 - inv(ls(12), ls(13), t));
    drawStick(c, C(BUDI, { x: 700 + sh, y: 2200, s: 1800, shadow: false, flip: -1, armLen: 1.3, arms: { R: [1.75, .05], L: [.2, -.1] }, face: EC(t, [[ls(12), { eyes: 'normal', mouth: 'teeth', browAng: -.45, sweat: 1, look: [-.6, 0] }]], 29), headTilt: .08 }));
    pedasFX(c, t, 0, {}); });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); popText(ctx, 'CURANG!', 540, 360, 170, inv(ls(12), ls(12) + .12, t), '#ff6a5a', INK, -.08); ctx.restore();
});

// ===== 13 "Nggak ada aturan soal minum, Bud. Kamu aja yang salah pilih." =====
const T13 = { ng: wt(13, 'nggak'), ad: wt(13, 'ada'), at: wt(13, 'aturan'), so: wt(13, 'soal'), mi: wt(13, 'minum'), bu: wt(13, 'bud'), ka: wt(13, 'kamu'), sa: wt(13, 'salah'), pi: wt(13, 'pilih') };
SH(ls(13), ls(14), { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(13), { x: 300, y: 940, z: 1.45 }], [T13.ka, { x: 290, y: 950, z: 1.55 }, ease], [ls(14), { x: 280, y: 960, z: 1.62 }, easeIn]], 2);
  warung(ctx, t, cam, { fR: EM(t, [[ls(13), 'datar', { look: [.6, 0] }], [T13.ka, 'sombong', { look: [.8, 0] }], [T13.pi, 'licik', { look: [.8, 0] }]], 30), armsR: { R: [lerp(.3, 1.2, inv(T13.ka, T13.ka + .2, t)), 1.0], L: [.25, -.3] },
    fB: EF(t, [[ls(13), 'cemas', { look: [-.8, 0] }]], 31), belly: 1, glasses: [{ fill: 0 }, { fill: 0 }, { fill: 0 }], cupR: { sleeve: 0 } });
  scr(ctx, c => drawAturan(c, 560, 560, 1.25, inv(T13.at - .2, T13.at + .1, t), ['1. SEBLAK LV 5', '2. NYERAH = KALAH', '3. KALAH = PP NANGIS'], { missing: inv(T13.mi, T13.mi + .15, t) }));
  scrTag(ctx, 'SALAH PILIH', inv(T13.sa, T13.sa + .15, t), '#ffd23a', 1130, 92);
});

// ===== 14 pedas cabai itu kayak minyak di piring; disiram air doang, nggak bakal lepas =====
const T14 = { pe: wt(14, 'pedas'), ca: wt(14, 'cabai'), ka: wt(14, 'kayak'), mi: wt(14, 'minyak'), pi: wt(14, 'piring'), di: wt(14, 'disiram'), ai: wt(14, 'air'), do: wt(14, 'doang'), ng: wt(14, 'nggak'), le: wt(14, 'lepas') };
function bakCuci(ctx) { // latar wastafel (layar)
  ctx.fillStyle = '#d7eef6'; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = '#b8d9e8'; ctx.lineWidth = 5;
  for (let y = 0; y < H; y += 120) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } for (let x = 0; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  rrect(ctx, 40, 360, 1000, 1000, 80); fillStroke(ctx, '#c4ccd8', 10); rrect(ctx, 90, 410, 900, 900, 60); fillStroke(ctx, '#a9b4c6', 6);
}
SH(ls(14), ls(15), { tr: 'match', zoomOut: { x: 540, y: 820, r: 260 } }, (ctx, lt, t) => {
  const z = lerp(1.0, 1.08, inv(ls(14), T14.di, t)) + .15 * inv(T14.le, ls(15), t), oil = inv(T14.mi - .2, T14.mi + .2, t), wash = inv(T14.ai - .1, T14.le + .2, t);
  scr(ctx, c => {
    c.translate(540, 860); c.scale(z, z); c.translate(-540, -860);
    bakCuci(c);
    // cabai dibelah meneteskan minyak pedas ke piring
    const cy = lerp(-200, 380, easeOut(inv(ls(14), T14.ca + .2, t))) - 300 * inv(T14.pi, T14.di, t);
    drawCabai(c, 520, cy, 3.2, .25, { face: EF(t, [[ls(14), 'licik']], 32), t });
    if (oil > 0 && oil < 1) for (let i = 0; i < 4; i++) { const q = clamp(oil * 1.5 - i * .15); if (q > 0 && q < 1) drawKapsaisin(c, 470 + i * 30, lerp(480, 800, q), 22, { t }); }
    drawPiringMinyak(c, 540, 860, 1.5, { wash, t, face: oil > .5 ? EF(t, [[T14.mi, 'sombong', { look: [0, -.5] }], [T14.le, 'licik']], 33) : null });
    if (oil < 1) { c.save(); c.globalAlpha = 1 - oil; ellipse(c, 540, 860, 300, 110); c.fillStyle = PDP.plate; c.fill(); c.restore(); }
    // gelas air menyiram dari kiri atas
    const pour = easeInOut(inv(T14.di - .3, T14.di, t)) * (1 - easeInOut(inv(T14.le + .1, ls(15), t)));
    if (pour > 0) { drawGelas(c, lerp(-100, 240, pour), lerp(300, 520, pour), 1.2, { liquid: 'air', fill: .8 * (1 - wash * .7), rot: lerp(0, 2.1, pour), t });
      if (wash > 0 && wash < 1) { c.beginPath(); c.moveTo(300, 600); c.quadraticCurveTo(340, 700, 400, 820); c.lineWidth = 40; c.strokeStyle = INK; c.lineCap = 'round'; c.stroke(); c.lineWidth = 28; c.strokeStyle = PDP.water; c.stroke(); } }
  });
  scrTag(ctx, 'KAYAK MINYAK', inv(T14.ka, T14.ka + .15, t) * (1 - inv(T14.di - .1, T14.di, t)), '#ffb02e', 250, 96);
  scrTag(ctx, 'DISIRAM AIR', inv(T14.di, T14.di + .15, t) * (1 - inv(T14.ng - .1, T14.ng, t)), '#9ed8ff', 250, 96);
  scrTag(ctx, 'NGGAK LEPAS!', inv(T14.ng, T14.ng + .15, t), '#ff6a5a', 250, 100);
});

// ===== 15 susu beda: isinya bisa ngiket pedasnya, terus ngebawanya pergi =====
const T15 = { su: wt(15, 'susu'), be: wt(15, 'beda'), is: wt(15, 'isinya'), bi: wt(15, 'bisa'), ng: wt(15, 'ngiket'), pe: wt(15, 'pedasnya'), te: wt(15, 'terus'), nb: wt(15, 'ngebawanya'), pg: wt(15, 'pergi') };
SH(ls(15), ls(16), { tr: 'whip', zoomIn: { x: 540, y: 960, r: 260 } }, (ctx, lt, t) => {
  const away = inv(T15.nb - .1, T15.pg + .4, t), hot = 1 - inv(T15.pg - .1, T15.pg + .3, t);
  lidahScene(ctx, t, { mc: { z: lerp(1.12, 1.0, easeOut(inv(ls(15), T15.is, t))) - .05 * away, x: 0, y: 0 }, hot: hot * (1 - .5 * inv(T15.ng, T15.pe, t)), on: SENS.map(() => hot),
    milk: inv(T15.su - .1, T15.ng, t), grab: inv(T15.ng - .1, T15.pe, t), away,
    capsFace: i => EF(t, [[ls(15), 'licik'], [T15.ng + .1, 'kaget'], [T15.nb + .2, 'meringis']], 40 + i),
    protFace: i => EF(t, [[ls(15), 'bangga'], [T15.ng, 'ngeden'], [T15.pg, 'lega']], 46 + i) });
  scr(ctx, c => { popText(c, 'SUSU', 540, 260, 130, inv(T15.su, T15.su + .15, t) * (1 - inv(T15.is - .1, T15.is, t)), '#ffffff', INK, .05);
    popText(c, 'NGIKET', 540, 260, 120, inv(T15.ng, T15.ng + .15, t) * (1 - inv(T15.te - .1, T15.te, t)), '#ffd23a', INK, .05);
    popText(c, 'DIBAWA PERGI', 540, 260, 96, inv(T15.nb, T15.nb + .15, t), '#9dff7a', INK, .05); });
});

// ===== 16a Budi kalah: angkat tisu, Rani memotret (cekrek) =====
const T16 = { bu: wt(16, 'budi'), ka: wt(16, 'kalah'), sa: wt(16, 'sampai'), se: wt(16, 'sekarang'), fo: wt(16, 'foto'), pr: wt(16, 'profil'), gr: wt(16, 'grup'), ke: wt(16, 'keluarga'), it: wt(16, 'itu'), f2: wt(16, 'foto', 0, 1), di: wt(16, 'dia') };
SH(ls(16), T16.sa, { tr: 'whip' }, (ctx, lt, t) => {
  const cam = CK(t, [[ls(16), { x: 560, y: 1100, z: 1.1 }], [T16.ka, { x: 600, y: 1100, z: 1.2 }, easeOut], [T16.sa, { x: 620, y: 1090, z: 1.3 }, easeIn]], 2);
  const shot = T16.ka + .15;
  warung(ctx, t, cam, {
    fB: EM(t, [[ls(16), { eyes: 'spiral', mouth: 'wobble', sweat: 1 }]], 50), armsB: { R: [2.9, .1], L: [.25, -.3] }, belly: 1, budiFX: { red: 1, tears: 1, steam: 1, fire: .7 },
    fR: EM(t, [[ls(16), 'licik', { look: [.8, 0] }], [shot, 'bangga']], 51), armsR: { R: armTo(RX, 1, RX + 150, 1060, -1), L: [.25, -.3] },
    glasses: [{ fill: 0 }, { fill: 0 }, { fill: 0 }], cupR: { sleeve: 0 },
    extra: c => { rrect(c, RX + 120, 980, 70, 130, 12); fillStroke(c, PDP.phone, 6); }
  });
  flash(ctx, t, shot, .16);
  sfxText(ctx, 'CEKREK!', 330, 700, 80, inv(shot, shot + .08, t), '#fff', -.1);
  scrTag(ctx, 'KALAH', inv(T16.ka, T16.ka + .15, t), '#ff6a5a', 330, 140);
});
// ===== 16b sampai sekarang, foto profil grup keluarga itu foto dia -> masuk ke foto = frame 0 (loop) =====
SH(T16.sa, ENDT, { tr: 'none' }, (ctx, lt, t) => {
  const ps = 1.9, py = 980, ax = 540 - 110 * ps, ay = py - 300 * ps;
  const z = easeIn(inv(T16.it - .1, ENDT - .14, t)), push = easeOut(inv(T16.sa, T16.fo, t));
  scr(ctx, c => {
    c.fillStyle = '#2a2f4a'; c.fillRect(0, 0, W, H);
    // HP mendekat lalu kamera menyelam ke lingkaran avatar (zoom geometris; avatar bergeser ke tengah layar)
    const r0 = 42 * ps * (1 + .05 * push), K = (1 + .05 * push) * Math.pow(R1 / r0, z), e = easeInOut(z);
    const sx = lerp(ax, 540, e), sy = lerp(ay, 960, e), cx = ax - (sx - 540) / K, cy = ay - (sy - 960) / K;
    c.save(); c.translate(540, 960); c.scale(K, K); c.translate(-cx, -cy);
    drawHPGrup(c, 540, py, ps, { t, photo: photoFn, chats: [['Om Bambang', 'wkwkwk', false], ['Ibu', 'Kasihan anakku', false], ['Rani', 'Deal is deal', true]], k: inv(T16.se, T16.se + .2, t) + inv(T16.pr, T16.pr + .2, t) + inv(T16.ke, T16.ke + .2, t) });
    c.restore();
    // lingkaran foto (geometri sama dengan avatar) sampai menutupi layar = frame 0
    if (z > 0) { const r = 42 * ps * K; hookPhoto(c, sx, sy, r); circle(c, sx, sy, r); c.lineWidth = 8 * (1 - z); c.strokeStyle = '#fff'; c.stroke(); }
  });
  ctx.save(); applyCam(ctx, { x: 540, y: 960, z: 1 }, 1); glint(ctx, ax, ay, 90, t, T16.f2); ctx.restore();
  scrTag(ctx, 'SAMPAI SEKARANG', inv(T16.sa, T16.sa + .15, t) * (1 - inv(T16.it - .1, T16.it, t)), '#fff', 1640, 80);
});
