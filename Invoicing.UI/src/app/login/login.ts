import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication-service';
import { LoginRequestModel } from '../../services/authentication/models/login-request-model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  rejected = false;

  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  
  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  login() {
    this.rejected = false;

    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.authenticationService.login(this.formGroup.value as LoginRequestModel).subscribe({
      next: response => {
        if (response.success) {
          this.authenticationService.setJwt(response.jwt);
          this.router.navigate(['/portal/invoices']);
        }
        else {
          this.rejected = true;
        }
      },
      error: error => {
        this.rejected = true;
      }
    }
    );
  }

}
