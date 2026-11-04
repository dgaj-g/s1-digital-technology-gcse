/* Build gates for the HQ activities (run by build.py in node; never shipped in a page).
   TAUGHT FIRST: every exam question a boss can draw lists what it needs (needs:[tags]); a lesson card shown at or before
     that boss (teaches:[tags]), or an earlier round that teaches by doing (round.teaches), must teach every one of them.
   NO REPEATS: every exam question has a shape (the kind of question). A boss draws at most 2 of one shape, so its pool
     must be able to fill the draw under that rule.
   REAL FIGURES: every exam question whose paper question has a figure (figs/figures.json) shows that figure, the file
     exists, and no retyped table sits beside it.
   MARKS SHOWN = MARKS AWARDED: every exam question's ref states its marks, and they equal what the item can award.
   gateAct / gateFigs / gateMarks return a list of failures; the controls at the bottom must each produce at least one. */
const GATE_FS = require('fs'), GATE_PATH = require('path');
function gateTaught(ACT, upto) {
  const s = new Set();
  ACT.rounds.slice(0, upto + 1).forEach(r => {
    (r.teachAt || []).forEach(i => ((ACT.teach[i] || {}).teaches || []).forEach(t => s.add(t)));
    (r.teaches || []).forEach(t => s.add(t));
  });
  return s;
}
function gateAct(name, ACT, PP) {
  const f = [], keyOf = new Map(Object.entries(PP).map(([k, v]) => [v, k]));
  ACT.rounds.forEach((r, i) => {
    const where = `${name} round ${i + 1} (${r.title})`;
    if ((r.mode === 'boss' || r.boss) && !r.pool) f.push(`${where}: a boss round must draw from a pool`);
    if (!r.pool) return;
    const taught = gateTaught(ACT, i), all = [];
    r.pool.forEach(([items, n], g) => {
      if (!Array.isArray(items) || typeof n !== 'number') return f.push(`${where}: pool group ${g + 1} is not [items, n]`);
      items.forEach((t, j) => { if (!t) f.push(`${where}: pool group ${g + 1} item ${j + 1} does not exist in the exam bank`); else all.push(t); });
      const c = {}; items.filter(Boolean).forEach(t => c[t.shape] = (c[t.shape] || 0) + 1);
      const supply = Object.values(c).reduce((a, x) => a + Math.min(2, x), 0);
      if (n > supply) f.push(`${where}: pool group ${g + 1} wants ${n} questions but only ${supply} can be drawn with at most 2 of one kind`);
    });
    all.forEach(t => {
      const k = keyOf.get(t) || '(unnamed item)';
      if (!t.shape) f.push(`${where}: ${k} has no shape`);
      if (!Array.isArray(t.needs)) f.push(`${where}: ${k} does not list what it needs`);
      (t.needs || []).filter(x => !taught.has(x)).forEach(x => f.push(`${where}: ${k} needs "${x}" but no lesson at or before this round teaches it`));
    });
    const c = {}; all.forEach(t => c[t.shape] = (c[t.shape] || 0) + 1);
    const supply = Object.values(c).reduce((a, x) => a + Math.min(2, x), 0), want = r.pool.reduce((a, [, n]) => a + n, 0);
    if (want > supply) f.push(`${where}: the boss wants ${want} questions but only ${supply} can be drawn with at most 2 of one kind`);
    /* play the real draw many times: the 2-of-a-kind rule runs across groups, so one group can starve a later one */
    let short = 0; for (let k = 0; k < 300; k++) { const d = gateDraw(r.pool); if (d.length < want) short = Math.max(short, want - d.length); }
    if (short) f.push(`${where}: some draws come up ${short} short of ${want} questions, because one group uses up a kind another group needs`);
  });
  return f;
}
/* a copy of drawBoss in engine.js; the gate fails if the two ever differ */
function gateShuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function gateDraw(pool) {
  const cap = {}, out = [];
  pool.forEach(([items, n]) => { let k = 0; gateShuffle(items.filter(Boolean)).forEach(t => { const sh = t.shape || t.src; if (k < n && (cap[sh] || 0) < 2) { cap[sh] = (cap[sh] || 0) + 1; out.push(t); k++; } }); });
  return out;
}
function gateFigs(PP, FIGS, figDir) {
  const f = [];
  FIGS.forEach(F => (F.keys || []).forEach(k => {
    const t = PP[k];
    if (!t) return f.push(`figures.json: ${k} is not in the exam bank`);
    if ([].concat(t.fig || []).indexOf(F.file) < 0) f.push(`${k}: the paper question has a figure but the item does not show figs/${F.file}`);
  }));
  Object.entries(PP).forEach(([k, t]) => {
    [].concat(t.fig || []).forEach(fl => { if (!GATE_FS.existsSync(GATE_PATH.join(figDir, fl))) f.push(`${k}: figs/${fl} is missing`); });
    if (t.fig && /<table/i.test(t.q)) f.push(`${k}: shows the real figure and a retyped table as well`);
  });
  return f;
}
/* the marks a question awards (a copy of taskMax in engine.js) */
function gateMax(t) {
  if (t.type === 'match') return (t.pairs || []).length;
  if (t.type === 'fill') return ((t.text || '').match(/\[\[/g) || []).length;
  if (t.type === 'order') return (t.steps || []).length;
  if (t.type === 'pick') return t.need;
  return 1;
}
function gateMarks(PP) {
  const f = [];
  Object.entries(PP).forEach(([k, t]) => {
    const m = /(\d+) marks?\b/.exec(t.ref || '');
    if (!m) return f.push(`${k}: the ref does not say how many marks the question is worth`);
    if (+m[1] !== gateMax(t)) f.push(`${k}: the ref says ${m[1]} mark(s) but the question awards ${gateMax(t)}`);
    if (t.alts && t.alts.some(a => a.length !== gateMax(t))) f.push(`${k}: an accepted answer set does not fill every gap`);
  });
  return f;
}
/* controls: each one is broken on purpose and must be caught */
function gateControls(figDir) {
  const T = { shape: 'x', needs: ['b'], src: 'PP 2019 Q1' };
  const C = {
    'untaught tag': gateAct('control', { teach: [{ teaches: ['a'] }], rounds: [{ title: 'c', teachAt: [0], pool: [[[T], 1]] }] }, { T }),
    'three of one kind': gateAct('control', { teach: [{ teaches: ['b'] }], rounds: [{ title: 'c', teachAt: [0], pool: [[[T, { ...T }, { ...T }], 3]] }] }, { T }),
    'boss without a pool': gateAct('control', { teach: [], rounds: [{ title: 'c', boss: { icon: 'x', name: 'x' }, tasks: [] }] }, {}),
    'one group starves another': gateAct('control', { teach: [{ teaches: ['b'] }], rounds: [{ title: 'c', teachAt: [0], pool: [[[T, { ...T }], 2], [[{ ...T }, { ...T, shape: 'z' }], 2]] }] }, { T }),
    'item with no needs': gateAct('control', { teach: [], rounds: [{ title: 'c', pool: [[[{ shape: 'y' }], 1]] }] }, {}),
    'figure not shown': gateFigs({ k: { q: 'x' } }, [{ file: 'k.png', keys: ['k'] }], figDir),
    'figure file missing': gateFigs({ k: { q: 'x', fig: 'no-such-figure.png' } }, [], figDir),
    'figure plus retyped table': gateFigs({ k: { q: '<table class="dt"></table>', fig: 'no-such-figure.png' } }, [], figDir),
    'marks shown but not awarded': gateMarks({ k: { type: 'mcq', ref: '2019 Q1 · 2 marks' } }),
    'no marks shown': gateMarks({ k: { type: 'mcq', ref: '2019 Q1' } }),
    'answer set with a gap missing': gateMarks({ k: { type: 'fill', text: '[[a]] [[b]]', alts: [['a', 'b'], ['c']], ref: '2019 Q1 · 2 marks' } })
  };
  return Object.entries(C).filter(([, v]) => !v.length).map(([k]) => k);
}
