const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function makeIcons() {
  const iconsDir = path.join(process.cwd(), 'public', 'icons');
  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

  const dropletSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#11171A"/>
        <stop offset="100%" stop-color="#1A252C"/>
      </linearGradient>
      <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8AB2C7"/>
        <stop offset="100%" stop-color="#719FB7"/>
      </linearGradient>
      <mask id="swirl">
        <rect width="512" height="512" fill="#fff" />
        <path d="M153 378C198 340 258 322 314 330C361 338 385 370 363 402C348 423 319 421 312 404C329 400 342 387 334 372C323 353 283 353 245 368C209 383 177 406 153 427Z" fill="#000"/>
      </mask>
    </defs>
    <rect width="512" height="512" rx="112" fill="url(#bg)"/>
    <g transform="translate(56, 30) scale(4)">
      <path d="M50 3C50 3 11 50 11 84C11 107 28.5 125 50 125C71.5 125 89 107 89 84C89 50 50 3 50 3Z" fill="url(#dropGrad)" mask="url(#swirl)" />
    </g>
  </svg>`);

  await sharp(dropletSvg).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512x512.png'));
  await sharp(dropletSvg).resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192x192.png'));
  await sharp(dropletSvg).resize(180, 180).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'));

  const maskableSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#11171A"/>
        <stop offset="100%" stop-color="#1A252C"/>
      </linearGradient>
      <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8AB2C7"/>
        <stop offset="100%" stop-color="#719FB7"/>
      </linearGradient>
      <mask id="swirl">
        <rect width="512" height="512" fill="#fff" />
        <path d="M153 378C198 340 258 322 314 330C361 338 385 370 363 402C348 423 319 421 312 404C329 400 342 387 334 372C323 353 283 353 245 368C209 383 177 406 153 427Z" fill="#000"/>
      </mask>
    </defs>
    <rect width="512" height="512" fill="url(#bg)"/>
    <g transform="translate(112, 90) scale(2.9)">
      <path d="M50 3C50 3 11 50 11 84C11 107 28.5 125 50 125C71.5 125 89 107 89 84C89 50 50 3 50 3Z" fill="url(#dropGrad)" mask="url(#swirl)" />
    </g>
  </svg>`);

  await sharp(maskableSvg).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-maskable-512x512.png'));

  const symbolSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 128" width="100" height="128">
    <defs>
      <mask id="swirl">
        <rect width="100" height="128" fill="#fff" />
        <path d="M11 80C23 70 39 65.5 54 67.5C66.5 69.5 73 78 67 86.5C63 92 55.5 91.5 53.5 87C58 86 61.5 82.5 59.5 78.5C56.5 73.5 46 73.5 36 77.5C26.5 81.5 18 87.5 11 93Z" fill="#000"/>
      </mask>
    </defs>
    <path d="M50 3C50 3 11 50 11 84C11 107 28.5 125 50 125C71.5 125 89 107 89 84C89 50 50 3 50 3Z" fill="#719FB7" mask="url(#swirl)" />
  </svg>`;
  fs.writeFileSync(path.join(process.cwd(), 'public', 'assets', 'symbol.svg'), symbolSvg);

  const symbolWhiteSvg = symbolSvg.replace('#719FB7', '#FFFFFF');
  fs.writeFileSync(path.join(process.cwd(), 'public', 'assets', 'symbol-white.svg'), symbolWhiteSvg);

  console.log('App icons generated successfully');
}

makeIcons().catch(console.error);
