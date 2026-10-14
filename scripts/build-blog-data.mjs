/**
 * Builds the blog data modules from blog-raw/posts/<slug>.json (one post per
 * file).
 *
 *   node scripts/build-blog-data.mjs            (offline, first step of `npm run build`)
 *   node scripts/build-blog-data.mjs --verify   (also HEAD-checks every remote image URL)
 *
 * Generated files (edit blog-raw/posts/*.json, never these). Each page loads
 * only the blog data it shows:
 *   src/data/posts/<slug>.js  CLIENT. Everything /blog/<slug> shows, loaded
 *                             lazily by the post page: the full post (as in
 *                             blogPosts.js, without `status`), its body
 *                             { blocks, faqsTitle, faqs, answer, sources,
 *                             reviewedBy } and `related` (three ranked cards).
 *   src/data/postCards/<slug>.js  CLIENT. One post's card, for the guides on
 *                             service pages (content.guides).
 *   src/data/blogList.js      CLIENT. Everything /blog needs in one module:
 *                             BLOG_CATEGORIES and BLOG_LIST (cards plus
 *                             categories, metaDescription and ogImage).
 *   src/data/homeGuides.js    CLIENT. The three guide cards on the home page
 *                             (GUIDE_SLUGS below).
 *   src/data/blogIndex.js     CLIENT. BLOG_CARDS: every published post's card
 *                             and ranking fields, plus helpers (getPostBySlug,
 *                             getRelatedPosts, getPostsForService), for a page
 *                             that needs to list or rank posts.
 *                             (BLOG_REDIRECTS is build-only: blogPosts.js.)
 *   src/data/blogPosts.js     BUILD ONLY (head.js, build-seo-files,
 *                             sync-redirects, audit). Full posts including
 *                             bodies, same helpers. Client code must never
 *                             import it — this script fails if any does.
 *
 * Post file fields (plan §9):
 *   slug            must match the file name
 *   status          'published' | 'noindex' | 'draft' | 'redirect' — only
 *                   'published' gets a page; the others stay here so their
 *                   text can be carried into rewrites
 *   redirectTo      where a retired post points (exported in BLOG_REDIRECTS for
 *                   the SEO audit; the rules live in src/data/redirects.js)
 *   title, excerpt  H1 and the lead under it (also the card text)
 *   metaTitle?, metaDescription?  hand-written <title>/description; generated
 *                   from title/excerpt when absent
 *   date, updated?  YYYY-MM-DD (updated may carry a time and offset). Change
 *                   `updated` only with a real content change.
 *   cats[]          categories; the first is the card/section tag
 *   services[]      service paths the post supports (used by related posts;
 *                   the first is the post's service CTA unless the post is
 *                   general: 4+ services, or 2+ in a general cluster, see
 *                   BlogPostPage.jsx serviceCta)
 *   cluster         topic id shared by posts on one subject ('' = none)
 *   author?, reviewedBy?  ids in src/data/people.js ('' = the business)
 *   answer?         40–60 word quick answer shown above the body
 *   sources[]       { label, url, accessed: 'YYYY-MM-DD' } official sources
 *   hero, heroAlt   original hero image URL and its alt text
 *   heroVariant?    false = serve the original hero (no Wix transform)
 *   memberOnly?     true = show the "full version on our original blog" note
 *   faqsTitle?, faqs[]  explicit { q, a } — the ONLY source of FAQPage schema
 *   blocks[]        body, rendered by src/components/RichBody.jsx:
 *                   p, h2, h3, h4, li, oli, quote, img { src, alt, w, h,
 *                   variant? }, table { caption, head, rows, note }, callout
 *                   { title, x }, takeaways { title, items }. A block with
 *                   "hidden": true stays in the file but is not rendered.
 *   legacyBlocks    raw Wix import (lead paragraph and hero duplicate still in
 *                   blocks, FAQ as plain paragraphs) — normalise to the fields
 *                   above before publishing; publishing it is an error.
 * Inline text (p/li/quote/answer/faqs/table cells): [label](/path),
 * [label](https://…) and **bold**. Internal links must point at a live,
 * indexable page: links to redirect sources, noindex routes, unpublished
 * posts, draft service pages, ?query URLs or paths that are not a page on the
 * site fail the build.
 *
 * Images: when src/data/media.generated.js exists (original URL →
 * { src, srcSet, avifSrcSet, width, height, hero?, og?, schemaImages? }) the
 * self-hosted files are used (WebP <img> plus an AVIF <source>,
 * src/components/Picture.jsx); otherwise Wix's image transform serves resized
 * AVIF/WebP variants of the 1–5 MB originals. `"variant": false` on a block
 * falls back to the original. A post's `schemaImages` (16:9, 4:3 and 1:1
 * JPEGs, BlogPosting.image) go only into blogPosts.js and the post's own
 * module, never into the card modules.
 */
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const VERIFY = process.argv.includes('--verify');
const ROOT = fileURLToPath(new URL('../', import.meta.url));
const POSTS_DIR = join(ROOT, 'blog-raw', 'posts');
const OUT_INDEX = join(ROOT, 'src', 'data', 'blogIndex.js');
const OUT_LIST = join(ROOT, 'src', 'data', 'blogList.js');
const OUT_HOME = join(ROOT, 'src', 'data', 'homeGuides.js');
const OUT_FULL = join(ROOT, 'src', 'data', 'blogPosts.js');
const OUT_BODIES = join(ROOT, 'src', 'data', 'posts');
const OUT_CARDS = join(ROOT, 'src', 'data', 'postCards');

