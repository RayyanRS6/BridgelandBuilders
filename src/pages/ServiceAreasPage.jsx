import { Link } from 'react-router-dom';
import FaqAccordion from '../components/FaqAccordion.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { formatPostDate } from '../components/BlogCard.jsx';
import { ArrowRightIcon, CheckIcon, PinIcon } from '../components/icons.jsx';
import {
  SERVICE_AREAS_CONTENT,
  confirmedServiceAreas,
  serviceAreasSeoOptions,
} from '../data/serviceAreasContent.js';
import { liveServices } from '../data/services.js';
import {
  INSTANT_QUOTE_LABEL,
  INSTANT_QUOTE_PATH,
  SERVICE_AREA_STATEMENT,
  SITE_PHONE,
  SITE_PHONE_TEL,
} from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';

const PATH = '/service-areas';
const SEO_OPTIONS = serviceAreasSeoOptions();

/**
 * The service-area hub (plan §14.5). Same card as /outside-winnipeg, then who
 * issues building permits in each confirmed community (checked on each
 * authority's own site), the services available across the area, and FAQs.
 * The communities come from SERVICE_AREAS in siteConfig.js, so this page, the
 * schema and the quote form always agree. Community pages are linked only once
 * they are published (serviceAreasContent.js).
 */
export default function ServiceAreasPage() {
  const { intro, introSource, faqs } = SERVICE_AREAS_CONTENT;
  const areas = confirmedServiceAreas();
  const services = liveServices();

  // Title/description from PAGE_SEO['/service-areas']; same options as head.js.
  usePageSeo(PATH, SEO_OPTIONS);

  return (
    <main className="outside-winnipeg-page">
      <section className="service-area-section">
        <div className="container">
          <div className="service-area-card">
            <div className="service-area-copy">
              <span className="service-area-eyebrow">
                <PinIcon size={15} /> Our service area
              </span>

              <p className="service-area-kicker">AREAS WE SERVE</p>
              {/* The space before <br /> keeps the words apart in the page text. */}
              <h1>
                WINNIPEG{' '}<br />
                <span>&amp; NEARBY COMMUNITIES</span>
              </h1>

              <p className="service-area-lead">{SERVICE_AREA_STATEMENT}</p>

              <div className="service-area-note">
                <span className="service-area-note-icon"><CheckIcon size={15} /></span>
                <p>
                  <strong>Outside these areas?</strong> Call us on{' '}
                  <a href={SITE_PHONE_TEL}><strong>{SITE_PHONE}</strong></a> and we’ll tell you honestly
                  whether we can help, or send your project details through our{' '}
                  {/* /contact-us here: the booking page already has its own button below. */}
                  <Link to="/contact-us"><strong>contact form</strong></Link>.
                </p>
              </div>

              <div className="service-area-actions">
                <Link to={INSTANT_QUOTE_PATH} className="btn-pill-red" data-cta="service-areas-instant-quote">
                  {INSTANT_QUOTE_LABEL} <ArrowRightIcon size={15} />
                </Link>
                <Link to="/book-online" className="btn-pill-ghost" data-cta="service-areas-book-visit">
                  Book a Free On-Site Visit
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
        </div>
      </section>

      {/* COMMUNITIES + WHO ISSUES PERMITS */}
      <section className="process-section includes-section" id="communities">
        <div className="container">
          <div className="section-header center reveal">
            <span className="section-tag">Communities we serve</span>
            <h2 className="section-title">Who issues building permits where we work</h2>
            <p className="section-desc">
              {intro}{' '}
              {introSource && (
                <>
                  Source:{' '}
                  <a className="blog-inline-link" href={introSource.url} target="_blank" rel="noopener noreferrer">
                    {introSource.label}
                  </a>
                  .
                </>
              )}
            </p>
          </div>

          <div className="includes-grid">
            {areas.map((area, index) => (
              <div
                className="include-card reveal"
                key={area.slug}
                style={index > 0 ? { transitionDelay: `${(index % 3) * 0.1}s` } : undefined}
              >
                <div className="include-num">{area.municipality}</div>
                <h3>{area.path ? <Link to={area.path}>{area.name}</Link> : area.name}</h3>
                <p>
                  <strong>Building permits:</strong> {area.permitAuthority || 'the local municipality'}.
                  {area.notes ? ` ${area.notes}` : ''}
                </p>
                {area.permitUrl && area.permitAuthority && (
                  <a className="blog-card-link" href={area.permitUrl} target="_blank" rel="noopener noreferrer">
                    PERMIT INFORMATION <ArrowRightIcon size={13} />
                  </a>
                )}
                {area.accessed && <p className="tpl-card-foot">Checked {formatPostDate(area.accessed)}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE BUILD IN EACH AREA */}
      {services.length > 0 && (
        <section className="process-section" id="services-by-area">
          <div className="container">
            <div className="service-directory-overview">
              <span className="section-tag">Services</span>
              <h2>What we build in each area</h2>
              <p>Every service below is available in Winnipeg and in each community listed above.</p>
              <div className="blog-filter-pills tpl-pill-row">
                {services.map((service) => (
                  <Link className="blog-filter-pill" to={service.path} key={service.path}>
                    {service.navLabel || service.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="faq-section" id="faqs">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">Questions</span>
            <h2 className="section-title">Service area questions</h2>
          </div>
          <FaqAccordion items={faqs} headingLevel={3} />
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
