import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import { CompanyService } from '../../services/companies/company.service';
import { CompanyResponseModel } from '../../services/companies/models/company-response-model';
import { PaginatedList } from '../../services/paginated-list';
import {
  GenericDatagrid,
  GenericDatagridColumns,
  GenericDatagridColumn,
  GenericDatagridRow,
  GenericDatagridCell,
} from '../../components/generic-datagrid/generic-datagrid';
import { CreateCompany } from './create-company/create-company';
import { DeleteCompany } from './delete-company/delete-company';
import { EditCompany } from './edit-company/edit-company';

@Component({
  selector: 'app-companies',
  imports: [
    NgFor,
    GenericDatagrid, GenericDatagridColumns, GenericDatagridColumn, GenericDatagridRow, GenericDatagridCell,
    CreateCompany, EditCompany, DeleteCompany,
  ],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Companies implements OnInit {
  
  selectedCompany: CompanyResponseModel | undefined;

  @ViewChild(CreateCompany) addCompanyDrawer!: CreateCompany;
  @ViewChild(EditCompany) editCompanyDrawer!: EditCompany;
  @ViewChild(DeleteCompany) deleteCompanyDrawer!: DeleteCompany;

  companies: PaginatedList<CompanyResponseModel> | undefined;
  currentPage = 1;
  pageSize = 12;

  constructor(
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (x) => {
        this.companies = x;
        this.cdr.markForCheck();
      }
    });
  }

  onNext(): void {
    if (this.companies?.hasNext) {
      this.currentPage++;
      this.loadCompanies();
    }
  }

  onPrevious(): void {
    if (this.companies?.hasPrevious) {
      this.currentPage--;
      this.loadCompanies();
    }
  }

  addCompany(event: Event) {
    event.stopPropagation();
    this.addCompanyDrawer.drawer.openDrawer(event);
  }

  editCompany(event: Event, company: CompanyResponseModel) {
    event.stopPropagation();
    this.selectedCompany = company;
    this.editCompanyDrawer.openDrawer(company);
    this.editCompanyDrawer.drawer.openDrawer(event);
  }

  deleteCompany(event: Event, company: CompanyResponseModel) {
    event.stopPropagation();
    this.selectedCompany = company;
    this.deleteCompanyDrawer.openDrawer(company);
    this.deleteCompanyDrawer.drawer.openDrawer(event);
  }

}
