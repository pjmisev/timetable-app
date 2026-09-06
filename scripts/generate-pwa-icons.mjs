import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdir } from "node:fs/promises";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public", "icons");
const whiteLogo = resolve(root, "public", "img", "logo", "Timetables_Logo_White.png");

const primaryBlue = { r: 0x00, g: 0x7b, b: 0xb4 };
const logoWidthRatio = 0.7;

async function makeIcon(size, filename) {
  const logo = await sharp(whiteLogo)
    .resize({ width: Math.round(size * logoWidthRatio) })
    .toBuffer();

  const canvas = sharp({
    create: { width: size, height: size, channels: 3, background: primaryBlue },
  });

  await canvas
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(resolve(outDir, filename));
}

await mkdir(outDir, { recursive: true });

await Promise.all([
  makeIcon(512, "icon-512.png"),
  makeIcon(192, "icon-192.png"),
  makeIcon(48, "icon-48.png"),
  makeIcon(180, "apple-touch-icon.png"),
]);
