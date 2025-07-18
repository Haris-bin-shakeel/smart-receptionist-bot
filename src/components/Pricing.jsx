import React, { useState } from "react";
import "../App.css";
// import LeadCaptureForm from "./LeadCaptureForm"; // Remove the form import

const plans = [
  {
    name: "Free Demo",
    price: "₨0",
    priceSubtext: "try on Telegram",
    description: "Test the bot instantly on Telegram. No signup or credit card required. Try FAQs, voice, and booking features.",
    features: [
      { text: "Predefined FAQ answers", icon: "fas fa-comments" },
      { text: "Basic voice message support", icon: "fas fa-microphone" },
      { text: "Basic appointment booking", icon: "fas fa-calendar-check" },
      { text: "AI-powered chat (limited)", icon: "fas fa-robot" }
    ],
    cta: "Try the Bot Free",
    highlight: false,
    link: "https://t.me/ourreceptionistbot",
    paymentMethods: []
  },
  {
    name: "Business Integration",
    price: "₨4,999",
    priceSubtext: "/month",
    priceUSD: "$19.99",
    description: "Ready to use it for real? Upgrade and we’ll activate full business integration — no technical skills needed.",
    features: [
      { text: "Full calendar integration", icon: "fas fa-calendar-alt" },
      { text: "Advanced voice features", icon: "fas fa-microphone" },
      { text: "Custom business workflows", icon: "fas fa-cogs" },
      { text: "Priority support", icon: "fas fa-headset" },
      { text: "Unlimited AI responses", icon: "fas fa-infinity" }
    ],
    cta: "Request Business Integration",
    highlight: true,
    link: "#business-integration",
    paymentMethods: [] // Remove payment methods
  }
];

const Pricing = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "-",
          email,
          company: "-",
          website: "-",
          industry: "-",
          budget: "-",
          contact: "Email",
          message: "Auto-generated: User requested business integration via website."
        })
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setShowContactModal(false);
          setSubmitted(false);
          setEmail("");
        }, 2000);
      } else {
        setError("Failed to send. Please try again later.");
      }
    } catch {
      setError("Failed to send. Please try again later.");
    }
    setSubmitting(false);
  };

  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-grid">
        {plans.map((plan, i) => (
          <div key={i} className={`pricing-card${plan.highlight ? " highlight" : ""}`}>
            {plan.highlight && <div className="badge">Most Popular</div>}
            <h3>{plan.name}</h3>
            <div className="price">
              {plan.price}
              {plan.priceSubtext && <span className="price-subtext">{plan.priceSubtext}</span>}
              {plan.priceUSD && <span className="price-usd">({plan.priceUSD})</span>}
            </div>
            <p className="plan-description">{plan.description}</p>
            <ul>
              {plan.features.map((f, j) => (
                <li key={j}>
                  <i className={f.icon}></i>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
            {plan.name === "Business Integration" ? (
              <>
                <button
                  className="btn-primary btn-full"
                  onClick={() => setShowContactModal(true)}
                  style={{ marginBottom: 8 }}
                >
                  {plan.cta}
                </button>
                <div style={{ marginTop: 8, color: '#36c6f0', fontWeight: 600 }}>
                  💡 Ideal for: Clinics, Agencies, Freelancers, Local Services
                </div>
                <div style={{ marginTop: 8 }}>
                  <small>
                    <span style={{ color: '#22c55e', fontWeight: 700, marginRight: 4 }}>✅</span>
                    No API costs until you upgrade
                  </small>
                </div>
                {/* Optional: Countdown timer for launch pricing */}
                {/* <div style={{ color: '#f59e42', fontWeight: 600, marginTop: 8 }}>
                 🎉 Special Launch Price for <span style={{ fontWeight: 800 }}>30</span> Days!
                </div> */}
              </>
            ) : (
              <a href={plan.link} className="btn-primary btn-full" target={plan.name === 'Free Demo' ? '_blank' : undefined} rel={plan.name === 'Free Demo' ? 'noopener noreferrer' : undefined}>
                {plan.cta}
              </a>
            )}
          </div>
        ))}
      </div>
      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(20,24,38,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ background: 'var(--bg-card, #181f2a)', borderRadius: 18, maxWidth: 400, width: '95%', padding: '2.2rem 1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', color: '#e2e8f0', position: 'relative' }}>
            <button onClick={() => setShowContactModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: '#bfc9e0', fontSize: 22, cursor: 'pointer' }} aria-label="Close">&times;</button>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <h3 style={{ color: '#22c55e', marginBottom: 12, fontSize: '1.4rem' }}>Thank you!</h3>
                <p style={{ fontSize: '1.08rem' }}>We’ve received your request and will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: 6, color: '#36c6f0', textAlign: 'center' }}>Request Business Integration</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontWeight: 600 }}>Your Email</label>
                  <input
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    type="email"
                    style={{ width: '100%', padding: 10, borderRadius: 7, border: '1.5px solid #2d3748', background: '#20293a', color: '#e2e8f0', fontSize: '1.05rem' }}
                    placeholder="you@email.com"
                  />
                </div>
                {error && <div style={{ color: '#f87171', marginBottom: 4, fontWeight: 600 }}>{error}</div>}
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 0', fontWeight: 700, fontSize: '1.13rem', background: 'linear-gradient(90deg,#36c6f0,#6366f1)', border: 'none', borderRadius: 8, color: '#fff', marginTop: 8, cursor: 'pointer', boxShadow: '0 2px 8px rgba(54,198,240,0.08)' }} disabled={submitting}>{submitting ? "Sending..." : "Send Request"}</button>
                <div style={{ marginTop: 10, color: '#bfc9e0', fontSize: '0.98rem', textAlign: 'center' }}>
                  Our team will contact you soon to discuss your business integration.
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Testimonials row below pricing grid */}
      <div className="pricing-testimonials" style={{ maxWidth: 700, margin: '2.5rem auto 0', textAlign: 'center' }}>
        <div style={{ fontSize: '1.18rem', fontWeight: 600, marginBottom: 16, color: '#e2e8f0' }}>
          <span role="img" aria-label="speech bubble">💬</span> What Our Users Say
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <div style={{ background: 'var(--bg-card, #181f2a)', borderRadius: 14, padding: '1.2rem 1.5rem', color: '#bfc9e0', maxWidth: 520, fontSize: '1.08rem', boxShadow: '0 2px 8px rgba(34,197,94,0.06)' }}>
            <i className="fas fa-quote-left" style={{ color: '#36c6f0', marginRight: 8 }}></i>
            “We automated 80% of our bookings in the first week!” <span style={{ color: '#22c55e', fontWeight: 500 }}>— Test Clinic</span>
          </div>
          <div style={{ background: 'var(--bg-card, #181f2a)', borderRadius: 14, padding: '1.2rem 1.5rem', color: '#bfc9e0', maxWidth: 520, fontSize: '1.08rem', boxShadow: '0 2px 8px rgba(34,197,94,0.06)' }}>
            <i className="fas fa-quote-left" style={{ color: '#36c6f0', marginRight: 8 }}></i>
            “Our customers love the instant replies. It’s like having a real receptionist 24/7.” <span style={{ color: '#6366f1', fontWeight: 500 }}>— Agency Owner</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 
