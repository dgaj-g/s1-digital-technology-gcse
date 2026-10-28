#!/usr/bin/env node
/* s2-u5ca-guide/tools/dev-server.js — the S2 dev harness, a copy of AS's (itself A2's, D61) pointed at the S2 build. Runs the REAL assembled Code.gs (deploy/Code.gs) in a Node vm with Apps Script
 * shims, and serves the REAL assembled Index.html with google.script.run routed to POST /api/<fn>.
 *   Properties  ScriptProperties shared, UserProperties per dev user; both persisted to a JSON file; the 9 KB value and
 *               500 KB store limits throw as Apps Script does.
 *   Session     the dev user is ?as=<email> on the page (sent as the x-dev-user header); default pupil1@c2ken.net.
 *   userinfo    a name from DEV_NAMES, '' for an address containing "noname".
 *   Lock, Utilities (SHA-256, gzip, base64, formatDate), ScriptApp, SpreadsheetApp (a JSON-file stub).
 * Usage: nohup node s2-u5ca-guide/tools/dev-server.js [port] > dev.log 2>&1 &    ·   S2_STORE=<file> picks the store (default
 * S2 U5CA Guide/_platform/dev-store.json); POST /__reset clears it; POST /__store returns it (gates only). */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const vm = require('vm');
const zlib = require('zlib');
const crypto = require('crypto');

const A2 = path.join(__dirname, '..');
const DESIGN = process.env.S2_PRIVATE || '/Users/damiengartland/Desktop/Claude Work/S2 U5CA Guide/_platform';
const PORT = Number(process.argv[2] || process.env.PORT || 8851);
const STORE = process.env.S2_STORE || path.join(DESIGN, 'dev-store.json');
const CODE = path.join(DESIGN, 'deploy', 'Code.gs');
const INDEX = path.join(A2, 'server', 'Index.html');
const VENDOR = path.join(process.env.S2_A2 || path.join(process.env.HOME, 'Sites/ols-wt-a2/a2-ssd'), 'platform', 'vendor');
const DEV_NAMES = { 'pupil1@c2ken.net': 'Aoife Byrne', 'pupil2@c2ken.net': 'Ciara Doyle', 'pupil3@c2ken.net': 'Niamh Kelly', 'dgartland021@c2ken.net': 'Damien Gartland', 'teacher2@c2ken.net': 'Sean Murphy', 'hod@c2ken.net': 'Mary Quinn' };

let db = { script: {}, user: {}, sheets: {} };
const load = () => { try { db = JSON.parse(fs.readFileSync(STORE, 'utf8')); } catch (e) { db = { script: {}, user: {}, sheets: {} }; } };
const save = () => fs.writeFileSync(STORE, JSON.stringify(db));
load();

