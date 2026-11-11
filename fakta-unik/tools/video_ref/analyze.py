#!/usr/bin/env python3
"""Analisis video referensi frame per frame (reverse engineering teknik, bukan menyalin aset).

Keluaran di <outdir>:
  frames.csv      metrik per frame: cut, gerak kamera global (tx, ty, zoom, rot), parallax, gerak lokal, caption
  shots.json/.md  segmentasi shot + klasifikasi gerak kamera + kurva kecepatan
  audio.csv       envelope keras-pelan + onset (hentakan SFX/musik)
  captions.csv    waktu setiap caption berganti (= waktu kata, tanpa transkripsi)
  overview.jpg    satu frame per shot
  timeline.png    grafik zoom/pan/gerak lokal/audio dengan penanda cut, caption, onset
  sheets/         contact sheet per shot (frame bernomor + timestamp)

Pemakaian:
  python3 -I analyze.py VIDEO OUTDIR [--preset shorts-iphone|none] [--fps 30]
  python3 -I analyze.py VIDEO OUTDIR --dense T0 T1 --box x,y,w,h   # crop resolusi penuh untuk mikro ekspresi
      (box dalam pecahan frame view, 0..1; semua frame sumber di rentang itu, dibuat lembar bernomor)

Butuh: ffmpeg, numpy, opencv-python-headless.
"""
import argparse, csv, json, math, os, subprocess, sys
import numpy as np
import cv2

# Tata letak UI per jenis rekaman layar. Semua dalam pecahan frame sumber (x0, y0, x1, y1).
PRESETS = {
    # Rekaman layar iPhone dari YouTube Shorts (status bar, ikon kanan, nama channel, kolom komentar)
    'shorts-iphone': {
        'view': (0.0, 0.105, 1.0, 0.855),          # area gambar yang dipakai untuk lembar kontak
        'motion': (0.02, 0.12, 0.85, 0.82),        # area untuk estimasi gerak kamera (tanpa ikon kanan/bawah)
        'holes': [(0.10, 0.60, 0.90, 0.69)],       # dikecualikan dari estimasi gerak (pita caption)
        'caption': (0.15, 0.612, 0.85, 0.675),     # pita caption terbakar (burned-in)
    },
    'none': {'view': (0, 0, 1, 1), 'motion': (0, 0, 1, 1), 'holes': [], 'caption': None},
}


def probe(path):
    out = subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                                   'stream=width,height,r_frame_rate:format=duration', '-of', 'json', path])
    j = json.loads(out); s = j['streams'][0]; n, d = s['r_frame_rate'].split('/')
    return s['width'], s['height'], float(n) / float(d), float(j['format']['duration'])


def read_frames(path, width, fps, crop=None, t0=None, t1=None):
    """Decode lewat ffmpeg (aman untuk HEVC .mov). crop = (x, y, w, h) piksel sumber."""
    W0, H0, _, _ = probe(path)
    vf = []
    if crop:
        x, y, w, h = crop; vf.append(f'crop={w}:{h}:{x}:{y}'); W0, H0 = w, h
    if fps: vf.append(f'fps={fps}')
    if width and width != W0:
        h = int(round(H0 * width / W0 / 2) * 2); vf.append(f'scale={width}:{h}:flags=area'); W0, H0 = width, h
    cmd = ['ffmpeg', '-v', 'error']
    if t0 is not None: cmd += ['-ss', str(t0)]
    cmd += ['-i', path]
    if t1 is not None: cmd += ['-t', str(t1 - (t0 or 0))]
    cmd += ['-vf', ','.join(vf) if vf else 'null', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-']
    raw = subprocess.check_output(cmd)
    n = len(raw) // (W0 * H0 * 3)
    return np.frombuffer(raw[:n * W0 * H0 * 3], np.uint8).reshape(n, H0, W0, 3)


def frac_box(box, w, h):
    x0, y0, x1, y1 = box
    return int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)


