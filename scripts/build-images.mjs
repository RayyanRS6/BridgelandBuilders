/**
 * Self-hosted image pipeline (SEO plan §4 "Blog LCP", §3.3 head/icons/OG).
 *
 *   npm run images                       everything below
 *   node scripts/build-images.mjs --only=blog    blog images (legacy + title cards) only
 *   node scripts/build-images.mjs --only=cards   title cards only (legacy files kept)
 *   node scripts/build-images.mjs --only=brand   default OG image, app icons and WebP logos
 *   node scripts/build-images.mjs --only=logos   WebP logos only
 *   node scripts/build-images.mjs --only=stock   self-hosted stock photos (home hero)
 *
 * Blog: reads media-src/manifest.json (from scripts/fetch-legacy-images.mjs)
 * and writes, per image, to public/images/blog/<post-slug>/:
 *   <alt-slug>-<w>.<hash8>.avif / .webp   at 480, 880 and 1320 px wide
 *                                         (never wider than the original)
 *     - body images keep their own aspect ratio;
 *     - post heroes are also cut to 16:9 (centre), as the layout shows them;
 *   <alt-slug>-1200x630.<hash8>.jpg       Open Graph image for each post hero
 *   <alt-slug>-1200x675 / -1200x900 / -1200x1200.<hash8>.jpg
 *                                         article images (16:9, 4:3, 1:1) for
 *                                         BlogPosting.image: centred cover
 *                                         crops of a photo; a hero with
 *                                         lettering on it is shown whole over
 *                                         a blurred fill instead
 * and src/data/media.generated.js mapping each original Wix URL to its files.
 * Names carry a content hash, so vercel.json serves /images/* as immutable.
 * Metadata (EXIF/GPS) is stripped. public/images/blog/ is regenerated whole.
 * Only images that a published post in blog-raw/posts/ shows now are built
 * (a post turned into a redirect or draft takes its images with it), and the
 * names come from the alts in those posts, so a rewritten alt renames its
 * files on the next run without fetching anything again.
 *
 * Title cards: every published post in blog-raw/posts/ without a `hero` gets
 * a branded card instead (dark background, red accent bar, the post title in
 * white DM Sans Bold on at most four lines, "Bridgeland Builders · Winnipeg"
 * footer), drawn at 1320x743 and written like a hero (same widths, AVIF and
 * WebP) plus a separate 1200x630 OG layout and the three article-image
 * layouts (1200x675, 1200x900, 1200x1200), under the same short names
 * (title-card-<title-slug>-…). Its media.generated.js entry is keyed
 * 'card:<slug>'. Without media-src/manifest.json (or with --only=cards) the
 * legacy files and entries are kept (less those no published post shows any
 * more) and only the cards are redone.
 *
 * Brand: public/og/default-1200x630.jpg (brand colours, logo-on-dark.png and
 * DM Sans text) and public/icons/icon-192.png, icon-512.png,
 * icon-maskable-512.png (the bridge mark from the 1080px master logo, else
 * apple-touch-icon.png). The DM Sans TTFs used for the OG text are downloaded
 * once from Google Fonts into media-src/fonts/ (git-ignored).
 *
 * Logos: WebP copies of the header and footer logos at their display sizes,
 * 1x and 2x (public/logo-mark-48.webp / -96.webp for the navbar mark,
 * public/logo-on-dark-220.webp / -440.webp for the footer), made from the
 * PNGs next to them. Navbar.jsx and Footer.jsx serve them through <picture>
 * with the PNG as the fallback; logo-on-light.png stays the schema logo.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const PUBLIC = join(ROOT, 'public');
const MEDIA_SRC = join(ROOT, 'media-src');
const POSTS_DIR = join(ROOT, 'blog-raw', 'posts');
const BLOG_OUT = join(PUBLIC, 'images', 'blog');
const GENERATED = join(ROOT, 'src', 'data', 'media.generated.js');
const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice('--only='.length);

const WIDTHS = [480, 880, 1320];
const MAIN_WIDTH = 880;
const OG = { width: 1200, height: 630 };
// BlogPosting.image: Google asks for several high-resolution images in 16:9,
// 4:3 and 1:1 (each at least 50,000 pixels); 1200px wide also suits Discover.
const ARTICLE_SIZES = [
  { width: 1200, height: 675, layout: 'article16x9' },
  { width: 1200, height: 900, layout: 'article4x3' },
  { width: 1200, height: 1200, layout: 'article1x1' },
];
const BUDGET_KB = 300; // any image (plan §4)
const LCP_BUDGET_KB = 120; // the hero shown first
const ARTICLE_BUDGET_KB = 150; // each article image (fetched by crawlers only)
// Heroes whose alt says they carry lettering ("Title graphic reading …",
// "… with the title …"): a 4:3 or 1:1 cover crop would cut the words, so their
// article images show the whole frame over a blurred fill of itself.
const LETTERED_ALT = /\btitle (graphic|card)\b|\bwith the title\b/i;
// Windows keeps whole paths under 260 characters; the longest blog image path
// (printed after each run) must stay under this.
const MAX_PATH = 240;
const WIX_MEDIA = /^https:\/\/static\.wixstatic\.com\/media\/[^/?#]+$/;

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
// Words a shortened name should not end on ("…-project-with", "…-for-a").
const TRAILING_STOP_WORDS = new Set(['a', 'an', 'and', 'at', 'by', 'for', 'from', 'in', 'of', 'on', 'or', 'the', 'to', 'with', 'your']);

/** The slug cut to at most `max` characters at a whole word, without a dangling stop word. */
function cutWords(slug, max) {
  if (slug.length <= max) return slug;
  const head = slug[max] === '-' ? slug.slice(0, max) : slug.slice(0, max).replace(/-[^-]*$/, '');
  const words = head.split('-');
  while (words.length > 1 && TRAILING_STOP_WORDS.has(words[words.length - 1])) words.pop();
  return words.join('-');
}

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

