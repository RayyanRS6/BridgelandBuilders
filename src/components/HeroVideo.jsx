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

/** Muted autoplay is skipped for reduced motion and Data Saver: the visitor gets a play button instead. */
function mayAutoplay() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  } catch {
    // No matchMedia: autoplay as usual.
  }
  return !(navigator.connection && navigator.connection.saveData);
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
 * moment) the sources go in and the video plays muted, on a loop, fading in
 * over the poster once it is actually playing. With reduced motion or Data
 * Saver, or where the browser refuses muted autoplay, the poster stays with a
 * "Play welcome video" button, which plays it with sound.
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
  // The encodes for this screen; null until the page has loaded.
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

  useEffect(
    () =>
      afterLoadAndIdle(() => {
        autoplayRef.current = mayAutoplay();
        setSources(window.matchMedia(PHONE_QUERY).matches ? WELCOME_VIDEO.phone : WELCOME_VIDEO.desktop);
      }),
    []
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!sources || !video) return undefined;
    video.load();
    if (!autoplayRef.current) {
      setMode('manual');
      return undefined;
    }
    video.muted = true;
    video.loop = true;
    // A page opened in a background tab: Chrome refuses to play a muted
    // video there (AbortError, "paused to save power"), so the loop starts
    // when the tab is shown.
    let retried = false;
    const start = () => {
      if (document.visibilityState === 'hidden') return;
      document.removeEventListener('visibilitychange', start);
      video.play().then(
        () => setMode('muted'),
        (error) => {
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
    document.addEventListener('visibilitychange', start);
    start();
    return () => document.removeEventListener('visibilitychange', start);
  }, [sources]);

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
      // coming back does not take it for a voice that is still playing).
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
        <div className="hero-video-controls" {...{ [OWN_AUDIO_ATTR]: '' }}>
          {controls}
        </div>
      )}
    </>
  );
}