# ---------------- gerak kamera ----------------
def global_motion(prev, cur, mask):
    """Estimasi transformasi kamera antar frame: translasi, skala (zoom/dolly), rotasi.
    parallax = sisa error model similarity pada titik inlier (tinggi = kedalaman 3D nyata/dolly, bukan zoom 2D).
    local = gerak titik yang tidak ikut kamera (aksi karakter/objek)."""
    p0 = cv2.goodFeaturesToTrack(prev, 400, 0.01, 6, mask=mask)
    if p0 is None or len(p0) < 12:
        return None
    p1, st, _ = cv2.calcOpticalFlowPyrLK(prev, cur, p0, None, winSize=(21, 21), maxLevel=3)
    ok = st.ravel() == 1
    a, b = p0[ok].reshape(-1, 2), p1[ok].reshape(-1, 2)
    if len(a) < 12:
        return None
    M, inl = cv2.estimateAffinePartial2D(a, b, method=cv2.RANSAC, ransacReprojThreshold=1.5, maxIters=2000)
    if M is None:
        return None
    inl = inl.ravel().astype(bool)
    sc = math.hypot(M[0, 0], M[1, 0]); rot = math.degrees(math.atan2(M[1, 0], M[0, 0]))
    pred = a @ M[:, :2].T + M[:, 2]
    err = np.linalg.norm(pred - b, axis=1)
    # homografi menangkap perspektif bidang; sisa setelah homografi = parallax antar kedalaman
    Hm, _ = cv2.findHomography(a, b, cv2.RANSAC, 2.0)
    par = float(np.median(np.linalg.norm(cv2.perspectiveTransform(a[None], Hm)[0] - b, axis=1))) if Hm is not None else 0.0
    persp = float(np.median(err[inl])) if inl.any() else 0.0
    local = float(np.mean(err[~inl] > 3)) if (~inl).any() else 0.0
    return dict(tx=float(M[0, 2]), ty=float(M[1, 2]), zoom=sc, rot=rot, inl=float(inl.mean()),
                persp=persp, parallax=par, local=local, n=len(a))


def hist_diff(a, b):
    ha = cv2.calcHist([cv2.cvtColor(a, cv2.COLOR_BGR2HSV)], [0, 1], None, [32, 16], [0, 180, 0, 256])
    hb = cv2.calcHist([cv2.cvtColor(b, cv2.COLOR_BGR2HSV)], [0, 1], None, [32, 16], [0, 180, 0, 256])
    cv2.normalize(ha, ha); cv2.normalize(hb, hb)
    return 1 - cv2.compareHist(ha, hb, cv2.HISTCMP_CORREL)


