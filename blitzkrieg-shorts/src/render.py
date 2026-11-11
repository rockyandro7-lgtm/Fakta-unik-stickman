# Blitzkrieg Shorts renderer: every visual is drawn from the same vector assets,
# and every animation is keyed to word timestamps of the narration.
import json, math, pickle, sys, random
from PIL import Image, ImageDraw, ImageFont, ImageChops

ROOT = sys.argv[1]
GEO = pickle.load(open(f'{ROOT}/work/geo.pkl', 'rb'))
WORDS = json.load(open(f'{ROOT}/audio/words.json'))
K = GEO['K']; L = GEO['layers']
SS = 2                      # supersampling
W, H = 1080, 1920
FOCUS_Y = 800               # screen y where camera centre sits
DUR = 45.0

# ---------- palette (fixed for the whole video) ----------
SEA = (16, 24, 31); LAND = (52, 56, 56); BORDER = (78, 84, 82)
RED = (200, 52, 42); RED_D = (120, 28, 22)
BLUE = (60, 120, 196); BLUE_D = (30, 62, 110)
GOLD = (214, 176, 76); OLIVE = (122, 138, 84)
TXT = (243, 236, 222); YEL = (246, 198, 66); GREY = (150, 152, 150); BLACK = (0, 0, 0)

FD = '/usr/share/fonts/opentype/inter/'
_fc = {}
def font(name, size):
    k = (name, size)
    if k not in _fc:
        path = {'black': FD + 'InterDisplay-Black.otf', 'xb': FD + 'Inter-ExtraBold.otf',
                'bold': FD + 'Inter-Bold.otf', 'semi': FD + 'Inter-SemiBold.otf',
                'mono': '/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf'}[name]
        _fc[k] = ImageFont.truetype(path, int(size * SS))
    return _fc[k]

# ---------- timing helpers ----------
def wt(word, n=1, end=False):
    c = 0
    for w in WORDS:
        if w['w'].strip('.,?:!').lower() == word.lower():
            c += 1
            if c == n: return w['e'] if end else w['s']
    raise KeyError(word)
def clamp(x, a=0., b=1.): return a if x < a else b if x > b else x
def ease(x): x = clamp(x); return x * x * (3 - 2 * x)
def eout(x): x = clamp(x); return 1 - (1 - x) ** 3
def prog(t, a, b): return ease((t - a) / max(1e-6, b - a))
def lerp(a, b, k): return a + (b - a) * k
def mix(c1, c2, k): return tuple(int(lerp(a, b, k)) for a, b in zip(c1, c2))

# ---------- scene boundaries (from narration) ----------
T_BEFORE = wt('sebelumnya') - 0.1
T_DOCT = wt('jerman', 2) - 0.15
T_POL = wt('september') - 0.1
T_FRA = wt('mei') - 0.1
T_DUNK = wt('sekutu') - 0.1
T_USSR = wt('tapi') - 0.1
T_OUT = wt('pelajarannya') - 0.1

# ---------- camera ----------
CAM = [  # time, lon, lat, scale(px per projected unit at 1x)
    (0.0, 9.0, 50.0, 52), (T_BEFORE - 0.2, 9.5, 50.0, 60),
    (T_BEFORE + 0.6, 4.6, 49.2, 112), (T_DOCT, 4.6, 49.2, 120),
    (T_DOCT + 0.7, 9.0, 51.0, 52), (T_POL, 9.0, 51.0, 54),
    (T_POL + 0.8, 18.8, 51.6, 80), (T_FRA, 19.2, 51.6, 86),
    (T_FRA + 0.8, 4.3, 49.7, 140), (T_DUNK, 4.1, 49.75, 150),
    (T_DUNK + 0.5, 3.0, 50.6, 160), (wt('paris') - 0.2, 3.0, 50.6, 160),
    (wt('paris') + 0.4, 3.0, 49.4, 104), (T_USSR, 3.0, 49.4, 106),
    (T_USSR + 0.8, 30.0, 53.0, 31), (wt('wilayahnya') - 0.1, 30.5, 53.0, 32),
    (wt('wilayahnya') + 0.9, 32.0, 53.0, 24), (T_OUT, 32.0, 53.0, 25),
    (T_OUT + 0.8, 18.0, 52.0, 30), (DUR, 18.0, 52.0, 33),
]
def camera(t):
    for (t0, a0, b0, s0), (t1, a1, b1, s1) in zip(CAM, CAM[1:]):
        if t0 <= t <= t1:
            k = ease((t - t0) / (t1 - t0))
            # zoom interpolated geometrically for natural feel
            s = math.exp(lerp(math.log(s0), math.log(s1), k))
            return lerp(a0, a1, k), lerp(b0, b1, k), s
    return CAM[-1][1:]

class View:
    def __init__(self, t, shake=(0, 0)):
        lon, lat, s = camera(t)
        self.cx, self.cy, self.s = lon * K, -lat, s * SS
        self.ox, self.oy = W * SS / 2 + shake[0] * SS, FOCUS_Y * SS + shake[1] * SS
    def p(self, x, y):  # projected -> screen
        return ((x - self.cx) * self.s + self.ox, (y - self.cy) * self.s + self.oy)
    def ll(self, lon, lat): return self.p(lon * K, -lat)
    def poly(self, pts): return [self.p(x, y) for x, y in pts]

# ---------- asset primitives (single definitions reused everywhere) ----------
def rot(pts, ang, cx, cy, sc):
    c, s = math.cos(ang), math.sin(ang)
    return [(cx + (x * c - y * s) * sc, cy + (x * s + y * c) * sc) for x, y in pts]

def icon_tank(d, cx, cy, sc, col=RED, ang=0.0):
    sc *= SS
    hull = [(-1.0, 0.05), (1.0, 0.05), (0.85, 0.45), (-0.85, 0.45)]
    upper = [(-0.8, -0.2), (0.75, -0.2), (0.95, 0.05), (-0.95, 0.05)]
    turret = [(-0.45, -0.55), (0.25, -0.55), (0.4, -0.2), (-0.55, -0.2)]
    gun = [(0.3, -0.45), (1.35, -0.45), (1.35, -0.33), (0.3, -0.33)]
    for shape, c in ((hull, (34, 34, 34)), (upper, col), (turret, col), (gun, col)):
        d.polygon(rot(shape, ang, cx, cy, sc), fill=c, outline=BLACK, width=max(1, int(sc * 0.06)))
    for i in range(5):
        wx = -0.68 + i * 0.34
        (x, y), = rot([(wx, 0.27)], ang, cx, cy, sc)
        r = 0.13 * sc
        d.ellipse([x - r, y - r, x + r, y + r], fill=(90, 90, 86), outline=BLACK, width=max(1, int(sc * 0.03)))

