// ---------- Long-form (16:9) toolkit: word helpers, host performance (lip sync, micro-expressions, gestures), studio set, shot builders ----------
// World space = screen space at cam z=1: 1920 x 1080. Board content is designed in a 1600 x 900 space.
const IBU = { cols: ['#ec5b86', '#ec5b86'], hat: 'chef', belt: false, blush: true };
const LAB = { cols: ['#f6f9ff', '#f6f9ff'], hat: 'none', belt: false, blush: true };
const BUDI = { cols: ['#2f9b5a', '#2f9b5a'], hat: 'tuft', hatCol: INK, belt: false };
const C = (b, e) => Object.assign({}, b, e);
const LN = {}; WORDS.forEach(w => { (LN[w.line] = LN[w.line] || []).push(w); });
const ls = i => LN[i][0].s, le = i => LN[i][LN[i].length - 1].e;
const nrm = w => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const fw = (i, str, n = 0) => { const a = LN[i].filter(w => nrm(w.w) === nrm(str)); if (!a.length) throw new Error('word not found: ' + i + ' ' + str); return a[Math.min(n, a.length - 1)].s; };
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const sstep = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const pulse = (t, t0, up = .2, hold = .5, down = .45) => sstep(inv(t0 - .05, t0 + up, t)) * (1 - sstep(inv(t0 + up + hold, t0 + up + hold + down, t)));
const standL = { L: [.1, -.04], R: [.1, -.04] };

// lip sync: MOUTH = per-frame loudness 0..1 (from the voice track)
const talkAt = t => { if (typeof MOUTH === 'undefined') return 0; const i = Math.round(t * FPS); return MOUTH[Math.max(0, Math.min(MOUTH.length - 1, i))] || 0; };
// emphasis words: numbers and long words get brow raises, nods and gestures
const EMPH = WORDS.filter((w, i) => /\d/.test(w.w) || nrm(w.w).length >= 9).map(w => w.s);
const QEND = WORDS.filter(w => /\?$/.test(w.w)).map(w => w.s);

// micro-expressions for a performer (seed makes two characters differ)
function micro(t, seed = 0, o = {}) {
  // natural irregular blinks
  let blink = 0; const per = 3.2; const k = Math.floor((t + seed * 1.7) / per);
  for (const kk of [k - 1, k]) { const s0 = kk * per + hash(kk + seed * 13) * 2.2 - seed * 1.7; const d = t - s0; if (d > 0 && d < .16) blink = Math.max(blink, Math.sin(d / .16 * Math.PI)); }
  // saccades: hold a gaze target, snap quickly to the next
  const sp = 1.15 + hash(seed) * .5, si = Math.floor((t + seed) / sp), sf = ((t + seed) / sp) % 1;
  const tgt = i => { const h = hash(i * 3.1 + seed * 7); if (o.board && h < .28) return [-.95, -.1]; if (o.lookAt && h < .5) return o.lookAt; return [(hash(i + 1.3 + seed) - .5) * .5, (hash(i + 5.7 + seed) - .5) * .3]; };
  const a = tgt(si - 1), b = tgt(si), m = sstep(sf / .12); const look = [lerp(a[0], b[0], m), lerp(a[1], b[1], m)];
  // brow raises + nods on emphasis
  let br = 0, nod = 0; for (const e of EMPH) { const d = t - e; if (d > -.05 && d < .9) { br = Math.max(br, Math.exp(-Math.max(0, d) * 3.5)); nod += Math.sin(clamp(d / .45) * Math.PI) * .045; } }
  let q = 0; for (const e of QEND) { const d = t - e; if (d > -.1 && d < 1.0) q = Math.max(q, sstep(inv(-.1, .15, d)) * (1 - sstep(inv(.6, 1.0, d)))); }
  return { blink, look, browUp: br * .9 + q * .6, browOne: q > .4 ? 1 : 0, nod, tilt: Math.sin(t * .9 + seed) * .025 + q * .08 };
}

