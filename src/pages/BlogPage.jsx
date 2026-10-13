import { useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import BlogCard from '../components/BlogCard.jsx';
// Metadata only: post bodies are separate chunks (src/data/posts/), so the
// blog index never downloads article text. BLOG_CATEGORIES is the plan's
// category set once posts carry it, else the categories posts carry today.
import { BLOG_CATEGORIES, BLOG_POSTS } from '../data/blogIndex.js';
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
        eyebrow="Blogs & Articles"
        title="RENOVATION ADVICE"
        highlight="FROM OUR CREW"
        description="Straight-talking guides on planning, budgeting, and getting renovation work done properly — written by the team behind Winnipeg renovations."
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
