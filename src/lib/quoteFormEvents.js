// Lets other parts of the /free-quote page (the service cards) pre-tick a
// renovation type on the quote form. Kept out of the component file so React
// Fast Refresh keeps working on it during development.

export const PRESELECT_EVENT = 'quote-form:preselect';

export function preselectRenovationType(type) {
  window.dispatchEvent(new CustomEvent(PRESELECT_EVENT, { detail: type }));
}
