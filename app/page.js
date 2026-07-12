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
          date: d,
          dateStr: dateStr
        };
      }
      current.setDate(current.getDate() + 1);
    }
  };

  const earliestDate = getEarliestAvailableDate(blockedDates);

  return (
    <div className="app-container">
      <div className="glass-card">
        <div className="brand-header">
          <span className="brand-logo">WAVIT_studio</span>
        </div>
        <h1 className="title" style={{ marginBottom: '2rem' }}>
          지금 예약하실 경우 <br className="mobile-br"/>
          <span className="highlight-date">{earliestDate.month}월 {earliestDate.date}일</span>부터 작업 가능합니다.
        </h1>
        
        <CalendarClient initialBlockedDates={blockedDates} earliestStartStr={earliestDate.dateStr} />
      </div>
    </div>
  );
}
