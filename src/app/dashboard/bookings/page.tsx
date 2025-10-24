'use client';

import { useState } from 'react';
import { useBookingManagement } from '@/hooks/useBookingManagement';
import { BookingTable } from '@/components/BookingTable';
import { BookingFilterComponent } from '@/components/BookingFilter';
import { BookingFilter, BookingWithId } from '@/lib/types';

export default function BookingsPage() {
  const salonId = 'salon-123';

  const {
    bookings,
    filteredBookings,
    loading,
    error,
    filterBookings,
    cancelBooking,
    assignStylist,
  } = useBookingManagement(salonId);

  const [editingBooking, setEditingBooking] = useState<BookingWithId | null>(null);
  const [assigningBookingId, setAssigningBookingId] = useState<string | null>(null);
  const [stylistName, setStylistName] = useState('');
  const [hasFilter, setHasFilter] = useState(false);  // ← フィルター状態を追跡

  const handleFilter = (filter: BookingFilter) => {
    filterBookings(filter);
    // フィルターが1つ以上設定されているか確認
    const hasAnyFilter = Object.values(filter).some(v => v !== undefined && v !== null && v !== '');
    setHasFilter(hasAnyFilter);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm('本当にキャンセルしますか？')) {
      try {
        await cancelBooking(bookingId);
        alert('予約をキャンセルしました');
      } catch (err) {
        alert('キャンセルに失敗しました');
      }
    }
  };

  const handleAssignStylist = async () => {
    if (!assigningBookingId || !stylistName) return;

    try {
      await assignStylist(assigningBookingId, stylistName, stylistName);
      alert('スタイリストを割り当てました');
      setAssigningBookingId(null);
      setStylistName('');
    } catch (err) {
      alert('割り当てに失敗しました');
    }
  };

  // フィルターが適用されている場合は filteredBookings、そうでなければ bookings を表示
  const displayBookings = hasFilter ? filteredBookings : bookings;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">予約管理</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <BookingFilterComponent onFilter={handleFilter} />

        {assigningBookingId && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold mb-2">スタイリストを割り当て</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="スタイリスト名"
                value={stylistName}
                onChange={(e) => setStylistName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleAssignStylist}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                割り当て
              </button>
              <button
                onClick={() => setAssigningBookingId(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <BookingTable
            bookings={displayBookings}
            loading={loading}
            onCancel={handleCancelBooking}
            onAssignStylist={setAssigningBookingId}
          />
        </div>

        <div className="mt-4 text-sm text-gray-600">
          合計 {displayBookings.length} 件の予約
        </div>
      </div>
    </div>
  );
}