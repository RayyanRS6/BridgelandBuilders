// GoHighLevel (LeadConnector API v2) calls used by the /free-quote form.
//
// Configuration comes from environment variables so the token never reaches the
// browser or the repository:
//   GHL_API_TOKEN    Private Integration token (required). Scopes needed:
//                    contacts.write, calendars.readonly, calendars/events.write
//   GHL_LOCATION_ID  The sub-account (location) id (required).
//   GHL_CALENDAR_ID  Optional override for the calendar in src/data/quoteForm.js.
//
// BOOKING_MOCK=1 swaps every call for canned responses. Only the local dev
// server sets it (see vite.config.js), and only when no token is configured.
import {
  BOOKING_CALENDAR,
  LEAD_SOURCE,
  OUTSIDE_AREA_TAG,
  QUOTE_QUESTIONS,
  isInServiceArea,
  tagsForLead,
} from '../../src/data/quoteForm.js';

const API_BASE = 'https://services.leadconnectorhq.com';
const CONTACTS_VERSION = '2021-07-28';
const CALENDARS_VERSION = '2021-04-15';

export class BookingError extends Error {
  constructor(code, status, message) {
    super(message || code);
    this.code = code;
    this.status = status;
  }
}

function config() {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    throw new BookingError('not_configured', 503, 'GHL_API_TOKEN and GHL_LOCATION_ID must be set.');
  }
  return { token, locationId, calendarId: process.env.GHL_CALENDAR_ID || BOOKING_CALENDAR.id };
}

export const isMock = () => process.env.BOOKING_MOCK === '1';

async function ghl(path, { method = 'GET', version, body, token }) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: version,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = [].concat(data.message || data.error || response.statusText).join('; ');
    // Log enough to debug from the Vercel logs, but never the visitor's details.
    console.error(`[ghl] ${method} ${path.split('?')[0]} -> ${response.status}: ${message}${data.traceId ? ` (trace ${data.traceId})` : ''}`);
    const slotGone = /slot|available|booked/i.test(message);
    throw new BookingError(slotGone ? 'slot_unavailable' : 'upstream_error', slotGone ? 409 : 502, message);
  }
  return data;
}

/* --------------------------------------------------------------- slots */

/**
 * Open slots between two YYYY-MM-DD dates (inclusive), keyed by date in the
 * calendar's time zone: { '2026-09-25': ['2026-09-25T10:00:00-05:00', ...] }.
 */
const DAY_MS = 24 * 60 * 60 * 1000;
// GoHighLevel refuses a free-slots request spanning more than 31 days, so
// longer ranges are split into chunks comfortably inside that.
const SLOT_CHUNK_DAYS = 28;

export async function getFreeSlots(start, end) {
  if (isMock()) return mockSlots(start, end);

  const { token, calendarId } = config();
  // A day of padding either side absorbs time-zone offsets; the result is then
  // trimmed back to exactly the requested dates.
  const from = Date.parse(`${start}T00:00:00Z`) - DAY_MS;
  const to = Date.parse(`${end}T23:59:59Z`) + DAY_MS;
  const chunks = [];
  for (let chunkStart = from; chunkStart <= to; chunkStart += SLOT_CHUNK_DAYS * DAY_MS) {
    chunks.push([chunkStart, Math.min(chunkStart + SLOT_CHUNK_DAYS * DAY_MS - 1, to)]);
  }

  const responses = await Promise.all(
    chunks.map(([chunkStart, chunkEnd]) => {
      const params = new URLSearchParams({
        startDate: String(chunkStart),
        endDate: String(chunkEnd),
        timezone: BOOKING_CALENDAR.timeZone,
      });
      return ghl(`/calendars/${calendarId}/free-slots?${params}`, { version: CALENDARS_VERSION, token });
    })
  );

  const days = {};
  for (const data of responses) {
    for (const [date, value] of Object.entries(data)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < start || date > end) continue;
      const slots = Array.isArray(value?.slots) ? value.slots : [];
      if (slots.length) {
        days[date] = [...new Set([...(days[date] || []), ...slots])].sort((a, b) => Date.parse(a) - Date.parse(b));
      }
    }
  }
  return days;
}

/* ---------------------------------------------------------------- lead */

/**
 * Creates the contact, or updates it when the email/phone already exists, with
 * the survey answers in the same custom fields the old GoHighLevel survey used,
 * and tags it with each answer (see tagsForLead). Returns { contactId, tags }.
 */
export async function upsertLead(lead, { utmSource } = {}) {
  if (isMock()) return { contactId: `mock-contact-${Date.now()}`, tags: tagsForLead(lead) };

  const { token, locationId } = config();
  const [firstName, ...rest] = lead.name.split(/\s+/);

  const data = await ghl('/contacts/upsert', {
    method: 'POST',
    version: CONTACTS_VERSION,
    token,
    body: {
      locationId,
      firstName,
      lastName: rest.join(' ') || undefined,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      address1: lead.address,
      city: lead.city,
      postalCode: lead.postalCode || undefined,
      source: utmSource ? `${LEAD_SOURCE} (${utmSource})` : LEAD_SOURCE,
      customFields: QUOTE_QUESTIONS.map((question) => ({
        id: question.fieldId,
        field_value: lead[question.key],
      })),
    },
  });

  const contactId = data?.contact?.id;
  if (!contactId) throw new BookingError('upstream_error', 502, 'Upsert returned no contact id.');

  // Tags go on separately: sending them with the upsert would replace any tags
  // a returning contact already has. This call adds to them instead.
  let tagged = await ghl(`/contacts/${contactId}/tags`, {
    method: 'POST',
    version: CONTACTS_VERSION,
    token,
    body: { tags: tagsForLead(lead) },
  });

  // Someone who first answered "outside the area" and then corrected it keeps
  // the same contact, so the stale out-of-area tag is taken off again.
  if (isInServiceArea(lead) && (tagged?.tags || []).includes(OUTSIDE_AREA_TAG)) {
    tagged = await ghl(`/contacts/${contactId}/tags`, {
      method: 'DELETE',
      version: CONTACTS_VERSION,
      token,
      body: { tags: [OUTSIDE_AREA_TAG] },
    });
  }

  return { contactId, tags: tagged?.tags || [] };
}

