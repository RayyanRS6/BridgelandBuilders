/**
 * Blog post content parsing, shared by the post page (for rendering) and the
 * build-time SEO layer (for schema), so both always agree.
 */
import { SITE_URL } from './siteConfig.js';
import { graph, buildBreadcrumbs, organizationNamed } from './seo.js';

const HEADINGS = ['h2', 'h3', 'h4'];
const TAKEAWAY_RE = /^(key takeaways|the key points|key points)\b/i;
const FAQ_RE = /(questions?|faqs?)\b/i;
const QUESTION_START_RE = /^(what|how|why|can|do|does|is|are|should|which|describe|when|who|if)\b/i;

export const isHeading = (block) => HEADINGS.includes(block.t);
export const looksLikeQuestion = (text) => /\?\s*$/.test(text) || QUESTION_START_RE.test(text);

/** Splits the flat block list into body, "key takeaways" and FAQ sections. */
export function buildSections(blocks) {
  const sections = [];
  let current = { type: 'body', items: [] };
  const flush = () => {
    if (current.items.length || current.heading) sections.push(current);
  };

  for (const block of blocks) {
    if (isHeading(block)) {
      if (TAKEAWAY_RE.test(block.x)) {
        flush();
        current = { type: 'takeaways', heading: block.x, items: [] };
        continue;
      }
      if (FAQ_RE.test(block.x) && !looksLikeQuestion(block.x)) {
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
    const text = (block.x || '').trim();
    if (!text) continue;

    const isQuestion =
      block.t === 'question' || (block.t === 'p' && text.length <= 160 && looksLikeQuestion(text));

    if (isQuestion) {
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

  const nodes = [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.metaDescription,
      image: post.hero,
      datePublished: post.date,
      dateModified: post.date,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: organizationNamed,
      publisher: organizationNamed,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      articleSection: post.category,
      inLanguage: 'en-CA',
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '.page-hero-card > p', '.blog-takeaways'],
      },
    },
    buildBreadcrumbs([['Blog', '/blog'], [post.title, path]]),
  ];

  if (faqs.length) {
    nodes.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    path,
    image: post.hero,
    type: 'article',
    publishedTime: post.date,
    jsonLd: graph(...nodes),
  };
}
