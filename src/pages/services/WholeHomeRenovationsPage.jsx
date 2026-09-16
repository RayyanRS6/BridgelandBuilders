import ProjectPage from '../ProjectPage.jsx';
import { getProject } from '../../data/projects.js';
import { usePageSeo } from '../../hooks/useSeo.js';

const PATH = '/services/whole-home-renovations';
const project = getProject('whole-home-renovation');

export default function WholeHomeRenovationsPage() {
  usePageSeo(PATH, {
    faqs: project.faqs,
    image: project.intro && project.intro.image,
  });

  return <main><ProjectPage project={project} /></main>;
}
