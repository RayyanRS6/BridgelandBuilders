import PageHero from '../components/PageHero.jsx';
import BookingAside from '../components/BookingAside.jsx';
import { LeadFormEmbed } from '../components/LeadConnector.jsx';
import { usePageSeo } from '../hooks/useSeo.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function ContactPage() {
  usePageSeo('/contact-us');
  useScrollReveal();

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
            <div className="reveal"><BookingAside serviceName="project" /></div>
            <div className="lead-card reveal">
              <div className="lead-card-head">
                <h3>Request Your Free Quote</h3>
                <p>Share the project details below. There is no obligation and no pushy follow-up.</p>
              </div>
              <LeadFormEmbed instanceId="contact-page-lead-form" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
