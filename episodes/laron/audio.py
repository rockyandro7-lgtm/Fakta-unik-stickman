# Mitos Rumahan: laron = rayap bersayap (tanpa CTA). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 63,0 dtk mentah, ~968 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (134/134 kata; merge.json: lembab -> lembap; ~384 kredit).
# Sinkron: tools/sync/tighten.py --keep 0.22 (tanpa atempo, 58,52 dtk) -> mapwords.py -> snaponset.py -> align_scribe.py.
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
def flutter(dur, g=.08):     # dengung sayap kawanan laron
    n = int(dur * SR); t = T(n); x = bp(rng.standard_normal(n), 150, 1200) * (.5 + .5 * np.sin(2 * np.pi * 34 * t)) * (.7 + .3 * np.sin(2 * np.pi * .7 * t))
    return x * g * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .3)
def rainS(dur, g=.06):
    n = int(dur * SR); t = T(n); return lp(hp(rng.standard_normal(n), 1500), 7000) * g * np.minimum(1, t / .4) * np.minimum(1, (dur - t) / .4)
def plung():
    n = int(.4 * SR); t = T(n); f = 700 * np.exp(-t * 6) + 200; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .005, .3, 3) * .5
def swish(dur=.4, g=.7):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 1800, 7000) * np.sin(np.pi * t / dur) ** 1.5 * g
def laugh():
    out = np.zeros(int(1.0 * SR))
    for i in range(4):
        n = int(.13 * SR); t = T(n); f = 330 - i * 14
        place(out, (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * 2 * f * t)) * env(n, .01, .08, 3) * .4, i * .18)
    return out
def trombone():
    out = []
    for f, d in ((233, .22), (220, .22), (207, .22), (196, .55)):
        n = int(d * SR); t = T(n); vib = 1 + .02 * np.sin(2 * np.pi * 6 * t) * (t > .2)
        out.append(sum(np.sin(2 * np.pi * f * h * vib * t) / h for h in (1, 2, 3)) * env(n, .02, d * 3, 2) * .25)
    return np.concatenate(out)
def fanfare():
    out = np.zeros(int(1.2 * SR))
    for i, m in enumerate((67, 72, 76, 79)): n = int(.35 * SR); t = T(n); place(out, sum(np.sin(2 * np.pi * midi(m) * h * t) / h for h in (1, 2, 3)) * env(n, .01, .3, 2) * .2, i * .12)
    return out
# hujan + kawanan sepanjang adegan ruang tengah
place(sfx, rainS(END), 0, .8)
for a, b, g in ((0, B[3], .09), (B[3], B[4], .07), (B[4], B[6], .05), (B[8], B[9], .09), (B[10], B[11], .06), (B[12], END, .08)):
    place(sfx, flutter(b - a + .1, g), a)
for tt in B[1:] + [W(1, 'rani'), W(4, 'ibu'), W(12, 'karena')]:
    place(sfx, whoosh(.36), tt - .22, .3)
# 0 hook
for k in range(5): place(sfx, noise(.25, 3000, 10) * .3, W(0, 'sayapnya') + k * .18, .3)
place(sfx, boing(180, .4), W(0, 'copot'), .3)
# 1 tebakan
place(sfx, pop(700), W(1, 'anak'), .3); place(sfx, chime(1318, .5), W(1, 'capung'), .3)
place(sfx, laugh(), W(1, 'ngaco'), .4); place(sfx, pop(600), W(1, 'ngengat'), .3); place(sfx, chime(1046, .5), W(1, 'ngengat'), .25)
# 2 taruhan
place(sfx, clang(700, .3) * .5, W(2, 'taruhannya'), .4); place(sfx, swish(.4), W(2, 'nyapu'), .5); place(sfx, thud(100, .25, .6), W(2, 'sekamar'), .35)
# 3 Ibu, baskom, klik
for k in range(4): place(sfx, thud(140, .12, .5), B[3] + k * .22, .25)
place(sfx, thud(90, .3, .6), W(3, 'bawah'), .4); place(sfx, waves(1.0) * .3, W(3, 'bawah'), .3)
place(sfx, tick() * 2, W(3, 'matiin'), .6); place(sfx, thud(60, .3, .5), W(3, 'matiin', .05), .3)
# 4 plung, rayap
for k in range(6): place(sfx, plung(), W(4, 'berjatuhan') + k * .25, .4)
place(sfx, thud(80, .3, .7), W(4, 'salah'), .4); place(sfx, chime(1568, .6), W(4, 'rayap'), .45)
# 5 melongo, makan kayu
place(sfx, trombone(), W(5, 'melongo'), .35)
for k in range(5): place(sfx, noise(.12, 1500, 30) * .6, W(5, 'makan') + k * .14, .4)
# 6 raja ratu
place(sfx, sparkle_sfx(), W(6, 'bersayap'), .35); place(sfx, fanfare(), W(6, 'raja'), .5)
# 7 tanah, hujan, gali
place(sfx, riser(1.0) * .5, W(7, 'keluar'), .3); place(sfx, rainS(2.5, .15), W(7, 'habis'), .7); place(sfx, chime(880, .5), W(7, 'lembap'), .3)
for k in range(3): place(sfx, thud(120, .15, .5), W(7, 'gampang') + k * .2, .35)
# 8 salah arah
place(sfx, whoosh(.6), W(8, 'salah'), .3); place(sfx, whoosh(.6, False), W(8, 'mutermuter'), .3); place(sfx, boing(300, .5), W(8, 'situ'), .25)
# 9 mendarat, lepas sayap, berpasangan
place(sfx, thud(150, .15, .5), W(9, 'mendarat'), .4)
for k in range(4): place(sfx, pop(1200 + k * 120) * .5, W(9, 'dilepas') + k * .08, .35)
for k in range(8): place(sfx, tick(), W(9, 'jalan') + k * .12, .3)
place(sfx, chime(1318, .5), W(9, 'berpasangan'), .3)
# 10 cicak, kecebur
place(sfx, pop(300) * 1.2, W(10, 'cicak'), .5); place(sfx, plung(), W(10, 'kecebur'), .5); place(sfx, plung(), W(10, 'air'), .4)
# 11 raja ratu, dekat rumah
place(sfx, fanfare(), W(11, 'raja'), .45); place(sfx, thud(70, .35, .8), W(11, 'rumah'), .45)
# 12 nyapu berdua, loop
for k in range(6): place(sfx, swish(.35, .5), W(12, 'nyapu') + k * .45, .5)
# musik
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[3], DM, .8)
sneak(B[3], B[6], .8)
place(music, strings((50, 57, 62, 66), B[9] - B[6], .22), B[6])
playful(B[9], B[12], DMAJ, .75, stabs=False)
playful(B[12], END, DM, .8)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
