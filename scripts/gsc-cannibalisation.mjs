/**
 * Search Console cannibalisation report (SEO plan §18, run monthly): reads a
 * Performance export with one row per query AND page and writes Markdown with
 *   1. queries where two or more of our URLs get impressions, with each URL's
 *      share of the query's impressions and clicks;
 *   2. keyword-map primaries (scripts/keyword-map.json) whose best page in
 *      Search Console is not the page the map assigns them to;
 *   3. keyword-map primaries with no impressions at all.
 *
 *   node scripts/gsc-cannibalisation.mjs <export.csv|export.json> [options]
 *   npm run gsc:cannibal -- <export.csv> --out=gsc-report.md
 *
 *   --out=<file>            write the report there (default: stdout)
 *   --min-impressions=<n>   skip queries with fewer impressions in total across
 *                           all URLs, in section 1 (default 10)
 *   --map=<file>            keyword map (default scripts/keyword-map.json)
 *
 * The export comes from the owner's Search Console property (owner task O-16)
 * and needs both dimensions. Search Console's own Export > CSV puts
 * queries and pages in separate tables (Queries.csv, Pages.csv), which cannot
 * show which page a query lands on. Use the Search Console API (dimensions
 * ["query", "page"]), a Looker Studio table on the Search Console "URL
 * impression" data, or the Search Analytics for Sheets add-on, saved as CSV.
 * Header names are matched without regard to case, accents, spacing or
 * punctuation (the French, German and Spanish names in COLUMNS work too):
 *   query        Query, Queries, Top queries, Search query, Keyword
 *   page         Page, Pages, Top pages, Landing page, URL, Address
 *   clicks       Clicks, Url clicks, Site clicks
 *   impressions  Impressions, Impr., Url impressions, Site impressions
 *   ctr          CTR, Url CTR, Site CTR (optional; shares use clicks / impressions)
 *   position     Position, Average position, Avg. position (optional)
 * Comma, semicolon and tab separators, UTF-8 and UTF-16 files (BOM or not) and
 * Search Console's localized numbers ("1,234", "1.234", "1 234", "3.5%",
 * "3,5 %") are accepted. A lone comma in CTR or position is read as a decimal
 * comma ("4,2" = 4.2). An API response saved as JSON ({ rows: [{ keys:
 * [query, page], clicks, impressions, ctr, position }] }) works too.
 *
 * URLs are compared by path: scheme, host, query string, #fragment and a
 * trailing slash are dropped, so http, www and jump-link variants of a page
 * add up. Old URLs that vercel.json redirects are marked. Queries and keywords
 * are normalised as scripts/lib/audit/keywords.mjs does (lower case, single
 * spaces); a query also matches a keyword with the same word set (plural and
 * word order: "winnipeg kitchen renovations" ~ "kitchen renovation Winnipeg").
 * Only node built-ins are used.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readKeywordMap, wordSet } from './lib/audit/keywords.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

const args = process.argv.slice(2);
// --name=value or --name value
function option(name, fallback) {
  const i = args.findIndex((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (i === -1) return fallback;
  return args[i].includes('=') ? args[i].slice(name.length + 3) : args[i + 1];
}
const optionValues = new Set(['--out', '--min-impressions', '--map'].map((name) => args.indexOf(name) + 1).filter(Boolean));
const INPUT = args.find((a, i) => !a.startsWith('--') && !optionValues.has(i));
const OUT = option('out');
const MIN_IMPRESSIONS = Number(option('min-impressions', '10'));
const MAP_FILE = resolve(process.cwd(), option('map', resolve(ROOT, 'scripts/keyword-map.json')));

if (!INPUT || args.includes('--help') || !Number.isFinite(MIN_IMPRESSIONS)) {
  console.error('usage: node scripts/gsc-cannibalisation.mjs <export.csv|export.json> [--out=report.md] [--min-impressions=10] [--map=scripts/keyword-map.json]');
  process.exit(2);
}

/* --------------------------------------------------------------- reading */

