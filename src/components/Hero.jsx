import { Link } from 'react-router-dom';
import { EXPERIENCE_YEARS } from '../data/facts.js';
import { INSTANT_QUOTE_LABEL, INSTANT_QUOTE_PATH } from '../data/siteConfig.js';
import HeroVideo from './HeroVideo.jsx';
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
            {/* Leads with the price tool (owner's competitor review). The
                estimator prices kitchens, bathrooms and basements only, and
                shows the range before asking for any contact details: five
                one-tap questions, about 40 seconds in a test run on
                2026-10-23 (bathroom). */}
            <p className="hero-subtitle">
              See your kitchen, bathroom or basement price range in about a minute. No call needed. We also do whole homes, additions and commercial spaces in Winnipeg and nearby communities. On-site visits and written quotes are free.
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
              <HeroVideo />
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
