// ---------- Bab 0: Intro ----------
const SHOTS = [];
const END = WORDS[WORDS.length - 1].e + .6;

// sleepy Budi at the window in the morning, foggy brain thought
function sceneFoggy(ctx, lt, t) {
  const hh = shake(t * .35, 2.5, 1, 2);
  const cam = { x: 600 + hh[0], y: 830 + hh[1], z: 1.02 + lt * .012, r: 0 };
  bedroomBG(ctx, t, cam, { dawn: 1, clockSpin: 0.58 }); applyCam(ctx, cam, 1);
  drawBed(ctx, 1150, 1290, 1.25, {});
  const s = 620, x = 520, y = 1300;
  const yawn = pulse(t, .9, .35, .9, .45);
  const m = micro(t, 1.1);
  drawStick(ctx, C(BUDI, { x, y, s, lean: .05 + Math.sin(t * .9) * .02, headTilt: .14 + Math.sin(t * .7) * .04 - yawn * .12,
    arms: (() => { const a = idleArms(t, 1, .6); const up = [2.55, .35]; return { L: [lerp(a.L[0], up[0], yawn), lerp(a.L[1], up[1], yawn)], R: [lerp(a.R[0], up[0], yawn), lerp(a.R[1], up[1], yawn)] }; })(),
    face: { eyes: yawn > .3 ? 'squint' : 'half', look: [.3, .4], blink: m.blink, mouth: yawn > .3 ? 'o' : 'flat', browUp: -.2 } }));
  if (yawn > .3) { ctx.save(); ctx.translate(x + 2, y - .68 * s); ctx.scale(1 + yawn * .6, 1 + yawn * 1.2); ellipse(ctx, 0, 0, 16, 22); fillStroke(ctx, '#6a1f2a', 5); ctx.restore(); }
  // thought bubble with a foggy brain
  const k = bk(t, 1.8, .45);
  if (k > 0) { ctx.save(); ctx.translate(840, 640); ctx.scale(k, k); circle(ctx, -170, 170, 22); fillStroke(ctx, '#fff', 6); circle(ctx, -120, 110, 34); fillStroke(ctx, '#fff', 6); ctx.beginPath(); [[-90, -20, 120], [30, -60, 140], [140, -10, 120], [40, 60, 130], [-60, 60, 110]].forEach(([bx, by, r]) => { ctx.moveTo(bx + r, by); ctx.arc(bx, by, r, 0, TAU); }); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); [[-90, -20, 120], [30, -60, 140], [140, -10, 120], [40, 60, 130], [-60, 60, 110]].forEach(([bx, by, r]) => { ctx.moveTo(bx + r - 4, by); ctx.arc(bx, by, r - 4, 0, TAU); }); ctx.fillStyle = '#fff'; ctx.fill(); brain(ctx, 20, 0, .5, t, { fog: inv(2.2, 3.2, t) }); ctx.restore(); }
}
// days without sleep: calendar crossing fast with day/night sky
function gfxDays(ctx, t) {
  const t0 = ls(1); const n = 7; const crossed = ease(inv(t0 + .6, ls(2) - .3, t)) * n;
  const night = Math.abs(Math.sin(crossed * Math.PI));
  sun(ctx, 230, 200, 70 * (1 - night) + 1, t); circle(ctx, 1370, 200, 70 * night + 1); ctx.fillStyle = '#fff7c9'; ctx.fill();
  calendarN(ctx, 800, 470, 1.25 * bk(t, t0, .4), n, crossed, 'HARI TANPA TIDUR');
  drawEye(ctx, 1330, 720, .42 * bk(t, t0 + 1.2, .4), t, { lid: .3 + .4 * (crossed / n), red: crossed / n });
}
function gfxPlate(ctx, t) {
  const t0 = ls(2);
  scaled(ctx, 800, 520, 1.6 * bk(t, t0, .4), () => { ctx.save(); ctx.globalAlpha = 1 - kAt(t, t0 + .6, .8); drawPlate(ctx, 0, 0, 1, {}); ctx.restore(); });
  // empty plate: cover food with a dust cloth + cobweb
  // the food fades away, leaving an empty plate with a cobweb
  const k = kAt(t, t0 + .6, .8);
  if (k > 0) { scaled(ctx, 800, 520, 1.6, () => { ctx.save(); ctx.globalAlpha = k; ellipse(ctx, 0, -20, 180, 46); fillStroke(ctx, '#f7f9fc', 7); ellipse(ctx, 0, -22, 126, 26); fillStroke(ctx, '#e1e7f1', 4); ctx.restore();
    ctx.save(); ctx.globalAlpha = k * .9; ctx.strokeStyle = '#d9def0'; ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI - Math.PI; line(ctx, 120, -20, 120 + Math.cos(a) * 90, -20 + Math.sin(a) * 60, 3, '#d9def0'); } for (let r = 25; r < 90; r += 22) { ctx.beginPath(); ctx.ellipse(120, -20, r, r * .66, 0, Math.PI, TAU); ctx.stroke(); } ctx.restore(); }); }
  tx(ctx, 'BERMINGGU-MINGGU', 800, 160, 70, '#ffe14d', 12);
  calendarN(ctx, 1330, 300, .5 * bk(t, t0 + .4), 7, ease(inv(t0 + .5, fw(2, 'atau') - .2, t)) * 7, 'MINGGU');
}
function gfxGlass(ctx, t) {
  const t0 = fw(2, 'atau', 1) - .1;
  sun(ctx, 1300, 230, 90, t);
  const fill = .75 * (1 - ease(inv(t0 + .2, t0 + 2, t)));
  scaled(ctx, 700, 650, 1.4 * bk(t, t0, .4), () => drawGlass(ctx, 0, 0, 1, fill, t));
  const k = kAt(t, t0 + 1.6, .3); if (k > 0) noSign(ctx, 700, 450, 190 * backOut(k), 1);
  for (let i = 0; i < 4; i++) { const p = (t * .6 + i * .25) % 1; ctx.save(); ctx.globalAlpha = (1 - p) * .6; ctx.beginPath(); for (let j = 0; j <= 10; j++) { const xx = 380 + i * 220 + Math.sin(t * 5 + j + i) * 14, yy = 880 - p * 200 - j * 16; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 9; ctx.strokeStyle = '#ffb23a'; ctx.stroke(); ctx.restore(); }
}
// board content: the three topics + "dari jam pertama sampai batas"
function boardTopics(ctx, t) {
  const t0 = ls(3);
  const items = [['TIDUR', c => { circle(c, 0, 0, 80); c.fillStyle = '#fff7c9'; c.fill(); circle(c, 30, -24, 70); c.fillStyle = '#16244f'; c.fill(); }], ['MAKAN', c => drawPlate(c, 0, 60, .55, {})], ['MINUM', c => drawGlass(c, 0, 90, .55, .7, t)]];
  items.forEach(([lab, fn], i) => { const k = bk(t, t0 + .2 + i * .3, .4); if (k <= 0) return; scaled(ctx, 300 + i * 500, 320, k * 1.25, () => { circle(ctx, 0, 0, 170); fillStroke(ctx, '#24356e', 8); fn(ctx); }); tx(ctx, lab, 300 + i * 500, 600, 84, '#fff', 14); });
  const kt = kAt(t, fw(3, 'jam') - .2, .3);
  if (kt > 0) { ctx.save(); ctx.globalAlpha = kt; timelineBar(ctx, 200, 1400, 740, ease(inv(fw(3, 'jam'), fw(3, 'manusia') + .3, t)), [{ at: 0, label: 'jam pertama' }, { at: 1, label: 'batas' }], t); ctx.restore(); }
}
function boardWarn(ctx, t) {
  const t0 = ls(4);
  warnSign(ctx, 800, 360, 1.3 * bk(t, fw(4, 'jangan') - .1, .4));
  tx(ctx, 'JANGAN DICOBA', 800, 720, 96 * bk(t, fw(4, 'jangan'), .4) + .1, '#ffe14d', 16);
  const k = bk(t, t0, .4); if (k > 0) { scaled(ctx, 800, 360, .001 + (1 - kAt(t, fw(4, 'jangan') - .1, .2)) * k, () => { brain(ctx, 0, 0, 1, t, {}); }); }
}

buildShots([
  [0, 'whip', (ctx, lt, t) => sceneFoggy(ctx, lt, t)],
  [ls(1) - .1, 'whip', GFX(gfxDays, { c1: '#1d2c63', c2: '#0d1536' })],
  [ls(2) - .1, 'cut', GFX(gfxPlate, { c1: '#3b2a6e', c2: '#1a1240' })],
  [fw(2, 'atau', 1) - .15, 'whip', GFX(gfxGlass, { c1: '#ff9a4a', c2: '#d9541e' })],
  [ls(3) - .1, 'cut', HOST({ frame: 'wide', content: boardTopics, push: .02 })],
  [fw(3, 'tubuhmu') - .1, 'cut', HOST({ frame: 'med', content: boardTopics, push: .03 })],
  [ls(4) - .1, 'cut', HOST({ frame: 'two', content: boardWarn, ibuEyes: 'normal', ibuFace: { browAng: .25, mouth: 'flat' } })],
  [fw(4, 'jangan') - .15, 'whip', HOST({ frame: 'close', content: boardWarn, push: .05, browAng: .2 })],
], END);
