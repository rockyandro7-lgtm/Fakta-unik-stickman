// ---------- Fakta Unik: body / health props (fan, wind, clipboard, skin section, back + coin, stomach, battery, heart, ECG, IGD) ----------
const SKIN_C = '#f5c9a0', SKIN_D = '#e6a77c';

function drawFan(ctx, x, y, s, t, on = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 6, 150, 18); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  ellipse(ctx, 0, -10, 120, 30); fillStroke(ctx, '#5b6685', 7);
  rrect(ctx, -16, -470, 32, 460, 14); fillStroke(ctx, '#e9edf5', 7);
  rrect(ctx, -46, -520, 92, 70, 24); fillStroke(ctx, '#5b6685', 7);
  const hy = -640, R = 190;
  circle(ctx, 0, hy, R); ctx.fillStyle = 'rgba(210,235,255,.55)'; ctx.fill();
  ctx.save(); ctx.translate(0, hy); ctx.rotate(t * 22 * on);
  for (let i = 0; i < 3; i++) { ctx.rotate(TAU / 3); ctx.beginPath(); ctx.ellipse(0, -88, 52, 92, .35, 0, TAU); fillStroke(ctx, '#4ab3f0', 6); }
  ctx.restore();
  ctx.save(); ctx.translate(0, hy); ctx.strokeStyle = INK; ctx.lineWidth = 4;
  for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 30, Math.sin(a) * 30); ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); ctx.stroke(); }
  circle(ctx, 0, 0, R * .55); ctx.stroke(); ctx.restore();
  circle(ctx, 0, hy, R); fillStroke(ctx, null, 9);
  circle(ctx, 0, hy, 34); fillStroke(ctx, '#ff6a3c', 7);
  ctx.restore();
}

// one gust of wind: a pair of tapered wavy streaks travelling from (x0,y0) along angle ang; p = 0..1.25 progress
function drawWind(ctx, x0, y0, ang, len, p, t, col = '#ffffff', w = 12) {
  if (p <= 0 || p >= 1.25) return;
  ctx.save(); ctx.translate(x0, y0); ctx.rotate(ang);
  const head = Math.min(1, p) * len, tail = Math.max(0, head - len * .45 - Math.max(0, p - 1) * len * 1.2);
  const fade = p > 1 ? 1 - (p - 1) / .25 : 1;
  ctx.globalAlpha = Math.max(0, fade);
  for (const [off, ww] of [[0, w], [26, w * .7]]) {
    const pts = []; for (let d = tail; d <= head; d += 6) pts.push([d, off + Math.sin(d * .018 + t * 5) * 10]);
    if (pts.length < 2) continue;
    for (let i = 1; i < pts.length; i++) {
      const k = i / pts.length, thick = ww * Math.sin(k * Math.PI);
      ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineCap = 'round';
      ctx.lineWidth = thick + 7; ctx.strokeStyle = 'rgba(40,90,140,.45)'; ctx.stroke();
    }
    for (let i = 1; i < pts.length; i++) {
      const k = i / pts.length, thick = ww * Math.sin(k * Math.PI);
      ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineCap = 'round';
      ctx.lineWidth = thick; ctx.strokeStyle = col; ctx.stroke();
    }
  }
  ctx.restore();
}

