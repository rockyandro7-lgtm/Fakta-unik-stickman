# Mitos Rumahan & Fakta Unik: Blitzkrieg (kenapa Prancis kalah 6 minggu). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung (94,9 dtk mentah).
# Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (200/200 kata). Sinkron: tighten.py --target 90 --keep 0.3 -> mapwords.py (merge.json) -> snaponset.py -> align_scribe.py.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0): return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 20)]
END = WD[-1]['e'] + .6
sfx = np.zeros(N)
def rumble(dur, g=1.0):
    n = int(dur * SR); t = T(n); x = lp(rng.standard_normal(n), 140) * (.7 + .3 * np.sin(2 * np.pi * 9 * t)) * 3
    return x * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .3) * g
def drone_plane(dur, g=1.0):
    n = int(dur * SR); t = T(n); f = 95 + 40 * np.exp(-((t - dur * .6) ** 2) / .2)
    ph = np.cumsum(f) / SR; return lp((2 * (ph % 1) - 1), 900) * np.minimum(1, t / .2) * np.minimum(1, (dur - t) / .3) * g
def beep(f=1200, dur=.08): n = int(dur * SR); t = T(n); return np.sin(2 * np.pi * f * t) * np.minimum(1, (dur - t) / .01) * .6
def heart():
    n = int(.5 * SR); t = T(n); b = lambda t0: np.sin(2 * np.pi * 55 * (t - t0)) * np.exp(-np.maximum(0, t - t0) * 18) * (t >= t0)
    return b(0) + .7 * b(.18)
