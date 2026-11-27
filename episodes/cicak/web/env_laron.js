// ---------- Aset episode "Laron = rayap bersayap" (26-11-2026) ----------
// Aturan v6: satu fungsi per benda, palet LRP terkunci, tata letak LR terkunci. Ruang tengah = rumahBG (env_jemur.js), malam hujan.
const LRP = {
  body: '#6b4423', bodyHi: '#9a6a3c', bodyDk: '#3e2612', pale: '#f3e3c2', paleDk: '#d8c093', wing: 'rgba(235,240,255,.55)', wingLn: 'rgba(60,60,90,.55)', vein: 'rgba(90,90,130,.35)',
  cord: '#2b2f3e', shade: '#ffd23a', shadeDk: '#d99a1c', bulb: '#fff6c8', glow: '255,232,150',
  basin: '#4ab3f0', basinDk: '#2a7fbf', water: '#aee0ff', crown: '#ffd23a', crownDk: '#d99a1c',
  soil: '#8a5a34', soilDk: '#6a4224', soilWet: '#5a3a22', grass: '#58b94c', chamber: '#3a2414', wood: '#c68a55', woodDk: '#8a5a34',
  cicak: '#c9b98a', cicakDk: '#8f7f55', dragon: '#3fae5a', moth: '#b9a07a', mothDk: '#8a7250', wallLamp: '#fff0c0',
};
// Tata letak ruang tengah (terkunci). Lantai JL.floor = 1390, kaki tokoh JL.feet = 1560 (s 600, kepala sekitar y 1101).
const LR = { lamp: [540, 640], basin: [540, 1610], budi: 250, rani: 830, ibu: 110, wallLamp: [-230, 820], cicak: [-60, 520] };

// ===== lampu gantung. (x,y) = bola lampu. o: { on 0..1, sway } =====
function drawLampu(ctx, x, y, s = 1, o = {}) {
  const P = LRP, on = o.on == null ? 1 : o.on, sw = o.sway || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(sw);
  line(ctx, 0, -2000, 0, -110, 7, P.cord);
  if (on > 0) { const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 420); g.addColorStop(0, `rgba(${P.glow},${.55 * on})`); g.addColorStop(1, `rgba(${P.glow},0)`); ctx.fillStyle = g; ctx.fillRect(-420, -420, 840, 840); }
  ctx.beginPath(); ctx.moveTo(-40, -110); ctx.lineTo(40, -110); ctx.lineTo(120, -10); ctx.lineTo(-120, -10); ctx.closePath(); fillStroke(ctx, P.shade, 7);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-30, -100, 18, 80);
  circle(ctx, 0, 14, 40); fillStroke(ctx, on > .1 ? P.bulb : '#d9d4c0', 6);
  ctx.restore();
}
// lampu dinding kecil ("lampu yang lain")
function drawLampuDinding(ctx, x, y, s = 1, on = 1) {
  const P = LRP; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (on > 0) { const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 260); g.addColorStop(0, `rgba(${P.glow},${.45 * on})`); g.addColorStop(1, `rgba(${P.glow},0)`); ctx.fillStyle = g; ctx.fillRect(-260, -260, 520, 520); }
  rrect(ctx, -20, -10, 40, 60, 8); fillStroke(ctx, '#b07a48', 5);
  ctx.beginPath(); ctx.moveTo(-60, -10); ctx.lineTo(60, -10); ctx.lineTo(36, -90); ctx.lineTo(-36, -90); ctx.closePath(); fillStroke(ctx, on > .1 ? P.wallLamp : '#cfc8b0', 6);
  ctx.restore();
}
// gelap ruangan (ruang layar) dengan lubang cahaya di sekitar lampu. dark 0..1
function gelapRuang(ctx, cam, dark, lights) {
  if (dark <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const z = cam.z; const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1); ctx.fillStyle = `rgba(14,12,40,${.62 * dark})`;
  ctx.beginPath(); ctx.rect(0, 0, W, H);
  ctx.fill(); ctx.globalCompositeOperation = 'lighter';
  (lights || []).forEach(([wx, wy, r, k]) => { const [sx, sy] = toScreen(cam, wx, wy); const rg = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * z); rg.addColorStop(0, `rgba(${LRP.glow},${.5 * k * dark})`); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(sx - r * z, sy - r * z, r * z * 2, r * z * 2); });
  ctx.restore();
}

