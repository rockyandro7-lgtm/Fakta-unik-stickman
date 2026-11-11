# Mitos Rumahan #3 (masuk angin): cues timed to the words + playful underscore
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
nrm = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, n=0): return [w['s'] for w in WD if w['line'] == line and nrm(w['w']) == key][n]
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0, LS(1), LS(2), LS(3), W(3, 'dan') - .1, LS(4), W(4, 'bisa') - .1, LS(5), LS(6), LS(7), W(7, 'nyeri') - .1, LS(8), LS(9)]
END = WD[-1]['e'] + 1.2
for b in B[1:]: place(sfx, whoosh(.36), b - .22, .35)
# 0 hook: fan hum, footsteps, wind gusts, shiver
n = int(B[1] * SR); tt = T(n); place(sfx, (np.sin(2 * np.pi * 110 * tt) * .3 + lp(rng.standard_normal(n), 400) * .6) * .5, 0, .25)
for i in range(4): place(sfx, thud(140, .08, .35), .15 + i * .32, .5)
tIn = W(0, 'angin', 1)
for i in range(3): place(sfx, whoosh(.6, i % 2 == 0), tIn - .3 + i * .45, .4)
place(sfx, boing(300, .5), tIn + .3, .3)
# 1 question marks
for d in (.1, .3, .5): place(sfx, pop(640 + d * 300), B[1] + d, .4)
# 2 stamp
tm = W(2, 'mitos') + .14
place(sfx, thud(48, .7, 1.0), tm, .9); place(sfx, clang(150, .6), tm, .45)
# 3 clipboard, strike-through
place(sfx, pop(520), B[3] + .05, .4)
for i in range(4): place(sfx, tick() * 1.4, B[3] + .3 + i * .2, .4)
place(sfx, scribble(.5), W(3, 'bukan'), .6); place(sfx, boing(180, .4), W(3, 'penyakit') + .2, .35)
# 4 wind bouncing off skin
for i in range(6): place(sfx, whoosh(.4, False), B[4] + .1 + i * .4, .22); place(sfx, pop(260), B[4] + .5 + i * .4, .25)
place(sfx, pop(700), W(3, 'kulit') - .3, .45)
# 5 symptoms
place(sfx, boing(160, .6), W(4, 'kembung'), .55); place(sfx, boing(240, .5), W(4, 'mual'), .45)
for i in range(10): place(sfx, thud(200, .05, .2), W(4, 'meriang') + i * .07, .4)
# 6 causes
for key, f in (('maag', 520), ('flu', 640), ('kelelahan', 400)): place(sfx, pop(f), W(4, key), .5)
for i in range(3): place(sfx, chime(440, .3) * .5, W(4, 'kelelahan') + .25 + i * .2, .3)
# 7 kerokan scraping + BUKAN stamp
for i in range(14): place(sfx, scribble(.16), B[7] + .1 + i * (W(5, 'angin') - B[7] - .1) / 14, .35)
place(sfx, whoosh(.8), W(5, 'angin'), .3)
tb = W(5, 'bukan') + .14; place(sfx, thud(48, .7, 1.0), tb, .85); place(sfx, clang(160, .6), tb, .4)
# 8 capillaries
place(sfx, pop(420), W(6, 'pembuluh'), .4); place(sfx, riser(.8), W(6, 'melebar') - .2, .3)
for i in range(4): place(sfx, pop(900 + i * 80), W(6, 'pecah') + i * .07, .35)
# 9 warning
place(sfx, pop(700), B[9] + .2, .5); place(sfx, chime(1500, .4), B[9] + .25, .3); place(sfx, chime(1500, .4), B[9] + .45, .3)
# 10 heart: heartbeat, flatline-ish beep
for i in range(6): place(sfx, heartbeat(), B[10] + .1 + i * .65, .55)
for i in range(4): place(sfx, chime(1000, .15) * .6, B[10] + .3 + i * .8, .3)
place(sfx, clang(220, .7), W(7, 'jantung') + .05, .4)
# 11 siren + footsteps to IGD
n2 = int((B[12] - B[11]) * SR); t2 = T(n2); siren = np.sin(2 * np.pi * np.cumsum(700 + 250 * np.sign(np.sin(2 * np.pi * 1.6 * t2))) / SR) * .25 * np.minimum(1, t2 / .3) * np.minimum(1, (t2[-1] - t2) / .3)
place(sfx, siren, B[11], .25)
for i in range(6): place(sfx, thud(140, .08, .3), B[11] + .25 + i * .42, .45)
# 12 CTA
tSu = W(10, 'subscribe')
place(sfx, whoosh(.4), B[12] + .05, .3); place(sfx, pop(560), B[12] + .12, .5)
for i in range(4): place(sfx, thud(150, .07, .3), B[12] + .1 + i * .3, .4)
place(sfx, tick() * 2, tSu + .2, .7); place(sfx, chime(1320, 1.0), tSu + .35, .45); place(sfx, sparkle_sfx(), tSu + .35, .5)
place(sfx, sparkle_sfx(), tSu + .9, .35)

# ---- music ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[2], DM, .75, glock_on=False)
place(music, strings((50, 57, 62), B[2] - B[1] + .2, .3), B[1] - .1)
playful(B[2], B[5], DMAJ, .85)
playful(B[5], B[7], DM, .7, glock_on=False)
sneak(B[7], B[9], .75); place(music, strings((50, 56, 62), B[9] - B[7], .3), B[7])
place(music, strings((50, 57, 62, 65), B[11] - B[9] + .3, .4), B[9])
sneak(B[9], B[11], .6)
place(music, strings((50, 56, 62), B[12] - B[11], .3), B[11])
for k, m in enumerate([62, 65, 69, 72, 74, 77, 81]): place(music, glock(m, .9, .26 + k * .02), B[12] - 1.4 + k * .2)
playful(B[12], END - .4, DMAJ, 1.0)
for m in (62, 66, 69, 74): place(music, pizz(m - 12, .8, .5), END - .8); place(music, glock(m + 12, 1.3, .25), END - .8)
place(music, strings((50, 57, 62, 66), 1.3, .45), END - .9)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
