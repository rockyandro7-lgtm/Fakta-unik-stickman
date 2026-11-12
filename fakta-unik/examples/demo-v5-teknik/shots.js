// ---------- DEMO v5: teknik hasil reverse engineering (reference/analisis/ref-01-pirate-cannonballs.md) ----------
// Reel uji, bukan episode: memakai suara/kata template #2 hanya agar caption & timing jalan.
// Pakai: cp -r engine/template <folder>; salin file ini ke <folder>/web/shots.js; jalankan prep_voice + align_scribe; render.
// Setiap shot memamerkan satu teknik:
//  0 push-in 0,7 dtk (ease-out) + ekspresi diskret (lega > licik > sombong > lirik > kaget) + pintu terbuka -> PORTAL menembus kulkas
//  1 di dalam kulkas: kamera TERKUNCI ke panci berwajah (propFace), dunia mulai berayun -> SPIN
//  2 spin keluar ke dapur, panci tetap di titik yang sama; reaksi trio sinkron (kaget > ngeden/cemas > lega) -> MATCH tutup panci
//  3 match cut lingkaran: tutup panci = muka jam; pull-back "scale reveal" + grade waktu (2 jam kemudian) -> DISSOLVE
//  4 gag angka: katrol 200 KG mengangkat Budi (angka dibuktikan lewat fisika) + kilat
//  5 penekanan: stempel MITOS + glint + cahaya dalam + ekspresi bangga/sombong
const SHOTS = [];
const IBU = { cols: ['#ec5b86', '#ec5b86'], hat: 'chef', belt: false, blush: true };
const BUDI = { cols: ['#2f9b5a', '#2f9b5a'], hat: 'tuft', hatCol: INK, belt: false };
const C = (b, e) => Object.assign({}, b, e);
const ENDT = WORDS[WORDS.length - 1].e + 1.2;
const B = [0, 3.2, 6.4, 9.6, 13.2, 17.0];
const SH = (i, o, draw) => SHOTS.push(Object.assign({ start: B[i], end: i + 1 < B.length ? B[i + 1] : ENDT, draw }, o));
const FLOOR = 1560, standL = { L: [.1, -.04], R: [.1, -.04] };
function simpleTable(ctx, y) { rrect(ctx, -400, y, 1880, 56, 14); fillStroke(ctx, '#d9a56b', 8); rrect(ctx, -380, y + 52, 1840, 900, 0); fillStroke(ctx, '#2bb5ae', 8); }

