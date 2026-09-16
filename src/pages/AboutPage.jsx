import PageHero from '../components/PageHero.jsx';
import Stats from '../components/Stats.jsx';
import WhyUs from '../components/WhyUs.jsx';
import Testimonial from '../components/Testimonial.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { usePageSeo } from '../hooks/useSeo.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function AboutPage() {
  usePageSeo('/about-us');
  useScrollReveal();

  return (
    <main>
      <PageHero
        eyebrow="About Bridgeland Builders"
        title="LOCAL EXPERIENCE."
        highlight="HONEST WORK."
        description="Meet the Winnipeg renovation team that brings more than 60 years of combined experience to every home and business project."
        primaryLink={{ to: '/our-process', label: 'SEE HOW WE WORK' }}
      />
      <Stats />
      <WhyUs />
      <Testimonial />
      <CtaBanner />
    </main>
  );
}
