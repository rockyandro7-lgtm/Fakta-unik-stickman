// ---------- Fakta Unik: kitchen world + props (drawn in code, same ink-outline style as the stick engine) ----------
const MINT = '#dff6f1', MINT2 = '#b6e6dc', STEEL = '#cfd7e6', STEEL2 = '#9aa6bf';

function kitchenBG(ctx, t, cam, o = {}) {
  const floorY = o.floor || 1150;
  applyCam(ctx, cam, .12);
  let g = ctx.createLinearGradient(0, -500, 0, floorY); g.addColorStop(0, o.wallTop || '#ffe9ad'); g.addColorStop(1, o.wallBot || '#ffd27a');
  ctx.fillStyle = g; ctx.fillRect(-1500, -1500, 4100, floorY + 1500);
  ctx.fillStyle = 'rgba(255,255,255,.22)';
  for (let y = -300; y < floorY; y += 120) for (let x = -400 + ((y / 120) % 2) * 60; x < 1500; x += 120) { circle(ctx, x, y, 7); ctx.fill(); }
  // window
  applyCam(ctx, cam, .2);
  rrect(ctx, 70, 150, 330, 400, 20); const wg = ctx.createLinearGradient(0, 150, 0, 550); wg.addColorStop(0, '#6cc4f2'); wg.addColorStop(1, '#d3f2fb'); ctx.fillStyle = wg; ctx.fill();
  ctx.save(); rrect(ctx, 70, 150, 330, 400, 20); ctx.clip(); drawCloud(ctx, 200 + Math.sin(t * .2) * 20, 300, 70, 2); circle(ctx, 330, 230, 44); ctx.fillStyle = '#fff3a8'; ctx.fill(); ctx.restore();
  rrect(ctx, 70, 150, 330, 400, 20); fillStroke(ctx, null, 9, '#8a5a34');
  line(ctx, 235, 150, 235, 550, 8, '#8a5a34'); line(ctx, 70, 350, 400, 350, 8, '#8a5a34');
  rrect(ctx, 50, 540, 370, 30, 10); fillStroke(ctx, '#c68a55', 6);
  // shelf with jars
  applyCam(ctx, cam, .3);
  rrect(ctx, 650, 330, 420, 24, 8); fillStroke(ctx, '#b4693a', 6);
  [[700, '#ff8a5b'], [790, '#6bc46d'], [880, '#ffd34e'], [970, '#6aa8f0']].forEach(([x, c], i) => { rrect(ctx, x, 250 + (i % 2) * 8, 70, 80 - (i % 2) * 8, 14); fillStroke(ctx, c, 5); rrect(ctx, x + 6, 232 + (i % 2) * 8, 58, 20, 6); fillStroke(ctx, '#fff', 5); });
  // backsplash tiles
  applyCam(ctx, cam, .55);
  const ty0 = floorY - 520, ty1 = floorY - 215;
  ctx.fillStyle = '#f4fbff'; ctx.fillRect(-600, ty0, 2300, ty1 - ty0);
  ctx.strokeStyle = '#b8d9e8'; ctx.lineWidth = 4;
  for (let y = ty0; y <= ty1; y += 76) { ctx.beginPath(); ctx.moveTo(-600, y); ctx.lineTo(1700, y); ctx.stroke(); }
  for (let r = 0; r < 4; r++) for (let x = -600 + (r % 2) * 60; x < 1700; x += 120) { ctx.beginPath(); ctx.moveTo(x, ty0 + r * 76); ctx.lineTo(x, ty0 + r * 76 + 76); ctx.stroke(); }
  ctx.fillStyle = 'rgba(80,120,160,.14)'; ctx.fillRect(-600, ty0, 2300, 14);
  // counter + cabinets
  applyCam(ctx, cam, 1);
  rrect(ctx, -300, floorY - 215, 1700, 215, 0); fillStroke(ctx, '#27a5a0', 7);
  for (let x = -260; x < 1400; x += 340) { rrect(ctx, x, floorY - 190, 300, 170, 14); fillStroke(ctx, '#34c0b9', 6); rrect(ctx, x + 120, floorY - 176, 60, 14, 7); fillStroke(ctx, '#f3f0e6', 4); }
  ctx.fillStyle = 'rgba(0,50,60,.18)'; ctx.fillRect(-300, floorY - 40, 1700, 40);
  rrect(ctx, -320, floorY - 250, 1740, 44, 10); fillStroke(ctx, '#d9a56b', 7);
  ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(-310, floorY - 244, 1720, 8);
  drawDeckFloor(ctx, floorY, 540, -1100, -700, 1780, 2500, 0);
  // light shaft from window
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(255,245,200,.16)'; path(ctx, [[70, 150], [400, 150], [820, floorY + 420], [380, floorY + 420]]); ctx.fill(); ctx.restore();
}

