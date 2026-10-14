import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  PageBreak,
} from 'docx';

// Owner-review copy documents (SEO plan §20): one Markdown + Word file per
// page in website_copy/, plus a master copy and a README index.
//
//   node scripts/generate_copy_docs.js            write website_copy/
//   node scripts/generate_copy_docs.js --dry-run  list the pages, write nothing
//
// Service pages, cost guides, /service-areas and /editorial-policy are read
// from the same data modules the site renders (src/data/services.js and the
// service content modules, src/data/costGuides, serviceAreasContent.js,
// editorialPolicy.js), so routes and copy cannot drift. The other static
// pages are hand-kept snapshots below: check them against the live page
// before sending, and keep them to confirmed facts (no ratings badges,
// superlatives, "verified" labels or one-crew / fixed-price promises).
// Merge any edits the owner made in website_copy/ before re-running: the
// files are overwritten.
import { LIVE_SERVICE_PAGES } from '../src/data/projects.js';
import { SERVICE_CATEGORIES } from '../src/data/serviceCategories.js';
import { serviceTrail } from '../src/data/seo.js';
import { LIVE_COST_GUIDES } from '../src/data/head.js';
import { SERVICE_AREAS_CONTENT, confirmedServiceAreas } from '../src/data/serviceAreasContent.js';
import { EDITORIAL_POLICY } from '../src/data/editorialPolicy.js';
import { SERVICE_AREA_NAMES, SITE_EMAIL } from '../src/data/siteConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MD_DIR = path.join(ROOT_DIR, 'website_copy', 'markdown');
const DOCX_DIR = path.join(ROOT_DIR, 'website_copy', 'word_docx');
const DRY_RUN = process.argv.includes('--dry-run');

// Palette
const COLOR_PRIMARY = '191715'; // Dark charcoal
const COLOR_RED = 'C20917';     // Accent Red
const COLOR_SEAGREEN = '217A8A';// Accent Sea Green
const COLOR_MUTED = '5E5750';   // Muted Gray
const COLOR_BG_LIGHT = 'F7F5F0';// Warm cream

// Helper to create docx elements
function docTitle(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.TITLE,
    spacing: { before: 120, after: 120 },
    children: [new TextRun({ text, bold: true, color: COLOR_RED, size: 32, font: 'Calibri' })],
  });
}

function docSubtitle(text) {
  return new Paragraph({
    spacing: { before: 0, after: 200 },
    children: [new TextRun({ text, italics: true, color: COLOR_MUTED, size: 22, font: 'Calibri' })],
  });
}

function docMeta(label, value) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, color: COLOR_PRIMARY, size: 20, font: 'Calibri' }),
      new TextRun({ text: value, color: COLOR_SEAGREEN, size: 20, font: 'Calibri' }),
    ],
  });
}

function docH1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: COLOR_PRIMARY, size: 26, font: 'Calibri' })],
  });
}

function docH2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, color: COLOR_SEAGREEN, size: 22, font: 'Calibri' })],
  });
}

function docH3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 80 },
    children: [new TextRun({ text, bold: true, color: COLOR_PRIMARY, size: 20, font: 'Calibri' })],
  });
}

function docPara(text, options = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 100, line: 276 },
    children: [
      new TextRun({
        text,
        size: 21,
        font: 'Calibri',
        color: options.color || COLOR_PRIMARY,
        bold: !!options.bold,
        italics: !!options.italics,
      }),
    ],
  });
}

function docBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix, bold: true, size: 21, font: 'Calibri', color: COLOR_PRIMARY }));
  }
  children.push(new TextRun({ text, size: 21, font: 'Calibri', color: COLOR_PRIMARY }));
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40, line: 260 },
    children,
  });
}

function docCallout(title, text) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 24, color: COLOR_RED, space: 12 },
    },
    children: [
      new TextRun({ text: `${title}: `, bold: true, color: COLOR_RED, size: 20, font: 'Calibri' }),
      new TextRun({ text: text, italics: true, color: COLOR_PRIMARY, size: 20, font: 'Calibri' }),
    ],
  });
}

// -------------------------------------------------------------
// DATA HELPERS (content read from src/data)
// -------------------------------------------------------------