// The home page guides strip: these posts first, in this order; if one is not
// published, the newest other posts fill the strip so it always shows three cards.
const GUIDE_SLUGS = [
  'winnipeg-renovation-permits',
  'how-to-choose-the-right-contractor-for-your-renovation-project',
  'basement-development-permits-winnipeg',
];
const GUIDE_COUNT = 3;

const errors = [];
const warnings = [];
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

/* ------------------------------------------------------------- input */
const STATUSES = ['published', 'noindex', 'draft', 'redirect'];
const statusOf = (p) => p.status || 'published';

// Newest first (then by slug), so every generated list has a stable order.
const raw = readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((file) => {
    const post = JSON.parse(readFileSync(join(POSTS_DIR, file), 'utf8'));
    if (post.slug !== file.replace(/\.json$/, '')) fail(`blog-raw/posts/${file}: slug "${post.slug}" does not match the file name`);
    return post;
  })
  .sort((a, b) => String(b.date).localeCompare(String(a.date)) || a.slug.localeCompare(b.slug));

for (const p of raw) {
  const status = statusOf(p);
  if (!STATUSES.includes(status)) fail(`${p.slug}: unknown status "${p.status}"`);
  if (status === 'redirect' && !p.redirectTo) fail(`${p.slug}: status "redirect" needs redirectTo`);
  if (status === 'published' && p.legacyBlocks) fail(`${p.slug}: raw Wix blocks (legacyBlocks) — normalise the post before publishing it`);
  if (status === 'published' && !/^\d{4}-\d{2}-\d{2}$/.test(p.date || '')) fail(`${p.slug}: date must be YYYY-MM-DD`);
}

/** Optional project modules: a missing or broken one degrades to null with a warning. */
async function optionalModule(rel) {
  const file = join(ROOT, rel);
  if (!existsSync(file)) return null;
  try {
    return await import(pathToFileURL(file).href);
  } catch (error) {
    warn(`${rel} could not be loaded (${error.message.split('\n')[0]}) — its checks were skipped`);
    return null;
  }
}

