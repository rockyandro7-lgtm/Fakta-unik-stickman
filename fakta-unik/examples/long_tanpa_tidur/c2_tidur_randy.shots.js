// ---------- Bab 2: Kisah Randy Gardner ----------
const SHOTS = [];
const END = WORDS[WORDS.length - 1].e + .6;
const RANDY = BUDI;
const ROSS = { cols: ['#2a3f8f', '#2a3f8f'], hat: 'captain', belt: false };
const FRIEND1 = { cols: ['#7a4bc4', '#7a4bc4'], hat: 'none', belt: false };
const FRIEND2 = { cols: ['#f2b52a', '#f2b52a'], hat: 'none', belt: false };
const camAt = (t, lt, x, y, z, o = {}) => { const h = shake(t * .35, o.sh == null ? 2.5 : o.sh, 1, 2); return { x: x + h[0] + (o.dx || 0) * lt, y: y + h[1], z: z * (1 + (o.push == null ? .02 : o.push) * lt), r: o.r || 0 }; };
function hallBG(ctx, t, cam, c1 = '#bfe3ff', c2 = '#86c3f0') {
  applyCam(ctx, cam, .3); const g = ctx.createLinearGradient(0, -300, 0, 900); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(-2000, -2000, 6000, 2900);
  ctx.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 8; i++) { rrect(ctx, -200 + i * 320, 80, 200, 300, 16); ctx.fill(); }
  applyCam(ctx, cam, 1); const fy = 860; const fg = ctx.createLinearGradient(0, fy, 0, 1500); fg.addColorStop(0, '#d9a56b'); fg.addColorStop(1, '#b77942'); ctx.fillStyle = fg; ctx.fillRect(-2000, fy, 6000, 1500);
  ctx.strokeStyle = 'rgba(90,45,15,.3)'; ctx.lineWidth = 4; for (let i = -10; i < 30; i++) { const x = i * 140; ctx.beginPath(); ctx.moveTo(960 + (x - 960) * .55, fy); ctx.lineTo(x, 1500); ctx.stroke(); }
  rrect(ctx, -2000, fy - 30, 6000, 30, 0); fillStroke(ctx, '#f3e3c3', 5);
}
// ---- physically plausible dribble ----
function dribbler(ctx, x, y, s, t, o = {}) {
  const T = .62, p = ((t + (o.ph || 0)) / T) % 1, r = .056 * s;
  const crouch = { L: [.34, -.66], R: [.34, -.66] };
  const legV = .155 * (Math.cos(.34) + Math.cos(.34 - .66)); const bob0 = .31 - legV;
  const push = p < .2 ? Math.sin(p / .2 * Math.PI) : 0;
  const bob = bob0 + push * .012;
  const ballX = x + .27 * s, yTop = y - .33 * s, yRel = y - .24 * s, yFloor = y - r;
  let by, sq = 1, handY, contact = true;
  if (p < .2) { const u = p / .2; by = lerp(yTop, yRel, u * u); handY = by - r; }
  else if (p < .8) { contact = false; const u = (p - .2) / .6; const d = u < .5 ? 1 - (2 * u) ** 2 : 1 - (2 * (1 - u)) ** 2; by = yFloor - d * (yFloor - yRel); handY = yRel - r - Math.sin(u * Math.PI) * .035 * s; if (Math.abs(u - .5) < .06) sq = .8; }
  else { const u = (p - .8) / .2; by = lerp(yRel, yTop, 1 - (1 - u) * (1 - u)); handY = by - r; }
  const handX = ballX - .01 * s;
  drawStick(ctx, C(o.who || RANDY, { x, y, s, bob, lean: .05, headTilt: .16, legs: crouch, armLen: 1.25,
    arms: { L: [.35, -1.2], R: reach(x, y + bob * s, s, 1, handX, handY, -1) },
    face: Object.assign({ eyes: 'normal', look: [.7, .9], mouth: 'smile' }, o.face || {}) }));
  ctx.save(); ctx.translate(ballX, by); ctx.scale(2 - sq, sq); drawBallL(ctx, 0, 0, r, t * (contact ? 2 : 9)); ctx.restore();
  ellipse(ctx, ballX, y - 2, r * (1.1 - (yFloor - by) / (yFloor - yTop) * .4), r * .25); ctx.fillStyle = 'rgba(40,20,30,.2)'; ctx.fill();
}
function drawBallL(ctx, x, y, r, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); circle(ctx, 0, 0, r); fillStroke(ctx, '#ff8a2a', r * .1); ctx.lineWidth = r * .08; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke(); ctx.beginPath(); ctx.arc(-r * 1.25, 0, r * .85, -.9, .9); ctx.stroke(); ctx.beginPath(); ctx.arc(r * 1.25, 0, r * .85, Math.PI - .9, Math.PI + .9); ctx.stroke(); ctx.restore(); }

