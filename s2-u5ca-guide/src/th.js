/* th.js — Unit 4 theory side of the S2 coursework guide (client).
   Loaded after cw.js in the live build and mounted by app.js (TH.mount, TH.show, TH.staff); in the prototype index.html calls TH.boot.
   Talks to the server only through window.OLS_TRANSPORT.call(fn, req) with fn in apiTheory | apiPair | apiStaff,
   and to the live room only through window.U4_LIVE.base (Firebase REST, or the prototype relay at /fb).
   Nothing here names a pupil, class or school in the live room: seats are A B C and callsigns are birds. */
(function () {
"use strict";
var BASE = window.U4_BASE || "/";
var S = {}, IDX = [], LEARN = {}, ST = null, ME = { first: "", owner: false }, R = 10;
var active = { stop: function () {} };
var $app, $who, $toast, toastT, CLS = "", STAFF_URL = "#staff", LIVE = false;
var BANNED = ["fuck", "shit", "bitch", "cunt", "wank", "dick", "prick", "twat", "bastard", "slut", "whore", "fag", "retard", "nigg", "spastic"].map(function (w) { return new RegExp("\\b" + w, "i"); });
var QS = {}; location.search.replace(/[?&]([^=&]+)=([^&]*)/g, function (_, k, v) { QS[k] = decodeURIComponent(v); });
var GONE_MS = parseInt(QS.gone, 10) || 90000;   // ?gone=6000 is a test hook for the drives and gates only

/* ---------- small helpers ---------- */
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function arr(v) { return v == null ? [] : Array.isArray(v) ? v : [v]; }
function sing(str) { return str.replace(/\b1 (marks|rounds|times|attempts|words|screens|questions|topics|lines|chat lines|pupils|pairs)\b/g, function (_, w) { return "1 " + w.replace(/s$/, ""); }); }
function fmt(k, v) { var s = S[k]; if (s == null) { console.warn("missing string " + k); return k; } return sing(s.replace(/\{(\w+)\}/g, function (_, n) { return v && v[n] != null ? String(v[n]) : "{" + n + "}"; })); }
function el(tag, props, kids) {
  var m = /^([a-z0-9]+)((?:[.#][\w-]+)*)$/i.exec(tag), node = document.createElement(m ? m[1] : tag);
  if (m && m[2]) m[2].replace(/([.#])([\w-]+)/g, function (_, k, v) { if (k === ".") node.classList.add(v); else node.id = v; });
  props = props || {};
  Object.keys(props).forEach(function (k) {
    var v = props[k]; if (v == null) return;
    if (k === "cls") String(v).split(/\s+/).forEach(function (c) { if (c) node.classList.add(c); });
    else if (k === "html") node.innerHTML = v;
    else if (k === "text") node.textContent = v;
    else if (k === "on") Object.keys(v).forEach(function (e) { node.addEventListener(e, v[e]); });
    else if (k === "attr") Object.keys(v).forEach(function (a) { node.setAttribute(a, v[a]); });
    else if (k === "style") node.style.cssText = v;
    else node[k] = v;
  });
  (kids || []).forEach(function (c) { if (c == null || c === false) return; node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
  return node;
}
function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }
function api(fn, req) { req = Object.assign({ cls: CLS }, req || {}); if (fn === "apiStaff" && req.name == null) req.name = CLS; return window.OLS_TRANSPORT.call(fn, req).then(function (r) { if (!r || r.ok === false) { var e = new Error((r && r.err) || "server said no"); e.res = r; throw e; } return r; }); }
function toast(msg) { if (!$toast) return; $toast.textContent = msg; $toast.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { $toast.classList.remove("on"); }, 2600); }
function go(h) { if (h === "#") h = HOME; if (location.hash === h) route(); else location.hash = h; }
function termHtml(s) { return esc(s).replace(/\[\[([^|\]]+)\|\d+\]\]/g, '<b class="term">$1</b>').replace(/\[\[([^\]]+)\]\]/g, '<b class="term">$1</b>'); }
function setBody(cls) { document.body.className = (LIVE ? "sw-00 th-live " : "") + cls; }
function crumbFrom(str, hrefs) {
  var parts = str.split(" › "), c = el("nav.crumb");
  parts.forEach(function (p, i) { if (i) c.appendChild(el("span.sep", { text: "›" })); if (i < parts.length - 1 && hrefs[i]) c.appendChild(el("a", { href: hrefs[i], text: p })); else c.appendChild(el("span", { text: p })); });
  return c;
}
function hash32(s) { s = String(s); var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function order(n, seed) { var a = []; for (var i = 0; i < n; i++) a.push(i); if (seed == null) return a; var r = rng(hash32(seed)); for (var j = n - 1; j > 0; j--) { var k = Math.floor(r() * (j + 1)); var tmp = a[j]; a[j] = a[k]; a[k] = tmp; } return a; }
function norm(s) { s = String(s == null ? "" : s).toLowerCase().replace(/[‘’´`]/g, "'").replace(/[–—-]/g, " "); s = s.replace(/[^a-z0-9%.\s]/g, " ").replace(/\.(?!\d)/g, " ").replace(/\s+/g, " ").trim(); return s; }
function wordCount(t) { return String(t == null ? "" : t).split(/\s+/).filter(function (w) { return /[a-z0-9]/i.test(w); }).length; }
function pct(m, x) { return x ? Math.round(100 * m / x) : 0; }
function letters(i) { return "ABCDEFGHIJ".charAt(i); }
function joinNames(a) { return a.join(S["list.and"]); }
function bandLevel(bands, hits) { var total = 0, i, j; for (i = 0; i < hits.length; i++) total += hits[i];
  for (var b = 0; b < bands.length; b++) { var band = bands[b], ok = total >= band.total; for (j = 0; j < band.need.length && ok; j++) if ((hits[j] || 0) < band.need[j]) ok = false; if (!ok) continue;
    var hi = false; if (band.hiTotal != null && total >= band.hiTotal) hi = true; if (band.hiNeed) { hi = true; for (j = 0; j < band.hiNeed.length; j++) if ((hits[j] || 0) < band.hiNeed[j]) hi = false; }
    return { level: band.level, lo: band.lo, hi: band.hi, suggest: hi ? band.hi : band.lo, total: total }; }
  return { level: 0, lo: 0, hi: 0, suggest: 0, total: total }; }
function confetti() {
  var wrap = el("div.confetti"); var cols = ["var(--sw)", "var(--accent)", "var(--sw)", "var(--accent)"];
  for (var i = 0; i < 46; i++) { var c = el("span.cf"); c.style.left = (Math.random() * 100) + "%"; c.style.background = cols[i % 4]; c.style.animationDelay = (Math.random() * .25) + "s"; c.style.transform = "rotate(" + Math.random() * 360 + "deg)"; wrap.appendChild(c); }
  document.body.appendChild(wrap); setTimeout(function () { wrap.remove(); }, 1600);
}
function fetchJSON(u) { return fetch(u, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error(u + " " + r.status); return r.json(); }); }
function refresh(t) { return api("apiTheory", t ? { op: "state", t: t } : { op: "state" }).then(function (r) { ST = r; R = r.R || 10; ME.first = r.first; ME.owner = !!r.owner; who(); return r; }); }
function who() { if (!$who) return; clear($who); if (ME.owner) { $who.appendChild(el("a", { href: STAFF_URL, target: "_top", text: fmt("who.staff", { name: ME.first }) })); } else $who.textContent = ME.first; }
function topicName(t) { var i = IDX[t - 1]; return i ? i.title : fmt("topic.fallback", { t: t }); }
function formName(f) { return S["pp.form." + f] || (f === "mcq (tf)" ? S["pp.form.tf"] : f); }

/* ---------- progress ---------- */
function prog(t) {
  t = String(t); var rec = ST.recs[t], meta = ST.meta[t], idx = IDX[t - 1], N = idx ? idx.screens : 0;
  var bits = rec ? parseInt(rec.L || "0", 16) : 0, ln = 0; for (var i = 0; i < N; i++) if (bits >> i & 1) ln++;
  var ps = ST.pairs[t] || null, round = (ST.tc.round && ST.tc.round[t]) || 1;
  var Q = (rec && rec.Q && rec.Q[round]) || {}, qn = 0, qm = 0, qx = 0; Object.keys(Q).forEach(function (q) { qn++; qm += Q[q][0]; qx += Q[q][1]; });
  var NP = meta ? meta.parts.length : 0, total = meta ? meta.total : qx;
  var learnDone = N > 0 && ln >= N, pairDone = !!(ps && ps.state === "done"), ppDone = NP > 0 && qn >= NP;
  return { t: t, N: N, ln: ln, bits: bits, learnDone: learnDone, pair: ps, pairDone: pairDone, pairOn: !!(ST.tc.pair && ST.tc.pair[t]), round: round, qn: qn, qm: qm, qx: qx, NP: NP, total: total, ppDone: ppDone,
    open: !!(ST.tc.open && ST.tc.open[t]) && !!meta, closed: !(ST.tc.open && ST.tc.open[t]) && !!rec, done: learnDone && pairDone && ppDone, meta: meta, rec: rec };
}
function ring(frac, lab) {
  var r = 24, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(1, frac)));
  var w = el("div.ringwrap"); var g = el("div.ring");
  g.innerHTML = '<svg viewBox="0 0 58 58"><circle class="bg" cx="29" cy="29" r="' + r + '"/><circle class="fg" cx="29" cy="29" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + c.toFixed(1) + '"/></svg><div class="lab">' + Math.round(frac * 100) + '%</div>';
  w.appendChild(g); w.appendChild(el("span", { text: lab }));
  requestAnimationFrame(function () { var fg = g.querySelector(".fg"); if (fg) fg.setAttribute("stroke-dashoffset", off.toFixed(1)); });
  return w;
}

/* ---------- router ---------- */
var RX = /^#th(?:\/([1-7])(?:\/(learn|pair|pp)(?:\/([a-z0-9-]+))?)?)?$/;
function route() {
  try { active.stop(); } catch (e) { console.warn(e); }
  active = { stop: function () {} }; window.scrollTo(0, 0); clear($app);
  var h = location.hash || "#";
  if (h === "#" || h === "" || h === "#home") return renderHome();
  if (h === "#staff" && !LIVE) return renderStaff($app);
  var m = RX.exec(h); if (!m) return go(/^#th\b/.test(h) ? "#th" : HOME);
  if (!m[1]) return renderTh();
  var t = m[1];
  if (!m[2]) return renderTopic(t);
  if (m[2] === "learn") return renderLearn(t, parseInt(m[3] || "1", 10) || 1);
  if (m[2] === "pair") return renderPair(t);
  if (m[2] === "pp") return m[3] ? renderPart(t, m[3]) : renderPP(t);
}
function fail(e, where) { console.error(where, e); clear($app).appendChild(el("div.card", {}, [el("h2", { text: S["err.load"] }), el("p", { text: String((e && e.message) || e) }), el("a.btn", { href: HOME, text: S["nav.home"] })])); }

/* ---------- home: the two doors (coursework guide, Unit 4 theory), and the staff door for the owner ---------- */
var HOME = "#";
function renderHome() {
  setBody("is-home");
  refresh().then(function () {
    var n = 0, m = 0; for (var i = 1; i <= 7; i++) { var p = prog(i); if (p.open) n++; if (p.done) m++; }
    var grid = el("div.tiles");
    grid.appendChild(el("div.tile.tw-0", {}, [el("div.kicker", { text: S["home.cw.kicker"] }), el("h2", { text: S["home.cw.title"] }), el("p", { text: S["home.cw.sub"] }),
      el("div.foot", {}, [LIVE ? el("a.btn.sec", { href: "#cw", text: S["home.cw.open"] }) : el("button.btn.sec", { text: S["home.cw.open"], on: { click: function () { toast(S["home.cw.open"]); } } })])]));
    grid.appendChild(el("div.tile.tw-0", {}, [el("div.kicker", { text: S["home.th.kicker"] }), el("h2", { text: S["home.th.title"] }), el("p", { text: S["home.th.sub"] }),
      el("div.foot", {}, [el("a.btn", { href: "#th", text: S["home.th.open"] }), el("span.tally", { text: fmt("home.th.tally", { n: n, m: m }) })])]));
    if (ME.owner) grid.appendChild(el("div.tile.tw-0", {}, [el("div.kicker", { text: S["home.staff.kicker"] }), el("h2", { text: S["home.staff.title"] }), el("p", { text: S["home.staff.sub"] }), el("div.foot", {}, [el("a.btn.gold", { href: STAFF_URL, target: "_top", text: S["home.staff.open"] })])]));
    $app.appendChild(el("h1", { text: S["home.title"] }));
    $app.appendChild(el("p.sub", { text: fmt("home.signedIn", { name: ME.first }) }));
    $app.appendChild(grid);
  }).catch(function (e) { fail(e, "home"); });
}

/* ---------- theory home: seven topic cards ---------- */
function renderTh() {
  setBody("is-th");
  refresh().then(function () {
    var n = 0, m = 0; for (var i = 1; i <= 7; i++) { var p = prog(i); if (p.open) n++; if (p.done) m++; }
    $app.appendChild(crumbFrom(S["nav.home"] + " › " + S["th.crumb.home"], ["#"]));
    $app.appendChild(el("h1", { text: S["th.title"] }));
    $app.appendChild(el("p.sub", { text: S["th.opener"] }));
    $app.appendChild(el("div.row", {}, [el("span.tally", { text: fmt("th.tally", { n: n, m: m }) })]));
    var grid = el("div.tcards");
    IDX.forEach(function (ix) {
      var t = ix.t, p = prog(t), card = el("div.tcard.tw-" + t);
      card.appendChild(el("div.num", { text: String(t) }));
      card.appendChild(el("h3", { text: ix.title }));
      card.appendChild(el("p.every", { text: ix.everyday }));
      card.appendChild(el("div.weight", { text: fmt("th.card.weight", { n: ix.weight }) }));
      if (p.open) {
        var rings = el("div.rings");
        rings.appendChild(ring(p.N ? p.ln / p.N : 0, S["th.rings.learn"]));
        rings.appendChild(ring(p.pairDone ? 1 : (p.pair && p.pair.state === "live" ? ((p.pair.r || 1) - 1) / R : 0), S["th.rings.pair"]));
        rings.appendChild(ring(p.NP ? p.qn / p.NP : 0, S["th.rings.pp"]));
        card.appendChild(rings);
        var st = p.done ? fmt("th.card.done", { t: t, m: p.qm, x: p.total }) : p.qn ? fmt("th.card.marks", { round: p.round, m: p.qm, x: p.total }) : p.pair && p.pair.state === "live" ? fmt("th.card.pair", { r: p.pair.r || 1, R: R }) : p.ln ? fmt("th.card.learn", { n: p.ln, N: p.N }) : S["th.card.notStarted"];
        card.appendChild(el("div.status" + (p.done ? ".done" : ""), { text: st }));
        card.appendChild(el("a.btn", { href: "#th/" + t, text: fmt("th.card.open", { t: t }) }));
      } else {
        card.classList.add("locked");
        card.appendChild(el("div.status", { text: p.closed ? S["th.card.closed"] : S["th.card.locked"] }));
      }
      grid.appendChild(card);
    });
    $app.appendChild(grid);
  }).catch(function (e) { fail(e, "th"); });
}

/* ---------- topic page: three doors ---------- */
function renderTopic(t) {
  setBody("is-th");
  refresh(t).then(function () {
    var p = prog(t), ix = IDX[t - 1];
    if (!p.open) return go("#th");
    $app.appendChild(crumbFrom(S["nav.home"] + " › " + fmt("topic.crumb", { t: t }), ["#", "#th"]));
    $app.appendChild(el("div.topic-head.tw-" + t, {}, [el("div.num", { text: String(t) }), el("div", {}, [el("h1", { text: fmt("topic.title", { t: t, name: ix.title }) }), el("p.sub", { text: ix.everyday })])]));
    var doors = el("div.doors.tw-" + t), startSet = false;
    function door(ic, title, sub, progText, progCls, btnText, href, onClick, extra) {
      var d = el("div.door");
      if (!startSet && !progCls.done && btnText) { d.classList.add("start"); d.appendChild(el("span.tag", { text: S["topic.startHere"] })); startSet = true; }
      d.appendChild(el("div.ic", { text: ic })); d.appendChild(el("h3", { text: title })); d.appendChild(el("p", { text: sub }));
      if (extra) d.appendChild(extra);
      d.appendChild(el("div.prog" + (progCls.done ? ".done" : "") + (progCls.off ? ".off" : ""), { text: progText }));
      if (btnText) d.appendChild(href ? el("a.btn", { href: href, text: btnText }) : el("button.btn", { text: btnText, on: { click: onClick } }));
      return d;
    }
    var firstUnticked = 1; for (var i = 0; i < p.N; i++) if (!(p.bits >> i & 1)) { firstUnticked = i + 1; break; }
    doors.appendChild(door("1", S["door.learn"], S["door.learn.sub"], p.learnDone ? fmt("door.learn.progDone", { N: p.N }) : fmt("door.learn.prog", { n: p.ln, N: p.N }), { done: p.learnDone },
      p.learnDone ? S["door.learn.again"] : p.ln ? S["door.learn.go"] : S["door.learn.start"], "#th/" + t + "/learn/" + (p.learnDone ? 1 : firstUnticked)));
    var ps = p.pair, pairText, pairBtn = null, pairCls = {};
    if (ps && ps.state === "done") { pairText = ps.solo ? fmt("door.pair.doneSolo", { m: ps.right, R: R }) : fmt("door.pair.done", { m: ps.right, R: R, name: ps.names ? joinNames(ps.names) : "" }); pairBtn = S["door.pair.see"]; pairCls.done = true; }
    else if (ps && ps.state === "live") { pairText = fmt("door.pair.live", { round: ps.r || 1, R: R, them: ps.solo ? S["pair.soloStrip"] : joinNames(ps.them || []) }); pairBtn = S["door.pair.back"]; }
    else if (ps && ps.state === "waiting") { pairText = S["pair.wait.head"]; pairBtn = S["door.pair.back"]; }
    else if (!p.pairOn) { pairText = S["door.pair.off"]; pairCls.off = true; }
    else { pairText = S["door.pair.notStarted"]; pairBtn = S["door.pair.start"]; }
    doors.appendChild(door("2", S["door.pair"], S["door.pair.sub"], pairText, pairCls, pairBtn, "#th/" + t + "/pair", null, el("p.small.quiet", { text: p.pairOn || ps ? S["pair.door.act"] : S["pair.door.notNow"] })));
    var ppText = p.qn ? fmt("door.pp.progMarks", { round: p.round, m: p.qm, x: p.total, n: p.qn, N: p.NP }) : fmt("door.pp.prog", { round: p.round, n: 0, N: p.NP });
    doors.appendChild(door("3", S["door.pp"], S["door.pp.sub"], ppText, { done: p.ppDone }, p.ppDone ? S["door.pp.see"] : p.qn ? S["door.pp.go"] : S["door.pp.start"], "#th/" + t + "/pp"));
    $app.appendChild(doors);
    var done = []; if (p.learnDone) done.push(S["topic.where.learnDone"]); else if (p.ln) done.push(fmt("topic.where.learnPart", { n: p.ln, N: p.N })); if (p.pairDone) done.push(S["topic.where.pairDone"]); if (p.ppDone) done.push(S["topic.where.ppDone"]); else if (p.qn) done.push(fmt("topic.where.ppPart", { n: p.qn, N: p.NP }));
    var next = !p.learnDone ? S["topic.where.next.learn"] : (!p.pairDone && (p.pairOn || ps)) ? S["topic.where.next.pair"] : !p.ppDone ? S["topic.where.next.pp"] : !p.pairDone ? S["topic.where.next.pair"] : null;
    $app.appendChild(el("div.where.tw-" + t, {}, [el("span.dot"), el("span", { text: next ? fmt("topic.where", { t: t, done: done.length ? done.join(" ") : S["topic.where.nothing"], next: next }) : fmt("topic.where.done", { t: t }) })]));
    $app.appendChild(el("a.back", { href: "#th", text: "‹ " + S["nav.backTh"] }));
  }).catch(function (e) { fail(e, "topic"); });
}

/* ---------- answer surfaces ----------
   Surface(spec, o) → {el, get, set, disable, verdict, complete, label, kind}
   spec is the surface object from the bank, a round or a learn try. o.seed shuffles the display once (same both seats);
   o.keepOrder keeps paper order. get() serialises in the ORIGINAL order, exactly as judge.js expects. */
function Surface(spec, o) {
  o = o || {}; var kind = spec.kind, root = el("div.sf"), api = { el: root, kind: kind, label: function (x) { return x; }, complete: function () { return !!api.get(); } };
  var seed = o.keepOrder ? null : o.seed, locked = false;
  function lock(b) { locked = !!b; root.classList.toggle("off", locked); }
  api.disable = lock;
  var change = o.onChange || function () {};

  if (kind === "one") {
    var opts = spec.opts.map(function (op, i) { return Array.isArray(op) ? { L: op[0], text: op[1] } : { L: letters(i), text: op }; });
    var disp = order(opts.length, seed), shown = {}, chosen = null, btns = {};
    disp.forEach(function (oi, di) { shown[opts[oi].L] = letters(di); });
    api.label = function (L) { return shown[L] || L; };
    var wrap = el("div.opts"); root.appendChild(wrap);
    disp.forEach(function (oi) {
      var op = opts[oi]; var b = el("button.opt", { type: "button", on: { click: function () { if (locked) return; chosen = op.L; Object.keys(btns).forEach(function (k) { btns[k].classList.toggle("on", k === chosen); }); change(); } } }, [el("span.l", { text: shown[op.L] }), el("span", { text: op.text })]);
      btns[op.L] = b; wrap.appendChild(b);
    });
    api.get = function () { return chosen || ""; };
    api.set = function (v) { chosen = v || null; Object.keys(btns).forEach(function (k) { btns[k].classList.toggle("on", k === chosen); }); };
    api.verdict = function (res, rv) { var ok = res.cells && res.cells[0] === 1; if (chosen && btns[chosen]) btns[chosen].classList.add(ok ? "right" : "wrong"); var ans = rv && rv.ansKey; if (ans && btns[ans]) btns[ans].classList.add("right"); return ok; };
    api.clearMarks = function () { Object.keys(btns).forEach(function (k) { btns[k].classList.remove("right", "wrong"); }); };
  }

  else if (kind === "tf") {
    var rows = spec.rows, vals = spec.vals, dispR = order(rows.length, seed), picks = rows.map(function () { return ""; }), cells = {};
    var tbl = el("table.tft"); var thead = el("thead"); var hr = el("tr"); hr.appendChild(el("th", { text: "" })); vals.forEach(function (v) { hr.appendChild(el("th.c", { text: v })); }); hr.appendChild(el("th.vk", { text: "" })); thead.appendChild(hr); tbl.appendChild(thead);
    var tb = el("tbody"); tbl.appendChild(tb);
    dispR.forEach(function (ri) {
      var tr = el("tr"); tr.appendChild(el("td", { text: rows[ri] })); cells[ri] = { btns: {}, vk: el("td.vk") };
      vals.forEach(function (v) { var b = el("button.tfb" + (v.length > 5 ? ".wide" : ""), { type: "button", text: v, on: { click: function () { if (locked) return; picks[ri] = v; Object.keys(cells[ri].btns).forEach(function (k) { cells[ri].btns[k].classList.toggle("on", k === v); }); change(); } } }); cells[ri].btns[v] = b; var td = el("td.c"); td.appendChild(b); tr.appendChild(td); });
      tr.appendChild(cells[ri].vk); tb.appendChild(tr);
    });
    root.appendChild(tbl);
    api.get = function () { return picks.every(function (p) { return !p; }) ? "" : picks.join(","); };
    api.complete = function () { return picks.every(function (p) { return !!p; }); };
    api.set = function (v) { var a = (v || "").split(","); picks = rows.map(function (_, i) { return a[i] || ""; }); Object.keys(cells).forEach(function (ri) { Object.keys(cells[ri].btns).forEach(function (k) { cells[ri].btns[k].classList.toggle("on", k === picks[ri]); }); }); };
    api.verdict = function (res, rv) { var all = true; rows.forEach(function (_, ri) { var ok = res.cells && res.cells[ri] === 1; if (!ok) all = false; clear(cells[ri].vk).appendChild(el("span.vk" + (ok ? ".ok" : ".no"), { text: ok ? "✓" : "✗" })); var want = rv && rv.ansKey && rv.ansKey[ri]; if (want && cells[ri].btns[want]) cells[ri].btns[want].classList.add("right"); if (!ok && picks[ri] && cells[ri].btns[picks[ri]]) cells[ri].btns[picks[ri]].classList.add("wrong"); }); return all; };
    api.clearMarks = function () { Object.keys(cells).forEach(function (ri) { clear(cells[ri].vk); Object.keys(cells[ri].btns).forEach(function (k) { cells[ri].btns[k].classList.remove("right", "wrong"); }); }); };
  }

  else if (kind === "gaps") {
    var nGaps = (spec.text.match(/\{\d+\}/g) || []).length, filled = [], gapEls = [], chips = [], sel = null;
    for (var gi = 0; gi < nGaps; gi++) filled.push("");
    var txt = el("p.text"); var parts = spec.text.split(/(\{\d+\})/);
    parts.forEach(function (pc) { var mm = /^\{(\d+)\}$/.exec(pc); if (!mm) { txt.appendChild(document.createTextNode(pc)); return; } var idx = parseInt(mm[1], 10) - 1; var g = el("span.gap", { attr: { "data-i": idx, role: "button", tabindex: "0" }, on: { click: function () { gapClick(idx); }, keydown: function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); gapClick(idx); } } } }, [el("span.w", { text: "" }), el("span.fix")]); gapEls[idx] = g; txt.appendChild(g); });
    root.appendChild(txt);
    var bank = el("div.bank"); bank.appendChild(el("div.h", { text: S["part.gaps.bank"] })); var bankOrder = order(spec.bank.length, seed);
    bankOrder.forEach(function (bi) { var w = spec.bank[bi]; var c = el("button.chip", { type: "button", text: w, on: { click: function () { if (locked || c.classList.contains("used")) return; sel = (sel === c) ? null : c; chips.forEach(function (x) { x.classList.toggle("sel", x === sel); }); target(); } } }); chips.push(c); bank.appendChild(c); });
    root.appendChild(bank); root.appendChild(el("p.hint", { text: S["part.gaps.hint"] }));
    function target() { var first = -1; for (var i = 0; i < nGaps; i++) if (!filled[i]) { first = i; break; } gapEls.forEach(function (g, i) { g.classList.toggle("target", !!sel && i === first); }); }
    function paint() { gapEls.forEach(function (g, i) { g.classList.toggle("filled", !!filled[i]); g.querySelector(".w").textContent = filled[i] || ""; }); var used = {}; filled.forEach(function (w) { if (w) used[w] = (used[w] || 0) + 1; }); chips.forEach(function (c) { var w = c.textContent; if (used[w]) { used[w]--; c.classList.add("used"); c.classList.remove("sel"); if (sel === c) sel = null; } else c.classList.remove("used"); }); target(); }
    function gapClick(i) { if (locked) return; if (sel) { filled[i] = sel.textContent; sel = null; } else if (filled[i]) { filled[i] = ""; } paint(); change(); }
    api.get = function () { return filled.every(function (w) { return !w; }) ? "" : filled.join("|"); };
    api.complete = function () { return filled.every(function (w) { return !!w; }); };
    api.set = function (v) { var a = (v || "").split("|"); for (var i = 0; i < nGaps; i++) filled[i] = a[i] || ""; paint(); };
    api.verdict = function (res, rv) { var all = true; gapEls.forEach(function (g, i) { var ok = res.cells && res.cells[i] === 1; if (!ok) all = false; g.classList.add(ok ? "right" : "wrong"); var fx = g.querySelector(".fix"); fx.textContent = (!ok && rv && rv.ansKey && rv.ansKey[i]) ? rv.ansKey[i] : ""; }); return all; };
    api.clearMarks = function () { gapEls.forEach(function (g) { g.classList.remove("right", "wrong"); g.querySelector(".fix").textContent = ""; }); };
  }

  else if (kind === "sort") {
    var items = spec.items, cols = spec.cols, dispI = order(items.length, seed), picksS = items.map(function () { return ""; }), rowsS = {};
    var box = el("div.sort"); var hd = el("div.hd"); hd.appendChild(el("span")); cols.forEach(function (c) { hd.appendChild(el("span", { text: c })); }); hd.appendChild(el("span")); box.appendChild(hd);
    dispI.forEach(function (ii) {
      var r = el("div.srow"); r.appendChild(el("span.it", { text: items[ii] })); var cb = el("div.cols"); rowsS[ii] = { row: r, btns: {}, vk: el("span.vkc") };
      cols.forEach(function (c, ci) { var L = letters(ci); var b = el("button.srtb", { type: "button", text: c, attr: { "aria-label": c }, on: { click: function () { if (locked) return; picksS[ii] = L; Object.keys(rowsS[ii].btns).forEach(function (k) { rowsS[ii].btns[k].classList.toggle("on", k === L); }); change(); } } }); rowsS[ii].btns[L] = b; cb.appendChild(b); });
      r.appendChild(cb); r.appendChild(rowsS[ii].vk); box.appendChild(r);
    });
    root.appendChild(box);
    api.get = function () { return picksS.every(function (p) { return !p; }) ? "" : picksS.join(","); };
    api.complete = function () { return picksS.every(function (p) { return !!p; }); };
    api.set = function (v) { var a = (v || "").split(","); picksS = items.map(function (_, i) { return a[i] || ""; }); Object.keys(rowsS).forEach(function (ii) { Object.keys(rowsS[ii].btns).forEach(function (k) { rowsS[ii].btns[k].classList.toggle("on", k === picksS[ii]); }); }); };
    api.verdict = function (res, rv) { var all = true; items.forEach(function (_, ii) { var ok = res.cells && res.cells[ii] === 1; if (!ok) all = false; rowsS[ii].row.classList.add(ok ? "right" : "wrong"); clear(rowsS[ii].vk).appendChild(el("span.vk" + (ok ? ".ok" : ".no"), { text: ok ? "✓" : "✗" })); var want = rv && rv.ansKey && rv.ansKey[ii]; if (want && rowsS[ii].btns[want]) rowsS[ii].btns[want].classList.add("right"); }); return all; };
    api.clearMarks = function () { Object.keys(rowsS).forEach(function (ii) { rowsS[ii].row.classList.remove("right", "wrong"); clear(rowsS[ii].vk); Object.keys(rowsS[ii].btns).forEach(function (k) { rowsS[ii].btns[k].classList.remove("right"); }); }); };
  }

  else if (kind === "match") {
    var left = spec.left, right = spec.right, dispRt = order(right.length, seed), pairs = {}, selL = null, dotsL = {}, dotsR = {}, itemsL = {}, itemsR = {};
    var mbox = el("div.match"); var colL = el("div.colL"), colR = el("div.colR"), svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    colL.appendChild(el("div.h", { text: o.leftHead || "" })); colR.appendChild(el("div.h", { text: o.rightHead || "" }));
    left.forEach(function (tx, li) { var d = el("button.dot", { type: "button", attr: { "aria-label": fmt("aria.left", { n: li + 1 }) }, on: { click: function () { if (locked) return; selL = (selL === li) ? null : li; Object.keys(dotsL).forEach(function (k) { dotsL[k].classList.toggle("sel", String(selL) === k); }); } } }); dotsL[li] = d; var mi = el("div.mi", {}, [el("span", { text: tx }), d]); itemsL[li] = mi; colL.appendChild(mi); });
    dispRt.forEach(function (ri) { var d = el("button.dot", { type: "button", attr: { "aria-label": fmt("aria.right", { n: ri + 1 }) }, on: { click: function () { if (locked) return; if (selL == null) { var owner = Object.keys(pairs).find(function (l) { return pairs[l] === ri; }); if (owner != null) { delete pairs[owner]; draw(); change(); } return; } pairs[selL] = ri; selL = null; Object.keys(dotsL).forEach(function (k) { dotsL[k].classList.remove("sel"); }); draw(); change(); } } }); dotsR[ri] = d; var mi = el("div.mi", {}, [d, el("span", { text: right[ri] })]); itemsR[ri] = mi; colR.appendChild(mi); });
    mbox.appendChild(colL); mbox.appendChild(svg); mbox.appendChild(colR); root.appendChild(mbox); root.appendChild(el("p.hint", { text: S["part.match.hint"] }));
    var lineCls = {};
    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild); var bb = mbox.getBoundingClientRect(); svg.setAttribute("width", bb.width); svg.setAttribute("height", bb.height); svg.setAttribute("viewBox", "0 0 " + bb.width + " " + bb.height);
      Object.keys(dotsL).forEach(function (l) { dotsL[l].classList.toggle("done", pairs[l] != null); }); Object.keys(dotsR).forEach(function (r) { dotsR[r].classList.toggle("done", Object.keys(pairs).some(function (l) { return pairs[l] === parseInt(r, 10); })); });
      Object.keys(pairs).forEach(function (l) { var r = pairs[l]; var a = dotsL[l].getBoundingClientRect(), b = dotsR[r].getBoundingClientRect(); var ln = document.createElementNS("http://www.w3.org/2000/svg", "line"); ln.setAttribute("x1", a.left + a.width / 2 - bb.left); ln.setAttribute("y1", a.top + a.height / 2 - bb.top); ln.setAttribute("x2", b.left + b.width / 2 - bb.left); ln.setAttribute("y2", b.top + b.height / 2 - bb.top); if (lineCls[l]) ln.setAttribute("class", lineCls[l]); ln.addEventListener("click", function () { if (locked) return; delete pairs[l]; draw(); change(); }); svg.appendChild(ln); });
    }
    api.redraw = draw; window.addEventListener("resize", draw); requestAnimationFrame(draw);
    api.get = function () { var ks = Object.keys(pairs).map(Number).sort(function (a, b) { return a - b; }); return ks.map(function (l) { return l + "-" + pairs[l]; }).join(","); };
    api.complete = function () { return Object.keys(pairs).length === left.length; };
    api.set = function (v) { pairs = {}; (v || "").split(",").forEach(function (p) { var mm = /^(\d+)-(\d+)$/.exec(p); if (mm) pairs[mm[1]] = parseInt(mm[2], 10); }); draw(); };
    api.verdict = function (res, rv) { var all = true; var keyPairs = (rv && rv.ansKey) || null; left.forEach(function (_, li) { var ok = res.cells && res.cells[li] === 1; if (!ok) all = false; itemsL[li].classList.add(ok ? "right" : "wrong"); lineCls[li] = ok ? "right" : "wrong"; }); if (keyPairs) keyPairs.forEach(function (kp) { if (pairs[kp[0]] == null) { pairs[kp[0]] = kp[1]; lineCls[kp[0]] = "right"; } }); draw(); return all; };
    api.clearMarks = function () { lineCls = {}; Object.keys(itemsL).forEach(function (k) { itemsL[k].classList.remove("right", "wrong"); }); draw(); };
  }

  else if (kind === "lines" || kind === "list") {
    var n = spec.n || 2, inputs = [], vks = [], lbox = el("div.lines");
    if (spec.label) lbox.appendChild(el("div.h", { text: spec.label }));
    for (var li2 = 0; li2 < n; li2++) { var inp = el("input", { type: "text", attr: { maxlength: "160", autocomplete: "off", "aria-label": fmt("aria.line", { n: li2 + 1 }) }, on: { input: function () { this.classList.toggle("typed", !!this.value.trim()); change(); } } }); inputs.push(inp); var vk = el("span.vk"); vks.push(vk); lbox.appendChild(el("div.line", {}, [el("span.n", { text: String(li2 + 1) }), inp, vk])); }
    root.appendChild(lbox);
    api.get = function () { var a = inputs.map(function (i) { return i.value.trim(); }); return a.every(function (x) { return !x; }) ? "" : a.join("\n"); };
    api.complete = function () { return inputs.some(function (i) { return i.value.trim(); }); };
    api.set = function (v) { var a = (v || "").split("\n"); inputs.forEach(function (i, k) { i.value = a[k] || ""; i.classList.toggle("typed", !!i.value.trim()); }); };
    api.verdict = function (res) { var all = true; inputs.forEach(function (i, k) { var ok = res.cells && res.cells[k] === 1; if (!ok) all = false; vks[k].className = "vk " + (ok ? "ok" : "no"); vks[k].textContent = i.value.trim() ? (ok ? "✓" : "✗") : ""; }); return all; };
    api.clearMarks = function () { vks.forEach(function (v) { v.className = "vk"; v.textContent = ""; }); };
    api.disable = function (b) { lock(b); inputs.forEach(function (i) { i.disabled = !!b; }); };
  }

  else if (kind === "write" || kind === "long") {
    var ta = el("textarea", { attr: { rows: String(Math.min(18, Math.max(5, Math.round((spec.lines || 6) * 0.8)))), maxlength: "4000", spellcheck: "true" }, on: { input: function () { count(); change(); } } });
    var cnt = el("div.count"), need = el("div.need"), wbox = el("div.write");
    if (kind === "long" && spec.bullets && spec.bullets.length) { var bl = el("ul.bullets"); spec.bullets.forEach(function (b) { bl.appendChild(el("li", { text: b })); }); wbox.appendChild(el("p.small", { text: S["part.write.cover"] })); wbox.appendChild(bl); }
    wbox.appendChild(ta); wbox.appendChild(el("div.row.spread", {}, [cnt, need])); root.appendChild(wbox);
    var floor = o.floor || 0;
    function count() { var w = wordCount(ta.value); cnt.textContent = fmt("part.write.count", { words: w }); need.textContent = (floor && w < floor) ? fmt("part.write.floor", { words: floor }) : ""; }
    count();
    api.get = function () { return ta.value.trim(); };
    api.words = function () { return wordCount(ta.value); };
    api.complete = function () { return wordCount(ta.value) >= floor && ta.value.trim().length > 0; };
    api.set = function (v) { ta.value = v || ""; count(); };
    api.verdict = function () { return false; };
    api.clearMarks = function () {};
    api.disable = function (b) { lock(b); ta.disabled = !!b; };
    api.ta = ta;
  }

  else if (kind === "number") {
    var nb = el("div.number"), work = el("textarea.working", { attr: { rows: "4", maxlength: "1200", spellcheck: "false", "aria-label": S["part.working"] }, on: { input: function () { change(); } } }), bits = [];
    nb.appendChild(el("div.h", { text: S["part.working"] }));
    if (spec.grid) { var pv = el("table.pv"), hr2 = el("tr"), br = el("tr"); [128, 64, 32, 16, 8, 4, 2, 1].forEach(function (v, i) { hr2.appendChild(el("th", { text: String(v) })); var bi = el("input", { type: "text", attr: { maxlength: "1", inputmode: "numeric", autocomplete: "off", "aria-label": fmt("aria.cell", { r: 1, c: i + 1 }) }, on: { input: function () { change(); } } }); bits.push(bi); var td = el("td"); td.appendChild(bi); br.appendChild(td); }); pv.appendChild(hr2); pv.appendChild(br); nb.appendChild(pv); }
    if (spec.working !== false) nb.appendChild(work);
    nb.appendChild(el("p.small.quiet", { text: S["part.workingNote"] }));
    var ans = el("input.ans", { type: "text", attr: { maxlength: "40", autocomplete: "off", spellcheck: "false", "aria-label": S["part.answer"] }, on: { input: function () { ans.classList.toggle("typed", !!ans.value.trim()); change(); } } }), nfix = el("span.fix"), nvk = el("span.vk");
    nb.appendChild(el("div.ansrow", {}, [el("label.h", { text: S["part.answer"] }), ans, nvk, nfix])); root.appendChild(nb);
    function workText() { var g = bits.map(function (b) { return b.value.trim() || "·"; }).join(""); return (bits.length && /[^·]/.test(g) ? g + "\n" : "") + work.value.trim(); }
    api.get = function () { return { a: ans.value.trim(), working: workText() }; };
    api.complete = function () { return !!ans.value.trim(); };
    api.set = function (v) { v = v || {}; ans.value = v.a || ""; work.value = v.working || ""; bits.forEach(function (b) { b.value = ""; }); ans.classList.toggle("typed", !!ans.value.trim()); };
    api.verdict = function (res, rv) { var ok = res.cells && res.cells[0] === 1; ans.classList.add(ok ? "right" : "wrong"); nvk.className = "vk " + (ok ? "ok" : "no"); nvk.textContent = ok ? "✓" : "✗"; nfix.textContent = (!ok && rv && rv.ansKey) ? rv.ansKey : ""; return ok; };
    api.clearMarks = function () { ans.classList.remove("right", "wrong"); nvk.className = "vk"; nvk.textContent = ""; nfix.textContent = ""; };
    api.disable = function (b) { lock(b); ans.disabled = work.disabled = !!b; bits.forEach(function (x) { x.disabled = !!b; }); };
  }

  else if (kind === "trace") {
    var head = spec.head, given = spec.given || [], open = spec.rows === "open", tcells = [], tbody = el("tbody");
    var ttbl = el("table.trace"), thr = el("tr"); head.forEach(function (h) { thr.appendChild(el("th", { text: h })); }); var tth = el("thead"); tth.appendChild(thr); ttbl.appendChild(tth); ttbl.appendChild(tbody);
    function addRow(vals) { var r = tcells.length, g = given[r] || [], row = [], tr = el("tr");
      head.forEach(function (_, c) { var td = el("td"); if (g[c] != null) { td.classList.add("given"); td.textContent = g[c]; row.push(null); }
        else { var inp = el("input", { type: "text", attr: { maxlength: "40", autocomplete: "off", spellcheck: "false", "aria-label": fmt("aria.cell", { r: r + 1, c: c + 1 }) }, on: { input: function () { this.classList.toggle("typed", !!this.value.trim()); change(); } } }); if (vals && vals[c] != null) inp.value = vals[c]; td.appendChild(inp); td.appendChild(el("span.fix")); row.push(inp); }
        tr.appendChild(td); });
      tcells.push(row); tbody.appendChild(tr); }
    var nRows = open ? Math.max(given.length, 1) : spec.rows; for (var tr0 = 0; tr0 < nRows; tr0++) addRow();
    root.appendChild(el("div.tracewrap", {}, [ttbl]));
    var addBtn = null; if (open) { addBtn = el("button.btn.quiet.addrow", { type: "button", text: S["part.trace.addRow"], on: { click: function () { if (locked) return; addRow(); change(); } } }); root.appendChild(addBtn); }
    api.get = function () { var rows = tcells.map(function (row, r) { return row.map(function (inp, c) { return inp ? inp.value.trim() : String((given[r] || [])[c]); }); }); return rows.some(function (row, r) { return tcells[r].some(function (inp) { return inp && inp.value.trim(); }); }) ? rows : ""; };
    api.complete = function () { return tcells.every(function (row) { return row.every(function (inp) { return !inp || !!inp.value.trim(); }); }); };
    api.set = function (v) { while (tbody.firstChild) tbody.removeChild(tbody.firstChild); tcells = []; var rows = Array.isArray(v) ? v : []; var n2 = open ? Math.max(given.length, rows.length, 1) : spec.rows; for (var i = 0; i < n2; i++) addRow(rows[i]); };
    api.verdict = function (res, rv) { var k = 0, all = true, want = (rv && rv.ansKey) || []; tcells.forEach(function (row, r) { row.forEach(function (inp, c) { if (!inp || !want[r] || want[r][c] == null) return; var ok = res.cells && res.cells[k++] === 1; if (!ok) all = false; inp.classList.add(ok ? "right" : "wrong"); inp.parentNode.querySelector(".fix").textContent = ok ? "" : String(want[r][c]); }); }); return all; };
    api.clearMarks = function () { tcells.forEach(function (row) { row.forEach(function (inp) { if (!inp) return; inp.classList.remove("right", "wrong"); inp.parentNode.querySelector(".fix").textContent = ""; }); }); };
    api.disable = function (b) { lock(b); tcells.forEach(function (row) { row.forEach(function (inp) { if (inp) inp.disabled = !!b; }); }); if (addBtn) addBtn.disabled = !!b; };
  }

  else if (kind === "output") {
    var on2 = spec.lines || 1, oins = [], ovks = [], obox = el("div.lines.output");
    for (var oi = 0; oi < on2; oi++) { var oinp = el("input", { type: "text", attr: { maxlength: "80", autocomplete: "off", spellcheck: "false", "aria-label": fmt("aria.line", { n: oi + 1 }) }, on: { input: function () { this.classList.toggle("typed", !!this.value.trim()); change(); } } }); oins.push(oinp); var ovk = el("span.vk"); ovks.push(ovk); obox.appendChild(el("div.line", {}, [el("span.n", { text: String(oi + 1) }), oinp, ovk, el("span.fix")])); }
    root.appendChild(obox);
    api.get = function () { var a = oins.map(function (i) { return i.value.trim(); }); return a.every(function (x) { return !x; }) ? "" : a.join("\n"); };
    api.complete = function () { return oins.every(function (i) { return !!i.value.trim(); }); };
    api.set = function (v) { var a = (v || "").split("\n"); oins.forEach(function (i, k) { i.value = a[k] || ""; i.classList.toggle("typed", !!i.value.trim()); }); };
    api.verdict = function (res, rv) { var all = true; oins.forEach(function (i, k) { var ok = res.cells && res.cells[k] === 1; if (!ok) all = false; ovks[k].className = "vk " + (ok ? "ok" : "no"); ovks[k].textContent = ok ? "✓" : "✗"; i.parentNode.querySelector(".fix").textContent = (!ok && rv && rv.ansKey) ? rv.ansKey[k] : ""; }); return all; };
    api.clearMarks = function () { oins.forEach(function (i, k) { ovks[k].className = "vk"; ovks[k].textContent = ""; i.parentNode.querySelector(".fix").textContent = ""; }); };
    api.disable = function (b) { lock(b); oins.forEach(function (i) { i.disabled = !!b; }); };
  }

  else if (kind === "truth") {
    var thd = spec.head, tin = spec.inputs, nIn = tin[0].length, nOut = thd.length - nIn, tvals = spec.vals || ["0", "1"], tv = tin.map(function () { var a = []; for (var j = 0; j < nOut; j++) a.push(""); return a; }), tbtn = [];
    var xt = el("table.truth"), xhr = el("tr"); thd.forEach(function (h, i) { xhr.appendChild(el("th" + (i >= nIn ? ".out" : ""), { text: h })); }); var xth = el("thead"); xth.appendChild(xhr); xt.appendChild(xth); var xtb = el("tbody"); xt.appendChild(xtb);
    tin.forEach(function (row, r) { var tr = el("tr"); tbtn.push([]); row.forEach(function (v) { tr.appendChild(el("td.in", { text: v })); });
      for (var j = 0; j < nOut; j++) (function (j) { var b = el("button.tcell", { type: "button", text: "", attr: { "aria-label": fmt("aria.cell", { r: r + 1, c: nIn + j + 1 }) }, on: { click: function () { if (locked) return; var ix = tvals.indexOf(tv[r][j]); tv[r][j] = tvals[(ix + 1) % tvals.length]; paintT(); change(); } } }); tbtn[r].push(b); var td = el("td.out"); td.appendChild(b); tr.appendChild(td); })(j);
      xtb.appendChild(tr); });
    root.appendChild(xt); root.appendChild(el("p.hint", { text: S["part.truth.hint"] }));
    function paintT() { tbtn.forEach(function (row, r) { row.forEach(function (b, j) { b.textContent = tv[r][j]; b.classList.toggle("set", !!tv[r][j]); }); }); }
    api.get = function () { return tv.some(function (row) { return row.some(function (x) { return !!x; }); }) ? tv.map(function (row) { return row.slice(); }) : ""; };
    api.complete = function () { return tv.every(function (row) { return row.every(function (x) { return !!x; }); }); };
    api.set = function (v) { var rows = Array.isArray(v) ? v : []; tv = tin.map(function (_, r) { var a = []; for (var j = 0; j < nOut; j++) a.push(String((rows[r] || [])[j] || "")); return a; }); paintT(); };
    api.verdict = function (res) { var k = 0, all = true; tbtn.forEach(function (row) { row.forEach(function (b) { var ok = res.cells && res.cells[k++] === 1; if (!ok) all = false; b.classList.add(ok ? "right" : "wrong"); }); }); return all; };
    api.clearMarks = function () { tbtn.forEach(function (row) { row.forEach(function (b) { b.classList.remove("right", "wrong"); }); }); };
  }

  else if (kind === "code") {
    var cta = el("textarea.codein", { attr: { rows: String(Math.max(6, spec.lines || 10)), maxlength: "4000", spellcheck: "false", autocapitalize: "off", autocomplete: "off", "aria-label": fmt("part.code.lang", { lang: spec.lang || "" }) } });
    var gut = el("div.gutter", { attr: { "aria-hidden": "true" } }), ccnt = el("div.count"), cneed = el("div.need"), cfloor = o.floor || 0;
    function cpaint() { var n3 = Math.max(cta.value.split("\n").length, Number(cta.getAttribute("rows"))); var g = []; for (var i = 1; i <= n3; i++) g.push(i); gut.textContent = g.join("\n"); var lines = cta.value.split("\n").length; if (lines >= Number(cta.getAttribute("rows"))) cta.setAttribute("rows", String(lines + 1)); var w = wordCount(cta.value); ccnt.textContent = fmt("part.write.count", { words: w }); cneed.textContent = (cfloor && w < cfloor) ? fmt("part.write.floor", { words: cfloor }) : ""; }
    cta.addEventListener("keydown", function (ev) { if (ev.key !== "Tab" || ev.shiftKey) return; ev.preventDefault(); var a = cta.selectionStart, b = cta.selectionEnd; cta.value = cta.value.slice(0, a) + "  " + cta.value.slice(b); cta.selectionStart = cta.selectionEnd = a + 2; cpaint(); change(); });
    cta.addEventListener("input", function () { cpaint(); change(); });
    root.appendChild(el("div.h", { text: fmt("part.code.lang", { lang: spec.lang || "" }) }));
    root.appendChild(el("div.codeedit", {}, [gut, cta])); root.appendChild(el("div.row.spread", {}, [ccnt, cneed])); cpaint();
    api.get = function () { return cta.value.replace(/\s+$/, ""); };
    api.words = function () { return wordCount(cta.value); };
    api.complete = function () { return wordCount(cta.value) >= cfloor && cta.value.trim().length > 0; };
    api.set = function (v) { cta.value = v || ""; cpaint(); };
    api.verdict = function () { return false; };
    api.clearMarks = function () {};
    api.disable = function (b) { lock(b); cta.disabled = !!b; };
    api.ta = cta;
  }

  else if (kind === "flow") {
    var fwrap = el("div.flow"), fig = el("div.flowfig", { html: spec.fig || "" }), fin = {}; fwrap.appendChild(fig); root.appendChild(fwrap);
    spec.slots.forEach(function (sl, si) { var inp = el("input.slotin." + (sl.shape || "process"), { type: "text", attr: { maxlength: "60", autocomplete: "off", "aria-label": fmt("aria.slot", { n: si + 1 }) }, on: { input: function () { this.classList.toggle("typed", !!this.value.trim()); change(); } } }); var fx = el("span.fix"); fin[sl.id] = { inp: inp, fix: fx, box: el("div.slot", {}, [inp, fx]) }; fwrap.appendChild(fin[sl.id].box); });
    function place() { var svg = fig.querySelector("svg"); if (!svg) return; var fb = fwrap.getBoundingClientRect(); spec.slots.forEach(function (sl) { var sh = svg.querySelector("#" + sl.id); if (!sh) return; var r = sh.getBoundingClientRect(), bx = fin[sl.id].box, inset = sl.shape === "decision" ? 0.2 : 0.06; bx.style.left = (r.left - fb.left + r.width * inset) + "px"; bx.style.top = (r.top - fb.top + r.height / 2) + "px"; bx.style.width = (r.width * (1 - 2 * inset)) + "px"; }); }
    api.redraw = place; window.addEventListener("resize", place); requestAnimationFrame(place);
    api.get = function () { var o2 = {}, any = false; spec.slots.forEach(function (sl) { var v = fin[sl.id].inp.value.trim(); o2[sl.id] = v; if (v) any = true; }); return any ? o2 : ""; };
    api.complete = function () { return spec.slots.every(function (sl) { return !!fin[sl.id].inp.value.trim(); }); };
    api.set = function (v) { v = v || {}; spec.slots.forEach(function (sl) { var i = fin[sl.id].inp; i.value = v[sl.id] || ""; i.classList.toggle("typed", !!i.value.trim()); }); };
    api.verdict = function (res, rv) { var all = true; spec.slots.forEach(function (sl, k) { var ok = res.cells && res.cells[k] === 1; if (!ok) all = false; fin[sl.id].inp.classList.add(ok ? "right" : "wrong"); fin[sl.id].fix.textContent = (!ok && rv && rv.ansKey) ? rv.ansKey[sl.id] || "" : ""; }); return all; };
    api.clearMarks = function () { spec.slots.forEach(function (sl) { fin[sl.id].inp.classList.remove("right", "wrong"); fin[sl.id].fix.textContent = ""; }); };
    api.disable = function (b) { lock(b); spec.slots.forEach(function (sl) { fin[sl.id].inp.disabled = !!b; }); };
  }

  else { console.error("question type not built: " + kind); root.appendChild(el("p", { text: S["err.notBuilt"] })); api.get = function () { return ""; }; api.set = function () {}; api.verdict = function () { return false; }; api.clearMarks = function () {}; }
  return api;
}

/* what the right answer is, in words, for the strings that need one */
function answerWords(spec, rv, sf) {
  if (!rv) return "";
  if (spec.kind === "one") return sf ? sf.label(rv.ansKey) : rv.ansKey;
  if (spec.kind === "tf" || spec.kind === "sort") return rv.ansKey.join(", ");
  if (spec.kind === "gaps") return rv.ansKey.join(", ");
  if (spec.kind === "match") return rv.ansKey.map(function (p) { return (p[0] + 1) + " with " + spec.right[p[1]].replace(/\s+/g, " "); }).join(". ");
  if (spec.kind === "number") return rv.ansKey;
  if (spec.kind === "output") return rv.ansKey.join(", ");
  if (rv.points) return rv.points.join(". ");
  return "";
}
function contextBlocks(ctx) {
  var box = el("div.ctx"); if (!ctx || !ctx.length) return null;
  ctx.forEach(function (c) {
    if (c.kind === "text") box.appendChild(el("p", { text: c.text }));
    else if (c.kind === "code") { var pre = el("pre"); (c.lines || String(c.text || "").split("\n")).forEach(function (ln, i) { var row = el("span.ln"); if (c.numbered !== false) row.appendChild(el("span.n", { text: String(i + 1) })); row.appendChild(document.createTextNode(ln)); pre.appendChild(row); pre.appendChild(document.createTextNode("\n")); }); var cb = el("div.codebox"); if (c.lang) cb.appendChild(el("div.lang", { text: c.lang })); cb.appendChild(pre); box.appendChild(cb); }
    else if (c.kind === "figure") { var f = el("div.fig", { html: c.svg || "" }); if (c.alt) f.setAttribute("aria-label", c.alt); box.appendChild(f); if (c.cap) box.appendChild(el("div.cap", { text: c.cap })); }
    else if (c.kind === "table") { var t = el("table"); if (c.head) { var tr = el("tr"); c.head.forEach(function (h) { tr.appendChild(el("th", { text: h })); }); t.appendChild(tr); } (c.rows || []).forEach(function (r) { var tr2 = el("tr"); r.forEach(function (cell) { tr2.appendChild(el("td", { text: cell })); }); t.appendChild(tr2); }); box.appendChild(t); }
  });
  return box;
}

/* ---------- learn it ---------- */
function loadLearn(t) { if (LEARN[t]) return Promise.resolve(LEARN[t]); var ix = IDX[t - 1]; if (!ix || !ix.file) return Promise.reject(new Error(fmt("err.noScreens", { t: t }))); return fetchJSON(BASE + "theory/" + ix.file).then(function (j) { LEARN[t] = j; return j; }); }
var CS_KW = /\b(abstract|as|base|bool|break|case|catch|char|class|const|continue|decimal|default|do|double|else|enum|false|finally|float|for|foreach|if|in|int|interface|internal|is|long|namespace|new|null|object|out|override|private|protected|public|readonly|ref|return|sealed|static|string|struct|switch|this|throw|true|try|typeof|using|var|virtual|void|while|get|set)\b/g;
function tokenise(line) {
  var out = "", i = 0, re = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)|(\s+|.)/g, m;
  while ((m = re.exec(line)) !== null) {
    if (m[1]) out += '<span class="c">' + esc(m[1]) + "</span>";
    else if (m[2]) out += '<span class="s">' + esc(m[2]) + "</span>";
    else if (m[3]) out += '<span class="nm">' + esc(m[3]) + "</span>";
    else if (m[4]) { CS_KW.lastIndex = 0; out += CS_KW.test(m[4]) ? '<span class="k">' + esc(m[4]) + "</span>" : '<span class="m">' + esc(m[4]) + "</span>"; }
    else if (m[5]) { CS_KW.lastIndex = 0; out += CS_KW.test(m[5]) ? '<span class="k">' + esc(m[5]) + "</span>" : esc(m[5]); }
    else out += esc(m[6]);
  }
  return out;
}
function codeBlock(code, numbered) {
  var cb = el("div.codebox"); if (code.lang) cb.appendChild(el("div.lang", { text: code.lang === "cs" ? "C#" : code.lang }));
  var pre = el("pre"), rows = [];
  code.lines.forEach(function (ln, i) { var r = el("span.ln"); if (numbered !== false) r.appendChild(el("span.n", { text: String(i + 1) })); var body = el("span", { html: tokenise(ln) || " " }); r.appendChild(body); rows.push(r); pre.appendChild(r); });
  cb.appendChild(pre); cb.rows = rows; return cb;
}
function learnTry(tr, t, n, onRight) {
  var box = el("div.blk.try" + (tr.code ? ".codeopts" : "")); box.appendChild(el("div.head", { text: S["learn.head.try"] }));
  if (tr.verbatim) { var vm = /^(\d{4})\s+Q(\S+)$/.exec(tr.verbatim); box.appendChild(el("p.src", { text: vm ? fmt("learn.try.from", { year: vm[1], label: "Question " + vm[2] }) : tr.verbatim })); }
  box.appendChild(el("p.stem", { text: tr.stem }));
  var sf = Surface(tr.surface, { seed: "try:" + ME.first + ":" + t + ":" + n, leftHead: S["learn.match.left"], rightHead: S["learn.match.right"] }); box.appendChild(sf.el);
  var out = el("div.verdict.hidden"), btn = el("button.btn", { text: S["learn.try.check"], on: { click: check } });
  box.appendChild(el("div.acts", {}, [btn])); box.appendChild(out);
  function check() {
    if (!sf.complete()) { toast(S["try.incomplete"]); return; }
    var k = tr.key, sp = tr.surface, cells = [], rv = {}, right = false, a = "";
    if (sp.kind === "one") { var got = "ABCDEFGH".indexOf(sf.get()); right = got === k.answer; cells = [right ? 1 : 0]; rv.ansKey = letters(k.answer); var optText = Array.isArray(sp.opts[k.answer]) ? sp.opts[k.answer][1] : sp.opts[k.answer]; a = sf.label(rv.ansKey) + " · " + optText; }
    else if (sp.kind === "gaps") { var g = sf.get().split("|"); cells = k.answer.map(function (w, i) { return norm(g[i] || "") === norm(w) ? 1 : 0; }); rv.ansKey = k.answer; a = k.answer.join(", "); right = cells.every(function (c) { return c === 1; }); }
    else if (sp.kind === "tf") { var v = sf.get().split(","); cells = k.answer.map(function (w, i) { return (v[i] || "").toLowerCase() === String(w).toLowerCase() ? 1 : 0; }); rv.ansKey = k.answer; a = k.answer.join(", "); right = cells.every(function (c) { return c === 1; }); }
    else if (sp.kind === "match") { var pr = {}; sf.get().split(",").forEach(function (p) { var mm = /^(\d+)-(\d+)$/.exec(p); if (mm) pr[mm[1]] = parseInt(mm[2], 10); }); cells = k.answer.map(function (r, l) { return pr[l] === r ? 1 : 0; }); rv.ansKey = k.answer.map(function (r, l) { return [l, r]; }); a = k.answer.map(function (r, l) { return sp.left[l] + " is " + sp.right[r]; }).join(". "); right = cells.every(function (c) { return c === 1; }); }
    else if (sp.kind === "list") { var lines = sf.get().split("\n"), used = {}; cells = lines.map(function (ln) { var nl = norm(ln); if (!nl) return 0; if ((k.reject || []).some(function (rj) { return norm(rj) === nl; })) return 0; for (var gi = 0; gi < k.accept.length; gi++) { if (used[gi]) continue; var hit = k.accept[gi].some(function (acc) { var na = norm(acc); return na === nl || (nl.length >= 4 && na.indexOf(nl) !== -1) || (na.length >= 4 && nl.indexOf(na) !== -1); }); if (hit) { used[gi] = 1; return 1; } } return 0; }); var cnt = cells.filter(function (c) { return c === 1; }).length; right = cnt >= (sp.n || k.accept.length); rv.points = k.accept.map(function (gr) { return gr[0]; }); a = rv.points.join(", "); }
    sf.disable(true); sf.verdict({ cells: cells }, rv); btn.disabled = true;
    clear(out).classList.remove("hidden"); out.appendChild(el("p.b" + (right ? ".okline" : ".noline"), { text: right ? S["learn.try.right"] : fmt("learn.try.wrong", { a: a }) }));
    if (tr.why) out.appendChild(el("p.why", { text: fmt("learn.try.why", { why: tr.why }) }));
    out.appendChild(el("p.small", { text: S["learn.try.ticked"] }));
    onRight();
  }
  return box;
}
function renderLearn(t, n) {
  setBody("is-th");
  Promise.all([refresh(t), loadLearn(t)]).then(function (rr) {
    var L = rr[1], p = prog(t); if (!p.open) return go("#th");
    var N = L.screens.length; if (n < 1 || n > N) return go("#th/" + t);
    var scr = L.screens[n - 1], ticked = !!(p.bits >> (n - 1) & 1);
    $app.appendChild(crumbFrom(S["nav.home"] + " › " + fmt("learn.crumb", { t: t, n: n, N: N }), ["#", "#th/" + t, "#th/" + t + "/learn/1"]));
    var sc = el("section.scr.tw-" + t); var pills = el("div.pills");
    for (var i = 1; i <= N; i++) { var on = i === n, ok = !!(p.bits >> (i - 1) & 1); pills.appendChild(el("a.p" + (on ? ".on" : "") + (ok ? ".ok" : ""), { href: "#th/" + t + "/learn/" + i, text: String(i), attr: { "aria-label": fmt(ok ? "aria.screenTicked" : "aria.screen", { n: i }), "aria-current": on ? "page" : null } })); }
    sc.appendChild(pills); sc.appendChild(el("h2", { text: scr.title })); sc.appendChild(el("p.goal", { text: scr.goal }));
    var saidHead = false, tickDone = ticked;
    function tick() { if (tickDone) return Promise.resolve(); tickDone = true; return api("apiTheory", { op: "learn", t: t, n: n }).then(function (r) { if (!ST.recs[t]) ST.recs[t] = {}; ST.recs[t].L = r.L; var pl = pills.children[n - 1]; if (pl) pl.classList.add("ok"); }).catch(function (e) { tickDone = false; console.error(e); toast(S["err.save"]); }); }
    scr.blocks.forEach(function (b) {
      if (b.say) { var sb = el("div.blk.say"); if (!saidHead) { sb.appendChild(el("div.head", { text: S["learn.head.means"] })); saidHead = true; } b.say.forEach(function (ln) { sb.appendChild(el("p", { html: termHtml(ln) })); }); sc.appendChild(sb); }
      else if (b.picture) { var pc = b.picture, pb = el("div.blk.pic"); pb.appendChild(el("div.head", { text: S["learn.head.picture"] })); if (pc.title) pb.appendChild(el("h4", { text: pc.title })); arr(pc.lines).forEach(function (ln) { pb.appendChild(el("p", { html: termHtml(ln) })); });
        if (pc.match && pc.match.length) { var tb = el("table.pmatch"); var hr = el("tr"); hr.appendChild(el("th", { text: S["learn.match.left"] })); hr.appendChild(el("th.arrow", { text: "" })); hr.appendChild(el("th", { text: S["learn.match.right"] })); tb.appendChild(hr); pc.match.forEach(function (pr) { var tr = el("tr"); tr.appendChild(el("td", { text: pr[0] })); tr.appendChild(el("td.arrow", { text: "→" })); tr.appendChild(el("td", { html: termHtml(pr[1]) })); tb.appendChild(tr); }); pb.appendChild(tb); }
        if (arr(pc.breaks).length) { var bk = el("div.breaks"); bk.appendChild(el("div.h", { text: S["learn.head.breaks"] })); arr(pc.breaks).forEach(function (ln) { bk.appendChild(el("p", { html: termHtml(ln) })); }); pb.appendChild(bk); }
        sc.appendChild(pb); }
      else if (b.code) { var cd = b.code, cbk = el("div.blk.codeblk"); if (cd.title) cbk.appendChild(el("div.head", { text: cd.title })); var box = codeBlock(cd); cbk.appendChild(box);
        if (cd.parts && cd.parts.length) { var cp = el("div.cparts"), partEls = []; function showPart(k) { partEls.forEach(function (e, j) { e.classList.toggle("on", j === k); }); var pt = cd.parts[k]; box.rows.forEach(function (r, i) { r.classList.toggle("hl", i + 1 >= pt[0] && i + 1 <= pt[1]); }); }
          cd.parts.forEach(function (pt, k) { var e = el("button.cpart", { type: "button", on: { click: function () { showPart(k); } } }, [el("span.ln-range", {}, [el("b", { text: pt[1] !== pt[0] ? fmt("code.lines", { a: pt[0], b: pt[1] }) : fmt("code.line", { a: pt[0] }) }), el("span", { text: " " + pt[2] })]), el("span.txt", { html: termHtml(pt[3]) })]); partEls.push(e); cp.appendChild(e); });
          cbk.appendChild(cp); showPart(0); }
        if (arr(cd.names).length) { var cn = el("div.cnames"); cn.appendChild(el("div.h", { text: S["code.namesHead"] })); arr(cd.names).forEach(function (nm) { cn.appendChild(el("div.cname", {}, [el("code", { text: nm[0] }), el("span", { html: termHtml(nm[1]) })])); }); cbk.appendChild(cn); }
        sc.appendChild(cbk); }
      else if (b.exam) { var ex = b.exam, eb = el("div.blk.exam"); eb.appendChild(el("div.head", { text: S["learn.head.exam"] })); eb.appendChild(el("div.term", { text: ex.term })); eb.appendChild(el("p.def", { text: ex.say })); if (ex.src) eb.appendChild(el("div.src", { text: fmt("learn.exam.src", { src: ex.src }) })); sc.appendChild(eb); }
      else if (b.watch) { sc.appendChild(el("div.blk.watch", {}, [el("span.ic", { text: "!" }), el("div", {}, [el("div.lab", { text: S["learn.head.watch"] }), el("p", { html: termHtml(b.watch) })])])); }
      else if (b.side) { var sd = b.side, sb2 = el("div.blk.side"); [sd.left, sd.right].forEach(function (col) { if (!col) return; var c = el("div.col"); c.appendChild(el("h4", { text: col.title })); var ul = el("ul"); arr(col.rows).forEach(function (r) { ul.appendChild(el("li", { html: termHtml(r) })); }); c.appendChild(ul); sb2.appendChild(c); }); sc.appendChild(sb2); }
      else if (b.try) { sc.appendChild(learnTry(b.try, t, n, function () { tick().then(paintFoot); })); }
    });
    var foot = el("div.foot"); sc.appendChild(foot);
    function paintFoot() {
      clear(foot); var last = n === N;
      if (!tickDone) foot.appendChild(el("button.btn.big", { text: S["learn.foot.got"], on: { click: function () { tick().then(function () { if (last) finish(); else paintFoot(); }); } } }));
      else if (last) foot.appendChild(el("span.ticked", { text: fmt("learn.foot.last", { t: t }) }));
      else foot.appendChild(el("span.ticked", { text: S["learn.foot.ticked"] }));
      if (!last) foot.appendChild(el("a.btn" + (tickDone ? ".nudge" : ".sec"), { href: "#th/" + t + "/learn/" + (n + 1), text: S["learn.foot.next"] }));
      else if (tickDone) foot.appendChild(el("a.btn.sec", { href: "#th/" + t, text: fmt("nav.backTopic", { t: t }) }));
    }
    function finish() { paintFoot(); confetti(); active.timer = setTimeout(function () { go("#th/" + t); }, 1300); }
    active.stop = function () { clearTimeout(active.timer); };
    paintFoot();
    $app.appendChild(sc);
    $app.appendChild(el("a.back", { href: "#th/" + t, text: "‹ " + fmt("nav.backTopic", { t: t }) }));
  }).catch(function (e) { fail(e, "learn"); });
}

/* ---------- past paper by topic ---------- */
function stageRows(meta) { var byStage = {}; meta.order.forEach(function (o) { byStage[o.stage] = o.qids; }); return meta.stages.map(function (s) { return { id: s.id, title: s.title, qids: byStage[s.id] || [] }; }); }
function partOf(meta, qid) { for (var i = 0; i < meta.parts.length; i++) if (meta.parts[i].qid === qid) return meta.parts[i]; return null; }
function renderPP(t) {
  setBody("is-th");
  refresh(t).then(function () {
    var p = prog(t), meta = p.meta; if (!p.open || !meta) return go("#th");
    var Q = (p.rec && p.rec.Q && p.rec.Q[p.round]) || {}, RT = (p.rec && p.rec.R) || {};
    $app.appendChild(crumbFrom(S["nav.home"] + " › " + fmt("pp.crumb", { t: t }), ["#", "#th/" + t]));
    $app.appendChild(el("h1", { text: fmt("pp.title", { t: t, round: p.round }) })); $app.appendChild(el("p.sub", { text: S["pp.opener"] }));
    var startSet = false;
    stageRows(meta).forEach(function (st, si) {
      var sec = el("section.ppstage.tw-" + t); sec.appendChild(el("h3", {}, [el("span.k", { text: String(si + 1) }), el("span", { text: st.title })]));
      var allDone = st.qids.length > 0;
      st.qids.forEach(function (qid) { var pm = partOf(meta, qid); if (!pm) return; var best = Q[qid]; if (!best) allDone = false; var row = el("div.pprow");
        if (!best && !startSet) { row.classList.add("start"); startSet = true; }
        row.appendChild(el("div.q", { text: fmt("pp.row", { year: pm.year, label: pm.label, x: pm.marks, form: formName(pm.form) }) }));
        row.appendChild(el("small.st" + (best ? ".got" : ""), { text: best ? fmt("pp.row.marks", { m: best[0], x: best[1] }) : S["pp.row.notTried"] }));
        row.appendChild(el("a.btn" + (best ? ".sec" : ""), { href: "#th/" + t + "/pp/" + qid, text: best ? S["pp.row.open"] : S["pp.row.start"] }));
        sec.appendChild(row); });
      if (allDone && !RT[st.id]) { var rate = el("div.rate"); rate.appendChild(el("div.h", { text: S["rate.head"] })); var chips = el("div.chips"); ["knew", "half", "not"].forEach(function (r) { chips.appendChild(el("button.chip", { type: "button", text: S["rate." + r], on: { click: function () { api("apiTheory", { op: "rate", t: t, stage: st.id, rating: r }).then(function () { if (!ST.recs[t].R) ST.recs[t].R = {}; ST.recs[t].R[st.id] = r; rate.remove(); toast(S["rate.thanks"]); }).catch(function (e) { console.error(e); toast(S["err.save"]); }); } } })); }); rate.appendChild(chips); sec.appendChild(rate); }
      $app.appendChild(sec);
    });
    $app.appendChild(el("a.back", { href: "#th/" + t, text: "‹ " + fmt("nav.backTopic", { t: t }) }));
  }).catch(function (e) { fail(e, "pp"); });
}
function renderPart(t, qid) {
  setBody("is-th");
  Promise.all([refresh(t), api("apiTheory", { op: "pp", t: t, qid: qid })]).then(function (rr) {
    var r = rr[1], p = prog(t), meta = p.meta; if (!p.open || !meta) return go("#th");
    var part = r.part, sp = part.surface, best = r.best, attempts = r.attempts || 0;
    var flat = []; stageRows(meta).forEach(function (st) { flat = flat.concat(st.qids); }); var pos = flat.indexOf(qid), nextQ = pos >= 0 && pos < flat.length - 1 ? flat[pos + 1] : null;
    $app.appendChild(crumbFrom(S["nav.home"] + " › " + fmt("pp.crumb", { t: t }) + " › " + part.label, ["#", "#th/" + t, "#th/" + t + "/pp"]));
    var paper = el("article.paper.tw-" + t);
    paper.appendChild(el("div.phead", {}, [el("span.src", { text: fmt("part.head", { year: part.year, label: part.label, x: part.marks }) }), el("span.form", { text: formName(part.form) })]));
    paper.appendChild(el("p.stem", {}, [document.createTextNode(part.stem + " "), el("span.mk", { text: "[" + part.marks + "]" })]));
    var ctx = contextBlocks(part.context); if (ctx) paper.appendChild(ctx);
    var isCode = sp.kind === "code", isWrite = sp.kind === "write" || isCode, isLong = sp.kind === "long", floor = isCode ? part.marks * 2 : isWrite ? part.marks * 4 : isLong ? 60 : 0;
    var draftT = null, draftNote = el("p.small.quiet.hidden", { text: S["part.draftSaved"] });
    var sf = Surface(sp, { keepOrder: true, floor: floor, onChange: function () { gate(); if (isWrite || isLong) { clearTimeout(draftT); draftT = setTimeout(function () { api("apiTheory", { op: "draft", t: t, qid: qid, text: sf.get() }).then(function () { draftNote.classList.remove("hidden"); }).catch(function () {}); }, 800); } } });
    if ((isWrite || isLong) && r.draft) sf.set(r.draft);
    paper.appendChild(sf.el); if (isWrite || isLong) paper.appendChild(draftNote);
    var btnCheck = el("button.btn", { text: S["part.check"], on: { click: check } }), btnClear = el("button.btn.quiet", { text: S["part.clear"], on: { click: reset } });
    paper.appendChild(el("div.acts", {}, [btnCheck, btnClear])); gate();
    var vbox = el("div.vwrap.hidden"); paper.appendChild(vbox);
    var attemptsLine = el("p.attempts" + (attempts ? "" : ".hidden"), { text: fmt("part.attempts", { n: attempts }) }); paper.appendChild(attemptsLine);
    var nav = el("div.acts.navrow", {}, [el("a.btn.sec", { href: "#th/" + t + "/pp", text: S["part.back"] }), nextQ ? el("a.btn.gold", { href: "#th/" + t + "/pp/" + nextQ, text: S["part.next"] }) : el("a.btn.gold", { href: "#th/" + t + "/pp", text: S["part.back"] })]);
    paper.appendChild(nav);
    $app.appendChild(paper);
    function reset() { sf.disable(false); sf.clearMarks(); sf.set(""); clear(vbox).classList.add("hidden"); btnCheck.disabled = false; gate(); }
    // write, code and long: Check stays off under the word floor; the floor line under the box says why (A9, A18)
    function gate() { if (btnCheck && floor && !(vbox && vbox.childNodes.length)) btnCheck.disabled = !sf.complete(); }
    function bump(res) { best = res.best; attempts = res.attempts || attempts; attemptsLine.textContent = fmt("part.attempts", { n: attempts }); attemptsLine.classList.toggle("hidden", !attempts); if (ST.recs[t]) { if (!ST.recs[t].Q) ST.recs[t].Q = {}; if (!ST.recs[t].Q[p.round]) ST.recs[t].Q[p.round] = {}; ST.recs[t].Q[p.round][qid] = best; } }
    function msBox(ms) { var b = el("div.msbox"); b.appendChild(el("div.h", { text: S["part.ms"] })); b.appendChild(el("pre", { text: ms || "" })); return b; }
    function check() {
      if (!sf.complete()) { toast(floor ? fmt("part.write.floor", { words: floor }) : S["part.incomplete"]); return; }
      btnCheck.disabled = true;
      var answer = (isWrite || isLong) ? { text: sf.get() } : sf.get();
      api("apiTheory", { op: "mark", t: t, qid: qid, answer: answer }).then(function (res) {
        bump(res); var J = res.res; clear(vbox).classList.remove("hidden"); sf.disable(true);
        if (isWrite) return writeVerdict(J);
        if (isLong) return longVerdict(J);
        sf.verdict(J, J);
        vbox.appendChild(el("div.verdict" + (J.right ? ".full" : ""), {}, [el("span.score", { text: fmt("part.marks", { m: J.m, x: J.x }) }), el("span.b", { text: J.right ? S["part.full"] : "" })]));
        if (!J.right) { var aw = answerWords(sp, J, sf); if (aw) vbox.appendChild(el("p.ansright", {}, [el("b", { text: fmt("part.right", { a: aw }) })])); }
        if (J.why) vbox.appendChild(el("p.why", { text: fmt("part.why", { why: J.why }) }));
        vbox.appendChild(msBox(J.ms));
      }).catch(function (e) { console.error(e); btnCheck.disabled = false; toast(S["err.server"]); });
    }
    function tickRow(ptText, auto, on, onToggle) { var cb = el("input", { type: "checkbox", checked: !!on, on: { change: function () { onToggle(cb.checked); } } }); var row = el("label.tick" + (auto ? ".auto" : "") + (on ? ".on" : ""), {}, [cb, el("span.lab", {}, [el("b", { text: S["part.tick.me"] }), el("span", { text: " " + ptText })]), auto ? el("span.hintl", { text: S["part.tick.hint"] }) : null]); cb.addEventListener("change", function () { row.classList.toggle("on", cb.checked); }); return row; }
    function writeVerdict(J) {
      var pts = J.points || [], ticks = pts.map(function (_, i) { return J.auto && J.auto[i] ? 1 : 0; });
      vbox.appendChild(el("div.verdict", {}, [el("span.score", { text: fmt("part.marks", { m: J.m, x: J.x }) })]));
      var tk = el("div.ticks"); tk.appendChild(el("div.gh", { text: S["part.tick.head"] })); var total = el("p.b");
      pts.forEach(function (pt, i) { tk.appendChild(tickRow(pt, J.auto && J.auto[i], ticks[i], function (v) { ticks[i] = v ? 1 : 0; paintTotal(); })); });
      function paintTotal() { var m = Math.min(J.x, ticks.reduce(function (a, b) { return a + b; }, 0)); total.textContent = fmt("part.tick.total", { m: m, x: J.x }); }
      paintTotal(); tk.appendChild(total);
      var save = el("button.btn.gold", { text: S["part.saveTicks"], on: { click: function () { save.disabled = true; api("apiTheory", { op: "mark", t: t, qid: qid, answer: { text: sf.get(), ticks: ticks } }).then(function (res) { bump(res); toast(fmt("part.saved", { m: res.res.m, x: res.res.x })); total.textContent = fmt("part.saved", { m: res.res.m, x: res.res.x }); save.disabled = false; }).catch(function (e) { console.error(e); save.disabled = false; toast(S["err.save"]); }); } } });
      tk.appendChild(el("div.acts", {}, [save]));
      if (isCode && J.model) vbox.appendChild(el("div.codecmp", {}, [el("div", {}, [el("div.h", { text: S["part.answer"] }), el("pre.code", { text: sf.get() })]), el("div", {}, [el("div.h", { text: S["part.code.model"] }), el("pre.code.model", { text: J.model })])]));
      vbox.appendChild(tk);
      if (J.why) vbox.appendChild(el("p.why", { text: fmt("part.why", { why: J.why }) }));
      vbox.appendChild(msBox(J.ms));
    }
    function longVerdict(J) {
      var groups = J.bullets || [], ticks = groups.map(function (g, gi) { return g.points.map(function (_, i) { return J.auto && J.auto[gi] && J.auto[gi][i] ? 1 : 0; }); }), pick = null;
      vbox.appendChild(el("div.verdict", {}, [el("span.score", { text: fmt("part.marks", { m: J.m, x: J.x }) })]));
      var tk = el("div.ticks"); tk.appendChild(el("div.gh", { text: S["part.tick.head"] }));
      groups.forEach(function (g, gi) { tk.appendChild(el("h4", { text: g.text })); g.points.forEach(function (pt, i) { tk.appendChild(tickRow(pt, J.auto && J.auto[gi] && J.auto[gi][i], ticks[gi][i], function (v) { ticks[gi][i] = v ? 1 : 0; pick = null; paintBand(); })); }); });
      var bandLine = el("p.b"), bands = el("div.bands"), pickBox = el("div.markpick"), pickLine = el("p.small"); tk.appendChild(bandLine); tk.appendChild(bands); tk.appendChild(pickLine); tk.appendChild(pickBox);
      var descs = J.descriptors || [];
      function paintBand() {
        var hits = ticks.map(function (g) { return g.reduce(function (a, b) { return a + b; }, 0); }); var bl = bandLevel(J.bands || [], hits);
        bandLine.textContent = bl.level ? fmt("part.long.band", { n: bl.level }) : S["part.long.none"];
        clear(bands); descs.forEach(function (d, i) { bands.appendChild(el("div.band" + (i === bl.level ? ".on" : ""), {}, [el("b", { text: fmt("part.long.level", { n: i }) }), el("span", { text: " " + d.replace(/^Level \d+ \([^)]*\)\s*/, "") })])); });
        clear(pickBox); if (bl.level) { pickLine.textContent = fmt("part.long.pick", { n: bl.level }); if (pick == null || pick < bl.lo || pick > bl.hi) pick = bl.suggest; for (var mk = bl.lo; mk <= bl.hi; mk++) (function (mk) { pickBox.appendChild(el("button.mkb" + (mk === pick ? ".on" : ""), { type: "button", text: String(mk), on: { click: function () { pick = mk; paintBand(); } } })); })(mk); } else { pickLine.textContent = ""; pick = 0; }
      }
      paintBand();
      var save = el("button.btn.gold", { text: S["part.saveTicks"], on: { click: function () { save.disabled = true; api("apiTheory", { op: "mark", t: t, qid: qid, answer: { text: sf.get(), ticks: ticks, mark: pick } }).then(function (res) { bump(res); toast(fmt("part.saved", { m: res.res.m, x: res.res.x })); save.disabled = false; }).catch(function (e) { console.error(e); save.disabled = false; toast(S["err.save"]); }); } } });
      tk.appendChild(el("div.acts", {}, [save])); vbox.appendChild(tk);
      if (J.why) vbox.appendChild(el("p.why", { text: fmt("part.why", { why: J.why }) }));
      vbox.appendChild(msBox(J.ms));
    }
  }).catch(function (e) { fail(e, "part"); });
}

/* ---------- work it out with a partner ---------- */
var FB = (window.U4_LIVE && window.U4_LIVE.base) || "/fb";
function fbGet(path) { return fetch(FB + "/u4/" + path, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error("room " + r.status); return r.json(); }); }
function fbSend(method, path, body) { return fetch(FB + "/u4/" + path, { method: method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(function (r) { if (!r.ok) throw new Error("room " + r.status); return r.json(); }); }
function ansLetter(sf, spec, a) { if (spec.kind === "one" && a) return sf.label(a); return null; }
function diffWords(spec, a, b) {
  if (a === b) return "";
  var A, B, out = [];
  if (spec.kind === "gaps") { A = a.split("|"); B = b.split("|"); A.forEach(function (v, i) { if (v !== B[i]) out.push(fmt("pair.diffGap", { n: i + 1 })); }); return out.length ? fmt("pair.diffAt", { where: out.join(" " + S["pair.and"] + " ") }) : ""; }
  if (spec.kind === "tf") { A = a.split(","); B = b.split(","); A.forEach(function (v, i) { if (v !== B[i]) out.push(fmt("pair.diffRow", { n: i + 1 })); }); return out.length ? fmt("pair.diffAt", { where: out.join(" " + S["pair.and"] + " ") }) : ""; }
  if (spec.kind === "sort") { A = a.split(","); B = b.split(","); A.forEach(function (v, i) { if (v !== B[i]) out.push(spec.items[i]); }); return out.length ? fmt("pair.diffSort", { list: out.join(", ") }) : ""; }
  if (spec.kind === "match") { var pa = {}, pb = {}; a.split(",").forEach(function (p) { var m = p.split("-"); pa[m[0]] = m[1]; }); b.split(",").forEach(function (p) { var m = p.split("-"); pb[m[0]] = m[1]; }); Object.keys(pa).forEach(function (l) { if (pa[l] !== pb[l]) out.push(spec.left[l]); }); return out.length ? fmt("pair.diffMatch", { list: out.join(", ") }) : ""; }
  return "";
}
function renderPair(t) {
  setBody("is-pair");
  var timers = [], stopped = false;
  function every(ms, fn) { var id = setInterval(function () { if (!stopped) fn(); }, ms); timers.push(id); return id; }
  function later(ms, fn) { var id = setTimeout(function () { if (!stopped) fn(); }, ms); timers.push(id); return id; }
  active.stop = function () { stopped = true; timers.forEach(function (id) { clearInterval(id); clearTimeout(id); }); };
  refresh(t).then(function () {
    var p = prog(t); if (!p.open) return go("#th");
    return api("apiPair", { op: "join", t: t });
  }).then(function (v) { if (v) paint(v); }).catch(function (e) { fail(e, "pair"); });

  function head(sub) { var h = el("div.pairhead.tw-" + t); h.appendChild(crumbFrom(S["nav.home"] + " › " + topicName(t) + " › " + S["door.pair"], ["#", "#th/" + t])); return h; }
  function offView() { clear($app); $app.appendChild(head()); $app.appendChild(el("div.card.waitcard", {}, [el("h2", { text: S["door.pair"] }), el("p", { text: S["door.pair.off"] }), el("p.small", { text: S["pair.door.notNow"] }), el("div.acts", {}, [el("a.btn.sec", { href: "#th/" + t, text: fmt("nav.backTopic", { t: t }) })])])); }
  function paint(v) {
    if (stopped) return;
    if (v.state === "off") return offView();
    if (v.state === "waiting") return waitView(v);
    if (v.told && v.told.kind === "left") toast(fmt("pair.err.left", { them: v.told.them }));
    if (v.told && v.told.kind === "leftTrio") toast(fmt("pair.err.leftTrio", { them: v.told.them }));
    if (v.told && v.told.kind === "dropped") toast(fmt("pair.err.dropped", { them: v.told.them }));
    if (v.told && v.told.kind === "droppedTrio") toast(fmt("pair.err.droppedTrio", { them: v.told.them }));
    return pairView(v.pair, !!v.fresh, !!v.told);
  }

  /* --- waiting room --- */
  var waitStart = null, polled = false;
  function waitView(v) {
    clear($app); $app.appendChild(head());
    if (!waitStart) waitStart = Date.now();
    var card = el("div.card.waitcard"); card.appendChild(el("div.spin")); var big = el("h2", { text: polled ? (v.last3 ? S["pair.wait.trioHead"] : S["pair.wait.head"]) : S["pair.wait.openingHead"] });
    var say = el("p", { text: polled ? (v.last3 ? S["pair.wait.trioSay"] : S["pair.wait.say"]) : fmt("pair.wait.openingSay", { t: t }) });
    card.appendChild(big); card.appendChild(say);
    var long = el("p.call" + (Date.now() - waitStart > 45000 ? "" : ".hidden"), { text: S["pair.wait.long"] }); card.appendChild(long);
    var acts = el("div.acts");
    acts.appendChild(el("button.btn.sec" + (Date.now() - waitStart > 45000 ? "" : ".hidden"), { text: S["pair.wait.own"], on: { click: function () { active.stop(); api("apiPair", { op: "solo", t: t, reason: "chose" }).then(function (v2) { stopped = false; timers = []; paint(v2); }).catch(function (e) { fail(e, "pair"); }); } } }));
    acts.appendChild(el("button.btn.quiet", { text: S["pair.wait.leave"], on: { click: function () { active.stop(); api("apiPair", { op: "leave", t: t, reason: "left" }).then(function () { go("#th/" + t); }).catch(function () { go("#th/" + t); }); } } }));
    card.appendChild(acts); $app.appendChild(card);
    polled = true;
    if (!timers.length) every(2000, function () { api("apiPair", { op: "join", t: t }).then(function (v2) { if (v2.state === "waiting") { var w = Date.now() - waitStart > 45000; big.textContent = v2.last3 ? S["pair.wait.trioHead"] : S["pair.wait.head"]; say.textContent = v2.last3 ? S["pair.wait.trioSay"] : S["pair.wait.say"]; long.classList.toggle("hidden", !w); acts.firstChild.classList.toggle("hidden", !w); } else { active.stop(); stopped = false; timers = []; paint(v2); } }).catch(function (e) { console.error(e); }); });
  }

  /* --- the rounds --- */
  function pairView(P, fresh, told) {
    clear($app); $app.appendChild(head());
    var pid = P.pid, seat = P.seat, me = P.me, them = P.them, trio = P.trio, solo = P.solo, R = P.R, rounds = P.rounds, A = P.A || {}, room = P.room;
    var live = ["A", "B", "C"].slice(0, P.cn.length).filter(function (s) { return P.gone.indexOf(s) === -1; });
    var others = live.filter(function (s) { return s !== seat; });
    var cnOf = function (s) { return P.cn["ABC".indexOf(s)]; };
    var startedKey = "u4_started_" + pid;
    if (P.done) return finishView(P, { names: P.names || [], m: P.right, R: R, solo: solo, trio: trio });
    if (!sessionStorage.getItem(startedKey) && !(P.r > 1 && !fresh && !told)) {   // a new tab mid-way goes straight back into the rounds; a pupil just told their partner left still gets the card
      var mc = el("div.card.waitcard");
      if (solo) { var w = P.why; mc.appendChild(el("h2", { text: w === "owner" ? S["pair.solo.headOwner"] : w === "chose" ? S["pair.solo.headChose"] : (w === "left" || w === "gone" || w === "room" || w === "dropped") ? S["pair.solo.headLeft"] : S["pair.solo.head"] })); mc.appendChild(el("p", { text: (w === "left" || w === "gone" || w === "room" || w === "dropped") ? S["pair.solo.sayLeft"] : S["pair.solo.say"] })); }
      else { mc.appendChild(el("h2", { text: S["pair.match.head"] })); mc.appendChild(el("p", { text: trio ? fmt("pair.match.trioSay", { me: me, them: others.map(cnOf)[0], them2: others.map(cnOf)[1] }) : fmt("pair.match.say", { me: me, them: others.map(cnOf)[0] }) })); mc.appendChild(el("p.small", { text: S["pair.door.act"] })); }
      mc.appendChild(el("div.acts", {}, [el("button.btn.big", { text: solo ? S["pair.solo.start"] : S["pair.match.start"], on: { click: function () { sessionStorage.setItem(startedKey, "1"); pairView(P, false); } } })]));
      $app.appendChild(mc); return;
    }
    var r = P.r; if (r > R) { return finishView(P, { names: P.names || [], m: P.right, R: R, solo: solo, trio: trio, unsealed: true }); }
    var round = rounds[r - 1], spec = round.surface, seed = pid + ":" + r;
    var wrap = el("div.pairwrap"); $app.appendChild(wrap);
    var rd = el("section.rd.tw-" + t); wrap.appendChild(rd);
    rd.appendChild(el("div.pill", { text: fmt("pair.round.pill", { round: r, R: R }) }));
    var steps = el("div.steps"), stepEls = [1, 2, 3, 4].map(function (i) { var s = el("div.step", { text: S["pair.step" + i] }); steps.appendChild(s); return s; }); rd.appendChild(steps);
    function setStep(n) { stepEls.forEach(function (s, i) { s.classList.toggle("done", i + 1 < n); s.classList.toggle("on", i + 1 === n); }); }
    rd.appendChild(el("p.stem", { text: round.stem }));
    var picks = {}, locks = {}, lastKey = null, myPicked = false, phase = 1, checked = null, changedBy = null;
    var sf = Surface(spec, { seed: seed, keepOrder: !!round.keepOrder, onChange: function () { if (phase >= 2 && !checked) { post("pick", r + ":" + sf.get()); paintCompare(); } } });
    rd.appendChild(sf.el);
    var phaseBox = el("div.phase"); rd.appendChild(phaseBox);
    var cmp = el("div.cmp" + (trio ? ".trio" : "") + ".hidden"); rd.appendChild(cmp);
    var strip = el("div.vstrip.hidden"); rd.appendChild(strip);
    var nextBox = el("div.acts.hidden"); rd.appendChild(nextBox);
    var banner = el("div.banner.bad.hidden"); wrap.insertBefore(banner, rd);
    // chat
    var chat = el("aside.chat" + (solo ? ".off" : "")); wrap.appendChild(chat);
    var ch = el("div.ch"); ch.appendChild(el("h3", { text: S["pair.chat.title"] }));
    ch.appendChild(el("div.cn", { text: solo ? "" : trio ? fmt("pair.cn.trio", { me: me, them: cnOf(others[0]), them2: cnOf(others[1]) }) : fmt("pair.cn.pair", { me: me, them: cnOf(others[0]) }) }));
    chat.appendChild(ch);
    var lines = el("div.lines"); chat.appendChild(lines);
    var quick = el("div.quick"); chat.appendChild(quick);
    var form = el("form"); var inp = el("input", { type: "text", maxlength: 240, placeholder: S["pair.chat.placeholder"], attr: { "aria-label": S["pair.chat.title"] } }); var sendBtn = el("button.btn", { type: "submit", text: S["pair.chat.send"] }); form.appendChild(inp); form.appendChild(sendBtn); chat.appendChild(form);
    var lastSent = 0, chatClosed = false;
    form.addEventListener("submit", function (e) { e.preventDefault(); var txt = inp.value.trim(); if (!txt || chatClosed || solo) return; say(txt); });
    function say(txt) { if (Date.now() - lastSent < 1000) { toast(S["pair.chat.tooFast"]); return; } if (BANNED.some(function (rx) { return rx.test(txt); })) { toast(S["pair.chat.banned"]); return; } lastSent = Date.now(); inp.value = ""; post("msg", txt.slice(0, 240)); }
    function addLine(s, txt, sys) { var m = el("div.msg" + (sys ? ".sys" : s === seat ? ".me" : "")); if (!sys) m.appendChild(el("b", { text: s === seat ? S["pair.chat.you"] : cnOf(s) })); m.appendChild(el("span", { text: txt })); lines.appendChild(m); lines.scrollTop = lines.scrollHeight; }
    function paintQuick() { clear(quick); if (solo || chatClosed) return; var ph = phase === 1 ? "1" : phase === 4 ? "4" : "2"; var cs = (round.chips && round.chips[ph]) || []; if (!cs.length) return; quick.appendChild(el("div.h", { text: S["pair.chat.chips"] })); cs.forEach(function (c) { quick.appendChild(el("button.chip", { type: "button", text: c, on: { click: function () { say(c); } } })); }); }
    function closeChat(msg) { chatClosed = true; chat.classList.add("off"); inp.disabled = true; sendBtn.disabled = true; clear(quick); chat.appendChild(el("p.small", { text: msg })); }
    if (solo) chat.appendChild(el("p.small", { text: S["pair.chat.off"] }));
    // posting
    function post(k, x) { if (solo) return Promise.resolve(); return fbSend("POST", room + "/ev.json", { s: seat, k: k, x: String(x).slice(0, 240), t: Date.now() }).catch(function (e) { console.error(e); }); }
    // phase painting
    function paintPhase() {
      clear(phaseBox); paintQuick();
      if (checked) { setStep(5); return; }
      if (phase === 1) { setStep(1); sf.disable(myPicked);
        if (!myPicked) phaseBox.appendChild(el("div.acts", {}, [el("button.btn", { text: solo ? S["learn.try.check"] : S["pair.lockOwn"], on: { click: lockOwn } })]));
        else { var waitingOn = others.filter(function (s) { return !picks[s]; }).map(cnOf); phaseBox.appendChild(el("p.say.waiting", { text: waitingOn.length > 1 ? fmt("pair.waitingFor2", { them: waitingOn[0], them2: waitingOn[1] }) : fmt("pair.waitingFor", { them: waitingOn[0] || "" }) })); }
        return; }
      if (phase === 2) { setStep(2); sf.disable(false); stepEls[2].classList.add("on"); paintCompare(); var mine = sf.get(), okAll = others.every(function (s) { return picks[s] === mine; });
        var acts = el("div.acts"); var L = ansLetter(sf, spec, mine);
        acts.appendChild(el("button.btn.gold", { text: L ? fmt("pair.lockPair", { letter: L }) : S["pair.lockPairAny"], on: { click: lockPair } }));
        if (!okAll) { others.forEach(function (s) { if (picks[s] && picks[s] !== mine) acts.appendChild(el("button.btn.sec", { text: fmt("pair.useTheirs", { them: cnOf(s) }), on: { click: function () { sf.set(picks[s]); post("pick", r + ":" + picks[s]); paintPhase(); } } })); }); }
        if (myOwn != null && mine !== myOwn) acts.appendChild(el("button.btn.quiet", { text: S["pair.useMine"], on: { click: function () { sf.set(myOwn); post("pick", r + ":" + myOwn); paintPhase(); } } }));
        phaseBox.appendChild(acts); return; }
      if (phase === 4) { setStep(4); sf.disable(true); paintCompare(); var myLock = locks[seat];
        var pending = others.filter(function (s) { return locks[s] !== myLock; });
        if (!pending.length) return; // agreed → check runs
        var otherLocks = others.filter(function (s) { return locks[s] && locks[s] !== myLock; });
        if (otherLocks.length) { var s0 = otherLocks[0], L0 = ansLetter(sf, spec, locks[s0]); phaseBox.appendChild(el("p.say", { text: L0 ? fmt("pair.wants", { them: cnOf(s0), letter: L0 }) : fmt("pair.wantsAny", { them: cnOf(s0) }) }));
          phaseBox.appendChild(el("div.acts", {}, [el("button.btn.gold", { text: L0 ? fmt("pair.agree", { letter: L0 }) : S["pair.agreeAny"], on: { click: function () { sf.set(locks[s0]); locks[seat] = locks[s0]; post("lock", r + ":" + locks[s0]); settle(); } } }), el("button.btn.sec", { text: S["pair.notYet"], on: { click: function () { say(S["pair.notYetSay"]); } } })])); }
        else { var names = pending.map(cnOf); phaseBox.appendChild(el("p.say.waiting", { text: names.length > 1 ? fmt("pair.locked2", { them: names[0], them2: names[1] }) : fmt("pair.locked", { them: names[0] }) }));
          phaseBox.appendChild(el("div.acts", {}, [el("button.btn.quiet", { text: S["pair.unlock"], on: { click: function () { locks[seat] = null; phase = 2; post("lock", r + ":"); paintPhase(); } } })])); }
        return; }
    }
    var myOwn = null, theirSf = {};
    function paintCompare() {
      if (solo || phase < 2) { cmp.classList.add("hidden"); return; }
      cmp.classList.remove("hidden"); clear(cmp); var mine = sf.get();
      var col = el("div.col.me"); col.appendChild(el("div.h", { text: S["pair.cmp.you"] })); col.appendChild(el("p.answ", { text: answerText(mine) })); cmp.appendChild(col);
      others.forEach(function (s) { var c = el("div.col"); c.appendChild(el("div.h", { text: fmt("pair.cmp.them", { them: cnOf(s) }) })); var ts = Surface(spec, { seed: seed, keepOrder: !!round.keepOrder }); if (picks[s]) ts.set(picks[s]); ts.disable(true); c.appendChild(ts.el); var d = diffWords(spec, mine, picks[s] || ""); if (d) c.appendChild(el("p.diffmark", { text: d })); if (changedBy === s) c.appendChild(el("p.diffmark", { text: fmt("pair.changed", { them: cnOf(s) }) })); cmp.appendChild(c); });
      var same = others.every(function (s) { return picks[s] === mine; }), L = ansLetter(sf, spec, mine), txt;
      if (same) txt = trio ? (L ? fmt("pair.same3", { letter: L }) : S["pair.same3Any"]) : (L ? fmt("pair.same", { letter: L }) : S["pair.sameAny"]);
      else if (trio) txt = S["pair.diff3"];
      else { var s1 = others[0], L2 = ansLetter(sf, spec, picks[s1]); txt = L && L2 ? fmt("pair.diff", { letter: L, them: cnOf(s1), letter2: L2 }) : S["pair.diffAny"]; }
      cmp.appendChild(el("p.b.cmpline", { text: txt }));
    }
    function answerText(a) { if (!a) return "—"; if (spec.kind === "one") { var L = sf.label(a); var o = spec.opts.filter(function (op) { return (Array.isArray(op) ? op[0] : null) === a; })[0]; return L + (o ? " · " + o[1] : ""); } return a.replace(/\|/g, " · ").replace(/\n/g, " · "); }
    function lockOwn() { if (!sf.complete()) { toast(S["try.incomplete"]); return; } myPicked = true; myOwn = sf.get(); picks[seat] = myOwn; if (solo) { locks[seat] = myOwn; return settle(); } post("pick", r + ":" + myOwn).then(function () { advance(); paintPhase(); }); paintPhase(); }
    function lockPair() { var a = sf.get(); locks[seat] = a; phase = 4; post("lock", r + ":" + a).then(settle); paintPhase(); }
    function advance() { if (phase === 1 && myPicked && others.every(function (s) { return picks[s]; })) { phase = 2; addLine(null, S["pair.allAnswered"], true); paintPhase(); } }
    var settling = false;
    function settle() { if (checked || settling) return; var myLock = locks[seat]; if (!myLock) return; if (!others.every(function (s) { return locks[s] === myLock; })) { paintPhase(); return; } settling = true;
      api("apiPair", { op: "check", t: t, pid: pid, r: r, ans: myLock }).then(function (res) { checked = res; A[r] = { a: res.a, ok: res.right }; sf.disable(true); sf.verdict(res, res); strip.classList.remove("hidden"); strip.classList.add(res.right ? "ok" : "no"); clear(strip);
        strip.appendChild(el("span.ic", { text: res.right ? "✓" : "✗" })); var L = ansLetter(sf, spec, res.keyShown && spec.kind === "one" ? res.keyShown : null);
        strip.appendChild(el("div", {}, [el("div.b", { text: res.right ? (solo ? S["pair.rightSolo"] : trio ? S["pair.rightTrio"] : S["pair.right"]) : (L ? fmt("pair.wrong", { letter: L }) : S["pair.wrongAny"]) }), res.why ? el("div.why", { text: fmt("pair.why", { why: res.why }) }) : null]));
        if (solo) strip.appendChild(el("div.small", { text: S["pair.soloStrip"] }));
        if (!solo) addLine(null, fmt(res.right ? "pair.chat.lockedRight" : "pair.chat.lockedWrong", { r: r }), true);
        clear(nextBox).classList.remove("hidden");
        if (r < R) nextBox.appendChild(el("button.btn.big", { text: fmt("pair.nextRound", { round: r + 1 }), on: { click: function () { P.r = r + 1; P.A = A; P.right = Object.keys(A).filter(function (k) { return A[k].ok; }).length; stopRound(); pairView(P, false); } } }));
        else nextBox.appendChild(el("button.btn.big.gold", { text: S["pair.finish.go"], on: { click: function () { api("apiPair", { op: "finish", t: t, pid: pid }).then(function (f) { if (!solo) post("done", "10"); stopRound(); finishView(P, f); }).catch(function (e) { fail(e, "pair"); }); } } }));
        paintPhase(); settling = false;
      }).catch(function (e) { settling = false; console.error(e); toast(S["err.server"]); later(3000, settle); });
    }
    function paintCompareIfOn() { if (phase >= 2 && !checked) { paintCompare(); if (phase === 2) paintPhase(); } }
    // events
    function handle(ev) {
      if (!ev || !ev.k) return; var s = ev.s; var m = /^(\d+):([\s\S]*)$/.exec(ev.x || "");
      if (ev.k === "msg") { addLine(s, ev.x, false); return; }
      if (ev.k === "done") { var gs = ev.x === "left" ? s : ((/^gone:([ABC])$/.exec(ev.x) || [])[1] || null); if (gs && gs !== seat && others.indexOf(gs) !== -1) dropSeat(gs, ev.x !== "left"); return; }
      if (!m || parseInt(m[1], 10) !== r) return;
      if (ev.k === "pick") { if (s !== seat) { var was = picks[s]; picks[s] = m[2]; if (phase >= 2 && was && was !== m[2]) changedBy = s; else if (phase >= 2) changedBy = null; } else if (!picks[s]) { picks[s] = m[2]; myPicked = true; myOwn = m[2]; sf.set(m[2]); } advance(); paintCompareIfOn(); if (phase === 4) paintPhase(); return; }
      if (ev.k === "lock") {
        if (!m[2]) { locks[s] = null; if (phase === 4 && !locks[seat]) phase = 2; }          // an unlock (D-UNLOCK): back to compare unless I hold a lock
        else { locks[s] = m[2]; if (s === seat && phase < 4) { phase = 4; sf.set(m[2]); } else if (s !== seat && phase === 2) phase = 4; }   // a partner lock pulls me to Agree
        if (phase >= 2) { paintPhase(); settle(); } return; }
    }
    var roundTimers = [], goneShown = false, roomFails = 0, roomFailAt = null, seen = {}, started = Date.now(), ended = false;
    function stopRound() { ended = true; roundTimers.forEach(function (id) { clearInterval(id); clearTimeout(id); }); roundTimers = []; }
    function rEvery(ms, fn) { var id = setInterval(function () { if (!stopped && !ended) fn(); }, ms); roundTimers.push(id); timers.push(id); }
    function pollEv() { var q = room + "/ev.json?orderBy=%22$key%22" + (lastKey ? "&startAt=%22" + lastKey + "%22" : ""); fbGet(q).then(function (o) { roomFails = 0; roomFailAt = null; banner.classList.toggle("hidden", !goneShown); if (!o) return; Object.keys(o).sort().forEach(function (k) { if (k === lastKey) return; lastKey = k; handle(o[k]); }); }).catch(function () { roomFails++; if (!roomFailAt) roomFailAt = Date.now(); if (Date.now() - roomFailAt > 10000) roomTrouble(); }); }
    function roomTrouble() { clear(banner).classList.remove("hidden"); banner.appendChild(el("span", { text: S["pair.err.room"] })); banner.appendChild(el("button.btn.sec", { text: S["pair.err.roomBtn"], on: { click: function () { leaveTo("room"); } } })); }
    // A seat that has gone or left (D-DROP): a pair becomes solo for the one who stays, a trio carries on as a pair.
    function dropSeat(gs, dropped) { others = others.filter(function (o) { return o !== gs; }); goneShown = false; banner.classList.add("hidden");
      if (!others.length) { toast(fmt("pair.err.left", { them: cnOf(gs) })); leaveTo("gone"); return; }
      toast(fmt(dropped ? "pair.err.droppedTrio" : "pair.err.leftTrio", { them: cnOf(gs) })); trio = false; cmp.classList.remove("trio"); advance(); paintPhase(); settle(); }
    function onGone(s, silent) { if (goneShown || checked && r === R) return; if (silent) { dropSeat(s, true); return; } goneShown = true; clear(banner).classList.remove("hidden"); var three = others.length >= 2;
      banner.appendChild(el("span", { text: fmt(three ? "pair.err.gone3" : "pair.err.gone", { them: cnOf(s) }) }));
      banner.appendChild(el("button.btn.sec", { text: three ? fmt("pair.err.gone3Btn", { them: cnOf(s) }) : S["pair.err.goneBtn"], on: { click: function () { if (!three) { leaveTo("gone"); return; } api("apiPair", { op: "drop", t: t, pid: pid, seat: s }).then(function () { post("done", "gone:" + s); dropSeat(s, true); }).catch(function (e) { fail(e, "pair"); }); } } })); }
    function leaveTo(reason) { if (!solo) post("done", "left"); stopRound(); active.stop(); api("apiPair", { op: "leave", t: t, pid: pid, reason: reason }).then(function (v2) { stopped = false; timers = []; sessionStorage.setItem("u4_started_" + v2.pair.pid, "1"); paint(v2); toast(S["pair.err.carryOn"]); }).catch(function (e) { fail(e, "pair"); }); }
    if (!solo) {
      rEvery(4000, function () { fbSend("PUT", room + "/p/" + seat + ".json", Date.now()).catch(function () {}); });
      rEvery(4000, function () { fbGet(room + "/p.json").then(function (pp) { pp = pp || {}; others.forEach(function (s) { if (pp[s]) seen[s] = pp[s]; var last = seen[s] || started; if (Date.now() - last > GONE_MS) onGone(s, false); }); }).catch(function () {}); });
      rEvery(1000, pollEv);
      rEvery(8000, function () { api("apiPair", { op: "status", t: t, pid: pid }).then(function (st) { if (st.dissolved) { stopRound(); active.stop(); api("apiPair", { op: "join", t: t }).then(function (v2) { stopped = false; timers = []; sessionStorage.setItem("u4_started_" + (v2.pair ? v2.pair.pid : pid), "1"); paint(v2); }); return; } (st.gone || []).forEach(function (gs) { if (gs !== seat && others.indexOf(gs) !== -1) dropSeat(gs, (st.goneWhy || {})[gs] === "dropped"); }); if (st.pairOn === false && !offToasted) { offToasted = true; toast(S["pair.err.off"]); } }).catch(function () {}); });
      fbSend("PUT", room + "/p/" + seat + ".json", Date.now()).catch(function () {});
      // rebuild from the whole log once, then stream
      fbGet(room + "/ev.json").then(function (o) { var keys = Object.keys(o || {}).sort(); keys.forEach(function (k) { lastKey = k; handle(o[k]); }); if (!fresh && !sessionStorage.getItem("u4_seen_" + pid) && (r > 1 || keys.length)) toast(fmt("pair.resume", { round: r, R: R })); sessionStorage.setItem("u4_seen_" + pid, "1"); paintPhase(); }).catch(function () { roomFailAt = Date.now() - 10001; roomTrouble(); paintPhase(); });
    } else paintPhase();
    setStep(1);
  }
  var offToasted = false;
  function finishView(P, f) {
    clear($app); $app.appendChild(head());
    var card = el("div.card.finish.tw-" + t); card.appendChild(el("h2", { text: S["pair.finish.head"] })); card.appendChild(el("div.score", { text: fmt("pair.finish.score", { m: f.m, R: f.R }) }));
    var names = f.names || [], txt = f.solo ? fmt("pair.finish.saySolo", { m: f.m, R: f.R }) : f.trio ? fmt("pair.finish.sayTrio", { m: f.m, R: f.R, name: names[0] || "?", name2: names[1] || "?" }) : fmt("pair.finish.say", { m: f.m, R: f.R, name: names[0] || "?" });
    card.appendChild(el("p", { text: txt })); if (names.length) card.appendChild(el("div.names", { text: names.join(" · ") }));
    if (!f.solo) card.appendChild(el("p.small", { text: S["pair.chat.closed"] }));
    card.appendChild(el("div.acts", {}, [el("a.btn.big", { href: "#th/" + t, text: fmt("pair.finish.back", { t: t }) })]));
    $app.appendChild(card);
    if (ST.recs && ST.recs[t]) { ST.pairs = ST.pairs || {}; ST.pairs[t] = { pid: P.pid, state: "done", right: f.m, R: f.R, trio: f.trio, solo: f.solo, names: names }; }
  }
}

/* ---------- staff view ---------- */
function download(name, text) { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
function renderStaff($app) {
  if (!LIVE) setBody("is-staff");
  var t = parseInt(sessionStorage.getItem("u4_staff_t") || "1", 10) || 1, timer = null, armed = null;
  active.stop = function () { clearInterval(timer); clearTimeout(armed); };
  (LIVE ? Promise.resolve() : refresh(t)).then(function () {
    if (!LIVE && !ME.owner) return go("#");
    if (!LIVE) { $app.appendChild(crumbFrom(S["nav.home"] + " › " + S["staff.th.tab"], ["#"])); $app.appendChild(el("h1", { text: S["staff.th.tab"] + " · " + S["th.crumb.home"] })); }
    var chips = el("div.chips"); $app.appendChild(el("p.small", { text: S["staff.th.pick"] })); $app.appendChild(chips);
    var body = el("div.staffbody"); $app.appendChild(body);
    function paintChips() { clear(chips); for (var i = 1; i <= 7; i++) (function (i) { chips.appendChild(el("button.tchip.tw-" + i + (i === t ? ".on" : ""), { type: "button", text: fmt("staff.th.chip", { t: i, name: topicName(i) }), on: { click: function () { t = i; sessionStorage.setItem("u4_staff_t", String(t)); paintChips(); load(); } } })); })(i); }
    function load() { api("apiStaff", { op: "theory", t: t }).then(paintTopic).catch(function (e) { fail(e, "staff"); }); }
    function paintTopic(d) {
      clear(body); var cls = d.cls, open = !!(d.tc.open && d.tc.open[t]), pon = !!(d.tc.pair && d.tc.pair[t]);
      var ctl = el("div.ctl.tw-" + t);
      ctl.appendChild(el("span.state" + (open ? "" : ".off"), { text: open ? fmt("staff.th.openNow", { cls: cls }) : fmt("staff.th.closedNow", { cls: cls }) }));
      ctl.appendChild(el("button.btn" + (open ? ".sec" : ""), { text: open ? S["staff.th.close"] : fmt("staff.th.open", { cls: cls }), on: { click: function () { api("apiStaff", { op: "theoryOpen", t: t, open: !open }).then(load); } } }));
      ctl.appendChild(el("button.btn" + (pon ? ".sec" : ".quiet"), { text: pon ? S["staff.th.pairOn"] : S["staff.th.pairOff"], attr: { "aria-pressed": pon ? "true" : "false" }, on: { click: function () { api("apiStaff", { op: "theoryPairOn", t: t, on: !pon }).then(load); } } }));
      var rbtn = el("button.btn.quiet", { text: fmt("staff.th.round", { n: d.round + 1 }), on: { click: function () { if (armed) { clearTimeout(armed); armed = null; api("apiStaff", { op: "theoryRound", t: t }).then(load); return; } rbtn.textContent = fmt("staff.th.roundSure", { n: d.round + 1, cls: cls, prev: d.round }); rbtn.classList.add("gold"); armed = setTimeout(function () { armed = null; rbtn.textContent = fmt("staff.th.round", { n: d.round + 1 }); rbtn.classList.remove("gold"); }, 6000); } } });
      ctl.appendChild(el("span.state", { text: fmt("staff.th.roundNow", { n: d.round }) })); ctl.appendChild(rbtn);
      body.appendChild(ctl);
      if (!d.rows.length) { body.appendChild(el("p.sub", { text: fmt("staff.th.none", { cls: cls }) })); }
      else {
        var tb = el("table.sttab"), thr = el("tr"); S["staff.th.cols"].split(" · ").forEach(function (c) { thr.appendChild(el("th", { text: c })); }); tb.appendChild(thr);
        d.rows.forEach(function (row) {
          var tr = el("tr"); tr.appendChild(el("td", {}, [el("button.nm", { type: "button", text: row.name, on: { click: function () { drill(row); } } })]));
          tr.appendChild(el("td", { text: fmt("staff.th.learn", { n: row.learn[0], N: row.learn[1] }) }));
          var pr = row.pair, ptxt = "—";
          if (pr && pr.waiting) ptxt = S["staff.th.pairWaiting"];
          else if (pr && pr.gone) ptxt = fmt("staff.th.pairGone", { why: pr.goneWhy || "" });
          else if (pr && pr.done && pr.solo) ptxt = fmt("staff.th.pairSolo", { m: pr.right, R: pr.R, why: pr.why || "" });
          else if (pr && pr.done) ptxt = fmt("staff.th.pair", { m: pr.right, R: pr.R, name: joinNames(pr.names) });
          else if (pr && pr.trio) ptxt = fmt("staff.th.pairLiveTrio", { r: Math.min(pr.r, pr.R), R: pr.R, name: pr.names[0], name2: pr.names[1] });
          else if (pr && pr.solo) ptxt = fmt("staff.th.pairLiveSolo", { r: Math.min(pr.r, pr.R), R: pr.R, why: pr.why || "" });
          else if (pr) ptxt = fmt("staff.th.pairLive", { r: Math.min(pr.r, pr.R), R: pr.R, name: pr.names[0] });
          tr.appendChild(el("td", { text: ptxt }));
          tr.appendChild(el("td", { text: row.pp.n ? fmt("staff.th.pp", { m: row.pp.m, x: row.pp.x, p: row.pp.p }) + " · " + fmt("staff.th.ppN", { n: row.pp.n, N: row.pp.N }) : S["staff.th.notTried"] }));
          var fl = el("td"); (row.flags || []).forEach(function (f) { fl.appendChild(el("span.flag", { text: S["staff.th.flag." + f] || f })); }); tr.appendChild(fl);
          tb.appendChild(tr);
        });
        body.appendChild(tb);
      }
      var acts = el("div.acts"); acts.appendChild(el("button.btn.sec", { text: S["staff.th.csv"], on: { click: function () { api("apiStaff", { op: "theoryCsv", t: t, kind: "marks" }).then(function (c) { download(c.name, c.csv); }); } } }));
      acts.appendChild(el("button.btn.sec", { text: S["staff.th.chatCsv"], on: { click: function () { api("apiStaff", { op: "theoryCsv", t: t, kind: "chat" }).then(function (c) { download(c.name, c.csv); }); } } }));
      body.appendChild(acts);
      if (d.pairs.length) { var pl = el("div.pairs"); pl.appendChild(el("h3", { text: S["door.pair"] })); d.pairs.forEach(function (pr) { pl.appendChild(el("button.pr", { type: "button", text: fmt(pr.solo ? "staff.th.prBtnSolo" : "staff.th.prBtn", { names: joinNames(pr.names), m: pr.right, R: R, state: S[pr.done ? "staff.th.prDone" : "staff.th.prLive"], lines: pr.lines }), on: { click: function () { pairDrill(pr); } } })); }); body.appendChild(pl); }
    }
    function drill(row) {
      api("apiStaff", { op: "theoryPupil", t: t, e: row.e }).then(function (d) {
        clear(body); var dr = el("div.drill.tw-" + t); dr.appendChild(el("h2", { text: fmt("staff.th.pupilHead", { name: d.name, t: t, round: d.round }) }));
        var tb = el("table.sttab"), thr = el("tr"); [S["staff.th.qCol"], S["staff.th.marksCol"], S["staff.th.answerCol"], S["staff.th.schemeCol"]].forEach(function (c) { thr.appendChild(el("th", { text: c })); }); tb.appendChild(thr);
        d.parts.forEach(function (pt) { var tr = el("tr"); tr.appendChild(el("td", { text: pt.year + " · " + pt.label + " · " + fmt("staff.th.partMarks", { n: pt.marks }) })); tr.appendChild(el("td", { text: pt.best ? fmt("staff.th.bestOf", { m: pt.best[0], x: pt.best[1] }) + " · " + (pt.attempts === 1 ? S["staff.th.attempt1"] : fmt("staff.th.attempts", { n: pt.attempts })) : S["staff.th.notTried"] })); var at = pt.answer == null ? "" : typeof pt.answer === "string" ? pt.answer : (pt.answer.text || (Array.isArray(pt.answer) ? pt.answer.map(function (x) { return Array.isArray(x) ? x.join(" ") : x; }).join(", ") : Object.keys(pt.answer).map(function (k) { return pt.answer[k]; }).join(" · "))); tr.appendChild(el("td.ans", { text: at })); tr.appendChild(el("td.ms", { text: pt.ms || "" })); tb.appendChild(tr); });
        dr.appendChild(tb); dr.appendChild(el("div.acts", {}, [el("button.btn.sec", { text: S["staff.th.back"], on: { click: load } })])); body.appendChild(dr);
      }).catch(function (e) { fail(e, "staff"); });
    }
    function pairDrill(pr) {
      api("apiStaff", { op: "theoryPair", t: t, pid: pr.pid }).then(function (d) {
        clear(body); var dr = el("div.drill.tw-" + t); dr.appendChild(el("h2", { text: fmt("staff.th.pairHead", { names: d.names.join(" + "), t: t }) }));
        dr.appendChild(el("p.small", { text: d.names.map(function (n, i) { return fmt("staff.th.wasCn", { name: n, cn: d.cn[i] }); }).join(" ") + " " + fmt("staff.th.pairRight", { m: d.right, R: d.R }) }));
        var tb = el("table.sttab"), thr = el("tr"); [S["staff.th.roundCol"], S["staff.th.qCol"], S["staff.th.lockedCol"], S["staff.th.rightCol"]].forEach(function (c) { thr.appendChild(el("th", { text: c })); }); tb.appendChild(thr);
        d.A.forEach(function (a) { var tr = el("tr"); tr.appendChild(el("td", { text: String(a.r) })); tr.appendChild(el("td", { text: a.stem })); tr.appendChild(el("td" + (a.ok ? "" : ".ans"), { text: a.a + (a.ok ? " ✓" : " ✗") })); tr.appendChild(el("td.ms", { text: a.keyShown || "" })); tb.appendChild(tr); });
        dr.appendChild(tb);
        dr.appendChild(el("h3", { text: S["staff.th.transcript"] })); dr.appendChild(el("pre.tx", { text: d.tx || S["staff.th.noChat"] }));
        dr.appendChild(el("div.acts", {}, [el("button.btn.sec", { text: S["staff.th.back"], on: { click: load } })])); body.appendChild(dr);
      }).catch(function (e) { fail(e, "staff"); });
    }
    paintChips(); load(); timer = setInterval(function () { if (body.querySelector(".drill")) return; load(); }, 60000);
  }).catch(function (e) { fail(e, "staff"); });
}

/* ---------- boot ---------- */
function boot() {
  $app = document.getElementById("app"); $who = document.querySelector(".who"); $toast = document.querySelector(".toast");
  Promise.all([fetchJSON(BASE + "strings-u4.json"), fetchJSON(BASE + "theory/index.json")]).then(function (rr) {
    S = rr[0]; IDX = rr[1].topics || rr[1];
    window.addEventListener("hashchange", route); route();
  }).catch(function (e) { fail(e, "boot"); });
}
/* the live app: strings and the topic index come in the page (window.U4_STRINGS, window.U4_INDEX); app.js owns the hash and calls show */
function mount(o) {
  LIVE = true; o = o || {};
  S = o.strings || window.U4_STRINGS || {}; var ix = o.index || window.U4_INDEX || {}; IDX = ix.topics || ix;
  if (o.base) BASE = o.base; CLS = o.cls || ""; HOME = "#home"; if (o.staffUrl) STAFF_URL = o.staffUrl;
  if (!$toast) { $toast = el("div.toast", { attr: { role: "status", "aria-live": "polite" } }); document.body.appendChild($toast); }
}
function show(host, who) {
  if (!LIVE) mount({});
  $app = host; $who = who || null; route();
}
function staff(pane, cls) {
  if (!LIVE) mount({}); CLS = cls || CLS;
  try { active.stop(); } catch (e) { console.warn(e); }
  active = { stop: function () {} }; $app = pane; clear(pane); renderStaff(pane);
}
function stop() { try { active.stop(); } catch (e) { console.warn(e); } active = { stop: function () {} }; }
window.TH = { boot: boot, mount: mount, show: show, staff: staff, stop: stop, Surface: Surface };
})();
