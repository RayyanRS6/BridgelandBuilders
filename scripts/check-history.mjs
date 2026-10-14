/**
 * Back-button check (SEO plan §3.8): no script on the live site may add
 * entries to the visitor's history (the "back button goes nowhere" hijack
 * some chat widgets, form embeds and pixels do). Loads key pages in a
 * phone-sized headless Chromium, records every history.pushState /
 * history.replaceState call in every frame from before any page script runs,
 * scrolls the page (lazy iframes such as the estimator load near the
 * viewport), waits for the third-party scripts, then checks history.length.
 *
 *   node scripts/check-history.mjs [baseUrl] [--wait=8000]
 *
 *   baseUrl   default https://bridgelandbuilders.com (the production apex)
 *   --wait    ms to wait after load for late scripts (GHL chat, Meta pixel)
 *
 * Fails (exit 1) when, on any page:
 *   - pushState is called in any frame (it adds an entry to the tab's
 *     history, even from inside an iframe);
 *   - replaceState changes the top page's URL;
 *   - history.length grows after the page has loaded.
 * A replaceState that keeps the URL (React Router stores its index in
 * history.state on start-up) adds nothing and is only listed.
 *
 * Needs Playwright, which is not a project dependency. CI installs it for the
 * job only:
 *   npm i --no-save playwright@1.63.0 && npx playwright install --with-deps chromium
 * Analytics beacons (GA4 collect, Meta pixel /tr) are blocked so the check
 * does not count as visits; the scripts themselves still load and run.
 */

const args = process.argv.slice(2);
const BASE = new URL(args.find((a) => !a.startsWith('--')) || 'https://bridgelandbuilders.com');
const WAIT_MS = Number((args.find((a) => a.startsWith('--wait=')) || '--wait=8000').slice('--wait='.length)) || 8000;
const PAGES = ['/', '/services/kitchen-renovations', '/instant-quote', '/book-online', '/contact'];
const BLOCKED = [/google-analytics\.com\/g\/collect/, /analytics\.google\.com\/g\/collect/, /facebook\.com\/tr\b/];

let playwright;
try {
  playwright = await import('playwright');
} catch {
  console.error('playwright is not installed: npm i --no-save playwright && npx playwright install --with-deps chromium');
  process.exit(2);
}
const { chromium, devices } = playwright;

// Runs in every frame before any of its scripts. Wraps the History prototype
// so calls made through window.history and History.prototype are both seen.
function instrumentHistory() {
  if (window.__bbHistoryCalls) return;
  const calls = [];
  Object.defineProperty(window, '__bbHistoryCalls', { value: calls });
  for (const method of ['pushState', 'replaceState']) {
    const original = History.prototype[method];
    History.prototype[method] = function patched(state, title, url) {
      let target = null;
      try {
        target = url == null ? null : new URL(url, location.href).href;
      } catch {
        target = String(url);
      }
      const stack = String(new Error().stack || '')
        .split('\n')
        .slice(2)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 3);
      calls.push({ method, from: location.href, to: target, changesUrl: target != null && target !== location.href, stack });
      return original.apply(this, [state, title, url]);
    };
  }
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    window.scrollTo(0, 0);
  });
}

async function checkPage(browser, path) {
  const url = new URL(path, BASE).href;
  // Most visitors are on phones (Meta ad traffic included).
  const context = await browser.newContext({ ...(devices['Pixel 7'] || devices['Pixel 5']) });
  await context.addInitScript(instrumentHistory);
  await context.route('**/*', (route) =>
    BLOCKED.some((re) => re.test(route.request().url())) ? route.abort() : route.continue()
  );
  const page = await context.newPage();
  const result = { path, problems: [], notes: [] };
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    const startLength = await page.evaluate(() => history.length);
    await page.waitForLoadState('load', { timeout: 45000 }).catch(() => result.notes.push('load event did not fire within 45 s'));
    await scrollThrough(page);
    await page.waitForTimeout(WAIT_MS);
    const endLength = await page.evaluate(() => history.length);
    if (endLength > startLength) result.problems.push(`history.length grew from ${startLength} to ${endLength}`);

    for (const frame of page.frames()) {
      let calls = [];
      try {
        calls = await frame.evaluate(() => window.__bbHistoryCalls || []);
      } catch {
        continue; // detached or navigated away
      }
      const top = frame === page.mainFrame();
      const where = top ? 'page' : `iframe ${new URL(frame.url()).host || frame.url()}`;
      for (const call of calls) {
        const line = `${where}: ${call.method}(${call.to == null ? 'same URL' : call.to})${call.stack.length ? ` at ${call.stack[0]}` : ''}`;
        if (call.method === 'pushState' || (top && call.changesUrl)) result.problems.push(line);
        else result.notes.push(line);
      }
    }
  } catch (error) {
    result.problems.push(`could not check the page: ${error.message.split('\n')[0]}`);
  } finally {
    await context.close();
  }
  return result;
}

const browser = await chromium.launch();
const results = [];
try {
  for (const path of PAGES) results.push(await checkPage(browser, path));
} finally {
  await browser.close();
}

console.log(`History check: ${BASE.origin} (waited ${WAIT_MS} ms after load)\n`);
for (const r of results) {
  console.log(`${r.problems.length ? 'FAIL' : 'ok  '}  ${r.path}`);
  for (const p of r.problems) console.log(`        ${p}`);
  for (const n of r.notes) console.log(`        (ok) ${n}`);
}
const failed = results.filter((r) => r.problems.length);
console.log(`\n${results.length - failed.length}/${results.length} pages passed`);
if (failed.length) process.exit(1);
