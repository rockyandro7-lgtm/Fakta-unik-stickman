# Mitos Rumahan: pisang di kulkas (tanpa CTA). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 77,3 dtk mentah, ~1130 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (154/154 kata; merge.json: tiga belas -> 13, dapat -> dapet, lemes -> lemas, coklat -> cokelat; ~472 kredit).
# Sinkron: tools/sync/tighten.py --keep 0.22 --target 66 (atempo 1,064) -> mapwords.py -> snaponset.py -> align_scribe.py.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0):
    return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 16)]
END = WD[-1]['e'] + .6
noise = lambda dur, f=900, dec=22: hp(rng.standard_normal(int(dur * SR)), f) * np.exp(-T(int(dur * SR)) * dec)
def sting():
    n = int(1.4 * SR); t = T(n); x = sum(np.sin(2 * np.pi * f * t) * a for f, a in ((73.4, 1), (146.8, .5), (220, .3), (293.7, .2))) * np.exp(-t * 2.2)
    out = x * .5; th = thud(55, 1.0, .8); out[:len(th)] += th * .6; return out
def trombone():
    out = []
    for f, d in ((233, .22), (220, .22), (207, .22), (196, .55)):
        n = int(d * SR); t = T(n); vib = 1 + .02 * np.sin(2 * np.pi * 6 * t) * (t > .2)
        out.append(sum(np.sin(2 * np.pi * f * h * vib * t) / h for h in (1, 2, 3)) * env(n, .02, d * 3, 2) * .25)
    return np.concatenate(out)
def ding_cold():
    out = np.zeros(int(1.2 * SR))
    for i, f in enumerate((2637, 3136, 3951)): place(out, chime(f, 1.0) * .5, i * .07)
    return out
def laugh():                     # "wkwkwk" sintetis: denyut vokal
    out = np.zeros(int(1.3 * SR))
    for i in range(6):
        n = int(.13 * SR); t = T(n); f = 330 - i * 14
        place(out, (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * 2 * f * t)) * env(n, .01, .08, 3) * .4 + lp(rng.standard_normal(n), 2500) * env(n, .005, .05, 4) * .15, i * .18)
    return out
def crunch():
    n = int(.25 * SR); return bp(rng.standard_normal(n), 900, 6000) * (np.abs(np.sin(T(n) * 2 * np.pi * 40)) ** 2) * np.exp(-T(n) * 9) * .9
def peel(dur=.35):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 400, 3500) * np.exp(-t * 6) * (.6 + .4 * np.sin(2 * np.pi * 30 * t)) * .55
def squish():
    n = int(.4 * SR); t = T(n); f = 180 * np.exp(-t * 3); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .01, .3, 2) * .5 + lp(rng.standard_normal(n), 800) * env(n, .01, .2, 3) * .3
def shiver(dur=.8):
    n = int(dur * SR); t = T(n); return np.sin(2 * np.pi * 220 * t) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 18 * t))) * env(n, .02, dur, 1) * .15
def brake():
    n = int(.9 * SR); t = T(n); f = 2400 - 600 * t; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .02, .9, 1.5) * .18 + bp(rng.standard_normal(n), 2000, 6000) * env(n, .02, .9, 1.5) * .15
def dishes(k=8):
    out = np.zeros(int(1.0 * SR))
    for i in range(k): place(out, clang(1200 + 90 * (i % 4), .3) * .3, i * .07)
    return out
def faucet(dur):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 600, 5000) * .12 * np.minimum(1, t / .1) * np.minimum(1, (dur - t) / .2)

# transisi
for tt in (B[1], B[2], B[3], W(3, 'separuh', 0, 1), B[4], B[5], B[6], B[7], B[8], B[9], B[10], B[11], W(11, 'di'), W(11, 'sel'), B[12], W(12, 'sama'), B[13], W(13, 'asal'), B[14], B[15], W(15, 'dan')):
    place(sfx, whoosh(.36), tt - .22, .3)
