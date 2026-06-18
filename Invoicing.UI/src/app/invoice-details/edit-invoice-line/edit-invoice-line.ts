import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { InvoiceLineService } from '../../../services/invoice-lines/invoice-line.service';
import { InvoiceLineResponseModel } from '../../../services/invoice-lines/models/invoice-line-response-model';
import { UpdateInvoiceLineRequestModel } from '../../../services/invoice-lines/models/update-invoice-line-request-model';
import { GenericOffCanvasDrawer } from '../../../components/generic-off-canvas-drawer/generic-off-canvas-drawer';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-edit-invoice-line',
  imports: [ReactiveFormsModule, NgIf, GenericOffCanvasDrawer, Loader],
  templateUrl: './edit-invoice-line.html',
})
export class EditInvoiceLine implements OnDestroy {
  @ViewChild(GenericOffCanvasDrawer) drawer!: GenericOffCanvasDrawer;
  @Output() drawerClosed = new EventEmitter<void>();
  @Input() invoiceId!: string;

  line: InvoiceLineResponseModel | undefined;
  isSubmitting = false;
  private subs = new Subscription();

  formGroup = new FormGroup({
    description: new FormControl('', [Validators.required]),
    quantity: new FormControl<number>(1, [Validators.required, Validators.min(0)]),
    unit: new FormControl('', [Validators.required]),
    unitPrice: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    discountAmount: new FormControl<number>(0, [Validators.min(0)]),
    vatPercentage: new FormControl<number>(21, [Validators.required, Validators.min(0), Validators.max(100)]),
    total: new FormControl<number>({ value: 0, disabled: true }),
  });

  constructor(private invoiceLineService: InvoiceLineService) {
    this.subs.add(
      this.formGroup.valueChanges.subscribe(() => this.recalcTotal())
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openDrawer(event: Event, line: InvoiceLineResponseModel) {
    this.line = line;
    this.formGroup.patchValue(line, { emitEvent: false });
    this.recalcTotal();
    this.drawer.openDrawer(event);
  }

  private recalcTotal() {
    const { quantity, unitPrice, discountAmount, vatPercentage } = this.formGroup.getRawValue();
    const subtotal = (quantity ?? 0) * (unitPrice ?? 0) - (discountAmount ?? 0);
    const vat = subtotal * ((vatPercentage ?? 0) / 100);
    this.formGroup.get('total')!.setValue(Math.max(0, +(subtotal + vat).toFixed(2)), { emitEvent: false });
  }

  updateInvoiceLine() {
    if (!this.formGroup.valid || !this.line) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const raw = this.formGroup.getRawValue();
    this.invoiceLineService.update(this.invoiceId, this.line.id, raw as UpdateInvoiceLineRequestModel).subscribe({
      next: () => {
        this.drawerClosed.emit();
        this.drawer.closeDrawer();
        this.isSubmitting = false;
      },
      error: () => { this.isSubmitting = false; },
    });
  }
}
