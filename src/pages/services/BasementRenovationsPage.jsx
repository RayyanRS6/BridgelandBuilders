import ProjectPage from '../ProjectPage.jsx';
import { getProject } from '../../data/projects.js';
import { usePageSeo } from '../../hooks/useSeo.js';

const PATH = '/services/basement-renovations';
const project = getProject('basement-renovation');

export default function BasementRenovationsPage() {
  usePageSeo(PATH, {
    faqs: project.faqs,
    image: project.intro && project.intro.image,
  });

  return <main><ProjectPage project={project} /></main>;
}
