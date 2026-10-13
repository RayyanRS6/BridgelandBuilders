/**
 * Self-hosted image pipeline (SEO plan §4 "Blog LCP", §3.3 head/icons/OG).
 *
 *   npm run images                       everything below
 *   node scripts/build-images.mjs --only=blog    blog images only
 *   node scripts/build-images.mjs --only=brand   default OG image + app icons only
 *
 * Blog: reads media-src/manifest.json (from scripts/fetch-legacy-images.mjs)
 * and writes, per image, to public/images/blog/<post-slug>/:
 *   <alt-slug>-<w>.<hash8>.avif / .webp   at 480, 880 and 1320 px wide
 *                                         (never wider than the original)
 *     - body images keep their own aspect ratio;
 *     - post heroes are also cut to 16:9 (centre), as the layout shows them;
 *   <alt-slug>-1200x630.<hash8>.jpg       Open Graph image for each post hero
 * and src/data/media.generated.js mapping each original Wix URL to its files.
 * Names carry a content hash, so vercel.json serves /images/* as immutable.
 * Metadata (EXIF/GPS) is stripped. public/images/blog/ is regenerated whole.
 *
 * Brand: public/og/default-1200x630.jpg (brand colours, logo-on-dark.png and
 * DM Sans text) and public/icons/icon-192.png, icon-512.png,
 * icon-maskable-512.png (the bridge mark from the 1080px master logo, else
 * apple-touch-icon.png). The DM Sans TTFs used for the OG text are downloaded
 * once from Google Fonts into media-src/fonts/ (git-ignored).
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const PUBLIC = join(ROOT, 'public');
const MEDIA_SRC = join(ROOT, 'media-src');
const BLOG_OUT = join(PUBLIC, 'images', 'blog');
const GENERATED = join(ROOT, 'src', 'data', 'media.generated.js');
const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice('--only='.length);

const WIDTHS = [480, 880, 1320];
const MAIN_WIDTH = 880;
const OG = { width: 1200, height: 630 };
const BUDGET_KB = 300; // any image (plan §4)
const LCP_BUDGET_KB = 120; // the hero shown first

const BRAND = {
  dark: '#191715',
  red: '#C20917',
  cream: '#F7F5F0',
  muted: '#ABA298',
};

const hash8 = (buffer) => createHash('sha256').update(buffer).digest('hex').slice(0, 8);
const kb = (buffer) => Math.round(buffer.length / 102.4) / 10;
const warnings = [];

function slugify(text, fallback) {
  const slug = String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cutWords(slug, MAX_NAME) || fallback;
}

// Windows keeps whole paths under 260 characters, and this repo already lives
// in a deep folder, so folder and file names are capped (still descriptive).
const MAX_NAME = 36;
const MAX_FOLDER = 40;
const cutWords = (slug, max) => (slug.length > max ? slug.slice(0, max).replace(/-[^-]*$/, '') : slug);
const folderFor = (slug) => cutWords(slug, MAX_FOLDER);

function writeOnce(dir, base, ext, buffer) {
  const name = `${base}.${hash8(buffer)}.${ext}`;
  writeFileSync(join(dir, name), buffer);
  return name;
}

/* ================================================================ blog */

async function variantSet(input, { dir, urlDir, base, ratio, originalWidth, label }) {
  const widths = WIDTHS.filter((w) => w <= originalWidth);
  if (!widths.length) widths.push(originalWidth);
  const main = widths.includes(MAIN_WIDTH) ? MAIN_WIDTH : widths[widths.length - 1];
  const avif = [];
  const webp = [];
  let mainWebp = null;
  for (const width of widths) {
    const height = Math.round(width * ratio);
    const pipeline = () => sharp(input).rotate().resize({ width, height, fit: 'cover', position: 'centre' });
    const avifBuf = await pipeline().avif({ quality: 50, effort: 4 }).toBuffer();
    const webpBuf = await pipeline().webp({ quality: 76, effort: 5 }).toBuffer();
    for (const [buf, fmt] of [[avifBuf, 'avif'], [webpBuf, 'webp']]) {
      if (kb(buf) > BUDGET_KB) warnings.push(`${label} ${width}w ${fmt} is ${kb(buf)} KB (> ${BUDGET_KB} KB)`);
    }
    const avifName = writeOnce(dir, `${base}-${width}`, 'avif', avifBuf);
    const webpName = writeOnce(dir, `${base}-${width}`, 'webp', webpBuf);
    avif.push(`${urlDir}/${avifName} ${width}w`);
    webp.push(`${urlDir}/${webpName} ${width}w`);
    if (width === main) mainWebp = { name: webpName, avifKb: kb(avifBuf), webpKb: kb(webpBuf) };
  }
  return {
    set: {
      src: `${urlDir}/${mainWebp.name}`,
      srcSet: webp.join(', '),
      avifSrcSet: avif.join(', '),
      width: main,
      height: Math.round(main * ratio),
    },
    mainKb: mainWebp,
  };
}

