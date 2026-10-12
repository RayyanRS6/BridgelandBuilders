import PageHero from '../components/PageHero.jsx';
import Gallery from '../components/Gallery.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { usePageSeo } from '../hooks/useSeo.js';

export default function ProjectsPage() {
  usePageSeo('/projects');

  return (
    <main>
      <PageHero
        eyebrow="Inspiration"
        title="RENOVATION PROJECTS"
        highlight="& DESIGN IDEAS"
        description="Browse design ideas for each type of project, then open any service for its details, process, and booking page. These are inspiration photos for now; case studies of our own projects are coming."
        primaryLink={{ to: '/services', label: 'EXPLORE SERVICES' }}
      />
      <Gallery />
      <CtaBanner />
    </main>
  );
}
