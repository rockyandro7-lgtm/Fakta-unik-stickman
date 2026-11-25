// ---------- Fakta Unik: lomba iris bawang (bawang merah, talenan, batu asah, pisau tumpul/tajam, stik glow, dunia sel bawang) ----------
// Aturan v6: SATU fungsi per aset, palet terkunci BWP, tata letak terkunci BW. Dapur memakai dapurBack/dapurMeja (env_listrik.js).
const BWP = {
  skin: '#b8456e', skinDk: '#8a2f52', skinHi: '#e48aa8', paper: '#dcae84', paperDk: '#b9875c', flesh: '#f7e6ef', fleshRing: '#e2b3cb',
  board: '#d9a066', boardDk: '#a8733f', stone: '#8f96a8', stoneDk: '#6c7386', stoneB: '#e07b39', stoneBDk: '#b45a22', rubber: '#3a3d4a',
  dull: 'rgba(120,96,70,.55)', tear: '#8fd8ff', tearDk: '#3a9ad6', spray: '#efe3f7', sprayDk: '#b59ac7',
  cellBg: '#e9a9c8', cellWall: '#fbe3ef', cellWallDk: '#c9779f', enzim: '#5fa8ff', sulfur: '#ffd23a', gas: '#c9f27a', gasDk: '#86b83a',
  glowA: '#b6ff5c', glowB: '#ff5cc8', tomato: '#e5392f',
};
// Tata letak (terkunci). Meja = dapurMeja (top 1330). Tokoh di belakang meja (y 1500, s 600). Talenan Ibu kiri, Budi kanan.
const BW = { top: 1330, back: 1500, ibu: 140, budi: 960, boardI: 330, boardB: 760, boardY: 1330, eyeLine: 1035 };

