#!/usr/bin/env python3
"""Build Software HQ: inline style.css + pp.js + actN.js + engine.js into self-contained ../activityN.html.
Gate: every task must carry a src that appears in S1 Software/SOURCE_MAP.md (or GAP-S4 for the flagged updates point)."""
import re, sys, pathlib
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent
SOURCE_MAP = pathlib.Path('/Users/damiengartland/Desktop/Claude Work/S1 Software/SOURCE_MAP.md').read_text()
css = (HERE / 'style.css').read_text()
engine = (HERE / 'engine.js').read_text()
pp = (HERE / 'pp.js').read_text()
shell = (HERE / 'shell.html').read_text()

def src_ok(src):
    if src.startswith('GAP-S4'):
        return 'REGULAR UPDATES (S4)' in SOURCE_MAP
    m = re.match(r'TB p(\d+)$', src)
    if m:
        return f'TB p{m.group(1)} ' in SOURCE_MAP
    m = re.match(r'PP (\d{4}) (Q\S+)$', src)
    if m:
        year, q = m.groups()
        return any(line.startswith(f'{year} {q} ') for line in SOURCE_MAP.splitlines())
    return False

fails = []
for n in range(1, 6):
    content = (HERE / f'act{n}.js').read_text()
    blob = pp + content
    # every task object starts with {type:'...'
    tasks = re.findall(r"\{type:'(\w+)'(.*?)(?=\{type:'|\Z)", blob, re.S)
    for typ, body in tasks:
        m = re.search(r"src:'([^']+)'", body)
        if not m:
            fails.append(f'act{n}: {typ} task with no src: {body[:60]!r}')
        elif not src_ok(m.group(1)):
            fails.append(f'act{n}: src not in SOURCE_MAP: {m.group(1)}')
    title = re.search(r"title:'([^']+)'", content).group(1)
    html = shell.replace('{{TITLE}}', title).replace('{{CSS}}', css).replace('{{CONTENT}}', pp + '\n' + content).replace('{{ENGINE}}', engine)
    (OUT / f'activity{n}.html').write_text(html)
    print(f'activity{n}.html  {title}  {len(html)//1024} KB')

# level gate: every teachAt index must point at a real teach card, every sim must exist
import subprocess, json
for n in range(1, 6):
    js = 'globalThis.document={addEventListener(){}};\n' + pp + (HERE / f'act{n}.js').read_text() + """
;console.log(JSON.stringify({t:ACT.teach.length,r:ACT.rounds.map(r=>({a:r.teachAt||[],m:r.mode||'',s:r.sim?(()=>{try{return typeof eval('sim_'+r.sim)}catch(e){return 'missing'}})():''}))}))"""
    tmp = pathlib.Path('/tmp/claude-501/levelgate.js'); tmp.parent.mkdir(parents=True, exist_ok=True); tmp.write_text(js)
    res = subprocess.run(['node', str(tmp)], capture_output=True, text=True)
    if res.returncode:
        fails.append(f'act{n}: level gate could not run: {res.stderr.strip().splitlines()[-1][:200] if res.stderr.strip() else res.returncode}'); continue
    out = json.loads(res.stdout)
    for i, r in enumerate(out['r']):
        bad = [a for a in r['a'] if not 0 <= a < out['t']]
        if bad: fails.append(f'act{n} round {i+1}: teachAt {bad} but only {out["t"]} teach cards')
        if r['m'] == 'sim' and r['s'] != 'function': fails.append(f'act{n} round {i+1}: sim function missing')
print('LEVEL GATE checked')

if fails:
    print('SRC GATE FAILED:'); print('\n'.join(sorted(set(fails)))); sys.exit(1)
print('SRC GATE PASSED: every task cites a SOURCE_MAP row')
