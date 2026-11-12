# PREVIEW PETA Blitzkrieg (naskah baris 6-14, tanpa narator). Cue dari waktu kata perkiraan (audio/words_new.json), aturan v6.
from audio_lib import *
import json
import soundfile as _sf
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0): return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
END = WD[-1]['e'] + .6
sfx = np.zeros(N)
def rumble(dur, g=1.0):
    n = int(dur * SR); t = T(n); x = lp(rng.standard_normal(n), 140) * (.7 + .3 * np.sin(2 * np.pi * 9 * t)) * 3
    return x * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .3) * g
def heart():
    n = int(.5 * SR); t = T(n); b = lambda t0: np.sin(2 * np.pi * 55 * (t - t0)) * np.exp(-np.maximum(0, t - t0) * 18) * (t >= t0)
    return b(0) + .7 * b(.18)
def marker(dur):   # bunyi spidol menggambar panah
    n = int(dur * SR); return bp(rng.standard_normal(n), 2500, 7000) * (.6 + .4 * np.sin(2 * np.pi * 7 * T(n))) * np.minimum(1, (dur - T(n)) / .05) * .5
def splash():
    n = int(.6 * SR); t = T(n); return bp(rng.standard_normal(n), 400, 5000) * np.exp(-t * 7)
# 6 tinju
place(sfx, whoosh(.3), W(6, 'memancing', -.1), .4); place(sfx, thud(140, .15, .4), W(6, 'menangkis'), .5)
hit = W(6, 'menghantam', .25); place(sfx, whoosh(.35), hit - .3, .45); place(sfx, thud(70, .4, 1.0), hit, .9); place(sfx, pop(300), hit, .4); place(sfx, sparkle_sfx(), hit + .2, .25)
place(sfx, chime(990, .8), LS(7) - .1, .2)   # dissolve ke peta
# 7-9 umpan
place(sfx, pop(620), W(7, 'mei'), .45); place(sfx, marker(1.6), W(7, 'tangan'), .35); place(sfx, rumble(2.4), W(7, 'tangan'), .4)
place(sfx, whoosh(.8), W(8, 'bergegas', -.4), .4)
for k in range(6): place(sfx, tick() * 1.5, W(8, 'bergegas', -.3) + k * .22, .35)
place(sfx, pop(500), LS(9), .45); place(sfx, sparkle_sfx(), LS(9) + .3, .3)
# 10-11 sabit
place(sfx, rumble(W(11, 'laut') - W(10, 'diamdiam') + .4, .8), W(10, 'diamdiam'), .55); place(sfx, marker(W(11, 'laut') - W(10, 'diamdiam')), W(10, 'diamdiam'), .3)
place(sfx, thud(60, .5, 1.0), W(11, 'sedan'), .8); place(sfx, splash(), W(11, 'laut'), .6)
# 12-13 kantong
place(sfx, pop(700), W(12, '10'), .4); tt = W(12, 'tertutup'); place(sfx, thud(50, .7, 1.0), tt, 1.0); place(sfx, clang(220, 1.2), tt, .35)
hb = W(13, 'terkepung', -.3)
while hb < LS(14) + 1.2: place(sfx, heart(), hb, .9); hb += 60 / 92
# 14 Dunkirk
place(sfx, whoosh(.6), W(14, 'kabur'), .3)
for k in range(4): place(sfx, splash() * .4, W(14, 'kabur') + .4 + k * .55, .3)
place(sfx, pop(560), W(14, '338'), .45); place(sfx, chime(660, 1.0), W(14, 'ditinggal'), .3)
# musik: tegang naik saat sabit + kantong
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, LS(7), DM, .8, glock_on=False)
sneak(LS(7), LS(10), .7)
sneak(LS(10), LS(12), .85); place(music, strings((50, 57, 62), LS(12) - LS(10), .3), LS(10))
place(music, strings((50, 56, 62, 65), LS(14) - LS(12) + .5, .55), LS(12))
place(music, strings((50, 57, 62, 66), END - LS(14), .4), LS(14)); playful(LS(14) + .5, END, DMAJ, .6, glock_on=False, stabs=False)
music = lp(music, 6000)
mix = music * .3 + sfx * .8
fade = np.ones(N); fl = int(.5 * SR); fade[-fl:] = np.linspace(1, 0, fl); mix *= fade
mix = mix / np.max(np.abs(mix)) * .89
_sf.write('audio/mix.wav', np.stack([mix, mix], 1), SR); print('done', len(mix) / SR, 'dtk')
