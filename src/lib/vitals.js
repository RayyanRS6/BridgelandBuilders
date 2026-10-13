// Real-user Core Web Vitals (SEO plan §4 "Monitoring"). Loaded by
// src/main.jsx after the page has finished loading, in production builds only.
// Sends LCP, INP, CLS, FCP and TTFB to Google Analytics 4 with the element
// responsible (web-vitals "attribution" build), so slow templates can be
// found in GA4 Explorations (event name = metric, parameter debug_target).
//
// Does nothing — and does not even download web-vitals — when GA4 is not
// configured, on localhost, or when the browser sends Do Not Track (the
// inline loader in index.html decides; see src/lib/analytics.js).
import { gaEnabled } from './analytics.js';

let started = false;

const selector = (el) => {
  if (!el) return undefined;
  if (typeof el === 'string') return el.slice(0, 100);
  return undefined;
};

function debugTarget(metric) {
  const a = metric.attribution || {};
  switch (metric.name) {
    case 'LCP':
      return selector(a.target || a.element) || selector(a.url);
    case 'INP':
      return selector(a.interactionTarget);
    case 'CLS':
      return selector(a.largestShiftTarget);
    default:
      return undefined;
  }
}

function send(metric) {
  try {
    if (!gaEnabled()) return;
    window.gtag('event', metric.name, {
      // GA sums integers best; CLS is reported x1000.
      value: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
      metric_navigation_type: metric.navigationType,
      debug_target: debugTarget(metric),
      page_path: window.location.pathname,
      non_interaction: true,
    });
  } catch {
    /* never affect the page */
  }
}

/** Starts reporting. Call once, after window load. */
export async function startVitals() {
  if (started || typeof window === 'undefined' || !gaEnabled()) return;
  started = true;
  try {
    const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals/attribution');
    onCLS(send);
    onINP(send);
    onLCP(send);
    onFCP(send);
    onTTFB(send);
  } catch {
    /* web-vitals failed to load: nothing to report */
  }
}
