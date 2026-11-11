"""Word timing for ANY language from an ElevenLabs Scribe transcript (adapted from the MIT-licensed stick-figure skill).

Run from a reel folder:  python <engine>/tools/align_scribe.py scribe_words.json [audio_wav]
 - scribe_words.json: the `words` array from creative_transcribe_audio (list of {text,type,start,end}) or {"words":[...]}
 - script.json: the voiceover, one sentence per entry (same words as spoken)
Writes audio/words_new.json, audio/words_ref.json (first take), audio/warp.json, web/words.js, web/warp.js.
"""
import json, re, difflib, os, shutil, sys, subprocess
src = sys.argv[1]
raw = json.load(open(src)); raw = raw.get('words', raw) if isinstance(raw, dict) else raw
off = float(open('audio/trim_offset.txt').read()) if os.path.exists('audio/trim_offset.txt') else 0.0   # silence trimmed by prep_voice.py
asr = [(w['text'], float(w['start']) - off, float(w['end']) - off) for w in raw if w.get('type', 'word') == 'word']
dur = float(sys.argv[2]) if len(sys.argv) > 2 and re.match(r'^[\d.]+$', sys.argv[2]) else None
if dur is None and os.path.exists('audio/vo.wav'):
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'audio/vo.wav'], capture_output=True, text=True).stdout.strip())
dur = dur or asr[-1][2]
norm = lambda w: re.sub(r"[^\w]", "", w.lower())
lines = json.load(open('script.json'))
REPL = json.load(open('captions.json')) if os.path.exists('captions.json') else {}
script = []
for li, L in enumerate(lines):
    for k, v in REPL.items(): L = L.replace(k, v)
    for w in L.split(): script.append((w, li))
A = [norm(w[0]) for w in asr]; S = [norm(w) for w, _ in script]
sm = difflib.SequenceMatcher(a=S, b=A, autojunk=False)
start = [None] * len(script); endt = [None] * len(script); matched = 0
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        start[blk.a + k] = asr[blk.b + k][1]; endt[blk.a + k] = asr[blk.b + k][2]; matched += 1
for i in range(len(script)):
    if start[i] is None:
        lo = next((j for j in range(i - 1, -1, -1) if start[j] is not None), None)
        hi = next((j for j in range(i + 1, len(script)) if start[j] is not None), None)
        if lo is not None and hi is not None: start[i] = start[lo] + (start[hi] - start[lo]) * (i - lo) / (hi - lo)
        elif lo is not None: start[i] = start[lo] + .3
        else: start[i] = 0
words = []
for i, (w, li) in enumerate(script):
    e = start[i + 1] if i + 1 < len(script) else dur
    words.append({'w': w, 's': round(max(0.0, start[i]), 3), 'e': round(min(e, max(0.0, start[i]) + 1.2), 3), 'line': li})
os.makedirs('audio', exist_ok=True)
json.dump(words, open('audio/words_new.json', 'w'), indent=0)
if not os.path.exists('audio/words_ref.json'): shutil.copy('audio/words_new.json', 'audio/words_ref.json')
old = json.load(open('audio/words_ref.json'))
assert len(old) == len(words), f'script changed since the animation was timed ({len(old)} vs {len(words)} words): re-time shots.js or delete audio/words_ref.json'
anchors = [[o['s'], n['s']] for o, n in zip(old, words)]
clean = [anchors[0]]
for p in anchors[1:]:
    if p[0] > clean[-1][0] + 1e-3 and p[1] > clean[-1][1] + 1e-3: clean.append(p)
json.dump({'anchors': clean, 'old_end': old[-1]['e'], 'new_end': dur}, open('audio/warp.json', 'w'))
open('web/words.js', 'w').write('const WORDS=' + json.dumps(words) + ';')
open('web/warp.js', 'w').write('window.WARP=' + json.dumps(json.load(open('audio/warp.json'))) + ';')
print('matched', matched, 'of', len(script), 'words; duration', round(dur, 2))