let current = 'pupil1@c2ken.net';
const QUOTA = (msg) => { const e = new Error(msg); e.name = 'Exception'; return e; };
function props(get) {
  return {
    getProperty: (k) => (k in get() ? get()[k] : null),
    setProperty: (k, v) => {
      v = String(v);
      if (Buffer.byteLength(k) + Buffer.byteLength(v) > 9216) throw QUOTA('Exception: Argument too large: value');
      const all = get(); const size = Object.entries(all).reduce((n, [a, b]) => n + (a === k ? 0 : Buffer.byteLength(a) + Buffer.byteLength(b)), 0);
      if (size + Buffer.byteLength(k) + Buffer.byteLength(v) > 500 * 1024) throw QUOTA('Exception: You have exceeded the property storage quota.');
      all[k] = v; save(); return this;
    },
    deleteProperty: (k) => { delete get()[k]; save(); },
    getProperties: () => Object.assign({}, get()),
    getKeys: () => Object.keys(get()),
  };
}
const signed = (buf) => Array.from(buf).map((b) => (b > 127 ? b - 256 : b));
const unsigned = (arr) => Buffer.from(arr.map((b) => (b < 0 ? b + 256 : b)));
function blob(data, type) {
  const buf = Buffer.isBuffer(data) ? data : Array.isArray(data) ? unsigned(data) : Buffer.from(String(data), 'utf8');
  return { getBytes: () => signed(buf), getDataAsString: () => buf.toString('utf8'), _buf: buf, getContentType: () => type || null };
}
function fmtDate(d, tz, f) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    .formatToParts(d).map((p) => [p.type, p.value]));
  return f.replace('yyyy', parts.year).replace('MM', parts.month).replace('dd', parts.day).replace('HH', parts.hour === '24' ? '00' : parts.hour).replace('mm', parts.minute).replace('ss', parts.second);
}
const sandbox = {
  console,
  PropertiesService: {
    getScriptProperties: () => props(() => db.script),
    getUserProperties: () => props(() => (db.user[current] = db.user[current] || {})),
  },
  Session: { getActiveUser: () => ({ getEmail: () => current }), getEffectiveUser: () => ({ getEmail: () => current }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, tryLock: () => true, releaseLock() {} }) },
  UrlFetchApp: {
    fetch: (url) => {
      if (/openidconnect\.googleapis\.com\/v1\/userinfo/.test(url)) {
        const name = /noname/.test(current) ? '' : DEV_NAMES[current] || 'Dev Pupil';
        const [g, ...f] = name.split(' ');
        return { getResponseCode: () => 200, getContentText: () => JSON.stringify(name ? { given_name: g, family_name: f.join(' '), name } : {}) };
      }
      const live = /^https:\/\/[a-z0-9-]+\.firebasedatabase\.app(\/[^?]*)(?:\?(.*))?$/.exec(url);
      if (live) { // the live room: the same rules emulation the page reaches at /fb
        const o = arguments[1] || {}, r = fb(String(o.method || 'get').toUpperCase(), '/fb' + live[1], Object.fromEntries(new URLSearchParams(live[2] || '')), o.payload);
        return { getResponseCode: () => r.code, getContentText: () => JSON.stringify(r.val) };
      }
      return { getResponseCode: () => 404, getContentText: () => '' };
    },
  },
  ScriptApp: { getOAuthToken: () => 'dev-token', getService: () => ({ getUrl: () => 'http://localhost:' + PORT + '/' }) },
  Utilities: {
    DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'utf8' },
    computeDigest: (alg, s) => signed(crypto.createHash('sha256').update(String(s), 'utf8').digest()),
    newBlob: blob,
    gzip: (b) => blob(zlib.gzipSync(b._buf), 'application/x-gzip'),
    ungzip: (b) => blob(zlib.gunzipSync(b._buf)),
    base64Encode: (bytes) => (Array.isArray(bytes) ? unsigned(bytes) : Buffer.from(String(bytes), 'utf8')).toString('base64'),
    base64Decode: (s) => signed(Buffer.from(String(s), 'base64')),
    formatDate: fmtDate,
  },
  SpreadsheetApp: {
    create: (name) => { const id = 'sheet-' + Object.keys(db.sheets).length; db.sheets[id] = { name, rows: [] }; save(); return sheetApi(id); },
    openById: (id) => { if (!db.sheets[id]) throw new Error('no sheet'); return sheetApi(id); },
  },
  HtmlService: {},
};
function sheetApi(id) {
  const s = db.sheets[id];
  const sheet = { appendRow: (r) => { s.rows.push(r); save(); }, getLastRow: () => s.rows.length,
    getRange: () => ({ setValues: (rows) => { rows.forEach((r) => s.rows.push(r.map((c) => (c instanceof Date ? c.toISOString() : c)))); save(); } }) };
  return { getId: () => id, getSheets: () => [sheet] };
}
/* ---------- the Unit 4 live room: Firebase REST emulated with the rules (database.rules.u4.json), ported from the prototype relay ---------- */
const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'; let lastPushTime = 0, lastRand = [];
function pushId() { let t = Date.now(); const dup = t === lastPushTime; lastPushTime = t; const ts = new Array(8); for (let i = 7; i >= 0; i--) { ts[i] = PUSH_CHARS.charAt(t % 64); t = Math.floor(t / 64); }
  if (!dup) { lastRand = []; for (let i = 0; i < 12; i++) lastRand[i] = Math.floor(Math.random() * 64); } else { let i = 11; for (; i >= 0 && lastRand[i] === 63; i--) lastRand[i] = 0; if (i >= 0) lastRand[i]++; }
  return ts.join('') + lastRand.map((x) => PUSH_CHARS.charAt(x)).join(''); }
const DENY = { code: 401, val: { error: 'Permission denied' } };
function validEvent(v) { if (!v || typeof v !== 'object' || Array.isArray(v)) return false; const keys = Object.keys(v); if (keys.length !== 4 || !('s' in v && 'k' in v && 'x' in v && 't' in v)) return false;
  return typeof v.s === 'string' && /^[ABC]$/.test(v.s) && typeof v.k === 'string' && /^(msg|pick|lock|done)$/.test(v.k) && typeof v.x === 'string' && v.x.length < 260 && typeof v.t === 'number' && isFinite(v.t); }
