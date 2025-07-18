import React, { useEffect } from "react";

const sampleFaqs = [
  "What are your business hours?",
  "How do I book an appointment?",
  "Where are you located?",
  "What services do you offer?"
];

const FreeTrialGuideModal = ({ open, onClose, onContinue }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(20,24,38,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ background: 'var(--bg-card, #181f2a)', borderRadius: 18, maxWidth: 420, width: '95%', padding: '2.2rem 1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', color: '#e2e8f0', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: '#bfc9e0', fontSize: 22, cursor: 'pointer' }} aria-label="Close">&times;</button>
        <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 10 }}>Welcome to Your Free Demo!</h2>
        <p style={{ marginBottom: 18, color: '#bfc9e0' }}>Here’s what you can try with our Telegram bot:</p>
        <ul style={{ marginBottom: 18, paddingLeft: 18 }}>
          {sampleFaqs.map((q, i) => (
            <li key={i} style={{ marginBottom: 6, fontSize: '1.05rem' }}>❓ {q}</li>
          ))}
        </ul>
        <div style={{ marginBottom: 18 }}>
          <strong>How to book an appointment:</strong>
          <ol style={{ margin: '8px 0 0 18px', color: '#bfc9e0', fontSize: '1.02rem' }}>
            <li>Type: <span style={{ color: '#36c6f0' }}>Book an appointment</span></li>
            <li>Follow the prompts to select a date and time</li>
            <li>Check your booking by typing: <span style={{ color: '#36c6f0' }}>My appointments</span></li>
          </ol>
        </div>
        <div style={{ marginBottom: 18, color: '#f59e42', fontWeight: 500, fontSize: '1.04rem' }}>
          <i className="fas fa-lock" style={{ marginRight: 6 }}></i>
          <span>AI-powered replies and full business integration are unlocked after you upgrade.</span>
        </div>
        <button
          onClick={onContinue}
          className="btn-primary btn-full"
          style={{ padding: '0.9rem', borderRadius: 8, fontWeight: 600, fontSize: '1.08rem', background: 'var(--primary-gradient, linear-gradient(90deg,#5f6cff,#36c6f0))', color: '#fff', border: 'none', cursor: 'pointer', width: '100%', marginTop: 8 }}
        >
          Continue to Telegram
        </button>
      </div>
    </div>
  );
};

export default FreeTrialGuideModal; 