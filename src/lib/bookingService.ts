import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { BookingRequest } from './types';

export async function saveBooking(bookingData: BookingRequest) {
  try {
    const [year, month, day] = bookingData.date.split('-');
    const [hours, minutes] = bookingData.time.split(':');

    const startTime = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );

    // 施術時間を 60 分と仮定
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const booking = {
      salonId: bookingData.salonId,
      customerName: bookingData.customerName,
      phoneNumber: bookingData.phoneNumber,
      email: bookingData.email,
      notes: bookingData.notes || '',
      startTime: Timestamp.fromDate(startTime),
      endTime: Timestamp.fromDate(endTime),
      status: 'confirmed',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      stylistId: 'unassigned',
      customerId: bookingData.email,
      title: 'Web予約',
    };

    const bookingsRef = collection(db, 'bookings');
    const docRef = await addDoc(bookingsRef, booking);

    return {
      success: true,
      bookingId: docRef.id,
      booking,
    };
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
}