function drawClipboard(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || -.03); ctx.scale(s, s);
  rrect(ctx, -300, -400, 600, 800, 36); fillStroke(ctx, '#b77942', 9);
  rrect(ctx, -260, -350, 520, 720, 14); fillStroke(ctx, '#ffffff', 6);
  rrect(ctx, -110, -430, 220, 80, 22); fillStroke(ctx, '#cfd7e6', 8);
  text(ctx, 'DIAGNOSIS', 0, -270, 64, '#2a3f8f', INK, 0);
  line(ctx, -200, -215, 200, -215, 5, '#c9d3e6');
  const items = o.items || ['Flu', 'Maag', 'Dispepsia', 'Masuk angin'];
  items.forEach((it, i) => {
    const yy = -130 + i * 115, k = clamp((o.show == null ? 1 : o.show) * items.length - i);
    if (k <= 0) return; ctx.save(); ctx.globalAlpha = k;
    rrect(ctx, -210, yy - 32, 64, 64, 12); fillStroke(ctx, '#fff', 6);
    const bad = i === items.length - 1;
    if (!bad) { ctx.beginPath(); ctx.moveTo(-198, yy); ctx.lineTo(-182, yy + 18); ctx.lineTo(-156, yy - 20); ctx.lineWidth = 9; ctx.strokeStyle = '#2cb35e'; ctx.lineCap = 'round'; ctx.stroke(); }
    text(ctx, it, -120, yy + 3, 58, bad ? '#9aa0b4' : INK, INK, 0, 'Poppins', 700, 'left');
    if (bad && o.strike > 0) {
      const w = ctx.measureText(it).width; line(ctx, -130, yy + 2, -130 + (w + 30) * clamp(o.strike), yy + 2, 12, '#e5262a');
      if (o.strike >= 1) { line(ctx, -200, yy - 22, -164, yy + 22, 10, '#e5262a'); line(ctx, -164, yy - 22, -200, yy + 22, 10, '#e5262a'); }
    }
    ctx.restore();
  });
  ctx.restore();
}

// skin cross-section: surface at top, capillaries in the dermis. o.widen 0..1, o.burst 0..1
function drawSkin(ctx, x, y, w, h, t, o = {}) {
  ctx.save(); ctx.translate(x, y);
  const top = 0, ep = 70, dm = h * .62;
  ctx.save(); rrect(ctx, -w / 2, top, w, h, 30); ctx.clip();
  ctx.fillStyle = '#ffe2a8'; ctx.fillRect(-w / 2, top, w, h);
  for (let i = 0; i < 14; i++) { circle(ctx, -w / 2 + 40 + (i % 7) * (w / 7), dm + 60 + Math.floor(i / 7) * 90, 44); fillStroke(ctx, '#ffd36e', 4); }
  ctx.fillStyle = '#f7b3a6'; ctx.fillRect(-w / 2, top + ep, w, dm - ep);
  ctx.beginPath(); ctx.moveTo(-w / 2, top + ep);
  for (let xx = -w / 2; xx <= w / 2; xx += 20) ctx.lineTo(xx, top + ep + Math.sin(xx * .05) * 10);
  ctx.lineTo(w / 2, top); ctx.lineTo(-w / 2, top); ctx.closePath(); ctx.fillStyle = SKIN_C; ctx.fill();
  ctx.lineWidth = 5; ctx.strokeStyle = SKIN_D; ctx.stroke();
  const wd = 10 + 14 * clamp(o.widen || 0);
  for (let k = 0; k < 3; k++) {
    const cy = top + ep + 70 + k * 85; ctx.beginPath();
    for (let xx = -w / 2 - 20; xx <= w / 2 + 20; xx += 12) { const yy = cy + Math.sin(xx * .012 + k * 2) * 26; xx === -w / 2 - 20 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy); }
    ctx.lineCap = 'round'; ctx.lineWidth = wd + 8; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = wd; ctx.strokeStyle = '#e8343a'; ctx.stroke();
    ctx.lineWidth = wd * .25; ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.stroke();
  }
  if (o.burst > 0) {
    const r = rng(17);
    for (let i = 0; i < 22; i++) { const bx = -w / 2 + 40 + r() * (w - 80), by = top + ep + 20 + r() * (dm - ep - 30); const k = clamp(o.burst * 22 - i); if (k > 0) { circle(ctx, bx, by, (6 + r() * 10) * k); ctx.fillStyle = '#c4161c'; ctx.fill(); } }
  }
  ctx.restore();
  rrect(ctx, -w / 2, top, w, h, 30); fillStroke(ctx, null, 9);
  ctx.restore();
}

