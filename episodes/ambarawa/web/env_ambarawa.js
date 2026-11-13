// ---------- Fakta Unik: PETA kartun Palagan Ambarawa (Nov-Des 1945) ----------
// Gaya sama dengan peta Blitzkrieg (env_peta.js): laut MPC.sea + ombak, daratan warna datar bergaris tinta, panah spidol drawArrow,
// label putih bergaris tinta, token tentara mapSoldier ('uk' = Sekutu/Inggris, helm Brodie).
// Butuh: lib.js, chars.js, env.js (applyCam), env_perang.js (PRG, drawPine), env_peta.js (MPC, drawArrow, mapSoldier, hatBrodie), fx_v5.js.
// Garis pantai dan posisi = perkiraan tangan dari peta Jawa Tengah. Peta ilustrasi.
const AMB = {
  land: '#e8deb4', landDk: '#d9cc98', mount: '#a9c07a', mountDk: '#8aa35e', lake: '#7fc3e4', road: '#fbf3dc',
  coat: '#56603a', coatDk: '#454d2e', blangkon: '#4a2e1f', batik: '#c99a52', tkr: '#3f6b3a',
};
// 1 derajat = 1400 px dunia, Ambarawa di (540, 900)
const projJ = (lon, lat) => [(lon - 110.40) * 1400 + 540, -(lat + 7.26) * 1400 + 900];
const TJ = {
  ambarawa: projJ(110.40, -7.26), semarang: projJ(110.42, -6.99), magelang: projJ(110.22, -7.47),
  ungaran: projJ(110.33, -7.18), merbabu: projJ(110.44, -7.45), rawapening: projJ(110.445, -7.29),
};
const PANTAI = [[109.6, -6.86], [109.9, -6.87], [110.1, -6.9], [110.25, -6.95], [110.35, -6.96], [110.42, -6.95], [110.48, -6.92], [110.55, -6.87], [110.62, -6.8], [110.7, -6.7], [110.8, -6.55], [111.2, -6.3]].map(p => projJ(...p));
const JALAN = [[110.42, -6.99], [110.40, -7.08], [110.40, -7.14], [110.43, -7.22], [110.40, -7.26], [110.33, -7.34], [110.22, -7.47], [110.15, -7.6]].map(p => projJ(...p));

