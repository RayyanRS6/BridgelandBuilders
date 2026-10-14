/**
 * Fact drift (plan §12, one fact = one value). Pages and data files read the
 * typical timelines from src/data/facts.js TIMELINES, but blog posts
 * (blog-raw/*.json) are written content with their own wording. This check
 * reads every built page and warns when a range of weeks given for a service
 * disagrees with TIMELINES (e.g. "most bathrooms take three to four weeks").
 *
 * It is deliberately conservative: a range only counts when a service word is
 * tied to it in the same clause, either
 *   - after it, through "for …" ("4–8 weeks for a typical basement",
 *     "two to three weeks of on-site work for a bathroom"), or
 *   - before it, within a few words and no clause break ("a kitchen four to
 *     six weeks", "Bathroom: 2–3 weeks");
 * and in a table row, the row's first cell names the service. Ranges tied to
 * a process step or a product rather than the build (a permit, a variance, an
 * inspection, cabinets on order) are skipped, as is any clause that names no
 * service. Stat cards are not read: they are built from TIMELINES already.
 */
import { decodeEntities, textOf } from './html.mjs';

// Service words per TIMELINES key. A key with no entry here is not checked.
const SERVICE_WORDS = {
  bathroom: /\b(?:bathrooms?|baths?|ensuites?)\b/gi,
  kitchen: /\bkitchens?\b/gi,
  basement: /\bbasements?\b/gi,
  wholeHome: /\bwhole[- ](?:homes?|houses?)\b/gi,
  addition: /(?<!\bin )\badditions?\b/gi,
};

const NUMBER_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
];
const NUM = `(\\d{1,2}|${NUMBER_WORDS.join('|')})`;
const RANGE_RE = new RegExp(`\\b${NUM}\\s*(?:–|—|-|to)\\s*${NUM}\\s+weeks?\\b`, 'gi');
const toNumber = (word) => (/^\d+$/.test(word) ? Number(word) : NUMBER_WORDS.indexOf(word.toLowerCase()));

// "… weeks [of on-site work] for [a typical full] <service>"
const FOLLOWING_LINK = /^(?:\s+of\s+[\w-]+(?:\s+[\w-]+){0,2})?\s+for\s+(?:(?:a|an|the|your|most|many|each|typical|full|small|standard|straightforward)\s+){0,4}$/i;
// Words that tie a range to a step of the process ("a variance takes six to
// eight weeks") or to a product's lead time ("kitchen cabinets can take 6 to
// 10 weeks") rather than to the build.
const STEP_WORDS = /\b(?:permits?|variances?|applications?|approvals?|inspections?|reviews?|rough-ins?|drawings?|design|drying|curing|posting)\b/i;
const LEAD_WORDS =
  /\b(?:deliver(?:y|ies)|lead times?|orders?|ordered|cabinets?|counter(?:top)?s?|tiles?|glass|fixtures?|windows?|doors?|materials?|products?|arriv\w*|ship\w*)\b/i;
const PROCESS_WORDS = new RegExp(`${STEP_WORDS.source}|${LEAD_WORDS.source}`, 'i');
const CLAUSE_BREAK = /[,;()]|\s[–—]\s/g;
const MAX_WORDS_BEFORE = 8;

const INLINE = new Set(['a', 'abbr', 'b', 'bdi', 'cite', 'code', 'data', 'em', 'i', 'kbd', 'mark', 'q', 's', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'wbr', 'br']);

/** Services named in `text`, with their positions. */
function serviceHits(text) {
  const hits = [];
  for (const [key, re] of Object.entries(SERVICE_WORDS)) {
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) hits.push({ key, index: m.index, end: m.index + m[0].length, word: m[0] });
  }
  return hits.sort((a, b) => a.index - b.index);
}

/** The clause around [start, end): from the last break before to the first break after. */
function clauseBounds(text, start, end) {
  let from = 0;
  let to = text.length;
  CLAUSE_BREAK.lastIndex = 0;
  for (const m of text.matchAll(CLAUSE_BREAK)) {
    if (m.index + m[0].length <= start) from = m.index + m[0].length;
    else if (m.index >= end) {
      to = m.index;
      break;
    }
  }
  return { from, to };
}

