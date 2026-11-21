# Mitos Rumahan: kepedasan (tanpa CTA). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 68,32 dtk mentah, ~982 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (138/138 kata; merge.json: tiga -> 3, lima -> 5, enggak -> Nggak, pedes -> Pedas; ~417 kredit).
# Sinkron: tools/sync/tighten.py --keep 0.22 (tanpa target, 60,80 dtk) -> mapwords.py -> snaponset.py -> align_scribe.py.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0):
    return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 17)]
END = WD[-1]['e'] + .6
noise = lambda dur, f=900, dec=22: hp(rng.standard_normal(int(dur * SR)), f) * np.exp(-T(int(dur * SR)) * dec)
def gulp(g=1.0):                 # tegukan
    n = int(.22 * SR); t = T(n); f = 140 + 220 * np.exp(-t * 18); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .005, .15, 3) * .6 * g + lp(rng.standard_normal(n), 500) * env(n, .005, .08, 5) * .2
def gulps(dur, rate=4.2, g=1.0):
    out = np.zeros(int(dur * SR)); k = 0
    while k / rate < dur - .2: place(out, gulp(.8 + .2 * (k % 2)), k / rate, g); k += 1
    return out
def flame(dur, g=1.0):           # semburan api (wuss)
    n = int(dur * SR); t = T(n); x = bp(rng.standard_normal(n), 180, 2200) * (1 + .4 * np.sin(2 * np.pi * 9 * t))
    return x * np.minimum(1, t / .05) * np.minimum(1, (dur - t) / .2) * .5 * g
def siren(dur, g=1.0):           # alarm "wiu wiu"
    n = int(dur * SR); t = T(n); f = 820 + 380 * np.sin(2 * np.pi * 2.2 * t); x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * .5
    return lp(x, 3500) * .16 * np.minimum(1, t / .05) * np.minimum(1, (dur - t) / .1) * g
def sizzle(dur, g=1.0):
    n = int(dur * SR); t = T(n); x = hp(rng.standard_normal(n), 3500) * (.6 + .4 * np.abs(np.sin(2 * np.pi * 13 * t)))
    return x * .12 * np.minimum(1, t / .1) * np.minimum(1, (dur - t) / .2) * g
def shutter():                   # cekrek
    a = hp(rng.standard_normal(int(.03 * SR)), 2500) * np.exp(-T(int(.03 * SR)) * 120); out = np.zeros(int(.2 * SR)); place(out, a, 0, .8); place(out, a, .09, .6); return out
def sting():                     # pengungkapan dramatis (dung!)
    n = int(1.4 * SR); t = T(n); x = sum(np.sin(2 * np.pi * f * t) * a for f, a in ((73.4, 1), (146.8, .5), (220, .3), (293.7, .2))) * np.exp(-t * 2.2)
    out = x * .5; th = thud(55, 1.0, .8); out[:len(th)] += th * .6; return out
def splash(dur=.8):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 800, 7000) * np.exp(-t * 4) * .35
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

