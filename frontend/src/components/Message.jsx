import React, { useState } from 'react';
import { formatTime } from '../utils/formatDate';

const Message = ({ message, isOwn, grouped, onCopied }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!message.text) return;
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      // متصفح مش داعم للـ clipboard API - مش مشكلة كبيرة
    }
  };

  return (
    <div className={`message-row anim-message-in${isOwn ? ' own' : ' other'}${grouped ? ' grouped' : ''}`}>
      {isOwn && (
        <div className="message-actions">
          <button className="icon-btn" onClick={handleCopy} aria-label="نسخ الرسالة" title="نسخ">
            {copied ? '✓' : '⧉'}
          </button>
        </div>
      )}
      <div className={`bubble ${isOwn ? 'own' : 'other'}`}>
        {!isOwn && !grouped && <div className="bubble-sender">{message.sender?.name}</div>}
        {message.text && <div className="text-message">{message.text}</div>}
        {message.attachment && (
          <img
            src={message.attachment}
            alt="مرفق"
            style={{ maxWidth: '100%', borderRadius: 10, marginTop: 6 }}
          />
        )}
        <div className="bubble-time">{formatTime(message.createdAt)}</div>
      </div>
    </div>
  );
};

export default Message;
