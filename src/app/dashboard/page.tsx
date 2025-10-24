'use client';

import { useState } from 'react';
import { BookingCalendar } from '@/components/BookingCalendar';
import { CalendarEvent } from '@/lib/types';

export default function DashboardPage() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleDateClick = (date: Date) => {
    console.log('Selected date:', date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-600 mt-2">予約カレンダー</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BookingCalendar
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
            />
          </div>

          <div className="space-y-6">
            {selectedEvent && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">予約詳細</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">サービス</label>
                    <p className="font-semibold">{selectedEvent.title}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">開始時刻</label>
                    <p className="font-semibold">
                      {selectedEvent.start.toLocaleString('ja-JP')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">終了時刻</label>
                    <p className="font-semibold">
                      {selectedEvent.end.toLocaleString('ja-JP')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">ステータス</label>
                    <span className="inline-block px-3 py-1 rounded text-sm font-semibold bg-green-100 text-green-800">
                      {selectedEvent.extendedProps.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  閉じる
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}