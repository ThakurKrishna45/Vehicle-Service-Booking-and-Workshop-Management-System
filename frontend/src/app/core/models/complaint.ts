export interface Complaint {
  id: number;
  bookingId: number;
  customerId: number;
  subject: string;
  description: string;
  status: string;
}