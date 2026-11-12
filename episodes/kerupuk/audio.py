# Mitos Rumahan: kenapa kerupuk mengembang. Semua cue diambil dari waktu kata (audio/words_new.json), aturan v6.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0):
    return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 18)]
END = WD[-1]['e'] + .6
noise = lambda dur, f=900, dec=22: hp(rng.standard_normal(int(dur * SR)), f) * np.exp(-T(int(dur * SR)) * dec)
def sizzle(dur, g=1.0):
    n = int(dur * SR); x = bp(rng.standard_normal(n), 2500, 9000) * (0.6 + 0.4 * rng.random(n) ** 8)
    e = np.minimum(1, T(n) / .03) * np.minimum(1, (dur - T(n)) / .4); return x * e * g
def knock(f=900):   # ketukan keras "tok" (kerupuk keras seperti kayu)
    n = int(.12 * SR); t = T(n); return (np.sin(2 * np.pi * f * t) * .7 + np.sin(2 * np.pi * f * 2.3 * t) * .3) * np.exp(-t * 55) + lp(rng.standard_normal(n), 3000) * np.exp(-t * 120) * .5
def crunch(dur=.5):
    out = np.zeros(int(dur * SR))
    for i in range(14): place(out, hp(rng.standard_normal(int(.03 * SR)), 1800) * np.exp(-T(int(.03 * SR)) * 90) * (1 - i / 16), i * dur / 16)
    return out
T5b = W(5, 'kenyal', -.3); T7b = W(7, 'dijemur', -.15); T8 = W(8, 'dalamnya', -.25); T13b = W(13, 'membentuk', -.1)
# transisi
for tt in (B[3], B[4], B[7], T7b, B[10], B[15], B[17]): place(sfx, whoosh(.36), tt - .22, .32)       # whip
place(sfx, riser(.7), B[5] - .55, .26); place(sfx, whoosh(.6), B[5] - .3, .36)                         # portal ke dandang
for tt in (B[1], T8, B[11], T13b): place(sfx, whoosh(.5), tt - .3, .34)                                 # match
for tt in (B[2], T5b, B[9], B[16]): place(sfx, chime(990, .7), tt - .05, .14)                          # dissolve
# 0 HOOK: tok tok, tok di kepala, lempar, MENGEMBANG
place(sfx, knock(820), .1, .9); place(sfx, knock(860), W(0, 'kerupuk', .02), .9)
place(sfx, knock(700), W(0, 'kayu'), 1.0); place(sfx, boing(300, .35), W(0, 'kayu', .05), .3)
place(sfx, whoosh(.3), W(0, 'bisa'), .35)
tm = W(0, 'mengembang')
place(sfx, sizzle(1.2), tm - .02, .35); place(sfx, thud(60, .5, 1.0), tm, .7); place(sfx, boing(120, .6), tm + .02, .5); place(sfx, sparkle_sfx(), tm + .1, .35)
place(sfx, chime(1568, .8), W(0, 'wajan'), .3)
# 1 rahasia
place(sfx, sparkle_sfx(), W(1, 'rahasianya', .2), .25); place(sfx, chime(660, 1.0), W(1, 'sesuatu'), .25); place(sfx, pop(640), W(1, 'kelihatan'), .4)
# 2 tepung + air
place(sfx, noise(.7, 3000, 4), W(2, 'tepung'), .3); place(sfx, pop(520), W(2, 'tapioka'), .35); place(sfx, chime(1760, .5), W(2, 'tapioka'), .22)
place(sfx, bp(rng.standard_normal(int(.8 * SR)), 400, 2200) * np.exp(-T(int(.8 * SR)) * 2), W(2, 'air'), .35)
# 3 gumpalan mentah gagal
place(sfx, whoosh(.3, False), W(3, 'digoreng', -.15), .3); place(sfx, sizzle(1.6), W(3, 'digoreng', .2), .4); place(sfx, thud(80, .2, .6), W(3, 'digoreng', .2), .5)
place(sfx, boing(160, .45), W(3, 'mengembang', -.05), .35); place(sfx, pop(300), W(3, 'tidak'), .5); place(sfx, boing(90, .6), W(3, 'mengembang', .45), .35)
# 4 dikukus
place(sfx, clang(900, .5), B[4] + .1, .2); place(sfx, clang(700, .6), W(4, 'dikukus'), .35); place(sfx, noise(1.2, 2000, 2), W(4, 'dikukus', .1), .25)
# 5 gel, karet
place(sfx, riser(W(5, 'gel') - W(5, 'mengubah') + .1), W(5, 'mengubah'), .2); place(sfx, sparkle_sfx(), W(5, 'gel'), .35)
place(sfx, riser(.5), W(5, 'kenyal', -.1), .2); place(sfx, boing(180, .7), W(5, 'karet'), .6); place(sfx, boing(260, .4), W(5, 'karet', .12), .3)
# 6 bantat
place(sfx, pop(400), W(6, 'matang'), .4); place(sfx, sizzle(1.0), W(6, 'kerupuknya'), .25); place(sfx, boing(110, .4), W(6, 'nanti'), .3)
tb = W(6, 'bantat', .12); place(sfx, thud(48, .7, 1.0), tb, .9); place(sfx, clang(150, .6), tb, .4); place(sfx, noise(.25), tb, .35)
# 7 iris + jemur
for i in range(5):
    tc = W(7, 'diiris', -.05) + i * (W(7, 'tipis', .35) - W(7, 'diiris', -.05)) / 4
    place(sfx, knock(1300), tc + .1, .45); place(sfx, thud(140, .08, .4), tc + .1, .4)
