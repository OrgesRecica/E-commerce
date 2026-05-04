const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'frontend', 'dist');
const OUT = path.join(ROOT, 'playwright', 'scampa-device-designs');
const SHOTS = path.join(OUT, 'snips');
const PORT = 4864;
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(SHOTS, { recursive: true });

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

const desktopShots = [
  { name: 'home-hero', path: '/', scrollY: 0 },
  { name: 'home-products', path: '/', scrollY: 860 },
  { name: 'home-journal', path: '/', scrollY: 2400 },
  { name: 'products', path: '/products', scrollY: 0 },
  { name: 'clients', path: '/clients', scrollY: 0 },
  { name: 'contact', path: '/contact', scrollY: 0 },
  { name: 'journal', path: '/news', scrollY: 0 },
  { name: 'admin', path: '/admin', scrollY: 0, admin: true },
];

const phoneShots = [
  { name: 'phone-home', path: '/', scrollY: 0 },
  { name: 'phone-products', path: '/products', scrollY: 260 },
  { name: 'phone-journal', path: '/news', scrollY: 0 },
  { name: 'phone-contact', path: '/contact', scrollY: 0 },
];

const scenes = [
  {
    file: 'scampa-mobile-commerce-suite.png',
    title: 'Commerce Suite',
    subtitle: 'Catalogue, quote flow, and mobile product discovery',
    theme: 'blue',
    hero: 'products',
    browserA: 'home-products',
    browserB: 'contact',
    phoneA: 'phone-products',
    phoneB: 'phone-contact',
    chipA: 'Reusable catalogue',
    chipB: 'Mobile quote path',
  },
  {
    file: 'scampa-homepage-device-collage.png',
    title: 'Homepage System',
    subtitle: 'Hero, sustainability storytelling, journal highlights',
    theme: 'orange',
    hero: 'home-hero',
    browserA: 'home-journal',
    browserB: 'clients',
    phoneA: 'phone-home',
    phoneB: 'phone-journal',
    chipA: 'Industrial visual language',
    chipB: 'Responsive brand story',
  },
  {
    file: 'scampa-seller-workflow-showcase.png',
    title: 'Seller Workflow',
    subtitle: 'Orders, products, invoices, and customer communication',
    theme: 'steel',
    hero: 'admin',
    browserA: 'products',
    browserB: 'journal',
    phoneA: 'phone-products',
    phoneB: 'phone-home',
    chipA: 'Admin dashboard',
    chipB: 'B2B-ready storefront',
  },
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function serveDist() {
  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(DIST, urlPath === '/' ? 'index.html' : urlPath);
    if (!file.startsWith(DIST)) {
      res.writeHead(403);
      res.end('forbidden');
      return;
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(DIST, 'index.html');
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mime[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(file).pipe(res);
  });
}

function pngDataUrl(file) {
  return `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
}

function svgDataUrl(file) {
  return `data:image/svg+xml;base64,${fs.readFileSync(file).toString('base64')}`;
}

async function captureShot(page, shot, viewport) {
  await page.setViewportSize(viewport);
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify({
      name: 'SCAMPA Admin',
      email: 'admin@scampa.eu',
      role: 'admin',
    }));
  });
  await page.goto(`http://127.0.0.1:${PORT}${shot.path}`, { waitUntil: 'domcontentloaded' });
  await wait(1500);
  await page.evaluate((y) => window.scrollTo(0, y), shot.scrollY || 0);
  await wait(500);
  await page.screenshot({
    path: path.join(SHOTS, `${shot.name}.png`),
    fullPage: false,
  });
}

function imageFor(images, name) {
  return images[name] || images['home-hero'];
}

function sceneHtml(scene, images) {
  const themeClass = `theme-${scene.theme}`;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1800px; height: 1800px; overflow: hidden; }
  body {
    font-family: Inter, Arial, sans-serif;
    color: #071f45;
    background: #eef7fb;
  }
  .scene {
    position: relative;
    width: 1800px;
    height: 1800px;
    overflow: hidden;
    isolation: isolate;
  }
  .theme-blue {
    background:
      radial-gradient(circle at 9% 84%, rgba(255,122,26,.28), transparent 18%),
      radial-gradient(circle at 90% 8%, rgba(78,208,232,.36), transparent 28%),
      linear-gradient(135deg, #f8fbff 0%, #d9f6ff 44%, #62d2e8 100%);
  }
  .theme-orange {
    background:
      radial-gradient(circle at 83% 78%, rgba(255,122,26,.26), transparent 20%),
      radial-gradient(circle at 17% 19%, rgba(42,119,184,.30), transparent 26%),
      linear-gradient(145deg, #f5fbff 0%, #eaf7fb 36%, #b9ecf8 100%);
  }
  .theme-steel {
    background:
      radial-gradient(circle at 16% 20%, rgba(255,255,255,.64), transparent 22%),
      radial-gradient(circle at 82% 78%, rgba(255,122,26,.24), transparent 18%),
      linear-gradient(140deg, #ecf4fa 0%, #cfe7f3 44%, #79d6e7 100%);
  }
  .scene::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(7,31,69,.08) 1px, transparent 1px),
      linear-gradient(0deg, rgba(7,31,69,.06) 1px, transparent 1px);
    background-size: 86px 86px;
    mask-image: radial-gradient(circle at 50% 54%, black, transparent 70%);
    opacity: .46;
    z-index: 0;
  }
  .scene::after {
    content: '';
    position: absolute;
    left: -180px;
    right: -180px;
    bottom: -180px;
    height: 560px;
    background: radial-gradient(ellipse at 50% 42%, rgba(7,31,69,.30), transparent 62%);
    filter: blur(18px);
    z-index: 0;
  }
  .topbar {
    position: absolute;
    top: 86px;
    left: 110px;
    right: 110px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 8;
  }
  .logo {
    width: 284px;
    height: auto;
  }
  .copy {
    text-align: right;
  }
  .copy strong {
    display: block;
    color: #071f45;
    font-size: 48px;
    line-height: .95;
    letter-spacing: 0;
  }
  .copy span {
    display: block;
    margin-top: 14px;
    color: rgba(7,31,69,.62);
    font-size: 22px;
    font-weight: 800;
    letter-spacing: .08em;
    text-transform: uppercase;
  }
  .ribbon {
    position: absolute;
    left: -160px;
    top: 510px;
    width: 2120px;
    height: 270px;
    transform: rotate(-8deg);
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(7,49,101,.92), rgba(9,67,129,.70), rgba(255,122,26,.88));
    opacity: .86;
    z-index: 1;
  }
  .browser {
    position: absolute;
    overflow: hidden;
    border-radius: 30px;
    background: white;
    box-shadow: 0 52px 110px rgba(7,31,69,.22), 0 10px 26px rgba(7,31,69,.12);
    z-index: 3;
  }
  .browser::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 54px;
    background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(230,239,246,.92));
    border-bottom: 1px solid rgba(7,31,69,.08);
    z-index: 2;
  }
  .browser::after {
    content: '';
    position: absolute;
    top: 22px;
    left: 28px;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #ff7a1a;
    box-shadow: 22px 0 0 rgba(7,31,69,.26), 44px 0 0 rgba(78,208,232,.9);
    z-index: 3;
  }
  .browser img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  .browser-main {
    left: 260px;
    top: 588px;
    width: 1180px;
    height: 720px;
    transform: rotate(.6deg);
    z-index: 4;
  }
  .browser-left {
    left: -88px;
    top: 956px;
    width: 590px;
    height: 390px;
    transform: rotate(-8deg);
    opacity: .95;
  }
  .browser-right {
    right: -22px;
    top: 466px;
    width: 660px;
    height: 430px;
    transform: rotate(6deg);
    opacity: .97;
  }
  .tablet {
    position: absolute;
    left: 126px;
    bottom: 180px;
    width: 660px;
    height: 464px;
    padding: 18px;
    border-radius: 40px;
    background: linear-gradient(145deg, #172338, #07101f);
    box-shadow: 0 52px 94px rgba(7,31,69,.36), inset 0 0 0 2px rgba(255,255,255,.08);
    transform: rotate(-5deg);
    z-index: 6;
  }
  .tablet .screen {
    width: 100%;
    height: 100%;
    border-radius: 26px;
    overflow: hidden;
    background: white;
  }
  .phone {
    position: absolute;
    width: 290px;
    height: 600px;
    padding: 18px 14px;
    border-radius: 48px;
    background: linear-gradient(145deg, #13213a, #050914);
    box-shadow: 0 54px 82px rgba(7,31,69,.34), inset 0 0 0 2px rgba(255,255,255,.08);
    z-index: 7;
  }
  .phone::before {
    content: '';
    position: absolute;
    top: 17px;
    left: 50%;
    width: 90px;
    height: 24px;
    transform: translateX(-50%);
    border-radius: 0 0 14px 14px;
    background: #050914;
    z-index: 3;
  }
  .phone-a {
    right: 260px;
    bottom: 182px;
    transform: rotate(7deg);
  }
  .phone-b {
    right: 86px;
    bottom: 320px;
    width: 250px;
    height: 520px;
    transform: rotate(-7deg);
    z-index: 5;
  }
  .phone .screen {
    width: 100%;
    height: 100%;
    border-radius: 34px;
    overflow: hidden;
    background: white;
  }
  .screen img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  .chip {
    position: absolute;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    height: 58px;
    padding: 0 24px;
    border-radius: 999px;
    background: rgba(255,255,255,.76);
    color: #071f45;
    font-size: 18px;
    font-weight: 900;
    box-shadow: 0 24px 46px rgba(7,31,69,.13);
    backdrop-filter: blur(18px);
    z-index: 9;
  }
  .chip::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 999px;
    background: #ff7a1a;
  }
  .chip-a {
    left: 252px;
    top: 398px;
  }
  .chip-b {
    right: 172px;
    top: 1020px;
  }
  .orb {
    position: absolute;
    border-radius: 999px;
    background: linear-gradient(145deg, rgba(255,255,255,.72), rgba(255,122,26,.22));
    box-shadow: inset -18px -24px 44px rgba(7,31,69,.10);
    z-index: 2;
  }
  .orb.one { width: 170px; height: 170px; left: 108px; top: 382px; }
  .orb.two { width: 92px; height: 92px; right: 420px; top: 286px; background: linear-gradient(145deg, rgba(255,255,255,.76), rgba(72,199,229,.32)); }
  .pager {
    position: absolute;
    left: 50%;
    bottom: 88px;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 10;
  }
  .pager span {
    width: 13px;
    height: 13px;
    border-radius: 999px;
    background: rgba(255,255,255,.66);
  }
  .pager span:first-child {
    width: 44px;
    background: #ff7a1a;
  }
</style>
</head>
<body>
  <div class="scene ${themeClass}">
    <div class="topbar">
      <img class="logo" src="${images.logo}" alt="SCAMPA" />
      <div class="copy">
        <strong>${scene.title}</strong>
        <span>${scene.subtitle}</span>
      </div>
    </div>
    <div class="ribbon"></div>
    <div class="orb one"></div>
    <div class="orb two"></div>
    <div class="chip chip-a">${scene.chipA}</div>
    <div class="chip chip-b">${scene.chipB}</div>
    <div class="browser browser-right"><img src="${imageFor(images, scene.browserB)}" /></div>
    <div class="browser browser-left"><img src="${imageFor(images, scene.browserA)}" /></div>
    <div class="browser browser-main"><img src="${imageFor(images, scene.hero)}" /></div>
    <div class="tablet"><div class="screen"><img src="${imageFor(images, scene.browserA)}" /></div></div>
    <div class="phone phone-b"><div class="screen"><img src="${imageFor(images, scene.phoneB)}" /></div></div>
    <div class="phone phone-a"><div class="screen"><img src="${imageFor(images, scene.phoneA)}" /></div></div>
    <div class="pager"><span></span><span></span><span></span></div>
  </div>
</body>
</html>`;
}

(async () => {
  if (!fs.existsSync(DIST)) {
    throw new Error('Missing frontend/dist. Run `npm run build` in frontend first.');
  }

  const server = serveDist();
  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await chromium.launch({
    headless: true,
    executablePath: EDGE,
  });

  const app = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await app.newPage();

  for (const shot of desktopShots) {
    await captureShot(page, shot, { width: 1440, height: 900 });
  }
  for (const shot of phoneShots) {
    await captureShot(page, shot, { width: 390, height: 844 });
  }

  const images = {};
  for (const shot of [...desktopShots, ...phoneShots]) {
    images[shot.name] = pngDataUrl(path.join(SHOTS, `${shot.name}.png`));
  }
  images.logo = svgDataUrl(path.join(ROOT, 'frontend', 'public', 'assets', 'scampa-logo.svg'));

  const mockup = await browser.newContext({
    viewport: { width: 1800, height: 1800 },
    deviceScaleFactor: 1,
  });
  const scenePage = await mockup.newPage();

  for (const scene of scenes) {
    await scenePage.setContent(sceneHtml(scene, images), { waitUntil: 'load' });
    await wait(450);
    const output = path.join(OUT, scene.file);
    await scenePage.screenshot({ path: output, fullPage: false });
    console.log(`saved ${output}`);
  }

  await browser.close();
  server.close();
})();
