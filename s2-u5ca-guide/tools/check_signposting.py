#!/usr/bin/env python3
"""Gate G-SIGN (EASE_SPEC_21OCT2026 §6): every screen must say WHAT part it is making, WHERE it is, WHAT to do now and WHEN it is
done, in the content itself. Rules S1–S11; exit 1 on any finding.
  python3 -I s2-u5ca-guide/tools/check_signposting.py [--only S4] [--chapters 07,00]
  S2_CONTENT=<dir> overrides content/ (the planted controls in gates/_ctl/SIGN*)."""
import json, re, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); D = os.path.dirname(HERE)
C = os.environ.get('S2_CONTENT') or os.path.join(D, 'content')
args = sys.argv[1:]
ONLY = args[args.index('--only') + 1] if '--only' in args else None
CHAPS = args[args.index('--chapters') + 1].split(',') if '--chapters' in args else None
HEAVY = ('code', 'frames', 'flow', 'steps', 'check', 'controls')
MEDIUM = ('drawn', 'isense', 'names', 'words', 'yours')
DOING = set("""Add Ask Build Check Choose Clear Click Code Colour Count Do Double-click Draw Fill Find Give Hand Join Keep Let Look Make
Mark Meet Name Open Pick Plan Play Press Put Read Run Save Score See Send Set Show Start Stop Swap Switch Take Tell Test Tick Try Turn
Type Watch Write Why How What Where When Which Who Rule Now""".split())
MAXP, MAXPW, MAXTITLE, MAXINTRO, MAXDONE, MAXSAY, MAXOPEN, MAXTHING = 3, 110, 10, 30, 20, 12, 30, 7
out = []
def flag(rule, where, what):
    if ONLY and rule != ONLY: return
    out.append('%s %s: %s' % (rule, where, what))
