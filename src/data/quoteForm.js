// The /free-quote form, defined once and shared by the page (labels, options)
// and the booking API (GoHighLevel field ids), so the two cannot drift apart.
//
// The questions mirror the GoHighLevel survey the site used before
// (AWCtvdzsDQtAdqsQyQYL). Each `fieldId` is that survey's custom field id, and
// each option is spelled exactly as GoHighLevel stores it, so leads from this
// form land in the same contact fields as leads from the old survey.
// If an option is renamed in GoHighLevel, rename it here too.
//
// Phone numbers are read against the country picked next to the field (Canada
// by default) and always sent to GoHighLevel in international E.164 form, e.g.
// +12045550123, so a number typed in its local format still reaches the right
// place.
//
// `tagPrefix`: every answer to that question is also added to the contact as a
// GoHighLevel tag, e.g. "renovation: kitchen". The prefix keeps each group
// together and unambiguous in the tag list; set it to '' to tag with the bare
// answer instead.
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const DEFAULT_PHONE_COUNTRY = 'CA';

/**
 * Reads a phone number typed for `country` (ISO code). A number typed with a
 * leading "+" carries its own country code, which wins over the picker.
 * Returns the parsed number when it is valid, otherwise null.
 */
export function parsePhone(value, country = DEFAULT_PHONE_COUNTRY) {
  const parsed = parsePhoneNumberFromString(String(value ?? ''), country);
  return parsed && parsed.isValid() ? parsed : null;
}

export const QUOTE_QUESTIONS = [
  {
    key: 'winnipeg',
    fieldId: '8yUbHmr0rJ50bP4jS61e',
    // The GoHighLevel field is "Are you from Winnipeg?"; the service area is
    // Winnipeg and the rest of Manitoba, so the question is asked that way.
    label: 'Is the project in Winnipeg or Manitoba?',
    options: ['Yes', 'No'],
    multiple: false,
  },
  {
    key: 'types',
    fieldId: 'wTWAtpBrbrKdMaQEhh2z',
    label: 'Type of renovation',
    hint: 'Pick all that apply',
    options: ['House', 'Kitchen', 'Bathroom', 'Basement', 'Whole Home Renovation', 'Commercial', 'Other'],
    multiple: true,
    tagPrefix: 'renovation',
  },
  // The old survey's "Renovation Timeline" (YljBtlZiMffwZI7ymHp6) and "Budget
  // Range" (tliHqkWdeMJVML7OLAFR) questions were dropped from this form on
  // request. To bring one back, re-add it here with its fieldId, options and a
  // tagPrefix — the form, validation, GoHighLevel fields and tags all follow.
];

// Service area. Every lead fills in the whole form and is saved to
// GoHighLevel either way, so no details are lost. Only a "Yes" then goes on to
// the calendar; anyone else is shown OUTSIDE_AREA_MESSAGE after submitting and
// carries OUTSIDE_AREA_TAG, so GoHighLevel workflows can leave them out of the
// normal follow-up.
export const SERVICE_AREA = { key: 'winnipeg', inArea: 'Yes' };
export const OUTSIDE_AREA_MESSAGE = 'Sorry — we’re not currently offering services outside Winnipeg and Manitoba.';
export const OUTSIDE_AREA_TAG = 'outside-service-area';

export const isInServiceArea = (lead) => lead[SERVICE_AREA.key] === SERVICE_AREA.inArea;

// The GoHighLevel calendar the second step books into — the same
// "Free 15-Minute Discovery Call" calendar used on /book-online.
export const BOOKING_CALENDAR = {
  id: 'RmkDQbRjI83ES3E4K5OA',
  name: 'Free Discovery Call',
  durationMinutes: 15,
  // Slots are fetched and shown in the business's own time zone, so a visitor
  // always sees the same times the crew does.
  timeZone: 'America/Winnipeg',
  timeZoneLabel: 'Winnipeg time',
};

// Tag added to every contact this form creates, so these leads can be filtered
// (and attributed to the ads) inside GoHighLevel.
export const LEAD_TAG = 'free-quote-page';
export const LEAD_SOURCE = 'Free Quote Page';

/**
 * Every tag a lead should carry: the page tag, one per answer for each
 * question that has a tagPrefix, and OUTSIDE_AREA_TAG when out of the service
 * area. GoHighLevel stores tags in lower case, so they are built that way here.
 */
export function tagsForLead(lead) {
  const tags = [LEAD_TAG];
  if (!isInServiceArea(lead)) tags.push(OUTSIDE_AREA_TAG);
  for (const question of QUOTE_QUESTIONS) {
    if (question.tagPrefix === undefined) continue;
    for (const answer of [].concat(lead[question.key] ?? [])) {
      tags.push((question.tagPrefix ? `${question.tagPrefix}: ${answer}` : answer).toLowerCase());
    }
  }
  return [...new Set(tags)];
}

/** Validates and normalises a submission. Returns { lead } or { errors }. */
export function validateLead(input = {}) {
  const errors = {};
  const text = (value, max = 120) => String(value ?? '').trim().slice(0, max);

  const name = text(input.name);
  const email = text(input.email, 160).toLowerCase();
  const phoneCountry = /^[A-Z]{2}$/.test(input.phoneCountry) ? input.phoneCountry : DEFAULT_PHONE_COUNTRY;
  const phone = parsePhone(text(input.phone, 40), phoneCountry);

  // The project address is needed for the free on-site visit. Postal code is
  // optional, and checked only loosely so out-of-area answers aren't blocked.
  const address = text(input.address, 160);
  const city = text(input.city, 80);
  const postalCode = text(input.postalCode, 12).toUpperCase();

  if (name.length < 2) errors.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Please enter a valid email address.';
  if (!phone) errors.phone = 'Please check the phone number and the country next to it.';
  if (address.length < 5) errors.address = 'Please enter the project’s street address.';
  if (city.length < 2) errors.city = 'Please enter the city or town.';
  if (postalCode && !/^[A-Z0-9][A-Z0-9 -]{2,10}$/.test(postalCode)) errors.postalCode = 'Please check the postal code.';

  const answers = {};
  for (const question of QUOTE_QUESTIONS) {
    const raw = input[question.key];
    if (question.multiple) {
      const picked = (Array.isArray(raw) ? raw : []).filter((option) => question.options.includes(option));
      if (!picked.length) errors[question.key] = 'Please choose at least one.';
      answers[question.key] = [...new Set(picked)];
    } else {
      if (!question.options.includes(raw)) errors[question.key] = 'Please choose one.';
      answers[question.key] = raw;
    }
  }

  if (Object.keys(errors).length) return { errors };

  // E.164 (no extension), which GoHighLevel can call and text.
  return { lead: { name, email, phone: phone.number, address, city, postalCode, ...answers } };
}
