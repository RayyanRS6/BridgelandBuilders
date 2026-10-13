import { Component } from 'react';
import { isChunkLoadError } from '../lib/lazyRetry.js';

const RELOAD_KEY = 'bb-chunk-reload';

/** Reloads once per page per session; false if this page already tried. */
function reloadOnce() {
  try {
    const path = window.location.pathname;
    if (window.sessionStorage.getItem(RELOAD_KEY) === path) return false;
    window.sessionStorage.setItem(RELOAD_KEY, path);
  } catch {
    return false; // no storage: show the reload link rather than risk a loop
  }
  window.location.reload();
  return true;
}

/**
 * Wraps the routes (AppShell.jsx) so a page whose code fails to download (for
 * example a deploy replaced the chunk, or the connection dropped) never
 * unmounts the whole app. A missing chunk reloads the page once; anything
 * else, or a second failure, shows a reload link in the page area while the
 * top bar, navbar and footer stay usable. Resets on the next navigation.
 */
export default class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, reloading: false };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    if (isChunkLoadError(error) && reloadOnce()) this.setState({ reloading: true });
  }

  componentDidUpdate(previous) {
    if (this.state.error && previous.resetKey !== this.props.resetKey) {
      this.setState({ error: null, reloading: false });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="route-loading" aria-live="polite">
        {this.state.reloading ? (
          <p>Loading page...</p>
        ) : (
          <p>
            This page didn’t finish loading. <a href={typeof window !== 'undefined' ? window.location.href : '/'}>Reload the page</a>
          </p>
        )}
      </main>
    );
  }
}
