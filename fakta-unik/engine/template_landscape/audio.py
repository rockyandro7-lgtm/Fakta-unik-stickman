# Long-form chapter audio: soft underscore + transition whooshes + number pops (timed to words)
from audio_lib import *
import json, re, os
WD = json.load(open('audio/words_new.json'))
mood = open('mood.txt').read().strip() if os.path.exists('mood.txt') else 'bright'
END = WD[-1]['e'] + .6
starts = sorted({w['s'] for w in WD if w is WD[0] or w['line'] != WD[WD.index(w) - 1]['line']})
for s0 in starts[1:]: place(sfx, whoosh(.32), s0 - .2, .18)
for w in WD:
    if re.search(r'\d', w['w']): place(sfx, pop(620 + (len(w['w']) % 4) * 90), w['s'], .22)
music = np.zeros(N)
import audio_lib as AL
AL.music = music
prog = DMAJ if mood == 'bright' else DM
if mood == 'tense':
    t = 0.0
    while t < END: place(music, strings((50, 56, 62), min(8, END - t), .3), t); t += 8
    sneak(0, END, .5)
else:
    playful(0, END, prog, .7, glock_on=(mood == 'bright'), stabs=True)
music = lp(music, 5000)
finish(music, sfx, music_gain=.13, sfx_gain=.7)