const mediaModule = await optionalModule('src/data/media.generated.js');
const MEDIA = mediaModule ? mediaModule.MEDIA || mediaModule.media || mediaModule.default || null : null;
const peopleModule = await optionalModule('src/data/people.js');
const PEOPLE = (peopleModule && peopleModule.PEOPLE) || {};
const servicesModule = await optionalModule('src/data/services.js');
const SERVICES = servicesModule && Array.isArray(servicesModule.SERVICES) ? servicesModule.SERVICES : null;
const seoModule = await optionalModule('src/data/seo.js');
const redirectsModule = await optionalModule('src/data/redirects.js');
const costGuidesModule = await optionalModule('src/data/costGuides/index.js');
// Live cost guides are pages too (hub + /services/<slug>/cost spokes); drafts are not linked.
const COST_GUIDES = costGuidesModule && Array.isArray(costGuidesModule.COST_GUIDES) ? costGuidesModule.COST_GUIDES : [];
// Published community pages, case studies and videos (same helpers head.js uses).
const areasModule = await optionalModule('src/data/serviceAreasContent.js');
const caseStudiesModule = await optionalModule('src/data/caseStudies.js');
const videosModule = await optionalModule('src/data/videos.js');
const livePaths = (mod, list, pathOf, fallback) =>
  mod && typeof mod[list] === 'function'
    ? mod[list]().map((entry) => (pathOf && typeof mod[pathOf] === 'function' ? mod[pathOf](entry) : fallback(entry)))
    : [];
const TEMPLATE_PAGES = [
  ...livePaths(areasModule, 'publishedServiceAreas', null, (area) => area.path),
  ...livePaths(caseStudiesModule, 'publishedCaseStudies', 'caseStudyPath', (study) => `/projects/${study.slug}`),
  ...livePaths(videosModule, 'publishedVideos', 'videoPath', (video) => `/videos/${video.slug}`),
];

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
const mediaFor = (src) => (MEDIA && src && MEDIA[src]) || null;

/**
 * BlogPosting.image files (scripts/build-images.mjs: 16:9, 4:3 and 1:1 JPEGs)
 * of a media entry, when it has all three; otherwise the post's schema keeps
 * its single 1200x630 image.
 */
function schemaImagesOf(entry, slug) {
  const images = Array.isArray(entry.schemaImages) ? entry.schemaImages.filter(Boolean) : [];
  if (images.length === 3) return { schemaImages: images };
  warn(`${slug}: no 16:9/4:3/1:1 article images yet — run node scripts/build-images.mjs --only=blog`);
  return {};
}

