import React from "react";

const benefits = [
  { 
    icon: "fas fa-clock", 
    title: "24/7 Support", 
    desc: "Never miss a customer—your bot works around the clock.",
    color: "#22c55e"
  },
  { 
    icon: "fas fa-bolt", 
    title: "Instant Replies", 
    desc: "No waiting. Customers get answers in seconds.",
    color: "#f59e0b"
  },
  { 
    icon: "fas fa-brain", 
    title: "AI-Powered", 
    desc: "Advanced AI understands and responds like a human.",
    color: "#6366f1"
  },
];

const Benefits = () => (
  <section className="benefits-section">
    <div className="benefits-container">
      <h2 className="benefits-title">Why Choose Us?</h2>
      <div className="benefits-grid">
        {benefits.map((b, i) => (
          <div key={i} className="benefit-card">
            <div className="benefit-icon" style={{ background: `linear-gradient(135deg, ${b.color} 0%, ${b.color}80 100%)` }}>
              <i className={b.icon}></i>
            </div>
            <h3 className="benefit-title">{b.title}</h3>
            <p className="benefit-description">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Benefits; 