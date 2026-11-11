# Teaser audio: cues timed to words + eerie-to-playful underscore
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
nrm = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, n=0): return [w['s'] for w in WD if w['line'] == line and nrm(w['w']) == key][n]
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0, LS(1), W(1, 'bertahan') - .1, LS(2), LS(3), LS(4), W(4, 'gerakannya') - .1, W(4, 'lalu') - .1, LS(5), LS(6), LS(7), LS(8), LS(9)]
END = WD[-1]['e'] + 1.2
for b in B[1:]: place(sfx, whoosh(.36), b - .22, .35)
# 0 eye + Z + X
for i in range(3): place(sfx, pop(520 + i * 80), .3 + i * .35, .3)
place(sfx, thud(55, .5, .8), W(0, 'tidur') + .05, .6); place(sfx, boing(200, .4), W(0, 'tidur') + .05, .3)
# 1 vintage card
place(sfx, pop(420), B[1] + .1, .5); place(sfx, tick() * 1.5, B[1] + .5, .5); place(sfx, pop(800), W(1, '17'), .45)
# 2 counter ticking up then hit
t0 = W(1, '264') - .6; t1 = W(1, 'jam') + .1
for i in range(int((t1 - t0) / .06)): place(sfx, tick(), t0 + i * .06, .3)
place(sfx, clang(900, 1.0), t1, .5); place(sfx, thud(55, .5, .8), t1 + .02, .6); place(sfx, pop(700), t1 + .2, .4)
# 3 calendar crosses
dur = B[4] - B[3]
for i in range(11): place(sfx, scribble(.14), B[3] + .3 + i * (dur - .4) / 11, .4)
# 4 dribble
for i in range(int((B[5] - B[4]) / .52)): place(sfx, thud(120, .1, .5), B[4] + .15 + i * .52, .5)
place(sfx, pop(700), W(3, 'stanford'), .45)
# 5 mood swings
for i in range(5): place(sfx, pop(440 + (i % 3) * 120), B[5] + i * .625, .4)
# 6 clumsy: wobble + drop + thud
place(sfx, boing(180, .8), B[6] + .1, .4); place(sfx, thud(70, .3, .8), B[6] + 1.45, .6)
# 7 hallucination
place(sfx, riser(B[8] - B[7]), B[7], .35)
for i in range(6): place(sfx, chime(1200 + i * 150, .5) * .6, B[7] + .2 + i * .25, .3)
# 8 reveal
place(sfx, thud(48, .7, 1.0), B[8] + .1, .7); place(sfx, pop(900), B[8] + .3, .5)
# 9 timeline
for i in range(12): place(sfx, tick(), B[9] + .4 + i * .3, .3)
# 10 question marks
place(sfx, pop(600), B[10] + .1, .45); place(sfx, pop(700), W(7, 'atau'), .45)
# 11 books + checks
for i in range(3): place(sfx, pop(520 + i * 110), B[11] + .1 + i * .4, .45); place(sfx, chime(1500, .4) * .6, B[11] + .3 + i * .4, .3)
# 12 CTA
tSu = W(9, 'subscribe')
place(sfx, whoosh(.4), B[12] + .05, .3); place(sfx, pop(560), B[12] + .12, .5)
for i in range(4): place(sfx, thud(150, .07, .3), B[12] + .1 + i * .3, .4)
place(sfx, tick() * 2, tSu + .2, .7); place(sfx, chime(1320, 1.0), tSu + .35, .45); place(sfx, sparkle_sfx(), tSu + .35, .5); place(sfx, sparkle_sfx(), tSu + .9, .35)
# music: mysterious (sneak/strings) for the story, bright for the CTA
music = np.zeros(N)
import audio_lib as AL
AL.music = music
place(music, strings((50, 56, 62), B[2] - 0 + .3, .35), 0)
sneak(B[1], B[4], .7); place(music, strings((50, 57, 62, 65), B[4] - B[1], .3), B[1])
playful(B[4], B[6], DM, .7, glock_on=False)
sneak(B[6], B[8], .8); place(music, strings((50, 56, 62), B[8] - B[6], .35), B[6])
place(music, strings((50, 57, 62, 65), B[9] - B[8] + .3, .4), B[8])
playful(B[9], B[12], DMAJ, .8)
playful(B[12], END - .4, DMAJ, 1.0)
for m in (62, 66, 69, 74): place(music, pizz(m - 12, .8, .5), END - .8); place(music, glock(m + 12, 1.3, .25), END - .8)
place(music, strings((50, 57, 62, 66), 1.3, .45), END - .9)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
