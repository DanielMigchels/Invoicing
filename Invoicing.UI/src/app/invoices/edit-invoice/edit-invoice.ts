import { Component, ChangeDetectorRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { InvoiceService } from '../../../services/invoices/invoice.service';
import { CompanyService } from '../../../services/companies/company.service';
import { CustomerService } from '../../../services/customers/customer.service';
import { InvoiceResponseModel } from '../../../services/invoices/models/invoice-response-model';
import { UpdateInvoiceRequestModel } from '../../../services/invoices/models/update-invoice-request-model';
import { CompanyResponseModel } from '../../../services/companies/models/company-response-model';
import { CustomerResponseModel } from '../../../services/customers/models/customer-response-model';
import { GenericOffCanvasDrawer } from '../../../components/generic-off-canvas-drawer/generic-off-canvas-drawer';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-edit-invoice',
  imports: [ReactiveFormsModule, NgIf, NgFor, GenericOffCanvasDrawer, Loader],
  templateUrl: './edit-invoice.html',
  styleUrl: './edit-invoice.css',
})
export class EditInvoice {
  @ViewChild(GenericOffCanvasDrawer) drawer!: GenericOffCanvasDrawer;
  @Output() drawerClosed = new EventEmitter();
  @Input() invoice: InvoiceResponseModel | undefined;

  companies: CompanyResponseModel[] = [];
  customers: CustomerResponseModel[] = [];
  isSubmitting = false;

  formGroup = new FormGroup({
    invoiceNumber: new FormControl('', [Validators.required]),
    invoiceDate: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required]),
    companyId: new FormControl('', [Validators.required]),
    customerId: new FormControl('', [Validators.required]),
    currency: new FormControl('', [Validators.required]),
    vatExemptionReason: new FormControl<string | null>(null),
    paymentReference: new FormControl<string | null>(null),
    notes: new FormControl<string | null>(null),
  });

  constructor(
    private invoiceService: InvoiceService,
    private companyService: CompanyService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
  ) { }

  openDrawer(invoice: InvoiceResponseModel) {
    this.invoice = invoice;
    this.formGroup.patchValue(invoice);
    this.companyService.getAll(1, 100).subscribe({ next: (r) => { this.companies = r.data; this.cdr.detectChanges(); } });
    this.customerService.getAll(1, 100).subscribe({ next: (r) => { this.customers = r.data; this.cdr.detectChanges(); } });
  }

  updateInvoice() {
    if (!this.formGroup.valid || !this.invoice) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.invoiceService.update(this.invoice.id, this.formGroup.value as UpdateInvoiceRequestModel).subscribe({
      next: () => {
        this.drawerClosed.emit();
        this.formGroup.reset();
        this.drawer.closeDrawer();
        this.isSubmitting = false;
      },
      error: () => { this.isSubmitting = false; }
    });
  }
}
