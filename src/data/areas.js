/*
 * The service area: Winnipeg plus nearby communities within about an hour,
 * the single source for every page, schema node and file that names them
 * (re-exported by siteConfig.js under the same names). Kept free of imports,
 * like timelines.js, so the lightweight service content modules can read the
 * lists without pulling in siteConfig.js.
 *
 * One list feeds schema areaServed, llms files, the service-area page, the
 * quote form and the service pages' "outside Winnipeg" lines.
 * `confirmed: true` = already claimed on the site; `confirmed: false` =
 * candidate awaiting owner confirmation (never published until confirmed).
 * `type` is the schema.org type (City covers cities and towns; Place = an
 * unincorporated community inside a rural municipality). `wikipedia` URLs were
 * checked against the Wikipedia API (canonical article titles) on 2026-10-13.
 * `permitAuthority: 'verify'` = not yet confirmed; never publish it as-is.
 */
export const SERVICE_AREAS = [
  {
    name: 'Winnipeg',
    slug: 'winnipeg',
    type: 'City',
    municipality: 'City of Winnipeg',
    wikipedia: 'https://en.wikipedia.org/wiki/Winnipeg',
    permitAuthority: 'City of Winnipeg',
    confirmed: true,
  },
  {
    name: 'Headingley',
    slug: 'headingley',
    type: 'AdministrativeArea',
    municipality: 'RM of Headingley',
    wikipedia: 'https://en.wikipedia.org/wiki/Rural_Municipality_of_Headingley',
    permitAuthority: 'RM of Headingley',
    confirmed: true,
  },
  {
    name: 'East St. Paul',
    slug: 'east-st-paul',
    type: 'AdministrativeArea',
    municipality: 'RM of East St. Paul',
    wikipedia: 'https://en.wikipedia.org/wiki/Rural_Municipality_of_East_St._Paul',
    permitAuthority: 'Red River Planning District',
    confirmed: true,
  },
  {
    name: 'West St. Paul',
    slug: 'west-st-paul',
    type: 'AdministrativeArea',
    municipality: 'RM of West St. Paul',
    wikipedia: 'https://en.wikipedia.org/wiki/Rural_Municipality_of_West_St._Paul',
    permitAuthority: 'Red River Planning District',
    confirmed: true,
  },
  {
    name: 'Oak Bluff',
    slug: 'oak-bluff',
    type: 'Place',
    municipality: 'RM of Macdonald',
    wikipedia: 'https://en.wikipedia.org/wiki/Oak_Bluff,_Manitoba',
    permitAuthority: 'RM of Macdonald',
    confirmed: true,
  },
  {
    name: 'Selkirk',
    slug: 'selkirk',
    type: 'City',
    municipality: 'City of Selkirk',
    wikipedia: 'https://en.wikipedia.org/wiki/Selkirk,_Manitoba',
    // Confirmed through search results from the city's own domain only (its
    // site blocked automated access on 2026-10-13): re-check in a browser.
    permitAuthority: 'City of Selkirk',
    confirmed: true,
  },
  {
    name: 'Steinbach',
    slug: 'steinbach',
    type: 'City',
    municipality: 'City of Steinbach',
    wikipedia: 'https://en.wikipedia.org/wiki/Steinbach,_Manitoba',
    permitAuthority: 'City of Steinbach',
    confirmed: true,
  },
  {
    name: 'Stonewall',
    slug: 'stonewall',
    type: 'City',
    municipality: 'Town of Stonewall',
    wikipedia: 'https://en.wikipedia.org/wiki/Stonewall,_Manitoba',
    permitAuthority: 'verify',
    confirmed: false,
  },
  {
    name: 'Niverville',
    slug: 'niverville',
    type: 'City',
    municipality: 'Town of Niverville',
    wikipedia: 'https://en.wikipedia.org/wiki/Niverville,_Manitoba',
    permitAuthority: 'verify',
    confirmed: false,
  },
  {
    name: 'La Salle',
    slug: 'la-salle',
    type: 'Place',
    municipality: 'RM of Macdonald',
    wikipedia: 'https://en.wikipedia.org/wiki/La_Salle,_Manitoba',
    permitAuthority: 'verify',
    confirmed: false,
  },
  {
    name: 'Lorette',
    slug: 'lorette',
    type: 'Place',
    municipality: 'RM of Taché',
    wikipedia: 'https://en.wikipedia.org/wiki/Lorette,_Manitoba',
    permitAuthority: 'verify',
    confirmed: false,
  },
  {
    name: 'Île-des-Chênes',
    slug: 'ile-des-chenes',
    type: 'Place',
    municipality: 'RM of Ritchot',
    wikipedia: 'https://en.wikipedia.org/wiki/%C3%8Ele-des-Ch%C3%AAnes',
    permitAuthority: 'verify',
    confirmed: false,
  },
  {
    name: 'Oakbank',
    slug: 'oakbank',
    type: 'Place',
    municipality: 'RM of Springfield',
    wikipedia: 'https://en.wikipedia.org/wiki/Oakbank,_Manitoba',
    permitAuthority: 'verify',
    confirmed: false,
  },
];

/** Confirmed service-area names, Winnipeg first. */
export const SERVICE_AREA_NAMES = SERVICE_AREAS.filter((area) => area.confirmed).map((area) => area.name);

/** Confirmed nearby communities, without Winnipeg, in SERVICE_AREAS order. */
export const NEARBY_AREA_NAMES = SERVICE_AREA_NAMES.filter((name) => name !== 'Winnipeg');

/**
 * A list as the site writes it: commas, no serial comma, then the
 * conjunction. listJoin(['A', 'B', 'C']) → 'A, B and C';
 * listJoin(['A', 'B', 'C'], 'or') → 'A, B or C'.
 */
export const listJoin = (items, conj = 'and') =>
  items.length > 1 ? `${items.slice(0, -1).join(', ')} ${conj} ${items[items.length - 1]}` : items.join('');

/**
 * Neighbouring names that differ only in their first word are named once:
 * ['East St. Paul', 'West St. Paul'] → ['East and West St. Paul'].
 */
export const pairSharedNames = (names) =>
  names.reduce((out, name) => {
    const previous = out[out.length - 1];
    const [first, ...rest] = name.split(' ');
    const [previousFirst, ...previousRest] = previous ? previous.split(' ') : [];
    if (previous && rest.length && !previous.includes(' and ') && previousRest.join(' ') === rest.join(' ')) {
      out[out.length - 1] = `${previousFirst} and ${first} ${rest.join(' ')}`;
    } else {
      out.push(name);
    }
    return out;
  }, []);

// The nearby communities as running text, precomputed so the service content
// modules (lazy chunks) only read a string: a function call in their data
// would stop the bundler from leaving it out of chunks that never read it.
/** 'Headingley, East St. Paul, West St. Paul, Oak Bluff, Selkirk and Steinbach' */
export const NEARBY_AREAS_TEXT = listJoin(NEARBY_AREA_NAMES);
/** 'Headingley, East St. Paul, West St. Paul, Oak Bluff, Selkirk or Steinbach' */
export const NEARBY_AREAS_TEXT_OR = listJoin(NEARBY_AREA_NAMES, 'or');
/** 'Headingley, East and West St. Paul, Oak Bluff, Selkirk and Steinbach' (short form, meta descriptions) */
export const NEARBY_AREAS_TEXT_SHORT = listJoin(pairSharedNames(NEARBY_AREA_NAMES));
