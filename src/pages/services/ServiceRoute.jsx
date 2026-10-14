import { lazy } from 'react';
import ProjectPage from '../ProjectPage.jsx';
import { serviceSeo } from '../../data/seo.js';
import { serviceByPath } from '../../data/services.js';
import { usePageSeo } from '../../hooks/useSeo.js';
import { keepServerHtml, lazyWithRetry, onInitialPage, retryLoad } from '../../lib/lazyRetry.js';

// Never rendered for a routed (live) service, so it is not modulepreloaded
// with every service page.
const NotFoundPage = lazyWithRetry(() => import('../NotFoundPage.jsx'));

/**
 * Every service page (one route per live entry in src/data/services.js, see
 * AppShell.jsx). The page's content module (src/data/services/<slug>.js) is
 * its own chunk, so a visitor only downloads the page they open; the build
 * reads all of them through src/data/projects.js instead.
 *
 * The prerender waits for these lazy chunks (entry-server.jsx renders on
 * onAllReady), so the static HTML has the full page, and hydration keeps that
 * HTML until the same chunk has loaded in the browser.
 */
const CONTENT_MODULES = import.meta.glob('../../data/services/*.js');

// Related guides (content.guides = blog slugs): one small generated card
// module per published post (src/data/postCards/<slug>.js), so a page loads
// just its own guides' cards (scripts/prerender.mjs modulepreloads them). A
// slug with no card module is not a published post and is left out.
// Never import blogPosts.js here: it is build-only and carries every body.
const CARD_MODULES = import.meta.glob('../../data/postCards/*.js');

async function loadGuidePosts(slugs) {
  if (!Array.isArray(slugs) || !slugs.length) return [];
  const loads = slugs.map((slug) => CARD_MODULES[`../../data/postCards/${slug}.js`]).filter(Boolean);
  return (await Promise.all(loads.map((load) => load()))).map((mod) => mod.default);
}

function ServicePage({ service, content, guidePosts }) {
  // Same options head.js uses for the prerender (seo.js serviceSeo).
  usePageSeo(service.path, serviceSeo(content));
  return (
    <main>
      <ProjectPage project={content} service={service} guidePosts={guidePosts} />
    </main>
  );
}

// One lazy component per service, created once and reused, so a page keeps
// its identity across renders and navigations.
const PAGES = new Map();

function lazyServicePage(service) {
  if (!PAGES.has(service.slug)) {
    PAGES.set(
      service.slug,
      lazy(() =>
        retryLoad(async () => {
          const load = CONTENT_MODULES[`../../data/services/${service.slug}.js`];
          if (!load) throw new Error(`No content module for ${service.path}`);
          const content = (await load()).default;
          const guidePosts = await loadGuidePosts(content.guides);
          return {
            default: function ServicePageContent() {
              return <ServicePage service={service} content={content} guidePosts={guidePosts} />;
            },
          };
        }).catch((error) => {
          // On the prerendered first page the server HTML stays in place
          // (lib/lazyRetry.js); otherwise RouteErrorBoundary takes over and the
          // next visit to this page tries again.
          if (!onInitialPage()) PAGES.delete(service.slug);
          return keepServerHtml(error);
        })
      )
    );
  }
  return PAGES.get(service.slug);
}

export default function ServiceRoute({ path }) {
  const service = serviceByPath(path);
  // AppShell only routes live services; anything else is a 404.
  if (!service || service.status !== 'live') return <NotFoundPage />;
  const Page = lazyServicePage(service);
  return <Page />;
}
