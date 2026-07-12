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
    throw new Error(`DB 조회 실패: ${error.message}`);
  }
  return data.map(d => d.date);
}

export async function toggleBlockedDate(dateStr) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) return { success: false, error: '인증되지 않은 사용자입니다.' };
    
    if (!supabase) return { success: false, error: 'Supabase 설정이 되지 않았습니다.' };

    // Check if date exists
    const { data, error: selectError } = await supabase
      .from('blocked_dates')
      .select('date')
      .eq('date', dateStr);
    
    if (selectError) {
      return { success: false, error: `DB 조회 오류: ${selectError.message}` };
    }

    const exists = data && data.length > 0;
    
    if (exists) {
      const { error: deleteError } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('date', dateStr);
      if (deleteError) {
        return { success: false, error: `마감 해제 실패: ${deleteError.message}` };
      }
    } else {
      const { error: insertError } = await supabase
        .from('blocked_dates')
        .insert([{ date: dateStr }]);
      if (insertError) {
        return { success: false, error: `마감 등록 실패: ${insertError.message}` };
      }
    }
    
    const { data: updatedData, error: fetchError } = await supabase.from('blocked_dates').select('date');
    if (fetchError) {
      return { success: false, error: `업데이트된 일정 조회 실패: ${fetchError.message}` };
    }
    return { success: true, data: updatedData.map(d => d.date) };
  } catch (err) {
    return { success: false, error: `서버 오류가 발생했습니다: ${err.message}` };
  }
}