// ===== laron (rayap bersayap). (x,y) = pusat badan, tampak atas-samping. =====
// o: { t, rot, wings 0..1 (sayap masih menempel), flap 0..1, face, crown 0..1, pale 0..1 (rayap pekerja pucat), alpha, walk }
function drawLaron(ctx, x, y, s = 1, o = {}) {
  const P = LRP, t = o.t || 0, wk = clamp(o.wings == null ? 1 : o.wings), fl = o.flap == null ? 1 : o.flap, pl = clamp(o.pale || 0);
  ctx.save(); ctx.translate(x, y); if (o.alpha != null) ctx.globalAlpha *= o.alpha; ctx.rotate(o.rot || 0); ctx.scale(s, s);
  const ph = t * 38 * fl + (o.ph || 0);
  // kaki
  for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) { const sw = Math.sin(t * 14 * (o.walk || 0) + i * 2 + (sd > 0 ? 3 : 0)) * .3; line(ctx, -2 + i * 7, sd * 6, -8 + i * 10 + sw * 8, sd * 22, 3.2, P.bodyDk); }
  // sayap (4 helai panjang, lebih panjang dari badan)
  if (wk > 0) for (const sd of [-1, 1]) for (const k of [0, 1]) {
    const a = sd * (.22 + k * .16 + Math.abs(Math.sin(ph + k)) * .5 * fl);
    ctx.save(); ctx.globalAlpha *= wk; ctx.translate(4, sd * 4); ctx.rotate(Math.PI + a); ellipse(ctx, 44, 0, 46, 10); ctx.fillStyle = P.wing; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = P.wingLn; ctx.stroke();
    line(ctx, 4, 0, 86, 0, 1.5, P.vein); ctx.restore();
  }
  // badan: perut panjang, dada, kepala
  ellipse(ctx, -18, 0, 20, 10); fillStroke(ctx, mixC(P.body, P.pale, pl), 3.5);
  ctx.strokeStyle = 'rgba(40,20,10,.35)'; ctx.lineWidth = 2; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(-30 + k * 9, -8); ctx.lineTo(-30 + k * 9, 8); ctx.stroke(); }
  ellipse(ctx, 4, 0, 8, 7); fillStroke(ctx, mixC(P.body, P.pale, pl), 3.5);
  circle(ctx, 16, 0, 8.5); fillStroke(ctx, mixC(P.bodyDk, P.paleDk, pl), 3.5);
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(22, sd * 4); ctx.quadraticCurveTo(32, sd * 10, 36, sd * 16); ctx.lineWidth = 2.5; ctx.strokeStyle = P.bodyDk; ctx.stroke(); }
  if (o.crown > 0) { ctx.save(); ctx.translate(16, -12); ctx.rotate(-(o.rot || 0)); const c = backOut(clamp(o.crown)); ctx.scale(c, c); ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-12, -14); ctx.lineTo(-6, -7); ctx.lineTo(0, -16); ctx.lineTo(6, -7); ctx.lineTo(12, -14); ctx.lineTo(12, 0); ctx.closePath(); fillStroke(ctx, P.crown, 3); ctx.restore(); }
  ctx.restore();
  if (o.face) { const a = o.rot || 0; propFace(ctx, x + Math.cos(a) * 16 * s, y + Math.sin(a) * 16 * s, 15 * s, o.face, { t }); }
}
// sehelai sayap lepas
function drawSayap(ctx, x, y, s = 1, rot = 0, a = 1) {
  if (a <= 0) return; const P = LRP; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha *= a;
  ellipse(ctx, 0, 0, 46, 10); ctx.fillStyle = 'rgba(235,240,255,.75)'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = P.wingLn; ctx.stroke(); line(ctx, -40, 0, 42, 0, 1.5, P.vein); ctx.restore();
}
// kawanan laron mengitari lampu (deterministik). k = kepadatan 0..1
const LSW = (() => { const r = rng(55), o = []; for (let i = 0; i < 34; i++) o.push({ a: r() * TAU, w: (.9 + r() * 1.6) * (r() < .5 ? -1 : 1), rx: 70 + r() * 230, ry: 40 + r() * 170, ph: r() * TAU, s: .55 + r() * .35 }); return o; })();
function laronPos(p, t, cx, cy) { const a = p.a + t * p.w; return [cx + Math.cos(a) * p.rx + Math.sin(t * 3 + p.ph) * 14, cy + 40 + Math.sin(a) * p.ry * .8 + Math.cos(t * 2.3 + p.ph) * 12, a + (p.w > 0 ? Math.PI / 2 : -Math.PI / 2)]; }
function laronSwarm(ctx, cx, cy, t, k = 1, o = {}) {
  const n = Math.round(LSW.length * clamp(k));
  for (let i = 0; i < n; i++) { const p = LSW[i], [x, y, a] = laronPos(p, t, cx, cy); drawLaron(ctx, x, y, p.s * (o.s || 1), { t: t + i, rot: a, ph: p.ph }); }
}
// sayap berserakan di lantai (deterministik). n = jumlah
const WFL = (() => { const r = rng(91), o = []; for (let i = 0; i < 60; i++) o.push({ x: -150 + r() * 1400, y: JL.floor + 30 + r() * 300, rot: r() * TAU, s: .6 + r() * .4 }); return o; })();
function sayapLantai(ctx, n) { for (let i = 0; i < Math.min(n, WFL.length); i++) { const w = WFL[i]; drawSayap(ctx, w.x, w.y, w.s, w.rot); } }

