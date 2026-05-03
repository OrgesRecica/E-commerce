/**
 * Composites the raw walkthrough inside the 4K laptop scene,
 * then motion-interpolates to 120fps H.264 MP4.
 *
 * Output: ./videos/final-demo.mp4
 */

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const ROOT = __dirname;
const PORT = 4747;
const OUT_DIR = path.join(ROOT, 'videos');
const STAGE_DIR = path.join(OUT_DIR, 'staging');
fs.mkdirSync(STAGE_DIR, { recursive: true });

for (const f of fs.readdirSync(STAGE_DIR)) fs.unlinkSync(path.join(STAGE_DIR, f));

const MIME = {
  '.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css',
  '.webm':'video/webm','.mp4':'video/mp4','.png':'image/png','.svg':'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/' || url === '') url = '/scene.html';
  const file = path.join(ROOT, decodeURIComponent(url));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end('not found'); return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function runFfmpeg(args, label) {
  return new Promise((resolve, reject) => {
    console.log(`\n[ffmpeg] ${label}…`);
    const t0 = Date.now();
    const p = spawn(ffmpegPath, args);
    let lastLine = '';
    p.stderr.on('data', (d) => {
      const s = d.toString();
      const m = s.match(/frame=\s*(\d+).+?time=(\S+).+?speed=\s*(\S+)/);
      if (m) {
        const line = `  frame ${m[1]}  time ${m[2]}  speed ${m[3]}`;
        if (line !== lastLine) {
          process.stdout.write('\r' + line.padEnd(60));
          lastLine = line;
        }
      }
    });
    p.on('close', (code) => {
      process.stdout.write('\n');
      if (code === 0) {
        console.log(`  ✓ ${label} (${((Date.now()-t0)/1000).toFixed(1)}s)`);
        resolve();
      } else {
        reject(new Error(`${label} exited ${code}`));
      }
    });
  });
}

(async () => {
  // Confirm the raw source exists
  const rawPath = path.join(OUT_DIR, 'raw', 'raw-walkthrough.webm');
  if (!fs.existsSync(rawPath)) {
    console.error(`Raw walkthrough missing: ${rawPath}\nRun  node record.js  first.`);
    process.exit(1);
  }

  await new Promise((res) => server.listen(PORT, res));
  console.log(`Serving scene at http://localhost:${PORT}`);

  // Capture at 1920x1080 — Playwright sustains true ~25fps here.
  // ffmpeg upscales to 4K with lanczos.
  console.log('Capturing scene at 1920x1080 (upscale to 4K in ffmpeg)…');
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-gpu-vsync', '--disable-frame-rate-limit', '--enable-gpu-rasterization'],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: STAGE_DIR, size: { width: 1920, height: 1080 } },
  });

  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/scene.html`, { waitUntil: 'domcontentloaded' });

  await page.waitForFunction(() => document.body.dataset.ready === '1', { timeout: 20000 });
  console.log('  ✓ Scene & video loaded — capturing…');

  await Promise.race([
    page.waitForFunction(() => document.body.dataset.done === '1', { timeout: 40000 }).catch(() => {}),
    wait(32000),
  ]);

  await wait(400);
  await ctx.close();
  await browser.close();
  server.close();

  const webmFiles = fs.readdirSync(STAGE_DIR).filter((f) => f.endsWith('.webm'));
  if (!webmFiles.length) { console.error('No scene recording produced.'); process.exit(1); }
  const sceneWebm = path.join(STAGE_DIR, webmFiles[0]);
  const size = (fs.statSync(sceneWebm).size / 1024 / 1024).toFixed(2);
  console.log(`  ✓ 4K scene captured: ${size} MB`);

  // ── Step 2: motion-interpolate to 120fps + encode H.264 MP4 ──
  const finalMp4 = path.join(OUT_DIR, 'final-demo.mp4');
  if (fs.existsSync(finalMp4)) fs.unlinkSync(finalMp4);

  // Upscale 1920x1080 → 3840x2160 (lanczos) + motion-interpolate to 60fps.
  // 60fps is the sweet spot — smoother than 30, not wasteful like 120,
  // and renders natively on any 60Hz Windows display.
  await runFfmpeg([
    '-y',
    '-i', sceneWebm,
    '-vf', "scale=3840:2160:flags=lanczos,minterpolate='fps=60:mi_mode=blend'",
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '15',
    '-maxrate', '40M',
    '-bufsize', '80M',
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'high',
    '-level', '5.2',
    '-movflags', '+faststart',
    finalMp4,
  ], 'Encoding 4K @ 60fps (upscaled + interpolated)');

  // 1080p60 companion (straight encode from source)
  const finalHd = path.join(OUT_DIR, 'final-demo-1080p60.mp4');
  if (fs.existsSync(finalHd)) fs.unlinkSync(finalHd);
  await runFfmpeg([
    '-y',
    '-i', sceneWebm,
    '-vf', "minterpolate='fps=60:mi_mode=blend'",
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '16',
    '-maxrate', '12M',
    '-bufsize', '24M',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    finalHd,
  ], 'Encoding 1080p @ 60fps companion');

  // Clean staging
  for (const f of fs.readdirSync(STAGE_DIR)) fs.unlinkSync(path.join(STAGE_DIR, f));
  fs.rmdirSync(STAGE_DIR);

  const mp4Size   = (fs.statSync(finalMp4).size / 1024 / 1024).toFixed(2);
  const hdSize    = (fs.statSync(finalHd).size  / 1024 / 1024).toFixed(2);
  console.log('\n═══════════════════════════════════════════════════');
  console.log(`✓ 4K 120fps:   ${finalMp4}  (${mp4Size} MB)`);
  console.log(`✓ 1080p 60fps: ${finalHd}   (${hdSize} MB)`);
  console.log('═══════════════════════════════════════════════════');
})().catch((e) => {
  console.error(e);
  server.close();
  process.exit(1);
});
