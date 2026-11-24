# Mitos Rumahan: nyamuk "darah manis" (tanpa CTA). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 60,8 dtk mentah, ~901 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (125/125 kata; merge.json: enggak -> nggak, nelan -> nelen; ~371 kredit).
# Sinkron: tools/sync/tighten.py --keep 0.22 (tanpa atempo, 55,85 dtk) -> mapwords.py -> snaponset.py -> align_scribe.py.
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
def buzz(dur, f=560, g=.12, fade=.25):     # dengung nyamuk: gergaji tipis + vibrato + naik turun (Doppler)
    n = int(dur * SR); t = T(n); fr = f * (1 + .04 * np.sin(2 * np.pi * 7 * t) + .06 * np.sin(2 * np.pi * .9 * t))
    ph = 2 * np.pi * np.cumsum(fr) / SR; x = sum(np.sin(ph * h) / h for h in range(1, 7))
    x = bp(x, 300, 4000) * (.6 + .4 * np.sin(2 * np.pi * 1.3 * t) ** 2)
    return x * g * np.minimum(1, t / fade) * np.minimum(1, (dur - t) / fade)
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
def gulp():
    n = int(.35 * SR); t = T(n); f = 260 * np.exp(-t * 4); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .01, .3, 2) * .6
def slurp(dur=.8):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 700, 3500) * (.5 + .5 * np.sin(2 * np.pi * 14 * t)) * env(n, .05, dur, 1.5) * .45
def sniff():
    out = np.zeros(int(.6 * SR))
    for i in range(3): n = int(.1 * SR); place(out, bp(rng.standard_normal(n), 2000, 6000) * env(n, .02, .08, 2) * .5, i * .14)
    return out
def kaching():
    out = np.zeros(int(1.0 * SR)); place(out, clang(1800, .5) * .4, 0); place(out, chime(2637, .8) * .6, .08); return out

# dengung nyamuk sepanjang adegan teras (bukan di dunia mikro / penjelasan)
for a, b, g in ((0, B[2], .11), (B[2], B[3], .05), (B[6], B[8], .12), (B[9], W(9, 'dari', 0, 1), .06), (W(9, 'dari', 0, 1), B[10], .09), (B[11], B[13], .1), (W(13, 'dan'), END, .11)):
    place(sfx, buzz(b - a + .1, 560 + 40 * (a % 3), g), a)
place(sfx, buzz(B[2] - B[1] + .2, 720, .05), B[1] + .05)      # lapisan kedua (kawanan)
place(sfx, buzz(B[8] - B[6], 690, .06), W(6, 'sepuluh'))
# transisi
for tt in (B[1], B[2], B[3], W(3, 'permen'), B[4], B[5], B[6], B[7], B[8], W(8, 'buat'), B[9], W(9, 'dari', 0, 1), W(10, 'dan'), B[11], B[12], B[13], W(13, 'dan')):
    place(sfx, whoosh(.36), tt - .22, .3)