/**
 * A photo cut to width x height, centred like the hero and OG cuts (sharp's
 * attention strategy went for the bright window in the bathroom hero and cut
 * the tub off at 1:1).
 */
const coverCrop = (input, width, height) =>
  sharp(input).rotate().resize({ width, height, fit: 'cover', position: 'centre' });

/** The whole frame, fitted inside width x height, over a blurred, dimmed cover fill of itself. */
async function wholeFrame(input, width, height) {
  const fill = await sharp(input).rotate().resize({ width, height, fit: 'cover' }).blur(40).modulate({ brightness: 0.8 }).toBuffer();
  const { data, info } = await sharp(input).rotate().resize({ width, height, fit: 'inside' }).toBuffer({ resolveWithObject: true });
  return sharp(fill).composite([
    { input: data, left: Math.round((width - info.width) / 2), top: Math.round((height - info.height) / 2) },
  ]);
}

/** An article image (a sharp pipeline) as a JPEG, with a warning past ARTICLE_BUDGET_KB. */
async function articleJpeg(image, label, quality = 80) {
  const jpg = await image.flatten({ background: '#ffffff' }).jpeg({ quality, mozjpeg: true, progressive: true }).toBuffer();
  if (kb(jpg) > ARTICLE_BUDGET_KB) warnings.push(`${label} is ${kb(jpg)} KB (> ${ARTICLE_BUDGET_KB} KB)`);
  return jpg;
}

/**
 * Blog images: the legacy (Wix) originals when media-src/manifest.json is
 * there (public/images/blog/ is then rebuilt whole), else the current legacy
 * files and entries are kept; then the title cards; then media.generated.js.
 */
