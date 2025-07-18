import React from "react";

const Features = () => (
  <section className="features-section" id="features">
    <h2 className="features-title">Features</h2>
    <div className="features-grid">
      {/* Free Plan Features */}
      <div className="feature-card">
        <h3>Free Plan</h3>
        <ul>
          <li><i className="fas fa-comments"></i> Predefined FAQ Answers</li>
          <li><i className="fas fa-microphone"></i> Basic Voice Message Support</li>
          <li><i className="fas fa-calendar-check"></i> Basic Appointment Booking</li>
          <li><i className="fas fa-robot"></i> AI-Powered Chat (limited)</li>
        </ul>
        <p className="feature-note">Great for testing and small teams. No credit card required.</p>
      </div>
      {/* Business Integration Features */}
      <div className="feature-card highlight">
        <h3>Business Integration</h3>
        <ul>
          <li><i className="fas fa-calendar-alt"></i> Full Calendar Integration</li>
          <li><i className="fas fa-microphone"></i> Advanced Voice Features</li>
          <li><i className="fas fa-cogs"></i> Custom Business Workflows</li>
          <li><i className="fas fa-headset"></i> Priority Support</li>
          <li><i className="fas fa-infinity"></i> Unlimited AI Responses</li>
        </ul>
        <p className="feature-note">Unlock after upgrade. Perfect for growing businesses—activate full receptionist power after purchase!</p>
      </div>
    </div>
  </section>
);

export default Features; 