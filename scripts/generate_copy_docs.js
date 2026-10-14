import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle,
  PageBreak,
} from 'docx';
import { parseHtml, decodeEntities, matchKey } from './lib/audit/html.mjs';
import { parseSitemap, cleanPath } from './lib/audit/site.mjs';

// Owner-review copy documents (SEO plan §20): one Markdown + Word file per
// page in website_copy/, plus a master copy and a README index.
//
//   node scripts/generate_copy_docs.js              write website_copy/
//   node scripts/generate_copy_docs.js --dry-run    list the pages, write nothing
//   node scripts/generate_copy_docs.js --out=<dir>  write to <dir> instead
//
// The copy is read from the built site, so run `npm run build` first: every
// route in dist/sitemap.xml plus the 404 page, each from its prerendered
// dist/<route>/index.html. A page's <main> becomes the document: one section
// per top-level block (split again at each further H2), with its headings,
// paragraphs, lists, tables, cards, FAQs, buttons and form fields as the
// blocks below. The navigation and footer (outside <main>)
// come from the home page as "Global Elements". Nothing is hand-kept, so the
// documents always match what the site shows; a warning lists any visible
// text of a page that did not make it into its document.
// Merge any edits the owner made in website_copy/ before re-running: the
// files are overwritten.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const args = process.argv.slice(2);
const outArg = args.findIndex((a) => a === '--out' || a.startsWith('--out='));
const outValue = outArg === -1 ? null : args[outArg].includes('=') ? args[outArg].slice('--out='.length) : args[outArg + 1];
if (outValue !== null && (!outValue || outValue.startsWith('--'))) {
  console.error('usage: node scripts/generate_copy_docs.js [--dry-run] [--out=<dir>]');
  process.exit(2);
}
const OUT_DIR = outValue ? path.resolve(outValue) : path.join(ROOT_DIR, 'website_copy');
const MD_DIR = path.join(OUT_DIR, 'markdown');
const DOCX_DIR = path.join(OUT_DIR, 'word_docx');
const DRY_RUN = args.includes('--dry-run');

// Palette
const COLOR_PRIMARY = '191715'; // Dark charcoal
const COLOR_RED = 'C20917';     // Accent Red
const COLOR_SEAGREEN = '217A8A';// Accent Sea Green
const COLOR_MUTED = '5E5750';   // Muted Gray

// Helper to create docx elements
function docTitle(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.TITLE,
    spacing: { before: 120, after: 120 },
    children: [new TextRun({ text, bold: true, color: COLOR_RED, size: 32, font: 'Calibri' })],
  });
}

function docSubtitle(text) {
  return new Paragraph({
    spacing: { before: 0, after: 200 },
    children: [new TextRun({ text, italics: true, color: COLOR_MUTED, size: 22, font: 'Calibri' })],
  });
}

function docMeta(label, value) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, color: COLOR_PRIMARY, size: 20, font: 'Calibri' }),
      new TextRun({ text: value, color: COLOR_SEAGREEN, size: 20, font: 'Calibri' }),
    ],
  });
}

function docH1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: COLOR_PRIMARY, size: 26, font: 'Calibri' })],
  });
}

function docH2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, color: COLOR_SEAGREEN, size: 22, font: 'Calibri' })],
  });
}

function docH3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 80 },
    children: [new TextRun({ text, bold: true, color: COLOR_PRIMARY, size: 20, font: 'Calibri' })],
  });
}

function docPara(text, options = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 100, line: 276 },
    children: [
      new TextRun({
        text,
        size: 21,
        font: 'Calibri',
        color: options.color || COLOR_PRIMARY,
        bold: !!options.bold,
        italics: !!options.italics,
      }),
    ],
  });
}

function docBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix, bold: true, size: 21, font: 'Calibri', color: COLOR_PRIMARY }));
  }
  children.push(new TextRun({ text, size: 21, font: 'Calibri', color: COLOR_PRIMARY }));
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40, line: 260 },
    children,
  });
}

function docCallout(title, text) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 24, color: COLOR_RED, space: 12 },
    },
    children: [
      new TextRun({ text: `${title}: `, bold: true, color: COLOR_RED, size: 20, font: 'Calibri' }),
      new TextRun({ text: text, italics: true, color: COLOR_PRIMARY, size: 20, font: 'Calibri' }),
    ],
  });
}

// -------------------------------------------------------------
// READING THE BUILT PAGES
// Each element of a page becomes a "unit" (heading, p, leaf text, link,
// image, list, table, faq, card, step, form fields, embed); the units of a
// top-level block become one or more document sections.
// -------------------------------------------------------------

// Never page copy (form controls are read by formUnits).
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template', 'svg', 'audio', 'video', 'canvas', 'head', 'title', 'select', 'option', 'textarea']);
// Tags that start a new line of text; an element without any is "inline only" (a leaf).
const BLOCK_TAGS = new Set([
  'address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3',
  'h4', 'h5', 'h6', 'header', 'hr', 'iframe', 'li', 'main', 'nav', 'ol', 'p', 'section', 'summary', 'table', 'tbody', 'td',
  'tfoot', 'th', 'thead', 'tr', 'ul',
]);
const CARD_KINDS = new Set(['heading', 'p', 'leaf', 'link', 'img']);
const isHeading = (el) => /^h[1-6]$/.test(el.tag);
const isSymbol = (text) => !/[\p{L}\p{N}]/u.test(text);
const classOf = (el) => el.attrs.class || '';
const isSkipped = (el) =>
  SKIP_TAGS.has(el.tag) || el.attrs['aria-hidden'] === 'true' || (el.tag === 'input' && /^(hidden|submit)$/i.test(el.attrs.type || ''));

