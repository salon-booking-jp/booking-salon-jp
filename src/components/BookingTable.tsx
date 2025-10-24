'use client';

import { BookingWithId } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';

interface BookingTableProps {
  bookings: BookingWithId[];
  onEdit?: (booking: BookingWithId) => void;
  onCancel?: (bookingId: string) => void;
  onAssignStylist?: (bookingId: string) => void;
  loading?: boolean;
}

export function BookingTable({
  bookings,
  onEdit,
  onCancel,
  onAssignStylist,
  loading,
}: BookingTableProps) {
  if (loading) {
    return <div className="p-4 text-center">読み込み中...</div>;
  }

  if (bookings.length === 0) {
    return <div className="p-4 text-center text-gray-500">予約がありません</div>;
  }

  const getStatusBadge = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left">日時</th>
            <th className="px-4 py-2 text-left">顧客名</th>
            <th className="px-4 py-2 text-left">電話番号</th>
            <th className="px-4 py-2 text-left">スタイリスト</th>
            <th className="px-4 py-2 text-left">ステータス</th>
            <th className="px-4 py-2 text-center">アクション</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="text-sm font-semibold">
                  {formatDate(booking.startTime)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="text-sm font-semibold">{booking.customerName}</div>
                <div className="text-xs text-gray-500">{booking.email}</div>
              </td>
              <td className="px-4 py-2 text-sm">{booking.phoneNumber}</td>
              <td className="px-4 py-2 text-sm">
                {booking.stylistId === 'unassigned' ? (
                  <span className="text-gray-400">未割当</span>
                ) : (
                  booking.stylistId
                )}
              </td>
              <td className="px-4 py-2">
                <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-4 py-2 text-center space-x-2">
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onEdit?.(booking)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => onAssignStylist?.(booking.id)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      割当
                    </button>
                  </>
                )}
                <button
                  onClick={() => onCancel?.(booking.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  キャンセル
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}