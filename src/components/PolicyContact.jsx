import {
  SITE_ADDRESS_LINE,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE,
  SITE_PHONE_E164,
  SITE_URL,
} from '../data/siteConfig.js';

/**
 * The business's contact details as the Privacy Policy and Terms of Service
 * list them. `short` drops the name, website and address, for places that only
 * need a way to reach us.
 */
export default function PolicyContact({ short = false }) {
  return (
    <address className="policy-contact">
      {!short && <strong>{SITE_NAME}</strong>}
      <span>Email: <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a></span>
      <span>Phone: <a href={`tel:${SITE_PHONE_E164}`}>+1 {SITE_PHONE}</a></span>
      {!short && <span>Website: <a href={`${SITE_URL}/`}>{SITE_URL}/</a></span>}
      {!short && <span>Address: {SITE_ADDRESS_LINE}</span>}
    </address>
  );
}
