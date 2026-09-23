import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext.jsx';

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket لازم يتستخدم جوه SocketProvider');
  return ctx;
};
