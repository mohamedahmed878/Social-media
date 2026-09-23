import React from 'react';

const TypingIndicator = ({ name }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, marginTop: 4 }}>
    {name && <span className="text-timestamp">{name} بيكتب دلوقتي...</span>}
    <div className="typing-indicator" aria-label="بيكتب دلوقتي">
      <span />
      <span />
      <span />
    </div>
  </div>
);

export default TypingIndicator;
