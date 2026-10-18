/* S2 U5CA guide: the renderer. The design window's prototype (DESIGN_SPEC 6), with the platform seams of the AS cw.js:
   CW.mount(host, {base, api}) then CW.show(hash); every pupil act goes to api (apiCw, op had added, SPEC 3.3);
   code lines carry their text in data-t, drawn by CSS, never a text node (SPEC 6.3, G5); chapter 14 waits for 1 to 13 (SPEC 3.6).
   Was: the prototype renderer. Same bones as the AS cw.js (one IIFE, S state, hash routes #cw / #cw/07 / #cw/07/3-2),
   with the S2 blocks of DESIGN_SPEC 6: p, watch, words, drawn, flow, frames, isense, names, steps, check, box, code, foot. */
(function () {
'use strict';
const S = { host: null, api: {}, base: '../content/', T: {}, index: null, ch: {}, controls: null, names: null, typed: {}, isenseShown: {}, timers: [], fast: false };
const K = 's2:';
const store = (k, v) => { const was = load(k, null); try { localStorage.setItem(K + k, JSON.stringify(v)); } catch (e) {} sync(k, was, v); };
function sync(k, was, v) {
  const A = S.api || {}, m = k.match(/^(ticks|at):(\d\d)$/);
  const diff = (a, b, fn) => { a = a || {}; b = b || {}; Object.keys(Object.assign({}, a, b)).forEach(x => { if (!!a[x] !== !!b[x]) fn(x, !!b[x]); }); };
  if (m && m[1] === 'ticks' && A.tick) diff(was, v, (id, on) => A.tick(m[2], id, on));
  else if (m && m[1] === 'at' && A.screen) { if (was !== v) A.screen(m[2], v); }
  else if (k === 'had' && A.had) diff(was, v, (ch, on) => A.had(ch, on));
  else if (k === 'done' && A.done) diff(was, v, (ch, on) => A.done(ch, on));
}
function load(k, d) { return load_(k, d); }
const load_ = (k, d) => { try { const v = localStorage.getItem(K + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const t = (k, v) => { let s = S.T[k]; if (s == null) s = '[' + k + ']'; if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; };
const el = html => { const d = document.createElement('template'); d.innerHTML = html.trim(); return d.content.firstElementChild; };
const reduced = () => S.fast || matchMedia('(prefers-reduced-motion: reduce)').matches;
const later = (fn, ms) => { const id = setTimeout(fn, reduced() ? 0 : ms); S.timers.push(id); return id; };
const clearTimers = () => { S.timers.forEach(clearTimeout); S.timers = []; };
const words = s => String(s || '').trim().split(/\s+/).filter(Boolean).length;
const getJSON = async p => { const r = await fetch(p, { cache: 'no-store' }); if (!r.ok) throw new Error(p + ' ' + r.status); return r.json(); };
const asset = p => /^(https?:|data:)/.test(p) ? p : S.base + p;
const pad = n => String(n).padStart(2, '0');

/* ---------- state ---------- */
const ticks = ch => load('ticks:' + ch, {});
const seen = ch => load('seen:' + ch, {});
const had = () => load('had', {});
const done = () => load('done', {});
function idsOf(blocks, out) {
  out = out || [];
  (blocks || []).forEach(b => {
    if (b.steps) b.steps.forEach(s => out.push(s.id));
    if (b.check) b.check.forEach(r => out.push(r.id));
    if (b.code && b.code.kind === 'type' && b.code.id) out.push(b.code.id);
    if (b.box && b.box.blocks) idsOf(b.box.blocks, out);
  });
  return out;
}
function flat(ch) {
  const out = [];
  ch.stages.forEach((st, si) => st.screens.forEach((sc, ki) => out.push({ key: st.id + '-' + sc.id, st, sc, si, ki })));
  return out;
}

/* ---------- toast, sheet, popover, confetti ---------- */
let toastT;
function toast(msg) { const x = $('#toast'); x.textContent = msg; x.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => x.classList.remove('on'), 2600); }
function closePop() { $$('.cw-pop').forEach(p => p.remove()); $$('.wd.on').forEach(w => w.classList.remove('on')); }
function showPop(btn, word, meaning, screenKey, chId) {
  closePop();
  btn.classList.add('on');
  const cur = S.cur && S.cur.key;
  const pop = el(`<div class="cw-pop" role="tooltip"><b>${esc(word)}</b>${esc(meaning)}${screenKey && screenKey !== cur ? ` <a class="go" href="#cw/${chId}/${screenKey}">${esc(t('words.see', { s: screenKey }))}</a>` : ''}</div>`);
  document.body.appendChild(pop);
  const r = btn.getBoundingClientRect();
  const left = Math.max(12, Math.min(r.left + scrollX, scrollX + innerWidth - pop.offsetWidth - 12));
  pop.style.left = left + 'px'; pop.style.top = (r.bottom + scrollY + 8) + 'px';
}
document.addEventListener('click', e => { if (!e.target.closest('.wd') && !e.target.closest('.cw-pop')) closePop(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closePop(); closeSheet(); } });
function openSheet() {
  const ch = S.ch['00']; if (!ch) return;
  const scr = flat(ch).find(x => x.key === '3-1'); if (!scr) return;
  const w = $('#sheet'); $('.sheet-top h2', w).textContent = t('fixed.howName');
  const body = $('.sheet-body', w); body.innerHTML = '';
  body.className = 'sheet-body sw-00';
  renderBlocks(scr.sc.blocks, { chId: '00', ch, key: '3-1', inSheet: true }).forEach(n => body.appendChild(n));
  w.classList.add('on'); $('.close', w).focus();
}
function closeSheet() { $('#sheet').classList.remove('on'); }
function confetti(colors) {
  if (reduced()) return;
  const c = $('#confetti'), ctx = c.getContext('2d'); c.hidden = false; c.width = innerWidth; c.height = innerHeight;
  const ps = []; for (let i = 0; i < 40; i++) ps.push({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight / 2, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, r: 6 + Math.random() * 7, c: colors[i % colors.length], a: Math.random() * 6 });
  const t0 = performance.now();
  (function f(now) {
    const k = (now - t0) / 1200; ctx.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .5; p.a += .2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = Math.max(0, 1 - k); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * .6); ctx.restore(); });
    if (k < 1) requestAnimationFrame(f); else { ctx.clearRect(0, 0, c.width, c.height); c.hidden = true; }
  })(t0);
}

/* ---------- C# highlighter (escaped output) ---------- */
const RX = /("(?:[^"\\]|\\.)*")|(\/\/.*$)|\b(private|public|void|if|else|return|new|true|false|int|string|bool|static|class|using|this|double|foreach|in|var|while|for)\b|\b(\d+)\b|\b([A-Za-z_]\w*)(?=\()/g;
function hl(s) {
  let out = '', last = 0, m;
  RX.lastIndex = 0;
  while ((m = RX.exec(s))) {
    out += dt(s.slice(last, m.index));
    const cls = m[1] ? 'tok-s' : m[2] ? 'tok-c' : m[3] ? 'tok-k' : m[4] ? 'tok-n' : 'tok-m';
    out += `<span class="${cls}" data-t="${esc(m[0])}"></span>`;
    last = m.index + m[0].length;
  }
  return out + dt(s.slice(last));
}
function dt(s) { return s ? `<span data-t="${esc(s)}"></span>` : ''; }
/* marked words [[word|i]] in prose → buttons that open the meaning */
function prose(s, ctx) {
  return esc(s).replace(/\[\[([^\]|]+)\|(\d+)\]\]/g, (_, w, i) => `<button class="wd" data-i="${i}">${w}</button>`);
}
function wireWords(node, ctx) {
  $$('.wd', node).forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const g = ctx.ch.glossary[+b.dataset.i] || [b.textContent, ''];
    const first = (ctx.words || {})[g[0]];
    showPop(b, g[0], g[1], first, ctx.chId);
  }));
}

