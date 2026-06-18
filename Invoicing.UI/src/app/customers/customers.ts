import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import { CustomerService } from '../../services/customers/customer.service';
import { CustomerResponseModel } from '../../services/customers/models/customer-response-model';
import { PaginatedList } from '../../services/paginated-list';
import {
  GenericDatagrid,
  GenericDatagridColumns,
  GenericDatagridColumn,
  GenericDatagridRow,
  GenericDatagridCell,
} from '../../components/generic-datagrid/generic-datagrid';
import { CreateCustomer } from './create-customer/create-customer';
import { EditCustomer } from './edit-customer/edit-customer';
import { DeleteCustomer } from './delete-customer/delete-customer';

@Component({
  selector: 'app-customers',
  imports: [
    NgFor,
    GenericDatagrid, GenericDatagridColumns, GenericDatagridColumn, GenericDatagridRow, GenericDatagridCell,
    CreateCustomer, EditCustomer, DeleteCustomer,
  ],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Customers implements OnInit {

  selectedCustomer: CustomerResponseModel | undefined;

  @ViewChild(CreateCustomer) addCustomerDrawer!: CreateCustomer;
  @ViewChild(EditCustomer) editCustomerDrawer!: EditCustomer;
  @ViewChild(DeleteCustomer) deleteCustomerDrawer!: DeleteCustomer;

  customers: PaginatedList<CustomerResponseModel> | undefined;
  currentPage = 1;
  pageSize = 12;

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (x) => {
        this.customers = x;
        this.cdr.markForCheck();
      }
    });
  }

  onNext(): void {
    if (this.customers?.hasNext) {
      this.currentPage++;
      this.loadCustomers();
    }
  }

  onPrevious(): void {
    if (this.customers?.hasPrevious) {
      this.currentPage--;
      this.loadCustomers();
    }
  }

  addCustomer(event: Event) {
    event.stopPropagation();
    this.addCustomerDrawer.drawer.openDrawer(event);
  }

  editCustomer(event: Event, customer: CustomerResponseModel) {
    event.stopPropagation();
    this.selectedCustomer = customer;
    this.editCustomerDrawer.openDrawer(customer);
    this.editCustomerDrawer.drawer.openDrawer(event);
  }

  deleteCustomer(event: Event, customer: CustomerResponseModel) {
    event.stopPropagation();
    this.selectedCustomer = customer;
    this.deleteCustomerDrawer.openDrawer(customer);
    this.deleteCustomerDrawer.drawer.openDrawer(event);
  }

}
