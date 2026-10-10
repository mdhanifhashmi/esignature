/**
 * Builds PNG social icons into public/icons/ (email clients don't render SVG).
 * Run: node scripts/generate-social-icons.mjs
 */

import { mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../public/icons");
const SIZE = 64;

const BRANDS = {
  linkedin: { slug: "linkedin", color: "#0A66C2" },
  twitter: { slug: "x", color: "#000000" },
  instagram: { slug: "instagram", color: "#E4405F" },
  facebook: { slug: "facebook", color: "#0866FF" },
  youtube: { slug: "youtube", color: "#FF0000" },
  github: { slug: "github", color: "#181717" },
};

function circleWithGlyph(color, glyph) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="32" fill="${color}"/>
    <g transform="translate(17 17) scale(1.25)">${glyph}</g>
  </svg>`;
}

const websiteGlyph = `<g fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="M2 12h20"/>
  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
</g>`;

async function fetchPath(slug) {
  const res = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@11/icons/${slug}.svg`);
  if (!res.ok) throw new Error(`Failed to fetch ${slug}: ${res.status}`);
  const svg = await res.text();
  const match = svg.match(/\sd="([^"]+)"/);
  if (!match) throw new Error(`No path in ${slug}.svg`);
  return match[1];
}

async function writePng(name, svg) {
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(resolve(outDir, `${name}.png`), png);
  console.log(`✓ public/icons/${name}.png (${png.length} bytes)`);
}

mkdirSync(outDir, { recursive: true });

for (const [name, { slug, color }] of Object.entries(BRANDS)) {
  const d = await fetchPath(slug);
  await writePng(name, circleWithGlyph(color, `<path fill="#ffffff" d="${d}"/>`));
}
await writePng("website", circleWithGlyph("#64748B", websiteGlyph));
