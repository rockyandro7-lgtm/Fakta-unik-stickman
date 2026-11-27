// ---------- Aset episode "Ekor cicak putus masih joget" (27-11-2026) ----------
// Aturan v6: satu fungsi per benda, palet CKP terkunci, tata letak CK terkunci. Latar = rumahBG (env_jemur.js) siang.
const CKP = {
  body: '#d9c38f', bodyDk: '#a88c55', spot: 'rgba(120,90,40,.35)', belly: '#efe2bd', pad: '#f3d7a8',
  regen: '#9c9688', regenDk: '#74705f', cut: '#f6cfc0', blood: '#d8203a',
  xbg1: '#10234a', xbg2: '#1d3d74', xgrid: 'rgba(140,200,255,.12)', xskin: 'rgba(170,215,255,.16)', xskinLn: '#8fd0ff',
  bone: '#f4f1e6', boneDk: '#c9c2ad', fracture: '#ff4d6d', muscle: 'rgba(255,128,160,.55)', muscleDk: '#e0567f',
  vessel: '#ff3b4f', cart: '#9fe3ff', cartDk: '#4fb3e0',
  cat: '#f0a24a', catDk: '#c67a26', catLt: '#ffe2b8', bird: '#9a6a3c', birdDk: '#6a4423', birdLt: '#f3dcb5', beak: '#ffb02e',
  cal: '#fffaf0', calHead: '#e8453c', frame: '#c68a55',
};
// Tata letak ruang tengah (terkunci). Tokoh s = 600, kaki y = JL.feet (1560). Lantai mulai y = JL.floor (1390).
const CK = { budi: 760, rani: 150, hit: [470, 1130], tail: [470, 1495], cal: [-100, 340] };