/* ---------- blocks ---------- */
function bP(text, ctx, first) {
  const p = el(`<p class="cw-p${first ? ' opener' : ''}">${prose(text, ctx)}</p>`); wireWords(p, ctx); return p;
}
function bWatch(text, ctx) {
  const n = el(`<div class="cw-watch"><span class="ic" aria-hidden="true">!</span><div><span class="lab">${esc(t('watch.label'))}</span>${prose(text, ctx)}</div></div>`); wireWords(n, ctx); return n;
}
function bWords(w, ctx) {
  const n = el(`<div class="cw-words"><p class="intro">${esc(w.intro)}</p><ul class="cw-wds"></ul></div>`);
  const ul = $('ul', n);
  w.words.forEach(([word, meaning, first, code], i) => {
    const li = el(`<li tabindex="0" style="--d:${450 + i * 140}ms"><b class="${code ? 'code' : ''}">${esc(word)}</b><div class="m">${esc(meaning)}${first && first !== ctx.key ? ` <a href="#cw/${ctx.chId}/${first}">${esc(t('words.see', { s: first }))}</a>` : ''}</div></li>`);
    const tog = () => li.classList.toggle('on');
    li.addEventListener('click', e => { if (e.target.tagName !== 'A') tog(); });
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tog(); } });
    ul.appendChild(li);
  });
  return n;
}
function bDrawn(d, ctx) {
  const n = el(`<figure class="cw-drawn" data-id="${esc(d.id)}" role="img" aria-label="${esc(d.alt)}"><div class="stage"></div><figcaption class="say">${prose(d.say, ctx)}</figcaption></figure>`);
  const st = $('.stage', n); wireWords(n, ctx);
  if (d.id === 'five-screens') {
    const cards = d.cards || []; const wins = cards.filter(c => !/\.txt$/.test(c[0])); const file = cards.find(c => /\.txt$/.test(c[0]));
    st.appendChild(el(`<div class="dw-cards">${wins.map(c => `<div class="dw-card"><div class="bar"></div><div class="ttl">${esc(c[1])}</div><div class="nm">${esc(c[0])}</div><div class="ln">${esc(c[2])}</div></div>`).join('')}</div>`));
    if (file) st.appendChild(el(`<div class="dw-file"><span class="ic">🗒️</span><div><div class="ttl">${esc(file[1])}</div><div class="nm">${esc(file[0])}</div><div class="ln">${esc(file[2])}</div></div></div>`));
  } else if (d.id === 'load-now') {
    st.appendChild(el(`<div class="dw-win"><div class="tb"><i></i>frmQuiz</div><div class="body"><div class="pn open"></div><div class="pn"></div><div class="pn"></div><div class="pn"></div><div class="pn"></div><div class="pn"></div></div></div>`));
    st.appendChild(el(`<div class="dw-code"><span class="badge">runs now</span>private void frmQuiz_Load(...)<br>{<br>&nbsp;&nbsp;&nbsp;&nbsp;pnlListQuestion.Enabled = false;<br>}</div>`));
  } else if (d.id === 'stop-sign') {
    st.appendChild(el(`<div class="dw-stop"><div class="sign">STOP</div><div class="lines">MessageBox.Show("Please choose...");<br><span class="tok-k">return;</span><br><span class="d">if (rbB.Checked)</span><br><span class="d">{ ... }</span></div></div>`));
  } else if (d.id === 'fresh-screen') {
    st.appendChild(el(`<div class="dw-fresh"><div class="sc"><div class="t">frmDataEntry, fresh</div><div class="l"></div><div class="l" style="width:70%"></div><div class="l" style="width:85%"></div></div><div class="ar">→</div><div class="sc new"><div class="t">Global, the notebook</div><div>quizScore = 4</div><div>quizTaken = true</div><div>reactionScore = 0</div></div></div>`));
  } else if (d.id === 'mini-chapter') {
    const st7 = (S.index.chapters.find(c => c.id === '07') || { stages: [] }).stages.slice(0, 3);
    st.appendChild(el(`<div class="dw-mini">${st7.map((s, i) => `${i ? '<span class="ar">→</span>' : ''}<span class="st">${esc(s[1])}<br><small style="color:var(--mute)">${'● '.repeat(Math.max(1, s[2] - 1))}✓</small></span>`).join('')}<span class="ar">→</span><span class="st">…</span></div>`));
  } else if (d.id === 'home-card') {
    const c = S.index.chapters.find(x => x.id === '07');
    const wrap = el(`<ul class="cw-cards" style="grid-template-columns:1fr;max-width:420px;margin:0 auto;pointer-events:none"></ul>`);
    wrap.appendChild(card(c, { k: 9, tt: c.steps.length, state: 'open', lit: false, expected: true, demo: true }));
    st.appendChild(wrap);
  } else {
    st.appendChild(el(`<div class="ph">${esc(d.alt)}</div>`));
  }
  return n;
}
function bFlow(f, ctx) {
  const form = S.controls[f.form]; const W = Math.min(420, Math.max(280, (innerWidth - 120))); const sc = W / form.size[0]; const H = form.size[1] * sc + 22;
  const n = el(`<div class="cw-flow"><div class="form" style="width:${W}px;height:${H}px"><div class="tb">${esc(f.form)}</div></div><div class="key"><span class="o"><i></i>${esc(t('flow.open'))}</span><span class="l"><i></i>${esc(t('flow.locked'))}</span></div><p class="say"></p><p class="fixed">${esc(t('fixed.flow'))}</p><button class="btn sec again">${esc(t('flow.again'))}</button></div>`);
  const box = $('.form', n), say = $('.say', n);
  const rooms = {}, order = [];
  Object.entries(form.controls).filter(([, c]) => (c.type === 'Panel' || c.type === 'GroupBox') && c.parent === f.form).sort((x, y) => x[1].loc[1] - y[1].loc[1] || x[1].loc[0] - y[1].loc[0]).forEach(([name, c]) => {
    const r = el(`<div class="fp" data-n="${esc(name)}" style="left:${c.loc[0] * sc}px;top:${22 + c.loc[1] * sc}px;width:${c.size[0] * sc}px;height:${c.size[1] * sc}px">${esc(name)}<span class="k" aria-hidden="true">🔒</span></div>`);
    rooms[name] = r; order.push(name); box.appendChild(r);
  });
  const lit0 = f.lit || [], then = f.then || [];
  const set = (name, on, pop) => { const r = rooms[name]; if (!r) return; r.classList.toggle('lit', on); $('.k', r).textContent = on ? '🔑' : '🔒'; if (pop) { r.classList.remove('just'); void r.offsetWidth; r.classList.add('just'); } };
  /* end state: the lit panels on; each `then` panel on while the one before it goes off (the first lit panel stays) */
  const endState = () => { const on = new Set(lit0); let active = lit0[lit0.length - 1]; then.forEach(k => { if (active && active !== lit0[0]) on.delete(active); on.add(k); active = k; }); return on; };
  let T = [];
  const at = (fn, ms) => T.push(later(fn, ms));
  const play = () => {
    T.forEach(clearTimeout); T = [];
    if (reduced()) { const on = endState(); order.forEach(k => set(k, on.has(k), false)); say.textContent = f.say; return; }
    if (!then.length) {
      /* beat 1: every panel switched on, as the form would be without a Load event; beat 2: they switch off one at a time */
      order.forEach(k => set(k, true, false)); say.textContent = f.before || t('flow.allOn');
      let ms = 1000;
      order.filter(k => lit0.indexOf(k) < 0).forEach(k => { at(() => set(k, false, true), ms); ms += 320; });
      at(() => { lit0.forEach(k => set(k, true, true)); say.textContent = f.say; }, ms + 150);
    } else {
      /* beat 1: the lit panels pulse on; beat 2: what the code does next, one swap at a time */
      order.forEach(k => set(k, lit0.indexOf(k) >= 0, false)); say.textContent = f.before || f.say;
      at(() => lit0.forEach(k => set(k, true, true)), 300);
      let active = lit0[lit0.length - 1], ms = 1700;
      then.forEach(k => { at(() => { if (active && active !== lit0[0]) set(active, false, true); set(k, true, true); active = k; say.textContent = f.say; }, ms); ms += 1200; });
    }
  };
  $('.again', n).addEventListener('click', play);
  later(play, 450);
  return n;
}
function bFrames(fr, ctx) {
  const n = el(`<div class="cw-frames" data-id="${esc(fr.id)}"><div class="ttl"><span>${esc(fr.title)}</span><span class="n"></span></div><div class="stage" tabindex="0"><div class="prog"></div></div><p class="say"></p><div class="bar"><span class="dots"></span><button class="btn sec">${esc(t('frames.replay'))}</button></div></div>`);
  const stage = $('.stage', n), say = $('.say', n), dots = $('.dots', n), prog = $('.prog', n), nlab = $('.n', n), btn = $('.btn', n);
  let i = 0, paused = false, timer;
  fr.frames.forEach((_, k) => { const d = el(`<button class="fdot" aria-label="${esc(t('frames.of', { k: k + 1, t: fr.frames.length }))}"></button>`); d.addEventListener('click', e => { e.stopPropagation(); show(k, true); }); dots.appendChild(d); });
  function show(k, manual) {
    clearTimeout(timer); i = k; const f = fr.frames[k];
    $$('.fdot', dots).forEach((d, j) => d.classList.toggle('on', j === k));
    nlab.textContent = t('frames.of', { k: k + 1, t: fr.frames.length });
    $$('img,.ph', stage).forEach(x => x.remove());
    const img = new Image(); img.alt = f.alt; img.src = asset(f.img);
    img.onerror = () => { img.remove(); stage.appendChild(el(`<div class="ph">${esc(t('frames.missing'))}<small>${esc(f.alt)}</small></div>`)); };
    stage.appendChild(img);
    say.textContent = f.say;
    prog.classList.remove('run'); prog.style.width = '0';
    if (paused && !manual) return;
    paused = false;
    const dur = reduced() ? 0 : 1600 + 350 * words(f.say);
    if (dur) { void prog.offsetWidth; prog.style.setProperty('--dur', dur + 'ms'); prog.classList.add('run'); }
    if (dur && k + 1 < fr.frames.length) timer = setTimeout(() => show(k + 1), dur);
    S.timers.push(timer);
  }
  stage.addEventListener('click', () => { paused = !paused; if (paused) { clearTimeout(timer); prog.classList.remove('run'); prog.style.width = getComputedStyle(prog).width; btn.textContent = t('frames.replay'); } else show(i, true); });
  stage.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stage.click(); } });
  btn.addEventListener('click', () => { paused = false; show(0, true); });
  show(0, true);
  return n;
}
function isenseFor(form, pick) {
  const dot = pick.indexOf('.');
  const typed = dot > 0 ? pick.slice(0, dot + 1) : pick.slice(0, 3);
  let pool = dot > 0 ? Object.keys(S.names).filter(k => k.startsWith(typed)) : Object.keys((S.controls[form] || S.controls.frmDataEntry).controls).filter(k => k.toLowerCase().startsWith(typed.toLowerCase()));
  pool = Array.from(new Set(pool.concat([pick]))).sort();
  if (pool.length > 5) { const i = pool.indexOf(pick); const a = Math.max(0, Math.min(i - 2, pool.length - 5)); pool = pool.slice(a, a + 5); }
  return { form, typed, pick, list: pool };
}
function bIsense(is, ctx, auto) {
  const n = el(`<div class="cw-isense"><div class="ttl"><span>${esc(t('isense.title'))}</span><button class="btn">${esc(t('isense.replay'))}</button></div><div class="ig"><div class="il"><div class="line"><span class="tx"></span><span class="caret"></span></div><div class="list" aria-hidden="true">${is.list.map(x => `<div data-n="${esc(x)}"><i></i>${esc(x)}</div>`).join('')}</div></div><div class="ir"><p class="fixed">${esc(t('fixed.isense1'))}</p><p class="fixed">${esc(t('fixed.isense2'))}</p></div></div></div>`);
  const tx = $('.tx', n), list = $('.list', n), items = $$('.list div', n);
  const sel = k => items.forEach((d, j) => d.classList.toggle('sel', j === k));
  function play() {
    S.timers.forEach(() => {}); tx.textContent = ''; list.classList.remove('on'); sel(-1);
    const pickIdx = is.list.indexOf(is.pick);
    if (reduced()) { tx.textContent = is.pick; list.classList.add('on'); sel(pickIdx); return; }
    let ms = 300;
    is.typed.split('').forEach(c => { later(() => { tx.textContent += c; }, ms); ms += 130; });
    later(() => list.classList.add('on'), ms + 150); ms += 500;
    for (let j = 0; j <= pickIdx; j++) { later(() => sel(j), ms); ms += 220; }
    later(() => { tx.textContent = is.pick; }, ms + 650);
  }
  $('.btn', n).addEventListener('click', play);
  if (auto) later(play, 500); else { tx.textContent = is.pick; list.classList.add('on'); sel(is.list.indexOf(is.pick)); }
  return n;
}
function bNames(list, title, ctx) {
  const n = el(`<div class="cw-names"><div class="ttl">${esc(title)}</div><ul>${list.map((x, i) => `<li style="--d:${450 + i * 140}ms"><code>${esc(x)}</code><span>${esc(S.names[x] || '')}</span></li>`).join('')}</ul><p class="fixed">${esc(t('fixed.names'))}</p>${ctx.inSheet ? '' : `<button class="link how">${esc(t('fixed.howName'))}</button>`}</div>`);
  const h = $('.how', n); if (h) h.addEventListener('click', openSheet);
  return n;
}
function bSteps(steps, ctx) {
  const ol = el(`<ol class="cw-steps"></ol>`);
  steps.forEach((s, i) => {
    const li = el(`<li class="cw-step" data-id="${esc(s.id)}" style="--d:${600 + i * 260}ms"><div class="n">${i + 1}</div><div class="do">${prose(s.do, ctx)}</div><div class="cw-see"><span class="eye" aria-hidden="true">👁</span><span><b>${esc(t('step.see'))}</b> ${prose(s.see, ctx)}</span></div></li>`);
    if (s.img) {
      const fig = el(`<figure></figure>`); const img = new Image(); img.alt = s.img.alt; img.src = asset(s.img.img); img.width = 520;
      img.onerror = () => { img.remove(); fig.appendChild(el(`<div class="ph">${esc(t('frames.missing'))}<small>${esc(s.img.alt)}</small></div>`)); };
      fig.appendChild(img); li.appendChild(fig);
    }
    if (s.wrong && s.wrong.length) li.appendChild(el(`<details class="cw-wrong"><summary>${esc(t('step.wrong'))}</summary>${s.wrong.map(([q, a]) => `<div class="qa"><b>${esc(q)}</b>${esc(a)}</div>`).join('')}</details>`));
    wireWords(li, ctx); ol.appendChild(li);
  });
  return ol;
}
function bCheck(rows, ctx) {
  const tryIt = rows.some(r => r.expect !== 'have');
  const wrap = document.createDocumentFragment();
  wrap.appendChild(el(`<p class="intro">${esc(t(tryIt ? 'check.try.intro' : 'check.have.intro'))}</p>`));
  const ul = el(`<ul class="cw-check"></ul>`);
  const tk = ticks(ctx.chId);
  rows.forEach((r, i) => {
    const ex = r.expect === 'must' ? `<span class="ex must">${esc(t('check.must'))}</span>` : r.expect === 'mustnot' ? `<span class="ex mustnot">${esc(t('check.mustNot'))}</span>` : '';
    const li = el(`<li data-id="${esc(r.id)}" style="--d:${400 + i * 180}ms"><button class="tk${tk[r.id] ? ' on' : ''}" aria-pressed="${!!tk[r.id]}" aria-label="${esc(r.what)}"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="M5 15l6 6 12-13"/></svg></button><div class="what">${ex}${prose(r.what, ctx)}</div><div class="how">${prose(r.how, ctx)}</div><div class="fix"><span class="lab">${esc(t('check.fix'))}</span><a href="${esc(r.go)}">${esc(r.fix)}</a></div></li>`);
    $('.tk', li).addEventListener('click', () => { const tt = ticks(ctx.chId); if (tt[r.id]) delete tt[r.id]; else tt[r.id] = true; store('ticks:' + ctx.chId, tt); $('.tk', li).classList.toggle('on', !!tt[r.id]); $('.tk', li).setAttribute('aria-pressed', !!tt[r.id]); refreshFoot(ctx); });
    wireWords(li, ctx); ul.appendChild(li);
  });
  wrap.appendChild(ul);
  return wrap;
}
function bBox(b, ctx) {
  const d = el(`<details class="cw-box"${b.fold ? '' : ' open'}><summary>${esc(b.title)}</summary><div class="in"></div></details>`);
  const body = $('.in', d);
  if (b.text) { const p = el(`<p>${prose(b.text, ctx)}</p>`); wireWords(p, ctx); body.appendChild(p); }
  if (b.blocks) renderBlocks(b.blocks, ctx).forEach(n => body.appendChild(n));
  return d;
}
function bCode(c, ctx) {
  const lines = c.text.split('\n'); const from = c.from || 1; const total = c.to && c.from ? null : null;
  const parts = (c.partLines || []).map(p => ({ from: p[0], to: p[1], h: p[2], m: p[3], given: p[4] === 'given' }));
  const partOf = n => parts.findIndex(p => n >= p.from && n <= p.to);
  const kind = c.kind === 'read' ? t('code.kindRead') : t('code.kindType');
  const card = el(`<section class="cw-code" data-id="${esc(c.id || '')}">
    <div class="ctop"><span class="kind ${c.kind}">${esc(kind)}</span><span class="t">${esc(c.title)}</span><span class="wh"><b>${esc(t('code.where'))}:</b> ${esc(c.where)}</span></div>
    <div class="cgrid"><div class="cbody"><span class="nocopy">${esc(t('code.typeIt'))}</span><pre class="cw-pre" aria-label="code"></pre></div><div class="parts"></div></div></section>`);
  const pre = $('.cw-pre', card), partsEl = $('.parts', card);
  lines.forEach((ln, i) => {
    const n = from + i, pi = partOf(n), given = pi >= 0 && parts[pi].given;
    pre.appendChild(el(`<span class="ln${given ? ' given' : ''}" data-n="${n}" data-p="${pi}">${hl(ln) || dt(' ')}</span>`));
  });
  parts.forEach((p, i) => partsEl.appendChild(el(`<div class="part${p.given ? ' given' : ''}" data-p="${i}"><span class="lr">${p.from === p.to ? 'Line ' + p.from : 'Lines ' + p.from + ' to ' + p.to}</span><b>${esc(p.h)}</b>${esc(p.m)}</div>`)));
  if (c.yours) card.querySelector('.cgrid').appendChild(el(`<div class="cw-yours"><span class="pin" aria-hidden="true">📌</span><div><b>${esc(t('code.yoursTitle'))}</b>${esc(c.yours)}</div></div>`));
  /* walk mode */
  const walk = el(`<div class="cwalk"><button class="btn sec w-on">${esc(t('code.walk'))}</button><button class="btn sec w-back" hidden>${esc(t('walk.back'))}</button><button class="btn w-next" hidden>${esc(t('walk.next'))}</button><button class="btn quiet w-off" hidden>${esc(t('code.walkOff'))}</button><button class="btn quiet w-again">${esc(t('code.replay'))}</button><span class="step"></span></div>`);
  card.querySelector('.cgrid').appendChild(walk);
  let wi = -1;
  const lnEls = $$('.ln', pre), ptEls = $$('.part', partsEl);
  function setWalk(i) {
    wi = i; const on = i >= 0;
    lnEls.forEach(l => { const p = +l.dataset.p; l.classList.toggle('cur', on && p === i); l.classList.toggle('dim', on && p !== i); });
    ptEls.forEach((p, j) => { p.classList.toggle('cur', on && j === i); p.classList.toggle('dim', on && j !== i); });
    $('.w-on', walk).hidden = on; $('.w-again', walk).hidden = on; $('.w-back', walk).hidden = !on; $('.w-next', walk).hidden = !on; $('.w-off', walk).hidden = !on;
    $('.w-back', walk).disabled = i <= 0;
    $('.w-next', walk).textContent = i >= parts.length - 1 ? t('walk.finish') : t('walk.next');
    $('.step', walk).textContent = on ? t('walk.part', { k: i + 1, t: parts.length }) : '';
    if (on && ptEls[i] && innerWidth <= 900) ptEls[i].scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
  }
  $('.w-on', walk).addEventListener('click', () => { finishTyping(); setWalk(0); });
  $('.w-back', walk).addEventListener('click', () => setWalk(Math.max(0, wi - 1)));
  $('.w-next', walk).addEventListener('click', () => { if (wi >= parts.length - 1) setWalk(-1); else setWalk(wi + 1); });
  $('.w-off', walk).addEventListener('click', () => setWalk(-1));
  $('.w-again', walk).addEventListener('click', () => typeIt(true));
  /* no copy (G5) */
  ['copy', 'cut', 'dragstart', 'contextmenu', 'selectstart'].forEach(ev => card.querySelector('.cbody').addEventListener(ev, e => { e.preventDefault(); toast(t('code.toast')); }));
  card.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x' || e.key === 'a')) { e.preventDefault(); toast(t('code.toast')); } });
  /* typewriter: the first typed part, once per screen (SPEC 6.3) */
  const firstTyped = parts.findIndex(p => !p.given);
  let typingTimers = [];
  function finishTyping() { typingTimers.forEach(clearTimeout); typingTimers = []; ptEls.forEach(p => p.classList.remove('typing')); lnEls.forEach((l, i) => { l.classList.remove('wait'); l.innerHTML = hl(lines[i]) || dt(' '); }); }
  function typeIt(force) {
    const key = ctx.chId + '/' + ctx.key + '/' + (c.id || c.title);
    if (!force && (S.typed[key] || reduced() || firstTyped < 0)) { finishTyping(); return; }
    S.typed[key] = true; finishTyping();
    const fp = parts[firstTyped]; if (ptEls[firstTyped]) ptEls[firstTyped].classList.add('typing');
    lnEls.forEach(l => { const n = +l.dataset.n; const p = +l.dataset.p; if (n >= fp.from) { if (!(p >= 0 && parts[p].given) || n > fp.to) l.classList.add('wait'); } });
    let ms = 900;
    lnEls.forEach((l, i) => {
      const n = +l.dataset.n; if (n < fp.from || n > fp.to) return;
      const text = lines[i]; const lead = text.match(/^\s*/)[0].length; const body = text.slice(lead);
      const per = Math.max(22, Math.min(60, 2400 / Math.max(1, body.length)));
      typingTimers.push(setTimeout(() => { l.classList.remove('wait'); l.innerHTML = dt(text.slice(0, lead)) + '<span class="cs"></span>'; }, ms));
      for (let k = 1; k <= body.length; k++) { const kk = k; typingTimers.push(setTimeout(() => { l.innerHTML = dt(text.slice(0, lead + kk)) + (kk < body.length ? '<span class="cs"></span>' : ''); }, ms + kk * per)); }
      ms += body.length * per + 260;
      typingTimers.push(setTimeout(() => { l.innerHTML = hl(text) || dt(' '); }, ms - 200));
    });
    typingTimers.push(setTimeout(() => { lnEls.forEach(l => l.classList.remove('wait')); finishTyping(); }, ms + 150));
  }
  card.querySelector('.cbody').addEventListener('click', finishTyping);
  card._after = () => { layoutParts(card); typeIt(false); };
  const out = [card];
  const names = c.names || [];
  if (names.length) out.push(bNames(names, t('code.namesTitle'), ctx));
  if (c.isense && c.isense.length) { const auto = !S.isenseShown[ctx.chId]; S.isenseShown[ctx.chId] = true; out.push(bIsense(isenseFor(c.form || 'frmDataEntry', c.isense[0]), ctx, auto)); }
  if (c.continues) out.push(el(`<p class="cw-p" style="color:var(--mute);font-weight:700">${esc(t('code.continues'))}</p>`));
  return out;
}
function layoutParts(card) {
  const pre = $('.cw-pre', card), partsEl = $('.parts', card), parts = $$('.part', partsEl);
  const lh = parseFloat(getComputedStyle(pre).lineHeight) || 26;
  $$('.ln', pre).forEach(l => { l.classList.remove('wrap'); if (innerWidth > 600) l.classList.toggle('wrap', l.getBoundingClientRect().height > lh * 1.5); });
  if (innerWidth <= 900) { parts.forEach(p => { p.style.position = ''; p.style.top = ''; }); partsEl.style.height = ''; return; }
  const top0 = pre.getBoundingClientRect().top; let bottom = 0;
  parts.forEach(p => {
    const first = $(`.ln[data-p="${p.dataset.p}"]`, pre); if (!first) return;
    let y = first.getBoundingClientRect().top - top0 - 2; if (y < bottom) y = bottom;
    p.style.position = 'absolute'; p.style.left = '0'; p.style.right = '0'; p.style.top = y + 'px'; p.style.margin = '0';
    bottom = y + p.offsetHeight + 10;
  });
  partsEl.style.height = bottom + 'px';
}
addEventListener('resize', () => $$('.cw-code').forEach(layoutParts));

