import React from 'react';
import '../styles/Loader.css';

const Loader = () => (
  <div className="loader-container" aria-live="polite" aria-label="Bot is typing">
    <div className="typing-dots">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
    <span className="loader-text">Bot is typing...</span>
  </div>
);

export default Loader; 