/** File text: UTF-16 (LE/BE, by BOM or by NUL bytes) or UTF-8, BOM stripped. */
function readText(file) {
  const buf = readFileSync(file);
  if (buf[0] === 0xff && buf[1] === 0xfe) return buf.subarray(2).toString('utf16le');
  if (buf[0] === 0xfe && buf[1] === 0xff) return Buffer.from(buf.subarray(2)).swap16().toString('utf16le');
  if (buf.length > 1 && buf[1] === 0 && buf[0] !== 0) return buf.toString('utf16le');
  return buf.toString('utf8').replace(/^﻿/, '');
}

/** RFC 4180 CSV: quoted fields, "" escapes, CRLF; the separator is guessed from the header. */
function parseCsv(text) {
  const firstLine = text.slice(0, text.search(/\r?\n|$/));
  const count = (ch) => firstLine.split(ch).length - 1;
  const sep = [',', ';', '\t'].sort((a, b) => count(b) - count(a))[0];
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"' && field === '') quoted = true;
    else if (ch === sep) {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      field = '';
    } else field += ch;
  }
  row.push(field);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

const headerKey = (name) => String(name).normalize('NFD').toLowerCase().replace(/[^a-z0-9]/g, '');
// English names, plus the French, German and Spanish ones a localized export may use.
const COLUMNS = {
  query: ['query', 'queries', 'topqueries', 'searchquery', 'keyword', 'keys0', 'requete', 'requetes', 'suchanfrage', 'suchanfragen', 'consulta', 'consultas'],
  page: ['page', 'pages', 'toppages', 'landingpage', 'landingpageurl', 'url', 'address', 'keys1', 'seite', 'seiten', 'pagina', 'paginas'],
  clicks: ['clicks', 'urlclicks', 'siteclicks', 'clics', 'klicks'],
  impressions: ['impressions', 'impr', 'urlimpressions', 'siteimpressions', 'impressionen', 'impresiones'],
  ctr: ['ctr', 'urlctr', 'sitectr'],
  position: ['position', 'averageposition', 'avgposition', 'urlaverageposition', 'positionmoyenne', 'durchschnittlicheposition', 'posicion', 'posicionmedia'],
};

