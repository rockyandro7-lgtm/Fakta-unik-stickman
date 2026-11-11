// ---------- Fakta Unik: sleep / night world + props (bedroom, moon, bed, bloodshot eye, hour counter, calendar, vintage 1964 card, hallucinations, glass) ----------

function bedroomBG(ctx, t, cam, o = {}) {
  const floorY = o.floor || 1180, dawn = o.dawn || 0;
  applyCam(ctx, cam, .12);
  const g = ctx.createLinearGradient(0, -500, 0, floorY);
  g.addColorStop(0, mix('#1c2a5e', '#ffd9a0', dawn)); g.addColorStop(1, mix('#33448a', '#ffb870', dawn));
  ctx.fillStyle = g; ctx.fillRect(-1500, -1500, 4100, floorY + 1500);
  ctx.fillStyle = `rgba(255,255,255,${.06 + .1 * (1 - dawn)})`;
  for (let y = -300; y < floorY; y += 120) for (let x = -400 + ((y / 120) % 2) * 60; x < 1500; x += 120) { circle(ctx, x, y, 6); ctx.fill(); }
  applyCam(ctx, cam, .2);
  rrect(ctx, 90, 170, 330, 420, 20); const wg = ctx.createLinearGradient(0, 170, 0, 590); wg.addColorStop(0, mix('#0b1236', '#7ccaf5', dawn)); wg.addColorStop(1, mix('#1e2e6a', '#d9f2fb', dawn)); ctx.fillStyle = wg; ctx.fill();
  ctx.save(); rrect(ctx, 90, 170, 330, 420, 20); ctx.clip();
  if (dawn < .6) { for (let i = 0; i < 16; i++) { const sx = 110 + (i * 53) % 290, sy = 190 + (i * 97) % 380, tw = .5 + .5 * Math.sin(t * 2 + i); circle(ctx, sx, sy, 3 + tw * 2); ctx.fillStyle = `rgba(255,255,230,${(.9 - dawn) * (.5 + tw * .5)})`; ctx.fill(); } circle(ctx, 320, 280, 58); ctx.fillStyle = '#fff7c9'; ctx.fill(); circle(ctx, 342, 262, 50); ctx.fillStyle = mix('#14204e', '#7ccaf5', dawn); ctx.fill(); }
  else { circle(ctx, 300, 300, 56); ctx.fillStyle = '#fff3a8'; ctx.fill(); }
  ctx.restore();
  rrect(ctx, 90, 170, 330, 420, 20); fillStroke(ctx, null, 9, '#8a5a34'); line(ctx, 255, 170, 255, 590, 8, '#8a5a34'); line(ctx, 90, 380, 420, 380, 8, '#8a5a34');
  rrect(ctx, 70, 580, 370, 30, 10); fillStroke(ctx, '#c68a55', 6);
  applyCam(ctx, cam, 1);
  // wall clock
  circle(ctx, 800, 330, 92); fillStroke(ctx, '#fff', 9); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(ctx, 800 + Math.cos(a) * 70, 330 + Math.sin(a) * 70, 800 + Math.cos(a) * 82, 330 + Math.sin(a) * 82, 5); }
  const ma = (o.clockSpin != null ? o.clockSpin : t * 1.2) * TAU; line(ctx, 800, 330, 800 + Math.cos(ma - 1.57) * 62, 330 + Math.sin(ma - 1.57) * 62, 6); line(ctx, 800, 330, 800 + Math.cos(ma / 12 - 1.57) * 40, 330 + Math.sin(ma / 12 - 1.57) * 40, 8);
  // floor
  drawDeckFloor(ctx, floorY, 540, -1100, -700, 1780, 2500, .25 * (1 - dawn));
  ctx.fillStyle = `rgba(10,15,50,${.28 * (1 - dawn)})`; ctx.fillRect(-700, floorY, 2480, 1400);
}

function drawBed(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 8, 330, 22); ctx.fillStyle = 'rgba(20,20,50,.3)'; ctx.fill();
  rrect(ctx, -320, -250, 40, 250, 12); fillStroke(ctx, '#8a5a34', 8); rrect(ctx, 280, -170, 40, 170, 12); fillStroke(ctx, '#8a5a34', 8);
  rrect(ctx, -300, -140, 600, 110, 24); fillStroke(ctx, '#a87444', 8);
  rrect(ctx, -290, -200, 590, 90, 30); fillStroke(ctx, '#ffffff', 8);
  rrect(ctx, -270, -230, 170, 70, 30); fillStroke(ctx, '#e8eefc', 8);
  if (o.blanket !== false) { ctx.beginPath(); ctx.moveTo(-60, -200); ctx.quadraticCurveTo(100, -230, 296, -190); ctx.lineTo(296, -90); ctx.lineTo(-60, -90); ctx.closePath(); fillStroke(ctx, '#4a8cff', 8); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.4)'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-20 + i * 80, -196); ctx.lineTo(-20 + i * 80, -92); ctx.stroke(); } }
  ctx.restore();
}

