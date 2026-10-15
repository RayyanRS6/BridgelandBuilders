import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import BookingAside from '../components/BookingAside.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import QuoteBookingForm from '../components/QuoteBookingForm.jsx';
import { ArrowRightIcon } from '../components/icons.jsx';
import { CONTACT_FAQS } from '../data/faqs.js';
import { OFFICE_HOURS_TEXT, REPLY_TIME } from '../data/facts.js';
import { GBP, SITE_EMAIL, SITE_PHONE, SITE_PHONE_TEL } from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';

// Same options head.js must pass for the prerender (FAQPage from CONTACT_FAQS).
const SEO_OPTIONS = { faqs: CONTACT_FAQS };

// The owner's "Embed a map" snippet for our Google Business Profile (place
// 0x6a8200703e874ec7:0x58af89049b376f19, the same CID as GBP.mapsUrl), added
// 2026-10-15. Its region parameter was changed from the snippet's "ph" (where
// it was generated) to "ca"; everything else is as Google gave it.
const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2573.2179684738358!2d-97.08322952381421!3d49.83836183124672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6a8200703e874ec7%3A0x58af89049b376f19!2sBridgeland%20Builders!5e0!3m2!1sen!2sca!4v1792052348677!5m2!1sen!2sca';

// What happens after someone gets in touch (owner-confirmed steps).
const NEXT_STEPS = [
  {
    num: '01',
    title: `We reply within ${REPLY_TIME}`,
    text: 'We get back to you by phone, text or email, ask a few questions about the project and set up a time to see the space.',
  },
  {
    num: '02',
    title: 'Free on-site visit',
    text: 'We come to your home or business, look at the space with you, take measurements and talk through what you want, your budget and your timing.',
  },
  {
    num: '03',
    title: 'Free written quote',
    text: 'You get a written quote with the scope, price and schedule, with taxes shown. There is no obligation, and nothing starts until you approve it.',
  },
];

// The form and its aside skip `.reveal` so they are visible from the first
// paint, before the JS bundle has loaded. No street address here: the business
// is a service-area business (siteConfig.js), so the mailing address appears
// only on the legal pages.
export default function ContactPage() {
  usePageSeo('/contact-us', SEO_OPTIONS);

  return (
    <main>
      <PageHero
        eyebrow="Contact Us"
        title="LET'S TALK ABOUT"
        highlight="YOUR PROJECT"
        description={`Tell us what you want to change and we will get back to you within ${REPLY_TIME}.`}
      />
      <section className="lead-section contact-page-form">
        <div className="container">
          <div className="lead-grid">
            {/* Its own heading, so it doesn't repeat the H1 ("Let's talk about your project"). */}
            <div><BookingAside serviceName="project" title="What you can count on" showHours /></div>
            <div>
              <QuoteBookingForm id="contact-form" title="Request Your Free Quote" />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT DETAILS */}
      <section className="process-section includes-section" id="contact-details">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">Contact details</span>
            <h2 className="section-title">How to reach Bridgeland Builders</h2>
            <p className="section-desc">
              Phone, email, office hours and our Google Maps listing are below. Want to know who you’ll be dealing with first? Read{' '}
              <Link className="blog-inline-link" to="/about-us">about Bridgeland Builders</Link>.
            </p>
          </div>
          <div className="includes-grid">
            <div className="include-card">
              <div className="include-num">PHONE &amp; EMAIL</div>
              <h3>Call or email us</h3>
              <p>
                Call <a href={SITE_PHONE_TEL}><strong>{SITE_PHONE}</strong></a> or email{' '}
                <a href={`mailto:${SITE_EMAIL}`} className="wrap-anywhere"><strong>{SITE_EMAIL}</strong></a>. We reply within {REPLY_TIME}.
              </p>
            </div>
            <div className="include-card">
              <div className="include-num">OFFICE HOURS</div>
              <h3>When we are in the office</h3>
              <p>
                {OFFICE_HOURS_TEXT}
                {OFFICE_HOURS_TEXT.endsWith('.') ? '' : '.'} Commercial renovation work can be scheduled after hours
                or on weekends.
              </p>
            </div>
            <div className="include-card">
              <div className="include-num">WE COME TO YOU</div>
              <h3>Winnipeg and nearby communities</h3>
              <p>
                We come to your home or business for the free on-site visit, in Winnipeg and nearby communities
                within about an hour of the city.
              </p>
              <Link className="blog-card-link" to="/service-areas">
                SEE OUR SERVICE AREA <ArrowRightIcon size={13} />
              </Link>
            </div>
          </div>

          {/* Our Google Business Profile on Google Maps (the owner's embed for
              the listing). Responsive instead of the snippet's fixed 600x450,
              lazy so it only loads near the viewport, and titled for screen
              readers. A plain link too: a map inside a page is awkward to pan
              on a phone. Google receives the visitor's IP address when it
              loads (privacy policy, section 8). */}
          <div className="contact-map">
            <iframe
              src={MAP_EMBED_URL}
              title="Bridgeland Builders on Google Maps"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="contact-map-link">
            <a className="blog-card-link" href={GBP.mapsUrl} target="_blank" rel="noopener noreferrer">
              OPEN IN GOOGLE MAPS <ArrowRightIcon size={13} />
            </a>
          </p>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="process-section includes-section" id="what-happens-next">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">What happens next</span>
            <h2 className="section-title">What happens after you contact us?</h2>
            <p className="section-desc">
              We reply within {REPLY_TIME} and set up a free on-site visit. At the visit we look at the space and
              talk through what you want. Then you get a free written quote with the scope, price and schedule, and
              nothing starts until you approve it.
            </p>
          </div>
          <div className="includes-grid">
            {NEXT_STEPS.map((step) => (
              <div className="include-card" key={step.num}>
                <div className="include-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs: no .reveal, so the answers are never held at opacity 0. */}
      <section className="faq-section" id="faqs">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">Questions</span>
            <h2 className="section-title">Questions about getting in touch</h2>
          </div>
          <FaqAccordion items={CONTACT_FAQS} headingLevel={3} />
        </div>
      </section>
    </main>
  );
}
