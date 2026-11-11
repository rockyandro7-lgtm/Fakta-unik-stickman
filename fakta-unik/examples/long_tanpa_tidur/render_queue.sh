#!/usr/bin/env bash
# render chapters given as args, sequentially, 3 workers (leave a core for previews)
for c in "$@"; do
  cd /home/user/reels/full-tanpa-tidur && rm -rf $c/seg $c/silent.mp4
  WORKERS=3 bash /home/user/.claude/skills/fakta-unik/engine/make.sh $c > /home/user/reels/full-tanpa-tidur/build_$c.log 2>&1
  echo "$c $(tail -1 /home/user/reels/full-tanpa-tidur/build_$c.log)" >> /home/user/reels/full-tanpa-tidur/queue.log
done
