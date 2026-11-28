// ---------- Aset episode "Semut balik lagi padahal sudah disapu" (25-11-2026) ----------
// Aturan v6: satu fungsi per benda, palet SMP terkunci, tata letak SV (samping) dan TD (meja dari atas) terkunci. Latar datar satu skala (v7).
// Dapur samping memakai dapurPisangBG + mejaPisang (env_pisang.js) supaya rumah keluarga Budi konsisten antar episode.
const SMP = {
  ant: '#3a2320', antHi: '#6a4136', antLeg: '#2a1816', eye: '#ffffff',
  glass: 'rgba(225,245,255,.5)', glassLn: 'rgba(34,28,34,.75)', sugar: '#ffffff', sugarSh: '#dfe8f0', lid: '#e5392f', lidDk: '#a8231d', label: '#fff6d8',
  broomStick: '#c9a25a', broomDk: '#8a6a2e', broomTie: '#e5392f',
  lap: '#3fa7e0', lapDk: '#2a7ab0', lapStripe: '#ffd23a', foam: '#ffffff', foamSh: '#cfe9ff', wet: 'rgba(160,215,255,.55)', wetHi: 'rgba(255,255,255,.55)',
  wood: '#d79a5c', woodDk: '#b8783e', woodLn: 'rgba(110,60,20,.28)', woodHi: 'rgba(255,240,210,.25)', tile: '#f4fbfb', tileLn: 'rgba(80,150,160,.3)',
  hole: '#1e1414', crack: '#5a3a2a',
  trail: '#c45cff', trailHi: '#f4c8ff', trailGlow: '196,92,255', night: 'rgba(18,12,46,.62)',
  road: '#4a4d5a', roadEdge: '#2a2c36', roadLine: '#ffffff', sign: '#2f9b5a', signTx: '#ffffff',
};
// Tata letak dapur samping (terkunci). Meja PS.top = 1330. Lubang semut di dinding keramik kiri, toples gula di meja.
const SV = { top: 1330, hole: [90, 1212], jar: [860, 1330], rani: 270, budi: 640, ibu: 250, fan: [1030, 1330] };
const SV_PATH = [[90, 1226], [96, 1262], [108, 1300], [126, 1326], [230, 1327], [755, 1327]];
// Tata letak meja dari atas (terkunci). Dinding di atas y < TD.wall, lubang di kaki dinding, jalur berkelok ke toples.
const TD = { wall: 250, hole: [220, 262], jar: [860, 975], jarR: 118, band: [[60, 600], [560, 720]] };
const TD_PATH = [[220, 280], [240, 380], [205, 480], [210, 580], [270, 680], [380, 760], [500, 800], [580, 860], [650, 935], [745, 970]];

