import ProjectPage from '../ProjectPage.jsx';
import { getProject } from '../../data/projects.js';
import { usePageSeo } from '../../hooks/useSeo.js';

const PATH = '/services/commercial-renovations';
const project = getProject('commercial-renovation');

export default function CommercialRenovationsPage() {
  usePageSeo(PATH, {
    faqs: project.faqs,
    image: project.intro && project.intro.image,
  });

  return <main><ProjectPage project={project} /></main>;
}
