// The build window's own look (BUILD prompt step 7, DESIGN_SPEC 7.5 and 7.6) on the BUILT platform: every screen of chapters 0 to 14
// at 1500x1000 and 390x844, the home and the landing, then G-MOVE (something visibly moves in the first viewport) on every screen.
// Run: NODE_PATH=$(npm root -g) node s2-u5ca-guide/gates/ownlook.js   (dev server on 8851) → gates/_out/ownlook/{desk,phone}/*.png + REPORT.md
const puppeteer = require('puppeteer'); const fs = require('fs'); const path = require('path');
const D = path.resolve(__dirname, '..'); const OUT = path.join(__dirname, '_out', 'ownlook'); const BASE = process.env.S2_BASE || 'http://127.0.0.1:8851';
const VPS = [{ n: 'desk', w: 1500, h: 1000 }, { n: 'phone', w: 390, h: 844 }];
const CHS = JSON.parse(fs.readFileSync(path.join(D, 'content', 'index.json'))).chapters.map(c => c.id);
const screensOf = id => { const ch = JSON.parse(fs.readFileSync(path.join(D, 'content', 'ch' + id + '.json'))); const out = []; ch.stages.forEach(st => st.screens.forEach(sc => out.push(st.id + '-' + sc.id))); return out; };
const post = async (p, body, who) => (await fetch(BASE + p, { method: 'POST', headers: { 'content-type': 'application/json', 'x-dev-user': who }, body: JSON.stringify(body) })).json();
const settle = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const P = 'pupil8@c2ken.net', cls = 'S2-OWN-' + (Date.now() % 100000);
  await post('/api/apiStaff', { op: 'create', name: cls }, 'dgartland021@c2ken.net'); await post('/api/apiBoot', { cls }, P);
  const NEW = 'pupil7@c2ken.net'; await post('/api/apiBoot', { cls }, NEW);
  for (let k = 1; k <= 12; k++) await post('/api/apiCw', { cls, op: 'had', ch: String(k).padStart(2, '0'), v: 1 }, P);
  await post('/api/apiCw', { cls, op: 'done', ch: '13', on: true }, P);   // so chapter 14 opens
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const report = [], problems = [];
  for (const vp of VPS) {
    fs.mkdirSync(path.join(OUT, vp.n), { recursive: true });
    const page = await browser.newPage(); await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
    const errs = [];
    page.on('console', m => { if (m.type() === 'error' && !/img\/cap\/p\d/.test(m.text())) errs.push('console: ' + m.text()); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('response', r => { if (r.status() >= 400 && !/img\/cap\/p\d|favicon/.test(r.url())) errs.push('http ' + r.status() + ' ' + r.url()); });
    const measure = async (label, isHome) => {
      const m = await page.evaluate(() => {
        const iw = innerWidth, de = document.documentElement; const over = [];
        document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && r.right > iw + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.cw-pre, .cbody, pre')) over.push(e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className ? '.' + e.className.split(' ')[0] : '') + ' right=' + Math.round(r.right)); });
        const txt = document.body.innerText;
        const ph = [...document.querySelectorAll('.ph')].filter(e => e.offsetParent).length;
        return { stale: txt.includes('Reload to get the latest'), raw: /\[\[[^\]]*\]\]/.test(txt), bad: (txt.match(/\[[a-z]+\.[A-Za-z.]+\]|\bundefined\b|\bNaN\b|\{[a-z]+\}/g) || []).slice(0, 6), sw: de.scrollWidth, iw, sh: de.scrollHeight, hasCode: !!document.querySelector('.cw-code'), over: over.slice(0, 5), ph };
      });
      const row = { vp: vp.n, label, ...m, errs: errs.splice(0) }; report.push(row);
      if (m.sw > m.iw + 1) problems.push(`${vp.n} ${label}: sideways scroll ${m.sw} > ${m.iw}`);
      if (m.over.length) problems.push(`${vp.n} ${label}: overflow ${m.over.join('; ')}`);
      if (m.bad.length) problems.push(`${vp.n} ${label}: bad text ${m.bad.join(', ')}`);
      if (m.stale) problems.push(`${vp.n} ${label}: the stale-build line shows (the page and server stamps differ)`);
      if (m.raw) problems.push(`${vp.n} ${label}: raw [[word]] markup on screen`);
      if (m.ph) problems.push(`${vp.n} ${label}: ${m.ph} "Picture to come" placeholder(s) showing`);
      if (vp.n === 'desk' && !isHome) { const lim = m.hasCode ? 2200 : 1900; if (m.sh > lim) problems.push(`${vp.n} ${label}: tall ${m.sh}px (limit ${lim})`); }
      row.errs.forEach(e => problems.push(`${vp.n} ${label}: ${e}`));
    };
    const shot = name => page.screenshot({ path: path.join(OUT, vp.n, name + '.png'), fullPage: true });
    // the landing and its pop-up (a static page: opened from disk)
    await page.goto('file://' + path.join(D, 'index.html'), { waitUntil: 'load' }); await settle(500); await measure('landing', true); await shot('landing');
    await page.click('#open'); await settle(600); await shot('landing-pop-1');
    await page.evaluate(() => document.querySelectorAll('.dot')[1].click()); await settle(300); await shot('landing-pop-2');
    errs.splice(0);
    // home: a brand-new pupil, then the pupil who has done 1 to 13
    await page.goto(BASE + '/?class=' + cls + '&as=' + NEW + '&fast=1#cw', { waitUntil: 'networkidle0' }); await page.waitForSelector('.cw-cards'); await settle(800); await measure('home-new', true); await shot('home-new');
    await page.goto(BASE + '/?class=' + cls + '&as=' + P + '&fast=1#cw', { waitUntil: 'networkidle0' }); await page.waitForSelector('.cw-cards'); await settle(800); await measure('home-done13', true); await shot('home-done13');
    for (const ch of CHS) for (const key of screensOf(ch)) {
      await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
      await page.evaluate(k => { location.hash = k; }, '#cw/' + ch + '/' + key);
      await page.waitForSelector(`.cw-screen[data-key="${key}"]`, { timeout: 15000 }); await settle(900);
      await measure(ch + '/' + key); await shot(ch + '-' + key);
    }
    if (vp.n === 'desk') {   // G-MOVE at real speed (no fast=1)
      const sharp = require('sharp');
      const diff = async (x, y) => { const A = await sharp(x).raw().toBuffer({ resolveWithObject: true }); const B = await sharp(y).raw().toBuffer(); const c = A.info.channels; let n = 0; for (let i = 0; i < A.data.length; i += c) if (Math.abs(A.data[i] - B[i]) > 40 || Math.abs(A.data[i + 1] - B[i + 1]) > 40 || Math.abs(A.data[i + 2] - B[i + 2]) > 40) n++; return +(100 * n / (A.info.width * A.info.height)).toFixed(2); };
      await page.goto(BASE + '/?class=' + cls + '&as=' + P + '#cw', { waitUntil: 'networkidle0' }); await page.waitForSelector('.cw-cards');
      for (const ch of CHS) for (const key of screensOf(ch)) {
        await page.evaluate(k => { location.hash = k; }, '#cw/' + ch + '/' + key);
        await page.waitForSelector(`.cw-screen[data-key="${key}"]`, { timeout: 15000 });
        const s1 = await page.screenshot(); await settle(700); const s2 = await page.screenshot(); await settle(800); const s3 = await page.screenshot();
        const ab = await diff(s1, s2), bc = await diff(s2, s3); report.push({ vp: 'desk', label: 'motion ' + ch + '/' + key, ab, bc });
        if (ab < 0.4 || bc < 0.15) problems.push(`motion ${ch}/${key}: ${ab}% then ${bc}% (G-MOVE needs 0.4 then 0.15)`);
      }
      errs.splice(0);
    }
    await page.close();
  }
  await browser.close();
  const mv = report.filter(r => r.ab != null), low = mv.slice().sort((a, b) => a.ab - b.ab)[0], lowb = mv.slice().sort((a, b) => a.bc - b.bc)[0];
  const tall = report.filter(r => r.vp === 'desk' && r.sh && !/home|landing/.test(r.label)).sort((a, b) => b.sh - a.sh)[0];
  const md = ['# Own look (built platform) · ' + new Date().toISOString().slice(0, 16), '', `Screens: ${report.filter(r => r.sw && r.vp === 'desk').length} at desk, ${report.filter(r => r.sw && r.vp === 'phone').length} at phone. Tallest desk screen: ${tall.label} ${tall.sh}px. G-MOVE lowest: ${low.label} ${low.ab}%, ${lowb.label} ${lowb.bc}%.`, '', '## Problems (' + problems.length + ')', ...problems.map(p => '- ' + p), '', '## G-MOVE', '| screen | first | second |', '|---|---|---|', ...mv.map(r => `| ${r.label.slice(7)} | ${r.ab}% | ${r.bc}% |`)];
  fs.writeFileSync(path.join(OUT, 'REPORT.md'), md.join('\n') + '\n'); fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
  console.log(md.slice(0, 3).join('\n')); console.log('problems: ' + problems.length); problems.slice(0, 60).forEach(p => console.log(' - ' + p));
})().catch(e => { console.error(e); process.exit(1); });
