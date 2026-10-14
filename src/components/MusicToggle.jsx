import { useEffect, useRef, useState } from 'react';
import { MusicIcon, PauseIcon } from './icons.jsx';

// Compressed from the client's 320 kbps original to 128 kbps (3.5 MB).
const MUSIC_SRC = '/audio/home-music.mp3';

// The music starts quiet and rises to background level.
const START_VOLUME = 0.02;
const TARGET_VOLUME = 0.5;
const FADE_IN_SECONDS = 10;

// Set when the visitor pauses, so the music does not start again by itself
// each time they come back to the home page during the same visit.
const PAUSED_KEY = 'bb-home-music-paused';

// Input that counts as a user gesture, which is what lets a page play sound.
// A mouse counts on press; a finger or pen only on release (a touch that
// turns into a scroll does not count).
const GESTURE_EVENTS = ['pointerdown', 'pointerup', 'touchend', 'keydown'];

function allowsSound(event) {
  if (event.type === 'pointerdown') return event.pointerType === 'mouse';
  if (event.type === 'pointerup') return event.pointerType !== 'mouse';
  return true;
}

function visitorPaused() {
  try {
    return sessionStorage.getItem(PAUSED_KEY) === '1';
  } catch {
    return false;
  }
}

function rememberPaused(paused) {
  try {
    if (paused) sessionStorage.setItem(PAUSED_KEY, '1');
    else sessionStorage.removeItem(PAUSED_KEY);
  } catch {
    // Storage blocked (private mode): the music may simply start again.
  }
}

/**
 * Background music for the home page only, with a pause button.
 *
 * It tries to start as soon as the page opens. Browsers only allow that once
 * the visitor has interacted with the site (Chrome and Edge also allow it for
 * returning visitors), so where it is blocked (most first visits, and every
 * phone) it starts on the visitor's first tap, click or key press instead.
 *
 * Leaving the page unmounts the player, which stops the music, so it never
 * plays on a page that has no button to turn it off.
 *
 * Deliberately no data-cta: that reports the click to analytics as a lead CTA.
 */
export default function MusicToggle() {
  const audioRef = useRef(null);
  const buttonRef = useRef(null);
  // Web Audio context and gain node, built the first time the music starts.
  const graphRef = useRef(null);
  // Fallback fade for browsers without Web Audio.
  const fadeTimerRef = useRef(0);
  // Removes the first-gesture listeners once the music is playing.
  const stopWaitingRef = useRef(() => {});
  const [isPlaying, setIsPlaying] = useState(false);

  // iPhones ignore audio.volume, so the fade runs through a Web Audio gain
  // node wherever that exists, and steps audio.volume elsewhere.
  const getGraph = () => {
    if (graphRef.current !== null) return graphRef.current;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      const gain = ctx.createGain();
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(gain);
      gain.connect(ctx.destination);
      graphRef.current = { ctx, gain };
    } catch {
      graphRef.current = false;
    }
    return graphRef.current;
  };

  // Must run inside the gesture handler (or after autoplay was allowed), as
  // that is the only time an AudioContext is allowed to start.
  const fadeIn = () => {
    const audio = audioRef.current;
    window.clearInterval(fadeTimerRef.current);
    const graph = getGraph();

    if (graph) {
      const { ctx, gain } = graph;
      audio.volume = 1;
      if (ctx.state !== 'running') ctx.resume().catch(() => {});
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(START_VOLUME, now);
      gain.gain.exponentialRampToValueAtTime(TARGET_VOLUME, now + FADE_IN_SECONDS);
      return;
    }

    audio.volume = START_VOLUME;
    const startedAt = performance.now();
    fadeTimerRef.current = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / (FADE_IN_SECONDS * 1000));
      audio.volume = START_VOLUME * (TARGET_VOLUME / START_VOLUME) ** progress;
      if (progress === 1) window.clearInterval(fadeTimerRef.current);
    }, 100);
  };

  const startMusic = () => {
    fadeIn();
    return audioRef.current.play().then(
      () => true,
      () => false
    );
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    let active = true;
    let starting = false;

    const onGesture = (event) => {
      // The music button handles its own taps.
      if (starting || !allowsSound(event) || buttonRef.current?.contains(event.target)) return;
      starting = true;
      startMusic().then(() => {
        starting = false;
      });
    };
    const stopWaiting = () => {
      GESTURE_EVENTS.forEach((type) => document.removeEventListener(type, onGesture, true));
    };
    stopWaitingRef.current = stopWaiting;

    if (!visitorPaused()) {
      // Try straight away, at the starting volume, before any AudioContext
      // exists (creating one now would only log a warning where it is blocked).
      audio.volume = START_VOLUME;
      audio.play().then(
        () => {
          if (active) fadeIn();
        },
        () => {
          if (active) {
            GESTURE_EVENTS.forEach((type) => document.addEventListener(type, onGesture, true));
          }
        }
      );
    }

    return () => {
      active = false;
      stopWaiting();
      window.clearInterval(fadeTimerRef.current);
      audio.pause();
      if (graphRef.current) graphRef.current.ctx.close().catch(() => {});
    };
    // Runs once per visit to the home page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      rememberPaused(false);
      startMusic();
    } else {
      rememberPaused(true);
      audio.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        preload="none"
        loop
        onPlay={() => {
          stopWaitingRef.current();
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
      />
      <button
        ref={buttonRef}
        type="button"
        className={`music-toggle${isPlaying ? ' is-playing' : ''}`}
        onClick={toggleMusic}
      >
        {isPlaying ? <PauseIcon size={14} /> : <MusicIcon size={16} />}
        <span>{isPlaying ? 'Pause music' : 'Play music'}</span>
      </button>
    </>
  );
}
