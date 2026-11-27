// ---------- Aset episode "Gelas es teh bocor? Embun" (27-11-2026) ----------
// Aturan v6: satu fungsi per benda, palet ETP terkunci, tata letak ET terkunci. Warung = warungBG + mejaWarung (env_pedas.js).
const ETP = {
  glass: 'rgba(225,245,255,.5)', glassEdge: '#8fb7cc', tea: '#c8641e', teaHi: '#f0a050', teaDk: '#8f3f10', hotTea: '#a8501a',
  syrup: '#e0263a', syrupHi: '#ff6a7a', ice: '#eefaff', iceLn: '#7fb6d8', cup: 'rgba(240,250,255,.62)', cupLn: '#9fbfd4',
  drop: 'rgba(235,248,255,.95)', dropLn: '#6fa8cc', puddle: 'rgba(150,205,240,.55)', puddleHi: 'rgba(255,255,255,.7)',
  coaster: '#c9a25a', coasterDk: '#8a6a2e', vapor: 'rgba(230,244,255,.85)', vaporLn: '#9cc6e6',
  coldWall1: '#bfe8ff', coldWall2: '#7cc6f0', hotWall1: '#ffc08a', hotWall2: '#ff8a4a', air1: '#ffe3b8', air2: '#ffd09a',
  grass: '#4fb34a', grassDk: '#2f7d33', sky1: '#ffd9a0', sky2: '#bfe6ff', sun: '#ffd23a', kerudung: '#2fae9f', kerudungDk: '#1f7f74', apron: '#3fa7a0',
};
// Tata letak warung (terkunci). Tokoh: kaki y = PD.back (1500), s = 600. Meja y = PD.top (1330).
const ET = { rani: 220, buwar: 540, budi: 880, glassB: [700, 1330], glassR: [380, 1330], hot: [560, 1330] };

// ===== tokoh baru: Bu Warung (kerudung) =====
function kerudung(ctx, hx, hy, hr, lw) {
  ctx.beginPath(); ctx.arc(hx, hy, hr * 1.12, Math.PI * .92, Math.PI * 2.08); ctx.quadraticCurveTo(hx + hr * 1.25, hy + hr * .9, hx + hr * .7, hy + hr * 1.35);
  ctx.lineTo(hx - hr * .7, hy + hr * 1.35); ctx.quadraticCurveTo(hx - hr * 1.25, hy + hr * .9, hx - hr * 1.12, hy + hr * .1); ctx.closePath(); fillStroke(ctx, ETP.kerudung, lw);
  // bukaan wajah
  ellipse(ctx, hx, hy + hr * .08, hr * .82, hr * .9); ctx.fillStyle = HEAD; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke();
}
const BU_WAR = { cols: [ETP.apron, ETP.apron], hat: kerudung, belt: false, blush: true };

