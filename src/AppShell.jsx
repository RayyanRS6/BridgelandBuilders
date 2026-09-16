import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { QuoteModalContext } from './context/QuoteModalContext.jsx';
import ScrollToHash from './components/ScrollToHash.jsx';
import TopBar from './components/TopBar.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import QuoteModal from './components/QuoteModal.jsx';

const HomePage = lazy(() => import('./pages/Home.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ProcessPage = lazy(() => import('./pages/ProcessPage.jsx'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const FaqsPage = lazy(() => import('./pages/FaqsPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const OutsideWinnipegPage = lazy(() => import('./pages/OutsideWinnipegPage.jsx'));
const WholeHomeRenovationsPage = lazy(() => import('./pages/services/WholeHomeRenovationsPage.jsx'));
const BathroomRenovationsPage = lazy(() => import('./pages/services/BathroomRenovationsPage.jsx'));
const KitchenRenovationsPage = lazy(() => import('./pages/services/KitchenRenovationsPage.jsx'));
const BasementRenovationsPage = lazy(() => import('./pages/services/BasementRenovationsPage.jsx'));
const HomeExtensionsPage = lazy(() => import('./pages/services/HomeExtensionsPage.jsx'));
const CommercialRenovationsPage = lazy(() => import('./pages/services/CommercialRenovationsPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

/**
 * The whole application below the router. The client wraps this in
 * BrowserRouter; the build-time prerenderer wraps it in StaticRouter.
 */
export default function AppShell() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  // 2. Modal Interactivity
  const openModal = useCallback(() => {
    setIsQuoteOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsQuoteOpen(false);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isQuoteOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isQuoteOpen, closeModal]);

  const modalApi = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  return (
    <QuoteModalContext.Provider value={modalApi}>
      <ScrollToHash />

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <TopBar />

      {/* 2. CLEAN FLOATING NAVBAR */}
      <Navbar />

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
          <Route path="/outside-winnipeg" element={<OutsideWinnipegPage />} />

          <Route path="/services/whole-home-renovations" element={<WholeHomeRenovationsPage />} />
          <Route path="/services/bathroom-renovations" element={<BathroomRenovationsPage />} />
          <Route path="/services/kitchen-renovations" element={<KitchenRenovationsPage />} />
          <Route path="/services/basement-renovations" element={<BasementRenovationsPage />} />
          <Route path="/services/home-extensions" element={<HomeExtensionsPage />} />
          <Route path="/services/commercial-renovations" element={<CommercialRenovationsPage />} />

          {/* Keep old links and bookmarks working after the slug cleanup. */}
          <Route path="/projects/whole-home-renovation" element={<Navigate to="/services/whole-home-renovations" replace />} />
          <Route path="/projects/bathroom-renovation" element={<Navigate to="/services/bathroom-renovations" replace />} />
          <Route path="/projects/kitchen-renovation" element={<Navigate to="/services/kitchen-renovations" replace />} />
          <Route path="/projects/basement-renovation" element={<Navigate to="/services/basement-renovations" replace />} />
          <Route path="/projects/home-extension" element={<Navigate to="/services/home-extensions" replace />} />
          <Route path="/projects/commercial-renovation" element={<Navigate to="/services/commercial-renovations" replace />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {/* 12. SITEMAP FOOTER */}
      <Footer />

      {/* 13. INSTANT QUOTE MODAL */}
      <QuoteModal isOpen={isQuoteOpen} closeModal={closeModal} />
    </QuoteModalContext.Provider>
  );
}
