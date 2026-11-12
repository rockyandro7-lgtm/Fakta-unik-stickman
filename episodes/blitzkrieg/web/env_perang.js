// ---------- Fakta Unik: set sejarah PD II (Blitzkrieg) versi stickman ----------
// Aturan v6: SATU fungsi per aset + palet terkunci PRG + tata letak terkunci per set (MAG, PRT, LAP, ARD, SLJ).
// Aturan v7: latar datar satu skala (depth 1), teks bunyi di dalam dunia, benda penting boleh diberi wajah.
// Sengaja TANPA lambang Nazi/swastika: tentara dibedakan oleh warna seragam + bentuk helm (aman untuk iklan, tetap terbaca).
const PRG = {
  sky: '#8fcdf0', skyLo: '#e3f3fb', grass: '#8cc56a', grassDk: '#6aa24e', hill: '#a9d48a', hillFar: '#c4e2b0',
  dirt: '#a67c52', dirtDk: '#7a5636', mud: '#6e5136', mudDk: '#4f3925', mudSky: '#c9bf9f', mudSkyLo: '#e6dcc0',
  conc: '#cfcabe', concDk: '#a29c8f', concHi: '#e9e5dc', steel: '#7d8590', steelDk: '#59606a',
  fr: '#3d6fc4', frHelm: '#5b80c4', de: '#7c8471', deHelm: '#68705f',
  tank: '#7d8672', track: '#3b3b42', wheel: '#6d6f78', plane: '#8a9585', radio: '#6c6a4c', radioDk: '#4b4a33',
  pine: '#2f6b45', pineDk: '#1f4d33', pineFar: '#3f7a57', forestGround: '#4e7d43', forestSky: '#7fb3a0',
  snow: '#f5f8ff', snowDk: '#c8d5ea', snowSky: '#aebdd0', snowSkyLo: '#dfe6ef',
  wood: '#b98a52', woodDk: '#8a6235', sand: '#dcc79c', sandDk: '#b59f72', bolt: '#ffd23a',
};
// Tata letak terkunci per set (koordinat dunia).
const MAG = { top: 1060, ground: 1720, x0: -1100, x1: 2200, sit: 520, flag: 330, cloche: 1180 };   // benteng Maginot
const PRT = { ground: 1420, lt: 250, rt: 840, w: 250, floor: 1720 };                                // parit PD I
const LAP = { ground: 1500 };                                                                        // lapangan latihan
const ARD = { ground: 1560 };                                                                        // hutan Ardennes
const SLJ = { ground: 1540, tank: 560 };                                                             // salju Rusia

// ===== helper latar =====
function skyFill(ctx, top, bot) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function hillBand(ctx, y, amp, col, seed, x0 = -1600, x1 = 2700, bottom = 3200) {
  ctx.beginPath(); ctx.moveTo(x0, bottom);
  for (let x = x0; x <= x1; x += 40) ctx.lineTo(x, y - amp * (.55 + .45 * Math.sin(x * .0031 + seed) * Math.sin(x * .0017 + seed * 2.1)));
  ctx.lineTo(x1, bottom); ctx.closePath(); fillStroke(ctx, col, 6);
}
function grassTufts(ctx, x0, x1, y, seed, col = PRG.grassDk) {
  const r = rng(seed); ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (let x = x0; x < x1; x += 90 + r() * 120) { const yy = y + 30 + r() * 220; ctx.beginPath(); ctx.moveTo(x - 12, yy); ctx.lineTo(x - 18, yy - 22); ctx.moveTo(x, yy); ctx.lineTo(x, yy - 30); ctx.moveTo(x + 12, yy); ctx.lineTo(x + 19, yy - 21); ctx.stroke(); }
}

