// ---------- compositor: shots, transitions, captions, grade ----------
const canvas = document.getElementById('c'); canvas.width = W; canvas.height = H;
const out = canvas.getContext('2d');
const buf = document.createElement('canvas'); buf.width = W; buf.height = H; const bctx = buf.getContext('2d');
const WARP = window.WARP || null;
function warpMap(x, from, to) { const A = WARP.anchors; if (x <= A[0][from]) return x - A[0][from] + A[0][to]; for (let i = 0; i < A.length - 1; i++) if (x <= A[i + 1][from]) { const k = (x - A[i][from]) / (A[i + 1][from] - A[i][from]); return A[i][to] + k * (A[i + 1][to] - A[i][to]); } const L = A[A.length - 1]; return x - L[from] + L[to]; }
const toOld = t => WARP ? warpMap(t, 1, 0) : t, toNew = t => WARP ? warpMap(t, 0, 1) : t;
const DUR = WARP ? WARP.new_end + 0.6 : SHOTS[SHOTS.length - 1].end;
window.SHOT_SPANS = SHOTS.map((s, i) => [toNew(s.start), i === SHOTS.length - 1 ? DUR : toNew(s.end)]);
const TOTAL_FRAMES = Math.round(DUR * FPS);

// grain tiles
const grains = [];
for (let k = 0; k < 4; k++) { const g = document.createElement('canvas'); g.width = g.height = 256; const gc = g.getContext('2d'); const id = gc.createImageData(256, 256); const R = rng(k + 11); for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (R() - .5) * 120; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } gc.putImageData(id, 0, 0); grains.push(g); }

// captions: 1-3 word chunks
const CHUNKS = (() => {
  const ch = []; let cur = null;
  WORDS.forEach((w, i) => {
    const prev = WORDS[i - 1];
    const brk = !cur || cur.words.length >= 2 || (cur.text + ' ' + w.w).length > 13 || /[.,?!]$/.test(prev ? prev.w : '') || (prev && prev.line !== w.line);
    if (brk) { cur = { words: [w], text: w.w, s: w.s, e: w.e }; ch.push(cur); } else { cur.words.push(w); cur.text += ' ' + w.w; cur.e = w.e; }
  });
  ch.forEach((c, i) => { const n = ch[i + 1]; c.e = n && n.s - c.e < .5 ? n.s : c.e + .25; });
  return ch;
})();
// caption style: all lowercase, no punctuation (hyphens become spaces; letters, digits and % stay)
const capText = s => s.toLowerCase().replace(/[-\u2013\u2014]/g, ' ').replace(/[^\p{L}\p{N}% ]/gu, '').replace(/\s+/g, ' ').trim();
function drawCaption(ctx, t) {
  const c = CHUNKS.find(c => t >= c.s && t < c.e); if (!c) return;
  const k = clamp((t - c.s) / .1); const sc = .82 + .18 * backOut(k);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(540, 1345); ctx.scale(sc, sc);
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 5;
  text(ctx, capText(c.text), 0, 0, 70, '#fff', '#111', 13, 'Poppins', 700);
  ctx.shadowColor = 'transparent'; text(ctx, capText(c.text), 0, 0, 70, '#fff', '#111', 0, 'Poppins', 700);
  ctx.restore();
}
function renderShot(ctx, i, t) {
  const s = SHOTS[i];
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  ctx.save(); s.draw(ctx, t - s.start, t); ctx.restore();
}
function blit(src, dx, blur) {
  // horizontal motion blur by averaging shifted copies
  const n = blur > 2 ? 9 : 1;
  out.save(); out.setTransform(1, 0, 0, 1, 0, 0);
  for (let k = 0; k < n; k++) { const off = n > 1 ? (k / (n - 1) - .5) * blur : 0; out.globalAlpha = 1 / (k + 1); const x = dx + off; out.drawImage(src, x, 0); if (x > 0) out.drawImage(src, x - W, 0); if (x < 0) out.drawImage(src, x + W, 0); }
  out.restore();
}

