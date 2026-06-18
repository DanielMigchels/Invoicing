import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CompanyService } from '../../../services/companies/company.service';
import { CreateCompanyRequestModel } from '../../../services/companies/models/create-company-request-model';
import { GenericOffCanvasDrawer } from '../../../components/generic-off-canvas-drawer/generic-off-canvas-drawer';
import { Loader } from '../../../components/loader/loader';

@Component({
  selector: 'app-create-company',
  imports: [ReactiveFormsModule, NgIf, GenericOffCanvasDrawer, Loader],
  templateUrl: './create-company.html',
  styleUrl: './create-company.css',
})
export class CreateCompany {
  @ViewChild(GenericOffCanvasDrawer) drawer!: GenericOffCanvasDrawer;
  @Output() drawerClosed = new EventEmitter();

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

  createCompany() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.companyService.create(this.formGroup.value as CreateCompanyRequestModel).subscribe({
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
