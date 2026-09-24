import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * The site moves between pages without a full reload, so the Meta Pixel
 * snippet in index.html only ever sees the page a visit started on. This sends
 * a PageView for every page after that.
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

  useEffect(() => {
    const page = pathname + search;
    if (page === lastReported.current) return;
    lastReported.current = page;
    if (typeof window.fbq === 'function') window.fbq('track', 'PageView');
  }, [pathname, search]);

  return null;
}