// a person's back (closeup) with kerokan stripes; o.stripes 0..1 progress
function drawBack(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const shape = () => { ctx.beginPath(); ctx.moveTo(-60, -470); ctx.quadraticCurveTo(-330, -470, -350, -330); ctx.quadraticCurveTo(-330, 0, -250, 160); ctx.lineTo(-270, 440); ctx.lineTo(270, 440); ctx.lineTo(250, 160); ctx.quadraticCurveTo(330, 0, 350, -330); ctx.quadraticCurveTo(330, -470, 60, -470); ctx.closePath(); };
  shape(); const g = ctx.createLinearGradient(-330, 0, 330, 0); g.addColorStop(0, '#f8d2ad'); g.addColorStop(1, '#e8ad84'); ctx.fillStyle = g; ctx.fill();
  ctx.save(); shape(); ctx.clip();
  ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(150,80,50,.35)';
  ctx.beginPath(); ctx.moveTo(0, -440); ctx.lineTo(0, 420); ctx.stroke();
  ctx.beginPath(); ctx.arc(-150, -260, 110, .3, 2.0); ctx.stroke(); ctx.beginPath(); ctx.arc(150, -260, 110, Math.PI - 2.0, Math.PI - .3); ctx.stroke();
  const n = 7, p = clamp(o.stripes || 0) * n * 2;
  for (let i = 0; i < n; i++) for (const sd of [-1, 1]) {
    const idx = i * 2 + (sd > 0 ? 1 : 0); const k = clamp(p - idx); if (k <= 0) continue;
    const yy = -330 + i * 100, x0 = sd * 30, x1 = sd * 240;
    ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(lerp(x0, x1, k), yy + 70 * k); ctx.lineCap = 'round'; ctx.lineWidth = 30; ctx.strokeStyle = 'rgba(214,40,50,.75)'; ctx.stroke();
    ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(160,10,25,.55)'; ctx.stroke();
  }
  ctx.restore();
  shape(); fillStroke(ctx, null, 10);
  // neck + back of head with hair tuft
  rrect(ctx, -60, -560, 120, 110, 20); fillStroke(ctx, '#f0be96', 9);
  circle(ctx, 0, -700, 190); fillStroke(ctx, '#f6f2ea', 10);
  ctx.save(); circle(ctx, 0, -700, 190); ctx.clip(); ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(40, -900, 200, 400); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-30, -888); ctx.quadraticCurveTo(-40, -960, 0, -970); ctx.moveTo(10, -888); ctx.quadraticCurveTo(50, -950, 90, -940); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke();
  ctx.restore();
}
function drawCoin(ctx, x, y, r, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ellipse(ctx, 0, 0, r, r * .9); fillStroke(ctx, '#f2c230', r * .12);
  ellipse(ctx, 0, 0, r * .68, r * .6); ctx.lineWidth = r * .07; ctx.strokeStyle = 'rgba(120,70,0,.5)'; ctx.stroke();
  text(ctx, '500', 0, 2, r * .55, '#9a6a10', INK, 0); ctx.restore();
}

