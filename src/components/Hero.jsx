import { Link } from 'react-router-dom';
import { INSTANT_QUOTE_LABEL, INSTANT_QUOTE_PATH } from '../data/siteConfig.js';
import { ArrowRightIcon, StarIcon } from './icons.jsx';

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
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
                alt="Bright living room with a sofa, armchair and large windows"
                width="1000"
                height="667"
                fetchpriority="high"
              />
            </div>
            <div className="hero-floating-badge">
              <div className="avatar-group">★</div>
              <div className="badge-text">
                {/* No Google rating next to the main CTA until the profile has
                    10+ reviews (SEO plan §19). Free written quotes are stated
                    across the site (FAQs, booking aside, /free-quote). */}
                <h4>Free Written Quotes</h4>
                <p>Over 60 Years Combined Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
