"""Petakan timestamp Scribe (audio MENTAH) ke audio FINAL lewat audio/timemap.json, dan gabungkan angka yang dieja.

Jalankan dari folder episode:  python <skill>/tools/sync/mapwords.py scribe_raw.json [merge.json]
  merge.json (opsional): [[["nol","koma","satu"], "0,1"], [["bener"], "Benar"], ...]
  -> urutan kata Scribe diganti satu token naskah (start = kata pertama, end = kata terakhir), supaya SEMUA kata naskah
     cocok persis di align_scribe.py (tanpa interpolasi) dan caption angka jatuh tepat di ucapannya.
Hasil: scribe_words.json (waktu final) untuk align_scribe.py.
"""
import json, re, sys, os
raw = json.load(open(sys.argv[1])); raw = raw.get('words', raw) if isinstance(raw, dict) else raw
words = [dict(w) for w in raw if w.get('type', 'word') == 'word']
merges = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else []
norm = lambda s: re.sub(r'[^\w]', '', s.lower())
for seq, rep in merges:
    seq = [norm(s) for s in seq]; i = 0
    while i + len(seq) <= len(words):
        if [norm(w['text']) for w in words[i:i + len(seq)]] == seq:
            words[i:i + len(seq)] = [{'text': rep, 'type': 'word', 'start': words[i]['start'], 'end': words[i + len(seq) - 1]['end']}]
        i += 1
A = json.load(open('audio/timemap.json'))['anchors'] if os.path.exists('audio/timemap.json') else None
def m(t):
    if not A: return t
    if t <= A[0][0]: return A[0][1]
    for (r0, f0), (r1, f1) in zip(A, A[1:]):
        if t <= r1: return f0 if r1 <= r0 else f0 + (t - r0) / (r1 - r0) * (f1 - f0)
    return A[-1][1]
for w in words: w['start'] = round(m(float(w['start'])), 3); w['end'] = round(m(float(w['end'])), 3)
json.dump({'words': words}, open('scribe_words.json', 'w'), ensure_ascii=False)
print(len(words), 'kata; akhir', words[-1]['end'])
