import React from "react";
import "../App.css";

const plans = [
  {
    name: "Free",
    price: "₹0/mo",
    features: ["Demo only", "No AI replies", "Basic FAQ"],
    cta: "Try Demo",
    highlight: false,
    link: "https://t.me/ourreceptionistbot"
  },
  {
    name: "Pro",
    price: "₹2,500/mo",
    features: ["AI replies", "Booking & calendar sync", "All Free features"],
    cta: "Start Pro",
    highlight: true,
    link: "https://t.me/ourreceptionistbot"
  },
  {
    name: "Business",
    price: "Custom",
    features: ["Full integration", "Custom workflows", "Priority support"],
    cta: "Contact Us",
    highlight: false,
    link: "mailto:harisshakeel0981@gmail.com"
  },
];

const Pricing = () => (
  <section className="pricing-section">
    <h2 className="pricing-title">Pricing</h2>
    <div className="pricing-grid">
      {plans.map((plan, i) => (
        <div key={i} className={`pricing-card${plan.highlight ? " highlight" : ""}`}>
          {plan.highlight && <div className="pricing-popular">Most Popular</div>}
          <div className="pricing-name">{plan.name}</div>
          <div className="pricing-price">{plan.price}</div>
          <ul className="pricing-features">
            {plan.features.map((f, j) => (
              <li key={j} className="pricing-feature">
                <span className="pricing-check">✔️</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <a href={plan.link} target="_blank" rel="noopener noreferrer" className="pricing-btn">
            {plan.cta}
          </a>
        </div>
      ))}
    </div>
  </section>
);

export default Pricing; 
