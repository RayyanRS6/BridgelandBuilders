import { useEffect } from 'react';

export const EMBED_SCRIPT_SRC = 'https://link.msgsndr.com/js/form_embed.js';

// LeadConnector's embed script listens for messages from the widget iframes and
// resizes them to fit their content. It only needs to be on the page once, and it
// keeps working for iframes mounted later, so we never remove it.
export default function useFormEmbedScript() {
  useEffect(() => {
    if (document.querySelector(`script[src="${EMBED_SCRIPT_SRC}"]`)) return;

    const script = document.createElement('script');
    script.src = EMBED_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);
}
