// GET /api/booking/slots?start=YYYY-MM-DD&end=YYYY-MM-DD
// Open appointment times for the discovery-call calendar, keyed by date.
import { BOOKING_CALENDAR } from '../../src/data/quoteForm.js';
import { getFreeSlots } from '../_lib/ghl.js';
import { methodNotAllowed, queryParams, sendError, sendJson } from '../_lib/http.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RANGE_DAYS = 45;

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET');

  const params = queryParams(req);
  const start = params.get('start') || '';
  const end = params.get('end') || '';
  const spanDays = (Date.parse(end) - Date.parse(start)) / 86400000;
  if (!DATE.test(start) || !DATE.test(end) || !(spanDays >= 0 && spanDays <= MAX_RANGE_DAYS)) {
    return sendJson(res, 400, { error: 'bad_range' });
  }

  try {
    const days = await getFreeSlots(start, end);
    sendJson(res, 200, { timeZone: BOOKING_CALENDAR.timeZone, days });
  } catch (error) {
    sendError(res, error);
  }
}
