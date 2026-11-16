# Mitos Rumahan & Fakta Unik: Palagan Ambarawa (seri perang sejarah Indonesia #1, tanpa CTA, loop). Semua cue dari waktu kata (aturan v6).
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   ("Soedirman" ditulis "Sudirman" di prompt; 64,4 dtk mentah, ~896 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (123/123 kata).
# Sinkron: tools/sync/tighten.py --target 60 --keep 0.28 --max-tempo 1.08 -> mapwords.py (merge.json) -> snaponset.py -> align_scribe.py.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0): return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 14)]
END = WD[-1]['e'] + .6
sfx = np.zeros(N)
def rumble(dur, g=1.0):
    n = int(dur * SR); t = T(n); x = lp(rng.standard_normal(n), 140) * (.7 + .3 * np.sin(2 * np.pi * 9 * t)) * 3
    return x * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .3) * g
def drone_plane(dur, g=1.0):
    n = int(dur * SR); t = T(n); f = 95 + 40 * np.exp(-((t - dur * .6) ** 2) / .2)
    ph = np.cumsum(f) / SR; return lp((2 * (ph % 1) - 1), 900) * np.minimum(1, t / .2) * np.minimum(1, (dur - t) / .3) * g
def boomn(dur=.6): n = int(dur * SR); return lp(rng.standard_normal(n), 600) * np.exp(-T(n) * 6) * 2
def gun(n=6, gap=.07):
    out = np.zeros(int((n * gap + .2) * SR))
    for k in range(n): place(out, hp(rng.standard_normal(int(.06 * SR)), 1500) * np.exp(-T(int(.06 * SR)) * 60) * 1.4, k * gap, 1)
    return out
def steps(t0, t1, gap=.32, g=.3):
    t = t0
    while t < t1: place(sfx, thud(110, .08, .5), t, g); t += gap
def wave_sfx(dur): n = int(dur * SR); t = T(n); return lp(rng.standard_normal(n), 900) * (.5 + .5 * np.sin(2 * np.pi * .5 * t)) * np.minimum(1, t / .4) * np.minimum(1, (dur - t) / .4)
def snap(): n = int(.18 * SR); t = T(n); return hp(rng.standard_normal(n), 2500) * np.exp(-t * 40) * 1.2 + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 60) * .5

