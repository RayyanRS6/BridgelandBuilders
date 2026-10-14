// POST /api/booking/lead
// Step one of the quote form. The lead is saved to GoHighLevel as soon as
// the visitor finishes their details, so it is kept even if they never pick a
// time on the calendar step. Leads outside the service area are saved too
// (tagged, see tagsForLead); the response tells the page not to offer them the
// calendar.
//
// Attribution and the Meta event id ride along but can never block a save:
// cleanAttribution drops anything malformed, and both the attribution note on
// the contact (addAttributionNote) and the Conversions API copy of the Lead
// (api/_lib/meta.js, off unless configured) run only after the response has
// been sent. Leads from the team's own devices (attribution.internal, see
// index.html) are saved like any other but never sent to Meta.
import { isInServiceArea } from '../../src/data/quoteForm.js';
import { validateLead } from '../../src/data/leadValidation.js';
import { addAttributionNote, upsertLead } from '../_lib/ghl.js';
import { afterResponse, sendMetaEvent } from '../_lib/meta.js';
import {
  cleanAttribution,
  cleanEventId,
  cleanUtm,
  isSameOrigin,
  methodNotAllowed,
  readJson,
  sendError,
  sendJson,
} from '../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  if (!isSameOrigin(req)) return sendJson(res, 403, { error: 'forbidden' });

  try {
    const body = await readJson(req);

    // Honeypot: a field people never see. Bots that fill it get a normal-looking
    // success and nothing is sent to GoHighLevel.
    if (body.bb_hp) return sendJson(res, 200, { ok: true, inServiceArea: true });

    const { lead, errors } = validateLead(body);
    if (errors) return sendJson(res, 400, { error: 'invalid', fields: errors });

    const attribution = cleanAttribution(body.attribution);
    const { contactId } = await upsertLead(lead, { utmSource: cleanUtm(body.utmSource), attribution });
    const inServiceArea = isInServiceArea(lead);
    sendJson(res, 200, { ok: true, inServiceArea });

    // How the visitor found the site, as a note on the contact. Only here,
    // not in appointment.js, which saves the same lead again.
    afterResponse(() => addAttributionNote(contactId, attribution));

    // Only in-area leads are Lead conversions, matching the browser pixel.
    const eventId = cleanEventId(body.eventId);
    if (inServiceArea && eventId && !attribution?.internal) {
      afterResponse(() => sendMetaEvent({ eventName: 'Lead', eventId, lead, attribution, req }));
    }
  } catch (error) {
    sendError(res, error);
  }
}
