export interface Vehicle {
  id: number | string;   // json-server returns string IDs ("1", "2", ...)
  userId: number;
  vehicleNumber: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  odometer: number;
}