// ---- shots ----
function boardStory(ctx, t) { newspaper(ctx, 800, 450, 1.3 * bk(t, ls(0) + .3, .4) + .01, 'REMAJA TIDAK TIDUR', 'kisah rekor tahun 1964', {}); }
function gfxNews(ctx, t) {
  const t0 = ls(1); newspaper(ctx, 800, 470, 1.55 * bk(t, t0, .4) + .01, 'SAN DIEGO, 1964', 'siswa SMA coba pecahkan rekor', {});
}
function gfxCard(ctx, t) {
  const t0 = fw(1, 'randy') - .3;
  scaled(ctx, 620, 450, .95 * bk(t, t0, .4) + .01, () => drawVintageCard(ctx, 0, 0, 1, { l1: 'RANDY GARDNER', l2: 'siswa SMA, 17 tahun', draw: () => drawStick(ctx, C(RANDY, { x: 0, y: 150, s: 470, shadow: false, arms: idleArms(t), face: { eyes: 'normal', mouth: 'smile', blink: micro(t, 4).blink } })) }));
  const k = bk(t, fw(1, 'rekor') - .1, .4); if (k > 0) scaled(ctx, 1220, 450, k, () => { card2(ctx, 0, 0, 520, 300, '#ffd23a', 40); tx(ctx, 'TARGET:', 0, -60, 52, INK); tx(ctx, 'rekor tidak tidur', 0, 30, 54, INK); });
}
function sceneFair(ctx, lt, t) {
  const cam = camAt(t, lt, 960, 560, 1.05); hallBG(ctx, t, cam); applyCam(ctx, cam, 1);
  rrect(ctx, 560, 230, 800, 470, 20); fillStroke(ctx, '#ffffff', 9); tx(ctx, 'PROYEK SAINS', 960, 300, 64, '#2a3f8f');
  tx(ctx, 'Berapa lama manusia', 960, 400, 46, INK); tx(ctx, 'bisa tidak tidur?', 960, 460, 46, INK); clockFace(ctx, 960, 590, 80, t * 2, {});
  rrect(ctx, 480, 700, 960, 40, 10); fillStroke(ctx, '#b4693a', 7);
  const s = 520;
  [[640, FRIEND1, 1.2], [960, RANDY, 0], [1280, FRIEND2, 2.4]].forEach(([x, who, sd]) => { const m = micro(t, sd); drawStick(ctx, C(who, { x, y: 1010, s, bob: Math.sin(t * 2 + sd) * .003, arms: armsAt(t, [{ t: ls(2) + .4 + sd * .3, g: who === RANDY ? 'raise' : 'open' }], sd, presenterArms(t, sd, false)), face: { eyes: 'happy', mouth: 'grin', blink: m.blink, look: m.look } })); });
}
function gfxNoPills(ctx, t) {
  const t0 = ls(3);
  const kp = bk(t, fw(3, 'obat') - .1, .4); if (kp > 0) scaled(ctx, 260, 330, kp, () => { rrect(ctx, -120, -50, 240, 100, 50); fillStroke(ctx, '#ffffff', 8); ctx.save(); rrect(ctx, -120, -50, 240, 100, 50); ctx.clip(); ctx.fillStyle = '#ff6a8a'; ctx.fillRect(0, -60, 130, 120); ctx.restore(); rrect(ctx, -120, -50, 240, 100, 50); fillStroke(ctx, null, 8); noSign(ctx, 0, 0, 170, 1); });
  tx(ctx, 'tanpa obat perangsang', 260, 560, 44 * kp + .1, '#fff', 8);
  const items = [['kola', 'minuman kola', c => colaCan(c, 0, -20, 1.1)], ['musik', 'musik keras', c => musicNote(c, 0, 0, 1.1, t)], ['mandi', 'mandi air dingin', c => shower(c, 0, 40, 1.0, t)]];
  items.forEach(([w, lab, fn], i) => { const k = bk(t, fw(3, w) - .1, .4); if (k <= 0) return; scaled(ctx, 680 + i * 330, 380, k, () => { circle(ctx, 0, 0, 150); fillStroke(ctx, '#24356e', 8); ctx.save(); circle(ctx, 0, 0, 146); ctx.clip(); ctx.scale(.75, .75); fn(ctx); ctx.restore(); }); tx(ctx, lab, 680 + i * 330, 620, 40, '#fff', 8); });
}
function sceneDementArrives(ctx, lt, t) {
  const cam = camAt(t, lt, 960, 560, 1.05); bedroomBG(ctx, t, { x: cam.x - 400, y: cam.y + 320, z: cam.z, r: 0 }, { dawn: 1, clockSpin: t });
  const cam2 = { x: cam.x - 400, y: cam.y + 320, z: cam.z, r: 0 }; applyCam(ctx, cam2, 1);
  const s = 600, yF = 1300;
  const W = (() => { const k = ease(inv(.2, 2.6, lt)); const x = lerp(1500, 1000, k); const moving = lt > .2 && lt < 2.6; return { x, w: moving ? walkCycle(Math.abs(x - 1500), s, 1) : null }; })();
  const m1 = micro(t, 5), m2 = micro(t, 6, { lookAt: [1, 0] });
  drawStick(ctx, C(RANDY, { x: 420, y: yF, s, arms: armsAt(t, [{ t: ls(4) + 2.4, g: 'wave' }], 1, presenterArms(t, 1, false)), face: { eyes: 'normal', look: [1, 0], mouth: 'smile', blink: m2.blink } }));
  drawStick(ctx, C(LAB, { x: W.x, y: yF, s, flip: -1, legs: W.w ? W.w.legs : standL, bob: W.w ? W.w.bob : 0, footDir: W.w ? W.w.footDir : null, lean: W.w ? W.w.lean : 0, arms: W.w ? W.w.arms : armsAt(t, [{ t: ls(4) + 2.7, g: 'open' }], 3, presenterArms(t, 3, false)), face: { eyes: 'normal', look: [-1, 0], mouth: 'smile', blink: m1.blink } }));
  const k = bk(t, fw(4, 'dement') - .1, .4); if (k > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); scaled(ctx, 1450, 150, k, () => { rrect(ctx, -330, -70, 660, 140, 70); fillStroke(ctx, '#fff', 8); tx(ctx, 'William Dement', 0, -14, 50, INK); tx(ctx, 'peneliti tidur, Stanford', 0, 38, 32, '#5a6280'); }); }
}
function sceneDribble(ctx, lt, t) {
  const cam = camAt(t, lt, 960, 640, 1.25, { push: .03 }); hallBG(ctx, t, cam, '#ffe2a8', '#ffc77a'); applyCam(ctx, cam, 1);
  // hoop on the wall
  rrect(ctx, 1380, 180, 260, 180, 12); fillStroke(ctx, '#ffffff', 8); rrect(ctx, 1460, 250, 100, 70, 6); ctx.lineWidth = 6; ctx.strokeStyle = '#e5262a'; ctx.stroke(); ellipse(ctx, 1510, 370, 70, 14); ctx.lineWidth = 9; ctx.strokeStyle = '#ff6a2a'; ctx.stroke();
  for (let i = 0; i < 6; i++) line(ctx, 1445 + i * 26, 372, 1460 + i * 20, 450, 3, '#fff');
  dribbler(ctx, 760, 1010, 600, t, { face: { blink: micro(t, 5).blink } });
  const m = micro(t, 7, { lookAt: [-1, .5] });
  drawStick(ctx, C(LAB, { x: 1250, y: 1010, s: 600, flip: -1, arms: armsAt(t, [{ t: fw(4, 'basket') + .3, g: 'open' }], 3, presenterArms(t, 3, false)), face: { eyes: 'normal', look: [-1, .6], mouth: 'grin', blink: m.blink } }));
}
function scenePinball(ctx, lt, t) {
  const cam = camAt(t, lt, 960, 560, 1.15); hallBG(ctx, t, cam, '#3b2a6e', '#1a1240'); applyCam(ctx, cam, 1);
  pinball(ctx, 960, 800, 1.6, t);
  const m = micro(t, 5);
  const press = Math.sin(t * 9) > .6 ? 1 : 0;
  drawStick(ctx, C(RANDY, { x: 620, y: 1060, s: 620, lean: .04, arms: { L: [.5, -1.0], R: reach(620, 1060, 620, 1, 760, 1000 - press * 12, -1) }, face: { eyes: 'wide', look: [1, -.2], mouth: 'grin', blink: m.blink } }));
  drawStick(ctx, C(LAB, { x: 1320, y: 1060, s: 620, flip: -1, arms: { L: [.5, -1.0], R: reach(1320, 1060, 620, -1, 1160, 1000 - (1 - press) * 12, 1) }, face: { eyes: 'normal', look: [-1, -.2], mouth: 'smirk' } }));
}
function sceneDay3(ctx, lt, t) {
  const cam = camAt(t, lt, 760, 820, 1.25, { push: .03 }); bedroomBG(ctx, t, cam, { dawn: .6, clockSpin: t * 2 }); applyCam(ctx, cam, 1);
  const s = 640, x = 700, y = 1330, sick = kAt(t, fw(5, 'mual') - .1, .5);
  drawStick(ctx, C(RANDY, { x, y, s, lean: Math.sin(t * 1.2) * .03, headTilt: .08 + Math.sin(t * 1.5) * .05, arms: sick > .5 ? { L: { ik: [-.02, -.46], bend: 1 }, R: { ik: [.03, -.46], bend: -1 } } : presenterArms(t, 1, false), face: { eyes: sick > .5 ? 'squint' : 'half', mouth: sick > .5 ? 'frown' : 'flat', look: [0, 0] } }));
  if (sick > 0) { ctx.save(); ctx.globalAlpha = .35 * sick; circle(ctx, x, y - .765 * s, .19 * s); ctx.fillStyle = '#7cc23a'; ctx.fill(); ctx.restore(); }
  const kq = kAt(t, fw(5, 'sulit') - .1, .4); if (kq > 0) [[x - 170, y - .9 * s], [x + 150, y - 1.0 * s]].forEach(([qx, qy], i) => qmark(ctx, qx, qy + Math.sin(t * 3 + i) * 8, 140 * backOut(kq), (i - .5) * .4));
  ctx.setTransform(1, 0, 0, 1, 0, 0); const kd = bk(t, fw(5, 'hari') - .1, .4); if (kd > 0) scaled(ctx, 260, 140, kd, () => { rrect(ctx, -170, -60, 340, 120, 60); fillStroke(ctx, '#ffd23a', 8); tx(ctx, 'HARI 3', 0, 4, 64, INK); });
}
function sceneRoss(ctx, lt, t) {
  const cam = camAt(t, lt, 960, 560, 1.15); hallBG(ctx, t, cam, '#cfe0f5', '#9fb8dd'); applyCam(ctx, cam, 1);
  const s = 640, x = 960, y = 1040, m = micro(t, 8, { lookAt: [0, .3] }); const hx = x + .24 * s, hy = y - .4 * s;
  drawStick(ctx, C(ROSS, { x, y, s, arms: { L: presenterArms(t, 8, false).L, R: reach(x, y, s, 1, hx, hy, -1) }, face: { eyes: 'normal', look: [.4, .6], mouth: 'flat', blink: m.blink, browUp: .2 } }));
  ctx.save(); ctx.translate(hx + 30, hy - 40); ctx.rotate(.08); rrect(ctx, -62, -78, 124, 156, 10); fillStroke(ctx, '#fff', 6); rrect(ctx, -22, -92, 44, 24, 8); fillStroke(ctx, '#cfd7e6', 5); for (let i = 0; i < 3; i++) line(ctx, -38, -34 + i * 30, 38 - (i % 2) * 20, -34 + i * 30, 5, '#9aa6bd'); ctx.restore();
  circle(ctx, hx, hy, .03 * s); ctx.fillStyle = INK; ctx.fill();
  const k = bk(t, fw(6, 'john') - .1, .4); if (k > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); scaled(ctx, 1480, 160, k, () => { rrect(ctx, -330, -70, 660, 140, 70); fillStroke(ctx, '#fff', 8); tx(ctx, 'John Ross', 0, -14, 50, INK); tx(ctx, 'petugas medis Angkatan Laut AS', 0, 38, 30, '#5a6280'); }); }
}
function sceneDay4(ctx, lt, t) {
  const cam = { x: 960, y: 520, z: 1.05 + lt * .04, r: Math.sin(t * .9) * .05 }; hallBG(ctx, t, cam, '#6a3fd0', '#2a1a6a'); applyCam(ctx, cam, 1);
  drawStick(ctx, C(RANDY, { x: 960, y: 1500, s: 1300, shadow: false, headTilt: Math.sin(t * 2) * .1, arms: { L: [.3, -1.2], R: [.3, -1.2] }, face: { eyes: 'spiral', mouth: 'o', t } }));
  drawHallucinations(ctx, 960, 480, t, inv(0, .6, lt));
  ctx.setTransform(1, 0, 0, 1, 0, 0); scaled(ctx, 260, 140, bk(t, ls(6) + 3.5, .4), () => { rrect(ctx, -170, -60, 340, 120, 60); fillStroke(ctx, '#ffd23a', 8); tx(ctx, 'HARI 4', 0, 4, 64, INK); });
}
function gfx264(ctx, t) {
  const t0 = ls(7); tx(ctx, '8 JANUARI 1964', 800, 110, 70 * bk(t, t0, .4) + .1, '#ffe14d', 12);
  const h = lerp(0, 264, ease(inv(fw(7, '264') - 1.2, fw(7, 'jam') + .1, t)));
  scaled(ctx, 800, 420, 1.15, () => drawHourCounter(ctx, 0, 0, 1, h, { col: h >= 263.5 ? '#ff6a6a' : '#ffe14d' }));
  tx(ctx, '= 11 HARI', 800, 760, 110 * bk(t, fw(7, '11') - .1, .4) + .1, '#fff', 16);
}
function sceneSleep14(ctx, lt, t) {
  const cam = camAt(t, lt, 960, 600, 1.1); hallBG(ctx, t, cam, '#c9d6ff', '#9fb0e8'); applyCam(ctx, cam, 1);
  drawBed(ctx, 900, 1000, 1.4, { blanket: false });
  const hx = 620, hy = 720; circle(ctx, hx, hy, 66); fillStroke(ctx, '#f6f2ea', 8);
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(hx + sd * 22 + 6, hy - 4, 13, Math.PI * .1, Math.PI * .9); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.beginPath(); ctx.arc(hx + 6, hy + 22, 14, .3, Math.PI - .3); ctx.stroke();
  const br = Math.sin(t * 1.6) * 7; ctx.beginPath(); ctx.moveTo(650, 750 - br); ctx.quadraticCurveTo(900, 700 - br, 1310, 735); ctx.lineTo(1310, 860); ctx.lineTo(650, 860); ctx.closePath(); fillStroke(ctx, '#4a8cff', 9);
  for (let i = 0; i < 3; i++) { const p = ((t * .5 + i * .33) % 1); ctx.save(); ctx.globalAlpha = Math.sin(p * Math.PI); text(ctx, 'Z', hx + 80 + p * 130, hy - 80 - p * 180, 50 + i * 12, '#5a7fd6', INK, 9); ctx.restore(); }
  const h = lerp(0, 14, ease(inv(fw(8, '14') - .6, fw(8, 'jam') + .5, t)));
  clockFace(ctx, 1520, 330, 150 * bk(t, ls(8), .4) + .1, 9 + h, { wedge: [9] }); tx(ctx, Math.round(h) + ' JAM', 1520, 540, 64, '#2a3f8f', 0);
  const kc = bk(t, fw(8, 'sehat') - .1, .4); if (kc > 0) { drawCheck(ctx, 400, 300, 100 * kc, 1); tx(ctx, 'sehat', 400, 450, 54, '#2cb35e', 0); }
}
function sceneDementMind(ctx, lt, t) {
  const cam = camAt(t, lt, 760, 560, 1.25, { push: .03 }); hallBG(ctx, t, cam, '#ffe2a8', '#ffc77a'); applyCam(ctx, cam, 1);
  const s = 700, x = 520, y = 1150, m = micro(t, 9, { lookAt: [1, -.6] });
  const turn = kAt(t, fw(9, 'menarik') - .2, .5);
  drawStick(ctx, C(LAB, { x, y, s, headTilt: .06 - turn * .1, arms: turn > .5 ? armsAt(t, [{ t: fw(9, 'menarik'), g: 'shrug' }], 9, presenterArms(t, 9, false)) : { L: [.35, -1.35], R: reach(x, y, s, 1, x + .07 * s, y - .66 * s, -1) }, face: { eyes: 'normal', look: [.9, -.7], mouth: turn > .5 ? 'smirk' : 'flat', blink: m.blink, browOne: turn > .5 ? 0 : 1, browUp: turn * .8 } }));
  const kb = bk(t, ls(9) + .8, .5);
  if (kb > 0) { ctx.save(); ctx.translate(1060, 360); ctx.scale(kb, kb); circle(ctx, -330, 230, 24); fillStroke(ctx, '#fff', 6); circle(ctx, -280, 170, 36); fillStroke(ctx, '#fff', 6); rrect(ctx, -300, -150, 600, 290, 120); fillStroke(ctx, '#fff', 8); tx(ctx, 'kurang tidur', 0, -50, 52, INK); tx(ctx, '= gangguan jiwa?', 0, 30, 52, '#e5262a'); if (turn > 0) { line(ctx, -240, -10, -240 + 480 * turn, -10, 14, '#e5262a'); } ctx.restore(); }
}
function gfxMicrosleep(ctx, t) {
  const t0 = fw(10, 'microsleep') - .3; const ph = (t - t0) % 1.6; const lid = (t > t0 && ph > .9 && ph < 1.35) ? Math.sin((ph - .9) / .45 * Math.PI) : .25;
  drawEye(ctx, 560, 480, .95, t, { lid, red: .7 });
  tx(ctx, 'MICROSLEEP', 1180, 300, 90 * bk(t, t0, .4) + .1, '#ffe14d', 14);
  tx(ctx, 'tertidur sesaat', 1180, 450, 56 * bk(t, fw(10, 'tertidur') - .1, .4) + .1, '#fff', 10);
  tx(ctx, 'beberapa detik', 1180, 540, 56 * bk(t, fw(10, 'detik') - .3, .4) + .1, '#fff', 10);
  tx(ctx, 'tanpa sadar', 1180, 630, 56 * bk(t, fw(10, 'sadar') - .2, .4) + .1, '#fff', 10);
}
function gfxRecords(ctx, t) {
  const t0 = ls(11); tx(ctx, 'REKOR TANPA TIDUR', 800, 120, 70, '#fff', 12);
  barH(ctx, 680, 360, 700, 100, 264 / 453 * ease(inv(t0 + .3, t0 + 1.6, t)), '#4ab3f0', 'Randy, 1964', kAt(t, t0 + 1.4) > 0 ? '264 jam' : '');
  barH(ctx, 680, 580, 700, 100, ease(inv(fw(11, '453') - .8, fw(11, '453') + .4, t)), '#ff6a3c', 'McDonald, 1986', kAt(t, fw(11, '453')) > 0 ? '453 jam' : '');
  tx(ctx, 'hampir 19 hari', 1250, 740, 60 * bk(t, fw(11, 'hampir') - .1, .4) + .1, '#ffe14d', 10);
  tx(ctx, 'dicatat Guinness', 800, 840, 40, '#b9c3ff', 0);
}
function gfxStop(ctx, t) {
  const t0 = ls(12);
  scaled(ctx, 560, 470, 1.2 * bk(t, t0, .4) + .01, () => { rrect(ctx, -230, -280, 460, 560, 24); fillStroke(ctx, '#2a6fd6', 10); rrect(ctx, -190, -240, 380, 480, 14); fillStroke(ctx, '#1d4fa8', 6); tx(ctx, 'BUKU', 0, -90, 72, '#ffe14d'); tx(ctx, 'REKOR', 0, 0, 72, '#ffe14d'); });
  const k = kAt(t, fw(12, 'berhenti') - .1, .14); if (k > 0) drawStamp(ctx, 560, 470, k < 1 ? lerp(2.6, .9, easeOut(k)) : .9, 'BERHENTI', { size: 110 });
  warnSign(ctx, 1220, 420, .9 * bk(t, fw(12, 'berbahaya') - .2, .4) + .01, 'terlalu berbahaya');
}
function gfxRat(ctx, t) {
  const t0 = ls(13); scaled(ctx, 520, 470, 1.0 * bk(t, t0, .4) + .01, () => { rrect(ctx, -330, -230, 660, 460, 30); fillStroke(ctx, '#24356e', 9); for (let i = 0; i < 9; i++) line(ctx, -300 + i * 75, -230, -300 + i * 75, 230, 5, '#5a6aa8'); rat(ctx, 0, 60, 1.0, t); });
  tx(ctx, 'penelitian hewan', 1200, 260, 54, '#b9c3ff', 8);
  calendarN(ctx, 1200, 520, .8 * bk(t, fw(13, 'minggu') - .4, .4) + .01, 7, 7 * ease(inv(fw(13, 'minggu') - .3, fw(13, 'minggu') + 1, t)), 'MINGGU');
}
function gfxFFI(ctx, t) {
  const t0 = ls(14); dna(ctx, 440, 470, 1.3 * bk(t, t0, .4) + .01, t);
  tx(ctx, 'sangat langka', 1150, 220, 64 * bk(t, fw(14, 'langka') - .1, .4) + .1, '#ffe14d', 12);
  tx(ctx, 'insomnia familial fatal', 1150, 360, 58 * bk(t, fw(14, 'insomnia') - .1, .4) + .1, '#fff', 10);
  drawEye(ctx, 1150, 620, .5 * bk(t, fw(14, 'kehilangan') - .1, .4) + .01, t, { lid: 0, red: .9 });
}
function boardNeed(ctx, t) {
  drawBed(ctx, 800, 640, 1.6, {}); drawHeart(ctx, 800, 240, 1.4 * bk(t, fw(15, 'kebutuhan') - .2, .4) + .01, t, {});
}

