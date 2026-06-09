export interface Invoice {
  id: number;
  bookingId: number;
  serviceCharge: number;
  partsCharge: number;
  tax: number;
  totalAmount: number;
  invoiceDate: string;
}