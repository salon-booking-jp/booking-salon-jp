'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookingFormData } from '@/lib/types';

const bookingSchema = z.object({
  customerName: z.string().min(2, '名前は2文字以上で入力してください'),
  phoneNumber: z
    .string()
    .regex(/^\d{2,4}-?\d{3,4}-?\d{4}$/, '有効な電話番号を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  notes: z.string().optional(),
});

interface BookingFormProps {
  salonId: string;
  date: string;
  time: string;
  onSuccess?: (bookingId: string) => void;
  onError?: (error: Error) => void;
}

export function BookingForm({
  salonId,
  date,
  time,
  onSuccess,
  onError,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (formData: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          salonId,
          date,
          time,
        }),
      });

      if (!response.ok) {
        throw new Error('予約の保存に失敗しました');
      }

      const result = await response.json();
      onSuccess?.(result.bookingId);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('エラーが発生しました');
      onError?.(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 日時表示 */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-600">予約日時</p>
        <p className="text-lg font-semibold text-gray-900">
          {date} {time}
        </p>
      </div>

      {/* 名前フィールド */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          お名前 *
        </label>
        <input
          type="text"
          placeholder="山田太郎"
          {...register('customerName')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.customerName && (
          <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
        )}
      </div>

      {/* 電話番号フィールド */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          電話番号 *
        </label>
        <input
          type="tel"
          placeholder="090-1234-5678"
          {...register('phoneNumber')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* メールアドレスフィールド */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          メールアドレス *
        </label>
        <input
          type="email"
          placeholder="example@gmail.com"
          {...register('email')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* 備考フィールド */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ご要望（オプション）
        </label>
        <textarea
          placeholder="例：前回と同じようにお願いします"
          {...register('notes')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {isSubmitting ? '予約中...' : '予約確定'}
      </button>
    </form>
  );
}