import { NextRequest, NextResponse } from 'next/server';
import { BookingRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();

    // 日本時間で日付をパース
    const [year, month, day] = body.date.split('-');
    const [hours, minutes] = body.time.split(':');

    // JST (UTC+9) で時刻を作成
    const jstDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );

    // UTC に変換して保存
    const startTimeUTC = new Date(jstDate.getTime());
    const endTimeUTC = new Date(jstDate.getTime() + 60 * 60 * 1000);

    // Firestore REST API を使用して直接 Firestore に保存
    const firestorePayload = {
      fields: {
        salonId: { stringValue: body.salonId },
        customerName: { stringValue: body.customerName },
        phoneNumber: { stringValue: body.phoneNumber },
        email: { stringValue: body.email },
        notes: { stringValue: body.notes || '' },
        startTime: { timestampValue: startTimeUTC.toISOString() },
        endTime: { timestampValue: endTimeUTC.toISOString() },
        status: { stringValue: 'confirmed' },
        title: { stringValue: 'Web予約' },
        stylistId: { stringValue: 'unassigned' },
        customerId: { stringValue: body.email },
        createdAt: { timestampValue: new Date().toISOString() },
        updatedAt: { timestampValue: new Date().toISOString() },
        // タイムゾーン情報を追加
        timezone: { stringValue: 'Asia/Tokyo' },
      },
    };

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    // Firestore REST API で予約を保存
    const firestoreResponse = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/bookings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firestorePayload),
      }
    );

    if (!firestoreResponse.ok) {
      throw new Error('Failed to save booking to Firestore');
    }

    const firestoreResult = await firestoreResponse.json();
    const bookingId = firestoreResult.name?.split('/').pop() || 'unknown';

    // Resend API でメール送信
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'info@salon-booking.jp',
          to: body.email,
          subject: '【予約完了】salon-booking で予約しました',
          html: `
            <h2>ご予約ありがとうございます</h2>
            <p>${body.customerName} 様</p>
            
            <h3>予約内容</h3>
            <ul>
              <li>日時: ${body.date} ${body.time}</li>
              <li>名前: ${body.customerName}</li>
              <li>電話: ${body.phoneNumber}</li>
            </ul>
            
            <p>ご不明な点はお気軽にお問い合わせください。</p>
          `,
        }),
      });

      if (!resendResponse.ok) {
        const error = await resendResponse.json();
        console.error('Failed to send email:', error);
      } else {
        console.log('Email sent successfully from info@salon-booking.jp');
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    return NextResponse.json({
      success: true,
      bookingId,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}