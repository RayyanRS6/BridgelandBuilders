// Minimal request/response helpers written against plain Node objects, so the
// same handlers run as Vercel functions in production and inside the Vite dev
// server locally. (Files under api/_lib are not deployed as endpoints.)
import { channelFor } from '../../src/lib/channel.js';

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

/* ------------------------------------------------------- attribution */

// Whitelist and limits for the attribution the quote form sends
// (src/lib/attribution.js). Anything missing, malformed or too long is dropped
// silently: attribution is a nice-to-have and must never stop a lead.
const TEXT_FIELDS = { source: 100, medium: 100, campaign: 150, term: 150, content: 150 };
const CLICK_IDS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'];
const CLICK_ID_RE = /^[A-Za-z0-9_\-.~]{4,255}$/;
const PATH_RE = /^\/[A-Za-z0-9\-._~/%]{0,199}$/;
const REFERRER_RE = /^[a-z0-9.-]+\.[a-z]{2,}(?::\d{1,5})?(?:\/[A-Za-z0-9\-._~/%!$&'()*+,;=:@]{0,190})?$/i;

/** Printable text, control characters removed, trimmed and capped. */
function cleanText(value, max) {
  if (typeof value !== 'string') return undefined;
  // eslint-disable-next-line no-control-regex
  const text = value.replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim();
  return text && text.length <= max * 2 ? text.slice(0, max) : undefined;
}

const cleanPath = (value) => (typeof value === 'string' && PATH_RE.test(value) ? value : undefined);
const cleanReferrer = (value) =>
  typeof value === 'string' && value.length <= 200 && REFERRER_RE.test(value) ? value.toLowerCase().replace(/\/$/, '') : undefined;

function cleanTouch(touch) {
  if (!touch || typeof touch !== 'object' || Array.isArray(touch)) return undefined;
  const out = {};
  for (const [key, max] of Object.entries(TEXT_FIELDS)) {
    const value = cleanText(touch[key], max);
    if (value) out[key] = value;
  }
  for (const key of CLICK_IDS) {
    if (typeof touch[key] === 'string' && CLICK_ID_RE.test(touch[key])) out[key] = touch[key];
  }
  const referrer = cleanReferrer(touch.referrer);
  if (referrer) out.referrer = referrer;
  const landing = cleanPath(touch.landing);
  if (landing) out.landing = landing;
  const at = typeof touch.at === 'string' && touch.at.length <= 40 ? Date.parse(touch.at) : NaN;
  if (Number.isFinite(at) && at > Date.UTC(2020, 0, 1) && at < Date.now() + 86400000) out.at = new Date(at).toISOString();
  return Object.keys(out).length ? out : undefined;
}

/**
 * Cleans the `attribution` object sent with a lead. Returns
 * { formPage?, landing?, first?, last?, gaClientId?, fbp?, fbc?, internal?, channel }
 * or undefined. `internal` (only ever true) marks a lead from one of the
 * team's own devices (index.html, ?bb_internal=1). Never throws.
 */
export function cleanAttribution(input) {
  try {
    if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined;
    const out = {};
    const formPage = cleanPath(input.formPage);
    if (formPage) out.formPage = formPage;
    const landing = cleanPath(input.landing);
    if (landing) out.landing = landing;
    const first = cleanTouch(input.first);
    if (first) out.first = first;
    const last = cleanTouch(input.last);
    if (last) out.last = last;
    if (typeof input.gaClientId === 'string' && /^\d{1,20}\.\d{1,20}$/.test(input.gaClientId)) out.gaClientId = input.gaClientId;
    if (typeof input.fbp === 'string' && /^fb\.\d\.\d{10,16}\.\d{1,30}$/.test(input.fbp)) out.fbp = input.fbp;
    if (typeof input.fbc === 'string' && /^fb\.\d\.\d{10,16}\.[A-Za-z0-9_\-.~]{4,255}$/.test(input.fbc)) out.fbc = input.fbc;
    if (input.internal === true) out.internal = true;
    if (!Object.keys(out).length) return undefined;
    out.channel = channelFor(out.last || out.first);
    return out;
  } catch {
    return undefined;
  }
}

/** A Meta event id from the browser (crypto.randomUUID or similar), else undefined. */
export function cleanEventId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9-]{8,64}$/.test(value) ? value : undefined;
}
