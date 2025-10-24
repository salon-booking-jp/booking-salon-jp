'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Booking, CalendarEvent } from '@/lib/types';
import { useAuth } from './useAuth';

export function useBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    try {
      // bookings collection から該当するsalonのデータを取得
      // ※ salonId はユーザーのプロフィール情報から取得する必要があります
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('salonId', '==', user.uid)); // 簡略版

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bookingsData: Booking[] = [];
        const eventsData: CalendarEvent[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const booking: Booking = {
            id: doc.id,
            salonId: data.salonId,
            stylistId: data.stylistId,
            customerId: data.customerId,
            title: data.title,
            startTime: data.startTime instanceof Timestamp ? data.startTime.toDate() : new Date(data.startTime),
            endTime: data.endTime instanceof Timestamp ? data.endTime.toDate() : new Date(data.endTime),
            status: data.status,
            notes: data.notes,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
          };

          bookingsData.push(booking);

          // FullCalendar用イベントに変換
          const event: CalendarEvent = {
            id: booking.id,
            title: booking.title,
            start: booking.startTime,
            end: booking.endTime,
            extendedProps: {
              salonId: booking.salonId,
              stylistId: booking.stylistId,
              customerId: booking.customerId,
              status: booking.status,
              notes: booking.notes,
            },
          };

          eventsData.push(event);
        });

        setBookings(bookingsData);
        setEvents(eventsData);
        setLoading(false);
      }, (err) => {
        console.error('Error fetching bookings:', err);
        setError(err.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading(false);
    }
  }, [user]);

  return { bookings, events, loading, error };
}