# 0 HOOK: tangan melayang, ambil pisang hitam
place(sfx, pop(700), 0.0, .35); place(sfx, boing(300, .3), W(0, 'pisang', .2), .2); place(sfx, pop(520), W(0, 'budi', .25), .3)
place(sfx, thud(140, .2, .6), W(0, 'ngambil', .2), .4); place(sfx, whoosh(.4), W(0, 'kulitnya'), .3)
place(sfx, sparkle_sfx(), W(0, 'legam'), .4); place(sfx, boing(160, .4), W(0, 'hitam'), .25)
# 1 Rani ngakak, busuk
place(sfx, laugh(), W(1, 'ngakak', -.05), .7); place(sfx, laugh(), W(1, 'itu'), .4)
place(sfx, thud(70, .4, .7), W(1, 'busuk'), .45); place(sfx, trombone(), W(1, 'busuk', .15), .3)
# 2 flashback: sesisir, seminggu lalu
place(sfx, riser(.8), B[2] - .3, .15); place(sfx, sparkle_sfx(), W(2, 'sesisir'), .45); place(sfx, chime(1318, .6), W(2, 'seminggu'), .25)
# 3 meja + kulkas
place(sfx, thud(120, .25, .6), W(3, 'meja', .1), .45); place(sfx, noise(.25, 1500, 10), W(3, 'meja', .1), .3)
place(sfx, clang(700, .3) * .4, W(3, 'lagi', -.1), .3); place(sfx, ding_cold(), W(3, 'lagi', .1), .3); place(sfx, pop(600), W(3, 'kulkas', .1), .35)
place(sfx, thud(90, .3, .6), B[4] - .15, .35)
# 4 hari berlalu, bertotol
for i in range(6): place(sfx, tick(), B[4] + i * (W(4, 'kuning') - B[4]) / 6, .4)
for i in range(5): place(sfx, pop(380 + i * 30) * .6, W(4, 'bertotol') + i * .06, .3)
# 5 kulkas dibuka: hitam semua
place(sfx, clang(700, .3) * .4, W(5, 'kulkas', -.1), .3); place(sfx, noise(.8, 3000, 3) * .5, W(5, 'kulkas'), .3)
place(sfx, sting(), W(5, 'hitam', -.03), .6); place(sfx, noise(1.0, 600, 2) * .4, W(5, 'kebakar'), .35)
# 6 tantangan cuci piring
place(sfx, whoosh(.25) * .6, W(6, 'nantang'), .3); place(sfx, dishes(10), W(6, 'cuci'), .5); place(sfx, boing(120, .5), W(6, 'seminggu'), .35)
# 7 ngupas: krek, dingin, lemas
place(sfx, crunch(), W(7, 'ngupas', .15), .5); place(sfx, ding_cold(), W(7, 'dingin'), .35); place(sfx, shiver(.9), W(7, 'dingin', .1), .5)
place(sfx, boing(110, .6), W(7, 'lemas'), .4); place(sfx, peel(), W(7, 'hitam'), .5)
# 8 spons meluncur
place(sfx, noise(.6, 2500, 4) * .5, W(8, 'piring'), .35); place(sfx, pop(900), W(8, 'spons'), .3); place(sfx, chime(784, .5), W(8, 'dia'), .25)
# 9 pengungkapan
place(sfx, riser(1.1), W(9, 'tapi', -.1), .25); place(sfx, peel(.5), W(9, 'lepas', -.05), .6); place(sfx, sparkle_sfx(), W(9, 'lepas', .1), .5)
place(sfx, chime(2093, 1.0), W(9, 'putih'), .3); place(sfx, thud(160, .15, .6), W(9, 'padat'), .45); place(sfx, thud(160, .15, .6), W(9, 'padat', .17), .45)
# 10 punya Rani lembek
place(sfx, peel(.6), W(10, 'ngupas'), .5); place(sfx, squish(), W(10, 'lembek'), .6); place(sfx, trombone(), W(10, 'cokelat'), .4); place(sfx, squish(), W(10, 'nempel'), .45)
# 11 tropis, termometer turun, sel retak
place(sfx, chime(1046, .7), W(11, 'tropis'), .3)
place(sfx, whoosh(1.2, False), W(11, 'di'), .35); place(sfx, ding_cold(), W(11, '13'), .4); place(sfx, shiver(1.0), W(11, '13', .2), .4)
place(sfx, riser(.5), W(11, 'sel', -.4), .2)
for i in range(4): place(sfx, crunch() * .7, W(11, 'rusak', .05) + i * .1, .35)
# 12 bocor, udara, hitam; apel
for i in range(5): place(sfx, pop(500 + i * 50), W(12, 'bocor') + i * .07, .35)
for i in range(4): place(sfx, pop(1200 + i * 80) * .5, W(12, 'udara', -.2) + i * .1, .3)
place(sfx, thud(60, .5, .6), W(12, 'hitam'), .4); place(sfx, boing(90, .6), W(12, 'hitam', .1), .3)
place(sfx, pop(600), W(12, 'apel'), .35); place(sfx, crunch(), W(12, 'digigit'), .8); place(sfx, noise(.6, 700, 4), W(12, 'cokelat'), .25)
# 13 rem pematangan; mentah vs matang
place(sfx, brake(), W(13, 'ngerem'), .6); place(sfx, thud(80, .3, .7), W(13, 'ngerem'), .35)
place(sfx, boing(120, .4), W(13, 'masuknya'), .3); place(sfx, chime(1568, .6), W(13, 'matang'), .35)
# 14 kulit tua, isi muda
place(sfx, boing(90, .6), W(14, 'tua'), .3); place(sfx, sparkle_sfx(), W(14, 'muda'), .5); place(sfx, chime(2093, 1.0), W(14, 'muda'), .25)
# 15 cuci piring, kembali ke awal
place(sfx, faucet(W(15, 'dan') - B[15]), B[15], .6); place(sfx, dishes(6), W(15, 'cuci'), .45); place(sfx, crunch() * .5, W(15, 'piring'), .3)
place(sfx, whoosh(.8), W(15, 'lagilagi', -.2), .35)

# ---- musik ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[2], DM, .8)
place(music, strings((50, 57, 62, 65), B[3] - B[2], .2), B[2])
playful(B[3], B[5], DMAJ, .75)
sneak(B[5], B[7], .85)
sneak(B[7], B[9], .9)
playful(B[9], B[10], DMAJ, .85)
for k, m in enumerate([62, 66, 69, 74, 78, 81]): place(music, glock(m, .9, .26 + k * .02), W(9, 'lepas', .1) + k * .1)
sneak(B[10], B[11], .75)
place(music, strings((45, 52, 57, 61), B[13] - B[11], .25), B[11])
playful(B[13], B[15], DMAJ, .7, stabs=False)
playful(B[15], END, DM, .8)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
