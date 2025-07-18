import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Logo from "./components/Logo";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import Pricing from "./components/Pricing";
import HowItWorks from "./components/HowItWorks";
import Feedback from "./components/Feedback";
import Footer from "./components/Footer";
import StickyCTA from "./components/StickyCTA";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import { AuthProvider } from "./contexts/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Loader />
                <StickyCTA />
                <Navbar />
                <header>
                  <Logo />
                </header>
                <main>
                  <section id="home">
                    <Hero />
                  </section>
                  <section id="features">
                    <Features />
                  </section>
                  <section id="whyus">
                    <Benefits />
                  </section>
                  <section id="pricing" className="pricing-section">
                    <Pricing />
                  </section>
                  <section id="howitworks">
                    <HowItWorks />
                  </section>
                  <section id="feedback">
                    <Feedback />
                  </section>
                </main>
                <Footer />
              </>
            } />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
