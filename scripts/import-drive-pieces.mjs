/**
 * Turns the client's edited Drive pieces into blog-raw/posts/<slug>.json, the
 * post format scripts/build-blog-data.mjs reads (its header lists the fields).
 * The inputs are not committed, because this repo is public: one Markdown file per
 * piece, <dir>/<id>.md, with front matter, in an untracked folder inside the repo
 * folder. EDITOR-RULES.md beside them describes the format.
 *
 *   node scripts/import-drive-pieces.mjs --from=<dir> --date=YYYY-MM-DD [options]
 *
 *   --from=<dir>            folder of <id>.md files (required)
 *   --date=YYYY-MM-DD       the post's date and updated (required)
 *   --status=published|draft  default draft, because a post without a status counts as published
 *   --order=<file>          JSON array of ids, first is listed first (listOrder)
 *   --ids=A01,B02           only these pieces
 *   --keywords              also merge the pieces into scripts/keyword-map.json
 *   --thumbs=<dir>          also copy <dir>/<id>.png to media-src/thumbnails/<slug>.png
 *   --force                 overwrite a post this script wrote earlier
 *   --allow-blank-accessed  test only, for unedited files: fills blank source dates with
 *                           --date and lets draft notes through with a warning. The site
 *                           prints that date as "verified", so never for a real import
 *   --dry-run               check and report, write nothing
 *
 * Anything that would fail the build or show raw markup on a page stops the run
 * before a single file is written, naming the id and line. The build's own
 * checks stay the last word: this only says it sooner, and says where.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { wordSet } from './lib/audit/keywords.mjs';
import { wordsOf } from './lib/audit/readability.mjs';
import { stripInline } from '../src/lib/inlineText.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const POSTS_DIR = join(ROOT, 'blog-raw', 'posts');
const THUMBNAILS = join(ROOT, 'media-src', 'thumbnails');
const KEYWORD_MAP = join(ROOT, 'scripts', 'keyword-map.json');

// Same limits as scripts/audit-seo.mjs and build-blog-data.mjs, which warn on them too.
const TITLE_MAX = 60;
const DESCRIPTION_MIN = 70;
const DESCRIPTION_MAX = 155;
const PARAGRAPH_MAX = 60;
const ANSWER_MIN = 40;
const ANSWER_MAX = 60;
// CATEGORY_SET in build-blog-data.mjs: a typo would become a filter pill on /blog.
const CATEGORIES = [
  'Costs & Budgets',
  'Permits & Planning',
  'Basements & Suites',
  'Kitchens & Baths',
  'Older Homes',
  'Hiring a Contractor',
  'Commercial',
  'Money & Rebates',
  'Landlords & Property Managers',
  'Winnipeg Market News',
];
// A primary keyword an older page holds as a lesser term, when the new post has
// become the dedicated page for it. Any other clash stops the run for a decision.
const KEYWORD_MOVES = {
  'office renovation cost winnipeg': '/blog/the-biggest-cost-factors-in-commercial-renovation-projects',
};

const OWN_DOMAIN = /https?:\/\/(?:www\.)?bridgelandbuilders\.com(?![\w.-])/i;
// The pattern src/lib/inline.jsx renders. Whatever it leaves behind shows literally on the page.
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
const LITERAL_MARKUP = [
  [/\*/, 'a star (italics or unbalanced bold)'],
  [/\]\(/, 'a link the site cannot read'],
  [/\\/, 'a backslash'],
  [/`/, 'a backtick'],
  [/(^|[\s(])_[^\s_][^_]*_(?=[\s).,:;]|$)/, 'underscore italics'],
  [/~~/, 'a strikethrough'],
  [/^#{1,6}\s/, 'a heading mark'],
  [/^>\s/, 'a quote mark'],
  [/^-{3,}$/, 'a horizontal rule'],
  [/\{accessed:/, 'a source date outside ## Sources'],
];
const HTML = /<\/?[a-z][^>\n]*>|&(?:[a-z][a-z0-9]*|#\d+);/i;
const PLACEHOLDER = /\[(?:[A-Z]{2,}[A-Z0-9 _-]*|Confirm|TODO)[^\]]*\]/;
const WHOLE_CELL_PLACEHOLDER = /^\[[A-Z]{2,}[A-Z0-9 _-]*\]$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const errors = [];
const warnings = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);
const warn = (code, where, message) => warnings.push({ code, where, message });

const isDate = (value) => DATE.test(value) && !Number.isNaN(Date.parse(value));
const fromRoot = (rel) => import(pathToFileURL(join(ROOT, rel)).href);
const short = (text) => (text.length > 70 ? `${text.slice(0, 70)}...` : text);

/* --------------------------------------------------------------- options */
const VALUE_OPTIONS = ['from', 'date', 'status', 'order', 'ids', 'thumbs'];
const FLAGS = ['keywords', 'force', 'allow-blank-accessed', 'dry-run'];
const args = process.argv.slice(2);
const option = (name) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};
const flag = (name) => args.includes(`--${name}`);

function stop(message) {
  console.error(`import-drive-pieces: ${message}`);
  process.exit(1);
}

for (const arg of args) {
  const known = FLAGS.some((name) => arg === `--${name}`) || VALUE_OPTIONS.some((name) => arg.startsWith(`--${name}=`));
  if (!known) stop(`unknown option ${arg}`);
}
const FROM = option('from');
const PUBLISH_DATE = option('date');
const STATUS = option('status') || 'draft';
if (!FROM || !existsSync(FROM)) stop('--from=<dir> is required and must exist');
if (!PUBLISH_DATE || !isDate(PUBLISH_DATE)) stop('--date=YYYY-MM-DD is required');
if (!['published', 'draft'].includes(STATUS)) stop('--status must be published or draft');
const DRY_RUN = flag('dry-run');
const TEST_RUN = flag('allow-blank-accessed');
const THUMBS_FROM = option('thumbs');
if (THUMBS_FROM && !existsSync(THUMBS_FROM)) stop(`--thumbs folder ${THUMBS_FROM} does not exist`);

const ORDER = option('order') ? JSON.parse(readFileSync(option('order'), 'utf8')) : null;
if (ORDER && !Array.isArray(ORDER)) stop('--order must be a JSON array of ids');

/* --------------------------------------------------------------- reading */
const FRONT_MATTER_KEYS = ['id', 'slug', 'title', 'metaTitle', 'metaDescription', 'excerpt', 'answer', 'primary', 'secondary', 'cats', 'services', 'ctaService', 'cluster', 'thumbAlt', 'reviewBy'];
const listOf = (value) => String(value || '').split('|').map((item) => item.trim()).filter(Boolean);
// Markdown escapes the Docs export left behind: "1\." and "\\[AMOUNT\\]".
const unescapeMarkdown = (text) => text.replace(/\\+([\\`*_{}[\]()#+\-.!|~$<>])/g, '$1');

/** A piece's front matter and body lines, each with its line number in the file. */
function readPiece(id) {
  const file = join(FROM, `${id}.md`);
  const lines = readFileSync(file, 'utf8').replace(/^﻿/, '').replace(/\r/g, '').split('\n');
  const piece = { id, fields: {}, lineOf: {}, body: [] };
  if (lines[0].trim() !== '---') {
    fail(`${id}:1`, 'the file must start with front matter (---)');
    return piece;
  }
  const close = lines.indexOf('---', 1);
  if (close < 0) {
    fail(`${id}:1`, 'the front matter is never closed (---)');
    return piece;
  }
  for (let i = 1; i < close; i += 1) {
    const colon = lines[i].indexOf(':');
    if (colon < 0) {
      if (lines[i].trim()) fail(`${id}:${i + 1}`, `front matter line without a key: "${short(lines[i])}"`);
      continue;
    }
    const key = lines[i].slice(0, colon).trim();
    if (!FRONT_MATTER_KEYS.includes(key)) warn('unknown-field', `${id}:${i + 1}`, `unknown front matter field "${key}" is ignored`);
    piece.fields[key] = lines[i].slice(colon + 1).trim();
    piece.lineOf[key] = i + 1;
  }
  for (let i = close + 1; i < lines.length; i += 1) piece.body.push({ text: lines[i], line: i + 1 });
  return piece;
}

/** Table lines as { head, rows }, with escapes gone and whole-cell bold dropped where the cell is a header anyway. */
function parseTable(id, tableLines) {
  const cellsOf = ({ text }) =>
    text.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((cell) => unescapeMarkdown(cell.trim()));
  const isRule = (cells) => cells.every((cell) => /^:?-+:?$/.test(cell));
  const unbold = (cell) => cell.replace(/^\*\*([^*]+)\*\*$/, '$1');
  const [first, rule, ...rest] = tableLines;
  const where = `${id}:${first.line}`;
  if (!rule || !isRule(cellsOf(rule))) {
    fail(where, 'a table needs a head row and a --- row under it');
    return null;
  }
  const head = cellsOf(first).map(unbold);
  const rows = rest.map((line) => {
    const cells = cellsOf(line);
    if (cells.length !== head.length) fail(`${id}:${line.line}`, `table row has ${cells.length} cells, its head has ${head.length}`);
    return cells.map((cell, index) => {
      if (WHOLE_CELL_PLACEHOLDER.test(cell)) {
        // A fill-in worksheet column: an empty cell is what the reader fills in.
        warn('blank-worksheet-cell', `${id}:${line.line}`, `placeholder ${cell} becomes an empty cell`);
        return '';
      }
      return index === 0 ? unbold(cell) : cell;
    });
  });
  return { block: { t: 'table', head, rows }, line: first.line };
}

/** Body lines to blocks (each with its line, removed before writing) and sources. */
function parseBody(piece) {
  const { id, body } = piece;
  const blocks = [];
  const sources = [];
  let inSources = false;
  // The block a following text line continues: Markdown only ends one at a blank line.
  let open = null;
  for (let i = 0; i < body.length; i += 1) {
    const { text: raw, line } = body[i];
    const where = `${id}:${line}`;
    const text = raw.trim();
    if (!text) {
      open = null;
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(text);
    if (heading && /^sources$/i.test(heading[2].replace(/\*/g, '').trim())) {
      inSources = true;
      open = null;
      continue;
    }
    if (inSources) {
      if (heading) fail(where, '## Sources must be the last section');
      else parseSource(piece, text, where, sources);
      continue;
    }
    if (heading) {
      open = null;
      const level = heading[1].length;
      if (level === 1) fail(where, 'a # heading: the H1 is the title field');
      else if (level > 4) fail(where, `a heading of level ${level}: the site has h2, h3 and h4`);
      else blocks.push({ t: `h${level}`, x: unescapeMarkdown(heading[2]), line });
      continue;
    }
    if (text.startsWith('|')) {
      const tableLines = [];
      while (i < body.length && body[i].text.trim().startsWith('|')) tableLines.push(body[i++]);
      i -= 1;
      const table = parseTable(id, tableLines);
      if (table) blocks.push({ ...table.block, line: table.line });
      open = null;
      continue;
    }
    if (/^\s+([-*+]|\d+[.)])\s/.test(raw)) {
      fail(where, 'a nested list: the site has flat lists only');
      continue;
    }
    const bullet = /^[-*+]\s+(.*)$/.exec(text);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(text);
    if (bullet || numbered) {
      open = { t: bullet ? 'li' : 'oli', x: unescapeMarkdown((bullet || numbered)[1]), line };
      blocks.push(open);
      continue;
    }
    if (open) {
      open.x = `${open.x} ${unescapeMarkdown(text)}`;
      continue;
    }
    open = { t: 'p', x: unescapeMarkdown(text), line };
    blocks.push(open);
  }
  piece.blocks = blocks;
  piece.sources = sources;
}

function parseSource(piece, text, where, sources) {
  const m = /^[-*+]\s+\[([^\]]+)\]\((\S+)\)\s*\{accessed:\s*([^}]*)\}$/.exec(text);
  if (!m) {
    fail(where, `a source line must read - [Label](https://url) {accessed: YYYY-MM-DD}: "${short(text)}"`);
    return;
  }
  const [, labelRaw, url] = m;
  const label = unescapeMarkdown(labelRaw);
  let accessed = m[3].trim();
  if (!accessed) {
    if (!TEST_RUN) fail(where, `blank accessed date for ${url}: the site prints it publicly as "verified"`);
    accessed = PUBLISH_DATE;
  } else if (!isDate(accessed)) {
    fail(where, `accessed "${accessed}" is not a YYYY-MM-DD date`);
  } else if (accessed > PUBLISH_DATE) {
    fail(where, `accessed ${accessed} is after the publish date`);
  }
  if (OWN_DOMAIN.test(url)) fail(where, `source ${url} is this site`);
  else if (!url.startsWith('https://')) fail(where, `source ${url} must be https`);
  if (/[*[\]<>`]/.test(label)) fail(where, `markup in the source label: "${short(label)}"`);
  if (sources.some((source) => source.url === url)) {
    // The page keys its source list by URL, and a repeat says nothing new.
    warn('duplicate-source', where, `${url} is listed twice; the repeat is dropped`);
    return;
  }
  sources.push({ label, url, accessed });
}

/* ------------------------------------------------------------- site pages */
const { SERVICES } = await fromRoot('src/data/services.js');
const seo = await fromRoot('src/data/seo.js');
const { REDIRECTS } = await fromRoot('src/data/redirects.js');
const { COST_GUIDES } = await fromRoot('src/data/costGuides/index.js');
const { publishedServiceAreas } = await fromRoot('src/data/serviceAreasContent.js');
const { publishedCaseStudies, caseStudyPath } = await fromRoot('src/data/caseStudies.js');
const { publishedVideos, videoPath } = await fromRoot('src/data/videos.js');

const cleanPath = (path) => (path.length > 1 ? path.replace(/\/+$/, '') : path);
const existingPosts = readdirSync(POSTS_DIR)
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(join(POSTS_DIR, file), 'utf8')));
const statusOf = (post) => post.status || 'published';

const knownPages = new Set(
  [
    ...Object.keys(seo.PAGE_SEO || {}),
    ...Object.keys(seo.SERVICE_SEO || {}),
    ...SERVICES.filter((service) => service.status === 'live').map((service) => service.path),
    ...COST_GUIDES.filter((guide) => guide.status === 'live').map((guide) => guide.path),
    ...publishedServiceAreas().map((area) => area.path),
    ...publishedCaseStudies().map((study) => caseStudyPath(study)),
    ...publishedVideos().map((video) => videoPath(video)),
  ].map(cleanPath)
);
const noindexPages = new Set((seo.NOINDEX_ROUTES || []).map(cleanPath));
const draftPages = new Set([
  ...SERVICES.filter((service) => service.status !== 'live').map((service) => service.path),
  ...COST_GUIDES.filter((guide) => guide.status !== 'live').map((guide) => guide.path),
]);
const redirectSources = new Set([
  ...existingPosts.filter((post) => statusOf(post) !== 'published' && post.redirectTo).map((post) => `/blog/${post.slug}`),
  ...REDIRECTS.map((rule) => rule && rule.from).filter((from) => typeof from === 'string' && !from.includes(':')).map(cleanPath),
]);

/** Filled in once the pieces are read: the posts that will be live after this run. */
const linkablePosts = new Set();

function checkLink(where, href) {
  if (OWN_DOMAIN.test(href)) return; // reported with the line's text
  if (!href.startsWith('/')) {
    if (!/^(https:\/\/|mailto:|tel:)/.test(href)) fail(where, `link "${href}" must be a /path, https://, mailto: or tel: URL`);
    return;
  }
  if (href.includes('?')) {
    fail(where, `link ${href} carries a query string`);
    return;
  }
  const path = cleanPath(href.split('#')[0] || '/');
  if (redirectSources.has(path)) fail(where, `link ${path} is a redirect source: link its target`);
  else if (noindexPages.has(path)) fail(where, `link ${path} is a noindex page`);
  else if (draftPages.has(path)) fail(where, `link ${path} is a draft page`);
  else if (path.startsWith('/blog/') && !linkablePosts.has(path)) fail(where, `link ${path}: no such post will be published`);
  else if (!path.startsWith('/blog/') && !knownPages.has(path)) fail(where, `link ${path} is not a page on the site`);
}

