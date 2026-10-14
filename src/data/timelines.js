/*
 * Typical service timelines, the single source for every page that states
 * one (re-exported by facts.js). Kept free of imports so the service registry
 * (services.js), which siteConfig.js and facts.js depend on, can use it too.
 */

const NUMBER_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
];

// Numbers past twenty are written as numerals ('twenty-four' would need rules).
const inWords = (n) => NUMBER_WORDS[n] ?? String(n);

/**
 * A range of weeks in the forms the site writes it (stat cards use min and
 * max). Plain strings, read as properties: the cost guides that use them are
 * lazy chunks, and a function call in their data would stop the bundler from
 * leaving them out of the chunks that never read them.
 */
const weeks = (min, max) => {
  const words = `${inWords(min)} to ${inWords(max)} weeks`;
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
