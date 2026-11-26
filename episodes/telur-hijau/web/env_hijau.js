// ---------- Aset episode "Kuning telur rebus hijau" (26-11-2026) ----------
// Aturan v6: satu fungsi per benda, palet HJP terkunci. Dapur memakai set episode Telur (TL, kitchen) supaya rumah konsisten.
const HJP = {
  yolk: '#ffc21a', yolkHi: '#ffe27a', yolkOver: '#f1d27a', ring: '#6f7f3e', ringDk: '#4c5a28', white: '#ffffff', whiteSh: '#ebe4d4',
  sulf: '#ffe14d', sulfDk: '#c9a400', gas: 'rgba(255,236,120,.35)', iron: '#8a3b2a', ironHi: '#c0614a', heat: '255,120,40', ice: '#d9f3ff', iceDk: '#8fd0f0',
  card: '#fffaf0', cardDk: '#2b2f3e',
};

// Telur rebus dibelah (sisi potong menghadap kamera). (x,y) = pusat, r = setengah lebar.
// o: { green 0..1 (tebal cincin hijau), over 0..1 (kuning pucat kelamaan), face (wajah di kuning), t, rot, glint, spooky 0..1 (aura seram) }
function drawTelurBelah(ctx, x, y, r, o = {}) {
  const g = clamp(o.green || 0), ov = clamp(o.over == null ? g : o.over), lw = Math.max(2.5, r * .06), t = o.t || 0;
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  if (o.shadow !== false) { ellipse(ctx, 0, r * 1.05, r * .8, r * .14); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill(); }
  if (o.spooky > 0) { ctx.save(); ctx.globalAlpha = o.spooky * (.6 + .2 * Math.sin(t * 6)); eggPath(ctx, r * 1.25); ctx.fillStyle = 'rgba(120,200,80,.35)'; ctx.fill(); ctx.restore(); }
  eggPath(ctx, r); const wg = ctx.createRadialGradient(-r * .3, -r * .4, r * .1, 0, 0, r * 1.3); wg.addColorStop(0, '#ffffff'); wg.addColorStop(1, HJP.whiteSh); ctx.fillStyle = wg; ctx.fill();
  eggPath(ctx, r); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke();
  const yr = r * .52, yc = r * .12;
  // cincin hijau (di luar kuning, menebal ke dalam)
  circle(ctx, 0, yc, yr); ctx.fillStyle = mixC(HJP.yolk, HJP.yolkOver, ov); ctx.fill();
  if (g > 0) { ctx.save(); circle(ctx, 0, yc, yr); ctx.clip(); ctx.lineWidth = yr * .55 * g; ctx.strokeStyle = HJP.ring; circle(ctx, 0, yc, yr); ctx.stroke();
    ctx.lineWidth = Math.max(1.5, yr * .05); ctx.strokeStyle = HJP.ringDk; circle(ctx, 0, yc, yr - yr * .27 * g); ctx.stroke(); ctx.restore(); }
  circle(ctx, 0, yc, yr); ctx.lineWidth = lw * .8; ctx.strokeStyle = INK; ctx.stroke();
  if (g < .3) { ctx.fillStyle = 'rgba(255,255,255,.55)'; ellipse(ctx, -yr * .35, yc - yr * .4, yr * .22, yr * .12, -.5); ctx.fill(); }
  ctx.restore();
  if (o.face) propFace(ctx, x, y + r * .14, r * .78, o.face, { t, rot: o.rot || 0 });
  if (o.glint != null) glint(ctx, x - r * .3, y - r * .2, r * .9, t, o.glint);
}

// Kartu penanda waktu (jam kecil + teks). (x,y) = pusat. k = muncul 0..1, p = putaran jarum 0..1
function drawKartuWaktu(ctx, x, y, s, str, k = 1, p = 0, col = HJP.card) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); const b = backOut(clamp(k)); ctx.scale(s * b, s * b);
  rrect(ctx, -190, -70, 380, 140, 30); fillStroke(ctx, col, 7);
  circle(ctx, -115, 0, 46); fillStroke(ctx, '#ffffff', 6); const a = p * TAU - Math.PI / 2; line(ctx, -115, 0, -115 + Math.cos(a) * 34, Math.sin(a) * 34, 7, '#e5392f'); line(ctx, -115, 0, -115, -26, 6);
  text(ctx, str, 58, 4, str.length > 8 ? 40 : 54, INK, null, 0); ctx.restore();
}

