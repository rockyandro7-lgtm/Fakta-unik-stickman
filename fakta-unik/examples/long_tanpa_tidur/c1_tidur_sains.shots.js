// ---------- Bab 1: Tidur (sains) ----------
const SHOTS = [];
const END = WORDS[WORDS.length - 1].e + .6;
const moonIcon = (ctx) => { circle(ctx, 0, 0, 90); ctx.fillStyle = '#fff7c9'; ctx.fill(); circle(ctx, 36, -26, 78); ctx.fillStyle = '#e5262a'; ctx.fill(); };

function gfxClock(ctx, t) {
  const t0 = ls(1); const h = lerp(6, 25, ease(inv(fw(1, 'terjaga'), fw(1, 'hari') + .2, t)));
  clockFace(ctx, 560, 470, 300 * bk(t, t0, .4) + .1, h, { wedge: [6] });
  const lab = h < 23 ? `${String(Math.floor(h)).padStart(2, '0')}.00` : (h < 24.5 ? '23.00' : '01.00');
  tx(ctx, 'BANGUN 06.00', 1200, 300, 64, '#ffe14d', 12);
  tx(ctx, 'MASIH TERJAGA', 1200, 470, 54, '#fff', 10); tx(ctx, lab, 1200, 580, 120, '#fff', 16);
}
function boardHours(ctx, t) {
  const t0 = ls(2); tx(ctx, '17 – 19', 800, 380, 260 * bk(t, t0 + .2, .45) + .1, '#ffe14d', 26); tx(ctx, 'JAM TANPA TIDUR', 800, 610, 90 * bk(t, t0 + .6, .4) + .1, '#fff', 14);
}
function boardStudy2000(ctx, t) {
  const t0 = ls(3); papers(ctx, 380, 520, 1, bk(t, t0, .4), t); tx(ctx, '2000', 380, 280, 120 * bk(t, fw(3, '2000') - .1, .4) + .1, '#ffe14d', 16);
  gauge(ctx, 1100, 560, 260 * bk(t, fw(3, 'performa') - .1, .4) + .1, .5 * ease(inv(fw(3, 'setara'), fw(3, '005') + .4, t)), 'kadar alkohol darah', kAt(t, fw(3, '005')) > 0 ? '0,05%' : '', t);
}
function gfxGauge05(ctx, t) {
  const t0 = fw(3, 'setara') - .2;
  gauge(ctx, 800, 600, 420 * bk(t, t0, .4) + .1, .5 * ease(inv(t0 + .2, fw(3, '005') + .3, t)), 'setara kadar alkohol darah', kAt(t, fw(3, '005')) > 0 ? '0,05%' : '', t);
  tx(ctx, '*di beberapa tes', 1350, 840, 36, '#b9c3ff', 0);
}
function gfxReaction(ctx, t) {
  const t0 = ls(4);
  tx(ctx, 'KECEPATAN REAKSI', 800, 140, 70, '#fff', 12);
  const p = ease(inv(t0 + .3, t0 + 2.6, t));
  barH(ctx, 520, 380, 900, 90, p, '#59d27a', 'Cukup tidur', '');
  barH(ctx, 520, 580, 900, 90, p * .5, '#ff4d4d', 'Kurang tidur', '');
  scaled(ctx, 520 + 900 * p + 60, 380, .3, () => drawStick(ctx, C(BUDI, { x: 0, y: 160, s: 360, shadow: false, legs: walkCycle(p * 2000, 360, 1).legs, face: { eyes: 'happy', mouth: 'grin' } })));
  scaled(ctx, 520 + 450 * p + 60, 580, .3, () => drawStick(ctx, C(BUDI, { x: 0, y: 160, s: 360, shadow: false, legs: walkCycle(p * 1000, 360, 1).legs, face: { eyes: 'half', mouth: 'flat' } })));
  const k = bk(t, fw(4, '50') - .1, .4); if (k > 0) { scaled(ctx, 1250, 780, k, () => { rrect(ctx, -330, -70, 660, 140, 70); fillStroke(ctx, '#ff4d4d', 9); tx(ctx, 'hingga 50% lebih lambat', 0, 4, 52, '#fff', 0); }); }
}
function gfxGauge01(ctx, t) {
  const t0 = ls(5);
  gauge(ctx, 800, 600, 420, lerp(.5, .95, ease(inv(fw(5, 'turun'), fw(5, '01') + .3, t))), 'terjaga lebih lama lagi', kAt(t, fw(5, '01')) > 0 ? '0,1%' : '0,05%', t, { vcol: kAt(t, fw(5, '01')) > 0 ? '#ff6a6a' : '#ffe14d' });
}
function boardBrain(ctx, t) { brain(ctx, 800, 430, 1.25 * bk(t, ls(6), .45) + .01, t, {}); }
// brain cells spreading apart during sleep (mouse study), fluid washing waste
function gfxCells(ctx, t, wash) {
  const t0 = ls(7), sp = 1 + .6 * ease(inv(fw(7, 'membesar'), fw(7, '60') + .4, t));
  ctx.save(); ctx.beginPath(); ctx.rect(150, 120, 1300, 700); ctx.clip();
  ctx.fillStyle = '#7fd0ff'; ctx.fillRect(150, 120, 1300, 700);
  for (let i = 0; i < 9; i++) { ctx.save(); ctx.globalAlpha = .35; ctx.beginPath(); for (let x = 150; x <= 1450; x += 20) ctx.lineTo(x, 160 + i * 80 + Math.sin(x * .02 + t * 3 + i) * 10); ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore(); }
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) { const cx = 800 + (c - 3) * 175 * sp, cy = 470 + (r - 1.5) * 165 * sp; circle(ctx, cx, cy, 70); fillStroke(ctx, '#ffb3c4', 7); circle(ctx, cx - 14, cy - 10, 26); fillStroke(ctx, '#d9537a', 5); }
  if (wash) { const r = rng(5); for (let i = 0; i < 40; i++) { const x0 = 150 + r() * 1300, y0 = 130 + r() * 680; const x = x0 + ((t * 260 * (wash > 0 ? wash : 0) + i * 37) % 1400); circle(ctx, 150 + (x - 150) % 1300, y0, 12); fillStroke(ctx, '#ffd23a', 4); } }
  ctx.restore();
  rrect(ctx, 150, 120, 1300, 700, 30); fillStroke(ctx, null, 9);
  const kp = bk(t, fw(7, '60') - .1, .4); if (kp > 0) scaled(ctx, 1290, 200, kp, () => { rrect(ctx, -170, -60, 340, 120, 60); fillStroke(ctx, '#ffd23a', 8); tx(ctx, '+60%', 0, 4, 70, INK); });
  const kr = bk(t, fw(7, 'tikus') - .1, .4); if (kr > 0) { scaled(ctx, 320, 760, .5 * kr, () => { card2(ctx, 0, 0, 560, 260, '#ffffff', 40); rat(ctx, 30, 20, .7, t); }); }
  if (wash != null) { const kb = bk(t, fw(8, 'betaamiloid') - .1, .4); if (kb > 0) scaled(ctx, 800, 860, kb, () => { rrect(ctx, -260, -46, 520, 92, 46); fillStroke(ctx, '#ffd23a', 7); tx(ctx, 'beta-amiloid', 0, 3, 52, INK); }); }
}
function gfxPET(ctx, t) {
  const t0 = ls(9); const k = kAt(t, fw(9, 'meningkatkan'), .8);
  brain(ctx, 600, 500, 1.05 * bk(t, t0, .4) + .01, t, { hl: [[60, 30, 120, k * (.7 + .3 * Math.sin(t * 6))], [-60, 60, 100, k * (.7 + .3 * Math.sin(t * 6 + 1))]] });
  const km = bk(t, fw(9, 'satu') - .1, .4); if (km > 0) scaled(ctx, 1260, 330, km, () => { card2(ctx, 0, 0, 420, 300, '#24356e', 40); circle(ctx, 0, -40, 70); ctx.fillStyle = '#fff7c9'; ctx.fill(); circle(ctx, 30, -60, 62); ctx.fillStyle = '#24356e'; ctx.fill(); tx(ctx, '1 MALAM', 0, 90, 60, '#fff', 0); });
  const kh = bk(t, fw(9, 'manusia') - .1, .4); if (kh > 0) tx(ctx, 'pada manusia, 2018', 1260, 620, 50 * kh + .1, '#b9c3ff', 8);
  const ku = kAt(t, fw(9, 'meningkatkan'), .4); if (ku > 0) tx(ctx, 'beta-amiloid ↑', 1260, 720, 64, '#ffd23a', 12);
}
function boardAlz(ctx, t) { brain(ctx, 560, 450, 1.0, t, { col: '#d9a7b4' }); tx(ctx, 'Alzheimer', 1150, 400, 100 * bk(t, fw(10, 'alzheimer') - .1, .4) + .1, '#fff', 14); tx(ctx, 'dikaitkan', 1150, 540, 60 * bk(t, fw(10, 'dikaitkan') - .1, .4) + .1, '#b9c3ff', 10); }
function boardNotCause(ctx, t) {
  const t0 = ls(11); tx(ctx, '1 malam begadang', 800, 230, 80, '#fff', 12); tx(ctx, '≠', 800, 400, 180 * bk(t, fw(11, 'bukan') - .1, .4) + .1, '#ff6a6a', 20); tx(ctx, 'menyebabkan Alzheimer', 800, 580, 80, '#fff', 12);
  const kc = kAt(t, fw(11, 'tapi'), .5); if (kc > 0) { ctx.save(); ctx.globalAlpha = kc; ctx.fillStyle = '#16244f'; ctx.fillRect(0, 0, 1600, 900); brain(ctx, 800, 420, 1.2, t, {}); for (let i = 0; i < 6; i++) sparkle(ctx, 450 + i * 140, 220 + (i % 2) * 380, 50 * (.6 + .4 * Math.sin(t * 5 + i)), 1); tx(ctx, 'tidur = waktu bersih-bersih otak', 800, 800, 64, '#ffe14d', 12); ctx.restore(); }
}
function gfxPapers(ctx, t) {
  const t0 = ls(13); const n = Math.round(lerp(1, 21, ease(inv(fw(13, '21') - 1.2, fw(13, '21') + .3, t))));
  papers(ctx, 560, 640, 21, n / 21 * bk(t, t0, .3), t);
  tx(ctx, String(n), 1180, 420, 260, '#ffe14d', 24); tx(ctx, 'penelitian', 1180, 600, 76, '#fff', 12); tx(ctx, 'tinjauan tahun 2018', 1180, 200, 54, '#b9c3ff', 8);
}
function gfxTimeline(ctx, t, stage) {
  const p = stage === 1 ? lerp(0, .33, ease(inv(ls(14), ls(14) + 1.5, t))) : stage === 2 ? lerp(.33, .66, ease(inv(ls(15), ls(15) + 1.5, t))) : lerp(.66, 1, ease(inv(ls(16), ls(16) + 1.5, t)));
  tx(ctx, 'TANPA TIDUR', 800, 110, 70, '#fff', 12);
  timelineBar(ctx, 160, 1440, 290, p, [{ at: 0, label: '0 j' }, { at: .27, label: '24 j' }, { at: .53, label: '48 j' }, { at: .8, label: '72 j' }, { at: 1, label: '90 j' }], t);
  if (stage === 1) {
    const items = [['gangguan penglihatan', 'gangguan'], ['cemas', 'cemas'], ['mudah marah', 'mudah'], ['bingung soal waktu', 'bingung']];
    items.forEach(([lab, w], i) => { const k = bk(t, fw(14, w) - .1, .35); if (k <= 0) return; scaled(ctx, 260 + i * 360, 620, k, () => { card2(ctx, 0, 0, 320, 300, '#24356e', 34);
      if (i === 0) drawEye(ctx, 0, -40, .35, t, { lid: .2, red: .3, drift: 3 }); else if (i === 1) { drawStick(ctx, C(BUDI, { x: 0, y: 90, s: 230, shadow: false, face: { eyes: 'wide', mouth: 'frown' } })); sweat(ctx, 60, -80, 18); } else if (i === 2) drawStick(ctx, C(BUDI, { x: 0, y: 90, s: 230, shadow: false, face: { eyes: 'squint', mouth: 'teeth', browAng: .4 } })); else clockFace(ctx, 0, -30, 80, t * 3, {});
      tx(ctx, lab, 0, 110, lab.length > 12 ? 30 : 38, '#fff', 0); }); });
    tx(ctx, '24–48 jam', 800, 450, 56, '#ffe14d', 10);
  } else if (stage === 3) {
    const k = bk(t, fw(16, 'delusi') - .1, .4); if (k > 0) scaled(ctx, 800, 660, k, () => { card2(ctx, 0, 0, 900, 300, '#5a1d2e', 40); tx(ctx, 'delusi', 0, -60, 90, '#ffd23a', 12); tx(ctx, 'mirip psikosis akut', 0, 60, 70 * kAt(t, fw(16, 'psikosis') - .2, .4), '#fff', 10); });
    tx(ctx, 'setelah 72 jam', 800, 440, 56, '#ffe14d', 10);
  }
}
function sceneHalluc(ctx, lt, t) {
  const hh = shake(t * .35, 3, 1, 2);
  const cam = { x: 560 + hh[0], y: 860 + hh[1], z: 1.15 + lt * .03, r: Math.sin(t * .8) * .04 };
  bedroomBG(ctx, t, cam, { dawn: 0, clockSpin: t * 4 }); applyCam(ctx, cam, 1);
  const s = 640, x = 560, y = 1330, m = micro(t, 3);
  drawStick(ctx, C(BUDI, { x, y, s, lean: Math.sin(t * 1.3) * .06, headTilt: Math.sin(t * 1.7) * .1, arms: { L: [.5 + Math.sin(t * 2) * .2, -1.2], R: [.6 + Math.sin(t * 2.4) * .2, 1.1] }, face: { eyes: 'spiral', mouth: 'o', t, blink: m.blink } }));
  drawHallucinations(ctx, x, y - .8 * s, t, inv(.1, .8, lt));
  const k = bk(t, ls(15) + .4, .4); if (k > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); scaled(ctx, 1500, 140, k, () => { rrect(ctx, -290, -60, 580, 120, 60); fillStroke(ctx, '#ffd23a', 8); tx(ctx, '48–90 jam', 0, 4, 64, INK); }); }
}
function sceneSleep(ctx, lt, t) {
  const hh = shake(t * .35, 2, 1, 2);
  const cam = { x: 700 + hh[0], y: 900 + hh[1], z: 1.25 + lt * .02, r: 0 };
  bedroomBG(ctx, t, cam, { dawn: 0, clockSpin: .1 }); applyCam(ctx, cam, 1);
  drawBed(ctx, 760, 1330, 1.6, { blanket: false });
  // Budi asleep: head on pillow, blanket over body
  const hx = 450, hy = 1000; circle(ctx, hx, hy, 70); fillStroke(ctx, '#f6f2ea', 8);
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(hx + sd * 24 + 6, hy - 4, 14, Math.PI * .1, Math.PI * .9); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.beginPath(); ctx.arc(hx + 6, hy + 22, 16, .3, Math.PI - .3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx - 10, hy - 68); ctx.quadraticCurveTo(hx - 20, hy - 110, hx + 8, hy - 112); ctx.lineWidth = 6; ctx.stroke();
  const br = Math.sin(t * 1.6) * 8;
  ctx.beginPath(); ctx.moveTo(480, 1030 - br); ctx.quadraticCurveTo(800, 980 - br, 1190, 1020); ctx.lineTo(1190, 1170); ctx.lineTo(480, 1170); ctx.closePath(); fillStroke(ctx, '#4a8cff', 9);
  for (let i = 0; i < 3; i++) { const p = ((t * .5 + i * .33) % 1); ctx.save(); ctx.globalAlpha = Math.sin(p * Math.PI); text(ctx, 'Z', hx + 90 + p * 140 + i * 10, hy - 90 - p * 200, 50 + i * 12, '#9fc6ff', INK, 9); ctx.restore(); }
  const k = bk(t, fw(17, 'hilang') - .1, .4); if (k > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); drawCheck(ctx, 1560, 260, 110 * k, 1); }
}