async function buildBlog({ cardsOnly = false } = {}) {
  const manifestPath = join(MEDIA_SRC, 'manifest.json');
  let media;
  let summary;
  if (!cardsOnly && existsSync(manifestPath)) {
    ({ media, summary } = await buildLegacyImages(manifestPath));
  } else {
    if (!cardsOnly) {
      console.log('[images] no media-src/manifest.json — legacy blog images kept as they are (run node scripts/fetch-legacy-images.mjs to rebuild them)');
    }
    media = await keptLegacyMedia();
    summary = `${Object.keys(media).length} legacy entries kept`;
  }
  const cards = await buildTitleCards(media);
  writeFileSync(GENERATED, mediaModule(media));
  console.log(`[images] blog: ${summary}; ${cards} title card(s); src/data/media.generated.js written`);
  const longest = longestPath(BLOG_OUT);
  console.log(`[images] longest path: ${longest.length} characters (${longest})`);
  if (longest.length >= MAX_PATH) warnings.push(`${longest} is ${longest.length} characters (>= ${MAX_PATH}); shorten MAX_NAME or MAX_FOLDER`);
}

/** The longest file path under `dir`. */
function longestPath(dir) {
  let longest = '';
  for (const entry of existsSync(dir) ? readdirSync(dir, { withFileTypes: true }) : []) {
    const path = entry.isDirectory() ? longestPath(join(dir, entry.name)) : join(dir, entry.name);
    if (path.length > longest.length) longest = path;
  }
  return longest;
}

async function buildLegacyImages(manifestPath) {
  const images = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const current = currentUses();
  if (current) {
    const fetched = new Set(images.map((image) => image.url));
    for (const [url, uses] of current) {
      if (WIX_MEDIA.test(url) && !fetched.has(url)) {
        warnings.push(`${uses[0].slug} uses ${url}, which is not in media-src/manifest.json (run node scripts/fetch-legacy-images.mjs)`);
      }
    }
  }
  rmSync(BLOG_OUT, { recursive: true, force: true });
  const media = {};
  let files = 0;
  let built = 0;

  for (const image of images) {
    // How the published posts use the image now; no use, no files.
    const uses = current ? current.get(image.url) || [] : image.uses;
    if (!uses.length) continue;
    built += 1;
    const input = readFileSync(join(MEDIA_SRC, image.file));
    const meta = await sharp(input).rotate().metadata();
    const width = meta.autoOrient?.width || meta.width;
    const height = meta.autoOrient?.height || meta.height;
    const heroUse = uses.find((u) => u.role === 'hero');
    const bodyUse = uses.find((u) => u.role === 'body');
    const owner = (heroUse || bodyUse || uses[0]).slug;
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

      entry.schemaImages = [];
      for (const { width: w, height: h } of ARTICLE_SIZES) {
        const cut = LETTERED_ALT.test(heroUse.alt) ? await wholeFrame(input, w, h) : coverCrop(input, w, h);
        const jpg = await articleJpeg(cut, `${owner} ${w}x${h} article image`);
        entry.schemaImages.push(`${urlDir}/${writeOnce(dir, `${heroBase}-${w}x${h}`, 'jpg', jpg)}`);
        files += 1;
      }
    }
    media[image.url] = entry;
    process.stdout.write('.');
  }
  process.stdout.write('\n');
  const skipped = images.length - built;
  return {
    media,
    summary: `${built} originals -> ${files} files in public/images/blog/${skipped ? ` (${skipped} no published post uses skipped)` : ''}`,
  };
}

/**
 * The Wix originals the published posts show now, by URL, as manifest-style
 * uses ({ slug, role, alt }, the alts as fetch-legacy-images.mjs reads them):
 * each post's hero (alt: heroAlt, else the title) and its body images. Null
 * without blog-raw/posts/, in which case the manifest's own uses stand.
 */
