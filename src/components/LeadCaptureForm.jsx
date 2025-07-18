import React, { useState, useEffect } from "react";

const initialState = {
  name: "",
  email: "",
  company: "",
  website: "",
  industry: "",
  budget: "",
  contact: "",
  message: "",
  consent: false,
};

const industries = ["Clinic", "Agency", "Service Business", "Other"];
const budgets = ["<$100", "$100–$500", "$500–$2000", "$2000+"];
const contacts = ["Email", "WhatsApp", "Phone"];

const LeadCaptureForm = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Prevent background scroll when modal is open
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

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.name || !form.email || !form.company || !form.industry || !form.budget || !form.contact || !form.consent) {
      setError("Please fill all required fields and agree to be contacted.");
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitting(false);
          setSubmitted(false);
          setForm(initialState);
          onSuccess && onSuccess();
        }, 1500);
      } else {
        setError("Failed to submit. Please try again later.");
        setSubmitting(false);
      }
    } catch {
      setError("Failed to submit. Please try again later.");
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(20,24,38,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ background: 'var(--bg-card, #181f2a)', borderRadius: 18, maxWidth: 440, width: '98%', maxHeight: '92vh', overflowY: 'auto', padding: '2.5rem 1.7rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', color: '#e2e8f0', position: 'relative', fontFamily: 'inherit' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: '#bfc9e0', fontSize: 26, cursor: 'pointer', fontWeight: 700 }} aria-label="Close">&times;</button>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <h3 style={{ color: '#22c55e', marginBottom: 12, fontSize: '1.4rem' }}>Thank you!</h3>
            <p style={{ fontSize: '1.08rem' }}>We’ve received your info and will contact you soon to complete your integration.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.45rem', marginBottom: 6, color: '#36c6f0', textAlign: 'center', letterSpacing: 0.2 }}>Business Integration Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 600 }}>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 7, border: '1.5px solid #2d3748', background: '#20293a', color: '#e2e8f0', fontSize: '1.05rem' }} placeholder="Enter your full name" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 600 }}>Business Email *</label>
              <input name="email" value={form.email} onChange={handleChange} required type="email" style={{ width: '100%', padding: 10, borderRadius: 7, border: '1.5px solid #2d3748', background: '#20293a', color: '#e2e8f0', fontSize: '1.05rem' }} placeholder="you@email.com" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 600 }}>Company Name *</label>
              <input name="company" value={form.company} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 7, border: '1.5px solid #2d3748', background: '#20293a', color: '#e2e8f0', fontSize: '1.05rem' }} placeholder="Your company name" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 600 }}>Company Website</label>
              <input name="website" value={form.website} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 7, border: '1.5px solid #2d3748', background: '#20293a', color: '#e2e8f0', fontSize: '1.05rem' }} placeholder="https://yourwebsite.com" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 600 }}>Industry/Business Type *</label>
              <select name="industry" value={form.industry} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 7, border: '1.5px solid #2d3748', background: '#20293a', color: '#e2e8f0', fontSize: '1.05rem' }}>
                <option value="">Select</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 600 }}>Monthly Budget *</label>
              <select name="budget" value={form.budget} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 7, border: '1.5px solid #2d3748', background: '#20293a', color: '#e2e8f0', fontSize: '1.05rem' }}>
                <option value="">Select</option>
                {budgets.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 600 }}>Preferred Contact Method *</label>
              <select name="contact" value={form.contact} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 7, border: '1.5px solid #2d3748', background: '#20293a', color: '#e2e8f0', fontSize: '1.05rem' }}>
                <option value="">Select</option>
                {contacts.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontWeight: 600 }}>Message/Request Details</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={3} style={{ width: '100%', padding: 10, borderRadius: 7, border: '1.5px solid #2d3748', background: '#20293a', color: '#e2e8f0', fontSize: '1.05rem' }} placeholder="Tell us anything important..." />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} required style={{ marginRight: 8, accentColor: '#36c6f0', width: 18, height: 18 }} />
              <label style={{ fontWeight: 500, fontSize: '1.01rem', color: '#bfc9e0' }}>
                I agree to be contacted and receive updates.
              </label>
            </div>
            {error && <div style={{ color: '#f87171', marginBottom: 4, fontWeight: 600 }}>{error}</div>}
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 0', fontWeight: 700, fontSize: '1.13rem', background: 'linear-gradient(90deg,#36c6f0,#6366f1)', border: 'none', borderRadius: 8, color: '#fff', marginTop: 8, cursor: 'pointer', boxShadow: '0 2px 8px rgba(54,198,240,0.08)' }} disabled={submitting}>{submitting ? "Submitting..." : "Submit & Continue to Payment"}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LeadCaptureForm; 