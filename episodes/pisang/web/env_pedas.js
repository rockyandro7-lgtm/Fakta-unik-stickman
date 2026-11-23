// ---------- Aset episode "Kepedasan: air nggak mempan, susu ampuh" (21-11-2026) ----------
// Aturan v6: satu fungsi per benda, palet PDP terkunci, tata letak PD terkunci. Latar datar satu skala (v7).
const PDP = {
  wallTop: '#ffcf86', wallBot: '#ffad62', slat: 'rgba(160,70,20,.10)', board: '#3a2a2a', boardEdge: '#8a5a34',
  table: '#c9763e', tableHi: '#e8955a', cloth: '#e5392f', clothLt: '#fff4e6', floor: '#7a4a32',
  bowl: '#f6f1e8', bowlBand: '#2f9b5a', kuah: '#e2341f', kuahDk: '#a91f12', kuahHi: '#ff7a4a', kerupuk: '#ffe9a8', kerupukDk: '#e8c66e',
  ceker: '#f3c27a', chili: '#e5262a', chiliDk: '#9e1514', stem: '#3f9b4a',
  glass: 'rgba(225,245,255,.55)', glassEdge: '#8fb7cc', water: '#9fd8ff', waterDk: '#5fb4ea', ice: '#eefaff', milk: '#fffdf6', milkSh: '#e9e2d0',
  sleeve: '#ff8fb8', sleeveDk: '#d65a8a', straw: '#3fb6e8',
  fire1: '#ffd23a', fire2: '#ff8a1e', fire3: '#e5262a',
  phone: '#262a38', chatBg: '#efe6d8', chatHead: '#1f8f7a', bubble: '#ffffff', bubbleMe: '#d9f7c8',
  tongue: '#f28a9a', tongueDk: '#d8607a', tongueLt: '#ffb3c0', mouthDk: '#5a1622', nerve: '#ffe07a',
  caps: '#ff6a1e', capsDk: '#c4370a', capsHi: '#ffd08a', protein: '#fffdf6', proteinSh: '#e6dfcf',
  plate: '#f8f8f4', plateRim: '#dfe7ee', oil: '#ffb02e', oilDk: '#e07a10', paper: '#fffaf0', paperLn: '#c9d8ef',
};
// Tata letak warung (terkunci). Tokoh di belakang meja: y = 1500, s = 600 (kepala sekitar y 1041). Meja 1330.
const PD = { top: 1330, back: 1500, rani: 210, budi: 870, bowlR: [430, 1330], bowlB: [665, 1330], cupR: [318, 1330], glassB: [985, 1330], glass2: [1075, 1330], glass3: [1165, 1330],
  board: [540, 420], fan: [-300, 1500] };