function drawPot(ctx, x, y, s, o = {}) {
  const t = o.t || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (o.rot) ctx.rotate(o.rot);
  if (o.shadow !== false) { ellipse(ctx, 0, 6, 160, 16); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill(); }
  rrect(ctx, -195, -132, 70, 28, 14); fillStroke(ctx, '#38405a', 6); rrect(ctx, 125, -132, 70, 28, 14); fillStroke(ctx, '#38405a', 6);
  const body = () => rrect(ctx, -150, -190, 300, 190, [8, 8, 36, 36]);
  body(); const gg = ctx.createLinearGradient(-150, 0, 150, 0); gg.addColorStop(0, '#e6ebf6'); gg.addColorStop(1, '#a3aec6'); ctx.fillStyle = gg; ctx.fill();
  shadeShape(ctx, body, 1, .14, .35, [-150, -190, 300, 190]); body(); fillStroke(ctx, null, 7);
  rrect(ctx, -118, -170, 28, 130, 12); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
  rrect(ctx, -162, -208, 324, 28, 12); fillStroke(ctx, '#eef2fa', 7);
  if (o.lid !== false) {
    ctx.save(); ctx.translate(0, -208 - (o.lift || 0)); ctx.rotate(o.lidRot || 0);
    ctx.beginPath(); ctx.moveTo(-142, 0); ctx.quadraticCurveTo(-134, -86, 0, -90); ctx.quadraticCurveTo(134, -86, 142, 0); ctx.closePath(); fillStroke(ctx, '#dfe5f1', 7);
    ctx.save(); ctx.beginPath(); ctx.moveTo(-142, 0); ctx.quadraticCurveTo(-134, -86, 0, -90); ctx.quadraticCurveTo(134, -86, 142, 0); ctx.closePath(); ctx.clip(); ctx.fillStyle = 'rgba(40,50,90,.14)'; ctx.fillRect(40, -100, 120, 120); ctx.restore();
    circle(ctx, 0, -100, 16); fillStroke(ctx, '#38405a', 6);
    ctx.restore();
  } else {
    ellipse(ctx, 0, -196, 140, 18); fillStroke(ctx, '#e2893a', 6);
    for (let i = 0; i < 5; i++) { circle(ctx, -90 + i * 45, -200 + Math.sin(t * 4 + i) * 2, 13); fillStroke(ctx, ['#7fcf5a', '#f4b33a', '#c4663a'][i % 3], 4); }
  }
  if (o.steam > 0) {
    for (let i = 0; i < 5; i++) {
      const p = ((t * .45 + i * .21) % 1);
      puff(ctx, (i - 2) * 46 + Math.sin(t * 3 + i * 2) * 16, -250 - (o.lift || 0) - p * 300, 26 + p * 38, t, '#ffffff', i + 3, (1 - p) * .9 * Math.min(1, o.steam));
    }
  }
  ctx.restore();
}

