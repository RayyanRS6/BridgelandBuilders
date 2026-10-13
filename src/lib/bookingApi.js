// Browser side of the /api/booking functions.
import { trackMetaStandard } from './analytics.js';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw Object.assign(new Error('network_error'), { code: 'network_error' });
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(data.error || 'request_failed'), {
      code: data.error || 'request_failed',
      status: response.status,
      fields: data.fields,
    });
  }
  return data;
}

export function fetchSlots(start, end, signal) {
  return request(`/api/booking/slots?start=${start}&end=${end}`, { signal });
}

export function saveLead(payload) {
  return request('/api/booking/lead', { method: 'POST', body: JSON.stringify(payload) });
}

export function bookSlot(payload) {
  return request('/api/booking/appointment', { method: 'POST', body: JSON.stringify(payload) });
}

/**
 * Reports a conversion to the Meta Pixel when one is installed on the page.
 * Without a pixel this does nothing, so the form works the same either way.
 * The pixel script itself loads after the page (index.html); until then the
 * event waits in the pixel's queue. `eventId` pairs it with the server copy.
 */
export function trackConversion(event, eventId) {
  trackMetaStandard(event, eventId);
}

/** utm_source from the landing URL (e.g. "facebook"), for lead attribution. */
export function utmSource() {
  if (typeof window === 'undefined') return undefined;
  return new URLSearchParams(window.location.search).get('utm_source') || undefined;
}
