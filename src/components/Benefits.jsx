import React from "react";

const benefits = [
  { icon: "⏰", title: "24/7 Support", desc: "Never miss a customer—your bot works around the clock." },
  { icon: "⚡", title: "Instant Replies", desc: "No waiting. Customers get answers in seconds." },
  { icon: "🧠", title: "AI-Powered", desc: "Advanced AI understands and responds like a human." },
];

const Benefits = () => (
  <section style={{ margin: '3rem 0', textAlign: 'center' }}>
    <h2 style={{ color: 'var(--color-green)', fontWeight: 600, fontSize: '2rem', marginBottom: '2rem' }}>Why Choose Us?</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', maxWidth: 900, margin: '0 auto' }}>
      {benefits.map((b, i) => (
        <div key={i} style={{ background: 'var(--color-bg)', border: '2px solid var(--color-green)', borderRadius: 16, padding: '2rem 1.2rem', minWidth: 220, boxShadow: '0 2px 8px rgba(34,197,94,0.06)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{b.icon}</div>
          <div style={{ fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-green)', marginBottom: '0.5rem' }}>{b.title}</div>
          <div style={{ color: 'var(--color-slate)', fontSize: '1rem' }}>{b.desc}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Benefits; 