function drawBox(ctx, x, y, s, o = {}) {
  const lid = o.lid == null ? 1 : o.lid;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.shadow !== false) { ellipse(ctx, 0, 4, 90, 10); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill(); }
  const body = () => { ctx.beginPath(); ctx.moveTo(-82, -100); ctx.lineTo(82, -100); ctx.lineTo(68, 0); ctx.lineTo(-68, 0); ctx.closePath(); };
  body(); ctx.fillStyle = 'rgba(205,232,255,.92)'; ctx.fill();
  const fill = o.fill == null ? .7 : o.fill;
  if (fill > 0) { ctx.save(); body(); ctx.clip(); ctx.fillStyle = o.food || '#e5a84f'; ctx.fillRect(-90, -100 + (1 - fill) * 100, 180, 100); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(-90, -100 + (1 - fill) * 100, 180, 8); ctx.restore(); }
  ctx.save(); body(); ctx.clip(); ctx.fillStyle = 'rgba(40,60,120,.12)'; ctx.fillRect(30, -110, 80, 120); ctx.restore();
  body(); fillStroke(ctx, null, 6);
  ctx.save(); ctx.translate(0, -100 - (1 - lid) * (o.lift || 70)); ctx.rotate((1 - lid) * (o.lidRot || -.18));
  rrect(ctx, -92, -18, 184, 20, 8); fillStroke(ctx, '#3f98ee', 6); rrect(ctx, -24, -30, 48, 16, 6); fillStroke(ctx, '#2d7fd2', 5);
  ctx.restore();
  ctx.restore();
}

function drawPlate(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 6, 190, 28); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  ellipse(ctx, 0, -20, 180, 46); fillStroke(ctx, '#f7f9fc', 7); ellipse(ctx, 0, -22, 126, 26); fillStroke(ctx, '#e1e7f1', 4);
  ctx.beginPath(); ctx.moveTo(-90, -28); ctx.quadraticCurveTo(-70, -130, 0, -132); ctx.quadraticCurveTo(70, -130, 90, -28); ctx.closePath(); fillStroke(ctx, '#ffffff', 6);
  ctx.save(); ctx.beginPath(); ctx.moveTo(-90, -28); ctx.quadraticCurveTo(-70, -130, 0, -132); ctx.quadraticCurveTo(70, -130, 90, -28); ctx.closePath(); ctx.clip(); ctx.fillStyle = 'rgba(80,90,140,.12)'; ctx.fillRect(10, -140, 100, 120); ctx.restore();
  ctx.save(); ctx.translate(100, -60); ctx.rotate(.5);
  rrect(ctx, -52, -26, 104, 52, 26); fillStroke(ctx, '#d98a38', 6); rrect(ctx, 40, -10, 38, 20, 8); fillStroke(ctx, '#f6efe0', 5); circle(ctx, 52, -12, 10); fillStroke(ctx, '#f6efe0', 4);
  ctx.restore();
  ellipse(ctx, -108, -38, 34, 16); fillStroke(ctx, '#e43b3b', 5);
  ctx.beginPath(); ctx.ellipse(-52, -30, 30, 14, -.3, 0, TAU); fillStroke(ctx, '#58b94c', 5);
  if (o.sick > 0) { ctx.save(); ctx.globalAlpha = .45 * o.sick; ellipse(ctx, 0, -50, 200, 110); ctx.fillStyle = '#7cc23a'; ctx.fill(); ctx.restore(); }
  ctx.restore();
}

