/*
 * The first-load half of ScrollToHash.jsx, loaded only when the URL a visit
 * starts on has a #hash, so it is not part of every page's first load.
 */

const RETRY_EVERY_MS = 100;
const GIVE_UP_AFTER_MS = 2000;
// After the jump, late layout (web fonts, images, a chunk rendering late)
// could still move the target, so it is held in place until this long after
// the page's load event (SETTLE_MAX_MS at most), or until the visitor scrolls.
const SETTLE_AFTER_LOAD_MS = 1000;
const SETTLE_MAX_MS = 8000;
// Any of these and the visitor is scrolling (or about to) on their own.
const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'];

/**
 * Where scrollIntoView() puts an element: its top less its scroll-margin-top
 * (the sticky navbar's clearance, index.css), within the page's scroll range.
 * Measured from layout (offsetTop), which a `.reveal` element's slide-in
 * transform doesn't change, so a target that is still fading in lands where it
 * ends up, and its animation is never mistaken for a layout shift.
 */
function landingTop(element) {
  let top = 0;
  for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
  const margin = parseFloat(window.getComputedStyle(element).scrollMarginTop) || 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(Math.round(top - margin), max));
}

/**
 * First load of a URL with a #hash (a shared link, a search result, a link
 * from another site). The browser jumps to the target by itself, before the
 * bundle loads (index.css turns on smooth scrolling only after the load event,
 * because smooth scrolling cancels that jump). This covers what it can't do:
 * - a target the server HTML doesn't have yet (rendered on the client), which
 *   is waited for as on any page (up to two seconds);
 * - a target inside a [data-scroll-anchor] block, which in-app jumps bring
 *   into view whole while the browser lands on the target itself;
 * - a browser that did not jump at all (the page is still at the top).
 * The jump is instant, to the spot an in-app jump lands on (`anchorFor`, then
 * scroll-margin-top), and the target is held there while the page settles.
 * The page is never moved once the visitor has scrolled: input stops
 * everything, and a page already scrolled anywhere else (before the bundle
 * loaded, or a scroll position restored on reload) is left alone.
 *
 * `find(hash)` and `anchorFor(target)` are ScrollToHash's own, so both halves
 * agree on the target. Returns the cleanup.
 */
export function landOnFirstLoad(hash, { find, anchorFor }) {
  const startedAt = Date.now();
  let stopped = false;
  let target = null;
  let landed = null;
  let timer;
  let maxTimer;
  let resizeObserver = null;

  const stop = () => {
    if (stopped) return;
    stopped = true;
    window.clearTimeout(timer);
    window.clearTimeout(maxTimer);
    if (resizeObserver) resizeObserver.disconnect();
    window.removeEventListener('load', onLoad);
    USER_SCROLL_EVENTS.forEach((type) => window.removeEventListener(type, stop, true));
  };

  // Jumps, then again only when layout has moved the landing spot.
  const jump = () => {
    if (stopped) return;
    if (!target || !target.isConnected) target = find(hash);
    if (!target || !target.getClientRects().length) return; // gone or hidden
    const top = landingTop(anchorFor(target));
    if (top === landed) return;
    landed = top;
    window.scrollTo({ top, behavior: 'instant' });
  };

  // The browser's own fragment handling ends with the load event; whatever it
  // did last, the page goes back to the landing spot.
  function onLoad() {
    landed = null;
    jump();
    window.clearTimeout(timer);
    timer = window.setTimeout(stop, SETTLE_AFTER_LOAD_MS);
  }

  const land = () => {
    const y = window.scrollY;
    // Exactly where the browser's own jump leaves the target. Scrolled
    // anywhere else, the page was moved by someone else and stays put.
    const browserJumped = y !== 0 && Math.abs(y - landingTop(target)) <= 2;
    if (y !== 0 && !(browserJumped && anchorFor(target) !== target)) {
      stop();
      return;
    }
    jump();
    maxTimer = window.setTimeout(stop, SETTLE_MAX_MS);
    if (document.readyState === 'complete') timer = window.setTimeout(stop, SETTLE_AFTER_LOAD_MS);
    else window.addEventListener('load', onLoad);
    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(jump);
      resizeObserver.observe(document.getElementById('root') || document.body);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(jump, () => {});
  };

  const look = () => {
    target = find(hash);
    if (target) land();
    else if (Date.now() - startedAt >= GIVE_UP_AFTER_MS) stop();
    else timer = window.setTimeout(look, RETRY_EVERY_MS);
  };

  USER_SCROLL_EVENTS.forEach((type) => window.addEventListener(type, stop, { capture: true, passive: true }));
  look();
  return stop;
}