buildShots([
  [0, 'whip', TITLE(1, 'TIDUR', moonIcon, { c1: '#3d4fb0', c2: '#1b2263' })],
  [ls(1) - .1, 'whip', GFX(gfxClock, { c1: '#ff9a4a', c2: '#3b2a6e' })],
  [ls(2) - .1, 'cut', HOST({ frame: 'wide', content: boardHours })],
  [fw(2, 'jam') - .1, 'cut', HOST({ frame: 'med', content: boardHours })],
  [ls(3) - .1, 'cut', HOST({ frame: 'side', content: boardStudy2000 })],
  [fw(3, 'setara') - .2, 'whip', GFX(gfxGauge05)],
  [ls(4) - .1, 'whip', GFX(gfxReaction, { c1: '#12806b', c2: '#0a4a46' })],
  [ls(5) - .1, 'whip', GFX(gfxGauge01)],
  [fw(5, '01') + .4, 'cut', HOST({ frame: 'react', content: boardStudy2000, ibuEyes: 'wide', ibuMouth: 'o', ibuFace: { browUp: 1 } })],
  [ls(6) - .1, 'cut', HOST({ frame: 'wide', content: boardBrain })],
  [ls(7) - .1, 'whip', GFX((c, t) => gfxCells(c, t, null), { c1: '#2a3d8f', c2: '#171f52' })],
  [ls(8) - .1, 'cut', GFX((c, t) => gfxCells(c, t, 1), { c1: '#2a3d8f', c2: '#171f52' })],
  [ls(9) - .1, 'whip', GFX(gfxPET, { c1: '#3b2a6e', c2: '#1a1240' })],
  [ls(10) - .1, 'cut', HOST({ frame: 'close', content: boardAlz, browAng: .15 })],
  [ls(11) - .1, 'cut', HOST({ frame: 'two', content: boardNotCause, ibuFace: { browUp: .6 } })],
  [fw(11, 'tapi') - .1, 'cut', HOST({ frame: 'wide', content: boardNotCause })],
  [ls(12) - .1, 'cut', HOST({ frame: 'low', content: boardBrain })],
  [ls(13) - .1, 'whip', GFX(gfxPapers)],
  [ls(14) - .1, 'whip', GFX((c, t) => gfxTimeline(c, t, 1), { c1: '#1d2c63', c2: '#101839' })],
  [ls(15) - .1, 'whip', sceneHalluc],
  [ls(16) - .1, 'whip', GFX((c, t) => gfxTimeline(c, t, 3), { c1: '#3b1a2e', c2: '#160a14' })],
  [ls(17) - .1, 'whip', sceneSleep],
], END);
