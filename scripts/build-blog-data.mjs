import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAW_DIR = fileURLToPath(new URL('../blog-raw/', import.meta.url));
const files = readdirSync(RAW_DIR).filter((f) => f.endsWith('.json'))
  .sort((a, b) => Number(a.replace(/\D/g, '')) - Number(b.replace(/\D/g, '')));

let posts = [];
for (const f of files) posts.push(...JSON.parse(readFileSync(join(RAW_DIR, f), 'utf8')));

const words = (blocks) => blocks.reduce((n, b) => n + (b.x ? b.x.split(/\s+/).length : 0), 0);

posts = posts.map((p) => {
  const blocks = [...p.blocks];
  let excerpt = p.excerpt;
  // The first paragraph on a Wix post is the meta description / lead.
  if (!excerpt && blocks[0] && blocks[0].t === 'p') excerpt = blocks.shift().x;
  else if (excerpt && blocks[0] && blocks[0].t === 'p' && blocks[0].x === excerpt) blocks.shift();

  // Hero image is shown by the layout, so drop a leading duplicate of it from the body.
  if (blocks[0] && blocks[0].t === 'img') {
    var heroAlt = blocks[0].alt;
    blocks.shift();
  }

  const cleanExcerpt = (excerpt || '').trim();

  // The page still shows the full excerpt; these two are only for <title> and
  // <meta name="description">, where length controls how results are rendered.
  const brandedTitle = `${p.title} | Bridgeland Builders`;
  const metaTitle = brandedTitle.length <= 60 ? brandedTitle : p.title;

  let metaDescription = cleanExcerpt;
  if (metaDescription.length > 158) {
    const cut = metaDescription.slice(0, 158);
    metaDescription = `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '')}…`;
  }
  if (metaDescription.length < 70) {
    metaDescription = `${metaDescription} Renovation advice from Bridgeland Builders, Winnipeg.`.slice(0, 158);
  }

  return {
    slug: p.slug,
    title: p.title,
    metaTitle,
    metaDescription,
    excerpt: cleanExcerpt,
    category: (p.cats && p.cats[0]) || 'Renovation Advice',
    categories: p.cats || [],
    date: p.date,
    readMinutes: Math.max(3, Math.round(words(p.blocks) / 200)),
    hero: p.hero,
    heroAlt: heroAlt || p.title,
    memberOnly: !!p.memberOnly,
    blocks,
  };
});

posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

const categories = [...new Set(posts.map((p) => p.category))];

const out = `// Generated from the Bridgeland Builders blog content. Do not edit by hand —
// edit blog-raw/*.json and re-run: node scripts/build-blog-data.mjs
export const BLOG_CATEGORIES = ${JSON.stringify(categories, null, 2)};

export const BLOG_POSTS = ${JSON.stringify(posts, null, 2)};

export function getPostBySlug(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRelatedPosts(post, limit = 3) {
  if (!post) return [];
  const sameCategory = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category);
  const rest = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
`;

writeFileSync(new URL('../src/data/blogPosts.js', import.meta.url), out);
console.log('posts:', posts.length);
console.log('categories:', categories.join(' | '));
console.log('member-only:', posts.filter((p) => p.memberOnly).map((p) => p.slug).join(', ') || 'none');
console.log('sample:', JSON.stringify({ ...posts[0], blocks: posts[0].blocks.slice(0, 2) }, null, 1).slice(0, 700));
