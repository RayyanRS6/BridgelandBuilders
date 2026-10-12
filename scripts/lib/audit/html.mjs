/**
 * A tiny, dependency-free HTML tokenizer for the SEO audit.
 *
 * It is not a full HTML5 parser. It only has to read the HTML our own
 * prerenderer writes (React's renderToString output inside index.html), which
 * is well formed: every non-void element is closed explicitly. That keeps a
 * stack-based approach accurate and fast (~50 pages in well under a second).
 *
 * parseHtml() returns a flat list of elements (with parent links and the
 * character ranges they cover) plus the text nodes, which is enough for every
 * check the audit runs: head tags, landmarks, headings, links, images, ancestor
 * classes (.reveal) and visible text.
 */

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr',
]);
// Elements whose content is not markup.
const RAW_TEXT = new Set(['script', 'style', 'textarea', 'title']);
// Elements whose text is never visible page copy.
const NON_VISIBLE = new Set(['script', 'style', 'noscript', 'template', 'svg', 'head', 'title']);

const TOKEN_RE =
  /<!--[\s\S]*?-->|<![^>]*>|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/g;
const ATTR_RE = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;

function parseAttrs(source) {
  const attrs = {};
  if (!source) return attrs;
  ATTR_RE.lastIndex = 0;
  let m;
  while ((m = ATTR_RE.exec(source))) {
    const name = m[1].toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    if (!(name in attrs)) attrs[name] = decodeEntities(value);
  }
  return attrs;
}

/**
 * @returns {{ html: string, elements: Array<object>, texts: Array<object> }}
 * element: { idx, tag, attrs, start, openEnd, closeStart, end, parent, raw? }
 * text:    { start, end, raw, parent }
 */
export function parseHtml(html) {
  const elements = [];
  const texts = [];
  const stack = [];
  const top = () => (stack.length ? stack[stack.length - 1] : -1);
  const pushText = (start, end) => {
    const raw = html.slice(start, end);
    if (raw.trim()) texts.push({ start, end, raw, parent: top() });
  };

  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let m;
  while ((m = TOKEN_RE.exec(html))) {
    if (m.index > last) pushText(last, m.index);
    last = TOKEN_RE.lastIndex;
    const token = m[0];
    if (token.startsWith('<!')) continue; // comment or doctype

    if (m[1]) {
      // Closing tag: close the nearest open element with that name (and any
      // unclosed elements above it).
      const tag = m[1].toLowerCase();
      for (let i = stack.length - 1; i >= 0; i -= 1) {
        if (elements[stack[i]].tag !== tag) continue;
        while (stack.length > i) {
          const el = elements[stack.pop()];
          el.closeStart = m.index;
          el.end = last;
        }
        break;
      }
      continue;
    }

    const tag = m[2].toLowerCase();
    const el = {
      idx: elements.length,
      tag,
      attrs: parseAttrs(m[3]),
      start: m.index,
      openEnd: last,
      closeStart: -1,
      end: -1,
      parent: top(),
    };
    elements.push(el);

    if (m[4] === '/' || VOID.has(tag)) {
      el.closeStart = last;
      el.end = last;
      continue;
    }

    if (RAW_TEXT.has(tag)) {
      const closeRe = new RegExp(`</${tag}\\s*>`, 'ig');
      closeRe.lastIndex = last;
      const close = closeRe.exec(html);
      el.closeStart = close ? close.index : html.length;
      el.end = close ? closeRe.lastIndex : html.length;
      el.raw = html.slice(last, el.closeStart);
      if ((tag === 'title' || tag === 'textarea') && el.raw.trim()) {
        texts.push({ start: last, end: el.closeStart, raw: el.raw, parent: el.idx });
      }
      last = el.end;
      TOKEN_RE.lastIndex = last;
      continue;
    }

    stack.push(el.idx);
  }
  if (last < html.length) pushText(last, html.length);
  for (const idx of stack) {
    elements[idx].closeStart = html.length;
    elements[idx].end = html.length;
  }

  const doc = { html, elements, texts };
  doc.hidden = buildHiddenFlags(doc);
  return doc;
}