// ===== jalur: titik berdasarkan jarak tempuh =====
function pathPrep(P) { const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); return { P, L, len: L[L.length - 1] }; }
const SVP = pathPrep(SV_PATH), TDP = pathPrep(TD_PATH);
// posisi + arah pada jarak d (dipotong ke 0..len)
function pathAt(pp, d) {
  d = clamp(d, 0, pp.len); let i = 1; while (i < pp.L.length - 1 && pp.L[i] < d) i++;
  const a = pp.P[i - 1], b = pp.P[i], k = (d - pp.L[i - 1]) / Math.max(1e-6, pp.L[i] - pp.L[i - 1]);
  return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.atan2(b[1] - a[1], b[0] - a[0])];
}
// garis jalur (halus) dari d0 ke d1
function pathStroke(ctx, pp, d0 = 0, d1 = 1e9) {
  d1 = Math.min(d1, pp.len); if (d1 <= d0) return false; ctx.beginPath(); const n = Math.max(2, Math.ceil((d1 - d0) / 8));
  for (let i = 0; i <= n; i++) { const [x, y] = pathAt(pp, lerp(d0, d1, i / n)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } return true;
}

// ===== semut =====
// SATU fungsi untuk semua semut. (x,y) = titik kaki tengah (samping) atau pusat badan (atas).
// o: { view 'side'|'top', rot (arah jalan, untuk 'top'), flip (samping: 1 = menghadap kanan), t, walk (0/1 kaki bergerak), ph (fase), face (EXPR), sniff 0..1 (antena mengendus),
//      flat 0..1 (gepeng/pingsan), spin (putar di tempat, rad), fly 0..1 (kaki menggapai saat terlempar), alpha, carry (butir gula), glow }
function drawSemut(ctx, x, y, s = 1, o = {}) {
  const P = SMP, t = o.t || 0, w = o.walk == null ? 1 : o.walk, ph = (o.ph || 0) + t * 14 * w, fl = clamp(o.flat || 0), sn = o.sniff || 0;
  ctx.save(); ctx.translate(x, y); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  if (o.view === 'top') {
    ctx.rotate((o.rot || 0) + (o.spin || 0)); ctx.scale(s, s);
    if (o.glow) { ctx.save(); ctx.globalAlpha *= o.glow; ellipse(ctx, 0, 0, 80, 46); ctx.fillStyle = `rgba(${P.trailGlow},.35)`; ctx.fill(); ctx.restore(); }
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) {   // kaki: tripod bergantian
      const sw = Math.sin(ph + i * 2.1 + (sd > 0 ? Math.PI : 0)) * .35 * w + (o.fly || 0) * Math.sin(t * 30 + i) * .4;
      const ax = -6 + i * 8, a = sd * (1.25 + (i - 1) * .55) + sw * sd;
      const kx = ax + Math.cos(a) * 18, ky = Math.sin(a) * 18 * sd * sd; const ex = kx + Math.cos(a + sd * .5 * (i - 1)) * 16, ey = ky + Math.sin(a) * 16;
      ctx.beginPath(); ctx.moveTo(ax, 0); ctx.lineTo(kx, sd * Math.abs(ky)); ctx.lineTo(ex - (i - 1) * 6, sd * Math.abs(ey) + sd * 4); ctx.lineWidth = 4.5; ctx.strokeStyle = P.antLeg; ctx.stroke();
    }
    for (const sd of [-1, 1]) { const a = Math.sin(t * 9 + sd) * (.15 + .35 * sn); ctx.beginPath(); ctx.moveTo(30, sd * 5); ctx.lineTo(44, sd * (12 + a * 10)); ctx.lineTo(60, sd * (8 + a * 22)); ctx.lineWidth = 4; ctx.strokeStyle = P.antLeg; ctx.stroke(); circle(ctx, 60, sd * (8 + a * 22), 3.5); ctx.fillStyle = P.antLeg; ctx.fill(); }
    ellipse(ctx, -30, 0, 22, 16); fillStroke(ctx, P.ant, 4); ellipse(ctx, -34, -5, 9, 5); ctx.fillStyle = P.antHi; ctx.fill();
    ellipse(ctx, -8, 0, 5, 4); fillStroke(ctx, P.ant, 3);
    ellipse(ctx, 6, 0, 12, 8); fillStroke(ctx, P.ant, 4);
    circle(ctx, 26, 0, 12); fillStroke(ctx, P.ant, 4);
    if (o.carry) { rrect(ctx, 36, -9, 18, 18, 3); fillStroke(ctx, P.sugar, 3); }
    if (o.face) { ctx.save(); ctx.translate(28, 0); ctx.rotate(Math.PI / 2); propFace(ctx, 0, 0, 22, o.face, { t }); ctx.restore(); }
    ctx.restore(); return;
  }
  // tampak samping (menghadap kanan; flip -1 = kiri)
  ctx.scale(s * (o.flip || 1), s); if (o.rot) ctx.rotate(o.rot);
  ctx.scale(1 + fl * .35, 1 - fl * .6);
  const by = -22 - (o.fly ? 0 : Math.abs(Math.sin(ph)) * 1.5 * w);
  if (o.glow) { ctx.save(); ctx.globalAlpha *= o.glow; ellipse(ctx, 0, by, 80, 46); ctx.fillStyle = `rgba(${P.trailGlow},.35)`; ctx.fill(); ctx.restore(); }
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) for (const far of [1, 0]) {   // 3 pasang kaki, sisi jauh lebih gelap
    const sw = Math.sin(ph + i * 2.1 + far * Math.PI) * .45 * w, fly = (o.fly || 0) * Math.sin(t * 28 + i * 2 + far);
    const hx = -4 + i * 7, hy = by + 4, kx = hx + (i - 1) * 14 + sw * 12 + fly * 8, ky = by - 6 - fly * 6, fx = hx + (i - 1) * 20 + sw * 18 + fly * 14, fy = o.fly ? by + 18 + fly * 10 : 0;
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.lineWidth = 4; ctx.strokeStyle = far ? '#1a0e0c' : P.antLeg; ctx.stroke();
  }
  // antena siku
  for (const far of [1, 0]) { const a = Math.sin(t * 8 + far * 1.7) * (.08 + .3 * sn); ctx.save(); ctx.translate(30, by - 10); ctx.rotate(-.9 + a + far * .15); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(16, 0); ctx.rotate(.95 + a * 1.4); ctx.lineTo(16 + 20, 0); ctx.lineWidth = 3.6; ctx.strokeStyle = far ? '#1a0e0c' : P.antLeg; ctx.stroke(); circle(ctx, 36, 0, 3.2); ctx.fillStyle = P.antLeg; ctx.fill(); ctx.restore(); }
  ellipse(ctx, -28, by - 2, 20, 15, -.25); fillStroke(ctx, P.ant, 4); ellipse(ctx, -31, by - 8, 8, 4.5, -.25); ctx.fillStyle = P.antHi; ctx.fill();
  ellipse(ctx, -8, by + 1, 5, 4); fillStroke(ctx, P.ant, 3);
  ellipse(ctx, 6, by, 12, 8, .15); fillStroke(ctx, P.ant, 4);
  circle(ctx, 27, by - 6, 12); fillStroke(ctx, P.ant, 4);
  if (o.carry) { rrect(ctx, 36, by - 4, 16, 16, 3); fillStroke(ctx, P.sugar, 3); }
  if (o.face) propFace(ctx, 30, by - 6, 21, o.face, { t });
  else { circle(ctx, 31, by - 9, 3.4); ctx.fillStyle = '#fff'; ctx.fill(); }
  ctx.restore();
}
// barisan semut di jalur. o: { view, s, v (px/dtk), gap, d0, t, maxD (ujung terjauh yang sudah dicapai), stop: {at, pile}, hide(d, i) -> true, n, start (dtk mulai keluar lubang), alpha(i,d) }
// Kembalikan daftar posisi supaya shot bisa menambah wajah/efek.
function antLine(ctx, pp, t, o = {}) {
  const s = o.s || 1, v = o.v || 110, gap = o.gap || 60, n = o.n || 40, out = [];
  const t0 = o.start == null ? -100 : o.start;
  for (let i = 0; i < n; i++) {
    let d = (t - t0) * v - i * gap + (o.d0 || 0);
    if (o.loop) d = ((d % o.loop) + o.loop) % o.loop;
    if (d < 0 || d > pp.len + 20) continue;
    if (o.stop) { const q = o.stop.at - (o.stop.pile || 40) * (o.stop.rank ? o.stop.rank(i) : i - (o.stop.first || 0)); if (d > q) d = q; if (d < 0) continue; }
    if (o.hide && o.hide(d, i)) continue;
    const [x, y, a] = pathAt(pp, d), wob = Math.sin(t * 5 + i * 1.3) * (o.wob == null ? 3 : o.wob);
    const nx = -Math.sin(a), ny = Math.cos(a);
    const X = x + nx * wob, Y = y + ny * wob;
    out.push({ i, d, x: X, y: Y, a });
    if (o.skipDraw && o.skipDraw(i, d)) continue;
    const al = o.alpha ? o.alpha(i, d) : 1; if (al <= 0) continue;
    if (o.view === 'top') drawSemut(ctx, X, Y, s, { view: 'top', rot: a, t, ph: i * 1.7, alpha: al, carry: o.carry && o.carry(i), glow: o.glow });
    else { const flip = Math.cos(a) >= 0 ? 1 : -1, rot = Math.abs(Math.cos(a)) > .5 ? 0 : (Math.sin(a) > 0 ? 1 : -1) * Math.PI / 2 * flip * .9; drawSemut(ctx, X, Y, s, { flip, rot, t, ph: i * 1.7, alpha: al, glow: o.glow }); }
  }
  return out;
}

