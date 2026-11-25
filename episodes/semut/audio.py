# Mitos Rumahan: semut balik lagi padahal sudah disapu (tanpa CTA). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 61,4 dtk mentah, ~892 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (120/120 kata; merge.json: ngelihat -> ngeliat, tebel -> tebal, napus -> ngapus; ~375 kredit).
# Sinkron: tools/sync/tighten.py --keep 0.22 (tanpa atempo, 55,99 dtk) -> mapwords.py -> snaponset.py -> align_scribe.py.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0):
    return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 14)]
END = WD[-1]['e'] + .6
noise = lambda dur, f=900, dec=22: hp(rng.standard_normal(int(dur * SR)), f) * np.exp(-T(int(dur * SR)) * dec)
def swish(dur=.4, g=.7):      # sapu lidi / lap di meja
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 1800, 7000) * np.sin(np.pi * t / dur) ** 1.5 * g
def scurry(dur, g=.08):       # langkah kaki semut: klik-klik halus acak
    out = np.zeros(int(dur * SR)); R = np.random.default_rng(7)
    for k in range(int(dur * 38)): m = int(.006 * SR); place(out, hp(R.standard_normal(m), 4000) * np.exp(-T(m) * 900) * (.4 + .6 * R.random()), R.random() * dur)
    return out * g
def slap():
    n = int(.12 * SR); t = T(n); return bp(rng.standard_normal(n), 800, 7000) * np.exp(-t * 60) * 1.1 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 40) * .4
def laugh():
    out = np.zeros(int(1.3 * SR))
    for i in range(6):
        n = int(.13 * SR); t = T(n); f = 330 - i * 14
        place(out, (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * 2 * f * t)) * env(n, .01, .08, 3) * .4 + lp(rng.standard_normal(n), 2500) * env(n, .005, .05, 4) * .15, i * .18)
    return out
def trombone():
    out = []
    for f, d in ((233, .22), (220, .22), (207, .22), (196, .55)):
        n = int(d * SR); t = T(n); vib = 1 + .02 * np.sin(2 * np.pi * 6 * t) * (t > .2)
        out.append(sum(np.sin(2 * np.pi * f * h * vib * t) / h for h in (1, 2, 3)) * env(n, .02, d * 3, 2) * .25)
    return np.concatenate(out)
def sniff():
    out = np.zeros(int(.6 * SR))
    for i in range(3): n = int(.1 * SR); place(out, bp(rng.standard_normal(n), 2000, 6000) * env(n, .02, .08, 2) * .5, i * .14)
    return out
def levelup():
    out = np.zeros(int(.8 * SR))
    for i, m in enumerate((72, 76, 79, 84)): n = int(.16 * SR); t = T(n); place(out, np.sign(np.sin(2 * np.pi * midi(m) * t)) * env(n, .005, .14, 3) * .18, i * .08)
    return out
def fanhum(dur, g=.12):
    n = int(dur * SR); t = T(n); x = lp(rng.standard_normal(n), 900) * .6 + np.sin(2 * np.pi * 110 * t) * .2
    return x * g * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .2)
def honk():
    out = np.zeros(int(.7 * SR))
    for k, f in enumerate((392, 330)): n = int(.22 * SR); t = T(n); place(out, lp(np.sign(np.sin(2 * np.pi * f * t)), 2500) * env(n, .01, .2, 2) * .3, k * .26)
    return out
def bubbles(dur=.8, n=7):
    out = np.zeros(int(dur * SR)); R = np.random.default_rng(3)
    for k in range(n): place(out, pop(900 + R.random() * 900) * .35, R.random() * dur * .9)
    return out
def kaching():
    out = np.zeros(int(1.0 * SR)); place(out, clang(1800, .5) * .4, 0); place(out, chime(2637, .8) * .6, .08); return out

# langkah semut di adegan dapur samping + meja atas
for a, b, g in ((0, B[1], .1), (B[2], B[4], .08), (B[4], B[5], .09), (B[5], B[7], .07), (B[9], B[11], .06), (W(13, 'soalnya'), END, .1)):
    place(sfx, scurry(b - a + .1, g), a)
# transisi
for tt in (B[1], B[2], B[3], B[5], W(5, 'terus'), B[6], B[7], W(7, 'budi'), B[8], B[9], B[10], B[11], B[12], B[13]):
    place(sfx, whoosh(.36), tt - .22, .3)
place(sfx, waves(1.2) * .5, B[4] - .3, .3)                      # larut (10 menit kemudian)
# 0 HOOK: tiga sapuan, semut terlempar, balik lagi
sweeps = [0.0, .55, 1.25]
for k, sk in enumerate(sweeps):
    place(sfx, swish(.42), max(0, sk), .75)
    for j in range(4): place(sfx, pop(900 + j * 120) * .4, max(0, sk) + .08 + j * .08, .3)
