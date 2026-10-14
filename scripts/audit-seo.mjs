/**
 * SEO build gate (plan §3.13 / decision D10).
 *
 * Reads the prerendered site (dist/**\/index.html + dist/404.html) together with
 * its sources of truth — prerender-routes.json, public/sitemap.xml,
 * public/robots.txt, vercel.json, src/data/seo.js, src/data/redirects.js,
 * src/data/blogPosts.js and (optionally) scripts/keyword-map.json — and checks
 * that they agree.
 *
 *   ERROR  invariants: route <-> SEO <-> prerender <-> sitemap parity, noindex
 *          pages kept out of the sitemap, FAQPage text present in the HTML,
 *          forbidden schema, JSON-LD that parses and whose @ids resolve, one
 *          page JSON-LD block, one <h1>, one <main> (Home included), redirect
 *          parity, NAP rules (incl. the phone-format allowlist), .reveal never
 *          gating the hero / forms / long bodies, an estimator iframe on every
 *          service page, no banned claims, no changefreq/priority, no leaked
 *          Suspense fallback, no keyword listed twice in the keyword map, no
 *          community page (/service-areas/<slug>) short of the D9 gate, no
 *          raw inline markup in page text, meta, JSON-LD or the llms files.
 *   WARN   quality: title/description lengths, duplicates, image hygiene,
 *          internal-link coverage, lastmod uniformity, <main> text changed
 *          without an `updated` bump (content-hash guard), stale cost guides
 *          and source dates, posts past their review-by date, keyword map,
 *          readability (paragraphs over 60 words), JS budgets, service
 *          timelines that disagree with src/data/facts.js (fact drift),
 *          partial lists of the nearby communities (src/data/areas.js),
 *          stock photos still hotlinked from Unsplash.
 *   INFO   accepted interim states (Wix-hosted images until the migration,
 *          307 interim redirects, planned pages not live yet; keyword-map
 *          pages with status "blocked" are never built and are skipped), and
 *          an estimated reading grade above 9.
 *
 * Output: a grouped console report and dist-ssr/audit.json.
 * Exit code: 0, unless --strict is passed and there is at least one ERROR.
 *
 * Usage: node scripts/audit-seo.mjs [--strict] [--verbose] [--wix-error] [--update-hashes]
 *   --verbose        print every finding (default: first 12 per check)
 *   --wix-error      treat static.wixstatic.com images as errors (after migration)
 *   --update-hashes  rewrite scripts/seo-content-hashes.json from this dist/
 *                    (after bumping `updated` on the pages whose copy changed)
 *
 * Node built-ins only. The HTML is read with a small tokenizer
 * (scripts/lib/audit/html.mjs) that understands React's prerendered output.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { brotliCompressSync, constants as zlibConstants } from 'node:zlib';
import { performance } from 'node:perf_hooks';
import {
  ancestors,
  bodyRange,
  byTag,
  classesOf,
  decodeEntities,
  isInside,
  mainRange,
  matchKey,
  parseHtml,
  textBetween,
  textOf,
  wordCount,
} from './lib/audit/html.mjs';
import { conflictingTypes, faqItems, forbiddenSchema, idIndex, jsonLdBlocks, typesOf, walk, walkStrings } from './lib/audit/jsonld.mjs';
import {
  classifyHref,
  cleanPath,
  isPatternSource,
  normaliseRedirectList,
  parseRobots,
  parseSitemap,
  robotsAllows,
  unescapeSource,
  vercelRedirects,
} from './lib/audit/site.mjs';
import { checkKeywords, readKeywordList, readKeywordMap } from './lib/audit/keywords.mjs';
import { checkTimelineDrift } from './lib/audit/facts.mjs';
import { blockText, gradeLevel, wordsOf } from './lib/audit/readability.mjs';
import { Report, printReport, writeJson } from './lib/audit/report.mjs';

const started = performance.now();
const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const OUT_FILE = join(ROOT, 'dist-ssr', 'audit.json');
const CONTENT_HASHES_FILE = join(ROOT, 'scripts', 'seo-content-hashes.json');

const ARGS = new Set(process.argv.slice(2));
const STRICT = ARGS.has('--strict');
const VERBOSE = ARGS.has('--verbose');
const WIX_IS_ERROR = ARGS.has('--wix-error') || process.env.AUDIT_WIX_ERROR === '1';
const UPDATE_HASHES = ARGS.has('--update-hashes');

/* ------------------------------------------------------------ policy */
const SITE_PHONE_TEL = 'tel:+14318665644';
const PHONE_DIGITS = '4318665644';
// Display format 431-866-5644 (plan §14.1); +1-431-866-5644 is the schema form.
const PHONE_FORMATS = new Set(['431-866-5644', '+1-431-866-5644']);
const SCHEMA_TELEPHONE = '+1-431-866-5644';
const MAILING_ADDRESS_RE = /845\s+Dakota/i;
const MAILING_ADDRESS_ROUTES = new Set(['/privacy-policy', '/terms-of-service', '/contact']);
const LEGAL_ROUTES = new Set(['/privacy-policy', '/terms-of-service']);
const REVEAL_FORBIDDEN_CLASSES = ['hero-card', 'page-hero-card', 'blog-hero-figure', 'blog-article-body'];
const TITLE_WARN = 60;
const TITLE_ERROR = 70;
const DESC_MIN = 70;
const DESC_MAX = 155;
// Readability standard (plan §19): paragraphs of 60 words or fewer, reading
// grade 8 or lower. Long paragraphs warn; a page's estimated grade above 9 is
// an info note (the estimate is rough). Legal pages are left out of both.
const LONG_PARAGRAPH_WORDS = 60;
const READING_GRADE_NOTE = 9;
const READING_GRADE_MIN_WORDS = 100;
const MIN_INBOUND = 3;
const STALE_307_DAYS = 45;
const ESTIMATOR_HOST = 'estimator.bridgelandbuilders.com';
// Claims the owner has not confirmed (or that the plan removed as superlatives).
// Matched case-insensitively at a word start, in body text, <title> and meta
// description, on every page except the legal pages.
const BANNED_CLAIMS = [
  '100% satisf',
  '5-star rated',
  'best renovation and construction',
  'top construction',
  'on-site measure',
  'same winnipeg crew',
  'fixed written price',
  'verified homeowner',
];
// Yearly refresh guard (plan §8/§9): cost-guide data and source "verified" dates.
const COST_GUIDE_STALE_MONTHS = 13;
const SOURCE_STALE_DAYS = 365;
// Brotli KB of JS loaded before interaction (plan §4 budgets).
const jsBudgetKb = (route) => {
  if (route === '/') return 80;
  if (route === '/instant-quote') return 75;
  if (route.startsWith('/services/')) return 95;
  if (route.startsWith('/blog/')) return 85;
  return 80;
};
const EXPECTED_FILES = {
  error: ['robots.txt', 'sitemap.xml', '404.html'],
  warn: ['llms.txt', 'llms-full.txt', 'favicon.ico', 'favicon.png', 'site.webmanifest', 'apple-touch-icon.png', 'logo-on-dark.png', 'logo-on-light.png'],
};
const NETLIFY_FILES = ['_headers', '_redirects'];

const report = new Report();

/* ------------------------------------------------------------ inputs */
const readText = (file) => (existsSync(file) ? readFileSync(file, 'utf8').replace(/^﻿/, '') : null);

function readJsonFile(rel, { required = false } = {}) {
  const text = readText(join(ROOT, rel));
  if (text == null) {
    if (required) report.error('input.missing', null, `${rel} not found`);
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    report.error('input.import-failed', null, `${rel} is not valid JSON: ${e.message}`);
    return undefined;
  }
}

/** Imports a module; a missing file or export only warns, a broken module errors. */
async function importGuarded(rel, wanted = [], optional = []) {
  const file = join(ROOT, rel);
  if (!existsSync(file)) {
    report.warn('input.missing', null, `${rel} not found — checks that need it are skipped`);
    return {};
  }
  try {
    const mod = await import(pathToFileURL(file).href);
    for (const name of wanted) {
      if (!(name in mod)) report.warn('input.export-missing', null, `${rel} has no export "${name}" — checks that need it are skipped`);
    }
    for (const name of optional) {
      if (!(name in mod)) report.info('input.export-missing', null, `${rel} has no export "${name}" (optional)`);
    }
    return mod;
  } catch (e) {
    report.error('input.import-failed', null, `${rel} failed to import: ${e.message.split('\n')[0]}`);
    return {};
  }
}

const siteConfig = await importGuarded('src/data/siteConfig.js', ['SITE_URL']);
const SITE_URL = String(siteConfig.SITE_URL || 'https://bridgelandbuilders.com').replace(/\/+$/, '');
// head.js first: it imports every service content module (src/data/projects.js),
// which fills seo.js SERVICE_SEO, and it owns the full route inventory
// (SEO_ENTRIES: static pages, live services, cost guides, published areas,
// case studies, videos and posts) that the prerender used.
const headModel = await importGuarded('src/data/head.js', ['SEO_ENTRIES']);
const seo = await importGuarded('src/data/seo.js', ['PAGE_SEO', 'SERVICE_SEO', 'NOINDEX_ROUTES']);
const redirectsModule = await importGuarded('src/data/redirects.js', ['REDIRECTS'], ['EXTERNAL_REDIRECTS']);
const blogModule = await importGuarded('src/data/blogPosts.js', ['BLOG_POSTS'], ['BLOG_REDIRECTS']);
const facts = await importGuarded('src/data/facts.js', ['TIMELINES']);
const areasContent = await importGuarded('src/data/serviceAreasContent.js', ['SERVICE_AREAS_CONTENT']);
const caseStudyData = await importGuarded('src/data/caseStudyData.js', ['caseStudiesForArea', 'publishedCaseStudies']);

