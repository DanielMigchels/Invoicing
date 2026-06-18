import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { InvoiceLineService } from '../../../services/invoice-lines/invoice-line.service';
import { InvoiceLineResponseModel } from '../../../services/invoice-lines/models/invoice-line-response-model';
import { GenericOffCanvasDrawer } from '../../../components/generic-off-canvas-drawer/generic-off-canvas-drawer';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-delete-invoice-line',
  imports: [FormsModule, NgIf, GenericOffCanvasDrawer, Loader],
  templateUrl: './delete-invoice-line.html',
})
export class DeleteInvoiceLine {
  @ViewChild(GenericOffCanvasDrawer) drawer!: GenericOffCanvasDrawer;
  @Output() drawerClosed = new EventEmitter<void>();
  @Input() invoiceId!: string;

  line: InvoiceLineResponseModel | undefined;
  isChecked = false;
  isSubmitting = false;

  constructor(private invoiceLineService: InvoiceLineService) {}

  openDrawer(event: Event, line: InvoiceLineResponseModel) {
    this.line = line;
    this.isChecked = false;
    this.drawer.openDrawer(event);
  }

  deleteInvoiceLine() {
    if (!this.line || !this.isChecked) return;
    this.isSubmitting = true;
    this.invoiceLineService.delete(this.invoiceId, this.line.id).subscribe({
      next: () => {
        this.drawerClosed.emit();
        this.drawer.closeDrawer();
        this.isSubmitting = false;
        this.isChecked = false;
      },
      error: () => { this.isSubmitting = false; },
    });
  }
}
