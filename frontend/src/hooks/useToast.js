import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext.jsx';

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast لازم يتستخدم جوه ToastProvider');
  return ctx;
};
