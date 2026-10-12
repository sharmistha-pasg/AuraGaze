import fs from 'fs';
import path from 'path';

const root = process.cwd();
const extDir = path.join(root, 'extension');

if (!fs.existsSync(extDir)) {
  fs.mkdirSync(extDir, { recursive: true });
}

// 1. Copy shared/profile.js -> extension/profile.js
const profileSrc = path.join(root, 'shared', 'profile.js');
const profileDest = path.join(extDir, 'profile.js');
fs.copyFileSync(profileSrc, profileDest);
console.log('Synced shared/profile.js -> extension/profile.js');

// 2. Copy node_modules/@mozilla/readability/Readability.js -> extension/Readability.js
const readabilitySrc = path.join(root, 'node_modules', '@mozilla', 'readability', 'Readability.js');
const readabilityDest = path.join(extDir, 'Readability.js');
fs.copyFileSync(readabilitySrc, readabilityDest);
console.log('Synced node_modules/.../Readability.js -> extension/Readability.js');