/** "1,234" / "1.234" / "1 234" -> 1234 (a one- or two-digit tail is a decimal part). */
function parseCount(value) {
  if (typeof value === 'number') return value;
  const s = String(value || '').replace(/[\s  '’]/g, '');
  if (!s) return 0;
  if (/[.,]\d{1,2}$/.test(s)) return Math.round(parseDecimal(s));
  const n = Number(s.replace(/[.,]/g, ''));
  return Number.isFinite(n) ? n : NaN;
}

/** "3.5" / "3,5" / "1,234.5" / "1.234,5" -> number; a lone comma is a decimal comma. */
function parseDecimal(value) {
  if (typeof value === 'number') return value;
  let s = String(value || '').replace(/[%\s  '’]/g, '');
  if (!s) return NaN;
  const comma = s.lastIndexOf(',');
  const dot = s.lastIndexOf('.');
  if (comma !== -1 && dot !== -1) {
    const dec = comma > dot ? ',' : '.';
    s = s.split(dec === ',' ? '.' : ',').join('').replace(dec, '.');
  } else if (comma !== -1) {
    s = s.split(',').length > 2 ? s.replace(/,/g, '') : s.replace(',', '.');
  } else if (s.split('.').length > 2) {
    s = s.replace(/\./g, '');
  }
  return Number(s);
}

/** CTR as a fraction: "3.5%" and 3.5 -> 0.035, 0.035 -> 0.035. */
function parseCtr(value) {
  const n = parseDecimal(value);
  if (!Number.isFinite(n)) return NaN;
  return /%/.test(String(value)) || n > 1 ? n / 100 : n;
}

/** Rows as { query, page, clicks, impressions, ctr, position }. */
function readExport(file) {
  const text = readText(file);
  if (/^\s*[[{]/.test(text)) {
    const json = JSON.parse(text);
    const rows = Array.isArray(json) ? json : json.rows || [];
    return rows.map((r) => ({
      query: r.query ?? (r.keys && r.keys[0]),
      page: r.page ?? (r.keys && r.keys[1]),
      clicks: parseCount(r.clicks),
      impressions: parseCount(r.impressions),
      ctr: parseCtr(r.ctr),
      position: parseDecimal(r.position),
    }));
  }
  const [header = [], ...body] = parseCsv(text);
  const keys = header.map(headerKey);
  const col = {};
  for (const [field, names] of Object.entries(COLUMNS)) col[field] = keys.findIndex((key) => names.includes(key));
  const missing = ['query', 'page', 'clicks', 'impressions'].filter((field) => col[field] === -1);
  if (missing.length) {
    const hint = col.query === -1 || col.page === -1
      ? ' The export needs one row per query and page: Search Console\'s own CSV export splits them into Queries.csv and Pages.csv, so use the API, Looker Studio or Search Analytics for Sheets (see the header of this script).'
      : '';
    throw new Error(`${file}: no ${missing.join(', ')} column in the header (${header.join(' | ')}).${hint}`);
  }
  const cell = (row, field) => (col[field] === -1 ? undefined : row[col[field]]);
  return body.map((row) => ({
    query: cell(row, 'query'),
    page: cell(row, 'page'),
    clicks: parseCount(cell(row, 'clicks')),
    impressions: parseCount(cell(row, 'impressions')),
    ctr: parseCtr(cell(row, 'ctr')),
    position: parseDecimal(cell(row, 'position')),
  }));
}

/* ------------------------------------------------------------ normalising */

// As scripts/lib/audit/keywords.mjs normalises keywords.
const norm = (keyword) => String(keyword || '').replace(/\s+/g, ' ').trim().toLowerCase();
const signature = (text) => [...wordSet(text)].sort().join(' ');

/** "https://www.example.com/services/x/?a=1#faq" -> "/services/x". */
function pathOf(page) {
  const raw = String(page || '').trim();
  if (!raw) return '';
  let path;
  try {
    path = new URL(raw, 'https://placeholder.invalid').pathname;
  } catch {
    path = raw.split(/[?#]/)[0];
  }
  try {
    path = decodeURI(path);
  } catch {
    // keep it encoded
  }
  return path.replace(/\/+$/, '') || '/';
}

/** Exact-path redirect sources in vercel.json -> destination path. */
function readRedirects() {
  const redirects = new Map();
  try {
    const vercel = JSON.parse(readFileSync(resolve(ROOT, 'vercel.json'), 'utf8'));
    for (const { source, destination } of vercel.redirects || []) {
      if (!source || /[:*(]/.test(source)) continue;
      redirects.set(pathOf(source).toLowerCase(), pathOf(destination));
    }
  } catch {
    // no vercel.json: no redirect notes
  }
  return redirects;
}

/* ------------------------------------------------------------- aggregating */

let rawRows;
try {
  rawRows = readExport(resolve(process.cwd(), INPUT));
} catch (err) {
  console.error(err.code === 'ENOENT' ? `${INPUT}: file not found` : err.message);
  process.exit(1);
}
const bad = rawRows.filter((r) => !Number.isFinite(r.impressions) || !Number.isFinite(r.clicks)).length;

// query -> path -> totals (variants of one URL, and repeated rows, add up).
const byQuery = new Map();
let rowsUsed = 0;
for (const r of rawRows) {
  const query = norm(r.query);
  const path = pathOf(r.page);
  if (!query || !path || !Number.isFinite(r.impressions) || !Number.isFinite(r.clicks)) continue;
  if (r.impressions <= 0 && r.clicks <= 0) continue;
  rowsUsed += 1;
  if (!byQuery.has(query)) byQuery.set(query, new Map());
  const pages = byQuery.get(query);
  if (!pages.has(path)) pages.set(path, { path, clicks: 0, impressions: 0, posWeighted: 0, posImpressions: 0 });
  const t = pages.get(path);
  t.clicks += r.clicks;
  t.impressions += r.impressions;
  if (Number.isFinite(r.position) && r.position > 0 && r.impressions > 0) {
    t.posWeighted += r.position * r.impressions;
    t.posImpressions += r.impressions;
  }
}

const sumPages = (list) => {
  const totals = new Map();
  for (const t of list) {
    if (!totals.has(t.path)) totals.set(t.path, { path: t.path, clicks: 0, impressions: 0, posWeighted: 0, posImpressions: 0 });
    const s = totals.get(t.path);
    s.clicks += t.clicks;
    s.impressions += t.impressions;
    s.posWeighted += t.posWeighted;
    s.posImpressions += t.posImpressions;
  }
  return [...totals.values()];
};
// Most clicks, then most impressions, then the better average position.
const position = (t) => (t.posImpressions ? t.posWeighted / t.posImpressions : Infinity);
const byPerformance = (a, b) => b.clicks - a.clicks || b.impressions - a.impressions || position(a) - position(b);

// Keyword map: every bucket, for "who owns this query"; primaries for sections 2 and 3.
const map = readKeywordMap(JSON.parse(readFileSync(MAP_FILE, 'utf8')));
const owners = new Map(); // norm(keyword) -> { path, bucket, keyword }
const ownersBySignature = new Map();
for (const page of map.pages) {
  for (const bucket of ['primary', 'secondary', 'supporting']) {
    for (const keyword of page[bucket]) {
      const owner = { path: pathOf(page.path), bucket, keyword, status: page.status };
      if (!owners.has(norm(keyword))) owners.set(norm(keyword), owner);
      if (!ownersBySignature.has(signature(keyword))) ownersBySignature.set(signature(keyword), owner);
    }
  }
}
const ownerOf = (query) => owners.get(query) || ownersBySignature.get(signature(query)) || null;

// Queries by word-set signature, for matching primaries to their variants.
const queriesBySignature = new Map();
for (const query of byQuery.keys()) {
  const sig = signature(query);
  if (!queriesBySignature.has(sig)) queriesBySignature.set(sig, []);
  queriesBySignature.get(sig).push(query);
}

// Primaries grouped per page by word set ("kitchen renovation(s) Winnipeg" is one row).
const primaries = [];
for (const page of map.pages) {
  const groups = new Map();
  for (const keyword of page.primary) {
    const sig = signature(keyword);
    if (!groups.has(sig)) groups.set(sig, []);
    groups.get(sig).push(keyword);
  }
  const path = pathOf(page.path);
  for (const [sig, keywords] of groups) {
    // A variant that the map lists as another page's keyword belongs to that page.
    const queries = (queriesBySignature.get(sig) || []).filter((q) => !owners.has(q) || owners.get(q).path === path);
    primaries.push({ keywords, path, status: page.status || '', queries });
  }
}

/* ---------------------------------------------------------------- report */

const redirects = readRedirects();
const fmt = (n) => Math.round(n).toLocaleString('en-CA');
const pct = (part, whole) => (whole ? `${((100 * part) / whole).toFixed(1)}%` : '—');
const pos = (t) => (t && t.posImpressions ? (t.posWeighted / t.posImpressions).toFixed(1) : '—');
const cellText = (text) => String(text).replace(/\|/g, '\\|');
const pageNote = (path) => {
  const target = redirects.get(path.toLowerCase());
  return target ? `redirects to ${target}` : '';
};

const cannibalised = [...byQuery.entries()]
  .map(([query, pages]) => {
    const list = [...pages.values()].filter((t) => t.impressions > 0).sort(byPerformance);
    const impressions = list.reduce((n, t) => n + t.impressions, 0);
    const clicks = list.reduce((n, t) => n + t.clicks, 0);
    return { query, list, impressions, clicks };
  })
  .filter((q) => q.list.length >= 2 && q.impressions >= MIN_IMPRESSIONS)
  .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);

const withData = primaries.filter((p) => p.queries.length);
const mismatches = withData
  .map((p) => {
    const totals = sumPages(p.queries.flatMap((q) => [...byQuery.get(q).values()])).sort(byPerformance);
    return { ...p, best: totals[0], mapped: totals.find((t) => t.path === p.path) };
  })
  .filter((p) => p.best && p.best.path !== p.path);
const noImpressions = primaries.filter((p) => !p.queries.length);

const out = [];
out.push('# Search Console cannibalisation report', '');
out.push(`- Export: \`${INPUT}\` (${fmt(rawRows.length)} rows, ${fmt(rowsUsed)} with impressions${bad ? `, ${fmt(bad)} unreadable` : ''})`);
const urlCount = new Set([...byQuery.values()].flatMap((pages) => [...pages.keys()])).size;
out.push(`- ${fmt(byQuery.size)} ${byQuery.size === 1 ? 'query' : 'queries'} across ${fmt(urlCount)} URL${urlCount === 1 ? '' : 's'}`);
out.push(`- Keyword map: \`${relative(ROOT, MAP_FILE).replace(/\\/g, '/')}\` (${primaries.length} primary keyword groups on ${map.pages.length} pages)`);
out.push(`- Generated ${new Date().toISOString().slice(0, 10)}`, '');

out.push(`## 1. Queries shown with two or more of our URLs (${cannibalised.length})`, '');
out.push(`Queries with at least ${fmt(MIN_IMPRESSIONS)} impressions in total (\`--min-impressions\`), most impressions first. Share = the URL's part of the query's impressions and clicks. Where a URL other than the mapped page takes a large share, consider refocusing its copy, linking it to the mapped page, or (for an old URL) checking its redirect.`, '');
if (!cannibalised.length) out.push('None.', '');
for (const q of cannibalised) {
  const owner = ownerOf(q.query);
  out.push(`### "${q.query}": ${fmt(q.impressions)} impressions, ${fmt(q.clicks)} click${q.clicks === 1 ? '' : 's'}, ${q.list.length} URLs`, '');
  out.push(owner ? `Keyword map: ${owner.bucket} keyword of \`${owner.path}\`${norm(owner.keyword) === q.query ? '' : ` (as "${owner.keyword}")`}.` : 'Not in the keyword map.', '');
  out.push('| URL | Impressions | Share | Clicks | Click share | Avg. position | Note |', '|---|---:|---:|---:|---:|---:|---|');
  for (const t of q.list) {
    const notes = [owner && owner.path === t.path ? 'mapped page' : '', pageNote(t.path)].filter(Boolean).join('; ');
    out.push(`| \`${cellText(t.path)}\` | ${fmt(t.impressions)} | ${pct(t.impressions, q.impressions)} | ${fmt(t.clicks)} | ${pct(t.clicks, q.clicks)} | ${pos(t)} | ${notes} |`);
  }
  out.push('');
}

out.push(`## 2. Primary keywords whose best page is not the mapped page (${mismatches.length} of ${withData.length} with data)`, '');
out.push('Best page = most clicks, then most impressions, then the better average position, over every query that matches the keyword (exactly or as a plural / word-order variant).', '');
if (!mismatches.length) out.push('None.', '');
else {
  out.push('| Primary keyword | Mapped page | Mapped: impr. / clicks / pos. | Best page | Best: impr. / clicks / pos. | Queries matched |', '|---|---|---|---|---|---|');
  for (const p of mismatches) {
    const mapped = p.mapped ? `${fmt(p.mapped.impressions)} / ${fmt(p.mapped.clicks)} / ${pos(p.mapped)}` : 'no impressions';
    const bestNote = pageNote(p.best.path);
    out.push(`| ${cellText(p.keywords.join(' / '))} | \`${p.path}\`${p.status && p.status !== 'live' ? ` (${p.status})` : ''} | ${mapped} | \`${cellText(p.best.path)}\`${bestNote ? ` (${bestNote})` : ''} | ${fmt(p.best.impressions)} / ${fmt(p.best.clicks)} / ${pos(p.best)} | ${cellText(p.queries.join('; '))} |`);
  }
  out.push('');
}

out.push(`## 3. Primary keywords with no impressions (${noImpressions.length})`, '');
out.push('No query in the export matches these keywords or their variants. Planned pages are not built yet; for live pages, check the title, H1 and internal links point at the keyword (or the export\'s date range and filters).', '');
if (!noImpressions.length) out.push('None.', '');
else {
  out.push('| Primary keyword | Mapped page | Status |', '|---|---|---|');
  for (const p of noImpressions) out.push(`| ${cellText(p.keywords.join(' / '))} | \`${p.path}\` | ${p.status || '—'} |`);
  out.push('');
}

const report = `${out.join('\n').trimEnd()}\n`;
if (OUT) {
  writeFileSync(resolve(process.cwd(), OUT), report, 'utf8');
  console.error(`Wrote ${OUT}: ${cannibalised.length} cannibalised queries, ${mismatches.length} primary mismatches, ${noImpressions.length} primaries without impressions.`);
} else {
  process.stdout.write(report);
}
