# Prepare projected 1939-ish geometry (simplified/approximate borders)
import json, math, pickle, sys
from shapely.geometry import shape, Polygon, box, MultiPolygon
from shapely.ops import unary_union
src, out = sys.argv[1], sys.argv[2]
d = json.load(open(src))
C = {f['properties']['ADMIN']: shape(f['geometry']) for f in d['features']}
view = box(-25, 25, 65, 72)
def g(n): return C[n].intersection(view)

# projection: equirectangular scaled by cos(52) -> km-ish units
K = math.cos(math.radians(52))
def P(lon, lat): return (lon*K, -lat)

GER_EAST = Polygon([(14.1,54.0),(17.6,54.9),(17.4,53.6),(16.0,53.2),(15.9,52.6),(16.7,51.7),(17.6,51.4),(18.2,51.2),(18.0,50.6),(18.6,50.1),(17.8,49.9),(14.5,50.8),(14.0,51.5)])
E_PRUSSIA = Polygon([(19.2,54.6),(19.1,53.9),(19.7,53.2),(21.0,53.1),(22.5,53.4),(22.9,53.9),(22.8,54.4),(22.0,55.1),(21.2,55.4),(20.0,55.0)])
POL_EAST = Polygon([(23.4,54.2),(24.8,55.0),(26.6,55.7),(27.2,55.2),(27.6,54.2),(27.0,53.4),(27.6,52.2),(26.8,51.4),(26.5,50.3),(26.2,49.2),(25.9,48.3),(24.5,48.0),(22.8,49.0),(22.9,51.5),(23.6,52.2),(23.4,53.0)])
kalin = C['Russia'].intersection(box(19,54,23,56))
russia = C['Russia'].difference(box(19,54,23,56)).intersection(view)
modern_pol = C['Poland']
reich39 = unary_union([g('Germany'), g('Austria'), g('Czechia'), modern_pol.intersection(GER_EAST), modern_pol.intersection(E_PRUSSIA), kalin])
eastzone = unary_union([g('Belarus'), g('Ukraine'), g('Lithuania')]).intersection(POL_EAST)
poland39 = unary_union([modern_pol.difference(GER_EAST).difference(E_PRUSSIA), eastzone]).difference(reich39)
ussr = unary_union([russia, g('Belarus'), g('Ukraine'), g('Lithuania'), g('Latvia'), g('Estonia'), g('Moldova')]).difference(poland39).difference(reich39)
france = g('France').intersection(box(-6,41,10,52))
uk = g('United Kingdom'); 
benelux = unary_union([g('Belgium'), g('Netherlands'), g('Luxembourg')])
others = []
used = {'Germany','Austria','Czechia','Poland','Russia','Belarus','Ukraine','Lithuania','Latvia','Estonia','Moldova','France','Belgium','Netherlands','Luxembourg'}
for n, s in C.items():
    s2 = s.intersection(view)
    if s2.is_empty or n in used: continue
    others.append(s2)
others.append(g('Slovakia')) if False else None

def polys(geom):
    geom = geom.simplify(0.02)
    if geom.is_empty: return []
    gs = [geom] if isinstance(geom, Polygon) else [x for x in getattr(geom,'geoms',[]) if isinstance(x, Polygon)]
    res = []
    for p in gs:
        if p.area < 0.02: continue
        res.append([P(x,y) for x,y in p.exterior.coords])
    return res
layers = {
  'others': sum((polys(o) for o in others), []),
  'reich': polys(reich39), 'poland': polys(poland39), 'ussr': polys(ussr),
  'france': polys(france), 'uk': polys(uk), 'benelux': polys(benelux),
  'pol_modern_all': polys(unary_union([modern_pol, eastzone, kalin])),
}
pickle.dump({'layers': layers, 'K': K}, open(out,'wb'))
print({k: len(v) for k,v in layers.items()})
