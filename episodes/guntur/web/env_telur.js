// ---------- Aset episode "Telur bopeng" (17-11-2026) ----------
// Aturan v6: satu fungsi per benda, palet TLP terkunci, tata letak TL terkunci.
const TLP = {
  shell: '#e8b07c', shellSh: '#c98d58', shellIn: '#fbf1e2', speck: '#b97a48',
  white: '#fffdf6', whiteSh: '#ebe4d4', pit: '#e6d9bd', pitDk: '#c7b28a', raw: '#f3efcf',
  balado: '#e5392f', baladoDk: '#a8231d', chili: '#ff6a3a',
  tray: '#cdb48e', trayDk: '#a88d66', water: '#aee0ff', waterDk: '#6fbbe8', boil: '#d6f0ff',
  pot: '#d7dde9', potDk: '#9aa5bd', bowl: '#7fc6e8', ice: '#eaf8ff',
  membrane: '#e9dcff', glue: '#ffe07a', gas: '#c9f1ff', soda: '#3fae5a', sodaDk: '#2a7d3f', cap: '#e5392f',
  sink: '#cfd6e2', sinkDk: '#8f9ab0', tap: '#b9c2d3', phone: '#2b2f3e', screen: '#ffd23a',
  wallet: '#8a5a34', walletDk: '#5e3a20', shelf: '#b07a48', tag: '#fffaf0',
};
// Tata letak dapur (terkunci). Tokoh y = 1500 (s 600), meja 1330.
const TL = { top: 1330, back: 1500, budi: 300, plate: [480, 1330], bowl: [700, 1330], stove: [1030, 1330], pot: [1030, 1214], sink: [-380, 1330],
  tray: [130, 1330], rak: [60, 900], fridge: -560, ibuIn: -120, ibuStove: 790, endTray: [1480, 1330], endBudi: 1420 };

