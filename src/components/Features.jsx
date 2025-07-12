import React from "react";

const features = [
  { 
    icon: "fas fa-microphone", 
    title: "Voice Input", 
    desc: "Let customers speak their queries—no typing needed.",
    color: "#22c55e"
  },
  { 
    icon: "fas fa-robot", 
    title: "AI Replies", 
    desc: "Smart, instant answers to customer questions.",
    color: "#6366f1"
  },
  { 
    icon: "fas fa-calendar-alt", 
    title: "Calendar Sync", 
    desc: "Seamless appointment booking and reminders.",
    color: "#0ea5e9"
  },
  { 
    icon: "fas fa-question-circle", 
    title: "FAQ Auto-Reply", 
    desc: "Answers common questions automatically, 24/7.",
    color: "#f59e0b"
  },
];

const cardStyle = {
  background: "var(--bg-card)",
  borderRadius: "var(--radius-2xl)",
  padding: "var(--spacing-2xl) var(--spacing-lg)",
  boxShadow: "var(--shadow-md)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "all var(--transition-normal)",
  border: "2px solid var(--border-light)",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
};

const cardHover = {
  transform: "translateY(-8px) scale(1.02)",
  boxShadow: "var(--shadow-xl)",
  borderColor: "var(--primary-purple)",
};

const Features = () => {
  const [hovered, setHovered] = React.useState(-1);
  return (
    <section className="features-section">
      <div className="features-container">
        <h2 className="features-title">Features</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className={`feature-card ${hovered === i ? 'hovered' : ''}`}
              style={{
                ...cardStyle,
                ...(hovered === i ? cardHover : {}),
              }}
              tabIndex={0}
              aria-label={f.title + ': ' + f.desc}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(-1)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(-1)}
            >
              <div className="feature-icon-wrapper" style={{ background: `linear-gradient(135deg, ${f.color} 0%, ${f.color}80 100%)` }}>
                <i className={f.icon} style={{ color: "#fff", fontSize: "1.5rem" }}></i>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-description">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 