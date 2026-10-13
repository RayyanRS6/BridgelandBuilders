/**
 * Builds src/data/blogPosts.js from blog-raw/*.json.
 *
 *   node scripts/build-blog-data.mjs            (runs offline, as part of `npm run build`)
 *   node scripts/build-blog-data.mjs --verify   (also HEAD-checks every Wix image variant)
 *
 * Post `status` (plan §9): only 'published' posts (or posts with no status) are
 * exported in BLOG_POSTS and get a page. 'draft', 'noindex' and 'redirect'
 * posts stay in blog-raw so their text can be carried into the rewrites;
 * `redirectTo` on a retired post is exported in BLOG_REDIRECTS for the SEO
 * audit (the redirects themselves live in src/data/redirects.js).
 *
 * Images: the Wix originals are 1–5 MB PNGs, so every hero and body image is
 * served through Wix's image transform (resized, centre-cropped, AVIF/WebP by
 * Accept header). `post.hero` and blog-raw keep the original URL; a block
 * marked `"variant": false` (or a post marked `"heroVariant": false`) falls
 * back to the original if a transform ever stops working.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const VERIFY = process.argv.includes('--verify');
const RAW_DIR = fileURLToPath(new URL('../blog-raw/', import.meta.url));
const files = readdirSync(RAW_DIR).filter((f) => f.endsWith('.json'))
  .sort((a, b) => Number(a.replace(/\D/g, '')) - Number(b.replace(/\D/g, '')));

const STATUSES = ['published', 'noindex', 'draft', 'redirect'];
const statusOf = (p) => p.status || 'published';

let raw = [];
for (const f of files) raw.push(...JSON.parse(readFileSync(join(RAW_DIR, f), 'utf8')));

for (const p of raw) {
  if (!STATUSES.includes(statusOf(p))) throw new Error(`${p.slug}: unknown status "${p.status}"`);
  if (statusOf(p) === 'redirect' && !p.redirectTo) throw new Error(`${p.slug}: status "redirect" needs redirectTo`);
}

/* ------------------------------------------------------------ images */
const WIX_MEDIA = /^https:\/\/static\.wixstatic\.com\/media\/[^/?#]+$/;
const WIDTHS = [480, 880, 1320];
const MAIN_WIDTH = 880;

/**
 * Wix image-transform URL: `fill` resizes and centre-crops to exactly w×h;
 * `enc_auto` returns AVIF or WebP to browsers that accept them (verified
 * 2026-10-13: an 880×495 hero is ~16 KB AVIF vs a 334 KB PNG original).
 */
function wixVariant(src, w, h, name) {
  return `${src}/v1/fill/w_${w},h_${h},al_c,q_80,enc_auto/${name}.webp`;
}

/**
 * Open Graph image: a fixed JPEG (no enc_auto), because link-preview crawlers
 * that advertise AVIF support cannot all render it.
 */
function wixJpeg(src, w, h, name) {
  return `${src}/v1/fill/w_${w},h_${h},al_c,q_80/${name}.jpg`;
}

/** A short, readable file name for a transform URL. */
function fileName(text, fallback) {
  const slug = (text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const cut = slug.length > 60 ? slug.slice(0, 60).replace(/-[^-]*$/, '') : slug;
  return cut || fallback;
}

const canTransform = (src) => WIX_MEDIA.test(src || '');

/** Hero fields. The layout always shows the hero at 16:9 (object-fit: cover). */
function heroImages(p) {
  if (!canTransform(p.hero) || p.heroVariant === false) {
    return { heroSrc: p.hero, ogImage: p.hero };
  }
  const name = fileName(p.slug, 'blog-hero');
  const at = (w) => wixVariant(p.hero, w, Math.round((w * 9) / 16), name);
  return {
    heroSrc: at(MAIN_WIDTH),
    heroSrcSet: WIDTHS.map((w) => `${at(w)} ${w}w`).join(', '),
    ogImage: wixJpeg(p.hero, 1200, 630, `${name}-og`),
  };
}

/**
 * Body images keep their own aspect ratio (blog-raw records the original
 * w/h), so nothing is cropped compared with the original.
 */
function bodyImage(block, fallbackName) {
  if (!canTransform(block.src) || block.variant === false || !block.w || !block.h) {
    return { t: 'img', src: block.src, alt: block.alt };
  }
  const ratio = block.h / block.w;
  const widths = WIDTHS.filter((w) => w <= block.w);
  if (!widths.length) return { t: 'img', src: block.src, alt: block.alt };
  const main = widths.includes(MAIN_WIDTH) ? MAIN_WIDTH : widths[widths.length - 1];
  const name = fileName(block.alt, fallbackName);
  const at = (w) => wixVariant(block.src, w, Math.round(w * ratio), name);
  return {
    t: 'img',
    src: at(main),
    srcSet: widths.map((w) => `${at(w)} ${w}w`).join(', '),
    alt: block.alt,
    width: main,
    height: Math.round(main * ratio),
  };
}

/* ------------------------------------------------------------- posts */
const words = (blocks) => blocks.reduce((n, b) => n + (b.x ? b.x.split(/\s+/).length : 0), 0);
const headingKey = (text) => (text || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

let posts = raw.filter((p) => statusOf(p) === 'published').map((p) => {
  let blocks = [...p.blocks];
  let excerpt = p.excerpt;
  // The first paragraph on a Wix post is the meta description / lead.
  if (!excerpt && blocks[0] && blocks[0].t === 'p') excerpt = blocks.shift().x;
  else if (excerpt && blocks[0] && blocks[0].t === 'p' && blocks[0].x === excerpt) blocks.shift();

  // Hero image is shown by the layout, so drop a leading duplicate of it from the body.
  let heroAlt;
  if (blocks[0] && blocks[0].t === 'img') {
    heroAlt = blocks[0].alt;
    blocks.shift();
  }

  // The Wix import repeats the title as an H2 (and again as an H3 further
  // down); the page already has it as the H1.
  const titleKey = headingKey(p.title);
  blocks = blocks.filter((b) => !((b.t === 'h2' || b.t === 'h3') && headingKey(b.x) === titleKey));

  let imageIndex = 0;
  blocks = blocks.map((b) => (b.t === 'img' ? bodyImage(b, `${fileName(p.slug, 'blog')}-${++imageIndex}`) : b));

  const cleanExcerpt = (excerpt || '').trim();

  // The page still shows the full excerpt; these two are only for <title> and
  // <meta name="description">, where length controls how results are rendered.
  const brandedTitle = `${p.title} | Bridgeland Builders`;
  const metaTitle = brandedTitle.length <= 60 ? brandedTitle : p.title;

  let metaDescription = cleanExcerpt;
  if (metaDescription.length > 158) {
    const cut = metaDescription.slice(0, 158);
    metaDescription = `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`;
  }
  if (metaDescription.length < 70) {
    metaDescription = `${metaDescription} Renovation advice from Bridgeland Builders, Winnipeg.`.slice(0, 158);
  }

  return {
    slug: p.slug,
    status: 'published',
    title: p.title,
    metaTitle,
    metaDescription,
    excerpt: cleanExcerpt,
    category: (p.cats && p.cats[0]) || 'Renovation Advice',
    categories: p.cats || [],
    date: p.date,
    updated: p.updated || p.date,
    readMinutes: Math.max(3, Math.round(words(p.blocks) / 200)),
    hero: p.hero,
    ...heroImages(p),
    heroAlt: heroAlt || p.title,
    memberOnly: !!p.memberOnly,
    blocks,
  };
});

posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

const categories = [...new Set(posts.map((p) => p.category))];
const publishedPaths = new Set(posts.map((p) => `/blog/${p.slug}`));

// Retired posts and where they point. A draft that redirects is interim (307).
const redirects = raw
  .filter((p) => statusOf(p) !== 'published' && p.redirectTo)
  .map((p) => ({
    from: `/blog/${p.slug}`,
    to: p.redirectTo,
    status: statusOf(p),
    ...(statusOf(p) === 'redirect' ? {} : { temporary: true }),
  }));

for (const r of redirects) {
  if (r.to.startsWith('/blog/') && !publishedPaths.has(r.to)) {
    throw new Error(`${r.from} redirects to ${r.to}, which is not a published post`);
  }
}

const out = `// Generated from the Bridgeland Builders blog content. Do not edit by hand —
// edit blog-raw/*.json and re-run: node scripts/build-blog-data.mjs
export const BLOG_CATEGORIES = ${JSON.stringify(categories, null, 2)};

/** Published posts only (blog-raw status "published"), newest first. */
export const BLOG_POSTS = ${JSON.stringify(posts, null, 2)};

/** Retired post URLs and their targets (for the SEO audit; served by src/data/redirects.js). */
export const BLOG_REDIRECTS = ${JSON.stringify(redirects, null, 2)};

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRelatedPosts(post, limit = 3) {
  if (!post) return [];
  const sameCategory = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category);
  const rest = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
`;

writeFileSync(new URL('../src/data/blogPosts.js', import.meta.url), out);

const bodyImages = posts.flatMap((p) => p.blocks.filter((b) => b.t === 'img'));
const byStatus = raw.reduce((acc, p) => ({ ...acc, [statusOf(p)]: (acc[statusOf(p)] || 0) + 1 }), {});
console.log('blog-raw:', raw.length, JSON.stringify(byStatus));
console.log('published posts:', posts.length, '| redirects:', redirects.length);
console.log('categories:', categories.join(' | '));
console.log('member-only:', posts.filter((p) => p.memberOnly).map((p) => p.slug).join(', ') || 'none');
console.log(
  'images:',
  `${posts.filter((p) => p.heroSrcSet).length}/${posts.length} heroes and`,
  `${bodyImages.filter((b) => b.srcSet).length}/${bodyImages.length} body images use Wix variants`
);

/* ----------------------------------------------------------- verify */
if (VERIFY) {
  const urls = new Set();
  for (const p of posts) {
    if (p.heroSrcSet) p.heroSrcSet.split(', ').forEach((entry) => urls.add(entry.split(' ')[0]));
    if (p.ogImage !== p.hero) urls.add(p.ogImage);
    for (const b of p.blocks) {
      if (b.t === 'img' && b.srcSet) b.srcSet.split(', ').forEach((entry) => urls.add(entry.split(' ')[0]));
    }
  }
  const failures = [];
  const list = [...urls];
  let next = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (next < list.length) {
      const url = list[next++];
      try {
        const res = await fetch(url, { method: 'HEAD', headers: { Accept: 'image/avif,image/webp,image/*,*/*;q=0.8' } });
        const type = res.headers.get('content-type') || '';
        if (!res.ok || !type.startsWith('image/')) failures.push(`${res.status} ${type} ${url}`);
      } catch (error) {
        failures.push(`${error.message} ${url}`);
      }
    }
  }));
  console.log(`verify: ${list.length - failures.length}/${list.length} image variants OK`);
  if (failures.length) {
    console.error(failures.join('\n'));
    console.error('Mark the image "variant": false (or the post "heroVariant": false) in blog-raw to serve the original.');
    process.exit(1);
  }
}
