// ---------- Aset episode "Nasi goreng calon mertua" (14-11-2026) ----------
// Aturan v6: satu fungsi per benda, palet NGP terkunci, tata letak NG terkunci.
const NGP = {
  hair: '#3a2418', hairHi: '#5a3a28', clip: '#ffd23a', grey: '#b9b4ad', peci: '#22202a',
  rice: '#fbf8ee', riceSh: '#e6dfcc', mush: '#efe6cf', mushSh: '#d8caa6', gloss: 'rgba(255,255,255,.75)',
  fried: '#e8b25a', friedSh: '#c98a34', burn: '#4a2e1c', egg: '#ffd84a', leek: '#5fbf4e', chili: '#e5392f',
  oilBottle: '#ffe27a', sutil: '#c9ccd6', handle: '#7a4a2a', box: '#cfeaff',
};
// Tata letak dapur (terkunci). Lantai/tokoh y = 1500, meja 1330.
const NG = { top: 1330, back: 1500, rani: 270, stove: [640, 1330], wok: [640, 1100], fridge: -420, ibuIn: -200, cooker: [1020, 1330], budi: 1000, wok1: [60, 1330], mertua: [1700, 1990], plateY: 1330 };

// ---- rambut / tutup kepala (dipakai sebagai o.hat = fungsi di drawStick) ----
function hairRani(ctx, hx, hy, hr, lw) {
  // kuncir kuda di belakang (kiri = arah belakang saat menghadap kanan)
  ctx.beginPath(); ctx.moveTo(hx - hr * .7, hy - hr * .55); ctx.quadraticCurveTo(hx - hr * 1.7, hy - hr * .7, hx - hr * 1.55, hy + hr * .35);
  ctx.quadraticCurveTo(hx - hr * 1.35, hy + hr * .8, hx - hr * 1.1, hy + hr * .55); ctx.quadraticCurveTo(hx - hr * 1.3, hy - hr * .1, hx - hr * .75, hy - hr * .2); ctx.closePath();
  fillStroke(ctx, NGP.hair, lw);
  // tudung rambut + poni
  ctx.beginPath(); ctx.arc(hx, hy, hr + .006, Math.PI + .25, -.12);
  ctx.quadraticCurveTo(hx + hr * .55, hy - hr * .35, hx + hr * .15, hy - hr * .5);
  ctx.quadraticCurveTo(hx - hr * .2, hy - hr * .32, hx - hr * .45, hy - hr * .55);
  ctx.quadraticCurveTo(hx - hr * .75, hy - hr * .3, hx - hr * .97, hy - hr * .2); ctx.closePath();
  fillStroke(ctx, NGP.hair, lw);
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ellipse(ctx, hx - hr * .2, hy - hr * .8, hr * .35, hr * .1, -.2); ctx.fill();
  // jepit rambut
  rrect(ctx, hx - hr * .95, hy - hr * .62, hr * .32, hr * .14, .01); fillStroke(ctx, NGP.clip, lw * .8);
}
function peci(ctx, hx, hy, hr, lw) {
  ctx.beginPath(); ctx.moveTo(hx - hr * .78, hy - hr * .5); ctx.lineTo(hx - hr * .7, hy - hr * 1.12); ctx.quadraticCurveTo(hx, hy - hr * 1.22, hx + hr * .7, hy - hr * 1.12); ctx.lineTo(hx + hr * .78, hy - hr * .5); ctx.quadraticCurveTo(hx, hy - hr * .62, hx - hr * .78, hy - hr * .5); ctx.closePath();
  fillStroke(ctx, NGP.peci, lw); ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(hx - hr * .55, hy - hr * 1.05, hr * .2, hr * .4);
}
function sanggul(ctx, hx, hy, hr, lw) {
  circle(ctx, hx - hr * .55, hy - hr * .95, hr * .38); fillStroke(ctx, NGP.grey, lw);
  ctx.beginPath(); ctx.arc(hx, hy, hr + .006, Math.PI + .2, -.2); ctx.quadraticCurveTo(hx, hy - hr * .5, hx - hr * .98, hy - hr * .2); ctx.closePath(); fillStroke(ctx, NGP.grey, lw);
}
const RANI = { cols: ['#f28c38', '#f28c38'], hat: hairRani, belt: false, blush: true };
const BAPAK_M = { cols: ['#2a5f8f', '#2a5f8f'], hat: peci, belt: false };
const IBU_M = { cols: ['#8e4bb5', '#8e4bb5'], hat: sanggul, belt: false, blush: true };

