/**
 * Checks that the newest published week of blog-raw/publishing-schedule.json
 * answers on the live site, trying for up to 10 minutes.
 *
 *   node scripts/check-live-posts.mjs
 *
 * A push is not a deploy. .github/workflows/publish-weekly.yml runs this after
 * its push, so a failed deploy shows as a failed run. It runs it again before
 * flipping the next week: otherwise main could get ahead of the site, and the
 * next deploy that works would release two weeks together.
 *
 * Exit code 1 when a post still does not answer 200. Node built-ins only.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadWeeks, slugsOfWeek } from './lib/publishing-schedule.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SITE = 'https://bridgelandbuilders.com';
const TRIES = 40;
const WAIT_MS = 15000;

const isPublished = (slug) => JSON.parse(readFileSync(join(ROOT, 'blog-raw', 'posts', `${slug}.json`), 'utf8')).status === 'published';
const newest = [...loadWeeks(ROOT)].reverse().find((week) => slugsOfWeek(week).some(isPublished));
if (!newest) {
  console.log('No scheduled post is published yet.');
  process.exit(0);
}
const slugs = slugsOfWeek(newest).filter(isPublished);

async function statusOf(slug) {
  try {
    const res = await fetch(`${SITE}/blog/${slug}`, { redirect: 'manual', headers: { 'user-agent': 'bridgeland-publish-check/1.0' } });
    return res.status;
  } catch {
    return 0;
  }
}

let missing = [];
for (let attempt = 1; attempt <= TRIES; attempt += 1) {
  const statuses = await Promise.all(slugs.map(async (slug) => [slug, await statusOf(slug)]));
  missing = statuses.filter(([, status]) => status !== 200);
  if (!missing.length) break;
  if (attempt < TRIES) await new Promise((resolve) => setTimeout(resolve, WAIT_MS));
}

// exitCode, not exit(): stopping Node with fetch's connections still open can crash it on Windows.
if (missing.length) {
  console.error(`The week of ${newest.date} is published on main but not live on the site. After 10 minutes:`);
  for (const [slug, status] of missing) console.error(`  /blog/${slug} answers ${status || 'nothing'}`);
  console.error('Check the deployment on Vercel. No further week goes out until these answer.');
  process.exitCode = 1;
} else {
  console.log(`The week of ${newest.date} is live: ${slugs.length} of ${slugs.length} posts answer 200.`);
}