def caption_mask(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    return ((hsv[..., 2] > 225) & (hsv[..., 1] < 40)).astype(np.uint8)


# ---------------- audio ----------------
def audio_analysis(path, sr=22050):
    try:
        raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', path, '-vn', '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'])
    except subprocess.CalledProcessError:
        return [], []
    x = np.frombuffer(raw, np.float32)
    if len(x) < 2048: return [], []
    hop, n = 256, 1024
    frames = np.lib.stride_tricks.sliding_window_view(x, n)[::hop] * np.hanning(n)
    spec = np.abs(np.fft.rfft(frames, axis=1))
    rms = np.sqrt(np.mean(frames ** 2, axis=1)); db = 20 * np.log10(rms + 1e-6)
    flux = np.maximum(np.diff(np.log1p(spec), axis=0), 0).sum(1); flux = np.r_[0, flux]
    flux = (flux - np.median(flux)) / (np.std(flux) + 1e-9)
    # pisahkan pita bawah (kick/boom) dan atas (whoosh/klik) untuk menebak jenis SFX
    f = np.fft.rfftfreq(n, 1 / sr)
    low = spec[:, f < 200].sum(1); high = spec[:, f > 4000].sum(1); tot = spec.sum(1) + 1e-9
    t = np.arange(len(flux)) * hop / sr
    env = [(round(float(t[i]), 3), round(float(db[i]), 1), round(float(low[i] / tot[i]), 3), round(float(high[i] / tot[i]), 3))
           for i in range(0, len(t), 4)]
    onsets, last = [], -1
    thr = 2.2
    for i in range(1, len(flux) - 1):
        if flux[i] > thr and flux[i] >= flux[i - 1] and flux[i] >= flux[i + 1] and t[i] - last > .09:
            kind = 'low' if low[i] / tot[i] > .35 else ('high' if high[i] / tot[i] > .25 else 'mid')
            onsets.append((round(float(t[i]), 3), round(float(flux[i]), 2), kind)); last = t[i]
    return env, onsets


# ---------------- gambar ----------------
def label(img, txt, scale=.5):
    cv2.rectangle(img, (0, 0), (int(len(txt) * 10 * scale / .5) + 8, int(22 * scale / .5)), (0, 0, 0), -1)
    cv2.putText(img, txt, (4, int(16 * scale / .5)), cv2.FONT_HERSHEY_SIMPLEX, scale, (255, 255, 255), 1, cv2.LINE_AA)
    return img


def tile(imgs, cols, pad=4, bg=(30, 30, 30)):
    h, w = imgs[0].shape[:2]; rows = math.ceil(len(imgs) / cols)
    sheet = np.full((rows * (h + pad) + pad, cols * (w + pad) + pad, 3), bg, np.uint8)
    for i, im in enumerate(imgs):
        r, c = divmod(i, cols); sheet[pad + r * (h + pad):pad + r * (h + pad) + h, pad + c * (w + pad):pad + c * (w + pad) + w] = im
    return sheet


def classify(s):
    """Label gerak kamera dari kumulatif per shot (dalam satuan lebar frame)."""
    tags = []
    z = s['zoom_total']; px, py = s['pan_x'], s['pan_y']
    if z > 1.06: tags.append(f"push-in x{z:.2f}")
    elif z < 0.94: tags.append(f"pull-out x{z:.2f}")
    if abs(px) > .08: tags.append(('pan/truck kiri' if px > 0 else 'pan/truck kanan') + f" {abs(px):.2f}W")
    if abs(py) > .08: tags.append(('tilt/crane atas' if py > 0 else 'tilt/crane bawah') + f" {abs(py):.2f}H")
    if abs(s['roll']) > 2: tags.append(f"roll {s['roll']:+.1f} deg")
    if s['shake'] > .004: tags.append('handheld/shake')
    if s['parallax'] > .6: tags.append('parallax 3D (dolly/orbit, bukan zoom datar)')
    if not tags: tags.append('statis/locked')
    return ', '.join(tags)


def speed_profile(v):
    """Bentuk kurva kecepatan: ease-in, ease-out, ease-in-out, linear, atau punch (lonjakan cepat lalu settle)."""
    v = np.abs(np.asarray(v, float))
    if len(v) < 6 or v.max() < 1e-4: return '-'
    v = np.convolve(v, np.ones(3) / 3, 'same'); n = len(v); k = max(1, n // 4)
    a, m, b = v[:k].mean(), v[n // 2 - k // 2:n // 2 + k // 2 + 1].mean(), v[-k:].mean()
    pk = int(np.argmax(v)) / n
    if pk < .25 and v.max() > 2.5 * b: return f'punch/ease-out (puncak di {pk:.0%})'
    if pk > .75 and v.max() > 2.5 * a: return f'ease-in/akselerasi (puncak di {pk:.0%})'
    if m > 1.4 * a and m > 1.4 * b: return 'ease-in-out'
    return 'linear/konstan'


def run(args):
    W0, H0, sfps, dur = probe(args.video)
    P = PRESETS[args.preset]
    os.makedirs(args.out, exist_ok=True); os.makedirs(os.path.join(args.out, 'sheets'), exist_ok=True)
    vx0, vy0, vx1, vy1 = frac_box(P['view'], W0, H0)
    vx0 -= vx0 % 2; vy0 -= vy0 % 2; vw = (vx1 - vx0) // 2 * 2; vh = (vy1 - vy0) // 2 * 2
    fr = read_frames(args.video, args.width, args.fps, crop=(vx0, vy0, vw, vh))
    n, h, w = fr.shape[:3]
    print(f'{args.video}: {W0}x{H0} @{sfps:.0f}fps {dur:.2f}s -> {n} frame analisis {w}x{h} @{args.fps}fps')
    # koordinat preset dipetakan ke frame view
    def to_view(box):
        x0, y0, x1, y1 = box
        f = lambda X, Y: (int((X * W0 - vx0) / vw * w), int((Y * H0 - vy0) / vh * h))
        a, b = f(x0, y0), f(x1, y1)
        return max(0, a[0]), max(0, a[1]), min(w, b[0]), min(h, b[1])
    mask = np.zeros((h, w), np.uint8); mx0, my0, mx1, my1 = to_view(P['motion']); mask[my0:my1, mx0:mx1] = 255
    for hb in P['holes']:
        a0, b0, a1, b1 = to_view(hb); mask[b0:b1, a0:a1] = 0
    cap = to_view(P['caption']) if P['caption'] else None

    gray = [cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) for f in fr]
    rows = []; prev_cap = None
    for i in range(n):
        r = dict(f=i, t=round(i / args.fps, 3), cut=0.0, tx=0, ty=0, zoom=1, rot=0, inl=0, persp=0, parallax=0, local=0,
                 luma=round(float(gray[i].mean()), 1), sat=round(float(cv2.cvtColor(fr[i], cv2.COLOR_BGR2HSV)[..., 1].mean()), 1), cap=0.0)
        if i:
            r['cut'] = round(float(hist_diff(fr[i - 1], fr[i])), 4)
            g = global_motion(gray[i - 1], gray[i], mask)
            if g: r.update({k: (round(v, 5) if isinstance(v, float) else v) for k, v in g.items()})
        if cap:
            cm = caption_mask(fr[i][cap[1]:cap[3], cap[0]:cap[2]])
            if prev_cap is not None:
                u = np.logical_or(cm, prev_cap).sum(); r['cap'] = round(float(np.logical_xor(cm, prev_cap).sum() / max(u, 1)), 3)
            prev_cap = cm
        rows.append(r)

    # --- validitas estimasi kamera: saat whip/terbang, tracking gagal -> jangan ikut dijumlah ---
    for r in rows:
        r['speed'] = round(math.hypot(r['tx'] / w, r['ty'] / h) + abs(math.log(max(r['zoom'], 1e-3))) + abs(r['rot']) / 45, 4)
        r['valid'] = int(r['f'] > 0 and r['inl'] >= .3 and r['parallax'] < 6 and r['speed'] < .12)
    # --- pergantian adegan: (a) hard cut frame-ke-frame, (b) transisi kamera kontinu
    #     (adegan di i-K vs i+K beda jauh, walau tiap frame berubah sedikit: fly-through, swing, dive/match) ---
    K = max(3, int(round(args.fps * .2)))
    cd = np.array([r['cut'] for r in rows])
    far = np.zeros(n)
    for i in range(K, n - K): far[i] = hist_diff(fr[i - K], fr[i + K])
    for r, v in zip(rows, far): r['scene'] = round(float(v), 4)
    cuts, trans = [0], []
    i = 1
    while i < n:
        hard = cd[i] > .3 and cd[i] == cd[max(1, i - 3):i + 4].max() and np.median(cd[max(1, i - 6):i]) < .1
        soft = far[i] > .35 and far[i] == far[max(0, i - K):i + K + 1].max()
        if (hard or soft) and i - cuts[-1] >= 6:
            # rentang transisi: frame di sekitar i yang kamera-nya cepat/tidak valid atau scene-score tinggi
            a = i
            while a > cuts[-1] + 1 and (far[a - 1] > .15 or not rows[a - 1]['valid']) and i - a < args.fps: a -= 1
            b = i
            while b < n - 1 and (far[b + 1] > .15 or not rows[b + 1]['valid']) and b - i < args.fps: b += 1
            seg = rows[a:b + 1]
            mx = max(seg, key=lambda r: r['speed'])
            zc = float(np.prod([min(max(r['zoom'], .8), 1.25) for r in seg]))
            if hard and b - a <= 2: kind = 'hard cut'
            elif zc > 1.25: kind = 'fly-through / push menembus (dolly-in melewati bukaan)'
            elif zc < .8: kind = 'pull-out reveal'
            elif abs(mx['tx']) / w > .08 or abs(mx['rot']) > 3: kind = 'swing/whip (kamera berayun, sering terkunci ke objek)'
            elif abs(mx['ty']) / h > .06: kind = 'tilt/crane whip (vertikal)'
            else: kind = 'morph/match (bentuk sama -> adegan baru) atau dissolve'
            trans.append(dict(f=i, t=round(i / args.fps, 3), t0=round(a / args.fps, 3), t1=round(b / args.fps, 3),
                              dur=round((b - a + 1) / args.fps, 3), kind=kind, peak_speed=round(mx['speed'], 3),
                              peak_rot=round(mx['rot'], 2), zoom=round(zc, 2)))
            cuts.append(i); i += 6; continue
        i += 1
    for c in cuts[1:]: rows[c]['is_cut'] = 1
    # --- caption change events ---
    capev, last = [], -9
    for r in rows:
        if r['cap'] > .5 and r['t'] - last > .12: capev.append(r['t']); last = r['t']

    # --- per shot ---
    shots = []
    bounds = cuts + [n]
    for k in range(len(cuts)):
        a, b = bounds[k], bounds[k + 1]
        seg = [r for r in rows[a + 1:b] if r['valid']]  # hanya transformasi yang terpercaya
        z = float(np.prod([s['zoom'] for s in seg])) if seg else 1
        px = float(sum(s['tx'] for s in seg) / w) if seg else 0; py = float(sum(s['ty'] for s in seg) / h) if seg else 0
        roll = float(sum(s['rot'] for s in seg)) if seg else 0
        tx = np.array([s['tx'] for s in seg]) / w if seg else np.zeros(1)
        shake = float(np.std(tx - np.convolve(tx, np.ones(5) / 5, 'same'))) if len(tx) > 6 else 0
        spd = [math.hypot(s['tx'] / w, s['ty'] / h) + abs(math.log(max(s['zoom'], 1e-3))) for s in seg]
        sh = dict(i=k, f0=a, f1=b - 1, t0=round(a / args.fps, 2), t1=round(b / args.fps, 2), dur=round((b - a) / args.fps, 2),
                  zoom_total=round(z, 3), pan_x=round(px, 3), pan_y=round(py, 3), roll=round(roll, 2), shake=round(shake, 4),
                  parallax=round(float(np.median([s['parallax'] for s in seg])) if seg else 0, 2),
                  local=round(float(np.mean([s['local'] for s in seg])) if seg else 0, 3),
                  luma=round(float(np.mean([s['luma'] for s in rows[a:b]])), 1), sat=round(float(np.mean([s['sat'] for s in rows[a:b]])), 1),
                  captions=[c for c in capev if a / args.fps <= c < b / args.fps])
        sh['camera'] = classify(sh); sh['speed'] = speed_profile(spd)
        sh['valid_frac'] = round(len(seg) / max(1, b - a - 1), 2)
        sh['enter'] = next((tr['kind'] for tr in trans if tr['f'] == a), 'awal video')
        # palet dominan (k-means 4 warna)
        px_ = fr[(a + b) // 2].reshape(-1, 3)[::7].astype(np.float32)
        _, lab, cen = cv2.kmeans(px_, 4, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1), 2, cv2.KMEANS_PP_CENTERS)
        cnt = np.bincount(lab.ravel(), minlength=4); order = np.argsort(-cnt)
        sh['palette'] = ['#%02x%02x%02x' % tuple(int(c) for c in cen[j][::-1]) for j in order]
        shots.append(sh)

    env, onsets = audio_analysis(args.video)
    for sh in shots:
        sh['onsets'] = [o for o in onsets if sh['t0'] <= o[0] < sh['t1']]
    # selisih cut terhadap onset/caption terdekat (cut di-snap ke kata atau ke hentakan?)
    for sh in shots[1:]:
        t = sh['t0']
        sh['cut_vs_caption'] = round(min((c - t for c in capev), key=abs), 3) if capev else None
        sh['cut_vs_onset'] = round(min((o[0] - t for o in onsets), key=abs), 3) if onsets else None

    # ---- tulis ----
    for tr in trans:
        tr['vs_caption'] = round(min((c - tr['t'] for c in capev), key=abs), 3) if capev else None
        tr['vs_onset'] = round(min((o[0] - tr['t'] for o in onsets), key=abs), 3) if onsets else None
    keys = ['f', 't', 'cut', 'scene', 'tx', 'ty', 'zoom', 'rot', 'speed', 'valid', 'inl', 'persp', 'parallax', 'local', 'luma', 'sat', 'cap']
    with open(os.path.join(args.out, 'frames.csv'), 'w', newline='') as fh:
        wr = csv.writer(fh); wr.writerow(keys); [wr.writerow([r.get(k) for k in keys]) for r in rows]
    with open(os.path.join(args.out, 'audio.csv'), 'w', newline='') as fh:
        wr = csv.writer(fh); wr.writerow(['t', 'db', 'low_ratio', 'high_ratio']); wr.writerows(env)
    with open(os.path.join(args.out, 'onsets.csv'), 'w', newline='') as fh:
        wr = csv.writer(fh); wr.writerow(['t', 'strength', 'band']); wr.writerows(onsets)
    with open(os.path.join(args.out, 'captions.csv'), 'w', newline='') as fh:
        wr = csv.writer(fh); wr.writerow(['t', 'gap_from_prev']); [wr.writerow([c, round(c - capev[i - 1], 3) if i else '']) for i, c in enumerate(capev)]
    meta = dict(video=os.path.basename(args.video), src=[W0, H0, sfps, dur], analysis_fps=args.fps, view=[w, h],
                n_shots=len(shots), avg_shot=round(dur / max(1, len(shots)), 2), n_captions=len(capev),
                avg_caption_gap=round(float(np.mean(np.diff(capev))), 3) if len(capev) > 1 else None, n_onsets=len(onsets))
    meta['n_hard_cuts'] = sum(1 for tr in trans if tr['kind'] == 'hard cut')
    json.dump(dict(meta=meta, shots=shots, transitions=trans), open(os.path.join(args.out, 'shots.json'), 'w'), indent=1)
    with open(os.path.join(args.out, 'shots.md'), 'w') as fh:
        fh.write(f"# {meta['video']}\n\n{json.dumps(meta)}\n\n## Shot\n\n| # | t0-t1 | dur | masuk lewat | kamera (frame valid) | kurva | parallax | gerak lokal | onset |\n|---|---|---|---|---|---|---|---|---|\n")
        for s in shots:
            fh.write(f"| {s['i']} | {s['t0']}-{s['t1']} | {s['dur']} | {s['enter']} | {s['camera']} ({s['valid_frac']:.0%}) | {s['speed']} | {s['parallax']} | {s['local']} | {len(s['onsets'])} |\n")
        fh.write("\n## Transisi\n\n| t | rentang | durasi | jenis | puncak kecepatan | roll/frame | zoom | vs kata (dtk) | vs onset (dtk) |\n|---|---|---|---|---|---|---|---|---|\n")
        for tr in trans:
            fh.write(f"| {tr['t']} | {tr['t0']}-{tr['t1']} | {tr['dur']} | {tr['kind']} | {tr['peak_speed']} | {tr['peak_rot']} | {tr['zoom']} | {tr['vs_caption']} | {tr['vs_onset']} |\n")

    # lembar kontak per shot + overview
    tw = 240; th = int(h * tw / w)
    ov = []
    for s in shots:
        idx = sorted(set(np.linspace(s['f0'], s['f1'], min(12, s['f1'] - s['f0'] + 1)).round().astype(int)))
        ims = [label(cv2.resize(fr[i], (tw, th), interpolation=cv2.INTER_AREA), f"{i / args.fps:.2f}s f{i}") for i in idx]
        cv2.imwrite(os.path.join(args.out, 'sheets', f"shot{s['i']:02d}.jpg"), tile(ims, 6), [cv2.IMWRITE_JPEG_QUALITY, 88])
        ov.append(label(cv2.resize(fr[(s['f0'] + s['f1']) // 2], (tw, th), interpolation=cv2.INTER_AREA), f"#{s['i']} {s['t0']}s {s['dur']}s"))
    cv2.imwrite(os.path.join(args.out, 'overview.jpg'), tile(ov, 8), [cv2.IMWRITE_JPEG_QUALITY, 88])
    timeline(rows, cuts, capev, onsets, env, dur, w, os.path.join(args.out, 'timeline.png'), args.fps, trans)
    print(open(os.path.join(args.out, 'shots.md')).read())


def timeline(rows, cuts, capev, onsets, env, dur, w, path, fps, trans=()):
    Wd, lanes, lh = 1800, 5, 110; img = np.full((lanes * lh + 40, Wd, 3), 250, np.uint8)
    X = lambda t: int(60 + (Wd - 80) * t / dur)
    for tr in trans: cv2.rectangle(img, (X(tr['t0']), 15), (X(tr['t1'] + 1 / fps), lanes * lh + 15), (200, 235, 255), -1)
    names = ['zoom (log, kumulatif per shot)', 'pan x / pan y (px/frame)', 'gerak lokal (aksi)', 'parallax 3D', 'audio dB']
    for k, nm in enumerate(names):
        y0 = 20 + k * lh; cv2.rectangle(img, (60, y0), (Wd - 20, y0 + lh - 10), (225, 225, 225), 1)
        cv2.putText(img, nm, (64, y0 + 14), cv2.FONT_HERSHEY_SIMPLEX, .42, (60, 60, 60), 1, cv2.LINE_AA)
    def plot(lane, vals, col, lo, hi):
        y0 = 20 + lane * lh; pts = [(X(t), int(y0 + lh - 12 - (lh - 26) * clampf((v - lo) / (hi - lo + 1e-9)))) for t, v in vals]
        cv2.polylines(img, [np.array(pts, np.int32)], False, col, 1, cv2.LINE_AA)
    clampf = lambda v: max(0., min(1., v))
    cz, zs = 0, []
    cutset = set(cuts)
    for r in rows:
        if r['f'] in cutset: cz = 0
        if r.get('valid'): cz += math.log(max(r['zoom'], 1e-3))
        zs.append((r['t'], cz))
    plot(0, zs, (40, 40, 200), -.4, .4)
    plot(1, [(r['t'], r['tx'] if r.get('valid') else 0) for r in rows], (200, 80, 40), -w * .03, w * .03)
    plot(1, [(r['t'], r['ty'] if r.get('valid') else 0) for r in rows], (40, 160, 40), -w * .03, w * .03)
    plot(2, [(r['t'], r['local']) for r in rows], (120, 40, 160), 0, 1)
    plot(3, [(r['t'], r['parallax']) for r in rows], (20, 120, 200), 0, 3)
    if env: plot(4, [(e[0], e[1]) for e in env], (60, 60, 60), -60, 0)
    for c in cuts[1:]:
        cv2.line(img, (X(c / fps), 15), (X(c / fps), lanes * lh + 15), (0, 0, 230), 1)
    for c in capev: cv2.line(img, (X(c), lanes * lh + 18), (X(c), lanes * lh + 28), (200, 100, 0), 2)
    for o in onsets: cv2.line(img, (X(o[0]), 20 + 4 * lh), (X(o[0]), 20 + 5 * lh - 10), (0, 160, 0) if o[2] == 'low' else (0, 200, 220), 1)
    for s in range(int(dur) + 1):
        cv2.putText(img, f'{s}s', (X(s) - 6, lanes * lh + 38), cv2.FONT_HERSHEY_SIMPLEX, .38, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.putText(img, 'oranye muda=rentang transisi  merah=titik ganti adegan  biru(bawah)=caption baru  hijau=onset bass  kuning=onset tinggi', (Wd - 700, 14), cv2.FONT_HERSHEY_SIMPLEX, .42, (0, 0, 0), 1, cv2.LINE_AA)
    cv2.imwrite(path, img)


def dense(args):
    """Semua frame sumber di [T0,T1] pada kotak tertentu, resolusi penuh -> lembar bernomor (mikro ekspresi)."""
    W0, H0, sfps, dur = probe(args.video); P = PRESETS[args.preset]
    vx0, vy0, vx1, vy1 = frac_box(P['view'], W0, H0)
    bx, by, bw, bh = [float(v) for v in args.box.split(',')]
    x = int(vx0 + bx * (vx1 - vx0)); y = int(vy0 + by * (vy1 - vy0)); cw = int(bw * (vx1 - vx0)) // 2 * 2; ch = int(bh * (vy1 - vy0)) // 2 * 2
    t0, t1 = args.dense
    fr = read_frames(args.video, 0, args.dense_fps or sfps, crop=(x, y, cw, ch), t0=t0, t1=t1)
    tw = 220 if cw > 220 else cw; th = int(ch * tw / cw)
    ims = [label(cv2.resize(f, (tw, th), interpolation=cv2.INTER_AREA), f"{t0 + i / (args.dense_fps or sfps):.3f}") for i, f in enumerate(fr)]
    os.makedirs(args.out, exist_ok=True)
    name = os.path.join(args.out, f'dense_{t0:.2f}-{t1:.2f}.jpg')
    cv2.imwrite(name, tile(ims, args.cols), [cv2.IMWRITE_JPEG_QUALITY, 90]); print(name, len(ims), 'frame')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('video'); ap.add_argument('out')
    ap.add_argument('--preset', default='shorts-iphone', choices=list(PRESETS))
    ap.add_argument('--fps', type=float, default=30); ap.add_argument('--width', type=int, default=360)
    ap.add_argument('--dense', type=float, nargs=2); ap.add_argument('--box', default='0,0,1,1')
    ap.add_argument('--dense-fps', type=float, default=0); ap.add_argument('--cols', type=int, default=8)
    a = ap.parse_args()
    dense(a) if a.dense else run(a)
