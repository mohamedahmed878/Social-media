import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../services/userApi';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await updateProfile({ name, bio });
    setUser(updated);
    localStorage.setItem('jeera_user', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar title="الملف الشخصي" />
      <div style={{ padding: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ width: 280 }}>
          <ProfileCard user={user} />
        </div>
        <form onSubmit={handleSubmit} className="card" style={{ padding: 24, flex: 1, minWidth: 280 }}>
          <h3 style={{ marginTop: 0 }}>تعديل البيانات</h3>
          <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>الاسم</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ margin: '6px 0 16px' }}
          />
          <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>نبذة عنك</label>
          <textarea
            className="input"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            style={{ margin: '6px 0 16px', resize: 'vertical' }}
          />
          <button className="btn btn-primary" type="submit">
            حفظ التعديلات
          </button>
          {saved && <span style={{ color: 'var(--accent-2)', marginRight: 12, fontSize: 13 }}>✓ اتحفظت</span>}
        </form>
      </div>
    </div>
  );
};

export default Profile;
