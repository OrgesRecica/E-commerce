const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'frontend', 'dist');
const OUT = path.join(ROOT, 'playwright', 'scampa-designs');
const SHOTS = path.join(OUT, 'screens');
const PORT = 4862;
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(SHOTS, { recursive: true });

const routes = [
  { name: 'home', path: '/' },
  { name: 'products', path: '/products' },
  { name: 'journal', path: '/news' },
  { name: 'admin', path: '/admin', admin: true },
  { name: 'contact', path: '/contact' },
];

const scenes = [
  {
    file: 'scampa-showcase-home.png',
    label: 'SCAMPA HOMEPAGE',
    eyebrow: 'Manufacturing & Trading Co.',
    main: 'home',
    left: 'journal',
    right: 'products',
  },
  {
    file: 'scampa-showcase-commerce.png',
    label: 'CATALOGUE EXPERIENCE',
    eyebrow: 'Products, quote flow, customer trust',
    main: 'products',
    left: 'home',
    right: 'contact',
  },
  {
    file: 'scampa-showcase-admin.png',
    label: 'SELLER DASHBOARD',
    eyebrow: 'Orders, fulfilment, invoices',
    main: 'admin',
    left: 'products',
    right: 'journal',
  },
];

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

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

function fileDataUrl(file) {
  return `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
}

function sceneHtml(scene, images) {
  const main = images[scene.main];
  const left = images[scene.left];
  const right = images[scene.right];

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1600px; height: 2000px; overflow: hidden; }
  body {
    font-family: Inter, Arial, sans-serif;
    color: #fff;
    background:
      radial-gradient(circle at 18% 18%, rgba(255,122,26,.22), transparent 23%),
      radial-gradient(circle at 82% 28%, rgba(255,255,255,.34), transparent 24%),
      linear-gradient(150deg, #eef8ff 0%, #b8ecff 38%, #47cbe7 100%);
  }
  .scene {
    position: relative;
    width: 1600px;
    height: 2000px;
    overflow: hidden;
    isolation: isolate;
  }
  .scene::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(255,255,255,.45), transparent 34%),
      radial-gradient(ellipse 1280px 420px at 50% 75%, rgba(7,31,69,.24), transparent 68%);
    z-index: 0;
  }
  .brand {
    position: absolute;
    top: 118px;
    left: 118px;
    right: 118px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 6;
  }
  .brand img { width: 270px; height: auto; }
  .label {
    text-align: right;
    color: #071f45;
    letter-spacing: .14em;
    text-transform: uppercase;
    font-weight: 800;
  }
  .label small {
    display: block;
    margin-top: 10px;
    color: rgba(7,31,69,.58);
    font-size: 22px;
    letter-spacing: .08em;
    text-transform: none;
  }
  .panel {
    position: absolute;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 48px 120px rgba(7,31,69,.18), 0 12px 34px rgba(7,31,69,.12);
  }
  .panel img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
  .float-left {
    left: -112px;
    top: 745px;
    width: 760px;
    height: 500px;
    transform: rotate(-1.8deg);
    opacity: .94;
    z-index: 2;
  }
  .float-right {
    right: 86px;
    top: 724px;
    width: 720px;
    height: 470px;
    transform: rotate(1.4deg);
    z-index: 4;
  }
  .laptop {
    position: absolute;
    left: 50%;
    bottom: 330px;
    width: 900px;
    transform: translateX(-50%);
    z-index: 5;
    filter: drop-shadow(0 56px 60px rgba(7,31,69,.28));
  }
  .lid {
    position: relative;
    width: 900px;
    padding: 18px 18px 22px;
    border-radius: 28px 28px 12px 12px;
    background: linear-gradient(180deg, #dfe6ec, #aab5bf 60%, #8b97a3);
    box-shadow: inset 0 2px 0 rgba(255,255,255,.7), inset 0 -2px 0 rgba(7,31,69,.18);
  }
  .screen {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    border-radius: 10px;
    background: #071f45;
    box-shadow: 0 0 0 8px #0b1524, inset 0 0 0 1px rgba(255,255,255,.08);
  }
  .screen img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
  .base {
    width: 1040px;
    height: 98px;
    margin-left: -70px;
    border-radius: 0 0 44px 44px;
    background: linear-gradient(180deg, #cbd3dc, #8f9aa5);
    position: relative;
    box-shadow: inset 0 10px 20px rgba(255,255,255,.38), inset 0 -5px 12px rgba(7,31,69,.18);
  }
  .base::before {
    content: '';
    position: absolute;
    left: 210px;
    right: 210px;
    top: 22px;
    height: 38px;
    border-radius: 0 0 18px 18px;
    background: linear-gradient(180deg, #59636d, #2d343c);
    opacity: .42;
  }
  .base::after {
    content: '';
    position: absolute;
    left: 440px;
    top: 74px;
    width: 160px;
    height: 6px;
    border-radius: 999px;
    background: rgba(255,255,255,.9);
  }
  .floor-shadow {
    position: absolute;
    left: 50%;
    bottom: 300px;
    width: 1180px;
    height: 150px;
    transform: translateX(-50%);
    background: radial-gradient(ellipse, rgba(7,31,69,.24), transparent 68%);
    filter: blur(22px);
    z-index: 1;
  }
  .dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 178px;
    display: flex;
    justify-content: center;
    gap: 14px;
    z-index: 7;
  }
  .dot {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    background: rgba(255,255,255,.62);
  }
  .dot.active { background: #ff7a1a; width: 38px; }
</style>
</head>
<body>
  <div class="scene">
    <div class="brand">
      <img src="${images.logo}" alt="SCAMPA" />
      <div class="label">${scene.label}<small>${scene.eyebrow}</small></div>
    </div>
    <div class="panel float-left"><img src="${left}" /></div>
    <div class="panel float-right"><img src="${right}" /></div>
    <div class="floor-shadow"></div>
    <div class="laptop">
      <div class="lid"><div class="screen"><img src="${main}" /></div></div>
      <div class="base"></div>
    </div>
    <div class="dots"><span class="dot active"></span><span class="dot"></span></div>
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

  for (const route of routes) {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        name: 'SCAMPA Admin',
        email: 'admin@scampa.eu',
        role: 'admin',
      }));
    });
    await page.goto(`http://127.0.0.1:${PORT}${route.path}`, { waitUntil: 'domcontentloaded' });
    await wait(1800);
    await page.screenshot({
      path: path.join(SHOTS, `${route.name}.png`),
      fullPage: false,
    });
  }

  const images = Object.fromEntries(
    routes.map((route) => [route.name, fileDataUrl(path.join(SHOTS, `${route.name}.png`))])
  );
  images.logo = `data:image/svg+xml;base64,${fs.readFileSync(path.join(ROOT, 'frontend', 'public', 'assets', 'scampa-logo.svg')).toString('base64')}`;

  const mockup = await browser.newContext({
    viewport: { width: 1600, height: 2000 },
    deviceScaleFactor: 1,
  });
  const scenePage = await mockup.newPage();
  for (const scene of scenes) {
    await scenePage.setContent(sceneHtml(scene, images), { waitUntil: 'load' });
    await wait(300);
    await scenePage.screenshot({
      path: path.join(OUT, scene.file),
      fullPage: false,
    });
    console.log(`saved ${path.join(OUT, scene.file)}`);
  }

  await browser.close();
  server.close();
})();
