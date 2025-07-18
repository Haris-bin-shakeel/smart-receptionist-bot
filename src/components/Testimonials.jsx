import React from "react";

const Testimonials = () => (
  <section className="testimonials-section" style={{ margin: '3rem 0', textAlign: 'center' }}>
    <div className="testimonials-container">
      <h2 className="testimonials-title" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>What Our Users Say</h2>
      <div className="testimonials-grid" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
        <div className="testimonial-card" style={{ background: 'var(--bg-card, #181f2a)', borderRadius: 16, padding: '2rem', boxShadow: '0 2px 8px rgba(34,197,94,0.06)', color: '#bfc9e0', fontSize: '1.15rem' }}>
          <i className="fas fa-quote-left" style={{ fontSize: '1.5rem', color: '#36c6f0', marginBottom: 8 }}></i>
          <p><strong>Coming soon:</strong> See what real businesses say about Smart Receptionist. Want to be featured? <a href="mailto:harisshakeel0981@gmail.com" style={{ color: '#3182ce', textDecoration: 'underline' }}>Contact us</a> to share your story!</p>
        </div>
      </div>
    </div>
  </section>
);

export default Testimonials; 