import React from 'react';

const GroupCard = ({ group }) => {
  return (
    <div className="card" style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'center' }}>
      <div className="avatar" style={{ width: 52, height: 52, fontSize: 20 }}>
        👥
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800 }}>{group.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {group.members?.length || 0} أعضاء
        </div>
        {group.description && (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {group.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCard;
