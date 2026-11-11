import json, sys
raw=json.load(open(sys.argv[1])); m=json.load(open(sys.argv[2]))
ws = raw['words'] if isinstance(raw,dict) and 'words' in raw else raw
ws=[w for w in ws if w.get('type','word')=='word']
def f(t):
    best=None
    for a,b,acc in m['segs']:
        if t<a: return (acc - m['lead'])/m['tempo'] if best is None else best
        if t<=b: return (acc+(t-a)-m['lead'])/m['tempo']
        best=(acc+(b-a)-m['lead'])/m['tempo']
    return best
out=[{'w':w['text'],'s':round(f(w['start']),3),'e':round(f(w['end']),3)} for w in ws]
json.dump(out,open(sys.argv[3],'w'),ensure_ascii=False,indent=0)
for o in out: print(o['s'],o['e'],o['w'])
