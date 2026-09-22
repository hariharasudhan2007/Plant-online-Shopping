import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create botanical leaf SVG
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1b4332" />
      <stop offset="100%" stop-color="#081c15" />
    </linearGradient>
    <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#95d5b2" />
      <stop offset="100%" stop-color="#2d6a4f" />
    </linearGradient>
    <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d8f3dc" />
      <stop offset="100%" stop-color="#52b788" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background rounded rect -->
  <rect width="512" height="512" rx="104" fill="url(#bgGrad)" />

  <!-- Botanical Emblem Group -->
  <g filter="url(#glow)" transform="translate(0, -10)">
    <!-- Main Monstera / Botanical Leaf -->
    <path d="M256 90 C340 90, 410 160, 410 260 C410 350, 340 410, 256 420 C172 410, 102 350, 102 260 C102 160, 172 90, 256 90 Z" fill="url(#leafGrad1)" />
    
    <!-- Left Leaf Wing -->
    <path d="M256 120 C200 150, 140 220, 150 310 C180 290, 220 270, 256 260 Z" fill="url(#leafGrad2)" opacity="0.9" />
    
    <!-- Right Leaf Wing -->
    <path d="M256 120 C312 150, 372 220, 362 310 C332 290, 292 270, 256 260 Z" fill="#74c69d" opacity="0.8" />
    
    <!-- Central Stem -->
    <path d="M256 110 L256 430" stroke="#d8f3dc" stroke-width="8" stroke-linecap="round" />
    
    <!-- Ribs -->
    <path d="M256 200 Q200 180 170 200" stroke="#d8f3dc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M256 200 Q312 180 342 200" stroke="#d8f3dc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M256 260 Q190 250 155 280" stroke="#d8f3dc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M256 260 Q322 250 357 280" stroke="#d8f3dc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M256 320 Q205 320 180 350" stroke="#d8f3dc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M256 320 Q307 320 332 350" stroke="#d8f3dc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
  </g>

  <!-- Small Glowing Sprout Accent -->
  <circle cx="256" cy="110" r="10" fill="#d8f3dc" />
</svg>`;

// 2. Create Maskable SVG with safe-zone margin (15% padding all around)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGradMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1b4332" />
      <stop offset="100%" stop-color="#081c15" />
    </linearGradient>
    <linearGradient id="leafGrad1Mask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#95d5b2" />
      <stop offset="100%" stop-color="#2d6a4f" />
    </linearGradient>
    <linearGradient id="leafGrad2Mask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d8f3dc" />
      <stop offset="100%" stop-color="#52b788" />
    </linearGradient>
  </defs>

  <!-- Full-bleed background -->
  <rect width="512" height="512" fill="url(#bgGradMask)" />

  <!-- Scaled content inside safe zone (approx 72% scale centered) -->
  <g transform="translate(71.68, 71.68) scale(0.72)">
    <path d="M256 90 C340 90, 410 160, 410 260 C410 350, 340 410, 256 420 C172 410, 102 350, 102 260 C102 160, 172 90, 256 90 Z" fill="url(#leafGrad1Mask)" />
    <path d="M256 120 C200 150, 140 220, 150 310 C180 290, 220 270, 256 260 Z" fill="url(#leafGrad2Mask)" opacity="0.9" />
    <path d="M256 120 C312 150, 372 220, 362 310 C332 290, 292 270, 256 260 Z" fill="#74c69d" opacity="0.8" />
    <path d="M256 110 L256 430" stroke="#d8f3dc" stroke-width="8" stroke-linecap="round" />
    <path d="M256 200 Q200 180 170 200" stroke="#d8f3dc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M256 200 Q312 180 342 200" stroke="#d8f3dc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M256 260 Q190 250 155 280" stroke="#d8f3dc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M256 260 Q322 250 357 280" stroke="#d8f3dc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M256 320 Q205 320 180 350" stroke="#d8f3dc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
    <path d="M256 320 Q307 320 332 350" stroke="#d8f3dc" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.85"/>
    <circle cx="256" cy="110" r="10" fill="#d8f3dc" />
  </g>
</svg>`;

async function main() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
  console.log('Wrote public/icon.svg');

  const svgBuffer = Buffer.from(svgContent);
  const maskableSvgBuffer = Buffer.from(maskableSvg);

  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated public/pwa-192x192.png');

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated public/pwa-512x512.png');

  // apple-touch-icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated public/apple-touch-icon.png');

  // maskable 512x512
  await sharp(maskableSvgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated public/pwa-maskable-512x512.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
