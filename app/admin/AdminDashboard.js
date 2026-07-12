'use client';
import { useState, useTransition } from 'react';
import Calendar from '@/components/Calendar';
import { toggleBlockedDate, logout } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminDashboard({ initialBlockedDates }) {
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleDate = (dateStr) => {
    startTransition(async () => {
      try {
        const newDates = await toggleBlockedDate(dateStr);
        setBlockedDates(newDates);
      } catch (e) {
        console.error(e);
        alert('일정 변경에 실패했습니다. 권한을 확인해주세요.');
      }
    });
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
          />
        </div>
      </div>
    </div>
  );
}
