// Site analytics events (SEO plan §18). One call, track(name, params), sends
// the event to Google Analytics 4 and, for the events listed in
// META_CUSTOM_EVENTS, to the Meta Pixel as a custom event.
//
// Safe everywhere: on the server, on localhost, under Do Not Track, before or
// without either tag, it does nothing. The inline loader in index.html decides
// whether tags may run and records it in window.__bbMeasure:
//   { allowed: boolean, ga: 'G-…' | null }
// gtag() always exists (Consent Mode needs it before gtag.js loads), so "is GA
// on" is read from __bbMeasure.ga, never from typeof gtag.
//
// Elements can carry data-cta="<id>" to be reported as cta_click (see
// src/components/AnalyticsListeners.jsx).
import { META_CUSTOM_EVENTS } from '../data/analyticsConfig.js';

const isBrowser = () => typeof window !== 'undefined';

function measure() {
  return (isBrowser() && window.__bbMeasure) || {};
}

/** True when the visitor may be measured (not localhost, no Do Not Track). */
export function trackingAllowed() {
  return Boolean(measure().allowed);
}

/** True when GA4 is configured and allowed on this page view. */
export function gaEnabled() {
  return Boolean(measure().ga) && isBrowser() && typeof window.gtag === 'function';
}

/** True when the Meta Pixel snippet ran (it only runs when tracking is allowed). */
export function pixelEnabled() {
  return isBrowser() && typeof window.fbq === 'function';
}

function debugOn() {
  try {
    return isBrowser() && window.localStorage.getItem('bb:analytics-debug') === '1';
  } catch {
    return false;
  }
}

/** Drops undefined/empty values and keeps GA's 100-character parameter limit. */
function cleanParams(params) {
  const out = {};
  for (const [key, value] of Object.entries(params || {})) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) out[key] = value.join(', ').slice(0, 100);
    else if (typeof value === 'string') out[key] = value.slice(0, 100);
    else out[key] = value;
  }
  return out;
}

/**
 * Sends one event. Never throws.
 * @param {string} name   GA4 event name, e.g. 'generate_lead'
 * @param {object} params event parameters (strings are cut to 100 characters)
 */
export function track(name, params = {}) {
  if (!isBrowser() || !name) return;
  const data = cleanParams(params);
  try {
    if (debugOn()) console.debug('[analytics]', name, data); // eslint-disable-line no-console
    if (gaEnabled()) window.gtag('event', name, data);
    if (pixelEnabled() && META_CUSTOM_EVENTS.includes(name)) window.fbq('trackCustom', name, data);
  } catch {
    /* measurement must never break the page */
  }
}

/** GA4 page_view for an in-site navigation (the landing page is sent by index.html). */
export function trackPageView({ location: href, title, referrer } = {}) {
  if (!gaEnabled()) return;
  try {
    window.gtag('event', 'page_view', cleanParams({
      page_location: href || window.location.href,
      page_title: title || document.title,
      page_referrer: referrer,
    }));
  } catch {
    /* ignore */
  }
}

/**
 * A fresh id shared by a browser Pixel event and its server (Conversions API)
 * copy, so Meta counts the pair once. Only issued when the Pixel is running:
 * no id means the server sends nothing either (Do Not Track, localhost).
 */
export function newEventId() {
  if (!pixelEnabled()) return undefined;
  try {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Meta Pixel standard event (Lead, Schedule). With an eventID the browser and
 * server copies are de-duplicated. Without a pixel this does nothing.
 */
export function trackMetaStandard(event, eventId) {
  if (!pixelEnabled()) return;
  try {
    if (eventId) window.fbq('track', event, {}, { eventID: eventId });
    else window.fbq('track', event);
  } catch {
    /* ignore */
  }
}
