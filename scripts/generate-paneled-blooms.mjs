// Original, deterministic application-shell artwork. No reference-image pixels are used.
// Run: node scripts/generate-paneled-blooms.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const root = new URL("../", import.meta.url);
const output = new URL("packages/kappa/src/blocks/app-shell/assets/", root);
const { tokens } = JSON.parse(readFileSync(new URL("packages/kappa/src/styles/tokens.json", root)));
const color = name => {
  const value = tokens.find(token => token.name === name).resolved.light;
  return [1, 3, 5].map(index => Number.parseInt(value.slice(index, index + 2), 16));
};
const blue = color("--kappa-accent-solid");
const teal = color("--kappa-chart-2");
const mix = (a, b, amount) => a.map((channel, index) => channel + (b[index] - channel) * amount);
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

// A 16-color blue-to-teal ramp with 16 alpha steps keeps the PNGs small.
// The transparent palette works on both light and dark application chrome.
const palette = Buffer.alloc(256 * 3);
const alpha = Buffer.alloc(256);
for (let shade = 0; shade < 16; shade++) {
  const t = shade / 15;
  const rgb = mix(mix(blue, teal, t), [255, 255, 255], Math.sin(t * Math.PI) * 0.32);
  for (let opacity = 0; opacity < 16; opacity++) {
    const index = shade * 16 + opacity;
    rgb.forEach((channel, i) => { palette[index * 3 + i] = Math.round(channel); });
    alpha[index] = Math.round(opacity / 15 * 100);
  }
}

let seed = 0;
function random() {
  seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
  return (seed >>> 0) / 4294967296;
}
function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4), checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}
function png(width, height, sample) {
  const rows = Buffer.alloc((width + 1) * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const { tone, coverage } = sample(x + 0.5, y + 0.5);
      // Seeded pixel grain and stochastic rounding avoid visible gradient bands.
      const shade = Math.round(clamp(tone + (random() - 0.5) * 0.1) * 15);
      const density = clamp(coverage * (0.82 + random() * 0.36));
      const opacity = Math.min(15, Math.floor(density * 15 + random()));
      rows[y * (width + 1) + x + 1] = shade * 16 + opacity;
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width); header.writeUInt32BE(height, 4);
  header[8] = 8; header[9] = 3;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header), chunk("PLTE", palette), chunk("tRNS", alpha),
    chunk("IDAT", deflateSync(rows, { level: 9 })), chunk("IEND", Buffer.alloc(0)),
  ]);
}

mkdirSync(output, { recursive: true });
seed = 0x44494345;
writeFileSync(new URL("paneled-side.png", output), png(350, 600, (x, y) => {
  const radius = Math.hypot((x - 355) / 350, (y - 290) / 310);
  const edge = 1 - smooth((radius - 0.42) / 0.58);
  return { tone: clamp(y / 600 + (1 - x / 350) * 0.14), coverage: edge * 0.64 };
}));
seed = 0x48554231;
writeFileSync(new URL("paneled-bottom.png", output), png(1200, 400, (x, y) => {
  const radius = Math.hypot((x - 610) / 595, (y - 425) / 420);
  const edge = 1 - smooth((radius - 0.32) / 0.68);
  return { tone: clamp(0.15 + x / 1500 - y / 2200), coverage: edge * 0.9 };
}));
console.log("Generated original paneled-side.png (350×600) and paneled-bottom.png (1200×400).");
