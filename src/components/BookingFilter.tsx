'use client';

import { useState } from 'react';
import { BookingFilter } from '@/lib/types';

interface BookingFilterProps {
  onFilter: (filter: BookingFilter) => void;
}

export function BookingFilterComponent({ onFilter }: BookingFilterProps) {
  const [filter, setFilter] = useState<BookingFilter>({});

  const handleChange = (key: keyof BookingFilter, value: any) => {
    const newFilter = { ...filter, [key]: value };
    setFilter(newFilter);
    onFilter(newFilter);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">予約を検索</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 顧客名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            顧客名
          </label>
          <input
            type="text"
            placeholder="検索..."
            onChange={(e) => handleChange('customerName', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 開始日 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            開始日
          </label>
          <input
            type="date"
            onChange={(e) => handleChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 終了日 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            終了日
          </label>
          <input
            type="date"
            onChange={(e) => handleChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* ステータス */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ステータス
          </label>
          <select
            onChange={(e) => handleChange('status', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">すべて</option>
            <option value="pending">未確認</option>
            <option value="confirmed">確認済み</option>
            <option value="completed">完了</option>
            <option value="cancelled">キャンセル</option>
          </select>
        </div>
      </div>
    </div>
  );
}