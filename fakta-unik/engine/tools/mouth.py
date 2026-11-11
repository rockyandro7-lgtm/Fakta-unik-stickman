"""Per-frame mouth openness (0..1) from the voice take, for lip sync.
Run from a reel folder: python <engine>/tools/mouth.py [fps]   -> web/mouth.js (const MOUTH=[...])"""
import sys, numpy as np, soundfile as sf
fps = float(sys.argv[1]) if len(sys.argv) > 1 else 24
a, sr = sf.read('audio/vo.wav'); a = a if a.ndim == 1 else a.mean(1)
hop = sr / fps; n = int(len(a) / hop) + 2
env = np.array([np.sqrt(np.mean(a[int(i * hop):int(i * hop + hop * 1.5)] ** 2)) if int(i * hop) < len(a) else 0 for i in range(n)])
ref = np.percentile(env[env > 1e-4], 90) if np.any(env > 1e-4) else 1
v = np.clip((env / ref - .3) / .7, 0, 1) ** .8
# fast attack, slower release, plus a small open/close flutter so long vowels don't freeze
out = np.zeros_like(v); cur = 0
for i, x in enumerate(v):
    cur = x if x > cur else cur * .35 + x * .65
    out[i] = cur
out = np.where(out > .08, out * (0.85 + 0.15 * np.sin(np.arange(n) * 2.1)), 0)
open('web/mouth.js', 'w').write('const MOUTH=[' + ','.join(f'{x:.2f}' for x in out) + '];')
print('frames', n, 'mean', round(float(out.mean()), 3))
