import { checkLogin, getBlockedDates } from '@/app/actions';
import AdminDashboard from './AdminDashboard';
import LoginForm from './LoginForm';

export default async function AdminPage() {
  const isLoggedIn = await checkLogin();
  
  if (isLoggedIn) {
    const blockedDates = await getBlockedDates();
    return <AdminDashboard initialBlockedDates={blockedDates} />;
  }

  return <LoginForm />;
}
