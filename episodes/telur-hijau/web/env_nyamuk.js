// ---------- Aset episode "Nyamuk: darah manis?" (24-11-2026) ----------
// Aturan v6: satu fungsi per benda, palet NYP terkunci, tata letak NY terkunci. Latar datar satu skala (v7).
const NYP = {
  sky: '#1d2550', sky2: '#3a3f7a', skyDay: '#9fdcff', skyDay2: '#e9f7ff', wall: '#f1d9a8', wallDk: '#d9b97f', wallDay: '#f8e7c2', trim: '#8a5a32',
  floor: '#b4553a', floorLn: 'rgba(60,20,10,.25)', winLight: '#ffd979', winLight2: '#ffb84a', curtain: '#e46a5a', curtainDk: '#b84a3e',
  lamp: '#fff3b0', lampGlow: '255,226,140', wood: '#9a5c33', woodHi: '#c47e4a', woodDk: '#6a3a1e', pillar: '#e9d2a0',
  plant: '#3f9b4a', plantDk: '#2a6e35', pot: '#c2643a', moon: '#fff6c8',
  mBody: '#2b2733', mStripe: '#f4f4f0', mWing: 'rgba(210,235,255,.55)', mWingLn: 'rgba(34,28,34,.55)', mBlood: '#d8262f', mLeg: '#2b2733',
  glass: 'rgba(225,245,255,.55)', tea: '#c56a1e', teaHi: '#e8943c', water: '#d8f1ff', sugar: '#ffffff',
  candy1: '#ff5a8a', candy2: '#3fc1e0', candy3: '#ffd23a', kue: '#e8a65a', kueTop: '#f06a8a', bin: '#4f8f5a', binDk: '#336b3f',
  garlic: '#f7f1e6', garlicSh: '#e2d6c2', garlicVein: '#b89ac8', stinkG: '#b8d86a', stinkGDk: '#7c9c3a',
  breath: 'rgba(235,240,255,.8)', heat: '#ff7a3a',
  skin: '#f3b79a', skinDk: '#d98f72', skinHi: '#ffd6c2', pore: '#8a4a3a', hair: '#5a3a2a',
  mik0: '#9b6ae0', mik1: '#5fc46a', mik2: '#ffb52e', aroma: '#ffcf6a', aromaDk: '#e0952a',
  blood: '#d8262f', bloodHi: '#ff6a6a', egg: '#3a3440', jar: 'rgba(220,240,255,.45)', jarLid: '#e5392f',
  sign: '#ffd23a', signDk: '#e09a1a', signTx: '#c4231f', cal: '#fffaf0', calTop: '#e5392f',
};
// Tata letak teras (terkunci). Tokoh di belakang meja: y = 1500, s = 600 (kepala sekitar y 1041). Meja 1330.
const NY = { top: 1330, back: 1500, ibu: 230, rani: 520, budi: 830, glassI: [360, 1330], glassR: [655, 1330], glassB: [965, 1330],
  window: [540, 560], lamp: [880, 170], cal: [150, 600], bin: [-420, 1330], door: [-380, 900], plant: [1200, 1330], pillarL: -700, pillarR: 1320 };

