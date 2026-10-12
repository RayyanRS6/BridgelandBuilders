/**
 * JSON-LD helpers for the SEO audit: block extraction, graph walking,
 * forbidden-schema rules (plan §3.5), @id resolution and FAQ extraction.
 */
import { byTag } from './html.mjs';

/** Every <script type="application/ld+json"> on the page, parsed. */
export function jsonLdBlocks(doc) {
  return byTag(doc, 'script')
    .filter((el) => (el.attrs.type || '').toLowerCase() === 'application/ld+json')
    .map((el) => {
      const raw = el.raw || '';
      const block = { isPage: el.attrs['data-seo'] === 'page', raw, data: null, error: null };
      try {
        block.data = JSON.parse(raw);
      } catch (e) {
        block.error = e.message;
      }
      return block;
    });
}

export const typesOf = (node) => {
  const t = node && node['@type'];
  if (!t) return [];
  return (Array.isArray(t) ? t : [t]).map(String);
};

/** Visits every plain object in a JSON-LD value, depth first, with its key path. */
export function walk(value, visit, path = '$', parentKey = null) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, visit, `${path}[${i}]`, parentKey));
    return;
  }
  if (!value || typeof value !== 'object') return;
  visit(value, path, parentKey);
  for (const [key, child] of Object.entries(value)) {
    if (child && typeof child === 'object') walk(child, visit, `${path}.${key}`, key);
  }
}

/** Visits every string value with its key. */
export function walkStrings(value, visit, key = null) {
  if (typeof value === 'string') return visit(value, key);
  if (Array.isArray(value)) return value.forEach((item) => walkStrings(item, visit, key));
  if (value && typeof value === 'object') {
    for (const [k, child] of Object.entries(value)) walkStrings(child, visit, k);
  }
}

const BUSINESS_TYPES = new Set([
  'Organization', 'LocalBusiness', 'GeneralContractor', 'HomeAndConstructionBusiness', 'Corporation',
  'ProfessionalService', 'HousePainter', 'RoofingContractor', 'Plumber', 'Electrician', 'HVACBusiness',
  'Locksmith', 'MovingCompany', 'Service',
]);
const HOWTO_TYPES = /^HowTo(Step|Section|Direction|Tip|Supply|Tool)?$/;

const isBusinessNode = (node, orgId) =>
  (orgId && node['@id'] === orgId) || typesOf(node).some((t) => BUSINESS_TYPES.has(t));

/**
 * Forbidden-schema findings for one parsed JSON-LD document.
 * Returns [{ severity, code, message }].
 */
export function forbiddenSchema(data, { route, orgId }) {
  const out = [];
  const seen = new Set();
  const push = (severity, code, message) => {
    const key = `${code}|${message}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ severity, code, message });
    }
  };
  const isWatchPage = /^\/videos\//.test(route || '');

  walk(data, (node, path, parentKey) => {
    const types = typesOf(node);
    for (const t of types) {
      // A SpeakableSpecification under "speakable" is reported once, via the property below.
      if (t === 'SpeakableSpecification' && parentKey !== 'speakable') push('error', 'schema.forbidden', `SpeakableSpecification at ${path}`);
      if (t === 'SearchAction') push('error', 'schema.forbidden', `SearchAction at ${path}`);
      if (HOWTO_TYPES.test(t)) push('error', 'schema.forbidden', `${t} at ${path}`);
      if (t === 'Product' || t === 'AggregateOffer') push('error', 'schema.forbidden', `${t} at ${path}`);
      if (/NewsArticle$/.test(t)) push('error', 'schema.forbidden', `${t} at ${path}`);
      if (t === 'VideoObject' && !isWatchPage) push('error', 'schema.forbidden', `VideoObject outside a /videos/ watch page at ${path}`);
      if ((t === 'Review' || t === 'AggregateRating') && node.itemReviewed) {
        const target = node.itemReviewed;
        if ((orgId && target['@id'] === orgId) || isBusinessNode(target, orgId)) {
          push('error', 'schema.forbidden', `${t} of the business itself at ${path}`);
        }
      }
    }
    if ('speakable' in node) push('error', 'schema.forbidden', `"speakable" property at ${path}`);
    if (types.includes('Offer')) {
      const priced = ['price', 'lowPrice', 'highPrice', 'priceSpecification'].filter((k) => k in node);
      if (priced.length) push('error', 'schema.forbidden', `Offer with ${priced.join('/')} at ${path}`);
    }
    for (const key of ['aggregateRating', 'review']) {
      if (!(key in node)) continue;
      if (isBusinessNode(node, orgId)) push('error', 'schema.forbidden', `${key} on the business (${types.join('/') || node['@id']}) at ${path}`);
      else push('warn', 'schema.self-review', `${key} on ${types.join('/') || 'node'} at ${path}`);
    }
  });
  return out;
}

/**
 * @id bookkeeping for one page.
 *   defs: Map<id, Set<type>> — objects with an @id and at least one other key
 *   refs: [{ id, path }]      — objects that are only { "@id": … }
 */
export function idIndex(docs) {
  const defs = new Map();
  const refs = [];
  for (const data of docs) {
    walk(data, (node, path) => {
      const id = node['@id'];
      if (typeof id !== 'string') return;
      const keys = Object.keys(node);
      if (keys.length === 1) {
        refs.push({ id, path });
        return;
      }
      if (!defs.has(id)) defs.set(id, []);
      defs.get(id).push(typesOf(node));
    });
  }
  return { defs, refs };
}

/** Type sets declared for one @id that conflict (neither is a subset of the other). */
export function conflictingTypes(typeLists) {
  const sets = typeLists.filter((list) => list.length).map((list) => new Set(list));
  for (let i = 0; i < sets.length; i += 1) {
    for (let j = i + 1; j < sets.length; j += 1) {
      const a = sets[i];
      const b = sets[j];
      const aInB = [...a].every((t) => b.has(t));
      const bInA = [...b].every((t) => a.has(t));
      if (!aInB && !bInA) return [[...a], [...b]];
    }
  }
  return null;
}

/** [{ question, answer }] from every FAQPage node. */
export function faqItems(data) {
  const items = [];
  walk(data, (node) => {
    if (!typesOf(node).includes('FAQPage')) return;
    const entities = Array.isArray(node.mainEntity) ? node.mainEntity : node.mainEntity ? [node.mainEntity] : [];
    for (const q of entities) {
      if (!q || typeof q !== 'object') continue;
      const answer = q.acceptedAnswer && (Array.isArray(q.acceptedAnswer) ? q.acceptedAnswer[0] : q.acceptedAnswer);
      items.push({ question: q.name || '', answer: (answer && answer.text) || '' });
    }
  });
  return items;
}
