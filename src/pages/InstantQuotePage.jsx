import { Link } from 'react-router-dom';
import EstimatorEmbed from '../components/EstimatorEmbed.jsx';
import { ArrowRightIcon } from '../components/icons.jsx';
import { ESTIMATOR_URLS } from '../data/estimators.js';
import { INSTANT_QUOTE_PATH, SITE_PHONE, SITE_PHONE_E164 } from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';

/**
 * Where every "Get Free Instant Quote" button leads: the EstimatorX360
 * estimator, embedded so the whole quote happens on our own site. Same
 * section, header and estimator shell as the price guide on /services.
 *
 * No `.reveal` here: that class holds an element at opacity 0 until the bundle
 * hydrates, and the estimator should be on screen from the first paint.
 */
export default function InstantQuotePage() {
  usePageSeo(INSTANT_QUOTE_PATH);

  return (
    <main>
      <section className="estimator-section instant-quote-section">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">Free Instant Quote</span>
            <h1 className="section-title">Get Your Free Instant Quote</h1>
            <p className="section-desc">
              Choose your project and answer a few quick questions to see a starting price range for your
              renovation. It’s free and there’s no obligation.
            </p>
          </div>

          <div className="estimator-shell">
            <EstimatorEmbed src={ESTIMATOR_URLS.overall} title="Free instant quote - EstimatorX360" />
          </div>

          {/* For visitors who are not after a price yet: book a visit or browse. */}
          <div className="instant-quote-next">
            <h2>Prefer to talk it through?</h2>
            <p>
              Book a free on-site visit and we’ll look at the space with you, or browse everything we build first.
              You can also call us at <a href={`tel:${SITE_PHONE_E164}`}>{SITE_PHONE}</a>.
            </p>
            <div className="hero-cta-group">
              <Link to="/book-online" className="btn-pill-red">
                <span>BOOK A FREE ON-SITE VISIT</span>
                <ArrowRightIcon size={15} />
              </Link>
              <Link to="/services" className="btn-pill-ghost">
                <span>View All Services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
