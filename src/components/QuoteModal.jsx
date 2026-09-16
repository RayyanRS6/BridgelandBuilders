import { LEAD_FORM_ID, LeadFormEmbed } from './LeadConnector.jsx';

export default function QuoteModal({ isOpen, closeModal }) {
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className={`modal-overlay modal-overlay-embed${isOpen ? ' active' : ''}`}
      id="quoteModal"
      onClick={handleOverlayClick}
    >
      <div className="modal-card modal-card-embed">
        <button className="modal-close-btn" id="modalCloseBtn" aria-label="Close Modal" onClick={closeModal}>&times;</button>
        <div className="modal-header">
          <h3>GET INSTANT QUOTE</h3>
          <p>Hi! Tell us a little about your project and we’ll reach out directly.</p>
        </div>

        {/* Mounted on open so the widget isn't loaded on every page view, and so its
            element id never collides with the same form embedded in the page. */}
        {isOpen && <LeadFormEmbed instanceId={`inline-${LEAD_FORM_ID}-modal`} />}
      </div>
    </div>
  );
}
