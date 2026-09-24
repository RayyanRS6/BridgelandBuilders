import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import { CONSULTATION_PATH, SITE_NAME, SITE_PHONE } from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';

// Update this whenever the policy changes.
const LAST_UPDATED = 'September 25, 2026';

// Written for Canada's Personal Information Protection and Electronic Documents
// Act (PIPEDA), which covers private businesses in Manitoba. Every practice
// described here matches what the site actually does: the quote form and
// calendar (src/components/QuoteBookingForm.jsx -> GoHighLevel), the Meta Pixel
// (index.html), the LeadConnector chat widget, the PriceGuideX360 price guide,
// and the fonts and images loaded from Google, Unsplash and Wix. If any of those
// change, update this page.

const external = { target: '_blank', rel: 'noopener noreferrer' };

export default function PrivacyPolicyPage() {
  usePageSeo('/privacy-policy');

  return (
    <main>
      <PageHero
        eyebrow="Privacy Policy"
        title="HOW WE HANDLE"
        highlight="YOUR INFORMATION"
        description="What we collect when you use our website, why we collect it, who helps us handle it, and the choices you have."
        showConsultation={false}
      />

      <article className="blog-article-section">
        <div className="container blog-article-container">
          <div className="blog-article-body policy-body">
            <p className="policy-updated">Last updated: {LAST_UPDATED}</p>

            <aside className="blog-takeaways">
              <h2>The short version</h2>
              <ul>
                <li>We collect the details you give us so we can quote, schedule and carry out your project.</li>
                <li>We never sell your personal information.</li>
                <li>We use the Meta Pixel to measure our Facebook and Instagram ads.</li>
                <li>You can ask to see, correct or delete your information at any time.</li>
              </ul>
            </aside>

            <h2>Who we are</h2>
            <p>
              {SITE_NAME} is a renovation and construction company based in Winnipeg, Manitoba. This policy explains
              how we collect, use and protect personal information through our website, bridgelandbuilders.com,
              including our quote and booking form, our online price guide and our live chat. We handle personal
              information in line with Canada’s <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA).
            </p>

            <h2>Information you give us</h2>
            <ul className="blog-list">
              <li>
                <strong>Quote and booking form:</strong> your name, email address, phone number, project address,
                city and postal code, whether the project is in Winnipeg or Manitoba, the type of renovation, and —
                if you book a call — the time you choose.
              </li>
              <li>
                <strong>Price guide:</strong> your answers about the project and the contact details you enter to
                receive an estimate.
              </li>
              <li>
                <strong>Live chat:</strong> your name, contact details and anything you write in your messages.
              </li>
              <li>
                <strong>Calls, texts and emails:</strong> whatever you choose to share when you contact us directly.
              </li>
            </ul>

            <h2>Information collected automatically</h2>
            <ul className="blog-list">
              <li>
                <strong>Visits and actions on the site:</strong> the pages you view, and whether you submit the quote
                form or book a call (see “Cookies and advertising” below).
              </li>
              <li>
                <strong>Where you came from:</strong> if you arrive from one of our ads, the ad source in the link
                (for example “facebook”) is saved with your inquiry so we know which ads work.
              </li>
              <li>
                <strong>Technical details:</strong> your IP address, browser and device type, recorded in standard
                server logs by our website host for security and troubleshooting.
              </li>
            </ul>

            <h2>How we use your information</h2>
            <ul className="blog-list">
              <li>To respond to your inquiry, prepare quotes, and schedule discovery calls and on-site visits.</li>
              <li>To send appointment confirmations and reminders, and to follow up about your project by phone, text or email.</li>
              <li>To plan and carry out your renovation, and to stand behind our work afterwards.</li>
              <li>To understand which ads and pages bring people to us, and to show our ads to people likely to be interested.</li>
              <li>To keep the website working, secure and free of spam.</li>
              <li>To meet our legal, accounting and tax obligations.</li>
            </ul>
            <p>
              We only use your information for these purposes, or for others you agree to. We never sell or rent your
              personal information.
            </p>

            <h2>Cookies and advertising</h2>
            <p>
              <strong>Meta Pixel.</strong> Our website uses the Meta Pixel, a tool from Meta Platforms (the company behind
              Facebook and Instagram). When you visit, it tells Meta which pages you view and whether you submit our quote
              form or book a call. Meta may connect this with your Facebook or Instagram account — including by using a
              scrambled (hashed) version of contact details such as your email address or phone number — so we can measure
              how our ads perform and show our ads to you and to people with similar interests. Meta handles this
              information under its own{' '}
              <a href="https://www.facebook.com/privacy/policy/" {...external}>Privacy Policy</a>.
            </p>
            <p>
              <strong>Live chat.</strong> Our chat widget may use cookies or similar browser storage to keep your
              conversation going as you move around the site.
            </p>
            <p>
              <strong>Your choices.</strong> You can control the ads you see in your{' '}
              <a href="https://www.facebook.com/adpreferences" {...external}>Facebook ad preferences</a>, and you can block
              or delete cookies in your browser settings. Our quote form keeps working if you do.
            </p>

            <h2>Who we share it with</h2>
            <p>
              We share personal information only with service providers who help us run our business, and only what
              they need to do that:
            </p>
            <ul className="blog-list">
              <li>
                <strong>GoHighLevel (LeadConnector):</strong> our customer management system. It stores form
                submissions, bookings and chat conversations, and sends our appointment confirmations and messages.
              </li>
              <li><strong>Meta Platforms:</strong> advertising measurement through the Meta Pixel, described above.</li>
              <li><strong>Vercel:</strong> hosts our website and runs the secure server code behind our form.</li>
              <li>
                <strong>PriceGuideX360 by AutomateX360:</strong> powers our online price guide and passes estimate
                requests to our customer management system.
              </li>
              <li>
                <strong>Google Fonts, Unsplash and Wix:</strong> deliver the fonts and some of the images on our site.
                They receive your IP address when your browser loads them.
              </li>
            </ul>
            <p>
              We may also disclose information when the law requires it. Some of these providers store or process
              information outside Canada, including in the United States, where it may be accessible to authorities
              under the laws of those countries.
            </p>

            <h2>How long we keep it</h2>
            <p>
              We keep personal information only as long as we need it for the purposes above — for example, while we
              respond to your inquiry, carry out and warranty your project, and keep the business records the law
              requires. After that, we delete it or make it anonymous.
            </p>

            <h2>How we protect it</h2>
            <p>
              Our website uses an encrypted (HTTPS) connection, access to your information is limited to the people who
              need it to serve you, and we use established service providers with their own security safeguards. No
              system is perfectly secure, but we take reasonable steps to protect your information.
            </p>

            <h2>Your choices and rights</h2>
            <p>You can ask us at any time to:</p>
            <ul className="blog-list">
              <li>tell you what personal information we hold about you, and how we use it;</li>
              <li>correct anything that is inaccurate or incomplete;</li>
              <li>stop contacting you — you can also reply STOP to any text message from us;</li>
              <li>delete your information, unless we need to keep it for legal or warranty reasons.</li>
            </ul>
            <p>
              To make a request, call us at <a href={`tel:${SITE_PHONE}`}>{SITE_PHONE}</a>. We’ll respond within 30
              days. If you’re not satisfied with how we handle your information, you can contact the{' '}
              <a href="https://www.priv.gc.ca/" {...external}>Office of the Privacy Commissioner of Canada</a>.
            </p>

            <h2>Children</h2>
            <p>
              Our website and services are meant for adults. We don’t knowingly collect personal information from
              children.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this policy from time to time. The date at the top of this page shows when it last changed.
            </p>

            <h2>Contact us</h2>
            <p>
              Questions about this policy or your information? Call {SITE_NAME} at{' '}
              <a href={`tel:${SITE_PHONE}`}>{SITE_PHONE}</a> — we’re in Winnipeg, Manitoba. To talk about a project
              instead, <Link to={CONSULTATION_PATH}>book a free on-site consultation</Link>.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
