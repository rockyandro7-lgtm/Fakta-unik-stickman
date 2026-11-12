"""Tempel awal tiap kalimat ke onset suara yang sebenarnya (aturan v6: selisih <= 60 ms).

Scribe cenderung menandai kata pertama kalimat 40-110 ms SETELAH suara mulai, jadi caption/shot terlambat 1-3 frame.
Jalankan dari folder episode SETELAH mapwords.py dan SEBELUM align_scribe.py:
  python <skill>/tools/sync/snaponset.py scribe_words.json [--max 0.2] [--noise -38dB]
Membaca audio/vo.wav + script.json, menggeser `start` kata pertama tiap kalimat (kecuali kalimat 0) ke onset terdekat
yang LEBIH AWAL (maks --max dtk). Idempoten. Jika shots.js sudah dibuat dengan timing lama, hapus audio/words_ref.json
dulu supaya warp = identitas (shots.js memakai WORDS baru langsung).
"""
import argparse, json, re, subprocess
ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('--max', type=float, default=.2); ap.add_argument('--noise', default='-38dB')
a = ap.parse_args()
log = subprocess.run(['ffmpeg', '-v', 'info', '-i', 'audio/vo.wav', '-af', f'silencedetect=noise={a.noise}:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
on = [float(v) for v in re.findall(r'silence_end: ([\d.]+)', log)]
sw = json.load(open(a.src)); ws = sw['words'] if isinstance(sw, dict) else sw
ws = [w for w in ws if w.get('type', 'word') == 'word']
lines = json.load(open('script.json')); firsts, k = [], 0
for L in lines: firsts.append(k); k += len(L.split())
if k != len(ws): raise SystemExit(f'jumlah kata naskah {k} != Scribe {len(ws)}: pakai merge.json dulu (mapwords.py)')
n = 0
for i, j in enumerate(firsts[1:], 1):
    s = float(ws[j]['start']); x = min(on, key=lambda v: abs(v - s), default=None)
    if x is not None and 0.015 < s - x <= a.max: ws[j]['start'] = round(x + .01, 3); n += 1; print(f'kalimat {i} "{ws[j]["text"]}": {s:.3f} -> {ws[j]["start"]:.3f}')
json.dump(sw, open(a.src, 'w'), ensure_ascii=False); print(n, 'awal kalimat ditempel ke onset')
