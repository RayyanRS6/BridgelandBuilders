import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import PolicyContact from '../components/PolicyContact.jsx';
import {
  SITE_ADDRESS_LINE,
  SITE_NAME,
  SITE_URL,
  SMS_CONFIRMATION,
  SMS_OPT_IN_PATH,
} from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

// Update this whenever the terms change.
const EFFECTIVE_DATE = 'October 2, 2026';

// The text-messaging clauses here (the box at the top and sections 6 to 9) are
// what our SMS (A2P 10DLC) registration is reviewed against. Keep their wording
// when editing, and keep them in step with section 1 of the Privacy Policy.

const OPT_IN_URL = `${SITE_URL}${SMS_OPT_IN_PATH}`;

export default function TermsOfServicePage() {
  usePageSeo('/terms-of-service');
  useScrollReveal();

  return (
    <main>
      <PageHero
        eyebrow="Terms of Service"
        title="THE TERMS FOR"
        highlight="USING OUR SITE"
        description="The rules for using our website and services, including how our text messages work and how to opt out."
        showConsultation={false}
      />

      <article className="blog-article-section">
        <div className="container blog-article-container">
          <div className="blog-article-body policy-body">
            <p className="policy-updated">Effective date: {EFFECTIVE_DATE}</p>

            <p>
              Welcome to our website. If you continue to browse and use this website, you agree to comply with and be
              bound by the following Terms and Conditions of use, which together with our{' '}
              <Link to="/privacy-policy">Privacy Policy</Link> govern {SITE_NAME}’s relationship with you in relation
              to this website. If you disagree with any part of these Terms and Conditions, please do not use our
              website. The terms “{SITE_NAME}”, “<a href={`${SITE_URL}/`}>{SITE_URL}/</a>”, “we”, “us”, or “our”
              refer to the owner of the website, whose office is located at {SITE_ADDRESS_LINE}. The term “you” refers
              to the user or viewer of our website. The use of this website is subject to the following terms of use.
            </p>
            <p>
              You should check this page from time to time. These Terms are effective from {EFFECTIVE_DATE}.
            </p>

            <aside className="blog-takeaways">
              <h2>Text messaging and your privacy</h2>
              <ul>
                <li>No mobile information will be shared with third parties or affiliates for marketing/promotional purposes.</li>
                <li>
                  Text messaging originator opt-in data and consent will not be shared with any third parties, except
                  for aggregators and providers of the Text Message services.
                </li>
              </ul>
            </aside>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using this website (<a href={`${SITE_URL}/`}>{SITE_URL}/</a>) or engaging our services,
              you agree to these Terms of Service (“Terms”), our <Link to="/privacy-policy">Privacy Policy</Link>, and
              any additional policies or guidelines posted on our website.
            </p>
            <p>If you do not agree with these Terms, please discontinue use of the website and our services.</p>

            <h2>2. About Our Services</h2>
            <p>
              {SITE_NAME} provides residential and commercial renovation and construction services in Winnipeg and
              across Manitoba. We pride ourselves on our attention to detail and commitment to customer satisfaction.
            </p>
            <p>
              All information on this website is provided for general informational purposes only and does not
              constitute legal, tax, or financial advice.
            </p>
            <p>
              Use of this website does not create a professional or advisory relationship. A formal engagement occurs
              only after:
            </p>
            <ul className="blog-list">
              <li>A written proposal or service agreement is issued</li>
              <li>Terms are accepted by both parties</li>
              <li>Services officially commence</li>
            </ul>

            <h2>3. Eligibility</h2>
            <p>You must be at least 18 years old to use this website or request services from {SITE_NAME}.</p>

            <h2>4. User Responsibilities</h2>
            <p>By using this website, you agree that you will not:</p>
            <ul className="blog-list">
              <li>Engage in unlawful, deceptive, or fraudulent activities</li>
              <li>Attempt unauthorized access to systems, accounts, or data</li>
              <li>Upload or transmit malware, viruses, or malicious code</li>
              <li>Copy, scrape, or reproduce website content without permission</li>
            </ul>
            <p>Unauthorized use may result in suspension, termination, or legal action.</p>

            <h2>5. Intellectual Property</h2>
            <p>
              All content on <a href={`${SITE_URL}/`}>{SITE_URL}/</a>, including text, graphics, logos, layouts,
              templates, documents, and materials, is the property of {SITE_NAME} or its licensors.
            </p>
            <p>You may not:</p>
            <ul className="blog-list">
              <li>Copy, reproduce, modify, distribute, or publish any materials</li>
              <li>Use content for commercial purposes without written consent</li>
            </ul>
            <p>Limited personal, non-commercial use is permitted.</p>

            <h2>6. Communications &amp; Messaging (SMS, Email, Phone)</h2>
            <p>
              By submitting your phone number and checking the consent checkbox on our contact form at{' '}
              <Link to={SMS_OPT_IN_PATH}>{OPT_IN_URL}</Link>, you agree to receive SMS text messages from {SITE_NAME}.
              These messages may include: service updates, appointment confirmations, document-related inquiries, and
              transactional or support messages.
            </p>
            <p>Upon opting in, you will receive a confirmation SMS: “{SMS_CONFIRMATION}”</p>
            <p>
              No mobile information will be shared with third parties or affiliates for marketing or promotional
              purposes. Text messaging originator opt-in data and consent will not be shared with any third parties,
              except for aggregators and providers of the text message services.
            </p>

            <h2>7. Opt-Out &amp; Support (SMS Terms)</h2>
            <p>
              You can cancel SMS messages at any time by replying STOP. After sending STOP, you will receive one final
              confirmation message and will no longer receive SMS from us. To re-subscribe, visit{' '}
              <Link to={SMS_OPT_IN_PATH}>{OPT_IN_URL}</Link> and opt in again.
            </p>
            <p>If you need assistance, reply HELP or contact us directly:</p>
            <PolicyContact short />

            <h2>8. Message Frequency &amp; Rates</h2>
            <p>
              Message frequency may vary depending on your interaction with our services. You may receive up to 4
              messages per month.
            </p>
            <p>
              As always, message and data rates may apply for any messages sent to you from us and to us from you.
            </p>
            <p>
              If you have any questions about your text plan or data plan, it is best to contact your wireless
              provider.
            </p>

            <h2>9. Carrier Liability</h2>
            <p>Mobile carriers are not liable for delayed or undelivered messages.</p>

            <h2>10. Quotes, Billing, and Payments</h2>
            <p>
              Quotes or proposals provided by {SITE_NAME} are valid only for the timeframe stated in the document.
            </p>
            <p>
              Payment terms, schedules, and accepted payment methods will be clearly defined in service agreements or
              invoices.
            </p>
            <p>Failure to pay invoices on time may result in service delays, suspension, or termination.</p>

            <h2>11. Service Modifications &amp; Availability</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the website or services at any time
              without prior notice.
            </p>
            <p>We do not guarantee that the website will always be available, uninterrupted, or error-free.</p>

            <h2>12. Third-Party Links</h2>
            <p>
              Our website may include links to third-party websites or tools. These resources are provided for user
              convenience and do not constitute endorsements.
            </p>
            <p>We are not responsible for the content, security, or privacy practices of external websites.</p>

            <h2>13. Disclaimer of Warranties</h2>
            <p>The website and all content are provided “as is” and “as available.”</p>
            <p>We make no warranties, express or implied, including but not limited to:</p>
            <ul className="blog-list">
              <li>Accuracy or completeness of information</li>
              <li>Fitness for a particular purpose</li>
              <li>Reliability or availability of the website</li>
            </ul>
            <p>Use the site and services at your own risk.</p>

            <h2>14. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, {SITE_NAME}, its owners, employees, and partners are not liable
              for any damages arising from:
            </p>
            <ul className="blog-list">
              <li>Use or inability to use the website</li>
              <li>Errors or omissions in website content</li>
              <li>Service interruptions, system failures, or data loss</li>
              <li>Decisions made based on website information</li>
            </ul>
            <p>In all cases, our liability is limited to the amount you paid for services, if applicable.</p>

            <h2>15. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless {SITE_NAME}, its employees, contractors, and affiliates from any
              claims, damages, losses, or expenses resulting from:
            </p>
            <ul className="blog-list">
              <li>Your violation of these Terms</li>
              <li>Misuse of the website or services</li>
              <li>Unauthorized access or actions taken using your information</li>
            </ul>

            <h2>16. Governing Law &amp; Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of the Province of Manitoba and the federal laws of Canada that apply
              there.
            </p>
            <p>
              Any disputes shall be resolved through binding arbitration in Winnipeg, Manitoba, unless otherwise
              required by law.
            </p>

            <h2>17. Termination</h2>
            <p>
              We may terminate or suspend access to the website or services at any time for violations, misuse, or
              unlawful activity.
            </p>
            <p>Upon termination, all use of the website must cease immediately.</p>

            <h2>18. Privacy Policy</h2>
            <p>
              Please review our <Link to="/privacy-policy">Privacy Policy</Link> for information on how we collect and
              use data.
            </p>

            <h2>19. Changes to These Terms</h2>
            <p>We may update these Terms at any time. Updates will be posted on this page with a revised effective date.</p>
            <p>Continued use of the website constitutes acceptance of the updated Terms.</p>

            <h2>20. Contact Information</h2>
            <p>For questions regarding these Terms, contact:</p>
            <PolicyContact />
          </div>
        </div>
      </article>
    </main>
  );
}
