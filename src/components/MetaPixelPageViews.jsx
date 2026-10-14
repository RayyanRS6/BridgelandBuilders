import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gaEnabled, pixelEnabled, trackPageView } from '../lib/analytics.js';

// How long to wait for the new page to set its <title> before sending the
// GA4 page_view anyway (a lazily loaded page sets it once its code arrives).
const TITLE_WAIT_MS = 1500;

/**
 * The site moves between pages without a full reload, so the Meta Pixel
 * snippet in index.html only ever sees the page a visit started on. This sends
 * a PageView for every page after that, and — when Google Analytics is on
 * (src/data/analyticsConfig.js) — a GA4 page_view once the new page's title is
 * in place, so reports show real page titles.
 *
 * It is the only source of those PageViews: index.html turns off the pixel's
 * own history tracking (fbq.disablePushState) and lets these repeat PageViews
 * through (fbq.allowDuplicatePageViews).
 *
 * It remembers the last page it reported, starting with the one the snippet
 * already counted, so the landing page is never counted twice, and hash-only
 * changes (jumping to the form) aren't counted as new pages.
 */
export default function MetaPixelPageViews() {
  const { pathname, search } = useLocation();
  const lastReported = useRef(
    typeof window === 'undefined' ? null : window.location.pathname + window.location.search
  );
  const lastUrl = useRef(typeof window === 'undefined' ? null : window.location.href);

  useEffect(() => {
    const page = pathname + search;
    if (page === lastReported.current) return undefined;
    lastReported.current = page;
    if (pixelEnabled()) {
      try {
        window.fbq('track', 'PageView');
      } catch {
        /* measurement must never break navigation */
      }
    }

    const referrer = lastUrl.current;
    const href = window.location.href;
    lastUrl.current = href;
    if (!gaEnabled()) return undefined;

    // Effects of the new page run after this one (or later still, if its code
    // is still loading), so wait for the title to change.
    const startTitle = document.title;
    let sent = false;
    let observer = null;
    let timer = null;
    const send = () => {
      if (sent) return;
      sent = true;
      if (observer) observer.disconnect();
      window.clearTimeout(timer);
      trackPageView({ location: href, title: document.title, referrer });
    };
    const check = () => {
      if (document.title !== startTitle) send();
    };
    timer = window.setTimeout(send, TITLE_WAIT_MS);
    window.setTimeout(check, 0);
    if (typeof MutationObserver === 'function') {
      observer = new MutationObserver(check);
      observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    }
    // A quick second navigation: report this page now rather than drop it.
    return () => {
      if (!sent) send();
    };
  }, [pathname, search]);

  return null;
}
