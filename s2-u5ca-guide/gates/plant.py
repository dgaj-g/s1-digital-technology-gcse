#!/usr/bin/env python3
"""Plant one gate's control fault in a copy of content/ (DESIGN_SPEC 14 controls column); prints the copy's path.
  python3 -I gates/plant.py G1      → gates/_ctl/G1/   then   S2_CONTENT=gates/_ctl/G1 python3 -I gates/gates.py G1   must FAIL"""
import json, os, re, shutil, sys
G = os.path.dirname(os.path.abspath(__file__)); D = os.path.dirname(G)
g = sys.argv[1]; out = os.path.join(G, '_ctl', g)
shutil.rmtree(out, ignore_errors=True); shutil.copytree(os.path.join(D, 'content'), out)
P = os.path.join(out, 'ch07.json'); ch = json.load(open(P))
def screen(key):
    s, k = key.split('-')
    return next(sc for st in ch['stages'] if str(st['id']) == s for sc in st['screens'] if str(sc['id']) == k)
def code(key): return next(b['code'] for b in screen(key)['blocks'] if 'code' in b)
def firstp(key): return next(b for b in screen(key)['blocks'] if 'p' in b)
if g == 'G1': firstp('1-1')['p'] += ' My example is set in Castle High.'
elif g == 'G2': code('3-3')['text'] += '\n            list.Sort(x => x);'
elif g == 'G3': c = code('3-3'); c['text'] = c['text'].replace('e', 'E', 1)
elif g == 'G4':
    for st in ch['stages']:
        for sc in st['screens']: sc['blocks'] = [b for b in sc['blocks'] if not ('code' in b and b['code'].get('method') == 'btnReturn_Click')]
elif g == 'G6': c = code('3-3'); c['names'][0] = c['names'][0] + 'X'
elif g == 'G7':
    t = json.dumps(ch); assert '[[return;|2]]' in t; ch = json.loads(t.replace('[[return;|2]]', 'return;', 1))
elif g == 'G8': firstp('1-1')['p'] += ' This sentence has been planted here to be far too long for a pupil to read in one go at all.'
elif g == 'G8b': c = code('4-1'); c.pop('yours', None)
elif g == 'G11':
    for root, _, fs in os.walk(os.path.join(out, 'img')):
        for f in fs:
            if f == 'f4-2.png': os.remove(os.path.join(root, f))
elif g == 'G12s': screen('2-4')['blocks'].append(next(b for b in screen('3-2')['blocks'] if 'frames' in b))
elif g == 'G13': firstp('1-1')['p'] += ' Go to [Chapter 2](#cw/02/9-1).'
else: sys.exit('no control for ' + g)
json.dump(ch, open(P, 'w'), ensure_ascii=False, indent=1)
print(out)