// ---- 0: punch-in + ekspresi + zoom menembus kulkas ----
// kalibrasi dari referensi: push-in ~2x selama 0,7 dtk (ease-out) -> drift/ikuti lirikan -> akselerasi (ease-in) menembus bukaan
const cam0 = (lt, t) => camKeys(lt, t, [[0, { x: 540, y: 1000, z: .78 }], [.7, { x: 380, y: 1180, z: 1.6 }, easeOut], [1.9, { x: 420, y: 1175, z: 1.66 }], [2.6, { x: 790, y: 1200, z: 1.5 }, ease], [3.2, { x: 815, y: 1215, z: 1.9 }, easeIn]], 2);
SH(0, { tr: 'portal', zoomOut: (() => { const c = cam0(3.2, 3.2); const p = toScreen(c, 820, 1215); return { x: p[0], y: p[1], w: 250 * c.z, h: 440 * c.z }; })() }, (ctx, lt, t) => {
  const cam = cam0(lt, t); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  drawFridge(ctx, 820, FLOOR, 1, { t, mood: lt > 2.5 ? 'worry' : 'happy', door: kf(lt, [[2.15, 0], [2.6, 1]]), look: -1 });
  const f = exprTrack(lt, [[0, 'lega'], [.25, 'licik'], [1.0, 'sombong'], [1.8, 'datar', { look: [1, 0] }], [2.55, 'kaget']], { seed: 1 });
  drawStick(ctx, C(BUDI, { x: 360, y: FLOOR, s: 640, legs: standL, arms: idleArms(t, 1), headTilt: .04 * Math.sin(t * 2) - (f.pop || 0) * .05, face: f }));
});
// ---- 1: interior kulkas, kamera terkunci ke panci, mulai berayun ----
const POT1 = [540, 1120];
const cam1 = lt => camLock(POT1[0], POT1[1] - 60, 540, 860, kf(lt, [[0, 1.3], [3.2, 1.08]]), kf(lt, [[2.3, 0], [3.2, .22]], easeIn));
SH(1, { tr: 'spin', spin: .8, pivot: toScreen(cam1(3.2), POT1[0], POT1[1] - 60) }, (ctx, lt, t) => {
  const cam = cam1(lt); applyCam(ctx, cam, 1);
  let g = ctx.createLinearGradient(0, 200, 0, 1800); g.addColorStop(0, '#dff6ff'); g.addColorStop(1, '#8fd0ea'); ctx.fillStyle = g; ctx.fillRect(-1500, -1500, 4000, 5000);
  for (const y of [700, 1120, 1520]) { rrect(ctx, -400, y, 1900, 26, 10); fillStroke(ctx, '#f4fbff', 6); }
  for (let i = 0; i < 14; i++) { const x = (h01(i) * 1400 - 150), y = ((h01(i + 7) * 1500 + t * 40 * (1 + h01(i + 3))) % 1500) + 200; circle(ctx, x, y, 5 + h01(i + 9) * 6); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fill(); }
  drawBox(ctx, 230, 1120, .8, {}); drawBox(ctx, 860, 1120, .7, {});
  drawPot(ctx, POT1[0], POT1[1], .9, { t, steam: 1 });
  const f = exprTrack(lt, [[0, 'datar'], [.8, 'cemas'], [1.7, 'kaget'], [2.5, 'meringis']], { seed: 2 });
  propFace(ctx, POT1[0], POT1[1] - 62, 150, f, { t });
});
// ---- 2: spin keluar ke dapur, panci tetap di pivot; reaksi trio ----
const POT2 = [540, 1330];
const cam2 = lt => camLock(POT2[0], POT2[1] - 60, 540, 860, kf(lt, [[0, 1.08], [3.2, .95]]), kf(lt, [[0, -.22], [.5, 0]], easeOut));
SH(2, { tr: 'match', pivot: [540, 860], zoomOut: (() => { const c = cam2(3.2); const p = toScreen(c, POT2[0], POT2[1] - 118); return { x: p[0], y: p[1], r: 150 * c.z }; })() }, (ctx, lt, t) => {
  const cam = cam2(lt); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  simpleTable(ctx, POT2[1]);
  drawPot(ctx, POT2[0], POT2[1], .9, { t, steam: 1 });
  propFace(ctx, POT2[0], POT2[1] - 62, 150, exprTrack(lt, [[0, 'meringis'], [.45, 'kaget'], [1.85, 'lega']], { seed: 3 }), { t });
  // trio: reaksi sinkron dengan offset kecil (referensi: kaget bersama, lalu lega bersama saat bola jatuh)
  drawStick(ctx, C(IBU, { x: 170, y: POT2[1] + 230, s: 620, legs: standL, arms: idleArms(t, 2), face: exprTrack(lt, [[0, 'kaget'], [1.0, 'ngeden'], [1.8, 'lega']], { seed: 4 }) }));
  drawStick(ctx, C(BUDI, { x: 910, y: POT2[1] + 230, s: 620, flip: -1, legs: standL, arms: idleArms(t, 3), face: exprTrack(lt, [[0, 'kaget'], [1.1, 'cemas', { look: [-.8, .2] }], [1.9, 'lega']], { seed: 5 }) }));
});
// ---- 3: match cut lingkaran -> muka jam; pull-back scale reveal + grade waktu ----
const cam3 = (lt, t) => camKeys(lt, t, [[0, { x: 540, y: 700, z: 1.0 }], [1.5, { x: 600, y: 980, z: .6 }, easeOut], [3.6, { x: 610, y: 990, z: .57 }]], 1.5);
SH(3, { tr: 'dissolve', zoomIn: { x: 540, y: 960, r: 190 } }, (ctx, lt, t) => {
  const cam = cam3(lt, t); kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  drawClock(ctx, 540, 960, 1.6, { prog: ease(inv(.5, 2.8, lt)) });
  drawStick(ctx, C(BUDI, { x: 1060, y: 1330 + 30, s: 420, flip: -1, legs: standL, arms: idleArms(t, 4), face: exprTrack(lt, [[0, 'datar', { look: [-1, -.3] }], [1.4, 'curiga'], [2.4, 'sadar']], { seed: 6 }) }));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const k = inv(.5, 2.8, lt); popText(ctx, '2 JAM KEMUDIAN', 540, 330, 92, clamp(inv(.6, .9, lt)), '#fff'); ctx.restore();
  timeGrade(ctx, ease(inv(.5, 2.8, lt)), 'senja');
});
// ---- 4: gag angka (katrol 200 KG mengangkat Budi) ----
SH(4, { tr: 'whip' }, (ctx, lt, t) => {
  const p = inv(.3, 2.4, lt), drop = inv(2.85, 3.05, lt);
  const g = pulleyGag(p, 200, 70, 640); const lift = g.heroLift * (1 - easeIn(drop));
  const cam = camKeys(lt, t, [[0, { x: 540, y: 1050, z: 1 }], [2.4, { x: 560, y: 820, z: 1.05 }], [2.9, { x: 560, y: 980, z: 1.12 }, easeIn]], 2);
  applyCam(ctx, cam, 1); drawSky(ctx, '#58b8f2', '#d6f1ff', -300, 1500);
  ctx.fillStyle = '#7cc65a'; ctx.fillRect(-1500, FLOOR, 4100, 1500); line(ctx, -1500, FLOOR, 2600, FLOOR, 8);
  line(ctx, 220, FLOOR, 540, 420, 34, '#b8742f'); line(ctx, 860, FLOOR, 540, 420, 34, '#b8742f');
  circle(ctx, 540, 440, 46); fillStroke(ctx, '#7b4a22', 8); circle(ctx, 540, 440, 10); fillStroke(ctx, INK, 4);
  const boxY = FLOOR - g.loadY * (1 - drop), heroY = FLOOR - lift;
  line(ctx, 494, 440, 494, boxY - 180, 7, '#c9a36a'); line(ctx, 586, 440, 586, heroY - 560, 7, '#c9a36a');
  rrect(ctx, 380, boxY - 180, 230, 180, 16); fillStroke(ctx, '#5b6378', 8); text(ctx, '200 KG', 495, boxY - 90, 54, '#fff', INK, 8);
  groundShadow(ctx, 495, FLOOR, 260 * (1 - Math.min(1, g.loadY / 400)), .25);
  const f = exprTrack(lt, [[0, 'ngeden'], [.9, 'curiga', { look: [-.8, -.6] }], [1.5, 'sadar'], [2.05, 'kaget'], [2.95, 'meringis']], { seed: 7 });
  const hang = lift > 20 ? 1 : 0;
  drawStick(ctx, C(BUDI, { x: 640, y: heroY, s: 600, flip: -1, arms: { L: [2.75, .15], R: [2.9, .1] }, legs: hang ? { L: [.25 + Math.sin(t * 6) * .15, -.35], R: [-.05 - Math.sin(t * 6) * .15, -.25] } : standL, lean: hang ? Math.sin(t * 3) * .05 : -.06, face: f, shadow: !hang }));
  if (drop > 0) { burst(ctx, 640, FLOOR - 20, 120 * backOut(clamp(drop * 2)), 10, '#ffd23a', 6); }
  flash(ctx, lt, 3.0, .14);
});
// ---- 5: penekanan: stempel + glint + cahaya dalam ----
SH(5, {}, (ctx, lt, t) => {
  const cam = camKeys(lt, t, [[0, { x: 540, y: 980, z: 1.25 }], [.25, { x: 540, y: 960, z: 1.08 }, easeOut], [4, { x: 540, y: 960, z: 1.12 }]], 2);
  kitchenBG(ctx, t, cam); applyCam(ctx, cam, 1);
  innerGlow(ctx, 540, 560, 170, clamp(inv(.3, .6, lt)), t);
  const k = inv(.3, .55, lt); if (k > 0) drawStamp(ctx, 540, 560, (1.8 - .8 * backOut(k)), 'MITOS');
  glint(ctx, 760, 470, 120, t, .75); glint(ctx, 330, 640, 80, t, 1.0);
  glowRing(ctx, 540, 560, 330, Math.sin(clamp(inv(.6, 1.6, lt)) * Math.PI));
  drawStick(ctx, C(IBU, { x: 250, y: FLOOR, s: 620, legs: standL, arms: idleArms(t, 1), face: exprTrack(lt, [[0, 'kaget'], [.6, 'sombong']], { seed: 8 }) }));
  drawStick(ctx, C(BUDI, { x: 830, y: FLOOR, s: 620, flip: -1, legs: standL, arms: idleArms(t, 2), face: exprTrack(lt, [[0, 'kaget'], [.7, 'bangga']], { seed: 9 }) }));
});
