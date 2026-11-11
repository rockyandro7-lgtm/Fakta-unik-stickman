"""Prepare the ElevenLabs voice take for a reel.
Run from the reel folder:  python <engine>/tools/prep_voice.py audio/vo_raw.mp3
 - trims leading/trailing silence so the hook lands on frame 1  -> audio/vo.wav
 - writes audio/trim_offset.txt: seconds trimmed from the start (align_scribe.py subtracts it from Scribe word times,
   so you can transcribe the RAW file and still get frame-accurate captions).
"""
import subprocess, sys, os
import numpy as np, soundfile as sf
from scipy.signal import correlate
src = sys.argv[1] if len(sys.argv) > 1 else 'audio/vo_raw.mp3'
os.makedirs('audio', exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '44100', 'audio/vo_full.wav'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'audio/vo_full.wav', '-af',
                'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
                'audio/vo.wav'], check=True)
a, sr = sf.read('audio/vo_full.wav'); b, _ = sf.read('audio/vo.wav')
seg = b[int(.3 * sr):int(1.3 * sr)]
c = correlate(a[:int(3 * sr)], seg, mode='valid', method='fft')
off = max(0.0, (int(np.argmax(c)) - int(.3 * sr)) / sr)
open('audio/trim_offset.txt', 'w').write(f'{off:.3f}')
print(f'vo.wav {len(b)/sr:.2f}s (raw {len(a)/sr:.2f}s), trimmed {off:.3f}s from the start')
