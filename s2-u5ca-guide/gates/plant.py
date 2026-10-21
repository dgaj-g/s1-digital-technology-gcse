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
elif g == 'G2': code('3-5')['text'] += '\n            list.Sort(x => x);'
elif g == 'G3': c = code('3-5'); c['text'] = c['text'].replace('e', 'E', 1)
elif g == 'G4':
    for st in ch['stages']:
        for sc in st['screens']: sc['blocks'] = [b for b in sc['blocks'] if not ('code' in b and b['code'].get('method') == 'btnReturn_Click')]
elif g == 'G6': c = code('3-5'); c['names'][0] = c['names'][0] + 'X'
elif g == 'G7':
    t = json.dumps(ch); assert '[[return;|2]]' in t; ch = json.loads(t.replace('[[return;|2]]', 'return;', 1))
elif g == 'G8': firstp('1-1')['p'] += ' This sentence has been planted here to be far too long for a pupil to read in one go at all.'
elif g == 'G8b': c = code('4-2'); c.pop('yours', None)
elif g == 'G11':
    for root, _, fs in os.walk(os.path.join(out, 'img')):
        for f in fs:
            if f == 'f4-2.png': os.remove(os.path.join(root, f))
elif g == 'G12s': screen('2-4')['blocks'].append(next(b for b in screen('3-2')['blocks'] if 'frames' in b))
elif g == 'G13': firstp('1-1')['p'] += ' Go to [Chapter 2](#cw/02/9-1).'
elif g.startswith('SIGN'):   # G-SIGN controls, one per rule (EASE_SPEC §6); each is checked with --only <rule>
    r = g[4:]; allsc = [(st, sc) for st in ch['stages'] for sc in st['screens']]
    def heavy(sc): return [k for b in sc['blocks'] for k in b if k in ('code', 'frames', 'flow', 'steps', 'check', 'controls')]
    opener = next((sc for st, sc in allsc if sc.get('opener')), None)
    if r == 'S1': ch['stages'][0].pop('thing', None)
    elif r == 'S2':
        for st in ch['stages']: st['screens'] = [sc for sc in st['screens'] if not sc.get('opener')]   # every opener removed
    elif r == 'S3':
        for st, sc in allsc: sc.pop('done', None)
    elif r == 'S4':
        fr = next(b for st, sc in allsc for b in sc['blocks'] if 'frames' in b); tgt = next(sc for st, sc in allsc if 'code' in heavy(sc)); tgt['blocks'].append(fr)
    elif r == 'S5': allsc[0][1]['title'] = 'The code for question 4'
    elif r == 'S6':
        sc = next(sc for st, sc in allsc if not sc.get('opener') and 'p' in sc['blocks'][0] and len(sc['blocks']) > 1); sc['blocks'].append(sc['blocks'].pop(0))
    elif r == 'S7':
        fr = next(b['frames'] for st, sc in allsc for b in sc['blocks'] if 'frames' in b); fr['frames'][0]['say'] = 'this caption has been planted to run on for fourteen words so the gate must catch it'
    elif r == 'S8':
        c = next(b['code'] for st, sc in allsc for b in sc['blocks'] if 'code' in b and b['code'].get('from', 1) > 1); c['from'] += 1
    elif r == 'S9':
        if opener: opener['blocks'][0]['open']['what'] = ' '.join(['word'] * 35)
        else: ch['stages'][1]['screens'].insert(0, {'id': '0', 'opener': True, 'title': 'Now', 'blocks': [{'open': {'what': ' '.join(['word'] * 35), 'does': 'x'}}]})
    elif r == 'S10': ch['stages'][0]['title'] += ' in this stage'
    elif r == 'S11':
        ixp = os.path.join(out, 'index.json'); ix = json.load(open(ixp)); c7 = next(c for c in ix['chapters'] if c['id'] == '07'); c7['stages'][0] = c7['stages'][0][:2] + [99] + c7['stages'][0][3:]
        json.dump(ix, open(ixp, 'w'), ensure_ascii=False, indent=1)
    else: sys.exit('no control for ' + g)
else: sys.exit('no control for ' + g)
json.dump(ch, open(P, 'w'), ensure_ascii=False, indent=1)
print(out)
