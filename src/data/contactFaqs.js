// The three questions on /contact-us (plan §7): the free visit, how fast we
// reply, and where we go. Worded for that page, so no question and answer
// repeats one on /faqs. ContactPage.jsx renders them and passes them to
// usePageSeo; head.js must pass the same list for the prerendered FAQPage.
//
// Kept apart from faqs.js (which re-exports this list for existing imports):
// /contact-us imports this small module, so it never downloads the whole /faqs
// question set with its page.
import { NEARBY_AREAS_TEXT, OFFICE_HOURS_TEXT, REPLY_TIME, SITE_PHONE } from './facts.js';

export const CONTACT_FAQS = [
  {
    q: 'Is there a charge for the on-site visit?',
    a: 'No. The on-site visit is free, and so is the written quote that follows it. We come to your home or business at a time that suits you, look at the space with you and take measurements. There is no obligation to go ahead, and nothing starts until you approve the quote.',
  },
  {
    q: 'How soon will I hear back after I get in touch?',
    a: `Within ${REPLY_TIME}. We reply by phone, text or email, whichever you prefer, ask a few questions about the project and set up a time to see the space. Our office is open ${OFFICE_HOURS_TEXT}, and you can send your details through the form on this page at any time.`,
  },
  {
    q: 'Do you come out to my area?',
    a: `Yes, anywhere in Winnipeg and in nearby communities within about an hour of the city: ${NEARBY_AREAS_TEXT}. We come to your home or business for the free on-site visit. Further out? Call ${SITE_PHONE} and we will tell you honestly whether we can help.`,
    more: { label: 'See our service area', to: '/service-areas' },
  },
];