def marker(dur): n = int(dur * SR); return bp(rng.standard_normal(n), 2500, 7000) * (.6 + .4 * np.sin(2 * np.pi * 7 * T(n))) * np.minimum(1, (dur - T(n)) / .05) * .5
def splash(): n = int(.6 * SR); t = T(n); return bp(rng.standard_normal(n), 400, 5000) * np.exp(-t * 7)
def boomn(dur=.6): n = int(dur * SR); return lp(rng.standard_normal(n), 600) * np.exp(-T(n) * 6) * 2
def scratch(dur=1.0): n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 3000, 8000) * (np.sin(2 * np.pi * 9 * t) > 0) * .4
# transisi
for tt in (B[3], B[6], B[17], B[18]): place(sfx, whoosh(.36), tt - .22, .32)          # whip
for tt in (B[2], B[4], B[7], B[16], B[19]): place(sfx, chime(990, .7), tt - .05, .16)   # dissolve
# 0 HOOK
place(sfx, lp(rng.standard_normal(int(.5 * SR)), 2500) * np.exp(-T(int(.5 * SR)) * 6) * .5, 0.0, .5)
place(sfx, whoosh(.6), W(0, 'benteng'), .4); place(sfx, thud(55, .7, 1.0), W(0, 'terkuat', .3), .7); place(sfx, clang(300, 1.0), W(0, 'terkuat', .3), .2)
place(sfx, pop(700), W(0, 'kalah'), .5); place(sfx, boing(240, .4), W(0, 'kalah', .05), .35)
for i in range(4): place(sfx, pop(380 - i * 40), W(0, 'kalah', .25 + i * .07), .25)
place(sfx, chime(1320, .7), W(0, '6'), .3)
# 1 jebakan
place(sfx, scribble(), W(1, 'bukan'), .5); place(sfx, pop(520), W(1, 'jebakan', -.2), .4); place(sfx, clang(900, .4), W(1, 'jebakan', .35), .6); place(sfx, thud(120, .2, .6), W(1, 'jebakan', .35), .6)
# 2 parit
mc = W(2, 'macet'); place(sfx, thud(48, .8, 1.0), mc + .95, .8); place(sfx, boomn(), mc + .95, .5)
n4, th = W(2, '4'), W(2, 'tahun')
for k in range(5): place(sfx, tick() * 2, n4 - .1 + k * (th + .45 - n4 + .1) / 4.999, .5)
# 3 kombo
place(sfx, pop(560), W(3, 'kombo'), .45); place(sfx, rumble(W(3, 'tank', .6) - B[3]), B[3], .5)
place(sfx, drone_plane(1.6), W(3, 'pesawat', -.4), .25); place(sfx, whoosh(.7), W(3, 'pesawat', -.2), .3)
for k in range(3): place(sfx, beep(1200 + k * 300), W(3, 'radio') + k * .11, .35)
place(sfx, sparkle_sfx(), W(3, 'radio', .2), .3)
# 4-5 Maginot
place(sfx, marker(W(4, 'perbatasan', .3) - W(4, 'garis')), W(4, 'garis'), .3); place(sfx, pop(500), W(4, 'prancis'), .4)
for k in range(3): place(sfx, clang(400 + k * 80, .5), W(4, 'beton') + k * .06, .15)
place(sfx, rumble(1.2), B[5], .4); place(sfx, hp(rng.standard_normal(int(.5 * SR)), 2500) * np.exp(-T(int(.5 * SR)) * 5) * .6, W(5, 'tidak', .05), .6)
place(sfx, boing(300, .35), W(5, 'menabraknya', .3), .3)
# 6 tinju
place(sfx, whoosh(.3), W(6, 'memancing', -.1), .4); place(sfx, thud(140, .15, .4), W(6, 'menangkis'), .5)
hit = W(6, 'menghantam', .25); place(sfx, whoosh(.35), hit - .3, .45); place(sfx, thud(70, .4, 1.0), hit, .9); place(sfx, pop(300), hit, .4); place(sfx, sparkle_sfx(), hit + .2, .25)
# 7-9 umpan
place(sfx, pop(620), W(7, 'mei'), .45); place(sfx, marker(1.6), W(7, 'tangan'), .35); place(sfx, rumble(2.4), W(7, 'tangan'), .4)
place(sfx, whoosh(.8), W(8, 'bergegas', -.4), .4)
for k in range(6): place(sfx, tick() * 1.5, W(8, 'bergegas', -.3) + k * .22, .35)
place(sfx, pop(500), B[9], .45); place(sfx, sparkle_sfx(), B[9] + .3, .3)
# 10-11 sabit
place(sfx, rumble(W(11, 'laut') - W(10, 'diamdiam') + .4, .8), W(10, 'diamdiam'), .55); place(sfx, marker(W(11, 'laut') - W(10, 'diamdiam')), W(10, 'diamdiam'), .3)
place(sfx, thud(60, .5, 1.0), W(11, 'sedan'), .8); place(sfx, splash(), W(11, 'laut'), .6)
# 12-13 kantong
place(sfx, pop(700), W(12, '10'), .4); tt = W(12, 'tertutup'); place(sfx, thud(50, .7, 1.0), tt, 1.0); place(sfx, clang(220, 1.2), tt, .35)
hb = W(13, 'terkepung', -.3)
while hb < B[14] + 1.2: place(sfx, heart(), hb, .9); hb += 60 / 92
# 14 Dunkirk
place(sfx, whoosh(.6), W(14, 'kabur'), .3)
for k in range(4): place(sfx, splash() * .4, W(14, 'kabur') + .4 + k * .55, .3)
place(sfx, pop(560), W(14, '338'), .45); place(sfx, chime(660, 1.0), W(14, 'ditinggal'), .3)
# 15 runtuh
place(sfx, marker(W(15, 'jatuh') - B[15]), B[15], .3); place(sfx, rumble(W(15, 'juni', .5) - B[15]), B[15], .4)
place(sfx, thud(45, .9, 1.0), W(15, 'jatuh'), .8); place(sfx, boomn(.8), W(15, 'jatuh'), .4); place(sfx, pop(600), W(15, '14'), .45)
# 16 gerbong
place(sfx, sparkle_sfx(), W(16, 'gerbong'), .3); place(sfx, scratch(1.0), B[16] + .3, .25)
place(sfx, riser(.6), W(16, 'tempat', -.5), .25); place(sfx, chime(523, 1.2), W(16, 'tempat'), .35); place(sfx, scratch(1.0), W(16, 'tempat', .3), .25)
# 17 pelajaran
place(sfx, scribble(), W(17, 'percuma'), .4); place(sfx, rumble(1.6, .6), W(17, 'musuh', -.4), .35); place(sfx, boing(200, .5), W(17, 'depan', .1), .35)
# 18-19
for d in (0, .2, .4): place(sfx, pop(600 + d * 500), B[18] + d, .4)
ts = W(19, 'subscribe'); place(sfx, pop(560), B[19] + .08, .5)
place(sfx, tick() * 2, ts + .2, .7); place(sfx, chime(1320, 1.0), ts + .35, .45); place(sfx, sparkle_sfx(), ts + .35, .5); place(sfx, sparkle_sfx(), ts + .9, .3)
place(sfx, lp(rng.standard_normal(int(.5 * SR)), 2500) * np.exp(-T(int(.5 * SR)) * 6) * .5, END - .3, .4)   # seruput kopi (loop)
# musik
music = np.zeros(N)
import audio_lib as AL
AL.music = music
playful(0, B[2], DM, .8, glock_on=True)
sneak(B[2], B[3], .7)
playful(B[3], B[4], DMAJ, .85)
sneak(B[4], B[6], .7)
playful(B[6], B[7], DM, .8, glock_on=False)
sneak(B[7], B[10], .7)
sneak(B[10], B[12], .85); place(music, strings((50, 57, 62), B[12] - B[10], .3), B[10])
place(music, strings((50, 56, 62, 65), B[14] - B[12] + .5, .55), B[12])
place(music, strings((50, 57, 62, 66), B[15] - B[14], .4), B[14])
place(music, strings((50, 56, 62), B[16] - B[15], .5), B[15]); sneak(B[15], B[16], .6)
place(music, strings((50, 57, 62, 65), B[17] - B[16], .45), B[16])
playful(B[17], B[19], DMAJ, .9)
for k, m in enumerate([62, 66, 69, 74, 78, 81]): place(music, glock(m, .9, .26 + k * .02), B[19] - 1.3 + k * .2)
playful(B[19], END - .3, DMAJ, 1.0)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
