# Mitos Rumahan: ekor cicak putus masih joget (tanpa CTA). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 60,3 dtk mentah, ~925 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (121/121 kata; ~368 kredit).
# Sinkron: tools/sync/tighten.py --keep 0.22 (tanpa atempo, 54,8 dtk) -> mapwords.py -> snaponset.py -> align_scribe.py.
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
def swish(dur=.4, g=.7):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 1800, 7000) * np.sin(np.pi * t / dur) ** 1.5 * g
def wiggle(dur, g=.35):       # ekor joget: ketukan kecil cepat di lantai
    out = np.zeros(int(dur * SR))
    for k in range(int(dur / .137)):
        place(out, thud(260 + (k % 3) * 60, .05, .4), k * .137); place(out, noise(.04, 2500, 60) * .3, k * .137)
    return out * g
def crack():
    n = int(.3 * SR); t = T(n); return (hp(rng.standard_normal(n), 1200)[:n] * np.exp(-t * 30) + np.sin(2 * np.pi * 140 * t) * np.exp(-t * 18) * .6) * .8
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
def meow():
    n = int(.5 * SR); t = T(n); f = 700 + 300 * np.sin(np.pi * t / .5); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .03, .4, 2) * .25
def scurry(dur, g=.3):         # cicak lari: ketukan kaki halus
    out = np.zeros(int(dur * SR))
    for k in range(int(dur / .07)): place(out, noise(.03, 4000, 90) * .5, k * .07)
    return out * g
# ekor joget di lantai (adegan ruang)
for a, b in ((-.0, B[3]), (B[3], W(3, 'cicaknya')), (B[8], B[10])):
    place(sfx, wiggle(b - a), max(0, a), .8)
for tt in B[1:] + [W(3, 'cicaknya'), W(9, 'cicaknya'), W(13, 'dan')]:
    place(sfx, whoosh(.36), tt - .22, .3)
# 0 hook (pukulan terjadi sebelum frame 0; terdengar lagi di akhir)
place(sfx, scurry(2.6), .05, .6); place(sfx, boing(240, .4), W(0, 'joget'), .25)
# 1 menang
place(sfx, fanfare(), W(1, 'menang'), .5); place(sfx, swish(.4), W(1, 'aku'), .4)
# 2 ketawa
place(sfx, laugh(), W(2, 'ketawa'), .45); place(sfx, trombone(), W(2, 'ketipu'), .35)
# 3 melotot, kabur
for k in range(3): place(sfx, boing(300 + k * 40, .25), W(3, 'melototin') + k * .35, .15)
place(sfx, scurry(.8), W(3, 'kabur'), .7); place(sfx, chime(1318, .5), W(3, 'jam'), .3)
# 4 replay, pop
place(sfx, riser(1.2) * .5, B[4], .25); place(sfx, pop(900), W(4, 'ngelepas'), .5); place(sfx, chime(1568, .5), W(4, 'sengaja'), .3)
# 5 rontgen, garis retak
place(sfx, sparkle_sfx(), W(5, 'garis'), .35)
for k in range(6): place(sfx, tick(), W(5, 'disiapkan') + k * .05, .3)
# 6 serang, otot, krek
place(sfx, meow(), W(6, 'serang'), .6); place(sfx, noise(.6, 300, 4) * .3, W(6, 'narik'), .4)
place(sfx, crack(), W(6, 'krek'), .9); place(sfx, thud(90, .3, .7), W(6, 'krek', .02), .5); place(sfx, whoosh(.5), W(6, 'lepas'), .3)
# 7 pembuluh menutup
place(sfx, tick() * 2, W(7, 'nutup'), .5); place(sfx, pop(500), W(7, 'nutup', .08), .4); place(sfx, chime(1046, .4), W(7, 'hampir'), .2)
# 8 menit, pemangsa
for k in range(8): place(sfx, tick(), W(8, 'beberapa') + k * .12, .3)
place(sfx, meow(), W(8, 'pemangsa'), .5)
# 9 kejar-kejaran
place(sfx, meow(), W(9, 'kucing'), .5); place(sfx, tweet(), W(9, 'burung'), .5); place(sfx, boing(160, .5), W(9, 'budi'), .4)
for k in range(10): place(sfx, thud(120 + (k % 4) * 30, .12, .5), W(9, 'semuanya') + k * .14, .4); place(sfx, noise(.08, 1500, 40) * .4, W(9, 'semuanya') + k * .14, .4)
place(sfx, chime(1568, .6), W(9, 'selamat'), .4); place(sfx, sparkle_sfx(), W(9, 'selamat'), .3)
# 10 minggu berlalu, tumbuh
for k in range(3): place(sfx, swish(.25, .4), W(10, 'beberapa') + k * .3, .4)
place(sfx, riser(1.0) * .6, W(10, 'ekornya'), .3); place(sfx, chime(1318, .6), W(10, 'lagi'), .35)
# 11 tulang rawan
place(sfx, thud(80, .3, .6), W(11, 'bukan', 0, 1), .35); place(sfx, sparkle_sfx(), W(11, 'tabung'), .35)
# 12 tumpul, warna
place(sfx, boing(200, .4), W(12, 'tumpul'), .3); place(sfx, pop(700), W(12, 'warnanya'), .3)
# 13 sapu lagi -> pukul (loop)
place(sfx, swish(.4), W(13, 'ngayunin'), .4); place(sfx, swish(.5, .9), END - .95, .6)
place(sfx, thud(110, .25, .8), END - .7, .55); place(sfx, wiggle(.8), END - .65, .8); place(sfx, scurry(.6), END - .65, .6)
# musik
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[4], DM, .8)
sneak(B[4], B[8], .8)
playful(B[8], B[10], DM, .75, stabs=False)
place(music, strings((50, 57, 62, 66), B[13] - B[10], .22), B[10])
playful(B[13], END, DM, .8)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
