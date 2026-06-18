import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CustomerService } from '../../../services/customers/customer.service';
import { CustomerResponseModel } from '../../../services/customers/models/customer-response-model';
import { GenericOffCanvasDrawer } from '../../../components/generic-off-canvas-drawer/generic-off-canvas-drawer';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-delete-customer',
  imports: [FormsModule, NgIf, GenericOffCanvasDrawer, Loader],
  templateUrl: './delete-customer.html',
  styleUrl: './delete-customer.css',
})
export class DeleteCustomer {
  @ViewChild(GenericOffCanvasDrawer) drawer!: GenericOffCanvasDrawer;
  @Output() drawerClosed = new EventEmitter();
  @Input() customer: CustomerResponseModel | undefined;

  isChecked = false;
  isSubmitting = false;

  constructor(private customerService: CustomerService) { }

  openDrawer(customer: CustomerResponseModel) {
    this.customer = customer;
    this.isChecked = false;
  }

  deleteCustomer() {
    if (!this.customer || !this.isChecked) return;
    this.isSubmitting = true;
    this.customerService.delete(this.customer.id).subscribe({
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
