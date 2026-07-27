'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

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
  const { t, formatHeaderRange, formatMonthTitle, formatDayAriaLabel } = useLanguage();
  const today = new Date();

  const getInitialDate = () => {
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const todayMidnight = new Date(currentYear, currentMonth, today.getDate());
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let hasAvailableDay = false;
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(currentYear, currentMonth, d);
      if (cellDate >= todayMidnight) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        if (!blockedDates.includes(dateStr)) {
          hasAvailableDay = true;
          break;
        }
      }
    }

    if (!hasAvailableDay) {
      return new Date(currentYear, currentMonth + 1, 1);
    }
    return new Date(currentYear, currentMonth, 1);
  };

  const [currentDate, setCurrentDate] = useState(getInitialDate);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

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

  const weekdaysList = t('weekdays');

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
      const isInteractive = isAdmin ? !isPast : (!isPast && !blocked);
      const interactiveClass = isInteractive ? 'interactive' : '';

      const handleCellClick = () => {
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
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCellClick();
        }
      };

      days.push(
        <div
          key={d}
          role={isInteractive ? 'button' : undefined}
          tabIndex={isInteractive ? 0 : -1}
          aria-label={formatDayAriaLabel(y, m, d, blocked, selected)}
          aria-disabled={isPast || (!isAdmin && blocked)}
          onKeyDown={isInteractive ? handleKeyDown : undefined}
          className={`day-cell ${todayClass} ${blockedClass} ${selectedClass} ${selectedDeadlineClass} ${pastClass} ${interactiveClass}`.trim()}
          onClick={handleCellClick}
        >
          {d}
        </div>
      );
    }

    return (
      <div className="calendar-month">
        <h3 className="calendar-month-title">{formatMonthTitle(monthDate)}</h3>
        <div className="calendar-grid">
          {weekdaysList.map((day, idx) => (
            <div 
              key={day} 
              className="weekday" 
              style={{ color: idx === 0 ? 'var(--danger-color)' : 'var(--text-muted)' }}
            >
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
        <button onClick={prevMonth} aria-label={t('nav_prev_month')}>
          <ChevronLeft size={20} />
        </button>
        <span className="calendar-nav-title">{formatHeaderRange(currentDate, nextMonthDate)}</span>
        <button onClick={nextMonth} aria-label={t('nav_next_month')}>
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