function renderBlocks(blocks, ctx) {
  const out = []; let firstP = true;
  blocks.forEach(b => {
    if (b.p != null) { out.push(bP(b.p, ctx, firstP)); firstP = false; }
    else if (b.watch) out.push(bWatch(b.watch, ctx));
    else if (b.words) out.push(bWords(b.words === true ? b : { words: b.words, intro: b.intro }, ctx));
    else if (b.drawn) out.push(bDrawn(b.drawn, ctx));
    else if (b.flow) out.push(bFlow(b.flow, ctx));
    else if (b.frames) out.push(bFrames(b.frames, ctx));
    else if (b.isense) out.push(bIsense(b.isense, ctx, true));
    else if (b.names) out.push(bNames(b.names.list, t('names.title'), ctx));
    else if (b.steps) out.push(bSteps(b.steps, ctx));
    else if (b.check) out.push(bCheck(b.check, ctx));
    else if (b.box) out.push(bBox(b.box, ctx));
    else if (b.code) bCode(b.code, ctx).forEach(n => out.push(n));
  });
  return out;
}

/* ---------- home: the checklist ---------- */
function ring(k, tt, cls, full) {
  if (full) { k = tt = 1; }
  const C = 2 * Math.PI * 26, off = tt ? C * (1 - k / tt) : C;
  return `<div class="ring ${cls || ''}" aria-label="${esc(full ? t('home.done') : t('home.ring', { k, t: tt }))}"><svg viewBox="0 0 64 64" aria-hidden="true"><circle class="bg" cx="32" cy="32" r="26"/><circle class="fg" cx="32" cy="32" r="26" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/></svg><div class="lab">${full ? '✓' : (tt ? k + '/' + tt : '–')}</div></div>`;
}
function card(c, o) {
  const cls = ['cw-card', 'sw-' + c.id, o.lit ? 'lit' : '', o.state === 'done' ? 'done' : '', o.state === 'had' ? 'had' : '', c.built ? '' : 'coming'].filter(Boolean).join(' ');
  const tags = [];
  if (o.state === 'done') tags.push(`<span class="tag ok">✓ ${esc(t('home.done'))}</span>`);
  if (o.state === 'had') tags.push(`<span class="tag had">${esc(t('home.hadMark'))}</span>`);
  if (o.expected && o.state !== 'done' && o.state !== 'had') tags.push(`<span class="tag">${esc(t('home.expectedTag'))}</span>`);
  if (c.hidden) tags.push(`<span class="tag opt">${esc(t('home.optional'))}</span>`);
  const full = o.state === 'done' || o.state === 'had';
  if (!c.built && !full) tags.push(`<span class="tag had">${esc(t('home.coming'))}</span>`);
  const li = el(`<li class="${cls}" data-ch="${c.id}"><div class="num">${c.n === 0 ? '★' : c.n}</div><div class="ttl" data-start="${esc(t('home.start'))}">${esc(c.title)}</div><div class="one">${esc(c.one)}</div>${ring(o.k, o.tt, '', full)}<div class="tags">${tags.join('')}</div><div class="acts"></div></li>`);
  const acts = $('.acts', li);
  if (c.built) {
    const open = el(`<a class="btn${full ? ' sec' : ''}" href="#cw/${c.id}">${esc(o.k > 0 && !full ? t('home.continue') : t('home.open'))}</a>`); acts.appendChild(open);
    if (o.state === 'had') { const u = el(`<button class="link">${esc(t('home.undo'))}</button>`); u.addEventListener('click', () => { const h = had(); delete h[c.id]; store('had', h); home(); }); acts.appendChild(u); }
    else if (o.state !== 'done' && c.n > 0 && !o.demo) {
      const b = el(`<button class="btn quiet">${esc(t('home.had'))}</button>`);
      b.addEventListener('click', () => {
        if ($('.ask', li)) return;
        const ask = el(`<div class="ask"><span>${esc(t('home.hadAsk', { n: c.n }))}</span><button class="btn yes">${esc(t('home.hadYes'))}</button><button class="btn sec no">${esc(t('home.hadNo'))}</button></div>`);
        $('.yes', ask).addEventListener('click', () => { const h = had(); h[c.id] = true; store('had', h); home(); });
        $('.no', ask).addEventListener('click', () => ask.remove());
        li.appendChild(ask); $('.yes', ask).focus();
      });
      acts.appendChild(b);
    }
  }
  return li;
}
function home() {
  clearTimers(); closePop(); S.cur = null;
  document.body.className = 'sw-00 is-home'; document.title = t('app.title');
  const ix = S.index, h = had(), d = done();
  const main = S.host; main.innerHTML = '';
  const wrap = el(`<div class="cw-home"><h1>${esc(t('app.title'))}</h1><p class="sub">${esc(ix.intro)}</p><div class="head"><span>${esc(ix.header)}</span><span class="tally"></span></div><ul class="cw-cards"></ul><p class="later"></p></div>`);
  const ul = $('.cw-cards', wrap);
  const mains = ix.chapters.filter(c => c.n >= 1 && c.n <= 13);
  const allMain = mains.every(c => d[c.id] || h[c.id]);
  let lit = false, nd = 0;
  ix.chapters.forEach(c => {
    if (c.hidden && !allMain) return;
    const tk = ticks(c.id); const k = c.steps.filter(id => tk[id]).length; const tt = c.steps.length;
    const state = d[c.id] ? 'done' : h[c.id] ? 'had' : 'open';
    if (c.n >= 1 && c.n <= 13 && state !== 'open') nd++;
    const isLit = !lit && c.built && state === 'open'; if (isLit) lit = true;
    ul.appendChild(card(c, { k, tt, state, lit: isLit, expected: ix.expected.includes(c.n) }));
  });
  $('.tally', wrap).textContent = t('home.tally', { d: nd, t: mains.length });
  $('.later', wrap).textContent = allMain ? t('home.reveal') : '';
  main.appendChild(wrap); scrollTo(0, 0);
}

