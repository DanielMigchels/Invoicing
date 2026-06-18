export interface CreateInvoiceRequestModel {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyId: string;
  customerId: string;
  currency: string;
  totalExcludingVat: number;
  vatAmount: number;
  totalIncludingVat: number;
  vatExemptionReason: string | null;
  paymentReference: string | null;
  notes: string | null;
}
