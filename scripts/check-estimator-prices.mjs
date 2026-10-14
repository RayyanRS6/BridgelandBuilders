/**
 * Estimator price-drift check: every estimator price the site prints must be
 * one the public instant estimator actually uses today.
 *
 * The cost guides, the service pages' cost teasers, the ensuite and Canada
 * cost posts and the llms files quote ranges from the estimator's public API
 * (https://estimator.bridgelandbuilders.com/api/services). When the owner
 * changes a price there, those pages go stale silently. This script fetches
 * the API and checks the published text against it:
 *
 *   ranges   every "$A–$B" (also "$A-$B" and "$A to $B") in an estimator
 *            context must be one option's minPrice–maxPrice, or the span of a
 *            service's size question (smallest min to largest max, as in
 *            "$16,000–$36,000"), for the service(s) the file covers. An
 *            en-dash range must be written the site's way: "$16,000–$20,000"
 *            (en dash, thousands separators, "$79,999" exactly as the API has
 *            it).
 *   starts   every "from $X", and every "at $X" in a sentence that says
 *            "start(s)", must be a service's lowest starting price (its
 *            baseCost / smallest min) or a size-tier minimum.
 *
 * Budget figures in questions ("Can you renovate a bathroom for $15,000?")
 * and other single amounts are not estimator claims and are not checked.
 *
 * Usage:
 *   node scripts/check-estimator-prices.mjs [--api=<url>] [--json=<file>] [--verbose]
 *     --api   estimator API URL (default: ESTIMATOR_API_URL or the public URL)
 *     --json  read the API response from a saved file instead of fetching
 * Exit: 0 all prices match, 1 a mismatch (each printed as file:line),
 *       2 the API could not be read or no longer has a priced service.
 *
 * Node built-ins and global fetch only. Run weekly by
 * .github/workflows/check-prices.yml; deliberately NOT part of `npm run
 * build`, so an estimator outage or a price change never blocks a deploy.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_API = 'https://estimator.bridgelandbuilders.com/api/services';

const args = process.argv.slice(2);
const option = (name) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};
const VERBOSE = args.includes('--verbose');
const API_URL = option('api') || process.env.ESTIMATOR_API_URL || DEFAULT_API;
const JSON_FILE = option('json');

/** The estimator services the site prints prices for, by API service id. */
const SERVICES = {
  kitchen: 'kitchen-renovations',
  bathroom: 'bathroom-renovations',
  basement: 'basement-renovations',
};
const ALL = Object.keys(SERVICES);

/**
 * Known non-estimator figures that look like estimator prices: { file, text,
 * reason }. A range or starting price inside `text` on a line of `file` is
 * skipped. Empty today: the Canada cost post's Statistics Canada figures are
 * index changes in per cent (no dollar amounts), and every dollar range in the
 * scanned files is an estimator range. An entry that no longer matches
 * anything is reported, so the list cannot go stale.
 */
const ALLOWLIST = [];

/* ------------------------------------------------------------- the API */

/** Stops the check with exit code 2 (the API, not the pages, is the problem). */
class ApiProblem extends Error {}
function fail(message) {
  throw new ApiProblem(message);
}

async function readApi() {
  if (JSON_FILE) {
    try {
      return JSON.parse(readFileSync(JSON_FILE, 'utf8'));
    } catch (error) {
      return fail(`could not read ${JSON_FILE}: ${error.message}`);
    }
  }
  let response;
  try {
    response = await fetch(API_URL, {
      headers: { accept: 'application/json', 'user-agent': 'bridgeland-price-check' },
      signal: AbortSignal.timeout(30000),
    });
  } catch (error) {
    return fail(`could not reach ${API_URL}: ${error.message}`);
  }
  if (!response.ok) return fail(`${API_URL} answered ${response.status}`);
  try {
    return await response.json();
  } catch (error) {
    return fail(`${API_URL} did not return JSON: ${error.message}`);
  }
}

/** 79999 -> '79,999' (the site's thousands separator). */
const money = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const rangeText = (min, max) => `$${money(min)}–$${money(max)}`;
const isPrice = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0;

/**
 * Per service: the allowed range strings (with where each comes from) and the
 * allowed starting prices.
 */
