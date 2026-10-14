/**
 * Keyword-map checks (plan §6): every keyword in scripts/keyword-list.json is
 * accounted for in scripts/keyword-map.json, every keyword appears exactly
 * once across the five buckets (pages' primary / secondary / supporting,
 * gbpOnly, notTargeted), and each live page's primary keyword appears in its
 * <title> and <h1> as a word set. Unassigned and double-listed keywords are
 * errors (plan §3.13 invariants); everything else warns.
 *
 * The readers accept a few shapes so the map can evolve without breaking the
 * audit:
 *   keyword-list.json: string[] | { group: string[] } | { keywords: string[] } | [{ keyword }]
 *   keyword-map.json:  { "/path": { primary, secondary[], supporting[] }, gbpOnly[], notTargeted[] }
 *                      | { pages: {…} | [{ url|path, … }], gbpOnly, notTargeted }
 *                      | [{ url|path, primary, secondary, supporting }]
 */

const norm = (keyword) => String(keyword || '').replace(/\s+/g, ' ').trim().toLowerCase();
const asList = (value) => (value == null ? [] : Array.isArray(value) ? value : [value]);
const keywordOf = (item) => (typeof item === 'string' ? item : item && (item.keyword || item.term || item.kw || item.query));

export function readKeywordList(json) {
  const out = [];
  const visit = (value) => {
    if (typeof value === 'string') out.push(value);
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === 'object') {
      const kw = keywordOf(value);
      if (typeof kw === 'string') out.push(kw);
      else Object.values(value).forEach(visit);
    }
  };
  visit(json && json.keywords ? json.keywords : json);
  return [...new Set(out.map(norm).filter(Boolean))];
}

export function readKeywordMap(json) {
  const pages = [];
  const extras = { gbpOnly: [], notTargeted: [], fallbacks: [] };
  const addPage = (path, entry) => {
    if (!entry || typeof entry !== 'object') return;
    pages.push({
      path,
      status: typeof entry.status === 'string' ? entry.status : undefined,
      primary: asList(entry.primary).map(keywordOf).filter(Boolean),
      secondary: asList(entry.secondary).map(keywordOf).filter(Boolean),
      supporting: asList(entry.supporting).map(keywordOf).filter(Boolean),
    });
  };
  const readExtras = (obj) => {
    for (const key of ['gbpOnly', 'notTargeted']) {
      extras[key].push(...asList(obj && obj[key]).map(keywordOf).filter(Boolean));
    }
    asList(obj && obj.gbpOnly).forEach((item) => {
      if (item && typeof item === 'object' && item.fallback) extras.fallbacks.push({ keyword: keywordOf(item), fallback: item.fallback });
    });
  };

  if (Array.isArray(json)) {
    json.forEach((entry) => addPage(entry.url || entry.path || entry.page, entry));
  } else if (json && typeof json === 'object') {
    readExtras(json);
    const source = json.pages || json.urls || json;
    if (Array.isArray(source)) source.forEach((entry) => addPage(entry.url || entry.path || entry.page, entry));
    else {
      for (const [key, entry] of Object.entries(source)) {
        if (key.startsWith('/')) {
          addPage(key, entry);
          readExtras(entry); // per-page gbpOnly lists, if used
        }
      }
    }
  }
  return { pages: pages.filter((p) => p.path), extras };
}

const STOP = new Set(['a', 'an', 'the', 'in', 'of', 'for', 'to', 'and', 'or', 'on', 'at', 'by', 'with', '&', '+']);
const stem = (word) => {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
};
export function wordSet(text) {
  return new Set(
    String(text || '')
      .toLowerCase()
      .replace(/\(s\)/g, '')
      .replace(/[’']/g, '')
      .split(/[^a-z0-9À-ɏ]+/)
      .filter((w) => w && !STOP.has(w))
      .map(stem)
  );
}

/**
 * @param ctx { list: string[]|null, map: {pages, extras}|null, pages: Map<route, {title, h1}>, report }
 */
export function checkKeywords({ list, map, pages, report }) {
  // Every occurrence is counted (keyword -> where it is listed), so a keyword
  // listed twice on one page, or on a page and in gbpOnly / notTargeted, is
  // caught as well as one owned by two pages (keyword-map.json _meta.rule).
  const places = new Map();
  const add = (kw, where) => {
    const k = norm(kw);
    if (!k) return;
    if (!places.has(k)) places.set(k, []);
    places.get(k).push(where);
  };
  for (const page of map.pages) {
    for (const bucket of ['primary', 'secondary', 'supporting']) page[bucket].forEach((kw) => add(kw, `${page.path} ${bucket}`));
  }
  map.extras.gbpOnly.forEach((kw) => add(kw, 'gbpOnly'));
  map.extras.notTargeted.forEach((kw) => add(kw, 'notTargeted'));
  const assigned = new Set(places.keys());

  // Plan §3.13: an unassigned or double-listed brief keyword is an invariant.
  for (const [kw, where] of places) {
    if (where.length > 1) report.error('keywords.double-owned', null, `"${kw}" listed ${where.length} times: ${where.join(', ')}`);
  }

  const mapPaths = new Set(map.pages.map((page) => page.path));
  for (const { keyword, fallback } of map.extras.fallbacks || []) {
    if (!mapPaths.has(fallback)) report.warn('keywords.fallback-unknown', fallback, `gbpOnly "${keyword}" falls back to a URL that is not a page in the map`);
  }
  for (const page of map.pages) {
    const isLive = pages.has(page.path);
    if (page.status === 'live' && !isLive) report.warn('keywords.status-mismatch', page.path, 'status "live" but the page is not prerendered');
    else if (page.status && page.status !== 'live' && isLive) report.warn('keywords.status-mismatch', page.path, `status "${page.status}" but the page is prerendered — flip it to "live"`);
  }

  if (list) {
    const unassigned = list.filter((kw) => !assigned.has(kw));
    if (unassigned.length) {
      report.error('keywords.unassigned', null, `${unassigned.length} of ${list.length} keywords unassigned: ${unassigned.slice(0, 15).join('; ')}${unassigned.length > 15 ? '; …' : ''}`, unassigned);
    }
    const listed = new Set(list);
    const extra = [...assigned].filter((kw) => !listed.has(kw));
    if (extra.length) report.info('keywords.not-in-list', null, `${extra.length} map keywords not in keyword-list.json: ${extra.slice(0, 10).join('; ')}${extra.length > 10 ? '; …' : ''}`, extra);
  }

  for (const page of map.pages) {
    if (!page.primary.length) continue;
    const live = pages.get(page.path);
    if (!live) {
      report.info('keywords.page-not-live', page.path, `primary "${page.primary.join(' + ')}" — page not prerendered yet`);
      continue;
    }
    const titleWords = wordSet(live.title);
    const h1Words = wordSet(live.h1);
    const checked = new Set(); // "kitchen renovation(s) Winnipeg" variants share one word set
    for (const primary of page.primary) {
      const words = [...wordSet(primary)];
      const signature = [...words].sort().join(' ');
      if (checked.has(signature)) continue;
      checked.add(signature);
      const missTitle = words.filter((w) => !titleWords.has(w));
      const missH1 = words.filter((w) => !h1Words.has(w));
      if (missTitle.length) report.warn('keywords.primary-not-in-title', page.path, `"${primary}" — title lacks: ${missTitle.join(', ')}`);
      if (missH1.length) report.warn('keywords.primary-not-in-h1', page.path, `"${primary}" — h1 lacks: ${missH1.join(', ')}`);
    }
  }
}