/** A parsed page with each element's children (elements and text nodes) in document order. */
function readPage(file) {
  const doc = parseHtml(fs.readFileSync(file, 'utf8'));
  const kids = new Map();
  const add = (parent, node) => {
    if (!kids.has(parent)) kids.set(parent, []);
    kids.get(parent).push(node);
  };
  doc.elements.forEach((el) => add(el.parent, { el, start: el.start }));
  doc.texts.forEach((text) => add(text.parent, { text, start: text.start }));
  kids.forEach((list) => list.sort((a, b) => a.start - b.start));
  return { doc, kids, blockCache: new Map() };
}

const childNodes = (P, el) => P.kids.get(el.idx) || [];
const childEls = (P, el) => childNodes(P, el).filter((n) => n.el && !isSkipped(n.el)).map((n) => n.el);
const ownText = (P, el) => childNodes(P, el).filter((n) => n.text).map((n) => decodeEntities(n.text.raw)).join('').trim();

/** True when the element holds a block-level element (so it is not a single line of text). */
function hasBlock(P, el) {
  if (P.blockCache.has(el.idx)) return P.blockCache.get(el.idx);
  const result = childEls(P, el).some((c) => BLOCK_TAGS.has(c.tag) || hasBlock(P, c));
  P.blockCache.set(el.idx, result);
  return result;
}

/** True when the element holds a link or button (so it is not plain text). */
function hasAction(P, el) {
  return childEls(P, el).some((c) => (c.tag === 'a' && c.attrs.href) || c.tag === 'button' || hasAction(P, c));
}

/**
 * Visible text of an element. Block elements, <br> and the whitespace the
 * parser drops between nodes (React's `·<!-- --> <a>`) separate words; across
 * an inline element boundary with no whitespace, a space is added only
 * between two letters or digits ("1<span>day</span>" reads "1 day").
 */
function textIn(P, el) {
  const { html } = P.doc;
  let out = '';
  let gap = '';
  let lastEnd = -1;
  const visit = (node) => {
    for (const n of childNodes(P, node)) {
      if (n.text) {
        const text = decodeEntities(n.text.raw);
        const between = lastEnd === -1 ? '' : html.slice(lastEnd, n.text.start).replace(/<!--[\s\S]*?-->|<[^>]*>/g, '');
        const wordJoin = gap === 'inline' && /[\p{L}\p{N}]$/u.test(out) && /^[\p{L}\p{N}]/u.test(text);
        if (out && (gap === 'space' || /\s/.test(between) || wordJoin)) out += ' ';
        out += text;
        gap = '';
        lastEnd = n.text.end;
      } else if (!isSkipped(n.el)) {
        const block = BLOCK_TAGS.has(n.el.tag) || n.el.tag === 'br';
        gap = block ? 'space' : gap || 'inline';
        visit(n.el);
        gap = block ? 'space' : gap || 'inline';
      }
    }
  };
  visit(el);
  return out.replace(/\s+/g, ' ').trim();
}

/**
 * Texts of an element's children when it has no text of its own and two or
 * more children (pills, meta items, breadcrumbs), separator glyphs dropped;
 * otherwise null.
 */
function childTexts(P, el) {
  const children = childEls(P, el).filter((c) => c.tag !== 'br');
  if (ownText(P, el) || children.length < 2) return null;
  return children.map((c) => textIn(P, c)).filter((t) => t && !isSymbol(t));
}

const keepText = (text) => !!text && !isSymbol(text) && !/^[A-Za-z]$/.test(text); // drops avatar initials and glyphs

function leafRole(el) {
  const name = `${classOf(el)} ${el.attrs['aria-label'] || ''}`;
  if (/breadcrumb/i.test(name)) return 'Breadcrumb';
  if (/badge/i.test(name)) return 'Badge';
  if (/(^|[\s-])(tag|eyebrow|kicker)([\s-]|$)/i.test(name)) return 'Eyebrow';
  return 'Text';
}

function leafUnits(P, el) {
  const role = leafRole(el);
  const parts = childTexts(P, el);
  if (parts && parts.length >= 4 && role !== 'Breadcrumb') return [{ kind: 'list', label: el.attrs['aria-label'] || 'Items', items: [...new Set(parts)] }];
  const text = parts ? parts.join(role === 'Breadcrumb' ? ' / ' : ' · ') : textIn(P, el);
  return keepText(text) ? [{ kind: 'leaf', role, text }] : [];
}

function linkUnit(P, el) {
  const parts = childTexts(P, el);
  // Icon-only links (logo, social) are named by their aria-label; icon-only buttons are skipped.
  const text = (parts ? parts.join(' / ') : textIn(P, el)) || (el.tag === 'a' ? el.attrs['aria-label'] || el.attrs.title || '' : '');
  if (!keepText(text)) return null;
  return { kind: 'link', text, href: el.attrs.href || '', button: el.tag === 'button' || /\bbtn/.test(classOf(el)) };
}

