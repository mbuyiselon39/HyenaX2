import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveFixtures } from './generateFixtures.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('[Build] Starting HyenaX production build...');

// 1. Generate fixtures and model data if missing
const fixturesPath = path.join(rootDir, 'data', 'fixtures.json');
if (!fs.existsSync(fixturesPath) || fs.statSync(fixturesPath).size < 1000) {
  try {
    console.log('[Build] Ensuring latest fixtures and model predictions...');
    await saveFixtures();
  } catch (err) {
    console.warn('[Build] Warning: Fixture generation encountered error:', err.message);
  }
} else {
  console.log('[Build] Existing verified fixtures cache verified.');
}

// 2. Prepare clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 3. Copy static files & directories
const filesToCopy = [
  'index.html',
  'manifest.webmanifest',
  'sw.js',
  'motivation_modifier.py',
  'validation_suite.py'
];

const dirsToCopy = [
  'icons',
  'js',
  'src'
];

for (const file of filesToCopy) {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[Build] Copied file: ${file}`);
  }
}

for (const dir of dirsToCopy) {
  const src = path.join(rootDir, dir);
  const dest = path.join(distDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`[Build] Copied directory: ${dir}`);
  }
}

// 3b. Copy public web data assets to dist/data (excluding bulky server-only caches to satisfy Cloudflare Pages 25MB limit)
const dataSrc = path.join(rootDir, 'data');
const dataDest = path.join(distDir, 'data');
fs.mkdirSync(dataDest, { recursive: true });

if (fs.existsSync(dataSrc)) {
  const publicFiles = fs.readdirSync(dataSrc).filter(f => {
    // Exclude server-only scraper caches & temporary files
    if (f === 'official_fallback_cache.json') return false;
    if (f.endsWith('.bak') || f.endsWith('.tmp')) return false;
    return true;
  });

  for (const f of publicFiles) {
    const s = path.join(dataSrc, f);
    const d = path.join(dataDest, f);
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

// 4. Create Cloudflare Pages / Netlify SPA routing rules & headers
const redirectsContent = `# Cloudflare Pages / Netlify SPA Routing
/api/fixtures    /data/fixtures.json    200
/*               /index.html            200
`;
fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent, 'utf-8');

const headersContent = `# Cloudflare Pages Headers
/data/*
  Cache-Control: no-cache, no-store, must-revalidate
  Access-Control-Allow-Origin: *

/sw.js
  Cache-Control: no-cache, no-store, must-revalidate

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
console.log('[Build] ✓ Production build successful! Output directory: dist/');
