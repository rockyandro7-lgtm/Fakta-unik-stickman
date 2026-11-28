# Mitos Rumahan: bawang goreng gosong di piring (carryover cooking), tanpa CTA. Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 54,4 dtk mentah, ~835 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (113/113 kata, merge.json kosong; ~332 kredit).
# Sinkron: tools/sync/tighten.py --keep 0.22 (tanpa atempo, 49,66 dtk) -> mapwords.py -> snaponset.py -> align_scribe.py.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0):
    return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 13)]
END = WD[-1]['e'] + .6
def sizzle(dur, g=1.0, dens=1.0):
    n = int(dur * SR); t = T(n); base = hp(rng.standard_normal(n), 3000) * (.35 + .15 * np.sin(2 * np.pi * 3 * t))
    cr = np.zeros(n)
    for k in range(int(dur * 60 * dens)): i = int(rng.random() * (n - 400)); cr[i:i + 300] += rng.standard_normal(300) * np.exp(-np.arange(300) / 40) * .8
    fade = np.minimum(1, t / .08) * np.minimum(1, (dur - t) / .15)
    return (base + hp(cr, 1500)) * fade * .35 * g
def knob():
    n = int(.08 * SR); return bp(rng.standard_normal(n), 1500, 5000) * env(n, .001, .05, 4) * .6
def plop():
    n = int(.25 * SR); t = T(n); f = 180 * np.exp(-t * 8) + 90; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .003, .2, 3) * .6 + bp(rng.standard_normal(n), 800, 3000) * env(n, .001, .05, 4) * .3
def smoke(dur):
    n = int(dur * SR); t = T(n); return lp(rng.standard_normal(n), 900) * np.sin(np.pi * t / dur) * .35
def trombone():
    out = []
    for f, d in ((233, .22), (220, .22), (207, .22), (196, .55)):
        n = int(d * SR); t = T(n); vib = 1 + .02 * np.sin(2 * np.pi * 6 * t) * (t > .2)
        out.append(sum(np.sin(2 * np.pi * f * h * vib * t) / h for h in (1, 2, 3)) * env(n, .02, d * 3, 2) * .25)
    return np.concatenate(out)
def laugh():
    out = np.zeros(int(1.2 * SR))
    for k in range(5):
        n = int(.14 * SR); t = T(n); f = 520 - k * 30; place(out, np.sin(2 * np.pi * f * t) * (.5 + .5 * np.sin(2 * np.pi * 30 * t)) * env(n, .01, .12, 2) * .3, k * .18)
    return out
for tt in B[1:] + [W(12, 'besoknya'), W(12, 'dan')]:
    place(sfx, whoosh(.36), tt - .22, .3)
# 0 hook: sizzle wajan, angkat, plop di piring, mendesis jadi gosong
place(sfx, sizzle(W(0, 'tapi') + .2, 1.0, 1.4), 0, .9); place(sfx, chime(1568, .4), W(0, 'kuning'), .3)
place(sfx, whoosh(.3), W(0, 'tapi') - .05, .5); place(sfx, plop(), W(0, 'tapi') + .14, .7)
place(sfx, smoke(1.4), W(0, 'malah'), .6); place(sfx, thud(70, .4, .7), W(0, 'gosong'), .5)
# 1 Rani ngakak, api besar
place(sfx, laugh(), W(1, 'ngakak'), .7); place(sfx, sizzle(2.0, .6), W(1, 'apinya'), .5); place(sfx, whoosh(.5, False), W(1, 'apinya'), .4)
# 2 api dikecilin, diaduk, gosong lagi
place(sfx, knob(), W(2, 'dikecilin'), .8); place(sfx, sizzle(W(2, 'di') - W(2, 'api'), .5, .8), W(2, 'api'), .7)
for k in range(5): place(sfx, scribble(.18), W(2, 'diaduk') + k * .3, .35)
place(sfx, plop(), W(2, 'di') + .05, .6); place(sfx, smoke(1.2), W(2, 'gosong') - .3, .6); place(sfx, thud(70, .4, .7), W(2, 'gosong'), .45)
# 3 toples arisan
place(sfx, chime(1318, .6), W(3, 'toples'), .4); place(sfx, sparkle_sfx(), W(3, 'arisan'), .3)
# 4 tinggal segenggam
for k in range(6): place(sfx, pop(900 - k * 60), W(4, 'bawangnya') + k * .12, .3)
place(sfx, boing(180, .5), W(4, 'segenggam'), .35)
# 5 Ibu turun tangan, langsung angkat
place(sfx, whoosh(.5), W(5, 'ibu') - .1, .5); place(sfx, sizzle(W(5, 'ngangkat') - W(5, 'ibu') + .4, .7), W(5, 'ibu'), .7)
place(sfx, whoosh(.3), W(5, 'ngangkat'), .5); place(sfx, boing(300, .4), W(5, 'masih'), .3)
# 6 belum mateng
place(sfx, thud(120, .2, .6), W(6, 'bu'), .4)
# 7 berubah emas pelan-pelan
for k in range(10): place(sfx, tick(), W(7, 'pelanpelan') + k * .18, .25)
place(sfx, riser(1.6) * .5, W(7, 'berubah') - .4, .35); place(sfx, chime(1568, .8), W(7, 'emas'), .5); place(sfx, sparkle_sfx(), W(7, 'emas'), .4)
# 8 tetap mateng
place(sfx, sizzle(2.0, .35, .5), W(8, 'tetap'), .5); place(sfx, whoosh(.6), W(8, 'walaupun'), .35)
# 9 dunia mikro: panas tersimpan, minyak nempel, terus masak
place(sfx, riser(1.2) * .5, W(9, 'nyimpan') - .3, .35)
for k in range(6): place(sfx, pop(700 + k * 40), W(9, 'minyak') + k * .14, .35)
place(sfx, sizzle(W(10, 'sama') - W(9, 'nempel'), .8, 1.6), W(9, 'nempel'), .7)
# 10 setrika
place(sfx, knob(), W(10, 'dicabut'), 1.0); place(sfx, pop(500), W(10, 'dicabut') + .05, .4)
place(sfx, sizzle(1.4, .6), W(10, 'bikin'), .6); place(sfx, smoke(1.2), W(10, 'gosong') - .2, .6)
# 11 solusi
place(sfx, whoosh(.3), W(11, 'angkat'), .4); place(sfx, chime(1318, .5), W(11, 'muda'), .4); place(sfx, plop(), W(11, 'matengnya'), .5); place(sfx, chime(1568, .6), W(11, 'piring'), .45)
# 12 arisan selamat, besoknya Budi lagi
place(sfx, sparkle_sfx(), W(12, 'selamat'), .5); place(sfx, chime(2093, .8), W(12, 'selamat'), .3)
place(sfx, sizzle(END - W(12, 'besoknya'), .8, 1.2), W(12, 'besoknya'), .7)
# musik
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[3], DM, .8)
sneak(B[3], B[7], .8)
place(music, strings((50, 57, 62, 66), B[11] - B[7], .22), B[7])
playful(B[11], END, DMAJ, .8)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
