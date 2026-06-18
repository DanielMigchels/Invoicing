import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CompanyService } from '../../../services/companies/company.service';
import { CompanyResponseModel } from '../../../services/companies/models/company-response-model';
import { GenericOffCanvasDrawer } from '../../../components/generic-off-canvas-drawer/generic-off-canvas-drawer';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-delete-company',
  imports: [FormsModule, NgIf, GenericOffCanvasDrawer, Loader],
  templateUrl: './delete-company.html',
  styleUrl: './delete-company.css',
})
export class DeleteCompany {
  @ViewChild(GenericOffCanvasDrawer) drawer!: GenericOffCanvasDrawer;
  @Output() drawerClosed = new EventEmitter();
  @Input() company: CompanyResponseModel | undefined;

  isChecked = false;
  isSubmitting = false;

  constructor(private companyService: CompanyService) { }

  openDrawer(company: CompanyResponseModel) {
    this.company = company;
    this.isChecked = false;
  }

  deleteCompany() {
    if (!this.company || !this.isChecked) return;

    this.isSubmitting = true;

    this.companyService.delete(this.company.id).subscribe({
      next: () => {
        this.drawerClosed.emit();
        this.drawer.closeDrawer();
        this.isSubmitting = false;
        this.isChecked = false;
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }
}
