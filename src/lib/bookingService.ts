import { adminDb } from './firebase-admin';
import { BookingRequest } from './types';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

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

    const bookingsRef = adminDb.collection('bookings');
    const docRef = await bookingsRef.add(booking);

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
```

### ステップ4: `.env.local` に環境変数を追加

Firebase Console → Project Settings から以下を取得：
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDqp7m72rYq40Et0XVFXnscug-40tWl9Os
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Firebase Admin SDK 用
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000