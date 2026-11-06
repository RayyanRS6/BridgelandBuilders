/**
 * The weekly publishing schedule: blog-raw/publishing-schedule.json.
 *
 * The client's agreed pace is 2 blogs and 2 articles a week. Each week in the
 * file names its date and its posts. A post waiting for its week has status
 * "draft": no page, not in the sitemap, the feed or /blog, and its URL answers
 * 404. scripts/publish-scheduled.mjs flips a week's posts when the date arrives.
 *
 * Used by scripts/build-blog-data.mjs, which fails the build when the schedule
 * or a published post breaks the pace, and by scripts/publish-scheduled.mjs.
 * Node built-ins only.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const SCHEDULE_FILE = 'blog-raw/publishing-schedule.json';
export const MAX_BLOGS_PER_WEEK = 2;
export const MAX_ARTICLES_PER_WEEK = 2;
const DAY_MS = 24 * 60 * 60 * 1000;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** The Monday of a date's Monday-to-Sunday week, in milliseconds. "A week" in the pace means this week. */
export const mondayOf = (date) => {
  const day = Date.parse(date);
  return day - ((new Date(day).getUTCDay() + 6) % 7) * DAY_MS;
};

export const addDays = (date, days) => new Date(Date.parse(date) + days * DAY_MS).toISOString().slice(0, 10);

/**
 * Today in Winnipeg, YYYY-MM-DD. Manitoba stays at UTC-5 all year from
 * 2026-11-01, which a machine's time-zone data may not know yet, so the offset
 * is fixed here.
 */
export const winnipegToday = (now = Date.now()) => new Date(now - 5 * 60 * 60 * 1000).toISOString().slice(0, 10);

/** The schedule's weeks, oldest first as written. No file means no schedule. */
export function loadWeeks(root) {
  const file = join(root, SCHEDULE_FILE);
  if (!existsSync(file)) return [];
  const { weeks } = JSON.parse(readFileSync(file, 'utf8'));
  return Array.isArray(weeks) ? weeks : [];
}

export const slugsOfWeek = (week) => [...(week.blogs || []), ...(week.articles || [])];

/** Every post a week of the schedule names, with its week's date. */
export const scheduledDates = (weeks) => new Map(weeks.flatMap((week) => slugsOfWeek(week).map((slug) => [slug, week.date])));

/**
 * What breaks the pace, as messages. `posts` are the raw post files, `today`
 * the Winnipeg date. Two rules beyond the file's own shape keep the pace from
 * being broken by accident: a post dated from the schedule's first week onward
 * must be in the schedule with that date, and no post may be dated in the future.
 */
export function checkSchedule(weeks, posts, today) {
  const errors = [];
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const seen = new Set();

  weeks.forEach((week, index) => {
    const where = `${SCHEDULE_FILE} ${week.date}`;
    if (!DATE.test(week.date || '') || Number.isNaN(Date.parse(week.date))) {
      errors.push(`${SCHEDULE_FILE} week ${index + 1}: date must be YYYY-MM-DD`);
      return;
    }
    const previous = weeks[index - 1];
    if (previous && mondayOf(week.date) <= mondayOf(previous.date)) {
      errors.push(`${where}: it must fall in a later Monday-to-Sunday week than ${previous.date}, so no week goes over the pace`);
    }
    if ((week.blogs || []).length > MAX_BLOGS_PER_WEEK) errors.push(`${where}: ${week.blogs.length} blogs, the pace is ${MAX_BLOGS_PER_WEEK} a week`);
    if ((week.articles || []).length > MAX_ARTICLES_PER_WEEK) errors.push(`${where}: ${week.articles.length} articles, the pace is ${MAX_ARTICLES_PER_WEEK} a week`);
    for (const slug of slugsOfWeek(week)) {
      const post = bySlug.get(slug);
      if (seen.has(slug)) errors.push(`${where}: ${slug} is scheduled twice`);
      seen.add(slug);
      if (!post) {
        errors.push(`${where}: ${slug} has no file in blog-raw/posts`);
        continue;
      }
      const status = post.status || 'published';
      if (status === 'published') {
        if (post.date !== week.date) errors.push(`${where}: ${slug} is published, dated ${post.date}, but its week is ${week.date}`);
      } else if (status !== 'draft' && week.date > today) {
        // Once its week has passed, a post can be retired like any other.
        errors.push(`${where}: ${slug} has status "${status}" before its week. Take a retired post out of the schedule, or set it to "draft" to keep its week`);
      }
    }
  });

  const firstWeek = weeks.length ? weeks[0].date : null;
  for (const post of posts) {
    if ((post.status || 'published') !== 'published' || !DATE.test(post.date || '')) continue;
    if (post.date > today) errors.push(`${post.slug}: published with a future date, ${post.date}. Today in Winnipeg is ${today}`);
    if (firstWeek && post.date >= firstWeek && !seen.has(post.slug)) {
      errors.push(`${post.slug}: published and dated ${post.date}, but it is not in ${SCHEDULE_FILE}. Give it a week there, so the pace stays at ${MAX_BLOGS_PER_WEEK} blogs and ${MAX_ARTICLES_PER_WEEK} articles a week`);
    }
  }
  return errors;
}

