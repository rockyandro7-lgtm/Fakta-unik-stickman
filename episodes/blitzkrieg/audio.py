# PREVIEW ASET Blitzkrieg (tanpa narator). Semua cue dari waktu kata perkiraan (audio/words_new.json), aturan v6.
# Versi penuh: suara ElevenLabs + Scribe menggantikan words_new.json, cue di bawah tetap ikut kata.
from audio_lib import *
import json, os
import soundfile as _sf
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0): return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 5)]
END = WD[-1]['e'] + .6
sfx = np.zeros(N)
def rumble(dur, g=1.0):
    n = int(dur * SR); t = T(n); x = lp(rng.standard_normal(n), 140) * (.7 + .3 * np.sin(2 * np.pi * 9 * t)) * 3
    return x * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .3) * g
def drone_plane(dur, g=1.0):
    n = int(dur * SR); t = T(n); f = 95 + 40 * np.exp(-((t - dur * .6) ** 2) / .2)
    ph = np.cumsum(f) / SR; x = lp((2 * (ph % 1) - 1), 900) * np.minimum(1, t / .2) * np.minimum(1, (dur - t) / .3); return x * g
def beep(f=1200, dur=.08): n = int(dur * SR); t = T(n); return np.sin(2 * np.pi * f * t) * np.minimum(1, (dur - t) / .01) * .6
def wind(dur, g=1.0):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 300, 1400) * (.5 + .5 * np.sin(2 * np.pi * .4 * t) ** 2) * np.minimum(1, t / .5) * g
def powerdown(dur=.9):
    n = int(dur * SR); t = T(n); f = 520 * np.exp(-t * 2.2); return np.sin(np.cumsum(2 * np.pi * f) / SR) * np.exp(-t * 2) * .7
def crack(): n = int(.25 * SR); t = T(n); return hp(rng.standard_normal(n), 1500) * np.exp(-t * 28) + lp(rng.standard_normal(n), 400) * np.exp(-t * 18) * .8
# 0 HOOK
place(sfx, lp(rng.standard_normal(int(.5 * SR)), 2500) * np.exp(-T(int(.5 * SR)) * 6) * .5, 0.0, .5)   # seruput kopi
place(sfx, whoosh(.6), W(0, 'benteng'), .4); place(sfx, thud(55, .7, 1.0), W(0, 'terkuat', .3), .7); place(sfx, clang(300, 1.0), W(0, 'terkuat', .3), .2)
place(sfx, pop(700), W(0, 'kalah'), .5); place(sfx, boing(240, .4), W(0, 'kalah', .05), .35)
for i in range(4): place(sfx, pop(380 - i * 40), W(0, 'kalah', .25 + i * .07), .25)
place(sfx, chime(1320, .7), W(0, '6'), .3)
# transisi
place(sfx, chime(990, .7), B[1] - .05, .18); place(sfx, whoosh(.36), B[2] - .22, .32); place(sfx, chime(880, .7), B[3] - .05, .16); place(sfx, chime(740, .9), B[4] - .05, .2)
# 1 parit
mc = W(1, 'macet'); place(sfx, thud(48, .8, 1.0), mc + .95, .8); place(sfx, lp(rng.standard_normal(int(.6 * SR)), 600) * np.exp(-T(int(.6 * SR)) * 6) * 2, mc + .95, .5)
n4, th = W(1, '4'), W(1, 'tahun')
for k in range(5): place(sfx, tick() * 2, n4 - .1 + k * (th + .45 - n4 + .1) / 4.999, .5)
# 2 kombo
place(sfx, pop(560), W(2, 'kombo'), .45); place(sfx, rumble(W(2, 'tank', .6) - B[2]), B[2], .5)
place(sfx, drone_plane(1.6), W(2, 'pesawat', -.4), .25); place(sfx, whoosh(.7), W(2, 'pesawat', -.2), .3)
for k in range(3): place(sfx, beep(1200 + k * 300), W(2, 'radio') + k * .11, .35)
place(sfx, sparkle_sfx(), W(2, 'radio', .2), .3)
# 3 hutan
place(sfx, rumble(B[4] - B[3] + .3), B[3] - .1, .6)
tx = lambda t: -150 + (860 + 150) * (t - (B[3] - .3)) / (B[4] + .3 - (B[3] - .3))
tsign = next(t for t in np.arange(B[3] - .3, B[4] + .3, .01) if tx(t) + 360 * .9 >= 900)
for px in (260, 520, 760): 
    tp = next((t for t in np.arange(B[3] - .3, B[4] + .3, .01) if tx(t) + 324 >= px), None)
    if tp: place(sfx, crack(), tp, .35)
place(sfx, crack(), tsign, .7); place(sfx, thud(90, .3, .6), tsign + .25, .5)
place(sfx, hp(rng.standard_normal(int(.5 * SR)), 4000) * np.minimum(1, T(int(.5 * SR)) / .05) * np.exp(-T(int(.5 * SR)) * 3) * .3, W(3, 'lewat'), .4)  # ssst
# 4 salju
place(sfx, wind(END - B[4] + .2), B[4] - .1, .45); pd = W(4, 'padam')
place(sfx, rumble(pd - B[4] + .2) * (1 + .6 * np.sin(np.arange(int((pd - B[4] + .2) * SR)) / SR * 2 * np.pi * 3)), B[4], .45)
place(sfx, powerdown(1.0), pd, .5); place(sfx, boing(110, .6), pd + .15, .3)
# musik
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[1], DM, .8, glock_on=True)
sneak(B[1], B[2], .7)
playful(B[2], B[3], DMAJ, .9)
sneak(B[3], B[4], .8)
place(music, strings((50, 56, 62), END - B[4], .45), B[4])
music = lp(music, 6000)
# preview tanpa narator: campur musik + efek saja (finish() butuh audio/vo.wav)
mix = music * .3 + sfx * .8
fade = np.ones(N); fl = int(.5 * SR); fade[-fl:] = np.linspace(1, 0, fl); mix *= fade
mix = mix / np.max(np.abs(mix)) * .89
_sf.write('audio/mix.wav', np.stack([mix, mix], 1), SR); print('done', len(mix) / SR, 'dtk')
