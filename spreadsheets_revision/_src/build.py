#!/usr/bin/env python3
"""Build Spreadsheets HQ: inline style.css + pp.js + common.js + actN.js + engine.js into self-contained ../activityN.html.
Source gate: every task must carry a src that resolves to a TB row in S1 Spreadsheets/SOURCE_MAP.md or a
past-paper row at the start of a table row in S1 Spreadsheets/PAST_PAPER_SWEEP.md. Built-in bad-source controls must FAIL."""
import re, sys, pathlib, subprocess, json
HQ = 'Spreadsheets HQ'
TOPIC = pathlib.Path('/Users/damiengartland/Desktop/Claude Work/Archive - S1 old working folders (Nov 2026)/S1 Spreadsheets')
HERE = pathlib.Path(__file__).parent
OUT = HERE.parent
SOURCE_MAP = (TOPIC / 'SOURCE_MAP.md').read_text()
SWEEP = (TOPIC / 'PAST_PAPER_SWEEP.md').read_text().splitlines()
css = (HERE / 'style.css').read_text()
engine = (HERE / 'engine.js').read_text()
pp = (HERE / 'pp.js').read_text()
common = (HERE / 'common.js').read_text() if (HERE / 'common.js').exists() else ''
shell = (HERE / 'shell.html').read_text()

def src_ok(src):
    # 'Practice, TB p18' marks a made-up practice card built on a real page or paper question; the page must still be real
    if src.startswith('Practice, '):
        src = src[len('Practice, '):]
    m = re.match(r'TB p(\d+)$', src)
    if m:
        return f'TB p{m.group(1)} ' in SOURCE_MAP
    m = re.match(r'PP (\d{4}) (Q\S+)$', src)
    if m:
        pre = f'| {m.group(1)} {m.group(2)}'
        return any(l.startswith(pre) and l[len(pre):len(pre)+1] in (' ', '|') for l in SWEEP)
    return False

# controls: these must fail, or the gate itself is broken
CONTROLS = ['TB p99', 'PP 2020 Q1', 'Fact file', 'PP 2019', 'TB p1', 'Practice', 'Practice, TB p99']
broken = [c for c in CONTROLS if src_ok(c)]
if broken:
    print('SRC GATE BROKEN: bad-source controls passed:', broken); sys.exit(1)
print(f'CONTROLS OK: {len(CONTROLS)} bad sources all rejected')

fails = []
count = 0
for n in range(1, 6):
    content = (HERE / f'act{n}.js').read_text()
    blob = pp + content
    tasks = re.findall(r"\{type:'(\w+)'(.*?)(?=\{type:'|\Z)", blob, re.S)
    for typ, body in tasks:
        m = re.search(r"src:'([^']+)'", body)
        count += 1
        if not m:
            fails.append(f'act{n}: {typ} task with no src: {body[:60]!r}')
        elif not src_ok(m.group(1)):
            fails.append(f'act{n}: src not in sources: {m.group(1)}')
    title = re.search(r"const ACT=\{\s*title:'([^']+)'", content).group(1)
    html = (shell.replace('{{TITLE}}', title).replace('{{HQ}}', HQ).replace('{{CSS}}', css)
            .replace('{{CONTENT}}', f"const HQ_NAME='{HQ}';\n" + pp + '\n' + common + '\n' + content).replace('{{ENGINE}}', engine))
    (OUT / f'activity{n}.html').write_text(html)
    print(f'activity{n}.html  {title}  {len(html)//1024} KB')

# level gate: every teachAt index must point at a real teach card, every sim must exist
# + the v3 gates in gates.js: taught first, no repeats, real figures (each has controls that must fail)
gates = (HERE / 'gates.js').read_text()
FIGDIR = OUT / 'figs'
FIGJSON = FIGDIR / 'figures.json'
figs = FIGJSON.read_text() if FIGJSON.exists() else '[]'
STUB = 'globalThis.document={addEventListener(){}};globalThis.window=globalThis;\n'
def node(js):
    tmp = HERE.parent / '_levelgate.tmp.js'; tmp.write_text(js)
    res = subprocess.run(['node', str(tmp)], capture_output=True, text=True); tmp.unlink()
    return res
res = node(gates + f"\nconsole.log(JSON.stringify(gateControls({json.dumps(str(FIGDIR))})))")
if res.returncode: print('GATES COULD NOT RUN:', res.stderr[-400:]); sys.exit(1)
missed = json.loads(res.stdout)
if missed: print('GATE BROKEN: these broken controls were NOT caught:', missed); sys.exit(1)
print('GATE CONTROLS OK: every broken control caught (' + str(gates.count("': gate")) + ')')
res = node(STUB + pp + gates + f"\nconsole.log(JSON.stringify(gateFigs(PP,{figs},{json.dumps(str(FIGDIR))})))")
if res.returncode: fails.append('figure gate could not run: ' + res.stderr[-300:])
else: fails += json.loads(res.stdout)
res = node(STUB + pp + gates + "\nconsole.log(JSON.stringify(gateMarks(PP)))")
if res.returncode: fails.append('marks gate could not run: ' + res.stderr[-300:])
else: fails += json.loads(res.stdout)
for n in range(1, 6):
    js = STUB + pp + common + (HERE / f'act{n}.js').read_text() + '\n' + gates + """
;console.log(JSON.stringify({g:gateAct('act%d',ACT,PP),t:ACT.teach.length,r:ACT.rounds.map(r=>({a:r.teachAt||[],m:r.mode||'',s:r.sim?(()=>{try{return typeof eval('sim_'+r.sim)}catch(e){return 'missing'}})():''}))}))""" % n
    res = node(js)
    if res.returncode:
        fails.append(f'act{n}: level gate could not run: {res.stderr.strip().splitlines()[-1][:200] if res.stderr.strip() else res.returncode}'); continue
    out = json.loads(res.stdout)
    fails += out['g']
    for i, r in enumerate(out['r']):
        bad = [a for a in r['a'] if not 0 <= a < out['t']]
        if bad: fails.append(f'act{n} round {i+1}: teachAt {bad} but only {out["t"]} teach cards')
        if r['m'] == 'sim' and r['s'] != 'function': fails.append(f'act{n} round {i+1}: sim function missing')
print('LEVEL + TAUGHT-FIRST + REPEAT + FIGURE GATES checked')

if fails:
    print('SRC GATE FAILED:'); print('\n'.join(sorted(set(fails)))); sys.exit(1)
print(f'SRC GATE PASSED: {count} tasks, every one cites a SOURCE_MAP or PAST_PAPER_SWEEP row')
