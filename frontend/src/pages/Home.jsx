import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { getConversations } from '../services/chatApi';
import { getMyGroups } from '../services/groupApi';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ chats: 0, groups: 0 });

  useEffect(() => {
    Promise.all([getConversations(), getMyGroups()]).then(([conversations, groups]) => {
      setStats({ chats: conversations.length, groups: groups.length });
    });
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Navbar title={`أهلاً بيك، ${user?.name}`} />
      <div style={{ padding: 24, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        <div className="card anim-fade-up" style={{ padding: 22, minWidth: 200 }}>
          <div className="text-secondary">محادثاتك</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent)' }}>{stats.chats}</div>
        </div>
        <div className="card anim-fade-up" style={{ padding: 22, minWidth: 200, animationDelay: '60ms' }}>
          <div className="text-secondary">جروباتك</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent-2)' }}>{stats.groups}</div>
        </div>
      </div>
      <div className="text-secondary" style={{ padding: '0 24px' }}>
        روح لصفحة "المحادثات" عشان تدردش لايف مع أصحابك، أو "الجروبات" عشان تعمل جروب جديد.
      </div>
    </div>
  );
};

export default Home;
