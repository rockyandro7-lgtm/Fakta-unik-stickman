# Thumbnails built from the exact same assets/palette as the video.
import sys, math
ROOT = sys.argv[1]
sys.argv = [sys.argv[0], ROOT]
sys.path.insert(0, ROOT + '/src')
import render as R
from PIL import Image, ImageDraw, ImageFilter

def view(lon, lat, s, W, H, fy):
    v = R.View.__new__(R.View)
    v.cx, v.cy, v.s = lon * R.K, -lat, s * R.SS
    v.ox, v.oy = W * R.SS / 2, fy * R.SS
    return v

def grad(img, stops):  # stops: list of (y0,y1,a0,a1) vertical darkening
    W2, H2 = img.size
    m = Image.new('L', (1, H2), 0)
    for y in range(H2):
        a = 0
        for y0, y1, a0, a1 in stops:
            yy = y / R.SS
            if y0 <= yy <= y1: a = max(a, int(R.lerp(a0, a1, (yy - y0) / max(1, y1 - y0))))
        m.putpixel((0, y), a)
    m = m.resize((W2, H2))
    ov = Image.new('RGBA', (W2, H2), (6, 9, 12, 255)); ov.putalpha(m)
    img.alpha_composite(ov)

def scene(W, H, v):
    R.W, R.H = W, H
    img = Image.new('RGB', (W * R.SS, H * R.SS)); d = ImageDraw.Draw(img)
    R.draw_map(img, d, v, 0.0)
    # Paris already red-highlighted target, panzer thrust through the Ardennes
    R.arrow(d, v, R.PANZER_RT, 1.0, col=R.RED, w=22)
    R.arrow(d, v, [(3.9, 49.8), (3.2, 49.35), (2.45, 48.95)], 1.0, col=R.RED, w=18)
    pts = [v.ll(*p) for p in R.MAGINOT]
    d.line(pts, fill=R.BLACK, width=18 * R.SS, joint='curve'); d.line(pts, fill=(150, 205, 255), width=10 * R.SS, joint='curve')
    R.label_map(d, v, *R.CITY['Paris'], 'PARIS', 34, dot=True)
    return img.convert('RGBA'), v

def T(d, xy, s, f, fill, anchor='mm', stroke=9):
    d.text((xy[0] * R.SS, xy[1] * R.SS), s, font=f, fill=fill, anchor=anchor, stroke_width=stroke * R.SS, stroke_fill=R.BLACK)

# ---------- vertical 1080x1920 (Shorts) ----------
W, H = 1080, 1920
img, v = scene(W, H, view(3.9, 49.75, 175, W, H, 1180))
grad(img, [(0, 300, 250, 235), (300, 900, 235, 0), (1450, 1920, 0, 250)])
d = ImageDraw.Draw(img)
R.bolt(d, 540 * R.SS, 215 * R.SS, 120, col=R.YEL)
T(d, (540, 430), 'PRANCIS JATUH', R.font('black', 104), R.TXT)
T(d, (540, 600), '6 MINGGU?!', R.font('black', 170), R.YEL, stroke=12)
x, y = v.ll(3.1, 49.95)
R.icon_tank(d, x, y - 40 * R.SS, 70, col=R.RED)
T(d, (540, 1660), 'BLITZKRIEG', R.font('black', 150), R.TXT, stroke=12)
T(d, (540, 1790), 'PERANG KILAT JERMAN • PD II', R.font('xb', 46), R.YEL, stroke=6)
img.convert('RGB').reduce(R.SS).save(ROOT + '/thumbnail_shorts_1080x1920.jpg', quality=93)

# ---------- landscape 1280x720 ----------
W, H = 1280, 720
img, v = scene(W, H, view(0.3, 49.6, 150, W, H, 380))
m = Image.new('L', (W, 1)); [m.putpixel((x, 0), int(max(0, 245 * min(1, 1.25 * (1 - x / 820))))) for x in range(W)]
m = m.resize((W * R.SS, H * R.SS)); ov = Image.new('RGBA', m.size, (6, 9, 12, 255)); ov.putalpha(m); img.alpha_composite(ov)
d = ImageDraw.Draw(img)
x, y = v.ll(3.1, 49.95); R.icon_tank(d, x, y - 30 * R.SS, 52, col=R.RED)
T(d, (60, 150), 'PRANCIS JATUH', R.font('black', 74), R.TXT, anchor='lm', stroke=7)
T(d, (60, 285), '6 MINGGU?!', R.font('black', 118), R.YEL, anchor='lm', stroke=10)
T(d, (60, 450), 'BLITZKRIEG', R.font('black', 96), R.TXT, anchor='lm', stroke=8)
R.bolt(d, (60 + d.textlength('BLITZKRIEG', font=R.font('black', 96)) / R.SS + 50) * R.SS, 450 * R.SS, 55, col=R.YEL)
T(d, (62, 545), 'PERANG KILAT JERMAN • PD II', R.font('xb', 36), R.YEL, anchor='lm', stroke=5)
img.convert('RGB').reduce(R.SS).save(ROOT + '/thumbnail_1280x720.jpg', quality=93)
print('ok')
