import { Link } from 'react-router-dom';
import EstimatorEmbed from '../components/EstimatorEmbed.jsx';
import RichBody from '../components/RichBody.jsx';
import { ArrowRightIcon } from '../components/icons.jsx';
import { ESTIMATOR_URLS } from '../data/estimators.js';
import { COST_HUB_PATH, INSTANT_QUOTE_PATH, SITE_PHONE, SITE_PHONE_TEL } from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';

// Crawlable guide BELOW the estimator (SEO plan §7): how it works, what moves
// the price, instant quote vs written quote, and the cost guides. No prices
// here — those come only from Bridgeland's own data on the cost pages.
const GUIDE_BLOCKS = [
  { t: 'h2', x: 'How does the instant quote work?' },
  {
    t: 'p',
    x: 'Choose your project type in the price calculator above, answer a few quick questions about the size, scope and finishes, and you will see a starting price range on screen. It takes a few minutes, it is free, and there is no obligation. It covers kitchen, bathroom and basement renovations. For other projects, including commercial work, book a free on-site visit and we will send you a free written quote.',
  },
  { t: 'h2', x: 'What moves the price of a renovation?' },
  {
    t: 'p',
    x: 'Two projects of the same size can land far apart. These are the factors that move the number most:',
  },
  { t: 'li', x: '**Size and layout.** Moving plumbing, walls or windows costs more than keeping the layout you have.' },
  { t: 'li', x: '**Finishes.** Cabinets, countertops, tile, flooring and fixtures range widely in price.' },
  { t: 'li', x: '**What is behind the walls.** Old wiring, moisture or uneven floors found once work starts add to the job.' },
  { t: 'li', x: '**Permits and inspections.** Work that needs them takes more planning and more time on the schedule.' },
  { t: 'h2', x: 'Is the instant quote the same as a written quote?' },
  {
    t: 'p',
    x: 'No. The instant quote is a starting range based on your answers. Your written quote comes after a free on-site visit, once we have measured the space and agreed the scope with you. It sets out the work, the price and the schedule, with taxes shown, and nothing starts until you approve it.',
  },
  {
    t: 'table',
    caption: 'Instant quote and written quote compared',
    head: ['', 'Instant quote', 'Written quote'],
    rows: [
      ['When', 'Right now, online', 'After a free on-site visit'],
      ['Based on', 'Your answers to a few questions', 'Measurements and the scope we agree with you'],
      ['What you get', 'A starting price range', 'The scope, price and schedule, with taxes shown'],
      ['Cost', 'Free', 'Free'],
      ['Commitment', 'None', 'None until you approve it'],
    ],
  },
  { t: 'h2', x: 'Where can I see renovation cost ranges?' },
  {
    t: 'p',
    x: `Our cost guides list the starting price ranges our estimator uses for Winnipeg kitchens, bathrooms and basements and explain what drives them, so you can compare your instant quote before you book a visit. Start with [renovation costs in Winnipeg](${COST_HUB_PATH}), or go straight to [kitchen renovation costs](/services/kitchen-renovations/cost), [bathroom renovation costs](/services/bathroom-renovations/cost) or [basement development costs](/services/basement-renovations/cost).`,
  },
  {
    t: 'p',
    x: 'Not sure which project type to pick? Choose the closest one and tell us the rest at the visit, or read [how a renovation with us runs, step by step](/our-process).',
  },
  {
    t: 'p',
    x: 'Have other questions about costs, permits or timelines? Find answers on our [renovation FAQs page](/faqs).',
  },
];

/**
 * Where every "Get Free Instant Quote" button leads: the EstimatorX360
 * estimator, embedded so the whole quote happens on our own site. Same
 * section, header and estimator shell as the price guide on /services. The
 * estimator stays first; the explanatory copy sits below it.
 *
 * No `.reveal` here: that class holds an element at opacity 0 until the bundle
 * hydrates, and the estimator should be on screen from the first paint. For
 * the same reason the iframe loads eagerly here (lazy everywhere else), and
 * scripts/prerender.mjs adds a preconnect to the estimator's origin.
 */
export default function InstantQuotePage() {
  usePageSeo(INSTANT_QUOTE_PATH);

  return (
    <main>
      <section className="estimator-section instant-quote-section">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">Free Instant Quote</span>
            <h1 className="section-title">Get Your Free Instant Renovation Quote in Winnipeg</h1>
            <p className="section-desc">
              Choose your project and answer a few quick questions to see a starting price range for your
              renovation. It’s free and there’s no obligation.
            </p>
          </div>

          <div className="estimator-shell">
            <EstimatorEmbed src={ESTIMATOR_URLS.overall} title="Free instant quote - Price Calculator" loading="eager" />
          </div>

          {/* For visitors who are not after a price yet: book a visit or browse. */}
          <div className="instant-quote-next">
            <h2>Prefer to talk it through?</h2>
            <p>
              Book a free on-site visit and we’ll look at the space with you, or browse everything we build first.
              You can also call us at <a href={SITE_PHONE_TEL}>{SITE_PHONE}</a> or{' '}
              <Link to="/contact-us">send us a message</Link>.
            </p>
            <div className="hero-cta-group">
              <Link to="/book-online" className="btn-pill-red" data-cta="instant-quote-book-visit">
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

      <article className="blog-article-section" id="how-it-works">
        <div className="container blog-article-container">
          <div className="blog-article-body">
            <RichBody blocks={GUIDE_BLOCKS} />
          </div>
        </div>
      </article>
    </main>
  );
}
