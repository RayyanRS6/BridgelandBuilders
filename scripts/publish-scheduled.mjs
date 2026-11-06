/**
 * Publishes one week of blog-raw/publishing-schedule.json: the client's pace is
 * 2 blogs and 2 articles a week.
 *
 *   node scripts/publish-scheduled.mjs              publish the oldest week that is due
 *   node scripts/publish-scheduled.mjs --dry-run    say what it would do, change nothing
 *   node scripts/publish-scheduled.mjs --list       print the whole schedule
 *   node scripts/publish-scheduled.mjs --date=YYYY-MM-DD   act as if that were today
 *
 * A week is due when its date has arrived in Winnipeg. One run publishes one
 * week, on the day it runs. Each post goes from "draft" to "published" and takes
 * that day as its "date" and "updated", and its entry in
 * scripts/keyword-map.json goes from "planned" to "live".
 *
 * If that day is later than planned, the schedule takes the real date. If the
 * next week would then fall in the same Monday-to-Sunday week, every later week
 * moves back by whole weeks. So a late or repeated run can never put more than
 * 2 blogs and 2 articles in one week. Moved dates also need changing in the
 * captions and the plan.
 *
 * After this, it takes the normal build, npm run audit:hashes and another build,
 * and goes out through a pull request or the "Publish this week's posts" GitHub
 * workflow (.github/workflows/publish-weekly.yml).
 *
 * If a post in the week is past its "reviewBy" date, nothing is published and
 * the exit code is 1: re-check the post's dated facts, correct the text, set a
 * new "reviewBy" in its file and run this again. Facts tied to a date do not go
 * live unchecked.
 *
 * The files are edited as text, so their formatting and line endings stay as
 * they are. Node built-ins only.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHEDULE_FILE, addDays, checkSchedule, loadWeeks, mondayOf, slugsOfWeek, winnipegToday } from './lib/publishing-schedule.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const POSTS_DIR = join(ROOT, 'blog-raw', 'posts');
const KEYWORD_MAP = join(ROOT, 'scripts', 'keyword-map.json');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIST = args.includes('--list');
const dateArg = (args.find((a) => a.startsWith('--date=')) || '').slice('--date='.length);
if (dateArg && !/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
  console.error(`--date must be YYYY-MM-DD, not "${dateArg}"`);
  process.exit(2);
}
const today = dateArg || winnipegToday();

const postFile = (slug) => join(POSTS_DIR, `${slug}.json`);
const posts = readdirSync(POSTS_DIR)
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(join(POSTS_DIR, file), 'utf8')));
const bySlug = new Map(posts.map((post) => [post.slug, post]));
const weeks = loadWeeks(ROOT);

const isWaiting = (slug) => bySlug.get(slug)?.status === 'draft';

if (LIST) {
  weeks.forEach((week, index) => {
    const waiting = slugsOfWeek(week).filter(isWaiting).length;
    const state = !waiting ? 'live' : week.date <= today ? 'DUE' : 'waiting';
    console.log(`\nWeek ${index + 1}, ${week.date} (${state})`);
    for (const [kind, list] of [['blog', week.blogs || []], ['article', week.articles || []]]) {
      for (const slug of list) {
        const post = bySlug.get(slug);
        const mustRecheck = isWaiting(slug) && post?.reviewBy && post.reviewBy < week.date;
        const review = mustRecheck ? `  [re-check its facts first: review-by date ${post.reviewBy}]` : '';
        console.log(`  ${kind.padEnd(8)}${post?.title || slug}${review}`);
        console.log(`          /blog/${slug}`);
      }
    }
  });
  const waiting = weeks.flatMap(slugsOfWeek).filter(isWaiting).length;
  console.log(`\n${weeks.length} weeks, ${waiting} posts waiting. Today in Winnipeg: ${today}.`);
  process.exit(0);
}

const problems = checkSchedule(weeks, posts, today);
if (problems.length) {
  console.error(`The schedule has ${problems.length} problem(s), nothing changed:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}

const dueWeeks = weeks.filter((week) => week.date <= today && slugsOfWeek(week).some(isWaiting));
if (!dueWeeks.length) {
  const next = weeks.find((week) => slugsOfWeek(week).some(isWaiting));
  console.log(`Nothing is due today (${today}).${next ? ` Next week of posts: ${next.date}.` : ' Every scheduled post is live.'}`);
  process.exit(0);
}

const week = dueWeeks[0];
const due = slugsOfWeek(week).filter(isWaiting);
// It goes out today, whatever day was planned, so the dates stay true. A week
// already partly out keeps its date, so all its posts agree with the schedule.
const partlyOut = due.length < slugsOfWeek(week).length;
const goesOutOn = partlyOut ? week.date : today;
console.log(`Week planned for ${week.date}: ${due.length} post(s) due, going out dated ${goesOutOn}.`);

const stale = due.filter((slug) => {
  const reviewBy = bySlug.get(slug).reviewBy;
  return reviewBy && reviewBy < today;
});
if (stale.length) {
  console.error('Nothing published: these posts are past their review-by date.');
  for (const slug of stale) console.error(`  ${slug}  review by ${bySlug.get(slug).reviewBy}`);
  console.error('Re-check the dated facts, correct the text, set a new "reviewBy" in each file, then run this again.');
  process.exit(1);
}

/** `text` with the one match of `pattern` replaced; anything but exactly one match is a stop. */
function replaceOnce(text, pattern, replacement, where) {
  const found = text.match(new RegExp(pattern.source, `${pattern.flags.replace('g', '')}g`)) || [];
  if (found.length !== 1) throw new Error(`${where}: expected one match of ${pattern}, found ${found.length}`);
  return text.replace(pattern, replacement);
}

