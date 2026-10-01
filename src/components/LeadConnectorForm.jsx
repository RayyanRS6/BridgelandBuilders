import { useEffect } from 'react';

const EMBED_SCRIPT_SRC = 'https://link.msgsndr.com/js/form_embed.js';

/**
 * An inline LeadConnector (GoHighLevel) form, set up the way GoHighLevel's own
 * embed code does it. Their form_embed.js listens for messages from the form
 * iframe and resizes it to fit, so `height` is only the starting point. The
 * script only needs to be on the page once and keeps working for forms mounted
 * later, so it is never removed.
 */
export default function LeadConnectorForm({ src, formId, title, height = 620 }) {
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;

    const script = document.createElement('script');
    script.src = EMBED_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const iframeId = `inline-${formId}`;

  return (
    <div className="embed-frame">
      <iframe
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
        title={title}
      />
    </div>
  );
}
