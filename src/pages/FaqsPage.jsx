import PageHero from '../components/PageHero.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { SITE_FAQS } from '../data/faqs.js';
import { usePageSeo } from '../hooks/useSeo.js';
import useScrollReveal from '../hooks/useScrollReveal.js';


export default function FaqsPage() {
  usePageSeo('/faqs', { faqs: SITE_FAQS });
  useScrollReveal();

  return (
    <main>
      <PageHero
        eyebrow="Helpful Answers"
        title="FREQUENTLY ASKED"
        highlight="QUESTIONS"
        description="Straight answers about quotes, timelines, permits, and what it is like to renovate with Bridgeland Builders."
        primaryLink={{ to: '/contact-us', label: 'ASK US DIRECTLY' }}
      />
      <section className="faq-section">
        <div className="container faq-page-container">
          <div className="reveal"><FaqAccordion items={SITE_FAQS} /></div>
        </div>
      </section>
      <CtaBanner />
    </main>
  );
}
