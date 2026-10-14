import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import RichBody from '../components/RichBody.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import YouTubeFacade from '../components/YouTubeFacade.jsx';
import { formatPostDate } from '../components/BlogCard.jsx';
import { CalendarIcon, ClockIcon } from '../components/icons.jsx';
import { caseStudyBySlug, caseStudyPath } from '../data/caseStudies.js';
import { serviceByPath } from '../data/services.js';
import { trailFor } from '../data/trails.js';
import { videoBySlug, videoPath, videoSeoOptions } from '../data/videos.js';
import { usePageSeo } from '../hooks/useSeo.js';
import { lazyWithRetry } from '../lib/lazyRetry.js';

// Never rendered for a published video, so it is not modulepreloaded with it.
const NotFoundPage = lazyWithRetry(() => import('./NotFoundPage.jsx'));

/** 'PT1M45S' → '1 min 45 sec'. */
function formatDuration(iso) {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || '');
  if (!match) return '';
  const [, hours, minutes, seconds] = match;
  return [hours && `${Number(hours)} hr`, minutes && `${Number(minutes)} min`, seconds && `${Number(seconds)} sec`]
    .filter(Boolean)
    .join(' ');
}

/**
 * A video watch page at /videos/<slug> (plan §13): the video behind a
 * YouTubeFacade (no YouTube script until the visitor presses play), its
 * chapters and full transcript, and the VideoObject node — the only page type
 * allowed to carry one. Only published entries in videos.js render.
 */
export default function VideoPage() {
  const { slug } = useParams();
  const video = videoBySlug(slug);
  return video ? <VideoView video={video} /> : <NotFoundPage />;
}

function VideoView({ video }) {
  const path = videoPath(video);
  const seo = video.seo || {};
  const service = video.service ? serviceByPath(video.service) : null;
  const study = video.caseStudy ? caseStudyBySlug(video.caseStudy) : null;
  const signoff = video.ownerSignoff || null;
  const uploaded = video.uploadDate ? String(video.uploadDate).slice(0, 10) : null;
  const duration = formatDuration(video.duration);

  // Visible breadcrumb = schema breadcrumb (seo.js trailFor: Home › <title>).
  const trail = useMemo(() => trailFor(path, seo.title), [path, seo.title]);
  const crumb = trail.length ? trail[trail.length - 1][0] : video.title;

  // Same options head.js passes (VideoObject included).
  usePageSeo(path, videoSeoOptions(video));

  return (
    <main>
      <section className="page-hero blog-post-hero">
        <div className="container">
          <div className="page-hero-card hero-rise">
            <nav className="blog-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{crumb}</span>
            </nav>
            <span className="section-tag">Video</span>
            <h1>{video.title}</h1>
            <p>{video.description}</p>
            {(uploaded || duration) && (
              <div className="blog-post-meta">
                {uploaded && (
                  <span className="blog-meta-item">
                    <CalendarIcon size={15} /> <time dateTime={video.uploadDate}>{formatPostDate(uploaded)}</time>
                  </span>
                )}
                {duration && (
                  <span className="blog-meta-item">
                    <ClockIcon size={15} /> {duration}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <article className="blog-article-section">
        <div className="container blog-article-container">
          <div className="blog-article-body">
            <YouTubeFacade videoId={video.youtubeId} title={video.title} thumbnail={video.thumbnail} />

            {video.chapters && video.chapters.length > 0 && (
              <>
                <h2>Chapters</h2>
                <ul className="blog-list">
                  {video.chapters.map((chapter) => (
                    <li key={chapter.time}>
                      <strong>{chapter.time}</strong> {chapter.label}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {video.transcript && video.transcript.length > 0 && (
              <>
                <h2>Transcript</h2>
                <RichBody blocks={video.transcript} />
              </>
            )}

            {(study || service) && (
              <>
                <h2>More about this project</h2>
                <ul className="blog-list">
                  {study && (
                    <li>
                      <Link className="blog-inline-link" to={caseStudyPath(study)}>{study.title}</Link>: the full case
                      study, with photos.
                    </li>
                  )}
                  {service && (
                    <li>
                      <Link className="blog-inline-link" to={service.path}>{service.label}</Link>: what the service
                      includes and how to book a visit.
                    </li>
                  )}
                </ul>
              </>
            )}

            {signoff && (
              <p className="tpl-meta">
                Reviewed by {signoff.name}
                {signoff.role ? `, ${signoff.role}` : ''}
                {signoff.date ? ` · ${formatPostDate(signoff.date)}` : ''}
              </p>
            )}
          </div>
        </div>
      </article>

      <CtaBanner />
    </main>
  );
}
