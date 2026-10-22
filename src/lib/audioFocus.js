// The home page has two things that can make sound: the background music
// (src/components/MusicToggle.jsx) and the welcome video's voice in the hero
// (src/components/HeroVideo.jsx). They must never play together, so each one
// announces here when it starts or stops making sound and the other steps
// back. A window event keeps the two components independent of each other.

const EVENT = 'bb:audio-focus';

/**
 * Taps inside an element with this attribute never start the background
 * music by themselves (MusicToggle starts it on the visitor's first gesture):
 * the element controls a sound of its own.
 */
export const OWN_AUDIO_ATTR = 'data-own-audio';

/**
 * Tells the other sound source that `source` ('music' or 'voice') started
 * (`playing` true) or stopped making sound. Does nothing on the server.
 */
export function announceAudio(source, playing) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { source, playing } }));
}

/** Calls `listener({ source, playing })` for each announcement; returns the unsubscribe function. */
export function onAudioAnnounced(listener) {
  const handler = (event) => listener(event.detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
