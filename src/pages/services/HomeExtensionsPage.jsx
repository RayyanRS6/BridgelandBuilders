import ProjectPage from '../ProjectPage.jsx';
import { getProject } from '../../data/projects.js';
import { usePageSeo } from '../../hooks/useSeo.js';

const PATH = '/services/home-extensions';
const project = getProject('home-extension');

export default function HomeExtensionsPage() {
  usePageSeo(PATH, {
    faqs: project.faqs,
    image: project.intro && project.intro.image,
  });

  return <main><ProjectPage project={project} /></main>;
}