// ===== dunia mikro: penampang telur raksasa (ruang layar) =====
const MK = { cx: 540, cy: 980, r: 430, ycx: 540, ycy: 1040, yr: 225 };
const SULF = (() => { const r = rng(23), o = []; for (let i = 0; i < 11; i++) { const a = -Math.PI / 2 + (i / 11) * TAU + (r() - .5) * .25; o.push({ a, d: 315 + r() * 40, ph: r() * TAU }); } return o; })();
const IRON = (() => { const r = rng(41), o = []; for (let i = 0; i < 11; i++) { const a = -Math.PI / 2 + (i / 11) * TAU + .12; o.push({ a, d: 150 + r() * 25, ph: r() * TAU }); } return o; })();
function mikroTelurBG(ctx, t, o = {}) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a2a55'); g.addColorStop(1, '#5a3a6a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const heat = clamp(o.heat || 0);
  if (heat > 0) { const rg = ctx.createRadialGradient(MK.cx, MK.cy, MK.r * .9, MK.cx, MK.cy, MK.r * 1.6); rg.addColorStop(0, `rgba(${HJP.heat},${.75 * heat})`); rg.addColorStop(1, `rgba(${HJP.heat},0)`); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + t * .4, q = (t * 1.2 + i * .37) % 1, rr = MK.r * (1.08 + q * .35); ctx.save(); ctx.globalAlpha = heat * (1 - q); ctx.translate(MK.cx + Math.cos(a) * rr, MK.cy + Math.sin(a) * rr * 1.1); ctx.rotate(a + Math.PI / 2);
      ctx.beginPath(); for (let j = 0; j <= 6; j++) ctx.lineTo(Math.sin(j * 1.3 + t * 8) * 8, -j * 9); ctx.lineWidth = 7; ctx.strokeStyle = '#ffb04a'; ctx.stroke(); ctx.restore(); } }
  ctx.save(); ctx.translate(MK.cx, MK.cy); eggPath(ctx, MK.r); ctx.fillStyle = '#fffdf6'; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  const ov = clamp(o.over || 0); circle(ctx, MK.ycx, MK.ycy, MK.yr); fillStroke(ctx, mixC(HJP.yolk, HJP.yolkOver, ov), 10);
  const ring = clamp(o.ring || 0); if (ring > 0) { ctx.save(); circle(ctx, MK.ycx, MK.ycy, MK.yr); ctx.clip(); ctx.lineWidth = 120 * ring; ctx.strokeStyle = HJP.ring; circle(ctx, MK.ycx, MK.ycy, MK.yr); ctx.stroke(); ctx.restore(); circle(ctx, MK.ycx, MK.ycy, MK.yr); fillStroke(ctx, null, 10); }
  const ice = clamp(o.ice || 0);
  if (ice > 0) { ctx.save(); ctx.globalAlpha = .45 * ice; ctx.fillStyle = '#8fd0f0'; ctx.fillRect(0, 0, W, H); ctx.restore();
    const r = rng(5); for (let i = 0; i < 12; i++) { const x = 60 + r() * 960, y0 = -120 + r() * 300, q = clamp(ice * 1.4 - r() * .4); const y = y0 + q * (380 + r() * 1300); ctx.save(); ctx.translate(x, y); ctx.rotate(r() * 2 + q * 2); rrect(ctx, -40, -40, 80, 80, 14); fillStroke(ctx, 'rgba(225,246,255,.85)', 6, '#5fa9d0'); ctx.restore(); } }
}
// partikel belerang (S): pos 0..1 dari tempat asal ke tepi kuning; gas 0..1 = berubah jadi gelembung gas; bond 0..1 = menempel ke besi jadi hijau
function sulfPos(p, move) { const d = lerp(p.d, MK.yr + 30, easeInOut(clamp(move))); return [MK.ycx + Math.cos(p.a) * d, MK.ycy + Math.sin(p.a) * d * 1.02]; }
function drawPartikel(ctx, x, y, r, kind, o = {}) {
  const t = o.t || 0, gas = clamp(o.gas || 0), bond = clamp(o.bond || 0);
  ctx.save(); ctx.translate(x, y);
  if (kind === 'S') {
    if (gas > 0) { ctx.save(); ctx.globalAlpha = gas; circle(ctx, 0, 0, r * 1.5); ctx.fillStyle = HJP.gas; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,230,120,.9)'; ctx.stroke(); ctx.restore(); }
    circle(ctx, 0, 0, r); fillStroke(ctx, mixC(HJP.sulf, HJP.ring, bond), r * .12);
    text(ctx, 'S', 0, r * .08, r * .9, '#fff', INK, r * .14);
  } else {
    circle(ctx, 0, 0, r); fillStroke(ctx, mixC(HJP.iron, HJP.ring, bond), r * .12);
    text(ctx, 'Fe', 0, r * .08, r * .72, '#fff', INK, r * .12);
  }
  ctx.restore();
  if (o.face) propFace(ctx, x, y + r * .55, r * .9, o.face, { t });
}
// label penunjuk kecil di dunia mikro
function labelPanah(ctx, x, y, tx, ty, str, k, col = '#fff') {
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = clamp(k * 2); line(ctx, x, y, lerp(x, tx, k), lerp(y, ty, k), 6, '#fff'); ctx.restore();
  popText(ctx, str, x, y - 20, 58, k, col, INK, -.04);
}
