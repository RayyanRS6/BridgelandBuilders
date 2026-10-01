import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import PolicyContact from '../components/PolicyContact.jsx';
import {
  CONSULTATION_PATH,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE,
  SITE_PHONE_E164,
  SITE_URL,
  SMS_CONFIRMATION,
  SMS_OPT_IN_PATH,
} from '../data/siteConfig.js';
import { usePageSeo } from '../hooks/useSeo.js';
import useScrollReveal from '../hooks/useScrollReveal.js';

// Update this whenever the policy changes.
const LAST_UPDATED = 'October 2, 2026';

// Written for Canada's Personal Information Protection and Electronic Documents
// Act (PIPEDA), which covers private businesses in Manitoba. Every practice
// described here matches what the site actually does: the contact form
// (src/pages/GetInTouchPage.jsx), the quote form and calendar
// (src/components/QuoteBookingForm.jsx -> GoHighLevel), the Meta Pixel
// (index.html, skipped when the browser sends Do Not Track), the LeadConnector
// chat widget, the PriceGuideX360 price guide, and the fonts and images loaded
// from Google, Unsplash and Wix. If any of those change, update this page.
//
// The text-messaging clauses (section 1, and the SMS lines in sections 8 and 9)
// are what our SMS (A2P 10DLC) registration is reviewed against. Keep their
// wording when editing, and keep them in step with the Terms of Service.

const external = { target: '_blank', rel: 'noopener noreferrer' };
const OPT_IN_URL = `${SITE_URL}${SMS_OPT_IN_PATH}`;

