import './globals.css';
import { LanguageProvider } from '@/lib/i18n';

export const metadata = {
  title: '작업 일정 확인',
  description: '가장 빠른 작업 시작 가능일을 확인하세요.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