const prerenderJson = readJsonFile('prerender-routes.json', { required: true });
const PRERENDER = Array.isArray(prerenderJson) ? prerenderJson.map(cleanPath) : [];
const PRERENDER_SET = new Set(PRERENDER);
const vercelConfig = readJsonFile('vercel.json', { required: true });
const sitemapXml = readText(join(ROOT, 'public', 'sitemap.xml'));
const robotsTxt = readText(join(ROOT, 'public', 'robots.txt'));

/* ------------------------------------------- SEO route model (seo.js) */
const PAGE_SEO = seo.PAGE_SEO && typeof seo.PAGE_SEO === 'object' ? seo.PAGE_SEO : null;
const SERVICE_SEO = seo.SERVICE_SEO && typeof seo.SERVICE_SEO === 'object' ? seo.SERVICE_SEO : null;
const SEO_AVAILABLE = !!(PAGE_SEO && SERVICE_SEO);
const BLOG_POSTS = Array.isArray(blogModule.BLOG_POSTS) ? blogModule.BLOG_POSTS : [];

const seoEntries = new Map(); // route -> { kind, entry }
const NOINDEX = new Set();
if (PAGE_SEO) for (const [path, entry] of Object.entries(PAGE_SEO)) seoEntries.set(cleanPath(path), { kind: 'page', entry });
if (SERVICE_SEO) for (const [path, entry] of Object.entries(SERVICE_SEO)) seoEntries.set(cleanPath(path), { kind: 'service', entry });
// Template routes (cost guides, community pages, case studies, videos) have no
// PAGE_SEO/SERVICE_SEO entry: their head comes from their own data module.
const HEAD_ENTRIES = headModel.SEO_ENTRIES && typeof headModel.SEO_ENTRIES === 'object' ? headModel.SEO_ENTRIES : {};
for (const [path, entry] of Object.entries(HEAD_ENTRIES)) {
  const route = cleanPath(path);
  if (!seoEntries.has(route) && !route.startsWith('/blog/')) seoEntries.set(route, { kind: 'template', entry });
}
for (const post of BLOG_POSTS) {
  if (!post || !post.slug) continue;
  const route = `/blog/${post.slug}`;
  const status = post.status || 'published';
  if (status === 'published' || status === 'noindex') {
    seoEntries.set(route, { kind: 'blog', entry: post });
    if (status === 'noindex') NOINDEX.add(route);
  } else {
    report.error('blog.unpublished-exported', route, `status "${status}" but exported in BLOG_POSTS (only published posts may be)`);
  }
}
if (Array.isArray(seo.NOINDEX_ROUTES)) seo.NOINDEX_ROUTES.forEach((r) => NOINDEX.add(cleanPath(r)));
for (const [route, { entry }] of seoEntries) {
  if (entry && /noindex/i.test(entry.robots || '')) NOINDEX.add(route);
}
const INDEXABLE = new Set([...seoEntries.keys()].filter((r) => !NOINDEX.has(r)));

