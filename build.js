/**
 * CHOP CHOP Digital Ordering System
 * Production Build Script
 * 
 * Prepares static production distribution in dist/ without build tools or transpilers.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');

console.log('[CHOP CHOP] Preparing static production assets in dist/...');

// Clean or recreate dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy static files & directories
const itemsToCopy = ['index.html', 'css', 'js', 'data', 'assets', 'public'];

for (const item of itemsToCopy) {
  const srcPath = path.join(__dirname, item);
  const destPath = path.join(distDir, item);

  if (fs.existsSync(srcPath)) {
    fs.cpSync(srcPath, destPath, { recursive: true });
    console.log(`[CHOP CHOP] Copied ${item} -> dist/${item}`);
  }
}

console.log('[CHOP CHOP] Digital Menu build completed successfully.');