// ===== latar teras (datar). o: { pagi 0..1, cal: teks kalender, calTop, lamp 0..1 } =====
function terasBG(ctx, t, cam, o = {}) {
  const P = NYP, F = NY.top, d = clamp(o.pagi || 0); applyCam(ctx, cam, 1);
  // langit di luar (terlihat di kiri-kanan pilar)
  const g = ctx.createLinearGradient(0, -400, 0, F); g.addColorStop(0, mixC(P.sky, P.skyDay, d)); g.addColorStop(1, mixC(P.sky2, P.skyDay2, d));
  ctx.fillStyle = g; ctx.fillRect(-2600, -2600, 6400, 2600 + F + 10);
  if (d < 1) { ctx.save(); ctx.globalAlpha = 1 - d; circle(ctx, 1700, 300, 80); ctx.fillStyle = P.moon; ctx.fill(); for (let i = 0; i < 18; i++) { const x = -2400 + (i * 397) % 4800, y = -300 + (i * 211) % 700; star5(ctx, x, y, 9 + (i % 3) * 3, 0, '#fff6c8'); } ctx.restore(); }
  // dinding rumah (antara pilar)
  const wl = NY.pillarL, wr = NY.pillarR; const wg = ctx.createLinearGradient(0, -300, 0, F); wg.addColorStop(0, mixC('#8a6f55', P.wallDay, d)); wg.addColorStop(.55, mixC('#d9b886', P.wallDay, d)); wg.addColorStop(1, mixC(P.wall, P.wallDay, d)); ctx.fillStyle = wg; ctx.fillRect(wl, -300, wr - wl, F + 310);
  ctx.fillStyle = mixC(P.wallDk, P.wall, d); ctx.fillRect(wl, 1180, wr - wl, F - 1180); line(ctx, wl, 1180, wr, 1180, 6);
  rrect(ctx, wl, -330, wr - wl, 60, 0); fillStroke(ctx, P.trim, 6);
  // pintu
  const [dx, dy] = NY.door; rrect(ctx, dx - 150, dy - 330, 300, F - dy + 330, 10); fillStroke(ctx, P.wood, 8);
  for (const yy of [dy - 270, dy + 60]) { rrect(ctx, dx - 110, yy, 220, 250, 8); fillStroke(ctx, P.woodHi, 5); }
  circle(ctx, dx + 105, dy + 60, 14); fillStroke(ctx, '#ffd23a', 4);
  // jendela dengan lampu dalam rumah
  const [wx, wy] = NY.window; rrect(ctx, wx - 230, wy - 200, 460, 380, 16);
  const lg = ctx.createLinearGradient(0, wy - 200, 0, wy + 180); lg.addColorStop(0, mixC(P.winLight, '#ffffff', d * .5)); lg.addColorStop(1, mixC(P.winLight2, '#dff3ff', d * .6)); ctx.fillStyle = lg; ctx.fill();
  ctx.save(); rrect(ctx, wx - 230, wy - 200, 460, 380, 16); ctx.clip();
  // gorden
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(wx + sd * 230, wy - 200); ctx.lineTo(wx + sd * 95, wy - 200); ctx.quadraticCurveTo(wx + sd * 140, wy, wx + sd * 175, wy + 180); ctx.lineTo(wx + sd * 230, wy + 180); ctx.closePath(); fillStroke(ctx, P.curtain, 5);
    for (let k = 1; k < 3; k++) line(ctx, wx + sd * (230 - k * 40), wy - 200, wx + sd * (230 - k * 30), wy + 180, 4, P.curtainDk); }
  ctx.restore();
  rrect(ctx, wx - 230, wy - 200, 460, 380, 16); fillStroke(ctx, null, 14, P.trim); rrect(ctx, wx - 230, wy - 200, 460, 380, 16); fillStroke(ctx, null, 5);
  line(ctx, wx, wy - 200, wx, wy + 180, 10, P.trim);
  // kalender dinding
  const [cx, cy] = NY.cal; ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.03); rrect(ctx, -95, -120, 190, 230, 12); fillStroke(ctx, P.cal, 6);
  rrect(ctx, -95, -120, 190, 58, 12); fillStroke(ctx, P.calTop, 6); text(ctx, o.calTop || 'NOV', 0, -91, 34, '#fff', INK, 0);
  text(ctx, o.cal || '24', 0, 20, o.cal && o.cal.length > 2 ? 58 : 84, INK, INK, 0); ctx.restore();
  // lampu gantung
  const [lx, ly] = NY.lamp, on = o.lamp == null ? 1 - d : o.lamp; line(ctx, lx, -300, lx, ly - 40, 5);
  if (on > 0) { const gg = ctx.createRadialGradient(lx, ly, 10, lx, ly, 360); gg.addColorStop(0, `rgba(${P.lampGlow},${.55 * on})`); gg.addColorStop(1, `rgba(${P.lampGlow},0)`); ctx.fillStyle = gg; ctx.fillRect(lx - 360, ly - 360, 720, 720); }
  rrect(ctx, lx - 26, ly - 50, 52, 26, 6); fillStroke(ctx, '#8a8f9a', 5); circle(ctx, lx, ly, 34); fillStroke(ctx, mixC('#e8e4d8', P.lamp, on), 5);
  // pilar
  for (const px of [wl, wr]) { rrect(ctx, px - 70, -340, 140, F + 350, 8); fillStroke(ctx, P.pillar, 7); ctx.fillStyle = 'rgba(120,80,40,.14)'; ctx.fillRect(px + 20, -330, 40, F + 330); }
  // pot tanaman
  const [qx, qy] = NY.plant; for (let i = 0; i < 6; i++) { ctx.save(); ctx.translate(qx, qy - 120); ctx.rotate(-1.2 + i * .48 + Math.sin(t * 1.2 + i) * .03); ctx.beginPath(); ctx.ellipse(0, -90, 34, 100, 0, 0, TAU); fillStroke(ctx, i % 2 ? P.plant : P.plantDk, 5); ctx.restore(); }
  ctx.beginPath(); ctx.moveTo(qx - 80, qy - 150); ctx.lineTo(qx + 80, qy - 150); ctx.lineTo(qx + 60, qy); ctx.lineTo(qx - 60, qy); ctx.closePath(); fillStroke(ctx, P.pot, 6);
  if (d > 0) { ctx.fillStyle = `rgba(255,250,220,${.12 * d})`; ctx.fillRect(-2600, -2600, 6400, 2600 + F); }
}
// Meja teras kayu (digambar SETELAH tokoh supaya kaki tertutup)
function mejaTeras(ctx) {
  const P = NYP, F = NY.top;
  rrect(ctx, -2600, F, 6400, 44, 10); fillStroke(ctx, P.woodHi, 8); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(-2590, F + 8, 6380, 7);
  ctx.save(); ctx.beginPath(); ctx.rect(-2600, F + 40, 6400, 2400); ctx.clip(); ctx.fillStyle = P.wood; ctx.fillRect(-2600, F + 40, 6400, 2400);
  ctx.strokeStyle = P.woodDk; ctx.lineWidth = 5; for (let y = F + 120; y < F + 2400; y += 110) { ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
  for (let i = 0; i < 40; i++) { const x = -2500 + i * 170, y = F + 80 + (i * 67) % 300; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 40, y + 10, x + 90, y); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(60,25,10,.35)'; ctx.stroke(); }
  ctx.fillStyle = 'rgba(10,0,0,.2)'; ctx.fillRect(-2600, F + 40, 6400, 20); ctx.restore(); line(ctx, -2600, F + 40, 3800, F + 40, 7);
}

// ===== nyamuk (Aedes: belang hitam-putih). (x,y) = pusat badan. Menghadap KANAN (flip -1 = kiri).
// o: { t, face, rot, flip, full 0..1 (perut merah), bib (serbet), plate, a, wingPh, sniff 0..1 (belalai naik turun) }
function drawNyamuk(ctx, x, y, s = 1, o = {}) {
  const P = NYP, t = o.t || 0, fl = o.flip || 1; if (o.a != null && o.a <= 0) return;
  ctx.save(); if (o.a != null) ctx.globalAlpha *= clamp(o.a); ctx.translate(x, y); ctx.scale(s * fl, s); ctx.rotate(o.rot || 0);
  const wf = Math.sin(t * 90 + (o.wingPh || 0));
  // sayap belakang
  ctx.save(); ctx.translate(-6, -22); ctx.rotate(-1.2 + wf * .35); ellipse(ctx, 0, -46, 20, 52); ctx.fillStyle = P.mWing; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = P.mWingLn; ctx.stroke(); ctx.restore();
  // kaki (6, panjang menekuk)
  ctx.strokeStyle = P.mLeg; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) { const bx = -14 + i * 16, sw = Math.sin(t * 6 + i + sd) * 4;
    ctx.beginPath(); ctx.moveTo(bx, 6); ctx.lineTo(bx + sd * 18 + (i - 1) * 22, 34 + sw); ctx.lineTo(bx + sd * 10 + (i - 1) * 40, 74 + sw); ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = P.mStripe; ctx.beginPath(); ctx.moveTo(bx + sd * 14 + (i - 1) * 30, 52 + sw); ctx.lineTo(bx + sd * 12 + (i - 1) * 34, 60 + sw); ctx.stroke(); ctx.lineWidth = 4; ctx.strokeStyle = P.mLeg; }
  // perut (abdomen) belang, bisa penuh darah
  const full = clamp(o.full || 0);
  ctx.save(); ctx.translate(-48, 6); ctx.rotate(.25);
  const ab = () => ellipse(ctx, 0, 0, 44 + 8 * full, 15 + 12 * full);
  ab(); ctx.fillStyle = full > 0 ? mixC(P.mBody, P.mBlood, full) : P.mBody; ctx.fill(); ctx.save(); ab(); ctx.clip(); ctx.fillStyle = P.mStripe;
  for (let k = -2; k <= 2; k++) ctx.fillRect(k * 17 - 3, -40, 6, 80); ctx.restore(); ab(); fillStroke(ctx, null, 4); ctx.restore();
  // dada
  ellipse(ctx, 0, -2, 22, 20); fillStroke(ctx, P.mBody, 4); line(ctx, -8, -14, 8, -14, 4, P.mStripe); line(ctx, -4, -8, 6, 6, 3, P.mStripe);
  // kepala + belalai
  circle(ctx, 30, -10, 20); fillStroke(ctx, P.mBody, 4);
  const sn = (o.sniff || 0) * Math.sin(t * 14) * .12;
  ctx.save(); ctx.translate(46, -4); ctx.rotate(.35 + sn); line(ctx, 0, 0, 52, 0, 5, P.mBody); ctx.restore();
  // antena berbulu
  for (const a of [-.9, -.6]) { ctx.save(); ctx.translate(38, -24); ctx.rotate(a); line(ctx, 0, 0, 34, 0, 3, P.mBody); for (let k = 1; k < 4; k++) { line(ctx, k * 9, 0, k * 9 + 4, -7, 2, P.mBody); line(ctx, k * 9, 0, k * 9 + 4, 7, 2, P.mBody); } ctx.restore(); }
  // sayap depan
  ctx.save(); ctx.translate(-2, -20); ctx.rotate(-.9 + wf * .45); ellipse(ctx, 0, -50, 22, 56); ctx.fillStyle = P.mWing; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = P.mWingLn; ctx.stroke(); line(ctx, 0, -6, 0, -96, 2, P.mWingLn); ctx.restore();
  if (o.bib) { ctx.beginPath(); ctx.moveTo(16, 8); ctx.lineTo(44, 8); ctx.lineTo(30, 40); ctx.closePath(); fillStroke(ctx, '#ffffff', 3); line(ctx, 20, 18, 40, 18, 3, '#e5392f'); }
  if (o.plate) { ellipse(ctx, 40, 78, 34, 9); fillStroke(ctx, '#f8f8f4', 3); }
  ctx.restore();
  if (o.face) { const fx = x + 30 * s * fl * Math.cos(o.rot || 0) + 10 * s * Math.sin(o.rot || 0), fy = y - 10 * s; propFace(ctx, fx, fy, 36 * s, o.face, { t }); }
}
// Kawanan nyamuk mengitari titik (cx,cy). Arah hadap mengikuti gerak. n boleh pecahan (yang terakhir muncul pelan).
// o: { t, rx, ry, s, seed, face (fungsi i -> face) , enter 0..1 per ekor: fungsi i -> 0..1 (datang dari kanan atas) }
const SWARM = (() => { const r = rng(77), o = []; for (let i = 0; i < 16; i++) o.push({ sp: (1.4 + r() * 1.4) * (r() < .5 ? -1 : 1), ph: r() * TAU, rx: .55 + r() * .5, ry: .45 + r() * .5, wob: r() * TAU, sc: .8 + r() * .35 }); return o; })();
function nyamukPos(i, cx, cy, t, o = {}) { const q = SWARM[i % 16], a = t * q.sp + q.ph, rx = (o.rx || 220) * q.rx, ry = (o.ry || 160) * q.ry;
  const x = cx + Math.cos(a) * rx + Math.sin(t * 3.1 + q.wob) * 14, y = cy + Math.sin(a) * ry + Math.sin(t * 4.3 + q.wob) * 12; const vx = -Math.sin(a) * rx * q.sp; return [x, y, vx]; }
