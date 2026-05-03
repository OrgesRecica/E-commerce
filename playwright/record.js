/**
 * Records a balanced 30s MONO walkthrough.
 * ~4.3s per scene × 7 scenes = 30s total.
 * Output: ./videos/raw/raw-walkthrough.webm
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:5174';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

// Record at a high source res — scaled to fit the laptop screen in the 4K scene
const REC_W = 1920;
const REC_H = 1200;

const VIDEOS_DIR = path.join(__dirname, 'videos', 'raw');
fs.mkdirSync(VIDEOS_DIR, { recursive: true });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Butter-smooth scroll using rAF-style easing inside the page
async function smoothScroll(page, to, duration = 1200) {
  await page.evaluate(({ to, duration }) => {
    return new Promise((resolve) => {
      const start = window.scrollY;
      const delta = to - start;
      const t0 = performance.now();
      // easeInOutCubic
      const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      function step(now) {
        const t = Math.min((now - t0) / duration, 1);
        window.scrollTo(0, start + delta * ease(t));
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      }
      requestAnimationFrame(step);
    });
  }, { to, duration });
}

async function typeSlow(page, selector, text, msPerChar = 65) {
  await page.focus(selector);
  for (const ch of text) {
    await page.keyboard.type(ch);
    await wait(msPerChar);
  }
}

(async () => {
  console.log('Recording raw walkthrough...');

  for (const f of fs.readdirSync(VIDEOS_DIR)) fs.unlinkSync(path.join(VIDEOS_DIR, f));

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: REC_W, height: REC_H },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: VIDEOS_DIR,
      size: { width: REC_W, height: REC_H },
    },
  });
  const page = await ctx.newPage();

  // Warm up: load once and reload so initial assets are cached before recording
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await wait(1500);

  // ────────────────────── Scene 1 · Home hero (4.3s) ──────────────────────
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await wait(1200);
  await smoothScroll(page, 450, 1600);
  await wait(600);
  await smoothScroll(page, 900, 1200);
  await wait(400);

  // ────────────────────── Scene 2 · Products grid (4.3s) ──────────────────
  await page.goto(`${BASE}/products`, { waitUntil: 'domcontentloaded' });
  await wait(1500);
  await smoothScroll(page, 500, 1600);
  await wait(700);
  await smoothScroll(page, 200, 1000);

  // ────────────────────── Scene 3 · Category filter (4.3s) ────────────────
  const lighting = page.getByRole('button', { name: 'Lighting', exact: true });
  if (await lighting.isVisible({ timeout: 1500 }).catch(() => false)) {
    await lighting.click();
    await wait(1400);
  }
  await smoothScroll(page, 600, 1600);
  await wait(600);

  // ────────────────────── Scene 4 · Add to cart (4.3s) ────────────────────
  await smoothScroll(page, 0, 900);
  await wait(400);
  const card = page.locator('article').first();
  await card.hover();
  await wait(600);
  const addBtn = page.getByRole('button', { name: /add to bag/i }).first();
  if (await addBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await addBtn.click();
    await wait(1200);
  }
  await wait(800);

  // ────────────────────── Scene 5 · Cart (4.3s) ──────────────────────────
  await page.goto(`${BASE}/cart`, { waitUntil: 'domcontentloaded' });
  await wait(1800);
  await smoothScroll(page, 180, 1200);
  await wait(700);

  // ────────────────────── Scene 6 · Admin login (4.3s) ───────────────────
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
  await wait(900);
  await typeSlow(page, 'input[type="email"]', ADMIN_EMAIL, 55);
  await wait(250);
  await typeSlow(page, 'input[type="password"]', ADMIN_PASSWORD, 55);
  await wait(400);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/\/admin/, { timeout: 8000 });

  // ────────────────────── Scene 7 · Admin overview (4.3s) ────────────────
  await wait(1800);
  await smoothScroll(page, 300, 1400);
  await wait(800);
  await smoothScroll(page, 0, 1000);

  // ────────────────────── Outro · Admin orders (2s) ──────────────────────
  const ordersBtn = page.locator('aside button:has-text("Orders")').first();
  if (await ordersBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await ordersBtn.click();
    await wait(1800);
  }

  await wait(300);
  await ctx.close();
  await browser.close();

  const files = fs.readdirSync(VIDEOS_DIR).filter((f) => f.endsWith('.webm'));
  if (files.length) {
    const src = path.join(VIDEOS_DIR, files[0]);
    const dest = path.join(VIDEOS_DIR, 'raw-walkthrough.webm');
    if (src !== dest) fs.renameSync(src, dest);
    const size = (fs.statSync(dest).size / 1024 / 1024).toFixed(2);
    console.log(`✓ Raw walkthrough: ${dest} (${size} MB)`);
  }
})();