# transisi
for tt in (B[1], B[2], B[3], B[4], W(4, 'lidahnya'), B[5], B[6], B[8], B[9], B[10], B[11], B[12], B[13], B[14], B[15], B[16], W(16, 'sampai')): place(sfx, whoosh(.36), tt - .22, .3)
# 0 HOOK: tegukan, gelas dibanting, api dari mulut
place(sfx, gulps(W(0, 'air') - .05, 4.5), 0.0, .7)
place(sfx, thud(110, .3, .8), W(0, 'air', .28), .55); place(sfx, clang(900, .4) * .4, W(0, 'air', .28), .25)
place(sfx, flame(1.9), W(0, 'mulut', -.1), .7); place(sfx, sizzle(1.9), W(0, 'mulut'), .5)
place(sfx, boing(160, .4), W(0, 'kebakar'), .3)
# 1 taruhan, seblak level 5, nyerah = kalah
place(sfx, pop(700), W(1, 'taruhan'), .35); place(sfx, chime(1046, .6), W(1, 'rani'), .2)
place(sfx, sizzle(1.5, 1.3), W(1, 'seblak'), .5); place(sfx, sparkle_sfx(), W(1, 'seblak'), .35)
place(sfx, thud(70, .4, .7), W(1, '5'), .45); place(sfx, pop(500), W(1, 'nyerah'), .35); place(sfx, thud(60, .4, .6), W(1, 'kalah'), .4)
# 2 hukuman: HP grup keluarga, notifikasi, foto profil
place(sfx, pop(1200), W(2, 'hukumannya', .1), .35); place(sfx, chime(1568, .4), W(2, 'hukumannya', .2), .3)
place(sfx, chime(1568, .4), W(2, 'jadi', .2), .3); place(sfx, whoosh(.5), W(2, 'profil', -.15), .4); place(sfx, boing(300, .3), W(2, 'profil', .2), .25)
# 3 Rani santai: sesendok, senyum
for h in (W(3, 'sesendok'), W(3, 'sesendok', 0, 1)): place(sfx, clang(1400, .25) * .25, h - .1, .3); place(sfx, gulp(.6), h + .2, .4)
for h in (W(3, 'senyum'), W(3, 'senyum', 0, 1)): place(sfx, sparkle_sfx(), h, .35)
# 4 Budi 3 suap -> lidah: alarm panas
for i, b in enumerate((W(4, 'budi', .05), W(4, 'baru', .05), W(4, '3', .15))): place(sfx, pop(500 + i * 120), b + .2, .45); place(sfx, gulp(.5), b + .35, .3)
place(sfx, boing(120, .5), W(4, 'dan'), .35); place(sfx, riser(.9), W(4, 'dan', -.3), .2)
for i in range(5): place(sfx, pop(260 + i * 40), W(4, 'lidahnya', .2) + i * .1, .4)
place(sfx, siren(B[5] - W(4, 'kerasa') - .1, .7), W(4, 'kerasa'), .5); place(sfx, siren(B[5] - W(4, 'dibakar') - .1, 1.2), W(4, 'dibakar'), .5)
place(sfx, flame(1.0), W(4, 'dibakar'), .5)
# 5 sambar air es, glek
place(sfx, clang(1800, .3) * .4, W(5, 'sambar'), .35); place(sfx, ding_cold(), W(5, 'es'), .35)
place(sfx, gulps(B[6] - W(5, 'segelas'), 4.2), W(5, 'segelas'), .7)
# 6 adem -> 7 dingin hilang, panas balik
place(sfx, ding_cold(), W(6, 'adem'), .45); place(sfx, noise(1.0, 3000, 2) * .4, W(6, 'adem'), .25)
place(sfx, boing(200, .4), W(6, 'sebentar'), .25)
for i in range(6): place(sfx, pop(900 - i * 60) * .5, W(7, 'dinginnya') + i * .12, .2)
place(sfx, siren(B[8] - W(7, 'panasnya') - .1, 1.1), W(7, 'panasnya'), .5); place(sfx, flame(1.2), W(7, 'balik'), .5)
# 8 gelas kedua, ketiga, kembung, tetap pedas
for k in ('kedua', 'ketiga'): place(sfx, gulps(.7, 5), W(8, k, -.2), .55)
place(sfx, thud(110, .3, .7), W(8, 'gelas', -.05, 1), .45); place(sfx, thud(110, .3, .7), W(8, 'perutnya', -.1), .45)
place(sfx, boing(90, .7), W(8, 'kembung'), .55); place(sfx, flame(1.0), W(8, 'pedasnya'), .55); place(sfx, trombone(), W(8, 'tetap'), .45)
# 9 Rani ngelirik, siapin gaya
place(sfx, whoosh(.25) * .6, W(9, 'ngelirik'), .3); place(sfx, chime(784, .5), W(9, 'siapin'), .25); place(sfx, pop(900), W(9, 'foto'), .3)
# 10 angkat tangan ... lihat gelas Rani
place(sfx, riser(1.2), W(10, 'angkat', -.2), .2); place(sfx, whoosh(.5), W(10, 'lihat', -.1), .4); place(sfx, boing(400, .3), W(10, 'gelas'), .25)
# 11 isinya putih. susu.
place(sfx, sparkle_sfx(), W(11, 'putih'), .4); place(sfx, sting(), W(11, 'susu', -.03), .8)
# 12 curang
place(sfx, boing(110, .5), W(12, 'curang'), .45); place(sfx, noise(.4, 1500, 6), W(12, 'curang'), .4)
# 13 aturan
place(sfx, noise(.35, 2500, 8) * .6, W(13, 'aturan', -.2), .4); place(sfx, scribble(), W(13, 'minum'), .4); place(sfx, chime(1318, .5), W(13, 'salah'), .25)
# 14 minyak di piring, disiram air, nggak lepas
place(sfx, pop(400), W(14, 'cabai'), .35)
for i in range(4): place(sfx, pop(300 + i * 30), W(14, 'minyak', -.1) + i * .1, .35)
place(sfx, splash(1.4), W(14, 'air'), .6); place(sfx, noise(1.2, 900, 1.5) * .3, W(14, 'air'), .4)
place(sfx, trombone(), W(14, 'lepas'), .4)
# 15 susu ngiket, dibawa pergi
place(sfx, whoosh(.9), W(15, 'susu', -.1), .45); place(sfx, ding_cold(), W(15, 'beda'), .3)
for i in range(5): place(sfx, pop(700 + i * 60), W(15, 'ngiket') + i * .07, .4)
place(sfx, whoosh(.9), W(15, 'ngebawanya'), .45); place(sfx, sparkle_sfx(), W(15, 'pergi', .2), .5); place(sfx, chime(2093, 1.0), W(15, 'pergi', .2), .3)
# 16 Budi kalah, cekrek, HP, masuk ke foto
place(sfx, trombone(), W(16, 'kalah', -.05), .45); place(sfx, shutter(), W(16, 'kalah', .15), .9)
for i, k in enumerate(('sekarang', 'profil', 'keluarga')): place(sfx, chime(1568 + i * 200, .4), W(16, k, .05), .3)
place(sfx, whoosh(1.2), W(16, 'itu', -.1), .5); place(sfx, gulps(END - W(16, 'dia', .3), 4.5), W(16, 'dia', .3), .5)

# ---- musik ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[2], DM, .8)
sneak(B[2], B[4], .8)
playful(B[4], W(4, 'lidahnya'), DM, .7, stabs=False)
place(music, strings((50, 57, 62, 65), B[5] - W(4, 'lidahnya'), .25), W(4, 'lidahnya'))
sneak(B[5], B[6], .85)
for k, m in enumerate([74, 78, 81, 86]): place(music, glock(m, .9, .25), W(6, 'adem') + k * .09)
sneak(B[7], B[9], .9)
sneak(B[9], B[11], .75)
place(music, strings((45, 52, 57, 61), B[13] - B[11], .3), B[11])
playful(B[13], B[14], DMAJ, .7, stabs=False)
place(music, strings((50, 57, 62, 66), B[15] - B[14], .22), B[14])
playful(B[15], B[16], DMAJ, .85)
for k, m in enumerate([62, 66, 69, 74, 78, 81]): place(music, glock(m, .9, .26 + k * .02), W(15, 'pergi', .1) + k * .1)
sneak(B[16], END, .9)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