// ===== baskom air. (x,y) = tengah dasar. o: { n (laron mengapung), t, ripple } =====
function drawBaskom(ctx, x, y, s = 1, o = {}) {
  const P = LRP, t = o.t || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 6, 190, 22); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  ellipse(ctx, 0, -110, 200, 40); fillStroke(ctx, '#e8f4fb', 7);
  ctx.save(); ellipse(ctx, 0, -108, 186, 33); ctx.clip(); ctx.fillStyle = P.water; ctx.fillRect(-200, -150, 400, 80);
  if (o.ripple) for (let i = 0; i < 3; i++) { const q = (t * .8 + i / 3) % 1; ellipse(ctx, Math.sin(i * 3) * 60, -108, 30 + q * 120, 6 + q * 22); ctx.lineWidth = 3; ctx.strokeStyle = `rgba(255,255,255,${.7 * (1 - q)})`; ctx.stroke(); }
  const r = rng(13); for (let i = 0; i < (o.n || 0); i++) drawLaron(ctx, (r() - .5) * 300, -108 + (r() - .5) * 40, .6, { t: t + i, rot: r() * TAU, flap: .3, wings: .9 });
  ctx.restore();
  const b = () => { ctx.beginPath(); ctx.moveTo(-200, -110); ctx.quadraticCurveTo(-185, 0, -90, 0); ctx.lineTo(90, 0); ctx.quadraticCurveTo(185, 0, 200, -110); ctx.ellipse(0, -110, 200, 40, 0, 0, Math.PI, false); ctx.closePath(); };
  b(); ctx.fillStyle = P.basin; ctx.fill(); shadeShape(ctx, b, 1, .18, .3, [-200, -150, 400, 150]); b(); fillStroke(ctx, null, 7);
  ctx.fillStyle = 'rgba(255,255,255,.4)'; rrect(ctx, -150, -86, 50, 14, 7); ctx.fill();
  ctx.restore();
}

