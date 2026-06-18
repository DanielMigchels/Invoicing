import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { InvoiceService } from '../../../services/invoices/invoice.service';
import { InvoiceResponseModel } from '../../../services/invoices/models/invoice-response-model';
import { GenericOffCanvasDrawer } from '../../../components/generic-off-canvas-drawer/generic-off-canvas-drawer';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-delete-invoice',
  imports: [FormsModule, NgIf, GenericOffCanvasDrawer, Loader],
  templateUrl: './delete-invoice.html',
  styleUrl: './delete-invoice.css',
})
export class DeleteInvoice {
  @ViewChild(GenericOffCanvasDrawer) drawer!: GenericOffCanvasDrawer;
  @Output() drawerClosed = new EventEmitter();
  @Input() invoice: InvoiceResponseModel | undefined;

  isChecked = false;
  isSubmitting = false;

  constructor(private invoiceService: InvoiceService) { }

  openDrawer(invoice: InvoiceResponseModel) {
    this.invoice = invoice;
    this.isChecked = false;
  }

  deleteInvoice() {
    if (!this.invoice || !this.isChecked) return;
    this.isSubmitting = true;
    this.invoiceService.delete(this.invoice.id).subscribe({
      next: () => {
        this.drawerClosed.emit();
        this.drawer.closeDrawer();
        this.isSubmitting = false;
        this.isChecked = false;
      },
      error: () => { this.isSubmitting = false; }
    });
  }
}