// ---- isi wajan (digambar di dalam callback drawWok, koordinat wajan; permukaan minyak sekitar y = 14) ----
// o: { mush 0..1 (gumpalan lembek), burn 0..1 (gosong di bawah), grains 0..1 (butir terpisah), toss 0..1 (butir loncat), t, face, block 0..1 (bongkah nasi kulkas utuh) }
const GRAINS = (() => { const r = rng(57), out = []; for (let i = 0; i < 170; i++) { const a = r() * TAU, d = Math.sqrt(r()); out.push({ x: Math.cos(a) * d * 210, y: 6 + Math.sin(a) * d * 34 - r() * 22, rot: r() * TAU, ph: r() * TAU, sp: 1 + r() * 2, kind: r() < .07 ? 1 : r() < .06 ? 2 : r() < .03 ? 3 : 0 }); } return out; })();
function drawGrain(ctx, x, y, rot, s = 1, col = NGP.rice, kind = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  if (kind === 1) { ctx.beginPath(); ctx.ellipse(0, 0, 13 * s, 8 * s, 0, 0, TAU); fillStroke(ctx, NGP.egg, 2.5); }
  else if (kind === 2) { rrect(ctx, -9 * s, -4 * s, 18 * s, 8 * s, 4 * s); fillStroke(ctx, NGP.leek, 2.5); }
  else if (kind === 3) { rrect(ctx, -6 * s, -4 * s, 12 * s, 8 * s, 4 * s); fillStroke(ctx, NGP.chili, 2.5); }
  else { ctx.beginPath(); ctx.ellipse(0, 0, 11 * s, 5 * s, 0, 0, TAU); fillStroke(ctx, col, 2.5); }
  ctx.restore();
}
function mushPath(ctx, k, t, wob = 1) {
  const n = 16, w = 200 + 20 * k, h = 30 + 60 * k; ctx.beginPath();
  for (let i = 0; i <= n; i++) { const u = i / n, x = lerp(-w, w, u), bump = Math.sin(u * Math.PI) * h * (1 + .18 * Math.sin(u * 13 + t * 2 * wob)); i ? ctx.lineTo(x, 18 - bump) : ctx.moveTo(x, 18); }
  ctx.quadraticCurveTo(0, 40, -w, 18); ctx.closePath();
}
function drawNasiWok(ctx, o = {}) {
  const t = o.t || 0, mush = clamp(o.mush || 0), burn = clamp(o.burn || 0), gr = clamp(o.grains || 0), toss = clamp(o.toss || 0), block = clamp(o.block || 0);
  if (mush > 0) {
    mushPath(ctx, mush, t); ctx.fillStyle = lerpC(NGP.rice, NGP.mush, mush); ctx.fill();
    // butir yang hancur tertanam di gumpalan
    ctx.save(); mushPath(ctx, mush, t); ctx.clip();
    const r = rng(8); for (let i = 0; i < 40; i++) { const x = (r() - .5) * 400, y = 10 - r() * 80; ctx.globalAlpha = .55; ctx.beginPath(); ctx.ellipse(x, y, 10, 4.5, r() * TAU, 0, TAU); ctx.lineWidth = 2; ctx.strokeStyle = NGP.mushSh; ctx.stroke(); }
    ctx.globalAlpha = 1;
    if (burn > 0) { ctx.fillStyle = `rgba(74,46,28,${.9 * burn})`; ctx.fillRect(-300, 6 - 10 * burn, 600, 60); }
    // kilau basah lengket
    ctx.fillStyle = NGP.gloss; ellipse(ctx, -60, -30 * mush, 40, 9, -.2); ctx.fill(); ellipse(ctx, 70, -20 * mush, 26, 6, .2); ctx.fill();
    ctx.restore();
    mushPath(ctx, mush, t); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
    if (o.face) propFace(ctx, 0, -18 - 26 * mush, 120, o.face, { t });
  }
  if (block > 0) {
    // bongkah nasi kulkas: kotak keras, tepi bersudut, butir terlihat jelas
    ctx.save(); ctx.translate(0, -30 - (1 - block) * 0); rrect(ctx, -110, -60, 220, 90, 16); fillStroke(ctx, NGP.riceSh, 6);
    ctx.save(); rrect(ctx, -110, -60, 220, 90, 16); ctx.clip(); const r = rng(4); for (let i = 0; i < 46; i++) drawGrain(ctx, -100 + r() * 200, -52 + r() * 80, r() * TAU, .9, NGP.rice); ctx.restore();
    ctx.restore();
  }
  if (gr > 0) {
    const col = o.col || NGP.fried;
    GRAINS.forEach((g, i) => {
      if (i / GRAINS.length > gr) return;
      const j = toss > 0 ? Math.abs(Math.sin(t * g.sp * 3 + g.ph)) * 120 * toss : 0;
      drawGrain(ctx, g.x * (.6 + .4 * gr), g.y - j, g.rot + t * toss * g.sp, 1, col, g.kind);
    });
  }
}
// Sutil/spatula. (x,y) = titik genggam, rot = arah daun (0 = ke kanan bawah).
function drawSutil(ctx, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -70, -9, 90, 18, 9); fillStroke(ctx, NGP.handle, 5);
  line(ctx, 20, 0, 120, 0, 8, '#8a8f9c');
  ctx.beginPath(); ctx.moveTo(115, -34); ctx.lineTo(190, -40); ctx.quadraticCurveTo(205, 0, 190, 40); ctx.lineTo(115, 34); ctx.closePath(); fillStroke(ctx, NGP.sutil, 5);
  ctx.restore();
}
// Wadah nasi semalam dari kulkas. (x,y) = tengah dasar. o: { lid 0..1, face, t, frost 0..1 }
function drawWadahNasi(ctx, x, y, s = 1, o = {}) {
  drawBox(ctx, x, y, s, { lid: o.lid == null ? 1 : o.lid, fill: .78, food: NGP.riceSh, shadow: o.shadow });
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.save(); ctx.beginPath(); ctx.moveTo(-80, -78); ctx.lineTo(80, -78); ctx.lineTo(68, 0); ctx.lineTo(-68, 0); ctx.closePath(); ctx.clip();
  const r = rng(12); for (let i = 0; i < 34; i++) drawGrain(ctx, -70 + r() * 140, -70 + r() * 66, r() * TAU, .8, NGP.rice); ctx.restore();
  if (o.frost) { ctx.save(); ctx.globalAlpha = o.frost; for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(-50 + i * 34, -30 - (i % 2) * 30); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k < 3; k++) { ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.rotate(Math.PI / 3); } ctx.stroke(); ctx.restore(); } ctx.restore(); }
  ctx.restore();
  if (o.face) propFace(ctx, x, y - 42 * s, 100 * s, o.face, { t: o.t || 0 });
}
// Piring nasi goreng. (x,y) = tengah dasar. o: { n jumlah piring bertumpuk (nambah), fill 0..1 }
function drawPiringNG(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 4, 150, 18); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  const n = o.n || 1; for (let i = n - 1; i >= 1; i--) { ellipse(ctx, 0, -10 - i * 12, 140, 30); fillStroke(ctx, '#f7f9fc', 5); }
  ellipse(ctx, 0, -12, 140, 32); fillStroke(ctx, '#f7f9fc', 6); ellipse(ctx, 0, -14, 98, 18); ctx.lineWidth = 3; ctx.strokeStyle = '#d9e0ea'; ctx.stroke();
  const f = clamp(o.fill == null ? 1 : o.fill);
  if (f > 0) {
    ctx.beginPath(); ctx.moveTo(-96 * f, -14); ctx.quadraticCurveTo(-80 * f, -90 * f, 0, -94 * f); ctx.quadraticCurveTo(80 * f, -90 * f, 96 * f, -14); ctx.closePath(); fillStroke(ctx, NGP.fried, 5);
    ctx.save(); ctx.beginPath(); ctx.moveTo(-96 * f, -14); ctx.quadraticCurveTo(-80 * f, -90 * f, 0, -94 * f); ctx.quadraticCurveTo(80 * f, -90 * f, 96 * f, -14); ctx.closePath(); ctx.clip();
    GRAINS.slice(0, 60).forEach(g => drawGrain(ctx, g.x * .42, g.y * 2 - 30, g.rot, .8, NGP.fried, g.kind)); ctx.restore();
    if (f > .8) { ctx.beginPath(); ctx.ellipse(10, -92 * f, 44, 14, 0, 0, TAU); fillStroke(ctx, '#fffdf4', 5); circle(ctx, 14, -94 * f, 13); fillStroke(ctx, NGP.egg, 4); }
  }
  ctx.restore();
}
// Botol minyak. (x,y) = dasar, rot miring menuang.
function drawBotolMinyak(ctx, x, y, s = 1, rot = 0, pour = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -40, -170, 80, 170, 22); fillStroke(ctx, NGP.oilBottle, 6); rrect(ctx, -16, -210, 32, 44, 8); fillStroke(ctx, '#e5392f', 5);
  rrect(ctx, -32, -120, 64, 50, 8); fillStroke(ctx, '#fff', 4); text(ctx, 'MINYAK', 0, -94, 15, INK, INK, 0);
  ctx.restore();
  if (pour > 0) { ctx.save(); ctx.globalAlpha = pour; const tip = [x + Math.sin(rot) * 210 * s, y - Math.cos(rot) * 210 * s]; ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.quadraticCurveTo(tip[0] + 10, tip[1] + 80, tip[0] + 6, tip[1] + 200); ctx.lineWidth = 10; ctx.strokeStyle = '#ffcf4a'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
}
// Butir nasi raksasa (dunia mikro). o: { wet 0..1 (permukaan basah lengket), hard 0..1 (mengeras, kristal di dalam), squash 0..1, face, t, steam, sizzle }
function drawButir(ctx, x, y, r, o = {}) {
  const t = o.t || 0, wet = clamp(o.wet || 0), hard = clamp(o.hard || 0), sq = clamp(o.squash || 0);
  ctx.save(); ctx.translate(x, y); ctx.scale(1 + sq * .45, 1 - sq * .4);
  const sh = () => { ctx.beginPath(); ctx.ellipse(0, 0, r, r * .5 * (1 + wet * .15), 0, 0, TAU); };
  sh(); const g = ctx.createRadialGradient(-r * .3, -r * .2, r * .1, 0, 0, r); g.addColorStop(0, '#ffffff'); g.addColorStop(1, hard > .5 ? '#e6dcc4' : '#f1ead8'); ctx.fillStyle = g; ctx.fill();
  if (hard > 0) { ctx.save(); sh(); ctx.clip(); ctx.globalAlpha = hard; ctx.strokeStyle = 'rgba(150,130,100,.55)'; ctx.lineWidth = r * .03; for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(i * r * .22 - r * .1, -r * .5); ctx.lineTo(i * r * .22 + r * .1, r * .5); ctx.stroke(); } ctx.restore(); }
  sh(); ctx.lineWidth = r * .05; ctx.strokeStyle = INK; ctx.stroke();
  if (wet > 0) { ctx.save(); ctx.globalAlpha = wet; ctx.fillStyle = NGP.gloss; ellipse(ctx, -r * .35, -r * .25, r * .32, r * .07, -.15); ctx.fill(); ellipse(ctx, r * .3, -r * .18, r * .14, r * .04, .1); ctx.fill();
    for (let i = 0; i < 3; i++) { const q = (t * .6 + i / 3) % 1; drawTear(ctx, -r * .5 + i * r * .5, r * .48 + q * r * .35, r * .07, 1 - q); } ctx.restore(); }
  ctx.restore();
  if (o.face) propFace(ctx, x, y + r * .02, r * 1.05, o.face, { t });
  if (o.steam > 0) for (let i = 0; i < 4; i++) { const q = (t * .7 + i / 4) % 1; ctx.save(); ctx.globalAlpha = (1 - q) * .8 * o.steam; puff(ctx, x - r * .6 + i * r * .4, y - r * .6 - q * r * .9, r * (.18 + q * .2), t, '#ffffff', i + 1, 1); ctx.restore(); }
  if (o.sizzle > 0) for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * 2, q = (t * 2 + i * .37) % 1; circle(ctx, x + Math.cos(a) * r * (1.05 + q * .3), y + Math.sin(a) * r * .55 * (1.05 + q * .3), r * .05 * (1 - q)); ctx.lineWidth = 3; ctx.strokeStyle = `rgba(255,220,120,${o.sizzle * (1 - q)})`; ctx.stroke(); }
}
// Gelembung lup (koordinat LAYAR). Isi digambar oleh draw(ctx) di dalam lingkaran.
function drawLup(ctx, x, y, r, k, draw, ex, ey) {
  if (k <= 0) return; const rr = r * backOut(clamp(k));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (ex != null) { ctx.beginPath(); ctx.moveTo(x - rr * .3, y + rr * .9); ctx.lineTo(ex, ey); ctx.lineTo(x + rr * .3, y + rr * .9); ctx.closePath(); fillStroke(ctx, '#fffaf0', 8); }
  circle(ctx, x, y, rr); ctx.fillStyle = '#2a2f4a'; ctx.fill();
  ctx.save(); circle(ctx, x, y, rr); ctx.clip(); ctx.translate(x, y); ctx.scale(rr / r, rr / r); draw(ctx); ctx.restore();
  circle(ctx, x, y, rr); ctx.lineWidth = 14; ctx.strokeStyle = '#fffaf0'; ctx.stroke(); circle(ctx, x, y, rr + 7); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.restore();
}