// gestures blended on top of relaxed arms. side conventions: L = screen-left arm for an unflipped figure.
// [upper-arm angle, elbow bend]; forearm absolute angle = upper + bend (0 = hanging, + = outward/up)
const GEST = {
  open: { L: [.6, 1.0], R: [.6, 1.0] },
  palm: { R: [.45, 1.05] },
  palmL: { L: [.45, 1.05] },
  count: { R: [.5, 2.3] },
  raise: { R: [2.3, .35] },
  point: { L: [1.6, .12] },
  shrug: { L: [.45, 1.45], R: [.45, 1.45] },
  chest: { L: [.35, -2.3], R: [.35, -2.3] },
  wave: { R: [2.5, .35] },
};
// smoothed loudness (for beat gestures)
const talkS = t => { let a = 0; for (let k = -3; k <= 3; k++) a += talkAt(t + k / FPS); return a / 7; };
// relaxed presenter pose: elbows bent, hands in front, small beats with the voice
function presenterArms(t, seed = 0, talking = true) {
  const b = talking ? talkS(t) : 0, w1 = Math.sin(t * 1.3 + seed) * .05, w2 = Math.sin(t * 1.1 + seed + 2) * .05;
  return { L: [.26 + w1 + b * .08, -1.42 + b * .35], R: [.26 + w2 + b * .1, -1.42 + b * .4] };
}
function gesturePlan(t0, t1, seed = 0, o = {}) {
  const ev = []; let last = t0 - 9;
  const pool = o.board ? ['point', 'palm', 'open', 'count', 'palmL', 'point', 'chest'] : ['palm', 'open', 'count', 'palmL', 'chest', 'palm'];
  WORDS.forEach((w, i) => {
    if (w.s < t0 + .15 || w.s > t1 - .5 || w.s - last < (o.gap || .85)) return;
    const strong = /\d/.test(w.w) || nrm(w.w).length >= 7 || /[.,]$/.test((WORDS[i - 1] || {}).w || '');
    if (!strong) return;
    const g = /\d/.test(w.w) ? (hash(i) < .5 ? 'count' : 'raise') : pool[Math.floor(hash(i * 3.7 + seed) * pool.length)];
    ev.push({ t: w.s, g }); last = w.s;
  });
  QEND.filter(e => e >= t0 && e <= t1).forEach(e => ev.push({ t: e - .15, g: 'shrug' }));
  if (o.extra) o.extra.forEach(e => ev.push(e));
  return ev;
}
function armsAt(t, plan, seed = 0, base) {
  const idle = base || idleArms(t, seed);
  const out = { L: idle.L.slice(), R: idle.R.slice() };
  for (const e of plan) {
    const w = pulse(t, e.t, .2, .45, .45); if (w <= 0) continue; const g = GEST[e.g];
    for (const k of ['L', 'R']) if (g[k]) { const os = Math.sin(clamp((t - e.t) / .5) * Math.PI) * .08; out[k] = [lerp(out[k][0], g[k][0] + os, w), lerp(out[k][1], g[k][1], w)]; }
  }
  return out;
}
function talkFace(t, seed, o = {}) {
  const m = micro(t, seed, o); const tk = o.mute ? 0 : talkAt(t);
  return { face: { eyes: o.eyes || 'normal', look: m.look, blink: m.blink, browUp: m.browUp, browOne: m.browOne, mouth: o.mouth || 'smile', talk: tk, browAng: o.browAng || 0, turn: o.turn || 0 }, headTilt: m.tilt + m.nod + (o.tiltAdd || 0) };
}