def words(t): return len(re.sub(r'\[\[(.+?)\|\d+\]\]', r'\1', t or '').split())
def sentences(t): return len([x for x in re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"(\[])', (t or '').strip()) if x])  # a sentence starts with a capital, digit, quote or bracket; '? button' is a label
def pupil_strings(n, where=''):
    """every pupil-facing string of a chapter, for S10 (code text, ids, names and hidden goals skipped)"""
    SKIP = ('text', 'img', 'id', 'names', 'isense', 'list', 'form', 'method', 'lit', 'then', 'color', 'kind', 'from', 'to', 'goal', 'labels', 'map', 'keep', 'go', 'expect', 'foot', 'prev', 'next', 'methods', 'pick', 'typed')
    if isinstance(n, dict):
        for k, v in n.items():
            if k in SKIP: continue
            if isinstance(v, str): yield (where + '/' + k, v)
            else: yield from pupil_strings(v, where + '/' + k)
    elif isinstance(n, list):
        for i, x in enumerate(n): yield from pupil_strings(x, where + '[%d]' % i)
IX = json.load(open(os.path.join(C, 'index.json')))
ids = [c['id'] for c in IX['chapters'] if c['built'] and (not CHAPS or c['id'] in CHAPS)]
nscreens = 0
for cid in ids:
    name = 'ch' + cid; ch = json.load(open(os.path.join(C, name + '.json')))
    ixc = next(c for c in IX['chapters'] if c['id'] == cid)
    FLAT = [sc for st in ch['stages'] for sc in st['screens']]
    for si, st in enumerate(ch['stages']):
        sw = '%s stage %s' % (name, st['id'])
        thing = (st.get('thing') or '').strip()
        # S1 the part has a name in pupil words
        if not thing: flag('S1', sw, 'no thing (the part needs a noun phrase, e.g. "question 4\'s Check button")')
        elif words(thing) > MAXTHING or thing.endswith('.'): flag('S1', sw, 'thing is %d words or ends with a full stop: %r' % (words(thing), thing))
        if st.get('verb') and st['verb'] not in ('making', 'checking', 'testing', 'learning'): flag('S1', sw, 'verb must be making/checking/testing/learning')
        scs = st['screens']; openers = [sc for sc in scs if sc.get('opener')]; steps = [sc for sc in scs if not sc.get('opener')]
        # S2 a part of two or more steps opens with an opener screen; a one-step part has none
        if len(steps) >= 2:
            if not openers: flag('S2', sw, '%d steps but no opener screen' % len(steps))
            elif scs[0] is not openers[0] or str(scs[0]['id']) != '0': flag('S2', sw, 'the opener must be the first screen with id 0')
        elif openers: flag('S2', sw, 'a one-step part has no opener')
        if len(openers) > 1: flag('S2', sw, 'two openers')
        # S11 index.json carries [id, title, stepCount, thing]
        ixs = next((s for s in ixc['stages'] if str(s[0]) == str(st['id'])), None)
        if not ixs or len(ixs) < 4 or ixs[3] != thing or ixs[2] != len(steps): flag('S11', sw, 'index.json stage entry is not [id, title, %d, %r]' % (len(steps), thing))
        for ki, sc in enumerate(scs):
            key = '%s-%s' % (st['id'], sc['id']); w = '%s %s' % (name, key); nscreens += 1
            bl = sc['blocks']; kinds = [next(iter(b)) for b in bl]
            if sc.get('opener'):
                if kinds != ['open']: flag('S2', w, 'an opener has exactly one open block, found %s' % kinds)
                if sc.get('foot', 'next') != 'next': flag('S2', w, 'an opener foots with next')
                o = bl[0].get('open') or {}
                for k in ('what', 'does'):
                    if not (o.get(k) or '').strip(): flag('S9', w, 'open.%s missing' % k)
                    elif words(o[k]) > MAXOPEN: flag('S9', w, 'open.%s is %d words (max %d)' % (k, words(o[k]), MAXOPEN))
                if sc.get('done'): flag('S3', w, 'an opener has no done line (the step list is its done-when)')
                continue
            if 'open' in kinds: flag('S2', w, 'an open block outside an opener')
            # S3 done when
            dn = (sc.get('done') or '').strip()
            if not dn: flag('S3', w, 'no done line')
            elif words(dn) > MAXDONE or dn.endswith('.'): flag('S3', w, 'done is %d words or ends with a full stop: %r' % (words(dn), dn))
            # S4 one job per screen
            heavy = [k for k in kinds if k in HEAVY]; medium = [k for k in kinds if k in MEDIUM]
            for b in bl:
                bx = b.get('box')
                if isinstance(bx, dict) and not bx.get('fold'): medium.append('box')
            if len(heavy) > 1: flag('S4', w, 'two heavy blocks: ' + ' + '.join(heavy))
            if len(medium) > 1: flag('S4', w, 'two medium blocks: ' + ' + '.join(medium))
            ps = [b['p'] for b in bl if 'p' in b]; pw = sum(words(p) for p in ps)
            if len(ps) > MAXP: flag('S4', w, '%d paragraphs (max %d)' % (len(ps), MAXP))
            if pw > MAXPW: flag('S4', w, '%d words of paragraphs (max %d)' % (pw, MAXPW))
            # S5 title
            t = sc['title'].strip(); first = t.split()[0].rstrip(':,') if t else ''
            if words(t) > MAXTITLE: flag('S5', w, 'title is %d words: %r' % (words(t), t))
            if first not in DOING: flag('S5', w, 'title does not start with a doing or question word: %r' % t)
            # S6 the first block says what to do, one sentence
            if not bl or 'p' not in bl[0]: flag('S6', w, 'first block is %s, not a one-sentence p' % (kinds[0] if kinds else 'nothing'))
            else:
                p0 = bl[0]['p']
                if words(p0) > MAXINTRO: flag('S6', w, 'intro is %d words (max %d)' % (words(p0), MAXINTRO))
                if sentences(p0) > 1: flag('S6', w, 'intro is %d sentences, not one' % sentences(p0))
            # S7 watch lines and captions
            for b in bl:
                for k in ('frames', 'flow'):
                    if k in b:
                        v = b[k]; wt = (v.get('watch') or '').strip()
                        if not wt: flag('S7', w, '%s has no watch line' % k)
                        elif words(wt) > MAXSAY or wt.endswith('.'): flag('S7', w, '%s watch is %d words or ends with a full stop' % (k, words(wt)))
                        says = [fr.get('say', '') for fr in v['frames']] if k == 'frames' else [v.get('say', ''), v.get('before', '')]
                        for s in says:
                            if words(s) > MAXSAY: flag('S7', w, '%s caption is %d words (max %d): %r' % (k, words(s), MAXSAY, s[:50]))
                # S8 a later code part continues the screen before it
                if 'code' in b and b['code'].get('from', 1) > 1:
                    c = b['code']; prev = next((x for x in reversed(FLAT[:FLAT.index(sc)]) if not x.get('opener') and any('code' in b for b in x.get('blocks', []))), None)
                    pc = next((x['code'] for x in (prev['blocks'] if prev else []) if 'code' in x and x['code'].get('method') == c.get('method') and x['code'].get('form') == c.get('form')), None)
                    if not pc: flag('S8', w, 'code %s starts at line %d but the screen before has no code for %s' % (c['id'], c['from'], c.get('method')))
                    elif pc['to'] != c['from'] - 1: flag('S8', w, 'code %s starts at line %d but the screen before ended at line %d' % (c['id'], c['from'], pc['to']))
    # S10 the word "stage" never reaches a pupil (the part is named by its thing)
    for where, s in pupil_strings({'stages': ch['stages'], 'title': ch['title'], 'one': ch['one']}, name):
        if re.search(r'\bstages?\b', s, re.I): flag('S10', where, '"stage" in a pupil string: %r' % s[:60])
for where, s in pupil_strings({'intro': IX['intro'], 'header': IX['header'], 'chapters': [{'title': c['title'], 'one': c['one'], 'stages': [[x[1]] + list(x[3:]) for x in c['stages']]} for c in IX['chapters']]}, 'index'):
    if re.search(r'\bstages?\b', s, re.I): flag('S10', where, '"stage" in a pupil string: %r' % s[:60])
STR = json.load(open(os.environ.get('S2_STRINGS') or os.path.join(D, 'src', 'strings-s2.json')))
for k, v in STR.items():
    if not k.startswith('_') and re.search(r'\bstages?\b', v, re.I): flag('S10', 'strings ' + k, '"stage" in a shell string: %r' % v)
for o in out: print('PROBLEM', o)
print('G-SIGN: %d screens in %d chapters, %d problems%s' % (nscreens, len(ids), len(out), ' (only %s)' % ONLY if ONLY else ''))
sys.exit(1 if out else 0)
