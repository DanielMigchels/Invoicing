export interface UpdateInvoiceLineRequestModel {
  description: string;
  quantity: number;
  unit: string | null;
  unitPrice: number;
  discountAmount: number;
  vatPercentage: number;
  total: number;
}
