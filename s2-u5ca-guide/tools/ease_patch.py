#!/usr/bin/env python3
"""EASE round 3 (21 Oct 2026): anchored signposting edits to the chapter SOURCE files (tools/chapters/chNN.py; ch00 in build_content.py).
A one-off tool kept as the record of how the chapters were patched. The chapter files stay the truth; this never touches content/*.json.

Usage: python3 -I tools/ease_patch.py SPEC.py    SPEC defines PATCHES = {"01": {...}, ...} with per-chapter ops:
  stage   {sid: (thing, verb)}                          adds "thing"/"verb" to the stage line
  opener  {sid: (title, goal, what, does)}              inserts opener(...) as the stage's first screen
  title   {"s-n": new}      done {"s-n": text}      foot {"s-n": "done"}        (keyed by ORIGINAL screen ids)
  intro   {"s-n": "auto" | "new first p" | ("new", None) | ("new", "rest")}
  watch   {"s-n": text}     labels {"s-n": "QL"|"DL"}   (first frames/flow block in the screen)
  say     {frame_id: text}                              shortens a frames caption anywhere in the chapter
  split   {"s-n": (anchor_prefix, title, done, goal[, foot])}  starts a new screen at the line beginning with anchor_prefix
  replace [(old, new), ...]                             raw text, each must occur exactly once in the chapter region
After the edits, screens are renumbered 1..n per part (openers are 0) and every #cw/NN/s-n link and words-row screen key is repointed."""
import re, sys, os, glob, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__))
STAGE = re.compile(r'^(\s*)\{"id": "(\d+)", "title": "([^"]*)",( "thing": "[^"]*", "verb": "\w+",)? "screens": \[\s*$')
SCREEN = re.compile(r'^(\s*)\{"id": "(\d+|X)", "title": "([^"]*)", "foot": "([\w-]+)",( "done": "[^"]*",)?\s*$')
OPENER = re.compile(r'^\s*opener\(')
P = re.compile(r'^(\s*)\{"p": "(.*)"\},?\s*$')
FRAMES = re.compile(r'^(\s*)frames\("(F\d+)", "([^"]*)", \[\s*$')
FLOW = re.compile(r'\{"flow": \{')
SAY = re.compile(r'\("(f[\w-]+)", "([^"]*)", "([^"]*)"\)')
def q(s):
    assert '"' not in s, 'double quote in: %r' % s
    return '"%s"' % s
def region(path, ch):
    L = open(path).read().split('\n')
    if ch == '00':
        a = next(i for i, l in enumerate(L) if l.startswith('ch0 = '))
        b = next(i for i, l in enumerate(L) if l.startswith('BUILT = '))
        return L, a, b
    return L, 0, len(L)
def scan(L, a, b):
    """stages: [{line, id, screens: [{line, id, opener, blocks_line, end}]}] in region order"""
    stages = []
    for i in range(a, b):
        m = STAGE.match(L[i])
        if m: stages.append({'line': i, 'id': m.group(2), 'screens': []}); continue
        if not stages: continue
        m = SCREEN.match(L[i])
        if m: stages[-1]['screens'].append({'line': i, 'id': m.group(2), 'opener': False, 'indent': m.group(1)}); continue
        if OPENER.match(L[i]): stages[-1]['screens'].append({'line': i, 'id': '0', 'opener': True, 'indent': re.match(r'\s*', L[i]).group(0)})
    # ends
    heads = sorted([s['line'] for s in stages] + [sc['line'] for s in stages for sc in s['screens']]) + [b]
    for s in stages:
        for sc in s['screens']:
            sc['end'] = min(h for h in heads if h > sc['line'])
            if not sc['opener']:
                sc['blocks_line'] = next(j for j in range(sc['line'], sc['end']) if L[j].strip() == '"blocks": [')
    return stages
