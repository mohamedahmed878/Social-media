import React from 'react';

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();

const ProfileCard = ({ user }) => {
  if (!user) return null;
  return (
    <div className="card" style={{ padding: 28, textAlign: 'center' }}>
      <div
        className="avatar"
        style={{ width: 84, height: 84, fontSize: 28, margin: '0 auto 14px' }}
      >
        {user.avatar ? <img src={user.avatar} alt={user.name} /> : initials(user.name)}
      </div>
      <h3 style={{ margin: '0 0 4px' }}>{user.name}</h3>
      <p style={{ color: 'var(--text-muted)', margin: '0 0 10px' }}>{user.email}</p>
      {user.bio && <p style={{ fontSize: 14 }}>{user.bio}</p>}
    </div>
  );
};

export default ProfileCard;