/** Hero fields. The layout always shows the hero at 16:9 (object-fit: cover). */
function heroImages(p) {
  if (!p.hero) {
    // No photo: the branded title card from scripts/build-images.mjs ('card:<slug>').
    const card = MEDIA && MEDIA[`card:${p.slug}`];
    if (!card) {
      warn(`${p.slug}: no hero and no title card yet — run node scripts/build-images.mjs --only=cards`);
      return { heroSrc: null, ogImage: '/og/default-1200x630.jpg' };
    }
    return {
      heroSrc: card.src,
      ...(card.srcSet ? { heroSrcSet: card.srcSet } : {}),
      ...(card.avifSrcSet ? { heroAvifSrcSet: card.avifSrcSet } : {}),
      ogImage: card.og,
      ...schemaImagesOf(card, p.slug),
    };
  }
  const media = mediaFor(p.hero);
  if (media) {
    // `hero` is the 16:9 cut when the same original is also a body image;
    // otherwise the top-level fields already are the hero cut.
    const cut = media.hero || media;
    return {
      heroSrc: cut.src,
      ...(cut.srcSet ? { heroSrcSet: cut.srcSet } : {}),
      ...(cut.avifSrcSet ? { heroAvifSrcSet: cut.avifSrcSet } : {}),
      ogImage: media.og || media.ogImage || media.jpg || media.fallback || cut.src,
      ...schemaImagesOf(media, p.slug),
    };
  }
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
  const media = mediaFor(block.src);
  if (media) {
    return {
      t: 'img',
      src: media.src,
      ...(media.srcSet ? { srcSet: media.srcSet } : {}),
      ...(media.avifSrcSet ? { avifSrcSet: media.avifSrcSet } : {}),
      alt: block.alt,
      ...(media.width ? { width: media.width } : {}),
      ...(media.height ? { height: media.height } : {}),
    };
  }
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

/* -------------------------------------------------------------- text */
const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
/** Plain text of inline markup ([label](url) → label, **x** → x). */
const plain = (text) => String(text || '').replace(INLINE_LINK, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
const countWords = (text) => {
  const value = plain(text).trim();
  return value ? value.split(/\s+/).length : 0;
};

/** Every piece of text a block shows, for word counts and link checks. */
function blockTexts(block) {
  if (block.hidden) return [];
  switch (block.t) {
    case 'img':
      return [];
    case 'takeaways':
      return [block.title, ...(block.items || [])];
    case 'table':
      return [block.caption, ...(block.head || []), ...(block.rows || []).flat(), block.note];
    case 'callout':
      return [block.title, block.x];
    default:
      return [block.x];
  }
}

function postTexts(p) {
  return [
    p.excerpt,
    p.answer,
    ...p.blocks.flatMap(blockTexts),
    p.faqsTitle,
    ...(p.faqs || []).flatMap((f) => [f.q, f.a]),
  ].filter(Boolean);
}

const META_MAX = 155;
const META_MIN = 70;
/** A sentence cut is used only when it keeps at least this much of the excerpt. */
const META_SENTENCE_MIN = 100;
const TRAILING_FILLER = /\s+(a|an|and|as|at|but|by|for|from|in|into|of|on|or|that|the|to|which|with|while|your)$/i;

/**
 * Meta description from the excerpt when none is hand-written: kept whole
 * when it fits (≤155), else cut at the last sentence end within 155
 * characters, else at the last word boundary (dropping a dangling "for a",
 * "and the"…) with "…" — never mid-word.
 */
function metaDescriptionFor(p) {
  if (p.metaDescription) return p.metaDescription.trim();
  let text = plain(p.excerpt).replace(/\s+/g, ' ').trim();
  if (text.length > META_MAX) {
    const window = text.slice(0, META_MAX + 1);
    const sentenceEnd = Math.max(...['. ', '! ', '? '].map((mark) => window.lastIndexOf(mark)));
    if (sentenceEnd + 1 >= META_SENTENCE_MIN) {
      text = window.slice(0, sentenceEnd + 1);
    } else {
      // Room for the "…" (one character) within the limit.
      let cut = text.slice(0, META_MAX).replace(/\s+\S*$/, '').replace(/[,;:\s]+$/, '');
      while (TRAILING_FILLER.test(cut)) cut = cut.replace(TRAILING_FILLER, '').replace(/[,;:\s]+$/, '');
      text = `${cut}…`;
    }
  }
  if (text.length < META_MIN) {
    const suffix = 'Renovation advice from Bridgeland Builders, Winnipeg.';
    if (text.length + 1 + suffix.length <= META_MAX) text = `${text} ${suffix}`.trim();
  }
  return text;
}

function metaTitleFor(p) {
  if (p.metaTitle) return p.metaTitle.trim();
  const branded = `${p.title} | Bridgeland Builders`;
  return branded.length <= 60 ? branded : p.title;
}

/* -------------------------------------------------------------- build */
const published = raw.filter((p) => statusOf(p) === 'published');

for (const p of published) {
  for (const key of ['author', 'reviewedBy']) {
    if (p[key] && !Object.prototype.hasOwnProperty.call(PEOPLE, p[key])) fail(`${p.slug}: ${key} "${p[key]}" is not in src/data/people.js`);
  }
  if (!Array.isArray(p.blocks) || !p.blocks.length) fail(`${p.slug}: no body blocks`);
  for (const [index, f] of (p.faqs || []).entries()) {
    if (!f || !String(f.q || '').trim() || !String(f.a || '').trim()) fail(`${p.slug}: faqs[${index}] needs both q and a`);
  }
  if ((p.faqs || []).length && !p.faqsTitle) warn(`${p.slug}: faqs without faqsTitle (the page shows "Frequently Asked Questions")`);
  for (const [index, s] of (p.sources || []).entries()) {
    if (!s || !s.label || !/^https:\/\//.test(s.url || '') || !/^\d{4}-\d{2}-\d{2}$/.test(s.accessed || '')) {
      fail(`${p.slug}: sources[${index}] needs label, an https url and accessed (YYYY-MM-DD)`);
    }
  }
  if (p.answer) {
    const n = countWords(p.answer);
    if (n < 40 || n > 60) warn(`${p.slug}: answer is ${n} words (aim for 40–60)`);
  }
  if (SERVICES) {
    for (const path of p.services || []) {
      if (!SERVICES.some((s) => s.path === path)) fail(`${p.slug}: services entry ${path} is not in src/data/services.js`);
    }
  }
}

const bodies = new Map();
let posts = published.map((p) => {
  let imageIndex = 0;
  const blocks = p.blocks
    .filter((b) => !b.hidden)
    .map((b) => (b.t === 'img' ? bodyImage(b, `${fileName(p.slug, 'blog')}-${++imageIndex}`) : b));

  bodies.set(p.slug, {
    blocks,
    ...(p.faqsTitle ? { faqsTitle: p.faqsTitle } : {}),
    faqs: (p.faqs || []).map(({ q, a }) => ({ q: q.trim(), a: a.trim() })),
    answer: p.answer || '',
    sources: p.sources || [],
    reviewedBy: p.reviewedBy || '',
  });

  return {
    slug: p.slug,
    title: p.title,
    metaTitle: metaTitleFor(p),
    metaDescription: metaDescriptionFor(p),
    excerpt: (p.excerpt || '').trim(),
    category: (p.cats && p.cats[0]) || 'Renovation Advice',
    categories: p.cats || [],
    date: p.date,
    updated: p.updated || p.date,
    readMinutes: Math.max(3, Math.round(postTexts(p).reduce((n, text) => n + countWords(text), 0) / 200)),
    hero: p.hero,
    ...heroImages(p),
    heroAlt: p.hero ? p.heroAlt || p.title : MEDIA && MEDIA[`card:${p.slug}`] ? `Title card: ${p.title}` : p.title,
    author: p.author || '',
    reviewedBy: p.reviewedBy || '',
    services: p.services || [],
    cluster: p.cluster || '',
    memberOnly: !!p.memberOnly,
  };
});

posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));

