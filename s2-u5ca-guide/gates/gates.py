#!/usr/bin/env python3
"""S2 static gates (DESIGN_SPEC 11): G1 banned words, G2 pupil-level code, G4 coverage, G6 names strip, G7 words, G8b yours,
G11 frames, G12s (screen counts, one big block, 12 typed lines), G13 routes. G3 and G8 are tools/check_content.py.
  python3 -I gates/gates.py G1 [G2 ...]      one line per gate, PASS or FAIL; exit 1 if any FAIL
  S2_CONTENT=<dir>  reads that content folder instead (the controls plant their fault in a copy)
  S2_SHIP=1         G4 and G11 also count the chapters not yet built / pictures not yet taken (the ship check)"""
import json, os, re, sys
G = os.path.dirname(os.path.abspath(__file__)); D = os.path.dirname(G)
C = os.environ.get('S2_CONTENT') or os.path.join(D, 'content')
SHIP = os.environ.get('S2_SHIP') == '1'
J = lambda p: json.load(open(p))
IX = J(os.path.join(C, 'index.json')); PLAN = J(os.path.join(G, 'plan.json'))
BUILT = [c for c in IX['chapters'] if c['built']]
CH = {c['id']: J(os.path.join(C, 'ch%s.json' % c['id'])) for c in BUILT}
CONTROLS = J(os.path.join(C, 'controls.json')); NAMES = J(os.path.join(C, 'names.json'))
GLOBAL = re.findall(r'public static \w+ (\w+)', open(os.path.join(C, 'code', 'Global', '_head.txt')).read())

def blocks(bl, where):
    for b in bl or []:
        yield where, b
        if isinstance(b.get('box'), dict): yield from blocks(b['box'].get('blocks'), where)
def screens(ch):
    for s in ch['stages']:
        for sc in s['screens']: yield '%s-%s' % (s['id'], sc['id']), sc
def codes(ch):
    for sid, sc in screens(ch):
        for _, b in blocks(sc['blocks'], sid):
            if 'code' in b: yield sid, sc, b['code']
def strings(n, where=''):
    if isinstance(n, dict):
        for k, v in n.items(): yield from strings(v, where + '/' + k)
    elif isinstance(n, list):
        for i, x in enumerate(n): yield from strings(x, where + '[%d]' % i)
    elif isinstance(n, str): yield where, n

def g1():
    words = [w.strip() for w in open(os.path.join(G, 'banned.txt')) if w.strip()]
    rx = re.compile(r'\b(' + '|'.join(re.escape(w) for w in words) + r')\b', re.I)
    out = []
    files = [os.path.join(C, f) for f in os.listdir(C) if f.endswith('.json')] + [os.path.join(D, 'src', 'strings-s2.json')]
    for f in files:
        for w, t in strings(J(f)):
            m = rx.search(t)
            if m: out.append('%s%s: "%s"' % (os.path.basename(f), w, m.group(0)))
    for root, _, fs in os.walk(os.path.join(C, 'img')):
        out += ['picture name %s' % x for x in fs if rx.search(x.replace('-', ' ').replace('_', ' '))]
    for root, _, fs in os.walk(os.path.join(C, 'code')):
        for x in fs:
            m = rx.search(open(os.path.join(root, x)).read())
            if m: out.append('code/%s: "%s"' % (x, m.group(0)))
    return out

BAD = [(r'=>', 'lambda'), (r'\bvar\s', 'var'), (r'\?\.', '?.'), (r'\?\?', '??'), (r'\$"', '$"'), (r'\btry\b', 'try'), (r'\bswitch\b', 'switch'),
       (r'\bwhile\b', 'while'), (r'\basync\b', 'async'), (r'\byield\b', 'yield'), (r'\?[^"\n]*:', '?:'),
       (r'\.(Where|Select|Any|First|FirstOrDefault|OrderBy|Sum|Count|Max|Min|ToList|Contains)\(', 'LINQ')]
def g2():
    out = []
    for cid, ch in CH.items():
        for sid, _, c in codes(ch):
            t = re.sub(r'"[^"\n]*"', '""', c['text'])
            t = re.sub(r'//.*', '', t)
            for rx, name in BAD:
                if re.search(rx, t): out.append('%s %s: %s' % (cid, c['id'], name))
            if re.search(r'\.All\((?!char\.IsDigit\))', t): out.append('%s %s: .All other than char.IsDigit' % (cid, c['id']))
    return out

