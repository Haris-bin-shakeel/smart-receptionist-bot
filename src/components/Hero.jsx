import React from "react";
import "../App.css";

const Hero = () => (
  <section className="hero-section">
    <div className="hero-background">
      <div className="hero-glow"></div>
    </div>
    
    <div className="hero-content">
      <div className="hero-badge">
        <i className="fas fa-robot"></i>
        <span>AI-Powered Assistant</span>
      </div>
      
      <h1 className="hero-title">
        Meet Your <span className="gradient-text">AI Receptionist</span>
      </h1>
      
      <p className="hero-subtitle">
        24/7 instant replies, voice input, calendar sync, and more—powered by AI, delivered on Telegram for your business.
      </p>
      
      <div className="hero-features">
        <div className="hero-feature">
          <i className="fas fa-clock"></i>
          <span>24/7 Availability</span>
        </div>
        <div className="hero-feature">
          <i className="fas fa-microphone"></i>
          <span>Voice Input</span>
        </div>
        <div className="hero-feature">
          <i className="fas fa-calendar-alt"></i>
          <span>Calendar Sync</span>
        </div>
      </div>
      
      <div className="hero-actions">
        <a
          href="https://t.me/ourreceptionistbot"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-btn primary"
        >
          <i className="fab fa-telegram-plane"></i>
          Try on Telegram
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
    </div>
  </section>
);

export default Hero; 