function currentUses() {
  if (!existsSync(POSTS_DIR)) return null;
  const uses = new Map();
  const add = (url, use) => {
    if (!url) return;
    if (!uses.has(url)) uses.set(url, []);
    uses.get(url).push(use);
  };
  for (const post of publishedPosts()) {
    add(post.hero, { slug: post.slug, role: 'hero', alt: post.heroAlt || post.title });
    for (const block of Array.isArray(post.blocks) ? post.blocks : []) {
      if (block && block.t === 'img') add(block.src, { slug: post.slug, role: 'body', alt: block.alt });
    }
  }
  return uses;
}

/**
 * The current media.generated.js minus its title cards (whose files are
 * deleted, as they are redrawn next) and minus any original no published post
 * shows any more (files deleted too), for runs that do not rebuild the legacy
 * images.
 */
async function keptLegacyMedia() {
  if (!existsSync(GENERATED)) return {};
  const { MEDIA = {} } = await import(pathToFileURL(GENERATED).href);
  const current = currentUses();
  const media = {};
  for (const [key, entry] of Object.entries(MEDIA)) {
    if (key.startsWith(CARD_PREFIX) || (current && !current.has(key))) removeImageFiles(entry);
    else media[key] = entry;
  }
  return media;
}

/** Deletes the /images/blog/ files of a media entry (and its folder once empty). */
function removeImageFiles(entry) {
  const sets = [entry.srcSet, entry.avifSrcSet, entry.hero?.srcSet, entry.hero?.avifSrcSet].flatMap((set) =>
    String(set || '').split(', ').map((item) => item.split(' ')[0])
  );
  const folders = new Set();
  for (const url of new Set([entry.src, entry.og, entry.hero?.src, ...sets, ...(entry.schemaImages || [])])) {
    if (!url || !url.startsWith('/images/blog/')) continue;
    const parts = url.slice(1).split('/');
    rmSync(join(PUBLIC, ...parts), { force: true });
    folders.add(join(PUBLIC, ...parts.slice(0, -1)));
  }
  for (const folder of folders) {
    if (existsSync(folder) && !readdirSync(folder).length) rmSync(folder, { recursive: true, force: true });
  }
}

function mediaModule(media) {
  return `// Generated by scripts/build-images.mjs from media-src/ and blog-raw/posts/ — do not edit by hand.
// Re-run: node scripts/fetch-legacy-images.mjs && npm run images
//
// Original (Wix) image URL -> self-hosted files under /images/blog/<post-slug>/:
//   src, srcSet       WebP: main file (${MAIN_WIDTH}px or the largest available) and the
//                     ${WIDTHS.join('/')} set; works in a plain <img srcset>
//   avifSrcSet        the same widths as AVIF, for <picture><source type="image/avif">
//   width, height     size of \`src\` (for the <img> width/height attributes)
//   hero              (post heroes) the same three fields cut to 16:9, centred
//   og                (post heroes) 1200x630 JPEG for Open Graph
//   schemaImages      (post heroes) ${ARTICLE_SIZES.map((s) => `${s.width}x${s.height}`).join(', ')} JPEGs (16:9, 4:3, 1:1)
//                     for BlogPosting.image
//   original          the Wix original's size
//   crop: '16:9'      top-level fields are the hero cut (image used only as a hero)
//
// '${CARD_PREFIX}<post-slug>' -> the branded title card of a published post without a
// hero: src/srcSet/avifSrcSet/width/height (16:9), crop, og, schemaImages, and alt.
export const MEDIA = ${JSON.stringify(media, null, 2)};

/** Self-hosted versions of an original image URL, or undefined. */
export function mediaFor(url) {
  return MEDIA[url];
}
`;
}

/* ========================================================= title cards */

const CARD_PREFIX = 'card:';
const CARD_FOOTER = 'Bridgeland Builders · Winnipeg';
const TITLE_LINES = 4;
const TITLE_LEADING = 1.12; // line height, in em
const TITLE_TRACKING = -0.02; // letter spacing, in em (the site's headings are set tight)
const MEASURE_SIZE = 100;