/* ---------- chapter and screen ---------- */
function allMainDone() { const h = had(), d = done(); return S.index.chapters.filter(c => c.n >= 1 && c.n <= 13).every(c => d[c.id] || h[c.id]); }
async function chapter(id, key) {
  const ixc = S.index.chapters.find(c => c.id === id);
  if (!ixc || !ixc.built || (ixc.hidden && !allMainDone())) { history.replaceState(null, '', '#cw'); return home(); }
  if (S.api.open && S.opened !== id) S.api.open(id);
  S.opened = id;
  const ch = S.ch[id] || (S.ch[id] = await getJSON(S.base + 'ch' + id + '.json'));
  const all = flat(ch), tk = ticks(id), sn = seen(id);
  if (!key || !all.find(x => x.key === key)) {
    const next = all.find(x => { const ids = idsOf(x.sc.blocks); return ids.length ? !ids.every(i => tk[i]) : !sn[x.key]; }) || all[0];
    key = next.key; history.replaceState(null, '', '#cw/' + id + '/' + key);
  }
  clearTimers(); closePop();
  const cur = all.find(x => x.key === key), idx = all.indexOf(cur);
  sn[key] = true; store('seen:' + id, sn); store('at:' + id, key);
  const wordsFirst = {}; (ch.glossary || []).forEach(g => { wordsFirst[g[0]] = null; });
  all.forEach(x => x.sc.blocks.forEach(b => { if (b.words) b.words.forEach(w => { wordsFirst[w[0]] = w[2]; }); }));
  const ctx = { chId: id, ch, key, all, idx, cur, words: wordsFirst };
  S.cur = ctx;
  document.body.className = 'sw-' + id; document.title = ch.title + ' · ' + t('app.title');
  const main = S.host; main.innerHTML = '';
  const top = el(`<div><a class="cw-crumb" href="#cw">‹ ${esc(t('home.crumb'))}</a><div class="cw-top"><div class="num">${ch.n === 0 ? '★' : ch.n}</div><div><h1>${esc(ch.title)}</h1><p class="one">${esc(ch.one)}</p></div></div></div>`);
  main.appendChild(top);
  /* stage rail */
  const rail = el(`<ol class="cw-stages"></ol>`);
  ch.stages.forEach((st, si) => {
    const ok = st.screens.every(sc => { const ids = idsOf(sc.blocks); return ids.length ? ids.every(i => tk[i]) : sn[st.id + '-' + sc.id]; });
    rail.appendChild(el(`<li><a class="cw-pill${si === cur.si ? ' on' : ''}${ok && si !== cur.si ? ' ok' : ''}" href="#cw/${id}/${st.id}-${st.screens[0].id}"><i>${ok && si !== cur.si ? '' : si + 1}</i><span class="tt">${esc(st.title)}</span></a></li>`));
  });
  main.appendChild(rail);
  const dots = el(`<div class="cw-dots"></div>`);
  cur.st.screens.forEach((sc, ki) => {
    const k2 = cur.st.id + '-' + sc.id; const ids = idsOf(sc.blocks); const ok = ids.length ? ids.every(i => tk[i]) : sn[k2];
    const b = el(`<button class="dot${ki === cur.ki ? ' on' : ''}${ok && ki !== cur.ki ? ' ok' : ''}" aria-label="${esc(t('stage.screen', { k: ki + 1, t: cur.st.screens.length }))}"></button>`);
    b.addEventListener('click', () => { location.hash = '#cw/' + id + '/' + k2; }); dots.appendChild(b);
  });
  dots.appendChild(el(`<span class="lab">${esc(t('stage.screen', { k: cur.ki + 1, t: cur.st.screens.length }))}</span>`));
  main.appendChild(dots);
  /* the screen */
  const scr = el(`<section class="cw-screen" data-key="${key}"><p class="cw-where">${esc(t('where.line', { c: ch.n, s: cur.si + 1, k: cur.ki + 1, t: cur.st.screens.length }))}</p><h2>${esc(cur.sc.title)}</h2></section>`);
  const nodes = renderBlocks(cur.sc.blocks, ctx);
  nodes.forEach(n => scr.appendChild(n));
  scr.appendChild(foot(ctx));
  main.appendChild(scr);
  scrollTo(0, 0);
  requestAnimationFrame(() => $$('.cw-code', scr).forEach(c => c._after && c._after()));
}
function tickAll(ctx) {
  const tk = ticks(ctx.chId); idsOf(ctx.cur.sc.blocks).forEach(i => { tk[i] = true; }); store('ticks:' + ctx.chId, tk);
  $$('.cw-check .tk', S.host).forEach(b => { b.classList.add('on'); b.setAttribute('aria-pressed', 'true'); });
}
function go(ctx, step) {
  const n = ctx.all[ctx.idx + step];
  location.hash = n ? '#cw/' + ctx.chId + '/' + n.key : '#cw';
}
function foot(ctx) {
  const sc = ctx.cur.sc, ids = idsOf(sc.blocks), tk = ticks(ctx.chId), all = ids.length > 0 && ids.every(i => tk[i]);
  const f = el(`<div class="cw-foot"></div>`);
  const back = el(`<a class="back" href="${ctx.idx > 0 ? '#cw/' + ctx.chId + '/' + ctx.all[ctx.idx - 1].key : '#cw'}">${esc(t('foot.back'))}</a>`); f.appendChild(back);
  const kind = sc.foot || 'next';
  const sw = getComputedStyle(document.body).getPropertyValue('--sw').trim();
  if (kind === 'next') {
    const b = el(`<button class="btn big">${esc(t('foot.next'))}</button>`); b.addEventListener('click', () => go(ctx, 1)); f.appendChild(b);
  } else if (kind === 'done' || kind === 'have') {
    if (all) { f.appendChild(el(`<span class="ticked">✓ ${esc(t('foot.ticked'))}</span>`)); const b = el(`<button class="btn sec">${esc(t('foot.next'))}</button>`); b.addEventListener('click', () => go(ctx, 1)); f.appendChild(b); }
    else { const b = el(`<button class="btn big">${esc(t(kind === 'have' ? 'foot.have' : 'foot.done'))}</button>`); b.addEventListener('click', () => { tickAll(ctx); b.disabled = true; b.textContent = '✓ ' + t('foot.ticked'); later(() => go(ctx, 1), 700); }); f.appendChild(b); }
  } else if (kind === 'chapter-done') {
    if (done()[ctx.chId]) { f.appendChild(el(`<span class="ticked">✓ ${esc(t('foot.chapterDone', { n: ctx.ch.n }))}</span>`)); const b = el(`<a class="btn sec" href="#cw">${esc(t('foot.chapterDoneSub'))}</a>`); f.appendChild(b); }
    else {
      const b = el(`<button class="btn big gold">${esc(t('foot.chapterDone', { n: ctx.ch.n }))}</button>`);
      b.addEventListener('click', () => { tickAll(ctx); const d = done(); d[ctx.chId] = true; store('done', d); b.disabled = true; confetti([sw, '#FFC53D', '#4F2D9E', '#1B7F3B']); later(() => { location.hash = '#cw'; }, 1300); });
      f.appendChild(b); f.appendChild(el(`<span class="note">${esc(t('foot.chapterDoneSub'))}</span>`));
    }
  }
  return f;
}
function refreshFoot(ctx) { const old = $('.cw-foot', S.host); if (old) old.replaceWith(foot(ctx)); }

