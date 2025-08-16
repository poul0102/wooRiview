'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Button from '@/components/Button';

export default function LogoutButton({ className = '' }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 서버 쿠키 삭제 API 호출
      await fetch('/api/auth/logout', { method: 'POST' });

      // 클라이언트 전역 상태/스토리지 초기화
      logout();

      // 로그인 페이지로 이동
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className={`!w-auto px-4 py-2 ${className}`}
      aria-label="로그아웃"
    >
      로그아웃
    </Button>
  );
}
