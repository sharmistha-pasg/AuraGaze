import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import AdmZip from 'adm-zip';

const root = process.cwd();

// 1. Run sync first
execSync('node scripts/ext-sync.mjs', { stdio: 'inherit' });

const extDir = path.join(root, 'extension');
const publicDir = path.join(root, 'public');
const outZip = path.join(publicDir, 'auragaze-extension.zip');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const zip = new AdmZip();

function addFilesRecursively(dir, zipPath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    // Exclude hidden files, .gitkeep, and source maps
    if (entry.name.startsWith('.') || entry.name.endsWith('.map')) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    const entryZipPath = zipPath ? `${zipPath}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      addFilesRecursively(fullPath, entryZipPath);
    } else {
      const content = fs.readFileSync(fullPath);
      zip.addFile(entryZipPath, content);
    }
  }
}

addFilesRecursively(extDir);
zip.writeZip(outZip);

const sizeKb = (fs.statSync(outZip).size / 1024).toFixed(1);
console.log(`Package created: public/auragaze-extension.zip (${sizeKb} KB)`);
