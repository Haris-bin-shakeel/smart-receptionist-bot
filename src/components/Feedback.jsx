import React, { useState } from "react";

const Feedback = () => {
  const [formData, setFormData] = useState({
    email: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    // Simulate form submission
    setTimeout(() => {
      // Create mailto link with form data
      const subject = "AI Receptionist Bot Feedback";
      const body = `Email: ${formData.email}\n\nFeedback:\n${formData.message}`;
      const mailtoLink = `mailto:harisshakeel0981@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      setStatus({
        type: "success",
        message: "✅ Thanks for your feedback! We'll get back to you soon."
      });
      setFormData({ email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="feedback-section">
      <div className="feedback-container">
        <h2 className="feedback-title">
          <i className="fas fa-comments"></i>
          We'd Love Your Feedback
        </h2>
        <p className="feedback-subtitle">
          Help us improve our AI Receptionist Bot with your valuable insights
        </p>
        
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <i className="fas fa-envelope"></i>
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message" className="form-label">
              <i className="fas fa-comment-alt"></i>
              Your Feedback
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="form-textarea"
              placeholder="Tell us what you think about our AI Receptionist Bot..."
              rows={5}
            />
          </div>
          
          <button 
            type="submit" 
            className="feedback-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Send Feedback
              </>
            )}
          </button>
        </form>
        
        {status.message && (
          <div className={`feedback-status ${status.type}`}>
            {status.message}
          </div>
        )}
      </div>
    </section>
  );
};

export default Feedback; 