/** <ul>/<ol> whose items are each one line of text; a lone link keeps its URL. */
function listUnit(P, el) {
  const items = childEls(P, el).filter((c) => c.tag === 'li');
  if (!items.length || items.some((li) => hasBlock(P, li))) return null;
  const list = items
    .map((li) => {
      const text = textIn(P, li);
      const links = P.doc.elements.filter((a) => a.tag === 'a' && a.start >= li.start && a.end <= li.end);
      return links.length === 1 && textIn(P, links[0]) === text && links[0].attrs.href ? `${text} (${links[0].attrs.href})` : text;
    })
    .filter(Boolean);
  return list.length ? { kind: 'list', label: el.attrs['aria-label'] || '', items: list } : null;
}

function tableUnit(P, el) {
  const caption = P.doc.elements.find((c) => c.tag === 'caption' && c.start > el.start && c.end <= el.end);
  const rows = P.doc.elements
    .filter((tr) => tr.tag === 'tr' && tr.start > el.start && tr.end <= el.end)
    .map((tr) => {
      const cells = childEls(P, tr).filter((c) => c.tag === 'td' || c.tag === 'th').map((c) => textIn(P, c));
      const inHead = P.doc.elements.some((h) => h.tag === 'thead' && tr.start > h.start && tr.end <= h.end);
      return `${inHead ? '(columns) ' : ''}${cells.join(' | ')}`;
    });
  const label = (caption && textIn(P, caption)) || el.attrs['aria-label'] || 'untitled';
  return { kind: 'list', label: `Table: ${label}`, items: rows };
}

/** Form copy: one "Form fields" list (label, placeholder, choices) plus headings, text and the submit button. */
function formUnits(P, form) {
  const units = [];
  let fields = null;
  let field = null;
  const startField = (text) => {
    if (!fields) {
      fields = { kind: 'list', label: 'Form fields', items: [] };
      units.push(fields);
    }
    field = { text, extras: [] };
    fields.items.push(field);
  };
  // Children, with the <select>s and <textarea>s textIn skips.
  const formEls = (el) => childNodes(P, el)
    .map((n) => n.el)
    .filter((c) => c && (!isSkipped(c) || ((c.tag === 'select' || c.tag === 'textarea') && c.attrs['aria-hidden'] !== 'true')));
  const hasControl = (el) => formEls(el).some((c) => ['input', 'select', 'textarea', 'button', 'label'].includes(c.tag) || hasControl(c));
  const visit = (el) => {
    for (const c of formEls(el)) {
      const type = (c.attrs.type || '').toLowerCase();
      if (isHeading(c) || (c.tag === 'p' && !hasBlock(P, c))) units.push(...unitsOf(P, c));
      else if (c.tag === 'label' || (/label/i.test(classOf(c)) && !hasBlock(P, c))) startField(textIn(P, c));
      else if (c.tag === 'input' || c.tag === 'textarea') {
        const hint = c.attrs.placeholder ? `placeholder "${c.attrs.placeholder}"` : '';
        if (/^(checkbox|radio)$/.test(type)) continue;
        if (!field) startField(c.attrs['aria-label'] || c.attrs.name || 'Field');
        if (hint) field.extras.push(hint);
      } else if (c.tag === 'select') {
        const options = P.doc.elements.filter((o) => o.tag === 'option' && o.start > c.start && o.end <= c.end).map((o) => textIn(P, o));
        if (!field) startField(c.attrs['aria-label'] || c.attrs.name || 'Choice');
        if (options.length > 1) field.extras.push(`options: ${options.join(' / ')}`);
      } else if (c.tag === 'button' && type !== 'submit') {
        // Choice chips: options of the field above them.
        if (!field) startField('Choice');
        const text = textIn(P, c);
        if (text) field.extras.push(text);
      } else if (c.tag === 'button' || c.tag === 'a') {
        const unit = linkUnit(P, c);
        if (unit) units.push(unit);
      } else if (!hasBlock(P, c) && !hasControl(c)) units.push(...unitsOf(P, c));
      else visit(c);
    }
  };
  visit(form);
  if (fields) {
    fields.items = fields.items.map((f) => {
      const chips = f.extras.filter((x) => !/^(placeholder|options):? /.test(x));
      const notes = f.extras.filter((x) => /^(placeholder|options):? /.test(x));
      if (chips.length) notes.push(`choices: ${chips.join(' / ')}`);
      return notes.length ? `${f.text} (${notes.join('; ')})` : f.text;
    });
  }
  return units;
}

/** A question (button, summary, or a heading holding a button) followed by its answer. */
function faqUnit(P, el) {
  const children = childEls(P, el);
  if (children.length < 2) return null;
  const [first, ...rest] = children;
  const isQuestion = first.tag === 'button' || first.tag === 'summary'
    || (isHeading(first) && childEls(P, first).length === 1 && childEls(P, first)[0].tag === 'button');
  if (!isQuestion || rest.some((c) => isHeading(c) || c.tag === 'button')) return null;
  const q = textIn(P, first);
  const a = rest.map((c) => textIn(P, c)).filter(Boolean).join('\n\n');
  return q && a ? { kind: 'faq', q, a } : null;
}

const linkLabel = (u) => (u.href ? `${u.text} (links to ${u.href})` : u.text);

