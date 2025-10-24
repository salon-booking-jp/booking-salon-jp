'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, use } from 'react';
import { BookingForm } from '@/components/BookingForm';

export default function BookingPage({
  params,
}: {
  params: Promise<{ salonId: string }>;
}) {
  const { salonId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!date || !time) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">エラー</h1>
          <p className="text-gray-600">
            無効なリンクです。正しいリンクからアクセスしてください。
          </p>
        </div>
      </div>
    );
  }

  const handleSuccess = (bookingId: string) => {
    setBookingConfirmed(true);
    setTimeout(() => {
      router.push(`/booking/${bookingId}/confirmation`);
    }, 2000);
  };

  const handleError = (err: Error) => {
    setError(err.message);
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            予約が完了しました
          </h1>
          <p className="text-gray-600">確認ページにリダイレクト中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">予約フォーム</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <BookingForm
          salonId={salonId}
          date={date}
          time={time}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
}