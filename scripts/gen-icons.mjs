import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Generate all PWA icons from the master logo.svg.
// We rasterize from a high-density SVG and downsample for crispness.

const ROOT = process.cwd();
const SVG = readFileSync(join(ROOT, 'apps/web/public/logo.svg'));
const OUT = join(ROOT, 'apps/web/public/icons');

async function render(size, name, opts = {}) {
  const buf = await sharp(SVG, { density: 384 })
    .resize(size, size, { fit: 'contain', background: opts.bg ?? { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await sharp(buf).toFile(join(OUT, name));
  console.log(`✓ ${name}  ${size}x${size}`);
}

// Maskable icons need ~10% safe-area padding so launchers can crop them.
async function maskable(size, name) {
  const inner = Math.round(size * 0.8);
  const inset = Math.round((size - inner) / 2);
  const innerSvg = await sharp(SVG, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: { r: 26, g: 26, b: 46, alpha: 1 } })
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 26, g: 26, b: 46, alpha: 1 },
    },
  })
    .composite([{ input: innerSvg, top: inset, left: inset }])
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, name));
  console.log(`✓ ${name}  ${size}x${size} (maskable)`);
}

await render(192, 'icon-192.png');
await render(512, 'icon-512.png');
await maskable(512, 'icon-512-maskable.png');
await render(180, 'apple-touch-icon.png');
await render(32, '../favicon.ico');

console.log('\nDone.');
