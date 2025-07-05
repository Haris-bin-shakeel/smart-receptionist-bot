import React from "react";

const Contact = () => (
  <section style={{ margin: '3rem 0', textAlign: 'center' }}>
    <h2 style={{ color: 'var(--color-green)', fontWeight: 600, fontSize: '2rem', marginBottom: '2rem' }}>Contact Us</h2>
    <form action="https://formsubmit.co/harisshakeel0981@gmail.com" method="POST" style={{
      display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: 400, margin: '0 auto', background: 'var(--color-accent)', padding: '2rem 1.5rem', borderRadius: 16, boxShadow: '0 2px 8px rgba(34,197,94,0.06)'
    }}>
      <input name="name" type="text" placeholder="Your Name" required style={{ padding: '0.8rem', borderRadius: 8, border: '1.5px solid var(--color-green)', fontSize: '1rem' }} />
      <input name="email" type="email" placeholder="Your Email" required style={{ padding: '0.8rem', borderRadius: 8, border: '1.5px solid var(--color-green)', fontSize: '1rem' }} />
      <textarea name="message" placeholder="Your Message" required rows={4} style={{ padding: '0.8rem', borderRadius: 8, border: '1.5px solid var(--color-green)', fontSize: '1rem', resize: 'vertical' }} />
      <button type="submit" style={{ background: 'var(--color-green)', color: '#fff', padding: '0.8rem', borderRadius: 8, fontWeight: 600, fontSize: '1.05rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
        Send Message
      </button>
    </form>
    <div style={{ marginTop: '2rem', color: 'var(--color-slate)', fontSize: '1rem' }}>
      <div>Email: <a href="mailto:harisshakeel0981@gmail.com" style={{ color: 'var(--color-indigo)' }}>harisshakeel0981@gmail.com</a></div>
      <div>WhatsApp: <a href="https://wa.me/923448375098" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-indigo)' }}>+92 344 8375098</a></div>
      <div>LinkedIn: <a href="https://www.linkedin.com/in/haris-shakeel-aa1186330" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-indigo)' }}>haris-shakeel-aa1186330</a></div>
    </div>
  </section>
);

export default Contact; 