'use client';
import { useState } from 'react';
import Calendar from '@/components/Calendar';

export default function CalendarClient({ initialBlockedDates, earliestStartStr }) {
  const [selectedDeadline, setSelectedDeadline] = useState(null);

  const handleSelectDeadline = (dateStr) => {
    setSelectedDeadline(dateStr);
  };

  // Calculate project feasibilities
  let basicStatus = null;
  let live2DStatus = null;

  if (selectedDeadline && earliestStartStr) {
    const start = new Date(earliestStartStr);
    const deadline = new Date(selectedDeadline);
    
    let availableWorkingDays = 0;
    let current = new Date(start);
    
    while (current <= deadline) {
      const y = current.getFullYear();
      const m = current.getMonth();
      const d = current.getDate();
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      if (!initialBlockedDates.includes(dateStr)) {
        availableWorkingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    // Basic Omakase: 14+ days -> available, 7-13 days -> negotiate, <7 days -> unavailable
    if (availableWorkingDays >= 14) {
      basicStatus = 'available';
    } else if (availableWorkingDays >= 7) {
      basicStatus = 'negotiate';
    } else {
      basicStatus = 'unavailable';
    }

    // Live2D + Omakase: 21+ days -> available, 7-20 days -> negotiate, <7 days -> unavailable
    if (availableWorkingDays >= 21) {
      live2DStatus = 'available';
    } else if (availableWorkingDays >= 7) {
      live2DStatus = 'negotiate';
    } else {
      live2DStatus = 'unavailable';
    }
  }

  const formatKoreanDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${parseInt(m)}월 ${parseInt(d)}일`;
  };

  const tooltipText = "곡, 일러스트, 요청사항 등의 검토가 필요합니다. 기간 부족에 따른 추가금이 요청될 수 있다는 점 양해 부탁드립니다.";

  return (
    <div className="client-calendar-wrapper">
      <Calendar 
        blockedDates={initialBlockedDates} 
        isAdmin={false} 
        selectedDeadline={selectedDeadline}
        onSelectDeadline={handleSelectDeadline}
      />

      {/* Deadline Info Panel */}
      <div className="deadline-info-container">
        {selectedDeadline ? (
          <div className="deadline-card">
            <h3 className="deadline-card-title">
              희망 마감일: <span className="highlight-deadline-text">{formatKoreanDate(selectedDeadline)}</span>
            </h3>
            <div className="deadline-status-list">
              <div className="deadline-status-item">
                <span className="status-label">기본 오마카세 (14일 소요)</span>
                <span 
                  className={`status-badge ${basicStatus}`}
                  data-tooltip={basicStatus === 'negotiate' ? tooltipText : undefined}
                >
                  {basicStatus === 'available' ? '작업 가능' : basicStatus === 'negotiate' ? '협의 필요' : '기간 부족'}
                </span>
              </div>
              <div className="deadline-status-item">
                <span className="status-label">오마카세 + Live2D (21일 소요)</span>
                <span 
                  className={`status-badge ${live2DStatus}`}
                  data-tooltip={live2DStatus === 'negotiate' ? tooltipText : undefined}
                >
                  {live2DStatus === 'available' ? '작업 가능' : live2DStatus === 'negotiate' ? '협의 필요' : '기간 부족'}
                </span>
              </div>
            </div>
            <p className="deadline-caption">
              빠른 마감을 원하실 경우 협의가 필요합니다.
            </p>
          </div>
        ) : (
          <div className="deadline-placeholder">
            달력에서 희망 마감일을 클릭하시면 작업 예약 가능 여부를 확인하실 수 있습니다.
          </div>
        )}
      </div>
    </div>
  );
}
