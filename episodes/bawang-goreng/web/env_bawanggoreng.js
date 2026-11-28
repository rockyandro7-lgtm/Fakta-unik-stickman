// ---------- Aset episode "Bawang goreng gosong di piring" (28-11-2026) ----------
// Aturan v6: SATU fungsi per benda, palet BGP terkunci, tata letak BGL terkunci.
// Irisan bawang mentah -> kuning muda -> kuning emas -> cokelat -> gosong = SATU fungsi drawIrisGoreng (opsi c 0..1), supaya warnanya nyambung antar shot.
const BGP = {
  raw: '#dc8fbd', rawDk: '#a9578a', muda: '#f7e08f', emas: '#eaa431', coklat: '#9a5522', gosong: '#3a2217',
  plate: '#f4f6fa', plateRim: '#7fb6e6', tissue: '#fffdf2', oilSpot: 'rgba(236,170,60,.35)',
  jar: 'rgba(214,238,255,.55)', jarLid: '#e5392f', bowl: '#7fc6e8', bowlDk: '#4f9cc4',
  iron: '#4ab3f0', ironDk: '#2a7fbf', sole: '#c9ced9', hot: '#ff5a2a', board: '#e8eef6', boardDk: '#b9c3d3', cloth: '#ffd23a', clothDk: '#e0a91a', burn: '#6a3a1a',
  micro: '#2a120c', microHi: '#5a2814', oil: '#f4b83c', oilDk: '#c98a22', smoke: '#5b5560',
};
// Tata letak dapur (terkunci). Tokoh di belakang meja (y = 1500, s 600), meja 1330.
const BGL = { top: 1330, back: 1500, stove: [620, 1330], wok: [620, 1127], wokS: .82, plate: [215, 1330], toples: [-430, 1330], bowl: [-760, 1330], fridge: -760,
  budi: 1000, rani: -150, ibuIn: -600, ibu: 1000, budiL: 60 };

