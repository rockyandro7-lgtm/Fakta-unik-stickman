// ---------- Fakta Unik: dapur kerupuk (wajan, kompor, kerupuk mentah -> mengembang, dandang, adonan, tampah, dunia mikro) ----------
// Aturan v6 (konsistensi): SATU fungsi per aset + palet terkunci KRP + tata letak terkunci KR.
// Kerupuk mentah, irisan gel basah, dan kerupuk mengembang = SATU fungsi drawKerupuk (opsi dry/p), supaya bentuknya nyambung antar shot.
const KRP = {
  raw: '#efc66e', rawDk: '#c98f34', puff: '#fff4dc', puffDk: '#ecd3a2', wetGel: '#cfc6b4', wetGelDk: '#a69c88',
  wok: '#33343f', wokHi: '#626678', oil: '#f4b83c', oilDk: '#d98c22', oilHi: '#ffe08a',
  stove: '#d5dae4', stoveDk: '#9aa3b5', flameO: '#ff9f2e', flameB: '#4aa3ff',
  dough: '#fbf8f0', doughDk: '#ddd6c6', gel: '#c9bfae', gelDk: '#9f9584', gelHi: '#f3eee4',
  sack: '#f1e6cc', sackDk: '#cdbb92', water: '#5fb8f2', waterDk: '#2f86c9',
  bamboo: '#dcb46e', bambooDk: '#b08442', metal: '#cfd6e3', metalDk: '#97a2b8',
  matrix: '#efb94e', matrixDk: '#c98a2a', matrixLine: 'rgba(160,90,20,.35)', crisp: '#fff1d2', crispDk: '#e2c28c',
  steam: '#ffffff', drop: '#6cc2ff', dropDk: '#2d8fd6',
};
// Tata letak dapur (terkunci). Meja depan = dapurMeja() (DAPUR.top = 1330), tokoh di belakang meja (y = 1500).
const KR = { top: 1330, back: 1500, wok: [560, 1112], stove: [560, 1330], ibu: 140, budi: 960, prep: -380, sack: -650, basin: -380, jug: -150 };  // area siapkan adonan di kiri (x < 0)

