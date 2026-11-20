// ---------- Aset episode "Jemuran apek" (20-11-2026) ----------
// Aturan v6: satu fungsi per benda, palet JMP terkunci, tata letak JL terkunci. Latar = rumahBG() (datar, satu skala).
const JMP = {
  wallTop: '#ffe7c7', wallBot: '#f7cf9e', stripe: 'rgba(255,255,255,.22)', skirt: '#fff6e6', floor: '#c98f5b', floorDk: '#a9703f', floorLn: 'rgba(90,50,20,.25)',
  winFrame: '#fffaf0', sky: '#3b4a78', skyDk: '#26305a', cloud: '#5a6796', rain: '#bfe3ff', curtain: '#ef8aa8', curtainDk: '#c9607f',
  rack: '#d7dde9', rackDk: '#8f9ab0', shirt: '#9fd3f5', shirtDk: '#6fb1df', shirtWet: '#5d97c6', handuk: '#ffd23a', handukDk: '#e0a91a', kaos: '#2f9b5a', kaosDk: '#1f7340',
  stink: '#8dbb3a', stinkDk: '#5e8a1f', flower: '#ff7fb6', flowerDk: '#d94d8c', petal2: '#ffd1e6',
  det: '#e8eef6', detMurah: '#c9d3e2', detGold: '#ffcf3a', detGoldDk: '#d99a1c', bucket: '#4ab3f0', bucketDk: '#2a7fbf', water: '#aee0ff', waterDk: '#6fbbe8', foam: '#ffffff',
  galon: 'rgba(170,220,255,.75)', galonCap: '#2f6fd1', pew: '#ff8fc2', pewDk: '#d95b98', pewCap: '#a03a8a',
  fiber: '#a9d8f7', fiberDk: '#6aa7d4', fiberHi: '#e4f4ff', microBg: '#163a4a', bact: '#b48be8', bactDk: '#7c56b8', hot: '#ff6a3a',
  mop: '#9aa08f', mopDk: '#6b7062', stick: '#c68a55', table: '#c68a55', tableDk: '#8a5a34',
};
// Tata letak rumah (terkunci). Tokoh berdiri di lantai y = 1560 (s 600). Dinding sampai y 1390.
const JL = { floor: 1390, feet: 1560, win: [1000, 720], clock: [210, 560], rack: [600, 1540], rani: 300, budi: -120, ibuIn: -60, door: -700,
  table: [-420, 1560], bucket: [-150, 1560], fan: [1060, 1600], galon: [-330, 1560] };

