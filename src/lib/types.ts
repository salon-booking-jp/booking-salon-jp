export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  staffName: string;
  serviceType: string;
  startTime: Date;
  endTime: Date;
  price: number;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface SalonInfo {
  ownerId: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}