/**
 * The canvases. Titles keep a wide side margin on the 16:9 card because the
 * featured /blog card shows it with object-fit: cover in a box that can be
 * taller than 16:9, which trims the sides. The article layouts (ARTICLE_SIZES,
 * BlogPosting.image) set the title larger as the canvas grows taller, still on
 * at most four lines, so it stays legible as a small square thumbnail.
 */
const CARD_LAYOUTS = {
  hero: {
    width: 1320,
    height: Math.round((1320 * 9) / 16), // 743, the 16:9 cut variantSet makes
    padX: 120,
    padTop: 84,
    padBottom: 60,
    strip: 12,
    bar: { width: 112, height: 10, gap: 36 },
    footerSize: 30,
    footerGap: 48,
    sizes: [84, 78, 72, 66, 60, 56, 52, 48],
  },
  og: {
    width: OG.width,
    height: OG.height,
    padX: 96,
    padTop: 72,
    padBottom: 50,
    strip: 10,
    bar: { width: 96, height: 8, gap: 30 },
    footerSize: 28,
    footerGap: 40,
    sizes: [80, 74, 68, 62, 56, 52, 48, 44],
  },
  article16x9: {
    width: 1200,
    height: 675,
    padX: 96,
    padTop: 76,
    padBottom: 52,
    strip: 10,
    bar: { width: 96, height: 8, gap: 32 },
    footerSize: 28,
    footerGap: 42,
    sizes: [80, 74, 68, 62, 56, 52, 48, 44],
  },
  article4x3: {
    width: 1200,
    height: 900,
    padX: 96,
    padTop: 96,
    padBottom: 64,
    strip: 12,
    bar: { width: 104, height: 9, gap: 36 },
    footerSize: 30,
    footerGap: 48,
    sizes: [96, 90, 84, 78, 72, 66, 60, 56],
  },
  article1x1: {
    width: 1200,
    height: 1200,
    padX: 96,
    padTop: 120,
    padBottom: 80,
    strip: 14,
    bar: { width: 112, height: 10, gap: 40 },
    footerSize: 32,
    footerGap: 56,
    sizes: [112, 104, 96, 90, 84, 78, 72, 64],
  },
};

/** Published posts (blog-raw/posts/*.json; a missing status means published). */
function publishedPosts() {
  if (!existsSync(POSTS_DIR)) return [];
  return readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(readFileSync(join(POSTS_DIR, file), 'utf8')))
    .filter((post) => (post.status || 'published') === 'published' && post.slug);
}

