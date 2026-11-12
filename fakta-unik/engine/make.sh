#!/usr/bin/env bash
# Build a Fakta Unik reel:  make.sh <reel-folder>
# Needs in the reel folder: script.json, audio/vo.wav (ElevenLabs take), scribe_words.json (Scribe word times), web/shots.js, audio.py
# Env: WORKERS (default 4), AUDIO_ONLY=1 (remix sound only), CHROME=/path/to/chromium (optional)
set -euo pipefail
ENGINE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIR="$(cd "${1:?usage: make.sh <reel-folder>}" && pwd)"
WORKERS="${WORKERS:-4}"; NAME="$(basename "$DIR")"
cd "$DIR"; mkdir -p audio
[ -f audio/vo.wav ] || { [ -f audio/vo_raw.mp3 ] && python3 "$ENGINE/tools/prep_voice.py" audio/vo_raw.mp3; }
[ -f audio/vo.wav ] || { echo "missing audio/vo.wav (put the ElevenLabs take at audio/vo_raw.mp3)"; exit 1; }
[ -f scribe_words.json ] || { echo "missing scribe_words.json (transcribe the voice with ElevenLabs Scribe)"; exit 1; }
echo "== aligning words (Scribe)"; python3 "$ENGINE/tools/align_scribe.py" scribe_words.json
echo "== music + sfx mix"; python3 audio.py
if [ "${AUDIO_ONLY:-0}" != "1" ] || [ ! -f silent.mp4 ]; then
  echo "== rendering shots with $WORKERS workers"
  rm -rf seg; mkdir -p seg
  N=$(node "$ENGINE/tools/render.js" count | tail -1); pids=()
  for ((w = 0; w < WORKERS; w++)); do
    ids=""; for ((i = w; i < N; i += WORKERS)); do ids="${ids:+$ids,}$i"; done
    [ -n "$ids" ] && { node "$ENGINE/tools/render.js" segments "$ids" > "seg/log$w.txt" 2>&1 & pids+=($!); }
  done
  for p in "${pids[@]}"; do wait "$p"; done
  [ "$(ls seg/shot_??.mp4 | wc -l)" -eq "$N" ] || { echo "a shot failed, see $DIR/seg/log*.txt"; exit 1; }
  for f in seg/shot_??.mp4; do echo "file '$PWD/$f'"; done > seg/list.txt
  ffmpeg -v error -y -f concat -safe 0 -i seg/list.txt -c copy silent.mp4
fi
echo "== final mux"
ffmpeg -v error -y -i silent.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy \
  -af "alimiter=limit=0.8:attack=2:release=60,loudnorm=I=-14:TP=-1.5:LRA=9" \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$NAME.part.mp4"
mv "$NAME.part.mp4" "$NAME.mp4"; echo "done: $DIR/$NAME.mp4"