def patch(ch, spec, files):
    path = files[ch]
    L, a, b = region(path, ch)
    stages = scan(L, a, b)
    byid = {}
    for s in stages:
        for sc in s['screens']:
            if not sc['opener']: byid['%s-%s' % (s['id'], sc['id'])] = sc
    before, repl, after = {}, {}, {}
    def ins_before(i, lines): before.setdefault(i, []).extend(lines)
    def ins_after(i, lines): after.setdefault(i, []).extend(lines)
    def set_line(i, lines): assert i not in repl, 'line %d edited twice' % (i + 1); repl[i] = lines
    # raw replacements first (on the region text), re-scan after
    for old, new in spec.get('replace', []):
        txt = '\n'.join(L[a:b]); n = txt.count(old)
        assert n == 1, 'replace anchor found %d times in ch%s: %r' % (n, ch, old[:60])
        L[a:b] = txt.replace(old, new).split('\n')
    # recompute region bounds and rescan after raw edits
    L, a, b = region_lines(L, ch); stages = scan(L, a, b); byid = {}
    for s in stages:
        for sc in s['screens']:
            if not sc['opener']: byid['%s-%s' % (s['id'], sc['id'])] = sc
    # per-screen ops
    for key, new in spec.get('title', {}).items():
        sc = byid[key]; m = SCREEN.match(L[sc['line']]); sc['title'] = new
    for key in set(list(spec.get('title', {})) + list(spec.get('done', {})) + list(spec.get('foot', {}))):
        sc = byid[key]; m = SCREEN.match(L[sc['line']])
        title = spec.get('title', {}).get(key, m.group(3)); foot = spec.get('foot', {}).get(key, m.group(4))
        done = spec.get('done', {}).get(key)
        if done is None and m.group(5): done = re.search(r'"done": "([^"]*)"', m.group(5)).group(1)
        line = '%s{"id": "%s", "title": %s, "foot": "%s",%s' % (m.group(1), m.group(2), q(title), foot, (' "done": %s,' % q(done)) if done else '')
        set_line(sc['line'], [line])
    for key, how in spec.get('intro', {}).items():
        sc = byid[key]; j = sc['blocks_line'] + 1; m = P.match(L[j]); ind = re.match(r'\s*', L[j]).group(0)
        if how == 'auto':
            assert m, 'ch%s %s first block is not a p' % (ch, key)
            mm = re.match(r'^(.*?[.!?])\s+(\S.*)$', m.group(2)); assert mm, 'cannot split %r' % m.group(2)
            set_line(j, ['%s{"p": %s},' % (ind, q(mm.group(1))), '%s{"p": %s},' % (ind, q(mm.group(2)))])
        elif isinstance(how, str):
            ins_before(j, ['%s{"p": %s},' % (ind, q(how))])
        else:
            assert m, 'ch%s %s first block is not a p' % (ch, key)
            new, rest = how
            set_line(j, ['%s{"p": %s},' % (ind, q(new))] + (['%s{"p": %s},' % (ind, q(rest))] if rest else []))
    for key, w in spec.get('watch', {}).items():
        sc = byid[key]; hit = False
        for j in range(sc['blocks_line'], sc['end']):
            m = FRAMES.match(L[j])
            if m: set_line(j, ['%sframes("%s", %s, watch=%s, fr=[' % (m.group(1), m.group(2), q(m.group(3)), q(w))]); hit = True; break
            if FLOW.search(L[j]):
                lab = spec.get('labels', {}).get(key)
                set_line(j, [L[j].replace('{"flow": {', '{"flow": {"watch": %s, %s' % (q(w), ('"labels": %s, ' % lab) if lab else ''), 1)]); hit = True; break
        assert hit, 'ch%s %s has no frames/flow line' % (ch, key)
    for key, lab in spec.get('labels', {}).items():
        if key in spec.get('watch', {}): continue
        sc = byid[key]; j = next(j for j in range(sc['blocks_line'], sc['end']) if FLOW.search(L[j]))
        set_line(j, [L[j].replace('{"flow": {', '{"flow": {"labels": %s, ' % lab, 1)])
    for key, sp in spec.get('split', {}).items():
        sc = byid[key]; anchor, title, done, goal = sp[:4]; foot = sp[4] if len(sp) > 4 else None
        hm = SCREEN.match(L[sc['line']]); ofoot = hm.group(4)
        js = [j for j in range(sc['blocks_line'] + 1, sc['end']) if L[j].startswith(anchor)]
        assert len(js) == 1, 'ch%s %s split anchor found %d times: %r' % (ch, key, len(js), anchor)
        j = js[0]; ind = sc['indent']; bind = re.match(r'\s*', L[sc['blocks_line']]).group(0)
        ins_before(j, ['%s]},' % ind, '%s{"id": "X", "title": %s, "foot": "%s", "done": %s,' % (ind, q(title), foot or ofoot, q(done)),
                       '%s"goal": %s,' % (bind, q(goal)), '%s"blocks": [' % bind])
        # the top half foots "done" unless told otherwise (a chapter-done foot belongs to the bottom half)
        if key not in spec.get('foot', {}) and ofoot == 'chapter-done':
            m = SCREEN.match(L[sc['line']]); cur = repl.get(sc['line'], [L[sc['line']]])[0]
            repl[sc['line']] = [cur.replace('"foot": "chapter-done",', '"foot": "done",', 1)]
    for s in stages:
        if s['id'] in spec.get('stage', {}):
            thing, verb = spec['stage'][s['id']]; m = STAGE.match(L[s['line']])
            assert not m.group(4), 'ch%s stage %s already has a thing' % (ch, s['id'])
            set_line(s['line'], ['%s{"id": "%s", "title": %s, "thing": %s, "verb": "%s", "screens": [' % (m.group(1), s['id'], q(m.group(3)), q(thing), verb)])
        if s['id'] in spec.get('opener', {}):
            t, g, w, d = spec['opener'][s['id']]
            assert not (s['screens'] and s['screens'][0]['opener']), 'ch%s stage %s already has an opener' % (ch, s['id'])
            ind = s['screens'][0]['indent'] if s['screens'] else '   '
            ins_after(s['line'], ['%sopener(%s, %s,' % (ind, q(t), q(g)), '%s        %s,' % (ind, q(w)), '%s        %s),' % (ind, q(d))])
    for fid, text in spec.get('say', {}).items():
        hits = [j for j in range(a, b) if re.search(r'\("%s", ' % re.escape(fid), L[j])]
        assert len(hits) == 1, 'ch%s caption %s found %d times' % (ch, fid, len(hits))
        j = hits[0]; m = SAY.search(L[j]); assert m and m.group(1) == fid
        set_line(j, [L[j][:m.start(3)] + text + L[j][m.end(3):]])
    out = []
    for i, line in enumerate(L):
        out += before.get(i, []); out += repl.get(i, [line]); out += after.get(i, [])
    open(path, 'w').write('\n'.join(out))
    remap = renumber(ch, path, files)
    for old, new in spec.get('post', []):
        L, a, b = region(path, ch); txt = '\n'.join(L[a:b]); n = txt.count(old)
        assert n == 1, 'post anchor found %d times in ch%s: %r' % (n, ch, old[:60])
        L[a:b] = txt.replace(old, new).split('\n'); open(path, 'w').write('\n'.join(L))
    return remap