// bloodshot eye. lid: 0 open .. 1 closed. wide: bigger pupil
function drawEye(ctx, x, y, s, t, o = {}) {
  const lid = o.lid || 0, red = o.red == null ? .8 : o.red;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const shape = () => { ctx.beginPath(); ctx.moveTo(-300, 0); ctx.quadraticCurveTo(0, -260, 300, 0); ctx.quadraticCurveTo(0, 260, -300, 0); ctx.closePath(); };
  shape(); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.save(); shape(); ctx.clip();
  const r = rng(11);
  ctx.lineCap = 'round'; ctx.strokeStyle = `rgba(230,40,50,${.8 * red})`;
  for (let i = 0; i < 18; i++) { const side = i % 2 ? 1 : -1, sy = (r() - .5) * 200; ctx.lineWidth = 3 + r() * 3; ctx.beginPath(); ctx.moveTo(side * 300, sy); ctx.quadraticCurveTo(side * (200 - r() * 40), sy * .6 + (r() - .5) * 60, side * (120 + r() * 50), sy * .2); ctx.stroke(); }
  const px = Math.sin(t * 1.7) * 26 * (o.drift == null ? 1 : o.drift), py = Math.cos(t * 1.3) * 12;
  circle(ctx, px, py, 118); const ig = ctx.createRadialGradient(px, py, 20, px, py, 118); ig.addColorStop(0, '#5aa7e8'); ig.addColorStop(1, '#1f5ea8'); ctx.fillStyle = ig; ctx.fill(); fillStroke(ctx, null, 8);
  circle(ctx, px, py, (o.dilate ? 70 : 44)); ctx.fillStyle = INK; ctx.fill();
  circle(ctx, px - 36, py - 40, 20); ctx.fillStyle = '#fff'; ctx.fill();
  // upper lid droops
  const ly = lerp(-260, 10, lid);
  ctx.fillStyle = '#e8b68c'; ctx.fillRect(-340, -300, 680, 300 + ly);
  ctx.fillStyle = 'rgba(120,60,90,.3)'; ctx.fillRect(-340, ly - 4, 680, 22);
  if (lid > .5) { ctx.fillRect(-340, ly - 4, 680, 14); }
  ctx.restore();
  shape(); fillStroke(ctx, null, 14);
  // eye bags
  ctx.beginPath(); ctx.moveTo(-250, 150); ctx.quadraticCurveTo(0, 280, 250, 150); ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(110,70,150,.6)'; ctx.lineCap = 'round'; ctx.stroke();
  ctx.restore();
}

// flip-style hour counter
function drawHourCounter(ctx, x, y, s, hours, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -380, -190, 760, 380, 44); fillStroke(ctx, '#1b2650', 12);
  const str = String(Math.max(0, Math.floor(hours))).padStart(3, '0');
  for (let i = 0; i < 3; i++) {
    const cx = -210 + i * 210; rrect(ctx, cx - 90, -150, 180, 230, 22); fillStroke(ctx, '#0b122e', 8);
    ctx.save(); rrect(ctx, cx - 90, -150, 180, 230, 22); ctx.clip();
    text(ctx, str[i], cx, -30, 190, o.col || '#ffe14d', INK, 0);
    ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(cx - 90, -38, 180, 6); ctx.restore();
  }
  text(ctx, 'JAM TANPA TIDUR', 0, 140, 56, '#fff', INK, 0);
  ctx.restore();
}

// calendar of N day boxes; crossed = how many are crossed (can be fractional)
function drawCalendar(ctx, x, y, s, n, crossed, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -420, -330, 840, 640, 40); fillStroke(ctx, '#ffffff', 10);
  rrect(ctx, -420, -330, 840, 110, 40); fillStroke(ctx, '#e5262a', 10);
  rect2(ctx, -420, -270, 840, 50, '#e5262a');
  text(ctx, 'HARI TANPA TIDUR', 0, -272, 58, '#fff', INK, 0);
  const cols = 4, w = 180, h = 140;
  for (let i = 0; i < n; i++) {
    const cx = -315 + (i % cols) * 210, cy = -130 + Math.floor(i / cols) * 160;
    rrect(ctx, cx - w / 2, cy - h / 2 + 8, w, h - 10, 16); fillStroke(ctx, '#f4f7fb', 6);
    text(ctx, String(i + 1), cx, cy + 12, 64, '#2a3f8f', INK, 0);
    const k = clamp(crossed - i);
    if (k > 0) { line(ctx, cx - 60, cy - 36, cx - 60 + 120 * Math.min(1, k * 2), cy - 36 + 90 * Math.min(1, k * 2), 12, '#e5262a'); if (k > .5) line(ctx, cx + 60, cy - 36, cx + 60 - 120 * (k - .5) * 2, cy - 36 + 90 * (k - .5) * 2, 12, '#e5262a'); }
  }
  ctx.restore();
}
function rect2(ctx, x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); }

