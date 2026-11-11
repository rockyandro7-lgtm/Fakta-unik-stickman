"""Padatkan jeda suara + samakan durasi ke target, sambil menyimpan PETA WAKTU (aturan v6: semua timing dari audio final).

Jalankan dari folder episode:
  python <skill>/tools/sync/tighten.py audio/vo_raw.mp3 --target 44.4 [--keep 0.24] [--max-tempo 1.10]
Hasil:
  audio/vo.wav          suara final (hening awal/akhir dipangkas, jeda > keep dipendekkan, lalu atempo agar = target)
  audio/timemap.json    {"anchors": [[t_mentah, t_final], ...], "tempo": x} (linear per potong)
  audio/trim_offset.txt 0.000 (align_scribe.py tidak perlu menggeser lagi; pakai mapwords.py untuk memetakan kata)
"""
import argparse, json, os, re, subprocess
import numpy as np, soundfile as sf
ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('--target', type=float, default=0)
ap.add_argument('--keep', type=float, default=.24); ap.add_argument('--noise', default='-38dB'); ap.add_argument('--max-tempo', type=float, default=1.10)
a = ap.parse_args(); os.makedirs('audio', exist_ok=True); SR = 44100
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a.src, '-ac', '1', '-ar', str(SR), 'audio/vo_full.wav'], check=True)
x, _ = sf.read('audio/vo_full.wav'); dur = len(x) / SR
log = subprocess.run(['ffmpeg', '-v', 'info', '-i', 'audio/vo_full.wav', '-af', f'silencedetect=noise={a.noise}:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
st = [float(v) for v in re.findall(r'silence_start: ([\d.]+)', log)]; en = [float(v) for v in re.findall(r'silence_end: ([\d.]+)', log)]
if len(en) < len(st): en.append(dur)
sil = list(zip(st, en))
# potongan yang dibuang: [mulai, akhir] dalam waktu mentah
cuts = []
for s, e in sil:
    if s <= .02: cuts.append((0, max(0, e - .03)))                    # hening awal: sisakan 30 ms
    elif e >= dur - .02: cuts.append((min(dur, s + .12), dur))         # hening akhir: sisakan 120 ms
    elif e - s > a.keep: m = (s + e) / 2; cuts.append((m - (e - s - a.keep) / 2, m + (e - s - a.keep) / 2))
keep, pos = [], 0.0
for s, e in cuts:
    if s > pos: keep.append((pos, s))
    pos = e
if pos < dur: keep.append((pos, dur))
F = int(.004 * SR); out, anchors, tcur = [], [], 0.0
for s, e in keep:
    seg = x[int(s * SR):int(e * SR)].copy(); n = min(F, len(seg) // 2)
    if n: seg[:n] *= np.linspace(0, 1, n); seg[-n:] *= np.linspace(1, 0, n)
    anchors.append([s, tcur]); tcur += len(seg) / SR; anchors.append([e, tcur]); out.append(seg)
y = np.concatenate(out); tight = len(y) / SR
tempo = 1.0
if a.target and tight > a.target: tempo = min(a.max_tempo, tight / a.target)
sf.write('audio/vo_tight.wav', y, SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/vo_tight.wav', '-af', f'atempo={tempo:.5f}', '-ar', str(SR), 'audio/vo.wav'], check=True)
final = len(sf.read('audio/vo.wav')[0]) / SR; k = final / tight
json.dump({'anchors': [[round(r, 4), round(f * k, 4)] for r, f in anchors], 'tempo': tempo, 'raw': dur, 'final': final}, open('audio/timemap.json', 'w'))
open('audio/trim_offset.txt', 'w').write('0.000'); os.remove('audio/vo_tight.wav')
print(f'mentah {dur:.2f}s -> jeda dipadatkan {tight:.2f}s ({len(cuts)} potong) -> atempo {tempo:.3f} -> final {final:.2f}s')