/** Published posts without a hero image, by slug. */
function postsWithoutHero() {
  return publishedPosts()
    .filter((post) => !post.hero && String(post.title || '').trim())
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

async function buildTitleCards(media) {
  const posts = postsWithoutHero();
  if (!posts.length) return 0;
  const fonts = await dmSansFonts();
  for (const post of posts) {
    const title = post.title.trim().replace(/\s+/g, ' ');
    const folder = folderFor(post.slug);
    const dir = join(BLOG_OUT, folder);
    const urlDir = `/images/blog/${folder}`;
    mkdirSync(dir, { recursive: true });
    const alt = `Title card: ${title}`;
    const base = slugify(alt, `${post.slug}-card`);

    const card = await titleCard(title, CARD_LAYOUTS.hero, fonts);
    const label = `${post.slug} (title card)`;
    const { set, mainKb } = await variantSet(card, { dir, urlDir, base, ratio: 9 / 16, originalWidth: CARD_LAYOUTS.hero.width, label });
    if (mainKb.avifKb > LCP_BUDGET_KB) warnings.push(`${label} ${MAIN_WIDTH}w AVIF is ${mainKb.avifKb} KB (> ${LCP_BUDGET_KB} KB LCP budget)`);

    const og = await sharp(await titleCard(title, CARD_LAYOUTS.og, fonts))
      .jpeg({ quality: 86, mozjpeg: true, progressive: true })
      .toBuffer();
    if (kb(og) > BUDGET_KB) warnings.push(`${label} OG image is ${kb(og)} KB (> ${BUDGET_KB} KB)`);

    const schemaImages = [];
    for (const { width: w, height: h, layout } of ARTICLE_SIZES) {
      const jpg = await articleJpeg(sharp(await titleCard(title, CARD_LAYOUTS[layout], fonts)), `${label} ${w}x${h} article image`, 86);
      schemaImages.push(`${urlDir}/${writeOnce(dir, `${base}-${w}x${h}`, 'jpg', jpg)}`);
    }

    media[`${CARD_PREFIX}${post.slug}`] = {
      ...set,
      crop: '16:9',
      og: `${urlDir}/${writeOnce(dir, `${base}-${OG.width}x${OG.height}`, 'jpg', og)}`,
      schemaImages,
      alt,
    };
    process.stdout.write('.');
  }
  process.stdout.write('\n');
  return posts.length;
}

/** One title card as a PNG: SVG background and bars, DM Sans text on top. */
async function titleCard(title, layout, fonts) {
  const { width: W, height: H, padX, padTop, padBottom, strip, bar, footerSize, footerGap, sizes } = layout;
  const footer = await textImage(CARD_FOOTER, { size: footerSize, weight: 'regular', color: BRAND.muted, fonts });
  const footerTop = H - strip - padBottom - footer.info.height;
  const areaBottom = footerTop - footerGap;
  const text = await titleText(title, {
    fonts,
    sizes,
    maxWidth: W - padX * 2,
    maxHeight: areaBottom - padTop - bar.height - bar.gap,
    canvas: `${W}x${H}`,
  });
  // The accent bar and the title are centred together above the footer.
  const groupHeight = bar.height + bar.gap + text.info.height;
  const top = padTop + Math.max(0, Math.round((areaBottom - padTop - groupHeight) / 2));
  const background = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
      `<rect width="${W}" height="${H}" fill="${BRAND.dark}"/>` +
      `<rect x="0" y="${H - strip}" width="${W}" height="${strip}" fill="${BRAND.red}"/>` +
      `<rect x="${padX}" y="${top}" width="${bar.width}" height="${bar.height}" rx="${bar.height / 2}" fill="${BRAND.red}"/>` +
      `</svg>`
  );
  return sharp(background)
    .composite([
      { input: text.data, left: padX, top: top + bar.height + bar.gap },
      { input: footer.data, left: padX, top: footerTop },
    ])
    .flatten({ background: BRAND.dark })
    .png()
    .toBuffer();
}

