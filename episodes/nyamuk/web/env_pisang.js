// ---------- Aset episode "Pisang di kulkas: kulit hitam, isi masih bagus" (23-11-2026) ----------
// Aturan v6: satu fungsi per benda, palet PSP terkunci, tata letak PS terkunci. Latar datar satu skala (v7).
const PSP = {
  wallTop: '#cdeef0', wallBot: '#a9dfe4', tile: '#f4fbfb', tileLn: 'rgba(80,150,160,.25)', winSky: '#ffe9a8', winSky2: '#ffc56e', winFrame: '#f6f1e8',
  shelf: '#c68b52', table: '#b9773f', tableHi: '#dc9a5c', cloth: '#3f8fd0', clothLt: '#f6fbff',
  yellow: '#ffd84a', yellowSh: '#e8b12a', green: '#8cc63f', spot: '#6b4220', black: '#2b211d', blackHi: '#5a4636', stem: '#7a5a2a', tip: '#3a2a1a',
  innerY: '#fff2c2', innerB: '#5d4634', flesh: '#fff3d2', fleshSh: '#ecdcae', mush: '#a8743a', mushDk: '#6e4620',
  plate: '#f8f8f4', plateRim: '#d6e2ea', basket: '#d39a55', basketDk: '#9a6630',
  sponge: '#ffd23a', spongeTop: '#3fae5a', dish: '#f4f4ee', dirt: '#b07a3a', sink: '#cfd6e2', sinkDk: '#8f9ab0', water: '#9fd8ff',
  cellWall: '#e8c34a', cellIn: '#fff7cf', cellCold: '#cfe6f2', vac: '#ffe3a0', zat: '#ff9a2e', o2: '#8fd4ff', pig: '#3a2418',
  apple: '#e5392f', appleDk: '#a8231d', appleIn: '#fff3d6', appleBr: '#b07a3a', leaf: '#3f9b4a',
  thermo: '#ffffff', merc: '#e5262a', cold: '#7fc8ff', speedo: '#2b2f3e',
};
// Tata letak dapur (terkunci). Tokoh di belakang meja: y = 1500, s = 600 (kepala sekitar y 1041). Meja 1330.
const PS = { top: 1330, back: 1500, rani: 250, budi: 800, plate: [560, 1330], fridge: [1400, 1500], fridgeS: 1.15, basket: [-330, 1330], ibu: -330,
  window: [540, 560], cal: [130, 560], sink: [-1100, 1330] };

