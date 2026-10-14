import { useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import BlogCard from '../components/BlogCard.jsx';
// Cards plus what the Blog node needs (meta description, 1200x630 image), in
// one generated module: post bodies are separate chunks (src/data/posts/),
// so /blog never downloads article text. BLOG_CATEGORIES is the plan's
// category set once posts carry it, else the categories posts carry today.
import { BLOG_CATEGORIES, BLOG_LIST as BLOG_POSTS } from '../data/blogList.js';
import { buildBlogNode, seoFor } from '../data/seo.js';
import { usePageSeo } from '../hooks/useSeo.js';

const ALL = 'All Posts';
const LATEST = BLOG_POSTS[0];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState(ALL);

  // Same builders and arguments as the prerendered head (head.js), so the
  // JSON-LD the client writes is identical to the static HTML.
  const { description } = seoFor('/blog');
  const blogNodes = useMemo(() => [buildBlogNode({ posts: BLOG_POSTS, description })], [description]);
  usePageSeo('/blog', {
    image: LATEST && (LATEST.ogImage || LATEST.hero),
    nodes: blogNodes,
  });

  const posts = useMemo(
    () =>
      activeCategory === ALL
        ? BLOG_POSTS
        : BLOG_POSTS.filter((post) => post.categories.includes(activeCategory)),
    [activeCategory]
  );

  const [featured, ...rest] = posts;

  return (
    <main>
      <PageHero
        eyebrow="Renovation Guides"
        title="WINNIPEG RENOVATION GUIDES"
        highlight="FROM OUR CREW"
        description="Practical guides for planning a renovation in Winnipeg: costs, permits, basements, kitchens, bathrooms, older homes, contractors and commercial projects."
        primaryLink={{ to: '/services', label: 'VIEW OUR SERVICES' }}
      />

      <section className="blog-index-section">
        <div className="container">
          <div className="blog-filter-bar reveal">
            <span className="blog-filter-label">Browse by category</span>
            <div className="blog-filter-pills">
              {[ALL, ...BLOG_CATEGORIES].map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`blog-filter-pill${category === activeCategory ? ' active' : ''}`}
                  aria-pressed={category === activeCategory}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <h2 className="section-title">Latest guides</h2>

          {featured && (
            <div className="reveal">
              <BlogCard post={featured} featured />
            </div>
          )}

          <div className="blog-grid">
            {rest.map((post) => (
              <div className="reveal" key={post.slug}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="blog-empty">No articles in this category yet. Check back soon.</p>
          )}
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