place(sfx, boing(160, .4), W(0, 'balik'), .35); place(sfx, thud(90, .25, .6), W(0, 'sama'), .4)
# 1 Rani ngakak, semut dendam
place(sfx, laugh(), W(1, 'ngakak', -.05), .7); place(sfx, laugh(), W(1, 'bud'), .4)
place(sfx, thud(70, .3, .7), W(1, 'dendam'), .45); place(sfx, noise(.8, 300, 3) * .35, W(1, 'dendam', .05), .3)
# 2 level 2, tepok satu-satu
place(sfx, levelup(), W(2, 'naik'), .5)
for tt in (W(2, 'semutnya', .1), W(2, 'ditepok', .15), W(2, 'satusatu'), W(2, 'satusatu', .42)): place(sfx, slap(), tt, .55); place(sfx, boing(300, .25), tt + .05, .15)
# 3 masih datang? kipas angin
place(sfx, boing(240, .35), W(3, 'datang'), .3); place(sfx, levelup(), W(3, 'kipas'), .45); place(sfx, pop(500), W(3, 'kipas'), .3)
place(sfx, fanhum(B[4] - W(3, 'dinyalain') + .2), W(3, 'dinyalain'), .6)
place(sfx, whoosh(.9), W(3, 'semua', -.1), .55); place(sfx, noise(1.2, 1500, 2.5) * .5, W(3, 'semua'), .4)
for k in range(8): place(sfx, pop(1200 + k * 70) * .35, W(3, 'semua') + k * .07, .3)
# 4 sepuluh menit kemudian, garis sama persis
for k in range(6): place(sfx, tick(), W(4, 'sepuluh') + k * .26, .4)
place(sfx, chime(1046, .5), W(4, 'barisan'), .25)
place(sfx, noise(.5, 2500, 4) * .3, W(4, 'garisnya'), .3); place(sfx, chime(1568, .6), W(4, 'persis'), .4)
for k in range(3): place(sfx, pop(700 + k * 150), W(4, 'persis') + k * .1, .3)
# 5 Ibu lewat, lap sekali, toples ditutup
for k in range(4): place(sfx, thud(140, .12, .5), B[5] + k * .22, .25)
place(sfx, swish(1.4, .8), W(5, 'ngelap'), .7); place(sfx, bubbles(1.2, 9), W(5, 'air'), .6)
place(sfx, clang(1400, .25) * .6, W(5, 'toples', .15), .5); place(sfx, chime(1318, .5), W(5, 'gula'), .3)
# 6 berhenti, muter-muter, bingung
place(sfx, sniff(), W(6, 'berhenti'), .5); place(sfx, boing(200, .3), W(6, 'berhenti'), .25)
place(sfx, whoosh(.5), W(6, 'mutermuter'), .3); place(sfx, whoosh(.5, False), W(6, 'mutermuter', .5), .3); place(sfx, boing(330, .5), W(6, 'bingung'), .35)
# 7 bubar, Budi melongo
for k in range(10): place(sfx, pop(600 + k * 90) * .4, W(7, 'bubar') + k * .05, .3)
place(sfx, trombone(), W(7, 'melongo'), .35); place(sfx, clang(300, .4) * .4, W(7, 'melongo', .35), .3)
# 8 bukan mata, tapi nyium
place(sfx, thud(80, .25, .6), W(8, 'nggak'), .4); place(sfx, sniff(), W(8, 'nyium'), .6); place(sfx, riser(1.2) * .6, W(8, 'nyium'), .3); place(sfx, chime(1568, .6), W(8, 'jalan', 0, 1), .3)
# 9 semut pertama, jejak bau
place(sfx, sparkle_sfx(), W(9, 'gula'), .45); place(sfx, chime(1318, .5), W(9, 'pertama'), .3)
place(sfx, waves(2.0) * .4, W(9, 'ninggalin'), .3); place(sfx, chime(880, .6), W(9, 'sarang'), .3)
# 10 makin tebal, jalan tol
for k in range(5): place(sfx, pop(500 + k * 100) * .5, W(10, 'nambahin') + k * .1, .3)
place(sfx, sparkle_sfx(), W(10, 'tebal'), .35); place(sfx, honk(), W(10, 'tol'), .5); place(sfx, kaching(), W(10, 'tol', .3), .35)
# 11 disapu, jalan masih ada
place(sfx, swish(.7, .9), W(11, 'disapu', -.05), .7); 
for k in range(6): place(sfx, pop(1100 + k * 90) * .35, W(11, 'disapu') + .1 + k * .06, .3)
place(sfx, sparkle_sfx(), W(11, 'tetap'), .45)
# 12 air sabun, putus
place(sfx, swish(1.0, .8), W(12, 'air'), .6); place(sfx, bubbles(1.0, 8), W(12, 'sabun'), .55)
place(sfx, thud(70, .35, .8), W(12, 'putus'), .55); place(sfx, clang(400, .5) * .5, W(12, 'putus'), .35)
# 13 telat tahu, kembali ke awal
place(sfx, trombone(), W(13, 'telat'), .35)
for sk in (-.85, -1.55, -2.25):   # sapuan di shot loop (tl = t - END + 1/30)
    tt = END - 1 / 30 + sk
    if tt > W(13, 'soalnya'): place(sfx, swish(.42), tt, .6)

# ---- musik ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[2], DM, .8)
playful(B[2], B[4], DMAJ, .8)
sneak(B[4], B[8], .8)
place(music, strings((50, 57, 62, 66), B[10] - B[8], .22), B[8])
playful(B[10], B[11], DMAJ, .75, stabs=False)
sneak(B[11], B[13], .75)
playful(B[13], END, DM, .8)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