// ===== LATAR: dinding krem bergaris + jendela hujan + jam + pintu + lantai papan (depth 1, datar) =====
// o: { rain 0..1, flash 0..1, jam (jam dinding), fast (jarum berputar), night 0..1, door 0..1 (terbuka) }
function rumahBG(ctx, t, cam, o = {}) {
  const P = JMP, F = JL.floor; applyCam(ctx, cam, 1);
  const g = ctx.createLinearGradient(0, -400, 0, F); g.addColorStop(0, P.wallTop); g.addColorStop(1, P.wallBot);
  ctx.fillStyle = g; ctx.fillRect(-2600, -2600, 6400, 2600 + F);
  ctx.fillStyle = P.stripe; for (let x = -2550; x < 3700; x += 160) ctx.fillRect(x, -2600, 70, 2600 + F);
  rrect(ctx, -2600, F - 46, 6400, 46, 0); fillStroke(ctx, P.skirt, 6);
  // lantai papan
  ctx.fillStyle = P.floor; ctx.fillRect(-2600, F, 6400, 3000);
  ctx.strokeStyle = P.floorLn; ctx.lineWidth = 5; for (let y = F + 70; y < F + 1500; y += 90) { ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
  for (let r = 0; r < 16; r++) for (let x = -2600 + (r % 2) * 210; x < 3800; x += 420) { const y = F + r * 90; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 70 + (r ? 20 : 0)); ctx.stroke(); }
  line(ctx, -2600, F, 3800, F, 7);
  drawJendela(ctx, JL.win[0], JL.win[1], 1, t, o);
  drawWallClock(ctx, JL.clock[0], JL.clock[1], 105, o.jam == null ? 8 : o.jam, o.fast || 0);
  // pintu (Ibu masuk dari kiri)
  ctx.save(); ctx.translate(JL.door, F); rrect(ctx, -170, -700, 340, 700, 10); fillStroke(ctx, '#3a2a40', 8);
  const op = clamp(o.door || 0); ctx.beginPath(); ctx.moveTo(-160, -690); ctx.lineTo(-160 + 320 * (1 - op * .7), -690 + 40 * op); ctx.lineTo(-160 + 320 * (1 - op * .7), -10 - 40 * op); ctx.lineTo(-160, -10); ctx.closePath(); fillStroke(ctx, '#b07a48', 7);
  circle(ctx, -160 + 290 * (1 - op * .7), -340, 14); fillStroke(ctx, '#ffd23a', 5); ctx.restore();
  // rak dinding kecil dengan pot
  ctx.save(); ctx.translate(-330, 760); rrect(ctx, -150, 0, 300, 26, 8); fillStroke(ctx, P.table, 6);
  rrect(ctx, -110, -90, 80, 90, 10); fillStroke(ctx, '#e8453c', 6); ellipse(ctx, -70, -110, 50, 34); fillStroke(ctx, '#58b94c', 6);
  rrect(ctx, 30, -70, 90, 70, 8); fillStroke(ctx, '#7fc6e8', 6); ctx.restore();
  if (o.night > 0) { ctx.fillStyle = `rgba(30,30,80,${.12 * o.night})`; ctx.fillRect(-2600, -2600, 6400, 6400); }
}
function drawJendela(ctx, x, y, s, t, o = {}) {
  const P = JMP, w = 360, h = 460, rain = o.rain == null ? 1 : o.rain;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -w / 2 - 26, -h / 2 - 26, w + 52, h + 52, 16); fillStroke(ctx, P.winFrame, 8);
  ctx.save(); rrect(ctx, -w / 2, -h / 2, w, h, 6); ctx.clip();
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, P.skyDk); g.addColorStop(1, P.sky); ctx.fillStyle = g; ctx.fillRect(-w, -h, w * 2, h * 2);
  if (o.flash > 0) { ctx.fillStyle = `rgba(255,255,240,${.85 * o.flash})`; ctx.fillRect(-w, -h, w * 2, h * 2); }
  for (let i = 0; i < 4; i++) { const cx = -160 + i * 120 + Math.sin(t * .3 + i) * 10; ellipse(ctx, cx, -h / 2 + 40, 110, 60); ctx.fillStyle = P.cloud; ctx.fill(); }
  ctx.fillStyle = '#2e6b3a'; ctx.beginPath(); ctx.moveTo(-w, h / 2); ctx.lineTo(-w, 120); ctx.quadraticCurveTo(-60, 60, 60, 130); ctx.quadraticCurveTo(140, 90, w, 110); ctx.lineTo(w, h / 2); ctx.closePath(); ctx.fill();
  if (rain > 0) { ctx.strokeStyle = P.rain; ctx.lineWidth = 4; ctx.globalAlpha = rain; const r = rng(9);
    for (let i = 0; i < 46; i++) { const rx = r() * w * 1.3 - w * .65, sp = 900 + r() * 300, ry = ((r() * h + t * sp) % (h + 80)) - h / 2 - 40; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 10, ry + 46); ctx.stroke(); }
    ctx.globalAlpha = 1; }
  ctx.restore();
  line(ctx, 0, -h / 2, 0, h / 2, 10, P.winFrame); line(ctx, -w / 2, 0, w / 2, 0, 10, P.winFrame);
  rrect(ctx, -w / 2, -h / 2, w, h, 6); fillStroke(ctx, null, 7); line(ctx, 0, -h / 2, 0, h / 2, 5); line(ctx, -w / 2, 0, w / 2, 0, 5);
  // gorden
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * (w / 2 + 40), -h / 2 - 50); ctx.lineTo(sd * (w / 2 - 50), -h / 2 - 50); ctx.quadraticCurveTo(sd * (w / 2 - 10), 0, sd * (w / 2 + 10), h / 2 + 40); ctx.lineTo(sd * (w / 2 + 70), h / 2 + 40); ctx.closePath(); fillStroke(ctx, P.curtain, 6);
    ctx.strokeStyle = P.curtainDk; ctx.lineWidth = 5; for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(sd * (w / 2 - 50 + k * 30), -h / 2 - 40); ctx.quadraticCurveTo(sd * (w / 2 - 10 + k * 22), 0, sd * (w / 2 + 10 + k * 20), h / 2 + 30); ctx.stroke(); } }
  rrect(ctx, -w / 2 - 90, -h / 2 - 64, w + 180, 22, 11); fillStroke(ctx, '#b07a48', 6);
  ctx.restore();
}