// ===== latar warung (datar) =====
function warungBG(ctx, t, cam, o = {}) {
  const P = PDP, F = PD.top; applyCam(ctx, cam, 1);
  const g = ctx.createLinearGradient(0, -300, 0, F); g.addColorStop(0, P.wallTop); g.addColorStop(1, P.wallBot);
  ctx.fillStyle = g; ctx.fillRect(-2600, -2600, 6400, 2600 + F + 10);
  ctx.fillStyle = P.slat; for (let x = -2550; x < 3700; x += 150) ctx.fillRect(x, -2600, 8, 2600 + F);
  // lampu gantung untaian
  ctx.save(); ctx.beginPath(); ctx.moveTo(-900, 120); for (let x = -900; x <= 2000; x += 40) ctx.lineTo(x, 120 + 40 * Math.sin((x + 900) / 580 * Math.PI) ** 2); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  for (let i = 0, x = -860; x < 2000; x += 120, i++) { const y = 128 + 40 * Math.sin((x + 900) / 580 * Math.PI) ** 2, on = .65 + .35 * Math.sin(t * 3 + i * 1.7); circle(ctx, x, y + 18, 16); ctx.fillStyle = ['#ffd23a', '#ff6a5a', '#7fdcff', '#9dff7a'][i % 4]; ctx.globalAlpha = on; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.restore();
  // papan menu SEBLAK + level cabai
  const [bx, by] = PD.board;
  rrect(ctx, bx - 330, by - 170, 660, 380, 18); fillStroke(ctx, P.board, 10, P.boardEdge);
  rrect(ctx, bx - 330, by - 170, 660, 380, 18); fillStroke(ctx, null, 4);
  text(ctx, 'SEBLAK', bx, by - 95, 92, '#ffd23a', INK, 14);
  for (let l = 0; l <= 5; l++) { const yy = by - 15 + l * 0, xx = bx - 280 + l * 112; text(ctx, 'LV' + l, xx + 20, by + 10, 34, l === 5 ? '#ff6a5a' : '#fffaf0', INK, 6);
    for (let k = 0; k < Math.min(l, 3); k++) drawCabai(ctx, xx + 4 + k * 16, by + 70 + (k % 2) * 6, .36, -.6); if (l >= 4) drawCabai(ctx, xx + 52, by + 70, .36, -.6); if (l === 5) { ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(t * 5); burst(ctx, xx + 20, by + 140, 28, 8, '#ff6a1e', 4); ctx.restore(); } }
  // poster kecil & rak kerupuk
  ctx.save(); ctx.translate(-260, 600); ctx.rotate(-.05); rrect(ctx, -130, -150, 260, 300, 10); fillStroke(ctx, '#fffaf0', 7);
  text(ctx, 'LEVEL 5', 0, -90, 44, '#e5262a', INK, 7); text(ctx, '= NANGIS', 0, -35, 40, INK, null, 0); drawTear(ctx, -40, 60, 26); drawTear(ctx, 40, 60, 26); ctx.restore();
  ctx.save(); ctx.translate(1330, 700); rrect(ctx, -150, -230, 300, 460, 14); fillStroke(ctx, '#bfe6f8', 7); for (let j = 0; j < 4; j++) { rrect(ctx, -150, -230 + j * 115, 300, 10, 0); ctx.fillStyle = INK; ctx.fill();
    for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(-105 + i * 70, -170 + j * 115); ctx.rotate(i * .7 + j); kerupukBlob(ctx, 0, 0, 26, PDP.kerupuk); ctx.restore(); } } ctx.restore();
}
// Meja + taplak (digambar SETELAH tokoh supaya kaki tertutup).
function mejaWarung(ctx) {
  const P = PDP, F = PD.top;
  // meja dengan taplak kotak-kotak
  rrect(ctx, -2600, F, 6400, 46, 10); fillStroke(ctx, P.table, 8); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(-2590, F + 8, 6380, 7);
  ctx.save(); ctx.beginPath(); ctx.rect(-2600, F + 42, 6400, 2400); ctx.clip(); ctx.fillStyle = P.clothLt; ctx.fillRect(-2600, F + 42, 6400, 2400);
  ctx.fillStyle = 'rgba(229,57,47,.55)'; for (let x = -2600; x < 3800; x += 120) ctx.fillRect(x, F + 42, 60, 2400); for (let y = F + 42; y < F + 2400; y += 120) ctx.fillRect(-2600, y, 6400, 60);
  ctx.fillStyle = 'rgba(60,10,10,.18)'; ctx.fillRect(-2600, F + 42, 6400, 22); ctx.restore(); line(ctx, -2600, F + 42, 3800, F + 42, 7);
}
// ===== benda =====
function kerupukBlob(ctx, x, y, r, col) { ctx.beginPath(); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, rr = r * (.8 + .25 * Math.sin(i * 2.7)); i ? ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * .7) : ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr * .7); } ctx.closePath(); fillStroke(ctx, col, Math.max(2, r * .12)); }
// Cabai rawit. (x,y) = pusat, rot. o: { face, t, col }
function drawCabai(ctx, x, y, s = 1, rot = 0, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-40, -12); ctx.quadraticCurveTo(10, -22, 52, 4); ctx.quadraticCurveTo(14, 2, -40, 12); ctx.quadraticCurveTo(-50, 0, -40, -12); ctx.closePath(); fillStroke(ctx, o.col || PDP.chili, 5);
  ctx.fillStyle = 'rgba(255,255,255,.45)'; ellipse(ctx, -12, -8, 18, 3.5, -.1); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-42, -6); ctx.quadraticCurveTo(-58, -14, -60, -28); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = PDP.stem; ctx.stroke();
  ctx.restore();
  if (o.face) propFace(ctx, x, y, 34 * s, o.face, { t: o.t || 0, rot });
}
// Mangkuk seblak. (x,y) = tengah dasar. o: { fill 0..1, level (angka di mangkuk), steam 0..1, t, face, glow }
function drawSeblak(ctx, x, y, s = 1, o = {}) {
  const P = PDP, t = o.t || 0, fill = o.fill == null ? 1 : clamp(o.fill); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 4, 140, 14); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  if (o.glow) { ctx.save(); ctx.globalAlpha = clamp(o.glow) * (.5 + .3 * Math.sin(t * 8)); const g = ctx.createRadialGradient(0, -120, 20, 0, -120, 260); g.addColorStop(0, 'rgba(255,90,30,.7)'); g.addColorStop(1, 'rgba(255,90,30,0)'); ctx.fillStyle = g; ctx.fillRect(-300, -400, 600, 500); ctx.restore(); }
  ellipse(ctx, 0, -118, 150, 32); fillStroke(ctx, P.bowl, 7);
  ctx.save(); ellipse(ctx, 0, -116, 138, 25); ctx.clip();
  const ky = lerp(-80, -112, fill); ctx.fillStyle = P.kuahDk; ctx.fillRect(-150, -150, 300, 80); ctx.fillStyle = P.kuah; ctx.fillRect(-150, ky - 4, 300, 80);
  if (fill > .05) { const r = rng(9); for (let i = 0; i < Math.round(9 * fill); i++) { const px = (r() - .5) * 220, py = ky + 4 + (r() - .5) * 10;
      if (i % 3 === 0) drawCabai(ctx, px, py, .42, r() * 6); else if (i % 3 === 1) { ctx.save(); ctx.translate(px, py); ctx.rotate(r() * 3); kerupukBlob(ctx, 0, 0, 20, P.kerupuk); ctx.restore(); } else { ellipse(ctx, px, py, 16, 8, r()); fillStroke(ctx, P.ceker, 3); } }
    ctx.fillStyle = 'rgba(255,200,80,.6)'; for (let i = 0; i < 7; i++) { circle(ctx, -100 + i * 34, ky + 2 + (i % 2) * 6, 5 + (i % 3) * 2); ctx.fill(); } }
  ctx.restore();
  const b = () => { ctx.beginPath(); ctx.moveTo(-150, -118); ctx.quadraticCurveTo(-142, -4, -62, 0); ctx.lineTo(62, 0); ctx.quadraticCurveTo(142, -4, 150, -118); ctx.ellipse(0, -118, 150, 32, 0, 0, Math.PI, false); ctx.closePath(); };
  b(); ctx.fillStyle = P.bowl; ctx.fill(); ctx.save(); b(); ctx.clip(); ctx.fillStyle = P.bowlBand; ctx.fillRect(-160, -76, 320, 16); ctx.restore(); shadeShape(ctx, b, 1, .16, .3, [-150, -150, 300, 150]); b(); fillStroke(ctx, null, 7);
  if (o.level != null) { circle(ctx, 0, -40, 30); fillStroke(ctx, '#e5262a', 5); text(ctx, String(o.level), 0, -38, 40, '#fff', INK, 0); }
  ctx.restore();
  if (o.steam > 0) for (let i = 0; i < 3; i++) { const q = (t * .7 + i / 3) % 1; ctx.save(); ctx.globalAlpha = o.steam * Math.sin(q * Math.PI) * .8; ctx.beginPath(); const sx = x + (i - 1) * 70 * s; ctx.moveTo(sx, y - 150 * s - q * 160 * s);
    ctx.bezierCurveTo(sx + 30 * s, y - 190 * s - q * 160 * s, sx - 30 * s, y - 230 * s - q * 160 * s, sx, y - 270 * s - q * 160 * s); ctx.lineWidth = 12 * s; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  if (o.face) propFace(ctx, x + 70 * s, y - 40 * s, 70 * s, o.face, { t });
}
// Gelas. (x,y) = tengah dasar. o: { fill 0..1, liquid 'air'|'susu', ice, sleeve (gelas Rani), straw, rot, frost 0..1, face, t }
function drawGelas(ctx, x, y, s = 1, o = {}) {
  const P = PDP, t = o.t || 0, fill = clamp(o.fill == null ? 1 : o.fill), milk = o.liquid === 'susu';
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(s, s);
  if (!o.rot) { ellipse(ctx, 0, 3, 62, 9); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill(); }
  const shape = () => { ctx.beginPath(); ctx.moveTo(-58, -200); ctx.lineTo(58, -200); ctx.lineTo(46, 0); ctx.lineTo(-46, 0); ctx.closePath(); };
  if (o.straw) { ctx.save(); ctx.rotate(.18); rrect(ctx, 6, -290, 14, 230, 7); fillStroke(ctx, P.straw, 4); ctx.restore(); }
  shape(); ctx.fillStyle = P.glass; ctx.fill();
  if (fill > 0) { ctx.save(); shape(); ctx.clip(); const ly = lerp(-4, -186, fill), tilt = o.rot ? -o.rot : 0; ctx.save(); ctx.translate(0, ly); ctx.rotate(tilt); ctx.fillStyle = milk ? P.milk : P.water; ctx.fillRect(-200, 0, 400, 400); ctx.fillStyle = milk ? P.milkSh : P.waterDk; ctx.fillRect(-200, 0, 400, 10); ctx.restore();
    if (milk) { ctx.fillStyle = 'rgba(230,220,200,.5)'; ctx.fillRect(40, ly, 20, -ly); }
    if (o.ice && !milk) for (const [ix, iy, a] of [[-22, 30, .3], [18, 70, -.4], [-8, 115, .6]]) { if (ly + iy - 30 > -4) continue; ctx.save(); ctx.translate(ix, ly + iy - 14 + Math.sin(t * 2 + ix) * 2); ctx.rotate(a); rrect(ctx, -20, -16, 40, 32, 7); fillStroke(ctx, P.ice, 3, '#7fb6d8'); ctx.restore(); }
    ctx.restore(); }
  if (o.frost > 0) { ctx.save(); shape(); ctx.clip(); ctx.globalAlpha = o.frost * .55; ctx.fillStyle = '#ffffff'; for (let i = 0; i < 18; i++) { circle(ctx, -45 + (i * 37) % 90, -20 - (i * 53) % 170, 3 + (i % 3)); ctx.fill(); } ctx.restore(); }
  if (o.sleeve) { const sy = -168 + 172 * (1 - clamp(o.sleeve === true ? 1 : o.sleeve)); ctx.save(); shape(); ctx.clip(); ctx.translate(0, sy + 168); ctx.fillStyle = P.sleeve; ctx.fillRect(-70, -168, 140, 170); ctx.fillStyle = P.sleeveDk; for (let i = 0; i < 4; i++) { circle(ctx, -30 + (i % 2) * 50, -130 + i * 36, 9); ctx.fill(); } line(ctx, -56, -168, 56, -168, 5); ctx.restore(); }
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.moveTo(-44, -188); ctx.lineTo(-34, -188); ctx.lineTo(-30, -20); ctx.lineTo(-38, -20); ctx.closePath(); ctx.fill();
  shape(); fillStroke(ctx, null, 6, INK);
  ctx.restore();
  if (o.face) propFace(ctx, x, y - 95 * s, 70 * s, o.face, { t });
}
// Api kartun dari mulut. (x,y) = mulut (dunia), dir 1 = ke kanan, k 0..1 ukuran.
function drawApi(ctx, x, y, s, t, k, dir = 1, up = -.25) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(up);
  const L = 260 * s * k, Wd = 70 * s * k;
  for (const [c, sc, ph] of [[PDP.fire3, 1, 0], [PDP.fire2, .72, 1.3], [PDP.fire1, .45, 2.1]]) {
    ctx.beginPath(); ctx.moveTo(0, -Wd * .25 * sc);
    for (let i = 0; i <= 6; i++) { const q = i / 6, fl = Math.sin(t * 22 + i * 1.9 + ph) * .18; ctx.lineTo(L * sc * q * (1 + fl * .4), -Wd * sc * Math.sin(q * Math.PI) * (1 + fl) * (i % 2 ? 1.15 : .8)); }
    for (let i = 6; i >= 0; i--) { const q = i / 6, fl = Math.sin(t * 19 + i * 2.3 + ph) * .18; ctx.lineTo(L * sc * q * (1 + fl * .4), Wd * sc * Math.sin(q * Math.PI) * (1 + fl) * (i % 2 ? .8 : 1.1)); }
    ctx.closePath(); fillStroke(ctx, c, sc === 1 ? 6 : 0);
  }
  ctx.restore();
}
// HP grup keluarga. (x,y) = pusat. o: { photo (fn(ctx, r) gambar foto profil di lingkaran) , big 0..1 (foto profil membesar), chats [[nama, teks, dariSaya]], k (jumlah chat tampil), t }
function drawHPGrup(ctx, x, y, s = 1, o = {}) {
  const P = PDP; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -200, -390, 400, 780, 46); fillStroke(ctx, P.phone, 9);
  ctx.save(); rrect(ctx, -180, -360, 360, 720, 28); ctx.clip(); ctx.fillStyle = P.chatBg; ctx.fillRect(-200, -400, 400, 800);
  ctx.fillStyle = 'rgba(0,0,0,.05)'; for (let i = 0; i < 30; i++) { circle(ctx, -170 + (i * 67) % 340, -240 + (i * 113) % 600, 8); ctx.fill(); }
  ctx.fillStyle = P.chatHead; ctx.fillRect(-200, -360, 400, 120);
  const pr = 42; circle(ctx, -110, -300, pr); ctx.fillStyle = '#c8ccd6'; ctx.fill();
  ctx.save(); circle(ctx, -110, -300, pr); ctx.clip(); if (o.photo) { ctx.translate(-110, -300); o.photo(ctx, pr); } else { circle(ctx, -110, -312, 16); ctx.fillStyle = '#fff'; ctx.fill(); ellipse(ctx, -110, -268, 30, 20); ctx.fill(); } ctx.restore();
  circle(ctx, -110, -300, pr); ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.stroke();
  text(ctx, 'KELUARGA', 40, -318, 34, '#fff', null, 0, 'Poppins', 700, 'center'); text(ctx, 'BESAR', 40, -280, 28, 'rgba(255,255,255,.8)', null, 0, 'Poppins', 700, 'center');
  const ch = o.chats || [], n = o.k == null ? ch.length : o.k;
  ch.forEach(([nm, tx, me], i) => { const k = clamp(n - i); if (k <= 0) return; const yy = -180 + i * 120; ctx.save(); ctx.globalAlpha = k; const w = 300, bx = me ? 160 - w : -160; rrect(ctx, bx, yy, w, 92, 18); fillStroke(ctx, me ? P.bubbleMe : P.bubble, 4);
    text(ctx, nm, bx + 18, yy + 26, 22, '#1f8f7a', null, 0, 'Poppins', 700, 'left'); text(ctx, tx, bx + 18, yy + 62, 26, INK, null, 0, 'Poppins', 700, 'left'); ctx.restore(); });
  ctx.restore();
  rrect(ctx, -50, -378, 100, 12, 6); ctx.fillStyle = '#111'; ctx.fill();
  ctx.restore();
}
// Kertas aturan taruhan. (x,y) = pusat. lines: array teks. hi: indeks baris yang disorot (-1 = tidak ada), k 0..1 muncul.
function drawAturan(ctx, x, y, s, k, lines, o = {}) {
  if (k <= 0) return; const P = PDP; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || -.04); const sc = s * backOut(clamp(k)); ctx.scale(sc, sc);
  rrect(ctx, -260, -300, 520, 600, 14); fillStroke(ctx, P.paper, 8);
  for (let i = 0; i < 9; i++) line(ctx, -230, -170 + i * 60, 230, -170 + i * 60, 3, P.paperLn);
  text(ctx, 'ATURAN TARUHAN', 0, -235, 44, '#e5262a', INK, 0);
  lines.forEach((l, i) => text(ctx, l, -225, -130 + i * 100, 36, INK, null, 0, 'Poppins', 700, 'left'));
  if (o.missing > 0) { ctx.save(); ctx.globalAlpha = clamp(o.missing); text(ctx, 'MINUM: ?', -225, -130 + lines.length * 100, 36, '#2f63c9', null, 0, 'Poppins', 700, 'left'); ctx.restore(); }
  ctx.restore();
}
// Piring berminyak (analogi). (x,y) = pusat piring (tampak agak dari atas). o: { wash 0..1 (air disiram), stay 1 (minyak tetap), face, t }
const OILS = [[-90, -10, 46], [40, -30, 40], [100, 30, 30], [-20, 40, 36], [-140, 40, 22]];
function drawPiringMinyak(ctx, x, y, s = 1, o = {}) {
  const P = PDP, t = o.t || 0, wash = clamp(o.wash || 0); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 14, 300, 100); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  ellipse(ctx, 0, 0, 290, 110); fillStroke(ctx, P.plateRim, 7); ellipse(ctx, 0, 6, 200, 72); fillStroke(ctx, P.plate, 4);
  // air mengalir di atas piring: lapisan biru tipis + butir air yang menggelinding melewati minyak
  if (wash > 0) { ctx.save(); ellipse(ctx, 0, 0, 286, 106); ctx.clip(); ctx.globalAlpha = .45 * Math.sin(wash * Math.PI); ctx.fillStyle = P.water; ctx.fillRect(-300, -120, 600, 240); ctx.restore();
    for (let i = 0; i < 9; i++) { const q = (wash * 1.6 + i / 9) % 1; const bx = lerp(-260, 280, q), by = -60 + (i * 41) % 120; if (wash < 1) { circle(ctx, bx, by, 10 + (i % 3) * 4); fillStroke(ctx, P.water, 3); ctx.fillStyle = '#fff'; circle(ctx, bx - 3, by - 4, 3); ctx.fill(); } } }
  OILS.forEach(([ox, oy, r], i) => { ellipse(ctx, ox, oy, r, r * .42); fillStroke(ctx, P.oil, 4, P.oilDk); ctx.fillStyle = 'rgba(255,255,255,.7)'; ellipse(ctx, ox - r * .35, oy - r * .14, r * .25, r * .08); ctx.fill();
    ctx.save(); ctx.globalAlpha = .5; ctx.strokeStyle = '#a7e8ff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(ox + r * .1, oy + r * .05, r * .55, r * .2, 0, .3, 2.2); ctx.stroke(); ctx.restore(); });
  ctx.restore();
  if (o.face) propFace(ctx, x + OILS[0][0] * s, y + OILS[0][1] * s, 70 * s, o.face, { t });
}
// ===== DUNIA MIKRO: permukaan lidah (koordinat layar 1080x1920; pakai mcam dari env_jemur) =====
// Permukaan lidah di y sekitar 980; sensor panas tertanam di bawah permukaan; saraf turun ke bawah (ke otak).
const SENS = [[200, 1030], [540, 1010], [880, 1030]];
const SURF = x => 975 + 22 * Math.sin(x / 95) + 10 * Math.sin(x / 41 + 1);
function lidahBG(ctx, t, o = {}) {
  const P = PDP, hot = clamp(o.hot || 0);
  // rongga mulut (atas)
  const g = ctx.createLinearGradient(0, -200, 0, 1000); g.addColorStop(0, '#2a0a12'); g.addColorStop(1, mixC(P.mouthDk, '#a0201a', hot)); ctx.fillStyle = g; ctx.fillRect(-600, -800, 2300, 1900);
  // gigi samar di atas
  for (let i = -2; i < 9; i++) { rrect(ctx, i * 150 + 10, -80, 130, 200, 40); fillStroke(ctx, 'rgba(255,250,240,.85)', 6); }
  // badan lidah
  ctx.beginPath(); ctx.moveTo(-600, 3000); ctx.lineTo(-600, SURF(-600)); for (let x = -600; x <= 1700; x += 20) ctx.lineTo(x, SURF(x)); ctx.lineTo(1700, 3000); ctx.closePath();
  const tg = ctx.createLinearGradient(0, 960, 0, 2000); tg.addColorStop(0, mixC(P.tongue, '#ff5a4a', hot * .6)); tg.addColorStop(1, P.tongueDk); ctx.fillStyle = tg; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.stroke();
  // papila (benjolan kecil) di permukaan + bintik di dalam
  for (let x = -560; x < 1680; x += 64) { const y = SURF(x); circle(ctx, x, y + 4, 20); fillStroke(ctx, P.tongueLt, 4); }
  ctx.fillStyle = 'rgba(255,255,255,.12)'; for (let i = 0; i < 40; i++) { circle(ctx, (i * 173) % 1300 - 100, 1120 + (i * 97) % 800, 10 + (i % 4) * 4); ctx.fill(); }
  // saraf: garis dari tiap sensor turun ke bawah, denyut sinyal saat sensor menyala
  SENS.forEach(([sx, sy], i) => { const on = clamp((o.on || [])[i] == null ? hot : o.on[i]);
    ctx.beginPath(); ctx.moveTo(sx, sy + 30); ctx.bezierCurveTo(sx + 40, sy + 300, sx - 60, sy + 600, 540 + (i - 1) * 120, 2100); ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = mixC('#d9a8b8', P.nerve, on); ctx.stroke();
    if (on > .3) for (let k = 0; k < 3; k++) { const q = (t * 1.6 + k / 3 + i * .2) % 1; const bx = bez(sx, sx + 40, sx - 60, 540 + (i - 1) * 120, q), by = bez(sy + 30, sy + 300, sy + 600, 2100, q); circle(ctx, bx, by, 16 * on); fillStroke(ctx, '#fff7b0', 4); } });
}
const bez = (a, b, c, d, q) => (1 - q) ** 3 * a + 3 * (1 - q) ** 2 * q * b + 3 * (1 - q) * q * q * c + q ** 3 * d;
// Sensor panas (alarm) di lidah. (x,y) = pusat. o: { on 0..1, t, label }
function drawSensor(ctx, x, y, r, o = {}) {
  const on = clamp(o.on || 0), t = o.t || 0, blink = on > 0 ? .6 + .4 * Math.sin(t * 18) : 0;
  ctx.save(); ctx.translate(x, y);
  if (on > 0) { ctx.save(); ctx.globalAlpha = on * blink * .7; const g = ctx.createRadialGradient(0, -r * .3, r * .2, 0, -r * .3, r * 2.6); g.addColorStop(0, 'rgba(255,80,40,.9)'); g.addColorStop(1, 'rgba(255,80,40,0)'); ctx.fillStyle = g; ctx.fillRect(-r * 3, -r * 3, r * 6, r * 6); ctx.restore();
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .45 + Math.sin(t * 6) * .05; line(ctx, Math.cos(a) * r * 1.25, -r * .3 + Math.sin(a) * r * 1.25, Math.cos(a) * r * (1.6 + .2 * blink), -r * .3 + Math.sin(a) * r * (1.6 + .2 * blink), r * .12, `rgba(255,220,80,${on})`); } }
  rrect(ctx, -r * .9, 0, r * 1.8, r * .45, r * .12); fillStroke(ctx, '#8a8fa3', r * .1);
  ctx.beginPath(); ctx.arc(0, 0, r * .75, Math.PI, 0); ctx.closePath(); fillStroke(ctx, mixC('#c9a8b0', '#ff3a2a', on * (.6 + .4 * blink)), r * .1);
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ellipse(ctx, -r * .28, -r * .42, r * .18, r * .1, -.5); ctx.fill();
  ctx.restore();
}
// Tetes kapsaisin (zat pedas, berminyak). (x,y) = pusat. o: { face, t, wob, alpha }
function drawKapsaisin(ctx, x, y, r, o = {}) {
  if (o.alpha != null && o.alpha <= 0) return; const P = PDP, t = o.t || 0;
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha; ctx.translate(x, y); const wb = 1 + (o.wob == null ? .5 : o.wob) * Math.sin(t * 9 + x) * .05; ctx.scale(wb, 1 / wb);
  ctx.beginPath(); ctx.moveTo(-r, r * .45); ctx.bezierCurveTo(-r * 1.1, -r * .5, -r * .4, -r * 1.05, 0, -r * 1.05); ctx.bezierCurveTo(r * .55, -r * 1.05, r * 1.1, -r * .45, r, r * .45); ctx.quadraticCurveTo(0, r * .75, -r, r * .45); ctx.closePath();
  fillStroke(ctx, P.caps, r * .1); ctx.save(); ctx.clip(); ctx.fillStyle = P.capsDk; ctx.fillRect(-r * 1.2, r * .1, r * 2.4, r); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-r, r * .45); ctx.bezierCurveTo(-r * 1.1, -r * .5, -r * .4, -r * 1.05, 0, -r * 1.05); ctx.bezierCurveTo(r * .55, -r * 1.05, r * 1.1, -r * .45, r, r * .45); ctx.quadraticCurveTo(0, r * .75, -r, r * .45); ctx.closePath(); ctx.lineWidth = r * .1; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = 'rgba(255,240,200,.85)'; ellipse(ctx, -r * .45, -r * .55, r * .22, r * .12, -.6); ctx.fill();
  ctx.save(); ctx.globalAlpha *= .55; ctx.strokeStyle = '#9ff0ff'; ctx.lineWidth = r * .07; ctx.beginPath(); ctx.arc(0, -r * .1, r * .7, -2.6, -1.9); ctx.stroke(); ctx.strokeStyle = '#ffe36a'; ctx.beginPath(); ctx.arc(0, -r * .1, r * .62, -2.6, -1.9); ctx.stroke(); ctx.restore();
  ctx.restore();
  if (o.face) propFace(ctx, x, y - r * .2, r * 1.15, o.face, { t, alpha: o.alpha });
}
// Butir protein susu: gumpalan putih berlengan. (x,y) = pusat. o: { face, t, reach 0..1 (lengan menjulur ke arah ang), ang, alpha }
function drawProtein(ctx, x, y, r, o = {}) {
  if (o.alpha != null && o.alpha <= 0) return; const P = PDP, t = o.t || 0, rc = clamp(o.reach || 0), ang = o.ang == null ? 0 : o.ang;
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha; ctx.translate(x, y);
  for (const sd of [-1, 1]) { const a = ang + sd * .5 * (1 - rc), L = r * (.7 + .8 * rc); const hx = Math.cos(a) * (r * .8 + L), hy = Math.sin(a) * (r * .8 + L) + Math.sin(t * 7 + sd) * 4 * (1 - rc);
    line(ctx, Math.cos(a) * r * .6, Math.sin(a) * r * .6, hx, hy, r * .2, INK); circle(ctx, hx, hy, r * .17); fillStroke(ctx, P.protein, r * .06); }
  ctx.beginPath(); for (let i = 0; i <= 10; i++) { const a = i / 10 * TAU, rr = r * (1 + .1 * Math.sin(a * 5 + t * 3)); i ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath();
  fillStroke(ctx, P.protein, r * .1); ctx.save(); ctx.clip(); ctx.fillStyle = P.proteinSh; ctx.fillRect(-r * 1.2, r * .35, r * 2.4, r); ctx.restore();
  ctx.restore();
  if (o.face) propFace(ctx, x, y, r * 1.2, o.face, { t, alpha: o.alpha });
}
