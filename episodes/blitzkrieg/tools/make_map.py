# Bangun web/map_data.js dari Natural Earth 1:50m (domain publik). Perbatasan modern, disederhanakan (peta ilustrasi).
# Pakai: python3 tools/make_map.py ne_50m_admin_0_countries.geojson
import json, sys
from shapely.geometry import shape, box, Polygon
src = json.load(open(sys.argv[1]))
VIEW = box(-8, 45, 13, 56)
WANT = {'France': 'FR', 'Belgium': 'BE', 'Netherlands': 'NL', 'Luxembourg': 'LU', 'Germany': 'DE', 'United Kingdom': 'UK',
        'Switzerland': 'CH', 'Italy': 'IT', 'Denmark': 'DK', 'Austria': 'AT', 'Ireland': 'IE', 'Czechia': 'CZ', 'Spain': 'ES'}
out = {}
for f in src['features']:
    n = f['properties']['ADMIN']
    if n not in WANT: continue
    g = shape(f['geometry']).intersection(VIEW).simplify(.03)
    gs = [g] if isinstance(g, Polygon) else [x for x in getattr(g, 'geoms', []) if isinstance(x, Polygon)]
    out[WANT[n]] = [[[round(x, 3), round(y, 3)] for x, y in p.exterior.coords] for p in gs if p.area > .01]
open('web/map_data.js', 'w').write('// Natural Earth 1:50m (domain publik), dipotong + disederhanakan oleh tools/make_map.py\nconst MAPGEO = ' + json.dumps(out, separators=(',', ':')) + ';\n')
print({k: sum(len(p) for p in v) for k, v in out.items()})
