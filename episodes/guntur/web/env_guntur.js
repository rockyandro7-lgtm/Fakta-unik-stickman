// ---------- Aset episode "Guntur telat" (28-11-2026) ----------
// Aturan v6: SATU fungsi per benda, palet GTP terkunci, tata letak GL terkunci.
// Ruang tengah malam = rumahBG (env_jemur) + drawLampu/gelapRuang (env_laron), sama dengan set Laron/Cicak.
const GTP = {
  sky: '#141a38', skyHi: '#2a3466', hill: '#1d3b2c', hillHi: '#2b5a3e', cloud: '#55608c', cloudDk: '#3a4370', cloudHi: '#7a86b4',
  bolt: '#fffbe6', glow: '255,244,180', wave: '#8fd0ff', waveDk: '#3d8fd0', light: '#ffe45a', lightDk: '#ffb020',
  air: '#bfe9ff', airDk: '#7fb9dd', hot: '#ff5a2a', table: '#c68a55', tableDk: '#8a5a34', house: '#f2d3a8', roof: '#c9483a', thermo: '#ff3b2f',
};
// Tata letak ruang tengah (terkunci). Lantai JL.feet = 1560 (s 600). Jendela JL.win = [1000, 720].
const GL = { feet: 1560, budi: 700, rani: 250, table: [-300, 1560], lamp: [520, 300], sink: [540, 1330] };

