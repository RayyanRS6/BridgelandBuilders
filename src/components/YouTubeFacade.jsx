import { useState } from 'react';

const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,20}$/;

/**
 * A lightweight YouTube embed: a thumbnail button until the visitor clicks
 * it, then the youtube-nocookie player (autoplaying, since they asked for it).
 * No YouTube script, frame or cookie loads before the click; the only request
 * before then is the thumbnail — pass a self-hosted `thumbnail` to avoid even
 * that, otherwise the i.ytimg.com image is used.
 *
 * @param {string} videoId    YouTube video id
 * @param {string} title      video title (button label and iframe title)
 * @param {string} [thumbnail]   self-hosted 16:9 poster image
 * @param {string} [thumbnailSrcSet]
 * @param {number} [start]    start time in seconds
 * @param {string} [cta]      data-cta id for analytics (default 'video_play')
 */
export default function YouTubeFacade({ videoId, title, thumbnail, thumbnailSrcSet, start, cta = 'video_play' }) {
  const [playing, setPlaying] = useState(false);
  if (!videoId || !YOUTUBE_ID.test(videoId)) return null;

  const params = new URLSearchParams({ autoplay: '1', rel: '0' });
  if (start) params.set('start', String(Math.floor(start)));
  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
  const poster = thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}${start ? `&t=${Math.floor(start)}s` : ''}`;

  return (
    <>
      <div className="yt-facade">
        {playing ? (
          <iframe
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="yt-facade-button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            data-cta={cta}
          >
            <img
              src={poster}
              srcSet={thumbnail ? thumbnailSrcSet : undefined}
              sizes={thumbnail && thumbnailSrcSet ? '(max-width: 920px) 100vw, 880px' : undefined}
              alt=""
              width="1280"
              height="720"
              loading="lazy"
              decoding="async"
            />
            <span className="yt-facade-play" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" focusable="false">
                <path d="M8 5.5v13l10.5-6.5L8 5.5z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <p className="yt-facade-caption">
        Video doesn’t play?{' '}
        <a className="blog-inline-link" href={watchUrl} target="_blank" rel="noopener noreferrer">
          Watch it on YouTube
        </a>
        .
      </p>
    </>
  );
}
