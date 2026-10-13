// Lead validation for the quote/booking form, shared by the browser and the
// booking API (api/booking/*.js), so both apply exactly the same rules.
//
// Kept apart from src/data/quoteForm.js because it needs libphonenumber-js
// (~35 KB compressed with its metadata): the form loads this module lazily,
// on first focus or when the browser is idle, and the server imports it
// directly. quoteForm.js stays plain data that any page can import cheaply.
//
// Phone numbers are read against the country picked next to the field (Canada
// by default) and always returned in international E.164 form, e.g.
// +12045550123, so a number typed in its local format still reaches the right
// place in GoHighLevel.
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { DEFAULT_PHONE_COUNTRY, QUOTE_QUESTIONS } from './quoteForm.js';

/**
 * Reads a phone number typed for `country` (ISO code). A number typed with a
 * leading "+" carries its own country code, which wins over the picker.
 * Returns the parsed number when it is valid, otherwise null.
 */
export function parsePhone(value, country = DEFAULT_PHONE_COUNTRY) {
  const parsed = parsePhoneNumberFromString(String(value ?? ''), country);
  return parsed && parsed.isValid() ? parsed : null;
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
