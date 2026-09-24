// Minimal request/response helpers written against plain Node objects, so the
// same handlers run as Vercel functions in production and inside the Vite dev
// server locally. (Files under api/_lib are not deployed as endpoints.)

const MAX_BODY_BYTES = 16 * 1024;

export function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed);
  sendJson(res, 405, { error: 'method_not_allowed' });
}

/** Parsed JSON body. Uses req.body when the platform already parsed it. */
export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error('Body too large'), { status: 413 });
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

/**
 * Browsers always send Origin on a cross-site POST, so rejecting a mismatched
 * one stops other sites from submitting leads through these endpoints.
 */
export function isSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function queryParams(req) {
  return new URL(req.url, 'http://localhost').searchParams;
}

/** Maps a thrown error to a JSON response without leaking internals. */
export function sendError(res, error) {
  if (error instanceof SyntaxError) return sendJson(res, 400, { error: 'bad_json' });
  const status = Number(error?.status) || 500;
  if (status >= 500 && !error?.code) console.error('[booking]', error);
  sendJson(res, status, { error: error?.code || (status === 413 ? 'too_large' : 'server_error') });
}

/** Ad platforms append ?utm_source=facebook; keep a short, safe copy of it. */
export function cleanUtm(value) {
  const cleaned = String(value ?? '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 40);
  return cleaned || undefined;
}