async function buildBlog() {
  const manifestPath = join(MEDIA_SRC, 'manifest.json');
  if (!existsSync(manifestPath)) {
    console.log('[images] no media-src/manifest.json — run node scripts/fetch-legacy-images.mjs first; blog images skipped');
    return;
  }
  const images = JSON.parse(readFileSync(manifestPath, 'utf8'));
  rmSync(BLOG_OUT, { recursive: true, force: true });
  const media = {};
  let files = 0;

  for (const image of images) {
    const input = readFileSync(join(MEDIA_SRC, image.file));
    const meta = await sharp(input).rotate().metadata();
    const width = meta.autoOrient?.width || meta.width;
    const height = meta.autoOrient?.height || meta.height;
    const heroUse = image.uses.find((u) => u.role === 'hero');
    const bodyUse = image.uses.find((u) => u.role === 'body');
    const owner = (heroUse || bodyUse || image.uses[0]).slug;
    const folder = folderFor(owner);
    const dir = join(BLOG_OUT, folder);
    const urlDir = `/images/blog/${folder}`;
    mkdirSync(dir, { recursive: true });
    const altBase = slugify((bodyUse || heroUse || {}).alt, `${owner}-image`);
    const entry = { original: { width, height, bytes: image.bytes } };

    if (bodyUse) {
      const { set } = await variantSet(input, { dir, urlDir, base: altBase, ratio: height / width, originalWidth: width, label: image.file });
      Object.assign(entry, set);
      files += set.srcSet.split(', ').length * 2;
    }
    if (heroUse) {
      const heroBase = slugify(heroUse.alt, `${owner}-hero`);
      const { set, mainKb } = await variantSet(input, { dir, urlDir, base: heroBase, ratio: 9 / 16, originalWidth: width, label: `${image.file} (hero)` });
      entry.hero = set;
      if (!bodyUse) Object.assign(entry, set, { crop: '16:9' });
      files += set.srcSet.split(', ').length * 2;
      if (mainKb.avifKb > LCP_BUDGET_KB) warnings.push(`${owner} hero ${MAIN_WIDTH}w AVIF is ${mainKb.avifKb} KB (> ${LCP_BUDGET_KB} KB LCP budget)`);

      const og = await sharp(input)
        .rotate()
        .resize({ width: OG.width, height: OG.height, fit: 'cover', position: 'centre' })
        .flatten({ background: '#ffffff' })
        .jpeg({ quality: 80, mozjpeg: true, progressive: true })
        .toBuffer();
      if (kb(og) > BUDGET_KB) warnings.push(`${owner} OG image is ${kb(og)} KB (> ${BUDGET_KB} KB)`);
      entry.og = `${urlDir}/${writeOnce(dir, `${heroBase}-${OG.width}x${OG.height}`, 'jpg', og)}`;
      files += 1;
    }
    media[image.url] = entry;
    process.stdout.write('.');
  }
  process.stdout.write('\n');

  const out = `// Generated by scripts/build-images.mjs from media-src/ — do not edit by hand.
// Re-run: node scripts/fetch-legacy-images.mjs && npm run images
//
// Original (Wix) image URL -> self-hosted files under /images/blog/<post-slug>/:
//   src, srcSet       WebP: main file (${MAIN_WIDTH}px or the largest available) and the
//                     ${WIDTHS.join('/')} set; works in a plain <img srcset>
//   avifSrcSet        the same widths as AVIF, for <picture><source type="image/avif">
//   width, height     size of \`src\` (for the <img> width/height attributes)
//   hero              (post heroes) the same three fields cut to 16:9, centred
//   og                (post heroes) 1200x630 JPEG for Open Graph
//   original          the Wix original's size
//   crop: '16:9'      top-level fields are the hero cut (image used only as a hero)
export const MEDIA = ${JSON.stringify(media, null, 2)};

/** Self-hosted versions of an original image URL, or undefined. */
export function mediaFor(url) {
  return MEDIA[url];
}
`;
  writeFileSync(GENERATED, out);
  console.log(`[images] blog: ${images.length} originals -> ${files} files in public/images/blog/; src/data/media.generated.js written`);
}

