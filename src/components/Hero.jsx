import React from "react";
import "../App.css";

const Hero = () => (
  <section className="hero-section">
    <h1 className="hero-title">
      Meet Your AI Receptionist
    </h1>
    <p className="hero-subtitle">
      24/7 instant replies, voice input, calendar sync, and more—powered by AI, delivered on Telegram for your business.
    </p>
    <div className="hero-actions">
      <a
        href="https://t.me/ourreceptionistbot"
        target="_blank"
        rel="noopener noreferrer"
        className="hero-btn"
      >
        Try on Telegram
      </a>
      <div className="hero-card">
        <img src="/qr-telegram.png" alt="Telegram QR" className="hero-img qr" />
        <span className="hero-img-label">Scan to chat</span>
      </div>
      <div className="hero-card">
        <img src="/demo.gif" alt="Bot Demo" className="hero-img demo" />
        <span className="hero-img-label">See it in action</span>
      </div>
    </div>
  </section>
);

export default Hero; 