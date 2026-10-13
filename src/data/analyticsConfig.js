// Measurement settings, shared by the page template (vite.config.js writes the
// GA4 id into the inline loader in index.html at build time), the browser code
// (src/lib/analytics.js) and the Privacy Policy, so the policy always matches
// what the site actually loads.
//
// Plain data only: this file is imported by vite.config.js and by the browser.

/**
 * Google Analytics 4 measurement id, e.g. 'G-ABC123XYZ9'. null keeps Google
 * Analytics completely off: gtag.js is never loaded and the Privacy Policy
 * does not mention it. Set it only together with an owner-approved privacy
 * review (plan O-12), then rebuild.
 *
 * After setting it, in GA4 Admin -> Data streams -> Enhanced measurement ->
 * Page views -> Show advanced settings, turn OFF "Page changes based on
 * browser history events": the site sends its own page_view once the new
 * page's title is in place (src/components/MetaPixelPageViews.jsx), and
 * leaving that on would count every in-site page twice.
 */
export const GA4_MEASUREMENT_ID = null;

/** Only ids of this shape are written into the page (keeps the inline script safe). */
export const isGa4Id = (value) => typeof value === 'string' && /^G-[A-Z0-9]{4,16}$/.test(value);

/** The configured id, or null when unset or malformed. */
export const gaMeasurementId = () => (isGa4Id(GA4_MEASUREMENT_ID) ? GA4_MEASUREMENT_ID : null);

/**
 * Site events (src/lib/analytics.js) that are also sent to the Meta Pixel as
 * custom events. Custom events never change how existing ad campaigns
 * optimise unless someone selects them in Ads Manager. Lead and Schedule are
 * standard events sent by the quote form itself, not from this list. Keep the
 * Privacy Policy (section 7) in step with this list.
 */
export const META_CUSTOM_EVENTS = ['click_to_call', 'click_email', 'estimator_lead'];

/** Ad landing page: the pixel loads on window load there, without waiting for idle time. */
export const PIXEL_PRIORITY_PATHS = ['/free-quote'];

/** How long first/last-touch attribution is remembered in the browser. */
export const ATTRIBUTION_TTL_DAYS = 90;
