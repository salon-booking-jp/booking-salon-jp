import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmationEmail(
  customerEmail: string,
  customerName: string,
  bookingDate: string,
  bookingTime: string,
  salonId: string,
  bookingId: string
) {
  try {
    const cancelLink = `${process.env.NEXT_PUBLIC_BASE_URL}/booking/${bookingId}/cancel`;

    const result = await resend.emails.send({
      from: 'noreply@booking-salon-jp.vercel.app',
      to: customerEmail,
      subject: '【予約完了】salon-booking で予約しました',
      html: `
        <h2>ご予約ありがとうございます</h2>
        <p>${customerName} 様</p>
        
        <h3>予約内容</h3>
        <ul>
          <li>日時: ${bookingDate} ${bookingTime}</li>
          <li>名前: ${customerName}</li>
        </ul>
        
        <h3>キャンセル・変更</h3>
        <p><a href="${cancelLink}">こちらからキャンセルできます</a></p>
        
        <p>ご不明な点はお気軽にお問い合わせください。</p>
      `,
    });

    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}