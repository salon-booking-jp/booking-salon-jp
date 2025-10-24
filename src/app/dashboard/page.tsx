'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-4">ログインしてください</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ダッシュボード</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 予約管理 */}
          <Link href="/dashboard/bookings">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
              <h2 className="text-2xl font-bold text-blue-600 mb-2">📅 予約管理</h2>
              <p className="text-gray-600">予約の確認、編集、キャンセル</p>
            </div>
          </Link>

          {/* カレンダー */}
          <Link href="/dashboard">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer">
              <h2 className="text-2xl font-bold text-green-600 mb-2">📊 カレンダー</h2>
              <p className="text-gray-600">予約スケジュール確認</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}