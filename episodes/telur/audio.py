# Mitos Rumahan: telur bopeng (tanpa CTA). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 91,04 dtk mentah, ~1.357 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (188/188 kata, merge.json: tiga puluh -> 30, lima belas -> 15, lima -> 5).
# Sinkron: tools/sync/tighten.py --target 70 --keep 0.22 --max-tempo 1.15 (70,74 dtk) -> mapwords.py -> snaponset.py -> align_scribe.py.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0):
    return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 18)]
END = WD[-1]['e'] + .6
K13 = W(13, 'diketuk') - .08
noise = lambda dur, f=900, dec=22: hp(rng.standard_normal(int(dur * SR)), f) * np.exp(-T(int(dur * SR)) * dec)
def crack(g=1.0):                # kulit telur retak
    n = int(.07 * SR); t = T(n); return (hp(rng.standard_normal(n), 2500) * np.exp(-t * 70) + np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 90) * .3) * .6 * g
def peel(dur=.3):                # kulit dicabut (sobek lengket)
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 900, 5000) * np.sin(np.pi * np.clip(t / dur, 0, 1)) * (0.6 + .4 * (rng.random(n) > .9)) * .35
def squelch():
    n = int(.3 * SR); t = T(n); return lp(rng.standard_normal(n), 900) * np.exp(-t * 9) * (0.6 + .4 * np.sin(2 * np.pi * 30 * t)) * .45
def stream(dur, g=1.0):          # air keran
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 600, 4000) * np.minimum(1, t / .1) * np.minimum(1, (dur - t) / .15) * .22 * g
def bubbles(dur, rate=10, g=1.0):  # air mendidih
    out = np.zeros(int(dur * SR)); k = 0
    while True:
        at = k / rate + rng.random() * .05
        if at > dur - .2: break
        n = int(.09 * SR); t = T(n); f = 260 + rng.random() * 400; b = np.sin(2 * np.pi * np.cumsum(f * (1 + 3 * t)) / SR) * np.exp(-t * 40) * .3
        i = int(at * SR); out[i:i + n] += b[:len(out) - i]; k += 1
    return out * g
def knock(f=900):
    n = int(.08 * SR); t = T(n); return (np.sin(2 * np.pi * f * t) * .7 + lp(rng.standard_normal(n), 3000) * .5) * np.exp(-t * 70)
def trombone():                  # wah-wah gagal
    out = []
    for f, d in ((233, .22), (220, .22), (207, .22), (196, .55)):
        n = int(d * SR); t = T(n); vib = 1 + .02 * np.sin(2 * np.pi * 6 * t) * (t > .2)
        x = sum(np.sin(2 * np.pi * f * h * vib * t) / h for h in (1, 2, 3)) * env(n, .02, d * 3, 2) * .25; out.append(x)
    return np.concatenate(out)
def buzz(dur):                   # lalat
    n = int(dur * SR); t = T(n); return np.sign(np.sin(2 * np.pi * (180 + 20 * np.sin(2 * np.pi * 7 * t)) * t)) * .05 * np.minimum(1, t / .1)
def fizz(dur):                   # soda dibuka
    n = int(dur * SR); t = T(n); return hp(rng.standard_normal(n), 4000) * (rng.random(n) > .7) * np.exp(-t * 2) * .3

