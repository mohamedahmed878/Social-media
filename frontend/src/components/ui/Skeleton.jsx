import React from 'react';

export const Skeleton = ({ width = '100%', height = 14, radius = 8, style = {} }) => (
  <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />
);

export const ConversationSkeleton = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px' }}>
    <Skeleton width={40} height={40} radius={999} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Skeleton width="60%" height={12} />
      <Skeleton width="85%" height={10} />
    </div>
  </div>
);

export const MessageSkeleton = ({ align = 'end' }) => (
  <div style={{ display: 'flex', justifyContent: align === 'end' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
    <Skeleton width={Math.random() > 0.5 ? 180 : 240} height={38} radius={14} />
  </div>
);