/* ------------------------------------------------- links to waiting posts */
const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const RELATED_LINE = /^(\*\*Related reading:\*\*\s*)([\s\S]*)$/;
const RELATED_SEPARATOR = ' · ';
const SENTENCE_BREAK = /(?<=[.!?]["”)]?)\s+(?=["“[*]?[A-Z])/;
// A sentence that only sends the reader to the post ("Our guide to X covers
// that step.") or the same as the end of a sentence (", or see our X.").
const POINTER_SENTENCE = /^(?:our|see)\b/i;
const POINTER_CLAUSE = /,\s+(?:or|and)\s+(?:see\s+)?our\s+\[[^\]]+\]\([^)\s]+\)[^.!?]*/gi;

/**
 * Text with its links to waiting posts held back, so a live page never links to
 * a 404. They come back by themselves on the build after the post goes live.
 *   - A "Related reading" list drops the item (and the line, once it is empty).
 *   - A sentence that only points at the post waits with it.
 *   - Any other mention keeps its words without the link.
 * Returns '' when nothing is left of the text.
 */
export function makeLinkHolder(heldPaths) {
  const isHeld = (href) => heldPaths.has(href.split('#')[0].replace(/\/+$/, ''));
  const hasHeldLink = (text) => [...text.matchAll(INLINE_LINK)].some(([, , href]) => isHeld(href));
  const unlink = (text) => text.replace(INLINE_LINK, (all, label, href) => (isHeld(href) ? label : all));

  return function holdLinks(text) {
    if (typeof text !== 'string' || !hasHeldLink(text)) return text;
    const related = RELATED_LINE.exec(text);
    if (related) {
      const kept = related[2].split(RELATED_SEPARATOR).filter((item) => !hasHeldLink(item));
      return kept.length ? `${related[1]}${kept.join(RELATED_SEPARATOR)}` : '';
    }
    return text
      .split(SENTENCE_BREAK)
      .filter((sentence) => !(hasHeldLink(sentence) && POINTER_SENTENCE.test(sentence)))
      .map((sentence) => unlink(sentence.replace(POINTER_CLAUSE, (clause) => (hasHeldLink(clause) ? '' : clause))))
      .join(' ');
  };
}

/** A post with `holdLinks` applied to everything it shows; a text block left empty is dropped. */
export function holdLinksInPost(post, holdLinks) {
  const inValue = (value) => {
    if (typeof value === 'string') return holdLinks(value);
    if (Array.isArray(value)) return value.map(inValue);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, inValue(inner)]));
    return value;
  };
  return {
    ...post,
    ...(post.answer ? { answer: inValue(post.answer) } : {}),
    ...(Array.isArray(post.faqs) ? { faqs: inValue(post.faqs) } : {}),
    ...(Array.isArray(post.blocks)
      ? { blocks: inValue(post.blocks).filter((block) => !block || typeof block.x !== 'string' || block.x.trim()) }
      : {}),
  };
}
