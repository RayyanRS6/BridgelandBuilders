/**
 * People who write or review content on the site (plan §9, §11.3).
 *
 * Empty until the owner supplies real people. Until then every post is
 * credited to the business ("By the Bridgeland Builders team") and its schema
 * author is the organisation.
 *
 * Rules for adding someone:
 *  - Only real people who are shown on /about-us, in an element whose id is
 *    the same key — the byline links to /about-us#<id> and the schema Person
 *    @id is <SITE_URL>/about-us#<id>.
 *  - Never list a licence, WCB clearance, insurance, certification or warranty
 *    without documented proof from the owner.
 *  - No stock photos: `image` must be the real person.
 *
 * Shape:
 *   export const PEOPLE = {
 *     'jane-doe': {                         // id: url-safe, also the About anchor
 *       name: 'Jane Doe',                   // required
 *       role: 'Project Lead',               // job title, shown with the name
 *       bio: 'One or two plain sentences.', // optional
 *       image: '/images/team/jane-doe.webp',// optional, self-hosted
 *       sameAs: ['https://www.linkedin.com/in/…'], // optional public profiles
 *       knowsAbout: ['Kitchen renovation'], // optional topics
 *     },
 *   };
 *
 * Posts reference people by id: blog-raw/posts/<slug>.json `author` and
 * `reviewedBy` (scripts/build-blog-data.mjs fails on an unknown id).
 */
export const PEOPLE = {};

/** The person with this id, or null. */
export function personById(id) {
  return (id && Object.prototype.hasOwnProperty.call(PEOPLE, id) && PEOPLE[id]) || null;
}

/** Where a person's profile lives on the site. */
export function personPath(id) {
  return `/about-us#${id}`;
}