const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const writes = [];
let keywordMap = readFileSync(KEYWORD_MAP, 'utf8');

for (const slug of due) {
  let text = readFileSync(postFile(slug), 'utf8');
  text = replaceOnce(text, /"status":\s*"draft"/, '"status": "published"', slug);
  text = replaceOnce(text, /"date":\s*"[^"]*"/, `"date": "${goesOutOn}"`, slug);
  if (bySlug.get(slug).updated !== undefined) text = replaceOnce(text, /"updated":\s*"[^"]*"/, `"updated": "${goesOutOn}"`, slug);
  writes.push([postFile(slug), text]);

  const entry = new RegExp(`("/blog/${escapeForRegExp(slug)}":\\s*\\{\\s*"status":\\s*)"planned"`);
  keywordMap = replaceOnce(keywordMap, entry, '$1"live"', `keyword map, ${slug}`);
  console.log(`  ${DRY_RUN ? 'would publish' : 'publishing'} /blog/${slug}`);
}
writes.push([KEYWORD_MAP, keywordMap]);

// The next week must fall in a later Monday-to-Sunday week. Whole weeks keep the
// later weeks on their weekday and the gaps between them as they were.
const later = weeks.slice(weeks.indexOf(week) + 1);
let moveDays = 0;
while (later.length && mondayOf(addDays(later[0].date, moveDays)) <= mondayOf(goesOutOn)) moveDays += 7;

const newDates = new Map();
if (goesOutOn !== week.date) newDates.set(week.date, goesOutOn);
if (moveDays) for (const laterWeek of later) newDates.set(laterWeek.date, addDays(laterWeek.date, moveDays));
if (newDates.size) {
  const scheduleFile = join(ROOT, SCHEDULE_FILE);
  // One pass, so a date moved onto another week's old date is not moved twice.
  writes.push([
    scheduleFile,
    readFileSync(scheduleFile, 'utf8').replace(/("date":\s*")(\d{4}-\d{2}-\d{2})(")/g, (all, open, date, close) => `${open}${newDates.get(date) || date}${close}`),
  ]);
}
if (moveDays) {
  console.log(`Later weeks ${DRY_RUN ? 'would move' : 'move'} ${moveDays / 7} week(s) back: the next is now ${addDays(later[0].date, moveDays)}. Change those dates in the captions and the plan too.`);
}

if (DRY_RUN) {
  console.log('Dry run: nothing changed.');
  process.exit(0);
}
for (const [file, text] of writes) writeFileSync(file, text);
console.log('Next: npm run build, npm run audit:hashes, npm run build, then ship it.');
