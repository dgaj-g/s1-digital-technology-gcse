/* Screenshots of chapter screens at full height, for the look (BUILD prompt §3.7).
 *   NODE_PATH=$(npm root -g) node s2-u5ca-guide/gates/look.js <ch> [width] [key ...]   → gates/_out/look/<ch>-<key>-<width>.png */
const puppeteer = require('puppeteer'); const fs = require('fs'); const path = require('path');
const D = path.resolve(__dirname, '..'); const BASE = process.env.S2_BASE || 'http://127.0.0.1:8851';
const [ch, W = '1500', ...want] = process.argv.slice(2); const w = +W;
const c = JSON.parse(fs.readFileSync(path.join(D, 'content', 'ch' + ch + '.json'), 'utf8'));
const keys = want.length ? want : c.stages.flatMap((st) => st.screens.map((sc) => st.id + '-' + sc.id));
const post = async (p, body, who) => (await fetch(BASE + p, { method: 'POST', headers: { 'content-type': 'application/json', 'x-dev-user': who }, body: JSON.stringify(body) })).json();
const OUT = path.join(__dirname, '_out', 'look'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const P = 'pupil9@c2ken.net', cls = 'S2-LOOK-' + (Date.now() % 100000);
  await post('/api/apiStaff', { op: 'create', name: cls }, 'dgartland021@c2ken.net'); await post('/api/apiBoot', { cls }, P);
  if (ch === '14') { for (let k = 1; k <= 12; k++) await post('/api/apiCw', { cls, op: 'had', ch: String(k).padStart(2, '0'), v: 1 }, P); await post('/api/apiCw', { cls, op: 'done', ch: '13', on: true }, P); }   // 14 shows once 1 to 13 are done
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 60000 });
  const page = await b.newPage(); await page.setViewport({ width: w, height: 1000 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(BASE + '/?class=' + cls + '&as=' + P + '&fast=1#cw', { waitUntil: 'networkidle0' });
  for (const k of keys) {
    await page.setViewport({ width: w, height: 1000 });
    await page.evaluate((h) => { location.hash = h; }, '#cw/' + ch + '/' + k);
    await page.waitForSelector(`.cw-screen[data-key="${k}"]`, { timeout: 15000 }); await new Promise((r) => setTimeout(r, 700));
    if (process.env.LOOK_OPEN) { await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; })); await new Promise((r) => setTimeout(r, 2500)); }   // LOOK_OPEN=1 opens every fold
    const h = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, ...[...document.querySelectorAll('body *')].filter((e) => /auto|scroll/.test(getComputedStyle(e).overflowY)).map((e) => e.scrollHeight)));
    await page.setViewport({ width: w, height: Math.min(h + 40, 4000) }); await new Promise((r) => setTimeout(r, 300));
    const f = path.join(OUT, ch + '-' + k + '-' + w + '.png'); await page.screenshot({ path: f, fullPage: true }); console.log(f, h + 'px');
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(2); });
