# Mitos Rumahan: lomba iris bawang (v2, versi cerita, tanpa CTA). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 78,96 dtk mentah). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (162/162 kata).
# Sinkron: tools/sync/tighten.py --target 62 --keep 0.26 --max-tempo 1.12 (65,75 dtk) -> mapwords.py -> snaponset.py -> align_scribe.py.
from audio_lib import *
import json, math
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0):
    return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 17)]
END = WD[-1]['e'] + .6
SHF = 2 * math.pi * round(7.5 * END / (2 * math.pi)) / END
noise = lambda dur, f=900, dec=22: hp(rng.standard_normal(int(dur * SR)), f) * np.exp(-T(int(dur * SR)) * dec)
def srek(dur=.36):   # pisau digesek di batu asah
    n = int(dur * SR); t = T(n); x = bp(rng.standard_normal(n), 2200, 7500) * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** .8
    return x * (0.7 + .3 * np.sin(2 * np.pi * 38 * t)) * .9
def chop(f=1300):    # pisau menghantam talenan
    n = int(.1 * SR); t = T(n); return (np.sin(2 * np.pi * f * t) * .6 + np.sin(2 * np.pi * f * .52 * t) * .5) * np.exp(-t * 60) + lp(rng.standard_normal(n), 2500) * np.exp(-t * 90) * .6
def sret(dur=.3):    # irisan bersih pisau tajam
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 3500, 9000) * np.exp(-((t - dur * .35) / (dur * .25)) ** 2) * .7
def drip(f=1500):
    n = int(.14 * SR); t = T(n); fr = f * (1 + 1.2 * t * 8); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 35) * .6
def splat():
    out = np.zeros(int(.5 * SR)); place(out, thud(70, .3, .9), 0); place(out, lp(rng.standard_normal(int(.35 * SR)), 1800) * np.exp(-T(int(.35 * SR)) * 9), 0, .8)
    for i in range(6): place(out, drip(700 + i * 90) * .6, .08 + i * .04)
    return out
def hiss(dur=1.0, g=1.0):
    n = int(dur * SR); t = T(n); return hp(rng.standard_normal(n), 3000) * np.minimum(1, t / .05) * np.minimum(1, (dur - t) / .25) * .5 * g
def crunch(dur=.5):
    out = np.zeros(int(dur * SR))
    for i in range(14): place(out, hp(rng.standard_normal(int(.03 * SR)), 1800) * np.exp(-T(int(.03 * SR)) * 90) * (1 - i / 16), i * dur / 16)
    return out
def water(dur):
    n = int(dur * SR); t = T(n); x = bp(rng.standard_normal(n), 600, 4000) * (0.6 + .4 * np.sin(2 * np.pi * 7 * t) ** 2)
    return x * np.minimum(1, t / .1) * np.minimum(1, (dur - t) / .1) * .35
def chops(t0, t1, P, start=None):   # hantaman pisau di fase .3 (sama dengan chopY di shots.js); origin t0, hanya yang >= start
    k = 0
    while t0 + (k + .3) * P < t1:
        h = t0 + (k + .3) * P
        if start is None or h >= start: place(sfx, chop(1200 + (k % 3) * 120), h, .55)
        k += 1
def sreks(t0, t1):
    k = math.ceil(t0 * SHF / math.pi)
    while k * math.pi / SHF < t1:
        place(sfx, srek(math.pi / SHF * .95), k * math.pi / SHF, .5); k += 1