// ===== jejak bau (dilihat dengan "hidung semut") =====
// o: { k 0..1 (panjang yang sudah tergambar), from: 'start'|'end' (arah menggambar), w (lebar), a (alpha), pulse, gap: [d0, d1] (bagian yang terhapus), road 0..1 (berubah jadi jalan tol), t }
function drawJejak(ctx, pp, o = {}) {
  const k = clamp(o.k == null ? 1 : o.k), a = o.a == null ? 1 : o.a, w = o.w || 26, t = o.t || 0; if (k <= 0 || a <= 0) return;
  const d0 = o.from === 'end' ? pp.len * (1 - k) : 0, d1 = o.from === 'end' ? pp.len : pp.len * k;
  const segs = o.gap ? [[d0, Math.min(d1, o.gap[0])], [Math.max(d0, o.gap[1]), d1]] : [[d0, d1]];
  const road = clamp(o.road || 0), P = SMP, pul = 1 + (o.pulse || 0) * .12 * Math.sin(t * 6);
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [s0, s1] of segs) {
    if (s1 - s0 < 2) continue;
    if (road < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - road;
      for (const [mul, col] of [[3.2, `rgba(${P.trailGlow},.16)`], [2.1, `rgba(${P.trailGlow},.28)`], [1, P.trail], [.38, P.trailHi]]) { if (pathStroke(ctx, pp, s0, s1)) { ctx.lineWidth = w * mul * pul; ctx.strokeStyle = col; ctx.stroke(); } }
      // gelembung bau kecil yang naik dari jejak
      for (let i = 0; i < 14; i++) { const dd = lerp(s0, s1, ((i * .618) % 1)), q = (t * .6 + i * .37) % 1; const [x, y] = pathAt(pp, dd); circle(ctx, x + Math.sin(i * 3 + t * 2) * w * .6, y - q * w * 2.2, w * .16 * (1 - q)); ctx.fillStyle = `rgba(${P.trailGlow},${.7 * (1 - q)})`; ctx.fill(); }
      ctx.restore();
    }
    if (road > 0) {
      ctx.save(); ctx.globalAlpha *= road; const rw = w * 3.4;
      if (pathStroke(ctx, pp, s0, s1)) { ctx.lineWidth = rw + 14; ctx.strokeStyle = P.roadEdge; ctx.stroke(); }
      if (pathStroke(ctx, pp, s0, s1)) { ctx.lineWidth = rw; ctx.strokeStyle = P.road; ctx.stroke(); }
      if (pathStroke(ctx, pp, s0, s1)) { ctx.lineWidth = 5; ctx.strokeStyle = P.roadLine; ctx.setLineDash([26, 22]); ctx.lineDashOffset = -t * 60; ctx.stroke(); ctx.setLineDash([]); }
      ctx.restore();
    }
  }
  ctx.restore();
}
// ujung jalan yang putus: tanda silang + palang
function drawPalang(ctx, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -70, -14, 140, 28, 8); fillStroke(ctx, '#ffffff', 5); ctx.save(); rrect(ctx, -70, -14, 140, 28, 8); ctx.clip(); for (let i = -4; i < 5; i++) { ctx.beginPath(); ctx.moveTo(i * 30 - 10, -16); ctx.lineTo(i * 30 + 6, -16); ctx.lineTo(i * 30 + 26, 16); ctx.lineTo(i * 30 + 10, 16); ctx.closePath(); ctx.fillStyle = '#e5392f'; ctx.fill(); } ctx.restore();
  line(ctx, -50, 14, -50, 50, 8); line(ctx, 50, 14, 50, 50, 8); ctx.restore();
}
// papan tol
function drawPapanTol(ctx, x, y, s = 1, k = 1, txt = 'TOL GULA') {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); const b = backOut(clamp(k)); ctx.scale(s * b, s * b);
  line(ctx, -80, 0, -80, 160, 12, '#9aa0aa'); line(ctx, 80, 0, 80, 160, 12, '#9aa0aa');
  rrect(ctx, -150, -90, 300, 110, 16); fillStroke(ctx, SMP.sign, 7); rrect(ctx, -138, -78, 276, 86, 10); fillStroke(ctx, null, 4, '#ffffff');
  text(ctx, txt, 0, -32, 46, SMP.signTx, null, 0); ctx.restore();
}

