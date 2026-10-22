import { useEffect, useRef, useState } from 'react';
import { WELCOME_VIDEO } from '../data/welcomeVideo.generated.js';
import { track } from '../lib/analytics.js';
import { announceAudio, onAudioAnnounced, OWN_AUDIO_ATTR } from '../lib/audioFocus.js';
import Picture from './Picture.jsx';
import { PauseIcon } from './icons.jsx';

// The poster is the home page's LCP image (the video's first frame, from
// scripts/build-images.mjs --only=video); scripts/prerender.mjs turns its
// AVIF <source> into the image preload. The arch frame shows it with
// object-fit: cover at up to 330px wide on phones, 400px on tablets and 460px
// on desktop.
const POSTER = WELCOME_VIDEO.poster;
const POSTER_SIZES = '(max-width: 640px) 330px, (max-width: 1024px) 400px, 460px';

// Phones and tablets get the smaller encodes (the frame is at most 400px wide
// there). Chosen once, when the video loads.
const PHONE_QUERY = '(max-width: 1024px)';

// No person is named: who speaks in the video is not confirmed on the site.
const VIDEO_LABEL = 'Welcome video from Bridgeland Builders';

// Captions: once the owner sends the script, save it as WebVTT under
// public/videos/ with a hashed name (/videos/ is cached for a year) and set
// e.g. { src: '/videos/welcome.en.<hash8>.vtt', srcLang: 'en', label: 'English' }.
// The <track> is only rendered when this is set.
const CAPTIONS = null;

// The button icons live here, not in icons.jsx: that module ships with every
// page (navbar, footer), and only the home page needs these.
function PlayIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4.5v15l12.5-7.5L7 4.5z" />
    </svg>
  );
}

function SoundIcon({ size = 16, on }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" strokeLinejoin="round" />
      {on ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="M16 9l6 6M22 9l-6 6" />}
    </svg>
  );
}

// Connections too slow for a 1.25 to 2.8 MB download the visitor did not ask
// for (navigator.connection.effectiveType; Chrome and Android only).
const SLOW_CONNECTIONS = ['slow-2g', '2g', '3g'];

/**
 * Muted autoplay is skipped for reduced motion, Data Saver and slow
 * connections: the visitor gets a play button instead.
 */
function mayAutoplay() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  } catch {
    // No matchMedia: autoplay as usual.
  }
  const connection = navigator.connection;
  return !(connection && (connection.saveData || SLOW_CONNECTIONS.includes(connection.effectiveType)));
}

