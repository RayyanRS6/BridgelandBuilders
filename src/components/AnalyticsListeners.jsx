import { useEffect } from 'react';
import { track } from '../lib/analytics.js';

/**
 * Site-wide interaction events (SEO plan §18), as delegated listeners on the
 * document, so no page or component needs wiring:
 *
 *   click_to_call  any tel: link             { link_location, link_url, link_text }
 *   click_email    any mailto: link          { link_location, link_text }
 *   cta_click      any element with data-cta { cta_id, link_location, link_url, link_text }
 *   form_start     first field focused in a <form> on this page { form_id, form_page }
 *
 * link_location is the nearest data-location attribute, else a named area
 * (top_bar, hero, quote_form), else the landmark the link sits in (header,
 * nav, main, footer, aside). Lead, booking and estimator
 * events are sent by the components that know about them
 * (QuoteBookingForm, EstimatorEmbed).
 *
 * installAnalyticsListeners() is called once from src/main.jsx; rendering
 * <AnalyticsListeners /> anywhere does the same and is harmless if both happen.
 */

let installed = false;
const startedForms = new WeakSet();

// Site chrome that isn't a landmark element.
const NAMED_AREAS = [
  ['.top-bar', 'top_bar'],
  ['.hero-section, .page-hero', 'hero'],
  ['.booking-card, .qf', 'quote_form'],
];

function linkLocation(el) {
  const tagged = el.closest('[data-location]');
  if (tagged) return tagged.getAttribute('data-location');
  for (const [selector, name] of NAMED_AREAS) if (el.closest(selector)) return name;
  const landmark = el.closest('header, nav, footer, aside, main, [role="banner"], [role="contentinfo"]');
  if (!landmark) return 'page';
  const role = landmark.getAttribute('role');
  if (role === 'banner') return 'header';
  if (role === 'contentinfo') return 'footer';
  return landmark.tagName.toLowerCase();
}

const textOf = (el) => (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100);

/** Internal links as a path; external ones as origin + path (never a query string). */
function urlOf(href) {
  try {
    const url = new URL(href, window.location.href);
    if (url.protocol === 'tel:' || url.protocol === 'mailto:') return undefined;
    return url.origin === window.location.origin ? url.pathname + url.hash : url.origin + url.pathname;
  } catch {
    return undefined;
  }
}

function onClick(event) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const link = target.closest('a[href]');
  const href = link ? link.getAttribute('href') || '' : '';
  if (link && /^tel:/i.test(href)) {
    track('click_to_call', { link_location: linkLocation(link), link_url: window.location.pathname, link_text: textOf(link) });
  } else if (link && /^mailto:/i.test(href)) {
    track('click_email', { link_location: linkLocation(link), link_text: textOf(link) });
  }

  const cta = target.closest('[data-cta]');
  if (cta) {
    const ctaHref = cta.getAttribute('href') || (cta.closest('a[href]') || {}).href || '';
    track('cta_click', {
      cta_id: cta.getAttribute('data-cta'),
      link_location: linkLocation(cta),
      link_url: ctaHref ? urlOf(ctaHref) : undefined,
      link_text: textOf(cta),
    });
  }
}

function onFocusIn(event) {
  const field = event.target instanceof Element ? event.target : null;
  if (!field || !field.matches('input, select, textarea') || field.type === 'hidden') return;
  const form = field.closest('form');
  if (!form || startedForms.has(form)) return;
  startedForms.add(form);
  track('form_start', {
    form_id: form.getAttribute('data-form-id') || form.id || form.getAttribute('name') || 'form',
    form_page: window.location.pathname,
  });
}

/** Adds the document listeners once. Safe to call more than once; no-op on the server. */
export function installAnalyticsListeners() {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  document.addEventListener('click', onClick, { capture: true, passive: true });
  document.addEventListener('focusin', onFocusIn, { passive: true });
}

export default function AnalyticsListeners() {
  useEffect(() => {
    installAnalyticsListeners();
  }, []);
  return null;
}