/** A small block with one H3-H6 (service card, process step, blog card, gallery tile). */
function cardUnit(el, units) {
  const at = units.findIndex((u) => u.kind === 'heading');
  const before = units.slice(0, at);
  const after = units.slice(at + 1);
  const num = before.find((u) => u.kind === 'leaf' && /^\d{1,3}$/.test(u.text));
  const category = before.filter((u) => u.kind === 'leaf' && u !== num).map((u) => u.text).join(' · ');
  const copy = [...before.filter((u) => u.kind === 'p'), ...after.filter((u) => u.kind === 'p' || u.kind === 'leaf')]
    .map((u) => u.text)
    .concat(units.filter((u) => u.kind === 'img').map((u) => `(Image: ${u.alt})`))
    .join('\n\n');
  const actions = units.filter((u) => u.kind === 'link').map(linkLabel);
  if (el.tag === 'a' && el.attrs.href) actions.push(`Whole card links to ${el.attrs.href}`);
  const title = units[at].text;
  return num
    ? { kind: 'step', num: num.text, title, text: copy, action: actions.join('; ') }
    : { kind: 'card', title, category, copy, action: actions.join('; ') };
}

/** Units of an element, in document order. `top` = a page block (never itself a card). */
function unitsOf(P, el, opts = {}) {
  if (isSkipped(el)) return [];
  const { tag } = el;
  if (isHeading(el)) {
    const text = textIn(P, el);
    return text ? [{ kind: 'heading', level: Number(tag[1]), text }] : [];
  }
  if (tag === 'img') return el.attrs.alt && el.attrs.alt.trim() ? [{ kind: 'img', alt: el.attrs.alt.trim() }] : [];
  if (tag === 'iframe') return [{ kind: 'embed', text: el.attrs.title || el.attrs['aria-label'] || 'Embedded content' }];
  if (tag === 'table') return [tableUnit(P, el)];
  if (tag === 'form') return formUnits(P, el);
  if (tag === 'ul' || tag === 'ol') {
    const list = listUnit(P, el);
    if (list) return [list];
  }
  if ((tag === 'a' || tag === 'button') && !hasBlock(P, el)) {
    const link = linkUnit(P, el);
    return link ? [link] : [];
  }
  if ((tag === 'p' || tag === 'blockquote') && !hasBlock(P, el)) {
    const text = textIn(P, el);
    const links = childEls(P, el).filter((c) => c.tag === 'a');
    if (links.length === 1 && textIn(P, links[0]) === text) return unitsOf(P, links[0]); // a paragraph that is just a link
    return keepText(text) ? [{ kind: 'p', text, quote: tag === 'blockquote' }] : [];
  }
  // One line of text: a leaf. Without text of its own but holding links (a
  // nav item, a CTA group, a phone link beside a place name), its parts are
  // read one by one instead, so the links keep their URLs.
  if (!hasBlock(P, el) && (ownText(P, el) || !hasAction(P, el) || leafRole(el) === 'Breadcrumb')) return leafUnits(P, el);

  // A container.
  const faq = faqUnit(P, el);
  if (faq) return [faq];
  const children = childEls(P, el);
  // Every child one short line of text (a stat card, a ticker): one item.
  const lines = !ownText(P, el) && children.length >= 2
    && children.every((c) => !hasBlock(P, c) && !hasAction(P, c) && !isHeading(c) && !['a', 'button', 'p', 'img', 'input'].includes(c.tag));
  if (lines) {
    const lineText = (c) => (childTexts(P, c) || [textIn(P, c)]).join(' · ');
    const parts = [...new Set(children.map(lineText).filter(keepText))];
    if (parts.length >= 3) return [{ kind: 'list', label: el.attrs['aria-label'] || 'Items', items: parts }];
    if (parts.length) return [{ kind: 'leaf', role: parts.length === 2 ? 'Item' : 'Text', text: parts.join(' — ') }];
    return [];
  }
  const childUnits = (cards) => childNodes(P, el).flatMap((n) => {
    if (n.el) return unitsOf(P, n.el, { cards });
    const text = decodeEntities(n.text.raw).replace(/\s+/g, ' ').trim();
    return keepText(text) ? [{ kind: 'leaf', role: 'Text', text }] : [];
  });
  // The outermost block with a single H3-H6 and only text, links and images in it is a card.
  if (!opts.top && opts.cards !== false) {
    const flat = childUnits(false);
    const headings = flat.filter((u) => u.kind === 'heading');
    if (headings.length === 1 && headings[0].level >= 3 && flat.length >= 2 && flat.every((u) => CARD_KINDS.has(u.kind))) {
      return [cardUnit(el, flat)];
    }
  }
  return childUnits(opts.cards);
}

/** Unit -> the document's item types (label-value, para, list, card, step, faq, callout). */
function toItem(u) {
  switch (u.kind) {
    case 'heading':
      return { type: 'label-value', label: u.level === 1 ? 'Headline (H1)' : `Heading (H${u.level})`, value: u.text, level: u.level };
    case 'p':
      return { type: 'para', label: u.quote ? 'Quote' : 'Paragraph', text: u.text };
    case 'leaf':
      return u.text.length > 160 ? { type: 'para', label: 'Paragraph', text: u.text } : { type: 'label-value', label: u.role, value: u.text };
    case 'link':
      return { type: 'label-value', label: u.button ? 'Button' : 'Link', value: linkLabel(u) };
    case 'img':
      return { type: 'label-value', label: 'Image alt text', value: u.alt };
    case 'embed':
      return { type: 'label-value', label: 'Embedded', value: u.text };
    case 'list':
      return { type: 'list', label: u.label || 'List', list: u.items };
    case 'faq':
      return { type: 'faq', q: u.q, a: u.a };
    case 'card':
      return { type: 'card', title: u.title, category: u.category, copy: u.copy, action: u.action };
    case 'step':
      return { type: 'step', num: u.num, title: u.title, text: u.text, action: u.action };
    default:
      return null;
  }
}

