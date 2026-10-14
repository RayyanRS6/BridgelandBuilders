import { useEffect, useRef } from 'react';
import { track } from '../lib/analytics.js';

const MIN_HEIGHT = 500;
const MAX_HEIGHT = 5000;

/** Which estimator this is ("kitchen-renovations", "commercial", "overall"), for analytics. */
function estimatorName(src) {
  try {
    const params = new URL(src).searchParams;
    return params.get('service') || params.get('category') || 'overall';
  } catch {
    return 'overall';
  }
}

/**
 * `loading`: "lazy" (default) where the estimator sits further down a page;
 * "eager" where it is the page's main content (/instant-quote).
 */
export default function EstimatorEmbed({ src, title = 'Renovation Price Calculator', loading = 'lazy' }) {
  const frameRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const frameOrigin = new URL(src).origin;
    const estimator = estimatorName(src);
    const page = window.location.pathname;

    const handleMessage = (event) => {
      if (event.source !== frame.contentWindow || event.origin !== frameOrigin) return;

      if (event.data?.type === 'automatex360:resize') {
        const height = Number(event.data.height);
        if (Number.isFinite(height)) {
          frame.style.height = `${Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, height))}px`;
        }
        return;
      }

      // Sent by the estimator when a visitor submits their details for an
      // estimate (the vendor may add this message later; until then nothing
      // fires). Only the event is recorded, never what was entered.
      if (event.data?.type === 'automatex360:lead') {
        track('estimator_lead', { estimator, form_page: page });
      }
    };

    window.addEventListener('message', handleMessage);

    // estimator_view: the calculator scrolled into view (a quarter of it, or
    // 200px of a tall one), once per page view.
    let observer = null;
    if (typeof IntersectionObserver === 'function') {
      observer = new IntersectionObserver(
        (entries) => {
          const seen = entries.some(
            (entry) => entry.isIntersecting && (entry.intersectionRatio >= 0.25 || entry.intersectionRect.height >= 200)
          );
          if (seen) {
            track('estimator_view', { estimator, form_page: page });
            observer.disconnect();
          }
        },
        { threshold: [0, 0.05, 0.1, 0.25] }
      );
      observer.observe(frame);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      if (observer) observer.disconnect();
    };
  }, [src]);

  return (
    <iframe
      ref={frameRef}
      className="estimator-embed"
      src={src}
      width="100%"
      height="760"
      title={title}
      loading={loading}
      referrerPolicy="no-referrer"
      // allow-popups: the estimator's "Book On-Site Visit" button opens
      // /book-online in a new tab (target="_blank"), which a sandbox without
      // it silently blocks. Top navigation stays disallowed.
      sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      scrolling="no"
    />
  );
}