// Campur dua warna hex -> hex (aman untuk dicampur bertingkat).
function mixC(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(t))).toString(16).padStart(2, '0')).join(''); }
// Kerupuk. (x,y) = pusat. o: { p 0..1 (mentah -> mengembang), dry 0..1 (irisan gel basah -> kering kaca), tilt (1 = menghadap kamera, .35 = rebah),
//   rot, face, t, seed, wet (melengkung lembek), crack (retak kering), glass (kilau kaca), alpha }
function kerupukShape(ctx, R, p, seed) {
  const n = 64; ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const a = i / n * TAU;
    const w = 1 + (.025 + .04 * p) * Math.sin(a * 7 + seed) + (.02 + .025 * p) * Math.sin(a * 11 + seed * 2.3) + .012 * p * Math.sin(a * 19 + seed * .7);
    const x = Math.cos(a) * R * w, y = Math.sin(a) * R * w; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
}
function drawKerupuk(ctx, x, y, s = 1, o = {}) {
  const p = clamp(o.p || 0), dry = o.dry == null ? 1 : clamp(o.dry), seed = o.seed || 1, t = o.t || 0;
  const R = 100 * (1 + .85 * easeOut(p));
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s * (o.tilt || 1));
  if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  if (o.wet) { ctx.transform(1, 0, -o.wet * .25, 1 - o.wet * .18, 0, 0); }
  const sh = () => kerupukShape(ctx, R, p, seed);
  // warna: basah (abu kusam) -> kering (amber kaca) -> mengembang (krem)
  const base = mixC(mixC(KRP.wetGel, KRP.raw, dry), KRP.puff, easeOut(p)), dk = mixC(mixC(KRP.wetGelDk, KRP.rawDk, dry), KRP.puffDk, easeOut(p));
  // tebal (sisi bawah) supaya terasa 3D, makin tebal saat mengembang
  ctx.save(); ctx.translate(0, 8 + 22 * p); sh(); fillStroke(ctx, dk, 7); ctx.restore();
  sh(); ctx.fillStyle = base; ctx.fill();
  ctx.save(); sh(); ctx.clip();
  // pola spiral (mentah) memudar, permukaan gelembung (mengembang) muncul
  const spA = (1 - p) * .55;
  if (spA > .02) { ctx.beginPath(); for (let a = 0; a < 26; a += .12) { const r = 6 + a * 3.55, px = Math.cos(a + seed) * r, py = Math.sin(a + seed) * r; a ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.lineWidth = 6; ctx.strokeStyle = `rgba(150,90,20,${spA * (.4 + .6 * dry)})`; ctx.stroke(); }
  if (p > .05) { const r = rng(seed + 7); for (let i = 0; i < 26; i++) { const a = r() * TAU, d = Math.sqrt(r()) * R * .85, rr = (8 + r() * 16) * (R / 140) * p; ellipse(ctx, Math.cos(a) * d, Math.sin(a) * d, rr, rr * .8); ctx.fillStyle = `rgba(214,170,100,${.45 * p})`; ctx.fill(); ellipse(ctx, Math.cos(a) * d - rr * .3, Math.sin(a) * d - rr * .3, rr * .35, rr * .25); ctx.fillStyle = `rgba(255,255,255,${.7 * p})`; ctx.fill(); } }
  // bayangan sel
  ctx.fillStyle = 'rgba(80,40,10,.13)'; ctx.fillRect(R * .25, -R * 2, R * 2, R * 4);
  // kilau kaca (kering)
  const gl = (o.glass == null ? dry : o.glass) * (1 - p);
  if (gl > .02) { ctx.globalAlpha *= gl; ctx.beginPath(); ctx.moveTo(-R * .7, -R * .2); ctx.lineTo(-R * .2, -R * .75); ctx.lineTo(-R * .02, -R * .62); ctx.lineTo(-R * .55, -R * .05); ctx.closePath(); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fill(); ellipse(ctx, R * .05, -R * .5, R * .09, R * .06); ctx.fill(); ctx.globalAlpha /= gl; }
  ctx.restore();
  sh(); fillStroke(ctx, null, 7);
  if (o.crack) { ctx.save(); ctx.globalAlpha *= clamp(o.crack); path(ctx, [[-R * .6, -R * .1], [-R * .2, R * .05], [-R * .05, -R * .25], [R * .3, -R * .1], [R * .55, R * .3]], false); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); path(ctx, [[-R * .05, -R * .25], [R * .05, -R * .65]], false); ctx.stroke(); ctx.restore(); }
  ctx.restore();
  if (o.face) propFace(ctx, x, y - 4 * s, (70 + 50 * p) * s, o.face, { t });
}

