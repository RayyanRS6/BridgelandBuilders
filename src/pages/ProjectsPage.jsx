import PageHero from '../components/PageHero.jsx';
import Gallery from '../components/Gallery.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { usePageSeo } from '../hooks/useSeo.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

export default function ProjectsPage() {
  usePageSeo('/projects');
  useScrollReveal();

  return (
    <main>
      <PageHero
        eyebrow="Our Portfolio"
        title="SPACES TRANSFORMED"
        highlight="ACROSS WINNIPEG"
        description="Browse our renovation work, then open any project category for its own details, gallery, process, and booking page."
        primaryLink={{ to: '/services', label: 'EXPLORE SERVICES' }}
      />
      <Gallery />
      <CtaBanner />
    </main>
  );
}