def icon_plane(d, cx, cy, sc, col=RED, ang=0.0):
    sc *= SS
    body = [(1.1, 0), (0.9, -0.1), (-0.9, -0.08), (-1.05, 0), (-0.9, 0.08), (0.9, 0.1)]
    wing = [(0.25, 0), (0.05, -1.15), (-0.2, -1.15), (-0.15, 0), (-0.2, 1.15), (0.05, 1.15)]
    tail = [(-0.75, 0), (-0.95, -0.45), (-1.08, -0.45), (-1.0, 0), (-1.08, 0.45), (-0.95, 0.45)]
    for shape in (wing, tail, body):
        d.polygon(rot(shape, ang, cx, cy, sc), fill=col, outline=BLACK, width=max(1, int(sc * 0.05)))

def icon_radio(d, cx, cy, sc, col=RED):
    s = sc * SS
    d.rounded_rectangle([cx - 0.8 * s, cy - 0.45 * s, cx + 0.8 * s, cy + 0.6 * s], radius=0.12 * s, fill=col, outline=BLACK, width=int(0.06 * s))
    d.ellipse([cx - 0.6 * s, cy - 0.25 * s, cx - 0.1 * s, cy + 0.25 * s], fill=(34, 34, 34))
    for i in range(3):
        d.rectangle([cx + 0.1 * s, cy - 0.25 * s + i * 0.18 * s, cx + 0.6 * s, cy - 0.17 * s + i * 0.18 * s], fill=(34, 34, 34))
    d.line([cx + 0.5 * s, cy - 0.45 * s, cx + 0.75 * s, cy - 1.1 * s], fill=TXT, width=int(0.07 * s))

def icon_tree(d, x, y, s):
    s *= SS
    d.polygon([(x, y - 1.0 * s), (x - 0.45 * s, y), (x + 0.45 * s, y)], fill=(46, 92, 58), outline=(20, 40, 26))
    d.polygon([(x, y - 1.4 * s), (x - 0.35 * s, y - 0.6 * s), (x + 0.35 * s, y - 0.6 * s)], fill=(58, 110, 70), outline=(20, 40, 26))

def bolt(d, cx, cy, s, col=YEL, alpha_img=None):
    s *= SS
    pts = [(0.15, -1), (-0.45, 0.1), (-0.02, 0.1), (-0.2, 1), (0.45, -0.2), (0.02, -0.2), (0.25, -1)]
    d.polygon([(cx + x * s, cy + y * s) for x, y in pts], fill=col, outline=BLACK, width=int(0.05 * s))

# ---------- geometry helpers ----------
def smooth(pts, n=12):
    if len(pts) < 3: return pts
    P = [pts[0]] + pts + [pts[-1]]; out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(n):
            t = k / n; t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in range(2)))
    out.append(pts[-1]); return out

def partial(pts, f):
    if f <= 0: return []
    seg = [math.dist(a, b) for a, b in zip(pts, pts[1:])]; tot = sum(seg); goal = tot * f
    out = [pts[0]]; acc = 0
    for (a, b), l in zip(zip(pts, pts[1:]), seg):
        if acc + l >= goal:
            k = (goal - acc) / l if l else 0
            out.append((lerp(a[0], b[0], k), lerp(a[1], b[1], k))); return out
        out.append(b); acc += l
    return out

def arrow(d, v, lonlat, f, col=RED, w=16, head=2.6):
    if f <= 0.01: return None
    pts = smooth([v.ll(*p) for p in lonlat])
    pp = partial(pts, f)
    if len(pp) < 2: return None
    w *= SS
    tip = pp[-1]; # find back point for direction
    back = pp[-2]; i = len(pp) - 2
    while i > 0 and math.dist(back, tip) < w * 1.5: i -= 1; back = pp[i]
    ang = math.atan2(tip[1] - back[1], tip[0] - back[0])
    hl = w * head
    base = (tip[0] - math.cos(ang) * hl, tip[1] - math.sin(ang) * hl)
    body = partial(pp, max(0.0, 1 - hl / max(1, sum(math.dist(a, b) for a, b in zip(pp, pp[1:])))))
    if len(body) >= 2:
        d.line(body, fill=BLACK, width=int(w + 6 * SS), joint='curve')
        d.line(body, fill=col, width=int(w), joint='curve')
    nx, ny = -math.sin(ang), math.cos(ang)
    hw = w * 1.35
    tri = [tip, (base[0] + nx * hw, base[1] + ny * hw), (base[0] - nx * hw, base[1] - ny * hw)]
    d.polygon(tri, fill=col, outline=BLACK, width=3 * SS)
    return tip, ang

def text(d, xy, s, f, fill=TXT, anchor='mm', stroke=0, sfill=BLACK, spacing=0):
    x, y = xy
    if spacing:
        s = (' ' * 0).join(s)  # letter-spacing simulated below
    d.text((x * SS, y * SS), s, font=f, fill=fill, anchor=anchor, stroke_width=int(stroke * SS), stroke_fill=sfill)

def label_map(d, v, lon, lat, s, size=30, fill=TXT, a=1.0, dot=False):
    if a <= 0: return
    x, y = v.ll(lon, lat)
    col = mix((0, 0, 0), fill, a)
    if dot:
        r = 9 * SS
        d.ellipse([x - r, y - r, x + r, y + r], fill=col, outline=BLACK, width=3 * SS)
        d.text((x + 16 * SS, y), s, font=font('xb', size), fill=col, anchor='lm', stroke_width=4 * SS, stroke_fill=BLACK)
    else:
        d.text((x, y), s, font=font('xb', size), fill=col, anchor='mm', stroke_width=4 * SS, stroke_fill=BLACK)