// Bawang merah utuh berwajah. (x,y) = tengah dasar. o: { face, t, sprout 0..1 (tunas tumbuh), press 0..1 (diremas pisau tumpul), rot, alpha }
function drawBawang(ctx, x, y, s = 1, o = {}) {
  const pr = clamp(o.press || 0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * (1 + .32 * pr), s * (1 - .42 * pr));
  if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  ellipse(ctx, 0, 2, 70, 10); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  // akar
  for (let i = -3; i <= 3; i++) line(ctx, i * 8, -2, i * 11, 12 + (i % 2) * 4, 4, BWP.paperDk);
  const b = () => { ctx.beginPath(); ctx.moveTo(0, -150); ctx.bezierCurveTo(22, -112, 76, -98, 74, -48); ctx.bezierCurveTo(72, -6, 36, 0, 0, 0); ctx.bezierCurveTo(-36, 0, -72, -6, -74, -48); ctx.bezierCurveTo(-76, -98, -22, -112, 0, -150); ctx.closePath(); };
  b(); ctx.fillStyle = BWP.skin; ctx.fill();
  ctx.save(); b(); ctx.clip();
  ctx.strokeStyle = 'rgba(90,20,50,.35)'; ctx.lineWidth = 4;
  for (const k of [-.6, -.25, .25, .6]) { ctx.beginPath(); ctx.moveTo(0, -150); ctx.quadraticCurveTo(k * 120, -70, k * 40, 0); ctx.stroke(); }
  ctx.fillStyle = 'rgba(60,10,40,.18)'; ctx.fillRect(18, -160, 80, 170);
  ctx.fillStyle = 'rgba(255,255,255,.45)'; ellipse(ctx, -36, -70, 12, 30, .25); ctx.fill();
  ctx.restore();
  b(); fillStroke(ctx, null, 6);
  // ujung leher kertas
  ctx.beginPath(); ctx.moveTo(-8, -146); ctx.quadraticCurveTo(-4, -172, 8, -182); ctx.quadraticCurveTo(6, -164, 8, -146); ctx.closePath(); fillStroke(ctx, BWP.paper, 4);
  // tunas (gag "keburu tumbuh")
  const sp = clamp(o.sprout || 0);
  if (sp > 0) for (const [a, l] of [[-.35, 1], [.15, .8], [.45, .65]]) {
    const L = 170 * l * easeOut(sp);
    ctx.save(); ctx.translate(2, -176); ctx.rotate(a + Math.sin((o.t || 0) * 3 + a * 5) * .05);
    ctx.beginPath(); ctx.moveTo(-9, 0); ctx.quadraticCurveTo(-12, -L * .6, 0, -L); ctx.quadraticCurveTo(12, -L * .6, 9, 0); ctx.closePath(); fillStroke(ctx, '#5cc25a', 4);
    line(ctx, 0, -4, 0, -L * .85, 3, 'rgba(255,255,255,.5)'); ctx.restore();
  }
  ctx.restore();
  if (o.face) propFace(ctx, x, y - 60 * s * (1 - .42 * pr), 84 * s, o.face, { t: o.t || 0, alpha: o.alpha });
}
// Irisan bawang (cincin). (x,y) = pusat. r = jari-jari. o: { tilt (1 = menghadap kamera, .3 = rebah), rot }
function drawIrisan(ctx, x, y, r, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(1, o.tilt == null ? .45 : o.tilt);
  circle(ctx, 0, 0, r); fillStroke(ctx, BWP.skin, Math.max(2.5, r * .1));
  circle(ctx, 0, 0, r * .84); ctx.fillStyle = BWP.flesh; ctx.fill();
  ctx.strokeStyle = BWP.fleshRing; ctx.lineWidth = Math.max(1.5, r * .07); for (const k of [.66, .48, .3]) { circle(ctx, 0, 0, r * k); ctx.stroke(); }
  ctx.restore();
}
// Tumpukan irisan di talenan. n = jumlah irisan (tinggi tumpukan ikut). (x,y) = tengah dasar tumpukan.
function drawSlicePile(ctx, x, y, n, s = 1, seed = 3) {
  const r = rng(seed); const m = Math.min(60, Math.floor(n));
  for (let i = 0; i < m; i++) { const row = Math.floor(i / 6), col = i % 6; drawIrisan(ctx, x + (col - 2.5) * 22 * s + (r() - .5) * 10 * s + (row % 2) * 11 * s, y - 8 * s - row * 13 * s - (r() * 4) * s, 22 * s, { tilt: .42, rot: (r() - .5) * .5 }); }
}
// Talenan kayu (tampak samping, di atas meja). (x,y) = tengah dasar.
function drawTalenan(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 2, 190, 10); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  const b = () => rrect(ctx, -180, -30, 360, 30, 12); b(); ctx.fillStyle = BWP.board; ctx.fill(); shadeShape(ctx, b, 1, .16, .3, [-180, -30, 360, 30]); b(); fillStroke(ctx, null, 6);
  ctx.fillStyle = 'rgba(255,255,255,.3)'; rrect(ctx, -160, -26, 300, 6, 3); ctx.fill();
  ctx.strokeStyle = 'rgba(120,70,30,.35)'; ctx.lineWidth = 3; for (const k of [-.5, .1, .6]) { ctx.beginPath(); ctx.moveTo(-170 + k * 40, -12); ctx.quadraticCurveTo(k * 100, -18, 170 - k * 30, -10); ctx.stroke(); }
  ctx.restore();
}
// Batu asah (dua sisi warna) di alas karet. (x,y) = tengah dasar.
function drawBatuAsah(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 2, 130, 10); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  rrect(ctx, -125, -24, 250, 24, 8); fillStroke(ctx, BWP.rubber, 6);
  const lo = () => rrect(ctx, -110, -58, 220, 36, 6); lo(); ctx.fillStyle = BWP.stoneB; ctx.fill(); shadeShape(ctx, lo, 1, .18, .3, [-110, -58, 220, 36]); lo(); fillStroke(ctx, null, 6);
  const hi = () => rrect(ctx, -110, -82, 220, 26, 6); hi(); ctx.fillStyle = BWP.stone; ctx.fill(); shadeShape(ctx, hi, 1, .18, .3, [-110, -82, 220, 26]); hi(); fillStroke(ctx, null, 6);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; rrect(ctx, -100, -78, 150, 6, 3); ctx.fill();
  ctx.restore();
}
// Pisau dipegang. (x,y) = titik genggam (tengah gagang). flip -1 = menghadap kiri. o: { dull (tumpul: kusam, gompal), face, t, shine 0..1 }
function drawPisau(ctx, x, y, s = 1, rot = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(o.flip || 1, 1); ctx.rotate(rot);
  drawKnife(ctx, 85 * s, 0, s, 0);
  ctx.save(); ctx.translate(85 * s, 0); ctx.scale(s, s);
  const blade = () => { ctx.beginPath(); ctx.moveTo(-20, -24); ctx.lineTo(210, -24); ctx.quadraticCurveTo(230, 10, 190, 26); ctx.lineTo(-20, 26); ctx.closePath(); };
  if (o.dull) {
    ctx.save(); blade(); ctx.clip(); ctx.fillStyle = BWP.dull; ctx.fillRect(-30, -30, 270, 70);
    const r = rng(8); ctx.fillStyle = 'rgba(150,80,40,.55)'; for (let i = 0; i < 9; i++) { circle(ctx, r() * 200, -10 + r() * 30, 4 + r() * 6); ctx.fill(); } ctx.restore();
    // mata pisau gompal (takik di sisi bawah)
    for (const gx of [40, 95, 150]) { ctx.beginPath(); ctx.moveTo(gx - 9, 27); ctx.lineTo(gx, 15); ctx.lineTo(gx + 9, 27); ctx.closePath(); ctx.fillStyle = '#fff6e8'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); }
  }
  if (o.shine > 0) { ctx.save(); blade(); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(-20, 0, 210, 0); const p = (o.t || 0) * 1.4 % 1; g.addColorStop(clamp(p - .15), 'rgba(255,255,255,0)'); g.addColorStop(clamp(p), `rgba(255,255,255,${.8 * o.shine})`); g.addColorStop(clamp(p + .15), 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(-30, -30, 270, 70); ctx.restore(); }
  ctx.restore();
  ctx.restore();
  if (o.face) { const c = Math.cos(rot), sn = Math.sin(rot), fx = (o.flip || 1); const lx = (85 + 95) * s; propFace(ctx, x + fx * (c * lx), y + (sn * lx) * 1 - 2 * s, 46 * s, o.face, { t: o.t || 0 }); }
}
// Tetes air mata. (x,y) = pusat, r jari-jari.
function drawTear(ctx, x, y, r, a = 1) {
  if (a <= 0 || r <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.beginPath(); ctx.moveTo(x, y - r * 1.6); ctx.quadraticCurveTo(x + r, y - r * .3, x + r, y + r * .1); ctx.arc(x, y + r * .1, r, 0, Math.PI); ctx.quadraticCurveTo(x - r, y - r * .3, x, y - r * 1.6); ctx.closePath();
  fillStroke(ctx, BWP.tear, Math.max(2, r * .16)); circle(ctx, x - r * .35, y - r * .15, r * .25); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
}
// Air mata tokoh. (px,py) = kaki tokoh, s = skala tokoh. k 0..1: 0 kering, .3 berkaca-kaca, .6 menetes, 1 air mancur.
function drawTokohTears(ctx, px, py, s, k, t, seed = 1) {
  if (k <= 0) return; const hx = px, hy = py - .765 * s, ex = .072 * s, ey = hy - .005 * s;
  for (const side of [-1, 1]) {
    const x0 = hx + side * ex, y0 = ey + .03 * s;
    if (k < .45) { drawTear(ctx, x0 + side * .01 * s, y0 + .01 * s, .018 * s * (k / .45), 1); continue; }
    if (k < .85) { for (let i = 0; i < 3; i++) { const q = (t * 1.3 + i / 3 + seed * .17) % 1; drawTear(ctx, x0 + side * .02 * s, y0 + q * .25 * s, .016 * s, 1 - q * .6); } continue; }
    // air mancur: dua lengkung semburan
    for (let i = 0; i < 9; i++) { const q = (t * 2.2 + i / 9 + side * .1) % 1, vx = side * (.28 + .06 * Math.sin(i * 2.3)) * s, vy = -.22 * s; const x = x0 + vx * q, y = y0 + vy * q + .55 * s * q * q; drawTear(ctx, x, y, .02 * s * (1 - q * .4), 1 - q * .3); }
  }
}
// Piring kotor bertumpuk (bak cuci). (x,y) = tengah dasar. n = jumlah piring. o: { face, t }
function drawPiringTumpuk(ctx, x, y, s = 1, n = 8, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const r = rng(5);
  for (let i = 0; i < n; i++) { const yy = -i * 22, dx = (r() - .5) * 24; ellipse(ctx, dx, yy, 120, 20); fillStroke(ctx, '#f6f3ea', 5); ellipse(ctx, dx, yy - 3, 70, 10); ctx.fillStyle = 'rgba(200,190,170,.5)'; ctx.fill(); if (i % 2) { circle(ctx, dx + 40, yy - 4, 7); ctx.fillStyle = '#c9a25a'; ctx.fill(); circle(ctx, dx - 30, yy - 2, 5); ctx.fillStyle = '#d0603a'; ctx.fill(); } }
  ctx.restore();
  if (o.face) propFace(ctx, x, y - n * 22 * s - 30 * s, 110 * s, o.face, { t: o.t || 0 });
}
// Bak cuci piring + keran. (x,y) = tengah atas bibir bak. o: { t, water 0..1 }
function drawBakCuci(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(ctx, 150, -10, 150, -230, 26, INK); line(ctx, 150, -10, 150, -230, 16, '#cfd6e3');
  ctx.beginPath(); ctx.moveTo(150, -230); ctx.quadraticCurveTo(150, -280, 90, -280); ctx.lineTo(60, -280); ctx.lineWidth = 26; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 16; ctx.strokeStyle = '#cfd6e3'; ctx.stroke();
  if ((o.water || 0) > 0) { ctx.save(); ctx.globalAlpha = .85 * o.water; line(ctx, 58, -265, 58 + Math.sin((o.t || 0) * 30) * 2, -10, 14, BWP.tear); ctx.restore(); }
  rrect(ctx, -260, -14, 520, 34, 10); fillStroke(ctx, '#e8eef6', 7);
  ctx.restore();
}
// Tomat (target meleset). (x,y) = tengah dasar. o: { splat 0..1 }
function drawTomat(ctx, x, y, s = 1, o = {}) {
  const sp = clamp(o.splat || 0); ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + sp * .5), s * (1 - sp * .55));
  const b = () => ellipse(ctx, 0, -48, 58, 48); b(); ctx.fillStyle = BWP.tomato; ctx.fill(); shadeShape(ctx, b, 1, .18, .35, [-58, -96, 116, 96]); b(); fillStroke(ctx, null, 6);
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ellipse(ctx, -22, -70, 12, 7, -.4); ctx.fill();
  path(ctx, [[-22, -92], [0, -84], [22, -92], [8, -100], [0, -110], [-8, -100]]); fillStroke(ctx, '#3fa35b', 4);
  ctx.restore();
  if (sp > .2) { const r = rng(12); for (let i = 0; i < 9; i++) { const a = -Math.PI * (i / 8), d = (70 + r() * 70) * s * sp; circle(ctx, x + Math.cos(a) * d, y - 30 * s + Math.sin(a) * d * .7, (8 + r() * 8) * s); fillStroke(ctx, BWP.tomato, 3); } }
}
// Penghitung irisan (lencana bulat). k 0..1 muncul.
function drawCounter(ctx, x, y, n, k = 1, col = '#ffffff') {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); const sc = backOut(clamp(k)); ctx.scale(sc, sc);
  circle(ctx, 0, 0, 74); fillStroke(ctx, '#e5262a', 9); circle(ctx, 0, 0, 58); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.stroke();
  text(ctx, String(n), 0, 2, 64, col, INK, 0); text(ctx, 'IRIS', 0, 98, 34, '#fff', INK, 9); ctx.restore();
}
// Papan taruhan (kertas ditempel). (x,y) = pusat. k 0..1 muncul.
function drawPapanTaruhan(ctx, x, y, s, k, lines) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); const sc = backOut(clamp(k)) * s; ctx.scale(sc, sc); ctx.rotate(-.05);
  ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; rrect(ctx, -330, -150, 660, 300, 22); ctx.fillStyle = '#fff8e2'; ctx.fill(); ctx.shadowColor = 'transparent'; fillStroke(ctx, null, 8);
  rrect(ctx, -60, -172, 120, 40, 8); ctx.fillStyle = 'rgba(255,220,120,.85)'; ctx.fill();
  lines.forEach((L, i) => text(ctx, L[0], 0, -70 + i * 92, L[1] || 62, L[2] || INK, INK, 0));
  ctx.restore();
}
// Bilah progres lomba (koordinat layar). pI, pB 0..1.
function drawRaceBars(ctx, x, y, pI, pB, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  [['IBU', pI, '#ec5b86'], ['BUDI', pB, '#2f9b5a']].forEach(([nm, p, col], i) => {
    const yy = y + i * 92; text(ctx, nm, x - 210, yy, 44, '#fff', INK, 10, 'Poppins', 700, 'right');
    rrect(ctx, x - 180, yy - 30, 560, 60, 30); fillStroke(ctx, 'rgba(255,255,255,.9)', 7);
    if (p > 0) { rrect(ctx, x - 172, yy - 22, Math.max(44, 544 * clamp(p)), 44, 22); ctx.fillStyle = col; ctx.fill(); }
  });
  ctx.restore();
}
// Garis "TINGGI MATA" (dunia). y = tinggi garis; hit 0..1 (semprotan menyentuh = merah).
function drawEyeLine(ctx, x0, x1, y, hit = 0, a = 1, labelX) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.setLineDash([34, 22]); ctx.lineDashOffset = 0;
  const col = hit > 0 ? `rgb(${Math.round(lerp(255, 229, hit))},${Math.round(lerp(255, 38, hit))},${Math.round(lerp(255, 42, hit))})` : '#ffffff';
  line(ctx, x0, y, x1, y, 16, INK); line(ctx, x0, y, x1, y, 9, col); ctx.setLineDash([]);
  const lx = labelX == null ? x0 + 10 : labelX;
  rrect(ctx, lx, y - 82, 300, 60, 14); fillStroke(ctx, hit > .5 ? '#e5262a' : '#ffffff', 6); text(ctx, 'TINGGI MATA', lx + 150, y - 51, 36, hit > .5 ? '#fff' : INK, INK, 0);
  ctx.restore();
}
// Butiran semprotan cairan bawang. o: { n, spread, h (tinggi maks), t, t0, dur, seed, size }
function drawSpray(ctx, x, y, o = {}) {
  const n = o.n || 14, t = o.t || 0, t0 = o.t0 || 0, dur = o.dur || 1.2, r = rng(o.seed || 7);
  for (let i = 0; i < n; i++) {
    const d0 = r() * dur * .5, d = t - t0 - d0; const life = dur * (.6 + r() * .5); if (d < 0 || d > life) { r(); r(); continue; }
    const a = -Math.PI / 2 + (r() - .5) * (o.spread || 1.4), v = (o.h || 400) * (.7 + r() * .45) * 2.2;
    const g = (v * v) / (2 * (o.h || 400)) * .95, q = d;
    const px = x + Math.cos(a) * v * q * .55, py = y + Math.sin(a) * v * q + .5 * g * q * q;
    const rr = (o.size || 9) * (.6 + .6 * ((i * 7) % 5) / 5);
    circle(ctx, px, py, rr); fillStroke(ctx, '#ffffff', Math.max(3, rr * .32), '#8a5aa8');
    circle(ctx, px - rr * .3, py - rr * .3, rr * .3); ctx.fillStyle = BWP.spray; ctx.fill();
  }
}

