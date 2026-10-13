/**
 * Downloads the original Wix images used by published blog posts (hero and
 * body images) into media-src/ (git-ignored), for scripts/build-images.mjs to
 * turn into self-hosted AVIF/WebP variants (SEO plan §4, §13).
 *
 *   node scripts/fetch-legacy-images.mjs            download what's missing
 *   node scripts/fetch-legacy-images.mjs --force    download everything again
 *
 * Reads blog-raw/posts/*.json (one post per file) when that folder exists,
 * otherwise the older blog-raw/*.json arrays. Only posts whose status is
 * "published" (or unset) count. Writes media-src/manifest.json:
 *   [{ url, file, bytes, uses: [{ slug, role: 'hero'|'body', alt, w?, h? }] }]
 * Keep the Wix site alive until every image is self-hosted (plan O-10).
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const RAW_DIR = join(ROOT, 'blog-raw');
const POSTS_DIR = join(RAW_DIR, 'posts');
const OUT_DIR = join(ROOT, 'media-src');
const FILES_DIR = join(OUT_DIR, 'wix');
const MANIFEST = join(OUT_DIR, 'manifest.json');
const FORCE = process.argv.includes('--force');
const CONCURRENCY = 4;
const TIMEOUT_MS = 90000;
const WIX_MEDIA = /^https:\/\/static\.wixstatic\.com\/media\/([^/?#]+)$/;

const published = (post) => (post.status || 'published') === 'published';

function readPosts() {
  if (existsSync(POSTS_DIR) && readdirSync(POSTS_DIR).some((f) => f.endsWith('.json'))) {
    const posts = readdirSync(POSTS_DIR)
      .filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(readFileSync(join(POSTS_DIR, f), 'utf8')));
    return { source: 'blog-raw/posts/*.json', posts, leadingImageIsHero: false };
  }
  const posts = readdirSync(RAW_DIR)
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => JSON.parse(readFileSync(join(RAW_DIR, f), 'utf8')));
  // In the old Wix export the first body block repeats the hero image (the
  // blog build drops it and uses its alt as the hero's alt).
  return { source: 'blog-raw/*.json', posts, leadingImageIsHero: true };
}

function collect() {
  const { source, posts, leadingImageIsHero } = readPosts();
  const images = new Map(); // url -> { url, uses: [] }
  const use = (url, entry) => {
    if (!WIX_MEDIA.test(url || '')) return;
    if (!images.has(url)) images.set(url, { url, uses: [] });
    images.get(url).uses.push(entry);
  };
  let count = 0;
  for (const post of posts.filter(published)) {
    count += 1;
    let blocks = Array.isArray(post.blocks) ? post.blocks : [];
    let heroAlt = post.heroAlt;
    if (leadingImageIsHero && blocks[0] && blocks[0].t === 'img') {
      heroAlt = heroAlt || blocks[0].alt;
      blocks = blocks.slice(1);
    }
    use(post.hero, { slug: post.slug, role: 'hero', alt: heroAlt || post.title });
    for (const block of blocks) {
      if (block && block.t === 'img') use(block.src, { slug: post.slug, role: 'body', alt: block.alt, w: block.w, h: block.h });
    }
  }
  return { source, count, images: [...images.values()] };
}

async function download(url, file) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { 'User-Agent': 'bridgeland-image-migration/1.0' } });
      const type = response.headers.get('content-type') || '';
      if (!response.ok || !type.startsWith('image/')) throw new Error(`${response.status} ${type}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      if (!buffer.length) throw new Error('empty body');
      writeFileSync(file, buffer);
      return buffer.length;
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  return 0;
}

const { source, count, images } = collect();
mkdirSync(FILES_DIR, { recursive: true });
console.log(`[images] ${images.length} Wix images in ${count} published posts (${source})`);

let fetched = 0;
let kept = 0;
const failures = [];
let next = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < images.length) {
      const image = images[next++];
      const name = WIX_MEDIA.exec(image.url)[1].replace(/[^A-Za-z0-9._~-]/g, '_');
      image.file = `wix/${name}`;
      const path = join(OUT_DIR, image.file);
      if (!FORCE && existsSync(path) && statSync(path).size > 0) {
        image.bytes = statSync(path).size;
        kept += 1;
        continue;
      }
      try {
        image.bytes = await download(image.url, path);
        fetched += 1;
        process.stdout.write('.');
      } catch (error) {
        failures.push(`${image.url}: ${error.message}`);
      }
    }
  })
);
if (fetched) process.stdout.write('\n');

const ok = images.filter((image) => image.bytes);
writeFileSync(MANIFEST, `${JSON.stringify(ok, null, 2)}\n`);
const mb = (ok.reduce((sum, image) => sum + image.bytes, 0) / 1048576).toFixed(1);
console.log(`[images] downloaded ${fetched}, already had ${kept}, ${mb} MB of originals in media-src/; manifest: media-src/manifest.json`);
if (failures.length) {
  console.error(`[images] ${failures.length} failed:\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
