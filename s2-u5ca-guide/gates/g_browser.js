/* S2 browser gates on the built platform (DESIGN_SPEC 14): G5 no copy, G12 sizes, G14 hidden chapter 14.
 *   NODE_PATH=$(npm root -g) node s2-u5ca-guide/gates/g_browser.js [G5|G12|G14] [--control]
 *   Needs the dev server on S2_BASE (default http://127.0.0.1:8851). G14 starts its own dev server on 8853 over a planted
 *   copy of content/ (gates/_ctl/g14: chapter 14 stubbed as built, so the hidden rule is exercised before it is written).
 *   Controls, which must FAIL:  G5  the `.ln [data-t]::before` rule removed, and the code planted as a text node
 *                               G14 chapter 14 with its hidden flag removed: 13 undone still opens it
 *                               G12 a screen padded 2400 px taller */
const puppeteer = require('puppeteer'); const fs = require('fs'); const path = require('path'); const { spawn } = require('child_process');
const D = path.resolve(__dirname, '..'); const BASE = process.env.S2_BASE || 'http://127.0.0.1:8851';
const CTL = process.argv.includes('--control'); const ONLY = process.argv.slice(2).filter((a) => /^G\d+$/.test(a));
const want = (g) => !ONLY.length || ONLY.includes(g);
const OWNER = 'dgartland021@c2ken.net', P = 'pupil8@c2ken.net';
const IX = JSON.parse(fs.readFileSync(path.join(D, 'content', 'index.json'), 'utf8'));
const screensOf = (id, dir) => { const c = JSON.parse(fs.readFileSync(path.join(dir || path.join(D, 'content'), 'ch' + id + '.json'), 'utf8')); const o = []; c.stages.forEach((st) => st.screens.forEach((sc) => o.push(st.id + '-' + sc.id))); return o; };
const post = async (base, p, body, who) => (await fetch(base + p, { method: 'POST', headers: { 'content-type': 'application/json', 'x-dev-user': who || '' }, body: JSON.stringify(body || {}) })).json();
const settle = (ms) => new Promise((r) => setTimeout(r, ms));
const lines = []; let fails = 0;
const res = (g, pass, d) => { lines.push(g + ' ' + (pass ? 'PASS' : 'FAIL') + (d ? ' — ' + d : '') + (CTL ? ' [control]' : '')); if (!pass) fails++; };
async function open(browser, base, cls, hash, vp) {
  const page = await browser.newPage(); await page.setViewport({ width: vp[0], height: vp[1], deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(base + '/?class=' + cls + '&as=' + P + '&fast=1' + hash, { waitUntil: 'networkidle0' });
  return page;
}
const go = async (page, hash, sel) => { await page.evaluate((h) => { location.hash = h; }, hash); if (sel) await page.waitForSelector(sel, { timeout: 15000 }); await settle(300); };
async function klass(base, tag) { const cls = 'S2-G' + tag + '-' + (Date.now() % 100000); await post(base, '/api/apiStaff', { op: 'create', name: cls }, OWNER); await post(base, '/api/apiBoot', { cls }, P); return cls; }

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 60000 });
  const built = IX.chapters.filter((c) => c.built && !c.hidden).map((c) => c.id);
  // ---- G5 no copy: every code screen of every built chapter
  if (want('G5')) {
    const cls = await klass(BASE, '5'); const page = await open(browser, BASE, cls, '#cw', [1500, 1000]); await page.waitForSelector('.cw-cards');
    const bad = []; let n = 0;
    for (const ch of built) for (const key of screensOf(ch)) {
      await go(page, '#cw/' + ch + '/' + key, `.cw-screen[data-key="${key}"]`);
      if (!(await page.$('.cw-code'))) continue;
      if (CTL) await page.evaluate(() => {
        for (const sh of document.styleSheets) { let r; try { r = sh.cssRules; } catch (e) { continue; } for (let i = r.length - 1; i >= 0; i--) if (/\[data-t\]::before/.test(r[i].selectorText || '')) sh.deleteRule(i); }
        document.querySelectorAll('.cw-code .ln [data-t]').forEach((s) => { s.textContent = s.getAttribute('data-t'); });
      });
      n++;
      const r = await page.evaluate(() => {
        const body = document.querySelector('.cw-code .cbody'), spans = [...body.querySelectorAll('.ln [data-t]')];
        const code = [...body.querySelectorAll('.ln')].map((l) => [...l.querySelectorAll('[data-t]')].map((s) => s.getAttribute('data-t')).join('').trim()).filter((t) => t.length > 14);   // a short line such as !rbA.Checked may be named in the prose
        const drawn = spans.filter((s) => (s.getAttribute('data-t') || '').trim()).every((s) => getComputedStyle(s, '::before').content === JSON.stringify(s.getAttribute('data-t')));
        const sel = getSelection(); sel.removeAllRanges(); const rg = document.createRange(); rg.selectNodeContents(document.body); sel.addRange(rg);
        const all = sel.toString(); let clip = ''; const grab = (e) => { clip = e.clipboardData ? e.clipboardData.getData('text/plain') : ''; };
        document.addEventListener('copy', grab); document.execCommand('copy'); document.removeEventListener('copy', grab); sel.removeAllRanges();
        const leaked = code.filter((t) => all.includes(t) || (clip && clip.includes(t)));
        const fire = (type) => { const e = new Event(type, { cancelable: true, bubbles: true }); body.dispatchEvent(e); return e.defaultPrevented; };
        const blocked = ['copy', 'cut', 'dragstart', 'contextmenu'].every(fire);
        return { drawn, leaked: leaked.slice(0, 2), blocked, toast: document.querySelector('#toast').classList.contains('on'), us: getComputedStyle(body).userSelect };
      });
      if (!r.drawn) bad.push(ch + '/' + key + ' code not drawn by ::before');
      if (r.leaked.length) bad.push(ch + '/' + key + ' code in the selection: ' + r.leaked.join(' | '));
      if (!r.blocked || !r.toast || r.us !== 'none') bad.push(ch + '/' + key + ' copy/drag/menu not blocked ' + JSON.stringify(r));
    }
    res('G5 no copy', !bad.length && n > 0, n + ' code screens' + (bad.length ? '; ' + bad.slice(0, 4).join('; ') : ''));
    await page.close();
  }
  // ---- G12 sizes at 1500x1000
  if (want('G12')) {
    const cls = await klass(BASE, '12'); const sized = IX.chapters.filter((c) => c.built).map((c) => c.id);   // hidden 14 too, opened as a pupil who has done 1 to 13
    if (sized.length > built.length) { for (let k = 1; k <= 12; k++) await post(BASE, '/api/apiCw', { cls, op: 'had', ch: String(k).padStart(2, '0'), v: 1 }, P); await post(BASE, '/api/apiCw', { cls, op: 'done', ch: '13', on: true }, P); }
    const page = await open(browser, BASE, cls, '#cw', [1500, 1000]); await page.waitForSelector('.cw-cards');
    const bad = []; let n = 0, tallest = 0;
    for (const ch of sized) for (const key of screensOf(ch)) {
      await go(page, '#cw/' + ch + '/' + key, `.cw-screen[data-key="${key}"]`); await settle(300); n++;
      if (CTL && n === 1) await page.evaluate(() => { document.querySelector('.cw-screen').appendChild(Object.assign(document.createElement('div'), { style: 'height:2400px' })); });
      const m = await page.evaluate(() => ({ h: Math.max(document.documentElement.scrollHeight, ...[...document.querySelectorAll('body *')].filter((e) => !e.closest('.cw-code') && /auto|scroll/.test(getComputedStyle(e).overflowY)).map((e) => e.scrollHeight)), code: !!document.querySelector('.cw-code'), inner: [...document.querySelectorAll('.cw-code .cbody')].some((b) => b.scrollHeight > b.clientHeight + 2) }));
      const lim = m.code ? 2200 : 1900; tallest = Math.max(tallest, m.h);
      if (m.h > lim) bad.push(ch + '/' + key + ' ' + m.h + 'px > ' + lim);
      if (m.inner) bad.push(ch + '/' + key + ' a code card scrolls inside');
    }
    // a phone can reach the bottom of the screen: the page itself scrolls at 390 px (found in the own look, 18 Oct 2026)
    await page.setViewport({ width: 390, height: 800 }); await settle(400);
    if (CTL) await page.evaluate(() => { document.querySelector('#app').style.cssText = 'height:100vh;overflow:hidden'; });
    const ph = await page.evaluate(() => { const s = document.querySelector('.cw-screen'); return { doc: document.documentElement.scrollHeight, end: s.getBoundingClientRect().bottom + scrollY }; });
    if (ph.doc + 2 < ph.end) bad.push('at 390 px the page stops at ' + ph.doc + 'px but the screen ends at ' + Math.round(ph.end) + 'px');
    res('G12 sizes', !bad.length && n > 0, n + ' screens, tallest ' + tallest + 'px' + (bad.length ? '; ' + bad.slice(0, 4).join('; ') : ''));
    await page.close();
  }
  // ---- G14 hidden chapter 14, on a planted copy served by a second dev server
  if (want('G14')) {
    const CP = path.join(__dirname, '_ctl', 'g14'); fs.rmSync(CP, { recursive: true, force: true }); fs.cpSync(path.join(D, 'content'), CP, { recursive: true });
    const ix = JSON.parse(fs.readFileSync(path.join(CP, 'index.json'), 'utf8')); const c14 = ix.chapters.find((c) => c.id === '14');
    if (!c14.built) { const stub = JSON.parse(fs.readFileSync(path.join(CP, 'ch07.json'), 'utf8')); stub.id = '14'; stub.n = 14; fs.writeFileSync(path.join(CP, 'ch14.json'), JSON.stringify(stub)); c14.built = true; }
    if (CTL) delete c14.hidden;
    fs.writeFileSync(path.join(CP, 'index.json'), JSON.stringify(ix));
    const first = screensOf('14', CP)[0], B2 = 'http://127.0.0.1:8853';
    fs.mkdirSync(path.join(__dirname, '_out'), { recursive: true }); const store = path.join(__dirname, '_out', 'g14-store.json'); fs.rmSync(store, { force: true });
    const srv = spawn(process.execPath, [path.join(D, 'tools', 'dev-server.js'), '8853'], { env: Object.assign({}, process.env, { S2_CONTENT: CP, S2_STORE: store }), stdio: 'ignore' });
    try {
      for (let i = 0; i < 40; i++) { try { await fetch(B2 + '/__store', { method: 'POST' }); break; } catch (e) { await settle(150); } }
      const cls = await klass(B2, '14'); const cw = (req) => post(B2, '/api/apiCw', Object.assign({ cls }, req), P);
      for (let n = 1; n <= 12; n++) await cw({ op: 'had', ch: String(n).padStart(2, '0'), v: 1 });   // 1 to 12 had, 13 undone
      let page = await open(browser, B2, cls, '#cw/14/' + first, [1500, 1000]); await settle(1200);
      const before = await page.evaluate(() => ({ hash: location.hash, card: !!document.querySelector('.cw-card[data-ch="14"]'), later: (document.querySelector('.later') || {}).textContent || '' }));
      await page.close();
      await cw({ op: 'done', ch: '13', on: true });
      page = await open(browser, B2, cls, '#cw', [1500, 1000]); await page.waitForSelector('.cw-cards'); await settle(600);
      const home = await page.evaluate(() => ({ card: !!document.querySelector('.cw-card[data-ch="14"]'), later: [...document.querySelectorAll('.later')].map((x) => x.textContent).filter(Boolean) }));
      await go(page, '#cw/14/' + first); await settle(800);
      const after = await page.evaluate((k) => ({ hash: location.hash, screen: !!document.querySelector(`.cw-screen[data-key="${k}"]`) }), first);
      await page.close();
      const reveal = JSON.parse(fs.readFileSync(path.join(D, 'src', 'strings-s2.json'), 'utf8'))['home.reveal'];
      const ok1 = before.hash === '#cw' && !before.card && !before.later, ok2 = home.card && home.later.length === 1 && home.later[0] === reveal, ok3 = after.screen && after.hash.startsWith('#cw/14/');
      res('G14 hidden 14', ok1 && ok2 && ok3, 'before ' + JSON.stringify(before) + ' · home ' + JSON.stringify(home) + ' · after ' + JSON.stringify(after));
    } finally { srv.kill(); }
  }
  await browser.close();
  console.log(lines.join('\n')); process.exit(fails ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