// ===== helm (o.hat = fungsi, lihat drawStick) =====
// Helm Prancis (Adrian): kubah + pinggiran + jambul di atas.
function hatAdrian(ctx, hx, hy, hr, lw, o) {
  const col = o.helmCol || PRG.frHelm, dk = mixC(col, '#000000', .2);
  ellipse(ctx, hx, hy - hr * .5, hr * 1.24, hr * .15); fillStroke(ctx, dk, lw);
  ctx.beginPath(); ctx.moveTo(hx - hr * 1.0, hy - hr * .5); ctx.bezierCurveTo(hx - hr * 1.02, hy - hr * 1.42, hx + hr * 1.02, hy - hr * 1.42, hx + hr * 1.0, hy - hr * .5); ctx.closePath(); fillStroke(ctx, col, lw);
  ctx.beginPath(); ctx.moveTo(hx - hr * .55, hy - hr * 1.1); ctx.quadraticCurveTo(hx, hy - hr * 1.5, hx + hr * .55, hy - hr * 1.1);
  ctx.lineCap = 'round'; ctx.lineWidth = lw * 2.6; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = lw * 1.1; ctx.strokeStyle = mixC(col, '#ffffff', .35); ctx.stroke();
  ellipse(ctx, hx - hr * .45, hy - hr * .88, hr * .22, hr * .07, -.45); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fill();
}
// Helm Jerman: kubah dalam dengan sisi yang melebar turun ke telinga.
function hatStahl(ctx, hx, hy, hr, lw, o) {
  const col = o.helmCol || PRG.deHelm;
  ctx.beginPath(); ctx.moveTo(hx - hr * 1.17, hy + hr * .08);
  ctx.quadraticCurveTo(hx - hr * 1.22, hy - hr * 1.3, hx, hy - hr * 1.26);
  ctx.quadraticCurveTo(hx + hr * 1.22, hy - hr * 1.3, hx + hr * 1.17, hy + hr * .08);
  ctx.lineTo(hx + hr * .93, hy + hr * .04); ctx.quadraticCurveTo(hx + hr * .82, hy - hr * .36, hx, hy - hr * .4);
  ctx.quadraticCurveTo(hx - hr * .82, hy - hr * .36, hx - hr * .93, hy + hr * .04); ctx.closePath(); fillStroke(ctx, col, lw);
  ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(20,20,30,.16)'; ctx.fillRect(hx + hr * .35, hy - hr * 1.5, hr, hr * 2); ctx.restore();
  ellipse(ctx, hx - hr * .5, hy - hr * .9, hr * .25, hr * .08, -.5); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill();
}

