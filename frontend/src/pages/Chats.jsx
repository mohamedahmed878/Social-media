import React, { useEffect, useState } from 'react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import UserCard from '../components/UserCard';
import { useAuth } from '../hooks/useAuth';
import { getConversations, startConversation } from '../services/chatApi';
import { searchUsers } from '../services/userApi';
import { useToast } from '../hooks/useToast';

const Chats = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const loadConversations = () =>
    getConversations()
      .then(setConversations)
      .catch(() => showToast('تعذّر تحميل المحادثات', 'error'))
      .finally(() => setLoadingConvs(false));

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setSearching(false);
      return undefined;
    }
    setSearching(true);
    const id = setTimeout(() => {
      searchUsers(search)
        .then(setResults)
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(id);
  }, [search]);

  const handleSelect = (conv) => {
    setActive(conv);
    setShowMobileChat(true);
  };

  const handleStartChat = async (targetUser) => {
    try {
      const conv = await startConversation(targetUser._id);
      setSearch('');
      setResults([]);
      await loadConversations();
      handleSelect(conv);
    } catch (err) {
      showToast('تعذّر بدء المحادثة', 'error');
    }
  };

  return (
    <div className="chats-shell">
      <div className={`chats-sidebar${showMobileChat ? ' hide-mobile' : ''}`}>
        <div style={{ padding: 18 }}>
          <h3 className="text-page-title" style={{ marginBottom: 14 }}>المحادثات</h3>
          <input
            className="input"
            placeholder="دور على حد تبدأ تدردش معاه..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="بحث عن مستخدمين"
          />
          {searching && (
            <div className="text-timestamp" style={{ marginTop: 8 }}>جاري البحث...</div>
          )}
          {!searching && results.length > 0 && (
            <div className="card anim-fade-up" style={{ marginTop: 8, padding: 8 }}>
              {results.map((r) => (
                <UserCard key={r._id} user={r} onClick={() => handleStartChat(r)} />
              ))}
            </div>
          )}
          {!searching && search.trim() && results.length === 0 && (
            <div className="text-timestamp" style={{ marginTop: 8 }}>مفيش نتايج</div>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          <ChatList
            conversations={conversations}
            activeId={active?._id}
            onSelect={handleSelect}
            currentUserId={user._id}
            loading={loadingConvs}
          />
        </div>
      </div>
      <div className="chats-main">
        <ChatWindow conversation={active} onBack={() => setShowMobileChat(false)} />
      </div>
    </div>
  );
};

export default Chats;
