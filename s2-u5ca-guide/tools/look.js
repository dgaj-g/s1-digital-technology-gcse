// The design window's own look (DFM 290 / feedback_design_window_own_look): every screen of ch00 and ch07 at 1500x1000 and 390x844.
// Run: NODE_PATH=$(npm root -g) node tools/look.js   (server: python3 -m http.server 8852 from _design)
const puppeteer = require('puppeteer'); const fs = require('fs'); const path = require('path');
const D = path.resolve(__dirname, '..'); const OUT = path.join(D, 'proto', 'look'); const BASE = 'http://127.0.0.1:8852/proto/';
const VPS = [{ n: 'desk', w: 1500, h: 1000 }, { n: 'phone', w: 390, h: 844 }];
const CHS = ['00', '07'];
const screensOf = id => { const ch = JSON.parse(fs.readFileSync(path.join(D, 'content', 'ch' + id + '.json'))); const out = []; ch.stages.forEach(st => st.screens.forEach(sc => out.push(st.id + '-' + sc.id))); return out; };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 60000 });
  const report = []; const problems = [];
  for (const vp of VPS) {
    fs.mkdirSync(path.join(OUT, vp.n), { recursive: true });
    const page = await browser.newPage(); await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
    const errs = [];
    page.on('console', m => { if (m.type() !== 'error') return; const u = (m.location() && m.location().url) || ''; if (/\/img\//.test(u) || /\/img\//.test(m.text())) return; errs.push('console: ' + m.text()); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('response', r => { if (r.status() >= 400 && !/img\/cap\//.test(r.url())) errs.push('http ' + r.status() + ' ' + r.url()); });
    const measure = async (label) => {
      const m = await page.evaluate(() => {
        const iw = innerWidth, ih = innerHeight; const de = document.documentElement;
        const over = []; document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && r.right > iw + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.cw-pre')) over.push(e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '') + ' right=' + Math.round(r.right)); });
        const txt = document.body.innerText; const bad = (txt.match(/\[[a-z]+\.[A-Za-z.]+\]|undefined|NaN|\bnull\b/g) || []);
        const wb = document.querySelector('header .where'); const where = wb ? getComputedStyle(wb).display : 'missing'; const isHome = document.body.classList.contains('is-home');
        return { raw: /\[\[[^\]]*\]\]/.test(document.body.innerText), where, isHome, sw: de.scrollWidth, iw, sh: de.scrollHeight, ih, hasCode: !!document.querySelector(".cw-code"), over: over.slice(0, 6), bad: bad.slice(0, 6), fonts: Array.from(document.fonts).filter(f => f.status === 'loaded').map(f => f.family).filter((v, i, a) => a.indexOf(v) === i) };
      });
      const row = { vp: vp.n, label, ...m, errs: errs.splice(0) };
      report.push(row);
      if (m.sw > m.iw + 1) problems.push(`${vp.n} ${label}: sideways scroll ${m.sw} > ${m.iw}`);
      if (m.over.length) problems.push(`${vp.n} ${label}: overflow ${m.over.join('; ')}`);
      if (m.bad.length) problems.push(`${vp.n} ${label}: bad text ${m.bad.join(', ')}`);
      if (m.raw) problems.push(`${vp.n} ${label}: raw [[word]] markup shown on screen`);
      if (vp.n === 'desk' && !/^home/.test(label)) { const lim = m.hasCode ? 2200 : 1900; if (m.sh > lim) problems.push(`${vp.n} ${label}: tall ${m.sh}px (G12 limit ${lim}${m.hasCode ? ', code screen' : ''})`); }
      if (m.where === 'missing') problems.push(`${vp.n} ${label}: header button missing`); else if (m.isHome && m.where !== 'none') problems.push(`${vp.n} ${label}: home shows the header button`); else if (!m.isHome && m.where === 'none') problems.push(`${vp.n} ${label}: chapter hides the header button`);
      row.errs.forEach(e => problems.push(`${vp.n} ${label}: ${e}`));
      return m;
    };
    const shot = async (name) => page.screenshot({ path: path.join(OUT, vp.n, name + '.png'), fullPage: true });
    const settle = async (ms) => new Promise(r => setTimeout(r, ms));
    // home, seeded as the absent pupil
    await page.goto(BASE + '?reset=1&state=absent&fast=1#cw', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.cw-cards'); await settle(600); await measure('home-absent'); await shot('home-absent');
    // home for a brand-new pupil
    await page.goto(BASE + '?reset=1&state=new&fast=1#cw', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.cw-cards'); await settle(400); await measure('home-new'); await shot('home-new');
    // the "I did this already" ask
    await page.evaluate(() => { const b = document.querySelector('.cw-card[data-ch="01"] .btn.quiet'); b && b.click(); }); await settle(300); await shot('home-ask');
    for (const ch of CHS) {
      for (const key of screensOf(ch)) {
        await page.evaluate(k => { location.hash = k; }, '#cw/' + ch + '/' + key);
        await page.waitForSelector(`.cw-screen[data-key="${key}"]`); await settle(900);
        await measure(ch + '/' + key); await shot(ch + '-' + key);
      }
    }
    // interactions on chapter 7
    await page.evaluate(() => { location.hash = '#cw/07/2-4'; }); await page.waitForSelector('.cw-screen[data-key="2-4"]'); await settle(500);
    const copyBlocked = await page.evaluate(() => { const b = document.querySelector('.cw-code .cbody'); const ev = new Event('copy', { cancelable: true, bubbles: true }); b.dispatchEvent(ev); return { prevented: ev.defaultPrevented, toast: document.querySelector('#toast').classList.contains('on'), sel: getComputedStyle(b).userSelect }; });
    report.push({ vp: vp.n, label: 'G5 no-copy', ...copyBlocked });
    if (!copyBlocked.prevented || !copyBlocked.toast || copyBlocked.sel !== 'none') problems.push(`${vp.n} G5: copy not blocked ${JSON.stringify(copyBlocked)}`);
    await page.click('.cw-code .w-on'); await settle(400); await measure('07/2-4 walk'); await shot('07-2-4-walk');
    await page.click('.cw-code .w-next'); await settle(300); await shot('07-2-4-walk2');
    await page.evaluate(() => { location.hash = '#cw/07/1-1'; }); await page.waitForSelector('.cw-screen[data-key="1-1"]'); await settle(400);
    await page.click('.cw-check .tk'); await settle(600); await shot('07-1-1-tick');
    await page.click('.cw-foot .btn'); await settle(1200); await measure('after have'); await shot('07-after-have');
    await page.evaluate(() => { location.hash = '#cw/07/5-1'; }); await page.waitForSelector('.cw-screen[data-key="5-1"]'); await settle(300);
    await page.evaluate(() => { const l = document.querySelector('.cw-names .how'); l && l.click(); }); await settle(500); await measure('sheet'); await shot('07-5-1-sheet');
    await page.evaluate(() => document.querySelector('#sheet .close').click());
    // typewriter, un-fast: chapter 7 2-4 at real speed, shot at 1.5 s
    await page.goto(BASE + '#cw/07/2-4', { waitUntil: 'networkidle0' }); await page.waitForSelector('.cw-screen[data-key="2-4"]'); await settle(2300); await shot('07-2-4-typing');
    // G-MOVE (SPEC 7.5): something visibly moves on every screen, in the first viewport, at real speed
    if (vp.n === 'desk') {
      const sharp = require('sharp');
      const diff = async (x, y) => { const A = await sharp(x).raw().toBuffer({ resolveWithObject: true }); const B = await sharp(y).raw().toBuffer(); const ch = A.info.channels; let n = 0; for (let i = 0; i < A.data.length; i += ch) { if (Math.abs(A.data[i] - B[i]) > 40 || Math.abs(A.data[i + 1] - B[i + 1]) > 40 || Math.abs(A.data[i + 2] - B[i + 2]) > 40) n++; } return +(100 * n / (A.info.width * A.info.height)).toFixed(2); };
      await page.goto(BASE + '?reset=1&state=absent#cw', { waitUntil: 'networkidle0' }); await page.waitForSelector('.cw-cards');
      for (const ch of CHS) for (const key of screensOf(ch)) {
        await page.evaluate(k => { location.hash = k; }, '#cw/' + ch + '/' + key);
        await page.waitForSelector(`.cw-screen[data-key="${key}"]`);
        const s1 = await page.screenshot(); await settle(700); const s2 = await page.screenshot(); await settle(800); const s3 = await page.screenshot();
        const ab = await diff(s1, s2), bc = await diff(s2, s3);
        report.push({ vp: vp.n, label: 'motion ' + ch + '/' + key, ab, bc });
        if (ab < 0.4 || bc < 0.15) problems.push(`motion ${ch}/${key}: ${ab}% then ${bc}% of pixels changed (G-MOVE needs 0.4 then 0.15)`);
      }
    }
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
  const md = ['# Own look · ' + new Date().toISOString().slice(0, 16), '', 'Viewports: ' + VPS.map(v => v.n + ' ' + v.w + 'x' + v.h).join(', '), '', '## Problems (' + problems.length + ')', ...problems.map(p => '- ' + p), '', '## Measurements', '| vp | screen | scrollW/innerW | scrollH/innerH | errors |', '|---|---|---|---|---|', ...report.filter(r => r.sw).map(r => `| ${r.vp} | ${r.label} | ${r.sw}/${r.iw} | ${r.sh}/${r.ih} | ${r.errs.length} |`), '', '## G-MOVE: pixels changed in the first viewport (0.1 s to 0.8 s, then 0.8 s to 1.6 s)', '| screen | first | second |', '|---|---|---|', ...report.filter(r => r.ab != null).map(r => `| ${r.label.replace('motion ', '')} | ${r.ab}% | ${r.bc}% |`)];
  fs.writeFileSync(path.join(OUT, 'REPORT.md'), md.join('\n') + '\n');
  console.log('problems: ' + problems.length); problems.slice(0, 40).forEach(p => console.log(' - ' + p));
  console.log('fonts loaded (desk home): ' + (report[0].fonts || []).join(', '));
})().catch(e => { console.error(e); process.exit(1); });
