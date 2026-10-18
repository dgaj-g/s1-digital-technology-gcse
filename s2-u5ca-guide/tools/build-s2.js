#!/usr/bin/env node
/* s2-u5ca-guide/tools/build-s2.js — the S2 Unit 5 coursework guide, built from the A2 platform as as/tools/build-as.js
 * builds the AS one (DESIGN_SPEC 3: a repeat of the AS pattern with four additions). It reads the A2 page files and changes only
 *   1. the two :root token lines in style.css (src/tokens-a2.css: S2 purple and gold) and the print line's name, then adds the
 *      S2 look after it: src/tokens-s2.css, src/style.css (the prototype shell) and src/cw.css,
 *   2. the strings (src/strings-s2.json: A2 keys overridden, new keys added for cw.js) and the content address,
 *   3. the pages: no tile home (the checklist IS the home, SPEC 3.3), the S2 header with "Where am I up to?", chapters 00 to 14,
 *      the record kept in the renderer's s2: keys, the staff tabs (Coursework only) and the "had" cell,
 *   4. the server: op had {ch, v} sets h on the chapter record (SPEC 3.3), its own project and archive names.
 * Writes  s2-u5ca-guide/server/Index.html         PUBLIC (committed)
 *         <S2_PRIVATE>/deploy/Code.gs             the Apps Script server (never committed), plus appsscript.json and BUILD.txt
 *         s2-u5ca-guide/platform/style.css         the stylesheet as served (one file: A2 + S2), so G9 can read it
 *         s2-u5ca-guide/content/index.json         each built chapter's steps and stages, recomputed
 *         s2-u5ca-guide/server/cw-slots.json       append-only: a new tick id goes at the END of its chapter, never in the middle
 * The staff passcode: the built-in hash is of a random secret that is thrown away, so the only passcode is the Script
 * Property "staffPasscode", which Damien sets himself. Class owners and heads of department get in by their email.
 * Run: node s2-u5ca-guide/tools/build-s2.js   (S2_A2=~/Sites/ols-wt-a2/a2-ssd by default) */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const S2 = path.join(__dirname, '..');
const A2 = process.env.S2_A2 || path.join(process.env.HOME, 'Sites/ols-wt-a2/a2-ssd');
const S2_PRIVATE = process.env.S2_PRIVATE || '/Users/damiengartland/Desktop/Claude Work/S2 U5CA Guide/_platform';
const DEPLOY = path.join(S2_PRIVATE, 'deploy');
const OWNER_EMAIL = 'dgartland021@c2ken.net';
const PAGES = 'https://dgaj-g.github.io/s1-digital-technology-gcse/s2-u5ca-guide/';
const CW = process.env.S2_CONTENT || PAGES + 'content/';
const FONTS = process.env.S2_FONTS || PAGES + 'fonts/';
const GH = 'https://dgaj-g.github.io/ols-digital-skills/a2-ssd/platform/vendor/';
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/';
const CLASS = 'S2-26-27';

const need = (p) => { if (!fs.existsSync(p)) { console.error('missing: ' + p); process.exit(1); } return fs.readFileSync(p, 'utf8'); };
function swap(name, text, from, to) {
  const n = text.split(from).length - 1;
  if (n !== 1) { console.error(name + ': expected the A2 text once, found ' + n + ' times: ' + from.slice(0, 70)); process.exit(1); }
  return text.replace(from, () => to);
}
function cut(name, text, from, to) {
  const i = text.indexOf(from), j = text.indexOf(to, i);
  if (i < 0 || j < 0 || text.indexOf(from, i + 1) >= 0) { console.error(name + ': cannot find the block ' + from.slice(0, 60)); process.exit(1); }
  return [text.slice(0, i), text.slice(j)];
}

