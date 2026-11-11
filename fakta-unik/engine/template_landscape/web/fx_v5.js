// ---------- v5: bahasa visual hasil reverse engineering referensi ----------
// Sumber teknik: reference/analisis/ref-01-pirate-cannonballs.md (prinsip saja, tidak menyalin aset).
// Dipakai di template Shorts (1080x1920) dan landscape (1920x1080). Butuh lib.js + chars.js.

const h01 = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ===== 1. EKSPRESI =====
// Preset ekspresi (nama Indonesia). Semua kunci = opsi `face` milik drawStick/drawFace.
// Mata baru: 'flinch' (> <). Mulut baru: 'wobble' (bergelombang, gugup). Aksesori: sweat (0..1).
const EXPR = {
  netral:   { eyes: 'normal', mouth: 'smile' },
  sombong:  { eyes: 'half', mouth: 'smirk', browOne: 1, look: [.45, 0] },      // smug: kelopak turun, satu alis naik, senyum miring
  licik:    { eyes: 'half', mouth: 'grin', browAng: -.3 },                       // scheming: alis turun ke dalam + nyengir lebar
  datar:    { eyes: 'half', mouth: 'flat', look: [.7, .1] },                     // deadpan: bosan, lirik samping
  kaget:    { eyes: 'wide', mouth: 'o', browUp: 1 },                             // alarm: mata bulat, pupil kecil
  takjub:   { eyes: 'wide', mouth: 'o', browUp: .6, look: [0, -.4] },            // awe: menatap objek
  lega:     { eyes: 'happy', mouth: 'smile' },                                   // relief ^ ^
  bangga:   { eyes: 'happy', mouth: 'grin', browUp: .4 },
  ngeden:   { eyes: 'normal', mouth: 'teeth', browAng: -.35 },                   // effort: gigi rapat, alis turun
  meringis: { eyes: 'flinch', mouth: 'wobble', browAng: .25 },                   // flinch > < saat ledakan/benturan
  cemas:    { eyes: 'normal', mouth: 'wobble', browAng: .3, sweat: 1, look: [.75, 0] }, // gugup + keringat + lirik
  curiga:   { eyes: 'half', mouth: 'frown', browAng: -.2, look: [-.6, -.3] },
  sadar:    { eyes: 'wide', mouth: 'flat', browUp: .5, look: [0, -.6] },          // "oh tidak": diam, mata membesar
};
// Track ekspresi DISKRET per kata (referensi: wajah 2D "ditukar" tiap ketukan, bukan di-tween).
// keys: [[waktu, 'preset' | {face}, {opsi}], ...]  -> objek face pada waktu t.
// - kedip penghubung 2 frame saat ekspresi berganti (kecuali dari/ke mata tertutup)
// - pupil "melirik" kecil selama ditahan (saccade), kedip acak tiap ~3 dtk
// - .pop (0..1) sesaat setelah ganti: pakai untuk squash kepala/aksesori kecil
function exprTrack(t, keys, o = {}) {
  let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
  const k = keys[i]; const base = typeof k[1] === 'string' ? EXPR[k[1]] : k[1];
  if (!base) throw new Error('ekspresi tidak dikenal: ' + k[1]);
  const f = Object.assign({}, base, k[2] || {}); const since = t - k[0]; const seed = o.seed || 0;
  const closed = e => e === 'happy' || e === 'flinch' || e === 'squint' || e === 'x';
  const prev = i > 0 ? (typeof keys[i - 1][1] === 'string' ? EXPR[keys[i - 1][1]] : keys[i - 1][1]) : null;
  const bridge = o.bridge == null ? 2 / FPS : o.bridge;
  if (prev && since < bridge && !closed(f.eyes) && !closed(prev.eyes)) f.blink = 1;
  if (!closed(f.eyes) && o.idleBlink !== false) {
    const per = 3.1, n = Math.floor((t + seed * 1.3) / per), s0 = n * per + h01(n + seed * 9) * 2 - seed * 1.3, d = t - s0;
    if (d > 0 && d < .12) f.blink = Math.max(f.blink || 0, Math.sin(d / .12 * Math.PI));
  }
  if (o.saccade !== false && f.eyes !== 'happy') {
    const L = f.look || [0, 0], sp = .7 + h01(seed) * .4, n = Math.floor((t + seed) / sp), fr = ((t + seed) / sp) % 1;
    const j = m => [(h01(m * 3.1 + seed) - .5) * .35, (h01(m * 5.7 + seed) - .5) * .25];
    const a = j(n - 1), b = j(n), m = clamp(fr / .1);
    f.look = [L[0] + lerp(a[0], b[0], m), L[1] + lerp(a[1], b[1], m)];
  }
  f.pop = since < .12 ? 1 - since / .12 : 0;
  if (f.sweat && since < .15) f.sweat = Math.min(f.sweat, backOut(since / .15));
  return f;
}
// Wajah pada properti (karung mesiu, kulkas, panci, bola...). width = lebar wajah dalam px.
// Ekspresi pakai preset/exprTrack yang sama dengan tokoh. fadeIn 0..1 untuk wajah yang "muncul" di benda.
function propFace(ctx, x, y, width, f, o = {}) {
  ctx.save(); ctx.translate(x, y); const s = width / .22; ctx.scale(s, s * (1 - (f.pop || 0) * .06));
  if (o.rot) ctx.rotate(o.rot);
  if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  drawFace(ctx, 0, 0, .2, f, { t: o.t || 0 }, null);
  ctx.restore();
}