// ---- bentuk telur (titik (0,0) = pusat, r = setengah lebar) ----
function eggPath(ctx, r) {
  ctx.beginPath(); ctx.moveTo(0, -1.25 * r);
  ctx.bezierCurveTo(.62 * r, -1.25 * r, r, -.45 * r, r, .15 * r); ctx.bezierCurveTo(r, .7 * r, .55 * r, 1 * r, 0, 1 * r);
  ctx.bezierCurveTo(-.55 * r, 1 * r, -r, .7 * r, -r, .15 * r); ctx.bezierCurveTo(-r, -.45 * r, -.62 * r, -1.25 * r, 0, -1.25 * r); ctx.closePath();
}
const PITS = (() => { const r = rng(31), o = []; for (let i = 0; i < 9; i++) o.push({ x: (r() - .5) * 1.3, y: -.9 + r() * 1.6, s: .16 + r() * .2, a: r() * TAU }); return o; })();
// Telur. (x,y) = pusat. o: { shell 0..1 (sisa kulit, 1 = utuh), cracks 0..1, pock 0..1 (bopeng), balado 0..1, face, t, rot, glint, raw (telur mentah: kulit saja) }
function drawTelur(ctx, x, y, r, o = {}) {
  const t = o.t || 0, shell = o.shell == null ? 1 : clamp(o.shell), pock = clamp(o.pock || 0), bal = clamp(o.balado || 0), lw = Math.max(2.5, r * .06);
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  if (o.shadow !== false) { ellipse(ctx, 0, r * 1.02, r * .8, r * .14); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill(); }
  // putih telur (terlihat bila kulit sudah dikupas)
  if (shell < 1) {
    eggPath(ctx, r); const g = ctx.createRadialGradient(-r * .35, -r * .45, r * .1, 0, 0, r * 1.3); g.addColorStop(0, '#ffffff'); g.addColorStop(1, TLP.whiteSh); ctx.fillStyle = g; ctx.fill();
    if (pock > 0) { ctx.save(); eggPath(ctx, r); ctx.clip();
      PITS.forEach((p, i) => { if (i / PITS.length > pock) return; ctx.save(); ctx.translate(p.x * r, p.y * r); ctx.rotate(p.a);
        ctx.beginPath(); for (let k = 0; k < 9; k++) { const a = k / 9 * TAU, rr = p.s * r * (1 + .25 * Math.sin(k * 2.3 + i)); k ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * .8) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr * .8); } ctx.closePath();
        ctx.fillStyle = TLP.pit; ctx.fill(); ctx.lineWidth = lw * .6; ctx.strokeStyle = TLP.pitDk; ctx.stroke();
        ellipse(ctx, p.s * r * .25, p.s * r * .2, p.s * r * .45, p.s * r * .3); ctx.fillStyle = 'rgba(160,130,90,.35)'; ctx.fill(); ctx.restore(); });
      ctx.restore(); }
    if (bal > 0) { ctx.save(); eggPath(ctx, r); ctx.clip(); ctx.globalAlpha = bal; ctx.fillStyle = TLP.balado; ctx.fillRect(-r * 1.2, -r * 1.4, r * 2.4, r * 2.6);
      const q = rng(5); for (let i = 0; i < 12; i++) { circle(ctx, (q() - .5) * 1.7 * r, (q() - .6) * 2 * r, r * .07); ctx.fillStyle = i % 2 ? TLP.baladoDk : TLP.chili; ctx.fill(); } ctx.restore(); }
    eggPath(ctx, r); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke();
    if (pock < .2 && bal < .5) { ctx.fillStyle = 'rgba(255,255,255,.9)'; ellipse(ctx, -r * .38, -r * .55, r * .16, r * .32, .35); ctx.fill(); }
  }
  // kulit (dipotong dari atas: shell 1 = utuh, 0 = habis). Tepi bergerigi, serpih putih ikut menempel bila o.stuck.
  if (shell > 0) {
    const yc = lerp(1.05 * r, -1.3 * r, shell);
    ctx.save(); ctx.beginPath(); ctx.moveTo(-r * 1.3, r * 1.3);
    for (let k = 0; k <= 12; k++) { const xx = lerp(-r * 1.3, r * 1.3, k / 12); ctx.lineTo(xx, yc + (k % 2 ? r * .1 : -r * .06)); }
    ctx.lineTo(r * 1.3, r * 1.3); ctx.closePath(); ctx.clip();
    eggPath(ctx, r); const g = ctx.createRadialGradient(-r * .35, -r * .45, r * .1, 0, 0, r * 1.3); g.addColorStop(0, '#f6cfa5'); g.addColorStop(1, TLP.shellSh); ctx.fillStyle = g; ctx.fill();
    const q = rng(11); ctx.fillStyle = TLP.speck; for (let i = 0; i < 10; i++) { circle(ctx, (q() - .5) * 1.4 * r, (q() - .55) * 1.8 * r, r * .025); ctx.fill(); }
    if (o.cracks > 0) { ctx.save(); eggPath(ctx, r); ctx.clip(); ctx.lineWidth = lw * .7; ctx.strokeStyle = INK; ctx.lineJoin = 'round';
      const n = Math.ceil(6 * o.cracks), c = rng(17); for (let i = 0; i < n; i++) { let px = (c() - .5) * 1.6 * r, py = (c() - .6) * 1.8 * r; ctx.beginPath(); ctx.moveTo(px, py); for (let k = 0; k < 4; k++) { px += (c() - .5) * r * .5; py += (c() - .3) * r * .35; ctx.lineTo(px, py); } ctx.stroke(); } ctx.restore(); }
    eggPath(ctx, r); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke();
    if (shell >= 1) { ctx.fillStyle = 'rgba(255,255,255,.45)'; ellipse(ctx, -r * .38, -r * .55, r * .14, r * .28, .35); ctx.fill(); }
    ctx.restore();
    if (shell < 1) { // tepi kulit + serpih putih yang ikut tercabut
      ctx.save(); ctx.beginPath(); for (let k = 0; k <= 12; k++) { const xx = lerp(-r, r, k / 12), yy = yc + (k % 2 ? r * .1 : -r * .06); k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.lineWidth = lw * 1.4; ctx.strokeStyle = TLP.shellIn; ctx.stroke(); ctx.lineWidth = lw * .6; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
    }
  }
  ctx.restore();
  if (o.face) propFace(ctx, x, y + r * .15, r * 1.25, o.face, { t, rot: o.rot || 0 });
  if (o.glint != null) glint(ctx, x - r * .4, y - r * .6, r * .9, t, o.glint);
}
// Serpih kulit (fresh: putih menempel tebal) atau kulit utuh yang lepas (whole). (x,y) = pusat. o: { stuck 0..1, whole, t }
function drawKulit(ctx, x, y, s = 1, rot = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (o.whole) { // separuh cangkang utuh, terbuka ke bawah
    ctx.beginPath(); ctx.moveTo(-100, 40); ctx.bezierCurveTo(-100, -60, -62, -125, 0, -125); ctx.bezierCurveTo(62, -125, 100, -60, 100, 40);
    for (let k = 0; k <= 8; k++) ctx.lineTo(100 - k * 25, 40 + (k % 2 ? 12 : 0)); ctx.closePath(); fillStroke(ctx, TLP.shell, 6);
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ellipse(ctx, -40, -60, 16, 34, .35); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 40, 92, 18, 0, 0, Math.PI); ctx.fillStyle = TLP.shellIn; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(-60, -10); ctx.quadraticCurveTo(0, -60, 60, -14); ctx.lineTo(48, 24); ctx.lineTo(18, 14); ctx.lineTo(-8, 30); ctx.lineTo(-40, 18); ctx.closePath(); fillStroke(ctx, TLP.shell, 5);
    const st = clamp(o.stuck || 0); if (st > 0) { ctx.beginPath(); ctx.moveTo(-44, 16); ctx.quadraticCurveTo(-30, 16 + 50 * st, 0, 22 + 40 * st); ctx.quadraticCurveTo(30, 18 + 46 * st, 46, 20); ctx.lineTo(18, 14); ctx.lineTo(-8, 30); ctx.closePath(); fillStroke(ctx, TLP.white, 4); }
  }
  ctx.restore();
}
// Piring telur rebus. (x,y) = tengah dasar. o: { n (0..5), pock, balado, t, faces: [face|null] }
function drawPiringTelur(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 4, 150, 18); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  ellipse(ctx, 0, -12, 140, 32); fillStroke(ctx, '#f7f9fc', 6); ellipse(ctx, 0, -14, 98, 18); ctx.lineWidth = 3; ctx.strokeStyle = '#d9e0ea'; ctx.stroke();
  ctx.restore();
  const P = [[-70, -40], [0, -44], [70, -40], [-36, -78], [36, -78]], n = o.n == null ? 5 : o.n;
  for (let i = n - 1; i >= 0; i--) { const p = P[i]; drawTelur(ctx, x + p[0] * s, y + p[1] * s, 34 * s, { shell: 0, pock: o.pock == null ? 1 : o.pock, balado: o.balado || 0, rot: (i - 2) * .25, shadow: false, t: o.t, face: o.faces && o.faces[i] }); }
}
// Tray telur 30 butir (5 x 6), tampak miring dari atas. (x,y) = tengah dasar depan. o: { n terisi, balado, face, t, tag }
function drawTray(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 6, 220, 20); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-210, 0); ctx.lineTo(210, 0); ctx.lineTo(170, -120); ctx.lineTo(-170, -120); ctx.closePath(); fillStroke(ctx, TLP.tray, 6);
  rrect(ctx, -212, -6, 424, 26, 6); fillStroke(ctx, TLP.trayDk, 5);
  const n = o.n == null ? 30 : o.n; let k = 0;
  for (let row = 0; row < 5; row++) for (let col = 0; col < 6; col++) {
    const v = row / 4, w = lerp(170, 205, v), cx = lerp(-w, w, (col + .5) / 6), cy = lerp(-106, -18, v), rr = lerp(20, 25, v);
    ellipse(ctx, cx, cy, rr, rr * .55); ctx.fillStyle = TLP.trayDk; ctx.fill();
    const idx = row * 6 + col; if (idx < 30 - n) continue;
    ctx.save(); ctx.translate(cx, cy - rr * .5); ellipse(ctx, 0, 0, rr * .92, rr * .82); fillStroke(ctx, o.balado ? TLP.balado : TLP.shell, 3.5);
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ellipse(ctx, -rr * .3, -rr * .3, rr * .22, rr * .14, -.4); ctx.fill(); ctx.restore(); k++;
  }
  if (o.tag) { ctx.save(); ctx.translate(150, -150); ctx.rotate(.12); rrect(ctx, -70, -34, 140, 68, 10); fillStroke(ctx, TLP.tag, 5); text(ctx, o.tag, 0, 2, 30, INK, INK, 0); ctx.restore(); }
  ctx.restore();
  if (o.face) propFace(ctx, x, y - 70 * s, 150 * s, o.face, { t: o.t || 0 });
}
// Rak dinding + tray telur lama + label "7 HARI". (x,y) = tengah papan rak.
function drawRak(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const bx of [-120, 120]) { ctx.beginPath(); ctx.moveTo(bx, 0); ctx.lineTo(bx, 60); ctx.lineTo(bx - 30 * Math.sign(bx), 0); ctx.closePath(); fillStroke(ctx, TLP.trayDk, 4); }
  rrect(ctx, -170, -14, 340, 28, 6); fillStroke(ctx, TLP.shelf, 6);
  ctx.restore();
  drawTray(ctx, x, y - 14 * s, .62 * s, { n: o.n == null ? 12 : o.n });
  if (o.tag !== false) { ctx.save(); ctx.translate(x + 120 * s, y - 120 * s); ctx.rotate(.12); rrect(ctx, -60 * s, -6 * s, 120 * s, 50 * s, 8 * s); fillStroke(ctx, TLP.tag, 4 * s); text(ctx, '7 HARI', 0, 20 * s, 26 * s, INK, INK, 0); ctx.restore(); }
}
// Panci air di atas kompor. (x,y) = tengah dasar. o: { boil 0..1, eggs [[dx, bob]], steam, t, face }
function drawPanci(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0, b = clamp(o.boil || 0);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sx of [-1, 1]) { ctx.save(); ctx.scale(sx, 1); rrect(ctx, 150, -150, 60, 24, 12); fillStroke(ctx, '#38405a', 6); ctx.restore(); }
  const body = () => rrect(ctx, -160, -180, 320, 180, [6, 6, 30, 30]);
  body(); const gg = ctx.createLinearGradient(-160, 0, 160, 0); gg.addColorStop(0, '#eef2fa'); gg.addColorStop(1, TLP.potDk); ctx.fillStyle = gg; ctx.fill(); body(); fillStroke(ctx, null, 7);
  rrect(ctx, -126, -160, 26, 120, 12); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
  // air (dilihat sedikit dari atas)
  ellipse(ctx, 0, -180, 160, 30); fillStroke(ctx, '#eef2fa', 7);
  ctx.save(); ellipse(ctx, 0, -178, 148, 24); ctx.clip(); ctx.fillStyle = lerpC(TLP.water, TLP.boil, b); ctx.fillRect(-160, -210, 320, 60);
  (o.eggs || []).forEach(([dx, bob], i) => { const yy = -176 + Math.sin(t * 9 + i * 2) * 3 * b - (bob || 0); ellipse(ctx, dx, yy, 30, 20); fillStroke(ctx, TLP.shell, 4); });
  if (b > 0) { const r = rng(3); for (let i = 0; i < Math.round(22 * b); i++) { const bx = (r() - .5) * 270, by = -178 + (r() - .5) * 36, ph = (t * (2.2 + r() * 1.5) + r()) % 1; circle(ctx, bx, by, 4 + 9 * ph * b); ctx.lineWidth = 3; ctx.strokeStyle = `rgba(255,255,255,${(1 - ph) * .95})`; ctx.stroke(); } }
  ctx.restore();
  if (o.steam > 0) for (let i = 0; i < 5; i++) { const p = (t * .5 + i * .21) % 1; puff(ctx, (i - 2) * 50 + Math.sin(t * 3 + i * 2) * 14, -230 - p * 260, 24 + p * 36, t, '#ffffff', i + 3, (1 - p) * .85 * Math.min(1, o.steam)); }
  ctx.restore();
  if (o.face) propFace(ctx, x, y - 80 * s, 130 * s, o.face, { t });
}
// Sendok sayur berlubang. (x,y) = genggaman, rot = arah gagang (0 = ke kanan); egg = gambar telur di mangkuk sendok.
function drawSendok(ctx, x, y, s = 1, rot = 0, egg = false, eggO = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -60, -9, 70, 18, 9); fillStroke(ctx, '#7a4a2a', 5); line(ctx, 10, 0, 150, 0, 8, '#9aa3b6');
  ctx.restore();
  const tip = [x + Math.cos(rot) * 190 * s, y + Math.sin(rot) * 190 * s];
  if (egg) drawTelur(ctx, tip[0], tip[1] - 26 * s, 30 * s, Object.assign({ shadow: false }, eggO));
  ctx.save(); ctx.translate(tip[0], tip[1]); ctx.scale(s, s); ctx.beginPath(); ctx.ellipse(0, 0, 50, 18, 0, 0, Math.PI); ctx.lineTo(-50, 0); fillStroke(ctx, '#c9ccd6', 5);
  for (let i = -1; i <= 1; i++) { circle(ctx, i * 22, 6, 4); ctx.fillStyle = '#6b7286'; ctx.fill(); } ctx.restore();
}
// Mangkuk air es. (x,y) = tengah dasar. o: { egg (telur di dalam), t, cold }
function drawMangkukEs(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 4, 140, 14); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  ellipse(ctx, 0, -110, 150, 30); fillStroke(ctx, '#e8f4fb', 7);
  ctx.save(); ellipse(ctx, 0, -108, 138, 24); ctx.clip(); ctx.fillStyle = TLP.water; ctx.fillRect(-150, -140, 300, 60);
  if (o.egg) { ellipse(ctx, 20, -104, 30, 19); fillStroke(ctx, TLP.shell, 4); }
  for (const [ix, iy, a] of [[-70, -112, .3], [-20, -100, -.2], [70, -110, .5], [40, -122, .1]]) { ctx.save(); ctx.translate(ix, iy + Math.sin(t * 3 + ix) * 2); ctx.rotate(a); rrect(ctx, -18, -14, 36, 28, 6); fillStroke(ctx, TLP.ice, 3); ctx.restore(); }
  ctx.restore();
  const b = () => { ctx.beginPath(); ctx.moveTo(-150, -110); ctx.quadraticCurveTo(-140, 0, -60, 0); ctx.lineTo(60, 0); ctx.quadraticCurveTo(140, 0, 150, -110); ctx.ellipse(0, -110, 150, 30, 0, 0, Math.PI, false); ctx.closePath(); };
  b(); ctx.fillStyle = TLP.bowl; ctx.fill(); shadeShape(ctx, b, 1, .18, .3, [-150, -140, 300, 140]); b(); fillStroke(ctx, null, 7);
  ctx.fillStyle = 'rgba(255,255,255,.45)'; rrect(ctx, -110, -88, 40, 14, 7); ctx.fill();
  ctx.restore();
}
// Wastafel + keran (di meja). (x,y) = tengah bibir wastafel. o: { flow 0..1, t, splash 0..1 }
function drawKeran(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // leher keran dari dinding belakang
  ctx.beginPath(); ctx.moveTo(70, -6); ctx.lineTo(70, -250); ctx.quadraticCurveTo(70, -300, 20, -300); ctx.lineTo(-30, -300); ctx.lineTo(-30, -270); ctx.lineTo(16, -270); ctx.quadraticCurveTo(40, -270, 40, -246); ctx.lineTo(40, -6); ctx.closePath(); fillStroke(ctx, TLP.tap, 6);
  rrect(ctx, 30, -200, 80, 22, 8); fillStroke(ctx, '#e5392f', 5);
  ellipse(ctx, 0, 0, 170, 26); fillStroke(ctx, TLP.sinkDk, 7); ellipse(ctx, 0, 2, 150, 18); ctx.fillStyle = '#6e7890'; ctx.fill();
  const f = clamp(o.flow || 0);
  if (f > 0) { const w = 16 * f; ctx.beginPath(); ctx.moveTo(-14 - w / 2, -268); ctx.bezierCurveTo(-16, -150, -18 - w * .6, -60, -20 - w * .7, 0); ctx.lineTo(-20 + w * .7, 0); ctx.bezierCurveTo(-18 + w * .6, -60, -16 + w / 2, -150, -14 + w / 2, -268); ctx.closePath();
    ctx.fillStyle = 'rgba(150,215,255,.85)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#4aa3d8'; ctx.stroke();
    for (let i = 0; i < 4; i++) { const q = (t * 2.5 + i / 4) % 1; line(ctx, -20, -260 + q * 250, -20, -240 + q * 250, 3, 'rgba(255,255,255,.8)'); } }
  ctx.restore();
}
// Ponsel dengan layar "TRIK VIRAL". (x,y) = pusat.
function drawHP(ctx, x, y, s = 1, rot = 0, label = 'TRIK VIRAL') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -70, -130, 140, 260, 22); fillStroke(ctx, TLP.phone, 6); rrect(ctx, -58, -112, 116, 220, 12); ctx.fillStyle = TLP.screen; ctx.fill();
  text(ctx, label.split(' ')[0], 0, -60, 26, INK, INK, 0); if (label.split(' ')[1]) text(ctx, label.split(' ')[1], 0, -30, 26, '#e5392f', INK, 0);
  drawTelur(ctx, 0, 40, 30, { shell: 0, pock: 0, shadow: false }); ctx.beginPath(); ctx.moveTo(-12, 80); ctx.lineTo(16, 92); ctx.lineTo(-12, 104); ctx.closePath(); ctx.fillStyle = '#e5392f'; ctx.fill();
  ctx.restore();
}
// Dompet terbuka (kosong) + lalat. (x,y) = pusat.
function drawDompet(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0, op = clamp(o.open == null ? 1 : o.open);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -110, -10, 220, 120, 16); fillStroke(ctx, TLP.wallet, 6);
  ctx.save(); ctx.translate(0, -10); ctx.scale(1, lerp(1, -1, op)); rrect(ctx, -110, -120, 220, 120, 16); fillStroke(ctx, TLP.walletDk, 6); ctx.restore();
  if (op > .5) { rrect(ctx, -90, 10, 180, 70, 10); ctx.fillStyle = '#3a2416'; ctx.fill(); }
  ctx.restore();
  if (o.fly && op > .5) { const fx = x + Math.sin(t * 5) * 70 * s, fy = y - 160 * s + Math.sin(t * 9) * 30 * s; circle(ctx, fx, fy, 9 * s); ctx.fillStyle = INK; ctx.fill(); for (const d of [-1, 1]) { ellipse(ctx, fx + d * 10 * s, fy - 8 * s, 9 * s, 5 * s, d * (.5 + Math.sin(t * 60) * .4)); ctx.fillStyle = 'rgba(220,240,255,.85)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke(); } }
}
// Botol soda (analogi): tutup terbuka, gelembung kabur. (x,y) = tengah dasar. o: { open 0..1, fizz 0..1, t, face }
function drawSoda(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0, op = clamp(o.open || 0), fz = clamp(o.fizz || 0);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(-60, -170); ctx.quadraticCurveTo(-60, -220, -24, -250); ctx.lineTo(-24, -300); ctx.lineTo(24, -300); ctx.lineTo(24, -250); ctx.quadraticCurveTo(60, -220, 60, -170); ctx.lineTo(60, 0); ctx.closePath();
  ctx.fillStyle = TLP.soda; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  rrect(ctx, -60, -150, 120, 70, 6); fillStroke(ctx, '#fff', 5); text(ctx, 'SODA', 0, -112, 30, '#e5392f', INK, 0);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; rrect(ctx, -46, -230, 14, 200, 7); ctx.fill();
  ctx.save(); ctx.translate(lerp(0, 70, op), lerp(-300, -360, op)); ctx.rotate(op * .9); rrect(ctx, -30, -24, 60, 26, 6); fillStroke(ctx, TLP.cap, 5); ctx.restore();
  if (fz > 0) for (let i = 0; i < 9; i++) { const q = (t * 1.3 + i / 9) % 1, bx = Math.sin(i * 2.1 + t * 3) * (20 + q * 60), by = -300 - q * 260; circle(ctx, bx, by, (7 + 6 * (i % 3)) * (1 - q * .4)); ctx.fillStyle = `rgba(201,241,255,${fz * (1 - q)})`; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = `rgba(34,28,34,${fz * (1 - q)})`; ctx.stroke(); }
  for (let i = 0; i < 6; i++) { const q = (t * .9 + i / 6) % 1; circle(ctx, -30 + i * 12, -20 - q * 200, 5); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fill(); }
  ctx.restore();
  if (o.face) propFace(ctx, x, y - 50 * s, 100 * s, o.face, { t });
}
// ===== DUNIA MIKRO: penampang kulit telur (koordinat lup, pusat 0,0, area +-300) =====
// Lapisan dari atas: luar (udara / air mendidih) | kulit berpori | selaput | putih telur.
// o: { t, gas 0..1 (gelembung gas di putih), escape 0..1 (gas kabur lewat pori), glue 0..1 (putih lengket ke selaput), gap 0..1 (putih turun, ada celah), hot 0..1 (air mendidih di luar), set 0..1 (putih bagian luar langsung matang), gasFace }
const GASB = (() => { const r = rng(77), o = []; for (let i = 0; i < 6; i++) o.push({ x: -210 + i * 84 + (r() - .5) * 20, y: 70 + (i % 2) * 90 + r() * 40, r: 34 + r() * 10, p: i % 4 }); return o; })();
const PORE_X = [-210, -90, 30, 150, 260];
function drawPenampang(ctx, o = {}) {
  const t = o.t || 0, gap = clamp(o.gap || 0), hot = clamp(o.hot || 0), set = clamp(o.set || 0), glue = clamp(o.glue || 0), esc = clamp(o.escape || 0);
  const SH0 = -170, SH1 = -95, MEM = -82, GL = 40 * glue, WT = MEM + 6 + Math.max(GL, gap * 60);
  ctx.fillStyle = mixC('#bfe6ff', '#ff9d6a', hot); ctx.fillRect(-400, -400, 800, 400 + SH0);
  if (hot > 0) { const r = rng(4); for (let i = 0; i < 14; i++) { const bx = (r() - .5) * 600, q = (t * (1.5 + r()) + r()) % 1; circle(ctx, bx, SH0 - 20 - q * 200, 8 + 10 * q); ctx.lineWidth = 4; ctx.strokeStyle = `rgba(255,255,255,${hot * (1 - q)})`; ctx.stroke(); } }
  // kulit
  ctx.fillStyle = TLP.shell; ctx.fillRect(-400, SH0, 800, SH1 - SH0); line(ctx, -400, SH0, 400, SH0, 6); line(ctx, -400, SH1, 400, SH1, 6);
  for (const px of PORE_X) { ctx.fillStyle = mixC('#bfe6ff', '#ff9d6a', hot); ctx.beginPath(); ctx.moveTo(px - 9, SH0); ctx.lineTo(px + 9, SH0); ctx.lineTo(px + 5, SH1); ctx.lineTo(px - 5, SH1); ctx.closePath(); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  // selaput
  ctx.fillStyle = TLP.membrane; ctx.fillRect(-400, SH1, 800, MEM - SH1 + 4); line(ctx, -400, MEM + 4, 400, MEM + 4, 4, '#8a6fc4');
  // celah udara
  if (gap > 0) { ctx.fillStyle = '#eef8ff'; ctx.fillRect(-400, MEM + 4, 800, WT - MEM - 4); }
  // putih telur: mentah bening -> matang putih (set dari atas ke bawah)
  ctx.fillStyle = TLP.raw; ctx.fillRect(-400, WT, 800, 400);
  if (set > 0) { ctx.fillStyle = '#ffffff'; ctx.fillRect(-400, WT, 800, 60 + 340 * set * set); ctx.fillStyle = 'rgba(220,210,190,.35)'; ctx.fillRect(-400, WT + 60 + 340 * set * set - 10, 800, 10); }
  line(ctx, -400, WT, 400, WT, 5);
  // lem: lapisan kuning lengket antara selaput dan putih (dengan tetesan)
  if (glue > 0) { ctx.save(); ctx.globalAlpha = glue; ctx.beginPath(); ctx.moveTo(-400, MEM + 4);
    for (let k = 0; k <= 16; k++) { const xx = -400 + k * 50; ctx.lineTo(xx, MEM + 4 + GL + (k % 2 ? 18 + 6 * Math.sin(t * 3 + k) : 0)); } ctx.lineTo(400, MEM + 4); ctx.closePath(); fillStroke(ctx, TLP.glue, 4);
    ctx.fillStyle = 'rgba(255,255,255,.55)'; for (let k = 0; k < 6; k++) ellipse(ctx, -330 + k * 130, MEM + 14, 26, 5); ctx.fill(); ctx.restore(); }
  // gelembung gas (tokoh kecil). escape: naik ke pori terdekat, menembus kulit, keluar.
  const gas = o.gas == null ? 1 : clamp(o.gas);
  GASB.forEach((b, i) => {
    if (i / GASB.length >= gas) return;
    const px = PORE_X.reduce((a, v) => Math.abs(v - b.x) < Math.abs(a - b.x) ? v : a, PORE_X[0]);
    const e = clamp(esc * 1.6 - i * .07);
    let bx = b.x + Math.sin(t * 2 + i) * 6, by = b.y + Math.cos(t * 1.7 + i) * 5;
    if (e > 0) { const a = Math.min(1, e * 2), c = clamp(e * 2 - 1); bx = lerp(bx, px, ease(a)); by = lerp(by, MEM, ease(a)); if (c > 0) by = lerp(MEM, SH0 - 140, c); }
    if (e >= 1) return;
    const rr = b.r * (e > .5 ? .7 : 1); ctx.save(); circle(ctx, bx, by, rr); ctx.fillStyle = TLP.gas; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.9)'; circle(ctx, bx - rr * .35, by - rr * .35, rr * .22); ctx.fill(); ctx.restore();
    if (o.gasFace) propFace(ctx, bx, by + 2, rr * 1.5, o.gasFace, { t });
  });
}
// Bulan kecil (pembanding "permukaan bulan"). (x,y) = pusat.
function drawBulan(ctx, x, y, r) {
  circle(ctx, x, y, r); fillStroke(ctx, '#d9dbe3', r * .07);
  for (const [cx, cy, cr] of [[-.35, -.3, .22], [.3, -.1, .16], [-.1, .35, .2], [.4, .4, .1], [-.5, .2, .1]]) { circle(ctx, x + cx * r, y + cy * r, cr * r); ctx.fillStyle = '#b8bbc8'; ctx.fill(); ctx.lineWidth = r * .03; ctx.strokeStyle = '#8d90a0'; ctx.stroke(); }
}
// Lembar uang (dibawa dari env_listrik drawNote bila ada).
