// ---------- Fakta Unik: listrik rumah (ruang tamu, charger, stopkontak, magic com, alat ukur, uang, isi charger) ----------
// Aturan v6 (konsistensi): SATU fungsi per aset + palet terkunci LISTRIK. Jangan menggambar ulang aset ini di shots.js;
// kalau butuh variasi, tambah opsi di fungsi asetnya. Latar ruang tamu = ruangScene(), dapur + meja = dapurBack()/dapurMeja().
const LISTRIK = {
  wallTop: '#d6ecf7', wallBot: '#b4d7ee', panel: '#eef5f9', panelLine: '#c3d9e6', skirt: '#fbf7ee',
  plate: '#f7f4ee', plateSh: '#d8d5cc', chg: '#fdfcf8', chgSh: '#d5dbe8', kw: '#eadb9c', kwSh: '#c9b674',
  bolt: '#ffd23a', cook: '#f6f2ea', cookSh: '#d9d2c6', lid: '#e8453c', lidSh: '#b92f2a', warm: '#ff9a2e',
  note: '#5fbf78', noteDk: '#2f8a4c', coin: '#ffd23a', coinDk: '#d99a1c',
  pcb: '#1f7a55', pcbDk: '#145a40', trace: '#58c98f', chip: '#d7deea', gauge: '#27324d', gaugeFace: '#fffbe8',
  table: '#d9a56b', tableFront: '#2bb5ae',
};
const RUANG = { wallY: 1330, ground: 1560, outlet: [700, 1040], cal: [1010, 600] };   // tata letak ruang tamu (terkunci)
const DAPUR = { top: 1330, back: 1500, cook: [480, 1330], gauge: [815, 1199], gaugeS: .85, strip: [1060, 1330], clock: [800, 760] }; // tata letak dapur (terkunci)