/**
 * Plan §7 category set for /blog. A post opts in by carrying one of these in
 * `cats`; until posts do, the filter keeps the categories they carry today
 * (each post's first category, newest post first).
 */
const CATEGORY_SET = [
  'Costs & Budgets',
  'Permits & Planning',
  'Basements & Suites',
  'Kitchens & Baths',
  'Older Homes',
  'Hiring a Contractor',
  'Commercial',
  'Money & Rebates',
];
for (const p of published) {
  for (const cat of p.cats || []) {
    if (!CATEGORY_SET.includes(cat)) warn(`${p.slug}: category "${cat}" is not in the plan's category set`);
  }
}
const carried = new Set(posts.flatMap((p) => p.categories));
const categories = [
  ...CATEGORY_SET.filter((c) => carried.has(c)),
  ...new Set(posts.map((p) => p.category).filter((c) => !CATEGORY_SET.includes(c))),
];

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
    fail(`${r.from} redirects to ${r.to}, which is not a published post`);
  }
}

/* ------------------------------------------------------ link checks */
const cleanPath = (path) => (path.length > 1 ? path.replace(/\/+$/, '') : path);
const redirectSources = new Set([
  ...redirects.map((r) => r.from),
  ...((redirectsModule && Array.isArray(redirectsModule.REDIRECTS) ? redirectsModule.REDIRECTS : [])
    .map((r) => r && r.from)
    .filter((from) => typeof from === 'string' && !from.includes(':'))
    .map(cleanPath)),
]);
const noindex = new Set(((seoModule && seoModule.NOINDEX_ROUTES) || []).map(cleanPath));
const knownPages = new Set([
  ...Object.keys((seoModule && seoModule.PAGE_SEO) || {}),
  ...Object.keys((seoModule && seoModule.SERVICE_SEO) || {}),
  ...(SERVICES || []).filter((s) => s.status === 'live').map((s) => s.path),
  ...COST_GUIDES.filter((g) => g.status === 'live').map((g) => g.path),
  ...TEMPLATE_PAGES,
  ...publishedPaths,
].map(cleanPath));
const draftServices = new Set([
  ...(SERVICES || []).filter((s) => s.status !== 'live').map((s) => s.path),
  ...COST_GUIDES.filter((g) => g.status !== 'live').map((g) => g.path),
]);

