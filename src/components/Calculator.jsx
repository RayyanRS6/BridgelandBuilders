import { Suspense } from 'react';
import { lazyWithRetry } from '../lib/lazyRetry.js';

/**
 * Interactive calculators by id, for a post body's {"t": "calculator", "id":
 * "…"} block (BlogPostPage.jsx hands it to RichBody as a widget) and a service
 * page's `rental.calculator` (ProjectPage.jsx). Each one is its own lazy
 * chunk, so only a page that shows
 * it downloads it, and the prerender does not modulepreload it (it stays out
 * of the page's JS budget).
 *
 * The prerendered HTML holds the whole form (entry-server.jsx waits for every
 * lazy chunk). In the browser this Suspense boundary keeps that HTML in place
 * until the chunk has loaded, without holding up hydration of the rest of the
 * page; the fallback only shows after a client-side navigation.
 *
 * Keep CALCULATOR_IDS in scripts/build-blog-data.mjs in step with this list.
 */
const CALCULATORS = {
  'suite-payback': lazyWithRetry(() => import('./SuitePaybackCalculator.jsx')),
};

export default function Calculator({ id }) {
  const Component = CALCULATORS[id];
  if (!Component) return null;
  return (
    <Suspense fallback={<div className="calc-loading" aria-hidden="true" />}>
      <Component />
    </Suspense>
  );
}
