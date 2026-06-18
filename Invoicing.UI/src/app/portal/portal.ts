import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { InvoiceService } from '../../services/invoices/invoice.service';
import { CustomerService } from '../../services/customers/customer.service';
import { CompanyService } from '../../services/companies/company.service';
import { InvoiceResponseModel } from '../../services/invoices/models/invoice-response-model';

@Component({
  selector: 'app-portal',
  imports: [NgIf, NgFor, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './portal.html',
  styleUrl: './portal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Portal implements OnInit {
  isLoading = true;
  now = new Date();

  invoices: InvoiceResponseModel[] = [];
  recentInvoices: InvoiceResponseModel[] = [];
  upcomingDueInvoices: InvoiceResponseModel[] = [];

  companiesCount = 0;
  customersCount = 0;

  totalRevenue = 0;
  outstandingAmount = 0;
  monthlyRevenue = 0;

  constructor(
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.isLoading = true;

    forkJoin({
      invoices: this.invoiceService.getAll(1, 200),
      customers: this.customerService.getAll(1, 1),
      companies: this.companyService.getAll(1, 1),
    }).subscribe({
      next: ({ invoices, customers, companies }) => {
        this.invoices = invoices.data;
        this.customersCount = customers.page * customers.pageSize + (customers.hasNext ? 0 : customers.data.length - customers.pageSize);
        this.companiesCount = companies.page * companies.pageSize + (companies.hasNext ? 0 : companies.data.length - companies.pageSize);

        const sortedByInvoiceDate = [...this.invoices].sort((a, b) => +new Date(b.invoiceDate) - +new Date(a.invoiceDate));
        this.recentInvoices = sortedByInvoiceDate.slice(0, 6);

        const today = new Date();
        const in14Days = new Date(today);
        in14Days.setDate(today.getDate() + 14);

        this.upcomingDueInvoices = [...this.invoices]
          .filter((x) => {
            const due = new Date(x.dueDate);
            return due >= today && due <= in14Days;
          })
          .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
          .slice(0, 5);

        this.totalRevenue = this.invoices.reduce((sum, i) => sum + i.totalIncludingVat, 0);
        this.outstandingAmount = this.invoices
          .filter((x) => new Date(x.dueDate) >= today)
          .reduce((sum, i) => sum + i.totalIncludingVat, 0);

        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        this.monthlyRevenue = this.invoices
          .filter((x) => {
            const d = new Date(x.invoiceDate);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
          })
          .reduce((sum, i) => sum + i.totalIncludingVat, 0);

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