// ===== tebakan: capung & ngengat (ikon gelembung) =====
function drawCapung(ctx, x, y, s = 1, t = 0) {
  const P = LRP; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sd of [-1, 1]) for (const k of [-1, 1]) { ctx.save(); ctx.translate(k * 14, 0); ctx.rotate(sd * (Math.PI / 2 - .25 * k) + Math.sin(t * 30) * .08); ellipse(ctx, 0, -60, 16, 60); ctx.fillStyle = 'rgba(200,240,255,.7)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = P.wingLn; ctx.stroke(); ctx.restore(); }
  rrect(ctx, -110, -8, 120, 16, 8); fillStroke(ctx, P.dragon, 4); ellipse(ctx, 22, 0, 18, 12); fillStroke(ctx, P.dragon, 4);
  circle(ctx, 40, -8, 12); fillStroke(ctx, '#2a7d3f', 4); circle(ctx, 40, 10, 12); fillStroke(ctx, '#2a7d3f', 4);
  ctx.restore();
}
function drawNgengat(ctx, x, y, s = 1, t = 0) {
  const P = LRP; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sd of [-1, 1]) { ctx.save(); ctx.scale(sd, 1); ctx.rotate(Math.sin(t * 18) * .12); ctx.beginPath(); ctx.moveTo(0, -10); ctx.quadraticCurveTo(90, -90, 110, -10); ctx.quadraticCurveTo(100, 40, 0, 10); ctx.closePath(); fillStroke(ctx, P.moth, 5);
    ctx.beginPath(); ctx.moveTo(0, 10); ctx.quadraticCurveTo(70, 30, 70, 70); ctx.quadraticCurveTo(30, 70, 0, 20); fillStroke(ctx, P.mothDk, 5); circle(ctx, 60, -20, 12); fillStroke(ctx, '#f6e7c8', 3); ctx.restore(); }
  ellipse(ctx, 0, 10, 14, 44); fillStroke(ctx, P.mothDk, 5);
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 6, -30); ctx.quadraticCurveTo(sd * 30, -70, sd * 40, -80); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.restore();
}
// kayu digerogoti (rayap = pemakan kayu). bite 0..1
function drawKayu(ctx, x, y, s = 1, bite = 0) {
  const P = LRP; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -160, -50, 320, 100, 14); fillStroke(ctx, P.wood, 7); ctx.strokeStyle = P.woodDk; ctx.lineWidth = 4; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(-140, -25 + k * 25); ctx.quadraticCurveTo(0, -35 + k * 25, 140, -20 + k * 25); ctx.stroke(); }
  if (bite > 0) { ctx.fillStyle = '#ffe7c7'; for (let k = 0; k < 4; k++) { if (k / 4 > bite) break; circle(ctx, 150 - k * 42, -50 + (k % 2) * 12, 26); ctx.fill(); } }
  ctx.restore();
}
// ===== tanah: penampang sarang rayap (ruang layar). o: { wet 0..1, exit 0..1 (laron keluar), rain 0..1, t, pair 0..1 (ruang raja-ratu), house 0..1 (pondasi rumah di atas) } =====
const GROUND = 640;
function tanahBG(ctx, t, o = {}) {
  const P = LRP; ctx.setTransform(1, 0, 0, 1, 0, 0);
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND); sky.addColorStop(0, '#26305a'); sky.addColorStop(1, '#3b4a78'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, GROUND);
  if (o.house > 0) { ctx.save(); ctx.globalAlpha = o.house; rrect(ctx, 520, GROUND - 520, 620, 520, 0); fillStroke(ctx, '#ffe7c7', 8); rrect(ctx, 640, GROUND - 400, 180, 400, 6); fillStroke(ctx, '#b07a48', 7); rrect(ctx, 880, GROUND - 400, 160, 150, 6); fillStroke(ctx, '#3b4a78', 7);
    ctx.beginPath(); ctx.moveTo(480, GROUND - 520); ctx.lineTo(830, GROUND - 760); ctx.lineTo(1180, GROUND - 520); ctx.closePath(); fillStroke(ctx, '#c4553a', 8); ctx.restore(); }
  if (o.rain > 0) { ctx.save(); ctx.globalAlpha = o.rain; ctx.strokeStyle = '#bfe3ff'; ctx.lineWidth = 4; const r = rng(3); for (let i = 0; i < 60; i++) { const x = r() * W, y = ((r() * GROUND + t * (900 + r() * 300)) % GROUND); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 40); ctx.stroke(); } ctx.restore(); }
  ctx.fillStyle = mixC(P.soil, P.soilWet, clamp(o.wet || 0)); ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = P.grass; ctx.fillRect(0, GROUND - 16, W, 26); line(ctx, 0, GROUND + 10, W, GROUND + 10, 6);
  const r = rng(8); ctx.fillStyle = 'rgba(40,20,10,.25)'; for (let i = 0; i < 70; i++) { circle(ctx, r() * W, GROUND + 40 + r() * (H - GROUND), 4 + r() * 8); ctx.fill(); }
  if (o.wet > 0) { ctx.fillStyle = `rgba(120,190,255,${.25 * o.wet})`; for (let i = 0; i < 40; i++) { circle(ctx, r() * W, GROUND + 40 + r() * 600, 6); ctx.fill(); } }
  // lorong + ruang sarang
  ctx.lineCap = 'round'; ctx.strokeStyle = P.chamber; ctx.lineWidth = 46;
  ctx.beginPath(); ctx.moveTo(300, GROUND); ctx.bezierCurveTo(260, 900, 420, 1100, 380, 1350); ctx.moveTo(380, 1350); ctx.bezierCurveTo(500, 1450, 700, 1350, 780, 1500); ctx.moveTo(380, 1350); ctx.lineTo(240, 1600); ctx.stroke();
  for (const [x, y, rx, ry] of [[380, 1350, 110, 70], [780, 1500, 120, 70], [240, 1600, 100, 60]]) { ellipse(ctx, x, y, rx, ry); ctx.fillStyle = P.chamber; ctx.fill(); }
}
// cicak (tampak atas di dinding). (x,y) = kepala. o: { t, tongue 0..1, rot, face }
function drawCicak(ctx, x, y, s = 1, o = {}) {
  const P = LRP, t = o.t || 0; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-60, 0); ctx.quadraticCurveTo(-160, 30 + Math.sin(t * 3) * 20, -230, -10); ctx.lineWidth = 18; ctx.strokeStyle = P.cicakDk; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 12; ctx.strokeStyle = P.cicak; ctx.stroke();
  for (const [lx, sd] of [[-20, -1], [-20, 1], [-90, -1], [-90, 1]]) { ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx + 16, sd * 40); ctx.lineTo(lx + 30, sd * 44); ctx.lineWidth = 10; ctx.strokeStyle = P.cicakDk; ctx.stroke(); }
  ellipse(ctx, -55, 0, 60, 26); fillStroke(ctx, P.cicak, 5);
  ellipse(ctx, 20, 0, 34, 24); fillStroke(ctx, P.cicak, 5);
  if (o.tongue > 0) line(ctx, 50, 0, 50 + 200 * o.tongue, 0, 7, '#e5537a');
  ctx.restore();
  if (o.face) propFace(ctx, x + Math.cos(o.rot || 0) * 22 * s, y + Math.sin(o.rot || 0) * 22 * s, 36 * s, o.face, { t });
}