// ===== latar dapur (datar) =====
function dapurPisangBG(ctx, t, cam, o = {}) {
  const P = PSP, F = PS.top; applyCam(ctx, cam, 1);
  const g = ctx.createLinearGradient(0, -300, 0, F); g.addColorStop(0, P.wallTop); g.addColorStop(1, P.wallBot);
  ctx.fillStyle = g; ctx.fillRect(-2600, -2600, 6400, 2600 + F + 10);
  // keramik di belakang meja
  ctx.fillStyle = P.tile; ctx.fillRect(-2600, 860, 6400, F - 860); ctx.strokeStyle = P.tileLn; ctx.lineWidth = 4;
  for (let y = 860; y < F; y += 78) { ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3800, y); ctx.stroke(); }
  for (let x = -2600; x < 3800; x += 78) { ctx.beginPath(); ctx.moveTo(x, 860); ctx.lineTo(x, F); ctx.stroke(); }
  line(ctx, -2600, 860, 3800, 860, 6);
  // jendela siang
  const [wx, wy] = PS.window; rrect(ctx, wx - 220, wy - 200, 440, 360, 20); const sg = ctx.createLinearGradient(0, wy - 200, 0, wy + 160); sg.addColorStop(0, P.winSky); sg.addColorStop(1, P.winSky2); ctx.fillStyle = sg; ctx.fill();
  ctx.save(); rrect(ctx, wx - 220, wy - 200, 440, 360, 20); ctx.clip(); circle(ctx, wx + 110, wy - 60, 56); ctx.fillStyle = '#fff7c8'; ctx.fill();
  ctx.fillStyle = '#7cc46a'; ellipse(ctx, wx - 120, wy + 170, 180, 90); ctx.fill(); ellipse(ctx, wx + 140, wy + 190, 200, 100); ctx.fill(); ctx.restore();
  rrect(ctx, wx - 220, wy - 200, 440, 360, 20); fillStroke(ctx, null, 14, P.winFrame); rrect(ctx, wx - 220, wy - 200, 440, 360, 20); fillStroke(ctx, null, 5);
  line(ctx, wx, wy - 200, wx, wy + 160, 12, P.winFrame); line(ctx, wx - 220, wy - 20, wx + 220, wy - 20, 12, P.winFrame);
  // kalender dinding (MINGGU = waktu cerita)
  const [cx, cy] = PS.cal; ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.03); rrect(ctx, -95, -120, 190, 230, 12); fillStroke(ctx, '#fffaf0', 6);
  rrect(ctx, -95, -120, 190, 58, 12); fillStroke(ctx, '#e5392f', 6); text(ctx, 'NOV', 0, -91, 34, '#fff', INK, 0);
  for (let i = 0; i < 12; i++) { const k = i < (o.days || 0); circle(ctx, -60 + (i % 4) * 40, -30 + Math.floor(i / 4) * 44, 13); fillStroke(ctx, k ? '#ffb0a8' : '#e8eef4', 3); if (k) { line(ctx, -70 + (i % 4) * 40, -40 + Math.floor(i / 4) * 44, -50 + (i % 4) * 40, -20 + Math.floor(i / 4) * 44, 4, '#e5392f'); } }
  ctx.restore();
  // rak gantung kiri dengan toples
  rrect(ctx, -820, 640, 520, 20, 6); fillStroke(ctx, P.shelf, 6);
  [['#ff8a5b', -760], ['#ffd34e', -660], ['#8bd1c4', -560], ['#f06a8a', -440]].forEach(([c, x]) => { rrect(ctx, x, 540, 70, 100, 14); fillStroke(ctx, c, 5); rrect(ctx, x - 4, 530, 78, 20, 6); fillStroke(ctx, '#fffaf0', 4); });
  // kulkas (berdiri di belakang meja, kanan)
  if (o.fridge !== false) drawKulkasPisang(ctx, t, o.fridgeO || {});
}
// Kulkas = drawFridge (env_home) + pisang di rak tengah. o: { door, mood, look, cold, bananas: {black, frost}, count, shake }
function drawKulkasPisang(ctx, t, o = {}) {
  const [x, y] = PS.fridge, s = PS.fridgeS, door = o.door || 0;
  drawFridge(ctx, x, y, s, { door, mood: o.mood || 'happy', look: o.look || 0, cold: o.cold == null ? door : o.cold, t, items: door > .01 ? [[0, 30, 44, 66, '#ff8a5b'], [0, 170, 52, 40, '#6aa8f0'], [2, 30, 60, 46, '#8bd1c4'], [2, 150, 44, 60, '#ffd34e']] : [], shake: o.shake });
  if (door > .01 && (o.count == null || o.count > 0)) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rrect(ctx, -136, -440, 272, 414, 18); ctx.clip();
    drawSisir(ctx, 10, -232, .62, Object.assign({ n: 3, t }, o.bananas || {}));
    ctx.restore();
  }
}
// Meja makan + taplak (digambar SETELAH tokoh supaya kaki tertutup).
function mejaPisang(ctx) {
  const P = PSP, F = PS.top;
  rrect(ctx, -2600, F, 6400, 46, 10); fillStroke(ctx, P.table, 8); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(-2590, F + 8, 6380, 7);
  ctx.save(); ctx.beginPath(); ctx.rect(-2600, F + 42, 6400, 2400); ctx.clip(); ctx.fillStyle = P.clothLt; ctx.fillRect(-2600, F + 42, 6400, 2400);
  ctx.fillStyle = 'rgba(63,143,208,.5)'; for (let x = -2600; x < 3800; x += 120) ctx.fillRect(x, F + 42, 60, 2400); for (let y = F + 42; y < F + 2400; y += 120) ctx.fillRect(-2600, y, 6400, 60);
  ctx.fillStyle = 'rgba(10,30,60,.18)'; ctx.fillRect(-2600, F + 42, 6400, 22); ctx.restore(); line(ctx, -2600, F + 42, 3800, F + 42, 7);
}

