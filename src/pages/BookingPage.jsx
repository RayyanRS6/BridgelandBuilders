import PageHero from '../components/PageHero.jsx';
import BookingAside from '../components/BookingAside.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { BookingCalendar } from '../components/LeadConnector.jsx';
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
            <div className="lead-card reveal">
              <div className="lead-card-head">
                <h3>Choose your appointment</h3>
                <p>Pick a date and time below. You will get a confirmation straight away, and a reminder before the visit.</p>
              </div>
              <BookingCalendar />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
