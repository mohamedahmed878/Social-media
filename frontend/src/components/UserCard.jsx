import React from 'react';

const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

const UserCard = ({ user, onClick, compact, selected }) => {
  if (!user) return null;
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: compact ? 0 : '10px 12px',
        borderRadius: 14,
        cursor: onClick ? 'pointer' : 'default',
        background: selected ? 'var(--surface-secondary)' : 'transparent',
      }}
    >
      <div className="avatar" style={{ position: 'relative' }}>
        {user.avatar ? <img src={user.avatar} alt={user.name} /> : initials(user.name)}
        <span
          className={`status-dot ${user.status === 'online' ? 'online' : 'offline'}`}
          style={{ position: 'absolute', bottom: -1, insetInlineEnd: -1 }}
        />
      </div>
      {!compact && (
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {user.status === 'online' ? 'متصل الآن' : 'غير متصل'}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
