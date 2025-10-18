'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getBookings, cancelBooking } from '@/lib/bookings';
import { Booking } from '@/lib/types';
import Link from 'next/link';

export default function BookingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadBookings();
    }
  }, [user, loading]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await getBookings(user!.uid);
      setBookings(data);
    } catch (err) {
      setError('予約の読み込みに失敗しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('この予約をキャンセルしてもよろしいですか？')) return;

    try {
      await cancelBooking(user!.uid, bookingId);
      setBookings(bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
    } catch (err) {
      setError('キャンセルに失敗しました');
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">読み込み中...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">salon-booking</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ダッシュボード
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">予約一覧</h2>
          <Link
            href="/dashboard/bookings/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            新規予約
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div>読み込み中...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            予約がありません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">顧客名</th>
                  <th className="px-6 py-3 text-left">電話番号</th>
                  <th className="px-6 py-3 text-left">メニュー</th>
                  <th className="px-6 py-3 text-left">日時</th>
                  <th className="px-6 py-3 text-left">ステータス</th>
                  <th className="px-6 py-3 text-left">アクション</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{booking.customerName}</td>
                    <td className="px-6 py-4">{booking.customerPhone}</td>
                    <td className="px-6 py-4">{booking.serviceType}</td>
                    <td className="px-6 py-4">
                      {new Date(booking.startTime).toLocaleString('ja-JP')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          booking.status === 'cancelled'
                            ? 'bg-gray-200 text-gray-700'
                            : booking.status === 'confirmed'
                            ? 'bg-green-200 text-green-700'
                            : 'bg-yellow-200 text-yellow-700'
                        }`}
                      >
                        {booking.status === 'cancelled'
                          ? 'キャンセル済み'
                          : booking.status === 'confirmed'
                          ? '確定'
                          : '保留中'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="text-red-600 hover:underline"
                        >
                          キャンセル
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}