import React from "react";

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24" fill="var(--color-indigo)" />
      <path d="M16 24c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" fill="var(--color-bg)" />
      <rect x="20" y="20" width="8" height="8" rx="4" fill="var(--color-sky)" />
    </svg>
    <span style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-indigo)' }}>
      AI Receptionist Bot
    </span>
  </div>
);

export default Logo; 