/* =============================================================== brand */

async function dmSansFonts() {
  const dir = join(MEDIA_SRC, 'fonts');
  const files = { regular: join(dir, 'DMSans-Regular.ttf'), bold: join(dir, 'DMSans-Bold.ttf') };
  if (existsSync(files.regular) && existsSync(files.bold)) return files;
  try {
    mkdirSync(dir, { recursive: true });
    // An unrecognised user agent gets TrueType files, which Pango can load.
    const css = await (await fetch('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,700', { headers: { 'User-Agent': 'node' } })).text();
    const urls = [...css.matchAll(/font-weight:\s*(\d+);[\s\S]*?url\((https:[^)]+\.ttf)\)/g)];
    for (const [, weight, url] of urls) {
      const buffer = Buffer.from(await (await fetch(url)).arrayBuffer());
      writeFileSync(weight === '700' ? files.bold : files.regular, buffer);
    }
    return existsSync(files.regular) && existsSync(files.bold) ? files : null;
  } catch (error) {
    console.warn(`[images] could not fetch DM Sans TTFs (${error.message}); OG text falls back to a system font`);
    return null;
  }
}

/** A line of text as a transparent PNG (Pango, DM Sans when available). */
async function textImage(text, { size, weight, color, fonts, maxWidth }) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const fontfile = fonts && (weight === 'bold' ? fonts.bold : fonts.regular);
  const font = fonts ? `DM Sans ${weight === 'bold' ? 'Bold' : 'Regular'} ${size}` : `Arial ${weight === 'bold' ? 'Bold' : ''} ${size}`;
  return sharp({
    text: {
      text: `<span foreground="${color}">${escaped}</span>`,
      font,
      ...(fontfile ? { fontfile } : {}),
      rgba: true,
      dpi: 72,
      width: maxWidth,
      wrap: 'word',
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
}

async function bridgeMark() {
  const master = join(ROOT, 'website logo', 'Bridgeland Builders Logo in Dark Background.png');
  if (existsSync(master)) {
    // The round bridge mark sits in the top part of the 1080px master; find it
    // from the alpha channel.
    const meta = await sharp(master).metadata();
    const band = Math.round(meta.height * 0.58);
    const { data, info } = await sharp(master)
      .extract({ left: 0, top: 0, width: meta.width, height: band })
      .ensureAlpha()
      .extractChannel(3)
      .raw()
      .toBuffer({ resolveWithObject: true });
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < info.height; y += 1) {
      for (let x = 0; x < info.width; x += 1) {
        if (data[y * info.width + x] > 16) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
    if (maxX > minX && maxY > minY) {
      const w = maxX - minX + 1;
      const h = maxY - minY + 1;
      const side = Math.max(w, h);
      return sharp(master)
        .extract({ left: minX, top: minY, width: w, height: h })
        .extend({
          top: Math.floor((side - h) / 2),
          bottom: Math.ceil((side - h) / 2),
          left: Math.floor((side - w) / 2),
          right: Math.ceil((side - w) / 2),
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
    }
  }
  return readFileSync(join(PUBLIC, 'apple-touch-icon.png'));
}

async function buildIcons() {
  const dir = join(PUBLIC, 'icons');
  mkdirSync(dir, { recursive: true });
  const mark = await bridgeMark();
  // Palette PNGs (libimagequant): the painted mark is gradient-heavy, and
  // full-colour PNGs of it run to 400 KB at 512px.
  const png = { compressionLevel: 9, palette: true, quality: 92, effort: 10, dither: 1 };
  const sizes = [];
  for (const size of [192, 512]) {
    const buf = await sharp(mark).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png(png).toBuffer();
    writeFileSync(join(dir, `icon-${size}.png`), buf);
    sizes.push(`icon-${size}.png ${kb(buf)} KB`);
  }
  // Maskable: full-bleed brand background, mark inside the 80% safe circle.
  const inner = Math.round(512 * 0.74);
  const markBuf = await sharp(mark).resize(inner, inner).png().toBuffer();
  const maskable = await sharp({ create: { width: 512, height: 512, channels: 4, background: BRAND.dark } })
    .composite([{ input: markBuf, left: Math.round((512 - inner) / 2), top: Math.round((512 - inner) / 2) }])
    .png(png)
    .toBuffer();
  writeFileSync(join(dir, 'icon-maskable-512.png'), maskable);
  sizes.push(`icon-maskable-512.png ${kb(maskable)} KB`);
  console.log(`[images] icons (public/icons/): ${sizes.join(', ')}`);
}

async function buildDefaultOg() {
  const dir = join(PUBLIC, 'og');
  mkdirSync(dir, { recursive: true });
  const fonts = await dmSansFonts();
  const { width: W, height: H } = OG;

  const logoHeight = 390;
  const logo = await sharp(join(PUBLIC, 'logo-on-dark.png')).resize({ height: logoHeight }).png().toBuffer({ resolveWithObject: true });
  const logoLeft = 64;
  const logoTop = Math.round((H - logo.info.height) / 2);

  const textLeft = logoLeft + logo.info.width + 64;
  const textWidth = W - textLeft - 56;
  // Largest size that keeps the name on one line.
  let title;
  for (const size of [64, 60, 56, 52, 48]) {
    title = await textImage('Bridgeland Builders', { size, weight: 'bold', color: '#FFFFFF', fonts });
    if (title.info.width <= textWidth) break;
  }
  const line = await textImage('Winnipeg renovation & construction contractor', { size: 34, weight: 'regular', color: '#FFFFFF', fonts, maxWidth: textWidth });
  const site = await textImage('bridgelandbuilders.com', { size: 26, weight: 'regular', color: BRAND.muted, fonts, maxWidth: textWidth });

  const barHeight = 8;
  const gap = 26;
  const blockHeight = barHeight + gap + title.info.height + 18 + line.info.height + 34 + site.info.height;
  let y = Math.round((H - blockHeight) / 2);
  const layers = [{ input: logo.data, left: logoLeft, top: logoTop }];
  const background = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
      `<rect width="${W}" height="${H}" fill="${BRAND.dark}"/>` +
      `<rect x="0" y="${H - 10}" width="${W}" height="10" fill="${BRAND.red}"/>` +
      `<rect x="${textLeft}" y="${y}" width="96" height="${barHeight}" rx="4" fill="${BRAND.red}"/>` +
      `</svg>`
  );
  y += barHeight + gap;
  layers.push({ input: title.data, left: textLeft, top: y });
  y += title.info.height + 18;
  layers.push({ input: line.data, left: textLeft, top: y });
  y += line.info.height + 34;
  layers.push({ input: site.data, left: textLeft, top: y });

  const jpg = await sharp(background).composite(layers).flatten({ background: BRAND.dark }).jpeg({ quality: 86, mozjpeg: true, progressive: true }).toBuffer();
  if (kb(jpg) > BUDGET_KB) warnings.push(`default OG image is ${kb(jpg)} KB (> ${BUDGET_KB} KB)`);
  writeFileSync(join(dir, `default-${W}x${H}.jpg`), jpg);
  console.log(`[images] OG: public/og/default-${W}x${H}.jpg (${kb(jpg)} KB${fonts ? ', DM Sans' : ', system font'})`);
}

/* ================================================================= run */

if (!only || only === 'blog') await buildBlog();
if (!only || only === 'brand') {
  await buildDefaultOg();
  await buildIcons();
}
for (const warning of warnings) console.warn(`[images] warning: ${warning}`);