for (const p of published) {
  for (const text of postTexts(p)) {
    for (const [, , href] of String(text).matchAll(INLINE_LINK)) {
      if (!href.startsWith('/')) {
        if (!/^(https:\/\/|mailto:|tel:)/.test(href)) fail(`${p.slug}: link "${href}" must be a /path, https://, mailto: or tel: URL`);
        continue;
      }
      if (href.includes('?')) {
        fail(`${p.slug}: link ${href} carries a query string (link the clean page URL)`);
        continue;
      }
      const path = cleanPath(href.split('#')[0] || '/');
      if (redirectSources.has(path)) fail(`${p.slug}: link ${path} is a redirect source — link its target instead`);
      else if (noindex.has(path)) fail(`${p.slug}: link ${path} is a noindex page`);
      else if (draftServices.has(path)) fail(`${p.slug}: link ${path} is a draft service page`);
      else if (path.startsWith('/blog/') && !publishedPaths.has(path)) fail(`${p.slug}: link ${path} is not a published post`);
      // Without the page inventory (seo.js failed to load, warned above) an
      // unknown path can't be judged, so it is only a warning then.
      else if (!knownPages.has(path)) (seoModule ? fail : warn)(`${p.slug}: link ${path} is not a page on the site — link a live page`);
    }
  }
}

/* ----------------------------------- blogPosts.js stays build-only */
const CLIENT_IMPORT_ALLOWED = new Set(['src/data/head.js']);
function scanImports(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) {
      scanImports(file);
      continue;
    }
    if (!/\.(jsx?|mjs|tsx?)$/.test(entry.name)) continue;
    const rel = relative(ROOT, file).replace(/\\/g, '/');
    if (rel === 'src/data/blogPosts.js' || CLIENT_IMPORT_ALLOWED.has(rel)) continue;
    if (/from\s+['"][^'"]*\/blogPosts(\.js)?['"]|import\(\s*['"][^'"]*\/blogPosts(\.js)?['"]/.test(readFileSync(file, 'utf8'))) {
      fail(`${rel} imports blogPosts.js (build-only, ships every post body) — import from blogIndex.js instead`);
    }
  }
}
scanImports(join(ROOT, 'src'));

