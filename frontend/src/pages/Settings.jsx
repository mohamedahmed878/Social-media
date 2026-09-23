import React from 'react';
import Navbar from '../components/Navbar';
import { useSocket } from '../hooks/useSocket';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

const SettingsSection = ({ title, children }) => (
  <div className="card anim-fade-up" style={{ padding: 20, marginBottom: 16 }}>
    <div className="text-section-title" style={{ marginBottom: 14 }}>{title}</div>
    {children}
  </div>
);

const Row = ({ label, children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}
  >
    <span className="text-secondary">{label}</span>
    {children}
  </div>
);

const Settings = () => {
  const { connected } = useSocket();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <Navbar title="الإعدادات" />
      <div style={{ padding: 24, maxWidth: 520 }}>
        <SettingsSection title="الحساب">
          <Row label="الاسم">
            <span className="text-secondary">{user?.name}</span>
          </Row>
          <Row label="البريد الإلكتروني">
            <span className="text-secondary">{user?.email}</span>
          </Row>
          <div style={{ paddingTop: 14 }}>
            <button className="btn btn-outline" onClick={logout}>تسجيل خروج</button>
          </div>
        </SettingsSection>

        <SettingsSection title="المظهر">
          <Row label="الوضع الداكن/الفاتح">
            <button className="btn btn-outline" onClick={toggleTheme}>
              {theme === 'dark' ? '🌙 داكن' : '☀️ فاتح'}
            </button>
          </Row>
        </SettingsSection>

        <SettingsSection title="الاتصال اللحظي">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`status-dot ${connected ? 'online' : 'offline'}`} style={{ border: 'none' }} />
            <span className="text-secondary">
              {connected ? 'متصل عن طريق Pusher' : 'مش متصل'}
            </span>
          </div>
        </SettingsSection>

        <SettingsSection title="عن جيرة">
          <p className="text-secondary" style={{ lineHeight: 1.7, margin: 0 }}>
            منصة تواصل ومحادثات فورية. الاتصال اللحظي شغال عن طريق Pusher
            بدل Socket.io عشان يشتغل تمام مع الـ serverless functions.
          </p>
        </SettingsSection>
      </div>
    </div>
  );
};

export default Settings;