// ===== properti =====
// Tank kartun (tanpa lambang). (x,y) = tanah di tengah rantai. Menghadap kanan (dir 1).
// o: { t, roll (px jarak tempuh: roda + rantai ikut), dir, tilt, bob, exhaust 0..1, crew(ctx) kepala di palka, bolt 0..1 (panji kilat menyala/padam),
//      snow 0..1 (salju menumpuk + rantai tertimbun), face (wajah di lambung), col }
function drawTank(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0, roll = o.roll || 0, col = o.col || PRG.tank, dk = mixC(col, '#000000', .3), hi = mixC(col, '#ffffff', .28), dir = o.dir || 1;
  ctx.save(); ctx.translate(x, y + (o.bob || 0)); ctx.scale(s * dir, s); ctx.rotate(o.tilt || 0);
  if (o.exhaust) for (let i = 0; i < 3; i++) { const q = (t * 1.4 + i / 3) % 1; puff(ctx, -300 - q * 140, -190 - q * 120, 20 + q * 34, t, '#dcd8cf', 40 + i, o.exhaust * (1 - q) * .85); }
  // antena + panji kilat
  const tip = [-178 + Math.sin(t * 3.1) * 7, -560];
  ctx.beginPath(); ctx.moveTo(-150, -320); ctx.quadraticCurveTo(-160, -440, tip[0], tip[1]); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke();
  if (o.bolt != null) drawPennant(ctx, tip[0], tip[1] + 6, t, o.bolt);
  // palka terbuka + awak
  if (o.crew) { ellipse(ctx, -95, -338, 62, 16, -.25); fillStroke(ctx, dk, 6); o.crew(ctx); }
  // turret
  const tur = () => { ctx.beginPath(); ctx.roundRect(-190, -335, 290, 125, [46, 34, 6, 6]); };
  tur(); fillStroke(ctx, col, 8); shadeShape(ctx, tur, 1, .16, .3, [-190, -335, 290, 125]);
  ctx.save(); tur(); ctx.clip(); ctx.fillStyle = hi; ctx.fillRect(-170, -326, 220, 12); ctx.restore(); tur(); fillStroke(ctx, null, 8);
  if (o.crew) { ctx.beginPath(); ctx.ellipse(-60, -334, 62, 14, 0, Math.PI, TAU); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); }
  // laras
  rrect(ctx, 95, -298, 255, 32, 12); fillStroke(ctx, col, 7); rrect(ctx, 340, -307, 42, 50, 9); fillStroke(ctx, dk, 7);
  // lambung
  const hull = () => path(ctx, [[-300, -118], [312, -118], [350, -160], [300, -222], [-265, -222], [-312, -172]]);
  hull(); fillStroke(ctx, col, 8); shadeShape(ctx, hull, 1, .14, .25, [-312, -222, 662, 104]);
  ctx.save(); hull(); ctx.clip(); ctx.fillStyle = dk; ctx.globalAlpha = .45; ctx.fillRect(-320, -150, 700, 40); ctx.globalAlpha = 1; ctx.fillStyle = hi; ctx.fillRect(-260, -214, 540, 10); ctx.restore(); hull(); fillStroke(ctx, null, 8);
  for (let i = 0; i < 6; i++) { circle(ctx, -230 + i * 96, -200, 6); ctx.fillStyle = dk; ctx.fill(); }
  // rantai
  rrect(ctx, -312, -128, 640, 134, 64); fillStroke(ctx, PRG.track, 8);
  ctx.save(); rrect(ctx, -302, -118, 620, 114, 56); ctx.setLineDash([24, 16]); ctx.lineDashOffset = -roll; ctx.lineWidth = 11; ctx.strokeStyle = '#64646f'; ctx.stroke(); ctx.restore();
  for (let i = 0; i < 6; i++) {
    const wx = -232 + i * 94, wy = -61, r = i === 0 || i === 5 ? 34 : 40, a = roll / r;
    circle(ctx, wx, wy, r); fillStroke(ctx, PRG.wheel, 6); circle(ctx, wx, wy, r * .42); fillStroke(ctx, '#4b4c54', 5);
    for (let k = 0; k < 3; k++) { const aa = a + k * TAU / 3; line(ctx, wx + Math.cos(aa) * r * .45, wy + Math.sin(aa) * r * .45, wx + Math.cos(aa) * r * .85, wy + Math.sin(aa) * r * .85, 5, '#4b4c54'); }
  }
  if (o.snow) {
    ctx.save(); ctx.globalAlpha = clamp(o.snow);
    const cap = (pts) => { path(ctx, pts); fillStroke(ctx, PRG.snow, 6); };
    cap([[-185, -333], [-150, -352], [60, -352], [96, -333], [70, -318], [-160, -320]]);
    cap([[-262, -222], [-220, -238], [270, -238], [302, -222], [260, -212], [-240, -212]]);
    // timbunan salju menutup rantai bawah
    ctx.beginPath(); ctx.moveTo(-420, 20); ctx.quadraticCurveTo(-330, -80 - 40 * o.snow, -150, -60); ctx.quadraticCurveTo(40, -100 * o.snow, 200, -55); ctx.quadraticCurveTo(360, -90 * o.snow, 440, 20); ctx.closePath(); fillStroke(ctx, PRG.snow, 7);
    ctx.fillStyle = PRG.snowDk; ellipse(ctx, 0, 10, 380, 22); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  if (o.face) propFace(ctx, x + dir * 40 * s, y + (-170 + (o.bob || 0) / s) * s, 112 * s, o.face, { t });
}
// Panji kilat di ujung antena: k 1 = kuning menyala, 0 = abu-abu dan terkulai.
function drawPennant(ctx, x, y, t, k) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(lerp(1.15, Math.sin(t * 6) * .12, k));
  const col = mixC('#8d8f94', PRG.bolt, k), wv = Math.sin(t * 9) * 8 * k;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(70, -8 + wv, 140, 18); ctx.quadraticCurveTo(70, 30 - wv, 0, 56); ctx.closePath(); fillStroke(ctx, col, 6);
  path(ctx, [[48, 8], [30, 30], [52, 30], [36, 50], [70, 22], [50, 22], [62, 8]]); fillStroke(ctx, mixC('#c9c9cc', '#ffffff', k), 3);
  if (k > .05) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(60, 26, 0, 60, 26, 120); g.addColorStop(0, `rgba(255,220,80,${.45 * k})`); g.addColorStop(1, 'rgba(255,220,80,0)'); ctx.fillStyle = g; ctx.fillRect(-80, -100, 280, 260); }
  ctx.restore();
}
// Pesawat pengebom tukik kartun (generik). (x,y) = pusat badan. o: { t, dir, rot, face, col }
function drawPlane(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0, col = o.col || PRG.plane, dk = mixC(col, '#000000', .3), hi = mixC(col, '#ffffff', .3);
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.dir || 1), s); ctx.rotate(o.rot || 0);
  path(ctx, [[-225, -18], [-272, -118], [-232, -122], [-172, -28]]); fillStroke(ctx, col, 7);
  ellipse(ctx, -212, 4, 62, 13); fillStroke(ctx, dk, 6);
  const body = () => { ctx.beginPath(); ctx.moveTo(-255, -6); ctx.quadraticCurveTo(-60, -74, 150, -46); ctx.lineTo(205, -32); ctx.lineTo(205, 32); ctx.lineTo(150, 42); ctx.quadraticCurveTo(-60, 58, -255, 12); ctx.closePath(); };
  body(); fillStroke(ctx, col, 8);
  ctx.save(); body(); ctx.clip(); ctx.fillStyle = dk; ctx.globalAlpha = .5; ctx.fillRect(-260, 18, 480, 60); ctx.globalAlpha = 1; ctx.fillStyle = hi; ctx.fillRect(-200, -40, 330, 9); ctx.fillStyle = dk; ctx.fillRect(140, -60, 70, 120); ctx.restore(); body(); fillStroke(ctx, null, 8);
  // kokpit + pilot
  ctx.save(); rrect(ctx, -60, -96, 160, 50, 24); ctx.clip(); ctx.fillStyle = '#bfe4f4'; ctx.fillRect(-70, -100, 180, 60);
  circle(ctx, 35, -62, 21); fillStroke(ctx, HEAD, 4); ctx.beginPath(); ctx.arc(35, -62, 22, Math.PI, TAU); ctx.fillStyle = '#6b4e33'; ctx.fill(); rrect(ctx, 30, -70, 24, 11, 5); ctx.fillStyle = '#9fd6ef'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(-40, -92, 30, 40); ctx.restore();
  rrect(ctx, -60, -96, 160, 50, 24); fillStroke(ctx, null, 6); line(ctx, 0, -96, 0, -48, 5); line(ctx, 52, -96, 52, -48, 5);
  // sayap camar + roda bersepatu
  path(ctx, [[-70, 14], [20, 30], [120, 12], [132, 36], [20, 52], [-62, 38]]); fillStroke(ctx, dk, 7);
  line(ctx, 62, 40, 66, 82, 9); ctx.beginPath(); ctx.moveTo(66, 66); ctx.quadraticCurveTo(98, 92, 70, 118); ctx.quadraticCurveTo(38, 96, 66, 66); fillStroke(ctx, col, 6);
  // baling-baling
  ctx.beginPath(); ctx.moveTo(205, -28); ctx.quadraticCurveTo(250, 0, 205, 28); ctx.closePath(); fillStroke(ctx, '#d9dbe0', 6);
  ellipse(ctx, 240, 0, 9, 104); ctx.fillStyle = 'rgba(220,225,232,.38)'; ctx.fill();
  const bl = Math.cos(t * 47) * 100; line(ctx, 240, -bl, 240, bl, 9, 'rgba(40,30,40,.75)');
  ctx.restore();
  if (o.face) propFace(ctx, x + (o.dir || 1) * 120 * s, y + 6 * s, 80 * s, o.face, { t, rot: o.rot || 0 });
}
// Radio lapangan. (x,y) = dasar tengah. o: { t, wave 0..1 (gelombang sinyal), face }
function drawRadio(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const tip = [72 + Math.sin(t * 4) * 6, -430];
  ctx.beginPath(); ctx.moveTo(62, -150); ctx.quadraticCurveTo(66, -300, tip[0], tip[1]); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); circle(ctx, tip[0], tip[1], 10); fillStroke(ctx, '#e5262a', 4);
  if (o.wave) for (let i = 0; i < 3; i++) { const q = (t * 1.3 + i / 3) % 1, r = 30 + q * 110; ctx.beginPath(); ctx.arc(tip[0], tip[1], r, -Math.PI * .8, -Math.PI * .2); ctx.lineWidth = 9 * (1 - q); ctx.strokeStyle = `rgba(255,210,58,${o.wave * (1 - q)})`; ctx.stroke(); }
  const box = () => rrect(ctx, -100, -150, 200, 150, 16);
  box(); fillStroke(ctx, PRG.radio, 8); shadeShape(ctx, box, 1, .18, .3, [-100, -150, 200, 150]); box(); fillStroke(ctx, null, 8);
  rrect(ctx, -82, -132, 164, 80, 10); fillStroke(ctx, PRG.radioDk, 5);
  for (let i = 0; i < 3; i++) { const cx = -50 + i * 50; circle(ctx, cx, -92, 17); fillStroke(ctx, '#d8d3bd', 4); const a = t * (i - 1) * .6 + i; line(ctx, cx, -92, cx + Math.cos(a) * 12, -92 + Math.sin(a) * 12, 4); }
  for (let i = 0; i < 4; i++) line(ctx, -70 + i * 14, -35, -70 + i * 14, -18, 4, PRG.radioDk);
  rrect(ctx, 20, -40, 60, 22, 8); fillStroke(ctx, '#e8c04a', 4);
  ctx.restore();
  return [x + tip[0] * s, y + tip[1] * s];
}
// Sinyal radio antara dua titik (garis zigzag putus-putus berjalan). k = 0..1 (muncul).
function drawWaveLink(ctx, ax, ay, bx, by, t, k) {
  if (k <= 0) return; const n = 22, L = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / L, ny = (bx - ax) / L, m = Math.floor(n * clamp(k));
  ctx.save(); ctx.beginPath();
  for (let i = 0; i <= m; i++) { const q = i / n, z = (i % 2 ? 1 : -1) * 16; const px = lerp(ax, bx, q) + nx * z, py = lerp(ay, by, q) + ny * z; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.setLineDash([26, 14]); ctx.lineDashOffset = -t * 160; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = PRG.bolt; ctx.stroke(); ctx.restore();
}
// Cangkir kopi. (x,y) = dasar. o: { t, steam 0..1, tilt, spill 0..1 }
function drawCup(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.tilt || 0);
  if (o.steam) for (let i = 0; i < 2; i++) { ctx.beginPath(); for (let j = 0; j <= 10; j++) { const yy = -70 - j * 9, xx = (i - .5) * 22 + Math.sin(t * 5 + j * .8 + i * 2) * 7; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 6; ctx.strokeStyle = `rgba(255,255,255,${.8 * o.steam})`; ctx.lineCap = 'round'; ctx.stroke(); }
  ctx.beginPath(); ctx.arc(34, -36, 17, -1.3, 1.3); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke();
  const cup = () => { ctx.beginPath(); ctx.moveTo(-36, -66); ctx.lineTo(36, -66); ctx.lineTo(28, 0); ctx.lineTo(-28, 0); ctx.closePath(); };
  cup(); fillStroke(ctx, '#ffffff', 6); ctx.save(); cup(); ctx.clip(); ctx.fillStyle = PRG.fr; ctx.fillRect(-40, -40, 80, 12); ctx.restore(); cup(); fillStroke(ctx, null, 6);
  ellipse(ctx, 0, -66, 36, 8); fillStroke(ctx, '#6b3d1e', 5);
  ctx.restore();
  if (o.spill) { const d = o.spill; for (let i = 0; i < 6; i++) { circle(ctx, x + (i - 2.5) * 16 * s + d * 30 * s, y - 70 * s + d * d * 160 * s + i * 6 * s, (9 - i) * s); ctx.fillStyle = '#6b3d1e'; ctx.fill(); } }
}
// Bendera melambai (pole + kain). cols = daftar warna garis vertikal (contoh tiga warna Prancis) atau ['#fff'] untuk bendera putih.
function drawFlagWave(ctx, x, y, s, t, cols, o = {}) {
  const h = o.h || 420, fw = o.w || 220, fh = o.fh || 150;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(ctx, 0, 0, 0, -h, 10); circle(ctx, 0, -h - 6, 12); fillStroke(ctx, '#e8c04a', 5);
  const n = 18, top = -h + 10, amp = o.amp == null ? 14 : o.amp;
  const pt = (u, v) => [u * fw, top + v * fh + Math.sin(t * 6 - u * 5) * amp * u];
  const slice = (u0, u1) => { ctx.beginPath(); for (let i = 0; i <= n; i++) { const u = lerp(u0, u1, i / n); const p = pt(u, 0); i ? ctx.lineTo(...p) : ctx.moveTo(...p); } for (let i = n; i >= 0; i--) { const u = lerp(u0, u1, i / n); ctx.lineTo(...pt(u, 1)); } ctx.closePath(); };
  cols.forEach((c, i) => { slice(i / cols.length, (i + 1) / cols.length); ctx.fillStyle = c; ctx.fill(); });
  slice(0, 1); fillStroke(ctx, null, 6);
  ctx.restore();
}
// Karung pasir bertumpuk. Dari x0 ke x1, dasar y.
function drawSandbags(ctx, x0, x1, y, rows = 2, seed = 1) {
  const r = rng(seed);
  for (let j = 0; j < rows; j++) for (let x = x0 + (j % 2) * 45; x < x1 - 30; x += 90) { const yy = y - j * 44 - 22; rrect(ctx, x, yy - 22, 92, 48, 22); fillStroke(ctx, mixC(PRG.sand, PRG.sandDk, r() * .5), 6); line(ctx, x + 46, yy - 16, x + 46, yy + 18, 3, 'rgba(90,60,30,.4)'); }
}
// Kawat berduri: tiang kayu + gulungan.
function drawBarbed(ctx, x0, x1, y, seed = 1) {
  for (let x = x0; x <= x1; x += 170) { line(ctx, x, y + 10, x + 8, y - 110, 12, PRG.woodDk); }
  ctx.beginPath(); for (let x = x0; x <= x1; x += 14) { const a = x * .45; ctx.lineTo(x + Math.cos(a) * 14, y - 60 + Math.sin(a) * 36); } ctx.lineWidth = 4; ctx.strokeStyle = '#3f3f46'; ctx.stroke();
  ctx.beginPath(); for (let x = x0; x <= x1; x += 32) { ctx.moveTo(x - 6, y - 102); ctx.lineTo(x + 6, y - 92); ctx.moveTo(x + 6, y - 102); ctx.lineTo(x - 6, y - 92); } ctx.lineWidth = 4; ctx.stroke();
  line(ctx, x0, y - 97, x1, y - 97, 4, '#3f3f46');
}
// Papan kayu dengan tulisan (tahun, nama tempat). o: { rot, fall 0..1 (roboh ke belakang), size }
function drawSign(ctx, x, y, s, label, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate((o.rot || 0) + (o.fall || 0) * 1.45); ctx.scale(s, s);
  line(ctx, 0, 0, 0, -230, 18, PRG.woodDk); line(ctx, 0, 0, 0, -230, 8, PRG.wood);
  rrect(ctx, -150, -300, 300, 110, 14); fillStroke(ctx, PRG.wood, 7);
  ctx.fillStyle = 'rgba(80,50,20,.18)'; ctx.fillRect(-140, -250, 280, 6);
  text(ctx, label, 0, -244, o.size || 66, '#fff8e6', INK, 12);
  ctx.restore();
}
// Pohon cemara. (x,y) = dasar batang. o: { col, bend (rad, condong), snow 0..1 }
function drawPine(ctx, x, y, s = 1, o = {}) {
  const col = o.col || PRG.pine, dk = mixC(col, '#000000', .25);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.bend || 0); ctx.scale(s, s);
  rrect(ctx, -16, -120, 32, 122, 8); fillStroke(ctx, PRG.woodDk, 6);
  [[-90, 210, 175], [-215, 170, 150], [-330, 125, 125]].forEach(([yy, w, h], i) => {
    const tri = () => { ctx.beginPath(); ctx.moveTo(0, yy - h); ctx.quadraticCurveTo(w * .25, yy - h * .45, w / 2, yy); ctx.quadraticCurveTo(0, yy + 18, -w / 2, yy); ctx.quadraticCurveTo(-w * .25, yy - h * .45, 0, yy - h); ctx.closePath(); };
    tri(); fillStroke(ctx, col, 6); ctx.save(); tri(); ctx.clip(); ctx.fillStyle = dk; ctx.fillRect(w * .12, yy - h, w, h + 30); ctx.restore(); tri(); fillStroke(ctx, null, 6);
    if (o.snow) { ctx.save(); ctx.globalAlpha = o.snow; ctx.beginPath(); ctx.moveTo(0, yy - h); ctx.quadraticCurveTo(w * .2, yy - h * .55, w * .3, yy - h * .4); ctx.quadraticCurveTo(0, yy - h * .5, -w * .3, yy - h * .4); ctx.quadraticCurveTo(-w * .2, yy - h * .55, 0, yy - h); ctx.closePath(); fillStroke(ctx, PRG.snow, 5); ctx.restore(); }
  });
  ctx.restore();
}
// Salju turun (ruang layar, deterministik). k = kepadatan 0..1.
function drawSnowfall(ctx, t, k = 1, seed = 4) {
  if (k <= 0) return; const r = rng(seed); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = 'rgba(255,255,255,.9)';
  for (let i = 0; i < 90 * k; i++) { const sp = 120 + r() * 160, x0 = r() * W, ph = r() * H, sz = 5 + r() * 9; const y = (ph + t * sp) % (H + 40) - 20, x = x0 + Math.sin(t * 1.3 + i) * 24 - t * 30; circle(ctx, ((x % W) + W) % W, y, sz); ctx.fill(); }
  ctx.restore();
}