function nyamukSwarm(ctx, cx, cy, n, t, o = {}) {
  for (let i = 0; i < Math.ceil(n); i++) { let [x, y, vx] = nyamukPos(i, cx, cy, t, o); const e = o.enter ? clamp(o.enter(i)) : 1; if (e <= 0) continue;
    const a = i < Math.floor(n) ? 1 : n - Math.floor(n);
    if (e < 1) { const k = easeOut(e); x = lerp(o.from ? o.from[0] : cx + 900, x, k); y = lerp(o.from ? o.from[1] : cy - 700, y, k); vx = -1; }
    drawNyamuk(ctx, x, y, (o.s || .5) * SWARM[i % 16].sc, { t: t + i, flip: vx >= 0 ? 1 : -1, rot: Math.sin(t * 5 + i) * .12, a, face: o.face ? o.face(i) : null, full: o.full || 0, wingPh: i * 1.7 }); }
}

// ===== gelas teh. (x,y) = dasar gelas. o: { tea 0..1 (1 = teh, 0 = air putih), fill 0..1, sugar 0..n kubus, face, t, steam 0..1, glow }
function drawGelasTeh(ctx, x, y, s = 1, o = {}) {
  const P = NYP, t = o.t || 0, fill = clamp(o.fill == null ? .85 : o.fill), tea = clamp(o.tea == null ? 1 : o.tea);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (o.rot) ctx.rotate(o.rot);
  if (!o.rot) { ellipse(ctx, 0, 3, 58, 9); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill(); }
  const shape = () => { ctx.beginPath(); ctx.moveTo(-52, -170); ctx.lineTo(52, -170); ctx.lineTo(42, 0); ctx.lineTo(-42, 0); ctx.closePath(); };
  shape(); ctx.fillStyle = P.glass; ctx.fill();
  if (fill > 0) { ctx.save(); shape(); ctx.clip(); const ly = lerp(-4, -160, fill); const lc = mixC(P.water, P.tea, tea);
    ctx.fillStyle = lc; ctx.fillRect(-80, ly, 160, 200); ctx.fillStyle = mixC('#ffffff', P.teaHi, tea); ctx.globalAlpha = .6; ctx.fillRect(-80, ly, 160, 10); ctx.globalAlpha = 1;
    for (let i = 0; i < Math.round(o.sugar || 0); i++) { const sx = -26 + (i % 3) * 22, sy = -16 - Math.floor(i / 3) * 20; rrect(ctx, sx - 11, sy - 11, 22, 22, 3); fillStroke(ctx, P.sugar, 3); }
    ctx.restore(); }
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.moveTo(-40, -160); ctx.lineTo(-31, -160); ctx.lineTo(-27, -18); ctx.lineTo(-34, -18); ctx.closePath(); ctx.fill();
  shape(); fillStroke(ctx, null, 6);
  if (o.steam > 0) for (let i = 0; i < 3; i++) { const q = (t * .7 + i / 3) % 1; ctx.save(); ctx.globalAlpha = o.steam * (1 - q) * .8; ctx.beginPath(); const sx = -24 + i * 24; ctx.moveTo(sx, -180 - q * 90); ctx.quadraticCurveTo(sx + 16, -200 - q * 90, sx, -225 - q * 90); ctx.lineWidth = 7; ctx.strokeStyle = '#ffffff'; ctx.stroke(); ctx.restore(); }
  ctx.restore();
  if (o.glow > 0) glowRing(ctx, x, y - 85 * s, 110 * s, o.glow, '255,200,80');
  if (o.face) propFace(ctx, x, y - 80 * s, 66 * s, o.face, { t });
}
// permen bungkus. kue donat. tong sampah (o.lid 0..1 terbuka)
function drawPermen(ctx, x, y, s = 1, rot = 0, col = NYP.candy1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 26, 0); ctx.lineTo(sd * 56, -20); ctx.lineTo(sd * 50, 0); ctx.lineTo(sd * 56, 20); ctx.closePath(); fillStroke(ctx, col, 4); }
  ellipse(ctx, 0, 0, 32, 22); fillStroke(ctx, col, 4); line(ctx, -14, -12, 14, 12, 5, 'rgba(255,255,255,.7)'); ctx.restore();
}
function drawKue(ctx, x, y, s = 1, rot = 0) {
  const P = NYP; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.arc(0, 0, 17, 0, TAU, true); fillStroke(ctx, P.kue, 5);
  ctx.beginPath(); for (let i = 0; i <= 12; i++) { const a = i / 12 * TAU, r = 44 + (i % 2) * 5; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.arc(0, 0, 21, TAU, 0, true); ctx.fillStyle = P.kueTop; ctx.fill();
  for (let i = 0; i < 9; i++) { const a = i * .7, r = 32; line(ctx, Math.cos(a) * r, Math.sin(a) * r, Math.cos(a) * r + 6, Math.sin(a) * r + 3, 4, ['#fff', '#ffd23a', '#3fc1e0'][i % 3]); }
  ctx.beginPath(); ctx.arc(0, 0, 50, 0, TAU); ctx.arc(0, 0, 17, 0, TAU, true); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
}
function drawTongSampah(ctx, x, y, s = 1, o = {}) {
  const P = NYP; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 4, 100, 14); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-92, -250); ctx.lineTo(92, -250); ctx.lineTo(76, 0); ctx.lineTo(-76, 0); ctx.closePath(); fillStroke(ctx, P.bin, 7);
  for (const xx of [-40, 0, 40]) line(ctx, xx, -220, xx * .85, -24, 6, P.binDk);
  ctx.save(); ctx.translate(-100, -262); ctx.rotate(-1.9 * clamp(o.lid || 0)); rrect(ctx, 0, -14, 200, 26, 10); fillStroke(ctx, P.binDk, 6); rrect(ctx, 80, -34, 40, 22, 8); fillStroke(ctx, P.binDk, 5); ctx.restore();
  ctx.restore();
  if (o.face) propFace(ctx, x, y - 120 * s, 100 * s, o.face, { t: o.t || 0 });
}
// bawang putih (umbi). o: { face, t, rot, siung (satu siung saja) }
function drawBawangPutih(ctx, x, y, s = 1, o = {}) {
  const P = NYP; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  if (o.siung) { ctx.beginPath(); ctx.moveTo(0, -60); ctx.quadraticCurveTo(40, -20, 26, 30); ctx.quadraticCurveTo(0, 46, -26, 30); ctx.quadraticCurveTo(-40, -20, 0, -60); fillStroke(ctx, P.garlic, 5); line(ctx, -6, -30, -10, 24, 3, P.garlicVein); ctx.restore(); return; }
  const bulb = () => { ctx.beginPath(); ctx.moveTo(0, -96); ctx.quadraticCurveTo(26, -70, 70, -30); ctx.quadraticCurveTo(110, 20, 60, 62); ctx.quadraticCurveTo(0, 86, -60, 62); ctx.quadraticCurveTo(-110, 20, -70, -30); ctx.quadraticCurveTo(-26, -70, 0, -96); ctx.closePath(); };
  bulb(); ctx.fillStyle = P.garlic; ctx.fill(); ctx.save(); bulb(); ctx.clip(); ctx.fillStyle = P.garlicSh; ctx.fillRect(20, -120, 120, 240);
  for (const k of [-.6, -.25, .25, .6]) { ctx.beginPath(); ctx.moveTo(0, -94); ctx.quadraticCurveTo(k * 150, -10, k * 70, 80); ctx.lineWidth = 4; ctx.strokeStyle = P.garlicVein; ctx.stroke(); } ctx.restore();
  bulb(); fillStroke(ctx, null, 6); ctx.beginPath(); ctx.moveTo(-8, -94); ctx.quadraticCurveTo(-4, -130, 6, -150); ctx.lineWidth = 7; ctx.strokeStyle = '#c9b48a'; ctx.stroke();
  for (let i = 0; i < 5; i++) line(ctx, -30 + i * 15, 74, -36 + i * 18, 94, 3, '#c9b48a');
  ctx.restore();
  if (o.face) propFace(ctx, x, y + 4 * s, 90 * s, o.face, { t: o.t || 0 });
}
// awan napas/bau bawang dari mulut. o: { t, a, col, colDk, label }
function drawNapasBau(ctx, x, y, r, o = {}) {
  const t = o.t || 0, a = o.a == null ? 1 : clamp(o.a); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); const wob = Math.sin(t * 3 + x * .01) * .06; ctx.scale(1 + wob, 1 - wob);
  ctx.beginPath(); for (let i = 0; i < 6; i++) { const an = i / 6 * TAU; ctx.moveTo(Math.cos(an) * r * .5 + r * .45, Math.sin(an) * r * .35); ctx.arc(Math.cos(an) * r * .5, Math.sin(an) * r * .35, r * .45, 0, TAU); }
  ctx.fillStyle = o.col || NYP.stinkG; ctx.fill(); ctx.lineWidth = Math.max(3, r * .07); ctx.strokeStyle = o.colDk || NYP.stinkGDk; ctx.stroke();
  ctx.beginPath(); for (let i = 0; i < 6; i++) { const an = i / 6 * TAU; ctx.moveTo(Math.cos(an) * r * .5 + r * .45, Math.sin(an) * r * .35); ctx.arc(Math.cos(an) * r * .5, Math.sin(an) * r * .35, r * .45, 0, TAU); } ctx.fillStyle = o.col || NYP.stinkG; ctx.fill();
  if (o.label) text(ctx, o.label, 0, 4, r * .42, '#ffffff', INK, Math.max(4, r * .07));
  ctx.restore();
}
// gelombang panas (oranye). (x,y) dasar, tinggi h
function drawPanas(ctx, x, y, h, t, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = NYP.heat; ctx.lineWidth = 9; ctx.lineCap = 'round';
  for (let k = -1; k <= 1; k++) { ctx.beginPath(); for (let i = 0; i <= 12; i++) { const q = i / 12, yy = y - q * h, xx = x + k * 50 + Math.sin(q * 9 - t * 7 + k) * 14; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  ctx.restore();
}

// ===== DUNIA MIKRO: permukaan kulit (koordinat LAYAR). o: { t, mc: {z,x,y}, warm 0..1 } =====
const PORI = [[230, 520], [800, 430], [520, 900], [180, 1180], [880, 1080], [420, 1560], [860, 1650]];
function kulitBG(ctx, t, o = {}) {
  const P = NYP; ctx.save(); mcam(ctx, o.mc);
  ctx.fillStyle = P.skin; ctx.fillRect(-W, -H, W * 3, H * 3);
  // sisik sel kulit
  ctx.strokeStyle = P.skinDk; ctx.lineWidth = 5; const R = rng(12);
  for (let r = -1; r < 10; r++) for (let c = -1; c < 6; c++) { const cx = c * 230 + (r % 2) * 115 + R() * 30, cy = r * 210 + R() * 30; ctx.beginPath();
    for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + .3, rr = 110 + R() * 20; k ? ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .8) : ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .8); } ctx.closePath(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,230,215,.35)'; ellipse(ctx, cx - 30, cy - 30, 40, 16, -.3); ctx.fill(); }
  // pori + rambut + butir keringat
  PORI.forEach(([x, y], i) => { ellipse(ctx, x, y, 46, 30); ctx.fillStyle = P.pore; ctx.fill(); ellipse(ctx, x, y - 6, 46, 24); ctx.lineWidth = 6; ctx.strokeStyle = P.skinDk; ctx.stroke();
    if (i % 2 === 0) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 60, y - 160, x + 30 + Math.sin(t * 1.5 + i) * 10, y - 340); ctx.lineWidth = 16; ctx.strokeStyle = P.hair; ctx.lineCap = 'round'; ctx.stroke(); }
    else { circle(ctx, x + 70, y - 50, 26 + Math.sin(t * 2 + i) * 2); ctx.fillStyle = 'rgba(190,230,255,.75)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(80,140,190,.8)'; ctx.stroke(); } });
  if (o.warm > 0) { const g = ctx.createRadialGradient(W / 2, H / 2, 300, W / 2, H / 2, 1200); g.addColorStop(0, 'rgba(255,120,40,0)'); g.addColorStop(1, `rgba(255,120,40,${.35 * o.warm})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}
// mikroba kulit: kind 0 = bulat bergerombol (ungu), 1 = batang (hijau), 2 = bulat kuning. o: { t, face, a, rot, eat 0..1 }
function drawMikroba(ctx, x, y, r, o = {}) {
  const P = NYP, t = o.t || 0, kind = o.kind || 0, col = [P.mik0, P.mik1, P.mik2][kind]; if (o.a != null && o.a <= 0) return;
  ctx.save(); if (o.a != null) ctx.globalAlpha *= clamp(o.a); ctx.translate(x, y); ctx.rotate(o.rot || 0); const sq = 1 + Math.sin(t * 5 + x * .02) * .05; ctx.scale(sq, 2 - sq);
  if (kind === 1) { rrect(ctx, -r * 1.3, -r * .6, r * 2.6, r * 1.2, r * .6); fillStroke(ctx, col, Math.max(3, r * .08)); ctx.fillStyle = 'rgba(255,255,255,.4)'; ellipse(ctx, -r * .6, -r * .25, r * .4, r * .1); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2, r * .05); ctx.beginPath(); ctx.moveTo(r * 1.3, 0); for (let i = 1; i <= 6; i++) ctx.lineTo(r * 1.3 + i * r * .18, Math.sin(i * 1.5 + t * 9) * r * .18); ctx.stroke(); }
  else { const pts = kind === 0 ? [[0, 0], [-.75, -.35], [.75, -.35], [-.4, .6], [.45, .6]] : [[0, 0]]; const rr = kind === 0 ? r * .55 : r;
    pts.forEach(([px, py]) => { circle(ctx, px * r, py * r, rr); ctx.fillStyle = col; ctx.fill(); });
    pts.forEach(([px, py]) => { circle(ctx, px * r, py * r, rr); ctx.lineWidth = Math.max(3, r * .07); ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.4)'; ellipse(ctx, px * r - rr * .35, py * r - rr * .4, rr * .3, rr * .12, -.4); ctx.fill(); }); }
  ctx.restore();
  if (o.face) propFace(ctx, x, y, r * (kind === 0 ? .95 : 1.15), o.face, { t });
  if (o.eat > 0) { const k = Math.abs(Math.sin(t * 10)) * o.eat; text(ctx, 'NYAM', x + r * 1.1, y - r * 1.2, r * .45, '#fff', INK, 5); }
}
// aroma (gulungan bau menggoda) dengan ikon makanan. icon: 'ayam' | 'telur' | 'tempe' | null. o: { t, a, col }
function drawAroma(ctx, x, y, r, o = {}) {
  const P = NYP, t = o.t || 0, a = o.a == null ? 1 : clamp(o.a); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.beginPath(); for (let i = 0; i <= 16; i++) { const q = i / 16, yy = r * 1.4 - q * r * 2.8, xx = Math.sin(q * 7 + t * 4) * r * .35; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
  ctx.lineCap = 'round'; ctx.lineWidth = r * .32; ctx.strokeStyle = o.colDk || P.aromaDk; ctx.stroke(); ctx.lineWidth = r * .2; ctx.strokeStyle = o.col || P.aroma; ctx.stroke();
  const ic = o.icon; if (ic) { ctx.translate(r * .7, -r * .9); const k = r / 60;
    if (ic === 'ayam') { ctx.save(); ctx.rotate(-.5); ellipse(ctx, 0, -10 * k, 30 * k, 38 * k); fillStroke(ctx, '#d9902e', 4); line(ctx, 0, 20 * k, 0, 52 * k, 10 * k, '#f6f1e8'); circle(ctx, -7 * k, 56 * k, 8 * k); fillStroke(ctx, '#f6f1e8', 3); circle(ctx, 7 * k, 56 * k, 8 * k); fillStroke(ctx, '#f6f1e8', 3); ctx.restore(); }
    else if (ic === 'telur') { ctx.beginPath(); for (let i = 0; i <= 10; i++) { const an = i / 10 * TAU, rr = (38 + (i % 2) * 8) * k; ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr * .8); } ctx.closePath(); fillStroke(ctx, '#ffffff', 4); circle(ctx, 0, 0, 16 * k); fillStroke(ctx, '#ffc52a', 4); }
    else if (ic === 'tempe') { rrect(ctx, -36 * k, -22 * k, 72 * k, 44 * k, 6 * k); fillStroke(ctx, '#e8c27a', 4); ctx.fillStyle = '#b8853a'; for (let i = 0; i < 6; i++) { circle(ctx, (-22 + (i % 3) * 22) * k, (-8 + Math.floor(i / 3) * 16) * k, 4 * k); ctx.fill(); } } }
  ctx.restore();
}
// toples "racikan" bakteri per orang. o: { label, mix: [n0,n1,n2], t, glow 0..1, lid col }
function drawToples(ctx, x, y, s = 1, o = {}) {
  const P = NYP, t = o.t || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 4, 110, 14); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  rrect(ctx, -100, -300, 200, 300, 30); ctx.fillStyle = P.jar; ctx.fill();
  const R = rng(o.seed || 5); const mix = o.mix || [3, 3, 3];
  ctx.save(); rrect(ctx, -100, -300, 200, 300, 30); ctx.clip(); let k = 0;
  mix.forEach((n, kind) => { for (let i = 0; i < n; i++, k++) { const bx = -66 + R() * 132, by = -40 - R() * 200 + Math.sin(t * 2 + k) * 6; drawMikroba(ctx, bx, by, 18, { kind, t: t + k, rot: R() * 3 }); } });
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,.5)'; rrect(ctx, -84, -280, 18, 240, 9); ctx.fill();
  rrect(ctx, -100, -300, 200, 300, 30); fillStroke(ctx, null, 6); rrect(ctx, -110, -330, 220, 44, 12); fillStroke(ctx, o.lid || P.jarLid, 6);
  if (o.label) { rrect(ctx, -82, -150, 164, 56, 8); fillStroke(ctx, '#fffaf0', 4); text(ctx, o.label, 0, -121, 40, INK, INK, 0); }
  ctx.restore();
  if (o.glow > 0) glowRing(ctx, x, y - 150 * s, 170 * s, o.glow, '255,190,60');
}
// tetes darah (berwajah opsional), telur nyamuk (rakit), kubus gula
function drawTetesDarah(ctx, x, y, r, o = {}) {
  const P = NYP; ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.moveTo(0, -r * 1.5); ctx.quadraticCurveTo(r * 1.05, -r * .2, r, r * .3); ctx.arc(0, r * .3, r, 0, Math.PI); ctx.quadraticCurveTo(-r * 1.05, -r * .2, 0, -r * 1.5); ctx.closePath();
  fillStroke(ctx, P.blood, Math.max(4, r * .07)); ctx.fillStyle = 'rgba(255,255,255,.45)'; ellipse(ctx, -r * .4, -r * .1, r * .14, r * .3, .3); ctx.fill(); ctx.restore();
  if (o.label) text(ctx, o.label, x, y + r * .35, r * .32, '#ffffff', INK, Math.max(4, r * .06));
  if (o.face) propFace(ctx, x, y + r * .25, r * .9, o.face, { t: o.t || 0 });
}
function drawTelurNyamuk(ctx, x, y, s, n, t = 0) {
  const P = NYP; for (let i = 0; i < n; i++) { const c = i % 6, r = Math.floor(i / 6); const ex = x + (c - 2.5) * 30 * s, ey = y + r * 46 * s; const k = backOut(clamp(n - i)); if (k <= 0) continue;
    ctx.save(); ctx.translate(ex, ey); ctx.rotate(.1); ctx.scale(k, k); ellipse(ctx, 0, 0, 12 * s, 22 * s); fillStroke(ctx, P.egg, 4); ctx.fillStyle = 'rgba(255,255,255,.4)'; ellipse(ctx, -4 * s, -8 * s, 3 * s, 7 * s); ctx.fill(); ctx.restore(); }
}
function drawGula(ctx, x, y, r, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  rrect(ctx, -r, -r, r * 2, r * 2, r * .15); fillStroke(ctx, '#ffffff', Math.max(4, r * .07)); ctx.fillStyle = 'rgba(150,170,200,.35)'; ctx.fillRect(r * .3, -r, r * .7, r * 2);
  ctx.fillStyle = 'rgba(200,210,230,.9)'; for (let i = 0; i < 10; i++) { circle(ctx, -r * .7 + (i * 37) % (r * 1.4), -r * .7 + (i * 53) % (r * 1.4), r * .05); ctx.fill(); }
  rrect(ctx, -r, -r, r * 2, r * 2, r * .15); fillStroke(ctx, null, Math.max(4, r * .07)); ctx.restore();
  if (o.face) propFace(ctx, x, y, r * 1.2, o.face, { t: o.t || 0 });
}
// papan nama "WARTEG BUDI" (k 0..1 muncul dengan pantulan)
function drawPapanWarteg(ctx, x, y, s, k, t = 0) {
  if (k <= 0) return; const P = NYP; ctx.save(); ctx.translate(x, y); const sc = backOut(clamp(k)) * s; ctx.scale(sc, sc); ctx.rotate(Math.sin(t * 2) * .03);
  line(ctx, -150, -110, -150, -200, 6); line(ctx, 150, -110, 150, -200, 6);
  rrect(ctx, -250, -120, 500, 170, 20); fillStroke(ctx, P.sign, 8); rrect(ctx, -232, -104, 464, 138, 14); fillStroke(ctx, null, 4, P.signDk);
  text(ctx, 'WARTEG BUDI', 0, -48, 64, P.signTx, INK, 0); text(ctx, 'BUKA 24 JAM', 0, 10, 36, INK, INK, 0);
  for (let i = 0; i < 8; i++) { const on = Math.sin(t * 8 + i * 1.3) > 0; circle(ctx, -230 + i * 66, -130, 10); fillStroke(ctx, on ? '#fff36a' : '#c9a23a', 3); }
  ctx.restore();
}
// kalender sobek dengan tahun besar. flip 0..1 = halaman lama tersobek terbang
function drawKalenderTahun(ctx, x, y, s, year, next, flip = 0) {
  const P = NYP; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -170, -210, 340, 400, 22); fillStroke(ctx, P.cal, 7); rrect(ctx, -170, -210, 340, 90, 22); fillStroke(ctx, P.calTop, 7);
  for (const xx of [-90, 90]) { circle(ctx, xx, -210, 16); fillStroke(ctx, '#8a8f9a', 5); }
  text(ctx, String(next != null && flip > 0 ? next : year), 0, 40, 120, INK, INK, 0);
  if (flip > 0 && flip < 1 && next != null) { ctx.save(); ctx.translate(lerp(0, 360, flip), -100 - 200 * flip); ctx.rotate(flip * 1.8); ctx.globalAlpha = 1 - flip * .6;
    rrect(ctx, -170, -110, 340, 300, 10); fillStroke(ctx, P.cal, 6); text(ctx, String(year), 0, 40, 120, INK, INK, 0); ctx.restore(); }
  ctx.restore();
}