// The site-wide blocks outside <main>, by class.
const CHROME_NAMES = { 'header-wrapper': 'Main Navigation & Services Menu', 'site-footer': 'Global Footer' };

/** "ticker-section" -> "Ticker"; the label of a block without a heading. */
function blockName(el) {
  const cls = classOf(el).split(/\s+/).find((c) => c && !/^(container|reveal)$/.test(c));
  if (CHROME_NAMES[cls]) return CHROME_NAMES[cls];
  const name = el.attrs['aria-label'] || (cls ? cls.replace(/-?section$/, '').replace(/-/g, ' ') : '');
  return name ? name[0].toUpperCase() + name.slice(1) : 'Page content';
}

/** Tidies one section's items: list labels, duplicates, paragraph and question numbers. */
function finishItems(items) {
  const out = [];
  const seen = new Set();
  for (const item of items) {
    const key = JSON.stringify(item);
    if (seen.has(key)) continue;
    seen.add(key);
    // "COMPANY" then a list of links: the short line names the list.
    const prev = out[out.length - 1];
    const prevText = prev && (prev.type === 'para' ? prev.text : prev.type === 'label-value' && prev.label === 'Text' ? prev.value : null);
    if (item.type === 'list' && /^(List|Items)$/.test(item.label) && prevText && prevText.length <= 60 && !/[.!?]$/.test(prevText)) {
      out.pop();
      out.push({ ...item, label: prevText });
      continue;
    }
    out.push(item);
  }
  let para = 0;
  let faq = 0;
  return out.map((item) => {
    if (item.type === 'para' && item.label === 'Paragraph') return { ...item, label: `Paragraph ${(para += 1)}` };
    if (item.type === 'faq') return { ...item, q: `Q${(faq += 1)}: ${item.q}` };
    return item;
  });
}

/** One block of the page -> sections (a further H1/H2 starts a new one; an eyebrow just before it moves with it). */
function blockSections(P, block, notes) {
  const sections = [];
  let current = null;
  const open = () => {
    current = { items: [], hasTitle: false };
    sections.push(current);
  };
  open();
  for (const item of unitsOf(P, block, { top: true }).map(toItem).filter(Boolean)) {
    if (item.level && item.level <= 2) {
      if (current.hasTitle) {
        const last = current.items[current.items.length - 1];
        const carried = last && last.label === 'Eyebrow' ? current.items.pop() : null;
        open();
        if (carried) current.items.push(carried);
      }
      current.hasTitle = true;
    }
    current.items.push(item);
  }
  return sections
    .filter((s) => s.items.length)
    .map((s) => {
      const h1 = s.items.find((i) => i.level === 1);
      const h2 = s.items.find((i) => i.level === 2);
      const any = s.items.find((i) => i.level);
      const card = s.items.find((i) => i.type === 'card' || i.type === 'step');
      return {
        heading: h1 ? 'Page Hero' : h2 || any ? (h2 || any).value : card ? card.title : blockName(block),
        notes,
        small: !s.hasTitle && !any && s.items.length === 1 && s.items[0].type === 'label-value',
        items: s.items,
      };
    });
}

/** Sections for the given top-level blocks (a lone line such as a breadcrumb joins the next block). */
function pageSections(P, blocks, notesOf) {
  const sections = [];
  let carry = [];
  blocks.forEach((block) => {
    const tagName = `${block.tag}${classOf(block) ? `.${classOf(block).split(/\s+/)[0]}` : ''}`;
    for (const section of blockSections(P, block, notesOf(block, tagName))) {
      if (section.small) {
        carry.push(...section.items);
        continue;
      }
      section.items = [...carry, ...section.items];
      carry = [];
      sections.push(section);
    }
  });
  if (carry.length) {
    if (sections.length) sections[sections.length - 1].items.push(...carry);
    else sections.push({ heading: 'Page content', notes: '', items: carry });
  }
  return sections.map((s, i) => ({ heading: `${i + 1}. ${s.heading}`, notes: s.notes, items: finishItems(s.items) }));
}

/** <main>'s blocks: its children, unwrapping single-child wrappers. */
function mainBlocks(P, main) {
  let blocks = childEls(P, main);
  while (blocks.length === 1 && hasBlock(P, blocks[0]) && !isHeading(blocks[0])) blocks = childEls(P, blocks[0]);
  return blocks;
}

const headMeta = (P, name) => {
  const meta = P.doc.elements.find((el) => el.tag === 'meta' && (el.attrs.name || '').toLowerCase() === name);
  return meta ? (meta.attrs.content || '').trim() : '';
};
const pageName = (P) => {
  const title = P.doc.elements.find((el) => el.tag === 'title');
  return title ? decodeEntities(title.raw || '').split(' | ')[0].trim() : '';
};

