import { GBP } from '../data/siteConfig.js';
import { TESTIMONIALS, testimonialRole } from '../data/testimonials.js';
import { ArrowRightIcon } from './icons.jsx';

// Real client testimonials from src/data/testimonials.js (the rules for adding
// one are there). One renders as the original spotlight card (a service page's
// own); two or more as a grid: three across on desktop, two on tablets,
// stacked on phones, so new ones drop straight in. No star glyphs: a rating
// needs a source (plan §19). The Google link opens the Business Profile, where
// the reviews themselves are read (they are not copied onto the site). These
// are testimonials, not those Google reviews (their source is not recorded
// yet), so the grid is tagged "Client Testimonials" and its Google link sits
// under the cards as a next step, not under the heading as their source.

const HEADLINE = 'What Our Clients Say';
const SUB = 'In their own words: what it’s like working with Bridgeland Builders.';

function GoogleReviewsLink({ cta }) {
  return (
    <a className="blog-card-link testimonial-google-link" href={GBP.mapsUrl} target="_blank" rel="noopener noreferrer" data-cta={cta}>
      READ OUR REVIEWS ON GOOGLE <ArrowRightIcon size={13} />
    </a>
  );
}

/** The quote and its attribution, inside a <figure>. */
function Quote({ item }) {
  return (
    <>
      <blockquote className="testimonial-quote">“{item.quote}”</blockquote>
      <figcaption className="testimonial-author">
        <div className="author-initial" aria-hidden="true">{item.name.charAt(0)}</div>
        <div className="author-info">
          <div className="author-name">{item.name}</div>
          <p>{testimonialRole(item)}</p>
          {/* The public original (e.g. the review on Google), once recorded. */}
          {item.url && (
            <a className="testimonial-source" href={item.url} target="_blank" rel="noopener noreferrer">
              {item.source || 'Read the original'}
            </a>
          )}
        </div>
      </figcaption>
    </>
  );
}

/**
 * `items`: the testimonials to show (all of them by default). `cta`: the
 * data-cta of the Google link, for the click event.
 */
export default function Testimonial({ items = TESTIMONIALS, cta = 'testimonials-google-reviews' }) {
  if (!items.length) return null;

  if (items.length === 1) {
    return (
      <section className="testimonial-section">
        <div className="container">
          <div className="testimonial-card reveal">
            {/* An h2 like every other section title on the page (same class and look). */}
            <div className="testimonial-left">
              <h2 className="testimonial-headline">{HEADLINE}</h2>
              <p className="testimonial-sub">{SUB}</p>
              {GBP.mapsUrl && <GoogleReviewsLink cta={cta} />}
            </div>
            <figure className="testimonial-right">
              <Quote item={items[0]} />
            </figure>
          </div>
        </div>
      </section>
    );
  }

  // Two or four sit two across; three, five or six sit three across.
  const columns = items.length === 2 || items.length === 4 ? 2 : 3;
  return (
    <section className="testimonial-section" id="testimonials">
      <div className="container">
        <div className="section-header center reveal">
          <span className="section-tag">Client Testimonials</span>
          <h2 className="section-title">{HEADLINE}</h2>
          <p className="section-desc">{SUB}</p>
        </div>
        <div className={`testimonial-grid testimonial-grid-${columns}`}>
          {items.map((item, index) => (
            <figure
              className="testimonial-item reveal"
              key={item.id}
              style={index % columns ? { transitionDelay: `${(index % columns) * 0.1}s` } : undefined}
            >
              <Quote item={item} />
            </figure>
          ))}
        </div>
        {GBP.mapsUrl && (
          <p className="testimonial-more">
            <GoogleReviewsLink cta={cta} />
          </p>
        )}
      </div>
    </section>
  );
}
