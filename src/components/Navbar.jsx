import React, { useState } from "react";
import Logo from "./Logo";
import FreeTrialGuideModal from "./FreeTrialGuideModal";

const navLinks = [
  { label: "Home", to: "#home" },
  { label: "Features", to: "#features" },
  { label: "How It Works", to: "#howitworks" },
  { label: "Pricing", to: "#pricing" },
  { label: "Contact", to: "#feedback" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Smooth scroll to section
  const handleNavClick = (e, to) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(to);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartFree = (e) => {
    e.preventDefault();
    setShowGuide(true);
  };

  const handleContinue = () => {
    setShowGuide(false);
    window.open("https://t.me/ourreceptionistbot", "_blank");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="navbar-logo">
          <Logo />
        </div>
        <div className={`navbar-links ${open ? "open" : ""}`} style={{ display: 'flex', alignItems: 'center', gap: '2.2rem', flex: 1, justifyContent: 'center' }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="navbar-link"
              style={{ whiteSpace: 'nowrap' }}
              onClick={(e) => handleNavClick(e, link.to)}
            >
              {link.label}
            </a>
          ))}
          <a href="/login" className="navbar-link" style={{ whiteSpace: 'nowrap' }}>
            Login
          </a>
        </div>
        <a
          href="#"
          className="navbar-btn"
          style={{ marginLeft: '1.2rem', whiteSpace: 'nowrap', alignSelf: 'center' }}
          onClick={handleStartFree}
        >
          Start Free
        </a>
        <button
          className="navbar-hamburger"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          <i className="fas fa-bars"></i>
        </button>
        <FreeTrialGuideModal open={showGuide} onClose={() => setShowGuide(false)} onContinue={handleContinue} />
      </div>
      {/* Mobile overlay */}
      {open && <div className="navbar-overlay" onClick={() => setOpen(false)}></div>}
    </nav>
  );
};

export default Navbar; 