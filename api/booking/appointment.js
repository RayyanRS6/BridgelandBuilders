// POST /api/booking/appointment
// Step two of the /free-quote form: books the chosen time for the visitor.
// The contact is looked up again from their details rather than trusting a
// contact id sent by the browser, so nobody can book on someone else's record.
import { isInServiceArea, validateLead } from '../../src/data/quoteForm.js';
import { bookAppointment, upsertLead } from '../_lib/ghl.js';
import { cleanUtm, isSameOrigin, methodNotAllowed, readJson, sendError, sendJson } from '../_lib/http.js';

const MAX_DAYS_AHEAD = 90;

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST');
  if (!isSameOrigin(req)) return sendJson(res, 403, { error: 'forbidden' });

  try {
    const body = await readJson(req);
    if (body.company) return sendJson(res, 200, { ok: true, booking: { startTime: body.startTime } });

    const { lead, errors } = validateLead(body);
    if (errors) return sendJson(res, 400, { error: 'invalid', fields: errors });
    // Out-of-area leads are saved by /lead but never offered a booking.
    if (!isInServiceArea(lead)) return sendJson(res, 422, { error: 'outside_service_area' });

    const start = Date.parse(body.startTime);
    const now = Date.now();
    if (typeof body.startTime !== 'string' || !Number.isFinite(start) || start < now || start > now + MAX_DAYS_AHEAD * 86400000) {
      return sendJson(res, 400, { error: 'bad_time' });
    }

    const { contactId } = await upsertLead(lead, { utmSource: cleanUtm(body.utmSource) });
    const booking = await bookAppointment(contactId, body.startTime, { lead });
    sendJson(res, 200, {
      ok: true,
      booking: {
        id: booking.id,
        startTime: booking.startTime,
        endTime: booking.endTime,
        title: booking.title,
        address: booking.address,
      },
    });
  } catch (error) {
    sendError(res, error);
  }
}