// ---- ASCII helpers (as A2's build-server.js)
const asciiJs = (s) => s.replace(/[\u0080-￿]/g, (c) => '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4));
const asciiHtml = (s) => s.replace(/[\u0080-\u{10ffff}]/gu, (c) => '&#' + c.codePointAt(0) + ';');
const asciiCss = (s) => s.replace(/[\u0080-￿]/g, (c) => '\\' + c.charCodeAt(0).toString(16) + ' ');
const jsBlock = (s) => asciiJs(s).replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
function guardAscii(name, text) {
  const m = text.match(/[^\x00-\x7f]/);
  if (m) { console.error(name + ': non-ASCII U+' + m[0].charCodeAt(0).toString(16)); process.exit(1); }
}
function guardScriptlets(name, text) {
  const clean = text.replace(/<\?= classCode \?>/g, '').replace(/<\?= baseUrl \?>/g, '');
  const n = (clean.match(/<\?/g) || []).length + (clean.match(/\?>/g) || []).length;
  if (n) { console.error(name + ': ' + n + ' stray <? or ?>'); process.exit(1); }
}

// ---- 1. the stylesheets
let style = need(path.join(A2, 'platform', 'style.css'));
const lines = style.split('\n'), roots = lines.map((l, i) => (l.startsWith(':root{') ? i : -1)).filter((i) => i >= 0);
if (roots.length < 2 || roots[1] !== roots[0] + 1) { console.error('A2 style.css: expected the two :root token lines (is A2 tokenised?)'); process.exit(1); }
const tokens = need(path.join(S2, 'src', 'tokens-a2.css')).trim().split('\n');
if (tokens.length !== 2 || !tokens.every((l) => /^:root\{[^}]*\}$/.test(l))) { console.error('tokens-a2.css: expected two :root lines'); process.exit(1); }
lines.splice(roots[0], 2, tokens[0], tokens[1]);
style = swap('style.css', lines.join('\n'), 'read on the A2 SSD platform', 'read on the GCSE Digital Technology coursework guide');
// the S2 look goes after A2's, so it wins where both style the same thing; the code font is served from Pages
const shell = swap('src/style.css', need(path.join(S2, 'src', 'style.css')), 'url(fonts/', 'url(' + FONTS);
const s2css = need(path.join(S2, 'src', 'tokens-s2.css')) + '\n' + shell + '\n/* ---- cw.css: the coursework guide ---- */\n' + need(path.join(S2, 'src', 'cw.css'));
const css = style + '\n/* ---- the S2 look (DESIGN_SPEC 7) ---- */\n' + s2css;
fs.mkdirSync(path.join(S2, 'platform'), { recursive: true });
fs.writeFileSync(path.join(S2, 'platform', 'style.css'), css);

// ---- 2. strings and content
const strings = JSON.parse(need(path.join(A2, 'platform', 'strings.json')));
const over = JSON.parse(need(path.join(S2, 'src', 'strings-s2.json')));
Object.keys(over).filter((k) => k[0] !== '_').forEach((k) => { strings[k] = over[k]; });
const IXP = path.join(S2, 'content', 'index.json');
const CWIX = JSON.parse(need(IXP));
const CONTENT = { papers: [], twins: {}, sets: {}, lessons: {}, clusters: { clusters: {}, lessonFor: {}, order: [] }, seeds: {}, strings, BUILD: 's2-' + new Date().toISOString().slice(0, 10) };
const contentJs = 'window.A2CONTENT = ' + JSON.stringify(CONTENT) + ';\n';
// each built chapter's tick ids, in the order cw.js's idsOf() walks them: per block, steps, check rows, typed code, a box's blocks
function idsOf(blocks, out) {
  out = out || [];
  (blocks || []).forEach((b) => {
    if (b.steps) b.steps.forEach((s) => out.push(s.id));
    if (b.check) b.check.forEach((r) => out.push(r.id));
    if (b.code && b.code.kind === 'type' && b.code.id) out.push(b.code.id);
    if (b.box && b.box.blocks) idsOf(b.box.blocks, out);
  });
  return out;
}
CWIX.chapters.filter((c) => c.built).forEach((c) => {
  const chj = JSON.parse(need(path.join(S2, 'content', 'ch' + c.id + '.json')));
  const ids = [];
  chj.stages.forEach((st) => st.screens.forEach((sc) => idsOf(sc.blocks, ids)));
  if (new Set(ids).size !== ids.length) { console.error('ch' + c.id + ': a tick id twice'); process.exit(1); }
  c.steps = ids;
  c.stages = chj.stages.map((st, i) => [String(i + 1), st.title, st.screens.length]);
});
fs.writeFileSync(IXP, JSON.stringify(CWIX, null, 1) + '\n');
// A pupil's ticks are a bitmap over server/cw-slots.json, which only ever grows: a retired row keeps its slot (shown as null in
// CWMETA), so no old tick lands on a new row; a new row is added at the END of its chapter, here.
const SLOTP = path.join(S2, 'server', 'cw-slots.json');
const SLOTS = fs.existsSync(SLOTP) ? JSON.parse(need(SLOTP)) : {};
const CWMETA = {};
let added = 0;
CWIX.chapters.forEach((c) => {
  const have = SLOTS[c.id] || (SLOTS[c.id] = []);
  (c.built ? c.steps : []).forEach((id) => { if (!have.includes(id)) { have.push(id); added++; } });
  const live = new Set(c.built ? c.steps : []);
  CWMETA[c.id] = have.map((id) => (live.has(id) ? id : null));
});
CWMETA.files = [];
fs.writeFileSync(SLOTP, JSON.stringify(SLOTS, null, 1) + '\n');