// titik-titik zigzag kilat (deterministik per seed)
function kilatPts(x0, y0, x1, y1, seed = 1, n = 9, amp = .22) {
  const R = rng(seed), pts = [[x0, y0]], L = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
  for (let i = 1; i < n; i++) { const q = i / n, off = (R() - .5) * 2 * amp * L / n * 3; pts.push([lerp(x0, x1, q) + nx * off, lerp(y0, y1, q) + ny * off]); }
  pts.push([x1, y1]); return pts;
}
// Kilat bercabang. o: { seed, w (tebal), k 0..1 (terang), branches }
function drawKilat(ctx, x0, y0, x1, y1, o = {}) {
  const k = clamp(o.k == null ? 1 : o.k); if (k <= 0) return; const w = o.w || 16, seed = o.seed || 1;
  const main = kilatPts(x0, y0, x1, y1, seed), br = [];
  const R = rng(seed + 50); for (let b = 0; b < (o.branches == null ? 3 : o.branches); b++) { const i = 2 + Math.floor(R() * (main.length - 4)), p = main[i], a = Math.atan2(y1 - y0, x1 - x0) + (R() < .5 ? -1 : 1) * (.5 + R() * .4), l = Math.hypot(x1 - x0, y1 - y0) * (.18 + R() * .15); br.push(kilatPts(p[0], p[1], p[0] + Math.cos(a) * l, p[1] + Math.sin(a) * l, seed + b + 7, 5)); }
  const stroke = (pts, lw, col, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); };
  ctx.save(); ctx.globalAlpha *= k;
  [main, ...br].forEach((p, i) => { const s = i ? .5 : 1; stroke(p, w * 4.5 * s, `rgba(${GTP.glow},.25)`); stroke(p, w * 2.2 * s, `rgba(${GTP.glow},.6)`); });
  [main, ...br].forEach((p, i) => { const s = i ? .5 : 1; stroke(p, w * 1.25 * s, INK); stroke(p, w * s, GTP.bolt); });
  ctx.restore();
}
// Kilat layar: putih menyala seluruh layar (ruang layar)
function kilatLayar(ctx, k) { if (k <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(255,252,235,${.85 * clamp(k)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
// intensitas kilat: kedip cepat dua kali sesudah t0
const kedip = (t, t0) => { const d = t - t0; if (d < 0 || d > .45) return 0; return Math.max(0, 1 - d / .12) + (d > .16 && d < .26 ? .7 : 0) + (d > .3 ? .25 * (1 - (d - .3) / .15) : 0); };

// Awan badai berwajah. (x,y) = pusat, s skala. o: { face, t, dark 0..1, squash (benturan) }
function drawAwanB(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0, sq = o.squash || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - sq * .15), s * (1 + sq * .12));
  const bumps = [[-150, 20, 95], [-70, -40, 115], [40, -60, 125], [140, -10, 100], [190, 40, 70], [-210, 50, 60], [0, 40, 120], [100, 50, 100], [-110, 60, 90]];
  ctx.beginPath(); bumps.forEach(([bx, by, br]) => { ctx.moveTo(bx + br, by); ctx.arc(bx, by, br, 0, TAU); }); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = lerpC(GTP.cloudHi, GTP.cloudDk, clamp(o.dark || 0)); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(0, 90, 230, 50, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.18)'; bumps.slice(1, 3).forEach(([bx, by, br]) => { ctx.beginPath(); ctx.arc(bx - br * .3, by - br * .35, br * .35, 0, TAU); ctx.fill(); });
  ctx.restore();
  if (o.face) propFace(ctx, x, y + 10 * s, 170 * s, o.face, { t });
}
// Langit malam luar rumah: langit, hujan, bukit, tanah. o: { rain 0..1, flash 0..1, house: [x, y, s] }
function langitBG(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, 1);
  const g = ctx.createLinearGradient(0, -600, 0, 1500); g.addColorStop(0, GTP.sky); g.addColorStop(1, GTP.skyHi); ctx.fillStyle = g; ctx.fillRect(-3000, -3000, 8000, 6000);
  if (o.flash > 0) { ctx.fillStyle = `rgba(230,235,255,${.6 * o.flash})`; ctx.fillRect(-3000, -3000, 8000, 6000); }
  ctx.fillStyle = GTP.hill; ctx.beginPath(); ctx.moveTo(-3000, 1400); for (let x = -3000; x <= 5000; x += 200) ctx.lineTo(x, 1320 - 60 * Math.sin(x * .004) - 30 * Math.sin(x * .011)); ctx.lineTo(5000, 4000); ctx.lineTo(-3000, 4000); ctx.closePath(); ctx.fill();
  ctx.fillStyle = GTP.hillHi; ctx.fillRect(-3000, 1440, 8000, 3000); line(ctx, -3000, 1440, 5000, 1440, 6);
  if (o.house) drawRumahMini(ctx, o.house[0], o.house[1], o.house[2] || 1, { t });
  const rain = o.rain == null ? 1 : o.rain;
  if (rain > 0) { ctx.save(); ctx.globalAlpha = .5 * rain; ctx.strokeStyle = '#bfe3ff'; ctx.lineWidth = 4; const R = rng(5);
    for (let i = 0; i < 160; i++) { const rx = R() * 4000 - 1500, sp = 1200 + R() * 400, ry = ((R() * 2400 + t * sp) % 2400) - 600; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 14, ry + 60); ctx.stroke(); }
    ctx.restore(); }
}
function drawRumahMini(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -160, -220, 320, 220, 6); fillStroke(ctx, GTP.house, 8);
  path(ctx, [[-200, -210], [0, -360], [200, -210]]); fillStroke(ctx, GTP.roof, 8);
  rrect(ctx, -110, -170, 90, 80, 6); fillStroke(ctx, '#ffe9a0', 6); line(ctx, -65, -170, -65, -90, 5); line(ctx, -110, -130, -20, -130, 5);
  rrect(ctx, 40, -140, 80, 140, 6); fillStroke(ctx, '#8a5a34', 6);
  ctx.restore();
}
// Gelombang suara (busur konsentris). (x,y) sumber, r jari-jari terluar, k alpha, dir arah (rad), spread
function drawGelombang(ctx, x, y, r, k = 1, o = {}) {
  if (k <= 0 || r <= 0) return; const n = o.n || 3, dir = o.dir == null ? 0 : o.dir, sp = o.spread == null ? Math.PI : o.spread;
  ctx.save(); ctx.globalAlpha *= clamp(k); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) { const rr = r - i * (o.gap || 50); if (rr <= 0) continue; ctx.beginPath(); ctx.arc(x, y, rr, dir - sp / 2, dir + sp / 2); ctx.lineWidth = 26; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 14; ctx.strokeStyle = o.col || GTP.wave; ctx.stroke(); }
  ctx.restore();
}
// Tokoh CAHAYA (komet kuning berwajah, cepat). (x,y) = kepala. o: { face, t, trail (panjang ekor px), dir }
function drawCahaya(ctx, x, y, s = 1, o = {}) {
  const tr = o.trail || 0, d = o.dir || 0; ctx.save(); ctx.translate(x, y); ctx.rotate(d);
  if (tr > 0) { const g = ctx.createLinearGradient(-tr, 0, 0, 0); g.addColorStop(0, 'rgba(255,228,90,0)'); g.addColorStop(1, 'rgba(255,228,90,.9)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-tr, 0); ctx.lineTo(0, -60 * s); ctx.lineTo(0, 60 * s); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 3; i++) line(ctx, -tr * (.3 + i * .2), (i - 1) * 40 * s, -tr * (.05 + i * .1), (i - 1) * 40 * s, 8, 'rgba(255,255,255,.7)'); }
  const g2 = ctx.createRadialGradient(0, 0, 10, 0, 0, 140 * s); g2.addColorStop(0, 'rgba(255,240,150,.8)'); g2.addColorStop(1, 'rgba(255,240,150,0)'); ctx.fillStyle = g2; ctx.fillRect(-140 * s, -140 * s, 280 * s, 280 * s);
  circle(ctx, 0, 0, 70 * s); fillStroke(ctx, GTP.light, 8 * s);
  ctx.restore();
  if (o.face) propFace(ctx, x, y, 110 * s, o.face, { t: o.t || 0 });
}
// Tokoh SUARA "DUAR" (gelembung biru berkaki pendek, lelet). (x,y) = tengah dasar kaki. o: { face, t, walk (fase), sweat }
function drawSuara(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0, wk = o.walk || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sd of [-1, 1]) { const ph = Math.sin(wk * 6 + (sd > 0 ? Math.PI : 0)); line(ctx, sd * 40, -60, sd * 40 + ph * 18, -6, 14); ellipse(ctx, sd * 40 + ph * 18 + 10, -4, 24, 12); ctx.fillStyle = INK; ctx.fill(); }
  const b = () => { ctx.beginPath(); ctx.ellipse(0, -170, 150, 120, 0, 0, TAU); };
  b(); ctx.fillStyle = GTP.wave; ctx.fill(); shadeShape(ctx, b, 1, .16, .3, [-150, -290, 300, 240]); b(); fillStroke(ctx, null, 9);
  drawGelombang(ctx, 150, -170, 70, .9, { n: 2, gap: 34, spread: 1.4 }); drawGelombang(ctx, -150, -170, 70, .9, { n: 2, gap: 34, dir: Math.PI, spread: 1.4 });
  text(ctx, 'DUAR', 0, -230, 58, '#fff', INK, 12);
  ctx.restore();
  if (o.face) propFace(ctx, x, y - 140 * s, 150 * s, o.face, { t });
}
// Molekul udara berwajah. o: { hot 0..1, face, t }
function drawMolekul(ctx, x, y, r, o = {}) {
  const h = clamp(o.hot || 0), wb = 1 + h * .06 * Math.sin((o.t || 0) * 40 + x); ctx.save(); ctx.translate(x, y); ctx.scale(wb, 1 / wb);
  circle(ctx, 0, 0, r); const g = ctx.createRadialGradient(-r * .35, -r * .35, r * .1, 0, 0, r); g.addColorStop(0, lerpC('#ffffff', '#ffd27a', h)); g.addColorStop(1, lerpC(GTP.air, GTP.hot, h)); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = Math.max(4, r * .08); ctx.strokeStyle = INK; ctx.stroke();
  ellipse(ctx, -r * .4, -r * .45, r * .2, r * .12, -.5); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill();
  ctx.restore();
  if (o.face) propFace(ctx, x, y + r * .05, r * 1.3, o.face, { t: o.t || 0 });
}
// Latar dunia mikro di sekitar kilat (gelap kebiruan)
function mikroUdaraBG(ctx, t, heat = 0) {
  const g = ctx.createRadialGradient(540, 900, 50, 540, 900, 1300); g.addColorStop(0, lerpC('#2a3466', '#5a2a3a', heat)); g.addColorStop(1, '#0e1228'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const R = rng(17); ctx.fillStyle = 'rgba(190,230,255,.08)'; for (let i = 0; i < 50; i++) { circle(ctx, R() * W, (R() * H + t * 30) % H, 4 + R() * 10); ctx.fill(); }
}
// Termometer besar. (x,y) = pusat bola bawah. v 0..1
function drawTermoKilat(ctx, x, y, s, v) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -40, -560, 80, 560, 40); fillStroke(ctx, '#fffaf0', 8); circle(ctx, 0, 30, 70); fillStroke(ctx, GTP.thermo, 8);
  const h = 520 * clamp(v); rrect(ctx, -22, -h - 10, 44, h + 40, 22); ctx.fillStyle = GTP.thermo; ctx.fill();
  for (let i = 1; i < 10; i++) line(ctx, 20, -i * 54, 40, -i * 54, 5);
  ctx.restore();
}
// Meja makan (tampak samping). (x,y) = tengah lantai. o: { shake }
function drawMejaMakan(ctx, x, y, s = 1, o = {}) {
  const sh = o.shake || 0; ctx.save(); ctx.translate(x + sh, y); ctx.scale(s, s);
  for (const lx of [-230, 230]) { rrect(ctx, lx - 18, -330, 36, 330, 8); fillStroke(ctx, GTP.tableDk, 7); }
  rrect(ctx, -290, -370, 580, 50, 14); fillStroke(ctx, GTP.table, 8); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(-280, -362, 560, 10);
  rrect(ctx, -300, -398, 600, 34, 12); fillStroke(ctx, '#e9f1ff', 6);
  ctx.restore();
}
// Penanda jarak "1 KM" di tanah. k 0..1 (muncul)
function drawPenggaris(ctx, x0, x1, y, k, label = '± 1 KM') {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k * 1.5); const xe = lerp(x0, x1, easeOut(clamp(k)));
  line(ctx, x0, y, xe, y, 16); line(ctx, x0, y, xe, y, 8, '#ffd23a');
  for (let x = x0; x <= xe; x += 100) line(ctx, x, y - 20, x, y + 20, 8);
  if (k > .6) { rrect(ctx, (x0 + x1) / 2 - 150, y + 36, 300, 90, 16); fillStroke(ctx, '#ffd23a', 7); text(ctx, label, (x0 + x1) / 2, y + 82, 56, INK, INK, 0); }
  ctx.restore();
}