// ===== 2. KAMERA (2.5D) =====
// Kamera yang MENGUNCI titik dunia (wx,wy) di posisi layar (sx,sy): objek diam di layar, dunia yang bergerak/berputar.
// Referensi: bola merah membara tetap di tempat saat kamera berayun keluar tungku ke pantai.
function camLock(wx, wy, sx, sy, z = 1, r = 0) {
  const dx = (sx - W / 2) / z, dy = (sy - H / 2) / z, c = Math.cos(r), s = Math.sin(r);
  // applyCam: layar = C + Rot(r)*z*(dunia - cam)  =>  cam = dunia - Rot(-r)*(layar - C)/z
  return { x: wx - (c * dx + s * dy), y: wy - (-s * dx + c * dy), z, r };
}
// Dolly/zoom GEOMETRIS menuju titik (terasa seperti kamera maju dengan kecepatan konstan, bukan zoom datar).
// p 0..1 (sudah di-ease), dari cam a {x,y,z,r} ke b.
function camGeo(p, a, b) {
  const z = a.z * Math.pow(b.z / a.z, p); const q = (z - a.z) / ((b.z - a.z) || 1);
  return { x: lerp(a.x, b.x, q), y: lerp(a.y, b.y, q), z, r: lerp(a.r || 0, b.r || 0, p) };
}
// Kamera dengan keyframe + handheld halus. keys: [[lt, {x,y,z,r}, easeFn?], ...]
function camKeys(lt, t, keys, shakeAmp = 2.5) {
  const v = kf(lt, keys.map(k => [k[0], [k[1].x, k[1].y, k[1].z, k[1].r || 0], k[2]]));
  const h = shake(t * .35, shakeAmp, 1, 3);
  return { x: v[0] + h[0], y: v[1] + h[1], z: v[2], r: v[3] };
}
// Lapisan parallax: gambar beberapa lapisan dengan depth berbeda dari satu kamera (orbit/truck terasa 3D).
// layers: [[depth, fn(ctx)], ...] depth <1 = jauh (bergerak lebih lambat), >1 = dekat/foreground.
function parallax(ctx, cam, layers) {
  for (const [d, fn] of layers) { ctx.save(); applyCam(ctx, cam, d); fn(ctx); ctx.restore(); }
  applyCam(ctx, cam, 1);
}

