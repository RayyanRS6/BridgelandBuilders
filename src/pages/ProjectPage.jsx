import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import BlogCard, { formatPostDate } from '../components/BlogCard.jsx';
import BookingAside from '../components/BookingAside.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import EstimatorEmbed from '../components/EstimatorEmbed.jsx';
import QuoteBookingForm from '../components/QuoteBookingForm.jsx';
import Ticker from '../components/Ticker.jsx';
import { ArrowRightIcon, CheckIcon } from '../components/icons.jsx';
import { ESTIMATOR_URLS, PROJECT_ESTIMATORS } from '../data/estimators.js';
import { serviceByPath } from '../data/services.js';
import { COST_HUB_PATH, INSTANT_QUOTE_LABEL, SITE_PHONE, SITE_PHONE_TEL } from '../data/siteConfig.js';
import { serviceTrail } from '../data/trails.js';
import { unsplashImage } from '../lib/unsplash.js';

const FORM_ID = 'service-quote-form';
const ESTIMATOR_ID = 'service-price-guide';
// Drawn sizes of the stock photos, as on the home page: the intro photo fills
// the same box as WhyUs (WhyUs.jsx), the gallery tiles are the col-4 tiles of
// Gallery.jsx.
const INTRO_IMAGE = { sizes: '(max-width: 480px) 380px, (max-width: 1024px) calc(100vw - 72px), 690px', maxWidth: 1200 };
const GALLERY_IMAGE = { sizes: '(max-width: 768px) calc(100vw - 48px), 460px', maxWidth: 1200 };

const has = (list) => Array.isArray(list) && list.length > 0;
const pad = (n) => String(n).padStart(2, '0');
// "a kitchen renovation" / "an office renovation".
const withArticle = (text) => `${/^[aeiou]/i.test(text) ? 'an' : 'a'} ${text}`;
// A type card's `to` is linked only while it is a live service page (never a
// draft or a 404). A #fragment is kept: '/services/restaurant-renovations#hotels'.
const liveServicePath = (to) => {
  const [path, hash] = to ? to.split('#') : [];
  const target = path ? serviceByPath(path) : null;
  if (!target || target.status !== 'live') return null;
  return hash ? `${target.path}#${hash}` : target.path;
};
// A card's text as paragraphs: a string, or an array of short paragraphs.
const paragraphs = (text) => (Array.isArray(text) ? text : [text]).filter(Boolean);
// The instant estimator has price data for these services only (its API lists
// kitchen, bathroom and basement). Other pages keep the same embed, but the
// card doesn't promise a price range for their own service.
const PRICED_ESTIMATOR_KEYS = new Set(['kitchen', 'bathroom', 'basement']);
// Same stagger as before: every card after the first carries a transition delay.
const delay = (index, seconds) => (index > 0 ? { transitionDelay: `${seconds}s` } : undefined);

/**
 * A service page. `project` is the page's content module
 * (src/data/services/<slug>.js), `service` its registry entry
 * (src/data/services.js) and `guidePosts` the blog posts named in
 * project.guides (loaded with the module by ServiceRoute.jsx).
 *
 * Section order (plan §7): hero → ticker → stats → intro → includes → types →
 * local → gallery → process → cost teaser → testimonial → lead → FAQs →
 * related services → guides → CTA → sign-off. Every section after the hero
 * renders only when its content exists, using the page's existing classes.
 */
