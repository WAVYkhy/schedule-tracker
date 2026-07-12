'use client';
import { useState, useTransition } from 'react';
import Calendar from '@/components/Calendar';
import { toggleBlockedDate, logout, addBlockedDates, removeBlockedDates } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminDashboard({ initialBlockedDates }) {
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates);
  const [isPending, startTransition] = useTransition();
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const router = useRouter();

  const handleToggleDate = (dateStr) => {
    startTransition(async () => {
      const res = await toggleBlockedDate(dateStr);
      if (res.success) {
        setBlockedDates(res.data);
      } else {
        alert(res.error || '일정 변경에 실패했습니다. 다시 시도해 주세요.');
      }
    });
  };

  const handleSelectDate = (dateStr) => {
    setSelectedDates((prev) => {
      if (prev.includes(dateStr)) {
        return prev.filter((d) => d !== dateStr);
      } else {
        return [...prev, dateStr];
      }
    });
  };

  const handleToggleMultiSelectMode = (checked) => {
    setIsMultiSelectMode(checked);
    setSelectedDates([]); // 모드 변경 시 선택 초기화
  };

  const handleBatchBlock = () => {
    if (selectedDates.length === 0) return;
    startTransition(async () => {
      const res = await addBlockedDates(selectedDates);
      if (res.success) {
        setBlockedDates(res.data);
        setSelectedDates([]); // 등록 성공 시 선택 초기화
      } else {
        alert(res.error || '일괄 일정 마감에 실패했습니다. 다시 시도해 주세요.');
      }
    });
  };

  const handleBatchUnblock = () => {
    if (selectedDates.length === 0) return;
    startTransition(async () => {
      const res = await removeBlockedDates(selectedDates);
      if (res.success) {
        setBlockedDates(res.data);
        setSelectedDates([]); // 해제 성공 시 선택 초기화
      } else {
        alert(res.error || '일괄 일정 해제에 실패했습니다. 다시 시도해 주세요.');
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedDates([]);
  };

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <div className="admin-header-actions">
          <h1 className="title" style={{ marginBottom: 0, textAlign: 'left' }}>일정 관리</h1>
          <button onClick={handleLogout} className="btn-icon" aria-label="로그아웃" title="로그아웃">
            <LogOut size={20} />
          </button>
        </div>
        <p className="subtitle" style={{ textAlign: 'left', marginBottom: '1rem' }}>
          작업이 불가능한 날짜(마감일)를 클릭하여 설정하세요.
        </p>

        {/* 다중 선택 모드 토글 */}
        <div className="multi-select-toggle-container">
          <div className="multi-select-label-wrapper">
            <span>다중 선택 모드</span>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isMultiSelectMode} 
              onChange={(e) => handleToggleMultiSelectMode(e.target.checked)} 
            />
            <span className="slider"></span>
          </label>
        </div>

        <div style={{ position: 'relative' }}>
          {isPending && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.5)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1rem' }}>
              <div className="spinner"></div>
            </div>
          )}
          <Calendar 
            blockedDates={blockedDates} 
            isAdmin={true} 
            onToggleDate={handleToggleDate} 
            selectedDates={selectedDates}
            onSelectDate={handleSelectDate}
            isMultiSelectMode={isMultiSelectMode}
          />
        </div>

        {/* 다중 선택 시 나타나는 일괄 액션 패널 */}
        {isMultiSelectMode && selectedDates.length > 0 && (
          <div className="batch-actions-panel">
            <div className="batch-actions-info">
              <span className="badge">{selectedDates.length}</span>일 선택됨
            </div>
            <div className="batch-actions-buttons">
              <button 
                type="button" 
                className="batch-btn-block" 
                onClick={handleBatchBlock}
                disabled={isPending}
              >
                마감 등록
              </button>
              <button 
                type="button" 
                className="batch-btn-unblock" 
                onClick={handleBatchUnblock}
                disabled={isPending}
              >
                마감 해제
              </button>
              <button 
                type="button" 
                className="batch-btn-clear" 
                onClick={handleClearSelection}
                disabled={isPending}
              >
                선택 취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

