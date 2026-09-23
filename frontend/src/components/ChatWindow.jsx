import React, { useEffect, useMemo, useRef, useState } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator.jsx';
import DateSeparator, { dateLabel } from './DateSeparator.jsx';
import EmptyState from './ui/EmptyState.jsx';
import { MessageSkeleton } from './ui/Skeleton.jsx';
import { getMessages, markConversationRead, sendMessage, sendTypingSignal } from '../services/chatApi';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../hooks/useToast';

const GROUP_WINDOW_MS = 3 * 60 * 1000;
const TYPING_STOP_DELAY = 2000;

const ChatWindow = ({ conversation, onBack }) => {
  const { user } = useAuth();
  const { subscribeToConversation } = useSocket();
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const wasTypingRef = useRef(false);

  useEffect(() => {
    if (!conversation) return undefined;
    setLoading(true);
    setMessages([]);
    getMessages(conversation._id)
      .then(setMessages)
      .catch(() => showToast('تعذّر تحميل الرسايل، حاول تاني', 'error'))
      .finally(() => setLoading(false));

    markConversationRead(conversation._id).catch(() => {});

    const unsubscribe = subscribeToConversation(conversation._id, {
      onMessage: (msg) => setMessages((prev) => [...prev, msg]),
      onTyping: (payload) => {
        if (payload.userId === user._id) return;
        setTypingUser(payload.isTyping ? payload.name : null);
        if (payload.isTyping) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3500);
        }
      },
    });

    return () => {
      unsubscribe();
      clearTimeout(typingTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleTextChange = (e) => {
    setText(e.target.value);

    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }

    if (!wasTypingRef.current) {
      wasTypingRef.current = true;
      sendTypingSignal(conversation._id, true).catch(() => {});
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      wasTypingRef.current = false;
      sendTypingSignal(conversation._id, false).catch(() => {});
    }, TYPING_STOP_DELAY);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const body = text.trim();
    if (!body || sending) return;

    setSending(true);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    clearTimeout(typingTimeoutRef.current);
    wasTypingRef.current = false;
    sendTypingSignal(conversation._id, false).catch(() => {});

    try {
      const msg = await sendMessage({ conversationId: conversation._id, text: body });
      setMessages((prev) => [...prev, msg]);
    } catch (err) {
      showToast('تعذّر إرسال الرسالة', 'error');
      setText(body);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const groupedMessages = useMemo(() => {
    return messages.map((m, i) => {
      const prev = messages[i - 1];
      const sameSender = prev && prev.sender?._id === m.sender?._id;
      const closeInTime =
        prev && new Date(m.createdAt) - new Date(prev.createdAt) < GROUP_WINDOW_MS;
      const sameDay = prev && dateLabel(prev.createdAt) === dateLabel(m.createdAt);
      const showDateSeparator = !prev || dateLabel(prev.createdAt) !== dateLabel(m.createdAt);
      return { ...m, grouped: !!(sameSender && closeInTime && sameDay), showDateSeparator };
    });
  }, [messages]);

  if (!conversation) {
    return (
      <div style={{ flex: 1, display: 'flex' }}>
        <EmptyState
          icon="👋"
          title="اختار محادثة عشان تبدأ"
          subtitle="اختار حد من القايمة على الشمال أو ابدأ محادثة جديدة."
        />
      </div>
    );
  }

  const other = conversation.isGroup
    ? null
    : conversation.participants.find((p) => p._id !== user._id);
  const title = conversation.isGroup ? conversation.group?.name || 'جروب' : other?.name;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <button className="icon-btn mobile-back-btn" onClick={onBack} aria-label="رجوع للمحادثات">
          →
        </button>
        {!conversation.isGroup && <UserAvatar user={other} />}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div className="text-conv-title" style={{ fontSize: 15 }}>{title}</div>
          {!conversation.isGroup && (
            <div className="text-timestamp">
              {other?.status === 'online' ? 'متصل الآن' : 'غير متصل'}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
        {loading ? (
          <>
            <MessageSkeleton align="start" />
            <MessageSkeleton align="end" />
            <MessageSkeleton align="start" />
          </>
        ) : (
          groupedMessages.map((m) => (
            <React.Fragment key={m._id}>
              {m.showDateSeparator && <DateSeparator date={m.createdAt} />}
              <Message message={m} isOwn={m.sender?._id === user._id} grouped={m.grouped} />
            </React.Fragment>
          ))
        )}
        {typingUser && <TypingIndicator name={typingUser} />}
        <div ref={bottomRef} />
      </div>

      <form className="composer" onSubmit={handleSend}>
        <textarea
          ref={textareaRef}
          className="composer-input"
          placeholder="اكتب رسالتك هنا..."
          value={text}
          rows={1}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          aria-label="اكتب رسالة"
        />
        <button type="submit" className="send-btn" disabled={!text.trim() || sending} aria-label="إرسال">
          {sending ? <span className="spinner" /> : '➤'}
        </button>
      </form>
    </div>
  );
};

const UserAvatar = ({ user }) => {
  if (!user) return null;
  const initials = (user.name || '')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  return (
    <div className="avatar" style={{ position: 'relative' }}>
      {user.avatar ? <img src={user.avatar} alt={user.name} /> : initials}
      <span
        className={`status-dot ${user.status === 'online' ? 'online' : 'offline'}`}
        style={{ position: 'absolute', bottom: -1, insetInlineEnd: -1 }}
      />
    </div>
  );
};

export default ChatWindow;
