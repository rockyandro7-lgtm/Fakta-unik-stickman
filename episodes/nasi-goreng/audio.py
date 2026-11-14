# Mitos Rumahan: nasi goreng calon mertua (tanpa CTA). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 81,76 dtk mentah, ~1.204 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (164/164 kata, merge.json: gak -> Nggak).
# Sinkron: tools/sync/tighten.py --target 66 --keep 0.26 --max-tempo 1.12 (67,59 dtk) -> mapwords.py -> snaponset.py -> align_scribe.py.
from audio_lib import *
import json
WD = json.load(open('audio/words_new.json'))
n_ = lambda x: ''.join(ch for ch in x.lower() if ch.isalnum())
def W(line, key, d=0.0, k=0):
    return [w['s'] for w in WD if w['line'] == line and n_(w['w']) == key][k] + d
LS = lambda i: next(w['s'] for w in WD if w['line'] == i)
B = [0] + [LS(i) for i in range(1, 17)]
END = WD[-1]['e'] + .6
noise = lambda dur, f=900, dec=22: hp(rng.standard_normal(int(dur * SR)), f) * np.exp(-T(int(dur * SR)) * dec)
def sizzle(dur, g=1.0):          # minyak panas: desis berbutir
    n = int(dur * SR); t = T(n); x = bp(rng.standard_normal(n), 2500, 9000) * (0.55 + .45 * (rng.random(n) > .985))
    return x * np.minimum(1, t / .08) * np.minimum(1, (dur - t) / .2) * .4 * g * .3
def scrape(dur=.22):             # sutil menggesek wajan
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 1800, 6000) * np.sin(np.pi * np.clip(t / dur, 0, 1)) * .25
def blup(f=180):                 # gelembung bubur kental
    n = int(.18 * SR); t = T(n); fr = f * (1 + 2.5 * t); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 18) * .35
def squelch():                   # lengket
    n = int(.3 * SR); t = T(n); return lp(rng.standard_normal(n), 900) * np.exp(-t * 9) * (0.6 + .4 * np.sin(2 * np.pi * 30 * t)) * .45
def knock(f=900):
    n = int(.08 * SR); t = T(n); return (np.sin(2 * np.pi * f * t) * .7 + lp(rng.standard_normal(n), 3000) * .5) * np.exp(-t * 70)
def stirs(t0, t1, sp):           # satu gesekan tiap setengah putaran aduk (sama dengan stirG di shots.js)
    P = np.pi / sp; k = 0
    while t0 + k * P < t1: place(sfx, scrape(min(.22, P * .8)), t0 + k * P, .3) if k % 2 == 0 else None; k += 1
def ticks(t0, t1, every=.5, g=.3):
    k = 0
    while t0 + k * every < t1: place(sfx, tick(), t0 + k * every, g); k += 1

# transisi
for tt in (B[2], B[3], B[4], B[5], B[6], B[7], B[8], B[9], B[10], B[11], B[12], B[13], B[15]): place(sfx, whoosh(.36), tt - .22, .3)
place(sfx, chime(990, .9), B[1] - .05, .2)                                  # dissolve ke flashback
# 0 HOOK: bubur mendidih, aduk panik, jam berdetak
place(sfx, sizzle(B[1]), 0, .7); stirs(0, B[1], 16)
for i in range(6): place(sfx, blup(150 + i * 25), .2 + i * .7, .45)
ticks(0, B[1], .5, .35)
place(sfx, pop(700), W(0, '40'), .5); place(sfx, boing(110, .6), W(0, 'bubur'), .4); place(sfx, clang(600, .5), W(0, 'bubur'), .15)
# 1 flashback pagi
place(sfx, tweet(), B[1] + .3, .25); place(sfx, tweet(), B[1] + 1.1, .2)
place(sfx, pop(640), W(1, 'pakai'), .4); place(sfx, sparkle_sfx(), W(1, 'kulkas'), .3)
# 2 kulkas: buka, dingin, TOK TOK, kerikil
place(sfx, noise(.35, 300, 8) * .6, W(2, 'buka', -.05), .45); place(sfx, chime(2093, .6), W(2, 'dingin'), .25)
for h in (W(2, 'keras'), W(2, 'keras', .25)): place(sfx, knock(), h, .7)
place(sfx, pop(520), W(2, 'kering'), .35); place(sfx, thud(90, .25, .6), W(2, 'kerikil'), .4)
# 3 nasi sisa?
place(sfx, boing(160, .5), W(3, 'sisa'), .35); place(sfx, noise(.3, 600, 10) * .5, W(3, 'dikasih'), .3)
# 4 magic com: pulen, wangi, ngepul
place(sfx, pop(880), W(4, 'baru', -.1), .4); place(sfx, chime(1568, .8), W(4, 'pulen'), .3); place(sfx, sparkle_sfx(), W(4, 'pulen'), .3)
place(sfx, chime(1760, .8), W(4, 'wangi'), .25); place(sfx, hp(rng.standard_normal(int(1.2 * SR)), 2500) * np.exp(-T(int(1.2 * SR)) * 2) * .4, W(4, 'ngepul'), .4)
# 5 masuk wajan, aduk, nempel
place(sfx, thud(70, .3, .9), W(5, 'wajan', -.05), .6); place(sfx, sizzle(B[6] - W(5, 'wajan'), 1.2), W(5, 'wajan'), .7)
stirs(W(5, 'diaduk'), B[6], 7); place(sfx, squelch(), W(5, 'nempel'), .6)
# 6 aduk lagi, pecah, lengket
place(sfx, sizzle(B[7] - B[6]), B[6], .6); stirs(B[6], B[7], 11)
for h in (W(6, 'pecah'), W(6, 'pecah', .2)): place(sfx, crunch_ := (hp(rng.standard_normal(int(.06 * SR)), 1500) * np.exp(-T(int(.06 * SR)) * 60)), h, .5)
place(sfx, squelch(), W(6, 'lengket'), .8); place(sfx, squelch(), W(6, 'lengket', .25), .5)
# 7 Budi lewat, ngintip, bubur ayam?
place(sfx, sizzle(B[8] - B[7], .7), B[7], .5); stirs(B[7], B[8], 4)
for i in range(4): place(sfx, pop(420 + i * 30), W(7, 'lewat') + i * .22, .15)
place(sfx, pop(700), W(7, 'ngintip'), .3)
for i in range(4): place(sfx, pop(520 + i * 60), W(7, 'ayam', .05) + i * .16, .35)
# 8 & 10 jam: tinggal 30 / 10 menit
for i, m in ((8, '30'), (10, '10')):
    ticks(B[i], B[i + 1], .09, .35); place(sfx, clang(880, .7), W(i, m), .35); place(sfx, thud(55, .5, 1.0), W(i, m), .5); place(sfx, heartbeat(), W(i, m, .1), .4)
