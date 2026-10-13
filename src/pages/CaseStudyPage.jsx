import { Fragment, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import RichBody from '../components/RichBody.jsx';
import Process from '../components/Process.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import YouTubeFacade from '../components/YouTubeFacade.jsx';
import { formatPostDate } from '../components/BlogCard.jsx';
import { ArrowRightIcon, CalendarIcon, PinIcon } from '../components/icons.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import {
  caseStudyBySlug,
  caseStudyCover,
  caseStudyPath,
  caseStudySeoOptions,
  caseStudiesForService,
} from '../data/caseStudies.js';
import { trailFor } from '../data/seo.js';
import { publishedServiceArea } from '../data/serviceAreasContent.js';
import { serviceByPath } from '../data/services.js';
import { videoBySlug, videoPath } from '../data/videos.js';
import { usePageSeo } from '../hooks/useSeo.js';

const STAGE_LABELS = { before: 'Before', during: 'During', after: 'After' };
const CARD_SIZES = '(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 400px';
const GALLERY_SIZES = '(max-width: 768px) 100vw, 420px';

/** 'YYYY-MM' → 'May 2027'. */
export function formatMonth(value) {
  if (!value) return '';
  const [year, month] = String(value).split('-');
  if (!month) return year;
  return new Date(`${year}-${month}-01T00:00:00`).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' });
}

/** 'River Heights, Winnipeg' or 'Winnipeg'. */
export function caseStudyLocation(study) {
  const area = study.area || {};
  return [area.neighbourhood, area.community].filter(Boolean).join(', ');
}

/** Case study card in the blog card style (used here, on community pages and later on /projects). */
export function CaseStudyCard({ study }) {
  const path = caseStudyPath(study);
  const service = serviceByPath(study.service);
  const cover = caseStudyCover(study);
  return (
    <article className="blog-card">
      {cover && (
        <Link className="blog-card-media" to={path} tabIndex={-1} aria-hidden="true">
          <img
            src={cover.src}
            srcSet={cover.srcSet}
            sizes={cover.srcSet ? CARD_SIZES : undefined}
            alt=""
            width="800"
            height="450"
            loading="lazy"
            decoding="async"
          />
        </Link>
      )}
      <div className="blog-card-body">
        <span className="section-tag">{service ? service.label : 'Project'}</span>
        <h3><Link to={path}>{study.title}</Link></h3>
        <p>{study.summary}</p>
        <div className="blog-card-foot">
          <span className="blog-meta-item"><PinIcon size={14} /> {caseStudyLocation(study)}</span>
          {study.completed && (
            <span className="blog-meta-item"><CalendarIcon size={14} /> {formatMonth(study.completed)}</span>
          )}
        </div>
        <Link className="blog-card-link" to={path}>
          READ CASE STUDY <ArrowRightIcon size={13} />
        </Link>
      </div>
    </article>
  );
}

function TrailBreadcrumb({ trail }) {
  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        {trail.map(([label, to], index) => (
          <Fragment key={to}>
            <span className="breadcrumb-sep">/</span>
            {index === trail.length - 1 ? (
              <span className="breadcrumb-current" aria-current="page">{label}</span>
            ) : (
              <Link to={to}>{label}</Link>
            )}
          </Fragment>
        ))}
      </nav>
    </div>
  );
}

/**
 * A case study of a real job at /projects/<area>-<service>-<yyyy> (plan §5,
 * §13). Only published entries in caseStudies.js render; anything else —
 * including the six legacy /projects/<service> slugs — is a 404 here (those
 * have their own redirects).
 */
export default function CaseStudyPage() {
  const { slug } = useParams();
  const study = caseStudyBySlug(slug);
  return study ? <CaseStudyView study={study} /> : <NotFoundPage />;
}