// ===== KEMEJA berhanger. (x,y) = kait hanger. o: { t, col, colDk, wet 0..1, stink 0..1, face, rot, hanger:false, fresh 0..1, sway } =====
function kemejaPath(ctx) {
  ctx.beginPath(); ctx.moveTo(-40, 40); ctx.lineTo(-105, 62); ctx.lineTo(-160, 150); ctx.lineTo(-118, 176); ctx.lineTo(-92, 140); ctx.lineTo(-96, 330);
  ctx.quadraticCurveTo(0, 346, 96, 330); ctx.lineTo(92, 140); ctx.lineTo(118, 176); ctx.lineTo(160, 150); ctx.lineTo(105, 62); ctx.lineTo(40, 40); ctx.quadraticCurveTo(0, 62, -40, 40); ctx.closePath();
}
function drawKemeja(ctx, x, y, s = 1, o = {}) {
  const P = JMP, t = o.t || 0, wet = clamp(o.wet || 0), col = o.col || P.shirt, dk = o.colDk || P.shirtDk;
  ctx.save(); ctx.translate(x, y); ctx.rotate((o.rot || 0) + Math.sin(t * 1.6 + x * .01) * .03 * (o.sway == null ? 1 : o.sway)); ctx.scale(s, s);
  if (o.hanger !== false) { ctx.beginPath(); ctx.arc(0, -8, 14, Math.PI, 0); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.moveTo(14, -8); ctx.lineTo(0, 30); ctx.lineTo(-120, 70); ctx.lineTo(120, 70); ctx.lineTo(0, 30); ctx.lineWidth = 7; ctx.stroke(); }
  kemejaPath(ctx); ctx.fillStyle = wet > 0 ? mixC(col, P.shirtWet, wet * .8) : col; ctx.fill();
  shadeShape(ctx, () => kemejaPath(ctx), 1, .14, .35, [-160, 40, 320, 300]);
  ctx.save(); kemejaPath(ctx); ctx.clip();
  rrect(ctx, 30, 150, 46, 50, 6); ctx.lineWidth = 4; ctx.strokeStyle = dk; ctx.stroke();
  ctx.fillStyle = dk; for (let i = 0; i < 5; i++) { circle(ctx, 0, 90 + i * 50, 6); ctx.fill(); }
  line(ctx, 0, 60, 0, 340, 3, dk);
  if (wet > 0) { ctx.fillStyle = `rgba(40,90,150,${.18 * wet})`; for (let i = 0; i < 6; i++) { ellipse(ctx, -70 + (i % 3) * 70, 160 + Math.floor(i / 3) * 110, 40, 26); ctx.fill(); } }
  ctx.restore();
  kemejaPath(ctx); fillStroke(ctx, null, 6);
  // kerah
  ctx.beginPath(); ctx.moveTo(-40, 40); ctx.lineTo(-10, 100); ctx.lineTo(0, 62); ctx.lineTo(10, 100); ctx.lineTo(40, 40); ctx.quadraticCurveTo(0, 30, -40, 40); fillStroke(ctx, '#ffffff', 5);
  ctx.restore();
  if (wet > 0) for (let i = 0; i < 3; i++) { const q = (t * 1.2 + i / 3) % 1; drawTetes(ctx, x + (-60 + i * 60) * s, y + (345 + q * 160) * s, 9 * s, (1 - q) * wet); }
  if (o.face) propFace(ctx, x, y + 205 * s, 150 * s, o.face, { t });
  if (o.stink > 0) stink(ctx, x, y + 40 * s, .9 * s, t, o.stink);
  if (o.fresh > 0) { ctx.save(); ctx.globalAlpha = o.fresh; for (let i = 0; i < 4; i++) { const a = t * 2 + i * 1.6; sparkle4(ctx, x + Math.cos(a) * 170 * s, y + (180 + Math.sin(a) * 120) * s, 22 * s); } ctx.restore(); }
}
function drawTetes(ctx, x, y, r, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.beginPath(); ctx.moveTo(x, y - r * 1.8); ctx.quadraticCurveTo(x + r, y - r * .3, x + r, y + r * .2); ctx.arc(x, y + r * .2, r, 0, Math.PI); ctx.quadraticCurveTo(x - r, y - r * .3, x, y - r * 1.8); fillStroke(ctx, JMP.water, Math.max(2, r * .3)); ctx.restore();
}
function sparkle4(ctx, x, y, r) { ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, rr = i % 2 ? r * .3 : r; i ? ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); fillStroke(ctx, '#fff7b0', Math.max(2, r * .15)); }
// handuk / kaos tersampir di batang. (x,y) = titik di batang.
function drawHanduk(ctx, x, y, s = 1, o = {}) {
  const P = JMP, wet = clamp(o.wet || 0); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const b = () => { ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-86, 230); ctx.lineTo(-30, 222); ctx.lineTo(-24, 120); ctx.lineTo(24, 120); ctx.lineTo(30, 260); ctx.lineTo(90, 252); ctx.lineTo(90, 0); ctx.quadraticCurveTo(0, -24, -90, 0); ctx.closePath(); };
  b(); ctx.fillStyle = mixC(o.col || P.handuk, '#7a8aa0', wet * .35); ctx.fill(); shadeShape(ctx, b, 1, .15, .4, [-90, -20, 180, 280]);
  ctx.save(); b(); ctx.clip(); ctx.fillStyle = o.colDk || P.handukDk; ctx.fillRect(-100, 180, 200, 16); ctx.fillRect(-100, 206, 200, 8); ctx.restore(); b(); fillStroke(ctx, null, 6);
  ctx.restore();
}
function drawKaos(ctx, x, y, s = 1, o = {}) {
  const P = JMP; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin((o.t || 0) * 1.5 + 2) * .03); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, -8, 14, Math.PI, 0); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.moveTo(14, -8); ctx.lineTo(0, 30); ctx.lineTo(-110, 66); ctx.lineTo(110, 66); ctx.lineTo(0, 30); ctx.lineWidth = 7; ctx.stroke();
  const b = () => { ctx.beginPath(); ctx.moveTo(-38, 40); ctx.lineTo(-100, 60); ctx.lineTo(-140, 120); ctx.lineTo(-100, 146); ctx.lineTo(-86, 126); ctx.lineTo(-88, 290); ctx.lineTo(88, 290); ctx.lineTo(86, 126); ctx.lineTo(100, 146); ctx.lineTo(140, 120); ctx.lineTo(100, 60); ctx.lineTo(38, 40); ctx.quadraticCurveTo(0, 80, -38, 40); ctx.closePath(); };
  b(); ctx.fillStyle = o.col || P.kaos; ctx.fill(); shadeShape(ctx, b, 1, .15, .4, [-140, 40, 280, 250]); b(); fillStroke(ctx, null, 6);
  text(ctx, 'B', 0, 190, 70, '#fff', INK, 8); ctx.restore();
}
// Jemuran berdiri (dua kaki A + batang atas). (x,y) = tengah lantai. Batang gantung di y - 640, batang handuk y - 470.
// o: { t, spread 0..1 (jarak antar baju), shirt (tampilkan kemeja Rani), wet, stink, face (wajah kemeja), fresh, others:false }
// sway kemeja diperbesar oleh angin kipas (o.wind)
const RACK = { bar: -640, low: -470, half: 300 };
function rackSlots(spread) { const sp = clamp(spread || 0); return { kaos: lerp(-150, -250, sp), shirt: lerp(-40, 40, sp), handuk: lerp(90, 240, sp) }; }
function drawJemuran(ctx, x, y, s = 1, o = {}) {
  const P = JMP, t = o.t || 0, H2 = RACK.half; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sd of [-1, 1]) { line(ctx, sd * H2, RACK.bar - 20, sd * (H2 + 70), 0, 14, INK); line(ctx, sd * H2, RACK.bar - 20, sd * (H2 + 70), 0, 7, P.rack); line(ctx, sd * H2, RACK.bar - 20, sd * (H2 - 70), 0, 14, INK); line(ctx, sd * H2, RACK.bar - 20, sd * (H2 - 70), 0, 7, P.rack); }
  line(ctx, -H2 - 20, RACK.bar, H2 + 20, RACK.bar, 16, INK); line(ctx, -H2 - 20, RACK.bar, H2 + 20, RACK.bar, 8, P.rack);
  line(ctx, -H2 + 30, RACK.low, H2 - 30, RACK.low, 14, INK); line(ctx, -H2 + 30, RACK.low, H2 - 30, RACK.low, 7, P.rack);
  ctx.restore();
  const sl = rackSlots(o.spread);
  if (o.others !== false) { drawKaos(ctx, x + sl.kaos * s, y + (RACK.bar + 6) * s, .8 * s, { t }); drawHanduk(ctx, x + sl.handuk * s, y + RACK.low * s, .85 * s, { wet: o.wet }); }
  if (o.shirt !== false) drawKemeja(ctx, x + sl.shirt * s, y + (RACK.bar + 6) * s, .85 * s, { t, wet: o.wet, stink: o.stink, face: o.face, fresh: o.fresh, rot: (o.wind || 0) * (.12 + .06 * Math.sin(t * 9)) });
}