// ===== toples gula =====
// (x,y) = tengah dasar. o: { lid 0..1 (0 = tutup tergeletak di samping, 1 = tertutup rapat), fill 0..1, face, t, top (tampak atas), glint }
function drawToplesGula(ctx, x, y, s = 1, o = {}) {
  const P = SMP, lid = clamp(o.lid || 0), f = o.fill == null ? .7 : o.fill;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.top) {   // tampak atas: lingkaran kaca, gula, tutup turun menutupi
    circle(ctx, 0, 8, 128); ctx.fillStyle = 'rgba(40,20,30,.18)'; ctx.fill();
    circle(ctx, 0, 0, 120); fillStroke(ctx, 'rgba(225,245,255,.7)', 7, P.glassLn); circle(ctx, 0, 0, 100); fillStroke(ctx, P.sugar, 4, P.sugarSh);
    const r = rng(7); for (let i = 0; i < 26; i++) { const a = r() * TAU, rr = r() * 85; rrect(ctx, Math.cos(a) * rr - 6, Math.sin(a) * rr - 6, 12, 12, 2); fillStroke(ctx, '#ffffff', 2, P.sugarSh); }
    if (lid > 0) { const sc = lerp(1.6, 1, easeOut(lid)); ctx.save(); ctx.globalAlpha *= clamp(lid * 2); circle(ctx, 0, 0, 132 * sc); fillStroke(ctx, P.lid, 8); circle(ctx, 0, 0, 96 * sc); fillStroke(ctx, P.lidDk, 4); text(ctx, 'GULA', 0, 4, 44 * sc, '#fff', INK, 0); ctx.restore(); }
    ctx.restore(); return;
  }
  ellipse(ctx, 0, 0, 120, 16); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  const body = () => { rrect(ctx, -95, -230, 190, 230, 26); };
  body(); ctx.fillStyle = P.glass; ctx.fill();
  ctx.save(); body(); ctx.clip(); const sy = -230 * f; ctx.fillStyle = P.sugar; ctx.fillRect(-95, sy, 190, -sy); ctx.fillStyle = P.sugarSh;
  const r = rng(3); for (let i = 0; i < 30; i++) { rrect(ctx, -90 + r() * 170, sy + 8 + r() * (-sy - 16), 12, 12, 2); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(-80, -220, 24, 210); ctx.restore();
  body(); fillStroke(ctx, null, 7, P.glassLn); line(ctx, -82, -236, 82, -236, 8, P.glassLn);
  rrect(ctx, -70, -150, 140, 64, 10); fillStroke(ctx, P.label, 5); text(ctx, 'GULA', 0, -116, 40, '#c4231f', null, 0);
  // tutup: tergeletak miring di kanan bawah saat terbuka, lalu melayang naik ke mulut toples
  const lx = lerp(150, 0, easeInOut(lid)), ly = lerp(-30, -250, easeInOut(lid)) - Math.sin(lid * Math.PI) * 120, lr = lerp(.35, 0, easeOut(lid));
  ctx.save(); ctx.translate(lx, ly); ctx.rotate(lr); rrect(ctx, -104, -34, 208, 46, 14); fillStroke(ctx, P.lid, 7); ctx.fillStyle = 'rgba(255,255,255,.3)'; rrect(ctx, -90, -28, 120, 10, 5); ctx.fill(); ctx.restore();
  if (o.face) propFace(ctx, 0, -60, 90, o.face, { t: o.t });
  ctx.restore();
}
// butir gula tumpah
function drawButirGula(ctx, x, y, s = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); rrect(ctx, -10, -10, 20, 20, 3); fillStroke(ctx, '#ffffff', 3); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillRect(-6, -7, 5, 5); ctx.restore(); }