// ---- 3. the page scripts
let app = need(path.join(A2, 'platform', 'app.js'));
// the checklist IS the home (SPEC 3.3): every route that is not a chapter goes to #cw
app = swap('app.js', app, "    else vHome();\n", "    else { history.replaceState(null, '', '#cw'); vCw(); return; }\n");
app = swap('app.js', app, 'for (let i = 0; i <= 12; i++) {', 'for (let i = 0; i <= 14; i++) {');
// the server record is kept in the renderer's own keys (s2:ticks:<ch> {id: true}, s2:done, s2:had, s2:at:<ch>)
app = swap('app.js', app, `  function cwApply(W) {
    Object.keys(W || {}).forEach((ch) => {
      if (!/^\\d\\d$/.test(ch)) return;
      const c = W[ch];
      cwLS.set('cw:ticks:' + ch, c.k || []);
      cwLS.set('cw:done:' + ch, !!c.d);
      if (c.a) cwLS.set('cw:at:' + ch, c.a);
    });
  }`, `  function cwApply(W) {
    const done = {}, had = {};
    Object.keys(W || {}).forEach((ch) => {
      if (!/^\\d\\d$/.test(ch)) return;
      const c = W[ch], k = {};
      (c.k || []).forEach((id) => { k[id] = true; });
      cwLS.set('s2:ticks:' + ch, k);
      if (c.d) done[ch] = true;
      if (c.h) had[ch] = true;
      if (c.a) cwLS.set('s2:at:' + ch, c.a);
    });
    cwLS.set('s2:done', done); cwLS.set('s2:had', had);
  }`);
// the S2 header: the guide's name, "Where am I up to?" (hidden on the checklist by the S2 look) and who is signed in
const [vA, vB] = cut('app.js', app, '  function vCw() {', '  // ---------- SQL map ----------');
app = vA + `  function vCw() {
    const send = (req) => { call('apiCw', req).catch(() => {}); };
    if (!cwHost) {
      cwHost = document.createElement('div'); cwHost.id = 'cw';
      window.CW.mount(cwHost, { base: CWBASE, strings: window.A2CONTENT.strings, api: {
        open: (ch) => send({ op: 'open', ch }), screen: (ch, key) => send({ op: 'screen', ch, key }),
        tick: (ch, id, on) => send({ op: 'tick', ch, id, on: !!on }), done: (ch, on) => send({ op: 'done', ch, on: !!on }),
        had: (ch, on) => send({ op: 'had', ch, v: on ? 1 : 0 })
      } });
    }
    frame(null, '', 'work');
    const bar = app.querySelector('header.bar');
    if (bar) bar.outerHTML = '<header class="bar"><a class="logo" href="#cw" aria-label="' + h(T('cw.crumbHome')) + '">U5</a>' +
      '<div class="title"><a href="#cw" id="appTitle">' + h(T('app.title')) + '</a></div>' +
      '<a class="where" href="#cw" id="whereBtn" aria-label="' + h(T('home.where')) + '"><span class="ic" aria-hidden="true">&#9776;</span><span class="tx"><b>' + h(T('home.where')) + '</b><small>' + h(T('home.whereSub')) + '</small></span></a>' +
      (ME.cls ? '<span class="who">' + h(REC.n || ME.name) + ' · ' + h(ME.cls) + '</span>' : '') + '</header>';
    app.querySelector('main').appendChild(cwHost);
    const hash = location.hash;
    return cwSync().then(() => window.CW.show(hash));
  }

` + vB;
// a new guide: no pupil saw an earlier version, so the one-off message never shows (at 0: no first visit is before it)
app = swap('app.js', app, "const NOTICE = { id: 'guide-2026-10', at: 417240, secs: 30 };", "const NOTICE = { id: 's2-guide', at: 0, secs: 30 };");
// staff: no SQL papers, so no Papers or Live tab; the Coursework tab opens first
let staff = need(path.join(A2, 'platform', 'staff.js'));
staff = swap('staff.js', staff, "['papers', 'staff.tabPapers'], ['live', 'staff.tabLive'], ", '');
staff = swap('staff.js', staff, "TAB = 'live', CLS", "TAB = 'coursework', CLS");
// S2 tick ids are <stage>-<screen>.<step>, as AS's: group the drawer's squares by stage
staff = swap('staff.js', staff, "const s = id.split('.')[1];", "const s = id.split('-')[0];");
staff = swap('staff.js', staff, "TAB = sel('tab') || 'live';", "TAB = sel('tab') || 'coursework'; if (TAB === 'papers' || TAB === 'live') TAB = 'coursework';");
// a chapter the pupil said she had done already shows "had" in grey, no tick (SPEC 3.3)
staff = swap('staff.js', staff, "(w.d ? '✓ ' : '') + h(T('staff.cw.cell', { t, n })) + '</td>';",
  "(w.d ? '✓ ' + h(T('staff.cw.cell', { t, n })) : w.h ? '<span class=\"cwhad\">' + h(T('staff.cw.had')) + '</span>' : h(T('staff.cw.cell', { t, n }))) + '</td>';");