def g4():
    out = []
    for cid, p in PLAN.items():
        if cid not in CH:
            if SHIP and p['methods']: out.append('chapter %s not built: %d methods untaught' % (cid, len(p['methods'])))
            continue
        shown = {}
        for _, _, c in codes(CH[cid]):
            if 'method' in c: shown.setdefault((c['form'], c['method']), set()).update(range(c['from'], c['to'] + 1))
            if 'method' in c and c.get('rest'): shown[(c['form'], c['method'])].update(range(c['rest'][0], c['rest'][1] + 1))   # lines told as 'the same again'
        for form, m in p['methods']:
            n = len(open(os.path.join(C, 'code', form, m + '.cs')).read().rstrip('\n').split('\n'))
            got = shown.get((form, m), set())
            if len(got) != n: out.append('%s %s.%s: %d of %d lines taught' % (cid, form, m, len(got), n))
        extra = set(shown) - {tuple(x) for x in p['methods']}
        out += ['%s teaches %s.%s, which plan.json gives another chapter' % (cid, f, m) for f, m in extra]
    every = {(f, x[:-3]) for f in os.listdir(os.path.join(C, 'code')) if os.path.isdir(os.path.join(C, 'code', f))
             for x in os.listdir(os.path.join(C, 'code', f)) if x.endswith('.cs')}
    planned = {tuple(m) for p in PLAN.values() for m in p['methods']}
    out += ['code/%s/%s.cs is in no chapter of plan.json' % x for x in sorted(every - planned)]
    if '03' in CH:
        text = ' '.join(c['text'] for _, _, c in codes(CH['03']))
        out += ['chapter 3 never shows Global.%s' % f for f in GLOBAL if not re.search(r'\b%s\b' % f, text)]
    return out

def known():
    k = set(NAMES) | {'Global.' + f for f in GLOBAL} | set(CONTROLS)
    for f in CONTROLS.values(): k |= set(f.get('controls', {}))
    return k - {'_note', 'string', 'int', 'double', 'bool'}   # C# types sit in names.json for the Global.cs IntelliSense strip only
def g6():
    out, K = [], known()
    for cid, ch in CH.items():
        for sid, _, c in codes(ch):
            if c['kind'] != 'type': continue
            t = re.sub(r'"[^"\n]*"', '""', re.sub(r'//.*', '', c['text']))   # words inside quote marks are message text, not names
            if c.get('form') == 'Global': t = re.sub(r'(static \w+ )(\w+)', r'\1Global.\2', t)   # in Global.cs a field IS Global.<field>
            have = {n for n in K if re.search(r'(?<![\w.])' + re.escape(n) + r'\b', t)}
            have -= {n for n in have if any(m != n and m.startswith(n + '.') and m in have for m in have)}
            names = set(c.get('names', []))
            if not names and have: out.append('%s %s: no names strip, though the code has names in it' % (cid, c['id']))
            out += ['%s %s: strip name %s is not a control, Global field or names.json entry' % (cid, c['id'], n) for n in names - K]
            out += ['%s %s: %s is in the code but not the strip' % (cid, c['id'], n) for n in sorted(have - names)
                    if not (n.startswith('frm') and n in CONTROLS and not re.search(r'new %s\b' % n, t))]
            out += ['%s %s: strip name %s is not in the code' % (cid, c['id'], n) for n in sorted((names & K) - have)]
    return out

def g7():
    out = []
    wl = [w.strip() for w in open(os.path.join(G, 'words.txt')) if w.strip()]
    plan = J(os.path.join(G, 'words.json'))
    seen = {}
    for cid, ch in CH.items():
        ws = [w for _, sc in screens(ch) for _, b in blocks(sc['blocks'], '') if 'words' in b for w in b['words']]
        terms = [w[0] for w in ws]
        prose = ' '.join(t for _, t in strings(ch['stages']))
        marks = {int(i) for i in re.findall(r'\[\[.+?\|(\d+)\]\]', prose)}
        for i, t in enumerate(terms):
            if t not in wl: out.append('%s: [[%s]] is not on the words list' % (cid, t))
            if t in seen: out.append('%s: %s was already taught in chapter %s' % (cid, t, seen[t]))
            seen.setdefault(t, cid)
            if i not in marks: out.append('%s: %s is never marked' % (cid, t))
        want = {t for t, c in plan.items() if c == cid}
        out += ['%s: %s should be taught here (words.json)' % (cid, t) for t in sorted(want - set(terms))]
        out += ['%s: %s is taught here but words.json gives chapter %s' % (cid, t, plan.get(t)) for t in terms if plan.get(t) not in (cid, None)]
    if SHIP: out += ['%s is taught in no chapter' % t for t in wl if t not in seen]
    return out