// Kompor gas di atas meja. (x,y) = tengah dasar. o: { fire 0..1, t }
function drawStove(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0, f = clamp(o.fire == null ? 1 : o.fire); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 240, 18); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  const b = () => rrect(ctx, -220, -112, 440, 112, 18); b(); ctx.fillStyle = KRP.stove; ctx.fill(); shadeShape(ctx, b, 1, .16, .3, [-220, -112, 440, 112]); b(); fillStroke(ctx, null, 7);
  rrect(ctx, -200, -128, 400, 22, 8); fillStroke(ctx, '#3a3d4a', 6);
  for (const kx of [-150, 150]) { circle(ctx, kx, -56, 22); fillStroke(ctx, '#3a3d4a', 6); line(ctx, kx, -56, kx + 12, -72, 6, '#fff'); }
  rrect(ctx, -60, -82, 120, 50, 10); fillStroke(ctx, '#eef1f6', 5); text(ctx, 'GAS', 0, -57, 26, INK, INK, 0);
  if (f > 0) for (let i = 0; i < 9; i++) {
    const fx = -96 + i * 24, h = (34 + 16 * Math.sin(t * 17 + i * 1.7)) * f;
    ctx.beginPath(); ctx.moveTo(fx - 10, -128); ctx.quadraticCurveTo(fx - 6, -128 - h * .6, fx, -128 - h); ctx.quadraticCurveTo(fx + 6, -128 - h * .6, fx + 10, -128); ctx.closePath(); fillStroke(ctx, KRP.flameB, 3);
    ctx.beginPath(); ctx.moveTo(fx - 5, -128); ctx.quadraticCurveTo(fx, -128 - h * .45, fx + 5, -128); ctx.closePath(); ctx.fillStyle = '#c9ecff'; ctx.fill();
  }
  ctx.restore();
}
// Wajan berisi minyak. (x,y) = pusat bibir wajan. inside(ctx) digambar DI ANTARA minyak dan bibir depan (benda di dalam wajan).
// o: { t, heat 0..1 (gelembung + uap panas), face, sizzle 0..1 }
function drawWok(ctx, x, y, s = 1, o = {}, inside) {
  const t = o.t || 0, hot = clamp(o.heat == null ? 1 : o.heat); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // gagang
  for (const sx of [-1, 1]) { ctx.save(); ctx.scale(sx, 1); rrect(ctx, 236, -22, 56, 28, 12); fillStroke(ctx, '#5a3a24', 6); ctx.restore(); }
  // mangkuk wajan
  ctx.beginPath(); ctx.moveTo(-260, 0); ctx.quadraticCurveTo(-230, 128, 0, 132); ctx.quadraticCurveTo(230, 128, 260, 0); ctx.closePath(); fillStroke(ctx, KRP.wok, 8);
  ctx.save(); ctx.beginPath(); ctx.moveTo(-260, 0); ctx.quadraticCurveTo(-230, 128, 0, 132); ctx.quadraticCurveTo(230, 128, 260, 0); ctx.closePath(); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(-220, 20, 60, 120); ctx.restore();
  // dalam wajan + minyak
  ellipse(ctx, 0, 0, 260, 58); fillStroke(ctx, '#23242c', 8);
  ctx.save(); ellipse(ctx, 0, 0, 252, 52); ctx.clip();
  const oil = o.oil == null ? 1 : o.oil;
  if (oil >= 1) { ellipse(ctx, 0, 14, 226, 40); const g = ctx.createLinearGradient(0, -30, 0, 50); g.addColorStop(0, KRP.oilHi); g.addColorStop(1, KRP.oil); ctx.fillStyle = g; ctx.fill(); }
  else { const g = ctx.createRadialGradient(0, 20, 10, 0, 20, 230); g.addColorStop(0, '#4a4b56'); g.addColorStop(1, '#23242c'); ctx.fillStyle = g; ctx.fillRect(-260, -60, 520, 130); ctx.globalAlpha = .55 * oil + .1; ellipse(ctx, 0, 22, 150, 22); ctx.fillStyle = KRP.oilHi; ctx.fill(); ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(255,255,255,.18)'; ellipse(ctx, -90, -6, 70, 8, -.15); ctx.fill(); }
  if (hot > 0) { const r = rng(9); for (let i = 0; i < Math.round(18 * Math.min(1, oil)); i++) { const bx = (r() - .5) * 380, by = 14 + (r() - .5) * 52, ph = (t * (1.5 + r()) + r()) % 1; circle(ctx, bx, by, (3 + 7 * ph) * hot); ctx.lineWidth = 3; ctx.strokeStyle = `rgba(255,255,255,${.8 * (1 - ph) * hot})`; ctx.stroke(); } }
  ctx.restore();
  // v7: isi wajan hanya terlihat di atas bibir wajan atau di dalam lingkar wajan (tidak menembus badan wajan)
  if (inside) { ctx.save(); ctx.beginPath(); ctx.rect(-3000, -4000, 6000, 4000); ctx.ellipse(0, 0, 250, 50, 0, 0, TAU); ctx.clip(); inside(ctx); ctx.restore(); }
  // bibir depan (menutupi bagian bawah benda di dalam)
  ctx.beginPath(); ctx.ellipse(0, 0, 260, 58, 0, .05, Math.PI - .05); ctx.lineWidth = 16; ctx.strokeStyle = KRP.wok; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 0, 268, 64, 0, .05, Math.PI - .05); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
  if (o.face) propFace(ctx, 0, 78, 120, o.face, { t });
  // gelombang panas
  if (hot > .2) for (let i = 0; i < 3; i++) { const q = (t * .6 + i * .33) % 1; ctx.save(); ctx.globalAlpha = (1 - q) * .45 * hot; ctx.beginPath(); for (let j = 0; j <= 10; j++) { const yy = -40 - q * 160 - j * 14, xx = -120 + i * 120 + Math.sin(t * 5 + j * .8 + i) * 12; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 9; ctx.strokeStyle = '#ffd9a0'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
// Karung tepung. (x,y) = tengah dasar. o: { rot (miring menuang), face, t, label }
function drawSack(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
  const b = () => { ctx.beginPath(); ctx.moveTo(-95, 0); ctx.quadraticCurveTo(-118, -120, -82, -230); ctx.lineTo(82, -230); ctx.quadraticCurveTo(118, -120, 95, 0); ctx.closePath(); };
  b(); ctx.fillStyle = KRP.sack; ctx.fill(); shadeShape(ctx, b, 1, .16, .32, [-118, -230, 236, 230]); b(); fillStroke(ctx, null, 7);
  path(ctx, [[-82, -230], [-60, -262], [-30, -236], [0, -266], [30, -236], [60, -262], [82, -230]]); fillStroke(ctx, KRP.sackDk, 6);
  rrect(ctx, -70, -150, 140, 54, 10); fillStroke(ctx, '#e5262a', 5); text(ctx, o.label || 'TAPIOKA', 0, -122, 28, '#fff', INK, 0);
  if (o.face) propFace(ctx, 0, -60, 100, o.face, { t: o.t || 0 });
  ctx.restore();
}
// Teko air plastik. (x,y) = tengah dasar. o: { rot }
function drawJug(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
  ctx.beginPath(); ctx.arc(70, -110, 50, -Math.PI / 2, Math.PI / 2); ctx.lineWidth = 22; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 12; ctx.strokeStyle = KRP.waterDk; ctx.stroke();
  const b = () => { ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-62, -190); ctx.lineTo(-96, -214); ctx.lineTo(62, -200); ctx.lineTo(70, 0); ctx.closePath(); };
  b(); ctx.fillStyle = 'rgba(200,236,255,.9)'; ctx.fill();
  ctx.save(); b(); ctx.clip(); ctx.fillStyle = KRP.water; ctx.fillRect(-120, -130, 240, 140); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(-50, -180, 18, 170); ctx.restore();
  b(); fillStroke(ctx, null, 7);
  ctx.restore();
}
// Baskom adonan. (x,y) = tengah dasar. o: { fill 0..1, mix 0..1 (tepung putih -> adonan), dough 0..1 (adonan menggumpal di atas) }
function drawBasin(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 150, 14); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  ellipse(ctx, 0, -120, 160, 34); fillStroke(ctx, '#e8eef6', 7);
  const f = clamp(o.fill || 0);
  if (f > 0) { ellipse(ctx, 0, -120 + 18 * (1 - f), 140 * (.6 + .4 * f), 26 * (.6 + .4 * f)); fillStroke(ctx, lerpC('#fffefa', KRP.dough, o.mix || 0), 5); if (o.mix > 0 && o.mix < 1) { ctx.beginPath(); ctx.arc(0, -118, 50, 0, TAU * o.mix * 3); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(150,170,200,.5)'; ctx.stroke(); } }
  if (o.dough > 0) { ctx.save(); ctx.translate(0, -126); ctx.scale(o.dough, o.dough); ctx.beginPath(); ctx.moveTo(-90, 10); ctx.quadraticCurveTo(-92, -60, 0, -64); ctx.quadraticCurveTo(92, -60, 90, 10); ctx.closePath(); fillStroke(ctx, KRP.dough, 6); ctx.fillStyle = 'rgba(255,255,255,.8)'; ellipse(ctx, -30, -40, 22, 10); ctx.fill(); ctx.restore(); }
  const b = () => { ctx.beginPath(); ctx.moveTo(-160, -120); ctx.quadraticCurveTo(-150, 0, -70, 0); ctx.lineTo(70, 0); ctx.quadraticCurveTo(150, 0, 160, -120); ctx.ellipse(0, -120, 160, 34, 0, 0, Math.PI, false); ctx.closePath(); };
  b(); ctx.fillStyle = '#ff8a5b'; ctx.fill(); shadeShape(ctx, b, 1, .18, .3, [-160, -154, 320, 154]); b(); fillStroke(ctx, null, 7);
  ctx.fillStyle = 'rgba(255,255,255,.4)'; rrect(ctx, -120, -96, 40, 14, 7); ctx.fill();
  ctx.restore();
}
// Adonan gelondong (seperti lontong). (x,y) = pusat. o: { cook 0..1 (putih bertepung -> gel abu mengilap), stretch (tarikan karet, 0 = normal),
//   core 0..1 (inti putih mentah di penampang = kukus kurang), cut 0..1 (bagian kanan sudah diiris), face, t, rot }
function drawLog(ctx, x, y, s = 1, o = {}) {
  const c = clamp(o.cook || 0), st = o.stretch || 0, L = 210 * (1 + st), Rr = 62 * (1 - .28 * st);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  ellipse(ctx, 0, Rr + 10, L * .9, 14); ctx.fillStyle = 'rgba(40,20,30,.18)'; ctx.fill();
  const xr = L * (1 - .9 * clamp(o.cut || 0)) - L * .0;
  const neck = st > 0 ? .55 : 1;
  const b = () => { ctx.beginPath(); ctx.moveTo(-L, -Rr); ctx.quadraticCurveTo(0, -Rr * neck, xr, -Rr); ctx.lineTo(xr, Rr); ctx.quadraticCurveTo(0, Rr * neck, -L, Rr); ctx.closePath(); };
  const col = lerpC(KRP.dough, KRP.gel, c), dk = lerpC(KRP.doughDk, KRP.gelDk, c);
  b(); ctx.fillStyle = col; ctx.fill(); shadeShape(ctx, () => b(), 1, .0, .3, [-L, -Rr, L * 2, Rr * 2]);
  ctx.save(); b(); ctx.clip(); ctx.fillStyle = `rgba(60,40,20,${.12})`; ctx.fillRect(-L - 10, Rr * .3, L * 2 + 20, Rr);
  ctx.fillStyle = `rgba(255,255,255,${.25 + .5 * c})`; rrect(ctx, -L * .8, -Rr * .62, L * 1.3, Rr * .22, Rr * .11); ctx.fill();
  if (c < .6) { const r = rng(3); ctx.fillStyle = `rgba(255,255,255,${.7 * (1 - c / .6)})`; for (let i = 0; i < 30; i++) { circle(ctx, (r() - .5) * L * 2, (r() - .5) * Rr * 1.8, 4 + r() * 4); ctx.fill(); } }
  ctx.restore(); b(); fillStroke(ctx, null, 7);
  ellipse(ctx, -L, 0, Rr * .34, Rr); fillStroke(ctx, dk, 7);
  ellipse(ctx, xr, 0, Rr * .34, Rr); fillStroke(ctx, lerpC('#fffefa', KRP.gelHi, c), 7);
  if (o.core > 0) { ellipse(ctx, xr, 0, Rr * .2, Rr * .55 * o.core); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(34,28,34,.4)'; ctx.stroke(); }
  ctx.restore();
  if (o.face) propFace(ctx, x - 40 * s, y - 2 * s, 100 * s, o.face, { t: o.t || 0 });
}
// Dandang (kukusan). (x,y) = tengah dasar. o: { t, steam 0..1, lift (tutup terangkat px), cut 0..1 (jendela potongan memperlihatkan isi), inside(ctx) }
function drawDandang(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 0, 200, 16); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  for (const sx of [-1, 1]) { rrect(ctx, sx * 196 - 30, -250, 60, 26, 13); fillStroke(ctx, '#38405a', 6); }
  const b = () => rrect(ctx, -180, -330, 360, 330, [10, 10, 40, 40]);
  b(); const gg = ctx.createLinearGradient(-180, 0, 180, 0); gg.addColorStop(0, '#eef2fa'); gg.addColorStop(1, KRP.metalDk); ctx.fillStyle = gg; ctx.fill(); b(); fillStroke(ctx, null, 8);
  line(ctx, -180, -150, 180, -150, 6, 'rgba(34,28,34,.45)');
  rrect(ctx, -150, -310, 30, 260, 14); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fill();
  const cut = clamp(o.cut || 0);
  if (cut > 0) { ctx.save(); ctx.globalAlpha *= cut; rrect(ctx, -140, -300, 280, 140, 18); fillStroke(ctx, '#3b3f52', 6); ctx.save(); rrect(ctx, -136, -296, 272, 132, 16); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(-140, -300, 280, 140); if (o.inside) o.inside(ctx); ctx.restore(); rrect(ctx, -140, -300, 280, 140, 18); fillStroke(ctx, null, 6); ctx.restore(); }
  rrect(ctx, -192, -350, 384, 28, 12); fillStroke(ctx, '#eef2fa', 7);
  ctx.save(); ctx.translate(0, -350 - (o.lift || 0)); ctx.rotate(o.lidRot || 0);
  ctx.beginPath(); ctx.moveTo(-176, 0); ctx.quadraticCurveTo(-166, -96, 0, -100); ctx.quadraticCurveTo(166, -96, 176, 0); ctx.closePath(); fillStroke(ctx, '#dfe5f1', 7);
  circle(ctx, 0, -110, 18); fillStroke(ctx, '#38405a', 6); ctx.restore();
  if (o.face) propFace(ctx, 0, -80, 130, o.face, { t });
  if (o.steam > 0) for (let i = 0; i < 5; i++) { const p = (t * .5 + i * .21) % 1; puff(ctx, (i - 2) * 56 + Math.sin(t * 3 + i * 2) * 18, -400 - (o.lift || 0) - p * 320, 30 + p * 44, t, '#ffffff', i + 3, (1 - p) * .9 * Math.min(1, o.steam)); }
  ctx.restore();
}
// Tampah bambu (perspektif). (x,y) = pusat. o: { t } ; items(ctx) digambar di atas anyaman.
function drawTampah(ctx, x, y, s = 1, o = {}, items) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 30, 340, 70); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  ellipse(ctx, 0, 0, 330, 110); fillStroke(ctx, KRP.bamboo, 8);
  ctx.save(); ellipse(ctx, 0, 0, 312, 100); ctx.clip(); ctx.strokeStyle = 'rgba(140,90,30,.4)'; ctx.lineWidth = 5;
  for (let i = -16; i <= 16; i++) { ctx.beginPath(); ctx.moveTo(i * 26 - 120, -120); ctx.lineTo(i * 26 + 120, 120); ctx.stroke(); ctx.beginPath(); ctx.moveTo(i * 26 + 120, -120); ctx.lineTo(i * 26 - 120, 120); ctx.stroke(); }
  ctx.restore(); ellipse(ctx, 0, 0, 312, 100); ctx.lineWidth = 10; ctx.strokeStyle = KRP.bambooDk; ctx.stroke();
  if (items) items(ctx);
  ctx.restore();
}
// Pisau. (x,y) = pangkal bilah; rot.
function drawKnife(ctx, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -150, -18, 130, 36, 12); fillStroke(ctx, '#5a3a24', 6);
  ctx.beginPath(); ctx.moveTo(-20, -24); ctx.lineTo(210, -24); ctx.quadraticCurveTo(230, 10, 190, 26); ctx.lineTo(-20, 26); ctx.closePath(); fillStroke(ctx, KRP.metal, 6);
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(0, -16, 180, 8); ctx.restore();
}
// Serok (saringan gorengan). (x,y) = pusat jaring.
function drawSerok(ctx, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  line(ctx, 90, 0, 420, 0, 18, INK); line(ctx, 90, 0, 420, 0, 10, '#c68a55');
  ellipse(ctx, 0, 0, 100, 34); fillStroke(ctx, 'rgba(200,210,225,.35)', 6);
  ctx.save(); ellipse(ctx, 0, 0, 100, 34); ctx.clip(); ctx.strokeStyle = 'rgba(34,28,34,.35)'; ctx.lineWidth = 3; for (let i = -6; i <= 6; i++) { line(ctx, i * 16, -40, i * 16, 40, 3, 'rgba(34,28,34,.35)'); line(ctx, -110, i * 8, 110, i * 8, 3, 'rgba(34,28,34,.35)'); } ctx.restore();
  ctx.restore();
}
function drawMatahari(ctx, x, y, r, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(t * .3);
  for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); path(ctx, [[r * 1.15, -r * .14], [r * 1.6, 0], [r * 1.15, r * .14]]); fillStroke(ctx, '#ffb43a', r * .06); }
  ctx.restore(); circle(ctx, x, y, r); fillStroke(ctx, '#ffd84a', r * .08);
}
// Halaman jemur: langit, matahari, pagar, rumput. sunP 0..1 = posisi matahari (pagi -> sore).
function halamanBG(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, 1);   // v7: datar, satu skala (tidak ada parallax zoom)
  const g = ctx.createLinearGradient(0, -600, 0, 1300); g.addColorStop(0, '#3ea6ee'); g.addColorStop(1, '#c9ecfb'); ctx.fillStyle = g; ctx.fillRect(-3000, -3000, 7000, 4500);
  drawCloud(ctx, 200 + t * 12, 300, 90, 3); drawCloud(ctx, 820 - t * 8, 520, 70, 5);
  const sp = o.sunP == null ? .4 : o.sunP; drawMatahari(ctx, lerp(-60, 1140, sp), 420 - Math.sin(sp * Math.PI) * 220, 100, t);
  for (let x = -2000; x < 3000; x += 110) { rrect(ctx, x, 880, 70, 320, [30, 30, 0, 0]); fillStroke(ctx, '#fff3dc', 6); }
  rrect(ctx, -2040, 960, 5100, 30, 6); fillStroke(ctx, '#e7d3ae', 5); rrect(ctx, -2040, 1110, 5100, 30, 6); fillStroke(ctx, '#e7d3ae', 5);
  ctx.fillStyle = '#7cc95a'; ctx.fillRect(-3000, 1200, 7000, 3000);
  ctx.fillStyle = '#69b74a'; for (let x = -2900; x < 3900; x += 90) { path(ctx, [[x, 1210], [x + 18, 1160], [x + 30, 1210]]); ctx.fill(); }
  // meja jemur (kaki kayu)
  rrect(ctx, 180, 1330, 30, 300, 6); fillStroke(ctx, '#8a5a34', 6); rrect(ctx, 870, 1330, 30, 300, 6); fillStroke(ctx, '#8a5a34', 6);
}

