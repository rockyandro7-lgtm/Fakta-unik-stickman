# Synthesised bed + hits, placed at the same word timestamps the visuals use.
import json, sys, numpy as np, wave
ROOT = sys.argv[1]; SR = 48000; DUR = 45.0
W = json.load(open(f'{ROOT}/audio/words.json'))
def wt(word, n=1):
    c = 0
    for w in W:
        if w['w'].strip('.,?:!').lower() == word: 
            c += 1
            if c == n: return w['s']
N = int(SR * DUR); t = np.arange(N) / SR; rng = np.random.default_rng(1)
out = np.zeros(N)
def lp(x, a):  # one-pole lowpass
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
# low drone, slowly swelling, with tension pulse
drone = 0.5 * np.sin(2 * np.pi * 55 * t) + 0.3 * np.sin(2 * np.pi * 82.4 * t + 0.4 * np.sin(2 * np.pi * 0.2 * t)) + 0.15 * np.sin(2 * np.pi * 110 * t)
drone *= 0.55 + 0.45 * np.sin(2 * np.pi * t / 9) ** 2
pulse = np.zeros(N)
for b in np.arange(0.0, DUR, 60 / 92):  # soft heartbeat-like kick at 92 bpm
    i = int(b * SR); L = int(0.25 * SR)
    if i + L < N:
        tt = np.arange(L) / SR
        pulse[i:i + L] += np.sin(2 * np.pi * (60 * np.exp(-tt * 9) + 38) * tt) * np.exp(-tt * 14)
out += 0.10 * drone + 0.16 * pulse
def boom(at, g=1.0, dur=1.6):
    i = int(at * SR); L = min(int(dur * SR), N - i); tt = np.arange(L) / SR
    s = np.sin(2 * np.pi * (90 * np.exp(-tt * 6) + 30) * tt) * np.exp(-tt * 3.0)
    nz = lp(rng.standard_normal(L), 0.05) * np.exp(-tt * 5) * 3
    out[i:i + L] += g * 0.6 * (s + nz)
def whoosh(at, dur=0.6, g=0.35):
    i = int((at - dur) * SR); L = int(dur * SR); tt = np.linspace(0, 1, L)
    nz = rng.standard_normal(L); env = np.sin(np.pi * tt) ** 2 * tt
    out[i:i + L] += g * lp(nz, 0.08 + 0.25 * tt.mean()) * env * 3
def plane(at, dur=2.0, g=0.18):
    i = int(at * SR); L = int(dur * SR); tt = np.arange(L) / SR
    f = 140 + 260 * (tt / dur) ** 2
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sign(np.sin(ph)) * 0.5 + np.sin(ph * 2) * 0.3
    out[i:i + L] += g * lp(s, 0.2) * np.sin(np.pi * tt / dur)
def wind(at, dur, g=0.25):
    i = int(at * SR); L = min(int(dur * SR), N - i); tt = np.arange(L) / SR
    nz = lp(rng.standard_normal(L), 0.02) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * tt))
    out[i:i + L] += g * nz * 4 * np.minimum(1, tt / 0.6) * np.minimum(1, (dur - tt) / 0.6)
boom(wt('blitzkrieg'), 1.2)
for wd, n in (('sebelumnya', 1), ('jerman', 2), ('september', 1), ('mei', 1), ('sekutu', 1), ('tapi', 1), ('pelajarannya', 1)):
    whoosh(wt(wd, n))
boom(wt('september'), 0.6); boom(wt('mei'), 0.6); boom(wt('tapi'), 0.7)
boom(wt('titik'), 0.5, 1.0)
plane(wt('stuka') - 0.2)
h = wt('menghantam', 2)
for j in range(4): boom(h + j * 0.22, 0.35, 0.8)
boom(wt('jatuh'), 0.5)
wind(wt('dingin') - 0.4, DUR - wt('dingin') - 4.0)
boom(wt('perang', 3), 0.8)
# fade out the bed at the end
fade = np.ones(N); fl = int(1.0 * SR); fade[-fl:] = np.linspace(1, 0, fl); out *= fade
out = out / np.max(np.abs(out)) * 0.9
w = wave.open(f'{ROOT}/audio/sfx.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