def g8b():
    out, L = [], J(os.path.join(G, 'literals.json'))
    for cid, ch in CH.items():
        for sid, sc, c in codes(ch):
            hit = [rx for rx in L.get(cid, []) if re.search(rx, c['text'])]
            yours = c.get('yours') or any('yours' in b for _, b in blocks(sc['blocks'], ''))
            if hit and not yours and c['kind'] == 'type': out.append('%s %s: has %s but no yours line' % (cid, c['id'], hit[0]))
    return out

def g11():
    out, need = [], {}
    for cid, ch in CH.items():
        for sid, sc in screens(ch):
            for w, t in strings(sc['blocks']):
                if w.endswith('/img') and t.startswith('img/'): need[t] = '%s %s' % (cid, sid)
            for _, b in blocks(sc['blocks'], sid):
                imgs = (b.get('frames') or {}).get('frames', []) + [s['img'] for s in b.get('steps', []) if isinstance(s.get('img'), dict)]
                for f in imgs:
                    if not (f.get('w') and f.get('h') and f.get('alt')): out.append('%s %s: %s lacks w, h or alt' % (cid, sid, f.get('img')))
    missing = [p for p in need if not os.path.exists(os.path.join(C, p))]
    if missing and SHIP: out += ['missing %s (%s)' % (p, need[p]) for p in missing]
    elif missing: print('  G11 note: %d of %d pictures not taken yet (red at ship)' % (len(missing), len(need)))
    return out

def g12s():
    out = []
    for cid, ch in CH.items():
        p = PLAN[cid]; n = sum(1 for _ in screens(ch))
        if abs(n - p['screens']) > 2: out.append('%s: %d screens, plan %d (+-2)' % (cid, n, p['screens']))
        for sid, sc in screens(ch):
            open_ = [b for b in sc['blocks'] if not (isinstance(b.get('box'), dict) and b['box'].get('fold'))]   # a folded box is shut
            big = [k for _, b in blocks(open_, sid) for k in b if k in ('code', 'frames') or (k == 'steps' and (len(b[k]) > 1 or any(x.get('img') for x in b[k])))]
            if len(big) > 1: out.append('%s %s: two big blocks (%s)' % (cid, sid, ' '.join(big)))
        for sid, _, c in codes(ch):
            typed = sum(pl[1] - pl[0] + 1 for pl in c['partLines'] if len(pl) < 5)
            if c['kind'] == 'type' and typed > 12: out.append('%s %s: %d typed lines' % (cid, c['id'], typed))
    return out

def g13():
    out, by = [], {c['id']: c for c in IX['chapters']}
    for cid, ch in CH.items():
        for w, t in strings(ch):
            for r in re.findall(r'#cw/(\d\d)(?:/(\d+)-(\d+))?', t):
                c = by.get(r[0])
                if not c: out.append('%s%s: no chapter %s' % (cid, w, r[0])); continue
                if not r[1]: continue
                if r[0] in CH:
                    if not any(s['id'] == r[1] and any(sc['id'] == r[2] for sc in s['screens']) for s in CH[r[0]]['stages']):
                        out.append('%s%s: no screen %s/%s-%s' % (cid, w, r[0], r[1], r[2]))
                elif not any(s[0] == r[1] and int(r[2]) <= s[2] for s in c['stages']):
                    out.append('%s%s: no stage %s/%s-%s in the index' % (cid, w, r[0], r[1], r[2]))
    c14 = by.get('14')
    if not c14 or c14.get('hidden') != 'after-all': out.append('index: chapter 14 is not hidden "after-all"')
    return out

GATES = {'G1': g1, 'G2': g2, 'G4': g4, 'G6': g6, 'G7': g7, 'G8b': g8b, 'G11': g11, 'G12s': g12s, 'G13': g13}
bad = 0
for g in sys.argv[1:] or list(GATES):
    p = GATES[g]()
    print('%-5s %s%s' % (g, 'FAIL' if p else 'PASS', ' (%d)' % len(p) if p else ''))
    for x in p[:12]: print('      ' + x)
    bad += bool(p)
sys.exit(1 if bad else 0)
