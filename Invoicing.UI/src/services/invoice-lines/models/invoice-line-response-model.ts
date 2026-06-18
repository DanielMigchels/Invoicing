export interface InvoiceLineResponseModel {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountAmount: number;
  vatPercentage: number;
  total: number;
}