// ===== RUANG TAMU: dinding + panel + pigura + kalender + stopkontak + lantai (semua di depth 1, dinding datar) =====
function ruangScene(ctx, t, cam, o = {}) {
  const P = LISTRIK, RF = RUANG.wallY; applyCam(ctx, cam, 1);
  const g = ctx.createLinearGradient(0, -400, 0, RF); g.addColorStop(0, P.wallTop); g.addColorStop(1, P.wallBot);
  ctx.fillStyle = g; ctx.fillRect(-2600, -2600, 6400, 2600 + RF);
  ctx.fillStyle = 'rgba(255,255,255,.17)'; for (let x = -2550; x < 3700; x += 150) ctx.fillRect(x, -2600, 60, 2600 + 870);
  ctx.fillStyle = P.panel; ctx.fillRect(-2600, 880, 6400, RF - 880);
  for (let x = -2580; x < 3700; x += 300) { rrect(ctx, x + 24, 934, 252, RF - 934 - 76, 12); ctx.lineWidth = 5; ctx.strokeStyle = P.panelLine; ctx.stroke(); }
  rrect(ctx, -2600, 864, 6400, 30, 0); fillStroke(ctx, P.skirt, 6);
  rrect(ctx, -2600, RF - 48, 6400, 48, 0); fillStroke(ctx, P.skirt, 6);
  // pigura
  ctx.save(); ctx.translate(60, 500); line(ctx, 0, -150, 0, -96, 4, '#8a5a34');
  rrect(ctx, -130, -96, 260, 192, 10); fillStroke(ctx, '#c68a55', 8); rrect(ctx, -106, -72, 212, 144, 4); fillStroke(ctx, '#9ad6f5', 5);
  ctx.save(); rrect(ctx, -106, -72, 212, 144, 4); ctx.clip(); circle(ctx, 56, -22, 26); ctx.fillStyle = '#fff3a8'; ctx.fill();
  path(ctx, [[-120, 80], [-40, -10], [20, 50], [60, 14], [130, 80]]); ctx.fillStyle = '#6bc46d'; ctx.fill(); ctx.restore(); ctx.restore();
  drawWallCalendar(ctx, RUANG.cal[0], RUANG.cal[1], 1, { month: o.month || 'JAN', sq: o.sq || 0 });
  drawOutlet(ctx, RUANG.outlet[0], RUANG.outlet[1], 1.32);
  drawDeckFloor(ctx, RF, 540, -1100, -2600, 3800, 3600, 0);
}
function drawWallCalendar(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(ctx, 0, -150, 9); fillStroke(ctx, '#8a5a34', 4); line(ctx, -40, -128, 0, -150, 4, '#8a5a34'); line(ctx, 40, -128, 0, -150, 4, '#8a5a34');
  rrect(ctx, -112, -130, 224, 262, 14); fillStroke(ctx, '#fffdf6', 7);
  ctx.save(); rrect(ctx, -112, -130, 224, 262, 14); ctx.clip(); ctx.fillStyle = '#e8453c'; ctx.fillRect(-112, -130, 224, 78); ctx.restore();
  ctx.save(); ctx.translate(0, -90); ctx.scale(1, 1 - .75 * (o.sq || 0)); text(ctx, o.month || 'JAN', 0, 3, 50, '#fff', INK, 0); ctx.restore();
  ctx.fillStyle = '#c9cfdd'; for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { rrect(ctx, -92 + c * 32, -32 + r * 38, 22, 22, 5); ctx.fill(); }
  rrect(ctx, -112, -130, 224, 262, 14); fillStroke(ctx, null, 7);
  ctx.restore();
}
function drawOutlet(ctx, x, y, s = 1) {
  const P = LISTRIK; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const pl = () => rrect(ctx, -108, -108, 216, 216, 28);
  pl(); ctx.fillStyle = P.plate; ctx.fill(); shadeShape(ctx, pl, 1, .12, .3, [-108, -108, 216, 216]); pl(); fillStroke(ctx, null, 7);
  circle(ctx, 0, 0, 70); fillStroke(ctx, '#e7e2d7', 6);
  rrect(ctx, -10, -74, 20, 18, 4); fillStroke(ctx, '#b9bcc6', 4); rrect(ctx, -10, 56, 20, 18, 4); fillStroke(ctx, '#b9bcc6', 4);
  circle(ctx, -27, 0, 11); ctx.fillStyle = INK; ctx.fill(); circle(ctx, 27, 0, 11); ctx.fill();
  ctx.restore();
}
// Charger (kepala adaptor) tampak depan. (x,y) = pusat stopkontak tempat ia menancap.
// o: { t, face, kw (versi murahan), hot 0..1, out 0..1 (dicabut: pin terlihat), rot, cable:false, cableEnd:[wx,wy], label, tag (label harga 0..1) }
function drawCharger(ctx, x, y, s = 1, o = {}) {
  const P = LISTRIK, t = o.t || 0, col = o.kw ? P.kw : P.chg, sh = o.kw ? P.kwSh : P.chgSh;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.cable !== false) {
    const e = o.cableEnd ? [(o.cableEnd[0] - x) / s, (o.cableEnd[1] - y) / s] : [12 + Math.sin(t * 1.6) * 16, 330];
    ctx.beginPath(); ctx.moveTo(0, 124); ctx.bezierCurveTo(0, 250, e[0] * .35, e[1] + 60, e[0], e[1]);
    ctx.lineCap = 'round'; ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = '#f4f1ea'; ctx.stroke();
    ctx.save(); ctx.translate(e[0], e[1]); ctx.rotate(o.tipRot == null ? (o.cableEnd ? -1.1 : Math.sin(t * 1.6) * .12) : o.tipRot);
    rrect(ctx, -14, -6, 28, 46, 7); fillStroke(ctx, '#e9edf5', 5); rrect(ctx, -9, 38, 18, 22, 3); fillStroke(ctx, '#b9bcc6', 4); ctx.restore();
  }
  ctx.rotate(o.rot || 0);
  if (o.out > 0) for (const sx of [-27, 27]) { rrect(ctx, sx - 8, -122 - 50 * clamp(o.out), 16, 66, 5); fillStroke(ctx, '#c9ccd6', 5); }
  const body = () => rrect(ctx, -100, -122, 200, 246, 36);
  body(); ctx.fillStyle = col; ctx.fill(); shadeShape(ctx, body, 1, .15, .3, [-100, -122, 200, 246]);
  if (o.hot > 0) { ctx.save(); body(); ctx.clip(); ctx.fillStyle = `rgba(255,70,30,${.6 * clamp(o.hot)})`; ctx.fillRect(-110, -130, 220, 260); ctx.restore(); }
  body(); fillStroke(ctx, null, 8);
  ctx.fillStyle = 'rgba(255,255,255,.7)'; rrect(ctx, -78, -104, 16, 60, 8); ctx.fill();
  rrect(ctx, -24, 98, 48, 13, 5); ctx.fillStyle = INK; ctx.fill();
  if (o.label) text(ctx, o.label, 0, -92, 30, '#a5822a', INK, 0);
  if (o.face) propFace(ctx, 0, -8, 150, o.face, { t });
  if (o.tag > 0) { // label harga menggantung (murahan)
    const k = backOut(clamp(o.tag)); ctx.save(); ctx.translate(96, 60); ctx.rotate(.5 + Math.sin(t * 5) * .08); ctx.scale(k, k);
    line(ctx, 0, 0, 34, 40, 4, '#8a5a34'); path(ctx, [[20, 40], [60, 20], [210, 20], [210, 104], [60, 104], [20, 84]]); fillStroke(ctx, '#fff3c4', 6);
    circle(ctx, 46, 62, 7); ctx.fillStyle = INK; ctx.fill(); text(ctx, 'Rp5.000', 132, 64, 34, '#e5262a', INK, 0); ctx.restore();
  }
  ctx.restore();
}
function drawBolt(ctx, x, y, s, rot = 0, a = 1, plain = false) {   // plain: tanpa garis tinta (untuk tumpukan banyak petir)
  if (a <= 0 || s <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  path(ctx, [[.12, -1], [-.56, .1], [-.1, .1], [-.3, 1], [.56, -.24], [.08, -.24], [.42, -1]]); if (plain) fillStroke(ctx, LISTRIK.bolt, .09, '#b9860f'); else fillStroke(ctx, LISTRIK.bolt, .15); ctx.restore();
}
// Siluet HP putus-putus ("tanpa HP"). k 0..1 muncul, x1 0..1 coretan.
function drawPhoneGhost(ctx, x, y, s, rot, k, x1 = 0) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const sc = s * backOut(clamp(k)); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(k * 4);
  rrect(ctx, -62, -118, 124, 236, 22); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill(); ctx.setLineDash([18, 13]); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.setLineDash([]);
  text(ctx, 'HP', 0, -6, 56, 'rgba(34,28,34,.55)', INK, 0);
  if (x1 > 0) { const q = clamp(x1); line(ctx, -78, -110, -78 + 156 * q, -110 + 220 * q, 15, '#e5262a'); }
  ctx.restore();
}
// Alat ukur watt analog. (x,y) = pusat kotak. o: { v 0..1 jarum, label 'teks layar' }. Pusat jarum = (x, y + 40*s).
function drawGauge(ctx, x, y, s = 1, o = {}) {
  const P = LISTRIK; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const bx = () => rrect(ctx, -150, -145, 300, 290, 30);
  bx(); ctx.fillStyle = P.gauge; ctx.fill(); shadeShape(ctx, bx, 1, .25, .25, [-150, -145, 300, 290]); bx(); fillStroke(ctx, null, 8);
  text(ctx, 'WATT', 0, -116, 26, '#fff', INK, 0);
  ctx.beginPath(); ctx.arc(0, 40, 122, Math.PI, TAU); ctx.closePath(); fillStroke(ctx, P.gaugeFace, 6);
  for (const [a0, a1, c] of [[0, .45, '#6bc46d'], [.45, .75, '#ffd23a'], [.75, 1, '#e8453c']]) { ctx.beginPath(); ctx.arc(0, 40, 104, Math.PI + a0 * Math.PI, Math.PI + a1 * Math.PI); ctx.lineWidth = 16; ctx.strokeStyle = c; ctx.lineCap = 'butt'; ctx.stroke(); }
  for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI; line(ctx, Math.cos(a) * 84, 40 + Math.sin(a) * 84, Math.cos(a) * 70, 40 + Math.sin(a) * 70, 4); }
  const a = Math.PI + clamp(o.v || 0, -.03, 1.03) * Math.PI; line(ctx, 0, 40, Math.cos(a) * 96, 40 + Math.sin(a) * 96, 9, '#e5262a'); circle(ctx, 0, 40, 13); fillStroke(ctx, INK, 0);
  rrect(ctx, -118, 58, 236, 76, 14); fillStroke(ctx, '#0d1524', 5); text(ctx, o.label || '-- W', 0, 98, 56, '#7dffa8', INK, 0);
  ctx.restore();
}
// Magic com berwajah. (x,y) = tengah dasar. o: { t, face, warm 0..1 (lampu), lid 0..1 (terbuka = "mulut"), steam 0..1, rice true }
// Lampu WARM ada di (x + 30*s, y - 100*s).
function drawRiceCooker(ctx, x, y, s = 1, o = {}) {
  const P = LISTRIK, t = o.t || 0, lid = clamp(o.lid || 0); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 210, 20); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  for (const sx of [-1, 1]) { rrect(ctx, sx * 196 - 26, -246, 52, 34, 14); fillStroke(ctx, P.cookSh, 6); }
  if (lid > .03) { ellipse(ctx, 0, -300, 176, 30); fillStroke(ctx, '#3a2a22', 6); if (o.rice) { ctx.save(); ellipse(ctx, 0, -300, 176, 30); ctx.clip(); ellipse(ctx, 0, -292, 150, 26); ctx.fillStyle = '#fffdf2'; ctx.fill(); ctx.restore(); } }
  const body = () => { ctx.beginPath(); ctx.moveTo(-190, -300); ctx.lineTo(190, -300); ctx.lineTo(200, -70); ctx.quadraticCurveTo(200, 0, 130, 0); ctx.lineTo(-130, 0); ctx.quadraticCurveTo(-200, 0, -200, -70); ctx.closePath(); };
  body(); ctx.fillStyle = P.cook; ctx.fill(); shadeShape(ctx, body, 1, .14, .3, [-200, -300, 400, 300]); body(); fillStroke(ctx, null, 8);
  // tutup (engsel kanan belakang), membuka seperti mulut
  ctx.save(); ctx.translate(186, -300); ctx.rotate(lid * .62); ctx.translate(-186, 300);
  const lp = () => { ctx.beginPath(); ctx.moveTo(-196, -296); ctx.quadraticCurveTo(-190, -400, 0, -404); ctx.quadraticCurveTo(190, -400, 196, -296); ctx.closePath(); };
  lp(); ctx.fillStyle = P.lid; ctx.fill(); shadeShape(ctx, lp, 1, .2, .3, [-196, -404, 392, 108]); lp(); fillStroke(ctx, null, 8);
  rrect(ctx, -52, -428, 104, 30, 14); fillStroke(ctx, P.lidSh, 6); ctx.fillStyle = 'rgba(255,255,255,.35)'; rrect(ctx, -150, -372, 90, 16, 8); ctx.fill();
  ctx.restore();
  // panel: tuas + lampu COOK / WARM
  rrect(ctx, -78, -132, 156, 110, 18); fillStroke(ctx, '#e9e4d8', 6);
  circle(ctx, -30, -100, 14); fillStroke(ctx, '#7a2a2a', 4);
  const w = clamp(o.warm == null ? 1 : o.warm); circle(ctx, 30, -100, 14); fillStroke(ctx, lerpC('#6b4a1e', P.warm, w), 4);
  if (w > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(30, -100, 0, 30, -100, 60); gg.addColorStop(0, `rgba(255,170,60,${.75 * w * (.8 + .2 * Math.sin(t * 6))})`); gg.addColorStop(1, 'rgba(255,170,60,0)'); ctx.fillStyle = gg; ctx.fillRect(-30, -160, 120, 120); ctx.restore(); }
  text(ctx, 'COOK', -30, -72, 15, INK, INK, 0); text(ctx, 'WARM', 30, -72, 15, INK, INK, 0);
  rrect(ctx, -30, -56, 60, 24, 8); fillStroke(ctx, '#cfc8b8', 5);
  if (o.face) propFace(ctx, 0, -226, 150, o.face, { t });
  if (o.steam > 0) for (let i = 0; i < 3; i++) { const p = (t * .5 + i * .33) % 1; ctx.save(); ctx.globalAlpha *= (1 - p) * .7 * o.steam; ctx.beginPath(); for (let j = 0; j <= 10; j++) { const yy = -430 - p * 110 - j * 13, xx = -110 + i * 30 + Math.sin(t * 5 + j * .8 + i) * 10; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 11; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
// Terminal listrik (stopkontak sambungan) di atas meja. (x,y) = tengah dasar. Lubang colokan di (x - 30*s, y - 58*s).
function drawPowerStrip(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(118, -26); ctx.bezierCurveTo(200, -30, 230, 30, 330, 20); ctx.lineCap = 'round'; ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = '#f4f1ea'; ctx.stroke();
  const b = () => rrect(ctx, -124, -58, 248, 58, 14); b(); ctx.fillStyle = LISTRIK.plate; ctx.fill(); shadeShape(ctx, b, 1, .14, .3, [-124, -58, 248, 58]); b(); fillStroke(ctx, null, 7);
  for (const sx of [-30, 44]) { rrect(ctx, sx - 30, -66, 60, 14, 6); fillStroke(ctx, '#e7e2d7', 5); }
  rrect(ctx, -108, -44, 34, 28, 6); fillStroke(ctx, o.on === false ? '#7a2a2a' : '#ff4a3c', 5);
  ctx.restore();
}
// Colokan 2 pin (menghadap bawah). (x,y) = permukaan lubang. pins 0..1 = pin terlihat (sedang dicabut).
function drawPlug(ctx, x, y, s = 1, rot = 0, pins = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (pins > 0) for (const sx of [-15, 15]) { rrect(ctx, sx - 5, -4, 10, 30 * clamp(pins) + 4, 3); fillStroke(ctx, '#c9ccd6', 4); }
  rrect(ctx, -30, -66, 60, 66, 14); fillStroke(ctx, '#3d4358', 7); ctx.fillStyle = 'rgba(255,255,255,.18)'; rrect(ctx, -20, -56, 12, 40, 6); ctx.fill();
  ctx.restore();
}
// Kabel hitam melengkung dari a ke b (dunia) dengan lendutan sag.
function drawCord(ctx, a, b, sag = 60) {
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.bezierCurveTo(a[0] + (b[0] - a[0]) * .3, a[1] + sag, a[0] + (b[0] - a[0]) * .7, b[1] + sag * .2 - 40, b[0], b[1]);
  ctx.lineCap = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#4a5068'; ctx.stroke();
}
function drawNote(ctx, x, y, s, rot = 0, a = 1) {
  if (a <= 0) return; const P = LISTRIK; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -92, -48, 184, 96, 10); fillStroke(ctx, P.note, 6); rrect(ctx, -78, -34, 156, 68, 6); ctx.lineWidth = 4; ctx.strokeStyle = P.noteDk; ctx.stroke();
  circle(ctx, 0, 0, 26); fillStroke(ctx, '#bfeacb', 4, P.noteDk); text(ctx, 'Rp', 0, 2, 30, P.noteDk, INK, 0); ctx.restore();
}
function drawRpCoin(ctx, x, y, r, sx = 1, a = 1) {
  if (a <= 0 || r <= 0) return; const P = LISTRIK; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(Math.max(.08, Math.abs(sx)), 1);
  circle(ctx, 0, 0, r); fillStroke(ctx, P.coin, r * .12); circle(ctx, 0, 0, r * .74); ctx.lineWidth = r * .07; ctx.strokeStyle = P.coinDk; ctx.stroke();
  text(ctx, 'Rp', 0, r * .04, r * .7, P.coinDk, INK, 0); ctx.restore();
}
// Kertas tagihan listrik. (x,y) = pusat. o: { total: 'Rp ???', puff 0..1 (menggembung seperti balon) }
function drawBill(ctx, x, y, s, o = {}) {
  const pf = clamp(o.puff || 0); ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * (1 + pf * .1), s);
  const rad = 18 + pf * 70; const pp = () => rrect(ctx, -150, -190, 300, 380, rad);
  ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; pp(); ctx.fillStyle = '#fffdf6'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.save(); pp(); ctx.clip(); ctx.fillStyle = '#e8453c'; ctx.fillRect(-160, -190, 320, 84); if (pf > 0) { ctx.fillStyle = `rgba(255,255,255,${.5 * pf})`; ellipse(ctx, -70, -60, 46, 90, .5); ctx.fill(); } ctx.restore();
  text(ctx, 'TAGIHAN LISTRIK', 0, -146, 27, '#fff', INK, 0);
  ctx.fillStyle = '#c9cfdd'; [[-110, -76, 220], [-110, -44, 170], [-110, -12, 200]].forEach(([bx, by, bw]) => { rrect(ctx, bx, by, bw, 14, 7); ctx.fill(); });
  rrect(ctx, -126, 40, 252, 100, 14); fillStroke(ctx, '#fff3c4', 6); text(ctx, o.total || 'Rp ???', 0, 92, o.size || 44, '#e5262a', INK, 0);
  pp(); fillStroke(ctx, null, 8); ctx.restore();
}
function drawWallClock(ctx, x, y, r, hours = 7, fast = 0) {
  ctx.save(); ctx.translate(x, y); circle(ctx, 0, 0, r); fillStroke(ctx, '#27a5a0', r * .1); circle(ctx, 0, 0, r * .84); fillStroke(ctx, '#fffdf6', r * .04);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(ctx, Math.cos(a) * r * .66, Math.sin(a) * r * .66, Math.cos(a) * r * .76, Math.sin(a) * r * .76, i % 3 ? r * .035 : r * .07); }
  if (fast > 0) { circle(ctx, 0, 0, r * .62); ctx.fillStyle = `rgba(58,74,120,${.16 * fast})`; ctx.fill(); }
  const ha = hours / 12 * TAU - Math.PI / 2, ma = hours * TAU - Math.PI / 2;
  line(ctx, 0, 0, Math.cos(ha) * r * .42, Math.sin(ha) * r * .42, r * .1); if (fast < .5) line(ctx, 0, 0, Math.cos(ma) * r * .64, Math.sin(ma) * r * .64, r * .06, '#3a4a78');
  circle(ctx, 0, 0, r * .08); fillStroke(ctx, '#e8453c', r * .03); ctx.restore();
}
// ===== DAPUR: latar (kitchenBG + jam dinding) lalu meja depan. Urutan: dapurBack -> tokoh -> dapurMeja -> benda di meja =====
function dapurBack(ctx, t, cam, o = {}) {
  kitchenBG(ctx, t, cam, o); drawWallClock(ctx, DAPUR.clock[0], DAPUR.clock[1], 110, o.jam == null ? 7 : o.jam, o.fast || 0);
}
function dapurMeja(ctx) {
  const P = LISTRIK, y = DAPUR.top; rrect(ctx, -1400, y, 3900, 60, 14); fillStroke(ctx, P.table, 8);
  ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(-1390, y + 8, 3880, 8);
  rrect(ctx, -1380, y + 56, 3860, 1500, 0); fillStroke(ctx, P.tableFront, 8); ctx.fillStyle = 'rgba(0,60,70,.16)'; ctx.fillRect(-1370, y + 62, 3840, 14);
  for (let x = -1340; x < 2400; x += 420) { rrect(ctx, x, y + 110, 380, 520, 18); fillStroke(ctx, '#34c0b9', 6); rrect(ctx, x + 150, y + 140, 80, 18, 9); fillStroke(ctx, '#f3f0e6', 4); }
}
// Sorot senter (koordinat LAYAR): gelap di luar lingkaran.
function spotlight(ctx, sx, sy, r, a) {
  if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(sx, sy, r, 0, TAU, true); ctx.fillStyle = `rgba(14,10,34,${.8 * a})`; ctx.fill('evenodd');
  const g = ctx.createRadialGradient(sx, sy, r * .62, sx, sy, r); g.addColorStop(0, 'rgba(14,10,34,0)'); g.addColorStop(1, `rgba(14,10,34,${.8 * a})`);
  ctx.beginPath(); ctx.arc(sx, sy, r + 1, 0, TAU); ctx.fillStyle = g; ctx.fill();
  ctx.beginPath(); ctx.arc(sx, sy, r, 0, TAU); ctx.lineWidth = 6; ctx.strokeStyle = `rgba(255,240,170,${.35 * a})`; ctx.stroke(); ctx.restore();
}
// ===== ISI CHARGER: papan rangkaian + komponen =====
function pcbBG(ctx, t) {
  const P = LISTRIK; const g = ctx.createLinearGradient(0, -200, 0, 2200); g.addColorStop(0, P.pcb); g.addColorStop(1, P.pcbDk); ctx.fillStyle = g; ctx.fillRect(-2600, -2600, 6400, 6400);
  ctx.strokeStyle = 'rgba(88,201,143,.5)'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const tr = [[[-600, 420], [180, 420], [300, 540], [300, 700]], [[1700, 520], [1010, 520], [900, 630], [760, 630]], [[840, 1500], [840, 1240], [720, 1120], [720, 1010]], [[-600, 1560], [240, 1560], [360, 1440], [900, 1440], [1000, 1540], [1700, 1540]], [[1700, 880], [1180, 880], [1100, 800], [760, 800]], [[420, -400], [420, 240], [520, 340], [520, 700]], [[-600, 760], [-100, 760], [0, 660], [180, 660]]];
  tr.forEach(p => { path(ctx, p, false); ctx.stroke(); const e = p[p.length - 1]; circle(ctx, e[0], e[1], 17); ctx.fillStyle = '#d8b24a'; ctx.fill(); circle(ctx, e[0], e[1], 7); ctx.fillStyle = P.pcbDk; ctx.fill(); });
  ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '700 26px Poppins'; ctx.textAlign = 'left'; ctx.fillText('R1', 250, 500); ctx.fillText('C2', 930, 590); ctx.fillText('D4', 880, 1210);
  [[250, 520, 0], [930, 610, .0], [880, 1230, 0]].forEach(([x, y]) => { rrect(ctx, x, y, 70, 30, 6); fillStroke(ctx, '#3a2f2a', 5); ctx.fillStyle = '#c9ccd6'; ctx.fillRect(x - 3, y + 4, 12, 22); ctx.fillRect(x + 61, y + 4, 12, 22); });
}
// IC berwajah. (x,y) = pusat. o: { t, face, label }
function drawChip(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 6; i++) for (const sy of [-1, 1]) { rrect(ctx, -132 + i * 46, sy > 0 ? 112 : -150, 28, 38, 6); fillStroke(ctx, '#c9ccd6', 5); }
  const b = () => rrect(ctx, -170, -120, 340, 240, 22); b(); ctx.fillStyle = LISTRIK.chip; ctx.fill(); shadeShape(ctx, b, 1, .16, .3, [-170, -120, 340, 240]); b(); fillStroke(ctx, null, 8);
  circle(ctx, -138, -90, 10); ctx.fillStyle = 'rgba(34,28,34,.35)'; ctx.fill(); text(ctx, o.label || 'IC', 118, -88, 28, 'rgba(34,28,34,.5)', INK, 0);
  if (o.face) propFace(ctx, 0, -6, 190, o.face, { t: o.t || 0 });
  ctx.restore();
}
// Kapasitor berdiri (tidur). (x,y) = tengah dasar.
function drawCap(ctx, x, y, s, t = 0, ph = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s * (1 + Math.sin(t * 1.5 + ph) * .02));
  const b = () => rrect(ctx, -52, -190, 104, 190, 20); b(); ctx.fillStyle = '#4a8cff'; ctx.fill(); shadeShape(ctx, b, 1, .2, .32, [-52, -190, 104, 190]); ctx.save(); b(); ctx.clip(); ctx.fillStyle = '#dfe9ff'; ctx.fillRect(-60, -190, 34, 190); ctx.restore(); b(); fillStroke(ctx, null, 7);
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 20 + 6, -96, 13, .15 * Math.PI, .85 * Math.PI); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); }
  ctx.restore();
}
function drawZzz(ctx, x, y, s, t) {
  for (let i = 0; i < 3; i++) { const p = (t * .45 + i / 3) % 1; ctx.save(); ctx.globalAlpha *= Math.sin(p * Math.PI); text(ctx, 'Z', x + p * 90 * s + Math.sin(p * 6) * 10 * s, y - p * 170 * s, (34 + p * 50) * s, '#fff', INK, 9 * s); ctx.restore(); }
}
function drawLed(ctx, x, y, r, on, label) {
  circle(ctx, x, y, r); fillStroke(ctx, on ? '#7dff8a' : '#2f6b3c', r * .22);
  if (on) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4); g.addColorStop(0, 'rgba(120,255,140,.6)'); g.addColorStop(1, 'rgba(120,255,140,0)'); ctx.fillStyle = g; ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8); ctx.restore(); }
  if (label) text(ctx, label, x, y + r * 2.3, r * 1.15, 'rgba(255,255,255,.85)', INK, 0);
}
// Mangkuk nasi. (x,y) = tengah dasar. fill 0..1 = gundukan nasi.
function drawBowl(ctx, x, y, s = 1, fill = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (fill > 0) { ellipse(ctx, 0, -84, 70 * clamp(fill), 46 * clamp(fill)); fillStroke(ctx, '#fffdf2', 6); }
  ctx.beginPath(); ctx.moveTo(-96, -84); ctx.lineTo(96, -84); ctx.quadraticCurveTo(84, -8, 34, -8); ctx.lineTo(-34, -8); ctx.quadraticCurveTo(-84, -8, -96, -84); ctx.closePath(); fillStroke(ctx, '#4a8cff', 7);
  ctx.fillStyle = 'rgba(255,255,255,.4)'; rrect(ctx, -70, -70, 44, 12, 6); ctx.fill(); rrect(ctx, -34, -10, 68, 12, 5); fillStroke(ctx, '#3a6fd0', 6);
  ctx.restore();
}