function buildHiddenFlags(doc) {
  // hidden[i] = element i (or an ancestor) never shows as page copy.
  const flags = new Array(doc.elements.length);
  for (const el of doc.elements) {
    flags[el.idx] = NON_VISIBLE.has(el.tag) || (el.parent >= 0 && flags[el.parent]);
  }
  return flags;
}

/* ------------------------------------------------------------- entities */
const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘',
  rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', hellip: '…', copy: '©',
  reg: '®', trade: '™', middot: '·', bull: '•', times: '×', larr: '←',
  rarr: '→', deg: '°', frac12: '½', eacute: 'é', egrave: 'è', icirc: 'î',
};

export function decodeEntities(text) {
  if (!text || text.indexOf('&') === -1) return text || '';
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (all, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : all;
    }
    const named = NAMED[body.toLowerCase()];
    return named === undefined ? all : named;
  });
}

/* --------------------------------------------------------------- queries */
export const byTag = (doc, tag) => doc.elements.filter((el) => el.tag === tag);

export function classesOf(el) {
  const value = el.attrs.class || el.attrs.classname || '';
  return new Set(value.split(/\s+/).filter(Boolean));
}

export function ancestors(doc, el) {
  const out = [];
  for (let p = el.parent; p >= 0; p = doc.elements[p].parent) out.push(doc.elements[p]);
  return out;
}

export function isInside(el, range) {
  return !!range && el.start >= range.start && el.end <= range.end;
}

/** Inner range of an element. */
export const innerRange = (el) => ({ start: el.openEnd, end: el.closeStart });

/**
 * Visible text between two offsets: decoded text nodes, skipping script,
 * style, noscript, template, svg and head content. `joiner` goes between nodes.
 */
export function textBetween(doc, start, end, joiner = ' ') {
  const parts = [];
  // Text nodes are stored in document order: binary-search the first one.
  let lo = 0;
  let hi = doc.texts.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (doc.texts[mid].start < start) lo = mid + 1;
    else hi = mid;
  }
  for (let i = lo; i < doc.texts.length; i += 1) {
    const node = doc.texts[i];
    if (node.start >= end) break;
    if (node.end > end) continue;
    if (node.parent >= 0 && doc.hidden[node.parent]) continue;
    parts.push(decodeEntities(node.raw));
  }
  return parts.join(joiner);
}

export function textOf(doc, el, joiner = ' ') {
  return textBetween(doc, el.openEnd, el.closeStart, joiner).replace(/\s+/g, ' ').trim();
}

/** The page's first <body> range, or the whole document. */
export function bodyRange(doc) {
  const body = doc.elements.find((el) => el.tag === 'body');
  return body ? innerRange(body) : { start: 0, end: doc.html.length };
}

/**
 * The page's main content range: the single <main>; else React's Suspense
 * boundary (<!--$--> … <!--/$-->) that wraps the routed page; else the body.
 */
export function mainRange(doc) {
  const main = doc.elements.find((el) => el.tag === 'main');
  if (main) return { ...innerRange(main), source: 'main' };
  const open = doc.html.indexOf('<!--$-->');
  const close = doc.html.lastIndexOf('<!--/$-->');
  if (open !== -1 && close > open) return { start: open, end: close, source: 'suspense' };
  return { ...bodyRange(doc), source: 'body' };
}

/** Lower-cased, whitespace-free, quote/dash-normalised text for "is X on the page" checks. */
export function matchKey(text) {
  return decodeEntities(String(text || ''))
    .replace(/<[^>]*>/g, '')
    .replace(/[‘’‛′`]/g, "'")
    .replace(/[“”″]/g, '"')
    .replace(/[‐-―]/g, '-')
    .replace(/…/g, '...')
    .replace(/\s+/g, '')
    .toLowerCase();
}

export const wordCount = (text) => (String(text).trim().match(/\S+/g) || []).length;
