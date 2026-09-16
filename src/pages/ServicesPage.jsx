import PageHero from '../components/PageHero.jsx';
import ServiceDirectory from '../components/ServiceDirectory.jsx';
import Gallery from '../components/Gallery.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { usePageSeo } from '../hooks/useSeo.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function ServicesPage() {
  usePageSeo('/services');
  useScrollReveal();

  return (
    <main>
      <PageHero
        eyebrow="Renovation & Construction"
        title="SERVICES BUILT"
        highlight="AROUND YOUR SPACE"
        description="Explore residential, commercial, and specialty renovation services delivered by our experienced Winnipeg team."
        primaryLink={{ to: '/projects', label: 'VIEW OUR PROJECTS' }}
      />
      <ServiceDirectory />
      <Gallery />
      <CtaBanner />
    </main>
  );
}
