// The visitor's country and region, from the IP-location headers Vercel adds
// to every request, for the consent rule in src/data/analyticsConfig.js
// (CONSENT_REGIONS). Only those two short codes are read: never the IP
// address, and nothing here is logged or stored.
//
// Outside Vercel (local dev) the headers are missing, so no visitor is in a
// consent region there.
import { CONSENT_REGIONS } from '../../src/data/analyticsConfig.js';

function header(req, name) {
  const value = req?.headers?.[name];
  return String((Array.isArray(value) ? value[0] : value) || '').trim().toUpperCase();
}

/** { country: 'CA', region: 'MB' }, either missing when unknown. Never throws. */
export function visitorRegion(req) {
  try {
    const country = header(req, 'x-vercel-ip-country');
    const region = header(req, 'x-vercel-ip-country-region');
    return {
      country: /^[A-Z]{2}$/.test(country) ? country : undefined,
      region: /^[A-Z0-9]{1,3}$/.test(region) ? region : undefined,
    };
  } catch {
    return {};
  }
}

/** True when the request comes from a CONSENT_REGIONS country or region. */
export function consentRequired(req) {
  const { country, region } = visitorRegion(req);
  if (!country) return false;
  return CONSENT_REGIONS.includes(country) || Boolean(region && CONSENT_REGIONS.includes(`${country}-${region}`));
}