for i in range(8): place(sfx, tick(), W(7, 'dijemur') + i * (W(7, 'kaca') - W(7, 'dijemur')) / 8, .3)
place(sfx, chime(2093, 1.2), W(7, 'kaca'), .4); place(sfx, chime(3136, .9), W(7, 'kaca', .03), .2)
# 8 mikro: air
place(sfx, chime(880, 1.0), T8 + .3, .2); place(sfx, sparkle_sfx(), W(8, 'air'), .35); place(sfx, pop(900), W(8, 'sedikit'), .35)
# 9 basah / kering
place(sfx, bp(rng.standard_normal(int(.5 * SR)), 300, 1500) * np.exp(-T(int(.5 * SR)) * 5), W(9, 'basah'), .4); place(sfx, pop(260), W(9, 'basah', .3), .3)
place(sfx, crunch(.3), W(9, 'kering'), .35); place(sfx, noise(.4, 1500, 6), W(9, 'kering', .1), .2)
place(sfx, boing(150, .4), W(9, 'susah'), .3); place(sfx, pop(320), W(9, 'mengembang'), .45); place(sfx, pop(300), W(9, 'mengembang', .08), .45)
# 10 masuk minyak
place(sfx, whoosh(.3, False), W(10, 'masuk', -.1), .3); place(sfx, sizzle(2.4), W(10, 'masuk', .22), .55); place(sfx, thud(70, .2, .5), W(10, 'masuk', .22), .4)
# 11 air jadi uap
place(sfx, riser(W(11, 'uap') - B[11]), B[11], .22)
for i in range(5): place(sfx, pop(700 + i * 90), W(11, 'berubah', .2) + i * .08, .35)
place(sfx, sparkle_sfx(), W(11, 'uap'), .3)
# 12 uap membesar, mendorong
place(sfx, boing(200, .5), W(12, 'ruang'), .35); place(sfx, riser(.6), W(12, 'jauh'), .3); place(sfx, boing(110, .8), W(12, 'besar'), .45)
place(sfx, thud(55, .6, 1.0), W(12, 'mendorong'), .7); place(sfx, whoosh(.5), W(12, 'mendorong'), .35); place(sfx, thud(55, .4, .7), W(12, 'dalam'), .5)
# 13 melar, rongga
for i in range(10): place(sfx, pop(500 + (i % 4) * 120), B[13] + .2 + i * .18, .22)
place(sfx, boing(140, .7), W(13, 'melar'), .4)
place(sfx, sizzle(2.2), T13b, .45); place(sfx, riser(.6), T13b, .25); place(sfx, sparkle_sfx(), W(13, 'udara'), .4); place(sfx, chime(1568, 1.0), W(13, 'udara'), .3)
# 14 uap keluar, mengeras
for i in range(5): place(sfx, whoosh(.25, False), W(14, 'airnya') + i * .12, .15)
place(sfx, whoosh(.3), W(14, 'gelnya'), .3); place(sfx, chime(2349, 1.1), W(14, 'mengeras'), .42); place(sfx, chime(3136, .9), W(14, 'mengeras', .03), .2); place(sfx, sparkle_sfx(), W(14, 'lagi'), .3)
# 15 kriuk
place(sfx, chime(1320, .6), W(15, 'ringan'), .25); place(sfx, crunch(.55), W(15, 'kriuk'), 1.0); place(sfx, crunch(.4), W(15, 'kriuk', .25), .6)
# 16 tanda tanya
for d in (0, .2, .4): place(sfx, pop(600 + d * 500), B[16] + d, .4)
# 17 CTA + loop ke frame 0
ts = W(17, 'subscribe')
place(sfx, pop(560), B[17] + .08, .5)
place(sfx, knock(820), END - .2, .8)
place(sfx, tick() * 2, ts + .2, .7); place(sfx, chime(1320, 1.0), ts + .35, .45); place(sfx, sparkle_sfx(), ts + .35, .5); place(sfx, sparkle_sfx(), ts + .9, .3)

# ---- musik ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[2], DM, .8, glock_on=False)
sneak(B[2], B[4], .7)
playful(B[4], B[8], DMAJ, .8)
sneak(B[8], B[10], .75); place(music, strings((50, 57, 62), B[10] - B[8], .3), B[8])
place(music, strings((50, 56, 62), B[11] - B[10], .35), B[10]); sneak(B[10], B[11], .8)
playful(B[11], B[13], DM, .85); place(music, strings((50, 57, 62, 65), B[13] - B[12], .3), B[12])
playful(B[13], B[16], DMAJ, .95)
for k, m in enumerate([62, 66, 69, 74, 78, 81]): place(music, glock(m, .9, .26 + k * .02), B[16] - 1.3 + k * .2)
playful(B[16], END - .3, DMAJ, 1.0)
place(music, strings((50, 57, 62, 66), 1.3, .4), END - 1.3)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
