import PageHero from '../components/PageHero.jsx';
import BookingAside from '../components/BookingAside.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import QuoteBookingForm from '../components/QuoteBookingForm.jsx';
import { usePageSeo } from '../hooks/useSeo.js';

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
            <div><BookingAside serviceName="project" /></div>
            <div>
              <QuoteBookingForm id="booking-form" title="Book Your Free Consultation" />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
