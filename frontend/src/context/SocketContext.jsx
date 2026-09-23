// ملحوظة: الملف باسمه القديم SocketContext عشان يفضل متوافق مع بنية المشروع،
// بس جوايه دلوقتي بيستخدم Pusher بدل socket.io عشان يشتغل على Vercel.
import React, { createContext, useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import { useAuth } from '../hooks/useAuth';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const pusherRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return undefined;

    const token = localStorage.getItem('jeera_token');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      authEndpoint: `${apiUrl}/pusher/auth`,
      auth: { headers: { Authorization: `Bearer ${token}` } },
    });

    pusher.connection.bind('connected', () => setConnected(true));
    pusher.connection.bind('disconnected', () => setConnected(false));

    pusherRef.current = pusher;

    return () => {
      pusher.disconnect();
      pusherRef.current = null;
    };
  }, [user]);

  const subscribeToConversation = (conversationId, { onMessage, onTyping } = {}) => {
    const pusher = pusherRef.current;
    if (!pusher) return () => {};

    const channel = pusher.subscribe(`private-conversation-${conversationId}`);
    if (onMessage) channel.bind('new-message', onMessage);
    if (onTyping) channel.bind('typing', onTyping);

    return () => {
      pusher.unsubscribe(`private-conversation-${conversationId}`);
    };
  };

  const subscribeToNotifications = (userId, onNotification) => {
    const pusher = pusherRef.current;
    if (!pusher || !userId) return () => {};

    const channel = pusher.subscribe(`private-user-${userId}`);
    channel.bind('new-notification', onNotification);

    return () => {
      pusher.unsubscribe(`private-user-${userId}`);
    };
  };

  return (
    <SocketContext.Provider value={{ connected, subscribeToConversation, subscribeToNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};
