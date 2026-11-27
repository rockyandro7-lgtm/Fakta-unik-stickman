# Mitos Rumahan: gelas es teh "bocor" = embun (tanpa CTA). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 60,2 dtk mentah, ~889 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (129/129 kata; merge.json: lembab -> lembap; ~368 kredit).
# Sinkron: tools/sync/tighten.py --keep 0.22 (tanpa atempo, 55,5 dtk) -> mapwords.py -> snaponset.py -> align_scribe.py.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0):
    return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 15)]
END = WD[-1]['e'] + .6
noise = lambda dur, f=900, dec=22: hp(rng.standard_normal(int(dur * SR)), f) * np.exp(-T(int(dur * SR)) * dec)
def drip():
    n = int(.12 * SR); t = T(n); f = 1400 * np.exp(-t * 18) + 500; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .1, 3) * .45
def drips(dur, step=.45, g=1.0):
    out = np.zeros(int(dur * SR))
    for k in range(int(dur / step)): place(out, drip(), k * step + (k % 3) * .07, g * (.7 + .3 * (k % 2)))
    return out
def slide(dur=.35):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 300, 1500) * np.sin(np.pi * t / dur) * .5
def clink():
    n = int(.5 * SR); t = T(n); return (np.sin(2 * np.pi * 2350 * t) + .5 * np.sin(2 * np.pi * 3720 * t)) * np.exp(-t * 9) * .35
def pour(dur):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 400, 2500) * (.6 + .4 * np.sin(2 * np.pi * 7 * t)) * np.minimum(1, t / .1) * np.minimum(1, (dur - t) / .1) * .4
def shiver():
    n = int(.6 * SR); t = T(n); return np.sin(2 * np.pi * 300 * t) * (.5 + .5 * np.sin(2 * np.pi * 28 * t)) * env(n, .02, .5, 2) * .25
def trombone():
    out = []
    for f, d in ((233, .22), (220, .22), (207, .22), (196, .55)):
        n = int(d * SR); t = T(n); vib = 1 + .02 * np.sin(2 * np.pi * 6 * t) * (t > .2)
        out.append(sum(np.sin(2 * np.pi * f * h * vib * t) / h for h in (1, 2, 3)) * env(n, .02, d * 3, 2) * .25)
    return np.concatenate(out)
def birds(dur):
    out = np.zeros(int(dur * SR))
    for k in range(int(dur / .5)): place(out, tweet(), k * .5 + (k % 2) * .13, .5)
    return out
for tt in B[1:] + [W(14, 'dan')]:
    place(sfx, whoosh(.36), tt - .22, .3)
# 0 hook: tetes
place(sfx, drips(B[2] + .2, .42), 0, .9); place(sfx, chime(1568, .4), W(0, 'retak'), .3)
# 1 protes
place(sfx, thud(120, .2, .6), W(1, 'bu'), .4)
# 2 ganti gelas
for key, k in (('ganti', 0), ('ganti', 1)): place(sfx, slide(), W(2, key, -.1, k), .6); place(sfx, clink(), W(2, key, .25, k), .5)
place(sfx, drips(1.2, .3), W(2, 'basah'), .7); place(sfx, drips(1.2, .3), W(2, 'basah', 0, 1), .7)
# 3 teh panas, kering
place(sfx, clink(), W(3, 'teh'), .5); place(sfx, chime(1318, .5), W(3, 'kering'), .35)
# 4 tuh kan
place(sfx, boing(260, .4), W(4, 'tuh'), .3)
# 5 sirup
place(sfx, pour(1.6), W(5, 'ngisi'), .7); place(sfx, pop(700), W(5, 'nyengir'), .3)
# 6 merah vs bening
place(sfx, thud(80, .3, .6), W(6, 'ternyata'), .4); place(sfx, sparkle_sfx(), W(6, 'bening'), .35)
# 7 dari udara
place(sfx, whoosh(.6, False), W(7, 'udara'), .4)
# 8 uap
place(sfx, riser(1.6) * .5, W(8, 'penuh'), .3); place(sfx, sparkle_sfx(), W(8, 'uap'), .3)
# 9 dingin, titik air, nempel
place(sfx, shiver(), W(9, 'dingin'), .6); place(sfx, pop(1100), W(9, 'titik'), .5)
for k in range(8): place(sfx, pop(900 + k * 60) * .6, W(9, 'nempel') + k * .1, .35)
# 10 rumput pagi
place(sfx, birds(2.2), B[10], .5)
# 11 panas, memantul
for k in range(4): place(sfx, boing(400 + k * 30, .3), W(11, 'gelas') + .5 + k * .7, .2)
place(sfx, chime(1318, .5), W(11, 'kering'), .3)
# 12 makin lembap
place(sfx, riser(1.4) * .5, W(12, 'makin'), .3); place(sfx, drips(1.4, .22), W(12, 'makin', 0, 1), .7)
# 13 tatakan
place(sfx, slide(.5), W(13, 'kasih'), .6); place(sfx, chime(1568, .6), W(13, 'tatakan'), .45)
# 14 malu, pesan lagi
place(sfx, trombone(), W(14, 'malu'), .3); place(sfx, pop(800), W(14, 'pesan'), .3)
place(sfx, slide(), END - 1.0, .6); place(sfx, clink(), END - .5, .5); place(sfx, drips(.6, .2), END - .4, .8)
# musik
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[5], DM, .8)
sneak(B[5], B[8], .8)
place(music, strings((50, 57, 62, 66), B[13] - B[8], .22), B[8])
playful(B[13], END, DMAJ, .8)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
