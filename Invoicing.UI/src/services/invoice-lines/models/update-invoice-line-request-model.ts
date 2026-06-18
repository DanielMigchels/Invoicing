export interface UpdateInvoiceLineRequestModel {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountAmount: number;
  vatPercentage: number;
  total: number;
}
