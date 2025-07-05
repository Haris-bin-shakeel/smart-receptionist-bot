import React from "react";

const Footer = () => (
  <footer>
    <div style={{
      marginBottom: '1rem',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <a
        href="https://t.me/ourreceptionistbot"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--color-sky)', fontWeight: 600, textDecoration: 'none' }}
      >
        Telegram
      </a>
      <a
        href="https://wa.me/923448375098"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--color-green)', fontWeight: 600, textDecoration: 'none' }}
      >
        WhatsApp
      </a>
      <a
        href="mailto:harisshakeel0981@gmail.com"
        style={{ color: 'var(--color-indigo)', fontWeight: 600, textDecoration: 'none' }}
      >
        Email
      </a>
      <a
        href="https://www.linkedin.com/in/haris-shakeel-aa1186330"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--color-slate)', fontWeight: 600, textDecoration: 'none' }}
      >
        LinkedIn
      </a>
    </div>

    <div style={{ marginBottom: '0.5rem' }}>
      <a
        href="/privacy-policy"
        style={{ color: 'var(--color-slate)', marginRight: 16, textDecoration: 'underline' }}
      >
        Privacy Policy
      </a>
      <a
        href="/terms"
        style={{ color: 'var(--color-slate)', textDecoration: 'underline' }}
      >
        Terms
      </a>
    </div>

    <div style={{ marginBottom: '0.5rem' }}>
      &copy; {new Date().getFullYear()} AI Receptionist Bot. All rights reserved.
    </div>

    <div style={{ fontSize: '0.95rem', color: 'var(--color-slate)' }}>
      Powered by OpenAI + Telegram Bot
    </div>
  </footer>
);

export default Footer; 