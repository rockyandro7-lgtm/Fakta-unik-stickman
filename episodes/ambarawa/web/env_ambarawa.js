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

// ===================== Aset produksi (16-11-2026) =====================
// Peci hitam (TKR / Isdiman).
function hatPeci(ctx, hx, hy, hr, lw) {
  ctx.beginPath(); ctx.moveTo(hx - hr * .92, hy - hr * .42); ctx.lineTo(hx - hr * .8, hy - hr * 1.08); ctx.quadraticCurveTo(hx, hy - hr * 1.22, hx + hr * .8, hy - hr * 1.08);
  ctx.lineTo(hx + hr * .92, hy - hr * .42); ctx.quadraticCurveTo(hx, hy - hr * .58, hx - hr * .92, hy - hr * .42); ctx.closePath(); fillStroke(ctx, '#1d1c22', lw);
  ctx.save(); ctx.globalAlpha = .35; line(ctx, hx - hr * .6, hy - hr * .95, hx + hr * .1, hy - hr * 1.02, lw * .7, '#ffffff'); ctx.restore();
}
// Pet Belanda (KNIL/NICA): topi lapangan dengan pinggiran depan.
function hatPet(ctx, hx, hy, hr, lw) {
  ctx.beginPath(); ctx.ellipse(hx, hy - hr * .7, hr * .95, hr * .5, 0, Math.PI, TAU); ctx.closePath(); fillStroke(ctx, AMB.nl, lw);
  ellipse(ctx, hx + hr * .55, hy - hr * .66, hr * .6, hr * .14, .1); fillStroke(ctx, AMB.nlDk, lw);
  circle(ctx, hx, hy - hr * .92, hr * .12); fillStroke(ctx, '#f39a2e', lw * .7);
}
AMB.nl = '#6f7f8f'; AMB.nlDk = '#55626e'; AMB.red = '#e5262a';
const TKR = { cols: [AMB.tkr, AMB.tkr], hat: hatPeci, belt: true };
// Token peta umum: side 'tkr' (hijau + peci) | 'nl' (abu-biru + pet Belanda) | lainnya -> mapSoldier asli ('uk' = Sekutu).
function token(ctx, x, y, s, side, face, o = {}) {
  if (side !== 'tkr' && side !== 'nl') return mapSoldier(ctx, x, y, s, side, face, o);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.roundRect(-.2, -.02, .4, .26, [.14, .14, .04, .04]); fillStroke(ctx, side === 'tkr' ? AMB.tkr : AMB.nl, .03);
  if (side === 'nl') { ctx.fillStyle = '#f39a2e'; ctx.fillRect(-.2, .06, .4, .045); }
  circle(ctx, 0, -.17, .19); fillStroke(ctx, HEAD, .025);
  (side === 'tkr' ? hatPeci : hatPet)(ctx, 0, -.17, .19, .025);
  drawFace(ctx, 0, -.17, .19, face || EXPR.netral, { t: o.t || 0 }, null);
  if (o.rifle) drawRifle(ctx, .26, .02, .55, -.5);
  ctx.restore();
}
// Senapan kartun (koordinat lokal, s = panjang relatif). rot rad.
function drawRifle(ctx, x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); const lw = .03;
  path(ctx, [[-.32, -.03], [.0, -.04], [.02, .06], [-.3, .08]]); fillStroke(ctx, '#8a5a2b', lw);
  rrect(ctx, 0, -.035, .55, .05, .02); fillStroke(ctx, '#4a4d55', lw);
  line(ctx, .08, .015, .1, .07, lw, INK);
  ctx.restore();
}
// Penjara kayu di peta. open 0..1 = jeruji naik.
function drawJail(ctx, x, y, s, open = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -120, -170, 240, 170, 10); fillStroke(ctx, '#d9c9a0', 7);
  path(ctx, [[-140, -165], [0, -235], [140, -165]]); fillStroke(ctx, '#b0583a', 7);
  ctx.save(); rrect(ctx, -90, -140, 180, 140, 6); ctx.clip(); ctx.fillStyle = '#3a3340'; ctx.fillRect(-90, -140, 180, 140);
  const dy = -open * 150; for (let i = 0; i < 6; i++) line(ctx, -75 + i * 30, -140 + dy, -75 + i * 30, dy, 9, '#7d8590');
  line(ctx, -90, -70 + dy, 90, -70 + dy, 9, '#7d8590'); ctx.restore();
  rrect(ctx, -90, -140, 180, 140, 6); fillStroke(ctx, null, 7);
  text(ctx, 'PENJARA', 0, -190, 30, '#fff', INK, 7);
  ctx.restore();
}
// Udang kartun bercapit (supit urang). (x,y) = pusat badan. o: { t, snap 0..1 (capit menutup), face }
function drawUdang(ctx, x, y, s, o = {}) {
  const t = o.t || 0, sn = o.snap || 0, col = '#f2754b', dk = '#c9502e', hi = '#ffb08f';
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // ekor + ruas badan melengkung (badan di bawah, kepala atas)
  for (let i = 5; i >= 0; i--) { const a = -.3 + i * .32, r = 210 + i * 0, cx = Math.sin(a) * 120 - 40, cy = 120 + i * 62, w = 120 - i * 10;
    ellipse(ctx, cx, cy, w, 46, a * .3); fillStroke(ctx, i % 2 ? col : hi, 7); }
  path(ctx, [[-30, 470], [-130, 560], [-10, 520], [60, 580], [40, 470]]); fillStroke(ctx, col, 7);
  // kaki kecil
  for (let i = 0; i < 4; i++) line(ctx, 40 + i * 6, 150 + i * 60, 120 + i * 6, 180 + i * 60 + Math.sin(t * 12 + i) * 8, 8);
  // kepala
  ctx.beginPath(); ctx.ellipse(0, 0, 150, 120, 0, 0, TAU); fillStroke(ctx, col, 8);
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 150, 120, 0, 0, TAU); ctx.clip(); ctx.fillStyle = dk; ctx.globalAlpha = .4; ctx.fillRect(40, -130, 150, 260); ctx.restore();
  // antena
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 40, -100); ctx.quadraticCurveTo(sd * 160, -330 + Math.sin(t * 4 + sd) * 20, sd * 330, -300 + Math.sin(t * 3 + sd) * 30); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke(); }
  // dua capit (kiri/kanan) di depan kepala, capit menutup saat snap
  for (const sd of [-1, 1]) {
    ctx.save(); ctx.translate(sd * 120, -40); ctx.rotate(sd * (.55 - sn * .35));
    line(ctx, 0, 0, sd * 140, -150, 34, INK); line(ctx, 0, 0, sd * 140, -150, 20, col);
    ctx.translate(sd * 150, -170); const op = .5 * (1 - sn);
    for (const j of [-1, 1]) { ctx.save(); ctx.rotate(j * op); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(j * 90 + sd * 20, -40, sd * 30, -230); ctx.quadraticCurveTo(j * 20, -110, 0, 0); ctx.closePath(); fillStroke(ctx, j === 1 ? col : hi, 8); ctx.restore(); }
    ctx.restore();
  }
  ctx.restore();
  if (o.face) propFace(ctx, x, y + 10 * s, 210 * s, o.face, { t });
}
// Bendera merah putih (garis horizontal) berkibar. (x,y) = dasar tiang. k 0..1 = naik ke puncak.
function bendera(ctx, x, y, s, t, k = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const h = 420, fw = 230, fh = 150, top = -h + 10 - (1 - k) * 0, y0 = lerp(-150, top, k);
  line(ctx, 0, 0, 0, -h, 10); circle(ctx, 0, -h - 6, 12); fillStroke(ctx, '#e8c04a', 5);
  const pt = (u, v) => [u * fw, y0 + v * fh + Math.sin(t * 6 - u * 5) * 14 * u];
  const band = (v0, v1) => { ctx.beginPath(); for (let i = 0; i <= 16; i++) ctx.lineTo(...pt(i / 16, v0)); for (let i = 16; i >= 0; i--) ctx.lineTo(...pt(i / 16, v1)); ctx.closePath(); };
  band(0, .5); ctx.fillStyle = AMB.red; ctx.fill(); band(.5, 1); ctx.fillStyle = '#ffffff'; ctx.fill(); band(0, 1); fillStroke(ctx, null, 6);
  ctx.restore();
}
// Bintang emas (lencana Panglima Besar)
function lencana(ctx, x, y, r, t, k = 1) { if (k <= 0) return; ctx.save(); ctx.translate(x, y); const sc = backOut(clamp(k)); ctx.scale(sc, sc); circle(ctx, 0, 0, r * 1.25); fillStroke(ctx, '#c8102e', 6); star5(ctx, 0, 0, r, Math.sin(t * 2) * .1, '#ffd23a'); ctx.restore(); }
