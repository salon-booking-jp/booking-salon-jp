import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Booking } from './types';

// 予約を作成
export async function createBooking(
  salonId: string,
  booking: Omit<Booking, 'id' | 'createdAt'>
) {
  try {
    const docRef = await addDoc(
      collection(db, 'salons', salonId, 'bookings'),
      {
        ...booking,
        startTime: Timestamp.fromDate(booking.startTime),
        endTime: Timestamp.fromDate(booking.endTime),
        createdAt: Timestamp.now(),
      }
    );
    return docRef.id;
  } catch (error) {
    throw error;
  }
}

// 予約一覧を取得
export async function getBookings(salonId: string) {
  try {
    const bookingsRef = collection(db, 'salons', salonId, 'bookings');
    const q = query(bookingsRef, orderBy('startTime', 'asc'));
    const snapshot = await getDocs(q);

    const bookings: Booking[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime.toDate(),
      endTime: doc.data().endTime.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    } as Booking));

    return bookings;
  } catch (error) {
    throw error;
  }
}

// 予約を更新
export async function updateBooking(
  salonId: string,
  bookingId: string,
  updates: Partial<Omit<Booking, 'id' | 'createdAt'>>
) {
  try {
    const bookingRef = doc(db, 'salons', salonId, 'bookings', bookingId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...updates };

    if (updates.startTime) {
      updateData.startTime = Timestamp.fromDate(updates.startTime);
    }
    if (updates.endTime) {
      updateData.endTime = Timestamp.fromDate(updates.endTime);
    }

    await updateDoc(bookingRef, updateData);
  } catch (error) {
    throw error;
  }
}

// 予約をキャンセル
export async function cancelBooking(salonId: string, bookingId: string) {
  try {
    await updateBooking(salonId, bookingId, { status: 'cancelled' });
  } catch (error) {
    throw error;
  }
}

// 予約を削除
export async function deleteBooking(salonId: string, bookingId: string) {
  try {
    const bookingRef = doc(db, 'salons', salonId, 'bookings', bookingId);
    await deleteDoc(bookingRef);
  } catch (error) {
    throw error;
  }
}

// 特定日の予約を取得
export async function getBookingsByDate(salonId: string, date: Date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookingsRef = collection(db, 'salons', salonId, 'bookings');
    const q = query(
      bookingsRef,
      where('startTime', '>=', Timestamp.fromDate(startOfDay)),
      where('startTime', '<=', Timestamp.fromDate(endOfDay)),
      where('status', '!=', 'cancelled'),
      orderBy('startTime', 'asc')
    );

    const snapshot = await getDocs(q);
    const bookings: Booking[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime.toDate(),
      endTime: doc.data().endTime.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    } as Booking));

    return bookings;
  } catch (error) {
    throw error;
  }
}