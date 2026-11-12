// ---------- Long-form content primitives (design space 1600 x 900; drawn on the studio board or full screen) ----------
const kAt = (t, t0, d = .35) => inv(t0, t0 + d, t);
const bk = (t, t0, d = .35) => backOut(kAt(t, t0, d));

function scaled(ctx, x, y, s, fn) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); fn(); ctx.restore(); }
function card2(ctx, x, y, w, h, fill = '#ffffff', r = 34) { rrect(ctx, x - w / 2, y - h / 2, w, h, r); fillStroke(ctx, fill, 8); }
function tx(ctx, s, x, y, size, fill = '#fff', sw = 0, align = 'center') { text(ctx, s, x, y, size, fill, INK, sw, 'Poppins', 700, align); }

function brain(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const lobes = [[-120, -40, 110], [-20, -95, 115], [95, -55, 105], [130, 40, 85], [-110, 55, 90], [10, 40, 110]];
  ctx.beginPath(); lobes.forEach(([lx, ly, r]) => { ctx.moveTo(lx + r, ly); ctx.arc(lx, ly, r, 0, TAU); });
  ctx.fillStyle = o.col || '#ff9fb4'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = INK; ctx.stroke();
  ctx.save(); ctx.beginPath(); lobes.forEach(([lx, ly, r]) => { ctx.moveTo(lx + r, ly); ctx.arc(lx, ly, r, 0, TAU); }); ctx.clip();
  ctx.fillStyle = o.col || '#ff9fb4'; ctx.fillRect(-300, -300, 600, 600);
  ctx.strokeStyle = 'rgba(160,40,80,.45)'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) { ctx.beginPath(); const sx = -200 + i * 48; for (let j = 0; j < 8; j++) { const px = sx + Math.sin(j * 1.3 + i) * 22, py = -180 + j * 50; j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
  if (o.hl) o.hl.forEach(([hx, hy, hr, a]) => { if (a > 0) { const g = ctx.createRadialGradient(hx, hy, 5, hx, hy, hr); g.addColorStop(0, `rgba(255,220,40,${.95 * a})`); g.addColorStop(1, 'rgba(255,120,40,0)'); ctx.fillStyle = g; ctx.fillRect(hx - hr, hy - hr, hr * 2, hr * 2); } });
  if (o.fog > 0) { for (let i = 0; i < 7; i++) puff(ctx, -170 + i * 60 + Math.sin(t + i) * 20, -40 + Math.cos(t * .8 + i) * 50, 70, t, '#e9e9f2', i + 2, .75 * o.fog); }
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(10, 140); ctx.quadraticCurveTo(20, 200, 0, 240); ctx.lineWidth = 34; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 20; ctx.strokeStyle = o.col || '#ff9fb4'; ctx.stroke();
  ctx.restore();
}
function gauge(ctx, x, y, r, frac, labelTop, valueStr, t, o = {}) {
  ctx.save(); ctx.translate(x, y);
  ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, TAU); ctx.lineWidth = r * .22; ctx.strokeStyle = '#2b3566'; ctx.stroke();
  const segs = [['#59d27a', 0, .4], ['#ffd23a', .4, .7], ['#ff4d4d', .7, 1]];
  segs.forEach(([c, a0, a1]) => { ctx.beginPath(); ctx.arc(0, 0, r, Math.PI + a0 * Math.PI, Math.PI + a1 * Math.PI); ctx.lineWidth = r * .18; ctx.strokeStyle = c; ctx.stroke(); });
  ctx.beginPath(); ctx.arc(0, 0, r + r * .11, Math.PI, TAU); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke();
  const a = Math.PI + clamp(frac) * Math.PI + Math.sin(t * 9) * .015;
  line(ctx, 0, 0, Math.cos(a) * r * .85, Math.sin(a) * r * .85, 14); circle(ctx, 0, 0, 26); fillStroke(ctx, '#ff4d4d', 7);
  if (labelTop) tx(ctx, labelTop, 0, -r - 70, 50, '#fff', 10);
  if (valueStr) tx(ctx, valueStr, 0, 90, 84, o.vcol || '#ffe14d', 14);
  ctx.restore();
}
function barH(ctx, x, y, w, h, frac, col, labelL, valStr) {
  rrect(ctx, x, y - h / 2, w, h, h / 2); fillStroke(ctx, '#2b3566', 6);
  if (frac > 0) { rrect(ctx, x, y - h / 2, Math.max(h, w * clamp(frac)), h, h / 2); fillStroke(ctx, col, 6); }
  if (labelL) tx(ctx, labelL, x - 30, y + 2, h * .7, '#fff', 9, 'right');
  if (valStr) tx(ctx, valStr, x + w * clamp(frac) + 24, y + 2, h * .7, '#fff', 9, 'left');
}
function timelineBar(ctx, x0, x1, y, prog, marks, t) {
  rrect(ctx, x0 - 20, y - 26, x1 - x0 + 40, 52, 26); fillStroke(ctx, '#2b3566', 7);
  ctx.save(); rrect(ctx, x0 - 20, y - 26, x1 - x0 + 40, 52, 26); ctx.clip(); const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, '#59d27a'); g.addColorStop(.5, '#ffd23a'); g.addColorStop(1, '#ff4d4d'); ctx.fillStyle = g; ctx.fillRect(x0 - 20, y - 26, (x1 - x0 + 40) * clamp(prog), 52); ctx.restore();
  rrect(ctx, x0 - 20, y - 26, x1 - x0 + 40, 52, 26); fillStroke(ctx, null, 7);
  marks.forEach(m => { const mx = lerp(x0, x1, m.at); line(ctx, mx, y + 34, mx, y + 60, 6, '#fff'); tx(ctx, m.label, mx, y + 100, 42, '#fff', 8); });
}
function papers(ctx, x, y, n, k, t) {
  for (let i = 0; i < n; i++) { const kk = clamp(k * n - i); if (kk <= 0) continue; ctx.save(); ctx.translate(x + (i % 7) * 26 - 80, y - i * 9); ctx.rotate((hash(i) - .5) * .2); ctx.globalAlpha = clamp(kk * 3); rrect(ctx, -90, -120, 180, 240, 10); fillStroke(ctx, '#f4f7fb', 6); for (let j = 0; j < 5; j++) line(ctx, -60, -70 + j * 34, 60 - (j % 2) * 30, -70 + j * 34, 6, '#b9c3d8'); ctx.restore(); }
}
function bodySil(ctx, x, y, s, fill, t) {
  // human outline with water fill level (0..1)
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const shape = () => { ctx.beginPath(); ctx.arc(0, -330, 70, 0, TAU); ctx.moveTo(-95, -240); ctx.lineTo(95, -240); ctx.quadraticCurveTo(130, -230, 135, -190); ctx.lineTo(170, 20); ctx.lineTo(125, 30); ctx.lineTo(100, -120); ctx.lineTo(95, 40); ctx.lineTo(90, 330); ctx.lineTo(25, 330); ctx.lineTo(0, 80); ctx.lineTo(-25, 330); ctx.lineTo(-90, 330); ctx.lineTo(-95, 40); ctx.lineTo(-100, -120); ctx.lineTo(-125, 30); ctx.lineTo(-170, 20); ctx.lineTo(-135, -190); ctx.quadraticCurveTo(-130, -230, -95, -240); ctx.closePath(); };
  shape(); ctx.fillStyle = '#f6f2ea'; ctx.fill();
  ctx.save(); shape(); ctx.clip(); const top = 330 - 730 * clamp(fill);
  ctx.fillStyle = '#4ab3f0'; ctx.beginPath(); ctx.moveTo(-200, top); for (let xx = -200; xx <= 200; xx += 10) ctx.lineTo(xx, top + Math.sin(xx * .05 + t * 4) * 8); ctx.lineTo(200, 400); ctx.lineTo(-200, 400); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.3)'; for (let i = 0; i < 6; i++) { const by = 300 - ((t * 60 + i * 70) % (330 - top)); circle(ctx, -60 + i * 25, by, 8); ctx.fill(); }
  ctx.restore(); shape(); ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
}
function lungs(ctx, x, y, s) { scaled(ctx, x, y, s, () => { for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 20, -110); ctx.quadraticCurveTo(sd * 130, -120, sd * 120, 60); ctx.quadraticCurveTo(sd * 100, 120, sd * 30, 90); ctx.closePath(); fillStroke(ctx, '#ff8fa3', 8); } rrect(ctx, -12, -160, 24, 80, 10); fillStroke(ctx, '#ff8fa3', 7); }); }
function liver(ctx, x, y, s) { scaled(ctx, x, y, s, () => { ctx.beginPath(); ctx.moveTo(-170, -40); ctx.quadraticCurveTo(-120, -110, 40, -100); ctx.quadraticCurveTo(170, -90, 170, -40); ctx.quadraticCurveTo(80, 10, -20, 80); ctx.quadraticCurveTo(-160, 60, -170, -40); ctx.closePath(); fillStroke(ctx, '#b0473d', 9); ellipse(ctx, -60, -50, 50, 18, -.2); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fill(); }); }
function kidney(ctx, x, y, s) { scaled(ctx, x, y, s, () => { ctx.beginPath(); ctx.moveTo(0, -110); ctx.bezierCurveTo(110, -120, 120, 110, 0, 110); ctx.bezierCurveTo(-30, 110, -50, 40, -20, 0); ctx.bezierCurveTo(-50, -40, -30, -110, 0, -110); fillStroke(ctx, '#c45a4f', 8); }); }
function arm(ctx, x, y, s, bulk = 1) { scaled(ctx, x, y, s, () => { ctx.beginPath(); ctx.moveTo(-160, 40); ctx.quadraticCurveTo(-60, 30 - 20 * bulk, -10, -40); ctx.quadraticCurveTo(10, -150 - 40 * bulk, 80, -120); ctx.quadraticCurveTo(90, -60, 40, -20); ctx.quadraticCurveTo(10, 60, -160, 90); ctx.closePath(); fillStroke(ctx, '#f5c9a0', 8); if (bulk > .5) { ctx.beginPath(); ctx.arc(-10, -60 - 25 * bulk, 40 * bulk, Math.PI * .9, Math.PI * 1.9); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(150,80,50,.5)'; ctx.stroke(); } circle(ctx, 70, -150, 34); fillStroke(ctx, '#f5c9a0', 7); }); }
function sun(ctx, x, y, r, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(t * .4); for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(-r * .16, -r * 1.2); ctx.lineTo(r * .16, -r * 1.2); ctx.lineTo(0, -r * 1.65); ctx.closePath(); fillStroke(ctx, '#ffd23a', 5); } ctx.restore(); circle(ctx, x, y, r); fillStroke(ctx, '#ffe14d', 8); }
function drop(ctx, x, y, r, col = '#4ab3f0') { ctx.beginPath(); ctx.moveTo(x, y - r * 1.5); ctx.quadraticCurveTo(x + r * 1.05, y - r * .1, x, y + r); ctx.quadraticCurveTo(x - r * 1.05, y - r * .1, x, y - r * 1.5); fillStroke(ctx, col, r * .12); ellipse(ctx, x - r * .3, y - r * .1, r * .18, r * .3, -.4); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fill(); }
function rat(ctx, x, y, s, t) { scaled(ctx, x, y, s, () => { ctx.beginPath(); ctx.moveTo(120, 30); ctx.quadraticCurveTo(220, 40 + Math.sin(t * 4) * 20, 260, -20); ctx.lineWidth = 9; ctx.strokeStyle = '#e8a0a8'; ctx.lineCap = 'round'; ctx.stroke(); ellipse(ctx, 0, 0, 140, 80); fillStroke(ctx, '#c9c9d4', 8); ellipse(ctx, -150, -20, 70, 55); fillStroke(ctx, '#c9c9d4', 8); circle(ctx, -150, -85, 34); fillStroke(ctx, '#f0b8c0', 7); circle(ctx, -170, -30, 9); ctx.fillStyle = INK; ctx.fill(); circle(ctx, -218, -10, 12); fillStroke(ctx, '#ff8fa3', 5); }); }
function dna(ctx, x, y, s, t) { scaled(ctx, x, y, s, () => { for (let i = 0; i < 14; i++) { const yy = -260 + i * 40, a = Math.sin(i * .6 + t * 2) * 90; line(ctx, -a, yy, a, yy, 7, '#9fb6ff'); circle(ctx, -a, yy, 14); fillStroke(ctx, '#ff6fa8', 5); circle(ctx, a, yy, 14); fillStroke(ctx, '#4ac8ff', 5); } }); }
function colaCan(ctx, x, y, s) { scaled(ctx, x, y, s, () => { rrect(ctx, -60, -110, 120, 220, 24); fillStroke(ctx, '#d6322a', 8); rrect(ctx, -60, -20, 120, 40, 6); ctx.fillStyle = '#fff'; ctx.fill(); tx(ctx, 'KOLA', 0, 2, 30, '#d6322a'); ellipse(ctx, 0, -110, 56, 14); fillStroke(ctx, '#cfd7e6', 6); }); }
function musicNote(ctx, x, y, s, t) { scaled(ctx, x, y, s, () => { ctx.rotate(Math.sin(t * 5) * .15); line(ctx, 40, -120, 40, 60, 14); line(ctx, 40, -120, 120, -90, 14); ellipse(ctx, 10, 70, 44, 32, -.4); ctx.fillStyle = INK; ctx.fill(); }); }
function shower(ctx, x, y, s, t) { scaled(ctx, x, y, s, () => { ctx.beginPath(); ctx.moveTo(-120, -160); ctx.quadraticCurveTo(-120, -220, -40, -220); ctx.lineTo(40, -220); ctx.lineWidth = 16; ctx.strokeStyle = '#9aa6bd'; ctx.stroke(); ctx.beginPath(); ctx.moveTo(10, -220); ctx.lineTo(70, -220); ctx.lineTo(110, -170); ctx.lineTo(-30, -170); ctx.closePath(); fillStroke(ctx, '#cfd7e6', 7); for (let i = 0; i < 10; i++) { const p = ((t * 2 + i * .13) % 1); drop(ctx, -20 + (i % 5) * 28, -150 + p * 260, 10, '#8fd8ff'); } }); }
function pinball(ctx, x, y, s, t) { scaled(ctx, x, y, s, () => { rrect(ctx, -110, -200, 220, 300, 20); fillStroke(ctx, '#7a4bc4', 8); rrect(ctx, -90, -180, 180, 200, 12); fillStroke(ctx, '#1b2650', 6); for (let i = 0; i < 4; i++) { circle(ctx, -50 + (i % 2) * 100, -140 + Math.floor(i / 2) * 70, 18); fillStroke(ctx, ['#ffd23a', '#ff6fa8', '#4ac8ff', '#7be05a'][i], 5); } const bx = Math.sin(t * 3.3) * 60, by = -60 + Math.cos(t * 4.1) * 50; circle(ctx, bx, by, 12); fillStroke(ctx, '#e9edf5', 4); rrect(ctx, -120, 100, 30, 120, 8); fillStroke(ctx, '#5b3a96', 6); rrect(ctx, 90, 100, 30, 120, 8); fillStroke(ctx, '#5b3a96', 6); }); }
function newspaper(ctx, x, y, s, head, sub, o = {}) { scaled(ctx, x, y, s, () => { ctx.rotate(o.rot || -.04); rrect(ctx, -380, -260, 760, 520, 10); fillStroke(ctx, '#f2ead8', 8); text(ctx, 'THE DAILY NEWS', 0, -205, 44, '#3a2a1a', INK, 0, 'Lora', 700); line(ctx, -340, -175, 340, -175, 5, '#3a2a1a'); text(ctx, head, 0, -110, 62, '#2a1a0a', INK, 0, 'Lora', 700); text(ctx, sub, 0, -40, 38, '#4a3a2a', INK, 0, 'Lora', 700); for (let i = 0; i < 6; i++) { line(ctx, -340, 20 + i * 36, -30, 20 + i * 36, 6, '#b7aa92'); line(ctx, 30, 20 + i * 36, 340, 20 + i * 36, 6, '#b7aa92'); } }); }
function bottle(ctx, x, y, s, fill, col = '#4ab3f0', t = 0) { scaled(ctx, x, y, s, () => { const sh = () => { ctx.beginPath(); ctx.moveTo(-40, -260); ctx.lineTo(40, -260); ctx.lineTo(40, -220); ctx.quadraticCurveTo(90, -190, 90, -130); ctx.lineTo(90, 150); ctx.quadraticCurveTo(90, 180, 60, 180); ctx.lineTo(-60, 180); ctx.quadraticCurveTo(-90, 180, -90, 150); ctx.lineTo(-90, -130); ctx.quadraticCurveTo(-90, -190, -40, -220); ctx.closePath(); }; sh(); ctx.fillStyle = 'rgba(220,240,255,.85)'; ctx.fill(); ctx.save(); sh(); ctx.clip(); const top = 180 - 440 * clamp(fill); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-100, top); for (let xx = -100; xx <= 100; xx += 10) ctx.lineTo(xx, top + Math.sin(xx * .06 + t * 4) * 6); ctx.lineTo(100, 200); ctx.lineTo(-100, 200); ctx.fill(); ctx.restore(); sh(); fillStroke(ctx, null, 8); rrect(ctx, -46, -290, 92, 36, 8); fillStroke(ctx, '#2a6fd6', 6); }); }
function battery(ctx, x, y, s, level, t) { drawBattery(ctx, x, y, s, level, t); }
function warnSign(ctx, x, y, s, str) { scaled(ctx, x, y, s, () => { path(ctx, [[0, -150], [170, 130], [-170, 130]]); fillStroke(ctx, '#ffd23a', 12); tx(ctx, '!', 0, 45, 170, INK); }); if (str) tx(ctx, str, x, y + s * 230, 60 * Math.max(.6, s), '#fff', 12); }
function noSign(ctx, x, y, r, a = 1) { ctx.save(); ctx.globalAlpha = a; circle(ctx, x, y, r); ctx.lineWidth = r * .16; ctx.strokeStyle = '#e5262a'; ctx.stroke(); line(ctx, x - r * .7, y - r * .7, x + r * .7, y + r * .7, r * .16, '#e5262a'); ctx.restore(); }
function toilet(ctx, x, y, s) { scaled(ctx, x, y, s, () => { rrect(ctx, -80, -200, 160, 120, 20); fillStroke(ctx, '#f4f7fb', 8); ellipse(ctx, 0, -60, 110, 40); fillStroke(ctx, '#f4f7fb', 8); ctx.beginPath(); ctx.moveTo(-100, -60); ctx.quadraticCurveTo(-90, 80, 0, 90); ctx.quadraticCurveTo(90, 80, 100, -60); fillStroke(ctx, '#f4f7fb', 8); }); }
function urineChart(ctx, x, y, w, k) { const cols = ['#fdfbe0', '#fbf3a8', '#f6e36b', '#eec53a', '#d9a01f', '#b97a15']; cols.forEach((c, i) => { const kk = clamp(k * cols.length - i); if (kk <= 0) return; rrect(ctx, x + i * (w / 6), y - 60 * kk, w / 6 - 14, 120 * kk, 16); fillStroke(ctx, c, 6); }); }
function ketone(ctx, x, y, r, t, i = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(t * 2 + i); path(ctx, [[0, -r], [r * .87, -r / 2], [r * .87, r / 2], [0, r], [-r * .87, r / 2], [-r * .87, -r / 2]]); fillStroke(ctx, '#ffd23a', r * .14); tx(ctx, 'K', 0, 3, r * .9, INK); ctx.restore(); }
function fatCell(ctx, x, y, r, t) { circle(ctx, x, y, r); fillStroke(ctx, '#ffe7a3', 8); circle(ctx, x - r * .25, y - r * .25, r * .5); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fill(); }
function calendarN(ctx, x, y, s, n, crossed, title) { scaled(ctx, x, y, s, () => { const cols = n <= 4 ? n : 7, rows = Math.ceil(n / cols), cw = 120, chh = 100, W2 = cols * cw + 60, H2 = rows * chh + 150; rrect(ctx, -W2 / 2, -H2 / 2, W2, H2, 30); fillStroke(ctx, '#fff', 9); rrect(ctx, -W2 / 2, -H2 / 2, W2, 100, 30); fillStroke(ctx, '#e5262a', 9); ctx.fillStyle = '#e5262a'; ctx.fillRect(-W2 / 2 + 5, -H2 / 2 + 60, W2 - 10, 40); tx(ctx, title, 0, -H2 / 2 + 52, 46, '#fff'); for (let i = 0; i < n; i++) { const cx = -W2 / 2 + 30 + cw / 2 + (i % cols) * cw, cy = -H2 / 2 + 140 + chh / 2 + Math.floor(i / cols) * chh - 20; rrect(ctx, cx - 50, cy - 40, 100, 80, 12); fillStroke(ctx, '#f4f7fb', 5); tx(ctx, String(i + 1), cx, cy + 4, 40, '#2a3f8f'); const kk = clamp(crossed - i); if (kk > 0) { line(ctx, cx - 36, cy - 26, cx - 36 + 72 * Math.min(1, kk * 2), cy - 26 + 52 * Math.min(1, kk * 2), 9, '#e5262a'); if (kk > .5) line(ctx, cx + 36, cy - 26, cx + 36 - 72 * (kk - .5) * 2, cy - 26 + 52 * (kk - .5) * 2, 9, '#e5262a'); } } }); }
function clockFace(ctx, x, y, r, hour, o = {}) { // hour 0..24 continuous, shows hands
  circle(ctx, x, y, r); fillStroke(ctx, '#fff', r * .06); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU - Math.PI / 2; line(ctx, x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .78, x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9, i % 3 ? 5 : 9); }
  const ha = (hour % 12) / 12 * TAU - Math.PI / 2, ma = (hour % 1) * TAU - Math.PI / 2;
  if (o.wedge) { ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r * .7, o.wedge[0] / 12 * TAU - Math.PI / 2, ha); ctx.closePath(); ctx.fillStyle = 'rgba(255,90,90,.45)'; ctx.fill(); }
  line(ctx, x, y, x + Math.cos(ha) * r * .5, y + Math.sin(ha) * r * .5, r * .08); line(ctx, x, y, x + Math.cos(ma) * r * .72, y + Math.sin(ma) * r * .72, r * .05, '#3a4a78'); circle(ctx, x, y, r * .07); fillStroke(ctx, '#e5262a', 4);
}