// ---------- studio set ----------
const BOARD = { x: 110, y: 120, w: 960, h: 540 };
function studioBG(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .25);
  const g = ctx.createLinearGradient(0, -400, 0, 900); g.addColorStop(0, o.wall1 || '#ffe2a8'); g.addColorStop(1, o.wall2 || '#ffc77a');
  ctx.fillStyle = g; ctx.fillRect(-2000, -2000, 6000, 2900);
  ctx.fillStyle = 'rgba(255,255,255,.18)'; for (let y = -200; y < 880; y += 110) for (let x = -400 + ((y / 110) % 2) * 55; x < 2400; x += 110) { circle(ctx, x, y, 6); ctx.fill(); }
  applyCam(ctx, cam, .5);
  // shelf with books + plant (right)
  rrect(ctx, 1260, 250, 520, 26, 8); fillStroke(ctx, '#b4693a', 6);
  [['#ff8a5b', 60, 120], ['#6aa8f0', 46, 140], ['#ffd34e', 52, 110], ['#8bd1c4', 40, 130]].forEach(([c, w, h], i) => { const x = 1290 + i * 66; rrect(ctx, x, 250 - h, w, h, 8); fillStroke(ctx, c, 5); });
  rrect(ctx, 1600, 170, 90, 80, 14); fillStroke(ctx, '#e07a4a', 6);
  for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(1645, 172); ctx.rotate(-.9 + i * .45 + Math.sin(t * .8 + i) * .04); ellipse(ctx, 0, -60, 22, 60); fillStroke(ctx, '#4caf50', 5); ctx.restore(); }
  // channel sign
  rrect(ctx, 1290, 22, 440, 86, 43); fillStroke(ctx, '#e5262a', 7); text(ctx, 'MITOS RUMAHAN', 1510, 67, 42, '#fff', INK, 0);
  applyCam(ctx, cam, 1);
  // floor
  const fy = o.floor || 860;
  const fg = ctx.createLinearGradient(0, fy, 0, 1500); fg.addColorStop(0, '#c98a4e'); fg.addColorStop(1, '#a8682f'); ctx.fillStyle = fg; ctx.fillRect(-2000, fy, 6000, 1500);
  ctx.strokeStyle = 'rgba(90,45,15,.35)'; ctx.lineWidth = 4; for (let i = -10; i < 30; i++) { const x = i * 140; ctx.beginPath(); ctx.moveTo(960 + (x - 960) * .55, fy); ctx.lineTo(x, 1500); ctx.stroke(); }
  ctx.fillStyle = 'rgba(60,30,10,.25)'; ctx.fillRect(-2000, fy, 6000, 12);
  rrect(ctx, -2000, fy - 34, 6000, 34, 0); fillStroke(ctx, '#f3e3c3', 5);
}
// board / TV on the wall with content drawn in 1600x900 design space
function drawBoard(ctx, t, content, o = {}) {
  const b = BOARD;
  rrect(ctx, b.x - 22, b.y - 22, b.w + 44, b.h + 44, 30); fillStroke(ctx, '#2b2f45', 10);
  ctx.save(); rrect(ctx, b.x, b.y, b.w, b.h, 14); ctx.clip();
  ctx.fillStyle = o.bg || '#16244f'; ctx.fillRect(b.x, b.y, b.w, b.h);
  ctx.translate(b.x, b.y); ctx.scale(b.w / 1600, b.h / 900);
  if (content) content(ctx, t);
  ctx.restore();
  ctx.save(); rrect(ctx, b.x, b.y, b.w, b.h, 14); ctx.clip(); ctx.globalAlpha = .08; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x + b.w * .45, b.y); ctx.lineTo(b.x + b.w * .2, b.y + b.h); ctx.lineTo(b.x, b.y + b.h); ctx.fill(); ctx.restore();
  rrect(ctx, b.x + b.w / 2 - 60, b.y + b.h + 22, 120, 60, 10); fillStroke(ctx, '#2b2f45', 6);
}
// full-screen content
function drawFull(ctx, t, content, o = {}) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, o.c1 || '#1d2c63'); g.addColorStop(1, o.c2 || '#101839'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 26; i++) { circle(ctx, (i * 397) % 2000, (i * 211) % 1100, 16 + (i % 4) * 14); ctx.fill(); }
  const z = 1 + (o.zoom || 0);
  ctx.translate(W / 2, H / 2); ctx.scale(1.1 * z, 1.1 * z); ctx.translate(-800, -450 - 55);
  if (content) content(ctx, t);
}

