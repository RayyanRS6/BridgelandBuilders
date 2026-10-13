import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const RETRY_EVERY_MS = 100;
const GIVE_UP_AFTER_MS = 2000;

const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

function findHashTarget(hash) {
  if (!hash || hash === '#') return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

// A hash target inside a [data-scroll-anchor] block brings that whole block
// into view instead (the /services category tabs: the tab bar, not just the
// one tab, so stacked tabs on phones stay clear of the sticky navbar).
const scrollToTarget = (target) => (target.closest('[data-scroll-anchor]') || target).scrollIntoView();

// Landing on "/#services" from another page needs to scroll to that section;
// landing on a new page with no hash should start at the top.
//
// The first location is left alone: the browser has already put the
// prerendered page where it belongs (top, or the #hash target), and hydration
// must not move it. The one exception is a first page whose #hash target is
// not in the HTML yet (rendered on the client), which is scrolled to once it
// appears. Pages are lazy-loaded chunks, so after a client-side navigation the
// #hash target can also appear a moment later — keep looking for up to two
// seconds before settling for the top of the page.
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();
  const initialLocation = useRef(`${pathname}${hash}`);
  const leftInitialLocation = useRef(false);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    // Compared by location rather than a "first run" flag, so StrictMode's
    // double effect in development is treated as the first run too.
    const isInitial = !leftInitialLocation.current && `${pathname}${hash}` === initialLocation.current;
    if (!isInitial) leftInitialLocation.current = true;

    const pathnameChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (!hash) {
      if (!isInitial) scrollToTop();
      return undefined;
    }

    const target = findHashTarget(hash);
    if (target) {
      if (!isInitial) scrollToTarget(target);
      return undefined;
    }

    // A new page whose target has not rendered yet starts at the top meanwhile.
    if (pathnameChanged && !isInitial) scrollToTop();

    const giveUpAt = Date.now() + GIVE_UP_AFTER_MS;
    let timer;
    const retry = () => {
      const found = findHashTarget(hash);
      if (found) {
        scrollToTarget(found);
      } else if (Date.now() >= giveUpAt) {
        if (!isInitial) scrollToTop();
      } else {
        timer = window.setTimeout(retry, RETRY_EVERY_MS);
      }
    };
    timer = window.setTimeout(retry, RETRY_EVERY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
