import React from "react";

const testimonials = [
  {
    name: "Sarah M.",
    country: "USA",
    feedback: "The AI Receptionist Bot has transformed our customer support. Instant replies and 24/7 availability—amazing!"
  },
  {
    name: "Jonas F.",
    country: "Germany",
    feedback: "Setup was easy and our clients love the voice input. Highly recommended for any business!"
  },
  {
    name: "Priya S.",
    country: "India",
    feedback: "We never miss a booking now. The calendar sync and AI answers are a game changer."
  }
];

const Testimonials = () => (
  <section style={{ margin: '3rem 0', textAlign: 'center' }}>
    <h2 style={{ color: 'var(--color-sky)', fontWeight: 600, fontSize: '2rem', marginBottom: '2rem' }}>What Our Users Say</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', maxWidth: 900, margin: '0 auto' }}>
      {testimonials.map((t, i) => (
        <div key={i} style={{ background: 'var(--color-accent)', borderRadius: 16, padding: '2rem 1.2rem', minWidth: 220, boxShadow: '0 2px 8px rgba(14,165,233,0.08)' }}>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-sky)', marginBottom: '0.5rem' }}>{t.name} <span style={{ color: 'var(--color-slate)', fontWeight: 400 }}>({t.country})</span></div>
          <div style={{ color: 'var(--color-slate)', fontSize: '1rem', fontStyle: 'italic' }}>&ldquo;{t.feedback}&rdquo;</div>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials; 