# ---- jadwal (sama dengan shots.js) ----
TB0 = W(3, 'ngebut', .25)
# transisi
for tt in (B[1], B[2], B[3], B[4], B[6], B[7], B[8], B[9], B[10], B[13], B[15], B[16]): place(sfx, whoosh(.36), tt - .22, .3)
for tt in (B[5], B[14]): place(sfx, chime(990, .7), tt - .05, .14)
place(sfx, riser(.9), B[11] - .8, .3); place(sfx, whoosh(.6), B[11] - .35, .4)          # match masuk ke bawang
# 0 HOOK: srek srek di frame 0, jam berputar, bawang bosan
sreks(0, B[1]); sreks(B[1], B[3]); sreks(B[4], B[5])
for i in range(10): place(sfx, tick(), W(0, 'lima') + i * .07, .35)
place(sfx, pop(700), W(0, 'lima'), .45); place(sfx, boing(110, .5), W(0, 'bawang', .1), .25)
# 1 ketawa + tunas tumbuh
for i in range(4): place(sfx, pop(520 + i * 60), W(1, 'ketawa') + i * .16, .35)
place(sfx, riser(.5), W(1, 'tumbuh', -.3), .2); place(sfx, boing(260, .6), W(1, 'tumbuh'), .5); place(sfx, sparkle_sfx(), W(1, 'tumbuh', .1), .3)
# 2 taruhan
place(sfx, whoosh(.4), W(2, 'taruhan', -.2), .35); place(sfx, pop(640), W(2, 'taruhan'), .5)
for k in ('sekilo', 'bebas', 'seminggu'): place(sfx, pop(560), W(2, k, -.05), .4)
place(sfx, clang(1400, .5), W(2, 'cuci'), .25); place(sfx, clang(1250, .5), W(2, 'cuci', .08), .2)
# 3 pisau tumpul, ngebut
place(sfx, boing(90, .6), W(3, 'tumpul'), .35)
chops(TB0, B[4], .2)
# 4 Ibu masih ngasah
place(sfx, pop(880), B[4] + .05, .35)
# 5 sepuluh iris, mata panas
place(sfx, pop(700), W(5, 'sepuluh'), .5); place(sfx, chime(1320, .5), W(5, 'sepuluh', .05), .2)
place(sfx, riser(.7), W(5, 'mata'), .15); place(sfx, boing(150, .5), W(5, 'panas'), .3)
# 6 dua puluh iris, air mata netes
chops(TB0, B[7], .22, B[6])
place(sfx, pop(760), W(6, 'dua'), .5)
for i in range(5): place(sfx, drip(1400 + i * 60), W(6, 'netes') + i * .32, .35)
# 7 Ibu mulai pelan
place(sfx, chime(784, .9), W(7, 'pelan'), .2)
for h in (W(7, 'iris', 0, 0) - .05, W(7, 'iris', 0, 1) - .05): place(sfx, sret(), h - .08, .6); place(sfx, chop(900), h, .25)
# 8 gagal palsu: Budi unggul, merem
chops(TB0, B[9], .26, B[8])
for h in (B[8] + .3, B[8] + 1.3, B[8] + 2.3, B[8] + 3.3): place(sfx, sret(), h - .08, .35)
place(sfx, pop(600), W(8, 'merem'), .4)
# 9 meler, meleset (SPLAT), ngelap
place(sfx, boing(200, .4), W(9, 'meler'), .3)
chops(B[9], W(9, 'meleset', -.3), .3)
place(sfx, splat(), W(9, 'meleset'), .9)
place(sfx, noise(.5, 1500, 4) * .6, W(9, 'berhenti', .15), .3); place(sfx, noise(.5, 1500, 4) * .6, W(9, 'ngelap'), .3)
# 10 Ibu kering, menyalip
for h in (B[10] + .2, B[10] + .9, W(10, 'tumpukannya', -.1), W(10, 'tumpukannya', .45), W(10, 'tinggi', -.2), W(10, 'tinggi', .35)): place(sfx, sret(), h - .08, .45)
chops(B[10], B[11] - .3, .5)
place(sfx, chime(1568, .8), W(10, 'kering'), .3); place(sfx, sparkle_sfx(), W(10, 'tinggi'), .3)
# 11 dunia sel: dua bahan dipisah, stik glow
for i in range(6): place(sfx, pop(500 + i * 70), W(11, 'dua') + i * .06, .3)
place(sfx, chime(660, 1.0), W(11, 'dipisah'), .25); place(sfx, pop(900), W(11, 'stik'), .4); place(sfx, chime(1046, .6), W(11, 'glow'), .2)
place(sfx, noise(.4, 600, 6) * .4, W(11, 'dipatahkan'), .2)
# 12 KRAK, bercampur, gas, mata perih
tp = W(12, 'pecah'); place(sfx, crunch(.35), tp, 1.0); place(sfx, clang(700, .5), tp, .35); place(sfx, thud(55, .6, 1.0), tp, .7); place(sfx, sparkle_sfx(), tp + .1, .35)
for i in range(8): place(sfx, pop(450 + (i % 4) * 110), W(12, 'bercampur') + i * .07, .3)
place(sfx, hiss(1.6), W(12, 'gas', -.1), .45); place(sfx, riser(W(12, 'mata') - W(12, 'gas')), W(12, 'gas'), .2)
place(sfx, chime(1661, .9), W(12, 'perih'), .3); place(sfx, chime(1760, .9), W(12, 'perih'), .3)
for i in range(4): place(sfx, drip(1300 + i * 80), W(12, 'perih', .2) + i * .25, .3)
# 13 slow-mo meremas + semprot
place(sfx, thud(45, .8, .8), W(13, 'meremas'), .6); place(sfx, lp(rng.standard_normal(int(.9 * SR)), 700) * np.exp(-T(int(.9 * SR)) * 3), W(13, 'meremas'), .5)
place(sfx, hiss(1.8), W(13, 'menyemprotkan'), .45); place(sfx, riser(1.2), W(13, 'menyemprotkan'), .15)
# 14 makin ngebut, semprotan menembus TINGGI MATA
chops(B[14], B[15], .16)
place(sfx, hiss(2.0, 1.2), B[14] + .1, .35); place(sfx, pop(300), W(14, 'banyak', .1), .5); place(sfx, boing(100, .5), W(14, 'banyak', .15), .3)
# 15 pisau tajam pelan: aman
place(sfx, chime(2093, 1.0), W(15, 'tajam'), .35)
for h in (W(15, 'pelan'), W(15, 'membelah'), W(15, 'membelah', 1.1), W(15, 'semprotannya'), W(15, 'mata', -.1)): place(sfx, sret(), h - .08, .5); place(sfx, chop(900), h, .2)
place(sfx, chime(1568, .8), W(15, 'mata'), .35); place(sfx, sparkle_sfx(), W(15, 'mata', .05), .3)
# 16 Budi cuci piring -> kembali ke Ibu mengasah (loop)
place(sfx, water(W(16, 'dan') - B[16] + .3), B[16], .5)
place(sfx, noise(.5, 1500, 3) * .6, W(16, 'cuci'), .35); place(sfx, clang(1300, .4), W(16, 'piring'), .2)
place(sfx, whoosh(.7), W(16, 'dan', .2), .4)
sreks(END - .9, END)

# ---- musik ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[3], DMAJ, .8, glock_on=False)
sneak(B[3], B[5], .7)
place(music, strings((50, 57, 62), B[7] - B[5], .3), B[5]); sneak(B[5], B[7], .75)
playful(B[7], B[8], DM, .7, glock_on=False)
sneak(B[8], B[10], .8)
playful(B[10], B[11], DMAJ, .85)
place(music, strings((50, 57, 62, 65), B[12] - B[11], .32), B[11]); playful(B[11], B[12], DM, .6, stabs=False)
place(music, strings((50, 56, 62), B[13] - B[12], .35), B[12]); sneak(B[12], B[13], .8)
place(music, strings((45, 52, 57), B[14] - B[13], .3), B[13])
playful(B[14], B[16], DMAJ, .9)
for k, m in enumerate([62, 66, 69, 74, 78, 81]): place(music, glock(m, .9, .26 + k * .02), B[15] + W(15, 'mata') - B[15] - .2 + k * .12)
playful(B[16], END, DMAJ, .9, glock_on=False)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