// ===== sapu lidi kecil (meja) =====
// (x,y) = genggaman. rot: 0 = lidi mengarah ke bawah. o: { spread 0..1 (lidi mekar saat menyapu) }
function drawSapu(ctx, x, y, s = 1, rot = 0, o = {}) {
  const P = SMP; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const sp = 1 + (o.spread || 0) * .5;
  for (let i = -9; i <= 9; i++) { const a = i * .045 * sp; line(ctx, 0, 30, Math.sin(a) * 250, 30 + Math.cos(a) * 250, 4.5, i % 3 ? P.broomStick : P.broomDk); }
  ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.beginPath(); for (let i = -9; i <= 9; i += 3) { const a = i * .045 * sp; ctx.moveTo(0, 30); ctx.lineTo(Math.sin(a) * 250, 30 + Math.cos(a) * 250); } ctx.globalAlpha = .35; ctx.stroke(); ctx.globalAlpha = 1;
  rrect(ctx, -22, -40, 44, 110, 16); fillStroke(ctx, P.broomStick, 6); for (let k = 0; k < 3; k++) { rrect(ctx, -24, -26 + k * 30, 48, 10, 4); fillStroke(ctx, P.broomTie, 3); }
  ctx.restore();
}

// ===== lap sabun + busa =====
function drawBusa(ctx, x, y, r, t = 0, n = 7, seed = 2, a = 1) {
  if (a <= 0) return; const R = rng(seed); ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < n; i++) { const bx = x + (R() - .5) * r * 2.4, by = y + (R() - .5) * r * 1.2, br = r * (.25 + R() * .4) * (1 + .06 * Math.sin(t * 4 + i));
    circle(ctx, bx, by, br); fillStroke(ctx, 'rgba(255,255,255,.85)', Math.max(2, br * .12), 'rgba(120,170,220,.9)'); circle(ctx, bx - br * .35, by - br * .35, br * .22); ctx.fillStyle = '#fff'; ctx.fill(); }
  ctx.restore();
}
// (x,y) = tengah lap. o: { rot, t, foam 0..1, wet (tetes) }
function drawLap(ctx, x, y, s = 1, o = {}) {
  const P = SMP; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  const b = () => { ctx.beginPath(); ctx.moveTo(-90, -40); ctx.quadraticCurveTo(-20, -56, 90, -42); ctx.quadraticCurveTo(104, 0, 88, 40); ctx.quadraticCurveTo(0, 54, -92, 38); ctx.quadraticCurveTo(-104, 0, -90, -40); ctx.closePath(); };
  b(); ctx.fillStyle = P.lap; ctx.fill(); ctx.save(); b(); ctx.clip(); ctx.fillStyle = P.lapStripe; ctx.fillRect(-120, -14, 240, 12); ctx.fillRect(-120, 14, 240, 6); ctx.fillStyle = 'rgba(20,40,80,.18)'; ctx.fillRect(-120, 20, 240, 40); ctx.restore();
  b(); fillStroke(ctx, null, 6);
  drawBusa(ctx, 0, 44, 34, o.t || 0, 9, 4, o.foam == null ? 1 : o.foam);
  ctx.restore();
}