// ===== set / latar (masing-masing menerapkan kamera, depth 1) =====
// Benteng Maginot: dinding beton raksasa memanjang, celah tembak, kubah baja, kawat berduri, bendera di atas.
function maginotScene(ctx, t, cam, o = {}) {
  skyFill(ctx, PRG.sky, PRG.skyLo); applyCam(ctx, cam, 1);
  drawCloud(ctx, 120 + t * 8, 300, 110, 3); drawCloud(ctx, 980 + t * 6, 160, 80, 5); drawCloud(ctx, -700 + t * 7, 420, 90, 2);
  hillBand(ctx, 820, 140, PRG.hillFar, 1); hillBand(ctx, 930, 90, PRG.hill, 3);
  const T = MAG.top, G = MAG.ground;
  // atap/parapet
  rrect(ctx, MAG.x0, T - 40, MAG.x1 - MAG.x0, 70, 18); fillStroke(ctx, PRG.concHi, 8);
  // dinding depan
  const wall = () => path(ctx, [[MAG.x0, T + 20], [MAG.x1, T + 20], [MAG.x1 + 60, G], [MAG.x0 - 60, G]]);
  wall(); fillStroke(ctx, PRG.conc, 8);
  ctx.save(); wall(); ctx.clip();
  for (let y = T + 120; y < G; y += 120) line(ctx, MAG.x0 - 80, y, MAG.x1 + 80, y, 5, 'rgba(110,100,90,.35)');
  for (let x = MAG.x0; x < MAG.x1; x += 260) line(ctx, x, T + 20, x - 10, G, 4, 'rgba(110,100,90,.22)');
  ctx.fillStyle = 'rgba(70,60,60,.12)'; ctx.fillRect(MAG.x0 - 80, G - 160, MAG.x1 - MAG.x0 + 160, 160);
  ctx.restore(); wall(); fillStroke(ctx, null, 8);
  // celah tembak dengan laras
  for (const ex of [-700, -260, 860, 1350, 1800]) { rrect(ctx, ex - 80, T + 230, 160, 54, 12); fillStroke(ctx, '#2c2a30', 6); rrect(ctx, ex - 12, T + 245, 120, 22, 8); fillStroke(ctx, PRG.steelDk, 5); }
  // kubah baja (cloche) dengan meriam di atas parapet
  const cx = MAG.cloche; ctx.beginPath(); ctx.ellipse(cx, T - 30, 150, 120, 0, Math.PI, TAU); ctx.closePath(); fillStroke(ctx, PRG.steel, 8);
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, T - 30, 150, 120, 0, Math.PI, TAU); ctx.clip(); ctx.fillStyle = 'rgba(20,20,30,.2)'; ctx.fillRect(cx + 40, T - 160, 200, 140); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(cx - 110, T - 120, 40, 60); ctx.restore();
  rrect(ctx, cx + 80, T - 92, 230, 34, 12); fillStroke(ctx, PRG.steelDk, 7); rrect(ctx, cx - 100, T - 70, 200, 26, 6); fillStroke(ctx, '#2c2a30', 5);
  // tulisan stensil di dinding (teks di dalam dunia)
  ctx.save(); ctx.globalAlpha = .7; text(ctx, 'GARIS MAGINOT', 300, T + 140, 78, '#5c5560'); ctx.restore();
  drawFlagWave(ctx, MAG.flag, T - 40, 1, t, ['#2a4fa8', '#ffffff', '#e2343a']);
  // tanah depan + kawat berduri
  rrect(ctx, MAG.x0 - 400, G - 10, MAG.x1 - MAG.x0 + 800, 900, 0); fillStroke(ctx, PRG.grass, 8);
  grassTufts(ctx, MAG.x0, MAG.x1, G, 3);
  drawBarbed(ctx, MAG.x0, MAG.x1, G + 120, 2);
}
// Parit PD I: langit keruh, lumpur, dua parit berhadapan, kawat di tengah. Tokoh digambar DI ANTARA trenchBack dan trenchFront.
function trenchBack(ctx, t, cam) {
  skyFill(ctx, PRG.mudSky, PRG.mudSkyLo); applyCam(ctx, cam, 1);
  drawCloud(ctx, 300 + t * 10, 420, 120, 7, .7); drawCloud(ctx, 900 + t * 6, 300, 90, 8, .6);
  hillBand(ctx, PRT.ground - 120, 70, '#b7ab86', 6);
  ctx.fillStyle = PRG.mud; ctx.fillRect(-1500, PRT.ground, 4200, 2000);
  for (const px of [PRT.lt, PRT.rt]) { rrect(ctx, px - PRT.w / 2, PRT.ground - 20, PRT.w, 1000, 10); fillStroke(ctx, PRG.mudDk, 7); for (let x = px - PRT.w / 2 + 20; x < px + PRT.w / 2; x += 46) line(ctx, x, PRT.ground + 10, x, PRT.ground + 600, 6, 'rgba(160,110,60,.55)'); }
  // pohon gundul
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = '#4b3a2c'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(560, PRT.ground - 10); ctx.lineTo(548, PRT.ground - 300); ctx.moveTo(552, PRT.ground - 200); ctx.lineTo(500, PRT.ground - 260); ctx.moveTo(549, PRT.ground - 250); ctx.lineTo(600, PRT.ground - 330); ctx.stroke(); ctx.restore();
}
function trenchFront(ctx, t) {
  ctx.fillStyle = PRG.mud;
  for (const px of [PRT.lt, PRT.rt]) { ctx.beginPath(); ctx.moveTo(px - 260, PRT.ground + 150); ctx.quadraticCurveTo(px, PRT.ground + 40, px + 260, PRT.ground + 150); ctx.lineTo(px + 260, PRT.ground + 900); ctx.lineTo(px - 260, PRT.ground + 900); ctx.closePath(); fillStroke(ctx, PRG.mud, 7); drawSandbags(ctx, px - 170, px + 170, PRT.ground + 60, 2, px); }
  drawBarbed(ctx, PRT.lt + 220, PRT.rt - 220, PRT.ground + 40, 5);
  // genangan + batu supaya lumpur tidak polos
  const r = rng(31); for (let i = 0; i < 7; i++) { const x = -150 + i * 230 + r() * 80, y = PRT.ground + 260 + r() * 380; ellipse(ctx, x, y, 70 + r() * 50, 14 + r() * 6); ctx.fillStyle = 'rgba(150,170,180,.55)'; ctx.fill(); ellipse(ctx, x - 20, y - 3, 30, 4); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fill(); }
  for (let i = 0; i < 10; i++) { const x = -200 + r() * 1500, y = PRT.ground + 200 + r() * 500; ellipse(ctx, x, y, 16 + r() * 14, 10 + r() * 6); fillStroke(ctx, '#8d7a64', 4); }
  ctx.fillStyle = 'rgba(40,25,15,.35)'; ellipse(ctx, 545, PRT.ground + 130, 90, 18); ctx.fill();
}
// Lapangan latihan (hijau cerah, bukit, awan).
function fieldScene(ctx, t, cam) {
  skyFill(ctx, PRG.sky, PRG.skyLo); applyCam(ctx, cam, 1);
  drawCloud(ctx, 200 + t * 9, 330, 100, 2); drawCloud(ctx, 860 + t * 7, 230, 80, 6);
  hillBand(ctx, LAP.ground - 330, 160, PRG.hillFar, 2); hillBand(ctx, LAP.ground - 170, 110, PRG.hill, 4);
  rrect(ctx, -1600, LAP.ground - 30, 4400, 1500, 0); fillStroke(ctx, PRG.grass, 8); grassTufts(ctx, -1500, 2600, LAP.ground - 20, 9);
}
// Hutan Ardennes: cemara rapat (latar), jalan setapak tanah. Pohon depan digambar oleh shot (bisa melengkung saat tank lewat).
function ardennesScene(ctx, t, cam) {
  skyFill(ctx, PRG.forestSky, '#cfe3d6'); applyCam(ctx, cam, 1);
  hillBand(ctx, ARD.ground - 420, 120, '#6e9c84', 11);
  const r = rng(12); for (let x = -1500; x < 3000; x += 120) drawPine(ctx, x + r() * 60, ARD.ground - 230 - r() * 40, .75 + r() * .2, { col: PRG.pineFar });
  const r2 = rng(13); for (let x = -1450; x < 3000; x += 150) drawPine(ctx, x + r2() * 70, ARD.ground - 110 - r2() * 30, .95 + r2() * .2, { col: PRG.pine });
  rrect(ctx, -1600, ARD.ground - 40, 4600, 1500, 0); fillStroke(ctx, PRG.forestGround, 8);
  ctx.beginPath(); ctx.moveTo(-1600, ARD.ground + 10); ctx.lineTo(3000, ARD.ground + 10); ctx.lineTo(3000, ARD.ground + 150); ctx.lineTo(-1600, ARD.ground + 150); ctx.closePath(); fillStroke(ctx, '#8a6a45', 6);
  grassTufts(ctx, -1500, 3000, ARD.ground + 120, 14, '#3c6634');
}
// Padang salju Rusia: langit kelabu, cemara bersalju, salju turun (drawSnowfall dipanggil shot setelah tokoh).
function snowScene(ctx, t, cam) {
  skyFill(ctx, PRG.snowSky, PRG.snowSkyLo); applyCam(ctx, cam, 1);
  hillBand(ctx, SLJ.ground - 300, 120, '#e3e9f2', 21);
  const r = rng(22); for (let x = -1500; x < 2800; x += 210) drawPine(ctx, x + r() * 90, SLJ.ground - 170 - r() * 30, .7 + r() * .2, { col: '#3d5f55', snow: 1 });
  rrect(ctx, -1600, SLJ.ground - 40, 4400, 1500, 0); fillStroke(ctx, PRG.snow, 8);
  ctx.fillStyle = PRG.snowDk; for (let i = 0; i < 9; i++) { ellipse(ctx, -1200 + i * 420, SLJ.ground + 80 + (i % 3) * 90, 160, 18); ctx.fill(); }
}
