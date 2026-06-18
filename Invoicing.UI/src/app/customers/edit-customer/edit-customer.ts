import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CustomerService } from '../../../services/customers/customer.service';
import { CustomerResponseModel } from '../../../services/customers/models/customer-response-model';
import { UpdateCustomerRequestModel } from '../../../services/customers/models/update-customer-request-model';
import { GenericOffCanvasDrawer } from '../../../components/generic-off-canvas-drawer/generic-off-canvas-drawer';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-edit-customer',
  imports: [ReactiveFormsModule, NgIf, GenericOffCanvasDrawer, Loader],
  templateUrl: './edit-customer.html',
  styleUrl: './edit-customer.css',
})
export class EditCustomer {
  @ViewChild(GenericOffCanvasDrawer) drawer!: GenericOffCanvasDrawer;
  @Output() drawerClosed = new EventEmitter();
  @Input() customer: CustomerResponseModel | undefined;

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    houseNumber: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    contactPerson: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null, [Validators.email]),
    phoneNumber: new FormControl<string | null>(null),
    vatNumber: new FormControl<string | null>(null),
  });

  isSubmitting = false;

  constructor(private customerService: CustomerService) { }

  openDrawer(customer: CustomerResponseModel) {
    this.customer = customer;
    this.formGroup.patchValue(customer);
  }

  updateCustomer() {
    if (!this.formGroup.valid || !this.customer) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.customerService.update(this.customer.id, this.formGroup.value as UpdateCustomerRequestModel).subscribe({
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