function drawBug(ctx, x, y, r, t, o = {}) {
  const w = Math.sin(t * 6 + (o.seed || 0)) * .12; const mood = o.mood || 'evil';
  ctx.save(); ctx.translate(x, y); ctx.rotate(w); const sq = 1 + Math.sin(t * 7 + (o.seed || 0)) * .05; ctx.scale(sq, 2 - sq);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(-r * .16, -r * .85); ctx.lineTo(0, -r * 1.3); ctx.lineTo(r * .16, -r * .85); ctx.closePath(); fillStroke(ctx, o.spike || '#4e9a2a', r * .06); ctx.restore(); }
  circle(ctx, 0, 0, r); const g = ctx.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r); g.addColorStop(0, o.c1 || '#b6f26a'); g.addColorStop(1, o.c2 || '#5bbb30'); ctx.fillStyle = g; ctx.fill(); fillStroke(ctx, null, r * .07);
  ellipse(ctx, -r * .35, -r * .45, r * .22, r * .1, -.5); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fill();
  for (const sd of [-1, 1]) {
    circle(ctx, sd * r * .32, -r * .1, r * .24); fillStroke(ctx, '#fff', r * .05); circle(ctx, sd * r * .32 + (o.look || 0) * r * .06, -r * .08, r * .1); ctx.fillStyle = INK; ctx.fill();
    if (mood === 'evil') line(ctx, sd * r * .6, -r * .48 + (sd < 0 ? 0 : 0), sd * r * .1, -r * .3, r * .07);
  }
  if (mood === 'party') { ellipse(ctx, 0, r * .42, r * .2, r * .2 + Math.abs(Math.sin(t * 8)) * r * .1); fillStroke(ctx, '#7a2630', r * .05); }
  else { ctx.beginPath(); ctx.moveTo(-r * .38, r * .3); ctx.quadraticCurveTo(0, r * .72, r * .38, r * .3); ctx.quadraticCurveTo(0, r * .38, -r * .38, r * .3); fillStroke(ctx, '#7a2630', r * .05); }
  ctx.restore();
}