# transisi
for tt in (B[2], B[3], B[4], B[5], B[6], B[8], B[9], B[10], B[11], B[12], B[13], K13, B[14], B[17]): place(sfx, whoosh(.36), tt - .22, .3)
# 0 HOOK: kulit dicabut berulang (sama dengan peelHands: periode 1,05 dtk, cabut di 0..0,58)
k = 0
while k * 1.05 < B[2]: place(sfx, peel(.4), k * 1.05 + .05, .45); place(sfx, crack(.6), k * 1.05 + .02, .35); k += 1
place(sfx, pop(700), W(0, '5'), .4); place(sfx, boing(110, .6), W(0, 'bopeng'), .4); place(sfx, sparkle_sfx(), W(0, 'bulan'), .25)
# 1 angan-angan bazar
place(sfx, chime(990, .9), W(1, 'besok', -.05), .25); place(sfx, pop(880), W(1, '30'), .4)
for i in range(5): place(sfx, pop(700 + i * 90), W(1, 'balado') + i * .07, .2)
place(sfx, chime(1568, .5), W(1, 'balado', .3), .2)
# 2 paling segar, tadi pagi
place(sfx, sparkle_sfx(), W(2, 'segar'), .35); place(sfx, chime(1760, .7), W(2, 'segar'), .25); place(sfx, pop(640), W(2, 'pagi'), .35)
# 3 close-up: nempel, kecabut
place(sfx, crack(), W(3, 'dikupas'), .6); place(sfx, peel(.6), W(3, 'kulitnya'), .5); place(sfx, squelch(), W(3, 'nempel'), .7)
place(sfx, peel(.25), W(3, 'kecabut', -.05), .8); place(sfx, crack(1.2), W(3, 'kecabut'), .7); place(sfx, boing(150, .4), W(3, 'kecabut', .1), .3)
# 4 trik 1: HP, gelinding, retak
place(sfx, pop(1000), W(4, 'trik'), .3); place(sfx, chime(2093, .4), W(4, 'internet'), .2)
place(sfx, lp(rng.standard_normal(int((W(4, 'semua') + .3 - W(4, 'digelindingin')) * SR)), 400) * .25, W(4, 'digelindingin'), .5)
for h in (W(4, 'retak'), W(4, 'retak', .2), W(4, 'semua')): place(sfx, crack(1.1), h, .7)
# 5 Bopeng. (gagal)
place(sfx, trombone(), B[5] + .02, .55)
# 6 trik 2: keran
place(sfx, pop(1000), W(6, 'kedua'), .3); place(sfx, stream(B[8] - W(6, 'dikupas', -.2)), W(6, 'dikupas', -.2), .6)
# 7 bopeng lagi, basah kuyup
place(sfx, boing(120, .5), W(7, 'bopeng'), .35); place(sfx, noise(.7, 300, 5) * .8, W(7, 'basah', -.05), .6); place(sfx, thud(70, .3, .6), W(7, 'basah'), .3)
for i in range(5): place(sfx, pop(1500 + i * 120) * .5, W(7, 'kuyup') + i * .18, .2)
# 8 Rani lewat, kena cacar
for i in range(4): place(sfx, pop(420 + i * 30), W(8, 'lewat') + i * .22, .15)
place(sfx, pop(700), W(8, 'ngintip'), .3)
for i in range(4): place(sfx, pop(520 + i * 60), W(8, 'cacar', .05) + i * .16, .35)
# 9 sisa 15, uang habis
place(sfx, pop(760), W(9, '15'), .4); place(sfx, noise(.25, 500, 12), W(9, 'uangnya'), .3); place(sfx, buzz(B[10] - W(9, 'habis')), W(9, 'habis'), .5)
place(sfx, boing(100, .7), W(9, 'habis', .05), .35)
# 10 Ibu pulang, ambil telur dari rak
for i in range(5): place(sfx, pop(380 + (i % 2) * 40), B[10] + .2 + i * .4, .15)
place(sfx, pop(560), W(10, 'lihat'), .3); place(sfx, pop(900), W(10, 'ambil'), .35); place(sfx, sparkle_sfx(), W(10, 'seminggu'), .3); place(sfx, chime(1568, .6), W(10, 'seminggu'), .25)
# 11 Bu, itu telur lama!
place(sfx, boing(200, .4), W(11, 'lama'), .35)
# 12 mendidih, diturunin pelan
place(sfx, bubbles(B[13] - W(12, 'tunggu'), 6), W(12, 'tunggu'), .35); place(sfx, bubbles(K13 - W(12, 'mendidih'), 14), W(12, 'mendidih'), .45)
place(sfx, chime(660, 1.2) * .6, W(12, 'pelanpelan', .4), .25)
# 13a matang, air dingin
place(sfx, chime(2093, .9), W(13, 'matang'), .35); place(sfx, hp(rng.standard_normal(int(.9 * SR)), 2000) * np.exp(-T(int(.9 * SR)) * 3) * .5, W(13, 'dingin'), .5)
# 13b tok, lepas utuh, mulus
place(sfx, knock(1100), W(13, 'diketuk'), .8); place(sfx, crack(.8), W(13, 'diketuk', .02), .5)
place(sfx, whoosh(.5), W(13, 'lepas', -.1), .45); place(sfx, sparkle_sfx(), W(13, 'mulus'), .5); place(sfx, chime(1568, .9), W(13, 'mulus'), .35)
# 14 lup: gas, lem
place(sfx, riser(.6), B[14] - .3, .2); place(sfx, pop(900), B[14] + .1, .45)
for i in range(4): place(sfx, pop(1200 + i * 150) * .6, W(14, 'gas') + i * .12, .25)
place(sfx, squelch(), W(14, 'lengket'), .7); place(sfx, boing(140, .5), W(14, 'lem'), .4)
# 15 lup: gas kabur lewat pori, soda
for i in range(6): place(sfx, pop(1400 + i * 100) * .5, W(15, 'kabur') + i * .16, .25)
place(sfx, pop(500), W(15, 'soda', -.1), .4); place(sfx, noise(.15, 3000, 30), W(15, 'dibiarin'), .5); place(sfx, fizz(1.4), W(15, 'dibiarin', .05), .5)
# 16 lup: mendidih, langsung matang
place(sfx, bubbles(1.5, 14), W(16, 'mendidih'), .45); place(sfx, sparkle_sfx(), W(16, 'mateng'), .35); place(sfx, chime(2093, .8), W(16, 'nempel', .1), .3)
# 17 ludes -> whip kembali ke frame 0
place(sfx, pop(760), W(17, 'ludes'), .45); place(sfx, chime(1568, .6), W(17, 'ludes', .05), .25)
for i in range(4): place(sfx, noise(.12, 2000, 30), W(17, 'ludes', .2) + i * .1, .25)
place(sfx, whoosh(.7), W(17, 'pertama', .1), .5)
place(sfx, peel(.4), END - 1.0, .4)

# ---- musik ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
sneak(0, B[1], .9)
playful(B[1], B[3], DMAJ, .7, glock_on=False)                   # angan-angan bazar + telur paling segar
sneak(B[3], B[5], .8)
place(music, strings((45, 52, 57), B[6] - B[5], .3), B[5])
sneak(B[6], B[10], .85)
playful(B[10], B[12], DM, .6, stabs=False)
sneak(B[12], B[13], .8)
playful(B[13], B[14], DMAJ, .9)
place(music, strings((50, 57, 62, 65), B[17] - B[14], .25), B[14]); playful(B[14], B[17], DM, .55, stabs=False)
playful(B[17], W(17, 'pertama'), DMAJ, .9)
for k, m in enumerate([62, 66, 69, 74, 78, 81]): place(music, glock(m, .9, .26 + k * .02), W(17, 'ludes', -.2) + k * .12)
sneak(W(17, 'pertama'), END, .9)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
