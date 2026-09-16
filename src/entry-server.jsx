// Build-time server entry. Uses the streaming renderer because the routes are
// React.lazy() chunks: onAllReady fires only once every suspended boundary has
// resolved, so the output contains real page content, never the fallback.
import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import AppShell from './AppShell.jsx';

export function render(url) {
  return new Promise((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        html += chunk;
        callback();
      },
    });
    sink.on('finish', () => resolve(html));

    const { pipe, abort } = renderToPipeableStream(
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>,
      {
        onAllReady() {
          pipe(sink);
        },
        onError(error) {
          reject(error);
        },
      }
    );

    setTimeout(() => abort(new Error(`Prerender timed out for ${url}`)), 20000);
  });
}