// ===== STIK GLOW (analogi) =====
// (x,y) = pusat, rot. o: { snap 0..1 (ditekuk/patah di tengah), glow 0..1, t, face }
function drawGlowStick(ctx, x, y, s = 1, rot = 0, o = {}) {
  const sn = clamp(o.snap || 0), gl = clamp(o.glow || 0), t = o.t || 0; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (gl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, 0, 20, 0, 0, 420); g.addColorStop(0, `rgba(190,255,110,${.75 * gl * (.9 + .1 * Math.sin(t * 8))})`); g.addColorStop(1, 'rgba(190,255,110,0)'); ctx.fillStyle = g; ctx.fillRect(-440, -440, 880, 880); ctx.restore(); }
  for (const side of [-1, 1]) {
    ctx.save(); ctx.rotate(side * -sn * .32);
    const body = () => { ctx.beginPath(); if (side < 0) ctx.roundRect(-200, -32, 202, 64, [32, 0, 0, 32]); else ctx.roundRect(-2, -32, 202, 64, [0, 32, 32, 0]); };
    body(); ctx.fillStyle = gl > 0 ? mixC('#e9ffe0', BWP.glowA, gl) : 'rgba(225,245,255,.92)'; ctx.fill();
    ctx.save(); body(); ctx.clip();
    if (gl < 1) { ctx.globalAlpha = 1 - gl; ctx.fillStyle = BWP.glowB; ctx.fillRect(side < 0 ? -200 : 0, -32, 200, 64); ctx.globalAlpha = 1; }   // cairan luar (pink)
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(side < 0 ? -190 : 0, -24, 190, 10);
    ctx.restore(); body(); fillStroke(ctx, null, 7);
    ctx.restore();
  }
  // ampul kaca di dalam (cairan kuning), retak saat patah
  if (sn < .5) { rrect(ctx, -150, -14, 300, 28, 14); ctx.fillStyle = gl > 0 ? 'rgba(255,255,255,.4)' : 'rgba(255,224,90,.95)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(34,28,34,.55)'; ctx.stroke(); }
  if (sn > 0 && sn < 1) { ctx.save(); ctx.globalAlpha = 1 - sn; path(ctx, [[-10, -30], [6, -8], [-6, 8], [10, 30]], false); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
  ctx.restore();
  if (o.face) propFace(ctx, x, y + 74 * s, 90 * s, o.face, { t });
}

