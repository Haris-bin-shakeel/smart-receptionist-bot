import React from "react";

const StickyCTA = () => (
  <>
    <a
      href="mailto:harisshakeel0981@gmail.com"
      className="sticky-cta email"
      aria-label="Email"
      style={{ background: '#6366f1', color: '#fff', marginBottom: 16 }}
    >
      <i className="fas fa-envelope"></i>
    </a>
    <a
      href="https://wa.me/923448375098"
      target="_blank"
      rel="noopener noreferrer"
      className="sticky-cta whatsapp"
      aria-label="WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  </>
);

export default StickyCTA; 