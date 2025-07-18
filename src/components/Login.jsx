import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../App.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await resetPassword(forgotEmail);
      setError('');
      alert('Password reset email sent! Please check your inbox.');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (error) {
      setError(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
      <div className="auth-card" style={{ maxWidth: 400, width: '100%', background: 'var(--bg-card, #181f2a)', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '2.5rem 2rem', margin: '2rem 0' }}>
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span role="img" aria-label="bot" style={{ fontSize: '2.2rem' }}>🤖</span> AI Receptionist
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#bfc9e0' }}>Welcome back! Sign in to your account</p>
        </div>

        {!showForgotPassword ? (
          <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {error && <div className="error-message" style={{ color: '#e53e3e', marginBottom: 8 }}>{error}</div>}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1.5px solid #2d3748', fontSize: '1rem' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1.5px solid #2d3748', fontSize: '1rem' }}
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary btn-full"
              style={{ marginTop: 8, padding: '0.8rem', borderRadius: 8, fontWeight: 600, fontSize: '1.08rem', background: 'var(--primary-gradient, linear-gradient(90deg,#5f6cff,#36c6f0))', color: '#fff', border: 'none', cursor: 'pointer' }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="auth-links" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <button 
                type="button" 
                className="link-button"
                style={{ background: 'none', border: 'none', color: '#3182ce', textDecoration: 'underline', cursor: 'pointer', fontSize: '1rem', padding: 0 }}
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot your password?
              </button>
              <a href="/register" className="link-button" style={{ color: '#805ad5', textDecoration: 'underline', fontSize: '1rem' }}>
                Don't have an account? Sign up
              </a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {error && <div className="error-message" style={{ color: '#e53e3e', marginBottom: 8 }}>{error}</div>}
            <div className="form-group">
              <label htmlFor="forgotEmail">Email Address</label>
              <input
                type="email"
                id="forgotEmail"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1.5px solid #2d3748', fontSize: '1rem' }}
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary btn-full"
              style={{ marginTop: 8, padding: '0.8rem', borderRadius: 8, fontWeight: 600, fontSize: '1.08rem', background: 'var(--primary-gradient, linear-gradient(90deg,#5f6cff,#36c6f0))', color: '#fff', border: 'none', cursor: 'pointer' }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
            <div className="auth-links" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <button 
                type="button" 
                className="link-button"
                style={{ background: 'none', border: 'none', color: '#3182ce', textDecoration: 'underline', cursor: 'pointer', fontSize: '1rem', padding: 0 }}
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
        <div className="auth-footer" style={{ textAlign: 'center', marginTop: '1.5rem', color: '#bfc9e0', fontSize: '0.98rem' }}>
          <p>By signing in, you agree to our <a href="/terms.html" style={{ color: '#3182ce', textDecoration: 'underline' }}>Terms of Service</a> and <a href="/privacy.html" style={{ color: '#3182ce', textDecoration: 'underline' }}>Privacy Policy</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 