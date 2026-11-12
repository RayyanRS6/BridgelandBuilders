// Calendar-day and time formatting in a fixed time zone. Booking slots are
// shown in the business's zone (Winnipeg), whatever zone the visitor's phone is
// set to, so everyone sees the same times the crew does.
//
// Dates are plain 'YYYY-MM-DD' strings throughout; they are only turned into
// Date objects at noon UTC, which keeps them on the right day in any zone.

const pad = (n) => String(n).padStart(2, '0');

export function ymd(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** Today's date in the given time zone, as 'YYYY-MM-DD'. */
export function todayIn(timeZone) {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

const atNoon = (date) => new Date(`${date}T12:00:00Z`);

export function formatMonth(year, month) {
  return new Intl.DateTimeFormat('en-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(atNoon(ymd(year, month, 1)));
}

/** 'Thursday, September 25' */
export function formatLongDate(date) {
  return new Intl.DateTimeFormat('en-CA', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(atNoon(date));
}

/** '10:30 a.m.' style wall-clock time for an ISO timestamp in a zone. */
export function formatTime(iso, timeZone) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone }).format(new Date(iso)).toLowerCase();
}

/** The calendar date an ISO timestamp falls on in a zone, as 'YYYY-MM-DD'. */
export function dateIn(iso, timeZone) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
}

// Booking slots arrive from GoHighLevel already in Winnipeg time, with their
// offset ('2026-11-13T11:00:00-05:00'), so their date and time are read
// straight from the text. Converting them through the device's time-zone data
// would show them an hour early wherever that data is out of date (Manitoba
// stopped changing its clocks on 2026-11-01). Anything without an offset is
// formatted in `timeZone` as usual.
const SLOT = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?[+-]\d{2}:\d{2}$/;

/** The calendar date of a booking slot, as 'YYYY-MM-DD'. */
export function slotDate(iso, timeZone) {
  const match = SLOT.exec(iso);
  return match ? match[1] : dateIn(iso, timeZone);
}

/** '11:00 am' style time of a booking slot. */
export function slotTime(iso, timeZone) {
  const match = SLOT.exec(iso);
  if (!match) return formatTime(iso, timeZone);
  const hour = Number(match[2]);
  return `${hour % 12 || 12}:${match[3]} ${hour < 12 ? 'am' : 'pm'}`;
}

export function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Weeks of a month, Sunday first, with null for the padding cells. */
export function monthGrid(year, month) {
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const cells = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth(year, month); day += 1) cells.push(ymd(year, month, day));
  while (cells.length % 7) cells.push(null);
  return cells;
}

export function shiftMonth({ year, month }, delta) {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}
