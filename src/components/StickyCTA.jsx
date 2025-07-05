import React from "react";

const btnStyle = {
  position: 'fixed',
  right: 24,
  zIndex: 1000,
  border: 'none',
  borderRadius: '50%',
  width: 56,
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  cursor: 'pointer',
  fontSize: 28,
  color: '#fff',
};

const StickyCTA = () => (
  <>
    <a
      href="https://wa.me/923448375098"
      target="_blank"
      rel="noopener noreferrer"
      style={{ ...btnStyle, background: 'var(--color-green)', bottom: 32 }}
      aria-label="WhatsApp"
    >
      <span role="img" aria-label="WhatsApp">🟢</span>
    </a>
    <a
      href="https://t.me/ourreceptionistbot"
      target="_blank"
      rel="noopener noreferrer"
      style={{ ...btnStyle, background: 'var(--color-sky)', bottom: 100 }}
      aria-label="Telegram"
    >
      <span role="img" aria-label="Telegram">💬</span>
    </a>
  </>
);

export default StickyCTA; 