place(sfx, riser(.9), B[10] - .9, .25)                          # portal ke kulit
# 0 HOOK: tepuk nyamuk
for k in range(5): place(sfx, slap(), .25 + k * .62, .45)
place(sfx, boing(160, .4), W(0, 'budi'), .3); place(sfx, pop(520), W(0, 'cuma'), .3)
# 1 Rani ngakak
place(sfx, laugh(), W(1, 'ngakak', -.05), .7); place(sfx, laugh(), W(1, 'bud'), .4)
place(sfx, sparkle_sfx(), W(1, 'kemanisan'), .35)
for k in range(5): place(sfx, pop(1300 + k * 90) * .5, W(1, 'kebanyakan') + k * .12, .3)
# 2 sumpah
place(sfx, sparkle_sfx(), W(2, 'sumpah'), .45); place(sfx, thud(110, .3, .7), W(2, 'sumpah'), .4)
place(sfx, boing(240, .3), W(2, 'seminggu'), .25); place(sfx, pop(500), W(2, 'manis'), .3); place(sfx, thud(80, .2, .6), W(2, 'manis', .15), .35)
# 3 teh -> air putih, buang permen/kue
place(sfx, noise(1.0, 600, 2) * .3, W(3, 'diganti'), .35); place(sfx, chime(1568, .7), W(3, 'putih'), .3)
place(sfx, pop(700), W(3, 'permen'), .3); place(sfx, pop(600), W(3, 'kue'), .3)
place(sfx, clang(520, .4) * .5, W(3, 'dibuang', -.15), .35)
for k in range(4): place(sfx, thud(140 + k * 15, .15, .5), W(3, 'dibuang', .35) + k * .14, .35)
place(sfx, clang(480, .4) * .5, W(3, 'semua', .35), .3)
# 4 bawang putih tiap pagi
for k in range(6): place(sfx, tick(), W(4, 'tiap') + k * (W(4, 'mentah') - W(4, 'tiap')) / 6, .45)
place(sfx, gulp(), W(4, 'bawang'), .55); place(sfx, boing(110, .5), W(4, 'mentah'), .35); place(sfx, noise(.6, 400, 5) * .4, W(4, 'mentah', .1), .3)
# 5 hari 7, napas bau
place(sfx, chime(1046, .6), W(5, 'hari'), .3); place(sfx, sparkle_sfx(), W(5, 'ketujuh'), .3)
place(sfx, noise(1.2, 300, 2) * .45, W(5, 'napasnya'), .35); place(sfx, trombone(), W(5, 'bau'), .3)
# 6 satu, dua, sepuluh
place(sfx, pop(800), W(6, 'satu'), .35); place(sfx, pop(900), W(6, 'dua'), .35); place(sfx, boing(300, .3), W(6, 'sepuluh'), .3)
for k in range(8): place(sfx, pop(1000 + k * 60) * .5, W(6, 'sepuluh') + k * .07, .3)
for k in range(4): place(sfx, slap(), W(6, 'semuanya') + k * .3, .45)
# 7 Rani nyeruput, nyamuk mengendus lalu pergi
place(sfx, slurp(.8), W(7, 'nyeruput'), .55); place(sfx, sparkle_sfx(), W(7, 'paling'), .35)
place(sfx, sniff(), W(7, 'nggak'), .5); place(sfx, whoosh(.4), W(7, 'digigit', .1), .3); place(sfx, chime(1318, .6), W(7, 'sekalipun', .1), .35)
# 8 mekanisme: darah, telur, bukan gula
place(sfx, chime(880, .6), W(8, 'nyamuk'), .3); place(sfx, slurp(.6) * .8, W(8, 'ngisap'), .5); place(sfx, boing(180, .4), W(8, 'darah', .2), .3)
for k in range(6): place(sfx, pop(700 + k * 70) * .6, W(8, 'telur') + k * .06, .35)
place(sfx, pop(500), W(8, 'nyari'), .3); place(sfx, thud(80, .25, .6), W(8, 'manisnya', .05), .4)
# 9 napas dari jauh, panas + bau dari dekat
place(sfx, waves(1.6) * .4, W(9, 'napas', -.4), .3); place(sfx, sniff(), W(9, 'nyium'), .55); place(sfx, chime(1568, .5), W(9, 'kulit'), .25)
# 10 bakteri + racikan
for k in range(6): place(sfx, pop(500 + k * 70), W(10, 'bakteri') + k * .06, .35)
for k in range(4): place(sfx, pop(300 + k * 40) * .6, W(10, 'kulit') + k * .1, .3)
for k in range(3): place(sfx, clang(900 + k * 150, .3) * .35, W(10, 'racikannya') + k * .25, .35)
place(sfx, sparkle_sfx(), W(10, 'orang'), .4)
# 11 warteg
place(sfx, kaching(), W(11, 'warteg'), .55); place(sfx, sparkle_sfx(), W(11, 'wanginya'), .3)
# 12 favorit, bertahun-tahun
place(sfx, chime(1318, .6), W(12, 'favorit'), .35)
for k in range(3): place(sfx, noise(.25, 2000, 10) * .5, W(12, 'bertahuntahun') + k * .4, .35)
# 13 stop diet, kembali ke awal
place(sfx, slurp(.6), W(13, 'berhenti'), .5); place(sfx, whoosh(.5), W(13, 'diet'), .3); place(sfx, chime(1568, .5), W(13, 'diet'), .3)
for k in range(3): place(sfx, slap(), W(13, 'lagilagi', -.2) + k * .3, .4)

# ---- musik ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[2], DM, .8)
playful(B[2], B[5], DMAJ, .75)
sneak(B[5], B[7], .85)
playful(B[7], B[8], DMAJ, .8)
place(music, strings((50, 57, 62, 66), B[10] - B[8], .22), B[8])
sneak(B[10], B[11], .7)
playful(B[11], B[13], DM, .75, stabs=False)
playful(B[13], END, DM, .8)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