// ===== pisang =====
// SATU fungsi untuk pisang: hijau -> kuning -> bertotol -> hitam (kulit), utuh -> dikupas (daging padat/lembek).
// Bentuk dasar TEGAK (tangkai di atas). (x,y) = pusat. Untuk pisang tergeletak pakai rot = +-PI/2.
// o: { fleshShade 0..1 (daging tertutup bayangan), rot, green 0..1, spots 0..1, black 0..1, frost 0..1, droop 0..1 (lemas), peel 0..1 (kulit terbuka dari atas), mush 0..1 (daging lembek cokelat),
//      inner 'y'|'b' (warna sisi dalam kulit), face, faceFlesh, t, glow }
const SPOTS = (() => { const r = rng(41), o = []; for (let i = 0; i < 26; i++) o.push({ u: -.85 + r() * 1.7, v: (r() - .5) * 1.4, s: .35 + r() * .65, a: r() * TAU, k: r() }); return o; })();
const PBL = 110, PBW = 36;   // setengah panjang, setengah lebar
const bCx = (u, bend) => -bend * 46 * (1 - u * u);
const bHw = u => PBW * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 3.2)), .55) * (u > 0 ? 1 - .15 * u : 1);
function bananaPath(ctx, bend, y0 = -1, y1 = 1, wk = 1) {
  const L = [], R = [];
  for (let i = 0; i <= 24; i++) { const u = lerp(y0, y1, i / 24), c = bCx(u, bend), w = bHw(u) * wk; L.push([c - w, u * PBL]); R.push([c + w, u * PBL]); }
  ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]); L.forEach(p => ctx.lineTo(p[0], p[1])); for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]); ctx.closePath();
}
const peelCol = o => mixC(mixC(PSP.yellow, PSP.green, o.green || 0), PSP.black, clamp(o.black || 0));
function drawPisang(ctx, x, y, s = 1, o = {}) {
  const t = o.t || 0, bend = 1 + .9 * (o.droop || 0), peel = clamp(o.peel || 0), col = peelCol(o);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  if (o.glow > 0) { ctx.save(); ctx.globalAlpha = .5 * o.glow; circle(ctx, 0, 0, 170); const gg = ctx.createRadialGradient(0, 0, 20, 0, 0, 170); gg.addColorStop(0, '#fff7c0'); gg.addColorStop(1, 'rgba(255,247,192,0)'); ctx.fillStyle = gg; ctx.fill(); ctx.restore(); }
  const cut = lerp(-1, .25, peel);        // batas kulit (u): di atas cut daging terlihat
  const inner = o.inner === 'b' ? PSP.innerB : PSP.innerY;
  const flesh = mixC(PSP.flesh, PSP.mush, clamp(o.mush || 0));
  const flaps = (front) => {
    // 3 lidah kulit, berengsel di garis cut: 0 = tegak menutup daging, 1 = menggantung ke bawah di luar
    if (peel <= .02) return;
    const len = (cut + 1) * PBL * 1.02, base = cut * PBL, open = easeOut(clamp(peel * 1.25));
    [[-1, 0], [1, 0], [0, 1]].forEach(([sd, fr]) => {
      if (!!fr !== front) return;
      const hx = bCx(cut, bend) + sd * bHw(cut) * .72, ang = sd === 0 ? open * (Math.PI - .12) : sd * open * (Math.PI - .5);
      ctx.save(); ctx.translate(hx, base); ctx.rotate(ang); const wd = sd === 0 ? 20 : 17;
      ctx.beginPath(); ctx.moveTo(-wd, 0); ctx.quadraticCurveTo(-wd * 1.2, -len * .55, -3, -len); ctx.quadraticCurveTo(3, -len * 1.03, 5, -len); ctx.quadraticCurveTo(wd * 1.2, -len * .55, wd, 0); ctx.closePath();
      const showInner = Math.abs(ang) > Math.PI / 2;
      fillStroke(ctx, showInner && sd !== 0 ? inner : col, 5);
      if (showInner && sd !== 0 && o.mush > .3) { ctx.fillStyle = PSP.mushDk; ellipse(ctx, 0, -len * .35, 9, 16); ctx.fill(); }
      ctx.restore();
    });
  };
  flaps(false);
  // daging (di atas cut)
  if (peel > .02) {
    ctx.save(); ctx.beginPath(); ctx.rect(-200, -PBL - 40, 400, (cut + 1) * PBL + 42); ctx.clip();
    const sagF = 1 + .5 * (o.mush || 0);
    ctx.save(); ctx.translate(0, cut * PBL); ctx.scale(1 + .25 * (o.mush || 0), 1 / sagF * (1 + .0)); ctx.translate(0, -cut * PBL);
    bananaPath(ctx, bend * (1 + .8 * (o.mush || 0)), -.98, cut + .05, .82); fillStroke(ctx, flesh, 5);
    if (o.fleshShade > 0) { ctx.save(); ctx.globalAlpha = clamp(o.fleshShade); bananaPath(ctx, bend * (1 + .8 * (o.mush || 0)), -.98, cut + .05, .82); ctx.fillStyle = '#3a2a22'; ctx.fill(); ctx.restore(); }
    ctx.save(); bananaPath(ctx, bend, -.98, cut + .05, .82); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,.45)'; ellipse(ctx, -14, -PBL * .5, 8, PBL * .3, .1); ctx.fill();
    if (o.mush > 0) { ctx.globalAlpha = clamp(o.mush); ctx.fillStyle = PSP.mushDk; SPOTS.slice(0, 10).forEach(p => { ellipse(ctx, bCx(p.u * .5 - .5, bend) + p.v * 20, (p.u * .5 - .5) * PBL, 12 * p.s, 16 * p.s, p.a); ctx.fill(); }); }
    ctx.restore(); ctx.restore(); ctx.restore();
  }
  // kulit utuh (di bawah cut)
  ctx.save(); bananaPath(ctx, bend, cut, 1); ctx.fillStyle = col; ctx.fill();
  ctx.clip(); ctx.fillStyle = 'rgba(40,20,0,.14)'; ctx.fillRect(4, -PBL - 10, 80, PBL * 2 + 20);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ellipse(ctx, bCx(.2, bend) - 18, .2 * PBL, 6, PBL * .5, .05); ctx.fill();
  const ns = Math.round((o.spots || 0) * SPOTS.length);
  ctx.fillStyle = PSP.spot; for (let i = 0; i < ns; i++) { const p = SPOTS[i]; if (p.u < cut) continue; ellipse(ctx, bCx(p.u, bend) + p.v * bHw(p.u) * .7, p.u * PBL, 5 + 7 * p.s, 4 + 5 * p.s, p.a); ctx.fill(); }
  if (o.black > .3) { ctx.strokeStyle = `rgba(110,85,60,${.5 * clamp(o.black)})`; ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { const u = -.7 + i * .28; if (u < cut) continue; ctx.beginPath(); ctx.moveTo(bCx(u, bend) - bHw(u) * .6, u * PBL); ctx.quadraticCurveTo(bCx(u, bend), u * PBL + 6, bCx(u, bend) + bHw(u) * .5, u * PBL - 4); ctx.stroke(); } }
  ctx.restore();
  bananaPath(ctx, bend, cut, 1); fillStroke(ctx, null, 6);
  // rusuk kulit
  ctx.save(); bananaPath(ctx, bend, cut, 1); ctx.clip(); ctx.beginPath(); for (let i = 0; i <= 20; i++) { const u = lerp(Math.max(cut, -.95), .95, i / 20); i ? ctx.lineTo(bCx(u, bend) + bHw(u) * .25, u * PBL) : ctx.moveTo(bCx(u, bend) + bHw(u) * .25, u * PBL); } ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(60,30,10,.22)'; ctx.stroke(); ctx.restore();
  // ujung bawah & tangkai
  circle(ctx, bCx(1, bend), PBL - 2, 7); fillStroke(ctx, PSP.tip, 3);
  if (peel <= .02) { ctx.save(); ctx.translate(bCx(-1, bend), -PBL); rrect(ctx, -9, -34, 18, 38, 5); fillStroke(ctx, mixC(PSP.stem, PSP.black, clamp(o.black || 0) * .7), 5); ctx.restore(); }
  flaps(true);
  // embun beku
  if (o.frost > 0) { ctx.save(); ctx.globalAlpha = clamp(o.frost); bananaPath(ctx, bend, cut, 1); ctx.clip(); ctx.fillStyle = 'rgba(220,240,255,.35)'; ctx.fillRect(-120, -PBL, 240, PBL * 2);
    for (let i = 0; i < 9; i++) { const p = SPOTS[i * 2]; snowflake(ctx, bCx(p.u, bend) + p.v * 20, p.u * PBL, 9 + 6 * p.s, p.a + t * .5); } ctx.restore(); }
  ctx.restore();
  if (o.face) propFace(ctx, x + Math.cos(o.rot || 0) * -14 * s, y + Math.sin(o.rot || 0) * -14 * s + 20 * s, 64 * s, o.face, { t });
  if (o.faceFlesh && peel > .3) { const fy = y + lerp(-PBL, cut * PBL, .5) * s; propFace(ctx, x - 14 * s, fy, 46 * s, o.faceFlesh, { t }); }
}
function snowflake(ctx, x, y, r, a = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); for (let k = 0; k < 3; k++) { line(ctx, -r, 0, r, 0, Math.max(2, r * .28), '#ffffff'); ctx.rotate(Math.PI / 3); } ctx.restore(); }
// Sesisir pisang: n buah, tangkai bersama di kiri. (x,y) = pusat. o: diteruskan ke drawPisang (kecuali n, face pada buah tengah)
function drawSisir(ctx, x, y, s = 1, o = {}) {
  const n = o.n || 4; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = n - 1; i >= 0; i--) { const k = n === 1 ? 0 : i / (n - 1) - .5; drawPisang(ctx, 20, k * 70 + 10, 1, Object.assign({}, o, { rot: -Math.PI / 2 + k * .35, face: i === Math.floor(n / 2) ? o.face : null })); }
  rrect(ctx, -150, -40, 50, 80, 14); fillStroke(ctx, mixC(PSP.stem, PSP.black, clamp(o.black || 0) * .7), 6);
  ctx.restore();
}
// Piring saji. (x,y) = tengah dasar (permukaan meja).
function drawPiringPisang(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, -10, 260, 46); fillStroke(ctx, PSP.plateRim, 7); ellipse(ctx, 0, -14, 200, 30); fillStroke(ctx, PSP.plate, 4); ctx.restore(); }
// Keranjang buah (depan), inside(ctx) digambar di antara dinding belakang dan depan. (x,y) = tengah dasar.
function drawKeranjang(ctx, x, y, s = 1, inside) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, -150, 210, 40); fillStroke(ctx, PSP.basketDk, 6);
  if (inside) inside(ctx);
  ctx.beginPath(); ctx.moveTo(-210, -150); ctx.quadraticCurveTo(-200, 0, -120, 0); ctx.lineTo(120, 0); ctx.quadraticCurveTo(200, 0, 210, -150); ctx.quadraticCurveTo(0, -100, -210, -150); ctx.closePath(); fillStroke(ctx, PSP.basket, 7);
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(110,60,20,.45)'; ctx.lineWidth = 6; for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(i * 26, -160); ctx.lineTo(i * 26 + 30, 0); ctx.stroke(); } for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.moveTo(-220, -110 + j * 34); ctx.quadraticCurveTo(0, -80 + j * 34, 220, -110 + j * 34); ctx.stroke(); } ctx.restore();
  ctx.beginPath(); ctx.moveTo(-210, -150); ctx.quadraticCurveTo(0, -100, 210, -150); ctx.lineWidth = 12; ctx.strokeStyle = PSP.basketDk; ctx.stroke();
  ctx.restore();
}
// Spons cuci piring. (x,y) = pusat
function drawSpons(ctx, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rrect(ctx, -70, -20, 140, 64, 14); fillStroke(ctx, PSP.sponge, 6); rrect(ctx, -70, -44, 140, 30, 10); fillStroke(ctx, PSP.spongeTop, 6);
  ctx.fillStyle = 'rgba(160,110,0,.35)'; for (let i = 0; i < 8; i++) { circle(ctx, -50 + (i % 4) * 32, 2 + Math.floor(i / 4) * 22, 5); ctx.fill(); }
  ctx.restore();
}
// Tumpukan piring kotor. (x,y) = tengah dasar. n piring, o: { t, dirt 0..1, wob }
function drawTumpukPiring(ctx, x, y, s = 1, n = 8, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const t = o.t || 0;
  for (let i = 0; i < n; i++) { const dx = Math.sin(i * 1.7 + t * 3 * (o.wob || 0)) * 10 * (o.wob || 0) * (i / n), yy = -i * 26;
    ellipse(ctx, dx, yy - 10, 150, 26); fillStroke(ctx, PSP.dish, 6); ellipse(ctx, dx, yy - 14, 100, 14); fillStroke(ctx, '#e8e8e0', 3);
    if (i === n - 1 && (o.dirt || 0) > 0) { ctx.fillStyle = PSP.dirt; ellipse(ctx, dx - 30, yy - 18, 26, 8); ctx.fill(); ellipse(ctx, dx + 40, yy - 12, 14, 6); ctx.fill(); } }
  ctx.restore();
}
// Wastafel + keran mengalir (latar akhir). (x,y) = tengah atas bak
function drawWastafel(ctx, x, y, s = 1, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const t = o.t || 0;
  rrect(ctx, -330, -20, 660, 60, 14); fillStroke(ctx, PSP.sink, 7);
  rrect(ctx, 150, -230, 40, 210, 12); fillStroke(ctx, '#b9c2d3', 6); rrect(ctx, 40, -250, 150, 40, 18); fillStroke(ctx, '#b9c2d3', 6);
  if (o.water) { ctx.fillStyle = PSP.water; ctx.fillRect(48, -212, 28, 200); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.strokeRect(48, -212, 28, 200); for (let i = 0; i < 4; i++) { const q = (t * 2 + i * .25) % 1; circle(ctx, 62 + Math.sin(i * 3) * 30 * q, -10 - 40 * q, 8 * (1 - q)); ctx.fillStyle = '#fff'; ctx.fill(); } }
  ctx.restore();
}
// ===== dunia mikro: sel kulit pisang =====
// Sel berwajah: dinding (kotak membulat), isi kental, kantong (vakuola) berisi butir "zat". (x,y) = pusat, r = setengah lebar.
// o: { cold 0..1 (biru, kristal), crack 0..1, leak 0..1 (isi keluar), dark 0..1 (berubah hitam), face, t, seed }
function drawSel(ctx, x, y, r, o = {}) {
  const t = o.t || 0, cr = clamp(o.crack || 0), lk = clamp(o.leak || 0), dk = clamp(o.dark || 0), cold = clamp(o.cold || 0);
  ctx.save(); ctx.translate(x, y);
  const wob = Math.sin(t * 4 + (o.seed || 0)) * 3 * (1 - cold);
  rrect(ctx, -r, -r * .85 + wob, r * 2, r * 1.7, r * .45);
  ctx.fillStyle = mixC(mixC(PSP.cellIn, PSP.cellCold, cold), PSP.pig, dk * .85); ctx.fill(); ctx.lineWidth = r * .14; ctx.strokeStyle = mixC(mixC(PSP.cellWall, '#9cc8e0', cold), '#4a3020', dk); ctx.stroke();
  rrect(ctx, -r, -r * .85 + wob, r * 2, r * 1.7, r * .45); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke();
  // vakuola + butir zat
  const vr = r * .48 * (1 - .4 * lk);
  if (vr > 4) { circle(ctx, r * .3, r * .15, vr); ctx.fillStyle = mixC(PSP.vac, PSP.pig, dk); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(34,28,34,.6)'; ctx.stroke(); }
  for (let i = 0; i < 5; i++) { const a = i * 1.3 + (o.seed || 0), d = vr * .5; circle(ctx, r * .3 + Math.cos(a) * d, r * .15 + Math.sin(a) * d, r * .08); ctx.fillStyle = mixC(PSP.zat, PSP.pig, dk); ctx.fill(); }
  // retak
  if (cr > 0) { ctx.save(); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-r * .2, -r * .85); ctx.lineTo(-r * .05, -r * .85 + r * .5 * cr); ctx.lineTo(-r * .3, -r * .85 + r * .85 * cr); ctx.moveTo(r, r * .1); ctx.lineTo(r - r * .4 * cr, r * .25); ctx.stroke(); ctx.restore(); }
  // kristal es
  if (cold > 0) { ctx.save(); ctx.globalAlpha = cold; for (let i = 0; i < 4; i++) snowflake(ctx, -r * .7 + i * r * .45, -r * .55 + (i % 2) * r * 1.0, r * .14, i + t * .3); ctx.restore(); }
  ctx.restore();
  if (o.face) propFace(ctx, x - r * .35, y + r * .1, r * .9, o.face, { t });
}
// latar jaringan kulit (dunia mikro). o: { dark 0..1, cold 0..1 }
function jaringanBG(ctx, t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mixC(mixC('#fff0b0', '#d8eefa', o.cold || 0), '#3a2418', (o.dark || 0) * .8)); g.addColorStop(1, mixC(mixC('#f5c84a', '#a9d3ee', o.cold || 0), '#26160e', (o.dark || 0) * .85));
  ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3);
  ctx.save(); ctx.globalAlpha = .25; for (let i = 0; i < 40; i++) { const x = (i * 263) % (W + 200) - 100, y = (i * 419) % (H + 200) - 100; rrect(ctx, x - 80, y - 60, 160, 120, 40); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); } ctx.restore();
}
// gelembung udara (O2) berwajah kecil
function drawO2(ctx, x, y, r, o = {}) { circle(ctx, x, y, r); fillStroke(ctx, PSP.o2, r * .12); ctx.fillStyle = 'rgba(255,255,255,.7)'; ellipse(ctx, x - r * .35, y - r * .35, r * .22, r * .14, -.6); ctx.fill(); text(ctx, 'O₂', x, y + r * .08, r * .8, '#1f4f7a', INK, 0); }
// gumpalan pigmen hitam
function drawPigmen(ctx, x, y, r, k = 1) { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, rr = r * (.8 + .25 * Math.sin(i * 2.3)); i ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); fillStroke(ctx, PSP.pig, r * .12); ctx.restore(); }
// ===== benda penjelas =====
// Termometer tegak dengan garis 13 derajat. (x,y) = pusat bola bawah. v = suhu (derajat C), o: { mark13 0..1, t }
function drawTermoPisang(ctx, x, y, s, v, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const yOf = d => -60 - (d / 35) * 560;
  rrect(ctx, -46, -680, 92, 680, 46); fillStroke(ctx, PSP.thermo, 8);
  const lv = yOf(clamp(v, -2, 36)); const col = mixC(PSP.cold, PSP.merc, inv(4, 25, v));
  rrect(ctx, -20, lv, 40, -lv, 20); ctx.fillStyle = col; ctx.fill();
  circle(ctx, 0, 0, 80); fillStroke(ctx, col, 8);
  for (const d of [0, 10, 20, 30]) { line(ctx, 30, yOf(d), 46, yOf(d), 5); text(ctx, d + '°', 100, yOf(d), 40, INK, null, 0); }
  if ((o.mark13 || 0) > 0) { ctx.save(); ctx.globalAlpha = clamp(o.mark13); line(ctx, -130, yOf(13), 130, yOf(13), 10, '#e5262a'); text(ctx, '13°', -210, yOf(13), 70, '#e5262a', INK, 12); ctx.restore(); }
  ctx.restore();
}
// Apel digigit: bekas gigitan berubah cokelat. (x,y) = pusat. o: { brown 0..1, bite 0..1, face, t }
function drawApel(ctx, x, y, r, o = {}) {
  ctx.save(); ctx.translate(x, y); const bite = clamp(o.bite == null ? 1 : o.bite);
  ctx.beginPath(); ctx.moveTo(0, -r * .7); ctx.bezierCurveTo(r * .9, -r * 1.25, r * 1.35, -r * .1, r * .9, r * .65); ctx.bezierCurveTo(r * .6, r * 1.05, r * .2, r * .95, 0, r * .85);
  ctx.bezierCurveTo(-r * .2, r * .95, -r * .6, r * 1.05, -r * .9, r * .65); ctx.bezierCurveTo(-r * 1.35, -r * .1, -r * .9, -r * 1.25, 0, -r * .7); ctx.closePath();
  ctx.save(); ctx.clip(); ctx.fillStyle = PSP.apple; ctx.fillRect(-r * 2, -r * 2, r * 4, r * 4); ctx.fillStyle = 'rgba(80,0,0,.2)'; ctx.fillRect(r * .3, -r * 2, r * 2, r * 4);
  if (bite > 0) { // gigitan di sisi kanan
    ctx.beginPath(); for (let i = 0; i < 4; i++) ctx.arc(r * 1.05, -r * .35 + i * r * .32, r * .3 * bite, 0, TAU); ctx.fillStyle = mixC(PSP.appleIn, PSP.appleBr, clamp(o.brown || 0)); ctx.fill(); }
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(0, -r * .7); ctx.bezierCurveTo(r * .9, -r * 1.25, r * 1.35, -r * .1, r * .9, r * .65); ctx.bezierCurveTo(r * .6, r * 1.05, r * .2, r * .95, 0, r * .85);
  ctx.bezierCurveTo(-r * .2, r * .95, -r * .6, r * 1.05, -r * .9, r * .65); ctx.bezierCurveTo(-r * 1.35, -r * .1, -r * .9, -r * 1.25, 0, -r * .7); ctx.closePath(); ctx.lineWidth = r * .06; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.4)'; ellipse(ctx, -r * .5, -r * .35, r * .14, r * .26, .5); ctx.fill();
  line(ctx, 0, -r * .7, r * .08, -r * 1.05, r * .09, '#6b4220'); ctx.save(); ctx.translate(r * .12, -r * .98); ctx.rotate(-.5); ellipse(ctx, r * .18, 0, r * .2, r * .09); fillStroke(ctx, PSP.leaf, r * .04); ctx.restore();
  ctx.restore();
  if (o.face) propFace(ctx, x - r * .2, y + r * .1, r * .9, o.face, { t: o.t || 0 });
}
// Speedometer "PEMATANGAN" + pedal rem. (x,y) = pusat. v 0..1 (jarum), brake 0..1 (pedal ditekan)
function drawSpeedo(ctx, x, y, s, v, brake = 0, label = 'PEMATANGAN') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -260, -230, 520, 400, 40); fillStroke(ctx, PSP.speedo, 10);
  ctx.beginPath(); ctx.arc(0, 60, 210, Math.PI, TAU); ctx.closePath(); fillStroke(ctx, '#f6f1e8', 6);
  for (const [a0, a1, c] of [[0, .4, '#7fc8ff'], [.4, .7, '#ffd23a'], [.7, 1, '#e8453c']]) { ctx.beginPath(); ctx.arc(0, 60, 180, Math.PI + a0 * Math.PI, Math.PI + a1 * Math.PI); ctx.lineWidth = 26; ctx.strokeStyle = c; ctx.lineCap = 'butt'; ctx.stroke(); }
  for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; line(ctx, Math.cos(a) * 150, 60 + Math.sin(a) * 150, Math.cos(a) * 130, 60 + Math.sin(a) * 130, 5); }
  const a = Math.PI + clamp(v, -.02, 1.02) * Math.PI; line(ctx, 0, 60, Math.cos(a) * 165, 60 + Math.sin(a) * 165, 14, '#e5262a'); circle(ctx, 0, 60, 22); fillStroke(ctx, INK, 0);
  text(ctx, label, 0, 125, 48, '#fff', INK, 0);
  // pedal rem
  ctx.save(); ctx.translate(0, 300); ctx.rotate(.35 * brake); rrect(ctx, -110, -40, 220, 80, 18); fillStroke(ctx, '#3a3f52', 8); text(ctx, 'REM', 0, 2, 46, '#ffd23a', INK, 0); ctx.restore();
  ctx.restore();
}
