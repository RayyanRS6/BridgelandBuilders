// Meta Conversions API: a server-side copy of the quote form's Lead and
// Schedule pixel events (SEO plan §18), de-duplicated against the browser
// event by the shared event id.
//
// OFF unless both environment variables are set (Vercel project settings):
//   META_PIXEL_ID      the pixel id (same as index.html)
//   META_CAPI_TOKEN    a Conversions API access token from Events Manager
// Optional:
//   META_TEST_EVENT_CODE  send to Events Manager -> Test events instead
//   META_GRAPH_VERSION    Graph API version, default below
//
// Before turning it on, check whether GoHighLevel already sends Conversions
// API events for these leads (its own Meta integration) so they aren't
// counted twice, and remove the old Event Setup Tool "Lead" rule.
//
// Only runs when the browser sent an event id, which it only does when the
// pixel itself is running, so Do Not Track visitors and localhost are never
// sent. Never for a request from Quebec, the EEA, the UK or Switzerland
// either (CONSENT_REGIONS, read from Vercel's IP-location headers on the
// request itself, so it holds even if the browser's own check hadn't
// finished). Contact details are SHA-256 hashed, as Meta requires. Never
// throws and never runs in the response path: callers use afterResponse().
import { createHash } from 'node:crypto';
import { consentRequired } from './region.js';

const DEFAULT_GRAPH_VERSION = 'v24.0';
const TIMEOUT_MS = 8000;

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const norm = (value) => String(value ?? '').trim().toLowerCase();

export function metaConfigured() {
  return Boolean(process.env.META_PIXEL_ID && process.env.META_CAPI_TOKEN);
}

function clientIp(req) {
  const forwarded = req?.headers?.['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : String(forwarded || '')).split(',')[0].trim();
  return ip || req?.headers?.['x-real-ip'] || undefined;
}

function userData(lead, attribution, req) {
  const [first, ...rest] = norm(lead?.name).split(/\s+/).filter(Boolean);
  const hashed = (value) => (value ? [sha256(value)] : undefined);
  const data = {
    em: hashed(norm(lead?.email)),
    ph: hashed(String(lead?.phone || '').replace(/\D/g, '')),
    fn: hashed(first),
    ln: hashed(rest.join(' ')),
    ct: hashed(norm(lead?.city).replace(/[^a-z]/g, '')),
    zp: hashed(norm(lead?.postalCode).replace(/[^a-z0-9]/g, '')),
    client_ip_address: clientIp(req),
    client_user_agent: req?.headers?.['user-agent'] ? String(req.headers['user-agent']).slice(0, 400) : undefined,
    fbp: attribution?.fbp,
    fbc: attribution?.fbc,
  };
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined && value !== ''));
}

function sourceUrl(req, attribution) {
  const host = req?.headers?.['x-forwarded-host'] || req?.headers?.host;
  const path = attribution?.formPage || '/';
  return host ? `https://${String(host).split(',')[0].trim()}${path}` : undefined;
}

/**
 * Sends one server event. Resolves (never rejects) once Meta answers, the
 * request times out, or immediately when not configured / no event id.
 * @param {object} args { eventName: 'Lead'|'Schedule', eventId, lead, attribution, req }
 */
export async function sendMetaEvent({ eventName, eventId, lead, attribution, req } = {}) {
  try {
    if (!metaConfigured() || !eventId || !eventName || !lead || consentRequired(req)) return;
    const version = /^v\d{2}\.\d$/.test(process.env.META_GRAPH_VERSION || '') ? process.env.META_GRAPH_VERSION : DEFAULT_GRAPH_VERSION;
    const pixelId = String(process.env.META_PIXEL_ID).replace(/\D/g, '');
    const body = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: 'website',
          event_source_url: sourceUrl(req, attribution),
          user_data: userData(lead, attribution, req),
        },
      ],
      ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
    };
    const response = await fetch(`https://graph.facebook.com/${version}/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.META_CAPI_TOKEN}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      // No visitor details in the log, only Meta's error.
      console.error(`[meta] ${eventName} -> ${response.status}: ${data?.error?.message || response.statusText}`);
    }
  } catch (error) {
    console.error(`[meta] ${eventName} failed: ${error?.name || 'error'}`);
  }
}

// Loaded once, up front, so waitUntil can be called synchronously while the
// request is still open. A missing package only means no waitUntil.
let waitUntil = null;
const waitUntilReady = import('@vercel/functions')
  .then((mod) => {
    if (typeof mod.waitUntil === 'function') waitUntil = mod.waitUntil;
  })
  .catch(() => {});

/**
 * Runs `task` after the response has been sent. On Vercel, waitUntil keeps the
 * function alive until it finishes; elsewhere (local dev) it simply runs in
 * the background. Never throws, never delays the caller.
 */
export function afterResponse(task) {
  try {
    const promise = Promise.resolve().then(task).catch(() => {});
    if (waitUntil) waitUntil(promise);
    else waitUntilReady.then(() => waitUntil && waitUntil(promise)).catch(() => {});
  } catch {
    /* never let measurement affect a lead */
  }
}
