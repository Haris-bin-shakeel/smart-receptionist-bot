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
  <section className="testimonials-section">
    <div className="testimonials-container">
      <h2 className="testimonials-title">What Our Users Say</h2>
      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="testimonial-info">
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-country">({t.country})</div>
              </div>
            </div>
            <div className="testimonial-quote">
              <i className="fas fa-quote-left"></i>
              <p>{t.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials; 