/* ----------------------------------------------- router (AppShell.jsx) */
function routerPaths() {
  const out = { literal: [], navigate: [] };
  for (const rel of ['src/AppShell.jsx', 'src/App.jsx']) {
    const src = readText(join(ROOT, rel));
    if (!src) continue;
    const chunks = src.split(/<Route\b/).slice(1);
    for (const chunk of chunks) {
      const body = chunk.split(/<Route\b|<\/Routes>/)[0];
      const m = body.match(/\bpath=(["'])([^"']+)\1/);
      if (!m) continue;
      const path = m[2];
      if (path === '*' || /[:*]/.test(path)) continue;
      const nav = body.match(/<Navigate\b[^>]*\bto=(["'])([^"']+)\1/);
      if (nav) out.navigate.push({ path: cleanPath(path), to: nav[2] });
      else out.literal.push(cleanPath(path));
    }
  }
  return out;
}
const ROUTER = routerPaths();

/* --------------------------------------------------------- redirects */
const REDIRECTS = vercelRedirects(vercelConfig);
const redirectSourceMatches = (path) =>
  REDIRECTS.filter((r) => !r.hasConditions && (r.literal === path || (r.pattern && r.pattern.test(path))));

/* ------------------------------------------------------ dist helpers */
const routeFile = (route) => (route === '/' ? join(DIST, 'index.html') : join(DIST, ...route.slice(1).split('/'), 'index.html'));
const distStaticExists = (path) => /\.[a-z0-9]+$/i.test(path) && existsSync(join(DIST, ...path.slice(1).split('/')));
const shortUrl = (url) => (url.length > 70 ? `${url.slice(0, 67)}…` : url);

// Budgets are checked at brotli quality 11 (plan §4 baseline). Vercel
// compresses on the fly at about quality 4, so that size is reported too, as
// the closer estimate of what a visitor downloads.
const brotliCache = new Map();
function brotliKb(path) {
  if (brotliCache.has(path)) return brotliCache.get(path);
  const file = join(DIST, ...path.replace(/^\//, '').split('?')[0].split('/'));
  const sizes = { kb: 0, servedKb: 0 };
  if (existsSync(file)) {
    const bytes = readFileSync(file);
    const at = (quality) => brotliCompressSync(bytes, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: quality } }).length / 1024;
    sizes.kb = at(11);
    sizes.servedKb = at(4);
  }
  brotliCache.set(path, sizes);
  return sizes;
}

/* ------------------------------------------------------- page parsing */
function loadPage(route, file, { is404 = false } = {}) {
  const html = readText(file);
  if (html == null) return null;
  const doc = parseHtml(html);
  const head = doc.elements.find((el) => el.tag === 'head');
  const inHead = (el) => (head ? isInside(el, { start: head.start, end: head.end }) : true);
  const metas = byTag(doc, 'meta').filter(inHead);
  const metaBy = (attr, key) => {
    const el = metas.find((m) => (m.attrs[attr] || '').toLowerCase() === key);
    return el ? el.attrs.content ?? '' : null;
  };
  const titleEl = byTag(doc, 'title').find(inHead);
  const canonicalEl = byTag(doc, 'link').find((l) => inHead(l) && (l.attrs.rel || '').toLowerCase() === 'canonical');
  const body = bodyRange(doc);
  const main = mainRange(doc);
  const h1s = byTag(doc, 'h1').map((el) => textOf(doc, el));

  return {
    route,
    file,
    is404,
    html,
    doc,
    body,
    main,
    title: titleEl ? decodeEntities(titleEl.raw || '').trim() : null,
    description: metaBy('name', 'description'),
    robots: metaBy('name', 'robots'),
    canonical: canonicalEl ? canonicalEl.attrs.href : null,
    ogTitle: metaBy('property', 'og:title'),
    ogImage: metaBy('property', 'og:image'),
    h1s,
    mainCount: byTag(doc, 'main').length,
    blocks: jsonLdBlocks(doc),
    links: [],
    stats: {},
  };
}

/* ------------------------------------------------------ per-page checks */
const ORG_ID = `${SITE_URL}/#organization`;
const schemaTypeCount = {};

function auditHead(page) {
  const { route } = page;
  const indexable = INDEXABLE.has(route) || (!SEO_AVAILABLE && !/noindex/i.test(page.robots || ''));
  page.indexable = !page.is404 && indexable;

  if (!page.title) report.error('head.title-missing', route, 'no <title>');
  else {
    const len = [...page.title].length;
    page.stats.titleLength = len;
    // D10: title length is a quality signal, never a build-failing invariant.
    if (len > TITLE_ERROR) report.warn('head.title-too-long', route, `${len} chars (> ${TITLE_ERROR}, truncated in results) — "${page.title}"`);
    else if (len > TITLE_WARN && !page.is404) report.warn('head.title-too-long', route, `${len} chars (> ${TITLE_WARN}) — "${page.title}"`);
  }

  if (!page.description) report.warn('head.description-missing', route, 'no meta description');
  else {
    const len = [...page.description].length;
    page.stats.descriptionLength = len;
    if ((len < DESC_MIN || len > DESC_MAX) && !page.is404) report.warn('head.description-length', route, `${len} chars (want ${DESC_MIN}-${DESC_MAX})`);
  }

  if (page.is404) {
    if (!/noindex/i.test(page.robots || '')) report.error('files.404-indexable', '404.html', 'robots meta lacks noindex');
    return;
  }

  const expected = `${SITE_URL}${route === '/' ? '/' : route}`;
  if (page.indexable) {
    if (!page.canonical) report.error('head.canonical-missing', route, 'no <link rel="canonical">');
    else if (page.canonical !== expected && !(route === '/' && page.canonical === SITE_URL)) {
      report.error('head.canonical-mismatch', route, `canonical ${page.canonical} (expected ${expected})`);
    }
  } else if (page.canonical && page.canonical !== expected) {
    report.warn('head.canonical-mismatch', route, `canonical ${page.canonical} (expected ${expected})`);
  }

  const missingOg = [!page.ogTitle && 'og:title', !page.ogImage && 'og:image'].filter(Boolean);
  if (missingOg.length) report.warn('head.og-missing', route, `missing ${missingOg.join(', ')}`);

  if (SEO_AVAILABLE) {
    const servedNoindex = /noindex/i.test(page.robots || '');
    if (NOINDEX.has(route) && !servedNoindex) report.error('robots-meta.noindex-expected', route, `robots meta is "${page.robots || '(none)'}"`);
    if (INDEXABLE.has(route) && servedNoindex) report.error('robots-meta.unexpected-noindex', route, `robots meta is "${page.robots}"`);
  }
}

function auditJsonLd(page) {
  const { route, blocks } = page;
  if (!blocks.length) {
    if (!page.is404) report.warn('jsonld.missing', route, 'no JSON-LD on the page');
    page.ids = { defs: new Map(), refs: [] };
    return;
  }
  const pageBlocks = blocks.filter((b) => b.isPage);
  if (pageBlocks.length > 1) report.error('jsonld.page-block-count', route, `${pageBlocks.length} data-seo="page" blocks (expected 1)`);
  if (!pageBlocks.length && !page.is404) report.warn('jsonld.page-block-missing', route, 'no data-seo="page" block');
  if (!blocks.some((b) => !b.isPage)) report.warn('jsonld.sitewide-missing', route, 'sitewide Organization/WebSite block not found');

  const parsed = [];
  for (const block of blocks) {
    if (block.error) {
      report.error('jsonld.parse-error', route, `${block.isPage ? 'page' : 'sitewide'} block: ${block.error}`);
      continue;
    }
    parsed.push(block.data);
    if (block.isPage || route === '/') {
      walk(block.data, (node) => {
        for (const t of typesOf(node)) schemaTypeCount[t] = (schemaTypeCount[t] || 0) + 1;
      });
    }
    for (const f of forbiddenSchema(block.data, { route, orgId: ORG_ID })) report.add(f.severity, f.code, route, f.message);

    // NAP inside structured data.
    walkStrings(block.data, (value, key) => {
      if (key === 'streetAddress') report.error('schema.street-address', route, `streetAddress "${value}"`);
      else if (MAILING_ADDRESS_RE.test(value)) report.error('schema.street-address', route, `"${shortUrl(value)}"`);
      if (key === 'postalCode') report.warn('schema.postal-code', route, `postalCode "${value}"`);
      if (key === 'telephone' && value !== SCHEMA_TELEPHONE) report.error('schema.telephone', route, `telephone "${value}"`);
    });
  }

  page.ids = idIndex(parsed);
  page.faq = parsed.flatMap((data) => faqItems(data));

  // Conflicting @type for one @id (e.g. an Organization stub vs the sitewide GeneralContractor).
  for (const [id, typeLists] of page.ids.defs) {
    const conflict = conflictingTypes(typeLists);
    if (conflict) report.warn('jsonld.type-conflict', route, `${id}: [${conflict[0].join(', ')}] vs [${conflict[1].join(', ')}]`);
  }
}

function auditFaq(page) {
  if (!page.faq || !page.faq.length) return;
  const haystack = matchKey(textBetween(page.doc, page.body.start, page.body.end, ''));
  const missing = [];
  for (const item of page.faq) {
    if (item.question && !haystack.includes(matchKey(item.question))) missing.push({ part: 'question', text: item.question });
    if (item.answer && !haystack.includes(matchKey(item.answer))) missing.push({ part: 'answer', question: item.question, text: item.answer });
  }
  if (!missing.length) return;
  const answers = missing.filter((m) => m.part === 'answer').length;
  const questions = missing.length - answers;
  const sample = missing[0].part === 'answer' ? `answer to "${missing[0].question}"` : `question "${missing[0].text}"`;
  report.error(
    'faq.missing-from-html',
    page.route,
    `${answers} of ${page.faq.length} answers${questions ? ` and ${questions} questions` : ''} in FAQPage JSON-LD are not in the HTML (e.g. ${sample})`,
    missing
  );
}

function auditStructure(page) {
  const { route, doc } = page;
  if (page.h1s.length !== 1) report.error('html.h1', route, `${page.h1s.length} <h1> elements`);
  if (page.mainCount !== 1) {
    if (route === '/' && page.mainCount === 0) report.error('html.main', route, 'Home has no <main> landmark (plan §2)');
    else report.error('html.main', route, `${page.mainCount} <main> elements`);
  }
  if (/route-loading|Loading page\.\.\./.test(page.html)) report.error('html.loading-fallback', route, 'Suspense "Loading page..." fallback rendered instead of the page');

  // .reveal (opacity: 0 until the observer runs) must never gate the hero,
  // the <h1>, forms (incl. the estimator) or long article bodies. One finding
  // per offending .reveal wrapper, naming what it hides.
  const wrappers = new Map(); // reveal element idx -> { el, forbidden, hides:Set }
  const wrapper = (el) => {
    if (!wrappers.has(el.idx)) wrappers.set(el.idx, { el, forbidden: null, hides: new Set() });
    return wrappers.get(el.idx);
  };
  for (const el of doc.elements) {
    const cls = classesOf(el);
    if (cls.has('reveal')) {
      const hit = REVEAL_FORBIDDEN_CLASSES.find((c) => cls.has(c));
      if (hit) wrapper(el).forbidden = hit;
    }
    const hidden = el.tag === 'h1' ? '<h1>' : el.tag === 'form' ? '<form>' : el.tag === 'iframe' && classesOf(el).has('estimator-embed') ? 'estimator' : null;
    if (hidden) {
      const anc = ancestors(doc, el).find((a) => classesOf(a).has('reveal'));
      if (anc) wrapper(anc).hides.add(hidden);
    }
  }
  for (const { el, forbidden, hides } of wrappers.values()) {
    const cls = [...classesOf(el)].filter((c) => c !== 'reveal');
    const label = forbidden ? `.${forbidden}` : `${el.tag}${cls.length ? `.${cls.slice(0, 2).join('.')}` : ''}`;
    report.error('html.reveal-gated', route, `${label} has .reveal${hides.size ? ` (hides ${[...hides].join(', ')})` : ''}`);
  }

  // Readability (plan §19) of the main content, read as rendered
  // (readability.mjs blockText). The legal pages are left out.
  if (LEGAL_ROUTES.has(route)) return;
  const long = byTag(doc, 'p')
    .filter((p) => isInside(p, page.main))
    .map((p) => wordsOf(blockText(doc, p)).length)
    .filter((n) => n > LONG_PARAGRAPH_WORDS);
  if (long.length) report.warn('html.long-paragraph', route, `${long.length} paragraph(s) over ${LONG_PARAGRAPH_WORDS} words (longest ${Math.max(...long)})`);

  // Estimated reading grade of the page's prose: paragraphs and list items in
  // <main>, outermost only, form text left out. Info only.
  if (!page.indexable) return;
  const PROSE = new Set(['p', 'li']);
  const prose = doc.elements.filter(
    (el) => PROSE.has(el.tag) && isInside(el, page.main) && !ancestors(doc, el).some((a) => PROSE.has(a.tag) || a.tag === 'form')
  );
  const { words, grade } = gradeLevel(prose.map((el) => blockText(doc, el)));
  page.stats.readingGrade = grade == null ? null : Math.round(grade * 10) / 10;
  if (words >= READING_GRADE_MIN_WORDS && grade > READING_GRADE_NOTE) {
    report.info('readability.grade', route, `Flesch-Kincaid grade ${grade.toFixed(1)} (estimate over ${words} words of paragraphs and list items; standard: grade 8 or lower)`);
  }
}

function auditNap(page) {
  const { route, doc } = page;
  const tels = new Map();
  for (const a of byTag(doc, 'a')) {
    const href = (a.attrs.href || '').trim();
    if (!/^tel:/i.test(href) || href === SITE_PHONE_TEL) continue;
    tels.set(href, (tels.get(href) || 0) + 1);
  }
  for (const [href, n] of tels) report.error('nap.tel', route, `${href} ×${n}`);

  if (MAILING_ADDRESS_RE.test(page.html) && !MAILING_ADDRESS_ROUTES.has(route)) {
    report.error('nap.mailing-address', route, '"845 Dakota" appears (allowed only on /privacy-policy, /terms-of-service, /contact)');
  }

  const text = textBetween(doc, page.body.start, page.body.end, ' ');
  const formats = new Map();
  const others = new Map();
  const PHONE_RE = /(?:\+1[\s.-]?)?(?:\(\d{3}\)\s?|\b\d{3}[\s.-])\d{3}[\s.-]\d{4}\b/g;
  for (const m of text.matchAll(PHONE_RE)) {
    const raw = m[0].trim();
    let digits = raw.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
    if (digits === PHONE_DIGITS) {
      if (!PHONE_FORMATS.has(raw)) formats.set(raw, (formats.get(raw) || 0) + 1);
    } else others.set(raw, (others.get(raw) || 0) + 1);
  }
  for (const [raw, n] of formats) report.error('nap.phone-format', route, `"${raw}" ×${n} (allowed: ${[...PHONE_FORMATS].join(', ')})`);
  for (const [raw, n] of others) report.info('nap.other-phone', route, `"${raw}" ×${n}`);
  if (/@gmail\.com/i.test(page.html)) report.warn('nap.gmail', route, 'a gmail.com address appears (use info@bridgelandbuilders.com)');
}

function auditImages(page) {
  const { route, doc } = page;
  let wix = 0;
  let unsplash = 0;
  const badAttrs = [];
  const countWix = (value) => {
    if (value && value.includes('static.wixstatic.com')) wix += 1;
  };
  countWix(page.ogImage);
  for (const el of doc.elements) {
    if (!isInside(el, page.body)) continue;
    if (el.tag === 'source') countWix(el.attrs.srcset);
    if (el.tag !== 'img') continue;
    const src = el.attrs.src || '';
    countWix(src || el.attrs.srcset);
    const missing = ['width', 'height', 'alt'].filter((a) => !(a in el.attrs));
    if (missing.length) badAttrs.push(`${shortUrl(src || '(no src)')} [no ${missing.join('/')}]`);

    // Stock photos: hotlinked from Unsplash, or self-hosted under
    // /images/stock/ (scripts/build-images.mjs STOCK) — never "our" work.
    if (src.includes('images.unsplash.com')) unsplash += 1;
    if (src.includes('images.unsplash.com') || src.includes('/images/stock/')) {
      const figure = ancestors(doc, el).find((a) => a.tag === 'figure');
      const caption = figure
        ? doc.elements.filter((c) => c.tag === 'figcaption' && isInside(c, { start: figure.start, end: figure.end })).map((c) => textOf(doc, c)).join(' ')
        : '';
      const words = `${el.attrs.alt || ''} ${caption}`;
      const hit = words.match(/\b(winnipeg|our|we)\b/i);
      if (hit) report.warn('img.stock-claim', route, `Stock photo described with "${hit[0]}": "${shortUrl((el.attrs.alt || caption).trim())}"`);
    }
  }
  if (wix) report.add(WIX_IS_ERROR ? 'error' : 'info', 'img.wix-host', route, `${wix} image reference(s) on static.wixstatic.com`);
  // A new Unsplash photo is served from this site once it is added to STOCK in
  // scripts/build-images.mjs and `node scripts/build-images.mjs --only=stock` runs.
  if (unsplash) report.warn('img.unsplash-host', route, `${unsplash} <img> still loaded from images.unsplash.com (add the photo to STOCK in scripts/build-images.mjs)`);
  if (badAttrs.length) report.warn('img.attributes', route, `${badAttrs.length} <img> missing attributes, e.g. ${badAttrs.slice(0, 2).join('; ')}`, badAttrs);
  page.stats.wixImages = wix;
}

function collectLinks(page) {
  for (const a of byTag(page.doc, 'a')) {
    if (!isInside(a, page.body)) continue;
    const target = classifyHref(a.attrs.href, SITE_URL);
    if (!target || !target.internal) continue;
    page.links.push({ ...target, inMain: isInside(a, page.main) });
  }
}

function auditPerformance(page) {
  const scripts = new Set();
  for (const el of page.doc.elements) {
    if (el.tag === 'script' && (el.attrs.type || '') === 'module' && (el.attrs.src || '').startsWith('/')) scripts.add(el.attrs.src);
    if (el.tag === 'link' && (el.attrs.rel || '').toLowerCase() === 'modulepreload' && (el.attrs.href || '').startsWith('/')) scripts.add(el.attrs.href);
  }
  const sizes = [...scripts].map((src) => brotliKb(src));
  const kb = sizes.reduce((sum, s) => sum + s.kb, 0);
  const servedKb = sizes.reduce((sum, s) => sum + s.servedKb, 0);
  page.stats.jsBrotliKb = Math.round(kb * 10) / 10;
  page.stats.jsServedKb = Math.round(servedKb * 10) / 10;
  const budget = jsBudgetKb(page.route);
  if (kb > budget) {
    report.warn('perf.js-budget', page.route, `${page.stats.jsBrotliKb} KB br q11 (~${Math.round(servedKb)} KB as served; entry + modulepreload, lazy route chunks not counted) > ${budget} KB budget`);
  }
}

function auditEstimator(page) {
  const { route } = page;
  const isServicePage = (SERVICE_SEO && route in SERVICE_SEO) || (/^\/services\/[^/]+$/.test(route) && !route.endsWith('/cost'));
  if (!isServicePage) return;
  const ok = byTag(page.doc, 'iframe').some((f) => (f.attrs.src || '').includes(ESTIMATOR_HOST));
  if (!ok) report.error('estimator.missing', route, `no <iframe> with an ${ESTIMATOR_HOST} src`);
}

// Lower-cased, one space between words, every dash and hyphen as "-".
const claimText = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[‐-―−]/g, '-')
    .replace(/\s+/g, ' ');
const BANNED_CLAIM_RES = BANNED_CLAIMS.map((phrase) => ({
  phrase,
  re: new RegExp(`(?<![a-z0-9])${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
}));

/** Unconfirmed or removed claims (owner decisions, plan §11.1) anywhere a visitor or a result page shows them. */
function auditClaims(page) {
  if (LEGAL_ROUTES.has(page.route)) return;
  const places = [
    ['body', claimText(textBetween(page.doc, page.body.start, page.body.end, ' '))],
    ['<title>', claimText(page.title)],
    ['meta description', claimText(page.description)],
  ];
  for (const { phrase, re } of BANNED_CLAIM_RES) {
    for (const [where, text] of places) {
      const m = re.exec(text);
      if (!m) continue;
      const context = text.slice(Math.max(0, m.index - 30), m.index + phrase.length + 30).trim();
      report.error('claims.banned', page.route, `"${phrase}" in ${where}: "…${context}…"`);
      break;
    }
  }
}

// Inline markup ([label](/path), **bold**) is rendered on the page by
// src/lib/inline.jsx and stripped everywhere else (src/lib/inlineText.js
// stripInline). Seen raw, it leaked: page copy rendered without renderInline,
// or a meta tag / JSON-LD string built without stripInline.
const RAW_MARKUP_RE = /\[[^\]\n]+\]\((?:\/|https?:\/\/|mailto:|tel:)[^)\s]*\)|\*\*[^*\n]+\*\*/;
function auditRawMarkup(page) {
  const places = [
    ['page text', textBetween(page.doc, page.body.start, page.body.end, '')],
    ['<title>', page.title || ''],
    ['meta description', page.description || ''],
  ];
  for (const block of page.blocks) {
    if (block.data) walkStrings(block.data, (value) => places.push(['JSON-LD', value]));
  }
  const hit = places.find(([, text]) => RAW_MARKUP_RE.test(text));
  if (hit) {
    const m = RAW_MARKUP_RE.exec(hit[1]);
    report.error('content.raw-markup', page.route, `inline markup shown raw in ${hit[0]}: "${shortUrl(m[0])}"`);
  }
}

/**
 * Normalised visible text of <main>, for the content-hash guard. Text nodes
 * are joined with nothing: React splits a sentence into several nodes
 * wherever it mixes text with a value ("within " + REPLY_TIME + "."), and a
 * joining space would turn a pure refactor into a "change". Any real change
 * to the words still changes the hash.
 */
const mainTextHash = (page) =>
  createHash('sha256')
    .update(textBetween(page.doc, page.main.start, page.main.end, '').replace(/\s+/g, ' ').trim())
    .digest('hex')
    .slice(0, 16);

/* =================================================================== run */
const pages = new Map(); // route -> page
let notFound = null;

if (!existsSync(DIST)) {
  report.error('files.missing', null, 'dist/ not found — run "npm run build" before the audit');
} else {
  // Static artefacts.
  for (const [severity, files] of Object.entries(EXPECTED_FILES)) {
    for (const f of files) if (!existsSync(join(DIST, f))) report.add(severity, 'files.missing', null, `dist/${f} missing`);
  }
  for (const f of NETLIFY_FILES) {
    if (existsSync(join(DIST, f)) || existsSync(join(ROOT, 'public', f))) report.warn('files.netlify-only', null, `${f} is a Netlify file; Vercel ignores it (plan §1: remove generator + file)`);
  }

  if (existsSync(join(DIST, '404.html'))) notFound = loadPage('404.html', join(DIST, '404.html'), { is404: true });

  for (const route of PRERENDER) {
    const file = routeFile(route);
    if (!existsSync(file)) {
      report.error('parity.missing-html', route, `${file.slice(ROOT.length).replace(/\\/g, '/')} not found`);
      continue;
    }
    pages.set(route, loadPage(route, file));
  }

  // Stale HTML in dist/ for routes no longer prerendered.
  const walkDist = (dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name === 'assets' || entry.name.startsWith('.')) continue;
      const route = `${prefix}/${entry.name}`;
      if (existsSync(join(dir, entry.name, 'index.html')) && !PRERENDER_SET.has(route)) {
        report.warn('parity.stale-html', route, 'dist/ holds HTML for a route not in prerender-routes.json');
      }
      walkDist(join(dir, entry.name), route);
    }
  };
  walkDist(DIST, '');
}

// Sitewide graph @ids: from the template's sitewide block and from seo.js.
const sitewideIds = new Set();
const home = pages.get('/');
if (home) {
  for (const block of home.blocks) {
    if (!block.isPage && block.data) for (const id of idIndex([block.data]).defs.keys()) sitewideIds.add(id);
  }
}
if (typeof seo.buildOrganizationGraph === 'function') {
  try {
    const nodes = seo.buildOrganizationGraph();
    for (const id of idIndex([nodes]).defs.keys()) sitewideIds.add(id);
  } catch (e) {
    report.warn('input.import-failed', null, `buildOrganizationGraph() threw: ${e.message}`);
  }
}

const notFoundH1 = notFound && notFound.h1s[0] ? notFound.h1s[0] : null;
for (const page of [...pages.values(), ...(notFound ? [notFound] : [])]) {
  auditHead(page);
  auditJsonLd(page);
  auditFaq(page);
  auditStructure(page);
  auditNap(page);
  auditImages(page);
  auditClaims(page);
  auditRawMarkup(page);
  if (page.is404) continue;
  collectLinks(page);
  auditPerformance(page);
  auditEstimator(page);
  page.mainHash = mainTextHash(page);
  if ((notFoundH1 && page.h1s[0] === notFoundH1) || /ISN&#x27;T IN THE|ISN'T IN THE BLUEPRINT/.test(page.html)) {
    report.error('parity.renders-404', page.route, 'prerendered HTML is the 404 page — route missing from the router');
  }
}

/* ------------------------------------------------- @id resolution (site) */
const allDefinedIds = new Set(sitewideIds);
for (const page of pages.values()) if (page.ids) for (const id of page.ids.defs.keys()) allDefinedIds.add(id);
for (const page of [...pages.values(), ...(notFound ? [notFound] : [])]) {
  if (!page.ids) continue;
  const seen = new Set();
  for (const ref of page.ids.refs) {
    if (seen.has(ref.id)) continue;
    seen.add(ref.id);
    const local = ref.id.startsWith('#') || ref.id.startsWith(SITE_URL);
    if (!local) continue; // external entity IRIs (Wikidata etc.) are not ours to resolve
    if (page.ids.defs.has(ref.id) || sitewideIds.has(ref.id)) continue;
    if (allDefinedIds.has(ref.id)) report.warn('jsonld.cross-page-id', page.route, `${ref.id} (at ${ref.path}) is only defined on another page`);
    else report.error('jsonld.unresolved-id', page.route, `${ref.id} (at ${ref.path}) is not defined on the page or in the sitewide graph`);
  }
}

/* ------------------------------------------- route <-> SEO <-> prerender */
if (SEO_AVAILABLE && prerenderJson) {
  for (const route of seoEntries.keys()) {
    if (!PRERENDER_SET.has(route)) report.error('parity.not-prerendered', route, 'has an SEO entry but is not in prerender-routes.json');
  }
  for (const route of PRERENDER) {
    if (!seoEntries.has(route)) report.error('parity.no-seo-entry', route, 'in prerender-routes.json without a PAGE_SEO / SERVICE_SEO / blog entry');
  }
  for (const route of ROUTER.literal) {
    if (!seoEntries.has(route)) report.error('parity.router-no-seo', route, 'router path without an SEO entry (prerender skips it, so Vercel serves a 404)');
  }
}
for (const nav of ROUTER.navigate) {
  if (!redirectSourceMatches(nav.path).length) {
    report.warn('parity.client-redirect', nav.path, `client-side <Navigate> to ${nav.to} only — add a server redirect in src/data/redirects.js`);
  }
}

// Every SEO entry carries an `updated` date (feeds sitemap lastmod).
if (SEO_AVAILABLE) {
  const noUpdated = [...seoEntries]
    .filter(([, { kind, entry }]) => kind !== 'blog' && !/^\d{4}-\d{2}-\d{2}/.test(String(entry.updated || '')))
    .map(([route]) => route);
  if (noUpdated.length) report.warn('seo.updated-missing', null, `${noUpdated.length} PAGE_SEO/SERVICE_SEO entries without updated:'YYYY-MM-DD': ${noUpdated.slice(0, 8).join(', ')}${noUpdated.length > 8 ? ', …' : ''}`, noUpdated);
}

/* ------------------------------------------------------------- sitemap */
// Latest calendar date anywhere (UTC+14), so a lastmod of "today" is never
// flagged as future just because the build machine's UTC date lags behind.
const today = new Date(Date.now() + 14 * 3600 * 1000).toISOString().slice(0, 10);
const sitemapPaths = new Set();
const sitemapLastmod = new Map(); // path -> lastmod
if (sitemapXml == null) {
  report.error('sitemap.missing', null, 'public/sitemap.xml not found');
} else {
  const sitemap = parseSitemap(sitemapXml);
  const withFreq = sitemap.urls.filter((u) => u.changefreq != null || u.priority != null).length;
  if (withFreq) report.error('sitemap.changefreq-priority', null, `${withFreq} <url> entries carry <changefreq>/<priority> (plan §3.2: drop them)`);
  const imageMeta = sitemap.urls.reduce((n, u) => n + u.images.filter((i) => i.title || i.caption).length, 0);
  if (imageMeta) report.warn('sitemap.image-meta', null, `${imageMeta} image entries carry deprecated image:title/image:caption`);
  const foreignImages = sitemap.urls.reduce((n, u) => n + u.images.filter((i) => i.loc && !i.loc.startsWith(SITE_URL)).length, 0);
  if (foreignImages) report.warn('sitemap.image-not-owned', null, `${foreignImages} image entries point at third-party hosts (only owned, self-hosted media belong in the sitemap)`);

  const lastmods = [];
  for (const u of sitemap.urls) {
    if (!u.loc || !u.loc.startsWith(SITE_URL)) {
      report.error('sitemap.foreign-loc', null, `<loc>${u.loc}</loc> is not under ${SITE_URL}`);
      continue;
    }
    const path = cleanPath(u.loc.slice(SITE_URL.length) || '/');
    if (sitemapPaths.has(path)) report.error('sitemap.duplicate', path, 'listed twice');
    sitemapPaths.add(path);

    if (u.lastmod) {
      lastmods.push(u.lastmod);
      sitemapLastmod.set(path, u.lastmod.slice(0, 10));
      if (!/^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2}))?$/.test(u.lastmod)) report.warn('sitemap.lastmod-invalid', path, `lastmod "${u.lastmod}" is not W3C date format`);
      else if (u.lastmod.slice(0, 10) > today) report.warn('sitemap.lastmod-invalid', path, `lastmod ${u.lastmod} is in the future`);
    }

    // lastmod should come from the page's `updated` field.
    const seoEntry = seoEntries.get(path);
    if (u.lastmod && seoEntry) {
      let expected = null;
      if (seoEntry.kind === 'blog') expected = seoEntry.entry.updated || seoEntry.entry.date || null;
      else if (seoEntry.kind === 'template') expected = seoEntry.entry.updated || null;
      else if (typeof seo.updatedFor === 'function') {
        try { expected = seo.updatedFor(path); } catch { expected = null; }
      } else expected = seoEntry.entry.updated || null;
      if (expected && String(expected).slice(0, 10) !== u.lastmod.slice(0, 10)) {
        report.warn('sitemap.lastmod-mismatch', path, `lastmod ${u.lastmod} but updated is ${expected}`);
      }
    }

    if (NOINDEX.has(path) || (pages.get(path) && /noindex/i.test(pages.get(path).robots || ''))) {
      report.error('sitemap.noindex', path, 'noindex page is listed in the sitemap');
    } else if (redirectSourceMatches(path).length) {
      report.error('sitemap.redirect-source', path, 'URL is a redirect source');
    } else if (SEO_AVAILABLE && !INDEXABLE.has(path)) {
      report.error('sitemap.unknown-route', path, 'no SEO entry for this URL');
    } else if (!PRERENDER_SET.has(path)) {
      report.error('sitemap.unknown-route', path, 'not in prerender-routes.json');
    }
  }
  if (lastmods.length > 1 && new Set(lastmods).size === 1) {
    report.warn('sitemap.lastmod-uniform', null, `all ${lastmods.length} lastmod values are ${lastmods[0]} — use each page's real "updated" date`);
  }
  if (SEO_AVAILABLE) {
    for (const route of INDEXABLE) if (!sitemapPaths.has(route)) report.error('sitemap.missing-route', route, 'indexable route missing from the sitemap');
  }
  const distSitemap = readText(join(DIST, 'sitemap.xml'));
  if (distSitemap != null && distSitemap !== sitemapXml) report.warn('sitemap.stale-dist', null, 'dist/sitemap.xml differs from public/sitemap.xml (dist is stale — rebuild)');
}

/* ------------------------------------------- content-hash guard (§3.2) */
// lastmod (and the IndexNow pings that key off it) must move when a page's
// copy moves. scripts/seo-content-hashes.json records, per indexable route,
// a hash of the visible <main> text and the `updated` date it was recorded
// with. Text changed + same `updated` = a lastmod that lies. `updated` is
// read from dist/sitemap.xml first: it was built with this HTML, so it is the
// lastmod these pages were published with (src/ may be ahead of dist/).
const distSitemapXml = readText(join(DIST, 'sitemap.xml'));
const distLastmod = new Map(
  (distSitemapXml ? parseSitemap(distSitemapXml).urls : [])
    .filter((u) => u.loc && u.loc.startsWith(SITE_URL) && u.lastmod)
    .map((u) => [cleanPath(u.loc.slice(SITE_URL.length) || '/'), u.lastmod.slice(0, 10)])
);
const routeUpdated = new Map(
  (Array.isArray(headModel.SITE_ROUTES) ? headModel.SITE_ROUTES : [])
    .filter((r) => r && r.path && r.lastmod)
    .map((r) => [cleanPath(r.path), String(r.lastmod).slice(0, 10)])
);
const updatedOf = (route) => distLastmod.get(route) || routeUpdated.get(route) || sitemapLastmod.get(route) || null;
// Indexable = in the sitemap built with this dist/ (or indexable per src/).
const hashedPages = [...pages.values()].filter((p) => p.mainHash && (distLastmod.has(p.route) || p.indexable));
const recordedHashes = existsSync(CONTENT_HASHES_FILE) ? readJsonFile('scripts/seo-content-hashes.json') : null;
let hashesChanged = 0;
if (!recordedHashes || typeof recordedHashes !== 'object') {
  if (!UPDATE_HASHES) report.info('sitemap.hash-missing', null, 'scripts/seo-content-hashes.json not found — run the audit with --update-hashes to record');
} else {
  const missing = [];
  for (const page of hashedPages) {
    const recorded = recordedHashes[page.route];
    const updated = updatedOf(page.route);
    if (!recorded || !recorded.hash) {
      missing.push(page.route);
      continue;
    }
    if (recorded.hash !== page.mainHash || recorded.updated !== updated) hashesChanged += 1;
    const textChanged = recorded.hash !== page.mainHash;
    if (textChanged && recorded.updated === updated) {
      report.warn('sitemap.stale-updated', page.route, `<main> text changed since it was recorded, but "updated" is still ${updated || '(none)'} — bump "updated", rebuild, then run the audit with --update-hashes`);
    } else if (recorded.updated !== updated && !UPDATE_HASHES) {
      report.info('sitemap.hash-outdated', page.route, `${textChanged ? '<main> text changed and ' : 'no <main> text change; '}updated ${recorded.updated} -> ${updated} — run the audit with --update-hashes to record`);
    }
  }
  if (missing.length && !UPDATE_HASHES) {
    report.info('sitemap.hash-missing', null, `${missing.length} indexable route(s) without a recorded hash (new pages): ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? ', …' : ''} — run the audit with --update-hashes`, missing);
  }
}
if (UPDATE_HASHES && hashedPages.length) {
  const next = {};
  for (const page of [...hashedPages].sort((a, b) => a.route.localeCompare(b.route))) {
    next[page.route] = { hash: page.mainHash, updated: updatedOf(page.route) };
  }
  writeFileSync(CONTENT_HASHES_FILE, `${JSON.stringify(next, null, 2)}\n`);
}

/* ------------------------------------------ yearly refresh guard (§8/§9) */
const NOW = new Date();
const MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const isoDay = (date) => date.toISOString().slice(0, 10);
/** The latest date a free-text period names ("October 2026", "2025-2026", "2026-10"); a bare year counts as December. */
function periodEnd(text) {
  let latest = null;
  const s = String(text || '').toLowerCase();
  for (const m of s.matchAll(/\b(?:(january|february|march|april|may|june|july|august|september|october|november|december)\s+)?(20\d{2})(?:-(\d{2}))?\b/g)) {
    const month = m[1] ? MONTH_NAMES.indexOf(m[1]) : m[3] ? Number(m[3]) - 1 : 11;
    const date = new Date(Date.UTC(Number(m[2]), Math.min(Math.max(month, 0), 11), 1));
    if (!latest || date > latest) latest = date;
  }
  return latest;
}
const monthsAgo = (months) => {
  const d = new Date(NOW);
  d.setMonth(d.getMonth() - months);
  return d;
};
const costCutoff = monthsAgo(COST_GUIDE_STALE_MONTHS);
const sourceCutoff = isoDay(new Date(NOW.getTime() - SOURCE_STALE_DAYS * 86400000));
const liveGuides = Array.isArray(headModel.LIVE_COST_GUIDES) ? headModel.LIVE_COST_GUIDES : [];
for (const guide of liveGuides) {
  if (!guide || !guide.path) continue;
  const seoFields = guide.seo || {};
  const problems = [];
  const updated = /^\d{4}-\d{2}-\d{2}/.test(String(seoFields.updated || '')) ? new Date(`${String(seoFields.updated).slice(0, 10)}T00:00:00Z`) : null;
  if (updated && updated < costCutoff) problems.push(`updated ${isoDay(updated)} is more than ${COST_GUIDE_STALE_MONTHS} months old`);
  const period = guide.dataBasis && guide.dataBasis.period;
  const periodDate = periodEnd(period);
  if (periodDate && periodDate < costCutoff) problems.push(`data period "${period}" is more than ${COST_GUIDE_STALE_MONTHS} months old`);
  const titleYear = Number((String(seoFields.title || '').match(/\b(20\d{2})\b/) || [])[1]);
  if (titleYear && NOW.getMonth() > 0 && titleYear < NOW.getFullYear()) problems.push(`title year ${titleYear} is behind ${NOW.getFullYear()}`);
  if (problems.length) report.warn('content.stale-cost-guide', guide.path, `${problems.join('; ')} — refresh the prices from the estimator, then the title year, period and updated`);
}
const sourcedPages = [
  ...liveGuides.map((guide) => [guide.path, guide.sources]),
  ...BLOG_POSTS.filter((post) => post && post.slug && (post.status || 'published') !== 'draft').map((post) => [`/blog/${post.slug}`, post.sources]),
];
for (const [route, sources] of sourcedPages) {
  const stale = (Array.isArray(sources) ? sources : [])
    .map((s) => String((s && s.accessed) || '').slice(0, 10))
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d < sourceCutoff)
    .sort();
  if (stale.length) report.warn('content.stale-source', route, `${stale.length} source(s) last verified more than ${SOURCE_STALE_DAYS} days ago (oldest ${stale[0]}) — re-check them and update "accessed"`);
}
// Review-by dates (blog-raw "reviewBy"): a post with facts tied to a date (an
// event, a season, a program year, a monthly figure) warns once it has passed.
const todayIso = isoDay(NOW);
for (const post of BLOG_POSTS) {
  if (!post || !post.slug || (post.status || 'published') === 'draft') continue;
  const reviewBy = String(post.reviewBy || '').slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(reviewBy) && todayIso > reviewBy) {
    report.warn('content.review-due', `/blog/${post.slug}`, `review-by date ${reviewBy} has passed — re-check its dated facts, then set a new "reviewBy" in blog-raw/posts/${post.slug}.json`);
  }
}

/* ------------------------------------------------- fact drift (§12) */
// Pages read their timelines from src/data/facts.js; blog posts keep their own
// wording, so any page or post that gives a service a different range warns.
if (facts.TIMELINES) for (const page of pages.values()) checkTimelineDrift(page, facts.TIMELINES, report);

/* --------------------------- service area: lists and community pages */
// Visible <main> text, leaving out the elements in `skip` (whole subtrees).
function mainTextWithout(page, skip) {
  const parts = [];
  let cursor = page.main.start;
  for (const el of [...skip].sort((a, b) => a.start - b.start)) {
    if (el.end <= cursor || el.start >= page.main.end) continue;
    parts.push(textBetween(page.doc, cursor, el.start, ' '));
    cursor = el.end;
  }
  parts.push(textBetween(page.doc, cursor, page.main.end, ' '));
  return parts.join(' ').replace(/\s+/g, ' ');
}

// src/data/areas.js holds the one list of communities. A page whose <main>
// names three or more of the confirmed nearby communities, but not all of
// them, most likely carries a hand-typed list that has drifted from it (a
// community confirmed or dropped since): write the list from areas.js
// (NEARBY_AREAS_TEXT…). Community pages name their own community, and the
// /service-areas cards (#communities) one community each, so those are left out.
const NEARBY_AREA_NAMES = Array.isArray(siteConfig.NEARBY_AREA_NAMES) ? siteConfig.NEARBY_AREA_NAMES : [];
const PARTIAL_LIST_MIN = 3;
const escapeRe = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const AREA_NAME_RES = NEARBY_AREA_NAMES.map((name) => [name, new RegExp(`(?<!\\p{L})${escapeRe(name)}(?!\\p{L})`, 'u')]);
if (NEARBY_AREA_NAMES.length > PARTIAL_LIST_MIN) {
  for (const page of pages.values()) {
    if (page.route.startsWith('/service-areas/')) continue;
    const skip = page.route === '/service-areas' ? page.doc.elements.filter((el) => el.attrs.id === 'communities') : [];
    const text = mainTextWithout(page, skip);
    const named = AREA_NAME_RES.filter(([, re]) => re.test(text)).map(([name]) => name);
    if (named.length >= PARTIAL_LIST_MIN && named.length < NEARBY_AREA_NAMES.length) {
      const missing = NEARBY_AREA_NAMES.filter((name) => !named.includes(name));
      report.warn('areas.partial-list', page.route, `<main> names ${named.length} of the ${NEARBY_AREA_NAMES.length} nearby communities but not ${missing.join(', ')} — build the list from src/data/areas.js`);
    }
  }
}

// Community pages (plan D9). serviceAreasContent.js passesAreaGate() keeps
// /service-areas/<slug> unrouted until its entry is published, three
// published case studies are set there and the owner has signed it off; this
// re-checks every prerendered one and adds what only the built page shows:
// 600+ words of its own (text blocks in <main> that appear on no other page)
// and its sources.
const AREA_PAGE_MIN_CASE_STUDIES = Number(areasContent.AREA_PAGE_MIN_CASE_STUDIES) || 3;
const AREA_PAGE_MIN_UNIQUE_WORDS = 600;
const TEXT_BLOCK_TAGS = new Set(['p', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'td', 'th', 'figcaption']);
/** The outermost text blocks in <main>, as normalised strings. */
function mainTextBlocks(page) {
  const inMain = page.doc.elements.filter((el) => TEXT_BLOCK_TAGS.has(el.tag) && isInside(el, page.main));
  return inMain
    .filter((el) => !ancestors(page.doc, el).some((a) => TEXT_BLOCK_TAGS.has(a.tag)))
    .map((el) => textOf(page.doc, el))
    .filter(Boolean);
}
const areaPages = [...pages.values()].filter((page) => /^\/service-areas\/[^/]+$/.test(page.route));
if (areaPages.length) {
  const areaEntries = (areasContent.SERVICE_AREAS_CONTENT && areasContent.SERVICE_AREAS_CONTENT.areas) || {};
  const blockOwners = new Map(); // block text -> Set(routes)
  for (const page of pages.values()) {
    for (const block of new Set(mainTextBlocks(page))) {
      if (!blockOwners.has(block)) blockOwners.set(block, new Set());
      blockOwners.get(block).add(page.route);
    }
  }
  for (const page of areaPages) {
    const slug = page.route.slice('/service-areas/'.length);
    const entry = areaEntries[slug] || {};
    const problems = [];
    const studies = typeof caseStudyData.caseStudiesForArea === 'function' ? caseStudyData.caseStudiesForArea(slug).length : 0;
    if (studies < AREA_PAGE_MIN_CASE_STUDIES) problems.push(`${studies} published case stud${studies === 1 ? 'y' : 'ies'} in this community (need ≥${AREA_PAGE_MIN_CASE_STUDIES})`);
    const ownWords = mainTextBlocks(page)
      .filter((block) => blockOwners.get(block).size === 1)
      .reduce((sum, block) => sum + wordCount(block), 0);
    if (ownWords < AREA_PAGE_MIN_UNIQUE_WORDS) problems.push(`${ownWords} words of its own in <main> (need ≥${AREA_PAGE_MIN_UNIQUE_WORDS})`);
    const hasSourcesList = byTag(page.doc, 'ol').some((el) => classesOf(el).has('blog-sources') && isInside(el, page.main));
    if (!Array.isArray(entry.sources) || !entry.sources.length || !hasSourcesList) problems.push('no sources for its local facts');
    const signoff = entry.ownerSignoff;
    if (!signoff || !signoff.name || !signoff.date) problems.push('no owner sign-off');
    if (problems.length) report.error('areas.page-gate', page.route, `community page prerendered without the D9 gate: ${problems.join('; ')}`);
  }
}

/* ---------------------------------------------------------- llms files */
// The llms files use markdown links with absolute URLs on purpose; a link to a
// relative path is page copy whose inline markup was not stripped.
for (const name of ['llms.txt', 'llms-full.txt']) {
  const text = readText(join(ROOT, 'public', name));
  const m = text && /\[[^\]\n]+\]\(\/[^)\s]*\)/.exec(text);
  if (m) report.error('content.raw-markup', null, `public/${name} carries page markup with a relative link: "${shortUrl(m[0])}"`);
}

/* -------------------------------------------------------------- robots */
if (robotsTxt == null) {
  report.error('robots.missing', null, 'public/robots.txt not found');
} else {
  const robots = parseRobots(robotsTxt);
  // '*' always; named search bots only when they have their own group.
  const agents = ['*', 'googlebot', 'bingbot'].filter((a) => a === '*' || robots.groups.some((g) => g.agents.includes(a)));
  for (const agent of agents) {
    const blocked = [...(INDEXABLE.size ? INDEXABLE : PRERENDER_SET)]
      .map((route) => [route, robotsAllows(robots, agent, route)])
      .filter(([, verdict]) => verdict !== true);
    for (const [route, rule] of blocked) report.error('robots.blocks-route', route, `blocked for ${agent} by "Disallow: ${rule.path}"`);
  }
  const wanted = `${SITE_URL}/sitemap.xml`;
  if (!robots.sitemaps.length) report.warn('robots.sitemap-line', null, `no "Sitemap: ${wanted}" line`);
  else if (!robots.sitemaps.includes(wanted)) report.warn('robots.sitemap-line', null, `Sitemap line(s) ${robots.sitemaps.join(', ')} — expected ${wanted}`);
  if (/^\s*Disallow:\s*\/404\.html\s*$/im.test(robotsTxt)) report.warn('robots.legacy-rule', null, '"Disallow: /404.html" (plan §3.1: remove)');
  if (robots.groups.some((g) => g.agents.includes('anthropic-ai'))) report.warn('robots.legacy-rule', null, '"User-agent: anthropic-ai" is obsolete (plan §3.1: remove)');
  const distRobots = readText(join(DIST, 'robots.txt'));
  if (distRobots != null && distRobots !== robotsTxt) report.warn('robots.stale-dist', null, 'dist/robots.txt differs from public/robots.txt (dist is stale — rebuild)');
}

/* ----------------------------------------------------------- redirects */
if (vercelConfig) {
  if (!REDIRECTS.length) report.warn('redirects.missing-config', null, 'vercel.json has no redirects — legacy Wix URLs still 404 (plan §1)');
  // Short links to Google (src/data/redirects.js EXTERNAL_REDIRECTS): off-site
  // on purpose, so their destination is not a route of this site.
  const external = normaliseRedirectList(redirectsModule.EXTERNAL_REDIRECTS);
  const externalBySource = new Map(external.map((e) => [cleanPath(unescapeSource(e.from)), e]));
  const literalSeen = new Map();
  const patternSeen = new Map();
  for (const r of REDIRECTS) {
    const label = `${r.source} -> ${r.destination}`;
    if (r.status === 307 || r.status === 302) report.info('redirects.temporary', null, `${label} (${r.status})`);

    // Duplicates.
    const key = r.literal || unescapeSource(r.source);
    const seen = r.literal ? literalSeen : patternSeen;
    const dupKey = `${key}|${r.hasConditions ? JSON.stringify(r.raw.has) : ''}`;
    if (seen.has(dupKey)) report.error('redirects.duplicate-source', null, `"${r.source}" appears more than once`);
    seen.set(dupKey, r);

    // Source must not shadow a live route.
    if (!r.hasConditions) {
      if (r.literal && PRERENDER_SET.has(r.literal)) report.error('redirects.source-is-route', r.literal, `redirect source is a prerendered route (${label})`);
      else if (r.literal && [...PRERENDER_SET].some((p) => p.toLowerCase() === r.literal.toLowerCase())) {
        report.warn('redirects.source-is-route', r.literal, `differs from a prerendered route only by case (${label})`);
      }
      if (r.pattern) {
        const shadowed = PRERENDER.filter((p) => r.pattern.test(p));
        if (shadowed.length) report.error('redirects.source-is-route', null, `pattern "${r.source}" matches prerendered route(s): ${shadowed.slice(0, 5).join(', ')}`);
      }
    }

    // Destination must be a live, indexable route (or '/', or a static file).
    const dest = String(r.destination || '');
    if (/(^|\/):[A-Za-z_]|\$\d/.test(dest)) {
      report.info('redirects.destination-pattern', null, `${label} — pattern destination not checked`);
      continue;
    }
    const target = classifyHref(dest, SITE_URL);
    if (!target) {
      report.error('redirects.destination', null, `${label} — destination is not a URL`);
      continue;
    }
    if (!target.internal) {
      const declared = r.literal && !r.hasConditions ? externalBySource.get(r.literal) : null;
      if (declared && declared.to === dest) report.info('redirects.external', r.literal, `${label} (${r.status}) — short link declared in EXTERNAL_REDIRECTS`);
      else report.warn('redirects.destination', null, `${label} — destination is off-site`);
      continue;
    }
    if (/[?&]category=/.test(target.query)) report.warn('redirects.destination', target.path, `${label} — destination carries ?category=`);
    const live = target.path === '/' || (PRERENDER_SET.has(target.path) && (!SEO_AVAILABLE || INDEXABLE.has(target.path)));
    if (!live && !distStaticExists(target.path) && !/\.(xml|txt)$/.test(target.path)) {
      const why = NOINDEX.has(target.path) ? 'is noindex' : PRERENDER_SET.has(target.path) ? 'is not indexable' : 'is not a prerendered route';
      report.error('redirects.destination', target.path, `${label} — destination ${why}`);
    }

    // Chains / loops.
    if (!r.hasConditions) {
      const next = redirectSourceMatches(target.path).filter((other) => other !== r);
      if (next.length) report.error('redirects.chain', null, `${label} -> ${next[0].destination} (chain${next[0].literal === r.literal ? '/loop' : ''})`);
    }
  }

  // src/data/redirects.js is the source; vercel.json is generated from it.
  const managed = normaliseRedirectList(redirectsModule.REDIRECTS);
  const blogRedirects = normaliseRedirectList(blogModule.BLOG_REDIRECTS, { slugBase: '/blog' });
  const vercelLiteral = new Set(REDIRECTS.map((r) => r.literal).filter(Boolean));
  const vercelPatterns = new Set(REDIRECTS.filter((r) => !r.literal).map((r) => unescapeSource(r.source)));
  const coveredByVercel = (from) => {
    const raw = unescapeSource(from);
    return isPatternSource(from) ? vercelPatterns.has(raw) : vercelLiteral.has(cleanPath(raw)) || redirectSourceMatches(cleanPath(raw)).length > 0;
  };
  const nowMs = Date.now();
  for (const entry of managed) {
    // A planned rule without fallback (`to: null`) is only written once its
    // planned page is live (sync-redirects C8); until then the source is
    // still a live page, so there is nothing to sync yet.
    const pending = entry.raw && entry.raw.to == null && typeof entry.raw.planned === 'string' && !PRERENDER_SET.has(cleanPath(entry.raw.planned));
    if (pending) {
      report.info('redirects.pending', cleanPath(unescapeSource(entry.from)), `waits for ${entry.raw.planned} to go live`);
      continue;
    }
    if (!coveredByVercel(entry.from)) report.error('redirects.not-synced', cleanPath(unescapeSource(entry.from)), `in src/data/redirects.js but not in vercel.json (run scripts/sync-redirects.mjs)`);
    if (entry.temporary && entry.since) {
      const ageDays = (nowMs - Date.parse(entry.since)) / 86400000;
      if (ageDays > STALE_307_DAYS) report.warn('redirects.stale-temporary', entry.from, `307 since ${entry.since} (${Math.floor(ageDays)} days) — flip to 308 or retarget`);
    }
  }
  for (const entry of blogRedirects) {
    const from = cleanPath(unescapeSource(entry.from));
    if (!redirectSourceMatches(from).length) report.error('redirects.blog-not-redirected', from, `retired post (BLOG_REDIRECTS -> ${entry.to || '?'}) has no vercel.json redirect`);
  }
  // Short links: the vercel.json rule must carry the same absolute destination.
  for (const [from, entry] of externalBySource) {
    const rule = REDIRECTS.find((r) => !r.hasConditions && r.literal === from);
    if (!rule) report.error('redirects.not-synced', from, `in src/data/redirects.js EXTERNAL_REDIRECTS but not in vercel.json (run scripts/sync-redirects.mjs)`);
    else if (rule.destination !== entry.to || rule.status !== 307) {
      report.error('redirects.not-synced', from, `vercel.json has ${rule.status} -> ${rule.destination}, EXTERNAL_REDIRECTS says 307 -> ${entry.to} (run scripts/sync-redirects.mjs)`);
    }
  }
  if (Array.isArray(redirectsModule.REDIRECTS) || (redirectsModule.REDIRECTS && typeof redirectsModule.REDIRECTS === 'object')) {
    const known = new Set([...managed, ...blogRedirects, ...external].map((e) => (isPatternSource(e.from) ? unescapeSource(e.from) : cleanPath(unescapeSource(e.from)))));
    for (const r of REDIRECTS) {
      if (r.hasConditions) continue;
      const key = r.literal || unescapeSource(r.source);
      if (!known.has(key)) report.warn('redirects.unmanaged', key, `vercel.json redirect not declared in src/data/redirects.js (hand edits are overwritten by sync)`);
    }
  }
}

/* ---------------------------------------------- internal link graph */
const inbound = new Map(); // target route -> Set(source routes) from <main>
for (const page of pages.values()) {
  const reported = new Set();
  for (const link of page.links) {
    const { path } = link;
    const once = (code, message) => {
      const k = `${code}|${path}${link.query}`;
      if (reported.has(k)) return;
      reported.add(k);
      report.warn(code, page.route, message);
    };
    if (/[?&]category=/.test(link.query)) once('links.category-query', `links to ${path}${link.query}`);
    const isRoute = PRERENDER_SET.has(path) || path === '/';
    if (!isRoute) {
      if (redirectSourceMatches(path).length) once('links.to-redirect', `links to redirect source ${path}`);
      else if (!distStaticExists(path)) once('links.broken', `links to ${path} (no prerendered page or file)`);
      continue;
    }
    if (link.inMain && path !== page.route) {
      if (!inbound.has(path)) inbound.set(path, new Set());
      inbound.get(path).add(page.route);
      if (NOINDEX.has(path) && !LEGAL_ROUTES.has(page.route)) once('links.to-noindex', `contextual link to noindex page ${path}`);
    }
  }
}
// /projects shows design ideas, not Bridgeland's work, until the first case
// study is published (caseStudyData.js). Pages should not link it in body copy
// just to raise its count, so it is not checked before then.
const PUBLISHED_CASE_STUDIES =
  typeof caseStudyData.publishedCaseStudies === 'function' ? caseStudyData.publishedCaseStudies().length : 0;
for (const page of pages.values()) {
  page.stats.inboundContextual = inbound.has(page.route) ? inbound.get(page.route).size : 0;
  if (!page.indexable || page.route === '/') continue;
  if (page.route === '/projects' && PUBLISHED_CASE_STUDIES === 0) continue;
  const n = page.stats.inboundContextual;
  const severity = LEGAL_ROUTES.has(page.route) ? 'info' : 'warn';
  if (n === 0) report.add(severity, 'links.orphan', page.route, 'no contextual links from other pages\' main content');
  else if (n < MIN_INBOUND) report.add(severity, 'links.few-inbound', page.route, `${n} contextual inbound link source(s) (want ≥${MIN_INBOUND})`);
}

/* --------------------------------------- duplicate titles/descriptions */
for (const [field, code] of [['title', 'head.duplicate-title'], ['description', 'head.duplicate-description']]) {
  const groups = new Map();
  for (const page of pages.values()) {
    if (!page.indexable || !page[field]) continue;
    const key = page[field].trim().toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(page.route);
  }
  for (const [value, routes] of groups) {
    if (routes.length > 1) report.warn(code, null, `${routes.join(', ')} share "${shortUrl(value)}"`);
  }
}

/* ------------------------------------------- duplicate question headings */
// Two indexable pages asking the same question in a page or section heading
// (<h1>/<h2> in <main>) compete for the same query, e.g. a service page
// repeating an H2 of the guide it links to. The guide keeps the question; the
// other page words its heading for its own intent ("Permits for your
// addition: what we coordinate"). <h3>s are left out: they are cards (a guide
// card repeats its post's title) and FAQ items. So is the shared CTA banner,
// whose heading is the same on every page by design.
const TEMPLATE_HEADING_CLASSES = ['cta-banner-section'];
const questionHeadings = new Map(); // normalised question -> [{ route, tag, text }]
for (const page of pages.values()) {
  if (!page.indexable) continue;
  for (const el of page.doc.elements) {
    if ((el.tag !== 'h1' && el.tag !== 'h2') || !isInside(el, page.main)) continue;
    const text = textOf(page.doc, el).replace(/\s+/g, ' ').trim();
    if (!text.endsWith('?')) continue;
    if (ancestors(page.doc, el).some((a) => TEMPLATE_HEADING_CLASSES.some((c) => classesOf(a).has(c)))) continue;
    const key = text.toLowerCase().replace(/[‘’]/g, "'");
    if (!questionHeadings.has(key)) questionHeadings.set(key, []);
    questionHeadings.get(key).push({ route: page.route, tag: el.tag, text });
  }
}
for (const found of questionHeadings.values()) {
  if (new Set(found.map((h) => h.route)).size < 2) continue;
  report.warn(
    'headings.duplicate-question',
    null,
    `"${found[0].text}" on ${found.map((h) => `${h.route} (${h.tag})`).join(', ')} — keep the question on the guide and word the other heading for its page's intent`
  );
}

/* --------------------------------------------------------- keyword map */
const keywordMapJson = readJsonFile('scripts/keyword-map.json');
if (keywordMapJson === undefined) {
  report.info('keywords.skipped', null, 'scripts/keyword-map.json not present — keyword checks skipped');
} else {
  const keywordListJson = readJsonFile('scripts/keyword-list.json');
  const livePages = new Map([...pages.values()].map((p) => [p.route, { title: p.title, h1: p.h1s[0] || '' }]));
  checkKeywords({
    list: keywordListJson === undefined ? null : readKeywordList(keywordListJson),
    map: readKeywordMap(keywordMapJson),
    pages: livePages,
    report,
  });
}

/* ------------------------------------------------------------- output */
const counts = report.counts();
const durationMs = Math.round(performance.now() - started);
const pageSummaries = [...pages.values()].map((p) => ({
  route: p.route,
  indexable: !!p.indexable,
  title: p.title,
  titleLength: p.stats.titleLength ?? null,
  descriptionLength: p.stats.descriptionLength ?? null,
  h1: p.h1s,
  mainCount: p.mainCount,
  jsonLdBlocks: p.blocks.length,
  faqItems: p.faq ? p.faq.length : 0,
  inboundContextual: p.stats.inboundContextual ?? 0,
  wixImages: p.stats.wixImages ?? 0,
  jsBrotliKb: p.stats.jsBrotliKb ?? null,
  jsServedKb: p.stats.jsServedKb ?? null,
  mainHash: p.mainHash ?? null,
  readingGrade: p.stats.readingGrade ?? null,
}));

writeJson(OUT_FILE, {
  generatedAt: new Date().toISOString(),
  siteUrl: SITE_URL,
  strict: STRICT,
  durationMs,
  counts,
  countsByCode: report.countsByCode(),
  routes: {
    prerendered: PRERENDER.length,
    seoEntries: seoEntries.size,
    indexable: INDEXABLE.size,
    noindex: [...NOINDEX],
    sitemap: sitemapPaths.size,
    redirects: REDIRECTS.length,
  },
  schemaTypes: schemaTypeCount,
  pages: pageSummaries,
  findings: report.findings,
});

console.log(`SEO audit — ${pages.size} prerendered pages${notFound ? ' + 404.html' : ''}, ${INDEXABLE.size} indexable, ${sitemapPaths.size} sitemap URLs, ${REDIRECTS.length} redirects`);
console.log(
  'schema types:',
  Object.entries(schemaTypeCount)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}×${v}`)
    .join(', ') || '(none)'
);
printReport(report, { verbose: VERBOSE });
if (UPDATE_HASHES) {
  console.log(
    hashedPages.length
      ? `\ncontent hashes: wrote ${hashedPages.length} routes to scripts/seo-content-hashes.json (${recordedHashes ? `${hashesChanged} changed` : 'new file'})`
      : '\ncontent hashes: no indexable pages in dist/ — scripts/seo-content-hashes.json not written'
  );
}
console.log(`\n${counts.error} errors, ${counts.warn} warnings, ${counts.info} info — ${durationMs} ms — ${OUT_FILE.slice(ROOT.length).replace(/\\/g, '/')}`);
if (counts.error && !STRICT) console.log('(warn mode: errors do not fail the build; run with --strict to enforce)');

if (STRICT && counts.error > 0) process.exitCode = 1;
