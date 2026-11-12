// ---------- Fakta Unik: PETA kartun Blitzkrieg (Mei-Juni 1940) ----------
// Aturan v6: satu fungsi per aset, palet terkunci MPC, posisi tempat terkunci di TEMPAT (lon/lat -> proj()).
// Gaya channel: garis tinta tebal, warna datar, token tentara berwajah, panah spidol dengan ujung sarung tinju (nyambung ke analogi tinju).
// Perbatasan = Natural Earth modern (disederhanakan). Peta ilustrasi.
const MPC = {
  sea: '#5aaed6', seaDk: '#3f93bf', FR: '#e3eafb', BE: '#f4e2a2', NL: '#f1d79a', LU: '#efd890', DE: '#c7ccb4', UK: '#b9dca4',
  CH: '#e6e1d6', IT: '#e6e1d6', DK: '#e6e1d6', AT: '#dcd6c8', IE: '#d3e6c4', CZ: '#dcd6c8', ES: '#e6e1d6',
  red: '#e2343a', redDk: '#a8191f', blue: '#2f63c9', pocket: 'rgba(226,52,58,.18)', label: '#3b3440',
};
const MPK = Math.cos(50 * Math.PI / 180), MPS = 300;   // 1 derajat lintang = 300 px dunia
const proj = (lon, lat) => [(lon - 3.0) * MPK * MPS + 540, -(lat - 50.0) * MPS + 960];
const TEMPAT = {
  paris: proj(2.35, 48.86), dunkirk: proj(2.38, 51.03), sedan: proj(4.94, 49.70), abbeville: proj(1.83, 50.10), brussel: proj(4.35, 50.85),
  dover: proj(1.31, 51.13), aachen: proj(6.08, 50.78), ardennes: proj(5.55, 49.98), lille: proj(3.06, 50.63),
};
// Rute (lon/lat) -> panah. Kanan = umpan ke Belgia (utara), kiri = sabit lewat Ardennes ke laut (selatan lalu barat).
const RUTE = {
  kanan: [[7.4, 51.55], [6.5, 51.3], [5.8, 51.1], [5.3, 51.0]].map(p => proj(...p)),
  sekutu: [[3.0, 50.45], [3.5, 50.65], [4.05, 50.8]].map(p => proj(...p)),
  kiri: [[7.0, 49.95], [6.2, 49.95], [5.5, 49.85], [4.94, 49.70], [4.0, 49.78], [3.2, 49.92], [2.4, 50.02], [1.65, 50.15]].map(p => proj(...p)),
};
const MAGINOT = [[6.15, 49.47], [6.7, 49.17], [7.5, 49.08], [8.1, 48.97], [7.85, 48.55], [7.62, 48.0], [7.55, 47.62]].map(p => proj(...p));

