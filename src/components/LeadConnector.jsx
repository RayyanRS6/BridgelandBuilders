import useFormEmbedScript from '../hooks/useFormEmbedScript.js';

// Bridgeland Builders' live LeadConnector (GoHighLevel) widgets.
export const BOOKING_SURVEY_ID = 'AWCtvdzsDQtAdqsQyQYL';
export const LEAD_FORM_ID = 'Vrh78LgQEwOecW55Ttx3';
export const LEAD_FORM_NAME = 'Lead Generation Form new website';

// Booking calendar — appointments are scheduled inside the widget itself.
export function BookingSurvey({ heading, subheading }) {
  useFormEmbedScript();

  return (
    <div className="booking-card">
      <div className="booking-card-head">
        <h3>{heading}</h3>
        <p>{subheading}</p>
      </div>
      <div className="embed-frame embed-frame-booking">
        <iframe
          src={`https://api.leadconnectorhq.com/widget/survey/${BOOKING_SURVEY_ID}`}
          scrolling="no"
          id={BOOKING_SURVEY_ID}
          title="Book a free on-site consultation with Bridgeland Builders"
          data-cookie-consent="true"
          data-cookie-consent-provider="auto"
        />
      </div>
    </div>
  );
}

// Lead capture form. Each embed on the page needs its own element id, so callers
// pass one in — the page form and the quote modal can then both be mounted.
export function LeadFormEmbed({ instanceId = `inline-${LEAD_FORM_ID}` }) {
  useFormEmbedScript();

  return (
    <div className="embed-frame embed-frame-form">
      <iframe
        src={`https://api.leadconnectorhq.com/widget/form/${LEAD_FORM_ID}`}
        id={instanceId}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name={LEAD_FORM_NAME}
        data-height="831"
        data-layout-iframe-id={instanceId}
        data-form-id={LEAD_FORM_ID}
        data-cookie-consent="true"
        data-cookie-consent-provider="auto"
        title={LEAD_FORM_NAME}
      />
    </div>
  );
}
