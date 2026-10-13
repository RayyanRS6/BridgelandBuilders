import { lazy } from 'react';

/**
 * Code-split chunks (route pages, service content, post bodies, cost guides)
 * that fail to download must not wipe a prerendered page.
 *
 * - Every chunk load is retried a couple of times with a short back-off.
 * - While the first page is still the one the server rendered, a chunk that
 *   keeps failing never settles instead of rejecting. React then leaves that
 *   part of the prerendered HTML in place (readable, links work as plain
 *   links), rather than replacing it with an error view or a blank page. If
 *   the visitor then navigates, the new URL is loaded in full (see
 *   reloadWhenUrlChanges).
 * - After the visitor has navigated in the browser there is no server HTML to
 *   keep, so the error is thrown and RouteErrorBoundary (AppShell.jsx) handles
 *   it: one automatic reload, then a reload link.
 */

let initialPage = typeof window !== 'undefined' && Boolean(document.getElementById('root')?.hasChildNodes());
// The URL the server rendered. Router navigations run as transitions: the old
// page stays on screen while the new one loads, and AppShell only hears about
// the new path once it commits. So a chunk failing during a navigation is
// recognised by the live URL no longer matching this one.
const INITIAL_PATH = typeof window !== 'undefined' ? window.location.pathname : null;

/** Called by AppShell once an in-browser navigation has committed. */
export function leftInitialPage() {
  initialPage = false;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Runs `load` up to `attempts` times, waiting 0.6s, then 1.2s, between tries. */
export async function retryLoad(load, attempts = 3) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await load();
    } catch (error) {
      lastError = error;
      if (typeof window === 'undefined') break; // the build fails loudly instead
      if (attempt < attempts - 1) await wait(600 * 2 ** attempt);
    }
  }
  throw lastError;
}

/**
 * Rejection handler for a chunk that is still missing after the retries:
 * keeps the server HTML on the prerendered first page, rethrows otherwise.
 */
export function keepServerHtml(error) {
  if (onInitialPage()) {
    reloadWhenUrlChanges();
    return new Promise(() => {});
  }
  throw error;
}

// A boundary that never settles can't be updated in the browser either: a
// router navigation away from it would wait on it forever (the URL changes,
// the page doesn't). So while anything is held, a change of path loads the
// new URL in full instead — every route is prerendered. Runs only after a
// chunk has failed, never on a healthy page.
let watchingUrl = false;
function reloadWhenUrlChanges() {
  if (watchingUrl || typeof window === 'undefined') return;
  watchingUrl = true;
  const timer = window.setInterval(() => {
    if (window.location.pathname === INITIAL_PATH) return;
    window.clearInterval(timer);
    window.location.reload();
  }, 250);
}

/** True while the visitor is still on the page the server prerendered. */
export function onInitialPage() {
  return initialPage && typeof window !== 'undefined' && window.location.pathname === INITIAL_PATH;
}

/** React.lazy with retries and the prerendered-HTML hold described above. */
export function lazyWithRetry(load) {
  return lazy(() => retryLoad(load).catch(keepServerHtml));
}

/** Errors a browser raises when a dynamically imported chunk can't be fetched. */
export function isChunkLoadError(error) {
  const text = `${error?.name || ''} ${error?.message || ''}`;
  return /ChunkLoadError|dynamically imported module|Importing a module script failed|Failed to fetch|error loading dynamically|Unable to preload CSS/i.test(
    text
  );
}
