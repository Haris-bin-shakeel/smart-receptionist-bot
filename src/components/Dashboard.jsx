import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getTrialDaysRemaining, hasFeatureAccess } from "../utils/userPlan";
import "../App.css";

const Dashboard = () => {
  const { currentUser, userPlan, logout } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const [showBizForm, setShowBizForm] = useState(false);
  const [bizFormSubmitted, setBizFormSubmitted] = useState(false);
  const [bizForm, setBizForm] = useState({ name: '', email: '', businessType: '' });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Mock analytics data for now
    setAnalytics({
      overview: {
        currentMonth: {
          totalAppointments: 12,
          totalInteractions: 156,
          totalVoiceMessages: 8,
          aiFallbackUsage: 23
        }
      }
    });
  }, [currentUser, navigate]);

  const handleUpgrade = () => {
    // Redirect to pricing page for payment
    window.location.href = '/#pricing';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="dashboard-error">
        <h2>Access Denied</h2>
        <p>Please log in to access your dashboard.</p>
        <a href="/login" className="btn-primary">Login</a>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>🤖 AI Receptionist Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {userPlan?.contactPerson || currentUser.email}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-chart-line"></i>
              Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <i className="fas fa-chart-bar"></i>
              Analytics
            </button>
            <button 
              className={`nav-item ${activeTab === 'subscription' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscription')}
            >
              <i className="fas fa-credit-card"></i>
              Subscription
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog"></i>
              Settings
            </button>
          </nav>
        </aside>

        <main className="dashboard-main">
          {activeTab === 'overview' && (
            <div className="dashboard-overview">
              <div className="overview-header">
                <h2>Dashboard Overview</h2>
                <div className="subscription-status">
                  <span className={`status-badge ${userPlan?.plan || 'free_trial'}`}>
                    {userPlan?.plan === 'free_trial' ? 'Trial' : 
                     userPlan?.plan === 'business' ? 'Active' : 'Inactive'}
                  </span>
                  {userPlan?.plan === 'free_trial' && (
                    <span className="trial-days">
                      {getTrialDaysRemaining(userPlan)} days remaining
                    </span>
                  )}
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{analytics?.overview?.currentMonth?.totalAppointments || 0}</h3>
                    <p>Appointments Booked</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-comments"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{analytics?.overview?.currentMonth?.totalInteractions || 0}</h3>
                    <p>Total Interactions</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-microphone"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{analytics?.overview?.currentMonth?.totalVoiceMessages || 0}</h3>
                    <p>Voice Messages</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{analytics?.overview?.currentMonth?.aiFallbackUsage || 0}</h3>
                    <p>AI Fallback Used</p>
                  </div>
                </div>
              </div>

              {userPlan?.plan === 'free_trial' && (
                <div className="upgrade-banner">
                  <div className="upgrade-content">
                    <h3>Upgrade to Business Plan</h3>
                    <p>Unlock full calendar sync, advanced voice, and custom workflows for your business. <strong>After payment, our team will manually enable full integration for your account.</strong> No API costs until you upgrade.<br /><span style={{ color: '#22c55e', fontWeight: 500 }}>You only pay when you’re ready to connect your business.</span></p>
                    <button onClick={handleUpgrade} className="btn-upgrade">
                      Upgrade Now - ₨4,999/month
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="dashboard-analytics">
              <h2>Analytics</h2>
              {analytics ? (
                <div className="analytics-content">
                  <div className="analytics-chart">
                    <h3>Daily Interactions</h3>
                    <div className="chart-placeholder">
                      <p>Chart visualization would go here</p>
                      <p>Showing {analytics.dailyData?.length || 0} days of data</p>
                    </div>
                  </div>
                  
                  <div className="analytics-metrics">
                    <h3>Monthly Summary</h3>
                    <div className="metrics-grid">
                      <div className="metric">
                        <span className="metric-label">Growth</span>
                        <span className={`metric-value ${analytics.overview?.growth?.trend === 'up' ? 'positive' : 'negative'}`}>
                          {analytics.overview?.growth?.percentage || 0}%
                        </span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Positive Sentiment</span>
                        <span className="metric-value">
                          {analytics.overview?.currentMonth?.sentimentBreakdown?.positive || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No analytics data available yet.</p>
              )}
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="dashboard-subscription">
              <h2>Subscription Management</h2>
              <div className="subscription-details">
                <div className="subscription-card">
                  <h3>Current Plan: {userPlan?.plan === 'business' ? 'Business Integration' : 'Free Trial'}</h3>
                  <div className="plan-details">
                    <p><strong>Status:</strong> {userPlan?.isActive ? 'Active' : 'Inactive'}</p>
                    <p><strong>Started:</strong> {userPlan?.trialStartDate ? new Date(userPlan.trialStartDate.toDate()).toLocaleDateString() : 'N/A'}</p>
                    {userPlan?.trialEndDate && (
                      <p><strong>Trial Ends:</strong> {new Date(userPlan.trialEndDate.toDate()).toLocaleDateString()}</p>
                    )}
                    {userPlan?.businessStartDate && (
                      <p><strong>Business Started:</strong> {new Date(userPlan.businessStartDate.toDate()).toLocaleDateString()}</p>
                    )}
                  </div>
                  {userPlan?.plan === 'free_trial' ? (
                    <>
                      <button onClick={handleUpgrade} className="btn-upgrade">
                        Upgrade to Business Plan
                      </button>
                      <div className="upgrade-note" style={{ marginTop: 12, color: '#555', fontSize: '0.98rem' }}>
                        <strong>Note:</strong> After payment, our team will manually enable full business integration for your account. You’ll get access to advanced features as soon as your API is connected. <span style={{ color: '#22c55e', fontWeight: 500 }}>No API costs until you upgrade.</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <button className="btn-cancel">Cancel Subscription</button>
                      <button className="btn-primary" style={{ marginLeft: 12 }} onClick={() => setShowBizForm(true)}>
                        Request Business Integration
                      </button>
                      <div style={{ marginTop: 18, background: '#222a36', borderRadius: 8, padding: '1rem 1.2rem', color: '#22c55e', fontWeight: 500, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <i className="fas fa-user-shield" style={{ color: '#36c6f0', fontSize: '1.2em' }}></i>
                        Reminder: We’ll manually activate your business integration within 24 hours of payment. No API cost before then.
                      </div>
                    </>
                  )}
                </div>
              </div>
              {/* Business Integration Modal */}
              {showBizForm && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(20,24,38,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="modal-content" style={{ background: 'var(--bg-card, #181f2a)', borderRadius: 18, maxWidth: 420, width: '95%', padding: '2.2rem 1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', color: '#e2e8f0', position: 'relative' }}>
                    <button onClick={() => setShowBizForm(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: '#bfc9e0', fontSize: 22, cursor: 'pointer' }} aria-label="Close">&times;</button>
                    {!bizFormSubmitted ? (
                      <>
                        <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 10 }}>Request Business Integration</h2>
                        <p style={{ marginBottom: 18, color: '#bfc9e0' }}>Please provide your details so we can set up your integration faster.</p>
                        <form onSubmit={e => { e.preventDefault(); setBizFormSubmitted(true); }}>
                          <div style={{ marginBottom: 12 }}>
                            <label>Name</label>
                            <input type="text" required value={bizForm.name} onChange={e => setBizForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #333', background: '#222a36', color: '#e2e8f0' }} />
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label>Email</label>
                            <input type="email" required value={bizForm.email} onChange={e => setBizForm(f => ({ ...f, email: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #333', background: '#222a36', color: '#e2e8f0' }} />
                          </div>
                          <div style={{ marginBottom: 18 }}>
                            <label>Business Type</label>
                            <input type="text" required value={bizForm.businessType} onChange={e => setBizForm(f => ({ ...f, businessType: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #333', background: '#222a36', color: '#e2e8f0' }} placeholder="e.g. Clinic, Agency, Salon" />
                          </div>
                          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit</button>
                        </form>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <h3 style={{ color: '#22c55e', marginBottom: 12 }}>Thank you!</h3>
                        <p>We’ve received your info and will contact you soon to complete your integration.</p>
                        <button className="btn-primary" style={{ marginTop: 18 }} onClick={() => { setShowBizForm(false); setBizFormSubmitted(false); setBizForm({ name: '', email: '', businessType: '' }); }}>Close</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="dashboard-settings">
              <h2>Bot Settings</h2>
              
                               <div className="settings-form">
                   <div className="form-group">
                     <label>Custom Greeting</label>
                     <input 
                       type="text" 
                       defaultValue="Hello! How can I help you today?"
                       placeholder="Enter custom greeting message"
                     />
                   </div>
                   
                   <div className="form-group">
                     <label>Business Hours</label>
                     <div className="time-inputs">
                       <input 
                         type="time" 
                         defaultValue="09:00"
                       />
                       <span>to</span>
                       <input 
                         type="time" 
                         defaultValue="17:00"
                       />
                     </div>
                   </div>
                   
                   <div className="form-group">
                     <label>Timezone</label>
                     <select defaultValue="Asia/Karachi">
                       <option value="Asia/Karachi">Pakistan (PKT)</option>
                       <option value="Asia/Dubai">UAE (GST)</option>
                       <option value="Asia/Tokyo">Japan (JST)</option>
                       <option value="America/New_York">US East (EST)</option>
                       <option value="Europe/London">UK (GMT)</option>
                     </select>
                   </div>
                   
                   <button className="btn-save">Save Settings</button>
                 </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 