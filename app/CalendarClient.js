'use client';
import Calendar from '@/components/Calendar';

export default function CalendarClient({ initialBlockedDates }) {
  return <Calendar blockedDates={initialBlockedDates} isAdmin={false} />;
}