// ---------- shot builders ----------
const HOST_X = 1450, HOST_Y = 1010, HOST_S = 640, IBU_X = 1020;
const FRAMES = {
  wide: { x: 960, y: 540, z: 1 },
  med: { x: HOST_X - 30, y: 610, z: 1.9 },
  close: { x: HOST_X, y: 520, z: 2.9 },
  low: { x: HOST_X - 80, y: 680, z: 1.65, r: -.035 },
  side: { x: 1180, y: 560, z: 1.32 },
  two: { x: 1240, y: 640, z: 1.55 },
  react: { x: IBU_X, y: 545, z: 2.7 },
  board: { x: BOARD.x + BOARD.w / 2, y: BOARD.y + BOARD.h / 2 + 10, z: 1.75 },
};
// host shot. o: {frame, content, ibu, ibuFace, push, mood}
function HOST(o = {}) {
  return (ctx, lt, t, sh) => {
    const F = FRAMES[o.frame || 'wide'];
    const hh = shake(t * .35, 2.5, 1, 2);
    const push = o.push == null ? .03 : o.push;
    const cam = { x: F.x + hh[0] + (o.dx || 0) * lt, y: F.y + hh[1], z: F.z * (1 + push * lt), r: (F.r || 0) + Math.sin(t * .5) * .003 };
    studioBG(ctx, t, cam, o);
    applyCam(ctx, cam, 1);
    if (o.content !== false) drawBoard(ctx, t, o.content, o);
    const showIbu = o.ibu || o.frame === 'two' || o.frame === 'react';
    if (showIbu) {
      const ib = talkFace(t, 2.3, { mute: true, lookAt: [1, 0], mouth: o.ibuMouth || 'smile', eyes: o.ibuEyes || 'normal' });
      const plan = o.ibuGest ? [{ t: sh.start + .3, g: o.ibuGest }] : [];
      drawStick(ctx, C(IBU, { x: IBU_X, y: HOST_Y, s: HOST_S * .94, bob: Math.sin(t * 2.1) * .003, headTilt: ib.headTilt, legs: standL, arms: armsAt(t, plan, 2.3, presenterArms(t, 2.3, false)), face: Object.assign(ib.face, o.ibuFace || {}) }));
    }
    const plan = gesturePlan(sh.start, sh.end, o.seed || 0, { board: o.content !== false && o.frame !== 'two', extra: o.gest });
    const tf = talkFace(t, 0, { board: o.content !== false, mouth: o.mouth, eyes: o.eyes, turn: o.frame === 'side' ? -.35 : 0, lookAt: showIbu ? [-1, 0] : null });
    drawStick(ctx, C(BUDI, { x: HOST_X, y: HOST_Y, s: HOST_S, bob: Math.sin(t * 2.4) * .003 + talkS(t) * .004, lean: Math.sin(t * .7) * .015 + Math.sin(t * .23) * .01, headTilt: tf.headTilt, legs: standL, arms: armsAt(t, plan, 0, presenterArms(t, 0, true)), face: tf.face }));
    if (o.after) { applyCam(ctx, cam, 1); o.after(ctx, lt, t); }
  };
}
function GFX(content, o = {}) { return (ctx, lt, t) => { drawFull(ctx, t, content, { c1: o.c1, c2: o.c2, zoom: (o.push == null ? .03 : o.push) * lt }); }; }
// chapter title card
function TITLE(num, title, icon, o = {}) {
  return (ctx, lt, t) => {
    drawFull(ctx, t, null, { c1: o.c1 || '#ff8a3d', c2: o.c2 || '#e5262a' });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const k = backOut(inv(.05, .5, lt));
    ctx.save(); ctx.translate(W / 2, H / 2 - 40); ctx.scale(k, k);
    if (icon) { ctx.save(); ctx.translate(0, -170); icon(ctx, t); ctx.restore(); }
    text(ctx, 'BAGIAN ' + num, 0, 40, 60, '#ffe14d', INK, 12); text(ctx, title, 0, 140, 130, '#fff', INK, 18);
    ctx.restore();
  };
}
// build shots from a list: [startTime, transition, drawFn]
function buildShots(list, endT) {
  list.forEach((it, i) => {
    const sh = { start: it[0], end: i + 1 < list.length ? list[i + 1][0] : endT, tr: it[1] };
    sh.draw = (ctx, lt, t) => it[2](ctx, lt, t, sh);
    SHOTS.push(sh);
  });
}
// common text helpers in design space
function label(ctx, str, x, y, size, k, fill = '#fff', rot = 0) { popText(ctx, str, x, y, size, k, fill, INK, rot); }
const at = (tt, d = .35) => inv(tt, tt + d, CURT());
let __t = 0; const CURT = () => __t; // content uses global time via setT
