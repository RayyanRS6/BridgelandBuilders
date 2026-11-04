import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigationType } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import BlogCard from '../components/BlogCard.jsx';
// The newest cards (compact image records, src/lib/cardImage.js), every other
// post's title and the categories, in one generated module: post bodies are
// separate chunks (src/data/posts/), so /blog never downloads article text, and
// the other cards are one lazy chunk (blogListRest.js). BLOG_CATEGORIES is the
// plan's category set once posts carry it, else the categories posts carry today.
import { BLOG_CATEGORIES, BLOG_FIRST_CARDS, BLOG_LIST, BLOG_PAGE_SIZE, BLOG_TITLES } from '../data/blogList.js';
import { useLazyPageSeo } from '../hooks/useSeo.js';
import { retryLoad } from '../lib/lazyRetry.js';

const ALL = 'All Posts';

/**
 * The head's options: the Blog node and the latest post's 1200x630 image,
 * with the same builders and arguments as the prerendered head (head.js), so
 * the JSON-LD the client writes is identical to the static HTML. Its data
 * (the newest posts' meta descriptions and og images, blogListSeo.js) and the
 * seo.js builders load only when the head has to be written, i.e. after a
 * client-side navigation to /blog, never as part of the page's first load.
 */
function loadSeoOptions() {
  return Promise.all([import('../data/blogListSeo.js'), import('../data/seo.js')]).then(
    ([{ BLOG_NODE_POSTS: posts }, { buildBlogNode, seoFor }]) => {
      const latest = posts[0];
      return {
        image: latest && (latest.ogImage || latest.hero),
        nodes: [buildBlogNode({ posts, description: seoFor('/blog').description })],
      };
    }
  );
}

// The other posts' cards, fetched once and kept for the session, so coming back
// to this page shows them at once.
let restCards = null;
let restRequest = null;
function loadRestCards() {
  if (!restRequest) {
    restRequest = retryLoad(() => import('../data/blogListRest.js')).then(
      (module) => {
        restCards = module.BLOG_REST;
        return restCards;
      },
      (error) => {
        restRequest = null; // the next request tries again
        throw error;
      }
    );
  }
  return restRequest;
}

// Pointing at or focusing a control that needs them starts the download, as
// blog cards do with their post.
const prefetchRestCards = () => {
  loadRestCards().catch(() => {});
};

// What the visitor last had open, for the browser's Back button. It starts as
// the defaults, so a page load matches the prerendered HTML.
const lastView = { category: ALL, shown: BLOG_FIRST_CARDS };

/**
 * One URL for every post. The prerender and the first render show the newest
 * BLOG_FIRST_CARDS cards and every other post as a plain title link, so the HTML
 * still links each post for crawlers. "Show more" and the category filter load
 * the other cards. A post moves from the title links to the cards as it is
 * revealed, and a category narrows both.
 */
export default function BlogPage() {
  const cameBack = useNavigationType() === 'POP';
  const [activeCategory, setActiveCategory] = useState(cameBack ? lastView.category : ALL);
  const [shown, setShown] = useState(cameBack ? lastView.shown : BLOG_FIRST_CARDS);
  const [rest, setRest] = useState(restCards);
  const [failed, setFailed] = useState(false);
  const grid = useRef(null);
  const pendingFocus = useRef(null);

  useLazyPageSeo('/blog', loadSeoOptions);

  const inCategory = activeCategory !== ALL;
  const matching = useMemo(() => {
    const known = rest ? [...BLOG_LIST, ...rest] : BLOG_LIST;
    return activeCategory === ALL ? known : known.filter((post) => post.categories.includes(activeCategory));
  }, [rest, activeCategory]);

  const cards = matching.slice(0, shown);
  const [featured, ...others] = cards;
  const waiting = !rest && !failed && (inCategory || shown > BLOG_FIRST_CARDS);

  // Without the other cards, the posts in a category aren't known yet: no title
  // links while they load, and if they can't be loaded, all of them.
  let links = BLOG_TITLES;
  if (rest) links = matching.slice(shown);
  else if (inCategory && !failed) links = [];
  const hasMore = links.length > 0 && (Boolean(rest) || !inCategory);
  const nextCount = Math.min(BLOG_PAGE_SIZE, links.length);

  useEffect(() => {
    if (!rest) return;
    lastView.category = activeCategory;
    lastView.shown = shown;
  }, [rest, activeCategory, shown]);

  // A keyboard user moves on to the first new card. Otherwise focus stays on
  // the button, unless that was the last of the cards and the button is gone.
  useEffect(() => {
    const request = pendingFocus.current;
    if (!request || cards.length <= request.from) return;
    pendingFocus.current = null;
    if (!request.keyboard && hasMore) return;
    // The first card is the featured one, outside the grid.
    const link = grid.current?.children[request.from - 1]?.querySelector('h3 a');
    link?.focus({ preventScroll: !request.keyboard });
  }, [cards.length, hasMore]);

  function requestRestCards() {
    setFailed(false);
    loadRestCards().then(setRest, () => setFailed(true));
  }

  function chooseCategory(category) {
    pendingFocus.current = null;
    setActiveCategory(category);
    setShown(BLOG_FIRST_CARDS);
    setFailed(false);
    if (category !== ALL && !rest) requestRestCards();
  }

  function showMore(event) {
    if (waiting) return;
    // A click from the keyboard has no pointer behind it (detail 0).
    pendingFocus.current = { from: cards.length, keyboard: event.detail === 0 };
    setShown(cards.length + BLOG_PAGE_SIZE);
    if (!rest) requestRestCards();
  }

  let notice = null;
  if (failed) {
    notice = (
      <>
        We couldn’t load more articles. <a href="/blog">Reload the page</a> to try again.
      </>
    );
  } else if (waiting && inCategory) {
    notice = 'Loading articles...';
  } else if (!waiting && matching.length === 0) {
    notice = 'No articles in this category yet. Check back soon.';
  }
  const total = rest || inCategory ? matching.length : BLOG_LIST.length + BLOG_TITLES.length;

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
            <div className="blog-filter-pills" onMouseEnter={prefetchRestCards} onFocus={prefetchRestCards}>
              {[ALL, ...BLOG_CATEGORIES].map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`blog-filter-pill${category === activeCategory ? ' active' : ''}`}
                  aria-pressed={category === activeCategory}
                  onClick={() => chooseCategory(category)}
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

          <div className="blog-grid" ref={grid}>
            {others.map((post) => (
              <div className="reveal" key={post.slug}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>

          {/* Announces each change to screen readers; shown when it has news. */}
          <p className={notice ? 'blog-empty' : 'visually-hidden'} role="status">
            {notice || `Showing ${cards.length} of ${total} articles${inCategory ? ` in ${activeCategory}` : ''}`}
          </p>

          {hasMore && (
            <div className="blog-more">
              <button
                type="button"
                className="btn-pill-ghost blog-more-button"
                aria-busy={waiting}
                aria-label={waiting ? 'Loading more articles' : `Show more articles: next ${nextCount} of ${links.length} remaining`}
                onMouseEnter={prefetchRestCards}
                onFocus={prefetchRestCards}
                onTouchStart={prefetchRestCards}
                onClick={showMore}
              >
                {waiting ? 'Loading...' : 'Show more'}
              </button>
            </div>
          )}

          {links.length > 0 && (
            <div className="blog-title-links">
              <h2 className="blog-related-heading">{inCategory && rest ? `More in ${activeCategory}` : 'More articles'}</h2>
              <ul className="blog-title-list">
                {links.map((post) => (
                  <li key={post.slug}>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
