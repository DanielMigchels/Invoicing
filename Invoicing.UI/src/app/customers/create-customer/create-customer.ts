import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CustomerService } from '../../../services/customers/customer.service';
import { CreateCustomerRequestModel } from '../../../services/customers/models/create-customer-request-model';
import { GenericOffCanvasDrawer } from '../../../components/generic-off-canvas-drawer/generic-off-canvas-drawer';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-create-customer',
  imports: [ReactiveFormsModule, NgIf, GenericOffCanvasDrawer, Loader],
  templateUrl: './create-customer.html',
  styleUrl: './create-customer.css',
})
export class CreateCustomer {
  @ViewChild(GenericOffCanvasDrawer) drawer!: GenericOffCanvasDrawer;
  @Output() drawerClosed = new EventEmitter();

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

  createCustomer() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.customerService.create(this.formGroup.value as CreateCustomerRequestModel).subscribe({
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