function CaseStudyView({ study }) {
  const path = caseStudyPath(study);
  const seo = study.seo || {};
  const service = serviceByPath(study.service);
  const area = study.area && study.area.slug ? publishedServiceArea(study.area.slug) : null;
  const video = study.video ? videoBySlug(study.video) : null;
  const photos = study.photos || [];
  const faqs = study.faqs && study.faqs.length ? study.faqs : undefined;
  const signoff = study.ownerSignoff || null;
  const location = caseStudyLocation(study);

  // Visible breadcrumb = schema breadcrumb (seo.js trailFor: Projects › <title>).
  const trail = useMemo(() => trailFor(path, seo.title), [path, seo.title]);

  // Same options head.js passes for the prerender.
  usePageSeo(path, caseStudySeoOptions(study));

  const related = caseStudiesForService(study.service)
    .filter((other) => other.slug !== study.slug)
    .slice(0, 3);

  const facts = [
    location && ['Location', location],
    service && ['Service', <Link className="blog-inline-link" to={service.path}>{service.label}</Link>],
    study.completed && ['Completed', formatMonth(study.completed)],
    study.duration && ['Time on site', study.duration],
    study.budgetBand && ['Budget range', study.budgetBand],
    study.permits && ['Permits', study.permits],
  ].filter(Boolean);

  return (
    <main>
      <TrailBreadcrumb trail={trail} />

      <PageHero
        eyebrow={[service && service.label, location].filter(Boolean).join(' · ') || 'Case Study'}
        title={study.h1 ? study.h1.title : study.title}
        highlight={study.h1 ? study.h1.highlight : undefined}
        description={study.summary}
        primaryLink={service ? { to: service.path, label: `SEE OUR ${service.label.toUpperCase()}` } : undefined}
      />

      {study.stats && study.stats.length > 0 && (
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {study.stats.map((stat, index) => (
                <div
                  className="stat-card reveal"
                  key={stat.label}
                  style={index > 0 ? { transitionDelay: `${index * 0.1}s` } : undefined}
                >
                  <div className="stat-num">{stat.num}<span className="stat-unit">{stat.unit}</span></div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <article className="blog-article-section">
        <div className="container blog-article-container">
          <div className="blog-article-body">
            {seo.updated && (
              <p className="policy-updated">
                Updated <time dateTime={seo.updated}>{formatPostDate(seo.updated)}</time>
              </p>
            )}

            {facts.length > 0 && (
              <aside className="blog-takeaways">
                <h2>Project at a glance</h2>
                <ul>
                  {facts.map(([label, value]) => (
                    <li key={label}>
                      <strong>{label}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {(study.sections || []).map((section) => (
              <div key={section.h2}>
                <h2>{section.h2}</h2>
                <RichBody blocks={section.blocks || []} />
              </div>
            ))}

            {video && (
              <div>
                <h2>Watch the project</h2>
                <YouTubeFacade videoId={video.youtubeId} title={video.title} thumbnail={video.thumbnail} />
                <p>
                  <Link className="blog-inline-link" to={videoPath(video)}>Video details and transcript</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </article>

      {photos.length > 0 && (
        <section className="gallery-section" id="photos">
          <div className="container">
            <div className="section-header center reveal">
              <span className="section-tag">Project Photos</span>
              <h2 className="section-title">Before, during and after</h2>
              <p className="section-desc">Photos from this job, shared with the client’s permission.</p>
            </div>
            <div className="gallery-grid">
              {photos.map((photo, index) => (
                <figure
                  className="gallery-item col-4 reveal"
                  key={photo.src}
                  style={index > 0 ? { transitionDelay: `${(index % 3) * 0.1}s` } : undefined}
                >
                  <img
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes={photo.srcSet ? GALLERY_SIZES : undefined}
                    alt={photo.alt}
                    width={photo.width || 800}
                    height={photo.height || 600}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="gallery-overlay">
                    <h4>{STAGE_LABELS[photo.stage] || 'Photo'}</h4>
                    {photo.caption && <p>{photo.caption}</p>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {study.process && study.process.steps && study.process.steps.length > 0 && (
        <Process
          steps={study.process.steps}
          tag={study.process.tag || 'How It Went'}
          title={study.process.title || 'The job, step by step'}
          desc={study.process.desc || null}
        />
      )}

      {study.testimonial && study.testimonial.quote && (
        <section className="testimonial-section">
          <div className="container">
            <div className="testimonial-card reveal">
              <div className="testimonial-left">
                <h3 className="testimonial-headline">In the client’s words</h3>
                <p className="testimonial-sub">
                  {[study.testimonial.source, study.testimonial.date && formatPostDate(study.testimonial.date)]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
              <div className="testimonial-right">
                <p className="testimonial-quote">{study.testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className="author-initial">{(study.testimonial.name || '?').charAt(0)}</div>
                  <div className="author-info">
                    <h5>{study.testimonial.name}</h5>
                    {study.testimonial.role && <p>{study.testimonial.role}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {faqs && (
        <section className="faq-section" id="faqs">
          <div className="container">
            <div className="section-header center">
              <span className="section-tag">Questions</span>
              <h2 className="section-title">About this project</h2>
            </div>
            <FaqAccordion items={faqs} headingLevel={3} />
          </div>
        </section>
      )}

      {(service || area || signoff) && (
        <article className="blog-article-section">
          <div className="container blog-article-container">
            <div className="blog-article-body">
              {(service || area) && (
                <p>
                  {service && (
                    <>
                      Planning something similar? See our{' '}
                      <Link className="blog-inline-link" to={service.path}>{service.label.toLowerCase()}</Link>{' '}
                      page{area ? ', ' : '.'}
                    </>
                  )}
                  {area && (
                    <>
                      {service ? 'or read' : 'Read'} about our work in{' '}
                      <Link className="blog-inline-link" to={area.path}>{area.name}</Link>.
                    </>
                  )}
                </p>
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
      )}

      {related.length > 0 && (
        <section className="blog-related-section">
          <div className="container">
            <span className="section-tag">More projects</span>
            <h2 className="blog-related-heading">Similar projects</h2>
            <div className="blog-grid">
              {related.map((item) => (
                <div className="reveal" key={item.slug}>
                  <CaseStudyCard study={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner />
    </main>
  );
}