/* --------------------------------------------------------- appointment */

/**
 * Books the slot. The calendar takes one appointment per slot and this call
 * keeps GoHighLevel's availability check on, so a time someone else has just
 * booked is refused (slot_unavailable) rather than double-booked — and once
 * booked, the time drops out of getFreeSlots for everyone else.
 */
export async function bookAppointment(contactId, startTime, { lead } = {}) {
  const durationMs = BOOKING_CALENDAR.durationMinutes * 60 * 1000;
  const startMs = Date.parse(startTime);
  const endMs = startMs + durationMs;

  // Preserve the timezone offset if startTime has one (e.g. -05:00) so start & end match
  let endTime;
  const tzMatch = typeof startTime === 'string' ? startTime.match(/([+-]\d{2}:\d{2})$/) : null;
  if (tzMatch) {
    const sign = tzMatch[1][0] === '-' ? -1 : 1;
    const hours = parseInt(tzMatch[1].slice(1, 3), 10);
    const mins = parseInt(tzMatch[1].slice(4), 10);
    const offsetMin = (hours * 60 + mins) * sign;
    const localEnd = new Date(endMs + offsetMin * 60000);
    const pad = (n) => String(n).padStart(2, '0');
    endTime = `${localEnd.getUTCFullYear()}-${pad(localEnd.getUTCMonth() + 1)}-${pad(localEnd.getUTCDate())}T${pad(localEnd.getUTCHours())}:${pad(localEnd.getUTCMinutes())}:00${tzMatch[1]}`;
  } else {
    endTime = new Date(endMs).toISOString();
  }

  const meetingAddress = [lead?.address, lead?.city, lead?.postalCode].filter(Boolean).join(', ') || lead?.address || '';
  const title = lead?.name ? `Free Discovery Call - ${lead.name}` : BOOKING_CALENDAR.name;
  const renovationTypes = Array.isArray(lead?.types) && lead.types.length ? lead.types.join(', ') : '';
  const notes = [
    `Contact: ${lead?.name || ''}`,
    `Phone: ${lead?.phone || ''}`,
    `Email: ${lead?.email || ''}`,
    `Meeting Location: ${meetingAddress}`,
    renovationTypes ? `Renovation Types: ${renovationTypes}` : null,
  ].filter(Boolean).join('\n');

  if (isMock()) return { id: `mock-appointment-${Date.now()}`, startTime, endTime, address: meetingAddress, title };

  const { token, locationId, calendarId } = config();
  const data = await ghl('/calendars/events/appointments', {
    method: 'POST',
    version: CALENDARS_VERSION,
    token,
    body: {
      calendarId,
      locationId,
      contactId,
      startTime,
      endTime,
      title,
      meetingLocationType: 'custom',
      meetingLocationId: 'custom_0',
      overrideLocationConfig: true,
      address: meetingAddress,
      location: meetingAddress,
      meetingLocation: meetingAddress,
      selectedTimezone: BOOKING_CALENDAR.timeZone,
      appointmentStatus: 'confirmed',
      toNotify: true,
      description: notes,
      notes,
    },
  });

  // Tag the contact in GoHighLevel to signal that the meeting was booked (Step 2 completed)
  await ghl(`/contacts/${contactId}/tags`, {
    method: 'POST',
    version: CONTACTS_VERSION,
    token,
    body: { tags: ['website-appointment-booked', 'appointment-booked'] },
  }).catch((err) => console.error('[ghl] Failed to add appointment-booked tags:', err));

  return {
    id: data?.id,
    startTime: data?.startTime || startTime,
    endTime: data?.endTime || endTime,
    address: data?.address || meetingAddress,
    title: data?.title || title,
  };
}

/* ---------------------------------------------------------------- mock */

// Local development only: weekday slots every 30 minutes, 9am to 4:30pm in the
// calendar's time zone, with a few gaps so the calendar has something to show.
function mockSlots(start, end) {
  const tz = BOOKING_CALENDAR.timeZone;
  const now = Date.now();
  const days = {};
  for (let day = new Date(`${start}T12:00:00Z`); day.toISOString().slice(0, 10) <= end; day.setUTCDate(day.getUTCDate() + 1)) {
    const date = day.toISOString().slice(0, 10);
    const weekday = day.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    const slots = [];
    for (let minutes = 9 * 60; minutes <= 16 * 60 + 30; minutes += 30) {
      if ((Number(date.slice(-2)) + minutes / 30) % 5 === 0) continue;
      const iso = zonedIso(date, minutes, tz);
      if (Date.parse(iso) > now + 2 * 60 * 60 * 1000) slots.push(iso);
    }
    if (slots.length) days[date] = slots;
  }
  return days;
}

/** ISO string with offset for a wall-clock time on a date in a time zone. */
function zonedIso(date, minutesOfDay, timeZone) {
  const [y, m, d] = date.split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d, Math.floor(minutesOfDay / 60), minutesOfDay % 60);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      .formatToParts(new Date(guess))
      .map((p) => [p.type, p.value])
  );
  const asLocal = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  const offset = (asLocal - guess) / 60000;
  const sign = offset <= 0 ? '-' : '+';
  const abs = Math.abs(offset);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date}T${pad(Math.floor(minutesOfDay / 60))}:${pad(minutesOfDay % 60)}:00${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}
