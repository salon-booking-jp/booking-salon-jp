'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BookingWithId, BookingFilter } from '@/lib/types';

export function useBookingManagement(salonId?: string) {
  const [bookings, setBookings] = useState<BookingWithId[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 予約を取得
  useEffect(() => {
    console.log('useBookingManagement - salonId:', salonId);

    if (!salonId) {
      console.log('salonId is not set, skipping query');
      setLoading(false);
      return;
    }

    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('salonId', '==', salonId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('Bookings fetched, count:', snapshot.docs.length);
        
        const data: BookingWithId[] = [];
        snapshot.forEach((docSnapshot) => {
          const docData = docSnapshot.data();
          data.push({
            id: docSnapshot.id,
            salonId: docData.salonId,
            stylistId: docData.stylistId,
            customerId: docData.customerId,
            title: docData.title,
            startTime: docData.startTime instanceof Timestamp ? docData.startTime.toDate() : new Date(docData.startTime),
            endTime: docData.endTime instanceof Timestamp ? docData.endTime.toDate() : new Date(docData.endTime),
            status: docData.status,
            notes: docData.notes,
            createdAt: docData.createdAt instanceof Timestamp ? docData.createdAt.toDate() : new Date(docData.createdAt),
            updatedAt: docData.updatedAt instanceof Timestamp ? docData.updatedAt.toDate() : new Date(docData.updatedAt),
            customerName: docData.customerName,
            phoneNumber: docData.phoneNumber,
            email: docData.email,
          } as BookingWithId);
        });

        console.log('Bookings data:', data);
        setBookings(data.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()));
        setLoading(false);
      }, (err) => {
        console.error('Error fetching bookings:', err);
        setError(err.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error in useBookingManagement:', errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
  }, [salonId]);

  // 予約をフィルター
  const filterBookings = (filter: BookingFilter) => {
    let filtered = bookings;

    if (filter.startDate) {
      // 開始日の 00:00:00 以降を対象
      const startOfDay = new Date(filter.startDate);
      startOfDay.setHours(0, 0, 0, 0);
      console.log('Start of day filter:', startOfDay);
      filtered = filtered.filter(b => {
        console.log('Checking booking start time:', b.startTime, 'against', startOfDay);
        return b.startTime >= startOfDay;
      });
    }

    if (filter.endDate) {
      // 終了日の 23:59:59 以前を対象
      const endOfDay = new Date(filter.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      console.log('End of day filter:', endOfDay);
      filtered = filtered.filter(b => {
        console.log('Checking booking end time:', b.startTime, 'against', endOfDay);
        return b.startTime <= endOfDay;
      });
    }

    if (filter.customerName) {
      filtered = filtered.filter(b =>
        b.customerName.toLowerCase().includes(filter.customerName!.toLowerCase())
      );
    }

    if (filter.status) {
      filtered = filtered.filter(b => b.status === filter.status);
    }

    if (filter.stylistId) {
      filtered = filtered.filter(b => b.stylistId === filter.stylistId);
    }

    console.log('Filter applied:', filter);
    console.log('Filtered bookings:', filtered);
    setFilteredBookings(filtered);
  };

  // 予約を更新
  const updateBooking = async (bookingId: string, updates: Partial<BookingWithId>) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error('Error updating booking:', err);
      throw err;
    }
  };

  // 予約をキャンセル
  const cancelBooking = async (bookingId: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error('Error cancelling booking:', err);
      throw err;
    }
  };

  // 予約を削除
  const deleteBooking = async (bookingId: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await deleteDoc(bookingRef);
    } catch (err) {
      console.error('Error deleting booking:', err);
      throw err;
    }
  };

  // スタイリストを割り当て
  const assignStylist = async (bookingId: string, stylistId: string, stylistName: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        stylistId,
        title: `${stylistName} - ${bookings.find(b => b.id === bookingId)?.title}`,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      console.error('Error assigning stylist:', err);
      throw err;
    }
  };

  return {
    bookings,
    filteredBookings,
    loading,
    error,
    filterBookings,
    updateBooking,
    cancelBooking,
    deleteBooking,
    assignStylist,
  };
}