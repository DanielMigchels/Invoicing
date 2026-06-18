import { Component, ChangeDetectorRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { InvoiceService } from '../../../services/invoices/invoice.service';
import { CompanyService } from '../../../services/companies/company.service';
import { CustomerService } from '../../../services/customers/customer.service';
import { CreateInvoiceRequestModel } from '../../../services/invoices/models/create-invoice-request-model';
import { CompanyResponseModel } from '../../../services/companies/models/company-response-model';
import { CustomerResponseModel } from '../../../services/customers/models/customer-response-model';
import { GenericOffCanvasDrawer } from '../../../components/generic-off-canvas-drawer/generic-off-canvas-drawer';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-create-invoice',
  imports: [ReactiveFormsModule, NgIf, NgFor, GenericOffCanvasDrawer, Loader],
  templateUrl: './create-invoice.html',
  styleUrl: './create-invoice.css',
})
export class CreateInvoice {
  @ViewChild(GenericOffCanvasDrawer) drawer!: GenericOffCanvasDrawer;
  @Output() drawerClosed = new EventEmitter();

  companies: CompanyResponseModel[] = [];
  customers: CustomerResponseModel[] = [];
  isSubmitting = false;

  formGroup = new FormGroup({
    invoiceNumber: new FormControl('', [Validators.required]),
    invoiceDate: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required]),
    companyId: new FormControl('', [Validators.required]),
    customerId: new FormControl('', [Validators.required]),
    currency: new FormControl('EUR', [Validators.required]),
    totalExcludingVat: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    vatAmount: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    totalIncludingVat: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
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

  openDrawer(event: Event) {
    this.formGroup.reset({ currency: 'EUR', totalExcludingVat: 0, vatAmount: 0, totalIncludingVat: 0 });
    this.loadDropdowns();
    this.drawer.openDrawer(event);
  }

  private loadDropdowns() {
    this.companyService.getAll(1, 100).subscribe({ next: (r) => { this.companies = r.data; this.cdr.detectChanges(); } });
    this.customerService.getAll(1, 100).subscribe({ next: (r) => { this.customers = r.data; this.cdr.detectChanges(); } });
  }

  createInvoice() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.invoiceService.create(this.formGroup.value as CreateInvoiceRequestModel).subscribe({
      next: () => {
        this.drawerClosed.emit();
        this.drawer.closeDrawer();
        this.isSubmitting = false;
      },
      error: () => { this.isSubmitting = false; }
    });
  }
}
