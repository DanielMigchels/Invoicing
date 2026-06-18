export interface CreateInvoiceRequestModel {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyId: string;
  customerId: string;
  currency: string;
  vatExemptionReason: string | null;
  paymentReference: string | null;
  notes: string | null;
}