# 9 minyak, api besar, gosong
place(sfx, sizzle(B[10] - B[9], 1.4), B[9], .7)
place(sfx, noise(.6, 400, 4) * .5, W(9, 'minyak', -.1), .4); place(sfx, whoosh(.6), W(9, 'digedein', -.1), .6); place(sfx, thud(50, .5, .8), W(9, 'digedein'), .5)
stirs(W(9, 'apinya'), B[10], 13)
place(sfx, noise(.8, 200, 3) * .6, W(9, 'gosong'), .5); place(sfx, boing(120, .5), W(9, 'lembek'), .35)
# 11 pasrah, ambil nasi kulkas, masuk wajan
place(sfx, noise(.35, 300, 8) * .5, W(11, 'ambil', -.1), .35); place(sfx, chime(2093, .5), W(11, 'kerikil'), .2)
for i in range(6): place(sfx, tick(), W(11, 'kulkas', .2) + i * .3, .15)
place(sfx, thud(80, .3, 1.0), W(11, 'wajan'), .7)
# 12 buyar satu-satu
place(sfx, sizzle(B[13] - W(12, 'buyar', -.2), 1.6), W(12, 'buyar', -.2), .8)
place(sfx, sparkle_sfx(), W(12, 'buyar'), .45); place(sfx, chime(1568, .9), W(12, 'buyar'), .3)
for k in range(3): place(sfx, scrape(), W(12, 'satusatu') + k * .28, .5)
place(sfx, chime(2093, .8), W(12, 'nempel'), .3)
# 13 Ibu pulang, geleng-geleng
for i in range(5): place(sfx, pop(380 + (i % 2) * 40), B[13] + .2 + i * .4, .15)
place(sfx, pop(560), W(13, 'lihat'), .3)
for i in range(3): place(sfx, tick(), W(13, 'gelenggeleng') + i * .22, .4)
# 14 lup: basah, diaduk, hancur jadi lem
place(sfx, riser(.6), B[14] - .3, .2); place(sfx, pop(900), B[14] + .1, .45)
for i in range(3): place(sfx, drip_ := (np.sin(2 * np.pi * np.cumsum(1400 * (1 + 1.2 * T(int(.14 * SR)) * 8)) / SR) * np.exp(-T(int(.14 * SR)) * 35) * .6), W(14, 'basah') + i * .3, .3)
place(sfx, squelch(), W(14, 'hancur'), .8); place(sfx, boing(140, .5), W(14, 'lem'), .4)
# 15 lup: keras, kering, kegoreng (desis) bukan kekukus (uap)
for h in (W(15, 'mengeras'), W(15, 'mengeras', .2)): place(sfx, knock(1200), h, .5)
place(sfx, chime(1760, .6), W(15, 'kering'), .25)
place(sfx, sizzle(1.2, 1.5), W(15, 'kegoreng'), .8); place(sfx, chime(2093, .8), W(15, 'kegoreng', .1), .3)
place(sfx, hp(rng.standard_normal(int(.9 * SR)), 2000) * np.exp(-T(int(.9 * SR)) * 3) * .4, W(15, 'kekukus'), .4); place(sfx, boing(150, .4), W(15, 'kekukus', .2), .3)
# 16 calon mertua nambah -> whip kembali ke frame 0
for k in ('nambah', 'kali'): place(sfx, pop(760), W(16, k), .45); place(sfx, chime(1568, .6), W(16, k, .05), .25)
place(sfx, whoosh(.7), W(16, 'dengan', .1), .5)
place(sfx, sizzle(END - W(16, 'paling'), 1.0), W(16, 'paling'), .6); ticks(W(16, 'paling'), END, .5, .3)

# ---- musik ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
sneak(0, B[1], .9)
playful(B[1], B[3], DMAJ, .7, glock_on=False)
sneak(B[3], B[4], .6)
playful(B[4], B[5], DMAJ, .8)                                   # gagal palsu: nasi baru tampak sempurna
sneak(B[5], B[8], .8)
place(music, strings((50, 56, 62), B[9] - B[8], .3), B[8]); sneak(B[8], B[11], .95)
place(music, strings((45, 52, 57), B[12] - B[11], .3), B[11])
playful(B[12], B[14], DMAJ, .9)
place(music, strings((50, 57, 62, 65), B[16] - B[14], .25), B[14]); playful(B[14], B[16], DM, .55, stabs=False)
playful(B[16], W(16, 'dengan'), DMAJ, .9)
for k, m in enumerate([62, 66, 69, 74, 78, 81]): place(music, glock(m, .9, .26 + k * .02), W(16, 'nambah', -.2) + k * .12)
sneak(W(16, 'dengan'), END, .9)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
