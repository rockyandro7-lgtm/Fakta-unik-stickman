# Mitos Rumahan: jemuran apek (tanpa CTA). Semua cue dari waktu kata (audio/words_new.json), aturan v6.
# Suara (audio/vo_raw.mp3): ElevenLabs eleven_v4, voice Jonathan Wiratama (QC3gSHMyKh8m20lGyUNZ), generations_count 1, prompt = script.json digabung
#   (satu take, 95,36 dtk mentah, ~1.388 kredit). Timing: Scribe eleven_scribe_v1 -> scribe_raw.json (189/189 kata, merge.json: lima -> 5, tiga -> 3; ~582 kredit).
# Sinkron: tools/sync/tighten.py --target 72 --keep 0.22 --max-tempo 1.15 (74,12 dtk) -> mapwords.py -> snaponset.py -> align_scribe.py.
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
def sniff(g=1.0):                # tarikan napas lewat hidung
    n = int(.32 * SR); t = T(n); return bp(rng.standard_normal(n), 1500, 6000) * np.sin(np.pi * t / .32) ** 2 * .35 * g
def gag():                       # "hoek" jijik
    n = int(.45 * SR); t = T(n); f = 180 - 80 * t; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .01, .3, 2) * .35 + lp(rng.standard_normal(n), 600) * env(n, .01, .2, 3) * .25
def rain(dur, g=1.0):            # hujan di luar jendela
    n = int(dur * SR); t = T(n); x = lp(hp(rng.standard_normal(n), 1200), 7000) * .05
    for _ in range(int(dur * 18)): i = rng.integers(0, n - 400); x[i:i + 400] += hp(rng.standard_normal(400), 3000) * np.exp(-T(400) * 120) * .08
    return x * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .3) * g
def thunder():
    n = int(1.8 * SR); t = T(n); return lp(rng.standard_normal(n), 220) * (np.exp(-t * 2.2) + .6 * np.exp(-((t - .35) ** 2) / .02)) * .9
def scrub(dur):                  # kucek-kucek baju
    out = np.zeros(int(dur * SR)); k = 0
    while k * .16 < dur - .15:
        n = int(.13 * SR); i = int(k * .16 * SR); x = bp(rng.standard_normal(n), 400, 2500) * np.sin(np.pi * T(n) / .13) * .35; out[i:i + n] += x[:len(out) - i]; k += 1
    return out
def glug(dur, rate=6, g=1.0):    # air dituang dari galon / botol
    out = np.zeros(int(dur * SR)); k = 0
    while k / rate < dur - .15:
        n = int(.11 * SR); t = T(n); f = 180 + rng.random() * 90; b = np.sin(2 * np.pi * np.cumsum(f * (1 + 2.5 * t)) / SR) * np.exp(-t * 28) * .5
        i = int(k / rate * SR); out[i:i + n] += b[:len(out) - i]; k += 1
    return out * g
def stream(dur, g=1.0):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 600, 4000) * np.minimum(1, t / .1) * np.minimum(1, (dur - t) / .15) * .2 * g
def trombone():                  # wah-wah gagal
    out = []
    for f, d in ((233, .22), (220, .22), (207, .22), (196, .55)):
        n = int(d * SR); t = T(n); vib = 1 + .02 * np.sin(2 * np.pi * 6 * t) * (t > .2)
        out.append(sum(np.sin(2 * np.pi * f * h * vib * t) / h for h in (1, 2, 3)) * env(n, .02, d * 3, 2) * .25)
    return np.concatenate(out)
def buzz(dur):                   # lalat
    n = int(dur * SR); t = T(n); return np.sign(np.sin(2 * np.pi * (180 + 20 * np.sin(2 * np.pi * 7 * t)) * t)) * .05 * np.minimum(1, t / .1)
def door():
    n = int(.6 * SR); t = T(n); f = 520 + 160 * np.sin(2 * np.pi * 3 * t); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .05, .5, 2) * .12
def fan(dur):                    # kipas angin
    n = int(dur * SR); t = T(n); return lp(rng.standard_normal(n), 700) * (1 + .3 * np.sin(2 * np.pi * 19 * t)) * .12 * np.minimum(1, t / .4)
def bubbles(dur, rate=10, g=1.0):
    out = np.zeros(int(dur * SR)); k = 0
    while k / rate < dur - .2:
        n = int(.09 * SR); t = T(n); f = 260 + rng.random() * 400; b = np.sin(2 * np.pi * np.cumsum(f * (1 + 3 * t)) / SR) * np.exp(-t * 40) * .3
        i = int((k / rate + rng.random() * .05) * SR); out[i:i + n] += b[:len(out) - i]; k += 1
    return out * g
