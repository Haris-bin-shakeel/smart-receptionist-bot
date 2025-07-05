import React from "react";

const Loader = () => (
  <div id="global-loader" style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(248,250,252,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.4s', pointerEvents: 'none', opacity: 0, visibility: 'hidden'
  }}>
    <div style={{
      width: 56, height: 56, border: '6px solid var(--color-indigo)', borderTop: '6px solid var(--color-sky)', borderRadius: '50%', animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Loader; 