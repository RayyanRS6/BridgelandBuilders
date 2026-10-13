/**
 * Blog post content parsing, shared by the post page (for rendering) and the
 * build-time SEO layer (for schema), so both always agree.
 */
import { SITE_URL } from './siteConfig.js';
import { buildBreadcrumbs, buildFaqPage, buildWebPage, graph, isoWinnipeg, organizationRef } from './seo.js';

// ISO 8601 with the America/Winnipeg offset (-06:00 / -05:00); lives in seo.js
// so the /blog Blog node formats dates identically.
export { isoWinnipeg };

const HEADINGS = ['h2', 'h3', 'h4'];
const TAKEAWAY_RE = /^(key takeaways|the key points|key points)\b/i;
// A section only counts as an FAQ when its heading says so explicitly
// ("FAQs", "Frequently Asked Questions", "Questions and Answers", "Common
// Questions", "Questions We Get Most Often"...). A heading that merely mentions
// questions ("Ask the Right Questions") is ordinary body content.
const FAQ_EXPLICIT_RE = /\bfaqs?\b|\bfrequently asked\b|\bquestions?\s+(?:and|&)\s+answers?\b/i;
const FAQ_QUESTIONS_RE = /\bquestions\b/i;
const FAQ_QUALIFIER_RE = /\b(most|common|commonly|often|frequently)\b/i;
const QUESTION_START_RE = /^(what|how|why|can|do|does|is|are|should|which|describe|when|who|if)\b/i;

export const isHeading = (block) => HEADINGS.includes(block.t);
export const looksLikeQuestion = (text) => /\?\s*$/.test(text) || QUESTION_START_RE.test(text);

const isFaqHeading = (text) =>
  !looksLikeQuestion(text) &&
  (FAQ_EXPLICIT_RE.test(text) || (FAQ_QUESTIONS_RE.test(text) && FAQ_QUALIFIER_RE.test(text)));

const blockText = (block) => (block.t === 'img' ? '' : (block.x || '').trim());

const isFaqQuestion = (block) => {
  const text = blockText(block);
  return Boolean(text) && (block.t === 'question' || (block.t === 'p' && text.length <= 160 && looksLikeQuestion(text)));
};

/**
 * Splits an FAQ section's items at the end of the last answer. The last
 * answer is the first text block after the last question (plus any list that
 * directly continues it); whatever follows — usually the article's closing
 * paragraph — is returned separately so it is never folded into that answer.
 */
function splitFaqTrail(items) {
  let lastQuestion = -1;
  items.forEach((block, index) => {
    if (isFaqQuestion(block)) lastQuestion = index;
  });
  if (lastQuestion < 0) return [items, []];

  let end = lastQuestion + 1;
  while (end < items.length && !blockText(items[end])) end += 1;
  if (end >= items.length) return [items, []];
  end += 1;
  while (end < items.length && items[end].t === 'li') end += 1;
  return [items.slice(0, end), items.slice(end)];
}

/** Splits the flat block list into body, "key takeaways" and FAQ sections. */
export function buildSections(blocks) {
  const sections = [];
  let current = { type: 'body', items: [] };
  const flush = () => {
    if (!current.items.length && !current.heading) return;
    if (current.type !== 'faq') {
      sections.push(current);
      return;
    }
    const [faqItems, trailing] = splitFaqTrail(current.items);
    sections.push({ ...current, items: faqItems });
    if (trailing.some((block) => block.t === 'img' || blockText(block))) {
      sections.push({ type: 'body', items: trailing });
    }
  };

  for (const block of blocks) {
    if (isHeading(block)) {
      if (TAKEAWAY_RE.test(block.x)) {
        flush();
        current = { type: 'takeaways', heading: block.x, items: [] };
        continue;
      }
      if (isFaqHeading(block.x)) {
        flush();
        current = { type: 'faq', heading: block.x, items: [] };
        continue;
      }
      if (current.type === 'faq' && looksLikeQuestion(block.x)) {
        current.items.push({ ...block, t: 'question' });
        continue;
      }
      if (current.type !== 'body') {
        flush();
        current = { type: 'body', items: [block] };
        continue;
      }
    }
    current.items.push(block);
  }

  flush();
  return sections;
}

/** Turns an alternating question/answer run of paragraphs into accordion items. */
export function buildFaqItems(items) {
  const lead = [];
  const faqs = [];

  for (const block of items) {
    if (block.t === 'img') continue;
    const text = blockText(block);
    if (!text) continue;

    if (isFaqQuestion(block)) {
      faqs.push({ q: text, a: '' });
    } else if (faqs.length) {
      const last = faqs[faqs.length - 1];
      last.a = last.a ? `${last.a} ${text}` : text;
    } else {
      lead.push(text);
    }
  }

  return { lead, faqs: faqs.filter((item) => item.q && item.a) };
}

/** Everything the <head> needs for one blog post. */
export function buildPostHead(post) {
  const path = `/blog/${post.slug}`;
  const url = `${SITE_URL}${path}`;
  const faqSection = buildSections(post.blocks).find((section) => section.type === 'faq');
  const { faqs } = faqSection ? buildFaqItems(faqSection.items) : { faqs: [] };

  const updated = post.updated || post.date;
  const published = isoWinnipeg(post.date);
  const modified = isoWinnipeg(updated);
  const image = post.ogImage || post.hero;
  const breadcrumbs = buildBreadcrumbs([['Blog', '/blog'], [post.title, path]], path);

  const nodes = [
    buildWebPage({
      path,
      title: post.metaTitle,
      description: post.metaDescription,
      breadcrumb: { '@id': breadcrumbs['@id'] },
      dateModified: modified,
      about: false,
      mainEntity: { '@id': `${url}#article` },
    }),
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.metaDescription,
      image,
      datePublished: published,
      dateModified: modified,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      // The business wrote these posts. A reference only, so the
      // GeneralContractor entity is not re-typed as a plain Organization.
      author: organizationRef,
      publisher: organizationRef,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      articleSection: post.category,
      inLanguage: 'en-CA',
    },
    breadcrumbs,
    // FAQPage only from the post's explicit FAQ section (see buildSections).
    buildFaqPage(path, faqs),
  ];

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    path,
    image,
    type: 'article',
    publishedTime: published,
    modifiedTime: modified,
    updated,
    jsonLd: graph(...nodes),
  };
}