staff = swap('staff.js', staff, "x: 'ev.cwClear', r: 'ev.cwNotice' }", "x: 'ev.cwClear', r: 'ev.cwNotice', h: 'ev.cwHad', g: 'ev.cwUnhad' }");
const scripts = [
  ['content.js', contentJs],
  ['lessonview.js', need(path.join(A2, 'platform', 'lessonview.js'))],
  ['tsql2sqlite.js', need(path.join(A2, 'tools', 'tsql2sqlite.js'))],
  ['editor.js', need(path.join(A2, 'platform', 'editor.js'))],
  ['lesson.js', need(path.join(A2, 'platform', 'lesson.js'))],
  ['cw.js', need(path.join(S2, 'src', 'cw.js'))],
  ['app.js', app],
  ['staff.js', staff],
];

// ---- the server
const APIS = ['apiBoot', 'apiName', 'apiState', 'apiMark', 'apiAnswer', 'apiTwin', 'apiTwinMark', 'apiFlag', 'apiEval', 'apiPing', 'apiKv', 'apiCw', 'apiStaff'];
const shim = `window.OLS_TRANSPORT = {
  call: function (fn, req) {
    return new Promise(function (resolve, reject) {
      if (${JSON.stringify(APIS)}.indexOf(fn) === -1) { reject(new Error('unknown call ' + fn)); return; }
      google.script.run.withSuccessHandler(resolve).withFailureHandler(reject)[fn](req || {});
    });
  }
};`;
const hashOf = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 10);
const index = need(path.join(A2, 'platform', 'index.html'));
let tpl = need(path.join(A2, 'server', 'Code.gs.template'));
tpl = swap('Code.gs.template', tpl, "SpreadsheetApp.create('A2 SSD - Archive')", "SpreadsheetApp.create('GCSE DT Coursework Guide - Archive')");
tpl = tpl.replace(/OLS A2 SSD Platform/g, 'OLS GCSE DT Coursework Guide');
tpl = tpl.replace(/"A2 SSD - Archive"/g, '"GCSE DT Coursework Guide - Archive"');
// op had {ch, v}: v 1 sets h (the pupil had the chapter done before the guide), v 0 takes it back (SPEC 3.3)
tpl = swap('Code.gs.template', tpl, "var CW_OPS = ['open', 'screen', 'tick', 'copy', 'reveal', 'done', 'download', 'notice'];",
  "var CW_OPS = ['open', 'screen', 'tick', 'copy', 'reveal', 'done', 'download', 'notice', 'had'];");
tpl = swap('Code.gs.template', tpl, "a: str_(c.a), d: num_(c.d), c: num_(c.c), r: num_(c.r) };", "a: str_(c.a), d: num_(c.d), c: num_(c.c), r: num_(c.r), h: num_(c.h) ? 1 : 0 };");
tpl = swap('Code.gs.template', tpl, "      else if (op === 'reveal') c.r = num_(c.r) + 1;\n",
  "      else if (op === 'reveal') c.r = num_(c.r) + 1;\n      else if (op === 'had') { var hv = num_(req.v) ? 1 : 0; if ((num_(c.h) ? 1 : 0) !== hv) ev = [now, hv ? 'h' : 'g', ch]; c.h = hv; }\n");
