# Mitos Rumahan: charger nyolok vs magic com. Semua cue diambil dari waktu kata (audio/words_new.json), aturan v6.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
def W(line, key, d=0.0):
    n = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
    return next(w['s'] for w in WD if w['line'] == line and n(w['w']) == key) + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 13)]
END = WD[-1]['e'] + 1.2
noise = lambda dur, f=900, dec=22: hp(rng.standard_normal(int(dur * SR)), f) * np.exp(-T(int(dur * SR)) * dec)
for i in (1, 2, 6, 9, 11): place(sfx, whoosh(.36), B[i] - .22, .35)          # whip
for i in (3, 10): place(sfx, whoosh(.5), B[i] - .28, .4)                        # spin
place(sfx, riser(.7), B[4] - .55, .28); place(sfx, whoosh(.6), B[4] - .3, .4)   # portal masuk charger
place(sfx, whoosh(.5), B[7] - .3, .38)                                          # match lampu -> alat ukur
for i in (5, 8): place(sfx, chime(990, .7), B[i] - .05, .16)                    # dissolve
# 0 hook
place(sfx, whoosh(.5, False), 0.02, .3); place(sfx, chime(1568, .6), W(0, 'charger'), .3)
for i in range(6): place(sfx, tick(), W(0, 'nyolok') + i * .12, .35); place(sfx, pop(700 + i * 60), W(0, 'nyolok') + i * .12, .16)
place(sfx, pop(520), W(0, 'tanpa'), .4); place(sfx, boing(170, .35), W(0, 'hp'), .32)
place(sfx, pop(640), W(0, 'tagihan'), .35); place(sfx, riser(.45), W(0, 'bengkak') - .05, .3); place(sfx, boing(140, .6), W(0, 'bengkak') + .3, .45)
# 1 tanda tanya
for d in (0, .18, .36): place(sfx, pop(640 + d * 400), B[1] + d, .4)
# 2 stempel
tm = W(2, 'hampir') + .14
place(sfx, thud(48, .7, 1.0), tm, .9); place(sfx, clang(150, .6), tm, .45); place(sfx, noise(.25), tm, .4)
place(sfx, sparkle_sfx(), W(2, 'mitos'), .4); place(sfx, chime(1320, .9), W(2, 'mitos'), .3)
# 3 alat ukur
place(sfx, chime(1760, .5), W(3, 'modern'), .22); place(sfx, pop(520), W(3, 'tanpa'), .38); place(sfx, boing(170, .35), W(3, 'hp'), .3)
place(sfx, tick(), W(3, 'makan') + .2, .6); place(sfx, pop(900), W(3, 'makan') + .22, .3)
place(sfx, chime(1175, .9), W(3, '01'), .38); place(sfx, pluck(880, .5), W(3, '01') + .03, .3); place(sfx, sparkle_sfx(), W(3, '01') + .05, .25)
# 4 isi charger
place(sfx, boing(110, .7), W(4, 'siaga'), .3); place(sfx, chime(660, 1.0), W(4, 'siaga'), .28)
t = W(4, 'nyaris') - .1
while t < B[5] - .1: place(sfx, pop(1100), t, .2); place(sfx, tick(), t, .3); t += .45
place(sfx, chime(1568, .5), W(4, 'arus'), .25)
# 5 setahun + tagihan kempes
t0, t1 = W(5, 'nyolok') + .1, W(5, 'penuh') + .25
for i in range(12): place(sfx, scribble(.07), t0 + i * (t1 - t0) / 12, .45); place(sfx, tick(), t0 + i * (t1 - t0) / 12, .25)
place(sfx, chime(1320, .7), W(5, 'penuh'), .3)
place(sfx, whoosh(.45, False), W(5, 'cuma'), .5); place(sfx, noise(.45, 2500, 7), W(5, 'cuma'), .28); place(sfx, boing(260, .4), W(5, 'cuma') + .32, .35)
place(sfx, chime(1568, .9), W(5, 'seribuan'), .38); place(sfx, sparkle_sfx(), W(5, 'seribuan'), .4)
place(sfx, clang(1900, .5), W(5, 'rupiah') + .05, .22); place(sfx, tick(), W(5, 'rupiah') + .05, .5)
# 6 senter detektif
for k in ('sebenarnya', 'ada', 'dapur'): place(sfx, whoosh(.3, False), W(6, k) - .1, .2)
tm = W(6, 'magic')
place(sfx, thud(52, .6, 1.0), tm, .8); place(sfx, clang(220, .8), tm, .42); place(sfx, sparkle_sfx(), tm + .05, .4); place(sfx, boing(190, .45), W(6, 'com') + .1, .32)
# 7 40 watt, 400 kali lipat
tk = W(7, 'makan')
for i in range(int((W(7, '400') - tk) / .13)): place(sfx, pop(380 + (i % 3) * 60), tk + i * .13, .22)
place(sfx, chime(1175, .9), W(7, '40'), .38); place(sfx, boing(240, .4), W(7, '40'), .3)
t4, tl = W(7, '400'), W(7, 'lipat')
place(sfx, riser(tl - t4 + .2), t4 - .05, .32)
for i in range(18): place(sfx, tick(), t4 + (i / 18) ** .8 * (tl - t4), .3)
place(sfx, thud(55, .5, .9), tl + .1, .7); place(sfx, clang(520, .7), tl + .1, .32)
# 8 24 jam, 40 ribu
p0, p1 = W(8, 'nyala') + .1, W(8, 'jam') + .3
for i in range(int((p1 - p0) / .07)): place(sfx, tick(), p0 + i * .07, .24)
place(sfx, chime(880, .8), p1, .26); place(sfx, pop(620), W(8, 'sebulan'), .4)
for i in range(4): place(sfx, whoosh(.22), W(8, 'bisa') + .05 + i * .16, .22); place(sfx, pop(420), W(8, 'bisa') + .5 + i * .16, .25)
tr = W(8, '40')
place(sfx, tick() * 2, tr, .6); place(sfx, chime(1568, .5), tr + .02, .36); place(sfx, chime(2093, .9), tr + .12, .36); place(sfx, sparkle_sfx(), W(8, 'ribu'), .35)
# 9 masak secukupnya, cabut
place(sfx, pop(260), W(9, 'nasi') + .25, .5); place(sfx, chime(1320, .7), W(9, 'secukupnya') + .15, .32); place(sfx, pop(840), W(9, 'secukupnya') + .15, .3)
tc = W(9, 'cabut')
place(sfx, pop(320), tc, .7); place(sfx, thud(90, .2, .6), tc, .5); place(sfx, sparkle_sfx(), tc + .1, .35); place(sfx, boing(150, .6), tc + .25, .3)
# 10 charger murahan / panas
td = W(10, 'dicabut')
place(sfx, pop(320), td, .7); place(sfx, thud(90, .2, .6), td, .5)
place(sfx, boing(210, .4), W(10, 'murahan'), .32); place(sfx, tick() * 1.5, W(10, 'murahan') + .1, .5)
place(sfx, noise(.9, 3000, 3.5), W(10, 'terasa'), .22)
for i in range(4): place(sfx, pop(700 + i * 80), W(10, 'terasa') + .05 + i * .14, .25)
place(sfx, chime(1320, 1.0), W(10, 'keamanan'), .4); place(sfx, sparkle_sfx(), W(10, 'keamanan') + .05, .42)
# 11 tanda tanya
for d in (0, .2, .4): place(sfx, pop(600 + d * 500), B[11] + d, .4)
# 12 CTA
ts = W(12, 'subscribe')
place(sfx, pop(560), B[12] + .08, .5)
place(sfx, tick() * 2, ts + .2, .7); place(sfx, chime(1320, 1.0), ts + .35, .45); place(sfx, sparkle_sfx(), ts + .35, .5)
place(sfx, sparkle_sfx(), ts + .9, .35); place(sfx, sparkle_sfx(), ts + 1.5, .3)

# ---- musik ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[2], DM, .75, glock_on=False)
playful(B[2], B[4], DMAJ, .85)
sneak(B[4], B[5], .7); place(music, strings((50, 57, 62), B[5] - B[4], .3), B[4])
playful(B[5], B[6], DMAJ, .8)
sneak(B[6], B[7], .85); place(music, strings((50, 56, 62), B[7] - B[6], .35), B[6])
playful(B[7], B[9], DM, .8); place(music, strings((50, 57, 62, 65), B[9] - B[8], .28), B[8])
playful(B[9], B[11], DMAJ, .85)
for k, m in enumerate([62, 66, 69, 74, 78, 81]): place(music, glock(m, .9, .26 + k * .02), B[11] - 1.3 + k * .2)
playful(B[11], END - .4, DMAJ, 1.0)
for m in (62, 66, 69, 74): place(music, pizz(m - 12, .8, .5), END - .8); place(music, glock(m + 12, 1.3, .25), END - .8)
place(music, strings((50, 57, 62, 66), 1.3, .45), END - .9)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
