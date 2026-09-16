import PageHero from '../components/PageHero.jsx';
import Process from '../components/Process.jsx';
import Testimonial from '../components/Testimonial.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { usePageSeo } from '../hooks/useSeo.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function ProcessPage() {
  usePageSeo('/our-process');
  useScrollReveal();

  return (
    <main>
      <PageHero
        eyebrow="How We Work"
        title="A CLEAR PLAN"
        highlight="FROM DAY ONE"
        description="From the first conversation to the final walkthrough, you get straightforward communication, quality materials, and a team that follows through."
        primaryLink={{ to: '/contact-us', label: 'START A CONVERSATION' }}
      />
      <Process />
      <Testimonial />
      <CtaBanner />
    </main>
  );
}