// ===== DETERJEN: murah (kantong plastik) / premium (botol emas bermahkota). (x,y) = tengah dasar. o: { premium, face, t, glow } =====
function drawDeterjen(ctx, x, y, s = 1, o = {}) {
  const P = JMP; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 110, 14); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  if (o.premium) {
    const b = () => { ctx.beginPath(); ctx.moveTo(-90, 0); ctx.lineTo(-96, -200); ctx.quadraticCurveTo(-90, -250, -40, -258); ctx.lineTo(40, -258); ctx.quadraticCurveTo(90, -250, 96, -200); ctx.lineTo(90, 0); ctx.closePath(); };
    b(); ctx.fillStyle = P.detGold; ctx.fill(); shadeShape(ctx, b, 1, .2, .35, [-96, -258, 192, 258]); b(); fillStroke(ctx, null, 7);
    rrect(ctx, -34, -300, 68, 46, 8); fillStroke(ctx, '#ffffff', 6);
    ctx.beginPath(); ctx.moveTo(-50, -300); ctx.lineTo(-50, -340); ctx.lineTo(-25, -318); ctx.lineTo(0, -350); ctx.lineTo(25, -318); ctx.lineTo(50, -340); ctx.lineTo(50, -300); ctx.closePath(); fillStroke(ctx, '#fff3a8', 5);
    rrect(ctx, -76, -150, 152, 64, 10); fillStroke(ctx, '#ffffff', 5); text(ctx, 'PREMIUM', 0, -116, 30, P.detGoldDk, INK, 0);
    text(ctx, 'Rp', 0, -50, 34, '#fff', INK, 6);
  } else {
    const b = () => { ctx.beginPath(); ctx.moveTo(-80, 0); ctx.lineTo(-88, -190); ctx.lineTo(-60, -214); ctx.lineTo(-30, -196); ctx.lineTo(0, -216); ctx.lineTo(30, -196); ctx.lineTo(60, -214); ctx.lineTo(88, -190); ctx.lineTo(80, 0); ctx.closePath(); };
    b(); ctx.fillStyle = P.detMurah; ctx.fill(); shadeShape(ctx, b, 1, .16, .35, [-88, -216, 176, 216]); b(); fillStroke(ctx, null, 6);
    rrect(ctx, -64, -150, 128, 56, 8); fillStroke(ctx, '#ffffff', 5); text(ctx, 'MURAH', 0, -120, 30, '#e5392f', INK, 0);
    for (let i = 0; i < 3; i++) { circle(ctx, -40 + i * 40, -50, 14); fillStroke(ctx, '#ffffff', 4); }
  }
  ctx.restore();
  if (o.face) propFace(ctx, x, y - (o.premium ? 70 : 60) * s, 120 * s, o.face, { t: o.t || 0 });
  if (o.glow != null) glint(ctx, x - 40 * s, y - 200 * s, 100 * s, o.t || 0, o.glow);
}
// ===== EMBER. (x,y) = tengah dasar. o: { water 0..1, foam 0..1, shirt 0..1 (kemeja terendam), hot 0..1 (uap + merah), label, face, t, slosh } =====
function drawEmber(ctx, x, y, s = 1, o = {}) {
  const P = JMP, t = o.t || 0, hot = clamp(o.hot || 0); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 150, 16); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  ctx.beginPath(); ctx.arc(0, -200, 150, Math.PI * 1.05, Math.PI * 1.95); ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#d7dde9'; ctx.stroke();
  ellipse(ctx, 0, -200, 140, 30); fillStroke(ctx, '#e9f6ff', 6);
  const w = clamp(o.water == null ? 1 : o.water);
  if (w > 0) { const sl = Math.sin(t * 6) * 6 * (o.slosh || 0); ellipse(ctx, 0, -200 + 14 * (1 - w), 126, 24); ctx.fillStyle = hot > 0 ? mixC(P.water, '#ffc2a8', hot) : P.water; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = P.waterDk; ctx.stroke();
    if (o.shirt > 0) { ctx.save(); ellipse(ctx, 0, -200, 120, 22); ctx.clip(); ctx.globalAlpha = o.shirt; ctx.fillStyle = P.shirtWet; ellipse(ctx, 10 + sl, -196, 80, 14); ctx.fill(); line(ctx, -40 + sl, -200, 40 + sl, -192, 4, P.shirtDk); ctx.restore(); }
    if (o.foam > 0) { ctx.fillStyle = P.foam; const r = rng(4); for (let i = 0; i < 9; i++) { circle(ctx, -100 + i * 25 + Math.sin(t * 3 + i) * 4, -206 - r() * 14 - o.foam * 20, (12 + r() * 14) * o.foam); fillStroke(ctx, P.foam, 3); } } }
  const b = () => { ctx.beginPath(); ctx.moveTo(-140, -200); ctx.lineTo(-110, 0); ctx.lineTo(110, 0); ctx.lineTo(140, -200); ctx.ellipse(0, -200, 140, 30, 0, 0, Math.PI, false); ctx.closePath(); };
  b(); ctx.fillStyle = P.bucket; ctx.fill(); shadeShape(ctx, b, 1, .18, .3, [-140, -230, 280, 230]); b(); fillStroke(ctx, null, 7);
  line(ctx, -136, -178, 136, -178, 4, P.bucketDk);
  if (o.label) { rrect(ctx, -70, -62, 140, 50, 8); fillStroke(ctx, '#fffaf0', 5); text(ctx, o.label, 0, -36, 28, INK, INK, 0); }
  ctx.restore();
  if (hot > 0) for (let i = 0; i < 3; i++) { const q = (t * .7 + i / 3) % 1; ctx.save(); ctx.globalAlpha = hot * (1 - q) * .8; ctx.beginPath(); for (let j = 0; j < 10; j++) { const yy = y - 230 * s - j * 18 * s - q * 120 * s, xx = x + (i - 1) * 60 * s + Math.sin(t * 4 + j * .8 + i) * 14 * s; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 10 * s; ctx.strokeStyle = '#ffffff'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  if (o.face) propFace(ctx, x, y - 125 * s, 110 * s, o.face, { t });
}
// ===== GALON air. (x,y) = tengah dasar (posisi tegak). o: { fill 0..1, rot, face, t } =====
function drawGalon(ctx, x, y, s = 1, o = {}) {
  const P = JMP, f = clamp(o.fill == null ? 1 : o.fill); ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  const b = () => { ctx.beginPath(); ctx.moveTo(-90, 0); ctx.quadraticCurveTo(-110, 0, -110, -40); ctx.lineTo(-110, -230); ctx.quadraticCurveTo(-110, -280, -50, -300); ctx.lineTo(-30, -330); ctx.lineTo(30, -330); ctx.lineTo(50, -300); ctx.quadraticCurveTo(110, -280, 110, -230); ctx.lineTo(110, -40); ctx.quadraticCurveTo(110, 0, 90, 0); ctx.closePath(); };
  b(); ctx.fillStyle = P.galon; ctx.fill();
  if (f > 0) { ctx.save(); b(); ctx.clip(); ctx.fillStyle = P.water; ctx.fillRect(-130, -310 * f, 260, 310 * f + 10); ctx.restore(); }
  ctx.fillStyle = 'rgba(255,255,255,.5)'; rrect(ctx, -80, -250, 22, 210, 11); ctx.fill();
  for (const yy of [-90, -170]) line(ctx, -108, yy, 108, yy, 4, 'rgba(60,110,170,.6)');
  b(); fillStroke(ctx, null, 6); rrect(ctx, -36, -352, 72, 26, 6); fillStroke(ctx, P.galonCap, 5);
  ctx.restore();
  if (o.face) propFace(ctx, x, y - 140 * s, 120 * s, o.face, { t: o.t || 0 });
}
// ===== PEWANGI (botol pink bergambar bunga). (x,y) = tengah dasar. o: { rot, pour 0..1 (aliran dari mulut), fill, face, t } =====
function drawPewangi(ctx, x, y, s = 1, o = {}) {
  const P = JMP, t = o.t || 0; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  const b = () => { ctx.beginPath(); ctx.moveTo(-70, 0); ctx.quadraticCurveTo(-86, 0, -86, -30); ctx.lineTo(-80, -190); ctx.quadraticCurveTo(-70, -230, -30, -236); ctx.lineTo(30, -236); ctx.quadraticCurveTo(70, -230, 80, -190); ctx.lineTo(86, -30); ctx.quadraticCurveTo(86, 0, 70, 0); ctx.closePath(); };
  b(); ctx.fillStyle = P.pew; ctx.fill(); shadeShape(ctx, b, 1, .2, .35, [-86, -236, 172, 236]); b(); fillStroke(ctx, null, 7);
  rrect(ctx, -30, -276, 60, 44, 8); fillStroke(ctx, P.pewCap, 6);
  circle(ctx, 0, -110, 52); fillStroke(ctx, '#ffffff', 5); drawBunga(ctx, 0, -110, 34, t * .5);
  ctx.beginPath(); ctx.arc(-26, -270, 22, 0, TAU); ctx.restore();
  if (o.pour > 0) { // aliran pink dari mulut botol (mulut ada di -276 lokal, diputar)
    const a = o.rot || 0, mx = x + Math.sin(a) * 276 * s, my = y - Math.cos(a) * 276 * s;
    ctx.save(); ctx.globalAlpha = clamp(o.pour); ctx.beginPath(); ctx.moveTo(mx, my); ctx.quadraticCurveTo(mx + 30 * s, my + 20 * s, mx + 40 * s, my + (o.drop || 380) * s); ctx.lineWidth = 30 * s; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 20 * s; ctx.strokeStyle = P.pew; ctx.stroke(); ctx.restore();
  }
  if (o.face) propFace(ctx, x, y - 50 * s, 110 * s, o.face, { t });
}
function drawBunga(ctx, x, y, r, rot = 0, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); ctx.translate(x, y); ctx.rotate(rot);
  for (let i = 0; i < 5; i++) { const ang = i / 5 * TAU; circle(ctx, Math.cos(ang) * r * .55, Math.sin(ang) * r * .55, r * .45); fillStroke(ctx, JMP.flower, Math.max(2, r * .09)); }
  circle(ctx, 0, 0, r * .3); fillStroke(ctx, '#ffd23a', Math.max(2, r * .09)); ctx.restore();
}
// awan wangi (kumpulan bunga melayang), (x,y) pusat, k kepadatan 0..1
function drawWangi(ctx, x, y, r, t, k = 1, n = 14, sz = 1) {
  if (k <= 0) return; const q = rng(13);
  for (let i = 0; i < n; i++) { const a = q() * TAU, d = Math.sqrt(q()) * r, ph = q() * TAU; drawBunga(ctx, x + Math.cos(a) * d + Math.sin(t * 1.3 + ph) * 18, y + Math.sin(a) * d * .7 + Math.cos(t * 1.1 + ph) * 14, (18 + q() * 16) * sz, t + ph, k * (i / n < k ? 1 : 0)); }
}
// ===== KAIN PEL kotor (untuk angan-angan bau). (x,y) = ujung bawah kain. =====
function drawKainPel(ctx, x, y, s = 1, t = 0) {
  const P = JMP; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(ctx, 0, -120, 20, -520, 18, INK); line(ctx, 0, -120, 20, -520, 10, P.stick);
  for (let i = 0; i < 9; i++) { const xx = -90 + i * 22, sw = Math.sin(t * 3 + i) * 6; ctx.beginPath(); ctx.moveTo(xx * .5, -130); ctx.quadraticCurveTo(xx + sw, -60, xx + sw * 2, 0); ctx.lineWidth = 22; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 14; ctx.strokeStyle = i % 2 ? P.mop : P.mopDk; ctx.stroke(); }
  rrect(ctx, -60, -150, 120, 40, 10); fillStroke(ctx, '#5b6685', 6);
  ctx.restore();
  stink(ctx, x, y - 160 * s, s, t, 1);
  for (let i = 0; i < 2; i++) drawLalat(ctx, x + Math.cos(t * 3 + i * 3) * 110 * s, y - 250 * s + Math.sin(t * 4 + i) * 60 * s, 14 * s, t);
}
function drawLalat(ctx, x, y, r, t) { ctx.save(); ctx.translate(x, y); ellipse(ctx, -r * .6, -r * .7, r * .7, r * .4 * (1 + .5 * Math.sin(t * 60)), -.5); ctx.fillStyle = 'rgba(220,240,255,.8)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke(); ellipse(ctx, r * .6, -r * .7, r * .7, r * .4 * (1 + .5 * Math.sin(t * 60 + 1)), .5); ctx.fill(); ctx.stroke(); circle(ctx, 0, 0, r * .6); ctx.fillStyle = INK; ctx.fill(); ctx.restore(); }
// ===== KACA PEMBESAR detektif. (x,y) = pusat lensa. =====
function drawKacaPembesar(ctx, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, 70, -16, 150, 32, 14); fillStroke(ctx, '#8a5a34', 6);
  circle(ctx, 0, 0, 80); ctx.fillStyle = 'rgba(200,240,255,.35)'; ctx.fill(); ctx.lineWidth = 18; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 10; ctx.strokeStyle = '#c9ccd6'; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.7)'; ellipse(ctx, -30, -34, 20, 10, -.6); ctx.fill(); ctx.restore();
}
// ===== Papan tersangka (garis tinggi badan di belakang lineup). (x,y) = kiri bawah, w lebar. =====
function drawLineup(ctx, x, y, w, k = 1) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k); ctx.fillStyle = '#3a3f5c'; ctx.fillRect(x, y - 640, w, 640);
  for (let i = 1; i <= 6; i++) { const yy = y - i * 100; line(ctx, x, yy, x + w, yy, 4, 'rgba(255,255,255,.55)'); text(ctx, String(i * 25), x + 40, yy + 4, 26, '#fff', null, 0); }
  ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.strokeRect(x, y - 640, w, 640); ctx.restore();
}
function drawPapanNama(ctx, x, y, str, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); rrect(ctx, -110, -34, 220, 68, 8); fillStroke(ctx, '#fffaf0', 5); text(ctx, str, 0, 2, 32, INK, INK, 0); ctx.restore();
}