# transisi
place(sfx, chime(990, .7), B[1] - .05, .16); place(sfx, whoosh(.36), B[3] - .22, .32); place(sfx, chime(660, .9), B[4] - .05, .14)
place(sfx, chime(880, .7), B[5] - .05, .1); place(sfx, whoosh(.36), B[6] - .22, .32); place(sfx, chime(990, .7), B[7] - .05, .14)
place(sfx, chime(523, .9), B[9] - .05, .14); place(sfx, whoosh(.36), B[12] - .22, .32); place(sfx, chime(990, .7), B[13] - .05, .14)
# 0 HOOK: panah menjepit di frame 0, Sekutu kaget di "ngusir", "pemenang"
place(sfx, whoosh(.6), 0.0, .45); place(sfx, rumble(1.2, .6), 0.0, .35)
place(sfx, pop(700), W(0, '29'), .45); place(sfx, chime(1320, .6), W(0, '29', .05), .25)
place(sfx, pop(520), W(0, 'ngusir'), .5); place(sfx, boing(240, .4), W(0, 'ngusir', .05), .35); place(sfx, thud(60, .4, .8), W(0, 'ngusir'), .5)
place(sfx, sparkle_sfx(), W(0, 'menang'), .35); place(sfx, chime(1568, .6), W(0, 'menang', .05), .2)
# 1 kapal mendarat, lingkaran malaikat
place(sfx, wave_sfx(3.2), B[1], .35); place(sfx, pop(620), W(1, 'oktober'), .4)
place(sfx, thud(90, .25, .6), W(1, 'mendarat', .1), .5); place(sfx, splash() if 'splash' in globals() else whoosh(.4), W(1, 'mendarat'), .3)
place(sfx, chime(1760, 1.0), W(1, 'cuma'), .3); place(sfx, sparkle_sfx(), W(1, 'cuma', .05), .3); place(sfx, pop(560), W(1, 'tawanan'), .35)
# 2 Belanda nebeng, penjara, senapan
place(sfx, boing(180, .5), W(2, 'tapi'), .35); place(sfx, pop(480), W(2, 'belanda'), .45); place(sfx, boing(320, .4), W(2, 'nebeng'), .4)
place(sfx, pop(600), W(2, 'tawanan', -.3), .35); place(sfx, clang(700, .6), W(2, 'dibebasin'), .3); place(sfx, whoosh(.4), W(2, 'dibebasin', .1), .25)
place(sfx, snap(), W(2, 'senjata'), .6); place(sfx, snap(), W(2, 'senjata', .1), .5); place(sfx, sparkle_sfx(), W(2, 'senjata', .1), .2)
# 3 Magelang meledak, Sekutu mundur
place(sfx, boomn(), W(3, 'pecah'), .7); place(sfx, thud(48, .8, 1.0), W(3, 'pecah'), .8); place(sfx, gun(8), W(3, 'pecah', .3), .3)
steps(W(3, 'mundur', -.1), W(3, 'ambarawa', .5), .16, .25); place(sfx, whoosh(.8), W(3, 'mundur'), .35)
# 4 Isdiman: pesawat lewat, tembakan, sunyi
place(sfx, pop(560), W(4, '26'), .4); place(sfx, pop(500), W(4, 'letnan'), .35)
place(sfx, drone_plane(W(4, 'pesawat', .4) - W(4, 'isdiman', -.2), .9), W(4, 'isdiman', -.2), .45)
place(sfx, gun(10, .055), W(4, 'gugur', -.25), .45); place(sfx, thud(70, .3, .6), W(4, 'gugur', .4), .4)
# 5 Soedirman datang
steps(B[5], W(5, 'soedirman', .1), .38, .35); place(sfx, chime(784, 1.2), W(5, 'kolonel'), .3); place(sfx, pop(520), W(5, 'kolonel'), .35)
steps(W(5, 'turun'), W(5, 'langsung', .6), .2, .25)
# 6 udang
place(sfx, pop(420), B[6], .45); place(sfx, boing(260, .4), B[6] + .05, .3); place(sfx, pop(700), W(6, 'supit'), .45)
place(sfx, snap(), W(6, 'capit', .05), .9); place(sfx, sparkle_sfx(), W(6, 'udang'), .3)
# 7 panah tumbuh
for k in ('depan', 'kiri', 'kanan'): place(sfx, whoosh(.5), W(7, k, -.35), .35); place(sfx, pop(600), W(7, k), .4)
place(sfx, rumble(W(8, 'jalan') - W(7, 'nekan'), .7), W(7, 'nekan'), .3)
# 8 jalan putus
place(sfx, tick() * 2, W(8, 'jalan'), .4); place(sfx, tick() * 2, W(8, 'jalan', .2), .4); place(sfx, whoosh(.6), W(8, 'terancam', -.1), .35)
place(sfx, snap(), W(8, 'putus'), .7); place(sfx, boing(150, .5), W(8, 'putus', .1), .3)
# 9 malam -> SERBU
for k in range(6): place(sfx, tick(), W(9, 'jam') + k * .35, .25)
place(sfx, chime(523, .8), W(9, 'setengah'), .25); place(sfx, riser(W(9, 'serangan') - W(9, 'pagi')), W(9, 'pagi'), .3)
place(sfx, boomn(), W(9, 'serangan'), .8); place(sfx, thud(50, .7, 1.0), W(9, 'serangan'), .8); place(sfx, gun(12, .06), W(9, 'serangan', .1), .35)
for k in range(5): place(sfx, boomn(.4), W(9, 'serangan', .12 * k), .3)
# 10 empat hari
for k in ('satu', 'dua', 'tiga', 'empat'): place(sfx, boomn(.5), W(10, k), .5); place(sfx, thud(60, .4, .8), W(10, k), .5); place(sfx, pop(500), W(10, k, .05), .3)
# 11 mundur ke Semarang, bendera naik
steps(W(11, 'mundur', -.1), W(11, 'semarang', .5), .14, .25); place(sfx, whoosh(.9), W(11, 'mundur'), .35)
place(sfx, sparkle_sfx(), W(11, 'semarang', .1), .4); place(sfx, chime(1568, 1.0), W(11, 'semarang', .1), .3)
# 12 Panglima Besar
place(sfx, pop(620), W(12, 'tiga'), .4); place(sfx, chime(1320, 1.2), W(12, 'dilantik', .05), .4); place(sfx, sparkle_sfx(), W(12, 'dilantik', .1), .4)
place(sfx, pop(700), W(12, 'panglima'), .45); place(sfx, sparkle_sfx(), W(12, 'besar', .2), .35)
# 13 rewind ke frame 0
rw0, rw1 = W(13, 'itu'), END - .6
n = int((rw1 - rw0) * SR); tt = T(n); place(sfx, bp(rng.standard_normal(n), 1500, 6000) * (.5 + .5 * np.sin(2 * np.pi * 14 * tt)) * np.minimum(1, tt / .2) * .5, rw0, .3)
place(sfx, whoosh(.6, up=False), rw1 - .3, .35)

# ---- musik: tegang (sneak) di bagian serangan, hangat di kemenangan ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
sneak(0, B[1], .9)
playful(B[1], B[2], DM, .65, glock_on=False)
sneak(B[2], B[4], .8)
place(music, strings((50, 53, 57), B[5] - B[4], .35), B[4])                     # Isdiman: hanya pad
place(music, strings((50, 57, 62), B[6] - B[5], .3), B[5]); sneak(B[5], B[6], .5)
playful(B[6], B[7], DM, .7, glock_on=True)
sneak(B[7], B[9], .9); place(music, strings((50, 56, 62), B[9] - B[8], .3), B[8])
sneak(B[9], B[11], 1.0); place(music, strings((50, 56, 62, 65), B[11] - B[10], .4), B[10])
playful(B[11], B[13], DMAJ, .95)
for k, m in enumerate([62, 66, 69, 74, 78, 81]): place(music, glock(m, .9, .26 + k * .02), W(12, 'dilantik', -.2) + k * .12)
sneak(B[13], END, .8)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
