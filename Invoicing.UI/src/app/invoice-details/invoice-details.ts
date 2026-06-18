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
    this.invoiceService.downloadPdf(this.invoiceId!).subscribe({
      next: blob => {
        // ??
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Invoice_'+this.invoice?.invoiceNumber+'.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: () => {}
    
    });
  }
}

