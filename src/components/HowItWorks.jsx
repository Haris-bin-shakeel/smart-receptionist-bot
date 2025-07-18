import React from "react";

const HowItWorks = () => (
  <section className="howitworks-section" id="howitworks" style={{ maxWidth: 800, margin: '3rem auto', padding: '2rem' }}>
    <h2 className="howitworks-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>How It Works</h2>
    <ol style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
      <li style={{ marginBottom: '1.2rem' }}>
        <span role="img" aria-label="Free">🟢</span> <strong>1. Try the Bot for Free</strong><br />
        Click “Try the Bot Free” to chat with our Telegram demo — no signup, no credit card.<br />
        You’ll experience:
        <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 22 }}>
          <li>Answers to common customer questions (FAQs)</li>
          <li>Voice message support</li>
          <li>Appointment booking in real-time</li>
        </ul>
      </li>
      <li style={{ marginBottom: '1.2rem' }}>
        <span role="img" aria-label="Value">🌟</span> <strong>2. See the Value in Action</strong><br />
        Watch how Smart Receptionist saves time by handling your customer conversations — automatically.<br />
        You’ll see exactly how it can support your business, before paying anything.
      </li>
      <li style={{ marginBottom: '1.2rem' }}>
        <span role="img" aria-label="Upgrade">🔐</span> <strong>3. Upgrade for Full Business Integration</strong><br />
        When you're ready to use it for your business:
        <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 22 }}>
          <li>Choose the Business Plan</li>
          <li>We’ll manually connect the bot to your business</li>
          <li>Set up your API, Google Calendar, and unlock AI-powered replies</li>
        </ul>
        <span style={{ color: '#22c55e', fontWeight: 600, display: 'block', marginTop: 6 }}>✅ No API or hidden costs until you upgrade</span>
      </li>
      <li>
        <span role="img" aria-label="Automation">⚙️</span> <strong>4. Run on Autopilot, 24/7</strong><br />
        Once integrated, your Smart Receptionist will:
        <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 22 }}>
          <li>Answer customer queries</li>
          <li>Handle voice messages</li>
          <li>Book appointments</li>
        </ul>
        All day, every day — automatically
      </li>
    </ol>
    {/* FAQ section updated below */}
    <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>📌 Frequently Asked Questions</h3>
    <div className="faq-list" style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="faq-item" style={{ marginBottom: '1.2rem' }}>
        <strong>Q: Is the free demo really free?</strong>
        <p>A: Yes — no signup or payment needed. Try the bot instantly via Telegram.</p>
      </div>
      <div className="faq-item" style={{ marginBottom: '1.2rem' }}>
        <strong>Q: What do I get after upgrading?</strong>
        <p>A: We’ll manually connect your business: API, calendar, and custom workflows — all included.</p>
      </div>
      <div className="faq-item" style={{ marginBottom: '1.2rem' }}>
        <strong>Q: Are there any hidden API or AI costs before upgrading?</strong>
        <p>A: None. You only pay once you upgrade to full business integration.</p>
      </div>
      <div className="faq-item" style={{ marginBottom: '1.2rem' }}>
        <strong>Q: Who should use this?</strong>
        <p>A: It’s ideal for clinics, agencies, and service businesses that want to automate customer handling.</p>
      </div>
      <div className="faq-item">
        <strong>Q: How do I get help or request features?</strong>
        <p>A: Just email us anytime at <a href="mailto:harisshakeel0981@gmail.com">harisshakeel0981@gmail.com</a>.</p>
      </div>
    </div>
  </section>
);

export default HowItWorks; 