function fb(method, pathname, query, body) {
  const rooms = db.fb || (db.fb = {});
  const m = /^\/fb\/u4\/([^/]+)((?:\/[^/]+)*)\.json$/.exec(pathname); if (!m) return /^\/fb\/u4\.json$/.test(pathname) ? DENY : { code: 404, val: { error: 'not found' } };
  const code = m[1], segs = m[2] ? m[2].split('/').filter(Boolean) : []; if (!/^[a-z0-9]{12}$/.test(code)) return DENY;
  const room = rooms[code] || {};
  if (method === 'GET') { let node = room; for (const s of segs) { node = node && typeof node === 'object' ? node[s] : undefined; if (node === undefined) break; }
    if (node && typeof node === 'object' && query.orderBy === '"$key"') { const out = {}; const start = query.startAt ? String(query.startAt).replace(/^"|"$/g, '') : null; Object.keys(node).sort().forEach((k) => { if (start === null || k >= start) out[k] = node[k]; }); node = out; }
    if (node && typeof node === 'object' && !Object.keys(node).length) node = null; return { code: 200, val: node === undefined ? null : node }; }
  if (method === 'DELETE') { if (!segs.length) { delete rooms[code]; save(); return { code: 200, val: null }; } let node = room; for (let i = 0; i < segs.length - 1; i++) { node = node[segs[i]]; if (!node || typeof node !== 'object') return { code: 200, val: null }; } delete node[segs[segs.length - 1]]; save(); return { code: 200, val: null }; }
  let val; try { val = JSON.parse(body || 'null'); } catch (e) { return { code: 400, val: { error: "Invalid data; couldn't parse JSON object, array, or value." } }; }
  rooms[code] = room;
  if (method === 'PUT') { if (segs.length === 2 && segs[0] === 'p') { if (!/^[ABC]$/.test(segs[1]) || typeof val !== 'number' || !(val > Date.now() - 43200000)) return DENY; (room.p || (room.p = {}))[segs[1]] = val; save(); return { code: 200, val }; }
    if (segs.length === 2 && segs[0] === 'ev') { if (!validEvent(val)) return DENY; (room.ev || (room.ev = {}))[segs[1]] = val; save(); return { code: 200, val }; }
    return DENY; }
  if (method === 'POST') { if (segs.length === 1 && segs[0] === 'ev') { if (!validEvent(val)) return DENY; const k = pushId(); (room.ev || (room.ev = {}))[k] = val; save(); return { code: 200, val: { name: k } }; } return DENY; }
  return DENY;
}
vm.createContext(sandbox);
// POST /__clock {at} holds the server clock at minute `at` (tmin) for session tests; {} lets it run again. Date.now only
vm.runInContext('(function (g) { var now = Date.now, at = null; Date.now = function () { return at == null ? now() : 1767225600000 + at * 60000; }; g.__clock = function (m) { at = m; }; })(this);', sandbox);
vm.runInContext(fs.readFileSync(CODE, 'utf8'), sandbox, { filename: 'Code.gs' });

