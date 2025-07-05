import React from "react";

const features = [
  { icon: "🎤", title: "Voice Input", desc: "Let customers speak their queries—no typing needed." },
  { icon: "🤖", title: "AI Replies", desc: "Smart, instant answers to customer questions." },
  { icon: "📅", title: "Calendar Sync", desc: "Seamless appointment booking and reminders." },
  { icon: "❓", title: "FAQ Auto-Reply", desc: "Answers common questions automatically, 24/7." },
];

const cardStyle = {
  background: "#fff",
  borderRadius: 20,
  padding: "2.2rem 1.5rem 1.7rem 1.5rem",
  boxShadow: "0 4px 24px rgba(99,102,241,0.07)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "transform 0.18s, box-shadow 0.18s",
  border: "1.5px solid #e0e7ef",
  cursor: "pointer",
};

const cardHover = {
  transform: "translateY(-6px) scale(1.025)",
  boxShadow: "0 8px 32px rgba(99,102,241,0.13)",
  borderColor: "#6366f1",
};

const Features = () => {
  const [hovered, setHovered] = React.useState(-1);
  return (
    <section style={{ background: "#f6f8fc", padding: "4.5rem 0 4rem 0", margin: "0 0 3rem 0" }}>
      <h2 style={{ color: "#6366f1", fontWeight: 700, fontSize: "2.3rem", marginBottom: "2.5rem", letterSpacing: "-1px" }}>Features</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "2.2rem",
        maxWidth: 1100,
        margin: "0 auto"
      }}>
        {features.map((f, i) => (
          <div
            key={i}
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
            <div style={{
              background: "linear-gradient(135deg, #6366f1 60%, #38bdf8 100%)",
              borderRadius: "50%",
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
              boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
            }}>
              <span style={{ fontSize: "2.2rem", color: "#fff" }}>{f.icon}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.18rem", color: "#22223b", marginBottom: "0.6rem", letterSpacing: "-0.5px" }}>{f.title}</div>
            <div style={{ color: "#475569", fontSize: "1.04rem", lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features; 