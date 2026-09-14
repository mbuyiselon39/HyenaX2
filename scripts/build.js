import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveFixtures } from './generateFixtures.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('[Build] Starting HyenaX production build...');

// 1. Generate fixtures and model data
try {
  console.log('[Build] Ensuring latest fixtures and model predictions...');
  saveFixtures();
} catch (err) {
  console.warn('[Build] Warning: Fixture generation encountered error:', err.message);
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
  'sw.js'
];

const dirsToCopy = [
  'data',
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

console.log('[Build] ✓ Production build successful! Output directory: dist/');