// Old file names kept for the pages the hand-kept version named differently.
const KEY_BY_ROUTE = { '/': 'HOME_PAGE', '/services': 'SERVICES_OVERVIEW', '/projects': 'OUR_PROJECTS' };
function keyFor(route) {
  if (KEY_BY_ROUTE[route]) return KEY_BY_ROUTE[route];
  const key = route.replace(/^\/(services\/)?/, '').toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
  // Long blog slugs: keep paths short (Windows' 260-character limit).
  return key.length > 60 ? key.slice(0, 60).replace(/_[^_]*$/, '') : key;
}

function routeFile(route) {
  const dir = path.join(DIST_DIR, ...route.split('/').filter(Boolean));
  const candidates = route === '/' ? [path.join(DIST_DIR, 'index.html')] : [path.join(dir, 'index.html'), `${dir}.html`];
  return candidates.find((file) => fs.existsSync(file));
}

const rel = (file) => path.relative(ROOT_DIR, file).replace(/\\/g, '/');
const inside = (node, el) => node.start > el.start && node.end <= el.end;

/** Self-check: the page's visible text nodes (within `inScope`) missing from its document. Should be none. */
function lostText(P, page, inScope) {
  const key = matchKey(generateMarkdown(page));
  const hidden = [];
  P.doc.elements.forEach((el) => {
    hidden[el.idx] = isSkipped(el) || (el.parent >= 0 && hidden[el.parent]);
  });
  return P.doc.texts
    .filter((t) => t.parent >= 0 && !hidden[t.parent] && inScope(t))
    .map((t) => decodeEntities(t.raw).replace(/\s+/g, ' ').trim())
    .filter((t) => keepText(t) && !key.includes(matchKey(t)));
}

function contentPage(route, file, { key, routeLabel } = {}) {
  const P = readPage(file);
  const main = P.doc.elements.find((el) => el.tag === 'main');
  if (!main) throw new Error(`${rel(file)} has no <main>: is it a prerendered page?`);
  const name = pageName(P) || route;
  const page = {
    key: key || keyFor(route),
    title: `Bridgeland Builders — ${name} — Page Copy`,
    route: routeLabel || route,
    description: headMeta(P, 'description') || `The ${name} page.`,
    sections: pageSections(P, mainBlocks(P, main), (block, tagName) => `Read from the built page (${tagName}).`),
  };
  page.lost = lostText(P, page, (t) => inside(t, main));
  return page;
}

// Header, navigation and footer: everything in the app root except <main>, from the home page.
function globalPage(file) {
  const P = readPage(file);
  const main = P.doc.elements.find((el) => el.tag === 'main');
  if (!main) throw new Error(`${rel(file)} has no <main>: is it a prerendered page?`);
  const root = P.doc.elements[main.parent];
  const page = {
    key: 'GLOBAL_ELEMENTS',
    title: 'Bridgeland Builders — Global Elements & Site-Wide Copy',
    route: 'Across all pages (navigation, services menu, footer)',
    description: 'Copy outside the page body that appears on every page, read from the built home page.',
    sections: pageSections(P, childEls(P, root).filter((el) => el !== main), (block, tagName) => `Appears on every page (${tagName}).`),
  };
  page.lost = lostText(P, page, (t) => inside(t, root) && !inside(t, main));
  return page;
}

/** Every page to document, in order: global elements, the sitemap's routes, the 404 page. */
function loadPages() {
  const sitemapFile = path.join(DIST_DIR, 'sitemap.xml');
  if (!fs.existsSync(DIST_DIR) || !fs.existsSync(sitemapFile)) {
    throw new Error(`No built site at ${rel(DIST_DIR)}/ (sitemap.xml missing). The copy docs are read from the prerendered pages: run \`npm run build\` first.`);
  }
  const routes = [...new Set(parseSitemap(fs.readFileSync(sitemapFile, 'utf8')).urls.map((u) => cleanPath(new URL(u.loc).pathname)))];
  const missing = routes.filter((route) => !routeFile(route));
  if (missing.length) {
    throw new Error(`dist/sitemap.xml lists ${missing.length} route(s) with no prerendered page: ${missing.join(', ')}. Rebuild with \`npm run build\`.`);
  }
  const pages = [globalPage(routeFile('/')), ...routes.map((route) => contentPage(route, routeFile(route)))];
  const notFound = path.join(DIST_DIR, '404.html');
  if (fs.existsSync(notFound)) pages.push(contentPage('/404', notFound, { key: '404_PAGE', routeLabel: '/404 (or any invalid path)' }));
  // File ids: "NN_KEY", numbered in page order and zero-padded.
  const width = Math.max(2, String(pages.length - 1).length);
  pages.forEach((page, i) => {
    page.id = `${String(i).padStart(width, '0')}_${page.key}`;
  });
  return pages;
}

// -------------------------------------------------------------
// MARKDOWN GENERATOR
// -------------------------------------------------------------

