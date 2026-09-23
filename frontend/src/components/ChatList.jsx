import React from 'react';
import UserCard from './UserCard';
import EmptyState from './ui/EmptyState.jsx';
import { ConversationSkeleton } from './ui/Skeleton.jsx';
import { formatRelative } from '../utils/formatDate';

const ChatList = ({ conversations, activeId, onSelect, currentUserId, loading }) => {
  const otherOf = (conv) =>
    conv.isGroup ? null : conv.participants.find((p) => p._id !== currentUserId);

  const isUnread = (conv) =>
    conv.lastMessage &&
    conv.lastMessage.sender !== currentUserId &&
    conv.lastMessage.sender?._id !== currentUserId &&
    !(conv.lastMessage.readBy || []).some((id) => id === currentUserId || id?._id === currentUserId);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[...Array(5)].map((_, i) => (
          <ConversationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon="💬"
        title="مفيش محادثات لسه"
        subtitle="دور على حد من الأعلى وابدأ أول محادثة."
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {conversations.map((conv, i) => {
        const other = otherOf(conv);
        const title = conv.isGroup ? conv.group?.name || 'جروب' : other?.name;
        const unread = isUnread(conv);
        return (
          <div
            key={conv._id}
            onClick={() => onSelect(conv)}
            className={`conv-item stagger-item${activeId === conv._id ? ' active' : ''}${unread ? ' unread' : ''}`}
            style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
          >
            {conv.isGroup ? (
              <div className="avatar" aria-hidden="true">👥</div>
            ) : (
              <UserCard user={other} compact />
            )}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div className="conv-title">
                <span className="text-conv-title">{title}</span>
                <span className="text-timestamp">{formatRelative(conv.updatedAt)}</span>
              </div>
              <div className="conv-preview">{conv.lastMessage?.text || 'ابدأ المحادثة الآن'}</div>
            </div>
            {unread && <span className="unread-badge">●</span>}
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
