'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>;
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">salon-booking</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            ログアウト
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">ようこそ！</h2>
          <p className="text-gray-600 mb-2">
            ログイン中：<span className="font-semibold">{user.email}</span>
          </p>
          <p className="text-gray-600">
            このページは後で予約管理画面になります。
          </p>
        </div>
      </div>
    </div>
  );
}