'use server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token === ADMIN_PASSWORD;
}

export async function login(password) {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', password, { httpOnly: true, path: '/' });
    return { success: true };
  }
  return { success: false, error: '비밀번호가 일치하지 않습니다.' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
}

export async function checkLogin() {
  return await checkAuth();
}

export async function getBlockedDates() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('blocked_dates').select('date');
  if (error) {
    console.error('Error fetching blocked dates:', error);
    return [];
  }
  return data.map(d => d.date);
}

export async function toggleBlockedDate(dateStr) {
  const isAuth = await checkAuth();
  if (!isAuth) throw new Error('Unauthorized');
  
  if (!supabase) throw new Error('Supabase not configured');

  const { data } = await supabase.from('blocked_dates').select('date').eq('date', dateStr).single();
  
  if (data) {
    await supabase.from('blocked_dates').delete().eq('date', dateStr);
  } else {
    await supabase.from('blocked_dates').insert([{ date: dateStr }]);
  }
  
  return await getBlockedDates();
}
