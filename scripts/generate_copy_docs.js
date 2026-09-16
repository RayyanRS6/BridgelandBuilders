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

import { PROJECTS } from '../src/data/projects.js';
import { SERVICE_CATEGORIES } from '../src/data/serviceCategories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MD_DIR = path.join(ROOT_DIR, 'website_copy', 'markdown');
const DOCX_DIR = path.join(ROOT_DIR, 'website_copy', 'word_docx');

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
// PAGE DEFINITIONS (STRUCTURED CONTENT)
// -------------------------------------------------------------

export const pagesData = [
  {
    id: '00_GLOBAL_ELEMENTS',
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
          {
            type: 'list',
            label: 'Services Mega-Menu — Residential Services',
            list: [
              'Basement renovations Winnipeg: Turn an unfinished or outdated basement into warm, dry, useful living space.',
              'Bathroom renovations Winnipeg: Well-planned bathrooms with reliable waterproofing, durable finishes, and practical storage.',
              'Home extensions Winnipeg: Add the room your home is missing with an extension designed to feel like it has always belonged.',
              'Kitchen renovations Winnipeg: Improve the layout, storage, lighting, and finishes in the hardest-working room in your home.',
              'Whole home renovations Winnipeg: Coordinate every room under one clear plan, one crew, and one consistent finish.',
            ],
          },
          {
            type: 'list',
            label: 'Services Mega-Menu — Commercial Services',
            list: [
              'Retail spaces Winnipeg: Customer-ready retail layouts, finishes, displays, and service areas.',
              'Office renovations Winnipeg: Workspaces, meeting rooms, lighting, and layouts built around your team.',
              'Restaurants & hospitality Winnipeg: Guest-facing spaces and back-of-house areas delivered around your operating schedule.',
              'Medical & dental offices Winnipeg: Professional clinical environments planned for workflow, privacy, and accessibility.',
              'Hotels Winnipeg: Guest rooms, common areas, and phased upgrades designed to limit disruption.',
              'Property managers & building owners Winnipeg: Reliable turnovers, common-area improvements, and multi-unit renovation support.',
              'Real estate developers & realtors Winnipeg: Practical improvements that prepare properties for sale, lease, or new occupancy.',
              'Architects & designers Winnipeg: Construction support that turns supplied drawings and specifications into finished spaces.',
            ],
          },
          {
            type: 'list',
            label: 'Services Mega-Menu — Additional Services',
            list: [
              'Windows and doors installation Winnipeg: Secure, weather-tight installations with clean interior and exterior finishing.',
              'Exterior painting Winnipeg: Careful preparation and durable exterior coatings suited to Winnipeg conditions.',
              'Stone, bricks, stucco & masonry Winnipeg: Repairs, upgrades, and new masonry finishes for homes and commercial properties.',
              'Flooring Winnipeg: Removal, preparation, and installation for durable, level, finished floors.',
              'Demolition Winnipeg: Controlled demolition, removal, and cleanup that leaves the space ready for its next stage.',
            ],
          },
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
              'HOME EXTENSIONS (/services/home-extensions)',
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
    id: '01_HOME_PAGE',
    title: 'Bridgeland Builders — Home Page Copy',
    route: '/',
    description: 'The main landing page of Bridgeland Builders website.',
    sections: [
      {
        heading: '1. Hero Section',
        notes: 'First impression at the top of the homepage.',
        items: [
          { type: 'label-value', label: 'Badge', value: 'Your Winnipeg Trusted Renovation and Construction Company' },
          { type: 'label-value', label: 'Headline (H1)', value: 'BRIDGING DREAMS INTO REALITY' },
          {
            type: 'para',
            label: 'Subtitle / Lead Paragraph',
            text: 'Bridgeland Builders can boast of excellence in the completion of every single project we undertake. Our expert team of professionals helps turn your ideas on paper to an actual structure. Our skillful work makes sure we leave every client satisfied and happy.',
          },
          { type: 'label-value', label: 'Primary Button CTA', value: 'GET INSTANT QUOTE (Opens instant quote modal)' },
          { type: 'label-value', label: 'Secondary Button CTA', value: 'Our Services (Links to /services)' },
          { type: 'label-value', label: 'Floating Trust Badge', value: '100% Satisfied Clients — Over 60 Years Combined Experience' },
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
        items: [
          { type: 'label-value', label: 'Stat 1', value: '60+ Years of combined experience' },
          { type: 'label-value', label: 'Stat 2', value: '100+ Projects completed across Winnipeg' },
          { type: 'label-value', label: 'Stat 3', value: '5★ 5-Star Rated client experience' },
          { type: 'label-value', label: 'Stat 4', value: '100% Satisfaction & clear communication' },
        ],
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
          { type: 'label-value', label: 'Section Title (H2)', value: 'Because we put the same care into your project as we would our own' },
          { type: 'label-value', label: 'Floating Badge', value: 'Honest Work: Good materials, clear communication, and no surprises.' },
          {
            type: 'para',
            label: 'Body Paragraph 1',
            text: 'Bridgeland Builders is the best renovation and construction company in Winnipeg Manitoba. We’re a local Winnipeg team that’s been building and renovating for a long time — over 60 years of combined experience between us. In that time, we’ve worked on more than 100 projects, from small home updates to big commercial jobs at one of the most reliable construction companies in Winnipeg Manitoba.',
          },
          {
            type: 'para',
            label: 'Body Paragraph 2',
            text: 'What you’ll notice when working with us is pretty simple: we use good materials, we don’t cut corners, and we keep you in the loop the whole way through. No surprises, no runaround — just honest work and clear communication.',
          },
          {
            type: 'para',
            label: 'Body Paragraph 3',
            text: 'For us, it’s never just about getting the job done and walking away. It’s about knowing you feel good every time you walk into your space. Home or business, big or small — we don’t pack up until it feels right for you.',
          },
          {
            type: 'list',
            label: 'Checklist Highlights',
            list: ['Over 60 Years Experience', '100+ Finished Projects', 'No Cutting Corners', 'Clear Communication'],
          },
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
        heading: '7. 5-Star Testimonial Spotlight',
        notes: 'Featured customer story on the homepage.',
        items: [
          { type: 'label-value', label: 'Rating Badge', value: '★★★★★ 5-Star Rated!' },
          { type: 'label-value', label: 'Headline', value: 'What our clients say about working with Bridgeland Builders in Winnipeg.' },
          {
            type: 'para',
            label: 'Client Quote',
            text: '“Working with Bridgeland Builders was an incredible experience. Their team demonstrated unmatched expertise and professionalism throughout the entire renovation process. From the initial consultation to the final walkthrough, they kept us informed and ensured every detail reflected our vision. The quality of craftsmanship and materials exceeded our expectations, and their commitment to customer satisfaction truly sets them apart. We couldn’t be happier with our newly transformed space—thank you, Bridgeland Builders!”',
          },
          { type: 'label-value', label: 'Author', value: 'Marvin V.' },
          { type: 'label-value', label: 'Author Title', value: 'Verified Homeowner ★★★★★' },
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
              'Home Extension: More room, built to feel like it was always there (Link: /services/home-extensions)',
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
    id: '02_SERVICES_OVERVIEW',
    title: 'Bridgeland Builders — Services Overview Page Copy',
    route: '/services',
    description: 'The master directory of all residential, commercial, and additional construction services.',
    sections: [
      {
        heading: '1. Page Hero',
        notes: 'Header area introducing the full service catalogue.',
        items: [
          { type: 'label-value', label: 'Eyebrow', value: 'Renovation & Construction' },
          { type: 'label-value', label: 'Headline (H1)', value: 'SERVICES BUILT AROUND YOUR SPACE' },
          { type: 'label-value', label: 'Description', value: 'Explore residential, commercial, and specialty renovation services delivered by our experienced Winnipeg team.' },
          { type: 'label-value', label: 'Primary CTA Link', value: 'VIEW OUR PROJECTS (/projects)' },
        ],
      },
      {
        heading: '2. Service Directory — Category 1: Residential Renovations',
        notes: 'Core home renovation offerings.',
        items: [
          { type: 'label-value', label: 'Category Label', value: 'Residential renovations (5 services)' },
          { type: 'label-value', label: 'Category Description', value: 'Thoughtful renovations that make your home work better, feel better, and hold up to everyday life.' },
          {
            type: 'list',
            label: 'Services Included',
            list: [
              'Basement renovations Winnipeg: Turn an unfinished or outdated basement into warm, dry, useful living space. (Page: /services/basement-renovations)',
              'Bathroom renovations Winnipeg: Well-planned bathrooms with reliable waterproofing, durable finishes, and practical storage. (Page: /services/bathroom-renovations)',
              'Home extensions Winnipeg: Add the room your home is missing with an extension designed to feel like it has always belonged. (Page: /services/home-extensions)',
              'Kitchen renovations Winnipeg: Improve the layout, storage, lighting, and finishes in the hardest-working room in your home. (Page: /services/kitchen-renovations)',
              'Whole home renovations Winnipeg: Coordinate every room under one clear plan, one crew, and one consistent finish. (Page: /services/whole-home-renovations)',
            ],
          },
        ],
      },
      {
        heading: '3. Service Directory — Category 2: Commercial Renovations',
        notes: 'Commercial fit-outs and business construction.',
        items: [
          { type: 'label-value', label: 'Category Label', value: 'Commercial renovations (8 services)' },
          { type: 'label-value', label: 'Category Description', value: 'Commercial spaces planned around your opening date, operating hours, customers, and staff.' },
          { type: 'label-value', label: 'Category Overview Link', value: 'Commercial overview (/services/commercial-renovations)' },
          {
            type: 'list',
            label: 'Services Included',
            list: [
              'Retail spaces Winnipeg: Customer-ready retail layouts, finishes, displays, and service areas.',
              'Office renovations Winnipeg: Workspaces, meeting rooms, lighting, and layouts built around your team.',
              'Restaurants & hospitality Winnipeg: Guest-facing spaces and back-of-house areas delivered around your operating schedule.',
              'Medical & dental offices Winnipeg: Professional clinical environments planned for workflow, privacy, and accessibility.',
              'Hotels Winnipeg: Guest rooms, common areas, and phased upgrades designed to limit disruption.',
              'Property managers & building owners Winnipeg: Reliable turnovers, common-area improvements, and multi-unit renovation support.',
              'Real estate developers & realtors Winnipeg: Practical improvements that prepare properties for sale, lease, or new occupancy.',
              'Architects & designers Winnipeg: Construction support that turns supplied drawings and specifications into finished spaces.',
            ],
          },
        ],
      },
      {
        heading: '4. Service Directory — Category 3: Additional Services',
        notes: 'Specialized exterior and finish trades.',
        items: [
          { type: 'label-value', label: 'Category Label', value: 'Additional services (5 services)' },
          { type: 'label-value', label: 'Category Description', value: 'Focused exterior, finishing, and construction services delivered with the same attention to detail.' },
          {
            type: 'list',
            label: 'Services Included',
            list: [
              'Windows and doors installation Winnipeg: Secure, weather-tight installations with clean interior and exterior finishing.',
              'Exterior painting Winnipeg: Careful preparation and durable exterior coatings suited to Winnipeg conditions.',
              'Stone, bricks, stucco & masonry Winnipeg: Repairs, upgrades, and new masonry finishes for homes and commercial properties.',
              'Flooring Winnipeg: Removal, preparation, and installation for durable, level, finished floors.',
              'Demolition Winnipeg: Controlled demolition, removal, and cleanup that leaves the space ready for its next stage.',
            ],
          },
        ],
      },
      {
        heading: '5. Estimator & Price Guide Section',
        notes: 'Interactive planning widget embedded for clients.',
        items: [
          { type: 'label-value', label: 'Eyebrow', value: 'Free Price Guide' },
          { type: 'label-value', label: 'Title (H2)', value: 'Get Your Renovation Price Guide' },
          { type: 'label-value', label: 'Description', value: 'Not sure which category fits? Start with the overall estimator and tell us what you are planning. Select your project type and answer a few questions to receive a useful starting price range.' },
        ],
      },
      {
        heading: '6. Inspiration Gallery & Bottom CTA',
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

PROJECTS.forEach((proj, idx) => {
  const pluralSlug = proj.slug.endsWith('s') ? proj.slug : `${proj.slug}s`;
  pagesData.push({
    id: `0${idx + 3}_${pluralSlug.toUpperCase().replace(/-/g, '_')}`,
    title: `Bridgeland Builders — ${proj.breadcrumb} Page Copy`,
    route: `/services/${proj.slug === 'whole-home-renovation' ? 'whole-home-renovations' : proj.slug === 'bathroom-renovation' ? 'bathroom-renovations' : proj.slug === 'kitchen-renovation' ? 'kitchen-renovations' : proj.slug === 'basement-renovation' ? 'basement-renovations' : proj.slug === 'home-extension' ? 'home-extensions' : 'commercial-renovations'}`,
    description: `Dedicated landing page for ${proj.breadcrumb} with booking survey, detailed scope, process, testimonial, estimator, and FAQs.`,
    sections: [
      {
        heading: '1. Breadcrumb & Hero Section',
        notes: 'Top landing area with booking survey calendar.',
        items: [
          { type: 'label-value', label: 'Breadcrumb Path', value: `Home / Our Portfolio / ${proj.breadcrumb}` },
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
      {
        heading: `3. Why Choose Bridgeland for ${proj.breadcrumb}`,
        notes: 'Detailed pitch and philosophy.',
        items: [
          { type: 'label-value', label: 'Section Tag', value: proj.intro.tag },
          { type: 'label-value', label: 'Section Title (H2)', value: proj.intro.title },
          { type: 'label-value', label: 'Floating Badge', value: `${proj.intro.floatingTitle}: ${proj.intro.floatingText}` },
          ...proj.intro.paragraphs.map((p, i) => ({
            type: 'para',
            label: `Paragraph ${i + 1}`,
            text: p,
          })),
          {
            type: 'list',
            label: 'Service Checklist',
            list: proj.intro.checklist,
          },
          { type: 'label-value', label: 'CTA Button', value: 'CHECK AVAILABLE DATES' },
        ],
      },
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
      {
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
      },
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
      {
        heading: '7. Verified Client Testimonial',
        notes: 'Direct client review for this project category.',
        items: [
          { type: 'label-value', label: 'Rating', value: '★★★★★ 5-Star Rated!' },
          { type: 'para', label: 'Client Quote', text: proj.testimonial.quote },
          { type: 'label-value', label: 'Author', value: proj.testimonial.name },
          { type: 'label-value', label: 'Project / Role', value: proj.testimonial.role },
        ],
      },
      {
        heading: '8. Lead Consultation & Price Guide Section',
        notes: 'Side-by-side booking benefits and interactive price guide.',
        items: [
          { type: 'label-value', label: 'Aside Eyebrow', value: 'Book an appointment' },
          { type: 'label-value', label: 'Aside Heading', value: `Let’s talk about your ${proj.breadcrumb.toLowerCase()}` },
          {
            type: 'para',
            label: 'Aside Lead Text',
            text: 'Send us the details and we’ll come to the property, look at the space with you, and give you a straight answer on what it takes.',
          },
          {
            type: 'list',
            label: 'Client Guarantees & Benefits',
            list: [
              'Free, no-obligation visit: We come out, measure up, and talk it through. You decide after that.',
              'Reply within one business day: Emma gets back to you by phone, text, or email — your pick.',
              'Clear written quote: One price, itemised, with nothing hiding in the small print.',
              'Your details stay private: We use them to get back to you about this project. That’s it.',
              'Rather just call? 431-866-5644 — Winnipeg, Manitoba',
            ],
          },
          { type: 'label-value', label: 'Price Guide Card Heading', value: `Get Your Free ${proj.breadcrumb} Price Guide` },
          {
            type: 'para',
            label: 'Price Guide Card Text',
            text: 'Answer a few quick questions to receive a useful starting price range for your project. This planning guide is free and does not obligate you to proceed.',
          },
        ],
      },
      {
        heading: '9. Frequently Asked Questions',
        notes: `The questions homeowners ask most before booking a ${proj.breadcrumb.toLowerCase()}.`,
        items: [
          { type: 'label-value', label: 'Section Tag', value: 'Questions' },
          { type: 'label-value', label: 'Section Title (H2)', value: 'Frequently Asked Questions' },
          { type: 'label-value', label: 'Section Description', value: `The things people ask us most before booking a ${proj.breadcrumb.toLowerCase()}.` },
          ...proj.faqs.map((faq, i) => ({
            type: 'faq',
            q: `Q${i + 1}: ${faq.q}`,
            a: faq.a,
          })),
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
    id: '09_ABOUT_US',
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
        items: [
          { type: 'label-value', label: 'Stat 1', value: '60+ Years of combined experience' },
          { type: 'label-value', label: 'Stat 2', value: '100+ Projects completed across Winnipeg' },
          { type: 'label-value', label: 'Stat 3', value: '5★ 5-Star Rated client experience' },
          { type: 'label-value', label: 'Stat 4', value: '100% Satisfaction & clear communication' },
        ],
      },
      {
        heading: '3. Why Bridgeland Builders (Core Philosophy)',
        notes: 'The full story of Bridgeland Builders.',
        items: [
          { type: 'label-value', label: 'Section Tag', value: 'Why Bridgeland Builders?' },
          { type: 'label-value', label: 'Section Title (H2)', value: 'Because we put the same care into your project as we would our own' },
          { type: 'label-value', label: 'Floating Badge', value: 'Honest Work: Good materials, clear communication, and no surprises.' },
          {
            type: 'para',
            label: 'Paragraph 1',
            text: 'Bridgeland Builders is the best renovation and construction company in Winnipeg Manitoba. We’re a local Winnipeg team that’s been building and renovating for a long time — over 60 years of combined experience between us. In that time, we’ve worked on more than 100 projects, from small home updates to big commercial jobs at one of the most reliable construction companies in Winnipeg Manitoba.',
          },
          {
            type: 'para',
            label: 'Paragraph 2',
            text: 'What you’ll notice when working with us is pretty simple: we use good materials, we don’t cut corners, and we keep you in the loop the whole way through. No surprises, no runaround — just honest work and clear communication.',
          },
          {
            type: 'para',
            label: 'Paragraph 3',
            text: 'For us, it’s never just about getting the job done and walking away. It’s about knowing you feel good every time you walk into your space. Home or business, big or small — we don’t pack up until it feels right for you.',
          },
          {
            type: 'list',
            label: 'Core Standards Checklist',
            list: ['Over 60 Years Experience', '100+ Finished Projects', 'No Cutting Corners', 'Clear Communication'],
          },
          { type: 'label-value', label: 'CTA Button', value: 'GET INSTANT QUOTE' },
        ],
      },
      {
        heading: '4. Testimonial Spotlight & Bottom CTA',
        notes: 'Social proof and final action.',
        items: [
          { type: 'label-value', label: 'Testimonial Headline', value: '5-Star Rated! What our clients say about working with Bridgeland Builders in Winnipeg.' },
          {
            type: 'para',
            label: 'Testimonial Quote',
            text: '“Working with Bridgeland Builders was an incredible experience. Their team demonstrated unmatched expertise and professionalism throughout the entire renovation process. From the initial consultation to the final walkthrough, they kept us informed and ensured every detail reflected our vision. The quality of craftsmanship and materials exceeded our expectations, and their commitment to customer satisfaction truly sets them apart. We couldn’t be happier with our newly transformed space—thank you, Bridgeland Builders!”',
          },
          { type: 'label-value', label: 'Client', value: 'Marvin V. — Verified Homeowner ★★★★★' },
          { type: 'label-value', label: 'CTA Banner Headline', value: 'Get a free Quote Now!' },
          { type: 'label-value', label: 'CTA Banner Subtext', value: 'Contact Bridgeland Builders today. We’ll discuss your ideas, provide clear details, and get it done right.' },
          { type: 'label-value', label: 'CTA Button', value: 'GET INSTANT QUOTE' },
        ],
      },
    ],
  },
  {
    id: '10_OUR_PROCESS',
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
          { type: 'label-value', label: 'Testimonial Headline', value: '5-Star Rated! What our clients say about working with Bridgeland Builders in Winnipeg.' },
          { type: 'para', label: 'Testimonial Quote', text: '“Working with Bridgeland Builders was an incredible experience. Their team demonstrated unmatched expertise and professionalism throughout the entire renovation process. From the initial consultation to the final walkthrough, they kept us informed and ensured every detail reflected our vision. The quality of craftsmanship and materials exceeded our expectations, and their commitment to customer satisfaction truly sets them apart. We couldn’t be happier with our newly transformed space—thank you, Bridgeland Builders!”' },
          { type: 'label-value', label: 'Author', value: 'Marvin V. — Verified Homeowner ★★★★★' },
          { type: 'label-value', label: 'Bottom Banner Heading', value: 'Get a free Quote Now!' },
          { type: 'label-value', label: 'Bottom Banner CTA', value: 'GET INSTANT QUOTE' },
        ],
      },
    ],
  },
  {
    id: '11_OUR_PROJECTS',
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
              'Dedicated Page: /services/home-extensions',
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
    id: '12_FAQS',
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
    id: '13_CONTACT_US',
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
          { type: 'label-value', label: 'Aside Eyebrow', value: 'Book an appointment' },
          { type: 'label-value', label: 'Aside Heading', value: 'Let’s talk about your project' },
          {
            type: 'para',
            label: 'Intro Description',
            text: 'Send us the details and we’ll come to the property, look at the space with you, and give you a straight answer on what it takes.',
          },
          {
            type: 'list',
            label: 'Guarantees and Assurances',
            list: [
              'Free, no-obligation visit: We come out, measure up, and talk it through. You decide after that.',
              'Reply within one business day: Emma gets back to you by phone, text, or email — your pick.',
              'Clear written quote: One price, itemised, with nothing hiding in the small print.',
              'Your details stay private: We use them to get back to you about this project. That’s it.',
              'Rather just call? 431-866-5644 — Winnipeg, Manitoba',
            ],
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
  {
    id: '14_OUTSIDE_SERVICE_AREA',
    title: 'Bridgeland Builders — Outside Service Area Page Copy',
    route: '/outside-winnipeg',
    description: 'Polite explanation for visitors outside the Winnipeg operating zone.',
    sections: [
      {
        heading: '1. Service Area Notice Card',
        notes: 'Core message explaining focus on Winnipeg.',
        items: [
          { type: 'label-value', label: 'Eyebrow', value: 'Our current service area' },
          { type: 'label-value', label: 'Kicker', value: 'WE’RE SORRY' },
          { type: 'label-value', label: 'Headline (H1)', value: 'WE’RE NOT IN YOUR AREA YET.' },
          {
            type: 'para',
            label: 'Lead Paragraph',
            text: 'Right now, Bridgeland Builders serves Winnipeg exclusively. Keeping our work close to home helps us protect the quality, communication, and hands-on care every project deserves.',
          },
          {
            type: 'callout',
            label: 'Future Growth Note',
            title: 'We do plan to grow',
            text: 'As our team expands, we hope to bring the Bridgeland experience to more Manitoba communities. Thank you for thinking of us, and please check back as we grow.',
          },
          { type: 'label-value', label: 'Primary Button CTA', value: 'Back to Home (Links to /)' },
          { type: 'label-value', label: 'Secondary Button CTA', value: 'View Our Work (Links to /projects)' },
        ],
      },
      {
        heading: '2. Visual Location & Closing Acknowledgement',
        notes: 'Interactive pin label and closing thanks.',
        items: [
          { type: 'label-value', label: 'Service Location Label', value: 'Currently serving Winnipeg, Manitoba' },
          { type: 'label-value', label: 'Expansion Badge', value: 'More communities in the future' },
          { type: 'para', label: 'Closing Message', text: 'From our Winnipeg team, thank you for your understanding.' },
        ],
      },
    ],
  },
  {
    id: '15_404_PAGE',
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
  md += `> **Date:** September 2026\n`;
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
  children.push(docCallout('Prepared for Graeme', 'This single document compiles the copy from all 16 website pages. You can edit this file directly or upload it to Google Drive to edit it in Google Docs.'));
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
  console.log(`Starting generation for ${pagesData.length} pages...`);

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
| 00 | Global Elements (Header, Mega-Menu, Footer, Quote Modal) | Site-Wide | \`00_GLOBAL_ELEMENTS.md\` | \`00_GLOBAL_ELEMENTS.docx\` |
| 01 | Home Page | \`/\` | \`01_HOME_PAGE.md\` | \`01_HOME_PAGE.docx\` |
| 02 | Services Overview & Directory | \`/services\` | \`02_SERVICES_OVERVIEW.md\` | \`02_SERVICES_OVERVIEW.docx\` |
| 03 | Whole Home Renovations | \`/services/whole-home-renovations\` | \`03_WHOLE_HOME_RENOVATIONS.md\` | \`03_WHOLE_HOME_RENOVATIONS.docx\` |
| 04 | Bathroom Renovations | \`/services/bathroom-renovations\` | \`04_BATHROOM_RENOVATIONS.md\` | \`04_BATHROOM_RENOVATIONS.docx\` |
| 05 | Kitchen Renovations | \`/services/kitchen-renovations\` | \`05_KITCHEN_RENOVATIONS.md\` | \`05_KITCHEN_RENOVATIONS.docx\` |
| 06 | Basement Renovations | \`/services/basement-renovations\` | \`06_BASEMENT_RENOVATIONS.md\` | \`06_BASEMENT_RENOVATIONS.docx\` |
| 07 | Home Extensions | \`/services/home-extensions\` | \`07_HOME_EXTENSIONS.md\` | \`07_HOME_EXTENSIONS.docx\` |
| 08 | Commercial Renovations | \`/services/commercial-renovations\` | \`08_COMMERCIAL_RENOVATIONS.md\` | \`08_COMMERCIAL_RENOVATIONS.docx\` |
| 09 | About Us | \`/about-us\` | \`09_ABOUT_US.md\` | \`09_ABOUT_US.docx\` |
| 10 | Our Process | \`/our-process\` | \`10_OUR_PROCESS.md\` | \`10_OUR_PROCESS.docx\` |
| 11 | Our Projects / Inspiration | \`/projects\` | \`11_OUR_PROJECTS.md\` | \`11_OUR_PROJECTS.docx\` |
| 12 | Frequently Asked Questions | \`/faqs\` | \`12_FAQS.md\` | \`12_FAQS.docx\` |
| 13 | Contact Us & Free Quote Form | \`/contact-us\` | \`13_CONTACT_US.md\` | \`13_CONTACT_US.docx\` |
| 14 | Outside Service Area | \`/outside-winnipeg\` | \`14_OUTSIDE_SERVICE_AREA.md\` | \`14_OUTSIDE_SERVICE_AREA.docx\` |
| 15 | 404 Not Found Blueprint Page | \`/404\` | \`15_404_PAGE.md\` | \`15_404_PAGE.docx\` |
`;
  fs.writeFileSync(path.join(ROOT_DIR, 'website_copy', 'README.md'), readmeContent, 'utf-8');
  console.log('Saved README: website_copy/README.md');

  console.log('All documents generated successfully!');
}

run().catch((err) => {
  console.error('Error generating copy documents:', err);
  process.exit(1);
});
