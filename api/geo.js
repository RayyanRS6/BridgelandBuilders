// GET /api/geo
// Tells the inline measurement loader in index.html whether this visitor is
// in a region where the Meta Pixel needs consent first (Quebec, the EEA, the
// UK, Switzerland: CONSENT_REGIONS in src/data/analyticsConfig.js). Answers
// { consentRequired: boolean } and nothing else, from Vercel's IP-location
// headers (api/_lib/region.js). The answer is never cached, and nothing about
// the request (IP address included) is logged.
import { consentRequired } from './_lib/region.js';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD');
    return res.end('{"error":"method_not_allowed"}');
  }
  res.statusCode = 200;
  res.end(req.method === 'HEAD' ? undefined : JSON.stringify({ consentRequired: consentRequired(req) }));
}
