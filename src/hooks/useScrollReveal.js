import { useEffect } from 'react';

const REVEAL_SELECTOR = '.reveal:not(.active)';
const SAFETY_DELAY_MS = 3000;

/**
 * Scroll reveal for the whole site: one IntersectionObserver, mounted once in
 * AppShell, that adds `.active` to every `.reveal` element as it scrolls into
 * view (see `.reveal` in index.css).
 *
 * - threshold 0: an element counts as soon as any of it is on screen, so a
 *   block taller than the viewport (a long article body) is never stuck at
 *   opacity 0.
 * - A MutationObserver picks up `.reveal` elements that render later — new
 *   pages, lazy chunks, related cards — so nothing depends on when a page
 *   happened to call a hook.
 * - Safety net: 3 seconds after new elements arrive, anything still hidden that
 *   is on screen or already scrolled past is shown. Elements further down keep
 *   their scroll animation.
 */
export function useGlobalScrollReveal() {
  useEffect(() => {
    const root = document.getElementById('root') ?? document.body;
    const activate = (element) => element.classList.add('active');

    // Without IntersectionObserver (very old browsers) everything is shown.
    const intersectionObserver = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activate(entry.target);
              intersectionObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0,
          rootMargin: '0px 0px -8% 0px',
        });

    let safetyTimer;
    const revealMissed = () => {
      const viewportBottom = window.innerHeight || document.documentElement.clientHeight;
      root.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        if (element.getBoundingClientRect().top < viewportBottom) {
          activate(element);
          intersectionObserver?.unobserve(element);
        }
      });
    };
    const scheduleSafetyNet = () => {
      window.clearTimeout(safetyTimer);
      safetyTimer = window.setTimeout(revealMissed, SAFETY_DELAY_MS);
    };

    const watch = (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      const found = node.matches(REVEAL_SELECTOR)
        ? [node, ...node.querySelectorAll(REVEAL_SELECTOR)]
        : [...node.querySelectorAll(REVEAL_SELECTOR)];
      found.forEach((element) => {
        if (intersectionObserver) intersectionObserver.observe(element);
        else activate(element);
      });
      return found.length > 0;
    };

    const unwatch = (node) => {
      if (!intersectionObserver || node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.matches('.reveal')) intersectionObserver.unobserve(node);
      node.querySelectorAll('.reveal').forEach((element) => intersectionObserver.unobserve(element));
    };

    if (watch(root)) scheduleSafetyNet();

    const mutationObserver = new MutationObserver((mutations) => {
      let added = false;
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach(unwatch);
        mutation.addedNodes.forEach((node) => {
          if (watch(node)) added = true;
        });
      });
      if (added) scheduleSafetyNet();
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(safetyTimer);
      mutationObserver.disconnect();
      intersectionObserver?.disconnect();
    };
  }, []);
}

/**
 * Kept so existing page components can still call it. Scroll reveal now runs
 * from one global observer (useGlobalScrollReveal in AppShell), so this does
 * nothing.
 */
export default function useScrollReveal() {}
