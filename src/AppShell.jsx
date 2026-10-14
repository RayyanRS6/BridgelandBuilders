import { Suspense, useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ScrollToHash from './components/ScrollToHash.jsx';
import MetaPixelPageViews from './components/MetaPixelPageViews.jsx';
import TopBar from './components/TopBar.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import RouteErrorBoundary from './components/RouteErrorBoundary.jsx';
// React.lazy with retries; a chunk that still fails keeps the prerendered HTML
// on the first page instead of replacing it (src/lib/lazyRetry.js).
import { lazyWithRetry as lazy, leftInitialPage } from './lib/lazyRetry.js';
import { useGlobalScrollReveal } from './hooks/useScrollReveal.js';
import { preloadHeadWriter } from './hooks/useSeo.js';
import { COST_HUB_PATH } from './data/siteConfig.js';
import { liveServices } from './data/services.js';

const HomePage = lazy(() => import('./pages/Home.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ProcessPage = lazy(() => import('./pages/ProcessPage.jsx'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const FaqsPage = lazy(() => import('./pages/FaqsPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const BookingPage = lazy(() => import('./pages/BookingPage.jsx'));
const FreeQuotePage = lazy(() => import('./pages/FreeQuotePage.jsx'));
const InstantQuotePage = lazy(() => import('./pages/InstantQuotePage.jsx'));
const GetInTouchPage = lazy(() => import('./pages/GetInTouchPage.jsx'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.jsx'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage.jsx'));
const ServiceAreasPage = lazy(() => import('./pages/ServiceAreasPage.jsx'));
const EditorialPolicyPage = lazy(() => import('./pages/EditorialPolicyPage.jsx'));
// Template pages: each reads its own data by path and renders the 404 page for
// anything that is not published (see head.js for the prerendered routes).
const ServiceRoute = lazy(() => import('./pages/services/ServiceRoute.jsx'));
const CostGuidePage = lazy(() => import('./pages/CostGuidePage.jsx'));
const AreaPage = lazy(() => import('./pages/AreaPage.jsx'));
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage.jsx'));
const VideoPage = lazy(() => import('./pages/VideoPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// One route per live service page (src/data/services.js); draft pages are not
// routed, so their URLs fall through to the 404 page.
const SERVICE_ROUTES = liveServices();

/**
 * The whole application below the router. The client wraps this in
 * BrowserRouter; the build-time prerenderer wraps it in StaticRouter.
 *
 * Every "Get Free Instant Quote" button on the site links to /instant-quote,
 * which embeds the EstimatorX360 estimator. On-site visits are booked through
 * the site's own form and calendar (src/components/QuoteBookingForm.jsx) on
 * /free-quote, /book-online and the service pages.
 */
export default function AppShell() {
  // One scroll-reveal observer for every page (see src/hooks/useScrollReveal.js).
  useGlobalScrollReveal();

  // Once the visitor navigates in the browser there is no server HTML left to
  // keep, so later chunk failures reload instead (src/lib/lazyRetry.js).
  const { pathname } = useLocation();
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (pathname !== firstPath.current) leftInitialPage();
  }, [pathname]);
  // The page being navigated to will need its <head> written, and the code
  // for that is not part of the first load (src/hooks/useSeo.js). Asked for
  // while the navigation renders, it downloads alongside the page's own chunk.
  if (pathname !== firstPath.current) preloadHeadWriter();

  return (
    <>
      <ScrollToHash />
      <MetaPixelPageViews />

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <TopBar />

      {/* 2. CLEAN FLOATING NAVBAR */}
      <Navbar />

      <RouteErrorBoundary resetKey={pathname}>
      <Suspense fallback={<main className="route-loading" aria-live="polite">Loading page...</main>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/our-process" element={<ProcessPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/book-online" element={<BookingPage />} />
          <Route path="/service-areas" element={<ServiceAreasPage />} />
          <Route path="/service-areas/:slug" element={<AreaPage />} />
          <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
          {/* Ad landing page — not linked from the site, see PAGE_SEO['/free-quote']. */}
          <Route path="/free-quote" element={<FreeQuotePage />} />
          {/* The estimator page every instant quote button leads to. */}
          <Route path="/instant-quote" element={<InstantQuotePage />} />
          {/* Contact form with the SMS opt-in, see SMS_OPT_IN_PATH in siteConfig.js. */}
          <Route path="/contact" element={<GetInTouchPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />

          {SERVICE_ROUTES.map((service) => (
            <Route key={service.path} path={service.path} element={<ServiceRoute path={service.path} />} />
          ))}

          {/* Cost guides: the hub and /services/<service>/cost (live guides only). */}
          <Route path={COST_HUB_PATH} element={<CostGuidePage />} />
          <Route path="/services/:svc/cost" element={<CostGuidePage />} />
          {/* Case studies (/projects/<area>-<service>-<yyyy>) and video watch
              pages: published entries only. The /projects/<service> links
              below are static routes, which always win over /projects/:slug. */}
          <Route path="/projects/:slug" element={<CaseStudyPage />} />
          <Route path="/videos/:slug" element={<VideoPage />} />

          {/* Keep old links and bookmarks working after the slug cleanup. The
              server answers these with permanent redirects (src/data/redirects.js
              -> vercel.json); these are the client-side fallback. */}
          <Route path="/projects/whole-home-renovation" element={<Navigate to="/services/whole-home-renovations" replace />} />
          <Route path="/projects/bathroom-renovation" element={<Navigate to="/services/bathroom-renovations" replace />} />
          <Route path="/projects/kitchen-renovation" element={<Navigate to="/services/kitchen-renovations" replace />} />
          <Route path="/projects/basement-renovation" element={<Navigate to="/services/basement-renovations" replace />} />
          <Route path="/projects/home-extension" element={<Navigate to="/services/home-additions" replace />} />
          <Route path="/projects/commercial-renovation" element={<Navigate to="/services/commercial-renovations" replace />} />
          <Route path="/services/home-extensions" element={<Navigate to="/services/home-additions" replace />} />
          <Route path="/outside-winnipeg" element={<Navigate to="/service-areas" replace />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      </RouteErrorBoundary>

      {/* 12. SITEMAP FOOTER */}
      <Footer />
    </>
  );
}
