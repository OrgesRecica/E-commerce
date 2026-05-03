const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:5174';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

const OUT = path.join(__dirname, 'screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function snap(page, name) {
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    fullPage: false,
  });
  console.log(`✓ ${name}.png`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  // ── 1. Home hero
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await wait(2500);
  await snap(page, '01-home-hero');

  // ── 2. Home – scroll to featured products
  await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'smooth' }));
  await wait(1200);
  await snap(page, '02-home-featured');

  // ── 3. Home – editorial mid section
  await page.evaluate(() => window.scrollTo({ top: 1600, behavior: 'smooth' }));
  await wait(1200);
  await snap(page, '03-home-editorial');

  // ── 4. Products grid
  await page.goto(`${BASE}/products`, { waitUntil: 'domcontentloaded' });
  await wait(2500);
  await snap(page, '04-products-grid');

  // ── 5. Products – category filter (Lighting)
  const lightingBtn = page.getByRole('button', { name: 'Lighting', exact: true });
  if (await lightingBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await lightingBtn.click();
    await wait(1500);
    await snap(page, '05-products-filtered');
  }

  // ── 6. Cart (add first item first)
  await page.goto(`${BASE}/products`, { waitUntil: 'domcontentloaded' });
  await wait(2000);
  const firstCard = page.locator('article').first();
  await firstCard.hover();
  await wait(400);
  const addBtn = page.getByRole('button', { name: /add to bag/i }).first();
  if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await addBtn.click();
    await wait(500);
  }
  await page.goto(`${BASE}/cart`, { waitUntil: 'domcontentloaded' });
  await wait(1500);
  await snap(page, '06-cart');

  // ── 7. Login page
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
  await wait(1500);
  await snap(page, '07-login');

  // ── 8. Admin overview
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/\/admin/, { timeout: 8000 });
  await wait(2500);
  await snap(page, '08-admin-overview');

  // ── 9. Admin Orders tab
  await page.locator('aside button:has-text("Orders")').first().click();
  await wait(2000);
  await snap(page, '09-admin-orders');

  // ── 10. Admin Products tab
  await page.locator('aside button:has-text("Products")').first().click();
  await wait(2000);
  await snap(page, '10-admin-products');

  await browser.close();
  console.log(`\nAll screenshots saved to: ${OUT}`);
})();
