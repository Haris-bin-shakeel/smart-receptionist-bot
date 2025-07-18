import React, { useState } from "react";
import "../App.css";
import FreeTrialGuideModal from "./FreeTrialGuideModal";

const Hero = () => {
  const [showGuide, setShowGuide] = useState(false);

  const handleTryFree = (e) => {
    e.preventDefault();
    setShowGuide(true);
  };

  const handleContinue = () => {
    setShowGuide(false);
    window.open("https://t.me/ourreceptionistbot", "_blank");
  };

  return (
    <>
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-glow"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-robot"></i>
            <span>AI Receptionist for Business</span>
          </div>
          <h1 className="hero-title">
            Try Your <span className="gradient-text">AI Receptionist</span> Free
          </h1>
          <p className="hero-subtitle">
            Test our bot instantly—no credit card required. Ask questions, send voice messages, and book appointments. When you’re ready to connect it to your business, just upgrade and we’ll handle the full integration for you.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <i className="fas fa-clock"></i>
              <span>24/7 Automated Replies</span>
            </div>
            <div className="hero-feature">
              <i className="fas fa-microphone"></i>
              <span>Voice Message Handling</span>
            </div>
            <div className="hero-feature">
              <i className="fas fa-calendar-alt"></i>
              <span>Appointment Booking</span>
            </div>
          </div>
          <div className="hero-actions">
            <a
              href="#"
              className="hero-btn primary"
              style={{ fontWeight: 600, fontSize: '1.1rem', marginRight: 16 }}
              onClick={handleTryFree}
            >
              <i className="fab fa-telegram-plane"></i>
              Try the Bot Free
            </a>
            <a
              href="#pricing"
              className="hero-btn secondary"
              style={{ fontWeight: 600, fontSize: '1.1rem' }}
            >
              Upgrade for Business Integration
            </a>
            <div className="hero-cards">
              <div className="hero-card">
                <div className="hero-card-icon">
                  <i className="fas fa-qrcode"></i>
                </div>
                <img src="/qr-telegram.png" alt="Telegram QR" className="hero-img qr" />
                <span className="hero-img-label">Scan to chat</span>
              </div>
              <div className="hero-card">
                <div className="hero-card-icon">
                  <i className="fas fa-play"></i>
                </div>
                <img src="/demo.gif" alt="Bot Demo" className="hero-img demo" />
                <span className="hero-img-label">See it in action</span>
              </div>
            </div>
          </div>
          {/* Used by businesses like... trust row */}
          <div className="hero-trust-row" style={{ marginTop: 32, textAlign: 'center', opacity: 0.92 }}>
            <div style={{ fontSize: '1.08rem', fontWeight: 500, marginBottom: 8 }}>
              <span role="img" aria-label="briefcase">💼</span> Used by businesses like...
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, alignItems: 'center', marginTop: 4 }}>
              <span title="Clinic"><i className="fas fa-clinic-medical" style={{ fontSize: 28, color: '#36c6f0' }}></i></span>
              <span title="Agency"><i className="fas fa-building" style={{ fontSize: 28, color: '#6366f1' }}></i></span>
              <span title="Service Business"><i className="fas fa-briefcase" style={{ fontSize: 28, color: '#22c55e' }}></i></span>
            </div>
            <div style={{ marginTop: 10, fontSize: '1.01rem', color: '#bfc9e0', fontStyle: 'italic', letterSpacing: 0.1 }}>
              <span role="img" aria-label="star">⭐</span> Tested and loved by early users across 3+ industries
            </div>
          </div>
        </div>
      </section>
      <FreeTrialGuideModal open={showGuide} onClose={() => setShowGuide(false)} onContinue={handleContinue} />
    </>
  );
};

export default Hero; 