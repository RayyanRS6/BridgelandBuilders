import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import LeadConnectorForm from '../components/LeadConnectorForm.jsx';
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from '../components/icons.jsx';
import { REPLY_TIME, SITE_EMAIL, SITE_NAME, SITE_PHONE, SITE_PHONE_TEL } from '../data/facts.js';
import { MAILING_ADDRESS } from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';

// The GoHighLevel form on this page, which carries the SMS consent checkbox the
// Privacy Policy and Terms of Service point to (SMS_OPT_IN_PATH). Fill these in
// from the form's embed code: `src` is the iframe's src and `formId` its
// data-form-id. Until `src` is set, the card offers phone and email instead.
const CONTACT_FORM = {
  src: 'https://api.leadconnectorhq.com/widget/form/8P6zEkRy4MCd9GyRyAdF',
  formId: '8P6zEkRy4MCd9GyRyAdF',
  title: 'A2P Form',
  height: 928,
};

export default function GetInTouchPage() {
  usePageSeo('/contact');

  return (
    <main>
      <PageHero
        eyebrow="Get in Touch"
        title="SEND US"
        highlight="A MESSAGE"
        description={`Questions about a renovation, a quote, or a project we’re already working on? Send us a message and our team will get back to you within ${REPLY_TIME}.`}
        showQuote={false}
      />

      <section className="lead-section contact-direct-section">
        <div className="container">
          <div className="lead-grid">
            <div>
              <aside className="lead-aside">
                <span className="section-tag">Contact details</span>
                <h2>Talk to {SITE_NAME}</h2>
                <p>
                  We’re a renovation and construction company serving Winnipeg and nearby communities. Reach
                  us whichever way suits you.
                </p>
                <ul className="lead-aside-list">
                  <li className="lead-aside-item">
                    <span className="lead-aside-icon"><PhoneIcon size={16} strokeWidth="2" /></span>
                    <div>
                      <h3>Phone</h3>
                      <p><a href={SITE_PHONE_TEL}>{SITE_PHONE}</a></p>
                    </div>
                  </li>
                  <li className="lead-aside-item">
                    <span className="lead-aside-icon"><MailIcon size={16} /></span>
                    <div>
                      <h3>Email</h3>
                      <p><a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a></p>
                    </div>
                  </li>
                  <li className="lead-aside-item">
                    <span className="lead-aside-icon"><PinIcon size={16} /></span>
                    <div>
                      <h3>Mailing address</h3>
                      <p>
                        {MAILING_ADDRESS.street}<br />
                        {MAILING_ADDRESS.city}, {MAILING_ADDRESS.region} {MAILING_ADDRESS.postalCode}, {MAILING_ADDRESS.country}
                      </p>
                    </div>
                  </li>
                  <li className="lead-aside-item">
                    <span className="lead-aside-icon"><ClockIcon size={16} /></span>
                    <div>
                      <h3>Quick replies</h3>
                      <p>We get back to every message within {REPLY_TIME}.</p>
                    </div>
                  </li>
                </ul>
              </aside>
            </div>

            <div>
              <div className="lead-card">
                <div className="lead-card-head">
                  <h3>Send us a message</h3>
                  <p>Tell us a little about what you need and we’ll be in touch.</p>
                </div>

                {CONTACT_FORM.src ? (
                  <>
                    <LeadConnectorForm {...CONTACT_FORM} />
                    <p className="qf-fineprint contact-sms-terms">
                      By checking an SMS consent box above, you agree to receive text messages from {SITE_NAME}. Message
                      frequency may vary. Message and data rates may apply. Reply STOP at any time to unsubscribe or
                      HELP for help. We never share your mobile number or consent with third parties for marketing. See
                      our <Link to="/privacy-policy">Privacy Policy</Link> and{' '}
                      <Link to="/terms-of-service">Terms of Service</Link>.
                    </p>
                  </>
                ) : (
                  <div className="contact-direct-fallback">
                    <p>
                      Email us at <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a> or call{' '}
                      <a href={SITE_PHONE_TEL}>{SITE_PHONE}</a>, and we’ll get back to you within {REPLY_TIME}.
                    </p>
                    <div className="hero-cta-group">
                      <a className="btn-pill-red" href={`mailto:${SITE_EMAIL}`}>EMAIL US</a>
                      <a className="btn-pill-ghost" href={SITE_PHONE_TEL}>CALL {SITE_PHONE}</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