/* ---------- routes and boot ---------- */
function route() {
  const m = location.hash.match(/^#cw(?:\/(\d\d)(?:\/([\d]+-[\d]+))?)?$/);
  if (!m || !m[1]) { S.opened = null; return Promise.resolve(home()); }
  return chapter(m[1], m[2]).catch(e => { console.error(e); home(); });
}
function shell() {
  /* the toast, the names sheet and the confetti live on the body, once */
  if (!$('#toast')) document.body.appendChild(el(`<div class="toast" id="toast" role="status" aria-live="polite"></div>`));
  if (!$('#sheet')) {
    document.body.appendChild(el(`<div class="sheet-wrap" id="sheet"><button class="dim" aria-label="${esc(t('sheet.close'))}"></button><aside class="sheet" role="dialog" aria-modal="true"><div class="sheet-top"><h2></h2><button class="close" aria-label="${esc(t('sheet.close'))}">×</button></div><div class="sheet-body"></div></aside></div>`));
    $('#sheet .dim').addEventListener('click', closeSheet); $('#sheet .close').addEventListener('click', closeSheet);
  }
  if (!$('#confetti')) document.body.appendChild(el(`<canvas class="confetti" id="confetti" hidden></canvas>`));
}
let ready = null;
function mount(host, opts) {
  S.host = host; S.base = opts.base || S.base; S.api = opts.api || {};
  if (opts.strings) S.T = opts.strings;
  if (new URLSearchParams(location.search).get('fast')) S.fast = true;
  document.documentElement.classList.toggle('no-motion', S.fast);
  shell();
  ready = Promise.all([getJSON(S.base + 'index.json'), getJSON(S.base + 'controls.json'), getJSON(S.base + 'names.json'), getJSON(S.base + 'ch00.json')])
    .then(([ix, co, nm, c0]) => { S.index = ix; S.controls = co; S.names = nm; S.ch['00'] = c0; });
  return ready;
}
/* the platform calls show on every #cw hash; it resolves to the chapter on screen (or null on the checklist) */
function show(hash) {
  if (hash && location.hash !== hash) history.replaceState(null, '', hash);
  return ready.then(route).then(() => (S.cur ? { n: S.cur.ch.n, title: S.cur.ch.title } : null), e => { console.error(e); S.host.textContent = t('cw.failed'); return null; });
}
window.CW = { S, mount, show, openSheet, route };
})();
