import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveFixtures } from './generateFixtures.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('[Build] Starting HyenaX static & Cloudflare Pages post-build packaging...');

// 0. Verify Vite build output exists (NEVER wipe dist/ after vite build!)
const viteIndexPath = path.join(distDir, 'index.html');
const viteAssetsDir = path.join(distDir, 'assets');
if (!fs.existsSync(viteIndexPath) || !fs.existsSync(viteAssetsDir)) {
  throw new Error('[Build] Fatal: dist/index.html or dist/assets missing. Run "vite build" before "node scripts/build.js".');
}

// 1. Generate fixtures and model data if missing or empty
const fixturesPath = path.join(rootDir, 'data', 'fixtures.json');
if (!fs.existsSync(fixturesPath) || fs.statSync(fixturesPath).size < 1000) {
  try {
    console.log('[Build] Generating verified fixtures and model predictions...');
    await saveFixtures();
  } catch (err) {
    console.warn('[Build] Warning: Fixture generation encountered error:', err.message);
  }
} else {
  console.log('[Build] Existing verified fixtures cache detected.');
}

// 2. Copy PWA & legacy browser runtime assets into dist/ WITHOUT overwriting Vite dist/index.html or dist/assets/
const filesToCopy = [
  'manifest.webmanifest',
  'sw.js'
];

const dirsToCopy = [
  'icons',
  'js'
];

for (const file of filesToCopy) {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[Build] Copied static file: ${file}`);
  }
}

for (const dir of dirsToCopy) {
  const src = path.join(rootDir, dir);
  const dest = path.join(distDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`[Build] Copied static directory: ${dir}`);
  }
}

// 3. Copy public web data assets to dist/data (excluding server-only caches to satisfy Cloudflare Pages 25MB limit)
const dataSrc = path.join(rootDir, 'data');
const dataDest = path.join(distDir, 'data');
fs.mkdirSync(dataDest, { recursive: true });

if (fs.existsSync(dataSrc)) {
  const publicFiles = fs.readdirSync(dataSrc).filter(f => {
    if (f === 'official_fallback_cache.json') return false;
    if (f.endsWith('.bak') || f.endsWith('.tmp')) return false;
    return true;
  });

  for (const f of publicFiles) {
    const s = path.join(dataSrc, f);
    const d = path.join(dataDest, f);
    if (!fs.statSync(s).isFile()) continue;
    if (f === 'fixtures.json') {
      try {
        const parsed = JSON.parse(fs.readFileSync(s, 'utf-8'));
        fs.writeFileSync(d, JSON.stringify(parsed), 'utf-8');
        const sz = (fs.statSync(d).size / (1024 * 1024)).toFixed(2);
        console.log(`[Build] Copied & minified: data/${f} (${sz} MB)`);
        continue;
      } catch (_) {}
    }
    fs.copyFileSync(s, d);
    console.log(`[Build] Copied file: data/${f}`);
  }
}

// 4. Write Cloudflare Pages / Netlify SPA routing rules & HTTP headers
const redirectsContent = `# Cloudflare Pages / Netlify SPA Routing
/api/fixtures      /data/fixtures.json    200
/api/fixtures/*    /data/fixtures.json    200
/*                 /index.html            200
`;
fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent, 'utf-8');

const headersContent = `# Cloudflare Pages Headers
/data/*
  Content-Type: application/json; charset=utf-8
  Cache-Control: no-cache, no-store, must-revalidate
  Access-Control-Allow-Origin: *

/api/fixtures
  Content-Type: application/json; charset=utf-8
  Cache-Control: no-cache, no-store, must-revalidate
  Access-Control-Allow-Origin: *

/sw.js
  Cache-Control: no-cache, no-store, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
`;
fs.writeFileSync(path.join(distDir, '_headers'), headersContent, 'utf-8');

// 5. Cloudflare Pages 25MB Asset Ceiling Guardrail
function validateCloudflareAssetLimits(dir) {
  const MAX_CLOUDFLARE_BYTES = 24 * 1024 * 1024; // 24 MiB hard safety ceiling (Cloudflare limit is 25 MiB)
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      validateCloudflareAssetLimits(fullPath);
    } else if (entry.isFile()) {
      const stats = fs.statSync(fullPath);
      const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
      if (stats.size >= MAX_CLOUDFLARE_BYTES) {
        throw new Error(`[Cloudflare Guardrail Violation] File "${fullPath}" is ${sizeMb} MB, which exceeds Cloudflare Pages 24MB ceiling!`);
      }
    }
  }
}

validateCloudflareAssetLimits(distDir);
console.log('[Build] ✓ Cloudflare 25MB Asset Guardrail verified: all assets strictly under 24MB.');
console.log('[Build] ✓ Production packaging complete in dist/ (Vite bundle + data + _redirects + _headers + PWA).');