/** Inline markdown as plain text: [label](url) -> label, **bold** -> bold. */
function plain(text) {
  return String(text || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim();
}

/** RichBody blocks -> document items (consecutive list items become one list). */
function blockItems(blocks = []) {
  const items = [];
  let list = null;
  const flush = () => {
    if (list) items.push(list);
    list = null;
  };
  blocks.filter((b) => b && !b.hidden).forEach((b) => {
    if (b.t === 'li' || b.t === 'oli') {
      if (!list) list = { type: 'list', label: 'List', list: [] };
      list.list.push(plain(b.x));
      return;
    }
    flush();
    if (/^h[2-4]$/.test(b.t)) items.push({ type: 'label-value', label: `Subheading (${b.t.toUpperCase()})`, value: plain(b.x) });
    else if (b.t === 'table') items.push(tableItem(b));
    else if (b.t === 'takeaways') items.push({ type: 'list', label: plain(b.title) || 'Key takeaways', list: (b.items || []).map(plain) });
    else if (b.t === 'callout') items.push({ type: 'callout', title: plain(b.title) || 'Note', text: plain(b.x) });
    else if (b.t === 'img') items.push({ type: 'label-value', label: 'Image alt text', value: plain(b.alt) });
    else if (b.x) items.push({ type: 'para', label: 'Paragraph', text: plain(b.x) });
  });
  flush();
  return items;
}

/** A table block as a list of "cell | cell" rows. */
function tableItem(table) {
  return {
    type: 'list',
    label: `Table: ${plain(table.caption) || 'untitled'}`,
    list: [
      ...(table.head && table.head.length ? [`(columns) ${table.head.map(plain).join(' | ')}`] : []),
      ...(table.rows || []).map((row) => row.map(plain).join(' | ')),
      ...(table.note ? [`(note) ${plain(table.note)}`] : []),
    ],
  };
}

const faqItems = (faqs = []) => faqs.map((faq, i) => ({ type: 'faq', q: `Q${i + 1}: ${plain(faq.q)}`, a: plain(faq.a) }));
const sourceList = (sources = []) => sources.map((s) => `${plain(s.label)} — ${s.url}${s.accessed ? ` (verified ${s.accessed})` : ''}`);

/** Mega-menu / service-directory lines from SERVICE_CATEGORIES (the data the Navbar renders). */
const categoryOf = (id) => SERVICE_CATEGORIES.find((c) => c.id === id) || { label: id, description: '', services: [] };
const categoryLines = (id, withPage = false) =>
  categoryOf(id).services.map((s) => `${s.label}: ${s.description}${withPage ? ` (Page: ${s.to})` : ` (URL: ${s.to})`}`);

// Owner-confirmed figures, as the Stats band shows them (src/components/Stats.jsx).
const STAT_ITEMS = [
  { type: 'label-value', label: 'Stat 1', value: '60+ Years of combined experience' },
  { type: 'label-value', label: 'Stat 2', value: '100+ Projects completed across Winnipeg' },
  { type: 'label-value', label: 'Stat 3', value: `${SERVICE_AREA_NAMES.length} Communities we serve` },
  { type: 'label-value', label: 'Stat 4', value: '1 day — Reply within one business day' },
];

// The "Why Bridgeland Builders" block (src/components/WhyUs.jsx).
const WHY_US_ITEMS = [
  { type: 'label-value', label: 'Section Title (H2)', value: 'A clear plan, a written price and weekly updates' },
  { type: 'label-value', label: 'Floating Badge', value: 'No Surprises: A free written quote before we start, and a progress update every week.' },
  {
    type: 'para',
    label: 'Paragraph 1',
    text: 'Bridgeland Builders is a Winnipeg renovation and construction team with over 60 years of combined experience. Together we have completed more than 100 projects, from single-room updates in family homes to commercial fit-ups for local businesses.',
  },
  {
    type: 'para',
    label: 'Paragraph 2',
    text: 'Every project starts with a free on-site visit and a free written quote, and nothing starts until you approve it. When the work needs permits and inspections, we coordinate them with the City of Winnipeg or your local municipality.',
  },
  {
    type: 'para',
    label: 'Paragraph 3',
    text: 'Once work begins, you get a progress update every week. Home or business, big or small, you know where your project stands at every stage.',
  },
  {
    type: 'list',
    label: 'Checklist Highlights',
    list: ['Over 60 Years Combined Experience', '100+ Completed Projects', 'Free Written Quotes', 'Weekly Progress Updates'],
  },
];

// The client quote block (src/components/Testimonial.jsx).
const TESTIMONIAL_HEADLINE = 'What Our Clients Say';
const TESTIMONIAL_SUB = 'In their own words: what it’s like working with Bridgeland Builders.';
const TESTIMONIAL_AUTHOR = 'Marvin V. — Homeowner ★★★★★';

// The booking aside beside every booking form (src/components/BookingAside.jsx).
const BOOKING_ASIDE_LIST = [
  'Free, no-obligation visit: We come out, measure up, and talk it through. You decide after that.',
  'Reply within one business day: Our team gets back to you by phone, text, or email — your pick.',
  'Clear written quote: One price, itemised, with nothing hiding in the small print.',
  'Your details stay private: We use them to get back to you about your project, and we never sell them.',
  'Rather just call? 431-866-5644 — Winnipeg, Manitoba',
];

// -------------------------------------------------------------
// PAGE DEFINITIONS (STRUCTURED CONTENT)
// Each page has a `key`; its file id ("NN_KEY") is numbered in order at the
// end, so adding a page never produces clashing or unpadded ids.
// -------------------------------------------------------------

export const pagesData = [
  {
    key: 'GLOBAL_ELEMENTS',
    title: 'Bridgeland Builders — Global Elements & Site-Wide Copy',
    route: 'Across all pages (Header, Nav, Mega-Menu, Footer, Quote Modal)',
    description: 'Universal website copy that appears across every page of the website.',
    sections: [
      {
        heading: '1. Top Announcement Bar',
        notes: 'Appears at the very top of all pages above the main navigation.',
        items: [
          { type: 'label-value', label: 'Greeting Message', value: 'Hi! This is Emma from Bridgeland Builders.' },
          { type: 'label-value', label: 'Location Indicator', value: 'Winnipeg, Manitoba' },
          { type: 'label-value', label: 'Phone Number', value: '431-866-5644' },
          { type: 'label-value', label: 'Phone Call Link', value: 'tel:431-866-5644' },
        ],
      },
      {
        heading: '2. Main Navigation Bar',
        notes: 'Header navigation items and mega menu breakdown.',
        items: [
          { type: 'label-value', label: 'Logo / Brand Name', value: 'Bridgeland Builders' },
          {
            type: 'list',
            label: 'Top Level Navigation Links',
            list: [
              'Home (URL: /)',
              'Services (URL: /services - with dropdown mega-menu)',
              'About Us (URL: /about-us)',
              'Process (URL: /our-process)',
              'Inspiration (URL: /projects)',
              'FAQs (URL: /faqs)',
            ],
          },
          { type: 'label-value', label: 'Primary Header Button CTA', value: 'GET A QUOTE (Opens Instant Quote Modal)' },
          ...SERVICE_CATEGORIES.map((category) => ({
            type: 'list',
            label: `Services Mega-Menu — ${category.label}`,
            list: categoryLines(category.id),
          })),
        ],
      },
      {
        heading: '3. Instant Quote Modal',
        notes: 'Interactive pop-up modal triggered by "GET A QUOTE" and "GET INSTANT QUOTE" buttons across the site.',
        items: [
          { type: 'label-value', label: 'Modal Heading', value: 'GET INSTANT QUOTE' },
          { type: 'label-value', label: 'Modal Subtitle', value: 'Hi! Tell us a little about your project and we’ll reach out directly.' },
          { type: 'label-value', label: 'Form Name', value: 'Lead Generation Form new website' },
          {
            type: 'list',
            label: 'Form Fields Collected',
            list: [
              'Full Name',
              'Email Address',
              'Phone Number',
              'Service of Interest / Project Description',
              'Submit CTA: Request Quote',
            ],
          },
        ],
      },
      {
        heading: '4. Global Footer & Sitemap',
        notes: 'Comprehensive footer appearing at the bottom of all pages.',
        items: [
          { type: 'label-value', label: 'Brand Name', value: 'Bridgeland Builders' },
          { type: 'label-value', label: 'Brand Tagline', value: 'Your Winnipeg Trusted Renovation and Construction Company. Over 60 years of combined experience turning ideas into reality.' },
          { type: 'label-value', label: 'Phone', value: '431-866-5644' },
          { type: 'label-value', label: 'Location', value: 'Winnipeg, Manitoba' },
          {
            type: 'list',
            label: 'Footer Column 1: COMPANY',
            list: ['ABOUT US (/about-us)', 'OUR SERVICES (/services)', 'OUR PROCESS (/our-process)', 'OUR PROJECTS (/projects)', 'FAQs (/faqs)', 'CONTACT US (/contact-us)'],
          },
          {
            type: 'list',
            label: 'Footer Column 2: RESIDENTIAL',
            list: [
              'BASEMENT RENOVATIONS (/services/basement-renovations)',
              'BATHROOM RENOVATIONS (/services/bathroom-renovations)',
              'HOME EXTENSIONS (/services/home-additions)',
              'KITCHEN RENOVATIONS (/services/kitchen-renovations)',
              'WHOLE HOME RENOVATIONS (/services/whole-home-renovations)',
            ],
          },
          {
            type: 'list',
            label: 'Footer Column 3: COMMERCIAL',
            list: ['COMMERCIAL RENOVATIONS (/services/commercial-renovations)', 'REQUEST A SITE VISIT (/contact-us)'],
          },
          { type: 'label-value', label: 'Copyright Notice', value: '© 2026 Bridgeland Builders. Winnipeg, Manitoba. All rights reserved.' },
          { type: 'label-value', label: 'Social Media Links', value: 'Facebook, Instagram, LinkedIn' },
        ],
      },
    ],
  },
  {
    key: 'HOME_PAGE',
    title: 'Bridgeland Builders — Home Page Copy',
    route: '/',
    description: 'The main landing page of Bridgeland Builders website.',
    sections: [
      {
        heading: '1. Hero Section',
        notes: 'First impression at the top of the homepage.',
        items: [
          { type: 'label-value', label: 'Badge', value: 'Bridging Dreams Into Reality' },
          { type: 'label-value', label: 'Headline (H1)', value: 'WINNIPEG RENOVATION CONTRACTOR' },
          {
            type: 'para',
            label: 'Subtitle / Lead Paragraph',
            text: 'Kitchens, bathrooms, basements, whole homes, additions and commercial spaces in Winnipeg and nearby communities. Every project starts with a free on-site visit and a free written quote.',
          },
          { type: 'label-value', label: 'Primary Button CTA', value: 'GET INSTANT QUOTE (Opens instant quote modal)' },
          { type: 'label-value', label: 'Secondary Button CTA', value: 'Our Services (Links to /services)' },
          { type: 'label-value', label: 'Floating Trust Badge', value: 'Free Written Quotes — Over 60 Years Combined Experience' },
        ],
      },
      {
        heading: '2. Ticker Banner',
        notes: 'Continuous animated marquee band across the page.',
        items: [
          {
            type: 'list',
            label: 'Ticker Phrases',
            list: [
              'BRIDGING DREAMS INTO REALITY',
              'WINNIPEG MANITOBA',
              'OVER 60 YEARS OF EXPERIENCE',
              'MORE THAN 100 PROJECTS',
              'QUALITY WORK, NO SHORTCUTS',
            ],
          },
        ],
      },
      {
        heading: '3. Stats Overview',
        notes: 'Key credibility numbers.',
        items: STAT_ITEMS,
      },
      {
        heading: '4. Our Services Section',
        notes: 'Overview cards for residential, commercial, and other services.',
        items: [
          { type: 'label-value', label: 'Section Eyebrow', value: 'Our Expertise' },
          { type: 'label-value', label: 'Section Title (H2)', value: 'Our Services' },
          { type: 'label-value', label: 'Section Description', value: 'We don’t overcomplicate things. We just focus on what matters to you and get it done right.' },
          {
            type: 'card',
            title: 'Service Card 1: Residential Services',
            category: 'Residential',
            copy: 'Need a new kitchen? Bathroom? Or maybe it’s time to finally redo the whole house? We’ve done it all. What matters most to us is making your place feel like home. We’re a Winnipeg Manitoba crew that people trust because we do the job right.',
            action: 'View residential services (Links to /services?category=residential#service-directory)',
          },
          {
            type: 'card',
            title: 'Service Card 2: Commercial Services',
            category: 'Commercial',
            copy: 'Your workspace should work for you. We build offices, shops, and restaurants that look good, function well, and leave the right impression. Among construction companies in Winnipeg, Local businesses come to Bridgeland Builders because they know we’ll deliver without the runaround.',
            action: 'View commercial services (Links to /services?category=commercial#service-directory)',
          },
          {
            type: 'card',
            title: 'Service Card 3: Other Services',
            category: 'Specialty',
            copy: 'Doesn’t matter if it’s fixing something small or redoing the whole place — we put the same care into it either way.',
            action: 'View additional services (Links to /services?category=additional#service-directory)',
          },
        ],
      },
      {
        heading: '5. Why Bridgeland Builders Section',
        notes: 'Core value proposition and brand philosophy.',
        items: [
          { type: 'label-value', label: 'Section Eyebrow', value: 'Why Bridgeland Builders?' },
          ...WHY_US_ITEMS,
          { type: 'label-value', label: 'CTA Button', value: 'GET INSTANT QUOTE' },
        ],
      },
      {
        heading: '6. Our Process Section',
        notes: 'High level 4-step client experience.',
        items: [
          { type: 'label-value', label: 'Section Eyebrow', value: 'How We Work' },
          { type: 'label-value', label: 'Section Title (H2)', value: 'Our Process' },
          { type: 'label-value', label: 'Section Description', value: 'Reliable, step-by-step care from our Winnipeg team to your doorstep.' },
          {
            type: 'step',
            num: '01',
            title: 'Experience You Can Trust',
            text: 'We’ve been at this a long time — more than 60 years of combined experience. We’ve done all kinds of jobs — from patching up little things to tearing down walls and starting fresh. After this many years, not much surprises us. And if something unexpected comes up — because it usually does — we sort it out and keep the project moving.',
          },
          {
            type: 'step',
            num: '02',
            title: 'Customer Satisfaction',
            text: 'The best part of this work isn’t just finishing a project — it’s seeing the smile when people walk into their new space for the first time. Over the years, we’ve built kitchens, offices, bathrooms, basements — but more importantly, we’ve built trust. Many of our customers call us back for their next job, and that means a lot.',
          },
          {
            type: 'step',
            num: '03',
            title: 'Quality Work, No Shortcuts',
            text: 'We don’t believe in quick fixes or cutting corners. If we’re building it, it’s built to last. We use good materials, take our time on the details, and do it the right way — even when no one’s looking.',
          },
          {
            type: 'step',
            num: '04',
            title: 'Built Around You',
            text: 'Every project starts with a talk. Give us your wish list and the pain points. We’ll sort out a simple plan with you and get it done, no fuss. Simple as that.',
          },
        ],
      },
      {
        heading: '7. Testimonial Spotlight',
        notes: 'Featured customer story on the homepage.',
        items: [
          { type: 'label-value', label: 'Stars', value: '★★★★★' },
          { type: 'label-value', label: 'Headline', value: TESTIMONIAL_HEADLINE },
          { type: 'label-value', label: 'Subheading', value: TESTIMONIAL_SUB },
          {
            type: 'para',
            label: 'Client Quote',
            text: '“Working with Bridgeland Builders was an incredible experience. Their team demonstrated unmatched expertise and professionalism throughout the entire renovation process. From the initial consultation to the final walkthrough, they kept us informed and ensured every detail reflected our vision. The quality of craftsmanship and materials exceeded our expectations, and their commitment to customer satisfaction truly sets them apart. We couldn’t be happier with our newly transformed space—thank you, Bridgeland Builders!”',
          },
          { type: 'label-value', label: 'Author', value: TESTIMONIAL_AUTHOR },
        ],
      },
      {
        heading: '8. Inspiration Portfolio Gallery',
        notes: 'Cards showcasing recent transformation projects.',
        items: [
          { type: 'label-value', label: 'Section Eyebrow', value: 'Our Portfolio' },
          { type: 'label-value', label: 'Section Title (H2)', value: 'Get Inspired: Transform Your Space with Bridgeland Builders' },
          { type: 'label-value', label: 'Section Description', value: 'Take a look at how we build and renovate spaces across Winnipeg, Manitoba.' },
          {
            type: 'list',
            label: 'Gallery Showcase Items',
            list: [
              'Whole Home Renovation: Custom open living room and kitchen design (Link: /services/whole-home-renovations)',
              'Bathroom Renovation: Modern fixtures & clean tiling (Link: /services/bathroom-renovations)',
              'Kitchen Renovation: Built for comfort, cooking, and durability (Link: /services/kitchen-renovations)',
              'Basement Renovation: Finished family area and guest space (Link: /services/basement-renovations)',
              'Home Extension: More room, built to feel like it was always there (Link: /services/home-additions)',
              'Commercial Renovation: Office and retail spaces that work for you (Link: /services/commercial-renovations)',
            ],
          },
        ],
      },
      {
        heading: '9. Quick CTA Banner',
        notes: 'High-converting banner before the footer.',
        items: [
          { type: 'label-value', label: 'Headline (H2)', value: 'Get a free Quote Now!' },
          { type: 'label-value', label: 'Subtext', value: 'Contact Bridgeland Builders today. We’ll discuss your ideas, provide clear details, and get it done right.' },
          { type: 'label-value', label: 'CTA Button', value: 'GET INSTANT QUOTE' },
        ],
      },
    ],
  },
  {
    key: 'SERVICES_OVERVIEW',
    title: 'Bridgeland Builders — Services Overview Page Copy',
    route: '/services',
    description: 'The master directory of all residential, commercial, and additional construction services.',
    sections: [
      {
        heading: '1. Page Hero',
        notes: 'Header area introducing the full service catalogue.',
        items: [
          { type: 'label-value', label: 'Eyebrow', value: 'Renovation & Construction' },
          { type: 'label-value', label: 'Headline (H1)', value: 'WINNIPEG RENOVATION SERVICES BUILT AROUND YOUR SPACE' },
          { type: 'label-value', label: 'Description', value: 'Explore residential, commercial, and specialty renovation services delivered by our experienced Winnipeg team.' },
          { type: 'label-value', label: 'Primary CTA Link', value: 'VIEW OUR PROJECTS (/projects)' },
        ],
      },
      // One section per category, from SERVICE_CATEGORIES (the directory's own data).
      ...SERVICE_CATEGORIES.map((category, i) => ({
        heading: `${i + 2}. Service Directory — Category ${i + 1}: ${category.label}`,
        notes: 'Service cards in this category, each linking to its own page.',
        items: [
          { type: 'label-value', label: 'Category Label', value: `${category.label} (${category.services.length} services)` },
          { type: 'label-value', label: 'Category Description', value: category.description },
          { type: 'list', label: 'Services Included', list: categoryLines(category.id, true) },
        ],
      })),
      {
        heading: `${SERVICE_CATEGORIES.length + 2}. Estimator & Price Guide Section`,
        notes: 'Interactive planning widget embedded for clients.',
        items: [
          { type: 'label-value', label: 'Eyebrow', value: 'Free Price Guide' },
          { type: 'label-value', label: 'Title (H2)', value: 'Get Your Renovation Price Guide' },
          { type: 'label-value', label: 'Description', value: 'Not sure which category fits? Start with the overall estimator and tell us what you are planning. Select your project type and answer a few questions to receive a useful starting price range.' },
        ],
      },
      {
        heading: `${SERVICE_CATEGORIES.length + 3}. Inspiration Gallery & Bottom CTA`,
        notes: 'Portfolio grid and quick quote banner.',
        items: [
          { type: 'label-value', label: 'Gallery Heading', value: 'Get Inspired: Transform Your Space with Bridgeland Builders' },
          { type: 'label-value', label: 'Bottom Banner Heading', value: 'Get a free Quote Now!' },
          { type: 'label-value', label: 'Bottom Banner CTA', value: 'GET INSTANT QUOTE' },
        ],
      },
    ],
  },
];

// Service pages: every live service in src/data/services.js (registry order),
// with its route and its content module (src/data/services/<slug>.js).
LIVE_SERVICE_PAGES.forEach(({ service, content: proj }) => {
  const name = proj.breadcrumb || service.label;
  const types = Array.isArray(proj.types) ? proj.types : [];
  const local = proj.local && Array.isArray(proj.local.items) && proj.local.items.length ? proj.local : null;
  pagesData.push({
    key: service.slug.toUpperCase().replace(/-/g, '_'),
    title: `Bridgeland Builders — ${service.label} Page Copy`,
    route: service.path,
    description: `Service page for ${service.label.toLowerCase()} (${service.category}) with booking form, scope, process, estimator and FAQs.`,
    sections: [
      {
        heading: '1. Breadcrumb & Hero Section',
        notes: 'Top landing area with booking survey calendar.',
        items: [
          { type: 'label-value', label: 'Breadcrumb Path', value: `Home / ${serviceTrail(service).map(([label]) => label).join(' / ')}` },
          { type: 'label-value', label: 'Hero Badge', value: proj.badge },
          { type: 'label-value', label: 'Headline (H1)', value: `${proj.title} ${proj.titleHighlight}` },
          { type: 'para', label: 'Hero Subtitle', text: proj.subtitle },
          {
            type: 'list',
            label: 'Key Value Highlights',
            list: proj.heroPoints,
          },
          { type: 'label-value', label: 'Primary CTA Button', value: 'BOOK AN APPOINTMENT' },
          { type: 'label-value', label: 'Phone CTA', value: 'Call 431-866-5644' },
          { type: 'label-value', label: 'Booking Calendar Heading', value: 'Book Your Free Visit' },
          { type: 'label-value', label: 'Booking Calendar Subheading', value: 'Pick a day and time that works for you — you’ll get a confirmation straight away.' },
        ],
      },
      {
        heading: '2. Stats Overview',
        notes: 'Key service metrics.',
        items: proj.stats.map((s, i) => ({
          type: 'label-value',
          label: `Stat ${i + 1}`,
          value: `${s.num}${s.unit} — ${s.label}`,
        })),
      },
      // intro, gallery and testimonial are optional on a service page (null = section not shown).
      ...(proj.intro ? [{
        heading: `3. Why Choose Bridgeland for ${name}`,
        notes: 'Detailed pitch and philosophy.',
        items: [
          { type: 'label-value', label: 'Section Tag', value: proj.intro.tag },
          { type: 'label-value', label: 'Section Title (H2)', value: proj.intro.title },
          { type: 'label-value', label: 'Floating Badge', value: `${proj.intro.floatingTitle}: ${proj.intro.floatingText}` },
          ...(proj.intro.paragraphs || []).map((p, i) => ({
            type: 'para',
            label: `Paragraph ${i + 1}`,
            text: p,
          })),
          {
            type: 'list',
            label: 'Service Checklist',
            list: proj.intro.checklist || [],
          },
          { type: 'label-value', label: 'CTA Button', value: 'CHECK AVAILABLE DATES' },
        ],
      }] : []),
      {
        heading: '4. What Is Included in the Scope',
        notes: 'Detailed breakdown of standard deliverables.',
        items: [
          { type: 'label-value', label: 'Section Tag', value: proj.includes.tag },
          { type: 'label-value', label: 'Section Title (H2)', value: proj.includes.title },
          { type: 'label-value', label: 'Section Description', value: proj.includes.desc },
          ...proj.includes.items.map((item) => ({
            type: 'step',
            num: item.num,
            title: item.title,
            text: item.text,
          })),
        ],
      },
      ...(types.length ? [{
        heading: '4b. Project Types',
        notes: 'The kinds of project this page covers.',
        items: [
          { type: 'label-value', label: 'Section Tag', value: proj.typesTag || '' },
          { type: 'label-value', label: 'Section Title (H2)', value: proj.typesTitle || '' },
          ...(proj.typesDesc ? [{ type: 'para', label: 'Section Description', text: proj.typesDesc }] : []),
          { type: 'list', label: 'Project Types', list: types.map((t) => `${t.title}: ${t.text}`) },
        ],
      }] : []),
      ...(local ? [{
        heading: '4c. Local Rules & Conditions',
        notes: 'Winnipeg-specific facts, each with its source.',
        items: [
          { type: 'label-value', label: 'Section Tag', value: local.tag || '' },
          { type: 'label-value', label: 'Section Title (H2)', value: local.title || '' },
          ...(local.intro ? [{ type: 'para', label: 'Section Intro', text: plain(local.intro) }] : []),
          ...local.items.map((item) => ({ type: 'para', label: item.title, text: plain(item.text) })),
          ...(Array.isArray(local.sources) && local.sources.length ? [{ type: 'list', label: 'Sources', list: sourceList(local.sources) }] : []),
        ],
      }] : []),
      ...(proj.gallery && Array.isArray(proj.gallery.items) ? [{
        heading: '5. Recent Work & Project Gallery',
        notes: 'Visual showcase examples and captions.',
        items: [
          { type: 'label-value', label: 'Section Tag', value: proj.gallery.tag },
          { type: 'label-value', label: 'Section Title (H2)', value: proj.gallery.title },
          { type: 'label-value', label: 'Section Description', value: proj.gallery.desc },
          {
            type: 'list',
            label: 'Gallery Projects',
            list: proj.gallery.items.map((item) => `${item.title}: ${item.text}`),
          },
        ],
      }] : []),
      {
        heading: '6. How the Process Works',
        notes: 'Step-by-step project progression.',
        items: [
          { type: 'label-value', label: 'Section Tag', value: proj.process.tag },
          { type: 'label-value', label: 'Section Title (H2)', value: proj.process.title },
          { type: 'label-value', label: 'Section Description', value: proj.process.desc },
          ...proj.process.steps.map((step) => ({
            type: 'step',
            num: step.num,
            title: step.title,
            text: step.text,
          })),
        ],
      },
      ...(proj.costTeaser && proj.costTeaser.text ? [{
        heading: '6b. Cost Teaser',
        notes: 'Short price pointer that links to the cost guide.',
        items: [
          { type: 'para', label: 'Teaser Text', text: plain(proj.costTeaser.text) },
          { type: 'label-value', label: 'Link', value: `${proj.costTeaser.label || 'Cost guide'} (${proj.costTeaser.to})` },
        ],
      }] : []),
      ...(proj.testimonial && proj.testimonial.quote ? [{
        heading: '7. Client Testimonial',
        notes: 'Client review for this project category.',
        items: [
          { type: 'label-value', label: 'Stars', value: '★★★★★' },
          { type: 'para', label: 'Client Quote', text: proj.testimonial.quote },
          { type: 'label-value', label: 'Author', value: proj.testimonial.name },
          { type: 'label-value', label: 'Project / Role', value: proj.testimonial.role },
        ],
      }] : []),
      {
        heading: '8. Lead Consultation & Price Guide Section',
        notes: 'Side-by-side booking benefits and interactive price guide.',
        items: [
          { type: 'label-value', label: 'Aside Eyebrow', value: 'Book an on-site visit' },
          { type: 'label-value', label: 'Aside Heading', value: `Let’s talk about your ${name.toLowerCase()}` },
          {
            type: 'para',
            label: 'Aside Lead Text',
            text: 'Send us the details and we’ll come to the property, look at the space with you, and give you a straight answer on what it takes.',
          },
          {
            type: 'list',
            label: 'Client Guarantees & Benefits',
            list: BOOKING_ASIDE_LIST,
          },
          { type: 'label-value', label: 'Price Guide Card Heading', value: `Get Your Free ${name} Price Guide` },
          {
            type: 'para',
            label: 'Price Guide Card Text',
            text: 'Answer a few quick questions to receive a useful starting price range for your project. This planning guide is free and does not obligate you to proceed.',
          },
        ],
      },
      {
        heading: '9. Frequently Asked Questions',
        notes: `The questions homeowners ask most before booking a ${name.toLowerCase()}.`,
        items: [
          { type: 'label-value', label: 'Section Tag', value: 'Questions' },
          { type: 'label-value', label: 'Section Title (H2)', value: 'Frequently Asked Questions' },
          { type: 'label-value', label: 'Section Description', value: `The things people ask us most before booking a ${name.toLowerCase()}.` },
          ...faqItems(proj.faqs),
        ],
      },
      {
        heading: '10. Bottom Consideration CTA Banner',
        notes: 'Final prompt for visitors who are still planning.',
        items: [
          { type: 'label-value', label: 'Headline (H2)', value: 'Still thinking it over?' },
          { type: 'label-value', label: 'Subtext', value: 'Grab a free quote instead — tell us roughly what you need and we’ll come back with numbers. No appointment required.' },
          { type: 'label-value', label: 'CTA Button', value: 'GET INSTANT QUOTE' },
        ],
      },
    ],
  });
});

// Add the other main pages
pagesData.push(
  {
    key: 'ABOUT_US',
    title: 'Bridgeland Builders — About Us Page Copy',
    route: '/about-us',
    description: 'Company background, philosophy, team credibility, and core values.',
    sections: [
      {
        heading: '1. Page Hero',
        notes: 'Header introduction to the company.',
        items: [
          { type: 'label-value', label: 'Eyebrow', value: 'About Bridgeland Builders' },
          { type: 'label-value', label: 'Headline (H1)', value: 'LOCAL EXPERIENCE. HONEST WORK.' },
          { type: 'para', label: 'Description', text: 'Meet the Winnipeg renovation team that brings more than 60 years of combined experience to every home and business project.' },
          { type: 'label-value', label: 'Primary CTA Link', value: 'SEE HOW WE WORK (/our-process)' },
        ],
      },
      {
        heading: '2. Stats Overview',
        notes: 'Credibility metrics.',
        items: STAT_ITEMS,
      },
      {
        heading: '3. Why Bridgeland Builders (Core Philosophy)',
        notes: 'The full story of Bridgeland Builders.',
        items: [
          { type: 'label-value', label: 'Section Tag', value: 'Why Bridgeland Builders?' },
          ...WHY_US_ITEMS,
          { type: 'label-value', label: 'CTA Button', value: 'GET INSTANT QUOTE' },
        ],
      },
      {
        heading: '4. Testimonial Spotlight & Bottom CTA',
        notes: 'Social proof and final action.',
        items: [
          { type: 'label-value', label: 'Testimonial Headline', value: TESTIMONIAL_HEADLINE },
          { type: 'label-value', label: 'Testimonial Subheading', value: TESTIMONIAL_SUB },
          {
            type: 'para',
            label: 'Testimonial Quote',
            text: '“Working with Bridgeland Builders was an incredible experience. Their team demonstrated unmatched expertise and professionalism throughout the entire renovation process. From the initial consultation to the final walkthrough, they kept us informed and ensured every detail reflected our vision. The quality of craftsmanship and materials exceeded our expectations, and their commitment to customer satisfaction truly sets them apart. We couldn’t be happier with our newly transformed space—thank you, Bridgeland Builders!”',
          },
          { type: 'label-value', label: 'Client', value: TESTIMONIAL_AUTHOR },
          { type: 'label-value', label: 'CTA Banner Headline', value: 'Get a free Quote Now!' },
          { type: 'label-value', label: 'CTA Banner Subtext', value: 'Contact Bridgeland Builders today. We’ll discuss your ideas, provide clear details, and get it done right.' },
          { type: 'label-value', label: 'CTA Button', value: 'GET INSTANT QUOTE' },
        ],
      },
    ],
  },
  {
    key: 'OUR_PROCESS',
    title: 'Bridgeland Builders — Our Process Page Copy',
    route: '/our-process',
    description: 'Detailed explanation of the 4-step renovation and construction process.',
    sections: [
      {
        heading: '1. Page Hero',
        notes: 'Header area introducing the step-by-step methodology.',
        items: [
          { type: 'label-value', label: 'Eyebrow', value: 'How We Work' },
          { type: 'label-value', label: 'Headline (H1)', value: 'A CLEAR PLAN FROM DAY ONE' },
          { type: 'para', label: 'Description', text: 'From the first conversation to the final walkthrough, you get straightforward communication, quality materials, and a team that follows through.' },
          { type: 'label-value', label: 'Primary CTA Link', value: 'START A CONVERSATION (/contact-us)' },
        ],
      },
      {
        heading: '2. The 4-Step Renovation Process',
        notes: 'Core process cards.',
        items: [
          { type: 'label-value', label: 'Section Tag', value: 'How We Work' },
          { type: 'label-value', label: 'Section Title (H2)', value: 'Our Process' },
          { type: 'label-value', label: 'Section Description', value: 'Reliable, step-by-step care from our Winnipeg team to your doorstep.' },
          {
            type: 'step',
            num: '01',
            title: 'Experience You Can Trust',
            text: 'We’ve been at this a long time — more than 60 years of combined experience. We’ve done all kinds of jobs — from patching up little things to tearing down walls and starting fresh. After this many years, not much surprises us. And if something unexpected comes up — because it usually does — we sort it out and keep the project moving.',
          },
          {
            type: 'step',
            num: '02',
            title: 'Customer Satisfaction',
            text: 'The best part of this work isn’t just finishing a project — it’s seeing the smile when people walk into their new space for the first time. Over the years, we’ve built kitchens, offices, bathrooms, basements — but more importantly, we’ve built trust. Many of our customers call us back for their next job, and that means a lot.',
          },
          {
            type: 'step',
            num: '03',
            title: 'Quality Work, No Shortcuts',
            text: 'We don’t believe in quick fixes or cutting corners. If we’re building it, it’s built to last. We use good materials, take our time on the details, and do it the right way — even when no one’s looking.',
          },
          {
            type: 'step',
            num: '04',
            title: 'Built Around You',
            text: 'Every project starts with a talk. Give us your wish list and the pain points. We’ll sort out a simple plan with you and get it done, no fuss. Simple as that.',
          },
        ],
      },
      {
        heading: '3. Testimonial & Bottom CTA',
        notes: 'Social proof and quick quote prompt.',
        items: [
          { type: 'label-value', label: 'Testimonial Headline', value: TESTIMONIAL_HEADLINE },
          { type: 'label-value', label: 'Testimonial Subheading', value: TESTIMONIAL_SUB },
          { type: 'para', label: 'Testimonial Quote', text: '“Working with Bridgeland Builders was an incredible experience. Their team demonstrated unmatched expertise and professionalism throughout the entire renovation process. From the initial consultation to the final walkthrough, they kept us informed and ensured every detail reflected our vision. The quality of craftsmanship and materials exceeded our expectations, and their commitment to customer satisfaction truly sets them apart. We couldn’t be happier with our newly transformed space—thank you, Bridgeland Builders!”' },
          { type: 'label-value', label: 'Author', value: TESTIMONIAL_AUTHOR },
          { type: 'label-value', label: 'Bottom Banner Heading', value: 'Get a free Quote Now!' },
          { type: 'label-value', label: 'Bottom Banner CTA', value: 'GET INSTANT QUOTE' },
        ],
      },
    ],
  },
  {
    key: 'OUR_PROJECTS',
    title: 'Bridgeland Builders — Projects / Inspiration Page Copy',
    route: '/projects',
    description: 'Portfolio gallery showcase featuring all major renovation project types.',
    sections: [
      {
        heading: '1. Page Hero',
        notes: 'Introduction to the portfolio.',
        items: [
          { type: 'label-value', label: 'Eyebrow', value: 'Our Portfolio' },
          { type: 'label-value', label: 'Headline (H1)', value: 'SPACES TRANSFORMED ACROSS WINNIPEG' },
          { type: 'para', label: 'Description', text: 'Browse our renovation work, then open any project category for its own details, gallery, process, and booking page.' },
          { type: 'label-value', label: 'Primary CTA Link', value: 'EXPLORE SERVICES (/services)' },
        ],
      },
      {
        heading: '2. Portfolio Gallery Showcase',
        notes: 'Six primary renovation project categories.',
        items: [
          { type: 'label-value', label: 'Section Tag', value: 'Our Portfolio' },
          { type: 'label-value', label: 'Section Title (H2)', value: 'Get Inspired: Transform Your Space with Bridgeland Builders' },
          { type: 'label-value', label: 'Section Description', value: 'Take a look at how we build and renovate spaces across Winnipeg, Manitoba.' },
          {
            type: 'list',
            label: 'Project Category 1: Whole Home Renovation',
            list: [
              'Title: Whole Home Renovation',
              'Subtitle: Custom open living room and kitchen design',
              'Dedicated Page: /services/whole-home-renovations',
            ],
          },
          {
            type: 'list',
            label: 'Project Category 2: Bathroom Renovation',
            list: [
              'Title: Bathroom Renovation',
              'Subtitle: Modern fixtures & clean tiling',
              'Dedicated Page: /services/bathroom-renovations',
            ],
          },
          {
            type: 'list',
            label: 'Project Category 3: Kitchen Renovation',
            list: [
              'Title: Kitchen Renovation',
              'Subtitle: Built for comfort, cooking, and durability',
              'Dedicated Page: /services/kitchen-renovations',
            ],
          },
          {
            type: 'list',
            label: 'Project Category 4: Basement Renovation',
            list: [
              'Title: Basement Renovation',
              'Subtitle: Finished family area and guest space',
              'Dedicated Page: /services/basement-renovations',
            ],
          },
          {
            type: 'list',
            label: 'Project Category 5: Home Extension',
            list: [
              'Title: Home Extension',
              'Subtitle: More room, built to feel like it was always there',
              'Dedicated Page: /services/home-additions',
            ],
          },
          {
            type: 'list',
            label: 'Project Category 6: Commercial Renovation',
            list: [
              'Title: Commercial Renovation',
              'Subtitle: Office and retail spaces that work for you',
              'Dedicated Page: /services/commercial-renovations',
            ],
          },
        ],
      },
      {
        heading: '3. Bottom CTA Banner',
        notes: 'Final prompt for quote.',
        items: [
          { type: 'label-value', label: 'Headline (H2)', value: 'Get a free Quote Now!' },
          { type: 'label-value', label: 'Subtext', value: 'Contact Bridgeland Builders today. We’ll discuss your ideas, provide clear details, and get it done right.' },
          { type: 'label-value', label: 'CTA Button', value: 'GET INSTANT QUOTE' },
        ],
      },
    ],
  },
  {
    key: 'FAQS',
    title: 'Bridgeland Builders — Frequently Asked Questions Page Copy',
    route: '/faqs',
    description: 'Direct answers to the most common homeowner and commercial questions.',
    sections: [
      {
        heading: '1. Page Hero',
        notes: 'Header introduction to the FAQ directory.',
        items: [
          { type: 'label-value', label: 'Eyebrow', value: 'Helpful Answers' },
          { type: 'label-value', label: 'Headline (H1)', value: 'FREQUENTLY ASKED QUESTIONS' },
          { type: 'para', label: 'Description', text: 'Straight answers about quotes, timelines, permits, and what it is like to renovate with Bridgeland Builders.' },
          { type: 'label-value', label: 'Primary CTA Link', value: 'ASK US DIRECTLY (/contact-us)' },
        ],
      },
      {
        heading: '2. General Frequently Asked Questions',
        notes: 'Core questions covering project types, estimates, permits, and living on site.',
        items: [
          {
            type: 'faq',
            q: 'Q1: What types of renovation projects do you take on?',
            a: 'We handle whole-home, kitchen, bathroom, basement, and commercial renovations across Winnipeg, along with selected specialty construction work.',
          },
          {
            type: 'faq',
            q: 'Q2: Do you provide a written quote?',
            a: 'Yes. After we understand the space and scope, we provide a clear written quote so you know what is included before work begins.',
          },
          {
            type: 'faq',
            q: 'Q3: Do you handle permits and inspections?',
            a: 'Yes, when a project requires permits or inspections we include them in the plan and coordinate the required steps with the City of Winnipeg.',
          },
          {
            type: 'faq',
            q: 'Q4: Can I stay in my home during the renovation?',
            a: 'Often, yes. It depends on the size and location of the work. We explain what will be usable, how dust will be controlled, and when temporary disruptions are expected.',
          },
          {
            type: 'faq',
            q: 'Q5: How do I get started?',
            a: 'Use the quote form or call 431-866-5644. We will ask a few questions about your project and arrange the right next step, usually a free site visit.',
          },
        ],
      },
      {
        heading: '3. Bottom CTA Banner',
        notes: 'Direct conversion banner.',
        items: [
          { type: 'label-value', label: 'Headline (H2)', value: 'Get a free Quote Now!' },
          { type: 'label-value', label: 'Subtext', value: 'Contact Bridgeland Builders today. We’ll discuss your ideas, provide clear details, and get it done right.' },
          { type: 'label-value', label: 'CTA Button', value: 'GET INSTANT QUOTE' },
        ],
      },
    ],
  },
  {
    key: 'CONTACT_US',
    title: 'Bridgeland Builders — Contact Us Page Copy',
    route: '/contact-us',
    description: 'Contact details, booking guarantees, and lead capture form copy.',
    sections: [
      {
        heading: '1. Page Hero',
        notes: 'Header area welcoming project enquiries.',
        items: [
          { type: 'label-value', label: 'Eyebrow', value: 'Contact Us' },
          { type: 'label-value', label: 'Headline (H1)', value: 'LET’S TALK ABOUT YOUR PROJECT' },
          { type: 'para', label: 'Description', text: 'Tell us what you want to change and we will get back to you within one business day.' },
        ],
      },
      {
        heading: '2. Booking Consultation Aside (Why Reach Out)',
        notes: 'Sidebar details explaining how consultations work.',
        items: [
          { type: 'label-value', label: 'Aside Eyebrow', value: 'Book an on-site visit' },
          { type: 'label-value', label: 'Aside Heading', value: 'Let’s talk about your project' },
          {
            type: 'para',
            label: 'Intro Description',
            text: 'Send us the details and we’ll come to the property, look at the space with you, and give you a straight answer on what it takes.',
          },
          {
            type: 'list',
            label: 'Guarantees and Assurances',
            list: BOOKING_ASIDE_LIST,
          },
        ],
      },
      {
        heading: '3. Free Quote Form Card',
        notes: 'Embedded online contact and quote request form.',
        items: [
          { type: 'label-value', label: 'Card Heading (H3)', value: 'Request Your Free Quote' },
          { type: 'para', label: 'Card Description', text: 'Share the project details below. There is no obligation and no pushy follow-up.' },
          {
            type: 'list',
            label: 'Form Fields & Actions',
            list: [
              'Full Name',
              'Email Address',
              'Phone Number',
              'Project Details & Space Description',
              'Submit Button: Request Free Quote',
            ],
          },
        ],
      },
    ],
  },
  // /outside-winnipeg is gone (308 to /service-areas, generated below).
  {
    key: '404_PAGE',
    title: 'Bridgeland Builders — 404 Error Page Copy',
    route: '/404 (or any invalid path)',
    description: 'Creative construction-themed error page for missing or broken URLs.',
    sections: [
      {
        heading: '1. Error Card Content',
        notes: 'Blueprint-themed not found message.',
        items: [
          { type: 'label-value', label: 'Eyebrow', value: 'PAGE NOT FOUND' },
          { type: 'label-value', label: 'Headline (H1)', value: 'THIS PAGE ISN’T IN THE BLUEPRINT.' },
          {
            type: 'para',
            label: 'Lead Paragraph',
            text: 'The page may have moved, the address may be incomplete, or this part of the site is still under construction. Let’s get you back somewhere useful.',
          },
          { type: 'label-value', label: 'Primary Button CTA', value: 'Back to Home (Links to /)' },
          { type: 'label-value', label: 'Secondary Button CTA', value: 'Explore Our Services (Links to /services)' },
          { type: 'label-value', label: 'Blueprint Visual Tag', value: 'BRIDGELAND BUILDERS / PLAN 404' },
          { type: 'label-value', label: 'Graphic Status Code', value: '404' },
          { type: 'para', label: 'Blueprint Note', text: 'Nothing was built at this address.' },
        ],
      },
    ],
  }
);

// Cost guides (hub first), from src/data/costGuides via head.js: live guides only.
LIVE_COST_GUIDES.forEach((guide) => {
  const title = guide.seo && guide.seo.title ? guide.seo.title.split(' | ')[0] : guide.path;
  pagesData.push({
    key: `COST_${(guide.id || guide.path).toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '')}`,
    title: `Bridgeland Builders — ${title} (Cost Guide)`,
    route: guide.path,
    description: 'Cost guide: starting ranges from the instant estimator, what drives the price, and answers to common budget questions.',
    sections: [
      {
        heading: '1. Hero & Short Answer',
        notes: 'Top of the guide: the number in the first sentence.',
        items: [
          { type: 'label-value', label: 'Eyebrow', value: guide.eyebrow || '' },
          { type: 'label-value', label: 'Headline (H1)', value: guide.h1 ? `${guide.h1.title} ${guide.h1.highlight || ''}`.trim() : title },
          { type: 'para', label: 'Hero Description', text: plain(guide.intro || (guide.seo && guide.seo.description)) },
          ...(guide.answer ? [{ type: 'para', label: 'Short Answer', text: plain(guide.answer) }] : []),
        ],
      },
      ...(guide.dataBasis ? [{
        heading: '2. Where the Numbers Come From',
        notes: 'Methodology box (owner data only).',
        items: [
          { type: 'label-value', label: 'Source', value: plain(guide.dataBasis.source) },
          { type: 'label-value', label: 'Period', value: plain(guide.dataBasis.period) },
          ...(guide.dataBasis.note ? [{ type: 'para', label: 'Note', text: plain(guide.dataBasis.note) }] : []),
        ],
      }] : []),
      ...((guide.tables || []).length ? [{
        heading: '3. Price Tables',
        notes: 'Starting ranges as published.',
        items: guide.tables.map(tableItem),
      }] : []),
      ...((guide.drivers || []).length ? [{
        heading: `4. ${guide.driversTitle || 'What Drives the Price'}`,
        notes: plain(guide.driversDesc) || 'Cost drivers.',
        items: guide.drivers.map((d, i) => ({ type: 'step', num: String(i + 1).padStart(2, '0'), title: plain(d.title), text: plain(d.text) })),
      }] : []),
      ...(guide.sections || []).map((section, i) => ({
        heading: `${5 + i}. ${plain(section.h2)}`,
        notes: 'Guide section.',
        items: blockItems(section.blocks),
      })),
      ...((guide.faqs || []).length ? [{ heading: 'FAQs', notes: 'FAQPage comes only from these.', items: faqItems(guide.faqs) }] : []),
      ...((guide.sources || []).length ? [{ heading: 'Sources', notes: 'Linked on the page with the date checked.', items: [{ type: 'list', label: 'Sources', list: sourceList(guide.sources) }] }] : []),
    ],
  });
});

// /service-areas, from src/data/serviceAreasContent.js (confirmed communities only).
{
  const areas = confirmedServiceAreas();
  pagesData.push({
    key: 'SERVICE_AREAS',
    title: 'Bridgeland Builders — Service Areas Page Copy',
    route: '/service-areas',
    description: 'The communities Bridgeland Builders serves and who issues building permits in each.',
    sections: [
      {
        heading: '1. Intro',
        notes: 'Opening text under the page hero (the hero itself is in src/pages/ServiceAreasPage.jsx).',
        items: [
          { type: 'para', label: 'Intro', text: plain(SERVICE_AREAS_CONTENT.intro) },
          ...(SERVICE_AREAS_CONTENT.introSource ? [{ type: 'list', label: 'Source', list: sourceList([SERVICE_AREAS_CONTENT.introSource]) }] : []),
        ],
      },
      {
        heading: '2. Who Issues Building Permits Where We Work',
        notes: 'One card per confirmed community.',
        items: areas.map((area) => ({
          type: 'para',
          label: `${area.name}${area.municipality && area.municipality !== area.name ? ` (${area.municipality})` : ''}`,
          text: [
            area.permitAuthority ? `Permits: ${area.permitAuthority}.` : '',
            plain(area.notes),
            area.permitUrl ? `Source: ${area.permitLabel || area.permitUrl} — ${area.permitUrl}${area.accessed ? ` (verified ${area.accessed})` : ''}` : '',
          ].filter(Boolean).join(' '),
        })),
      },
      ...((SERVICE_AREAS_CONTENT.faqs || []).length ? [{ heading: '3. Service Area Questions', notes: 'FAQ block.', items: faqItems(SERVICE_AREAS_CONTENT.faqs) }] : []),
    ],
  });
}

// /editorial-policy, from src/data/editorialPolicy.js.
pagesData.push({
  key: 'EDITORIAL_POLICY',
  title: 'Bridgeland Builders — Editorial Policy Page Copy',
  route: '/editorial-policy',
  description: 'How the site’s guides are written, sourced, checked and corrected.',
  sections: [
    {
      heading: '1. Page Hero & Summary',
      notes: `Last updated ${EDITORIAL_POLICY.lastUpdated}.`,
      items: [
        { type: 'label-value', label: 'Eyebrow', value: EDITORIAL_POLICY.hero.eyebrow },
        { type: 'label-value', label: 'Headline (H1)', value: `${EDITORIAL_POLICY.hero.title} ${EDITORIAL_POLICY.hero.highlight || ''}`.trim() },
        { type: 'para', label: 'Description', text: plain(EDITORIAL_POLICY.hero.description) },
        { type: 'list', label: EDITORIAL_POLICY.summaryTitle || 'Summary', list: (EDITORIAL_POLICY.summary || []).map(plain) },
      ],
    },
    ...(EDITORIAL_POLICY.sections || []).map((section, i) => ({
      heading: `${i + 2}. ${plain(section.h2)}`,
      notes: 'Policy section.',
      items: blockItems(section.blocks),
    })),
    ...(EDITORIAL_POLICY.corrections ? [{
      heading: `${(EDITORIAL_POLICY.sections || []).length + 2}. ${plain(EDITORIAL_POLICY.corrections.h2) || 'Corrections'}`,
      notes: 'How to report a mistake.',
      items: [
        {
          type: 'para',
          label: 'Text',
          text: [EDITORIAL_POLICY.corrections.before, SITE_EMAIL, EDITORIAL_POLICY.corrections.after, EDITORIAL_POLICY.corrections.followUp].filter(Boolean).map(plain).join(' '),
        },
      ],
    }] : []),
  ],
});

// File ids: "NN_KEY", numbered in page order and zero-padded.
pagesData.forEach((page, i) => {
  page.id = `${String(i).padStart(2, '0')}_${page.key}`;
});

// -------------------------------------------------------------
// MARKDOWN GENERATOR
// -------------------------------------------------------------

function generateMarkdown(page) {
  let md = `# ${page.title}\n\n`;
  md += `> **Website:** Bridgeland Builders (Winnipeg, Manitoba)\n`;
  md += `> **Page Route / URL:** \`${page.route}\`\n`;
  md += `> **Purpose:** ${page.description}\n`;
  md += `> **Note for Editor (Graeme):** Feel free to adjust any of the wording below. Each section corresponds directly to the live component on the website.\n\n`;
  md += `---\n\n`;

  page.sections.forEach((section, sIdx) => {
    md += `## ${section.heading}\n\n`;
    if (section.notes) {
      md += `*Component Note: ${section.notes}*\n\n`;
    }

    section.items.forEach((item) => {
      if (item.type === 'label-value') {
        md += `**${item.label}:** ${item.value}\n\n`;
      } else if (item.type === 'para') {
        md += `### ${item.label}\n\n${item.text}\n\n`;
      } else if (item.type === 'list') {
        md += `### ${item.label}\n\n`;
        item.list.forEach((li) => {
          md += `- ${li}\n`;
        });
        md += `\n`;
      } else if (item.type === 'card') {
        md += `### ${item.title} (${item.category})\n\n`;
        md += `${item.copy}\n\n`;
        md += `*Action / CTA:* ${item.action}\n\n`;
      } else if (item.type === 'step') {
        md += `### Step ${item.num}: ${item.title}\n\n`;
        md += `${item.text}\n\n`;
      } else if (item.type === 'faq') {
        md += `### ${item.q}\n\n`;
        md += `**Answer:** ${item.a}\n\n`;
      } else if (item.type === 'callout') {
        md += `> **${item.title}:** ${item.text}\n\n`;
      }
    });

    md += `---\n\n`;
  });

  return md;
}

// -------------------------------------------------------------
// DOCX GENERATOR
// -------------------------------------------------------------

function generateDocx(page) {
  const children = [];

  children.push(docTitle(page.title));
  children.push(docSubtitle(`Bridgeland Builders • Winnipeg, Manitoba • URL: ${page.route}`));
  children.push(docCallout('Note for Graeme (Editor)', 'Feel free to edit any text directly in this document or in Google Docs. Every section below maps directly to the live website.'));
  children.push(docPara(''));

  page.sections.forEach((section) => {
    children.push(docH1(section.heading));
    if (section.notes) {
      children.push(docPara(`Component Note: ${section.notes}`, { italics: true, color: COLOR_MUTED }));
    }

    section.items.forEach((item) => {
      if (item.type === 'label-value') {
        children.push(docMeta(item.label, item.value));
      } else if (item.type === 'para') {
        children.push(docH3(item.label));
        children.push(docPara(item.text));
      } else if (item.type === 'list') {
        children.push(docH3(item.label));
        item.list.forEach((li) => {
          children.push(docBullet(li));
        });
      } else if (item.type === 'card') {
        children.push(docH2(`${item.title} [${item.category}]`));
        children.push(docPara(item.copy));
        children.push(docMeta('Action / Button', item.action));
      } else if (item.type === 'step') {
        children.push(docH2(`Step ${item.num}: ${item.title}`));
        children.push(docPara(item.text));
      } else if (item.type === 'faq') {
        children.push(docH2(item.q));
        children.push(docPara(`Answer: ${item.a}`));
      } else if (item.type === 'callout') {
        children.push(docCallout(item.title, item.text));
      }
    });

    children.push(docPara(''));
  });

  return new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });
}

