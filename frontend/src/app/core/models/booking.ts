export interface Booking {
  id: number;
  userId: number;
  vehicleId: number;
  serviceId: number;
  bookingDate: string;
  slot: string;
  issueDescription: string;
  status: string;
}