# ---------- precomputed static layers ----------
def vignette():
    im = Image.new('L', (W // 8, H // 8), 0); px = im.load()
    for y in range(H // 8):
        for x in range(W // 8):
            dx = (x - W / 16) / (W / 16); dy = (y - H / 16) / (H / 16)
            px[x, y] = int(255 * clamp((dx * dx * 0.6 + dy * dy * 0.35 - 0.25) * 0.9))
    im = im.resize((W * SS, H * SS), Image.BILINEAR)
    lay = Image.new('RGBA', (W * SS, H * SS), (0, 0, 0, 0)); lay.putalpha(im)
    # top/bottom readability gradients
    g = Image.new('L', (1, H), 0)
    for y in range(H):
        a = 0
        if y < 380: a = 200 * (1 - y / 380) ** 1.4
        if y > 1250: a = max(a, 215 * ((y - 1250) / 670) ** 1.1)
        g.putpixel((0, y), int(a))
    g = g.resize((W * SS, H * SS))
    grad = Image.new('RGBA', (W * SS, H * SS), (6, 9, 12, 0)); grad.putalpha(g)
    return Image.alpha_composite(lay, grad)
VIG = vignette()

# ---------- fixed geography ----------
WWI_FRONT = [(2.75, 51.13), (2.88, 50.85), (2.85, 50.6), (2.78, 50.29), (2.7, 50.0), (3.0, 49.6), (3.35, 49.38), (4.03, 49.27), (4.95, 49.2), (5.38, 49.16), (5.6, 48.92), (6.05, 48.88), (6.6, 48.62), (7.0, 48.2), (7.15, 47.85), (7.2, 47.5)]
MAGINOT = [(5.76, 49.52), (6.4, 49.45), (7.0, 49.17), (7.6, 49.08), (8.18, 48.97), (7.8, 48.5), (7.55, 48.0), (7.59, 47.56)]
CITY = {'Berlin': (13.4, 52.52), 'Warsawa': (21.0, 52.23), 'Paris': (2.35, 48.86), 'Dunkirk': (2.37, 51.03), 'Sedan': (4.94, 49.70),
        'Moskow': (37.6, 55.75), 'Leningrad': (30.3, 59.94), 'Kiev': (30.52, 50.45)}
FR_OCC = [(6.1, 46.2), (4.0, 46.6), (1.5, 46.8), (0.3, 46.6), (-0.3, 45.5), (-0.2, 44.0), (-1.3, 43.1), (-6, 43), (-6, 52), (9, 52), (9, 47.5)]

def poly_mask(v, polys, extra_clip=None):
    m = Image.new('L', (W * SS, H * SS), 0); md = ImageDraw.Draw(m)
    for p in polys: md.polygon(v.poly(p), fill=255)
    if extra_clip is not None:
        c = Image.new('L', (W * SS, H * SS), 0); ImageDraw.Draw(c).polygon(extra_clip, fill=255)
        m = ImageChops.multiply(m, c)
    return m

def sweep_clip(v, lon_from, lon_to, f, lat0=40, lat1=62):
    x = lerp(lon_from, lon_to, f)
    return [v.ll(min(lon_from, x), lat0), v.ll(max(lon_from, x), lat0), v.ll(max(lon_from, x), lat1), v.ll(min(lon_from, x), lat1)]

# ---------- frame ----------
def draw_map(img, d, v, t):
    d.rectangle([0, 0, W * SS, H * SS], fill=SEA)
    # graticule
    for lon in range(-30, 70, 5):
        d.line([v.ll(lon, 30), v.ll(lon, 72)], fill=(24, 34, 42), width=SS)
    for lat in range(30, 75, 5):
        d.line([v.ll(-30, lat), v.ll(70, lat)], fill=(24, 34, 42), width=SS)
    def fill(polys, col, ol=BORDER):
        for p in polys: d.polygon(v.poly(p), fill=col, outline=ol, width=SS)
    fill(L['others'], LAND)
    fill(L['benelux'], mix(LAND, BLUE, 0.25))
    fill(L['uk'], mix(LAND, BLUE, 0.55))
    fill(L['france'], BLUE)
    fill(L['poland'], GOLD)
    fill(L['ussr'], OLIVE)
    fill(L['reich'], RED)
    # ---- conquests (kept once they happen) ----
    # Poland 1939: west to the Bug river German, east Soviet
    fp = prog(t, wt('panzer') - 0.05, T_FRA - 0.2)
    if fp > 0:
        m = poly_mask(v, L['poland'], sweep_clip(v, 14, 23.4, fp))
        img.paste(RED, mask=m)
        if t > T_FRA - 0.5:
            m2 = poly_mask(v, L['poland'], sweep_clip(v, 23.4, 30, 1))
            a = prog(t, T_FRA - 0.6, T_FRA - 0.1)
            img.paste(OLIVE, mask=m2.point(lambda q: int(q * a)))
    # France 1940 occupied zone
    ff = prog(t, wt('jatuh'), wt('juni') + 0.3)
    if ff > 0:
        clip = [v.ll(*p) for p in FR_OCC]
        m = poly_mask(v, L['france'], clip)
        sw = poly_mask(v, L['france'], sweep_clip(v, 9, -6, ff))
        img.paste(RED, mask=ImageChops.multiply(m, sw))
        # Benelux under occupation as well
        img.paste(mix(RED, LAND, 0.25), mask=poly_mask(v, L['benelux']).point(lambda q: int(q * ff)))
    # re-stroke borders lightly
    for key in ('reich', 'poland', 'france', 'ussr'):
        for p in L[key]: d.line(v.poly(p) + [v.poly(p)[0]], fill=(20, 20, 20), width=SS)

def header(d, t):
    # 3-part structure bar
    parts = [('SEBELUM', T_BEFORE, T_POL), ('SESAAT', T_POL, T_USSR), ('SESUDAH', T_USSR, DUR)]
    if t < T_BEFORE - 0.3: return
    a = prog(t, T_BEFORE - 0.3, T_BEFORE + 0.2)
    x0, wseg, gap, y = 90, 280, 20, 120
    for i, (name, a0, a1) in enumerate(parts):
        x = x0 + i * (wseg + gap)
        active = a0 <= t < a1; done = t >= a1
        col = YEL if active else (TXT if done else (110, 112, 110))
        col = mix((10, 10, 10), col, a)
        d.rounded_rectangle([x * SS, y * SS, (x + wseg) * SS, (y + 10) * SS], radius=5 * SS, fill=mix((10, 10, 10), (70, 72, 72), a))
        fp = 1.0 if done else (clamp((t - a0) / (a1 - a0)) if active else 0)
        if fp > 0:
            d.rounded_rectangle([x * SS, y * SS, (x + wseg * fp) * SS, (y + 10) * SS], radius=5 * SS, fill=col)
        d.text(((x + wseg / 2) * SS, (y + 42) * SS), name, font=font('xb', 30), fill=col, anchor='mm', stroke_width=3 * SS, stroke_fill=BLACK)

def stamp(d, t, t0, t1, line1, line2=None, y=250):
    if not (t0 - 0.01 <= t <= t1): return
    a = eout((t - t0) / 0.25) * (1 - prog(t, t1 - 0.25, t1))
    sc = 1 + 0.25 * (1 - eout((t - t0) / 0.2))
    f = font('mono', 58 * sc)
    col = mix(BLACK, TXT, a)
    bb = d.textbbox((W / 2 * SS, y * SS), line1, font=f, anchor='mm')
    pad = 22 * SS
    d.rectangle([bb[0] - pad, bb[1] - pad * 0.7, bb[2] + pad, bb[3] + pad * 0.7], outline=mix(BLACK, RED, a), width=5 * SS, fill=mix(BLACK, (18, 14, 12), a))
    d.text((W / 2 * SS, y * SS), line1, font=f, fill=col, anchor='mm')
    if line2:
        d.text((W / 2 * SS, (y + 70) * SS), line2, font=font('xb', 34), fill=mix(BLACK, YEL, a), anchor='mm', stroke_width=3 * SS, stroke_fill=BLACK)

# captions -----------------------------------------------------------------
def build_groups():
    groups, cur = [], []
    for i, w in enumerate(WORDS):
        cur.append(i)
        punct = w['w'][-1] in '.,?:!'
        if len(cur) >= 4 or punct or (i + 1 < len(WORDS) and WORDS[i + 1]['s'] - w['e'] > 0.35):
            groups.append(cur); cur = []
    if cur: groups.append(cur)
    return groups
GROUPS = build_groups()

def captions(d, t):
    if t >= T_OUT: return
    g = None
    for gi, grp in enumerate(GROUPS):
        s = WORDS[grp[0]]['s'] - 0.08
        e = WORDS[GROUPS[gi + 1][0]]['s'] - 0.08 if gi + 1 < len(GROUPS) else DUR
        e = min(e, WORDS[grp[-1]]['e'] + 0.6)
        if s <= t < e: g = grp; break
    if g is None: return
    f = font('black', 74)
    toks = [WORDS[i]['w'].upper() for i in g]
    widths = [d.textlength(tk, font=f) for tk in toks]; sp = d.textlength(' ', font=f)
    lines = [[0]]; lw = widths[0]
    for j in range(1, len(toks)):
        if lw + sp + widths[j] > 940 * SS: lines.append([j]); lw = widths[j]
        else: lines[-1].append(j); lw += sp + widths[j]
    y0 = 1500 - (len(lines) - 1) * 46
    for li, line in enumerate(lines):
        tot = sum(widths[j] for j in line) + sp * (len(line) - 1)
        x = W * SS / 2 - tot / 2; y = (y0 + li * 92) * SS
        for j in line:
            wi = g[j]; w = WORDS[wi]
            active = w['s'] - 0.04 <= t < (WORDS[wi + 1]['s'] - 0.04 if wi + 1 < len(WORDS) else 99)
            spoken = t >= w['s'] - 0.04
            col = YEL if active else (TXT if spoken else (175, 172, 165))
            pop = 1 + 0.12 * (1 - eout((t - w['s']) / 0.15)) if active else 1
            ff = font('black', 74 * pop) if pop > 1.01 else f
            cx = x + widths[j] / 2
            d.text((cx, y), toks[j], font=ff, fill=col, anchor='mm', stroke_width=7 * SS, stroke_fill=BLACK)
            x += widths[j] + sp

# ---------- scene overlays ----------
def scene_hook(img, d, v, t):
    a_fr = prog(t, wt('prancis'), wt('prancis') + 0.3) * (1 - prog(t, T_BEFORE - 0.4, T_BEFORE))
    if a_fr > 0:
        pulse = 0.5 + 0.5 * math.sin((t - wt('prancis')) * 9)
        for p in L['france']: d.line(v.poly(p) + [v.poly(p)[0]], fill=mix(BLUE, TXT, pulse), width=int(6 * SS * a_fr) + 1)
        label_map(d, v, 2.3, 47.0, 'PRANCIS', 34, a=a_fr)
        label_map(d, v, 10.4, 51.0, 'JERMAN', 34, a=a_fr)
    # "6 MINGGU"
    t6 = wt('enam'); t6e = wt('jawabannya')
    if t6 - 0.05 <= t < wt('blitzkrieg'):
        k = eout((t - t6) / 0.25); n = 1 + int(5 * clamp((t - t6) / 0.5))
        a = k * (1 - prog(t, wt('blitzkrieg') - 0.2, wt('blitzkrieg')))
        d.text((W / 2 * SS, 520 * SS), f'{n}', font=font('black', 260 * (0.8 + 0.2 * k)), fill=mix(BLACK, YEL, a), anchor='mm', stroke_width=10 * SS, stroke_fill=BLACK)
        d.text((W / 2 * SS, 690 * SS), 'MINGGU', font=font('black', 92), fill=mix(BLACK, TXT, a), anchor='mm', stroke_width=7 * SS, stroke_fill=BLACK)
        d.text((W / 2 * SS, 300 * SS), 'MEI – JUNI 1940', font=font('mono', 44), fill=mix(BLACK, TXT, a), anchor='mm')
    tb = wt('blitzkrieg')
    if tb <= t < T_BEFORE:
        a = 1 - prog(t, T_BEFORE - 0.35, T_BEFORE)
        k = eout((t - tb) / 0.18)
        sc = 1.6 - 0.6 * k
        bolt(d, W / 2 * SS, 470 * SS, 170 * (0.6 + 0.4 * k), col=mix(BLACK, YEL, a))
        d.text((W / 2 * SS, 700 * SS), 'BLITZKRIEG', font=font('black', 150 * sc), fill=mix(BLACK, TXT, a), anchor='mm', stroke_width=10 * SS, stroke_fill=BLACK)
        tk = wt('perang', 1)
        if t >= tk:
            a2 = eout((t - tk) / 0.25) * a
            d.text((W / 2 * SS, 830 * SS), '"PERANG KILAT"', font=font('xb', 58), fill=mix(BLACK, YEL, a2), anchor='mm', stroke_width=5 * SS, stroke_fill=BLACK)

def scene_before(img, d, v, t):
    if not (T_BEFORE <= t < T_DOCT + 0.3): return
    a = 1 - prog(t, T_DOCT - 0.1, T_DOCT + 0.3)
    stamp(d, t, wt('perang', 2), T_DOCT, 'PERANG DUNIA I', '1914 – 1918')
    tp = wt('macet'); f = prog(t, tp, wt('parit', end=True))
    if f > 0:
        jit = 0.04 * math.sin(t * 7) if t > wt('nyaris') else 0
        pts = smooth([v.ll(lo + jit, la) for lo, la in WWI_FRONT], 8)
        pp = partial(pts, f)
        if len(pp) > 1:
            d.line(pp, fill=mix(BLACK, (20, 16, 12), a), width=22 * SS, joint='curve')
            d.line(pp, fill=mix(BLACK, (168, 132, 84), a), width=12 * SS, joint='curve')
            # barbed wire ticks
            for i in range(0, len(pp) - 1, 3):
                (x1, y1), (x2, y2) = pp[i], pp[i + 1]
                ang = math.atan2(y2 - y1, x2 - x1) + math.pi / 2
                for sgn in (-1, 1):
                    ox, oy = math.cos(ang + sgn * 0.6) * 16 * SS, math.sin(ang + sgn * 0.6) * 16 * SS
                    d.line([x1 - ox, y1 - oy, x1 + ox, y1 + oy], fill=mix(BLACK, (200, 200, 190), a), width=2 * SS)
        label_map(d, v, 1.2, 50.0, 'PARIT', 34, fill=(220, 190, 140), a=a * f)
    ty = wt('empat')
    if t >= ty:
        k = clamp((t - ty) / 0.8); yr = 1914 + int(round(4 * k))
        a2 = eout((t - ty) / 0.2) * a
        d.text((W / 2 * SS, 470 * SS), str(yr), font=font('black', 150), fill=mix(BLACK, YEL, a2), anchor='mm', stroke_width=8 * SS, stroke_fill=BLACK)
    tn = wt('nyaris')
    if t >= tn:
        a3 = eout((t - tn) / 0.25) * a
        d.text((W / 2 * SS, 1190 * SS), 'GARIS DEPAN NYARIS STATIS', font=font('xb', 44), fill=mix(BLACK, TXT, a3), anchor='mm', stroke_width=5 * SS, stroke_fill=BLACK)

def scene_doctrine(img, d, v, t):
    if not (T_DOCT - 0.2 <= t < T_POL + 0.3): return
    a = prog(t, T_DOCT - 0.2, T_DOCT + 0.3) * (1 - prog(t, T_POL - 0.1, T_POL + 0.3))
    ov = Image.new('RGBA', img.size, (8, 10, 12, int(185 * a)))
    img.paste(ov, (0, 0), ov)
    d = ImageDraw.Draw(img)
    tg = wt('heinz')
    if t >= tg:
        k = eout((t - tg) / 0.3) * a
        y = 330
        d.rounded_rectangle([170 * SS, (y - 70) * SS, 910 * SS, (y + 80) * SS], radius=18 * SS, fill=mix(BLACK, (28, 26, 24), k), outline=mix(BLACK, RED, k), width=4 * SS)
        d.text((W / 2 * SS, (y - 18) * SS), 'HEINZ GUDERIAN', font=font('black', 66), fill=mix(BLACK, TXT, k), anchor='mm')
        d.text((W / 2 * SS, (y + 42) * SS), 'perintis taktik panzer Jerman', font=font('semi', 34), fill=mix(BLACK, YEL, k), anchor='mm')
    # three tools
    hub = (540, 860)
    spots = {'tank': (300, 720), 'pesawat': (780, 720), 'radio': (540, 1040)}
    tm = wt('menghantam'); conv = prog(t, tm, tm + 0.6)
    # link lines once radio appears
    tr = wt('radio')
    if t >= tr:
        k = eout((t - tr) / 0.3) * a * (1 - conv)
        pts = [spots['tank'], spots['pesawat'], spots['radio']]
        for p1, p2 in ((pts[0], pts[1]), (pts[1], pts[2]), (pts[2], pts[0])):
            n = 14
            for i in range(n):
                if i % 2: continue
                x1, y1 = lerp(p1[0], p2[0], i / n), lerp(p1[1], p2[1], i / n)
                x2, y2 = lerp(p1[0], p2[0], (i + 1) / n), lerp(p1[1], p2[1], (i + 1) / n)
                d.line([x1 * SS, y1 * SS, x2 * SS, y2 * SS], fill=mix(BLACK, YEL, k), width=5 * SS)
        # radio waves
        for r in range(3):
            ph = ((t - tr) * 1.5 + r / 3) % 1
            rr = (40 + ph * 140) * SS; cx, cy = spots['radio']
            d.arc([cx * SS - rr, cy * SS - 60 * SS - rr, cx * SS + rr, cy * SS - 60 * SS + rr], 220, 320, fill=mix(BLACK, YEL, k * (1 - ph)), width=4 * SS)
    target = (720, 860)
    for key, word in (('tank', 'tank'), ('pesawat', 'pesawat'), ('radio', 'radio')):
        tw = wt(word)
        if t < tw - 0.05: continue
        k = eout((t - tw) / 0.25) * a
        sx, sy = spots[key]
        x, y = lerp(sx, 300 + (0 if key == 'tank' else (-40 if key == 'pesawat' else 40)), conv), lerp(sy, 860 + {'tank': 0, 'pesawat': -110, 'radio': 110}[key], conv)
        sc = (95 if key != 'radio' else 80) * (0.5 + 0.5 * k) * (1 - 0.35 * conv)
        if key == 'tank': icon_tank(d, x * SS, y * SS, sc, col=mix(BLACK, RED, k))
        elif key == 'pesawat': icon_plane(d, x * SS, y * SS, sc, col=mix(BLACK, RED, k))
        else: icon_radio(d, x * SS, y * SS, sc, col=mix(BLACK, RED, k))
        lbl = {'tank': 'TANK', 'pesawat': 'PESAWAT', 'radio': 'RADIO'}[key]
        d.text((x * SS, (y + sc * 1.25) * SS), lbl, font=font('xb', 36 * (1 - 0.4 * conv)), fill=mix(BLACK, TXT, k * (1 - conv)), anchor='mm', stroke_width=3 * SS, stroke_fill=BLACK)
    # defensive line + spearhead
    if t >= tm - 0.2:
        k = prog(t, tm - 0.2, tm + 0.2) * a
        hit = wt('titik'); broke = prog(t, hit, hit + 0.3)
        lx = 820
        for i in range(12):
            y1 = 620 + i * 42
            off = (90 if abs(y1 + 15 - 860) < 70 else 0) * broke * (1 if y1 < 860 else -1)
            d.line([(lx) * SS, (y1 + off * 0.0) * SS - off * SS, lx * SS, (y1 + 26) * SS - off * SS], fill=mix(BLACK, BLUE, k), width=10 * SS)
        d.text((lx * SS, 1180 * SS), 'PERTAHANAN', font=font('xb', 32), fill=mix(BLACK, BLUE, k), anchor='mm', stroke_width=3 * SS, stroke_fill=BLACK)
        f = prog(t, tm + 0.1, hit + 0.1)
        if f > 0:
            x2 = lerp(380, 980, f)
            d.line([360 * SS, 860 * SS, (x2 - 40) * SS, 860 * SS], fill=BLACK, width=40 * SS)
            d.line([360 * SS, 860 * SS, (x2 - 40) * SS, 860 * SS], fill=mix(BLACK, RED, k), width=30 * SS)
            d.polygon([(x2 * SS, 860 * SS), ((x2 - 70) * SS, 810 * SS), ((x2 - 70) * SS, 910 * SS)], fill=mix(BLACK, RED, k), outline=BLACK, width=3 * SS)
        if broke > 0 and broke < 1:
            for i in range(10):
                ang = i / 10 * 2 * math.pi; r = 30 + 120 * broke
                d.line([lx * SS, 860 * SS, (lx + math.cos(ang) * r) * SS, (860 + math.sin(ang) * r) * SS], fill=mix(BLACK, YEL, 1 - broke), width=5 * SS)
        if t >= wt('satu'):
            a4 = eout((t - wt('satu')) / 0.25) * a
            d.text((W / 2 * SS, 1250 * SS), 'CEPAT • TERPUSAT • TERKOORDINASI', font=font('xb', 38), fill=mix(BLACK, YEL, a4), anchor='mm', stroke_width=4 * SS, stroke_fill=BLACK)
    return d

POL_ARROWS = [
    [(15.6, 53.6), (17.8, 53.0), (20.4, 52.4)],
    [(20.6, 53.9), (20.9, 53.1), (21.0, 52.4)],
    [(17.6, 50.7), (19.3, 51.3), (20.6, 52.0)],
    [(20.2, 49.3), (21.6, 50.0), (23.0, 50.6)],
]
def scene_poland(img, d, v, t):
    if not (T_POL - 0.2 <= t < T_FRA + 0.2): return
    a = prog(t, T_POL, T_POL + 0.4) * (1 - prog(t, T_FRA - 0.2, T_FRA + 0.2))
    stamp(d, t, wt('september'), T_FRA - 0.1, '1 SEPTEMBER 1939', 'INVASI POLANDIA')
    label_map(d, v, 10.5, 51.4, 'JERMAN', 30, a=a)
    label_map(d, v, 21.5, 51.3, 'POLANDIA', 34, a=a * (1 - prog(t, wt('panzer'), wt('panzer') + 0.5)))
    label_map(d, v, *CITY['Warsawa'], 'Warsawa', 26, a=a, dot=True)
    label_map(d, v, *CITY['Berlin'], 'Berlin', 26, a=a, dot=True)
    ta = wt('diserang') - 0.25
    tips = []
    for i, path in enumerate(POL_ARROWS):
        f = eout((t - ta - i * 0.12) / 0.9)
        if a > 0: r = arrow(d, v, path, f * 1.0, col=mix(BLACK, RED, a), w=16)
        else: r = None
        tips.append(r)
    # Stuka pass
    ts = wt('stuka'); te = wt('panzer')
    if ts - 0.1 <= t < te + 0.6:
        for i in range(3):
            k = (t - ts - i * 0.15) / 1.9
            if 0 <= k <= 1:
                x = lerp(-120, 1200, k) + i * 60; y = lerp(560, 930, k) - i * 70
                icon_plane(d, x * SS, y * SS, 44, col=mix(BLACK, RED, a), ang=math.atan2(370, 1320))
        th = wt('menghantam', 2)
        for j, (lo, la) in enumerate([(19.6, 51.8), (21.2, 52.4), (18.7, 52.6), (20.4, 50.9)]):
            tb = th + j * 0.22
            if tb <= t < tb + 0.5:
                k = (t - tb) / 0.5; x, y = v.ll(lo, la); r = (14 + 46 * k) * SS
                d.ellipse([x - r, y - r, x + r, y + r], outline=mix((40, 20, 10), (255, 200, 90), 1 - k), width=int((10 * (1 - k) + 2) * SS))
                r2 = 18 * (1 - k) * SS
                d.ellipse([x - r2, y - r2, x + r2, y + r2], fill=(255, 230, 150))
        if t >= ts:
            k = eout((t - ts) / 0.25) * a * (1 - prog(t, te, te + 0.3))
            d.text((W / 2 * SS, 470 * SS), 'STUKA: BOMBER TUKIK', font=font('xb', 44), fill=mix(BLACK, TXT, k), anchor='mm', stroke_width=4 * SS, stroke_fill=BLACK)
    # panzers ride the arrow tips
    if t >= te - 0.1:
        k = eout((t - te) / 0.3) * a
        for i, path in enumerate(POL_ARROWS[:3]):
            pts = smooth([v.ll(*p) for p in path]); f = 0.35 + 0.55 * prog(t, te, T_FRA - 0.3)
            pp = partial(pts, f); x, y = pp[-1]
            icon_tank(d, x, y - 10 * SS, 34 * (0.4 + 0.6 * k), col=mix(BLACK, RED, k))
        tso = T_FRA - 0.9
        if t >= tso:
            k2 = eout((t - tso) / 0.3) * a
            label_map(d, v, 26.8, 50.2, '17 SEP: SOVIET', 24, fill=(200, 215, 160), a=k2)
            label_map(d, v, 26.8, 49.6, 'MASUK DARI TIMUR', 24, fill=(200, 215, 160), a=k2)

ALLIED = [[(3.1, 50.55), (4.0, 50.75), (4.7, 50.85)], [(2.8, 50.4), (3.6, 50.95), (4.4, 51.15)]]
PANZER_RT = [(7.2, 50.15), (6.1, 49.95), (5.0, 49.72), (3.9, 49.85), (2.6, 50.0), (1.65, 50.2)]
def scene_france(img, d, v, t):
    if not (T_FRA - 0.2 <= t < T_USSR + 0.3): return
    a = prog(t, T_FRA, T_FRA + 0.4) * (1 - prog(t, T_USSR - 0.2, T_USSR + 0.3))
    stamp(d, t, wt('mei'), T_DUNK, '10 MEI 1940', 'SERANGAN KE BARAT')
    # Maginot always drawn in this act; highlighted when named
    tm = wt('maginot') - 0.4
    hl = prog(t, tm, tm + 0.3)
    pts = [v.ll(*p) for p in MAGINOT]
    if a > 0:
        d.line(pts, fill=BLACK, width=int((16 + 8 * hl) * SS), joint='curve')
        d.line(pts, fill=mix(BLACK, mix((120, 150, 190), (150, 205, 255), hl), a), width=int((9 + 6 * hl) * SS), joint='curve')
        for p1, p2 in zip(pts, pts[1:]):
            for k in (0.25, 0.75):
                x, y = lerp(p1[0], p2[0], k), lerp(p1[1], p2[1], k); r = 7 * SS
                d.rectangle([x - r, y - r, x + r, y + r], fill=mix(BLACK, (220, 230, 245), a), outline=BLACK, width=2 * SS)
    if hl > 0:
        label_map(d, v, 8.9, 48.55, 'GARIS', 32, fill=(170, 215, 255), a=a * hl)
        label_map(d, v, 8.9, 48.25, 'MAGINOT', 32, fill=(170, 215, 255), a=a * hl)
    label_map(d, v, 2.2, 47.4, 'PRANCIS', 34, a=a * (1 - prog(t, T_DUNK - 0.2, T_DUNK)))
    label_map(d, v, 4.5, 50.75, 'BELGIA', 28, a=a * (1 - prog(t, T_DUNK - 0.2, T_DUNK)))
    label_map(d, v, 10.0, 50.6, 'JERMAN', 30, a=a * (1 - prog(t, T_DUNK - 0.2, T_DUNK)))
    # Allied advance into Belgium (the bait)
    for i, path in enumerate(ALLIED):
        f = eout((t - wt('mei') - 0.2 - i * 0.15) / 0.9)
        if a > 0: arrow(d, v, path, f, col=mix(BLACK, BLUE, a), w=12)
    # Ardennes forest
    th = wt('hutan') - 0.15
    if t >= th:
        k = eout((t - th) / 0.4) * a
        rnd = random.Random(7)
        for i in range(26):
            lo, la = 4.9 + rnd.random() * 1.5, 49.7 + rnd.random() * 0.75
            if (t - th) * 30 < i: continue
            x, y = v.ll(lo, la); icon_tree(d, x, y, 15 * k)
        label_map(d, v, 5.7, 50.65, 'ARDENNES', 32, fill=(150, 220, 160), a=k)
    td = wt('dianggap')
    if td <= t < T_DUNK:
        k = eout((t - td) / 0.25) * a * (1 - prog(t, T_DUNK - 0.3, T_DUNK))
        d.text((W / 2 * SS, 1240 * SS), '"MUSTAHIL DILALUI TANK"', font=font('xb', 46), fill=mix(BLACK, TXT, k), anchor='mm', stroke_width=4 * SS, stroke_fill=BLACK)
        if t >= wt('mustahil', end=True) - 0.2:
            k2 = eout((t - wt('mustahil', end=True) + 0.2) / 0.2) * k
            d.line([180 * SS, 1265 * SS, 900 * SS, 1215 * SS], fill=mix(BLACK, RED, k2), width=9 * SS)
    # Panzer thrust
    tp = wt('panzer', 2) - 0.1
    f = prog(t, tp, wt('maginot', end=True) + 0.2)
    if f > 0 and a > 0:
        r = arrow(d, v, PANZER_RT, f, col=mix(BLACK, RED, a), w=20)
        if r:
            (x, y), ang = r
            icon_tank(d, x - math.cos(ang) * 70 * SS, y - math.sin(ang) * 70 * SS - 22 * SS, 34, col=mix(BLACK, RED, a))
        label_map(d, v, *CITY['Sedan'], 'Sedan', 24, a=a * prog(t, tp + 0.8, tp + 1.1), dot=True)

POCKET = [(1.9, 51.05), (2.6, 51.15), (3.4, 51.35), (4.2, 51.1), (4.0, 50.6), (3.3, 50.35), (2.5, 50.4), (1.9, 50.75)]
def scene_dunkirk(img, d, v, t):
    if not (T_DUNK - 0.1 <= t < T_USSR + 0.3): return
    a = prog(t, T_DUNK - 0.1, T_DUNK + 0.3) * (1 - prog(t, T_USSR - 0.2, T_USSR + 0.3))
    ts = wt('sekutu'); shrink = 1 - 0.55 * prog(t, ts, wt('dunkirk', end=True))
    dk = CITY['Dunkirk']
    poly = [(lerp(dk[0], lo, shrink), lerp(dk[1], la, shrink)) for lo, la in POCKET]
    sp = smooth([v.ll(*p) for p in poly + [poly[0]]], 6)
    if a > 0:
        d.polygon(sp, fill=mix(BLACK, BLUE_D, a))
        for i in range(0, len(sp), 2):
            pass
        d.line(sp, fill=mix(BLACK, BLUE, a), width=5 * SS)
        # red ring of panzers squeezing
        ring = prog(t, ts, ts + 0.7)
        cx, cy = v.ll(*dk)
        for i in range(9):
            ang = math.pi * (0.05 + 0.9 * i / 8) + math.pi * 0.0
            # ring opens toward the sea (north)
            ang = math.radians(20 + i * 17.5)
            rr = (lerp(330, 210, ring)) * SS
            x, y = cx + math.cos(ang) * rr, cy + math.sin(ang) * rr * 0.9
            if i <= ring * 9: icon_tank(d, x, y, 26, col=mix(BLACK, RED, a), ang=ang + math.pi)
    label_map(d, v, *dk, 'DUNKIRK', 30, a=a * prog(t, wt('dunkirk') - 0.1, wt('dunkirk') + 0.2), dot=True)
    te = wt('dunkirk')
    if te <= t < wt('paris') + 0.3:
        k = eout((t - te) / 0.25) * a * (1 - prog(t, wt('paris'), wt('paris') + 0.3))
        d.text((W / 2 * SS, 1200 * SS), '±338.000 tentara Sekutu dievakuasi', font=font('xb', 38), fill=mix(BLACK, TXT, k), anchor='mm', stroke_width=4 * SS, stroke_fill=BLACK)
    tp = wt('paris')
    f = prog(t, tp - 0.15, wt('jatuh', end=True))
    if f > 0 and a > 0:
        arrow(d, v, [(3.9, 49.8), (3.2, 49.35), (2.45, 48.95)], f, col=mix(BLACK, RED, a), w=18)
        label_map(d, v, *CITY['Paris'], 'PARIS', 32, a=a * prog(t, tp - 0.1, tp + 0.2), dot=True)
    stamp(d, t, wt('empat', 2), T_USSR, '14 JUNI 1940', 'PARIS JATUH')

USSR_ARROWS = [
    ([(22.6, 55.0), (25.5, 57.0), (28.6, 58.8), (30.0, 59.6)], 0.92),
    ([(23.8, 52.6), (27.5, 54.0), (31.5, 54.8), (35.2, 55.5), (37.4, 55.7)], 0.88),
    ([(24.0, 50.5), (27.5, 50.2), (30.5, 50.2), (34.5, 49.0), (38.8, 47.6)], 0.9),
]
def scene_ussr(img, d, v, t):
    if not (T_USSR - 0.2 <= t < T_OUT + 0.3): return
    a = prog(t, T_USSR, T_USSR + 0.4) * (1 - prog(t, T_OUT - 0.2, T_OUT + 0.3))
    stamp(d, t, wt('tapi'), wt('wilayahnya') - 0.1, '22 JUNI 1941', 'OPERASI BARBAROSSA')
    label_map(d, v, 46, 60.5, 'UNI SOVIET', 44, a=a)
    for c in ('Moskow', 'Leningrad', 'Kiev', 'Berlin'):
        label_map(d, v, *CITY[c], c, 26, a=a, dot=True)
    tk = wt('padam'); stall = prog(t, tk, tk + 0.6)
    tw = wt('dingin') - 0.3; winter = prog(t, tw, tw + 1.0)
    for i, (path, stop) in enumerate(USSR_ARROWS):
        f = eout((t - T_USSR - 0.3 - i * 0.1) / 1.2) * stop
        col = mix(RED, (150, 110, 105), stall * 0.7)
        if a > 0: arrow(d, v, path, f, col=mix(BLACK, col, a), w=14)
    # lightning icon that goes out
    tb = T_USSR + 0.3
    if t >= tb and a > 0:
        flick = 1.0 if t < tk else (0.0 if t > tk + 0.5 else (0.5 + 0.5 * math.sin((t - tk) * 60)) * (1 - (t - tk) / 0.5))
        col = mix((60, 60, 60), YEL, flick)
        bolt(d, 930 * SS, 470 * SS, 70, col=mix(BLACK, col, a))
        if t >= tk:
            k = eout((t - tk) / 0.25) * a * (1 - prog(t, wt('wilayahnya') - 0.1, wt('wilayahnya') + 0.2))
            if k > 0.03: d.text((W / 2 * SS, 470 * SS), 'SERANGAN KILAT TERHENTI', font=font('xb', 46), fill=mix(BLACK, TXT, k), anchor='mm', stroke_width=4 * SS, stroke_fill=BLACK)
    # vast territory: front width bracket
    tl = wt('wilayahnya')
    if t >= tl:
        k = eout((t - tl) / 0.35) * a
        fl = smooth([v.ll(*q) for q in [(21.2, 55.7), (22.8, 54.3), (23.8, 52.5), (24.0, 50.0), (26.5, 48.3), (29.6, 45.5)]], 8)
        fl = partial(fl, eout((t - tl) / 0.6))
        for i in range(len(fl) - 1):
            if i % 4 < 3: d.line([fl[i], fl[i + 1]], fill=mix(BLACK, YEL, k), width=7 * SS)
        p1, p2 = v.ll(21.2, 55.7), v.ll(29.6, 45.5)
        for p in (p1, p2): d.ellipse([p[0] - 11 * SS, p[1] - 11 * SS, p[0] + 11 * SS, p[1] + 11 * SS], fill=mix(BLACK, YEL, k))
        mx, my = v.ll(22.6, 49.2)
        d.text((mx, my), 'FRONT ±2.900 KM', font=font('xb', 32), fill=mix(BLACK, YEL, k), anchor='rm', stroke_width=4 * SS, stroke_fill=BLACK)
    # logistics line breaking down
    tlg = wt('logistik')
    if t >= tlg:
        k = eout((t - tlg) / 0.3) * a
        sp = smooth([v.ll(13.4, 52.5), v.ll(21.0, 52.3), v.ll(28.0, 54.0), v.ll(34.5, 55.2)], 10)
        speed = 1.2 * (1 - 0.85 * prog(t, tlg, tlg + 1.2))
        for i in range(0, len(sp) - 1):
            if i % 3 == 0:
                d.line([sp[i], sp[i + 1]], fill=mix(BLACK, (220, 200, 150), k), width=5 * SS)
        for j in range(6):
            ph = ((t - tlg) * speed * 0.25 + j / 6) % 1
            if ph > 0.35 + 0.6 * (1 - prog(t, tlg, tlg + 1.3)): continue
            pp = partial(sp, ph); x, y = pp[-1]
            d.rectangle([x - 11 * SS, y - 8 * SS, x + 11 * SS, y + 8 * SS], fill=mix(BLACK, (230, 210, 160), k), outline=BLACK, width=2 * SS)
        x, y = v.ll(27.0, 53.9)
        d.ellipse([x - 26 * SS, y - 70 * SS, x + 26 * SS, y - 18 * SS], fill=mix(BLACK, RED, k), outline=BLACK, width=3 * SS)
        d.text((x, y - 44 * SS), '!', font=font('black', 40), fill=mix(BLACK, TXT, k), anchor='mm')
        d.text((x, y + 4 * SS), 'LOGISTIK', font=font('xb', 26), fill=mix(BLACK, TXT, k), anchor='ma', stroke_width=3 * SS, stroke_fill=BLACK)
    if winter > 0 and a > 0:
        ov = Image.new('RGBA', img.size, (200, 220, 240, int(70 * winter * a)))
        img.alpha_composite(ov) if img.mode == 'RGBA' else img.paste(ov, (0, 0), ov)
        d = ImageDraw.Draw(img)
        rnd = random.Random(3)
        for i in range(160):
            x0 = rnd.random() * W; sp_ = 120 + rnd.random() * 160; ph = rnd.random() * H
            y = (ph + (t - tw) * sp_) % H; x = x0 + 25 * math.sin(t * 1.3 + i)
            r = (2 + rnd.random() * 4) * SS
            d.ellipse([x * SS - r, y * SS - r, x * SS + r, y * SS + r], fill=mix(BLACK, (240, 245, 255), winter * a))
        # Soviet counter-push near Moscow
        f = prog(t, tw + 0.3, T_OUT - 0.2)
        arrow(d, v, [(39.5, 56.2), (37.5, 55.6), (35.2, 55.1)], f, col=mix(BLACK, (150, 175, 100), a), w=12)
        stamp(d, t, tw + 0.2, T_OUT, 'DES 1941', 'TERTAHAN DI DEPAN MOSKOW', y=250)
    return d

def scene_outro(img, d, v, t):
    if t < T_OUT - 0.3: return
    a = prog(t, T_OUT - 0.3, T_OUT + 0.3)
    ov = Image.new('RGBA', img.size, (8, 10, 12, int(200 * a)))
    img.paste(ov, (0, 0), ov); d = ImageDraw.Draw(img)
    def show(word, s, y, size, col, n=1, font_='black'):
        tw_ = wt(word, n)
        if t < tw_ - 0.05: return
        k = eout((t - tw_ + 0.05) / 0.2)
        d.text((W / 2 * SS, y * SS), s, font=font(font_, size * (1.15 - 0.15 * k)), fill=mix(BLACK, col, k * a), anchor='mm', stroke_width=6 * SS, stroke_fill=BLACK)
    show('pelajarannya', 'PELAJARANNYA', 700, 52, YEL, font_='xb')
    show('kecepatan', 'KECEPATAN', 860, 110, TXT)
    show('bisa', 'bisa memenangkan', 970, 56, (200, 198, 190), font_='xb')
    show('pertempuran', 'PERTEMPURAN', 1070, 100, BLUE)
    show('tapi', 'tapi belum tentu', 1230, 56, (200, 198, 190), n=2, font_='xb')
    show('memenangkan', 'memenangkan', 1310, 56, (200, 198, 190), n=2, font_='xb')
    show('perang', 'PERANG.', 1440, 130, RED, n=3)
    if t >= wt('perang', 3):
        k = eout((t - wt('perang', 3)) / 0.3)
        icon_tank(d, W / 2 * SS, 1640 * SS, 70, col=mix(BLACK, RED, k))

def shake_at(t):
    sx = sy = 0
    for tt, amp in ((wt('blitzkrieg'), 16), (wt('titik'), 10), (wt('menghantam', 2), 7), (wt('menghantam', 2) + 0.44, 7)):
        if tt <= t < tt + 0.35:
            k = 1 - (t - tt) / 0.35
            sx += math.sin(t * 90) * amp * k; sy += math.cos(t * 77) * amp * k
    return sx, sy

def frame(t):
    img = Image.new('RGB', (W * SS, H * SS)); d = ImageDraw.Draw(img)
    v = View(t, shake_at(t))
    draw_map(img, d, v, t)
    scene_hook(img, d, v, t)
    scene_before(img, d, v, t)
    d = scene_doctrine(img, d, v, t) or d
    scene_poland(img, d, v, t)
    scene_france(img, d, v, t)
    scene_dunkirk(img, d, v, t)
    d = scene_ussr(img, d, v, t) or d
    img = img.convert('RGBA')
    img.alpha_composite(VIG)
    d = ImageDraw.Draw(img)
    scene_outro(img, d, v, t); d = ImageDraw.Draw(img)
    header(d, t)
    captions(d, t)
    # footnote
    if t < T_OUT:
        d.text((W / 2 * SS, 1880 * SS), 'peta ilustrasi • perbatasan disederhanakan', font=font('semi', 20), fill=(120, 124, 122), anchor='mm')
    # white flash on the title slam
    tb = wt('blitzkrieg')
    if tb <= t < tb + 0.12:
        fl = Image.new('RGBA', img.size, (255, 250, 230, int(170 * (1 - (t - tb) / 0.12)))); img.alpha_composite(fl)
    return img.convert('RGB').reduce(SS)

if __name__ == '__main__':
    import os
    mode = sys.argv[2]
    if mode == 'still':
        for ts in sys.argv[3:]:
            frame(float(ts)).save(f'{ROOT}/work/still_{float(ts):05.2f}.png')
    else:
        FPS = 30; i0, i1 = int(sys.argv[3]), int(sys.argv[4])
        out = sys.stdout.buffer
        for i in range(i0, i1):
            out.write(frame(i / FPS).tobytes())
