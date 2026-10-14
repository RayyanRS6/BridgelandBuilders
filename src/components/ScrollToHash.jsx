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
const anchorFor = (target) => target.closest('[data-scroll-anchor]') || target;
const scrollToTarget = (target) => anchorFor(target).scrollIntoView();

/**
 * The first location's #hash, handed to landOnHash.js (loaded only for such a
 * visit). Returns the cleanup.
 */
function landOnFirstLoad(hash) {
  let stop = null;
  let cancelled = false;
  import('./landOnHash.js').then(
    (module) => {
      if (!cancelled) stop = module.landOnFirstLoad(hash, { find: findHashTarget, anchorFor });
    },
    () => {} // the browser's own jump stands
  );
  return () => {
    cancelled = true;
    if (stop) stop();
  };
}

// Landing on "/#services" from another page needs to scroll to that section;
// landing on a new page with no hash should start at the top.
//
// The first location is never sent to the top: the browser has already put
// the prerendered page where it belongs, and hydration must not move it. With
// a #hash, the browser jumps to the target itself (smooth scrolling, which
// would cancel that, only starts after the load event: index.css) and
// landOnHash.js finishes the job: an instant jump, never once the visitor has
// scrolled. Pages are lazy-loaded chunks, so after a client-side navigation
// the #hash target can also appear a moment later — keep looking for up to
// two seconds before settling for the top of the page. In-app jumps scroll
// smoothly.
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

    if (isInitial) return landOnFirstLoad(hash);

    const target = findHashTarget(hash);
    if (target) {
      scrollToTarget(target);
      return undefined;
    }

    // A new page whose target has not rendered yet starts at the top meanwhile.
    if (pathnameChanged) scrollToTop();

    const giveUpAt = Date.now() + GIVE_UP_AFTER_MS;
    let timer;
    const retry = () => {
      const found = findHashTarget(hash);
      if (found) {
        scrollToTarget(found);
      } else if (Date.now() >= giveUpAt) {
        scrollToTop();
      } else {
        timer = window.setTimeout(retry, RETRY_EVERY_MS);
      }
    };
    timer = window.setTimeout(retry, RETRY_EVERY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
