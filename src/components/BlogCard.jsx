import { Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon, ClockIcon } from './icons.jsx';

export function formatPostDate(iso) {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Rendered image widths (pages.css): one column up to 680px, two up to 1024px,
 * then three in the 1300px container (~400px); the featured card's image is
 * full width up to 1024px, then 52% of the container.
 */
const CARD_SIZES = '(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 400px';
const FEATURED_SIZES = '(max-width: 1024px) 100vw, 652px';

export default function BlogCard({ post, featured = false }) {
  return (
    <article className={`blog-card${featured ? ' is-featured' : ''}`}>
      <Link className="blog-card-media" to={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
        <img
          srcSet={post.heroSrcSet}
          sizes={post.heroSrcSet ? (featured ? FEATURED_SIZES : CARD_SIZES) : undefined}
          src={post.heroSrc || post.hero}
          alt=""
          width="800"
          height="450"
          loading="lazy"
          decoding="async"
        />
      </Link>
      <div className="blog-card-body">
        <span className="section-tag">{post.category}</span>
        <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <div className="blog-card-foot">
          <span className="blog-meta-item"><CalendarIcon size={14} /> {formatPostDate(post.date)}</span>
          <span className="blog-meta-item"><ClockIcon size={14} /> {post.readMinutes} min read</span>
        </div>
        <Link className="blog-card-link" to={`/blog/${post.slug}`}>
          READ ARTICLE <ArrowRightIcon size={13} />
        </Link>
      </div>
    </article>
  );
}
