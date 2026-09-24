import QuoteBookingForm from '../components/QuoteBookingForm.jsx';
import { preselectRenovationType } from '../lib/quoteFormEvents.js';
import { ArrowRightIcon, CheckIcon, PhoneIcon, StarIcon } from '../components/icons.jsx';
import { LANDING_SERVICES } from '../data/landingServices.js';
import { SITE_PHONE } from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

// Every call to action on this page lands on the form in the hero. Plain hash
// links rather than click handlers, so they already work in the prerendered
// HTML before the JS bundle has loaded on a slow phone connection.
const FORM_ID = 'get-started';

const HERO_POINTS = [
  'Free, no-obligation on-site visit',
  'Clear written quote — nothing hidden',
  'Reply within one business day',
];

/**
 * Landing page for paid social traffic (Meta ads). Built from the site theme:
 * the hero is the same two-column booking hero the service pages use, with the
 * site's own quote form and calendar in the booking card, followed by the home
 * page's service cards.
 *
 * The hero deliberately skips `.reveal`: that class holds an element at
 * opacity 0 until the bundle hydrates, and an ad visitor should see the offer
 * and the form from the very first paint.
 */
export default function FreeQuotePage() {
  usePageSeo('/free-quote');
  useScrollReveal();

  return (
    <main>
      {/* HERO + QUOTE FORM + CALENDAR */}
      <section className="hero-section lp-hero">
        <div className="container">
          <div className="hero-card hero-booking">
            <div className="hero-content">
              <div className="badge-soft">
                <StarIcon size={13} />
                Free In-Home Quotes Across Winnipeg
              </div>
              <h1 className="hero-title">
                RENOVATIONS DONE RIGHT. <span>QUOTED FREE.</span>
              </h1>
              <p className="hero-subtitle">
                Kitchens, bathrooms and basements across Winnipeg — planned properly, priced in writing,
                and built by a local crew with over 60 years of combined experience.
              </p>
              <ul className="hero-points">
                {HERO_POINTS.map((point) => (
                  <li key={point}>
                    <CheckIcon size={17} />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="hero-cta-group">
                <a href={`#${FORM_ID}`} className="btn-pill-red">
                  <span>GET MY FREE QUOTE</span>
                  <ArrowRightIcon size={15} />
                </a>
                <a href={`tel:${SITE_PHONE}`} className="btn-pill-ghost">
                  <PhoneIcon size={15} />
                  <span>Call {SITE_PHONE}</span>
                </a>
              </div>
            </div>

            <QuoteBookingForm id={FORM_ID} />
          </div>
        </div>
      </section>

      {/* SERVICE HIGHLIGHTS */}
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-header center reveal">
            <span className="section-tag">What We Build</span>
            <h2 className="section-title">Renovations We Specialize In</h2>
            <p className="section-desc">
              Each one planned properly, priced in writing, and built by the same Winnipeg crew from start to finish.
            </p>
          </div>

          <div className="services-grid">
            {LANDING_SERVICES.map((service, index) => (
              <div
                className="service-card reveal"
                key={service.id}
                style={index % 3 ? { transitionDelay: `${(index % 3) * 0.12}s` } : undefined}
              >
                <div className="service-img-wrapper">
                  <span className="service-tag-floating">{service.tag}</span>
                  <img src={service.img} alt={service.alt} width="800" height="600" loading="lazy" decoding="async" />
                </div>
                <div className="service-body">
                  <div>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-text">{service.text}</p>
                    <ul className="lp-service-points">
                      {service.points.map((point) => (
                        <li key={point}>
                          <CheckIcon size={15} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={`#${FORM_ID}`}
                    className="service-action"
                    onClick={() => service.formType && preselectRenovationType(service.formType)}
                  >
                    <span>{service.cta}</span>
                    <span className="arrow-circle"><ArrowRightIcon size={13} /></span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
