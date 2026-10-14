// POST /api/csp-report
// Receives Content-Security-Policy violation reports while the policy runs in
// report-only mode (vercel.json "headers"). Accepts both report formats:
//   application/csp-report      { "csp-report": { ... } }       (report-uri)
//   application/reports+json    [ { type: "csp-violation", body: { ... } } ]  (report-to)
// Logs a short sample (directive + blocked origin + page path, never query
// strings) to the function logs so the policy can be extended before it is
// enforced (plan §3.7: enforce after 14 clean days). Always answers 204.
// Added from these reports (2026-10-14): https://fonts.bunny.net (style-src,
// font-src: the GoHighLevel chat widget's Poppins font) and GoHighLevel's
// telemetry host https://xd-f1cf3d4fdb19408ea770fc6f80817dcb.ecs.us-east-1.on.aws
// (connect-src; the exact host, not *.on.aws, so a rotated host shows up here).

const MAX_BYTES = 32 * 1024;
const SAMPLE_RATE = 0.25; // log about 1 in 4 reports to keep logs small

/**
 * Raw request body as text. Vercel's Node helpers read the stream before the
 * handler runs and leave req.body undefined for types they don't parse
 * (application/csp-report, application/reports+json). After that an async
 * iterator over req yields nothing, but 'data'/'end' listeners still replay
 * the buffered body, so the stream is read with listeners, never `for await`.
 */
function readRaw(req) {
  return new Promise((resolve) => {
    let size = 0;
    let settled = false;
    const chunks = [];
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BYTES) return finish(null);
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on('end', () => finish(Buffer.concat(chunks).toString('utf8')));
    req.on('error', () => finish(null));
    setTimeout(() => finish(null), 5000).unref?.();
  });
}

async function readBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body.length <= MAX_BYTES ? JSON.parse(req.body.toString('utf8') || 'null') : null;
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || 'null');
  const raw = await readRaw(req);
  return raw ? JSON.parse(raw) : null;
}

/** Origin (or keyword like "inline"/"eval") of a blocked URL, never its path or query. */
function origin(value) {
  const text = String(value || '');
  if (!/^https?:|^wss?:/.test(text)) return text.slice(0, 40);
  try {
    return new URL(text).origin;
  } catch {
    return 'invalid';
  }
}

function pathOf(value) {
  try {
    return new URL(String(value)).pathname.slice(0, 120);
  } catch {
    return '';
  }
}

function summarise(report) {
  const body = report?.['csp-report'] || report?.body || report || {};
  const directive = body['effective-directive'] || body.effectiveDirective || body['violated-directive'] || body.violatedDirective || '?';
  const blocked = origin(body['blocked-uri'] ?? body.blockedURL ?? body.blockedUri);
  const page = pathOf(body['document-uri'] ?? body.documentURL ?? body.documentUri);
  return `${String(directive).split(' ')[0].slice(0, 40)} ${blocked} on ${page}`;
}

function done(res) {
  res.statusCode = 204;
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('Cache-Control', 'no-store');
  res.end();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return done(res);
  }
  try {
    const data = await readBody(req);
    const reports = Array.isArray(data) ? data : data ? [data] : [];
    for (const report of reports.slice(0, 10)) {
      if (report?.type && report.type !== 'csp-violation') continue;
      if (Math.random() < SAMPLE_RATE) console.warn(`[csp] ${summarise(report)}`);
    }
  } catch {
    /* malformed reports are ignored */
  }
  return done(res);
}