export default function PrivacyPolicyPage() {
  usePageSeo('/privacy-policy');
  useScrollReveal();

  const email = <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>;
  const phone = <a href={`tel:${SITE_PHONE_E164}`}>{SITE_PHONE}</a>;

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
                <li>We only text you if you opt in, we never share your mobile number or consent for marketing, and you can reply STOP at any time.</li>
                <li>We use the Meta Pixel to measure our Facebook and Instagram ads.</li>
                <li>You can ask to see, correct or delete your information at any time.</li>
              </ul>
            </aside>

            <p>
              This privacy policy has been compiled to better serve those who are concerned with how their ‘Personally
              Identifiable Information’ (PII) is being used online. PII, as used in US privacy law and information
              security, is information that can be used on its own or with other information to identify, contact, or
              locate a single person, or to identify an individual in context. Please read our privacy policy carefully
              to get a clear understanding of how we collect, use, protect or otherwise handle your Personally
              Identifiable Information in accordance with our website.
            </p>
            <p>
              {SITE_NAME} is a renovation and construction company based in Winnipeg, Manitoba. This policy covers our
              website, bridgelandbuilders.com, including our contact, quote and booking forms, our online price guide,
              our live chat and our text messages. We handle personal information in line with Canada’s{' '}
              <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA).
            </p>

            <h2>1. SMS / Text Messaging</h2>
            <blockquote>
              No mobile information will be shared with third parties/affiliates for marketing/promotional purposes.
              Information sharing to subcontractors in support services, such as customer service, is permitted. All
              other use case categories exclude text messaging originator opt-in data and consent; this information
              will not be shared with any third parties.
            </blockquote>
            <p>
              Users can opt in to receive SMS text messages by visiting{' '}
              <Link to={SMS_OPT_IN_PATH}>{OPT_IN_URL}</Link>, entering their phone number, and checking the consent
              checkbox on the form. By checking the box, the user agrees to receive text messages from {SITE_NAME}.
            </p>
            <p>
              After opting in, users will receive a confirmation SMS message. Message frequency may vary. Message and
              data rates may apply. Reply STOP at any time to unsubscribe. Reply HELP for assistance.
            </p>
            <p>Upon opting in, the user will receive a confirmation message: “{SMS_CONFIRMATION}”</p>

            <h2>2. What personal information do we collect from the people that visit our website?</h2>
            <p>
              When you contact us, request a quote, book a consultation or use other features of our site, as
              appropriate, you may be asked to enter your name, email address, mailing or project address, phone number
              or other details to help you with your experience. In particular:
            </p>
            <ul className="blog-list">
              <li>
                <strong>Contact form:</strong> your name, contact details, your message and, if you tick the box, your
                consent to receive text messages from us.
              </li>
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
            <p>We also collect some information automatically:</p>
            <ul className="blog-list">
              <li>
                <strong>Visits and actions on the site:</strong> the pages you view, and whether you submit the quote
                form or book a call (see section 7, “Do we use cookies?”).
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

            <h2>3. When do we collect information?</h2>
            <p>
              We collect information from you when you fill out a form on our site, such as our contact, quote or
              booking form; book an appointment; request an estimate from our price guide; chat with us; opt in to text
              messages; or otherwise enter information on our site. We also collect it when you call, text or email us.
            </p>

            <h2>4. How do we use your information?</h2>
            <p>
              We may use the information we collect from you when you contact us, request a quote, book an
              appointment, respond to a survey or marketing communication, surf the website, or use certain other site
              features in the following ways:
            </p>
            <ul className="blog-list">
              <li>To personalize your experience and to allow us to deliver the type of content and service offerings in which you are most interested.</li>
              <li>To respond to your inquiries and customer service requests, prepare quotes, and schedule discovery calls and on-site visits.</li>
              <li>To send appointment confirmations and reminders, and to follow up about your project by phone, email or — if you have opted in — text message.</li>
              <li>To plan and carry out your renovation, process your transactions, and stand behind our work afterwards.</li>
              <li>To administer a promotion, survey or other site feature.</li>
              <li>To send periodic emails regarding your project or our other services.</li>
              <li>To send promotional messages, such as special offers and discounts, by email or — if you have opted in to marketing texts — text message.</li>
              <li>To understand which ads and pages bring people to us, and to show our ads to people likely to be interested.</li>
              <li>To keep the website working, secure and free of spam.</li>
              <li>To meet our legal, accounting and tax obligations.</li>
            </ul>
            <p>
              We only use your information for these purposes, or for others you agree to. We never sell or rent your
              personal information.
            </p>

            <h2>5. How do we protect visitor information?</h2>
            <p>
              Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make
              your visit to our site as safe as possible. We use regular malware scanning.
            </p>
            <p>
              Your personal information is contained behind secured networks and is only accessible by a limited number
              of persons who have special access rights to such systems, and are required to keep the information
              confidential. In addition, all sensitive information you supply is encrypted via Secure Socket Layer
              (SSL/TLS) technology, and our whole website is served over an encrypted (HTTPS) connection.
            </p>
            <p>
              We implement a variety of security measures when a user enters, submits, or accesses their information
              to maintain the safety of your personal information, and we use established service providers with their
              own security safeguards. No system is perfectly secure, but we take reasonable steps to protect your
              information.
            </p>
            <p>
              We do not take payments through this website. Any card transactions are processed through a gateway
              provider and are not stored or processed on our servers.
            </p>

            <h2>6. How long do we keep your information?</h2>
            <p>
              We keep personal information only as long as we need it for the purposes above — for example, while we
              respond to your inquiry, carry out and warranty your project, and keep the business records the law
              requires. After that, we delete it or make it anonymous.
            </p>

            <h2>7. Do we use ‘cookies’?</h2>
            <p>
              Yes. Cookies are small files that a site or its service provider transfers to your computer’s hard drive
              through your web browser (if you allow) that enables the site’s or service provider’s systems to
              recognize your browser and capture and remember certain information. They help us understand your
              preferences based on previous or current site activity, which enables us to provide you with improved
              services. We also use cookies to help us compile aggregate data about site traffic and site interaction
              so that we can offer better site experiences and tools in the future.
            </p>
            <p>We use cookies to:</p>
            <ul className="blog-list">
              <li>Understand and save your preferences for future visits.</li>
              <li>Keep track of advertisements.</li>
              <li>
                Compile aggregate data about site traffic and site interactions in order to offer better site
                experiences and tools in the future. We may also use trusted third-party services that track this
                information on our behalf.
              </li>
            </ul>
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
              <strong>Your choices.</strong> You can choose to have your computer warn you each time a cookie is being
              sent, or you can choose to turn off all cookies. You do this through your browser settings. Each browser
              is a little different, so look at your browser’s Help menu to learn the correct way to modify your
              cookies. You can also control the ads you see in your{' '}
              <a href="https://www.facebook.com/adpreferences" {...external}>Facebook ad preferences</a>.
            </p>
            <p>
              <strong>If you disable cookies:</strong> some features that make your site experience more efficient may
              not function properly. Our forms keep working, and you can always reach us by phone at {phone} or by
              email at {email}.
            </p>

            <h2>8. Third-party disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information
              unless we provide you with advance notice. This does not include website hosting partners and other
              parties who assist us in operating our website, conducting our business, or servicing you, so long as
              those parties agree to keep this information confidential. We may also release your information when we
              believe release is appropriate to comply with the law, enforce our site policies, or protect ours or
              others’ rights, property, or safety.
            </p>
            <p>
              No mobile information will be shared with third parties or affiliates for marketing or promotional
              purposes, and text messaging originator opt-in data and consent are never shared with any third parties.
            </p>
            <p>
              However, non-personally identifiable visitor information may be provided to other parties for marketing,
              advertising, or other uses.
            </p>
            <h3>Service providers we work with</h3>
            <p>
              These providers help us run our business, and receive only what they need to do that:
            </p>
            <ul className="blog-list">
              <li>
                <strong>GoHighLevel (LeadConnector):</strong> our customer management system. It stores form
                submissions, bookings and chat conversations, and sends our appointment confirmations, emails and text
                messages.
              </li>
              <li><strong>Meta Platforms:</strong> advertising measurement through the Meta Pixel, described in section 7.</li>
              <li><strong>Vercel:</strong> hosts our website and runs the secure server code behind our quote form.</li>
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
              Some of these providers store or process information outside Canada, including in the United States,
              where it may be accessible to authorities under the laws of those countries.
            </p>
            <h3>Third-party links</h3>
            <p>
              Occasionally, at our discretion, we may include or offer third-party products or services on our website.
              These third-party sites have separate and independent privacy policies. We therefore have no
              responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to
              protect the integrity of our site and welcome any feedback about these sites.
            </p>

            <h2>9. Opting out</h2>
            <p>
              Reply STOP at any time to unsubscribe from SMS messages from {SITE_NAME}. You will receive a final
              confirmation message and no further messages will be sent. To re-subscribe, visit{' '}
              <Link to={SMS_OPT_IN_PATH}>{OPT_IN_URL}</Link> and opt in again.
            </p>
            <p>
              For email communications, contact us at {email} and we will promptly remove you from all correspondence.
            </p>

            <h2>10. Your privacy rights</h2>
            <p>You can ask us at any time to:</p>
            <ul className="blog-list">
              <li>tell you what personal information we hold about you, and how we use it;</li>
              <li>correct anything that is inaccurate or incomplete;</li>
              <li>stop contacting you — you can also reply STOP to any text message from us;</li>
              <li>delete your information, unless we need to keep it for legal or warranty reasons.</li>
            </ul>
            <p>
              To make a request, email us at {email} or call us at {phone}. We’ll respond within 30 days. If you’re not
              satisfied with how we handle your information, you can contact the{' '}
              <a href="https://www.priv.gc.ca/" {...external}>Office of the Privacy Commissioner of Canada</a>.
            </p>

            <h2>11. California Online Privacy Protection Act</h2>
            <p>
              CalOPPA is the first state law in the nation to require commercial websites and online services to post a
              privacy policy. The law’s reach stretches well beyond California to require any person or company in the
              United States (and conceivably the world) that operates websites collecting personally identifiable
              information from California consumers to post a conspicuous privacy policy on its website stating exactly
              the information being collected and those individuals or companies with whom it is being shared, and to
              comply with this policy.
            </p>
            <p>According to CalOPPA, we agree to the following:</p>
            <ul className="blog-list">
              <li>Users can visit our site anonymously.</li>
              <li>A link to this privacy policy appears on our home page and on every other page of our website.</li>
              <li>Our Privacy Policy link includes the word ‘Privacy’, and can easily be found on the pages specified above.</li>
            </ul>
            <p>Users will be notified of any privacy policy changes:</p>
            <ul className="blog-list">
              <li>On our Privacy Policy page</li>
            </ul>
            <p>Users are able to change their personal information:</p>
            <ul className="blog-list">
              <li>By emailing us at {email}</li>
              <li>By calling us at {phone}</li>
            </ul>

            <h2>12. How does our site handle Do Not Track signals?</h2>
            <p>
              We honor Do Not Track signals and do not track, plant advertising cookies, or use advertising when a Do
              Not Track (DNT) browser mechanism is in place: when your browser sends a DNT signal, our website does not
              load the Meta Pixel. Features you choose to use, such as live chat, may still use the browser storage they
              need to work.
            </p>

            <h2>13. Does our site allow third-party behavioral tracking?</h2>
            <p>
              It’s also important to note that we allow third-party behavioral tracking: the Meta Pixel described in
              section 7 lets Meta Platforms record visits to our site and use them to show you our ads on Facebook and
              Instagram, unless your browser sends a Do Not Track signal.
            </p>

            <h2>14. COPPA (Children’s Online Privacy Protection Act)</h2>
            <p>
              When it comes to the collection of personal information from children under 13, the Children’s Online
              Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, the United States’
              consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and
              online services must do to protect children’s privacy and safety online.
            </p>
            <p>
              We do not specifically market to children under 13. Our website and services are meant for adults, and
              we don’t knowingly collect personal information from children.
            </p>

            <h2>15. Fair Information Practices</h2>
            <p>
              The Fair Information Practices Principles form the backbone of privacy law in the United States and the
              concepts they include have played a significant role in the development of data protection laws around
              the globe. Understanding the Fair Information Practice Principles and how they should be implemented is
              critical to comply with the various privacy laws that protect personal information.
            </p>
            <p>
              In order to be in line with Fair Information Practices, we will take the following responsive action
              should a data breach occur:
            </p>
            <ul className="blog-list">
              <li>We will notify affected users via email within 7 business days.</li>
              <li>We will notify users via an in-site notification within 7 business days.</li>
            </ul>
            <p>
              We also agree to the Individual Redress Principle, which requires that individuals have the right to
              legally pursue enforceable rights against data collectors and processors who fail to adhere to the law.
              This principle requires not only that individuals have enforceable rights against data users, but also
              that individuals have recourse to courts or government agencies to investigate and/or prosecute
              non-compliance by data processors.
            </p>

            <h2>16. CAN-SPAM Act</h2>
            <p>
              The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for
              commercial messages, gives recipients the right to have emails stopped from being sent to them, and
              spells out tough penalties for violations.
            </p>
            <p>We collect your email address in order to:</p>
            <ul className="blog-list">
              <li>Send information, and respond to inquiries and other requests or questions.</li>
              <li>Send appointment confirmations, quotes and updates about your project.</li>
              <li>Send you additional information related to our services.</li>
            </ul>
            <p>To be in accordance with CAN-SPAM, we agree to the following:</p>
            <ul className="blog-list">
              <li>Not use false or misleading subjects or email addresses.</li>
              <li>Include the physical address of our business in our marketing emails.</li>
              <li>Honor opt-out and unsubscribe requests quickly.</li>
            </ul>
            <p>
              If at any time you would like to unsubscribe from receiving future emails or SMS texts, you can contact
              us at {email} and we will promptly remove you from ALL correspondence.
            </p>

            <h2>17. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. The date at the top of this page shows when it last changed.
            </p>

            <h2>18. Contacting us</h2>
            <p>
              If there are any questions regarding this privacy policy, you may contact us using the information below.
            </p>
            <PolicyContact />
            <p>
              To talk about a project instead, <Link to={CONSULTATION_PATH}>book a free on-site consultation</Link>.
              You can also read our <Link to="/terms-of-service">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
