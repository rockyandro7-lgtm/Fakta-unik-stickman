// ---------- PREVIEW: Palagan Ambarawa, shot 0 (hook) ----------
// Gaya peta = episode Blitzkrieg (env_peta.js). Timing kata masih PERKIRAAN (belum ada suara + Scribe); hanya untuk cek frame.
const SHOTS = [];
const C = (b, e) => Object.assign({}, b, e);
const SH = (s, e, o, draw) => SHOTS.push(Object.assign({ start: s, end: e, draw }, o));
const CK = (t, keys, sh = 2) => camKeys(t, t, keys, sh);
const EF = (t, keys, seed) => exprTrack(t, keys, { seed, saccade: false, idleBlink: false });

const SOE = [210, 1770], SOE_S = 760;                       // Soedirman (depan, kiri bawah)
const A0 = TJ.ambarawa;
const SKT = [[-75, -15], [0, -55], [75, -15], [-38, 45], [38, 45]];   // token Sekutu di Ambarawa
const CAP_L = [[150, 1330], [160, 1060], [260, 850], [400, 865]];
const CAP_R = [[960, 1330], [940, 1060], [830, 850], [690, 875]];
const CAP_C = [[540, 1340], [540, 1210], [540, 1060]];
const T_KAGET = .45;

SH(0, 3, {}, (ctx, lt, t) => {
  const cam = CK(t, [[0, { x: 540, y: 990, z: 1.3 }], [3, { x: 540, y: 975, z: 1.38 }]]);
  petaAmbarawa(ctx, t, cam);
  // supit urang: dua sayap menjepit + satu menekan dari depan (sudah setengah jalan di frame 0)
  const k = lerp(.45, 1, easeOut(inv(0, .7, t)));
  drawArrow(ctx, CAP_L, k, { col: MPC.red, w: 56, t });
  drawArrow(ctx, CAP_R, k, { col: MPC.red, w: 56, t });
  drawArrow(ctx, CAP_C, lerp(.25, 1, easeOut(inv(.15, .8, t))), { col: MPC.red, w: 48, t });
  // Sekutu (helm Brodie): sombong, lalu kaget saat terjepit
  SKT.forEach(([dx, dy], i) => {
    const j = t > T_KAGET ? Math.max(0, 1 - (t - T_KAGET) * 4) * -18 : 0;
    mapSoldier(ctx, A0[0] + dx * 1.1, A0[1] + dy * 1.1 + j, 170, 'uk', EF(t, [[0, 'sombong', { look: [-.6, 0] }], [T_KAGET + i * .03, 'kaget', { look: [-.8, .3], sweat: 1 }]], 20 + i), { t });
  });
  // Soedirman di depan (lapisan layar, tidak ikut zoom peta), menunjuk ke Ambarawa
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const fd = exprTrack(t, [[0, { eyes: 'normal', mouth: 'smirk', browAng: -.22, look: [.7, -.4] }]], { seed: 7, saccade: false });
  drawStick(ctx, C(SOEDIRMAN, { x: SOE[0], y: SOE[1], s: SOE_S, armLen: 1.3, legs: { L: [.12, -.05], R: [.14, -.06] },
    arms: { L: POSE.hips.arms.L, R: reach(SOE[0], SOE[1], SOE_S, 1, 470, 900, 1) }, face: fd }));
  tagKuning(ctx, '29 TAHUN', 330, 960, 66, -.1, backOut(clamp(t / .25)));
  flash(ctx, t, T_KAGET, .1);
});