// ===== lubang semut di dinding (samping) =====
function drawLubang(ctx, x, y, s = 1) {
  const P = SMP; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(ctx, -10, -20, -34, -58, 4, P.crack); line(ctx, -26, -44, -50, -46, 3, P.crack); line(ctx, 14, -18, 30, -60, 4, P.crack); line(ctx, 30, -60, 52, -70, 3, P.crack);
  ellipse(ctx, 0, 0, 26, 22); fillStroke(ctx, P.hole, 5); ellipse(ctx, -6, 6, 12, 9); ctx.fillStyle = '#000'; ctx.fill();
  ctx.restore();
}

// ===== meja dari atas (latar datar). o: { night 0..1 (mode "hidung semut"), wet 0..1 (bekas lap), wetT (waktu kilau), lid 0..1, grains (gula tumpah), jar (false = sembunyikan) } =====
function mejaAtasBG(ctx, t, cam, o = {}) {
  const P = SMP; applyCam(ctx, cam, 1);
  ctx.fillStyle = P.wood; ctx.fillRect(-2000, TD.wall, 5000, 4000);
  for (let i = -20; i < 40; i++) { const x = i * 120; ctx.fillStyle = i % 2 ? 'rgba(255,240,210,.08)' : 'rgba(110,60,20,.07)'; ctx.fillRect(x, TD.wall, 120, 4000); line(ctx, x, TD.wall, x, 4200, 4, P.woodLn); }
  const r = rng(11); ctx.strokeStyle = P.woodLn; ctx.lineWidth = 3; for (let i = 0; i < 46; i++) { const x = -1800 + r() * 4400, y = TD.wall + 40 + r() * 3000, L = 80 + r() * 220; ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 10, y + L * .3, x - 10, y + L * .7, x + 4, y + L); ctx.stroke(); }
  // dinding keramik + lis
  ctx.fillStyle = P.tile; ctx.fillRect(-2000, -2000, 5000, 2000 + TD.wall); ctx.strokeStyle = P.tileLn; ctx.lineWidth = 4;
  for (let y = TD.wall - 90; y > -2000; y -= 90) { ctx.beginPath(); ctx.moveTo(-2000, y); ctx.lineTo(3000, y); ctx.stroke(); }
  for (let x = -2000; x < 3000; x += 90) { ctx.beginPath(); ctx.moveTo(x, -2000); ctx.lineTo(x, TD.wall); ctx.stroke(); }
  ctx.fillStyle = 'rgba(60,30,10,.25)'; ctx.fillRect(-2000, TD.wall, 5000, 26); line(ctx, -2000, TD.wall, 3000, TD.wall, 7);
  // lubang di kaki dinding
  const [hx, hy] = TD.hole; ctx.save(); ctx.beginPath(); ctx.ellipse(hx, hy - 4, 46, 30, 0, Math.PI, TAU); ctx.closePath(); fillStroke(ctx, P.hole, 6); ctx.restore();
  line(ctx, hx - 30, hy - 30, hx - 60, hy - 80, 4, P.crack); line(ctx, hx + 26, hy - 26, hx + 50, hy - 90, 4, P.crack);
  // bekas lap basah
  const wk = clamp(o.wet || 0); if (wk > 0) drawBekasLap(ctx, wk, o.wetT == null ? t : o.wetT);
  // gula tumpah + toples
  const g = o.grains == null ? 1 : o.grains; if (g > 0) { const R = rng(5); for (let i = 0; i < 7; i++) drawButirGula(ctx, TD.jar[0] - 150 + R() * 70, TD.jar[1] - 30 + R() * 80, .9 * g, R() * 2); }
  if (o.jar !== false) drawToplesGula(ctx, TD.jar[0], TD.jar[1], 1, { top: true, lid: o.lid || 0 });
  if (o.night) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(18,12,46,${.62 * o.night})`; ctx.fillRect(0, 0, W, H); ctx.restore(); applyCam(ctx, cam, 1); }
}
// pita basah melintang jalur (k = berapa jauh lap sudah menyapu, 0..1 dari kiri ke kanan)
function drawBekasLap(ctx, k, t = 0) {
  const P = SMP, [[x0, y0], [x1, y1]] = TD.band, xe = lerp(x0, x1, clamp(k));
  ctx.save(); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0 + 160, y0 - 30, xe - 120, y0 + 50, xe, y0 + 10 + 60 * (xe - x0) / (x1 - x0));
  ctx.lineTo(xe, y1 - 50 + 60 * (xe - x0) / (x1 - x0)); ctx.bezierCurveTo(xe - 120, y1 + 10, x0 + 160, y1 - 60, x0, y1 - 20); ctx.closePath();
  ctx.fillStyle = P.wet; ctx.fill(); ctx.clip();
  for (let i = 0; i < 6; i++) { const yy = lerp(y0 + 10, y1 - 30, i / 5); ctx.beginPath(); ctx.moveTo(x0, yy); ctx.bezierCurveTo(x0 + 200, yy - 20, x1 - 200, yy + 30, x1, yy + 40); ctx.lineWidth = 5; ctx.strokeStyle = P.wetHi; ctx.stroke(); }
  ctx.restore();
  const R = rng(9); for (let i = 0; i < 10; i++) { const bx = lerp(x0 + 20, xe - 10, R()), by = lerp(y0 + 30, y1 - 30, R()); if (bx < xe) drawBusa(ctx, bx, by, 16 + R() * 10, t, 3, 20 + i, .9); }
}
// pembanding garis lama (putus-putus merah) di atas jalur
function drawGarisLama(ctx, pp, k, t = 0) {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k * 1.5); pathStroke(ctx, pp, 0, pp.len * clamp(k)); ctx.lineWidth = 9; ctx.strokeStyle = '#ff3b3b'; ctx.setLineDash([22, 18]); ctx.lineDashOffset = -t * 40; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
}