function drawFridge(ctx, x, y, s, o = {}) {
  const door = o.door || 0, t = o.t || 0, mood = o.mood || 'happy';
  const FW = 300, FH = 700, x0 = -FW / 2;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.shake) ctx.translate(Math.sin(t * 60) * o.shake, Math.cos(t * 47) * o.shake * .5);
  ellipse(ctx, 0, 6, 190, 18); ctx.fillStyle = 'rgba(40,20,30,.22)'; ctx.fill();
  const body = () => rrect(ctx, x0, -FH, FW, FH, 34);
  body(); const bg = ctx.createLinearGradient(x0, 0, x0 + FW, 0); bg.addColorStop(0, '#eefcf9'); bg.addColorStop(1, '#bfe9e1'); ctx.fillStyle = bg; ctx.fill();
  shadeShape(ctx, body, 1, .16, .3, [x0, -FH, FW, FH]); body(); fillStroke(ctx, null, 8);
  // freezer door
  rrect(ctx, x0 + 14, -FH + 14, FW - 28, 240, 22); fillStroke(ctx, null, 6);
  rrect(ctx, x0 + 30, -FH + 90, 16, 110, 8); fillStroke(ctx, '#56627f', 5);
  // lower compartment
  const lx0 = x0 + 14, ly0 = -440, lw = FW - 28, ly1 = -26;
  if (door > .01) {
    rrect(ctx, lx0, ly0, lw, ly1 - ly0, 18); const ig = ctx.createLinearGradient(0, ly0, 0, ly1); ig.addColorStop(0, '#fffdf2'); ig.addColorStop(1, '#e6f4f2'); ctx.fillStyle = ig; ctx.fill(); fillStroke(ctx, null, 6);
    ctx.save(); rrect(ctx, lx0, ly0, lw, ly1 - ly0, 18); ctx.clip();
    ctx.fillStyle = 'rgba(160,215,240,.28)'; ctx.fillRect(lx0, ly0, lw, 60);
    const shelves = [-330, -222, -116];
    shelves.forEach(sy => { rrect(ctx, lx0 + 4, sy, lw - 8, 12, 5); fillStroke(ctx, '#a6d8cf', 4); });
    const items = o.items || [[0, 30, 44, 66, '#ff8a5b'], [0, 90, 36, 50, '#6bc46d'], [0, 150, 52, 40, '#ffd34e'], [1, 24, 56, 54, '#6aa8f0'], [1, 100, 40, 70, '#f06a8a'], [1, 160, 46, 44, '#ffd34e'], [2, 30, 60, 46, '#8bd1c4'], [2, 110, 44, 60, '#ff8a5b']];
    items.forEach(([si, ix, iw, ih, col]) => { rrect(ctx, lx0 + ix, shelves[si] - ih, iw, ih, 10); fillStroke(ctx, col, 5); });
    ctx.restore();
    if (o.cold) { ctx.save(); ctx.globalAlpha = o.cold; for (let i = 0; i < 6; i++) { const p = ((t * .3 + i * .17) % 1); ctx.save(); ctx.translate(lx0 + 30 + i * 40, ly0 + 40 + p * 300); ctx.rotate(t + i); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#9ed8ff'; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k < 3; k++) { ctx.moveTo(-9, 0); ctx.lineTo(9, 0); ctx.rotate(Math.PI / 3); } ctx.stroke(); ctx.restore(); } ctx.restore(); }
    // door swung open (left hinge)
    const dw = lw * (1 - door * .88), e = 26 * door;
    ctx.beginPath(); ctx.moveTo(lx0, ly0); ctx.lineTo(lx0 + dw, ly0 - e); ctx.lineTo(lx0 + dw, ly1 + e); ctx.lineTo(lx0, ly1); ctx.closePath(); fillStroke(ctx, door > .6 ? '#d6f1ec' : '#cdeee8', 7);
    if (door < .6) rrect(ctx, lx0 + dw - 40, ly0 + 60, 14, 150, 7), fillStroke(ctx, '#56627f', 4);
  } else {
    rrect(ctx, lx0, ly0, lw, ly1 - ly0, 22); const dg = ctx.createLinearGradient(lx0, 0, lx0 + lw, 0); dg.addColorStop(0, '#f1fdfa'); dg.addColorStop(1, '#c6ece4'); ctx.fillStyle = dg; ctx.fill(); fillStroke(ctx, null, 6);
    rrect(ctx, x0 + 30, -400, 16, 170, 8); fillStroke(ctx, '#56627f', 5);
    ctx.save(); rrect(ctx, lx0, ly0, lw, ly1 - ly0, 22); ctx.clip(); ctx.fillStyle = 'rgba(60,110,140,.14)'; ctx.fillRect(lx0 + lw * .62, ly0, lw, 500); ctx.restore();
  }
  // temperature display
  if (o.temp != null) {
    rrect(ctx, x0 + 150, -FH + 28, 106, 40, 10); fillStroke(ctx, '#27324d', 5);
    for (let i = 0; i < 5; i++) { const on = o.temp * 5 > i + .2; rrect(ctx, x0 + 160 + i * 18, -FH + 38, 12, 20, 3); ctx.fillStyle = on ? lerpC('#4ac8ff', '#ff5a3c', i / 4) : '#4a5576'; ctx.fill(); }
  }
  // face on freezer door
  const fx = 0, fy = -FH + 150;
  if (mood === 'hot') { rrect(ctx, x0 + 14, -FH + 14, FW - 28, 240, 22); ctx.fillStyle = 'rgba(255,90,60,.22)'; ctx.fill(); }
  if (mood === 'broken') { rrect(ctx, x0 + 14, -FH + 14, FW - 28, 240, 22); ctx.fillStyle = 'rgba(120,120,120,.2)'; ctx.fill(); }
  for (const sd of [-1, 1]) {
    const ex = fx + sd * 56;
    if (mood === 'joy') { ctx.beginPath(); ctx.arc(ex, fy + 6, 22, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); }
    else if (mood === 'broken') { line(ctx, ex - 20, fy - 20, ex + 20, fy + 20, 9); line(ctx, ex + 20, fy - 20, ex - 20, fy + 20, 9); }
    else { circle(ctx, ex, fy, 29); fillStroke(ctx, '#fff', 6); circle(ctx, ex + (o.look || 0) * 8, fy + 4, 11); ctx.fillStyle = INK; ctx.fill(); circle(ctx, ex + (o.look || 0) * 8 - 4, fy, 3.5); ctx.fillStyle = '#fff'; ctx.fill(); }
    if (mood === 'worry' || mood === 'hot') line(ctx, ex - sd * 24, fy - 48, ex + sd * 20, fy - 36, 7);
  }
  if (mood === 'happy' || mood === 'joy') { ctx.beginPath(); ctx.arc(fx, fy + 22, 34, .3, Math.PI - .3); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ellipse(ctx, fx - 98, fy + 36, 17, 10); ellipse(ctx, fx + 98, fy + 36, 17, 10); ctx.fillStyle = 'rgba(255,120,130,.5)'; ctx.fill(); }
  else if (mood === 'worry') { ctx.beginPath(); ctx.arc(fx, fy + 66, 28, Math.PI + .5, -.5); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); sweat(ctx, fx + 112, fy - 20 + Math.sin(t * 5) * 4, 24); }
  else if (mood === 'hot') { ellipse(ctx, fx, fy + 58, 22, 16 + Math.abs(Math.sin(t * 6)) * 8); fillStroke(ctx, '#7a2630', 6); sweat(ctx, fx + 112, fy - 20 + Math.sin(t * 5) * 5, 26); sweat(ctx, fx - 112, fy + 10 + Math.sin(t * 6) * 5, 20); }
  else if (mood === 'broken') { ctx.beginPath(); ctx.moveTo(fx - 36, fy + 56); for (let i = 1; i <= 6; i++) ctx.lineTo(fx - 36 + i * 12, fy + 56 + (i % 2 ? -10 : 8)); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); }
  if (o.crack) { const c = o.crack; ctx.save(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(60, -FH + 20); ctx.lineTo(40, -FH + 90 * c); ctx.lineTo(78, -FH + 150 * c); ctx.lineTo(50, -FH + 230 * c); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-90, -400); ctx.lineTo(-60, -400 + 90 * c); ctx.lineTo(-100, -400 + 160 * c); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
function lerpC(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',')})`; }

function drawThermo(ctx, x, y, s, o = {}) {
  const t = o.t || 0, show = o.show == null ? 1 : o.show;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rrect(ctx, -52, -840, 104, 780, 52); fillStroke(ctx, '#f4f8ff', 9);
  circle(ctx, 0, -20, 78); fillStroke(ctx, '#e43b3b', 9);
  const zones = [[-160, -70, '#59b8ff'], [-600, -160, '#ff4d4d'], [-818, -600, '#ffa83a']];
  ctx.save(); rrect(ctx, -52, -840, 104, 780, 52); ctx.clip();
  zones.forEach(([y1, y0, c], i) => { const h = (y0 - y1) * clamp(show * 3 - i); if (h > 0) { ctx.fillStyle = c; ctx.fillRect(-52, y0 - h, 104, h); } });
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-34, -820, 16, 740);
  ctx.restore();
  rrect(ctx, -52, -840, 104, 780, 52); fillStroke(ctx, null, 9);
  const dl = (yy, lab, k) => {
    const a = clamp(k); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(0, (1 - backOut(a)) * 20);
    line(ctx, -52, yy, -150, yy, 8);
    rrect(ctx, -330, yy - 48, 180, 96, 48); fillStroke(ctx, '#fff', 8); text(ctx, lab, -240, yy + 3, 62, INK, INK, 0); ctx.restore();
  };
  dl(-160, '4°', o.l4); dl(-600, '60°', o.l60);
  if (o.danger > 0) {
    const a = clamp(o.danger); ctx.save(); ctx.globalAlpha = a; ctx.translate(0, (1 - backOut(a)) * 30);
    rrect(ctx, 80, -520, 330, 160, 36); fillStroke(ctx, '#ff3d3d', 9);
    text(ctx, 'ZONA', 245, -466, 56, '#fff', INK, 10); text(ctx, 'BAHAYA', 245, -404, 56, '#fff', INK, 10); ctx.restore();
  }
  ctx.restore();
}

function drawClock(ctx, x, y, s, o = {}) {
  const prog = o.prog || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ellipse(ctx, 0, 230, 190, 20); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
  circle(ctx, 0, 0, 215); fillStroke(ctx, '#e8453c', 14);
  circle(ctx, 0, 0, 190); fillStroke(ctx, '#ffffff', 6);
  if (prog > 0) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 170, -Math.PI / 2, -Math.PI / 2 + prog * Math.PI / 3); ctx.closePath(); ctx.fillStyle = 'rgba(255,70,70,.55)'; ctx.fill(); }
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU - Math.PI / 2; line(ctx, Math.cos(a) * 160, Math.sin(a) * 160, Math.cos(a) * 180, Math.sin(a) * 180, i % 3 ? 6 : 11); }
  const ha = -Math.PI / 2 + prog * Math.PI / 3, ma = -Math.PI / 2 + prog * TAU * 2;
  line(ctx, 0, 0, Math.cos(ha) * 100, Math.sin(ha) * 100, 16);
  line(ctx, 0, 0, Math.cos(ma) * 150, Math.sin(ma) * 150, 9, '#3a4a78');
  circle(ctx, 0, 0, 16); fillStroke(ctx, '#e8453c', 5);
  ctx.restore();
}

function drawStamp(ctx, x, y, s, label, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot == null ? -.16 : o.rot); ctx.scale(s, s);
  const col = o.col || '#e5262a';
  rrect(ctx, -300, -105, 600, 210, 30); ctx.fillStyle = 'rgba(255,255,255,.94)'; ctx.fill(); ctx.lineWidth = 16; ctx.strokeStyle = col; ctx.stroke();
  rrect(ctx, -278, -83, 556, 166, 18); ctx.lineWidth = 4; ctx.strokeStyle = col; ctx.stroke();
  text(ctx, label, 0, 6, o.size || 140, col, col, 0);
  ctx.restore();
}
function drawX(ctx, x, y, r, a = 1) { ctx.save(); ctx.globalAlpha = a; circle(ctx, x, y, r); fillStroke(ctx, '#e5262a', r * .1); line(ctx, x - r * .45, y - r * .45, x + r * .45, y + r * .45, r * .26, '#fff'); line(ctx, x + r * .45, y - r * .45, x - r * .45, y + r * .45, r * .26, '#fff'); ctx.restore(); }
function drawCheck(ctx, x, y, r, a = 1) { ctx.save(); ctx.globalAlpha = a; circle(ctx, x, y, r); fillStroke(ctx, '#2cb35e', r * .1); ctx.beginPath(); ctx.moveTo(x - r * .45, y + r * .02); ctx.lineTo(x - r * .1, y + r * .38); ctx.lineTo(x + r * .5, y - r * .34); ctx.lineWidth = r * .24; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); }
function qmark(ctx, x, y, s, rot = 0, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); text(ctx, '?', 0, 0, s, '#ffd23a', INK, s * .16); ctx.restore(); }
function stink(ctx, x, y, s, t, a = 1) { ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < 3; i++) { ctx.beginPath(); for (let j = 0; j <= 12; j++) { const yy = y - j * 18 * s, xx = x + (i - 1) * 46 * s + Math.sin(t * 5 + j * .9 + i) * 14 * s; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 9 * s; ctx.strokeStyle = '#6fbf3a'; ctx.lineCap = 'round'; ctx.stroke(); } ctx.restore(); }

function popText(ctx, str, x, y, size, k, fill = '#fff', stroke = INK, rot = 0) {
  if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const sc = backOut(clamp(k)); ctx.scale(sc, sc); ctx.globalAlpha = clamp(k * 5);
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6; text(ctx, str, 0, 0, size, fill, stroke, size * .2); ctx.shadowColor = 'transparent'; text(ctx, str, 0, 0, size, fill, stroke, 0); ctx.restore();
}

function drawBell(ctx, x, y, s, ang = 0, dot = false) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(0, -30); ctx.rotate(ang); ctx.translate(0, 30);
  ctx.beginPath(); ctx.moveTo(-34, 14); ctx.quadraticCurveTo(-34, -40, 0, -44); ctx.quadraticCurveTo(34, -40, 34, 14); ctx.lineTo(44, 24); ctx.lineTo(-44, 24); ctx.closePath(); fillStroke(ctx, '#27324d', 5);
  circle(ctx, 0, 36, 10); ctx.fillStyle = '#27324d'; ctx.fill(); circle(ctx, 0, -50, 7); ctx.fillStyle = '#27324d'; ctx.fill();
  if (dot) { circle(ctx, 30, -34, 14); fillStroke(ctx, '#ff2d2d', 5, '#fff'); }
  ctx.restore();
}
function drawSubBanner(ctx, x, y, s, o = {}) {
  const subbed = !!o.subbed, press = o.press || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12; rrect(ctx, -440, -190, 880, 380, 48); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent'; fillStroke(ctx, null, 8);
  drawChannelAvatar(ctx, -330, -85, 72);
  text(ctx, 'Mitos Rumahan & Fakta Unik', -238, -112, 42, INK, INK, 0, 'Poppins', 700, 'left');
  text(ctx, '@MitosRumahan', -238, -62, 34, '#6a7090', INK, 0, 'Poppins', 700, 'left');
  ctx.save(); ctx.translate(-70, 80); const ps = 1 - press * .07; ctx.scale(ps, ps);
  rrect(ctx, -300, -62, 600, 124, 62); fillStroke(ctx, subbed ? '#e3e6ee' : '#ff2d2d', 7);
  text(ctx, subbed ? 'SUBSCRIBED' : 'SUBSCRIBE', 0, 4, 54, subbed ? INK : '#fff', INK, 0);
  ctx.restore();
  circle(ctx, 350, 80, 62); fillStroke(ctx, '#eef0f6', 7); drawBell(ctx, 350, 78, .8, o.ring || 0, subbed);
  ctx.restore();
}

// channel avatar: yellow disc, red "MITOS" sign, two stick heads (matches the YouTube channel picture)
function drawChannelAvatar(ctx, x, y, r) {
  ctx.save(); ctx.translate(x, y); const k = r / 100;
  circle(ctx, 0, 0, r); fillStroke(ctx, '#f8e7a6', 7);
  ctx.save(); circle(ctx, 0, 0, r - 3); ctx.clip();
  ctx.save(); ctx.rotate(-.08); rrect(ctx, -52 * k, -78 * k, 104 * k, 34 * k, 6 * k); fillStroke(ctx, '#e5262a', 4);
  text(ctx, 'MITOS', 0, -60 * k, 24 * k, '#fff', INK, 0); ctx.restore();
  for (const [hx, col] of [[-30, '#2f9b5a'], [30, '#ec5b86']]) {
    rrect(ctx, (hx - 26) * k, 46 * k, 52 * k, 70 * k, 22 * k); fillStroke(ctx, col, 4);
    circle(ctx, hx * k, 18 * k, 30 * k); fillStroke(ctx, '#f6f2ea', 4);
    for (const sd of [-1, 1]) { circle(ctx, (hx + sd * 10) * k, 16 * k, 6 * k); fillStroke(ctx, '#fff', 2.5); circle(ctx, (hx + sd * 10) * k, 17 * k, 2.6 * k); ctx.fillStyle = INK; ctx.fill(); }
    ctx.beginPath(); ctx.arc(hx * k, 26 * k, 8 * k, .3, Math.PI - .3); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  }
  ctx.restore(); circle(ctx, 0, 0, r); fillStroke(ctx, null, 7); ctx.restore();
}
