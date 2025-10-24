// Firestore データモデル

export interface Salon {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  userId: string;
  createdAt: Date;
}

export interface Stylist {
  id: string;
  salonId: string;
  name: string;
  specialties: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface Booking {
  id: string;
  salonId: string;
  stylistId: string;
  customerId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  salonId: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  createdAt: Date;
}

// FullCalendar用に変換したイベント型

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    salonId: string;
    stylistId: string;
    customerId: string;
    status: string;
    notes: string;
  };
}

// 既存のコードに加えて以下を追加

export interface BookingFormData {
  customerName: string;
  phoneNumber: string;
  email: string;
  notes?: string;
}

export interface BookingRequest extends BookingFormData {
  salonId: string;
  date: string;
  time: string;
}

export interface Stylist {
  id: string;
  name: string;
  specialties: string[];
  availability: {
    [key: string]: boolean; // 曜日ごとの出勤
  };
}

export interface BookingWithId extends Booking {
  id: string;
}

export interface BookingFilter {
  startDate?: Date;
  endDate?: Date;
  customerName?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  stylistId?: string;
}