export default function ProjectPage({ project, service, guidePosts = [] }) {
  const name = project.breadcrumb || (service && service.label) || '';
  const estimatorSrc =
    (service && PROJECT_ESTIMATORS[service.projectSlug]) ||
    PROJECT_ESTIMATORS[project.slug] ||
    (service && ESTIMATOR_URLS[service.estimatorKey]);
  const formType = service ? service.formType : null;
  const hasPriceData = Boolean(service && PRICED_ESTIMATOR_KEYS.has(service.estimatorKey));

  // The visible trail is the schema trail (seo.js serviceTrail): Services ›
  // (parent) › page.
  const trail = service ? serviceTrail(service) : [['Services', '/services'], [name, '']];

  const types = has(project.types) ? project.types : [];
  const local = project.local && has(project.local.items) ? project.local : null;
  const localSources = local && has(local.sources) ? local.sources : [];
  const costTeaser = project.costTeaser && project.costTeaser.text && project.costTeaser.to ? project.costTeaser : null;
  // Only live pages are linked; a draft related service is left out.
  const related = (project.related || [])
    .map((path) => serviceByPath(path))
    .filter((item) => item && item.status === 'live' && (!service || item.path !== service.path));
  const signoff = project.ownerSignoff || null;
  // "your kitchen renovation" / "your flooring project": reads right with every
  // page name (the price guide card and the CTA banner below).
  const projectName = name.toLowerCase();

  return (
    <>
      {/* BREADCRUMB */}
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {trail.map(([label, to], index) => (
            <Fragment key={`${to}-${label}`}>
              <span className="breadcrumb-sep">/</span>
              {index === trail.length - 1 ? (
                <span className="breadcrumb-current">{label}</span>
              ) : (
                <Link to={to}>{label}</Link>
              )}
            </Fragment>
          ))}
        </nav>
      </div>

      {/* HERO + QUOTE FORM AND CALENDAR */}
      <section className="hero-section" id="book">
        <div className="container">
          <div className="hero-card hero-booking hero-rise">
            <div className="hero-content">
              <div className="badge-soft">
                <CheckIcon size={13} />
                {project.badge}
              </div>
              <h1 className="hero-title">
                {project.title}
                {project.titleHighlight ? <> <span>{project.titleHighlight}</span></> : null}
              </h1>
              {project.subtitle && (
                <p className="hero-subtitle">
                  {project.subtitle}
                </p>
              )}
              {has(project.heroPoints) && (
                <ul className="hero-points">
                  {project.heroPoints.map((point) => (
                    <li key={point}>
                      <CheckIcon size={17} />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              <div className="hero-cta-group">
                {/* Shorter than the old "BOOK AN APPOINTMENT", so it stays on one line at 320px. */}
                <a href={`#${FORM_ID}`} className="btn-pill-red btn-line-normal" data-cta="service-hero-book-visit">
                  <span>BOOK A FREE VISIT</span>
                  <ArrowRightIcon size={15} />
                </a>
                <a href={SITE_PHONE_TEL} className="btn-pill-ghost" data-cta="service-hero-call">
                  <span>Call {SITE_PHONE}</span>
                </a>
              </div>
            </div>

            <QuoteBookingForm
              id={FORM_ID}
              title="Book Your Free On-Site Visit"
              initialTypes={formType ? [formType] : []}
            />
          </div>
        </div>
      </section>

      {/* TICKER BANNER */}
      <Ticker />

      {/* STATS OVERVIEW */}
      {has(project.stats) && (
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {project.stats.map((stat, index) => (
                <div
                  className="stat-card reveal"
                  key={stat.label}
                  style={delay(index, index * 0.1)}
                >
                  <div className="stat-num">{stat.num}<span className="stat-unit">{stat.unit}</span></div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* THE PITCH (dark section, same as home "Why Bridgeland") */}
      {project.intro && (
        <section className="why-section" id="about">
          <div className="container">
            <div className="why-grid">
              <div className="why-visual-stack reveal" style={{ position: 'relative' }}>
                <div className="why-main-img">
                  <img {...unsplashImage(project.intro.image, INTRO_IMAGE)} alt={project.intro.imageAlt} width="1000" height="750" loading="lazy" decoding="async" />
                </div>
                <div className="why-floating-card">
                  <div className="why-floating-title">{project.intro.floatingTitle}</div>
                  <p>{project.intro.floatingText}</p>
                </div>
              </div>

              <div className="why-content reveal">
                <span className="section-tag">{project.intro.tag}</span>
                <h2 className="section-title">{project.intro.title}</h2>
                <div className="why-paragraphs">
                  {(project.intro.paragraphs || []).map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>

                {has(project.intro.checklist) && (
                  <ul className="why-checklist">
                    {project.intro.checklist.map((item) => (
                      <li key={item}>
                        <CheckIcon size={18} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <a href={`#${FORM_ID}`} className="btn-pill-red btn-line-normal" data-cta="service-intro-book-visit">
                  <span>CHECK AVAILABLE DATES</span>
                  <ArrowRightIcon size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WHAT'S INCLUDED */}
      {project.includes && has(project.includes.items) && (
        <section className="process-section includes-section" id="included">
          <div className="container">
            <div className="section-header center reveal">
              <span className="section-tag">{project.includes.tag}</span>
              <h2 className="section-title">{project.includes.title}</h2>
              <p className="section-desc">{project.includes.desc}</p>
            </div>

            <div className="includes-grid">
              {project.includes.items.map((item, index) => (
                <div
                  className="include-card reveal"
                  key={item.num}
                  style={delay(index, (index % 3) * 0.1)}
                >
                  <div className="include-num">{item.num}</div>
                  <h3>{item.title}</h3>
                  {paragraphs(item.text).map((text) => (
                    <p key={text.slice(0, 40)}>{text}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TYPES OF WORK */}
      {types.length > 0 && (
        <section className="process-section includes-section" id="types">
          <div className="container">
            <div className="section-header center reveal">
              <span className="section-tag">{project.typesTag || 'Project Types'}</span>
              <h2 className="section-title">{project.typesTitle || `Types of ${(service && service.label) || name}`}</h2>
              {project.typesDesc && <p className="section-desc">{project.typesDesc}</p>}
            </div>

            <div className="includes-grid">
              {types.map((item, index) => {
                const to = liveServicePath(item.to);
                return (
                  <div
                    className="include-card reveal"
                    id={item.id}
                    key={item.title}
                    style={delay(index, (index % 3) * 0.1)}
                  >
                    <div className="include-num">{item.num || pad(index + 1)}</div>
                    {/* Same linked-title pattern as the /service-areas cards. */}
                    <h3>{to ? <Link to={to}>{item.title}</Link> : item.title}</h3>
                    {paragraphs(item.text).map((text) => (
                      <p key={text.slice(0, 40)}>{text}</p>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* LOCAL KNOW-HOW: permits, rules and sources (plan §7) */}
      {local && (
        <section className="process-section includes-section" id="local">
          <div className="container">
            <div className="section-header center reveal">
              <span className="section-tag">{local.tag || 'In Winnipeg'}</span>
              <h2 className="section-title">{local.title}</h2>
              {local.intro && <p className="section-desc">{local.intro}</p>}
              {/* The page's one link to the service-area hub, which lists who
                  issues permits in each community. */}
              <p className="section-desc">
                Outside Winnipeg? See{' '}
                <Link className="blog-inline-link" to="/service-areas">
                  who issues permits in each community we serve
                </Link>
                .
              </p>
              {localSources.length > 0 && (
                <p className="section-desc">
                  Sources:{' '}
                  {localSources.map((source, index) => (
                    <Fragment key={source.url}>
                      {index > 0 && '; '}
                      <a href={source.url} rel="noopener" target="_blank">{source.label}</a>
                      {source.accessed && ` (verified ${source.accessed})`}
                    </Fragment>
                  ))}
                </p>
              )}
            </div>

            <div className="includes-grid">
              {local.items.map((item, index) => (
                <div
                  className="include-card reveal"
                  key={item.title}
                  style={delay(index, (index % 3) * 0.1)}
                >
                  <div className="include-num">{item.num || pad(index + 1)}</div>
                  <h3>{item.title}</h3>
                  {paragraphs(item.text).map((text) => (
                    <p key={text.slice(0, 40)}>{text}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DESIGN IDEAS GALLERY (optional) */}
      {project.gallery && has(project.gallery.items) && (
        <section className="gallery-section" id="work">
          <div className="container">
            <div className="section-header center reveal">
              <span className="section-tag">{project.gallery.tag}</span>
              <h2 className="section-title">{project.gallery.title}</h2>
              <p className="section-desc">{project.gallery.desc}</p>
            </div>

            <div className="gallery-grid">
              {project.gallery.items.map((item, index) => (
                <div
                  className="gallery-item col-4 reveal"
                  key={item.title}
                  style={delay(index, index * 0.1)}
                >
                  <img {...unsplashImage(item.img, GALLERY_IMAGE)} alt={item.alt} width="800" height="600" loading="lazy" decoding="async" />
                  <div className="gallery-overlay">
                    <div className="gallery-overlay-title">{item.title}</div>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      {project.process && has(project.process.steps) && (
        <section className="process-section" id="steps">
          <div className="container">
            <div className="section-header center reveal">
              <span className="section-tag">{project.process.tag}</span>
              <h2 className="section-title">{project.process.title}</h2>
              <p className="section-desc">{project.process.desc}</p>
            </div>

            <div className="process-grid">
              {project.process.steps.map((step, index) => (
                <div
                  className="process-card reveal"
                  key={step.num}
                  style={delay(index, index * 0.1)}
                >
                  <div className="process-step-num">{step.num}</div>
                  <h3 className="process-card-title">{step.title}</h3>
                  <p className="process-card-text">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COST TEASER: one or two lines and a link to the cost page (no cost H2 here) */}
      {costTeaser && (
        <section className="includes-section" id="cost">
          <div className="container">
            <div className="section-header center reveal">
              <p className="section-desc">{costTeaser.text}</p>
              <Link className="blog-card-link" to={costTeaser.to}>
                {(costTeaser.label || 'See the cost guide').toUpperCase()} <ArrowRightIcon size={13} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIAL (optional) */}
      {project.testimonial && project.testimonial.quote && (
        <section className="testimonial-section">
          <div className="container">
            <div className="testimonial-card reveal">
              {/* An h2 like every other section title on the page (same class and
                  look); no star glyphs, since a rating needs a source (plan §19). */}
              <div className="testimonial-left">
                <h2 className="testimonial-headline">What Our Clients Say</h2>
                <p className="testimonial-sub">In their own words: what it’s like working with Bridgeland Builders.</p>
              </div>
              <div className="testimonial-right">
                <p className="testimonial-quote">{project.testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className="author-initial">{project.testimonial.initial}</div>
                  <div className="author-info">
                    <div className="author-name">{project.testimonial.name}</div>
                    <p>{project.testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LEAD CAPTURE / BOOKING FORM */}
      <section className="lead-section" id="book-form">
        <div className="container">
          <div className="lead-grid">
            <div>
              <BookingAside serviceName={name} />
            </div>
            <div>
              <div className="lead-card price-guide-card" id={ESTIMATOR_ID}>
                <div className="lead-card-head">
                  {hasPriceData ? (
                    <>
                      <h3>Get Your Free {name} Price Guide</h3>
                      <p>Answer a few quick questions for an instant estimate: a useful starting price range for your project. This planning guide is free and does not obligate you to proceed.</p>
                    </>
                  ) : (
                    <>
                      <h3>Get a Free Instant Price Guide</h3>
                      <p>Our instant price guide gives starting ranges for kitchen, bathroom and basement renovations. Your {projectName} is priced in the free written quote that follows an on-site visit.</p>
                    </>
                  )}
                </div>
                {estimatorSrc && (
                  <EstimatorEmbed
                    src={estimatorSrc}
                    title={`${name} price guide`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {has(project.faqs) && (
        <section className="faq-section" id="faqs">
          <div className="container">
            <div className="section-header center reveal">
              <span className="section-tag">Questions</span>
              <h2 className="section-title">{project.faqsTitle || 'Frequently Asked Questions'}</h2>
              <p className="section-desc">The things people ask us most before booking {withArticle(projectName)}.</p>
              {/* The page's one link to the site-wide FAQs. */}
              <Link className="blog-card-link" to="/faqs">
                MORE RENOVATION FAQS <ArrowRightIcon size={13} />
              </Link>
            </div>
            <div className="reveal">
              <FaqAccordion items={project.faqs} />
            </div>
          </div>
        </section>
      )}

      {/* RELATED SERVICES (live pages only, text cards) */}
      {related.length > 0 && (
        <section className="process-section" id="related">
          <div className="container">
            <div className="section-header center reveal">
              <span className="section-tag">Keep Exploring</span>
              <h2 className="section-title">{project.relatedTitle || 'Related Services'}</h2>
            </div>
            <div className="service-directory-grid">
              {related.map((item, index) => (
                <article className="service-directory-card reveal" key={item.path} style={delay(index, (index % 3) * 0.1)}>
                  <span className="service-directory-number">{pad(index + 1)}</span>
                  <h3>{item.label}</h3>
                  <p>{item.summary}</p>
                  {/* The hidden name makes the link "Explore service: Kitchen
                      Renovations" for screen readers and search, with no visual change. */}
                  <Link className="service-directory-action" to={item.path}>
                    Explore service<span className="visually-hidden">: {item.label}</span><ArrowRightIcon size={13} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELATED GUIDES (blog posts named in project.guides) */}
      {has(guidePosts) && (
        <section className="blog-related-section" id="guides">
          <div className="container">
            <span className="section-tag">Guides</span>
            <h2 className="blog-related-heading">{project.guidesTitle || 'Related guides'}</h2>
            <div className="blog-grid">
              {guidePosts.map((post) => (
                <div className="reveal" key={post.slug}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER. Only pages the estimator has price data for promise
          instant numbers; the others are priced after a visit, so their banner
          goes to this page's booking form instead. Every page also links the
          cost hub, as CtaBanner does elsewhere (.cta-banner-link). */}
      <section className="cta-banner-section" id="quote">
        <div className="container">
          <div className="cta-banner-card reveal">
            <div className="cta-banner-left">
              <h2>Still thinking it over?</h2>
              {hasPriceData ? (
                <p>Grab a free quote instead — tell us roughly what you need and we’ll come back with numbers. No appointment required.</p>
              ) : (
                <p>Book a free on-site visit and we’ll follow up with a free written quote for your {projectName}. There’s no obligation to go ahead.</p>
              )}
              <p className="cta-banner-link">
                <Link to={COST_HUB_PATH} data-cta="service-cta-costs">
                  See renovation cost ranges
                </Link>
              </p>
            </div>
            <div className="cta-banner-right">
              {hasPriceData ? (
                // This page's own estimator, already set to this service,
                // rather than the general one on /instant-quote.
                <a href={`#${ESTIMATOR_ID}`} className="btn-pill-red btn-pill-lg btn-line-normal" data-cta="service-cta-price-guide">
                  <span>{INSTANT_QUOTE_LABEL.toUpperCase()}</span>
                  <ArrowRightIcon size={16} />
                </a>
              ) : (
                <a href={`#${FORM_ID}`} className="btn-pill-red btn-pill-lg btn-line-normal" data-cta="service-cta-book-visit">
                  <span>BOOK A FREE VISIT</span>
                  <ArrowRightIcon size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OWNER SIGN-OFF */}
      {signoff && signoff.name && (
        <div className="container">
          <div className="section-header center">
            <p className="section-desc">
              Reviewed by {signoff.name}{signoff.role ? `, ${signoff.role}` : ''}
              {signoff.date && (
                <>
                  {' '}on <time dateTime={signoff.date}>{formatPostDate(signoff.date)}</time>
                </>
              )}
              .
            </p>
          </div>
        </div>
      )}
    </>
  );
}