// ---------- v5 transitions ----------
// Setiap shot boleh punya tr: 'dissolve' | 'portal' | 'match' | 'spin' | 'whip', plus xt (durasi setengah transisi).
//  portal: zoomOut {x,y,r} atau {x,y,w,h} = bukaan (jendela/pintu) di shot ini; shot berikut terlihat DI DALAM bukaan
//          lalu semua membesar bersama dengan laju hampir konstan (~8%/frame) = kamera terbang menembus.
//  match:  menyelam ke bentuk zoomOut {x,y,r} lalu muncul dari bentuk zoomIn {x,y,r} di shot berikut (lingkaran -> lingkaran).
//  spin:   pivot [x,y] + spin (rad): objek di pivot tetap, dunia berayun ke adegan baru (gambar objek yang sama di pivot kedua shot).
const XT_DEF = { dissolve: .14, portal: .4, match: .34, spin: .22 };
const xtOf = sh => sh && XT_DEF[sh.tr] ? (sh.xt || XT_DEF[sh.tr]) : 0;
const buf2 = document.createElement('canvas'); buf2.width = W; buf2.height = H; const bctx2 = buf2.getContext('2d');
function regionK(r) { return Math.hypot(W, H) / 2 / Math.max(8, r) * 1.05; }
function drawScaled(src, cx, cy, k, q, rot = 0, alpha = 1, blurPx = 0) {
  // skala k di sekitar (cx,cy); titik itu bergeser ke tengah layar sebanding q (0..1); putar rot
  const tx = lerp(cx, W / 2, q), ty = lerp(cy, H / 2, q);
  out.save(); out.setTransform(1, 0, 0, 1, 0, 0); out.globalAlpha = alpha; if (blurPx > .5) out.filter = `blur(${blurPx.toFixed(1)}px)`;
  out.translate(tx, ty); out.rotate(rot); out.scale(k, k); out.translate(-cx, -cy); out.drawImage(src, 0, 0); out.restore();
}
function compositeX(X, t) {
  const A = SHOTS[X.a], Bs = SHOTS[X.b], p = X.p;
  renderShot(bctx, X.a, Math.min(t, A.end - 1e-3)); renderShot(bctx2, X.b, Math.max(t, Bs.start));
  out.fillStyle = '#000'; out.fillRect(0, 0, W, H);
  if (X.tr === 'dissolve') { drawScaled(buf, W / 2, H / 2, 1, 0); drawScaled(buf2, W / 2, H / 2, 1, 0, 0, ease(p)); return; }
  if (X.tr === 'portal') {
    const o = A.zoomOut || { x: W / 2, y: H / 2, r: 200 }, rr = o.r || Math.hypot(o.w, o.h) / 2;
    const Ka = Math.max(1.5, o.w ? Math.max(W / o.w, H / o.h) * 1.02 : regionK(rr)); // skala saat bukaan menutup layar
    const e = p * (.7 + .3 * p), k = Math.pow(Ka, e), cx = lerp(o.x, W / 2, e), cy = lerp(o.y, H / 2, e);
    drawScaled(buf, o.x, o.y, k, e, 0, 1, 0);
    out.save(); out.setTransform(1, 0, 0, 1, 0, 0); out.beginPath();
    if (o.w) out.rect(cx - o.w / 2 * k, cy - o.h / 2 * k, o.w * k, o.h * k); else out.arc(cx, cy, rr * k, 0, TAU);
    out.clip(); out.globalAlpha = sstepX(inv(0, .2, p)); const kb = k / Ka; out.translate(cx, cy); out.scale(kb, kb); out.translate(-W / 2, -H / 2); out.drawImage(buf2, 0, 0); out.restore();
    return;
  }
  if (X.tr === 'match') {
    // keluar: menembus area zoomOut (jendela, mulut meriam, lingkaran) sampai memenuhi layar;
    // masuk: mulai dari area zoomIn yang memenuhi layar lalu mundur ke framing normal. Bentuk yang sama = match cut.
    const o = A.zoomOut || { x: W / 2, y: H / 2, r: 160 }, n = Bs.zoomIn || { x: W / 2, y: H / 2, r: 160 };
    const Ka = regionK(o.r), Kb = regionK(n.r);
    // kalibrasi referensi: puncak zoom ~7-10%/frame -> easing kuadrat (bukan kubik); biarkan SHOT mendorong kamera
    // sampai bukaan mengisi ~50% layar, transisi hanya menyelesaikan sisanya
    if (p < .5) { const q = p / .5, e = q * q, k = Math.pow(Ka, e); drawScaled(buf, o.x, o.y, k, e, 0, 1, e * 8); }
    else { const q = (p - .5) / .5, e = (1 - q) * (1 - q), k = Math.pow(Kb, e); drawScaled(buf2, n.x, n.y, k, e, 0, 1, e * 8); }
    const m = inv(.4, .6, p); if (m > 0 && m < 1) { // sambungan lembut 2-3 frame
      if (p < .5) { const e = 1, k = Math.pow(Kb, e); drawScaled(buf2, n.x, n.y, k, e, 0, m); }
      else { drawScaled(buf, o.x, o.y, Ka, 1, 0, 1 - m); }
    }
    return;
  }
  if (X.tr === 'spin') {
    // kamera berayun di sekitar objek yang terkunci (pivot sama di kedua shot): dunia berputar, objek tetap.
    const pa = A.pivot || [W / 2, H / 2], pb = Bs.pivot || pa, ang = A.spin || .7;
    const ea = easeIn(Math.min(1, p / .6)), eb = 1 - easeOut(Math.max(0, (p - .4) / .6));
    const m = sstepX(inv(.35, .65, p)), bl = Math.sin(p * Math.PI) * 14;
    // latar: salinan diperbesar + blur supaya sudut tidak hitam saat frame berputar
    drawScaledPivot(p < .5 ? buf : buf2, p < .5 ? pa : pb, p < .5 ? ang * ea : -ang * eb, 2.3, 1, 24);
    drawScaledPivot(buf, pa, ang * ea, 1 + .12 * ea, 1, bl);
    drawScaledPivot(buf2, pb, -ang * eb, 1 + .12 * eb, m, bl);
    return;
  }
}
const sstepX = x => x * x * (3 - 2 * x);
function drawScaledPivot(src, pv, rot, k, alpha, blurPx) {
  out.save(); out.setTransform(1, 0, 0, 1, 0, 0); out.globalAlpha = alpha; if (blurPx > .5) out.filter = `blur(${blurPx.toFixed(1)}px)`;
  out.translate(pv[0], pv[1]); out.rotate(rot); out.scale(k, k); out.translate(-pv[0], -pv[1]); out.drawImage(src, 0, 0); out.restore();
}
function renderFrame(f) {
  const tNew = f / FPS; const t = Math.min(toOld(tNew), SHOTS[SHOTS.length - 1].end - 1e-3);
  let i = SHOTS.findIndex(s => t >= s.start && t < s.end); if (i < 0) i = SHOTS.length - 1;
  const s = SHOTS[i];
  const WT = .2; // whip half-length (6 frames)
  out.setTransform(1, 0, 0, 1, 0, 0); out.fillStyle = '#000'; out.fillRect(0, 0, W, H);
  let dx = 0, blur = 0, done = false;
  // v5: transisi kamera kontinu (dissolve | zoom | spin), lihat reference/analisis/
  const nx = SHOTS[i + 1], pv = SHOTS[i - 1];
  let X = null; // {a: shot keluar, b: shot masuk, p: 0..1 melintasi batas, tr}
  if (xtOf(s) && nx && t > s.end - xtOf(s)) X = { a: i, b: i + 1, p: .5 * (t - (s.end - xtOf(s))) / xtOf(s), tr: s.tr, B: s.end };
  else if (xtOf(pv) && t < s.start + xtOf(pv)) X = { a: i - 1, b: i, p: .5 + .5 * (t - s.start) / xtOf(pv), tr: pv.tr, B: s.start };
  if (X) { compositeX(X, t); }
  else {
  // outgoing whip
  if (s.tr === 'whip' && i < SHOTS.length - 1 && t > s.end - WT) { const p = easeIn((t - (s.end - WT)) / WT); dx = -p * 420; blur = p * 260; }
  const prev = SHOTS[i - 1];
  if (prev && prev.tr === 'whip' && t < s.start + WT) { const p = 1 - easeOut((t - s.start) / WT); dx = p * 420; blur = p * 260; }
  renderShot(bctx, i, t);
  blit(buf, dx, blur);
  }
  // grade: vignette + grain
  out.save(); out.setTransform(1, 0, 0, 1, 0, 0);
  const g = out.createRadialGradient(540, 900, 500, 540, 960, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,5,20,.32)'); out.fillStyle = g; out.fillRect(0, 0, W, H);
  out.globalCompositeOperation = 'overlay'; out.globalAlpha = .07; const gr = grains[f % 4]; const pat = out.createPattern(gr, 'repeat'); out.fillStyle = pat; out.translate((f * 37) % 256, (f * 91) % 256); out.fillRect(-256, -256, W + 512, H + 512);
  out.restore();
  drawCaption(out, tNew);
}
window.renderFrame = renderFrame; window.TOTAL_FRAMES = TOTAL_FRAMES; window.DUR = DUR;
window.grab = (q = .93) => canvas.toDataURL('image/jpeg', q);
