import PageHero from '../components/PageHero.jsx';
import BookingAside from '../components/BookingAside.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import QuoteBookingForm from '../components/QuoteBookingForm.jsx';
import RichBody from '../components/RichBody.jsx';
import TrustStrip from '../components/TrustStrip.jsx';
import { SERVICE_AREA_STATEMENT, SITE_PHONE, SITE_PHONE_TEL } from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';

// What the visit is, what to have ready, where we go (SEO plan §7). Answer
// first under each question; owner-confirmed facts only.
const VISIT_BLOCKS = [
  { t: 'h2', x: 'What happens at the free on-site visit?' },
  {
    t: 'p',
    x: 'We come to your home or business, look at the space with you, take measurements and talk through what you want to change, your budget range and your timing. The visit is free and there is no obligation. Afterwards we send a free written quote with the scope, price and schedule, and nothing starts until you approve it.',
  },
  { t: 'p', x: 'During the visit we usually:' },
  { t: 'li', x: 'Walk through the space and ask how you use it today and what is not working.' },
  { t: 'li', x: 'Measure up and note what affects the price, such as where the plumbing runs and the condition of floors and walls.' },
  { t: 'li', x: 'Flag whether the work is likely to need permits and inspections, which we then coordinate for you.' },
  { t: 'li', x: 'For businesses, talk through lease dates, opening hours and whether work should happen after hours or on weekends.' },
  { t: 'h2', x: 'What should you have ready?' },
  {
    t: 'p',
    x: 'Nothing is required, but a little preparation makes the visit more useful and the quote more accurate:',
  },
  { t: 'li', x: 'Photos or screenshots of finishes and layouts you like.' },
  { t: 'li', x: 'A short list of must-haves and nice-to-haves.' },
  { t: 'li', x: 'A rough budget range, even a wide one.' },
  { t: 'li', x: 'Any drawings or plans you already have.' },
  { t: 'li', x: 'Known problems, such as leaks, past water in the basement or drafty windows.' },
  { t: 'li', x: 'Dates you are working toward, like a move-in, a family event or a lease start.' },
  {
    t: 'p',
    x: 'If you would like a price range before the visit, try our [free instant quote](/instant-quote) first.',
  },
  { t: 'h2', x: 'Where do we visit?' },
  {
    t: 'p',
    x: `${SERVICE_AREA_STATEMENT} See [the communities we serve](/service-areas). If you are a little further out, call us at [${SITE_PHONE}](${SITE_PHONE_TEL}) and we will tell you honestly whether we can help.`,
  },
];

// The form and its aside skip `.reveal` so they are visible from the first
// paint, before the JS bundle has loaded.
export default function BookingPage() {
  usePageSeo('/book-online');

  return (
    <main>
      <PageHero
        eyebrow="Book Online"
        title="PICK A TIME"
        highlight="THAT SUITS YOU"
        description="Choose a slot in our calendar and we will come to the property, look at the space with you, and give you a straight answer on what the work involves."
        primaryLink={{ to: '/our-process', label: 'SEE HOW WE WORK' }}
      />

      <section className="lead-section booking-page-section">
        <div className="container">
          <div className="lead-grid">
            {/* A descriptive heading rather than the generic "Let’s talk about your project". */}
            <div><BookingAside serviceName="project" title="What you can count on" /></div>
            <div>
              <QuoteBookingForm id="booking-form" title="Book Your Free On-Site Visit" />
            </div>
          </div>
          {/* Proof under the form: the Google rating. The aside beside the
              form already has the BBB link and the free visit and quote. */}
          <TrustStrip items={['google']} cta="book-online" />
        </div>
      </section>

      {/* No .reveal on long text: it would sit at opacity 0 until the observer runs. */}
      <article className="blog-article-section" id="about-the-visit">
        <div className="container blog-article-container">
          <div className="blog-article-body">
            <RichBody blocks={VISIT_BLOCKS} />
          </div>
        </div>
      </article>

      <CtaBanner />
    </main>
  );
}
