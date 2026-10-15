/**
 * Readability helpers for the SEO audit (plan §19: paragraphs of 60 words or
 * fewer, reading grade 8 or lower).
 *
 * blockText() reads a paragraph the way the browser shows it. React splits a
 * sentence into several text nodes wherever text meets a link or a value, so
 * the nodes are joined as they sit in the HTML: with a space only where the
 * markup between them holds whitespace (the tokenizer drops whitespace-only
 * text nodes, e.g. JSX {' '}) or a <br>. Joining every node with a space
 * would count the punctuation after a link ("…a store: the…") as a word.
 *
 * gradeLevel() is the Flesch-Kincaid grade with a heuristic syllable count. It
 * is an estimate for spotting dense pages, not an exact score, so the audit
 * only reports it as info.
 */
import { decodeEntities } from './html.mjs';

// Markup between two text nodes that renders as a space: a <br>, or whitespace
// left once comments and tags are removed.
const gapIsSpace = (gap) => /<br\b/i.test(gap) || /\s/.test(gap.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, ''));

/** Visible text of an element, as rendered inline (see above). */
export function blockText(doc, el) {
  const { texts } = doc;
  // Text nodes are in document order: binary-search the first one inside.
  let lo = 0;
  let hi = texts.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (texts[mid].start < el.openEnd) lo = mid + 1;
    else hi = mid;
  }
  let out = '';
  let cursor = el.openEnd;
  for (let i = lo; i < texts.length && texts[i].start < el.closeStart; i += 1) {
    const node = texts[i];
    if (node.end > el.closeStart || (node.parent >= 0 && doc.hidden[node.parent])) continue;
    if (out && gapIsSpace(doc.html.slice(cursor, node.start))) out += ' ';
    out += decodeEntities(node.raw);
    cursor = node.end;
  }
  return out.replace(/\s+/g, ' ').trim();
}

/** Words: whitespace-separated tokens with at least one letter or digit. */
export const wordsOf = (text) => (String(text).match(/\S+/g) || []).filter((token) => /[\p{L}\p{N}]/u.test(token));

/** Estimated syllables in one word (vowel groups, less a silent final e). */
export function syllables(word) {
  const letters = String(word).toLowerCase().replace(/[^a-z]/g, '');
  if (!letters) return 1; // a number or a symbol: read as one unit
  if (letters.length <= 3) return 1;
  const trimmed = letters.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return groups ? groups.length : 1;
}

/** Sentences in a block: terminal punctuation followed by a space or the end; at least one. */
export const sentencesOf = (text) => Math.max(1, (String(text).match(/[.!?]+(?=["'”’)\]]*(?:\s|$))/g) || []).length);

/**
 * Flesch-Kincaid grade of a set of text blocks:
 * 0.39 × (words / sentences) + 11.8 × (syllables / words) − 15.59.
 * Returns { words, sentences, syllables, grade } (grade null when there are no words).
 */
export function gradeLevel(blocks) {
  let words = 0;
  let sentences = 0;
  let syllableCount = 0;
  for (const text of blocks) {
    const list = wordsOf(text);
    if (!list.length) continue;
    words += list.length;
    sentences += sentencesOf(text);
    for (const word of list) syllableCount += syllables(word);
  }
  const grade = words ? 0.39 * (words / sentences) + 11.8 * (syllableCount / words) - 15.59 : null;
  return { words, sentences, syllables: syllableCount, grade };
}