// ===== titik-titik ekor. Pangkal di (0,0), arah +x. o: { len, t, wig (joget 0..1), sway (goyang pelan), curl } =====
function ekorPts(o) {
  const L = o.len == null ? 280 : o.len, n = 26, t = o.t || 0, wig = o.wig || 0, sw = o.sway || 0, pts = [];
  for (let i = 0; i <= n; i++) {
    const q = i / n, env = Math.pow(q, .75);
    const y = (wig * L * .17 * Math.sin(q * 7.2 - t * 15) + wig * L * .05 * Math.sin(q * 15 - t * 31) + sw * L * .09 * Math.sin(q * 3 - t * 2.6)) * env + (o.curl || 0) * L * .45 * q * q;
    pts.push([q * L, y]);
  }
  return pts;
}
// ===== EKOR (satu fungsi: menempel / putus + joget / tumbuh ulang). (x,y) = pangkal. o: { t, len, wig, sway, curl, rot, w0, blunt (ekor baru: tumpul + warna beda), cut (ujung potongan terlihat) }
function drawEkor(ctx, x, y, s = 1, o = {}) {
  const P = CKP, pts = ekorPts(o), n = pts.length - 1, w0 = o.w0 || 30, blunt = o.blunt || 0;
  const col = blunt ? mixC(P.body, P.regen, blunt) : P.body, dk = blunt ? mixC(P.bodyDk, P.regenDk, blunt) : P.bodyDk;
  const wAt = q => w0 * (1 - q * lerp(.86, .3, blunt));
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const stroke = (lwf, c) => { for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.lineTo(...pts[i + 1]); ctx.lineWidth = lwf(i / n); ctx.strokeStyle = c; ctx.stroke(); } };
  stroke(q => wAt(q) + 11, INK);
  stroke(q => wAt(q), col);
  // belang (ekor asli) / permukaan polos (ekor baru)
  ctx.lineCap = 'butt';
  for (let i = 2; i < n - 1; i += 4) { const q = i / n; if (blunt > .5) continue; ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.lineTo(...pts[i + 1]); ctx.lineWidth = wAt(q) * .92; ctx.strokeStyle = dk; ctx.stroke(); }
  ctx.lineCap = 'round';
  // kilap
  ctx.globalAlpha = .45; for (let i = 1; i < n - 2; i++) { const q = i / n; ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1] - wAt(q) * .25); ctx.lineTo(pts[i + 1][0], pts[i + 1][1] - wAt(q) * .25); ctx.lineWidth = wAt(q) * .18; ctx.strokeStyle = '#fff6dc'; ctx.stroke(); } ctx.globalAlpha = 1;
  if (o.cut) { ellipse(ctx, 0, pts[0][1], w0 * .22, w0 * .5); fillStroke(ctx, P.cut, 5); }
  ctx.restore();
}
// ===== CICAK (tampak atas, menempel di dinding). (x,y) = tengah badan; rot 0 = kepala ke atas.
// o: { t, walk 0..1, tail (1 = ekor asli, 0 = buntung), regrow 0..1 (ekor baru tumpul), wig, face, eyes:false }
function drawCicakB(ctx, x, y, s = 1, o = {}) {
  const P = CKP, t = o.t || 0, ph = (o.walk || 0) * t * 11, tail = o.tail == null ? 1 : o.tail, rg = o.regrow || 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  // ekor di belakang badan (mengarah ke bawah)
  const tw = Math.sin(ph * .5) * .25 * (o.walk || 0);
  if (tail > 0) drawEkor(ctx, 0, 78, 1, { t, len: 280 * tail, rot: Math.PI / 2 + tw, wig: o.wig || 0, sway: 1, w0: 30 });
  else if (rg > 0) drawEkor(ctx, 0, 78, 1, { t, len: 30 + 175 * rg, rot: Math.PI / 2 + tw, sway: .5, w0: 30, blunt: 1 });
  else { rrect(ctx, -15, 66, 30, 34, 14); fillStroke(ctx, P.body, 6); ellipse(ctx, 0, 98, 11, 5); ctx.fillStyle = P.cut; ctx.fill(); }
  // kaki (4) dengan bantalan jari lengket
  for (const [ly, sd, k] of [[-38, -1, 0], [-38, 1, 1], [52, -1, 1], [52, 1, 0]]) {
    const sw = Math.sin(ph + k * Math.PI) * 18 * (o.walk || 0), front = ly < 0 ? -1 : 1;
    const kx = sd * 74, ky = ly + 8 * front + sw, fx = sd * 100, fy = ly - 34 * (front < 0 ? 1 : -.4) + sw * 1.3;
    ctx.beginPath(); ctx.moveTo(sd * 26, ly); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.lineWidth = 24; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.lineWidth = 14; ctx.strokeStyle = P.body; ctx.stroke();
    for (let j = 0; j < 5; j++) { const a = -Math.PI / 2 * front + sd * (j - 2) * .42 + (front > 0 ? Math.PI : 0) * 0; const tx = fx + Math.cos(a + (sd > 0 ? .3 : -.3)) * 22 * sd * (front < 0 ? 1 : 1), ty = fy + Math.sin(a) * 22;
      line(ctx, fx, fy, tx, ty, 5); circle(ctx, tx, ty, 6.5); fillStroke(ctx, P.pad, 3); }
  }
  // badan
  const bodyP = () => { ctx.beginPath(); ctx.moveTo(0, -78); ctx.bezierCurveTo(46, -74, 46, 60, 16, 84); ctx.lineTo(-16, 84); ctx.bezierCurveTo(-46, 60, -46, -74, 0, -78); ctx.closePath(); };
  bodyP(); ctx.fillStyle = P.body; ctx.fill(); shadeShape(ctx, bodyP, 1, .14, .35, [-46, -80, 92, 166]);
  ctx.fillStyle = P.spot; for (const [sx, sy, r] of [[-14, -40, 7], [12, -18, 6], [-10, 8, 8], [14, 34, 6], [-6, 58, 5]]) { circle(ctx, sx, sy, r); ctx.fill(); }
  bodyP(); fillStroke(ctx, null, 7);
  // kepala
  const headP = () => { ctx.beginPath(); ctx.moveTo(0, -178); ctx.bezierCurveTo(40, -176, 50, -118, 30, -84); ctx.quadraticCurveTo(0, -70, -30, -84); ctx.bezierCurveTo(-50, -118, -40, -176, 0, -178); ctx.closePath(); };
  headP(); ctx.fillStyle = P.body; ctx.fill(); shadeShape(ctx, headP, 1, .12, .35, [-50, -180, 100, 110]); headP(); fillStroke(ctx, null, 7);
  if (!o.face && o.eyes !== false) for (const sd of [-1, 1]) { circle(ctx, sd * 30, -140, 13); fillStroke(ctx, '#fffdf6', 5); circle(ctx, sd * 31, -140, 6); ctx.fillStyle = INK; ctx.fill(); }
  ctx.restore();
  if (o.face) { const r = o.rot || 0, hx = x + Math.sin(r) * 128 * s, hy = y - Math.cos(r) * 128 * s; propFace(ctx, hx, hy, 70 * s, o.face, { t, rot: r }); }
}