function drawStomach(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-40, -150); ctx.quadraticCurveTo(-20, -60, -100, -20); ctx.quadraticCurveTo(-180, 40, -120, 120); ctx.quadraticCurveTo(-30, 190, 90, 120); ctx.quadraticCurveTo(170, 60, 120, -60); ctx.quadraticCurveTo(80, -120, 30, -150); ctx.closePath();
  fillStroke(ctx, '#ff8fa3', 9);
  rrect(ctx, -44, -200, 64, 70, 20); fillStroke(ctx, '#ff8fa3', 8);
  for (const sd of [-1, 1]) { circle(ctx, sd * 36 + 10, 30, 16); fillStroke(ctx, '#fff', 5); circle(ctx, sd * 36 + 10, 34, 7); ctx.fillStyle = INK; ctx.fill(); line(ctx, sd * 36 - 6, 0 - sd * 6, sd * 36 + 26, 6 + sd * 6, 6); }
  ctx.beginPath(); ctx.arc(10, 96, 26, Math.PI + .5, -.5); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
  if (o.burn) for (let i = 0; i < 4; i++) { const fx = -90 + i * 60, fy = -60 - Math.abs(Math.sin(t * 9 + i)) * 20; ctx.beginPath(); ctx.moveTo(fx - 18, fy + 30); ctx.quadraticCurveTo(fx - 20, fy, fx, fy - 30); ctx.quadraticCurveTo(fx + 20, fy, fx + 18, fy + 30); ctx.closePath(); fillStroke(ctx, '#ff8a2a', 5); }
  ctx.restore();
}
function drawBattery(ctx, x, y, s, level = .15, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -150, -80, 280, 160, 26); fillStroke(ctx, '#ffffff', 9); rrect(ctx, 130, -34, 30, 68, 10); fillStroke(ctx, '#ffffff', 7);
  const blink = (Math.sin(t * 10) > 0) ? 1 : .35; ctx.globalAlpha = blink;
  rrect(ctx, -130, -60, 240 * level, 120, 14); ctx.fillStyle = '#e5262a'; ctx.fill(); ctx.globalAlpha = 1;
  ctx.restore();
}
function drawHeart(ctx, x, y, s, t, o = {}) {
  const beat = 1 + .08 * Math.max(0, Math.sin(t * (o.fast ? 14 : 8))) ** 6 * 4;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * beat, s * beat);
  ctx.beginPath(); ctx.moveTo(0, 70); ctx.bezierCurveTo(-150, -20, -110, -150, 0, -80); ctx.bezierCurveTo(110, -150, 150, -20, 0, 70); fillStroke(ctx, '#e5262a', 8);
  ellipse(ctx, -55, -70, 26, 14, -.5); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
  if (o.crack > 0) { ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(-14, -40 * o.crack); ctx.lineTo(12, -10 * o.crack); ctx.lineTo(-6, 30 * o.crack); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.restore();
}
function drawECG(ctx, x, y, w, h, t, o = {}) {
  ctx.save(); ctx.translate(x, y);
  rrect(ctx, -w / 2, -h / 2, w, h, 24); fillStroke(ctx, '#0f1d2b', 8);
  ctx.save(); rrect(ctx, -w / 2, -h / 2, w, h, 24); ctx.clip();
  ctx.strokeStyle = 'rgba(80,200,140,.15)'; ctx.lineWidth = 2; for (let gx = -w / 2; gx < w / 2; gx += 30) { ctx.beginPath(); ctx.moveTo(gx, -h / 2); ctx.lineTo(gx, h / 2); ctx.stroke(); }
  ctx.beginPath(); const sp = o.fast ? 2.2 : 1.2;
  for (let xx = -w / 2; xx <= w / 2; xx += 4) {
    const ph = ((xx / w + t * sp * .5) % 1 + 1) % 1; let yy = 0;
    if (ph > .45 && ph < .48) yy = -h * .1; else if (ph >= .48 && ph < .5) yy = h * .12; else if (ph >= .5 && ph < .53) yy = -h * .38; else if (ph >= .53 && ph < .56) yy = h * .22; else if (ph > .66 && ph < .74) yy = -h * .08 * Math.sin((ph - .66) / .08 * Math.PI);
    xx === -w / 2 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
  }
  ctx.lineWidth = 7; ctx.strokeStyle = o.col || '#4dff9a'; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore(); ctx.restore();
}
function drawIGD(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -330, -720, 660, 720, 18); fillStroke(ctx, '#f4f7fb', 9);
  for (let i = 0; i < 3; i++) { rrect(ctx, -280 + i * 200, -660, 160, 120, 12); fillStroke(ctx, '#9fd3f2', 6); }
  rrect(ctx, -250, -500, 500, 130, 20); fillStroke(ctx, '#e5262a', 8);
  text(ctx, 'IGD', 60, -432, 96, '#fff', INK, 0);
  rrect(ctx, -205, -470, 70, 70, 10); ctx.fillStyle = '#fff'; ctx.fill(); rrect(ctx, -188, -460, 36, 50, 4); ctx.fillStyle = '#e5262a'; ctx.fill(); rrect(ctx, -195, -453, 50, 36, 4); ctx.fill();
  rrect(ctx, -170, -320, 340, 320, 10); fillStroke(ctx, '#bfe3f7', 8); line(ctx, 0, -320, 0, 0, 7);
  const on = Math.sin(t * 12) > 0;
  rrect(ctx, -40, -790, 80, 70, 20); fillStroke(ctx, on ? '#ff3d3d' : '#3d6dff', 7);
  if (on) { ctx.save(); ctx.globalAlpha = .35; circle(ctx, 0, -755, 120); ctx.fillStyle = '#ff6a6a'; ctx.fill(); ctx.restore(); }
  ctx.restore();
}
