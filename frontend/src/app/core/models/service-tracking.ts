export interface ServiceTracking {
  id: string;
  bookingId: string;
  userId: string;
  vehicleId: string;
  currentStage: string;
  technicianId: string;
  estimatedDelivery: string;
  daysRemaining: number;
  workshopName: string;
}