/** Runs `callback` after the window's load event and an idle moment; returns a cancel function. */
function afterLoadAndIdle(callback) {
  let idle = 0;
  const schedule = () => {
    idle = window.requestIdleCallback
      ? window.requestIdleCallback(callback, { timeout: 4000 })
      : window.setTimeout(callback, 1500);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
  return () => {
    window.removeEventListener('load', schedule);
    if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
    else window.clearTimeout(idle);
  };
}

/**
 * The welcome video in the home hero's arch frame.
 *
 * The prerendered page has only the poster and an empty, muted <video>: no
 * video bytes load before the page's load event. After it (and an idle
 * moment), once the hero is on screen, the sources go in and the video plays
 * muted, on a loop, fading in over the poster once it is actually playing.
 * With reduced motion, Data Saver or a slow connection, or where the browser
 * refuses muted autoplay, the poster stays with a "Play welcome video"
 * button, which plays it with sound.
 *
 * "Play with sound" restarts the welcome from the beginning (the first time,
 * and again after a full listen) and pauses the background music
 * (src/lib/audioFocus.js); starting the music mutes the video. When the
 * welcome has played through with sound, the video goes back to its muted
 * loop. The pause button covers WCAG 2.2.2 (moving content that plays for
 * more than five seconds).
 */
export default function HeroVideo() {
  const videoRef = useRef(null);
  // The encodes for this screen; null until the page has loaded (and, for
  // the muted loop, until the hero is on screen).
  const [sources, setSources] = useState(null);
  // 'idle' (poster only), 'manual' (a play button), 'muted' or 'sound'.
  const [mode, setMode] = useState('idle');
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(true);
  const autoplayRef = useRef(false);
  // From the moment the sound is turned on until that pass of the video
  // ends, so muting and unmuting again carries on instead of restarting.
  const soundRunRef = useRef(false);
  // The visitor paused the video: it is not started again by scrolling back.
  const userPausedRef = useRef(false);
  const controlsRef = useRef(null);
  // Set when the buttons change under the keyboard focus (see onEnded).
  const refocusRef = useRef(false);

  useEffect(() => {
    let observer = null;
    const cancel = afterLoadAndIdle(() => {
      autoplayRef.current = mayAutoplay();
      const choose = () => setSources(window.matchMedia(PHONE_QUERY).matches ? WELCOME_VIDEO.phone : WELCOME_VIDEO.desktop);
      // The muted loop waits until the hero is on screen, so nothing
      // downloads for a visitor who has already scrolled past it.
      if (!autoplayRef.current || !videoRef.current || !('IntersectionObserver' in window)) {
        choose();
        return;
      }
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        choose();
      });
      observer.observe(videoRef.current);
    });
    return () => {
      cancel();
      if (observer) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!sources || !video) return undefined;
    // Set once the hero unmounts (the visitor left the page): a play() still
    // pending is then rejected, and must not be retried on a removed video.
    let cancelled = false;
    // A page opened in a background tab: Chrome refuses to play a muted
    // video there (AbortError, "paused to save power"), so the loop starts
    // when the tab is shown.
    let retried = false;
    const start = () => {
      if (cancelled || document.visibilityState === 'hidden') return;
      document.removeEventListener('visibilitychange', start);
      video.play().then(
        () => {
          if (!cancelled) setMode('muted');
        },
        (error) => {
          if (cancelled || !video.isConnected) return;
          const name = error && error.name;
          if (name === 'AbortError' && (document.visibilityState === 'hidden' || !retried)) {
            retried = true;
            document.addEventListener('visibilitychange', start);
            start();
          } else {
            // No playable source: the poster stays, without controls.
            setMode(name === 'NotSupportedError' ? 'idle' : 'manual');
          }
        }
      );
    };
    const stop = () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', start);
      video.pause();
      // Already out of the page: drop the sources so the rest of the file is
      // not downloaded on top of the next page (e.g. the estimator).
      if (!video.isConnected) {
        video.querySelectorAll('source, track').forEach((child) => child.remove());
        video.load();
      }
    };

    // No video.load() here: the <source>s going in start the source
    // selection by themselves, and an explicit load() makes Chrome ignore
    // preload="none" and buffer most of the file, which the play-button path
    // (Data Saver, slow connections) must not do. play() starts the download.
    if (!autoplayRef.current) {
      setMode('manual');
      return stop;
    }
    video.muted = true;
    video.loop = true;
    document.addEventListener('visibilitychange', start);
    start();
    return stop;
  }, [sources]);

  // Puts the keyboard focus on the first button when the button it was on
  // has gone (the focus then falls back to the page).
  useEffect(() => {
    if (!refocusRef.current || !controlsRef.current) return;
    refocusRef.current = false;
    const first = controlsRef.current.querySelector('button');
    const focused = document.activeElement;
    if (first && (!focused || focused === document.body)) first.focus();
  }, [mode]);

  // Sound off. The playback carries on muted to the end of this pass (then
  // onEnded restarts the muted loop), so turning the sound back on continues
  // where it was. `announce` is false when the music caused it.
  const mute = (announce = true) => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    setMode('muted');
    if (announce) announceAudio('voice', false);
  };

  // The music started: the voice steps back.
  useEffect(
    () =>
      onAudioAnnounced(({ source, playing }) => {
        if (source === 'music' && playing && videoRef.current && !videoRef.current.muted) mute(false);
      }),
    // mute() only uses refs and state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // The muted loop pauses while the hero is off screen, so it does no
  // decoding work while the visitor reads on.
  useEffect(() => {
    const video = videoRef.current;
    if (mode !== 'muted' || !autoplayRef.current || !video || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (userPausedRef.current) return;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [mode]);

  const playWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    // The music pauses first, so the two never overlap.
    announceAudio('voice', true);
    if (!soundRunRef.current) {
      soundRunRef.current = true;
      video.currentTime = 0;
    }
    userPausedRef.current = false;
    video.loop = false;
    video.muted = false;
    setMode('sound');
    track('video_sound_on', { video_title: 'welcome', link_location: 'hero' });
    video.play().catch(() => {
      soundRunRef.current = false;
      video.loop = autoplayRef.current;
      mute();
    });
  };

  const togglePause = () => {
    const video = videoRef.current;
    if (!video) return;
    userPausedRef.current = !video.paused;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  // Only a playback with sound (or a manual one) ends: the muted loop never does.
  const onEnded = () => {
    const video = videoRef.current;
    const hadSound = !video.muted;
    soundRunRef.current = false;
    if (autoplayRef.current) {
      video.muted = true;
      video.loop = true;
      video.play().catch(() => {});
      setMode('muted');
    } else {
      // Back to the poster and its play button (muted again, so the music
      // coming back does not take it for a voice that is still playing). The
      // pause button goes, so a keyboard focus on it moves to the play button.
      refocusRef.current = Boolean(controlsRef.current && controlsRef.current.contains(document.activeElement));
      video.muted = true;
      setVisible(false);
      video.currentTime = 0;
      setMode('manual');
    }
    if (hadSound) announceAudio('voice', false);
  };

  let controls = null;
  if (mode === 'manual') {
    controls = (
      <button type="button" className="hero-video-btn" onClick={playWithSound}>
        <PlayIcon size={14} />
        <span>Play welcome video</span>
      </button>
    );
  } else if (mode === 'muted' || mode === 'sound') {
    const withSound = mode === 'sound';
    controls = (
      <>
        <button type="button" className="hero-video-btn" onClick={withSound ? () => mute() : playWithSound}>
          {/* The icon shows what the button does: sound on, or mute. */}
          <SoundIcon on={!withSound} />
          <span>{withSound ? 'Mute' : 'Play with sound'}</span>
        </button>
        <button
          type="button"
          className="hero-video-btn hero-video-btn-icon"
          onClick={togglePause}
          aria-label={paused ? 'Play video' : 'Pause video'}
        >
          {paused ? <PlayIcon size={14} /> : <PauseIcon size={14} />}
        </button>
      </>
    );
  }

  return (
    <>
      {/* The same frame as the video under it, so no alt: the video carries the label. */}
      <Picture
        avifSrcSet={POSTER.avifSrcSet}
        srcSet={POSTER.srcSet}
        sizes={POSTER_SIZES}
        src={POSTER.src}
        alt=""
        width={POSTER.width}
        height={POSTER.height}
        className="hero-video-poster"
        fetchpriority="high"
      />
      <video
        ref={videoRef}
        className={`hero-video${visible ? ' is-visible' : ''}`}
        aria-label={VIDEO_LABEL}
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => setVisible(true)}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onEnded={onEnded}
      >
        {sources && sources.map((source) => <source key={source.src} src={source.src} type={source.type} />)}
        {sources && CAPTIONS && <track kind="captions" src={CAPTIONS.src} srcLang={CAPTIONS.srcLang} label={CAPTIONS.label} />}
      </video>
      {/* Taps here must not start the background music (MusicToggle). */}
      {controls && (
        <div ref={controlsRef} className="hero-video-controls" {...{ [OWN_AUDIO_ATTR]: '' }}>
          {controls}
        </div>
      )}
    </>
  );
}