// ===== DUNIA MIKRO: serat kain (anyaman). Koordinat LAYAR. o: { t, wet 0..1, hot 0..1, dry 0..1 (angin), zoomIn } =====
// kamera dunia mikro (koordinat layar 1080x1920): mc = { z, x, y } (x,y geser dalam piksel layar)
function mcam(ctx, mc) { const z = mc ? mc.z || 1 : 1, dx = mc ? mc.x || 0 : 0, dy = mc ? mc.y || 0 : 0; ctx.setTransform(z, 0, 0, z, W / 2 * (1 - z) + dx, H / 2 * (1 - z) + dy); }
const FIB = { rows: [520, 860, 1200, 1540], cols: [180, 540, 900], r: 92 };
function seratBG(ctx, t, o = {}) {
  const P = JMP, wet = clamp(o.wet || 0), hot = clamp(o.hot || 0);
  ctx.save(); mcam(ctx, o.mc);
  ctx.fillStyle = mixC(P.microBg, '#4a1e1a', hot * .6); ctx.fillRect(-W, -H, W * 3, H * 3);
  // benang vertikal (di bawah), lalu horizontal yang menyelang (anyaman polos)
  const vert = (cx, pass) => { const fb = () => { rrect(ctx, cx - FIB.r, -60, FIB.r * 2, H + 120, FIB.r); }; if (pass === 0) { fb(); ctx.fillStyle = P.fiber; ctx.fill(); ctx.save(); fb(); ctx.clip(); ctx.strokeStyle = P.fiberDk; ctx.lineWidth = 6; for (let y = -60; y < H + 60; y += 46) { ctx.beginPath(); ctx.moveTo(cx - FIB.r, y); ctx.quadraticCurveTo(cx, y + 30, cx + FIB.r, y + 10); ctx.stroke(); } ctx.fillStyle = P.fiberHi; ctx.fillRect(cx - FIB.r * .55, -60, 22, H + 120); ctx.restore(); fb(); fillStroke(ctx, null, 7); } };
  FIB.cols.forEach(cx => vert(cx, 0));
  FIB.rows.forEach((cy, ri) => {
    const fb = () => rrect(ctx, -80, cy - FIB.r * .8, W + 160, FIB.r * 1.6, FIB.r * .8);
    ctx.save(); fb(); ctx.fillStyle = mixC(P.fiber, '#ffffff', .15); ctx.fill(); ctx.clip(); ctx.strokeStyle = P.fiberDk; ctx.lineWidth = 6;
    for (let x = -80; x < W + 80; x += 46) { ctx.beginPath(); ctx.moveTo(x, cy - FIB.r * .8); ctx.quadraticCurveTo(x + 30, cy, x + 10, cy + FIB.r * .8); ctx.stroke(); }
    ctx.fillStyle = P.fiberHi; ctx.fillRect(-80, cy - FIB.r * .5, W + 160, 18); ctx.restore(); fb(); fillStroke(ctx, null, 7);
    // benang vertikal muncul di atas benang horizontal secara berselang
    FIB.cols.forEach((cx, ci) => { if ((ri + ci) % 2) { ctx.save(); rrect(ctx, cx - FIB.r, cy - FIB.r * .95, FIB.r * 2, FIB.r * 1.9, 30); ctx.fillStyle = P.fiber; ctx.fill(); ctx.clip(); ctx.strokeStyle = P.fiberDk; ctx.lineWidth = 6; for (let y = cy - 120; y < cy + 120; y += 46) { ctx.beginPath(); ctx.moveTo(cx - FIB.r, y); ctx.quadraticCurveTo(cx, y + 30, cx + FIB.r, y + 10); ctx.stroke(); } ctx.fillStyle = P.fiberHi; ctx.fillRect(cx - FIB.r * .55, cy - 120, 22, 240); ctx.restore(); ctx.beginPath(); ctx.moveTo(cx - FIB.r, cy - FIB.r * .95); ctx.lineTo(cx - FIB.r, cy + FIB.r * .95); ctx.moveTo(cx + FIB.r, cy - FIB.r * .95); ctx.lineTo(cx + FIB.r, cy + FIB.r * .95); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); } });
  });
  // genangan air di celah anyaman
  if (wet > 0) { ctx.globalAlpha = .55 * wet; ctx.fillStyle = '#7fd0ff'; for (const cy of [690, 1030, 1370]) for (const cx of [360, 720]) { ellipse(ctx, cx + Math.sin(t * 2 + cx) * 6, cy, 120 * (.6 + .4 * wet), 90 * (.6 + .4 * wet)); ctx.fill(); }
    ctx.globalAlpha = 1; for (let i = 0; i < 6; i++) drawTetes(ctx, 120 + i * 170, 330 + (i % 2) * 70 + Math.sin(t * 2 + i) * 8, 22, wet); }
  if (hot > 0) { const g = ctx.createRadialGradient(W / 2, H / 2, 300, W / 2, H / 2, 1150); g.addColorStop(0, 'rgba(255,90,20,0)'); g.addColorStop(1, `rgba(255,90,20,${.5 * hot})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 14; i++) { const q = (t * .8 + i / 14) % 1; circle(ctx, (i * 173) % W, H - q * H * 1.1, 10 + (i % 4) * 6); ctx.lineWidth = 4; ctx.strokeStyle = `rgba(255,255,255,${.6 * (1 - q) * hot})`; ctx.stroke(); } }
  if (o.dry > 0) for (let i = 0; i < 5; i++) drawWind(ctx, -100, 420 + i * 260, .05, 900, ((t * .9 + i * .23) % 1.25), t, '#ffffff', 14 * o.dry);
  ctx.restore();
}
// Bakteri berbentuk kokobasil berpasangan (Moraxella). (x,y) pusat. o: { face, t, party 0..1 (topi + konfeti), sleep, dead, split 0..1, rot, a }
function drawBakteri(ctx, x, y, r, o = {}) {
  const P = JMP, t = o.t || 0; if (o.a != null && o.a <= 0) return;
  ctx.save(); if (o.a != null) ctx.globalAlpha *= clamp(o.a); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  const sq = 1 + Math.sin(t * 5 + x * .01) * .04 * (o.dead ? 0 : 1); ctx.scale(sq, 2 - sq);
  const sp = clamp(o.split || 0) * r * .5, col = o.dead ? '#a69bb8' : P.bact;
  for (const sd of [-1, 1]) { ellipse(ctx, sd * (r * .55 + sp), 0, r * .78, r * .7); ctx.fillStyle = col; ctx.fill(); }
  ctx.save(); for (const sd of [-1, 1]) ellipse(ctx, sd * (r * .55 + sp), 0, r * .78, r * .7); ctx.clip(); ctx.fillStyle = 'rgba(80,40,140,.25)'; ctx.fillRect(-r * 2, r * .25, r * 4, r); ctx.fillStyle = 'rgba(255,255,255,.45)'; ellipse(ctx, -r * .7 - sp, -r * .35, r * .25, r * .1, -.3); ctx.fill(); ctx.restore();
  for (const sd of [-1, 1]) { ellipse(ctx, sd * (r * .55 + sp), 0, r * .78, r * .7); ctx.lineWidth = Math.max(3, r * .08); ctx.strokeStyle = INK; ctx.stroke(); }
  // rambut halus (pili)
  ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2, r * .04); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, ex = Math.cos(a) * r * 1.35, ey = Math.sin(a) * r * .95; ctx.beginPath(); ctx.moveTo(ex * .8, ey * .8); ctx.lineTo(ex + Math.sin(t * 4 + i) * 4, ey); ctx.stroke(); }
  ctx.restore();
  if (o.face) propFace(ctx, x, y + r * .05, r * 1.25, o.dead ? Object.assign({}, o.face, { eyes: 'x', mouth: 'wobble' }) : o.face, { t, rot: o.rot || 0 });
  if (o.party > 0) { ctx.save(); ctx.globalAlpha *= clamp(o.party); ctx.translate(x, y - r * .7); ctx.rotate(-.2 + Math.sin(t * 8 + x) * .15); ctx.beginPath(); ctx.moveTo(-r * .35, 0); ctx.lineTo(0, -r * .95); ctx.lineTo(r * .35, 0); ctx.closePath(); fillStroke(ctx, '#ffd23a', Math.max(3, r * .07)); circle(ctx, 0, -r * .95, r * .12); fillStroke(ctx, '#ff5a8a', 3); ctx.restore(); }
  if (o.sleep > 0) { ctx.save(); ctx.globalAlpha *= clamp(o.sleep); for (let i = 0; i < 3; i++) { const q = (t * .6 + i / 3) % 1; text(ctx, 'z', x + r * (.9 + q * .8), y - r * (.8 + q * 1.2), r * (.35 + q * .25), '#ffffff', INK, 4); } ctx.restore(); }
}
// Awan bau (hasil "kotoran" bakteri). (x,y) pusat. o: { face, t, a }
function drawGasBau(ctx, x, y, r, o = {}) {
  const P = JMP, t = o.t || 0, a = o.a == null ? 1 : clamp(o.a); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); const wob = Math.sin(t * 3 + x * .02) * .06; ctx.scale(1 + wob, 1 - wob);
  const blob = () => { ctx.beginPath(); for (let i = 0; i < 7; i++) { const an = i / 7 * TAU; ctx.moveTo(Math.cos(an) * r * .55 + r * .5, Math.sin(an) * r * .4); ctx.arc(Math.cos(an) * r * .55, Math.sin(an) * r * .4, r * .5, 0, TAU); } };
  blob(); ctx.fillStyle = P.stink; ctx.fill(); ctx.lineWidth = Math.max(3, r * .08); ctx.strokeStyle = P.stinkDk; ctx.stroke();
  blob(); ctx.fillStyle = P.stink; ctx.fill();
  ctx.restore();
  if (o.face) propFace(ctx, x, y + r * .05, r * 1.1, o.face, { t, alpha: a });
}
