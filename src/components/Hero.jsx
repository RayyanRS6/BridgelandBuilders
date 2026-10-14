import { Link } from 'react-router-dom';
import { EXPERIENCE_YEARS } from '../data/facts.js';
import { INSTANT_QUOTE_LABEL, INSTANT_QUOTE_PATH } from '../data/siteConfig.js';
import { STOCK_IMAGES } from '../data/stockImages.generated.js';
import Picture from './Picture.jsx';
import { ArrowRightIcon, StarIcon } from './icons.jsx';

// The LCP image, served from this site (scripts/build-images.mjs --only=stock:
// a stock photo, AVIF with a WebP fallback) so it needs no connection to
// images.unsplash.com. The arch frame crops it with object-fit: cover, so it
// is drawn about 96vw wide on phones (the frame is clamp(240px, 64vw, 330px)
// tall), 540px on tablets and 690px on desktop. scripts/prerender.mjs turns
// the AVIF <source> into the image preload.
const HERO_IMAGE = STOCK_IMAGES['home-hero'];
const HERO_SIZES = '(max-width: 640px) 96vw, (max-width: 1024px) 540px, 690px';

export default function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="hero-card hero-rise">
          <div className="hero-content">
            {/* The tagline (BUSINESS.slogan) sits in the badge: in the H1 it
                would push the heading to five or six lines at 320px, so the
                plan's fallback H1 is used (SEO plan §7). */}
            <div className="badge-soft">
              <StarIcon size={13} />
              Bridging Dreams Into Reality
            </div>
            <h1 className="hero-title">
              WINNIPEG RENOVATION <span>CONTRACTOR</span>
            </h1>
            <p className="hero-subtitle">
              Kitchens, bathrooms, basements, whole homes, additions and commercial spaces in Winnipeg and nearby communities. Every project starts with a free on-site visit and a free written quote.
            </p>
            <div className="hero-cta-group">
              {/* Main CTA in Red */}
              <Link to={INSTANT_QUOTE_PATH} className="btn-pill-red" data-cta="home-hero-instant-quote">
                <span>{INSTANT_QUOTE_LABEL.toUpperCase()}</span>
                <ArrowRightIcon size={15} />
              </Link>
              <Link to="/services" className="btn-pill-ghost" data-cta="home-hero-services">
                <span>Our Services</span>
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-arch-frame">
              <Picture
                avifSrcSet={HERO_IMAGE.avifSrcSet}
                srcSet={HERO_IMAGE.srcSet}
                sizes={HERO_SIZES}
                src={HERO_IMAGE.src}
                alt="Bright living room with a sofa, armchair and large windows"
                width={HERO_IMAGE.width}
                height={HERO_IMAGE.height}
                fetchpriority="high"
              />
            </div>
            <div className="hero-floating-badge">
              <div className="avatar-group">★</div>
              <div className="badge-text">
                {/* No Google rating next to the main CTA until the profile has
                    10+ reviews (SEO plan §19). Free written quotes are stated
                    across the site (FAQs, booking aside, /free-quote).
                    A badge label, not a heading: it would sit out of order
                    in the page's heading outline. */}
                <div className="badge-title">Free Written Quotes</div>
                <p>Over {EXPERIENCE_YEARS} Years Combined Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
