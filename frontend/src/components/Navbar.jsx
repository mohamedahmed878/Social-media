import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import UserCard from './UserCard';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 24px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <h2 className="text-page-title">{title}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
          title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {user && <UserCard user={user} compact />}
        <button className="btn btn-outline" onClick={logout}>
          تسجيل خروج
        </button>
      </div>
    </header>
  );
};

export default Navbar;