// ===== 3. EFEK PENEKANAN =====
// Kilau 4 sudut (referensi: kilatan di bola "carcass" saat namanya disebut). t0 = waktu muncul.
function glint(ctx, x, y, r, t, t0, dur = .35) {
  const k = inv(t0, t0 + dur, t); if (k <= 0 || k >= 1) return;
  const s = Math.sin(k * Math.PI) * r, rot = k * .8;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalCompositeOperation = 'lighter';
  ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? s * .16 : s; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,240,.95)'; ctx.fill();
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, s * .7); g.addColorStop(0, 'rgba(255,255,220,.8)'); g.addColorStop(1, 'rgba(255,255,220,0)');
  ctx.fillStyle = g; ctx.fillRect(-s, -s, s * 2, s * 2); ctx.restore();
}
// Cincin cahaya yang menyala di sekeliling bentuk bulat (referensi: cincin api di sekeliling tong rendaman saat kata kunci).
function glowRing(ctx, x, y, r, k, col = '255,140,40') {
  if (k <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x, y, r + i * r * .06, 0, TAU); ctx.lineWidth = r * (.1 - i * .025); ctx.strokeStyle = `rgba(${col},${(.55 - i * .15) * k})`; ctx.stroke(); }
  ctx.restore();
}
// Grade waktu: siang -> senja -> malam di atas frame (referensi: "beberapa menit kemudian" = langit berubah ungu).
// k 0..1. Panggil di akhir draw shot (koordinat layar).
function timeGrade(ctx, k, mode = 'senja') {
  if (k <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  if (mode === 'malam') { g.addColorStop(0, `rgba(20,20,80,${.55 * k})`); g.addColorStop(1, `rgba(10,10,40,${.45 * k})`); }
  else { g.addColorStop(0, `rgba(120,60,170,${.45 * k})`); g.addColorStop(.6, `rgba(255,120,80,${.22 * k})`); g.addColorStop(1, `rgba(60,30,90,${.35 * k})`); }
  ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'soft-light'; ctx.fillRect(0, 0, W, H); ctx.restore();
}
// Kilat putih (benturan/tembakan) — referensi: frame putih 1-2 sebelum ledakan.
function flash(ctx, t, t0, dur = .12, col = '255,250,235') {
  const k = inv(t0, t0 + dur, t); if (k <= 0 || k >= 1) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(${col},${(1 - k) * .9})`; ctx.fillRect(0, 0, W, H); ctx.restore();
}
// Cahaya dari dalam (benda "menyala" / transparan seperti lentera): sinar radial + glow.
function innerGlow(ctx, x, y, r, k, t, col = '255,170,60') {
  if (k <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2); g.addColorStop(0, `rgba(${col},${.7 * k})`); g.addColorStop(1, `rgba(${col},0)`);
  ctx.fillStyle = g; ctx.fillRect(x - r * 2.2, y - r * 2.2, r * 4.4, r * 4.4);
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + t * .4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a - .05) * r * 2.6, y + Math.sin(a - .05) * r * 2.6); ctx.lineTo(x + Math.cos(a + .05) * r * 2.6, y + Math.sin(a + .05) * r * 2.6); ctx.closePath(); ctx.fillStyle = `rgba(${col},${.18 * k})`; ctx.fill(); }
  ctx.restore();
}
// Bayangan kontak + oklusi di kaki properti besar (aset terasa "berdiri" di dunia 3D).
function groundShadow(ctx, x, y, w, a = .25) { ctx.save(); ellipse(ctx, x, y, w * .5, w * .09); ctx.fillStyle = `rgba(30,15,30,${a})`; ctx.fill(); ctx.restore(); }

// ===== 4. GAG ANGKA =====
// Katrol: beban berat (kg) vs tokoh. Bila beban > tokoh, tokoh yang terangkat (angka dibuktikan lewat fisika lucu).
// p 0..1 = progres tarikan. Mengembalikan {loadY, heroLift} dalam px (positif = naik).
function pulleyGag(p, loadKg, heroKg = 70, travel = 600) {
  const heavy = loadKg > heroKg;
  if (!heavy) return { loadY: p * travel, heroLift: 0 };
  const lift = sstepV5(inv(.35, 1, p)) * travel;      // setelah usaha awal sia-sia, tokoh terangkat
  return { loadY: Math.min(p, .35) * travel * .08, heroLift: lift };
}
function sstepV5(x) { x = clamp(x); return x * x * (3 - 2 * x); }