const MIME = { '.js': 'text/javascript', '.wasm': 'application/wasm', '.png': 'image/png', '.css': 'text/css' };
function page(q) {
  const cls = String(q.get('class') || '').replace(/[^A-Za-z0-9-]/g, '').slice(0, 40);
  const as = String(q.get('as') || 'pupil1@c2ken.net');
  const shim = '<script>window.__DEV_USER = ' + JSON.stringify(as) + ';\n' +
    'window.google = { script: { run: (function () {\n' +
    '  function runner(ok, bad) { return new Proxy({}, { get: function (t, k) {\n' +
    "    if (k === 'withSuccessHandler') return function (f) { return runner(f, bad); };\n" +
    "    if (k === 'withFailureHandler') return function (f) { return runner(ok, f); };\n" +
    "    return function (req) { fetch('/api/' + k, { method: 'POST', headers: { 'content-type': 'application/json', 'x-dev-user': window.__DEV_USER }, body: JSON.stringify(req || {}) })\n" +
    "      .then(function (r) { return r.json(); }).then(function (j) { if (j && j.__error) (bad || function () {})(new Error(j.__error)); else (ok || function () {})(j); })\n" +
    "      .catch(function (e) { (bad || function () {})(e); }); };\n" +
    '  } }); }\n  return runner(null, null);\n})() } };</script>';
  let html = fs.readFileSync(INDEX, 'utf8').replace('<?= classCode ?>', cls).replace('<?= baseUrl ?>', 'http://localhost:' + PORT + '/');
  html = html.replace(/window\.U4_LIVE = [^;]*;/, 'window.U4_LIVE = {"base":"/fb"};');
  html = html.replace(/window\.A2_VENDOR = [^;]*;/, "window.A2_VENDOR = ['/vendor/'];");
  html = html.replace(/window\.A2_CW = [^;]*;/, "window.A2_CW = '/cw/';").split('https://dgaj-g.github.io/s1-digital-technology-gcse/s2-u5ca-guide/fonts/').join('/fonts/');
  return html.replace('<script>window.OLS_BOOT', shim + '\n<script>window.OLS_BOOT');
}
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && (u.pathname === '/' || u.pathname === '/exec')) { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(page(u.searchParams)); return; }
  if (req.method === 'GET' && u.pathname.startsWith('/vendor/')) {
    const f = path.join(VENDOR, path.basename(u.pathname));
    if (fs.existsSync(f)) { res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream', 'access-control-allow-origin': '*' }); res.end(fs.readFileSync(f)); return; }
  }
  if (req.method === 'GET' && u.pathname.startsWith('/cw/')) { // the coursework guide's content, as github.io serves it
    const CR = process.env.S2_CONTENT || path.join(A2, 'content');   // gates point S2_CONTENT at a planted copy
    const f = path.join(CR, path.normalize(decodeURIComponent(u.pathname.slice(4))).replace(/^(\.\.[/\\])+/, ''));
    if (f.startsWith(CR) && fs.existsSync(f) && fs.statSync(f).isFile()) { res.writeHead(200, { 'content-type': f.endsWith('.json') ? 'application/json' : MIME[path.extname(f)] || 'application/octet-stream' }); res.end(fs.readFileSync(f)); return; }
    res.writeHead(404); res.end(); return;
  }
  if (req.method === 'GET' && u.pathname.startsWith('/fonts/')) {
    const f = path.join(A2, 'fonts', path.basename(u.pathname));
    if (fs.existsSync(f)) { res.writeHead(200, { 'content-type': 'font/woff2' }); res.end(fs.readFileSync(f)); return; }
  }
  if (u.pathname.startsWith('/fb/')) {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => { const r = fb(req.method, u.pathname, Object.fromEntries(u.searchParams), body); res.writeHead(r.code, { 'content-type': 'application/json' }); res.end(JSON.stringify(r.val)); });
    return;
  }
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      res.writeHead(200, { 'content-type': 'application/json' });
      if (u.pathname === '/__reset') { db = { script: {}, user: {}, sheets: {} }; save(); res.end('{"ok":true}'); return; }
      if (u.pathname === '/__clock') { const at = JSON.parse(body || '{}').at; sandbox.__clock(typeof at === 'number' ? at : null); res.end('{"ok":true}'); return; }
      if (u.pathname === '/__store') { res.end(JSON.stringify(db)); return; }
      if (u.pathname === '/__set') { const j = JSON.parse(body || '{}'); Object.assign(db.script, j.script || {}); Object.entries(j.user || {}).forEach(([k, v]) => { db.user[k] = Object.assign(db.user[k] || {}, v); }); save(); res.end('{"ok":true}'); return; }
      const fn = u.pathname.replace(/^\/api\//, '');
      if (!/^(api[A-Z]\w+|remarkDryRun|remarkApply)$/.test(fn) || typeof sandbox[fn] !== 'function') { res.end(JSON.stringify({ __error: 'unknown ' + fn })); return; }
      current = String(req.headers['x-dev-user'] || 'pupil1@c2ken.net').toLowerCase();
      try {
        const out = sandbox[fn](JSON.parse(body || '{}'));
        res.end(JSON.stringify(out === undefined ? null : out));
      } catch (e) { console.error(fn, e); res.end(JSON.stringify({ __error: String(e && e.message || e) })); }
    });
    return;
  }
  res.writeHead(404); res.end('not found');
}).listen(require.main === module ? PORT : 0, () => require.main === module && console.log('S2 U5CA dev harness on http://localhost:' + PORT + '/?class=<name>&as=<email>  store ' + STORE));

// required as a library (build/gates G8): the Apps Script sandbox and the store, on a throwaway port
if (require.main !== module) module.exports = { sandbox, db: () => db, as: (e) => { current = e; } };