// -------------------------------------------------------------
// MASTER DOCUMENT GENERATOR (ALL-IN-ONE)
// -------------------------------------------------------------

function generateMasterMarkdown(pages) {
  let md = `# Bridgeland Builders — Complete Website Master Copy\n\n`;
  md += `> **Company:** Bridgeland Builders (Winnipeg, Manitoba)\n`;
  md += `> **Prepared for:** Graeme & Team\n`;
  md += `> **Date:** ${new Date().toISOString().slice(0, 10)}\n`;
  md += `> **Purpose:** This document contains ALL text, headings, buttons, lists, testimonials, FAQs, and metadata across every page of the Bridgeland Builders website.\n\n`;
  md += `---\n\n`;

  md += `## Table of Contents\n\n`;
  pages.forEach((p, idx) => {
    md += `${idx + 1}. [${p.title}](#${p.id.toLowerCase().replace(/_/g, '-')}) (Route: \`${p.route}\`)\n`;
  });
  md += `\n---\n\n`;

  pages.forEach((page) => {
    md += `<a id="${page.id.toLowerCase().replace(/_/g, '-')}"></a>\n\n`;
    md += generateMarkdown(page);
    md += `\n\n\\pagebreak\n\n`;
  });

  return md;
}

function generateMasterDocx(pages) {
  const children = [];

  children.push(docTitle('Bridgeland Builders — Complete Website Master Copy'));
  children.push(docSubtitle('All Website Pages, Sections, FAQs, and Interactive Copy Compiled for Review and Editing'));
  children.push(docCallout('Prepared for Graeme', `This single document compiles the copy from all ${pages.length} website pages. You can edit this file directly or upload it to Google Drive to edit it in Google Docs.`));
  children.push(docPara(''));

  children.push(docH1('Table of Contents'));
  pages.forEach((p, idx) => {
    children.push(docBullet(`${idx + 1}. ${p.title} (${p.route})`));
  });

  children.push(new Paragraph({ children: [new PageBreak()] }));

  pages.forEach((page, pIdx) => {
    children.push(docTitle(page.title));
    children.push(docSubtitle(`Page Route: ${page.route}`));
    children.push(docPara(`Purpose: ${page.description}`));
    children.push(docPara(''));

    page.sections.forEach((section) => {
      children.push(docH1(section.heading));
      if (section.notes) {
        children.push(docPara(`Component Note: ${section.notes}`, { italics: true, color: COLOR_MUTED }));
      }

      section.items.forEach((item) => {
        if (item.type === 'label-value') {
          children.push(docMeta(item.label, item.value));
        } else if (item.type === 'para') {
          children.push(docH3(item.label));
          children.push(docPara(item.text));
        } else if (item.type === 'list') {
          children.push(docH3(item.label));
          item.list.forEach((li) => {
            children.push(docBullet(li));
          });
        } else if (item.type === 'card') {
          children.push(docH2(`${item.title} [${item.category}]`));
          children.push(docPara(item.copy));
          children.push(docMeta('Action / Button', item.action));
        } else if (item.type === 'step') {
          children.push(docH2(`Step ${item.num}: ${item.title}`));
          children.push(docPara(item.text));
        } else if (item.type === 'faq') {
          children.push(docH2(item.q));
          children.push(docPara(`Answer: ${item.a}`));
        } else if (item.type === 'callout') {
          children.push(docCallout(item.title, item.text));
        }
      });

      children.push(docPara(''));
    });

    if (pIdx < pages.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  });

  return new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });
}

