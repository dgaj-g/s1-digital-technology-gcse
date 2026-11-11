/* th.js — Unit 4 theory side of the S2 coursework guide (client).
   Loaded after cw.js in the live build and mounted by app.js (TH.mount, TH.show, TH.staff); in the prototype index.html calls TH.boot.
   Talks to the server only through window.OLS_TRANSPORT.call(fn, req) with fn in apiTheory | apiPair | apiStaff,
   and to the live room only through window.U4_LIVE.base (Firebase REST, or the prototype relay at /fb).
   Nothing here names a pupil, class or school in the live room: seats are A B C and callsigns are birds. */
(function () {
"use strict";
var BASE = window.U4_BASE || "/";
var AGO = null, S = {}, IDX = [], LEARN = {}, ST = null, ME = { first: "", owner: false }, R = 10;
var active = { stop: function () {} };
var $app, $who, $toast, toastT, CLS = "", STAFF_URL = "#staff", LIVE = false;
var BANNED = ["fuck", "shit", "bitch", "cunt", "wank", "dick", "prick", "twat", "bastard", "slut", "whore", "fag", "retard", "nigg", "spastic"].map(function (w) { return new RegExp("\\b" + w, "i"); });
var QS = {}; location.search.replace(/[?&]([^=&]+)=([^&]*)/g, function (_, k, v) { QS[k] = decodeURIComponent(v); });
// the chat refuses a classmate's first name (D-NONAME): the server sends only hashes of the names, hashed the same way here
function h36(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
function nameHit(txt, nh) { if (!nh || !nh.length) return false; return String(txt).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/[^a-z]+/).some(function (w) { return w.length >= 2 && nh.indexOf(h36(w)) !== -1; }); }
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
function api(fn, req) { req = Object.assign({ cls: CLS }, req || {}); if (fn === "apiStaff" && req.name == null) req.name = CLS; return window.OLS_TRANSPORT.call(fn, req).then(function (r) { var stuck = document.querySelector('#sys [data-sys="retry"]'); if (stuck) stuck.click();   /* the server answered, so the connection is back: clear the "could not reach" bar and send what waited */ if (!r || r.ok === false) { var e = new Error((r && r.err) || "server said no"); e.res = r; throw e; } return r; }); }
function toast(msg) { if (!$toast) return; $toast.textContent = msg; $toast.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { $toast.classList.remove("on"); }, 2600); }
/* C1 (pairing fix): a click that waits says so. The button is disabled and aria-busy for at least 300 ms, its words stay and a ring turns after them;
   if the work fails she gets a toast and the button back. A button that should stay off after it worked carries data-keep-off. */
function busy(btn, work) {
  if (!btn || btn.getAttribute("aria-busy") === "true") return Promise.resolve();
  var t0 = Date.now(), isA = btn.tagName === "A";
  btn.setAttribute("aria-busy", "true"); if (isA) btn.setAttribute("aria-disabled", "true"); else btn.disabled = true;
  function end(ok) { return new Promise(function (r) { setTimeout(r, Math.max(0, 300 - (Date.now() - t0))); }).then(function () { btn.removeAttribute("aria-busy"); if (isA) btn.removeAttribute("aria-disabled"); else btn.disabled = !!(ok && btn.dataset && btn.dataset.keepOff); }); }
  var p; try { p = Promise.resolve(work()); } catch (e) { p = Promise.reject(e); }
  return p.then(function (v) { return end(true).then(function () { return v; }); }, function (e) { console.error(e); return end(false).then(function () { toast(S["err.server"]); }); });
}
function busyOn(fn) { return function (ev) { var b = ev && ev.currentTarget; return busy(b, function () { return fn(ev); }); }; }
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
function whyWord(w) { return S["staff.th.why." + w] || ""; }
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
  var learnDone = N > 0 && ln >= N, pairNow = !!(ps && ps.state === "done"), goes = (ST.goes && ST.goes[t]) || [], earned = goes.some(function (g) { return !g.cut; }), pairDone = pairNow || earned, pairAgain = !pairNow && earned, ppDone = NP > 0 && qn >= NP;
  return { t: t, N: N, ln: ln, bits: bits, learnDone: learnDone, pair: ps, pairDone: pairDone, pairAgain: pairAgain, goes: goes, go: (ST.tc.go && ST.tc.go[t]) || 1, pairOn: !!(ST.tc.pair && ST.tc.pair[t]), round: round, qn: qn, qm: qm, qx: qx, NP: NP, total: total, ppDone: ppDone,
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
        var st = p.done ? fmt("th.card.done", { t: t, m: p.qm, x: p.total }) : p.qn ? fmt("th.card.marks", { round: p.round, m: p.qm, x: p.total }) : p.pair && p.pair.state === "live" ? fmt("th.card.pair", { r: p.pair.r || 1, R: R }) : p.ln ? fmt("th.card.learn", { n: p.ln, N: p.N }) : p.pairDone ? S["topic.where.pairDoneOnce"] : S["th.card.notStarted"];
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
  var mine = active;
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
    else if (ps && ps.state === "live" && !p.pairOn) { pairText = ps.solo ? fmt("door.pair.pausedSolo", { round: ps.r || 1, R: R }) : fmt("door.pair.paused", { round: ps.r || 1, R: R, them: joinNames(ps.them || []) }); pairCls.off = true; }
    else if (ps && ps.state === "live") { pairText = ps.solo ? fmt("door.pair.liveSolo", { round: ps.r || 1, R: R }) : fmt("door.pair.live", { round: ps.r || 1, R: R, them: joinNames(ps.them || []) }); pairBtn = ps.solo ? S["door.pair.carry"] : S["door.pair.back"]; }
    else if (ps && ps.state === "waiting") { pairText = S["pair.wait.head"]; pairBtn = S["door.pair.back"]; }
    else if (!p.pairOn) { pairText = S["door.pair.off"]; pairCls.off = true; }
    else { pairText = p.goes.length ? S["door.pair.newGo"] : S["door.pair.notStarted"]; pairBtn = S["door.pair.start"]; }
    var lastG = p.goes.length ? p.goes[p.goes.length - 1] : null, goNote = !lastG || (ps && ps.state === "done") ? null : el("p.small.quiet", { text: lastG.cut ? fmt("door.pair.lastGoCut", { r: lastG.r, R: R }) : lastG.names && lastG.names.length ? fmt("door.pair.lastGo", { m: lastG.right, R: R, name: joinNames(lastG.names) }) : lastG.solo ? fmt("door.pair.lastGoSolo", { m: lastG.right, R: R }) : fmt("door.pair.lastGoPlain", { m: lastG.right, R: R }) });
    var pairNote = ps && ps.state === "live" && !p.pairOn ? null : el("p.small.quiet", { text: p.pairOn || ps ? S["pair.door.act"] : S["pair.door.notNow"] });
    doors.appendChild(door("2", S["door.pair"], S["door.pair.sub"], pairText, pairCls, pairBtn, null, busyOn(function () { return api("apiPair", { op: "join", t: t }).then(function (v) { try { sessionStorage.setItem("u4_prejoin_" + t, JSON.stringify({ v: v, at: Date.now() })); } catch (e) {} go("#th/" + t + "/pair"); }); }), goNote && pairNote ? el("div", {}, [goNote, pairNote]) : goNote || pairNote));
    var ppText = p.qn ? fmt("door.pp.progMarks", { round: p.round, m: p.qm, x: p.total, n: p.qn, N: p.NP }) : fmt("door.pp.prog", { round: p.round, n: 0, N: p.NP });
    doors.appendChild(door("3", S["door.pp"], S["door.pp.sub"], ppText, { done: p.ppDone }, p.ppDone ? S["door.pp.see"] : p.qn ? S["door.pp.go"] : S["door.pp.start"], "#th/" + t + "/pp"));
    $app.appendChild(doors);
    var done = []; if (p.learnDone) done.push(S["topic.where.learnDone"]); else if (p.ln) done.push(fmt("topic.where.learnPart", { n: p.ln, N: p.N })); if (p.pairDone) done.push(p.pairAgain ? S["topic.where.pairDoneOnce"] : S["topic.where.pairDone"]); if (p.ppDone) done.push(S["topic.where.ppDone"]); else if (p.qn) done.push(fmt("topic.where.ppPart", { n: p.qn, N: p.NP }));
    var next = !p.learnDone ? S["topic.where.next.learn"] : (p.pairAgain && p.pairOn) ? S["topic.where.next.pairAgain"] : (!p.pairDone && p.pairOn) ? S["topic.where.next.pair"] : !p.ppDone ? S["topic.where.next.pp"] : !p.pairDone ? S["topic.where.next.pair"] : null;
    $app.appendChild(el("div.where.tw-" + t, {}, [el("span.dot"), el("span", { text: next ? fmt("topic.where", { t: t, done: done.length ? done.join(" ") : S["topic.where.nothing"], next: next }) : fmt("topic.where.done", { t: t }) })]));
    $app.appendChild(el("a.back", { href: "#th", text: "‹ " + S["nav.backTh"] }));
    if (active === mine) {   // the door follows the partner switch and a new partner go, so nobody has to reload
      var doorT = null, doorOn = true;
      (function doorTick() { doorT = setTimeout(function () { if (!doorOn) return; if (document.hidden) { doorTick(); return; } api("apiPair", { op: "switch", t: t }).then(function (st) { if (active === mine && (st.pairOn !== p.pairOn || (st.go || 1) !== p.go)) route(); }).catch(function (e) { console.warn(e); }).then(function () { if (doorOn) doorTick(); }); }, 15000); })();   // chained: one ask at a time
      mine.stop = function () { doorOn = false; clearTimeout(doorT); };
    }
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
    var opts = spec.opts.map(function (op, i) { return Array.isArray(op) ? { L: op[0], text: op[1], table: op[2] } : { L: letters(i), text: op }; });
    var open = !!spec.open, pick = spec.pick || 0, multi = open || pick, disp = order(opts.length, seed), shown = {}, chosen = null, picked = [], btns = {};
    disp.forEach(function (oi, di) { shown[opts[oi].L] = letters(di); });
    api.label = function (L) { return shown[L] || L; };
    var wrap = el("div.opts" + (multi ? ".pickn" : "")); root.appendChild(wrap);
    function paintOne() { Object.keys(btns).forEach(function (k) { var on = multi ? picked.indexOf(k) >= 0 : k === chosen; btns[k].classList.toggle("on", on); btns[k].setAttribute("aria-pressed", on ? "true" : "false"); }); }
    disp.forEach(function (oi) {
      var op = opts[oi], body = el("span.optbody");
      if (op.text) body.appendChild(el("span", { text: op.text }));
      if (op.table) { var ot = el("table.optt"); if (op.table.head) { var otr = el("tr"); op.table.head.forEach(function (h) { otr.appendChild(el("th", { text: h })); }); ot.appendChild(otr); } (op.table.rows || []).forEach(function (r) { var tr2 = el("tr"); r.forEach(function (c) { tr2.appendChild(el("td", { text: String(c) })); }); ot.appendChild(tr2); }); body.appendChild(ot); }
      var b = el("button.opt", { type: "button", attr: { "aria-pressed": "false" }, on: { click: function () { if (locked) return; if (multi) { var ix = picked.indexOf(op.L); if (ix >= 0) picked.splice(ix, 1); else if (open || picked.length < pick) picked.push(op.L); else { toast(fmt("pick.hint", { n: pick })); return; } } else chosen = op.L; paintOne(); change(); } } }, [el("span.l", { text: shown[op.L] }), body]);
      btns[op.L] = b; wrap.appendChild(b);
    });
    if (pick && !open) root.appendChild(el("p.hint", { text: fmt("pick.hint", { n: pick }) }));
    function sortedPicked() { return opts.map(function (o) { return o.L; }).filter(function (L) { return picked.indexOf(L) >= 0; }); }
    api.get = function () { return multi ? sortedPicked().join(",") : (chosen || ""); };
    api.complete = function () { return open ? picked.length >= 1 : pick ? picked.length >= pick : !!chosen; };
    api.set = function (v) { if (multi) picked = String(v || "").split(",").filter(function (x) { return !!x && !!btns[x]; }); else chosen = v || null; paintOne(); };
    api.verdict = function (res, rv) { var ans = rv && rv.ansKey, ansArr = ans == null ? [] : [].concat(ans), ok;
      if (multi) { ok = ansArr.length ? (ansArr.every(function (L) { return picked.indexOf(L) >= 0; }) && picked.length <= (open ? ansArr.length : pick)) : (res.cells || []).every(function (c) { return c === 1; });
        picked.forEach(function (L) { if (btns[L]) btns[L].classList.add(ansArr.length ? (ansArr.indexOf(L) >= 0 ? "right" : "wrong") : (ok ? "right" : "wrong")); }); }
      else { ok = !!(res.cells && res.cells[0] === 1); if (chosen && btns[chosen]) btns[chosen].classList.add(ok ? "right" : "wrong"); }
      ansArr.forEach(function (L) { if (btns[L]) btns[L].classList.add("right"); }); return ok; };
    api.clearMarks = function () { Object.keys(btns).forEach(function (k) { btns[k].classList.remove("right", "wrong"); }); };
  }

  else if (kind === "tf") {
    var rows = spec.rows, vals = spec.vals, dispR = order(rows.length, seed), picks = rows.map(function () { return ""; }), cells = {};
    var tbl = el("table.tft" + (vals.some(function (v) { return v.length > 5; }) ? ".long" : "")); var thead = el("thead"); var hr = el("tr"); hr.appendChild(el("th", { text: "" })); vals.forEach(function (v) { hr.appendChild(el("th.c", { text: v })); }); hr.appendChild(el("th.vk", { text: "" })); thead.appendChild(hr); tbl.appendChild(thead);
    var tb = el("tbody"); tbl.appendChild(tb);
    dispR.forEach(function (ri) {
      var tr = el("tr"); tr.appendChild(el("td", { text: rows[ri] })); cells[ri] = { btns: {}, vk: el("td.vk") };
      vals.forEach(function (v) { var b = el("button.tfb", { type: "button", text: v, on: { click: function () { if (locked) return; picks[ri] = v; Object.keys(cells[ri].btns).forEach(function (k) { cells[ri].btns[k].classList.toggle("on", k === v); }); change(); } } }); cells[ri].btns[v] = b; var td = el("td.c"); td.appendChild(b); tr.appendChild(td); });
      tr.appendChild(cells[ri].vk); tb.appendChild(tr);
    });
    root.appendChild(tbl);
    api.get = function () { return picks.every(function (p) { return !p; }) ? "" : picks.join(","); };
    api.order = dispR;   // the shuffled row order, so an answer read out in words follows the rows as shown
    api.complete = function () { return picks.every(function (p) { return !!p; }); };
    api.set = function (v) { var a = (v || "").split(","); picks = rows.map(function (_, i) { return a[i] || ""; }); Object.keys(cells).forEach(function (ri) { Object.keys(cells[ri].btns).forEach(function (k) { cells[ri].btns[k].classList.toggle("on", k === picks[ri]); }); }); };
    api.verdict = function (res, rv) { var all = true; rows.forEach(function (_, ri) { var ok = res.cells && res.cells[ri] === 1; if (!ok) all = false; clear(cells[ri].vk).appendChild(el("span.vk" + (ok ? ".ok" : ".no"))); var want = rv && rv.ansKey && rv.ansKey[ri]; if (want && cells[ri].btns[want]) cells[ri].btns[want].classList.add("right"); if (!ok && picks[ri] && cells[ri].btns[picks[ri]]) cells[ri].btns[picks[ri]].classList.add("wrong"); }); return all; };
    api.clearMarks = function () { Object.keys(cells).forEach(function (ri) { clear(cells[ri].vk); Object.keys(cells[ri].btns).forEach(function (k) { cells[ri].btns[k].classList.remove("right", "wrong"); }); }); };
  }

  else if (kind === "gaps") {
    var nGaps = (spec.text.match(/\{\d+\}/g) || []).length, filled = [], gapEls = [], gapIns = [], chips = [], sel = null, typed = !(spec.bank && spec.bank.length);
    for (var gi = 0; gi < nGaps; gi++) filled.push("");
    var txt = el("p.text" + (typed ? ".typed" : "")); var parts = spec.text.split(/(\{\d+\})/);
    parts.forEach(function (pc) { var mm = /^\{(\d+)\}$/.exec(pc);
      if (!mm) { pc.split("\n").forEach(function (sg, si) { if (si) txt.appendChild(el("br")); if (sg) txt.appendChild(document.createTextNode(sg)); }); return; }
      var idx = parseInt(mm[1], 10) - 1, g;
      if (typed) { var inp = el("input.gapin", { type: "text", attr: { maxlength: "40", autocomplete: "off", spellcheck: "false", autocapitalize: "off", "aria-label": fmt("aria.gap", { n: idx + 1 }) }, on: { input: function () { filled[idx] = inp.value.trim(); g.classList.toggle("filled", !!filled[idx]); change(); } } }); gapIns[idx] = inp; g = el("span.gap.typed", {}, [inp, el("span.fix")]); }
      else g = el("span.gap", { attr: { "data-i": idx, role: "button", tabindex: "0" }, on: { click: function () { if (justDragged) return; gapClick(idx); }, pointerdown: function (ev) { if (filled[idx]) dragWord(ev, filled[idx], idx, null); }, keydown: function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); gapClick(idx); } } } }, [el("span.w", { text: "" }), el("span.fix")]);
      gapEls[idx] = g; txt.appendChild(g); });
    root.appendChild(txt);
    if (!typed) { var bank = el("div.bank"); bank.appendChild(el("div.h", { text: S["part.gaps.bank"] })); var bankOrder = order(spec.bank.length, seed);
      bankOrder.forEach(function (bi) { var w = spec.bank[bi]; var c = el("button.chip", { type: "button", text: w, on: { click: function () { if (justDragged || locked || c.classList.contains("used")) return; sel = (sel === c) ? null : c; chips.forEach(function (x) { x.classList.toggle("sel", x === sel); }); target(); }, pointerdown: function (ev) { if (!c.classList.contains("used")) dragWord(ev, w, null, c); } } }); chips.push(c); bank.appendChild(c); });
      root.appendChild(bank); }
    root.appendChild(el("p.hint", { text: typed ? S["gaps.typed"] : S["part.gaps.hint"] }));
    function target() { gapEls.forEach(function (g) { g.classList.toggle("target", !!sel); }); }
    function paint() { if (typed) { gapIns.forEach(function (inp, i) { if (inp.value.trim() !== filled[i]) inp.value = filled[i]; gapEls[i].classList.toggle("filled", !!filled[i]); }); return; }
      gapEls.forEach(function (g, i) { g.classList.toggle("filled", !!filled[i]); g.querySelector(".w").textContent = filled[i] || ""; }); var used = {}; filled.forEach(function (w) { if (w) used[w] = (used[w] || 0) + 1; }); chips.forEach(function (c) { var w = c.textContent; if (used[w]) { used[w]--; c.classList.add("used"); c.classList.remove("sel"); if (sel === c) sel = null; } else c.classList.remove("used"); }); target(); }
    function gapClick(i) { if (locked) return; if (sel) { filled[i] = sel.textContent; sel = null; } else if (filled[i]) { filled[i] = ""; } paint(); change(); }
    /* drag a word from the bank, or from one gap to another. The ghost follows the pointer with no transition; the whole box of a gap (plus a margin) takes the drop; near the top or bottom of the window the page scrolls. A word dragged out of a gap and let go elsewhere goes back to the bank. */
    var justDragged = false;
    function gapUnder(x, y) { var best = -1, bestD = Infinity; gapEls.forEach(function (g, i) { var b = g.getBoundingClientRect(), dx = Math.max(b.left - x, 0, x - b.right), dy = Math.max(b.top - y, 0, y - b.bottom), d = dx + dy; if (dx > 14 || dy > 14) return; if (d < bestD) { bestD = d; best = i; } }); return best; }   // the gap the word is over; if it is over none, the nearest within a finger's width
    function dragWord(ev, word, fromGap, chip) {
      if (locked || ev.button > 0) return;
      var sx = ev.clientX, sy = ev.clientY, x = sx, y = sy, id = ev.pointerId, ghost = null, over = -1, raf = 0;
      function place() { ghost.style.transform = "translate3d(" + x + "px," + y + "px,0) translate(-50%,-50%)"; }
      function frame() { raf = 0; if (!ghost) return; var h = window.innerHeight, edge = 70; if (y < edge) window.scrollBy({ top: -Math.ceil((edge - y) / 5), behavior: "instant" }); else if (y > h - edge) window.scrollBy({ top: Math.ceil((y - (h - edge)) / 5), behavior: "instant" }); var u = gapUnder(x, y); if (u !== over) { if (over >= 0) gapEls[over].classList.remove("over"); over = u; if (over >= 0) gapEls[over].classList.add("over"); } raf = requestAnimationFrame(frame); }
      function begin() { var cs = getComputedStyle(root); ghost = el("div.chip.ghost", { text: word }); ["--sw", "--sw-ink"].forEach(function (k) { ghost.style.setProperty(k, cs.getPropertyValue(k)); }); document.body.appendChild(ghost); document.body.classList.add("wordrag"); if (sel) { sel = null; chips.forEach(function (x2) { x2.classList.remove("sel"); }); target(); } if (chip) chip.classList.add("lifted"); if (fromGap != null) gapEls[fromGap].classList.add("lifted"); place(); raf = requestAnimationFrame(frame); }
      function move(e) { if (e.pointerId !== id) return; x = e.clientX; y = e.clientY; if (!ghost) { if (Math.abs(x - sx) + Math.abs(y - sy) < 6) return; begin(); } e.preventDefault(); place(); }
      function end(e, keep) { if (e.pointerId !== id) return; window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", cancel); if (!ghost) return; if (raf) cancelAnimationFrame(raf); raf = 0; ghost.remove(); ghost = null; document.body.classList.remove("wordrag"); if (chip) chip.classList.remove("lifted"); if (fromGap != null) gapEls[fromGap].classList.remove("lifted"); if (over >= 0) gapEls[over].classList.remove("over"); justDragged = true; setTimeout(function () { justDragged = false; }, 60); if (!keep || locked) return; var i = gapUnder(x, y); if (i >= 0 && i === fromGap) return; if (i >= 0) { if (fromGap != null) filled[fromGap] = filled[i]; filled[i] = word; } else if (fromGap != null) filled[fromGap] = ""; else return; paint(); change(); }
      function up(e) { end(e, true); } function cancel(e) { end(e, false); }
      window.addEventListener("pointermove", move, { passive: false }); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", cancel);
    }
    api.get = function () { return filled.every(function (w) { return !w; }) ? "" : filled.join("|"); };
    api.complete = function () { return filled.every(function (w) { return !!w; }); };
    api.set = function (v) { var a = (v || "").split("|"); for (var i = 0; i < nGaps; i++) filled[i] = a[i] || ""; paint(); };
    api.verdict = function (res, rv) { var all = true; gapEls.forEach(function (g, i) { var ok = res.cells && res.cells[i] === 1; if (!ok) all = false; g.classList.add(ok ? "right" : "wrong"); var fx = g.querySelector(".fix"); fx.textContent = (!ok && rv && rv.ansKey && rv.ansKey[i]) ? String(rv.ansKey[i]).split("|")[0] : ""; }); return all; };
    api.clearMarks = function () { gapEls.forEach(function (g) { g.classList.remove("right", "wrong"); g.querySelector(".fix").textContent = ""; }); };
    api.disable = function (b) { lock(b); gapIns.forEach(function (inp) { inp.disabled = !!b; }); };
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
    api.order = dispI;   // the shuffled item order, so an answer read out in words follows the items as shown
    api.get = function () { return picksS.every(function (p) { return !p; }) ? "" : picksS.join(","); };
    api.complete = function () { return picksS.every(function (p) { return !!p; }); };
    api.set = function (v) { var a = (v || "").split(","); picksS = items.map(function (_, i) { return a[i] || ""; }); Object.keys(rowsS).forEach(function (ii) { Object.keys(rowsS[ii].btns).forEach(function (k) { rowsS[ii].btns[k].classList.toggle("on", k === picksS[ii]); }); }); };
    api.verdict = function (res, rv) { var all = true; items.forEach(function (_, ii) { var ok = res.cells && res.cells[ii] === 1; if (!ok) all = false; rowsS[ii].row.classList.add(ok ? "right" : "wrong"); clear(rowsS[ii].vk).appendChild(el("span.vk" + (ok ? ".ok" : ".no"))); var want = rv && rv.ansKey && rv.ansKey[ii]; if (want && rowsS[ii].btns[want]) rowsS[ii].btns[want].classList.add("right"); }); return all; };
    api.clearMarks = function () { Object.keys(rowsS).forEach(function (ii) { rowsS[ii].row.classList.remove("right", "wrong"); clear(rowsS[ii].vk); Object.keys(rowsS[ii].btns).forEach(function (k) { rowsS[ii].btns[k].classList.remove("right"); }); }); };
  }

  else if (kind === "match") {
    var left = spec.left, right = spec.right, dispRt = order(right.length, seed), pairs = {}, selL = null, selR = null, dotsL = {}, dotsR = {}, itemsL = {}, itemsR = {};
    var mbox = el("div.match"); var colL = el("div.colL"), colR = el("div.colR"), svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    colL.appendChild(el("div.h", { text: o.leftHead || "" })); colR.appendChild(el("div.h", { text: o.rightHead || "" }));
    /* the whole card is the target: the dot is only where the line starts. Either side can be clicked first. */
    function paintSel() { Object.keys(itemsL).forEach(function (k) { var on = String(selL) === k; itemsL[k].classList.toggle("sel", on); dotsL[k].classList.toggle("sel", on); }); Object.keys(itemsR).forEach(function (k) { var on = String(selR) === k; itemsR[k].classList.toggle("sel", on); dotsR[k].classList.toggle("sel", on); }); }
    function joinUp(li, ri) { pairs[li] = ri; selL = null; selR = null; paintSel(); draw(); change(); }
    function clickL(li) { if (locked) return; if (selR != null) return joinUp(li, selR); selL = (selL === li) ? null : li; paintSel(); }
    function clickR(ri) { if (locked) return; if (selL != null) return joinUp(selL, ri); if (selR === ri) { selR = null; paintSel(); return; } var owner = Object.keys(pairs).find(function (l) { return pairs[l] === ri; }); if (owner != null) { delete pairs[owner]; draw(); change(); return; } selR = ri; paintSel(); }
    left.forEach(function (tx, li) { var d = el("button.dot", { type: "button", attr: { "aria-label": fmt("aria.left", { n: li + 1 }) } }); dotsL[li] = d; var mi = el("div.mi", { on: { click: function () { clickL(li); } } }, [el("span", { text: tx }), d]); itemsL[li] = mi; colL.appendChild(mi); });
    dispRt.forEach(function (ri) { var d = el("button.dot", { type: "button", attr: { "aria-label": fmt("aria.right", { n: ri + 1 }) } }); dotsR[ri] = d; var mi = el("div.mi", { on: { click: function () { clickR(ri); } } }, [d, el("span", { text: right[ri] })]); itemsR[ri] = mi; colR.appendChild(mi); });
    mbox.appendChild(colL); mbox.appendChild(svg); mbox.appendChild(colR); root.appendChild(mbox); root.appendChild(el("p.hint", { text: S["part.match.hint"] }));
    var lineCls = {};
    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild); var bb = mbox.getBoundingClientRect(); svg.setAttribute("width", bb.width); svg.setAttribute("height", bb.height); svg.setAttribute("viewBox", "0 0 " + bb.width + " " + bb.height);
      Object.keys(dotsL).forEach(function (l) { var on = pairs[l] != null; dotsL[l].classList.toggle("done", on); itemsL[l].classList.toggle("paired", on); }); Object.keys(dotsR).forEach(function (r) { var on = Object.keys(pairs).some(function (l) { return pairs[l] === parseInt(r, 10); }); dotsR[r].classList.toggle("done", on); itemsR[r].classList.toggle("paired", on); });
      Object.keys(pairs).forEach(function (l) { var r = pairs[l]; var a = dotsL[l].getBoundingClientRect(), b = dotsR[r].getBoundingClientRect(); var ln = document.createElementNS("http://www.w3.org/2000/svg", "line"); ln.setAttribute("x1", a.left + a.width / 2 - bb.left); ln.setAttribute("y1", a.top + a.height / 2 - bb.top); ln.setAttribute("x2", b.left + b.width / 2 - bb.left); ln.setAttribute("y2", b.top + b.height / 2 - bb.top); if (lineCls[l]) ln.setAttribute("class", lineCls[l]); ln.addEventListener("click", function () { if (locked) return; delete pairs[l]; draw(); change(); }); svg.appendChild(ln); });
    }
    api.redraw = draw; if (window.ResizeObserver) new ResizeObserver(function () { draw(); }).observe(mbox); else window.addEventListener("resize", draw); requestAnimationFrame(draw);
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
    var thd = spec.head, tin = spec.inputs, nIn = tin[0].length, nOut = thd.length - nIn, tvals = spec.vals || ["0", "1"], tgv = spec.given || [], tbtn = [];
    function isGiven(r, j) { return !!(tgv[r] && tgv[r][j] != null); }
    var tv = tin.map(function (_, r) { var a = []; for (var j = 0; j < nOut; j++) a.push(isGiven(r, j) ? String(tgv[r][j]) : ""); return a; });
    var xt = el("table.truth"), xhr = el("tr"); thd.forEach(function (h, i) { xhr.appendChild(el("th" + (i >= nIn ? ".out" : ""), { text: h })); }); var xth = el("thead"); xth.appendChild(xhr); xt.appendChild(xth); var xtb = el("tbody"); xt.appendChild(xtb);
    tin.forEach(function (row, r) { var tr = el("tr"); tbtn.push([]); row.forEach(function (v) { tr.appendChild(el("td.in", { text: v })); });
      for (var j = 0; j < nOut; j++) (function (j) { if (isGiven(r, j)) { tbtn[r].push(null); tr.appendChild(el("td.out.given", { text: tv[r][j], attr: { "aria-label": fmt("aria.cell", { r: r + 1, c: nIn + j + 1 }) } })); return; }
        var b = el("button.tcell", { type: "button", text: "", attr: { "aria-label": fmt("aria.cell", { r: r + 1, c: nIn + j + 1 }) }, on: { click: function () { if (locked) return; var ix = tvals.indexOf(tv[r][j]); tv[r][j] = tvals[(ix + 1) % tvals.length]; paintT(); change(); } } }); tbtn[r].push(b); var td = el("td.out"); td.appendChild(b); tr.appendChild(td); })(j);
      xtb.appendChild(tr); });
    root.appendChild(xt); root.appendChild(el("p.hint", { text: S["part.truth.hint"] })); if (spec.given) root.appendChild(el("p.hint", { text: S["truth.given"] }));
    function paintT() { tbtn.forEach(function (row, r) { row.forEach(function (b, j) { if (!b) return; b.textContent = tv[r][j]; b.classList.toggle("set", !!tv[r][j]); }); }); }
    api.get = function () { var any = false; tbtn.forEach(function (row, r) { row.forEach(function (b, j) { if (b && tv[r][j]) any = true; }); }); return any ? tv.map(function (row) { return row.slice(); }) : ""; };
    api.complete = function () { return tv.every(function (row) { return row.every(function (x) { return !!x; }); }); };
    api.set = function (v) { var rows = Array.isArray(v) ? v : []; tv = tin.map(function (_, r) { var a = []; for (var j = 0; j < nOut; j++) a.push(isGiven(r, j) ? String(tgv[r][j]) : String((rows[r] || [])[j] || "")); return a; }); paintT(); };
    api.verdict = function (res) { var k = 0, all = true; tbtn.forEach(function (row) { row.forEach(function (b) { if (!b) return; var ok = res.cells && res.cells[k++] === 1; if (!ok) all = false; b.classList.add(ok ? "right" : "wrong"); }); }); return all; };
    api.clearMarks = function () { tbtn.forEach(function (row) { row.forEach(function (b) { if (b) b.classList.remove("right", "wrong"); }); }); };
  }

  else if (kind === "add") {
    var agv = spec.given || null, hasCarry = !!(spec.carry || (agv && agv.carry)), hasOvf = !!(spec.overflow || (agv && agv.overflow)), acells = { carry: [], result: [], overflow: [] }, ains = [], avk = {};
    var atab = el("table.addt"), athead = el("thead"), ahr = el("tr"); ahr.appendChild(el("th", { text: "" })); ahr.appendChild(el("th.ovf", { text: hasOvf ? S["add.overflow"] : "" })); [128, 64, 32, 16, 8, 4, 2, 1].forEach(function (v) { ahr.appendChild(el("th.plv", { text: String(v) })); }); ahr.appendChild(el("th", { text: "" })); athead.appendChild(ahr); atab.appendChild(athead); var atb = el("tbody"); atab.appendChild(atb);
    function gchar(name, i) { if (!agv) return "_"; var str = String(agv[name] == null ? "" : agv[name]); return str.length > i ? str.charAt(i) : "_"; }
    function mkCell(name, i) { var g = gchar(name, i); if (g === ".") { acells[name][i] = { none: true }; return el("td.none"); } if (g !== "_") { acells[name][i] = { given: g }; return el("td.given", { text: g }); }
      var inp = el("input", { type: "text", attr: { maxlength: "1", inputmode: "numeric", autocomplete: "off", "aria-label": fmt("add.aria", { row: S["add." + name], c: name === "overflow" ? 1 : i + 1 }) }, on: { input: function () { var v = inp.value.replace(/[^01]/g, "").slice(0, 1); inp.value = v; inp.classList.toggle("typed", !!v); if (v) { var nx = ains[ains.indexOf(inp) + 1]; if (nx && nx.parentNode.parentNode === inp.parentNode.parentNode) nx.focus(); } change(); },
        keydown: function (ev) { var k = ains.indexOf(inp); if (ev.key === "ArrowLeft" && ains[k - 1]) { ains[k - 1].focus(); ev.preventDefault(); } if (ev.key === "ArrowRight" && ains[k + 1]) { ains[k + 1].focus(); ev.preventDefault(); } if (ev.key === "Backspace" && !inp.value && ains[k - 1]) ains[k - 1].focus(); } } });
      ains.push(inp); acells[name][i] = { inp: inp }; var td = el("td"); td.appendChild(inp); return td; }
    function addRow(cls, label, lead, cells) { var tr = el("tr." + cls); tr.appendChild(el("th", { text: label })); tr.appendChild(lead); cells.forEach(function (c) { tr.appendChild(c); }); var vk = el("td.vk"); avk[cls] = vk; tr.appendChild(vk); atb.appendChild(tr); }
    if (hasCarry) { var cc = []; for (var ci = 0; ci < 8; ci++) cc.push(mkCell("carry", ci)); addRow("carry", S["add.carry"], el("td"), cc); }
    addRow("opa", S["add.a"], el("td"), String(spec.a).split("").map(function (d) { return el("td.fixed", { text: d }); }));
    addRow("opb", S["add.b"], el("td.plus", { text: "+" }), String(spec.b).split("").map(function (d) { return el("td.fixed", { text: d }); }));
    var rc = []; for (var ri = 0; ri < 8; ri++) rc.push(mkCell("result", ri));
    var ovfCell = hasOvf ? mkCell("overflow", 0) : el("td"); ovfCell.classList.add("ovf"); addRow("result", S["add.result"], ovfCell, rc);
    root.appendChild(el("div.addwrap", {}, [atab])); root.appendChild(el("p.hint", { text: S["add.hint"] }));
    function strOf(name, n) { var out = ""; for (var i = 0; i < n; i++) { var c = acells[name][i]; out += !c ? "_" : c.none ? "." : c.given != null ? c.given : (c.inp.value || "_"); } return out; }
    api.get = function () { var o = { result: strOf("result", 8) }; if (hasOvf) o.overflow = strOf("overflow", 1); if (hasCarry) o.carry = strOf("carry", 8); return ains.some(function (i) { return !!i.value; }) ? o : ""; };
    api.complete = function () { if (agv) return ains.every(function (i) { return !!i.value; }); return acells.result.every(function (c) { return c.given != null || !!c.inp.value; }) && (!hasOvf || !acells.overflow[0].inp || !!acells.overflow[0].inp.value); };
    api.set = function (v) { v = v || {}; ["carry", "result", "overflow"].forEach(function (nm) { var str = String(v[nm] == null ? "" : v[nm]); acells[nm].forEach(function (c, i) { if (c && c.inp) { var ch = str.charAt(i); c.inp.value = /^[01]$/.test(ch) ? ch : ""; c.inp.classList.toggle("typed", !!c.inp.value); } }); }); };
    api.verdict = function (res, rv) { var cells = res.cells || [], k = 0, all = true, key = (rv && rv.ansKey) || {};
      function paintVk(cls, ok, nm) { var vk = avk[cls]; if (!vk) return; clear(vk).appendChild(el("span.vk" + (ok ? ".ok" : ".no"))); if (!ok && key[nm] != null) vk.appendChild(el("span.fix", { text: String(key[nm]) })); }
      function markRow(nm) { var okRow = true, any = false; acells[nm].forEach(function (c) { if (!c || !c.inp) return; any = true; var ok = cells[k++] === 1; if (!ok) okRow = false; c.inp.classList.add(ok ? "right" : "wrong"); }); return { ok: okRow, any: any }; }
      if (agv) { var rC = markRow("carry"), rR = markRow("result"), rO = markRow("overflow"); if (rC.any) { if (!rC.ok) all = false; paintVk("carry", rC.ok, "carry"); }
        if (rR.any || rO.any) { var ok2 = (!rR.any || rR.ok) && (!rO.any || rO.ok); if (!ok2) all = false; paintVk("result", ok2, rR.any && !rR.ok ? "result" : "overflow"); } }
      else { var rr = cells[k++] === 1; acells.result.forEach(function (c) { if (c.inp) c.inp.classList.add(rr ? "right" : "wrong"); }); if (!rr) all = false; var resNm = "result", resOk = rr;
        if (hasOvf) { var ro = cells[k++] === 1; if (acells.overflow[0].inp) acells.overflow[0].inp.classList.add(ro ? "right" : "wrong"); if (!ro) { all = false; if (resOk) { resOk = false; resNm = "overflow"; } } }
        paintVk("result", resOk, resNm);
        if (hasCarry) { var rcOk = cells[k++] === 1; acells.carry.forEach(function (c) { if (c.inp) c.inp.classList.add(rcOk ? "right" : "wrong"); }); if (!rcOk) all = false; paintVk("carry", rcOk, "carry"); } }
      return all; };
    api.clearMarks = function () { ains.forEach(function (i) { i.classList.remove("right", "wrong"); }); Object.keys(avk).forEach(function (c) { clear(avk[c]); }); };
    api.disable = function (b) { lock(b); ains.forEach(function (i) { i.disabled = !!b; }); };
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
  if (spec.kind === "one") return [].concat(rv.ansKey).map(function (L) { return sf ? sf.label(L) : L; }).join(", ");
  if (spec.kind === "tf" && sf && sf.order) return sf.order.map(function (i) { return rv.ansKey[i]; }).join(", ");
  if (spec.kind === "sort") return sf ? "" : rv.ansKey.join(", ");   // the sort rows already light the right column in green
  if (spec.kind === "tf") return rv.ansKey.join(", ");
  if (spec.kind === "gaps") return rv.ansKey.map(function (a) { return String(a).split("|")[0]; }).join(", ");
  if (spec.kind === "match") return rv.ansKey.map(function (p) { return (spec.left[p[0]] || p[0] + 1) + ": " + spec.right[p[1]].replace(/\s+/g, " ").replace(/\.$/, ""); }).join(". ") + ".";
  if (spec.kind === "number") return rv.ansKey;
  if (spec.kind === "add") return rv.ansKey && rv.ansKey.result != null ? String(rv.ansKey.result) : "";
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

/* a partner round's scenario and two-class picture, drawn like the screen 5 inheritance scene (no code) */
function pairCtx(ctx) {
  if (!ctx || !(ctx.scene || ctx.classes)) return null;
  var box = el("div.pctx");
  if (ctx.scene) box.appendChild(el("p.scene", { text: ctx.scene }));
  var c = ctx.classes, L = window.__scenelib;
  if (c && L) {
    var items = function (k) { return (k.has || []).map(function (x) { return L.mem1(L.esc(x)); }).join(""); };
    var fig = el("div.fig.scn", { attr: { role: "img", "aria-label": c.link } });
    fig.innerHTML = '<div class="sc inhsc">' + L.cd("class " + L.esc(c.parent.name), items(c.parent)) + '<div class="inh">' + L.esc(c.link) + " \u2191</div>" + L.cd("class " + L.esc(c.child.name), items(c.child)) + "</div>";
    box.appendChild(fig);
  }
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
function learnTry(tr, t, n, onChecked) {
  var box = el("div.blk.try" + (tr.code ? ".codeopts" : "")); box.appendChild(el("div.head", { text: S["learn.head.try"] }));
  var parts = tr.parts || [tr], toldTick = false;
  parts.forEach(function (p, pi) { var pt = el("div.part"); buildTry(pt, p, pi, parts.length > 1 ? S[pi ? "learn.try.partB" : "learn.try.partA"] : ""); box.appendChild(pt); });
  function buildTry(pt, tp, pi, label) {
    clear(pt); if (label) pt.appendChild(el("div.pn", { text: label }));
    if (tp.verbatim) { var vm = /^(\d{4})\s+Q(\S+)$/.exec(tp.verbatim); pt.appendChild(el("p.src", { text: vm ? fmt("learn.try.from", { year: vm[1], label: "Question " + vm[2] }) : tp.verbatim })); }
    pt.appendChild(el("p.stem", { text: tp.stem }));
    if (tp.fig && window.SCENES && SCENES[tp.fig]) { var fg = el("div.fig.scn", { attr: { "data-fig": tp.fig } }); SCENES[tp.fig](fg, 0, { static: true }); pt.appendChild(fg); }
    var hd = (tp.surface && tp.surface.heads) || [S["learn.match.left"], S["learn.match.right"]];
    var sf = Surface(tp.surface, { seed: "try:" + ME.first + ":" + t + ":" + n + (pi ? ":" + pi : ""), leftHead: hd[0], rightHead: hd[1] }); pt.appendChild(sf.el);
    var out = el("div.verdict.hidden"), btn = el("button.btn", { text: S["learn.try.check"], on: { click: check } }), acts = el("div.acts", {}, [btn]);
    pt.appendChild(acts); pt.appendChild(out);
    function check() {
      if (!sf.complete()) { toast(S["try.incomplete"]); return; }
      var k = tp.key, sp = tp.surface, cells = [], rv = {}, right = false, a = "";
      if (sp.kind === "one") { var got = "ABCDEFGH".indexOf(sf.get()); right = got === k.answer; cells = [right ? 1 : 0]; rv.ansKey = letters(k.answer); var optText = Array.isArray(sp.opts[k.answer]) ? sp.opts[k.answer][1] : sp.opts[k.answer]; a = sf.label(rv.ansKey) + " · " + optText; }
      else if (sp.kind === "gaps") { var g = sf.get().split("|"); cells = k.answer.map(function (w, i) { return norm(g[i] || "") === norm(w) ? 1 : 0; }); rv.ansKey = k.answer; a = k.answer.join(", "); right = cells.every(function (c) { return c === 1; }); }
      else if (sp.kind === "tf") { var v = sf.get().split(","); cells = k.answer.map(function (w, i) { return (v[i] || "").toLowerCase() === String(w).toLowerCase() ? 1 : 0; }); rv.ansKey = k.answer; a = (sf.order || []).map(function (i) { return k.answer[i]; }).join(", "); right = cells.every(function (c) { return c === 1; }); }
      else if (sp.kind === "match") { var pr = {}; sf.get().split(",").forEach(function (p) { var mm = /^(\d+)-(\d+)$/.exec(p); if (mm) pr[mm[1]] = parseInt(mm[2], 10); }); cells = k.answer.map(function (r, l) { return pr[l] === r ? 1 : 0; }); rv.ansKey = k.answer.map(function (r, l) { return [l, r]; }); a = k.answer.map(function (r, l) { return sp.left[l] + " is " + sp.right[r]; }).join(". "); right = cells.every(function (c) { return c === 1; }); }
      else if (sp.kind === "list") { var lines = sf.get().split("\n"), used = {}; cells = lines.map(function (ln) { var nl = norm(ln); if (!nl) return 0; if ((k.reject || []).some(function (rj) { return norm(rj) === nl; })) return 0; for (var gi = 0; gi < k.accept.length; gi++) { if (used[gi]) continue; var hit = k.accept[gi].some(function (acc) { var na = norm(acc); return na === nl || (nl.length >= 4 && na.indexOf(nl) !== -1) || (na.length >= 4 && nl.indexOf(na) !== -1); }); if (hit) { used[gi] = 1; return 1; } } return 0; }); var cnt = cells.filter(function (c) { return c === 1; }).length; right = cnt >= (sp.n || k.accept.length); rv.points = k.accept.map(function (gr) { return gr[0]; }); a = rv.points.join(", "); }
      sf.disable(true); sf.verdict({ cells: cells }, rv); btn.disabled = true;
      clear(out).classList.remove("hidden"); out.appendChild(el("p.b" + (right ? ".okline" : ".noline"), { text: right ? S["learn.try.right"] : fmt("learn.try.wrong", { a: a }) }));
      if (tp.why) out.appendChild(el("p.why", { text: fmt("learn.try.why", { why: tp.why }) }));
      if (!toldTick) { toldTick = true; out.appendChild(el("p.small", { text: S["learn.try.ticked"] })); }
      if (!right) acts.appendChild(el("button.btn.quiet", { type: "button", text: S["learn.try.again"], on: { click: function () { buildTry(pt, tp, pi, label); } } }));
      onChecked(right);
    }
  }
  return box;
}
function learnAnim(v) {
  var N = v.steps.length, i = 0, SC = window.SCENES || {};
  var box = el("div.blk.anim", { attr: { "data-scene": v.scene } }); box.appendChild(el("div.head", { text: S["learn.head.watchit"] }));
  if (v.title) box.appendChild(el("h4", { text: v.title })); if (v.lead) box.appendChild(el("p.lead", { html: termHtml(v.lead) }));
  var stage = el("div.stage.scn", { attr: { "data-scene": v.scene, role: "img" } }), cap = el("p.cap", { attr: { "aria-live": "polite" } });
  var back = el("button.btn.sec.back", { type: "button", text: S["learn.anim.back"], on: { click: function () { if (i > 0) { i--; draw(); } } } });
  var next = el("button.btn.next", { type: "button", text: S["learn.anim.next"], on: { click: function () { if (i < N - 1) { i++; draw(); } } } });
  var replay = el("button.btn.quiet.replay", { type: "button", text: S["learn.anim.replay"], on: { click: function () { i = 0; draw(); next.focus(); } } });
  var stepn = el("span.stepn"), dots = el("span.dots", { attr: { "aria-hidden": "true" } }); v.steps.forEach(function () { dots.appendChild(el("i")); });
  var ctl = el("div.ctl", { on: { keydown: function (e) { if (e.key === "ArrowRight" && i < N - 1) { i++; draw(); e.preventDefault(); } else if (e.key === "ArrowLeft" && i > 0) { i--; draw(); e.preventDefault(); } } } }, [back, el("span.stepwrap", {}, [stepn, dots]), next, replay]);
  box.appendChild(stage); box.appendChild(cap); box.appendChild(ctl);
  function draw() {
    if (SC[v.scene]) SC[v.scene](stage, i); else console.error("missing scene " + v.scene);
    cap.textContent = v.steps[i]; stepn.textContent = fmt("learn.anim.step", { i: i + 1, N: N }); stage.setAttribute("aria-label", v.steps[i]);
    Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle("on", k <= i); });
    var was = document.activeElement; back.disabled = i === 0; next.disabled = i === N - 1;
    if (was === next && next.disabled) replay.focus(); if (was === back && back.disabled) next.focus();
  }
  draw(); return box;
}
function learnPlay(pl) {
  var box = el("div.blk.play"); box.appendChild(el("div.head", { text: S["learn.head.play"] }));
  if (pl.title) box.appendChild(el("h4", { text: pl.title })); if (pl.lead) box.appendChild(el("p.lead", { html: termHtml(pl.lead) }));
  var PV = [128, 64, 32, 16, 8, 4, 2, 1];
  function state(on) { return on ? S["play.on"] : S["play.off"]; }
  function den(bits) { var n = 0; bits.forEach(function (b, i) { n += b * PV[i]; }); return n; }
  function hex(n) { var h = n.toString(16).toUpperCase(); return h.length < 2 ? "0" + h : h; }
  function swLabel(i, on, rowName) { return rowName ? fmt("play.adder.bit", { v: PV[i], row: rowName, state: state(on) }) : fmt("play.bits.switch", { v: PV[i], state: state(on) }); }
  function bitRow(bits, onFlip, rowName) { var row = el("div.sws"); bits.forEach(function (b, i) { var btn = el("button.swt", { type: "button", attr: { "aria-pressed": b ? "true" : "false", "aria-label": swLabel(i, b, rowName) }, on: { click: function () { bits[i] = bits[i] ? 0 : 1; btn.setAttribute("aria-pressed", bits[i] ? "true" : "false"); btn.setAttribute("aria-label", swLabel(i, bits[i], rowName)); btn.querySelector(".bitv").textContent = String(bits[i]); onFlip(); } } }, [el("span.plv", { text: String(PV[i]) }), el("span.knob"), el("span.bitv", { text: String(b) })]); row.appendChild(btn); }); row.repaint = function () { [].slice.call(row.querySelectorAll(".swt")).forEach(function (btn, i) { btn.setAttribute("aria-pressed", bits[i] ? "true" : "false"); btn.setAttribute("aria-label", swLabel(i, bits[i], rowName)); btn.querySelector(".bitv").textContent = String(bits[i]); }); }; return row; }
  if (pl.kind === "bits") {
    var bits = [0, 0, 0, 0, 0, 0, 0, 0], show = pl.show || ["den"], read = el("div.readout", { attr: { "aria-live": "polite" } }), hit = el("p.okline.hidden"), withHex = show.indexOf("hex") >= 0;
    if (pl.target) box.appendChild(el("p.target", { text: fmt("play.bits.target", { n: pl.target }) }));
    /* the brackets under the switches: each half is a nibble, the whole row is a byte; on the hex screen each nibble shows its own hex digit */
    var nibs = el("div.nibs", { attr: { "aria-hidden": "true" } }), nibLb = [0, 1].map(function () { var c = el("div.nib"); c.appendChild(el("div.br")); var lb = el("div.lb"); c.appendChild(lb); nibs.appendChild(c); return lb; });
    var byteBar = el("div.bytebar", { attr: { "aria-hidden": "true" } }, [el("div.br"), el("div.lb", { text: S["play.bits.byte"] })]);
    var allBtn = el("button.btn.sec", { type: "button", on: { click: function () { var any = bits.some(function (b) { return b; }); for (var i = 0; i < 8; i++) bits[i] = any ? 0 : 1; row.repaint(); paintBits(); } } });
    function paintBits() { clear(read); var n = den(bits), on = bits.filter(function (b) { return b; }).length; if (show.indexOf("count") >= 0) read.appendChild(el("div", { text: fmt("play.bits.count", { n: on }) })); if (show.indexOf("den") >= 0) read.appendChild(el("div", { text: fmt("play.bits.den", { n: n }) })); if (withHex) read.appendChild(el("div", { text: fmt("play.bits.hex", { h: hex(n) }) }));
      nibLb.forEach(function (lb, k) { var nb = bits.slice(k * 4, k * 4 + 4).join(""); lb.textContent = withHex ? fmt("play.bits.nibhex", { b: nb, h: parseInt(nb, 2).toString(16).toUpperCase() }) : S["play.bits.nib"]; });
      allBtn.textContent = on ? S["play.bits.alloff"] : S["play.bits.allon"]; var ok = !!pl.target && n === pl.target; hit.classList.toggle("hidden", !ok); if (ok) hit.textContent = fmt("play.bits.hit", { n: n }); }
    var row = bitRow(bits, paintBits); box.appendChild(row); box.appendChild(nibs); box.appendChild(byteBar); box.appendChild(read); box.appendChild(hit);
    box.appendChild(el("div.acts", {}, [allBtn]));
    paintBits();
  }
  else if (pl.kind === "ladder") {
    var steps = pl.steps || [], lad = el("div.lad"), lread = el("div.readout", { text: S["play.ladder.tap"], attr: { "aria-live": "polite" } }), sbtns = [];
    steps.forEach(function (st, i) { var b = el("button.ladstep", { type: "button", attr: { "aria-pressed": "false" }, on: { click: function () { sbtns.forEach(function (x, j) { x.classList.toggle("on", j === i); x.setAttribute("aria-pressed", j === i ? "true" : "false"); }); clear(lread); lread.appendChild(el("div", { text: fmt("play.ladder.is", { name: st[0], eq: st[1] }) })); lread.appendChild(el("div.small", { text: fmt("play.ladder.eg", { eg: st[2] }) })); } } }, [el("b", { text: st[0] }), el("span", { text: st[1] })]); b.style.width = (52 + i * 8) + "%"; sbtns.push(b); lad.appendChild(b); });
    box.appendChild(lad); box.appendChild(lread);
  }
  else if (pl.kind === "adder") {
    var ab = String(pl.a || "00000000").split("").map(Number), bb = String(pl.b || "00000000").split("").map(Number), atab2 = el("table.addt.live"), atb2 = el("tbody"), aread = el("div.readout", { attr: { "aria-live": "polite" } }), carryTds = [], resTds = [], ovfTd = el("td.ovf.res");
    var hr0 = el("tr"); hr0.appendChild(el("th", { text: "" })); hr0.appendChild(el("th.ovf", { text: S["add.overflow"] })); PV.forEach(function (v) { hr0.appendChild(el("th.plv", { text: String(v) })); }); var th0 = el("thead"); th0.appendChild(hr0); atab2.appendChild(th0); atab2.appendChild(atb2);
    function mkRow(cls, label, lead, cells) { var tr = el("tr." + cls); tr.appendChild(el("th", { text: label })); tr.appendChild(lead); cells.forEach(function (c) { tr.appendChild(c); }); atb2.appendChild(tr); }
    function bitBtns(bits, rowName) { return PV.map(function (v, i) { var b = el("button.bitb", { type: "button", text: String(bits[i]), attr: { "aria-pressed": bits[i] ? "true" : "false", "aria-label": swLabel(i, bits[i], rowName) }, on: { click: function () { bits[i] = bits[i] ? 0 : 1; b.textContent = String(bits[i]); b.setAttribute("aria-pressed", bits[i] ? "true" : "false"); b.setAttribute("aria-label", swLabel(i, bits[i], rowName)); calc(); } } }); var td = el("td"); td.appendChild(b); return td; }); }
    mkRow("carry", S["play.adder.carry"], el("td"), PV.map(function () { var td = el("td.auto"); carryTds.push(td); return td; }));
    mkRow("opa", S["play.adder.rowa"], el("td"), bitBtns(ab, S["play.adder.rowa"])); mkRow("opb", S["play.adder.rowb"], el("td.plus", { text: "+" }), bitBtns(bb, S["play.adder.rowb"]));
    mkRow("result", S["play.adder.result"], ovfTd, PV.map(function () { var td = el("td.res"); resTds.push(td); return td; }));
    function calc() { var carry = 0, res = [], carries = []; for (var i = 7; i >= 0; i--) { var sm = ab[i] + bb[i] + carry; res[i] = sm % 2; carry = sm > 1 ? 1 : 0; carries[i] = carry; }
      for (var j = 0; j < 8; j++) { var cin = j < 7 ? carries[j + 1] : 0; carryTds[j].textContent = cin ? "1" : ""; carryTds[j].classList.toggle("on", !!cin); resTds[j].textContent = String(res[j]); }
      ovfTd.textContent = carry ? "1" : ""; ovfTd.classList.toggle("on", !!carry);
      var da = den(ab), db = den(bb); clear(aread); aread.appendChild(el("div", { text: fmt("play.adder.sum", { a: da, b: db, c: da + db }) })); aread.appendChild(el("div" + (carry ? ".warn" : ".okline"), { text: carry ? S["play.adder.over"] : S["play.adder.ok"] })); }
    box.appendChild(el("div.addwrap", {}, [atab2])); box.appendChild(aread); calc();
  }
  else if (pl.kind === "chars") {
    var cin2 = el("input.charin", { type: "text", attr: { maxlength: "4", autocomplete: "off", spellcheck: "false", "aria-label": S["play.chars.label"] } }), cread = el("div.readout", { text: S["play.chars.empty"], attr: { "aria-live": "polite" } });
    cin2.addEventListener("input", function () { var chars = Array.from ? Array.from(cin2.value) : cin2.value.split(""), c = chars[0]; if (!c) { cread.textContent = S["play.chars.empty"]; return; } if (chars.length > 1) cin2.value = c;
      var cp = c.codePointAt ? c.codePointAt(0) : c.charCodeAt(0); if (cp < 128) { var b = cp.toString(2); while (b.length < 8) b = "0" + b; cread.textContent = fmt("play.chars.out", { c: c, d: cp, b: b }); } else { var u = cp.toString(16).toUpperCase(); while (u.length < 4) u = "0" + u; cread.textContent = fmt("play.chars.non", { u: "U+" + u }); } });
    box.appendChild(el("label.h", { text: S["play.chars.label"] })); box.appendChild(cin2); box.appendChild(cread);
  }
  else if (pl.kind === "logic") {
    var gates = pl.gates || ["AND", "OR", "XOR", "NOT"], gate = gates[0], sa = 0, sb = 0, grow = el("div.gates"), gbtns = [], lamp = el("div.lamp", { attr: { "aria-live": "polite" } }), rule = el("p.rule"), ltt = el("table.ltt"), lrows = [];
    function out(a, b, g) { return g === "AND" ? (a && b ? 1 : 0) : g === "OR" ? (a || b ? 1 : 0) : g === "XOR" ? (a !== b ? 1 : 0) : (a ? 0 : 1); }
    gates.forEach(function (g) { var b = el("button.gateb", { type: "button", text: g, attr: { "aria-pressed": g === gate ? "true" : "false" }, on: { click: function () { gate = g; gbtns.forEach(function (x, j) { x.setAttribute("aria-pressed", gates[j] === gate ? "true" : "false"); }); buildTable(); paintL(); } } }); gbtns.push(b); grow.appendChild(b); });
    function mkSwitch(name, get, set) { var b = el("button.swt.big", { type: "button", attr: { "aria-pressed": "false" } }, [el("span.plv", { text: name }), el("span.knob"), el("span.bitv", { text: "0" })]); b.addEventListener("click", function () { set(get() ? 0 : 1); paintL(); }); b.paint = function () { var v = get(); b.setAttribute("aria-pressed", v ? "true" : "false"); b.setAttribute("aria-label", fmt("play.logic.sw", { name: name, state: state(v) })); b.querySelector(".bitv").textContent = String(v); }; return b; }
    var swA = mkSwitch(S["play.logic.a"], function () { return sa; }, function (v) { sa = v; }), swB = mkSwitch(S["play.logic.b"], function () { return sb; }, function (v) { sb = v; });
    function buildTable() { clear(ltt); lrows = []; var isNot = gate === "NOT", hr = el("tr"); hr.appendChild(el("th", { text: "A" })); if (!isNot) hr.appendChild(el("th", { text: "B" })); hr.appendChild(el("th.o", { text: S["play.logic.lamp"] })); ltt.appendChild(hr);
      var combos = isNot ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
      combos.forEach(function (cb) { var tr = el("tr"); cb.forEach(function (x) { tr.appendChild(el("td", { text: String(x) })); }); var v = out(cb[0], isNot ? 0 : cb[1], gate); tr.appendChild(el("td.o", { text: String(v) })); tr.setAttribute("aria-label", fmt("play.logic.row", { a: cb[0], b: isNot ? "" : cb[1], v: v })); lrows.push({ tr: tr, cb: cb }); ltt.appendChild(tr); });
      swB.classList.toggle("hidden", isNot); }
    function paintL() { var isNot = gate === "NOT", v = out(sa, sb, gate); swA.paint(); swB.paint(); lamp.classList.toggle("on", !!v); lamp.textContent = fmt("play.logic.out", { v: state(v) }); rule.textContent = S["play.logic.rule." + gate]; lrows.forEach(function (r) { r.tr.classList.toggle("on", r.cb[0] === sa && (isNot || r.cb[1] === sb)); }); }
    box.appendChild(el("div.h", { text: S["play.logic.gate"] })); box.appendChild(grow); box.appendChild(rule);
    box.appendChild(el("div.logicrow", {}, [swA, swB, lamp, ltt])); buildTable(); paintL();
  }
  else if (pl.kind === "prac") {
    /* guided practice (Topic 2 Version 21): every step is on the screen and checked as the pupil goes, so nothing has to be held in the head.
       Steps used: tap the headings that have a 1, type the total, the take-away question at each heading, a nibble to a hex digit, a hex digit to a nibble. */
    var modes = pl.modes || ["b2d"], mi = -1, q = null, ask = el("p.target", { attr: { "aria-live": "polite" } }), steps = el("div.gsteps"), fin = el("div.gfin.hidden", { attr: { "aria-live": "polite" } }), sn = 0, user = false;
    var HD = "0123456789ABCDEF", P4 = [8, 4, 2, 1];
    function rnd(n) { return Math.floor(Math.random() * n); }
    function bin(n, w) { var b = n.toString(2); while (b.length < w) b = "0" + b; return b; }
    function plus(vals) { return vals.join(" + "); }
    function say(host, key, v, cls) { var m = host.querySelector(".gmsg"); if (!m) { m = el("p.gmsg", { attr: { "aria-live": "polite" } }); host.appendChild(m); } m.className = "gmsg" + (cls ? " " + cls : ""); m.textContent = fmt(key, v); return m; }
    function newStep(key, v) { sn++; var st = el("div.gstep"); st.appendChild(el("div.gn", { text: fmt("play.g.step", { n: sn }) })); st.appendChild(el("p.gq", { text: fmt(key, v) })); steps.appendChild(st); if (user && st.scrollIntoView) st.scrollIntoView({ block: "nearest" }); return st; }
    function finish(st) { st.classList.add("done"); [].slice.call(st.querySelectorAll("button,input")).forEach(function (x) { x.disabled = true; }); }
    /* tap each heading that has a 1 under it */
    function tapHeads(st, b, heads, done) {
      var tab = el("div.gtab.c" + heads.length), need = [], got = {}, sum = el("p.gsum");
      heads.forEach(function (v, i) { if (b[i] === "1") need.push(i); var hb = el("button.ghead", { type: "button", text: String(v), attr: { "aria-pressed": "false", "aria-label": fmt("play.g.headlab", { v: v, b: b[i] }) } });
        hb.addEventListener("click", function () { user = true; if (b[i] !== "1") { hb.classList.remove("no"); void hb.offsetWidth; hb.classList.add("no"); say(st, "play.g.zero", { v: v }, "warn"); return; }
          if (got[i]) return; got[i] = 1; hb.classList.add("on"); hb.setAttribute("aria-pressed", "true"); var vals = need.filter(function (k) { return got[k]; }).map(function (k) { return heads[k]; }); sum.textContent = fmt("play.g.tapped", { s: plus(vals) }); say(st, "play.g.tapgood", { v: v }, "");
          if (vals.length === need.length) { var m = st.querySelector(".gmsg"); if (m) m.remove(); done(need.map(function (k) { return heads[k]; })); } });
        tab.appendChild(hb); });
      heads.forEach(function (v, i) { tab.appendChild(el("div.gbit" + (b[i] === "1" ? ".one" : ""), { text: b[i] })); });
      st.appendChild(tab); st.appendChild(sum);
      if (!need.length) { sum.textContent = S["play.g.none"]; setTimeout(function () { done([]); }, 0); }
    }
    /* type the total of the headings tapped */
    function typeTotal(st, vals, n, done) {
      var line = el("div.gadd"), inp = el("input.pracin.gin", { type: "text", attr: { inputmode: "numeric", autocomplete: "off", spellcheck: "false", maxlength: "3", "aria-label": S["play.g.addlabel"] } }), help = el("div.pwork.hidden");
      line.appendChild(el("span", { text: plus(vals) + " =" })); line.appendChild(inp); st.appendChild(line);
      function chk() { user = true; var g = inp.value.trim(); if (!g) { say(st, "play.g.addempty", {}, "warn"); return; }
        if (/^\d+$/.test(g) && parseInt(g, 10) === n) { say(st, "play.g.addright", { s: plus(vals), n: n }, "okline"); done(); return; }
        say(st, "play.g.addwrong", {}, "warn"); clear(help); help.classList.remove("hidden"); var run = vals[0]; for (var k = 1; k < vals.length; k++) { help.appendChild(el("div", { text: fmt("play.g.run", { a: run, b: vals[k], c: run + vals[k] }) })); run += vals[k]; } if (vals.length < 2) help.appendChild(el("div", { text: fmt("play.g.one", { n: n }) })); }
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); chk(); } });
      st.appendChild(el("div.acts", {}, [el("button.btn", { type: "button", text: S["play.prac.check"], on: { click: chk } })])); st.appendChild(help);
      if (user) inp.focus();
    }
    /* denary to binary: can this heading be taken away? */
    function takeAway(st, n, done) {
      var tab = el("div.gtab.c8"), cells = [], left = n, i = 0, qline = el("p.gtake"), leftLine = el("p.gsum"), yn = el("div.acts");
      PV.forEach(function (v) { tab.appendChild(el("div.ghd", { text: String(v) })); }); PV.forEach(function () { var c = el("div.gbit.q", { text: "?" }); cells.push(c); tab.appendChild(c); });
      var yes = el("button.btn.sec", { type: "button", text: S["play.g.yes"] }), no = el("button.btn.sec", { type: "button", text: S["play.g.no"] }); yn.appendChild(yes); yn.appendChild(no);
      function ask1() { cells.forEach(function (c, k) { c.classList.toggle("now", k === i); }); leftLine.textContent = fmt("play.g.left", { left: left }); qline.textContent = fmt("play.g.take", { v: PV[i], left: left }); }
      function answer(sayYes) { user = true; var v = PV[i], fits = v <= left;
        if (sayYes !== fits) { say(st, fits ? "play.g.takebadno" : "play.g.takebadyes", { v: v, left: left }, "warn"); return; }
        if (fits) { say(st, "play.g.takeyes", { v: v, left: left, rest: left - v }, ""); left -= v; cells[i].textContent = "1"; cells[i].classList.add("one"); } else { say(st, "play.g.takeno", { v: v, left: left }, ""); cells[i].textContent = "0"; }
        cells[i].classList.remove("q"); i++; if (i < 8) ask1(); else { cells.forEach(function (c) { c.classList.remove("now"); }); qline.remove(); yn.remove(); leftLine.textContent = fmt("play.g.takedone", { n: n, b: bin(n, 8) }); var m = st.querySelector(".gmsg"); if (m) m.remove(); done(); } }
      yes.addEventListener("click", function () { answer(true); }); no.addEventListener("click", function () { answer(false); });
      st.appendChild(tab); st.appendChild(leftLine); st.appendChild(qline); st.appendChild(yn); ask1();
    }
    /* a nibble's value, then tap its hex digit on the keypad (each key shows what it stands for) */
    function pickHex(st, v, done) {
      st.appendChild(el("p.gq", { text: fmt("play.g.pickhex", { v: v }) })); var keys = el("div.gkeys");
      HD.split("").forEach(function (h, k) { var kb = el("button.gkey", { type: "button", attr: { "aria-label": fmt("play.g.hexkey", { h: h, v: k }) } }, [el("b", { text: h }), el("small", { text: String(k) })]);
        kb.addEventListener("click", function () { user = true; if (k !== v) { kb.classList.remove("no"); void kb.offsetWidth; kb.classList.add("no"); say(st, "play.g.hexbad", { h: h, w: k, v: v }, "warn"); return; } kb.classList.add("on"); say(st, "play.g.hexright", { v: v, h: h }, "okline"); done(h); });
        keys.appendChild(kb); });
      st.appendChild(keys);
    }
    function nibToHex(st, nb, done) { tapHeads(st, nb, P4, function (vals) { var v = parseInt(nb, 2); st.appendChild(el("p.gsum", { text: vals.length ? fmt("play.g.nibval", { s: plus(vals), v: v }) : fmt("play.g.nibzero", {}) })); pickHex(st, v, done); }); }
    /* a hex digit to four bits: switch on 8, 4, 2, 1 to make its value */
    function hexToNib(st, h, done) {
      var v = parseInt(h, 16), nbits = [0, 0, 0, 0], row = el("div.sws.four"), now = el("p.gsum");
      P4.forEach(function (pv, k) { var b = el("button.swt", { type: "button", attr: { "aria-pressed": "false", "aria-label": fmt("play.bits.switch", { v: pv, state: state(0) }) } }, [el("span.plv", { text: String(pv) }), el("span.knob"), el("span.bitv", { text: "0" })]);
        b.addEventListener("click", function () { user = true; nbits[k] = nbits[k] ? 0 : 1; b.setAttribute("aria-pressed", nbits[k] ? "true" : "false"); b.setAttribute("aria-label", fmt("play.bits.switch", { v: pv, state: state(nbits[k]) })); b.querySelector(".bitv").textContent = String(nbits[k]); paintN(); }); row.appendChild(b); });
      function onVals() { return P4.filter(function (pv, k) { return nbits[k]; }); }
      function paintN() { var ov = onVals(), t = ov.reduce(function (a, c) { return a + c; }, 0); now.textContent = ov.length ? fmt("play.g.nibnow", { s: plus(ov), n: t }) : S["play.g.nibnone"]; }
      function chk() { user = true; var t = onVals().reduce(function (a, c) { return a + c; }, 0); if (t !== v) { say(st, "play.g.nibbad", { n: t, v: v }, "warn"); return; } say(st, "play.g.nibright", { h: h, b: nbits.join("") }, "okline"); done(nbits.join("")); }
      st.appendChild(row); st.appendChild(now); st.appendChild(el("div.acts", {}, [el("button.btn", { type: "button", text: S["play.prac.check"], on: { click: chk } })])); paintN();
    }
    function end(key, v) { clear(fin); fin.classList.remove("hidden"); fin.appendChild(el("p.okline", { text: fmt(key, v) })); if (user && fin.scrollIntoView) fin.scrollIntoView({ block: "nearest" }); }
    function newQ() { mi = (mi + 1) % modes.length; var m = modes[mi], hexMode = /h/.test(m), n = hexMode ? 16 + rnd(239) : 1 + rnd(254), b = bin(n, 8), h = hex(n);
      q = { m: m, n: n }; clear(steps); fin.classList.add("hidden"); clear(fin); sn = 0;
      ask.textContent = fmt("play.g.ask." + m, { q: (m === "b2d" || m === "b2h") ? b : (m === "d2b" || m === "d2h") ? String(n) : h });
      if (m === "b2d") { var s1 = newStep("play.g.tap", {}); tapHeads(s1, b, PV, function (vals) { finish(s1); var s2 = newStep("play.g.add", {}); typeTotal(s2, vals, n, function () { finish(s2); end("play.g.done.b2d", { b: b, n: n }); }); }); }
      else if (m === "d2b") { var t1 = newStep("play.g.takeq", { n: n }); takeAway(t1, n, function () { finish(t1); end("play.g.done.d2b", { n: n, b: b }); }); }
      else if (m === "b2h") { var l1 = newStep("play.g.tapnib", { side: S["play.g.leftside"], b: b.slice(0, 4) }); nibToHex(l1, b.slice(0, 4), function (h1) { finish(l1); var l2 = newStep("play.g.tapnib", { side: S["play.g.rightside"], b: b.slice(4) }); nibToHex(l2, b.slice(4), function (h2) { finish(l2); end("play.g.done.b2h", { b: b, h: h1 + h2 }); }); }); }
      else if (m === "h2b") { var k1 = newStep("play.g.makenib", { h: h[0], v: parseInt(h[0], 16) }); hexToNib(k1, h[0], function (n1) { finish(k1); var k2 = newStep("play.g.makenib", { h: h[1], v: parseInt(h[1], 16) }); hexToNib(k2, h[1], function (n2) { finish(k2); end("play.g.done.h2b", { h: h, b: n1 + n2 }); }); }); }
      else if (m === "h2d") { var j1 = newStep("play.g.makenib", { h: h[0], v: parseInt(h[0], 16) }); hexToNib(j1, h[0], function (n1) { finish(j1); var j2 = newStep("play.g.makenib", { h: h[1], v: parseInt(h[1], 16) }); hexToNib(j2, h[1], function (n2) { finish(j2); var j3 = newStep("play.g.tapbyte", { b: n1 + n2 }); tapHeads(j3, n1 + n2, PV, function (vals) { finish(j3); var j4 = newStep("play.g.add", {}); typeTotal(j4, vals, n, function () { finish(j4); var hi = parseInt(h[0], 16), lo = parseInt(h[1], 16); end("play.g.done.h2d", { h: h, n: n, d: h[0], v: hi, p: hi * 16, o: lo }); }); }); }); }); }
      else { var e1 = newStep("play.g.takeq", { n: n }); takeAway(e1, n, function () { finish(e1); var e2 = newStep("play.g.tapnib", { side: S["play.g.leftside"], b: b.slice(0, 4) }); nibToHex(e2, b.slice(0, 4), function (h1) { finish(e2); var e3 = newStep("play.g.tapnib", { side: S["play.g.rightside"], b: b.slice(4) }); nibToHex(e3, b.slice(4), function (h2) { finish(e3); end("play.g.done.d2h", { n: n, b: b, h: h1 + h2 }); }); }); }); }
    }
    box.appendChild(ask); box.appendChild(steps); box.appendChild(fin);
    box.appendChild(el("div.acts.gnext", {}, [el("button.btn.sec", { type: "button", text: S["play.prac.another"], on: { click: function () { user = true; newQ(); var f = steps.querySelector("button"); if (f) f.focus(); } } })]));
    newQ();
  }
  return box;
}
/* the staff view shows which screens a pupil opened, so reading without pressing anything still counts. It never interrupts the pupil. */
function markOpened(t, n) { var rc = ST.recs[t] || (ST.recs[t] = {}), mask = 1 << (n - 1), bits = function () { return parseInt(rc.O || "0", 16) || 0; }; if (bits() & mask) return; rc.O = (bits() | mask).toString(16); api("apiTheory", { op: "learnOpen", t: t, n: n }).catch(function (e) { console.warn(e); rc.O = (bits() & ~mask).toString(16); }); }
/* a real photograph beside the Picture it text, with its caption and the credit its licence asks for */
function picFig(im) { var f = el("figure.picimg"), img = el("img", { attr: { src: BASE + "img/" + im.src, alt: im.alt || "", loading: "lazy" } }); f.appendChild(img); var cap = el("figcaption"); if (im.cap) cap.appendChild(el("span.cp", { text: im.cap })); if (im.credit) { var cr = el("span.cr", { text: im.credit + ", " }); if (im.page) cr.appendChild(el("a", { text: S["learn.pic.via"], attr: { href: im.page, target: "_blank", rel: "noopener" } })); else cr.appendChild(document.createTextNode(S["learn.pic.via"])); cap.appendChild(cr); } f.appendChild(cap); return f; }
function renderLearn(t, n) {
  setBody("is-th");
  Promise.all([refresh(t), loadLearn(t)]).then(function (rr) {
    var L = rr[1], p = prog(t); if (!p.open) return go("#th");
    var N = L.screens.length; if (n < 1 || n > N) return go("#th/" + t);
    var scr = L.screens[n - 1], ticked = !!(p.bits >> (n - 1) & 1);
    $app.appendChild(crumbFrom(S["nav.home"] + " › " + fmt("learn.crumb", { t: t, n: n, N: N }), ["#", "#th/" + t, "#th/" + t + "/learn/1"]));
    var sc = el("section.scr.tw-" + t); var pills = el("div.pills");
    for (var i = 1; i <= N; i++) { var on = i === n, ok = !!(p.bits >> (i - 1) & 1); pills.appendChild(el("a.p" + (on ? ".on" : "") + (ok ? ".ok" : ""), { href: "#th/" + t + "/learn/" + i, text: String(i), attr: { "aria-label": fmt(ok ? "aria.screenTicked" : "aria.screen", { n: i }), "aria-current": on ? "page" : null } })); }
    sc.appendChild(pills); if (scr.kicker) sc.appendChild(el("p.kicker", { text: scr.kicker })); sc.appendChild(el("h2", { text: scr.title })); sc.appendChild(el("p.goal", { text: scr.goal }));
    var saidHead = false, tickDone = ticked;
    function saved(r) { if (!ST.recs[t]) ST.recs[t] = {}; ST.recs[t].L = r.L; ST.recs[t].O = r.O; var pl = pills.children[n - 1]; if (pl) pl.classList.add("ok"); }
    function tick() { if (tickDone) return Promise.resolve(); tickDone = true; return api("apiTheory", { op: "learn", t: t, n: n }).then(saved).catch(function (e) { tickDone = false; console.error(e); toast(S["err.save"]); }); }
    function checked(right) { var first = !tickDone; tickDone = true; return api("apiTheory", { op: "learn", t: t, n: n, tried: 1, right: right ? 1 : 0 }).then(saved).catch(function (e) { console.error(e); if (first) { tickDone = false; toast(S["err.save"]); } }); }
    markOpened(t, n);
    scr.blocks.forEach(function (b) {
      if (b.say) { var sb = el("div.blk.say"); if (!saidHead) { sb.appendChild(el("div.head", { text: S["learn.head.means"] })); saidHead = true; } b.say.forEach(function (ln) { sb.appendChild(el("p", { html: termHtml(ln) })); }); sc.appendChild(sb); }
      else if (b.note) { var nt = b.note, nb = el("div.blk.note" + (nt.kind ? "." + nt.kind : "")); if (nt.title) nb.appendChild(el("h4", { text: nt.title })); arr(nt.lines).forEach(function (ln) { nb.appendChild(el("p", { html: termHtml(ln) })); }); sc.appendChild(nb); }
      else if (b.bridge) { sc.appendChild(el("p.blk.bridge", { html: termHtml(b.bridge) })); }
      else if (b.anim) { sc.appendChild(learnAnim(b.anim)); }
      else if (b.picture) { var pc = b.picture, pb = el("div.blk.pic"); pb.appendChild(el("div.head", { text: S["learn.head.picture"] })); if (pc.title) pb.appendChild(el("h4", { text: pc.title })); if (pc.fig && window.SCENES && SCENES[pc.fig]) { var pf = el("div.fig.scn", { attr: { "data-fig": pc.fig } }); SCENES[pc.fig](pf, 0, { static: true }); pb.appendChild(pf); }
        var ptxt = pb; if (pc.img && pc.img.src) { var pg = el("div.picgrid"); ptxt = el("div.pictxt"); pg.appendChild(ptxt); pg.appendChild(picFig(pc.img)); pb.appendChild(pg); }
        arr(pc.lines).forEach(function (ln) { ptxt.appendChild(el("p", { html: termHtml(ln) })); });
        if (pc.match && pc.match.length) { var tb = el("table.pmatch"); var hr = el("tr"); var hds = pc.heads || [S["learn.match.left"], S["learn.match.right"]]; hr.appendChild(el("th", { text: hds[0] })); hr.appendChild(el("th.arrow", { text: "" })); hr.appendChild(el("th", { text: hds[1] })); tb.appendChild(hr); pc.match.forEach(function (pr) { var tr = el("tr"); tr.appendChild(el("td", { text: pr[0] })); tr.appendChild(el("td.arrow", { text: "→" })); tr.appendChild(el("td", { html: termHtml(pr[1]) })); tb.appendChild(tr); }); pb.appendChild(tb); }
        if (arr(pc.breaks).length) { var bk = el("div.breaks"); bk.appendChild(el("div.h", { text: S["learn.head.breaks"] })); arr(pc.breaks).forEach(function (ln) { bk.appendChild(el("p", { html: termHtml(ln) })); }); pb.appendChild(bk); }
        sc.appendChild(pb); }
      else if (b.code) { var cd = b.code, cbk = el("div.blk.codeblk"); if (cd.title) cbk.appendChild(el("div.head", { text: cd.title })); var box = codeBlock(cd); cbk.appendChild(box);
        if (cd.parts && cd.parts.length) { var cp = el("div.cparts"), partEls = []; function showPart(k) { partEls.forEach(function (e, j) { e.classList.toggle("on", j === k); }); var pt = cd.parts[k]; box.rows.forEach(function (r, i) { r.classList.toggle("hl", i + 1 >= pt[0] && i + 1 <= pt[1]); }); }
          cd.parts.forEach(function (pt, k) { var e = el("button.cpart", { type: "button", on: { click: function () { showPart(k); } } }, [el("span.ln-range", {}, [el("b", { text: pt[1] !== pt[0] ? fmt("code.lines", { a: pt[0], b: pt[1] }) : fmt("code.line", { a: pt[0] }) }), el("span", { text: " " + pt[2] })]), el("span.txt", { html: termHtml(pt[3]) })]); partEls.push(e); cp.appendChild(e); });
          cbk.appendChild(cp); showPart(0); }
        if (arr(cd.names).length) { var cn = el("div.cnames"); cn.appendChild(el("div.h", { text: S["code.namesHead"] })); arr(cd.names).forEach(function (nm) { cn.appendChild(el("div.cname", {}, [el("code", { text: nm[0] }), el("span", { html: termHtml(nm[1]) })])); }); cbk.appendChild(cn); }
        sc.appendChild(cbk); }
      else if (b.exam) { var ex = b.exam, eb = el("div.blk.exam"); eb.appendChild(el("div.head", { text: S["learn.head.exam"] }));
        if (ex.parts) ex.parts.forEach(function (ep) { var pt = el("div.part"); if (ep.head) pt.appendChild(el("h4", { text: ep.head })); if (ep.term) pt.appendChild(el("div.tl", { text: ep.term })); if (ep.say) pt.appendChild(el("p.def", { html: termHtml(ep.say) }));
          if (ep.sample) { var sm = el("div.sample"); ep.sample.forEach(function (r) { sm.appendChild(el("div", {}, [el("span", { html: termHtml(r[0]) }), el("span.tag", { text: r[1] })])); }); pt.appendChild(sm); }
          if (ep.points) { var pu = el("ul"); ep.points.forEach(function (x) { pu.appendChild(el("li", { html: termHtml(x) })); }); pt.appendChild(pu); }
          if (ep.src) pt.appendChild(el("div.src", { text: fmt("learn.exam.src", { src: ep.src }) })); eb.appendChild(pt); });
        else { eb.appendChild(el("div.term", { text: ex.term })); eb.appendChild(el("p.def", { text: ex.say })); if (ex.src) eb.appendChild(el("div.src", { text: fmt("learn.exam.src", { src: ex.src }) })); }
        sc.appendChild(eb); }
      else if (b.watch) { sc.appendChild(el("div.blk.watch", {}, [el("span.ic", { text: "!" }), el("div", {}, [el("div.lab", { text: S["learn.head.watch"] }), el("p", { html: termHtml(b.watch) })])])); }
      else if (b.side) { var sd = b.side, sb2 = el("div.blk.side"); [sd.left, sd.right].forEach(function (col) { if (!col) return; var c = el("div.col"); c.appendChild(el("h4", { text: col.title })); var ul = el("ul"); arr(col.rows).forEach(function (r) { ul.appendChild(el("li", { html: termHtml(r) })); }); c.appendChild(ul); sb2.appendChild(c); }); sc.appendChild(sb2); }
      else if (b.play) { sc.appendChild(learnPlay(b.play)); }
      else if (b.try) { sc.appendChild(learnTry(b.try, t, n, function (right) { checked(right).then(paintFoot); })); }
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
      if (allDone && !RT[st.id]) { var rate = el("div.rate"); rate.appendChild(el("div.h", { text: S["rate.head"] })); var chips = el("div.chips"); ["knew", "half", "not"].forEach(function (r) { chips.appendChild(el("button.chip", { type: "button", text: S["rate." + r], on: { click: function (ev) { return busy(ev.currentTarget, function () { return api("apiTheory", { op: "rate", t: t, stage: st.id, rating: r }).then(function () { if (!ST.recs[t].R) ST.recs[t].R = {}; ST.recs[t].R[st.id] = r; rate.remove(); toast(S["rate.thanks"]); }).catch(function (e) { console.error(e); toast(S["err.save"]); }); }); } } })); }); rate.appendChild(chips); sec.appendChild(rate); }
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
    var isWU = !!part.writeUp;
    if (isWU) { paper.appendChild(el("div.wuintro", {}, [el("p", { text: S["wu.intro"] }), el("p.b", { text: S["wu.step1"] })])); }
    if (sp.how) paper.appendChild(el("p.how", { text: sp.how }));
    var isCode = sp.kind === "code", isWrite = sp.kind === "write" || isCode, isLong = sp.kind === "long", floor = isCode ? part.marks * 2 : isWrite ? part.marks * 4 : isLong ? 60 : 0;
    var draftT = null, draftNote = el("p.small.quiet.hidden", { text: S["part.draftSaved"] });
    var sf = Surface(sp, { keepOrder: true, floor: floor, leftHead: (sp.heads || [])[0], rightHead: (sp.heads || [])[1], onChange: function () { gate(); if (isWrite || isLong) { clearTimeout(draftT); draftT = setTimeout(function () { api("apiTheory", { op: "draft", t: t, qid: qid, text: sf.get() }).then(function () { draftNote.classList.remove("hidden"); }).catch(function () {}); }, 800); } } });
    if ((isWrite || isLong) && r.draft) sf.set(r.draft);
    paper.appendChild(sf.el); if (isWrite || isLong) paper.appendChild(draftNote);
    var btnCheck = el("button.btn", { text: S["part.check"], on: { click: busyOn(check) } }), btnClear = el("button.btn.quiet", { text: S["part.clear"], on: { click: reset } });
    paper.appendChild(el("div.acts", {}, [btnCheck, btnClear])); gate();
    var vbox = el("div.vwrap.hidden"); paper.appendChild(vbox);
    var attemptsLine = el("p.attempts" + (attempts ? "" : ".hidden"), { text: fmt("part.attempts", { n: attempts }) }); paper.appendChild(attemptsLine);
    var wuBox = null; if (isWU) { wuBox = el("section.wubox"); paper.appendChild(wuBox); if (best) step2(); else wuBox.appendChild(el("p.small.quiet", { text: S["wu.locked"] })); }
    var nav = el("div.acts.navrow", {}, nextQ ? [el("a.btn.sec", { href: "#th/" + t + "/pp", text: S["part.back"] }), el("a.btn.gold", { href: "#th/" + t + "/pp/" + nextQ, text: S["part.next"] })] : [el("a.btn.gold", { href: "#th/" + t + "/pp", text: S["part.back"] })]);
    paper.appendChild(nav);
    $app.appendChild(paper);
    function reset() { sf.disable(false); sf.clearMarks(); sf.set(""); clear(vbox).classList.add("hidden"); btnCheck.disabled = false; delete btnCheck.dataset.keepOff; gate(); }
    // write, code and long: Check stays off under the word floor; the floor line under the box says why (A9, A18)
    function gate() { if (btnCheck && floor && !(vbox && vbox.childNodes.length)) btnCheck.disabled = !sf.complete(); }
    function bump(res) { best = res.best; attempts = res.attempts || attempts; attemptsLine.textContent = fmt("part.attempts", { n: attempts }); attemptsLine.classList.toggle("hidden", !attempts); if (ST.recs[t]) { if (!ST.recs[t].Q) ST.recs[t].Q = {}; if (!ST.recs[t].Q[p.round]) ST.recs[t].Q[p.round] = {}; ST.recs[t].Q[p.round][qid] = best; } }
    function msBox(ms) { var b = el("div.msbox"); b.appendChild(el("div.h", { text: S["part.ms"] })); b.appendChild(el("pre", { text: ms || "" })); return b; }
    function check() {
      if (!sf.complete()) { toast(floor ? fmt("part.write.floor", { words: floor }) : S["part.incomplete"]); return; }
      btnCheck.disabled = true; btnCheck.dataset.keepOff = "1";
      var answer = (isWrite || isLong) ? { text: sf.get() } : sf.get();
      return api("apiTheory", { op: "mark", t: t, qid: qid, answer: answer }).then(function (res) {
        bump(res); var J = res.res; clear(vbox).classList.remove("hidden"); sf.disable(true);
        if (isWrite) return writeVerdict(J);
        if (isLong) return longVerdict(J);
        sf.verdict(J, J);
        vbox.appendChild(el("div.verdict" + (J.right ? ".full" : ""), {}, [el("span.score" + (J.right ? ".full" : ""), { text: fmt("part.marks", { m: J.m, x: J.x }) }), J.right ? el("span.fullnote", { text: S["part.full"] }) : null]));
        if (!J.right) { var aw = answerWords(sp, J, sf); if (aw) vbox.appendChild(el("p.ansright", {}, [el("b", { text: fmt("part.right", { a: aw }) })])); }
        if (J.why) vbox.appendChild(el("p.why", { text: fmt("part.why", { why: J.why }) }));
        if (isWU) return step2();   // a six-mark question holds the model answer and mark scheme back until the pupil has written their own
        if (J.model) vbox.appendChild(el("div.modelbox", {}, [el("div.h", { text: S["part.model"] }), el("p", { text: J.model })]));
        vbox.appendChild(msBox(J.ms));
      }).catch(function (e) { console.error(e); btnCheck.disabled = false; delete btnCheck.dataset.keepOff; toast(S["err.server"]); });
    }
    // step 2 of a six-mark question: the pupil writes the answer; it is saved, never marked, and checked by the pupil against CCEA's model answer
    function step2() {
      if (!wuBox || wuBox.getAttribute("data-on")) return; wuBox.setAttribute("data-on", "1"); clear(wuBox);
      var wu = r.writeup || { text: "", ticks: [], shown: 0 }, WFLOOR = 30, saveT = null;
      wuBox.appendChild(el("h3", { text: S["wu.step2"] }));
      wuBox.appendChild(el("div.wunote", {}, [el("b", { text: S["wu.notMarked.b"] }), el("span", { text: " " + S["wu.notMarked"] })]));
      wuBox.appendChild(el("p", { text: S["wu.prompt"] }));
      var ta = el("textarea", { attr: { rows: "10", "aria-label": S["wu.step2"], spellcheck: "true" } }); ta.value = wu.text || "";
      var wc = el("p.small.quiet"), saved = el("p.small.quiet.hidden", { text: S["wu.saved"] });
      wuBox.appendChild(el("div.write", {}, [ta])); wuBox.appendChild(wc); wuBox.appendChild(saved);
      var btnShow = el("button.btn.gold", { text: S["wu.show"], on: { click: busyOn(show) } }); var showRow = el("div.acts", {}, [btnShow]); wuBox.appendChild(showRow);
      var rev = el("div.wurev"); wuBox.appendChild(rev);
      function words() { var v = ta.value.trim(); return v ? v.split(/\s+/).length : 0; }
      function paintWC() { var n = words(); wc.textContent = wu.shown || n >= WFLOOR ? fmt("wu.words", { n: n }) : fmt("wu.floor", { n: WFLOOR, w: n }); btnShow.disabled = n < WFLOOR; }
      function send(extra) { var q = { op: "writeup", t: t, qid: qid, text: ta.value }; Object.keys(extra || {}).forEach(function (k) { q[k] = extra[k]; }); return api("apiTheory", q).then(function (res) { if (res && res.writeup) wu = res.writeup; saved.classList.remove("hidden"); return res; }); }
      ta.addEventListener("input", function () { paintWC(); saved.classList.add("hidden"); clearTimeout(saveT); saveT = setTimeout(function () { send().catch(function () { toast(S["err.server"]); }); }, 1200); });
      function show() { btnShow.disabled = true; btnShow.dataset.keepOff = "1"; clearTimeout(saveT); return send({ shown: 1 }).then(function (res) { wu.shown = 1; paintRev(res.reveal); }).catch(function (e) { console.error(e); btnShow.disabled = false; delete btnShow.dataset.keepOff; toast(S["err.server"]); }); }
      function paintRev(R) {
        if (!R) return; showRow.classList.add("hidden"); paintWC(); clear(rev);
        rev.appendChild(el("div.modelbox", {}, [el("div.h", { text: S["part.model"] }), el("p", { text: R.model || "" })]));
        var pts = R.review || [], ticks = pts.map(function (_, i) { return (wu.ticks || [])[i] ? 1 : 0; }), tk = el("div.ticks.wuticks"), tot = el("p.b");
        tk.appendChild(el("div.gh", { text: S["wu.review.head"] })); tk.appendChild(el("p.small", { text: S["wu.review.note"] }));
        pts.forEach(function (pt, i) { var cb = el("input", { type: "checkbox", checked: !!ticks[i], on: { change: function () { ticks[i] = cb.checked ? 1 : 0; row.classList.toggle("on", cb.checked); paintTot(); send({ ticks: ticks }).catch(function () { toast(S["err.server"]); }); } } }); var row = el("label.tick" + (ticks[i] ? ".on" : ""), {}, [cb, el("span.lab", { text: pt })]); tk.appendChild(row); });
        function paintTot() { tot.textContent = fmt("wu.covered", { m: ticks.reduce(function (a, b) { return a + b; }, 0), x: pts.length }); }
        paintTot(); tk.appendChild(tot); rev.appendChild(tk);
        rev.appendChild(el("p.wuagain", { text: S["wu.again"] }));
        rev.appendChild(msBox(R.ms));
      }
      paintWC(); if (wu.shown && r.reveal) paintRev(r.reveal);
    }
    function tickRow(ptText, auto, on, onToggle) { var cb = el("input", { type: "checkbox", checked: !!on, on: { change: function () { onToggle(cb.checked); } } }); var row = el("label.tick" + (auto ? ".auto" : "") + (on ? ".on" : ""), {}, [cb, el("span.lab", {}, [el("b", { text: S["part.tick.me"] }), el("span", { text: " " + ptText })]), auto ? el("span.hintl", { text: S["part.tick.hint"] }) : null]); cb.addEventListener("change", function () { row.classList.toggle("on", cb.checked); }); return row; }
    function writeVerdict(J) {
      var pts = J.points || [], ticks = pts.map(function (_, i) { return J.auto && J.auto[i] ? 1 : 0; });
      vbox.appendChild(el("div.verdict" + (J.x && J.m === J.x ? ".full" : ""), {}, [el("span.score" + (J.x && J.m === J.x ? ".full" : ""), { text: fmt("part.marks", { m: J.m, x: J.x }) })]));
      var tk = el("div.ticks"); tk.appendChild(el("div.gh", { text: S["part.tick.head"] })); var total = el("p.b");
      pts.forEach(function (pt, i) { tk.appendChild(tickRow(pt, J.auto && J.auto[i], ticks[i], function (v) { ticks[i] = v ? 1 : 0; paintTotal(); })); });
      function paintTotal() { var m = Math.min(J.x, ticks.reduce(function (a, b) { return a + b; }, 0)); total.textContent = fmt("part.tick.total", { m: m, x: J.x }); }
      paintTotal(); tk.appendChild(total);
      var save = el("button.btn.gold", { text: S["part.saveTicks"], on: { click: function (ev) { return busy(ev.currentTarget, function () { save.disabled = true; return api("apiTheory", { op: "mark", t: t, qid: qid, answer: { text: sf.get(), ticks: ticks } }).then(function (res) { bump(res); toast(fmt("part.saved", { m: res.res.m, x: res.res.x })); total.textContent = fmt("part.saved", { m: res.res.m, x: res.res.x }); save.disabled = false; }).catch(function (e) { console.error(e); save.disabled = false; toast(S["err.save"]); }); }); } } });
      tk.appendChild(el("div.acts", {}, [save]));
      if (isCode && J.model) vbox.appendChild(el("div.codecmp", {}, [el("div", {}, [el("div.h", { text: S["part.answer"] }), el("pre.code", { text: sf.get() })]), el("div", {}, [el("div.h", { text: S["part.code.model"] }), el("pre.code.model", { text: J.model })])]));
      vbox.appendChild(tk);
      if (J.why) vbox.appendChild(el("p.why", { text: fmt("part.why", { why: J.why }) }));
      vbox.appendChild(msBox(J.ms));
    }
    function longVerdict(J) {
      var groups = J.bullets || [], ticks = groups.map(function (g, gi) { return g.points.map(function (_, i) { return J.auto && J.auto[gi] && J.auto[gi][i] ? 1 : 0; }); }), pick = null;
      vbox.appendChild(el("div.verdict" + (J.x && J.m === J.x ? ".full" : ""), {}, [el("span.score" + (J.x && J.m === J.x ? ".full" : ""), { text: fmt("part.marks", { m: J.m, x: J.x }) })]));
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
      var save = el("button.btn.gold", { text: S["part.saveTicks"], on: { click: function (ev) { return busy(ev.currentTarget, function () { save.disabled = true; return api("apiTheory", { op: "mark", t: t, qid: qid, answer: { text: sf.get(), ticks: ticks, mark: pick } }).then(function (res) { bump(res); toast(fmt("part.saved", { m: res.res.m, x: res.res.x })); save.disabled = false; }).catch(function (e) { console.error(e); save.disabled = false; toast(S["err.save"]); }); }); } } });
      tk.appendChild(el("div.acts", {}, [save])); vbox.appendChild(tk);
      if (J.why) vbox.appendChild(el("p.why", { text: fmt("part.why", { why: J.why }) }));
      vbox.appendChild(msBox(J.ms));
    }
  }).catch(function (e) { fail(e, "part"); });
}

/* ---------- work it out with a partner ---------- */
var FB = (window.U4_LIVE && window.U4_LIVE.base) || "/fb";
function fbFetch(path, opts) {   // a call that hangs (a laptop waking up, the wifi changing) gives up, so the next try can run
  var ctl = window.AbortController ? new AbortController() : null, to = ctl ? setTimeout(function () { ctl.abort(); }, 15000) : null; if (ctl) opts.signal = ctl.signal;
  return fetch(FB + "/u4/" + path, opts).then(function (r) { if (!r.ok) throw new Error("room " + r.status); return r.json(); }).then(function (v) { clearTimeout(to); return v; }, function (e) { clearTimeout(to); throw e; });
}
function fbGet(path) { return fbFetch(path, { cache: "no-store" }); }
function fbSend(method, path, body) { return fbFetch(path, { method: method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); }
function ansLetter(sf, spec, a) { if (spec.kind === "one" && a) return sf.label(a); return null; }
// An answer written out in words, part by part, so a locked answer reads the same for both partners. null: this kind has no words form.
function answerParts(spec, a, sf) {
  var out = [], k = spec.kind, v;
  if (k === "one") { if (spec.pick || spec.opts.some(function (op) { return Array.isArray(op) && op[2]; })) return null; if (!a) return out; var o = spec.opts.map(function (op, i) { return Array.isArray(op) ? { L: op[0], t: op[1] } : { L: letters(i), t: op }; }).filter(function (x) { return x.L === a; })[0]; out.push({ k: 0, v: sf.label(a) + " · " + (o ? o.t : "") }); return out; }
  if (k === "match") { var pr = {}; String(a || "").split(",").forEach(function (x) { var m = /^(\d+)-(\d+)$/.exec(x); if (m) pr[m[1]] = m[2]; }); spec.left.forEach(function (l, i) { out.push({ k: i, h: l, v: pr[i] != null ? spec.right[pr[i]] : "—" }); }); return out; }
  if (k === "sort") { v = String(a || "").split(","); (sf.order || spec.items.map(function (_, i) { return i; })).forEach(function (ii) { var ci = "ABCDEFGH".indexOf(v[ii] || "?"); out.push({ k: ii, h: spec.items[ii], v: ci >= 0 ? spec.cols[ci] : "—" }); }); return out; }
  if (k === "tf") { v = String(a || "").split(","); (sf.order || spec.rows.map(function (_, i) { return i; })).forEach(function (ri) { out.push({ k: ri, h: spec.rows[ri], v: v[ri] || "—" }); }); return out; }
  return null;
}
// The same answer as something to read. `against`: the answers it is compared with, so the parts that differ stand out.
function answerBlock(spec, a, sf, against) {
  var box = el("div.ansr"), vs = (against || []).filter(function (x) { return x != null; });
  if (spec.kind === "gaps") {
    var mine = String(a || "").split("|"), ths = vs.map(function (x) { return String(x || "").split("|"); }), para = el("p.ansg");
    spec.text.split(/\{(\d+)\}/).forEach(function (bit, i) { if (i % 2 === 0) { if (bit) para.appendChild(document.createTextNode(bit)); return; } var n = parseInt(bit, 10) - 1, w = mine[n] || ""; para.appendChild(el("b" + (ths.some(function (t) { return (t[n] || "") !== w; }) ? ".differs" : ""), { text: w || "___" })); });
    box.appendChild(para); return box;
  }
  var parts = answerParts(spec, a, sf); if (!parts) return null;
  if (!parts.length) { box.appendChild(el("p.ansn", { text: "—" })); return box; }
  var oth = vs.map(function (x) { var m = {}; (answerParts(spec, x, sf) || []).forEach(function (pt) { m[pt.k] = pt.v; }); return m; });
  parts.forEach(function (pt) { var row = el("div.ansl" + (oth.some(function (m) { return m[pt.k] !== pt.v; }) ? ".differs" : "")); if (pt.h) row.appendChild(el("span.q", { text: pt.h })); row.appendChild(el("b", { text: pt.v })); box.appendChild(row); });
  return box;
}
function renderPair(t) {
  setBody("is-pair");
  var timers = [], stopped = false;
  // What this pupil sent waits here until the room has it, so a dropped connection never loses an answer or a message.
  var outbox = [], flushing = null, wakeFn = null, backNotNow = false;
  function flush() { if (flushing) return flushing; if (!outbox.length) return Promise.resolve(); var e = outbox[0]; flushing = fbSend("POST", e.p, { s: e.s, k: e.k, x: e.x, t: e.t }).then(function () { outbox.shift(); flushing = null; return flush(); }).catch(function (e) { console.error(e); flushing = null; if (/room 4(0[0-7]|[1-9]\d)/.test(String(e && e.message)) && !/room 429/.test(String(e.message))) outbox.shift(); }); return flushing; }   // a refusal will never succeed; anything else tries again
  function wake() { if (!stopped && wakeFn && !document.hidden) wakeFn(); }   // back from sleep or a dropped connection: catch up at once
  document.addEventListener("visibilitychange", wake); window.addEventListener("online", wake); window.addEventListener("pageshow", wake);
  function later(ms, fn) { var id = setTimeout(function () { if (!stopped) fn(); }, ms); timers.push(id); return id; }
  active.stop = function () { stopped = true; pollGen++; timers.forEach(function (id) { clearInterval(id); clearTimeout(id); }); };
  // B2: the door asked already (its reply waits in sessionStorage for 10 s): show it. Otherwise the waiting card goes up now and the first ask follows.
  var waitStart = null, wc = null, pollGen = 0, pollLive = -1, lastGood = Date.now(), failShown = false, pre = null;
  try { pre = JSON.parse(sessionStorage.getItem("u4_prejoin_" + t) || "null"); sessionStorage.removeItem("u4_prejoin_" + t); } catch (e) {}
  if (pre && pre.v && Date.now() - pre.at < 10000) paint(pre.v);
  else { waitView(null); pollJoin(0, true); }

  function head(sub) { var h = el("div.pairhead.tw-" + t); h.appendChild(crumbFrom(S["nav.home"] + " › " + topicName(t) + " › " + S["door.pair"], ["#", "#th/" + t])); return h; }
  function offView() { clear($app); $app.appendChild(head()); $app.appendChild(el("div.card.waitcard", {}, [el("h2", { text: S["door.pair"] }), el("p", { text: S["door.pair.off"] }), el("p.small", { text: S["pair.door.notNow"] }), el("div.acts", {}, [el("a.btn.sec", { href: "#th/" + t, text: fmt("nav.backTopic", { t: t }) })])])); }
  // The teacher's switch is off: nothing of the pair is on the screen, and it comes back by itself when the switch goes on.
  function pausedView(v) {
    clear($app); $app.appendChild(head());
    $app.appendChild(el("div.card.waitcard", {}, [el("h2", { text: S["pair.paused.head"] }), el("p", { text: fmt(v.solo ? "pair.paused.saySolo" : v.trio ? "pair.paused.sayTrio" : "pair.paused.say", { round: v.r, R: v.R }) }), el("p.small", { text: S["pair.paused.try"] }), el("div.acts", {}, [el("a.btn.sec", { href: "#th/" + t, text: fmt("nav.backTopic", { t: t }) })])]));
    function look() { return api("apiPair", { op: "join", t: t, look: 1 }).then(function (v2) { if (stopped || v2.state === "paused") return; active.stop(); if (v2.state === "off" || v2.state === "free") { toast(S["pair.newGo.toast"]); go("#th/" + t); return; } stopped = false; timers = []; wakeFn = null; if (v2.pair) sessionStorage.setItem("u4_started_" + v2.pair.pid, "1"); paint(v2); toast(S["pair.paused.back"]); }).catch(function (e) { console.warn(e); }); }
    wakeFn = look; var gen = ++pollGen;
    (function tick() { later(10000, function () { if (gen !== pollGen) return; if (document.hidden) { tick(); return; } look().then(function () { if (gen === pollGen && !stopped) tick(); }); }); })();   // chained, 10 s after each reply
  }
  function paint(v) {
    if (stopped) return;
    if (v.state === "off") return offView();
    if (v.state === "paused") return pausedView(v);
    if (v.state === "waiting") { waitView(v); if (pollLive !== pollGen) pollJoin(2500 + Math.round(Math.random() * 1000)); return; }
    if (v.alone90) toast(S["pair.wait.alone90"]);
    if (v.joined && v.joined.length) toast(fmt("pair.joined.me", { them: joinNames(v.joined) }));
    if (v.told && v.told.kind === "left") toast(fmt("pair.err.left", { them: v.told.them }));
    if (v.told && v.told.kind === "leftTrio") toast(fmt("pair.err.leftTrio", { them: v.told.them }));
    if (v.told && v.told.kind === "dropped") toast(fmt("pair.err.dropped", { them: v.told.them }));
    if (v.told && v.told.kind === "droppedTrio") toast(fmt("pair.err.droppedTrio", { them: v.told.them }));
    return pairView(v.pair, !!v.fresh, !!v.told);
  }

  /* --- waiting room (B1): one ask in flight, the next 2.5-3.5 s after its reply; a lost reply tries again at 4 s,
     and the error card waits for 30 s with no good reply (polling carries on under it) --- */
  function pollJoin(delay, first) {
    var gen = ++pollGen; pollLive = gen;
    function ask() {
      if (stopped || gen !== pollGen) return;
      var q = first ? refresh(t).then(function () { if (!prog(t).open) { pollGen++; go("#th"); return null; } return api("apiPair", { op: "join", t: t }); }) : api("apiPair", { op: "join", t: t });
      q.then(function (v2) {
        if (!v2 || stopped || gen !== pollGen) return;
        first = false; lastGood = Date.now(); failShown = false;
        if (v2.state === "waiting") { waitView(v2); later(2500 + Math.round(Math.random() * 1000), ask); return; }
        active.stop(); stopped = false; timers = []; paint(v2);
      }).catch(function (e) {
        if (stopped || gen !== pollGen) return; console.warn(e);
        if (Date.now() - lastGood > 30000) { if (!failShown) { failShown = true; wc = null; fail(e, "pair"); } }
        else if (wc) wc.retry.classList.remove("hidden");
        later(4000, ask);
      });
    }
    if (delay) later(delay, ask); else ask();
  }
  function waitView(v) {   // v null: painted before the first reply (B2)
    if (!waitStart) waitStart = Date.now();
    if (!wc || !$app.contains(wc.card)) {
      clear($app); $app.appendChild(head());
      wc = { card: el("div.card.waitcard"), big: el("h2"), say: el("p"), retry: el("p.small.quiet.hidden", { text: S["pair.wait.retry"], attr: { role: "status" } }), long: el("p.call.hidden", { text: S["pair.wait.long"] }), acts: el("div.acts") };
      wc.own = el("button.btn.sec.hidden", { text: S["pair.wait.own"], on: { click: function (ev) { return busy(ev.currentTarget, function () { pollGen++; return api("apiPair", { op: "solo", t: t, reason: "chose" }).then(function (v2) { active.stop(); stopped = false; timers = []; paint(v2); }).catch(function (e) { pollJoin(0); throw e; }); }); } } });
      wc.acts.appendChild(wc.own);
      wc.acts.appendChild(el("button.btn.quiet", { text: S["pair.wait.leave"], on: { click: function (ev) { return busy(ev.currentTarget, function () { pollGen++; return api("apiPair", { op: "leave", t: t, reason: "left" }).catch(function (e) { console.warn(e); }).then(function () { active.stop(); go("#th/" + t); }); }); } } }));
      [el("div.spin"), wc.big, wc.say, wc.retry, wc.long, wc.acts].forEach(function (n) { wc.card.appendChild(n); });
      $app.appendChild(wc.card);
    }
    var w = Date.now() - waitStart > 45000, three = v && v.last3;
    wc.big.textContent = !v ? S["pair.wait.openingHead"] : three ? S["pair.wait.trioHead"] : S["pair.wait.head"];
    wc.say.textContent = !v ? fmt("pair.wait.openingSay", { t: t }) : three ? S["pair.wait.trioSay"] : S["pair.wait.say"];
    if (v) wc.retry.classList.add("hidden");
    wc.long.classList.toggle("hidden", !w); wc.own.classList.toggle("hidden", !w);
  }

  /* --- the rounds --- */
  function pairView(P, fresh, told) {
    clear($app); $app.appendChild(head());
    var pid = P.pid, seat = P.seat, me = P.me, them = P.them, trio = P.trio, solo = P.solo, R = P.R, rounds = P.rounds, A = P.A || {}, room = P.room;
    var live = ["A", "B", "C"].slice(0, P.cn.length).filter(function (s) { return P.gone.indexOf(s) === -1; });
    var others = live.filter(function (s) { return s !== seat; });
    var cnOf = function (s) { return P.cn["ABC".indexOf(s)]; };
    if (others.length < 2) trio = false;   // a trio who lost someone works as a pair
    var startedKey = "u4_started_" + pid;
    if (P.done) return finishView(P, { names: P.names || [], m: P.right, R: R, solo: solo, trio: trio });
    var carryKey = "u4_carry_" + pid + "_" + P.carried;
    if (P.carried && !sessionStorage.getItem(carryKey)) {   // an unfinished pair from last lesson: same partner, agreed rounds kept, a fresh chat
      var cc = el("div.card.waitcard"); cc.appendChild(el("h2", { text: S["pair.carry.head"] }));
      cc.appendChild(el("p", { text: fmt(solo ? "pair.carry.saySolo" : trio ? "pair.carry.sayTrio" : "pair.carry.say", { round: P.r, R: R }) }));
      cc.appendChild(el("div.acts", {}, [el("button.btn.big", { text: S["pair.carry.start"], on: { click: function (ev) { return busy(ev.currentTarget, function () { sessionStorage.setItem(carryKey, "1"); sessionStorage.setItem(startedKey, "1"); sessionStorage.setItem("u4_seen_" + pid, "1"); pairView(P, false); }); } } })]));
      $app.appendChild(cc); return;
    }
    if (!sessionStorage.getItem(startedKey) && !(P.r > 1 && !fresh && !told)) {   // a new tab mid-way goes straight back into the rounds; a pupil just told their partner left still gets the card
      var mc = el("div.card.waitcard");
      if (solo) { var w = P.why; mc.appendChild(el("h2", { text: w === "owner" ? S["pair.solo.headOwner"] : w === "chose" ? S["pair.solo.headChose"] : (w === "left" || w === "gone" || w === "room" || w === "dropped") ? S["pair.solo.headLeft"] : S["pair.solo.head"] })); mc.appendChild(el("p", { text: (w === "left" || w === "gone" || w === "room" || w === "dropped") ? S["pair.solo.sayLeft"] : S["pair.solo.say"] })); }
      else { mc.appendChild(el("h2", { text: S["pair.match.head"] })); mc.appendChild(el("p", { text: trio ? fmt("pair.match.trioSay", { me: me, them: others.map(cnOf)[0], them2: others.map(cnOf)[1] }) : fmt("pair.match.say", { me: me, them: others.map(cnOf)[0] }) })); mc.appendChild(el("p.small", { text: S["pair.door.act"] })); }
      mc.appendChild(el("div.acts", {}, [el("button.btn.big", { text: solo ? S["pair.solo.start"] : S["pair.match.start"], on: { click: function (ev) { return busy(ev.currentTarget, function () { sessionStorage.setItem(startedKey, "1"); pairView(P, false); }); } } })]));
      $app.appendChild(mc);
      if (!solo && !trio && room) {   // B3 on the match card: a late pupil may take seat C before the pair starts; the live room says so (no lock)
        var mcLook = function () { if (!document.body.contains(mc)) return; fbGet(room + "/ev.json").then(function (o) {
          var hit = o && Object.keys(o).some(function (k) { var e = o[k]; return e && e.k === "done" && e.x === "joined"; });
          if (!hit) { later(4000, mcLook); return; } if (!document.body.contains(mc)) return;
          return api("apiPair", { op: "join", t: t }).then(function (v2) { if (!document.body.contains(mc)) return; active.stop(); stopped = false; timers = []; paint(v2); if (v2.pair && v2.pair.cn && v2.pair.cn.length > 2) toast(fmt("pair.joined.them", { them: v2.pair.cn[2] })); });
        }).catch(function () { later(4000, mcLook); }); };
        later(4000, mcLook);
      }
      return;
    }
    var r = P.r; if (r > R) { return finishView(P, { names: P.names || [], m: P.right, R: R, solo: solo, trio: trio, unsealed: true }); }
    var round = rounds[r - 1], spec = round.surface, seed = pid + ":" + r;
    var wrap = el("div.pairwrap"); $app.appendChild(wrap);
    var rd = el("section.rd.tw-" + t); wrap.appendChild(rd);
    rd.appendChild(el("div.pill", { text: fmt("pair.round.pill", { round: r, R: R }) }));
    var steps = el("div.steps"), stepEls = [1, 2, 3, 4].map(function (i) { var s = el("div.step", { text: S["pair.step" + i] }); steps.appendChild(s); return s; }); rd.appendChild(steps);
    function setStep(n) { stepEls.forEach(function (s, i) { s.classList.toggle("done", i + 1 < n); s.classList.toggle("on", i + 1 === n); }); }
    var pc = pairCtx(round.context); if (pc) rd.appendChild(pc);
    rd.appendChild(el("p.stem", { text: round.stem }));
    var picks = {}, locks = {}, lastKey = null, myPicked = false, phase = 1, checked = null, changedBy = null;
    var sf = Surface(spec, { seed: seed, keepOrder: !!round.keepOrder, onChange: function () { if (phase >= 2 && !checked) { post("pick", r + ":" + sf.get()); paintCompare(); } } });
    rd.appendChild(sf.el);
    var phaseBox = el("div.phase"); rd.appendChild(phaseBox);
    var cmp = el("div.cmp" + (trio ? ".trio" : "") + ".hidden"); rd.appendChild(cmp);
    var strip = el("div.vstrip.hidden"); rd.appendChild(strip);
    var nextBox = el("div.acts.hidden"); rd.appendChild(nextBox);
    var banner = el("div.banner.bad.hidden"); wrap.insertBefore(banner, rd);
    var backBar = el("div.banner.backbar.hidden"); wrap.insertBefore(backBar, rd);
    // chat
    var chat = el("aside.chat" + (solo ? ".off" : "")); wrap.appendChild(chat);
    var ch = el("div.ch"); ch.appendChild(el("h3", { text: S["pair.chat.title"] }));
    ch.appendChild(el("div.cn", { text: solo ? "" : trio ? fmt("pair.cn.trio", { me: me, them: cnOf(others[0]), them2: cnOf(others[1]) }) : fmt("pair.cn.pair", { me: me, them: cnOf(others[0]) }) }));
    chat.appendChild(ch);
    var lines = el("div.lines"); chat.appendChild(lines);
    var quick = el("div.quick"); chat.appendChild(quick);
    var form = el("form"); var inp = el("input", { type: "text", maxlength: 240, placeholder: S["pair.chat.placeholder"], attr: { "aria-label": S["pair.chat.title"] } }); var sendBtn = el("button.btn", { type: "submit", text: S["pair.chat.send"] }); form.appendChild(inp); form.appendChild(sendBtn); chat.appendChild(form);
    var lastSent = 0, chatClosed = false;
    form.addEventListener("submit", function (e) { e.preventDefault(); var txt = inp.value.trim(); if (!txt || chatClosed || solo) return; busy(sendBtn, function () { return say(txt); }); });
    function say(txt) { if (Date.now() - lastSent < 1000) { toast(S["pair.chat.tooFast"]); return; } if (BANNED.some(function (rx) { return rx.test(txt); })) { toast(S["pair.chat.banned"]); return; } if (nameHit(txt, P.nh)) { toast(S["pair.chat.name"]); return; } lastSent = Date.now(); inp.value = ""; return post("msg", txt.slice(0, 240)); }
    function addLine(s, txt, sys) { var m = el("div.msg" + (sys ? ".sys" : s === seat ? ".me" : "")); if (!sys) m.appendChild(el("b", { text: s === seat ? S["pair.chat.you"] : cnOf(s) })); m.appendChild(el("span", { text: txt })); lines.appendChild(m); lines.scrollTop = lines.scrollHeight; }
    function paintQuick() { clear(quick); if (solo || chatClosed) return; var ph = phase === 1 ? "1" : phase === 4 ? "4" : "2"; var cs = (round.chips && round.chips[ph]) || []; if (!cs.length) return; quick.appendChild(el("div.h", { text: S["pair.chat.chips"] })); cs.forEach(function (c) { quick.appendChild(el("button.chip", { type: "button", text: c, on: { click: function (ev) { return busy(ev.currentTarget, function () { return say(c); }); } } })); }); }
    function closeChat(msg) { chatClosed = true; chat.classList.add("off"); inp.disabled = true; sendBtn.disabled = true; clear(quick); chat.appendChild(el("p.small", { text: msg })); }
    if (solo) chat.appendChild(el("p.small", { text: S["pair.chat.off"] }));
    // posting
    function post(k, x) { if (solo) return Promise.resolve(); outbox.push({ p: room + "/ev.json", s: seat, k: k, x: String(x).slice(0, 240), t: Date.now() }); return flush(); }
    // phase painting
    function paintPhase() {
      clear(phaseBox); paintQuick();
      if (checked) { setStep(5); return; }
      if (phase === 1) { setStep(1); sf.disable(myPicked);
        if (!myPicked) phaseBox.appendChild(el("div.acts", {}, [el("button.btn", { text: solo ? S["learn.try.check"] : S["pair.lockOwn"], on: { click: busyOn(lockOwn) } })]));
        else { var waitingOn = others.filter(function (s) { return !picks[s]; }).map(cnOf); phaseBox.appendChild(el("p.say.waiting", { text: waitingOn.length > 1 ? fmt("pair.waitingFor2", { them: waitingOn[0], them2: waitingOn[1] }) : fmt("pair.waitingFor", { them: waitingOn[0] || "" }) })); }
        return; }
      if (phase === 2) { setStep(2); sf.disable(false); stepEls[2].classList.add("on"); paintCompare(); var mine = sf.get(), okAll = others.every(function (s) { return picks[s] === mine; });
        var acts = el("div.acts"); var L = ansLetter(sf, spec, mine);
        acts.appendChild(el("button.btn.gold", { text: L ? fmt("pair.lockPair", { letter: L }) : S["pair.lockPairAny"], on: { click: busyOn(lockPair) } }));
        if (!okAll) { others.forEach(function (s) { if (picks[s] && picks[s] !== mine) acts.appendChild(el("button.btn.sec", { text: fmt("pair.useTheirs", { them: cnOf(s) }), on: { click: function (ev) { return busy(ev.currentTarget, function () { sf.set(picks[s]); return post("pick", r + ":" + picks[s]); paintPhase(); }); } } })); }); }
        if (myOwn != null && mine !== myOwn) acts.appendChild(el("button.btn.quiet", { text: S["pair.useMine"], on: { click: function (ev) { return busy(ev.currentTarget, function () { sf.set(myOwn); return post("pick", r + ":" + myOwn); paintPhase(); }); } } }));
        phaseBox.appendChild(acts); return; }
      if (phase === 4) { setStep(4); sf.disable(true); paintCompare(); var myLock = locks[seat];
        var pending = others.filter(function (s) { return locks[s] !== myLock; });
        if (!pending.length) return; // agreed → check runs
        var otherLocks = others.filter(function (s) { return locks[s] && locks[s] !== myLock; });
        if (otherLocks.length) { var s0 = otherLocks[0], L0 = ansLetter(sf, spec, locks[s0]); phaseBox.appendChild(el("p.say", { text: L0 ? fmt("pair.wants", { them: cnOf(s0), letter: L0 }) : fmt("pair.wantsAny", { them: cnOf(s0) }) }));
          phaseBox.appendChild(el("div.acts", {}, [el("button.btn.gold", { text: L0 ? fmt("pair.agree", { letter: L0 }) : S["pair.agreeAny"], on: { click: function (ev) { return busy(ev.currentTarget, function () { sf.set(locks[s0]); locks[seat] = locks[s0]; var w = post("lock", r + ":" + locks[s0]); settle(); return w; }); } } }), el("button.btn.sec", { text: S["pair.notYet"], on: { click: function (ev) { return busy(ev.currentTarget, function () { return say(S["pair.notYetSay"]); }); } } })].concat(myLock ? [el("button.btn.quiet", { text: S["pair.unlock"], on: { click: busyOn(unlockMine) } })] : []))); }   // both locked, different answers: either can take theirs back
        else { var names = pending.map(cnOf); phaseBox.appendChild(el("p.say.waiting", { text: names.length > 1 ? fmt("pair.locked2", { them: names[0], them2: names[1] }) : fmt("pair.locked", { them: names[0] }) }));
          phaseBox.appendChild(el("div.acts", {}, [el("button.btn.quiet", { text: S["pair.unlock"], on: { click: busyOn(unlockMine) } })])); }
        return; }
    }
    var myOwn = null, theirSf = {};
    function paintCompare() {
      if (solo || phase < 2 || checked) { cmp.classList.add("hidden"); return; }   // once the pair has its result there is nothing left to compare
      cmp.classList.remove("hidden"); clear(cmp); var mine = sf.get();
      var col = el("div.col.me"); col.appendChild(el("div.h", { text: S["pair.cmp.you"] })); col.appendChild(answerBlock(spec, mine, sf, others.map(function (s) { return picks[s] == null ? null : picks[s]; })) || el("p.answ", { text: mine || "—" })); cmp.appendChild(col);
      others.forEach(function (s) { var c = el("div.col"); c.appendChild(el("div.h", { text: fmt("pair.cmp.them", { them: cnOf(s) }) })); var said = answerBlock(spec, picks[s] || "", sf, [mine]); if (said) c.appendChild(said); else { var ts = Surface(spec, { seed: seed, keepOrder: !!round.keepOrder }); if (picks[s]) ts.set(picks[s]); ts.disable(true); c.appendChild(ts.el); } if (changedBy === s) c.appendChild(el("p.diffmark", { text: fmt("pair.changed", { them: cnOf(s) }) })); cmp.appendChild(c); });
      var same = others.every(function (s) { return picks[s] === mine; }), L = ansLetter(sf, spec, mine), txt;
      if (same) txt = trio ? (L ? fmt("pair.same3", { letter: L }) : S["pair.same3Any"]) : (L ? fmt("pair.same", { letter: L }) : S["pair.sameAny"]);
      else if (trio) txt = S["pair.diff3"];
      else { var s1 = others[0], L2 = ansLetter(sf, spec, picks[s1]); txt = L && L2 ? fmt("pair.diff", { letter: L, them: cnOf(s1), letter2: L2 }) : S["pair.diffAny"]; }
      cmp.appendChild(el("p.b.cmpline", { text: txt }));
    }
    function lockOwn() { if (!sf.complete()) { toast(S["try.incomplete"]); return; } myPicked = true; myOwn = sf.get(); picks[seat] = myOwn; if (solo) { locks[seat] = myOwn; return settle(); } var w = post("pick", r + ":" + myOwn).then(function () { advance(); paintPhase(); }); paintPhase(); return w; }
    function unlockMine() { locks[seat] = null; phase = others.some(function (s) { return locks[s]; }) ? 4 : 2; var w = post("lock", r + ":"); paintPhase(); return w; }   // a partner still locked keeps me on Agree
    function lockPair() { var a = sf.get(); locks[seat] = a; phase = 4; var w = post("lock", r + ":" + a).then(settle); paintPhase(); return w; }
    function advance() { if (phase === 1 && myPicked && others.every(function (s) { return picks[s]; })) { phase = others.some(function (s) { return locks[s]; }) ? 4 : 2; addLine(null, S["pair.allAnswered"], true); paintPhase(); } }
    var settling = false;
    function settle() { if (checked || settling) return; var myLock = locks[seat]; if (!myLock) return; if (!others.every(function (s) { return locks[s] === myLock; })) { paintPhase(); return; } return runCheck(myLock); }
    function runCheck(ans) { settling = true;
      return api("apiPair", { op: "check", t: t, pid: pid, r: r, ans: ans }).then(function (res) { if (res.state === "ended") { settling = false; endedGo(); return; } if (res.state === "paused") { settling = false; reenter(false); return; } checked = res; A[r] = { a: res.a, ok: res.right }; if (res.a && res.a !== sf.get()) sf.set(res.a); sf.disable(true); sf.verdict(res, res); cmp.classList.add("hidden"); strip.classList.remove("hidden"); strip.classList.add(res.right ? "ok" : "no"); clear(strip);
        strip.appendChild(el("span.ic", { text: res.right ? "✓" : "✗" })); var L = ansLetter(sf, spec, res.keyShown && spec.kind === "one" ? res.keyShown : null);
        strip.appendChild(el("div", {}, [el("div.b", { text: res.right ? (solo ? S["pair.rightSolo"] : trio ? S["pair.rightTrio"] : S["pair.right"]) : (L ? fmt("pair.wrong", { letter: L }) : S["pair.wrongAny"]) }), res.why ? el("div.why", { text: fmt("pair.why", { why: res.why }) }) : null]));
        if (solo) strip.appendChild(el("div.small", { text: S["pair.soloStrip"] }));
        if (!solo) addLine(null, fmt(res.right ? "pair.chat.lockedRight" : "pair.chat.lockedWrong", { r: r }), true);
        clear(nextBox).classList.remove("hidden");
        if (r < R) nextBox.appendChild(el("button.btn.big", { text: fmt("pair.nextRound", { round: r + 1 }), on: { click: function (ev) { return busy(ev.currentTarget, function () { P.r = r + 1; P.A = A; P.right = Object.keys(A).filter(function (k) { return A[k].ok; }).length; stopRound(); pairView(P, false); }); } } }));
        else nextBox.appendChild(el("button.btn.big.gold", { text: S["pair.finish.go"], on: { click: function (ev) { return busy(ev.currentTarget, function () { return api("apiPair", { op: "finish", t: t, pid: pid }).then(function (f) { if (f.state === "ended") { endedGo(); return; } if (f.state === "paused") { reenter(false); return; } if (!solo) post("done", "10"); stopRound(); finishView(P, f); }).catch(function (e) { fail(e, "pair"); }); }); } } }));
        paintPhase(); settling = false;
      }).catch(function (e) { settling = false; console.error(e); toast(S["err.server"]); later(3000, settle); });
    }
    function paintCompareIfOn() { if (phase >= 2 && !checked) { paintCompare(); if (phase === 2) paintPhase(); } }
    // events
    function handle(ev) {
      if (!ev || !ev.k) return; var s = ev.s; var m = /^(\d+):([\s\S]*)$/.exec(ev.x || "");
      if (ev.k === "msg") { var mk = s + ":" + ev.t; if (msgSeen[mk]) return; msgSeen[mk] = 1; addLine(s, ev.x, false); return; }   // sent twice if the first reply was lost
      if (ev.k === "done" && ev.x === "joined") { if (s !== seat && P.cn.length < 3 && !ended) { stopRound(); active.stop(); api("apiPair", { op: "join", t: t }).then(function (v2) { intoView(v2, false); if (v2.pair && v2.pair.cn && v2.pair.cn.length > 2) toast(fmt("pair.joined.them", { them: v2.pair.cn[2] })); }).catch(function (e) { fail(e, "pair"); }); } return; }   // B3: a late pupil took seat C: fetch the three and say so
      if (ev.k === "done") { var gs = ev.x === "left" ? s : ((/^gone:([ABC])$/.exec(ev.x) || [])[1] || null); if (gs && gs !== seat && others.indexOf(gs) !== -1) dropSeat(gs, ev.x !== "left"); return; }
      if (!m || parseInt(m[1], 10) !== r) return;
      if (ev.k === "pick") { if (s !== seat) { var was = picks[s]; picks[s] = m[2]; if (phase >= 2 && was && was !== m[2]) changedBy = s; else if (phase >= 2) changedBy = null; } else if (!picks[s]) { picks[s] = m[2]; myPicked = true; myOwn = m[2]; sf.set(m[2]); } advance(); paintCompareIfOn(); if (phase === 4) paintPhase(); return; }
      if (ev.k === "lock") {
        if (!m[2]) { locks[s] = null; if (phase === 4 && !locks[seat] && !others.some(function (o) { return locks[o]; })) phase = 2; }          // an unlock (D-UNLOCK): back to compare unless I hold a lock
        else { locks[s] = m[2]; if (s !== seat && !picks[s]) picks[s] = m[2]; if (s === seat && phase < 4) { phase = 4; sf.set(m[2]); } else if (s !== seat) { advance(); if (phase === 2) phase = 4; } }   // a partner lock pulls me to Agree; it also counts as their answer
        if (phase >= 2) { paintPhase(); settle(); } return; }
    }
    var roundTimers = [], goneSeat = null, roomBad = false, roomFails = 0, roomFailAt = null, beat = {}, seenAt = {}, started = Date.now(), ended = false, doneKeys = {}, msgSeen = {};
    function stopRound() { ended = true; wakeFn = null; roundTimers.forEach(function (id) { clearInterval(id); clearTimeout(id); }); roundTimers = []; }
    function rEvery(ms, fn) { var k = roundTimers.length; roundTimers.push(0); (function tick() { roundTimers[k] = setTimeout(function () { if (stopped || ended) return; var p; try { p = fn(); } catch (e) { console.error(e); } Promise.resolve(p).catch(function () {}).then(function () { if (!stopped && !ended) tick(); }); }, ms); })(); }   // chained (B1): the next is set once this one has answered
    function eat(o) { if (!o || ended) return; Object.keys(o).sort().forEach(function (k) { if (doneKeys[k]) return; doneKeys[k] = 1; if (!lastKey || k > lastKey) lastKey = k; handle(o[k]); }); }
    function pollEv() { var q = room + "/ev.json?orderBy=%22$key%22" + (lastKey ? "&startAt=%22" + lastKey + "%22" : ""); return fbGet(q).then(function (o) { roomFails = 0; roomFailAt = null; if (roomBad) { roomBad = false; paintBanner(); } eat(o); }).catch(function () { roomFails++; if (!roomFailAt) roomFailAt = Date.now(); if (Date.now() - roomFailAt > 10000 && !roomBad) { roomBad = true; paintBanner(); } }); }
    function heart() { fbSend("PUT", room + "/p/" + seat + ".json", Date.now()).catch(function () {}); }
    // Is a partner still there? Only a heartbeat that CHANGES counts, timed on this computer's own clock, and only when the room answered.
    function checkBeat() { fbGet(room + "/p.json").then(function (pp) { if (ended) return; pp = pp || {}; others.slice().forEach(function (s) { if (pp[s] && pp[s] !== beat[s]) { beat[s] = pp[s]; seenAt[s] = Date.now(); if (goneSeat === s) backAgain(s); } if (Date.now() - (seenAt[s] || started) > GONE_MS) onGone(s, false); }); }).catch(function () {}); }
    function resync() { if (ended || solo) return; heart(); checkBeat(); flush(); fbGet(room + "/ev.json").then(function (o) { if (roomBad) { roomBad = false; roomFailAt = null; paintBanner(); } eat(o); }).catch(function () {}); }   // the whole log again, in case a read was lost
    function paintBanner() { clear(banner); var show = roomBad || !!goneSeat; banner.classList.toggle("hidden", !show); if (!show) return;
      if (roomBad) { banner.appendChild(el("span", { text: S["pair.err.room"] })); banner.appendChild(el("button.btn.sec", { text: S["pair.err.roomBtn"], on: { click: function (ev) { return busy(ev.currentTarget, function () { return leaveTo("room"); }); } } })); return; }
      var s = goneSeat, three = others.length >= 2;
      banner.appendChild(el("span", { text: fmt(three ? "pair.err.gone3" : "pair.err.gone", { them: cnOf(s) }) }));
      banner.appendChild(el("button.btn.sec", { text: three ? fmt("pair.err.gone3Btn", { them: cnOf(s) }) : S["pair.err.goneBtn"], on: { click: function (ev) { return busy(ev.currentTarget, function () { if (!three) return leaveTo("gone"); return api("apiPair", { op: "drop", t: t, pid: pid, seat: s }).then(function (res) { if (res.state === "ended") { endedGo(); return; } if (res.state === "paused") { reenter(false); return; } post("done", "gone:" + s); dropSeat(s, true); }).catch(function (e) { fail(e, "pair"); }); }); } } })); }
    // A seat that has gone or left (D-DROP): a pair becomes solo for the one who stays, a trio carries on as a pair.
    function dropSeat(gs, dropped) { others = others.filter(function (o) { return o !== gs; }); if (goneSeat === gs) goneSeat = null; paintBanner();
      if (!others.length) { toast(fmt("pair.err.left", { them: cnOf(gs) })); leaveTo("gone"); return; }
      toast(fmt(dropped ? "pair.err.droppedTrio" : "pair.err.leftTrio", { them: cnOf(gs) })); trio = false; cmp.classList.remove("trio"); advance(); paintPhase(); settle(); }
    function onGone(s, silent) { if (goneSeat || checked && r === R) return; if (silent) { dropSeat(s, true); return; } goneSeat = s; paintBanner(); }
    function backAgain(s) { goneSeat = null; paintBanner(); var txt = fmt("pair.err.back", { them: cnOf(s) }); addLine(null, txt, true); toast(txt); resync(); }
    function leaveTo(reason) { stopRound(); active.stop(); return api("apiPair", { op: "leave", t: t, pid: pid, reason: reason }).then(function (v2) { if (v2.state === "ended") { endedGo(); return; } stopped = false; timers = []; if (v2.state === "paused") { paint(v2); return; } if (!solo) post("done", "left"); sessionStorage.setItem("u4_started_" + v2.pair.pid, "1"); paint(v2); toast(S["pair.err.carryOn"]); }).catch(function (e) { fail(e, "pair"); }); }
    // The teacher started a new partner go: this run is over and saved, so back to the door, where the new go starts.
    function endedGo() { stopRound(); active.stop(); outbox = []; toast(S["pair.newGo.toast"]); go("#th/" + t); }
    // Go in again from the server's word: a new room, a pair put back together, or left on your own.
    function reenter(sayBack) { stopRound(); active.stop(); outbox = []; api("apiPair", { op: "join", t: t }).then(function (v2) { intoView(v2, sayBack); }).catch(function (e) { fail(e, "pair"); }); }
    function intoView(v2, sayBack) { stopped = false; timers = []; if (v2.pair) { sessionStorage.setItem("u4_started_" + v2.pair.pid, "1"); if (sayBack) sessionStorage.setItem("u4_seen_" + v2.pair.pid, "1"); } paint(v2); if (sayBack && v2.pair && v2.pair.them.length) toast(fmt("pair.back.done", { them: v2.pair.them.join(" " + S["pair.and"] + " "), round: v2.pair.r })); }
    // The way back: on your own after someone left, you can ask to work with them again; both have to want it.
    function paintBack() { clear(backBar); var b = P.back, show = !!b && (!b.live || (b.theyAsked && !backNotNow)); backBar.classList.toggle("hidden", !show); if (!show) return;
      var them = b.names.join(" " + S["pair.and"] + " ");
      if (b.asked) { backBar.appendChild(el("span", { text: fmt("pair.back.asked", { them: them }) })); return; }
      var ask = b.theyAsked && !backNotNow; backBar.appendChild(el("span", { text: fmt(ask ? "pair.back.they" : "pair.back.say", { them: them }) }));
      var go = el("button.btn" + (ask ? "" : ".sec"), { text: fmt("pair.back.btn", { them: them }), on: { click: function (ev) { return busy(ev.currentTarget, function () { go.disabled = true; return askBack(function () { go.disabled = false; }); }); } } }); backBar.appendChild(go);
      if (ask) backBar.appendChild(el("button.btn.quiet", { text: S["pair.back.not"], on: { click: function () { backNotNow = true; paintBack(); } } })); }
    function askBack(onFail) { return api("apiPair", { op: "back", t: t, pid: pid }).then(function (v2) { if (ended) return; if (v2.state === "ended") { endedGo(); return; } if (v2.state === "paused") { reenter(false); return; } if (v2.reunited) { stopRound(); active.stop(); outbox = []; intoView(v2, true); return; } P.back = v2.pair ? v2.pair.back : null; paintBack(); }).catch(function (e) { console.error(e); onFail(); toast(S["err.server"]); }); }
    if (!solo) {
      rEvery(4000, heart);
      rEvery(4000, checkBeat);
      rEvery(1000, pollEv);
      rEvery(3000, flush);
      rEvery(10000, resync);
      wakeFn = resync;
      rEvery(8000, function () { return api("apiPair", { op: "status", t: t, pid: pid }).then(function (st) { if (ended) return;
        if (st.ended) { endedGo(); return; }
        if (st.pairOn === false && !st.done) { reenter(false); return; }   // the teacher has paused it: this tab goes to the paused card
        if (st.moved || (st.gone || []).indexOf(seat) !== -1 || st.dissolved) { reenter(false); return; }
        if (st.room && st.room !== room) { var was = others.length; stopRound(); active.stop(); outbox = []; api("apiPair", { op: "join", t: t }).then(function (v2) { intoView(v2, !!(v2.pair && v2.pair.them.length > was)); }).catch(function (e) { fail(e, "pair"); }); return; }
        P.back = st.back; paintBack();
        if (st.r > r && !checked && !settling) { runCheck(locks[seat] || sf.get() || ""); return; }   // the other side has the verdict already: never sit waiting for it
        (st.gone || []).forEach(function (gs) { if (others.indexOf(gs) !== -1) dropSeat(gs, (st.goneWhy || {})[gs] === "dropped"); }); }).catch(function () {}); });
      heart();
      // rebuild from the whole log once, then stream
      fbGet(room + "/ev.json").then(function (o) { var any = !!o && Object.keys(o).length > 0; eat(o); if (!fresh && !sessionStorage.getItem("u4_seen_" + pid) && (r > 1 || any)) toast(fmt("pair.resume", { round: r, R: R })); sessionStorage.setItem("u4_seen_" + pid, "1"); paintPhase(); }).catch(function () { roomFailAt = Date.now() - 10001; roomBad = true; paintBanner(); paintPhase(); });
    } else {
      paintPhase();
      var soloStatus = function () { return api("apiPair", { op: "status", t: t, pid: pid }).then(function (st) { if (ended) return; if (st.ended) { endedGo(); return; } if (st.pairOn === false && !st.done) { reenter(false); return; } if (st.moved) { reenter(true); return; } P.back = st.back; paintBack(); }).catch(function () {}); }; rEvery(8000, soloStatus); wakeFn = soloStatus;
    }
    paintBack();
    setStep(1);
  }
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
  var t = parseInt(sessionStorage.getItem("u4_staff_t") || "1", 10) || 1, timer = null, armed = null, armedGo = null;
  active.stop = function () { clearInterval(timer); clearTimeout(armed); clearTimeout(armedGo); };
  (LIVE ? Promise.resolve() : refresh(t)).then(function () {
    if (!LIVE && !ME.owner) return go("#");
    if (!LIVE) { $app.appendChild(crumbFrom(S["nav.home"] + " › " + S["staff.th.tab"], ["#"])); $app.appendChild(el("h1", { text: S["staff.th.tab"] + " · " + S["th.crumb.home"] })); }
    var chips = el("div.chips"); $app.appendChild(el("p.small", { text: S["staff.th.pick"] })); $app.appendChild(chips);
    var body = el("div.staffbody"); $app.appendChild(body);
    function paintChips() { clear(chips); for (var i = 1; i <= 7; i++) (function (i) { chips.appendChild(el("button.tchip.tw-" + i + (i === t ? ".on" : ""), { type: "button", text: fmt("staff.th.chip", { t: i, name: topicName(i) }), on: { click: function (ev) { return busy(ev.currentTarget, function () { t = i; sessionStorage.setItem("u4_staff_t", String(t)); paintChips(); return load(); }); } } })); })(i); }
    // Apps Script replies can take seconds. Only the newest thing she asked for may paint, a name says at once that it is opening, and the fuller view starts from the top.
    var lastAsk = 0, listTop = 0;
    function scrollBox() { for (var n = body.parentElement; n && n !== document.body; n = n.parentElement) if (/auto|scroll/.test(getComputedStyle(n).overflowY)) return n; return document.scrollingElement || document.documentElement; }
    function opening(text) { var box = scrollBox(); listTop = box.scrollTop; clear(body); body.appendChild(el("p.sub.drillwait", { text: text })); box.scrollTop = 0; return ++lastAsk; }
    function backBtn() { var b = el("button.btn.sec", { type: "button", text: S["staff.th.back"], on: { click: function (ev) { return busy(ev.currentTarget, function () { var y = listTop; return load(function () { scrollBox().scrollTop = y; }); }); } } }); return b; }
    function load(after) { var my = ++lastAsk; return api("apiStaff", { op: "theory", t: t }).then(function (d) { if (my !== lastAsk) return; paintTopic(d); if (typeof after === "function") after(); }).catch(function (e) { fail(e, "staff"); }); }
    function paintTopic(d) {
      clearTimeout(armed); armed = null; clearTimeout(armedGo); armedGo = null;   // a repainted button must ask again before it acts
      clear(body); var cls = d.cls, open = !!(d.tc.open && d.tc.open[t]), pon = !!(d.tc.pair && d.tc.pair[t]);
      var ctl = el("div.ctl.tw-" + t);
      ctl.appendChild(el("span.state" + (open ? "" : ".off"), { text: open ? fmt("staff.th.openNow", { cls: cls }) : fmt("staff.th.closedNow", { cls: cls }) }));
      ctl.appendChild(el("button.btn" + (open ? ".sec" : ""), { text: open ? S["staff.th.close"] : fmt("staff.th.open", { cls: cls }), on: { click: function (ev) { return busy(ev.currentTarget, function () { return api("apiStaff", { op: "theoryOpen", t: t, open: !open }).then(load); }); } } }));
      ctl.appendChild(el("button.btn" + (pon ? ".sec" : ".quiet"), { text: pon ? S["staff.th.pairOn"] : S["staff.th.pairOff"], attr: { "aria-pressed": pon ? "true" : "false" }, on: { click: function (ev) { return busy(ev.currentTarget, function () { return api("apiStaff", { op: "theoryPairOn", t: t, on: !pon }).then(load); }); } } }));
      var rbtn = el("button.btn.quiet", { text: fmt("staff.th.round", { n: d.round + 1 }), on: { click: function (ev) { return busy(ev.currentTarget, function () { if (armed) { clearTimeout(armed); armed = null; return api("apiStaff", { op: "theoryRound", t: t }).then(load); return; } rbtn.textContent = fmt("staff.th.roundSure", { n: d.round + 1, cls: cls, prev: d.round }); rbtn.classList.add("gold"); armed = setTimeout(function () { armed = null; rbtn.textContent = fmt("staff.th.round", { n: d.round + 1 }); rbtn.classList.remove("gold"); }, 6000); }); } } });
      ctl.appendChild(el("span.state", { text: fmt("staff.th.roundNow", { n: d.round }) })); ctl.appendChild(rbtn);
      var goNow = (d.tc.go && d.tc.go[t]) || 1, curPairs = d.pairs.filter(function (pr) { return (pr.go || 1) === goNow; }), liveN = curPairs.filter(function (pr) { return !pr.done; }).length;
      if (goNow > 1 || curPairs.length) ctl.appendChild(el("span.state", { text: fmt("staff.th.goNow", { n: goNow }) }));
      if (curPairs.length) { var gbtn = el("button.btn.quiet", { text: S["staff.th.newGo"], on: { click: function (ev) { return busy(ev.currentTarget, function () { if (armedGo) { clearTimeout(armedGo); armedGo = null; gbtn.disabled = true; return api("apiStaff", { op: "theoryNewGo", t: t }).then(function () { toast(S["staff.th.newGoDone"]); load(); }).catch(function (e) { fail(e, "staff"); }); return; } gbtn.textContent = fmt(liveN === 0 ? "staff.th.newGoSure0" : liveN === 1 ? "staff.th.newGoSure1" : "staff.th.newGoSure", { cls: cls, n: liveN }); gbtn.classList.add("gold"); armedGo = setTimeout(function () { armedGo = null; gbtn.textContent = S["staff.th.newGo"]; gbtn.classList.remove("gold"); }, 6000); }); } } }); ctl.appendChild(gbtn); }
      body.appendChild(ctl);
      if (!pon) body.appendChild(el("p.pausednote", { text: S["staff.th.pairPaused"] }));
      if (!d.rows.length) { body.appendChild(el("p.sub", { text: fmt("staff.th.none", { cls: cls }) })); }
      else {
        var screensN = (IDX[t - 1] || {}).screens || 0, tb = el("table.sttab"), thr = el("tr"); S["staff.th.cols"].split(" · ").forEach(function (c) { thr.appendChild(el("th", { text: c })); }); tb.appendChild(thr);
        d.rows.forEach(function (row) {
          var tr = el("tr"); tr.appendChild(el("td", {}, [el("button.nm", { type: "button", text: row.name, on: { click: function () { drill(row); } } })]));
          tr.appendChild(el("td", { text: seenWhen(row.seen, d.now) }));
          tr.appendChild(el("td", { text: row.time ? fmt("staff.th.learnCellTime", { n: row.learn, N: screensN, o: row.opened, time: timeWords(row.time) }) : row.learn || row.opened ? fmt("staff.th.learnCell", { n: row.learn, N: screensN, o: row.opened }) : S["staff.th.notStarted"] }));
          var pr = row.pair, ptxt = "—";
          if (pr && pr.waiting) ptxt = S["staff.th.pairWaiting"];
          else if (pr && pr.gone) ptxt = fmt("staff.th.pairGone", { why: whyWord(pr.goneWhy) });
          else if (pr && pr.done && pr.solo) ptxt = fmt("staff.th.pairSolo", { m: pr.right, R: pr.R, why: whyWord(pr.why) });
          else if (pr && pr.done) ptxt = fmt("staff.th.pair", { m: pr.right, R: pr.R, name: joinNames(pr.names) });
          else if (pr && pr.trio) ptxt = fmt("staff.th.pairLiveTrio", { r: Math.min(pr.r, pr.R), R: pr.R, name: pr.names[0], name2: pr.names[1] });
          else if (pr && pr.solo) ptxt = fmt("staff.th.pairLiveSolo", { r: Math.min(pr.r, pr.R), R: pr.R, why: whyWord(pr.why) });
          else if (pr) ptxt = fmt("staff.th.pairLive", { r: Math.min(pr.r, pr.R), R: pr.R, name: pr.names[0] });
          else if (row.prev) ptxt = row.prev.cut ? fmt("staff.th.pairPrevCut", { r: row.prev.r }) : fmt("staff.th.pairPrev", { m: row.prev.right, R: row.prev.R });
          tr.appendChild(el("td", { text: ptxt }));
          tr.appendChild(el("td", { text: row.pp.n ? fmt("staff.th.pp", { m: row.pp.m, x: row.pp.x, p: row.pp.p }) + " · " + fmt("staff.th.ppN", { n: row.pp.n, N: row.pp.N }) : S["staff.th.notTried"] }));
          var fl = el("td"); (row.flags || []).forEach(function (f) { fl.appendChild(el("span.flag", { text: S["staff.th.flag." + f] || f })); }); tr.appendChild(fl);
          tb.appendChild(tr);
        });
        body.appendChild(el("div.sttabw", {}, [tb]));
      }
      var acts = el("div.acts.th-acts"); acts.appendChild(el("button.btn.sec", { text: S["staff.th.csv"], on: { click: function (ev) { return busy(ev.currentTarget, function () { return api("apiStaff", { op: "theoryCsv", t: t, kind: "marks" }).then(function (c) { download(c.name, c.csv); }); }); } } }));
      acts.appendChild(el("button.btn.sec", { text: S["staff.th.chatCsv"], on: { click: function (ev) { return busy(ev.currentTarget, function () { return api("apiStaff", { op: "theoryCsv", t: t, kind: "chat" }).then(function (c) { download(c.name, c.csv); }); }); } } }));
      body.appendChild(acts);
      if (d.pairs.length) { var pl = el("div.pairs"); pl.appendChild(el("h3", { text: S["door.pair"] }));
        var gos = []; d.pairs.forEach(function (pr) { var g = pr.go || 1; if (gos.indexOf(g) === -1) gos.push(g); }); gos.sort(function (a, b) { return b - a; });
        gos.forEach(function (g) { if (goNow > 1 || gos.length > 1) pl.appendChild(el("h4", { text: fmt("staff.th.goHead", { n: g }) }));
          d.pairs.filter(function (pr) { return (pr.go || 1) === g; }).forEach(function (pr) { pl.appendChild(el("button.pr", { type: "button", text: fmt(pr.solo ? "staff.th.prBtnSolo" : "staff.th.prBtn", { names: joinNames(pr.names), m: pr.right, R: R, state: pr.cut ? fmt("staff.th.prStopped", { r: pr.r }) : S[pr.done ? "staff.th.prDone" : "staff.th.prLive"], lines: pr.lines }), on: { click: function () { pairDrill(pr); } } })); }); });
        body.appendChild(pl); }
    }
    function drill(row) {
      var my = opening(fmt("staff.th.openingPupil", { name: row.name }));
      Promise.all([api("apiStaff", { op: "theoryPupil", t: t, e: row.e }), loadLearn(t).catch(function () { return null; })]).then(function (rr) {
        if (my !== lastAsk) return;
        var d = rr[0], L = rr[1], lr = d.learn || {}, hex = function (v) { return parseInt(v || "0", 16) || 0; }, doneB = hex(lr.L), openB = hex(lr.O) | doneB, tries = lr.T || {}, Ns = L ? L.screens.length : (IDX[t - 1] || {}).screens || 0;
        clear(body); var dr = el("div.drill.tw-" + t); dr.appendChild(el("h2", { text: fmt("staff.th.pupilHead", { name: d.name, t: t, round: d.round }) }));
        dr.appendChild(el("p.small", { text: fmt("staff.th.pupilSeen", { when: seenWhen(d.seen, d.now) }) + " " + S["staff.th.sinceNote"] }));
        if (Ns) {
          dr.appendChild(el("h3.staffsec", { text: S["staff.th.learnHead"] }));
          var spent = d.time || {}, lt = el("table.sttab"), lh = el("tr"); S["staff.th.learnCols"].split(" · ").forEach(function (c) { lh.appendChild(el("th", { text: c })); }); lt.appendChild(lh);
          for (var si = 1; si <= Ns; si++) { var m = 1 << (si - 1), c = tries[si], ltr = el("tr"), sc = L && L.screens[si - 1];
            ltr.appendChild(el("td", { text: sc ? si + ". " + sc.title : fmt("staff.th.screenN", { n: si }) }));
            ltr.appendChild(el("td", { text: S[openB & m ? "staff.th.yes" : "staff.th.no"] })); ltr.appendChild(el("td", { text: S[doneB & m ? "staff.th.yes" : "staff.th.no"] }));
            ltr.appendChild(el("td", { text: c ? (c[0] === 1 ? fmt("staff.th.try1", { r: c[1] }) : fmt("staff.th.tries", { n: c[0], r: c[1] })) : S[doneB & m ? "staff.th.noTries" : "staff.th.notTried"] })); ltr.appendChild(el("td", { text: spent[si] ? timeWords(spent[si]) : openB & m ? S["staff.th.timeNone"] : "—" })); lt.appendChild(ltr); }
          dr.appendChild(el("div.sttabw", {}, [lt]));
          var spentAll = Object.keys(spent).reduce(function (a, k) { return a + (Number(spent[k]) || 0); }, 0);
          dr.appendChild(el("p.small.timenote", { text: (spentAll ? fmt("staff.th.timeTotal", { time: timeWords(spentAll) }) + " " : "") + S["staff.th.timeNote"] }));
          var visits = d.visits || [];
          if (visits.length) { var vd = el("details.ppmore.visits"), vt = el("table.sttab"), vh = el("tr"); vd.appendChild(el("summary", { text: visits.length === 1 ? S["staff.th.visitsOne"] : fmt("staff.th.visits", { n: visits.length }) }));
            S["staff.th.visitsCols"].split(" · ").forEach(function (c) { vh.appendChild(el("th", { text: c })); }); vt.appendChild(vh);
            visits.forEach(function (x) { var vs = L && L.screens[x[1] - 1], vr = el("tr"); vr.appendChild(el("td", { text: seenWhen(x[0], d.now) })); vr.appendChild(el("td", { text: vs ? x[1] + ". " + vs.title : fmt("staff.th.screenN", { n: x[1] }) })); vr.appendChild(el("td", { text: timeWords(x[2]) })); vt.appendChild(vr); });
            vd.appendChild(el("div.sttabw", {}, [vt])); vd.appendChild(el("p.small", { text: S["staff.th.visitsNote"] })); dr.appendChild(vd); }
        }
        dr.appendChild(el("h3.staffsec", { text: S["staff.th.ppHead"] }));
        if (!d.parts.length) dr.appendChild(el("p.small", { text: S["staff.th.noParts"] }));
        var partHead = function (pt) { return el("h4", { text: pt.year + " · " + pt.label + " · " + fmt("staff.th.partMarks", { n: pt.marks }) }); }, wording = function (box, pt) { box.appendChild(partHead(pt)); var ctx = contextBlocks(pt.context); if (ctx) box.appendChild(ctx); box.appendChild(el("p.stem", { text: pt.stem })); };
        var tried = d.parts.filter(function (pt) { return pt.best || (pt.said || []).length; }), notYet = d.parts.filter(function (pt) { return !(pt.best || (pt.said || []).length); });
        tried.forEach(function (pt) { var card = el("div.ppcard"); wording(card, pt);
          var ans = el("div.ans"); ans.appendChild(el("p.ansh", { text: pt.ansMark ? fmt("staff.th.latestMarks", { m: pt.ansMark[0], x: pt.ansMark[1] }) : S["staff.th.latest"] }));
          if ((pt.said || []).length) pt.said.forEach(function (ln) { ans.appendChild(el("p", { text: ln })); }); else ans.appendChild(el("p", { text: S["staff.th.notSaved"] }));
          if (pt.wrote) { ans.appendChild(el("p.ansh", { text: S["staff.th.wrote"] })); ans.appendChild(el("p.wrote", { text: pt.wrote.text })); if (pt.wrote.shown && (pt.wrote.review || []).length) ans.appendChild(el("p.small.quiet", { text: fmt("staff.th.wroteTicks", { m: (pt.wrote.ticks || []).reduce(function (a, b) { return a + (b ? 1 : 0); }, 0), x: pt.wrote.review.length }) })); }
          card.appendChild(ans);
          card.appendChild(el("p.small", { text: pt.best ? fmt("staff.th.bestLine", { m: pt.best[0], x: pt.best[1] }) + " · " + (pt.attempts === 1 ? S["staff.th.attempt1"] : fmt("staff.th.attempts", { n: pt.attempts })) : fmt("staff.th.notThisRound", { round: d.round }) }));
          if (pt.ms) { card.appendChild(el("p.msh", { text: S["staff.th.schemeCol"] })); card.appendChild(el("div.ms", { text: pt.ms })); }
          dr.appendChild(card); });
        if (notYet.length) { var more = el("details.ppmore"); more.appendChild(el("summary", { text: fmt("staff.th.notYet", { n: notYet.length }) })); notYet.forEach(function (pt) { var card = el("div.ppcard"); wording(card, pt); more.appendChild(card); }); dr.appendChild(more); }
        dr.appendChild(el("div.acts", {}, [backBtn()])); body.appendChild(dr);
      }).catch(function (e) { fail(e, "staff"); });
    }
    function pairDrill(pr) {
      var my = opening(S["staff.th.openingPair"]);
      api("apiStaff", { op: "theoryPair", t: t, pid: pr.pid }).then(function (d) {
        if (my !== lastAsk) return;
        clear(body); var dr = el("div.drill.tw-" + t); dr.appendChild(el("h2", { text: fmt("staff.th.pairHead", { names: d.names.join(" + "), t: t }) }));
        dr.appendChild(el("p.small", { text: d.names.map(function (n, i) { return fmt("staff.th.wasCn", { name: n, cn: d.cn[i] }); }).join(" ") + " " + fmt("staff.th.pairRight", { m: d.right, R: d.R }) }));
        var tb = el("table.sttab"), thr = el("tr"); [S["staff.th.roundCol"], S["staff.th.qCol"], S["staff.th.lockedCol"], S["staff.th.rightCol"]].forEach(function (c) { thr.appendChild(el("th", { text: c })); }); tb.appendChild(thr);
        d.A.forEach(function (a) { var tr = el("tr"); tr.appendChild(el("td", { text: String(a.r) })); tr.appendChild(el("td", { text: a.stem })); tr.appendChild(el("td" + (a.ok ? "" : ".ans"), { text: a.a + (a.ok ? " ✓" : " ✗") })); tr.appendChild(el("td.ms", { text: a.keyShown || "" })); tb.appendChild(tr); });
        dr.appendChild(tb);
        dr.appendChild(el("h3", { text: S["staff.th.transcript"] })); dr.appendChild(el("pre.tx", { text: d.tx || S["staff.th.noChat"] }));
        dr.appendChild(el("div.acts", {}, [backBtn()])); body.appendChild(dr);
      }).catch(function (e) { fail(e, "staff"); });
    }
    paintChips(); load(); timer = setInterval(function () { if (body.querySelector(".drill, .drillwait") || armed || armedGo) return; load(); }, 60000);
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
function timeWords(sec) { if (sec < 60) return S["staff.th.timeUnder"]; var mins = Math.round(sec / 60), h = Math.floor(mins / 60), rest = mins % 60; return !h ? fmt("staff.th.timeMin", { n: mins }) : rest ? fmt("staff.th.timeHrMin", { h: h, n: rest }) : fmt("staff.th.timeHr", { h: h }); }
function seenWhen(m, now) { return AGO ? AGO(now, m) : "—"; }
function staff(pane, cls, ago) {
  if (!LIVE) mount({ base: (window.A2_CW || "") + "u4/" }); CLS = cls || CLS; AGO = ago || AGO;
  try { active.stop(); } catch (e) { console.warn(e); }
  active = { stop: function () {} }; $app = pane; clear(pane); renderStaff(pane);
}
function stop() { try { active.stop(); } catch (e) { console.warn(e); } active = { stop: function () {} }; }
/* Time on each Learn screen, for the staff view. Counted the way the coursework minutes are (D100): only while the page is on screen and she typed, clicked or scrolled in the last 3 minutes. Sent once a minute on its own, never with a mark; a failed send is kept for the next one and never bothers her. */
var TM_TICK = 5000, TM_IDLE = 180000, TM_SEND = 60000, TM_CAP = 15000, TM_GAP = 600000, TM_ITEMS = 60, tmBuf = [], tmLast = Date.now(), tmAct = Date.now();
function tmAdd(t, n, s, at) { var b = tmBuf[tmBuf.length - 1]; if (b && b[0] === t && b[1] === n && at - b[3] <= TM_GAP) { b[2] += s; b[3] = at; } else tmBuf.push([t, n, s, at]); }
function tmTick() {
  var now = Date.now(), dt = Math.min(now - tmLast, TM_CAP), m = /^#th\/([1-7])\/learn(?:\/(\d+))?$/.exec(location.hash || "");
  tmLast = now;
  if (!m || !LIVE || document.hidden || now - tmAct >= TM_IDLE) return;
  tmAdd(m[1], m[2] || "1", Math.round(dt / 1000), now);
}
function tmSend() {
  if (!tmBuf.length) return;
  var now = Date.now(), sent = tmBuf.splice(0, TM_ITEMS);
  api("apiTheory", { op: "learnTime", v: sent.map(function (b) { return [b[0], b[1], b[2], Math.round((now - b[3]) / 1000)]; }) }).catch(function (e) { console.warn(e); tmBuf = sent.concat(tmBuf); });
}
["keydown", "pointerdown", "input", "wheel", "scroll", "touchstart"].forEach(function (ev) { window.addEventListener(ev, function () { tmAct = Date.now(); }, { capture: true, passive: true }); });
setInterval(tmTick, TM_TICK);
setInterval(tmSend, TM_SEND);
document.addEventListener("visibilitychange", function () { if (document.hidden) { tmTick(); tmSend(); } else tmLast = Date.now(); });
window.addEventListener("pagehide", function () { tmTick(); tmSend(); });

window.TH = { boot: boot, mount: mount, show: show, staff: staff, stop: stop, Surface: Surface };
})();
