# Mitos Rumahan: kenapa guntur telat (guntur = suara kilat itu sendiri), tanpa CTA. Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   v2 28-11 (tanpa taruhan, lelucon tiga): satu take, 59,8 dtk mentah, ~898 kredit. Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (~365 kredit; merge.json: gak -> nggak, pake -> pakai).
# Sinkron: tools/sync/tighten.py --keep 0.22 --protect 24.3-27.9 (jeda hitungan satu... dua... tiga... dipertahankan; tanpa atempo, 53,02 dtk)
#   -> mapwords.py -> snaponset.py -> align_scribe.py.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0):
    return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 13)]
END = WD[-1]['e'] + .6
def crack():   # kilat: retakan tajam
    n = int(.5 * SR); t = T(n); x = hp(rng.standard_normal(n), 2500) * np.exp(-t * 14)
    for k in range(4): i = int((.02 + k * .05) * SR); x[i:i + 600] += rng.standard_normal(600) * np.exp(-np.arange(600) / 80) * 1.5
    return x * .5
def boom(dur=2.6, g=1.0):   # guntur: dentuman + gemuruh panjang
    n = int(dur * SR); t = T(n)
    rumble = lp(rng.standard_normal(n), 180) * (np.exp(-t * 1.6) * (1 + .5 * np.sin(2 * np.pi * 3.3 * t) * np.exp(-t)))
    hit = lp(rng.standard_normal(n), 900) * np.exp(-t * 9)
    sub = np.sin(2 * np.pi * (55 * np.exp(-t * .8) + 30) * t) * np.exp(-t * 2.2)
    return (rumble * 2.4 + hit * 1.0 + sub * .9) * np.minimum(1, t / .015) * .55 * g
def rain(dur, g=1.0):
    n = int(dur * SR); t = T(n); x = bp(rng.standard_normal(n), 1500, 7000) * .12
    for k in range(int(dur * 25)): i = int(rng.random() * (n - 300)); x[i:i + 200] += rng.standard_normal(200) * np.exp(-np.arange(200) / 30) * .25
    return x * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .3) * g
def tickc():
    n = int(.08 * SR); t = T(n); return np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 60) * .5
def meow():
    n = int(.6 * SR); t = T(n); f = 620 + 180 * np.sin(np.pi * t / .6) - 200 * t
    x = sum(np.sin(2 * np.pi * np.cumsum(f * h) / SR) / h for h in (1, 2, 3, 4)); return bp(x, 400, 4000) * env(n, .05, .5, 2) * .35
for tt in B[1:] + [W(3, 'gunturnya'), W(12, 'dan')]:
    place(sfx, whoosh(.36), tt - .22, .25)
# hujan di semua adegan rumah/langit (di bawah semuanya)
place(sfx, rain(END, .8), 0, 1.0)
# 0 hook: kilat, tutup telinga, menunggu
place(sfx, crack(), 0, .9); place(sfx, pop(500), .3, .3)
for k in range(5): place(sfx, tickc(), W(0, 'tapi') + k * .45, .5)
# 1 dilepas, DUAR
place(sfx, boom(2.8, 1.2), W(1, 'duar') - .05, 1.0)
# 2 teori awan tabrakan
place(sfx, thud(110, .3, .7), W(2, 'tabrakan'), .5); place(sfx, boing(160, .5), W(2, 'tabrakan') + .05, .3)
place(sfx, thud(70, .5, 1), W(2, 'nabrak'), .8); place(sfx, clang(300, .6) * .4, W(2, 'nabrak'), .4)
# 3 tidak setuju, lahir barengan, lelet
place(sfx, boing(300, .3), W(3, 'nggak'), .3)
place(sfx, crack(), W(3, 'lahir') - .1, .7); place(sfx, pop(900), W(3, 'barengan'), .4); place(sfx, pop(600), W(3, 'barengan') + .08, .4)
place(sfx, whoosh(.4), W(3, 'cuma'), .6)
for k in range(5): place(sfx, thud(200 - k * 8, .12, .4), W(3, 'jalannya') + k * .32, .4)
# 4 Rani tahu jarak petir tanpa ngintip
place(sfx, pop(700), W(4, 'bahkan'), .4); place(sfx, sparkle_sfx(), W(4, 'jauhnya'), .3); place(sfx, boing(240, .45), W(4, 'tanpa'), .35)
# 5 hitung satu dua tiga DUAR
place(sfx, crack(), W(5, 'kilat') - .02, .9)
for key in ('satu', 'dua', 'tiga'): place(sfx, tickc(), W(5, key), .8)
place(sfx, boom(2.6, 1.1), W(5, 'duar') - .05, 1.0)
# 6 tiga detik = 1 km
place(sfx, crack(), W(6, 'tiga'), .4); place(sfx, boom(2.2, .5), W(6, 'satu') - .2, .5); place(sfx, chime(1318, .5), W(6, 'kilo'), .35)
# 7 kilat dekat: crack + boom bersamaan
place(sfx, crack(), W(7, 'nyamber') - .02, 1.0); place(sfx, boom(3.0, 1.4), W(7, 'nyamber') + .03, 1.0); place(sfx, boom(1.6, .5), W(7, 'duar') - .05, .5)
# 8 lelucon tiga: kucing ke kolong, cicak ke balik jam, Budi ke bawah meja
place(sfx, meow(), W(8, 'kucing'), .6); place(sfx, whoosh(.4), W(8, 'ngumpet'), .4)
for k in range(8): place(sfx, tickc(), W(8, 'cicak') + k * .1, .35)
place(sfx, whoosh(.5), W(8, 'loncat'), .6); place(sfx, thud(90, .3, .8), W(8, 'meja'), .6)
# 9 mitos, suara kilat
place(sfx, thud(140, .2, .6), W(9, 'bukan'), .5); place(sfx, crack(), W(9, 'suara') - .15, .8); place(sfx, boom(2.0, .7), W(9, 'suara') - .1, .7)
# 10 panas: desis + suns pop
place(sfx, riser(3.6) * .6, W(10, 'manasin'), .4)
for k in range(5): place(sfx, pop(700 + k * 120), W(10, 'lima') + k * (W(10, 'matahari') - W(10, 'lima')) / 4, .45)
# 11 mengembang, meledak, DUAR
place(sfx, whoosh(.7), W(11, 'mengembang'), .6); place(sfx, boom(2.6, 1.3), W(11, 'meledak') - .05, .9); place(sfx, boom(1.4, .6), W(11, 'duar') - .05, .5)
# 12 Budi mau ngitung sendiri
place(sfx, pop(900), W(12, 'nyoba'), .4); place(sfx, tickc(), W(12, 'ngitung'), .5)
place(sfx, crack(), END - .03, .3)
# musik: tegang-lucu, berhenti di tiap DUAR supaya dentumannya terasa
music = np.zeros(N)
import audio_lib as AL
AL.music = music
sneak(.2, W(1, 'duar') - .1, .7)
playful(B[2], W(5, 'kilat') - .1, DM, .75)
sneak(W(5, 'kilat'), B[7] - .1, .7)
playful(B[8], B[9], DMAJ, .7)
place(music, strings((50, 57, 62, 66), B[11] - B[9], .2), B[9])
playful(B[12], END, DM, .75)
music = lp(music, 6000)
finish(music, sfx, music_gain=.18, sfx_gain=.8)
