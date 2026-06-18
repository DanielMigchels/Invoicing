import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CompanyService } from '../../../services/companies/company.service';
import { CompanyResponseModel } from '../../../services/companies/models/company-response-model';
import { UpdateCompanyRequestModel } from '../../../services/companies/models/update-company-request-model';
import { GenericOffCanvasDrawer } from '../../../components/generic-off-canvas-drawer/generic-off-canvas-drawer';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-edit-company',
  imports: [ReactiveFormsModule, NgIf, GenericOffCanvasDrawer, Loader],
  templateUrl: './edit-company.html',
  styleUrl: './edit-company.css',
})
export class EditCompany {
  @ViewChild(GenericOffCanvasDrawer) drawer!: GenericOffCanvasDrawer;
  @Output() drawerClosed = new EventEmitter();
  @Input() company: CompanyResponseModel | undefined;

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    houseNumber: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required]),
    bankAccountNumber: new FormControl('', [Validators.required]),
    chamberOfCommerceNumber: new FormControl<string | null>(null),
    vatNumber: new FormControl<string | null>(null),
  });

  isSubmitting = false;

  constructor(private companyService: CompanyService) { }

  openDrawer(company: CompanyResponseModel) {
    this.company = company;
    this.formGroup.patchValue(company);
  }

  updateCompany() {
    if (!this.formGroup.valid || !this.company) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.companyService.update(this.company.id, this.formGroup.value as UpdateCompanyRequestModel).subscribe({
      next: () => {
        this.drawerClosed.emit();
        this.formGroup.reset();
        this.drawer.closeDrawer();
        this.isSubmitting = false;
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }
}