function priceBook(api) {
  const services = Array.isArray(api && api.services) ? api.services : null;
  if (!services) fail('the API response has no "services" list');
  const book = {};
  for (const [key, id] of Object.entries(SERVICES)) {
    const service = services.find((s) => s && s.id === id);
    if (!service) fail(`the API has no "${id}" service any more — update the pages that quote it`);
    if (service.enabled === false) fail(`the API's "${id}" service is disabled — update the pages that quote it`);
    const ranges = new Map(); // '$16,000–$20,000' -> 'Small, up to 50 sq f'
    const starts = new Map(); // 16000 -> why it is allowed
    let size = null; // the question with the largest prices: the size tiers
    for (const question of service.questions || []) {
      const options = (question.options || []).filter((o) => isPrice(o.minPrice) && isPrice(o.maxPrice));
      for (const o of options) {
        if (o.maxPrice > o.minPrice) ranges.set(rangeText(o.minPrice, o.maxPrice), `${question.title} → ${o.label}`);
      }
      const top = Math.max(0, ...options.map((o) => o.maxPrice));
      if (options.length && (!size || top > size.top)) size = { question, options, top };
    }
    if (!size) fail(`the API's "${id}" service has no priced options`);
    const low = Math.min(...size.options.map((o) => o.minPrice));
    ranges.set(rangeText(low, size.top), `${size.question.title} (smallest to largest size)`);
    size.options.forEach((o) => starts.set(o.minPrice, `size tier "${o.label}"`));
    if (isPrice(service.baseCost)) starts.set(service.baseCost, 'baseCost');
    starts.set(low, service.baseCost === low ? 'lowest starting price (= baseCost)' : 'lowest starting price');
    book[key] = { id, ranges, starts };
  }
  return book;
}

/* ------------------------------------------------------- what is scanned */

const rel = (file) => relative(ROOT, file).split('\\').join('/');

/**
 * Files and the service(s) each covers. `context`: 'all' = every line is an
 * estimator context (pages built only from the estimator); 'mentions' = only
 * lines that talk about the estimator, starting ranges or room sizes.
 * `lines` (optional) limits the scan to part of the file.
 */
function targets() {
  const list = [];
  const costDir = join(ROOT, 'src/data/costGuides');
  for (const name of readdirSync(costDir).filter((n) => n.endsWith('.js') && n !== 'index.js').sort()) {
    const service = ALL.find((key) => name === `${SERVICES[key]}.js`);
    list.push({ file: join(costDir, name), scope: service ? [service] : ALL, context: 'all' });
  }
  for (const key of ALL) {
    list.push({ file: join(ROOT, `src/data/services/${SERVICES[key]}.js`), scope: [key], context: 'all', lines: costTeaserLines });
  }
  list.push({ file: join(ROOT, 'blog-raw/posts/ensuite-renovation-winnipeg.json'), scope: ['bathroom'], context: 'all' });
  list.push({ file: join(ROOT, 'blog-raw/posts/home-renovation-cost-canada.json'), scope: ALL, context: 'mentions' });
  for (const name of readdirSync(join(ROOT, 'public')).filter((n) => /^llms.*\.txt$/.test(n)).sort()) {
    list.push({ file: join(ROOT, 'public', name), scope: ALL, context: 'mentions' });
  }
  return list;
}

