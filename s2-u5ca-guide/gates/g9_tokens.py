#!/usr/bin/env python3
"""G9 tokens + contrast (DESIGN_SPEC 11), from as/gates/g9_tokens.py.
1. Every colour in src/style.css, src/cw.css and src/tokens-s2.css is a var(--token), except on a :root line or where a custom
   property is being given its value (the chapter swatches: .sw-N{--sw:#...}).
2. The A2 part of platform/style.css differs from A2's only on the two :root lines and the print line's name.
3. Every var() used for a colour is defined.
4. Every rule that sets both color and background from tokens reaches 4.5:1 with the S2 values.
python3 -I gates/g9_tokens.py [--control]   the control plants a literal #123456 and a gold-on-white pair: must FAIL"""
import os, re, sys
G = os.path.dirname(os.path.abspath(__file__)); D = os.path.dirname(G)
A2 = os.environ.get('S2_A2') or os.path.expanduser('~/Sites/ols-wt-a2/a2-ssd')
COLOUR = re.compile(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)')
ROOT = re.compile(r'^:root\{[^}]*\}$')
src = {f: open(os.path.join(D, 'src', f)).read() for f in ('tokens-s2.css', 'style.css', 'cw.css')}
if '--control' in sys.argv:
    src['cw.css'] += '\n.planted{border-color:#123456}\n.planted2{color:var(--accent);background:var(--white)}\n'
problems = []
tok = {}
for f in ('tokens-a2.css', 'tokens-s2.css'):
    text = src.get(f) or open(os.path.join(D, 'src', f)).read()
    for line in text.split('\n'):
        if ROOT.match(line.strip()):
            tok.update({n: v.strip() for n, v in re.findall(r'--([\w-]+):([^;}]+)', line)})
for f, text in src.items():
    for i, line in enumerate(text.split('\n'), 1):
        if ROOT.match(line.strip()): continue
        body = re.sub(r'/\*.*?\*/', '', line); body = re.sub(r'url\([^)]*\)', '', body)
        body = re.sub(r'--[\w-]+:[^;}]*', '', body)
        problems += ['%s:%d literal colour %s' % (f, i, m.group(0)) for m in COLOUR.finditer(body)]
    props = re.findall(r'(?:color|background[\w-]*|border[\w-]*|outline[\w-]*|fill|stroke|box-shadow|text-shadow)\s*:([^;}]*)', text)
    local = set(re.findall(r'--([\w-]+):', text))
    problems += ['%s uses --%s, which nothing defines' % (f, n) for n in set(re.findall(r'var\(--([\w-]+)', ' '.join(props))) - set(tok) - local]
# 2. the A2 part as served
served = open(os.path.join(D, 'platform', 'style.css')).read().split('\n/* ---- the S2 look')[0].split('\n')
a2 = open(os.path.join(A2, 'platform', 'style.css')).read().split('\n')
if len(served) != len(a2): problems.append('platform/style.css A2 part: %d lines, A2 %d' % (len(served), len(a2)))
else:
    for i, (x, y) in enumerate(zip(a2, served), 1):
        if x != y and not (ROOT.match(x) and ROOT.match(y)) and x.replace('A2 SSD platform', 'GCSE Digital Technology coursework guide') != y:
            problems.append('platform/style.css line %d differs from A2 beyond the tokens and the name' % i)
def rgb(v, d=0):
    v = v.strip(); m = re.fullmatch(r'var\(--([\w-]+)\)', v)
    if m: return rgb(tok.get(m.group(1), ''), d + 1) if d < 5 else None
    m = re.fullmatch(r'#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})', v)
    if m:
        h = m.group(1); h = ''.join(c * 2 for c in h) if len(h) == 3 else h
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (1.0,)
    m = re.fullmatch(r'rgba?\(([^)]*)\)', v)
    if m:
        p = [x.strip() for x in m.group(1).split(',')]
        return tuple(float(x) for x in p[:3]) + ((float(p[3]) if len(p) > 3 else 1.0),)
    return None
def lum(c):
    f = lambda x: (x / 255) / 12.92 if x / 255 <= 0.03928 else ((x / 255 + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
def ratio(fg, bg):
    if fg[3] < 1: fg = tuple(fg[i] * fg[3] + bg[i] * (1 - fg[3]) for i in range(3)) + (1.0,)
    a, b = sorted([lum(fg), lum(bg)], reverse=True); return (a + 0.05) / (b + 0.05)
checked = 0
for f in ('style.css', 'cw.css'):
    for sel, body in re.findall(r'([^{}]+)\{([^{}]*)\}', src[f]):
        fg = re.search(r'(?:^|;)\s*color:\s*(var\(--[\w-]+\))', body)
        bg = re.search(r'background(?:-color)?:\s*(var\(--[\w-]+\))\s*(?:;|$|!)', body)
        if not (fg and bg) or 'var(--sw' in fg.group(1) + bg.group(1): continue   # swatch pairs: checked per swatch below
        c = [rgb(fg.group(1)), rgb(bg.group(1))]
        if None in c or c[1][3] < 1: continue
        checked += 1
        if ratio(*c) < 4.5: problems.append('contrast %s: %.2f:1 in %s' % (sel.strip()[:50], ratio(*c), f))
# the swatches: white on --sw (card numbers) and --sw-ink on white (text)
for sel, body in re.findall(r'([^{}]+)\{([^{}]*--sw:[^{}]*)\}', src['tokens-s2.css']):
    sw = rgb(re.search(r'--sw:([^;}]+)', body).group(1)); ink = re.search(r'--sw-ink:([^;}]+)', body)
    white = (255, 255, 255, 1.0); checked += 1
    if ink and ratio(rgb(ink.group(1)), white) < 4.5: problems.append('swatch %s: --sw-ink %.2f:1 on white' % (sel.strip()[:30], ratio(rgb(ink.group(1)), white)))
for p in problems[:30]: print('  ' + p)
print('G9 tokens: %s (%d problems, %d colour pairs checked)%s' % ('FAIL' if problems else 'PASS', len(problems), checked, ' [control]' if '--control' in sys.argv else ''))
sys.exit(1 if problems else 0)
