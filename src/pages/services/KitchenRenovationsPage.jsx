import ProjectPage from '../ProjectPage.jsx';
import { getProject } from '../../data/projects.js';
import { usePageSeo } from '../../hooks/useSeo.js';

const PATH = '/services/kitchen-renovations';
const project = getProject('kitchen-renovation');

export default function KitchenRenovationsPage() {
  usePageSeo(PATH, {
    faqs: project.faqs,
    image: project.intro && project.intro.image,
  });

  return <main><ProjectPage project={project} /></main>;
}
