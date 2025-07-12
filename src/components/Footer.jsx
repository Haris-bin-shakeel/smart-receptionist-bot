import React from "react";

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-links">
        <a
          href="https://t.me/ourreceptionistbot"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <i className="fab fa-telegram-plane"></i>
          Telegram
        </a>
        <a
          href="https://wa.me/923448375098"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <i className="fab fa-whatsapp"></i>
          WhatsApp
        </a>
        <a
          href="mailto:harisshakeel0981@gmail.com"
          className="footer-link"
        >
          <i className="fas fa-envelope"></i>
          Email
        </a>
        <a
          href="https://www.linkedin.com/in/haris-shakeel-aa1186330"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <i className="fab fa-linkedin"></i>
          LinkedIn
        </a>
      </div>

      <div className="footer-legal">
        <a href="/privacy-policy" className="footer-legal-link">
          Privacy Policy
        </a>
        <a href="/terms" className="footer-legal-link">
          Terms
        </a>
      </div>

      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} AI Receptionist Bot. All rights reserved.
      </div>

      <div className="footer-powered">
        <i className="fas fa-robot"></i>
        Powered by OpenAI + Telegram Bot
      </div>
    </div>
  </footer>
);

export default Footer; 