const BUILD = CONTENT.BUILD + '-' + hashOf(css + index + scripts.map((s) => s[1]).join('\n') + tpl + JSON.stringify(CWMETA)).slice(0, 8);
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.createHash('sha256').update(salt + crypto.randomBytes(32).toString('hex'), 'utf8').digest('hex');
const filled = tpl.replace("'@@OWNER_EMAIL@@'", JSON.stringify(OWNER_EMAIL)).replace("'@@STAFF_SALT@@'", JSON.stringify(salt))
  .replace("'@@STAFF_HASH@@'", JSON.stringify(hash)).replace("'@@BUILD@@'", JSON.stringify(BUILD)).replace("'@@TITLE@@'", JSON.stringify(strings['app.title']));
if (/@@[A-Z_]+@@/.test(filled)) { console.error('Code.gs.template: unfilled placeholder ' + filled.match(/@@[A-Z_]+@@/)[0]); process.exit(1); }
const META = { papers: {}, order: [], twinOrder: {}, clusterTwins: {} };
const code = asciiJs(['/* OLS GCSE DT Coursework Guide - Code.gs - build ' + BUILD + ' - built by s2-u5ca-guide/tools/build-s2.js from the A2 template. Never commit. */',
  '/* The S2 guide has no SQL past papers: no answers, no judge. */\nvar A2PRIVATE = { answers: {}, worked: {}, expected: {} };',
  'var A2META = ' + JSON.stringify(META) + ';', 'var CWMETA = ' + JSON.stringify(CWMETA) + ';', filled].join('\n\n'));
guardAscii('Code.gs', code);
fs.mkdirSync(DEPLOY, { recursive: true, mode: 0o700 });
fs.writeFileSync(path.join(DEPLOY, 'Code.gs'), code, { mode: 0o600 });
fs.copyFileSync(path.join(A2, 'server', 'appsscript.json'), path.join(DEPLOY, 'appsscript.json'));

// ---- assemble Index.html (as A2's build-server.js)
const bodyOpen = (index.match(/<body[^>]*>/) || [])[0];
let body = index.slice(index.indexOf(bodyOpen) + bodyOpen.length);
body = body.slice(0, body.lastIndexOf('</body>') > -1 ? body.lastIndexOf('</body>') : body.length).replace(/<script[\s\S]*?<\/script>/gi, '');
const boot = '<script>window.OLS_BOOT = { classCode: "<?= classCode ?>", baseUrl: "<?= baseUrl ?>" };\n' +
  'window.A2_VENDOR = ' + JSON.stringify([CDN, GH]) + ';\nwindow.A2_DEPLOY = ' + JSON.stringify('s2u5-' + BUILD) + ';\nwindow.A2_CW = ' + JSON.stringify(CW) + ';</script>';
const frags = [boot, '<script>\n' + jsBlock(shim) + '\n</script>']
  .concat(scripts.map(([n, s]) => { const b = jsBlock(s); if (/<\/script/i.test(b)) { console.error(n + ': </script left'); process.exit(1); } return '<script>\n' + b + '\n</script>'; }))
  .concat(["<script>window.addEventListener('DOMContentLoaded', function () { App.boot(); });</script>"]);
const out = `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<base target="_top">
<title>${asciiHtml(strings['app.title'])}</title>
<style>
${asciiCss(css)}
</style>
</head>
${bodyOpen}
${frags[0]}
${asciiHtml(body.trim())}
${frags.slice(1).join('\n')}
</body>
</html>
`;
guardScriptlets('Index.html', out);
guardAscii('Index.html', out);
const closes = (out.match(/<\/script>/gi) || []).length;
if (closes !== frags.length) { console.error('Index.html: ' + closes + ' </script> for ' + frags.length + ' blocks'); process.exit(1); }
fs.writeFileSync(path.join(S2, 'server', 'Index.html'), out);
fs.writeFileSync(path.join(DEPLOY, 'BUILD.txt'), BUILD + '\n');
console.log('Code.gs    ' + (code.length / 1024).toFixed(1) + ' KB -> ' + path.join(DEPLOY, 'Code.gs'));
console.log('Index.html ' + (out.length / 1024).toFixed(1) + ' KB, ' + closes + ' script blocks -> s2-u5ca-guide/server/Index.html');
console.log('slots: ' + added + ' added; class ' + CLASS + '; build ' + BUILD);