/** Line numbers (1-based) of the `costTeaser: { … }` block in a service module. */
function costTeaserLines(lines) {
  const start = lines.findIndex((line) => /^\s*costTeaser\s*:\s*\{/.test(line));
  if (start < 0) return [];
  const picked = [];
  let depth = 0;
  for (let i = start; i < lines.length; i += 1) {
    picked.push(i + 1);
    depth += (lines[i].match(/\{/g) || []).length - (lines[i].match(/\}/g) || []).length;
    if (depth <= 0) break;
  }
  return picked;
}

const ESTIMATOR_CONTEXT = /estimator|starting (?:range|price)|\bstarts?\b|sq\.? ?ft|\/cost\b|renovation-cost-winnipeg/i;

/* -------------------------------------------------------------- checking */

// An amount: '16,000' / '79,999' (thousands groups) or '16000' (flagged as
// unformatted). A comma after the amount ('$16,000, a basement…') is not part of it.
const NUM = String.raw`(\d{1,3}(?:,\d{3})+(?!\d)|\d+)`;
const RANGE = new RegExp(String.raw`\$${NUM}(\s*[–—-]\s*|\s+to\s+)\$${NUM}`, 'g');
const FROM = new RegExp(String.raw`\bfrom \$${NUM}`, 'g');
const AT = new RegExp(String.raw`\bat \$${NUM}`, 'g');
const toNumber = (text) => Number(text.replace(/,/g, ''));

const problems = [];
const allowHits = new Set();
let rangeCount = 0;
let startCount = 0;

function allowed(fileRel, line, matchText) {
  const entry = ALLOWLIST.findIndex((a) => a.file === fileRel && line.includes(a.text) && a.text.includes(matchText));
  if (entry >= 0) allowHits.add(entry);
  return entry >= 0;
}

function checkLine({ fileRel, lineNo, line, scope, book }) {
  const where = `${fileRel}:${lineNo}`;
  const scopeName = scope.length === ALL.length ? 'kitchen, bathroom or basement' : scope.join(', ');

  // Ranges first; then blank them out so their first number is not read as a
  // starting price.
  let masked = line;
  for (const match of line.matchAll(RANGE)) {
    masked = masked.slice(0, match.index) + ' '.repeat(match[0].length) + masked.slice(match.index + match[0].length);
    if (allowed(fileRel, line, match[0])) continue;
    rangeCount += 1;
    const canonical = rangeText(toNumber(match[1]), toNumber(match[3]));
    const owner = scope.find((key) => book[key].ranges.has(canonical));
    if (!owner) {
      problems.push(`${where}  "${match[0]}" is not a ${scopeName} range in the estimator`);
    } else if (!/\s+to\s+/.test(match[2]) && match[0] !== canonical) {
      problems.push(`${where}  "${match[0]}" should be written "${canonical}" (en dash, thousands separators)`);
    } else if (VERBOSE) {
      console.log(`ok  ${where}  ${canonical}  (${owner}: ${book[owner].ranges.get(canonical)})`);
    }
  }

  // Starting prices: "from $X" anywhere, "at $X" in a sentence that says start(s).
  const values = [];
  for (const match of masked.matchAll(FROM)) values.push(match);
  for (const sentence of sentencesWithOffsets(masked)) {
    if (!/\bstarts?\b/i.test(sentence.text)) continue;
    for (const match of sentence.text.matchAll(AT)) values.push({ ...match, index: sentence.offset + match.index });
  }
  for (const match of values) {
    const text = match[0];
    if (allowed(fileRel, line, `$${match[1]}`)) continue;
    startCount += 1;
    const value = toNumber(match[1]);
    const owner = scope.find((key) => book[key].starts.has(value));
    if (!owner) {
      const known = scope.map((key) => `${key} ${[...book[key].starts.keys()].sort((a, b) => a - b).map((n) => `$${money(n)}`).join('/')}`);
      problems.push(`${where}  "${text}" is not an estimator starting price (${known.join('; ')})`);
    } else if (`$${match[1]}` !== `$${money(value)}`) {
      problems.push(`${where}  "${text}" should be written "$${money(value)}"`);
    } else if (VERBOSE) {
      console.log(`ok  ${where}  ${text}  (${owner}: ${book[owner].starts.get(value)})`);
    }
  }
}

/** Sentences of a line (split after . ; ! ?), with their offsets. */
function sentencesWithOffsets(text) {
  const out = [];
  const re = /[^.;!?]+[.;!?]*/g;
  for (const match of text.matchAll(re)) out.push({ text: match[0], offset: match.index });
  return out;
}

/* ------------------------------------------------------------------ main */

/** Scans every target against the price book; returns the exit code. */
function scan(book) {
  let scanned = 0;
  for (const target of targets()) {
    if (!existsSync(target.file)) {
      problems.push(`${rel(target.file)}  file not found (update targets() in scripts/check-estimator-prices.mjs)`);
      continue;
    }
    scanned += 1;
    const fileRel = rel(target.file);
    const lines = readFileSync(target.file, 'utf8').split(/\r?\n/);
    const wanted = target.lines ? new Set(target.lines(lines)) : null;
    if (wanted && !wanted.size) {
      problems.push(`${fileRel}  no costTeaser block found`);
      continue;
    }
    lines.forEach((line, index) => {
      const lineNo = index + 1;
      if (wanted && !wanted.has(lineNo)) return;
      if (!line.includes('$')) return;
      if (target.context === 'mentions' && !ESTIMATOR_CONTEXT.test(line)) return;
      checkLine({ fileRel, lineNo, line, scope: target.scope, book });
    });
  }
  ALLOWLIST.forEach((entry, index) => {
    if (!allowHits.has(index)) problems.push(`allowlist entry for ${entry.file} ("${entry.text}") matched nothing — remove it`);
  });

  const summary = `${rangeCount} range(s) and ${startCount} starting price(s) in ${scanned} file(s) against ${API_URL.replace(/^https?:\/\//, '')}${JSON_FILE ? ` (saved copy ${JSON_FILE})` : ''}`;
  if (problems.length) {
    console.error(`check-prices: ${problems.length} price(s) no longer match the estimator\n`);
    problems.forEach((problem) => console.error(`  ${problem}`));
    console.error(`\n${summary}`);
    console.error('Update the page text to the estimator\'s current ranges (never add ranges together), then the guide\'s seo.updated / the post\'s "updated".');
    return 1;
  }
  console.log(`check-prices: OK — ${summary}`);
  return 0;
}

// process.exitCode, never process.exit(): exiting while fetch's keep-alive
// socket is closing crashes Node on Windows (libuv assertion).
try {
  process.exitCode = scan(priceBook(await readApi()));
} catch (error) {
  if (!(error instanceof ApiProblem)) throw error;
  console.error(`check-prices: ${error.message}`);
  process.exitCode = 2;
}
