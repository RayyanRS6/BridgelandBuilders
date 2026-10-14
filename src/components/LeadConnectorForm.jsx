import { useEffect, useRef } from 'react';
import { track } from '../lib/analytics.js';

const EMBED_SCRIPT_SRC = 'https://link.msgsndr.com/js/form_embed.js';

// Where GoHighLevel's form iframes post their messages from.
const FORM_ORIGIN = /^https:\/\/([a-z0-9-]+\.)*(leadconnectorhq\.com|msgsndr\.com)$/;

// The message the form iframe posts to form_embed.js once a submission has
// been saved: ['set-sticky-contacts', …], which GoHighLevel uses to remember
// the contact (marking the lead as collected) for its other forms.
const SUBMITTED_MESSAGE = 'set-sticky-contacts';

/**
 * An inline LeadConnector (GoHighLevel) form, set up the way GoHighLevel's own
 * embed code does it. Their form_embed.js listens for messages from the form
 * iframe and resizes it to fit, so `height` is only the starting point. The
 * script only needs to be on the page once and keeps working for forms mounted
 * later, so it is never removed.
 *
 * Sends contact_form_submit (src/lib/analytics.js) once when this form's
 * iframe reports a saved submission. Only listens: it never posts to the
 * iframe or changes how the form behaves.
 */
export default function LeadConnectorForm({ src, formId, title, height = 620 }) {
  const frameRef = useRef(null);

  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;

    const script = document.createElement('script');
    script.src = EMBED_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    let sent = false;
    const onMessage = (event) => {
      try {
        if (sent || !frameRef.current || event.source !== frameRef.current.contentWindow) return;
        if (!FORM_ORIGIN.test(event.origin)) return;
        if (!Array.isArray(event.data) || event.data[0] !== SUBMITTED_MESSAGE) return;
        sent = true;
        track('contact_form_submit', { form_id: formId, form_page: window.location.pathname });
      } catch {
        /* measurement must never affect the form */
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [formId]);

  const iframeId = `inline-${formId}`;

  return (
    <div className="embed-frame">
      <iframe
        ref={frameRef}
        src={src}
        id={iframeId}
        style={{ height }}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name={title}
        data-height={height}
        data-layout-iframe-id={iframeId}
        data-form-id={formId}
        data-cookie-consent="true"
        data-cookie-consent-provider="auto"
        title={title}
      />
    </div>
  );
}