// ===== DUNIA SEL BAWANG =====
// Latar jaringan sel (dinding sel = garis tebal terang). o: { burst 0..1 (dinding tengah pecah), shake }
const CELLS = (() => { const out = [], r = rng(31); for (let j = -3; j < 12; j++) for (let i = -3; i < 8; i++) out.push([i * 260 + (j % 2) * 130 + (r() - .5) * 40, j * 230 + (r() - .5) * 40]); return out; })();
function cellBG(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, 1);
  ctx.fillStyle = BWP.cellBg; ctx.fillRect(-2600, -2600, 6400, 6400);
  for (const [cx, cy] of CELLS) {
    ctx.save(); ctx.translate(cx, cy); ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + Math.PI / 6; ctx.lineTo(Math.cos(a) * 140, Math.sin(a) * 126); } ctx.closePath();
    ctx.fillStyle = 'rgba(255,240,248,.18)'; ctx.fill(); ctx.lineWidth = 16; ctx.strokeStyle = BWP.cellWall; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(160,60,110,.35)'; ctx.stroke(); ctx.restore();
  }
}
// Dua ruang terpisah di dalam satu sel besar (pusat cx,cy). wall 1 = dinding utuh, 0 = hancur. crack 0..1.
function drawSelBesar(ctx, cx, cy, wall = 1, crack = 0, t = 0) {
  ctx.save(); ctx.translate(cx, cy);
  const outer = () => rrect(ctx, -440, -330, 880, 660, 90);
  outer(); ctx.fillStyle = 'rgba(255,244,250,.55)'; ctx.fill(); ctx.lineWidth = 26; ctx.strokeStyle = BWP.cellWall; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = BWP.cellWallDk; ctx.stroke();
  if (wall > 0) {
    // dinding pemisah: utuh -> retak -> pecahan beterbangan
    const k = 1 - wall;
    if (k < .05) { rrect(ctx, -18, -300, 36, 600, 18); fillStroke(ctx, BWP.cellWall, 6, BWP.cellWallDk); }
    else { const r = rng(4); for (let i = 0; i < 8; i++) { const y0 = -300 + i * 75, dx = (r() - .5) * 2, ang = (r() - .5) * 2; ctx.save(); ctx.globalAlpha = 1 - k; ctx.translate(dx * 260 * k, y0 + 37 + (r() - .3) * 300 * k); ctx.rotate(ang * 2.5 * k); rrect(ctx, -18, -37, 36, 74, 12); fillStroke(ctx, BWP.cellWall, 6, BWP.cellWallDk); ctx.restore(); } }
    if (crack > 0 && k < .05) { ctx.save(); ctx.globalAlpha = crack; path(ctx, [[0, -300], [-12, -180], [10, -90], [-8, 20], [12, 140], [-6, 300]], false); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); }
  }
  ctx.restore();
}
// Molekul/bahan berwajah (gumpalan bulat). col = warna. o: { face, t, wob }
function drawBahan(ctx, x, y, r, col, o = {}) {
  const t = o.t || 0; ctx.save(); ctx.translate(x, y); const w = 1 + (o.wob || 0) * .06 * Math.sin(t * 12 + x);
  ctx.scale(w, 1 / w); ctx.beginPath(); for (let i = 0; i <= 36; i++) { const a = i / 36 * TAU, rr = r * (1 + .05 * Math.sin(a * 5 + x)); i ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath();
  fillStroke(ctx, col, Math.max(4, r * .09)); ellipse(ctx, -r * .38, -r * .42, r * .2, r * .12, -.5); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fill(); ctx.restore();
  if (o.face) propFace(ctx, x, y + r * .05, r * 1.1, o.face, { t });
}
// Awan gas pemicu air mata (hijau kekuningan, wajah licik). (x,y) pusat.
function drawGasMata(ctx, x, y, r, t, o = {}) {
  if ((o.alpha == null ? 1 : o.alpha) <= 0) return;
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  for (let i = 0; i < 3; i++) { const q = (t * .9 + i / 3) % 1; ctx.save(); ctx.globalAlpha *= (1 - q) * .5; ctx.beginPath(); for (let j = 0; j <= 10; j++) { const yy = y + r * .6 + j * 16, xx = x - r * .4 + i * r * .4 + Math.sin(t * 6 + j * .9 + i) * 10; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 9; ctx.strokeStyle = BWP.gasDk; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  puff(ctx, x, y, r, t, BWP.gas, o.seed || 4, 1);
  ctx.restore();
  if (o.face) propFace(ctx, x, y + r * .05, r * .9, o.face, { t, alpha: o.alpha });
}
