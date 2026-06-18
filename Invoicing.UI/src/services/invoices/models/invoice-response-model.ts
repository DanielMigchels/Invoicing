export interface InvoiceResponseModel {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyId: string;
  companyName: string;
  customerId: string;
  customerName: string;
  currency: string;
  totalExcludingVat: number;
  vatAmount: number;
  totalIncludingVat: number;
  vatExemptionReason: string | null;
  paymentReference: string | null;
  notes: string | null;
}