function generateMarkdown(page) {
  let md = `# ${page.title}\n\n`;
  md += `> **Website:** Bridgeland Builders (Winnipeg, Manitoba)\n`;
  md += `> **Page Route / URL:** \`${page.route}\`\n`;
  md += `> **Purpose:** ${page.description}\n`;
  md += `> **Note for Editor (Graeme):** Feel free to adjust any of the wording below. Each section corresponds directly to the live component on the website.\n\n`;
  md += `---\n\n`;

  page.sections.forEach((section) => {
    md += `## ${section.heading}\n\n`;
    if (section.notes) {
      md += `*Component Note: ${section.notes}*\n\n`;
    }

    section.items.forEach((item) => {
      if (item.type === 'label-value') {
        md += `**${item.label}:** ${item.value}\n\n`;
      } else if (item.type === 'para') {
        md += `### ${item.label}\n\n${item.text}\n\n`;
      } else if (item.type === 'list') {
        md += `### ${item.label}\n\n`;
        item.list.forEach((li) => {
          md += `- ${li}\n`;
        });
        md += `\n`;
      } else if (item.type === 'card') {
        md += `### ${item.title}${item.category ? ` (${item.category})` : ''}\n\n`;
        if (item.copy) md += `${item.copy}\n\n`;
        if (item.action) md += `*Action / CTA:* ${item.action}\n\n`;
      } else if (item.type === 'step') {
        md += `### Step ${item.num}: ${item.title}\n\n`;
        if (item.text) md += `${item.text}\n\n`;
        if (item.action) md += `*Action / CTA:* ${item.action}\n\n`;
      } else if (item.type === 'faq') {
        md += `### ${item.q}\n\n`;
        md += `**Answer:** ${item.a}\n\n`;
      } else if (item.type === 'callout') {
        md += `> **${item.title}:** ${item.text}\n\n`;
      }
    });

    md += `---\n\n`;
  });

  return md;
}

// -------------------------------------------------------------
// DOCX GENERATOR
// -------------------------------------------------------------

/** Word paragraphs for one page's sections (shared by the page and master documents). */
function docxSections(page) {
  const children = [];
  const paras = (text) => String(text || '').split(/\n\n+/).filter(Boolean).map((t) => docPara(t));
  page.sections.forEach((section) => {
    children.push(docH1(section.heading));
    if (section.notes) {
      children.push(docPara(`Component Note: ${section.notes}`, { italics: true, color: COLOR_MUTED }));
    }

    section.items.forEach((item) => {
      if (item.type === 'label-value') {
        children.push(docMeta(item.label, item.value));
      } else if (item.type === 'para') {
        children.push(docH3(item.label));
        children.push(docPara(item.text));
      } else if (item.type === 'list') {
        children.push(docH3(item.label));
        item.list.forEach((li) => {
          children.push(docBullet(li));
        });
      } else if (item.type === 'card') {
        children.push(docH2(`${item.title}${item.category ? ` [${item.category}]` : ''}`));
        children.push(...paras(item.copy));
        if (item.action) children.push(docMeta('Action / Button', item.action));
      } else if (item.type === 'step') {
        children.push(docH2(`Step ${item.num}: ${item.title}`));
        children.push(...paras(item.text));
        if (item.action) children.push(docMeta('Action / Button', item.action));
      } else if (item.type === 'faq') {
        children.push(docH2(item.q));
        children.push(...paras(`Answer: ${item.a}`));
      } else if (item.type === 'callout') {
        children.push(docCallout(item.title, item.text));
      }
    });

    children.push(docPara(''));
  });
  return children;
}

function generateDocx(page) {
  const children = [];

  children.push(docTitle(page.title));
  children.push(docSubtitle(`Bridgeland Builders • Winnipeg, Manitoba • URL: ${page.route}`));
  children.push(docCallout('Note for Graeme (Editor)', 'Feel free to edit any text directly in this document or in Google Docs. Every section below maps directly to the live website.'));
  children.push(docPara(''));
  children.push(...docxSections(page));

  return new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });
}

// -------------------------------------------------------------
// MASTER DOCUMENT GENERATOR (ALL-IN-ONE)
// -------------------------------------------------------------

function generateMasterMarkdown(pages) {
  let md = `# Bridgeland Builders — Complete Website Master Copy\n\n`;
  md += `> **Company:** Bridgeland Builders (Winnipeg, Manitoba)\n`;
  md += `> **Prepared for:** Graeme & Team\n`;
  md += `> **Date:** ${new Date().toISOString().slice(0, 10)}\n`;
  md += `> **Purpose:** This document contains ALL text, headings, buttons, lists, testimonials, FAQs, and metadata across every page of the Bridgeland Builders website.\n\n`;
  md += `---\n\n`;

  md += `## Table of Contents\n\n`;
  pages.forEach((p, idx) => {
    md += `${idx + 1}. [${p.title}](#${p.id.toLowerCase().replace(/_/g, '-')}) (Route: \`${p.route}\`)\n`;
  });
  md += `\n---\n\n`;

  pages.forEach((page) => {
    md += `<a id="${page.id.toLowerCase().replace(/_/g, '-')}"></a>\n\n`;
    md += generateMarkdown(page);
    md += `\n\n\\pagebreak\n\n`;
  });

  return md;
}

function generateMasterDocx(pages) {
  const children = [];

  children.push(docTitle('Bridgeland Builders — Complete Website Master Copy'));
  children.push(docSubtitle('All Website Pages, Sections, FAQs, and Interactive Copy Compiled for Review and Editing'));
  children.push(docCallout('Prepared for Graeme', `This single document compiles the copy from all ${pages.length} website pages. You can edit this file directly or upload it to Google Drive to edit it in Google Docs.`));
  children.push(docPara(''));

  children.push(docH1('Table of Contents'));
  pages.forEach((p, idx) => {
    children.push(docBullet(`${idx + 1}. ${p.title} (${p.route})`));
  });

  children.push(new Paragraph({ children: [new PageBreak()] }));

  pages.forEach((page, pIdx) => {
    children.push(docTitle(page.title));
    children.push(docSubtitle(`Page Route: ${page.route}`));
    children.push(docPara(`Purpose: ${page.description}`));
    children.push(docPara(''));
    children.push(...docxSections(page));

    if (pIdx < pages.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  });

  return new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });
}

