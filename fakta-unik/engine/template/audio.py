# Fakta Unik #2 audio: cues timed to the words (from audio/words_new.json) + playful underscore
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
def W(line, key):
    n = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
    return next(w['s'] for w in WD if w['line'] == line and n(w['w']) == key)
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0, LS(1), LS(2), LS(3), LS(4), W(4, 'karena') - .1, W(4, 'suhu') - .05, LS(5), W(5, 'jauh') - .05, LS(6), LS(7), LS(8), W(8, 'lalu') - .1, W(8, 'simpan') - .35, LS(9)]
END = WD[-1]['e'] + 1.2
for b in B[1:]: place(sfx, whoosh(.36), b - .22, .35)
# 0 hook
place(sfx, pop(520), 2.05, .4); place(sfx, boing(260, .4), 2.1, .3)
place(sfx, thud(55, .5, .9), 4.35, .6); place(sfx, clang(170, .8), 4.35, .5)
for i in range(6): place(sfx, thud(150 + i * 20, .08, .25), 4.4 + i * .06)
# 1 question marks
for d in (.15, .35, .6): place(sfx, pop(640 + d * 300), B[1] + d, .4)
# 2 stamp
tm = W(2, 'mitos') + .14
place(sfx, thud(48, .7, 1.0), tm, .9); place(sfx, clang(150, .6), tm, .45); place(sfx, hp(rng.standard_normal(int(.25 * SR)), 900) * np.exp(-T(int(.25 * SR)) * 22), tm, .4)
# 3 fridge
place(sfx, whoosh(.3, False), B[3] + .2, .25); place(sfx, thud(70, .25, .5), B[3] + 1.6, .5)
place(sfx, thud(60, .3, .7), B[3] + 2.35, .5); place(sfx, sparkle_sfx(), B[3] + 2.55, .4); place(sfx, pop(780), B[3] + 2.7, .45)
# 4 bugs appear
place(sfx, pop(560), B[4] + .15, .4)
for i in range(7): place(sfx, pop(300 + (i % 3) * 40), B[4] + .5 + i * .16, .35)
# 5 petri doubling
for k, tt in enumerate([0, .55, .8, 1.05, 1.4]): place(sfx, pop(360 + k * 70), B[5] + tt + .1, .45)
# 6 thermometer
place(sfx, riser(1.3), B[6], .3)
place(sfx, chime(880, .9), W(4, '4'), .35); place(sfx, chime(1175, .9), W(4, '60'), .35)
tD = W(4, 'derajat'); place(sfx, boing(180, .5), tD, .4); place(sfx, chime(1500, .5), tD + .02, .4); place(sfx, chime(1500, .5), tD + .22, .35)
# 7 clock ticks + ding
p0 = W(5, 'dari') - .8; p1 = W(5, 'jam') + .1
for i in range(int((p1 - p0) / .09)): place(sfx, tick(), p0 + i * .09, .28)
place(sfx, clang(1200, 1.0), p1, .45); place(sfx, pop(300), p1 + .02, .3)
# 8 basi
place(sfx, boing(150, .7), B[8] + 1.0, .5); place(sfx, thud(55, .4, .6), B[8] + 1.0)
# 9 catatan
place(sfx, pop(700), B[9] + .05, .4); place(sfx, pop(900), B[9] + .4, .5); place(sfx, whoosh(.4), B[9] + .35, .3)
# 10 heat
tm2 = W(7, 'mengepul'); tK = W(7, 'kulkas')
place(sfx, thud(65, .3, .6), B[10] + .45, .5); place(sfx, riser(tK - tm2 + .3), tm2, .3)
for i in range(6): place(sfx, pop(500 + i * 90), tm2 + i * (tK - tm2) / 6, .22)
# 11 ladle plops
for i in range(3): place(sfx, pop(250), B[11] + .35 + i * .85 + .43, .5)
# 12 lids
tT = W(8, 'tutup')
for i in range(3): place(sfx, tick() * 1.5, tT + i * .16 + .28, .6); place(sfx, thud(110, .12, .35), tT + i * .16 + .28, .5)
place(sfx, pop(840), tT + .8, .4)
# 13 into the fridge
tS = W(8, 'simpan'); tKk = W(8, 'kulkas')
for i in range(3): place(sfx, thud(90, .1, .3), tS - .1 + i * .22 + .3, .5)
place(sfx, thud(60, .3, .7), tKk + .25, .55); place(sfx, sparkle_sfx(), tKk + .5, .45); place(sfx, pop(800), tKk + .5, .4)
# 14 CTA
tSu = W(10, 'subscribe')
place(sfx, whoosh(.4), B[14] + .05, .3); place(sfx, pop(560), B[14] + .12, .5)
place(sfx, tick() * 2, tSu + .2, .7); place(sfx, chime(1320, 1.0), tSu + .35, .45); place(sfx, sparkle_sfx(), tSu + .35, .5)
place(sfx, sparkle_sfx(), tSu + .9, .35); place(sfx, sparkle_sfx(), tSu + 1.5, .3)

# ---- music ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[2], DM, .75, glock_on=False)
place(music, strings((50, 57, 62), B[2] - B[1] + .2, .3), B[1] - .1)
playful(B[2], B[4], DMAJ, .85)
place(music, strings((50, 57, 62, 66), B[4] - B[3] + .6, .35), B[3])
sneak(B[4], B[7], .7); place(music, strings((50, 56, 62), B[7] - B[4], .3), B[4])
sneak(B[7], B[9] + .2, .8)
place(music, strings((50, 57, 62, 65), B[10] - B[9] + .3, .35), B[9])
sneak(B[10], B[11], .7); place(music, strings((50, 56, 62), B[11] - B[10], .35), B[10])
for k, m in enumerate([62, 65, 69, 72, 74, 77, 81]): place(music, glock(m, .9, .26 + k * .02), B[11] - 1.6 + k * .22)
playful(B[11], B[14], DMAJ, .85)
playful(B[14], END - .4, DMAJ, 1.0)
for m in (62, 66, 69, 74): place(music, pizz(m - 12, .8, .5), END - .8); place(music, glock(m + 12, 1.3, .25), END - .8)
place(music, strings((50, 57, 62, 66), 1.3, .45), END - .9)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
