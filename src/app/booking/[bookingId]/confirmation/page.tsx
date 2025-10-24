'use client';

import { useEffect, useState, use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Booking } from '@/lib/types';

export default function ConfirmationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const docRef = doc(db, 'bookings', bookingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBooking({
            id: docSnap.id,
            ...data,
          } as Booking);
        } else {
          setError('予約が見つかりません');
        }
      } catch (err) {
        setError('予約情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'エラーが発生しました'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-600">予約完了</h1>
        </div>

        <div className="space-y-4">
          <p className="text-center text-gray-600 mb-8">
            ご予約ありがとうございます。確認メールを送信いたしました。
          </p>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              予約内容
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">お名前</span>
                <span className="font-semibold">{booking.customerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">日時</span>
                <span className="font-semibold">
                  {booking.startTime.toLocaleString('ja-JP')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ステータス</span>
                <span className="font-semibold text-green-600">確定</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => (window.location.href = '/')}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          トップページに戻る
        </button>
      </div>
    </div>
  );
}