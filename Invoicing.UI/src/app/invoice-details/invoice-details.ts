import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { InvoiceService } from '../../services/invoices/invoice.service';
import { InvoiceLineService } from '../../services/invoice-lines/invoice-line.service';
import { CompanyService } from '../../services/companies/company.service';
import { CustomerService } from '../../services/customers/customer.service';
import { InvoiceResponseModel } from '../../services/invoices/models/invoice-response-model';
import { InvoiceLineResponseModel } from '../../services/invoice-lines/models/invoice-line-response-model';
import { CompanyResponseModel } from '../../services/companies/models/company-response-model';
import { CustomerResponseModel } from '../../services/customers/models/customer-response-model';
import { PaginatedList } from '../../services/paginated-list';
import {
  GenericDatagrid,
  GenericDatagridColumns,
  GenericDatagridColumn,
  GenericDatagridRow,
  GenericDatagridCell,
} from '../../components/generic-datagrid/generic-datagrid';
import { CreateInvoiceLine } from './create-invoice-line/create-invoice-line';
import { EditInvoiceLine } from './edit-invoice-line/edit-invoice-line';
import { DeleteInvoiceLine } from './delete-invoice-line/delete-invoice-line';

@Component({
  selector: 'app-invoice-details',
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    DatePipe,
    CurrencyPipe,
    GenericDatagrid,
    GenericDatagridColumns,
    GenericDatagridColumn,
    GenericDatagridRow,
    GenericDatagridCell,
    CreateInvoiceLine,
    EditInvoiceLine,
    DeleteInvoiceLine,
  ],
  templateUrl: './invoice-details.html',
  styleUrl: './invoice-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceDetails implements OnInit {
  @ViewChild(CreateInvoiceLine) createLineDrawer!: CreateInvoiceLine;
  @ViewChild(EditInvoiceLine) editLineDrawer!: EditInvoiceLine;
  @ViewChild(DeleteInvoiceLine) deleteLineDrawer!: DeleteInvoiceLine;

  invoiceId: string | null = null;
  invoice: InvoiceResponseModel | undefined;
  company: CompanyResponseModel | undefined;
  customer: CustomerResponseModel | undefined;
  invoiceLines: PaginatedList<InvoiceLineResponseModel> | undefined;

  currentPage = 1;
  pageSize = 50;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private invoiceLineService: InvoiceLineService,
    private companyService: CompanyService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id');
    if (this.invoiceId) {
      this.loadInvoice();
      this.loadInvoiceLines();
    }
  }

  loadInvoice(): void {
    this.invoiceService.getById(this.invoiceId!).subscribe({
      next: (invoice) => {
        this.invoice = invoice;
        this.cdr.markForCheck();
        this.companyService.getById(invoice.companyId).subscribe({
          next: (c) => { this.company = c; this.cdr.markForCheck(); },
        });
        this.customerService.getById(invoice.customerId).subscribe({
          next: (c) => { this.customer = c; this.cdr.markForCheck(); },
        });
      },
    });
  }

  loadInvoiceLines(): void {
    this.invoiceLineService.getAll(this.invoiceId!, this.currentPage, this.pageSize).subscribe({
      next: (lines) => {
        this.invoiceLines = lines;
        this.cdr.markForCheck();
      },
    });
  }

  onNext(): void {
    this.currentPage++;
    this.loadInvoiceLines();
  }

  onPrevious(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadInvoiceLines();
    }
  }

  addInvoiceLine(event: Event): void {
    this.createLineDrawer.openDrawer(event);
  }

  editInvoiceLine(event: Event, line: InvoiceLineResponseModel): void {
    this.editLineDrawer.openDrawer(event, line);
  }

  deleteInvoiceLine(event: Event, line: InvoiceLineResponseModel): void {
    this.deleteLineDrawer.openDrawer(event, line);
  }

  reloadAfterLineMutation(): void {
    this.loadInvoice();
    this.loadInvoiceLines();
  }

  generatePdf(): void {
    if (!this.invoice) return;

    const inv = this.invoice;
    const comp = this.company;
    const cust = this.customer;
    const lines = this.invoiceLines?.data ?? [];

    const formatCurrency = (amount: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: inv.currency }).format(amount);

    const formatDate = (dateStr: string) =>
      new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const lineRows = lines.map((l) => `
      <tr>
        <td>${l.description}</td>
        <td class="center">${l.quantity}${l.unit ? ' ' + l.unit : ''}</td>
        <td class="right">${formatCurrency(l.unitPrice)}</td>
        <td class="right">${l.discountAmount > 0 ? formatCurrency(l.discountAmount) : '—'}</td>
        <td class="right">${l.vatPercentage}%</td>
        <td class="right"><strong>${formatCurrency(l.total)}</strong></td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${inv.invoiceNumber}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a2e; background: #fff; padding: 48px; }
    .page { max-width: 800px; margin: 0 auto; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .header h1 { font-size: 32px; font-weight: 700; color: #1e3a8a; letter-spacing: -0.5px; }
    .header .invoice-meta { text-align: right; }
    .header .invoice-meta .invoice-num { font-size: 20px; font-weight: 600; color: #1e3a8a; }
    .header .invoice-meta p { margin-top: 4px; color: #555; }

    /* Parties */
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
    .party h3 { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 8px; }
    .party .name { font-size: 15px; font-weight: 600; color: #111; margin-bottom: 4px; }
    .party p { color: #555; line-height: 1.6; }

    /* Details strip */
    .details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; background: #f0f4ff; border-radius: 8px; padding: 16px 20px; margin-bottom: 32px; }
    .detail-item h4 { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 4px; }
    .detail-item p { font-weight: 500; color: #111; }

    /* Lines table */
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead tr { background: #1e3a8a; color: #fff; }
    thead th { padding: 10px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; text-align: left; }
    thead th.right { text-align: right; }
    thead th.center { text-align: center; }
    tbody tr { border-bottom: 1px solid #e5e7eb; }
    tbody tr:last-child { border-bottom: none; }
    tbody td { padding: 10px 12px; vertical-align: top; color: #374151; }
    tbody td.right { text-align: right; }
    tbody td.center { text-align: center; }
    tbody tr:nth-child(even) { background: #f9fafb; }

    /* Totals */
    .totals { display: flex; justify-content: flex-end; margin-bottom: 32px; }
    .totals-table { width: 280px; }
    .totals-table tr td { padding: 6px 0; color: #374151; }
    .totals-table tr td:last-child { text-align: right; font-weight: 500; }
    .totals-table .total-row td { font-size: 16px; font-weight: 700; color: #1e3a8a; border-top: 2px solid #1e3a8a; padding-top: 10px; }
    .totals-table .vat-exempt td { font-size: 11px; color: #6b7280; padding-top: 8px; }

    /* Notes & footer */
    .notes { background: #f9fafb; border-left: 3px solid #1e3a8a; padding: 12px 16px; border-radius: 4px; margin-bottom: 32px; }
    .notes h4 { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 6px; }
    .notes p { color: #374151; line-height: 1.6; white-space: pre-wrap; }
    .footer { border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center; font-size: 11px; color: #9ca3af; }

    @media print {
      body { padding: 0; }
      .page { padding: 24px; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        ${comp ? `<h1>${comp.name}</h1>
        <p>${comp.street} ${comp.houseNumber}, ${comp.postalCode} ${comp.city}</p>
        <p>${comp.country}</p>
        ${comp.email ? `<p>${comp.email}</p>` : ''}
        ${comp.phoneNumber ? `<p>${comp.phoneNumber}</p>` : ''}
        ${comp.vatNumber ? `<p>VAT: ${comp.vatNumber}</p>` : ''}
        ${comp.chamberOfCommerceNumber ? `<p>CoC: ${comp.chamberOfCommerceNumber}</p>` : ''}` : `<h1>Invoice</h1>`}
      </div>
      <div class="invoice-meta">
        <div class="invoice-num">${inv.invoiceNumber}</div>
        <p>Invoice Date: ${formatDate(inv.invoiceDate)}</p>
        <p>Due Date: ${formatDate(inv.dueDate)}</p>
        ${inv.paymentReference ? `<p>Reference: ${inv.paymentReference}</p>` : ''}
      </div>
    </div>

    <div class="parties">
      <div class="party">
        <h3>From</h3>
        ${comp ? `<div class="name">${comp.name}</div>
        <p>${comp.street} ${comp.houseNumber}<br/>${comp.postalCode} ${comp.city}<br/>${comp.country}</p>` : `<div class="name">${inv.companyName}</div>`}
      </div>
      <div class="party">
        <h3>Bill To</h3>
        ${cust ? `<div class="name">${cust.name}</div>
        <p>${cust.street} ${cust.houseNumber}<br/>${cust.postalCode} ${cust.city}<br/>${cust.country}</p>
        ${cust.contactPerson ? `<p>${cust.contactPerson}</p>` : ''}
        ${cust.email ? `<p>${cust.email}</p>` : ''}
        ${cust.vatNumber ? `<p>VAT: ${cust.vatNumber}</p>` : ''}` : `<div class="name">${inv.customerName}</div>`}
      </div>
    </div>

    <div class="details">
      <div class="detail-item">
        <h4>Invoice Date</h4>
        <p>${formatDate(inv.invoiceDate)}</p>
      </div>
      <div class="detail-item">
        <h4>Due Date</h4>
        <p>${formatDate(inv.dueDate)}</p>
      </div>
      <div class="detail-item">
        <h4>Currency</h4>
        <p>${inv.currency}</p>
      </div>
      ${inv.paymentReference ? `<div class="detail-item"><h4>Payment Reference</h4><p>${inv.paymentReference}</p></div>` : ''}
      ${comp?.bankAccountNumber ? `<div class="detail-item"><h4>Bank Account</h4><p>${comp.bankAccountNumber}</p></div>` : ''}
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="center">Qty / Unit</th>
          <th class="right">Unit Price</th>
          <th class="right">Discount</th>
          <th class="right">VAT</th>
          <th class="right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${lineRows || '<tr><td colspan="6" style="text-align:center;color:#9ca3af;padding:24px;">No invoice lines.</td></tr>'}
      </tbody>
    </table>

    <div class="totals">
      <table class="totals-table">
        <tr>
          <td>Subtotal (excl. VAT)</td>
          <td>${formatCurrency(inv.totalExcludingVat)}</td>
        </tr>
        <tr>
          <td>VAT</td>
          <td>${formatCurrency(inv.vatAmount)}</td>
        </tr>
        <tr class="total-row">
          <td>Total Due</td>
          <td>${formatCurrency(inv.totalIncludingVat)}</td>
        </tr>
        ${inv.vatExemptionReason ? `<tr class="vat-exempt"><td colspan="2">VAT exemption: ${inv.vatExemptionReason}</td></tr>` : ''}
      </table>
    </div>

    ${inv.notes ? `<div class="notes"><h4>Notes</h4><p>${inv.notes}</p></div>` : ''}

    ${comp?.bankAccountNumber ? `<div class="notes"><h4>Payment Details</h4><p>Please transfer the amount to <strong>${comp.bankAccountNumber}</strong>${inv.paymentReference ? ` with reference <strong>${inv.paymentReference}</strong>` : ''}.</p></div>` : ''}

    <div class="footer">
      ${comp?.name ?? ''} &bull; ${comp ? `${comp.street} ${comp.houseNumber}, ${comp.postalCode} ${comp.city}, ${comp.country}` : ''} ${comp?.email ? `&bull; ${comp.email}` : ''}
    </div>
  </div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 300);
  }
}

