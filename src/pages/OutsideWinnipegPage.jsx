import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckIcon, PinIcon } from '../components/icons.jsx';
import { SERVICE_AREA_STATEMENT, SITE_PHONE, SITE_PHONE_TEL } from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';

// The service area page. The communities named here come from SERVICE_AREAS in
// siteConfig.js (confirmed ones only), so this page, the schema and the quote
// form always agree.
export default function OutsideWinnipegPage() {
  usePageSeo('/outside-winnipeg');

  return (
    <main className="outside-winnipeg-page">
      <section className="service-area-section">
        <div className="container">
          <div className="service-area-card">
            <div className="service-area-copy">
              <span className="service-area-eyebrow">
                <PinIcon size={15} /> Our current service area
              </span>

              <p className="service-area-kicker">WHERE WE WORK</p>
              {/* The space before <br /> keeps the words apart in the page text. */}
              <h1>
                SERVING WINNIPEG{' '}<br />
                <span>&amp; NEARBY COMMUNITIES</span>
              </h1>

              <p className="service-area-lead">{SERVICE_AREA_STATEMENT}</p>

              <div className="service-area-note">
                <span className="service-area-note-icon"><CheckIcon size={15} /></span>
                {/* A phone call, not the form: the quote form answers an
                    out-of-area project with an automatic "not in your area"
                    message, so it cannot keep this promise. */}
                <p>
                  <strong>Outside these areas?</strong> Call us on{' '}
                  <a href={SITE_PHONE_TEL}><strong>{SITE_PHONE}</strong></a> and we’ll tell you honestly
                  whether we can help.
                </p>
              </div>

              <div className="service-area-actions">
                <Link to="/book-online" className="btn-pill-red">
                  Send Your Details <ArrowRightIcon size={15} />
                </Link>
                <Link to="/" className="btn-pill-ghost">
                  Back to Home
                </Link>
              </div>
            </div>

            <div className="service-area-visual" aria-label="Serving Winnipeg and nearby communities">
              <div className="service-area-orbit service-area-orbit-one" aria-hidden="true" />
              <div className="service-area-orbit service-area-orbit-two" aria-hidden="true" />
              <div className="service-area-pin" aria-hidden="true">
                <PinIcon size={38} />
              </div>
              <div className="service-area-location">
                <span>Based in</span>
                <strong>Winnipeg</strong>
                <small>Manitoba</small>
              </div>
              <div className="service-area-coming-soon">
                <span className="pulse-dot" />
                Plus nearby communities
              </div>
            </div>
          </div>

          <p className="service-area-thanks">
            From our Winnipeg team, thank you for thinking of us.
          </p>
        </div>
      </section>
    </main>
  );
}