buildShots([
  [0, 'whip', HOST({ frame: 'close', content: boardStory, push: .04 })],
  [ls(1) - .1, 'whip', GFX(gfxNews, { c1: '#5a4a3a', c2: '#2a2018' })],
  [fw(1, 'randy') - .3, 'cut', GFX(gfxCard, { c1: '#d8c39a', c2: '#a88a5a' })],
  [ls(2) - .1, 'whip', sceneFair],
  [ls(3) - .1, 'whip', GFX(gfxNoPills, { c1: '#12806b', c2: '#0a4a46' })],
  [ls(4) - .1, 'whip', sceneDementArrives],
  [fw(4, 'sambil') - .1, 'cut', sceneDribble],
  [fw(4, 'pinball') - .25, 'cut', scenePinball],
  [ls(5) - .1, 'whip', sceneDay3],
  [ls(6) - .1, 'whip', sceneRoss],
  [fw(6, 'keempat') - .3, 'cut', sceneDay4],
  [ls(7) - .1, 'whip', GFX(gfx264, { c1: '#2a3d8f', c2: '#171f52' })],
  [ls(8) - .1, 'whip', sceneSleep14],
  [ls(9) - .1, 'whip', sceneDementMind],
  [ls(10) - .1, 'whip', HOST({ frame: 'med', content: (c, t) => gfxMicrosleep(c, t) })],
  [fw(10, 'microsleep') - .3, 'cut', GFX(gfxMicrosleep)],
  [ls(11) - .1, 'whip', GFX(gfxRecords)],
  [ls(12) - .1, 'cut', GFX(gfxStop, { c1: '#5a1d2e', c2: '#2a0d16' })],
  [ls(13) - .1, 'whip', GFX(gfxRat, { c1: '#3b2a6e', c2: '#1a1240' })],
  [ls(14) - .1, 'whip', GFX(gfxFFI, { c1: '#1d2c63', c2: '#101839' })],
  [ls(15) - .1, 'whip', HOST({ frame: 'close', content: boardNeed })],
  [fw(15, 'tidur', 1) - .1, 'cut', HOST({ frame: 'wide', content: boardNeed })],
], END);