def region_lines(L, ch):
    if ch == '00':
        a = next(i for i, l in enumerate(L) if l.startswith('ch0 = '))
        b = next(i for i, l in enumerate(L) if l.startswith('BUILT = '))
        return L, a, b
    return L, 0, len(L)
def renumber(ch, path, files):
    """ids 1..n per part in source order (openers 0); returns {old: new} for screens whose id changed, and repoints links"""
    L, a, b = region(path, ch); stages = scan(L, a, b); remap = {}
    for s in stages:
        k = 0
        for sc in s['screens']:
            if sc['opener']: continue
            k += 1; m = SCREEN.match(L[sc['line']]); old = m.group(2)
            if old != str(k):
                L[sc['line']] = L[sc['line']].replace('{"id": "%s", ' % old, '{"id": "%d", ' % k, 1)
                if old != 'X': remap['%s-%s' % (s['id'], old)] = '%s-%d' % (s['id'], k)
    open(path, 'w').write('\n'.join(L))
    if remap:
        # links in every source file; words-row keys only in this chapter's region
        for p in set(files.values()):
            T = open(p).read(); T0 = T
            T = re.sub(r'#cw/%s/(\d+-\d+)\b' % ch, lambda m: '#cw/%s/%s' % (ch, remap.get(m.group(1), m.group(1))), T)
            if T != T0: open(p, 'w').write(T)
        L, a, b = region(path, ch)
        for i in range(a, b):
            if ch != '00': L[i] = re.sub(r'\bscreen (\d+-\d+)\b', lambda m: 'screen ' + remap.get(m.group(1), m.group(1)), L[i])
            L[i] = re.sub(r'(\[\s*"[^"]*", "[^"]*", )"(\d+-\d+)"(, (?:True|False)\])', lambda m: m.group(1) + '"%s"' % remap.get(m.group(2), m.group(2)) + m.group(3), L[i])
        open(path, 'w').write('\n'.join(L))
    return remap
def main():
    specfile = sys.argv[1]
    spec = importlib.util.spec_from_file_location('spec', specfile); mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    files = {os.path.basename(p)[2:4]: p for p in glob.glob(os.path.join(HERE, 'chapters', 'ch[0-9][0-9].py'))}
    files['00'] = os.path.join(HERE, 'build_content.py')
    for ch in sorted(mod.PATCHES):
        snap = {p: open(p).read() for p in set(files.values())}
        try: remap = patch(ch, mod.PATCHES[ch], files)
        except Exception:
            for p, t in snap.items(): open(p, 'w').write(t)
            print('ch%s FAILED, files restored' % ch); raise
        print('ch%s patched%s' % (ch, (': renumbered ' + ', '.join('%s>%s' % kv for kv in sorted(remap.items()))) if remap else ''))
if __name__ == '__main__': main()
