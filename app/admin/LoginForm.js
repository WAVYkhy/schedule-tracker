'use client';
import { useState } from 'react';
import { login } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(password);
    if (res.success) {
      router.refresh();
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="app-container">
      <div className="sharp-card" style={{ maxWidth: '400px', margin: '10vh auto' }}>
        <h1 className="title" style={{ fontSize: '24px', marginBottom: '0.5rem' }}>관리자 로그인</h1>
        <p className="subtitle" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>일정 관리를 위해 로그인해 주세요.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label className="input-label" htmlFor="password">비밀번호</label>
            <input 
              id="password"
              type="password" 
              className="input-sharp" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
            />
          </div>
          <button type="submit" className="btn-sharp-primary" style={{ width: '100%' }}>로그인</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}
