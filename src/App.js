import React from "react";
import "./App.css";
import Logo from "./components/Logo";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import Pricing from "./components/Pricing";
import Feedback from "./components/Feedback";
import Footer from "./components/Footer";
import StickyCTA from "./components/StickyCTA";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
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
        <section id="feedback">
          <Feedback />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
