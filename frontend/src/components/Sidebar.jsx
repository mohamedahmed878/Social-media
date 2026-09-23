import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'الرئيسية', icon: '🏠' },
  { to: '/chats', label: 'المحادثات', icon: '💬' },
  { to: '/groups', label: 'الجروبات', icon: '👥' },
  { to: '/profile', label: 'الملف الشخصي', icon: '🙂' },
  { to: '/settings', label: 'الإعدادات', icon: '⚙️' },
];

const Sidebar = () => {
  return (
    <aside className="rail" aria-label="القايمة الرئيسية">
      <div className="rail-logo">ج</div>
      <nav className="rail-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `rail-item${isActive ? ' active' : ''}`}
            title={item.label}
            aria-label={item.label}
          >
            <span aria-hidden="true">{item.icon}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
