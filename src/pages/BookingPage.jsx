import PageHero from '../components/PageHero.jsx';
import BookingAside from '../components/BookingAside.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import QuoteBookingForm from '../components/QuoteBookingForm.jsx';
import { usePageSeo } from '../hooks/useSeo.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function BookingPage() {
  usePageSeo('/book-online');
  useScrollReveal();

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
            <div className="reveal"><BookingAside serviceName="project" /></div>
            <div className="reveal">
              <QuoteBookingForm id="booking-form" title="Book Your Free Consultation" />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
