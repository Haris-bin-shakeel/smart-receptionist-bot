import React from "react";
import "../App.css";

const plans = [
  {
    name: "Free Trial",
    price: "Free",
    description: "Test the receptionist bot with limited features",
    features: [
      { text: "Basic chatbot access", icon: "fas fa-comments" },
      { text: "No integration or calendar booking", icon: "fas fa-calendar-times" },
      { text: "Limited AI responses", icon: "fas fa-robot" }
    ],
    cta: "Start Free Trial",
    highlight: false,
    link: "https://t.me/ourreceptionistbot"
  },
  {
    name: "Business Integration",
    price: "Custom Quote",
    description: "Full receptionist automation for small businesses",
    features: [
      { text: "Google Calendar + Appointment Sync", icon: "fas fa-calendar-check" },
      { text: "Voice Message Replies", icon: "fas fa-microphone" },
      { text: "Smart FAQ Handling", icon: "fas fa-question-circle" },
      { text: "Priority Support", icon: "fas fa-headset" },
      { text: "Custom Integration Setup", icon: "fas fa-cogs" }
    ],
    cta: "Integrate Now",
    highlight: true,
    link: "mailto:harisshakeel0981@gmail.com"
  },
];

const Pricing = () => (
  <section className="pricing-section">
    <div className="pricing-grid">
      {plans.map((plan, i) => (
        <div key={i} className={`pricing-card${plan.highlight ? " highlight" : ""}`}>
          {plan.highlight && <div className="badge">Most Popular</div>}
          <h3>{plan.name}</h3>
          <div className="price">{plan.price}</div>
          <p className="plan-description">{plan.description}</p>
          <ul>
            {plan.features.map((f, j) => (
              <li key={j}>
                <i className={f.icon}></i>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
          <a href={plan.link} target="_blank" rel="noopener noreferrer">
            {plan.cta}
          </a>
        </div>
      ))}
    </div>
  </section>
);

export default Pricing; 
