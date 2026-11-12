// Profile picture channel "Mitos Rumahan & Fakta Unik" (800x800, dipotong lingkaran oleh YouTube).
// Tokoh SAMA dengan video (drawStick + preset EXPR): Budi (hijau, jambul) dan Ibu (pink, topi koki).
const IBU = { cols: ['#ec5b86', '#ec5b86'], hat: 'chef', belt: false, blush: true };
const BUDI = { cols: ['#2f9b5a', '#2f9b5a'], hat: 'tuft', hatCol: INK, belt: false };
const C = (b, e) => Object.assign({}, b, e);
const AV = 800;

function burst(ctx, cx, cy, c1, c2, n = 18) {   // latar sinar (energi "fakta unik"), tetap terbaca di ukuran kecil
  ctx.fillStyle = c1; ctx.fillRect(0, 0, AV, AV);
  ctx.save(); ctx.translate(cx, cy); ctx.fillStyle = c2;
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 1400, a, a + Math.PI / n); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
function ring(ctx, col) { ctx.save(); ctx.beginPath(); ctx.arc(AV / 2, AV / 2, AV / 2 - 14, 0, 7); ctx.lineWidth = 28; ctx.strokeStyle = col; ctx.stroke(); ctx.restore(); }

// A: Budi close-up penasaran + tanda tanya besar (format "Kenapa X?")
function optA(ctx) {
  burst(ctx, 400, 470, '#ffd23a', '#ffc21a');
  ctx.save(); ctx.translate(565, 245); ctx.rotate(.18); text(ctx, '?', 0, 0, 260, '#fff', INK, 46); ctx.restore();
  drawStick(ctx, C(BUDI, { x: 360, y: 1420, s: 1250, shadow: false, headTilt: -.12, arms: { L: [.25, -.1], R: [-.6, -1.9] }, face: Object.assign({}, EXPR.takjub, { look: [.55, -.6] }) }));
  ring(ctx, INK);
}
// B: duo Budi + Ibu, papan MITOS di atas, "?" di tengah (evolusi avatar lama, wajah jauh lebih besar)
function optB(ctx) {
  burst(ctx, 400, 520, '#3bb3e0', '#5cc4ea');
  drawStick(ctx, C(IBU, { x: 575, y: 1290, s: 900, flip: -1, shadow: false, headTilt: .08, arms: { L: [.2, -.1], R: [.2, -.1] }, face: Object.assign({}, EXPR.kaget, { look: [-.6, -.2] }) }));
  drawStick(ctx, C(BUDI, { x: 225, y: 1290, s: 900, shadow: false, headTilt: -.08, arms: { L: [.2, -.1], R: [.2, -.1] }, face: Object.assign({}, EXPR.curiga, { look: [.7, -.2] }) }));
  qmark(ctx, 400, 500, 200, 0);
  ctx.save(); ctx.translate(400, 130); ctx.rotate(-.06); rrect(ctx, -230, -62, 460, 124, 18); fillStroke(ctx, '#e5262a', 12);
  text(ctx, 'MITOS?', 0, 6, 92, '#fff', INK, 0); ctx.restore();
  ring(ctx, INK);
}
// C: Budi "aha!" kaget-takjub, satu "?" kuning + kilau, latar merah (paling kontras di feed)
function optC(ctx) {
  burst(ctx, 400, 430, '#e5262a', '#f0433f');
  qmark(ctx, 225, 245, 240, -.22);
  sparkle(ctx, 640, 170, 50); sparkle(ctx, 690, 320, 30);
  drawStick(ctx, C(BUDI, { x: 450, y: 1430, s: 1250, shadow: false, headTilt: .08, arms: { L: [.25, -.1], R: [.25, -.1] }, face: Object.assign({}, EXPR.kaget, { look: [-.5, -.5] }) }));
  ring(ctx, INK);
}

window.renderAll = () => [optA, optB, optC].map(f => { const c = document.createElement('canvas'); c.width = AV; c.height = AV; f(c.getContext('2d')); return c.toDataURL('image/png'); });