/** Text as src/lib/inline.jsx shows it. Collects the links it would render. */
function shownText(text, hrefs) {
  return String(text).replace(INLINE, (whole, label, href, bold) => {
    if (label === undefined) return shownText(bold, hrefs);
    hrefs.push(href);
    return shownText(label, hrefs);
  });
}

/** Checks one piece of inline text the page will render with renderInline. */
function checkInline(where, text) {
  if (OWN_DOMAIN.test(text)) fail(where, `own-domain absolute link: use the /path ("${short(text.match(OWN_DOMAIN)[0])}...")`);
  if (HTML.test(text)) fail(where, `HTML: "${short(text.match(HTML)[0])}"`);
  const hrefs = [];
  const shown = shownText(text, hrefs);
  hrefs.forEach((href) => checkLink(where, href));
  for (const [pattern, what] of LITERAL_MARKUP) {
    if (pattern.test(shown)) fail(where, `${what} would show literally: "${short(shown)}"`);
  }
  if (PLACEHOLDER.test(shown)) {
    const message = `placeholder ${short(shown.match(PLACEHOLDER)[0])} would show literally`;
    if (TEST_RUN) warn('placeholder', where, message);
    else fail(where, message);
  }
  if (/https?:\/\//.test(shown)) warn('bare-url', where, `a bare URL shows as plain text: "${short(shown)}"`);
  if (shown.includes('—')) warn('em-dash', where, `em dash: "${short(shown)}"`);
  return shown;
}

/* ------------------------------------------------------------- validating */
function checkFields(piece) {
  const { id, fields, lineOf } = piece;
  const at = (key) => `${id}:${lineOf[key] || 1}`;
  if (fields.id !== id) fail(at('id'), `id "${fields.id}" does not match the file name`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.slug || '')) fail(at('slug'), `slug "${fields.slug}" is not a URL slug`);
  for (const key of ['title', 'metaTitle', 'metaDescription', 'excerpt', 'primary', 'cats', 'cluster', 'thumbAlt']) {
    if (!fields[key]) fail(at(key), `${key} is empty`);
  }
  // Rendered as plain text, so markup here would show literally.
  for (const key of ['title', 'metaTitle', 'metaDescription', 'excerpt', 'thumbAlt']) {
    if (/[*[\]`]/.test(fields[key] || '') || HTML.test(fields[key] || '')) fail(at(key), `markup in ${key}: "${short(fields[key])}"`);
    if (OWN_DOMAIN.test(fields[key] || '')) fail(at(key), `own-domain link in ${key}`);
    if ((fields[key] || '').includes('—')) warn('em-dash', at(key), `em dash in ${key}`);
  }
  const titleLength = [...(fields.metaTitle || '')].length;
  if (titleLength > TITLE_MAX) warn('title-long', at('metaTitle'), `metaTitle is ${titleLength} characters (max ${TITLE_MAX})`);
  const descriptionLength = [...(fields.metaDescription || '')].length;
  if (descriptionLength < DESCRIPTION_MIN || descriptionLength > DESCRIPTION_MAX) {
    warn('description-length', at('metaDescription'), `metaDescription is ${descriptionLength} characters (${DESCRIPTION_MIN} to ${DESCRIPTION_MAX})`);
  }

  if (fields.answer) checkInline(at('answer'), fields.answer);
  const answerWords = stripInline(fields.answer || '').trim().split(/\s+/).filter(Boolean).length;
  if (answerWords < ANSWER_MIN || answerWords > ANSWER_MAX) warn('answer-length', at('answer'), `answer is ${answerWords} words (${ANSWER_MIN} to ${ANSWER_MAX})`);

  for (const cat of listOf(fields.cats)) {
    if (!CATEGORIES.includes(cat)) fail(at('cats'), `category "${cat}" is not one of the site's categories`);
  }
  for (const path of listOf(fields.services)) {
    if (!SERVICES.some((service) => service.path === path)) fail(at('services'), `services path ${path} is not in src/data/services.js`);
  }
  if (fields.ctaService) {
    const service = SERVICES.find((entry) => entry.path === fields.ctaService);
    if (!fields.ctaService.startsWith('/services/') || !service) fail(at('ctaService'), `ctaService ${fields.ctaService} is not in src/data/services.js`);
    else if (service.status !== 'live') warn('cta-service-draft', at('ctaService'), `ctaService ${fields.ctaService} is not live yet`);
  }
  if (fields.reviewBy && !isDate(fields.reviewBy)) fail(at('reviewBy'), `reviewBy "${fields.reviewBy}" is not a YYYY-MM-DD date`);
  else if (fields.reviewBy && fields.reviewBy <= PUBLISH_DATE) warn('review-due', at('reviewBy'), `reviewBy ${fields.reviewBy} is not after the publish date`);
}

function checkBlocks(piece) {
  const { id, blocks } = piece;
  if (!blocks.length) fail(`${id}:1`, 'no body');
  if (!piece.sources.length) warn('no-sources', `${id}:1`, 'no sources');
  for (const block of blocks) {
    const where = `${id}:${block.line}`;
    if (block.t === 'table') {
      [...block.head, ...block.rows.flat()].forEach((cell) => cell && checkInline(where, cell));
      continue;
    }
    const shown = checkInline(where, block.x);
    if (block.t === 'p' || block.t === 'li' || block.t === 'oli') {
      const words = wordsOf(shown).length;
      if (words > PARAGRAPH_MAX) warn('long-paragraph', where, `${block.t === 'p' ? 'paragraph' : 'list item'} of ${words} words: "${short(shown)}"`);
    }
  }
}

/* ------------------------------------------------------------------ write */
function toPost(piece) {
  const { fields, sources, blocks } = piece;
  const order = ORDER ? ORDER.indexOf(piece.id) : -1;
  return {
    slug: fields.slug,
    status: STATUS,
    title: fields.title,
    metaTitle: fields.metaTitle,
    metaDescription: fields.metaDescription,
    excerpt: fields.excerpt,
    date: PUBLISH_DATE,
    updated: PUBLISH_DATE,
    cats: listOf(fields.cats),
    services: listOf(fields.services),
    ...(fields.ctaService ? { ctaService: fields.ctaService } : {}),
    cluster: fields.cluster,
    answer: fields.answer || '',
    hero: null,
    thumbAlt: fields.thumbAlt,
    ctaPrimary: 'visit',
    ...(order >= 0 ? { listOrder: order + 1 } : {}),
    ...(fields.reviewBy ? { reviewBy: fields.reviewBy } : {}),
    sources,
    faqs: [],
    blocks: blocks.map(({ line, ...block }) => block),
  };
}

/* ---------------------------------------------------------- keyword map */
// Page entries are spliced into the file as text: it is laid out by hand, and
// rewriting it with JSON.stringify would touch every array in a 950-line file.
const normKeyword = (keyword) => String(keyword || '').replace(/\s+/g, ' ').trim().toLowerCase();
const mapSpelling = (keyword) => keyword.replace(/\b(winnipeg|manitoba|canada)\b/gi, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The index just after the JSON object or array that opens at `start`. */
function valueEnd(text, start) {
  let depth = 0;
  let inString = false;
  for (let i = start; i < text.length; i += 1) {
    const c = text[i];
    if (inString) {
      if (c === '\\') i += 1;
      else if (c === '"') inString = false;
    } else if (c === '"') inString = true;
    else if (c === '{' || c === '[') depth += 1;
    else if (c === '}' || c === ']') {
      depth -= 1;
      if (!depth) return i + 1;
    }
  }
  throw new Error('keyword-map.json: unbalanced brackets');
}

const pageHead = (path) => `\n    ${JSON.stringify(path)}: {`;

function removePageText(text, path) {
  const head = pageHead(path);
  const at = text.indexOf(head);
  if (at < 0) return text;
  const end = valueEnd(text, at + head.length - 1);
  if (text[end] === ',') return text.slice(0, at) + text.slice(end + 1);
  return text.slice(0, at).replace(/,\s*$/, '') + text.slice(end);
}

function appendPagesText(text, entries) {
  const open = text.indexOf('{', text.indexOf('"pages":'));
  const close = valueEnd(text, open) - 1;
  return `${text.slice(0, close).replace(/\s*$/, '')},\n${entries.join(',\n')}\n  ${text.slice(close)}`;
}

function pageText(path, { status, primary, secondary, note }) {
  const list = secondary.length > 1 ? `[\n${secondary.map((keyword) => `        ${JSON.stringify(keyword)}`).join(',\n')}\n      ]` : JSON.stringify(secondary);
  return [
    `    ${JSON.stringify(path)}: {`,
    `      "status": ${JSON.stringify(status)},`,
    `      "primary": ${JSON.stringify([primary])},`,
    `      "secondary": ${list},`,
    `      "supporting": [],`,
    `      "note": ${JSON.stringify(note)}`,
    `    }`,
  ].join('\n');
}

/** Moves `keyword` off the page `from` onto `to`: its secondary line, the page's note, and the blocked page's pointer to it. */
function moveKeywordText(text, keyword, from, to) {
  const head = pageHead(from);
  const at = text.indexOf(head);
  const end = valueEnd(text, at + head.length - 1);
  const page = text
    .slice(at, end)
    .replace(new RegExp(`\\n\\s*"${escapeRegExp(keyword)}",?(?=\\n)`, 'i'), '')
    .replace(/,(\s*\])/g, '$1')
    .replace(/("note": "(?:[^"\\]|\\.)*?)\.?"/, `$1. ${mapSpelling(keyword)} moved to ${to} on ${PUBLISH_DATE}, now the dedicated page."`);
  const pointer = new RegExp(`("${escapeRegExp(keyword)}": ")${escapeRegExp(from)} secondary"`, 'i');
  return (text.slice(0, at) + page + text.slice(end)).replace(pointer, `$1${to} primary"`);
}

/**
 * The primary a page can carry: only words in both its <title> and H1, because
 * the audit warns on any other. The title is the client's, so the map gives way.
 */
function fittedPrimary({ fields }) {
  const inTitle = wordSet(fields.metaTitle);
  const inH1 = wordSet(fields.title);
  return fields.primary
    .split(/\s+/)
    .filter((token) => [...wordSet(token)].every((word) => inTitle.has(word) && inH1.has(word)))
    .join(' ');
}

/** New keyword-map text and a log of what changed, or null when the merge cannot go ahead. */
function mergeKeywords(pieces) {
  const raw = readFileSync(KEYWORD_MAP, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  let text = raw.replace(/\r\n/g, '\n');
  const map = JSON.parse(text);
  const pathOf = (piece) => `/blog/${piece.fields.slug}`;
  const running = new Set(pieces.map(pathOf));

  // Who owns what, leaving out this run's pieces so a re-run starts clean.
  const owners = new Map();
  for (const [path, page] of Object.entries(map.pages)) {
    if (running.has(path)) continue;
    for (const bucket of ['primary', 'secondary', 'supporting']) {
      for (const keyword of page[bucket] || []) owners.set(normKeyword(keyword), { path, bucket });
    }
  }
  for (const bucket of ['gbpOnly', 'notTargeted']) {
    for (const item of map[bucket] || []) owners.set(normKeyword(item.keyword), { path: bucket, bucket });
  }

  const log = { reworded: [], moved: [], dropped: [] };
  const moves = [];
  // Primaries first: a page's primary outranks another piece's secondary.
  for (const piece of pieces) {
    const { id, fields, lineOf } = piece;
    const where = `${id}:${lineOf.primary}`;
    const file = fields.primary;
    const fitted = fittedPrimary(piece);
    if (wordSet(fitted).size < 2) {
      fail(where, `primary "${file}" has too few words in the title and H1 to keep as a primary`);
      continue;
    }
    if (normKeyword(fitted) !== normKeyword(file)) log.reworded.push({ id, from: file, to: fitted, title: fields.metaTitle, h1: fields.title });
    piece.keyword = mapSpelling(fitted);
    const key = normKeyword(fitted);
    const owner = owners.get(key);
    if (owner && KEYWORD_MOVES[key] === owner.path) {
      moves.push({ keyword: key, from: owner.path, to: pathOf(piece) });
      log.moved.push({ id, keyword: piece.keyword, from: `${owner.path} ${owner.bucket}`, to: pathOf(piece) });
    } else if (owner) {
      fail(where, `primary "${fitted}" is already owned by ${owner.path} (${owner.bucket})`);
      continue;
    }
    owners.set(key, { path: pathOf(piece), bucket: 'primary' });
  }

  const pages = pieces.map((piece) => {
    const { id, fields } = piece;
    const file = listOf(fields.secondary);
    // A word-fitted primary keeps the file's full phrase as a secondary.
    if (piece.keyword && normKeyword(piece.keyword) !== normKeyword(fields.primary)) file.unshift(fields.primary);
    const secondary = [];
    const dropped = [];
    for (const keyword of file) {
      const key = normKeyword(keyword);
      const owner = owners.get(key);
      if (owner) {
        if (owner.path !== pathOf(piece) || owner.bucket !== 'primary') dropped.push({ keyword, owner: `${owner.path} ${owner.bucket}` });
        continue;
      }
      owners.set(key, { path: pathOf(piece), bucket: 'secondary' });
      secondary.push(mapSpelling(keyword));
    }
    dropped.forEach((item) => log.dropped.push({ id, ...item }));
    const droppedNote = dropped.length ? ` Dropped, already owned: ${dropped.map((item) => `${item.keyword} (${item.owner})`).join('; ')}.` : '';
    return pageText(pathOf(piece), {
      status: STATUS === 'published' ? 'live' : 'planned',
      primary: piece.keyword,
      secondary,
      note: `Drive piece ${id}, imported ${PUBLISH_DATE}; keywords from the file, validate volume.${droppedNote}`,
    });
  });
  if (errors.length) return null;

  for (const path of running) text = removePageText(text, path);
  text = appendPagesText(text, pages);
  for (const { keyword, from, to } of moves) text = moveKeywordText(text, keyword, from, to);

  // The same rule as scripts/lib/audit/keywords.mjs: a keyword listed twice fails the build.
  const merged = JSON.parse(text);
  const seen = new Map();
  const note = (keyword, where) => {
    const key = normKeyword(keyword);
    if (seen.has(key)) fail('keyword-map.json', `"${keyword}" would be listed twice: ${seen.get(key)} and ${where}`);
    seen.set(key, where);
  };
  for (const [path, page] of Object.entries(merged.pages)) {
    for (const bucket of ['primary', 'secondary', 'supporting']) (page[bucket] || []).forEach((keyword) => note(keyword, `${path} ${bucket}`));
  }
  for (const bucket of ['gbpOnly', 'notTargeted']) (merged[bucket] || []).forEach((item) => note(item.keyword, bucket));
  return errors.length ? null : { text: text.replace(/\n/g, eol), log };
}

/* -------------------------------------------------------------------- run */
const allIds = readdirSync(FROM).filter((file) => /^[A-Z]\d{2}\.md$/.test(file)).map((file) => file.slice(0, 3)).sort();
const requested = option('ids') ? option('ids').split(',').map((id) => id.trim()).filter(Boolean) : allIds;
for (const id of requested) {
  if (!allIds.includes(id)) stop(`--ids: no ${id}.md in ${FROM}`);
}
if (!requested.length) stop(`no <id>.md files in ${FROM}`);

const pieces = requested.map(readPiece);
pieces.forEach(parseBody);

// Which posts a link can point at once this run is done. A draft import may link
// to any piece in the folder: the links only have to hold when they are published.
const runSlugs = new Set(pieces.map((piece) => piece.fields.slug));
for (const post of existingPosts) {
  if (statusOf(post) === 'published' && !runSlugs.has(post.slug)) linkablePosts.add(`/blog/${post.slug}`);
}
if (STATUS === 'published') {
  for (const slug of runSlugs) linkablePosts.add(`/blog/${slug}`);
} else {
  for (const id of allIds) {
    const slug = /^slug:\s*(\S+)/m.exec(readFileSync(join(FROM, `${id}.md`), 'utf8'));
    if (slug) linkablePosts.add(`/blog/${slug[1]}`);
  }
  existingPosts.forEach((post) => linkablePosts.add(`/blog/${post.slug}`));
}

const slugsFile = join(dirname(FROM), 'slugs.json');
const slugMap = existsSync(slugsFile) ? JSON.parse(readFileSync(slugsFile, 'utf8')) : null;
const seenSlugs = new Map();
for (const piece of pieces) {
  checkFields(piece);
  checkBlocks(piece);
  const { id, fields, lineOf } = piece;
  // The client's tracker and the thumbnails use the agreed slug.
  if (slugMap && slugMap[id] !== fields.slug) fail(`${id}:${lineOf.slug}`, `slug "${fields.slug}" is not the agreed slug "${slugMap[id]}" (slugs.json)`);
  if (seenSlugs.has(fields.slug)) fail(`${id}:${lineOf.slug}`, `slug "${fields.slug}" is also used by ${seenSlugs.get(fields.slug)}`);
  seenSlugs.set(fields.slug, id);
  if (ORDER && !ORDER.includes(id)) warn('not-in-order', `${id}:1`, 'not in --order: lists after the ordered posts');

  // The title burned into a thumbnail is the unedited metaTitle, so an edit leaves the picture behind.
  const seedFile = join(dirname(FROM), 'seed', `${id}.md`);
  const burnedIn = existsSync(seedFile) && /^metaTitle:\s*(.*?)\s*$/m.exec(readFileSync(seedFile, 'utf8'));
  if (burnedIn && burnedIn[1] !== fields.metaTitle) warn('thumbnail-title', `${id}:${lineOf.metaTitle}`, `the thumbnail still reads "${burnedIn[1]}"`);

  const target = join(POSTS_DIR, `${fields.slug}.json`);
  if (existsSync(target)) {
    const existing = JSON.parse(readFileSync(target, 'utf8'));
    if (!flag('force')) fail(`${id}:${lineOf.slug}`, `blog-raw/posts/${fields.slug}.json exists (--force overwrites it)`);
    // Only imported posts carry thumbAlt: --force must not reach a post written by hand.
    else if (!existing.thumbAlt) fail(`${id}:${lineOf.slug}`, `blog-raw/posts/${fields.slug}.json is not an imported post: refusing to overwrite it`);
  }
  if (THUMBS_FROM && !existsSync(join(THUMBS_FROM, `${id}.png`))) fail(`${id}:1`, `no thumbnail ${id}.png in ${THUMBS_FROM}`);
  else if (!THUMBS_FROM && STATUS === 'published' && !existsSync(join(THUMBNAILS, `${fields.slug}.png`))) {
    warn('no-thumbnail', `${id}:1`, `no media-src/thumbnails/${fields.slug}.png: build-images will draw a title card`);
  }
}

const merge = flag('keywords') && !errors.length ? mergeKeywords(pieces) : null;

const byCode = new Map();
for (const item of warnings) {
  if (!byCode.has(item.code)) byCode.set(item.code, []);
  byCode.get(item.code).push(item);
}
for (const [code, items] of byCode) {
  console.log(`\nwarning ${code} (${items.length}):`);
  items.forEach((item) => console.log(`  ${item.where}: ${item.message}`));
}

if (errors.length) {
  console.error(`\nimport-drive-pieces: ${errors.length} error(s), nothing was written:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}

if (!DRY_RUN) {
  for (const piece of pieces) writeFileSync(join(POSTS_DIR, `${piece.fields.slug}.json`), `${JSON.stringify(toPost(piece), null, 2)}\n`);
  if (THUMBS_FROM) {
    mkdirSync(THUMBNAILS, { recursive: true });
    for (const piece of pieces) copyFileSync(join(THUMBS_FROM, `${piece.id}.png`), join(THUMBNAILS, `${piece.fields.slug}.png`));
  }
}

if (merge) {
  const { text, log } = merge;
  console.log(`\nkeyword map: ${pieces.length} page(s), ${log.dropped.length} secondary keyword(s) dropped, ${log.moved.length} moved, ${log.reworded.length} primary reworded`);
  log.moved.forEach((item) => console.log(`  moved ${item.keyword}: ${item.from} -> ${item.to}`));
  log.reworded.forEach((item) => console.log(`  reworded ${item.id}: "${item.from}" -> "${item.to}" (title "${item.title}", H1 "${item.h1}")`));
  log.dropped.forEach((item) => console.log(`  dropped ${item.id}: ${item.keyword} (${item.owner})`));
  if (!DRY_RUN) {
    writeFileSync(KEYWORD_MAP, text);
    const logFile = join(dirname(FROM), `keyword-log-${basename(FROM)}.json`);
    writeFileSync(logFile, `${JSON.stringify({ date: PUBLISH_DATE, ...log }, null, 2)}\n`);
    console.log(`  log: ${logFile}`);
  }
}

console.log(`\n${DRY_RUN ? 'dry run: would write' : 'wrote'} ${pieces.length} post(s) to blog-raw/posts as ${STATUS}, dated ${PUBLISH_DATE}; ${warnings.length} warning(s)`);
