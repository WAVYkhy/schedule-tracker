'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar({ 
  blockedDates = [], 
  isAdmin = false, 
  onToggleDate,
  selectedDates = [],
  onSelectDate,
  isMultiSelectMode = false,
  selectedDeadline = null,
  onSelectDeadline
}) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatMonth = (date) => {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  };

  const formatDateString = (y, m, d) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const isToday = (y, m, d) => {
    return today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
  };

  const isBlocked = (dateStr) => blockedDates.includes(dateStr);
  const isSelected = (dateStr) => selectedDates.includes(dateStr);
  const isSelectedDeadline = (dateStr) => selectedDeadline === dateStr;

  const nextMonthDate = new Date(year, month + 1, 1);

  const renderMonth = (monthDate) => {
    const y = monthDate.getFullYear();
    const m = monthDate.getMonth();
    const daysInMonth = getDaysInMonth(y, m);
    const firstDay = getFirstDayOfMonth(y, m);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day-cell empty"></div>);
    }

    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateString(y, m, d);
      const blocked = isBlocked(dateStr);
      const selected = isSelected(dateStr);
      const selectedDeadlineClass = isSelectedDeadline(dateStr) ? 'selected-deadline' : '';
      const cellDate = new Date(y, m, d);
      const isPast = cellDate < todayMidnight;

      const todayClass = isToday(y, m, d) ? 'today' : '';
      const blockedClass = blocked ? 'blocked' : '';
      const selectedClass = selected ? 'selected' : '';
      const pastClass = isPast ? 'past' : '';
      const interactiveClass = (isAdmin ? !isPast : (!isPast && !blocked)) ? 'interactive' : '';

      days.push(
        <div
          key={d}
          className={`day-cell ${todayClass} ${blockedClass} ${selectedClass} ${selectedDeadlineClass} ${pastClass} ${interactiveClass}`.trim()}
          onClick={() => {
            if (isPast) return;
            if (isAdmin) {
              if (isMultiSelectMode && onSelectDate) {
                onSelectDate(dateStr);
              } else if (onToggleDate) {
                onToggleDate(dateStr);
              }
            } else {
              if (!blocked && onSelectDeadline) {
                onSelectDeadline(dateStr);
              }
            }
          }}
        >
          {d}
        </div>
      );
    }

    return (
      <div className="calendar-month">
        <h3 className="calendar-month-title">{formatMonth(monthDate)}</h3>
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
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth} aria-label="이전 달">
          <ChevronLeft size={20} />
        </button>
        <span className="calendar-nav-title">일정 확인</span>
        <button onClick={nextMonth} aria-label="다음 달">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="calendars-container">
        {renderMonth(currentDate)}
        {renderMonth(nextMonthDate)}
      </div>
    </div>
  );
}
