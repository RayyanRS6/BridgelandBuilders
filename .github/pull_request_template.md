## What changed

<!-- One or two sentences: which pages or files, and why. -->

## Checklist (SEO plan §20)

Tick what applies, or write "n/a" after an item that does not.

- [ ] **Keyword map:** every new or retargeted page has an entry in `scripts/keyword-map.json` (primary / secondary / supporting, `status`), and no keyword is listed twice. `npm run audit` shows no `keywords.*` errors.
- [ ] **Sources:** every fact, rule, price or program named in new copy links its source in the page's `sources`, with an `accessed` date. Prices come only from the estimator's published starting ranges.
- [ ] **Owner sign-off:** pages that state prices, regulations or business facts carry `ownerSignoff` (name, role, date), or the PR says it is waiting for it.
- [ ] **Screenshots at 320, 375 and 430 px:** attached for every changed page (no horizontal scroll, tap targets at least 44 px, form inputs at 16 px).
- [ ] **Facts change log:** any change to business facts (`src/data/siteConfig.js`: phone, service area, hours, experience, project count, ratings, profiles) is listed below with the owner's confirmation and date. No unconfirmed claims (insurance, WCB, licences, warranty, fixed prices, financing offers).

## Facts change log

<!-- "None", or: fact, old value, new value, confirmed by, date. -->

## Lastmod

<!-- If page copy changed: "updated" bumped on those pages, then `npm run audit:hashes` after the build (the audit's sitemap.stale-updated warning lists the pages). -->
