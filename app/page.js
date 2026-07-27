import { getBlockedDates } from '@/app/actions';
import CalendarClient from './CalendarClient';
import { LanguageProvider } from '@/lib/i18n';

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
    <main className="app-container">
      <LanguageProvider>
        <CalendarClient
          initialBlockedDates={blockedDates}
          earliestStartStr={earliestDate.dateStr}
          earliestDateObj={earliestDate}
        />
      </LanguageProvider>
    </main>
  );
}