function gunung(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-170, 60); ctx.quadraticCurveTo(-60, -40, -18, -120); ctx.quadraticCurveTo(0, -132, 18, -120); ctx.quadraticCurveTo(60, -40, 170, 60); ctx.closePath(); fillStroke(ctx, AMB.mount, 7);
  ctx.save(); ctx.clip(); ctx.fillStyle = AMB.mountDk; ctx.beginPath(); ctx.moveTo(0, -130); ctx.lineTo(40, 70); ctx.lineTo(200, 70); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-170, 60); ctx.quadraticCurveTo(-60, -40, -18, -120); ctx.quadraticCurveTo(0, -132, 18, -120); ctx.quadraticCurveTo(60, -40, 170, 60); ctx.closePath(); fillStroke(ctx, null, 7);
  ctx.restore();
}
// Peta dasar Ambarawa. o.labels: {semarang, ambarawa, magelang} alpha
function petaAmbarawa(ctx, t, cam, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = MPC.sea; ctx.fillRect(0, 0, W, H); ctx.restore();
  applyCam(ctx, cam, 1);
  ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  const r = rng(5); for (let i = 0; i < 45; i++) { const x = -600 + r() * 2300, y = -900 + r() * 1250, d = Math.sin(t * 1.5 + i) * 6; ctx.beginPath(); ctx.moveTo(x - 22 + d, y); ctx.quadraticCurveTo(x + d, y - 10, x + 22 + d, y); ctx.stroke(); }
  // daratan Jawa
  const land = () => { ctx.beginPath(); PANTAI.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.lineTo(PANTAI[PANTAI.length - 1][0], 3200); ctx.lineTo(PANTAI[0][0], 3200); ctx.closePath(); };
  land(); ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(40,60,90,.18)'; ctx.stroke();
  land(); fillStroke(ctx, AMB.land, 7);
  // gunung + hutan
  gunung(ctx, TJ.ungaran[0] - 60, TJ.ungaran[1] - 10, .9);
  gunung(ctx, TJ.merbabu[0] + 120, TJ.merbabu[1] + 40, 1.15);
  const r2 = rng(9); for (let i = 0; i < 14; i++) { const x = TJ.ungaran[0] - 260 + r2() * 260, y = TJ.ungaran[1] + 40 + r2() * 120; drawPine(ctx, x, y, .2 + r2() * .05, { col: PRG.pine }); }
  // Rawa Pening
  ellipse(ctx, TJ.rawapening[0] + 40, TJ.rawapening[1], 110, 55, -.2); fillStroke(ctx, AMB.lake, 7);
  // jalan Semarang - Ambarawa - Magelang
  const jl = () => { ctx.beginPath(); smoothPts(JALAN).forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  jl(); ctx.lineWidth = 30; ctx.strokeStyle = INK; ctx.stroke(); jl(); ctx.lineWidth = 18; ctx.strokeStyle = AMB.road; ctx.stroke();
  // kota + label (gaya city() di peta Blitzkrieg)
  const L = o.labels || {};
  const city = (s, p, a, dx = 0, dy = -50, size = 46) => { if (a > 0) { ctx.save(); ctx.globalAlpha *= a; circle(ctx, p[0], p[1], 14); fillStroke(ctx, '#fff', 6); text(ctx, s, p[0] + dx, p[1] + dy, size, '#fff', INK, size * .22); ctx.restore(); } };
  city('SEMARANG', TJ.semarang, L.semarang == null ? 1 : L.semarang, 150, -10);
  city('MAGELANG', TJ.magelang, L.magelang || 0, 0, 56);
  city('AMBARAWA', TJ.ambarawa, L.ambarawa == null ? 1 : L.ambarawa, 0, o.ambY || -150, 56);
}
// Blangkon sebagai topi drawStick (hat: hatBlangkon). Mondolan di belakang kepala (sisi kiri lokal = belakang saat menghadap kanan).
function hatBlangkon(ctx, hx, hy, hr, lw) {
  const shape = () => {
    ctx.beginPath(); ctx.moveTo(hx - hr * 1.03, hy - hr * .18);
    ctx.bezierCurveTo(hx - hr * 1.12, hy - hr * 1.25, hx + hr * 1.12, hy - hr * 1.25, hx + hr * 1.03, hy - hr * .18);
    ctx.quadraticCurveTo(hx + hr * .5, hy - hr * .5, hx, hy - hr * .58);
    ctx.quadraticCurveTo(hx - hr * .5, hy - hr * .5, hx - hr * 1.03, hy - hr * .18); ctx.closePath();
  };
  circle(ctx, hx - hr * .98, hy - hr * .32, hr * .34); fillStroke(ctx, AMB.blangkon, lw);
  shape(); ctx.fillStyle = AMB.blangkon; ctx.fill();
  ctx.save(); shape(); ctx.clip();
  for (let i = -4; i <= 4; i++) for (let j = 0; j < 4; j++) { const px = hx + i * hr * .26 + (j % 2) * hr * .13, py = hy - hr * 1.05 + j * hr * .2; ctx.beginPath(); ctx.arc(px, py, hr * .06, 0, Math.PI * 1.4); ctx.lineWidth = hr * .035; ctx.strokeStyle = AMB.batik; ctx.stroke(); }
  ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(hx + hr * .2, hy - hr * 1.3, hr * 1.2, hr * 1.4);
  ctx.restore();
  shape(); fillStroke(ctx, null, lw);
  line(ctx, hx - hr * .9, hy - hr * .36, hx + hr * .9, hy - hr * .36, lw * .8, 'rgba(201,154,82,.9)');
}
// Mantel panjang (propBehind lengan kiri, koordinat lokal tokoh): dua belahan + kancing + kerah
function coatSoedirman(c, k) {
  if (k !== 'L') return;
  for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(sd * .125, -.36); c.lineTo(sd * .005, -.36); c.lineTo(sd * .03, -.17); c.lineTo(sd * .14, -.18); c.closePath(); fillStroke(c, AMB.coat, .017); }
  c.save(); c.beginPath(); c.moveTo(.005, -.36); c.lineTo(.125, -.36); c.lineTo(.14, -.18); c.lineTo(.03, -.17); c.closePath(); c.clip(); c.fillStyle = 'rgba(30,10,40,.18)'; c.fillRect(.07, -.4, .1, .3); c.restore();
  for (const y of [-.58, -.5, -.42]) { circle(c, .03, y, .012); c.fillStyle = '#d9b64a'; c.fill(); }
  c.beginPath(); c.moveTo(-.05, -.62); c.lineTo(.0, -.53); c.lineTo(.05, -.62); c.lineWidth = .012; c.strokeStyle = INK; c.stroke();
}
const SOEDIRMAN = { cols: [AMB.coat, AMB.coat], hat: hatBlangkon, belt: false, propBehind: coatSoedirman };
// Tag kuning miring ("29 TAHUN"), warna sama dengan teks kuning thumbnail Blitzkrieg
function tagKuning(ctx, str, x, y, size, rot = -.1, k = 1) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  ctx.font = `700 ${size}px Poppins`; const w = ctx.measureText(str).width + size * .9;
  rrect(ctx, -w / 2 + 8, -size * .7 + 10, w, size * 1.4, size * .25); ctx.fillStyle = 'rgba(30,15,30,.3)'; ctx.fill();
  rrect(ctx, -w / 2, -size * .7, w, size * 1.4, size * .25); fillStroke(ctx, '#ffd23a', 8);
  text(ctx, str, 0, 3, size, INK, INK, 0); ctx.restore();
}