/** The service a range of weeks in `sentence` is given for, or null. */
function serviceFor(sentence, range, rowService) {
  if (rowService) {
    // Table row: the range's own cell must not be about a process step, and
    // nothing before the range in it may name a product.
    const cellStart = sentence.lastIndexOf('|', range.index) + 1;
    const cellEnd = sentence.indexOf('|', range.end);
    const cell = sentence.slice(cellStart, cellEnd === -1 ? sentence.length : cellEnd);
    return STEP_WORDS.test(cell) || LEAD_WORDS.test(sentence.slice(cellStart, range.index)) ? null : rowService;
  }
  const { from, to } = clauseBounds(sentence, range.index, range.end);
  // "a variance for your addition takes six to eight weeks": not the build.
  if (PROCESS_WORDS.test(sentence.slice(from, range.index))) return null;
  const hits = serviceHits(sentence);
  // After the range: "… weeks for a typical basement".
  const after = hits.find((h) => h.index >= range.end && h.index < to && FOLLOWING_LINK.test(sentence.slice(range.end, h.index)));
  if (after) {
    const next = sentence.slice(after.end, after.end + 20);
    return PROCESS_WORDS.test(next.split(/\s+/).slice(0, 2).join(' ')) ? null : after.key;
  }
  // Before it: the nearest service word in the same clause, a few words away.
  const before = hits.filter((h) => h.end <= range.index && h.index >= from).pop();
  if (!before) return null;
  const between = sentence.slice(before.end, range.index);
  if ((between.match(/\S+/g) || []).length > MAX_WORDS_BEFORE) return null;
  RANGE_RE.lastIndex = 0;
  if (RANGE_RE.test(between)) return null; // another range sits in between
  return before.key;
}

/**
 * Text units of <main>: the text each block holds directly (its own text and
 * inline elements, not nested blocks), and each table row as a whole.
 */
function textUnits(page) {
  const { doc, main } = page;
  const blocks = new Map(); // element idx -> { el, parts }
  for (const node of doc.texts) {
    if (node.start < main.start || node.end > main.end) continue;
    if (node.parent < 0 || doc.hidden[node.parent]) continue;
    let el = doc.elements[node.parent];
    while (INLINE.has(el.tag) && el.parent >= 0) el = doc.elements[el.parent];
    if (el.tag === 'td' || el.tag === 'th') {
      const row = el.parent >= 0 ? doc.elements[el.parent] : null;
      if (row && row.tag === 'tr') el = row;
    }
    if (!blocks.has(el.idx)) blocks.set(el.idx, { el, parts: [] });
    blocks.get(el.idx).parts.push(decodeEntities(node.raw));
  }
  const units = [];
  for (const { el, parts } of blocks.values()) {
    if (el.tag === 'tr') {
      const cells = doc.elements.filter((c) => (c.tag === 'td' || c.tag === 'th') && c.parent === el.idx);
      const first = cells.length ? textOf(doc, cells[0]) : '';
      const named = [...new Set(serviceHits(first).map((h) => h.key))];
      const rowService = named.length === 1 && !PROCESS_WORDS.test(first) ? named[0] : null;
      units.push({ text: cells.map((c) => textOf(doc, c)).join(' | '), rowService });
    } else {
      units.push({ text: parts.join(' ').replace(/\s+/g, ' ').trim(), rowService: null });
    }
  }
  return units;
}

/**
 * Warns ('facts.timeline-drift') for each range of weeks on the page that is
 * given for a service and differs from TIMELINES. Returns the findings.
 */
export function checkTimelineDrift(page, timelines, report) {
  const found = new Map();
  for (const unit of textUnits(page)) {
    const sentences = unit.rowService ? [unit.text] : unit.text.split(/(?<=[.!?])\s+/);
    for (const sentence of sentences) {
      RANGE_RE.lastIndex = 0;
      for (const m of sentence.matchAll(RANGE_RE)) {
        const range = { index: m.index, end: m.index + m[0].length, min: toNumber(m[1]), max: toNumber(m[2]) };
        const key = serviceFor(sentence, range, unit.rowService);
        const fact = key && timelines[key];
        if (!fact || (fact.min === range.min && fact.max === range.max)) continue;
        const context = sentence.slice(Math.max(0, range.index - 60), range.end + 40).trim();
        const message = `"${m[0]}" for ${key} ("…${context}…"); facts.js TIMELINES.${key} is ${fact.short || `${fact.min}–${fact.max} weeks`}`;
        found.set(message, { key, range: [range.min, range.max], context });
      }
    }
  }
  for (const message of found.keys()) report.warn('facts.timeline-drift', page.route, message);
  return [...found.values()];
}
