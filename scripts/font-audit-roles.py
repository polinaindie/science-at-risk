#!/usr/bin/env python3
"""Groups the audit by ROLE: docs/font-audit/roles.json (selector regexes) + raw-*.json -> docs/font-audit/roles-data.json.
    python3 -I scripts/font-audit-roles.py   [--show-unsorted]
"""
import json, re, sys, collections, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'docs' / 'font-audit'
cfg = json.load(open(OUT / 'roles.json'))['roles']
rules = [(r['id'], r['label'], re.compile(r['re'])) for r in cfg]

def role_of(chain):
    own = chain.split(' ‹ ')[0]
    for text in (own, chain):  # the element itself first; only then its ancestors
        for rid, _, rx in rules:
            if rid == 'generic':
                continue
            if rx.search(text):
                return rid
    return 'generic' if rules and rules[-1][2].search(own) else 'unsorted'

def fmt(x):
    return f"{round(float(x.replace('px','')),1):g}" if x != 'normal' else 'normal'

def ls_em(e):
    return '0' if e['letterSpacing'] == 'normal' else f"{round(float(e['letterSpacing'][:-2]) / float(e['size'][:-2]), 3):g}em"

data = {}
for vp, fname in (('1440', 'raw-1440x900.json'), ('390', 'raw-390x844.json')):
    pages = json.load(open(OUT / fname))['pages']
    roles = collections.defaultdict(lambda: collections.defaultdict(lambda: {'nodes': 0, 'pages': set(), 'sel': collections.Counter(), 'sample': '', 'page': ''}))
    for p, v in pages.items():
        if 'entities' not in v or p.startswith('/handoff'):
            continue
        for e in v['entities']:
            k = (e['family'], fmt(e['size']), e['weight'], e['style'], fmt(e['lineHeight']), ls_em(e), e['transform'])
            for sel, n in e['elements'].items():
                x = roles[role_of(sel)][k]
                x['nodes'] += n; x['pages'].add(p); x['sel'][sel] += n
                if not x['sample']:
                    x['sample'] = e['samples'][0] if e['samples'] else ''; x['page'] = p
    data[vp] = {r: [{'family': k[0], 'size': k[1], 'weight': k[2], 'style': k[3], 'lh': k[4], 'ls': k[5], 'tr': k[6], 'nodes': x['nodes'], 'pages': len(x['pages']),
                     'sel': [s for s, _ in x['sel'].most_common(4)], 'sample': x['sample'], 'page': x['page']}
                    for k, x in sorted(vs.items(), key=lambda kv: -kv[1]['nodes'])] for r, vs in roles.items()}
json.dump({'labels': {r['id']: r['label'] for r in cfg}, 'data': data}, open(OUT / 'roles-data.json', 'w'), ensure_ascii=False, indent=1)
d = data['1440']
tot = sum(v['nodes'] for vs in d.values() for v in vs)
print('role                variants  nodes%')
for r in [c['id'] for c in cfg] + ['unsorted']:
    if r in d:
        print(f"{r:16} {len(d[r]):6}  {sum(v['nodes'] for v in d[r]) * 100 / tot:5.1f}")
if '--show-unsorted' in sys.argv:
    c = collections.Counter()
    for v in d.get('unsorted', []):
        for s in v['sel']: c[s] += v['nodes']
    print(c.most_common(40))
