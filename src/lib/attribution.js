// First- and last-touch lead attribution (SEO plan §18).
//
// On every full page load, captureAttribution() reads how the visit arrived:
// campaign tags (utm_*), ad click ids (gclid, gbraid, wbraid, fbclid,
// msclkid), the referring site (host and path only, never its query) and the
// landing page. The first touch and the latest touch that had a source are
// remembered in localStorage for ATTRIBUTION_TTL_DAYS, so a visitor who
// clicks an ad today and fills in the form next week is still attributed.
//
// getAttribution() returns what the quote form sends with a lead. The server
// cleans it again (api/_lib/http.js cleanAttribution) and drops anything
// malformed, so this data can never block or break a lead.
//
// Do Not Track: nothing is stored and no cookie ids are read; only the
// current visit's own tags are sent with a form the visitor submits.
//
// On the team's own devices (marked with ?bb_internal=1, see index.html) the
// attribution also carries internal: true, so the server never sends those
// leads to Meta. The lead itself is saved as usual.
import { ATTRIBUTION_TTL_DAYS } from '../data/analyticsConfig.js';
import { CANONICAL_SITE_URL } from '../data/siteConfig.js';

const STORAGE_KEY = 'bb:attribution';
const SESSION_KEY = 'bb:landing';
const PARAMS = {
  utm_source: 'source',
  utm_medium: 'medium',
  utm_campaign: 'campaign',
  utm_term: 'term',
  utm_content: 'content',
  gclid: 'gclid',
  gbraid: 'gbraid',
  wbraid: 'wbraid',
  fbclid: 'fbclid',
  msclkid: 'msclkid',
};
const SOURCE_KEYS = Object.values(PARAMS);
const DAY_MS = 86400000;

let current = null; // this page load's touch, kept in memory
let landing = null; // first page of this visit

const isBrowser = () => typeof window !== 'undefined';

function doNotTrack() {
  return isBrowser() && (window.navigator.doNotTrack === '1' || window.doNotTrack === '1');
}

function read(storage, key) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode, full or blocked storage: attribution is optional */
  }
}

// The site's own domain. It and every subdomain of it (www, the price
// estimator at estimator.bridgelandbuilders.com) are internal, so a visit
// from one of them never replaces the touch (an ad click, say) that brought
// the visitor in.
const SITE_HOSTNAME = new URL(CANONICAL_SITE_URL).hostname;

function internalHost(hostname) {
  const host = hostname.toLowerCase();
  return host === window.location.hostname || host === SITE_HOSTNAME || host.endsWith(`.${SITE_HOSTNAME}`);
}

function externalReferrer() {
  try {
    if (!document.referrer) return undefined;
    const url = new URL(document.referrer);
    if (!/^https?:$/.test(url.protocol) || url.host === window.location.host || internalHost(url.hostname)) return undefined;
    return `${url.host}${url.pathname === '/' ? '' : url.pathname}`.slice(0, 200);
  } catch {
    return undefined;
  }
}

function touchFromLocation() {
  const touch = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const [param, key] of Object.entries(PARAMS)) {
      const value = params.get(param);
      if (value) touch[key] = value.slice(0, 200);
    }
  } catch {
    /* ignore */
  }
  const referrer = externalReferrer();
  if (referrer) touch.referrer = referrer;
  touch.landing = window.location.pathname.slice(0, 200);
  touch.at = new Date().toISOString();
  return touch;
}

const hasSource = (touch) => Boolean(touch && (touch.referrer || SOURCE_KEYS.some((key) => touch[key])));
const fresh = (touch) => touch && Date.now() - Date.parse(touch.at) < ATTRIBUTION_TTL_DAYS * DAY_MS;

/** Records this page load's touch. Call once, as early as possible. Never throws. */
export function captureAttribution() {
  if (!isBrowser() || current) return;
  try {
    current = touchFromLocation();
    if (doNotTrack()) {
      landing = current.landing;
      return;
    }

    landing = read(window.sessionStorage, SESSION_KEY);
    if (!landing) {
      landing = current.landing;
      write(window.sessionStorage, SESSION_KEY, landing);
    }

    const saved = read(window.localStorage, STORAGE_KEY) || {};
    const first = fresh(saved.first) ? saved.first : current;
    // Last touch = the latest visit that came from somewhere (ad, search,
    // another site); a direct visit doesn't overwrite it.
    let last = fresh(saved.last) ? saved.last : null;
    if (hasSource(current) || !last) last = current;
    write(window.localStorage, STORAGE_KEY, { v: 1, first, last });
  } catch {
    /* attribution must never break the page */
  }
}

function cookie(name) {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : undefined;
  } catch {
    return undefined;
  }
}

/** GA4 client id from the _ga cookie ("GA1.1.123.456" -> "123.456"). */
function gaClientId() {
  const value = cookie('_ga');
  const match = value && value.match(/^GA\d\.\d\.(\d+\.\d+)$/);
  return match ? match[1] : undefined;
}

/** { internal: true } on a team device (index.html sets window.__bbInternal), else {}. */
const internalFlag = () => (window.__bbInternal === true ? { internal: true } : {});

/**
 * Attribution to send with a lead: { formPage, landing, first, last,
 * gaClientId?, fbp?, fbc?, internal? }. Never throws; returns undefined on
 * the server.
 */
export function getAttribution() {
  if (!isBrowser()) return undefined;
  try {
    if (!current) captureAttribution();
    const formPage = window.location.pathname.slice(0, 200);
    if (doNotTrack()) return { formPage, landing, first: current, last: current, ...internalFlag() };

    const saved = read(window.localStorage, STORAGE_KEY) || {};
    const first = saved.first || current;
    const last = saved.last || current;
    const fbclid = (last && last.fbclid) || (current && current.fbclid);
    const fbcFromClick = fbclid ? `fb.1.${Date.parse((last && last.at) || '') || Date.now()}.${fbclid}` : undefined;
    return {
      formPage,
      landing,
      first,
      last,
      gaClientId: gaClientId(),
      fbp: cookie('_fbp'),
      fbc: cookie('_fbc') || fbcFromClick,
      ...internalFlag(),
    };
  } catch {
    return undefined;
  }
}

/** The latest touch (for the GA4 lead_channel parameter). */
export function lastTouch() {
  const attribution = getAttribution();
  return attribution && (attribution.last || attribution.first);
}
