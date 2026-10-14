import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { installAnalyticsListeners } from './components/AnalyticsListeners.jsx';
import { gaEnabled } from './lib/analytics.js';
import { captureAttribution } from './lib/attribution.js';
import './index.css';
import './pages.css';
// Template pages (cost guides, service areas, case studies, videos, editorial
// policy). Global rather than per page, so prerendered pages never paint
// before these few rules arrive with a lazy chunk.
import './styles/templates.css';

// How this visit arrived (campaign tags, referrer, landing page), recorded
// before anything else can change the URL. Never throws.
captureAttribution();

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Pages are prerendered to static HTML at build time, so hydrate when markup is
// already there and fall back to a fresh render when it is not.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);

// Calls, emails, data-cta clicks and form starts (src/lib/analytics.js).
installAnalyticsListeners();

// Real-user Core Web Vitals, production only, after the page has loaded, and
// only when Google Analytics is on for this visit (index.html decides; see
// src/lib/analytics.js). With GA off the chunk is never even downloaded.
if (import.meta.env.PROD && gaEnabled()) {
  const startVitals = () => import('./lib/vitals.js').then((m) => m.startVitals()).catch(() => {});
  if (document.readyState === 'complete') startVitals();
  else window.addEventListener('load', startVitals, { once: true });
}
