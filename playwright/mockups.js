/**
 * Generates XOR-branded laptop mockup images from each screenshot.
 * Output: playwright/mockups/mockup-<name>.png  at 3840x2400.
 */

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = 4848;
const SHOTS_DIR = path.join(ROOT, 'screenshots');
const OUT_DIR = path.join(ROOT, 'mockups');
fs.mkdirSync(OUT_DIR, { recursive: true });
for (const f of fs.readdirSync(OUT_DIR)) fs.unlinkSync(path.join(OUT_DIR, f));

// Per-screenshot label + right-side tag line
const MOCKUPS = [
  { file: '01-home-hero.png',        label: '01 · HOME',         tag: 'HERO · STOREFRONT' },
  { file: '02-home-featured.png',    label: '02 · FEATURED',     tag: 'CURATED PRODUCTS' },
  { file: '03-home-editorial.png',   label: '03 · EDITORIAL',    tag: 'BRAND STORYTELLING' },
  { file: '04-products-grid.png',    label: '04 · CATALOG',      tag: 'SEARCH · FILTER · SORT' },
  { file: '05-products-filtered.png',label: '05 · CATEGORIES',   tag: 'SMART FILTERING' },
  { file: '06-cart.png',             label: '06 · CART',         tag: 'CHECKOUT · STRIPE' },
  { file: '07-login.png',            label: '07 · AUTH',         tag: 'JWT · SECURE SESSIONS' },
  { file: '08-admin-overview.png',   label: '08 · DASHBOARD',    tag: 'REVENUE · ANALYTICS' },
  { file: '09-admin-orders.png',     label: '09 · ORDERS',       tag: 'FULFILMENT · STATUS' },
  { file: '10-admin-products.png',   label: '10 · INVENTORY',    tag: 'PRODUCT MANAGEMENT' },
];

const MIME = {
  '.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css',
  '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/' || url === '') url = '/scene-xor.html';
  const file = path.join(ROOT, decodeURIComponent(url));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end('not found'); return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  await new Promise((res) => server.listen(PORT, res));
  console.log(`Serving scene at http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 3840, height: 2400 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();

  for (const m of MOCKUPS) {
    const shotPath = path.join(SHOTS_DIR, m.file);
    if (!fs.existsSync(shotPath)) {
      console.warn(`  · skip (missing): ${m.file}`);
      continue;
    }
    const imgUrl = `/screenshots/${encodeURIComponent(m.file)}`;
    const url = `http://localhost:${PORT}/scene-xor.html?img=${encodeURIComponent(imgUrl)}&label=${encodeURIComponent(m.label)}&tag=${encodeURIComponent(m.tag)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.body.dataset.ready === '1', { timeout: 10000 });
    await wait(300); // let fonts/layout settle

    const outName = `mockup-${path.basename(m.file, '.png')}.png`;
    const outPath = path.join(OUT_DIR, outName);
    await page.screenshot({ path: outPath, type: 'png', fullPage: false, clip: { x:0, y:0, width: 3840, height: 2400 } });
    const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
    console.log(`  ✓ ${outName}  (${kb} KB)`);
  }

  await browser.close();
  server.close();
  console.log(`\nAll mockups saved to: ${OUT_DIR}`);
})().catch((e) => { console.error(e); server.close(); process.exit(1); });
