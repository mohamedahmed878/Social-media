export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
};

export const formatRelative = (date) => {
  if (!date) return '';
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `من ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `من ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `من ${days} يوم`;
};
