import React from 'react';

const EmptyState = ({ icon = '💬', title, subtitle }) => (
  <div className="empty-state">
    <div className="empty-icon" aria-hidden="true">{icon}</div>
    {title && <div className="empty-title">{title}</div>}
    {subtitle && <div className="empty-subtitle">{subtitle}</div>}
  </div>
);

export default EmptyState;
