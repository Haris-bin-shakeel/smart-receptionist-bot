import React from "react";
import "./App.css";
import Logo from "./components/Logo";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import StickyCTA from "./components/StickyCTA";
import Loader from "./components/Loader";

function App() {
  return (
    <div className="App">
      <Loader />
      <StickyCTA />
      <header>
        <Logo />
      </header>
      <main>
        <Hero />
        <Features />
        <Benefits />
        <section className="pricing-section">
          <h2 className="pricing-title">Pricing</h2>
          <Pricing />
        </section>
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default App;
