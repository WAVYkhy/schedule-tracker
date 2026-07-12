'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar({ blockedDates = [], isAdmin = false, onToggleDate }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatMonth = (date) => {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  };

  const formatDateString = (y, m, d) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const isToday = (d) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
  };

  const isBlocked = (dateStr) => blockedDates.includes(dateStr);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="day-cell empty"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateString(year, month, d);
    const blocked = isBlocked(dateStr);
    const todayClass = isToday(d) ? 'today' : '';
    const interactiveClass = isAdmin ? 'interactive' : '';
    const blockedClass = blocked ? 'blocked' : '';

    days.push(
      <div
        key={d}
        className={`day-cell ${todayClass} ${blockedClass} ${interactiveClass}`.trim()}
        onClick={() => {
          if (isAdmin && onToggleDate) {
            onToggleDate(dateStr);
          }
        }}
      >
        {d}
      </div>
    );
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth} aria-label="이전 달">
          <ChevronLeft size={20} />
        </button>
        <h2>{formatMonth(currentDate)}</h2>
        <button onClick={nextMonth} aria-label="다음 달">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="calendar-grid">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
          <div key={day} className="weekday" style={{ color: idx === 0 ? 'var(--danger-color)' : idx === 6 ? 'var(--accent-color)' : 'var(--text-muted)'}}>
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}