const escapeMarkup = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** White DM Sans Bold title text ("\n" between lines), trimmed to its ink. */
function titleImage(text, size, fonts) {
  const tracking = Math.round(TITLE_TRACKING * size * 1024);
  // An absolute Pango line height, in 1024ths of a point (dpi 72: a pixel).
  const leading = Math.round(TITLE_LEADING * size * 1024);
  return sharp({
    text: {
      text: `<span foreground="#FFFFFF" letter_spacing="${tracking}" line_height="${leading}">${escapeMarkup(text)}</span>`,
      ...fontOptions(fonts, 'bold', size),
      rgba: true,
      dpi: 72,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
}

/** Line breaks [start, end) filling each line before the next. */
function greedyLines(widths, space, max) {
  const lines = [];
  let start = 0;
  let width = 0;
  widths.forEach((w, i) => {
    if (i > start && width + space + w > max) {
      lines.push([start, i]);
      start = i;
      width = w;
    } else {
      width = i === start ? w : width + space + w;
    }
  });
  lines.push([start, widths.length]);
  return lines;
}

/**
 * Exactly `count` lines of as even a width as possible (least sum of squared
 * widths), none wider than `max`; null when that cannot be done.
 */
function balancedLines(widths, space, count, max) {
  const n = widths.length;
  const span = (a, b) => widths.slice(a, b).reduce((sum, w) => sum + w, 0) + (b - a - 1) * space;
  const cost = Array.from({ length: count + 1 }, () => new Array(n + 1).fill(Infinity));
  const from = Array.from({ length: count + 1 }, () => new Array(n + 1).fill(0));
  cost[0][0] = 0;
  for (let line = 1; line <= count; line += 1) {
    for (let end = 1; end <= n; end += 1) {
      for (let start = line - 1; start < end; start += 1) {
        const width = span(start, end);
        if (width > max || cost[line - 1][start] === Infinity) continue;
        const value = cost[line - 1][start] + width * width;
        if (value < cost[line][end]) {
          cost[line][end] = value;
          from[line][end] = start;
        }
      }
    }
  }
  if (cost[count][n] === Infinity) return null;
  const lines = [];
  for (let line = count, end = n; line > 0; line -= 1) {
    const start = from[line][end];
    lines.unshift([start, end]);
    end = start;
  }
  return lines;
}

/**
 * The title at the largest size that fits `maxWidth` x `maxHeight` on at most
 * four balanced lines. Word widths are measured once and scaled; the final
 * render is checked against the box. A title too long for four lines at the
 * smallest size is cut at a word and ends with "…" (and a warning).
 */
async function titleText(title, { fonts, sizes, maxWidth, maxHeight, canvas }) {
  const words = title.split(' ');
  const measure = async (text) => (await titleImage(text, MEASURE_SIZE, fonts)).info.width;
  const wordWidths = [];
  for (const word of words) wordWidths.push(await measure(word));
  const spaceWidth = (await measure('a a')) - (await measure('aa'));
  const limit = maxWidth * 0.97; // headroom for side bearings between words
  const lineText = (lines) => lines.map(([a, b]) => words.slice(a, b).join(' ')).join('\n');

  for (const size of sizes) {
    const scale = size / MEASURE_SIZE;
    const widths = wordWidths.map((w) => w * scale);
    const greedy = greedyLines(widths, spaceWidth * scale, limit);
    if (greedy.length > TITLE_LINES) continue;
    const lines = balancedLines(widths, spaceWidth * scale, greedy.length, limit) || greedy;
    const image = await titleImage(lineText(lines), size, fonts);
    if (image.info.width <= maxWidth && image.info.height <= maxHeight) return image;
  }

  const size = sizes[sizes.length - 1];
  const scale = size / MEASURE_SIZE;
  const greedy = greedyLines(wordWidths.map((w) => w * scale), spaceWidth * scale, limit);
  if (greedy.length <= TITLE_LINES) {
    warnings.push(`${canvas} title card for "${title}" does not fit its text box at ${size}px`);
    return titleImage(lineText(greedy), size, fonts);
  }
  const kept = greedy.slice(0, TITLE_LINES);
  const lastStart = kept[kept.length - 1][0];
  let lastEnd = kept[kept.length - 1][1];
  let image;
  do {
    image = await titleImage(`${lineText(kept.slice(0, -1))}\n${words.slice(lastStart, lastEnd).join(' ')}…`, size, fonts);
    lastEnd -= 1;
  } while (image.info.width > maxWidth && lastEnd > lastStart);
  warnings.push(`${canvas} title card for "${title}" was shortened to ${TITLE_LINES} lines`);
  return image;
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

/** sharp text-input font options: DM Sans from its TTF when available, else Arial. */
function fontOptions(fonts, weight, size) {
  const fontfile = fonts && (weight === 'bold' ? fonts.bold : fonts.regular);
  const font = fonts ? `DM Sans ${weight === 'bold' ? 'Bold' : 'Regular'} ${size}` : `Arial ${weight === 'bold' ? 'Bold' : ''} ${size}`;
  return { font, ...(fontfile ? { fontfile } : {}) };
}

/** A line of text as a transparent PNG (Pango, DM Sans when available). */
async function textImage(text, { size, weight, color, fonts, maxWidth }) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return sharp({
    text: {
      text: `<span foreground="${color}">${escaped}</span>`,
      ...fontOptions(fonts, weight, size),
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

/**
 * The header and footer logos as WebP at their display sizes (1x and 2x),
 * from the PNGs in public/: the navbar mark shows at 30–38px, the footer logo
 * at up to 220px. Never enlarged past the PNG.
 */
const LOGOS = [
  { file: 'logo-mark.png', widths: [48, 96] },
  { file: 'logo-on-dark.png', widths: [220, 440] },
];

async function buildLogos() {
  const sizes = [];
  for (const { file, widths } of LOGOS) {
    const input = readFileSync(join(PUBLIC, file));
    for (const width of widths) {
      const webp = await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 90, alphaQuality: 100, effort: 6 })
        .toBuffer();
      const name = `${file.replace(/\.png$/, '')}-${width}.webp`;
      writeFileSync(join(PUBLIC, name), webp);
      sizes.push(`${name} ${kb(webp)} KB`);
    }
  }
  console.log(`[images] logos (public/): ${sizes.join(', ')}`);
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

/* ================================================================ stock */

// Stock (Unsplash) photos served from this site instead of images.unsplash.com,
// where a page's LCP depends on them: the same origin needs no extra
// connection, and the files get hashed names and a year-long cache. The
// originals are fetched once into media-src/stock/ (git-ignored). They are
// inspiration photos, never shown as Bridgeland's work (plan §11.2).
const STOCK = [
  {
    key: 'home-hero',
    // The home page hero (LCP). Width 2000 is plenty for the 1320w variant.
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85&fm=jpg',
    base: 'bright-living-room',
  },
];
const STOCK_OUT = join(PUBLIC, 'images', 'stock');
const STOCK_GENERATED = join(ROOT, 'src', 'data', 'stockImages.generated.js');

async function stockOriginal({ key, url }) {
  const dir = join(MEDIA_SRC, 'stock');
  const file = join(dir, `${key}.jpg`);
  if (!existsSync(file)) {
    mkdirSync(dir, { recursive: true });
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${key}: ${url} answered ${response.status}`);
    writeFileSync(file, Buffer.from(await response.arrayBuffer()));
  }
  return readFileSync(file);
}

async function buildStock() {
  rmSync(STOCK_OUT, { recursive: true, force: true });
  mkdirSync(STOCK_OUT, { recursive: true });
  const images = {};
  for (const photo of STOCK) {
    const input = await stockOriginal(photo);
    const meta = await sharp(input).metadata();
    const { set, mainKb } = await variantSet(input, {
      dir: STOCK_OUT,
      urlDir: '/images/stock',
      base: photo.base,
      ratio: meta.height / meta.width,
      originalWidth: meta.width,
      label: `stock ${photo.key}`,
    });
    if (mainKb.avifKb > LCP_BUDGET_KB) warnings.push(`stock ${photo.key} ${MAIN_WIDTH}w AVIF is ${mainKb.avifKb} KB (> ${LCP_BUDGET_KB} KB LCP budget)`);
    images[photo.key] = set;
  }
  writeFileSync(
    STOCK_GENERATED,
    `// Generated by scripts/build-images.mjs (--only=stock) — do not edit by hand.\n` +
      `// Self-hosted copies of the stock photos listed in STOCK there.\n` +
      `export const STOCK_IMAGES = ${JSON.stringify(images, null, 2)};\n`
  );
  console.log(`[images] stock: ${Object.keys(images).length} photo(s) in public/images/stock/; src/data/stockImages.generated.js written`);
}

/* ================================================================= run */

if (!only || only === 'blog') await buildBlog();
if (!only || only === 'stock') await buildStock();
if (only === 'cards') await buildBlog({ cardsOnly: true });
if (!only || only === 'brand') {
  await buildDefaultOg();
  await buildIcons();
}
if (!only || only === 'brand' || only === 'logos') await buildLogos();
for (const warning of new Set(warnings)) console.warn(`[images] warning: ${warning}`);