// warna irisan menurut tingkat masak c (0 mentah, .35 kuning muda, .6 kuning emas, .8 cokelat, 1 gosong)
function warnaBawang(c) {
  const S = [[0, BGP.raw], [.35, BGP.muda], [.6, BGP.emas], [.8, BGP.coklat], [1, BGP.gosong]]; c = clamp(c);
  for (let i = 1; i < S.length; i++) if (c <= S[i][0]) return mixC(S[i - 1][1], S[i][1], (c - S[i - 1][0]) / (S[i][0] - S[i - 1][0]));
  return BGP.gosong;
}
// Satu irisan bawang (cincin). (x,y) = pusat, r = jari-jari luar. c = tingkat masak. o: { lw, shade }
function drawIrisGoreng(ctx, x, y, r, rot, c, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const col = warnaBawang(c), edge = warnaBawang(Math.min(1, c + .18));
  ctx.beginPath(); ctx.ellipse(0, 0, r, r * .72, 0, 0, TAU); ctx.ellipse(r * .08, 0, r * .55, r * .36, 0, 0, TAU, true);
  ctx.fillStyle = c > .3 ? edge : col; ctx.fill('evenodd');
  ctx.beginPath(); ctx.ellipse(0, -r * .02, r * .86, r * .6, 0, 0, TAU); ctx.ellipse(r * .08, 0, r * .62, r * .42, 0, 0, TAU, true); ctx.fillStyle = col; ctx.fill('evenodd');
  ctx.lineWidth = o.lw || Math.max(2, r * .12); ctx.strokeStyle = INK;
  ctx.beginPath(); ctx.ellipse(0, 0, r, r * .72, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(r * .08, 0, r * .55, r * .36, 0, 0, TAU); ctx.stroke();
  if (c < .3) { ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = Math.max(1.5, r * .07); ctx.beginPath(); ctx.ellipse(0, 0, r * .78, r * .55, 0, 3.6, 5.2); ctx.stroke(); }
  ctx.restore();
}
// Tumpukan irisan (gundukan). (x,y) = tengah dasar, w = lebar. o: { c, n, seed, face, t, smoke 0..1, heat 0..1, cv (variasi warna per irisan), r }
function drawTumpukan(ctx, x, y, w, o = {}) {
  const n = Math.max(0, Math.round(o.n == null ? 34 : o.n)), R = rng(o.seed || 7), c = o.c || 0, r = o.r || w * .14, t = o.t || 0, hgt = w * .42 * Math.min(1, .35 + n / 40);
  const pts = []; for (let i = 0; i < n; i++) { const u = R() * 2 - 1, v = R(); const px = u * w * .48 * Math.sqrt(1 - v * .6), py = -v * hgt * (1 - u * u * .7); pts.push([px, py, R() * 3, (R() - .5) * (o.cv == null ? .08 : o.cv)]); }
  pts.sort((a, b) => b[1] - a[1]);
  ctx.save(); ctx.translate(x, y);
  pts.forEach(([px, py, rt, dv]) => drawIrisGoreng(ctx, px, py - r * .4, r * (.85 + .3 * ((rt * 7) % 1)), rt, clamp(c + dv)));
  ctx.restore();
  if (o.heat > 0) for (let i = 0; i < 3; i++) { const q = (t * .7 + i * .33) % 1; ctx.save(); ctx.globalAlpha = (1 - q) * .55 * o.heat; ctx.beginPath(); for (let j = 0; j <= 8; j++) { const yy = y - hgt - 20 - q * 140 - j * 12, xx = x - w * .25 + i * w * .25 + Math.sin(t * 5 + j * .8 + i) * 10; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 8; ctx.strokeStyle = '#ffcf8a'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  if (o.smoke > 0) for (let i = 0; i < 4; i++) { const q = (t * .5 + i * .25) % 1; puff(ctx, x - w * .2 + i * w * .14 + Math.sin(t + i) * 14, y - hgt - 30 - q * 260, (26 + q * 50) * o.smoke + .5, t, BGP.smoke, 4 + i, (1 - q) * .8 * o.smoke); }
  if (o.face) propFace(ctx, x, y - hgt * .55, w * .5, o.face, { t });
}
// Piring tiris + kertas minyak + tumpukan. (x,y) = tengah dasar piring. o.pile = opsi drawTumpukan (atau null)
function drawPiringTiris(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 6, 175, 20); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-170, -26); ctx.quadraticCurveTo(-150, 6, 0, 6); ctx.quadraticCurveTo(150, 6, 170, -26); ctx.closePath(); fillStroke(ctx, BGP.plate, 6);
  ellipse(ctx, 0, -26, 170, 30); fillStroke(ctx, BGP.plate, 6); ellipse(ctx, 0, -26, 140, 22); ctx.strokeStyle = BGP.plateRim; ctx.lineWidth = 6; ctx.stroke();
  path(ctx, [[-128, -30], [-90, -50], [-20, -46], [60, -54], [126, -36], [110, -14], [20, -8], [-70, -12]]); fillStroke(ctx, BGP.tissue, 4);
  if (o.spots > 0) { ctx.save(); ctx.globalAlpha = clamp(o.spots); ctx.fillStyle = BGP.oilSpot; for (const [sx, sy, sr] of [[-60, -30, 22], [30, -34, 26], [80, -26, 14], [-10, -20, 12]]) { ellipse(ctx, sx, sy, sr, sr * .4); ctx.fill(); } ctx.restore(); }
  ctx.restore();
  if (o.pile) drawTumpukan(ctx, x, y - 30 * s, 220 * s, Object.assign({ t: o.t }, o.pile));
}
// Serok berisi bawang. (x,y) = pusat mangkuk serok, rot = arah gagang (0 = ke kanan). o: { c, n, drip 0..1, t }
function drawSerokBawang(ctx, x, y, s = 1, rot = 0, o = {}) {
  drawSerok(ctx, x, y, s, rot);
  if (o.n > 0) drawTumpukan(ctx, x, y + 6 * s, 170 * s, { c: o.c, n: o.n, seed: o.seed || 11, t: o.t, r: 20 * s });
  if (o.drip > 0) for (let i = 0; i < 4; i++) { const q = ((o.t || 0) * 2.2 + i / 4) % 1; const dx = x - 60 * s + i * 40 * s; ctx.save(); ctx.globalAlpha = (1 - q) * o.drip; ellipse(ctx, dx, y + 30 * s + q * 120 * s, 6 * s, 10 * s); fillStroke(ctx, BGP.oil, 3); ctx.restore(); }
}
// Isi wajan: irisan mengapung di minyak + gelembung. Dipanggil di callback inside drawWok (koordinat lokal wajan).
function isiWajan(ctx, t, c, n, stir = 0, seed = 13) {
  const R = rng(seed); for (let i = 0; i < n; i++) { const a = R() * TAU + stir * t * 2.2, rr = Math.sqrt(R()) * 170; const px = Math.cos(a) * rr, py = 12 + Math.sin(a) * rr * .18 + Math.sin(t * 6 + i) * 3; drawIrisGoreng(ctx, px, py, 22, R() * 3 + stir * t, clamp(c + (R() - .5) * .08)); }
  for (let i = 0; i < 14; i++) { const q = (t * 2 + i * .37) % 1, bx = (R() - .5) * 340, by = 8 + (R() - .5) * 40; circle(ctx, bx, by, 3 + 8 * q); ctx.lineWidth = 3; ctx.strokeStyle = `rgba(255,255,255,${.8 * (1 - q)})`; ctx.stroke(); }
}
// Mangkuk irisan bawang mentah. (x,y) = tengah dasar. o: { n, t, face }
function drawMangkukIris(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 6, 150, 16); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-150, -110); ctx.quadraticCurveTo(-140, 0, 0, 0); ctx.quadraticCurveTo(140, 0, 150, -110); ctx.closePath(); fillStroke(ctx, BGP.bowl, 7);
  ctx.restore();
  if (o.n > 0) drawTumpukan(ctx, x, y - 104 * s, 250 * s, { c: 0, n: o.n, seed: 21, t: o.t, r: 26 * s, cv: .02 });
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.ellipse(0, -110, 150, 26, 0, .05, Math.PI - .05); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, -110, 150, 26, 0, Math.PI + .05, TAU - .05); ctx.stroke(); ctx.restore();
  if (o.face) propFace(ctx, x, y - 50 * s, 110 * s, o.face, { t: o.t || 0 });
}
// Toples bawang goreng. (x,y) = tengah dasar. o: { fill 0..1, label, t, glow, face }
function drawToplesBawang(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 4, 120, 14); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  const f = clamp(o.fill || 0); rrect(ctx, -110, -320, 220, 320, 34); ctx.fillStyle = BGP.jar; ctx.fill();
  if (f > 0) { ctx.save(); rrect(ctx, -110, -320, 220, 320, 34); ctx.clip(); const R = rng(31), top = -16 - 290 * f;
    ctx.fillStyle = BGP.emas; ctx.fillRect(-120, top, 240, 340);
    for (let i = 0; i < 70 * f + 6; i++) drawIrisGoreng(ctx, -96 + R() * 192, top + 10 + R() * (290 * f), 18, R() * 3, .55 + R() * .12, { lw: 3 });
    ctx.restore(); }
  ctx.fillStyle = 'rgba(255,255,255,.5)'; rrect(ctx, -92, -296, 18, 250, 9); ctx.fill();
  rrect(ctx, -110, -320, 220, 320, 34); fillStroke(ctx, null, 6); rrect(ctx, -122, -352, 244, 46, 12); fillStroke(ctx, BGP.jarLid, 6);
  if (o.label) { rrect(ctx, -86, -190, 172, 60, 8); fillStroke(ctx, '#fffaf0', 4); text(ctx, o.label, 0, -159, 36, INK, INK, 0); }
  ctx.restore();
  if (o.glow > 0) glowRing(ctx, x, y - 160 * s, 190 * s, o.glow, '255,190,60');
  if (o.face) propFace(ctx, x, y - 90 * s, 130 * s, o.face, { t: o.t || 0 });
}
// Tetes minyak panas berwajah (dunia mikro). o: { face, t, hot 0..1, alpha }
function drawTetesMinyak(ctx, x, y, r, o = {}) {
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha; ctx.translate(x, y); const wb = 1 + Math.sin((o.t || 0) * 26 + x) * .05; ctx.scale(wb, 1 / wb);
  ctx.beginPath(); ctx.moveTo(0, -r * 1.45); ctx.quadraticCurveTo(r * .95, -r * .5, r, r * .05); ctx.arc(0, 0, r, 0, Math.PI); ctx.quadraticCurveTo(-r * .95, -r * .5, 0, -r * 1.45); ctx.closePath();
  const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r * 1.2); g.addColorStop(0, '#ffe08a'); g.addColorStop(1, lerpC(BGP.oil, '#ff7a2a', clamp(o.hot || 0))); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = r * .1; ctx.strokeStyle = INK; ctx.stroke();
  ellipse(ctx, -r * .42, -r * .35, r * .16, r * .28, .4); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fill();
  ctx.restore();
  if (o.face) propFace(ctx, x, y + r * .1, r * 1.25, o.face, { t: o.t || 0, alpha: o.alpha });
}
// Latar dunia mikro: permukaan irisan bawang raksasa (cokelat gelap hangat). heat 0..1 = tepi menyala
function mikroBawangBG(ctx, t, heat = 0) {
  const g = ctx.createRadialGradient(540, 900, 100, 540, 900, 1300); g.addColorStop(0, BGP.microHi); g.addColorStop(1, BGP.micro); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const R = rng(41); ctx.fillStyle = 'rgba(255,200,120,.06)'; for (let i = 0; i < 40; i++) { ellipse(ctx, R() * W, R() * H, 30 + R() * 80, 10 + R() * 20, R()); ctx.fill(); }
  if (heat > 0) { const h = ctx.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 1150); h.addColorStop(0, 'rgba(255,90,20,0)'); h.addColorStop(1, `rgba(255,90,20,${.5 * heat * (.85 + .15 * Math.sin(t * 9))})`); ctx.fillStyle = h; ctx.fillRect(0, 0, W, H); }
}
// ===== setrika (tampak atas) + papan setrika + kaos =====
// Setrika: (x,y) = pusat, rot. o: { hot 0..1 (tapak menyala), face, t, plug (0 = tercolok, 1 = dicabut jauh) }
function drawSetrika(ctx, x, y, s = 1, rot = 0, o = {}) {
  const t = o.t || 0, hot = clamp(o.hot || 0); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (hot > 0) { const g = ctx.createRadialGradient(0, 0, 40, 0, 0, 300); g.addColorStop(0, `rgba(255,110,40,${.45 * hot})`); g.addColorStop(1, 'rgba(255,110,40,0)'); ctx.fillStyle = g; ctx.fillRect(-300, -300, 600, 600); }
  const body = () => { ctx.beginPath(); ctx.moveTo(-210, 0); ctx.quadraticCurveTo(-120, -120, 110, -118); ctx.quadraticCurveTo(170, -110, 170, 0); ctx.quadraticCurveTo(170, 110, 110, 118); ctx.quadraticCurveTo(-120, 120, -210, 0); ctx.closePath(); };
  ctx.save(); ctx.translate(10, 10); body(); ctx.fillStyle = lerpC(BGP.sole, BGP.hot, hot); ctx.fill(); ctx.restore();
  body(); ctx.fillStyle = BGP.iron; ctx.fill(); shadeShape(ctx, body, 1, .16, .3, [-210, -120, 380, 240]); body(); fillStroke(ctx, null, 8);
  rrect(ctx, -90, -34, 220, 68, 34); fillStroke(ctx, BGP.ironDk, 7);
  circle(ctx, 120, 0, 26); fillStroke(ctx, '#fffaf0', 5); line(ctx, 120, 0, 120 + 18 * Math.cos(-1.2 + hot), 18 * Math.sin(-1.2 + hot), 5, '#e5392f');
  ctx.restore();
  if (o.face) propFace(ctx, x - 40 * s, y + 60 * s, 120 * s, o.face, { t });
}
function drawPapanSetrika(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const b = () => { ctx.beginPath(); ctx.moveTo(-330, -760); ctx.quadraticCurveTo(0, -1000, 330, -760); ctx.lineTo(300, 760); ctx.lineTo(-300, 760); ctx.closePath(); };
  b(); ctx.fillStyle = BGP.board; ctx.fill(); ctx.save(); b(); ctx.clip(); ctx.fillStyle = 'rgba(120,140,170,.18)'; for (let i = -12; i < 16; i++) ctx.fillRect(-400, i * 64, 800, 22); ctx.restore(); b(); fillStroke(ctx, null, 8);
  ctx.restore();
}
// Kaos tampak atas di papan. o: { burn 0..1 (bekas gosong berbentuk setrika), burnX, burnY, burnRot }
function drawKaosAtas(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const b = () => path(ctx, [[-120, -330], [-40, -300], [40, -300], [120, -330], [260, -230], [200, -110], [140, -150], [150, 330], [-150, 330], [-140, -150], [-200, -110], [-260, -230]]);
  b(); ctx.fillStyle = BGP.cloth; ctx.fill(); shadeShape(ctx, b, 1, .14, .3, [-260, -330, 520, 660]); b(); fillStroke(ctx, null, 7);
  ctx.beginPath(); ctx.moveTo(-40, -300); ctx.quadraticCurveTo(0, -250, 40, -300); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  if (o.burn > 0) { ctx.save(); ctx.translate(o.burnX || 0, o.burnY || 40); ctx.rotate(o.burnRot || 0); ctx.globalAlpha = clamp(o.burn);
    ctx.beginPath(); ctx.moveTo(-200, 0); ctx.quadraticCurveTo(-115, -112, 105, -112); ctx.quadraticCurveTo(160, -104, 160, 0); ctx.quadraticCurveTo(160, 104, 105, 112); ctx.quadraticCurveTo(-115, 114, -200, 0); ctx.closePath();
    const g = ctx.createRadialGradient(0, 0, 20, 0, 0, 220); g.addColorStop(0, BGP.gosong); g.addColorStop(1, BGP.burn); ctx.fillStyle = g; ctx.fill(); ctx.restore(); }
  ctx.restore();
}
// Lantai keramik tampak atas (latar shot setrika)
function lantaiAtasBG(ctx, cam) {
  applyCam(ctx, cam, 1); ctx.fillStyle = '#cfe3e8'; ctx.fillRect(-2000, -2000, 5000, 6000);
  ctx.strokeStyle = 'rgba(70,110,120,.25)'; ctx.lineWidth = 6; for (let i = -10; i < 20; i++) { line(ctx, -2000, i * 220, 3000, i * 220, 6, 'rgba(70,110,120,.25)'); line(ctx, i * 220, -2000, i * 220, 4000, 6, 'rgba(70,110,120,.25)'); }
}