// ===== DIAGRAM RONTGEN EKOR (tampak samping, pangkal di kiri). (x,y) = tengah. Satu fungsi untuk adegan tulang, otot, pembuluh, ekor baru.
// o: { t, glow 0..1 (garis retak menyala), split (indeks ruas yang patah), open 0..1 (celah), pull 0..1 (otot menarik),
//      vessel 0..1 (pembuluh terlihat), valve 0..1 (pembuluh menutup di ujung potongan), drip 0..1, stumpOnly, regen 0..1 + regenFrom (ekor baru = tabung tulang rawan), xmark 0..1 }
const TE = { n: 8, x0: -420, step: 112 };
function tulangX(i) { return TE.x0 + 60 + i * TE.step; }
function drawTulangEkor(ctx, x, y, s = 1, o = {}) {
  const P = CKP, t = o.t || 0, n = TE.n, glow = o.glow || 0, pull = o.pull || 0, sp = o.split, open = o.open || 0, rg = o.regen || 0, rf = o.regenFrom == null ? 3 : o.regenFrom;
  const xcut = sp == null ? 9999 : tulangX(sp);
  const xr = rg > 0 ? tulangX(rf) : 9999;               // mulai ekor baru
  const halfH = xx => lerp(118, 52, inv(TE.x0, TE.x0 + 980, xx)) * (xx > xr ? lerp(1, .9, rg) : 1);
  const tipX = rg > 0 ? lerp(TE.x0 + 980, xr + 360, rg) : TE.x0 + 980;
  function body(c) {
    // kulit
    c.beginPath(); c.moveTo(TE.x0, -halfH(TE.x0)); for (let xx = TE.x0; xx <= tipX; xx += 20) c.lineTo(xx, -halfH(xx));
    if (rg > 0) c.arc(tipX, 0, halfH(tipX), -Math.PI / 2, Math.PI / 2); else c.quadraticCurveTo(tipX + 70, 0, tipX, halfH(tipX));
    for (let xx = tipX; xx >= TE.x0; xx -= 20) c.lineTo(xx, halfH(xx)); c.closePath();
    c.fillStyle = P.xskin; c.fill(); c.setLineDash([18, 10]); c.lineWidth = 5; c.strokeStyle = P.xskinLn; c.stroke(); c.setLineDash([]);
    // otot (pita merah muda di atas dan bawah ruas)
    for (let i = 0; i < n; i++) { const cx = tulangX(i) + TE.step / 2; if (cx > (rg > 0 ? tipX - 40 : tipX - 60)) break; const hh = halfH(cx);
      const near = sp != null && Math.abs(i - sp + .5) < 1.1 ? pull : pull * .4, sx = 1 - near * .22;
      for (const sd of [-1, 1]) { ellipse(c, cx, sd * hh * .62, TE.step * .55 * sx, hh * .2); c.fillStyle = near > .5 ? 'rgba(255,90,130,.75)' : P.muscle; c.fill(); c.lineWidth = 3; c.strokeStyle = P.muscleDk; c.stroke(); }
    }
    // pembuluh darah
    if (o.vessel > 0) { c.save(); c.globalAlpha = o.vessel; c.beginPath(); c.moveTo(TE.x0, 26); for (let xx = TE.x0; xx < Math.min(tipX - 50, 9999); xx += 20) c.lineTo(xx, 26 + Math.sin(xx * .02) * 3); c.lineWidth = 18; c.strokeStyle = INK; c.stroke(); c.lineWidth = 11; c.strokeStyle = P.vessel; c.stroke(); c.restore(); }
    // ruas tulang asli
    for (let i = 0; i < n; i++) { const cx = tulangX(i); if (cx > tipX - 50 || cx >= xr) break; const hh = halfH(cx) * .42, w = TE.step * .42;
      c.beginPath(); c.moveTo(cx - w, -hh * .55); c.lineTo(cx - w * .3, -hh * .6); c.lineTo(cx - w * .1, -hh * 1.45); c.lineTo(cx + w * .25, -hh * 1.45); c.lineTo(cx + w * .3, -hh * .6); c.lineTo(cx + w, -hh * .55);
      c.lineTo(cx + w, hh * .55); c.lineTo(cx + w * .3, hh * .6); c.lineTo(cx + w * .1, hh * 1.3); c.lineTo(cx - w * .25, hh * 1.3); c.lineTo(cx - w * .3, hh * .6); c.lineTo(cx - w, hh * .55); c.closePath();
      c.fillStyle = P.bone; c.fill(); c.lineWidth = 5; c.strokeStyle = INK; c.stroke();
      ellipse(c, cx + w, 0, 10, hh * .5); c.fillStyle = P.boneDk; c.fill();
      // garis retak bawaan di tengah ruas
      const gk = glow * (.6 + .4 * Math.sin(t * 8 + i));
      c.save(); c.setLineDash([12, 9]); c.lineWidth = 5 + gk * 4; c.strokeStyle = glow > 0 ? P.fracture : 'rgba(255,77,109,.35)'; c.beginPath(); c.moveTo(cx, -hh * 1.5); c.lineTo(cx, hh * 1.35); c.stroke(); c.restore();
      if (o.xmark > 0 && i >= rf) drawX(c, cx, 0, 34, o.xmark);
    }
    // ekor baru: satu tabung tulang rawan
    if (rg > 0) { const a = xr - TE.step * .3, b = tipX - 40, hh = 26; rrect(c, a, -hh, Math.max(10, b - a), hh * 2, hh); c.fillStyle = P.cart; c.fill(); c.lineWidth = 5; c.strokeStyle = P.cartDk; c.stroke();
      c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(a + 20, -hh * .55, Math.max(0, b - a - 40), 7); }
  }
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (sp == null) body(ctx);
  else {
    ctx.save(); ctx.beginPath(); ctx.rect(-2000, -600, 2000 + xcut, 1200); ctx.clip(); body(ctx); ctx.restore();
    if (!o.stumpOnly) { ctx.save(); ctx.translate(open * 170, open * 40); ctx.rotate(open * .1); ctx.beginPath(); ctx.rect(xcut, -600, 3000, 1200); ctx.clip(); body(ctx); ctx.restore(); }
    // retakan bergerigi saat celah terbuka
    if (open > 0 && open < .15) { ctx.save(); ctx.globalAlpha = 1 - open / .15; burst(ctx, xcut, 0, 70, 9, '#fff6c8', 7); ctx.restore(); }
    // ujung potongan: pembuluh menutup
    if (o.valve != null) { const vr = 13 * (1 - o.valve) + 2; ellipse(ctx, xcut, 26, 9, vr + 6); fillStroke(ctx, P.vessel, 5);
      for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(xcut - 30, 26 + sd * 16); ctx.quadraticCurveTo(xcut - 6, 26 + sd * (vr + 8), xcut + 2, 26 + sd * (vr + 4)); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); }
      if (o.drip > 0) drawTetesDarah(ctx, xcut + 14, 26 + 30 + o.drip * 60, 10 + 8 * (1 - o.valve)); }
  }
  ctx.restore();
}
function drawTetesDarah(ctx, x, y, r) { ctx.beginPath(); ctx.moveTo(x, y - r * 1.8); ctx.quadraticCurveTo(x + r * 1.1, y - r * .2, x, y + r); ctx.quadraticCurveTo(x - r * 1.1, y - r * .2, x, y - r * 1.8); ctx.closePath(); fillStroke(ctx, CKP.blood, Math.max(2, r * .3)); }
// ===== latar rontgen biru =====
function rontgenBG(ctx, t) {
  const P = CKP, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, P.xbg1); g.addColorStop(1, P.xbg2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = P.xgrid; ctx.lineWidth = 3; for (let x = (t * 12) % 90 - 90; x < W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
}

// ===== KUCING (tampak samping, menghadap kiri). (x,y) = lantai di bawah badan. o: { t, crouch 0..1, pounce 0..1, face, flip, headX (kepala ikut gerak) }
function drawKucing(ctx, x, y, s = 1, o = {}) {
  const P = CKP, t = o.t || 0, cr = o.crouch || 0, pc = o.pounce || 0, fl = o.flip || 1, hx0 = o.headX || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * fl, s);
  // ekor
  ctx.beginPath(); ctx.moveTo(100, -70); ctx.bezierCurveTo(190, -80, 160 + Math.sin(t * 4) * 30, -230, 210 + Math.sin(t * 4) * 40, -250); ctx.lineWidth = 34; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 22; ctx.strokeStyle = P.cat; ctx.stroke();
  // kaki
  for (const [lx, k] of [[-70, 0], [-30, 1], [55, 1], [90, 0]]) { const a = pc * (k ? .6 : -.6); ctx.save(); ctx.translate(lx, -50 + cr * 20); ctx.rotate(a); rrect(ctx, -16, 0, 32, 54 - cr * 20, 14); fillStroke(ctx, P.cat, 6); ctx.restore(); }
  // badan
  ellipse(ctx, 10, -92 + cr * 22, 120 * (1 + pc * .25), 58 * (1 - cr * .15)); fillStroke(ctx, P.cat, 7);
  ctx.save(); ellipse(ctx, 10, -92 + cr * 22, 120 * (1 + pc * .25), 58 * (1 - cr * .15)); ctx.clip(); ctx.strokeStyle = P.catDk; ctx.lineWidth = 12; for (const sx of [-20, 20, 60]) { ctx.beginPath(); ctx.moveTo(sx, -160); ctx.quadraticCurveTo(sx + 12, -120, sx, -100); ctx.stroke(); } ctx.restore();
  // kepala
  const hx = -120 - pc * 40 + hx0, hy = -150 + cr * 50;
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx + sd * 50, hy - 30); ctx.lineTo(hx + sd * 46, hy - 98); ctx.lineTo(hx + sd * 8, hy - 58); ctx.closePath(); fillStroke(ctx, P.cat, 6); }
  circle(ctx, hx, hy, 66); fillStroke(ctx, P.cat, 7); ellipse(ctx, hx - 6, hy + 26, 30, 20); ctx.fillStyle = P.catLt; ctx.fill();
  for (const sd of [-1, 1]) for (const dy of [-6, 8]) line(ctx, hx + sd * 40, hy + 22 + dy, hx + sd * 96, hy + 14 + dy * 1.6, 3);
  ctx.restore();
  if (o.face) propFace(ctx, x + fl * hx * s, y + (hy - 6) * s, 82 * s, o.face, { t });
}
// ===== BURUNG pipit (tampak samping, menghadap kiri). (x,y) = tengah badan. o: { t, flap 0..1, face, flip, rot }
function drawBurung(ctx, x, y, s = 1, o = {}) {
  const P = CKP, t = o.t || 0, fl = o.flip || 1, fp = o.flap == null ? 1 : o.flap, wa = Math.sin(t * 22) * .9 * fp;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * fl, s);
  ctx.beginPath(); ctx.moveTo(50, -6); ctx.lineTo(118, -30); ctx.lineTo(116, 12); ctx.closePath(); fillStroke(ctx, P.birdDk, 6);
  ellipse(ctx, 0, 0, 68, 46); fillStroke(ctx, P.bird, 7); ellipse(ctx, -14, 16, 40, 22); ctx.fillStyle = P.birdLt; ctx.fill();
  ctx.save(); ctx.translate(10, -12); ctx.rotate(-.4 + wa); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(40, -90, 90, -70); ctx.quadraticCurveTo(60, -20, 0, 0); ctx.closePath(); fillStroke(ctx, P.birdDk, 6); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-62, -10); ctx.lineTo(-100, 0); ctx.lineTo(-62, 10); ctx.closePath(); fillStroke(ctx, P.beak, 5);
  ctx.restore();
  if (o.face) propFace(ctx, x - fl * 34 * s, y - 8 * s, 48 * s, o.face, { t });
}
// ===== kalender dinding mingguan. (x,y) = paku. page = angka minggu (boleh pecahan: lembar sedang dibalik) =====
function drawKalenderDinding(ctx, x, y, s, page) {
  const P = CKP, cur = Math.floor(page), fq = page - cur;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(ctx, 0, 0, 10); ctx.fillStyle = INK; ctx.fill(); line(ctx, 0, 0, -90, 50, 4); line(ctx, 0, 0, 90, 50, 4);
  rrect(ctx, -130, 50, 260, 300, 14); fillStroke(ctx, P.cal, 7); rrect(ctx, -130, 50, 260, 70, 14); fillStroke(ctx, P.calHead, 7);
  text(ctx, 'MINGGU', 0, 98, 40, '#fff', INK, 0); text(ctx, String(Math.max(1, cur)), 0, 270, 130, INK, null, 0);
  if (fq > 0) { ctx.save(); ctx.translate(0, 120); ctx.scale(1, Math.cos(fq * Math.PI)); rrect(ctx, -126, 0, 252, 226, 10); fillStroke(ctx, fq < .5 ? P.cal : '#e9e1cf', 5); if (fq < .5) text(ctx, String(Math.max(1, cur)), 0, 150, 130, INK, null, 0); ctx.restore(); }
  ctx.restore();
}
// ===== bingkai foto di dinding (isi digambar lewat callback, koordinat lokal) =====
function drawBingkai(ctx, x, y, w, h, label, draw) {
  const P = CKP; ctx.save(); ctx.translate(x, y);
  rrect(ctx, -w / 2 - 22, -h / 2 - 22, w + 44, h + 44, 10); fillStroke(ctx, P.frame, 8);
  rrect(ctx, -w / 2, -h / 2, w, h, 4); fillStroke(ctx, '#fff3d6', 5);
  ctx.save(); rrect(ctx, -w / 2, -h / 2, w, h, 4); ctx.clip(); draw(ctx); ctx.restore();
  if (label) { rrect(ctx, -110, h / 2 - 10, 220, 64, 12); fillStroke(ctx, '#fff', 6); text(ctx, label, 0, h / 2 + 36, 42, INK, null, 0); }
  ctx.restore();
}