def kazoo(dur, f0=300):          # pesta bakteri
    n = int(dur * SR); t = T(n); f = f0 * (1 + .06 * np.sin(2 * np.pi * 5 * t)); x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .06; return lp(x, 2500) * env(n, .02, dur, 1.5)

# suasana: hujan di sepanjang adegan rumah (di luar dunia mikro)
place(sfx, rain(B[11] + .5), 0, .5); place(sfx, rain(END - B[15]), B[15], .45)
# transisi
for tt in (B[1], B[2], B[3], W(3, 'budi', 0, 1), B[4], B[5], W(5, 'kemejanya'), B[6], B[7], B[8], B[9], B[10], B[11], B[15], W(15, 'terus'), B[16], W(16, 'rani'), B[17]): place(sfx, whoosh(.36), tt - .22, .3)
# 0 HOOK: sniff berulang, lalu jijik
k = 0
while k * .9 < W(0, 'mukanya'): place(sfx, sniff(), k * .9 + .02, .7); k += 1
place(sfx, gag(), W(0, 'mukanya'), .7); place(sfx, boing(110, .6), W(0, 'mukanya', .05), .35)
place(sfx, buzz(1.0), W(0, 'kain'), .5); place(sfx, pop(700), W(0, 'kain', -.1), .35)
# 1 baru dicuci, hujan terus
for i in range(3): place(sfx, pop(1400 + i * 200) * .4, W(1, 'dicuci') + i * .15, .25)
place(sfx, thunder(), W(1, 'hujan', -.05), .9)
# 2 cari tersangka
place(sfx, chime(392, .9) * .8, W(2, 'cari'), .25); place(sfx, thud(60, .4, .7), W(2, 'tersangka'), .45)
# 3a tersangka 1, 3b paling mahal, kucek
place(sfx, thud(70, .35, .6), B[3], .4); place(sfx, pop(500), W(3, 'murah'), .4)
for i in range(4): place(sfx, pop(420 + i * 40), W(3, 'dibeli') + i * .08, .2)
place(sfx, boing(260, .3), W(3, 'budi'), .3)
place(sfx, sparkle_sfx(), W(3, 'mahal'), .45); place(sfx, chime(1568, .8), W(3, 'mahal'), .3)
place(sfx, scrub(B[4] - W(3, 'kemejanya')), W(3, 'kemejanya'), .7)
# 4 tetap bau
place(sfx, sniff(), B[4] + .1, .7); place(sfx, sniff(), B[4] + .55, .6); place(sfx, gag(), W(4, 'tetap'), .6); place(sfx, trombone(), W(4, 'bau'), .5)
# 5 tersangka 2 (sumur), galon
place(sfx, thud(70, .35, .6), B[5], .4); place(sfx, bubbles(.8, 8), W(5, 'sumur'), .3)
place(sfx, glug(B[6] - W(5, 'pakai'), 6), W(5, 'pakai'), .55); place(sfx, stream(B[6] - W(5, 'pakai')), W(5, 'pakai'), .4)
# 6 masih apek, 2 galon habis
place(sfx, boing(120, .5), W(6, 'apek'), .35); place(sfx, buzz(.9), W(6, 'masih'), .4)
for i in range(2): place(sfx, thud(110 + i * 20, .25, .5), W(6, 'habis') + i * .25, .4)
# 7 senjata terakhir: pewangi
place(sfx, riser(.9), W(7, 'senjata', -.4), .25); place(sfx, sparkle_sfx(), W(7, 'pewangi'), .5); place(sfx, chime(2093, .9), W(7, 'pewangi'), .3)
place(sfx, glug(B[8] - W(7, 'satu'), 7), W(7, 'satu', .1), .45)
# 8 wangi bunga -> sejam -> bunga + kain pel
place(sfx, sparkle_sfx(), W(8, 'wangi'), .35); place(sfx, chime(1760, .8), W(8, 'bunga'), .2)
for i in range(10): place(sfx, tick(), W(8, 'sejam') + i * .09, .25)
place(sfx, buzz(1.3), W(8, 'baunya'), .45); place(sfx, gag(), W(8, 'kain'), .45)
# 9 Budi: taman bunga kebanjiran
place(sfx, pop(900), W(9, 'nutup'), .3); place(sfx, pop(560), W(9, 'taman'), .35); place(sfx, noise(.6, 500, 4) * .6, W(9, 'kebanjiran'), .4)
# 10 Ibu pulang: pintu, langkah, sniff, geleng
place(sfx, door(), B[10] + .05, .5)
for i in range(4): place(sfx, pop(380 + (i % 2) * 40), W(10, 'ibu') + i * .25, .15)
place(sfx, sniff(1.2), W(10, 'nyium'), .7); place(sfx, sniff(), W(10, 'sekali', -.1), .5)
for i in range(4): place(sfx, whoosh(.12) * .5, W(10, 'gelenggeleng') + i * .14, .2)
# 11 bukan sabun -> portal ke serat kemeja -> bakteri
place(sfx, pop(500), W(11, 'sabun'), .4); place(sfx, riser(.8), B[11] + .9, .3); place(sfx, whoosh(.6), W(11, 'tapi', -.35), .5)
for i in range(4): place(sfx, pop(320 + i * 70), W(11, 'bakteri', -.05) + i * .1, .45)
place(sfx, stream(1.2), W(11, 'nggak', -.1), .5); place(sfx, bubbles(1.2, 16), W(11, 'nggak'), .4)
# 12 ngumpet, cepat kering, diam (zzz)
for i in range(3): place(sfx, pop(700 - i * 80), W(12, 'ngumpet') + i * .12, .3)
place(sfx, whoosh(.8), W(12, 'cepat'), .5); place(sfx, chime(523, 1.2) * .6, W(12, 'diam'), .3)
# 13 basah kelamaan, 5 jam, pesta, kotoran
place(sfx, bubbles(1.0, 6), W(13, 'basahnya'), .35)
for i in range(12): place(sfx, tick(), W(13, 'lebih') + i * .07, .25)
place(sfx, kazoo(1.4), W(13, 'pesta'), .7); place(sfx, kazoo(1.2, 400), W(13, 'pesta', .15), .5)
for i in range(5): place(sfx, pop(260 + i * 30), W(13, 'kotorannya') + i * .09, .45)
place(sfx, buzz(1.3), W(13, 'bau'), .5)
# 14 pewangi cuma nutupin; tetes, bakteri bangun
place(sfx, sparkle_sfx(), W(14, 'pewangi'), .4)
for i in range(6): place(sfx, pop(1200 + i * 120) * .5, W(14, 'nutupin') + i * .07, .2)
place(sfx, boing(240, .3), W(14, 'bakterinya'), .25); place(sfx, pop(1500), W(14, 'lembap', .05), .6); place(sfx, boing(160, .4), W(14, 'lagi'), .3)
# 15 air panas, jarak, kipas
place(sfx, noise(.9, 2000, 3) * .5, W(15, 'rendam'), .5); place(sfx, bubbles(1.6, 12), W(15, 'air'), .4)
for i in range(4): place(sfx, pop(300) * .7, W(15, 'panas', .2) + i * .12, .3)
for i in range(3): place(sfx, pop(800 + i * 120), W(15, 'jarak', -.2) + i * .12, .3)
place(sfx, pop(1000), W(15, 'kipas'), .35); place(sfx, fan(END - W(15, 'kipas')), W(15, 'kipas'), .5)
# 16 3 jam, kering, nggak bau
for i in range(14): place(sfx, tick(), B[16] + i * .06, .25)
place(sfx, sparkle_sfx(), W(16, 'kering'), .5); place(sfx, chime(1568, .9), W(16, 'kering'), .35)
place(sfx, sniff(), W(16, 'rani') + .1, .7); place(sfx, sniff(), W(16, 'lagi'), .6); place(sfx, sparkle_sfx(), W(16, 'nggak'), .5); place(sfx, chime(2093, 1.0), W(16, 'apaapa'), .35)
# 17 lancar; Budi masih ingat -> whip kembali ke frame 0
place(sfx, chime(1568, .6), W(17, 'lancar'), .3); place(sfx, sparkle_sfx(), W(17, 'lancar'), .4)
place(sfx, boing(150, .5), W(17, 'ingat'), .3); place(sfx, buzz(1.0), W(17, 'ingat', .2), .35)
place(sfx, whoosh(.7), W(17, 'malam', .1), .5)
place(sfx, sniff(), END - .5, .6)

# ---- musik ----
music = np.zeros(N)
import audio_lib as AL
AL.music = music
sneak(0, B[3], .85)
place(music, strings((45, 52, 57), B[4] - B[3], .25), B[3]); sneak(B[3], B[4], .7)
place(music, strings((45, 52, 57), B[5] - B[4], .3), B[4])
sneak(B[5], B[7], .85)
playful(B[7], W(8, 'baunya'), DMAJ, .8)
sneak(W(8, 'baunya'), B[10], .8)
playful(B[10], B[11], DM, .55, stabs=False)
place(music, strings((50, 57, 62, 65), B[15] - B[11], .22), B[11]); sneak(B[11], W(13, 'pesta'), .7)
playful(W(13, 'pesta'), B[14], DM, .8)
sneak(B[14], B[15], .75)
playful(B[15], W(17, 'malam'), DMAJ, .85)
for k, m in enumerate([62, 66, 69, 74, 78, 81]): place(music, glock(m, .9, .26 + k * .02), W(16, 'nggak', -.1) + k * .1)
sneak(W(17, 'malam'), END, .9)
music = lp(music, 6000)
finish(music, sfx, music_gain=.2, sfx_gain=.75)