if (errors.length) {
  console.error(`build-blog-data: ${errors.length} error(s)\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

/* ------------------------------------------------------------ write */
// The related-posts ranking runs here (each post module carries its related
// cards) and is copied, as written, into the generated helpers below.
const dayOf = (date) => Date.parse(String(date || '').slice(0, 10)) || 0;
const shared = (a, b) => (a || []).filter((item) => (b || []).includes(item)).length;

function rankRelated(list, post, limit = 3) {
  if (!post) return [];
  return list
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({
      item,
      score:
        shared(item.services, post.services) * 3 +
        (post.cluster && item.cluster === post.cluster ? 2 : 0) +
        shared(item.categories, post.categories),
      gap: Math.abs(dayOf(item.date) - dayOf(post.date)),
    }))
    .sort((a, b) => b.score - a.score || a.gap - b.gap || dayOf(b.item.date) - dayOf(a.item.date))
    .slice(0, limit)
    .map(({ item }) => item);
}

// LIST: the module's post array (BLOG_CARDS in blogIndex.js, BLOG_POSTS in blogPosts.js).
const helpers = (LIST) => `
export function getPostBySlug(slug) {
  return ${LIST}.find((post) => post.slug === slug);
}

const dayOf = ${dayOf};
const shared = ${shared};

/**
 * Related posts, best first: shared services ×3 + same cluster ×2 + shared
 * categories ×1; ties go to the post published closest in time, then the
 * newer one. (Each post module already carries its own, as \`related\`.)
 */
${rankRelated}

export function getRelatedPosts(post, limit = 3) {
  return rankRelated(${LIST}, post, limit);
}

/** The newest published posts that list a service path in \`services\`. */
export function getPostsForService(path, limit = 3) {
  return ${LIST}.filter((post) => (post.services || []).includes(path)).slice(0, limit);
}
`;

const HEADER = `// Generated by scripts/build-blog-data.mjs from blog-raw/posts/*.json.
// Do not edit by hand — edit the post file and re-run: node scripts/build-blog-data.mjs`;

const json = (value) => JSON.stringify(value, null, 2);

/** `post` with only `fields`, in that order, leaving out empty values ('', null, false). */
const pick = (post, fields) =>
  Object.fromEntries(
    fields.filter((key) => post[key] !== undefined && post[key] !== null && post[key] !== '' && post[key] !== false).map((key) => [key, post[key]])
  );

// What a blog card shows (src/components/BlogCard.jsx).
const CARD_FIELDS = ['slug', 'title', 'excerpt', 'category', 'date', 'readMinutes', 'hero', 'heroSrc', 'heroSrcSet', 'heroAvifSrcSet'];
const cardOf = (post) => pick(post, CARD_FIELDS);

const indexOut = `${HEADER}
//
// Client-side card index: each published post's card and ranking fields (no
// bodies, no head-only fields; empty values are left out), for a page that
// needs to list or rank posts. The pages that show posts today load smaller
// modules: the post page src/data/posts/<slug>.js, service pages
// src/data/postCards/<slug>.js, /blog blogList.js and the home page homeGuides.js.

/** Published posts only (blog-raw status "published"), newest first, card and ranking fields. */
export const BLOG_CARDS = ${json(posts.map((post) => pick(post, [...CARD_FIELDS, 'categories', 'services', 'cluster'])))};
${helpers('BLOG_CARDS')}`;

const listOut = `${HEADER}
//
// Everything /blog (src/pages/BlogPage.jsx) needs, in one module: the filter
// categories and every published post's card, categories, meta description
// and 1200x630 image (its Blog node, seo.js buildBlogNode).

/** Filter categories for /blog. */
export const BLOG_CATEGORIES = ${json(categories)};

/** Published posts only (blog-raw status "published"), newest first. */
export const BLOG_LIST = ${json(posts.map((post) => pick(post, [...CARD_FIELDS, 'categories', 'metaDescription', 'ogImage'])))};
`;

for (const slug of GUIDE_SLUGS) {
  if (!publishedPaths.has(`/blog/${slug}`)) warn(`home guides: ${slug} is not published — the newest other post takes its place`);
}
const pickedGuides = GUIDE_SLUGS.map((slug) => posts.find((post) => post.slug === slug)).filter(Boolean);
const homeGuides = [...pickedGuides, ...posts.filter((post) => !pickedGuides.includes(post))].slice(0, GUIDE_COUNT);
const homeOut = `${HEADER}
//
// The guides strip on the home page (src/pages/Home.jsx): GUIDE_SLUGS in
// scripts/build-blog-data.mjs, filled with the newest other posts, as cards.

export const HOME_GUIDES = ${json(homeGuides.map(cardOf))};
`;

const fullPosts = posts.map((post) => ({ ...post, status: 'published', ...bodies.get(post.slug) }));
const fullOut = `${HEADER}
//
// BUILD ONLY (head.js, build-seo-files, sync-redirects, audit-seo): every
// published post WITH its body. Client code imports the smaller generated
// modules instead (src/data/posts/, postCards/, blogList.js, homeGuides.js,
// blogIndex.js); build-blog-data.mjs fails if any other src file imports this one.

/** Filter categories for /blog. */
export const BLOG_CATEGORIES = ${json(categories)};

/** Published posts only (blog-raw status "published"), newest first, with bodies. */
export const BLOG_POSTS = ${json(fullPosts)};

/** Retired post URLs and their targets (for the SEO audit; served by src/data/redirects.js). */
export const BLOG_REDIRECTS = ${json(redirects)};
${helpers('BLOG_POSTS')}`;

const keep = new Set(posts.map((p) => `${p.slug}.js`));
for (const dir of [OUT_BODIES, OUT_CARDS]) {
  mkdirSync(dir, { recursive: true });
  for (const file of readdirSync(dir)) {
    if (file.endsWith('.js') && !keep.has(file)) unlinkSync(join(dir, file));
  }
}
for (const post of posts) {
  // Everything /blog/<slug> shows: the full post (as in blogPosts.js) and the
  // cards of its related posts, ranked here.
  const postModule = { ...post, ...bodies.get(post.slug), related: rankRelated(posts, post).map(cardOf) };
  writeFileSync(
    join(OUT_BODIES, `${post.slug}.js`),
    `${HEADER}\n//\n// /blog/${post.slug}: the post, its body and its related posts' cards, loaded\n// lazily by src/pages/BlogPostPage.jsx (and prefetched by its blog cards).\nexport default ${json(postModule)};\n`
  );
  writeFileSync(
    join(OUT_CARDS, `${post.slug}.js`),
    `${HEADER}\n//\n// The card of /blog/${post.slug}, for the guides on service pages\n// (src/pages/services/ServiceRoute.jsx).\nexport default ${json(cardOf(post))};\n`
  );
}
writeFileSync(OUT_INDEX, indexOut);
writeFileSync(OUT_LIST, listOut);
writeFileSync(OUT_HOME, homeOut);
writeFileSync(OUT_FULL, fullOut);

/* ---------------------------------------------------------- summary */
const byStatus = raw.reduce((acc, p) => ({ ...acc, [statusOf(p)]: (acc[statusOf(p)] || 0) + 1 }), {});
const bodyImages = [...bodies.values()].flatMap((b) => b.blocks.filter((block) => block.t === 'img'));
console.log('blog-raw/posts:', raw.length, JSON.stringify(byStatus));
console.log('published posts:', posts.length, '| redirects:', redirects.length, '| post modules:', bodies.size);
console.log('categories:', categories.join(' | '));
console.log('home guides:', homeGuides.map((p) => p.slug).join(', '));
console.log('faqs:', posts.map((p) => bodies.get(p.slug).faqs.length).join(','), '| member-only:', posts.filter((p) => p.memberOnly).length);
console.log(
  'images:',
  MEDIA ? 'self-hosted map (media.generated.js);' : 'Wix transforms;',
  `${posts.filter((p) => p.heroSrcSet).length}/${posts.length} heroes and`,
  `${bodyImages.filter((b) => b.srcSet).length}/${bodyImages.length} body images have a srcset`
);
if (!SERVICES) console.log('note: src/data/services.js not loaded — services[] paths were not checked');
if (warnings.length) console.warn(`warnings (${warnings.length}):\n  ${warnings.join('\n  ')}`);

/* ----------------------------------------------------------- verify */
if (VERIFY) {
  const urls = new Set();
  const addSet = (srcSet) => (srcSet || '').split(', ').forEach((entry) => entry && urls.add(entry.split(' ')[0]));
  for (const p of posts) {
    addSet(p.heroSrcSet);
    urls.add(p.heroSrc);
    if (p.ogImage) urls.add(p.ogImage);
    for (const b of bodies.get(p.slug).blocks) {
      if (b.t !== 'img') continue;
      urls.add(b.src);
      addSet(b.srcSet);
    }
  }
  const list = [...urls].filter((url) => /^https?:\/\//.test(url));
  const failures = [];
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
  console.log(`verify: ${list.length - failures.length}/${list.length} remote image URLs OK`);
  if (failures.length) {
    console.error(failures.join('\n'));
    console.error('Mark the image "variant": false (or the post "heroVariant": false) in blog-raw/posts to serve the original.');
    process.exit(1);
  }
}
