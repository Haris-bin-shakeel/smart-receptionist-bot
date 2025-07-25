import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const BusinessSetup = () => {
  const { currentUser } = useAuth();
  const [businessConfig, setBusinessConfig] = useState({
    business_name: '',
    business_type: '',
    greeting: '',
    business_hours: { start: '09:00', end: '18:00' },
    services: [''],
    address: '',
    phone: '',
    email: ''
  });
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [customLink, setCustomLink] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // Generate custom bot link
      const businessId = currentUser.uid.substring(0, 8); // Use first 8 chars of UID
      setCustomLink(`https://t.me/ourreceptionistbot?start=${businessId}`);
      
      // Load existing config if available
      loadBusinessConfig(businessId);
    }
  }, [currentUser]);

  const loadBusinessConfig = async (businessId) => {
    try {
      // In production, fetch from backend
      // For now, use localStorage as demo
      const saved = localStorage.getItem(`business_config_${businessId}`);
      if (saved) {
        const config = JSON.parse(saved);
        setBusinessConfig(config.config || businessConfig);
        setFaqs(config.faqs || faqs);
      }
    } catch (error) {
      console.error('Error loading business config:', error);
    }
  };

  const handleConfigChange = (field, value) => {
    setBusinessConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceChange = (index, value) => {
    const newServices = [...businessConfig.services];
    newServices[index] = value;
    setBusinessConfig(prev => ({
      ...prev,
      services: newServices
    }));
  };

  const addService = () => {
    setBusinessConfig(prev => ({
      ...prev,
      services: [...prev.services, '']
    }));
  };

  const removeService = (index) => {
    const newServices = businessConfig.services.filter((_, i) => i !== index);
    setBusinessConfig(prev => ({
      ...prev,
      services: newServices
    }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const saveConfiguration = async () => {
    try {
      const businessId = currentUser.uid.substring(0, 8);
      
      // Save to localStorage (in production, save to backend)
      const configData = {
        config: businessConfig,
        faqs: faqs.filter(faq => faq.question && faq.answer),
        businessId,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(`business_config_${businessId}`, JSON.stringify(configData));
      
      // In production, also save to backend
      // await saveToBackend(configData);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="business-setup">
      <div className="container">
        <h2>🤖 Bot Configuration</h2>
        <p>Set up your AI receptionist to perfectly represent your business!</p>

        {/* Custom Bot Link */}
        <div className="section">
          <h3>📱 Your Custom Bot Link</h3>
          <div className="link-container">
            <input 
              type="text" 
              value={customLink} 
              readOnly 
              className="custom-link"
            />
            <button 
              onClick={() => copyToClipboard(customLink)}
              className="copy-btn"
            >
              📋 Copy
            </button>
          </div>
          <p className="help-text">
            Share this link with your customers. They'll get personalized service specific to your business!
          </p>
        </div>

        {/* Business Information */}
        <div className="section">
          <h3>🏢 Business Information</h3>
          
          <div className="form-group">
            <label>Business Name *</label>
            <input
              type="text"
              value={businessConfig.business_name}
              onChange={(e) => handleConfigChange('business_name', e.target.value)}
              placeholder="e.g., Mimi's Beauty Studio"
            />
          </div>

          <div className="form-group">
            <label>Business Type</label>
            <select
              value={businessConfig.business_type}
              onChange={(e) => handleConfigChange('business_type', e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Beauty Salon">Beauty Salon</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Clinic">Medical Clinic</option>
              <option value="Fitness Center">Fitness Center</option>
              <option value="Retail Store">Retail Store</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Welcome Greeting</label>
            <textarea
              value={businessConfig.greeting}
              onChange={(e) => handleConfigChange('greeting', e.target.value)}
              placeholder="Hi! Welcome to [Business Name]! How can I help you today?"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Business Hours - Start</label>
              <input
                type="time"
                value={businessConfig.business_hours.start}
                onChange={(e) => handleConfigChange('business_hours', {
                  ...businessConfig.business_hours,
                  start: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Business Hours - End</label>
              <input
                type="time"
                value={businessConfig.business_hours.end}
                onChange={(e) => handleConfigChange('business_hours', {
                  ...businessConfig.business_hours,
                  end: e.target.value
                })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={businessConfig.address}
              onChange={(e) => handleConfigChange('address', e.target.value)}
              placeholder="Your business address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={businessConfig.phone}
                onChange={(e) => handleConfigChange('phone', e.target.value)}
                placeholder="+92-XXX-XXXXXXX"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={businessConfig.email}
                onChange={(e) => handleConfigChange('email', e.target.value)}
                placeholder="business@example.com"
              />
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="section">
          <h3>💼 Services Offered</h3>
          {businessConfig.services.map((service, index) => (
            <div key={index} className="service-item">
              <input
                type="text"
                value={service}
                onChange={(e) => handleServiceChange(index, e.target.value)}
                placeholder={`Service ${index + 1}`}
              />
              {businessConfig.services.length > 1 && (
                <button 
                  onClick={() => removeService(index)}
                  className="remove-btn"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button onClick={addService} className="add-btn">
            ➕ Add Service
          </button>
        </div>

        {/* FAQs */}
        <div className="section">
          <h3>❓ Frequently Asked Questions</h3>
          <p>Set up common questions and answers your bot will handle automatically.</p>
          
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="form-group">
                <label>Question {index + 1}</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                  placeholder="e.g., What are your prices?"
                />
              </div>
              <div className="form-group">
                <label>Answer</label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                  placeholder="Provide a helpful answer for your customers"
                  rows="3"
                />
              </div>
              {faqs.length > 1 && (
                <button 
                  onClick={() => removeFaq(index)}
                  className="remove-btn"
                >
                  🗑️ Remove FAQ
                </button>
              )}
            </div>
          ))}
          <button onClick={addFaq} className="add-btn">
            ➕ Add FAQ
          </button>
        </div>

        {/* Save Button */}
        <div className="save-section">
          <button 
            onClick={saveConfiguration}
            className="save-btn"
            disabled={!businessConfig.business_name}
          >
            💾 Save Configuration
          </button>
          {saved && (
            <div className="success-message">
              ✅ Configuration saved successfully!
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="instructions">
          <h3>🚀 Next Steps</h3>
          <ol>
            <li>Complete your business configuration above</li>
            <li>Share your custom bot link with customers</li>
            <li>Customers will get personalized service for your business</li>
            <li>Monitor analytics from your dashboard</li>
          </ol>
        </div>
      </div>

      <style jsx>{`
        .business-setup {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .section {
          background: white;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .section h3 {
          margin-top: 0;
          color: #333;
          font-size: 1.4em;
        }

        .link-container {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .custom-link {
          flex: 1;
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-family: monospace;
          background: #f8f9fa;
        }

        .copy-btn {
          padding: 12px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .copy-btn:hover {
          background: #0056b3;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #555;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
        }

        .service-item,
        .faq-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          padding: 16px;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .faq-item {
          flex-direction: column;
          align-items: stretch;
        }

        .add-btn,
        .remove-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .add-btn {
          background: #28a745;
          color: white;
        }

        .remove-btn {
          background: #dc3545;
          color: white;
        }

        .save-btn {
          background: #007bff;
          color: white;
          padding: 16px 32px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-right: 16px;
        }

        .save-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .success-message {
          display: inline-block;
          background: #d4edda;
          color: #155724;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #c3e6cb;
        }

        .help-text {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .instructions {
          background: #e3f2fd;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #2196f3;
        }

        .instructions h3 {
          margin-top: 0;
          color: #1976d2;
        }

        .instructions ol {
          margin: 0;
          padding-left: 20px;
        }

        .instructions li {
          margin-bottom: 8px;
          color: #555;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .link-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default BusinessSetup;