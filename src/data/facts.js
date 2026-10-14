// One fact, one value (SEO plan §12). Every page, data file and generated file
// that states a business fact (phone, office hours, reply time, experience,
// project count, typical timelines) reads it from here, so a change is made in
// one place. Identity and contact values live in siteConfig.js and are
// re-exported below; BUSINESS carries the description and the tagline (slogan).
//
// Blog posts (blog-raw/*.json) are written content and keep their own wording.
// The SEO audit flags any page or post whose timeline for a service disagrees
// with TIMELINES below ('facts.timeline-drift').
import { BUSINESS_HOURS } from './siteConfig.js';

export {
  BUSINESS,
  BUSINESS_HOURS,
  CATEGORY_LINE,
  REVIEW_STATS,
  SERVICE_AREA_NAMES,
  SERVICE_AREA_STATEMENT,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE,
  SITE_PHONE_E164,
  SITE_PHONE_TEL,
} from './siteConfig.js';

// Confirmed by the owner 2026-10-13 (O-2). Shown as "over 60 years of
// combined experience" / "60+" and "more than 100 completed projects" / "100+".
export const EXPERIENCE_YEARS = 60;
export const PROJECT_COUNT = 100;

/** How soon we answer a request, as in "We reply within one business day". */
export const REPLY_TIME = 'one business day';

/* ------------------------------------------------------------ office hours */
const daySpan = (days) => (days.length > 1 ? `${days[0]} to ${days[days.length - 1]}` : days[0]);
const hourOf = (time) => String(time).split(':').map(Number);

/** '16:30' -> '4:30' (12-hour clock, no a.m./p.m.). */
function shortClock(time) {
  const [hours, minutes] = hourOf(time);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')}`;
}

/** '16:30' -> '4:30 p.m.'; `space` goes between the time and a.m./p.m. */
function clock(time, space) {
  return `${shortClock(time)}${space}${hourOf(time)[0] < 12 ? 'a.m.' : 'p.m.'}`;
}

/**
 * "Monday to Friday, 8:30 a.m. to 4:30 p.m." from BUSINESS_HOURS (the schema's
 * hours). Pass '\u00a0' as `space` to keep "a.m." from wrapping away from its time.
 */
export const officeHoursText = (space = ' ') =>
  BUSINESS_HOURS.map(({ days, opens, closes }) => `${daySpan(days)}, ${clock(opens, space)} to ${clock(closes, space)}`).join('; ');

export const OFFICE_HOURS_TEXT = officeHoursText();

/** "Monday to Friday from 8:30 to 4:30": the shorter form in FAQ answers. */
export const OFFICE_HOURS_SHORT = BUSINESS_HOURS.map(
  ({ days, opens, closes }) => `${daySpan(days)} from ${shortClock(opens)} to ${shortClock(closes)}`
).join('; ');

/** "Monday to Friday": the days the office is open. */
export const OFFICE_DAYS_TEXT = BUSINESS_HOURS.map(({ days }) => daySpan(days)).join(' and ');

/* --------------------------------------------------------------- timelines */
const NUMBER_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
];

/**
 * A range of weeks in the forms the site writes it (stat cards use min and
 * max). Plain strings, read as properties: the cost guides that use them are
 * lazy chunks, and a function call in their data would stop the bundler from
 * leaving them out of the chunks that never read them.
 */
const weeks = (min, max) => {
  const words = `${NUMBER_WORDS[min]} to ${NUMBER_WORDS[max]} weeks`;
  return {
    min,
    max,
    /** '2–3 weeks' (en dash) */
    short: `${min}–${max} weeks`,
    /** 'two to three weeks' */
    words,
    /** 'Two to three weeks', for an answer that opens with it */
    wordsCapitalized: `${words.charAt(0).toUpperCase()}${words.slice(1)}`,
  };
};

// Typical time on site per service, owner-confirmed. The schedule in each
// client's written quote is the one that applies. Kitchens are counted once
// the cabinets are on site; additions once permits and materials are ready.
export const TIMELINES = {
  bathroom: weeks(2, 3),
  kitchen: weeks(4, 6),
  basement: weeks(4, 8),
  wholeHome: weeks(8, 16),
  addition: weeks(8, 16),
};
