# Mitos Rumahan: kuning telur rebus hijau (tanpa CTA). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 57,5 dtk mentah, ~885 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (123/123 kata; merge.json: serem -> seram; ~351 kredit).
# Sinkron: tools/sync/tighten.py --keep 0.22 (tanpa atempo, 52,24 dtk) -> mapwords.py -> snaponset.py -> align_scribe.py.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0):
    return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 13)]
END = WD[-1]['e'] + .6
noise = lambda dur, f=900, dec=22: hp(rng.standard_normal(int(dur * SR)), f) * np.exp(-T(int(dur * SR)) * dec)
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
def bubbling(dur, g=.25):
    out = np.zeros(int(dur * SR)); R = np.random.default_rng(4)
    for k in range(int(dur * 14)): place(out, pop(300 + R.random() * 500) * .5, R.random() * dur)
    return out * g
def sizzle(dur=.9):
    n = int(dur * SR); t = T(n); return hp(rng.standard_normal(n), 3000) * np.exp(-t * 3) * .5
def crack():
    n = int(.12 * SR); t = T(n); return bp(rng.standard_normal(n), 1500, 6000) * np.exp(-t * 50)
def spooky(dur=1.2):
    n = int(dur * SR); t = T(n); f = 520 + 60 * np.sin(2 * np.pi * 5 * t); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .2, dur, 1.2) * .25
def kaching():
    out = np.zeros(int(1.0 * SR)); place(out, clang(1800, .5) * .4, 0); place(out, chime(2637, .8) * .6, .08); return out
for tt in B[1:] + [W(12, 'besoknya'), W(12, 'setengah')]:
    place(sfx, whoosh(.36), tt - .22, .3)
# 0 hook
place(sfx, boing(150, .5), 0.02, .4); place(sfx, chime(392, .4) * .6, W(0, 'hijau'), .3)
place(sfx, clang(380, .4) * .5, W(0, 'buang'), .45); place(sfx, thud(90, .3, .7), W(0, 'butir'), .4)
# 1 Rani
place(sfx, noise(.9, 300, 3) * .4, W(1, 'busuk'), .4); place(sfx, boing(220, .4), W(1, 'ayamnya'), .3)
# 2 sniff
for k, tt in enumerate((W(2, 'ciumin'), W(2, 'ciumin', .45), W(2, 'satusatu'), W(2, 'satusatu', .4))): place(sfx, sniff(), tt - .1, .45); place(sfx, pop(700 + k * 80), tt + .05, .25)
place(sfx, boing(300, .4), W(2, 'bau'), .3)
# 3 rebus setengah jam
place(sfx, bubbling(B[4] - B[3]), B[3], .5)
for k in range(10): place(sfx, tick(), W(3, 'setengah') + k * .16, .35)
place(sfx, chime(1046, .5), W(3, 'sempurna'), .35)
# 4 makin hijau
place(sfx, crack(), B[4] - .05, .6); place(sfx, trombone(), W(4, 'makin'), .35); place(sfx, spooky(1.0), W(4, 'tebal'), .4)
# 5 Ibu + air es
place(sfx, bubbling(W(5, 'langsung') - B[5]), B[5], .4); place(sfx, whoosh(.5), W(5, 'cemplungin'), .3); place(sfx, sizzle(1.0), W(5, 'cemplungin', .2), .5)
place(sfx, chime(1568, .5), W(5, 'es'), .3)
# 6 kuning cerah
place(sfx, crack(), B[6] - .05, .6); place(sfx, sparkle_sfx(), W(6, 'cerah'), .5); place(sfx, chime(1318, .6), W(6, 'hijaunya'), .3)
# 7 bukan busuk
place(sfx, thud(110, .3, .7), W(7, 'bukan'), .45); place(sfx, pop(800), W(7, 'tanda'), .3); place(sfx, chime(1046, .5), W(7, 'kelamaan'), .3)
# 8 belerang -> gas -> ke tengah
place(sfx, riser(1.2) * .6, W(8, 'kepanasan'), .3)
for k in range(8): place(sfx, pop(500 + k * 60) * .6, W(8, 'belerang') + k * .05, .3)
place(sfx, waves(1.4) * .5, W(8, 'gas'), .3); place(sfx, whoosh(.6), W(8, 'kabur'), .35)
# 9 besi, nempel hijau
for k in range(8): place(sfx, pop(300 + k * 40) * .6, W(9, 'zat') + k * .05, .3)
for k in range(6): place(sfx, clang(900 + k * 120, .25) * .3, W(9, 'nempel') + k * .07, .3)
place(sfx, sparkle_sfx(), W(9, 'hijau'), .35)
# 10 makin tebal, air es stop
for k in range(10): place(sfx, tick(), W(10, 'makin') + k * .2, .3)
place(sfx, sizzle(1.0), W(10, 'air'), .5); place(sfx, thud(70, .35, .8), W(10, 'menghentikannya', .3), .45)
# 11 aman, seram
place(sfx, chime(1568, .5), W(11, 'aman'), .35); place(sfx, crack() * .6, W(11, 'dimakan'), .4); place(sfx, spooky(1.2), W(11, 'seram'), .45)
# 12 manggut, besok rebus lagi, loop
place(sfx, boing(260, .3), W(12, 'manggutmanggut'), .25); place(sfx, bubbling(W(12, 'setengah') - W(12, 'besoknya') + .3), W(12, 'besoknya'), .45)
for k in range(8): place(sfx, tick(), W(12, 'setengah') + k * .14, .35)
# musik
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[3], DM, .8)
sneak(B[3], B[5], .8)
playful(B[5], B[8], DMAJ, .8)
place(music, strings((50, 57, 62, 66), B[11] - B[8], .22), B[8])
playful(B[11], END, DM, .8)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
