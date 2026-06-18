import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { InvoiceService } from '../../services/invoices/invoice.service';
import { InvoiceResponseModel } from '../../services/invoices/models/invoice-response-model';
import { PaginatedList } from '../../services/paginated-list';
import {
  GenericDatagrid,
  GenericDatagridColumns,
  GenericDatagridColumn,
  GenericDatagridRow,
  GenericDatagridCell,
} from '../../components/generic-datagrid/generic-datagrid';
import { CreateInvoice } from './create-invoice/create-invoice';
import { EditInvoice } from './edit-invoice/edit-invoice';
import { DeleteInvoice } from './delete-invoice/delete-invoice';

@Component({
  selector: 'app-invoices',
  imports: [
    NgFor,
    RouterLink,
    DatePipe,
    CurrencyPipe,
    GenericDatagrid, GenericDatagridColumns, GenericDatagridColumn, GenericDatagridRow, GenericDatagridCell,
    CreateInvoice, EditInvoice, DeleteInvoice,
  ],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Invoices implements OnInit {

  selectedInvoice: InvoiceResponseModel | undefined;

  @ViewChild(CreateInvoice) createInvoiceDrawer!: CreateInvoice;
  @ViewChild(EditInvoice) editInvoiceDrawer!: EditInvoice;
  @ViewChild(DeleteInvoice) deleteInvoiceDrawer!: DeleteInvoice;

  invoices: PaginatedList<InvoiceResponseModel> | undefined;
  currentPage = 1;
  pageSize = 12;

  constructor(
    private invoiceService: InvoiceService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (x) => {
        this.invoices = x;
        this.cdr.markForCheck();
      }
    });
  }

  onNext(): void {
    if (this.invoices?.hasNext) {
      this.currentPage++;
      this.loadInvoices();
    }
  }

  onPrevious(): void {
    if (this.invoices?.hasPrevious) {
      this.currentPage--;
      this.loadInvoices();
    }
  }

  addInvoice(event: Event) {
    event.stopPropagation();
    this.createInvoiceDrawer.openDrawer(event);
  }

  editInvoice(event: Event, invoice: InvoiceResponseModel) {
    event.stopPropagation();
    this.selectedInvoice = invoice;
    this.editInvoiceDrawer.openDrawer(invoice);
    this.editInvoiceDrawer.drawer.openDrawer(event);
  }

  deleteInvoice(event: Event, invoice: InvoiceResponseModel) {
    event.stopPropagation();
    this.selectedInvoice = invoice;
    this.deleteInvoiceDrawer.openDrawer(invoice);
    this.deleteInvoiceDrawer.drawer.openDrawer(event);
  }

}
