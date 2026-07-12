import { getBlockedDates } from '@/app/actions';
import CalendarClient from './CalendarClient';

export const dynamic = 'force-dynamic';

export default async function PublicPage() {
  const blockedDates = await getBlockedDates();

  const getEarliestAvailableDate = (blockedDates) => {
    const today = new Date();
    // Start checking from tomorrow
    let current = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    while (true) {
      const y = current.getFullYear();
      const m = current.getMonth();
      const d = current.getDate();
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      if (!blockedDates.includes(dateStr)) {
        return {
          month: m + 1,
          date: d
        };
      }
      current.setDate(current.getDate() + 1);
    }
  };

  const earliestDate = getEarliestAvailableDate(blockedDates);

  return (
    <div className="app-container">
      <div className="glass-card">
        <h1 className="title">
          가장 빠른 작업 시작 가능일은 <br/>
          <span className="highlight-date">{earliestDate.month}월 {earliestDate.date}일</span> 입니다.
        </h1>
        <p className="subtitle">일정을 확인하시고 문의해 주세요.</p>
        
        <CalendarClient initialBlockedDates={blockedDates} />
      </div>
    </div>
  );
}