// ===== DUNIA MIKRO (di dalam irisan kerupuk) =====
// Latar: jaringan gel kaca (amber). o: { heat 0..1 (tepi oranye panas), crisp 0..1 (gel mengeras jadi krem renyah), soft 0..1 (bergoyang lembek) }
function microBG(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, 1);
  const cr = clamp(o.crisp || 0), base = lerpC(KRP.matrix, KRP.crisp, cr);
  ctx.fillStyle = base; ctx.fillRect(-2600, -2600, 6400, 6400);
  const r = rng(21), sw = (o.soft || 0) * 10;
  ctx.strokeStyle = cr > .5 ? 'rgba(180,130,60,.35)' : KRP.matrixLine; ctx.lineWidth = 5;
  for (let i = 0; i < 70; i++) { const x0 = r() * 2400 - 700, y0 = r() * 3200 - 700, a = r() * TAU, l = 120 + r() * 220; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + Math.cos(a + 1) * l * .5 + Math.sin(t * 4 + i) * sw, y0 + Math.sin(a + 1) * l * .5, x0 + Math.cos(a) * l, y0 + Math.sin(a) * l); ctx.stroke(); }
  ctx.fillStyle = `rgba(255,255,255,${.12 * (1 - cr)})`; for (let i = 0; i < 25; i++) { ellipse(ctx, r() * 2400 - 700, r() * 3200 - 700, 30 + r() * 60, 10 + r() * 14, r()); ctx.fill(); }
  const h = clamp(o.heat || 0); if (h > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const g = ctx.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 1150); g.addColorStop(0, 'rgba(255,90,20,0)'); g.addColorStop(1, `rgba(255,90,20,${.55 * h * (.85 + .15 * Math.sin(t * 9))})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}
// Tetes air berwajah. (x,y) = pusat bulatan. o: { face, t, hot 0..1 (kemerahan), wob }
function drawDrop(ctx, x, y, r, o = {}) {
  if (o.alpha != null && o.alpha <= 0) return;
  ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha; ctx.translate(x, y); const wb = 1 + (o.wob || 0) * Math.sin((o.t || 0) * 30) * .06; ctx.scale(wb, 1 / wb);
  ctx.beginPath(); ctx.moveTo(0, -r * 1.55); ctx.quadraticCurveTo(r * .95, -r * .55, r, r * .05); ctx.arc(0, 0, r, 0, Math.PI); ctx.quadraticCurveTo(-r * .95, -r * .55, 0, -r * 1.55); ctx.closePath();
  fillStroke(ctx, lerpC(KRP.drop, '#ff8a6a', clamp(o.hot || 0)), r * .1);
  ellipse(ctx, -r * .42, -r * .35, r * .16, r * .28, .4); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fill();
  ctx.restore();
  if (o.face) propFace(ctx, x, y + r * .1, r * 1.25, o.face, { t: o.t || 0, alpha: o.alpha });
}
// Gelembung uap berwajah (bulat berbulu). (x,y) = pusat. o: { face, t, seed, alpha }
function drawSteamBall(ctx, x, y, r, o = {}) {
  const t = o.t || 0, seed = o.seed || 1; ctx.save(); if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  const sh = () => { ctx.beginPath(); const n = 40; for (let i = 0; i <= n; i++) { const a = i / n * TAU, w = 1 + .06 * Math.sin(a * 9 + t * 6 + seed) + .03 * Math.sin(a * 5 - t * 4); const px = x + Math.cos(a) * r * w, py = y + Math.sin(a) * r * w; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); };
  sh(); fillStroke(ctx, KRP.steam, Math.max(4, r * .06));
  ctx.save(); sh(); ctx.clip(); ctx.fillStyle = 'rgba(160,200,235,.35)'; ctx.beginPath(); ctx.arc(x + r * .25, y + r * .25, r * .95, 0, TAU); ctx.arc(x, y, r * 1.2, 0, TAU, true); ctx.fill(); ctx.restore();
  ellipse(ctx, x - r * .4, y - r * .45, r * .2, r * .12, -.5); ctx.fillStyle = 'rgba(255,255,255,1)'; ctx.fill();
  ctx.restore();
  if (o.face) propFace(ctx, x, y, r * 1.1, o.face, { t, alpha: o.alpha });
}
// Rongga udara (sarang lebah) yang tumbuh. p 0..1 = besar rongga; cr 0..1 = dinding mengeras (krem). (cx,cy) pusat, w,h area.
function drawPores(ctx, cx, cy, w, h, p, t, cr = 0, seed = 5) {
  if (p <= 0) return; const r = rng(seed), step = 120, pts = [];
  for (let y = -h / 2; y <= h / 2; y += step * .86) for (let x = -w / 2; x <= w / 2; x += step) pts.push([cx + x + ((Math.round(y / (step * .86)) % 2) ? step / 2 : 0) + (r() - .5) * 40, cy + y + (r() - .5) * 40, .7 + r() * .5, r()]);
  for (const [x, y, k, d] of pts) {
    const q = clamp((p - d * .35) / .65); if (q <= 0) continue; const rr = step * .55 * k * easeOut(q);
    ellipse(ctx, x, y, rr, rr * .92, d * 3); ctx.fillStyle = lerpC('#fffaf0', '#fff7e6', cr); ctx.fill();
    ctx.lineWidth = 6 + 4 * cr; ctx.strokeStyle = lerpC('#c98a2a', '#b98a50', cr); ctx.stroke();
    ellipse(ctx, x - rr * .3, y - rr * .3, rr * .25, rr * .14, -.5); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill();
  }
}
// Panah dorong (gaya uap). (x,y) pangkal, ang, len, a.
function pushArrow(ctx, x, y, ang, len, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang);
  path(ctx, [[0, -14], [len - 34, -14], [len - 34, -32], [len, 0], [len - 34, 32], [len - 34, 14], [0, 14]]); fillStroke(ctx, '#ffffff', 6); ctx.restore();
}
// Teks bunyi di dunia (TOK, KRIUK, CESS). Huruf tebal miring dengan garis tinta.
function sfxText(ctx, str, x, y, size, k, col = '#ffd23a', rot = -.12) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const sc = backOut(clamp(k)); ctx.scale(sc, sc);
  text(ctx, str, 0, 0, size, col, INK, size * .2); ctx.restore();
}
// Gumpalan adonan mentah (tepung + air, belum dikukus). (x,y) = tengah dasar. o: { face, t, squash, puff (coba mengembang 0..1) }
function drawDoughLump(ctx, x, y, s = 1, o = {}) {
  const sq = o.squash || 0, pf = o.puff || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + sq * .2 + pf * .08), s * (1 - sq * .2 + pf * .1));
  const b = () => { ctx.beginPath(); ctx.moveTo(-110, 0); ctx.quadraticCurveTo(-130, -70, -70, -100); ctx.quadraticCurveTo(-20, -130, 30, -104); ctx.quadraticCurveTo(110, -96, 112, -30); ctx.quadraticCurveTo(116, 0, 90, 0); ctx.closePath(); };
  b(); ctx.fillStyle = KRP.dough; ctx.fill(); shadeShape(ctx, b, 1, .14, .35, [-130, -130, 246, 130]); b(); fillStroke(ctx, null, 7);
  const r = rng(4); ctx.fillStyle = 'rgba(200,190,170,.6)'; for (let i = 0; i < 14; i++) { circle(ctx, -80 + r() * 170, -80 + r() * 70, 3 + r() * 4); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,.9)'; ellipse(ctx, -50, -80, 24, 10, -.3); ctx.fill();
  ctx.restore();
  if (o.face) propFace(ctx, x, y - 52 * s, 110 * s, o.face, { t: o.t || 0 });
}