// vintage 1964 card
function drawVintageCard(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot == null ? -.04 : o.rot); ctx.scale(s, s);
  rrect(ctx, -330, -420, 660, 840, 18); ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; ctx.fillStyle = '#f2e3c0'; ctx.fill(); ctx.shadowColor = 'transparent'; fillStroke(ctx, null, 9);
  rrect(ctx, -290, -380, 580, 560, 10); fillStroke(ctx, '#d9b98a', 6);
  ctx.save(); rrect(ctx, -290, -380, 580, 560, 10); ctx.clip();
  const g = ctx.createLinearGradient(0, -380, 0, 180); g.addColorStop(0, '#c9a36a'); g.addColorStop(1, '#a8803f'); ctx.fillStyle = g; ctx.fillRect(-290, -380, 580, 560);
  ctx.fillStyle = 'rgba(80,40,10,.12)'; for (let i = 0; i < 40; i++) { circle(ctx, ((i * 137) % 560) - 280, -370 + ((i * 89) % 540), 2 + (i % 3)); ctx.fill(); }
  if (o.draw) o.draw();
  ctx.restore();
  text(ctx, o.l1 || '', 0, 250, 66, '#4a2c12', INK, 0, 'Lora', 700);
  text(ctx, o.l2 || '', 0, 335, 46, '#6a4a28', INK, 0, 'Lora', 700);
  ctx.restore();
}

// hallucination swirl: floating wobbling shapes around a point
function drawHallucinations(ctx, x, y, t, k = 1) {
  const cols = ['#ff6fa8', '#ffd23a', '#4ac8ff', '#7be05a', '#b07aff'];
  for (let i = 0; i < 9; i++) {
    const a = t * .9 + i * TAU / 9, d = (150 + 70 * Math.sin(t * 1.3 + i)) * k, cx = x + Math.cos(a) * d * 1.5, cy = y + Math.sin(a) * d;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 1.5 + i); ctx.globalAlpha = .9 * clamp(k * 2);
    const sc = .8 + .3 * Math.sin(t * 3 + i); ctx.scale(sc, sc);
    if (i % 3 === 0) { star5(ctx, 0, 0, 38, 0, cols[i % 5]); }
    else if (i % 3 === 1) { circle(ctx, 0, 0, 30); fillStroke(ctx, cols[i % 5], 6); circle(ctx, 0, 0, 12); fillStroke(ctx, '#fff', 4); }
    else { ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(30, 24); ctx.lineTo(-30, 24); ctx.closePath(); fillStroke(ctx, cols[i % 5], 6); }
    ctx.restore();
  }
}

function drawGlass(ctx, x, y, s, fill = .75, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 6, 100, 14); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  const g = () => { ctx.beginPath(); ctx.moveTo(-80, -300); ctx.lineTo(80, -300); ctx.lineTo(62, 0); ctx.lineTo(-62, 0); ctx.closePath(); };
  g(); ctx.fillStyle = 'rgba(220,240,255,.75)'; ctx.fill();
  ctx.save(); g(); ctx.clip(); const wy = -300 + (1 - fill) * 300; ctx.fillStyle = '#5ab8f2'; ctx.beginPath(); ctx.moveTo(-90, wy + Math.sin(t * 4) * 5); for (let xx = -90; xx <= 90; xx += 10) ctx.lineTo(xx, wy + Math.sin(t * 4 + xx * .08) * 6); ctx.lineTo(90, 10); ctx.lineTo(-90, 10); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(-60, -290, 16, 270); ctx.restore();
  g(); fillStroke(ctx, null, 8);
  ctx.restore();
}
function drawBook(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  rrect(ctx, -170, -120, 340, 240, 14); fillStroke(ctx, '#2a6fd6', 9);
  rrect(ctx, -140, -92, 280, 184, 8); fillStroke(ctx, '#f4f7fb', 6);
  text(ctx, 'JURNAL', 0, -30, 60, '#2a3f8f', INK, 0); line(ctx, -100, 20, 100, 20, 6, '#9aa6bd'); line(ctx, -100, 50, 70, 50, 6, '#9aa6bd');
  ctx.restore();
}
