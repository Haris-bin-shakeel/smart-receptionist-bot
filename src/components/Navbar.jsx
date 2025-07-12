import React, { useState } from "react";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", to: "#home" },
  { label: "Features", to: "#features" },
  { label: "Why Us?", to: "#whyus" },
  { label: "Pricing", to: "#pricing" },
  { label: "Contact", to: "#feedback" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  // Smooth scroll to section
  const handleNavClick = (e, to) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(to);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Logo />
        </div>
        <div className={`navbar-links ${open ? "open" : ""}`}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="navbar-link"
              onClick={(e) => handleNavClick(e, link.to)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#pricing"
            className="navbar-btn"
            onClick={(e) => handleNavClick(e, "#pricing")}
          >
            Start Free Trial
          </a>
        </div>
        <button
          className="navbar-hamburger"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Open menu"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
      {/* Mobile overlay */}
      {open && <div className="navbar-overlay" onClick={() => setOpen(false)}></div>}
    </nav>
  );
};

export default Navbar; 