// -------------------------------------------------------------
// MAIN EXECUTION
// -------------------------------------------------------------

async function run() {
  if (DRY_RUN) {
    // Builds every page's content (and the Markdown) without writing a file.
    for (const page of pagesData) {
      const sections = page.sections.length;
      const chars = generateMarkdown(page).length;
      console.log(`${page.id.padEnd(48)} ${page.route.padEnd(52)} ${sections} sections, ${chars} chars`);
    }
    console.log(`\n${pagesData.length} pages (dry run: nothing written to website_copy/)`);
    return;
  }
  console.log(`Starting generation for ${pagesData.length} pages...`);
  fs.mkdirSync(MD_DIR, { recursive: true });
  fs.mkdirSync(DOCX_DIR, { recursive: true });

  // 1. Generate individual Markdown files
  for (const page of pagesData) {
    const mdContent = generateMarkdown(page);
    const mdPath = path.join(MD_DIR, `${page.id}.md`);
    fs.writeFileSync(mdPath, mdContent, 'utf-8');
    console.log(`Saved Markdown: ${page.id}.md`);

    // 2. Generate individual DOCX files
    const doc = generateDocx(page);
    const buffer = await Packer.toBuffer(doc);
    const docxPath = path.join(DOCX_DIR, `${page.id}.docx`);
    fs.writeFileSync(docxPath, buffer);
    console.log(`Saved Word DOCX: ${page.id}.docx`);
  }

  // 3. Generate Master Markdown
  const masterMd = generateMasterMarkdown(pagesData);
  const masterMdPath = path.join(ROOT_DIR, 'website_copy', 'BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.md');
  fs.writeFileSync(masterMdPath, masterMd, 'utf-8');
  console.log('Saved Master Markdown: BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.md');

  // 4. Generate Master Word DOCX
  const masterDoc = generateMasterDocx(pagesData);
  const masterBuffer = await Packer.toBuffer(masterDoc);
  const masterDocxPath = path.join(ROOT_DIR, 'website_copy', 'BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.docx');
  fs.writeFileSync(masterDocxPath, masterBuffer);
  console.log('Saved Master Word DOCX: BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.docx');

  // 5. Generate Client Instructions README
  const readmeContent = `# Bridgeland Builders — Website Content & Copy Documents

This folder contains all copy and content from the **Bridgeland Builders** website, organized separately page by page, as well as in an all-in-one Master document.

## How to Share with Graeme via Google Drive

1. **Option A: Individual Page Documents (Recommended for targeted review)**
   - Upload the \`.docx\` files from \`word_docx/\` to your Google Drive folder.
   - Right-click each file in Google Drive and select **Open with > Google Docs**.
   - Google Drive will automatically convert them into Google Docs without any loss of formatting.
   - Click the **Share** button in Google Drive and add Graeme with **Editor** permissions.

2. **Option B: All-in-One Master Document**
   - Upload \`BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.docx\` to Google Drive.
   - Open it in Google Docs and share it directly with Graeme.
   - Graeme can review the entire site in a single document with a full Table of Contents.

3. **Option C: Markdown Files**
   - If you prefer Markdown, all raw \`.md\` files are available in the \`markdown/\` folder.

---

## File Directory

### Master Files:
- \`BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.docx\` (Master Word document containing all pages)
- \`BRIDGELAND_BUILDERS_WEBSITE_MASTER_COPY.md\` (Master Markdown document containing all pages)

### Individual Page Files:
| # | Page Name | Website Route | Markdown File | Word (.docx) File |
|---|---|---|---|---|
${pagesData
  .map((p) => `| ${p.id.slice(0, 2)} | ${p.title.replace(/^Bridgeland Builders — /, '')} | \`${p.route}\` | \`${p.id}.md\` | \`${p.id}.docx\` |`)
  .join('\n')}
`;
  fs.writeFileSync(path.join(ROOT_DIR, 'website_copy', 'README.md'), readmeContent, 'utf-8');
  console.log('Saved README: website_copy/README.md');

  console.log('All documents generated successfully!');
}

run().catch((err) => {
  console.error('Error generating copy documents:', err);
  process.exit(1);
});
