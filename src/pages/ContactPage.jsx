import PageHero from '../components/PageHero.jsx';
import BookingAside from '../components/BookingAside.jsx';
import QuoteBookingForm from '../components/QuoteBookingForm.jsx';
import { usePageSeo } from '../hooks/useSeo.js';

// The form and its aside skip `.reveal` so they are visible from the first
// paint, before the JS bundle has loaded.
export default function ContactPage() {
  usePageSeo('/contact-us');

  return (
    <main>
      <PageHero
        eyebrow="Contact Us"
        title="LET'S TALK ABOUT"
        highlight="YOUR PROJECT"
        description="Tell us what you want to change and we will get back to you within one business day."
      />
      <section className="lead-section contact-page-form">
        <div className="container">
          <div className="lead-grid">
            <div><BookingAside serviceName="project" showHours /></div>
            <div>
              <QuoteBookingForm id="contact-form" title="Request Your Free Quote" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
