// Build-time server entry. Uses the streaming renderer because the routes are
// React.lazy() chunks: onAllReady fires only once every suspended boundary has
// resolved, so the output contains real page content, never the fallback.
import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import AppShell from './AppShell.jsx';

export function render(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const sink = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
        callback();
      },
    });
    // Decode once so a multi-byte character can never be split across chunks.
    // React 18's stream writer can also flush a full buffer whose last bytes
    // were never filled (when a multi-byte character such as ’ doesn't fit),
    // which leaves NUL characters in the text ("We\0\0’ll"). NUL never belongs
    // in HTML, so strip it; otherwise the static text differs from the client
    // render and from the page's own FAQ JSON-LD.
    sink.on('finish', () => resolve(Buffer.concat(chunks).toString('utf8').replace(/\u0000/g, '')));

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
