/* S2 G15 / T1–T6: the AS apiCw test (as/gates/t-apicw.js) run on the S2 build, chapter 07, plus the had op (T7).
 *   S2_BASE=http://127.0.0.1:8851 node s2-u5ca-guide/gates/t-apicw.js [--control]   → s2-u5ca-guide/gates/T_REPORT.txt
 *   --control asks for had on chapter 99 to be ACCEPTED: must FAIL */
const fs = require('fs'), path = require('path');
const BASE = process.env.S2_BASE || 'http://127.0.0.1:8851', CLS = 'S2-CW-T' + (Date.now() % 100000), P = 'pupil7@c2ken.net', OWNER = 'dgartland021@c2ken.net';
const IX = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content', 'index.json'), 'utf8'));
const CODE = fs.readFileSync(path.join(process.env.S2_PRIVATE || '/Users/damiengartland/Desktop/Claude Work/S2 U5CA Guide/_platform', 'deploy', 'Code.gs'), 'utf8');
const S7 = JSON.parse(CODE.match(/var CWMETA = (.*);/)[1])['07'];   // the tick ids build-s2.js gave the server
const rows = []; let fails = 0;
const ok = (id, name, pass, d) => { rows.push((pass ? 'PASS ' : 'FAIL ') + id + ' ' + name + (d ? ' — ' + d : '')); if (!pass) fails++; };
const post = async (p, body, who) => (await fetch(BASE + p, { method: 'POST', headers: { 'content-type': 'application/json', 'x-dev-user': who || '' }, body: JSON.stringify(body || {}) })).json();
const cw = (req) => post('/api/apiCw', Object.assign({ cls: CLS }, req), P);
const raw = async () => { const s = (await post('/__store')).script; return s['w:' + CLS + ':' + P] || ''; };
const W = async () => JSON.parse((await raw()) || '{}');
const seen = async () => ((await post('/api/apiStaff', { cls: CLS, op: 'coursework', name: CLS }, OWNER)).pupils || []).find((p) => p.email === P);
(async () => {
  await post('/api/apiStaff', { cls: CLS, op: 'create', name: CLS }, OWNER);
  await post('/api/apiBoot', { cls: CLS }, P);
  await post('/__clock', { at: 500000 });
  await cw({ op: 'open', ch: '07' }); let w = (await W())['07'];
  ok('T1', 'open creates w: with o=1, f, l', w && w.o === 1 && w.f === 500000 && w.l === 500000 && 'a' in w, JSON.stringify(w));
  await post('/__clock', { at: 500003 });
  await cw({ op: 'screen', ch: '07', key: '6-3' }); w = (await W())['07'];
  ok('T1', 'screen sets a', w.a === '6-3', w.a);
  const before = JSON.stringify(Object.assign({}, w, { k: null }));
  await cw({ op: 'tick', ch: '07', id: S7[0], on: true }); await cw({ op: 'tick', ch: '07', id: S7[3], on: true }); w = (await W())['07'];
  const k1 = w.k;
  ok('T2', 'tick on sets bits, nothing else moves', k1 && JSON.stringify(Object.assign({}, w, { k: null })) === before, 'k=' + k1);
  await cw({ op: 'tick', ch: '07', id: S7[3], on: false }); w = (await W())['07'];
  ok('T2', 'tick off clears that bit only', w.k !== k1 && (await post('/api/apiCw', { cls: CLS, op: 'state' }, P)).W['07'].k.join(',') === S7[0], JSON.stringify((await post('/api/apiCw', { cls: CLS, op: 'state' }, P)).W['07'].k));
  await cw({ op: 'copy', ch: '07' }); await cw({ op: 'copy', ch: '07' }); await cw({ op: 'reveal', ch: '07' }); w = (await W())['07'];
  ok('T3', 'copy and reveal count up', w.c === 2 && w.r === 1, 'c=' + w.c + ' r=' + w.r);
  await post('/__clock', { at: 500005 });
  await cw({ op: 'done', ch: '07', on: true }); w = (await W())['07'];
  ok('T4', 'done sets d to the minute', w.d === 500005, 'd=' + w.d);
  await cw({ op: 'had', ch: '07', v: 1 }); w = (await W()); let ev = (w.e || []).slice(-1)[0] || [];
  ok('T7', 'had v:1 sets h and logs h', w['07'].h === 1 && ev[1] === 'h' && ev[2] === '07', 'h=' + w['07'].h + ' e=' + JSON.stringify(ev));
  const g = await seen();
  ok('T7', 'the class grid shows the chapter as had', g && g.W['07'].h === 1, JSON.stringify(g && g.W['07']));
  await cw({ op: 'had', ch: '07', v: 0 }); w = (await W()); ev = (w.e || []).slice(-1)[0] || [];
  ok('T7', 'had v:0 clears h and logs g', !w['07'].h && ev[1] === 'g', 'h=' + w['07'].h + ' e=' + JSON.stringify(ev));
  const hb = await cw({ op: 'had', ch: process.argv.includes('--control') ? '07' : '99', v: 1 });
  ok('T7', 'had on an unknown chapter refused with bad-key', hb.ok === false && hb.error === 'bad-key', JSON.stringify(hb));
  await cw({ op: 'had', ch: '07', v: 0 });
  const n1 = await cw({ op: 'notice', id: 's2-guide' }), n2 = await cw({ op: 'notice', id: 'Bad Id!' }), N = (await W()).N || {};
  ok('T4', 'the stale-build notice is logged once, a bad notice id refused', n1.ok !== false && N['s2-guide'] && n2.error === 'bad-key', JSON.stringify(N) + ' ' + n2.error);
  const T = 'teacher' + (Date.now() % 100000) + '@c2ken.net';   // fresh each run: an admitted teacher stays admitted
  await post('/__set', { script: { staffPasscode: 'g15-pass' } });
  const s1 = await post('/api/apiStaff', { op: 'coursework', name: CLS }, T), s2 = await post('/api/apiStaff', { op: 'check', pass: 'wrong' }, T);
  const s3 = await post('/api/apiStaff', { op: 'check', pass: 'g15-pass' }, T);
  await post('/__set', { script: { staffPasscode: '' } });
  ok('T5', 'staff grid refused before the passcode, a wrong passcode refused, the right one admits', s1.error === 'not-staff' && s2.error === 'bad-pass' && s3.admitted === true, [s1.error, s2.error, s3.admitted].join(','));
  const len = (await raw()).length;
  const bad = [await cw({ op: 'open', ch: '21' }), await cw({ op: 'open', ch: '99' }), await cw({ op: 'open', ch: 'xx' }), await cw({ op: 'tick', ch: '07', id: '99.99.99', on: true }),
    await cw({ op: 'tick', ch: '07', id: 'x'.repeat(20000), on: true }), await cw({ op: 'download', file: 'Code.gs' }), await cw({ op: 'download', file: 'pupilStats.txt' }), await cw({ op: 'screen', ch: '07', key: 'y'.repeat(5000) })];
  ok('T6', 'unknown chapter, bad step, oversize payload, unknown file refused with bad-key', bad.every((r) => r.ok === false && r.error === 'bad-key'), bad.map((r) => r.error).join(','));
  ok('T6', 'stored value length unchanged after the refusals', (await raw()).length === len, len + ' → ' + (await raw()).length);
  await post('/__clock', { at: 500020 }); await cw({ op: 'copy', ch: '07' });
  const s = await seen();
  ok('T*', 'each op touches the activity session (Last seen moves)', s && s.seen === 500020, JSON.stringify(s && { seen: s.seen, last: s.last }));
  await post('/__clock', {});
  const out = 'T ' + (fails ? 'FAIL' : 'PASS') + ' — ' + rows.length + ' checks, ' + fails + ' failures\n' + rows.join('\n') + '\n';
  fs.writeFileSync(path.join(__dirname, 'T_REPORT.txt'), out); console.log(out); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