// -------------------------------------------------------------
// MAIN EXECUTION
// -------------------------------------------------------------

async function run() {
  const pagesData = loadPages();
  for (const page of pagesData.filter((p) => p.lost.length)) {
    console.warn(`${page.id}: ${page.lost.length} text snippet(s) on the built page are not in the document: ${page.lost.slice(0, 5).map((t) => JSON.stringify(t.slice(0, 80))).join(', ')}`);
  }
  if (DRY_RUN) {
    // Builds every page's content (and the Markdown) without writing a file.
    for (const page of pagesData) {
      const sections = page.sections.length;
      const chars = generateMarkdown(page).length;
      console.log(`${page.id.padEnd(48)} ${page.route.padEnd(52)} ${sections} sections, ${chars} chars`);
    }
    console.log(`\n${pagesData.length} pages (dry run: nothing written to ${OUT_DIR})`);
    return;
  }
  console.log(`Starting generation for ${pagesData.length} pages into ${OUT_DIR} ...`);
  fs.mkdirSync(MD_DIR, { recursive: true });
  fs.mkdirSync(DOCX_DIR, { recursive: true });

  // 1. Generate individual Markdown files
  for (const page of pagesData) {
    const mdContent = generateMarkdown(page);
    const mdPath = path.join(MD_DIR, `${page.id}.md`);
    fs.writeFileSync(mdPath, mdContent, 'utf-8');
    console.log(`Saved Markdown: ${page.id}.md`);

    // 2. Generate individual DOCX files
    const doc = generateDocx(page);
    const buffer = await Packer.toBuffer(doc);
    const docxPath = path.join(DOCX_DIR, `${page.id}.docx`);
    fs.writeFileSync(docxPath, buffer);
    console.log(`Saved Word DOCX: ${page.id}.docx`);
  }

  // 3. Generate Master Markdown
  const masterMd = generateMasterMarkdown(pagesData);
  const masterMdPath = path.join(OUT_DIR, 'BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.md');
  fs.writeFileSync(masterMdPath, masterMd, 'utf-8');
  console.log('Saved Master Markdown: BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.md');

  // 4. Generate Master Word DOCX
  const masterDoc = generateMasterDocx(pagesData);
  const masterBuffer = await Packer.toBuffer(masterDoc);
  const masterDocxPath = path.join(OUT_DIR, 'BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.docx');
  fs.writeFileSync(masterDocxPath, masterBuffer);
  console.log('Saved Master Word DOCX: BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.docx');

  // 5. Generate Client Instructions README
  const readmeContent = `# Bridgeland Builders — Website Content & Copy Documents

This folder contains all copy and content from the **Bridgeland Builders** website, organized separately page by page, as well as in an all-in-one Master document.

## How to Share with Graeme via Google Drive

1. **Option A: Individual Page Documents (Recommended for targeted review)**
   - Upload the \`.docx\` files from \`word_docx/\` to your Google Drive folder.
   - Right-click each file in Google Drive and select **Open with > Google Docs**.
   - Google Drive will automatically convert them into Google Docs without any loss of formatting.
   - Click the **Share** button in Google Drive and add Graeme with **Editor** permissions.

2. **Option B: All-in-One Master Document**
   - Upload \`BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.docx\` to Google Drive.
   - Open it in Google Docs and share it directly with Graeme.
   - Graeme can review the entire site in a single document with a full Table of Contents.

3. **Option C: Markdown Files**
   - If you prefer Markdown, all raw \`.md\` files are available in the \`markdown/\` folder.

---

## File Directory

### Master Files:
- \`BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.docx\` (Master Word document containing all pages)
- \`BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.md\` (Master Markdown document containing all pages)

### Individual Page Files:
| # | Page Name | Website Route | Markdown File | Word (.docx) File |
|---|---|---|---|---|
${pagesData
  .map((p) => `| ${p.id.split('_')[0]} | ${p.title.replace(/^Bridgeland Builders — /, '').replace(/ — Page Copy$/, '')} | \`${p.route}\` | \`${p.id}.md\` | \`${p.id}.docx\` |`)
  .join('\n')}
`;
  fs.writeFileSync(path.join(OUT_DIR, 'README.md'), readmeContent, 'utf-8');
  console.log(`Saved README: ${path.join(OUT_DIR, 'README.md')}`);

  // Files from an earlier run whose page id changed are not overwritten: list them.
  const written = new Set(pagesData.flatMap((p) => [`${p.id}.md`, `${p.id}.docx`]));
  const stale = [MD_DIR, DOCX_DIR].flatMap((dir) => fs.readdirSync(dir).filter((f) => !written.has(f)).map((f) => path.join(path.basename(dir), f)));
  if (stale.length) console.warn(`\n${stale.length} older file(s) not from this run (merge any owner edits, then delete them):\n  ${stale.join('\n  ')}`);

  console.log('All documents generated successfully!');
}

run().catch((err) => {
  console.error('Error generating copy documents:', err.message || err);
  process.exit(1);
});