function polyPath(ctx, ring) { ctx.beginPath(); ring.forEach(([lo, la], i) => { const [x, y] = proj(lo, la); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); }
// Peta dasar: laut + negara + Maginot + hutan Ardennes + label. o: { labels: {nama: alpha}, trees 0..1, maginot 0..1, dim (gelapkan luar kantong) }
function drawMapBase(ctx, t, cam, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = MPC.sea; ctx.fillRect(0, 0, W, H); ctx.restore();
  applyCam(ctx, cam, 1);
  // ombak kecil di laut (tetap di dunia)
  ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  const r = rng(5); for (let i = 0; i < 70; i++) { const x = -1300 + r() * 2600, y = -700 + r() * 1700, d = Math.sin(t * 1.5 + i) * 6; ctx.beginPath(); ctx.moveTo(x - 22 + d, y); ctx.quadraticCurveTo(x + d, y - 10, x + 22 + d, y); ctx.stroke(); }
  for (const [k, rings] of Object.entries(MAPGEO)) {
    rings.forEach(ring => { polyPath(ctx, ring); ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(40,60,90,.18)'; ctx.stroke(); });
  }
  for (const [k, rings] of Object.entries(MAPGEO)) rings.forEach(ring => { polyPath(ctx, ring); fillStroke(ctx, MPC[k] || '#e6e1d6', 7); });
  // Ardennes: cemara mini
  const tr = o.trees == null ? 1 : o.trees;
  if (tr > 0) { const r2 = rng(9); ctx.save(); ctx.globalAlpha *= tr; for (let i = 0; i < 26; i++) { const lo = 4.75 + r2() * 1.45, la = 49.55 + r2() * .8; const [x, y] = proj(lo, la); drawPine(ctx, x, y + 40, .2 + r2() * .05, { col: PRG.pine }); } ctx.restore(); }
  // Garis Maginot: tembok bergerigi abu-abu
  const mg = o.maginot == null ? 1 : o.maginot;
  if (mg > 0) { ctx.save(); ctx.globalAlpha *= mg; ctx.beginPath(); MAGINOT.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 30; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 18; ctx.strokeStyle = PRG.conc; ctx.stroke();
    for (let i = 0; i < MAGINOT.length - 1; i++) { const [a, b] = [MAGINOT[i], MAGINOT[i + 1]]; for (let q = .25; q < 1; q += .5) { const x = lerp(a[0], b[0], q), y = lerp(a[1], b[1], q); rrect(ctx, x - 16, y - 16, 32, 32, 5); fillStroke(ctx, PRG.concDk, 5); } } ctx.restore(); }
  // label negara + kota
  const L = o.labels || {};
  const lab = (s, x, y, size, a, col = '#fff') => { if (a > 0) { ctx.save(); ctx.globalAlpha *= a; text(ctx, s, x, y, size, col, INK, size * .2); ctx.restore(); } };
  lab('PRANCIS', ...proj(2.6, 48.25), 72, L.prancis == null ? 1 : L.prancis);
  lab('BELGIA', ...proj(5.05, 50.55), 56, L.belgia == null ? 1 : L.belgia);
  lab('JERMAN', ...proj(8.9, 50.6), 72, L.jerman == null ? 1 : L.jerman);
  lab('INGGRIS', ...proj(-.8, 51.75), 60, L.inggris == null ? 1 : L.inggris);
  lab('MAGINOT', MAGINOT[3][0] + 120, MAGINOT[3][1] + 90, 40, (L.maginot == null ? 1 : L.maginot) * mg, '#e9e5dc');
  const city = (s, p, a, dx = 0, dy = -50) => { if (a > 0) { ctx.save(); ctx.globalAlpha *= a; circle(ctx, p[0], p[1], 14); fillStroke(ctx, '#fff', 6); text(ctx, s, p[0] + dx, p[1] + dy, 46, '#fff', INK, 10); ctx.restore(); } };
  city('PARIS', TEMPAT.paris, L.paris || 0); city('SEDAN', TEMPAT.sedan, L.sedan || 0, 0, 56); city('DUNKIRK', TEMPAT.dunkirk, L.dunkirk || 0, -30, -56);
}
// Titik pada polyline (dengan panjang kumulatif). k = 0..1 dari panjang total -> {x, y, a (sudut)}
function polyAt(pts, k) {
  const seg = []; let tot = 0; for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(l); tot += l; }
  let d = clamp(k) * tot; for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const q = seg[i] ? d / seg[i] : 0, a = pts[i], b = pts[i + 1]; return { x: lerp(a[0], b[0], q), y: lerp(a[1], b[1], q), a: Math.atan2(b[1] - a[1], b[0] - a[0]), len: tot }; } d -= seg[i]; }
}
function smoothPts(pts, n = 12) {   // Catmull-Rom supaya panah melengkung halus
  const out = []; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    for (let j = 0; j < n; j++) { const u = j / n, u2 = u * u, u3 = u2 * u; out.push([0, 1].map(c => .5 * (2 * p1[c] + (-p0[c] + p2[c]) * u + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * u2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * u3))); } }
  out.push(pts[pts.length - 1]); return out;
}
// Panah spidol tebal yang tumbuh sepanjang rute. head: 'glove' (sarung tinju + label) | 'tri'. k = progres 0..1
function drawArrow(ctx, pts, k, o = {}) {
  if (k <= 0) return; const sp = smoothPts(pts), col = o.col || MPC.red, w = o.w || 58, tip = polyAt(sp, k);
  ctx.save(); ctx.beginPath(); let acc = 0; ctx.moveTo(sp[0][0], sp[0][1]);
  for (let i = 1; i < sp.length; i++) { const l = Math.hypot(sp[i][0] - sp[i - 1][0], sp[i][1] - sp[i - 1][1]); if (acc + l >= k * tip.len) { ctx.lineTo(tip.x, tip.y); break; } acc += l; ctx.lineTo(sp[i][0], sp[i][1]); }
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = w + 14; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke();
  ctx.lineWidth = w * .22; ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.setLineDash([40, 30]); ctx.lineDashOffset = -(o.t || 0) * 120; ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  if (o.head === 'glove') drawGlove(ctx, tip.x, tip.y, (o.gs || 1), tip.a, col, o.label, o.punch || 0);
  else { ctx.save(); ctx.translate(tip.x, tip.y); ctx.rotate(tip.a); path(ctx, [[w * 1.3, 0], [-w * .4, -w * 1.15], [-w * .4, w * 1.15]]); fillStroke(ctx, col, 7); ctx.restore(); }
  return tip;
}
// Sarung tinju (dipakai di adegan tinju DAN di ujung panah peta). ang = arah pukulan. punch = squash saat menghantam.
function drawGlove(ctx, x, y, s, ang, col = MPC.red, label, punch = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s * (1 - punch * .2), s * (1 + punch * .15));
  rrect(ctx, -92, -34, 46, 68, 12); fillStroke(ctx, '#f5f1e6', 7);                 // manset
  ctx.beginPath(); ctx.ellipse(0, 0, 66, 58, 0, 0, TAU); fillStroke(ctx, col, 8);   // kepalan
  ctx.beginPath(); ctx.ellipse(-6, -50, 34, 20, -.35, 0, TAU); fillStroke(ctx, col, 7); // jempol
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 66, 58, 0, 0, TAU); ctx.clip(); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(-70, 20, 140, 60); ctx.fillStyle = 'rgba(255,255,255,.35)'; ellipse(ctx, 18, -22, 26, 12, -.4); ctx.fill(); ctx.restore();
  ctx.restore();
  if (label) text(ctx, label, x, y - 100 * s, 64 * s, '#fff', INK, 13 * s);
}
// Helm Inggris (Brodie): piring datar lebar.
function hatBrodie(ctx, hx, hy, hr, lw, o) {
  const col = o.helmCol || '#7b8a5a';
  ellipse(ctx, hx, hy - hr * .55, hr * 1.45, hr * .22); fillStroke(ctx, col, lw);
  ctx.beginPath(); ctx.ellipse(hx, hy - hr * .6, hr * .9, hr * .62, 0, Math.PI, TAU); ctx.closePath(); fillStroke(ctx, col, lw);
  ellipse(ctx, hx - hr * .35, hy - hr * .95, hr * .25, hr * .08, -.3); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill();
}
// Token tentara di peta (kepala + bahu). side: 'fr' | 'uk' | 'de'. face = objek ekspresi.
function mapSoldier(ctx, x, y, s, side, face, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const col = side === 'de' ? PRG.de : side === 'uk' ? '#8a7a4c' : PRG.fr;
  ctx.beginPath(); ctx.roundRect(-.2, -.02, .4, .26, [.14, .14, .04, .04]); fillStroke(ctx, col, .03);
  circle(ctx, 0, -.17, .19); fillStroke(ctx, HEAD, .025);
  const hat = side === 'de' ? hatStahl : side === 'uk' ? hatBrodie : hatAdrian; hat(ctx, 0, -.17, .19, .025, {});
  drawFace(ctx, 0, -.17, .19, face || EXPR.netral, { t: o.t || 0 }, null);
  ctx.restore();
}
// Perahu kecil penyelamat (Dunkirk). o: { t, crew: n kepala }
function drawBoat(ctx, x, y, s, o = {}) {
  const t = o.t || 0; ctx.save(); ctx.translate(x, y + Math.sin(t * 4 + x) * 4); ctx.rotate(Math.sin(t * 3 + x) * .05); ctx.scale(s, s);
  for (let i = 0; i < (o.crew || 0); i++) mapSoldier(ctx, -40 + i * 40, -40, 70, i % 2 ? 'uk' : 'fr', EXPR.lega, { t });
  ctx.beginPath(); ctx.moveTo(-110, -20); ctx.lineTo(110, -20); ctx.lineTo(80, 30); ctx.lineTo(-90, 30); ctx.closePath(); fillStroke(ctx, '#ffffff', 7);
  ctx.fillStyle = MPC.red; ctx.fillRect(-100, -6, 196, 12); ctx.beginPath(); ctx.moveTo(-110, -20); ctx.lineTo(110, -20); ctx.lineTo(80, 30); ctx.lineTo(-90, 30); ctx.closePath(); fillStroke(ctx, null, 7);
  ctx.restore();
}
// Kantong pengepungan: elips putus-putus merah yang menyempit + area luar digelapkan. k = 0..1 menyempit.
function drawPocket(ctx, cx, cy, rx, ry, t, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  const pulse = 1 + .03 * Math.sin(t * 7.5);
  ctx.beginPath(); ctx.rect(-3000, -3000, 7000, 7000); ctx.ellipse(cx, cy, rx * pulse, ry * pulse, -.15, 0, TAU, true); ctx.fillStyle = 'rgba(20,10,20,.32)'; ctx.fill('evenodd');
  ctx.beginPath(); ctx.ellipse(cx, cy, rx * pulse, ry * pulse, -.15, 0, TAU); ctx.fillStyle = MPC.pocket; ctx.fill();
  ctx.setLineDash([46, 26]); ctx.lineDashOffset = -t * 90; ctx.lineWidth = 26; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 16; ctx.strokeStyle = MPC.red; ctx.stroke();
  ctx.restore();
}
// Ring tinju sederhana (adegan analogi). Latar datar, satu skala.
function ringScene(ctx, t, cam) {
  skyFill(ctx, '#2d2a45', '#4a3f6b'); applyCam(ctx, cam, 1);
  for (let i = 0; i < 9; i++) { const x = -300 + i * 220; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, 200, 0, x, 200, 260); g.addColorStop(0, 'rgba(255,240,200,.18)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.fillRect(x - 260, -60, 520, 520); ctx.restore(); }
  // penonton siluet
  const r = rng(3); ctx.fillStyle = '#1f1c33'; for (let x = -600; x < 1700; x += 70) { const h = 30 + r() * 20; circle(ctx, x, 1050 - h, 34); ctx.fill(); ctx.fillRect(x - 40, 1050 - h, 80, 200); }
  rrect(ctx, -800, 1180, 2700, 900, 0); fillStroke(ctx, '#e9e1cf', 8);   // lantai ring
  ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(-800, 1180, 2700, 40);
  for (const [y, c] of [[1000, MPC.red], [1080, '#ffffff'], [1160, MPC.blue]]) line(ctx, -800, y, 1900, y, 14, c);
  for (const x of [-60, 1140]) { rrect(ctx, x - 26, 940, 52, 300, 10); fillStroke(ctx, '#d9dbe0', 7); }
}
