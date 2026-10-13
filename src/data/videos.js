import { SITE_URL } from './siteConfig.js';
import { buildVideoObject } from './seo.js';

/**
 * Video watch pages at /videos/<slug> (VideoPage.jsx, plan §13). Real footage
 * of Bridgeland jobs only, published on the business's YouTube channel. Empty
 * until there is footage — and the privacy policy must mention YouTube before
 * the first entry is published (plan §18).
 *
 * The page shows a YouTubeFacade: a thumbnail button that loads the
 * youtube-nocookie player only when clicked, so no YouTube script runs before
 * then. Prefer a self-hosted `thumbnail`; without one the facade falls back to
 * the i.ytimg.com image.
 *
 * ENTRY SHAPE
 *   {
 *     slug: 'river-heights-kitchen-before-after-2027',
 *     published: false,
 *     youtubeId: 'xxxxxxxxxxx',
 *     seo: { title, description, updated: 'YYYY-MM-DD' },      // usePageSeo `meta`
 *     title: 'Kitchen renovation in River Heights, Winnipeg — before & after (2027)',
 *     description: 'what the video shows (also the VideoObject description)',
 *     thumbnail: '/images/videos/<slug>-1280.jpg',   // self-hosted, 16:9; required for VideoObject
 *     uploadDate: '2027-03-01',                      // YYYY-MM-DD (or full ISO), as on YouTube
 *     duration: 'PT1M45S',                           // ISO 8601
 *     chapters?: [{ time: '0:00', label: 'Before' }],
 *     transcript: [RichBody blocks],                 // en-CA, checked against the captions
 *     service?: '/services/kitchen-renovations',
 *     caseStudy?: 'river-heights-kitchen-renovation-2027',
 *     ownerSignoff: { name, role, date },
 *   }
 */
export const VIDEOS = [];

export const videoPath = (video) => `/videos/${video.slug}`;

/** Published videos, newest first. */
export function publishedVideos() {
  return VIDEOS.filter((video) => video.published && video.youtubeId).sort((a, b) =>
    String(b.uploadDate || '').localeCompare(String(a.uploadDate || ''))
  );
}

/** A published video by slug, or null. */
export function videoBySlug(slug) {
  return publishedVideos().find((video) => video.slug === slug) || null;
}

const absolute = (url) => (url && !/^https?:\/\//.test(url) ? `${SITE_URL}${url}` : url);

/**
 * VideoObject for a watch page — the only place VideoObject is allowed (plan
 * §3.5), built with seo.js buildVideoObject.
 */
export function buildVideoNode(video) {
  if (!video) return null;
  return buildVideoObject({
    path: videoPath(video),
    name: video.title,
    description: video.description,
    thumbnailUrl: absolute(video.thumbnail) || `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
    uploadDate: video.uploadDate,
    duration: video.duration,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
  });
}

/**
 * usePageSeo / resolvePageSeo options for a watch page. VideoPage and the
 * prerender (head.js) must both use this. The breadcrumb comes from seo.js
 * trailFor() (Home › <seo title>).
 */
export function videoSeoOptions(video) {
  return {
    meta: video.seo,
    nodes: [buildVideoNode(video)],
    image: video.thumbnail,
  };
}
