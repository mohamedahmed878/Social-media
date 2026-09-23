import React from 'react';

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const dateLabel = (dateInput) => {
  const date = new Date(dateInput);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return 'اليوم';
  if (isSameDay(date, yesterday)) return 'أمس';
  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
};

const DateSeparator = ({ date }) => <div className="date-separator">{dateLabel(date)}</div>;

export default DateSeparator;
