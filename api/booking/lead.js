// POST /api/booking/lead
// Step one of the /free-quote form. The lead is saved to GoHighLevel as soon as
// the visitor finishes their details, so it is kept even if they never pick a
// time on the calendar step. Leads outside the service area are saved too
// (tagged, see tagsForLead); the response tells the page not to offer them the
// calendar.
import { isInServiceArea, validateLead } from '../../src/data/quoteForm.js';
import { upsertLead } from '../_lib/ghl.js';
import { cleanUtm, isSameOrigin, methodNotAllowed, readJson, sendError, sendJson } from '../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  if (!isSameOrigin(req)) return sendJson(res, 403, { error: 'forbidden' });

  try {
    const body = await readJson(req);

    // Honeypot: a field people never see. Bots that fill it get a normal-looking
    // success and nothing is sent to GoHighLevel.
    if (body.company) return sendJson(res, 200, { ok: true, inServiceArea: true });

    const { lead, errors } = validateLead(body);
    if (errors) return sendJson(res, 400, { error: 'invalid', fields: errors });

    await upsertLead(lead, { utmSource: cleanUtm(body.utmSource) });
    sendJson(res, 200, { ok: true, inServiceArea: isInServiceArea(lead) });
  } catch (error) {
    sendError(res, error);
  }
}