// ===== GELAS (satu fungsi: es teh / sirup / teh panas / gelas plastik). (x,y) = dasar tengah.
// o: { t, liquid 'teh'|'sirup'|'panas'|'kosong', fill, ice, plastik, sweat 0..1 (embun di luar), drip 0..1 (tetes mengalir), steam 0..1, rot, face, ghostRed 0..1 (bayangan tetes merah) }
const DROPS = (() => { const r = rng(31), a = []; for (let i = 0; i < 46; i++) a.push({ u: r() * 2 - 1, v: .08 + r() * .86, r: 4 + r() * 7, ph: r(), sp: .4 + r() * .8 }); return a; })();
function drawGelasEs(ctx, x, y, s = 1, o = {}) {
  const P = ETP, t = o.t || 0, liq = o.liquid || 'teh', fill = clamp(o.fill == null ? .85 : o.fill), sw = clamp(o.sweat || 0), pl = !!o.plastik;
  const Hh = pl ? 210 : 200, top = pl ? 66 : 58, bot = pl ? 44 : 46;
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(s, s);
  const shape = () => { ctx.beginPath(); ctx.moveTo(-top, -Hh); ctx.lineTo(top, -Hh); ctx.lineTo(bot, 0); ctx.lineTo(-bot, 0); ctx.closePath(); };
  const halfAt = v => lerp(bot, top, v);            // v 0 = dasar, 1 = bibir
  if (!o.rot) { ellipse(ctx, 0, 3, top + 4, 9); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill(); }
  shape(); ctx.fillStyle = pl ? P.cup : P.glass; ctx.fill();
  if (liq !== 'kosong' && fill > 0) { ctx.save(); shape(); ctx.clip(); const ly = lerp(-4, -Hh + 12, fill), col = liq === 'sirup' ? P.syrup : liq === 'panas' ? P.hotTea : P.tea, hi = liq === 'sirup' ? P.syrupHi : P.teaHi;
    ctx.fillStyle = col; ctx.fillRect(-120, ly, 240, 260); ctx.fillStyle = hi; ctx.globalAlpha = .7; ctx.fillRect(-120, ly, 240, 9); ctx.globalAlpha = 1;
    if (o.ice && liq !== 'panas') for (const [ix, iy, a] of [[-20, 30, .3], [20, 66, -.4], [-6, 108, .6]]) { ctx.save(); ctx.translate(ix, ly + iy - 12 + Math.sin(t * 2 + ix) * 2); ctx.rotate(a); rrect(ctx, -21, -17, 42, 34, 7); fillStroke(ctx, 'rgba(240,252,255,.85)', 3, P.iceLn); ctx.restore(); }
    ctx.restore(); }
  // kilap kaca
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.moveTo(-top + 14, -Hh + 12); ctx.lineTo(-top + 24, -Hh + 12); ctx.lineTo(-bot + 16, -20); ctx.lineTo(-bot + 8, -20); ctx.closePath(); ctx.fill();
  // embun di LUAR gelas (bening)
  if (sw > 0) for (let i = 0; i < DROPS.length; i++) { const d = DROPS[i]; if (i / DROPS.length > sw) break; const v = d.v, hw = halfAt(v) - 4, dx = d.u * hw, dy = -v * Hh;
    let yy = dy; if (o.drip > 0 && i % 5 === 0) { const q = ((t * d.sp + d.ph) % 1); yy = lerp(dy, -6, q * o.drip); line(ctx, dx, dy, dx, yy, d.r * .9, 'rgba(235,248,255,.55)'); }
    circle(ctx, dx, yy, d.r); fillStroke(ctx, P.drop, 2.4, P.dropLn); circle(ctx, dx - d.r * .3, yy - d.r * .35, d.r * .3); ctx.fillStyle = '#fff'; ctx.fill(); }
  if (o.ghostRed > 0) { ctx.save(); ctx.globalAlpha = o.ghostRed * .9; for (const [dx, dy] of [[-30, -60], [24, -110], [-8, -150], [36, -40]]) { circle(ctx, dx, dy, 10); fillStroke(ctx, P.syrup, 3); } ctx.restore(); }
  shape(); fillStroke(ctx, null, pl ? 5 : 6, pl ? '#4a7a96' : INK);
  if (pl) { line(ctx, -top, -Hh, top, -Hh, 9, '#4a7a96'); for (let k = 1; k < 4; k++) { const v = k / 4; line(ctx, -halfAt(v) + 4, -v * Hh, halfAt(v) - 4, -v * Hh, 2, 'rgba(74,122,150,.35)'); } }
  if (o.steam > 0) for (let i = 0; i < 3; i++) { const q = (t * .7 + i / 3) % 1; ctx.save(); ctx.globalAlpha = o.steam * (1 - q) * .85; ctx.beginPath(); const sx = -26 + i * 26; ctx.moveTo(sx, -Hh - 12 - q * 90); ctx.quadraticCurveTo(sx + 18, -Hh - 34 - q * 90, sx, -Hh - 60 - q * 90); ctx.lineWidth = 8; ctx.strokeStyle = '#ffffff'; ctx.stroke(); ctx.restore(); }
  ctx.restore();
  if (o.face) propFace(ctx, x, y - Hh * .5 * s, 74 * s, o.face, { t });
}
// ===== genangan di meja. k 0..1 =====
function drawGenangan(ctx, x, y, s, k) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU, r = (70 + 60 * k) * (1 + .14 * Math.sin(a * 3 + 1) + .08 * Math.sin(a * 5)); ctx.lineTo(Math.cos(a) * r * 1.25, Math.sin(a) * r * .22 + 6); } ctx.closePath();
  ctx.fillStyle = ETP.puddle; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(80,140,190,.55)'; ctx.stroke();
  ellipse(ctx, -30 * k - 20, 0, 26 * k + 6, 4); ctx.fillStyle = ETP.puddleHi; ctx.fill(); ctx.restore();
}
// ===== tatakan anyaman =====
function drawTatakan(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, 4, 96, 18); fillStroke(ctx, ETP.coaster, 6); ellipse(ctx, 0, 4, 70, 12); ctx.lineWidth = 3; ctx.strokeStyle = ETP.coasterDk; ctx.stroke(); ellipse(ctx, 0, 4, 44, 7); ctx.stroke(); ctx.restore();
}
// ===== partikel uap air berwajah (dunia mikro). o: { a (alpha), face, t, shiver } =====
function drawUap(ctx, x, y, r, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; const sh = (o.shiver || 0) * Math.sin((o.t || 0) * 70) * r * .06;
  ctx.translate(x + sh, y); ctx.beginPath(); for (let i = 0; i <= 10; i++) { const ang = i / 10 * TAU, rr = r * (1 + .1 * Math.sin(ang * 4 + (o.t || 0) * 3)); ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr); } ctx.closePath();
  ctx.fillStyle = o.shiver > .3 ? 'rgba(200,232,255,.92)' : ETP.vapor; ctx.fill(); ctx.setLineDash([r * .3, r * .2]); ctx.lineWidth = Math.max(2, r * .08); ctx.strokeStyle = ETP.vaporLn; ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  if (o.face) propFace(ctx, x + sh, y, r * 1.15, o.face, { t: o.t || 0, alpha: a });
}
// ===== titik air (embun) berwajah, menempel. (x,y) = dasar =====
function drawTitikAir(ctx, x, y, r, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.moveTo(0, -r * 1.9); ctx.quadraticCurveTo(r * 1.15, -r * .4, r * .95, -r * .1); ctx.arc(0, -r * .1, r * .95, 0, Math.PI); ctx.quadraticCurveTo(-r * 1.15, -r * .4, 0, -r * 1.9); ctx.closePath();
  ctx.fillStyle = 'rgba(225,245,255,.95)'; ctx.fill(); ctx.lineWidth = Math.max(3, r * .1); ctx.strokeStyle = ETP.dropLn; ctx.stroke(); ellipse(ctx, -r * .35, -r * .7, r * .2, r * .32, -.4); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  if (o.face) propFace(ctx, x, y - r * .55, r * 1.1, o.face, { t: o.t || 0 });
}
// ===== dunia mikro: dinding gelas (kiri) + udara (kanan). o: { hot 0..1 } =====
function dindingBG(ctx, t, o = {}) {
  const P = ETP, hot = o.hot || 0, wx = 400;
  const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, P.air2); g.addColorStop(1, P.air1); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // dinding gelas (tebal, sisi luar di x = wx)
  const g2 = ctx.createLinearGradient(0, 0, wx, 0); g2.addColorStop(0, mixC(P.coldWall2, P.hotWall2, hot)); g2.addColorStop(1, mixC(P.coldWall1, P.hotWall1, hot)); ctx.fillStyle = g2;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(wx, 0); for (let y = 0; y <= H; y += 40) ctx.lineTo(wx + Math.sin(y * .01) * 6, y); ctx.lineTo(0, H); ctx.closePath(); ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.beginPath(); for (let y = 0; y <= H; y += 40) ctx.lineTo(wx + Math.sin(y * .01) * 6, y); ctx.stroke();
  // isi di balik kaca: es batu atau uap panas
  if (hot < .5) { for (const [x, y, a] of [[120, 420, .2], [230, 900, -.3], [110, 1500, .5]]) { ctx.save(); ctx.translate(x, y + Math.sin(t + x) * 8); ctx.rotate(a); rrect(ctx, -90, -80, 180, 160, 26); fillStroke(ctx, 'rgba(240,252,255,.8)', 8, P.iceLn); ctx.restore(); }
    ctx.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 26; i++) { circle(ctx, wx - 14 - (i * 37) % 40, 60 + (i * 173) % 1800, 4); ctx.fill(); } }
  else { for (let i = 0; i < 5; i++) { const q = (t * .5 + i / 5) % 1; ctx.save(); ctx.globalAlpha = .5 * (1 - q); ctx.beginPath(); ctx.moveTo(80 + i * 60, 1700 - q * 1500); ctx.quadraticCurveTo(140 + i * 60, 1600 - q * 1500, 80 + i * 60, 1500 - q * 1500); ctx.lineWidth = 16; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore(); } }
  text(ctx, hot < .5 ? 'GELAS DINGIN' : 'GELAS PANAS', wx / 2, 1660, 50, '#fff', INK, 9); text(ctx, 'UDARA', wx + 340, 1660, 50, '#fff', INK, 9);
}
// ===== rumput berembun pagi (layar penuh) =====
function rumputBG(ctx, t, k) {
  const P = ETP, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, P.sky1); g.addColorStop(.55, P.sky2); g.addColorStop(.56, P.grassDk); g.addColorStop(1, P.grass); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  circle(ctx, 780, 780 - k * 120, 120); fillStroke(ctx, P.sun, 8); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .2; line(ctx, 780 + Math.cos(a) * 150, 780 - k * 120 + Math.sin(a) * 150, 780 + Math.cos(a) * 200, 780 - k * 120 + Math.sin(a) * 200, 9, P.sun); }
  const r = rng(12);
  for (let i = 0; i < 34; i++) { const x = r() * 1180 - 50, h = 380 + r() * 420, bend = (r() - .5) * 120 + Math.sin(t * 1.3 + i) * 12, y0 = 1930;
    ctx.beginPath(); ctx.moveTo(x - 26, y0); ctx.quadraticCurveTo(x + bend * .4, y0 - h * .6, x + bend, y0 - h); ctx.quadraticCurveTo(x + bend * .4 + 8, y0 - h * .55, x + 26, y0); ctx.closePath(); fillStroke(ctx, i % 3 ? P.grass : P.grassDk, 6);
    if (i % 2 === 0) { const q = .55 + r() * .3; drawTitikAir(ctx, x + bend * q * .8, y0 - h * q + 4, 13 + r() * 8); } }
}
// ===== pengukur kelembapan (dial). k 0..1 =====
function drawHigrometer(ctx, x, y, s, k) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); circle(ctx, 0, 0, 150); fillStroke(ctx, '#fffaf0', 10);
  for (let i = 0; i <= 10; i++) { const a = Math.PI * (.8 + i * .14); line(ctx, Math.cos(a) * 110, Math.sin(a) * 110, Math.cos(a) * 130, Math.sin(a) * 130, i % 5 ? 4 : 8); }
  ctx.beginPath(); ctx.arc(0, 0, 120, Math.PI * .8, Math.PI * (.8 + 1.4 * k)); ctx.lineWidth = 16; ctx.strokeStyle = mixC('#9fd8ff', '#2f6fd1', k); ctx.stroke();
  const a = Math.PI * (.8 + 1.4 * k); line(ctx, 0, 0, Math.cos(a) * 100, Math.sin(a) * 100, 10, '#e5262a'); circle(ctx, 0, 0, 16); fillStroke(ctx, INK, 4);
  text(ctx, 'LEMBAP', 0, 90, 38, INK, null, 0); drawTitikAir(ctx, 0, 52, 14);
  ctx.restore();
}
// ===== kaca pembesar: isi lingkaran digambar lewat callback (koordinat lokal, pusat 0,0) =====
function drawKacaPembesar(ctx, x, y, r, draw) {
  ctx.save(); ctx.translate(x, y); ctx.save(); ctx.rotate(.7); rrect(ctx, r * .9, -18, r * .9, 36, 16); fillStroke(ctx, '#6b4423', 7); ctx.restore();
  ctx.save(); circle(ctx, 0, 0, r); ctx.clip(); ctx.fillStyle = '#ffffff'; ctx.fillRect(-r, -r, r * 2, r * 2); draw(ctx); ctx.restore();
  circle(ctx, 0, 0, r); ctx.lineWidth = 18; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 10; ctx.strokeStyle = '#c9ccd6'; ctx.stroke();
  ctx.restore();
}
