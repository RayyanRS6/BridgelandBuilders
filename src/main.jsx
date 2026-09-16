import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './pages.css';

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
